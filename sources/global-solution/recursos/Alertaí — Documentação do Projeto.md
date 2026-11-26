**Global Solution 2026 · CitizenTech · Turma 2SIOR · FIAP**

**Curso:** Sistemas de Informação · **Entrega:** 18 de novembro de 2026

**Repositório:** https://github.com/FIAP-Dream-Team/global-solution-1-2026

| Integrante | RM | Papel no projeto |
| --- | --- | --- |
| Ana Larissa Cristo Mendes | 567403 | Prototipação e interface |
| Brenda Cristina Martins Araújo | 575032 | Coleta de dados, indicadores e validação |
| João Pedro Thethê Andrade | 568305 | Documentação e entrega |
| John Vitor Silverio Pereira | 566968 | Roteiro, slides e vídeos |
| Vinícius Cardoso Junqueira | 566906 | Modelagem, banco de dados e sistema Java |

---

**Sumário**

---

## 1. Resumo do projeto

Em Porto Alegre, chuvas intensas, temporais e cheias do Lago Guaíba deixam bairros inteiros sem luz e, em seguida, sem água, porque as estações de bombeamento param quando falta energia. Em janeiro de 2024, um temporal comum deixou ao menos 157,3 mil pessoas sem água por mais de 60 horas, e o morador só descobre o problema quando a torneira seca. O **Alertaí** é um aplicativo de alertas por bairro que reúne avisos oficiais e relatos dos próprios moradores, confirmados pelos vizinhos, para responder à pergunta “o que está acontecendo no meu bairro agora, e o que eu faço?”. O diferencial é o **efeito cascata**: quando a falta de luz é confirmada no bairro de uma estação de bombeamento, o app avisa com antecedência os bairros que ela abastece sobre a possível falta de água, dando tempo para as famílias se prepararem, em especial as mais vulneráveis. O projeto começa por um piloto com cinco bairros e entrega um sistema em Java ligado a um banco Oracle, com as regras de agrupamento de relatos, confirmação e cascata funcionando, um protótipo navegável de sete telas, a análise dos dados públicos da cheia de 2024 e a ligação com os ODS 3, 6, 11 e 13.

---

## 2. Problema identificado

Em Porto Alegre, chuvas intensas, temporais e cheias do Lago Guaíba colocam os moradores em situações de risco com frequência: ruas alagadas, árvores caídas, quedas de energia e falta de água. Mesmo assim, quem mora num bairro afetado raramente recebe um aviso claro, a tempo e sobre o lugar onde vive. Os alertas oficiais avisam sobre o evento climático, mas não sobre o que ele causa em cada bairro, e essa informação só circula depois, de forma espalhada.

O caso mais grave é a cadeia **temporal → falta de luz → falta de água**. Quando um temporal derruba a rede elétrica, as estações que bombeiam água para os bairros também param, e os moradores só descobrem que estão sem água quando a torneira seca.

O problema que o Alertaí enfrenta é, portanto, a **falta de alertas antecipados e por bairro sobre situações de risco**, como alagamentos, temporais, cheias, quedas de energia e a falta de água que vem depois delas.

### 2.1 Contexto

Porto Alegre convive com chuvas intensas e enchentes. Em maio de 2024, o Guaíba, que banha a cidade, chegou a 5,33 m, superando o recorde de 4,76 m registrado em 1941 (MATOS, 2024). No auge da cheia, 350 mil pontos ficaram sem energia elétrica e mais de 860 mil clientes ficaram sem abastecimento de água (CHEIA…, 2024).

Esse efeito não depende apenas de enchentes históricas. Em janeiro de 2024, um temporal deixou 22 estações de bombeamento do DMAE paradas por falta de energia. Mais de 60 horas depois da chuva, ao menos 157,3 mil moradores de 31 bairros continuavam sem água (TATSCH, 2024). Em setembro de 2026, outro temporal deixou seis estações de bombeamento sem energia, com risco de falta de água em bairros como Arquipélago e Bom Jesus (PORTO ALEGRE, 2026b).

O cenário tende a se repetir. O boletim do Climate Prediction Center indica mais de 79% de chance de um El Niño forte a muito forte até março de 2027 (CLIMATE PREDICTION CENTER, 2026). O INMET aponta maior probabilidade de chuva acima do normal na Região Sul no mesmo período (INSTITUTO NACIONAL DE METEOROLOGIA, 2026). A Defesa Civil de Porto Alegre acompanha a evolução do fenômeno (PORTO ALEGRE, 2026a).

### 2.2 Evidências

A análise de dados públicos reuniu evidências de cada elo da cadeia temporal → falta de luz → falta de água. Todos os números foram conferidos nas fontes em 12 e 14/11/2026.

- Na cheia de 2024 (cota de 5,35 m), **160.210 moradores**, 39.422 edificações e 65.528 empresas ficaram em área afetada em Porto Alegre, o equivalente a 12,0% da população da cidade (PORTO ALEGRE, [2024]; IBGE; PORTO ALEGRE, [s.d.]).
- Dos 46 bairros atingidos, **cinco concentram 52,3% dos moradores afetados** e dez concentram 73,3%. Sarandi (26.042) e Menino Deus (18.231) são os dois com mais moradores afetados e, juntos, respondem por 27,6% do total.
- O DMAE já alertou que a falta de energia nas estações São João e Moinhos de Vento poderia afetar o abastecimento em 51 bairros, entre eles o Sarandi (PORTO ALEGRE, 2022).

| Quando | O que aconteceu | Elo da cadeia | Fonte |
| --- | --- | --- | --- |
| mai/2024 | Cheia histórica. 160.210 moradores, 39.422 edificações e 65.528 empresas em área afetada pela cota de 5,35 m. O painel também registra 5 estações de captação (EBAB), 19 de bombeamento de drenagem (EBAP) e 4 de tratamento de esgoto (ETE) atingidas. | Chuva → alagamento | PORTO ALEGRE, [2024] |
| mai/2024 | No auge da cheia, 350 mil pontos sem energia e mais de 860 mil clientes sem água. | Chuva → luz → água | CHEIA…, 2024 |
| jan/2024 | Temporal comum, sem cheia: 22 estações de bombeamento de água paradas por falta de energia; ao menos 157,3 mil pessoas em 31 bairros sem água mais de 60 h depois da chuva. | Temporal → luz → água | TATSCH, 2024 |
| set/2022 | O DMAE avisa que a falta de energia nas estações de bombeamento São João e Moinhos de Vento pode afetar o abastecimento em 51 bairros, entre eles o Sarandi. | Luz → água | PORTO ALEGRE, 2022 |
| nov/2026–jan/2027 | Maior probabilidade de chuva acima da normal na Região Sul, por causa do El Niño. | Risco futuro | INSTITUTO NACIONAL DE METEOROLOGIA, 2026 |

**Interpretação.** O problema não é só a enchente grande. Um temporal comum já derruba a energia das estações de bombeamento e deixa bairros inteiros sem água por dias. Hoje a informação chega por grupos de WhatsApp, vizinhos e notas gerais da cidade, sem aviso por bairro. Essa é a lacuna que o Alertaí quer cobrir. A análise estatística completa está na seção 12.

### 2.3 Como o problema foi identificado

O ponto de partida foi a vivência de um dos integrantes do grupo, que é da Região Sul e já passou por situações parecidas: a chuva forte chega, a luz cai e, horas depois, a água para de sair da torneira, sem nenhum aviso. Nesse intervalo, o morador não sabe se o problema é só na sua casa ou no bairro inteiro, nem se ainda dá tempo de guardar água. Ao ouvir esse relato, o grupo percebeu que a dificuldade não estava só no evento climático, mas na **falta de informação local e antecipada**: a queda de energia e a falta de água pareciam problemas separados, quando na verdade uma levava à outra. O grupo então buscou notícias e dados oficiais e confirmou que não se tratava de um caso isolado: a enchente de 2024 e os temporais seguintes mostram que a situação se repete e atinge milhares de pessoas em Porto Alegre (ver seção 2.1).

Além de recente e de grande repercussão, o tema ganha urgência com a previsão de chuvas acima da média para os próximos meses. A análise dos dados públicos por bairro, apresentada na seção 2.2, complementa essas evidências e mostra onde o problema se concentra.

### 2.4 Hipóteses

O grupo partiu de três hipóteses. Duas já puderam ser verificadas com dados públicos; a terceira depende do teste com usuários planejado (seção 11).

| Hipótese | Resultado | Evidência |
| --- | --- | --- |
| **H1:** a falta de água não vem só de grandes enchentes; temporais comuns também derrubam a energia das estações de bombeamento e deixam bairros sem água | Confirmada | Em janeiro de 2024, um temporal sem cheia parou 22 estações e deixou ao menos 157,3 mil pessoas sem água por mais de 60 horas (TATSCH, 2024). Em 2022, o DMAE alertou que a falta de energia em duas estações de bombeamento poderia afetar o abastecimento em 51 bairros (PORTO ALEGRE, 2022) |
| **H2:** o risco se concentra em poucos bairros, então um piloto pequeno já alcança boa parte das pessoas afetadas | Confirmada | Dos 46 bairros atingidos pela cheia de 2024, 5 concentram 52,3% dos moradores afetados e 10 concentram 73,3% (seção 12) |
| **H3:** os moradores entendem o alerta em cascata e sabem o que fazer ao recebê-lo | A validar | Tarefa T3 do teste de usabilidade planejado (seção 11) |

---

## 3. Público beneficiado

O Alertaí é para todos. Em um primeiro momento, atende os **moradores de Porto Alegre** que dependem do abastecimento de água e de energia do próprio bairro, com atenção a quem está em situação de risco, como quem mora em áreas que alagam. São pessoas que veem a luz cair, a água faltar ou a rua alagar e precisam saber se o problema atinge só a sua casa ou o bairro inteiro, quanto tempo deve durar e o que fazer. O projeto começa por um piloto com cinco bairros: Menino Deus, Praia de Belas, Centro Histórico, Arquipélago e Bom Jesus.

A solução também ajuda de forma especial as **populações mais vulneráveis**, para quem algumas horas sem luz ou sem água têm consequências maiores: pessoas acamadas, idosos que moram sozinhos, pessoas com deficiência ou mobilidade reduzida e quem depende de aparelhos elétricos de saúde, como concentradores de oxigênio. Para essas famílias, saber com antecedência que a água ou a energia podem faltar é o que permite se preparar a tempo.

**Dificuldade enfrentada:** hoje a informação chega separada e tarde. Os alertas meteorológicos avisam sobre o evento climático, mas não sobre o que ele causa em cada bairro. Alagamentos, quedas de energia e falta de água são comunicados por canais diferentes, quando são comunicados, e cada morador precisa juntar as peças sozinho, muitas vezes por grupos de mensagens. Ninguém avisa que, depois da queda de luz, a água daquele bairro pode faltar. Sem esse aviso, as famílias perdem a chance de se preparar: guardar água, avisar os vizinhos ou ajudar quem não pode sair de casa.

