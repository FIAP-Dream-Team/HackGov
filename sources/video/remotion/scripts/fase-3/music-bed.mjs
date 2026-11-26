// Builds the volume automation for the music bed.
//
// A fixed music level does not work here. Measured over the narration, the five
// speakers sit 8.9dB apart: Vinicius peaks at -13.8dBFS, Joao Pedro at -21.9. A
// bed set to sit politely under Vinicius walks all over Joao. So the bed level
// is derived per fala, from that speaker's own level, and stays a fixed number
// of decibels under whoever is talking.
//
// Two more jobs on top of that:
//
//   - The track's own dynamics span 15dB, from a -27dB intro to a -12dB climax.
//     Left alone the bed would vanish under the opening and poke through the
//     middle. It is mostly, not fully, flattened — a completely flat bed sounds
//     dead.
//   - The track is 2:24 and the video is 4:20. Rather than loop and hope, it is
//     laid down twice with a crossfade, positioned so the track's own closing
//     fade lands exactly on the final slide.
//
// Output is src/data/fase-3/music.json, read by Fase3.tsx.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => JSON.parse(readFileSync(resolve(here, p), "utf8"));

const NARRATION = resolve(here, "../../public/fase-3/narracao.wav");
const MUSIC = resolve(here, "../../public/musica.mp3");
const OUT = resolve(here, "../../src/data/fase-3/music.json");

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
/** Where the second pass takes over. Mid-slide, never on a cut. */
const SEAM_SEC = 130;

const timing = read("../../src/data/fase-3/timing.json");
const boundaries = read("../../src/data/fase-3/boundaries.json");

// --- audio ------------------------------------------------------------------
const decode = (source, cacheName) => {
  const cache = resolve(here, `../../.cache/fase-3/${cacheName}`);
  if (!existsSync(cache)) {
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

// --- the two passes ----------------------------------------------------------
const videoSeconds = totalFrames / FPS;
const seamFrame = Math.round(SEAM_SEC * FPS);
const crossfadeFrames = Math.round(CROSSFADE_SEC * FPS);

// The second pass is positioned so the track's last sample lands on the video's
// last frame: its own closing fade becomes the video's closing fade.
const secondOffsetSec = musicSeconds - (videoSeconds - SEAM_SEC);
if (secondOffsetSec < 0) {
  throw new Error("A trilha e curta demais para cobrir o video mesmo com duas passadas.");
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
  // Asymmetric on purpose. Cutting the climax back is the whole point; boosting
  // is capped low so the flattening cannot undo the track's own closing fade,
  // which is what carries the ending. Left unbounded it asked for +12dB there.
  return 10 ** (Math.max(-40, Math.min(MAX_BOOST_DB, corrected)) / 20);
};

/** Equal power, so the sum stays level through the crossfade. */
const fadeIn = (progress) => Math.sin((Math.min(Math.max(progress, 0), 1) * Math.PI) / 2);
const fadeOut = (progress) => Math.cos((Math.min(Math.max(progress, 0), 1) * Math.PI) / 2);

const first = new Float64Array(totalFrames);
const second = new Float64Array(totalFrames - seamFrame);

for (let frame = 0; frame < totalFrames; frame++) {
  const seamProgress = (frame - seamFrame) / crossfadeFrames;
  const opening = fadeIn(frame / (1.5 * FPS));
  first[frame] = gainAt(frame / FPS, frame) * fadeOut(seamProgress) * opening;
}

for (let index = 0; index < second.length; index++) {
  const frame = seamFrame + index;
  const sourceSec = secondOffsetSec + index / FPS;
  second[index] = gainAt(sourceSec, frame) * fadeIn(index / crossfadeFrames);
}

const round = (value) => Number(value.toFixed(4));

writeFileSync(
  OUT,
  JSON.stringify(
    {
      file: "musica.mp3",
      // The mix the composition plays: the curves below, already applied.
      bed: "fase-3/trilha.wav",
      fps: FPS,
      headroomDb: HEADROOM_DB,
      trackSeconds: Number(musicSeconds.toFixed(2)),
      seamFrame,
      secondPassTrimFrames: Math.round(secondOffsetSec * FPS),
      levels: Object.fromEntries(
        boundaries.falas.map((f) => [f.id, Number(speechLevel.get(f.id).toFixed(1))]),
      ),
      first: Array.from(first, round),
      second: Array.from(second, round),
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
// composition plays public/fase-3/trilha.wav as it is.
const BED_SR = 48000;
const bedCache = resolve(here, "../../.cache/fase-3/music-48k-stereo.f32");
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
const trimSec = Math.round(secondOffsetSec * FPS) / FPS;
const seamSec = seamFrame / FPS;
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
  const g1 = gainBetween(first, t * FPS);
  const s1 = n < sourceFrames ? n : -1;
  let left = s1 >= 0 ? bedSource[2 * s1] * g1 : 0;
  let right = s1 >= 0 ? bedSource[2 * s1 + 1] * g1 : 0;
  if (t >= seamSec) {
    const s2 = Math.round((trimSec + (t - seamSec)) * BED_SR);
    if (s2 < sourceFrames) {
      const g2 = gainBetween(second, (t - seamSec) * FPS);
      left += bedSource[2 * s2] * g2;
      right += bedSource[2 * s2 + 1] * g2;
    }
  }
  bed[2 * n] = left;
  bed[2 * n + 1] = right;
}

const bedRaw = resolve(here, "../../.cache/fase-3/trilha.f32");
writeFileSync(bedRaw, Buffer.from(bed.buffer));
const BED_OUT = resolve(here, "../../public/fase-3/trilha.wav");
const encode = spawnSync(
  ffmpegPath,
  ["-hide_banner", "-loglevel", "error", "-y", "-f", "f32le", "-ar", String(BED_SR), "-ac", "2", "-i", bedRaw, "-c:a", "pcm_s24le", BED_OUT],
  { encoding: "utf8" },
);
if (encode.status !== 0) throw new Error(`ffmpeg falhou ao gravar a trilha: ${encode.stderr}`);

const peak = Math.max(...first, ...second);
console.log(
  `\nTrilha ${musicSeconds.toFixed(1)}s cobrindo ${videoSeconds.toFixed(1)}s:` +
    ` passada 1 de 0s, passada 2 entra em ${SEAM_SEC}s a partir de ${secondOffsetSec.toFixed(1)}s da faixa.`,
);
console.log(`Trilha mixada com a automacao aplicada -> public/fase-3/trilha.wav`);
console.log(
  `O fade final da propria musica cai em ${(SEAM_SEC + (musicSeconds - secondOffsetSec) - 5).toFixed(1)}s,` +
    ` sobre o slide de encerramento.`,
);
console.log(`Ganho maximo aplicado: ${peak.toFixed(3)}  -> src/data/fase-3/music.json`);
