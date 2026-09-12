#!/usr/bin/env node
/**
 * Analisa o HTML monolítico usando um parser HTML de verdade (jsdom/parse5,
 * o mesmo tipo de motor que um navegador usa) e produz:
 *   - manifest.json
 *   - css/style.css
 *   - js/core.js       (scripts usados por mais de um capítulo)
 *   - html/chunks/*.html
 *
 * Por que não regex? O arquivo original tem comentários HTML malformados
 * (ex: "<!-- ... -- >" sem fechar corretamente) que escondem páginas
 * inteiras, e ao menos uma página usa <section> em vez de <div>. Regex não
 * entende essas nuances; um parser de verdade sim.
 *
 * Uso:
 *   node build_chunks.js original.html pasta_saida/
 */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const SEED_GLOBAIS = new Set([
  "mudarPagina", "irParaTela", "ganharMoedas", "abrirModalDoma", "fecharModal",
  "processarFormulario", "isCoerente", "atualizarCarteiraUI", "comprarRecompensa",
  "verificarLoja", "atualizarVisibilidadeSeta", "atualizarVisualSumario",
  "selecionarTag", "seMarcado",
]);

function extrairFuncoesDefinidas(js) {
  const nomes = new Set();
  const padroes = [
    /function\s+(\w+)\s*\(/g,
    /window\.(\w+)\s*=\s*function/g,
    /window\.(\w+)\s*=\s*\(/g,
    /\b(?:let|var|const)\s+(\w+)\s*=\s*function/g,
  ];
  for (const p of padroes) {
    let m;
    while ((m = p.exec(js))) nomes.add(m[1]);
  }
  return nomes;
}

function extrairChamadas(texto) {
  const chamadas = new Set();
  const attrRe = /\bon[a-z]+\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = attrRe.exec(texto))) {
    const chamadasAttr = m[1].match(/([A-Za-z_]\w*)\s*\(/g) || [];
    chamadasAttr.forEach((c) => chamadas.add(c.replace(/\s*\($/, "")));
  }
  const chamadasCorpo = texto.match(/([A-Za-z_]\w*)\s*\(/g) || [];
  chamadasCorpo.forEach((c) => chamadas.add(c.replace(/\s*\($/, "")));
  return chamadas;
}

function extrairIdsGetElementById(texto) {
  const ids = new Set();
  for (const m of texto.matchAll(/getElementById\(\s*["']([\w\-]+)["']\s*\)/g)) ids.add(m[1]);
  return ids;
}

function serializarNo(node, dom) {
  if (node.nodeType === dom.window.Node.ELEMENT_NODE) return node.outerHTML;
  if (node.nodeType === dom.window.Node.TEXT_NODE) return node.textContent;
  if (node.nodeType === dom.window.Node.COMMENT_NODE) return `<!--${node.textContent}-->`;
  return "";
}

function main() {
  const [, , origem, saida] = process.argv;
  if (!origem || !saida) {
    console.error("Uso: node build_chunks.js original.html pasta_saida/");
    process.exit(1);
  }

  const textoOriginal = fs.readFileSync(origem, "utf-8");

  const waypointIds = new Set();
  for (const m of textoOriginal.matchAll(/irParaTela\(\s*['"]([\w\-]+)['"]\s*\)/g)) waypointIds.add(m[1]);
  for (const m of textoOriginal.matchAll(/data-alvo=["']([\w\-]+)["']/g)) waypointIds.add(m[1]);
  console.log(`waypoints (destinos de menu) encontrados: ${waypointIds.size}`);

  const dom = new JSDOM(textoOriginal, { runScripts: "outside-only" });
  const { document } = dom.window;
  const Node = dom.window.Node;

  // ---- 1) Lista AUTORITATIVA de páginas, na ordem real do documento ----
  const paginas = Array.from(document.querySelectorAll(".doma-pagina"));
  console.log(`total de .doma-pagina encontradas pelo parser real: ${paginas.length}`);

  // ---- 2) Atribui cada página a um capítulo (chunk), cortando nos waypoints ----
  const pageChunk = [];
  const chunkStartId = [null];
  let chunkAtual = 0;
  paginas.forEach((p, i) => {
    if (i > 0 && p.id && waypointIds.has(p.id)) {
      chunkAtual++;
      chunkStartId.push(p.id);
    }
    pageChunk.push(chunkAtual);
  });
  const totalChunks = chunkAtual + 1;
  console.log(`total de capítulos gerados: ${totalChunks}`);

  // ---- 3) Descobre a que capítulo um nó qualquer pertence ----
  function chunkDoNo(node) {
    const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    if (!el) return 0;
    const paginaAncestral = el.closest(".doma-pagina");
    if (paginaAncestral) {
      const idx = paginas.indexOf(paginaAncestral);
      if (idx !== -1) return pageChunk[idx];
    }
    let ultimoChunk = 0;
    for (let i = 0; i < paginas.length; i++) {
      const pos = paginas[i].compareDocumentPosition(node);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) ultimoChunk = pageChunk[i];
    }
    return ultimoChunk;
  }

  // ---- 4) CSS global, remove <style> do DOM ----
  const estilos = Array.from(document.querySelectorAll("style"));
  const css = estilos.map((s) => s.textContent).join("\n\n/* ===== próximo <style> ===== */\n\n");
  estilos.forEach((s) => s.remove());

  // ---- 5) Scripts por capítulo, funções definidas ----
  const scripts = Array.from(document.querySelectorAll("script")).filter((s) => !s.src);
  const scriptChunk = scripts.map(chunkDoNo);

  const funcsPorChunk = Array.from({ length: totalChunks }, () => new Set());
  const funcToChunk = new Map();
  scripts.forEach((s, i) => {
    const ci = scriptChunk[i];
    const defs = extrairFuncoesDefinidas(s.textContent);
    defs.forEach((nome) => {
      funcsPorChunk[ci].add(nome);
      if (!funcToChunk.has(nome)) funcToChunk.set(nome, ci);
    });
  });

  // ---- 6) Chamadas de função feitas por cada capítulo ----
  const chamadasPorChunk = Array.from({ length: totalChunks }, () => new Set());
  document.querySelectorAll("*").forEach((el) => {
    let attrsTexto = "";
    for (const attr of el.attributes || []) {
      if (/^on/i.test(attr.name)) attrsTexto += ` ${attr.name}="${attr.value}"`;
    }
    if (attrsTexto) {
      const ci = chunkDoNo(el);
      extrairChamadas(attrsTexto).forEach((n) => chamadasPorChunk[ci].add(n));
    }
  });
  scripts.forEach((s, i) => {
    const ci = scriptChunk[i];
    extrairChamadas(s.textContent).forEach((n) => chamadasPorChunk[ci].add(n));
  });

  // ---- 7) Ponto fixo ALTERNADO: promove funções ao core.js E popups
  // flutuantes ao capítulo inicial, repetindo até nenhum dos dois mudar
  // mais nada. Isso importa porque promover um popup pode revelar uma
  // NOVA dependência: o popup passa a existir desde o início, mas um
  // botão dentro dele pode chamar uma função que só é definida lá no
  // capítulo onde o popup morava originalmente — e essa função também
  // precisa virar core, senão o clique dá "function is not defined".
  const wrapperTmp = document.getElementById("doma-app-wrapper");
  const flutuantes = Array.from(wrapperTmp.children).filter(
    (el) => el.id && !el.classList.contains("doma-pagina") && !el.querySelector(".doma-pagina")
  );

  const idsRefPorChunk = Array.from({ length: totalChunks }, () => new Set());
  document.querySelectorAll("*").forEach((el) => {
    let attrsTexto = "";
    for (const attr of el.attributes || []) {
      if (/^on/i.test(attr.name)) attrsTexto += ` ${attr.name}="${attr.value}"`;
    }
    if (attrsTexto) {
      const ci = chunkDoNo(el);
      extrairIdsGetElementById(attrsTexto).forEach((id) => idsRefPorChunk[ci].add(id));
    }
  });
  scripts.forEach((s, i) => {
    extrairIdsGetElementById(s.textContent).forEach((id) => idsRefPorChunk[scriptChunk[i]].add(id));
  });

  const coreIdx = new Set();
  for (let ci = 0; ci < totalChunks; ci++) {
    for (const nome of funcsPorChunk[ci]) {
      if (SEED_GLOBAIS.has(nome)) coreIdx.add(ci);
    }
  }
  const promoverAoZero = new Set();
  const motivos = {};

  let mudou = true;
  while (mudou) {
    mudou = false;

    // (a) promove capítulos cujas funções são chamadas de fora, incluindo
    // as chamadas feitas de DENTRO de popups já promovidos ao capítulo 0
    // (essas contam como "chamadas do capítulo 0" a partir de agora)
    const chamadasChunk0Extras = new Set();
    promoverAoZero.forEach((el) => extrairChamadas(el.outerHTML).forEach((n) => chamadasChunk0Extras.add(n)));

    const definidasNoCore = new Set();
    coreIdx.forEach((ci) => funcsPorChunk[ci].forEach((n) => definidasNoCore.add(n)));

    for (let ci = 0; ci < totalChunks; ci++) {
      const chamadas = ci === 0 ? new Set([...chamadasPorChunk[ci], ...chamadasChunk0Extras]) : chamadasPorChunk[ci];
      for (const nome of chamadas) {
        if (funcsPorChunk[ci].has(nome) || definidasNoCore.has(nome)) continue;
        const alvo = funcToChunk.has(nome) ? funcToChunk.get(nome) : undefined;
        if (alvo !== undefined && !coreIdx.has(alvo)) {
          coreIdx.add(alvo);
          if (!motivos[alvo]) motivos[alvo] = new Set();
          motivos[alvo].add(nome);
          mudou = true;
        }
      }
    }

    // (b) com o core.js atualizado, verifica se algum popup flutuante
    // precisa ser promovido ao capítulo inicial
    const coreJsAtual = scripts
      .filter((s, i) => coreIdx.has(scriptChunk[i]))
      .map((s) => s.textContent)
      .join("\n");
    const idsRefNoCore = extrairIdsGetElementById(coreJsAtual);

    flutuantes.forEach((el) => {
      if (promoverAoZero.has(el)) return;
      const chunkNatural = chunkDoNo(el);
      if (chunkNatural === 0) return;
      const referenciadoFora = idsRefPorChunk.some((s, ci) => ci !== chunkNatural && s.has(el.id));
      const referenciadoNoCore = idsRefNoCore.has(el.id);
      if (referenciadoFora || referenciadoNoCore) {
        promoverAoZero.add(el);
        console.log(`  - popup '#${el.id}' morava no capítulo ${chunkNatural}, mas é chamado de fora -> promovido ao capítulo inicial`);
        mudou = true;
      }
    });
  }

  // Efeito colateral da promoção: popups que viram parte do capítulo 0
  // passam a existir mais "cedo" no DOM do que popups que ainda moram no
  // capítulo original deles. Quando dois popups compartilham a MESMA
  // classe (ex: .doma-popup-tela, todos com z-index 99990), o navegador
  // desempata por ORDEM NO DOM — e no arquivo original, um popup como o
  // de convite VIP aparecia DEPOIS de outros (ex: o do Plano Tático),
  // então sempre vencia essa disputa e ficava por cima. Ao promovê-lo
  // para o capítulo 0 (que carrega primeiro), ele passou a aparecer
  // ANTES no DOM, e portanto perde essa disputa quando os dois aparecem
  // juntos. Corrigimos reforçando o z-index inline de cada popup
  // promovido, garantindo que ele sempre vença, como vencia antes.
  promoverAoZero.forEach((el) => {
    const zAtual = parseInt(el.style.zIndex || "0", 10) || 0;
    if (zAtual < 999990) {
      el.style.setProperty("z-index", "999990", "important");
    }
  });

  console.log(`capítulos promovidos a core.js: ${[...coreIdx].sort((a, b) => a - b).join(", ")}`);
  [...coreIdx].sort((a, b) => a - b).forEach((ci) => {
    const r = motivos[ci];
    const etiqueta = chunkStartId[ci] || `(capítulo inicial #${ci})`;
    if (r) {
      console.log(`  - capítulo '${etiqueta}' -> core.js (funções exigidas de fora: ${[...r].slice(0, 6).join(", ")}${r.size > 6 ? "..." : ""})`);
    } else {
      console.log(`  - capítulo '${etiqueta}' -> core.js (continha função-semente conhecida)`);
    }
  });

  // ---- 8) Remove do DOM os scripts promovidos a core (evita duplicação) ----
  const coreJsPartes = [];
  scripts.forEach((s, i) => {
    if (coreIdx.has(scriptChunk[i])) {
      coreJsPartes.push(s.textContent);
      s.remove();
    }
  });
  const coreJs = coreJsPartes.join("\n\n/* ===== próximo bloco (core) ===== */\n\n");

  // ---- 9) Serializa cada capítulo a partir dos filhos diretos de #doma-app-wrapper ----
  const wrapper = document.getElementById("doma-app-wrapper");
  const partesPorChunk = Array.from({ length: totalChunks }, () => []);
  const estado = { chunkCorrente: 0 };

  // Alguns .doma-pagina estão soltos como filhos diretos do wrapper; outros
  // ficam agrupados dentro de wrappers vestigiais (ex: <div class="swiper-slide">,
  // resquício de uma versão antiga com a biblioteca Swiper, sem CSS/JS ativo
  // hoje) que às vezes contêm DUAS OU MAIS páginas juntas. Por isso, sempre
  // que um nó contém mais de uma .doma-pagina, "abrimos" esse nó e
  // distribuímos seus filhos individualmente.
  function distribuir(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      partesPorChunk[estado.chunkCorrente].push(serializarNo(node, dom));
      return;
    }
    if (promoverAoZero.has(node)) {
      partesPorChunk[0].push(serializarNo(node, dom));
      return;
    }
    const paginasDentro = node.classList.contains("doma-pagina")
      ? [node]
      : Array.from(node.querySelectorAll(".doma-pagina"));

    if (paginasDentro.length === 0) {
      partesPorChunk[estado.chunkCorrente].push(serializarNo(node, dom));
      return;
    }
    if (paginasDentro.length === 1) {
      const idx = paginas.indexOf(paginasDentro[0]);
      if (idx !== -1) estado.chunkCorrente = pageChunk[idx];
      partesPorChunk[estado.chunkCorrente].push(serializarNo(node, dom));
      return;
    }
    Array.from(node.childNodes).forEach((neto) => distribuir(neto));
  }

  Array.from(wrapper.childNodes).forEach((filho) => distribuir(filho));

  // Conteúdo fora de #doma-app-wrapper mas dentro do body entra no capítulo 0
  // (áudios, carteira, modal, paywall etc. que já estavam soltos antes do wrapper).
  const antesDoWrapper = [];
  const depoisDoWrapper = [];
  let passouWrapper = false;
  Array.from(document.body.childNodes).forEach((filho) => {
    if (filho === wrapper) { passouWrapper = true; return; }
    (passouWrapper ? depoisDoWrapper : antesDoWrapper).push(serializarNo(filho, dom));
  });
  partesPorChunk[0].unshift(...antesDoWrapper);
  partesPorChunk[totalChunks - 1].push(...depoisDoWrapper);

  // ---- 10) Escreve os arquivos ----
  fs.mkdirSync(path.join(saida, "css"), { recursive: true });
  fs.mkdirSync(path.join(saida, "js"), { recursive: true });
  fs.mkdirSync(path.join(saida, "html", "chunks"), { recursive: true });

  fs.writeFileSync(path.join(saida, "css", "style.css"), css, "utf-8");
  fs.writeFileSync(path.join(saida, "js", "core.js"), coreJs, "utf-8");

  const manifest = { chunks: [], pages: [] };
  for (let ci = 0; ci < totalChunks; ci++) {
    const nomeArquivo = `${String(ci).padStart(3, "0")}_${chunkStartId[ci] || "inicial"}.html`;
    manifest.chunks.push({
      index: ci,
      arquivo: nomeArquivo,
      start_id: chunkStartId[ci],
      is_core: coreIdx.has(ci),
    });
    fs.writeFileSync(
      path.join(saida, "html", "chunks", nomeArquivo),
      partesPorChunk[ci].join(""),
      "utf-8"
    );
  }
  paginas.forEach((p, i) => {
    manifest.pages.push({ id: p.id || null, chunk: pageChunk[i] });
  });

  fs.writeFileSync(path.join(saida, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");

  console.log();
  console.log(`total de páginas no manifest: ${manifest.pages.length}`);
  const tamCore = fs.statSync(path.join(saida, "js", "core.js")).size;
  let tamChunks = 0, maiorChunk = 0;
  manifest.chunks.forEach((c) => {
    if (c.is_core) return;
    const sz = fs.statSync(path.join(saida, "html", "chunks", c.arquivo)).size;
    tamChunks += sz;
    if (sz > maiorChunk) maiorChunk = sz;
  });
  console.log(`tamanho core.js: ${(tamCore / 1024).toFixed(1)} KB`);
  console.log(`soma de capítulos html (carregados aos poucos): ${(tamChunks / 1024).toFixed(1)} KB`);
  console.log(`maior capítulo individual: ${(maiorChunk / 1024).toFixed(1)} KB`);
}

main();
