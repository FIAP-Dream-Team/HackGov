import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import rawEdl from "../data/gs-tecnico/edl.json";
import { OVERLAY_DUR } from "./tecnico-beats";
import { C, F, FPS } from "./tokens";
import { GsScene } from "./ui";
import { Abertura } from "./tecnico/Abertura";
import { M01 } from "./tecnico/M01";
import { M02 } from "./tecnico/M02";
import { M03 } from "./tecnico/M03";
import { M05 } from "./tecnico/M05";
import { M07 } from "./tecnico/M07";
import { M08 } from "./tecnico/M08";
import { M09 } from "./tecnico/M09";
import { M10 } from "./tecnico/M10";
import { M11 } from "./tecnico/M11";
import { OVERLAYS, Overlay, type OverlaySpec } from "./tecnico/overlays";

// The Alertaí technical video (Entrega 2), cut by scripts/gs-tecnico/build.py from John's narration:
// every shot starts on a word, video shots fitted to their slot, overlays on the word that calls them.
// Straight cuts only (edicao-tecnico.md): the motions bring their own entrances.

type Zoom = { scale: number; cx: number; cy: number; static?: boolean };
type Shot =
  | { type: "motion"; id: string; start: number; end: number }
  | { type: "phone"; src: string; from: number; to: number; start: number; end: number }
  | {
      type: "video";
      src: string;
      from: number;
      to: number;
      speed: number;
      start: number;
      end: number;
      zoom?: Zoom;
      label?: string;
      overlays: { id: string; start: number }[];
    }
  | { type: "split"; start: number; end: number; left: SplitSide; right: SplitSide };
type SplitSide = { src: string; from: number; to: number; focus: [number, number]; overlay: string; overlayAt: number };
type Edl = { fps: number; durationSec: number; durationInFrames: number; audio: string; shots: Shot[] };

export const gsTecnicoEdl = rawEdl as unknown as Edl;

const MOTIONS: Record<string, React.FC> = { M00: Abertura, M01, M02, M03, M05, M07, M08, M09, M10, M11 };
const f = (sec: number) => Math.round(sec * FPS);

export const TecnicoEdit: React.FC = () => (
  <AbsoluteFill style={{ background: C.tinta }}>
    {gsTecnicoEdl.shots.map((s, i) => (
      <Sequence key={i} from={f(s.start)} durationInFrames={Math.max(1, f(s.end) - f(s.start))} name={`${i} ${s.type === "motion" ? s.id : s.type === "split" ? "split" : s.src}`}>
        {s.type === "motion" ? <MotionShot id={s.id} /> : s.type === "phone" ? <PhoneShot shot={s} /> : s.type === "split" ? <SplitShot shot={s} /> : <VideoShot shot={s} />}
      </Sequence>
    ))}
    <Audio src={staticFile(gsTecnicoEdl.audio)} name="Mix" />
  </AbsoluteFill>
);

const MotionShot: React.FC<{ id: string }> = ({ id }) => {
  const M = MOTIONS[id];
  if (!M) throw new Error(`Motion ${id} nao existe`);
  return <M />;
};

/** A pre-cut from bruto/: source range [from, to] at `speed`, its last frame held to the end of the slot. */
const Clip: React.FC<{ src: string; from: number; to: number; speed: number; style?: React.CSSProperties }> = ({ src, from, to, speed, style }) => {
  const frame = useCurrentFrame();
  const last = Math.max(0, Math.floor(((to - from) / speed) * FPS) - 2);
  return (
    <Freeze frame={Math.min(frame, last)}>
      <OffthreadVideo src={staticFile(`gs-tecnico/takes/${src}`)} trimBefore={f(from)} playbackRate={speed} muted style={style} />
    </Freeze>
  );
};

