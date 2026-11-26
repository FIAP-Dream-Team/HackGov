import React from "react";
import { useCurrentFrame } from "remotion";
import { draw, fade, prog } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F, MARGIN, RADIUS, S } from "../tokens";
import { GsScene, Note, Title } from "../ui";

const B = BEATS.M03;

// T03 · "Aqui é como pensamos o banco: separar ocorrência, o que o morador viu, de alerta, o aviso
// que o sistema manda." The 13 tables of docs/modelo-de-dados/alerta_bairro.sql with its 18 foreign
// keys, no columns. USUARIO and BAIRRO, the two tables most others point to, are drawn as rails so
// every key to them is a short vertical line. Then the two halves light up: what the resident saw
// (Jacarandá), the warning the system sends (Folha), and the station's two links used by the cascade.

const X0 = MARGIN;
const Y0 = 288;
const COL = 344;
const BW = 288;
const BH = 72;
const cx = (c: number) => c * COL;
const ry = (r: number) => r * 160;

type Group = "occ" | "alerta" | "estacao" | null;
type Table = { name: string; x: number; y: number; w?: number; group: Group; desc?: string };

const TABLES: Table[] = [
  { name: "USUARIO", x: 0, y: ry(0), w: cx(3) + BW, group: null, desc: "quem relata, confirma e recebe o aviso" },
  { name: "NIVEL_GUAIBA", x: cx(4), y: ry(0), group: null },
  { name: "USUARIO_BAIRRO", x: cx(0), y: ry(1), group: null },
  { name: "CONFIRMACAO", x: cx(1), y: ry(1), group: "occ" },
  { name: "OCORRENCIA", x: cx(2), y: ry(1), group: "occ" },
  { name: "NOTIFICACAO", x: cx(3), y: ry(1), group: "alerta" },
  { name: "ALERTA", x: cx(4), y: ry(1), group: "alerta" },
  { name: "ESTACAO_BOMBEAMENTO", x: cx(0), y: ry(2), group: "estacao" },
  { name: "ESTACAO_BAIRRO", x: cx(1), y: ry(2), group: "estacao" },
  { name: "TIPO_OCORRENCIA", x: cx(2), y: ry(2), group: null },
  { name: "CONTATO", x: cx(3), y: ry(2), group: null },
  { name: "ALERTA_BAIRRO", x: cx(4), y: ry(2), group: "alerta" },
  { name: "BAIRRO", x: 0, y: ry(3), w: cx(4) + BW, group: null, desc: "os cinco bairros do piloto" },
];

type Link = { pts: [number, number][]; group: Group; hop?: boolean };

// Every FK of the script, routed through the gaps between boxes.
const LINKS: Link[] = [
  { pts: [[144, 160], [144, 72]], group: null }, // USUARIO_BAIRRO → USUARIO
  { pts: [[240, 232], [240, 276], [316, 276], [316, 480]], group: null }, // USUARIO_BAIRRO → BAIRRO
  { pts: [[488, 160], [488, 72]], group: null }, // CONFIRMACAO → USUARIO
  { pts: [[632, 196], [688, 196]], group: "occ" }, // CONFIRMACAO → OCORRENCIA
  { pts: [[832, 160], [832, 72]], group: null }, // OCORRENCIA → USUARIO (autor)
  { pts: [[736, 232], [736, 276], [660, 276], [660, 480]], group: null }, // OCORRENCIA → BAIRRO
  { pts: [[832, 232], [832, 320]], group: null }, // OCORRENCIA → TIPO_OCORRENCIA
  { pts: [[1176, 160], [1176, 72]], group: null }, // NOTIFICACAO → USUARIO
  { pts: [[1320, 196], [1376, 196]], group: "alerta" }, // NOTIFICACAO → ALERTA
  { pts: [[1424, 232], [1424, 292], [920, 292], [920, 320]], group: null }, // ALERTA → TIPO_OCORRENCIA
  { pts: [[1520, 320], [1520, 232]], group: "alerta" }, // ALERTA_BAIRRO → ALERTA
  { pts: [[1520, 392], [1520, 480]], group: null }, // ALERTA_BAIRRO → BAIRRO
  { pts: [[144, 392], [144, 480]], group: "estacao" }, // ESTACAO_BOMBEAMENTO → BAIRRO (ID_BAIRRO: onde fica)
  { pts: [[344, 356], [288, 356]], group: "estacao" }, // ESTACAO_BAIRRO → ESTACAO_BOMBEAMENTO
  { pts: [[488, 392], [488, 480]], group: "estacao" }, // ESTACAO_BAIRRO → BAIRRO (quem ela abastece)
  { pts: [[1032, 356], [976, 356]], group: null }, // CONTATO → TIPO_OCORRENCIA
  { pts: [[1176, 392], [1176, 480]], group: null }, // CONTATO → BAIRRO
  // ALERTA → OCORRENCIA (origem), over the top; it hops the NOTIFICACAO → USUARIO line
  { pts: [[1424, 160], [1424, 116], [928, 116], [928, 160]], group: "alerta", hop: true },
];

