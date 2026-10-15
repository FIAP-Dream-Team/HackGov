# Vídeo Fase 2 — Minha Vez

Composição Remotion `Fase2`. Os 12 slides do PDF entram no tempo da narração
em `audio.wav` (3:45). Nada disto altera os arquivos da Fase 1: o pipeline
foi copiado para `sources/video/remotion/scripts/fase-2/`.

## JSON de tempo e conteúdo

| Arquivo | Papel |
| --- | --- |
| `src/data/fase-2/roteiro.json` | texto de cada fala |
| `src/data/fase-2/slide-map.json` | qual slide entra em qual fala (âncora) |
| `src/data/fase-2/boundaries.json` | início/fim de cada fala, medido no áudio |
| `src/data/fase-2/cues.json` | **fala + slides + horários** — o mapa para conferir |
| `src/data/fase-2/timing.json` | o que o Remotion renderiza |

Para mudar um corte: edite a `anchor` em `slide-map.json` e rode
`npm run fase2:align`.

## Números da fala no slide 11

O PDF traz 65%. A fala diz 60%. Só o JPEG do vídeo é corrigido
(`scripts/rasterize-fase2.py`). O PDF original não é tocado.

## Rodar

```bash
cd sources/video/remotion
npm run fase2:prepare    # raster + pausas + align
npm run studio           # composição Fase2
npm run render:fase2     # out/fase-2.mp4
```

Scripts só da Fase 2: `scripts/fase-2/detect-pauses.mjs`, `align.mjs`,
`transcribe.mjs`, `music-bed.mjs`, `pitch.mjs`.
