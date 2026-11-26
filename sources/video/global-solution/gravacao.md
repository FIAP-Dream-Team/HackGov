# Roteiro de gravação · brutos dos vídeos do Alertaí

Deixe este arquivo aberto no **monitor 2 (1440×900)**. Grave sempre o **monitor 1 (1920×1080)**, que tem o
tamanho exato do vídeo: captura 1:1, sem perda. O OBS também fica no monitor 2, fora do quadro.

Base: `edicao-tecnico.md` (o que cada plano precisa mostrar) e `roteiro-tecnico.md` (a fala em cima de cada
plano). Marque `[x]` em cada tomada aprovada e anote o nome do arquivo.

---

## Estado em 17/11/2026

Conferido contra as decupagens de cada pasta de `bruto/` (`decupagem-A1.md`, `decupagem-A2.md`,
`decupagem-A3.md`, `decupagem-B.md`). Os originais ficam em cada `originais/`, somente leitura.

| Bloco | Situação | Pré-corte pronto |
| --- | --- | --- |
| A1 · banco vazio → cascata | Gravado | `bruto/docker/A1-take-unico.mp4` (28,7 s) |
| A2 · DBeaver | **Feito**, com o B10 em 100% (17/11) | `bruto/banco/A2-take-unico.mp4` (65,4 s; anterior em `-v1`) |
| A3 · terceira confirmação e encerramento | **Feito**, com o passo final (17/11) | `bruto/console-a3/A3-take-unico.mp4` (35,3 s; anterior em `-v1`) |
| B · código | Feito (B12 com callout na edição) | clipes em `bruto/codigo/` e o rolo `B-codigo-rolo.mp4` (60,5 s) |
| C1 · app no computador | **Feito**: B25, B27 (teclado e foco), B30 (Texto maior) e extras | `bruto/computador/B25`, `B27`, `B28`, `B29`, `B30` |
| C2 · Figma | **Feito** (B26a, B26b e extras) | `bruto/figma/B26a-wireframes.mp4` (8,4 s), `B26b-alta-fidelidade.mp4` (7,0 s), `B26d` |
| C3 · celular | **Feito**: B20–B23 (tomada 2) e B24 (tomada 3) | `bruto/celular/B20`…`B24` e extras X1–X3 |

**Bloco A e B completos: o vídeo técnico não precisa de mais nenhuma gravação de tela.**

**Falta gravar:**
1. Nada obrigatório. Recomendado: mandar o **original** do celular (tomadas 2 e 3) pelo cabo ou Google
   Drive, para refazer os clipes em resolução cheia com as EDLs prontas.
2. Opcional: a regravação curta do computador (B27 Tab e foco, Alerta em cascata, Texto maior) em C1. O
   Figma não precisa de regravação.

**Decidido (John, 17/11):** B12a e B12b ficam como estão. A linha sem seleção ganha **callout na edição** e
o B12b continua no **VS Code**: a troca de editor não incomoda, desde que a passagem seja fluida (ver a
nota do T08 em `edicao-tecnico.md`).

---

## 0. Preparação (uma vez)

### OBS 32
- [x] **Configurações → Vídeo:** resolução base 1920×1080, saída 1920×1080, 30 FPS.
- [x] **Configurações → Saída → modo Avançado → Gravação:**
  - Caminho: `...\HackGov\sources\video\global-solution\bruto`;
  - Formato: **MP4 híbrido** (não perde o arquivo se travar);
  - Codificador: **NVIDIA NVENC H.264**, controle **CQP**, nível **18**, intervalo de keyframe 2 s,
    predefinição **P5**, perfil *high*.
- [x] **Configurações → Áudio:** desative Desktop e Microfone, ou deixe os dois mudos no mixer. Bruto de tela
  vai sem som; a narração é gravada à parte.
- [x] **Configurações → Teclas de atalho:** *Iniciar gravação* = `F9` e *Parar gravação* = `F10`. Assim você
  não precisa clicar no OBS.
- [x] **Cena "Tela"**, fonte **Captura de tela** → monitor 1920×1080, *Capturar cursor* ligado.
  - Se a prévia ficar preta (notebook com duas placas de vídeo): Windows → Configurações → Sistema → Tela →
    Gráficos → OBS → **Economia de energia**, reabra o OBS. Ou troque a fonte por **Captura de janela**.

