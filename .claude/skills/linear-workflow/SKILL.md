---
name: linear-workflow
description: "Use ao criar, estruturar ou atualizar o rastreamento de trabalho do HackGov no Linear, ou ao decidir se um pedaço de trabalho merece um card. Cobre a fronteira git-versus-Linear, a estrutura Workspace, Team, Project, Milestone e Issue do HackGov, quando um card pode ser criado, o fluxo de status e a regra de isolamento do MCP em escopo local. Acione antes de tocar em qualquer issue, project, milestone ou label do Linear."
---

# Linear workflow (HackGov)

Projeto acadêmico FIAP, grupo de 5 pessoas, entregas por capítulo com prazo fixo. O Linear existe aqui para
uma coisa só: **saber quem está fazendo o quê e o que ainda falta para a entrega**. Qualquer regra que não
sirva a isso está sobrando e deve ser cortada.

## A fronteira

**git guarda o conteúdo; Linear guarda o estado de execução; o identificador liga os dois.**

O documento da entrega, os dados, os gráficos e o código vivem no repositório. Status, responsável, prazo e
discussão vivem no Linear. O identificador do card (por exemplo `DT-12`) é o único campo que aparece nos
dois lugares, e ele não carrega estado, então nunca diverge.

Nunca escreva no Linear algo que é verdade do repositório. Um requisito acordado, um critério de aceitação,
um número de uma tabela: isso mora em arquivo versionado. O card aponta para o arquivo. Não existe sincronia
automática nos dois sentidos, e isso é proposital.

Decisão nenhuma se fecha em comentário de card. Se a conversa mudar o que o grupo vai entregar, o commit
vem antes do código e antes do card.

## Quando um card pode ser criado

Só quando ele rastreia até algo que o enunciado da atividade pede ou até uma decisão que o grupo já tomou.
Cite o rastro na descrição do card, no formato "Cap 1, Parte 3" ou "decisão do grupo em `docs/decisoes.md`".
Se você não consegue nomear o rastro, o card é ruído: feche a decisão primeiro.

Dúvida em aberto não é card. Dúvida em aberto é uma linha em `docs/decisoes.md` com dono e critério de
saída, e vira card quando for respondida e sobrar trabalho.

## O que é um card aqui

Um card é **um entregável ou uma decisão fechada, com uma pessoa responsável**. Se o título precisa de um
"e", são dois cards.

Escreva como resultado, não como lista de tarefas. "Tabela de requisitos da Parte 2 preenchida e revisada"
é um card. "Mexer nos requisitos" é um projeto. "Abrir o Word" é um passo, e passo não vira card.

Todo card carrega dois campos na descrição, sempre: o **rastro** (que parte do enunciado ele atende) e o
**critério de aceitação** (o que precisa estar verdadeiro para fechar). Critério inventado na hora de criar
o card é sinal de que o enunciado não foi lido direito.

Sem estimativa, sem story point. Prioridade ordena o trabalho e não promete data: **Urgent** bloqueia outros
cards ou é pré-requisito da entrega, **High** está no caminho crítico do prazo, **sem prioridade** é o padrão
e não é vergonha nenhuma.

## Definição de pronto

Um card está Done quando o artefato existe no repositório, foi revisado por alguém que não o escreveu, e o
critério de aceitação do próprio card está satisfeito. Escrito mas não revisado continua In Progress.

Para os cards da entrega final, pronto significa que o arquivo abre corretamente depois de descompactar o
ZIP, porque é assim que o professor vai avaliar.

## Estrutura

**Workspace:** `FIAP Dream Team` (`fiap-dream-team`), autenticado por chave de API pessoal. Ver a seção de
isolamento abaixo, que é o que impede este projeto de encostar nos outros workspaces da máquina.

**Team:** `Dream Team`, prefixo **DT**, o único time do workspace. Os cards saem como `DT-5`, `DT-6` e assim
por diante. Não crie time novo por matéria nem por pessoa, o grupo tem cinco integrantes e um time só.

**Project:** `HackGov`, um só, guarda-chuva do ano inteiro. O critério de saída do capítulo em andamento
está no conteúdo do project, em termos de passa ou não passa: o ZIP com documentação em PDF, código ou link
do GitHub, slides em PDF e link do vídeo, enviado na FIAP ON até 06/09/2026 às 23h59. Datas do project:
03/08/2026 a 06/09/2026.

