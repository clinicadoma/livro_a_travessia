// =====================================================================
// NÍVEIS DA TRAVESSIA + PROGRESSO SALVO NA CONTA
//
// Carregado pelo wix-loader.html ANTES do core.js. Faz três coisas:
//  1) Busca no Wix o progresso do membro (chaves doma_* do livro) e grava
//     no localStorage antes do livro iniciar, para ele "acordar" no ponto
//     certo em qualquer aparelho.
//  2) Copia para a conta, automaticamente, toda gravação de chave doma_*.
//  3) Trava a navegação no fim do nível liberado. Cada nível corresponde
//     a um mês pago do plano (o Nível 1 é a Travessia, fora do livro).
//
// Mensagens com o código da página do livro no Wix:
//   livro -> Wix: livroPedirProgresso | livroSalvarChaves | livroConcluirNivel | planosPreco
//   Wix -> livro: livroProgresso
// =====================================================================
(function () {
    // ------------------------------------------------------------------
    // MAPA DOS NÍVEIS: página (id do manifest.json) onde cada nível começa.
    // O nível termina na página anterior ao começo do próximo.
    // Os Níveis 5 a 11 ainda serão escritos: quando existirem, basta
    // acrescentar uma linha aqui com a página de início de cada um.
    // ------------------------------------------------------------------
    var NIVEIS = [
        { nivel: 2,  inicio: 'pag-1' },              // início do livro até Triagem de Vida
        { nivel: 3,  inicio: 'pag-25-b' },           // Quem é o Domador? até Diagnóstico Profundo
        { nivel: 4,  inicio: 'pag-tribunal-intro' }, // Tribunal Interno até Uma Carta ao Domador
        { nivel: 12, inicio: 'pag-tesouro' }         // Tesouro, Jornada de Insights e Final
    ];
    var PREFIXO = 'doma_';
    var TEMPO_MAXIMO_ESPERA = 6000;

    var dentroDoWix = window.parent && window.parent !== window;
    var estado = null;          // resposta do Wix (nível liberado, concluídos, meses...)
    var sincronizando = false;  // evita reenviar o que acabou de chegar do Wix
    var timerSync = null;
    var manifestRef = null;
    var concluindo = {};

    function modoTeste() { return !!window.__domaModoTeste; }

    function enviar(msg) {
        if (!dentroDoWix) return;
        try { window.parent.postMessage(msg, '*'); } catch (e) {}
    }

    // ---------------- chaves do livro ----------------
    function lerChavesLocais() {
        var chaves = {};
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && k.indexOf(PREFIXO) === 0) chaves[k] = localStorage.getItem(k);
            }
        } catch (e) {}
        return chaves;
    }

    function gravarChaves(chaves) {
        sincronizando = true;
        try {
            Object.keys(lerChavesLocais()).forEach(function (k) {
                if (!(k in chaves)) localStorage.removeItem(k);
            });
            Object.keys(chaves).forEach(function (k) {
                if (k.indexOf(PREFIXO) === 0 && chaves[k] !== null && chaves[k] !== undefined) {
                    localStorage.setItem(k, String(chaves[k]));
                }
            });
        } catch (e) {}
        sincronizando = false;
    }

    function agendarSync() {
        if (sincronizando || !estado || !estado.logado) return;
        clearTimeout(timerSync);
        timerSync = setTimeout(function () {
            timerSync = null;
            enviar({ acao: 'livroSalvarChaves', chaves: lerChavesLocais() });
        }, 1500);
    }

    // Toda gravação de uma chave doma_* vai também para a conta
    try {
        var setOriginal = Storage.prototype.setItem;
        var removeOriginal = Storage.prototype.removeItem;
        Storage.prototype.setItem = function (k, v) {
            setOriginal.call(this, k, v);
            if (this === window.localStorage && String(k).indexOf(PREFIXO) === 0) agendarSync();
        };
        Storage.prototype.removeItem = function (k) {
            removeOriginal.call(this, k);
            if (this === window.localStorage && String(k).indexOf(PREFIXO) === 0) agendarSync();
        };
    } catch (e) {}

    function enviarPendente() {
        if (timerSync) {
            clearTimeout(timerSync);
            timerSync = null;
            enviar({ acao: 'livroSalvarChaves', chaves: lerChavesLocais() });
        }
    }
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') enviarPendente();
    });
    window.addEventListener('pagehide', enviarPendente);

    // ---------------- mensagens do Wix ----------------
    var resolverPreparo = null;
    window.addEventListener('message', function (event) {
        var d = event.data;
        if (!d || d.acao !== 'livroProgresso') return;
        var primeira = !estado;
        estado = d;
        if (primeira) {
            if (d.chaves && Object.keys(d.chaves).length) {
                gravarChaves(d.chaves);
            } else if (d.logado) {
                // Primeira vez com a conta: leva o progresso que já estava no aparelho
                setTimeout(function () { enviar({ acao: 'livroSalvarChaves', chaves: lerChavesLocais() }); }, 500);
            }
            if (resolverPreparo) resolverPreparo();
        } else {
            atualizarAvisoInicial();
        }
    });

    // Chamado pelo loader antes de injetar o core.js
    function preparar() {
        return new Promise(function (resolve) {
            if (!dentroDoWix) { resolve(); return; }
            resolverPreparo = resolve;
            // Repete o pedido: o código da página do Wix pode ainda não estar ouvindo
            var tentativas = 0;
            (function pedir() {
                if (estado || tentativas++ > 6) return;
                enviar({ acao: 'livroPedirProgresso' });
                setTimeout(pedir, 1000);
            })();
            setTimeout(resolve, TEMPO_MAXIMO_ESPERA); // o Wix não respondeu: segue com o aparelho
        });
    }

    // ---------------- regras de nível ----------------
    function indicePorId(id) {
        if (!manifestRef) return -1;
        for (var i = 0; i < manifestRef.pages.length; i++) if (manifestRef.pages[i].id === id) return i;
        return -1;
    }

    function faixas() {
        var lista = NIVEIS.map(function (n) { return { nivel: n.nivel, inicio: indicePorId(n.inicio) }; })
            .filter(function (n) { return n.inicio >= 0; })
            .sort(function (a, b) { return a.inicio - b.inicio; });
        lista.forEach(function (n, i) {
            n.fim = (i + 1 < lista.length) ? lista[i + 1].inicio - 1 : manifestRef.pages.length - 1;
        });
        return lista;
    }

    function nivelDaPagina(idx) {
        var f = faixas();
        for (var i = 0; i < f.length; i++) if (idx >= f[i].inicio && idx <= f[i].fim) return f[i];
        return null;
    }

    function nivelLiberado() {
        if (modoTeste()) return 12;
        return (estado && estado.nivelLiberado) || 1;
    }

    function concluido(n) {
        return !!(estado && estado.niveisConcluidos && estado.niveisConcluidos[n]);
    }

    function dataCurta(iso) {
        try {
            var d = new Date(iso);
            return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
        } catch (e) { return ''; }
    }

    // Monta a mensagem certa para um nível fechado
    function motivoBloqueio(nivelAlvo) {
        if (!estado) {
            return { titulo: 'Não conseguimos confirmar seu acesso', texto: 'Verifique sua conexão e recarregue a página.' };
        }
        if (!estado.logado) {
            return { titulo: 'Entre na sua conta', texto: 'Para continuar a Travessia, entre na sua conta da Clínica Doma.' };
        }
        if (!estado.nivel1Concluido) {
            return { titulo: 'Comece pelo Nível 1', texto: 'Conclua a Travessia inicial (Nível 1) para abrir o livro.' };
        }
        if (!estado.planoAtivo) {
            return { titulo: 'O Nível ' + nivelAlvo + ' é para assinantes', texto: 'Assine um plano para liberar o Nível ' + nivelAlvo + ' da Travessia.', planos: true };
        }
        // Nível anterior ainda não escrito (5 a 11)
        var anterior = nivelAlvo - 1;
        var existeAnterior = NIVEIS.some(function (n) { return n.nivel === anterior; });
        if (anterior >= 2 && !existeAnterior) {
            return { titulo: 'Novos níveis em breve', texto: 'Você concluiu todos os níveis disponíveis até agora. Os próximos estão sendo preparados com carinho.' };
        }
        if (anterior >= 2 && !concluido(anterior)) {
            return { titulo: 'Conclua o Nível ' + anterior, texto: 'Termine o Nível ' + anterior + ' para seguir em frente.' };
        }
        if ((estado.mesesPagos || 0) < nivelAlvo - 1) {
            var quando = estado.proximaRenovacao ? ' (em ' + dataCurta(estado.proximaRenovacao) + ')' : '';
            return { titulo: 'Nível ' + anterior + ' concluído! 🎉', texto: 'O Nível ' + nivelAlvo + ' abre na próxima renovação do seu plano' + quando + '. Até lá, aproveite para revisitar o que já conquistou.' };
        }
        return { titulo: 'Nível ' + nivelAlvo + ' ainda fechado', texto: 'Recarregue a página em instantes.' };
    }

    // ---------------- aviso (modal) ----------------
    function mostrarAviso(m, fixo) {
        var el = document.getElementById('doma-aviso-nivel');
        if (!el) {
            el = document.createElement('div');
            el.id = 'doma-aviso-nivel';
            el.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,0.85);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Quicksand,Montserrat,sans-serif;';
            document.body.appendChild(el);
        }
        el.innerHTML = '';
        var caixa = document.createElement('div');
        caixa.style.cssText = 'background:#fff;border-radius:20px;max-width:380px;width:100%;padding:30px 24px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.3);';
        var t = document.createElement('h3');
        t.style.cssText = 'margin:0 0 12px;color:#1e293b;font-size:1.3rem;font-weight:900;';
        t.textContent = m.titulo;
        var p = document.createElement('p');
        p.style.cssText = 'margin:0 0 22px;color:#475569;line-height:1.6;';
        p.textContent = m.texto;
        caixa.appendChild(t); caixa.appendChild(p);
        if (m.planos) {
            var b = document.createElement('button');
            b.textContent = 'VER PLANOS';
            b.style.cssText = 'display:block;width:100%;margin-bottom:10px;padding:15px;border:none;border-radius:14px;background:#f59e0b;color:#fff;font-weight:900;font-size:1rem;cursor:pointer;';
            b.onclick = function () { enviar({ acao: 'planosPreco' }); };
            caixa.appendChild(b);
        }
        if (!fixo) {
            var f = document.createElement('button');
            f.textContent = 'OK';
            f.style.cssText = 'display:block;width:100%;padding:13px;border:1px solid #cbd5e1;border-radius:14px;background:#f8fafc;color:#334155;font-weight:800;cursor:pointer;';
            f.onclick = function () { el.style.display = 'none'; };
            caixa.appendChild(f);
        }
        el.appendChild(caixa);
        el.style.display = 'flex';
    }

    function esconderAviso() {
        var el = document.getElementById('doma-aviso-nivel');
        if (el) el.style.display = 'none';
    }

    // ---------------- ganchos chamados pelo core.js ----------------
    // Antes de trocar de página: false = bloqueia (e mostra o motivo)
    function podeIrPara(idx, manifest) {
        manifestRef = manifest || manifestRef;
        if (modoTeste()) return true;
        var n = nivelDaPagina(idx);
        if (!n) return true;
        if (n.nivel <= nivelLiberado()) return true;
        mostrarAviso(motivoBloqueio(n.nivel), false);
        return false;
    }

    // Depois de trocar de página: chegou à última página do nível = concluído
    function entrouNaPagina(idx, manifest) {
        manifestRef = manifest || manifestRef;
        var n = nivelDaPagina(idx);
        if (!n || idx !== n.fim || concluido(n.nivel) || concluindo[n.nivel]) return;
        concluindo[n.nivel] = true;
        enviar({ acao: 'livroConcluirNivel', nivel: n.nivel });
    }

    // Logo depois do livro iniciar: a página inicial também precisa estar liberada
    var avisoInicialAtivo = false;
    function depoisDoBoot(manifest) {
        manifestRef = manifest || manifestRef;
        atualizarAvisoInicial();
    }
    function atualizarAvisoInicial() {
        if (!manifestRef || modoTeste() || !dentroDoWix) return;
        var n = nivelDaPagina(0);
        if (n && n.nivel > nivelLiberado()) {
            avisoInicialAtivo = true;
            mostrarAviso(motivoBloqueio(n.nivel), true);
        } else if (avisoInicialAtivo) {
            avisoInicialAtivo = false;
            esconderAviso();
        }
    }

    window.DomaNiveis = {
        preparar: preparar,
        podeIrPara: podeIrPara,
        entrouNaPagina: entrouNaPagina,
        depoisDoBoot: depoisDoBoot,
        nivelDaPagina: function (idx) { return nivelDaPagina(idx); },
        estado: function () { return estado; }
    };
})();
