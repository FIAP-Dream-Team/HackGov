// Finds where each of the ten falas starts and ends, using only the audio.
//
// The problem: the roteiro says who speaks and what they say, but not when. A
// video whose slides and speaker cards are driven by the roteiro needs those
// boundaries to within a few tenths of a second, or a card lands on the previous
// person's last sentence.
//
// Three signals, in ascending order of how much they can be trusted:
//
//   1. A pause. Necessary but far from sufficient — this narration breathes
//      inside sentences about as long as it does between falas, and one handover
//      has barely a gap at all.
//   2. Pace. Each fala's word count is known, so a candidate cut that leaves
//      someone speaking at 400 words a minute is wrong whatever else says.
//   3. The voice. Every handover here crosses between a male and a female
//      speaker. Measured over a whole fala — tens of seconds — pitch identifies
//      who is talking almost unambiguously.
//
// The scoring judges spans, not cuts. Judging cuts one at a time was the bug
// that put John's 62 words into six seconds: a cut is only as good as the fala
// it leaves behind, so the fala is what gets a cost.
//
// Output is transcript-shaped, so align.mjs consumes it unchanged:
//   node scripts/detect-pauses.mjs
//   TRANSCRIPT=../src/data/transcript.pauses.json npm run align
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import { pitchTrack } from "./pitch.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const AUDIO = resolve(here, "../public/audio.mp3");
const OUT = resolve(here, "../src/data/transcript.pauses.json");
const roteiro = JSON.parse(readFileSync(resolve(here, "../src/data/roteiro.json"), "utf8"));

// Loose on purpose. At -34dB/0.32s the handover from Brenda to Joao produced no
// candidate at all, and the boundary landed four seconds late on the next pause.
// A wide net costs nothing here: the span costs below discard the breaths.
const NOISE_DB = process.env.NOISE_DB ?? "-26dB";
const MIN_SILENCE = process.env.MIN_SILENCE ?? "0.14";

const LENGTH_WEIGHT = 3.0;
const PACE_WEIGHT = 5.0;
const VOICE_WEIGHT = 10.0;
/** Nobody narrates a script outside this band. Anything else is a wrong cut. */
const MIN_WPM = 85;
const MAX_WPM = 215;
/** A fala's pitch this far from its speaker's own pitch means the wrong cut. */
const VOICE_TOLERANCE = 30;
const MAX_VOICE_ERROR = 30;
/**
 * How much of each end of a fala gets checked separately. A cut that lands early
 * leaves the previous speaker bleeding into the front of the next fala, and a
 * median over the whole span will not notice: five seconds of Larissa do not
 * move the median of eighteen seconds of Vinicius. The ends are where the error
 * lives, so the ends get measured.
 */
const EDGE_SPAN = 2.5;
/** Edges are shorter samples and noisier, so their error counts for less. */
const EDGE_DISCOUNT = 0.7;

// --- pauses ------------------------------------------------------------------
console.log(`Procurando pausas (ruido abaixo de ${NOISE_DB}, minimo ${MIN_SILENCE}s)...`);

// silencedetect writes to stderr and ffmpeg still exits 0, so spawnSync is the
// way to get at it: execFileSync only hands back stdout on success.
const run = spawnSync(
  ffmpegPath,
  [
    "-hide_banner",
    "-nostats",
    "-i",
    AUDIO,
    "-af",
    `silencedetect=noise=${NOISE_DB}:d=${MIN_SILENCE}`,
    "-f",
    "null",
    "-",
  ],
  { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
);
if (run.error) throw run.error;
const log = run.stderr ?? "";

const duration = (() => {
  const match = log.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
  if (!match) throw new Error("ffmpeg nao reportou a duracao do audio");
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
})();

const silenceStarts = [...log.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Number(m[1]));
const silenceEnds = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));

// A pause at the very edge of the file is lead-in, not a boundary between falas.
const cuts = silenceStarts
  .map((start, index) => {
    const end = silenceEnds[index] ?? duration;
    return { start, end, length: end - start };
  })
  .filter((s) => s.start > 1 && s.end < duration - 0.5)
  .sort((a, b) => a.start - b.start);

