"""Transcribe the EC-1 narration with word-level timestamps.

The Fase 1 and Fase 2 transcripts came from whisper-tiny running in Node, which
gets about two thirds of the Portuguese words right and only gives segment
timestamps from the quantised export. EC-1 stages slide elements on the word
that names them, so it needs real per-word times: faster-whisper gives them
natively, and the `small` model is accurate enough that align.mjs mostly
confirms the roteiro instead of guessing around it.

Output has the same shape as the Node transcripts, so align.mjs reads it
unchanged: { model, durationSec, text, words: [{ text, start, end }] }.

Requires: pip install faster-whisper
Usage:    python scripts/ec-1/transcribe.py  [model]
"""
from __future__ import annotations

import json
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
AUDIO = HERE.parents[2] / "ec-1" / "audio.wav"
PCM = ROOT / ".cache" / "ec-1" / "audio-16k.f32"
FFMPEG = ROOT / "node_modules" / "ffmpeg-static" / ("ffmpeg.exe" if sys.platform == "win32" else "ffmpeg")
OUT = ROOT / "src" / "data" / "ec-1" / "transcript.json"

MODEL = sys.argv[1] if len(sys.argv) > 1 else "small"

# Whisper biases towards words it has just seen in the prompt. These are the
# terms the narration uses that a general model would otherwise spell as
# ordinary Portuguese ("BCNF" as "B C N F", "VARCHAR2" as "varchar dois").
PROMPT = (
    "HackGov, Minha Vez, UBS, SUS, TCU, Instituto Locomotiva, LGPD, IA, chatbot, "
    "Ana Larissa, João Pedro, Vinícius, Brenda, encaminhamento, Recebido e Triado, "
    "reconhecimento de fala, modelo de linguagem, ciência de dados, anonimizados."
)


def decode_audio() -> np.ndarray:
    """16kHz mono float PCM, the format Whisper expects.

    Decoded by the same ffmpeg-static binary the Node scripts use, and cached at
    the same path they read. faster-whisper's own decoder goes through PyAV,
    whose `open()` dropped the `metadata_errors` argument in PyAV 19.
    """
    if not PCM.exists():
        PCM.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [str(FFMPEG), "-hide_banner", "-loglevel", "error", "-y", "-i", str(AUDIO),
             "-ac", "1", "-ar", "16000", "-f", "f32le", str(PCM)],
            check=True,
        )
    return np.fromfile(PCM, dtype=np.float32)


def main() -> None:
    if not AUDIO.exists():
        raise SystemExit(f"Audio not found: {AUDIO}")

    audio = decode_audio()
    print(f"  {audio.size} amostras = {audio.size / 16000:.2f}s")

    print(f"Carregando faster-whisper {MODEL} (primeira vez baixa o modelo)...")
    model = WhisperModel(MODEL, device="cpu", compute_type="int8")

    print(f"Transcrevendo {AUDIO.name}...")
    started = time.time()
    segments, info = model.transcribe(
        audio,
        language="pt",
        word_timestamps=True,
        initial_prompt=PROMPT,
        # The roteiro is read continuously; VAD would only risk trimming the
        # soft starts of a speaker's first word.
        vad_filter=False,
        beam_size=5,
    )

    words = []
    texts = []
    for segment in segments:
        texts.append(segment.text.strip())
        for word in segment.words or []:
            token = word.word.strip()
            if not token:
                continue
            words.append(
                {
                    "text": token,
                    "start": round(word.start, 3),
                    "end": round(word.end, 3),
                    "p": round(word.probability, 3),
                }
            )
        print(f"  {segment.start:7.2f}s  {segment.text.strip()[:90]}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "model": f"faster-whisper {MODEL} int8",
                "durationSec": round(info.duration, 3),
                "text": " ".join(texts),
                "words": words,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(
        f"\n{len(words)} palavras em {time.time() - started:.1f}s "
        f"({info.duration:.2f}s de audio) -> {OUT.relative_to(HERE.parents[1])}"
    )


if __name__ == "__main__":
    main()
