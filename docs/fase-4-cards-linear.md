# Fase 4 · Cards a criar no Linear

**Status: criado em 17/11/2026** (aprovado pelo John no mesmo dia): 6 milestones, `DT-112` a `DT-118` (entrega) e `DT-119` a `DT-132` (subcards). A divisão vem da reunião do grupo (mensagens
do João Pedro) e está registrada em `docs/decisoes.md` (linha de 17/11/2026). Esta é a lista exata: criar
como está, sem acrescentar, juntar nem dividir cards. Depois de criar, trocar o status desta linha para
"criado em <data>" e anotar os identificadores `DT-` na coluna "DT" de cada tabela.

Atividade: **Cap 1 - Atividade - HackGov: Sistema Enterprise** (Fase 4), na FIAP ON de 11/11 a
**06/12/2026, 23h59**. O enunciado tem cinco Partes: 1 versão atual, 2 ajustes no backlog, 3 protótipo React,
4 segurança, 5 blockchain. A entrega é um ZIP com o documento em PDF, os slides em PDF (até 10, o primeiro com
nome completo, RM e foto), o código ou o link do GitHub, e o link do vídeo (até 5 min, não listado no
YouTube, com pitch pelos slides e navegação real), feita por quem cadastrou o grupo.

## Antes de criar (para o Claude da sessão nova)

1. Ler `.claude/skills/linear-workflow/SKILL.md`. Esta lista já tem a aprovação que a skill exige.
2. Rodar `list_teams`: tem que voltar só o time **Dream Team** (prefixo DT). Se aparecer time de outro
   workspace, parar e avisar.
3. Conferir que existem as labels `Entrega acadêmica` e `Implementação` e o project `HackGov`. Não criar
   label nova.
4. O CLAUDE.md e a skill ainda descrevem a Fase 2 (datas de 03/08 a 04/10). Para a Fase 4 vale este arquivo.

## Decisões de estrutura (não "corrigir")

- **Milestones só para os entregáveis do enunciado**: as cinco Partes e a Entrega.
- **Os itens de trabalho são subcards (`Implementação`) da Parte que atendem**, não filhos de User Story. É
  um desvio consciente da skill, pedido pelo grupo.
- **Card com duas pessoas tem um principal**, que vai no responsável. A outra pessoa aparece na descrição como
  "Apoio".
- **Datas internas não foram decididas.** Não preencher a data dos cards. Só o milestone `Fase 4 - Entrega`
  leva data alvo (06/12/2026).
- **Estimativa e prioridade ficam vazias** (a skill põe "sem prioridade" como padrão). O grupo não fechou
  estimativa para a Fase 4.
- **Status inicial:** `Todo` em tudo, menos o subcard do Spring, que fica em `Backlog` (opcional).

## Nomes no Linear

| Pessoa | Nome no Linear |
| --- | --- |
| Vinícius Cardoso Junqueira | Vinicius Cardoso |
| John Vitor Silverio Pereira | John Silverio |
| Brenda Cristina Martins Araújo | Brenda Araújo |
| Ana Larissa Cristo Mendes | Larissa Mendes |
| João Pedro Thethê Andrade | Jão TT |

## 1. Project

- `HackGov`: data final **06/12/2026**. No conteúdo do project, acrescentar o critério de saída da Fase 4:
  "ZIP na FIAP ON até 06/12/2026 com documento (Partes 1 a 5) em PDF, slides em PDF, código ou link do GitHub
  e link do vídeo não listado."

## 2. Milestones (6)

| Milestone | Data alvo |
| --- | --- |
| `Fase 4 - Parte 1 - Versão atual do projeto` | — |
| `Fase 4 - Parte 2 - Ajustes no backlog` | — |
| `Fase 4 - Parte 3 - Protótipo funcional com React` | — |
| `Fase 4 - Parte 4 - Segurança da informação` | — |
| `Fase 4 - Parte 5 - Reflexão sobre Blockchain` | — |
| `Fase 4 - Entrega` | 06/12/2026 |

## 3. Cards de entrega (7), label `Entrega acadêmica`

