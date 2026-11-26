"""Mixes the assembled narration of the technical video with the music bed into public/gs-tecnico/mix.wav.

The narration is John's raw take (noise floor ~30 dB under the voice): high-pass at 80 Hz, gentle FFT noise
reduction (12 dB, tracking the noise), a light de-esser, a gentle compressor
that evens the phrases out, and loudness leveling at -16 LUFS. The music (the HackGov bed, public/musica.mp3)
sits low and ducks under the voice (sidechain), fades in with M01 and out with M11. The bus is brought to
-14 LUFS integrated, -1 dBTP, in two passes (measure, then a linear gain), as YouTube expects.

Usage:  python -E -P scripts/gs-tecnico/mix.py      (after build.py)
"""
import json
import re
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
FF = str(ROOT / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
VOICE = HERE.parents[2] / "global-solution" / "audio" / "tecnico" / "narracao-montada.wav"
MUSIC = ROOT / "public" / "musica.mp3"
OUT_DIR = ROOT / "public" / "gs-tecnico"
OUT = OUT_DIR / "mix.wav"
total = json.loads((ROOT / "src" / "data" / "gs-tecnico" / "edl.json").read_text(encoding="utf-8"))["durationSec"]

graph = (
    "[0:a]aresample=48000,pan=mono|c0=c0,highpass=f=80,afftdn=nr=12:nf=-42:tn=1,deesser=i=0.25,"
    "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=160:makeup=2,"
    "loudnorm=I=-16:TP=-1.5:LRA=6,aresample=48000,asplit=2[v][side];"
    f"[1:a]aresample=48000,atrim=0:{total:.3f},asetpts=PTS-STARTPTS,pan=mono|c0=0.5*c0+0.5*c1,"
    f"volume=-23dB,afade=t=in:d=1.2,afade=t=out:st={total - 2.6:.3f}:d=2.6[m];"
    "[m][side]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=500[duck];"
    "[v][duck]amix=inputs=2:normalize=0:duration=first[bus]"
)


def run(extra_filter: str, out: str) -> str:
    cmd = [FF, "-hide_banner", "-y", "-i", str(VOICE), "-i", str(MUSIC), "-filter_complex",
           graph + ";[bus]" + extra_filter + "[o]", "-map", "[o]", "-ac", "2", "-ar", "48000"]
    cmd += ["-f", "null", "-"] if out == "-" else ["-c:a", "pcm_s24le", out]
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace").stderr


m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", run("loudnorm=I=-14:TP=-1:LRA=9:print_format=json", "-"), re.S).group(0))
OUT_DIR.mkdir(parents=True, exist_ok=True)
run(
    "loudnorm=I=-14:TP=-1:LRA=9:linear=true:"
    f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
    f"measured_thresh={m['input_thresh']}:offset={m['target_offset']},aresample=48000",
    str(OUT),
)
check = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", subprocess.run(
    [FF, "-hide_banner", "-i", str(OUT), "-af", "loudnorm=I=-14:TP=-1:print_format=json", "-f", "null", "-"],
    capture_output=True, text=True, encoding="utf-8", errors="replace").stderr, re.S).group(0))
print(f"mix: {check['input_i']} LUFS, pico {check['input_tp']} dBTP -> {OUT}")
