## DT-78 — Viabilidade da implementação registrada

**Para o morador do piloto**

O público desta entrega é o morador que vê a luz cair, a água falhar ou a rua alagar e precisa que o vizinho confirme o mesmo fato. No piloto, os bairros são Menino Deus, Praia de Belas, Centro Histórico, Arquipélago e Bom Jesus. A implementação é viável para essa pessoa porque as regras que mudam o dia dela já executam. O segundo relato do mesmo tipo e bairro, dentro do prazo, entra na ocorrência ativa. Três retornos de "já voltou" encerram como resolvida. A falta de luz confirmada no Arquipélago avisa uma vez Menino Deus, Praia de Belas e Centro Histórico. A estação de drenagem do Bom Jesus fica de fora dessa regra.

**Com as tecnologias do DT-79**

Java 17 concentra essas regras em serviço. A mesma classe atende o menu desta demo e pode atender uma tela depois, sem reescrever o agrupamento nem a cascata. O Maven entrega esse programa num jar, com o driver do Oracle. O JDBC grava o que não pode se perder para o morador: o relato, a confirmação, o status da estação e a notificação. O volume do piloto cabe nesse banco: cinco bairros, seis tipos, três pessoas e duas estações. O menu de console serve para a avaliação ver o fluxo. No cotidiano do morador, a interface prevista continua sendo a tela do desenho. O efeito que ele recebe é o das chamadas: uma ocorrência por tipo e bairro, e um aviso só por estação.

**O alcance para quem mora no bairro**

O aviso fica em `NOTIFICACAO`, ligado ao alerta e à pessoa que segue o bairro. A API oficial de chuva e de nível do Guaíba, o push no celular e o SMS ficam fora desta demo, como o guia já previa. Na demo, estação, bairro abastecido e quem segue o bairro entram cadastrados. Para o morador do piloto, o que esta implementação sustenta é distinguir o relato da confirmação e disparar a cascata uma vez. O alerta que o Oracle guarda é a base do aviso que, num passo seguinte, chegaria ao telefone.

## DT-79 — Tecnologias adotadas justificadas / DT-91 — Especificação técnica do implementado

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

## DT-99 Problemas técnicos resolvidos / DT-100 Conceitos do curso mostrados na solução

## **DT-99 — Problemas técnicos resolvidos**

**Relato do mesmo tipo e bairro**

O primeiro registro de falta de luz no Arquipélago gravava uma `OCORRENCIA`. O segundo, feito minutos depois pela pessoa ao lado, gravava outra linha, com o mesmo tipo e o mesmo bairro. A lista do bairro mostrava dois problemas onde havia um só, e o contador `CONFIRMACOES` se dividia entre as duas.

Avaliamos um índice único de tipo e bairro enquanto o status fosse `ATIVA`. Esse índice segura o status e deixa de fora a janela de `HORAS_EXPIRACAO`: um relato feito depois do prazo é outro evento, e uma ocorrência já `RESOLVIDA` precisa aceitar um relato novo do mesmo tipo. Avaliamos também gravar toda linha e fundir depois, numa rotina. Até a rotina rodar, a consulta da demo mostraria a duplicata, e a confirmação do vizinho cairia na linha errada.

A regra ficou em `OcorrenciaService.registrar`, na mesma transação do `INSERT`. O serviço procura ocorrência `ATIVA` daquele tipo e daquele bairro cuja última confirmação ainda está dentro das horas do tipo. Se encontra, grava uma linha em `CONFIRMACAO` com tipo `CONFIRMA` e soma 1 em `CONFIRMACOES`. Se não encontra, abre a ocorrência, grava o autor e a primeira confirmação, com o contador em 1. A mesma pessoa não entra de novo: `ID_AUTOR` e a chave de `CONFIRMACAO` recusam o segundo retorno. O nome não sai no cartão da ocorrência.

**Aviso de água disparado de novo para a mesma estação**

Quando a falta de luz do Arquipélago recebe a confirmação de outra pessoa, a ETA daquele bairro fica sem energia e os bairros que ela abastece precisam ser avisados. Se o aviso nascesse a cada confirmação, Menino Deus, Praia de Belas e Centro Histórico receberiam o mesmo alerta várias vezes, uma para cada vizinho.

