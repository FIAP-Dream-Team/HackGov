# Vídeo Fase 3 — Minha Vez

A narração (`audio.wav`, 4:16) manda no tempo. O roteiro (`roteiro-fase3.md`) e a documentação
(`Documentação/`) dão o conteúdo e a linha editorial. O vídeo alterna slides e figuras da documentação,
com cada elemento entrando na palavra que o cita.

Nada aqui altera as Fases 1 e 2: os scripts estão em `../remotion/scripts/fase-3/` e os dados em
`../remotion/src/data/fase-3/`.

## O deck

`deck/minha-vez-fase3.html` tem as 15 cenas, uma `<section class="scene">` por cena, em 1920×1080 e na ordem
do vídeo. Abra no navegador: cada cena aparece com o tempo, quem fala, o trecho da narração e a lista do
que entra e quando (lido de `deck/storyboard.js`, gerado pelo align).

| Atributo | O que marca | Onde fica o quando |
| --- | --- | --- |
| `data-reveal="id"` | elemento que entra junto com a fala | `reveals.json` |
| `data-focus="nome"` | região de uma figura, em % da imagem | `camera.json` |
| `data-camera="nome"` | enquadramento com que a figura abre | o próprio deck |
| `.mark` | anel de destaque desenhado sobre a imagem | `reveals.json` |

`?scene=05` mostra uma cena só, em 1920×1080. `?guides` desenha as regiões da câmera. Clicar numa figura
passa pelos enquadramentos dela.

### Sistema visual

Feito para fugir da "cara de IA" (fonte da moda, cartão com sombra em tudo, faixa colorida na borda,
pílulas, ícones decorativos, grades de caixas iguais). As regras valem para todas as cenas e estão no
comentário do topo do HTML:

- **Tipos:** IBM Plex Sans (texto e títulos), Plex Sans Condensed (números e capa), Plex Mono só para
  código e identificadores. As fontes ficam em `deck/fonts/` (OFL), para o deck abrir offline e exportar
  sem cair em fonte reserva.
- **Escala:** 19 nota, 21 rótulo, 27 corpo, 38 destaque, 64 título, 180/240 números. Espaço em múltiplos
  de 8, grade de 12 colunas, título e conteúdo sempre na mesma altura.
- **Cor com função** (valores de `docs/design/tokens.json`): verde é marca e válido, amarelo é o que a fala
  aponta agora, vermelho é problema, azul é banco de dados.
- **Superfícies:** filete de 1 px e espaço em branco; raio único de 6 px onde há moldura.
- **Topo:** as 5 partes da entrega, com a atual marcada, no lugar de rótulo em caixa alta.

A saída do JUnit na cena 04 é a real: os 5 testes foram rodados com o JUnit standalone em 30/10/2026
(`5 tests successful, 0 tests failed`).

### Imagens

As imagens em `deck/img/` são cópias de `Documentação/` com nomes legíveis, mais as fotos de
`sources/share/`. Nomes, datas e protocolos nos wireframes e na tabela da Parte 3 são cenário ilustrativo.
As datas do slide de regras e do terminal são as da saída do `DemoModelagem` registrada na documentação.

## Dados

Em `../remotion/src/data/fase-3/`:

| Arquivo | Papel | Quem escreve |
| --- | --- | --- |
| `roteiro.json` | texto de cada fala, como foi falado, e quem fala no áudio | à mão |
| `transcript.json` | palavras com tempo, do faster-whisper `small` | `fase3:transcribe` |
| `scene-map.json` | qual cena entra em qual fala (âncora) | à mão |
| `reveals.json` | quando cada `data-reveal` entra (âncora ou deslocamento) | à mão |
| `camera.json` | para onde a câmera vai e quando | à mão |
| `boundaries.json` | início e fim de cada fala, medidos | `fase3:align` |
| `cues.json` | **o mapa para conferir**: fala, cenas, narração, reveals e câmera | `fase3:align` |
| `timing.json` | o que o Remotion renderiza | `fase3:align` |
| `music.json` | volume da trilha frame a frame | `fase3:music` |
| `deck.json` | CSS, fontes e HTML de cada cena, lidos do deck | `fase3:extract` |

O `align` falha, sem gravar nada, se um id de `reveals.json` ou um foco de `camera.json` não existir no
deck, se uma âncora não for encontrada na fala, ou se uma cena ficar com menos de 2 s.

## Áudio

O `audio.wav` nunca é alterado. Três etapas geram o que o vídeo toca:

1. **`fase3:voice`** (`treat-voice.py` → `public/fase-3/narracao.wav`). Cada locutor recebe uma cadeia
   decidida pelas medidas dele: passa-alta; redução de ruído proporcional a quanto o fundo está acima de
   −45 dB sob a voz; remoção de reverberação (WPE) proporcional à cauda da sala; EQ de fase linear em
   terço de oitava, corrigindo 55% da distância até uma curva de voz clara (máximo 6 dB); compressor leve
   (1,5:1, só nas sílabas fortes); expansor 20 dB abaixo da voz (máximo 8 dB, abre 6 ms antes da palavra e
   fecha em 180 ms, para não cortar nada); de-esser só onde há sibilância em excesso; exciter só onde a
   gravação não tem agudo; nivelador lento de frase (±3 dB); limitador de pico real em −1,5 dBTP.
   No John, a ressonância de sala em 200 Hz–1 kHz recebe 75% de correção em vez de 55%. Cada fala é
   conferida por correlação cruzada: nenhuma amostra sai do lugar, e as emendas de 20 ms ficam antes de
   cada corte, dentro do silêncio, para cada voz passar só pela própria cadeia.

   Ajustes que corrigiram o John "estourado" nas palavras fortes, sem tocar nos outros três:
   - a gravação tinha clipping em 4:03 ("um índice único"): 28 trechos reconstruídos por spline no
     domínio original de 44,1 kHz, com o pico restaurado limitado a +3 dB (sem esse limite a curva criava
     um pico de +13,9 dBFS);
   - o exciter, que nele saturava 24 dB a mais nas sílabas fortes do que nas médias, passa a trabalhar
     linear (proporção de agudo constante) sempre que esse crescimento passa de 18 dB;
   - um controle rápido de pico (3:1) só nas palavras que passam 2 dB acima dos picos normais dele,
     ligado para quem tem clipping na gravação.
2. **`fase3:music`** (`music-bed.mjs` → `public/fase-3/trilha.wav`): a música 19 dB abaixo da voz de cada
   fala, entrando duas vezes (emenda aos 130 s), com a automação já aplicada. Passar o volume ao Remotion
   como função por frame quebra o render deste vídeo: vira uma expressão `if()` que o ffmpeg não lê.
3. **`fase3:mix`** (`mix.py` → `public/fase-3/mix.wav`, a única faixa do vídeo): passa-alta de 35 Hz e
   −2 dB em 2,5 kHz na música para abrir espaço para a voz, ducking de −2 dB (−5 dB em 1–5 kHz) enquanto
   alguém fala, e barramento em **−14 LUFS / −1 dBTP**, a referência do YouTube.

Resultado medido (relatórios em `src/data/fase-3/voice-report.json` e `mix-report.json`):

| Locutor | Fundo sob a voz, antes → depois | Problema principal tratado |
| --- | --- | --- |
| John | −48,6 → −49,8 dB (f01) | ressonância de sala em 400/630 Hz, clipping, picos de proximidade |
| João | −24,0 → −37,7 dB | ruído de fundo, médios-graves embolados, falta de presença |
| Larissa | −50,2 → −52,1 dB | falta de agudo (exciter), ajuste fino de presença |
| Vinícius | −31,6 → −38,2 dB | grave estourado, sibilância, sala |

A voz fica entre 21,0 e 24,6 dB acima da música em todas as falas. Para ouvir antes e depois com o mesmo
volume: `python scripts/fase-3/ab-samples.py` grava trechos em `out/fase-3-ab/`.

O `treat-voice.py` normaliza cada fala a −16 LUFS medindo em mono; o arquivo dual-mono lê cerca de 3 dB a
mais no BS.1770 (−13 LUFS). O nível final é o do mix.

## Remotion

A composição `Fase3` renderiza cada `<section>` do deck como está no navegador e só anima o que o deck
marca:

- `data-reveal` entra na palavra (opacidade e 14 px de subida, 14 frames);
- a figura segue `camera.json` (centro em linha reta, zoom geométrico, leve avanço enquanto parada);
- o item da legenda ligado ao foco atual fica aceso e os outros recuam;
- o selo do locutor aparece 4,5 s a cada troca de voz, fora da capa e do encerramento, onde a equipe já
  está com nome e RM.

As fontes são as mesmas do deck (`public/fase-3/fonts/`) e o render espera por elas e pelas imagens antes
de cada frame.

O MP4 que o Remotion grava traz as 2.048 amostras de "priming" do AAC sem a lista de edição que manda o
player pulá-las, e o áudio toca 42,7 ms atrás da imagem. O `render:fase3` roda em seguida o
`finalize-audio.mjs`, que copia o vídeo sem recomprimir, reencoda o `mix.wav` com a compensação e só
substitui o arquivo depois de medir deslocamento zero.

## Rodar

```bash
cd sources/video/remotion
pip install faster-whisper pypdfium2 pillow scipy soundfile pyloudnorm noisereduce nara_wpe   # uma vez
npm run fase3:transcribe   # só se o áudio mudar (~1,5 min)
npm run fase3:prepare      # align, voice, music, mix, extract e export, na ordem
node scripts/fase-3/stills.mjs        # frames de conferência em out/fase-3-stills/
npm run render:fase3       # out/fase-3.mp4 (render + áudio com o atraso do AAC compensado)
node scripts/fase-3/verify-render.mjs # duração, loudness e pares antes/depois em out/fase-3-sync.jpg
```

Depois de editar só o deck: `fase3:extract` e `fase3:export`. Depois de editar um mapa de tempo:
`fase3:align`, `fase3:music` e `fase3:mix`. Depois de mexer no tratamento de voz: `fase3:voice`,
`fase3:music` e `fase3:mix`.

O `transcribe.py` decodifica o áudio com o `ffmpeg-static` do projeto, porque o decodificador do próprio
faster-whisper quebra com o PyAV 19.
