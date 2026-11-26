// Checks the Alertaí deck layout and, if it passes, exports one 1920x1080 PNG per scene.
// Uses the Chrome (or Edge) already on the machine, headless; nothing is downloaded.
//
//   node scripts/deck.mjs            check all scenes, then export all
//   node scripts/deck.mjs 04 07      check all scenes, then export only 04 and 07
//   node scripts/deck.mjs --check    only check
//
// The check (deck/check-layout.js) fails on text over text, text over the phone or icon
// discs, and anything closer than 24 px to the frame edge. Nothing is exported on failure.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const DECK = resolve(here, "../deck/alertai.html");
const OUT = resolve(here, "../deck/export");

const browser = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean).find((p) => existsSync(p));
if (!browser) throw new Error("Nenhum Chrome/Edge encontrado. Defina CHROME=<caminho do executavel>.");

const args = process.argv.slice(2);
const onlyCheck = args.includes("--check");
const wanted = args.filter((a) => !a.startsWith("--"));
const url = (query) => `${pathToFileURL(DECK).href}?${query}`;
const common = ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
  "--virtual-time-budget=8000", "--run-all-compositor-stages-before-draw"];

// 1. layout check
const dom = spawnSync(browser, [...common, "--window-size=1920,1080", "--dump-dom", url("check")], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const report = dom.stdout.match(/<pre id="layout-report">([\s\S]*?)<\/pre>/);
if (!report) { console.error("O verificador nao rodou (sem #layout-report no DOM)."); process.exit(2); }
const text = report[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
console.log(text);
if (text.startsWith("LAYOUT FALHOU")) process.exit(1);
if (onlyCheck) process.exit(0);

// 2. export
const ids = [...readFileSync(DECK, "utf8").matchAll(/data-scene="(\d+[a-z]?)"/g)].map((m) => m[1]);
const scenes = wanted.length ? ids.filter((id) => wanted.includes(id)) : ids;
mkdirSync(OUT, { recursive: true });
for (const id of scenes) {
  const file = resolve(OUT, `s${id}.png`);
  spawnSync(browser, [...common, "--window-size=1920,1080", `--screenshot=${file}`, url(`scene=${id}`)], { stdio: "ignore" });
  console.log(existsSync(file) ? `exportado ${file}` : `FALHOU ${file}`);
}
