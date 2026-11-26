// Builds the music bed for the EC-1 video: public/ec-1/trilha.wav, with the
// volume automation already applied, and src/data/ec-1/music.json (the curves).
//
// Copied from scripts/fase-3/music-bed.mjs. What stays: the bed sits a fixed
// number of decibels under the narration, fala by fala, and the track's own
// 15 dB of dynamics are mostly flattened, because a bed that swells to its
// climax walks over the voice.
//
// What changed: Fase 3 laid the 2:24 track down twice with the seam fixed at
// 130 s, which only covers videos up to about 4:40. EC-1 can run to 5:00, and
// its length is only known after John records. So the seams are worked out
// here: a later pass picks the track up 14 s in (the join Fase 3 approved by
// ear), the last pass is placed so the track's own closing fade lands on the
// last frame, a third pass comes in only when two cannot cover the video, and
// no seam falls within 2 s of a slide cut.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => JSON.parse(readFileSync(resolve(here, p), "utf8"));

const NARRATION = resolve(here, "../../public/ec-1/narracao.wav");
const MUSIC = resolve(here, "../../public/musica.mp3");
const OUT = resolve(here, "../../src/data/ec-1/music.json");

const SR = 16000;
const FPS = 30;

/** How far under the current speaker the bed sits. */
const HEADROOM_DB = 19;
/** How far under the narration's own average the bed sits with nobody talking. */
const OPEN_HEADROOM_DB = 7;
/** 1 flattens the track's dynamics completely; 0 keeps them. */
const FLATTEN = 0.75;
/** A compressor cuts hard and lifts gently; the bed follows the same rule. */
const MAX_BOOST_DB = 4;
/** Window for both loudness envelopes. Long enough not to pump on every beat. */
const ENVELOPE_SEC = 1.5;
/** Seconds over which the bed level is allowed to move. */
const SMOOTH_SEC = 1.6;
/** Crossfade between the two passes of the track. */
const CROSSFADE_SEC = 6;
/** Where in the track a later pass picks up (the join Fase 3 approved by ear). */
const JOIN_SEC = 14;
/** A seam never lands closer than this to a slide cut. */
const CUT_CLEARANCE_SEC = 2;

const timing = read("../../src/data/ec-1/timing.json");
const boundaries = read("../../src/data/ec-1/boundaries.json");

// --- audio ------------------------------------------------------------------
const decode = (source, cacheName) => {
  const cache = resolve(here, `../../.cache/ec-1/${cacheName}`);
  // A cache older than its source is from a previous take: decode again.
  if (!existsSync(cache) || statSync(cache).mtimeMs < statSync(source).mtimeMs) {
    mkdirSync(dirname(cache), { recursive: true });
    const run = spawnSync(
      ffmpegPath,
      ["-hide_banner", "-loglevel", "error", "-y", "-i", source, "-ac", "1", "-ar", String(SR), "-f", "f32le", cache],
      { encoding: "utf8" },
    );
    if (run.status !== 0) throw new Error(`ffmpeg falhou em ${source}: ${run.stderr}`);
  }
  const buffer = readFileSync(cache);
  return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
};

if (!existsSync(MUSIC)) {
  throw new Error(`Nao achei ${MUSIC}. Copie a trilha para public/musica.mp3.`);
}

const narration = decode(NARRATION, "narracao-16k.f32");
const music = decode(MUSIC, "music-16k.f32");
const musicSeconds = music.length / SR;

/** Prefix sums of squares, so any window's RMS is one subtraction. */
const energyPrefix = (samples) => {
  const prefix = new Float64Array(samples.length + 1);
  for (let i = 0; i < samples.length; i++) prefix[i + 1] = prefix[i] + samples[i] * samples[i];
  return prefix;
};

const narrationEnergy = energyPrefix(narration);
const musicEnergy = energyPrefix(music);

const rmsDb = (prefix, length, centerSec, windowSec) => {
  const half = (windowSec * SR) / 2;
  const from = Math.max(0, Math.round(centerSec * SR - half));
  const to = Math.min(length, Math.round(centerSec * SR + half));
  if (to <= from) return -120;
  return 10 * Math.log10((prefix[to] - prefix[from]) / (to - from) + 1e-12);
};

// --- how loud is each speaker ------------------------------------------------
// The 75th percentile of 20ms frames, not the mean: a fala is mostly gaps
// between words, and averaging those in would read every speaker as quiet.
const frameDb = [];
const HOP = Math.round(0.02 * SR);
for (let i = 0; i + HOP < narration.length; i += HOP) {
  let energy = 0;
  for (let k = 0; k < HOP; k++) energy += narration[i + k] * narration[i + k];
  frameDb.push({ t: i / SR, db: 10 * Math.log10(energy / HOP + 1e-12) });
}

const speechLevel = new Map();
for (const fala of boundaries.falas) {
  const values = frameDb
    .filter((f) => f.t >= fala.start && f.t < fala.end)
    .map((f) => f.db)
    .sort((a, b) => a - b);
  speechLevel.set(fala.id, values[Math.floor(values.length * 0.75)] ?? -20);
}

