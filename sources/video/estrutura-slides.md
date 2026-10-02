**Slide 1 — Capa**

[header] HackGov — Minha Vez

[card] Agendamento e acompanhamento de encaminhamentos: UBS → atenção especializada

[footer] Equipe: John Vitor · Ana Larissa · João Pedro · Vinícius Cardoso · Brenda Araújo

---

**Slide 2 — O Problema**

[header] O paciente "some" entre a UBS e o especialista

[bullets]

- Falta de rastreabilidade no encaminhamento (papel, ligação, sistema paralelo)
- 1 em cada 3 brasileiros da Classe C já desistiu de uma consulta demorada (Instituto Locomotiva)
- TCU aponta falta de padronização de dados como gargalo de visibilidade
[footer] Fonte: Instituto Locomotiva / Auditoria TCU

---

**Slide 3 — Requisitos Funcionais**

[header] O que o sistema faz na prática

[cards] (5 cards curtos, um por RF)

- RF01 — Identificação sem senha (Cartão SUS/CPF no totem)
- RF02 — Acompanhamento do status do encaminhamento
- RF03 — Agendamento do horário disponível
- RF04 — Chamada na sala de espera (senha + sala)
- RF05 — Painel gerencial da equipe/gestor

---

**Slide 4 — Requisitos Não Funcionais**

[header] Qualidade e segurança do sistema

[cards] (2 cards)

- RNF01 — Controle de acesso por perfil: dado clínico só no canal institucional
- RNF02 — Acessibilidade: fonte grande, leitura em voz alta
[footer] Restrições vindas do brainstorm: informação de fácil acesso, escopo enxuto

---

**Slide 5 — Landing Page**

[header] Minha Vez — apresentação do produto

[card] Print/mockup da landing page do projeto

[footer] Identidade visual: as 3 cores que escolhemos pro projeto

---

**Slide 6 — Matriz GUT**

[header] Priorização do Backlog (Gravidade × Urgência × Tendência)

[card] Tabela completa

| US | G | U | T | Pontuação | Prioridade |
| --- | --- | --- | --- | --- | --- |
| US01 — Identificação | 5 | 5 | 5 | 125 | 1ª |
| US02 — Status | 5 | 4 | 5 | 100 | 2ª |
| US03 — Agendamento | 5 | 5 | 4 | 100 | 2ª |
| US05 — Painel gerencial | 4 | 3 | 4 | 48 | 4ª |
| US04 — Sala de espera | 3 | 3 | 3 | 27 | 5ª |

---

**Slide 7 — Ranking de Prioridades**

[header] Ordem de desenvolvimento

[card] Pódio/ranking visual: 1º US01 → 2º US02/US03 (empate) → 4º US05 → 5º US04

[footer] US01 é pré-requisito técnico de toda a plataforma

---

**Slide 8 — Tempo de Espera por Especialidade**

[header] Onde está o gargalo operacional

[card] Gráfico de barras: Ortopedia 180 dias · Cardiologia 120 dias · Oftalmologia 90 dias · Oncologia 25 dias

[footer] Meta nacional: até 30 dias

---

**Slide 9 — Distribuição de Atendimentos**

[header] Urgência vs. Eletivo

[card] Gráfico de pizza: 72,5% eletivos / 27,5% urgentes

[card] Proporção de urgência por especialidade: Ortopedia 15% · Cardiologia 10% · Oftalmologia 5% · Oncologia 80%

---

**Slide 10 — Decisões Estratégicas**

[header] Da análise de dados à ação

[bullets]

- Gargalo: faltas acima de 40% nas especialidades com maior espera
- Oncologia é referência: triagem eficiente, 5% de faltas, 25 dias
[cards] (2 propostas)
- Confirmação ativa 48h antes (SMS/WhatsApp/app)
- Realocação de verba para mutirões em Ortopedia/Cardiologia

---

**Slide 11 — Antes x Depois**

[header] Transformação Digital

[cards] (2 colunas comparativas)

- Antes: fila estática, invisível, retrabalho manual da UBS
- Depois: fluxo dinâmico, cidadão com transparência, equipe com produtividade

---

**Slide 12 — Riscos e Mitigações**

[header] O que pode dar errado — e como resolvemos

[cards] (2 colunas)

- Risco 1: barreira tecnológica/letramento digital → Mitigação: totens + RNF02 (acessibilidade)
- Risco 2: exposição de dados sensíveis (LGPD) → Mitigação: RNF01 (controle de acesso) + senha anonimizada (RF04)

---

**Slide 13 — Encerramento**

[header] Minha Vez

[card] Logo/mascote + paleta de cores do projeto

[footer] Obrigado!