---

## 4. Justificativa da proposta

As evidências reunidas na seção 2 mostram que o risco em Porto Alegre não é eventual: enchentes, temporais e quedas de energia se repetem e, com a previsão de um El Niño forte até março de 2027, tendem a voltar nos próximos meses. Também mostram que parte dos danos vem em sequência. Em janeiro de 2024, a falta de água chegou depois da queda de energia nas estações de bombeamento e durou mais de 60 horas para ao menos 157,3 mil moradores (TATSCH, 2024). Se a falta de luz vem antes da falta de água, existe um intervalo em que o morador ainda pode ser avisado e se preparar. Hoje esse intervalo é desperdiçado, porque ninguém faz essa ligação para ele.

A proposta do Alertaí foi escolhida para ocupar esse espaço, com três decisões:

- **Alertas sobre o que acontece no bairro, e não só sobre o evento climático.** O morador precisa saber o que acontece onde ele mora, trabalha ou tem família: se falta luz, se a água vai faltar, se a rua alagou.
- **Relatos confirmados pelos próprios moradores.** Quem está no bairro percebe primeiro a luz cair ou a rua alagar. Juntar e confirmar esses relatos dá ao sistema uma informação rápida e local, sem depender de sensores ou de infraestrutura cara.
- **Aviso em cascata.** Ao ligar a falta de luz confirmada à estação de bombeamento daquele bairro, o sistema avisa sobre a falta de água antes que ela aconteça. Nenhum canal faz isso hoje, e é essa antecedência que permite às famílias, principalmente às mais vulneráveis, guardar água e se organizar.

O Alertaí não substitui a Defesa Civil nem as empresas de energia e água. Ele complementa esses canais, reunindo num só lugar e por bairro informações que hoje chegam separadas e tarde. Por isso a proposta é viável como uma solução CitizenTech: parte de uma necessidade real dos moradores, usa a própria comunidade como fonte de informação e começa por um piloto de cinco bairros, que pode ser ampliado para o resto da cidade.

---

## 5. A solução: Alertaí

O Alertaí é um aplicativo de alertas por bairro, pensado para qualquer cidade sujeita a chuvas intensas e enchentes. **Porto Alegre é o foco inicial**, por ser onde o problema foi identificado e onde o piloto começa. O app reúne, num só lugar, avisos oficiais sobre chuva, temporal e nível dos rios e lagos da região (em Porto Alegre, o Guaíba) e relatos dos próprios moradores sobre falta de luz, falta de água, alagamento, árvore caída e granizo. Com essas duas fontes, responde ao morador a pergunta que hoje fica sem resposta: **o que está acontecendo no meu bairro agora, e o que eu faço?**

### 5.1 Como funciona

1. **O morador se cadastra com nome e número de celular** e escolhe os bairros que quer acompanhar, com um apelido para cada um, como “casa”, “trabalho” ou “casa da mãe”, e os tipos de alerta que deseja receber.
2. **Quem vê um problema relata em dois toques:** escolhe o tipo (falta de luz, falta de água, alagamento, chuva forte, árvore caída ou granizo) e envia. Bairro, gravidade e descrição são opcionais. O nome de quem relata não aparece para ninguém; o app mostra apenas o bairro.
3. **Relatos iguais viram uma ocorrência só.** Se já existe uma ocorrência ativa do mesmo tipo no mesmo bairro, o novo relato conta como confirmação, em vez de criar outro registro. Assim, dez vizinhos sem luz aparecem como um único problema, confirmado por dez pessoas.
4. **Os vizinhos mantêm a informação atualizada.** Na ocorrência, cada pessoa responde “ainda está acontecendo” ou “já voltou”. Quando três pessoas informam que o serviço voltou, a ocorrência é encerrada.
5. **O morador vê o que acontece em cada bairro** pela tela inicial, por um mapa com os bairros coloridos pela gravidade e por um painel com o histórico de ocorrências.

### 5.2 Efeito cascata

O diferencial do Alertaí é avisar sobre a falta de água antes que ela aconteça:

1. Um morador relata falta de luz num bairro onde existe uma estação de bombeamento de água.
2. Quando um segundo morador confirma, a falta de luz deixa de ser um relato isolado e passa a ser considerada confirmada.
3. O sistema identifica que a estação daquele bairro ficou sem energia e, por isso, pode parar de bombear água.
4. Quem acompanha os bairros abastecidos por essa estação recebe, por notificação, o alerta **“possível falta de água”**, com a explicação do motivo, o que fazer agora e os contatos úteis para o caso.

O alerta é gerado uma única vez por estação, mesmo que outras pessoas continuem confirmando a falta de luz, para não repetir o mesmo aviso.

### 5.3 Benefício para o cidadão

- **Tempo para se preparar:** com o aviso antecipado, a família pode encher recipientes com água, separar água para beber e organizar a rotina antes de ficar sem o serviço.
- **Informação do lugar certo:** o morador recebe o que acontece nos bairros que importam para ele, e não um aviso genérico.
- **Saber se o problema é só seu:** o número de confirmações mostra se a falta de luz ou de água atinge a casa ou o bairro inteiro.
- **O que fazer e a quem ligar:** cada alerta traz orientações simples e os contatos certos, como a Defesa Civil (199).
- **Proteção para quem é mais vulnerável:** quem cuida de pessoas acamadas, de idosos ou de alguém que depende de aparelhos elétricos de saúde ganha tempo para agir.

### 5.4 Diferencial

| Ponto | Canais que existem hoje | Alertaí |
| --- | --- | --- |
| Recorte | Avisos por área de risco ou para a cidade | Por bairro, nos bairros que a pessoa escolhe acompanhar |
| O que cobre | Eventos climáticos (chuva, temporal, cheia); falta de luz e de água em canais separados | Clima, alagamento, árvore caída, falta de luz e falta de água no mesmo lugar |
| Direção da informação | O morador só recebe | O morador recebe, relata e confirma |
| Antecedência | Avisa o evento que está acontecendo | Prevê a próxima etapa: da falta de luz para a falta de água |

O Alertaí não substitui a Defesa Civil nem as empresas de energia e água. Ele complementa esses canais.

---

## 6. Viabilidade da implementação

**Para o morador do piloto**

O público desta entrega é o morador que vê a luz cair, a água falhar ou a rua alagar e precisa que o vizinho confirme o mesmo fato. No piloto, os bairros são Menino Deus, Praia de Belas, Centro Histórico, Arquipélago e Bom Jesus. A implementação é viável para essa pessoa porque as regras que mudam o dia dela já executam. O segundo relato do mesmo tipo e bairro, dentro do prazo, entra na ocorrência ativa. Três retornos de “já voltou” encerram como resolvida. A falta de luz confirmada no Arquipélago avisa uma vez Menino Deus, Praia de Belas e Centro Histórico. A estação de drenagem do Bom Jesus fica de fora dessa regra.

**Com as tecnologias escolhidas**

Java 17 concentra essas regras em serviço. A mesma classe atende o menu desta demo e pode atender uma tela depois, sem reescrever o agrupamento nem a cascata. O Maven entrega esse programa num jar, com o driver do Oracle. O JDBC grava o que não pode se perder para o morador: o relato, a confirmação, o status da estação e a notificação. O volume do piloto cabe nesse banco: cinco bairros, seis tipos, três pessoas e duas estações. O menu de console serve para a avaliação ver o fluxo. No cotidiano do morador, a interface prevista continua sendo a tela do protótipo. O efeito que ele recebe é o das chamadas: uma ocorrência por tipo e bairro, e um aviso só por estação.

**O alcance para quem mora no bairro**

O aviso fica em `NOTIFICACAO`, ligado ao alerta e à pessoa que segue o bairro. A API oficial de chuva e de nível do Guaíba, o push no celular e o SMS ficam fora desta demo. Na demo, estação, bairro abastecido e quem segue o bairro entram cadastrados. Para o morador do piloto, o que esta implementação sustenta é distinguir o relato da confirmação e disparar a cascata uma vez. O alerta que o Oracle guarda é a base do aviso que, num passo seguinte, chegaria ao telefone.

---

## 7. Tecnologias utilizadas

A demonstração técnica do Alertaí usa cinco tecnologias. Cada uma cobre uma parte do que o morador precisa: registrar o que viu no bairro, juntar a confirmação do vizinho, guardar a estação e avisar uma vez só quem segue os bairros que ela abastece.

**Java 17.** O problema junta ocorrência, confirmação, estação e alerta. Java 17 é a linguagem do curso. Com ela, `Ocorrencia` e `Estacao` carregam os dados, e os enums `StatusOcorrencia`, `TipoConfirmacao`, `OrigemAlerta` e `StatusEstacao` fecham os valores que o banco também restringe. O programa que a avaliação executa é o mesmo que agrupa o relato e dispara a cascata.

**Maven.** O código fica em `backend/`, num `pom.xml` com Java 17 e o driver do Oracle. O Maven monta o programa e embute o driver no jar. A equipe roda a mesma demo, sem copiar biblioteca à mão.

**JDBC com PreparedStatement.** Registrar, listar e confirmar são inserção, consulta e atualização. O JDBC faz essas operações no Oracle. Cada tabela tem um DAO, o comando usa `PreparedStatement`, e uma `ConnectionFactory` abre a conexão. A regra de agrupar o relato fica no `OcorrenciaService`; o SQL fica no DAO.

**Oracle.** O modelo das 13 tabelas está em SQL do Oracle (`NUMBER`, `VARCHAR2`, `CHECK` e `SYSTIMESTAMP`). A lista de ocorrências ativas do bairro é uma consulta. A cascata grava um `ALERTA` de origem `CASCATA`, liga os bairros de `ESTACAO_BAIRRO` e gera a `NOTIFICACAO` de quem segue esses bairros.

**Menu de console.** No protótipo, o morador usa telas. A avaliação precisa ver o sistema rodar sem depender delas. O `MenuPrincipal` lê a opção e chama o `OcorrenciaService` para registrar ou confirmar. A cascata continua fora do menu: quando a falta de luz é confirmada no bairro da estação de abastecimento, o serviço avisa. O texto do console fica sem acento de propósito.

**Protótipo e organização do trabalho**

