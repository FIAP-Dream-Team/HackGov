# HackGov

Projeto em grupo da FIAP sobre transformação digital da gestão pública. A proposta é escolher um serviço
público real, diagnosticar um problema concreto percebido pela população próxima ao grupo, levantar
requisitos, montar backlog, analisar dados e propor a primeira versão conceitual de um sistema que será
desenvolvido ao longo do ano.

O pano de fundo é conhecido de quem já precisou de qualquer coisa da prefeitura: serviços que funcionam de
forma fragmentada, sistemas isolados, pouco uso de dado e quase nenhuma integração entre órgãos. O resultado
são filas, retrabalho, cidadão sem informação, servidor sobrecarregado e gestor sem saber se a política
pública está funcionando.

## Direção do produto

O grupo votou e o eixo está fechado: **acompanhamento**. O cidadão precisa saber em que pé está a
solicitação dele sem depender de ligar, ir presencialmente ou conhecer alguém dentro do órgão.

O serviço público onde esse acompanhamento acontece ainda está em decisão, entre duas frentes:

| Frente | Recorte discutido |
| --- | --- |
| Saúde | filas, vaga, acompanhamento, atendimento |
| Infraestrutura urbana | abertura de ticket, análise, atendimento primário |

Essa decisão é o bloqueio que importa hoje, porque requisito, user story, dataset e reflexão final derivam
toda dela. Ela está sendo tratada na Fase 1, nos cards `DT-5`, `DT-6` e `DT-7`, e é direcionamento apenas: o
detalhamento acontece na Fase 2, que é a análise de requisitos.

## Capítulo em andamento

**Cap 1 - Contextualizando o HackGov**, aberto em 03/08/2026, entrega até **06/09/2026 às 23h59** na
plataforma FIAP ON. Entrega atrasada em até três dias recebe no máximo 70% da nota, calculado
automaticamente pelo sistema, sem margem de negociação com o professor.

## O que precisa ser entregue

Um único arquivo `.ZIP`, com todos os arquivos dentro de uma mesma pasta, que precisa funcionar ao ser
descompactado e aberto localmente. Dentro dele:

1. Documentação do projeto em PDF, cobrindo as Partes 1 a 5.
2. Códigos do projeto, ou o link do repositório no GitHub com acesso liberado.
3. Apresentação de slides em PDF.
4. Link do vídeo de até 5 minutos, publicado como não listado no YouTube, com demonstração do que foi
   implementado rodando. O link precisa aparecer tanto no documento quanto nos slides.

Submissão única em nome do grupo, feita por quem cadastrou o grupo na plataforma. Conferir o cadastro de
alunos e RMs antes de enviar.

## As cinco partes do enunciado

**Parte 1, dados do grupo.** Nome completo e RM de cada integrante.

**Parte 2, levantamento de requisitos.** Escolher o serviço público atendido pelo HackGov, descrever cinco
requisitos funcionais e dois não funcionais, organizar tudo em uma tabela com descrição, tipo e prioridade,
e escolher um requisito para explicar qual seria o impacto social, operacional e institucional caso ele não
fosse implementado.

**Parte 3, product backlog.** Transformar os cinco requisitos funcionais em user stories no formato
"Como [tipo de usuário], quero [objetivo], para que [benefício]", cada uma com critérios de aceitação, e
priorizar as histórias usando uma matriz de priorização estudada em aula.

**Parte 4, estatística descritiva.** Pesquisar ou criar um conjunto de dados do serviço escolhido, organizar
em tabela de frequência, gerar um gráfico de barras e um de setores, e responder duas perguntas: quais
padrões, comportamentos ou gargalos aparecem, e que decisão estratégica de gestão pública os dados
sustentam. Esses números viram os primeiros indicadores de desempenho e serão reaproveitados em dashboards
mais adiante.

**Parte 5, reflexão sobre transformação digital.** Um parágrafo explicando qual problema público real o
HackGov ataca, como o sistema melhora produtividade, aumenta transparência e reduz custo, mais dois riscos
de implementação com as respectivas mitigações.

## Grupo 1

| Integrante | E-mail | RM |
| --- | --- | --- |
| Vinícius Cardoso Junqueira | vinikrdoso@gmail.com | a preencher |
| Brenda Cristina Martins Araújo | brendacristina3624@gmail.com | a preencher |
| Ana Larissa Cristo Mendes | mendes.larissa13@gmail.com | a preencher |
| João Pedro Thethê Andrade | Jaoshtt@gmail.com | a preencher |
| John Vitor Silverio Pereira | john.silverio63@gmail.com | a preencher |

Os RMs são obrigatórios na Parte 1 e no cadastro do grupo na plataforma. Enquanto estiverem em branco, a
Parte 1 não está pronta.

A distribuição de responsabilidades por capacidade está em [`persona.md`](persona.md).

## Como o trabalho é acompanhado

O quadro fica no Linear, workspace `FIAP Dream Team`, time `Dream Team` (prefixo `DT`), project `HackGov`.
As fases são milestones dentro do project:

- **Fase 1 - Direcionamento**, alvo 17/08/2026. Fecha qual serviço público e até onde vai o escopo.
- **Fase 2 - Levantamento e análise de requisitos**, alvo 31/08/2026. É a Parte 2 do enunciado.

Card é entregável com dono e critério de aceitação, nunca lista de tarefas. Documento, dado e código vivem
neste repositório; o Linear guarda apenas estado de execução. O identificador do card, `DT-6` por exemplo, é
o único campo que aparece nos dois lados.

Decisão fechada vira uma linha em `docs/decisoes.md`, com data e quem decidiu. Decisão não se fecha em
comentário de card.

## Regras de trabalho

**Idioma.** Documento, card e comentário em português. Identificadores e comentários de código em inglês.

**Dados da Parte 4.** O enunciado permite pesquisar ou criar o conjunto de dados. Dado inventado é rotulado
como sintético na própria tabela e no documento, com a premissa que gerou os números escrita ao lado. Dado
real vai com a fonte citada: órgão, ano e link. Dado fabricado apresentado como real derruba a nota inteira
no momento em que alguém pergunta de onde veio.

**Revisão.** Todo entregável é revisado por alguém que não o escreveu, antes de ir para Done.

## Estrutura do repositório

Cada pasta só é criada quando tiver conteúdo real:

```
docs/          documentação das partes 1 a 5, decisões, dados e gráficos
slides/        apresentação
src/           protótipo, quando existir
entrega/       o ZIP montado, com tudo dentro de uma pasta só
```
