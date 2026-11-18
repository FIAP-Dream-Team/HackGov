# Contrato da API — Minha Vez

Este contrato descreve o que o Spring em `src/backend` responde hoje. A base local é `http://localhost:8080`. Campo ausente no JSON não vai na resposta: o servidor omite nulo.

O corpo de erro é sempre o mesmo:

```json
{ "codigo": "DADOS_INVALIDOS", "mensagem": "Texto que a pessoa lê." }
```

| Situação | HTTP | codigo |
| --- | --- | --- |
| Corpo ausente, campo obrigatório vazio ou JSON ilegível | 400 | `DADOS_INVALIDOS` |
| CPF ou senha não conferem | 401 | `SENHA_INCORRETA` |
| Pedido sem `Authorization: Bearer`, ou token desconhecido | 401 | `SESSAO_AUSENTE` ou `SESSAO_INVALIDA` |
| Canal errado para a ação (cidadão na rota da equipe, totem tentando agendar) | 403 | `ACESSO_NEGADO` |
| Protocolo, horário ou cadastro que não existe para quem pediu | 404 | `ENCAMINHAMENTO_NAO_ENCONTRADO`, `HORARIO_NAO_ENCONTRADO` ou `CIDADAO_NAO_ENCONTRADO` |
| Regra do domínio (prazo, limite, etapa, vaga de outra unidade, agendamento inativo) | 409 | `REGRA_VIOLADA`, com a mensagem da regra |
| CPF ou Cartão SUS já cadastrado | 409 | `CPF_JA_CADASTRADO` ou `CARTAO_JA_CADASTRADO` |
| Falha não prevista | 500 | `FALHA_INTERNA` |

Datas de vaga saem como `aaaa-mm-dd`. Hora de vaga sai como `hh:mm`. A frase de confirmação repete a data em `dd/mm/aaaa`.

O dado que o servidor semeia ao subir é sintético: CPF `52998224725`, senha `minhavez`, protocolo `MV-2026-0001`, login da equipe `atendente.centro`. O encaminhamento começa em `RECEBIDO_TRIADO`. Listar horário antes de a equipe liberar a etapa responde 409.

A coleção para o Insomnia, com a base local e todos os caminhos, está em `docs/fase-4/insomnia/HackGov-Minha-Vez-local.json`. O passo a passo de importação está no fim deste arquivo.

## 1. Identificação (US01)

Sessão de cidadão. O token tem 64 caracteres hexadecimais. `canal` é `TOTEM` ou `APP`.

### POST `/api/totem/identificacao`

Sem senha. Um dos dois corpos:

```json
{ "cartaoSus": "100000000060018" }
```

```json
{ "cpf": "52998224725", "dataNascimento": "1988-04-12" }
```

200:

```json
{
  "token": "…",
  "canal": "TOTEM",
  "areaPessoal": { }
}
```

400 `CANAL_INCORRETO` se o corpo trouxer senha. 404 `CIDADAO_NAO_ENCONTRADO` se o cadastro não existe ou a data não confere.

### POST `/api/app/cadastro`

201. Corpo: `nome`, `cpf`, `dataNascimento`, `senha`. `cartaoSus` é opcional.

400 se faltar nome, CPF, nascimento ou senha. 409 se o CPF ou o Cartão SUS já existir.

### POST `/api/app/login`

```json
{ "cpf": "52998224725", "senha": "minhavez" }
```

200, mesmo formato do totem, com `canal` `APP`. 401 `SENHA_INCORRETA` se CPF ou senha não conferem. 401 `CONTA_GOVBR` se a conta só tem Gov.br.

### POST `/api/app/oauth`

Gov.br ilustrado: não há redirecionamento. O corpo diz o provedor e o CPF que ele teria confirmado.

```json
{
  "provedor": "gov.br",
  "cpf": "52998224725",
  "nome": "Maria Andrade",
  "dataNascimento": "1988-04-12"
}
```

200 inclui `provedor` `gov.br` e `oauthSimulado` `true`. Nome e nascimento só são exigidos no primeiro acesso. 400 se o provedor não for `gov.br`.

### GET `/api/sessoes/atual`

Cabeçalho `Authorization: Bearer <token do cidadão>`. 200 devolve o token, o canal e a área pessoal.

### DELETE `/api/sessoes/atual`

O mesmo cabeçalho. 204 sem corpo. A sessão deixa de valer.

## 2. Acompanhamento (US02)

### GET `/api/acompanhamento`

Cabeçalho do cidadão, totem ou aplicativo. A trilha é a mesma nos dois canais.

200 com encaminhamento:

```json
{
  "temEncaminhamento": true,
  "situacao": "COM_ENCAMINHAMENTO",
  "encaminhamentos": [
    {
      "protocolo": "MV-2026-0001",
      "status": "RECEBIDO_TRIADO",
      "rotulo": "Recebido e triado",
      "especialidade": "Cardiologia",
      "unidadeDestino": "Ambulatório Central",
      "podeAgendar": false,
      "podeAlterarHorario": false,
      "proximoPasso": "Aguarde a liberação dos horários.",
      "trilha": [
        { "status": "RECEBIDO_TRIADO", "rotulo": "Recebido e triado", "situacao": "ATUAL" }
      ],
      "agendamentos": []
    }
  ]
}
```

`podeAgendar` só é verdadeiro em `AGUARDANDO_AGENDAMENTO`. Com horário ativo, entra `horarioMarcado` (`id`, `dataHora`) e `podeAlterarHorario` fica verdadeiro. Nome, CPF e dado clínico não saem.

200 sem encaminhamento: `temEncaminhamento` falso, `situacao` `SEM_ENCAMINHAMENTO`, mensagem "Você não tem encaminhamento em andamento." e lista vazia.

## 3. Agendamento (US03)

Só token de aplicativo. Totem recebe 403 "O totem só acompanha a etapa. Para marcar horário, use o aplicativo." Token de equipe recebe 403 "O agendamento é feito pelo aplicativo do cidadão." Protocolo de outra pessoa recebe 404.

### GET `/api/app/encaminhamentos/{protocolo}/horarios`

200 com vaga:

```json
{
  "temHorario": true,
  "protocolo": "MV-2026-0001",
  "especialidade": "Cardiologia",
  "unidade": "Ambulatório Central",
  "horarios": [
    {
      "id": 6,
      "data": "2026-11-25",
      "hora": "08:00",
      "especialidade": "Cardiologia",
      "unidade": "Ambulatório Central"
    }
  ]
}
```

O `id` é o que o POST seguinte envia. Ele muda a cada subida do servidor. Sem vaga, `temHorario` é falso, `horarios` vem vazio e `mensagem` explica a ausência. Não se inventa horário. 409 se o encaminhamento ainda não está em `AGUARDANDO_AGENDAMENTO` nem `AGENDADO`.

### POST `/api/app/encaminhamentos/{protocolo}/agendamento`

```json
{ "horarioId": 6 }
```

201:

```json
{
  "protocolo": "MV-2026-0001",
  "especialidade": "Cardiologia",
  "data": "2026-11-25",
  "hora": "08:00",
  "unidade": "Ambulatório Central",
  "status": "AGENDADO",
  "agendamentoId": 1,
  "mensagem": "Horário confirmado: Cardiologia, 25/11/2026 às 08:00, protocolo MV-2026-0001, Ambulatório Central."
}
```

A vaga some para os outros. 400 se faltar `horarioId`. 404 se o id não existir. 409 se a vaga já foi ocupada ou se for de outra unidade.

### POST `/api/app/encaminhamentos/{protocolo}/cancelamento`

```json
{ "confirmado": true }
```

200: `protocolo`, `status` `AGUARDANDO_AGENDAMENTO` e a mensagem "Horário cancelado. O encaminhamento voltou para aguardando agendamento." A vaga volta à lista.

400 `CONFIRMACAO_AUSENTE` se `confirmado` não for `true`. Nesse caso nada é cancelado. 409 dentro de 24 horas do horário, ou se não houver agendamento ativo.

### POST `/api/app/encaminhamentos/{protocolo}/reagendamento`

O mesmo corpo do agendamento, com outro `horarioId` livre. 201, no formato da confirmação, com `agendamentoAnteriorId` e a frase começando em "Horário reagendado". O horário antigo volta à lista. O terceiro reagendamento do mesmo encaminhamento responde 409: "O próximo reagendamento só pode ser feito no balcão da UBS."

## 4. Equipe (US05 e ações da US02 e da US04)

Login próprio. O token de cidadão não serve.

### POST `/api/equipe/login`

```json
{ "login": "atendente.centro", "senha": "minhavez" }
```

200: `{ "token": "…", "canal": "EQUIPE" }`. 401 `SENHA_INCORRETA` se login ou senha não conferem.

Nas rotas abaixo, o cabeçalho é `Authorization: Bearer <token da equipe>`. Sem ele, 401 "Não há sessão de equipe ativa. Entre de novo."

### POST `/api/equipe/encaminhamentos/{protocolo}/status`

```json
{ "status": "AGUARDANDO_AGENDAMENTO" }
```

200: `protocolo`, `status` e `rotulo`. 400 se a etapa não existir. 403 se o encaminhamento for de outra unidade. 409 se a transição não for permitida. `AGENDADO` não se define por esta rota: só a confirmação do cidadão faz isso.

### GET `/api/equipe/fila`

200. A fila é a da unidade de lotação, agrupada por especialidade. Fila vazia não é erro: `mensagem` "Nenhum encaminhamento nesta unidade." e `especialidades` vazio.