**Milestones:** as fases de execução dentro do project. Hoje existem duas, `Fase 1 - Direcionamento` com
alvo em 17/08/2026, que fecha qual serviço público e até onde vai o escopo, e
`Fase 2 - Levantamento e análise de requisitos` com alvo em 31/08/2026, que é a Parte 2 do enunciado. As
fases seguintes só entram quando a Fase 2 estiver perto de fechar, porque milestone criada cedo demais vira
enfeite.

**Labels:** o time tem só as três padrão do Linear (`Improvement`, `Bug`, `Feature`), que não servem para
este trabalho. Se o grupo quiser visão transversal, crie `documentacao`, `requisitos`, `dados`, `codigo`,
`apresentacao`, `video` e `decisao`. Enquanto não criar, não invente label na hora de criar card.

**Cycles:** desligados. O prazo do capítulo já é a cadência.

## Status

Os estados do time são `Backlog`, `Todo`, `In Progress`, `Done`, `Canceled` e `Duplicate`. Não existe estado
de revisão, então o card fica em `In Progress` até a revisão de quem não escreveu passar, e só aí vai para
`Done`. Se o grupo quiser um `In Review` de verdade, ele precisa ser criado no time antes de a skill falar
dele.

O status vive só no Linear. Como este repositório ainda não tem automação de GitHub ligada, quem move o card
é uma pessoa, pela MCP, e sempre com o OK do dono do card. Nada move card para In Progress sozinho.

Se e quando a automação do GitHub for ligada, a regra muda para: branch criada a partir do card, pull request
aberto move para revisão, merge na branch padrão move para Done. Não afirme que isso já funciona antes de
estar configurado.

## Responsáveis

Os cinco integrantes já são membros ativos do workspace, então atribuição funciona direto. Os nomes no
Linear não batem exatamente com os nomes completos da Parte 1, e a ligação é pelo e-mail: Jão TT é João
Pedro Thethê Andrade, Vinicius Cardoso é Vinícius Cardoso Junqueira, Brenda Araújo é Brenda Cristina
Martins Araújo, Larissa Mendes é Ana Larissa Cristo Mendes, John Silverio é John Vitor Silverio Pereira.

Card sem responsável é card que ninguém faz. A distribuição por capacidade está em `persona.md`.

**Quem decide o responsável é a reunião do grupo.** A alocação sugerida em `persona.md` só vale para tarefa
que a reunião não distribuiu explicitamente, e serve para nada ficar sem dono por omissão. Não atribua card
a ninguém por conta própria quando existir decisão de reunião em contrário, e não atribua sem o OK do dono
do quadro: nome no assignee é lido pelos outros quatro integrantes como decidido.

## Isolamento do MCP

O MCP do Linear é um servidor de **escopo local** do Claude Code, configurado dentro do diretório do
HackGov e autenticado por chave de API pessoal do workspace da FIAP. Nunca um conector de conta, nunca um
conector do Claude.ai. Escopo local é indexado pelo **diretório do projeto**, e é exatamente isso que impede
duas contas Linear na mesma máquina de se misturarem: a chave da FIAP só é autenticada aqui, e os
workspaces do Vale Verde e do mapsift continuam intocados.

**Não use o escopo user.** Existe bug conhecido que amarra o escopo user a caminhos de projeto, e um projeto
filho consegue zerar a configuração do pai.

Duas armadilhas que já custaram tempo. O header precisa do esquema `Bearer ` na frente da chave, senão o
Linear responde 401 com uma mensagem que parece chave inválida. E `claude mcp get` **imprime a chave em
texto puro** no transcript, enquanto `claude mcp list` não imprime.

O comando de configuração, rodado com o terminal dentro de `~/Documents/projects/HackGov`:

```fish
claude mcp add --transport http linear https://mcp.linear.app/mcp \
  --scope local \
  --header "Authorization: Bearer lin_api_SUA_CHAVE_AQUI"
```

A verificação de que o escopo pegou é `list_teams` a partir deste diretório: ele tem que devolver o time
HackGov e nada de mapsift nem de Vale Verde. Se aparecer time de outro workspace, a chave está errada ou o
comando foi rodado no diretório errado.

## O que o Claude Code faz e o que não faz aqui

Ler o card e o rastro dele, escrever comentário de progresso e mover estado pela MCP é o escopo inteiro.
Não crie card sem o dono aprovar a lista antes, porque identificador criado já entra em circulação e
renomear depois bagunça a referência de todo mundo.
