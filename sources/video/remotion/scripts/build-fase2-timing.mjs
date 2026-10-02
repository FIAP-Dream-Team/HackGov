// Builds a planned timeline for the Fase 2 video from the roteiro timestamps
// and slide-map. This is the stand-in until a real narration exists and
// scripts/align.mjs can take over the way it does for the Cap 1 video.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => JSON.parse(readFileSync(resolve(here, p), "utf8"));

const FPS = 30;
const roteiro = read("../src/data/fase-2/roteiro.json");
const slideMap = read("../src/data/fase-2/slide-map.json").slides;
const OUT = resolve(here, "../src/data/fase-2/timing.json");

const frame = (sec) => Math.round(sec * FPS);

const falas = roteiro.map((fala) => ({
  id: fala.id,
  speaker: fala.speaker,
  section: fala.section,
  text: fala.text,
  start: fala.startSec,
  end: fala.endSec,
  startFrame: frame(fala.startSec),
  endFrame: frame(fala.endSec),
}));

const slides = slideMap.map((entry, index) => {
  const fala = falas.find((f) => f.id === entry.fala);
  if (!fala) throw new Error(`slide ${entry.slide}: fala ${entry.fala} not in roteiro`);
  const start = entry.startSec;
  const end = index + 1 < slideMap.length ? slideMap[index + 1].startSec : falas[falas.length - 1].end;
  return {
    slide: entry.slide,
    label: entry.label,
    falaId: fala.id,
    speaker: fala.speaker,
    start,
    end,
    startFrame: frame(start),
    endFrame: frame(end),
    durationInFrames: Math.max(1, frame(end) - frame(start)),
    file: `fase-2/${entry.slide}.jpg`,
    deckIndex: Number(entry.slide) - 1,
  };
});

const turns = [];
for (const fala of falas) {
  const last = turns[turns.length - 1];
  if (last && last.speaker === fala.speaker) last.end = fala.end;
  else turns.push({ speaker: fala.speaker, start: fala.start, end: fala.end });
}
for (const turn of turns) {
  turn.startFrame = frame(turn.start);
  turn.endFrame = frame(turn.end);
}

const durationSec = falas[falas.length - 1].end;
const out = {
  fps: FPS,
  durationSec,
  narrationSec: durationSec,
  durationInFrames: frame(durationSec),
  alignmentRate: 1,
  source: "planned-roteiro",
  falas,
  turns,
  slides,
  reveals: [],
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2));

console.log("Timeline Fase 2 (plano de 5:00, sem áudio ainda):");
for (const slide of slides) {
  console.log(
    `  ${slide.slide}  ${slide.label.padEnd(26)} ${slide.start.toFixed(0).padStart(3)}s -> ${slide.end
      .toFixed(0)
      .padStart(3)}s  ${slide.speaker}`,
  );
}
console.log(`\n${out.durationSec}s = ${out.durationInFrames} frames @ ${FPS}fps -> src/data/fase-2/timing.json`);
