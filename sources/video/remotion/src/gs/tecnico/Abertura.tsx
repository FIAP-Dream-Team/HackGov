import React from "react";
import { Easing, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { fade, pop } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F, FPS, MARGIN, S } from "../tokens";
import { GsScene, Logo } from "../ui";

// Opening of the technical video, in the language of the closing (M11): Tinta, the logo and one line on the
// left, and the app already running in a small phone on the right from the first frame. On "No app" the text
// slides out to the left while the phone grows to the centre; on "Aqui, o motor" the phone goes back to the
// right and "Java 17 · Oracle" comes in on the left, handing over to the architecture diagram.
const B = BEATS.M00;

/** The phone recordings are Safari on an iPhone (384x832). Only the stretches where the page has scrolled are
 *  used: Safari then shrinks its address bar to a pill (rows 0-66) and drops the bottom toolbar, so rows 92-832
 *  are the app whole, its own tab bar included. A drawn iOS status bar and the Dynamic Island replace the
 *  recording's top, so the screen keeps an iPhone's proportions (about 0.49) instead of a squat crop. */
const SRC_W = 384;
const TOP = 92;
const BOTTOM = 832;
const SCREEN_W = 300;
const STATUS_H = 40;
const CONTENT_H = Math.round(((BOTTOM - TOP) * SCREEN_W) / SRC_W);
const SCREEN_H = STATUS_H + CONTENT_H;
// Início (scrolled) -> on "vira aviso de falta de água", the cascade alert -> the live map.
const CLIPS = [
  { file: "B20-inicio.mp4", from: 3.5, to: 5.4 },
  { file: "B23-alerta-cascata.mp4", from: 4.85, to: 10.55 },
  { file: "X1-mapa-ao-vivo.mp4", from: 4.1, to: 6.0 },
];

const StatusBar: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: STATUS_H, background: "#F6F3FB", zIndex: 2 }}>
    <span style={{ position: "absolute", left: 30, top: 12, font: `600 15px/1 ${F.texto}`, color: "#111" }}>9:41</span>
    {/* Dynamic Island */}
    <div style={{ position: "absolute", left: SCREEN_W / 2 - 46, top: 9, width: 92, height: 26, borderRadius: 13, background: "#000" }} />
    <svg width="70" height="14" viewBox="0 0 70 14" style={{ position: "absolute", right: 22, top: 13 }} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 5} y={10 - i * 3} width="3.4" height={3 + i * 3} rx="1" fill="#111" />
      ))}
      <path d="M30 4.5a10 10 0 0 1 13 0M32.3 7.2a6.4 6.4 0 0 1 8.4 0M34.6 9.9a2.8 2.8 0 0 1 3.8 0" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <rect x="49" y="2" width="18" height="10" rx="2.6" stroke="#111" strokeWidth="1.2" fill="none" />
      <rect x="50.8" y="3.8" width="13" height="6.4" rx="1.4" fill="#111" />
      <rect x="67.6" y="5.2" width="1.6" height="3.6" rx="0.8" fill="#111" />
    </svg>
  </div>
);