Descrição de cada card: as linhas **Rastro**, **Critério de aceitação** e, quando houver, **Apoio**.

| # | Título | Responsável | Milestone | DT |
| --- | --- | --- | --- | --- |
| E1 | Parte 1: evoluções do HackGov desde a Fase 3 descritas | Vinicius Cardoso | Parte 1 | `DT-112` |
| E2 | Parte 2: backlog atualizado com as novas user stories e os critérios de aceitação | John Silverio | Parte 2 | `DT-113` |
| E3 | Parte 3: protótipo React funcional e responsivo | Brenda Araújo | Parte 3 | `DT-114` |
| E4 | Parte 4: três práticas de segurança aplicadas e justificadas | Larissa Mendes | Parte 4 | `DT-115` |
| E5 | Parte 5: reflexão sobre blockchain escrita | Jão TT | Parte 5 | `DT-116` |
| E6 | Documentação consolidada em PDF, slides, roteiro e ZIP entregue | Jão TT | Entrega | `DT-117` |
| E7 | Vídeo de até 5 min gravado, editado e publicado como não listado | John Silverio | Entrega | `DT-118` |

**E1** · Rastro: Cap 1, Parte 1. Critério: o rascunho da Parte 1 relata o que evoluiu no HackGov desde a
entrega da Fase 3 (modelo lógico e físico, domínio Java alinhado, o que entrou na Fase 4) e foi entregue ao
João para a consolidação.

**E2** · Rastro: Cap 1, Parte 2. Critério: o backlog tem as novas user stories de front-end, de segurança e
de manipulação de arquivos, e as prioritárias têm critérios de aceitação escritos; o rascunho foi entregue ao
João. Apoio: Vinícius (reavaliação das user stories antigas, subcard I14).

**E3** · Rastro: Cap 1, Parte 3. Critério: o protótipo em React roda, é responsivo e tem formulário com
validação, consumo de API (real ou simulada), estados de carregando, sucesso e falha, componentes
reutilizáveis com estilo consistente e o cliente de API em módulo próprio; a estratégia de simulação está
escrita no documento. Apoio: Larissa.

**E4** · Rastro: Cap 1, Parte 4. Critério: pelo menos três práticas reais de segurança estão no código, cada
uma com a justificativa escrita no rascunho da Parte 4, entregue ao João.

**E5** · Rastro: Cap 1, Parte 5. Critério: o texto cita ao menos uma referência de sistema GovTech com
blockchain, indica o evento do HackGov mais crítico para registro imutável e por quê, e diz o que seria
registrado como evidência (por exemplo, o hash do evento ou do documento) e o que não deve ser registrado.

**E6** · Rastro: Cap 1, "Avaliação" (documento, slides, ZIP). Critério: os rascunhos das Partes 1 a 5 foram
consolidados num documento em PDF; os slides em PDF têm até 10 páginas, e o primeiro tem nome completo, RM e
foto dos cinco; o roteiro do vídeo (pitch pelos slides e navegação real) foi escrito; o link do vídeo está
no documento e nos slides; o ZIP abre corretamente depois de descompactado, com tudo numa pasta só, e foi
enviado na FIAP ON por quem cadastrou o grupo.

**E7** · Rastro: Cap 1, "Avaliação" (vídeo). Critério: o vídeo tem até 5 min, com o pitch pelos slides e a
demonstração da aplicação em funcionamento (navegação real), está publicado como não listado no YouTube, abre
sem login, e o link foi passado ao João para o documento e os slides.

## 4. Subcards (14), label `Implementação`, filhos do card de entrega

Cada subcard herda o milestone do pai. Descrição: **Rastro** (o mesmo do pai, com o item do enunciado) e
**Critério de aceitação**.

### Embaixo de E3 (Parte 3), responsável **Brenda Araújo**, apoio Larissa