| Ferramenta | Para que foi usada | Por que foi escolhida |
| --- | --- | --- |
| **Figma** | Wireframes e protótipo navegável em alta fidelidade (7 telas de celular e 7 de computador, com 110 links) | Permite testar o fluxo do app com cliques antes de programar e compartilhar com a banca por um link |
| **React, TypeScript, Vite e Tailwind CSS** | Versão do protótipo que roda no navegador, com relatos e confirmações funcionando sobre dados simulados | As telas foram construídas como um app de verdade, o que garante que o desenho do Figma é possível de implementar e facilita a evolução para o app final |
| **GitHub** | Repositório com o código, o modelo de dados, a marca e os prints, organizado em branches e pull requests | Mantém o histórico de cada mudança e permite revisar o trabalho antes de juntar à versão principal |
| **Linear** | Quadro Kanban com os 32 cards do projeto, organizados em milestones (seção 15) | Cada card liga um trecho do enunciado a um responsável, um prazo e um critério de aceitação |
| **Google Meet e WhatsApp** | Reunião inicial e comunicação do dia a dia | Ferramentas que todos já usavam, sem custo de adaptação |

---

## 8. Diagramas da solução

### 8.1 Arquitetura

![](attachment:405a7dae-ec9a-47bb-98f8-732db183fd4b:405a7dae-ec9a-47bb-98f8-732db183fd4b.png)

*Diagrama de arquitetura da demonstração técnica.*

A figura descreve a demonstração técnica: um programa Java 17, em Maven, que acessa o Oracle por JDBC. O menu de console é a interface da demo, para a avaliação ver o sistema executar sem depender das telas, que seguem no protótipo. O menu lê a opção e chama o serviço. O serviço aplica a regra. O DAO executa o SQL com `PreparedStatement`, e uma única `ConnectionFactory` abre a conexão. Assim o comando SQL não fica espalhado pelo menu, e a regra de agrupar um relato não fica dentro do DAO.

As setas seguem essa divisão. `MenuPrincipal` chama `OcorrenciaService`, para registrar ou confirmar um relato, e `ExpiracaoService`, para encerrar o que passou do prazo do tipo. A cascata não é uma opção do menu: ela ocorre dentro do registro, quando a falta de luz foi confirmada no bairro de uma estação de abastecimento. `CascataService` marca essa estação sem energia uma vez só e pede ao `NotificacaoService` o aviso de água para quem segue os bairros que ela abastece. Os serviços passam pelos DAOs.

Ficam de fora desta figura as evoluções previstas: integração com API oficial de chuva e de nível do Guaíba, push no celular e aviso por SMS. Na demo, esses dados entram cadastrados. O código dessa arquitetura fica em `backend/`, no pacote `br.com.alertabairro`.

**Observação:** o `ExpiracaoService` aparece no diagrama, mas não foi implementado (ver seção 10.1). O pacote Java mantém o nome antigo do projeto (`alertabairro`).

### 8.2 Modelo de dados

![](attachment:fabb68d1-ddf4-4d96-99d0-beec1ff003bd:fabb68d1-ddf4-4d96-99d0-beec1ff003bd.png)

*Modelo de dados relacional, com as 13 tabelas.*

O diagrama relacional guarda o que a demo precisa distinguir: o relato de quem está no bairro, a confirmação dos vizinhos e o aviso que sai disso. Ocorrência e alerta são registros diferentes. A ocorrência é o que alguém viu (falta de luz, alagamento, falta de água). O alerta é o aviso entregue pelo sistema, vindo de uma fonte oficial ou gerado pela cascata. `NOTIFICACAO` aponta só para `ALERTA` porque a lista de ocorrências ativas do bairro é uma consulta, não uma mensagem enviada a alguém.

A cascata usa as duas ligações da estação, e as duas estão no diagrama por isso. `ESTACAO_BOMBEAMENTO.ID_BAIRRO` é o bairro onde a estação fica: a falta de luz confirmada ali marca a estação sem energia. `ESTACAO_BAIRRO` lista os bairros que ela abastece, e o alerta de água vai para esses. Entra nessa regra só a estação do tipo abastecimento. `USUARIO_BAIRRO` existe pelo mesmo motivo: uma pessoa segue vários bairros, cada um com um apelido (casa, trabalho), e o aviso chega só a quem segue o bairro afetado.

`ID_AUTOR` permanece em `OCORRENCIA` para a reputação e para a mesma pessoa não confirmar duas vezes o mesmo relato. A tela não mostra esse nome: o mapa usa só o bairro. `CONFIRMACOES` é o contador que o serviço atualiza junto com as linhas de `CONFIRMACAO`, para a consulta ler o total sem percorrer a tabela. `NIVEL_GUAIBA` não tem bairro porque é a medição da cidade, usada na correlação com as ocorrências. Em `CONTATO`, o telefone é obrigatório e o bairro vazio significa que o número vale para Porto Alegre inteira, como o 199.

### 8.3 Fluxo da aplicação

Todo uso do Alertaí passa pelo Início: dali a pessoa reporta, consulta o mapa, vê o painel do bairro ou abre um alerta. Reportar e tocar num ícone do mapa levam à mesma tela de ocorrência, onde a vizinhança confirma ou encerra o problema. No primeiro uso, a pessoa faz o cadastro (nome e celular) e escolhe os bairros; depois, tudo sai do Início. O alerta em cascata chega por notificação ou pela faixa verde do Início.

![](attachment:47901b9b-4ecf-41fc-8b2c-24df7172e7de:47901b9b-4ecf-41fc-8b2c-24df7172e7de.png)

*Jornada do usuário: mapa das 7 telas.*

**Caminhos principais.** Cinco tarefas cobrem o uso do app; nenhuma passa de quatro toques a partir do Início.

| Tarefa | Caminho | Termina em |
| --- | --- | --- |
| Começar a usar | Abre o app → Cadastro (nome e celular)* → Meus bairros (escolhe bairros e apelidos) → Início | 1. Início |
| Reportar um problema | Início → Reportar → escolhe o tipo → Enviar | 4. Ocorrência |
| Confirmar ou encerrar | Ocorrência → “Ainda está” ou “Já voltou” | 4. Ocorrência atualizada |
| Entender um alerta em cascata | Notificação ou faixa verde do Início → Alerta em cascata → passo da luz | 2. Alerta em cascata ou 4. Ocorrência |
| Explorar o bairro | Início → Mapa → toca num bairro → toca num alerta; ou Início → Painel | 4. Ocorrência ou 6. Painel do bairro |
- A tela de cadastro está prevista no projeto, mas ainda não foi desenvolvida no protótipo nem no sistema em Java.

A barra de navegação (Início, Mapa, Reportar, Painel e Bairros) fica fixa em todas as telas, então qualquer caminho pode recomeçar com um toque.

**Regras que mudam o caminho.** Três regras do sistema decidem o que a pessoa vê depois de agir. São as mesmas do backend em Java e do protótipo.

| Quando | O que acontece | Onde aparece |
| --- | --- | --- |
| Alguém reporta um problema que já existe no mesmo bairro | O relato entra como confirmação da ocorrência aberta, sem criar outra | Aviso “Seu relato entrou como confirmação” na Ocorrência |
| Três pessoas tocam em “Já voltou” | A ocorrência é encerrada como resolvida | Selo Resolvido e última linha da linha do tempo |
| A falta de luz é confirmada no bairro de uma estação de bombeamento | Sai um alerta de possível falta de água para os bairros que ela abastece, uma vez por estação | Notificação, faixa verde do Início e camada Efeito cascata do Mapa |

O desenho do sistema prevê uma quarta regra: sem confirmação dentro do prazo do tipo (de 2 a 6 horas), a ocorrência expira e some do mapa. Ela ainda não está implementada no backend nem no protótipo.

---

## 9. Interface

### 9.1 Wireframes

O protótipo foi feito em três etapas, sempre começando pelo celular, porque o alerta chega no celular e é lá que a pessoa reporta o que vê na rua. A primeira etapa foram os wireframes de baixa fidelidade: as 7 telas em cinza, só com estrutura (onde fica cada informação, a ordem de leitura e o tamanho dos botões), sem cor, para discutir o conteúdo antes do visual.

![](attachment:4fec119c-f09f-435b-8bad-014cccfea836:4fec119c-f09f-435b-8bad-014cccfea836.png)

*Wireframes das 7 telas.*

As telas, em ordem: 1. Início, 2. Alerta em cascata, 3. Reportar, 4. Ocorrência, 5. Meus bairros, 6. Painel do bairro, 7. Mapa interativo. Os wireframes estão no arquivo do Figma “Alertaí · Protótipo”, página Wireframes.

### 9.2 Protótipo navegável

Depois dos wireframes, a equipe comparou seis direções de paleta e oito ideias de logotipo e votou na paleta Jacarandá e no logotipo Ponto de alerta. Em seguida, as telas foram construídas como app de verdade (React) e levadas ao Figma em camadas editáveis, primeiro no celular (390 px) e depois no computador (1440 px), com 110 links entre elas. O ponto de partida foram as regras do sistema em Java: relato repetido vira confirmação, três “já voltou” encerram a ocorrência e a falta de luz na estação gera o aviso de água.

![](attachment:e240651b-6df4-4f39-bd34-974a9625c288:e240651b-6df4-4f39-bd34-974a9625c288.png)

*As 7 telas do protótipo no celular.*

| # | Tela | O que mostra |
| --- | --- | --- |
| 1 | Início | Faixa do efeito cascata, nível do Guaíba, mapa resumido e os alertas dos bairros seguidos |
| 2 | Alerta em cascata | O porquê passo a passo (temporal → luz → estação → água), o que fazer e contatos de emergência |
| 3 | Reportar | Relato em dois toques: tipo e enviar; bairro, gravidade e descrição são opcionais |
| 4 | Ocorrência | “Ainda está acontecendo aí?” com os botões Ainda está e Já voltou, contadores e linha do tempo |
| 5 | Meus bairros | Bairros seguidos com apelido, tipos de alerta, dados do cadastro (nome e celular) com aceite opcional de SMS e Texto maior |
| 6 | Painel do bairro | Ocorrências por tipo em 30 dias e o padrão “a luz cai antes da água” |
| 7 | Mapa interativo | Bairros coloridos pela gravidade, filtros por tipo e a camada do efeito cascata |

**Como navegar.** O protótipo abre no Figma em modo Apresentar e responde a cliques como o app: abra o arquivo, vá para a página Alta fidelidade, clique em Apresentar e escolha o fluxo “Alertaí · celular” ou “Alertaí · computador”. O mesmo protótipo roda no navegador a partir do código em `frontend/`, onde os relatos e as confirmações funcionam de verdade, com dados simulados.

Link do Figma: https://www.figma.com/design/V8VN4hV6fPULl2ZnAh6Aet/Alertaí-·-Protótipo?node-id=1-4

**Limitações do protótipo.** Os dados são simulados: bairros, alertas, nível do Guaíba e números do painel são ilustrativos. O mapa é estilizado e fora de escala, com os 5 bairros do piloto.

### 9.3 Identidade visual

Cada escolha visual tem um motivo ligado ao público de Porto Alegre ou à acessibilidade.

