import rawTiming from "./data/fase-3/timing.json";
import rawDeck from "./data/fase-3/deck.json";
import rawMusic from "./data/fase-3/music.json";
import type { SpeakerId } from "./data/speakers";
import type { MusicBed, SpeakerTurn } from "./timeline";
import type { FocusRect } from "./fase3-camera";

// Shapes of the files written by scripts/fase-3/align.mjs and extract-deck.mjs,
// declared here so a change in a generator fails the typecheck.

export type Fase3SceneCue = {
  scene: string;
  label: string;
  falaId: string;
  speaker: SpeakerId;
  anchor: string | null;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
  kind: "slide" | "figure";
  camera: string | null;
};

export type Fase3RevealCue = {
  id: string;
  scene: string;
  start: number;
  startFrame: number;
  source: string;
  clamped: boolean;
};

export type Fase3CameraCue = {
  scene: string;
  focus: string;
  start: number;
  startFrame: number;
  durationInFrames: number;
  anchor: string;
};

export type Fase3Timing = {
  fps: number;
  durationSec: number;
  narrationSec: number;
  durationInFrames: number;
  alignmentRate: number;
  audio: string;
  turns: SpeakerTurn[];
  scenes: Fase3SceneCue[];
  reveals: Fase3RevealCue[];
  camera: Fase3CameraCue[];
};

export type DeckFont = { family: string; weight: string; style: string; file: string; unicodeRange: string };

export type DeckScene = {
  scene: string;
  label: string;
  kind: "slide" | "figure";
  tone: "cream" | "dark" | "green";
  camera: string | null;
  canvas: { width: number; height: number } | null;
  focus: Record<string, FocusRect>;
  /** Outer HTML of the deck <section>, rendered as is. */
  html: string;
};

export type Fase3Deck = { globalCss: string; fonts: DeckFont[]; scenes: DeckScene[] };

/** The Fase 2 curves, plus the file they were baked into (public/). */
export type Fase3MusicBed = MusicBed & { bed: string };

export const fase3Timing = rawTiming as unknown as Fase3Timing;
export const fase3Deck = rawDeck as unknown as Fase3Deck;
export const fase3Music = rawMusic as Fase3MusicBed;
