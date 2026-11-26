"""Mixes the treated narration with the music bed into public/fase-3/mix.wav.

Inputs: public/fase-3/narracao.wav (treat-voice.py) and public/fase-3/trilha.wav
(music-bed.mjs, already sitting 19 dB under each speaker). The composition plays
only the file this script writes, so the final level and the final peak are
decided here, once, where they can be measured.

What the mix does on top of the bed's level automation:

  - carves room for the voice in the music: a 35 Hz high-pass and a gentle
    2 dB dip around 2.5 kHz, where speech intelligibility lives;
  - ducks the music while someone is actually talking, more in 1-5 kHz than
    elsewhere, and lets it breathe back in the pauses. Fast in (40 ms), slow
    out (400 ms), so it never pumps between words;
  - sets the bus to -14 LUFS, the reference YouTube normalises to, under a
    -1 dBTP true-peak limiter, and reports how hard the limiter worked.

Usage:  python scripts/fase-3/mix.py      (after treat-voice.py and fase3:music)
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal

from audio_dsp import HOP, SR, apply_gain, level_db, limiter, smooth

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
VOICE = ROOT / "public" / "fase-3" / "narracao.wav"
BED = ROOT / "public" / "fase-3" / "trilha.wav"
OUT = ROOT / "public" / "fase-3" / "mix.wav"
BOUNDARIES = ROOT / "src" / "data" / "fase-3" / "boundaries.json"
REPORT = ROOT / "src" / "data" / "fase-3" / "mix-report.json"

TARGET_LUFS = -14.0
CEILING_DB = -1.0
#: Extra ducking while a word is being spoken, on top of the bed automation.
DUCK_BROAD_DB = 2.0
DUCK_MIDS_DB = 3.0

METER = pyln.Meter(SR)


def load(path: Path) -> np.ndarray:
    audio, rate = sf.read(path, always_2d=True, dtype="float64")
    if rate != SR:
        raise SystemExit(f"{path.name} esta em {rate} Hz; o mix espera {SR} Hz.")
    return audio


def zero_phase_eq(x: np.ndarray, freqs: list[float], gains_db: list[float]) -> np.ndarray:
    """Linear-phase FIR through (freq, gain) points, delay removed; works per channel."""
    grid = np.concatenate([[0], np.geomspace(20, SR / 2 - 1, 600), [SR / 2]])
    curve = np.interp(np.log(np.clip(grid, 20, None)), np.log(freqs), gains_db)
    taps = 8191
    fir = signal.firwin2(taps, grid / (SR / 2), 10 ** (curve / 20))
    delay = (taps - 1) // 2
    return np.column_stack(
        [signal.oaconvolve(x[:, c], fir, mode="full")[delay : delay + len(x)] for c in range(x.shape[1])]
    )


def main() -> None:
    voice = load(VOICE)
    bed = load(BED)
    length = max(len(voice), len(bed))
    voice = np.pad(voice, ((0, length - len(voice)), (0, 0)))
    bed = np.pad(bed, ((0, length - len(bed)), (0, 0)))

    # --- where someone is talking, 0..1 on the 1 ms grid ------------------------
    lvl = level_db(voice.mean(axis=1))
    talking = (lvl > np.percentile(lvl, 90) - 25).astype(float)
    activity = smooth(talking, rise_ms=40, fall_ms=400)

    # --- music: carve, then duck ------------------------------------------------
    bed = signal.sosfiltfilt(signal.butter(2, 35, btype="high", fs=SR, output="sos"), bed, axis=0)
    bed = zero_phase_eq(bed, [200, 1200, 2500, 5000, 16000], [0, 0, -2, 0, 0])
    mids_sos = signal.butter(2, [1000, 5000], btype="band", fs=SR, output="sos")
    mids = signal.sosfiltfilt(mids_sos, bed, axis=0)
    rest = bed - mids  # zero-phase split: rest + mids == bed
    broad_gain = -DUCK_BROAD_DB * activity
    mids_gain = -(DUCK_BROAD_DB + DUCK_MIDS_DB) * activity
    bed = np.column_stack(
        [apply_gain(rest[:, c], broad_gain) + apply_gain(mids[:, c], mids_gain) for c in range(bed.shape[1])]
    )

    # --- bus ----------------------------------------------------------------------
    mix = voice + bed
    gain = TARGET_LUFS - METER.integrated_loudness(mix)
    stats = {}
    for _ in range(3):
        # The limiter takes a little loudness with it; a second pass makes it up.
        limited, stats = limiter(mix * 10 ** (gain / 20), CEILING_DB)
        miss = TARGET_LUFS - METER.integrated_loudness(limited)
        if abs(miss) < 0.1:
            break
        gain += miss
    mix = limited

    peak = np.max(np.abs(mix))
    if peak >= 1.0:
        raise SystemExit(f"Pico de {20*np.log10(peak):.2f} dBFS no mix. Nada foi gravado.")
    sf.write(OUT, mix, SR, subtype="PCM_24")

    # --- report ---------------------------------------------------------------------
    falas = json.loads(BOUNDARIES.read_text(encoding="utf-8"))["falas"]
    scale = 10 ** (gain / 20)
    print(f"Mix: {METER.integrated_loudness(mix):.1f} LUFS, pico {20*np.log10(peak):.2f} dBFS")
    print(
        f"Limitador ({CEILING_DB} dBTP): reducao maxima {stats['maxReductionDb']:.1f} dB, "
        f"mais de 1 dB em {stats['timeOver1dB'] * 100:.2f}% do tempo"
    )
    print("\nVoz sobre a trilha, por fala:")
    rows = []
    for f in falas:
        a, b = int(f["speechStart"] * SR), int(f["speechEnd"] * SR)
        v = METER.integrated_loudness(voice[a:b] * scale)
        m = METER.integrated_loudness(bed[a:b] * scale)
        rows.append({"id": f["id"], "speaker": f["speaker"], "voiceLufs": v, "musicLufs": m, "gapDb": v - m})
        print(f"  {f['id']} {f['speaker']:9} voz {v:6.1f} LUFS, trilha {m:6.1f} LUFS -> voz {v - m:4.1f} dB acima")
    REPORT.write_text(
        json.dumps({"targetLufs": TARGET_LUFS, "ceilingDb": CEILING_DB, "limiter": stats, "falas": rows}, indent=1),
        encoding="utf-8",
    )
    print("\n-> public/fase-3/mix.wav, relatorio em src/data/fase-3/mix-report.json")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
