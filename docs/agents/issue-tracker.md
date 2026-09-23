# Issue tracker: Linear (HackGov)

Issues e specs deste repo vivem no **Linear**, workspace `FIAP Dream Team`, time `Dream Team`
(prefixo `DT`), project `HackGov`. Operações passam pelo MCP do Linear (`user-linear`), nunca por
`gh issue` como caminho principal.

## Precedência obrigatória

A skill **`linear-workflow`** (`.claude/skills/linear-workflow/SKILL.md`) manda em tudo que toca card,
milestone, label, status, assignee ou isolamento de workspace.

Skills do Matt Pocock (`to-tickets`, `to-spec`, `triage`, `wayfinder`, `implement`, etc.) **leem e
comentam** no Linear através deste arquivo, mas **não criam card sem o dono aprovar a lista antes**.
Identificador criado já entra em circulação.

Quando houver conflito entre uma skill do Matt e o `linear-workflow`, o `linear-workflow` vence.

## Convenções

- **Idioma.** Título, descrição e comentário em português do Brasil.
- **Criar issue:** propor a lista ao dono (título, rastro do enunciado, critério de aceitação,
  milestone, prioridade). Só chamar `save_issue` depois do OK explícito.
- **Ler issue:** `get_issue` / `list_issues` via MCP.
- **Comentar:** `save_comment`. Progresso e discussão; decisão fechada vai para `docs/decisoes.md`
  (ou artefato versionado), não fica só no card.
- **Status / assignee:** só com OK do dono do card; estados do time são `Backlog`, `Todo`,
  `In Progress`, `Done`, `Canceled`, `Duplicate`.
- **Labels:** use as três do projeto: `Entrega acadêmica`, `User Story`, `Implementação`. Não invente
  nem crie label na hora. As padrão (`Feature`, `Bug`, `Improvement`) não se aplicam a este trabalho.
- **Bloqueio:** use relações nativas do Linear (`blockedBy` / blocks) quando existirem no MCP;
  senão declare no corpo do card.
- **Conteúdo vs estado:** git guarda o artefato; Linear guarda execução. O identificador (`DT-N`)
  é a ponte. Não duplique requisito, critério ou dado de tabela no card.

## Pull requests como superfície de triage

**PRs as a request surface: no.** Este projeto não trata PR externo como fila de feature request.

## Quando uma skill diz "publish to the issue tracker"

Não publique direto. Monte a proposta de cards, mostre ao usuário, espere aprovação, e só então
crie via MCP respeitando `linear-workflow`.

## Quando uma skill diz "fetch the relevant ticket"

Use `get_issue` com o identificador `DT-N` (ou o UUID interno que o MCP devolver).

## Wayfinding

`/wayfinder` pode usar o Linear como mapa, mas cada ticket filho ainda passa pela regra de aprovação
antes de existir. Prefira um card-mapa na milestone da fase em andamento, com filhos bloqueados
explicitamente, em vez de criar dezenas de issues de uma vez.
