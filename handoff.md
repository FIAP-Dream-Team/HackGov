# Handoff

Ponto de retomada do projeto. Uma janela nova, lendo **este arquivo mais o `CLAUDE.md`**, consegue continuar
de onde a anterior parou sem precisar do histórico da conversa.

A seção 1 é a parte viva e é o que se atualiza ao fechar uma sessão. As seções 2 em diante mudam pouco.
Toda afirmação de estado aqui foi verificada por comando, e os comandos estão na seção 8. Se algo neste
arquivo contradisser o disco, o disco vence e este arquivo é que está errado.

Última atualização: **25/11/2026**: Parte 2 da Fase 4 escrita e enviada na branch
`docs/dt-113-parte-2-backlog`, junto com o material dos vídeos e o projeto Remotion; `handoff.md` conciliado
com o do `origin/main`. O bloco da Global Solution é de 18/11, o do EC-1 de 08/11 e o da Fase 3 de 30/10.

---

## 1. Estado atual

### HackGov Fase 4 · "Sistema Enterprise" (entrega 06/12/2026)

**Cards criados no Linear em 17/11/2026**, exatamente como em `docs/fase-4-cards-linear.md` (que agora traz
os identificadores): 6 milestones `Fase 4 - …` (só `Fase 4 - Entrega` com data, 06/12), 7 cards `Entrega
acadêmica` (`DT-112` Parte 1 Vinícius, `DT-113` Parte 2 John, `DT-114` Parte 3 Brenda, `DT-115` Parte 4
Larissa, `DT-116` Parte 5 João, `DT-117` documentação/slides/roteiro/ZIP João, `DT-118` vídeo John) e 14
subcards `Implementação` (sob `DT-112`, com o Vinícius, que fica com tudo que mexe com Java: `DT-119` contrato
da API, bloqueado por `DT-132` e bloqueando `DT-120` e `DT-129`, e `DT-129` endpoints no Spring, em Todo;
`DT-120`–`DT-128` sob `DT-114`, com a Brenda; `DT-130`/`DT-131`
sob `DT-115`; `DT-132` sob `DT-113`, Vinícius). Project `HackGov` com data final 06/12/2026 e o critério de
saída da Fase 4 no conteúdo. A divisão está em `docs/decisoes.md` (linha de 17/11). O MCP do Linear funciona
nesta máquina (`list_teams` devolve só `Dream Team`).

**Próximo passo:** cada um começa a sua Parte; o John tem `DT-113` (novas user stories e critérios de
aceitação, depende do `DT-132` do Vinícius) e `DT-118` (vídeo, depois dos slides e do roteiro do João).
Pendências menores: o resumo e a seção "Fase do semestre" do project no Linear ainda falam das Fases 2/3;
`CLAUDE.md` e a skill `linear-workflow` ainda descrevem a Fase 2.

**Parte 2 (John), 25/11/2026:** escrita em `docs/fase-4/parte-2-ajustes-no-backlog.md`, commitada na branch
`docs/dt-113-parte-2-backlog` e enviada ao GitHub, ainda sem revisão do grupo. As cinco stories antigas ficam mantidas (posição do Vinícius em 23/11, linha em
`docs/decisoes.md`), com critérios de aceitação mais precisos em US01, US03 e US05. Entram onze stories novas,
US06 a US16: front-end (US06–US09), segurança (US10–US13), arquivos (US14 comprovante ou histórico, US15 CSV
do gestor) e fluxo (US16, novo horário depois da falta). Prioridade pela GUT; critérios de aceitação das sete
prioritárias (US10, US11, US06, US16, US07, US13, US14). As notas GUT e a US15 são proposta do John, a validar
com o grupo. No Linear: `DT-113` em In Progress desde 25/11 (falta revisão de quem não escreveu e entrega ao
João); `DT-132` segue em Todo, embora o Vinícius já tenha respondido; as stories novas não têm card.

Regras de texto que o John pediu para essa doc: sem travessão, linguagem simples e natural, e **status que o
colega marcou como pronto é tratado como pronto**. Por isso a US14 aparece como pronta, com base no `DT-128`
(Done, Larissa). Fato conferido em 25/11 depois de `git fetch`: o código de exportação ainda não está em
nenhuma branch remota, então precisa chegar ao repositório antes do ZIP.

**O que subiu na mesma branch (25/11):** a documentação dos vídeos (roteiros, decks, guias de edição e scripts
da Fase 3, do EC-1 e da Global Solution) e o projeto Remotion (composições, dados de sincronia, imagens e
fontes). **O que ficou de fora, por decisão do John e por tamanho:** a cópia do projeto da Global Solution em
`sources/global-solution/global-solution-1-2026-main` foi apagada (era só referência para o vídeo; o código
vive no repositório `FIAP-Dream-Team/global-solution-1-2026`, com clone em `~/Documents/projects/`), e a mídia
pesada (gravações brutas, vídeos finais, WAVs, arquivos do Premiere, cerca de 1,4 GB) continua só nesta
máquina, ignorada pelo `.gitignore` da raiz. Sem os WAVs de `remotion/public/`, o projeto Remotion abre mas
não renderiza o áudio dos vídeos da GS em outra máquina.

Outros fatos conferidos em 25/11:
- as Partes 1, 3 e 4 estão no código e em `docs/fase-4/` (contrato da API, `parte-3-prototipo-react.md`,
  `parte-4-seguranca.md`, prints); a Parte 1 e a Parte 5 chegaram como texto pelo John, sem arquivo no repositório;
