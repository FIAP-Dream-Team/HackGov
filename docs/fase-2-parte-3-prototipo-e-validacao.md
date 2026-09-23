# Parte 3 — Prototipação e critérios de validação

Esta parte atende ao pedido de validar hipóteses de solução **antes** de expandir a implementação. O método de referência é o Design Sprint: escolhe-se uma jornada real do serviço, esboçam-se as telas essenciais e definem-se critérios observáveis — clareza do fluxo, facilidade de acompanhamento, redução de retrabalho e redução de ambiguidades.

O serviço recortado é o encaminhamento da atenção primária (UBS) para a atenção especializada, no produto conceitual **Minha Vez**. A hipótese, já adotada na Fase 1, é a de que o problema percebido pela população é a **falta de acompanhamento**: hoje o cidadão precisa ligar, ir à unidade ou conhecer alguém no órgão para saber em que pé está o pedido.

O enunciado pede o esboço das telas essenciais de **uma jornada**, e ilustra com um único arco (“o cidadão abre a solicitação e acompanha o status”). Isolar uma user story, porém, não fecha esse arco. A US01 só identifica; a US02 só mostra a etapa; a US03 só marca o horário. Sem as três, o cidadão ou não entra no sistema, ou vê o status sem poder agir, ou marca sem saber de onde veio o pedido. Por isso o grupo prototipa as três stories de maior prioridade (US01, US02 e US03) como **um único fluxo do cidadão**, e deixa fora desta validação o painel da sala de espera e o painel da equipe, que pertencem a outros atores e não são necessários para testar a hipótese de acompanhamento.