Avaliamos procurar um `ALERTA` já ligado àquela `OCORRENCIA`. Isso segura uma ocorrência e deixa passar a seguinte: outra falta de luz no mesmo bairro, com a estação ainda sem energia, geraria outro aviso. Avaliamos contar as linhas de `NOTIFICACAO`. A trava ficaria na mensagem, e uma pessoa que passasse a seguir o bairro depois reabriria o disparo. Avaliamos também avisar no primeiro relato, antes de um vizinho confirmar. O aviso sairia sem o retorno que o produto usa como confirmação.

O disparo ficou em `CascataService`, chamado por `OcorrenciaService` quando uma confirmação nova entra numa falta de luz ativa. Isso acontece no relato que se junta à ocorrência, ou no retorno "Ainda esta". A cascata não é opção de menu. A consulta só traz estação `ABASTECIMENTO` que ainda está `OPERANDO` no bairro da ocorrência. A drenagem do Bom Jesus nem entra. A trava é o próprio `UPDATE`: a linha só muda para `SEM_ENERGIA` se o status ainda for `OPERANDO`. A transação que altera a linha cria um `ALERTA` de origem `CASCATA`, do tipo falta de água, liga os bairros de `ESTACAO_BAIRRO` e pede ao `NotificacaoService` um aviso por pessoa que segue algum desses bairros. Quem segue dois deles recebe uma notificação. A confirmação, a mudança da estação, o alerta e as notificações commitam juntos.

---

## **DT-100 — Conceitos do curso mostrados na solução**

O morador de Porto Alegre relata falta de luz, falta de água ou alagamento no bairro. O vizinho confirma, ou marca que o serviço voltou. Se a falta de luz fica confirmada no bairro de uma estação de abastecimento, quem segue os bairros que ela abastece recebe um aviso de possível falta de água. Esse é o recorte da demo.

O desenho dessa demo já estava fechado antes deste código. O diagrama de arquitetura separa o menu, os serviços, os DAOs e a `ConnectionFactory`, até o Oracle. O modelo relacional guarda as 13 tabelas: a ocorrência é o que alguém viu; o alerta é o aviso, oficial ou gerado pela cascata; `NOTIFICACAO` aponta só para `ALERTA`; a estação tem o bairro onde fica e, em `ESTACAO_BAIRRO`, os bairros que abastece. O código em `backend/`, pacote `br.com.alertabairro`, segue esses dois desenhos. Nenhuma regra nova entrou aqui.

A orientação a objetos aparece nas entidades. `Ocorrencia` recebe tipo, bairro, status, severidade e datas no construtor e recusa valor incoerente antes de qualquer SQL. `TipoOcorrencia` carrega o código e as horas da janela. `Estacao` carrega o nome usado no aviso. O serviço trabalha com esses objetos; a tela só lê os getters.

Os enums fecham os valores que o banco também restringe por `CHECK`. `StatusOcorrencia` é `ATIVA`, `RESOLVIDA` ou `EXPIRADA`. `TipoConfirmacao` é `CONFIRMA` ou `RESOLVEU`, o "Ainda esta" e o "Ja voltou" do menu. `OrigemAlerta` separa `OFICIAL` de `CASCATA`. `StatusEstacao` separa `OPERANDO`, `SEM_ENERGIA` e `DESLIGADA`. O DAO grava `StatusEstacao.SEM_ENERGIA.name()` no `UPDATE`, o mesmo texto da constraint.

As coleções atravessam as camadas. O menu percorre `List` de bairros, tipos e pessoas para montar a escolha. O DAO de ocorrência devolve `ArrayList` na listagem do bairro. Na cascata, a lista de estações ainda operando é percorrida uma a uma, e `UsuarioBairroDAO` usa `DISTINCT` para a pessoa que segue dois bairros abastecidos entrar uma vez só na lista de notificações.

As camadas são as setas do diagrama. `MenuPrincipal` lê a opção e chama `OcorrenciaService`. O serviço aplica o agrupamento e a confirmação. Dali chama `CascataService`, que chama `NotificacaoService`. Os quatro passam pelos DAOs. O menu não monta SQL e o DAO não decide se o relato é duplicado.

A conexão com o banco é JDBC. `ConnectionFactory` abre uma conexão com o Oracle, com auto-commit desligado. Cada DAO prepara um `PreparedStatement` e preenche os parâmetros. `Identificador` calcula o próximo número da tabela, no mesmo padrão do script, que não usa `IDENTITY`. `Transacao` dá commit se o serviço termina e desfaz a transação se o SQL ou a regra falha, para a estação não ficar sem energia sem o alerta correspondente.

