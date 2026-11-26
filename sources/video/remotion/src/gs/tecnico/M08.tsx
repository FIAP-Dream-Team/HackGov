import React from "react";
import { useCurrentFrame } from "remotion";
import { fade, prog } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F, MARGIN, RADIUS } from "../tokens";
import { GsScene } from "../ui";

const B = BEATS.M08;

// T08, last beat · "...e PreparedStatement pra todo dado digitado."
// Literal excerpt of backend/src/main/java/br/com/alertabairro/dao/OcorrenciaDAO.java, lines 37–51
// (method inserir, clone at commit 633ae58), dedented by 8 spaces. Dark like the IntelliJ clips (B11–B16).
// The "?" placeholders and the setXxx calls light up; then the typed description is singled out.

const FIRST_LINE = 37;
const CODE = [
  'String sql = """',
  "        INSERT INTO OCORRENCIA (",
  "            ID_OCORRENCIA, ID_TIPO, ID_BAIRRO, ID_AUTOR, STATUS, SEVERIDADE,",
  "            DESCRICAO, CONFIRMACOES, CRIADA_EM, ULTIMA_CONFIRMACAO_EM",
  "        ) VALUES (?, ?, ?, ?, 'ATIVA', ?, ?, 1, SYSTIMESTAMP, SYSTIMESTAMP)",
  '        """;',
  "try (PreparedStatement comando = conexao.prepareStatement(sql)) {",
  "    comando.setLong(1, id);",
  "    comando.setLong(2, tipoId);",
  "    comando.setLong(3, bairroId);",
  "    comando.setLong(4, autorId);",
  "    comando.setInt(5, severidade);",
  "    comando.setString(6, descricao);",
  "    comando.executeUpdate();",
  "}",
];
const SQL_LINES = new Set([1, 2, 3, 4]); // inside the text block
const TYPED_LINE = 12; // setString(6, descricao): the text the person typed

const MONO = "Consolas, 'Cascadia Mono', 'Cascadia Code', monospace";
const FONT = 30;
const LH = 46;
const CODE_TOP = 192;

const Token: React.FC<{ text: string; on: number }> = ({ text, on }) => (
  <span
    style={{
      color: on > 0 ? C.jacaClaro : undefined,
      fontWeight: on > 0 ? 700 : undefined,
      background: `rgba(185, 164, 238, ${0.22 * on})`,
      borderRadius: 4,
    }}
  >
    {text}
  </span>
);

const renderLine = (line: string, idx: number, on: number) => {
  const parts = line.split(/(\?|set(?:Long|Int|String))/);
  return parts.map((p, i) =>
    p === "?" || /^set(Long|Int|String)$/.test(p) ? <Token key={i} text={p} on={on} /> : <React.Fragment key={i}>{p}</React.Fragment>,
  );
};

export const M08: React.FC = () => {
  const frame = useCurrentFrame();
  const marca = prog(frame, B.marca, 0.4);
  const typed = prog(frame, B.legenda, 0.4);

  return (
    <GsScene tone="tinta">
      <p
        style={{
          position: "absolute",
          left: MARGIN,
          top: 96,
          margin: 0,
          font: `500 24px/1.3 ${F.texto}`,
          color: C.noite2,
          ...fade(frame, B.codigo, 0.3),
        }}
      >
        dao/OcorrenciaDAO.java · método inserir
      </p>

      <div style={{ position: "absolute", left: MARGIN, top: CODE_TOP, ...fade(frame, B.codigo, 0.35) }}>
        {/* the line with the typed text gets a Jacarandá bar, the deck's single radius */}
        <div
          style={{
            position: "absolute",
            left: -24,
            top: TYPED_LINE * LH - 2,
            width: 1100,
            height: LH + 4,
            borderRadius: RADIUS,
            background: `rgba(91, 63, 168, ${0.55 * typed})`,
          }}
        />
        {CODE.map((line, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              height: LH,
              display: "flex",
              font: `400 ${FONT}px/${LH}px ${MONO}`,
              whiteSpace: "pre",
            }}
          >
            <span style={{ width: 72, color: "#6E6585", textAlign: "right", marginRight: 40 }}>{FIRST_LINE + i}</span>
            <span style={{ color: SQL_LINES.has(i) ? C.noite2 : C.noiteTexto }}>{renderLine(line, i, marca)}</span>
          </div>
        ))}
      </div>

      <p
        style={{
          position: "absolute",
          left: MARGIN,
          top: 912,
          margin: 0,
          font: `700 40px/1.2 ${F.titulo}`,
          letterSpacing: "-0.01em",
          ...fade(frame, B.legenda),
        }}
      >
        O dado digitado entra como <span style={{ color: C.jacaClaro }}>parâmetro</span>, nunca colado no SQL.
      </p>
    </GsScene>
  );
};