const levels = [...speechLevel.values()];
const narrationReference = levels.reduce((a, b) => a + b, 0) / levels.length;
const firstVoice = boundaries.falas[0].start;
const narrationEnd = boundaries.falas[boundaries.falas.length - 1].end;

console.log("Nivel de voz por fala e nivel da trilha embaixo dela:");
for (const fala of boundaries.falas) {
  const speech = speechLevel.get(fala.id);
  console.log(
    `  ${fala.id} ${fala.speaker.padEnd(9)} voz ${speech.toFixed(1).padStart(6)} dB` +
      `  ->  trilha ${(speech - HEADROOM_DB).toFixed(1).padStart(6)} dB`,
  );
}
console.log(
  `  sem narracao (abertura e encerramento): trilha ${(narrationReference - OPEN_HEADROOM_DB).toFixed(1)} dB`,
);

// --- the bed's target level, frame by frame ----------------------------------
const totalFrames = timing.durationInFrames;
const rawTarget = new Float64Array(totalFrames);

for (let frame = 0; frame < totalFrames; frame++) {
  const t = frame / FPS;
  if (t < firstVoice || t > narrationEnd) {
    rawTarget[frame] = narrationReference - OPEN_HEADROOM_DB;
    continue;
  }
  // Inside the narration. Gaps between falas are under a second, too short to
  // lift into without pumping, so they inherit the fala that just ended.
  let current = boundaries.falas[0];
  for (const fala of boundaries.falas) {
    if (t >= fala.start) current = fala;
  }
  rawTarget[frame] = speechLevel.get(current.id) - HEADROOM_DB;
}

// Moving average, so the level slides between speakers instead of stepping.
const smoothWindow = Math.round(SMOOTH_SEC * FPS);
const target = new Float64Array(totalFrames);
for (let frame = 0; frame < totalFrames; frame++) {
  const from = Math.max(0, frame - smoothWindow);
  const to = Math.min(totalFrames, frame + smoothWindow + 1);
  let sum = 0;
  for (let k = from; k < to; k++) sum += rawTarget[k];
  target[frame] = sum / (to - from);
}

// --- the passes --------------------------------------------------------------
const videoSeconds = totalFrames / FPS;
const crossfadeFrames = Math.round(CROSSFADE_SEC * FPS);
const cuts = timing.scenes.map((sc) => sc.start).filter((t) => t > 0);
/** Moves a seam earlier until its crossfade is clear of every slide cut. */
const clearOfCuts = (sec) => {
  let t = sec;
  for (let guard = 0; guard < 20; guard++) {
    const near = cuts.find((c) => c > t - CUT_CLEARANCE_SEC && c < t + CROSSFADE_SEC + CUT_CLEARANCE_SEC);
    if (near == null) return t;
    t = near - CROSSFADE_SEC - CUT_CLEARANCE_SEC;
  }
  return t;
};

/** The latest a pass can hand over and still have music for the whole crossfade. */
const latestSeam = (pass) => pass.start + (musicSeconds - pass.offset) - CROSSFADE_SEC - 1;

/** Each pass: when it comes in (video seconds) and where in the track it starts. */
const passes = [{ start: 0, offset: 0 }];
for (;;) {
  const current = passes[passes.length - 1];
  const latest = latestSeam(current);
  // A final pass that starts JOIN_SEC into the track and ends with it.
  const finalStart = videoSeconds - (musicSeconds - JOIN_SEC);
  if (finalStart <= latest) {
    // Short videos: the final pass starts later in the track instead, and the
    // seam sits as late as the current pass allows.
    const seam = clearOfCuts(Math.max(finalStart, Math.min(latest, current.start + 120)));
    const offset = musicSeconds - (videoSeconds - seam);
    if (offset < 0) throw new Error("Nao foi possivel encaixar a ultima passada da trilha.");
    passes.push({ start: seam, offset });
    break;
  }
  passes.push({ start: clearOfCuts(latest), offset: JOIN_SEC });
  if (passes.length > 4) throw new Error("A trilha precisaria de mais de 4 passadas.");
}

const musicReferenceDb = rmsDb(musicEnergy, music.length, musicSeconds / 2, musicSeconds);

/**
 * Gain for one pass at one frame. Flattening is partial: `FLATTEN` of the way
 * to the target, the rest tracking the track's own shape.
 */
const gainAt = (sourceSec, frame) => {
  if (sourceSec < 0 || sourceSec >= musicSeconds) return 0;
  const musicDb = rmsDb(musicEnergy, music.length, sourceSec, ENVELOPE_SEC);
  const corrected =
    FLATTEN * (target[frame] - musicDb) + (1 - FLATTEN) * (target[frame] - musicReferenceDb);
  // Asymmetric on purpose: cutting the climax back is the point; boosting is
  // capped low so the flattening cannot undo the track's own closing fade.
  return 10 ** (Math.max(-40, Math.min(MAX_BOOST_DB, corrected)) / 20);
};

/** Equal power, so the sum stays level through the crossfade. */
const fadeIn = (progress) => Math.sin((Math.min(Math.max(progress, 0), 1) * Math.PI) / 2);
const fadeOut = (progress) => Math.cos((Math.min(Math.max(progress, 0), 1) * Math.PI) / 2);