### Windows e apps
- [x] **Não perturbe** ligado (some com notificação de WhatsApp, e-mail e Teams no meio da tomada).
- [x] Barra de tarefas: *ocultar automaticamente* ligado.
- [x] Docker Desktop aberto e o banco de pé (`docker start alertai-oracle`). **Hoje o banco está com a
  ocorrência 1 RESOLVIDA**, o estado final da demo, que é o que o passo final do A3 precisa. Não rode a
  opção 1 nem o reset antes dele.
- [x] **Windows Terminal:** perfil **"Alertaí · demo"** criado (fundo Tinta, fonte grande). **Os brutos A1 e
  A3 foram gravados no terminal preto comum**, então o passo final do A3 usa o terminal preto para casar.
  O perfil roxo fica para uma regravação geral, se houver.
- [x] **DBeaver:** fonte do editor em 20 (Window → Preferences → Appearance → Colors and Fonts → Text Font) e
  da grade de resultados em 18 (*Data Editor*). Abra `sql/consultas-gravacao.sql`. Janela maximizada no
  monitor 1.
- [x] **DBeaver sem falso alarme:** Window → Preferences → busque `semantic` → desmarque *Enable semantic
  analysis* (ou *Show problem markers*). Sem isso, `user_tables` aparece sublinhado como "Table not found",
  embora a consulta funcione: é uma visão do Oracle que o DBeaver não acha no schema.
- [x] **IntelliJ:** abra a pasta `backend` do clone. Tema escuro. *View → Appearance → Enter Presentation
  Mode* deixa a fonte grande e esconde os painéis.

### Regras de toda tomada
- **`F11` (tela cheia) antes do `F9`.** No A3 a barra de abas do terminal entrou no quadro e precisou ser
  cortada e reescalada.
- Dê `F9`, espere **2 s parado**, faça a ação, espere **3 s parado** no resultado, `F10`.
- Mouse devagar e só quando precisa. Nada de "procurar" com o cursor na tela. **Tire o mouse de cima do
  texto** depois de cada seleção.
- Selecionar com o mouse a linha-chave do resultado funciona como marca-texto; segure a seleção 3 s.
- Digite num ritmo normal; a edição acelera a digitação. O que **não** pode ser acelerado é o resultado.
- Errou? Não pare. Espere 2 s e refaça a ação; eu corto na edição. Só pare se o estado do banco ficar
  errado (aí veja "Reset" no fim).

---

## Bloco A · Console e banco (vídeo técnico)

A ordem importa: o vídeo mostra o caso andando sempre para a frente, e o banco precisa estar no mesmo
ponto da história que a fala. **Não pule etapas.**

Teclas do menu num banco recém-criado: bairros `1` Menino Deus, `2` Praia de Belas, `3` Centro Historico,
`4` Arquipelago, `5` Bom Jesus. Tipos: `1` Falta de luz. Pessoas: `1`, `2` e `3` (Morador 1, 2 e 3).

### A1 · `tec-B01-02-03` · Do banco vazio até a cascata (uma gravação só) · **feito**
- [x] Terminal em tela cheia, mostrando o menu. `F9`, 2 s.
- [x] **B01** `1` → espere "Bairros, tipos, pessoas e estacoes do piloto gravados". 3 s parado.
- [x] **B02** `2` → `1` → `4` → `1` → `3` → digite `Caiu a luz na rua toda` → Enter. Espere "Ocorrencia
  gravada" e "Confirmacoes: 1". 3 s parado.
- [x] **B03** `2` → `1` → `4` → `2` → `3` → digite `Aqui tambem ficou sem luz` → Enter. Espere "Relato entrou
  na ocorrencia ativa", "Confirmacoes: 2" e as três linhas da cascata ("Estacao ETA Arquipelago sem energia",
  "Aviso de agua para: Centro Historico, Menino Deus, Praia de Belas", "Notificacoes: 3"). **5 s parado:**
  é o plano principal do vídeo. `F10`.
- [x] Arquivos: `bruto/docker/originais/2026-11-16 20-18-58.mp4`, `20-23-54.mp4` e `20-25-53.mp4` (este
  último não entrou). Pré-corte: **`bruto/docker/A1-take-unico.mp4`** (28,7 s, inclui o
  `docker start` e o Docker Desktop).

