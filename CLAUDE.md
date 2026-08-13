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

O capítulo em andamento é **Cap 1 - Contextualizando o HackGov**, aberto em 03/08/2026, com entrega até
**06/09/2026 às 23h59** na plataforma FIAP ON. Entrega atrasada em até três dias recebe no máximo 70% da
nota, calculado automaticamente pelo sistema, sem margem de negociação com o professor.

## Estado atual, e o bloqueio que importa

O grupo votou e **o eixo do produto está fechado: acompanhamento**. O cidadão precisa saber em que pé está a
solicitação dele sem depender de ligar, ir presencialmente ou conhecer alguém dentro do órgão.

**O serviço público onde esse acompanhamento acontece ainda não foi escolhido**, e as duas frentes na mesa
são saúde (filas, vaga, acompanhamento, atendimento) e infraestrutura urbana (ticket, análise, atendimento
primário). Essa decisão trava as Partes 2, 3, 4 e 5 inteiras. Não produza conteúdo dessas partes assumindo
uma frente por conta própria. Se a frente for necessária para avançar, pare e pergunte.

A decisão está sendo tratada na Fase 1, nos cards `DT-5` (evidência), `DT-6` (decisão) e `DT-7` (escopo), e
é direcionamento apenas. Detalhamento de requisito é Fase 2.

## Grupo 1

| Integrante | E-mail | RM |
| --- | --- | --- |
| Vinícius Cardoso Junqueira | vinikrdoso@gmail.com | a preencher |
| Brenda Cristina Martins Araújo | brendacristina3624@gmail.com | a preencher |
| Ana Larissa Cristo Mendes | mendes.larissa13@gmail.com | a preencher |
| João Pedro Thethê Andrade | Jaoshtt@gmail.com | a preencher |
| John Vitor Silverio Pereira | john.silverio63@gmail.com | a preencher |

Os RMs são obrigatórios na Parte 1 e no cadastro do grupo na plataforma. Enquanto estiverem em branco, a
Parte 1 não está pronta, por mais que o resto avance.

A distribuição de responsabilidades por capacidade está em `persona.md`.

## O que o Cap 1 exige, em termos de passa ou não passa

A entrega é um único arquivo `.ZIP`, com todos os arquivos dentro de uma mesma pasta, que precisa funcionar
ao ser descompactado e aberto localmente. Dentro dele:

1. Documentação do projeto em PDF, cobrindo as Partes 1 a 5.
2. Códigos do projeto, ou o link do repositório no GitHub com acesso liberado.
3. Apresentação de slides em PDF.
4. Link do vídeo de até 5 minutos, publicado como não listado no YouTube, com demonstração do que foi
   implementado rodando. O link precisa aparecer tanto no documento quanto nos slides.

Uma única submissão em nome do grupo, feita por quem cadastrou o grupo na plataforma.

As cinco partes do enunciado, resumidas para consulta rápida: Parte 1 dados do grupo com nome completo e RM;
Parte 2 escolha do serviço público mais 5 requisitos funcionais e 2 não funcionais em tabela com descrição,
tipo e prioridade, mais a análise de impacto social, operacional e institucional da ausência de um requisito
escolhido; Parte 3 os cinco requisitos funcionais virados em user stories no formato "Como [usuário], quero
[objetivo], para que [benefício]", cada uma com critérios de aceitação e priorizadas por uma matriz de
priorização estudada em aula; Parte 4 conjunto de dados do serviço escolhido organizado em tabela de
frequência, com gráfico de barras e gráfico de setores, mais a leitura dos padrões, gargalos e a decisão
estratégica de gestão que os dados sustentam; Parte 5 um parágrafo sobre o problema público atacado, como o
sistema melhora produtividade, transparência e custo, mais dois riscos de implementação com mitigação.

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
slides/        apresentação
src/           protótipo, quando existir
entrega/       o ZIP montado, com tudo dentro de uma pasta só
```

## O que não fazer

Não escolher o serviço público sozinho. Não inventar RM, nome ou dado de pesquisa. Não criar card no Linear
antes do dono aprovar a lista, porque identificador criado já entra em circulação. Não afirmar que existe
automação de status pelo GitHub, porque ela não está configurada neste repositório.
