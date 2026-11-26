# HackGov - Minha Vez

| Integrante | RM |
| --- | --- |
| Vinícius Cardoso Junqueira | 566906 |
| Ana Larissa Cristo Mendes | 567403 |
| João Pedro Thethê Andrade | 568305 |
| John Vitor Silverio Pereira | 566968 |
| Brenda Cristina Martins Araújo | 575032 |

# **Parte 1: Versão Atual do Projeto**

## 1. Evolução do projeto

Na Fase 2, o Minha Vez tinha o fluxo do cidadão (identificação, acompanhamento e agendamento) modelado em UML, prototipado no Figma e com o primeiro recorte do domínio em Java, rodando em memória. Nesta fase, o projeto ganhou um banco de dados desenhado a partir desse domínio (modelo lógico, normalização, modelo físico e script SQL, nas Partes 2 a 5), e o resto do projeto foi atualizado para ficar coerente com ele.

A modelagem dos dados expôs regras das user stories refinadas que o código ainda não aplicava. A principal é a da US03: o encaminhamento define em qual unidade a consulta acontece, e o cidadão só pode escolher vagas dessa unidade. O código Java passou a aplicar essas regras, ganhou testes automatizados, e os diagramas UML e os wireframes foram atualizados para mostrar o comportamento novo.

| Artefato | Fase 2 (entrega anterior) | Fase 3 (esta entrega) |
| --- | --- | --- |
| Banco de dados | não existia | modelo lógico com 11 entidades, normalização até a BCNF, modelo físico e script com 12 tabelas e 18 chaves estrangeiras |
| Código Java | 8 classes e 3 enumerações; regras de agendamento sem unidade, sem protocolo e sem limites de reagendamento | 9 classes e 4 enumerações; unidade de origem e destino, protocolo, urgência, reagendamento rastreável, prazo de 24 horas e limite de 2 reagendamentos |
| Testes | nenhum teste automatizado | 5 testes automatizados das regras do encaminhamento, todos passando |
| Diagramas UML | casos de uso, atividades, classes e sequência | classes e sequência atualizados; novo diagrama de sequência do reagendamento; novo diagrama de atividades de reagendar e cancelar; casos de uso mantido |
| Wireframes | telas da US01 a US03 no Figma | 3 telas atualizadas e 3 telas novas para as regras da US03 |

## 2. Código Java atualizado

O código completo do projeto segue no arquivo ZIP da entrega. As classes do domínio ficam em src/backend/src/main/java/com/hackgov/backend/domain, a demonstração em src/backend/src/main/java/com/hackgov/backend/demo/DemoModelagem.java e os testes em src/backend/src/test/java/com/hackgov/backend/domain. O domínio continua em memória: a gravação no banco é a próxima etapa, e o script SQL das Partes 4 e 5 já define as tabelas que o Java vai usar.

### 2.1 O que mudou em cada classe

| Classe | Fase 2 | Fase 3 |
| --- | --- | --- |
| UnidadeSaude (nova) | não existia | representa a UBS e o ambulatório: nome, tipo, CNES e endereço; obrigatórios validados na criação |
| TipoUnidade (nova) | não existia | enumeração UBS ou ESPECIALIZADA |
| Encaminhamento | cidadão, especialidade e status | protocolo obrigatório, selo de urgência, unidade de origem e unidade de destino; só lista e só aceita vagas da unidade de destino; reagendar cria um novo agendamento; aplica o prazo de 24 horas e o limite de 2 reagendamentos; registra a criação no histórico |
| Agendamento | reagendar trocava a data do mesmo agendamento; cancelar desligava a vaga | guarda a data de cancelamento e o agendamento de origem; o cancelado continua apontando para a vaga, preservando o histórico |
| HorarioDisponivel | especialidade e data | passa a ter a unidade onde a vaga acontece |
| Especialidade | não aceitava duas vagas no mesmo horário | duas unidades podem oferecer o mesmo horário; a duplicidade é conferida por unidade |
| Cidadao | data de nascimento opcional | data de nascimento obrigatória e não pode ser no futuro (US01) |
| UsuarioInstitucional | login e perfil | unidade de lotação obrigatória |
| HistoricoStatus | só registrava mudanças | registra também a criação do encaminhamento ("criação → RECEBIDO_TRIADO") |

### 2.2 Regras das user stories que passaram a valer no código

| Regra | Origem | Onde está |
| --- | --- | --- |
| O cidadão só vê e só agenda vagas da unidade definida no encaminhamento | US03 | Encaminhamento.solicitarAgendamento e validarHorarioLivre |
| Reagendar cancela o horário atual e cria um novo, ligado ao anterior | US03 | Encaminhamento.reagendar e Agendamento.definirOrigem |
| Cancelar ou reagendar só até 24 horas antes do horário | US03 | Encaminhamento.exigirPrazoDeAlteracao |
| No máximo 2 reagendamentos; depois, só no balcão da UBS | US03 | Encaminhamento.exigirLimiteDeReagendamento |
| Protocolo obrigatório e selo de urgência | US02 | construtores de Encaminhamento |
| Data de nascimento obrigatória e não futura | US01 | construtor de Cidadao |

### 2.3 Testes automatizados

A classe RegrasDoEncaminhamentoTest (JUnit 5) confere as regras novas. Os 5 testes passam:

| Teste | O que confere |
| --- | --- |
| nascimentoNuloOuFuturoEhRecusado | o cadastro recusa nascimento nulo ou no futuro |
| criacaoDoEncaminhamentoEntraNoHistorico | o histórico começa pela criação, sem responsável |
| reagendarCriaOutroAgendamentoEMantemOHorarioCancelado | reagendar gera dois agendamentos, o novo aponta para o cancelado e a vaga antiga é liberada |
| terceiroReagendamentoFicaNoBalcao | o terceiro reagendamento é recusado |
| cancelarComMenosDe24HorasEhRecusado | cancelar com menos de 24 horas é recusado e o agendamento continua ativo |

### 2.4 Demonstração

O DemoModelagem executa o fluxo completo. Trecho da saída:

```
Protocolo: MV-2026-0001
Horários livres na unidade de destino: 2
- 30/10/2026 às 14:00 (Ambulatório de Especialidades)
- 31/10/2026 às 09:00 (Ambulatório de Especialidades)
Vaga de outra unidade visível: false
Reagendado para: 31/10/2026 às 09:00
Agendamentos no encaminhamento: 2
Anterior ficou: CANCELADO
Novo aponta para o cancelado: true
Agendamento cancelado: CANCELADO
Horário cancelado ainda registrado: true
Data de cancelamento preenchida: true
criação -> RECEBIDO_TRIADO
RECEBIDO_TRIADO -> AGUARDANDO_AGENDAMENTO (Responsável: Maria Souza)
AGUARDANDO_AGENDAMENTO -> AGENDADO
AGENDADO -> AGUARDANDO_AGENDAMENTO
Erro esperado: O horário não pertence à unidade de destino do encaminhamento.
```

As datas da saída são calculadas a partir do dia da execução (o demo publica vagas para 7 e 8 dias depois).

## 3. Diagramas UML atualizados

Os quatro diagramas da Fase 2 foram revisados contra o código novo. O que mudou em cada um:

