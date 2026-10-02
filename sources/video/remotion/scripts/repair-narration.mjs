// Rebuilds the narration with its missing ending.
//
// The delivered audio.mp3 is truncated: Joao's last sentence ends at 189.15s,
// a new word starts at 189.85s, and the file stops 0.15s later, mid-syllable.
// The lost "Muito obrigado!" survives in joao2.mp4, a separate take, between
// 18.55s and 19.18s.
//
// This trims the truncated stub, level-matches the rescued phrase to Joao's own
// level in the main recording, and lands it in the same place the original one
// started. The source files are not touched; the result is public/audio.mp3,
// which every other script reads.
import { spawnSync } from "node:child_process";
import { readFileSync, unlinkSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const NARRATION = resolve(here, "../../audio.mp3");
const RESCUE = resolve(here, "../../joao2.mp4");
const OUTPUT = resolve(here, "../public/audio.mp3");

const SR = 16000;

/** Where the usable narration ends: after the last sentence, before the stub. */
const CUT_AT = 189.45;
/** The rescued phrase inside joao2.mp4, with a little room tone either side. */
const PHRASE_FROM = 18.5;
const PHRASE_TO = 19.28;
/** Where the truncated phrase began, so the pause before it is preserved. */
const PLACE_AT = 189.82;
/** Joao's own fala in the main recording, to match the rescued phrase against. */
const REFERENCE_FROM = 172.35;
const REFERENCE_TO = 189.15;

const run = (args) =>
  spawnSync(ffmpegPath, ["-hide_banner", ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

/** Decodes a span to mono float and returns its 75th-percentile frame level. */
const levelOf = (source, from, to) => {
  const scratch = resolve(here, "../.cache/level-probe.f32");
  const decoded = run([
    "-loglevel", "error", "-y",
    "-ss", String(from), "-to", String(to),
    "-i", source,
    "-ac", "1", "-ar", String(SR), "-f", "f32le", scratch,
  ]);
  if (decoded.status !== 0) throw new Error(`ffmpeg falhou lendo ${source}: ${decoded.stderr}`);

  const buffer = readFileSync(scratch);
  const samples = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
  unlinkSync(scratch);

  const hop = Math.round(0.02 * SR);
  const frames = [];
  for (let i = 0; i + hop < samples.length; i += hop) {
    let energy = 0;
    for (let k = 0; k < hop; k++) energy += samples[i + k] * samples[i + k];
    frames.push(10 * Math.log10(energy / hop + 1e-12));
  }
  frames.sort((a, b) => a - b);
  return frames[Math.floor(frames.length * 0.75)];
};

if (!existsSync(RESCUE)) throw new Error(`Nao achei ${RESCUE}.`);

const reference = levelOf(NARRATION, REFERENCE_FROM, REFERENCE_TO);
const phrase = levelOf(RESCUE, PHRASE_FROM, PHRASE_TO);
const gainDb = reference - phrase;

console.log(`Voz do Joao no video   : ${reference.toFixed(1)} dB`);
console.log(`"Muito obrigado" bruto : ${phrase.toFixed(1)} dB`);
console.log(`Ajuste aplicado        : ${gainDb >= 0 ? "+" : ""}${gainDb.toFixed(1)} dB`);

const delayMs = Math.round(PLACE_AT * 1000);
const phraseLength = PHRASE_TO - PHRASE_FROM;

const build = run([
  "-y",
  "-i", NARRATION,
  "-i", RESCUE,
  "-filter_complex",
  // The cut lands inside the pause, but a short fade keeps the mp3 decoder from
  // clicking on it.
  `[0:a]atrim=0:${CUT_AT},afade=t=out:st=${(CUT_AT - 0.12).toFixed(3)}:d=0.12,asetpts=N/SR/TB[main];` +
    `[1:a]atrim=${PHRASE_FROM}:${PHRASE_TO},asetpts=N/SR/TB,volume=${gainDb.toFixed(2)}dB,` +
    `afade=t=in:st=0:d=0.04,afade=t=out:st=${(phraseLength - 0.08).toFixed(3)}:d=0.08,` +
    `adelay=${delayMs}|${delayMs}[tail];` +
    // The two never overlap, so this is a splice, not a blend.
    `[main][tail]amix=inputs=2:duration=longest:normalize=0[out]`,
  "-map", "[out]",
  "-ar", "48000", "-ac", "2",
  "-c:a", "libmp3lame", "-b:a", "192k",
  OUTPUT,
]);

if (build.status !== 0) {
  throw new Error(`ffmpeg falhou montando a narracao:\n${build.stderr.slice(-900)}`);
}

// The decoded caches belong to the old narration.
for (const stale of ["audio-16k.f32", "audio-8k.f32"]) {
  const path = resolve(here, `../.cache/${stale}`);
  if (existsSync(path)) unlinkSync(path);
}

const probe = run(["-i", OUTPUT]);
const duration = probe.stderr.match(/Duration: ([\d:.]+)/);
console.log(`\nNarracao reconstruida: ${duration ? duration[1] : "?"}  -> public/audio.mp3`);
console.log(`  fala principal ate ${CUT_AT}s, "Muito obrigado" recolocado em ${PLACE_AT}s`);
