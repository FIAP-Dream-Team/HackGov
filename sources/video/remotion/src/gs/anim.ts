import type React from "react";
import { Easing, interpolate } from "remotion";
import { sec } from "./tokens";

// Entrances of the deck (data-anim): fade, wipe, draw, count, pop, highlight. Every helper takes
// the current frame and the beat in SECONDS (the beats live in tecnico-beats.ts, so the motion is
// re-timed to the recorded narration by editing numbers, not components).

const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 progress of an entrance that starts at `at` seconds and lasts `dur` seconds. */
export const prog = (frame: number, at: number, dur = 0.45) =>
  interpolate(frame, [sec(at), sec(at) + Math.max(1, sec(dur))], [0, 1], { ...CLAMP, easing: EASE });

/** Fade with a short rise (16 px), the default entrance. */
export const fade = (frame: number, at: number, dur = 0.45): React.CSSProperties => {
  const p = prog(frame, at, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * 16}px)` };
};

/** Left-to-right reveal. */
export const wipe = (frame: number, at: number, dur = 0.6): React.CSSProperties => {
  const p = prog(frame, at, dur);
  return { clipPath: `inset(-8px ${(1 - p) * 100}% -8px -8px)` };
};

/** Scale-in for discs and marks. */
export const pop = (frame: number, at: number, dur = 0.4): React.CSSProperties => {
  const p = prog(frame, at, dur);
  const s = interpolate(p, [0, 0.7, 1], [0.6, 1.06, 1]);
  return { opacity: Math.min(1, p * 2), transform: `scale(${s})` };
};

/** Stroke draw for SVG paths: give the path pathLength={1} and spread this on it. */
export const draw = (frame: number, at: number, dur = 0.7) => {
  const p = prog(frame, at, dur);
  return { strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: p > 0 ? 1 : 0 };
};

/** Number counting up from zero. */
export const count = (frame: number, at: number, to: number, dur = 0.9, decimals = 0) => {
  const p = prog(frame, at, dur);
  return (to * p).toFixed(decimals);
};

/** Fade-out at the end of a shot (seconds before the end). */
export const out = (frame: number, total: number, dur = 0.4) =>
  interpolate(frame, [total - sec(dur), total], [1, 0], CLAMP);
