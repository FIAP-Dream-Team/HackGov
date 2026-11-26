import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SPEAKERS, type SpeakerId } from "../data/speakers";

/** Frames the tag stays up after a voice takes over. */
export const GS_TAG_HOLD = 120;
const IN = 12;
const OUT = 10;

/** What each person built, from the project documentation (section 15). */
const ROLE: Record<SpeakerId, string> = {
  john: "Roteiro, slides e vídeos",
  joao: "Documentação e entrega",
  brenda: "Dados e indicadores",
  vinicius: "Modelagem, banco e Java",
  larissa: "Prototipação e interface",
};

/**
 * Who is talking, in the Alertaí system (deck/alertai.html): Sora name, Figtree role, the deck's
 * single 16 px radius, a flat Tinta block with no shadow. It sits in the top-right corner every
 * scene keeps free, above the phone (which starts at y 144), on the 128 px margin.
 */
export const GsSpeakerTag: React.FC<{ speaker: SpeakerId; durationInFrames: number; onDark: boolean }> = ({
  speaker,
  durationInFrames,
  onDark,
}) => {
  const frame = useCurrentFrame();
  const person = SPEAKERS[speaker];
  const enter = interpolate(frame, [0, IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leave = interpolate(frame, [durationInFrames - OUT, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p = Math.min(enter, leave);
  return (
    <div
      style={{
        position: "absolute",
        right: 128,
        top: 40,
        height: 80,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 24px 0 12px",
        borderRadius: 16,
        background: "#221B33",
        border: onDark ? "1px solid #3A3150" : "1px solid #221B33",
        color: "#F6F3FB",
        opacity: p,
        transform: `translateY(${Math.round((1 - enter) * -12)}px)`,
      }}
    >
      {person.photo ? (
        <Img
          src={staticFile(`fotos/${person.photo}`)}
          style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", display: "block" }}
        />
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ font: "700 26px/1.1 'Sora', system-ui, sans-serif", whiteSpace: "nowrap" }}>{person.short}</span>
        <span style={{ font: "400 20px/1.2 'Figtree', system-ui, sans-serif", color: "#B8AECF", whiteSpace: "nowrap" }}>
          {ROLE[speaker]}
        </span>
      </div>
    </div>
  );
};
