
(function() {
    document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btn-player-2');
    const musica = document.getElementById('musica-doma-2');
    const disco = document.getElementById('disco-2');
    const agulha = document.getElementById('agulha-2');
    const icone = document.getElementById('icone-play-2');

    if (btn && musica) {
        let tocando = false;
        btn.addEventListener('click', () => {
            if (!tocando) {
                tocando = true;
                disco.classList.add('girando');
                agulha.classList.add('na-posicao');
                icone.innerText = '⏸';
                btn.innerHTML = '⏸ Pausar Travessia';
                try { musica.play(); } catch(e) {}
            } else {
                tocando = false;
                disco.classList.remove('girando');
                agulha.classList.remove('na-posicao');
                icone.innerText = '▶';
                btn.innerHTML = '▶ Tocar';
                try { musica.pause(); } catch(e) {}
            }
        });

        musica.addEventListener('ended', () => {
            tocando = false;
            disco.classList.remove('girando');
            agulha.classList.remove('na-posicao');
            icone.innerText = '▶';
            btn.innerHTML = '▶ Ouvir Novamente';
            
            document.getElementById('container-vitrola-2').style.display = 'none';
            document.querySelector('.texto-suspense').style.display = 'none';
            document.getElementById('quiz-recompensa-2').style.display = 'block';
        });
    }
    });

    window.verificarResposta2 = function(perguntaNum, ehCorreta, botaoClicado, eventoC) {
        if (!ehCorreta) {
            botaoClicado.style.backgroundColor = '#ffcccc'; 
            botaoClicado.style.borderColor = '#ff0000';
            if(!botaoClicado.innerHTML.includes('Reflita')) {
                botaoClicado.innerHTML += ' <em>(Reflita mais um pouco...)</em>';
            }
            return;
        }
        
        botaoClicado.style.backgroundColor = '#d4edda';
        botaoClicado.style.borderColor = '#28a745';
        botaoClicado.style.pointerEvents = 'none';
        
        // A MÁGICA REAL: Chama a sua função oficial que já existe no seu site!
        if (typeof ganharMoedas === 'function') {
            ganharMoedas(5, eventoC);
        } else {
            console.log("Sistema de moedas aguardando conexão...");
        }
        
        setTimeout(() => {
            if (perguntaNum === 1) {
                document.getElementById('pergunta-1-2').style.display = 'none';
                document.getElementById('pergunta-2-2').style.display = 'block';
            } else if (perguntaNum === 2) {
                document.getElementById('pergunta-2-2').style.display = 'none';
                document.getElementById('recompensa-final-2').style.display = 'block';
                chuvaDeConfetes();
            }
        }, 1200); 
    };

    // FUNÇÃO ADICIONADA: Faltava essa função no seu código para o Teste Rápido do Slide Final!
    window.verificarQuizIntro = function(botaoClicado, ehCorreta, moedas, quizId) {
        if (!ehCorreta) {
            botaoClicado.style.backgroundColor = '#ffcccc';
            botaoClicado.style.borderColor = '#ff0000';
            if(!botaoClicado.innerHTML.includes('Reflita')) {
                botaoClicado.innerHTML += ' <br><em style="color:#d32f2f; font-size:0.9rem;">(Essa fuga não ajuda... tente a outra opção!)</em>';
            }
        } else {
            botaoClicado.style.backgroundColor = '#d4edda';
            botaoClicado.style.borderColor = '#28a745';
            botaoClicado.style.pointerEvents = 'none';

            // Entrega as moedas
            if (typeof ganharMoedas === 'function') {
                ganharMoedas(moedas, event);
            }

            // Desativa o outro botão irmão para evitar múltiplos cliques
            let irmao = botaoClicado.id.includes('-a') ? document.getElementById('btn-teste-' + quizId + '-b') : document.getElementById('btn-teste-' + quizId + '-a');
            if(irmao) irmao.style.pointerEvents = 'none';

            // Efeito visual de sucesso
            setTimeout(() => {
                botaoClicado.innerHTML += ' <br><strong style="color:#15803d; font-size:1.1rem;">✅ Exato! Moedas Adicionadas!</strong>';
                if (typeof chuvaDeConfetes === 'function') chuvaDeConfetes();
                
                // === LÓGICA NOVA: DESTRAVAR O TESTE 1 ===
                if (quizId === 1) {
                    window.teste1Concluido = true;
                    // Exibe o botão de Continuar laranja abaixo do teste
                    let btnContinuar = document.getElementById('btn-continuar-teste-1');
                    if (btnContinuar) btnContinuar.style.display = 'block';
                    // Reavalia a seta lateral para ela voltar a aparecer
                    if (typeof atualizarVisibilidadeSeta === 'function') atualizarVisibilidadeSeta();
                }

                // === ADIÇÃO: DESTRAVAR O TESTE 2 ===
                if (quizId === 2) {
                    window.teste2Concluido = true; // Avisa que passou
                    // Exibe o botão de Continuar laranja abaixo do teste 2
                    let btnContinuar2 = document.getElementById('btn-continuar-teste-2');
                    if (btnContinuar2) btnContinuar2.style.display = 'block';
                    // Reavalia a seta lateral para ela voltar a aparecer
                    if (typeof atualizarVisibilidadeSeta === 'function') atualizarVisibilidadeSeta();
                }

                // === ADIÇÃO: DESTRAVAR O TESTE 3 ===
                if (quizId === 3) {
                    window.teste3Concluido = true;
                    let btnContinuar3 = document.getElementById('btn-continuar-teste-3');
                    if (btnContinuar3) btnContinuar3.style.display = 'block';
                    if (typeof atualizarVisibilidadeSeta === 'function') atualizarVisibilidadeSeta();
                }
                
            }, 500);
        }
    };

    // Controle das ferramentas rosas lidas
    window.ferramentasRosaLidas = {
        arteterapia: false,
        jogos: false,
        bambole: false,
        crianca: false,
        escrita: false
    };

    function verificarTodasFerramentasRosaLidas() {
        return window.ferramentasRosaLidas.arteterapia && 
               window.ferramentasRosaLidas.jogos && 
               window.ferramentasRosaLidas.bambole && 
               window.ferramentasRosaLidas.crianca && 
               window.ferramentasRosaLidas.escrita;
    }

    window.marcarFerramentaRosaLida = function(id) {
        // Marca o item específico como lido
        window.ferramentasRosaLidas[id] = true;

        // Atualiza o visual do item clicado para mostrar "LIDO ✅"
        let statusSpan = document.getElementById('status-ferramenta-rosa-' + id);
        let divFerramenta = document.getElementById('ferramenta-rosa-' + id);
        
        if (statusSpan) {
            statusSpan.innerHTML = 'LIDO ✅';
            statusSpan.style.backgroundColor = '#fbcfe8'; // Tom de rosa mais forte
            statusSpan.style.color = '#be185d';
        }
        
        if (divFerramenta) {
            divFerramenta.style.borderColor = '#db2777'; // Borda rosa escura
        }

        // Se todas as 5 ferramentas rosas foram lidas, libera o avanço
        if (verificarTodasFerramentasRosaLidas()) {
            let btnContinuarRosa = document.getElementById('btn-continuar-ferramentas-rosa');
            if (btnContinuarRosa) btnContinuarRosa.style.display = 'block';
            
            if (typeof atualizarVisibilidadeSeta === 'function') {
                atualizarVisibilidadeSeta();
            }
        }
    };

    // Controle das ferramentas lidas
    window.ferramentasLidas = {
        psicanalise: false,
        hipnose: false,
        mindfulness: false
    };

    function verificarTodasFerramentasLidas() {
        return window.ferramentasLidas.psicanalise && 
               window.ferramentasLidas.hipnose && 
               window.ferramentasLidas.mindfulness;
    }

// 1. Variável para controlar o que foi lido
window.produtosLidos = {
    livro: false,
    carteira: false
};

// 2. Função que muda a cor e libera o botão
window.marcarProdutoLido = function(id) {
    window.produtosLidos[id] = true;

    // Puxa os elementos que vão mudar de cor
    let statusSpan = document.getElementById('status-produto-' + id);
    let divProduto = document.getElementById('item-produto-' + id);
    
    // Atualiza o texto para LIDO e muda as cores para verde (indicando sucesso)
    if (statusSpan) {
        statusSpan.innerHTML = 'LIDO ✅';
        statusSpan.style.backgroundColor = '#d4edda';
        statusSpan.style.color = '#15803d';
    }
    
    if (divProduto) {
        divProduto.style.borderColor = '#10b981';
    }

    // Verifica se os dois botões já foram clicados
    if (window.produtosLidos.livro && window.produtosLidos.carteira) {
        // Mostra o botão continuar
        let btnContinuar = document.getElementById('btn-continuar-produtos');
        if (btnContinuar) btnContinuar.style.display = 'block';
        
        // Avisa o sistema para destravar a seta da direita
        if (typeof atualizarVisibilidadeSeta === 'function') {
            atualizarVisibilidadeSeta();
        }
    }
};

    window.marcarFerramentaLida = function(id) {
        // Marca o item específico como lido no sistema
        window.ferramentasLidas[id] = true;

        // Atualiza o visual do item clicado para mostrar "LIDO ✅" sem bloquear o clique
        let statusSpan = document.getElementById('status-ferramenta-' + id);
        let divFerramenta = document.getElementById('ferramenta-' + id);
        
        if (statusSpan) {
            statusSpan.innerHTML = 'LIDO ✅';
            statusSpan.style.backgroundColor = '#d4edda';
            statusSpan.style.color = '#15803d';
        }
        
        if (divFerramenta) {
            divFerramenta.style.borderColor = '#10b981'; // Borda verde para reforçar que já leu
        }

        // Verifica se todas foram lidas para destravar o avanço
        if (verificarTodasFerramentasLidas()) {
            let btnContinuar = document.getElementById('btn-continuar-ferramentas');
            if (btnContinuar) btnContinuar.style.display = 'block';
            
            // Avisa o sistema de setas para reavaliar a tela atual e mostrar a seta direita
            if (typeof atualizarVisibilidadeSeta === 'function') {
                atualizarVisibilidadeSeta();
            }
        }
    };

    function chuvaDeConfetes() {
        const cores = ['#ff69b4', '#a1c4fd', '#fecfef', '#ff9a44', '#ea580c', '#ffffff'];
        for(let i = 0; i < 60; i++) {
            const confete = document.createElement('div');
            confete.style.position = 'fixed';
            confete.style.width = '12px';
            confete.style.height = '12px';
            confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
            confete.style.left = Math.random() * 100 + 'vw';
            confete.style.top = '-20px';
            confete.style.zIndex = '9998';
            confete.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            confete.style.pointerEvents = 'none';
            document.body.appendChild(confete);

           
          
          
          
          
          
          
          
          
          const duracao = Math.random() * 2 + 1.5;
            confete.animate([
                { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate3d(${Math.random() * 200 - 100}px, 100vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: duracao * 1000,
                easing: 'cubic-bezier(.37,0,.63,1)',
                fill: 'forwards'
            });

            setTimeout(() => confete.remove(), duracao * 1000);
        }
    }
})();


