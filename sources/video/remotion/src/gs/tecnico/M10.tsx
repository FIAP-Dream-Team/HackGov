import React from "react";
import { useCurrentFrame } from "remotion";
import { fade } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F } from "../tokens";
import { Disc, GsScene, Note, Title } from "../ui";
import { Code, Frame, Lead, Row, RightCol, Rule, Struck } from "./problema";

const B = BEATS.M10;

// T10 · problem 2 (documentation 10.5): the water warning fired again on every confirmation.
// Left: three identical warnings fold into one; under it, the UPDATE that is the lock (EstacaoDAO).
// Right: "check the occurrence's alert", struck, with why; then the lock.

const AVISOS = [
  { at: B.aviso1, quando: "na 2ª confirmação" },
  { at: B.aviso2, quando: "na 3ª confirmação" },
  { at: B.aviso3, quando: "na 4ª confirmação" },
];

export const M10: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <GsScene tone="tinta">
      <Title at={B.title}>Segundo problema: o aviso repetido</Title>

      <Lead style={{ position: "absolute", left: 128, top: 288, ...fade(frame, B.aviso1 - 0.2) }}>
        avisos gerados pela falta de luz no Arquipelago
      </Lead>
      <Frame top={336}>
        {AVISOS.map((a, i) => (
          <Row key={i} at={a.at} height={96} first={i === 0} collapseAt={i === 0 ? undefined : B.trava}>
            <Disc name="aviso" size={56} style={{ flex: "none" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: `700 28px/1.2 ${F.titulo}`, letterSpacing: "-0.01em" }}>Possível falta de água</div>
              <div style={{ marginTop: 4, font: `400 22px/1.3 ${F.texto}`, color: C.noite2, whiteSpace: "nowrap" }}>
                Menino Deus, Praia de Belas, Centro Histórico
              </div>
            </div>
            <div style={{ flex: "none", font: `500 22px/1.3 ${F.texto}`, color: C.noite2 }}>{a.quando}</div>
          </Row>
        ))}
      </Frame>

      <Lead style={{ position: "absolute", left: 128, top: 480, ...fade(frame, B.trava + 0.6) }}>
        EstacaoDAO.marcarSemEnergia
      </Lead>
      <Code
        top={528}
        at={B.trava + 0.6}
        markAt={B.trava + 1.0}
        lines={[
          [{ t: "UPDATE", k: "kw" }, { t: " ESTACAO_BOMBEAMENTO" }],
          [{ t: "SET", k: "kw" }, { t: " STATUS = ?" }],
          [
            { t: "WHERE", k: "kw" },
            { t: " ID_ESTACAO = ? " },
            { t: "AND", k: "kw" },
            { t: " TIPO = ? " },
            { t: "AND", k: "kw" },
            { t: " " },
            { t: "STATUS = ?", k: "mark" },
          ],
          [{ t: "comando.setString(4, StatusEstacao." }, { t: "OPERANDO", k: "mark" }, { t: ".name());" }],
          [{ t: "return", k: "kw" }, { t: " comando.executeUpdate() == 1;" }],
        ]}
      />

      <RightCol top={288}>
        <Lead style={fade(frame, B.checar)}>alternativa avaliada</Lead>
        <div style={fade(frame, B.checar)}>
          <Struck strikeAt={B.risco}>Checar o alerta da ocorrência</Struck>
        </div>
        <p style={{ margin: "16px 0 0", font: `400 28px/1.35 ${F.texto}`, color: C.noite2, ...fade(frame, B.outra) }}>
          outra queda de luz no mesmo bairro avisaria de novo
        </p>
        <Rule at={B.trava} />
        <Lead style={fade(frame, B.trava)}>solução</Lead>
        <p
          style={{
            margin: "8px 0 0",
            font: `700 40px/1.2 ${F.titulo}`,
            letterSpacing: "-0.01em",
            textWrap: "balance",
            ...fade(frame, B.trava + 0.2),
          }}
        >
          A trava virou o <span style={{ color: C.jacaClaro }}>UPDATE</span>
        </p>
        <p style={{ margin: "16px 0 0", font: `400 28px/1.35 ${F.texto}`, color: C.noite2, ...fade(frame, B.trava + 0.5) }}>
          só desliga a estação que ainda está{" "}
          <span style={{ font: `600 26px/1 ${F.mono}`, color: C.jacaClaro }}>OPERANDO</span>: um aviso por estação
        </p>
      </RightCol>

      <Note at={B.aviso1} dark>Ilustração do erro com os dados da demonstração. Alternativas e solução: seção 10.5 da documentação.</Note>
    </GsScene>
  );
};
