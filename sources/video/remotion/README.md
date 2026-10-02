# Vídeo HackGov — Minha Vez

Projeto Remotion que monta o vídeo de até 5 minutos exigido pelo Cap 1. A narração já gravada
(`../audio.mp3`) manda no tempo; os slides do deck (`../minhavez/HackGov Minha Vez v2.dc.html`) entram como
apoio visual, sincronizados fala a fala.

## A narração está remendada

`../audio.mp3`, como foi entregue, **está truncada**. A última frase do João termina em 189,15s, uma
palavra nova começa em 189,85s e o arquivo acaba 0,15s depois, no meio da sílaba: o "Muito obrigado!" foi
perdido na exportação.

A frase sobreviveu em `../joao2.mp4`, uma tomada separada, entre 18,55s e 19,18s.
`npm run repair-audio` corta o resto truncado, casa o nível da frase resgatada com a voz do próprio João no
vídeo (−4,6 dB de ajuste) e a recoloca em 189,82s, exatamente onde a original começava, preservando a pausa.

O resultado é **`public/audio.mp3`**, e é ele que todos os scripts leem — `detect-pauses`, `transcribe`,
`music-bed` e a composição. Os dois arquivos de origem não são tocados.

Se um dia aparecer uma exportação completa da narração, jogue ela em `public/audio.mp3`, apague
`scripts/repair-narration.mjs` do pipeline e rode `npm run prepare-data`.

## Como o tempo é descoberto

O `roteiro.md` traz marcações de 0:00 a 5:00, mas a narração real tem **3:27**. As marcações do roteiro não
servem, então o tempo sai do áudio:

1. **`npm run extract`** — lê as 14 `<section>` do deck e grava `src/data/slides.json`. O deck é
   autocontido (CSS e SVG inline, nenhuma imagem externa), então o HTML é reaproveitado literalmente e o
   frame sai idêntico ao slide.
2. **`npm run transcribe`** — o ffmpeg (`ffmpeg-static`, nada instalado na máquina) decodifica o mp3 para
   PCM 16 kHz mono e o Whisper roda em ONNX dentro do próprio Node, sem Python e sem API. Sai
   `src/data/transcript.json` com timestamp por palavra.
3. **`npm run align`** — alinha o texto conhecido do roteiro (`src/data/roteiro.json`) contra as palavras
   ouvidas usando Needleman-Wunsch global. O Whisper erra palavras; o alinhamento global absorve o erro em
   vez de confiar na transcrição. Daí saem os limites de cada fala, os pontos de âncora e a timeline dos
   slides em `src/data/timing.json`.

`npm run prepare-data` roda tudo na ordem: `extract`, `pauses`, `transcribe`, `align`.

### Quem decide o quê

As duas fontes de tempo têm forças opostas, e o `align` usa cada uma no que ela é boa:

| | Divisas **entre** falas | Posição das palavras **dentro** da fala |
| --- | --- | --- |
| `detect-pauses` (ffmpeg + pitch) | **decide** | não sabe |
| Whisper | erra | **decide** |

O Whisper `tiny` acerta 68% das palavras em português e colocou a passagem para o Vinícius meio segundo **antes** da Larissa parar de falar — a Larissa ainda está audível a 235Hz ali. Medição de pitch é evidência física; transcrição de um modelo pequeno não é. Então `detect-pauses` grava `src/data/boundaries.json` e o `align` sobrepõe as divisas dele, reescalando as palavras do Whisper para dentro do intervalo medido.

Se `boundaries.json` não existir, o `align` avisa e cai para as divisas da transcrição.

### Numeração dos slides

O número impresso em cada slide vem da **posição no vídeo**, não da posição no deck — o `extract` lê a ordem de `slide-map.json` e reescreve. Hoje: Landing Page 05→04, Telas do MVP 06→05, Requisitos Não Funcionais 04→06. O `.dc.html` não é tocado, então o PDF mantém a numeração original.

O vídeo termina **3,2s depois do áudio**. Sem isso o slide de encerramento ficaria 0,8s no ar, porque
"Muito obrigado" são as duas últimas palavras da narração. A constante é `OUTRO_SEC` em `align.mjs`.

### Alinhamento por pausas, sem modelo nenhum

