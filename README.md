# Clínica Doma — versão modular com carregamento sob demanda

## Duas mudanças pontuais nesta versão (a seu pedido)

Na tela "Seu Plano Tático" (`#slide-plano-acao`):

1. Removido `overflow: hidden;` de `.regra-ouro-box` (estava cortando
   conteúdo).
2. Removido o `padding-bottom: 150px !important;` que essa tela herdava
   da classe `.doma-popup-tela` — adicionado um `padding-bottom: 0
   !important;` direto nela, sem afetar os outros popups que também
   usam essa classe (loja, VIP, etc. continuam com o padding original).

## Modo de teste (testar um slide fora do Wix)

Acesse o `wix-loader.html` publicado via GitHub Pages com parâmetros na
URL, sem precisar publicar nada no Wix:

```
https://SEU-USUARIO.github.io/livro_a_travessia/wix-loader.html?teste=1&ir=pag-jogo-insights
```

- `?teste=1` — libera o VIP e ignora a trava de "página ainda não
  alcançada", permitindo pular pra qualquer slide.
- `?ir=ID` — depois de carregar, pula direto pra esse id.

IDs disponíveis: veja a lista completa dos 36 capítulos e das páginas
específicas dentro deles no `manifest.json` (campos `chunks[].start_id`
e `pages[].id`).

## Correções anteriores (recapitulando)

- Quadro do jogo "Jornada dos Insights" não é mais espremido.
- Duplicação de peças no jogo de arrastar — corrigida.
- Scroll do Espelho da Realidade — corrigido.
- Sobreposição do rótulo dos cestos com a legenda de progresso.
- Fonte dos arquivos trocada para `raw.githubusercontent.com`.
- Popups promovidos ao capítulo inicial com z-index reforçado.
- `#doma-app-wrapper` recriado em tempo de execução.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório `livro_a_travessia` no GitHub.
2. Cole o conteúdo de `wix-loader.html` no componente HTML do Wix
   (apague o conteúdo atual, salve vazio, cole o novo, salve no painel
   do componente, publique).
3. Teste em aba anônima — ou use o modo de teste (acima) via GitHub
   Pages pra testar telas específicas sem publicar nada.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (ou acessa direto
  via GitHub Pages pra testar, com os parâmetros `?teste=1&ir=ID`).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro
  (`./montar_tudo.sh original.html saida/`, requer Node.js + `jsdom`).