O protótipo é de baixa a média fidelidade, em Figma, com navegação entre telas: [Minha vez](https://www.figma.com/design/jVZtzCqq1vTrkIXsqF5yHf/Minha-vez). Nomes de unidade, protocolo, especialidade e horário nas telas são **cenário ilustrativo**, não dado de pesquisa.

Os **critérios de aceitação** das user stories descrevem o que o software deverá cumprir quando for desenvolvido. Os **critérios de validação**, objeto desta parte, descrevem o que já é possível julgar no esboço.

## 3.1 A jornada prototipada

A jornada essencial é: o cidadão identifica-se na UBS ou no aplicativo, consulta a etapa do encaminhamento e, quando há vaga, escolhe um horário — ou compreende, sem ambiguidade, que ainda não há vaga ou que não há encaminhamento.

No Figma, isso corresponde às telas de identificação no totem (Cartão SUS ou CPF e nascimento) e no aplicativo (login e cadastro); às telas de status (recebido e triado, aguardando agendamento, concluído, sem encaminhamento, e o mesmo status no totem); e às telas de agenda (lista de horários, confirmação, ausência de vagas e cancelamento).

## 3.2 US01 — Identificação do cidadão

**User story:** como cidadão, quero me identificar no sistema, para acessar meus agendamentos sem barreira de acesso.

A identificação existe em dois canais, que o protótipo não mistura.

No **totem da UBS**, a pessoa escolhe encostar o Cartão SUS ou digitar CPF e data de nascimento. Não há senha: no equipamento público, senha seria barreira incompatível com o público da unidade. Se os dados correspondem a um cadastro, o totem segue para o acompanhamento. Se não correspondem, a mensagem informa que os dados não foram encontrados e sugere conferir o número ou pedir ajuda no balcão. Encerrar devolve a tela inicial, para que a pessoa seguinte não herde a sessão.

No **aplicativo**, a pessoa entra com CPF e senha ou continua com a conta Gov.br; quem ainda não tem acesso cria cadastro pelos mesmos meios. A identificação bem-sucedida abre a área pessoal. Dado clínico, laudo, CID ou nome completo não aparecem nesta etapa.

**Critérios de validação.** O fluxo é claro se um observador distingue totem e aplicativo e verifica a ausência de senha no totem. Há redução de barreira se Cartão SUS e CPF com nascimento aparecem como alternativas no mesmo passo. Há redução de ambiguidades se a mensagem de erro é compreensível por quem está na fila da UBS. A jornada só se sustenta se, após identificar-se, a próxima tela for a do status.

## 3.3 US02 — Acompanhamento da etapa

**User story:** como cidadão, quero acompanhar a etapa do meu encaminhamento, para não precisar ligar ou ir à UBS.

Identificado, o cidadão vê o protocolo e uma trilha com três etapas: *recebido e triado*, *aguardando agendamento* e *concluído*. A etapa corrente destaca-se das demais.

Se o pedido foi apenas recebido, o próximo passo é esperar a liberação de horários; não se oferece marcação prematura. Se a unidade já liberou vagas, o aplicativo convoca a escolha de horário. Se a consulta ou o exame já foi marcado, a tela mostra data e hora e permite reagendar ou cancelar. Se não existe encaminhamento, o protótipo o declara: não inventa protocolo nem etapa “atual”.

A mesma informação de etapa aparece no aplicativo e no totem. O totem, nesta story, não abre a agenda: responde à pergunta “em que pé está o meu pedido?”. Nome completo e dado clínico permanecem fora dessa tela.

**Critérios de validação.** Há facilidade de acompanhamento se um observador nomeia a etapa atual sem explicação prévia. Há redução de retrabalho se a interface diz se já é possível marcar, tornando desnecessária a ligação à UBS para essa pergunta. Há redução de ambiguidades se o estado “sem encaminhamento” não imita um pedido em curso. A consistência entre totem e aplicativo valida que a informação é a mesma nos dois dispositivos do recorte.

## 3.4 US03 — Escolha de horário

**User story:** como cidadão, quero escolher um horário disponível, para marcar exame ou consulta especializada.

Quando há vaga, o cidadão vê apenas horários livres da especialidade do encaminhamento. Seleciona um horário e confirma. A tela seguinte reitera especialidade, data, hora, protocolo e unidade — confirmação visível no sentido do enunciado (aqui, pela tela).

Reagendar reabre a lista de horários livres. Cancelar pede confirmação e devolve o cidadão ao acompanhamento em *aguardando agendamento*, com o aviso de que o horário volta a ficar disponível. Manter o horário desfaz o cancelamento. Sem vaga, o protótipo não preenche a lista com horários fictícios: declara a ausência e devolve ao acompanhamento.

**Critérios de validação.** O fluxo é claro se a confirmação repetir o horário escolhido. Há redução de ambiguidades se a tela sem vagas não listar nenhum horário. Há redução de retrabalho se cancelar e reagendar ocorrerem no aplicativo, sem retorno presencial só para desmarcar. A fila só é honesta no esboço se horário ocupado não aparecer.

## 3.5 Síntese da validação e limites do esboço

Os critérios das três stories organizam-se nos eixos do enunciado, sempre sobre o fluxo do cidadão.

| Eixo | O que o protótipo desta jornada precisa evidenciar |
| --- | --- |
| Clareza do fluxo | Totem sem senha; passagem da identificação ao status; três etapas nomeáveis; confirmação do horário escolhido. |
| Facilidade de acompanhamento | Status consultável no aplicativo e no totem, sem ligar para saber a etapa. |
| Redução de retrabalho | Saber se já é possível marcar; marcar, reagendar e cancelar no aplicativo. |
| Redução de ambiguidades | Erro de identificação compreensível; “sem encaminhamento” e “sem vaga” explícitos; ausência de dado clínico nas telas públicas desta jornada. |

O esboço permite discutir esses pontos porque encena o caminho completo (identificar, ver a etapa, marcar) e os vazios (cadastro não encontrado, pedido inexistente, lista sem horário). Não substitui a implementação: leitura física do Cartão SUS, autenticação Gov.br de fato e a reflexão automática, no aplicativo, de uma mudança de status feita pela equipe ficam para o desenvolvimento, não para esta prototipação.
