// Exports the EC-1 deck: one 1920x1080 PNG per slide (for review) and the
// whole deck as the PDF that goes in the delivery ZIP, one slide per page.
// Uses the Chrome (or Edge) already on the machine, headless; nothing is downloaded.
//
//   node scripts/gs-pitch/export-deck.mjs                      PNGs + PDF
//   node scripts/gs-pitch/export-deck.mjs 03 07                just those slides, no PDF
//   node scripts/gs-pitch/export-deck.mjs --video=https://...  also writes the video
//                                                          link into the PDF (slide 10)
//
// The assignment caps the deck at 10 slides; the export refuses to write more.
// Output: sources/video/ec-1/deck/export/
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const DECK = resolve(here, "../../../global-solution/deck/alertai.html");
const OUT = resolve(here, "../../../global-solution/deck/export-pitch");
const PDF_NAME = "Minha Vez - Enterprise Challenge - IA e ciencia de dados.pdf";
const MAX_SLIDES = 10;

const CANDIDATES = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const browser = CANDIDATES.find((path) => existsSync(path));
if (!browser) throw new Error("Nenhum Chrome/Edge encontrado. Defina CHROME=<caminho do executavel>.");

const args = process.argv.slice(2);
const video = args.find((a) => a.startsWith("--video="))?.slice("--video=".length) ?? "";
const wanted = args.filter((a) => !a.startsWith("--"));

const ids = [...readFileSync(DECK, "utf8").matchAll(/data-scene="(\d+)"/g)].map((m) => m[1]);
if (ids.length > MAX_SLIDES) throw new Error(`O deck tem ${ids.length} slides; o enunciado aceita no maximo ${MAX_SLIDES}.`);
const scenes = wanted.length ? ids.filter((id) => wanted.includes(id)) : ids;
mkdirSync(OUT, { recursive: true });

// The virtual time budget lets the local fonts load before the capture.
const common = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--virtual-time-budget=6000",
  "--run-all-compositor-stages-before-draw",
];

const run = (extra) => {
  const result = spawnSync(browser, [...common, ...extra], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || `browser saiu com ${result.status}`);
};

const url = (query) => {
  const u = new URL(pathToFileURL(DECK).href);
  for (const [k, v] of Object.entries(query)) u.searchParams.set(k, v);
  return u.href;
};

for (const id of scenes) {
  const file = resolve(OUT, `${id}.png`);
  run(["--window-size=1920,1080", `--screenshot=${file}`, url({ scene: id, ...(video ? { video } : {}) })]);
  console.log(`  ${id}.png`);
}

if (!wanted.length) {
  const pdf = resolve(OUT, PDF_NAME);
  run(["--no-pdf-header-footer", `--print-to-pdf=${pdf}`, url(video ? { video } : {})]);
  console.log(`  ${PDF_NAME}${video ? "" : "  (sem link do video: slide 10 mostra o espaco reservado)"}`);
}

console.log(`${scenes.length} slide(s) -> ${OUT}`);
