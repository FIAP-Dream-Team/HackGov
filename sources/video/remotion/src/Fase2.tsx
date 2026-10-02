import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";

import { fase2Timing as timing, fase2Music as music } from "./fase2-timeline";
import { PdfSlide } from "./components/PdfSlide";
import { SpeakerCard, CARD_HOLD } from "./components/SpeakerCard";
import { COLORS, SLIDE_FADE } from "./theme";

loadBricolage();
loadFigtree();

const CARD_BLOCKED = new Set(["12"]);
const MIN_CARD_FRAMES = 45;
const MAX_CARD_DELAY = 75;

const cardWindow = (turn: { startFrame: number; endFrame: number }) => {
  let start = turn.startFrame;
  for (const cue of timing.slides) {
    if (!CARD_BLOCKED.has(cue.slide)) continue;
    if (start >= cue.startFrame && start < cue.endFrame) start = cue.endFrame;
  }
  if (start - turn.startFrame > MAX_CARD_DELAY) return null;
  const duration = Math.min(CARD_HOLD, turn.endFrame - start);
  return duration >= MIN_CARD_FRAMES ? { start, duration } : null;
};

export const Fase2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      {timing.slides.map((entry, index) => {
        // Fade in on the incoming speaker's time, never by starting the next
        // slide while the previous person is still talking.
        const fade = index === 0 ? 0 : SLIDE_FADE;
        const from = entry.startFrame;
        const tail = index < timing.slides.length - 1 ? fade : 0;
        const durationInFrames = Math.max(1, entry.endFrame + tail - from);

        return (
          <Sequence
            key={`${entry.slide}-${entry.falaId}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`${entry.slide} ${entry.label}`}
            layout="none"
          >
            <CrossFade fade={fade}>
              <PdfSlide file={entry.file} />
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

      <Audio src={staticFile(timing.audio)} />

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
  const opacity =
    fade === 0
      ? 1
      : interpolate(frame, [0, fade], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
