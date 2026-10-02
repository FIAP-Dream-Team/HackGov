## Parte 1: Dados do Grupo

Apresentamos a seguir a composição da equipe responsável pela ideação e análise de requisitos do projeto **HackGov**.

**Integrantes do Projeto:**

- **Vinícius Cardoso Junqueira** – RM: 566906
- **Ana Larissa Cristo Mendes** – RM: 567403
- **João Pedro Thethê Andrade** – RM: 568305
- **John Vitor Silverio Pereira** – RM: 566968
- **Brenda Cristina Martins Araújo** – RM: 575032

## Parte 2 — Levantamento de Requisitos

### 2.1 Serviço público escolhido

Agendamento e acompanhamento de encaminhamentos do cidadão da atenção primária (UBS) para a atenção especializada, incluindo o agendamento de exames vinculados ao encaminhamento.

O gargalo identificado não é apenas a quantidade de especialistas disponíveis, mas a falta de um fluxo de referência rastreável entre a UBS e a atenção especializada: hoje o encaminhamento vira papel, ligação telefônica ou sistema paralelo, e o paciente "some" da vista tanto do cidadão quanto do gestor.

> **Por que esse recorte**
Uma auditoria do TCU apontou que a falta de alimentação padronizada de dados pelos estados no sistema centralizado do Ministério da Saúde é um gargalo relevante de visibilidade, prejudicando a transparência pública e a capacidade de o cidadão acompanhar sua própria solicitação. Uma pesquisa do Instituto Locomotiva mostrou ainda que 94% dos brasileiros da Classe C concordam que o tempo de espera no SUS coloca vidas em risco, e que cerca de 1 em cada 3 já desistiu de uma consulta demorada.
> 

### 2.2 Requisitos funcionais e não funcionais

Os cinco requisitos funcionais abaixo correspondem diretamente às telas e fluxos já desenhados para o MVP do Minha Vez (aplicação do cidadão, painel da sala de espera e canal web da equipe/gestor). Os dois requisitos não funcionais nascem das restrições definidas no brainstorm do grupo ("informação de fácil acesso para ambos os lados", "evitar escopos muito grandes") e da própria natureza sensível do dado tratado — informação clínica de saúde.

- **RF01 — Identificação sem senha:** o cidadão se identifica na aplicação por Cartão SUS ou CPF + data de nascimento, sem senha, reduzindo barreira de acesso.
- **RF02 — Acompanhamento do status:** o cidadão consulta a etapa atual do seu encaminhamento e agendamento a qualquer momento pela aplicação, resolvendo a "invisibilidade" da fila.
- **RF03 — Agendamento do horário:** o cidadão escolhe, entre horários disponíveis, a data e hora do exame ou da consulta especializada.
- **RF04 — Chamada na sala de espera:** o painel exibe a senha chamada e a sala, sem expor nome completo ou dado clínico — regra de cor amarela ("é a vez de alguém").
- **RF05 — Painel gerencial:** a equipe e o gestor visualizam a fila por especialidade, a ação pendente por paciente e indicadores de espera média e faltas.
- **RNF01 — Controle de acesso por perfil:** dado clínico e nome completo só aparecem no canal institucional (azul); nunca nas telas públicas.
- **RNF02 — Acessibilidade:** fonte grande, opção de aumentar letra e leitura da tela em voz alta, garantindo uso por idosos e pessoas com baixo letramento digital.

### 2.3 Tabela de requisitos

