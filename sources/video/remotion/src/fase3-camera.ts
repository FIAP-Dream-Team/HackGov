// Camera for the figure scenes of the Fase 3 deck: which part of an image fills
// the stage at a given frame. Same fitting rule as the deck preview, so what the
// group saw by clicking a figure in the browser is what the video frames.

/** A region of the image, in fractions of its width and height. */
export type FocusRect = { x: number; y: number; w: number; h: number };

/** Where the camera looks: a point of the image (in image pixels) and a zoom. */
type View = { cx: number; cy: number; s: number };

export type CameraMove = {
  focus: string;
  /** Frame, relative to the scene, the move starts on. */
  frame: number;
  durationInFrames: number;
};

type Stage = { width: number; height: number };
type Canvas = { width: number; height: number };

/** Margin left around a focused region, so its edges do not touch the frame. */
const FOCUS_PAD = 0.04;
/** Slow push-in while the camera holds still, so a held figure is not a still. */
const DRIFT = 0.025;
const DRIFT_FRAMES = 240;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Keeps the image covering the stage wherever it is big enough to. */
const clampView = (v: View, stage: Stage, canvas: Canvas): View => {
  const halfW = stage.width / 2 / v.s;
  const halfH = stage.height / 2 / v.s;
  return {
    s: v.s,
    cx: canvas.width * v.s <= stage.width ? canvas.width / 2 : clamp(v.cx, halfW, canvas.width - halfW),
    cy: canvas.height * v.s <= stage.height ? canvas.height / 2 : clamp(v.cy, halfH, canvas.height - halfH),
  };
};

/** The view that frames a named region; "tudo" or an unknown name frames the whole image. */
const viewOf = (focus: string, regions: Record<string, FocusRect>, stage: Stage, canvas: Canvas): View => {
  const r = regions[focus];
  const rect = r
    ? { x: r.x * canvas.width, y: r.y * canvas.height, w: r.w * canvas.width, h: r.h * canvas.height }
    : { x: 0, y: 0, w: canvas.width, h: canvas.height };
  const s = Math.min(stage.width / rect.w, stage.height / rect.h) * (r ? 1 - FOCUS_PAD : 1);
  return clampView({ cx: rect.x + rect.w / 2, cy: rect.y + rect.h / 2, s }, stage, canvas);
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * The camera at `frame`. Between two shots the centre travels in a straight line
 * and the zoom changes geometrically, which reads as one continuous move instead
 * of a zoom and a pan fighting each other.
 */
export const cameraAt = (
  frame: number,
  opening: string,
  moves: CameraMove[],
  regions: Record<string, FocusRect>,
  stage: Stage,
  canvas: Canvas,
): { transform: string; focus: string; since: number } => {
  // A held shot drifts in a little; the next move starts from wherever the
  // drift got to, so there is no jump when the camera sets off again.
  const drifted = (v: View, held: number) =>
    clampView({ ...v, s: v.s * (1 + DRIFT * Math.min(1, Math.max(0, held) / DRIFT_FRAMES)) }, stage, canvas);

  let settled = viewOf(opening, regions, stage, canvas);
  let settledAt = 0;
  let focus = opening;
  let since = 0;
  let view: View | null = null;

  const between = (a: View, b: View, t: number): View => ({
    cx: a.cx + (b.cx - a.cx) * t,
    cy: a.cy + (b.cy - a.cy) * t,
    s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t),
  });

  for (const [i, move] of moves.entries()) {
    if (frame < move.frame) break;
    focus = move.focus;
    since = move.frame;
    const start = drifted(settled, move.frame - settledAt);
    const to = viewOf(move.focus, regions, stage, canvas);
    // A move the next one interrupts hands over from wherever it got to.
    const end = Math.min(move.frame + move.durationInFrames, moves[i + 1]?.frame ?? Infinity);
    const progress = (f: number) => easeInOut(Math.min(1, (f - move.frame) / move.durationInFrames));
    if (frame < end) {
      view = between(start, to, progress(frame));
      break;
    }
    settled = between(start, to, progress(end));
    settledAt = end;
  }

  const v = view ?? drifted(settled, frame - settledAt);
  const tx = stage.width / 2 - v.cx * v.s;
  const ty = stage.height / 2 - v.cy * v.s;
  return { transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${v.s.toFixed(5)})`, focus, since };
};
