// Transcribes audio.mp3 with word-level timestamps using Whisper running fully
// in Node (ONNX runtime, no Python). ffmpeg decodes the mp3 into the raw 16kHz
// mono float PCM the model expects.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import { pipeline } from "@huggingface/transformers";

const here = dirname(fileURLToPath(import.meta.url));
const AUDIO = resolve(here, "../../../fase-2/audio.wav");
const PCM = resolve(here, "../../.cache/fase-2/audio-16k.f32");
const OUT = resolve(here, "../../src/data/fase-2/transcript.json");

// whisper-tiny quantised is ~40MB against ~400MB for small in fp32. On this
// connection (~6KB/s to the HuggingFace CDN) that is the difference between
// forty minutes and most of a day, and the accuracy gap barely matters here:
// align.mjs matches the transcript against the roteiro we already have, so it
// needs timestamps that land in the right place, not a perfect transcription.
//
// These defaults match what scripts/fetch-model.sh downloads. Change one and
// the library will try to fetch a different file.
const MODEL = process.env.WHISPER_MODEL ?? "onnx-community/whisper-tiny";
const ENCODER_DTYPE = process.env.WHISPER_ENCODER_DTYPE ?? "q4";
const DECODER_DTYPE = process.env.WHISPER_DECODER_DTYPE ?? "q8";

function decodeAudio() {
  mkdirSync(dirname(PCM), { recursive: true });
  if (!existsSync(PCM)) {
    console.log("Decodificando audio.mp3 -> PCM 16kHz mono...");
    execFileSync(ffmpegPath, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", AUDIO,
      "-ac", "1", "-ar", "16000",
      "-f", "f32le", PCM,
    ]);
  }
  const buf = readFileSync(PCM);
  const samples = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  console.log(`  ${samples.length} amostras = ${(samples.length / 16000).toFixed(2)}s`);
  return samples;
}

const audio = decodeAudio();

console.log(`Carregando ${MODEL} (primeira vez baixa o modelo)...`);
const transcriber = await pipeline("automatic-speech-recognition", MODEL, {
  dtype: { encoder_model: ENCODER_DTYPE, decoder_model_merged: DECODER_DTYPE },
  device: "cpu",
});

console.log("Transcrevendo...");
const started = Date.now();

const options = {
  language: "portuguese",
  task: "transcribe",
  chunk_length_s: 30,
  stride_length_s: 5,
};

// Word-level timestamps need the decoder to emit cross attentions, which the
// quantised exports do not carry. Segment-level timestamps always work, and are
// still a large gain: align.mjs then interpolates inside a phrase instead of
// across a whole fala.
let result;
let granularity = "palavra";
try {
  result = await transcriber(audio, { ...options, return_timestamps: "word" });
} catch (error) {
  if (!/cross attentions/i.test(String(error))) throw error;
  console.log("  sem timestamps por palavra neste export; usando por segmento.");
  granularity = "segmento";
  result = await transcriber(audio, { ...options, return_timestamps: true });
}
console.log(`  concluido em ${((Date.now() - started) / 1000).toFixed(1)}s`);

const chunks = (result.chunks ?? []).filter(
  (c) => c.timestamp?.[0] != null && c.text?.trim(),
);

// Downstream only knows about words, so a segment is spread across its own words.
const words =
  granularity === "palavra"
    ? chunks.map((c) => ({ text: c.text.trim(), start: c.timestamp[0], end: c.timestamp[1] }))
    : chunks.flatMap((c) => {
        const tokens = c.text.trim().split(/\s+/).filter(Boolean);
        const from = c.timestamp[0];
        const to = c.timestamp[1] ?? from + tokens.length * 0.35;
        const step = (to - from) / Math.max(tokens.length, 1);
        return tokens.map((text, k) => ({
          text,
          start: Number((from + k * step).toFixed(3)),
          end: Number((from + (k + 1) * step).toFixed(3)),
        }));
      });

console.log(`  ${chunks.length} segmentos, granularidade por ${granularity}`);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify({ model: MODEL, durationSec: audio.length / 16000, text: result.text, words }, null, 2),
);

console.log(`${words.length} palavras -> src/data/fase-2/transcript.json`);
console.log(result.text.slice(0, 400));