| Diagrama | Situação | Motivo |
| --- | --- | --- |
| Casos de uso | mantido | os atores e os casos de uso continuam os mesmos; as regras novas mudam como agendar, reagendar e cancelar funcionam, não quais funcionalidades existem |
| Classes | atualizado | classes UnidadeSaude e TipoUnidade, atributos e métodos novos, autorrelacionamento do agendamento |
| Sequência (agendar) | atualizado | as vagas são filtradas e validadas pela unidade de destino |
| Sequência (reagendar) | novo | o reagendamento passou a criar um novo agendamento e tem regras próprias |
| Atividades (reagendar e cancelar) | novo | mostra as decisões do prazo de 24 horas e do limite de reagendamentos |
| Atividades (agendar) | mantido | o fluxo é o mesmo; a etapa "consultar horários disponíveis" passa a considerar só a unidade de destino |

### 3.1 Diagrama de classes (atualizado)

!Classes.drawio.png

### 3.2 Diagrama de sequência - agendar horário (atualizado)

!sequencia.drawio.png

### 3.3 Diagrama de sequência - reagendar (novo)

!reagendar.drawio.png

### 3.4 Diagrama de atividades - reagendar e cancelar (novo)

!ativvidade.png

### 3.5 Diagrama de casos de uso (mantido)

![](attachment:365aeab6-c492-40fa-afa4-c79ec5b5a43e:imagesf2024e45-89e7-4d82-a185-191e9f8a4f75-10_1448_1751_290_157.jpg)

### 3.6 Diagrama de atividades - agendar (mantido)

!uml-atividades-agendar-fase2.png

## 4. Wireframes atualizados

As telas da Fase 2 continuam valendo. As alterações abaixo levam para a interface as regras que entraram no código: três telas foram atualizadas e três telas novas cobrem as situações de reagendamento e de prazo. Nomes, datas, protocolo e endereço são cenário ilustrativo.

| Tela | Situação | O que mudou |
| --- | --- | --- |
| US02 — Aguardando agendamento | atualizada | selo "Urgente" e a unidade de destino do encaminhamento |
| US03 — Horários livres | atualizada | só vagas da unidade de destino, com o endereço |
| US03 — Confirmação | atualizada | unidade de destino com endereço e aviso do prazo de 24 horas |
| US03 — Reagendamento confirmado | nova | mostra o horário anterior e o novo, e quantos reagendamentos ainda restam |
| US03 — Limite de reagendamentos | nova | depois de 2 reagendamentos, orienta o cidadão a ir ao balcão da UBS |
| US03 — Fora do prazo | nova | com menos de 24 horas, informa que não é possível alterar |

!wireframes.png

# Parte 2: Diagrama de Modelo Lógico

## Introdução

O Minha Vez acompanha o encaminhamento do cidadão da atenção primária (UBS) para a atenção especializada: o cidadão se identifica, acompanha a etapa do pedido e escolhe um horário quando há vaga. O modelo lógico de dados desta parte foi construído a partir do que já estava definido na fase anterior: as user stories refinadas (US01 a US05), o diagrama de casos de uso e o diagrama de classes. Nenhum requisito novo foi criado; onde o banco guarda algo além do diagrama de classes, a justificativa aponta a regra da user story correspondente.

## 1. Modelo Entidade-Relacionamento

### 1.1 Entidades do sistema

| Entidade | Papel no sistema | Origem |
| --- | --- | --- |
| PESSOA | Supertipo com o que cidadão e servidor têm em comum | classe abstrata Pessoa |
| CIDADAO | Quem acompanha e agenda o encaminhamento | Cidadao, US01 |
| USUARIO_INSTITUCIONAL | Equipe da UBS (perfil Atendente) e Gestor | UsuarioInstitucional, US05, RNF01 |
| UNIDADE_SAUDE | UBS de origem, unidade de destino e unidade onde o horário acontece | US03 |
| ESPECIALIDADE | Cardiologia, Ortopedia etc. | Especialidade |
| HORARIO_DISPONIVEL | Cada vaga publicada para uma especialidade numa unidade | HorarioDisponivel, US03 |
| ENCAMINHAMENTO | O pedido acompanhado pelo cidadão, com protocolo e etapa | Encaminhamento, US02 |
| AGENDAMENTO | Ocupação de um horário por um encaminhamento | Agendamento, US03 |
| HISTORICO_STATUS | Trilha de auditoria de cada mudança de etapa | HistoricoStatus, US05 |
| CONTATO_CIDADAO | Telefones e e-mails do cidadão | notificação (sprint futura) |
| CHAMADA | Senha e sala exibidas no painel da sala de espera | US04, caso de uso "Chamar paciente" |

Os indicadores do gestor (espera média e faltas) não são entidades: são calculados a partir de HISTORICO_STATUS e de AGENDAMENTO (status FALTA). Guardar o número pronto criaria um dado que pode divergir da fonte.

### 1.2 Atributos

Na notação do diagrama: # identificador, * obrigatório, o opcional, U único. As chaves estrangeiras não aparecem como atributos no modelo lógico: são representadas pelos relacionamentos.

| Entidade | Identificador | Obrigatórios | Opcionais |
| --- | --- | --- | --- |
| PESSOA | ID_PESSOA | NOME, TIPO_PESSOA (C ou U), DATA_CADASTRO | — |
| CIDADAO | herdado de PESSOA | CPF (U), DATA_NASCIMENTO, TENTATIVAS_LOGIN | CARTAO_SUS (U), SENHA_HASH, ID_GOV_BR (U), BLOQUEADO_ATE |
| USUARIO_INSTITUCIONAL | herdado de PESSOA | LOGIN (U), SENHA_HASH, PERFIL (ATENDENTE ou GESTOR) | — |
| UNIDADE_SAUDE | ID_UNIDADE | NOME, TIPO_UNIDADE (UBS ou ESPECIALIZADA), LOGRADOURO, NUMERO, BAIRRO, CIDADE, UF, CEP | CNES (U), COMPLEMENTO |
| ESPECIALIDADE | ID_ESPECIALIDADE | NOME (U) | — |
| HORARIO_DISPONIVEL | ID_HORARIO | DATA_HORA | — |
| ENCAMINHAMENTO | ID_ENCAMINHAMENTO | PROTOCOLO (U), DATA_CRIACAO, STATUS, URGENTE | — |
| AGENDAMENTO | ID_AGENDAMENTO | STATUS, DATA_CRIACAO | DATA_CANCELAMENTO |
| HISTORICO_STATUS | ID_HISTORICO | STATUS_NOVO, DATA_HORA | STATUS_ANTERIOR |
| CONTATO_CIDADAO | ID_CONTATO | TIPO_CONTATO, VALOR, PRINCIPAL | — |
| CHAMADA | ID_CHAMADA | SENHA, SALA, DATA_HORA | — |

### 1.3 Relacionamentos e cardinalidades

