// Builds the Fase 3 timeline from the narration: where each fala starts and
// ends, who is speaking, when each scene of the deck cuts in, when each
// data-reveal element enters and when the camera moves on the figures.
//
// The audio is the source of truth. Fase 2 had only pauses and pitch to go on,
// because whisper-tiny gave segment timestamps at best. Fase 3 is transcribed by
// faster-whisper with real per-word times (transcribe.py), so the word timing
// comes from the transcript and the two older signals become checks:
//
//   - pauses (ffmpeg silencedetect) place each handover in the actual gap
//     between voices, where Whisper's word edges can be a couple of tenths off;
//   - pitch confirms the right person is in each fala. It cannot separate the
//     two Vinicius falas, and John and Vinicius are only ~10Hz apart, so it is
//     reported, not trusted to move a cut.
//
// Inputs (src/data/fase-3/): roteiro.json, transcript.json, scene-map.json,
// reveals.json, camera.json, plus the deck HTML for validation.
// Outputs: boundaries.json, timing.json (what Remotion renders) and cues.json
// (the human-readable map, fala by fala).
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import ffmpegPath from "ffmpeg-static";
import { pitchTrack, medianF0 } from "./pitch.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const AUDIO = resolve(here, "../../../fase-3/audio.wav");
const DECK = resolve(here, "../../../fase-3/deck/minha-vez-fase3.html");
// Read by the deck preview (a <script>, because file:// pages cannot fetch JSON).
const STORYBOARD = resolve(here, "../../../fase-3/deck/storyboard.js");
const data = (p) => resolve(here, "../../src/data/fase-3", p);
const read = (p) => JSON.parse(readFileSync(data(p), "utf8"));

const FPS = 30;
/** The closing scene stays up this long after the last word. */
const OUTRO_SEC = 3.5;
/** A reveal lands this much before its word, so it is on screen when the word is. */
const DEFAULT_LEAD = 0.25;
/** A scene cuts in this much before its anchor word, never into the previous word. */
const CUT_LEAD = 0.18;
/** The camera starts moving this much before its word. */
const CAMERA_LEAD = 0.1;
const DEFAULT_MOVE = 1.2;
/** No reveal starts closer than this to the end of its scene. */
const MIN_REVEAL_TAIL = 0.6;

const roteiro = read("roteiro.json");
const transcript = read("transcript.json");
const sceneMap = read("scene-map.json").scenes;
const revealMap = read("reveals.json").reveals;
const cameraMap = read("camera.json").moves;

const frame = (sec) => Math.round(sec * FPS);
const round = (sec) => Number(sec.toFixed(3));
let problems = 0;
const fail = (message) => {
  problems++;
  console.error(`  ERRO ${message}`);
};

// --- deck --------------------------------------------------------------------
const $ = load(readFileSync(DECK, "utf8"));
const deck = new Map();
$("section.scene").each((index, el) => {
  const node = $(el);
  deck.set(node.attr("data-scene"), {
    index,
    kind: node.attr("data-kind"),
    camera: node.find(".fig-stage").attr("data-camera") ?? null,
    reveals: new Set(node.find("[data-reveal]").map((_, r) => $(r).attr("data-reveal")).get()),
    focus: new Set(node.find("[data-focus]").map((_, f) => $(f).attr("data-focus")).get()),
  });
});

console.log("Conferindo o deck contra os mapas...");
const deckOrder = [...deck.keys()];
const mapOrder = sceneMap.map((s) => s.scene);
if (deckOrder.join() !== mapOrder.join()) {
  fail(`scene-map (${mapOrder.join(" ")}) nao segue a ordem do deck (${deckOrder.join(" ")})`);
}
for (const cue of revealMap) {
  if (!deck.get(cue.scene)?.reveals.has(cue.id)) fail(`reveal ${cue.id} nao existe na cena ${cue.scene} do deck`);
}
for (const move of cameraMap) {
  const scene = deck.get(move.scene);
  if (!scene || scene.kind !== "figure") fail(`camera aponta para a cena ${move.scene}, que nao e figura`);
  else if (move.focus !== "tudo" && !scene.focus.has(move.focus)) fail(`foco "${move.focus}" nao existe na cena ${move.scene}`);
}
for (const [id, scene] of deck) {
  const cued = new Set(revealMap.filter((r) => r.scene === id).map((r) => r.id));
  const loose = [...scene.reveals].filter((r) => !cued.has(r));
  if (loose.length) console.warn(`  aviso: cena ${id} tem reveal sem tempo (fica visivel): ${loose.join(", ")}`);
}

