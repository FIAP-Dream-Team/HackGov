// Extracts every <section> of the Design Canvas deck into a JSON payload the
// Remotion composition can render verbatim. The deck is fully self-contained
// (inline CSS + inline SVG, no external images), so the HTML is reusable as-is.
import { load } from "cheerio";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { applyUiFixes, renumber, removeEmDashes } from "./ui-fixes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const DECK = resolve(here, "../../minhavez/HackGov Minha Vez v2.dc.html");
const OUT = resolve(here, "../src/data/slides.json");

const html = readFileSync(DECK, "utf8");
const $ = load(html, { xml: false });

// The deck's global CSS lives in <helmet><style>; it carries the type scale and
// spacing custom properties every section depends on.
const globalCss = $("helmet style")
  .map((_, el) => $(el).html())
  .get()
  .join("\n")
  .trim();

// The video plays the deck in narration order, not deck order, so the number
// printed on each slide comes from its position in slide-map.json.
const playbackOrder = JSON.parse(
  readFileSync(resolve(here, "../src/data/slide-map.json"), "utf8"),
).slides.map((entry) => entry.slide);

const slides = $("x-import > section")
  .map((index, el) => {
    const $el = $(el);
    const screenLabel = $el.attr("data-screen-label") ?? String(index + 1);

    // Layout corrections and reveal tags, applied here rather than in the deck
    // so the PDF the group submits stays exactly as designed.
    const revealCount = applyUiFixes($, el, screenLabel);

    const position = playbackOrder.indexOf(screenLabel);
    const displayNumber = position >= 0 ? position + 1 : index + 1;
    renumber($, el, displayNumber);
    const dashes = removeEmDashes($, el);

    // How much text each animated element carries. align.mjs turns this into a
    // reading time, and drops the staging when a slide is too short to read
    // whatever the staging would be holding back.
    const reveals = $el
      .find("[data-reveal]")
      .map((_, node) => ({
        id: $(node).attr("data-reveal"),
        words: $(node).text().trim().split(/\s+/).filter(Boolean).length,
      }))
      .get();

    return {
      index,
      id: `slide-${String(index + 1).padStart(2, "0")}`,
      label: $el.attr("data-label") ?? `Slide ${index + 1}`,
      screenLabel,
      displayNumber,
      speakerNotes: $el.attr("data-speaker-notes") ?? "",
      // Style on the <section> itself: background, layout, padding.
      style: $el.attr("style") ?? "",
      // Direct children are the animation units for the staggered build-in.
      childCount: $el.children().length,
      revealCount,
      reveals,
      dashes,
      html: $el.html() ?? "",
    };
  })
  .get();

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify({ source: "HackGov Minha Vez v2.dc.html", globalCss, slides }, null, 2),
);

console.log(`Extraidos ${slides.length} slides -> src/data/slides.json`);
for (const s of slides) {
  console.log(`  ${s.screenLabel}  ${s.label.padEnd(22)} ${s.childCount} blocos  n.${String(s.displayNumber).padStart(2,"0")} no video  ${String(s.revealCount).padStart(2)} reveals  ${s.html.length} chars`);
}