/* ===== próximo bloco (core) ===== */


            var audioIniciado = false;
            function iniciarContextoAudio() {
                if (!audioIniciado) {
                    const som = document.getElementById('SOM_VITORIA');
                    if(som) {
                        som.volume = 0;
                        som.play().then(() => {
                            som.pause(); som.currentTime = 0; som.volume = 1; audioIniciado = true;
                        }).catch(e => console.log("Áudio bloqueado."));
                    }
                }
            }
            document.body.addEventListener('touchstart', iniciarContextoAudio, { once: true });
            document.body.addEventListener('click', iniciarContextoAudio, { once: true });

            function revelarMagia(idCard) {
                const som = document.getElementById('SOM_VITORIA');
                if(som) {
                    som.currentTime = 0;
                    som.play().catch(e => console.log("Bloqueado."));
                }

                document.getElementById('misterio-' + idCard).style.display = 'none';
                document.getElementById('revelado-' + idCard).style.display = 'flex';

                const card = document.getElementById('caixa-' + idCard);
                dispararConfetes(card);
                
                if(window.innerWidth < 768) {
                    card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            }

            function dispararConfetes(container) {
                const cores = ['#00C4B5', '#f97316', '#1e3a8a', '#d4af37'];
                for(let i = 0; i < 35; i++) {
                    let confete = document.createElement('div');
                    confete.className = 'confete';
                    if(Math.random() > 0.5) confete.style.borderRadius = '50%';
                    confete.style.background = cores[Math.floor(Math.random() * cores.length)];
                    confete.style.left = Math.random() * 100 + '%';
                    confete.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
                    container.appendChild(confete);
                    setTimeout(() => { if(container.contains(confete)) confete.remove(); }, 2500);
                }
            }

            function domaScrollFinal(direction) {
                const container = document.getElementById('domaScrollFinal');
                const cardWidth = window.innerWidth < 768 ? 280 + 25 : 340 + 25; 
                container.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
            }
        

/* ===== próximo bloco (core) ===== */


    // FUNÇÕES DO MODAL
    function abrirLojaDoma() {
        document.getElementById('modal-loja-doma').style.display = 'block';
    }

    function fecharLojaDoma() {
        document.getElementById('modal-loja-doma').style.display = 'none';
    }

    // INICIALIZAÇÃO DA JORNADA (ZERA TUDO)
    // window.addEventListener('DOMContentLoaded', () => {
    //     // 1. Zera a carteira no "cofre" do navegador
    //     localStorage.setItem('doma_coins', 0);
    //     
    //     // 2. Zera a variável principal do seu sistema
    //     if (typeof moedasTotais !== 'undefined') {
    //         moedasTotais = 0;
    //     }
	// 
    //     // 3. Força o número "0" a aparecer na interface visual lá no topo
    //     if (typeof atualizarCarteiraUI === 'function') {
    //         atualizarCarteiraUI();
    //     }
    //     
    //     // 4. Limpa a memória dos botões de Teste e Reflexão para permitir ganhar as moedas de novo
    //     for(let i=1; i<=10; i++) {
    //         localStorage.removeItem('doma_quiz_intro_' + i);
    //         localStorage.removeItem('doma_task_diario_' + i);
    //     }
    // });


/* ===== próximo bloco (core) ===== */


            function abrirCamadaLivro() {
                const camada = document.getElementById('CAMADA_ABSOLUTA_LIVRO');
                if (camada) { camada.style.display = 'block'; camada.scrollTop = 0; }
            }
            function fecharCamadaLivro() {
                const camada = document.getElementById('CAMADA_ABSOLUTA_LIVRO');
                if (camada) { camada.style.display = 'none'; }
                pararTodosOsSons();
            }

            const modulosJornada = [
                { icone: "🔍", titulo: "O Grande Encontro", texto: "Chega de fugir. Você vai finalmente olhar nos olhos do trauma que está destruindo seus relacionamentos e drenando a sua energia.", classe: "efeito-pulso", audio: "AUDIO_PASSO_7" },
                { icone: "🗺️", titulo: "O Mapa Oculto", texto: "Entenda o verdadeiro motivo por trás das suas reações repentinas. Vamos mapear seus gatilhos invisíveis para que você assuma a condução das suas emoções.", classe: "", audio: "AUDIO_PASSO_7" },
                { icone: "🫁", titulo: "O Freio Biológico", texto: "O método preciso para frear a crise antes da falta de ar. Aprenda a desativar o alarme do corpo e retomar o ritmo tranquilo do seu coração.", classe: "efeito-respira", audio: "AUDIO_PASSO_7" },
                { icone: "🥚", titulo: "O Cordão Umbilical", texto: "De quem é a voz que te julga na cabeça? Vamos rastrear seus medos até a infância e cortar a herança de dor.", classe: "efeito-pulso", audio: "AUDIO_PASSO_7" },
                { icone: "🧸", titulo: "O Resgate da Criança", texto: "O adulto que grita hoje é a criança que não foi ouvida ontem. Vamos acolher a sua versão que ainda chora no escuro.", classe: "", audio: "AUDIO_PASSO_7" },
                { icone: "🗝️", titulo: "O Destravar das Portas", texto: "Quais partes de você morreram para você ser aceito? Vamos arrombar os cadeados que hoje são a sua prisão.", classe: "", audio: "AUDIO_PASSO_7" },
                { icone: "🧠", titulo: "O Desmonte do Sabotador", texto: "Chega de autossabotagem. Entenda a lógica perversa de como a sua própria mente te convence a falhar.", classe: "efeito-glitch", audio: "AUDIO_PASSO_7" }
            ];

            let passoAtual = 0; let timerAudio = null;

            function pararTodosOsSons() {
                const sons = ['AUDIO_QUEBRA_7', 'AUDIO_APARECER_7', 'AUDIO_PASSO_7', 'AUDIO_FINAL_7'];
                sons.forEach(id => { const aud = document.getElementById(id); if(aud) { aud.pause(); aud.currentTime = 0; } });
                if(timerAudio) clearTimeout(timerAudio);
            }

            function tocarSomFocado(idSom, tempoLimite = 800) {
                pararTodosOsSons(); 
                const audio = document.getElementById(idSom);
                if(audio) {
                    audio.play().catch(e => console.log("Áudio bloqueado."));
                    timerAudio = setTimeout(() => { audio.pause(); audio.currentTime = 0; }, tempoLimite);
                }
            }

            let audioPermitido = false;
            function habilitarAudio() {
                if(!audioPermitido) {
                    const aud = document.getElementById('AUDIO_QUEBRA_7');
                    if(aud) aud.play().then(() => aud.pause()).catch(e=>{});
                    audioPermitido = true;
                }
            }
            document.body.addEventListener('touchstart', habilitarAudio, {once:true});
            document.body.addEventListener('click', habilitarAudio, {once:true});

            function quebrarCorrentesLivro() {
                const btnAlicate = document.getElementById('btn-alicate');
                if(btnAlicate.disabled) return;
                btnAlicate.disabled = true;

                document.getElementById('setas-alvo-id').style.display = 'none';
                tocarSomFocado('AUDIO_QUEBRA_7', 1200);
                
                const caixaContainer = document.getElementById('caixa-livro-principal');
                caixaContainer.classList.add('tremer-tela');

                document.getElementById('cadeado-l').style.opacity = '0';
                document.getElementById('txt-selo').style.opacity = '0';
                document.getElementById('corr-1').style.transform = 'rotate(45deg) translate(200px, -200px)';
                document.getElementById('corr-1').style.opacity = '0';
                document.getElementById('corr-2').style.transform = 'rotate(-45deg) translate(200px, 200px)';
                document.getElementById('corr-2').style.opacity = '0';

                setTimeout(() => {
                    document.getElementById('ef-furacao').classList.add('ativo');
                    document.getElementById('ef-fumaca').classList.add('ativo');
                }, 200);

                setTimeout(() => {
                    tocarSomFocado('AUDIO_APARECER_7', 1500); 
                    document.getElementById('ef-flash').classList.add('ativo');
                    document.getElementById('overlay-prisao').style.display = 'none';
                    
                    const imgLivro = document.getElementById('img-livro-alvo');
                    imgLivro.style.filter = 'none';
                    
                    const boxAcorrentada = document.getElementById('box-livro-animado');
                    boxAcorrentada.classList.add('livre');
                    imgLivro.style.animation = 'flutuarLivroLivre 4s ease-in-out infinite';

                    dispararConfetesEspeciais(boxAcorrentada);
                    caixaContainer.classList.remove('tremer-tela');
                    document.getElementById('btn-chamar-jornada-id').style.display = 'block';
                }, 800); 
            }

            function iniciarJornadaInterativa() {
                document.getElementById('topo-texto-intro').style.display = 'none';
                document.getElementById('btn-chamar-jornada-id').style.display = 'none';
                const boxLivro = document.getElementById('box-livro-animado');
                boxLivro.style.maxWidth = "200px";
                const palco = document.getElementById('palco-jornada');
                palco.style.display = 'block';
                setTimeout(() => { palco.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 100);
                renderizarPasso(0);
            }

            function renderizarPasso(index) {
                const palco = document.getElementById('palco-jornada');
                const mod = modulosJornada[index];
                const btnAcao = (index === modulosJornada.length - 1) 
                    ? `<button class="btn-proximo-passo" onclick="finalizarJornada1()">🔓 DESBLOQUEAR ACESSO FINAL</button>`
                    : `<button class="btn-proximo-passo" onclick="proximoPasso()">Continuar Explorando ➔</button>`;
                const html = `
                    <div class="passo-card ${mod.classe}" id="card-atual">
                        <div class="passo-contador">FERRAMENTA ${index + 1} DE ${modulosJornada.length}</div>
                        <div class="passo-icone">${mod.icone}</div>
                        <div class="passo-titulo">${mod.titulo}</div>
                        <div class="passo-texto">${mod.texto}</div>
                        ${btnAcao}
                    </div>
                `;
                palco.innerHTML = html;
                setTimeout(() => { 
                    document.getElementById('card-atual').classList.add('ativo'); 
                    tocarSomFocado(mod.audio, 400); 
                }, 50);
            }

            function proximoPasso() {
                const card = document.getElementById('card-atual');
                card.style.opacity = '0';
                card.style.transform = 'translateX(-50px)';
                setTimeout(() => { passoAtual++; renderizarPasso(passoAtual); }, 300);
            }

            function finalizarJornada1() {
                document.getElementById('palco-jornada').style.display = 'none';
                document.getElementById('tela-final-venda').style.display = 'block';
                document.getElementById('tela-final-venda').scrollIntoView({behavior: 'smooth', block: 'center'});
                tocarSomFocado("AUDIO_FINAL_7", 1500);
                dispararConfetesEspeciais(document.getElementById('caixa-livro-principal'));
            }

            function dispararConfetesEspeciais(container) {
                const cores = ['#facc15', '#f97316', '#38bdf8', '#ef4444', '#1e3a8a'];
                for(let i = 0; i < 40; i++) {
                    let confete = document.createElement('div');
                    confete.className = 'confete-livro';
                    if(Math.random() > 0.5) confete.style.borderRadius = '50%';
                    confete.style.background = cores[Math.floor(Math.random() * cores.length)];
                    confete.style.left = '50%'; confete.style.top = '50%';
                    let angulo = Math.random() * Math.PI * 2;
                    let distancia = Math.random() * 200 + 50;
                    let destinoX = Math.cos(angulo) * distancia;
                    let destinoY = Math.sin(angulo) * distancia - 100;
                    confete.animate([
                        { transform: `translate(0px, 0px) scale(0)`, opacity: 1 },
                        { transform: `translate(${destinoX}px, ${destinoY}px) scale(1.5) rotate(360deg)`, opacity: 1, offset: 0.3 },
                        { transform: `translate(${destinoX}px, ${destinoY + 300}px) rotate(720deg)`, opacity: 0 }
                    ], { duration: Math.random() * 1500 + 1500, easing: 'cubic-bezier(.25,.8,.25,1)', fill: 'forwards' });
                    container.appendChild(confete);
                    setTimeout(() => confete.remove(), 3000);
                }
            }
        

/* ===== próximo bloco (core) ===== */


    // 1. Função Global para Abrir a Janela
    window.abrirModalSenhaVIP = function() {
        var modal = document.getElementById('modal-senha-vip');
        if (modal) {
            // Tira o modal de dentro de qualquer prisão e joga na frente da tela
            if (modal.parentNode !== document.body) {
                document.body.appendChild(modal);
            }
            modal.style.display = 'flex';
        } else {
            console.error("Janela da senha não encontrada!");
        }
    };

    // 2. Função Global para Checar a Senha
    window.validarSenhaVIP = function() {
        const inputSenha = document.getElementById('input-senha-secreta');
        if (!inputSenha) return;
        
        const senha = inputSenha.value.trim().toUpperCase();
        
        // A SENHA DEFINIDA É: DOMADORVIP
        if(senha === 'DOMADORVIP') {
            if(typeof tocarSomMagico === 'function') tocarSomMagico();
            document.getElementById('modal-senha-vip').style.display = 'none';
            
            // Salva o acesso no navegador
            localStorage.setItem('acesso_vip_doma_liberado', 'true');

            if(typeof abrirModalDoma === 'function') {
                abrirModalDoma('Cofre Aberto! 🎉', 'Bem-vindo(a) à Verdadeira Travessia. O Manual do Domador está liberado para você!', 'sucesso', function() {
                    window.avancarParaAreaVIP();
                });
            } else {
                window.avancarParaAreaVIP();
            }
        } else {
            if(typeof tocarSomAlerta === 'function') tocarSomAlerta();
            if(typeof abrirModalDoma === 'function') {
                abrirModalDoma('Senha Incorreta 🚫', 'A senha informada não é válida. Verifique o código enviado para você e tente novamente.', 'alerta');
            } else {
                abrirModalDoma("Senha Incorreta! Tente novamente.");
            }
        }
    };

    // 3. Função Global para Avançar o Slide após senha
    window.avancarParaAreaVIP = function() {
        // Abre a fechadura na força bruta para esta sessão
        isUsuarioPremium = true; 
        
        // Empurra a tela para frente com o comando seguro
        if(typeof mudarPagina === 'function') {
            mudarPagina(1);
        } else {
            try { swiperDoma.slideNext(); } catch(e) {}
        }
    };


/* ===== próximo bloco (core) ===== */


// Função para garantir que o paciente escreva algo no resgate antes de avançar
function trb_SelarResgate() {
    let campo = document.getElementById('trb_txt_resgate');
    if (!campo || !campo.value.trim()) {
        try {
            abrirModalDoma("Por favor, não deixe a sua criança interior sem resposta. Escreva uma mensagem de acolhimento para ela.");
        } catch(e) {
            alert("Por favor, não deixe a sua criança interior sem resposta. Escreva uma mensagem de acolhimento para ela.");
        }
        return;
    }
    
    // Toca o som de sucesso se a função existir
    try {
        if(typeof playPlimPlim === 'function') {
            playPlimPlim();
        }
    } catch(e) {}
    
    trb_mudar(1); // Avança para o slide "A Luz Foi Acesa"
}


/* ===== próximo bloco (core) ===== */


var trb_audioCtx = null;
var trb_canvas, trb_ctx;
var trb_drawing = false;
var trb_tool = 'pincel';
var trb_color = '#000000';
var trb_history = [];

function trb_mudar(dir) {
    if(typeof mudarPagina === 'function') mudarPagina(dir);
    else if(typeof swiperDoma !== 'undefined') {
        if(dir > 0) swiperDoma.slideNext(); else swiperDoma.slidePrev();
    }
}

function trb_IniciarTribunal() {
    trb_mudar(1);
    trb_InitAudio();
    // Pega o monstro atual do site
    let nome = document.getElementById('main-nome-monstro') ? document.getElementById('main-nome-monstro').value : "SINTOMA";
    document.querySelectorAll('.trb_inject_nome').forEach(el => el.innerText = nome.toUpperCase());
}

function trb_ValidarEAvancar(num) {
    let input = document.getElementById('trb_in_' + num);
    if(!input || !input.value.trim()) {
        abrirModalDoma("O Tribunal exige uma resposta para prosseguir.");
        return;
    }
    trb_PlaySfx(800);
    trb_mudar(1);
}

function trb_ConcluirEcos() {
    if(!document.getElementById('trb_check_ritual').checked) {
        abrirModalDoma("Você precisa aceitar o ritual de devolução para se libertar.");
        return;
    }
    trb_mudar(1);
}

function trb_Contestar() {
    abrirModalDoma("A culpa não é sua, mas a responsabilidade de domar é 100% sua!");
    let box = document.getElementById('trb_veredito_container');
    box.style.animation = "none"; void box.offsetWidth;
    box.style.animation = "trb_shaking 0.4s";
}

function trb_Assinar() {
    if(!document.getElementById('trb_assinatura').value.trim()) {
        abrirModalDoma("Assine o termo para selar o decreto.");
        return;
    } else {
	    abrirModalDoma("Termo de Compromisso", "Termo assinado com Sucesso! Monstrinho materializado e acolhido.<br>💗💗💗", "Amor");
	}
    trb_mudar(1);
}

// Lógica de áudio e canvas simplificada para estabilidade
function trb_InitAudio() {
    if(!trb_audioCtx) trb_audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function trb_PlaySfx(f) {
    if(!trb_audioCtx) return;
    let o = trb_audioCtx.createOscillator(); let g = trb_audioCtx.createGain();
    o.frequency.value = f; g.gain.exponentialRampToValueAtTime(0.0001, trb_audioCtx.currentTime + 0.2);
    o.connect(g); g.connect(trb_audioCtx.destination); o.start(); o.stop(trb_audioCtx.currentTime + 0.2);
}

// Inicialização do Canvas ao chegar no slide
document.addEventListener('DOMContentLoaded', () => {
    trb_canvas = document.getElementById('trb_monster_canvas');
    if(trb_canvas) {
        trb_ctx = trb_canvas.getContext('2d');
        
        // SOLUÇÃO: Calcula a largura apenas quando o canvas aparecer na tela
        let observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                trb_canvas.width = trb_canvas.parentElement.offsetWidth;
                observer.disconnect(); // Para de observar após o ajuste
            }
        });
        observer.observe(trb_canvas);
        
        // Variáveis de controle para o motor de desenho
        let trb_snapshot = null;
        let trb_startX = 0, trb_startY = 0;
        let trb_lastX = 0, trb_lastY = 0;
        
        // Variáveis do Modal de Texto
        let trb_textX = 0, trb_textY = 0;

        // Variáveis da Ferramenta de Mover
        let trb_moveState = 0; // 0: pronto para selecionar, 1: selecionando, 2: flutuando, 3: arrastando
        let trb_mX = 0, trb_mY = 0, trb_mW = 0, trb_mH = 0;
        let trb_mOffsetX = 0, trb_mOffsetY = 0;
        let trb_moveImgData = null;
        let trb_baseSnapshot = null;

        // Função conversora para o Conta-Gotas
        const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');

        // Destaca a cor selecionada na paleta
        window.trb_DestacarCorNaPaleta = function(corHex) {
            trb_color = corHex;
            document.querySelectorAll('.cor-paleta-item').forEach(el => {
                el.style.transform = 'scale(1)';
                el.style.border = '2px solid rgba(0,0,0,0.1)';
                el.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.15)';
                el.style.zIndex = '1';
            });
            let corSelecionada = document.getElementById('cor-' + corHex.toUpperCase());
            if(corSelecionada) {
                corSelecionada.style.transform = 'scale(1.4)';
                corSelecionada.style.border = '2px solid #ffffff';
                corSelecionada.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
                corSelecionada.style.zIndex = '10';
            }
        };

        // Função chamada pelo Modal de Texto ao clicar em Confirmar
        window.trb_ConfirmarTexto = function() {
            let input = document.getElementById('input-texto-canvas');
            let texto = input.value;
            if (texto && texto.trim() !== "") {
                trb_history.push(trb_canvas.toDataURL());
                let tamanhoFonte = parseInt(document.getElementById('trb_brush_size').value) * 4;
                trb_ctx.font = `900 ${tamanhoFonte}px 'Quicksand', sans-serif`;
                trb_ctx.fillStyle = trb_color;
                trb_ctx.fillText(texto, trb_textX, trb_textY);
            }
            document.getElementById('modal-texto-canvas').style.display = 'none';
            input.value = "";
        };

        // Função que cola a seleção flutuante definitivamente no canvas
        window.trb_CommitMove = function() {
            if (trb_moveState === 2 && trb_moveImgData && trb_baseSnapshot) {
                trb_ctx.putImageData(trb_baseSnapshot, 0, 0); // Fundo limpo
                trb_ctx.putImageData(trb_moveImgData, trb_mX, trb_mY); // Cola a imagem na nova posição
                trb_moveState = 0; // Volta para estado inicial
            }
        };

        const startDraw = (e) => {
            let pos = trb_GetPos(e.touches && e.touches.length > 0 ? e.touches[0] : e);
            trb_startX = pos.x; trb_startY = pos.y;
            trb_lastX = pos.x; trb_lastY = pos.y;

            // [A] Conta-Gotas
            if (trb_tool === 'conta-gotas') {
                let pixelData = trb_ctx.getImageData(pos.x, pos.y, 1, 1).data;
                if(pixelData[3] > 0) {
                    let corCapturada = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
                    trb_DestacarCorNaPaleta(corCapturada);
                }
                trb_SetTool('pincel', document.getElementById('btn-pincel'));
                return;
            }

            // [B] Ferramenta Texto (Chama o modal elegante)
            if (trb_tool === 'texto') {
                trb_textX = pos.x;
                trb_textY = pos.y;
                let modal = document.getElementById('modal-texto-canvas');
                modal.style.display = 'flex';
                document.getElementById('input-texto-canvas').focus();
                return;
            }

            // [C] Ferramenta Mover (Lógica de Seleção e Arraste)
            if (trb_tool === 'mover') {
                if (trb_moveState === 0) {
                    // Clicou para iniciar nova seleção
                    trb_moveState = 1;
                    trb_snapshot = trb_ctx.getImageData(0, 0, trb_canvas.width, trb_canvas.height);
                } else if (trb_moveState === 2) {
                    // Já existe uma área flutuando. O clique foi dentro ou fora dela?
                    if (pos.x >= trb_mX && pos.x <= trb_mX + trb_mW && pos.y >= trb_mY && pos.y <= trb_mY + trb_mH) {
                        // Clicou DENTRO: Inicia o arrasto
                        trb_moveState = 3;
                        trb_mOffsetX = pos.x - trb_mX;
                        trb_mOffsetY = pos.y - trb_mY;
                    } else {
                        // Clicou FORA: Fixa o desenho e inicia uma nova seleção
                        trb_history.push(trb_canvas.toDataURL());
                        trb_CommitMove();
                        trb_startX = pos.x; trb_startY = pos.y;
                        trb_moveState = 1;
                        trb_snapshot = trb_ctx.getImageData(0, 0, trb_canvas.width, trb_canvas.height);
                    }
                }
                return;
            }

            // Para as demais ferramentas, se havia algo sendo movido, fixa no lugar
            trb_CommitMove();
            
            // Salva histórico para Desfazer
            trb_history.push(trb_canvas.toDataURL());

            // [D] Balde
            if (trb_tool === 'balde') {
                trb_FloodFill(Math.floor(pos.x), Math.floor(pos.y), trb_color);
                return;
            }

            trb_drawing = true;

            // [E] Formas Geométricas & Tesoura
            if (['tesoura', 'linha', 'retangulo', 'circulo', 'triangulo', 'estrela'].includes(trb_tool)) {
                trb_snapshot = trb_ctx.getImageData(0, 0, trb_canvas.width, trb_canvas.height);
                return;
            }

            // Pincel e Borracha
            trb_ctx.beginPath();
            trb_ctx.moveTo(pos.x, pos.y);
        };
        
        const drawing = (e) => {
            let pos = trb_GetPos(e.touches && e.touches.length > 0 ? e.touches[0] : e);
            trb_lastX = pos.x; trb_lastY = pos.y;

            // Lógica de Movimentação do Mover
            if (trb_tool === 'mover') {
                if (trb_moveState === 1) {
                    // Desenhando o retângulo de seleção inicial
                    trb_ctx.putImageData(trb_snapshot, 0, 0);
                    trb_ctx.beginPath();
                    trb_ctx.setLineDash([5, 5]);
                    trb_ctx.strokeStyle = "#0ea5e9";
                    trb_ctx.lineWidth = 2;
                    trb_ctx.rect(trb_startX, trb_startY, pos.x - trb_startX, pos.y - trb_startY);
                    trb_ctx.stroke();
                    trb_ctx.setLineDash([]);
                } else if (trb_moveState === 3) {
                    // Arrastando a imagem recortada
                    trb_mX = pos.x - trb_mOffsetX;
                    trb_mY = pos.y - trb_mOffsetY;
                    
                    trb_ctx.putImageData(trb_baseSnapshot, 0, 0); // Desenha o fundo branco original
                    trb_ctx.putImageData(trb_moveImgData, trb_mX, trb_mY); // Desenha a imagem na nova posição
                    
                    // Desenha a borda tracejada indicando que ainda está flutuando
                    trb_ctx.beginPath();
                    trb_ctx.setLineDash([5, 5]);
                    trb_ctx.strokeStyle = "#0ea5e9";
                    trb_ctx.lineWidth = 2;
                    trb_ctx.rect(trb_mX, trb_mY, trb_mW, trb_mH);
                    trb_ctx.stroke();
                    trb_ctx.setLineDash([]);
                }
                return;
            }

            if(!trb_drawing || ['balde', 'conta-gotas', 'texto'].includes(trb_tool)) return;
            
            // Traçado das Formas Geométricas
            if (['tesoura', 'linha', 'retangulo', 'circulo', 'triangulo', 'estrela'].includes(trb_tool)) {
                trb_ctx.putImageData(trb_snapshot, 0, 0);
                trb_ctx.beginPath();
                
                if (trb_tool === 'tesoura') {
                    trb_ctx.setLineDash([5, 5]);
                    trb_ctx.strokeStyle = "#ff0000";
                    trb_ctx.lineWidth = 2;
                    trb_ctx.rect(trb_startX, trb_startY, pos.x - trb_startX, pos.y - trb_startY);
                } else {
                    trb_ctx.setLineDash([]);
                    trb_ctx.strokeStyle = trb_color;
                    trb_ctx.lineWidth = document.getElementById('trb_brush_size').value;
                    trb_ctx.lineCap = "round";
                    trb_ctx.lineJoin = "round";

                    if (trb_tool === 'linha') {
                        trb_ctx.moveTo(trb_startX, trb_startY);
                        trb_ctx.lineTo(pos.x, pos.y);
                    } else if (trb_tool === 'retangulo') {
                        trb_ctx.rect(trb_startX, trb_startY, pos.x - trb_startX, pos.y - trb_startY);
                    } else if (trb_tool === 'circulo') {
                        let radius = Math.sqrt(Math.pow(pos.x - trb_startX, 2) + Math.pow(pos.y - trb_startY, 2));
                        trb_ctx.arc(trb_startX, trb_startY, radius, 0, 2 * Math.PI);
                    } else if (trb_tool === 'triangulo') {
                        trb_ctx.moveTo(trb_startX + (pos.x - trb_startX) / 2, trb_startY);
                        trb_ctx.lineTo(trb_startX, pos.y);
                        trb_ctx.lineTo(pos.x, pos.y);
                        trb_ctx.closePath();
                    } else if (trb_tool === 'estrela') {
                        let radius = Math.sqrt(Math.pow(pos.x - trb_startX, 2) + Math.pow(pos.y - trb_startY, 2));
                        let rot = Math.PI / 2 * 3;
                        let step = Math.PI / 5;
                        trb_ctx.moveTo(trb_startX, trb_startY - radius);
                        for (let i = 0; i < 5; i++) {
                            let cx = trb_startX + Math.cos(rot) * radius;
                            let cy = trb_startY + Math.sin(rot) * radius;
                            trb_ctx.lineTo(cx, cy);
                            rot += step;
                            cx = trb_startX + Math.cos(rot) * (radius * 0.4);
                            cy = trb_startY + Math.sin(rot) * (radius * 0.4);
                            trb_ctx.lineTo(cx, cy);
                            rot += step;
                        }
                        trb_ctx.closePath();
                    }
                }
                trb_ctx.stroke();
                return;
            }

            // Pincel Normal e Borracha
            trb_ctx.lineTo(pos.x, pos.y);
            trb_ctx.strokeStyle = (trb_tool === 'borracha') ? '#ffffff' : trb_color;
            trb_ctx.lineWidth = document.getElementById('trb_brush_size').value;
            trb_ctx.lineCap = "round";
            trb_ctx.lineJoin = "round";
            trb_ctx.stroke();
        };
        
        const stopDraw = () => { 
            // Finaliza o Mover
            if (trb_tool === 'mover') {
                if (trb_moveState === 1) {
                    // Finalizou a seleção da área. Vamos recortá-la e preencher o buraco original com branco.
                    trb_mX = Math.min(trb_startX, trb_lastX);
                    trb_mY = Math.min(trb_startY, trb_lastY);
                    trb_mW = Math.abs(trb_lastX - trb_startX);
                    trb_mH = Math.abs(trb_lastY - trb_startY);
                    
                    if (trb_mW > 0 && trb_mH > 0) {
                        trb_history.push(trb_canvas.toDataURL()); // Salva o histórico antes de recortar
                        trb_ctx.putImageData(trb_snapshot, 0, 0); // Tira o tracejado azul temporário
                        
                        trb_moveImgData = trb_ctx.getImageData(trb_mX, trb_mY, trb_mW, trb_mH); // Copia a área
                        
                        // Preenche a área recortada com branco (o fundo base)
                        trb_ctx.fillStyle = "#ffffff";
                        trb_ctx.fillRect(trb_mX, trb_mY, trb_mW, trb_mH);
                        
                        // Salva essa versão da tela esburacada como a base para arrastar por cima
                        trb_baseSnapshot = trb_ctx.getImageData(0, 0, trb_canvas.width, trb_canvas.height);
                        
                        // Desenha a imagem cortada com a borda de volta para mostrar que está flutuando
                        trb_ctx.putImageData(trb_moveImgData, trb_mX, trb_mY);
                        trb_ctx.beginPath();
                        trb_ctx.setLineDash([5, 5]);
                        trb_ctx.strokeStyle = "#0ea5e9";
                        trb_ctx.lineWidth = 2;
                        trb_ctx.rect(trb_mX, trb_mY, trb_mW, trb_mH);
                        trb_ctx.stroke();
                        trb_ctx.setLineDash([]);
                        
                        trb_moveState = 2; // Estado "Flutuando", pronto para arrastar
                    } else {
                        trb_ctx.putImageData(trb_snapshot, 0, 0); // Cancela se o tamanho for zero
                        trb_moveState = 0;
                    }
                } else if (trb_moveState === 3) {
                    trb_moveState = 2; // Soltou o clique, continua flutuando no novo lugar
                }
                return;
            }

            if(!trb_drawing) return;
            trb_drawing = false; 

            if (trb_tool === 'tesoura' && trb_snapshot) {
                trb_ctx.putImageData(trb_snapshot, 0, 0);
                trb_ctx.fillStyle = "#ffffff";
                trb_ctx.fillRect(trb_startX, trb_startY, trb_lastX - trb_startX, trb_lastY - trb_startY);
            }
        };

        trb_canvas.addEventListener('mousedown', startDraw);
        trb_canvas.addEventListener('mousemove', drawing);
        window.addEventListener('mouseup', stopDraw);
        trb_canvas.addEventListener('touchstart', (e) => { startDraw(e); e.preventDefault(); }, {passive: false});
        trb_canvas.addEventListener('touchmove', (e) => { drawing(e); e.preventDefault(); }, {passive: false});
        trb_canvas.addEventListener('touchend', stopDraw);
    } // Fechamento do 'if(trb_canvas)'

    // Inicialização da Paleta de Cores (Cores exatas da imagem enviada)
    let pal = document.getElementById('trb_paleta');
    const coresPaint = [
        '#000000', '#7F7F7F', '#880015', '#ED1C24', '#FF7F27', '#FFF200', '#22B14C', '#00A2E8', '#3F48CC', '#A349A4',
        '#FFFFFF', '#C3C3C3', '#B97A57', '#FFAEC9', '#FFC90E', '#EFE4B0', '#B5E61D', '#99D9EA', '#7092BE', '#C8BFE7'
    ];
    
    pal.innerHTML = '';
    coresPaint.forEach(c => {
        let s = document.createElement('div');
        // Classes e IDs para a função de destaque conseguir encontrar e aumentar a bolinha
        s.className = 'cor-paleta-item';
        s.id = 'cor-' + c.toUpperCase();
        s.style = `width:26px; height:26px; background:${c}; border-radius:50%; cursor:pointer; display:inline-block; margin:4px; border:2px solid rgba(0,0,0,0.1); box-shadow:inset 0 2px 4px rgba(0,0,0,0.15); transition: all 0.2s ease; position: relative;`;
        
        s.onclick = () => {
            trb_DestacarCorNaPaleta(c); // Ativa o efeito visual
            if(['tesoura', 'conta-gotas', 'borracha'].includes(trb_tool)) {
                trb_SetTool('pincel', document.getElementById('btn-pincel'));
            }
        };
        
        pal.appendChild(s);
    });
    
    // Inicia com o preto já selecionado e com a bolinha em destaque
    setTimeout(() => trb_DestacarCorNaPaleta('#000000'), 100);

    // Sintomas grid
    let sGrid = document.getElementById('trb_sintomas_list');
    ["💓 Dores no Corpo", "🤢 Nó Garganta", "🧠 Mente agitada", "🥶 Frio na Barriga"].forEach(s => {
        sGrid.innerHTML += `<label><input type="checkbox" onchange="trb_UpdateTherm()"> ${s}</label>`;
    });
});

