# Clínica Doma — versão modular com carregamento sob demanda

## Mudança nesta versão: imagens comprimidas (14,4MB → 1,8MB)

Além de já estarem hospedadas no GitHub (rodada anterior), as 30
imagens foram comprimidas:

- **28 imagens opacas** (sem transparência real, mesmo salvas como
  PNG) foram convertidas para **JPEG qualidade 82** — formato muito
  mais eficiente pra esse tipo de conteúdo (ilustrações/capturas de
  tela com gradientes e muitas cores). Reduções de 73% a 96% por
  arquivo, sem perda visual perceptível (conferi visualmente as duas
  com maior redução).
- **2 imagens com transparência real** (`Captura-de-tela-2025-09-27-133248.png`
  e a `removebg-preview.png`) continuam em PNG, só otimizadas.
- As 2 imagens com resolução muito acima do necessário para exibição
  (`metodologia.png` a 1280px e `pedra.png` a 1024px, exibidas a no
  máximo ~400px na tela) foram redimensionadas para 900px de largura
  — mais que suficiente até pra telas retina, sem perda visível.

**Resultado total: 14,4MB → 1,8MB (88% menor).**

⚠️ **28 nomes de arquivo mudaram de `.png` para `.jpg`** — o código já
foi atualizado de acordo. Se você tiver os arquivos antigos `.png`
ainda no GitHub de uma subida anterior, pode apagá-los (não são mais
referenciados, mas ficam ocupando espaço à toa).

## Mudanças anteriores (recapitulando)

- Imagens migradas do postimg.cc para o GitHub (`raw.githubusercontent.com`).
- Trava de VIP na tela do lago (3 caminhos de saída bloqueados).
- Correção de responsividade mobile nas duas roletas.
- Modo de teste (`?teste=1&ir=ID`) via GitHub Pages.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/`, `manifest.json` **e a pasta `img/`
   atualizada** (agora com os `.jpg` no lugar de vários `.png`) para a
   raiz do repositório `livro_a_travessia` no GitHub, substituindo a
   pasta `img/` da vez anterior.
2. O `wix-loader.html` não mudou nesta rodada.
3. Se quiser, apague do GitHub os arquivos `.png` antigos que não são
   mais usados (lista no fim deste README).

### Arquivos .png que podem ser removidos do GitHub (substituídos por .jpg)
```
11.png, 12.png, 13.png, 2.png, 24.png, 6.png,
Captura-de-tela-2025-09-19-125555.png, Captura-de-tela-2025-09-19-143517.png,
Captura-de-tela-2025-09-19-153054.png, Captura-de-tela-2025-10-04-190252.png,
Captura-de-tela-2025-10-10-144609.png, Captura_de_tela_2025_10_12_131542.png,
Coracao.png, Laranja.png, amor-proprio.png, ansiedade.png, autoestisma.png,
canecavenda.png, carteira-doma2.png, domador10.png,
espelho-da-restauracao.png, image.png, livro-certo.png, metodologia.png,
monstropolvo.png, pedra.png, ponte-doma.png, sessao-aberta.png
```
(As 2 que continuam `.png` — `Captura-de-tela-2025-09-27-133248.png` e
a `removebg-preview.png` — não estão nessa lista, continuam em uso.)

## Arquivos deste pacote

- `css/`, `js/`, `html/`, `manifest.json`, `img/` — sobem para o GitHub.
- `wix-loader.html` — cola no componente HTML do Wix (não mudou desta vez).
- `build_chunks.js` / `new_engine.js` / `montar_tudo.sh` — ferramentas
  para reprocessar o livro original no futuro.
