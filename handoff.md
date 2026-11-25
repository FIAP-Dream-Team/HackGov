# Handoff

Ponto de retomada do projeto. Uma janela nova, lendo **este arquivo mais o `CLAUDE.md`**, consegue continuar
de onde a anterior parou sem precisar do histórico da conversa.

A seção 1 é a parte viva e é o que se atualiza ao fechar uma sessão. As seções 2 em diante mudam pouco.
Toda afirmação de estado aqui foi verificada por comando, e os comandos estão na seção 8. Se algo neste
arquivo contradisser o disco, o disco vence e este arquivo é que está errado.

Última atualização: **18/11/2026**.

---

## 1. Estado atual

### Fase 4, em andamento

Capítulo corrente: **Fase 4**. O texto abaixo desta nota ainda descreve a Fase 3 e está desatualizado onde
conflitar com o disco.

Parte 1 da Fase 4 está em código na `main`. A US01 (`DT-36`) foi mergeada pelo PR #2. A US02 (`DT-37`) pelo PR #3. A US03 (`DT-38`) pelo PR #4. A US04 (`DT-39`) pelo PR #5. A US05 (`DT-40`) pelo PR #6.

**Parte 3 (front React), 20/11/2026**, na branch `feature/fase-4-front-us01-us05`, ainda sem commit: as quatro rotas
(`/acompanhar`, `/equipe`, `/painel`, `/totem`) consomem a API real, só com as US01–US05. Nenhuma história nova foi criada:
a Larissa pediu para esperar. Estrutura e roteiro de demonstração em `src/README.md`. Testado no navegador: validação,
login, liberar, agendar, reagendar, chamar senha com painel via SSE, falta, totem, sessão vencida e servidor fora do ar.
Lacuna do backend: depois de uma falta, nem a equipe (409 "o agendamento precisa ser cancelado") nem o cidadão conseguem
remarcar. O botão foi retirado do front. Dados sintéticos ampliados no `DadosSinteticos.java`: 6 cidadãos, `MV-2026-0001` a `0006` em 3 especialidades e o login `gestor.centro` (tabela em `src/README.md`). O CORS do backend passou a aceitar qualquer porta de localhost. **Parte 4 (segurança), 24/11/2026:** limite de 5 tentativas com bloqueio de 5 min (app, totem e equipe), sessão que vence sem uso (30 min app/equipe, 3 min totem), `DELETE /api/equipe/sessao`, segregação de funções (atendente opera; gestor conclui e acompanha indicadores; regra decidida nesta sessão e ainda não validada pelo grupo) e totem que limpa a tela após 1 min parado. 15 testes em `SegurancaHttpTest`, 58 no total passando (inclui a conferência de unidade na chamada de senha, que faltava). Proteção contra iframe (cabeçalhos no backend e no Vite, script de reserva no index.html), testada com uma página de outra origem. Console H2 continua aberto sem senha (pendente). Textos das Partes 3 e 4 em `docs/fase-4/parte-3-prototipo-react.md` e `parte-4-seguranca.md`, com prints em `docs/fase-4/prints/`. Nada disso foi commitado. `LandingHome.tsx` já tinha `colorSystem` sem uso, e isso quebra o `npm run build` (erro TS6133 anterior a esta branch).

A fila da equipe, em `src/backend`, é do canal institucional. Atendente e gestor entram com o login da equipe. Token de cidadão recebe 403. Sem token, 401.

- `GET /api/equipe/fila` segmenta os encaminhamentos da unidade de lotação por especialidade. Fila vazia responde 200 com "Nenhum encaminhamento nesta unidade." `?especialidade=` sem encaminhamento devolve o segmento vazio, sem erro. Cada item traz protocolo, nome e status. CPF não sai. O nome fica neste canal: o painel público e o acompanhamento continuam sem ele.
- A ação pendente não é coluna. `AGUARDANDO_AGENDAMENTO` sem agendamento ativo vira `COBRAR_MARCACAO` ("Cobrar marcação"). O último agendamento em `FALTA` vira `REAGENDAR` ("Reagendar"). "Buscar resultado" não sai no JSON: o modelo lógico não tem dado para essa ação.
- A espera média está em `esperaMediaSegundos`. É a última permanência em `AGUARDANDO_AGENDAMENTO`, em segundos inteiros, fechada na troca de status ou no instante da consulta se a etapa ainda está aberta. Quem nunca entrou nessa etapa não entra na média. Sem amostra, a mensagem é "Ainda não há espera medida."
- A taxa de faltas é `taxaFaltasPercentual`, com `faltas` e `agendamentos`. O denominador ignora agendamento cancelado. Sem agendamento contável, a mensagem é "Ainda não há agendamento para calcular a taxa de faltas."
- `POST /api/equipe/encaminhamentos/{protocolo}/falta` registra a falta do agendamento ativo, só na unidade da equipe. O horário continua ocupado. O painel da sala deixa de mostrar a senha, porque o agendamento deixou de estar ativo. O reagendamento do cidadão continua exigindo agendamento ativo.

