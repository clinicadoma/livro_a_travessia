# Clínica Doma — versão modular com carregamento sob demanda

## Mudanças nesta versão (padding em várias telas)

Aplicado `padding-top: 70px !important;` em:
- Quadro "O SEU DIÁRIO DE BORDO" (classe `.diario-base`)
- `#acolhendo-polvo`
- Página com a fala da Daniela sobre malabarismo de remédios
- 34 `wrapper-isolado` distintos, cobrindo as telas: "DANIELA PINHEIROS
  ACOLHE", "O Superpoder da Autonomia", "Lembre-se: o Polvo não define
  quem você é", "Interação Clínica" (cor/sensação do cansaço), "Os
  Desafios do Malabarista" e as 3 seguintes (Escudo Contra Pitacos,
  Espelho Mais Gentil, Recriando a Espontaneidade), "Exercício:
  Aliviando a Mochila", "O Espelho em Restauração", a tela do
  diagnóstico que "trincou a imagem", "DANIELA ORIENTA" (permita-se
  chorar), "Iluminando os Medos", "O Peso do Cuidado", "O Planner
  Semanal", Semanas 2/3/4, as 2 telas do "Pote Dourado das Vitórias",
  "Eternizar Vitória", "A Magia da Desidentificação", as 3 telas "O
  Jogo da Verdade" e suas 3 mentiras (Autoestima, Dor Crônica,
  Depressão), "Integração: O Trono é Seu", "A Balança do Seu Destino",
  "O Milagre da Liderança", "Parar de guerrear...", "O Retorno ao que
  nos Une" e "A Clínica Doma te ensinou o segredo".

Aplicado `padding-top: 60px !important;` em:
- `#DOM_EXPERIENCIA_COMPLETA`

Aplicado `padding-top: 45px !important;` em:
- As 5 telas "AVALIAÇÃO DAS PERDAS (1/5)" até "(5/5)"

## Mudanças anteriores (recapitulando)

- Padding nos modais da segunda roleta (`modal-dossie-doma`,
  `modal-limite-giros`).
- Registrado o `padding-bottom: 10px` em `#slide-data-inicio` e
  `#slide-contrato`.
- Corrigida a validação de `validarEAvancarData()`.
- Botão cortado em `area-botoes-modal` — corrigido com `flex-shrink: 0`.
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
