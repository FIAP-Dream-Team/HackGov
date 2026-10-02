// Copy of scripts/align.mjs pointed at the Fase 2 narration and PDF slides.
// Does not read or write Cap 1 JSON (roteiro.json, timing.json, slides.json).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const data = (p) => resolve(here, "../../src/data/fase-2", p);
const read = (p) => JSON.parse(readFileSync(data(p), "utf8"));

const FPS = 30;
const OUTRO_SEC = 3.5;
const roteiro = read("roteiro.json");
const transcript = read(process.env.TRANSCRIPT ?? "transcript.pauses.json");
const slideMap = read("slide-map.json").slides;

const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9%]+/g, "");

const scriptTokens = [];
for (const fala of roteiro) {
  for (const raw of fala.text.split(/\s+/)) {
    const w = normalize(raw);
    if (w) scriptTokens.push({ w, falaId: fala.id, raw });
  }
}

const heardTokens = transcript.words
  .map((x) => ({ w: normalize(x.text), start: x.start, end: x.end }))
  .filter((x) => x.w);

const MATCH = 2;
const MISMATCH = -1;
const GAP = -1;
const n = scriptTokens.length;
const m = heardTokens.length;
const score = new Int32Array((n + 1) * (m + 1));
const at = (i, j) => i * (m + 1) + j;

for (let i = 1; i <= n; i++) score[at(i, 0)] = i * GAP;
for (let j = 1; j <= m; j++) score[at(0, j)] = j * GAP;

for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= m; j++) {
    const sub =
      score[at(i - 1, j - 1)] + (scriptTokens[i - 1].w === heardTokens[j - 1].w ? MATCH : MISMATCH);
    const del = score[at(i - 1, j)] + GAP;
    const ins = score[at(i, j - 1)] + GAP;
    score[at(i, j)] = Math.max(sub, del, ins);
  }
}

let ti = n;
let tj = m;
while (ti > 0 && tj > 0) {
  const cur = score[at(ti, tj)];
  const same = scriptTokens[ti - 1].w === heardTokens[tj - 1].w;
  if (cur === score[at(ti - 1, tj - 1)] + (same ? MATCH : MISMATCH)) {
    if (same) {
      scriptTokens[ti - 1].start = heardTokens[tj - 1].start;
      scriptTokens[ti - 1].end = heardTokens[tj - 1].end;
    }
    ti--;
    tj--;
  } else if (cur === score[at(ti - 1, tj)] + GAP) {
    ti--;
  } else {
    tj--;
  }
}

const matched = scriptTokens.filter((t) => t.start != null).length;
console.log(
  `Alinhamento: ${matched}/${n} palavras do roteiro casaram com o audio (${((matched / n) * 100).toFixed(1)}%)`,
);

const known = scriptTokens.map((t, k) => (t.start != null ? k : -1)).filter((k) => k >= 0);
if (known.length < 2) {
  throw new Error("Alinhamento fraco demais. Rode detect-pauses.mjs da Fase 2 primeiro.");
}
for (let k = 0; k < scriptTokens.length; k++) {
  if (scriptTokens[k].start != null) continue;
  const prev = known.filter((x) => x < k).pop();
  const next = known.find((x) => x > k);
  if (prev == null) {
    scriptTokens[k].start = scriptTokens[next].start;
  } else if (next == null) {
    scriptTokens[k].start = scriptTokens[prev].end;
  } else {
    const a = scriptTokens[prev].end;
    const b = scriptTokens[next].start;
    scriptTokens[k].start = a + ((b - a) * (k - prev)) / (next - prev);
  }
  scriptTokens[k].end = scriptTokens[k].start;
}

const falas = roteiro.map((f) => {
  const toks = scriptTokens.filter((t) => t.falaId === f.id);
  return { ...f, start: toks[0].start, end: toks[toks.length - 1].end, tokens: toks };
});

for (let k = 0; k < falas.length - 1; k++) {
  if (falas[k].end > falas[k + 1].start) falas[k].end = falas[k + 1].start;
}

let measured = null;
try {
  measured = read("boundaries.json");
} catch {
  console.warn("  ! boundaries.json da Fase 2 nao existe. Rode detect-pauses.mjs.");
}

if (measured) {
  console.log("\nDivisas medidas (substituem as da transcricao):");
  for (const fala of falas) {
    const source = measured.falas.find((f) => f.id === fala.id);
    if (!source) continue;
    console.log(
      `  ${fala.id} ${fala.speaker.padEnd(9)} ${source.start.toFixed(2).padStart(7)}s -> ${source.end.toFixed(2).padStart(7)}s`,
    );
    fala.start = source.start;
    fala.end = source.end;
  }
}

falas[0].start = 0;
falas[falas.length - 1].end = measured ? measured.durationSec : transcript.durationSec;

for (const fala of falas) {
  const first = fala.tokens[0].start;
  const last = fala.tokens[fala.tokens.length - 1].end;
  const width = last - first;
  if (width <= 0) continue;
  const scale = (fala.end - fala.start) / width;
  for (const token of fala.tokens) {
    token.start = fala.start + (token.start - first) * scale;
    token.end = fala.start + (token.end - first) * scale;
  }
}

