# Parte 2: Ajustes no backlog

O backlog do Minha Vez começou na Fase 1 com cinco user stories (US01 a US05). Na Fase 2 elas foram
detalhadas, e nesta fase as cinco ficaram prontas: funcionam no backend e têm tela no front-end em React.

Nesta parte o grupo fez três coisas:

1. revisou as cinco user stories antigas;
2. escreveu onze user stories novas, de front-end, de segurança e de manipulação de arquivos;
3. escreveu os critérios de aceitação das mais importantes.

Com isso o backlog passou de 5 para 16 user stories. Treze estão prontas, uma está pronta em parte e duas ficam
para a próxima sprint.

## 2.1 Revisão das user stories antigas

As cinco user stories foram mantidas. Nenhuma foi trocada nem reescrita, e todas estão implementadas.

| US | Como está hoje | Decisão |
| --- | --- | --- |
| US01 Identificação | O cidadão entra no totem com Cartão SUS ou com CPF e data de nascimento, sem senha, e no aplicativo com CPF e senha | Mantida |
| US02 Acompanhamento do status | O totem e o aplicativo mostram a mesma etapa do encaminhamento | Mantida |
| US03 Agendamento de horário | O cidadão escolhe, cancela e reagenda o horário pelo aplicativo | Mantida |
| US04 Chamada na sala de espera | O painel mostra a senha e a sala em tempo real, sem nome | Mantida |
| US05 Painel gerencial | A equipe vê a fila por especialidade, a ação pendente de cada paciente e os indicadores | Mantida |

O que mudou foi o detalhe de alguns critérios de aceitação. Com o sistema rodando, regras que estavam escritas
de forma geral ganharam número e ficaram mais claras.

**US01, Identificação**

- No aplicativo, senha errada e CPF sem cadastro mostram a mesma mensagem ("CPF ou senha não conferem"). Assim
  ninguém descobre quem é paciente da unidade testando CPFs.
- Depois de 5 erros seguidos, o acesso fica bloqueado por 5 minutos (US10).
- Sair do aplicativo ou encerrar no totem encerra a sessão também no servidor, e a sessão parada vence sozinha
  (US11).
- A entrada pelo Gov.br continua sendo uma simulação, e a tela avisa isso.

**US03, Agendamento de horário**

- As "regras da UBS" agora estão escritas: cancelar ou reagendar só até 24 horas antes do horário, no máximo
  2 reagendamentos por encaminhamento (o terceiro só no balcão), e cancelar sempre pede confirmação.
- Só aparecem horários da especialidade e da unidade de destino do encaminhamento.
- Só o aplicativo agenda. O totem mostra a etapa e não marca horário.

**US05, Painel gerencial**

- A ação pendente de cada paciente é "Cobrar marcação" ou "Reagendar". "Buscar resultado" saiu, porque o banco
  modelado na Fase 3 não guarda resultado de exame.
- A equipe vê só a fila da própria unidade.
- O canal tem dois perfis com funções diferentes: atendente e gestor (US12).

Dois pontos ficaram em aberto, e os dois já estavam registrados na Parte 3:

- Depois de uma falta, ainda não dá para marcar outro horário. Isso virou a US16.
- O sistema sabe se o encaminhamento é urgente, mas a fila da equipe ainda não mostra essa informação.

Os dois requisitos não funcionais da Fase 1 também foram revistos. O RNF01 continua valendo: nome completo só
aparece na fila da equipe, e dado clínico não aparece em tela nenhuma. O RNF02, de acessibilidade, foi
implementado no totem e ganhou uma user story própria, a US09.

## 2.2 Novas user stories

As user stories de front-end e de segurança descrevem o que foi construído nas Partes 3 e 4. Elas entram no
backlog para que tudo o que o sistema faz tenha uma user story e um critério de aceitação por trás. Os atores
são os mesmos das fases anteriores: cidadão, atendente e gestor.

### Front-end

Vêm do que o enunciado pede na Parte 3 e do requisito de acessibilidade da Fase 1.

