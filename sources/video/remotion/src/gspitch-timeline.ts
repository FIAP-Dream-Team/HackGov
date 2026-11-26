import rawTiming from "./data/gs-pitch/timing.json";
import rawDeck from "./data/gs-pitch/deck.json";
import type { SpeakerId } from "./data/speakers";
import type { Fase3Deck, Fase3Timing } from "./fase3-timeline";

// Same shapes as Fase 3 / EC-1 (scripts/gs-pitch are copies of scripts/ec-1), with one turn per
// change of voice: five people narrate the pitch.
export type GsTurn = { speaker: SpeakerId; start: number; end: number; startFrame: number; endFrame: number };
/** align.mjs copies, from audio/pitch/falas.json, where a fala sits in the narration (placedAt) and the
 *  second of its source file that sits there (sourceIn): a take with its own sound plays in sync from it. */
export type GsFala = { id: string; speaker: SpeakerId; start: number; end: number; placedAt?: number; sourceIn?: number };
export type GsReveal = Fase3Timing["reveals"][number] & { anim: string; durationInFrames: number };
export type GsPitchTiming = Omit<Fase3Timing, "turns" | "reveals"> & { turns: GsTurn[]; falas: GsFala[]; reveals: GsReveal[] };

export const gsPitchTiming = rawTiming as unknown as GsPitchTiming;
export const gsPitchDeck = rawDeck as unknown as Fase3Deck;