function trb_GetPos(e) {
    let r = trb_canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function trb_UpdateTherm() {
    let count = document.querySelectorAll('.trb_sintomas_grid input:checked').length;
    let fill = document.getElementById('trb_therm_fill');
    fill.style.width = (count * 25) + "%";
    document.getElementById('trb_st_txt').innerText = count > 2 ? "ALERTA" : "MANSO";
}

function trb_Undo() {
    if(trb_history.length > 0) {
        let img = new Image();
        img.src = trb_history.pop();
        img.onload = () => { 
            trb_ctx.clearRect(0,0,trb_canvas.width,trb_canvas.height); 
            trb_ctx.drawImage(img,0,0); 
        };
    } else {
        // Se o histórico estiver vazio, limpa tudo (tela em branco original)
        trb_ctx.clearRect(0,0,trb_canvas.width,trb_canvas.height);
    }
}

// 1. Controle Visual das Ferramentas
function trb_SetTool(ferramenta, btnElement) {
    // Se estava movendo uma peça e mudou de ferramenta, fixa a peça no lugar
    if (typeof trb_CommitMove === 'function') {
        trb_CommitMove();
    }

    trb_tool = ferramenta;
    
    // Zera o estilo de todos os botões possíveis
    const botoes = ['btn-pincel', 'btn-borracha', 'btn-balde', 'btn-tesoura', 'btn-mover', 'btn-conta-gotas', 'btn-texto', 'btn-linha', 'btn-retangulo', 'btn-circulo', 'btn-triangulo', 'btn-estrela'];
    
    botoes.forEach(id => {
        let b = document.getElementById(id);
        if(b) {
            b.style.background = '#f8fafc';
            b.style.border = '1px solid #ddd';
        }
    });
    
    // Destaca apenas a ferramenta ativa no momento
    if(btnElement) {
        btnElement.style.background = '#bae6fd';
        btnElement.style.border = '2px solid #0ea5e9';
    }
}

// 2. Algoritmo de Preenchimento de Área Fechada (Flood Fill)
function trb_FloodFill(startX, startY, fillColorHex) {
    // Converte a cor HEX da paleta para RGBA
    if (fillColorHex.length === 4) {
        fillColorHex = '#' + fillColorHex[1] + fillColorHex[1] + fillColorHex[2] + fillColorHex[2] + fillColorHex[3] + fillColorHex[3];
    }
    const fillR = parseInt(fillColorHex.slice(1, 3), 16);
    const fillG = parseInt(fillColorHex.slice(3, 5), 16);
    const fillB = parseInt(fillColorHex.slice(5, 7), 16);
    const fillColor = [fillR, fillG, fillB, 255];

    const canvasData = trb_ctx.getImageData(0, 0, trb_canvas.width, trb_canvas.height);
    const data = canvasData.data;
    const startPos = (startY * trb_canvas.width + startX) * 4;
    const startColor = [data[startPos], data[startPos+1], data[startPos+2], data[startPos+3]];

    // Se a cor clicada já for a mesma do balde, não faz nada
    if (startColor[0] === fillColor[0] && startColor[1] === fillColor[1] && startColor[2] === fillColor[2]) return;

    const matchColor = (pos) => data[pos] === startColor[0] && data[pos+1] === startColor[1] && data[pos+2] === startColor[2] && data[pos+3] === startColor[3];
    const colorPixel = (pos) => { data[pos] = fillColor[0]; data[pos+1] = fillColor[1]; data[pos+2] = fillColor[2]; data[pos+3] = 255; };

    const pixelStack = [[startX, startY]];
    const width = trb_canvas.width;
    const height = trb_canvas.height;

    while (pixelStack.length) {
        const newPos = pixelStack.pop();
        let x = newPos[0];
        let y = newPos[1];
        let pixelPos = (y * width + x) * 4;

        // Sobe o máximo possível na área com a mesma cor
        while (y >= 0 && matchColor(pixelPos)) { y--; pixelPos -= width * 4; }
        
        pixelPos += width * 4;
        y++;
        let reachLeft = false, reachRight = false;

        // Desce pintando a área
        while (y < height && matchColor(pixelPos)) {
            colorPixel(pixelPos);

            if (x > 0) {
                if (matchColor(pixelPos - 4)) {
                    if (!reachLeft) { pixelStack.push([x - 1, y]); reachLeft = true; }
                } else if (reachLeft) reachLeft = false;
            }

            if (x < width - 1) {
                if (matchColor(pixelPos + 4)) {
                    if (!reachRight) { pixelStack.push([x + 1, y]); reachRight = true; }
                } else if (reachRight) reachRight = false;
            }
            y++; pixelPos += width * 4;
        }
    }
    trb_ctx.putImageData(canvasData, 0, 0);
}

function trb_SalvarDesenho() { trb_PlaySfx(1000); trb_mudar(1); }


/* ===== próximo bloco (core) ===== */


    let audioLojaAtual = null;
    let btnLojaAtual = null;
    let textoOriginalBtn = "";

    function comprarETocar(idAudio, btnClicado, titulo) {
        const musica = document.getElementById(idAudio);
        const disco = document.getElementById('disco-loja');
        const agulha = document.getElementById('agulha-loja');
        
        if (audioLojaAtual && audioLojaAtual !== musica) {
            audioLojaAtual.pause();
            btnLojaAtual.classList.remove('tocando');
            btnLojaAtual.innerHTML = textoOriginalBtn;
        }

        if (musica.paused) {
            if(!btnClicado.classList.contains('comprado')) {
                textoOriginalBtn = '<span>▶</span> Tocar';
                btnClicado.classList.add('comprado');
            } else {
                 textoOriginalBtn = btnClicado.innerHTML;
            }

            try { musica.play(); } catch(e) {}
            disco.classList.add('disco-loja-girando');
            agulha.classList.add('agulha-loja-tocando');
            
            btnClicado.classList.add('tocando');
            btnClicado.innerHTML = `<span>⏸</span> Pausar`;
            
            audioLojaAtual = musica;
            btnLojaAtual = btnClicado;

        } else {
            try { musica.pause(); } catch(e) {}
            disco.classList.remove('disco-loja-girando');
            agulha.classList.remove('agulha-loja-tocando');
            
            btnClicado.classList.remove('tocando');
            btnClicado.innerHTML = `<span>▶</span> Tocar`;
            audioLojaAtual = null;
        }
    }
    

/* ===== próximo bloco (core) ===== */


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
   /* =========================================
   SONS DO QUEBRA-CABEÇA (GERENCIAMENTO EXTERNO)
========================================= */
let audioCtxPecas = null;

function initAudioPecasDoma() {
    if (!audioCtxPecas) {
        audioCtxPecas = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxPecas.state === 'suspended') {
        audioCtxPecas.resume();
    }
}

// 1. Toca ao pegar na peça (Ploc suave)
function tocarPegarPeca() {
    if (!audioCtxPecas) return;
    if (audioCtxPecas.state === 'suspended') audioCtxPecas.resume();
    const osc = audioCtxPecas.createOscillator();
    const gainNode = audioCtxPecas.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtxPecas.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtxPecas.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.05, audioCtxPecas.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxPecas.currentTime + 0.1);
    osc.connect(gainNode); gainNode.connect(audioCtxPecas.destination);
    osc.start(); osc.stop(audioCtxPecas.currentTime + 0.1);
}

