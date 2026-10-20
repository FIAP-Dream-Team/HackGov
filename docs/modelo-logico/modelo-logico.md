# Parte 2 — Modelo Lógico de Dados do Minha Vez

O modelo parte do que já foi entregue na Fase 2: as user stories refinadas (US01 a US05),
o diagrama de casos de uso, o diagrama de classes e o recorte Java em
`src/backend/src/main/java/com/hackgov/backend/domain`. Nada aqui cria requisito novo. Onde o modelo vai além do
Java, a coluna "Origem" aponta a regra da user story que justifica o dado.

Artefatos desta pasta:

| Arquivo                              | O que é                                                                                  |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `modelo-logico.png`                  | **Imagem da entrega**: diagrama lógico exportado do Data Modeler (4766 × 1988 px)        |
| `modelo-logico.pdf`                  | O mesmo diagrama em PDF vetorial, nítido em qualquer ampliação                           |
| `minha_vez.dmd` + pasta `minha_vez/` | **Projeto do Data Modeler**. Os dois vão juntos no ZIP; o `.dmd` sozinho não abre         |
| `minha_vez_ddl.sql`                  | DDL Oracle do modelo, importado no Data Modeler para gerar o projeto                     |
| `modelo-logico-rascunho.png`         | Rascunho anterior à ferramenta (gerado de `diagrama-er.html`), só para conferência       |
| `diagrama-er.html`                   | Fonte do rascunho                                                                        |

Para o ZIP, copiar a pasta `minha_vez/` do disco, não do GitHub: os arquivos `*.local` que o Data Modeler cria
ficam fora do Git (`.gitignore` desta pasta). Eles são recriados pela ferramenta, mas a cópia do disco evita
qualquer diferença.

## 1. Entidades

| Entidade              | Papel no sistema                                               | Origem                              |
| --------------------- | -------------------------------------------------------------- | ----------------------------------- |
| PESSOA                | Supertipo com o que cidadão e servidor têm em comum (id, nome) | classe abstrata `Pessoa`            |
| CIDADAO               | Quem acompanha e agenda o encaminhamento                       | `Cidadao`, US01                     |
| USUARIO_INSTITUCIONAL | Equipe da UBS (Atendente) e Gestor                             | `UsuarioInstitucional`, US05, RNF01 |
| UNIDADE_SAUDE         | UBS de origem, unidade de destino e unidade onde o horário acontece | US03 (unidade definida no encaminhamento; confirmação mostra a unidade) |
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
| UNIDADE_SAUDE — ENCAMINHAMENTO (origem)     | 1 : 0..N                        | a UBS que originou o pedido                                                                                       |
| UNIDADE_SAUDE — ENCAMINHAMENTO (destino)    | 1 : 0..N                        | a unidade onde a consulta ou o exame deve acontecer, definida no encaminhamento (US03)                            |
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
| ENCAMINHAMENTO        | protocolo, status, cidadão, especialidade, UBS de origem, unidade de destino | —                       | US02: a tela sempre mostra protocolo e etapa; US03: a unidade é definida no encaminhamento                                          |
| AGENDAMENTO           | encaminhamento, horário, especialidade, unidade, status  | data de cancelamento, agendamento de origem | data de cancelamento só quando status = CANCELADO (CHECK); origem só quando o agendamento veio de um reagendamento                    |
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
| Só horários da unidade de destino definida no encaminhamento                      | US03 (não escolhe outra unidade) | ID_UNIDADE em AGENDAMENTO, presente nas mesmas duas FKs compostas                                               |

As duas últimas regras usam **redundância controlada**: AGENDAMENTO repete a especialidade e a unidade, mas
as duas colunas fazem parte das duas chaves estrangeiras compostas, cada uma com três colunas:
`(ID_ENCAMINHAMENTO, ID_ESPECIALIDADE, ID_UNIDADE)` aponta para `(ID_ENCAMINHAMENTO, ID_ESPECIALIDADE,
ID_UNIDADE_DESTINO)` em ENCAMINHAMENTO, e `(ID_HORARIO, ID_ESPECIALIDADE, ID_UNIDADE)` aponta para o mesmo trio
em HORARIO_DISPONIVEL. Por isso o agendamento só é aceito quando especialidade e unidade são iguais no
encaminhamento e no horário, e nenhuma das duas colunas pode divergir das tabelas de origem. As duas regras
foram tratadas com a mesma técnica de propósito: são exigências da mesma user story.

