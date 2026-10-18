# Parte 2 — Modelo Lógico de Dados do Minha Vez

o diagrama de casos de uso, o diagrama de classes e o recorte Java em
`src/backend/src/main/java/com/hackgov/backend/domain`. Nada aqui cria requisito novo. Onde o modelo vai além do
Java, a coluna "Origem" aponta a regra da user story que justifica o dado.

Artefatos desta pasta:

| Arquivo                              | O que é                                                           |
| ------------------------------------ | ----------------------------------------------------------------- |
| `minha_vez_ddl.sql`                  | DDL Oracle do modelo, para importar no SQL Developer Data Modeler |
| `modelo-logico.png`                  | Rascunho da imagem do modelo (gerado de `diagrama-er.html`)       |
| `diagrama-er.html`                   | Fonte do rascunho da imagem                                       |
| `minha_vez.dmd` + pasta `minha_vez/` | **A gerar pelo grupo** no Data Modeler (ver seção 7)              |

## 1. Entidades

| Entidade              | Papel no sistema                                               | Origem                              |
| --------------------- | -------------------------------------------------------------- | ----------------------------------- |
| PESSOA                | Supertipo com o que cidadão e servidor têm em comum (id, nome) | classe abstrata `Pessoa`            |
| CIDADAO               | Quem acompanha e agenda o encaminhamento                       | `Cidadao`, US01                     |
| USUARIO_INSTITUCIONAL | Equipe da UBS (Atendente) e Gestor                             | `UsuarioInstitucional`, US05, RNF01 |
| UNIDADE_SAUDE         | UBS de origem e unidade onde o horário acontece                | US03 (confirmação mostra a unidade) |
| ESPECIALIDADE         | Cardiologia, Ortopedia etc.                                    | `Especialidade`                     |
| HORARIO_DISPONIVEL    | Cada vaga publicada para uma especialidade                     | `HorarioDisponivel`, US03           |
| ENCAMINHAMENTO        | O pedido acompanhado pelo cidadão, com protocolo e status      | `Encaminhamento`, US02              |
| AGENDAMENTO           | Ocupação de um horário por um encaminhamento                   | `Agendamento`, US03                 |
| HISTORICO_STATUS      | Trilha de auditoria de cada mudança de etapa                   | `HistoricoStatus`, US05             |
| CONTATO_CIDADAO       | Telefones e e-mails do cidadão (atributo multivalorado)        | notificação, sprint futura da US03  |
| CHAMADA               | Senha e sala exibidas no painel da sala de espera              | US04, caso de uso "Chamar paciente" |

Indicadores do gestor (espera média, faltas) **não viram tabela**: são calculados a partir de
HISTORICO_STATUS (datas de entrada e saída de cada etapa) e de AGENDAMENTO (status `FALTA`). Guardar o
número pronto criaria um dado que pode divergir da fonte.

## 2. Relacionamentos e cardinalidades

| Relacionamento                              | Cardinalidade                   | Leitura                                                                                                           |
| ------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| PESSOA — CIDADAO / USUARIO_INSTITUCIONAL    | especialização total e disjunta | toda pessoa é exatamente um dos dois                                                                              |
| UNIDADE_SAUDE — USUARIO_INSTITUCIONAL       | 1 : 0..N                        | cada servidor é lotado em uma unidade                                                                             |
| CIDADAO — CONTATO_CIDADAO                   | 1 : 0..N                        | contato é opcional                                                                                                |
| CIDADAO — ENCAMINHAMENTO                    | 1 : 0..N                        | estado "sem encaminhamento" existe (US02)                                                                         |
| ESPECIALIDADE — ENCAMINHAMENTO              | 1 : 0..N                        | cada encaminhamento é para uma especialidade                                                                      |
| UNIDADE_SAUDE — ENCAMINHAMENTO              | 1 : 0..N                        | a UBS que originou o pedido                                                                                       |
| ESPECIALIDADE — HORARIO_DISPONIVEL          | 1 : 0..N                        | estado "sem vagas" existe (US03)                                                                                  |
| UNIDADE_SAUDE — HORARIO_DISPONIVEL          | 1 : 0..N                        | onde a vaga acontece                                                                                              |
| ENCAMINHAMENTO — AGENDAMENTO                | 1 : 0..N, **no máximo 1 ativo** | cancelados ficam como histórico                                                                                   |
| HORARIO_DISPONIVEL — AGENDAMENTO            | 1 : 0..N, **no máximo 1 ativo** | a mesma vaga não serve a dois cidadãos                                                                            |
| AGENDAMENTO — AGENDAMENTO ("reagendado de") | 0..1 : 0..1                     | autorrelacionamento: o novo agendamento aponta para o que ele substituiu                                          |
| ENCAMINHAMENTO — HISTORICO_STATUS           | 1 : 0..N                        | o banco permite registrar a criação (status anterior nulo), mas não obriga; registrar sempre é regra da aplicação |
| USUARIO_INSTITUCIONAL — HISTORICO_STATUS    | 0..1 : 0..N                     | responsável nulo = mudança automática                                                                             |
| AGENDAMENTO — CHAMADA                       | 1 : 0..N                        | o paciente pode ser chamado mais de uma vez                                                                       |
| USUARIO_INSTITUCIONAL — CHAMADA             | 1 : 0..N                        | quem chamou                                                                                                       |

