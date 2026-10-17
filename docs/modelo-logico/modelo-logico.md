# Parte 2 — Modelo Lógico de Dados do Minha Vez

Rascunho para o PDF. O modelo parte do que já foi entregue na Fase 2: as user stories refinadas (US01 a US05),
o diagrama de casos de uso, o diagrama de classes e o recorte Java em
`src/backend/src/main/java/com/hackgov/backend/domain`. Nada aqui cria requisito novo. Onde o modelo vai além do
Java, a coluna "Origem" aponta a regra da user story que justifica o dado.

Artefatos desta pasta:

| Arquivo | O que é |
| --- | --- |
| `minha_vez_ddl.sql` | DDL Oracle do modelo, para importar no SQL Developer Data Modeler |
| `modelo-logico.png` | Rascunho da imagem do modelo (gerado de `diagrama-er.html`) |
| `diagrama-er.html` | Fonte do rascunho da imagem |
| `minha_vez.dmd` + pasta `minha_vez/` | **A gerar pelo grupo** no Data Modeler (ver seção 7) |

## 1. Entidades

| Entidade | Papel no sistema | Origem |
| --- | --- | --- |
| PESSOA | Supertipo com o que cidadão e servidor têm em comum (id, nome) | classe abstrata `Pessoa` |
| CIDADAO | Quem acompanha e agenda o encaminhamento | `Cidadao`, US01 |
| USUARIO_INSTITUCIONAL | Equipe da UBS (Atendente) e Gestor | `UsuarioInstitucional`, US05, RNF01 |
| UNIDADE_SAUDE | UBS de origem e unidade onde o horário acontece | US03 (confirmação mostra a unidade) |
| ESPECIALIDADE | Cardiologia, Ortopedia etc. | `Especialidade` |
| HORARIO_DISPONIVEL | Cada vaga publicada para uma especialidade | `HorarioDisponivel`, US03 |
| ENCAMINHAMENTO | O pedido acompanhado pelo cidadão, com protocolo e status | `Encaminhamento`, US02 |
| AGENDAMENTO | Ocupação de um horário por um encaminhamento | `Agendamento`, US03 |
| HISTORICO_STATUS | Trilha de auditoria de cada mudança de etapa | `HistoricoStatus`, US05 |
| CONTATO_CIDADAO | Telefones e e-mails do cidadão (atributo multivalorado) | notificação, sprint futura da US03 |
| CHAMADA | Senha e sala exibidas no painel da sala de espera | US04, caso de uso "Chamar paciente" |

Indicadores do gestor (espera média, faltas) **não viram tabela**: são calculados a partir de
HISTORICO_STATUS (datas de entrada e saída de cada etapa) e de AGENDAMENTO (status `FALTA`). Guardar o
número pronto criaria um dado que pode divergir da fonte.

## 2. Relacionamentos e cardinalidades

| Relacionamento | Cardinalidade | Leitura |
| --- | --- | --- |
| PESSOA — CIDADAO / USUARIO_INSTITUCIONAL | especialização total e disjunta | toda pessoa é exatamente um dos dois |
| UNIDADE_SAUDE — USUARIO_INSTITUCIONAL | 1 : 0..N | cada servidor é lotado em uma unidade |
| CIDADAO — CONTATO_CIDADAO | 1 : 0..N | contato é opcional |
| CIDADAO — ENCAMINHAMENTO | 1 : 0..N | estado "sem encaminhamento" existe (US02) |
| ESPECIALIDADE — ENCAMINHAMENTO | 1 : 0..N | cada encaminhamento é para uma especialidade |
| UNIDADE_SAUDE — ENCAMINHAMENTO | 1 : 0..N | a UBS que originou o pedido |
| ESPECIALIDADE — HORARIO_DISPONIVEL | 1 : 0..N | estado "sem vagas" existe (US03) |
| UNIDADE_SAUDE — HORARIO_DISPONIVEL | 1 : 0..N | onde a vaga acontece |
| ENCAMINHAMENTO — AGENDAMENTO | 1 : 0..N, **no máximo 1 ativo** | cancelados ficam como histórico |
| HORARIO_DISPONIVEL — AGENDAMENTO | 1 : 0..N, **no máximo 1 ativo** | a mesma vaga não serve a dois cidadãos |
| ENCAMINHAMENTO — HISTORICO_STATUS | 1 : 1..N | a criação já gera o primeiro registro |
| USUARIO_INSTITUCIONAL — HISTORICO_STATUS | 0..1 : 0..N | responsável nulo = mudança automática |
| AGENDAMENTO — CHAMADA | 1 : 0..N | o paciente pode ser chamado mais de uma vez |
| USUARIO_INSTITUCIONAL — CHAMADA | 1 : 0..N | quem chamou |

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

| Entidade | Obrigatórios | Opcionais | Por quê |
| --- | --- | --- | --- |
| CIDADAO | CPF, data de nascimento | Cartão SUS, senha, Gov.br, bloqueio | US01: cadastro exige CPF e nascimento; quem entra só pelo Gov.br não tem senha, quem entra só pelo app pode não informar o Cartão SUS |
| USUARIO_INSTITUCIONAL | login, senha, perfil, unidade | — | RNF01: acesso só com login institucional |
| ENCAMINHAMENTO | protocolo, status, cidadão, especialidade, UBS de origem | — | US02: a tela sempre mostra protocolo e etapa |
| AGENDAMENTO | encaminhamento, horário, status | data de cancelamento | preenchida só quando status = CANCELADO (CHECK) |
| HISTORICO_STATUS | status novo, data/hora | status anterior, responsável | anterior nulo = criação; responsável nulo = ação do sistema ou do cidadão |
| UNIDADE_SAUDE | nome, tipo, endereço | CNES, complemento | — |

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

