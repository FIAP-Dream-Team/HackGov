# Personas e distribuição de trabalho

Este documento responde uma pergunta só: **quem é dono de qual entregável, e por quê**. Dono não é quem faz
sozinho, é quem responde se a coisa não estiver pronta na data.

O grupo trabalha com todo mundo ajudando todo mundo, e às vezes em dupla. Isso funciona, e a distribuição
abaixo não muda esse hábito. O que ela faz é colocar peso onde a qualidade da entrega depende de proficiência
real, para que a ajuda mútua não vire cinco pessoas revisando a mesma frase enquanto a Parte 4 não sai.

Um capítulo com cinco pessoas e nenhum dono nomeado termina sempre igual: alguém faz 80% na véspera e o grupo
descobre na hora do upload que faltava o link do vídeo no documento.

## Quem é quem

Os nomes no Linear não batem com os nomes completos da Parte 1. A ligação é pelo e-mail.

**John Vitor Silverio Pereira** (Linear: John Silverio). Programador fullstack, Python com Django no backend
e Angular no frontend. Fora do código, faz design, edição de vídeo e narração, e normalmente é quem grava e
narra junto com a equipe. Monta slides e peças visuais para o grupo. É quem mantém a infraestrutura deste
repositório e do quadro no Linear.

**Vinícius Cardoso Junqueira** (Linear: Vinicius Cardoso). Frontend sênior, com design e Figma, e a parte
visual em geral. Um dos mais velhos do grupo. Divide tarefas visuais com o John com frequência, e ajuda
bastante na criação de documentos.

**Ana Larissa Cristo Mendes** (Linear: Larissa Mendes). Frontend pleno, no mesmo terreno técnico do Vinícius,
sem proficiência em Figma ainda. Uma das mais velhas do grupo. Contribui muito em ideias e na criação de
documentos, e é quem costuma escrever ou revisar os roteiros dos vídeos com o John.

**João Pedro Thethê Andrade** (Linear: Jão TT). Ainda não é desenvolvedor e é o pau para toda obra do grupo:
documentação, entrega das atividades, junção do material, e roteiro de vídeo quando a Larissa não pega. Quer
ajudar sempre, o que é matéria-prima boa desde que venha com dono e prazo.

**Brenda Cristina Martins Araújo** (Linear: Brenda Araújo). Nova no grupo. Conhece bastante de
infraestrutura e quer seguir como analista de dados.

> A infraestrutura que a Brenda domina é **infraestrutura de TI**, não infraestrutura urbana. Não entregue a
> ela a pesquisa da frente de infraestrutura urbana por causa da palavra.

## Matriz de capacidade

**●** faz sozinho e consegue revisar o dos outros. **○** participa com apoio. **Célula vazia** significa
ainda não mapeado, não significa que a pessoa não sabe. As linhas foram escritas a partir do que cada um
declarou; quem quiser corrigir a própria linha corrige.

| Integrante | Documentação | Requisitos e ideias | Backlog e user story | Dados e estatística | Programação | Design e Figma | Roteiro de vídeo | Narração e edição | Organização e entrega |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| John Silverio | ● | ● | ● |  | ● fullstack | ● | ● | ● | ● |
| Vinícius Cardoso | ● | ● |  |  | ● frontend | ● | ○ | ○ | ● |
| Larissa Mendes | ● | ● |  |  | ● frontend | ○ | ● |  | ○ |
| João Pedro | ● | ○ |  |  | ainda não |  | ● |  | ● |
| Brenda Araújo |  |  |  | ○, é onde ela quer chegar | ● infra de TI |  |  |  |  |

## Alocação do Cap 1

**Esta tabela é proposta, não decisão.** O que o grupo decidir explicitamente em reunião vence a tabela,
sempre. A alocação sugerida aqui só se aplica a tarefa que a reunião não distribuiu, para que nada fique
sem dono por omissão. Quando a reunião decidir diferente, a linha correspondente é corrigida aqui.

