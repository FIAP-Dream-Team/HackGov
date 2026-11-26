import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fade, out } from "../anim";
import { OVERLAY_DUR } from "../tecnico-beats";
import { C, F, MARGIN, RADIUS, S, sec } from "../tokens";
import { Callout } from "../ui";

// Overlays for the V2 track of the Premiere sequence (ProRes 4444 with alpha). One clip per
// callout/label, drawn in at 0, held, and faded at the end; John drops each on the word that calls it.
// Coordinates are measured on the 1920×1080 pre-cuts in sources/video/global-solution/bruto/
// (ink profile of the frame, 12–16 px of air where the neighbouring line allows it; console lines
// are 34–35 px apart, so there the edge sits in the middle of the gap).
//
// They match the pre-cut at 100 %. If the take gets a zoom in Premiere, nest take + overlay (or give
// the overlay the same Scale/Position) so the box follows the text.

type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  labelSide?: "top" | "bottom" | "right" | "left";
  at?: number;
};

export type OverlaySpec = {
  id: string;
  /** Which take and moment it sits on, for the Premiere cut. */
  sobre: string;
  boxes: Box[];
  /** Label with no box, top-right corner of the frame (the console text is on the left). */
  rotulo?: string;
  /** Label placed by hand where the Callout's own label would touch the neighbouring line. */
  tags?: { text: string; x: number; y: number; at?: number }[];
};

