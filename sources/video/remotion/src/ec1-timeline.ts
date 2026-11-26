import rawTiming from "./data/ec-1/timing.json";
import rawDeck from "./data/ec-1/deck.json";
import type { Fase3Deck, Fase3Timing } from "./fase3-timeline";

// Same shapes as Fase 3 (scripts/ec-1 are copies of scripts/fase-3), except that
// the audio can be missing: before the narration is recorded, align.mjs times
// the deck from an estimated transcript and the video renders silent.
export type EC1Timing = Omit<Fase3Timing, "audio"> & { audio: string | null; draft: boolean };

export const ec1Timing = rawTiming as unknown as EC1Timing;
export const ec1Deck = rawDeck as unknown as Fase3Deck;
