# Clínica Doma — versão modular com carregamento sob demanda

## Correção desta versão: animações não tocavam (sem sombra, sem rotação)

**Causa raiz (a mais sutil até agora):** uma das tags `<style>` do arquivo
original está malformada — falta o `</style>` dela no lugar certo, então
o navegador "engole" um bloco de `<script>` inteiro (o sistema de desenho
do Tribunal Interno) como se fosse texto CSS. No arquivo original isso é
inofensivo, porque cada `<style>` é uma folha de estilo **independente**;
o erro fica contido ali dentro.

O problema apareceu porque, para carregar todo o CSS de uma vez só (em
vez de ficar buscando pedaço por pedaço), eu **juntei** todas as folhas
de estilo originais num arquivo único. Isso uniu o que antes eram
contextos de análise CSS separados — e o erro de uma folha passou a
"vazar" e corromper a leitura de TUDO que vinha depois dela no arquivo
combinado, inclusive a animação do botão "Iniciar Travessia" (e
potencialmente outras).

**Corrigido:** o loader agora recria cada bloco de estilo original como
sua própria tag `<style>` separada — continua buscando tudo num único
arquivo (não perde a vantagem de carregar de uma vez), mas isola cada
bloco na hora de aplicar, exatamente como era no arquivo original.

Testei de forma ampla: comparei as 101 animações usadas no arquivo
original contra os `@keyframes` que o navegador consegue reconhecer
depois dessa correção. Encontrei mais 3 nomes de animação que **nunca
tiveram um `@keyframes` definido em lugar nenhum** — `flutuarBalao`,
`flutuar` e `pulsarVivo`. Isso já era assim no arquivo original (bug
pré-existente, sem relação com a modularização); não mexi nisso, mas
fica registrado caso você queira revisar.

## Correções anteriores (recapitulando)

- **Modal VIP atrás do Plano Tático:** popups promovidos ao capítulo
  inicial agora recebem z-index reforçado, restaurando a prioridade que
  tinham no arquivo original.
- **`#doma-app-wrapper` recriado** em tempo de execução (contexto de
  empilhamento correto entre páginas e popups).
- **4 popups** (loja, "livro" revelável, VIP, senha) promovidos ao
  capítulo inicial — com detecção automática de novas dependências que
  isso revela (ex: `abrirModalSenhaVIP`).
- **Quebra-cache automático** em toda busca — elimina o problema
  recorrente de cache do jsDelivr.
- **Contagem de páginas** via parser HTML real (jsdom), não regex.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório `livro_a_travessia` no GitHub.
2. No componente HTML do Wix: apague o conteúdo atual, salve vazio, cole
   o `wix-loader.html` deste pacote, clique em aplicar/salvar no próprio
   painel do componente, e publique.
3. Teste em aba anônima (o quebra-cache automático já elimina a
   necessidade de desabilitar cache manualmente).

## Pontos para testar

- **Animação do botão "Iniciar Travessia"** (sombra crescendo + leve
  rotação) — e de outros botões pulsantes pelo livro.
- **Modal VIP** por cima do slide "Seu Plano Tático".
- Navegação geral, Retrato Falado, vitrola do capítulo 10.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix.
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro
  (`./montar_tudo.sh original.html saida/`, requer Node.js + `jsdom`).