// 2. Toca quando passa a peça em cima de um cesto (Swoosh suave)
function tocarHoverCesto() {
    if (!audioCtxPecas) return;
    if (audioCtxPecas.state === 'suspended') audioCtxPecas.resume();
    const osc = audioCtxPecas.createOscillator();
    const gainNode = audioCtxPecas.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, audioCtxPecas.currentTime);
    osc.frequency.linearRampToValueAtTime(300, audioCtxPecas.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.02, audioCtxPecas.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtxPecas.currentTime + 0.1);
    osc.connect(gainNode); gainNode.connect(audioCtxPecas.destination);
    osc.start(); osc.stop(audioCtxPecas.currentTime + 0.1);
}

// 3. Toca ao soltar no EU PRATICO (Clack firme)
function tocarDropPratico() {
    if (!audioCtxPecas) return;
    if (audioCtxPecas.state === 'suspended') audioCtxPecas.resume();
    const osc = audioCtxPecas.createOscillator();
    const gainNode = audioCtxPecas.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, audioCtxPecas.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtxPecas.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.08, audioCtxPecas.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxPecas.currentTime + 0.1);
    osc.connect(gainNode); gainNode.connect(audioCtxPecas.destination);
    osc.start(); osc.stop(audioCtxPecas.currentTime + 0.1);
}

// 4. Toca ao soltar no EU PERMITO (Plomp oco)
function tocarDropPermito() {
    if (!audioCtxPecas) return;
    if (audioCtxPecas.state === 'suspended') audioCtxPecas.resume();
    const osc = audioCtxPecas.createOscillator();
    const gainNode = audioCtxPecas.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, audioCtxPecas.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtxPecas.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.1, audioCtxPecas.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtxPecas.currentTime + 0.2);
    osc.connect(gainNode); gainNode.connect(audioCtxPecas.destination);
    osc.start(); osc.stop(audioCtxPecas.currentTime + 0.2);
}

// 5. Toca ao soltar no AUSENTE (Tack seco)
function tocarDropAusente() {
    if (!audioCtxPecas) return;
    if (audioCtxPecas.state === 'suspended') audioCtxPecas.resume();
    const osc = audioCtxPecas.createOscillator();
    const gainNode = audioCtxPecas.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, audioCtxPecas.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtxPecas.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxPecas.currentTime + 0.05);
    osc.connect(gainNode); gainNode.connect(audioCtxPecas.destination);
    osc.start(); osc.stop(audioCtxPecas.currentTime + 0.05);
}

// 6. Som do Diagnóstico (Scan Digital rápido)
function tocarScanDiagnostico() {
    if (!audioCtxPecas) return;
    if (audioCtxPecas.state === 'suspended') audioCtxPecas.resume();
    let time = audioCtxPecas.currentTime;
    for(let i=0; i<5; i++) {
        const osc = audioCtxPecas.createOscillator();
        const gainNode = audioCtxPecas.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1000 + (i*200), time);
        gainNode.gain.setValueAtTime(0.03, time);
        gainNode.gain.linearRampToValueAtTime(0, time + 0.08);
        osc.connect(gainNode); gainNode.connect(audioCtxPecas.destination);
        osc.start(time); osc.stop(time + 0.08);
        time += 0.1;
    }
}

// 7. Som do Carimbo no Contrato (Boom pesado)
function tocarCarimboContrato() {
    if (!audioCtxPecas) return;
    if (audioCtxPecas.state === 'suspended') audioCtxPecas.resume();
    const osc = audioCtxPecas.createOscillator();
    const gainNode = audioCtxPecas.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, audioCtxPecas.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtxPecas.currentTime + 0.4);
    gainNode.gain.setValueAtTime(0.2, audioCtxPecas.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxPecas.currentTime + 0.4);
    osc.connect(gainNode); gainNode.connect(audioCtxPecas.destination);
    osc.start(); osc.stop(audioCtxPecas.currentTime + 0.4);
}

// 8. Som de Tick para o Checkbox do Plano Tático (Crocante e Rápido)
function tocarTickCheckbox() {
    if (!audioCtxPecas) {
        audioCtxPecas = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxPecas.state === 'suspended') audioCtxPecas.resume();
    
    const osc = audioCtxPecas.createOscillator();
    const gainNode = audioCtxPecas.createGain();
    
    osc.type = 'square'; 
    osc.frequency.setValueAtTime(1200, audioCtxPecas.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtxPecas.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.08, audioCtxPecas.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxPecas.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxPecas.destination);
    
    osc.start();
    osc.stop(audioCtxPecas.currentTime + 0.05);
}

// 9. NOVA FUNÇÃO: Sirene de Alerta Clínico (3 Toques)
function tocarSireneAlarme() {
    if (!audioCtxPecas) {
        audioCtxPecas = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxPecas.state === 'suspended') audioCtxPecas.resume();

    const osc = audioCtxPecas.createOscillator();
    const gainNode = audioCtxPecas.createGain();

    osc.type = 'square'; 

    osc.frequency.setValueAtTime(800, audioCtxPecas.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, audioCtxPecas.currentTime + 0.25);
    osc.frequency.linearRampToValueAtTime(800, audioCtxPecas.currentTime + 0.5);

    osc.frequency.setValueAtTime(800, audioCtxPecas.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(1200, audioCtxPecas.currentTime + 0.75);
    osc.frequency.linearRampToValueAtTime(800, audioCtxPecas.currentTime + 1.0);

    osc.frequency.setValueAtTime(800, audioCtxPecas.currentTime + 1.0);
    osc.frequency.linearRampToValueAtTime(1200, audioCtxPecas.currentTime + 1.25);
    osc.frequency.linearRampToValueAtTime(800, audioCtxPecas.currentTime + 1.5);

    gainNode.gain.setValueAtTime(0.08, audioCtxPecas.currentTime); 
    gainNode.gain.setValueAtTime(0.08, audioCtxPecas.currentTime + 1.4);
    gainNode.gain.linearRampToValueAtTime(0, audioCtxPecas.currentTime + 1.5);

    osc.connect(gainNode);
    gainNode.connect(audioCtxPecas.destination);

    osc.start();
    osc.stop(audioCtxPecas.currentTime + 1.5);
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  /* =========================================
   SONS DA ROLETA (GERENCIAMENTO EXTERNO)
   ========================================= */
let audioCtxRoleta = null;

function initAudioRoletaDoma() {
    if (!audioCtxRoleta) {
        audioCtxRoleta = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRoleta.state === 'suspended') {
        audioCtxRoleta.resume();
    }
}

function tocarTicRoleta() {
    if (!audioCtxRoleta) return;
    if (audioCtxRoleta.state === 'suspended') audioCtxRoleta.resume();
    
    const osc = audioCtxRoleta.createOscillator();
    const gainNode = audioCtxRoleta.createGain();
    
    osc.type = 'sine'; 
    osc.frequency.setValueAtTime(800, audioCtxRoleta.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtxRoleta.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.05, audioCtxRoleta.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRoleta.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxRoleta.destination);
    
    osc.start();
    osc.stop(audioCtxRoleta.currentTime + 0.05);
}

function tocarSucessoRoleta() {
    if (!audioCtxRoleta) return;
    if (audioCtxRoleta.state === 'suspended') audioCtxRoleta.resume();
    
    const osc = audioCtxRoleta.createOscillator();
    const gainNode = audioCtxRoleta.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, audioCtxRoleta.currentTime);
    osc.frequency.setValueAtTime(659.25, audioCtxRoleta.currentTime + 0.15);
    osc.frequency.setValueAtTime(783.99, audioCtxRoleta.currentTime + 0.3);
    osc.frequency.setValueAtTime(1046.50, audioCtxRoleta.currentTime + 0.45);
    
    gainNode.gain.setValueAtTime(0.1, audioCtxRoleta.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtxRoleta.currentTime + 0.8);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxRoleta.destination);
    
    osc.start();
    osc.stop(audioCtxRoleta.currentTime + 0.8);
}

