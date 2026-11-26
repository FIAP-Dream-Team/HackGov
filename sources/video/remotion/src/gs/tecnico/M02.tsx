import React from "react";
import { useCurrentFrame } from "remotion";
import { draw, fade, prog } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F, MARGIN, RADIUS, S } from "../tokens";
import { GsScene, Note, Title } from "../ui";

const B = BEATS.M02;

// Dark, sober version (17/11): outlines only, the layer the voice names in Jacarandá-claro.
const ARROW = "#7D7399";
const LIT_FILL = "rgba(185,164,238,0.08)";

// T02 · "Antes de codar, separamos em camadas: o menu só lê a opção, o serviço tem as regras,
// e só o DAO fala SQL." Same arrows as docs/arquitetura/arquitetura.md of the repository:
// MenuPrincipal → services → DAOs → ConnectionFactory → Oracle. The layer the voice names is in
// Jacarandá; the others stay neutral. ExpiracaoService is drawn dashed and says it is not built.

// Diagram grid: 4 columns of 288 with 48 between them, rows every 176, boxes 88 high.
const X0 = 496;
const Y0 = 288;
const COL = 336;
const BW = 288;
const ROW = 176;
const BH = 88;
const cx = (c: number) => c * COL;
const ry = (r: number) => r * ROW;

type Layer = 0 | 1 | 2 | 3;
const LAYER_AT: Record<Layer, number> = { 0: B.menu, 1: B.servico, 2: B.dao, 3: B.banco };
/**
 * When each row and its arrows come in. With B.entrada >= 0 the whole diagram builds at once, a row every
 * 0.3 s from that beat, and only the highlight follows the voice (LAYER_AT); otherwise rows enter on their word.
 */
const ENTER_AT = (r: Layer) => (B.entrada >= 0 ? B.entrada + r * 0.3 : LAYER_AT[r]);

/** 0..1 how much a layer is "the one being talked about" right now (only menu, serviço, DAO). */
const litOf = (frame: number, layer: Layer) => {
  if (layer === 3) return 0;
  const on = prog(frame, LAYER_AT[layer], 0.35);
  const next = layer === 2 ? Infinity : LAYER_AT[(layer + 1) as Layer];
  const off = next === Infinity ? 0 : prog(frame, next, 0.35);
  return on * (1 - off);
};

const LABELS: { name: string; role: string }[] = [
  { name: "Menu", role: "lê a opção e chama o serviço" },
  { name: "Serviço", role: "tem as regras: agrupar, confirmar e a cascata" },
  { name: "DAO", role: "só ele fala SQL, com PreparedStatement" },
  { name: "Banco", role: "uma conexão, aberta num lugar só" },
];