console.log("\nFalas:");
for (const f of falas) {
  console.log(
    `  ${f.id} ${f.speaker.padEnd(9)} ${f.start.toFixed(2).padStart(7)}s -> ${f.end.toFixed(2).padStart(7)}s  (${(f.end - f.start).toFixed(1)}s)`,
  );
}

function anchorTime(fala, anchor) {
  const needle = anchor.split(/\s+/).map(normalize).filter(Boolean);
  for (let k = 0; k + needle.length <= fala.tokens.length; k++) {
    if (needle.every((w, o) => fala.tokens[k + o].w === w)) return fala.tokens[k].start;
  }
  console.warn(`  ! anchor nao encontrado em ${fala.id}: "${anchor}" -- usando o inicio da fala`);
  return null;
}

const byFala = new Map();
for (const entry of slideMap) {
  if (!byFala.has(entry.fala)) byFala.set(entry.fala, []);
  byFala.get(entry.fala).push(entry);
}

const timeline = [];
for (const fala of falas) {
  const entries = byFala.get(fala.id) ?? [];
  if (!entries.length) continue;

  const starts = entries.map((e, idx) => {
    if (e.anchor) return anchorTime(fala, e.anchor);
    return idx === 0 ? fala.start : null;
  });

  for (let k = 0; k < starts.length; k++) {
    if (starts[k] != null) continue;
    let anchorIdx = k - 1;
    while (anchorIdx >= 0 && starts[anchorIdx] == null) anchorIdx--;
    const from = anchorIdx >= 0 ? starts[anchorIdx] : fala.start;
    let nextIdx = k + 1;
    while (nextIdx < starts.length && starts[nextIdx] == null) nextIdx++;
    const to = nextIdx < starts.length ? starts[nextIdx] : fala.end;
    const run = entries.slice(Math.max(anchorIdx, 0), nextIdx);
    const total = run.reduce((s, e) => s + (e.share ?? 1), 0);
    let acc = 0;
    for (const e of run) {
      const idx = entries.indexOf(e);
      if (starts[idx] == null) starts[idx] = from + ((to - from) * acc) / total;
      acc += e.share ?? 1;
    }
  }

  entries.forEach((e, idx) => {
    timeline.push({
      slide: e.slide,
      label: e.label,
      falaId: fala.id,
      speaker: fala.speaker,
      start: starts[idx] ?? fala.start,
      anchor: e.anchor ?? null,
    });
  });
}

const videoEnd = falas[falas.length - 1].end + OUTRO_SEC;
const frame = (sec) => Math.round(sec * FPS);

timeline.sort((a, b) => a.start - b.start);
timeline.forEach((t, idx) => {
  t.end = idx + 1 < timeline.length ? timeline[idx + 1].start : videoEnd;
  t.startFrame = frame(t.start);
  t.endFrame = frame(t.end);
  t.durationInFrames = Math.max(1, t.endFrame - t.startFrame);
  t.file = `fase-2/${t.slide}.jpg`;
  t.deckIndex = Number(t.slide) - 1;
});

console.log("\nTimeline:");
for (const t of timeline) {
  console.log(
    `  ${t.slide}  ${t.label.padEnd(26)} ${t.start.toFixed(2).padStart(7)}s -> ${t.end.toFixed(2).padStart(7)}s  (${(t.end - t.start).toFixed(1)}s) ${t.speaker}` +
      (t.anchor ? `  "${t.anchor}"` : ""),
  );
}

const turns = [];
for (const f of falas) {
  const last = turns[turns.length - 1];
  if (last && last.speaker === f.speaker) last.end = f.end;
  else turns.push({ speaker: f.speaker, start: f.start, end: f.end });
}
for (const t of turns) {
  t.startFrame = frame(t.start);
  t.endFrame = frame(t.end);
}

const falasOut = falas.map(({ tokens, startSec, endSec, ...f }) => ({
  ...f,
  startFrame: frame(f.start),
  endFrame: frame(f.end),
}));

const out = {
  fps: FPS,
  durationSec: videoEnd,
  narrationSec: measured?.durationSec ?? transcript.durationSec,
  durationInFrames: Math.ceil(videoEnd * FPS),
  alignmentRate: matched / n,
  source: "audio+roteiro",
  audio: "fase-2/audio.mp3",
  falas: falasOut,
  turns,
  slides: timeline,
  reveals: [],
};

mkdirSync(dirname(data("timing.json")), { recursive: true });
writeFileSync(data("timing.json"), JSON.stringify(out, null, 2));

const cues = {
  _comment:
    "Fala a fala, com o recorte de audio medido e os slides que entram nela. Edite slide-map.json (ancoras) e rode align de novo.",
  durationSec: out.narrationSec,
  videoSec: out.durationSec,
  falas: falasOut.map((fala) => ({
    id: fala.id,
    speaker: fala.speaker,
    section: fala.section,
    start: fala.start,
    end: fala.end,
    text: fala.text,
    slides: timeline
      .filter((s) => s.falaId === fala.id)
      .map((s) => ({
        slide: s.slide,
        label: s.label,
        start: s.start,
        end: s.end,
        anchor: s.anchor,
      })),
  })),
};
writeFileSync(data("cues.json"), JSON.stringify(cues, null, 2));

console.log(
  `\n${out.durationSec.toFixed(2)}s video / ${out.narrationSec.toFixed(2)}s audio -> src/data/fase-2/timing.json + cues.json`,
);