// A FUNÇÃO DA SIRENE QUE VAI DAR O SUSTO KKKK
function tocarSireneRoleta() {
    if (!audioCtxRoleta) return;
    if (audioCtxRoleta.state === 'suspended') audioCtxRoleta.resume();

    const osc = audioCtxRoleta.createOscillator();
    const gainNode = audioCtxRoleta.createGain();

    // Tipo de onda 'square' dá aquele tom áspero de alarme
    osc.type = 'square'; 

    // Disparo 1: Sobe e desce a frequência
    osc.frequency.setValueAtTime(800, audioCtxRoleta.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, audioCtxRoleta.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(800, audioCtxRoleta.currentTime + 0.6);

    // Disparo 2: Sobe e desce a frequência novamente
    osc.frequency.setValueAtTime(800, audioCtxRoleta.currentTime + 0.6);
    osc.frequency.linearRampToValueAtTime(1200, audioCtxRoleta.currentTime + 0.9);
    osc.frequency.linearRampToValueAtTime(800, audioCtxRoleta.currentTime + 1.2);

    // Controle de volume para não ensurdecer
    gainNode.gain.setValueAtTime(0.08, audioCtxRoleta.currentTime); 
    gainNode.gain.setValueAtTime(0.08, audioCtxRoleta.currentTime + 1.1);
    gainNode.gain.linearRampToValueAtTime(0, audioCtxRoleta.currentTime + 1.2);

    osc.connect(gainNode);
    gainNode.connect(audioCtxRoleta.destination);

    osc.start();
    osc.stop(audioCtxRoleta.currentTime + 1.2);
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  
    
    
    
    
    
    
    // ==========================================
    // SISTEMA DE VALIDAÇÃO DE COERÊNCIA (ANTI-SPAM)
    // ==========================================
    function isCoerente(texto) {
        let txt = texto.trim().toLowerCase();
        if (txt.length < 4) return false; 
        
        let vogais = txt.match(/[aeiouáéíóúãõâêô]/g);
        if (!vogais || vogais.length === 0) return false; 
        
        if (/(.)\1{4,}/.test(txt)) return false; // aaaaa, kkkkk
        if (/[bcdfghjklmnpqrstvwxyz]{5,}/.test(txt)) return false; // jsfklh
        
        if (txt.length > 15 && txt.indexOf(' ') === -1) return false; 
        
        return true;
    }

    function processarFormulario(idsArray, taskId, moedasVal, modalTit, modalTxt, modalTipo, pagAvanco) {
        let todosVazios = true;
        let incoerente = false;

        for(let id of idsArray) {
            let el = document.getElementById(id);
            if(el && el.value.trim() !== '') {
                todosVazios = false;
                if(!isCoerente(el.value)) incoerente = true;
            }
        }

        if(todosVazios) {
            abrirModalDoma('🚨 EM BRANCO!', 'Por favor, escreva algo antes de validar. Não fuja do exercício!', 'alerta');
            return;
        }

        if(incoerente) {
            abrirModalDoma('🚨 CONCENTRE-SE!', 'O texto digitado não parece fazer sentido. Por favor, respire, concentre-se e escreva palavras reais. A fuga alimenta o monstro.', 'alerta');
            return;
        }

        let jaGanhou = localStorage.getItem('doma_task_' + taskId);
        if(!jaGanhou) {
            ganharMoedas(moedasVal, null);
            localStorage.setItem('doma_task_' + taskId, 'true');
        }

        abrirModalDoma(modalTit, modalTxt, modalTipo, function(){
            if(pagAvanco !== null) mudarPagina(pagAvanco);
        });
    }

    // ==========================================
    // SISTEMA DE DOMA COINS (A CARTEIRA MÁGICA)
    // ==========================================
    let moedasTotais = parseInt(localStorage.getItem('doma_coins')) || 0;
    
    function atualizarCarteiraUI() {
        document.getElementById('doma-coins-valor').innerText = moedasTotais;
    }

    function ganharMoedas(quantidade, eventoClick = null) {
        if(quantidade <= 0) return; // Não dá moedas zeradas
        moedasTotais += quantidade;
        localStorage.setItem('doma_coins', moedasTotais);
        atualizarCarteiraUI();

        const sMoeda = document.getElementById('S_MOEDA');
        if(sMoeda) { sMoeda.currentTime = 0; sMoeda.play().catch(e=>{}); }

        let posX = window.innerWidth / 2;
        let posY = window.innerHeight / 2;

        if(eventoClick && eventoClick.clientX) {
            posX = eventoClick.clientX;
            posY = eventoClick.clientY;
        }

        const animText = document.createElement('div');
        animText.className = 'texto-moeda-voadora';
        animText.innerText = '+' + quantidade;
        animText.style.left = (posX - 20) + 'px';
        animText.style.top = (posY - 20) + 'px';
        document.body.appendChild(animText);

        const carteira = document.getElementById('carteira-ui');
        carteira.classList.add('carteira-pulse');
        
        setTimeout(() => { 
            animText.remove(); 
            carteira.classList.remove('carteira-pulse');
        }, 1500);

        verificarLoja();
    }

    function comprarRecompensa(custo, btnId, cupomCodigo) {
        if(moedasTotais >= custo) {
            moedasTotais -= custo;
            localStorage.setItem('doma_coins', moedasTotais);
            atualizarCarteiraUI();
            
            const sMoeda = document.getElementById('S_MOEDA');
            if(sMoeda) { sMoeda.currentTime = 0; sMoeda.play().catch(e=>{}); }
            
            const btn = document.getElementById(btnId);
            const cupomDiv = document.getElementById('cupom-' + btnId);
            
            btn.style.display = 'none';
            cupomDiv.innerText = cupomCodigo;
            cupomDiv.style.display = 'block';

            abrirModalDoma('Resgate de Sucesso! 🎉', 'Parabéns, Domador! Você conquistou essa recompensa com o seu próprio esforço diário. Copie o código e use no checkout.', 'sucesso');
            verificarLoja();
        } else {
            abrirModalDoma('Quase lá! ⏳', 'Faltam apenas ' + (custo - moedasTotais) + ' moedas. Continue se cuidando para liberar este prêmio!', 'alerta');
        }
    }

    function verificarLoja() {
        const precos = { 'btn-compra-1': 200, 'btn-compra-2': 400, 'btn-compra-3': 600 };
        for (const [btnId, custo] of Object.entries(precos)) {
            const btn = document.getElementById(btnId);
            if (btn && btn.style.display !== 'none') {
                if (moedasTotais >= custo) {
                    btn.disabled = false;
                    btn.innerText = '🔓 RESGATAR (' + custo + ' 🪙)';
                } else {
                    btn.disabled = true;
                    btn.innerText = '🔒 FALTAM ' + (custo - moedasTotais) + ' 🪙';
                }
            }
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        atualizarCarteiraUI();
        verificarLoja();
    });
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
        // Ligamos a bandeira de supressão: os elementos deste capítulo já
        // estão TODOS no DOM neste ponto (acabamos de injetar o HTML dele),
        // então qualquer DOMContentLoaded que esses scripts registrem vai
        // encontrar seus elementos de cara — não precisa (e não deve) ser
        // re-executado quando outro capítulo carregar depois.
        if (typeof window.__domaSuprimirRegistroRefire !== 'undefined') {
            window.__domaSuprimirRegistroRefire = true;
        }
        container.querySelectorAll('script').forEach(function (antigo) {
            const novo = document.createElement('script');
            for (const attr of antigo.attributes) novo.setAttribute(attr.name, attr.value);
            novo.textContent = antigo.textContent;
            antigo.replaceWith(novo);
        });
        if (typeof window.__domaSuprimirRegistroRefire !== 'undefined') {
            window.__domaSuprimirRegistroRefire = false;
        }
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

        if (proximaPagina >= indexTribunal && !isUsuarioPremium && !window.__domaModoTeste) {
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
        // (ignorada no modo de teste, pra permitir pular direto pra qualquer slide)
        if (!window.__domaModoTeste && idAlvo !== 'pag-3' && idAlvo !== 'pag-roleta' && alvoIndex > maxPaginaAlcancada) {
            return; // Corta a ação na raiz. Mesmo que clique, não abre!
        }
        if (window.__domaModoTeste && alvoIndex > maxPaginaAlcancada) {
            maxPaginaAlcancada = alvoIndex;
        }

        if (alvoIndex >= indexTribunal && !isUsuarioPremium && !window.__domaModoTeste) {
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



    let audioLiberado = false;
    let audioCtx = null;

    function initAudio() {
        if (audioLiberado) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            audioLiberado = true;
        } catch(e) {}
    }

    document.body.addEventListener('click', initAudio, { once: true });
    document.body.addEventListener('touchstart', initAudio, { once: true });

    function bip(f, t, d, delay = 0) {
        if (!audioCtx || !audioLiberado) return;
        try {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.type = t; o.frequency.setValueAtTime(f, audioCtx.currentTime + delay);
            g.gain.setValueAtTime(0.1, audioCtx.currentTime + delay);
            g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + d);
            o.connect(g); g.connect(audioCtx.destination);
            o.start(audioCtx.currentTime + delay); o.stop(audioCtx.currentTime + delay + d);
        } catch(e) {}
    }
    
    const tocarPlim = () => bip(880, 'sine', 0.3);
    const tocarTriploPlim = () => { bip(880, 'sine', 0.1, 0); bip(880, 'sine', 0.1, 0.15); bip(880, 'sine', 0.3, 0.3); };
    const somAcerto = () => { bip(523, 'sine', 0.2, 0); bip(659, 'sine', 0.2, 0.1); bip(783, 'sine', 0.3, 0.2); };
    const tocarSomMagico = () => { bip(880, 'sine', 0.2, 0); bip(1108, 'sine', 0.2, 0.1); };

    // ==========================================
    // MODAIS E ALERTAS DE SIRENE
    // ==========================================
    function fecharModal() {
        const overlay = document.getElementById('domaModal');
        const box = document.getElementById('domaModalBox');
        overlay.style.opacity = '0';
        box.style.transform = 'scale(0.8)';
        setTimeout(() => { overlay.style.display = 'none'; }, 300);
    }

    function abrirModalDoma(titulo, texto, tipo, acaoAposFechar = null) {
        const overlay = document.getElementById('domaModal');
        const box = document.getElementById('domaModalBox');
        const tit = document.getElementById('domaModalTitulo');
        const txt = document.getElementById('domaModalTexto');
        const img = document.getElementById('domaModalImg');
        const btnOk = document.querySelector('.doma-modal-btn'); 

        if (!overlay) {
            if(acaoAposFechar) acaoAposFechar();
            return;
        }

        if (tipo === 'sucesso') {
            img.src = 'https://i.postimg.cc/cHCq7BvW/autoestisma.png'; img.style.borderColor = '#10b981'; 
            tit.style.color = '#047857';
        } else if (tipo === 'amor') {
            img.src = 'https://i.postimg.cc/ht0PpMtg/amor-proprio.png'; img.style.borderColor = '#be185d';
            tit.style.color = '#be185d';
        } else if (tipo === 'alerta') {
            img.src = 'https://i.postimg.cc/7LxrhkDv/ansiedade.png'; img.style.borderColor = '#e11d48';
            tit.style.color = '#be123c';
            bip(300, 'sawtooth', 0.15); setTimeout(()=>bip(250, 'sawtooth', 0.2), 200); // Som de Sirene
        } else {
            img.src = 'https://i.postimg.cc/HLGxyf9V/Captura-de-tela-2025-09-27-133248.png'; img.style.borderColor = '#f59e0b';
            tit.style.color = '#b45309';
        }

        tit.innerText = titulo; txt.innerHTML = texto ?? "";
        
        btnOk.onclick = function() {
            overlay.style.opacity = '0';
            box.style.transform = 'scale(0.8)';
            setTimeout(() => { overlay.style.display = 'none'; }, 300);
            if (acaoAposFechar) setTimeout(acaoAposFechar, 350); 
        };
        
        overlay.style.display = 'flex';
        setTimeout(() => { overlay.style.opacity = '1'; box.style.transform = 'scale(1)'; }, 10);
    }

    function seMarcado(cb, msg, tipo) { if (cb.checked) abrirModalDoma('Você é Brilhante! ✨', msg, tipo); }
    function selecionarTag(btn) { btn.classList.toggle('selecionado'); if(btn.classList.contains('selecionado')) tocarPlim(); }
    
    function revelarDesidentificacao(btn) {
        tocarSomMagico();
        btn.classList.remove('btn-tremor'); 
        btn.style.display = 'none';
        const rev = btn.nextElementSibling;
        if(rev) rev.style.display = 'block';
    }

    function guardarNoTesouro() {
        const input = document.getElementById('input-vitoria-pote');
        const val = input.value;
        const empty = document.getElementById('pote-vazio-texto');
        
        if(val.trim() === '') {
            abrirModalDoma('🚨 EM BRANCO!', 'O pote não aceita o vazio. Escreva sua vitória antes de guardar!', 'alerta');
            return;
        }

        if(!isCoerente(val)) {
            abrirModalDoma('🚨 CONCENTRE-SE!', 'O texto digitado não parece fazer sentido. Por favor, respire, concentre-se e escreva uma vitória real. Não trapaceie sua própria mente.', 'alerta');
            return;
        }

        if(empty) empty.style.display = 'none';
        const novaVit = document.createElement('div');
        novaVit.innerHTML = '✨ ' + val + ' ✨';
        novaVit.style.background = '#fbbf24'; novaVit.style.color = '#78350f';
        novaVit.style.padding = '10px 15px'; novaVit.style.borderRadius = '15px';
        novaVit.style.margin = '5px auto'; novaVit.style.fontWeight = 'bold';
        novaVit.style.animation = 'fadeSlide 0.5s ease-out forwards';
        document.getElementById('area-vitorias-pote').appendChild(novaVit);
        input.value = '';
        
        let jaGanhou = localStorage.getItem('doma_task_pote');
        if(!jaGanhou) {
            ganharMoedas(10, null);
            localStorage.setItem('doma_task_pote', 'true');
        }
    }

    // ==========================================
    // JOGO DA MEMÓRIA COM ANTI-FARMING (RECORDE)
    // ==========================================
    const monstrosMem = [
        { n: "CAOS", i: "https://i.postimg.cc/7LxrhkDv/ansiedade.png" },
        { n: "VALOR", i: "https://i.postimg.cc/cHCq7BvW/autoestisma.png" },
        { n: "SOLIDÃO", i: "https://i.postimg.cc/ht0PpMtg/amor-proprio.png" },
        { n: "RAIVA", i: "https://i.postimg.cc/d34cGNBq/Laranja.png" },
        { n: "MEDO", i: "https://i.postimg.cc/ZRzWQ0h6/Coracao.png" },
        { n: "CULPA", i: "https://i.postimg.cc/SN1Jhgpr/Captura-de-tela-2026-03-24-151245-removebg-preview.png" }
    ];
    let cartasM = [...monstrosMem, ...monstrosMem];
    let selCards = [], encM = [], nomesEncM = [], pts = 0, jogandoM = false;

    function iniciarFluxoDoJogo() {
        initAudio();
        // irParaTela('tela-game');
        setTimeout(montarGridM, 100);
    }

    function montarGridM() {
        if (timerIdx) clearInterval(timerIdx);
        const grid = document.getElementById('grid');
        document.getElementById('status-jogo').style.display = 'flex';
        document.getElementById('game-final').style.display = 'none';
        grid.style.display = 'grid'; grid.innerHTML = '';
        pts = 0; document.getElementById('game-pts').innerText = "0";
        encM = []; nomesEncM = []; selCards = [];
        
        cartasM.sort(() => 0.5 - Math.random());
        cartasM.forEach((m, i) => {
            const c = document.createElement('div'); c.className = 'game-card flipped'; 
            c.onclick = () => {
                if (!jogandoM || selCards.some(s => s.id === i) || encM.includes(i)) return;
                bip(400, 'sine', 0.1); c.classList.add('flipped');
                selCards.push({ nome: m.n, el: c, id: i });
                
                if (selCards.length === 2) {
                    jogandoM = false;
                    setTimeout(() => {
                        if (selCards[0].nome === selCards[1].nome) {
                            encM.push(selCards[0].id, selCards[1].id);
                            nomesEncM.push(selCards[0].nome);
                            pts += 10; document.getElementById('game-pts').innerText = pts;
                            somAcerto();
                            tocarTriploPlim(); 
                        } else {
                            selCards[0].el.classList.remove('flipped');
                            selCards[1].el.classList.remove('flipped');
                            bip(150, 'sawtooth', 0.2); 
                        }
                        selCards = []; jogandoM = true;
                        if (encM.length === cartasM.length) finalizarM();
                    }, 600);
                }
            };
            c.innerHTML = `<div class="card-face face-front"><img src="${m.i}" class="img-m"><span>${m.n}</span></div><div class="card-face face-back"><img src="https://i.postimg.cc/nz7dRt0b/Captura-de-tela-2025-09-27-133248.png" class="img-doma-logo"></div>`;
            grid.appendChild(c);
        });

        let tMemo = 30; 
        document.getElementById('game-timer').innerText = `Memorize: ${tMemo}s`; 
        timerIdx = setInterval(() => {
            tMemo--; document.getElementById('game-timer').innerText = `Memorize: ${tMemo}s`; bip(880, 'sine', 0.05); 
            if (tMemo <= 0) {
                clearInterval(timerIdx);
                document.querySelectorAll('.game-card').forEach(el => el.classList.remove('flipped'));
                jogandoM = true; partidaM();
            }
        }, 1000);
    }

    function partidaM() {
        let tJogo = 180; 
        document.getElementById('game-timer').innerText = `Tempo: ${tJogo}s`;
        timerIdx = setInterval(() => {
            tJogo--; document.getElementById('game-timer').innerText = `Tempo: ${tJogo}s`;
            if (tJogo <= 0) finalizarM();
        }, 1000);
    }

function finalizarM() {
    clearInterval(timerIdx); jogandoM = false;
    document.getElementById('grid').style.display = 'none';
    document.getElementById('status-jogo').style.display = 'none';
    document.getElementById('game-final').style.display = 'block';
    document.getElementById('final-pts').innerText = pts;
    const list = document.getElementById('acolhidos-list');
    list.innerHTML = '';
    [...new Set(nomesEncM)].forEach(n => {
        const s = document.createElement('span'); s.className = 'tag-acolhido'; s.innerText = n; list.appendChild(s);
    });

    // RECOMPENSA COM BASE NO RECORDE E TRAVA DE 60 MOEDAS
    // Garante que o sistema nunca contabilize mais de 60 pontos para moedas
    let pontuacaoFinal = pts > 60 ? 60 : pts;
    
    let maxMemoria = parseInt(localStorage.getItem('doma_max_memoria')) || 0;
    
    // Se a pontuação desta rodada for maior que o recorde antigo, paga a diferença
    if (pontuacaoFinal > maxMemoria) {
        let ganho = pontuacaoFinal - maxMemoria;
        localStorage.setItem('doma_max_memoria', pontuacaoFinal);
        
        // Delay de 500ms para a tela de Game Over abrir antes das moedas voarem
        setTimeout(() => {
            if (typeof ganharMoedas === 'function') {
                ganharMoedas(ganho, null);
            }
        }, 500);
    }
}

    function resetGame() { montarGridM(); }

    
    
    
    
    
    
    
    
    
    
    
    
    
  
    
    
    
 // ==========================================
// CONTROLE DE ÁUDIOS
// ==========================================
let loopCoracaoAtivo = null;

function tocarBatimentoCoracao() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        function batida(tempo) {
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.frequency.setValueAtTime(40, ctx.currentTime + tempo); 
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(ctx.currentTime + tempo);
            gain.gain.setValueAtTime(1, ctx.currentTime + tempo);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + tempo + 0.15);
            osc.stop(ctx.currentTime + tempo + 0.15);
        }
        batida(0); batida(0.25); batida(1.0); batida(1.25);
    } catch(e) {}
}