const EASE = Easing.bezier(0.65, 0, 0.35, 1);
const move = (frame: number, at: number, dur = 0.8) =>
  interpolate(frame, [at * FPS, (at + dur) * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

const AppScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const lengths = CLIPS.map((c) => Math.floor((c.to - c.from) * FPS));
  let k = 0;
  let local = frame;
  while (k < CLIPS.length - 1 && local >= lengths[k]) {
    local -= lengths[k];
    k += 1;
  }
  const clip = CLIPS[k];
  return (
    <Freeze frame={Math.min(local, lengths[k] - 1)}>
      <OffthreadVideo
        key={clip.file}
        src={staticFile(`gs-tecnico/takes/${clip.file}`)}
        trimBefore={Math.round(clip.from * FPS)}
        muted
        style={{ position: "absolute", left: 0, top: STATUS_H - (TOP * SCREEN_W) / SRC_W, width: SCREEN_W, height: (832 * SCREEN_W) / SRC_W }}
      />
    </Freeze>
  );
};

export const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const toCentre = move(frame, B.app);
  const toSide = move(frame, B.motor);
  // Phone: right third, small -> centre, 1.45x -> back to the right third.
  const side = 1440;
  const x = side + (960 - side) * toCentre + (side - 960) * toSide;
  const scale = 1 + 0.32 * toCentre - 0.32 * toSide;
  const enter = pop(frame, 0.1, 0.6);
  const out = 1 - move(frame, B.app, 0.6);
  const BEZEL = 13;
  const PHONE_W = SCREEN_W + BEZEL * 2;
  const PHONE_H = SCREEN_H + BEZEL * 2;
  return (
    <GsScene tone="tinta">
      {/* the opening line, out to the left on "No app" */}
      <div style={{ position: "absolute", left: MARGIN, top: 300, width: 880, opacity: out, transform: `translateX(${Math.round(-480 * (1 - out))}px)` }}>
        <div style={fade(frame, 0.1, 0.5)}>
          <Logo variant="horizontal-negativo" height={104} />
        </div>
        <p style={{ margin: "56px 0 0", font: `700 ${S.titulo}px/1.08 ${F.titulo}`, letterSpacing: "-0.02em", ...fade(frame, 0.4, 0.5) }}>
          Alertas por bairro, com o <span style={{ color: C.jacaClaro }}>efeito cascata</span>.
        </p>
        <p style={{ margin: "32px 0 0", font: `400 ${S.corpo}px/1.4 ${F.texto}`, color: C.noite2, ...fade(frame, 0.7, 0.5) }}>
          Quando a luz cai no bairro de uma estação de bombeamento, o aviso de falta de água chega antes.
        </p>
      </div>

      {/* "the engine": in from the left on "Aqui, o motor" */}
      <div style={{ position: "absolute", left: MARGIN, top: 380, width: 820, ...fade(frame, B.motor + 0.3, 0.5) }}>
        <p style={{ margin: 0, font: `500 ${S.corpo}px/1.3 ${F.texto}`, color: C.noite2 }}>o que roda por trás do app</p>
        <p style={{ margin: "16px 0 0", font: `700 96px/1.05 ${F.titulo}`, letterSpacing: "-0.03em" }}>
          Java 17 <span style={{ color: C.noite2 }}>·</span> <span style={{ color: C.jacaClaro }}>Oracle</span>
        </p>
        <p style={{ margin: "24px 0 0", font: `400 ${S.corpo}px/1.4 ${F.texto}`, color: C.noite2 }}>
          JDBC com PreparedStatement e um menu de console para a demonstração
        </p>
      </div>

      {/* the phone, playing the app from the first frame */}
      <div
        style={{
          position: "absolute",
          left: x - PHONE_W / 2,
          top: 540 - PHONE_H / 2,
          width: PHONE_W,
          height: PHONE_H,
          // The entrance pop sets its own scale, so it multiplies the travel scale instead of replacing it.
          opacity: enter.opacity,
          transform: `scale(${scale}) ${enter.transform ?? ""}`,
        }}
      >
        {/* side buttons: action and volume on the left, power on the right */}
        {[{ y: 120, h: 30 }, { y: 170, h: 54 }, { y: 236, h: 54 }].map((b, i) => (
          <div key={i} style={{ position: "absolute", left: -3, top: b.y, width: 4, height: b.h, borderRadius: 2, background: "#2E2840" }} />
        ))}
        <div style={{ position: "absolute", right: -3, top: 190, width: 4, height: 86, borderRadius: 2, background: "#2E2840" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: BEZEL,
            boxSizing: "border-box",
            borderRadius: 54,
            background: "#0B0910",
            boxShadow: `inset 0 0 0 1.5px #3A3150, inset 0 0 0 4px #0B0910, inset 0 0 0 5px #1E1A28`,
          }}
        >
          <div style={{ position: "relative", width: SCREEN_W, height: SCREEN_H, overflow: "hidden", borderRadius: 42, background: "#F6F3FB" }}>
            <StatusBar />
            <Sequence layout="none">
              <AppScreen />
            </Sequence>
          </div>
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
          font: `400 ${S.nota}px/1.3 ${F.texto}`,
          color: C.noite2,
          opacity: Math.max(0, Math.min(1, (frame / FPS - B.app - 0.4) / 0.4)) * (1 - toSide),
        }}
      >
        Protótipo do app em React, com dados simulados
      </p>
    </GsScene>
  );
};
