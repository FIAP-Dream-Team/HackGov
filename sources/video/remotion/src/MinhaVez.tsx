import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";

import { deck, music, timing } from "./timeline";
import { Slide } from "./components/Slide";
import { SpeakerCard, CARD_HOLD } from "./components/SpeakerCard";
import { TeamStrip } from "./components/TeamStrip";
import { COLORS, SLIDE_FADE } from "./theme";

// The deck names these families directly in its inline styles, so they have to
// be registered under the exact same names.
loadBricolage();
loadFigtree();

/** Slides that carry the team faces instead of the deck name footer. */
const TEAM_SLIDES = new Set(["01", "14"]);

/**
 * Slides the card cannot sit on, by deck label. The team ones already name every
 * face; "06" is Telas do MVP, the one deck slide with content in the top right.
 */
const CARD_BLOCKED = new Set([...TEAM_SLIDES, "06"]);

/** A speaker card shorter than this is a flash, not a label. */
const MIN_CARD_FRAMES = 45;

/**
 * How late a card may be and still mean anything. Past this the card stops
 * announcing who is talking and starts confusing: Larissa's card was landing
 * sixteen seconds into her turn, because the rule pushed it forward until it
 * found a slide with room instead of giving up.
 */
const MAX_CARD_DELAY = 75;

/**
 * Places the speaker card for one turn. A card that cannot appear on time does
 * not appear at all.
 */
const cardWindow = (turn: { startFrame: number; endFrame: number }) => {
  let start = turn.startFrame;

  // Cues are in playback order, so one pass walks the card forward through any
  // run of blocked slides.
  for (const cue of timing.slides) {
    if (!CARD_BLOCKED.has(cue.slide)) continue;
    if (start >= cue.startFrame && start < cue.endFrame) start = cue.endFrame;
  }

  if (start - turn.startFrame > MAX_CARD_DELAY) return null;

  const duration = Math.min(CARD_HOLD, turn.endFrame - start);
  return duration >= MIN_CARD_FRAMES ? { start, duration } : null;
};

export const MinhaVez: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.greenInk }}>
      <style dangerouslySetInnerHTML={{ __html: deck.globalCss }} />

      {timing.slides.map((entry, index) => {
        const section = deck.slides[entry.deckIndex];
        // Every slide but the first starts a touch early and fades in over the
        // one below it, so the cut never lands as a hard flash.
        const fade = index === 0 ? 0 : SLIDE_FADE;
        const from = Math.max(0, entry.startFrame - fade);
        const durationInFrames = Math.max(1, entry.endFrame - from);

        return (
          <Sequence
            key={`${entry.slide}-${entry.falaId}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`${entry.slide} ${entry.label}`}
            layout="none"
          >
            <CrossFade fade={fade}>
              <Slide
                sectionStyle={section.style}
                html={section.html}
                // The faces replace the deck name footer rather than stacking
                // on top of it.
                hideChildren={TEAM_SLIDES.has(entry.slide) ? [-1] : undefined}
                // Reveal frames are absolute; the slide only knows its own clock.
                reveals={timing.reveals
                  .filter((r) => r.slide === entry.slide)
                  .map((r) => ({ id: r.id, frame: r.startFrame - from }))}
              />
              {TEAM_SLIDES.has(entry.slide) ? (
                <TeamStrip tone={entry.slide === "01" ? "onGreen" : "onDark"} />
              ) : null}
            </CrossFade>
          </Sequence>
        );
      })}

      {timing.turns.map((turn) => {
        const window = cardWindow(turn);
        if (!window) return null;

        return (
          <Sequence
            key={turn.startFrame}
            from={window.start}
            durationInFrames={window.duration}
            name={`Locutor ${turn.speaker}`}
            layout="none"
          >
            <SpeakerCard speaker={turn.speaker} durationInFrames={window.duration} />
          </Sequence>
        );
      })}

      {/*
        public/audio.mp3 is not the file the group delivered: that one is cut off
        mid-word at the end. scripts/repair-narration.mjs rebuilds it, splicing
        the "Muito obrigado!" back in from joao2.mp4.
      */}
      <Audio src={staticFile("audio.mp3")} />

      {/*
        The music bed. Its level is automated per frame by scripts/music-bed.mjs
        so it stays a fixed distance under whoever is talking — the five of them
        are 8.9dB apart, so one fixed volume would bury Joao Pedro or be pointless
        under Vinicius. The track is shorter than the video, so it plays twice,
        crossfading at `seamFrame` and positioned so its own closing fade lands
        on the final slide.
      */}
      <Audio
        src={staticFile(music.file)}
        volume={(frame) => music.first[frame] ?? 0}
        name="Trilha (1a passada)"
      />
      <Sequence from={music.seamFrame} name="Trilha (2a passada)" layout="none">
        <Audio
          src={staticFile(music.file)}
          trimBefore={music.secondPassTrimFrames}
          volume={(frame) => music.second[frame] ?? 0}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const CrossFade: React.FC<{ fade: number; children: React.ReactNode }> = ({ fade, children }) => {
  const frame = useCurrentFrame();
  const opacity = fade === 0 ? 1 : interpolate(frame, [0, fade], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