`node scripts/detect-pauses.mjs` acha as divisas entre as dez falas direto no áudio, com o
`silencedetect` do ffmpeg. Roda em segundos e não baixa nada:

```bash
node scripts/detect-pauses.mjs
TRANSCRIPT=../src/data/transcript.pauses.json npm run align
```

Isso mede as **divisas entre falas**; o tempo dentro de cada fala é interpolado pela contagem de palavras.
As trocas de slide e os selos caem no lugar certo; as âncoras internas (como "Já a Oncologia") ficam
aproximadas. O Whisper corrige as âncoras internas.

### Como ele decide, e por quê

Três sinais, em ordem crescente de confiança:

1. **A pausa.** Necessária, longe de suficiente. Esta narração respira dentro das frases quase tanto quanto
   entre as falas, e a passagem da Brenda para o João quase não tem intervalo — a -34dB não existia
   candidata nenhuma ali, e a divisa caía 4s atrasada na pausa seguinte. Por isso o limiar é frouxo
   (-26dB, 0,14s): a peneira fina vem depois.
2. **O ritmo.** O número de palavras de cada fala é conhecido, então um corte que deixe alguém falando a
   400 palavras/min está errado, diga o que disserem os outros sinais.
3. **A voz.** Toda troca de locutor aqui cruza voz masculina e feminina, e isso aparece na frequência
   fundamental. `scripts/pitch.mjs` extrai F0 por autocorrelação a 8kHz (~2s para o áudio inteiro).

O script imprime, para cada fala, o ritmo e o F0 medido contra o F0 da própria pessoa. Se os cortes estão
certos, cada um dos cinco aparece com o mesmo pitch nas duas falas dele. É a verificação que os cortes não
conseguem falsificar, e foi ela que pegou todos os erros abaixo.

### Quatro erros que essa verificação pegou

Valem porque cada um parecia razoável antes de medir:

- **Pegar as nove maiores pausas.** Elas se amontoam no fim do áudio: 55 palavras em 8 segundos para a
  Brenda, 417 palavras/min.
- **Pontuar cada corte isoladamente.** Um corte só vale o que vale o trecho que ele deixa atrás. Pontuando
  ponto a ponto, o John ficou com 62 palavras em 6 segundos. O custo é do **intervalo**, não do corte.
- **Premiar a magnitude da mudança de voz.** Acima do limiar que prova a troca, um número maior não
  informa mais nada — e 58Hz venceu 42Hz, jogando a divisa 7s para trás.
- **Medir a voz só pela mediana do trecho inteiro.** Cinco segundos de Larissa não movem a mediana de
  dezoito segundos de Vinícius, então o corte adiantado passava despercebido. O erro mora nas pontas, então
  as pontas (2,5s de cada lado) são medidas à parte.

Uma armadilha de ferramenta, à parte: **`silencedetect` escreve em stderr e o ffmpeg sai com código 0**.
`execFileSync` só devolve stdout no sucesso, então a saída vinha vazia. É `spawnSync` e `result.stderr`.

### Baixar o modelo Whisper numa conexão ruim

`bash scripts/fetch-model.sh [modelo]` baixa os arquivos ONNX direto no cache do transformers.js usando
curl com `--continue-at` e `--retry`. O downloader da biblioteca não retoma, e aqui a conexão derruba o
socket do CDN no meio de um arquivo de 50MB (`UND_ERR_SOCKET`). Rodar o script de novo continua de onde
parou.

Padrão é `whisper-tiny` (~37MB). A ~6KB/s medidos aqui, `whisper-base` (~73MB) passa de duas horas.

### Rodar sem esperar o Whisper

`node scripts/make-sample-transcript.mjs` gera um transcript sintético que distribui as palavras do roteiro
uniformemente ao longo dos 190s reais. Serve para testar timeline, âncoras e render sem depender do
download do modelo:

```bash
node scripts/make-sample-transcript.mjs
TRANSCRIPT=../src/data/transcript.sample.json npm run align
```

Não use isso na entrega: os cortes caem fora do lugar dentro de cada fala.

## A trilha de fundo

`npm run music` gera a automação de volume (`src/data/music.json`) que a composição aplica frame a frame.
A trilha é `public/musica.mp3` (Infraction, "Your Dream", sem direitos autorais).

