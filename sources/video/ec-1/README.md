# Enterprise Challenge, Atividade 1 · Minha Vez com IA e ciência de dados

Entrega (prazo 13/11/2026): ZIP com os slides em PDF (até 10, com nome, RM e foto da equipe no início) e um
`.txt` com o link do vídeo; vídeo de até 5 minutos, não listado no YouTube, que também precisa ter o link nos
slides. O conteúdo vem de `enterprise-challenge-proposta-ia-ciencia-de-dados.md`.

| Arquivo | O que é |
| --- | --- |
| `enterprise-challenge-proposta-ia-ciencia-de-dados.md` | a proposta escrita pelo grupo, fonte de tudo |
| `roteiro-ec1.md` | o roteiro para ler e gravar (John narra sozinho) |
| `deck/minha-vez-ec1.html` | os 10 slides: são o PDF da entrega e as cenas do vídeo |
| `deck/export/` | PNG de cada slide e o PDF, gerados por `ec1:export` |
| `audio.wav` | a narração do John, **quando for gravada**; nunca é alterada |

O pipeline é o da Fase 3 (`../fase-3/README.md`), copiado para `../remotion/scripts/ec-1/` e
`../remotion/src/data/ec-1/`. Nada da Fase 3 muda.

## O deck

Mesmo sistema visual da Fase 3 (IBM Plex, filetes em vez de cartões, cor com função, raio único de 6 px),
descrito no comentário do topo do HTML. O que é novo aqui:

- **cor da IA:** amarelo tracejado marca o que a IA produz (rascunho); verde é o que o médico confirmou;
- **`data-anim`:** além do fade da Fase 3, cada elemento pode entrar com `wipe` (descobre de um lado),
  `draw` (desenha o traço do SVG), `count` (o número conta), `pop` (nós e anéis) ou `highlight` (o
  marca-texto passa sem esconder o texto). O `DeckScene` do Remotion lê isso; sem `data-anim`, é o fade de
  sempre, e a Fase 3 continua igual;
- **slide 07** é uma tela em HTML dentro de `.fig-canvas`, então a câmera da Fase 3 passeia por ela como
  passeava pelos diagramas;
- **slide 08** tem dados sintéticos, rotulados no slide com a premissa. O gráfico foi gerado por script
  (pontos exatos), com cores conferidas no validador da skill de dataviz;
- **`.only-pdf`:** o link do vídeo aparece no PDF e some no vídeo.

`?scene=07` mostra um slide só em 1920×1080; `?guides` mostra as regiões da câmera; `?video=URL` preenche o
link do vídeo.

## Antes da gravação (feito)

```bash
cd sources/video/remotion
npm run ec1:draft          # transcrição ESTIMADA no ritmo do John (158 pal/min), align e extract
node scripts/ec-1/stills.mjs        # quadros de conferência em out/ec-1-stills/
npm run render:ec1-draft   # out/ec-1-rascunho.mp4, sem som, para ver o movimento
npm run ec1:export         # PNGs e PDF dos slides em ../ec-1/deck/export/
```

Com a estimativa, cada corte cai no meio da pausa prevista entre os slides. Tudo isso é refeito quando a voz
chega.

## Depois da gravação

1. Colocar a narração em `sources/video/ec-1/audio.wav`.
2. `npm run ec1:transcribe` (faster-whisper `small`, tempos por palavra; ~1,5 min). Substitui a estimativa.
3. `npm run ec1:prepare`: align (agora com o silêncio medido entre as falas), tratamento de voz, trilha,
   mix a −14 LUFS, extract e export. O align falha, sem gravar nada, se uma âncora sumir, se uma cena ficar
   com menos de 2 s ou se o vídeo passar de 5:00.
4. Conferir `src/data/ec-1/cues.json` e os quadros de `node scripts/ec-1/stills.mjs`.
5. `npm run render:ec1` → `out/ec-1.mp4` (com a correção do atraso do AAC), e
   `node scripts/ec-1/verify-render.mjs` para duração, loudness e pares antes/depois.
6. Publicar não listado, depois `node scripts/ec-1/export-deck.mjs --video=URL` para o PDF final com o
   link, e montar o ZIP (PDF + `link-video.txt`, tudo numa pasta só).

Se a fala gravada mudar alguma palavra, ajustar o texto de `roteiro.json` para o que foi falado. As âncoras
de `reveals.json` e `camera.json` são trechos literais desse texto.

### A gravação de 08/11/2026

O John mandou `audio-enterprise-challange.wav` (3:58, 44,1 kHz, 24 bits, mono gravado em dois canais), que
foi copiado sem alteração para `audio.wav`. O vídeo ficou com 4:02. O que mudou no pipeline por causa dela:

- **o texto falado:** o `roteiro.json` agora tem o que foi dito (sem "Somos o Grupo 1", "Vinícius
  Cardoso", "Os grandes desafios disso é que…", "a IA não entra como diagnóstico…"), e nove âncoras de
  `reveals.json` acompanharam. O que o Whisper ouviu errado ("muito relatório", "OBS") ficou como no roteiro;
- **cortes com palavra colada:** quando o Whisper dá à primeira palavra de uma fala o mesmo tempo da última
  da anterior (aconteceu nos slides 4 e 6), o `align.mjs` corta no fim do silêncio medido, não no tempo do
  Whisper, que caía em cima da última palavra;
- **duas sessões de microfone:** as falas 2 a 6 foram gravadas com o microfone mais perto (+11 a +17 dB em
  125–200 Hz, −5 dB em 3–5 kHz em relação às falas 1 e 7 a 10). O `treat-voice.py` agrupa as falas por
  espectro e passa um EQ de casamento na sessão mais distante da curva-alvo antes da cadeia de sempre.
  Trechos para ouvir as duas trocas, bruto contra tratado: `remotion/out/ec-1-ab/troca-slide-*.wav`.

### Trilha

A da Fase 3 (`public/musica.mp3`, 2:24). O `music-bed.mjs` do EC-1 escolhe as emendas sozinho: a passada
seguinte retoma a faixa 14 s depois do início (a emenda aprovada na Fase 3), a última termina com o fade da
própria música no último quadro, e entra uma terceira passada quando duas não cobrem o vídeo. Nenhuma emenda
cai a menos de 2 s de um corte de slide. Testado com voz sintética em 4:21 (2 passadas) e 4:55 (3 passadas).
