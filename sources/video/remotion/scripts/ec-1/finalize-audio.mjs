// Puts the final mix into out/ec-1.mp4 with the AAC encoder delay compensated.
//
// The MP4 Remotion writes carries the AAC "priming" samples (2048 at 48 kHz)
// without an edit list telling players to skip them, so its audio plays 42.7 ms
// behind the picture: measured by decoding the file and lining it up against
// public/ec-1/mix.wav (correlation 1.0000 at exactly 2048 samples late).
//
// This keeps the video stream as it is (no re-encode) and re-encodes the audio
// from the mix with ffmpeg's AAC encoder, whose MP4 muxer writes the edit list.
// Then it decodes the result and checks the offset is zero.
//
//   node scripts/ec-1/finalize-audio.mjs      (run by npm run render:ec1)
import { spawnSync } from "node:child_process";
import { readFileSync, renameSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "../..");
const VIDEO = resolve(ROOT, "out/ec-1.mp4");
const TMP = resolve(ROOT, "out/ec-1.tmp.mp4");
const MIX = resolve(ROOT, "public/ec-1/mix.wav");
const PCM = resolve(ROOT, "out/.ec-1-check.f32");
const RATE = 8000;

const ffmpeg = (args) => {
  const run = spawnSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], { encoding: "utf8" });
  if (run.status !== 0) throw new Error(run.stderr);
};

ffmpeg([
  "-i", VIDEO, "-i", MIX,
  "-map", "0:v:0", "-map", "1:a:0",
  "-c:v", "copy",
  "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
  "-shortest", "-movflags", "+faststart",
  TMP,
]);

/** Mono float PCM of a file at RATE, decoded by ffmpeg (which honours edit lists, as players do). */
const decode = (file) => {
  ffmpeg(["-i", file, "-vn", "-ac", "1", "-ar", String(RATE), "-f", "f32le", PCM]);
  const buffer = readFileSync(PCM);
  rmSync(PCM);
  return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
};

// Offset between the muxed audio and the mix, over 10 s of narration.
const muxed = decode(TMP);
const mix = decode(MIX);
const from = 30 * RATE;
const span = 10 * RATE;
let best = 0;
let bestScore = -Infinity;
for (let lag = -400; lag <= 400; lag++) {
  let score = 0;
  for (let i = 0; i < span; i++) score += muxed[from + i + lag] * mix[from + i];
  if (score > bestScore) {
    bestScore = score;
    best = lag;
  }
}
const offsetMs = (best / RATE) * 1000;
if (Math.abs(offsetMs) > 1) {
  rmSync(TMP);
  throw new Error(`O audio continua deslocado ${offsetMs.toFixed(1)} ms. out/ec-1.mp4 nao foi alterado.`);
}

renameSync(TMP, VIDEO);
console.log(`Audio do mix no MP4 com o atraso do AAC compensado (deslocamento medido: ${offsetMs.toFixed(1)} ms) -> out/ec-1.mp4`);
