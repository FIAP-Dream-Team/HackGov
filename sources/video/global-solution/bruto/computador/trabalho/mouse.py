"""Approximate cursor track: centroid of small changed regions between consecutive frames.

Large changes (navigation, dropdowns) are flagged as 'tela'. Output mouse.json: per frame [x, y, kind]
with x, y in 1920x1080 coordinates (last known position carried forward).
"""
import json, subprocess
from pathlib import Path
import numpy as np

AQUI = Path(__file__).resolve().parent
FF = str(AQUI.parents[3] / "remotion" / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
import os
SRC = str(AQUI.parent / "originais" / os.environ.get("ORIG", "2026-11-17 12-38-28.mp4"))
W, H = 960, 540
p = subprocess.Popen([FF, "-v", "error", "-i", SRC, "-vf", f"scale={W}:{H}", "-f", "rawvideo",
                      "-pix_fmt", "gray", "-"], stdout=subprocess.PIPE)
prev, pos, out = None, [None, None], []
while True:
    buf = p.stdout.read(W * H)
    if len(buf) < W * H:
        break
    f = np.frombuffer(buf, np.uint8).astype(np.int16).reshape(H, W)
    kind = "parado"
    if prev is not None:
        m = np.abs(f - prev) > 40
        m[H - 14:, :70] = False  # URL bubble
        n = int(m.sum())
        if n > 4000:
            kind = "tela"
        elif n > 3:
            ys, xs = np.nonzero(m)
            # cursor = the cluster nearest to the last position; good enough: median
            pos = [int(np.median(xs)) * 2, int(np.median(ys)) * 2]
            kind = "mouse" if n < 600 else "mudanca"
    out.append([pos[0], pos[1], kind])
    prev = f
(AQUI / os.environ.get("SAIDA_MOUSE", "mouse.json")).write_text(json.dumps(out))
print(len(out))