A especialidade e a unidade de destino não mudam depois de definidas (a US03 exclui a troca), então o Oracle
não ter `ON UPDATE CASCADE` não é problema. Em Java, a regra da especialidade está em
`Encaminhamento.validarHorarioLivre()`; a da unidade ainda não existe no código (seção 4).

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
8. AGENDAMENTO tem `ID_ESPECIALIDADE` e `ID_UNIDADE`, que não existem na classe `Agendamento`. Ao gravar, os
   valores são copiados do encaminhamento (especialidade e unidade de destino); o banco recusa se não forem os
   mesmos do horário.
9. `Encaminhamento` não tem unidade de origem nem de destino, e `HorarioDisponivel` não tem unidade. A lista de
   horários livres da US03 precisa filtrar também pela unidade de destino.

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

O DDL foi executado no H2 2.2, em modo de compatibilidade Oracle, e submetido a 30 cenários com dados de teste
(não são dados de pesquisa). O H2 não aceita os dois índices únicos baseados em função; no teste, eles foram
reproduzidos com a mesma lógica por colunas calculadas com índice único. Todos os 30 cenários deram o resultado
esperado, e cada recusa veio da regra prevista:

| Grupo | Cenários aceitos | Cenários recusados (regra que recusou) |
| --- | --- | --- |
| US01 Identificação | cadastro de cidadão e de servidor | cidadão sem pessoa (FK); CPF repetido e Cartão SUS repetido (UNIQUE); tipo de pessoa inválido, 6 tentativas de login e perfil inválido (CHECK); contato repetido (UNIQUE) |
| US02 / US05 Acompanhamento e auditoria | histórico de criação (status anterior nulo); mudança feita pela atendente | status inexistente (CHECK); protocolo repetido (UNIQUE); encaminhamento sem unidade de destino (NOT NULL); unidade de destino inexistente (FK); histórico sem mudança real (CHECK); responsável que não é servidor (FK) |
| US03 Agendamento | agendar a vaga certa; cancelar; reagendar (cancela o atual e cria um novo com origem); outro cidadão ocupar a vaga liberada | vaga duplicada (UNIQUE); vaga de outra unidade e vaga de outra especialidade (FK composta); agendamento sem unidade (NOT NULL); dois cidadãos na mesma vaga e dois agendamentos ativos no mesmo encaminhamento (índice único condicional); ativo com data de cancelamento e cancelado sem data (CHECK); origem de outro encaminhamento (FK composta); dois reagendamentos da mesma origem (UNIQUE); origem nele mesmo (CHECK) |
| US04 Chamada | chamada feita por servidor | chamada feita por cidadão (FK) |

Limite do teste: o DDL não foi executado num Oracle real. FKs compostas e índices baseados em função são
recursos padrão do Oracle, mas a confirmação final vem da importação no Data Modeler (seção 7).

## 7. Como gerar os artefatos no Oracle SQL Developer Data Modeler

Os menus aparecem em inglês ou em português conforme a instalação; os dois nomes estão indicados.

1. Abrir o Data Modeler num design novo (**File > New** / **Arquivo > Novo**), para não misturar com
   importações anteriores. **File > Import > DDL File** (**Arquivo > Importar > Arquivo DDL**), selecionar
   `minha_vez_ddl.sql`.
2. Banco: **Oracle Database 21c** (versões do Data Modeler que não listam a 19c) ou **19c**. Mesclar tudo e
   confirmar: o modelo relacional aparece com as 11 tabelas.
