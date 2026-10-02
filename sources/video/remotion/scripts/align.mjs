// Aligns the known roteiro text against the Whisper word timestamps, then turns
// that into the slide timeline the composition renders. Whisper transcribes
// imperfectly, so this runs a global Needleman-Wunsch alignment between the two
// word streams instead of trusting the transcript verbatim.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => JSON.parse(readFileSync(resolve(here, p), "utf8"));

const FPS = 30;
// The narration ends on "Muito obrigado", which would leave the closing slide on
// screen for under a second. The video runs past the audio so it can land.
const OUTRO_SEC = 4.5;
const roteiro = read("../src/data/roteiro.json");
// TRANSCRIPT lets a dry run point at a stand-in file without touching the real
// one, so the timeline logic can be exercised before Whisper finishes.
const transcript = read(process.env.TRANSCRIPT ?? "../src/data/transcript.json");
const slideMap = read("../src/data/slide-map.json").slides;
const revealMap = read("../src/data/reveals.json").reveals;
const deck = read("../src/data/slides.json");

/** Elements enter slightly before the word lands, so they are already there. */
const DEFAULT_LEAD = 0.35;
/** Fallback spacing for reveals the narration does not call out one by one. */
const DEFAULT_OFFSET = 0.5;

// Staging an element in when it is mentioned is only worth it if the viewer
// still has time to read it. Reading short on-screen text runs around four words
// a second, plus a moment to find each new block. When the staging would hold
// content back past the point where it can be read, the slide shows everything
// at once instead — a slide nobody can finish reading is worse than a slide
// without choreography.
const WORDS_PER_SECOND = 4;
const SECONDS_PER_BLOCK = 0.5;
const readingTime = (words) => words / WORDS_PER_SECOND + SECONDS_PER_BLOCK;

const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9%]+/g, "");

// --- token streams -----------------------------------------------------------
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

// --- Needleman-Wunsch --------------------------------------------------------
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
      score[at(i - 1, j - 1)] +
      (scriptTokens[i - 1].w === heardTokens[j - 1].w ? MATCH : MISMATCH);
    const del = score[at(i - 1, j)] + GAP;
    const ins = score[at(i, j - 1)] + GAP;
    score[at(i, j)] = Math.max(sub, del, ins);
  }
}

// Traceback: attach a heard timestamp to every script token we could match.
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

