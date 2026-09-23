# Parte 1 — Refinamento do Product Backlog (SCRUM)

Esta parte parte do que já foi fechado na Fase 1 (`DOC-CONSOLIDADO.pdf`): cinco requisitos funcionais
(RF01–RF05), duas user stories não funcionais (RNF01–RNF02), cinco user stories (US01–US05) com critérios
de aceitação e a matriz de priorização GUT. Nada disso é reaberto aqui — a Fase 2 refina o que já existe,
não substitui.

As cinco user stories correspondem às issues `DT-36`–`DT-40` no Linear, na mesma ordem em que aparecem no
PDF da Fase 1 (US01→`DT-36` … US05→`DT-40`). Essa correspondência segue a numeração sequencial registrada
em `handoff.md` e não foi conferida linha a linha no board nesta sessão porque o MCP do Linear não está
configurado nesta máquina — conferir antes de transcrever para lá.

## 1.1 Backlog: visão geral

| US | Título | RF | Ator | Prioridade GUT | Pontuação GUT |
| --- | --- | --- | --- | --- | --- |
| US01 | Identificação do cidadão | RF01 | Cidadão | 1ª | 125 |
| US02 | Acompanhamento do status | RF02 | Cidadão | 2ª | 100 |
| US03 | Agendamento de horário | RF03 | Cidadão | 2ª | 100 |
| US05 | Painel gerencial | RF05 | Equipe / gestor | 4ª | 48 |
| US04 | Chamada na sala de espera | RF04 | Cidadão (sala de espera) | 5ª | 27 |

A ordem de prioridade não muda nesta fase: nenhuma informação nova contradiz o raciocínio já registrado no
PDF (US01 é pré-requisito técnico de tudo; US02 e US03 formam o núcleo do valor prometido; US05 e US04 são
dispensáveis para o cidadão usar o essencial do serviço).

**User stories prioritárias desta refinamento: US01, US02 e US03.** São as três já escolhidas para a
prototipação da Parte 3 (`docs/fase-2-parte-3-prototipo-e-validacao.md`) e as três com maior pontuação GUT.
US04 e US05 permanecem no backlog com o texto da Fase 1, sem o detalhamento abaixo, porque não entram na
Sprint 1 (seção 1.3).

## 1.2 Refinamento das user stories prioritárias

### US01 — Identificação do cidadão (RF01)

> Como cidadão, quero me identificar no sistema, por Cartão SUS/CPF no totem, ou login por CPF+senha/OAuth
> no app, para acessar meus agendamentos sem precisar decorar senha ou enfrentar barreira de acesso.

**O que entra**
- Identificação no totem por Cartão SUS **ou** CPF + data de nascimento, sem senha.
- Login e cadastro no aplicativo por CPF + senha, ou por conta Gov.br (OAuth).
- Mensagem de erro clara quando o dado não corresponde a um cadastro, sem travar o fluxo.
- Encaminhamento do cidadão, após identificação bem-sucedida, direto à área pessoal (status,
  agendamentos).
- No totem, encerrar a sessão devolve a tela inicial, para a pessoa seguinte não herdar a sessão de quem
  usou antes.

**O que não entra**
- Recuperação de senha do aplicativo (fluxo do Gov.br ou de terceiros, fora do escopo do Minha Vez).
- Qualquer exibição de dado clínico, laudo, CID ou nome completo nesta etapa (regra do RNF01).
- Leitura física do Cartão SUS por hardware — nesta fase o totem aceita a digitação do número; o leitor
  físico fica para desenvolvimento futuro, como já registrado na Parte 3.
- Autenticação Gov.br de fato (hoje é ilustrada no protótipo, não implementada).