// --- words ---------------------------------------------------------------------
// Whisper writes some numbers as digits where the roteiro spells them out, and
// the other way round. Both sides go through the same table before comparing.
const NUMBER_WORDS = { dois: "2", duas: "2", tres: "3", cinco: "5", nove: "9", onze: "11", doze: "12" };
const normalize = (s) => {
  const w = s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9%]+/g, "");
  return NUMBER_WORDS[w] ?? w;
};

const scriptTokens = [];
for (const fala of roteiro) {
  for (const raw of fala.text.split(/\s+/)) {
    const w = normalize(raw);
    if (w) scriptTokens.push({ w, raw, falaId: fala.id });
  }
}
const heard = transcript.words
  .map((x) => ({ w: normalize(x.text), start: x.start, end: x.end }))
  .filter((x) => x.w);

// Global alignment (Needleman-Wunsch): a misheard word costs one mismatch
// instead of throwing everything after it out of step.
const n = scriptTokens.length;
const m = heard.length;
const score = new Int32Array((n + 1) * (m + 1));
const at = (i, j) => i * (m + 1) + j;
for (let i = 1; i <= n; i++) score[at(i, 0)] = -i;
for (let j = 1; j <= m; j++) score[at(0, j)] = -j;
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= m; j++) {
    const same = scriptTokens[i - 1].w === heard[j - 1].w;
    score[at(i, j)] = Math.max(score[at(i - 1, j - 1)] + (same ? 2 : -1), score[at(i - 1, j)] - 1, score[at(i, j - 1)] - 1);
  }
}
for (let i = n, j = m; i > 0 && j > 0; ) {
  const same = scriptTokens[i - 1].w === heard[j - 1].w;
  if (score[at(i, j)] === score[at(i - 1, j - 1)] + (same ? 2 : -1)) {
    if (same) Object.assign(scriptTokens[i - 1], { start: heard[j - 1].start, end: heard[j - 1].end });
    i--;
    j--;
  } else if (score[at(i, j)] === score[at(i - 1, j)] - 1) i--;
  else j--;
}

const matched = scriptTokens.filter((t) => t.start != null).length;
console.log(`\nAlinhamento: ${matched}/${n} palavras do roteiro confirmadas no audio (${((matched / n) * 100).toFixed(1)}%)`);

// Words Whisper heard differently get a time between their confirmed neighbours.
const known = scriptTokens.map((t, k) => (t.start != null ? k : -1)).filter((k) => k >= 0);
for (let k = 0; k < n; k++) {
  if (scriptTokens[k].start != null) continue;
  const prev = known.filter((x) => x < k).pop();
  const next = known.find((x) => x > k);
  const a = prev == null ? scriptTokens[next].start : scriptTokens[prev].end;
  const b = next == null ? scriptTokens[prev].end : scriptTokens[next].start;
  const from = prev ?? k - 1;
  const to = next ?? k + 1;
  scriptTokens[k].start = a + ((b - a) * (k - from)) / (to - from);
  scriptTokens[k].end = scriptTokens[k].start;
  scriptTokens[k].interpolated = true;
}