| # | Descrição do requisito | Tipo | Prioridade |
| --- | --- | --- | --- |
| RF01 | **(quando via totem físico)** Identificação do cidadão na aplicação por Cartão SUS + CPF + data de nascimento, sem exigir senha. 
**(quando via aplicativo)** 
Cadastro com login de **CPF** e **senha**, **OAuth**. | Funcional | Alta |
| RF02 | Acompanhamento, pelo cidadão, da etapa atual do encaminhamento (recebido e triado → agendar exame/consulta → concluído), disponível na aplicação, com a mesma informação em qualquer dispositivo. | Funcional | Alta |
| RF03 | Agendamento, pelo cidadão, do horário do exame ou da consulta com o especialista **entre os horários disponíveis** exibidos pelo sistema. | Funcional | Alta |
| RF04 | Exibição da senha chamada e da sala de atendimento no painel da sala de espera, sem exposição de nome completo ou dado clínico do paciente. | Funcional | Média |
| RF05 | Disponibilização, para a equipe e o gestor da UBS, de um painel web com a fila de encaminhamentos por especialidade, a ação pendente de cada paciente (cobrar marcação, buscar resultado, reagendar) e indicadores de espera média e faltas. | Funcional | Alta |
| RNF01 | Controle de acesso por perfil: dado clínico e nome completo do paciente só podem ser exibidos no canal institucional (equipe/gestor); as telas públicas (aplicação e painel de senha) nunca exibem esses dados. | Não Funcional - Segurança | Média |
| RNF02 | Acessibilidade da aplicação: fonte grande por padrão, opção de aumentar o tamanho da letra e leitura da tela em voz alta, para uso por pessoas idosas ou com baixo letramento digital. | Não Funcional - Usabilidade | Baixa |

### 2.4 Impacto da não implementação de um requisito

**Requisito escolhido: RF02 — acompanhamento do status do encaminhamento pelo cidadão.**

**Impacto social.** Sem esse requisito, o cidadão volta a não saber em que etapa está seu pedido, precisando ligar ou ir presencialmente à UBS só para obter informação — ou, na ausência de qualquer resposta, desistindo do tratamento. O dado do Instituto Locomotiva de que 1 em cada 3 brasileiros da Classe C já desistiu de uma consulta demorada por falta de informação mostra que esse não é um risco hipotético. O efeito recai com mais força sobre quem tem menos mobilidade ou tempo livre — idosos e trabalhadores informais —, aprofundando a desigualdade de acesso à saúde.

**Impacto operacional.** A equipe da UBS continua recebendo ligações e visitas repetidas apenas para informar status manualmente, consumindo tempo de atendimento que poderia ser usado em cuidado efetivo. Parte dos pacientes sem visibilidade sobre seu encaminhamento tende a recorrer ao pronto-socorro por não saber que já possui um encaminhamento em andamento, gerando reatendimento e sobrecarregando um recurso mais caro por falta de informação sobre um recurso mais barato.

**Impacto institucional.** A UBS e o gestor municipal perdem a chance de demonstrar transparência perante o cidadão e os órgãos de controle. Isso está diretamente ligado ao gargalo de visibilidade já apontado pelo TCU na alimentação de dados do sistema do Ministério da Saúde: sem esse requisito, o Minha Vez reproduziria o mesmo problema de opacidade que se propõe a resolver, corroendo a confiança pública no sistema.

## **Parte 3: Product Backlog (SCRUM)**

**US01 — Identificação (RF01)**

> Como cidadão, quero me identificar no sistema, por Cartão SUS/CPF no totem, ou login por CPF+senha/OAuth no app, para acessar meus agendamentos sem precisar decorar senha ou enfrentar barreira de acesso.
> 

Critérios de aceitação:

- No totem, o sistema aceita Cartão SUS **ou** CPF + data de nascimento, sem exigir senha.
- No app, o cidadão consegue se cadastrar/logar com CPF+senha ou OAuth.
- Dados inválidos ou não encontrados geram mensagem de erro clara, sem travar o fluxo.
- Após identificação, o cidadão é levado direto à sua área pessoal (status, agendamentos).

**US02 — Acompanhamento do status (RF02)**

> Como cidadão, quero acompanhar a etapa atual do meu encaminhamento (recebido e triado → agendar exame/consulta → concluído) para saber em que pé está minha solicitação sem precisar ligar ou ir presencialmente à UBS.
> 