O acervo continua em memória. O dado sintético `MV-2026-0001` segue em `RECEBIDO_TRIADO`, especialidade Cardiologia, com os três horários livres da US03. Na fila da UBS Centro ele aparece sem ação pendente até a equipe liberar o agendamento. Não há falta semeada.

`docs/arquivos-fases/` está untracked e não faz parte dessa story. Os comentários do backend estão em português. O rascunho da Parte 1 está em `docs/fase-4/parte-1-versao-atual.md`. O contrato está em `docs/fase-4/contrato-da-api.md`. A coleção do Insomnia, com a base local, está em `docs/fase-4/insomnia/HackGov-Minha-Vez-local.json`. Os cards `DT-112`, `DT-119` e `DT-129` continuam em Todo: o texto ainda não foi entregue ao João nem o contrato passado à Brenda.

### Repositório

Branch `main`, que rastreia `origin/main` em `https://github.com/FIAP-Dream-Team/HackGov.git`. A Fase 1 (Cap 1)
foi entregue. Vídeo da Fase 2: composição `Fase2`, narração `sources/video/fase-2/audio.wav` (3:45)
alinhada em `src/data/fase-2/cues.json`. Pipeline copiado em `scripts/fase-2/` — os scripts da
Fase 1 não foram alterados. Tutorial de User Story em
`docs/como-criar-user-stories-no-linear.md`. Tokens de design em `docs/design/tokens.json`.
Protótipo no Figma [Minha vez](https://www.figma.com/design/jVZtzCqq1vTrkIXsqF5yHf/Minha-vez).
Fluxos e critérios de validação da Parte 3 em
`docs/fase-2-parte-3-prototipo-e-validacao.md` (rascunho para o PDF; `DT-27`/`DT-28` ainda Backlog).
Recorte Java do domínio alinhado ao modelo lógico nos itens de prioridade alta
(20/10/2026): nascimento obrigatório, protocolo e urgência, histórico de criação,
`UnidadeSaude` com origem, destino e filtro de vaga, reagendar cria outro
`Agendamento` apontando para o anterior, cancelar mantém o horário e grava a data,
limite de 2 reagendamentos e prazo de 24 h. Credenciais, chamada, contato e JPA
continuam fora. Registro em `docs/modelo-logico/alinhamento-java.md`.
Conferência: `DemoModelagem` e `RegrasDoEncaminhamentoTest`.
Parte 4 em `docs/modelo-fisico/modelo-fisico.md`. A figura é
`docs/modelo-fisico/minha_vez_fisico.png`, exportada do Data Modeler a partir de
`minha_vez_fisico.sql` (12 tabelas, com `CEP`). O `minha_vez_ddl.sql` da Parte 2 não foi
alterado.
Parte 5 em `docs/scripts-sql/scripts-sql.md`. O DDL é o mesmo `minha_vez_fisico.sql` da
Parte 4 (12 PK, 18 FK, 13 UNIQUE, 14 CHECK). Em 23/10/2026 rodou no H2 2.2.224 em modo
Oracle: 12 tabelas e 5 índices comuns. Os dois índices com `CASE WHEN` o H2 recusou; no
teste viraram coluna calculada. O arquivo SQL não foi alterado e não rodou num Oracle real.

### Linear

Workspace `FIAP Dream Team`, time `Dream Team`, prefixo `DT`, cycles desligados. Labels do projeto:
`Entrega acadêmica`, `User Story`, `Implementação`. Project `HackGov`. Capítulo em andamento: **Fase 3**.
Datas internas de 15/10/2026: Parte 2 em 19/10; Partes 1, 3, 4 e 5 em 23/10; PDF, roteiro e slides em 26/10; vídeo em 30/10; ZIP e entrega em 03/11. O enunciado colado não trazia o prazo da FIAP ON.

Milestones da Fase 3, criados em 15/10/2026. Responsáveis fechados pelo Vinícius em 15/10: Parte 1 e ZIP com João; Parte 2 e slides com Larissa; Parte 3, PDF e roteiro com Brenda; Partes 4 e 5 e vídeo com Vinícius.

- `Fase 3 - Parte 1 - Versão atual do projeto` — `DT-45` texto da evolução, `DT-42` wireframes, `DT-44` UML, `DT-43` Java
- `Fase 3 - Parte 2 - Modelo lógico` — `DT-46`
- `Fase 3 - Parte 3 - Formas normais` — `DT-47`
- `Fase 3 - Parte 4 - Modelo físico` — `DT-49`
- `Fase 3 - Parte 5 - Scripts SQL` — `DT-48`
- `Entrega da Fase 3` — `DT-50` PDF, `DT-51` slides, `DT-52` roteiro, `DT-54` vídeo, `DT-53` ZIP

Sprint 1 da Fase 2 virou filhos `Implementação` (`DT-55`–`DT-73`, T01–T19), sem milestone de Parte.
Horas do consolidado foram gravadas no campo de estimativa do Linear, que o time exibe como pontos; o
valor em horas está na descrição de cada card. Responsáveis conforme o consolidado da Fase 2.

| Story | Filhos |
| --- | --- |
| US01 `DT-36` | T03–T07, mais a base T01, T02, T18 e T19 (servem US01–US03; pai único é a US01) |
| US02 `DT-37` | T08–T12 |
| US03 `DT-38` | T13–T17 |
| US04 `DT-39` e US05 `DT-40` | sem filho |

`DT-41` é um card de teste da label `Implementação`, título pede para apagar. Não foi cancelado nesta sessão.

`docs/decisoes.md` existe. Serviço: saúde / atenção primária na UBS, produto Minha Vez. `DT-6` ainda
pode estar desatualizado em relação a esse arquivo.

---

## 2. O projeto em uma página

HackGov é projeto em grupo da FIAP sobre transformação digital da gestão pública: escolher um serviço público
real, diagnosticar um problema concreto percebido pela população próxima ao grupo, levantar requisitos, montar
backlog, analisar dados e propor a primeira versão conceitual de um sistema que será desenvolvido ao longo do
ano.

Capítulo em andamento: **Fase 3** (banco de dados). A Fase 2 foi entregue. Eixo: acompanhamento. Serviço:
saúde / medicina primária (filas da atenção primária). A Fase 1 (Cap 1) está entregue.

Entrega: `.ZIP` único com PDF das Partes 1 a 4, código ou GitHub, slides em PDF, e link do vídeo não listado
com o Java rodando. Alvos internos: partes 1 a 4 em 24/09; roteiro em 30/09; gravação e ZIP em 04/10.

Grupo 1: Vinícius Cardoso Junqueira, Brenda Cristina Martins Araújo, Ana Larissa Cristo Mendes, João Pedro
Thethê Andrade e John Vitor Silverio Pereira. Perfis e capacidades em `persona.md`.

---

## 3. Decisões já tomadas

Nenhuma delas está em `docs/decisoes.md` ainda, porque o arquivo não existe. Ao criá-lo, migrar estas linhas
para lá e deixar aqui só o ponteiro.

| Data | Decisão | Quem |
| --- | --- | --- |
| antes de 10/08/2026 | O eixo do produto é **acompanhamento**: o cidadão precisa saber em que pé está a solicitação sem ligar, ir presencialmente ou conhecer alguém dentro do órgão | votação do grupo |
| 10/08/2026 | Rastreamento no Linear via MCP em **escopo local**, chave pessoal do workspace da FIAP, sem tocar em outros workspaces da máquina | John |
| 10/08/2026 | Project `HackGov` único, guarda-chuva do ano, com milestones por fase, em vez de um project por capítulo | John |
| 11/08/2026 | A decisão do tema é **direcionamento**, não especificação. Detalhamento de requisito só na Fase 2 | John |
| 11/08/2026 | **Quem decide responsável é a reunião do grupo.** A alocação de `persona.md` é proposta e só se aplica a tarefa que a reunião não distribuiu explicitamente | John |
| 11/08/2026 | Dado da Parte 4 pode ser criado, mas dado inventado é rotulado como sintético na tabela e no documento, com a premissa escrita ao lado. Dado real vai com órgão, ano e link | John |
| 19/08/2026 | Serviço público: **saúde / medicina primária**, tema de filas no atendimento | grupo, comentário em `DT-6` |
| 15/09/2026 | Board da Fase 2: label `Entrega acadêmica` vs `User Story` / `Implementação`; sem milestone Sprint 1; User Stories ficam a cargo de `DT-21`/`DT-22` | Vinícius |

---

## 4. O que está bloqueado

**O enunciado colado não traz a data oficial da FIAP ON.** As datas nos cards são alvos internos: Parte 2 em 19/10, Partes 1, 3, 4 e 5 em 23/10, PDF, roteiro e slides em 26/10, vídeo em 30/10, ZIP em 03/11.

**`docs/decisoes.md` ainda não existe.** A decisão do serviço vive só no comentário de `DT-6`.

---

## 5. Próximos passos, em ordem

1. Conferir na FIAP ON se o prazo oficial da Fase 3 bate com o alvo interno de 03/11.
2. Executar a Sprint 1 nos filhos `DT-55`–`DT-73`.
3. Apagar ou cancelar `DT-41` (card de teste).

`README.md` ainda descreve o Cap 1 e o serviço em aberto. Atualizar quando for a vez da documentação humana.

---

## 6. Regras que a próxima janela precisa respeitar

**Não inventar RM, nome ou dado de pesquisa.** Não criar filhos `Implementação` no lugar de `DT-22`. Dado sintético é permitido pelo enunciado e é rotulado como
tal, com a premissa ao lado. Dado fabricado apresentado como real derruba a nota inteira quando alguém
pergunta a fonte.

**Não criar card no Linear antes de o dono aprovar a lista.** Identificador criado já entra em circulação e
renomear depois bagunça a referência de todo mundo.

**Não atribuir card por conta própria** quando existir decisão de reunião em contrário.

**Não afirmar que existe automação de status pelo GitHub**, porque ela não está configurada neste
repositório. Hoje quem move card é pessoa, pela MCP, com o OK do dono.

**Idioma:** documento, card e comentário em português. Identificadores e comentários de código em inglês.

A skill `linear-workflow` tem o resto: fronteira git versus Linear, o que é um card, definição de pronto e
isolamento do MCP. Ler antes de tocar em qualquer coisa no Linear.

---

## 7. Armadilhas já pagas

Cada uma destas custou tempo nesta sessão. Não pague duas vezes.

**Colar comando multilinha no fish.** Barra invertida de continuação com linha em branco no meio faz o fish
fechar o comando na primeira quebra e tratar o resto como comando novo. Foi assim que o servidor MCP entrou
sem o header de autenticação. Cole em uma linha só.

**`read -s` dentro de bloco colado.** O `read` consome a linha seguinte do próprio paste em vez de esperar
você digitar, e a variável termina vazia. O header ficou com a string `Bearer` e mais nada.

**O header precisa do esquema `Bearer `.** Sem ele o Linear responde 401 com mensagem que parece chave
inválida. Curiosidade útil: a API GraphQL do Linear aceita a chave crua no `Authorization`, o endpoint MCP
quer o `Bearer`.

**`claude mcp get` imprime a chave em texto puro** no transcript. `claude mcp list` não imprime. Para
inspecionar a config sem vazar segredo, leia o `~/.claude.json` e imprima só o comprimento e se começa com
`Bearer`.

**Servidor MCP carrega na abertura da sessão.** Adicionar o servidor no meio de uma sessão não faz as
ferramentas `mcp__linear__*` aparecerem nela. Reabra com `claude --continue` para manter a conversa.

**GraphQL do Linear tem teto de complexidade** em 10000. Consulta grande com vários níveis aninhados volta
`Query too complex`; quebre em duas. E `projectStatuses` é uma connection, então precisa de `{ nodes { ... } }`.

**Heredoc em `bash -c` come acentuação** se você não cuidar do encoding. Para mandar texto em português para
a API, escreva em arquivo com UTF-8 e leia do arquivo, em vez de embutir no heredoc.

**Um card do Linear tem um assignee só.** Entregável com dois donos vira dois cards, não um card com dois
nomes no corpo.

**A infra que a Brenda domina é infraestrutura de TI**, não infraestrutura urbana. Não entregue a ela a
pesquisa da frente de infraestrutura urbana por causa da palavra.

---

## 8. Comandos de verificação

Estado do repositório:

```fish
git status -sb
git log --oneline -5
git remote -v
```

Config do MCP sem vazar a chave:

```fish
python3 -c "
import json
d = json.load(open('/home/johnsilverio/.claude.json'))
s = d['projects']['/home/johnsilverio/Documents/projects/HackGov']['mcpServers']
for n, c in s.items():
    a = (c.get('headers') or {}).get('Authorization', '')
    print(n, c.get('url'), 'BearerOk:', a.startswith('Bearer '), 'len:', len(a))
"
```

Estado do quadro, quando as ferramentas MCP estiverem carregadas: `list_teams` a partir deste diretório tem
que devolver apenas `Dream Team`, o que é a prova de que o escopo local está segurando. Depois `list_projects`
e `list_issues` para o resto.