const VideoShot: React.FC<{ shot: Extract<Shot, { type: "video" }> }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const z = shot.zoom;
  // The grid zoom eases in once, a beat after the cut, and holds (one zoom at a time, never with a pan).
  const p = !z ? 0 : z.static ? 1 : interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  // Scaling around a point inside the frame never uncovers an edge.
  const scale = z ? 1 + (z.scale - 1) * p : 1;
  const slot = f(shot.end - shot.start);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${z?.cx ?? 960}px ${z?.cy ?? 540}px` }}>
        <Clip src={shot.src} from={shot.from} to={shot.to} speed={shot.speed} style={{ width: 1920, height: 1080 }} />
        {shot.overlays.map((o) => {
          const spec = OVERLAYS.find((x) => x.id === o.id);
          if (!spec) throw new Error(`Sobreposicao ${o.id} nao existe em overlays.tsx`);
          const from = Math.max(0, f(o.start - shot.start));
          return (
            <Sequence key={o.id} from={from} durationInFrames={Math.max(1, Math.min(f(OVERLAY_DUR), slot - from))} layout="none">
              <Overlay spec={spec} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {shot.label ? <Overlay spec={{ id: "label", sobre: "", boxes: [], rotulo: shot.label } as OverlaySpec} /> : null}
    </AbsoluteFill>
  );
};

/** B20 inside a phone, on Tinta. The Safari bars of the recording stay outside the screen (rows 92-752). */
const PhoneShot: React.FC<{ shot: Extract<Shot, { type: "phone" }> }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const W = 400;
  const TOP = 92;
  const BOTTOM = 752;
  const H = Math.round(((BOTTOM - TOP) * W) / 384);
  const enter = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
  return (
    <GsScene tone="tinta">
      <div
        style={{
          position: "absolute",
          left: (1920 - W - 28) / 2,
          top: (1080 - H - 28) / 2 - 24,
          padding: 14,
          borderRadius: 64,
          background: "#120E1C",
          border: `2px solid ${C.noiteRule}`,
          opacity: enter,
          transform: `translateY(${Math.round((1 - enter) * 16)}px)`,
        }}
      >
        <div style={{ position: "relative", width: W, height: H, overflow: "hidden", borderRadius: 50 }}>
          <Clip
            src={shot.src}
            from={shot.from}
            to={shot.to}
            speed={1}
            style={{ position: "absolute", left: 0, top: -(TOP * W) / 384, width: W, height: (832 * W) / 384 }}
          />
        </div>
      </div>
      <p
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 40,
          margin: 0,
          textAlign: "center",
          font: `400 20px/1.3 ${F.texto}`,
          color: C.noite2,
          opacity: enter,
        }}
      >
        Protótipo do app em React, com dados simulados
      </p>
    </GsScene>
  );
};

/**
 * Enum above, CHECK below (T08: "enums iguais ao CHECK"): each band is framed on the three values at full
 * size (the CHECK line is 1466 px wide, it only fits the full width), with its own callout, so the same
 * OPERANDO / SEM_ENERGIA / DESLIGADA read from the IntelliJ band to the VS Code band.
 */
const SplitShot: React.FC<{ shot: Extract<Shot, { type: "split" }> }> = ({ shot }) => {
  const slot = f(shot.end - shot.start);
  const band = (side: SplitSide, top: number, caption: string) => {
    const spec = OVERLAYS.find((x) => x.id === side.overlay);
    if (!spec) throw new Error(`Sobreposicao ${side.overlay} nao existe`);
    const from = Math.max(0, f(side.overlayAt - shot.start));
    return (
      <div style={{ position: "absolute", left: 0, top, width: 1920, height: 540, overflow: "hidden", background: "#1E1F22" }}>
        <div style={{ position: "absolute", left: 0, top: 270 - side.focus[1], width: 1920, height: 1080 }}>
          <Clip src={side.src} from={side.from} to={side.to} speed={1} style={{ width: 1920, height: 1080 }} />
          <Sequence from={from} durationInFrames={Math.max(1, Math.min(f(OVERLAY_DUR), slot - from))} layout="none">
            <Overlay spec={spec} />
          </Sequence>
        </div>
        <p style={{ position: "absolute", right: 64, top: 32, margin: 0, padding: "10px 20px", borderRadius: 16, background: C.tinta, font: `600 26px/1.2 ${F.titulo}`, color: C.noiteTexto }}>
          {caption}
        </p>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {band(shot.left, 0, "no Java: enum StatusEstacao")}
      {band(shot.right, 540, "no Oracle: CHECK da tabela")}
      <div style={{ position: "absolute", left: 0, top: 539, width: 1920, height: 2, background: C.noiteRule }} />
    </AbsoluteFill>
  );
};