Critérios de aceitação:

- O status exibido tem no mínimo as 3 etapas: recebido/triado, aguardando agendamento, concluído.
- A mesma informação aparece igual em qualquer dispositivo (app, totem).
- A mudança de status feita pela equipe é refletida para o cidadão.
- Nenhum dado clínico sensível é exibido nessa tela (regra do RNF01).

**US03 — Agendamento de horário (RF03)**

> Como cidadão, quero escolher entre os horários disponíveis para marcar meu exame ou consulta especializada, para garantir um horário que funcione pra mim.
> 

Critérios de aceitação:

- Só aparecem horários realmente livres (sem conflito de agenda).
- Ao confirmar, o cidadão recebe confirmação visível (tela e/ou notificação).
- O horário escolhido some da lista de disponíveis para outros cidadãos.
- É possível reagendar/cancelar respeitando as regras definidas pela UBS.

**US04 — Chamada na sala de espera (RF04)**

> Como cidadão aguardando atendimento, quero ver minha senha e sala no painel da sala de espera, para saber quando serei chamado sem que meu nome ou dado clínico fique exposto publicamente.
> 

Critérios de aceitação:

- O painel mostra apenas senha + sala — nunca nome completo ou informação clínica.
- A senha chamada muda de cor/estado (regra do amarelo: "é a vez de alguém").
- O painel atualiza automaticamente, sem exigir recarregar a página.

**US05 — Painel gerencial (RF05)**

> Como equipe/gestor da UBS, quero visualizar a fila de encaminhamentos por especialidade e a ação pendente de cada paciente, para priorizar o atendimento e reduzir faltas e desistências.
> 

Critérios de aceitação:

- O painel segmenta a fila por especialidade.
- Cada paciente mostra a ação pendente (cobrar marcação, buscar resultado, reagendar).
- O painel exibe indicadores de espera média e taxa de faltas.
- O acesso é restrito ao canal institucional (login de equipe/gestor), conforme RNF01.

### Matriz de priorização — GUT

Escala de 1 (baixo) a 5 (alto) para Gravidade, Urgência e Tendência; Pontuação = G × U × T.

| User Story | Gravidade | Urgência | Tendência | Pontuação | Prioridade |
| --- | --- | --- | --- | --- | --- |
| US01 — Identificação (RF01) | 5 | 5 | 5 | **125** | 1ª |
| US02 — Acompanhamento do status (RF02) | 5 | 4 | 5 | **100** | 2ª |
| US03 — Agendamento de horário (RF03) | 5 | 5 | 4 | **100** | 2ª |
| US05 — Painel gerencial (RF05) | 4 | 3 | 4 | **48** | 4ª |
| US04 — Chamada na sala de espera (RF04) | 3 | 3 | 3 | **27** | 5ª |

A ordem de priorização definida pela matriz GUT reflete a lógica de dependência técnica e de valor entregue ao cidadão que estrutura o sistema Minha Vez. A US01 (Identificação) ocupa o primeiro lugar porque funciona como pré-requisito técnico de toda a aplicação: sem a identificação do cidadão — seja por Cartão SUS/CPF no totem, seja por login no app —, nenhuma das demais funcionalidades pode ser acessada. Por isso recebeu nota máxima nos três critérios: sua ausência tem gravidade alta (impede o uso do sistema como um todo), urgência alta (é a primeira interação do cidadão com a plataforma) e tendência alta de agravamento (qualquer atraso na sua implementação trava o desenvolvimento das demais histórias).

