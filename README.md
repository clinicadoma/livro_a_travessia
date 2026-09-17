# Clínica Doma — versão modular com carregamento sob demanda

## Mudança nesta versão: gate VIP no "Laboratório" do Mapa da Travessia

No fluxo O MAPA DA SUA TRAVESSIA → LABORATÓRIO:
1. Usuário clica em "MAPEAR MEUS SINTOMAS"
2. Escolhe de 1 a 3 sintomas
3. Clica em "MONTAR MEU MAPA DE TRATAMENTO"

Esse último clique agora **valida se o usuário é VIP**. Se não for, o
paywall (`slide-paywall-vip`) aparece e o usuário não avança — a parte
gratuita do Mapa da Travessia termina exatamente nesse ponto, como
pedido.

**Detalhe técnico:** essa seção ("dm...") vive numa IIFE JavaScript
separada do motor de navegação principal, então não dava para reutilizar
a variável `isUsuarioPremium` de lá diretamente (ela existe em cópias
isoladas por escopo, cada uma dentro de sua própria função). A correção
lê o VIP direto do `localStorage` (`acesso_vip_doma_liberado`), a mesma
fonte de verdade que todas as outras cópias usam para se inicializar —
isso garante que a validação funciona independentemente de qual parte
do código está checando.

Testado com dois cenários automatizados: usuário sem VIP (bloqueado,
paywall aparece) e usuário com VIP (libera e avança para o mapa).

## Mudanças anteriores (recapitulando)

- Correção de responsividade mobile nas duas roletas (container e
  canvas agora escalam corretamente em telas estreitas).
- Padding em dezenas de telas específicas (Diário de Bordo, Planner,
  Jogo da Verdade, etc.).
- Padding nos modais da segunda roleta e do Plano Tático.
- Corrigida a validação de `validarEAvancarData()`.
- Modo de teste (`?teste=1&ir=ID`) via GitHub Pages.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório `livro_a_travessia` no GitHub.
2. O `wix-loader.html` não mudou nesta rodada.
3. Teste com `?teste=1&ir=pag-intro-darkmode` — o modo de teste libera o
   VIP automaticamente, então pra testar o BLOQUEIO especificamente,
   abra sem VIP liberado (sem `?teste=1`) e navegue manualmente até lá,
   ou limpe o `localStorage` (`acesso_vip_doma_liberado`) no console
   antes de testar.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (não mudou desta vez).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro.
