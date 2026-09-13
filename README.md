# Clínica Doma — versão modular com carregamento sob demanda

## Mudança nesta versão

Nos dois popups de resultado da segunda roleta (`roleta_interna`):

1. `#modal-dossie-doma` (o "dossiê" mostrado após cada giro)
2. `#modal-limite-giros` (aviso de fim dos giros disponíveis)

Adicionado `padding-bottom: 15px !important;` em ambos.

## Mudanças anteriores (recapitulando)

- Registrado o `padding-bottom: 10px` em `#slide-data-inicio` e
  `#slide-contrato`.
- Corrigida a validação de `validarEAvancarData()`.
- Registrado o `padding-bottom: 10px` em `#modal-tatica-popup` e
  `#modal-tatica-header`.
- Botão cortado em `area-botoes-modal` — corrigido com `flex-shrink: 0`.
- Removido `overflow: hidden` de `.regra-ouro-box`.
- Removido o `padding-bottom: 150px` herdado por `#slide-plano-acao`.
- Modo de teste (`?teste=1&ir=ID`) via GitHub Pages.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório `livro_a_travessia` no GitHub.
2. O `wix-loader.html` não mudou nesta rodada.
3. Teste com `?teste=1&ir=roleta_interna` pra chegar direto na segunda
   roleta e conferir os dois modais.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (não mudou desta vez).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro.