Em seguida, US02 (Acompanhamento do status) e US03 (Agendamento de horário) empatam na segunda posição, pois juntas formam o núcleo do valor prometido pelo Minha Vez: permitir que o cidadão marque seu atendimento e, principalmente, saiba em que etapa sua solicitação está. Essa dupla prioridade também é sustentada pelos dados levantados na Parte 2 — a pesquisa do Instituto Locomotiva mostrando que 1 em cada 3 brasileiros da Classe C já desistiu de uma consulta por demora, e o apontamento do TCU sobre a falta de visibilidade nos sistemas de saúde —, o que justifica notas altas de gravidade e urgência em ambas. A US02 corresponde exatamente ao RF02 escolhido na análise de impacto da Parte 2.4, reforçando que sua ausência gera consequências sociais, operacionais e institucionais concretas.

A US05 (Painel gerencial) vem na quarta posição porque, apesar de ser essencial para a gestão da UBS, o sistema ainda consegue entregar valor ao cidadão mesmo que o painel da equipe não esteja pronto — o cidadão consegue se identificar, acompanhar o status e agendar independentemente da existência do painel gerencial. Sua gravidade e tendência foram avaliadas como médias-altas porque a falta de visibilidade da fila pelo gestor compromete a organização interna e a tomada de decisão, mas o problema tende a se agravar de forma mais gradual do que nas funcionalidades voltadas diretamente ao cidadão.

Por fim, a US04 (Chamada na sala de espera) ficou em último lugar por ser a de menor gravidade entre as cinco: ela não bloqueia o uso do serviço em si, já que o cidadão consegue se identificar, acompanhar seu status e agendar sem depender do painel físico da sala de espera. Essa posição também é coerente com a prioridade "Média" já atribuída ao RF04 na tabela da Parte 2, o que mostra que a matriz GUT, aplicada de forma independente, confirmou a hierarquia de prioridades que o grupo já havia intuído ao levantar os requisitos.

## **Parte 4: Estatística Descritiva**

### **1. e 2. Conjunto de Dados e Tabela de Frequência**

Os dados abaixo refletem a dinâmica de agendamentos e o cenário de saúde pública.

| **Especialidade** | **Volume Total de Encaminhamentos (%)** | **Tempo Médio de Espera (Dias)** | **Taxa de Absenteísmo (faltas)** | **Proporção de Casos Urgentes (%)** |
| --- | --- | --- | --- | --- |
| **Ortopedia** | 35% | 180 | 40% | 15% |
| **Cardiologia** | 30% | 120 | 41% | 10% |
| **Oftalmologia** | 25% | 90 | 45% | 5% |
| **Oncologia** | 10% | 25 | 5% | 80% |

### **3. Gráficos Baseados nos Dados**

1. **Gráfico de Barras (Tempo de Espera):**
    
    !Code_Generated_Image.png
    
2. **Gráfico de Setores / Pizza (Urgência vs. Eletivo):**

!image.png

**Análise dos Gráficos e Respostas**

**1. Quais padrões, comportamentos ou gargalos podem ser identificados?**

- **Gargalo Crítico de Abandono:** Existe um padrão claro e preocupante de faltas que ultrapassa os 40% nas especialidades com maior tempo de espera (Ortopedia, Cardiologia e Oftalmologia). Isso indica que a "invisibilidade da fila" faz com que o cidadão desista, esqueça a consulta ou procure vias alternativas.
- **Comportamento de Triagem Eficiente na Oncologia:** A Oncologia apresenta um padrão oposto e positivo. Concentra a maior taxa de urgência (80%), possui a menor taxa de faltas (5%) e um tempo de espera de 25 dias, mostrando que o fluxo para casos de alto risco tem prioridade e atinge a meta nacional (abaixo de 30 dias).
- **Sobrecarga Ortopédica:** A Ortopedia é o maior gargalo operacional do sistema, concentrando o maior volume de demanda (35%) e o maior tempo de retenção na fila (180 dias).

**2. Que decisão estratégica de gestão pública poderia ser tomada com base nesses dados?**