| Decisão | Escolha | Por quê |
| --- | --- | --- |
| Paleta | Jacarandá: roxo `#5B3FA8`, verde `#27704C` e fundo lilás `#F6F3FB` | Votada pela equipe. O lilás vem dos jacarandás que florescem na cidade em novembro e dá um tom de vizinhança, sem parecer alarme o tempo todo |
| Logotipo | Ponto de alerta: pino de mapa com exclamação, acento do “í” em lilás `#9B7FE0` | Diz “atenção, aqui no seu bairro” e vale para qualquer evento do clima, não só água |
| Tipografia | Sora nos títulos, Figtree no texto | Sora dá personalidade aos títulos; Figtree é aberta e fácil de ler em tela pequena |
| Gravidade | Amarelo Atenção, laranja Perigo, vermelho Grande perigo, sempre com a palavra escrita | Mesmas cores dos avisos do INMET, que o público já conhece; a palavra garante que quem não distingue cores entenda |
| Ícones | Desenho próprio, em dois tons, sempre com o nome ao lado | Um ícone por tipo de ocorrência (luz, água, alagamento, chuva, árvore, granizo); o nome evita adivinhação |
| Efeito cascata | Faixa verde no Início e setas tracejadas no mapa | É o diferencial do app; precisa aparecer antes de qualquer outro alerta |
| Navegação | Barra fixa com 5 itens e Reportar no centro, em destaque | Reportar é a ação principal e fica ao alcance do polegar |

Os arquivos da marca (logotipo, ícone do app e favicon) e o guia de uso estão em `docs/marca` no repositório.

---

## 10. Especificação técnica do que foi implementado

### 10.1 O que o sistema executa

**O que a demo executa.** O programa fica em `backend/`, pacote `br.com.alertabairro`. O `MenuPrincipal` oferece aplicar o script do Oracle, registrar um relato, listar as ocorrências ativas do bairro e confirmar. `OcorrenciaService` aplica o registro e a confirmação. Quando a falta de luz recebe uma confirmação nova, ele chama `CascataService`, que chama `NotificacaoService`. Os três passam pelos DAOs e pela `ConnectionFactory`. A cascata não é opção de menu.

O catálogo do piloto entra na preparação do banco: cinco bairros (Menino Deus, Praia de Belas, Centro Histórico, Arquipélago e Bom Jesus), seis tipos de relato, três moradores, a ETA Arquipélago do tipo `ABASTECIMENTO` e a drenagem do Bom Jesus. Cada morador segue um bairro abastecido pela ETA, com apelido de casa ou trabalho.

**Relato agrupado.** Registrar pede tipo, bairro, pessoa, severidade de 1 a 3 e descrição. A pessoa vai para `ID_AUTOR` e para a primeira linha de `CONFIRMACAO`. O cartão da ocorrência mostra tipo, bairro, status, severidade, contador, descrição e data; o nome fica de fora da tela. Se já existe ocorrência `ATIVA` do mesmo tipo e do mesmo bairro, e a última confirmação ainda está dentro de `HORAS_EXPIRACAO` do tipo, o relato novo não abre outra linha: ele grava `CONFIRMA` e soma 1 em `CONFIRMACOES`. A mesma pessoa não confirma de novo esse retorno.

**Confirmação.** “Ainda está” grava `CONFIRMA` e soma 1 no contador. “Já voltou” grava `RESOLVEU`. Quando três pessoas registram `RESOLVEU` na mesma ocorrência, o status passa a `RESOLVIDA` e `ENCERRADA_EM` recebe a data. Os dois retornos da mesma pessoa na mesma ocorrência são recusados.

**Cascata.** O primeiro relato de falta de luz abre a ocorrência e ainda não avisa. O aviso sai quando outra pessoa confirma essa falta de luz: pelo relato que entra na ocorrência ativa ou pelo retorno “Ainda está”. `CascataService` procura estação `ABASTECIMENTO` no bairro da ocorrência, com status `OPERANDO`. A que ainda está operando passa a `SEM_ENERGIA`, e só essa mudança cria um `ALERTA` de origem `CASCATA`, do tipo falta de água, com a ocorrência de luz na origem. `ALERTA_BAIRRO` liga os bairros de `ESTACAO_BAIRRO`, e `NOTIFICACAO` avisa cada pessoa que segue algum desses bairros, uma vez por pessoa. A estação de drenagem não entra na consulta. Confirmação, mudança da estação, alerta e notificações são gravados na mesma transação.

**O que ficou de fora.** `ExpiracaoService` está no diagrama e não está no código: na hora de registrar, a janela de horas decide se o relato entra na ocorrência ativa, mas nenhuma rotina muda para `EXPIRADA` a ocorrência que passou do prazo sem confirmação nova. A API oficial de chuva e de nível do Guaíba, o push no celular e o aviso por SMS ficam fora desta demo. `NIVEL_GUAIBA` existe no modelo, e o Java não consulta medição externa. O aviso da cascata fica gravado em `NOTIFICACAO`. As telas do morador estão no protótipo; a avaliação vê o fluxo pelo menu de console. O cadastro de usuários com nome e celular também não foi implementado: os três moradores da demo já vêm cadastrados no banco.

### 10.2 Sistema Java em execução

Os prints abaixo mostram o menu de console atual, com as quatro opções, em quatro casos de uso.

**1º caso: registrar um relato.** O morador escolhe o tipo, o bairro, a pessoa, a severidade e a descrição, e o sistema grava a ocorrência.

![](attachment:7eb17d5b-1db1-4160-b352-81100960d4c6:7eb17d5b-1db1-4160-b352-81100960d4c6.png)

*Registro de chuva forte no Centro Histórico.*

**2º caso: registrar um segundo relato.**

![](attachment:42d1ff6a-ea53-419b-b577-394c15690fe1:42d1ff6a-ea53-419b-b577-394c15690fe1.png)

*Registro de falta de luz no Menino Deus.*

**3º caso: ver as ocorrências ativas de um bairro.**

![](attachment:c64a198f-5d09-4279-b1f8-20f9eca6f3e7:c64a198f-5d09-4279-b1f8-20f9eca6f3e7.png)

*Ocorrências ativas no Menino Deus.*

**4º caso: marcar que a luz de um bairro voltou.** O retorno “Já voltou” é gravado na ocorrência; ela é encerrada como resolvida quando três pessoas diferentes fazem o mesmo.

![](attachment:597ca75a-f238-4a49-998b-85b8bb80ceae:597ca75a-f238-4a49-998b-85b8bb80ceae.png)

*Retorno “Já voltou” registrado numa ocorrência de falta de luz.*

### 10.3 Persistência no banco

O menu está ligado ao Oracle local. O programa aplica o script das 13 tabelas, e cada operação passa por um DAO com `PreparedStatement` até a `ConnectionFactory`. Registrar um relato insere a linha em `OCORRENCIA`. Ver as ocorrências ativas do bairro consulta essas linhas. Confirmar ou marcar que já voltou atualiza o contador e, com três retornos de “já voltou”, encerra a ocorrência como `RESOLVIDA`. O autor não aparece na tela.

As consultas abaixo mostram o resultado fora do menu. A primeira lista as 13 tabelas que o script criou:

![](attachment:84cc86b8-5907-4c3c-9f9a-c0a822e28f17:84cc86b8-5907-4c3c-9f9a-c0a822e28f17.png)

*Tabelas criadas pelo script.*

A segunda mostra os bairros do piloto, gravados junto com o script: são os bairros que o menu oferece na hora de registrar.

![](attachment:59183320-3ab7-4348-97e1-c3e00563a241:59183320-3ab7-4348-97e1-c3e00563a241.png)

*Bairros do piloto gravados no banco.*

A terceira mostra o relato que o menu inseriu e que continua no banco depois que o programa fecha.

![](attachment:62aa5df6-929b-423d-9630-ac3664b05c9d:62aa5df6-929b-423d-9630-ac3664b05c9d.png)

*Ocorrência gravada no banco.*

### 10.4 Conceitos do curso aplicados

O morador relata falta de luz, falta de água ou alagamento no bairro. O vizinho confirma, ou marca que o serviço voltou. Se a falta de luz fica confirmada no bairro de uma estação de abastecimento, quem segue os bairros que ela abastece recebe um aviso de possível falta de água. Esse é o recorte da demo, e ele segue os dois desenhos feitos antes do código: o diagrama de arquitetura e o modelo relacional.

**Orientação a objetos.** Aparece nas entidades. `Ocorrencia` recebe tipo, bairro, status, severidade e datas no construtor e recusa valor incoerente antes de qualquer SQL. `TipoOcorrencia` carrega o código e as horas da janela. `Estacao` carrega o nome usado no aviso. O serviço trabalha com esses objetos; a tela só lê os getters.

**Enums.** Fecham os valores que o banco também restringe por `CHECK`. `StatusOcorrencia` é `ATIVA`, `RESOLVIDA` ou `EXPIRADA`. `TipoConfirmacao` é `CONFIRMA` ou `RESOLVEU`, o “Ainda está” e o “Já voltou” do menu. `OrigemAlerta` separa `OFICIAL` de `CASCATA`. `StatusEstacao` separa `OPERANDO`, `SEM_ENERGIA` e `DESLIGADA`. O DAO grava `StatusEstacao.SEM_ENERGIA.name()` no `UPDATE`, o mesmo texto da constraint.

**Coleções.** Atravessam as camadas. O menu percorre `List` de bairros, tipos e pessoas para montar a escolha. O DAO de ocorrência devolve `ArrayList` na listagem do bairro. Na cascata, a lista de estações ainda operando é percorrida uma a uma, e `UsuarioBairroDAO` usa `DISTINCT` para a pessoa que segue dois bairros abastecidos entrar uma vez só na lista de notificações.

**Camadas.** São as setas do diagrama. `MenuPrincipal` lê a opção e chama `OcorrenciaService`. O serviço aplica o agrupamento e a confirmação e, dali, chama `CascataService`, que chama `NotificacaoService`. O menu não monta SQL, e o DAO não decide se o relato é duplicado.

**Conexão com o banco.** É JDBC. `ConnectionFactory` abre uma conexão com o Oracle, com auto-commit desligado. Cada DAO prepara um `PreparedStatement` e preenche os parâmetros. `Identificador` calcula o próximo número da tabela, no mesmo padrão do script. `Transacao` dá commit se o serviço termina e desfaz a transação se o SQL ou a regra falha, para a estação não ficar sem energia sem o alerta correspondente.

**Modelagem.** Aparece na hora em que o serviço grava. O relato vira linha de `OCORRENCIA` e de `CONFIRMACAO`, e o contador sobe junto com a linha. O aviso vira `ALERTA`, `ALERTA_BAIRRO` e `NOTIFICACAO`. A lista de ocorrências ativas do bairro continua sendo uma consulta, como o modelo definiu.

### 10.5 Problemas técnicos e soluções

