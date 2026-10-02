#!/usr/bin/env bash
# Downloads the Whisper ONNX files straight into the transformers.js cache.
#
# The library's own downloader cannot resume, and this connection drops the
# HuggingFace CDN socket partway through a 50MB file (UND_ERR_SOCKET). curl
# resumes and retries, so the download survives the drops and transcribe.mjs
# then finds everything already cached.
#
#   bash scripts/fetch-model.sh [modelo]
#
# Default is whisper-tiny: at ~10KB/s here, base would take over two hours.
set -u

MODEL="${1:-whisper-tiny}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE="$ROOT/node_modules/@huggingface/transformers/.cache/onnx-community/$MODEL"
BASE="https://huggingface.co/onnx-community/$MODEL/resolve/main"

FILES=(
  "config.json"
  "generation_config.json"
  "preprocessor_config.json"
  "tokenizer.json"
  "tokenizer_config.json"
  "onnx/encoder_model_q4.onnx"
  "onnx/decoder_model_merged_quantized.onnx"
)

mkdir -p "$CACHE/onnx"

for file in "${FILES[@]}"; do
  target="$CACHE/$file"
  expected=$(curl -sIL "$BASE/$file" | grep -i '^content-length' | tail -1 | tr -d '\r' | awk '{print $2}')

  if [ -f "$target" ] && [ -n "$expected" ] && [ "$(stat -c%s "$target")" = "$expected" ]; then
    echo "ok      $file"
    continue
  fi

  echo "baixando $file ($((expected / 1024 / 1024)) MB)"
  # --retry-all-errors covers the socket close this connection keeps producing.
  curl -L --fail --progress-bar \
    --continue-at - \
    --retry 100 --retry-delay 3 --retry-all-errors \
    --speed-limit 1024 --speed-time 120 \
    -o "$target" "$BASE/$file" || echo "  ! falhou, rode de novo para retomar"
done

echo
echo "Cache em $CACHE"
ls -la "$CACHE/onnx"