// Fill gaps by linear interpolation so every token ends up with a usable time.
const known = scriptTokens.map((t, k) => (t.start != null ? k : -1)).filter((k) => k >= 0);
if (known.length < 2) {
  throw new Error(
    "Alinhamento fraco demais. Refaca a transcricao com WHISPER_MODEL=onnx-community/whisper-medium",
  );
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

// --- fala boundaries ---------------------------------------------------------
const falas = roteiro.map((f) => {
  const toks = scriptTokens.filter((t) => t.falaId === f.id);
  return { ...f, start: toks[0].start, end: toks[toks.length - 1].end, tokens: toks };
});

// Keep boundaries monotonic; the silence between falas belongs to the earlier one.
for (let k = 0; k < falas.length - 1; k++) {
  if (falas[k].end > falas[k + 1].start) falas[k].end = falas[k + 1].start;
}

// Boundaries measured from the audio beat boundaries inferred from a transcript.
// scripts/detect-pauses.mjs locates the pauses with ffmpeg and confirms who is on
// each side by pitch; a small Whisper model does neither, and whisper-tiny puts
// the handover to Vinicius half a second before Larissa stops talking. So the
// transcript decides where words fall *inside* a fala, and the measurement
// decides where the fala ends.
let measured = null;
try {
  measured = read("../src/data/boundaries.json");
} catch {
  console.warn(
    "\n  ! src/data/boundaries.json nao existe. Rode 'npm run pauses' — sem ele as divisas" +
      " saem da transcricao, que erra mais.",
  );
}

if (measured) {
  console.log("\nDivisas medidas (substituem as da transcricao):");
  for (const [index, fala] of falas.entries()) {
    const source = measured.falas.find((f) => f.id === fala.id);
    if (!source) continue;
    const drift = Math.max(Math.abs(source.start - fala.start), Math.abs(source.end - fala.end));
    console.log(
      `  ${fala.id} ${fala.speaker.padEnd(9)} ${source.start.toFixed(2).padStart(7)}s ->` +
        ` ${source.end.toFixed(2).padStart(7)}s   transcricao dizia` +
        ` ${fala.start.toFixed(2)}s -> ${fala.end.toFixed(2)}s (${drift.toFixed(2)}s de diferenca)`,
    );
    fala.start = source.start;
    fala.end = source.end;
  }
}

falas[0].start = 0;
falas[falas.length - 1].end = measured ? measured.durationSec : transcript.durationSec;

// The word times came from the transcript and no longer line up with the
// measured edges. Stretch each fala's words back into its real span, keeping
// their relative spacing — that spacing is what the transcript is good at.
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

// --- anchors -----------------------------------------------------------------
function anchorTime(fala, anchor) {
  const needle = anchor.split(/\s+/).map(normalize).filter(Boolean);
  for (let k = 0; k + needle.length <= fala.tokens.length; k++) {
    if (needle.every((w, o) => fala.tokens[k + o].w === w)) return fala.tokens[k].start;
  }
  console.warn(`  ! anchor nao encontrado em ${fala.id}: "${anchor}" -- usando o inicio da fala`);
  return null;
}

// --- slide timeline ----------------------------------------------------------
const byFala = new Map();
for (const entry of slideMap) {
  if (!byFala.has(entry.fala)) byFala.set(entry.fala, []);
  byFala.get(entry.fala).push(entry);
}

const timeline = [];
for (const fala of falas) {
  const entries = byFala.get(fala.id) ?? [];
  if (!entries.length) continue;

  // Fixed points first: explicit anchors, plus the fala start for entry 0.
  const starts = entries.map((e, idx) => {
    if (e.anchor) return anchorTime(fala, e.anchor);
    return idx === 0 ? fala.start : null;
  });

  // Free slides take their slot by splitting the interval up to the next fixed
  // point, weighted by `share`.
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
    });
  });
}

// From the measured narration, not the transcript: the transcript can be built
// from a stale decode, and the video length must follow the audio that actually
// plays.
const videoEnd = falas[falas.length - 1].end + OUTRO_SEC;

timeline.sort((a, b) => a.start - b.start);
timeline.forEach((t, idx) => {
  t.end = idx + 1 < timeline.length ? timeline[idx + 1].start : videoEnd;
  t.startFrame = Math.round(t.start * FPS);
  t.endFrame = Math.round(t.end * FPS);
  t.durationInFrames = Math.max(1, t.endFrame - t.startFrame);
  t.deckIndex = deck.slides.findIndex((s) => s.screenLabel === t.slide);
});

console.log("\nTimeline (n. no video <- slide do deck):");
timeline.forEach((t, index) => {
  const shown = String(index + 1).padStart(2, "0");
  console.log(
    `  ${shown} <- ${t.slide}  ${t.label.padEnd(20)} ${t.start.toFixed(2).padStart(7)}s ->` +
      ` ${t.end.toFixed(2).padStart(7)}s  (${(t.end - t.start).toFixed(1).padStart(5)}s) ${t.speaker}`,
  );
});

// --- element reveals ---------------------------------------------------------
// Individual pieces of a slide enter on the word that mentions them. A reveal
// that cannot be resolved falls back to the start of its slide: an element is
// allowed to appear early, never to stay invisible.
const falaById = new Map(falas.map((f) => [f.id, f]));
const cueBySlide = new Map(timeline.map((t) => [t.slide, t]));
const reveals = [];
const lastBySlide = new Map();