**Problema 1: relato do mesmo tipo e bairro.** O primeiro registro de falta de luz no Arquipélago gravava uma `OCORRENCIA`. O segundo, feito minutos depois pela pessoa ao lado, gravava outra linha, com o mesmo tipo e o mesmo bairro. A lista do bairro mostrava dois problemas onde havia um só, e o contador `CONFIRMACOES` se dividia entre as duas.

*Alternativas avaliadas.* Um índice único de tipo e bairro enquanto o status fosse `ATIVA`: ele segura o status, mas deixa de fora a janela de `HORAS_EXPIRACAO` (um relato feito depois do prazo é outro evento, e uma ocorrência já `RESOLVIDA` precisa aceitar um relato novo do mesmo tipo). Gravar toda linha e fundir depois, numa rotina: até a rotina rodar, a consulta mostraria a duplicata, e a confirmação do vizinho cairia na linha errada.

*Solução.* A regra ficou em `OcorrenciaService.registrar`, na mesma transação do `INSERT`. O serviço procura ocorrência `ATIVA` daquele tipo e daquele bairro cuja última confirmação ainda está dentro das horas do tipo. Se encontra, grava uma linha em `CONFIRMACAO` com tipo `CONFIRMA` e soma 1 em `CONFIRMACOES`. Se não encontra, abre a ocorrência, grava o autor e a primeira confirmação, com o contador em 1. A mesma pessoa não entra de novo: `ID_AUTOR` e a chave de `CONFIRMACAO` recusam o segundo retorno.

**Problema 2: aviso de água disparado de novo para a mesma estação.** Quando a falta de luz do Arquipélago recebe a confirmação de outra pessoa, a ETA daquele bairro fica sem energia e os bairros que ela abastece precisam ser avisados. Se o aviso nascesse a cada confirmação, Menino Deus, Praia de Belas e Centro Histórico receberiam o mesmo alerta várias vezes, uma para cada vizinho.

*Alternativas avaliadas.* Procurar um `ALERTA` já ligado àquela `OCORRENCIA`: segura uma ocorrência, mas deixa passar a seguinte (outra falta de luz no mesmo bairro, com a estação ainda sem energia, geraria outro aviso). Contar as linhas de `NOTIFICACAO`: a trava ficaria na mensagem, e uma pessoa que passasse a seguir o bairro depois reabriria o disparo. Avisar no primeiro relato, antes de um vizinho confirmar: o aviso sairia sem o retorno que o produto usa como confirmação.

*Solução.* O disparo ficou em `CascataService`, chamado por `OcorrenciaService` quando uma confirmação nova entra numa falta de luz ativa. A consulta só traz estação `ABASTECIMENTO` que ainda está `OPERANDO` no bairro da ocorrência; a drenagem do Bom Jesus nem entra. A trava é o próprio `UPDATE`: a linha só muda para `SEM_ENERGIA` se o status ainda for `OPERANDO`. A transação que altera a linha cria um `ALERTA` de origem `CASCATA`, liga os bairros de `ESTACAO_BAIRRO` e pede ao `NotificacaoService` um aviso por pessoa que segue algum desses bairros. Quem segue dois deles recebe uma notificação. A confirmação, a mudança da estação, o alerta e as notificações são gravados juntos.

---

## 11. Testes e validação

### 11.1 Validação com usuários

Para validar o protótipo, foi planejado um teste de usabilidade com 5 a 8 moradores, de preferência com ao menos duas pessoas de Sarandi ou Menino Deus e uma com 60 anos ou mais. Cada participante usa o protótipo navegável no Figma, presencialmente ou por videochamada, e realiza seis tarefas sem ajuda. A equipe anota se a pessoa conseguiu (1), conseguiu com ajuda (0,5) ou não conseguiu (0).

| Tarefa | O que pedir | Sucesso quando… |
| --- | --- | --- |
| T1 | Registre que está sem luz no seu bairro. | Chega ao botão Reportar, escolhe o tipo e envia em até 2 toques. |
| T2 | Confirme que o relato de um vizinho também está acontecendo aí. | Toca em “Ainda está”. |
| T3 | Veja o alerta de cascata e diga o que ele significa e o que faria. | Entende que pode faltar água e cita uma ação (ex.: encher recipientes). |
| T4 | Siga o bairro da casa da sua mãe com o apelido “casa da mãe”. | Adiciona o bairro e o apelido sem ajuda. |
| T5 | Descubra para quem ligar se faltar água. | Encontra o contato da Prefeitura (156) no alerta de falta de água. |
| T6 | A luz voltou. Marque que já voltou. | Usa a opção “Já voltou”. |

**Medidas registradas:** taxa de sucesso por tarefa e geral, tempo total, facilidade de uso (1 a 5), clareza do alerta (1 a 5) e se a pessoa entendeu a cascata (sim, em parte ou não). A média da facilidade de uso alimenta o indicador I11 (seção 12.3), com meta de 4,0 de 5.

O teste foi planejado, mas ainda não foi aplicado com moradores reais (ver seção 11.4).

### 11.2 Resultado das hipóteses

| Hipótese | Resultado | Evidência |
| --- | --- | --- |
| H1: temporais comuns também deixam bairros sem água | Confirmada | Dados públicos (seção 2.4) |
| H2: o risco se concentra em poucos bairros | Confirmada | Análise estatística (seção 12.1) |
| H3: os moradores entendem o alerta em cascata | A validar | Tarefa T3 do teste planejado (seção 11.1) |

### 11.3 Testes realizados

**Teste de acessibilidade (contraste).** No teste do app no Chrome de uma integrante da equipe, o texto de todos os links aparecia escuro sobre o roxo, com contraste de 2,1:1.

1. **O que vimos:** o botão Reportar, a faixa do efeito cascata, “Abrir mapa” e o item ativo do menu ficavam com texto quase preto. Textos que não eram links ficavam certos.
2. **Causa:** uma extensão do navegador (LocatorJS) injetava uma regra que pintava todo link de escuro, e essa regra vencia as cores do app.
3. **Correção:** as cores do tema passaram a ter prioridade sobre estilos de fora da página, e o texto sobre roxo e verde ganhou o branco como garantia. O texto voltou a 7,7:1.
4. **Verificação:** simulamos uma regra externa que pinta todo link de preto. Mesmo com ela, o Reportar continuou branco e o “Abrir mapa” continuou roxo.

No mesmo teste, o verde de destaque estava no limite, com 4,5:1, e foi escurecido para `#27704C`, que dá 6,0:1.

**Execução do sistema em Java.** Os quatro casos de uso rodados no menu de console (registrar relatos, consultar as ocorrências ativas de um bairro e marcar que o serviço voltou), com os prints de cada um, estão na seção 10.2. A gravação dos dados no banco aparece na seção 10.3.

### 11.4 Limitações identificadas

**Validação**

- O teste de usabilidade com moradores foi planejado, mas ainda não foi aplicado. A distância da equipe em relação a Porto Alegre e o prazo do projeto limitaram a aplicação, então ainda não há resultados de facilidade de uso nem de compreensão do alerta em cascata.
- A acessibilidade foi verificada por contraste e por uso do teclado, mas ainda não foi testada com leitores de tela reais (VoiceOver e TalkBack) nem com pessoas idosas ou com baixa visão.

**Dados**

- A análise usa os dados públicos da cheia de 2024, que mostram quem foi atingido, mas não quantas vezes nem por quanto tempo faltou luz ou água em cada bairro. Essa informação só existirá com os relatos do app em uso.
- O vínculo entre cada estação de bombeamento e os bairros que ela abastece foi cadastrado à mão para a demonstração, a partir de notícias e avisos do DMAE.
- Os dados exibidos no protótipo (alertas, nível do Guaíba e números do painel) são simulados.

**Sistema**

- A expiração automática das ocorrências não foi implementada: uma ocorrência sem confirmação não é encerrada sozinha.
- O cadastro de usuários com nome e celular ainda não foi implementado; os três moradores da demonstração já vêm cadastrados no banco.
- Não há integração com fontes oficiais de chuva e do nível do Guaíba, nem envio de alertas por notificação no celular ou por SMS. Na demonstração, os alertas ficam gravados no banco.
- O sistema em Java roda por menu de console; as telas existem apenas no protótipo.

**Acessibilidade e inclusão**

- O mapa ainda não tem uma versão em lista para quem não enxerga o desenho, e os alertas ainda não são lidos em voz alta.
- Não há tema escuro nem modo de alto contraste.

O que está previsto para resolver essas limitações aparece na seção 16.3 (Próximos passos).

---

## 12. Dados e indicadores

### 12.1 Dados coletados e análise estatística

**Escolha dos bairros analisados.** Foram escolhidos Sarandi e Menino Deus a partir do painel “Áreas Afetadas - Porto Alegre”, da Prefeitura, pelos seguintes motivos:

- **São os dois bairros com mais moradores afetados** (1º e 2º entre 46), então o impacto do alerta seria maior.
- **Menino Deus faz parte do piloto** do Alertaí. **Sarandi** foi incluído na análise por ser o bairro com mais moradores afetados da cidade e por constar no aviso do DMAE sobre falta de energia nas estações (PORTO ALEGRE, 2022); é candidato natural à próxima etapa do piloto.
- **São muito diferentes entre si**, o que testa a ideia em dois contextos: Sarandi é extenso, de casas e comércio de rua; Menino Deus é denso, de prédios e serviços.

| Indicador | Sarandi | Menino Deus | Razão (S ÷ MD) |
| --- | --- | --- | --- |
| Moradores em área afetada | 26.042 | 18.231 | 1,4x |
| População total (Censo 2022) | 51.539 | 27.961 | 1,8x |
| % dos moradores afetados | 50,5% | 65,2% | 0,8x |
| Área alagada (km²) | 18,66 | 1,44 | 13,0x |
| Moradores afetados por km² | 1.396 | 12.660 | 0,1x |
| Edificações afetadas | 8.172 | 1.952 | 4,2x |
| Empresas afetadas | 2.559 | 1.384 | 1,8x |
| Microempresas (% das empresas) | 86,8% | 64,2% | 1,4x |
| Escolas afetadas | 26 | 16 | 1,6x |
| Unidades de saúde afetadas | 5 (4 UBS + 1 farmácia) | 2 (hospital + 1 unidade) | — |

*Fonte: painel da Prefeitura (PORTO ALEGRE, [2024]) e Censo 2022 (IBGE; PORTO ALEGRE, [s.d.]). Empresas: campo “bairro” do cadastro de CNPJ no painel, que pode diferir do limite oficial do bairro.*

![](attachment:cebd7a20-8389-43cf-bc1a-e6f2568b0e8b:cebd7a20-8389-43cf-bc1a-e6f2568b0e8b.png)

*Figura 1. Proporção da população residente em área afetada.*

**Análise dos 46 bairros atingidos.** Base: 46 bairros atingidos pela cota de 5,35 m. Variável analisada: moradores em área afetada por bairro.