### Especialização

PESSOA é especializada em CIDADAO e USUARIO_INSTITUCIONAL, espelhando a herança do diagrama de classes. É
**total** (não existe pessoa avulsa, `Pessoa` é abstrata) e **disjunta** (o discriminador `TIPO_PESSOA` vale
`C` ou `U`). No modelo relacional foi usada uma tabela por subtipo com chave primária compartilhada: os
atributos de cada subtipo são obrigatórios na sua própria tabela, o que não seria possível com uma tabela única
cheia de colunas nulas.

### Agregação

O relacionamento N:M entre ENCAMINHAMENTO e HORARIO_DISPONIVEL ("ocupa") tem atributos próprios (status,
data de criação, data de cancelamento) e participa de outro relacionamento (é ele que é chamado no painel). Por
isso foi tratado como **agregação**, materializada na entidade associativa AGENDAMENTO, que se relaciona
com CHAMADA.

### Reagendamento (autorrelacionamento)

Reagendar não altera o agendamento existente. O agendamento atual é encerrado como `CANCELADO`, com data de
cancelamento, e um novo é criado com `ID_AGENDAMENTO_ORIGEM` apontando para ele. Assim:

- o histórico fica completo: cada horário que o cidadão já ocupou continua registrado;
- reagendamento e "cancelar e marcar de novo" ficam distinguíveis: só o reagendamento preenche a origem;
- a quantidade de reagendamentos de um encaminhamento é **contada** (agendamentos com origem preenchida), em
  vez de guardada num contador que poderia divergir, pelo mesmo motivo dos indicadores da seção 1.

A origem precisa ser do mesmo encaminhamento (FK composta `(ID_AGENDAMENTO_ORIGEM, ID_ENCAMINHAMENTO)`), um
agendamento é substituído no máximo uma vez (`UNIQUE` na origem) e não pode apontar para si mesmo (`CHECK`).

## 3. Reflexão sobre os dados

### O que precisa ser armazenado

O suficiente para três perguntas: quem é o cidadão (identificação no totem e no app), em que pé está o pedido
(status atual e a trilha de mudanças) e qual vaga ele ocupa. Mais o que a US05 exige para auditoria: quem
mudou a etapa e quando.

**O que deliberadamente não é armazenado:** CID, laudo e prontuário. A US02 exclui esses dados das telas e
o RNF01 restringe dado clínico ao canal institucional; o Minha Vez acompanha o fluxo, não substitui o
prontuário. Nome completo é guardado, mas nunca exibido no totem ou no painel (regra de tela, não de banco).
Senhas só como hash (US01).

### Obrigatórios e opcionais

| Entidade              | Obrigatórios                                             | Opcionais                                   | Por quê                                                                                                                               |
| --------------------- | -------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| CIDADAO               | CPF, data de nascimento                                  | Cartão SUS, senha, Gov.br, bloqueio         | US01: cadastro exige CPF e nascimento; quem entra só pelo Gov.br não tem senha, quem entra só pelo app pode não informar o Cartão SUS |
| USUARIO_INSTITUCIONAL | login, senha, perfil, unidade                            | —                                           | RNF01: acesso só com login institucional                                                                                              |
| ENCAMINHAMENTO        | protocolo, status, cidadão, especialidade, UBS de origem | —                                           | US02: a tela sempre mostra protocolo e etapa                                                                                          |
| AGENDAMENTO           | encaminhamento, horário, especialidade, status           | data de cancelamento, agendamento de origem | data de cancelamento só quando status = CANCELADO (CHECK); origem só quando o agendamento veio de um reagendamento                    |
| HISTORICO_STATUS      | status novo, data/hora                                   | status anterior, responsável                | anterior nulo = criação; responsável nulo = ação do sistema ou do cidadão                                                             |
| UNIDADE_SAUDE         | nome, tipo, endereço                                     | CNES, complemento                           | —                                                                                                                                     |

