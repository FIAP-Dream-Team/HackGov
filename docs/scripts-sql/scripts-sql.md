# Parte 5 — Scripts SQL de criação do Minha Vez

O script desta parte cria o banco desenhado na Parte 4. Nenhuma tabela, coluna ou restrição
nova entra aqui. O arquivo é o mesmo `minha_vez_fisico.sql` importado no Oracle SQL Developer
Data Modeler para gerar a figura da Parte 4. O desenho e o SQL descrevem a mesma estrutura.

O `docs/modelo-logico/minha_vez_ddl.sql` da Parte 2 não foi alterado. Ele continua com as 11
tabelas e com o endereço dentro de `UNIDADE_SAUDE`. O script desta parte é o de 12 tabelas,
com `CEP`.

## 1. O que o script faz

O arquivo tem só DDL: `CREATE TABLE`, chave primária, chave estrangeira, unicidade, `CHECK`
e índice. Não há `INSERT`. Os identificadores são `NUMBER(10)`. Quem gera o número, sequência
ou `IDENTITY`, continua para a sprint de persistência, como já estava no físico.

A ordem de criação segue a chave estrangeira. Uma tabela só é criada depois da tabela que
ela referencia.

| Ordem | Tabela | Depende de |
| --- | --- | --- |
| 1 | `CEP` | nenhuma |
| 2 | `UNIDADE_SAUDE` | `CEP` |
| 3 | `PESSOA` | nenhuma |
| 4 | `CIDADAO` | `PESSOA` |
| 5 | `USUARIO_INSTITUCIONAL` | `PESSOA`, `UNIDADE_SAUDE` |
| 6 | `CONTATO_CIDADAO` | `CIDADAO` |
| 7 | `ESPECIALIDADE` | nenhuma |
| 8 | `HORARIO_DISPONIVEL` | `ESPECIALIDADE`, `UNIDADE_SAUDE` |
| 9 | `ENCAMINHAMENTO` | `CIDADAO`, `ESPECIALIDADE`, `UNIDADE_SAUDE` |
| 10 | `AGENDAMENTO` | `ENCAMINHAMENTO`, `HORARIO_DISPONIVEL`, e dele mesmo |
| 11 | `HISTORICO_STATUS` | `ENCAMINHAMENTO`, `USUARIO_INSTITUCIONAL` |
| 12 | `CHAMADA` | `AGENDAMENTO`, `USUARIO_INSTITUCIONAL` |

Os índices vêm depois das tabelas. O script assume um schema vazio. Na segunda execução, o
banco recusa porque as tabelas já existem.

## 2. Chaves e restrições

Cada regra do físico vira uma restrição com nome, para a mensagem do banco apontar qual
regra recusou a linha.

| Tipo | Quantidade | O que garante |
| --- | --- | --- |
| `PRIMARY KEY` | 12, uma por tabela | o identificador não se repete e não fica nulo |
| `FOREIGN KEY` | 18 | a referência existe na tabela apontada |
| `UNIQUE` | 13 | protocolo, CPF, Cartão SUS, Gov.br, login, CNES, vaga e as chaves de apoio das FKs compostas |
| `CHECK` | 14 | status, tipo de pessoa, tipo de unidade, perfil, urgência, tipo de contato e o par cancelado/data |
| Índice comum | 5 | busca por cidadão, fila, horário, agendamento e histórico |
| Índice único condicional | 2 | no máximo um `AGENDAMENTO` com status `AGENDADO` por encaminhamento e por horário |

A 18ª chave estrangeira é `FK_UNIDADE_CEP`, a única acrescentada pela Parte 3. As outras 17
já estavam no script da Parte 2.

`CIDADAO` e `USUARIO_INSTITUCIONAL` usam `ID_PESSOA` como chave primária e, ao mesmo tempo,
como chave estrangeira para `PESSOA`. É a especialização do lógico em uma tabela por subtipo.

`AGENDAMENTO` tem três chaves estrangeiras compostas:

| Restrição | Colunas | Aponta para |
| --- | --- | --- |
| `FK_AGEND_ENCAMINHAMENTO` | encaminhamento, especialidade, unidade | a especialidade e a unidade de destino do encaminhamento |
| `FK_AGEND_HORARIO` | horário, especialidade, unidade | a mesma especialidade e a mesma unidade da vaga |
| `FK_AGEND_ORIGEM` | agendamento de origem, encaminhamento | outro agendamento do mesmo encaminhamento |

As duas primeiras só fecham porque `UK_ENCAM_ESPEC_UNID` e `UK_HORARIO_ESPEC_UNID` existem.
A especialidade e a unidade do agendamento precisam ser iguais nos dois lados. `ID_AGENDAMENTO_ORIGEM`
pode ser nulo: o primeiro agendamento não vem de um reagendamento.

`CK_AGEND_CANCELAMENTO` exige data de cancelamento quando o status é `CANCELADO`, e exige a
ausência dessa data nos outros status. `CK_HIST_MUDANCA` recusa um histórico em que o status
anterior e o novo são iguais. `STATUS_ANTERIOR` nulo continua válido: é o registro de criação.

Os dois índices únicos condicionais olham só as linhas com `STATUS = 'AGENDADO'`. Cancelar
libera a vaga e o encaminhamento para um agendamento novo, sem apagar a linha antiga.

## 3. O que o script não cria

Horário no passado, prazo de 24 h, limite de dois reagendamentos, ordem das etapas, dígito
de CPF e Cartão SUS e o bloqueio de 15 minutos continuam no Java. O banco guarda a coluna
(`TENTATIVAS_LOGIN`, `BLOQUEADO_ATE`, `DATA_CANCELAMENTO`, `ID_AGENDAMENTO_ORIGEM`) e a
contagem ou o relógio fica na aplicação.

Espera média, faltas e quantidade de reagendamentos continuam calculados. CID, laudo e
prontuário continuam de fora. Status, tipo de unidade, perfil e tipo de contato continuam
`CHECK`, sem tabela de domínio.

## 4. Conferência

Em 23/10/2026 o script foi importado no Data Modeler (Oracle Database 21c). O diagrama
relacional resultante é a figura da Parte 4, `minha_vez_fisico.png`: 12 tabelas,
`FK_UNIDADE_CEP`, e as três chaves compostas de `AGENDAMENTO` sem coluna duplicada
(`ID_ESPECIALIDADE1` não apareceu).

No mesmo dia o arquivo foi executado no H2 2.2.224, em modo de compatibilidade Oracle.
As 12 tabelas e os 5 índices comuns foram criados. O H2 recusou os dois índices únicos
condicionais, com erro de sintaxe em `CASE WHEN` dentro do `CREATE UNIQUE INDEX`. É o
mesmo limite já registrado na Parte 2. No teste, a regra foi reproduzida com coluna
calculada e índice único sobre ela. O arquivo entregue não mudou: no Oracle o índice
continua escrito com `CASE WHEN`. O script não foi executado num Oracle real.

## 5. Arquivo

| Arquivo | O que é |
| --- | --- |
| `docs/modelo-fisico/minha_vez_fisico.sql` | script DDL desta parte, o mesmo importado para o diagrama da Parte 4 |
| `docs/modelo-fisico/minha_vez_fisico.png` | diagrama gerado por essa importação |
| `docs/modelo-logico/minha_vez_ddl.sql` | script da Parte 2, sem `CEP`, mantido como estava |