- a Larissa fez o front (`DT-114`, `DT-120`–`DT-128`) porque o computador da Brenda quebrou;
- a cópia do contrato da API no Notion é a versão de 18/11, sem a parte de segurança que o arquivo do
  repositório ganhou em 24/11 (429, validade da sessão, perfis, `DELETE /api/equipe/sessao`);
- `DT-116` (Parte 5) segue em Todo embora o texto exista.

### Fase 4, estado do código (Vinícius e Larissa, até 24/11/2026)

Capítulo corrente: **Fase 4**. O texto abaixo desta nota ainda descreve a Fase 3 e está desatualizado onde
conflitar com o disco.

Parte 1 da Fase 4 está em código na `main`. A US01 (`DT-36`) foi mergeada pelo PR #2. A US02 (`DT-37`) pelo PR #3. A US03 (`DT-38`) pelo PR #4. A US04 (`DT-39`) pelo PR #5. A US05 (`DT-40`) pelo PR #6.

**Parte 3 (front React), 20/11/2026**, na branch `feature/fase-4-front-us01-us05`, ainda sem commit: as quatro rotas
(`/acompanhar`, `/equipe`, `/painel`, `/totem`) consomem a API real, só com as US01–US05. Nenhuma história nova foi criada:
a Larissa pediu para esperar. Estrutura e roteiro de demonstração em `src/README.md`. Testado no navegador: validação,
login, liberar, agendar, reagendar, chamar senha com painel via SSE, falta, totem, sessão vencida e servidor fora do ar.
Lacuna do backend: depois de uma falta, nem a equipe (409 "o agendamento precisa ser cancelado") nem o cidadão conseguem
remarcar. O botão foi retirado do front. Dados sintéticos ampliados no `DadosSinteticos.java`: 6 cidadãos, `MV-2026-0001` a `0006` em 3 especialidades e o login `gestor.centro` (tabela em `src/README.md`). O CORS do backend passou a aceitar qualquer porta de localhost. **Parte 4 (segurança), 24/11/2026:** limite de 5 tentativas com bloqueio de 5 min (app, totem e equipe), sessão que vence sem uso (30 min app/equipe, 3 min totem), `DELETE /api/equipe/sessao`, segregação de funções (atendente opera; gestor conclui e acompanha indicadores; regra decidida nesta sessão e ainda não validada pelo grupo) e totem que limpa a tela após 1 min parado. 15 testes em `SegurancaHttpTest`, 58 no total passando (inclui a conferência de unidade na chamada de senha, que faltava). Proteção contra iframe (cabeçalhos no backend e no Vite, script de reserva no index.html), testada com uma página de outra origem. Console H2 continua aberto sem senha (pendente). Textos das Partes 3 e 4 em `docs/fase-4/parte-3-prototipo-react.md` e `parte-4-seguranca.md`, com prints em `docs/fase-4/prints/`. Nada disso foi commitado. `LandingHome.tsx` já tinha `colorSystem` sem uso, e isso quebra o `npm run build` (erro TS6133 anterior a esta branch).

A fila da equipe, em `src/backend`, é do canal institucional. Atendente e gestor entram com o login da equipe. Token de cidadão recebe 403. Sem token, 401.

- `GET /api/equipe/fila` segmenta os encaminhamentos da unidade de lotação por especialidade. Fila vazia responde 200 com "Nenhum encaminhamento nesta unidade." `?especialidade=` sem encaminhamento devolve o segmento vazio, sem erro. Cada item traz protocolo, nome e status. CPF não sai. O nome fica neste canal: o painel público e o acompanhamento continuam sem ele.
- A ação pendente não é coluna. `AGUARDANDO_AGENDAMENTO` sem agendamento ativo vira `COBRAR_MARCACAO` ("Cobrar marcação"). O último agendamento em `FALTA` vira `REAGENDAR` ("Reagendar"). "Buscar resultado" não sai no JSON: o modelo lógico não tem dado para essa ação.
- A espera média está em `esperaMediaSegundos`. É a última permanência em `AGUARDANDO_AGENDAMENTO`, em segundos inteiros, fechada na troca de status ou no instante da consulta se a etapa ainda está aberta. Quem nunca entrou nessa etapa não entra na média. Sem amostra, a mensagem é "Ainda não há espera medida."
- A taxa de faltas é `taxaFaltasPercentual`, com `faltas` e `agendamentos`. O denominador ignora agendamento cancelado. Sem agendamento contável, a mensagem é "Ainda não há agendamento para calcular a taxa de faltas."
- `POST /api/equipe/encaminhamentos/{protocolo}/falta` registra a falta do agendamento ativo, só na unidade da equipe. O horário continua ocupado. O painel da sala deixa de mostrar a senha, porque o agendamento deixou de estar ativo. O reagendamento do cidadão continua exigindo agendamento ativo.

O acervo continua em memória. O dado sintético `MV-2026-0001` segue em `RECEBIDO_TRIADO`, especialidade Cardiologia, com os três horários livres da US03. Na fila da UBS Centro ele aparece sem ação pendente até a equipe liberar o agendamento. Não há falta semeada.