### Atributos multivalorados

**Contato do cidadão** (um cidadão pode ter celular, telefone fixo e e-mail). Atributo multivalorado não cabe
em uma coluna sem quebrar a 1ª forma normal, então virou a entidade CONTATO_CIDADAO, com chave estrangeira
para CIDADAO. Ela prepara a notificação por SMS/WhatsApp que o backlog deixou para uma sprint futura.

O **histórico de status** também é, conceitualmente, um atributo multivalorado do encaminhamento; como cada
valor tem data e responsável, virou entidade (HISTORICO_STATUS).

### Atributos compostos

**Endereço da unidade** (logradouro, número, complemento, bairro, cidade, UF, CEP). Foi decomposto em
colunas atômicas dentro de UNIDADE_SAUDE, em vez de um texto único, para permitir filtrar por bairro ou cidade
e validar UF e CEP. **Nome** do cidadão foi mantido como atributo simples, porque nenhuma regra usa nome e
sobrenome separados.

### Regras de negócio levadas para o banco

| Regra                                                                             | Origem                          | Como o banco garante                                                                                             |
| --------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| CPF e Cartão SUS levam ao mesmo cadastro, sem duplicidade                         | US01                            | UNIQUE em CPF e em CARTAO_SUS                                                                                    |
| 5 tentativas erradas bloqueiam o login                                            | US01                            | CHECK 0 a 5 + BLOQUEADO_ATE                                                                                      |
| Só 4 status internos                                                              | US02                            | CHECK em STATUS                                                                                                  |
| Reagendamento rastreável, sem perder o horário anterior                           | US03                            | autorrelacionamento ID_AGENDAMENTO_ORIGEM (FK composta, UNIQUE, CHECK)                                           |
| No máximo 1 horário ativo por encaminhamento                                      | US03                            | índice único baseado em função                                                                                   |
| Horário confirmado some para os outros; se dois confirmam, só o primeiro consegue | US03                            | índice único baseado em função em ID_HORARIO                                                                     |
| Não há duas vagas iguais                                                          | `Especialidade.publicarHorario` | UNIQUE (especialidade, unidade, data/hora)                                                                       |
| Cada linha do histórico é uma mudança real de etapa                               | US05 (auditoria)                | CHECK STATUS_ANTERIOR <> STATUS_NOVO                                                                             |
| Só horários da especialidade do encaminhamento                                    | US03, critério 1                | ID_ESPECIALIDADE em AGENDAMENTO, presente nas duas FKs compostas (para ENCAMINHAMENTO e para HORARIO_DISPONIVEL) |

A última regra usa **redundância controlada**: AGENDAMENTO repete a especialidade, mas a coluna faz parte das
duas chaves estrangeiras compostas. Por isso ela só aceita o valor que for igual no encaminhamento e no
horário, e não pode divergir de nenhum dos dois. A especialidade do encaminhamento não muda depois de criada
(a US03 exclui a troca de especialidade), então o Oracle não precisar de `ON UPDATE CASCADE` não é problema.
Em Java a mesma regra está em `Encaminhamento.validarHorarioLivre()`.

Regras que o banco não consegue garantir com restrições declarativas ficam na camada Java. Parte delas já está
implementada em `Encaminhamento` e `HorarioDisponivel`; as marcadas com \* ainda não existem no código:

| Regra                                                                   | Origem      | Por que não fica no banco                                                                     |
| ----------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| Horário no passado não aparece nem é agendado                           | US03        | depende do relógio; CHECK no Oracle não aceita `SYSDATE`                                      |
| Cancelar ou reagendar só até 24h antes                                  | US03        | depende do relógio                                                                            |
| No máximo 2 reagendamentos por encaminhamento\*                         | US03        | exige contar linhas de AGENDAMENTO; CHECK só enxerga a própria linha                          |
| Ordem das etapas, sem pular, e Concluído é final                        | US02        | depende do status anterior; o histórico registra, a aplicação valida                          |
| `STATUS = AGENDADO` só com agendamento ativo, e vice-versa\*            | US02 / US03 | envolve duas tabelas                                                                          |
| Data de nascimento não futura\*                                         | US01        | depende do relógio                                                                            |
| Dígito verificador de CPF e de Cartão SUS, CPF sem sequência repetida\* | US01        | cálculo, não restrição de valor                                                               |
| Bloqueio de 15 minutos após 5 tentativas\*                              | US01        | o banco guarda `TENTATIVAS_LOGIN` e `BLOQUEADO_ATE`; quem compara com o relógio é a aplicação |

