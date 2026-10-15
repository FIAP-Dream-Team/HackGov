# Roteiro — Fase 2 (fala)

A narração manda nos números da tela. O PDF original traz 65% no slide de
probabilidade (35% Ortopedia + 30% Cardiologia); a fala diz **60%** e
**cerca de 56**. O vídeo usa os números da fala.

Duração planejada: 5:00. Troca quando o áudio real existir.

---

### 1. ABERTURA (0:00 - 0:25)

*[slides 1 e 2]*

**[John]:**

"E aí, pessoal! Somos a equipe do HackGov: eu, John, Ana Larissa, João Pedro, Vinícius e Brenda. Na Fase 1, escolhemos o problema: o encaminhamento da UBS para a atenção especializada, onde o paciente 'some'. Agora aprofundamos a solução do Minha Vez: refinamos o backlog, modelamos o sistema, prototipamos a jornada do cidadão e analisamos os dados. Vamos ver cada etapa."

### 2. PARTE 1: BACKLOG REFINADO E SPRINT 1 (0:26 - 1:20)

*[slides 3, 4 e 5]*

**[Larissa]:**

"Na Fase 2 refinamos o backlog. Corrigimos contradições da Fase 1: a ausência de senha vale só no totem, enquanto o app usa CPF e senha ou Gov.br, e o cancelamento ganhou regra objetiva, até 24 horas antes e no máximo dois reagendamentos. Cada story passou a ter escopo, critérios de aceitação e exceções. Mantivemos a matriz GUT e criamos um desempate: vem primeiro a story da qual a outra depende, então a US02 antecede a US03.
 A Sprint 1 dura duas semanas e vai entregar o fluxo do cidadão, com 19 tarefas e 47 horas de uma capacidade de 48. Para acompanhar, usamos quatro métricas: esforço estimado versus realizado, burndown, taxa de conclusão e taxa de retrabalho."

*[exibir slide 4 (tabela GUT) durante o trecho do desempate]*

### 3. PARTE 2: MODELAGEM UML (1:21 - 2:15)

*[slides 6 e 7]*

**[João Pedro]:**

"Na Parte 2, modelamos o sistema com quatro diagramas UML. O de casos de uso mostra os três atores: cidadão, equipe e gestor da UBS. O de atividades detalha o fluxo de agendamento, com exceções como dados inválidos, ausência de encaminhamento e falta de horários. O de classes organiza o domínio: o Encaminhamento coordena o agendamento e a classe HistoricoStatus registra cada mudança de etapa. E o de sequência mostra a US03, inclusive quando outro cidadão ocupa o horário antes da confirmação. Por ser um serviço público de saúde, a modelagem cuida de rastreabilidade, controle de acesso a dados sensíveis e consistência das vagas."

*[opcional: se já houver código Java, incluir aqui 1 ou 2 frases e mostrar o projeto]*

### 4. PARTE 3: PROTÓTIPO E VALIDAÇÃO (2:16 - 3:25)

*[slides 8 e 9, com gravação de tela do Figma]*

**[Vinícius]:**

"Na Parte 3, usamos o Design Sprint para validar a hipótese de que o problema é a falta de acompanhamento. Prototipamos no Figma as três stories prioritárias como um único fluxo, porque isoladas elas não fecham a jornada. O cidadão se identifica: no totem, com Cartão SUS ou CPF e nascimento, sem senha; no app, com CPF e senha ou Gov.br. Depois vê a etapa do encaminhamento e a próxima ação, sem dado clínico. Quando há vaga, escolhe o horário, confirma, e pode cancelar ou reagendar. Sem encaminhamento ou sem vagas, a tela diz isso claramente. Validamos com quatro critérios: clareza do fluxo, facilidade de acompanhamento, redução de retrabalho e redução de ambiguidades."

*[exibir no Figma: identificação (totem e app), status, "sem encaminhamento", lista de horários, confirmação, cancelamento]*

### 5. PARTE 4: DISPERSÃO E PROBABILIDADE (3:26 - 4:30)

*[slides 10 e 11]*

**[Brenda]:**

"Na Parte 4, mantivemos os dados da Fase 1 e calculamos a dispersão dos tempos médios de espera. Eles vão de 25 dias na Oncologia a 180 na Ortopedia: média de 103,75 dias, amplitude de 155, desvio padrão de cerca de 56 e IQR de 92,5. Ou seja, a média sozinha esconde filas muito diferentes. Depois, a probabilidade: adotando 100 dias como limite analítico, 60% dos encaminhamentos estão em especialidades acima dele. E a chance de um encaminhamento ser urgente é de 17,5%, ponderada pelo volume, e não os 27,5% da média simples. Como os dados são agregados, não dizem quanto cada paciente espera, mas apoiam decisões como redistribuir recursos, organizar mutirões e priorizar filas."

### 6. ENCERRAMENTO (4:31 - 5:00)

*[slide 12]*

**[John]:**

"Fechamos esta fase com um projeto estruturado: requisitos refinados, modelagem, protótipo validado e dados que sustentam decisões. Com a Sprint 1 planejada, o Minha Vez está pronto para virar código e tornar a fila visível para o cidadão. Muito obrigado!"