**Critérios de aceitação**
- [ ] No totem, o sistema aceita Cartão SUS **ou** CPF + data de nascimento, sem exigir senha.
- [ ] No app, o cidadão consegue se cadastrar/logar com CPF + senha ou OAuth.
- [ ] Um observador distingue totem e aplicativo como dois canais diferentes, sem confundi-los.
- [ ] Dados inválidos ou não encontrados geram mensagem de erro compreensível por quem está na fila da
      UBS, sem travar o fluxo.
- [ ] Após identificação, o cidadão é levado direto à sua área pessoal (status, agendamentos).
- [ ] Encerrar a sessão no totem devolve a tela inicial.

**Regras e exceções**
- Dados obrigatórios: CPF é sempre exigido (com Cartão SUS ou com senha); data de nascimento só é exigida
  junto do CPF no totem.
- Validação: se os dados não correspondem a nenhum cadastro, o sistema informa e sugere conferir o número
  ou pedir ajuda no balcão — não deve parecer erro de sistema.
- Exceção de canal: totem nunca pede senha; aplicativo sempre pede senha ou OAuth. Um canal não herda a
  regra do outro.

### US02 — Acompanhamento do status (RF02)

> Como cidadão, quero acompanhar a etapa atual do meu encaminhamento (recebido e triado → agendar
> exame/consulta → concluído) para saber em que pé está minha solicitação sem precisar ligar ou ir
> presencialmente à UBS.

**O que entra**
- Exibição de protocolo e trilha com no mínimo três etapas: recebido/triado, aguardando agendamento,
  concluído — com a etapa corrente destacada.
- Mesma informação de status disponível e idêntica em aplicativo e totem.
- Reflexo, para o cidadão, de qualquer mudança de status feita pela equipe.
- Declaração explícita de "sem encaminhamento" quando não existe nenhum, sem imitar um pedido em curso.
- Indicação, na própria tela de status, se já é possível marcar horário (ligação com US03) ou se o
  cidadão ainda precisa aguardar a liberação de vagas.

**O que não entra**
- Qualquer dado clínico, laudo, CID ou nome completo nesta tela (regra do RNF01) — a tela existe só para
  responder "em que pé está o meu pedido".
- Abertura da agenda de horários pelo totem: nesta story o totem só informa a etapa, quem agenda é o
  aplicativo (US03).
- Notificação push automática de mudança de status — nesta fase o cidadão consulta ativamente, o aviso
  proativo fica para desenvolvimento futuro.

**Critérios de aceitação**
- [ ] O status exibido tem no mínimo as três etapas: recebido/triado, aguardando agendamento, concluído.
- [ ] A mesma informação aparece igual em qualquer dispositivo (app, totem).
- [ ] A mudança de status feita pela equipe é refletida para o cidadão.
- [ ] Nenhum dado clínico sensível é exibido nessa tela (regra do RNF01).
- [ ] Um observador nomeia a etapa atual sem explicação prévia.
- [ ] A interface diz se já é possível marcar horário, tornando desnecessária a ligação à UBS só para essa
      pergunta.
- [ ] O estado "sem encaminhamento" não se parece com um pedido em andamento.

**Regras e exceções**
- Se o pedido foi apenas recebido, a tela não oferece marcação prematura — o próximo passo é aguardar a
  liberação de horários.
- Se a unidade já liberou vagas, o aplicativo convoca a escolha de horário (handoff para US03).
- Se já existe agendamento, a tela mostra data e hora e permite reagendar ou cancelar (handoff para US03).
- Se não existe encaminhamento, o sistema declara isso explicitamente, nunca inventa etapa "atual".

### US03 — Agendamento de horário (RF03)

> Como cidadão, quero escolher entre os horários disponíveis para marcar meu exame ou consulta
> especializada, para garantir um horário que funcione pra mim.

**O que entra**
- Lista de horários livres, filtrada pela especialidade do encaminhamento.
- Confirmação visível (tela e/ou notificação) repetindo especialidade, data, hora, protocolo e unidade.
- Reagendamento, que reabre a lista de horários livres.
- Cancelamento, com pedido de confirmação e devolução do cidadão ao status "aguardando agendamento";
  manter o horário desfaz o cancelamento.
