# Clínica Doma — versão modular com carregamento sob demanda

## Mudança nesta versão

Havia 4 telas usando o quadro "O SEU DIÁRIO DE BORDO" (classe
`.diario-base`) espalhadas pelo livro. O ajuste anterior (`padding-top:
70px !important` na classe CSS) já valia para todas elas, mas a que
fica logo antes de "Acolhendo o Polvo" (tema rosa, "Pausa para
Reflexão: Dentre os sintomas, qual mais te assombra?") agora também
recebeu o padding diretamente na sua `wrapper-isolado`, para garantir
consistência com o padrão aplicado nas outras 34 telas.

## Mudanças anteriores (recapitulando)

- Padding em 34 telas `wrapper-isolado` + quadro do Diário de Bordo +
  `#acolhendo-polvo` + `#DOM_EXPERIENCIA_COMPLETA` + 5 telas "AVALIAÇÃO
  DAS PERDAS".
- Padding nos modais da segunda roleta.
- Registrado o `padding-bottom: 10px` em `#slide-data-inicio` e
  `#slide-contrato`.
- Corrigida a validação de `validarEAvancarData()`.
- Modo de teste (`?teste=1&ir=ID`) via GitHub Pages.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório `livro_a_travessia` no GitHub.
2. O `wix-loader.html` não mudou nesta rodada.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (não mudou desta vez).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro.
