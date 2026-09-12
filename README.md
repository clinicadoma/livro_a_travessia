# Clínica Doma — versão modular com carregamento sob demanda

## Correção desta versão: modal VIP atrás do "Seu Plano Tático"

Causa raiz (diferente da vez anterior): o popup de convite VIP
(`slide-paywall-vip`) e o popup "Seu Plano Tático" (`slide-plano-acao`)
compartilham a mesma classe (`.doma-popup-tela`) e portanto o **mesmo**
z-index (99990). Quando dois elementos têm z-index igual, quem aparece
**depois no HTML** vence e fica por cima.

No arquivo original, o popup VIP vinha bem depois do Plano Tático no
documento — por isso sempre vencia e bloqueava a tela corretamente. Ao
promover o popup VIP para o capítulo inicial (para resolver o bug
anterior, de ele não existir ainda quando chamado), ele passou a
carregar **primeiro**, invertendo essa ordem — e passou a perder a
disputa de empilhamento contra o Plano Tático.

Corrigido: todo popup promovido para o capítulo inicial agora recebe um
z-index bem mais alto (999990+), garantindo que sempre fique por cima,
independente da ordem de carregamento dos capítulos — restaurando o
comportamento original.

## Sobre as animações não tocando

Verifiquei o arquivo gerado a fundo: o `@keyframes` da animação do botão
"Iniciar Travessia" (e as demais) estão corretos e presentes no CSS
extraído — não encontrei um erro de código para isso. Preciso de uma
informação sua pra continuar essa investigação: abra o DevTools, clique
com o botão direito num botão que deveria estar pulsando (ex: "Iniciar
Travessia") → Inspecionar → na aba **Computed** (Calculado), procure por
`animation-name`. Me diz o valor que aparece ali.

## Arquitetura (recapitulando)

- **124 páginas**, **36 capítulos**, carregados sob demanda.
- Quebra-cache automático em toda busca (elimina o problema de cache do
  jsDelivr que nos afetou repetidamente).
- `#doma-app-wrapper` recriado em tempo de execução (necessário para o
  contexto de empilhamento correto entre páginas e popups).
- 4 popups (loja, "livro" revelável, VIP, senha) promovidos ao capítulo
  inicial, com z-index reforçado (ver acima).
- 5 capítulos promovidos a `core.js` por terem funções chamadas de fora.

## Como colocar no ar

1. Crie/reutilize o repositório **`livro_a_travessia`** no GitHub e suba
   `css/`, `js/`, `html/` e `manifest.json` para a raiz.
2. No componente HTML do Wix: apague todo o conteúdo atual, salve vazio,
   cole o `wix-loader.html` deste pacote, clique em aplicar/salvar no
   próprio painel do componente, e publique.
3. Teste com o cache do navegador desligado (DevTools → Network →
   "Disable cache" → `Ctrl+Shift+R`).

## Pontos para testar

- **Seu Plano Tático** + botão "tenho uma senha" — o modal VIP deve
  aparecer por cima agora.
- Animações dos botões (me manda o `animation-name` computado se ainda
  não tocarem).
- Navegação geral, Retrato Falado, vitrola do capítulo 10.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix.
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro
  (`./montar_tudo.sh original.html saida/`).
