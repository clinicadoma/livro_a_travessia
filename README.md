# Clínica Doma — versão modular com carregamento sob demanda

## Mudança nesta versão: "Vitrola Doma" removida

A página "Vitrola Doma" (`id="loja-discos"`), que ficava entre "Tesouro
do Domador" e "Jornada de Insights", foi completamente removida:

- A seção da página em si (o jogo/loja de discos com o revelador de
  código de desconto).
- O item correspondente no menu/sumário ("📻 A Vitrola Doma").

O livro agora tem 123 páginas e 35 capítulos (antes eram 124 e 36). A
navegação sequencial passa direto de "Tesouro do Domador" para
"Jornada de Insights", sem nenhum vazio no meio, e o menu não tem mais
nenhum link quebrado apontando pra essa página.

**Nota:** não confundir com a "vitrola" do `pag-10` (aquela do início
do livro, ligada à primeira música) — essa é uma peça diferente e
continua no lugar, intacta.

## Mudanças anteriores (recapitulando)

- Imagens comprimidas (14,4MB → 1,8MB) e hospedadas no GitHub.
- Trava de VIP na tela do lago (3 caminhos de saída bloqueados).
- Correção de responsividade mobile nas duas roletas.
- Modo de teste (`?teste=1&ir=ID`) via GitHub Pages.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/`, `manifest.json` e `img/` para a raiz do
   repositório `livro_a_travessia` no GitHub.
2. O `wix-loader.html` não mudou nesta rodada.
3. Teste navegando pelo sumário até "Tesouro do Domador" e avançando —
   deve ir direto pra "Jornada de Insights".

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json`, `img/` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (não mudou desta vez).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro.
