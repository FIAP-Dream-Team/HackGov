// Renders stills of the GSPitch composition at chosen moments, bundling once.
// For checking sync and layout without rendering the whole video.
//
//   node scripts/gs-pitch/stills.mjs                 a default set: every scene, the
//                                                  camera moves and the speaker tags
//   node scripts/gs-pitch/stills.mjs 12.5 143.2      seconds of video
//
// Output: out/gs-pitch-stills/<seconds>s.png
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "../..");
const OUT = resolve(ROOT, "out/gs-pitch-stills");
const timing = JSON.parse(readFileSync(resolve(ROOT, "src/data/gs-pitch/timing.json"), "utf8"));

const defaults = () => {
  const moments = new Set();
  // Just before each cut: everything the scene revealed is on screen.
  for (const s of timing.scenes) moments.add(Math.max(s.start + 0.5, s.end - 0.4));
  // Halfway through and just after each camera move.
  for (const c of timing.camera) moments.add(c.start + c.durationInFrames / timing.fps + 0.3);
  // Each speaker tag, fully in.
  for (const t of timing.turns.slice(1)) moments.add(t.start + 1);
  return [...moments].sort((a, b) => a - b);
};

const seconds = process.argv.length > 2 ? process.argv.slice(2).map(Number) : defaults();
mkdirSync(OUT, { recursive: true });

console.log("Empacotando...");
const serveUrl = await bundle({ entryPoint: resolve(ROOT, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "GSPitch" });

for (const sec of seconds) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(sec * timing.fps));
  const output = resolve(OUT, `${sec.toFixed(1).padStart(5, "0")}s.png`);
  await renderStill({ composition, serveUrl, frame, output, imageFormat: "png" });
  const scene = timing.scenes.find((s) => frame >= s.startFrame && frame < s.endFrame);
  console.log(`  ${sec.toFixed(1).padStart(6)}s  frame ${String(frame).padStart(4)}  cena ${scene?.scene ?? "--"}`);
}
console.log(`${seconds.length} stills -> out/gs-pitch-stills/`);
