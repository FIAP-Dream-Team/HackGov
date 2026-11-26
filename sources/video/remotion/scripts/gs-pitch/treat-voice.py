"""Treats the EC-1 narration and writes public/gs-pitch/narracao.wav.

Copy of scripts/fase-3/treat-voice.py, run on one voice: John narrates the
whole EC-1 video. The chain is unchanged and every decision still comes from
measurements of the recording (noise under the voice, room decay, distance of
the long-term spectrum to a clear-speech curve, sibilance, missing air,
clipping), so a new recording gets its own settings. HEARD_ROOM keeps the light
de-reverb pass the Fase 3 review asked for on John's room.

New here: the EC-1 take has two sessions in one file (f02-f06 were recorded
with the mic closer, 11-17 dB more at 125-200 Hz than f01 and f07-f10).
find_takes groups the falas by spectrum and matches every session to the one
nearest the target curve before the chain runs, so one EQ fits the whole voice.

Two rules hold for the whole chain:

  - nothing moves in time. Every filter is zero-phase or compensated and each
    fala is checked by cross-correlation against the raw recording: the video
    is cut to the narration to the frame;
  - nothing is cut. The expander looks ahead and never takes more than a few dB.

The raw file (sources/video/global-solution/audio/pitch/audio.wav) is never modified.

Usage:  python scripts/gs-pitch/treat-voice.py     (after gsp:align on the real audio)
Requires: pip install numpy scipy soundfile pyloudnorm noisereduce nara_wpe
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import noisereduce as nr
import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from nara_wpe.utils import istft, stft
from nara_wpe.wpe import wpe
from scipy import signal
from scipy.interpolate import CubicSpline
from scipy.ndimage import maximum_filter1d

from audio_dsp import HOP, SR, apply_gain, frame_db, level_db, limiter, smooth, true_peak_ms

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
RAW = HERE.parents[2] / "global-solution" / "audio" / "pitch" / "audio.wav"
OUT = ROOT / "public" / "gs-pitch" / "narracao.wav"
BOUNDARIES = ROOT / "src" / "data" / "gs-pitch" / "boundaries.json"
REPORT = ROOT / "src" / "data" / "gs-pitch" / "voice-report.json"

#: Loudness of each treated fala, measured on the mono voice. The file is written
#: dual-mono, and BS.1770 sums both channels, so it reads about 3 dB higher
#: (-13 LUFS). The mix sets the final level, -14 LUFS, either way.
VOICE_LUFS = -16.0

#: Octave bands, for the report.
BANDS = [(60, 120), (120, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 4000), (4000, 8000), (8000, 16000)]
#: Long-term spectrum of clear, close-miked speech, per octave band, in dB
#: relative to the 1-2 kHz band. Shaped on the LTASS of Byrne et al. (1994),
#: with the 2-4 kHz band 2 dB up for intelligibility over a music bed.
TARGET = {
    "male": [-6, 3, 5, 3, 0, -2, -6, -14],
    "female": [-12, 0, 5, 3, 0, -2, -6, -14],
}
#: The EQ itself works in third-octave bands: a small-room resonance is narrower
#: than an octave and disappears into one. ISO centres, 63 Hz to 16 kHz.
THIRDS = [63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600,
          2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000]
REFERENCE_THIRDS = (1000, 1250, 1600)
#: Share of the distance to the target the EQ corrects, and the most it may move a band.
#: About half-way, never more than 6 dB, keeps each voice recognisably itself.
EQ_AMOUNT = 0.55
EQ_LIMIT = 6.0
#: An upper band this far under the target has no content to boost: the exciter handles it.
BAND_LIMITED_DB = -10.0
#: True-peak ceiling of the voice stem.
CEILING_DB = -1.5
#: Where the background between words should sit, relative to the voice's loudness.
NOISE_TARGET_DB = -45.0

#: Rooms heard during review that the decay measurement does not show. John's
#: recording has a short measured decay (its own noise suppressor cuts the
#: tails), but the room is audible inside the words, so he gets a light pass.
HEARD_ROOM = {"john": 0.35}
#: Share of the 200 Hz-1 kHz resonances corrected on those voices.
ROOM_EQ_AMOUNT = 0.75


#: A sample this close to full scale, in a run of 2 or more, was clipped by the recorder.
CLIP_DBFS = -0.1
#: How far above the clip level a rebuilt peak may go.
RESTORE_MAX_DB = 3.0

#: Two falas of one speaker whose long-term spectra differ by more than this
#: (RMS over the TAKE_RANGE thirds) were recorded in different sessions: another
#: mic position or another mic. Inside the EC-1 take the falas of one session
#: differ by 2-4 dB; f02-f06 sit 8-10 dB away from f01 and f07-f10.
TAKE_SPLIT_DB = 5.0
TAKE_RANGE = (100, 12500)
#: The match EQ is the same voice in the same room, so it goes all the way, up
#: to this much per band.
MATCH_LIMIT = 15.0
#: Exciter harmonics that grow this much more on the loud passages than on the
#: middle ones read as distortion, not air: the exciter then works level-linear.
EXCITER_GROWTH_DB = 18.0

CLIPPED_AT: list[float] = []  # seconds of each repaired run, filled by load_raw


# --------------------------------------------------------------------------- io
def declip(x: np.ndarray, rate: int) -> np.ndarray:
    """Rebuilds runs of clipped samples with a cubic spline through their neighbours.

    Runs on the recording's own sample rate, before anything else touches the
    signal: resampling first would smear each flat top into its surroundings.
    Only the clipped samples change.
    """
    x = x.copy()
    limit = 10 ** (CLIP_DBFS / 20)
    hot = np.abs(x) >= limit
    edges = np.flatnonzero(np.diff(np.concatenate([[0], hot.astype(int), [0]])))
    for start, stop in zip(edges[::2], edges[1::2]):
        if stop - start < 2:
            continue
        left = np.arange(max(0, start - 6), start)
        right = np.arange(stop, min(len(x), stop + 6))
        known = np.concatenate([left, right])
        if len(left) < 2 or len(right) < 2:
            continue
        # The spline gives the shape; the size is bounded. Over a long flat top an
        # unconstrained spline overshoots: on John's "um indice unico" it rebuilt a
        # +13.9 dBFS spike, which the limiter then had to pull down by 16 dB. The
        # real wave went over the clip level (that is why it clipped), but not by
        # much: the excess is scaled so the restored top sits at most 3 dB above.
        shape = np.abs(CubicSpline(known, x[known])(np.arange(start, stop)))
        excess = np.maximum(shape - limit, 0)
        room = limit * (10 ** (RESTORE_MAX_DB / 20) - 1)
        if excess.max() > room:
            excess *= room / excess.max()
        x[start:stop] = np.sign(x[start:stop]) * (limit + excess)
        CLIPPED_AT.append(start / rate)
    return x


def load_raw() -> np.ndarray:
    audio, rate = sf.read(RAW, always_2d=True, dtype="float64")
    audio = np.column_stack([declip(audio[:, c], rate) for c in range(audio.shape[1])])
    # The two channels correlate at 0.95: it is a mono voice. Averaging keeps it
    # centred and drops the uncorrelated part, which is noise.
    mono = audio.mean(axis=1)
    if rate != SR:
        g = np.gcd(SR, rate)
        mono = signal.resample_poly(mono, SR // g, rate // g)
    return mono


# ---------------------------------------------------------------------- measure


METER = pyln.Meter(SR)
SOS_MID = signal.butter(4, [500, 4000], btype="band", fs=SR, output="sos")


def measure(y: np.ndarray) -> dict:
    """Noise floor, speech level, room decay and long-term spectrum of a stretch of voice."""
    f20 = frame_db(y, SR // 50)
    noise, speech = float(np.percentile(f20, 10)), float(np.percentile(f20, 90))

    voiced = np.repeat(f20 > speech - 15, SR // 50)
    fr, psd = signal.welch(y[: len(voiced)][voiced], fs=SR, nperseg=8192)
    bands = np.array([10 * np.log10(psd[(fr >= a) & (fr < b)].sum() + 1e-20) for a, b in BANDS])
    bands -= bands[4]

    # Room decay: time for the 500-4000 Hz envelope to fall 20 dB after a word
    # that is followed by a real pause.
    env = frame_db(signal.sosfiltfilt(SOS_MID, y), SR // 100)
    high = np.percentile(env, 90) - 12
    decays, i = [], 1
    while i < len(env) - 40:
        if env[i - 1] > high >= env[i] and np.all(env[i + 5 : i + 30] < high):
            below = np.where(env[i : i + 40] <= env[i - 1] - 20)[0]
            if len(below):
                decays.append(below[0] * 10)
            i += 30
        else:
            i += 1

    thirds = np.array([
        10 * np.log10(psd[(fr >= c / 2 ** (1 / 6)) & (fr < c * 2 ** (1 / 6))].sum() + 1e-20) for c in THIRDS
    ])
    thirds -= np.mean([thirds[THIRDS.index(c)] for c in REFERENCE_THIRDS])

    lufs = METER.integrated_loudness(y) if len(y) > SR else float("nan")
    return {
        "noise": noise,
        "speech": speech,
        "snr": speech - noise,
        "t20": float(np.median(decays)) if decays else float("nan"),
        "bands": bands.tolist(),
        "thirds": thirds.tolist(),
        "lufs": float(lufs),
        "peak": float(20 * np.log10(np.max(np.abs(y)) + 1e-12)),
    }


def target_thirds(gender: str) -> np.ndarray:
    """The octave target, interpolated to third-octave centres."""
    centres = [np.sqrt(a * b) for a, b in BANDS]
    curve = np.interp(np.log(THIRDS), np.log(centres), TARGET[gender])
    return curve - np.mean([curve[THIRDS.index(c)] for c in REFERENCE_THIRDS])


def find_takes(raw: np.ndarray, falas: list[dict], voices: dict) -> dict[str, list[float] | None]:
    """Groups each speaker's falas by recording session and returns a match EQ per fala.

    A fala joins the session whose average spectrum is nearest, or opens a new one
    when every session is more than TAKE_SPLIT_DB away. The session nearest the
    target curve is the reference; every other session gets a third-octave EQ
    that puts its long-term spectrum on the reference's, so the speaker's chain
    that follows sees one voice. A recording made in one sitting has one session
    and no match EQ (None for every fala).
    """
    lo, hi = THIRDS.index(TAKE_RANGE[0]), THIRDS.index(TAKE_RANGE[1]) + 1
    spectra = {
        f["id"]: np.array(measure(raw[int(f["speechStart"] * SR) : int(f["speechEnd"] * SR)])["thirds"]) for f in falas
    }
    distance = lambda a, b: float(np.sqrt(np.mean((a[lo:hi] - b[lo:hi]) ** 2)))
    match: dict[str, list[float] | None] = {f["id"]: None for f in falas}

    for who in dict.fromkeys(f["speaker"] for f in falas):
        own = [f for f in falas if f["speaker"] == who]
        sessions: list[list[dict]] = []
        for f in own:
            mean = lambda s: np.mean([spectra[g["id"]] for g in s], axis=0)
            near = min(sessions, key=lambda s: distance(spectra[f["id"]], mean(s)), default=None)
            if near is not None and distance(spectra[f["id"]], mean(near)) <= TAKE_SPLIT_DB:
                near.append(f)
            else:
                sessions.append([f])
        if len(sessions) == 1:
            continue

        def long_term(s):
            return np.array(measure(np.concatenate([raw[int(g["speechStart"] * SR) : int(g["speechEnd"] * SR)] for g in s]))["thirds"])

        target = target_thirds("female" if voices.get(who, 150) > 175 else "male")
        curves = [long_term(s) for s in sessions]
        ref = min(range(len(sessions)), key=lambda k: distance(curves[k], target))
        print(f"  {who}: {len(sessions)} sessoes de gravacao com timbres diferentes")
        for k, s in enumerate(sessions):
            ids = ", ".join(g["id"] for g in s)
            if k == ref:
                print(f"    referencia ({ids}), a {distance(curves[k], target):.1f} dB da curva-alvo")
                continue
            eq = np.clip(curves[ref] - curves[k], -MATCH_LIMIT, MATCH_LIMIT)
            eq = np.convolve(np.pad(eq, 1, mode="edge"), [0.25, 0.5, 0.25], mode="valid")
            print(f"    {ids}: a {distance(curves[k], curves[ref]):.1f} dB da referencia, EQ de casamento: "
                  + " ".join(f"{c if c < 1000 else str(c // 1000) + 'k'}:{g:+.1f}" for c, g in zip(THIRDS, eq)))
            for g in s:
                match[g["id"]] = eq.tolist()
    return match


# ---------------------------------------------------------------- dsp: filters
def highpass(y: np.ndarray, cutoff: float) -> np.ndarray:
    # Zero-phase: the 2nd order Butterworth runs forwards and backwards.
    return signal.sosfiltfilt(signal.butter(2, cutoff, btype="high", fs=SR, output="sos"), y)


def linear_phase_eq(y: np.ndarray, gains_db: list[float]) -> np.ndarray:
    """Applies a smooth EQ curve through the third-octave centres with a linear-phase FIR, delay removed."""
    freqs = np.concatenate([[0], np.geomspace(20, SR / 2 - 1, 600), [SR / 2]])
    curve_db = np.interp(np.log(np.clip(freqs, 20, None)), np.log(THIRDS), gains_db)
    taps = 8191
    fir = signal.firwin2(taps, freqs / (SR / 2), 10 ** (curve_db / 20))
    out = signal.oaconvolve(y, fir, mode="full")
    delay = (taps - 1) // 2
    return out[delay : delay + len(y)]


# --------------------------------------------------------------- dsp: dynamics


def expander(y: np.ndarray, threshold: float, ratio: float, range_db: float) -> np.ndarray:
    """Gentle downward expander for room tails and noise between words.

    Looks 6 ms ahead, so it has opened before a word starts; closes over 180 ms,
    so the end of a word decays naturally instead of being cut.
    """
    lvl = level_db(y)
    lvl = maximum_filter1d(lvl, size=7, origin=-3)  # look ahead
    under = np.clip(threshold - lvl, 0, None)
    gain = -np.minimum(range_db, under * (ratio - 1))
    gain = smooth(gain, rise_ms=2, fall_ms=180)
    return apply_gain(y, gain)


def compressor(
    y: np.ndarray, threshold: float, ratio: float, knee: float = 6, attack_ms: float = 10, release_ms: float = 150
) -> np.ndarray:
    lvl = smooth(level_db(y), rise_ms=attack_ms, fall_ms=release_ms)
    over = lvl - threshold
    slope = 1 - 1 / ratio
    gain = np.where(
        over <= -knee / 2,
        0.0,
        np.where(over >= knee / 2, -slope * over, -slope * (over + knee / 2) ** 2 / (2 * knee)),
    )
    return apply_gain(y, gain)


def deesser(y: np.ndarray, voiced_mask: np.ndarray, max_db: float = 6.0) -> np.ndarray:
    """Turns down only the 5.5 kHz+ band, only on the loudest sibilants."""
    sos = signal.butter(2, 5500, btype="high", fs=SR, output="sos")
    high = signal.sosfiltfilt(sos, y)
    low = y - high  # zero-phase split: low + high == y exactly
    hl = level_db(high)
    mask = voiced_mask[: len(hl)]
    threshold = np.percentile(hl[mask], 90) if mask.any() else np.percentile(hl, 95)
    over = np.clip(maximum_filter1d(hl, size=5, origin=-2) - threshold, 0, None)
    gain = smooth(-np.minimum(max_db, over * 0.75), rise_ms=1, fall_ms=60)
    return low + apply_gain(high, gain)


EXCITE_BAND = signal.butter(2, [2500, 6000], btype="band", fs=SR, output="sos")
EXCITE_HP = signal.butter(4, 7000, btype="high", fs=SR, output="sos")


def raw_harmonics(band: np.ndarray, drive: float) -> np.ndarray:
    return signal.sosfiltfilt(EXCITE_HP, np.tanh(band * drive) / drive - band)


def exciter_growth(y: np.ndarray) -> float:
    """How much more the plain exciter would distort the loud passages than the middle ones, in dB."""
    band = signal.sosfiltfilt(EXCITE_BAND, y)
    lvl = level_db(y)
    voiced = np.repeat(lvl > np.percentile(lvl, 90) - 18, HOP)
    drive = 1 / (3 * np.sqrt(np.mean(band[: len(voiced)][voiced] ** 2)) + 1e-9)
    ratio = level_db(raw_harmonics(band, drive)) - level_db(band)
    loud = lvl > np.percentile(lvl, 97)
    middle = (lvl > np.percentile(lvl, 60)) & (lvl < np.percentile(lvl, 80))
    return float(np.median(ratio[loud]) - np.median(ratio[middle]))


def exciter(
    y: np.ndarray, current_db: float, target_db: float, voiced: np.ndarray, linear: bool = False
) -> tuple[np.ndarray, float]:
    """Synthesises the missing air above 7 kHz from the 2.5-6 kHz band.

    A narrow mic leaves nothing up there to EQ: boosting would only lift noise.
    Odd harmonics of the upper mids, high-passed, put back some of what a better
    microphone would have caught. It aims at most 10 dB up, and at most 60% of
    the way to the target, so it reads as presence, not fizz.

    `linear` drives the saturation with the band divided by its own envelope and
    puts the envelope back afterwards, so the harmonics keep the same proportion
    on a shout as on a murmur. Plain saturation distorts the loud syllables
    disproportionately; on John that was 24 dB more on the loudest 3% than on
    the middle of his range, and it is what made him sound clipped and close
    to the mic.
    """
    def speech_only(x):
        v = voiced[: len(x)]
        return x[: len(v)][v]

    band = signal.sosfiltfilt(EXCITE_BAND, y)
    if linear:
        envelope = signal.sosfiltfilt(signal.butter(2, 60, fs=SR, output="sos"), np.abs(band))
        envelope = np.maximum(envelope, np.percentile(envelope, 20) + 1e-9)
        harmonics = raw_harmonics(band / envelope, 1 / 1.2) * envelope
    else:
        drive = 1 / (3 * np.sqrt(np.mean(speech_only(band) ** 2)) + 1e-9)
        harmonics = raw_harmonics(band, drive)

    def band_power(x):
        fr, psd = signal.welch(speech_only(x), fs=SR, nperseg=8192)
        return psd[(fr >= 8000) & (fr < 16000)].sum(), psd[(fr >= 1000) & (fr < 2000)].sum()

    hf, ref = band_power(y)
    hh, _ = band_power(harmonics)
    raise_db = min(10.0, (target_db - current_db) * 0.6)
    wanted = ref * 10 ** ((current_db + raise_db) / 10)
    scale = np.sqrt(max(wanted - hf, 0) / (hh + 1e-20))
    return y + harmonics * scale, raise_db


# K-weighting (ITU-R BS.1770) at 48 kHz, for the phrase leveller.
K_SHELF = ([1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585])
K_HP = ([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621])


def phrase_leveller(y: np.ndarray, target_lufs: float, max_db: float = 3.0) -> np.ndarray:
    """Evens out phrase-to-phrase level within a fala, never more than +-3 dB.

    Short-term loudness (3 s window) is pulled half-way to the fala's own level
    while someone is talking, and held through the pauses.
    """
    k = signal.lfilter(*K_HP, signal.lfilter(*K_SHELF, y))
    hop, win = SR // 10, 3 * SR
    pad = np.pad(k**2, (win // 2, win // 2), mode="reflect")
    csum = np.concatenate([[0], np.cumsum(pad)])
    centres = np.arange(0, len(y), hop)
    st = -0.691 + 10 * np.log10((csum[centres + win] - csum[centres]) / win + 1e-12)
    gain = np.zeros_like(st)
    held = 0.0
    for i, v in enumerate(st):
        if v > target_lufs - 20:  # someone is talking
            held = float(np.clip((target_lufs - v) * 0.5, -max_db, max_db))
        gain[i] = held
    gain = np.convolve(gain, np.ones(15) / 15, mode="same")  # 1.5 s glide
    return y * 10 ** (np.interp(np.arange(len(y)), centres, gain) / 20)


def dereverb(y: np.ndarray, amount: float) -> np.ndarray:
    """Weighted prediction error (WPE) dereverberation, blended with the dry voice."""
    size, shift = 2048, 512
    spec = stft(y, size=size, shift=shift)  # (frames, bins)
    wet_spec = wpe(spec.T[:, None, :], taps=10, delay=3, iterations=3)[:, 0, :].T
    wet = istft(wet_spec, size=size, shift=shift)
    wet = np.pad(wet, (0, max(0, len(y) - len(wet))))[: len(y)]
    return (1 - amount) * y + amount * wet


def lag_samples(reference: np.ndarray, processed: np.ndarray) -> int:
    """Where `processed` sits against `reference`, in samples (0 = aligned)."""
    sos = signal.butter(2, [300, 3000], btype="band", fs=SR, output="sos")
    a = signal.sosfiltfilt(sos, reference)
    b = signal.sosfiltfilt(sos, processed)
    corr = signal.correlate(b, a, mode="full", method="fft")
    window = SR // 20
    mid = len(a) - 1
    return int(np.argmax(corr[mid - window : mid + window + 1]) - window)


# ------------------------------------------------------------------------ main
def main() -> None:
    raw = load_raw()
    if CLIPPED_AT:
        spots = sorted({round(t, 1) for t in CLIPPED_AT})
        print(f"Clipping da gravacao reconstruido: {len(CLIPPED_AT)} trechos, em " + ", ".join(f"{t:.1f}s" for t in spots) + "\n")
    boundaries = json.loads(BOUNDARIES.read_text(encoding="utf-8"))
    if boundaries.get("draft"):
        raise SystemExit(
            "boundaries.json ainda e o rascunho (tempos estimados, sem audio). "
            "Grave sources/video/global-solution/audio/pitch/audio.wav e rode gsp:transcribe e gsp:align antes."
        )
    falas = boundaries["falas"]
    # EC-1 has one narrator and no pitch check, so there is no measured F0 per
    # voice: John's voice takes the male target curve, as it did in Fase 3.
    voices = boundaries.get("voices", {})

    def cut(x, f, key_a="speechStart", key_b="speechEnd"):
        return x[int(f[key_a] * SR) : int(f[key_b] * SR)]

    # --- sessions: a speaker recorded in two sittings is first matched to one ----
    print("Sessoes de gravacao, pelo espectro de cada fala:\n")
    match = find_takes(raw, falas, voices)
    if not any(match.values()):
        print("  uma sessao por locutor, sem EQ de casamento")

    def matched(y, f):
        return linear_phase_eq(y, match[f["id"]]) if match[f["id"]] else y

    # --- decisions, per speaker, from all of that speaker's falas together -------
    speakers = sorted({f["speaker"] for f in falas}, key=[f["speaker"] for f in falas].index)
    plans = {}
    print("\nMedido por locutor (audio bruto, sessoes ja casadas) e o que isso decide:\n")
    for who in speakers:
        joined = np.concatenate([matched(cut(raw, f), f) for f in falas if f["speaker"] == who])
        m = measure(joined)
        gender = "female" if voices.get(who, 150) > 175 else "male"
        hp = 95.0 if gender == "female" else 75.0
        target = target_thirds(gender)
        deviation = np.array(m["thirds"]) - target
        air = [i for i, c in enumerate(THIRDS) if c >= 10000]
        band_limited = float(np.mean(deviation[air])) < BAND_LIMITED_DB
        amount = np.full(len(THIRDS), EQ_AMOUNT)
        if who in HEARD_ROOM:
            # The room heard on this voice lives in its 200 Hz-1 kHz resonances:
            # correct more of them there, and only there.
            amount[[i for i, c in enumerate(THIRDS) if 200 <= c <= 1000]] = ROOM_EQ_AMOUNT
        correction = np.clip(-deviation * amount, -EQ_LIMIT, EQ_LIMIT)
        for i, c in enumerate(THIRDS):
            if c < 1.4 * hp:
                correction[i] = min(correction[i], 0.0)   # the high-pass owns this region
            if c >= 6300 and deviation[i] < BAND_LIMITED_DB:
                correction[i] = 0.0                        # nothing there to boost
        # Neighbouring thirds pull on each other: a broad, gentle curve, no notches.
        correction = np.convolve(np.pad(correction, 1, mode="edge"), [0.25, 0.5, 0.25], mode="valid")
        bands_dev = np.array(m["bands"]) - np.array(TARGET[gender])
        plans[who] = {
            "gender": gender,
            "highpass": hp,
            # How far the background sits above where it should, relative to the voice.
            "denoise": float(np.clip((m["noise"] - m["lufs"] - NOISE_TARGET_DB) / 20, 0, 0.75)),
            "dereverb": max(float(np.clip((m["t20"] - 70) / 80, 0, 0.6)), HEARD_ROOM.get(who, 0.0)),
            "eq": correction.tolist(),
            "deess": bool(bands_dev[6] > 6),
            "excite": band_limited,
            "exciter_linear": bool(band_limited and exciter_growth(highpass(joined, hp)) > EXCITER_GROWTH_DB),
            "air_now": float(np.mean(np.array(m["thirds"])[air])),
            "air_target": float(np.mean(target[air])),
            # A voice the recorder clipped was leaning into the mic on its loudest
            # words: those words get their own fast peak control.
            "peak_control": any(
                f["speechStart"] <= t < f["speechEnd"] for t in CLIPPED_AT for f in falas if f["speaker"] == who
            ),
            "measured": m,
        }
        p = plans[who]
        worst = sorted(zip(deviation, THIRDS), reverse=True)[:2]
        print(
            f"  {who:9} fundo {m['noise'] - m['lufs']:5.1f} dB sob a voz, queda {m['t20']:4.0f} ms, "
            f"excesso maior em {worst[0][1]} Hz ({worst[0][0]:+.0f} dB) e {worst[1][1]} Hz ({worst[1][0]:+.0f} dB)"
        )
        print(
            f"            -> ruido {p['denoise']:.2f}, reverb {p['dereverb']:.2f}, "
            f"de-esser {'sim' if p['deess'] else 'nao'}, "
            f"exciter {('linear' if p['exciter_linear'] else 'sim') if p['excite'] else 'nao'}, "
            f"controle de pico {'sim' if p['peak_control'] else 'nao'}"
        )
        print("            EQ: " + " ".join(f"{c if c < 1000 else str(c // 1000) + 'k'}:{g:+.1f}" for c, g in zip(THIRDS, correction)))

    # --- processing, fala by fala, with context around each one -------------------
    PAD = int(0.75 * SR)
    FADE = int(0.02 * SR)
    treated = np.zeros_like(raw)
    print("\nTratando...")
    for index, f in enumerate(falas):
        p = plans[f["speaker"]]
        first, last = index == 0, index == len(falas) - 1
        a = 0 if first else int(f["start"] * SR)
        b = len(raw) if last else int(f["end"] * SR)
        lo, hi = max(0, a - PAD), min(len(raw), b + PAD)
        y = matched(raw[lo:hi].copy(), f)

        y = highpass(y, p["highpass"])

        f20 = frame_db(y, SR // 50)
        quiet = np.repeat(f20 < np.percentile(f20, 10) + 6, SR // 50)
        noise_clip = y[: len(quiet)][quiet]
        if p["denoise"] > 0.05 and len(noise_clip) > SR // 2:
            y = nr.reduce_noise(y=y, sr=SR, y_noise=noise_clip, stationary=True, prop_decrease=p["denoise"], n_fft=2048)

        if p["dereverb"] > 0.05:
            y = dereverb(y, p["dereverb"])

        # Thresholds come from the signal that reaches each stage, not from the raw
        # file: the denoiser and the EQ have already moved the levels.
        y = linear_phase_eq(y, p["eq"])
        if p["peak_control"]:
            # Only the words that jump 2 dB over the voice's normal peaks: fast in,
            # quick out, so the words around them are left alone.
            y = compressor(
                y, threshold=np.percentile(frame_db(y, SR // 50), 90) + 2, ratio=3.0, knee=4, attack_ms=2, release_ms=80
            )
        # Only the loud syllables, about 2 dB off the peaks. Measured on f03 and f05:
        # a threshold 12 dB down took 7.6 dB off the whole voice, and once the fala
        # was brought back to level the room tails and the noise came up with it.
        y = compressor(y, threshold=np.percentile(frame_db(y, SR // 50), 90) - 4, ratio=1.5)
        # After the compressor, so it catches what the compressor lifts. 20 dB under
        # the voice, 8 dB at most: the setting that lowered both the background and
        # the room decay on John and Vinicius. 18 dB cleaned slightly more but began
        # to reach soft consonants.
        y = expander(y, threshold=np.percentile(frame_db(y, SR // 50), 90) - 20, ratio=2.0, range_db=8)

        f1 = level_db(y)
        voiced_ms = f1 > np.percentile(f1, 90) - 18
        if p["deess"]:
            y = deesser(y, voiced_ms)
        if p["excite"]:
            voiced = np.repeat(voiced_ms, HOP)
            y, raised = exciter(y, p["air_now"], p["air_target"], voiced, linear=p["exciter_linear"])
            p["air_raised"] = raised

        core_lufs = METER.integrated_loudness(y[a - lo : b - lo])
        y = phrase_leveller(y, core_lufs)
        y *= 10 ** ((VOICE_LUFS - METER.integrated_loudness(y[a - lo : b - lo])) / 20)

        lag = lag_samples(raw[lo:hi], y)
        if lag:
            raise SystemExit(f"{f['id']}: o tratamento deslocou a voz em {lag} amostras. Nada foi gravado.")

        # Overlap-add into the output. Each cut is where the next voice starts, at
        # the end of a measured silence, so the 20 ms join goes just BEFORE it:
        # inside the silence, and every voice passes only through its own chain.
        # The two ramps always sum to exactly 1.
        weight = np.zeros(hi - lo)
        start, end = a - lo, b - lo
        weight[start:end] = 1.0
        if not first:
            weight[start - FADE : start] = np.linspace(0, 1, FADE)
        if not last:
            weight[end - FADE : end] = np.linspace(1, 0, FADE)
        treated[lo:hi] += y * weight
        print(f"  {f['id']} {f['speaker']:9} ok (alinhamento: 0 amostras)")

    # --- peaks ------------------------------------------------------------------------
    # Lifting each fala to the same loudness lifts its transients too: Larissa's
    # recording has a 26 dB crest, one pop that would land 10 dB over full scale.
    treated, limit_stats = limiter(treated, CEILING_DB)
    print(
        f"\nLimitador de pico ({CEILING_DB} dBTP): reducao maxima {limit_stats['maxReductionDb']:.1f} dB, "
        f"mais de 1 dB em {limit_stats['timeOver1dB'] * 100:.2f}% do tempo"
    )

    # --- write and report -------------------------------------------------------------
    peak = np.max(np.abs(treated))
    if peak >= 1.0:
        raise SystemExit(f"Pico de {20*np.log10(peak):.2f} dBFS: clipping no tratamento. Nada foi gravado.")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    sf.write(OUT, np.column_stack([treated, treated]), SR, subtype="PCM_24")

    print("\nAntes -> depois, por fala:")
    print(f"  {'fala':5} {'quem':9} {'LUFS':>13} {'fundo sob a voz':>16} {'queda ms':>11}   desvio da curva-alvo (dB, 120 Hz..16 kHz)")
    report = {"voiceLufs": VOICE_LUFS, "plans": {}, "falas": []}
    for who, p in plans.items():
        report["plans"][who] = {k: v for k, v in p.items() if k != "measured"}
    for f in falas:
        before, after = measure(cut(raw, f)), measure(cut(treated, f))
        target = TARGET[plans[f["speaker"]]["gender"]]
        dev_b = np.array(before["bands"][1:]) - target[1:]
        dev_a = np.array(after["bands"][1:]) - target[1:]
        print(
            f"  {f['id']:5} {f['speaker']:9} {before['lufs']:5.1f} -> {after['lufs']:5.1f}"
            f"  {before['noise'] - before['lufs']:6.1f} -> {after['noise'] - after['lufs']:6.1f}"
            f"  {before['t20']:4.0f} -> {after['t20']:4.0f}   "
            + " ".join(f"{x:+4.0f}" for x in dev_b) + "  ->  " + " ".join(f"{x:+4.0f}" for x in dev_a)
        )
        report["falas"].append({"id": f["id"], "speaker": f["speaker"], "matchEq": match[f["id"]], "before": before, "after": after})
    report["peakDbfs"] = float(20 * np.log10(peak))
    report["limiter"] = limit_stats
    REPORT.write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"\nPico {20*np.log10(peak):.2f} dBFS, sem clipping -> public/gs-pitch/narracao.wav")
    print("Relatorio -> src/data/gs-pitch/voice-report.json")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
