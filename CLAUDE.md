# CLAUDE.md

Orientação para o Claude Code trabalhar neste repositório.

**Leia `handoff.md` antes de agir.** Ele carrega o estado vivo do projeto, o que já foi decidido, o que está
bloqueado, os próximos passos em ordem e as armadilhas de ambiente que já custaram tempo. Este arquivo diz as
regras; o handoff diz onde o trabalho parou. Ao fechar uma sessão que mudou o estado, atualize a seção 1 do
handoff.

Este repositório ainda não tem código. Ele nasceu para uma atividade acadêmica da FIAP e hoje contém
documentação, decisões e configuração de rastreamento. Não descreva aqui uma arquitetura que não existe:
quando o código aparecer, esta seção muda junto.

## O que é o projeto

HackGov é um projeto em grupo da FIAP sobre transformação digital da gestão pública. A proposta é escolher
um serviço público real, diagnosticar um problema concreto percebido pela população próxima ao grupo,
levantar requisitos, montar backlog, analisar dados e propor a primeira versão conceitual de um sistema que
será desenvolvido ao longo do ano.

O capítulo em andamento é a **Fase 2** (diagramas UML, classes, Sprint 1 e prototipação). A Fase 1 (Cap 1)
foi entregue. Prazo na FIAP ON: **04/10/2026**. Alvos internos: Partes 1 a 4 até **24/09**; roteiro até
**30/09**; gravação, ZIP e upload até **04/10**.

## Estado atual

O eixo do produto é **acompanhamento**. O serviço é **saúde / medicina primária** (filas da atenção
primária). Os cards acadêmicos da Fase 2 são `DT-21` a `DT-35`. As User Stories do product backlog são `DT-36` a
`DT-40` (US01–US05), em Backlog, sem milestone de Parte. Fatias `Implementação` ainda não existem: quem
fecha `DT-22` as cria, seguindo `docs/como-criar-user-stories-no-linear.md`.

Não invente User Story, requisito ou dado. Não crie filhos `Implementação` no lugar de `DT-22`.

## Grupo 1

| Integrante | E-mail | RM |
| --- | --- | --- |
| Vinícius Cardoso Junqueira | vinikrdoso@gmail.com | a preencher |
| Brenda Cristina Martins Araújo | brendacristina3624@gmail.com | a preencher |
| Ana Larissa Cristo Mendes | mendes.larissa13@gmail.com | a preencher |
| João Pedro Thethê Andrade | Jaoshtt@gmail.com | a preencher |
| John Vitor Silverio Pereira | john.silverio63@gmail.com | a preencher |

Os RMs ainda constam em branco nesta tabela. Conferir no cadastro da plataforma antes do ZIP (`DT-35`). Não
bloqueia a Parte 1 da Fase 2.

A distribuição de responsabilidades por capacidade está em `persona.md`.

## O que a Fase 2 exige, em termos de passa ou não passa

A entrega é um único arquivo `.ZIP`, com todos os arquivos dentro de uma mesma pasta, que precisa funcionar
ao ser descompactado e aberto localmente. Dentro dele:

1. Documentação do projeto em PDF, cobrindo as Partes 1 a 4.
2. Códigos do projeto, ou o link do repositório no GitHub com acesso liberado.
3. Apresentação de slides em PDF.
4. Link do vídeo de até 5 minutos, publicado como não listado no YouTube, com demonstração do Java rodando.
 O link precisa aparecer tanto no documento quanto nos slides.

Uma única submissão em nome do grupo, feita por quem cadastrou o grupo na plataforma.

As quatro partes, resumidas: Parte 1 backlog refinado, Sprint Backlog da Sprint 1 e métricas ágeis; Parte 2
quatro diagramas UML, reflexão técnica e início em Java; Parte 3 protótipo da jornada essencial e critérios
de validação; Parte 4 medidas de dispersão e pergunta probabilística sobre o dataset.

## Regras de trabalho

**Idioma.** Documento, card e comentário em português do Brasil, porque é o que o professor lê e o que os
outros quatro integrantes leem. Identificadores de código e comentários de código em inglês.

**Dados da Parte 4.** O enunciado permite pesquisar ou criar o conjunto de dados. Se o dado for inventado,
ele é rotulado como sintético na própria tabela e no documento, com a premissa que gerou os números escrita
ao lado. Dado fabricado apresentado como real é o tipo de coisa que destrói a nota inteira quando alguém
pergunta a fonte. Se o dado for real, a fonte vai citada com órgão, ano e link.

**Decisões.** O que o grupo fechar vai para `docs/decisoes.md`, uma linha por decisão, com data e quem
decidiu. Dúvida em aberto entra no mesmo arquivo com dono e critério de saída, e sai de lá quando virar
decisão ou card.

**Rastreamento.** O trabalho é acompanhado no Linear, workspace `FIAP Dream Team`, time `Dream Team`
(prefixo `DT`), via MCP em escopo local. As regras de estrutura, criação de card e isolamento estão na skill
`linear-workflow`, em `.claude/skills/linear-workflow/SKILL.md`. Leia antes de tocar em qualquer coisa no
Linear.

**Isolamento de credencial.** A chave de API do Linear deste projeto é do workspace próprio da FIAP e vive
apenas na configuração de escopo local do Claude Code, indexada por este diretório. Ela nunca entra em
arquivo versionado. Os workspaces de outros projetos da máquina não são tocados por nada feito aqui.

## Layout previsto

Nada disso existe ainda, e cada pasta só deve ser criada quando tiver conteúdo real para receber:

```
docs/          documentação das partes 1 a 5, decisões, dados e gráficos
docs/agents/   config das skills do Matt Pocock (tracker, triage, domínio)
slides/        apresentação
src/           protótipo, quando existir
entrega/       o ZIP montado, com tudo dentro de uma pasta só
```

## Agent skills

Skills do Matt Pocock estão instaladas em `.agents/skills/` e espelhadas em `.claude/skills/`
(via `skills.sh`, lock em `skills-lock.json`). A skill local `linear-workflow` continua ao lado delas
e **não foi substituída**.

### Issue tracker

Linear (workspace FIAP Dream Team, time Dream Team, prefixo DT). Ver `docs/agents/issue-tracker.md`.
Qualquer skill que publique ticket passa pela regra de aprovação do `linear-workflow`.

### Triage labels

Vocabulário canônico do Matt mapeado. No Linear do HackGov as labels do projeto são `Entrega acadêmica`,
`User Story` e `Implementação`. Não crie outras automaticamente. Ver `docs/agents/triage-labels.md`.

### Domain docs

Layout single-context (`CONTEXT.md` + `docs/adr/` quando existirem). Ver `docs/agents/domain.md`.

## O que não fazer

Não inventar RM, nome ou dado de pesquisa. Não criar card no Linear antes do dono aprovar a lista, porque
identificador criado já entra em circulação. Não criar User Story ou `Implementação` no lugar de `DT-21` /
`DT-22`. Não afirmar que existe automação de status pelo GitHub. Não deixar skill do Matt criar label ou
card no Linear sem passar pelo `linear-workflow`.