| Entregável | Dono | Dupla | Revisor |
| --- | --- | --- | --- |
| `DT-5` Evidência do problema nas duas frentes | Larissa | João | Vinícius |
| `DT-5` Disponibilidade de dado público para a Parte 4 | Brenda | — | John |
| `DT-6` Decisão do serviço público e registro | Larissa | grupo vota | — |
| `DT-7` Escopo e anti-escopo do acompanhamento | Vinícius | Larissa | John |
| Parte 1, RM de cada integrante | cada um o seu | — | João consolida |
| Parte 2, requisitos e análise de impacto | Larissa | Vinícius | John |
| Parte 3, user stories e matriz de priorização | João | Larissa | Vinícius |
| Parte 4, dataset, tabela de frequência e gráficos | Brenda | John nos gráficos | Larissa |
| Parte 4, leitura dos gargalos e decisão de gestão | Brenda | Larissa | Vinícius |
| Parte 5, reflexão, riscos e mitigações | Vinícius | Brenda nos riscos técnicos | Larissa |
| Protótipo, backend e estrutura | John | — | Vinícius |
| Protótipo, frontend | Vinícius | Larissa | John |
| Slides em PDF | Vinícius | John | João |
| Roteiro do vídeo | João | Larissa | John |
| Gravação, narração e edição do vídeo | John | Vinícius | Larissa |
| ZIP, conferência e upload na FIAP ON | João | John | todos |

O raciocínio por trás das escolhas menos óbvias. A Larissa carrega evidência, decisão e Parte 2 porque é uma
linha de raciocínio só, e picotar isso entre três pessoas gera tradução perdida no meio. A Parte 3 sai da mão
dela e vai para o João justamente para quebrar esse acúmulo, e user story com critério de aceitação é
documentação estruturada, que é exatamente o terreno dele. A Brenda pega a Parte 4 inteira porque é o lugar
onde ela quer chegar profissionalmente e o trabalho oferece isso de graça. O Vinícius fica com o escopo, o
frontend do protótipo, os slides e a Parte 5, misturando visual com escrita, que é o par de habilidades que
ele declarou. O John fica com backend e vídeo, e sai da linha de frente dos documentos de propósito.

## Três riscos desta alocação

**O John vira gargalo.** Ele concentra o backend do protótipo, a gravação, a narração, a edição e ainda é
quem mantém repositório e quadro. Se ele sumir uma semana, três frentes param juntas. Mitigação: o Vinícius
é o backup declarado do protótipo e do visual, e o roteiro precisa estar fechado bem antes da semana da
entrega, porque edição de vídeo em cima do prazo é onde o trabalho todo trava.

**A Brenda é nova e está com a parte mais dependente de sorte.** A Parte 4 só existe se houver dado. A
mitigação já está montada: o item de disponibilidade de dado do `DT-5` é dela, então ela descobre se o dado
existe **antes** de o grupo cravar o tema, e não depois.

**Ninguém está sobrando, o que significa que uma falta pesa.** Se alguém não puder entregar, o realocamento
tem que acontecer na hora, não na véspera. Quem travar avisa antes de travar.

## Regras que valem para todo mundo

Cada linha da tabela de alocação vira um card no Linear com dono, milestone e critério de aceitação. Card sem
responsável é card que ninguém faz.

Revisão é obrigatória e feita por quem não escreveu, e é por isso que a coluna de revisor existe. Metade dos
pontos perdidos em trabalho de grupo vem de inconsistência entre partes que ninguém leu junto.

Dupla é para tarefa complicada, não para tudo. Duas pessoas em uma tarefa simples é uma pessoa a menos em
outra que está parada.

O upload é feito por quem cadastrou o grupo, uma vez só. Conferir nome e RM de todo mundo na plataforma antes
de enviar, porque cadastro errado tira nota de quem fez o trabalho.