| Relacionamento | Cardinalidade | Leitura |
| --- | --- | --- |
| UNIDADE_SAUDE — USUARIO_INSTITUCIONAL | 1 : 0..N | cada servidor é lotado em uma unidade |
| CIDADAO — CONTATO_CIDADAO | 1 : 0..N | contato é opcional |
| CIDADAO — ENCAMINHAMENTO | 1 : 0..N | o estado "sem encaminhamento" existe (US02) |
| ESPECIALIDADE — ENCAMINHAMENTO | 1 : 0..N | cada encaminhamento é para uma especialidade |
| UNIDADE_SAUDE — ENCAMINHAMENTO (origem) | 1 : 0..N | a UBS que originou o pedido |
| UNIDADE_SAUDE — ENCAMINHAMENTO (destino) | 1 : 0..N | a unidade onde a consulta deve acontecer (US03) |
| ESPECIALIDADE — HORARIO_DISPONIVEL | 1 : 0..N | o estado "sem vagas" existe (US03) |
| UNIDADE_SAUDE — HORARIO_DISPONIVEL | 1 : 0..N | onde a vaga acontece |
| ENCAMINHAMENTO — AGENDAMENTO | 1 : 0..N, no máximo 1 ativo | agendamentos cancelados ficam como histórico |
| HORARIO_DISPONIVEL — AGENDAMENTO | 1 : 0..N, no máximo 1 ativo | a mesma vaga não serve a dois cidadãos |
| AGENDAMENTO — AGENDAMENTO ("reagendado de") | 0..1 : 0..1 | o novo agendamento aponta para o que substituiu |
| ENCAMINHAMENTO — HISTORICO_STATUS | 1 : 0..N | cada mudança de etapa gera um registro |
| USUARIO_INSTITUCIONAL — HISTORICO_STATUS | 0..1 : 0..N | responsável nulo = mudança automática do sistema |
| AGENDAMENTO — CHAMADA | 1 : 0..N | o paciente pode ser chamado mais de uma vez |
| USUARIO_INSTITUCIONAL — CHAMADA | 1 : 0..N | quem chamou |

### 1.4 Especialização, agregação e autorrelacionamento

Especialização. PESSOA é especializada em CIDADAO e USUARIO_INSTITUCIONAL, espelhando a herança do diagrama de classes. É total (não existe pessoa avulsa, assim como Pessoa é abstrata no Java) e disjunta (o discriminador TIPO_PESSOA vale C ou U). Cada subtipo tem seus próprios atributos obrigatórios, o que não seria possível numa tabela única cheia de colunas nulas.

Agregação. O relacionamento N:M entre ENCAMINHAMENTO e HORARIO_DISPONIVEL (“ocupa”) tem atributos próprios (status, data de criação, data de cancelamento) e participa de outro relacionamento: é ele que é chamado no painel. Por isso foi tratado como agregação, materializada na entidade associativa AGENDAMENTO, que se relaciona com CHAMADA.

Autorrelacionamento. Reagendar não altera o agendamento existente: o atual é encerrado como CANCELADO e um novo é criado apontando para ele (“reagendado de”). Assim o histórico de horários fica completo, reagendamento e “cancelar e marcar de novo” ficam distinguíveis, e a quantidade de reagendamentos é contada, em vez de guardada num contador que poderia divergir.

## 2. Reflexão sobre os dados do sistema

### 2.1 Quais informações precisam ser armazenadas

O suficiente para responder três perguntas: quem é o cidadão (identificação no totem e no app), em que pé está o pedido (etapa atual e trilha de mudanças) e qual vaga ele ocupa. Mais o que a US05 exige para auditoria: quem mudou a etapa e quando.

O que deliberadamente não é armazenado: CID (código do diagnóstico), laudo e prontuário. O Minha Vez acompanha a etapa do encaminhamento e não substitui o prontuário; dado clínico fica no canal institucional (RNF01). Quanto menos dado sensível o sistema guarda, menor o dano em caso de vazamento. Senhas são guardadas só como hash (US01), e o nome completo, embora armazenado, nunca é exibido no totem nem no painel.

### 2.2 Dados obrigatórios e opcionais

| Entidade | Obrigatórios | Opcionais | Por quê |
| --- | --- | --- | --- |
| CIDADAO | CPF, data de nascimento | Cartão SUS, senha, Gov.br, bloqueio | US01: o cadastro exige CPF e nascimento; quem entra só pelo Gov.br não tem senha |
| USUARIO_INSTITUCIONAL | login, senha, perfil, unidade | — | RNF01: acesso só com login institucional |
| ENCAMINHAMENTO | protocolo, status, cidadão, especialidade, UBS de origem, unidade de destino | — | US02: a tela sempre mostra protocolo e etapa; US03: a unidade é definida no encaminhamento |
| AGENDAMENTO | encaminhamento, horário, status | data de cancelamento, agendamento de origem | a data de cancelamento só existe quando o status é CANCELADO; a origem só quando houve reagendamento |
| HISTORICO_STATUS | status novo, data e hora | status anterior, responsável | anterior nulo = criação; responsável nulo = ação do sistema ou do cidadão |
| UNIDADE_SAUDE | nome, tipo, endereço | CNES, complemento | nem toda unidade tem complemento no endereço |

### 2.3 Atributos multivalorados

Sim. O contato do cidadão é multivalorado: uma pessoa pode ter celular, telefone fixo e e-mail. Um atributo multivalorado não cabe numa coluna sem quebrar a 1ª forma normal, então virou a entidade CONTATO_CIDADAO, ligada ao CIDADAO (1 : 0..N). Ela prepara a notificação por SMS ou WhatsApp que o backlog deixou para uma sprint futura.

O histórico de status também é, conceitualmente, um atributo multivalorado do encaminhamento; como cada valor tem data e responsável, virou a entidade HISTORICO_STATUS.

### 2.4 Atributos compostos e como foram tratados

Sim. O endereço da unidade de saúde é composto (logradouro, número, complemento, bairro, cidade, UF, CEP). Foi decomposto em atributos atômicos dentro de UNIDADE_SAUDE, em vez de um texto único, para permitir filtrar por bairro ou cidade e validar UF e CEP. O nome do cidadão foi mantido como atributo simples, porque nenhuma regra do sistema usa nome e sobrenome separados.

### 2.5 Regras de negócio garantidas pelo modelo

| Regra | Origem | Como o modelo garante |
| --- | --- | --- |
| CPF e Cartão SUS do mesmo cidadão levam ao mesmo cadastro | US01 | atributos únicos |
| Só 4 etapas internas do encaminhamento | US02 | domínio fechado de valores |
| No máximo 1 horário ativo por encaminhamento | US03 | unicidade só entre agendamentos ativos |
| Horário confirmado some para os outros cidadãos | US03 | unicidade só entre agendamentos ativos, por horário |
| Só horários da especialidade e da unidade de destino do encaminhamento | US03 | o agendamento só é aceito se especialidade e unidade forem iguais no encaminhamento e no horário |
| Cada registro do histórico é uma mudança real de etapa | US05 | status anterior diferente do novo |

Regras que dependem do relógio ou de contagem (horário no passado, prazo de 24 h para cancelar, limite de 2 reagendamentos) ficam na camada Java.

## 3. Ferramenta de modelagem

O modelo foi feito no Oracle SQL Developer Data Modeler, a ferramenta preferencial do enunciado, com o banco Oracle Database 21c e a notação Barker. O processo:

