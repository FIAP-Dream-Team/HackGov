import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fade, prog } from "../anim";
import { BEATS } from "../tecnico-beats";
import { C, F } from "../tokens";
import { GsScene, Note, Title } from "../ui";
import { Code, Frame, Lead, Row, RightCol, Rule, Struck } from "./problema";

const B = BEATS.M09;

// T09 · problem 1 (documentation 10.5): every neighbour opened a new OCORRENCIA.
// Left: two identical rows fold into one with 2 confirmations; under it, the code that does it.
// Right: the unique index we weighed, struck, with why; then where the rule went.

const COLS = [48, 196, 196, 104, 156];
const HEAD = ["ID", "TIPO", "BAIRRO", "STATUS", "CONFIRMACOES"];

const Cells: React.FC<{ cells: React.ReactNode[]; head?: boolean }> = ({ cells, head = false }) => (
  <>
    {cells.map((c, i) => (
      <div
        key={i}
        style={{
          width: COLS[i],
          flex: "none",
          textAlign: i === 4 ? "right" : "left",
          font: head ? `500 20px/1 ${F.mono}` : `400 26px/1 ${F.mono}`,
          color: head ? C.noite2 : C.noiteTexto,
          whiteSpace: "nowrap",
        }}
      >
        {c}
      </div>
    ))}
  </>
);

const Confirmacoes: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, B.solucao + 0.35, 0.4);
  return (
    <span style={{ position: "relative", display: "inline-block", width: "1ch" }}>
      <span style={{ position: "absolute", right: 0, opacity: 1 - p }}>1</span>
      <span
        style={{
          position: "absolute",
          right: 0,
          opacity: p,
          color: C.jacaClaro,
          fontWeight: 700,
          transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
        }}
      >
        2
      </span>
      <span style={{ visibility: "hidden" }}>1</span>
    </span>
  );
};

export const M09: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <GsScene tone="tinta">
      <Title at={B.title}>Primeiro problema: o relato duplicado</Title>

      <Lead style={{ position: "absolute", left: 128, top: 288, ...fade(frame, B.linha1 - 0.2) }}>
        tabela OCORRENCIA, depois de dois vizinhos relatarem
      </Lead>
      <Frame top={336}>
        <Row at={B.linha1 - 0.2} height={56} first>
          <Cells head cells={HEAD} />
        </Row>
        <Row at={B.linha1} height={72}>
          <Cells cells={["1", "Falta de luz", "Arquipelago", "ATIVA", <Confirmacoes key="c" />]} />
        </Row>
        <Row at={B.linha2} height={72} collapseAt={B.solucao}>
          <Cells cells={["2", "Falta de luz", "Arquipelago", "ATIVA", "1"]} />
        </Row>
      </Frame>

      <Lead style={{ position: "absolute", left: 128, top: 528, ...fade(frame, B.solucao + 0.6) }}>
        OcorrenciaService.registrar
      </Lead>
      <Code
        top={576}
        at={B.solucao + 0.6}
        markAt={B.solucao + 1.0}
        lines={[
          [{ t: "return ", k: "kw" }, { t: "Transacao.executar", k: "mark" }, { t: "(conexao -> {" }],
          [{ t: "    Ocorrencia ativa = ocorrenciaDAO" }],
          [{ t: "        " }, { t: ".buscarAtivaNaJanela", k: "mark" }, { t: "(conexao, tipo.getId()," }],
          [{ t: "            bairro.getId(), tipo.getHorasExpiracao())" }],
          [{ t: "    // achou? o relato entra como confirmação", k: "dim" }],
        ]}
      />

      <RightCol top={288}>
        <Lead style={fade(frame, B.indice)}>alternativa avaliada</Lead>
        <div style={fade(frame, B.indice)}>
          <Struck strikeAt={B.risco}>Índice único de tipo e bairro</Struck>
        </div>
        <p style={{ margin: "16px 0 0", font: `400 28px/1.35 ${F.texto}`, color: C.noite2, ...fade(frame, B.risco + 0.3) }}>
          ignora a janela de horas do tipo: um relato fora do prazo é outro evento
        </p>
        <Rule at={B.solucao} />
        <Lead style={fade(frame, B.solucao)}>solução</Lead>
        <p
          style={{
            margin: "8px 0 0",
            font: `700 40px/1.2 ${F.titulo}`,
            letterSpacing: "-0.01em",
            textWrap: "balance",
            ...fade(frame, B.solucao + 0.2),
          }}
        >
          A regra foi para o <span style={{ color: C.jacaClaro }}>serviço</span>, na mesma transação
        </p>
        <p style={{ margin: "16px 0 0", font: `400 28px/1.35 ${F.texto}`, color: C.noite2, ...fade(frame, B.solucao + 0.5) }}>
          dois vizinhos, uma ocorrência com duas confirmações
        </p>
      </RightCol>

      <Note at={B.linha1} dark>Ilustração do erro com os dados da demonstração. Alternativas e solução: seção 10.5 da documentação.</Note>
    </GsScene>
  );
};
