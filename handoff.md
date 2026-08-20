# Handoff

Ponto de retomada do projeto. Uma janela nova, lendo **este arquivo mais o `CLAUDE.md`**, consegue continuar
de onde a anterior parou sem precisar do histórico da conversa.

A seção 1 é a parte viva e é o que se atualiza ao fechar uma sessão. As seções 2 em diante mudam pouco.
Toda afirmação de estado aqui foi verificada por comando, e os comandos estão na seção 8. Se algo neste
arquivo contradisser o disco, o disco vence e este arquivo é que está errado.

Última atualização: **20/08/2026**.

---

## 1. Estado atual

### Repositório

Branch `main`, rastreando `origin/main` em `https://github.com/FIAP-Dream-Team/HackGov.git`. Skills do Matt
Pocock e o setup Linear subordinado a `linear-workflow` entram neste commit; o restante do Cap 1 continua
aberto (serviço público, RMs, `docs/decisoes.md`).

O remote importa porque o enunciado aceita entregar o link do repositório no lugar de anexar o código, desde
que o acesso esteja liberado para o professor.

### Arquivos no disco

| Arquivo | O que é |
| --- | --- |
| `CLAUDE.md` | Contrato de trabalho para o agente: contexto, bloqueio ativo, regras, Agent skills |
| `README.md` | Documentação de entrada para humanos: projeto, enunciado inteiro, grupo, prazos, como o quadro funciona |
| `persona.md` | Perfis reais dos cinco integrantes, matriz de capacidade e alocação proposta do Cap 1 |
| `handoff.md` | Este arquivo |
| `.claude/skills/linear-workflow/SKILL.md` | Regras do Linear (precedência sobre skills do Matt) |
| `.agents/skills/` + `.claude/skills/` | 35 skills do Matt Pocock (`mattpocock/skills` via skills.sh) |
| `skills-lock.json` | Lock das skills instaladas |
| `docs/agents/` | Config do setup Matt: tracker Linear, triage, domínio |
| `.claude/settings.local.json` | Allowlist das ferramentas `mcp__linear__*`, fora do versionamento |
| `.gitignore` | Ignora `settings.local.json`, temporários de SO, editor e escritório |
| `specs/persona.md` | **Cópia velha** do primeiro rascunho de `persona.md`, com a matriz ainda em interrogação |

**Pendência a resolver logo:** `specs/persona.md` e `persona.md` são o mesmo documento em versões
diferentes, e a raiz é a versão boa. Duas cópias divergindo é como o grupo acaba lendo a alocação errada.
Decidir qual caminho fica e apagar o outro. `CLAUDE.md` e `README.md` apontam para a raiz.

**Referência pendurada:** `docs/decisoes.md` é citado no `CLAUDE.md`, no `README.md`, na skill e no corpo dos
três cards, e **ainda não existe**. Criar no momento em que a primeira decisão for registrada, não antes.

### Skills do Matt (20/08/2026)

Instaladas com `npx skills@latest add mattpocock/skills --agent cursor --agent claude-code --skill '*' -y --copy`.
Setup feito à mão: tracker = Linear subordinado a `linear-workflow`; labels de triage **não** criadas no
Linear. Plugin Claude Code do Matt **não** foi instalado (evita duplicata com skills.sh).

### Linear

Workspace `FIAP Dream Team` (`fiap-dream-team`), time `Dream Team`, prefixo `DT`, cycles desligados. Os cinco
integrantes já são membros ativos, todos como admin. As labels do time são as três padrão do Linear
(`Improvement`, `Bug`, `Feature`) e nenhuma label do projeto foi criada. Os estados do time são `Backlog`,
`Todo`, `In Progress`, `Done`, `Canceled` e `Duplicate`, sem estado de revisão.

Project `HackGov`, status `In Progress`, de 03/08/2026 a 06/09/2026, com short summary e o conteúdo completo
do enunciado no corpo. Duas milestones:

- `Fase 1 - Direcionamento`, alvo 17/08/2026. Fecha qual serviço público e até onde vai o escopo.
- `Fase 2 - Levantamento e análise de requisitos`, alvo 31/08/2026. É a Parte 2 do enunciado.

Ambas as datas foram propostas pelo agente e aceitas por omissão; não vieram de reunião.

Três cards, todos em `Todo`, todos na Fase 1, **todos sem responsável**:

| Card | Prioridade | O que é | Relação |
| --- | --- | --- | --- |
| `DT-5` | Urgent | Levantar evidência do problema de acompanhamento nas duas frentes candidatas | bloqueia `DT-6` |
| `DT-6` | Urgent | Decidir o serviço público do HackGov e registrar a decisão | bloqueia `DT-7` |
| `DT-7` | High | Fechar o escopo do acompanhamento, o que entra e o que fica de fora | bloqueado por `DT-6` |