`docs/arquivos-fases/` está untracked e não faz parte dessa story. Os comentários do backend estão em português. O rascunho da Parte 1 está em `docs/fase-4/parte-1-versao-atual.md`. O contrato está em `docs/fase-4/contrato-da-api.md`. A coleção do Insomnia, com a base local, está em `docs/fase-4/insomnia/HackGov-Minha-Vez-local.json`. Os cards `DT-112`, `DT-119` e `DT-129` continuam em Todo: o texto ainda não foi entregue ao João nem o contrato passado à Brenda.

### Global Solution 2026 · Alertaí (vídeos até 17/11, `.txt` e ZIP até 18/11/2026)

**Estado em 18/11/2026, madrugada.** Os dois vídeos estão renderizados e o John está revisando. Nada
commitado. O bloco de 16/11 mais abaixo vale como histórico (setup, roteiros, gravações).

| Vídeo | Arquivo | Duração | Como foi feito / como refazer |
| --- | --- | --- | --- |
| Pitch (até 3:00) | `sources/video/global-solution/final/alertai-pitch.mp4` | 2:57, −14 LUFS (revisão de 18/11) | `global-solution/pitch-remotion.md` (composição `GSPitch`; seção "Revisão de 18/11") |
| Técnico (até 2:00) | `sources/video/global-solution/final/alertai-tecnico.mp4` | 1:58,3, −14,1 LUFS | `global-solution/tecnico-remotion.md` (composição `GSTecnico`, versão 3) |

**Os dois foram montados inteiros no Remotion** (o Premiere saiu do plano). Para ver: o mp4 em `final/`, ou
`npm run studio` em `sources/video/remotion` e escolher `GSPitch` ou `GSTecnico`.

**Pitch** (`remotion/src/GSPitch.tsx`, scripts em `remotion/scripts/gs-pitch/`): narração montada das 11 falas
dos oito arquivos do grupo (`build-narration.py`), alinhada palavra a palavra, cinco vozes tratadas, deck
`deck/alertai.html` com selo de quem fala. Revisões feitas a pedido do John: abertura com a cadeia de ícones
do app (chuva → luz → água) acendendo nas palavras; nenhum número com contador; só trechos rolados das
gravações do celular (sem barra do Safari, recarregamento, teclado ou seletor do iOS); entradas mais suaves.
**Revisão de 18/11, tarde:** a Larissa e o João acharam que o pitch não apresentava o produto (só falta
de água) e o grupo ajustou o roteiro em `global-solution/review/Roteiro_Pitch_Alertai (1).pdf`. Aplicado à
risca: f04 e f06 regravadas pela Larissa, f05 e a fala nova do mapa (cena `05m`, com a tela gravada por ele)
pelo João; s04 e s06 ajustadas ao texto falado. Versão anterior em `global-solution/backup/pitch-v1-2026-11-18/`.
Vídeo novo em `final/alertai-pitch.mp4` (2:57). O "2024" da f04 foi conferido de ouvido pelo John (o Whisper
transcreve "2004", erro de transcrição). **Sincronia refeita na noite de 18/11** a pedido do John (elementos
entravam atrasados): cada elemento fica legível quando a palavra começa; detalhes e medição no arquivo final
em `pitch-remotion.md`, seção "Sincronia refeita". Som igual ao anterior. Pendente: aprovação final do John.

**Técnico** (`remotion/src/gs/TecnicoEdit.tsx` + `tecnico/*.tsx`, scripts em `remotion/scripts/gs-tecnico/`):
narração **bruta** do John (`recursos/alertai-tecnico.mp3`, cópia em `audio/tecnico/narracao-bruta-original.mp3`)
cortada em 29 frases e remontada com pausas pelo sentido (`build.py`, lista `PHRASES`); cada plano começa numa
palavra (`SHOTS`); motions no tema escuro com os tempos medidos na fala (`src/data/gs-tecnico/beats.json`);
abertura `tecnico/Abertura.tsx` (logo + celular com proporção de iPhone que cresce em "No app"); código real
(B11, B13, B14, B15, enum/CHECK em duas faixas); mix com redução de ruído leve (`mix.py`). 23 planos.
Histórico das três versões (o que o John reprovou e o que mudou) no fim de `tecnico-remotion.md`.
Pendente: o John ouvir o áudio bruto tratado (redução de ruído pode precisar de ajuste) e aprovar o ritmo.

**Para revisar (fluxo de uma rodada):** editar `build.py` (pausas em `PHRASES`, planos em `SHOTS`) ou o
componente do motion → `python -E -P scripts/gs-tecnico/build.py` → `mix.py` → `npx remotion render GSTecnico
out/gs-tecnico.mp4` (~8 min, deixar em segundo plano) → `sheet.py` (folhas em `out/gs-tecnico-sheet-*.png`) →
remux com o `mix.wav` para `final/` (comando em `tecnico-remotion.md`). Limite: o total tem que ficar ≤ 1:58,5.
No pitch: `align.mjs` → `extract-deck.mjs` → `npx remotion render GSPitch out/gs-pitch.mp4` →
`finalize-audio.mjs` → copiar para `final/`.

**Depois da aprovação:** publicar os dois no YouTube como não listados (técnico primeiro), `.txt` com os
links (`DT-103`/`DT-104` técnico, `DT-101`/`DT-102` pitch), links na seção 17 da documentação, avisar o João
para a seção 16.2, ZIP por quem cadastrou o grupo (`DT-105`). Prazo da FIAP ON: 19/11.

