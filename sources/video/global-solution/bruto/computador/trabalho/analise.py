"""Per-frame metrics of the raw computer take.

bolha: fraction of dark pixels in the bottom-left strip where Chrome shows the link URL bubble.
diff:  mean abs difference to the previous frame (gray, 480x270), to find screen changes.
Output: analise.json (lists indexed by frame number, 30 fps).
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np

AQUI = Path(__file__).resolve().parent
FF = str(AQUI.parents[3] / "remotion" / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
import os
SRC = str(AQUI.parent / "originais" / os.environ.get("ORIG", "2026-11-17 12-38-28.mp4"))


def frames(vf, w, h):
    cmd = [FF, "-v", "error", "-i", SRC, "-vf", vf, "-f", "rawvideo", "-pix_fmt", "gray", "-"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    n = w * h
    while True:
        buf = p.stdout.read(n)
        if len(buf) < n:
            break
        yield np.frombuffer(buf, np.uint8).reshape(h, w)


bolha = [float((f < 80).mean()) for f in frames("crop=400:24:0:1056", 400, 24)]
diff, prev = [], None
for f in frames("scale=480:270", 480, 270):
    f = f.astype(np.int16)
    diff.append(0.0 if prev is None else float(np.abs(f - prev).mean()))
    prev = f
(AQUI / os.environ.get("SAIDA_ANALISE", "analise.json")).write_text(json.dumps({"bolha": bolha, "diff": diff}))
print(len(bolha), len(diff))