for (const entry of revealMap) {
  const cue = cueBySlide.get(entry.slide);
  const fala = falaById.get(entry.fala);
  if (!cue || !fala) {
    console.warn(`  ! reveal ${entry.id}: slide ${entry.slide} ou fala ${entry.fala} nao existe`);
    continue;
  }

  let when;
  let how;
  if (entry.anchor) {
    const found = anchorTime(fala, entry.anchor);
    if (found == null) {
      when = cue.start;
      how = "anchor nao encontrado";
    } else {
      when = found - (entry.lead ?? DEFAULT_LEAD);
      how = `"${entry.anchor}"`;
    }
  } else {
    const previous = lastBySlide.get(entry.slide);
    when = (previous ?? cue.start) + (entry.offsetSec ?? DEFAULT_OFFSET);
    how = `+${(entry.offsetSec ?? DEFAULT_OFFSET).toFixed(2)}s`;
  }

  // Never before the slide is up, never so late it lands on the cut.
  const floor = cue.start + 0.2;
  const ceiling = Math.max(floor, cue.end - 0.6);
  const clamped = Math.min(Math.max(when, floor), ceiling);
  const wasClamped = Math.abs(clamped - when) > 0.05;

  lastBySlide.set(entry.slide, clamped);
  reveals.push({
    id: entry.id,
    slide: entry.slide,
    start: clamped,
    startFrame: Math.round(clamped * FPS),
    source: how,
    clamped: wasClamped,
  });
}

// --- can the viewer keep up? -------------------------------------------------
// Per slide: how long the held-back content takes to read, against how long it
// is actually on screen once staged.
const modes = read("../src/data/reveals.json").modes ?? {};
console.log("\nOrcamento de leitura por slide:");

for (const [slide, cue] of cueBySlide) {
  const own = reveals.filter((r) => r.slide === slide);
  if (!own.length) continue;

  const section = deck.slides.find((s) => s.screenLabel === slide);
  const wordsById = new Map((section?.reveals ?? []).map((r) => [r.id, r.words]));
  const needed = own.reduce((sum, r) => sum + readingTime(wordsById.get(r.id) ?? 0), 0);
  const firstCue = Math.min(...own.map((r) => r.start));
  const available = cue.end - firstCue;

  const forced = modes[slide];
  const staged = forced ? forced === "staged" : needed <= available;

  console.log(
    `  ${slide} ${cue.label.padEnd(20)} ler ${needed.toFixed(1)}s / disponivel ${available.toFixed(1)}s` +
      `  -> ${staged ? "encena" : "mostra tudo de uma vez"}${forced ? "  (forcado em reveals.json)" : ""}`,
  );

  if (!staged) {
    // Everything appears with the slide, which buys back the whole duration.
    for (const r of own) {
      r.start = cue.start + 0.2;
      r.startFrame = Math.round(r.start * FPS);
      r.source = "slide curto demais para encenar";
    }
  }
}

console.log("\nReveals:");
for (const r of reveals) {
  const cue = cueBySlide.get(r.slide);
  console.log(
    `  ${r.slide} ${r.id.padEnd(20)} ${r.start.toFixed(2).padStart(7)}s` +
      ` (+${(r.start - cue.start).toFixed(1)}s no slide)  ${r.source}${r.clamped ? "  [AJUSTADO ao limite do slide]" : ""}`,
  );
}

// Every tagged element must have a cue, or it would never become visible.
const tagged = deck.slides.flatMap((s) =>
  [...(s.html.matchAll(/data-reveal="([^"]+)"/g) ?? [])].map((m) => m[1]),
);
const missing = tagged.filter((id) => !reveals.some((r) => r.id === id));
if (missing.length) {
  throw new Error(
    `Elementos marcados sem reveal correspondente (ficariam invisiveis): ${missing.join(", ")}`,
  );
}

// Speaker turns drive the lower-third card.
const turns = [];
for (const f of falas) {
  const last = turns[turns.length - 1];
  if (last && last.speaker === f.speaker) last.end = f.end;
  else turns.push({ speaker: f.speaker, start: f.start, end: f.end });
}
for (const t of turns) {
  t.startFrame = Math.round(t.start * FPS);
  t.endFrame = Math.round(t.end * FPS);
}

const out = {
  fps: FPS,
  durationSec: videoEnd,
  narrationSec: transcript.durationSec,
  durationInFrames: Math.ceil(videoEnd * FPS),
  alignmentRate: matched / n,
  falas: falas.map(({ tokens, ...f }) => ({
    ...f,
    startFrame: Math.round(f.start * FPS),
    endFrame: Math.round(f.end * FPS),
  })),
  turns,
  slides: timeline,
  reveals,
};

writeFileSync(resolve(here, "../src/data/timing.json"), JSON.stringify(out, null, 2));
console.log(
  `\nTotal ${out.durationSec.toFixed(2)}s = ${out.durationInFrames} frames @ ${FPS}fps -> src/data/timing.json`,
);