**Armadilhas pagas em 17/11:**
- **Windows não diferencia maiúscula de minúscula no nome de arquivo:** criar `GSTecnico.tsx` sobrescreveu
  `GsTecnico.tsx` (o registro). A montagem vive em `TecnicoEdit.tsx`; o registro continua `GsTecnico.tsx`.
- **Narração bruta tem ruído que conta como voz:** os limites de voz são medidos na versão "enhanced" (mesma
  gravação, alinhada ao milissegundo) e o áudio é cortado do bruto; sem isso cada frase ganhava ~0,5 s.
- **Safari no iPhone muda de layout ao rolar** (barra de endereço grande + barra inferior no topo da página,
  pílula e sem barra ao rolar): só usar trechos rolados e esconder as linhas 0–92 da gravação.
- O `remotion.config.ts` fixa CRF global, que o ProRes recusa: as sobreposições saem por sequência PNG +
  `prores_ks` (já no `scripts/gs/render-tecnico.mjs`). Render H.264 com `--color-space=bt709`.
- `npx` com `shell: true` quebra no espaço de "John Silverio": passar caminhos relativos à pasta do Remotion.
- `python -E -P` não enxerga o `audio_dsp.py` ao lado do script: `treat-voice.py`, `mix.py` e `ab-samples.py`
  do pitch rodam com `python -E`.
- Agentes fork em paralelo, um por pasta ou por grupo de componentes, funcionaram bem (pré-cortes, motions,
  sobreposições, tema escuro); passar a eles o escopo de arquivos que não podem tocar.

Estado em **16/11/2026, ~23h**. Nada commitado. Tudo da GS fica em `sources/video/global-solution/`; o plano
vivo é o `backlog.md` (fases E1–E8). Material do grupo em `sources/global-solution/` (documentação em
`recursos/`, planilha da Brenda `recursos/relatorio_teste_usabilidade.xlsx`).

Dois vídeos: **técnico** (até 2:00, vale nota, só o John narra, tom informal de demonstração de tela,
montado no Premiere) e **pitch** (até 3:00, competição, os cinco narram, deck animado no Remotion como os
vídeos do HackGov, com takes curtos do app).

**Pronto:**
- setup (E1): clone em `~/Documents/projects/global-solution-1-2026`, Maven 3.9.16 em `~/tools`, Oracle no
  container `alertai-oracle` (`TZ=America/Sao_Paulo`; toda sessão: abrir Docker Desktop e
  `docker start alertai-oracle`). O banco está com a ocorrência 1 **RESOLVIDA** (estado final da demo).
  Reset para regravar: `sql/reset-demo.sql`; recriar do zero: `docker rm -f` + o `docker run` do backlog E1.2;
- roteiros: `roteiro-tecnico.md` (260 palavras, ~1:49) e `roteiro-pitch.md` (**definitivo**: é o que foi
  gravado; f08 e f10 reescritas pela Larissa e conferidas com a documentação); `roteiro-pitch-grupo.md` é
  gerado por `scripts/gerar-roteiro-grupo.py`; tempo por sílaba em `scripts/minutagem.py`;
- roteiros de edição: `edicao-tecnico.md` (timeline do Premiere) e `edicao-pitch.md` (cenas e âncoras);
- deck do pitch: 11 cenas em `deck/alertai.html` (Sora/Figtree, paleta Jacarandá, regras anti-"cara de IA"
  no topo do HTML), PNGs em `deck/export/`. **Exportar só com `node scripts/deck.mjs`**, que roda antes o
  verificador `deck/check-layout.js` (sobreposição, respiro de 16 px, título em uma linha, texto de SVG,
  fonte carregada) e não exporta se falhar;
- falas do pitch gravadas pelo grupo em `falas/` (João f02/f03, Brenda f04/f09 em `.ogg` do WhatsApp,
  Vinícius f06+f07, Larissa f08/f10), transcritas e comparadas em `falas/transcricao/transcricao.json`
  (`scripts/transcrever-falas.py`). Pitch medido: **2:39** com as falas do John estimadas. O teste de zoom
  200% que sustenta a frase da Larissa está em `falas/transcricao/zoom200/`;
- pré-cortes dos brutos do técnico (originais intocados em cada `originais/`, somente leitura; decupagem em
  cada pasta): `bruto/docker/A1-take-unico.mp4` (28,7 s), `bruto/banco/A2-take-unico.mp4` (75,9 s),
  `bruto/console-a3/A3-take-unico.mp4` (26,2 s), clipes de código em `bruto/codigo/` (B11, B12a, B12b, B13,
  B14, B15, B16 e o rolo `B-codigo-rolo.mp4`). Roteiro de gravação em `gravacao.md`;
