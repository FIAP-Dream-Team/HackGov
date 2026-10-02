import rawTiming from "./data/fase-2/timing.json";
import type { SpeakerId } from "./data/speakers";
import type { RevealCue, SpeakerTurn } from "./timeline";

export type Fase2SlideCue = {
  slide: string;
  label: string;
  falaId: string;
  speaker: SpeakerId;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
  /** Path under public/, e.g. fase-2/01.jpg */
  file: string;
  deckIndex: number;
};

export type Fase2Timing = {
  fps: number;
  durationSec: number;
  narrationSec: number;
  durationInFrames: number;
  alignmentRate: number;
  source: string;
  turns: SpeakerTurn[];
  slides: Fase2SlideCue[];
  reveals: RevealCue[];
};

export const fase2Timing = rawTiming as Fase2Timing;