function iniciarBatimentoContinuo() {
    if (loopCoracaoAtivo) clearInterval(loopCoracaoAtivo);
    tocarBatimentoCoracao(); 
    loopCoracaoAtivo = setInterval(tocarBatimentoCoracao, 1600);
}

function pararBatimentoContinuo() {
    if (loopCoracaoAtivo) { clearInterval(loopCoracaoAtivo); loopCoracaoAtivo = null; }
}

function tocarAlarmeForte() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start();
        gain.gain.setValueAtTime(0.2, ctx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.stop(ctx.currentTime + 0.8);
    } catch(e) {}
}

function tocarSomMagicoDoma() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const playNote = (freq, startTime) => {
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.type = 'sine'; osc.frequency.value = freq;
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(ctx.currentTime + startTime);
            gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + 1.5);
            osc.stop(ctx.currentTime + startTime + 1.5);
        };
        playNote(523.25, 0); playNote(659.25, 0.15); playNote(783.99, 0.3); playNote(1046.50, 0.45); 
    } catch(e) {}
}

// ==========================================
// BANCO DE DADOS DE TEXTOS ORIGINAIS 
// ==========================================
const cardsDoma = {
    ins: { n: "Insegurança 🎭", s: "A Síndrome do Impostor", t: "<p><strong>O Diagnóstico:</strong> Seu monstrinho da Insegurança assumiu o controle. 🚨 Ele sussurra diariamente que as suas conquistas foram 'sorte' e que logo descobrirão que você é uma fraude.</p><p><strong>A Ação Clínica:</strong> Acolha essa voz. Ela tenta te proteger da humilhação, mas usa a tática errada. O antídoto é ancorar-se em fatos reais: o seu suor e a sua trajetória não mentem. 🌟 <strong style='color:#ff9f43;'>Assuma o mérito do seu palco.</strong></p>" },
    med: { n: "Medo 🛡️", s: "A Prisão do Conforto", t: "<p><strong>O Diagnóstico:</strong> O seu Inconsciente construiu uma fortaleza com muros altos demais. 🧱 O Medo paralisou a sua ação, projetando tragédias e cenários catastróficos que ainda nem existem.</p><p><strong>A Ação Clínica:</strong> O medo não é um inimigo, é um guarda-costas hiperativo. Agradeça a proteção, mas assuma a liderança. 👣 <strong style='color:#ff9f43;'>Dê um pequeno passo hoje em direção ao que te assusta</strong>, mostrando à sua mente que é seguro avançar.</p>" },
    cul: { n: "Culpa ⛓️", s: "O Juiz Implacável", t: "<p><strong>O Diagnóstico:</strong> A Culpa está te fazendo carregar o peso do mundo. ⚖️ Você se pune severamente por erros passados, por não dar conta de tudo ou por tentar priorizar a si mesmo(a).</p><p><strong>A Ação Clínica:</strong> A culpa clínica paralisa e esgota a sua energia vital. Transforme culpa em <em>responsabilidade</em>. O que pode ser reparado, repare. O que não pode, perdoe. 🕊️ <strong style='color:#ff9f43;'>O Domador tem o direito de ser imperfeito e seguir em frente.</strong></p>" },
    ans: { n: "Caos 🌪️", s: "A Ansiedade Paralisante", t: "<p><strong>O Diagnóstico:</strong> O seu monstrinho do Caos vive no futuro. ⏳ Ele acelera o seu coração antecipando dores que não aconteceram e consome 100% da energia do seu corpo no presente.</p><p><strong>A Ação Clínica:</strong> O antídoto imediato para a ansiedade é o corpo. Volte para o 'Aqui e Agora'. 🧘‍♀️ <strong style='color:#ff9f43;'>Pratique a atenção plena e limite o seu campo de visão apenas ao próximo passo possível.</strong> O amanhã não te pertence hoje.</p>" },
    con: { n: "Controle 🧱", s: "O Peso da Perfeição", t: "<p><strong>O Diagnóstico:</strong> O seu monstrinho do Controle te convenceu de que se você não cuidar de tudo, o mundo desaba. ⚠️ Esse perfeccionismo extremo é, na verdade, a armadura da sua exaustão.</p><p><strong>A Ação Clínica:</strong> O verdadeiro tratamento aqui é suportar a vulnerabilidade. 🤝 <strong style='color:#ff9f43;'>Delegue uma tarefa pequena hoje e tolere o desconforto de não sair do 'seu jeito'.</strong> O mundo continuará girando, e você poderá finalmente respirar.</p>" },
    rai: { n: "Raiva 🔥", s: "O Fogo Não Direcionado", t: "<p><strong>O Diagnóstico:</strong> A raiva contida e não expressada está inflamando o seu corpo (dores, tensões). 🌋 Limites foram ultrapassados e o seu monstrinho está gritando por justiça e espaço.</p><p><strong>A Ação Clínica:</strong> A raiva clínica não é um defeito; é energia de proteção territorial. Use esse fogo psíquico para colocar limites claros e assertivos. 🛑 <strong style='color:#ff9f43;'>Diga 'não' sem dar explicações prolongadas. Honre o seu espaço sagrado.</strong></p>" },
    aut: { n: "Baixa Autoestima 🪞", s: "O Espelho Distorcido", t: "<p><strong>O Diagnóstico:</strong> O monstrinho da Baixa Autoestima sequestrou a sua autoimagem. 🕳️ Ele te convenceu de que você é 'menos', aceitando migalhas afetivas e profissionais porque no fundo acha que não tem valor.</p><p><strong>A Ação Clínica:</strong> O amor-próprio não é um sentimento, é uma prática diária. Comece a se tratar com a mesma lealdade que você tem com os outros. 👑 <strong style='color:#ff9f43;'>Pare de negociar o seu valor e ocupe o espaço que é seu por direito.</strong></p>" },
    rej: { n: "Rejeição 💔", s: "A Ferida do Abandono", t: "<p><strong>O Diagnóstico:</strong> O seu Inconsciente registrou uma dor tão profunda no passado que hoje a Rejeição assume o leme. 🥀 Fazendo você hipervigilante a qualquer sinal de distanciamento, ou te fazendo fugir antes de ser deixado.</p><p><strong>A Ação Clínica:</strong> Acolha a criança interior que tem medo de ser deixada para trás. O adulto de hoje sobrevive à rejeição do outro. ❤️‍🩹 <strong style='color:#ff9f43;'>Você é inteiro(a), não uma metade buscando aprovação para existir.</strong></p>" },
    vaz: { n: "Vazio 🕳️", s: "O Buraco Sem Fundo", t: "<p><strong>O Diagnóstico:</strong> O monstrinho do Vazio representa a desconexão consigo mesmo(a). 🌌 Gerando um eco interno que você tenta tapar compulsivamente com distrações, rolagens de tela e anestésicos emocionais.</p><p><strong>A Ação Clínica:</strong> Pare de tentar preencher o Vazio com coisas externas. O antídoto para o vazio não é o excesso, é a presença genuína. 🌱 <strong style='color:#ff9f43;'>Suporte o tédio momentâneo e volte a habitar o seu corpo.</strong></p>" }
};

const bibliotecaMonstrosDoma = {
    ins: { cap: " INSEGURANÇA 🎭", cor: "#6c5ce7", gradiente: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)", afeta: "Sua autoconfiança e capacidade de execução. 🛑 <strong style='color:#6c5ce7; font-size:1.1em;'>Ela sabota seu palco</strong>, fazendo você esconder seus talentos por acreditar que não são bons o suficiente.", corpo: "💥 Hesitação nas decisões, mãos inquietas e respiração presa na garganta.", emocionais: "Sensação crônica de ser uma fraude <strong>(Síndrome do Impostor)</strong>, tristeza por não se sentir reconhecido(a) e angústia constante antes de qualquer exposição.", alerta: "A Insegurança é apenas você duvidando do seu próprio valor diante do mundo. 👁️", pergunta: "Diz uma coisa: você é realmente 'humilde' ou tem pavor de que as pessoas descubram que você acha que não sabe o que está fazendo? 🎯" },
    med: { cap: " MEDO 🛡️", cor: "#d63031", gradiente: "linear-gradient(135deg, #ff7675 0%, #d63031 100%)", afeta: "Seu avanço e crescimento. 🧱 <strong style='color:#d63031; font-size:1.1em;'>O Medo constrói muros mentais tão altos</strong> que te impedem de acessar novas oportunidades na vida pessoal e profissional.", corpo: "💥 Paralisia física, batimento acelerado e vontade súbita de fugir do ambiente.", emocionais: "Pânico antecipatório, frustração por perder oportunidades e uma <strong>sensação de estagnação</strong> que corrói a autoestima dia após dia.", alerta: "O Medo verdadeiro te protege do perigo real; a Ansiedade te protege de algo que nem aconteceu ainda. 👁️", pergunta: "Olha para a sua rotina agora: você está se protegendo de um perigo real ou o seu medo já trancou a porta da sua vida por dentro? 🎯" },
    cul: { cap: " CULPA ⛓️", cor: "#636e72", gradiente: "linear-gradient(135deg, #b2bec3 0%, #636e72 100%)", afeta: "Seu direito ao autocuidado e ao descanso. ⚖️ <strong style='color:#636e72; font-size:1.1em;'>A Culpa te obriga a carregar problemas que não são seus</strong>, esgotando sua energia vital.", corpo: "💥 Peso literal nos ombros, olhar baixo e exaustão extrema no final do dia.", emocionais: "Autopunição severa, melancolia constante, incapacidade de dizer 'não' e <strong>ressentimento velado</strong> por sempre se colocar em último lugar.", alerta: "A Responsabilidade corrige o erro para você avançar; a Culpa apenas te castiga e te deixa paralisado no mesmo lugar. 👁️", pergunta: "Você carrega esse peso porque quer aprender a ser uma pessoa melhor ou porque se sente confortável no papel de culpado para não ter que mudar? 🎯" },
    ans: { cap: " ANSIEDADE ⏳", cor: "#f1c40f", gradiente: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)", afeta: "Sua presença no 'Aqui e Agora'. 🌪️ <strong style='color:#f39c12; font-size:1.1em;'>A Ansiedade suga 100% da sua energia</strong> lidando com um futuro catastrófico que só existe dentro da sua mente.", corpo: "💥 Aperto constante no peito, agitação motora e incapacidade de relaxar os músculos.", emocionais: "Esgotamento mental, irritabilidade sem motivo, <strong>'névoa mental'</strong> (dificuldade de foco) e urgência de resolver tudo imediatamente.", alerta: "Estar 'ocupado' o tempo todo não é ser produtivo. Às vezes é só a Ansiedade te fazendo correr em círculos para não pensar. 👁️", pergunta: "Se você parasse de correr agora, o que sobraria dos seus planos? Você consegue aguentar o silêncio do momento presente? 🎯" },
    con: { cap: " CONTROLE 🕯️", cor: "#2d3436", gradiente: "linear-gradient(135deg, #636e72 0%, #2d3436 100%)", afeta: "Sua capacidade de delegação e relaxamento. 🕸️ <strong style='color:#2d3436; font-size:1.1em;'>O Controle disfarçado de perfeccionismo te isola</strong>, pois você acredita que só você sabe fazer o certo.", corpo: "💥 Sensações difusas, tensão no maxilar e dor de cabeça crônica.", emocionais: "Sobrecarga extrema, solidão silenciosa, <strong>rigidez emocional severa</strong> e pânico diante da vulnerabilidade de depender de alguém.", alerta: "Nem toda dor tem nome fácil no dicionário, mas todas elas ocupam um espaço vital dentro do seu corpo. 👁️", pergunta: "Qual é a dor que você carrega há anos, mas nunca teve coragem de contar por medo de que, ao dar um nome a ela, ela devore quem você costuma ser? 🎯" },
    rai: { cap: " RAIVA 🔥", cor: "#e67e22", gradiente: "linear-gradient(135deg, #fab1a0 0%, #e17055 100%)", afeta: "Suas relações interpessoais e a comunicação dos seus limites. 🌋 <strong style='color:#e67e22; font-size:1.1em;'>Ela destrói pontes quando explode</strong> e inflama seu corpo quando é engolida.", corpo: "💥 Calor imediato no rosto, punhos cerrados e mandíbula travada.", emocionais: "Indignação crônica, sentimento constante de injustiça, reatividade extrema e uma <strong>culpa profunda</strong> logo após as explosões.", alerta: "Explosão não é 'personalidade forte'. É apenas o monstro assumindo a direção quando você perde completamente o leme. 👁️", pergunta: "Quem é o dono da sua voz hoje: você ou o monstro inflamado que grita quando as coisas não saem do seu jeito? 🎯" },
    aut: { cap: " BAIXA AUTOESTIMA 🪞", cor: "#e84393", gradiente: "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)", afeta: "Sua percepção de merecimento. 📉 <strong style='color:#e84393; font-size:1.1em;'>Ela distorce o espelho</strong>, fazendo você acreditar que as sobras de afeto ou de reconhecimento são tudo o que você merece ter.", corpo: "💥 Postura encurvada, voz que 'some' para dentro e dificuldade de manter contato visual prolongado.", emocionais: "Constante sensação de inferioridade, autoabandono crônico e a crença de que precisa <strong>'comprar' o amor dos outros</strong> agradando o tempo todo.", alerta: "A Baixa Autoestima adora se vestir de 'humildade' para justificar por que você não ocupa o espaço que é seu por direito. 👁️", pergunta: "Até quando você vai continuar pedindo desculpas por existir, diminuindo a sua luz para não ofuscar quem não sabe brilhar? 🎯" },
    rej: { cap: " REJEIÇÃO 💔", cor: "#0984e3", gradiente: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)", afeta: "A sua capacidade de criar laços reais e de se expor. 🏃‍♂️ <strong style='color:#0984e3; font-size:1.1em;'>O pavor de ouvir um 'não' te faz fugir antes</strong> mesmo de tentar, ou te torna excessivamente submisso(a).", corpo: "💥 Sensação de 'frio' no estômago, respiração travada e náusea diante de críticas, mesmo as construtivas.", emocionais: "Hipersensibilidade à opinião alheia, isolamento preventivo (você abandona antes de ser abandonado) e <strong>ciúme irracional</strong>.", alerta: "O monstro da Rejeição mente dizendo que você não é amável. Mas na verdade, é você quem está rejeitando a si mesmo(a) em primeiro lugar. 👁️", pergunta: "O que dói mais: correr o risco de não ser escolhido(a) por alguém, ou viver com a certeza de que você não está se escolhendo? 🎯" },
    vaz: { cap: " VAZIO 🕳️", cor: "#8e44ad", gradiente: "linear-gradient(135deg, #a29bfe 0%, #8e44ad 100%)", afeta: "O seu propósito e a sua saciedade. 🕳️ <strong style='color:#8e44ad; font-size:1.1em;'>Ele é um buraco negro que você tenta preencher compulsivamente</strong> e que nunca se fecha.", corpo: "💥 Sensação de oco no peito, fadiga profunda sem esforço físico e insônia na madrugada, quando o silêncio grita.", emocionais: "Apatia (nada tem graça), tédio crônico, compulsões anestésicas e a sensação de estar <strong>'desconectado(a)'</strong> da própria vida.", alerta: "O Vazio não é a falta de algo externo; é o sintoma clínico da sua desconexão profunda com a sua própria essência. 👁️", pergunta: "Se você parasse de se anestesiar e de fugir para o celular ou para a comida agora, o que esse silêncio no peito estaria tentando te dizer? 🎯" }
};

