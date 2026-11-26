"""Loudness-matched before/after excerpts of each speaker, for listening.

Writes out/gs-pitch-ab/<speaker>-1-antes.wav and <speaker>-2-depois.wav: 8 s
from the middle of each speaker's first fala, raw recording against treated
voice, both at -20 LUFS. Matching the loudness keeps the comparison honest: a
louder clip always sounds "better" for the first few seconds.

Usage:  python scripts/gs-pitch/ab-samples.py      (after treat-voice.py)
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
RAW = HERE.parents[2] / "global-solution" / "audio" / "pitch" / "audio.wav"
TREATED = ROOT / "public" / "gs-pitch" / "narracao.wav"
OUT = ROOT / "out" / "gs-pitch-ab"
SR = 48000
LISTEN_LUFS = -20.0
SECONDS = 8.0


def mono48(path: Path) -> np.ndarray:
    audio, rate = sf.read(path, always_2d=True, dtype="float64")
    mono = audio.mean(axis=1)
    if rate != SR:
        g = np.gcd(SR, rate)
        mono = signal.resample_poly(mono, SR // g, rate // g)
    return mono


def main() -> None:
    raw, treated = mono48(RAW), mono48(TREATED)
    falas = json.loads((ROOT / "src" / "data" / "gs-pitch" / "boundaries.json").read_text(encoding="utf-8"))["falas"]
    meter = pyln.Meter(SR)
    OUT.mkdir(parents=True, exist_ok=True)
    seen = set()
    for f in falas:
        if f["speaker"] in seen:
            continue
        seen.add(f["speaker"])
        mid = (f["speechStart"] + f["speechEnd"]) / 2
        a, b = int((mid - SECONDS / 2) * SR), int((mid + SECONDS / 2) * SR)
        fade = np.ones(b - a)
        ramp = int(0.05 * SR)
        fade[:ramp], fade[-ramp:] = np.linspace(0, 1, ramp), np.linspace(1, 0, ramp)
        for tag, source in (("1-antes", raw), ("2-depois", treated)):
            clip = source[a:b] * fade
            clip *= 10 ** ((LISTEN_LUFS - meter.integrated_loudness(clip)) / 20)
            sf.write(OUT / f"{f['speaker']}-{tag}.wav", np.column_stack([clip, clip]), SR, subtype="PCM_24")
        print(f"  {f['speaker']:9} {mid - SECONDS / 2:6.1f}s a {mid + SECONDS / 2:6.1f}s ({f['id']})")
    print(f"-> {OUT}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
