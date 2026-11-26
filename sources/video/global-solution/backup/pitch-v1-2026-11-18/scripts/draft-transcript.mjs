// Writes an ESTIMATED transcript for the EC-1 narration, before John records it.
//
// align.mjs needs word times to place every scene, reveal and camera move. With
// no audio yet, this spreads the roteiro over time at John's measured pace (Fase
// 3: 139 to 173 words per minute, 158 on average), with breaths at punctuation
// and between falas. The result lets the deck be previewed in motion and the
// total length checked against the 5-minute cap. Once audio.wav exists,
// `npm run gsp:transcribe` replaces this file with the real word times.
//
//   node scripts/gs-pitch/draft-transcript.mjs          158 words per minute
//   node scripts/gs-pitch/draft-transcript.mjs 139      John's slowest pace
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const data = (p) => resolve(here, "../../src/data/gs-pitch", p);

const WPM = Number(process.argv[2] ?? 158);
const LEAD_IN = 0.6;
const PAUSE = { ",": 0.18, ";": 0.3, ":": 0.3, ".": 0.45, "?": 0.5, "!": 0.5 };
const BETWEEN_FALAS = 0.9;

const roteiro = JSON.parse(readFileSync(data("roteiro.json"), "utf8"));
const words = roteiro.flatMap((f) => f.text.split(/\s+/).filter(Boolean).map((text, i, all) => ({ text, last: i === all.length - 1 })));

// The Fase 3 pace was measured fala by fala, first word to last, so it already
// pays for the pauses inside a fala; the breath between falas comes on top.
// Longer words take longer, within that budget.
const GAP = 0.04;
const letters = (w) => w.replace(/[^\p{L}\p{N}]/gu, "").length || 1;
const pauseOf = (w) => (w.last ? BETWEEN_FALAS : PAUSE[w.text.slice(-1)] ?? 0);
const inside = words.reduce((a, w) => a + (w.last ? 0 : pauseOf(w)), 0);
const speakingSec = (words.length / WPM) * 60 - inside - GAP * words.length;
const perLetter = speakingSec / words.reduce((a, w) => a + letters(w.text), 0);

let t = LEAD_IN;
const out = words.map((w) => {
  const length = letters(w.text) * perLetter;
  const word = { text: w.text, start: Number(t.toFixed(3)), end: Number((t + length).toFixed(3)), p: 1 };
  t += length + GAP + pauseOf(w);
  return word;
});
const durationSec = Number((t + 0.5).toFixed(3));

writeFileSync(
  data("transcript.json"),
  JSON.stringify({ model: `estimativa ${WPM} pal/min (sem audio)`, draft: true, durationSec, text: words.map((w) => w.text).join(" "), words: out }, null, 2) + "\n",
);
console.log(`${words.length} palavras a ${WPM} pal/min -> ${durationSec.toFixed(1)} s de narracao estimada (src/data/gs-pitch/transcript.json)`);
