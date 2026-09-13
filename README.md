# Clínica Doma — versão modular com carregamento sob demanda

## Novo: modo de teste (testar um slide fora do Wix)

O `wix-loader.html` não depende de nada específico do Wix — ele busca
tudo do GitHub e só usa `postMessage` de forma opcional. Isso significa
que dá pra abrir esse arquivo direto no navegador, sem precisar publicar
nada, e ele vai carregar o livro normalmente.

Pra pular direto pra um slide específico (sem precisar navegar por tudo
manualmente) e sem precisar liberar VIP na mão, use parâmetros na URL:

```
wix-loader.html?teste=1&ir=pag-jogo-insights
```

- `?teste=1` — liga o modo de teste: libera o VIP e ignora a trava de
  "página ainda não alcançada", permitindo pular pra qualquer slide.
- `?ir=ID` — depois de carregar, pula direto pra esse id (o mesmo id
  usado em `irParaTela('...')` no código, ou visível no `manifest.json`).

Exemplo prático: baixe `wix-loader.html`, abra ele duas vezes no
navegador (dois abas/janelas), uma com `?teste=1&ir=pag-jogo-insights` e
outra com `?teste=1&ir=slide-final-conclusao`, pra comparar duas telas
lado a lado sem precisar navegar manualmente em nenhuma delas.

Sem esses parâmetros, o arquivo funciona exatamente como antes (começa
do zero, `pag-1`, com as travas de progresso normais).

## Correções desta versão

- **Quadro do jogo "Jornada dos Insights" espremido:** uma correção
  anterior (a que restaurou o scroll do Espelho da Realidade) estava
  sendo aplicada tanto a páginas normais quanto a popups. Páginas normais
  já rolam corretamente por conta própria; aplicar a mesma regra nelas
  fazia o flexbox encolher o conteúdo (como esse jogo) em vez de deixar
  a página crescer. Agora a correção só se aplica a popups.

## Correções anteriores (recapitulando)

- Duplicação de peças no jogo de arrastar — corrigida (dependia de
  atualizar tanto o `wix-loader.html` quanto o `js/core.js` no GitHub).
- Scroll do Espelho da Realidade — corrigido usando os mesmos seletores
  por ID que o arquivo original usa para travar o scroll ali.
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
3. Teste em aba anônima — ou use o modo de teste (acima) pra testar
   telas específicas sem publicar nada.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (ou abre direto no
  navegador pra testar, com os parâmetros `?teste=1&ir=ID`).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro
  (`./montar_tudo.sh original.html saida/`, requer Node.js + `jsdom`).
