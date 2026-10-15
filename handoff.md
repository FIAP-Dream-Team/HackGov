# Handoff

Ponto de retomada do projeto. Uma janela nova, lendo **este arquivo mais o `CLAUDE.md`**, consegue continuar
de onde a anterior parou sem precisar do histórico da conversa.

A seção 1 é a parte viva e é o que se atualiza ao fechar uma sessão. As seções 2 em diante mudam pouco.
Toda afirmação de estado aqui foi verificada por comando, e os comandos estão na seção 8. Se algo neste
arquivo contradisser o disco, o disco vence e este arquivo é que está errado.

Última atualização: **02/10/2026**.

---

## 1. Estado atual

### Repositório

Branch `main`, rastreando `origin/main` em `https://github.com/FIAP-Dream-Team/HackGov.git`. A Fase 1 (Cap 1)
foi entregue. Vídeo da Fase 2: composição `Fase2`, narração `sources/video/fase-2/audio.wav` (3:45)
alinhada em `src/data/fase-2/cues.json`. Pipeline copiado em `scripts/fase-2/` — os scripts da
Fase 1 não foram alterados. Tutorial de User Story em
`docs/como-criar-user-stories-no-linear.md`. Tokens de design em `docs/design/tokens.json`.
Protótipo no Figma [Minha vez](https://www.figma.com/design/jVZtzCqq1vTrkIXsqF5yHf/Minha-vez).
Fluxos e critérios de validação da Parte 3 em
`docs/fase-2-parte-3-prototipo-e-validacao.md` (rascunho para o PDF; `DT-27`/`DT-28` ainda Backlog).
Recorte Java do domínio: a agenda de vagas fica em `Especialidade`; `Encaminhamento`
agenda, reagenda, cancela e só aceita a transição de status seguinte. `Cidadao` não
agenda. Identificação (RF01), indicadores da equipe, o `alt` da sequência e
falta/chamada continuam fora deste recorte.

### Linear

Workspace `FIAP Dream Team`, time `Dream Team`, prefixo `DT`, cycles desligados. Labels do projeto:
`Entrega acadêmica`, `User Story`, `Implementação`. Project `HackGov`, `In Progress`, 03/08/2026 a
**04/10/2026**.

Milestones da Fase 1 (100%, nomes prefixados) e da Fase 2:

- `Fase 2 - Parte 1 - Backlog e Sprint 1`, alvo 24/09/2026
- `Fase 2 - Parte 2 - UML e Java`, alvo 24/09/2026
- `Fase 2 - Parte 3 - Prototipação`, alvo 24/09/2026
- `Fase 2 - Parte 4 - Dispersão e probabilidade`, alvo 24/09/2026
- `Entrega da Fase 2`, alvo 04/10/2026 (roteiro 30/09; vídeo e ZIP 04/10)

Cards acadêmicos da Fase 2, **sem responsável** até a reunião:

| Card | Milestone | Due | Status |
| --- | --- | --- | --- |
| `DT-21` Refinar as user stories prioritárias | Parte 1 | 24/09 | Todo |
| `DT-22` Montar o Sprint Backlog da Sprint 1 | Parte 1 | 24/09 | Backlog |
| `DT-23` Definir e justificar pelo menos 3 métricas ágeis | Parte 1 | 24/09 | Backlog |
| `DT-24` Produzir os 4 diagramas UML | Parte 2 | 24/09 | Backlog |
| `DT-25` Escrever a reflexão técnica sobre a modelagem | Parte 2 | 24/09 | Backlog |
| `DT-26` Implementar o recorte Java do domínio | Parte 2 | 24/09 | Backlog |
| `DT-27` Produzir o protótipo da jornada essencial | Parte 3 | 24/09 | Backlog |
| `DT-28` Definir os critérios de validação | Parte 3 | 24/09 | Backlog |
| `DT-29` Revisar o dataset e calcular dispersão | Parte 4 | 24/09 | Todo |
| `DT-30` Pergunta probabilística e decisão de gestão | Parte 4 | 24/09 | Backlog |
| `DT-31` Compilar a documentação em PDF | Entrega | 24/09 | Backlog |
| `DT-32` Produzir os slides em PDF | Entrega | 30/09 | Backlog |
| `DT-33` Escrever o roteiro do vídeo | Entrega | 30/09 | Backlog |
| `DT-34` Gravar e publicar o vídeo | Entrega | 04/10 | Backlog |
| `DT-35` Montar o ZIP e entregar na FIAP ON | Entrega | 04/10 | Backlog |

User Stories criadas: `DT-36`–`DT-40` (US01–US05). Sem filhos `Implementação`. `DT-21` refina essas
issues; `DT-22` é quem decompõe a Sprint 1.

`docs/decisoes.md` existe. Serviço: saúde / atenção primária na UBS, produto Minha Vez. `DT-6` ainda
pode estar desatualizado em relação a esse arquivo.

---

## 2. O projeto em uma página

HackGov é projeto em grupo da FIAP sobre transformação digital da gestão pública: escolher um serviço público
real, diagnosticar um problema concreto percebido pela população próxima ao grupo, levantar requisitos, montar
backlog, analisar dados e propor a primeira versão conceitual de um sistema que será desenvolvido ao longo do
ano.

Capítulo em andamento: **Fase 2**, entrega na FIAP ON até **04/10/2026**. Eixo: acompanhamento. Serviço:
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

**Atribuição dos cards `DT-21` a `DT-35` pendente de reunião.** Sem responsável de propósito.

**Fatias `Implementação` ainda não existem.** Quem as cria é `DT-22`, não este passo.

**`docs/decisoes.md` ainda não existe.** A decisão do serviço vive só no comentário de `DT-6`.

---

## 5. Próximos passos, em ordem

1. Reunião para dono de `DT-21` a `DT-35`.
2. `DT-21`: refinar `DT-36`–`DT-40`. `DT-22`: decompor a Sprint 1 em filhos `Implementação`.
3. Partes 2, 3 e 4 em paralelo depois do recorte da Sprint 1; Parte 4 (`DT-29`) já pode começar.
4. PDF das partes em 24/09 (`DT-31`); slides e roteiro em 30/09 (`DT-32`, `DT-33`); vídeo e ZIP em 04/10.
5. Criar `docs/decisoes.md` e migrar a tabela da seção 3, incluindo a frente de saúde.

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