// One gain curve per pass, over the whole video (zero where the pass is silent).
const curves = passes.map((pass, p) => {
  const curve = new Float64Array(totalFrames);
  const startFrame = Math.round(pass.start * FPS);
  const next = passes[p + 1];
  const endFrame = next ? Math.round(next.start * FPS) : Infinity;
  for (let frame = Math.max(0, startFrame); frame < totalFrames; frame++) {
    const sourceSec = pass.offset + (frame - startFrame) / FPS;
    const enter = p === 0 ? fadeIn(frame / (1.5 * FPS)) : fadeIn((frame - startFrame) / crossfadeFrames);
    const leave = next ? fadeOut((frame - endFrame) / crossfadeFrames) : 1;
    curve[frame] = gainAt(sourceSec, frame) * enter * leave;
  }
  return curve;
});

const round = (value) => Number(value.toFixed(4));

writeFileSync(
  OUT,
  JSON.stringify(
    {
      file: "musica.mp3",
      // The mix the composition plays: the curves below, already applied.
      bed: "ec-1/trilha.wav",
      fps: FPS,
      headroomDb: HEADROOM_DB,
      trackSeconds: Number(musicSeconds.toFixed(2)),
      passes: passes.map((pass) => ({ startSec: Number(pass.start.toFixed(2)), trackOffsetSec: Number(pass.offset.toFixed(2)) })),
      levels: Object.fromEntries(boundaries.falas.map((f) => [f.id, Number(speechLevel.get(f.id).toFixed(1))])),
      curves: curves.map((curve) => Array.from(curve, round)),
    },
    null,
    2,
  ),
);

// --- bake the bed into one file -------------------------------------------------
// Remotion turns a per-frame volume function into one nested ffmpeg if()
// expression per distinct value. Over a 4:20 video that expression is too long
// for ffmpeg to parse ("Missing ')' or too many args") and the render dies at
// the audio step. So the automation is applied here, sample by sample, and the
// composition plays public/ec-1/trilha.wav as it is.
const BED_SR = 48000;
const bedCache = resolve(here, "../../.cache/ec-1/music-48k-stereo.f32");
if (!existsSync(bedCache)) {
  const run = spawnSync(
    ffmpegPath,
    ["-hide_banner", "-loglevel", "error", "-y", "-i", MUSIC, "-ac", "2", "-ar", String(BED_SR), "-f", "f32le", bedCache],
    { encoding: "utf8" },
  );
  if (run.status !== 0) throw new Error(`ffmpeg falhou na trilha: ${run.stderr}`);
}
const bedSource = (() => {
  const buffer = readFileSync(bedCache);
  return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
})();
const sourceFrames = bedSource.length / 2;
const outFrames = Math.round(videoSeconds * BED_SR);
const bed = new Float32Array(outFrames * 2);

/** Per-frame gain, interpolated to the sample so the level never steps audibly. */
const gainBetween = (curve, position) => {
  const i = Math.floor(position);
  if (i < 0 || i >= curve.length) return 0;
  const next = i + 1 < curve.length ? curve[i + 1] : curve[i];
  return curve[i] + (next - curve[i]) * (position - i);
};

for (let n = 0; n < outFrames; n++) {
  const t = n / BED_SR;
  let left = 0;
  let right = 0;
  for (let p = 0; p < passes.length; p++) {
    const pass = passes[p];
    if (t < pass.start) continue;
    const g = gainBetween(curves[p], t * FPS);
    if (g === 0) continue;
    const at = Math.round((pass.offset + (t - pass.start)) * BED_SR);
    if (at < 0 || at >= sourceFrames) continue;
    left += bedSource[2 * at] * g;
    right += bedSource[2 * at + 1] * g;
  }
  bed[2 * n] = left;
  bed[2 * n + 1] = right;
}

const bedRaw = resolve(here, "../../.cache/ec-1/trilha.f32");
writeFileSync(bedRaw, Buffer.from(bed.buffer));
const BED_OUT = resolve(here, "../../public/ec-1/trilha.wav");
const encode = spawnSync(
  ffmpegPath,
  ["-hide_banner", "-loglevel", "error", "-y", "-f", "f32le", "-ar", String(BED_SR), "-ac", "2", "-i", bedRaw, "-c:a", "pcm_s24le", BED_OUT],
  { encoding: "utf8" },
);
if (encode.status !== 0) throw new Error(`ffmpeg falhou ao gravar a trilha: ${encode.stderr}`);

let peak = 0;
for (const curve of curves) for (const g of curve) peak = Math.max(peak, g);
console.log(`\nTrilha ${musicSeconds.toFixed(1)}s cobrindo ${videoSeconds.toFixed(1)}s em ${passes.length} passadas:`);
for (const pass of passes) console.log(`  entra em ${pass.start.toFixed(1)}s, a partir de ${pass.offset.toFixed(1)}s da faixa`);
console.log("Trilha mixada com a automacao aplicada -> public/ec-1/trilha.wav");
console.log(`Ganho maximo aplicado: ${peak.toFixed(3)}  -> src/data/ec-1/music.json`);