const needed = roteiro.length - 1;
console.log(`${silenceStarts.length} pausas, ${cuts.length} candidatas a divisa.`);

// --- voice -------------------------------------------------------------------
console.log("Medindo a frequencia fundamental...");
const track = pitchTrack(AUDIO);
const voiced = track.filter((x) => x.f0 != null);
const voicedTimes = voiced.map((x) => x.t);
const startOfFirstVoice = voiced.find((x) => x.t < 5)?.t ?? 0;

const lowerBound = (value) => {
  let lo = 0;
  let hi = voicedTimes.length;
  while (lo < hi) {
    const middle = (lo + hi) >> 1;
    if (voicedTimes[middle] < value) lo = middle + 1;
    else hi = middle;
  }
  return lo;
};

const spanCache = new Map();
/** Median pitch over a span. Memoised: the solver asks for the same spans a lot. */
const voiceOf = (from, to) => {
  const key = `${from.toFixed(2)}:${to.toFixed(2)}`;
  if (spanCache.has(key)) return spanCache.get(key);
  const values = voiced
    .slice(lowerBound(from), lowerBound(to))
    .map((x) => x.f0)
    .sort((a, b) => a - b);
  const result = values.length < 15 ? null : values[Math.floor(values.length / 2)];
  spanCache.set(key, result);
  return result;
};

// --- the solver --------------------------------------------------------------
const wordCounts = roteiro.map((f) => f.text.split(/\s+/).filter(Boolean).length);
const totalWords = wordCounts.reduce((a, b) => a + b, 0);
const meanWpm = (totalWords / duration) * 60;

const spanOf = (index, picks) => ({
  from: index === 0 ? startOfFirstVoice : picks[index - 1].end,
  to: index === roteiro.length - 1 ? duration : picks[index].start,
});

/** Each speaker's own pitch, measured across all the falas assigned to them. */
const buildProfile = (picks) => {
  const collected = new Map();
  roteiro.forEach((fala, index) => {
    const { from, to } = spanOf(index, picks);
    const value = voiceOf(from, to);
    if (value == null) return;
    if (!collected.has(fala.speaker)) collected.set(fala.speaker, []);
    collected.get(fala.speaker).push(value);
  });
  return new Map(
    [...collected].map(([speaker, values]) => [
      speaker,
      values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
    ]),
  );
};

let profile = null;

/** What one fala costs, given the two cuts around it. */
const spanCost = (falaIndex, from, to, strict) => {
  const span = to - from;
  if (span <= 0.5) return Infinity;

  const wpm = (wordCounts[falaIndex] / span) * 60;
  if (wpm < MIN_WPM || wpm > MAX_WPM) return Infinity;
  let cost = (PACE_WEIGHT * Math.abs(wpm - meanWpm)) / meanWpm;

  if (profile) {
    const error = voiceError(falaIndex, from, to);
    if (error != null) {
      if (strict && error > MAX_VOICE_ERROR) return Infinity;
      cost += (VOICE_WEIGHT * error) / VOICE_TOLERANCE;
    }
  }

  return cost;
};

/**
 * How far this span's voice is from the person the roteiro puts there. Checks
 * the whole span and both ends, and takes the worst: a span can average out to
 * the right person while starting on the wrong one.
 */
const voiceError = (falaIndex, from, to) => {
  const expected = profile.get(roteiro[falaIndex].speaker);
  if (expected == null) return null;

  const whole = voiceOf(from, to);
  if (whole == null) return null;

  const head = voiceOf(from, Math.min(from + EDGE_SPAN, to));
  const tail = voiceOf(Math.max(to - EDGE_SPAN, from), to);
  const edges = [head, tail]
    .filter((value) => value != null)
    .map((value) => EDGE_DISCOUNT * Math.abs(value - expected));

  return Math.max(Math.abs(whole - expected), ...edges);
};