- Declaração explícita de ausência de vaga quando não há horário livre, sem preencher a lista com opções
  fictícias.

**O que não entra**
- Edição do encaminhamento em si (especialidade, motivo do encaminhamento) — isso é ato da equipe/UBS,
  fora do escopo do cidadão.
- Agendamento por telefone ou presencial — esta story cobre apenas o fluxo digital (app).
- Overbooking ou fila de espera por horário concorrido — nesta fase, horário ocupado simplesmente não
  aparece na lista.

**Critérios de aceitação**
- [ ] Só aparecem horários realmente livres (sem conflito de agenda).
- [ ] Ao confirmar, o cidadão recebe confirmação visível repetindo o horário escolhido.
- [ ] O horário escolhido some da lista de disponíveis para outros cidadãos.
- [ ] É possível reagendar e cancelar respeitando as regras definidas pela UBS.
- [ ] A tela sem vagas não lista nenhum horário fictício.
- [ ] Cancelar e reagendar ocorrem inteiramente no aplicativo, sem exigir retorno presencial só para
      desmarcar.

**Regras e exceções**
- Cancelar sempre pede confirmação antes de efetivar; "manter o horário" desfaz a ação.
- Cancelar devolve o horário à lista de disponíveis para outros cidadãos.
- Sem vaga, o sistema declara a ausência e devolve o cidadão ao acompanhamento (US02), nunca trava numa
  tela vazia sem explicação.

## 1.3 US04 e US05 — mantidas em backlog, fora da Sprint 1

US04 (Chamada na sala de espera, RF04) e US05 (Painel gerencial, RF05) continuam com o texto e os
critérios de aceitação já fechados na Fase 1, sem o detalhamento acima. A matriz GUT já justifica isso: a
ausência das duas não impede o cidadão de se identificar, acompanhar o status e agendar — o núcleo de
valor do Minha Vez continua de pé sem elas. Ficam no Backlog do Linear, sem filho `Implementação`, até
entrarem em uma sprint futura.

## 2. Decomposição em tarefas (US01, US02, US03)

Tarefas por tipo (modelagem, classe, validação, fluxo, teste, documentação), cada uma amarrada à user
story que rastreia. O estado "feito" reflete o que já existe em `src/backend` (commits `fbd202d` e
`bb20938`); o restante é o que falta para fechar o critério de aceitação correspondente.

| Tarefa | US | Tipo | Estado |
| --- | --- | --- | --- |
| Modelo `Cidadao` (CPF, Cartão SUS, data de nascimento) | US01 | Modelagem | Feito |
| Serviço de identificação: aceitar Cartão SUS **ou** CPF+nascimento no totem, sem senha | US01 | Validação / fluxo | Pendente |
| Serviço de login/cadastro do app: CPF+senha ou OAuth | US01 | Fluxo | Pendente |
| Mensagem de erro para dado não encontrado, sem travar o fluxo | US01 | Validação | Pendente |
| Testes automatizados de identificação (Cartão SUS, CPF+nascimento, dado inválido) | US01 | Teste | Pendente |
| Modelo `Encaminhamento` + `StatusEncaminhamento` + `HistoricoStatus` | US02 | Modelagem | Feito |
| Exposição do status atual ao cidadão (consulta, sem dado clínico) | US02 | Fluxo | Pendente |
| Regra "sem encaminhamento" explícita (sem imitar pedido em curso) | US02 | Validação | Pendente |
| Testes automatizados das transições de status | US02 | Teste | Pendente |
| Modelo `Especialidade`, `HorarioDisponivel`, `Agendamento` amarrados ao `Encaminhamento` | US03 | Modelagem | Feito |
| `solicitarAgendamento()` / `selecionarHorario()` com verificação de disponibilidade | US03 | Fluxo | Feito |
| Cancelamento com devolução do horário à agenda | US03 | Fluxo | Pendente |
| Reagendamento (reabrir lista de horários) | US03 | Fluxo | Pendente |
| Testes automatizados de agendamento, cancelamento e reagendamento | US03 | Teste | Pendente |
| Reflexão técnica da modelagem (`DT-25`) cruzando US01–US03 com os diagramas | US01–US03 | Documentação | Pendente |