1. importação do script de criação das tabelas, gerando o modelo relacional com as 11 tabelas e 17 chaves estrangeiras;
2. engenharia reversa para o modelo lógico (11 entidades);
3. montagem da especialização: CIDADAO e USUARIO_INSTITUCIONAL com supertipo PESSOA, substituindo as duas relações 1:1;
4. ajuste da cardinalidade do autorrelacionamento “reagendado de” para 0..1 : 0..1;
5. organização do layout e exportação da imagem e do PDF; projeto salvo como minha_vez.dmd.

![](attachment:2c3edb6a-1f01-4975-adc9-07c93bffc493:images97aa4aac-6b5d-4b01-a8ef-3e4cea08d00d-07_1001_1743_886_162.jpg)

Figura 1 - Modelo relacional importado no Data Modeler (11 tabelas).

![](attachment:dc34530c-9d13-47e2-954d-6d518599ed61:images97aa4aac-6b5d-4b01-a8ef-3e4cea08d00d-08_1501_1069_175_498.jpg)

Figura 2 - Navegador do projeto no Data Modeler: 11 entidades, 15 relações e 2 heranças.

![](attachment:bf5bb22d-7f8f-4e95-b57a-b01c8c631328:images97aa4aac-6b5d-4b01-a8ef-3e4cea08d00d-09_940_1745_173_161.jpg)

Figura 3 - Modelo lógico no Data Modeler, com a especialização de PESSOA.

## 4. Diagrama de Modelo Lógico (imagem exportada)

![](attachment:fc872a6b-f00d-4e5e-a9dd-8bfdb6be44a2:images97aa4aac-6b5d-4b01-a8ef-3e4cea08d00d-10_1091_2654_314_149.jpg)

Figura 4 - Diagrama de Modelo Lógico do Minha Vez, exportado do Data Modeler (modelo-logico.png). Notação Barker: # identificador, * obrigatório, o opcional, U único; linha contínua = participação obrigatória daquele lado, tracejada = opcional; o pé de galinha marca o lado “muitos”.

## 5. Coerência com requisitos e casos de uso

| Caso de uso (Fase 2) | Entidades envolvidas |
| --- | --- |
| Identificar-se | CIDADAO (CPF, Cartão SUS, nascimento, senha, Gov.br) |
| Acompanhar status do encaminhamento | ENCAMINHAMENTO, HISTORICO_STATUS |
| Agendar, reagendar e cancelar | HORARIO_DISPONIVEL, AGENDAMENTO, ENCAMINHAMENTO |
| Consultar horários disponíveis | HORARIO_DISPONIVEL sem AGENDAMENTO ativo |
| Autenticar-se no painel institucional | USUARIO_INSTITUCIONAL |
| Atualizar status e gerenciar a fila | ENCAMINHAMENTO, HISTORICO_STATUS |
| Chamar paciente e visualizar a chamada | CHAMADA |
| Visualizar indicadores | consultas sobre HISTORICO_STATUS e AGENDAMENTO |

| User story | Como o modelo atende |
| --- | --- |
| US01 - Identificação | CPF e Cartão SUS únicos; senha só como hash; Gov.br; bloqueio após 5 tentativas |
| US02 - Acompanhamento | protocolo, 4 etapas, selo de urgência e histórico; sem CID nem laudo |
| US03 - Agendamento | vagas por especialidade e unidade; 1 horário ativo por encaminhamento; reagendamento rastreável |
| US04 - Chamada | CHAMADA com senha e sala, sem nome |
| US05 - Painel gerencial | servidor lotado na unidade; histórico com responsável e data; indicadores calculados |

## 6. Arquivos entregues

| Arquivo | O que é |
| --- | --- |
| modelo-logico.png | Imagem exportada do modelo (4766 × 1988 px) |
| modelo-logico.pdf | O mesmo diagrama em PDF vetorial |
| minha_vez.dmd + pasta minha_vez/ | Projeto do Oracle SQL Developer Data Modeler (abrir o .dmd com a pasta ao lado) |
| minha_vez_ddl.sql | Script usado para gerar o modelo na ferramenta |

# **Parte 3: Aplicação das Formas Normais**

## 1. Avaliação das possíveis anomalias

Se o sistema guardasse tudo numa tabela só, ela teria esta forma (dados fictícios):

| PROTOCOLO | CPF | NOME | CONTATOS | ESPECIALIDADE | UNIDADE_DESTINO | ENDERECO_DESTINO | DATA_HORA_VAGA | STATUS_AGENDAMENTO | HISTORICO |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P-001 | CPF-A | Maria Silva | (11) 90000-0001, maria@email.com | Cardiologia | Amb. Especialidades Centro | Rua A, 100, Centro, São Paulo, SP, 01000-000 | 05/11 09:00 | ATIVO | Recebido → Agendado |
| P-002 | CPF-A | Maria Silva | (11) 90000-0001, maria@email.com | Ortopedia | Amb. Especialidades Centro | Rua A, 100, Centro, São Paulo, SP, 01000-000 | (sem vaga) | (nenhum) | Recebido |
| P-003 | CPF-B | José Souza | (11) 90000-0002 | Cardiologia | Amb. Leste | Av. B, 50, Penha, São Paulo, SP, 03000-000 | 06/11 14:00 | ATIVO | Recebido → Agendado |

### 1.1 Anomalia de inserção

Não dá para guardar um dado sem inventar outro que ainda não existe.

| Situação | Por que a tabela única impede | Regra do sistema afetada |
| --- | --- | --- |
| Cadastrar um cidadão que ainda não tem encaminhamento | Toda linha exige PROTOCOLO, ESPECIALIDADE e UNIDADE_DESTINO | US02: o estado “sem encaminhamento” existe e precisa ser mostrado |
| Publicar uma vaga que ninguém reservou | A vaga só existe dentro de uma linha de encaminhamento, e uma linha exige cidadão | US03: o estado “sem vagas” e a lista de horários livres |
| Cadastrar uma nova unidade ou especialidade | Só existem como texto repetido em linhas de encaminhamentos | US03: vagas por especialidade e unidade |
| Registrar o primeiro histórico de um pedido | Histórico é uma lista dentro da linha, sem lugar para data e responsável de cada mudança | US05: auditoria de quem mudou a etapa e quando |

### 1.2 Anomalia de exclusão

Apagar um dado faz sumir outro que deveria continuar existindo.

| Situação | O que se perde junto | Regra do sistema afetada |
| --- | --- | --- |
| Excluir o único encaminhamento de José Souza (linha P-003) | O cadastro do cidadão, o contato e a única vaga e o endereço do Amb. Leste | US01 e US03 |
| Cancelar o agendamento e apagar a linha da vaga | O registro de qual horário foi cancelado | US03: reagendamento rastreável |
| Concluir e arquivar o último pedido de uma especialidade | A própria especialidade e as vagas dela | US03 |

### 1.3 Anomalia de alteração

O mesmo fato aparece em várias linhas, então uma alteração precisa ser feita em todas, e basta esquecer uma para o banco ficar com duas versões da verdade.

