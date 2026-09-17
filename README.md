# Clínica Doma — versão modular com carregamento sob demanda

## Correção nesta versão: a trava do lago tinha 2 portas destrancadas

Na versão anterior, eu só tinha travado o botão de texto "AVANÇAR ❯"
dentro da própria cena do lago. Só que essa tela tem **duas outras
formas** de avançar que eu não tinha coberto:

1. A **seta de navegação padrão** do livro (a setinha `❯` fixa na
   lateral, usada em toda a leitura) — ela já ficava escondida até a
   música terminar, mas depois disso aparecia sem checar VIP nenhum.
2. Pular direto pra uma página depois do lago **pelo menu/sumário**
   (`irParaTela`) — sem passar pelo botão nem pela seta.

Ambos os caminhos foram fechados:

- A seta de navegação padrão (`mudarPagina`) agora também bloqueia a
  saída de `pag-26` sem VIP.
- A seta fica **escondida** enquanto o usuário não for VIP (mesma
  lógica visual das outras travas do livro), mesmo depois da música
  terminar.
- Pular via menu/sumário para qualquer página depois do lago
  (`irParaTela`) também é bloqueado sem VIP.

O botão de texto "AVANÇAR ❯" da própria cena continua com a checagem
de antes.

Testei os 3 caminhos possíveis de sair da tela (seta padrão, pulo via
menu, botão da cena) tanto sem VIP (devem bloquear) quanto com VIP
(devem liberar) — todos passaram.

## Mudanças anteriores (recapitulando)

- Revertida a trava do Laboratório (Mapa da Travessia).
- Correção de responsividade mobile nas duas roletas.
- Padding em dezenas de telas específicas.
- Modo de teste (`?teste=1&ir=ID`) via GitHub Pages.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório `livro_a_travessia` no GitHub.
2. O `wix-loader.html` não mudou nesta rodada.
3. Pra testar: acesse sem VIP, navegue até a tela do lago (`pag-26`),
   deixe a música terminar (ou espere os 136s) e tente avançar tanto
   pela seta lateral quanto pelo botão da cena — os dois devem mostrar
   o paywall. Com VIP liberado, ambos devem funcionar normalmente.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (não mudou desta vez).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro.