| # | Título | Critério de aceitação | DT |
| --- | --- | --- | --- |
| I2 | Cliente da API em módulo próprio (`lib/api.ts`) com endpoints simulados | As telas só chamam a API por `lib/api.ts`; os endpoints simulados respondem no formato do contrato, inclusive os erros | `DT-120` |
| I3 | Estratégia de simulação da API escrita no documento | O documento explica como a API foi simulada e mostra que o contrato (respostas e erros) foi considerado | `DT-121` |
| I4 | Layout responsivo das telas de acompanhamento e agendamento | As duas telas funcionam no celular e no computador, sem rolagem lateral nem conteúdo cortado | `DT-122` |
| I5 | Componentes reutilizáveis: botão, card, campo, alerta e cabeçalho | Os cinco componentes existem como componentes próprios e as telas os usam, em vez de repetir marcação | `DT-123` |
| I6 | Estilo consistente com os tokens de design | Cores, tipos e espaçamentos vêm de `docs/design/tokens.json`; nenhuma tela usa valor solto fora dos tokens | `DT-124` |
| I7 | Formulário com validação de dados (identificação do cidadão ou agendamento) | Dado inválido mostra mensagem clara no campo e o envio fica bloqueado até a correção | `DT-125` |
| I8 | Telas ligadas à API pelo módulo `lib/api.ts` | Acompanhamento e agendamento leem e enviam dados pelo cliente de API, não por dado fixo na tela | `DT-126` |
| I9 | Estados de integração carregando, sucesso e falha nas telas | Cada chamada mostra o estado de carregando, o resultado de sucesso e uma mensagem de falha que a pessoa entende | `DT-127` |
| I10 | Exportação do comprovante ou do histórico em JSON/CSV | A pessoa baixa o comprovante ou o histórico em JSON ou CSV, e o arquivo abre com os dados certos | `DT-128` |

### Embaixo de E1 (Parte 1), responsável **Vinicius Cardoso**

Movido da Parte 3 em 17/11/2026 (decisão do John em `docs/decisoes.md`): o Vinícius escreve o contrato a
partir das user stories e cria os endpoints; tudo que mexe com Java é dele, por isso o Spring (I11) veio junto. No Linear, I1: bloqueado por `DT-132`, bloqueia `DT-120` e `DT-129`.

| # | Título | Critério de aceitação | DT |
| --- | --- | --- | --- |
| I1 | Contrato da API escrito: endpoints, formato do JSON e erros previsíveis | Cada endpoint tem método, caminho, JSON de resposta e erros previsíveis (status e corpo) documentados, e o contrato foi passado à Brenda para as interfaces | `DT-119` |
| I11 | Endpoints reais no Spring (se der tempo) | Pelo menos um endpoint do contrato responde do Spring no formato documentado. Status `Todo` desde 17/11 | `DT-129` |

### Embaixo de E4 (Parte 4), responsável **Larissa Mendes**

| # | Título | Critério de aceitação | DT |
| --- | --- | --- | --- |
| I12 | Três práticas de segurança aplicadas no código | Pelo menos três práticas estão implementadas e dá para mostrar no código (exemplos do grupo: login com senha criptografada, acesso por perfil em que o cidadão não entra em `/equipe`, validação de entrada no back-end) | `DT-130` |
| I13 | Justificativa de cada prática de segurança escrita no documento | Cada prática tem o risco que ela trata, como foi aplicada e onde está no código | `DT-131` |

### Embaixo de E2 (Parte 2), responsável **Vinicius Cardoso**

| # | Título | Critério de aceitação | DT |
| --- | --- | --- | --- |
| I14 | User stories antigas (DT-36 a DT-40) reavaliadas | Cada uma das cinco foi revista para a Fase 4 (mantida, ajustada ou substituída), com o motivo, e o resultado foi passado ao John para a Parte 2 | `DT-132` |

## 5. Conferência depois de criar

- `list_issues` do project `HackGov` filtrado pela Fase 4: 7 cards `Entrega acadêmica` e 14 `Implementação`.
- Cada subcard tem o pai certo e herdou o milestone do pai.
- Responsáveis: Vinicius (E1, I1, I11, I14), John (E2, E7), Brenda (E3, I2–I10), Larissa (E4, I12, I13), João (E5, E6).
- Anotar os `DT-` nas tabelas acima e trocar o status do topo para "criado em <data>".