3. No modelo relacional, clicar em **Engineer to Logical Model** (**Engenharia para Modelo Lógico**, botão
   `<<`). O modelo lógico (entidades e relacionamentos) é gerado.
4. No modelo lógico, montar a hierarquia: abrir a entidade CIDADAO > **Super Type** = PESSOA; repetir para
   USUARIO_INSTITUCIONAL. Remover as relações 1:1 que o engenharia reversa criou entre elas e PESSOA.
   **Conferir AGENDAMENTO.** Ela tem três chaves estrangeiras compostas que apontam para UNIQUE, não para a
   PK: `(ID_ENCAMINHAMENTO, ID_ESPECIALIDADE, ID_UNIDADE)`, `(ID_HORARIO, ID_ESPECIALIDADE, ID_UNIDADE)` e
   `(ID_AGENDAMENTO_ORIGEM, ID_ENCAMINHAMENTO)`. Não está confirmado como o Data Modeler converte isso para o
   modelo lógico. Verificar que:

   - existem os três relacionamentos: com ENCAMINHAMENTO, com HORARIO_DISPONIVEL e o autorrelacionamento
     "reagendado de";
   - `ID_ESPECIALIDADE`, `ID_UNIDADE` e `ID_ENCAMINHAMENTO` aparecem **uma vez só**. Se surgir uma cópia
     (por exemplo `ID_ESPECIALIDADE1` ou `ID_UNIDADE1`), a ferramenta separou a coluna compartilhada, e a
     garantia da mesma especialidade e da mesma unidade se perde;
   - o autorrelacionamento está opcional nas duas pontas (0..1 : 0..1).

   Se a ferramenta não representar bem, o plano B é voltar às chaves estrangeiras simples e citar as regras
   na tabela de regras da camada Java (seção 3). Elas continuam valendo pelo Java.

5. Em **Tools > Preferences > Data Modeler > Diagram > Logical Model**, escolher notação (Barker ou
   Information Engineering, a mesma do material da aula).
6. Arrumar o layout sem soltar uma entidade dentro de outra: no Data Modeler, isso cria uma herança.
7. Aumentar o zoom do diagrama (a exportação usa o zoom da tela) e exportar por **File > Data Modeler > Print
   Diagram > To Image File** (**Arquivo > Imprimir Diagrama > Para Arquivo de Imagem**) e **To PDF**.
8. **File > Save As** `minha_vez.dmd` nesta pasta. O Data Modeler cria junto a pasta `minha_vez/`; os dois
   vão juntos no ZIP. Não rodar depois **Engineer to Relational Model**: o modelo relacional do projeto deve
   continuar igual ao DDL.

### Resultado (18/10/2026)

Os passos acima foram executados no Data Modeler, com o banco Oracle Database 21c e a notação Barker.

| Conferência                                      | Resultado                                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Tabelas importadas no modelo relacional          | 11, com as 17 chaves estrangeiras e os 2 índices baseados em função                |
| Entidades no modelo lógico                       | 11                                                                                 |
| Relacionamentos                                  | 15 (17 FKs, menos as 2 relações 1:1 com PESSOA, substituídas pela herança)         |
| Hierarquias                                      | 2: CIDADAO e USUARIO_INSTITUCIONAL com supertipo PESSOA                            |
| Colunas compartilhadas das FKs compostas          | sem duplicação (`ID_ESPECIALIDADE1`, `ID_UNIDADE1` não apareceram)                 |
| Cardinalidade do autorrelacionamento "reagendado de" | a ferramenta gerou 0..\* : 0..1; ajustada à mão para **0..1 : 0..1**, porque o `UNIQUE` em `ID_AGENDAMENTO_ORIGEM` não é lido pela engenharia reversa |

Na notação Barker usada no diagrama: `#` identificador, `*` obrigatório, `o` opcional, `U` único; linha contínua
é participação obrigatória daquele lado, tracejada é opcional, e o pé de galinha marca o lado "muitos". As
chaves estrangeiras não aparecem como atributos no modelo lógico: são as linhas de relacionamento.