| Situação | Quantas linhas mudam | Inconsistência possível |
| --- | --- | --- |
| Maria troca de celular | Uma linha por encaminhamento dela (P-001 e P-002) | Um pedido com o número novo e outro com o antigo |
| O Amb. Especialidades Centro muda de endereço | Uma linha por encaminhamento e por vaga naquela unidade | Dois endereços para a mesma unidade |
| A especialidade “Cardiologia” é renomeada | Todas as linhas dela | Duas grafias da mesma especialidade, e a lista de vagas deixa de agrupar |
| O nome de Maria é corrigido | Uma linha por encaminhamento | Nome diferente por pedido |

A causa é a mesma nos três casos: a tabela mistura fatos de assuntos diferentes (cidadão, encaminhamento, vaga, unidade, especialidade) e repete cada um deles. As formas normais separam esses assuntos.

## 2. Aplicação das formas normais

### 2.1 Dependências funcionais identificadas

Antes de normalizar, listamos o que determina o quê no domínio do Minha Vez (A → B lê-se “A determina B”):

| Determinante | Determina |
| --- | --- |
| CPF (ou Cartão SUS, ou ID Gov.br) | nome, data de nascimento, credenciais, tentativas de login, bloqueio |
| PROTOCOLO | cidadão, especialidade, UBS de origem, unidade de destino, status, urgência, data de criação |
| ID_HORARIO | data e hora, especialidade, unidade onde acontece |
| ID_AGENDAMENTO | encaminhamento, horário, status, data de criação, data de cancelamento, agendamento de origem |
| ID_ENCAMINHAMENTO + data e hora | status anterior, status novo, responsável (cada linha do histórico) |
| ID_UNIDADE | nome, tipo, CNES, número, complemento, CEP |
| CEP | logradouro, bairro, cidade, UF |
| ID_ESPECIALIDADE | nome |

### 2.2 Primeira forma normal (1FN)

Regra: todo atributo é atômico (um valor por célula), não há grupos repetidos, e cada tabela tem chave primária.

Violações na tabela única:

| Violação | Onde aparece | Correção |
| --- | --- | --- |
| Atributo multivalorado | CONTATOS guarda celular, telefone e e-mail na mesma célula | Nova tabela CONTATO_CIDADAO (tipo, valor, principal), ligada ao cidadão 1 : 0..N |
| Grupo repetido | HISTORICO guarda a sequência de etapas numa célula, sem data nem responsável | Nova tabela HISTORICO_STATUS, com uma linha por mudança de etapa |
| Atributo composto | ENDERECO_DESTINO guarda rua, número, bairro, cidade, UF e CEP como texto único | Atributos atômicos: logradouro, número, complemento, bairro, cidade, UF e CEP |
| Sem chave | A tabela não tem identificador | Chaves primárias (ID_ENCAMINHAMENTO etc.) e chaves alternativas únicas (CPF, protocolo, login) |

Depois da 1FN, os valores da tabela são atômicos, mas ela continua misturando assuntos. Como um encaminhamento pode ter mais de uma ocupação de vaga ao longo do tempo (cancela, reagenda) e uma mesma vaga pode ter mais de uma ocupação (cancelada e depois reocupada), a chave da tabela resultante passa a ser composta: (encaminhamento, horário). É isso que abre caminho para a 2FN.

### 2.3 Segunda forma normal (2FN)

Regra: já em 1FN, todo atributo que não é chave depende da chave inteira, e não de apenas uma parte dela. Só faz sentido quando a chave é composta.

Com a chave (encaminhamento, horário), aparecem dependências parciais:

| Atributo | Depende de | Parte da chave |
| --- | --- | --- |
| CPF, nome do cidadão, especialidade, unidade de origem e destino, status, urgência | só do encaminhamento | encaminhamento |
| Data e hora da vaga, especialidade e unidade da vaga | só do horário | horário |
| Status do agendamento, data de criação, data de cancelamento | do par (encaminhamento, horário) | chave inteira |

Correção: cada grupo vai para a sua tabela.

| Antes | Depois | Observação |
| --- | --- | --- |
| uma linha só | ENCAMINHAMENTO | fatos do pedido |
| uma linha só | HORARIO_DISPONIVEL | fatos da vaga |
| uma linha só | AGENDAMENTO | o que depende do par encaminhamento + horário |

AGENDAMENTO é a entidade associativa (a agregação da Parte 2). Ela ganhou o identificador próprio ID_AGENDAMENTO em vez de usar o par como chave, porque o mesmo encaminhamento pode ocupar a mesma vaga duas vezes (cancela e marca de novo) e porque ela é referenciada por outras tabelas (CHAMADA e o autorrelacionamento “reagendado de”). Todas as outras tabelas já nascem com chave simples, então já cumprem a 2FN.

### 2.4 Terceira forma normal (3FN)

Regra: já em 2FN, nenhum atributo que não é chave depende de outro atributo que não é chave (dependência transitiva). Todo atributo deve depender “da chave, da chave inteira e nada além da chave”.

Dependências transitivas encontradas e removidas:

| Dependência transitiva | Problema | Tabela resultante |
| --- | --- | --- |
| encaminhamento → CPF → nome, data de nascimento | o nome do cidadão se repete a cada encaminhamento | PESSOA e CIDADAO |
| encaminhamento → especialidade → nome da especialidade | o nome se repete em todo encaminhamento e vaga | ESPECIALIDADE |
| encaminhamento → unidade → nome, tipo, endereço | o endereço se repete em todo encaminhamento e vaga | UNIDADE_SAUDE |
| servidor e cidadão com atributos próprios | uma tabela única de pessoas teria colunas que só valem para um dos tipos (nulas no outro) | especialização de PESSOA em CIDADAO e USUARIO_INSTITUCIONAL |

Além dessas, a revisão do modelo da Parte 2 encontrou uma dependência transitiva que ainda existia dentro de UNIDADE_SAUDE:

```
ID_UNIDADE → CEP → LOGRADOURO, BAIRRO, CIDADE, UF
```

Em UNIDADE_SAUDE, logradouro, bairro, cidade e UF não dependem da unidade diretamente: dependem do CEP, que é um atributo não chave. Duas unidades no mesmo CEP repetiriam os quatro campos, e corrigir o nome de um bairro exigiria alterar várias linhas, o que é uma anomalia de alteração. Essa foi a única alteração estrutural da Parte 3 (seção 4).

### 2.5 Forma normal de Boyce-Codd (BCNF), checagem

Regra: todo determinante é chave candidata. Conferimos os determinantes da seção 2.1:

| Determinante | É chave candidata? |
| --- | --- |
| ID_PESSOA, ID_UNIDADE, ID_ESPECIALIDADE, ID_HORARIO, ID_ENCAMINHAMENTO, ID_AGENDAMENTO, ID_HISTORICO, ID_CONTATO, ID_CHAMADA | sim, são as chaves primárias |
| CPF, CARTÃO SUS, ID GOV.BR | sim, únicos em CIDADAO |
| PROTOCOLO | sim, único em ENCAMINHAMENTO |
| LOGIN | sim, único em USUARIO_INSTITUCIONAL |
| CNES | sim, único em UNIDADE_SAUDE |
| NOME da especialidade | sim, único em ESPECIALIDADE |
| CEP | sim, chave primária da nova tabela CEP |