As quatro issues de onboarding que o Linear cria sozinho (`DT-1` a `DT-4`) já foram removidas.

### MCP do Linear

Servidor `linear`, transporte HTTP, `https://mcp.linear.app/mcp`, em **escopo local** do Claude Code,
indexado pelo diretório `/home/johnsilverio/Documents/projects/HackGov`. A chave é pessoal, do workspace da
FIAP, e vive só em `~/.claude.json` sob `projects[<este diretório>].mcpServers`, nunca em arquivo
versionado. Isolamento verificado: a partir deste diretório a chave enxerga apenas `FIAP Dream Team`, e os
workspaces do mapsift e do Vale Verde não são tocados.

---

## 2. O projeto em uma página

HackGov é projeto em grupo da FIAP sobre transformação digital da gestão pública: escolher um serviço público
real, diagnosticar um problema concreto percebido pela população próxima ao grupo, levantar requisitos, montar
backlog, analisar dados e propor a primeira versão conceitual de um sistema que será desenvolvido ao longo do
ano.

Capítulo em andamento: **Cap 1 - Contextualizando o HackGov**, de 03/08/2026 até **06/09/2026 às 23h59** na
plataforma FIAP ON. Atraso de até três dias recebe no máximo 70% da nota, calculado automaticamente pelo
sistema.

Entrega: um `.ZIP` único, tudo dentro de uma mesma pasta, funcionando ao descompactar e abrir localmente, com
documentação em PDF das Partes 1 a 5, código ou link do GitHub com acesso liberado, slides em PDF, e o link
de um vídeo de até 5 minutos não listado no YouTube mostrando o sistema rodando. O link do vídeo aparece no
documento **e** nos slides. Submissão única, feita por quem cadastrou o grupo.

As cinco partes estão detalhadas no `README.md` e no corpo do project `HackGov` no Linear. O `CLAUDE.md` tem
a versão resumida.

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

---

## 4. O que está bloqueado

**O serviço público não foi escolhido.** As duas frentes na mesa são saúde (filas, vaga, acompanhamento,
atendimento) e infraestrutura urbana (ticket, análise, atendimento primário). Essa decisão trava as Partes 2,
3, 4 e 5 inteiras, porque requisito, user story, dataset e reflexão final derivam toda dela. **Não produza
conteúdo dessas partes assumindo uma frente.** Se a frente for necessária para avançar, pare e pergunte.

**Os RMs dos cinco integrantes estão em branco.** São obrigatórios na Parte 1 e no cadastro do grupo na
plataforma. Enquanto estiverem vazios, a Parte 1 não fecha por mais que o resto avance.

**A atribuição dos cards está pendente de reunião.** `DT-5`, `DT-6` e `DT-7` estão sem responsável de
propósito. `persona.md` tem a proposta, e nome no assignee é lido pelos outros quatro como decidido.

---

## 5. Próximos passos, em ordem

1. Resolver a duplicata `persona.md` versus `specs/persona.md`, apagando a versão velha.
2. Commitar o trabalho: `README.md`, `CLAUDE.md`, `persona.md`, `handoff.md`, `.gitignore` e `.claude/`. Nada
   disso está em commit ainda, e o repositório é a entrega.
3. Levar a alocação de `persona.md` para a reunião e fechar dono de `DT-5`, `DT-6` e `DT-7`.
4. Coletar os RMs e preencher em `README.md`, `CLAUDE.md` e no cadastro do grupo na plataforma.
5. Rodar `DT-5`, com atenção ao critério de disponibilidade de dado público, que é o que impede escolher uma
   frente e descobrir depois que a Parte 4 não tem de onde sair.
6. Fechar `DT-6`, criar `docs/decisoes.md` com a decisão e migrar a tabela da seção 3 para lá.
7. Fechar `DT-7` e só então abrir os cards da Fase 2.

Duas coisas pequenas que ficaram no caminho e podem ser feitas a qualquer momento: criar as labels do projeto
(`documentacao`, `requisitos`, `dados`, `codigo`, `apresentacao`, `video`, `decisao`), e decidir se o grupo
quer um estado `In Review` no time, que hoje não existe.

---

## 6. Regras que a próxima janela precisa respeitar

**Não escolher o serviço público sozinho.** É a decisão do grupo e está em card próprio.

**Não inventar RM, nome ou dado de pesquisa.** Dado sintético é permitido pelo enunciado e é rotulado como
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