| Medida | Valor | Leitura |
| --- | --- | --- |
| Total de moradores afetados | 160.210 | 12,0% da cidade |
| Média por bairro | 3.483 | puxada por poucos bairros |
| Mediana por bairro | 1.371 | metade dos bairros tem menos que isso |
| Desvio-padrão | 5.465 | maior que a média |
| Coeficiente de variação | 157% | distribuição muito desigual |
| Máximo / mínimo | 26.042 / 6 | Sarandi / Jardim Isabel |
| 3 maiores bairros concentram | 38,6% | Sarandi, Menino Deus, Farrapos |
| 5 maiores bairros concentram | 52,3% | mais da metade |
| 10 maiores bairros concentram | 73,3% | quase três quartos |
| Bairros com 50% ou mais dos moradores afetados | 15 de 46 | 33% dos bairros |
| Bairros com 90% ou mais dos moradores afetados | 7 de 46 | ex.: Arquipélago (100%), Praia de Belas (99,5%) |
| Correlação (r) afetados × edificações afetadas | 0,89 | forte (n = 39 bairros com registro) |
| Correlação (r) afetados × população total do bairro | 0,38 | fraca: tamanho não explica exposição |

![](attachment:cf63ad52-a4b5-4765-82f9-69cab2b2905a:cf63ad52-a4b5-4765-82f9-69cab2b2905a.png)

*Figura 2. Os 10 bairros com mais moradores afetados. Sarandi e Menino Deus em destaque.*

![](attachment:ad05a94f-1e70-4fa2-9ac9-d0012caeea29:ad05a94f-1e70-4fa2-9ac9-d0012caeea29.png)

*Figura 3. Concentração: a linha mostra o percentual acumulado de moradores afetados.*

![](attachment:6f5ad5aa-ff42-4b74-a275-f7ed92a75c8d:6f5ad5aa-ff42-4b74-a275-f7ed92a75c8d.png)

*Figura 4. Relação entre moradores afetados e edificações afetadas (r = 0,89).*

![](attachment:44835390-a488-4a65-9c6b-2754f3fb07df:44835390-a488-4a65-9c6b-2754f3fb07df.png)

*Figura 5. Perfil das empresas em área afetada nos dois bairros (% do total de cada bairro). Fonte: camada de empresas afetadas do painel da Prefeitura, consultada em 14/11/2026.*

### 12.2 Interpretação dos resultados

- **O problema é concentrado.** Com média muito acima da mediana e desvio-padrão maior que a média, a distribuição é assimétrica: poucos bairros têm quase tudo. Um piloto em poucos bairros já alcança a maior parte do risco.
- **Bairro grande não é bairro mais exposto.** A correlação com a população total é fraca (r = 0,38). O que define a exposição é a localização na várzea: 7 bairros têm 90% ou mais dos moradores afetados, entre eles Arquipélago, Praia de Belas, Farrapos e Humaitá.
- **Dois perfis diferentes de impacto.** Sarandi tem mais gente afetada, mas Menino Deus tem a maior proporção atingida (65% dos moradores) e uma densidade de afetados cerca de 9 vezes maior por km². Em Sarandi pesam as 8.172 edificações afetadas e o comércio de rua: 28,8% das empresas são do comércio e 86,8% são microempresas, com pouca folga financeira para perder estoque. Em Menino Deus predominam serviços administrativos (20,7%) e profissionais (14,4%).
- **O painel é consistente.** A correlação alta entre moradores e edificações (r = 0,89) indica que os dados se comportam como esperado.
- **Limite da análise.** O painel mostra quem foi atingido pela cheia de 2024. Ele não mostra quantas vezes faltou luz ou água, nem por quanto tempo. Isso só será conhecido com os relatos do app no piloto (indicador I3).

### 12.3 Indicadores para acompanhar o impacto

Os indicadores de plataforma saem das tabelas `OCORRENCIA`, `CONFIRMACAO`, `NOTIFICACAO` e `ALERTA` do modelo de dados.

| Cód. | Indicador | Fórmula | Meta no piloto | ODS |
| --- | --- | --- | --- | --- |
| I1 | Tempo médio entre o primeiro relato e a confirmação | média de (1ª confirmação − relato), em min | ≤ 15 min | 11 |
| I2 | Taxa de ocorrências resolvidas | resolvidas ÷ registradas × 100 | ≥ 60% | 11 |
| I3 | Duração média da falta de luz e de água | média de (1º relato → “já voltou”) por bairro | −10% | 6 |
| I4 | Tempo médio de resposta do alerta | média de (notificação − 1º relato confirmado), em min | ≤ 2 min | 11 |
| I5 | Antecedência do alerta de cascata | média de (1ª falta de água − alerta), em horas | ≥ 2 h | 6 |
| I6 | Precisão do alerta de cascata | alertas seguidos de falta de água ÷ alertas × 100 | ≥ 70% | 6, 13 |
| I7 | Taxa de abertura dos alertas | notificações lidas ÷ enviadas × 100 | ≥ 50% | 11 |
| I8 | Ação tomada após o alerta | usuários que declaram ter agido ÷ respondentes da pesquisa rápida no app | ≥ 40% | 6, 13 |
| I9 | Cobertura nos bairros do piloto | usuários ÷ moradores afetados × 1.000 | ≥ 5 por 1.000 | 11 |
| I11 | Facilidade de uso do protótipo | média das notas no teste com usuários | ≥ 4,0 de 5 | 11 |

Todos os indicadores só podem ser medidos com o app em uso ou com o teste de usabilidade aplicado, e por isso constam como “a medir no piloto”. Referências de hoje: média nacional de 10,24 h sem energia elétrica em 2024 (CONSUMIDORES…, 2025) e mais de 60 h sem água após o temporal de janeiro de 2024 (TATSCH, 2024).

**Indicador central:** a antecedência do alerta de cascata, ou seja, o tempo entre a queda de luz e a falta de água por bairro (I5). É ele que mede o efeito cascata e justifica o alerta antecipado.

---

## 13. Objetivos de Desenvolvimento Sustentável (ODS)

O Alertaí se conecta a quatro Objetivos de Desenvolvimento Sustentável da ONU. Para cada um, indicamos a meta específica e como a solução contribui para ela (NAÇÕES UNIDAS NO BRASIL, [s.d.]; ORGANIZAÇÃO DAS NAÇÕES UNIDAS, [s.d.]).

| ODS | Meta | Como o Alertaí contribui |
| --- | --- | --- |
| **11. Cidades e comunidades sustentáveis** | **11.5:** até 2030, reduzir significativamente o número de mortes e de pessoas afetadas por catástrofes, incluindo os desastres relacionados à água, com foco em proteger as pessoas em situação de vulnerabilidade | Avisa os moradores, por bairro e com antecedência, sobre alagamentos, cheias e a falta de água que vem depois da queda de luz. Isso reduz o número de pessoas pegas de surpresa. O foco nas populações vulneráveis segue diretamente o que a meta pede. |
| **13. Ação contra a mudança global do clima** | **13.1:** reforçar a resiliência e a capacidade de adaptação a riscos relacionados ao clima e às catástrofes naturais. **13.3:** melhorar a conscientização e a capacidade humana sobre adaptação, redução de impacto e alerta precoce da mudança do clima | Os eventos extremos em Porto Alegre tendem a se repetir com o El Niño. O alerta antecipado e as orientações de “o que fazer agora” ajudam as famílias a se adaptar e a agir antes do impacto. O histórico por bairro mostra onde o problema se repete. |
| **3. Saúde e bem-estar** | **3.d:** reforçar a capacidade para o alerta precoce, a redução e o gerenciamento de riscos de saúde | Ficar sem água ou sem energia é um risco de saúde, principalmente para pessoas acamadas, idosos e quem depende de aparelhos elétricos de saúde. O aviso antecipado dá tempo de guardar água e se organizar. |
| **6. Água potável e saneamento** | **6.b:** apoiar e fortalecer a participação das comunidades locais para melhorar a gestão da água e do saneamento | Os moradores passam a informar e confirmar a falta de água no próprio bairro. Isso gera um registro coletivo que mostra onde e por quanto tempo o abastecimento falha, uma informação útil para a comunidade e para quem gere o serviço. |

---

## 14. Acessibilidade, inclusão, segurança e proteção de dados

### 14.1 Acessibilidade

O Alertaí segue as regras de nível AA da WCAG 2.1 (W3C, 2018): todo texto passa no contraste mínimo, a gravidade nunca é mostrada só pela cor e o app funciona pelo teclado e com texto ampliado. Doze cuidados estão no app em React e no protótipo do Figma, cada um ligado a um critério da WCAG.

| Cuidado | Como aplicamos no Alertaí | Critério WCAG |
| --- | --- | --- |
| Contraste de texto | Todo texto tem pelo menos 4,5:1 com o fundo; o menor valor do app é 5,0:1 | 1.4.3 Contraste (AA) |
| Cor nunca sozinha | A gravidade sempre aparece escrita (Atenção, Perigo, Grande perigo) ao lado da cor | 1.4.1 Uso de cor (A) |
| Ícones com nome | Todo ícone vem com texto; ícones decorativos ficam escondidos do leitor de tela | 1.1.1 Conteúdo não textual (A) |
| Texto maior | Opção “Texto maior” aumenta todas as letras do app em 12,5%, sem quebrar o layout | 1.4.4 Redimensionar texto (AA) |
| Fonte legível | Figtree no texto: 16 px no corpo, 14 px nas listas, 12 px nas legendas e 11 px nos nomes da barra de navegação; Sora só nos títulos | Boa prática |
| Uso pelo teclado | Botões, links, bairros do mapa e opções do relato funcionam com Tab, Enter e espaço | 2.1.1 Teclado (A) |
| Foco visível | Contorno verde de 3 px em tudo que recebe foco, com 5,5:1 contra o fundo | 2.4.7 Foco visível (AA) |
| Pular para o conteúdo | Link “Pular para o conteúdo” aparece ao apertar Tab no começo da página | 2.4.1 Pular blocos (A) |
| Nomes para leitor de tela | Mapa, medidor do Guaíba e botões de ícone têm descrição falada (ex.: “Menino Deus: 3 alertas, Perigo”) | 4.1.2 Nome, função, valor (A) |
| Alvos de toque grandes | Botões principais, itens de lista e barra de navegação com 44 px ou mais; filtros do mapa com 32 px, acima do mínimo de 24 px | 2.5.8 Tamanho do alvo (WCAG 2.2, AA) (W3C, 2023) |
| Linguagem simples | Frases curtas e diretas, sem jargão técnico (“Ainda está”, “Já voltou”, “O que fazer”) | 3.1.5 Nível de leitura (AAA) |
| Menos movimento | Animações desligadas para quem ativa “Reduzir movimento” no sistema | 2.3.3 Animação por interação (AAA) |

