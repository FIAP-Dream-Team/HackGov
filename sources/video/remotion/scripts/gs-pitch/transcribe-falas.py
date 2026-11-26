"""Word times for the pitch narration, transcribed fala by fala with the roteiro as context.

transcribe.py reads the whole narration with the `small` model. On 18/11 that left 13 of the anchors that
start an element on screen without a measured time: it skipped Larissa's f08, wrote numbers as digits and
misheard a few words ("com risco de endereco"). Those anchors were interpolated between their neighbours
and the elements came in at the wrong moment.

Here each fala is cut from the assembled narration (its place is known exactly: audio/pitch/falas.json)
and transcribed alone by the `medium` model, with that fala's roteiro text as the initial prompt. The text
was checked by ear against the recordings (John, 18/11), so biasing Whisper to it only fixes spelling;
the times still come from the audio. Times are offset back to the narration.

Output: src/data/gs-pitch/transcript.json, same shape as transcribe.py writes, so align.mjs reads it as is.

Usage:  python -E -P scripts/gs-pitch/transcribe-falas.py [model]
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel
from scipy.signal import resample_poly

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
GS = HERE.parents[2] / "global-solution"
AUDIO = GS / "audio" / "pitch" / "audio.wav"
FALAS = GS / "audio" / "pitch" / "falas.json"
ROTEIRO = ROOT / "src" / "data" / "gs-pitch" / "roteiro.json"
OUT = ROOT / "src" / "data" / "gs-pitch" / "transcript.json"
MODEL = sys.argv[1] if len(sys.argv) > 1 else "medium"


def main() -> None:
    audio, sr = sf.read(AUDIO, dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    audio16 = resample_poly(audio, 1, sr // 16000).astype(np.float32)
    placed = json.loads(FALAS.read_text(encoding="utf-8"))["falas"]
    text = {f["id"]: f["text"] for f in json.loads(ROTEIRO.read_text(encoding="utf-8"))}

    print(f"Carregando faster-whisper {MODEL}...")
    model = WhisperModel(MODEL, device="cpu", compute_type="int8")
    t0 = time.time()
    words = []
    for f in placed:
        a, b = f["at"], f["at"] + f["length"]
        clip = audio16[int(a * 16000):int(b * 16000)]
        segments, _ = model.transcribe(
            clip, language="pt", initial_prompt=text[f["id"]], word_timestamps=True,
            condition_on_previous_text=False, vad_filter=False, beam_size=5,
        )
        got = [{"text": w.word.strip(), "start": round(a + w.start, 3), "end": round(a + w.end, 3)}
               for s in segments for w in s.words if w.word.strip()]
        print(f"  {f['id']:5} {a:7.2f}s  {len(got):3} palavras  {' '.join(w['text'] for w in got)[:110]}")
        words += got

    OUT.write_text(json.dumps({
        "model": f"faster-whisper {MODEL} int8, fala a fala com o roteiro como contexto",
        "durationSec": round(len(audio) / sr, 3),
        "text": " ".join(w["text"] for w in words),
        "words": words,
    }, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"\n{len(words)} palavras em {time.time() - t0:.0f}s -> {OUT}")


if __name__ == "__main__":
    main()