### A2 · `tec-B06-09` · O banco por fora do programa (DBeaver) · **feito**
Gravado antes da terceira confirmação, para o banco bater com o que a fala diz no T06.
- [x] Clique na linha da consulta, `Ctrl+Enter`, espere a grade, **4 s parado**:
  - [x] **B06** as 13 tabelas;
  - [x] **B07** a ocorrência: ATIVA, 2 confirmações (sem o nome de ninguém);
  - [x] **B08** a estação: `ETA Arquipelago` em `SEM_ENERGIA`, a drenagem do Bom Jesus em `OPERANDO`;
  - [x] **B09a** o alerta: `CASCATA`, "Possivel falta de agua", 3 notificações;
  - [x] **B09b** os bairros avisados (Centro Historico, Menino Deus, Praia de Belas).
- [x] **B10** a taxa de resolvidas: **regravado em 17/11** depois do A3, mostra 1 registrada, 1 resolvida,
  **taxa 100%**. Arquivo: `bruto/banco/originais/2026-11-17 12-26-13.mp4`.
- [x] Arquivos: `bruto/banco/originais/2026-11-16 21-02-04.mp4` (8:59) e `2026-11-17 12-26-13.mp4`.
  Pré-corte: **`bruto/banco/A2-take-unico.mp4`** (65,4 s). O B10 entra já escrito, logo depois do resultado
  do B09b; a digitação antiga e o resultado de 0% saíram. Versão anterior: `A2-take-unico-v1.mp4`.
- Ressalvas da edição (detalhes em `decupagem-A2.md`, "Versão 2"):
  - no B09a (0:46,8), o `COUNT()` digitado vira `COUNT(*)` no resultado: zoom de 150–200% na grade esconde;
  - na emenda B09b → B10, a árvore lateral do DBeaver recolhe e o `ID_BAIRRO` fica minúsculo: lê como troca
    de consulta; um zoom na grade do B10 esconde.

### A3 · `tec-B04-05` · Nenhum aviso repetido e o encerramento · **feito**
- [x] Terminal, `F9`, 2 s. (A janela não estava em tela cheia: a barra de abas foi cortada no pré-corte.)
- [x] **B04** `4` → `4` → `1` (a ocorrência) → `1` (Ainda esta) → `3` (Morador 3). "Confirmacoes: 3" e
  **nenhuma** linha de aviso, 4 s parado.
- [x] **B05** `4` → `4` → `1` → `2` (Ja voltou) → pessoas `1`, `2` e `3`. Na terceira: "Status: RESOLVIDA" e
  "Encerrada em: 16/11/2026 21:24". Seleção em "Status: RESOLVIDA".
- [x] **Passo final** (17/11): `3` → `4` → "Nenhuma ocorrencia ativa em Arquipelago.", com a linha
  selecionada. Arquivo: `bruto/console-a3/originais/2026-11-17 12-29-03.mp4`.
- [x] Arquivos: `bruto/console-a3/originais/2026-11-16 21-19-51.mp4` e `2026-11-17 12-29-03.mp4`. Pré-corte:
  **`bruto/console-a3/A3-take-unico.mp4`** (35,3 s). O take novo recebeu o mesmo recorte e escala do antigo
  (texto do mesmo tamanho). A emenda é corte seco para o menu numa tela limpa (o programa foi reaberto);
  se incomodar, o rótulo M06 "Consulta" no corte marca o passo novo. Versão anterior: `A3-take-unico-v1.mp4`.

---

## Bloco B · Código no IntelliJ (vídeo técnico) · **feito, B12 com ressalva**

Presentation Mode ligado. Para cada tomada: `Ctrl+Shift+N` → nome do arquivo → Enter, **fora da
gravação**. Depois `Ctrl+G` → número da linha → Enter, também fora. Só então `F9`, 2 s parado. Selecione
devagar com o mouse as linhas indicadas (a seleção serve de marca-texto), segure **4 s**, `F10`.

- [x] **B11** `model/Ocorrencia.java`, linha 18: o construtor; seleção do
  `throw new IllegalArgumentException("A severidade fica entre 1 e 3.")` (linha 42). → T08, orientação a
  objetos · `B11-ocorrencia-construtor.mp4` (8,5 s)
- [x] **B12a** `model/StatusEstacao.java`: `OPERANDO, SEM_ENERGIA, DESLIGADA` (linhas 4 a 6). → T08, enums ·
  `B12a-enum-statusestacao.mp4` (5,3 s). **Ressalva: sem seleção** no bruto; as três linhas estão legíveis
  com o zoom.
- [x] **B12b** `alerta_bairro.sql`, linha 121: o `CHECK (STATUS IN ('OPERANDO', 'SEM_ENERGIA',
  'DESLIGADA'))`. · `B12b-check-sql.mp4` (5,4 s). **Ressalva: gravado no VS Code**, não no IntelliJ, e **sem
  seleção**.