**Volume fixo não funcionaria aqui.** Medindo a narração, os cinco locutores estão **8,9 dB** distantes
entre si:

| Locutor | Nível da voz | Trilha embaixo dele |
| --- | --- | --- |
| Vinícius | −13,8 dB | −32,8 dB |
| John | −16,6 dB | −35,6 dB |
| Ana Larissa | −17,7 dB | −36,7 dB |
| Brenda | −17,7 dB | −36,7 dB |
| João Pedro | −21,9 dB | −40,9 dB |

Um volume calibrado para não atrapalhar o Vinícius passaria por cima do João Pedro. Então o nível da trilha
sai do nível de voz **de cada fala**, sempre 19 dB abaixo (`HEADROOM_DB`), com transição suave de 1,6s entre
locutores. Sem narração — abertura e encerramento — ela sobe para 7 dB abaixo da média da narração.

Outras três decisões:

- **A própria música varia 15 dB**, de uma intro a −27 dB até um clímax a −12 dB. Sem correção o leito
  sumiria na abertura e apareceria no meio. Ele é achatado em 75%, não 100%: leito totalmente plano soa
  morto.
- **O corte é assimétrico**, como num compressor: até −40 dB de atenuação, mas só +4 dB de reforço. Sem
  esse teto o achatamento pedia +12 dB no fim e desfazia o fade da própria música.
- **A faixa tem 2:24 e o vídeo 3:14.** Em vez de repetir e torcer, ela entra duas vezes com cross-fade de
  6s aos 108s, posicionada para o **fade natural da música cair em 189,5s**, em cima do slide de
  encerramento.

## Onde mexer

| Quero mudar | Arquivo |
| --- | --- |
| Qual slide entra em qual fala | `src/data/slide-map.json` |
| Quando cada elemento de um slide aparece | `src/data/reveals.json` |
| Quais elementos podem ser animados | `scripts/ui-fixes.mjs` |
| Texto de referência das falas | `src/data/roteiro.json` |
| Nome, RM e foto de cada integrante | `src/data/speakers.ts` |
| Cores, fontes, ritmo da animação | `src/theme.ts` |

`slide-map.json` é o único lugar a tocar para reordenar o vídeo. Cada slide aponta para uma fala e,
opcionalmente, para um `anchor` — um trecho literal da fala onde aquele slide deve entrar. Sem âncora, o
slide começa junto com a fala; vários slides sem âncora na mesma fala dividem o tempo pelo peso `share`.

Depois de editar, rode `npm run align` de novo. Não precisa transcrever outra vez.

## Fotos da equipe

Coloque os arquivos em `public/fotos/` e preencha `photo` e `rm` em `src/data/speakers.ts`. Enquanto a foto
não existe, o componente cai num avatar de iniciais na paleta do projeto — o vídeo renderiza normalmente.

As fotos aparecem em três lugares: a faixa da equipe na capa, o selo do locutor a cada troca de voz, e a
faixa da equipe no encerramento.

## Rodar

```bash
npm install
npm run prepare-data     # extract + transcribe + align
npm run studio           # preview interativo
npm run render           # out/minha-vez.mp4
```

## Decisões que valem revisar

- **A ordem no vídeo não é a ordem do deck.** Os slides 05 e 06 aparecem antes do 04, porque é ali que a
  narração descreve a landing page e as telas. O deck em PDF continua na ordem original.
- Os slides **05 (Landing Page)** e **06 (Telas do MVP)** não têm narração própria: o roteiro só traz a
  marcação `[exibir wireframes ou mockups]`. O 05 entra quando o John fala do agendamento em `f03`, e o 06
  quando a Larissa fala do painel de espera em `f04`.
- O slide **10 (Distribuição)** entra ancorado em "Já a Oncologia", dentro da fala `f07` da Brenda.
- O slide **14 (Encerramento)** entra em "Muito obrigado", no fim da fala `f10`.

## Elementos que entram junto com a fala

O slide inteiro não aparece de uma vez. Pedaços dele entram na palavra que os menciona: o bloco de
estatísticas do slide 02 em "Segundo o Instituto Locomotiva", a barra da Ortopedia em "A Ortopedia chega",
o card do Risco 01 em "A barreira tecnológica".

São duas peças:

