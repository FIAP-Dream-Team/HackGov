// Checks the rendered Fase 3 video against the timeline it was built from.
//
//   - streams and duration of out/fase-3.mp4 against timing.json;
//   - loudness of the final mix (narration + music bed);
//   - sync: for a set of cues, a frame from the video just before and just after
//     the spoken word that triggers it, side by side, captioned with the word
//     and its time. Read straight from the encoded file, not from Remotion.
//
// Output: out/fase-3-sync.jpg
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "../..");
const VIDEO = resolve(ROOT, "out/fase-3.mp4");
const TMP = resolve(ROOT, "out/.sync-frames");
const data = (p) => JSON.parse(readFileSync(resolve(ROOT, "src/data/fase-3", p), "utf8"));
const timing = data("timing.json");
const revealMap = data("reveals.json").reveals;

const ffmpeg = (args) => spawnSync(ffmpegPath, ["-hide_banner", ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

// --- streams and duration ----------------------------------------------------
const probe = ffmpeg(["-i", VIDEO]).stderr;
const duration = (() => {
  const m = probe.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
})();
console.log(`Video: ${duration.toFixed(2)}s (timeline: ${timing.durationSec.toFixed(2)}s)`);
for (const line of probe.split("\n").filter((l) => /Stream #/.test(l))) console.log("  " + line.trim());
if (Math.abs(duration - timing.durationSec) > 0.2) console.warn("  ! duracao difere da timeline");

// --- loudness of the final mix ---------------------------------------------------
const loud = ffmpeg(["-nostats", "-i", VIDEO, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr.split("Summary:").pop();
console.log(
  `Mixagem final: ${loud.match(/I:\s+(-?[\d.]+) LUFS/)[1]} LUFS integrado, pico real ${loud.match(/Peak:\s+(-?[\d.]+) dBFS/)[1]} dBFS`,
);

// --- sync pairs -------------------------------------------------------------------
// One anchored cue per scene that has one, so the sheet covers the whole video.
const anchored = revealMap.filter((r) => r.anchor);
const picks = [];
for (const scene of timing.scenes) {
  const cue = anchored.find((r) => r.scene === scene.scene && !r.id.includes("-m-") && !r.id.includes("-o-"));
  if (!cue) continue;
  const at = timing.reveals.find((r) => r.id === cue.id);
  picks.push({ ...cue, start: at.start });
}

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
// The element starts entering at `start` (0.25s ahead of its word) and is fully in
// 14 frames later. "Antes" is 0.3s before that; "depois" is once it has landed.
const grab = (sec, file) => ffmpeg(["-y", "-ss", sec.toFixed(3), "-i", VIDEO, "-frames:v", "1", "-vf", "scale=640:-1", resolve(TMP, file)]);
picks.forEach((p, i) => {
  grab(Math.max(0, p.start - 0.3), `${i}-a.png`);
  grab(p.start + 14 / timing.fps + 0.15, `${i}-b.png`);
});

const py = `
import json, sys
from PIL import Image, ImageDraw, ImageFont
picks = json.loads(sys.argv[1]); tmp = sys.argv[2]; out = sys.argv[3]
W, H, cap = 640, 360, 44
sheet = Image.new("RGB", (2 * W + 36, len(picks) * (H + cap + 16) + 16), (20, 26, 23))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("arial.ttf", 18)
except OSError:
    font = ImageFont.load_default()
for i, p in enumerate(picks):
    y = 16 + i * (H + cap + 16)
    for k, side in enumerate("ab"):
        im = Image.open(f"{tmp}/{i}-{side}.png").convert("RGB").resize((W, H))
        sheet.paste(im, (12 + k * (W + 12), y + cap))
    m, s = divmod(p["start"] + 0.25, 60)
    d.text((14, y + 8), f"cena {p['scene']}  {p['id']}   palavra \\"{p['anchor']}\\" em {int(m)}:{s:04.1f}   (antes | depois)", fill=(245, 183, 0), font=font)
sheet.save(out, quality=85)
`;
const sheet = resolve(ROOT, "out/fase-3-sync.jpg");
const run = spawnSync("python", ["-c", py, JSON.stringify(picks), TMP, sheet], { encoding: "utf8" });
if (run.status !== 0) throw new Error(run.stderr);
rmSync(TMP, { recursive: true, force: true });
console.log(`${picks.length} pares antes/depois -> out/fase-3-sync.jpg`);