- [x] **Decisão B12 (17/11):** sem regravação. Callout na edição marca as linhas 4–6 do enum e a linha 121
  do `CHECK`; o B12b fica no VS Code.
- [x] **B16** `view/MenuPrincipal.java`: `escolherBairro` (166) com `bancoService.listarBairros()`
  selecionado (169); depois `escolher(... List<T> itens ...)` (217–222). → T08, listas ·
  `B16-listas-menu.mp4` (11,8 s; se o T08 tiver só ~2 s para listas, usar a partir de 6,8 s)
- [x] **B13** `service/OcorrenciaService.java`, `registrar` (24): seleção de `buscarAtivaNaJanela` (31–33) e
  de `somarConfirmacao`/`agrupada = true` (44–47). → T09, problema 1 · `B13-registrar-agrupa.mp4` (10,0 s)
- [x] **B14** `dao/EstacaoDAO.java`, `marcarSemEnergia` (65): seleção do `UPDATE ... WHERE ID_ESTACAO = ?
  AND TIPO = ? AND STATUS = ?` (67–69). → T10, problema 2 · `B14-update-trava.mp4` (9,7 s). A linha 76
  (`executeUpdate() == 1`) aparece só com o cursor, sem seleção, visível no zoom.
- [x] **B15** árvore do projeto com `model`, `dao`, `service` e `view` expandidos. → T02 ·
  `B15-arvore-projeto.mp4` (6,7 s)
- [x] Arquivos: `bruto/codigo/originais/2026-11-16 21-30-19.mp4` (2:35) e `2026-11-16 21-34-21.mp4` (6:23).
  Clipes em `bruto/codigo/`; rolo de revisão `B-codigo-rolo.mp4` (60,5 s).

---

## Bloco C · O app (pitch) · **nada gravado ainda**

### C1 · No computador (OBS) · **feito**
- [x] Protótipo no ar a partir do **clone** (`~/Documents/projects/global-solution-1-2026/frontend`), não da
  cópia do HackGov (lá não tem `node_modules`).
- [x] Chrome em `http://localhost:5173`, tela cheia.
- [x] **B25** fluxo: Início → "Abrir mapa" → Mapa (Praia de Belas, Centro Histórico) → Painel do bairro.
  → s08. Arquivo: `bruto/computador/originais/2026-11-17 12-38-28.mp4`. Clipe: **`B25-fluxo-computador.mp4`**
  (18,3 s). Para a s08 (~4 s): 0:00,5–0:04,7 (Início, faixa verde, mapa com setas) ou 0:09,4–0:13,4.
- [x] Extras do mesmo take: **`B28-reportar-ocorrencia-computador.mp4`** (26,4 s: Reportar completo →
  Ocorrência → "Já voltou" 1 de 3 → Início) e **`B29-meus-bairros.mp4`** (5,7 s). Todos recortados 1877×1056
  e reescalados (some a bolha de endereço do Chrome). Detalhes em `bruto/computador/decupagem-computador.md`.
- Cuidados: no B28, a faixa "Relato enviado. Avisamos quem segue o bairro." (0:15,6–0:18,6) pode sugerir
  notificação real; a narração não pode falar de aviso chegando no celular. O cursor salta em 0:18,7.
- [x] **Regravação** (`2026-11-17 13-48-13.mp4`): **`B27-teclado-foco.mp4`** (8,3 s, o contorno verde
  percorre o Início só pelo teclado) e **`B30-texto-maior-computador.mp4`** (5,7 s, só o cartão Acessibilidade:
  liga, o cartão cresce, desliga; "Seus dados" fora do quadro). Não ficaram no material: o "Pular para o
  conteúdo" (`F5` + um `Tab`, ~3 s) e o Alerta em cascata no computador (o do celular, B23, cobre).

### C2 · No Figma (OBS) · **feito**
Arquivo: `bruto/figma/originais/2026-11-17 12-48-04.mp4`. Clipes em `bruto/figma/`, recortados e
reescalados (a janela não estava em tela cheia). Os pans suaves foram **reconstruídos** a partir dos quadros
parados do arraste (o canvas é o gravado; o cursor some); as versões `-pan-real` são o movimento como foi
gravado. Detalhes em `bruto/figma/decupagem-figma.md`.
- [x] **B26a** Wireframes: `B26a-wireframes.mp4` (8,4 s), as 7 telas de longe e o pan da 1 à 7. → s08
  "sete telas": 0,0–3,0 s.
