### 1. ABERTURA (0:00 - 0:20)

*[slide 1]*

**[John]:**

“E aí, pessoal! Somos a equipe do HackGov: eu, John, Ana Larissa, João Pedro, Vinícius e Brenda. Depois de modelar e prototipar o fluxo do Minha Vez, chegou a hora de armazenar os dados. Vamos mostrar como o projeto evolu iu, do código até o banco de dados.”

### 2. VERSÃO ATUAL DO PROJETO (0:21 - 1:45)

*[slides 2, 3, 4 e 5]*

**[João Pedro]:**

*[slide 2]*

“Na fase anterior, o Minha Vez tinha o fluxo do cidadão modelado, prototipado e com um primeiro recorte do domínio em Java. Ao desenhar o banco, a modelagem dos dados expôs regras da US03 que o código ainda não aplicava. Por isso atualizamos o projeto inteiro: agora são 9 classes em Java, 5 testes automatizados, diagramas e telas revisados, e o banco, com 11 entidades e 12 tabelas.”

*[slide 3]*

“A principal regra: o encaminhamento define a unidade da consulta, e o cidadão só vê e só agenda vagas dessa unidade. Reagendar cancela o horário atual e cria um novo, ligado a ele. Cancelar ou reagendar só vale até 24 horas antes, com no máximo 2 reagendamentos; depois, só no balcão. Os 5 testes passam, e a saída do demo mostra o anterior cancelado, o novo apontando para ele e o erro quando a vaga é de outra unidade. O domínio ainda roda em memória: gravar no banco é a    próxima etapa.”

**[John]:**

*[slides 4 e 5]*

“Os diagramas UML foram revisados contra o código: classes e sequência de agendar atualizados, mais dois diagramas novos, o de sequência do reagendamento e o de atividades de reagendar e cancelar. Nos wireframes, três telas foram atualizadas e três são novas, cobrindo reagendamento, limite e prazo.”

### 3. MODELO LÓGICO (1:46 - 2:28)

*[slide 6]*

**[Larissa]:**

“Para o modelo lógico, usamos o Oracle SQL Developer Data Modeler, com notação Barker. São 11 entidades, 15 relacionamentos e 2 heranças. O modelo traz uma especialização, com Pessoa dividida em Cidadão e Usuário Institucional; uma agregação, na entidade Agendamento; e um autorrelacionamento, que liga o reagendamento ao horário anterior. O contato do cidadão é multivalorado e virou entidade própria, e o endereço da unidade foi decomposto em atributos. CID, laudo e prontuário ficam fora do banco, para reduzir o dano em caso de  vazamento.”

### 4. ANOMALIAS E FORMAS NORMAIS (2:29 - 3:37)

*[slides 7 e 8]*

**[Brenda]:**

*[slide 7]*

“Para entender por que normalizar, imaginamos tudo numa tabela só. Na inserção, não dá para cadastrar um cidadão sem encaminhamento nem publicar uma vaga que ninguém reservou. Na exclusão, apagar o único pedido de um cidadão leva junto o cadastro dele e o endereço da unidade. E na alteração, se alguém troca de celular, cada pedido precisa mudar, e esquecer um deixa duas versões da verdade.”

*[slide 8]*

“Aplicando as formas normais: na primeira, contatos e histórico viram tabelas e o endereço vira colunas. Na segunda, encaminhamento, horário e agendamento ficam separados. Na terceira, achamos uma dependência transitiva em Unidade de Saúde: logradouro, bairro, cidade e UF dependem do CEP, então criamos a tabela CEP. Com ela, o modelo chega à BCNF. Algumas redundâncias foram mantidas de propósito, como o status do encaminhamento, com a consistência garantida pela aplicação e pelo banco.”

### 5. MODELO FÍSICO (3:38 - 4:12)

*[slide 9]*

**[Vinícius]:**

“No modelo físico, o mesmo banco ganha tipos e chaves: são 12 tabelas, com NUMBER, VARCHAR2, CHAR, DATE e TIMESTAMP. Cada relacionamento vira uma coluna de chave estrangeira, e a especialização de Pessoa vira três tabelas com o mesmo ID_PESSOA. A tabela nova é a CEP, vinda da normalização, o que levou o modelo de 11 para 12 tabelas e de 17 para 18 chaves estrangeiras.”

### 6. SCRIPTS SQL E ENCERRAMENTO (4:13 - 5:00)

*[slide 10]*

**[John]:**

“Por fim, o script SQL cria esse banco no Oracle, e o próprio banco garante as regras da US03: uma chave estrangeira composta só aceita o agendamento se o horário for da mesma especialidade e da mesma unidade do encaminhamento, e um índice único impede que a mesma vaga tenha dois agendamentos ativos. Foi assim que o Minha Vez saiu de um domínio em memória para um banco desenhado, normalizado e pronto para o Java gravar. Muito obrigado!”