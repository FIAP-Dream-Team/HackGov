#!/usr/bin/env bash
# Monta os clipes do celular a partir do original do WhatsApp (somente leitura).
# Uso: bash trabalho/montar.sh   (rodar dentro de bruto/celular)
set -euo pipefail
FF="../../../remotion/node_modules/ffmpeg-static/ffmpeg.exe"
IN="originais/WhatsApp Video 2026-11-17 at 12.37.24.mp4"

# Sem recorte: exporta a tela nativa do celular (384x832), sem moldura nem upscale.
# A barra de endereço do navegador fica: ela encolhe sozinha na rolagem, então não dá recorte constante.
CROP="null"  # sem recorte: tela nativa 384x832 (pedido do John, 17/11)

# clip <saida> <inicio> <fim> <segura_final_s>
clip () {
  local out="$1" s="$2" e="$3" hold="$4"
  "$FF" -v error -y -i "$IN" -an \
    -vf "trim=start=$s:end=$e,setpts=PTS-STARTPTS,fps=30,$CROP,tpad=stop_mode=clone:stop_duration=$hold,format=yuv420p" \
    -c:v libx264 -preset slow -crf 16 -movflags +faststart "$out"
  echo "$out"
}

# B20 · Início: faixa verde parada, rolagem até o mapa inteiro na tela, segura no mapa.
clip B20-inicio-t1.mp4                    0.30  6.90 0.7
# B20 longo · a mesma rolagem até o fim do Início (botão "Reportar o que está acontecendo").
clip B20-inicio-longo-t1.mp4              0.30  9.60 0.5
# Extras (não pedidos, mas limpos e utilizáveis):
clip X1-mapa-ao-vivo.mp4              11.80 17.30 0.5
clip X2-painel-do-bairro.mp4          21.60 30.60 0.5
clip X3-reportar-tipos.mp4            67.80 73.40 0.5
