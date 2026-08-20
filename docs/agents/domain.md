# Domain Docs

Como as skills de engenharia devem consumir a documentação de domínio deste repo.

## Before exploring, read these

- **`CONTEXT.md`** na raiz, se existir.
- **`CLAUDE.md`** e **`handoff.md`**: contrato e estado vivo do HackGov (sempre).
- **`docs/decisoes.md`**: decisões fechadas e dúvidas com dono (quando existir).
- **`docs/adr/`**: ADRs que tocarem a área em que se vai trabalhar.
- **`persona.md`**: capacidade e alocação do grupo.

Se `CONTEXT.md` ou `docs/adr/` ainda não existirem, **siga em silêncio**. Não sugira criá-los só
por checklist. `/domain-modeling` (via `/grill-with-docs`) cria sob demanda quando termo ou decisão
realmente se resolve.

## File structure

Single-context (este repo):

```
/
├── CONTEXT.md          ← quando o domínio do produto existir de fato
├── CLAUDE.md
├── handoff.md
├── docs/
│   ├── decisoes.md
│   ├── agents/         ← config das skills do Matt
│   └── adr/
└── src/                ← quando o protótipo existir
```

## Use the glossary's vocabulary

Quando a saída nomear conceito de domínio, use o termo de `CONTEXT.md` (ou, até ele existir, o
vocabulário já fechado em `CLAUDE.md` / `docs/decisoes.md`: eixo **acompanhamento**, frentes
candidatas saúde vs infraestrutura urbana, etc.).

## Flag ADR conflicts

Se a saída contradisser um ADR existente, declare explicitamente em vez de sobrescrever em silêncio.