O app também declara o idioma português na página, para o leitor de tela pronunciar certo (critério 3.1.1).

**Contraste medido.** As 13 combinações de cor do app passam no nível AA. O pior caso é o selo Resolvido, com 5,0:1, acima do mínimo de 4,5:1. As razões foram calculadas pela fórmula de luminância relativa da WCAG 2.1.

| Onde aparece | Texto | Fundo | Contraste | Resultado |
| --- | --- | --- | --- | --- |
| Texto principal em cartão | `#221B33` | `#FFFFFF` | 16,5:1 | AAA |
| Texto principal | `#221B33` | `#F6F3FB` | 15,0:1 | AAA |
| Selo Atenção | `#3A2C00` | `#F2C230` | 8,1:1 | AAA |
| Botão Reportar | `#FFFFFF` | `#5B3FA8` | 7,7:1 | AAA |
| Link em cartão | `#5B3FA8` | `#FFFFFF` | 7,7:1 | AAA |
| Texto secundário em cartão | `#5D5470` | `#FFFFFF` | 7,1:1 | AAA |
| Texto secundário | `#5D5470` | `#F6F3FB` | 6,4:1 | AA |
| Link e menu ativo | `#5B3FA8` | `#ECE6F8` | 6,3:1 | AA |
| Faixa do efeito cascata | `#FFFFFF` | `#27704C` | 6,0:1 | AA |
| Selo Perigo | `#2B1200` | `#E8731C` | 5,8:1 | AA |
| Selo Grande perigo | `#FFFFFF` | `#C62828` | 5,6:1 | AA |
| Contorno de foco (3 px) | `#27704C` | `#F6F3FB` | 5,5:1 | AA (mínimo 3:1) |
| Selo Resolvido | `#FFFFFF` | `#2E7D4F` | 5,0:1 | AA |

O teste que encontrou e corrigiu um problema de contraste está na seção 11.3.

**Ainda não testado ou previsto.** Testar com leitor de tela de verdade (VoiceOver no iPhone e TalkBack no Android); validar com pessoas idosas e com baixa visão, junto com o teste com usuários; oferecer o mapa também como lista de bairros, para quem não enxerga o desenho; ler os alertas em voz alta; criar um tema escuro e um modo de alto contraste.

### 14.2 Inclusão

O Alertaí foi pensado para que qualquer morador consiga usá-lo e se beneficiar dele, inclusive quem tem pouca familiaridade com tecnologia ou está em situação de maior vulnerabilidade.

**No protótipo**

- **Cadastro simples:** basta informar o nome e o número de celular, sem formulários longos nem documentos.
- **Relato simples, para qualquer pessoa:** basta escolher o tipo do problema e enviar. Bairro, gravidade e descrição são opcionais, então ninguém deixa de relatar por não saber preencher um formulário.
- **Linguagem simples nos alertas:** cada aviso diz o que está acontecendo, por que está acontecendo e o que fazer agora, sem termos técnicos.
- **Gravidade que todos reconhecem:** a escala usa as mesmas cores dos avisos do INMET (amarelo, laranja e vermelho), que o público já conhece, e sempre traz a palavra escrita: Atenção, Perigo ou Grande perigo.
- **Contatos certos para cada caso:** cada alerta mostra a quem recorrer, como Defesa Civil (199), Bombeiros (193), SAMU (192) e Prefeitura (156), com uma linha explicando quando ligar para cada um.
- **Acompanhar quem importa:** o morador pode seguir bairros onde não mora, como a casa de um familiar idoso, e assim ser avisado a tempo de ajudar.
- **Participação sem exposição:** o nome de quem relata não aparece para os outros usuários, o que deixa as pessoas mais à vontade para participar.

**Previsto para a versão completa**

- **Alertas por SMS para quem estiver sem internet:** quem quiser pode autorizar, de forma opcional, o recebimento dos alertas por mensagem de texto no número cadastrado. A tela já prevê o aceite, mas o envio ainda não foi implementado.
- **Prioridade para casas mais vulneráveis:** com um perfil opcional (pessoa acamada, idosa ou que depende de aparelho elétrico de saúde), o app poderia priorizar o aviso e adaptar as orientações. O banco de dados já tem os campos para isso, mas o perfil ainda não aparece nas telas.

### 14.3 Segurança

Os cuidados de segurança do Alertaí cobrem três frentes: a segurança do sistema, a confiabilidade dos alertas e a segurança de quem usa o app. A proteção dos dados pessoais é tratada separadamente, na seção 14.4.

**Segurança do sistema (implementado no protótipo em Java)**

- **Credenciais fora do código:** o endereço, o usuário e a senha do banco de dados são lidos de variáveis de ambiente ou de um arquivo `.env`, que fica fora do repositório. Assim, nenhuma senha é publicada no GitHub.
- **Proteção contra SQL injection:** todas as consultas que recebem dados do usuário usam `PreparedStatement`, com parâmetros, e nunca montam o comando SQL juntando textos digitados.
- **Transações com desfazer automático:** cada operação acontece numa transação. Se qualquer etapa falhar, tudo é desfeito (*rollback*), e o banco nunca fica num estado incoerente, como uma estação marcada “sem energia” sem o alerta correspondente.
- **Validação em duas camadas:** o sistema recusa valores inválidos antes de gravar (gravidade fora de 1 a 3, descrição com mais de 500 caracteres, campos obrigatórios vazios), e o banco reforça as mesmas regras com restrições (`CHECK` e `UNIQUE`).

**Confiabilidade dos alertas (contra trotes e alarmes falsos)**

- **Cadastro obrigatório com nome e número de celular:** cada pessoa tem uma conta ligada ao seu número, que é o principal identificador. Isso dificulta relatos e confirmações falsas e garante que cada morador conte uma única vez. Essa etapa ainda não está implementada: a demonstração em Java é um protótipo, sem tela de cadastro nem login, e os três moradores usados nos testes já vêm cadastrados no banco de dados. A confirmação do número por código SMS está prevista para a versão completa.
- **Um relato sozinho não dispara alerta:** o aviso de possível falta de água só é gerado quando outra pessoa confirma a falta de luz.
- **Uma pessoa, um voto:** a mesma pessoa não consegue confirmar duas vezes a mesma ocorrência, nem como autora nem como confirmadora. O banco também impede essa repetição.
- **Encerramento coletivo:** uma ocorrência só é encerrada quando três pessoas diferentes informam que o serviço voltou.
- **Alerta sem repetição:** o aviso da cascata é gerado uma única vez por estação, evitando que o morador receba o mesmo alerta várias vezes.

**Segurança de quem usa o app**

- O Alertaí orienta, mas não substitui os canais oficiais: cada alerta traz os contatos certos para o caso, como a Defesa Civil (199).

**Cuidados previstos para a versão completa**

- Comunicação criptografada (HTTPS) entre o app e o servidor.
- Reputação dos usuários, dando mais peso a quem relata com precisão. O campo já existe no banco, mas a regra ainda não foi implementada.
- Limite de relatos por pessoa num intervalo de tempo, para conter abusos.

### 14.4 Proteção de dados (LGPD)

O Alertaí segue os princípios da Lei Geral de Proteção de Dados Pessoais, a LGPD (BRASIL, 2018). Os mais importantes para o projeto são três: coletar só o necessário para o app funcionar, usar cada dado apenas para a finalidade informada e dar ao usuário controle sobre o que é dele.

**Dados coletados, finalidade e tratamento**

| Dado | Finalidade | Tratamento |
| --- | --- | --- |
| Nome e número de celular (cadastro) | Identificar cada usuário, para que cada pessoa conte uma única vez nas confirmações e para dificultar relatos falsos | Obrigatórios no cadastro. Não aparecem para outros usuários. O número é único: não existem duas contas com o mesmo celular |
| Bairros seguidos e apelidos (“casa”, “trabalho”) | Enviar os alertas apenas para quem acompanha o bairro afetado | Visíveis só para o próprio usuário. Apagados junto com a conta |
| Relatos (tipo, bairro, gravidade, descrição opcional, data e hora) | Montar as ocorrências do bairro e disparar o efeito cascata | O mapa mostra só o bairro, nunca o endereço. O autor fica registrado apenas para evitar confirmação repetida e não aparece para ninguém |
| Confirmações (“Ainda está” e “Já voltou”) | Manter a ocorrência atualizada e encerrá-la quando o serviço volta | Usadas só em contagem; quem confirmou não aparece |
| Notificações recebidas e lidas | Entregar os alertas e medir se eles são abertos (indicador I7) | Ligadas ao usuário, apagadas junto com a conta e usadas nos indicadores apenas de forma agregada |
| Aceite para receber SMS (previsto) | Enviar alertas por mensagem para quem estiver sem internet | Opcional, registrado com data e hora, e pode ser cancelado a qualquer momento |

**Dados sensíveis.** O modelo de dados já prevê um perfil opcional da casa: se mora pessoa idosa, se alguém depende de aparelho elétrico de saúde e se a rua costuma alagar. A informação sobre aparelho de saúde é dado pessoal sensível pela LGPD e só pode ser tratada com consentimento específico e destacado. Por isso esse perfil é opcional, tem a data do consentimento registrada (campo `CONSENTIMENTO_EM`) e ainda não aparece nas telas. Antes de ser oferecido, precisa de uma tela própria explicando para que serve e como apagar.

**Direitos do usuário.** O usuário deve poder consultar os próprios dados, corrigi-los, cancelar o aceite de SMS e excluir a conta. O protótipo já oferece a opção “Excluir minha conta e meus dados” na tela Meus bairros. No sistema em Java, a exclusão completa ainda está prevista; os bairros seguidos e as notificações já são apagados junto com o usuário (`ON DELETE CASCADE`).

**Uso dos dados para análise.** Os indicadores e o painel do bairro usam apenas números agregados por bairro e por tipo de ocorrência, sem identificar pessoas.

---

## 15. Organização do trabalho com métodos ágeis

**Como o trabalho começou.** Na segunda-feira, 9 de novembro, a equipe fez uma reunião pelo Google Meet para definir o tema, o problema a resolver e o escopo do projeto. Na mesma reunião, o trabalho foi dividido por área, com um responsável e um prazo para cada uma:

| Área | Responsável |
| --- | --- |
| Coleta de dados e indicadores | Brenda |
| Modelagem, banco de dados e sistema Java | Vinícius |
| Prototipação e interface | Ana Larissa |
| Documentação e entrega | João Pedro |
| Roteiro, slides e vídeos | John |

**Método.** A equipe usou um quadro Kanban no Linear, com as colunas Backlog, In Progress e Done. Cada parte do enunciado virou um card com quatro informações:

- **Rastro:** o trecho do enunciado que o card atende;
- **Critério de aceitação:** o que precisa existir para o card ser considerado pronto;
- **Responsável e prazo;**
- **Dependências:** quais cards precisam terminar antes. Por exemplo, a descrição da solução só começa depois que o problema está definido.

Os 32 cards foram agrupados em seis marcos (milestones), em sequência, cada um com uma data:

| Milestone | Prazo | Cards |
| --- | --- | --- |
| Java e banco | 11/11 | 9 |
| Dados e indicadores | 13/11 | 6 |
| Interface | 13/11 | 3 |
| Documentação | 16/11 | 9 |
| Vídeos | 17/11 | 2 |
| Envio | 18/11 | 3 |

**Comunicação.** O acompanhamento do dia a dia foi feito pelo WhatsApp do grupo, onde cada integrante avisava o que tinha terminado e o que estava travando a sua parte. O código ficou no GitHub, com branches e pull requests revisados antes de entrar na versão principal.

**Evolução do quadro.**

![](attachment:fd6ee097-4a6e-4ca8-860e-391bdcfc5db3:fd6ee097-4a6e-4ca8-860e-391bdcfc5db3.png)

*Visão geral do projeto no Linear, com os seis milestones: 9 de 32 cards concluídos.*

![](attachment:33abd48b-76af-4077-852c-8385cff09e20:33abd48b-76af-4077-852c-8385cff09e20.png)

*Quadro com os cards de Java e banco concluídos e os de documentação no Backlog.*

![](attachment:c7621b9f-fb3f-4836-863a-d5e2ec09e863:c7621b9f-fb3f-4836-863a-d5e2ec09e863.png)

*Quadro com 14 cards concluídos e a documentação em andamento.*

![](attachment:acb8b35c-9aca-4ff9-a177-bba74ca2dd2f:acb8b35c-9aca-4ff9-a177-bba74ca2dd2f.png)

*Lista de cards com 25 de 32 concluídos; os milestones Java e banco, Dados e indicadores e Interface chegam a 100%.*

![](attachment:7573e1dc-f051-4167-9adb-c49fb7d7ecc1:7573e1dc-f051-4167-9adb-c49fb7d7ecc1.png)

*Quadro final, com os 32 cards concluídos.*

![](attachment:fc2330f7-aa3f-4604-97a1-958014ddaa60:fc2330f7-aa3f-4604-97a1-958014ddaa60.png)

*Exemplo de card (“Problema real identificado”), com o rastro no enunciado, os critérios de aceitação, o responsável, o prazo e as dependências.*

---

## 16. Evolução do projeto

### 16.1 Linha do tempo

| Data | O que aconteceu |
| --- | --- |
| 09/11 | Reunião no Google Meet: definição do tema, do problema e do escopo; divisão das tarefas por área |
| 10/11 | Criação do repositório no GitHub e dos 32 cards no Linear. Arquitetura e modelo de dados desenhados antes do código. O esqueleto inicial em Spring foi trocado por um menu de console em Java, mais simples para a demonstração. No mesmo dia, o sistema passou a gravar no Oracle, agrupar relatos repetidos e disparar a cascata. O projeto, chamado provisoriamente de “Alerta Bairro POA”, ganhou o nome Alertaí |
| 11/11 | Milestone “Java e banco” concluído: especificação, conceitos do curso e problemas técnicos documentados |
| 12/11 | Coleta e análise dos dados públicos sobre a cheia de 2024 |
| 13/11 | Protótipo navegável e marca (paleta Jacarandá e logotipo Ponto de alerta) publicados no repositório. Wireframes, fluxo da aplicação e documento de acessibilidade concluídos. Início da documentação |
| 14/11 | Revisão da análise de dados e conferência das fontes. Para evitar relatos e confirmações falsas, o grupo decidiu tornar o cadastro obrigatório, com nome e celular, e a alteração no banco foi enviada por pull request. O protótipo foi atualizado com os dados do cadastro e a opção de excluir a conta |
| 16/11 a 18/11 | Vídeos (pitch e técnico) e envio |

### 16.2 Planejado x construído x apresentado

| Item | Planejado | Construído |
| --- | --- | --- |
| Banco de dados | 13 tabelas | 13 tabelas, com chaves, restrições e dados do piloto |
| Regras do sistema | Agrupar relatos, confirmar, encerrar, expirar e disparar a cascata | Todas, menos a expiração automática |
| Interface | App com telas para o morador | Protótipo navegável no Figma e em React, com dados simulados; o sistema Java roda por menu de console |
| Cadastro | Obrigatório, com nome e celular | Ainda não implementado: os moradores da demo já vêm cadastrados; o banco passou a exigir o telefone |
| Dados oficiais, push e SMS | Integração com fontes oficiais e avisos no celular | Não implementados; previstos como evolução |
| Validação | Teste com moradores | Teste de usabilidade planejado (não aplicado) e teste de acessibilidade realizado |
| Análise de dados | Evidências e indicadores | Análise de 46 bairros, comparação Sarandi x Menino Deus e 10 indicadores |

> ⚠️ **ESCREVER AQUI DEPOIS DOS VÍDEOS (João):** um parágrafo curto sobre o que foi apresentado no pitch e no vídeo técnico.
> 

### 16.3 Próximos passos

- Implementar a tela de cadastro e a confirmação do celular por código SMS.
- Implementar a expiração automática das ocorrências.
- Integrar dados oficiais de chuva e do nível do Guaíba.
- Enviar alertas por notificação no celular e por SMS.
- Aplicar o teste de usabilidade com moradores, incluindo pessoas idosas.
- Ampliar o piloto para outros bairros, começando pelo Sarandi.

---

## 17. Vídeos

- Pitch (até 3 min): [link] ⚠️ **INSERIR LINK (John)**
- Vídeo técnico (até 2 min): [link] ⚠️ **INSERIR LINK (John)**

---

## 18. Referências

BRASIL. **Lei nº 13.709, de 14 de agosto de 2018**. Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF: Presidência da República, 2018. Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm. Acesso em: 14 nov. 2026.

CHEIA histórica: nível do Guaíba ultrapassa 5 metros em Porto Alegre. **Rede Onda Digital**, 4 maio 2024. Disponível em: https://redeondadigital.com.br/nacional/cheia-historica-nivel-do-rio-guaiba-ultrapassa-5-metros-em-porto-alegre. Acesso em: 13 nov. 2026.

CLIMATE PREDICTION CENTER (NOAA). **El Niño/Southern Oscillation (ENSO) Diagnostic Discussion**. College Park, 12 nov. 2026. Disponível em: https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.html. Acesso em: 13 nov. 2026.

CONSUMIDORES ficaram, em média, 10,24 horas sem energia no ano de 2024, mostra Aneel. **Folha de Pernambuco**, Recife, 2 abr. 2025. Estadão Conteúdo. Disponível em: https://www.folhape.com.br/economia/consumidores-ficaram-em-media-1024-horas-sem-energia-no-ano-de/401915/. Acesso em: 14 nov. 2026.

IBGE; PORTO ALEGRE. Prefeitura Municipal (ObservaPOA). **População residente por bairros, Censo 2022**. [s.d.]. Disponível em: http://prefeitura.poa.br/sites/default/files/usu_doc/hotsites/smpae/observapoa/Pop_Bairro_Censo_2022.csv. Acesso em: 12 nov. 2026.

INSTITUTO NACIONAL DE METEOROLOGIA (INMET). Painel El Niño: boletim de outubro é divulgado. **INMET**, Brasília, 29 out. 2026. Disponível em: https://portal.inmet.gov.br/noticias/painel-el-nino-boletim-de-outubro-e-divulgado. Acesso em: 13 nov. 2026.

MATOS, Fábio. Nível do Guaíba baixa mais 8 centímetros, e águas avançam menos sobre Porto Alegre. **InfoMoney**, 9 maio 2024. Disponível em: https://www.infomoney.com.br/?p=2456831. Acesso em: 13 nov. 2026.

NAÇÕES UNIDAS NO BRASIL. **Objetivos de Desenvolvimento Sustentável**. Brasília, [s.d.]. Disponível em: https://brasil.un.org/pt-br/sdgs. Acesso em: 13 nov. 2026.

ORGANIZAÇÃO DAS NAÇÕES UNIDAS (ONU). **Goal 11**: make cities and human settlements inclusive, safe, resilient and sustainable. Department of Economic and Social Affairs, [s.d.]. Disponível em: https://sdgs.un.org/goals/goal11. Acesso em: 13 nov. 2026.

PORTO ALEGRE. Departamento Municipal de Água e Esgotos (DMAE). Falta de energia elétrica pode afetar abastecimento de água em 51 bairros. Porto Alegre, 17 set. 2022. Disponível em: https://prefeitura.poa.br/dmae/noticias/falta-de-energia-eletrica-pode-afetar-abastecimento-de-agua-em-51-bairros. Acesso em: 14 nov. 2026.

PORTO ALEGRE. Prefeitura Municipal. **Áreas Afetadas - Porto Alegre**. Painel de dados sobre as inundações de 2024. [2024]. Disponível em: https://gis-smamus.portoalegre.rs.gov.br/portal/apps/dashboards/cc9a1fcb70ac404aa577989354c31b5c. Acesso em: 13 nov. 2026.

PORTO ALEGRE. Prefeitura Municipal. Defesa Civil acompanha evolução do El Niño e atualiza perspectivas climáticas para o Rio Grande do Sul. Porto Alegre, 22 out. 2026a. Disponível em: https://prefeitura.poa.br/defesa-civil/noticias/defesa-civil-acompanha-evolucao-do-el-nino-e-atualiza-perspectivas-climaticas. Acesso em: 13 nov. 2026.

PORTO ALEGRE. Prefeitura Municipal. Prefeitura mobiliza equipes para atendimento de ocorrências devido ao temporal desta segunda-feira. Porto Alegre, 21 set. 2026b. Disponível em: https://prefeitura.poa.br/defesa-civil/noticias/prefeitura-mobiliza-equipes-para-atendimento-de-ocorrencias-devido-ao. Acesso em: 13 nov. 2026.

TATSCH, Juliano. Com 22 Estações do Dmae paradas, 157,3 mil porto-alegrenses seguem sem água. **Jornal do Comércio**, Porto Alegre, 19 jan. 2024. Disponível em: https://www.jornaldocomercio.com/geral/2024/01/amp/1139742-com-22-ebats-paradas-ao-menos-1573-mil-porto-alegrenses-seguem-sem-agua.html. Acesso em: 13 nov. 2026.

W3C. **Web Content Accessibility Guidelines (WCAG) 2.1**. 2018. Disponível em: https://www.w3.org/TR/WCAG21/. Acesso em: 13 nov. 2026.

W3C. **Web Content Accessibility Guidelines (WCAG) 2.2**. 2023. Disponível em: https://www.w3.org/TR/WCAG22/. Acesso em: 13 nov. 2026.