Com a tabela CEP, todos os determinantes são chaves candidatas, e o modelo cumpre a BCNF.

## 3. Revisão da estrutura das tabelas definidas na parte anterior

| Tabela | Chave primária | 1FN | 2FN | 3FN | Observação |
| --- | --- | --- | --- | --- | --- |
| PESSOA | ID_PESSOA | ok | ok | ok | supertipo; TIPO_PESSOA é o discriminador da especialização |
| CIDADAO | ID_PESSOA (herdada) | ok | ok | ok | CPF, Cartão SUS e Gov.br são chaves alternativas |
| USUARIO_INSTITUCIONAL | ID_PESSOA (herdada) | ok | ok | ok | login é chave alternativa; lotação é FK para UNIDADE_SAUDE |
| UNIDADE_SAUDE | ID_UNIDADE | ok | ok | **ajustada** | tinha dependência transitiva pelo CEP; ver seção 4 |
| CEP (nova) | CEP | ok | ok | ok | recebe logradouro, bairro, cidade e UF |
| ESPECIALIDADE | ID_ESPECIALIDADE | ok | ok | ok | nome único |
| HORARIO_DISPONIVEL | ID_HORARIO | ok | ok | ok | data e hora, especialidade e unidade dependem só da vaga |
| ENCAMINHAMENTO | ID_ENCAMINHAMENTO | ok | ok | ok | STATUS é redundância controlada (seção 5) |
| AGENDAMENTO | ID_AGENDAMENTO | ok | ok | ok | entidade associativa; origem do reagendamento é FK para ela mesma |
| HISTORICO_STATUS | ID_HISTORICO | ok | ok | ok | uma linha por mudança de etapa |
| CONTATO_CIDADAO | ID_CONTATO | ok | ok | ok | resolve o atributo multivalorado |
| CHAMADA | ID_CHAMADA | ok | ok | ok | ligada ao agendamento e ao servidor que chamou |

## 4. Descrição das mudanças realizadas nas tabelas

### 4.1 Nova tabela CEP e ajuste em UNIDADE_SAUDE

|  | Antes (Parte 2) | Depois (Parte 3) |
| --- | --- | --- |
| UNIDADE_SAUDE | ID_UNIDADE, NOME, TIPO_UNIDADE, CNES, LOGRADOURO, NUMERO, COMPLEMENTO, BAIRRO, CIDADE, UF, CEP | ID_UNIDADE, NOME, TIPO_UNIDADE, CNES, NUMERO, COMPLEMENTO e a chave estrangeira para CEP |
| CEP | não existia | CEP (identificador), LOGRADOURO, BAIRRO, CIDADE, UF (todos obrigatórios) |
| Relacionamento | não existia | CEP — UNIDADE_SAUDE, 1 : 0..N (um CEP pode atender várias unidades; toda unidade tem exatamente um CEP) |