| US | User story | Situação |
| --- | --- | --- |
| US06 | Como cidadão, quero ver na tela se o sistema está carregando, se a ação deu certo ou se falhou, para saber o que aconteceu sem repetir o pedido nem ligar para a UBS. | Pronta |
| US07 | Como cidadão, quero ser avisado no próprio campo quando digito um dado inválido, para corrigir na hora, sem depender do balcão. | Pronta |
| US08 | Como cidadão, quero usar o Minha Vez no celular com as mesmas informações do computador, para acompanhar meu encaminhamento de onde eu estiver. | Pronta |
| US09 | Como cidadão com baixa visão ou pouca prática com tecnologia, quero aumentar a letra, ouvir a tela e pedir ajuda no totem, para consultar minha etapa sem depender de outra pessoa. | Pronta |

### Segurança

Vêm das práticas de segurança descritas na Parte 4.

| US | User story | Situação |
| --- | --- | --- |
| US10 | Como cidadão, quero que o acesso à minha conta seja bloqueado por alguns minutos depois de várias tentativas erradas, para que ninguém entre nela por tentativa e erro. | Pronta |
| US11 | Como cidadão, quero que minha sessão se encerre sozinha quando eu paro de usar, principalmente no totem da UBS, para que a próxima pessoa não veja meus dados. | Pronta |
| US12 | Como gestor da UBS, quero que o atendente opere a fila e só o gestor conclua o encaminhamento, para que quem registra o atendimento não seja quem o encerra. | Pronta |
| US13 | Como gestor da UBS, quero consultar quem fez cada ação sobre um encaminhamento e quando, para apurar a reclamação de um cidadão. | Pronta em parte |

### Manipulação de arquivos

| US | User story | Situação |
| --- | --- | --- |
| US14 | Como cidadão, quero baixar em arquivo o comprovante do meu horário ou o histórico do meu encaminhamento, para guardar e apresentar na unidade mesmo sem acesso ao aplicativo. | Pronta |
| US15 | Como gestor da UBS, quero exportar a fila por especialidade e os indicadores em CSV, para analisar os números em planilha. | Próxima sprint |

### Fluxo de atendimento

Esta veio da revisão da US03.

| US | User story | Situação |
| --- | --- | --- |
| US16 | Como atendente, quero liberar um novo agendamento para quem faltou, para que a pessoa consiga marcar outro horário. | Próxima sprint |

## 2.3 Prioridade e backlog atualizado

As user stories novas foram pontuadas com a mesma matriz GUT da Fase 1. Cada uma recebe uma nota de 1 a 5 em
Gravidade, Urgência e Tendência, e a pontuação é a multiplicação das três. As cinco antigas continuam com as
notas da Fase 1.

| US | User story | Tema | G | U | T | Pontos | Situação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| US01 | Identificação do cidadão | Produto (Fase 1) | 5 | 5 | 5 | 125 | Pronta |
| US02 | Acompanhamento do status | Produto (Fase 1) | 5 | 4 | 5 | 100 | Pronta |
| US03 | Agendamento de horário | Produto (Fase 1) | 5 | 5 | 4 | 100 | Pronta |
| US05 | Painel gerencial | Produto (Fase 1) | 4 | 3 | 4 | 48 | Pronta |
| US04 | Chamada na sala de espera | Produto (Fase 1) | 3 | 3 | 3 | 27 | Pronta |
| US10 | Bloqueio depois de tentativas erradas | Segurança | 5 | 4 | 4 | **80** | Pronta |
| US11 | Sessão que se encerra sozinha | Segurança | 5 | 5 | 3 | **75** | Pronta |
| US06 | Retorno de cada ação na tela | Front-end | 4 | 4 | 4 | **64** | Pronta |
| US16 | Novo horário depois da falta | Fluxo | 4 | 4 | 4 | **64** | Próxima sprint |
| US07 | Erro apontado no campo | Front-end | 4 | 4 | 3 | **48** | Pronta |
| US13 | Registro de quem fez cada ação | Segurança | 4 | 3 | 4 | **48** | Pronta em parte |
| US08 | Uso no celular e no computador | Front-end | 4 | 3 | 3 | 36 | Pronta |
| US12 | Funções separadas de atendente e gestor | Segurança | 4 | 3 | 3 | 36 | Pronta |
| US14 | Comprovante ou histórico em arquivo | Arquivos | 4 | 3 | 3 | 36 | Pronta |
| US09 | Totem acessível | Front-end | 3 | 3 | 3 | 27 | Pronta |
| US15 | Fila e indicadores em CSV | Arquivos | 3 | 2 | 3 | 18 | Próxima sprint |

