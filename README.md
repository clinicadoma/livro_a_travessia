# Clínica Doma — participação modular com carregamento sob demanda

## Mudança nesta versão: trava VIP movida do Laboratório para a tela do lago

A validação de VIP adicionada na versão anterior (no botão "MONTAR MEU
MAPA DE TRATAMENTO" do Laboratório) foi **revertida**.

A trava agora fica em outro ponto: na tela do lago (`pag-26`, a cena com
a música/mensagem e a animação da cascata), no botão **"AVANÇAR ❯"**
que aparece depois que a música termina (ou depois de 136 segundos,
conforme o próprio código original já previa como tempo mínimo de
audição). Se o usuário não for VIP, o paywall aparece nesse clique e ele
não avança para a próxima tela (`slide-pecinhas`) — a parte gratuita do
Mapa da Travessia agora termina exatamente aqui.

Mesma técnica de antes: como esse trecho também vive numa IIFE isolada
(separada do motor de navegação principal), a validação lê o VIP direto
do `localStorage` (`acesso_vip_doma_liberado`), garantindo que funciona
independente do escopo.

Testado com dois cenários automatizados: usuário sem VIP (clique em
AVANÇAR bloqueado, paywall aparece) e usuário com VIP (avança
normalmente para a próxima tela).

## Mudanças anteriores (recapitulando)

- Correção de responsividade mobile nas duas roletas.
- Padding em dezenas de telas específicas.
- Corrigida a validação de `validarEAvancarData()`.
- Modo de teste (`?teste=1&ir=ID`) via GitHub Pages.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório `livro_a_travessia` no GitHub.
2. O `wix-loader.html` não mudou nesta rodada.
3. Pra testar o bloqueio: acesse sem VIP liberado e navegue até a tela
   do lago (`pag-26`), ouça a música (ou espere/pule pra depois que ela
   termina) e clique em "AVANÇAR ❯" — o paywall deve aparecer. Com VIP
   liberado, deve avançar normalmente.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (não mudou desta vez).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro.
