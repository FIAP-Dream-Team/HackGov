// Final audio pass over the rendered file.
//
// The narration as delivered decodes with peaks at +2.93dBFS — 776 samples past
// full scale, before any music is added. That is a file mastered right up to the
// ceiling and then mp3-encoded, and it will clip on playback and again on every
// re-encode down the line. The music bed adds only 0.13dB to that, but shipping
// a video that clips when the fix costs one pass would be careless.
//
// Two-pass EBU R128: measure, then normalise to -16 LUFS with a -1.5dBTP
// ceiling. Speech-forward content sits comfortably there, and YouTube's own
// normalisation leaves it alone. The video stream is copied, not re-encoded.
import { spawnSync } from "node:child_process";
import { existsSync, renameSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const INPUT = resolve(here, "../out/raw.mp4");
const OUTPUT = resolve(here, "../out/minha-vez.mp4");

const TARGET_LUFS = -16;
const TRUE_PEAK = -1.5;
const RANGE = 11;

if (!existsSync(INPUT)) {
  throw new Error(`Nao achei ${INPUT}. Rode a renderizacao primeiro.`);
}

const run = (args) => spawnSync(ffmpegPath, ["-hide_banner", ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

console.log("Medindo o volume do render (EBU R128)...");
const measure = run([
  "-i", INPUT,
  "-af", `loudnorm=I=${TARGET_LUFS}:TP=${TRUE_PEAK}:LRA=${RANGE}:print_format=json`,
  "-f", "null", "-",
]);

const json = measure.stderr.slice(measure.stderr.lastIndexOf("{"), measure.stderr.lastIndexOf("}") + 1);
let stats;
try {
  stats = JSON.parse(json);
} catch {
  throw new Error(`Nao consegui ler a medicao do loudnorm:\n${measure.stderr.slice(-800)}`);
}

console.log(
  `  antes: ${stats.input_i} LUFS, pico real ${stats.input_tp} dBTP, faixa ${stats.input_lra} LU`,
);

console.log("Aplicando ganho e teto de pico...");
const apply = run([
  "-y",
  "-i", INPUT,
  "-map", "0:v", "-map", "0:a",
  "-c:v", "copy",
  "-af",
  `loudnorm=I=${TARGET_LUFS}:TP=${TRUE_PEAK}:LRA=${RANGE}` +
    `:measured_I=${stats.input_i}:measured_TP=${stats.input_tp}` +
    `:measured_LRA=${stats.input_lra}:measured_thresh=${stats.input_thresh}` +
    `:offset=${stats.target_offset}:linear=true:print_format=summary`,
  // loudnorm resamples to 192kHz internally and will happily leave the output
  // there. Without this the file ships at 96kHz, which nothing needs and some
  // players dislike.
  "-ar", "48000",
  "-c:a", "aac", "-b:a", "192k",
  "-movflags", "+faststart",
  `${OUTPUT}.tmp.mp4`,
]);

if (apply.status !== 0) {
  throw new Error(`ffmpeg falhou na masterizacao:\n${apply.stderr.slice(-800)}`);
}

if (existsSync(OUTPUT)) unlinkSync(OUTPUT);
renameSync(`${OUTPUT}.tmp.mp4`, OUTPUT);
unlinkSync(INPUT);

console.log(`  depois: alvo ${TARGET_LUFS} LUFS, teto ${TRUE_PEAK} dBTP`);
console.log(`\n-> out/minha-vez.mp4`);
