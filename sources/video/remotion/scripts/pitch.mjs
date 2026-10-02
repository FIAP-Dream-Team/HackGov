// Fundamental-frequency track for the narration, used to find where the voice
// actually changes.
//
// Silence alone cannot tell a breath apart from a handover: this recording
// pauses inside sentences about as long as it does between falas. But every
// handover in this roteiro crosses between a male and a female voice, and that
// shows up as a large, unambiguous shift in F0.
//
// Autocorrelation at 8kHz. Speech F0 tops out around 350Hz, so the extra
// bandwidth of the 16kHz copy buys nothing here and costs four times the work.
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const SR = 8000;
const WINDOW = 512; // 64ms: long enough to hold two periods of a 70Hz voice
const HOP = 160; // 20ms
const MIN_HZ = 70;
const MAX_HZ = 350;
const MIN_LAG = Math.floor(SR / MAX_HZ);
const MAX_LAG = Math.ceil(SR / MIN_HZ);
/** Below this correlation the window is noise or a consonant, not a vowel. */
const VOICED_CORRELATION = 0.34;

function decode(audioPath) {
  const cache = resolve(here, "../.cache/audio-8k.f32");
  if (!existsSync(cache)) {
    mkdirSync(dirname(cache), { recursive: true });
    const run = spawnSync(
      ffmpegPath,
      ["-hide_banner", "-loglevel", "error", "-y", "-i", audioPath, "-ac", "1", "-ar", String(SR), "-f", "f32le", cache],
      { encoding: "utf8" },
    );
    if (run.status !== 0) throw new Error(`ffmpeg falhou: ${run.stderr}`);
  }
  const buffer = readFileSync(cache);
  return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
}

/** Returns one entry per 20ms: { t, f0, rms }. f0 is null when unvoiced. */
export function pitchTrack(audioPath) {
  const samples = decode(audioPath);
  const track = [];

  // Hann window, precomputed once.
  const hann = new Float32Array(WINDOW);
  for (let i = 0; i < WINDOW; i++) hann[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (WINDOW - 1));

  const frame = new Float32Array(WINDOW);

  for (let offset = 0; offset + WINDOW < samples.length; offset += HOP) {
    let mean = 0;
    for (let i = 0; i < WINDOW; i++) mean += samples[offset + i];
    mean /= WINDOW;

    let energy = 0;
    for (let i = 0; i < WINDOW; i++) {
      const value = samples[offset + i] - mean;
      frame[i] = value * hann[i];
      energy += value * value;
    }
    const rms = Math.sqrt(energy / WINDOW);
    const t = offset / SR;

    if (rms < 0.004) {
      track.push({ t, f0: null, rms });
      continue;
    }

    // Normalised autocorrelation, peak-picked over the plausible lag range.
    let bestLag = 0;
    let bestScore = 0;
    for (let lag = MIN_LAG; lag <= MAX_LAG; lag++) {
      const span = WINDOW - lag;
      let dot = 0;
      let left = 0;
      let right = 0;
      for (let i = 0; i < span; i++) {
        const a = frame[i];
        const b = frame[i + lag];
        dot += a * b;
        left += a * a;
        right += b * b;
      }
      const denominator = Math.sqrt(left * right);
      if (denominator <= 0) continue;
      const score = dot / denominator;
      if (score > bestScore) {
        bestScore = score;
        bestLag = lag;
      }
    }

    track.push({
      t,
      f0: bestScore >= VOICED_CORRELATION && bestLag > 0 ? SR / bestLag : null,
      rms,
    });
  }

  // Median filter over five frames: kills the octave errors autocorrelation
  // makes on individual windows without smearing real transitions.
  const smoothed = track.map((entry, index) => {
    const window = track
      .slice(Math.max(0, index - 2), index + 3)
      .map((x) => x.f0)
      .filter((x) => x != null)
      .sort((a, b) => a - b);
    return { ...entry, f0: window.length >= 3 ? window[Math.floor(window.length / 2)] : entry.f0 };
  });

  return smoothed;
}

/**
 * Median F0 of the voiced frames in a span. Returns null when the span holds
 * too little voice to judge.
 */
export function medianF0(track, from, to, minimumVoiced = 8) {
  const values = track
    .filter((x) => x.t >= from && x.t < to && x.f0 != null)
    .map((x) => x.f0)
    .sort((a, b) => a - b);
  if (values.length < minimumVoiced) return null;
  return values[Math.floor(values.length / 2)];
}