Para o dicionário de dados, usando a mesma notação da Parte 2 (# identificador, * obrigatório, o opcional, U único):

| Entidade | Identificador | Obrigatórios | Opcionais |
| --- | --- | --- | --- |
| CEP | CEP | LOGRADOURO, BAIRRO, CIDADE, UF | — |
| UNIDADE_SAUDE | ID_UNIDADE | NOME, TIPO_UNIDADE (UBS ou ESPECIALIZADA), NUMERO | CNES (U), COMPLEMENTO |

A chave estrangeira para CEP aparece como relacionamento, como as demais chaves estrangeiras do modelo lógico.

Justificativa:

- Elimina a dependência transitiva ID_UNIDADE → CEP → logradouro, bairro, cidade e UF, levando a UNIDADE_SAUDE à 3FN.
- Corrigir um logradouro, bairro ou cidade passa a ser uma alteração em uma linha, e não em todas as unidades daquele CEP.
- O dado do endereço continua atômico, como foi decidido na Parte 2 (permite filtrar por bairro e cidade e validar UF e CEP). O que muda é onde cada parte mora.
- O custo é um join a mais para montar o endereço completo da unidade. É baixo: o sistema tem poucas unidades, e o endereço é lido na confirmação do agendamento (US03), não em consultas pesadas.
- A tabela CEP não exige uma base nacional de CEPs: ela é preenchida quando uma unidade é cadastrada, e pode ser reaproveitada por unidades no mesmo CEP.

### 4.2 O que não mudou

As outras 10 tabelas já cumpriam as formas normais e foram mantidas. As decisões da Parte 2 que já aplicavam normalização, e que esta parte confirma:

| Decisão da Parte 2 | Forma normal que atende |
| --- | --- |
| CONTATO_CIDADAO como tabela própria (contato multivalorado) | 1FN |
| HISTORICO_STATUS como tabela própria (histórico multivalorado) | 1FN |
| Endereço da unidade decomposto em atributos atômicos | 1FN |
| AGENDAMENTO como entidade associativa entre ENCAMINHAMENTO e HORARIO_DISPONIVEL | 2FN |
| PESSOA, CIDADAO e USUARIO_INSTITUCIONAL em vez de uma tabela única de pessoas | 3FN (sem colunas que só valem para um tipo) |
| ESPECIALIDADE e UNIDADE_SAUDE como tabelas, referenciadas por chave | 3FN |
| Indicadores (espera média, faltas, quantidade de reagendamentos) calculados, não guardados | evita dado derivado que poderia divergir da fonte |

## 5. Justificativa técnica: redundâncias mantidas de propósito (desnormalização controlada)

Normalizar não significa eliminar toda repetição. Estes são os pontos em que o modelo guarda um dado que, em teoria, poderia ser derivado, e o motivo de mantê-lo.

| Redundância | Por que existe | Como a consistência é garantida |
| --- | --- | --- |
| ENCAMINHAMENTO.STATUS (a etapa atual também é o STATUS_NOVO do último HISTORICO_STATUS) | A US02 mostra a etapa atual em toda consulta do cidadão e o painel filtra a fila por etapa. Buscar o último histórico a cada leitura seria mais caro e mais complexo | A aplicação grava o histórico e atualiza o status na mesma transação, e o histórico só aceita mudança real de etapa (status anterior diferente do novo) |
| HISTORICO_STATUS.STATUS_ANTERIOR (é o STATUS_NOVO da linha anterior) | Permite a regra “status anterior diferente do novo” como restrição simples e registra a criação do pedido (anterior nulo) | Preenchido junto com o status novo, na mesma operação |
| Especialidade e unidade presentes no ENCAMINHAMENTO e no HORARIO_DISPONIVEL | São fatos independentes (o que o cidadão precisa e o que a vaga oferece), e não uma duplicação. A US03 exige que os dois coincidam no agendamento | Restrição na criação do agendamento: só é aceito se especialidade e unidade forem iguais nos dois lados (regra já registrada na seção 2.5 da Parte 2) |

## 6. Justificativa técnica: domínios fechados sem tabela própria

Alguns atributos guardam um conjunto pequeno e fixo de valores: STATUS do encaminhamento (4 etapas internas, US02), STATUS do agendamento, TIPO_UNIDADE (UBS ou ESPECIALIZADA), PERFIL (ATENDENTE ou GESTOR) e TIPO_CONTATO. Foram mantidos como colunas com restrição de domínio (valores permitidos), e não como tabelas de apoio.

Justificativa: o valor repetido não é um fato com atributos próprios que possa ficar desatualizado (não existe “renomear a etapa Agendado” em várias linhas, porque o conjunto é definido pelas regras do sistema), então não há anomalia de alteração a evitar. Criar tabelas de apoio acrescentaria joins e chaves estrangeiras sem reduzir redundância real. Pelo mesmo raciocínio, não foram criadas tabelas separadas para cidade e UF (o CEP já resolve a dependência) nem para sala da chamada (SALA só tem um nome, sem outros atributos). Se a sala ganhar atributos no futuro, vira tabela.

## 7. Resultado: anomalias antes e depois da normalização

| Anomalia | Na tabela única | No modelo normalizado |
| --- | --- | --- |
| Inserção: cidadão sem encaminhamento | impossível | CIDADAO existe sem linha em ENCAMINHAMENTO |
| Inserção: vaga sem reserva | impossível | HORARIO_DISPONIVEL existe sem AGENDAMENTO |
| Inserção: unidade ou especialidade nova | só dentro de um encaminhamento | UNIDADE_SAUDE e ESPECIALIDADE são independentes |
| Exclusão: apagar o último pedido perde cidadão, contato, vaga e unidade | acontece | cada fato mora na sua tabela; apagar o encaminhamento não apaga os outros |
| Exclusão: cancelar perde qual horário foi cancelado | acontece | o AGENDAMENTO cancelado continua apontando para a vaga e guarda a data de cancelamento |
| Alteração: trocar telefone, nome, endereço, CEP ou nome de especialidade | várias linhas | uma linha em CONTATO_CIDADAO, PESSOA, CEP ou ESPECIALIDADE |

# Parte 4: Modelo Físico de Dados do Minha Vez

O modelo físico parte do modelo lógico da Parte 2 e do ajuste da Parte 3. Nenhum requisito
novo entra aqui. O que muda é a forma de mostrar o mesmo banco: a Parte 2 desenha entidades
e relacionamentos; esta parte desenha tabelas, colunas, tipos e chaves.

## 4.1. O que o físico acrescenta em relação ao lógico

No lógico, a chave estrangeira é a linha entre duas entidades. `ID_CIDADAO` não aparece
dentro de `ENCAMINHAMENTO`. No físico, essa linha vira coluna, com tipo e com a restrição
de chave estrangeira.

| No lógico (Parte 2) | No físico (Parte 4) |
| --- | --- |
| Entidade | Tabela |
| Atributo, com `#`, `*`, `o` ou `U` | Coluna, com tipo (`NUMBER`, `VARCHAR2`, `CHAR`, `DATE`, `TIMESTAMP`) e `NOT NULL` quando o lógico marca `*` |
| Relacionamento | Coluna de chave estrangeira e restrição `FOREIGN KEY` |
| Especialização de `PESSOA` | Três tabelas. `CIDADAO` e `USUARIO_INSTITUCIONAL` usam `ID_PESSOA` como chave primária e estrangeira |
| “No máximo um agendamento ativo” | Índice único que só olha as linhas com `STATUS = 'AGENDADO'` |

## 4.2. O que a Parte 3 mudou antes de desenhar o físico

A Parte 3 revisou as formas normais e fez uma alteração estrutural. Logradouro, bairro,
cidade e UF saíram de `UNIDADE_SAUDE`. Eles dependem do CEP, não do identificador da
unidade. A tabela nova é `CEP`.

|  | Parte 2 | Parte 4, depois da Parte 3 |
| --- | --- | --- |
| `UNIDADE_SAUDE` | nome, tipo, CNES, logradouro, número, complemento, bairro, cidade, UF, CEP | nome, tipo, CNES, número, complemento e a chave estrangeira `CEP` |
| `CEP` | não existia | `CEP` (identificador), logradouro, bairro, cidade, UF, todos obrigatórios |
| Cardinalidade | o CEP era só uma coluna | `CEP` 1 : 0..N `UNIDADE_SAUDE`. Toda unidade tem um CEP. Um CEP pode servir a várias unidades |

`CEP` é preenchida quando uma unidade é cadastrada. Não é uma base dos Correios. No
cadastro do Minha Vez, um CEP determina a rua, o bairro, a cidade e a UF. Duas unidades
no mesmo CEP compartilham essa rua. Cidade e UF acompanham o CEP de forma estável.
Logradouro e bairro valem para as unidades que o grupo cadastrar: um CEP genérico de
cidade inteira, no mundo real, pode cobrir mais de uma rua.

O modelo passa de 11 tabelas para 12, e de 17 chaves estrangeiras para 18. A 18ª é
`FK_UNIDADE_CEP`.

## 4.3. Tabelas

`PK` é chave primária, `FK` é estrangeira, `UK` é única, `CK` é a lista fechada de
valores. Coluna sem “nulo” é obrigatória.

### CEP

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| CEP | CHAR(8) | PK |
| LOGRADOURO | VARCHAR2(120) |  |
| BAIRRO | VARCHAR2(60) |  |
| CIDADE | VARCHAR2(60) |  |
| UF | CHAR(2) |  |

### UNIDADE_SAUDE

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| ID_UNIDADE | NUMBER(10) | PK |
| NOME | VARCHAR2(120) |  |
| CNES | CHAR(7) | UK, nulo |
| TIPO_UNIDADE | VARCHAR2(15) | CK: `UBS`, `ESPECIALIZADA` |
| NUMERO | VARCHAR2(10) |  |
| COMPLEMENTO | VARCHAR2(60) | nulo |
| CEP | CHAR(8) | FK → CEP |

### PESSOA, CIDADAO e USUARIO_INSTITUCIONAL

A especialização do lógico vira três tabelas, com a mesma chave `ID_PESSOA`.

| Tabela | Colunas próprias | Chaves |
| --- | --- | --- |
| PESSOA | NOME, TIPO_PESSOA (`C` ou `U`), DATA_CADASTRO | PK `ID_PESSOA` |
| CIDADAO | CPF, CARTAO_SUS, DATA_NASCIMENTO, SENHA_HASH, ID_GOV_BR, TENTATIVAS_LOGIN, BLOQUEADO_ATE | PK e FK `ID_PESSOA`. CPF, Cartão SUS e Gov.br únicos. Tentativas de 0 a 5 |
| USUARIO_INSTITUCIONAL | ID_UNIDADE, LOGIN, SENHA_HASH, PERFIL | PK e FK `ID_PESSOA`. FK para a unidade de lotação. Login único. Perfil `ATENDENTE` ou `GESTOR` |

Cartão SUS, senha, Gov.br e bloqueio continuam opcionais, como no lógico: quem entra só
pelo Gov.br não tem senha.

### CONTATO_CIDADAO, ESPECIALIDADE e HORARIO_DISPONIVEL

| Tabela | Colunas | Chaves |
| --- | --- | --- |
| CONTATO_CIDADAO | ID_CONTATO, ID_CIDADAO, TIPO_CONTATO, VALOR, PRINCIPAL | PK `ID_CONTATO`. FK para o cidadão. Tipo `CELULAR`, `TELEFONE` ou `EMAIL`. Único em cidadão + tipo + valor |
| ESPECIALIDADE | ID_ESPECIALIDADE, NOME | PK e nome único |
| HORARIO_DISPONIVEL | ID_HORARIO, ID_ESPECIALIDADE, ID_UNIDADE, DATA_HORA | PK. FKs para especialidade e unidade. Não há duas vagas no mesmo instante, na mesma especialidade e na mesma unidade |

### ENCAMINHAMENTO e AGENDAMENTO

`ENCAMINHAMENTO` guarda protocolo (único), data de criação, status, urgência, cidadão,
especialidade, unidade de origem e unidade de destino. O status só aceita as quatro
etapas da US02. Urgência é `S` ou `N`, padrão `N`.

`AGENDAMENTO` guarda o encaminhamento, o horário, a especialidade, a unidade, o
agendamento de origem (opcional), o status (`AGENDADO`, `CANCELADO`, `CONCLUIDO` ou
`FALTA`), a data de criação e a data de cancelamento. A data de cancelamento existe só
quando o status é `CANCELADO`.

`ID_ESPECIALIDADE` e `ID_UNIDADE` em `AGENDAMENTO` são redundância controlada. A Parte 3
não tirou essas colunas. Elas entram nas duas chaves estrangeiras compostas, e o banco só
aceita o agendamento quando a especialidade e a unidade são as mesmas do encaminhamento e
do horário. É a regra da US03 que a Parte 2 já garantia e a Parte 3 manteve.

O reagendamento continua o autorrelacionamento da Parte 2: `ID_AGENDAMENTO_ORIGEM` aponta
para o agendamento cancelado, no mesmo encaminhamento, no máximo uma vez, e nunca para si
mesmo.

Dois índices únicos olham só as linhas `AGENDADO`: um por encaminhamento e um por
horário. O cancelado continua apontando para a vaga.

### HISTORICO_STATUS e CHAMADA

`HISTORICO_STATUS` guarda o encaminhamento, o status anterior (nulo na criação), o status
novo, a data e hora e o responsável (nulo quando a mudança é do sistema ou do cidadão).
Status anterior e status novo são diferentes. A Parte 3 manteve o status anterior: ele
registra a criação e permite essa restrição sem consultar a linha de cima.

`CHAMADA` guarda senha, sala, data e hora, o agendamento e o servidor que chamou.

## 4.4. Chaves estrangeiras

| Nome | De | Para |
| --- | --- | --- |
| FK_UNIDADE_CEP | UNIDADE_SAUDE (CEP) | CEP |
| FK_CIDADAO_PESSOA | CIDADAO (ID_PESSOA) | PESSOA |
| FK_USUARIO_PESSOA | USUARIO_INSTITUCIONAL (ID_PESSOA) | PESSOA |
| FK_USUARIO_UNIDADE | USUARIO_INSTITUCIONAL (ID_UNIDADE) | UNIDADE_SAUDE |
| FK_CONTATO_CIDADAO | CONTATO_CIDADAO (ID_CIDADAO) | CIDADAO |
| FK_HORARIO_ESPECIALIDADE | HORARIO_DISPONIVEL (ID_ESPECIALIDADE) | ESPECIALIDADE |
| FK_HORARIO_UNIDADE | HORARIO_DISPONIVEL (ID_UNIDADE) | UNIDADE_SAUDE |
| FK_ENCAM_CIDADAO | ENCAMINHAMENTO (ID_CIDADAO) | CIDADAO |
| FK_ENCAM_ESPECIALIDADE | ENCAMINHAMENTO (ID_ESPECIALIDADE) | ESPECIALIDADE |
| FK_ENCAM_UNIDADE_ORIGEM | ENCAMINHAMENTO (ID_UNIDADE_ORIGEM) | UNIDADE_SAUDE |
| FK_ENCAM_UNIDADE_DESTINO | ENCAMINHAMENTO (ID_UNIDADE_DESTINO) | UNIDADE_SAUDE |
| FK_AGEND_ENCAMINHAMENTO | AGENDAMENTO (encaminhamento, especialidade, unidade) | ENCAMINHAMENTO (encaminhamento, especialidade, unidade de destino) |
| FK_AGEND_HORARIO | AGENDAMENTO (horário, especialidade, unidade) | HORARIO_DISPONIVEL (horário, especialidade, unidade) |
| FK_AGEND_ORIGEM | AGENDAMENTO (origem, encaminhamento) | AGENDAMENTO (id, encaminhamento) |
| FK_HIST_ENCAMINHAMENTO | HISTORICO_STATUS (ID_ENCAMINHAMENTO) | ENCAMINHAMENTO |
| FK_HIST_RESPONSAVEL | HISTORICO_STATUS (ID_RESPONSAVEL) | USUARIO_INSTITUCIONAL |
| FK_CHAMADA_AGENDAMENTO | CHAMADA (ID_AGENDAMENTO) | AGENDAMENTO |
| FK_CHAMADA_USUARIO | CHAMADA (ID_USUARIO) | USUARIO_INSTITUCIONAL |

## 4.5. O que a Parte 3 pediu para manter

| Redundância | Por que fica | Como não diverge |
| --- | --- | --- |
| `ENCAMINHAMENTO.STATUS` | a tela da US02 e a fila leem a etapa atual sem buscar o último histórico | a aplicação grava o histórico e o status na mesma operação |
| `HISTORICO_STATUS.STATUS_ANTERIOR` | registra a criação (anterior nulo) e a mudança real de etapa | preenchido junto com o status novo |
| Especialidade e unidade em `AGENDAMENTO` | a US03 exige que a vaga seja a da especialidade e da unidade do encaminhamento | as duas chaves estrangeiras compostas |

Status, tipo de unidade, perfil e tipo de contato continuam coluna com `CHECK`. A Parte 3
não criou tabela para esses domínios: o conjunto é fixo e não tem atributos próprios.

Horário no passado, prazo de 24 h, limite de dois reagendamentos, ordem das etapas,
dígito de CPF e Cartão SUS e o bloqueio de 15 minutos continuam no Java. Espera média,
faltas e quantidade de reagendamentos continuam calculados. CID, laudo e prontuário
continuam de fora.

## 4.6. Diagrama de modelo físico

!minha_vez_fisico.png

Figura 1. Diagrama de modelo físico do Minha Vez, exportado do Oracle SQL Developer Data
Modeler. Doze tabelas, com colunas, tipos e chaves. `CEP` é a tabela nova da Parte 3.

# **Parte 5: Scripts SQL de criação do Minha Vez**

O script desta parte cria o banco desenhado na Parte 4. Nenhuma tabela, coluna ou restrição

nova entra aqui. O arquivo é o mesmo `minha_vez_fisico.sql` importado no Oracle SQL Developer

Data Modeler para gerar a figura da Parte 4. O desenho e o SQL descrevem a mesma estrutura.

O modelo da Parte 2 não foi alterado. Ele continua com as 11 tabelas e com o endereço dentro de `UNIDADE_SAUDE`. O script desta parte é o de 12 tabelas, com `CEP`.

O arquivo está no repositório, em `docs\modelo-fisico\minha_vez_fisico.sql` .