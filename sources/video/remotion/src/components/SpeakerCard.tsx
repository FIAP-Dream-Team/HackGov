import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { initials, photoSrc, SPEAKERS, type SpeakerId } from "../data/speakers";

/** How long the card stays on screen after a speaker takes over, in frames. */
export const CARD_HOLD = 135;
const CARD_IN = 14;
const CARD_OUT = 12;

type SpeakerCardProps = {
  speaker: SpeakerId;
  /** Total frames the card is mounted for. */
  durationInFrames: number;
};

/**
 * Lower third naming whoever is narrating. It appears on every speaker change
 * so the video shows all five members took part, then clears out of the way of
 * the slide content.
 */
export const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, durationInFrames }) => {
  const frame = useCurrentFrame();
  const person = SPEAKERS[speaker];
  const src = photoSrc(person);

  const entering = interpolate(frame, [0, CARD_IN], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leaving = interpolate(
    frame,
    [durationInFrames - CARD_OUT, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const presence = Math.min(1 - (1 - entering) ** 3, 1 - (1 - leaving) ** 3);

  // Whole pixels only. A fractional translate makes Chrome re-rasterise the
  // text and the photo at a new subpixel offset on every frame, and across a
  // frame-by-frame render that reads as the card flickering while it moves.
  const slideIn = Math.round((1 - presence) * 40);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          // Top right is the one region every deck slide leaves clear: the
          // eyebrow and title run along the left, the content sits below them,
          // and the footer carries the source citations. A lower third here
          // would cover either a bullet or an attribution.
          top: 74,
          right: 76,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "14px 30px 14px 14px",
          borderRadius: 999,
          // Solid, not translucent-with-blur. `backdrop-filter` has to sample
          // whatever is behind it, and under an animating opacity Chrome
          // recomposites that sample inconsistently between frames — which is
          // what made the card blink on the way in and on the way out.
          background: COLORS.greenInkDeep,
          boxShadow: "0 26px 60px -30px rgba(0,0,0,0.7)",
          fontFamily: FONTS.body,
          color: COLORS.white,
          opacity: presence,
          transform: `translateX(${slideIn}px)`,
        }}
      >
        <Avatar src={src} label={initials(person)} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            {person.short}
          </div>
          {person.rm ? (
            <div style={{ fontSize: 21, fontWeight: 600, color: "#8FD3B4", letterSpacing: "0.04em" }}>
              RM {person.rm}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Avatar: React.FC<{ src: string | null; label: string; size?: number }> = ({
  src,
  label,
  size = 84,
}) => {
  const shared: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    flex: "none",
    border: `3px solid ${COLORS.yellow}`,
    boxSizing: "border-box",
  };

  if (src) {
    return <Img src={src} style={{ ...shared, objectFit: "cover" }} />;
  }

  return (
    <div
      style={{
        ...shared,
        background: COLORS.green,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 800,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </div>
  );
};

export { Avatar };
