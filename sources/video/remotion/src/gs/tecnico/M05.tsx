import React from "react";
import { useCurrentFrame } from "remotion";
import { fade, pop, prog } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F, MARGIN, S } from "../tokens";
import { Disc, GsScene, Icon, Note } from "../ui";

const B = BEATS.M05;

// T05 end · "...e três bairros recebem o aviso." The same stylized map as the app
// (frontend/src/components/MapaBairros.tsx, viewBox 600×400) and deck s10: the ETA Arquipélago
// loses power, dashed Folha arrows carry the warning to the three neighbourhoods it supplies,
// Bom Jesus (drainage station) stays out of the cascade.

const MAP_W = 1152; // 600 × 1.92
const MAP_H = 768; // 400 × 1.92
const MAP_TOP = 160;

// Geometry copied from MapaBairros.tsx (GEO, POS_ESTACAO, CAMINHO_CASCATA). The Praia de Belas label
// sits above its mark (app: below), because the arrow to Menino Deus crosses y ≈ 250 there.
const ARQ = [
  [118, 118, 48, 26],
  [164, 194, 40, 26],
  [100, 252, 38, 20],
  [190, 86, 22, 13],
] as const;
const SHAPES = {
  centro: "M238 100 300 88 346 112 342 162 284 174 240 160Z",
  praia: "M244 170 284 176 332 170 336 252 298 288 266 288C254 260 246 220 244 170Z",
  menino: "M342 166 418 158 426 256 340 256Z",
  bom: "M462 90 560 74 578 166 494 190 452 138Z",
};
const ESTACAO: [number, number] = [160, 194];
const SETAS = [
  { to: "centro", d: "M184 184Q222 148 262 136" },
  { to: "praia", d: "M186 200Q226 220 262 224" },
  { to: "menino", d: "M180 212Q262 292 352 214" },
];
const AGUA_MARKS: [number, number][] = [
  [292, 130],
  [290, 222],
  [382, 202],
];
const LABELS = [
  { x: 128, y: 300, t: "Arquipélago" },
  { x: 292, y: 166, t: "Centro Histórico" },
  { x: 290, y: 200, t: "Praia de Belas" },
  { x: 382, y: 238, t: "Menino Deus" },
  { x: 512, y: 164, t: "Bom Jesus", dim: true },
];

// Dark, sober version (17/11): the same map in Tinta tones. Water a lighter Tinta, land #2A2240,
// outlines a step above the land; labels light on a dark halo. Severity keeps its colour and its word.
const WATER = "#352C52";
const LAND = "#2A2240";
const EDGE = "#4A4068";
const GREEN = "#5FB98C";
const RED_TEXT = "#F08A8A";

const halo: React.SVGProps<SVGTextElement> = {
  paintOrder: "stroke",
  stroke: C.tinta,
  strokeWidth: 4,
  strokeLinejoin: "round",
};

