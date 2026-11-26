import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { photoSrc, SPEAKERS, type SpeakerId } from "../data/speakers";

/** How long the tag stays up after a speaker takes over, in frames. */
export const TAG_HOLD = 135;
const TAG_IN = 14;
const TAG_OUT = 12;

type SpeakerTagProps = {
  speaker: SpeakerId;
  durationInFrames: number;
  /** On the dark scenes the ink block needs an edge to separate from the background. */
  onDark?: boolean;
};

/**
 * Who is narrating, for the Fase 3 video. Same system as the deck: IBM Plex,
 * a flat ink block with the deck's single 6px radius, no shadow, sitting on the
 * deck's right margin (128px) in the corner every scene leaves free.
 */
export const SpeakerTag: React.FC<SpeakerTagProps> = ({ speaker, durationInFrames, onDark = false }) => {
  const frame = useCurrentFrame();
  const person = SPEAKERS[speaker];
  const src = photoSrc(person);

  const enter = interpolate(frame, [0, TAG_IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leave = interpolate(frame, [durationInFrames - TAG_OUT, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const presence = Math.min(1 - (1 - enter) ** 3, 1 - (1 - leave) ** 3);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 72,
          right: 128,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "10px 24px 10px 10px",
          borderRadius: 6,
          background: "#12211A",
          boxShadow: onDark ? "inset 0 0 0 1px #2A3C33" : "none",
          color: "#FFFFFF",
          fontFamily: "'IBM Plex Sans', sans-serif",
          opacity: presence,
          // Whole pixels, or the text shimmers while it moves.
          transform: `translateX(${Math.round((1 - presence) * 24)}px)`,
        }}
      >
        {src ? (
          <Img
            src={src}
            style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid #F5B700", boxSizing: "border-box" }}
          />
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1, whiteSpace: "nowrap" }}>{person.short}</div>
          {person.rm ? (
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, lineHeight: 1, color: "#96CAB6" }}>
              RM {person.rm}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
