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