export const OVERLAYS: OverlaySpec[] = [
  // --- M04 · console --------------------------------------------------------------------------
  {
    id: "GS-M04a-relato1",
    sobre: "docker/A1-take-unico.mp4, 0:15,3–0:18,5 (B02: Ocorrencia gravada, Confirmacoes: 1)",
    boxes: [
      { x: 26, y: 430, w: 334, h: 56, label: "relato 1", labelSide: "right" },
      { x: 28, y: 675, w: 278, h: 35, at: 0.25 },
    ],
  },
  {
    id: "GS-M04b-confirmacao",
    sobre: "docker/A1-take-unico.mp4, 0:20,8–0:28,7 (B03: Relato entrou na ocorrencia ativa, Confirmacoes: 2)",
    boxes: [
      { x: 26, y: 326, w: 590, h: 54, label: "virou confirmação", labelSide: "right" },
      { x: 28, y: 573, w: 278, h: 35, at: 0.25 },
    ],
  },
  {
    id: "GS-M04c-cascata",
    sobre: "docker/A1-take-unico.mp4, 0:20,8–0:28,7 (B03: as três linhas da cascata)",
    boxes: [{ x: 26, y: 679, w: 1145, h: 108, label: "cascata", labelSide: "right" }],
  },
  {
    id: "GS-M04d-sem-aviso",
    sobre: "console-a3/A3-take-unico.mp4, 0:05,2–0:09,7 (B04: Confirmacoes: 3, sem linha de aviso)",
    // Label raised 13 px: centred on the box it would touch "Descricao: Caiu a luz..." below.
    boxes: [{ x: 28, y: 661, w: 288, h: 36 }],
    tags: [{ text: "nenhum aviso novo", x: 340, y: 638, at: 0.15 }],
  },
  {
    id: "GS-M04e-resolvida",
    sobre: "console-a3/A3-take-unico.mp4, 0:20,3–0:26 (terceiro Ja voltou: Status: RESOLVIDA)",
    // Label lowered 16 px: centred on the box it would graze "Bairro: Arquipelago" above.
    boxes: [{ x: 28, y: 561, w: 326, h: 30 }],
    tags: [{ text: "3 · já voltou → resolvida", x: 378, y: 566, at: 0.15 }],
  },

  // --- M06 · persistência (DBeaver, A2 v2) ---------------------------------------------------
  {
    id: "GS-M06a-insercao",
    sobre: "banco/A2-take-unico.mp4, 0:24,7–0:27,3 (B07: a ocorrência ATIVA, 2 confirmações)",
    boxes: [{ x: 303, y: 587, w: 876, h: 24, label: "inserção", labelSide: "bottom" }],
  },
  {
    id: "GS-M06b-atualizacao",
    sobre: "banco/A2-take-unico.mp4, 0:31,8–0:34,7 (B08: célula SEM_ENERGIA)",
    boxes: [{ x: 536, y: 588, w: 121, h: 21, label: "atualização", labelSide: "bottom" }],
  },
  {
    id: "GS-M06c-consulta",
    sobre: "banco/A2-take-unico.mp4, 0:46,8–0:49,8 (B09a: alerta CASCATA, 3 notificações)",
    boxes: [{ x: 303, y: 587, w: 764, h: 24, label: "consulta", labelSide: "bottom" }],
  },
  {
    id: "GS-M06d-taxa",
    sobre: "banco/A2-take-unico.mp4, 1:02,2–1:05,4 (B10: 1 · 1 · 100)",
    boxes: [{ x: 303, y: 658, w: 424, h: 24, label: "indicador I2 · dados da demonstração", labelSide: "bottom" }],
  },
  {
    id: "GS-M06e-atualizacao-consulta",
    sobre: "console-a3/A3-take-unico.mp4, fecho (B05 e opção 3): só rótulo, canto superior direito",
    boxes: [],
    rotulo: "atualização · consulta",
  },

  // --- M12 · enum ↔ CHECK ----------------------------------------------------------------------
  // The same three values boxed in both editors, one box per value, same stagger: the eye follows
  // OPERANDO / SEM_ENERGIA / DESLIGADA across the IntelliJ → VS Code cut.
  {
    id: "GS-M12a-enum",
    sobre: "codigo/B12a-enum-statusestacao.mp4, de 0:02,2 ao fim (5,3 s), depois do zoom",
    boxes: [
      { x: 288, y: 456, w: 252, h: 66 },
      { x: 288, y: 600, w: 330, h: 66, at: 0.15, label: "enum StatusEstacao", labelSide: "right" },
      { x: 288, y: 744, w: 262, h: 66, at: 0.3 },
    ],
  },
  {
    id: "GS-M12b-check",
    sobre: "codigo/B12b-check-sql.mp4, de 0:03,0 ao fim (5,4 s), depois do zoom",
    boxes: [
      { x: 1077, y: 538, w: 202, h: 54, label: "CHECK no Oracle", labelSide: "bottom" },
      { x: 1322, y: 538, w: 258, h: 54, at: 0.15 },
      { x: 1618, y: 538, w: 225, h: 54, at: 0.3 },
    ],
  },
];

/** Label block, same look as the Callout label. Default place: top-right at the deck margin (M06e). */
const Tag: React.FC<{ text: string; x?: number; y?: number; at?: number }> = ({ text, x, y, at = 0 }) => {
  const frame = useCurrentFrame();
  const place: React.CSSProperties = x === undefined ? { right: MARGIN, top: 88 } : { left: x, top: y };
  return (
    <div
      style={{
        position: "absolute",
        ...place,
        height: 56,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        background: C.tinta,
        border: `2px solid ${C.jacaClaro}`,
        borderRadius: RADIUS,
        color: C.noiteTexto,
        font: `700 ${S.corpo}px/1 ${F.titulo}`,
        whiteSpace: "nowrap",
        ...fade(frame, at, 0.35),
      }}
    >
      {text}
    </div>
  );
};

export const Overlay: React.FC<{ spec: OverlaySpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(frame, sec(OVERLAY_DUR), 0.3) }}>
      {spec.boxes.map((b, i) => (
        <Callout key={i} {...b} at={b.at ?? 0} />
      ))}
      {spec.rotulo ? <Tag text={spec.rotulo} /> : null}
      {spec.tags?.map((t, i) => <Tag key={`t${i}`} {...t} />)}
    </AbsoluteFill>
  );
};