## 3. Sprint Backlog (Sprint 1)

**Capacidade do grupo: pendente.** A matriz de capacidade em `persona.md` está com a maioria das células em
branco, e a atribuição de responsáveis para `DT-21`–`DT-35` depende da reunião do grupo (`handoff.md`,
seção 4). Este Sprint Backlog lista o escopo comprometido e o tamanho relativo de cada tarefa em story
points; horas e responsáveis entram depois da reunião, sem travar o restante da Parte 1.

| Tarefa | US | Story Points | Responsável |
| --- | --- | --- | --- |
| Serviço de identificação (totem: Cartão SUS / CPF+nascimento) | US01 | 5 | a definir |
| Serviço de login/cadastro do app (CPF+senha, OAuth) | US01 | 5 | a definir |
| Mensagem de erro para dado não encontrado | US01 | 2 | a definir |
| Exposição do status atual ao cidadão | US02 | 3 | a definir |
| Regra "sem encaminhamento" explícita | US02 | 2 | a definir |
| Cancelamento com devolução do horário | US03 | 3 | a definir |
| Reagendamento (reabrir lista de horários) | US03 | 3 | a definir |
| Testes automatizados (US01, US02, US03) | US01–US03 | 5 | a definir |
| **Total** | | **28** | |

Escala usada: Fibonacci curto (1, 2, 3, 5, 8), tamanho relativo entre as próprias tarefas do grupo, não
tempo cronológico. Definir horas por ponto é decisão da reunião.

Este quadro fecha `DT-22` só depois de: (1) a reunião confirmar responsáveis e capacidade real em horas, e
(2) o dono aprovar a criação dos filhos `Implementação` de cada User Story no Linear, seguindo
`docs/como-criar-user-stories-no-linear.md`. Nenhum card foi criado nesta sessão.

## 4. Métricas ágeis

**Burndown de story points da Sprint 1 (planejado vs. realizado).** O prazo interno da Parte 1 é apertado
(alvo 24/09, entrega final 04/10) — o burndown é o jeito mais rápido do grupo enxergar, a qualquer momento
da semana, se o ritmo real está descolando do prazo cedo o bastante para reagir, em vez de descobrir na
véspera.

**Taxa de conclusão de tarefas por user story (`Implementação` `Done` / total de filhos).** Cada tarefa
rastreia uma US (seção 2); medir a conclusão por story, não só pelo total da sprint, mostra se alguma das
três prioritárias (US01, US02, US03) está ficando pra trás em relação às outras — o que a média geral
esconderia.

**Taxa de retrabalho (entregável devolvido na revisão / total revisado).** O `README.md` já fixa a regra
de que todo entregável é revisado por alguém que não o escreveu antes de ir para Done. Contar quantos
entregáveis voltam da revisão mede se essa regra está pegando problema real ou só carimbando — e é um
sinal de risco de prazo, porque retrabalho tardio é o que mais ameaça a entrega de 04/10.

## Pendências

- Confirmar, no board do Linear, que `DT-36`→US01 … `DT-40`→US05 é de fato a correspondência 1:1 (não
  verificado nesta sessão por falta de MCP do Linear configurado nesta máquina).
- Reunião do grupo: responsáveis de `DT-21`–`DT-35`, capacidade real da Sprint 1 em horas, RMs em
  `persona.md`/`README.md`.
- Só depois da reunião: propor ao dono a lista de filhos `Implementação` de US01, US02 e US03 no Linear.