/** best[k][j]: best score with boundary k placed at candidate j. */
function solve(strict) {
  const N = cuts.length;
  const best = Array.from({ length: needed }, () => new Float64Array(N).fill(-Infinity));
  const cameFrom = Array.from({ length: needed }, () => new Int32Array(N).fill(-1));

  for (let j = 0; j < N; j++) {
    const cost = spanCost(0, startOfFirstVoice, cuts[j].start, strict);
    if (Number.isFinite(cost)) best[0][j] = LENGTH_WEIGHT * cuts[j].length - cost;
  }

  for (let k = 1; k < needed; k++) {
    for (let j = k; j < N; j++) {
      const node = LENGTH_WEIGHT * cuts[j].length;
      for (let i = 0; i < j; i++) {
        if (best[k - 1][i] === -Infinity) continue;
        const cost = spanCost(k, cuts[i].end, cuts[j].start, strict);
        if (!Number.isFinite(cost)) continue;
        const total = best[k - 1][i] - cost + node;
        if (total > best[k][j]) {
          best[k][j] = total;
          cameFrom[k][j] = i;
        }
      }
    }
  }

  let endIndex = -1;
  let endScore = -Infinity;
  for (let j = 0; j < N; j++) {
    if (best[needed - 1][j] === -Infinity) continue;
    const cost = spanCost(roteiro.length - 1, cuts[j].end, duration, strict);
    if (!Number.isFinite(cost)) continue;
    const total = best[needed - 1][j] - cost;
    if (total > endScore) {
      endScore = total;
      endIndex = j;
    }
  }
  if (endIndex < 0) return null;

  const picks = [];
  for (let k = needed - 1, j = endIndex; k >= 0 && j >= 0; k--) {
    picks.unshift(cuts[j]);
    j = k > 0 ? cameFrom[k][j] : -1;
  }
  return picks;
}

const attempt = () => {
  const strictPicks = solve(true);
  if (strictPicks) return strictPicks;
  console.warn("! Nenhuma combinacao satisfaz a regra de voz; relaxando para preferencia.");
  return solve(false);
};

// Seed the voice profile from a uniform split. It is a few seconds off, which
// barely moves the median pitch of a twenty-second fala — plenty to tell these
// five voices apart, and enough to make the first real solve informed.
const seed = [];
let cumulative = 0;
for (let k = 0; k < needed; k++) {
  cumulative += wordCounts[k];
  const at = (duration * cumulative) / totalWords;
  seed.push({ start: at, end: at, length: 0 });
}
profile = buildProfile(seed);
console.log(
  "Vozes (semente): " + [...profile].map(([s, f]) => `${s} ${f.toFixed(0)}Hz`).join(", "),
);

let chosen = attempt();
if (!chosen) {
  throw new Error(
    "Nenhuma combinacao de pausas produz falas plausiveis. Ajuste MIN_SILENCE ou NOISE_DB.",
  );
}

// Re-measure the voices from the real cuts and solve again. It settles in one or
// two rounds; the loop stops as soon as nothing moves.
for (let round = 1; round <= 3; round++) {
  profile = buildProfile(chosen);
  const refined = attempt();
  if (!refined) break;
  const moved = refined.some((cut, index) => cut !== chosen[index]);
  chosen = refined;
  if (!moved) break;
}

console.log("Vozes (final):   " + [...profile].map(([s, f]) => `${s} ${f.toFixed(0)}Hz`).join(", "));

// --- results -----------------------------------------------------------------
// A fala runs from the moment the voice returns after the previous pause to the
// moment it stops before the next. Using the middle of the pause instead starts
// every fala a few tenths before the person opens their mouth, and the speaker
// card lands on the previous speaker's last words.
const startOf = roteiro.map((_, index) => spanOf(index, chosen).from);
const endOf = roteiro.map((_, index) => spanOf(index, chosen).to);

