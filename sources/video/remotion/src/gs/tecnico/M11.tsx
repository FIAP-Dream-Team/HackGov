import React from "react";
import { useCurrentFrame } from "remotion";
import { fade, out, pop } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F, MARGIN, S, sec } from "../tokens";
import { GsScene, Logo } from "../ui";

const B = BEATS.M11;

// T11 · closing, Tinta like the pitch signature (deck s11), with the repository instead of the tagline.
export const M11: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <GsScene tone="tinta">
      <div style={{ opacity: out(frame, sec(B.dur), 0.4) }}>
        <div style={{ position: "absolute", left: MARGIN, top: 200, ...pop(frame, B.logo, 0.5) }}>
          <Logo variant="horizontal-negativo" height={120} />
        </div>
        <p
          style={{
            position: "absolute",
            left: MARGIN,
            top: 424,
            margin: 0,
            font: `700 96px/1.05 ${F.titulo}`,
            letterSpacing: "-0.03em",
            ...fade(frame, B.frase),
          }}
        >
          Java 17, Oracle e <span style={{ color: C.jacaClaro }}>JDBC</span>.
        </p>
        <p
          style={{
            position: "absolute",
            left: MARGIN,
            top: 576,
            margin: 0,
            font: `600 ${S.destaque}px/1.2 ${F.titulo}`,
            color: C.noiteTexto,
            ...fade(frame, B.repo),
          }}
        >
          github.com/FIAP-Dream-Team/global-solution-1-2026
        </p>
        <p
          style={{
            position: "absolute",
            left: MARGIN,
            top: 768,
            width: 1664,
            margin: 0,
            font: `400 26px/1.5 ${F.texto}`,
            color: C.noite2,
            ...fade(frame, B.fecho),
          }}
        >
          <b style={{ color: C.noiteTexto, fontWeight: 600 }}>
            Ana Larissa Cristo Mendes · Brenda Cristina Martins Araújo · João Pedro Thethê Andrade
            <br />
            John Vitor Silverio Pereira · Vinícius Cardoso Junqueira
          </b>
          <br />
          Global Solution 2026 · CitizenTech · FIAP · Turma 2SIOR
        </p>
      </div>
    </GsScene>
  );
};