A modelagem aparece na hora em que o serviço grava. O relato vira linha de `OCORRENCIA` e de `CONFIRMACAO`, e o contador sobe junto com a linha. O aviso vira `ALERTA`, `ALERTA_BAIRRO` e `NOTIFICACAO`. A lista de ocorrências ativas do bairro continua sendo uma consulta, como o modelo definiu.

## DT-86 Persistência de dados demonstrada

Ligamos o menu ao Oracle local. O programa aplica o script das 13 tabelas, e cada operação passa por um DAO com `PreparedStatement` até a `ConnectionFactory`. Registrar um relato insere a linha em `OCORRENCIA`. Ver as ocorrências ativas do bairro consulta essas linhas. Confirmar ou marcar que já voltou atualiza o contador e, com três retornos de "já voltou", encerra a ocorrência como `RESOLVIDA`. O autor não aparece na tela.

As três consultas mostram esse resultado fora do menu. 

`SELECT table_name FROM user_tables` lista as tabelas que o script criou.

!image.png

 `SELECT id_bairro, nome FROM bairro` mostra o piloto gravado junto com o script: os bairros que o menu oferece na hora de registrar. 

!image.png

`SELECT id_ocorrencia, status, severidade, confirmacoes, descricao FROM ocorrencia` é o relato que o menu inseriu e que continua no banco depois que o programa fecha.

!image.png

## DT-85 Sistema Java em execução

!image.png

!image.png

## DT-88 Modelo de dados

O diagrama relacional guarda o que a demo do Alerta Bairro precisa distinguir: o relato de quem está no bairro, a confirmação dos vizinhos e o aviso que sai disso. Ocorrência e alerta são registros diferentes. A ocorrência é o que alguém viu (falta de luz, alagamento, falta de água). O alerta é o aviso entregue pelo sistema, vindo de uma fonte oficial ou gerado pela cascata. `NOTIFICACAO` aponta só para `ALERTA` porque a lista de ocorrências ativas do bairro é uma consulta, não uma mensagem enviada a alguém.

A cascata usa as duas ligações da estação, e as duas estão no diagrama por isso. `ESTACAO_BOMBEAMENTO.ID_BAIRRO` é o bairro onde a estação fica: a falta de luz confirmada ali marca a estação sem energia. `ESTACAO_BAIRRO` lista os bairros que ela abastece, e o alerta de água vai para esses. Entra nessa regra só a estação do tipo abastecimento. `USUARIO_BAIRRO` existe pelo mesmo motivo: uma pessoa segue vários bairros, cada um com um apelido (casa, trabalho), e o aviso chega só a quem segue o bairro afetado.

`ID_AUTOR` permanece em `OCORRENCIA` para a reputação e para a mesma pessoa não confirmar duas vezes o mesmo relato. A tela não mostra esse nome: o mapa usa só o bairro. `CONFIRMACOES` é o contador que o serviço atualiza junto com as linhas de `CONFIRMACAO`, para a consulta da demo ler o total sem percorrer a tabela. `NIVEL_GUAIBA` não tem bairro porque é a medição da cidade, usada na correlação com as ocorrências. Em `CONTATO`, o telefone é obrigatório e o bairro vazio significa que o número vale para Porto Alegre inteira, como o 199.

!alerta_bairro.png

## DT-87 Diagrama de arquitetura

A figura descreve a demo técnica: um programa Java 17, em Maven, que acessa o Oracle por JDBC. O menu de console é a interface dessa demo, para a avaliação ver o sistema executar sem depender das telas, que seguem no desenho. O menu lê a opção e chama o serviço. O serviço aplica a regra. O DAO executa o SQL com `PreparedStatement`, e uma única `ConnectionFactory` abre a conexão. Assim o comando SQL não fica espalhado pelo menu, e a regra de agrupar um relato não fica dentro do DAO.

As setas seguem essa divisão. `MenuPrincipal` chama `OcorrenciaService`, para registrar ou confirmar um relato, e `ExpiracaoService`, para encerrar o que passou do prazo do tipo. A cascata não é uma opção do menu. Ela ocorre dentro do registro, quando a falta de luz foi confirmada no bairro de uma estação de abastecimento. `CascataService` marca essa estação sem energia uma vez só e pede ao `NotificacaoService` o aviso de água para quem segue os bairros que ela abastece. Os quatro serviços passam pelos DAOs.

Ficam de fora desta figura as evoluções já previstas no guia: integração com API oficial de chuva e de nível do Guaíba, push no celular e aviso por SMS. Na demo esses dados entram cadastrados. O código dessa arquitetura fica em `backend/`, no pacote `br.com.alertabairro`.

!image.png