// Dark, sober version (17/11): tables are outlines; a group lights up only in its outline and name.
// Green legible on Tinta (#5FB98C, 7:1) for the warning and the station; Jacarandá-claro for what was seen.
const GREEN = "#5FB98C";
const GROUP_STYLE = {
  occ: { at: B.ocorrencia, fill: "rgba(185,164,238,0.08)", edge: C.jacaClaro, text: C.jacaClaro },
  alerta: { at: B.alerta, fill: "rgba(95,185,140,0.08)", edge: GREEN, text: GREEN },
  estacao: { at: B.ligacao, fill: "rgba(95,185,140,0.08)", edge: GREEN, text: GREEN },
} as const;

const NEUTRAL_LINE = "#554A73";
const toD = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

export const M03: React.FC = () => {
  const frame = useCurrentFrame();
  const linesIn = prog(frame, B.tabelas + 0.8, 0.6);

  return (
    <GsScene tone="tinta">
      <Title at={B.title}>Separar ocorrência de alerta</Title>

      <div style={{ position: "absolute", left: X0, top: Y0, width: 1664, height: 560 }}>
        <svg width={1664} height={560} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* all keys, neutral */}
          <g stroke={NEUTRAL_LINE} strokeWidth={2} fill="none" strokeLinejoin="round" style={{ opacity: linesIn }}>
            {LINKS.map((l, i) => (
              <React.Fragment key={i}>
                {l.hop ? <path d={toD(l.pts)} stroke={C.tinta} strokeWidth={12} /> : null}
                <path d={toD(l.pts)} />
              </React.Fragment>
            ))}
          </g>
          {/* the keys of each highlighted group, drawn over in the group colour */}
          {LINKS.filter((l) => l.group).map((l, i) => {
            const g = GROUP_STYLE[l.group as Exclude<Group, null>];
            return (
              <path
                key={i}
                d={toD(l.pts)}
                pathLength={1}
                stroke={g.edge}
                strokeWidth={4}
                fill="none"
                strokeLinejoin="round"
                style={draw(frame, g.at + 0.2, 0.5)}
              />
            );
          })}
        </svg>

        {TABLES.map((t, i) => {
          const g = t.group ? GROUP_STYLE[t.group] : null;
          const lit = g ? prog(frame, g.at, 0.35) : 0;
          const rail = t.w !== undefined;
          return (
            <div
              key={t.name}
              style={{
                position: "absolute",
                left: t.x,
                top: t.y,
                width: t.w ?? BW,
                height: BH,
                boxSizing: "border-box",
                borderRadius: RADIUS,
                background: "transparent",
                border: `2px solid ${C.noiteRule}`,
                display: "flex",
                alignItems: "center",
                justifyContent: rail ? "flex-start" : "center",
                gap: 24,
                padding: rail ? "0 24px" : "0 12px",
                ...fade(frame, B.tabelas + i * 0.05, 0.4),
              }}
            >
              {g ? (
                <div
                  style={{
                    position: "absolute",
                    inset: -2,
                    borderRadius: RADIUS,
                    background: g.fill,
                    border: `2px solid ${g.edge}`,
                    opacity: lit,
                  }}
                />
              ) : null}
              <span
                style={{
                  position: "relative",
                  font: `600 20px/1 ${F.texto}`,
                  color: g && lit > 0.5 ? g.text : C.noiteTexto,
                  whiteSpace: "nowrap",
                }}
              >
                {t.name}
              </span>
              {t.desc ? (
                <span style={{ position: "relative", font: `400 20px/1 ${F.texto}`, color: C.noite2, whiteSpace: "nowrap" }}>
                  {t.desc}
                </span>
              ) : null}
            </div>
          );
        })}

        {/* the column that says where the station is: the cascade starts from it */}
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 424,
            font: `600 18px/1 ${F.texto}`,
            color: GREEN,
            whiteSpace: "nowrap",
            ...fade(frame, B.ligacao + 0.4, 0.35),
          }}
        >
          ID_BAIRRO
        </div>

        {/* legend: one entry per beat, in the colour of what lit up */}
        {[
          { at: B.ocorrencia, color: C.jacaClaro, head: "o que o morador viu", sub: "OCORRENCIA e CONFIRMACAO" },
          { at: B.alerta, color: GREEN, head: "o aviso que o sistema manda", sub: "ALERTA, ALERTA_BAIRRO e NOTIFICACAO" },
          {
            at: B.ligacao,
            color: GREEN,
            head: "as duas ligações da estação",
            sub: "ID_BAIRRO: onde ela fica\nESTACAO_BAIRRO: quem ela abastece",
          },
        ].map((l, i) => (
          <div key={l.head} style={{ position: "absolute", left: i * 576, top: 584, width: 512, ...fade(frame, l.at + 0.15) }}>
            <div style={{ font: `700 ${S.corpo}px/1.2 ${F.titulo}`, letterSpacing: "-0.01em", color: l.color }}>{l.head}</div>
            <div style={{ marginTop: 6, font: `400 22px/1.3 ${F.texto}`, color: C.noite2, whiteSpace: "pre-line" }}>{l.sub}</div>
          </div>
        ))}
      </div>

      <Note at={B.tabelas + 0.8} dark>13 tabelas no Oracle · script em docs/modelo-de-dados/alerta_bairro.sql</Note>
    </GsScene>
  );
};
