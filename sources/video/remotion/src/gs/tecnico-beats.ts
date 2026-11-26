// When each element of the technical-video motions enters, in SECONDS from the start of that motion.
// Estimated from roteiro-tecnico.md at John's measured pace (~2.6 words/s). After the narration is
// recorded (backlog E3.3), replace these numbers with the measured word times and re-render: the
// components read only from here.
//
// Full-screen inserts build in the first seconds and then HOLD, with ~1.5 s of spare tail, so the
// Premiere cut can end the shot on the next word without the animation being cut mid-way.
// Overlays (callouts, labels) are short independent clips: they draw in at 0 and hold, so John
// drops each one on V2 at the word that calls it.

import measured from "../data/gs-tecnico/beats.json";

const ESTIMATED = {
  // Opening (Abertura.tsx): the phone grows to the centre on "No app", goes aside on "Aqui, o motor".
  M00: { dur: 9, app: 1.8, motor: 4.6 },

  // T01 · "Esse é o Alertaí rodando, em Java e Oracle: uma falta de luz vai virar aviso de falta de água."
  M01: { dur: 3.5, logo: 0.1, luz: 0.7, estacao: 1.2, agua: 1.7 },

  // T02 · "Antes de codar, separamos em camadas: o menu só lê a opção, o serviço tem as regras, e só o DAO fala SQL."
  M02: { dur: 8.5, title: 0, entrada: -1, menu: 2.6, servico: 4.0, dao: 5.6, banco: 6.6, previsto: 7.0 },

  // T03 · "Aqui é como pensamos o banco: separar ocorrência, o que o morador viu, de alerta, o aviso que o sistema manda."
  M03: { dur: 9, title: 0, tabelas: 0.4, ocorrencia: 2.4, alerta: 4.6, ligacao: 6.2 },

  // T05 end · "...e três bairros recebem o aviso." (3 s insert)
  M05: { dur: 4.5, mapa: 0, luz: 0.2, setas: 0.8, bairros: 1.4 },

  // T07 · "Que dados a gente guarda? Nome e celular...; os bairros seguidos...; e o relato, ... e nunca mostrado."
  M07: { dur: 13.5, title: 0, nome: 1.4, bairros: 4.6, relato: 7.4, nunca: 10.6, lgpd: 11.2 },

  // T08 (last beat) · "...e PreparedStatement pra todo dado digitado."
  M08: { dur: 4.5, codigo: 0, marca: 0.6, legenda: 1.2 },

  // T09 · "Primeiro problema: cada vizinho criava uma ocorrência nova. Um índice único ignoraria a janela
  //        de horas do tipo, então a regra foi pro serviço, na mesma transação."
  M09: { dur: 9.5, title: 0, linha1: 0.8, linha2: 1.8, indice: 3.3, risco: 4.3, solucao: 6.2 },

  // T10 · "Segundo: o aviso de água repetiria a cada confirmação. Checar o alerta da ocorrência não bastava:
  //        outra queda de luz avisaria de novo. A trava virou o UPDATE: só desliga a estação que ainda está operando."
  M10: { dur: 10.5, title: 0, aviso1: 0.6, aviso2: 1.2, aviso3: 1.8, checar: 3.6, risco: 5.0, outra: 5.8, trava: 7.6 },

  // T11 · "Esse é o Alertaí. Código no GitHub."
  M11: { dur: 6, logo: 0.2, frase: 0.9, repo: 1.6, fecho: 2.2 },
} as const;

type Beats = { [K in keyof typeof ESTIMATED]: { [P in keyof (typeof ESTIMATED)[K]]: number } };

/**
 * The estimates above, overridden by the times measured on John's narration (scripts/gs-tecnico/build.py
 * writes data/gs-tecnico/beats.json). The GSTecnico edit and the standalone GS-M* compositions read the same.
 */
export const BEATS: Beats = Object.fromEntries(
  Object.entries(ESTIMATED).map(([k, v]) => [k, { ...v, ...((measured as Record<string, object>)[k] ?? {}) }]),
) as Beats;

/** Overlays: each label/callout is its own clip. Draw-in at 0, hold, quick fade at the end. */
export const OVERLAY_DUR = 4;
