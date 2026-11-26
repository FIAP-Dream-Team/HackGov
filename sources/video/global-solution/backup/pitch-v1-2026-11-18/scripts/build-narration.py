"""Builds the pitch narration (one file, f01..f11 in order) from the files each member recorded.

Inputs: sources/video/global-solution/falas/ (never modified):
  john.mp3 (f01, f05, f11; John's own edit of his take), joao.mp4 (f02), joao2.mp4 (f03),
  brenda.ogg (f04), vinicius.mp4 (f06 + f07), lari.mp4 (f08), brenda2.ogg (f09), lari2.mp4 (f10).

Each fala is cut from its source between the Whisper word edges (falas/transcricao/), then the
edges are moved to where the voice really starts and stops, measured on the 10 ms energy envelope:
Whisper's edges can sit a couple of tenths inside a soft first consonant or a trailing vowel, and
cutting there clips content. A pad is kept on both sides, with short fades, and a fixed silence
goes between falas (shorter when the same person keeps talking). The cut between scenes then
lands in that silence (align.mjs measures it).

Output: sources/video/global-solution/audio/pitch/audio.wav (48 kHz mono, 24 bit) and
audio/pitch/falas.json (source, in/out and where each fala sits in the narration).

Usage:  python -E -P scripts/gs-pitch/build-narration.py
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
GS = HERE.parents[2] / "global-solution"
FALAS = GS / "falas"
OUT_DIR = GS / "audio" / "pitch"
FF = ROOT / "node_modules" / "ffmpeg-static" / "ffmpeg.exe"
SR = 48000

# (id, speaker, source file, Whisper start, Whisper end) in seconds of the source.
# Group files: falas/transcricao/transcricao.json; john.mp3: transcribed on 17/11.
# vinicius.mp4 holds f06 and f07: the split is the pause between "caro." (ends 16.64) and
# "Esse" (starts 17.14).
PLAN = [
    ("f01", "john", "john.mp3", 0.00, 14.60),
    ("f02", "joao", "joao.mp4", 0.00, 13.70),
    ("f03", "joao", "joao2.mp4", 1.36, 14.42),
    ("f04", "brenda", "brenda.ogg", 0.00, 13.30),
    ("f05", "john", "john.mp3", 15.10, 23.06),
    ("f06", "vinicius", "vinicius.mp4", 1.58, 16.64),
    ("f07", "vinicius", "vinicius.mp4", 17.14, 35.80),
    ("f08", "larissa", "lari.mp4", 0.70, 16.40),
    ("f09", "brenda", "brenda2.ogg", 0.00, 13.26),
    ("f10", "larissa", "lari2.mp4", 0.00, 19.06),
    ("f11", "john", "john.mp3", 23.62, 26.86),
]
#: Silence between two falas; a scene cut lands in it.
GAP_NEW_SPEAKER = 0.85
GAP_SAME_SPEAKER = 0.65
#: How far the voice edge may be searched outside Whisper's edge.
SEARCH_BEFORE, SEARCH_AFTER = 0.45, 0.70
#: Kept around the measured voice edge, and the fade over it.
PAD_BEFORE, PAD_AFTER, FADE = 0.10, 0.18, 0.025
#: Never cut into the neighbouring fala of the same source.
NEIGHBOUR_GUARD = 0.05


def load(name: str) -> np.ndarray:
    pcm = subprocess.run(
        [str(FF), "-v", "error", "-i", str(FALAS / name), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(pcm, dtype=np.float32).astype(np.float64)


def envelope_db(x: np.ndarray) -> np.ndarray:
    hop = SR // 100
    n = len(x) // hop
    frames = x[: n * hop].reshape(n, hop)
    return 20 * np.log10(np.sqrt((frames**2).mean(axis=1)) + 1e-9)


def voice_edges(x: np.ndarray, w0: float, w1: float, lo: float, hi: float) -> tuple[float, float]:
    """Moves Whisper's edges out to where the envelope falls into the noise floor."""
    env = envelope_db(x)
    i0, i1 = int(w0 * 100), int(w1 * 100)
    speech = env[i0:i1]
    floor = float(np.percentile(env, 8))
    peak = float(np.percentile(speech, 90)) if len(speech) else floor + 30
    thr = max(floor + 8, peak - 38)
    start = i0
    while start > max(int(lo * 100), i0 - int(SEARCH_BEFORE * 100)) and env[start - 1] > thr:
        start -= 1
    end = min(i1, len(env) - 1)
    quiet = 0
    limit = min(int(hi * 100), i1 + int(SEARCH_AFTER * 100), len(env) - 1)
    j = end
    while j < limit:
        quiet = quiet + 1 if env[j] <= thr else 0
        if quiet >= 12:  # 120 ms under the threshold: the voice is over
            j -= quiet - 1
            break
        j += 1
    end = max(end, j)
    return start / 100, end / 100


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cache: dict[str, np.ndarray] = {}
    pieces, report, t = [], [], 0.0
    for k, (fid, who, src, w0, w1) in enumerate(PLAN):
        x = cache.setdefault(src, load(src))
        dur = len(x) / SR
        same_src = [p for p in PLAN if p[2] == src and p[0] != fid]
        lo = max([p[4] + NEIGHBOUR_GUARD for p in same_src if p[4] <= w0] + [0.0])
        hi = min([p[3] - NEIGHBOUR_GUARD for p in same_src if p[3] >= w1] + [dur])
        v0, v1 = voice_edges(x, w0, w1, lo, hi)
        a = max(lo, v0 - PAD_BEFORE)
        b = min(hi, v1 + PAD_AFTER)
        seg = x[int(a * SR) : int(b * SR)].copy()
        f = int(FADE * SR)
        seg[:f] *= np.linspace(0, 1, f)
        seg[-f:] *= np.linspace(1, 0, f)
        if k:
            gap = GAP_SAME_SPEAKER if PLAN[k - 1][1] == who else GAP_NEW_SPEAKER
            pieces.append(np.zeros(int(gap * SR)))
            t += gap
        report.append({
            "id": fid, "speaker": who, "source": src,
            "whisper": [w0, w1], "voice": [round(v0, 2), round(v1, 2)], "cut": [round(a, 3), round(b, 3)],
            "at": round(t, 3), "length": round(b - a, 3),
        })
        print(f"{fid} {who:9} {src:13} whisper {w0:6.2f}-{w1:6.2f}  voz {v0:6.2f}-{v1:6.2f}  corte {a:6.2f}-{b:6.2f}"
              f"  -> {t:6.2f}s ({b - a:5.2f}s)")
        pieces.append(seg)
        t += b - a
    audio = np.concatenate(pieces)
    peak = np.abs(audio).max()
    if peak > 0.99:
        audio *= 0.99 / peak
    sf.write(OUT_DIR / "audio.wav", audio.astype(np.float32), SR, subtype="PCM_24")
    (OUT_DIR / "falas.json").write_text(json.dumps({"sr": SR, "falas": report}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{len(audio) / SR:.2f}s de narracao -> {OUT_DIR / 'audio.wav'}")


if __name__ == "__main__":
    main()