## 4. Diferenças entre o código Java atual e o modelo

Para o grupo decidir se o Java acompanha o modelo na próxima sprint:

1. `Cidadao.dataNascimento` aceita nulo no Java; a US01 a exige. No modelo é obrigatória.
2. `Agendamento` guarda `dataHora` e também o `HorarioDisponivel`. No modelo a data vem do horário, para não
   haver dois valores que possam divergir.
3. Ao cancelar, o Java desliga o agendamento do horário (`definirHorario(null)`). No modelo o vínculo é mantido
   e o índice único só considera agendamentos ativos, para não perder o histórico de qual vaga foi cancelada.
4. Faltam no Java: protocolo, selo de urgência, limite de reagendamentos, unidade, credenciais do
   cidadão. Todos são exigidos por critérios da US01 a US03.
5. O histórico do Java não registra a criação do encaminhamento; o modelo permite (status anterior nulo).
6. Os ids no Java são gerados pelo tamanho da lista; no banco viram sequência ou IDENTITY.
7. `Encaminhamento.reagendar()` troca o horário do **mesmo** `Agendamento`. No modelo, reagendar cancela o atual
   e cria um novo com `ID_AGENDAMENTO_ORIGEM` (seção 2, "Reagendamento"). `Agendamento` precisa de uma referência
   ao agendamento de origem.
8. AGENDAMENTO tem `ID_ESPECIALIDADE`, que não existe na classe `Agendamento`. Ao gravar, o valor é copiado da
   especialidade do encaminhamento; o banco recusa se ela não for a mesma do horário.

## 5. Modelo coerente com casos de uso

| Caso de uso                           | Tabelas envolvidas                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Identificar-se                        | CIDADAO (CPF, CARTAO_SUS, DATA_NASCIMENTO, SENHA_HASH, ID_GOV_BR)                               |
| Acompanhar status                     | ENCAMINHAMENTO, HISTORICO_STATUS                                                                |
| Agendar / reagendar / cancelar        | HORARIO_DISPONIVEL, AGENDAMENTO, ENCAMINHAMENTO                                                 |
| Consultar horários disponíveis        | HORARIO_DISPONIVEL sem AGENDAMENTO ativo                                                        |
| Autenticar-se no painel               | USUARIO_INSTITUCIONAL                                                                           |
| Atualizar status / gerenciar fila     | ENCAMINHAMENTO, HISTORICO_STATUS                                                                |
| Chamar paciente / ver chamada         | CHAMADA                                                                                         |
| Visualizar indicadores                | consultas sobre HISTORICO_STATUS e AGENDAMENTO                                                  |
| Ver ação pendente por paciente (US05) | derivada de ENCAMINHAMENTO.STATUS e do último AGENDAMENTO do encaminhamento, sem coluna própria |

A ação pendente da US05 não é guardada. Ela é calculada como a próxima ação da US02: `AGUARDANDO_AGENDAMENTO`
sem agendamento ativo indica "cobrar marcação", e agendamento com status `FALTA` indica "reagendar". A ação
"buscar resultado", citada na US05 da Fase 1, não tem dado correspondente no modelo. A US05 está fora da
Sprint 1 e só será detalhada quando entrar em uma sprint. Se ela exigir esse acompanhamento, o modelo ganha um
atributo ou uma entidade para o resultado nesse momento.

## 6. Validação feita

**Primeira versão do DDL.** O DDL foi executado no H2 2.2 (modo Oracle). As tabelas foram criadas e um cenário válido foi inserido
(cidadão, encaminhamento, agendamento cancelado, novo agendamento, histórico, chamada). Foram rejeitados,
como esperado: cidadão sem pessoa, CPF repetido, vaga duplicada, terceiro reagendamento, status inexistente,
agendamento ativo com data de cancelamento e perfil inválido. Os dois índices únicos baseados em função são
sintaxe específica do Oracle e **não** foram testados no H2.

