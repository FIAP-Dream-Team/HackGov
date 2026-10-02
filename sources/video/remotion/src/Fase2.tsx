import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";

import { fase2Timing as timing } from "./fase2-timeline";
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

      <MusicBed />
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

/**
 * Same track as Cap 1, at a flat low level. Per-speaker ducking waits for the
 * real narration file — music-bed.mjs needs measured voice levels.
 */
const MusicBed: React.FC = () => {
  const duration = timing.durationInFrames;
  const seam = 3240;
  const level = 0.1;

  const volume = (frame: number, origin: number) => {
    const absolute = origin + frame;
    const fadeIn = interpolate(absolute, [0, 45], [0, level], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(absolute, [duration - 90, duration], [level, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.min(fadeIn, fadeOut);
  };

  return (
    <>
      <Audio src={staticFile("musica.mp3")} volume={(frame) => volume(frame, 0)} name="Trilha (1a passada)" />
      <Sequence from={seam} name="Trilha (2a passada)" layout="none">
        <Audio src={staticFile("musica.mp3")} volume={(frame) => volume(frame, seam)} />
      </Sequence>
    </>
  );
};