// --- falas and handovers ---------------------------------------------------------
const silences = (() => {
  const run = spawnSync(
    ffmpegPath,
    ["-hide_banner", "-nostats", "-i", AUDIO, "-af", "silencedetect=noise=-32dB:d=0.12", "-f", "null", "-"],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
  // silencedetect logs to stderr and ffmpeg still exits 0.
  const log = run.stderr ?? "";
  const starts = [...log.matchAll(/silence_start: (-?[\d.]+)/g)].map((x) => Number(x[1]));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((x) => Number(x[1]));
  return starts.map((start, i) => ({ start, end: ends[i] ?? Infinity }));
})();

const narrationSec = transcript.durationSec;
const falas = roteiro.map((f) => {
  const tokens = scriptTokens.filter((t) => t.falaId === f.id);
  return { ...f, tokens, speechStart: tokens[0].start, speechEnd: tokens[tokens.length - 1].end };
});

console.log("\nTrocas de fala (palavra do Whisper vs. silencio medido):");
for (let k = 0; k < falas.length - 1; k++) {
  const prev = falas[k];
  const next = falas[k + 1];
  // The silence between the last word of one fala and the first of the next.
  const gap = silences
    .filter((s) => s.end > prev.speechEnd - 0.3 && s.start < next.speechStart + 0.3)
    .sort((a, b) => b.end - b.start - (a.end - a.start))[0];
  const cut = gap ? Math.min(gap.end, next.speechStart + 0.15) : next.speechStart;
  prev.end = cut;
  next.start = cut;
  console.log(
    `  ${prev.id}->${next.id} ${prev.speaker.padEnd(8)}->${next.speaker.padEnd(8)}` +
      ` ultima palavra ${prev.speechEnd.toFixed(2)}s, primeira ${next.speechStart.toFixed(2)}s,` +
      (gap ? ` silencio ${gap.start.toFixed(2)}-${gap.end.toFixed(2)}s` : " sem silencio medido") +
      `  -> corte em ${cut.toFixed(2)}s`,
  );
}
falas[0].start = 0;
falas[falas.length - 1].end = narrationSec;

// --- voice check -------------------------------------------------------------------
console.log("\nConferencia de voz (F0 mediano de cada fala):");
const track = pitchTrack(AUDIO);
const f0 = new Map(falas.map((f) => [f.id, medianF0(track, f.speechStart, f.speechEnd)]));
const voices = new Map();
for (const f of falas) {
  if (!voices.has(f.speaker)) voices.set(f.speaker, []);
  if (f0.get(f.id) != null) voices.get(f.speaker).push(f0.get(f.id));
}
const voiceOf = new Map([...voices].map(([s, v]) => [s, v.sort((a, b) => a - b)[Math.floor(v.length / 2)]]));
for (const f of falas) {
  const own = voiceOf.get(f.speaker);
  const measured = f0.get(f.id);
  const words = f.tokens.length;
  const wpm = (words / (f.speechEnd - f.speechStart)) * 60;
  // Flag only a fala whose pitch sits nearer someone else's voice by a margin.
  const closer = [...voiceOf].find(([s, v]) => s !== f.speaker && Math.abs(measured - v) + 8 < Math.abs(measured - own));
  console.log(
    `  ${f.id} ${f.speaker.padEnd(9)} ${f.start.toFixed(2).padStart(7)}s -> ${f.end.toFixed(2).padStart(7)}s` +
      `  ${words} palavras, ${wpm.toFixed(0)} pal/min  F0 ${measured?.toFixed(0) ?? "--"}Hz (voz ${own?.toFixed(0)}Hz)` +
      (closer ? `  <- PARECE ${closer[0].toUpperCase()}` : ""),
  );
}

// --- anchors -------------------------------------------------------------------------
const falaById = new Map(falas.map((f) => [f.id, f]));
/** Start of the first word of `anchor` inside `fala`, at or after `notBefore`. */
const anchorAt = (fala, anchor, notBefore = -Infinity) => {
  const needle = anchor.split(/\s+/).map(normalize).filter(Boolean);
  for (let k = 0; k + needle.length <= fala.tokens.length; k++) {
    if (fala.tokens[k].start < notBefore - 0.05) continue;
    if (needle.every((w, o) => fala.tokens[k + o].w === w)) return { k, token: fala.tokens[k] };
  }
  return null;
};

// --- scenes ----------------------------------------------------------------------------
const videoSec = narrationSec + OUTRO_SEC;
const scenes = sceneMap.map((entry) => {
  const fala = falaById.get(entry.fala);
  if (!fala) fail(`cena ${entry.scene} aponta para a fala inexistente ${entry.fala}`);
  let start = fala.start;
  if (entry.anchor) {
    const hit = anchorAt(fala, entry.anchor);
    if (!hit) fail(`ancora da cena ${entry.scene} nao encontrada em ${fala.id}: "${entry.anchor}"`);
    else {
      const previousEnd = hit.k > 0 ? fala.tokens[hit.k - 1].end : fala.start;
      start = Math.max(previousEnd, hit.token.start - CUT_LEAD);
    }
  }
  return { scene: entry.scene, label: entry.label, falaId: fala.id, speaker: fala.speaker, anchor: entry.anchor ?? null, start };
});
scenes[0].start = 0;
scenes.forEach((s, i) => {
  s.end = i + 1 < scenes.length ? scenes[i + 1].start : videoSec;
  if (s.end - s.start < 2) fail(`cena ${s.scene} dura so ${(s.end - s.start).toFixed(2)}s`);
});

// --- reveals ---------------------------------------------------------------------------
const reveals = [];
const lastInScene = new Map();
for (const cue of revealMap) {
  const scene = scenes.find((s) => s.scene === cue.scene);
  const fala = falaById.get(scene.falaId);
  let start;
  let source;
  if (cue.anchor) {
    const hit = anchorAt(fala, cue.anchor, scene.start);
    if (!hit) {
      fail(`ancora de ${cue.id} nao encontrada na cena ${cue.scene}: "${cue.anchor}"`);
      continue;
    }
    start = hit.token.start - (cue.lead ?? DEFAULT_LEAD);
    source = `"${cue.anchor}"`;
  } else {
    start = (lastInScene.get(cue.scene) ?? scene.start) + (cue.offsetSec ?? 0.4);
    source = `+${cue.offsetSec ?? 0.4}s`;
  }
  const clamped = Math.min(Math.max(start, scene.start), scene.end - MIN_REVEAL_TAIL);
  if (Math.abs(clamped - start) > 0.3) console.warn(`  [AJUSTADO] ${cue.id}: ${start.toFixed(2)}s -> ${clamped.toFixed(2)}s (fora da janela da cena ${cue.scene})`);
  lastInScene.set(cue.scene, clamped);
  reveals.push({ id: cue.id, scene: cue.scene, start: round(clamped), startFrame: frame(clamped), source, clamped: Math.abs(clamped - start) > 0.3 });
}

// --- camera ----------------------------------------------------------------------------
const camera = [];
for (const move of cameraMap) {
  const scene = scenes.find((s) => s.scene === move.scene);
  const fala = falaById.get(scene.falaId);
  const hit = anchorAt(fala, move.anchor, scene.start);
  if (!hit) {
    fail(`ancora da camera (${move.scene} -> ${move.focus}) nao encontrada: "${move.anchor}"`);
    continue;
  }
  const start = Math.max(scene.start, hit.token.start - CAMERA_LEAD);
  const moveSec = move.moveSec ?? DEFAULT_MOVE;
  camera.push({ scene: move.scene, focus: move.focus, start: round(start), startFrame: frame(start), durationInFrames: frame(moveSec), anchor: move.anchor });
}

// --- speaker turns ---------------------------------------------------------------------
const turns = [];
for (const f of falas) {
  const last = turns[turns.length - 1];
  if (last && last.speaker === f.speaker) last.end = f.end;
  else turns.push({ speaker: f.speaker, start: f.start, end: f.end });
}

// --- report ----------------------------------------------------------------------------
console.log("\nCenas:");
for (const s of scenes) {
  const n = reveals.filter((r) => r.scene === s.scene).length;
  const c = camera.filter((x) => x.scene === s.scene).length;
  console.log(
    `  ${s.scene} ${s.label.padEnd(16)} ${s.start.toFixed(2).padStart(7)}s -> ${s.end.toFixed(2).padStart(7)}s` +
      ` (${(s.end - s.start).toFixed(1).padStart(4)}s) ${s.speaker.padEnd(8)} ${String(n).padStart(2)} reveals` +
      (c ? `, ${c} camera` : "") +
      (s.anchor ? `  "${s.anchor}"` : ""),
  );
}

if (problems) {
  console.error(`\n${problems} problema(s). Nada foi gravado.`);
  process.exit(1);
}

// --- outputs -----------------------------------------------------------------------------
const withFrames = (x) => ({ ...x, start: round(x.start), end: round(x.end), startFrame: frame(x.start), endFrame: frame(x.end) });
const falasOut = falas.map(({ tokens, ...f }) =>
  withFrames({ ...f, speechStart: round(f.speechStart), speechEnd: round(f.speechEnd) }),
);
const scenesOut = scenes.map((s) => ({
  ...withFrames(s),
  durationInFrames: frame(s.end) - frame(s.start),
  kind: deck.get(s.scene).kind,
  camera: deck.get(s.scene).camera,
}));
/**
 * What is said while a scene is on screen, in roteiro spelling. Limited to the
 * scene's own fala: Whisper puts a first word a few tenths before the measured
 * voice onset, which would hand it to the previous scene.
 */
const spokenDuring = (s) => {
  const opensFala = s.start === falaById.get(s.falaId).start;
  return scriptTokens
    .filter((t) => t.falaId === s.falaId && t.start >= s.start - (opensFala ? 0.3 : 0.05) && t.start < s.end - 0.05)
    .map((t) => t.raw)
    .join(" ");
};

writeFileSync(
  data("boundaries.json"),
  JSON.stringify(
    {
      detector: "faster-whisper (palavras) + silencedetect -32dB 0.12s + F0",
      durationSec: narrationSec,
      voices: Object.fromEntries([...voiceOf].map(([s, v]) => [s, Number(v.toFixed(1))])),
      falas: falasOut.map(({ id, speaker, start, end, speechStart, speechEnd }) => ({ id, speaker, start, end, speechStart, speechEnd })),
    },
    null,
    2,
  ) + "\n",
);

const timing = {
  fps: FPS,
  durationSec: round(videoSec),
  narrationSec,
  durationInFrames: Math.ceil(videoSec * FPS),
  alignmentRate: Number((matched / n).toFixed(4)),
  source: "audio+roteiro",
  audio: "fase-3/mix.wav",
  falas: falasOut,
  turns: turns.map(withFrames),
  scenes: scenesOut,
  reveals,
  camera,
};
writeFileSync(data("timing.json"), JSON.stringify(timing, null, 2) + "\n");

const cues = {
  _comment:
    "Mapa para conferir: fala a fala, quem fala, o recorte medido no audio e o que entra na tela. Gerado por scripts/fase-3/align.mjs; edite scene-map.json, reveals.json ou camera.json e rode de novo.",
  narrationSec,
  videoSec: round(videoSec),
  falas: falasOut.map((f) => ({
    id: f.id,
    speaker: f.speaker,
    section: f.section,
    start: f.start,
    end: f.end,
    text: f.text,
    scenes: scenesOut
      .filter((s) => s.falaId === f.id)
      .map((s) => ({
        scene: s.scene,
        label: s.label,
        kind: s.kind,
        start: s.start,
        end: s.end,
        anchor: s.anchor,
        spoken: spokenDuring(s),
        reveals: reveals.filter((r) => r.scene === s.scene).map(({ id, start, source }) => ({ id, start, at: source })),
        camera: camera.filter((c) => c.scene === s.scene).map(({ focus, start, anchor }) => ({ focus, start, at: `"${anchor}"` })),
      })),
  })),
};
writeFileSync(data("cues.json"), JSON.stringify(cues, null, 2) + "\n");

const storyboard = {
  videoSec: round(videoSec),
  alignmentRate: timing.alignmentRate,
  scenes: scenesOut.map((s) => ({
    scene: s.scene,
    start: s.start,
    end: s.end,
    speaker: s.speaker,
    spoken: spokenDuring(s),
    reveals: reveals.filter((r) => r.scene === s.scene).map(({ id, start }) => ({ id, start })),
    camera: camera.filter((c) => c.scene === s.scene).map(({ focus, start }) => ({ focus, start })),
  })),
};
writeFileSync(
  STORYBOARD,
  "// Gerado por sources/video/remotion/scripts/fase-3/align.mjs. Nao editar a mao.\n" +
    `window.STORYBOARD = ${JSON.stringify(storyboard, null, 1)};\n`,
);

console.log(
  `\n${videoSec.toFixed(2)}s de video (${narrationSec.toFixed(2)}s de narracao + ${OUTRO_SEC}s) -> src/data/fase-3/{timing,cues,boundaries}.json`,
);