**Depois da FK composta, do CHECK do histórico e do reagendamento.** O roteiro do H2 acima ficou desatualizado:
ele não preenche `ID_ESPECIALIDADE` em AGENDAMENTO e ainda usa `QTD_REAGENDAMENTOS`. A versão atual foi
conferida assim: o DDL inteiro passa num parser no dialeto Oracle, e as tabelas foram criadas e testadas no
SQLite, com os dois índices baseados em função trocados por índices parciais equivalentes
(`... WHERE STATUS = 'AGENDADO'`). Resultados:

| Cenário                                                | Esperado | Resultado               |
| ------------------------------------------------------ | -------- | ----------------------- |
| Agendar em horário da mesma especialidade              | aceito   | aceito                  |
| Agendar em horário de outra especialidade              | recusado | recusado (FK composta)  |
| Segundo agendamento ativo no mesmo encaminhamento      | recusado | recusado (índice único) |
| Dois cidadãos no mesmo horário                         | recusado | recusado (índice único) |
| Horário volta a ficar livre depois do cancelamento     | aceito   | aceito                  |
| Agendamento ativo com data de cancelamento             | recusado | recusado (CHECK)        |
| Histórico com status anterior igual ao novo            | recusado | recusado (CHECK)        |
| Histórico de criação (status anterior nulo)            | aceito   | aceito                  |
| Reagendar: cancelar o atual e criar um novo com origem | aceito   | aceito                  |
| Reagendamento com origem de outro encaminhamento       | recusado | recusado (FK composta)  |
| Dois reagendamentos a partir do mesmo agendamento      | recusado | recusado (UNIQUE)       |
| Agendamento com origem nele mesmo                      | recusado | recusado (CHECK)        |

Falta executar num Oracle real. O comportamento das FKs compostas e dos índices baseados em função é padrão do
Oracle, mas não foi testado nele.

## 7. Como gerar os artefatos no Oracle SQL Developer Data Modeler

1. Abrir o Data Modeler. **File > Import > DDL File**, selecionar `minha_vez_ddl.sql`.
2. Banco: **Oracle Database 19c** (ou o mais próximo). Confirmar a importação: o modelo relacional aparece.
3. No modelo relacional, clicar em **Engineer to Logical Model** (botão `<<`). O modelo lógico (entidades e
   relacionamentos) é gerado.
4. No modelo lógico, montar a hierarquia: abrir a entidade CIDADAO > **Super Type** = PESSOA; repetir para
   USUARIO_INSTITUCIONAL. Remover as relações 1:1 que o engenharia reversa criou entre elas e PESSOA.
   **Conferir AGENDAMENTO.** Ela tem três chaves estrangeiras compostas que apontam para UNIQUE, não para a
   PK: `(ID_ENCAMINHAMENTO, ID_ESPECIALIDADE)`, `(ID_HORARIO, ID_ESPECIALIDADE)` e
   `(ID_AGENDAMENTO_ORIGEM, ID_ENCAMINHAMENTO)`. Não está confirmado como o Data Modeler converte isso para o
   modelo lógico. Verificar que:

   - existem os três relacionamentos: com ENCAMINHAMENTO, com HORARIO_DISPONIVEL e o autorrelacionamento
     "reagendado de";
   - `ID_ESPECIALIDADE` e `ID_ENCAMINHAMENTO` aparecem **uma vez só**. Se surgir uma cópia (por exemplo
     `ID_ESPECIALIDADE1`), a ferramenta separou a coluna compartilhada, e a garantia da mesma especialidade
     se perde;
   - o autorrelacionamento está opcional nas duas pontas (0..1 : 0..1).

   Se a ferramenta não representar bem, o plano B é voltar às chaves estrangeiras simples e citar as regras
   na tabela de regras da camada Java (seção 3). Elas continuam valendo pelo Java.

5. Em **Tools > Preferences > Data Modeler > Diagram > Logical Model**, escolher notação (Barker ou
   Information Engineering, a mesma do material da aula).
6. Arrumar o layout, então **File > Data Modeler > Print Diagram > To Image File** e salvar
   `modelo-logico.png` (substitui o rascunho desta pasta).
7. **File > Save As** `minha_vez.dmd` nesta pasta. O Data Modeler cria junto a pasta `minha_vez/`; os dois
   vão juntos no ZIP.
