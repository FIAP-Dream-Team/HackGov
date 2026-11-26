## **DT-79 — Tecnologias adotadas justificadas**

A demo do Alerta Bairro usa cinco tecnologias. Cada uma cobre uma parte do que o morador de Porto Alegre precisa: registrar o que viu no bairro, juntar a confirmação do vizinho, guardar a estação e avisar uma vez só quem segue os bairros que ela abastece.

**Java 17**

O problema junta ocorrência, confirmação, estação e alerta. Java 17 é a linguagem fixada no guia da demo e a linguagem do curso. Com ela, `Ocorrencia` e `Estacao` carregam os dados, e os enums `StatusOcorrencia`, `TipoConfirmacao`, `OrigemAlerta` e `StatusEstacao` fecham os valores que o banco também restringe. O programa que a avaliação executa é o mesmo que agrupa o relato e dispara a cascata.

**Maven**

O código fica em `backend/`, num `pom.xml` com Java 17 e o driver do Oracle. O Maven monta o programa e embute o driver no jar. A equipe roda a mesma demo, sem copiar biblioteca à mão. O relato do morador só se sustenta se o programa que grava e o programa que a banca executa forem o mesmo.

**JDBC com PreparedStatement**

Registrar, listar e confirmar são inserção, consulta e atualização. O JDBC faz essas operações no Oracle. Cada tabela tem um DAO, o comando usa `PreparedStatement`, e uma `ConnectionFactory` abre a conexão. Bairro, tipo e pessoa entram como parâmetro. A regra de agrupar o relato fica no `OcorrenciaService`; o SQL fica no DAO.

**Oracle**

O modelo das 13 tabelas já está em SQL do Oracle: `NUMBER`, `VARCHAR2`, `CHECK` e `SYSTIMESTAMP`. A lista de ocorrências ativas do bairro é uma consulta. A janela do relato repetido usa as horas do tipo. A cascata grava um `ALERTA` de origem `CASCATA`, liga os bairros de `ESTACAO_BAIRRO` e gera a `NOTIFICACAO` de quem segue esses bairros. O Oracle local da demo é o lugar onde isso persiste.

**Menu de console**

No desenho, o morador usa telas. A avaliação precisa ver o sistema rodar sem depender delas. O `MenuPrincipal` lê a opção e chama o `OcorrenciaService` para registrar ou confirmar. A cascata continua fora do menu: quando a falta de luz é confirmada no bairro da estação de abastecimento, o serviço avisa. O texto do console fica sem acento de propósito.

---

## **DT-91 — Especificação técnica do implementado**

**O que a demo executa**

O programa fica em `backend/`, pacote `br.com.alertabairro`. O `MenuPrincipal` oferece aplicar o script do Oracle, registrar um relato, listar as ocorrências ativas do bairro e confirmar. `OcorrenciaService` aplica o registro e a confirmação. Quando a falta de luz recebe uma confirmação nova, ele chama `CascataService`, que chama `NotificacaoService`. Os três passam pelos DAOs e pela `ConnectionFactory`. A cascata não é opção de menu.

O catálogo do piloto entra na preparação do banco: cinco bairros (Menino Deus, Praia de Belas, Centro Histórico, Arquipélago e Bom Jesus), seis tipos de relato, três moradores, a ETA Arquipélago do tipo `ABASTECIMENTO` e a drenagem do Bom Jesus. Cada morador segue um bairro abastecido pela ETA, com apelido de casa ou trabalho.

**Relato agrupado**

Registrar pede tipo, bairro, pessoa, severidade de 1 a 3 e descrição. A pessoa vai para `ID_AUTOR` e para a primeira linha de `CONFIRMACAO`. O cartão da ocorrência mostra tipo, bairro, status, severidade, contador, descrição e data. O nome fica de fora da tela.

Se já existe ocorrência `ATIVA` do mesmo tipo e do mesmo bairro, e a última confirmação ainda está dentro de `HORAS_EXPIRACAO` do tipo, o relato novo não abre outra linha. Ele grava `CONFIRMA` e soma 1 em `CONFIRMACOES`. A mesma pessoa não confirma de novo esse retorno.

**Confirmação**

"Ainda esta" grava `CONFIRMA` e soma 1 no contador. "Ja voltou" grava `RESOLVEU`. Quando três pessoas registram `RESOLVEU` na mesma ocorrência, o status passa a `RESOLVIDA` e `ENCERRADA_EM` recebe a data. Os dois retornos da mesma pessoa na mesma ocorrência são recusados.

**Cascata**

O primeiro relato de falta de luz abre a ocorrência e ainda não avisa. O aviso sai quando outra pessoa confirma essa falta de luz: pelo relato que entra na ocorrência ativa, ou pelo retorno "Ainda esta". `CascataService` procura estação `ABASTECIMENTO` no bairro da ocorrência, com status `OPERANDO`. A que ainda está operando passa a `SEM_ENERGIA`. Só essa mudança cria um `ALERTA` de origem `CASCATA`, do tipo falta de água, com a ocorrência de luz na origem. `ALERTA_BAIRRO` liga os bairros de `ESTACAO_BAIRRO`. `NOTIFICACAO` avisa cada pessoa que segue algum desses bairros, uma vez por pessoa. A estação de drenagem não entra na consulta. Confirmação, mudança da estação, alerta e notificações commitam na mesma transação.

**O que ficou de fora**

`ExpiracaoService` está no diagrama e não está no código. Na hora de registrar, a janela de horas decide se o relato entra na ocorrência ativa. Nenhuma rotina muda para `EXPIRADA` a ocorrência que passou do prazo sem confirmação nova.

A API oficial de chuva e de nível do Guaíba, o push no celular e o aviso por SMS ficam fora desta demo, como o guia já previa. `NIVEL_GUAIBA` existe no modelo e o Java não consulta medição externa. O aviso da cascata fica gravado em `NOTIFICACAO`. As telas do morador seguem no desenho. A avaliação vê o fluxo pelo menu de console.