**Por que essas notas.** As duas de segurança ficam no topo por causa do totem. Ele é compartilhado e identifica
a pessoa por CPF e data de nascimento, que não é segredo. Sem o limite de tentativas, um programa testa todas
as datas (US10). Sem o encerramento da sessão, a próxima pessoa da fila vê os dados de quem saiu (US11). A US06
pontua alto porque, sem retorno na tela, a pessoa repete o pedido ou liga para a UBS, e esse é o problema que o
Minha Vez existe para resolver. A US16 pontua alto porque quem faltou fica sem saída no sistema, e os casos se
acumulam a cada falta. As de arquivos pontuam menos porque a informação que elas exportam já aparece na tela.

**User stories prioritárias.** São as seis com 48 pontos ou mais (US10, US11, US06, US16, US07 e US13) e a
US14, a mais bem pontuada do tema de arquivos, que o enunciado desta fase pede.

Para a próxima sprint, a ordem pela pontuação é: US16, o que falta da US13 e US15.

## 2.4 Critérios de aceitação das user stories prioritárias

### US10: Bloqueio depois de tentativas erradas

> Como cidadão, quero que o acesso à minha conta seja bloqueado por alguns minutos depois de várias tentativas
> erradas, para que ninguém entre nela por tentativa e erro.

Situação: pronta.

- Depois de 5 erros seguidos na mesma conta, o acesso fica bloqueado por 5 minutos, mesmo que a senha certa seja
  digitada nesse tempo.
- A tela explica que o bloqueio é uma proteção e que o acesso volta em alguns minutos.
- Se a pessoa acerta antes do quinto erro, a contagem volta a zero.
- Depois dos 5 minutos, a pessoa entra normalmente.
- A regra vale no aplicativo, no totem e no login da equipe.
- Tentativa com CPF que não tem cadastro também conta, e recebe a mesma mensagem de senha errada.

Como foi conferido: cinco testes automatizados em `SegurancaHttpTest` e teste no navegador, em que a sexta
tentativa mostra a mensagem de bloqueio (Parte 4, prática 3).

### US11: Sessão que se encerra sozinha

> Como cidadão, quero que minha sessão se encerre sozinha quando eu paro de usar, principalmente no totem da
> UBS, para que a próxima pessoa não veja meus dados.

Situação: pronta.

- No totem, depois de 1 minuto sem toque, a tela pergunta "Ainda está aí?" e conta 15 segundos. Se ninguém
  tocar, a tela é limpa e volta ao início.
- A sessão parada vence sozinha: em 3 minutos no totem e em 30 minutos no aplicativo e no canal da equipe. Cada
  uso renova esse prazo.
- Quando a sessão vence, a tela avisa "Sua sessão terminou" e volta para a entrada.
- Sair do aplicativo, sair do canal da equipe ou encerrar no totem encerra a sessão na hora.
- No totem, ao encerrar, o tamanho da letra e os outros ajustes voltam ao padrão para a próxima pessoa.

Como foi conferido: quatro testes automatizados em `SegurancaHttpTest` que simulam a passagem do tempo, um
teste da saída da equipe e teste no navegador, em que o totem limpou a tela depois do aviso (Parte 4, prática
4).

### US06: Retorno de cada ação na tela

> Como cidadão, quero ver na tela se o sistema está carregando, se a ação deu certo ou se falhou, para saber o
> que aconteceu sem repetir o pedido nem ligar para a UBS.

Situação: pronta.

- Enquanto a resposta não chega, a tela mostra um esqueleto no formato do conteúdo, e o botão mostra que está
  trabalhando ("Entrando…", "Confirmando…").
