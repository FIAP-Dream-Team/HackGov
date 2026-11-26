import React from "react";
import { useCurrentFrame } from "remotion";
import { fade, prog } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F, MARGIN, S } from "../tokens";
import { GsScene, Note, Title } from "../ui";

const B = BEATS.M07;

const MARK = "rgba(185,164,238,0.32)";

// T07 · "Que dados a gente guarda? Nome e celular, pra cada um contar uma vez; os bairros seguidos,
// pra saber quem avisar; e o relato, com o autor salvo só pra evitar voto repetido, e nunca mostrado."
// Content from section 14.4 of the project documentation. Table with 1 px rules, not cards.
// Rule of content: registration with name and phone is PLANNED, not implemented.

const COLS = [
  { x: 0, w: 432 },
  { x: 480, w: 520 },
  { x: 1048, w: 616 },
];

export const M07: React.FC = () => {
  const frame = useCurrentFrame();
  const hl = prog(frame, B.nunca, 0.5) * 100;

  const rows: { at: number; dado: string; detalhe: string; para: string; cuidado: React.ReactNode }[] = [
    {
      at: B.nome,
      dado: "Nome e celular",
      detalhe: "no cadastro previsto, ainda não implementado",
      para: "cada pessoa conta uma vez só nas confirmações",
      cuidado: "não aparecem para os outros usuários",
    },
    {
      at: B.bairros,
      dado: "Bairros seguidos",
      detalhe: "com apelido: casa, trabalho",
      para: "saber quem avisar quando o bairro é afetado",
      cuidado: "visíveis só para a própria pessoa",
    },
    {
      at: B.relato,
      dado: "Relato",
      detalhe: "tipo, bairro, gravidade, descrição",
      para: "montar a ocorrência e disparar a cascata",
      cuidado: (
        <>
          o autor fica salvo só para evitar voto repetido, e é{" "}
          <span
            style={{
              color: C.noiteTexto,
              fontWeight: 600,
              whiteSpace: "nowrap",
              padding: "0 .06em",
              // Dark version: a translucent Jacarandá-claro marker under light text (white on it stays above 7:1).
              background: `linear-gradient(${MARK}, ${MARK}) no-repeat 0 100% / ${hl}% .5em`,
            }}
          >
            nunca mostrado
          </span>
        </>
      ),
    },
  ];

  return (
    <GsScene tone="tinta">
      <Title at={B.title}>Que dados a gente guarda</Title>

      <div style={{ position: "absolute", left: MARGIN, right: MARGIN, top: 288 }}>
        {/* column heads: plain text, same size as the labels of the deck */}
        <div style={{ position: "relative", height: 48, ...fade(frame, B.title + 0.2) }}>
          {["Dado", "Para quê", "Cuidado"].map((h, i) => (
            <span
              key={h}
              style={{ position: "absolute", left: COLS[i].x, top: 0, font: `500 ${S.rotulo}px/1.3 ${F.texto}`, color: C.noite2 }}
            >
              {h}
            </span>
          ))}
        </div>

        {rows.map((r) => (
          <div
            key={r.dado}
            style={{ position: "relative", height: 176, borderTop: `1px solid ${C.noiteRule}`, ...fade(frame, r.at) }}
          >
            <div style={{ position: "absolute", left: COLS[0].x, top: 32, width: COLS[0].w }}>
              <div style={{ font: `700 40px/1.1 ${F.titulo}`, letterSpacing: "-0.01em" }}>{r.dado}</div>
              <div style={{ marginTop: 8, font: `400 ${S.rotulo}px/1.3 ${F.texto}`, color: C.noite2 }}>{r.detalhe}</div>
            </div>
            <p style={{ position: "absolute", left: COLS[1].x, top: 32, width: COLS[1].w, margin: 0, font: `400 ${S.corpo}px/1.35 ${F.texto}` }}>
              {r.para}
            </p>
            <p
              style={{
                position: "absolute",
                left: COLS[2].x,
                top: 32,
                width: COLS[2].w,
                margin: 0,
                font: `400 ${S.corpo}px/1.35 ${F.texto}`,
                color: C.noite2,
              }}
            >
              {r.cuidado}
            </p>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.noiteRule}`, ...fade(frame, B.relato) }} />
      </div>

      <Note at={B.lgpd} dark>Previsto (LGPD): consultar, corrigir e excluir a conta e os dados. Fonte: documentação do projeto, seção 14.4.</Note>
    </GsScene>
  );
};
