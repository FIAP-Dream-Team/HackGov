// Builds a stand-in transcript that spreads the roteiro words evenly across the
// real audio duration. It exists so the timeline, the anchors and the render can
// be exercised without waiting on the Whisper download; the real transcript
// replaces it and nothing downstream changes.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const roteiro = JSON.parse(readFileSync(resolve(here, "../src/data/roteiro.json"), "utf8"));

const DURATION = 190.0; // measured by ffmpeg from audio.mp3
const LEAD_IN = 0.6; // the narration does not start on frame zero
const GAP = 0.55; // pause between falas

const allWords = roteiro.flatMap((f) => f.text.split(/\s+/).filter(Boolean));
const speakingTime = DURATION - LEAD_IN - GAP * (roteiro.length - 1);
const perWord = speakingTime / allWords.length;

const words = [];
let clock = LEAD_IN;
for (const fala of roteiro) {
  for (const raw of fala.text.split(/\s+/).filter(Boolean)) {
    words.push({ text: raw, start: Number(clock.toFixed(3)), end: Number((clock + perWord).toFixed(3)) });
    clock += perWord;
  }
  clock += GAP;
}

writeFileSync(
  resolve(here, "../src/data/transcript.sample.json"),
  JSON.stringify(
    {
      model: "sintetico (distribuicao uniforme) - NAO usar na entrega",
      durationSec: DURATION,
      text: allWords.join(" "),
      words,
    },
    null,
    2,
  ),
);

console.log(`Transcript sintetico: ${words.length} palavras, ${perWord.toFixed(3)}s por palavra`);
