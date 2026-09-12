# Clínica Doma — versão modular com carregamento sob demanda

Este pacote foi reconstruído do zero, incorporando todas as correções
descobertas durante o processo de depuração anterior. Leia este arquivo
inteiro antes de começar — tem passos que fazem diferença.

## O que este pacote faz

O livro original é um único arquivo HTML de ~1MB com 124 páginas. Esta
versão carrega só um "casca" inicial (~340KB: CSS + motor de navegação +
primeiras páginas) e busca cada capítulo seguinte sob demanda, conforme o
usuário navega — em vez de carregar o livro inteiro de uma vez.

## Mudança importante desta rodada: fim do problema de cache

Nas versões anteriores, o loader apontava para a branch `main` do GitHub
via jsDelivr, e o jsDelivr guarda esse tipo de referência em cache por
várias horas — isso causou repetidos "atualizei o GitHub mas o site
continua com a versão antiga", mesmo depois de eu confirmar que os
arquivos certos estavam no repositório.

**Correção definitiva:** o loader agora gera um código diferente a cada
carregamento de página (baseado no horário) e cola esse código no final
de toda e qualquer URL que ele busca — inclusive as dos capítulos
carregados depois. Isso faz o jsDelivr (e o navegador) tratarem cada
carregamento como uma URL nunca vista antes, sempre buscando o conteúdo
mais recente. Você não precisa mais me pedir um "hash de commit" a cada
atualização — só subir os arquivos novos no GitHub já basta.

(Custo: cada visita busca os arquivos sem cache, um pouco mais lento que
o ideal de um CDN — mas para este projeto, previsibilidade importa mais.)

## Passo 1 — Repositório no GitHub

1. Crie um repositório **público** chamado `livro_a_travessia` (ou outro
   nome — só me avise se for diferente, para eu ajustar o loader).
2. Suba para a **raiz** desse repositório as pastas e arquivo:
   - `css/`
   - `js/`
   - `html/`
   - `manifest.json`
   (Não precisa subir `wix-loader.html`, `build_chunks.js`,
   `new_engine.js` ou `montar_tudo.sh` — esses são ferramentas para
   reprocessar o livro no futuro, não são buscados pelo site.)

## Passo 2 — Componente HTML no Wix

Esta parte precisa ser feita com cuidado, porque foi aqui que
escorregamos da última vez:

1. Abra a página do site no Editor do Wix (a cópia, ou a página final —
   confirme com você mesmo qual delas vai ao ar).
2. Clique no componente HTML existente (o embed) para abrir o painel
   dele.
3. **Apague todo o conteúdo atual do componente** antes de colar o novo
   (não apenas selecione tudo e substitua — apague, salve vazio, e só
   depois cole o novo, para garantir que nada da versão anterior fique
   "grudado").
4. Cole o conteúdo do arquivo `wix-loader.html` deste pacote.
5. Clique no botão de **aplicar/salvar dentro do próprio painel do
   componente** (não só feche a janela — muitos editores como o do Wix
   exigem esse clique extra para persistir a mudança).
6. Publique o site.

## Passo 3 — Testando sem qualquer cache

Para ter certeza absoluta de que está vendo a versão nova (e não uma
versão em cache do seu próprio navegador ou do Wix):

1. Abra o site publicado (não o Preview do Editor).
2. Abra o DevTools (F12).
3. Vá na aba **Network**.
4. Marque a caixinha **"Disable cache"** (geralmente fica no topo da
   aba Network) — e deixe o DevTools aberto enquanto testa.
5. Dê um recarregamento forçado: `Ctrl+Shift+R` (Windows/Linux) ou
   `Cmd+Shift+R` (Mac).
6. Ainda na aba Network, filtre por "jsdelivr" e confirme que aparecem
   as 4 requisições: `manifest.json`, `style.css`, `core.js`,
   `000_inicial.html` — todas com status 200, e cada URL terminando em
   `?_cb=` seguido de um número (esse é o quebra-cache; se você recarregar
   de novo, esse número muda).
7. Clique em qualquer uma dessas requisições e abra a aba "Response" —
   confirme que o conteúdo parece certo (por exemplo, `core.js` deve
   começar com uma função `(function() {` e ter milhares de linhas).

Só depois disso teste os botões e telas do livro.

## Passo 4 — Sobre a altura do iframe

O Velo não suporta redimensionar automaticamente um componente HTML
comum. Você já tinha uma solução via código de página (ouvindo a
mensagem `embedded-auto-height` e aplicando CSS direto no elemento do
Wix pelo ID dele). Isso continua sendo o caminho certo — só **confirme
que os IDs usados nesse script (`wixId`, `sectionId`) são os do
componente ATUAL** dessa página (você mesmo descobriu que copiar a
página gera um componente com ID novo).

## O que foi corrigido ao longo do processo (resumo técnico)

- **Contagem de páginas**: usa um parser HTML real (jsdom) em vez de
  regex, para lidar com comentários malformados e tags como `<section>`
  que a regex não entendia.
- **Popups presos no capítulo errado**: 4 popups (loja, "livro"
  revelável, tela VIP, modal de senha) que ficavam fisicamente dentro de
  um capítulo específico, mas eram chamados de outros lugares (inclusive
  do próprio motor de navegação, que roda desde o início), foram
  promovidos automaticamente para o capítulo inicial. A análise que faz
  essa promoção agora roda em ponto fixo alternado — ou seja, se
  promover um popup revelar uma NOVA função que precisa ser sempre
  disponível, isso também é detectado e corrigido automaticamente.
- **Modal atrás do slide (z-index)**: o `#doma-app-wrapper` original
  (que agrupava páginas e popups num mesmo contexto de empilhamento)
  não estava sendo recriado — agora é.
- **Altura mais responsiva**: o recálculo de altura roda imediatamente
  após um capítulo carregar ou a página mudar, em vez de esperar até
  300ms pelo próximo ciclo do intervalo.
- **Cache do jsDelivr**: eliminado via quebra-cache automático (veja
  acima).

## Pontos para testar depois de publicar

- Navegação sequencial (setas) e pelo Sumário/Mapa da Travessia.
- **Seu Plano Tático** — checkbox, "Abrir", "Escolher Intervenção".
- **"Tenho uma senha"** (tela VIP) — deve abrir por cima do slide.
- **Retrato Falado** e **vitrola do capítulo 10** — dependem de um
  religamento automático; um erro no console antes da hora certa é
  inofensivo (o widget funciona quando você realmente chega na página
  dele).
- Altura do iframe ao navegar entre capítulos de tamanhos diferentes.

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix.
- `build_chunks.js` — script que gera tudo a partir do HTML original.
- `new_engine.js` — o motor de navegação assíncrono (usado internamente
  pelo `montar_tudo.sh`; não precisa mexer nele diretamente).
- `montar_tudo.sh` — regenera tudo de uma vez a partir do zero, já
  aplicando os ajustes manuais (vitrola do capítulo 10 + motor de
  navegação). Uso: `./montar_tudo.sh original.html saida/` (requer
  Node.js e `npm install jsdom` na mesma pasta).

Se algo não funcionar depois de seguir os 3 primeiros passos (repositório
→ componente Wix → teste sem cache), me manda o console do DevTools
completo de novo — mas dessa vez, com o "Disable cache" já marcado, para
garantirmos que estamos vendo o comportamento real da versão nova.
