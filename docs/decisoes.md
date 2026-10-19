# Decisões

Uma linha por decisão, com data e quem decidiu. Dúvida em aberto entra aqui também, com dono e critério de
saída, e sai quando virar decisão ou card.

| Data | Decisão | Quem |
| --- | --- | --- |
| antes de 10/08/2026 | O eixo do produto é **acompanhamento**: o cidadão precisa saber em que pé está a solicitação sem ligar, ir presencialmente ou conhecer alguém dentro do órgão | votação do grupo |
| 10/08/2026 | Rastreamento no Linear via MCP em **escopo local**, chave pessoal do workspace da FIAP, sem tocar em outros workspaces da máquina | John |
| 10/08/2026 | Project `HackGov` único, guarda-chuva do ano, com milestones por fase, em vez de um project por capítulo | John |
| 11/08/2026 | A decisão do tema é **direcionamento**, não especificação. Detalhamento de requisito só na Fase 2 | John |
| 11/08/2026 | **Quem decide responsável é a reunião do grupo.** A alocação de `persona.md` é proposta e só se aplica a tarefa que a reunião não distribuiu explicitamente | John |
| 11/08/2026 | Dado da Parte 4 pode ser criado, mas dado inventado é rotulado como sintético na tabela e no documento, com a premissa escrita ao lado. Dado real vai com órgão, ano e link | John |
| 23/08/2026 | **Serviço público escolhido: saúde, atenção primária na UBS.** Produto "Minha Vez", conforme o deck de design (totem de identificação e etapas, painel de senha na sala de espera, canal web para equipe/gestor com fila de encaminhamentos e indicadores). Infraestrutura urbana sai da mesa. Paleta e tokens já commitados em `docs/design/tokens.json` (Vinícius, 20/08/2026) antecipavam essa direção | Larissa, em conversa fora do Linear |
| 18/10/2026 | **Modelo lógico (Parte 2): UNIDADE_SAUDE é entidade própria**, com o endereço (atributo composto) decomposto em colunas atômicas, porque a confirmação da US03 mostra a unidade e o encaminhamento tem unidade de origem e de destino | João Pedro e Larissa (Parte 2) |
| 18/10/2026 | **Modelo lógico (Parte 2): o contato do cidadão é atributo multivalorado** e virou a entidade `CONTATO_CIDADAO`, preparando a notificação por SMS/WhatsApp que o backlog deixou para uma sprint futura | João Pedro e Larissa (Parte 2) |
| 18/10/2026 | **Modelo lógico (Parte 2): `CHAMADA` (US04) entra no modelo** mesmo fora da Sprint 1, para cobrir os casos de uso "Chamar paciente" e "Visualizar chamada na sala de espera" | João Pedro e Larissa (Parte 2) |
| 18/10/2026 | **Modelo lógico (Parte 2): CID, laudo e prontuário não são armazenados.** O Minha Vez acompanha a etapa do encaminhamento e não substitui o prontuário; dado clínico fica no canal institucional (RNF01) | João Pedro e Larissa (Parte 2) |
| 18/10/2026 | **Modelo lógico (Parte 2): reagendar cancela o agendamento atual e cria um novo** com `ID_AGENDAMENTO_ORIGEM` apontando para ele (autorrelacionamento), para não perder o histórico de horários e distinguir reagendamento de "cancelar e marcar de novo" | Larissa |
| 18/10/2026 | **Modelo lógico (Parte 2): o banco garante que o horário é da especialidade do encaminhamento**, com `ID_ESPECIALIDADE` em `AGENDAMENTO` participando das FKs compostas (redundância controlada) | Larissa |
| 18/10/2026 | **Modelo lógico (Parte 2): o encaminhamento guarda a unidade de destino** (`ID_UNIDADE_DESTINO`), além da UBS de origem, porque a US03 refinada diz que o cidadão não escolhe unidade diferente da definida no encaminhamento. O banco garante a regra com a mesma técnica da especialidade: as FKs compostas de `AGENDAMENTO` passaram de par para trio (encaminhamento ou horário, especialidade, unidade), sem aumentar o número de FKs compostas. Alternativa descartada: guardar o destino só com FK simples e deixar a regra no Java, o que trataria de jeitos diferentes duas regras da mesma user story | João Pedro, a partir da passagem de bastão da Larissa |
| 19/10/2026 | **Modelo lógico (Parte 2): o limite de 2 reagendamentos por encaminhamento (US03) fica no Java**, contando os agendamentos com origem preenchida, e não num contador no banco: dado que pode ser calculado não é guardado, como os indicadores da US05 | João Pedro |
| 19/10/2026 | **O código Java vai acompanhar o modelo lógico** (diferenças listadas na seção 4 de `docs/modelo-logico/modelo-logico.md`), mas não nesta etapa. Ao final do trabalho, um documento lista o que falta implementar | João Pedro |

**Pendência:** esta decisão fecha `DT-6` mas ainda não foi registrada lá nem no `handoff.md`, que continua
descrevendo a escolha como em aberto entre saúde e infraestrutura urbana. Atualizar os dois quando o grupo
confirmar que este é o registro oficial.