console.log("\nDivisas:");
for (const [index, cut] of chosen.entries()) {
  const changes = roteiro[index].speaker !== roteiro[index + 1].speaker;
  console.log(
    `  ${roteiro[index].id}->${roteiro[index + 1].id}` +
      ` ${roteiro[index].speaker.padEnd(8)}->${roteiro[index + 1].speaker.padEnd(8)}` +
      ` cala em ${cut.start.toFixed(2)}s, retoma em ${cut.end.toFixed(2)}s` +
      `  pausa ${cut.length.toFixed(2)}s  ${changes ? "troca de locutor" : "mesmo locutor"}`,
  );
}

// Verification the cuts cannot fake: with them in the right places, each
// person's own falas sit at the same pitch and nobody speaks impossibly fast.
console.log("\nConferencia:");
const bySpeaker = new Map();
let suspect = 0;
roteiro.forEach((fala, index) => {
  const span = endOf[index] - startOf[index];
  const wpm = (wordCounts[index] / span) * 60;
  const f0 = voiceOf(startOf[index], endOf[index]);
  const expected = profile.get(fala.speaker);
  const error = f0 != null && expected != null ? Math.abs(f0 - expected) : null;
  if (f0 != null) {
    if (!bySpeaker.has(fala.speaker)) bySpeaker.set(fala.speaker, []);
    bySpeaker.get(fala.speaker).push(f0);
  }
  const flags =
    (wpm < 100 || wpm > 200 ? "  <- RITMO SUSPEITO" : "") +
    (error != null && error > 18 ? "  <- VOZ NAO BATE" : "");
  if (flags) suspect++;
  console.log(
    `  ${fala.id} ${fala.speaker.padEnd(9)} ${startOf[index].toFixed(2).padStart(7)}s ->` +
      ` ${endOf[index].toFixed(2).padStart(7)}s  ${wpm.toFixed(0).padStart(3)} pal/min` +
      `  F0 ${f0 == null ? " --" : f0.toFixed(0).padStart(3)}Hz` +
      ` (voz da pessoa: ${expected == null ? "--" : expected.toFixed(0)}Hz)${flags}`,
  );
});
console.log(suspect ? `\n! ${suspect} fala(s) merecem conferencia no audio.` : "\nNenhum alerta.");

// --- output ------------------------------------------------------------------
// Word timing inside a fala is interpolated; only the boundaries are measured.
const words = [];
roteiro.forEach((fala, index) => {
  const from = startOf[index];
  const step = (endOf[index] - from) / wordCounts[index];
  fala.text
    .split(/\s+/)
    .filter(Boolean)
    .forEach((text, k) => {
      words.push({
        text,
        start: Number((from + k * step).toFixed(3)),
        end: Number((from + (k + 1) * step).toFixed(3)),
      });
    });
});

writeFileSync(
  OUT,
  JSON.stringify(
    {
      model: `ffmpeg silencedetect (${NOISE_DB}, ${MIN_SILENCE}s) + F0`,
      durationSec: duration,
      note: "Divisas entre falas medidas do audio; tempo dentro de cada fala e interpolado.",
      text: roteiro.map((f) => f.text).join(" "),
      words,
    },
    null,
    2,
  ),
);

// The boundaries themselves, for align.mjs to use in place of whatever the
// transcript implies. These are measured — pauses located by ffmpeg, speakers
// confirmed by pitch — and a small Whisper model gets them wrong: whisper-tiny
// put the handover to Vinicius at 87.98s, while Larissa is still audibly at
// 235Hz half a second later. Whisper is better at where the words fall inside a
// fala; it is not better than physics at where the fala ends.
writeFileSync(
  resolve(here, "../src/data/boundaries.json"),
  JSON.stringify(
    {
      detector: `silencedetect noise=${NOISE_DB} d=${MIN_SILENCE} + F0`,
      durationSec: duration,
      voices: Object.fromEntries([...profile].map(([s, f]) => [s, Number(f.toFixed(1))])),
      falas: roteiro.map((fala, index) => ({
        id: fala.id,
        speaker: fala.speaker,
        start: Number(startOf[index].toFixed(3)),
        end: Number(endOf[index].toFixed(3)),
      })),
    },
    null,
    2,
  ),
);

console.log(`\n${words.length} palavras, ${duration.toFixed(2)}s -> src/data/transcript.pauses.json`);