- `scripts/ui-fixes.mjs` marca os elementos animáveis com `data-reveal="<id>"` durante a extração. É onde
  se decide **o que** pode ser animado, navegando a árvore do slide por índice de filho.
- `src/data/reveals.json` diz **quando** cada `id` entra, por um trecho literal da fala. Sem âncora, o
  elemento entra `offsetSec` depois do anterior do mesmo slide — útil para escalonar itens que a narração
  não cita um a um, como os cinco cards de RF.

### Quando a encenação é desligada sozinha

Encenar só vale se o espectador ainda tem tempo de ler o que foi segurado. O `align` calcula, para cada
slide, quanto tempo leva para ler o conteúdo animado (~4 palavras por segundo, mais meio segundo por bloco)
e compara com o tempo que resta de slide depois da primeira entrada. Não coube, o slide aparece inteiro de
uma vez.

Isso hoje desliga a encenação em três slides, e o motivo é o mesmo nos três — muito conteúdo, pouco tempo:

| Slide | Ler | Disponível |
| --- | --- | --- |
| 03 Requisitos funcionais | 18,3s | 11,2s |
| 07 Matriz GUT | 10,8s | 7,9s |
| 13 Riscos | 20,0s | 16,1s |

Para forçar num sentido ou no outro, use `modes` em `reveals.json`: `{"03": "staged"}` ou
`{"13": "immediate"}`.

### Travessões

O `extract` tira todo `—` do texto dos slides. Onde ele separava um rótulo de um valor, entra o `·` que o
deck já usa em vários lugares ("UBS Vila União · Cardiologia"); em prosa, ele só sai. Hoje são 12
ocorrências em cinco slides — "HackGov · Minha Vez", as cinco linhas da Matriz GUT, "O que pode dar errado
e como resolvemos". O `.dc.html` fica intocado, então o PDF mantém os travessões.

Duas garantias que valem conhecer:

- Um elemento marcado sem cue correspondente **quebra o `align`**, em vez de sumir do vídeo em silêncio.
- Uma âncora não encontrada, ou que cairia fora da janela do slide, é puxada para dentro dela e o console
  marca `[AJUSTADO]`. Aparecer cedo demais é recuperável; nunca aparecer, não.

Como o espaço do elemento fica reservado (a animação é opacidade, não `display`), o resto do slide não
salta quando um item entra.

Sobre a precisão: as âncoras dependem do tempo por palavra. Com a rota de pausas isso é interpolado dentro
de cada fala, então há uns décimos de erro; por isso cada elemento entra 0,35s **antes** da palavra
(`lead`), para já estar na tela quando ela sai. O Whisper aperta isso.

## Onde o selo do locutor pode ficar

O selo fica no **canto superior direito**, e não como lower third. É a única região que todo slide do deck
deixa livre: o texto corre pela esquerda e o rodapé carrega as citações de fonte. Um selo embaixo cobria
"Fonte: Instituto Locomotiva / Auditoria TCU" no slide 02 — justamente a atribuição que o trabalho precisa
mostrar.

Três casos onde o selo não aparece, em `CARD_BLOCKED` (`MinhaVez.tsx`):

- Slides **01** e **14**, onde a faixa da equipe já mostra as cinco pessoas com nome.
- Slide **06**, o único do deck com conteúdo no canto superior direito. O selo da Larissa é empurrado para
  o slide seguinte em vez de sumir.

## Duas armadilhas de animação neste render

Ambas apareceram como o selo do locutor "piscando" ao entrar e ao sair, e valem para qualquer coisa nova
que se anime aqui:

- **`backdrop-filter` sob opacidade animada.** O filtro precisa amostrar o que está atrás dele, e o Chrome
  recompõe essa amostra de forma inconsistente entre frames independentes. Num render frame a frame isso
  vira pisca-pisca. O selo usa fundo sólido.
- **`translate` fracionário.** Deslocar texto por 13,4px faz o Chrome rasterizar de novo num offset
  subpixel diferente a cada frame, e o texto cintila. Todo deslocamento aqui passa por `Math.round`.

## Conferir um slide sem renderizar o vídeo

```bash
npx remotion still SlideCheck out/check.png --props='{"index":6,"team":false}'
```

`index` é a posição no deck (0 = capa, 13 = encerramento), `team` desenha as fotos da equipe por cima.
