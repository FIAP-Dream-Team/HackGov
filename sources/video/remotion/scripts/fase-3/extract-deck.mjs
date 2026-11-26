// Reads the Fase 3 deck (sources/video/fase-3/deck/minha-vez-fase3.html) into
// src/data/fase-3/deck.json for the Fase3 composition, and copies the images and
// fonts the deck uses into public/fase-3/.
//
// The deck is rendered verbatim: each <section class="scene"> goes into the
// video as it is in the browser, and the composition only animates what the
// deck marks (data-reveal, data-focus, data-legend-for). Fix the deck, not this
// output.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";

const here = dirname(fileURLToPath(import.meta.url));
const DECK_DIR = resolve(here, "../../../fase-3/deck");
const DECK = resolve(DECK_DIR, "minha-vez-fase3.html");
const PUBLIC = resolve(here, "../../public/fase-3");
const OUT = resolve(here, "../../src/data/fase-3/deck.json");

const $ = load(readFileSync(DECK, "utf8"));

const globalCss = $("style#deck-css").html()?.trim();
if (!globalCss) throw new Error('O deck perdeu o <style id="deck-css">.');

// The @font-face list, so the composition can load the same files and wait for
// them before the first frame.
const fontsCss = readFileSync(resolve(DECK_DIR, "fonts/fonts.css"), "utf8");
const fonts = [...fontsCss.matchAll(/@font-face \{(.*?)\}/gs)].map(([, block]) => ({
  family: block.match(/font-family: '([^']+)'/)[1],
  weight: block.match(/font-weight: (\d+)/)[1],
  style: block.match(/font-style: (\w+)/)[1],
  file: block.match(/url\(([^)]+\.woff2)\)/)[1],
  unicodeRange: block.match(/unicode-range: ([^;]+);/)[1].trim(),
}));

const scenes = $("section.scene")
  .map((index, el) => {
    const node = $(el);
    const canvas = node.find(".fig-canvas");
    return {
      index,
      scene: node.attr("data-scene"),
      label: node.attr("data-label"),
      kind: node.attr("data-kind"),
      // Dark scenes need a light speaker tag border; the composition reads this.
      tone: node.hasClass("tone-dark") ? "dark" : node.hasClass("tone-green") ? "green" : "cream",
      camera: node.find(".fig-stage").attr("data-camera") ?? null,
      canvas: canvas.length
        ? { width: parseFloat(canvas.css("width")), height: parseFloat(canvas.css("height")) }
        : null,
      focus: Object.fromEntries(
        node
          .find("[data-focus]")
          .map((_, f) => {
            const r = $(f);
            const pct = (prop) => parseFloat(r.css(prop)) / 100;
            return [[r.attr("data-focus"), { x: pct("left"), y: pct("top"), w: pct("width"), h: pct("height") }]];
          })
          .get(),
      ),
      html: $.html(el),
    };
  })
  .get();

// Assets: everything the deck can reference, copied flat into public/fase-3/.
const copyDir = (from, to, filter) => {
  mkdirSync(to, { recursive: true });
  let count = 0;
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (entry.isDirectory()) count += copyDir(resolve(from, entry.name), resolve(to, entry.name), filter);
    else if (filter(entry.name)) {
      copyFileSync(resolve(from, entry.name), resolve(to, entry.name));
      count++;
    }
  }
  return count;
};
const images = copyDir(resolve(DECK_DIR, "img"), resolve(PUBLIC, "img"), (n) => /\.(png|jpe?g)$/i.test(n));
const fontFiles = copyDir(resolve(DECK_DIR, "fonts"), resolve(PUBLIC, "fonts"), (n) => n.endsWith(".woff2"));

// Every image the scenes reference has to have been copied.
const referenced = [...new Set(scenes.flatMap((s) => [...s.html.matchAll(/src="img\/([^"]+)"/g)].map((m) => m[1])))];
const missing = referenced.filter((p) => {
  try {
    readFileSync(resolve(PUBLIC, "img", p));
    return false;
  } catch {
    return true;
  }
});
if (missing.length) throw new Error(`Imagens citadas no deck e ausentes em deck/img: ${missing.join(", ")}`);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ source: "sources/video/fase-3/deck/minha-vez-fase3.html", globalCss, fonts, scenes }, null, 1) + "\n");

console.log(`${scenes.length} cenas, ${fonts.length} faces de fonte -> src/data/fase-3/deck.json`);
console.log(`${images} imagens e ${fontFiles} arquivos de fonte -> public/fase-3/`);
for (const s of scenes) {
  const reveals = (s.html.match(/data-reveal=/g) ?? []).length;
  const focus = Object.keys(s.focus);
  console.log(
    `  ${s.scene} ${s.label.padEnd(16)} ${s.kind.padEnd(6)} ${s.tone.padEnd(5)} ${String(reveals).padStart(2)} reveals` +
      (focus.length ? `  camera: ${s.camera} -> ${focus.join(", ")}` : ""),
  );
}