`?especialidade=Dermatologia` sem encaminhamento dessa especialidade devolve o segmento com lista vazia, também 200.

```json
{
  "especialidades": [
    {
      "especialidade": "Cardiologia",
      "encaminhamentos": [
        {
          "protocolo": "MV-2026-0001",
          "nome": "Maria Andrade",
          "status": "AGUARDANDO_AGENDAMENTO",
          "acaoPendente": "COBRAR_MARCACAO",
          "rotuloAcao": "Cobrar marcação"
        }
      ]
    }
  ],
  "esperaMediaSegundos": 0,
  "faltas": 0,
  "agendamentos": 1,
  "taxaFaltasPercentual": 0
}
```

Sem espera medida, sai `mensagemEspera` "Ainda não há espera medida." e o número some. Sem agendamento contável, sai `mensagemFaltas` e a taxa some. Agendamento cancelado não entra na taxa. `acaoPendente` só aparece quando há ação: `COBRAR_MARCACAO` ou `REAGENDAR`. CPF não sai.

Token de cidadão: 403 "A fila da equipe é do canal institucional."

### POST `/api/equipe/encaminhamentos/{protocolo}/falta`

Sem corpo. 200: `protocolo`, `acaoPendente` `REAGENDAR`, `rotuloAcao` "Reagendar". Exige agendamento ativo na unidade da equipe. O horário continua ocupado. O painel deixa de mostrar a senha, porque o agendamento deixou de estar ativo. 409 se não houver agendamento ativo. 403 se for de outra unidade.

### POST `/api/equipe/encaminhamentos/{protocolo}/chamada`

```json
{ "senha": "A12", "sala": "2" }
```

201:

```json
{
  "temChamada": true,
  "senha": "A12",
  "sala": "2",
  "estado": "CHAMADA",
  "cor": "AMARELO",
  "mensagem": "É a vez de alguém."
}
```

Exige agendamento ativo. A senha é a da chamada, não a senha de login. 400 se faltar senha ou sala. 403 para token de cidadão.

## 5. Painel da sala de espera (US04)

Público. Não pede token. Não devolve nome, protocolo, especialidade nem dado clínico.

### GET `/api/painel`

Sem chamada: 200, `temChamada` falso e `mensagem` "Nenhuma senha chamada no momento." Com chamada, o mesmo JSON da seção 4.

### GET `/api/painel/eventos`

`Content-Type` da resposta: `text/event-stream`. A conexão fica aberta. O primeiro evento já traz o painel atual. Outro evento sai quando a equipe chama, quando o horário é cancelado ou reagendado, ou quando a falta é registrada. O nome do evento é `painel` e o dado é o JSON do painel.

## 6. Importar no Insomnia

Um arquivo só. Ele traz o workspace, o ambiente com a base local e todos os caminhos. Não há segundo arquivo de ambiente.

1. Na pasta `src/backend`, suba o servidor com `mvn spring-boot:run`. Ele precisa estar em `http://localhost:8080`.
2. No Insomnia: **Import** → **From File** e escolha `docs/fase-4/insomnia/HackGov-Minha-Vez-local.json`.
3. Abra o workspace **HackGov — Minha Vez (local)**.
4. No seletor de ambiente, escolha **Local**. A base já é `http://localhost:8080`. CPF, senha, protocolo e login da equipe já estão preenchidos. Os tokens começam vazios e são gravados pelas requisições de login e pela lista de horários.

Ordem da primeira passagem, com o servidor recém-subido:

1. `01 Login da equipe` — grava `equipe_token`.
2. `02 Liberar agendamento` — o encaminhamento sintético sai de `RECEBIDO_TRIADO`.
3. `03 Login do aplicativo` — grava `app_token`.
4. `04 Acompanhamento`.
5. `05 Horários livres` — grava `horario_id` e `horario_id_2`.
6. `06 Confirmar horário`.
7. `07 Painel` — ainda sem senha.
8. `08 Chamar senha`.
9. `09 Painel` de novo — senha e sala.
10. `10 Fila da equipe`.

Para cancelar, use `11 Cancelar horário` enquanto o agendamento estiver ativo. Para a falta, use `12 Registrar falta` no lugar do cancelamento: os dois encerram o agendamento ativo, então um servidor recém-subido só completa um dos dois. Reagendar é o `13`, com o segundo horário, antes do cancelamento e da falta.

`14 Painel (eventos)` segura a conexão. Cancele a requisição no Insomnia depois de ler o primeiro evento.

Se a versão do Insomnia não gravar o token sozinha, copie o campo `token` da resposta de login para `app_token` ou `equipe_token` no ambiente Local, e o primeiro `id` de `05 Horários livres` para `horario_id`.
