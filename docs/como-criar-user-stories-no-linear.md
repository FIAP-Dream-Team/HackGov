# Como criar User Stories e o Sprint Backlog no Linear

Este texto é o passo a passo da Parte 1 da Fase 2. Os cards acadêmicos `DT-21` (refinar) e `DT-22` (Sprint Backlog) apontam para cá. Eles acompanham o PDF. As issues que você criar aqui são o **produto**.

No board existem três labels. Não misture.

| Label | O que é | Milestone de Parte? |
| --- | --- | --- |
| `Entrega acadêmica` | Tarefa do enunciado (`DT-21`, `DT-22`, etc.) | Sim |
| `User Story` | Item do product backlog | **Não** |
| `Implementação` | Tarefa da Sprint 1, filha de uma User Story | **Não** |

Sprint 1 = as User Stories que tiverem filhos `Implementação`. O restante fica em Backlog, sem filho.

---

## 1. Criar uma User Story (`DT-21`)

No Linear, project **HackGov**:

1. **New issue**.
2. Team: `Dream Team`. Project: `HackGov`.
3. Label: só `User Story`. Não marque `Entrega acadêmica`.
4. Milestone: **deixe vazio**. Story não é entrega do capítulo.
5. Status: `Backlog`.
6. Assignee: vazio por enquanto, a menos que a reunião já tenha dono.
7. Estimate: vazio. Estimativa vai na tarefa filha.

**Título**, um por story, neste formato:

`Como [ator], quero [objetivo], para que [benefício]`

Exemplos de ator neste projeto: cidadão, atendente, gestor. Não invente ator que o recorte da Fase 1 não tenha.

**Descrição**, nesta ordem:

```markdown
**O que entra**
- …

**O que não entra**
- …

**Critérios de aceitação**
- [ ] condição objetiva 1
- [ ] condição objetiva 2

**Regras e exceções**
- Dados obrigatórios: …
- Validações: …
- Etapas / exceções do atendimento: …
```

Critério de aceitação é condição que dá para marcar sim ou não. Adjetivo (“fácil”, “rápido”, “intuitivo”) sem medida não fecha.

Repita até existir **uma issue por user story prioritária**. O mesmo texto vai para `docs/`, porque o professor lê o PDF, não o Linear.

Para achar essas issues depois: no project HackGov, filtre pela label `User Story`.

---

## 2. Montar o Sprint Backlog (`DT-22`)

Só depois das User Stories existirem.

1. Decidir a capacidade do grupo (horas ou pontos, o que o grupo fechar) e anotar em `docs/`.
2. Escolher quais User Stories cabem na Sprint 1. As outras continuam em `Backlog`, sem filho.
3. Abrir cada User Story escolhida → **Add sub-issue** (issue filha).
4. Cada filha:
   - Label: só `Implementação`.
   - Milestone: vazio.
   - Título de resultado, não de passo. Ex.: `Modelo da classe Solicitacao com validações essenciais`.
   - Estimate: preenchido.
   - Assignee: quem vai fazer.
5. Exemplos de decomposição (o enunciado pede rastreabilidade story → tarefa): modelagem, classes, validações, fluxos, testes, documentação.

O card `DT-22` fecha quando isso está visível no Linear **e** copiado em `docs/` (itens, tarefas, estimativas, responsáveis, capacidade). Não cole a lista de tarefas no `DT-22`.

Para ver só a Sprint 1: filtre label `Implementação`, ou abra a User Story e olhe os filhos.

---

## O que não fazer

- Não crie User Story com milestone `Fase 2 - Parte 1`. Isso mistura produto com entrega.
- Não use o `DT-21` como se fosse a story. Ele só rastreia se a aluna terminou a Parte 1.
- Não estime a User Story pai se o grupo combinou estimar só a tarefa.
- Não crie tarefa órfã (label `Implementação` sem pai). Sem pai some a rastreabilidade que o professor pede.
