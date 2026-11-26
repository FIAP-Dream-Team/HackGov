# Vídeo técnico no Remotion · como foi montado e como refazer

Montado em 17/11/2026 a partir da narração do John (`recursos/alertai-tecnico-enhanced-v2.mp3`, 1:49,7,
já tratada por ele), em vez do Premiere. Resultado: `final/alertai-tecnico.mp4`, **1:58,3**, −14,1 LUFS,
pico −4,0 dBTP (versão 3). Versão 2 (17/11, noite), depois do retorno do John (abertura feia, cortes demais, diagrama
que não aparecia). Composição `GSTecnico` (`remotion/src/gs/TecnicoEdit.tsx`).

## Backup

- O mp3 original fica intocado em `recursos/`; a cópia de trabalho é `audio/tecnico/narracao-bruta.mp3`
  (somente leitura). A narração remontada é `audio/tecnico/narracao-montada.wav`.
- Os pré-cortes de `bruto/` só são lidos (cópias em `remotion/public/gs-tecnico/takes/`).

## Passo a passo (de `sources/video/remotion`)

```bash
python -E -P scripts/gs-tecnico/build.py   # frases, pausas, lista de cortes (edl.json) e tempos dos motions (beats.json)
python -E -P scripts/gs-tecnico/mix.py     # voz leve + trilha com ducking, -14 LUFS (public/gs-tecnico/mix.wav)
npx remotion render GSTecnico out/gs-tecnico.mp4
python -E -P scripts/gs-tecnico/sheet.py   # folhas de conferência: início, meio e fim de cada plano
ffmpeg -i out/gs-tecnico.mp4 -i public/gs-tecnico/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest ../global-solution/final/alertai-tecnico.mp4
```

A transcrição palavra a palavra da narração está em `audio/tecnico/transcricao-bruta.json` (faster-whisper).

## Como a edição foi decidida

- **Frases e pausas.** A narração foi cortada em 29 frases nos limites reais da voz e remontada com pausas
  escolhidas para a imagem: respiro antes de explicar a cascata, silêncio sobre as 13 tabelas (B06) e sobre o
  indicador (B10), segura final no M11. Lista em `PHRASES` de `build.py`.
- **Cada plano começa numa palavra** (0,12 s antes dela), seguindo `edicao-tecnico.md` v2. Digitação e
  navegação aceleradas para caber no espaço da fala (até 4x); resultado sempre em 1x, segurando o último quadro.
- **Motions como componentes vivos**, com os tempos medidos na fala (`src/data/gs-tecnico/beats.json`, lido
  por `tecnico-beats.ts`): cada camada do M02, cada tabela do M03, cada linha do M07 e cada passo dos dois
  problemas acendem na palavra.
- **Sobreposições** (callouts) entram na palavra, mas nunca antes de o texto que marcam aparecer na tela.
- **Zoom** nas grades do DBeaver (B06, B07, B08, B09a, B10), com a caixa acompanhando; 5% fixo no Docker
  Desktop para tirar a barra de tarefas do Windows.
- **Celular (T01):** o B20 no topo da página (faixa do efeito cascata), dentro de uma moldura, com as barras
  do Safari fora da tela e a legenda "Protótipo do app em React, com dados simulados".
- **Corte seco** em tudo; as entradas são as dos próprios motions.

## Versão 2 (retorno do John: "atropelado", "não vi diagrama", abertura feia)

- **23 planos em vez de 33**, um assunto por fala. Saíram os planos picados: Docker, árvore do projeto, B06
  (13 tabelas, já ditas no M03), B13, B14, B16 e B10.
- **Abertura nova (`tecnico/Abertura.tsx`, M00)**, no estilo do fecho: logo e frase à esquerda, o app rodando
  num celular pequeno desde o primeiro quadro; em "No app" o texto sai pela esquerda e o celular cresce ao
  centro; em "Aqui, o motor" o celular volta ao lado e entra "Java 17 · Oracle".
- **M02 monta o diagrama inteiro em 1,2 s** (`entrada` em `beats.json`) e só o destaque segue a fala; fica 8 s
  na tela. O M03 fica 7 s.
- **Console contínuo**: os dois relatos e a cascata são um plano só do A1 (16 s), só com a digitação acelerada.
- **DBeaver com um enquadramento único** na grade para os três resultados (o zoom entra uma vez e segura).
- **Enum e CHECK numa tela só**, em duas faixas: o enum do IntelliJ em cima e a linha do CHECK inteira embaixo.
- **Pausas mais naturais** entre frases (0,35 a 0,8 s; 0,8 s entre falas).

## Versão 3 (17/11, noite): áudio bruto, celular de verdade, visual sério, mais código

- **Áudio bruto** (`recursos/alertai-tecnico.mp3`, mesma gravação, alinhada ao milissegundo com a "enhanced"):
  cópia em `audio/tecnico/narracao-bruta-original.mp3`. Os limites de voz continuam medidos na versão limpa
  (no bruto o ruído contava como voz); o áudio é cortado do bruto. Na mix: passa-alta 80 Hz, redução de ruído
  FFT suave (12 dB), de-esser leve, compressão e -14 LUFS. A voz fica ~39 dB acima do fundo.
- **Pausas pelo sentido da frase**: respiro depois de "Esse é o Alertaí", pausa longa depois de "Repara..."
  (a cascata aparece no console), enumerações mais corridas, pausa depois de cada problema.
- **Celular com proporção de iPhone** (~0,49): só trechos rolados (sem as barras do Safari), barra de status
  "9:41" e Dynamic Island desenhadas, corpo com botões laterais; em "vira aviso de falta de água" entra o
  Alerta em cascata.
- **Motions no tema escuro** (Tinta, caixas só com contorno, destaque em Jacarandá-claro, verde `#5FB98C` para
  cascata), coerentes com IDE, terminal e DBeaver.
- **Mais código gravado**: B15 (EstacaoDAO com o UPDATE) em "o DAO fala SQL"; B13 (registrar, `agrupada`) em
  "então a regra foi para o serviço"; B14 (marcarSemEnergia, `WHERE ... STATUS = ?`) em "a trava virou o
  update". Os motions dos problemas mostram o erro e a alternativa; a solução é o código real.