export const M05: React.FC = () => {
  const frame = useCurrentFrame();
  const luz = prog(frame, B.luz, 0.4);
  const bairros = prog(frame, B.bairros, 0.45);
  const setas = SETAS.map((_, i) => prog(frame, B.setas + i * 0.12, 0.6));

  return (
    <GsScene tone="tinta">
      <svg
        width={MAP_W}
        height={MAP_H}
        viewBox="0 0 600 400"
        style={{ position: "absolute", left: MARGIN, top: MAP_TOP, ...fade(frame, B.mapa, 0.3) }}
      >
        <defs>
          <marker id="m05-seta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={GREEN} />
          </marker>
          {SETAS.map((s, i) => (
            <mask id={`m05-mask-${i}`} key={s.to} maskUnits="userSpaceOnUse" x={0} y={0} width={600} height={400}>
              <path d={s.d} pathLength={1} stroke="#fff" strokeWidth={8} fill="none" strokeDasharray={1} strokeDashoffset={1 - setas[i]} />
            </mask>
          ))}
        </defs>

        <rect width={600} height={400} fill={WATER} />
        <path
          d="M250 0H600V400H318C298 370 276 330 264 296C250 256 240 218 236 180C233 148 230 118 236 92C241 58 246 28 250 0Z"
          fill={LAND}
          stroke={EDGE}
          strokeWidth={1.2}
        />
        <path d="M360 0V400M440 0V400M520 0V400M250 60H600M262 280H600M300 340H600" stroke={C.noiteRule} strokeWidth={1} opacity={0.6} />
        <text x={24} y={384} fontSize={13} fontStyle="italic" fill={C.noite2} fontFamily="Figtree">
          Lago Guaíba
        </text>

        {/* Arquipélago: power cut (Grande perigo) */}
        <g>
          {ARQ.map(([cx, cy, rx, ry]) => (
            <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill={LAND} stroke={EDGE} strokeWidth={1.2} />
          ))}
          {ARQ.map(([cx, cy, rx, ry]) => (
            <ellipse
              key={`h${cx}-${cy}`}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={C.grande}
              fillOpacity={0.35 * luz}
              stroke={C.grande}
              strokeOpacity={luz}
              strokeWidth={1.6}
            />
          ))}
        </g>

        {/* the three neighbourhoods the ETA supplies */}
        {(["centro", "praia", "menino"] as const).map((k) => (
          <g key={k}>
            <path d={SHAPES[k]} fill={LAND} stroke={EDGE} strokeWidth={1.2} />
            <path d={SHAPES[k]} fill={C.perigo} fillOpacity={0.35 * bairros} stroke={C.perigo} strokeOpacity={bairros} strokeWidth={1.6} />
          </g>
        ))}

        {/* Bom Jesus: drainage station, outside the cascade */}
        <path d={SHAPES.bom} fill={LAND} stroke={C.noite2} strokeWidth={1.2} strokeDasharray="4 4" opacity={0.7} />

        {/* cascade arrows, dashed like the app, drawn through a mask */}
        {SETAS.map((s, i) => (
          <path
            key={s.to}
            d={s.d}
            fill="none"
            stroke={GREEN}
            strokeWidth={2.5}
            strokeDasharray="7 6"
            mask={`url(#m05-mask-${i})`}
            markerEnd={setas[i] > 0.92 ? "url(#m05-seta)" : undefined}
          />
        ))}

        {/* power-cut mark and the station */}
        <g style={{ transformBox: "fill-box", transformOrigin: "center", ...pop(frame, B.luz) }}>
          <circle cx={118} cy={118} r={14} fill={C.grande} stroke={C.tinta} strokeWidth={2} />
          <svg x={110} y={110} width={16} height={16} viewBox="0 0 24 24" color="#fff">
            <Icon name="luz" size={16} />
          </svg>
        </g>
        <text x={140} y={123} fontSize={13} fontWeight={700} fill={RED_TEXT} fontFamily="Figtree" opacity={luz} {...halo}>
          sem luz
        </text>
        <g opacity={luz}>
          <circle cx={ESTACAO[0]} cy={ESTACAO[1]} r={15} fill={C.folha} stroke={C.tinta} strokeWidth={2} />
          <svg x={ESTACAO[0] - 8} y={ESTACAO[1] - 8} width={16} height={16} viewBox="0 0 24 24" color="#fff">
            <Icon name="estacao" size={16} />
          </svg>
          <text x={ESTACAO[0]} y={ESTACAO[1] + 32} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.noiteTexto} fontFamily="Figtree" {...halo}>
            ETA Arquipélago
          </text>
        </g>

        {/* water warning marks */}
        {AGUA_MARKS.map(([x, y], i) => (
          <g key={`${x}-${y}`} style={{ transformBox: "fill-box", transformOrigin: "center", ...pop(frame, B.bairros + i * 0.08) }}>
            <circle cx={x} cy={y} r={13} fill={C.perigo} stroke={C.tinta} strokeWidth={2} />
            <svg x={x - 8} y={y - 8} width={16} height={16} viewBox="0 0 24 24" color={C.tinta}>
              <Icon name="agua" size={16} />
            </svg>
          </g>
        ))}

        {/* neighbourhood names, white halo like the app labels */}
        {LABELS.map((l) => (
          <text
            key={l.t}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            fontSize={11.5}
            fontWeight={700}
            fill={l.dim ? C.noite2 : C.noiteTexto}
            fontFamily="Figtree"
            {...halo}
          >
            {l.t}
          </text>
        ))}
      </svg>

      {/* legend column: what each mark means, in the order the voice gets to it */}
      <div style={{ position: "absolute", left: 1344, top: MAP_TOP, width: 448 }}>
        <LegendRow at={B.luz} first mark={<Disc name="luz" size={56} />} title="Arquipélago sem luz" sub="a ETA Arquipélago para de bombear" />
        <LegendRow
          at={B.setas}
          mark={
            <svg width={56} height={56} viewBox="0 0 56 56">
              <path d="M4 28H46" stroke={GREEN} strokeWidth={4} strokeDasharray="10 8" fill="none" />
              <path d="M42 18L54 28L42 38z" fill={GREEN} />
            </svg>
          }
          title="O aviso sai em cascata"
          sub="uma vez, para os bairros que ela abastece"
        />
        <LegendRow
          at={B.bairros}
          mark={<Disc name="agua" size={56} />}
          title="Possível falta de água"
          sub="Menino Deus, Praia de Belas e Centro Histórico"
        />
        <LegendRow
          at={B.bairros + 0.3}
          mark={
            <svg width={56} height={56} viewBox="0 0 56 56">
              <circle cx={28} cy={28} r={26} fill="none" stroke={C.noite2} strokeWidth={2} strokeDasharray="5 5" />
            </svg>
          }
          title="Bom Jesus"
          sub="drenagem: fora da cascata"
          dim
        />
      </div>

      <Note at={B.mapa} dark>Mapa estilizado, fora de escala: os cinco bairros do piloto, como no app. Dados da demonstração.</Note>
    </GsScene>
  );
};

const LegendRow: React.FC<{
  at: number;
  mark: React.ReactNode;
  title: string;
  sub: string;
  first?: boolean;
  dim?: boolean;
}> = ({ at, mark, title, sub, first = false, dim = false }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr",
        columnGap: 24,
        alignItems: "center",
        padding: first ? "0 0 32px" : "32px 0",
        borderTop: first ? undefined : `1px solid ${C.noiteRule}`,
        ...fade(frame, at),
      }}
    >
      {mark}
      <div>
        <div style={{ font: `700 ${S.corpo}px/1.15 ${F.titulo}`, letterSpacing: "-0.01em", color: dim ? C.noite2 : C.noiteTexto }}>{title}</div>
        <div style={{ marginTop: 8, font: `400 ${S.rotulo}px/1.3 ${F.texto}`, color: C.noite2 }}>{sub}</div>
      </div>
    </div>
  );
};