- Quando a ação dá certo, aparece uma confirmação e a tela atualiza os dados.
- Quando a ação falha, aparece um alerta com o que aconteceu e o que fazer. O botão "Tentar de novo" só aparece
  quando tentar de novo pode resolver.
- Não ter dado não é erro. Sem encaminhamento, sem vaga e fila vazia têm mensagem própria.
- Quando o servidor está fora do ar, a tela diz "Sem conexão com o servidor", e não uma mensagem de erro
  genérica.

Como foi conferido: todos os fluxos testados no navegador com o backend rodando, incluindo sessão vencida e
servidor fora do ar (Parte 3, seções 3.3 e 3.6).

### US07: Erro apontado no campo

> Como cidadão, quero ser avisado no próprio campo quando digito um dado inválido, para corrigir na hora, sem
> depender do balcão.

Situação: pronta.

- CPF e Cartão SUS são conferidos pelo dígito verificador antes do envio.
- Data de nascimento no futuro não é aceita.
- No cadastro, a senha precisa ter pelo menos 8 caracteres, e a confirmação precisa ser igual à senha.
- A mensagem de erro aparece embaixo do campo quando a pessoa sai dele ou tenta enviar, e some quando ela
  corrige.
- O formulário não é enviado enquanto houver campo inválido.
- O servidor confere tudo de novo. Se ele encontra um erro que a tela não tinha como saber, como CPF já
  cadastrado, o erro aparece embaixo do campo certo.
- Os campos de CPF e de Cartão SUS têm máscara e abrem o teclado numérico no celular.

Como foi conferido: os seis formulários testados no navegador, e os testes de cadastro e login do backend em
`IdentificacaoHttpTest` (Parte 3, seção 3.3).

### US13: Registro de quem fez cada ação

> Como gestor da UBS, quero consultar quem fez cada ação sobre um encaminhamento e quando, para apurar a
> reclamação de um cidadão.

Situação: pronta em parte. A mudança de etapa e a chamada de senha já guardam quem fez. Faltam o registro da
falta e a tela de consulta do gestor.

- Toda ação da equipe sobre um encaminhamento guarda quem fez, o perfil, a ação, o protocolo e a data e hora.
  As ações são: liberar agendamento, chamar senha, registrar falta e concluir.
- O que o cidadão faz com o horário (marcar, cancelar e reagendar) entra no mesmo registro.
- O registro só recebe linhas novas. Ninguém altera nem apaga uma linha.
- O gestor consulta o registro de um encaminhamento da própria unidade, em ordem de data. Atendente e cidadão
  não têm esse acesso.
- O registro não guarda dado clínico nem senha.

Esse registro é a base da Parte 5: cada linha dele é o evento que teria o hash gravado na blockchain.

### US16: Novo horário depois da falta

> Como atendente, quero liberar um novo agendamento para quem faltou, para que a pessoa consiga marcar outro
> horário.

Situação: próxima sprint.

- Depois da falta, o encaminhamento continua na fila com a ação "Reagendar".
- O atendente libera um novo agendamento para esse encaminhamento, e a ação "Reagendar" some da fila.
- Depois da liberação, o cidadão vê os horários livres e marca pelo aplicativo, como em qualquer agendamento.
- A falta continua no histórico e continua contando na taxa de faltas da US05.
- O horário em que a pessoa faltou não volta para a lista de horários livres.
- Só o atendente da unidade do encaminhamento faz a liberação.

O grupo ainda vai decidir se os reagendamentos feitos antes da falta continuam contando para o limite de 2 da
US03.

### US14: Comprovante ou histórico em arquivo

> Como cidadão, quero baixar em arquivo o comprovante do meu horário ou o histórico do meu encaminhamento, para
> guardar e apresentar na unidade mesmo sem acesso ao aplicativo.

Situação: pronta.

- No aplicativo, o cidadão baixa o comprovante do horário ou o histórico do encaminhamento.
- O arquivo sai em JSON ou CSV e abre com os dados certos: protocolo, especialidade, data, hora e unidade.
- O arquivo não traz CPF nem dado clínico.
- Só o dono do encaminhamento consegue baixar.

Esse arquivo conversa com a Parte 5: o que iria para a blockchain é o hash do comprovante, e não o comprovante.
