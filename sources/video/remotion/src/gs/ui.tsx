import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadGsFonts } from "./fonts";
import { fade, prog } from "./anim";
import { C, F, MARGIN, RADIUS, S } from "./tokens";

loadGsFonts();

type Tone = "petala" | "tinta" | "jaca" | "transparent";

const BG: Record<Tone, string | undefined> = {
  petala: C.petala,
  tinta: C.tinta,
  jaca: C.jaca,
  transparent: undefined,
};
const FG: Record<Tone, string> = {
  petala: C.tinta,
  tinta: C.noiteTexto,
  jaca: C.branco,
  transparent: C.noiteTexto,
};

/** A full 1920×1080 frame of the deck: 88 px top, 128 px sides, body text in Figtree 30. */
export const GsScene: React.FC<{ tone?: Tone; children: React.ReactNode }> = ({ tone = "petala", children }) => (
  <AbsoluteFill
    style={{
      background: BG[tone],
      color: FG[tone],
      fontFamily: F.texto,
      fontSize: S.corpo,
      lineHeight: 1.4,
      WebkitFontSmoothing: "antialiased",
    }}
  >
    {children}
  </AbsoluteFill>
);

/** The Alertaí pin (from the symbol), used in the section line. */
export const Pin: React.FC<{ size?: number; color?: string; dot?: string }> = ({
  size = 28,
  color = "currentColor",
  dot = C.acentoLogo,
}) => (
  <svg width={(size * 48) / 60} height={size} viewBox="8 2 48 60" aria-hidden>
    <path
      fill={color}
      fillRule="evenodd"
      d="M32 4C19.3 4 10 13.6 10 26c0 16.4 22 34 22 34s22-17.6 22-34C54 13.6 44.7 4 32 4zM28.6 14.4a3.4 3.4 0 0 1 6.8 0v12.2a3.4 3.4 0 0 1-6.8 0zM27.8 37.5a4.2 4.2 0 1 0 8.4 0 4.2 4.2 0 1 0-8.4 0z"
    />
    <path fill={dot} d="M27.8 37.5a4.2 4.2 0 1 0 8.4 0 4.2 4.2 0 1 0-8.4 0z" />
  </svg>
);

/** Title block at the deck's fixed place (x 128, y 88). `at` = when it enters, in seconds. */
export const Title: React.FC<{ children: React.ReactNode; at?: number; tone?: Tone; maxWidth?: number }> = ({
  children,
  at = 0,
  maxWidth = 1400,
}) => {
  const frame = useCurrentFrame();
  return (
    <h2
      style={{
        position: "absolute",
        left: MARGIN,
        top: 88,
        margin: 0,
        maxWidth,
        font: `700 ${S.titulo}px/1.05 ${F.titulo}`,
        letterSpacing: "-0.02em",
        textWrap: "balance",
        ...fade(frame, at),
      }}
    >
      {children}
    </h2>
  );
};

/** Footnote line at the bottom margin (sources, "previsto", "dados da demonstração"). */
export const Note: React.FC<{ children: React.ReactNode; at?: number; dark?: boolean }> = ({
  children,
  at = 0,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  return (
    <p
      style={{
        position: "absolute",
        left: MARGIN,
        right: MARGIN,
        bottom: 40,
        margin: 0,
        font: `400 ${S.nota}px/1.3 ${F.texto}`,
        color: dark ? C.noite2 : C.tinta2,
        ...fade(frame, at),
      }}
    >
      {children}
    </p>
  );
};

// App icons (frontend/src/components/Icone.tsx), 24 px grid, stroke 1.8.
const ICON_PATHS = {
  luz: ["M13 2 4 14h7l-1 8 9-12h-7z"],
  estacao: ["M3 21V11l5 3v-3l5 3V6h7v15z", "M7 17.5h2M11.5 17.5h2M16 10h2"],
  agua: ["M12 3c3.5 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.5-6.5 6-11z"],
  aviso: ["M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z", "M10 21h4"],
  conf: [
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    "M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c1.9.8 3.2 2.6 3.5 5.2",
  ],
} as const;
export type IconName = keyof typeof ICON_PATHS;

export const Icon: React.FC<{ name: IconName; size?: number }> = ({ name, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {ICON_PATHS[name].map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

/** The event marks shared by the deck (s02, s07, s09): same colour for the same thing. */
export const DISC_COLOR: Record<IconName, { bg: string; fg: string }> = {
  luz: { bg: C.grande, fg: C.branco },
  conf: { bg: C.jaca, fg: C.branco },
  estacao: { bg: C.folha, fg: C.branco },
  aviso: { bg: C.folha, fg: C.branco },
  agua: { bg: C.perigo, fg: C.tinta },
};

export const Disc: React.FC<{ name: IconName; size?: number; style?: React.CSSProperties }> = ({
  name,
  size = 96,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      background: DISC_COLOR[name].bg,
      color: DISC_COLOR[name].fg,
      ...style,
    }}
  >
    <Icon name={name} size={size / 2} />
  </div>
);

type LogoVariant = "horizontal" | "horizontal-branco" | "horizontal-negativo" | "simbolo";
const LOGO_RATIO: Record<LogoVariant, number> = {
  horizontal: 460.3 / 116,
  "horizontal-branco": 460.3 / 116,
  "horizontal-negativo": 460.3 / 116,
  simbolo: 1,
};

/** Official logo files from docs/marca (public/gs/img). Height drives the size. */
export const Logo: React.FC<{ variant?: LogoVariant; height?: number; style?: React.CSSProperties }> = ({
  variant = "horizontal",
  height = 120,
  style,
}) => (
  <Img
    src={staticFile(`gs/img/alertai-logo-${variant}.svg`.replace("logo-simbolo", "simbolo"))}
    style={{ height, width: height * LOGO_RATIO[variant], display: "block", ...style }}
  />
);

/**
 * Callout over a screen recording (V2 track): an outline that draws around the region the voice
 * is talking about, plus an optional label. Built for dark screens (terminal, DBeaver, IntelliJ):
 * Jacarandá-claro outline, label on a Tinta block. Coordinates are in the 1920×1080 frame.
 */
export const Callout: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  label?: string;
  labelSide?: "top" | "bottom" | "right" | "left";
  color?: string;
  until?: number;
}> = ({ x, y, w, h, at, label, labelSide = "top", color = C.jacaClaro, until }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 0.5);
  const gone = until === undefined ? 1 : 1 - prog(frame, until, 0.3);
  if (p <= 0 || gone <= 0) return null;
  const perim = 2 * (w + h);
  const labelPos: React.CSSProperties =
    labelSide === "top"
      ? { left: x, top: y - 16 - 56 }
      : labelSide === "bottom"
        ? { left: x, top: y + h + 16 }
        : labelSide === "right"
          ? { left: x + w + 24, top: y + h / 2 - 28 }
          : { right: 1920 - x + 24, top: y + h / 2 - 28 };
  return (
    <AbsoluteFill style={{ opacity: gone }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={perim}
          strokeDashoffset={perim * (1 - p)}
        />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            ...labelPos,
            height: 56,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            background: C.tinta,
            border: `2px solid ${color}`,
            borderRadius: RADIUS,
            color: C.noiteTexto,
            font: `700 ${S.corpo}px/1 ${F.titulo}`,
            whiteSpace: "nowrap",
            ...fade(frame, at + 0.15, 0.35),
          }}
        >
          {label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
