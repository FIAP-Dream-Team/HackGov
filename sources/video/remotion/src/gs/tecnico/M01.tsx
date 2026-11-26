import React from "react";
import { useCurrentFrame } from "remotion";
import { draw, fade, pop } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F, MARGIN, S } from "../tokens";
import { Disc, GsScene, Logo } from "../ui";

const B = BEATS.M01;

// T01 · opening, Tinta like the pitch opening. The logo, then the chain the whole video follows:
// a power cut at the station becomes a water warning. Same discs and colours as deck s02/s07.
const NODES = [
  { name: "luz", x: 0, at: B.luz, title: "Falta de luz", sub: "no bairro da estação" },
  { name: "estacao", x: 760, at: B.estacao, title: "Estação para", sub: "sem energia para bombear" },
  { name: "agua", x: 1520, at: B.agua, title: "Aviso de falta de água", sub: "nos bairros que ela abastece" },
] as const;

export const M01: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <GsScene tone="tinta">
      <div style={{ position: "absolute", left: MARGIN, top: 120, ...pop(frame, B.logo, 0.5) }}>
        <Logo variant="horizontal-negativo" height={112} />
      </div>

      <div style={{ position: "absolute", left: MARGIN, top: 520, width: 1664, height: 320 }}>
        <svg width={1664} height={96} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path
            d="M120 48H736"
            pathLength={1}
            stroke={C.noite2}
            strokeWidth={2}
            fill="none"
            style={draw(frame, B.luz + 0.15, 0.45)}
          />
          <path
            d="M880 48H1496"
            pathLength={1}
            stroke={C.noite2}
            strokeWidth={2}
            fill="none"
            style={draw(frame, B.estacao + 0.15, 0.45)}
          />
        </svg>
        {NODES.map((n) => (
          <React.Fragment key={n.name}>
            <Disc name={n.name} style={{ position: "absolute", left: n.x, top: 0, ...pop(frame, n.at) }} />
            <div
              style={{
                position: "absolute",
                left: n.x,
                top: 128,
                width: 400,
                ...(n.name === "agua" ? { left: undefined, right: 0, textAlign: "right" as const } : {}),
                ...fade(frame, n.at + 0.1),
              }}
            >
              <div
                style={{
                  font: `700 ${S.corpo + 6}px/1.15 ${F.titulo}`,
                  letterSpacing: "-0.01em",
                  color: n.name === "agua" ? C.jacaClaro : C.noiteTexto,
                }}
              >
                {n.title}
              </div>
              <div style={{ marginTop: 8, font: `400 ${S.rotulo}px/1.3 ${F.texto}`, color: C.noite2 }}>{n.sub}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </GsScene>
  );
};
