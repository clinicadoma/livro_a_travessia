# Clínica Doma — versão modular com carregamento sob demanda

## Mudança nesta versão

Na tela "Seu Plano Tático": a função `validarEAvancarData()` sempre
exigia pelo menos uma tática definida antes de avançar — mesmo quando
não havia nenhuma peça tóxica selecionada na etapa anterior (ou seja,
não havia nada pra definir tática nenhuma, e a tela nem mostrava opção
pra isso). Isso travava o usuário permanentemente nessa tela.

Corrigido: a exigência de "definir ao menos uma tática" agora só se
aplica quando existe pelo menos uma peça marcada para tratar
(`selecionadaParaTratar === true`). Se não houver nenhuma, o aviso não
aparece e o fluxo segue direto para a validação da assinatura.

## Mudanças anteriores (recapitulando)

- Registrado o `padding-bottom: 10px` que você adicionou direto no
  GitHub em `#modal-tatica-popup` e `#modal-tatica-header`.
- Botão cortado em `area-botoes-modal` — corrigido com `flex-shrink: 0`.
- Removido `overflow: hidden` de `.regra-ouro-box`.
- Removido o `padding-bottom: 150px` herdado por `#slide-plano-acao`.
- Modo de teste (`?teste=1&ir=ID`) via GitHub Pages.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório `livro_a_travessia` no GitHub.
2. O `wix-loader.html` não mudou nesta rodada.
3. Teste com `?teste=1&ir=slide-intro-14` + `abrirPlanoGeral()` no
   console, marcando nenhuma peça como tóxica na etapa anterior, pra
   confirmar que agora dá pra avançar sem travar.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (não mudou desta vez).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro.
