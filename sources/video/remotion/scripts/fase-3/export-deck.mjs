// Exports the Fase 3 deck for review: one 1920x1080 PNG per scene and the whole
// deck as a PDF, one scene per page. Uses the Chrome (or Edge) already on the
// machine in headless mode; nothing is downloaded.
//
//   node scripts/fase-3/export-deck.mjs            all scenes + PDF
//   node scripts/fase-3/export-deck.mjs 03 09      just those scenes, no PDF
//
// Output: sources/video/fase-3/deck/export/
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const DECK = resolve(here, "../../../fase-3/deck/minha-vez-fase3.html");
const OUT = resolve(here, "../../../fase-3/deck/export");

const CANDIDATES = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const browser = CANDIDATES.find((path) => existsSync(path));
if (!browser) throw new Error("Nenhum Chrome/Edge encontrado. Defina CHROME=<caminho do executavel>.");

const ids = [...readFileSync(DECK, "utf8").matchAll(/data-scene="(\d+)"/g)].map((m) => m[1]);
const wanted = process.argv.slice(2);
const scenes = wanted.length ? ids.filter((id) => wanted.includes(id)) : ids;
mkdirSync(OUT, { recursive: true });

// The deck pulls its fonts from Google Fonts; the virtual time budget lets them
// arrive before the capture instead of shooting the fallback faces.
const common = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--virtual-time-budget=6000",
  "--run-all-compositor-stages-before-draw",
];

const run = (args) => {
  const result = spawnSync(browser, [...common, ...args], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || `browser saiu com ${result.status}`);
};

const url = pathToFileURL(DECK).href;
for (const id of scenes) {
  const file = resolve(OUT, `${id}.png`);
  run(["--window-size=1920,1080", `--screenshot=${file}`, `${url}?scene=${id}`]);
  console.log(`  ${id}.png`);
}

if (!wanted.length) {
  const pdf = resolve(OUT, "minha-vez-fase3.pdf");
  run(["--no-pdf-header-footer", `--print-to-pdf=${pdf}`, url]);
  console.log("  minha-vez-fase3.pdf");
}

console.log(`${scenes.length} cena(s) -> ${OUT}`);