| Regra | Origem | Como o banco garante |
| --- | --- | --- |
| CPF e Cartão SUS levam ao mesmo cadastro, sem duplicidade | US01 | UNIQUE em CPF e em CARTAO_SUS |
| 5 tentativas erradas bloqueiam o login | US01 | CHECK 0 a 5 + BLOQUEADO_ATE |
| Só 4 status internos | US02 | CHECK em STATUS |
| No máximo 2 reagendamentos | US03 | CHECK 0 a 2 em QTD_REAGENDAMENTOS |
| No máximo 1 horário ativo por encaminhamento | US03 | índice único baseado em função |
| Horário confirmado some para os outros; se dois confirmam, só o primeiro consegue | US03 | índice único baseado em função em ID_HORARIO |
| Não há duas vagas iguais | `Especialidade.publicarHorario` | UNIQUE (especialidade, unidade, data/hora) |

Regras que dependem do relógio ou da ordem dos status (horário no passado, prazo de 24h, transição permitida)
ficam na camada Java, que já as implementa em `Encaminhamento` e `HorarioDisponivel`.

## 4. Diferenças entre o código Java atual e o modelo

Para o grupo decidir se o Java acompanha o modelo na próxima sprint:

1. `Cidadao.dataNascimento` aceita nulo no Java; a US01 a exige. No modelo é obrigatória.
2. `Agendamento` guarda `dataHora` e também o `HorarioDisponivel`. No modelo a data vem do horário, para não
   haver dois valores que possam divergir.
3. Ao cancelar, o Java desliga o agendamento do horário (`definirHorario(null)`). No modelo o vínculo é mantido
   e o índice único só considera agendamentos ativos, para não perder o histórico de qual vaga foi cancelada.
4. Faltam no Java: protocolo, selo de urgência, contador de reagendamentos, unidade, credenciais do
   cidadão. Todos são exigidos por critérios da US01 a US03.
5. O histórico do Java não registra a criação do encaminhamento; o modelo permite (status anterior nulo).
6. Os ids no Java são gerados pelo tamanho da lista; no banco viram sequência ou IDENTITY.

## 5. Modelo coerente com casos de uso

| Caso de uso | Tabelas envolvidas |
| --- | --- |
| Identificar-se | CIDADAO (CPF, CARTAO_SUS, DATA_NASCIMENTO, SENHA_HASH, ID_GOV_BR) |
| Acompanhar status | ENCAMINHAMENTO, HISTORICO_STATUS |
| Agendar / reagendar / cancelar | HORARIO_DISPONIVEL, AGENDAMENTO, ENCAMINHAMENTO |
| Consultar horários disponíveis | HORARIO_DISPONIVEL sem AGENDAMENTO ativo |
| Autenticar-se no painel | USUARIO_INSTITUCIONAL |
| Atualizar status / gerenciar fila | ENCAMINHAMENTO, HISTORICO_STATUS |
| Chamar paciente / ver chamada | CHAMADA |
| Visualizar indicadores | consultas sobre HISTORICO_STATUS e AGENDAMENTO |

## 6. Validação feita

O DDL foi executado no H2 2.2 (modo Oracle). As tabelas foram criadas e um cenário válido foi inserido
(cidadão, encaminhamento, agendamento cancelado, novo agendamento, histórico, chamada). Foram rejeitados,
como esperado: cidadão sem pessoa, CPF repetido, vaga duplicada, terceiro reagendamento, status inexistente,
agendamento ativo com data de cancelamento e perfil inválido. Os dois índices únicos baseados em função são
sintaxe específica do Oracle e **não** foram testados no H2.

## 7. Como gerar os artefatos no Oracle SQL Developer Data Modeler

1. Abrir o Data Modeler. **File > Import > DDL File**, selecionar `minha_vez_ddl.sql`.
2. Banco: **Oracle Database 19c** (ou o mais próximo). Confirmar a importação: o modelo relacional aparece.
3. No modelo relacional, clicar em **Engineer to Logical Model** (botão `<<`). O modelo lógico (entidades e
   relacionamentos) é gerado.
4. No modelo lógico, montar a hierarquia: abrir a entidade CIDADAO > **Super Type** = PESSOA; repetir para
   USUARIO_INSTITUCIONAL. Remover as relações 1:1 que o engenharia reversa criou entre elas e PESSOA.
5. Em **Tools > Preferences > Data Modeler > Diagram > Logical Model**, escolher notação (Barker ou
   Information Engineering, a mesma do material da aula).
6. Arrumar o layout, então **File > Data Modeler > Print Diagram > To Image File** e salvar
   `modelo-logico.png` (substitui o rascunho desta pasta).
7. **File > Save As** `minha_vez.dmd` nesta pasta. O Data Modeler cria junto a pasta `minha_vez/`; os dois
   vão juntos no ZIP.
