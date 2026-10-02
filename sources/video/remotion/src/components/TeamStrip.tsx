import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { initials, photoSrc, SPEAKERS, TEAM_ORDER } from "../data/speakers";
import { Avatar } from "./SpeakerCard";

type TeamStripProps = {
  /** Frame the strip starts appearing at, relative to the slide. */
  delay?: number;
  /** Cover sits on the green background; closing sits on the deep green one. */
  tone?: "onGreen" | "onDark";
  /** Skip the entrance so a single-frame still shows the finished strip. */
  staticRender?: boolean;
};

/**
 * The five faces, over the cover and the closing slide. The deck already prints
 * the names in its footer, so this replaces that line rather than repeating it.
 */
export const TeamStrip: React.FC<TeamStripProps> = ({
  delay = 18,
  tone = "onGreen",
  staticRender = false,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          bottom: 62,
          display: "flex",
          gap: 26,
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontFamily: FONTS.body,
        }}
      >
        {TEAM_ORDER.map((id, index) => {
          const person = SPEAKERS[id];
          const begin = delay + index * 4;
          const progress = staticRender
            ? 1
            : interpolate(frame, [begin, begin + 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
          const eased = 1 - (1 - progress) ** 3;

          return (
            <div
              key={id}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                opacity: eased,
                transform: `translateY(${(1 - eased) * 22}px)`,
              }}
            >
              <Avatar src={photoSrc(person)} label={initials(person)} size={132} />
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.white,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {person.short}
              </div>
              {person.rm ? (
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: tone === "onGreen" ? "#D8EFE5" : "#8FD3B4",
                  }}
                >
                  RM {person.rm}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