// ==========================================
// AS 45 QUESTÕES DO QUIZ 
// ==========================================
const quizDoma = [
    { q: "Eu frequentemente duvido da minha capacidade, mesmo quando as pessoas me elogiam muito.", c: "ins" },
    { q: "Eu deixo de tentar coisas novas ou aceitar desafios por imaginar os piores cenários possíveis.", c: "med" },
    { q: "Sinto um peso e um desconforto enorme quando tiro um tempo para descansar ou cuidar só de mim.", c: "cul" },
    { q: "Minha mente não desliga. Na cama, fico antecipando problemas e conversas que terei no dia seguinte.", c: "ans" },
    { q: "Fico extremamente irritado(a) quando as coisas fogem do meu planejamento ou não são feitas do meu jeito.", c: "con" },
    { q: "Muitas vezes, engulo 'sapos' para evitar brigas, mas sinto meu corpo queimar de frustração e tensão por dentro.", c: "rai" },
    { q: "Sinto que, a qualquer momento, as pessoas vão perceber que eu não sou tão bom/boa quanto acham.", c: "ins" },
    { q: "Prefiro ficar na minha rotina garantida do que me expor a situações onde o resultado é incerto.", c: "med" },
    { q: "Tenho muita dificuldade de dizer 'não' e acabo assumindo responsabilidades que são dos outros.", c: "cul" },
    { q: "Sinto aperto no peito, respiração curta ou coração acelerado sem um motivo físico aparente.", c: "ans" },
    { q: "Se eu não conferir e revisar o que foi feito por outra pessoa, sinto que algo terrível vai dar errado.", c: "con" },
    { q: "Tenho explosões repentinas de impaciência com coisas pequenas, seguidas de arrependimento.", c: "rai" },
    { q: "Comparo constantemente os meus bastidores com o palco e o sucesso das outras pessoas nas redes.", c: "ins" },
    { q: "O medo de ser julgado(a) ou rejeitado(a) dita a forma como eu me visto ou o que eu falo.", c: "med" },
    { q: "Me sinto responsável pela felicidade e pelo bem-estar emocional das pessoas que amo.", c: "cul" },
    { q: "Sofro de 'névoa mental', esquecimentos e dificuldade extrema de focar em uma única tarefa no presente.", c: "ans" },
    { q: "Sinto que a minha régua de exigência comigo mesmo(a) é cruel e quase inatingível.", c: "con" },
    { q: "Sinto dores crônicas (como na lombar, nuca ou maxilar) que pioram muito quando estou frustrado(a).", c: "rai" },
    { q: "Minimizo minhas vitórias dizendo que 'não fiz mais que a obrigação' ou que 'foi fácil'.", c: "ins" },
    { q: "Adio decisões importantes por medo crônico de fazer a escolha errada e me arrepender.", c: "med" },
    { q: "Revivo conversas do passado na mente, pensando em como eu deveria ter agido de forma diferente.", c: "cul" },
    { q: "Sinto uma urgência constante, como se eu estivesse sempre atrasado(a) para algo que nem sei o que é.", c: "ans" },
    { q: "Tenho dificuldade de delegar tarefas, pois acho que ninguém fará com o mesmo cuidado que eu.", c: "con" },
    { q: "Me sinto invisível ou desvalorizado(a) pelo tanto que eu me esforço nos meus relacionamentos ou no trabalho.", c: "rai" },
    { q: "Acho que as pessoas estão sendo apenas educadas quando me dão um feedback positivo.", c: "ins" },
    { q: "O frio na barriga diante do novo me faz recuar em vez de me impulsionar para frente.", c: "med" },
    { q: "Peço desculpas o tempo todo, até mesmo por coisas que não foram culpa minha.", c: "cul" },
    { q: "Minha necessidade de estar sempre alerta e preparado(a) me causa uma exaustão profunda.", c: "ans" },
    { q: "Organizar e limpar o ambiente é a forma que encontro para acalmar a confusão dentro de mim.", c: "con" },
    { q: "Ajo com sarcasmo ou ironia quando me sinto ferido(a) em vez de comunicar claramente meu limite.", c: "rai" },
    { q: "Sinto que preciso provar o meu valor através do trabalho duro para ser digno(a) de amor.", c: "ins" },
    { q: "Mantenho relações ou situações desgastantes apenas pelo pavor de ter que lidar com o desconhecido.", c: "med" },
    { q: "Sinto que se eu me colocar em primeiro lugar, estarei sendo uma pessoa egoísta e ruim.", c: "cul" },
    { q: "Crio 'planos B, C e D' na mente para tentar me proteger de coisas que raramente acontecem.", c: "ans" },
    { q: "A ideia de depender da ajuda de outra pessoa me causa uma angústia terrível.", c: "con" },
    { q: "Sinto vontade de chorar de raiva quando meus limites são testados repetidamente.", c: "rai" },
    { q: "Sinto que não sou tão importante assim e que qualquer atenção que recebo é uma espécie de 'favor'.", c: "aut" },
    { q: "Geralmente aceito menos do que mereço no trabalho ou no amor, porque acho que não conseguiria nada melhor.", c: "aut" },
    { q: "Tenho o hábito de focar quase exclusivamente nos meus defeitos físicos e falhas quando me olho no espelho.", c: "aut" },
    { q: "Prefiro não expor minhas ideias ou sentimentos por pavor absoluto de ouvir um 'não' ou de ser ignorado(a).", c: "rej" },
    { q: "Ao menor sinal de que alguém está distante ou demorando a responder, sinto que fiz algo errado e serei abandonado(a).", c: "rej" },
    { q: "Muitas vezes abro mão do que eu quero só para agradar os outros e garantir que eles continuem gostando de mim.", c: "rej" },
    { q: "Sinto um oco no peito que tento preencher o tempo todo com comida, compras, redes sociais ou vícios rápidos.", c: "vaz" },
    { q: "Mesmo estando rodeado(a) de pessoas, muitas vezes sinto uma solidão profunda e uma sensação de que 'nada tem graça'.", c: "vaz" },
    { q: "Tenho a sensação de que estou apenas vivendo no 'piloto automático', sem um propósito ou alegria genuína na rotina.", c: "vaz" }
];

let quizIndex = 0; 
let pontosQuiz = {}; 
let monstroVencedor = '';

function começarQuiz() {
    if(typeof initAudio === 'function') initAudio();
    document.getElementById('TELA_INTRO').style.display = 'none';
    document.getElementById('TELA_QUIZ').style.display = 'flex';
    quizIndex = 0; 
    pontosQuiz = { ins: 0, med: 0, cul: 0, ans: 0, con: 0, rai: 0, aut: 0, rej: 0, vaz: 0 };
    renderizarPergunta();
}

function renderizarPergunta() {
    const holder = document.getElementById('CONTEUDO_QUESTOES');
    holder.innerHTML = '';
    if (quizIndex >= quizDoma.length) { finalizarQuiz(); return; }

    const p = quizDoma[quizIndex];
    let pct = (quizIndex / quizDoma.length) * 100;
    document.getElementById('FILL_PROG').style.width = pct + '%';
    let ovo = document.getElementById('OVO_CAMINHANTE');
    ovo.style.left = pct + '%';
    ovo.classList.remove('pulo'); void ovo.offsetWidth; ovo.classList.add('pulo');
    
    const sCam = document.getElementById('S_CAMINHA');
    if(sCam) { sCam.currentTime = 0; sCam.play().catch(e=>{}); }

    const qBox = document.createElement('div'); qBox.className = 'questao-animada';
    let sub = document.createElement('div');
    sub.style.color = '#94a3b8'; sub.style.fontSize = '0.85rem'; sub.style.fontWeight = 'bold'; sub.style.textAlign = 'center';
    sub.innerText = `QUESTÃO ${quizIndex + 1} DE ${quizDoma.length}`; qBox.appendChild(sub);

    let titulo = document.createElement('div'); titulo.className = 'pergunta-texto'; titulo.innerText = p.q; qBox.appendChild(titulo);

    let b1 = document.createElement('button'); b1.className = 'btn-voto'; b1.innerText = 'NUNCA'; b1.onclick = () => avancarPergunta(p.c, 0);
    let b2 = document.createElement('button'); b2.className = 'btn-voto'; b2.innerText = 'ÀS VEZES'; b2.onclick = () => avancarPergunta(p.c, 1);
    let b3 = document.createElement('button'); b3.className = 'btn-voto'; b3.innerText = 'QUASE SEMPRE'; b3.onclick = () => avancarPergunta(p.c, 2);
    let b4 = document.createElement('button'); b4.className = 'btn-voto'; b4.innerText = 'SEMPRE SOU EU'; b4.onclick = () => avancarPergunta(p.c, 3);

    qBox.appendChild(b1); qBox.appendChild(b2); qBox.appendChild(b3); qBox.appendChild(b4);
    holder.appendChild(qBox);
}

function avancarPergunta(categoria, peso) { 
    pontosQuiz[categoria] += peso; 
    quizIndex++; 
    renderizarPergunta(); 
}

function finalizarQuiz() {
    document.getElementById('FILL_PROG').style.width = '100%';
    document.getElementById('OVO_CAMINHANTE').style.left = '100%';
    setTimeout(() => { 
        document.getElementById('TELA_QUIZ').style.display = 'none'; 
        document.getElementById('TELA_QUEBRA').style.display = 'flex'; 
    }, 800);
}

// ==========================================
// SISTEMA DE QUEBRA DO OVO
// ==========================================
let batidas = 0; 
const maxBatidas = 10; 

function baterOvo(e) {
    if (batidas >= maxBatidas) return;
    batidas++;
    const sBat = document.getElementById('S_BATIDA'); 
    if(sBat) { sBat.currentTime = 0; sBat.play().catch(er=>{}); }

    let clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth/2);
    let clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight/2);

    const batidaVis = document.createElement('div'); batidaVis.className = 'efeito-batida-visual';
    batidaVis.style.left = clientX + 'px'; batidaVis.style.top = clientY + 'px'; 
    document.body.appendChild(batidaVis);
    
    const onda = document.createElement('div'); onda.className = 'onda-choque';
    onda.style.left = clientX + 'px'; onda.style.top = clientY + 'px'; 
    document.body.appendChild(onda);

    setTimeout(() => { batidaVis.remove(); onda.remove(); }, 400);

    const casca = document.getElementById('CASCA_REVELA');
    if(casca) {
        casca.classList.remove('efeito-tremor'); void casca.offsetWidth; casca.classList.add('efeito-tremor');
        if (batidas % 2 === 0) {
            const rach = document.createElement('div'); rach.className = 'rachadura';
            rach.style.width = (20 + Math.random() * 40) + 'px'; rach.style.height = '2px';
            rach.style.top = (20 + Math.random() * 60) + '%'; rach.style.left = (20 + Math.random() * 60) + '%';
            rach.style.transform = `rotate(${Math.random() * 360}deg)`; casca.appendChild(rach);
        }
    }
    if (batidas === maxBatidas) quebrarOvoFinal();
}

function quebrarOvoFinal() {
    const sQuebra = document.getElementById('S_QUEBRA'); 
    if(sQuebra) { sQuebra.currentTime = 0; sQuebra.play().catch(er=>{}); }
    
    const casca = document.getElementById('CASCA_REVELA'); 
    if(casca) casca.style.opacity = '0';
    
    const textoInstrucao = document.getElementById('instrucao-ovo'); 
    if(textoInstrucao) textoInstrucao.style.display = 'none';
    
    let maxPts = -1;
    for (const [cat, pts] of Object.entries(pontosQuiz)) { 
        if (pts > maxPts) { maxPts = pts; monstroVencedor = cat; } 
    }

    const res = cardsDoma[monstroVencedor];
    const nomeTopo = document.getElementById('NOME_MONSTRO_TOPO'); 
    if(nomeTopo) { nomeTopo.innerText = res.n; nomeTopo.style.opacity = '1'; nomeTopo.style.top = '-30px'; }
    
    const imgMonstro = document.getElementById('MONSTRO_FINAL_IMG'); 
    if(imgMonstro) { imgMonstro.style.opacity = '1'; imgMonstro.style.transform = 'scale(1.2)'; }
    
    // GATILHO SEGURO DA CARTEIRA (Só entrega se existir a função)
    let jaFezQuiz = localStorage.getItem('doma_quiz_completo');
    if(!jaFezQuiz) { 
        setTimeout(() => { if(typeof ganharMoedas === 'function') ganharMoedas(50, null); }, 1000); 
        localStorage.setItem('doma_quiz_completo', 'true'); 
    }
    
    setTimeout(() => { 
        const btn = document.getElementById('BTN_SAIBA_MAIS'); 
        if(btn) btn.style.display = 'block'; 
    }, 1200);
}

// ==========================================
// LÓGICA DE NAVEGAÇÃO DOS 10 SLIDES E TEXTOS
// ==========================================
let slideTrilhaAtual = 1;