const Box: React.FC<{
  x: number;
  y: number;
  w?: number;
  lit: number;
  dashed?: boolean;
  children: React.ReactNode;
}> = ({ x, y, w = BW, lit, dashed = false, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: BH,
      boxSizing: "border-box",
      borderRadius: RADIUS,
      background: "transparent",
      border: dashed ? `2px dashed ${C.contexto}` : `2px solid ${C.noiteRule}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: dashed ? "0 16px" : "0 24px",
    }}
  >
    {/* highlight layer: fill and a 3px Jacarandá edge, faded in so the box never changes size */}
    <div
      style={{
        position: "absolute",
        inset: -2,
        borderRadius: RADIUS,
        background: LIT_FILL,
        border: `2px solid ${C.jacaClaro}`,
        opacity: lit,
      }}
    />
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

const ClassName: React.FC<{ lit: number; muted?: boolean; children: React.ReactNode }> = ({
  lit,
  muted = false,
  children,
}) => (
  <div
    style={{
      font: `600 ${S.rotulo}px/1.2 ${F.texto}`,
      color: lit > 0.5 ? C.jacaClaro : muted ? C.noite2 : C.noiteTexto,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** Straight or elbow arrow in diagram coordinates; head drawn at the last point. */
const Arrow: React.FC<{ pts: [number, number][]; at: number; dashed?: boolean }> = ({ pts, at, dashed = false }) => {
  const frame = useCurrentFrame();
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const [x1, y1] = pts[pts.length - 2];
  const [x2, y2] = pts[pts.length - 1];
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = 12;
  const head = `M${x2 - h * Math.cos(ang - 0.5)} ${y2 - h * Math.sin(ang - 0.5)} L${x2} ${y2} L${x2 - h * Math.cos(ang + 0.5)} ${y2 - h * Math.sin(ang + 0.5)}`;
  const line = draw(frame, at, 0.4);
  return (
    <g stroke={dashed ? C.contexto : ARROW} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {dashed ? (
        <path d={d} strokeDasharray="8 8" style={{ opacity: prog(frame, at, 0.4) }} />
      ) : (
        <path d={d} pathLength={1} style={line} />
      )}
      <path d={head} style={{ opacity: prog(frame, at + 0.3, 0.2) }} />
    </g>
  );
};

export const M02: React.FC = () => {
  const frame = useCurrentFrame();
  const lit = [0, 1, 2, 3].map((l) => litOf(frame, l as Layer));
  const rowIn = (r: Layer) => fade(frame, ENTER_AT(r), 0.4);

  return (
    <GsScene tone="tinta">
      <Title at={B.title}>Cada camada faz uma coisa</Title>

      {/* left column: layer name and its job, aligned with the boxes */}
      {LABELS.map((l, r) => (
        <div
          key={l.name}
          style={{ position: "absolute", left: MARGIN, top: Y0 + ry(r), width: 320, ...rowIn(r as Layer) }}
        >
          <div
            style={{
              font: `700 36px/1.15 ${F.titulo}`,
              letterSpacing: "-0.01em",
              color: lit[r] > 0.5 ? C.jacaClaro : C.noiteTexto,
            }}
          >
            {l.name}
          </div>
          <div style={{ marginTop: 8, font: `400 ${S.rotulo}px/1.3 ${F.texto}`, color: lit[r] > 0.5 ? C.noiteTexto : C.noite2 }}>
            {l.role}
          </div>
        </div>
      ))}

      <div style={{ position: "absolute", left: X0, top: Y0, width: 1296, height: 640 }}>
        <svg width={1296} height={640} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* menu → OcorrenciaService, and the dashed call to the planned ExpiracaoService */}
          <Arrow pts={[[cx(0) + 144, BH], [cx(0) + 144, ry(1)]]} at={ENTER_AT(1)} />
          <Arrow pts={[[cx(0) + BW, 44], [cx(3) + 144, 44], [cx(3) + 144, ry(1)]]} at={ENTER_AT(1) + 0.2} dashed />
          {/* OcorrenciaService → CascataService → NotificacaoService */}
          <Arrow pts={[[cx(0) + BW, ry(1) + 44], [cx(1), ry(1) + 44]]} at={ENTER_AT(1) + 0.25} />
          <Arrow pts={[[cx(1) + BW, ry(1) + 44], [cx(2), ry(1) + 44]]} at={ENTER_AT(1) + 0.4} />
          {/* services → DAOs */}
          {[0, 1, 2].map((c) => (
            <Arrow key={c} pts={[[cx(c) + 144, ry(1) + BH], [cx(c) + 144, ry(2)]]} at={ENTER_AT(2) + c * 0.08} />
          ))}
          <Arrow pts={[[cx(3) + 144, ry(1) + BH], [cx(3) + 144, ry(2)]]} at={ENTER_AT(2) + 0.24} dashed />
          {/* DAOs → ConnectionFactory → Oracle */}
          <Arrow pts={[[cx(0) + 144, ry(2) + BH], [cx(0) + 144, ry(3)]]} at={ENTER_AT(3)} />
          <Arrow pts={[[cx(0) + BW, ry(3) + 44], [cx(1), ry(3) + 44]]} at={ENTER_AT(3) + 0.2} />
        </svg>

        <div style={rowIn(0)}>
          <Box x={cx(0)} y={ry(0)} lit={lit[0]}>
            <ClassName lit={lit[0]}>MenuPrincipal</ClassName>
          </Box>
        </div>

        <div style={rowIn(1)}>
          {["OcorrenciaService", "CascataService", "NotificacaoService"].map((n, c) => (
            <Box key={n} x={cx(c)} y={ry(1)} lit={lit[1]}>
              <ClassName lit={lit[1]}>{n}</ClassName>
            </Box>
          ))}
          <Box x={cx(3)} y={ry(1)} lit={0} dashed>
            <ClassName lit={0} muted>
              ExpiracaoService
            </ClassName>
            <div style={{ marginTop: 4, font: `500 18px/1.2 ${F.texto}`, color: C.noite2, whiteSpace: "nowrap" }}>
              previsto, não implementado
            </div>
          </Box>
        </div>

        <div style={rowIn(2)}>
          <Box x={0} y={ry(2)} w={1296} lit={lit[2]}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24, whiteSpace: "nowrap" }}>
              <ClassName lit={lit[2]}>DAOs</ClassName>
              <span style={{ font: `400 22px/1.2 ${F.texto}`, color: C.noite2 }}>
                OcorrenciaDAO · ConfirmacaoDAO · EstacaoDAO · AlertaDAO · NotificacaoDAO · …
              </span>
            </div>
          </Box>
        </div>

        <div style={rowIn(3)}>
          <Box x={cx(0)} y={ry(3)} lit={0}>
            <ClassName lit={0}>ConnectionFactory</ClassName>
          </Box>
          <Box x={cx(1)} y={ry(3)} lit={0}>
            <ClassName lit={0}>Oracle</ClassName>
          </Box>
        </div>
      </div>

      <Note at={B.previsto} dark>
        Pacote br.com.alertabairro · o ExpiracaoService está no diagrama da arquitetura e ainda não no código.
      </Note>
    </GsScene>
  );
};
