    // ==========================================
    // NAVEGAÇÃO SOB DEMANDA (carrega capítulos aos poucos)
    // ==========================================
    let manifestDoma = null;
    let DOMA_BASE_HTML = "";
    let DOMA_CACHE_BUST = "";
    let paginasElementos = [];
    let capitulosCarregados = new Set();
    let capitulosCarregando = {};
    let pagAtiva = 0;
    let timerIdx = null;

    // Proteção contra bloqueio do Modo Anônimo do Chrome
    let maxPaginaAlcancada = 0;
    try { maxPaginaAlcancada = parseInt(localStorage.getItem('doma_max_pagina')) || 0; } catch(e) {}

    function domaIndexPorId(id) {
        if (!manifestDoma || !id) return -1;
        return manifestDoma.pages.findIndex(function (p) { return p.id === id; });
    }

    function domaAtivarScripts(container) {
        // innerHTML não executa <script> embutidos; recriamos cada um para forçar a execução.
        container.querySelectorAll('script').forEach(function (antigo) {
            const novo = document.createElement('script');
            for (const attr of antigo.attributes) novo.setAttribute(attr.name, attr.value);
            novo.textContent = antigo.textContent;
            antigo.replaceWith(novo);
        });
    }

    function domaCarregarCapitulo(chunkIndex) {
        if (capitulosCarregados.has(chunkIndex)) return Promise.resolve();
        if (capitulosCarregando[chunkIndex]) return capitulosCarregando[chunkIndex];

        const info = manifestDoma.chunks[chunkIndex];
        const p = fetch(DOMA_BASE_HTML + info.arquivo + DOMA_CACHE_BUST, { cache: "no-store" })
            .then(function (r) { return r.text(); })
            .then(function (html) {
                const wrapper = document.createElement('div');
                wrapper.setAttribute('data-doma-chunk', chunkIndex);
                wrapper.innerHTML = html;

                const root = document.getElementById('doma-app-wrapper') || document.getElementById('doma-root');
                root.appendChild(wrapper);

                const paginasDoChunk = wrapper.querySelectorAll('.doma-pagina');
                let cursor = 0;
                manifestDoma.pages.forEach(function (pg, globalIdx) {
                    if (pg.chunk === chunkIndex) {
                        paginasElementos[globalIdx] = paginasDoChunk[cursor];
                        cursor++;
                    }
                });

                domaAtivarScripts(wrapper);
                capitulosCarregados.add(chunkIndex);

                // Alguns scripts (antigos) fazem sua configuração dentro de um
                // listener de DOMContentLoaded, que já disparou há muito tempo.
                // O shim do loader guarda esses callbacks e os re-executa aqui,
                // agora que os elementos deste capítulo finalmente existem.
                if (typeof window.__domaRefireDCL === 'function') {
                    window.__domaRefireDCL();
                }
                document.dispatchEvent(new CustomEvent('doma:capitulo-carregado', {
                    detail: { chunkIndex: chunkIndex, startId: info.start_id }
                }));

                // Recalcula a altura na hora, em vez de esperar o próximo tick
                // do intervalo de 300ms — evita o "salto" perceptível bem na
                // troca de capítulo. Uma segunda chamada um pouco depois pega
                // imagens que ainda estavam carregando e mudaram a altura.
                if (typeof reportarAlturaParaWix === 'function') {
                    reportarAlturaParaWix();
                    setTimeout(reportarAlturaParaWix, 250);
                }
            })
            .catch(function (err) {
                console.error("Falha ao carregar capítulo " + chunkIndex, err);
            });

        capitulosCarregando[chunkIndex] = p;
        return p;
    }

    function domaGarantirPagina(globalIdx) {
        if (!manifestDoma || globalIdx < 0 || globalIdx >= manifestDoma.pages.length) {
            return Promise.resolve(null);
        }
        const chunkIdx = manifestDoma.pages[globalIdx].chunk;
        return domaCarregarCapitulo(chunkIdx).then(function () { return paginasElementos[globalIdx]; });
    }

    function atualizarVisualSumario() {
        const itens = document.querySelectorAll('.item-sumario');
        itens.forEach(function (item) {
            const alvoId = item.getAttribute('data-alvo');
            let alvoIndex = domaIndexPorId(alvoId);
            if (alvoIndex === -1) alvoIndex = 999999;

            if (alvoId === 'pag-3' || alvoId === 'pag-roleta' || maxPaginaAlcancada >= alvoIndex) {
                item.classList.remove('sumario-item-travado');
            } else {
                item.classList.add('sumario-item-travado');
            }
        });
    }

    // Proteção de memória para o Modo Anônimo
    let isUsuarioPremium = false;
    try { isUsuarioPremium = localStorage.getItem('acesso_vip_doma_liberado') === 'true'; } catch(e) {}

    // FUNÇÃO QUE TRANSFORMA A TELA SE ELE FOR PAGO
    function atualizarBotoesVIP() {
        let btnComprar = document.getElementById('box-comprar-vip');
        let btnAvancar = document.getElementById('box-avancar-vip');
        let tituloVip = document.getElementById('titulo-vip-slide');
        let textoVip = document.getElementById('texto-vip-slide');
        let badgeVip = document.getElementById('badge-vip-slide');
        
        if (isUsuarioPremium) {
            if(btnComprar) btnComprar.style.display = 'none';
            if(btnAvancar) btnAvancar.style.display = 'block';
            if(tituloVip) tituloVip.innerHTML = "Bem-vindo de volta,<br><span style='color: #10b981;'>Domador!</span>";
            if(textoVip) textoVip.innerHTML = "O seu passe VIP está ativo. A verdadeira transformação e os exercícios profundos da Clínica dos Monstros aguardam você nas próximas páginas.";
            if(badgeVip) {
                badgeVip.style.background = "#10b981";
                badgeVip.innerHTML = "ACESSO OK ✅";
            }
        }
    }

    // OUVINDO A LIBERAÇÃO DO WIX
    // NOVO: Ouve as mensagens secretas vindas do Wix
    window.addEventListener('message', function(event) {
        if (event.data && event.data.acao === 'liberarAcessoVIP') {
            isUsuarioPremium = true;
            // Salva no navegador
            localStorage.setItem('acesso_vip_doma_liberado', 'true'); 
            atualizarBotoesVIP();
        }
        
        // A MÁGICA PARA OS SEUS TESTES FUNCIONAREM: Apaga a memória e tranca a porta
        if (event.data && event.data.acao === 'bloquearAcessoVIP') {
            isUsuarioPremium = false;
            localStorage.removeItem('acesso_vip_doma_liberado'); // Destrói o VIP da memória
            
            // Restaura o visual da porta trancada
            let btnComprar = document.getElementById('box-comprar-vip');
            let btnAvancar = document.getElementById('box-avancar-vip');
            let tituloVip = document.getElementById('titulo-vip-slide');
            let textoVip = document.getElementById('texto-vip-slide');
            let badgeVip = document.getElementById('badge-vip-slide');
            
            if(btnComprar) btnComprar.style.display = 'block';
            if(btnAvancar) btnAvancar.style.display = 'none';
            if(tituloVip) tituloVip.innerHTML = "O Convite para a<br><span style='color: #ea580c;'>Verdadeira Travessia</span>";
            if(textoVip) textoVip.innerHTML = "Tudo o que você viu até aqui foi um presente. O resultado do exercício anterior e a <b>verdadeira transformação</b>, junto com os exercícios profundos e o acesso total à Clínica dos Monstros estão nas próximas páginas do Livro Digital Completo.";
            if(badgeVip) {
                badgeVip.style.background = "#f59e0b";
                badgeVip.innerHTML = "ACESSO VIP 🔑";
            }
        }
    });

    // Chamado pelo loader do Wix depois que o manifest, o capítulo inicial e
    // este próprio core.js já estiverem prontos.
    window.__domaBootstrap = async function (manifest, baseHtmlUrl, cacheBust) {
        manifestDoma = manifest;
        DOMA_BASE_HTML = baseHtmlUrl;
        DOMA_CACHE_BUST = cacheBust || "";
        await domaCarregarCapitulo(0);
        atualizarBotoesVIP();
        try { window.parent.postMessage({ acao: 'htmlPronto' }, "*"); } catch(e) {}
        atualizarVisibilidadeSeta();
        atualizarVisualSumario();
    };

    // Criamos uma variável global de controle para o Teste 1
    window.teste1Concluido = false;
    window.teste2Concluido = false;
    window.teste3Concluido = false;
    window.lagoLiberado = false;
    window.triagemIniciada = false;

    function atualizarVisibilidadeSeta() {
        let setaEsq = document.querySelector('.seta-esq');
        let setaDir = document.querySelector('.seta-dir');

        let idAtual = manifestDoma && manifestDoma.pages[pagAtiva] ? manifestDoma.pages[pagAtiva].id : null;

        // 1. Controle da Seta Esquerda (Ocultar na Página Inicial OU no Retrato Falado)
        if (setaEsq) {
            if (pagAtiva === 0 || idAtual === 'retrato-falado') {
                setaEsq.style.display = 'none';
            } else {
                setaEsq.style.display = 'flex';
            }
        }

        // 2. Controle da Seta Direita (Travas do Caminho)
        if (setaDir) {
            let mostrarSetaDir = true; // Por padrão, a seta aparece

            // Trava A: No slide "O Próximo Nível" (pag-proximo-nivel)
            if (idAtual === 'pag-proximo-nivel') {
                let indexMapaFinal = domaIndexPorId('pag-mapa-final');
                if (indexMapaFinal === -1 || maxPaginaAlcancada < indexMapaFinal) mostrarSetaDir = false;
            }

            // Trava B: No slide do Primeiro Teste Rápido (pag-21)
            if (idAtual === 'pag-21') {
                if (!window.teste1Concluido) mostrarSetaDir = false;
            }

            // Trava C: No slide Nossa Caixa de Ferramentas (Azul)
            if (idAtual === 'pag-ferramentas-azul') {
                if (!window.verificarTodasFerramentasLidas || !window.verificarTodasFerramentasLidas()) mostrarSetaDir = false;
            }

            // Trava D: No slide Nossa Caixa de Ferramentas da Clínica (Rosa)
            if (idAtual === 'pag-ferramentas-rosa') {
                if (!window.verificarTodasFerramentasRosaLidas || !window.verificarTodasFerramentasRosaLidas()) mostrarSetaDir = false;
            }

            // Trava E: No slide do Segundo Teste Rápido (pag-25)
            if (idAtual === 'pag-25') {
                if (!window.teste2Concluido) mostrarSetaDir = false;
            }

            // Trava F: No slide Nossa Caixa de Produtos (Exclusividade Doma)
            if (idAtual === 'pag-produtos-exclusivos') {
                if (!window.produtosLidos || !window.produtosLidos.livro || !window.produtosLidos.carteira) mostrarSetaDir = false;
            }

            // Trava G: No slide do Lago (O Ilusionista / Papel de Pão)
            if (idAtual === 'pag-26') {
                if (!window.lagoLiberado) mostrarSetaDir = false;
            }

            // Trava H: Na tela de iniciar a triagem
            if (idAtual === 'slide-intro-14') {
                if (!window.triagemIniciada) mostrarSetaDir = false;
            }

            // Trava I: No slide do Terceiro Teste Rápido (pag-teste-3)
            if (idAtual === 'pag-teste-3') {
                if (!window.teste3Concluido) mostrarSetaDir = false;
            }

            // Trava J: No slide do Retrato Falado (Bloqueio total de navegação)
            if (idAtual === 'retrato-falado') {
                mostrarSetaDir = false;
            }

            // Aplica a regra final
            if (mostrarSetaDir) {
                setaDir.style.display = 'flex';
            } else {
                setaDir.style.display = 'none';
            }
        }
    }

    async function mudarPagina(dir) {
        if (!manifestDoma) return;
        const total = manifestDoma.pages.length;

        // --- INÍCIO DA TRAVA VIP DE SEGURANÇA ---
        let indexTribunal = domaIndexPorId('pag-tribunal-intro');
        if (indexTribunal === -1) indexTribunal = total;

        let proximaPagina = (pagAtiva + dir + total) % total;

        if (proximaPagina >= indexTribunal && !isUsuarioPremium) {
            document.getElementById('slide-paywall-vip').style.display = 'flex';
            return;
        }
        // --- FIM DA TRAVA VIP ---

        const elementoAtual = paginasElementos[pagAtiva];
        const elementoAlvo = await domaGarantirPagina(proximaPagina);
        if (!elementoAlvo) return;

        if (elementoAtual) {
            elementoAtual.classList.remove('ativa');
            elementoAtual.style.display = '';
        }
        pagAtiva = proximaPagina;
        elementoAlvo.classList.add('ativa');
        elementoAlvo.scrollTop = 0;
        atualizarVisibilidadeSeta();

        // CORREÇÃO APLICADA: O progresso SÓ É SALVO se a página não for um Sumário!
        let idAtual = manifestDoma.pages[pagAtiva].id;
        if (idAtual !== 'pag-mapa-final' && idAtual !== 'pag-sumario' && idAtual !== 'pag-mapa-travessia') {
            if (pagAtiva > maxPaginaAlcancada) {
                maxPaginaAlcancada = pagAtiva;
                localStorage.setItem('doma_max_pagina', maxPaginaAlcancada);
            }
        }
        atualizarVisualSumario();
        if (typeof reportarAlturaParaWix === 'function') {
            reportarAlturaParaWix();
            setTimeout(reportarAlturaParaWix, 250);
        }
    }

    async function irParaTela(idAlvo) {
        if (!manifestDoma) return;
        const total = manifestDoma.pages.length;

        let indexTribunal = domaIndexPorId('pag-tribunal-intro');
        if (indexTribunal === -1) indexTribunal = total;

        let alvoIndex = domaIndexPorId(idAlvo);
        if (alvoIndex === -1) return; // id desconhecido: nada a fazer

        // --- NOVA TRAVA JAVASCRIPT: IMPEDE A ABERTURA DE ITENS AINDA NÃO ALCANÇADOS ---
        if (idAlvo !== 'pag-3' && idAlvo !== 'pag-roleta' && alvoIndex > maxPaginaAlcancada) {
            return; // Corta a ação na raiz. Mesmo que clique, não abre!
        }

        if (alvoIndex >= indexTribunal && !isUsuarioPremium) {
            document.getElementById('slide-paywall-vip').style.display = 'flex';
            return;
        }

        const elementoAtual = paginasElementos[pagAtiva];
        const elementoAlvo = await domaGarantirPagina(alvoIndex);
        if (!elementoAlvo) return;

        if (elementoAtual) {
            elementoAtual.classList.remove('ativa');
            elementoAtual.style.display = '';
        }
        pagAtiva = alvoIndex;
        elementoAlvo.classList.add('ativa');
        elementoAlvo.scrollTop = 0;
        atualizarVisibilidadeSeta();

        // CORREÇÃO APLICADA: Evita o bug de pontuação do menu
        let idAtual = manifestDoma.pages[pagAtiva].id;
        if (idAtual !== 'pag-mapa-final' && idAtual !== 'pag-sumario' && idAtual !== 'pag-mapa-travessia') {
            if (pagAtiva > maxPaginaAlcancada) {
                maxPaginaAlcancada = pagAtiva;
                localStorage.setItem('doma_max_pagina', maxPaginaAlcancada);
            }
        }
        atualizarVisualSumario();
        if (typeof reportarAlturaParaWix === 'function') {
            reportarAlturaParaWix();
            setTimeout(reportarAlturaParaWix, 250);
        }
    }

