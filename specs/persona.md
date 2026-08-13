# Personas e distribuição de trabalho

Este documento existe para responder uma pergunta só: **quem é dono de qual entregável, e por quê**. Dono
não é quem faz tudo sozinho, é quem responde se a coisa não estiver pronta na data. Cada entregável do
Cap 1 tem exatamente um dono e um revisor, e revisor nunca é a mesma pessoa que escreveu.

Um capítulo com cinco pessoas e nenhum dono nomeado termina sempre do mesmo jeito: uma pessoa faz 80% na
véspera e o grupo descobre na hora do upload que faltava o link do vídeo no documento.

## Como preencher

Cada integrante preenche a própria linha da matriz de capacidade, honestamente. Nota 0 significa nunca
mexi, 1 significa já vi e me viro com ajuda, 2 significa faço sozinho e consigo revisar o dos outros.
Autoavaliação inflada aqui não impressiona ninguém e custa caro na semana da entrega.

Depois de preenchida a matriz, a alocação da última seção é ajustada para bater com ela.

## Matriz de capacidade

| Integrante | Escrita técnica e documentação | Requisitos e regra de negócio | Scrum, backlog e user story | Estatística e gráficos | Programação | Design de slides | Edição de vídeo e apresentação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vinícius Cardoso Junqueira | ? | ? | ? | ? | ? | ? | ? |
| Brenda Cristina Martins Araújo | ? | ? | ? | ? | ? | ? | ? |
| Ana Larissa Cristo Mendes | ? | ? | ? | ? | ? | ? | ? |
| João Pedro Thethê Andrade | ? | ? | ? | ? | ? | ? | ? |
| John Vitor Silverio Pereira | 2 | 2 | 2 | 1 | 2 | 1 | ? |

A linha do John está preenchida porque o histórico é conhecido: trabalha com Django, Angular, PostgreSQL e
PostGIS, e mantém a infraestrutura deste repositório. As outras quatro linhas são de quem as escreve.

## Os cinco papéis do Cap 1

O enunciado desenha naturalmente cinco frentes, o que cai bem em um grupo de cinco. Um papel por pessoa, e
todo mundo revisa a frente de alguém.

**Product Owner do serviço público.** Dono da escolha do serviço, do diagnóstico do problema real e da
Parte 2 inteira. É quem vai atrás de gente que usa o serviço, de notícia local, de dado de ouvidoria, e
volta com um problema concreto em vez de uma abstração. Também é quem escreve a análise de impacto da
ausência de um requisito, que é a pergunta da Parte 2 que mais separa trabalho pensado de trabalho copiado.
Perfil: quem conversa com gente sem travar e escreve com clareza.

**Scrum Master e backlog.** Dono da Parte 3. Converte os requisitos funcionais em user stories no formato
exigido, escreve critério de aceitação que dá para verificar, e aplica a matriz de priorização vista em
aula, com a justificativa de por que cada história caiu naquele quadrante. Também é quem mantém o quadro do
Linear vivo durante o mês, cobrando movimentação de card. Perfil: organizado e chato na medida certa.

**Analista de dados.** Dono da Parte 4. Encontra ou constrói o conjunto de dados, monta a tabela de
frequência, gera o gráfico de barras e o de setores, e escreve a leitura: qual padrão aparece, onde está o
gargalo, e que decisão de gestão pública os números sustentam. A parte difícil não é o gráfico, é a
conclusão que não seja óbvia. Perfil: quem não tem medo de planilha e sabe defender um número.

**Desenvolvedor e prototipagem.** Dono do que roda. Monta o repositório, o protótipo demonstrável e a
estrutura de entrega. O vídeo precisa mostrar o sistema rodando até onde o grupo conseguiu implementar, e
essa frase do enunciado é o que transforma esse papel em caminho crítico. Perfil: quem programa de verdade.

**Comunicação e entrega.** Dono da Parte 5, dos slides, do vídeo e do ZIP final. Escreve a reflexão sobre
transformação digital, monta a apresentação em ritmo de pitch, grava e publica o vídeo como não listado no
YouTube, e monta o pacote final conferindo que o link do vídeo aparece no documento e nos slides e que tudo
abre depois de descompactar. Perfil: quem apresenta bem e não perde prazo.

## Alocação proposta

Provisória. A coluna de responsável fecha quando a matriz de capacidade estiver preenchida e o grupo
concordar. A única atribuição que já está de pé é a do desenvolvimento.

| Frente | Entregável | Responsável | Revisor |
| --- | --- | --- | --- |
| Product Owner | Escolha do serviço público e diagnóstico do problema | a definir | a definir |
| Product Owner | Parte 2, tabela de 5 requisitos funcionais e 2 não funcionais | a definir | a definir |
| Product Owner | Parte 2, análise de impacto da ausência de um requisito | a definir | a definir |
| Scrum Master | Parte 3, 5 user stories com critérios de aceitação | a definir | a definir |
| Scrum Master | Parte 3, matriz de priorização com justificativa | a definir | a definir |
| Scrum Master | Quadro do Linear atualizado durante o capítulo | a definir | a definir |
| Analista de dados | Parte 4, dataset e tabela de frequência | a definir | a definir |
| Analista de dados | Parte 4, gráfico de barras e de setores | a definir | a definir |
| Analista de dados | Parte 4, análise de padrões e decisão estratégica | a definir | a definir |
| Desenvolvimento | Repositório, estrutura e protótipo demonstrável | John Vitor Silverio Pereira | a definir |
| Comunicação | Parte 5, reflexão com dois riscos e mitigações | a definir | a definir |
| Comunicação | Slides em PDF | a definir | a definir |
| Comunicação | Vídeo de até 5 minutos, não listado no YouTube | a definir | a definir |
| Todos | Parte 1, nome completo e RM de cada integrante | cada um o seu | a definir |
| Comunicação | ZIP final e upload na FIAP ON | a definir | a definir |

## Regras que valem para todo mundo

Cada linha da tabela acima vira um card no Linear, com responsável, milestone e critério de aceitação. Card
sem responsável é card que ninguém faz.

Revisão é obrigatória e é feita por quem não escreveu. Não é formalidade: metade dos pontos perdidos em
trabalho de grupo vem de inconsistência entre partes que ninguém leu junto.

Quem travar avisa antes de travar, não depois do prazo. Uma frase no grupo resolve, silêncio até a véspera
não.

O upload na plataforma é feito por quem cadastrou o grupo, uma única vez, em nome de todos. Conferir o
cadastro de alunos e RMs na plataforma antes de enviar, porque nome cadastrado errado tira nota de gente
que fez o trabalho.