- [x] **B26b** Alta fidelidade: `B26b-alta-fidelidade.mp4` (7,0 s), pan nas 7 telas do celular. → s08
  "alta fidelidade": 2,0–5,0 s.
- [x] Extras: `B26d-alta-fidelidade-visao-geral.mp4` (4,0 s, celular e computador na mesma imagem → s08
  "computador": 0,0–3,0 s); `B26c-computador.mp4` (7,4 s, uso limitado: carregando imagens); panoramas em
  PNG (`B26a-…-panorama.png`, `B26b-…-panorama.png`) para pan próprio no Remotion.
- Não gravado, só se precisar: modo Apresentar navegando (~10 s no fluxo "Alertaí · celular").

### C3 · No celular (gravador de tela do próprio celular, sem OBS) · **feito**

**Tomada 2** (17/11, `bruto/celular/originais/WhatsApp Video 2026-11-17 at 13.08.46.mp4`, de novo 384×832
pelo WhatsApp): B20 a B23 prontos em `bruto/celular/` (a tomada 1 ficou com o sufixo `-t1`). A lista de
cortes está em `trabalho/edl-tomada2.json`: com o **arquivo original** do celular, os clipes saem em
resolução cheia sem decupar de novo (`decupagem-celular.md`, "Tomada 2").

- [x] **B20** `B20-inicio.mp4` (7,1 s): faixa verde → rolagem que para no mapa. → s05
- [x] **B21** `B21-reportar.mp4` (4,0 s; o B22 tem 4,8 s): Reportar → tipo → Enviar. Foi escolhido **Falta de água**, não Falta de
  luz; a fala do f06 não diz o tipo, então serve. A faixa "Avisamos quem segue o bairro" foi cortada (sugere
  push). Versão sem corte: `B21-reportar-completo.mp4` (18,3 s; **ainda mostra a faixa** nos últimos 1,6 s,
  não usar o fim). → s06
- [x] **B22** `B22-ocorrencia.mp4`: "Já voltou" muda de 0 para 1 de 3 e mostra "Obrigado! Registramos que
  voltou para você." O "Ainda está" fica desabilitado para quem relatou (é a regra). → s06
- [x] **B23** `B23-alerta-cascata.mp4` (10,6 s): Efeito cascata, rolando pelo porquê, o que fazer e os
  contatos 199, 193, 192 e 156. Aberto pela lista do mapa, não pela faixa verde. → s07
- [x] **B24** (tomada 3, `WhatsApp Video 2026-11-17 at 13.47.42.mp4`): `B24-texto-maior.mp4` (4,1 s), antes e
  depois: Meus bairros normal → corte → Texto maior ligado, seguindo para o Início ampliado. O toque na chave
  ficou de fora porque "Seus dados" aparece legível logo acima. **O Texto maior aumenta só 12,5%: não usar
  sob "dobrar de tamanho"** (ali entram as capturas do zoom de 200%). O toque na chave existe no computador:
  `bruto/computador/B30-texto-maior-computador.mp4`.
- [ ] (recomendado) Mandar o **original** da tomada 2 pelo cabo ou Google Drive, para refazer os clipes em
  resolução cheia. Arquivo: ______________________

Histórico da tomada 1:

Primeira tomada (17/11, `bruto/celular/originais/WhatsApp Video 2026-11-17 at 12.37.24.mp4`, 384×832 pelo
WhatsApp): só o B20 serviu. Nenhuma das ações de B21 a B24 foi feita (nenhum tipo tocado no Reportar, a
Ocorrência não abriu, a faixa verde não foi tocada, Texto maior não foi ligado). Clipes aproveitados:
`B20-inicio.mp4` (7,3 s), `B20-inicio-longo.mp4` (9,8 s) e os extras `X1-mapa-ao-vivo.mp4`,
`X2-painel-do-bairro.mp4` e `X3-reportar-tipos.mp4`. Detalhes em `bruto/celular/decupagem-celular.md`.


---

## Reset (só se o estado do banco sair errado)

- Errou no meio do A1 ou do A3 e o banco ficou num estado que não bate com a história: no DBeaver, rode
  `sql/reset-demo.sql` e refaça a partir do **B02** (o B01 já gravado continua valendo).
- Precisa regravar o **B01** ("Tabelas criadas"): me chame para recriar o banco do zero (~20 s).
- **Não rode o reset antes do passo final do A3**: ele precisa da ocorrência RESOLVIDA, que é o estado atual.