- **Implementação de Sistema de Confirmação Ativa:** Com base na evasão de 40%, o gestor deve direcionar recursos tecnológicos para disparar notificações (via SMS, WhatsApp ou no próprio app cidadão) exigindo a confirmação da presença 48h antes. Vagas não confirmadas voltam para o sistema, otimizando a agenda.
- **Realocação de Verba para Mutirões:** Ao visualizar o pico de 180 dias no gráfico de barras, a gestão pública pode justificar a contratação emergencial de clínicas privadas conveniadas ou organizar "mutirões de fim de semana" focados exclusivamente em zerar a fila de Ortopedia e Cardiologia.

### Referências para o Trabalho (Padrão ABNT)

- PREFEITURA DE LONDRINA. Secretaria Municipal de Saúde. **Relatório Quadrimestral de Prestação de Contas (RQPC) - Saúde.** Londrina: SMS, 2024. Disponível no Portal da Transparência de Londrina.
- MINISTÉRIO DA SAÚDE (Brasil). Departamento de Informática do SUS (DATASUS). **Sistema de Informação Ambulatorial (SIA/SUS): Produção Ambulatorial do Município de Londrina.** Brasília: Ministério da Saúde, 2024.
- CONSELHO NACIONAL DE SECRETÁRIOS DE SAÚDE (CONASS). **Atenção Ambulatorial Especializada e o desafio do tempo de espera.** Brasília: CONASS, 2023.

## Parte 5: Reflexão sobre Transformação Digital

**1. Problema público real que o HackGov se propõe a resolver**

- Resolve a falta de rastreabilidade na transição de pacientes entre a atenção primária (UBS) e a especializada, evitando que o encaminhamento "suma" em papéis ou sistemas paralelos.
- Combate a ausência de padronização de dados e a opacidade no acompanhamento, que hoje prejudicam a transparência pública, a confiança do cidadão no SUS e a capacidade de fiscalização.
- Ataca diretamente as altas taxas de faltas e desistências do tratamento, que são a consequência direta da invisibilidade da fila de espera (onde cerca de 1 em cada 3 pacientes desiste por falta de informação).

**2. Melhorias em produtividade, transparência, eficiência e redução de custos**

- **Transparência:** O cidadão ganha a autonomia para acompanhar o status do seu próprio encaminhamento e agendar horários via aplicativo ou totem, o que resolve a invisibilidade da solicitação e reduz a ansiedade.
- **Eficiência do Sistema de Filas:** Transforma uma fila estática e invisível em um fluxo dinâmico e monitorável por meio do painel gerencial. Isso otimiza a gestão do tempo, permite identificar ações pendentes (ex: cobrar marcação) e realocar vagas ociosas com agilidade.
- **Produtividade:** Reduz drasticamente o retrabalho administrativo da equipe da UBS (como recepção e gestão), que deixa de gastar horas de atendimento telefônico ou presencial apenas para checar e informar manualmente o status do encaminhamento.
- **Redução de custos:** Evita o reatendimento desnecessário em prontos-socorros por pacientes que não sabiam que já estavam na fila, otimizando a alocação de recursos da saúde usando dados reais das faltas.

**3. Dois riscos da implementação e suas mitigações**

- **Risco 1: Baixa adesão por barreira tecnológica e letramento digital.** Pacientes idosos ou com pouca familiaridade com smartphones podem ter dificuldade em usar o aplicativo, mantendo a dependência do balcão da UBS. Mitigação: Disponibilização de totens físicos nas unidades com identificação simplificada via Cartão SUS/CPF sem exigência de senha (RF01), aliada à aplicação estrita de requisitos de acessibilidade, como fontes grandes e leitura de tela em voz alta (RNF02).
- **Risco 2: Exposição indevida de dados sensíveis de saúde.** O vazamento ou a exibição pública de nomes e clínicas pode ferir a LGPD e quebrar a confiança no serviço público. Mitigação: Implementação de rigoroso controle de acesso por perfil (RNF01), garantindo que dados clínicos e completos fiquem restritos ao painel da equipe de saúde, enquanto o painel da sala de espera exibe de forma anonimizada apenas a senha e a sala (RF04).