- perfil "Alertaí · demo" no Windows Terminal (fragmento em
  `%LOCALAPPDATA%\Microsoft\Windows Terminal\Fragments\Alertai\`); os brutos usaram o terminal preto comum,
  e as regravações devem usar o mesmo terminal preto para casar.

**Próximos passos, em ordem:**
1. John grava: (a) A3 que falta: no terminal preto em tela cheia, opção `3` → bairro `4` → "Nenhuma
   ocorrencia ativa em Arquipelago", 3 s; emendar no fim do `A3-take-unico.mp4`; (b) Bloco C do
   `gravacao.md` (app no computador, Figma e celular) para o pitch; (c) as falas do pitch dele (f01, f05,
   f11); (d) a narração do técnico, assistindo aos takes prontos.
2. Decisões pendentes do John: B12a/B12b sem seleção e B12b gravado no VS Code (destacar na edição ou
   regravar ~15 s no IntelliJ); B10 mostra 0% de resolvidas (fica de fora ou regrava agora, que dá 100%);
   pedir à Brenda o áudio original em vez do `.ogg`, se houver.
3. Pitch no Remotion (E6): composição `GSPitch` a partir do pipeline do EC-1 (`scripts/ec-1/`, `DeckScene`,
   `SpeakerTag`), com `<video>` dos takes dentro do celular; tratar as cinco vozes, alinhar ao texto gravado
   (âncoras em `edicao-pitch.md`), renderizar com a correção do atraso do AAC.
4. Motions do técnico (M01–M11 do backlog E6) e montagem no Premiere (`edicao-tecnico.md`); na A2, dar zoom
   de 150–200% nas grades de resultado (fonte pequena) e esconder o `COUNT()` → `COUNT(*)` no corte.
5. Publicar não listado (técnico primeiro), `.txt` com os links (DT-103/101, DT-104/102), links na seção 17
   da documentação e aviso ao João para a seção 16.2; ZIP de quem cadastrou o grupo (DT-105).

**Armadilhas pagas nesta sessão:**
- o ffmpeg do Remotion (`@remotion/compositor-*`) é enxuto e não tem `freezedetect` nem saída `null`: use
  `remotion/node_modules/ffmpeg-static/ffmpeg.exe`; `-ss` antes do `-i` dá quadro impreciso na conferência
  (use depois);
- `python -I` ignora o site do usuário (openpyxl, PIL): use `python -E -P`; e `/tmp` do Git Bash não é o
  `/tmp` do Python no Windows (passe `cygpath -w`);
- heredoc do Bash comeu barras invertidas de JSON: escreva arquivos com a ferramenta de arquivo;
- uma regex com `re.S` sobre blocos `> ...` truncou os roteiros uma vez: troque texto com `str.replace`
  exato e confira a contagem depois;
- DBeaver marca `user_tables` como "Table not found" (análise semântica): desligar em Preferences;
- `document.fonts.check()` responde `true` para família não declarada e `FontFaceSet` não aceita métodos
  de array: o verificador do deck carrega as faces com `document.fonts.load` e itera com `forEach`;
- três agentes paralelos (fork) editando brutos em pastas separadas funcionou; passar a eles dados do banco
  (horários de `CONFIRMACAO`) acelerou achar as tentativas certas.

### Enterprise Challenge, Atividade 1 (IA e ciência de dados, entrega até 13/11/2026)

Proposta do grupo em `sources/video/ec-1/enterprise-challenge-proposta-ia-ciencia-de-dados.md`. Tudo do EC-1
está documentado em `sources/video/ec-1/README.md`.

Estado em 08/11/2026, nada commitado:
- roteiro `sources/video/ec-1/roteiro-ec1.md` (o texto lido); deck de 10 slides
  `sources/video/ec-1/deck/minha-vez-ec1.html`, PDF e PNGs em `deck/export/` (PDF ainda com o espaço do
  link do vídeo); "Grupo 1" saiu dos cabeçalhos;
- narração do John recebida (`ec-1/audio-enterprise-challange.wav`, copiada para `ec-1/audio.wav`),
  transcrita (98% das palavras do roteiro confirmadas) e alinhada; `roteiro.json` ajustado ao que foi falado;
- **vídeo renderizado, à espera da revisão do John:** `remotion/out/ec-1.mp4`, 4:02, 1920×1080, −14,0 LUFS,
  pico −1,2 dBFS, atraso do AAC medido em 0,0 ms; pares antes/depois em `remotion/out/ec-1-sync.jpg`;
- a gravação tem duas sessões de microfone (falas 2 a 6 mais perto); o `treat-voice.py` casa o timbre.
  Trechos para ouvir em `remotion/out/ec-1-ab/troca-slide-*.wav`. Detalhes no README do EC-1.

Próximos passos, em ordem:
1. John assiste `out/ec-1.mp4` e ouve as trocas dos slides 1→2 e 6→7; retoques finais.
2. Publicar não listado; `node scripts/ec-1/export-deck.mjs --video=URL`; ZIP com o PDF e `link-video.txt`.
3. Em aberto: TCU e Instituto Locomotiva seguem sem ano e link no repositório (regra do CLAUDE.md).

### Fase 3 (Cap 1 "É hora de armazenar os dados", entrega até 03/11/2026)

Modelo lógico, físico e DDL em `docs/modelo-logico/` e `docs/modelo-fisico/`; documentação da entrega em
`sources/video/fase-3/Documentação/documentacao-fase3.md`; deck de slides do grupo em
`sources/video/fase-3/HackGov Minha Vez · Fase 3.pdf`.

**Vídeo final pronto e aprovado pelo John:** `sources/video/remotion/out/fase-3.mp4` (4:20, 1920×1080,
−14 LUFS, pico −1,8 dBFS, áudio alinhado à imagem na amostra). O John foi postar no YouTube em 30/10.
Como foi feito, em uma linha: deck HTML próprio (`sources/video/fase-3/deck/minha-vez-fase3.html`, 15 cenas,
IBM Plex, visual revisado para não ter "cara de IA") renderizado pela composição `Fase3`, com cada
entrada, corte e movimento de câmera ancorado na palavra da narração (faster-whisper + alinhamento ao
`roteiro.json`); narração tratada voz a voz e mixada com a trilha. Tudo documentado, com comandos, em
`sources/video/fase-3/README.md`.

Decisões que valem lembrar:
- a fala que o roteiro dá à Brenda (seção 4) foi narrada pelo Vinícius; `roteiro.json` tem
  `speaker: vinicius` em f05 e, a pedido do John, o vídeo não explica isso. A Brenda aparece na equipe da
  capa e do encerramento;
- o `audio.wav` é a narração final e nunca é alterado; o tratamento grava cópias em
  `remotion/public/fase-3/` (`narracao.wav`, `trilha.wav`, `mix.wav`, todos no `.gitignore`);
- João, Larissa e Vinícius foram aprovados como estão; o John recebeu ajuste extra (clipping da gravação
  em 4:03, exciter linear, controle de pico) depois de soar estourado.

Próximos passos, em ordem:
1. Colar o link do YouTube (não listado) no PDF da documentação e nos slides: o PDF do deck ainda tem
   `[colar link]` na capa e no último slide.
2. Decidir o commit. Nada da Fase 3 foi commitado. Pode entrar: `sources/video/fase-3/` **sem** o
   `audio.wav` (68 MB), `remotion/scripts/fase-3/`, `remotion/src/` (Fase3, componentes, `data/fase-3/`),
   `remotion/public/fase-3/img` e `fonts`, `.gitignore`, `package.json`. Não entra: `audio.wav` e os WAVs
   gerados.
3. Não confirmado por ninguém: a medida de tom sugeriu outra voz em 0:20–1:31 (selo do João) e em
   3:20–3:47 (selo do Vinícius). O John assistiu e aprovou o vídeo; se alguém do grupo apontar troca de
   voz, o ajuste é o campo `speaker` em `src/data/fase-3/roteiro.json` e um novo `fase3:align` + render.

### Repositório

Branch `main`, que rastreia `origin/main` em `https://github.com/FIAP-Dream-Team/HackGov.git`. A Fase 1 (Cap 1)
foi entregue. Vídeo da Fase 2: composição `Fase2`, narração `sources/video/fase-2/audio.wav` (3:45)
alinhada em `src/data/fase-2/cues.json`. Pipeline copiado em `scripts/fase-2/` — os scripts da
Fase 1 não foram alterados. Tutorial de User Story em
`docs/como-criar-user-stories-no-linear.md`. Tokens de design em `docs/design/tokens.json`.
Protótipo no Figma [Minha vez](https://www.figma.com/design/jVZtzCqq1vTrkIXsqF5yHf/Minha-vez).
Fluxos e critérios de validação da Parte 3 em
`docs/fase-2-parte-3-prototipo-e-validacao.md` (rascunho para o PDF; `DT-27`/`DT-28` ainda Backlog).
Recorte Java do domínio alinhado ao modelo lógico nos itens de prioridade alta
(20/10/2026): nascimento obrigatório, protocolo e urgência, histórico de criação,
`UnidadeSaude` com origem, destino e filtro de vaga, reagendar cria outro
`Agendamento` apontando para o anterior, cancelar mantém o horário e grava a data,
limite de 2 reagendamentos e prazo de 24 h. Credenciais, chamada, contato e JPA
continuam fora. Registro em `docs/modelo-logico/alinhamento-java.md`.
Conferência: `DemoModelagem` e `RegrasDoEncaminhamentoTest`.
Parte 4 em `docs/modelo-fisico/modelo-fisico.md`. A figura é
`docs/modelo-fisico/minha_vez_fisico.png`, exportada do Data Modeler a partir de
`minha_vez_fisico.sql` (12 tabelas, com `CEP`). O `minha_vez_ddl.sql` da Parte 2 não foi
alterado.
Parte 5 em `docs/scripts-sql/scripts-sql.md`. O DDL é o mesmo `minha_vez_fisico.sql` da
Parte 4 (12 PK, 18 FK, 13 UNIQUE, 14 CHECK). Em 23/10/2026 rodou no H2 2.2.224 em modo
Oracle: 12 tabelas e 5 índices comuns. Os dois índices com `CASE WHEN` o H2 recusou; no
teste viraram coluna calculada. O arquivo SQL não foi alterado e não rodou num Oracle real.

### Linear

Workspace `FIAP Dream Team`, time `Dream Team`, prefixo `DT`, cycles desligados. Labels do projeto:
`Entrega acadêmica`, `User Story`, `Implementação`. Project `HackGov`. Capítulo em andamento: **Fase 3**.
Datas internas de 15/10/2026: Parte 2 em 19/10; Partes 1, 3, 4 e 5 em 23/10; PDF, roteiro e slides em 26/10; vídeo em 30/10; ZIP e entrega em 03/11. O enunciado colado não trazia o prazo da FIAP ON.

Milestones da Fase 3, criados em 15/10/2026. Responsáveis fechados pelo Vinícius em 15/10: Parte 1 e ZIP com João; Parte 2 e slides com Larissa; Parte 3, PDF e roteiro com Brenda; Partes 4 e 5 e vídeo com Vinícius.

- `Fase 3 - Parte 1 - Versão atual do projeto` — `DT-45` texto da evolução, `DT-42` wireframes, `DT-44` UML, `DT-43` Java
- `Fase 3 - Parte 2 - Modelo lógico` — `DT-46`
- `Fase 3 - Parte 3 - Formas normais` — `DT-47`
- `Fase 3 - Parte 4 - Modelo físico` — `DT-49`
- `Fase 3 - Parte 5 - Scripts SQL` — `DT-48`
- `Entrega da Fase 3` — `DT-50` PDF, `DT-51` slides, `DT-52` roteiro, `DT-54` vídeo, `DT-53` ZIP

Sprint 1 da Fase 2 virou filhos `Implementação` (`DT-55`–`DT-73`, T01–T19), sem milestone de Parte.
Horas do consolidado foram gravadas no campo de estimativa do Linear, que o time exibe como pontos; o
valor em horas está na descrição de cada card. Responsáveis conforme o consolidado da Fase 2.

| Story | Filhos |
| --- | --- |
| US01 `DT-36` | T03–T07, mais a base T01, T02, T18 e T19 (servem US01–US03; pai único é a US01) |
| US02 `DT-37` | T08–T12 |
| US03 `DT-38` | T13–T17 |
| US04 `DT-39` e US05 `DT-40` | sem filho |

`DT-41` é um card de teste da label `Implementação`, título pede para apagar. Não foi cancelado nesta sessão.

`docs/decisoes.md` existe. Serviço: saúde / atenção primária na UBS, produto Minha Vez. `DT-6` ainda
pode estar desatualizado em relação a esse arquivo.

---

## 2. O projeto em uma página

HackGov é projeto em grupo da FIAP sobre transformação digital da gestão pública: escolher um serviço público
real, diagnosticar um problema concreto percebido pela população próxima ao grupo, levantar requisitos, montar
backlog, analisar dados e propor a primeira versão conceitual de um sistema que será desenvolvido ao longo do
ano.

Capítulo em andamento: **Fase 3** (banco de dados). A Fase 2 foi entregue. Eixo: acompanhamento. Serviço:
saúde / medicina primária (filas da atenção primária). A Fase 1 (Cap 1) está entregue.

Entrega: `.ZIP` único com PDF das Partes 1 a 4, código ou GitHub, slides em PDF, e link do vídeo não listado
com o Java rodando. Alvos internos: partes 1 a 4 em 24/09; roteiro em 30/09; gravação e ZIP em 04/10.

Grupo 1: Vinícius Cardoso Junqueira, Brenda Cristina Martins Araújo, Ana Larissa Cristo Mendes, João Pedro
Thethê Andrade e John Vitor Silverio Pereira. Perfis e capacidades em `persona.md`.

---

## 3. Decisões já tomadas

Nenhuma delas está em `docs/decisoes.md` ainda, porque o arquivo não existe. Ao criá-lo, migrar estas linhas
para lá e deixar aqui só o ponteiro.

| Data | Decisão | Quem |
| --- | --- | --- |
| antes de 10/08/2026 | O eixo do produto é **acompanhamento**: o cidadão precisa saber em que pé está a solicitação sem ligar, ir presencialmente ou conhecer alguém dentro do órgão | votação do grupo |
| 10/08/2026 | Rastreamento no Linear via MCP em **escopo local**, chave pessoal do workspace da FIAP, sem tocar em outros workspaces da máquina | John |
| 10/08/2026 | Project `HackGov` único, guarda-chuva do ano, com milestones por fase, em vez de um project por capítulo | John |
| 11/08/2026 | A decisão do tema é **direcionamento**, não especificação. Detalhamento de requisito só na Fase 2 | John |
| 11/08/2026 | **Quem decide responsável é a reunião do grupo.** A alocação de `persona.md` é proposta e só se aplica a tarefa que a reunião não distribuiu explicitamente | John |
| 11/08/2026 | Dado da Parte 4 pode ser criado, mas dado inventado é rotulado como sintético na tabela e no documento, com a premissa escrita ao lado. Dado real vai com órgão, ano e link | John |
| 19/08/2026 | Serviço público: **saúde / medicina primária**, tema de filas no atendimento | grupo, comentário em `DT-6` |
| 15/09/2026 | Board da Fase 2: label `Entrega acadêmica` vs `User Story` / `Implementação`; sem milestone Sprint 1; User Stories ficam a cargo de `DT-21`/`DT-22` | Vinícius |

---

## 4. O que está bloqueado

**O enunciado colado não traz a data oficial da FIAP ON.** As datas nos cards são alvos internos: Parte 2 em 19/10, Partes 1, 3, 4 e 5 em 23/10, PDF, roteiro e slides em 26/10, vídeo em 30/10, ZIP em 03/11.

**`docs/decisoes.md` ainda não existe.** A decisão do serviço vive só no comentário de `DT-6`.

---

## 5. Próximos passos, em ordem

1. Conferir na FIAP ON se o prazo oficial da Fase 3 bate com o alvo interno de 03/11.
2. Executar a Sprint 1 nos filhos `DT-55`–`DT-73`.
3. Apagar ou cancelar `DT-41` (card de teste).

`README.md` ainda descreve o Cap 1 e o serviço em aberto. Atualizar quando for a vez da documentação humana.

---

## 6. Regras que a próxima janela precisa respeitar

**Não inventar RM, nome ou dado de pesquisa.** Não criar filhos `Implementação` no lugar de `DT-22`. Dado sintético é permitido pelo enunciado e é rotulado como
tal, com a premissa ao lado. Dado fabricado apresentado como real derruba a nota inteira quando alguém
pergunta a fonte.

**Não criar card no Linear antes de o dono aprovar a lista.** Identificador criado já entra em circulação e
renomear depois bagunça a referência de todo mundo.

**Não atribuir card por conta própria** quando existir decisão de reunião em contrário.

**Não afirmar que existe automação de status pelo GitHub**, porque ela não está configurada neste
repositório. Hoje quem move card é pessoa, pela MCP, com o OK do dono.

**Idioma:** documento, card e comentário em português. Identificadores e comentários de código em inglês.

A skill `linear-workflow` tem o resto: fronteira git versus Linear, o que é um card, definição de pronto e
isolamento do MCP. Ler antes de tocar em qualquer coisa no Linear.

---

## 7. Armadilhas já pagas

Cada uma destas custou tempo nesta sessão. Não pague duas vezes.

**Colar comando multilinha no fish.** Barra invertida de continuação com linha em branco no meio faz o fish
fechar o comando na primeira quebra e tratar o resto como comando novo. Foi assim que o servidor MCP entrou
sem o header de autenticação. Cole em uma linha só.

**`read -s` dentro de bloco colado.** O `read` consome a linha seguinte do próprio paste em vez de esperar
você digitar, e a variável termina vazia. O header ficou com a string `Bearer` e mais nada.

**O header precisa do esquema `Bearer `.** Sem ele o Linear responde 401 com mensagem que parece chave
inválida. Curiosidade útil: a API GraphQL do Linear aceita a chave crua no `Authorization`, o endpoint MCP
quer o `Bearer`.

**`claude mcp get` imprime a chave em texto puro** no transcript. `claude mcp list` não imprime. Para
inspecionar a config sem vazar segredo, leia o `~/.claude.json` e imprima só o comprimento e se começa com
`Bearer`.

**Servidor MCP carrega na abertura da sessão.** Adicionar o servidor no meio de uma sessão não faz as
ferramentas `mcp__linear__*` aparecerem nela. Reabra com `claude --continue` para manter a conversa.

**GraphQL do Linear tem teto de complexidade** em 10000. Consulta grande com vários níveis aninhados volta
`Query too complex`; quebre em duas. E `projectStatuses` é uma connection, então precisa de `{ nodes { ... } }`.

**Heredoc em `bash -c` come acentuação** se você não cuidar do encoding. Para mandar texto em português para
a API, escreva em arquivo com UTF-8 e leia do arquivo, em vez de embutir no heredoc.

**Um card do Linear tem um assignee só.** Entregável com dois donos vira dois cards, não um card com dois
nomes no corpo.

**A infra que a Brenda domina é infraestrutura de TI**, não infraestrutura urbana. Não entregue a ela a
pesquisa da frente de infraestrutura urbana por causa da palavra.

### Vídeo no Remotion (sessão de 30/10/2026)

**Volume por frame como função no `<Audio>` quebra o render de vídeo longo.** O Remotion vira a curva numa
expressão `if()` do ffmpeg que, em 4:20, não é lida (`Missing ')' or too many args`) e o render morre no
fim, depois dos frames. Mixe antes e entregue um WAV pronto.

**O MP4 do Remotion toca o áudio 42,7 ms atrasado.** São as 2.048 amostras de priming do AAC sem lista de
edição. `scripts/fase-3/finalize-audio.mjs` reencoda o áudio com compensação e mede deslocamento zero;
já roda dentro do `npm run render:fase3`.

**Exportar HTML com fonte do Google em Chrome headless cai em fonte reserva.** A Plex Mono saiu como
Courier. Fontes ficam locais em `sources/video/fase-3/deck/fonts/`.

**faster-whisper com PyAV 19 não decodifica** (`open() got an unexpected keyword argument
'metadata_errors'`). Decodifique com o `ffmpeg-static` e passe o array, como faz o `transcribe.py`.

**WAV dual-mono mede ~3 dB a mais no BS.1770** do que a mesma voz em mono. Normalize sabendo em qual dos
dois está medindo.

**Compressor depois de expansor levanta a sala e o ruído.** Medido: limiar 12 dB abaixo do pico tirou
7,6 dB da voz e, ao renormalizar, devolveu tudo ao fundo. Compressor leve antes, expansor depois.

**Reconstruir clipping por spline sem limite cria pico absurdo** (+13,9 dBFS no John). O excesso restaurado
fica limitado a +3 dB acima do teto.

---

## 8. Comandos de verificação

Estado do repositório:

```fish
git status -sb
git log --oneline -5
git remote -v
```

Config do MCP sem vazar a chave:

```fish
python3 -c "
import json
d = json.load(open('/home/johnsilverio/.claude.json'))
s = d['projects']['/home/johnsilverio/Documents/projects/HackGov']['mcpServers']
for n, c in s.items():
    a = (c.get('headers') or {}).get('Authorization', '')
    print(n, c.get('url'), 'BearerOk:', a.startswith('Bearer '), 'len:', len(a))
"
```

Estado do quadro, quando as ferramentas MCP estiverem carregadas: `list_teams` a partir deste diretório tem
que devolver apenas `Dream Team`, o que é a prova de que o escopo local está segurando. Depois `list_projects`
e `list_issues` para o resto.