function exibirCardDiagnostico() {
    const telaQuebra = document.getElementById('TELA_QUEBRA');
    if (telaQuebra) telaQuebra.style.display = 'none';
    
    const monstroSeguro = monstroVencedor || 'ins';
    const dadosBasicos = cardsDoma[monstroSeguro];
    const dadosVisuais = bibliotecaMonstrosDoma[monstroSeguro];
    
    // O Bisturi Seguro: Recorta o texto do Diagnóstico vs Ação Clínica
    let txtDiagnosticoApenas = "";
    let txtAcaoClinicaApenas = "";
    
    if (dadosBasicos && dadosBasicos.t) {
        let pAcao = '<p><strong>A Ação Clínica:</strong>';
        if (dadosBasicos.t.includes(pAcao)) {
            let partes = dadosBasicos.t.split(pAcao);
            txtDiagnosticoApenas = partes[0];
            txtAcaoClinicaApenas = pAcao + partes[1];
        } else {
            txtDiagnosticoApenas = dadosBasicos.t;
        }
    }

    const cardBox = document.getElementById('card-resultado');
    if(cardBox) cardBox.style.borderTopColor = dadosVisuais.cor;
    
    const topoDinamico = document.getElementById('topo-card-dinamico');
    if(topoDinamico) topoDinamico.style.background = dadosVisuais.gradiente;
    
    const dNome = document.getElementById('d-nome-monstro');
    if (dNome) { dNome.innerText = dadosVisuais.cap; dNome.style.color = dadosVisuais.cor; }
    
    const dDiag = document.getElementById('d-diagnostico-base');
    if (dDiag) dDiag.innerHTML = txtDiagnosticoApenas;
    
    const dAfeta = document.getElementById('d-afeta');
    if (dAfeta) dAfeta.innerHTML = dadosVisuais.afeta;
    
    const dAlerta = document.getElementById('d-alerta');
    if (dAlerta) dAlerta.innerHTML = `💡 <b style="color: ${dadosVisuais.cor}; font-size: 1.2rem;">Não se engane:</b><br><br>${dadosVisuais.alerta}`;
    
    const dCorpo = document.getElementById('d-corpo');
    if (dCorpo) {
        dCorpo.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 15px; text-align: center; animation: pulso-coracao 1s infinite ease-in-out;">🫀</div>
            <strong style="color:${dadosVisuais.cor}; font-size: 1.2rem;">Sinais no seu Corpo:</strong><br><br>
            <div style="color: #334155; font-size: 1.05rem; line-height: 1.6;">${dadosVisuais.corpo}</div>
        `;
    }

    const dEmocionais = document.getElementById('d-emocionais');
    if (dEmocionais) {
        dEmocionais.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 15px; text-align: center; animation: brilho-cerebro 2s infinite ease-in-out;">🧠</div>
            <strong style="color:#f43f5e; font-size: 1.2rem;">Impacto Emocional:</strong><br><br>
            <div style="color: #334155; font-size: 1.05rem; line-height: 1.6;">${dadosVisuais.emocionais}</div>
        `;
    }

    const dPergunta = document.getElementById('d-pergunta');
    if (dPergunta) dPergunta.innerHTML = `"${dadosVisuais.pergunta}"`;

    const dAcao = document.getElementById('d-acao-clinica');
    if (dAcao) {
        dAcao.innerHTML = `
            <div style="background: #fff; padding: 20px; border-radius: 15px; animation: pulso-cura 3s infinite ease-in-out; color: #334155; font-size: 1.05rem; line-height: 1.6;">
                <div style="font-size: 2.5rem; text-align: center; margin-bottom: 10px;">✨</div>
                ${txtAcaoClinicaApenas}
            </div>
        `;
    }

    mudarSlideDiagnostico(1);
    
    const placaFinal = document.getElementById('PLACA_FINAL_CARDS');
    if (placaFinal) {
        placaFinal.style.display = 'flex';
        placaFinal.scrollTop = 0; // Trava do Scroll Top Inicial
    }
}

    
    
    
    
    
    
    
    
    function mudarSlideDiagnostico(alvo) {
    const trilha = document.getElementById('trilha-slides');
    slideTrilhaAtual = alvo;
    
    if(trilha) {
        const deslocamento = -(slideTrilhaAtual - 1) * 10; // 100% dividido por 10 slides
        trilha.style.transform = `translateX(${deslocamento}%)`;
    }

    // A MÁGICA DO SCROLL: Volta pro topo ao clicar para ler
    const placaCards = document.getElementById('PLACA_FINAL_CARDS');
    if (placaCards) {
        placaCards.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // GATILHOS DE ÁUDIO
    if (slideTrilhaAtual === 5) tocarAlarmeForte(); 
    
    if (slideTrilhaAtual === 6) {
        iniciarBatimentoContinuo(); 
    } else {
        pararBatimentoContinuo(); 
    }
    
    if (slideTrilhaAtual === 10) {
        tocarSomMagicoDoma();
    }
} // <====== ESTA É A CHAVE QUE ESTAVA FALTANDO PARA SALVAR O SISTEMA!


// ==========================================
// ABERTURA DO MANUAL DO DOMADOR (LIVRO)
// ==========================================
function irParaVendaLivro() {
    const custoDoLivro = 50; // Altere este valor se quiser cobrar mais ou menos moedas

    // 1. Verifica se o paciente tem moedas suficientes
    if (moedasTotais >= custoDoLivro) {
        
        // 2. Desconta as moedas usando a sua própria função mágica (valor negativo para subtrair)
        ganharMoedas(-custoDoLivro);

        // 3. Exibe a camada do livro por cima dos slides
        const modalLivro = document.getElementById('modal-livro-venda-doma');
        if (modalLivro) {
            modalLivro.style.display = 'block';
            modalLivro.scrollTop = 0;
        }

        // 4. Toca o som de sucesso para ancorar a vitória
        if (typeof tocarSomMagicoDoma === 'function') {
            tocarSomMagicoDoma();
        }

    } else {
        // Se não tiver moedas, usa o seu próprio sistema de sirene/alerta
        abrirModalDoma(
            "Faltam Doma Coins! 🪙", 
            `Você precisa de <b>${custoDoLivro} moedas</b> para destravar o Manual do Domador.<br><br>Faltam apenas ${custoDoLivro - moedasTotais}. Continue explorando a jornada e vencendo seus monstros para juntar mais!`, 
            "alerta"
        );
    }
}

// Função para fechar o livro e voltar aos slides exatamente onde parou
function fecharVendaLivro() {
    const modalLivro = document.getElementById('modal-livro-venda-doma');
    if (modalLivro) {
        modalLivro.style.display = 'none';
    }
    
    // Silencia os áudios do livro ao sair (se a função existir no código do livro)
    if (typeof pararTodosOsSons === "function") {
        pararTodosOsSons();
    }
}


/* ===== próximo bloco (core) ===== */


                    var audioIniciado = false;
                    function iniciarContextoAudio() {
                        if (!audioIniciado) {
                            const som = document.getElementById('SOM_VITORIA');
                            if(som) {
                                som.volume = 0;
                                som.play().then(() => {
                                    som.pause(); som.currentTime = 0; som.volume = 1; audioIniciado = true;
                                }).catch(e => console.log("Áudio bloqueado."));
                            }
                        }
                    }
                    document.body.addEventListener('touchstart', iniciarContextoAudio, { once: true });
                    document.body.addEventListener('click', iniciarContextoAudio, { once: true });

                    function revelarMagia(idCard) {
                        const som = document.getElementById('SOM_VITORIA');
                        if(som) {
                            som.currentTime = 0;
                            som.play().catch(e => console.log("Bloqueado."));
                        }

                        document.getElementById('misterio-' + idCard).style.display = 'none';
                        document.getElementById('revelado-' + idCard).style.display = 'flex';

                        const card = document.getElementById('caixa-' + idCard);
                        dispararConfetes(card);
                        
                        if(window.innerWidth < 768) {
                            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                        }
                    }

                    function dispararConfetes(container) {
                        const cores = ['#00C4B5', '#f97316', '#1e3a8a', '#d4af37'];
                        for(let i = 0; i < 35; i++) {
                            let confete = document.createElement('div');
                            confete.className = 'confete';
                            if(Math.random() > 0.5) confete.style.borderRadius = '50%';
                            confete.style.background = cores[Math.floor(Math.random() * cores.length)];
                            confete.style.left = Math.random() * 100 + '%';
                            confete.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
                            container.appendChild(confete);
                            setTimeout(() => { if(container.contains(confete)) confete.remove(); }, 2500);
                        }
                    }

                    function domaScrollFinal(direction) {
                        const container = document.getElementById('domaScrollFinal');
                        const cardWidth = window.innerWidth < 768 ? 280 + 25 : 340 + 25; 
                        container.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
                    }
                

/* ===== próximo bloco (core) ===== */


// INICIALIZAÇÃO DA JORNADA (MANTÉM O PROGRESSO SALVO)
window.addEventListener('DOMContentLoaded', () => {
    // 1. Resgata as moedas que já estavam salvas no "cofre" do navegador
    let moedasSalvas = parseInt(localStorage.getItem('doma_coins')) || 0;
    
    // 2. Atualiza a variável principal do seu sistema com o que foi salvo
    if (typeof moedasTotais !== 'undefined') {
        moedasTotais = moedasSalvas;
    }

    // 3. Atualiza a interface visual com as moedas reais do usuário
    if (typeof atualizarCarteiraUI === 'function') {
        atualizarCarteiraUI();
    }
    
    // ATENÇÃO: As remoções do localStorage foram retiradas daqui! 
    // Agora o sistema lembra permanentemente se o usuário já fez os quizzes, 
    // os diários e qual o recorde do jogo da memória, impedindo acúmulo infinito.

    // 🌟 Avisa o Wix que o HTML "acordou" e está pronto para receber a chave VIP!
    window.parent.postMessage({ acao: 'htmlPronto' }, "*");
});


/* ===== próximo bloco (core) ===== */


function abrirCaneca() {
    // Envia uma mensagem para a página principal dizendo para redirecionar
    window.parent.postMessage({ acao: 'abrirCaneca' }, '*');
}


/* ===== próximo bloco (core) ===== */


    /* ========================================================= */
    /* RASTREADOR DE SCROLL WIX E POSICIONADOR INTELIGENTE       */
    /* ========================================================= */
    let wixVisibleTop = 0;
    let wixWindowHeight = window.innerHeight || 800;

    const listaModaisDoma = document.querySelectorAll(
        '.doma-popup-tela, #CAMADA_ABSOLUTA_LIVRO, #modal-loja-doma, .intro-papel-pao, div[id^="modal-"], #slide-final-conclusao, #slide-plano-acao, #slide-data-inicio, #slide-contrato'
    );

    // 1. Escuta a posição real enviada pelo código pai do Wix
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === "wix-scroll-update") {
            // Se o topo do iframe está em -1000px (já rolou para baixo), o topo visível interno é 1000px
            wixVisibleTop = event.data.iframeTop < 0 ? Math.abs(event.data.iframeTop) : 0;
            wixWindowHeight = event.data.windowHeight;
            reposicionarModaisAbertos();
        }
    });

    // 2. Calcula matematicamente o meio da tela do usuário
    function calcularPosicaoCentro(modal) {
        const cartaoInterno = modal.querySelector('.cartao-popup, #CONTEUDO_LIVRO_INTERNO, .conteudo-papel, .wrapper-isolado, .alerta-clinico-modal, .doma-modal-box, #card-corpo');
        let alturaCartao = cartaoInterno ? cartaoInterno.offsetHeight : 400;
        
        let centroY = wixVisibleTop + (wixWindowHeight / 2) - (alturaCartao / 2);
        if (centroY < 20) centroY = 20;
        
        return centroY;
    }

    // 3. Atualiza os modais de forma suave se o usuário rolar a tela com eles abertos
    function reposicionarModaisAbertos() {
        listaModaisDoma.forEach(modal => {
            if (window.getComputedStyle(modal).display !== 'none') {
                let paddingIdeal = calcularPosicaoCentro(modal);
                modal.style.setProperty('padding-top', paddingIdeal + 'px', 'important');
            }
        });
    }

    // 4. Observador: Assim que um modal for invocado via clique, centraliza imediatamente
    const observadorPosicaoModais = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const el = mutation.target;
            const display = window.getComputedStyle(el).display;
            
            if (display !== 'none' && !el.dataset.posicionado) {
                el.dataset.posicionado = 'true';
                requestAnimationFrame(() => {
                    let paddingIdeal = calcularPosicaoCentro(el);
                    el.style.setProperty('padding-top', paddingIdeal + 'px', 'important');
                });
            } else if (display === 'none') {
                el.dataset.posicionado = ''; 
            }
        });
    });

    listaModaisDoma.forEach(modal => {
        observadorPosicaoModais.observe(modal, { attributes: true, attributeFilter: ['style', 'class'] });
    });

    /* ========================================================= */
    /* RADAR ANTI-LOOP: Mede as Caixas e ignora o Fundo Escuro   */
    /* (MANTIDO 100% INTACTO DO ORIGINAL)                        */
    /* ========================================================= */
    let ultimaAlturaWix = 0;

    function reportarAlturaParaWix() {
        let alturaMax = 0;

        // 1. Pega apenas a caixinha interna do slide principal
        const pagAtiva = document.querySelector('.doma-pagina.ativa, .swiper-slide-active .doma-pagina');
        if (pagAtiva) {
            const wrapperIsolado = pagAtiva.querySelector('.wrapper-isolado');
            if (wrapperIsolado) {
                alturaMax = Math.max(alturaMax, wrapperIsolado.offsetHeight);
            } else {
                alturaMax = Math.max(alturaMax, pagAtiva.offsetHeight);
            }

            // Exceção pro slide das pecinhas
            const slidePecinhas = pagAtiva.querySelector('#slide-pecinhas');
            if (slidePecinhas && slidePecinhas.classList.contains('visivel')) {
                const contPecinhas = slidePecinhas.querySelector('.conteudo-pecinhas');
                if (contPecinhas) {
                    alturaMax = Math.max(alturaMax, contPecinhas.offsetHeight);
                }
            }
        }

        // 2. MODAIS - O SEGREDO QUE CORTA O LOOP INFINITO
        listaModaisDoma.forEach(modal => {
            if (window.getComputedStyle(modal).display === 'none') return;

            const conteudoInterno = modal.querySelector('.cartao-popup, #CONTEUDO_LIVRO_INTERNO, .conteudo-papel, .wrapper-isolado, .alerta-clinico-modal');
            
            if (conteudoInterno) {
                // Aqui usamos o novo wixVisibleTop no lugar do antigo viewportTopoY
                let paddingParaCalculo = modal.style.paddingTop ? parseInt(modal.style.paddingTop) : wixVisibleTop;
                let alturaRealDoCard = conteudoInterno.offsetHeight + paddingParaCalculo + 150; 
                
                if (alturaRealDoCard > alturaMax) {
                    alturaMax = alturaRealDoCard;
                }
            }
        });

        // 3. Trava de Segurança em código para o Jogo da Memória
        const gridJogo = document.getElementById('grid');
        if (gridJogo && gridJogo.style.display === 'grid') {
             if (alturaMax < 750) alturaMax = 750; 
        }

        // 4. Margem de respiro final
        alturaMax += 60;

        // 5. Comunica ao Wix apenas se houve uma diferença real
        if (Math.abs(alturaMax - ultimaAlturaWix) > 20 && alturaMax > 300) {
            ultimaAlturaWix = alturaMax;
            window.parent.postMessage({ 
                type: "embedded-auto-height", 
                height: alturaMax 
            }, "*");
        }
    }

    // Leitura a cada 300ms
    setInterval(reportarAlturaParaWix, 300);
