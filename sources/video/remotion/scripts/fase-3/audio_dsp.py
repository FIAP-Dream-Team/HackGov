"""Shared DSP for the Fase 3 audio scripts (treat-voice.py, mix.py).

Everything here runs offline on a 1 ms grid and never shifts the signal in time:
the video is cut to the narration to the frame.
"""
from __future__ import annotations

import numpy as np
from scipy import signal
from scipy.ndimage import maximum_filter1d

SR = 48000
HOP = SR // 1000  # 1 ms analysis grid for every dynamics stage


def frame_db(y: np.ndarray, size: int) -> np.ndarray:
    n = len(y) // size
    power = (y[: n * size].reshape(n, size) ** 2).mean(axis=1)
    return 10 * np.log10(power + 1e-12)


def level_db(y: np.ndarray) -> np.ndarray:
    return frame_db(y, HOP)


def smooth(values: np.ndarray, rise_ms: float, fall_ms: float) -> np.ndarray:
    """One-pole smoothing with different time constants up and down, on the 1 ms grid."""
    up, down = np.exp(-1 / rise_ms), np.exp(-1 / fall_ms)
    out = np.empty_like(values)
    prev = values[0]
    for i, v in enumerate(values):
        c = up if v > prev else down
        prev = c * prev + (1 - c) * v
        out[i] = prev
    return out


def apply_gain(y: np.ndarray, gain_db: np.ndarray) -> np.ndarray:
    """Interpolates a 1 ms gain curve to the sample, so it never steps audibly."""
    centres = (np.arange(len(gain_db)) + 0.5) * HOP
    g = np.interp(np.arange(len(y)), centres, gain_db)
    return y * 10 ** (g / 20)


def true_peak_ms(y: np.ndarray) -> np.ndarray:
    """Peak per 1 ms frame, measured on a 4x oversampled copy (ITU-R BS.1770 true peak)."""
    out = np.empty(len(y) // HOP)
    chunk = 10 * SR
    for start in range(0, len(out) * HOP, chunk):
        stop = min(len(out) * HOP, start + chunk)
        lo, hi = max(0, start - 64), min(len(y), stop + 64)
        up = np.abs(signal.resample_poly(y[lo:hi], 4, 1))[(start - lo) * 4 : (stop - lo) * 4]
        out[start // HOP : stop // HOP] = up.reshape(-1, HOP * 4).max(axis=1)
    return out


def limiter(y: np.ndarray, ceiling_db: float, lookahead_ms: int = 5, release_ms: float = 60) -> tuple[np.ndarray, dict]:
    """True-peak limiter, offline: it sees the peak coming instead of delaying the audio.

    The gain needed per 1 ms frame is spread over the 5 ms before and after it
    (so it is already down when the peak arrives and has nothing to catch up
    on), recovers over 60 ms, and is checked again on the sample. Takes mono
    or (samples, channels); channels share one gain, so the stereo image holds.
    """
    channels = y if y.ndim == 2 else y[:, None]
    peaks = lambda x: np.max([true_peak_ms(x[:, c]) for c in range(x.shape[1])], axis=0)
    ceiling = 10 ** (ceiling_db / 20)
    need = np.minimum(1.0, ceiling / (peaks(channels) + 1e-12))
    need_db = 20 * np.log10(need)
    held = -maximum_filter1d(-need_db, size=2 * lookahead_ms + 1)  # min over the window
    gain_db = -smooth(-held, rise_ms=1, fall_ms=release_ms)          # fast down, slow back up
    gain_db = np.minimum(gain_db, held)
    out = np.column_stack([apply_gain(channels[:, c], gain_db) for c in range(channels.shape[1])])
    # Interpolation between frames can leave a sliver over the ceiling: clamp it.
    residual = np.max(peaks(out))
    if residual > ceiling:
        out *= ceiling / residual
    if y.ndim == 1:
        out = out[:, 0]
    stats = {
        "maxReductionDb": float(-gain_db.min()),
        "timeOver1dB": float(np.mean(gain_db < -1.0)),
    }
    return out, stats
