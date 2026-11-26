"""Finds the bounds of the white card that contains a point: cartao.py <frame_n> <x> <y> [<frame_n> <x> <y>...]

Walks from (x, y) along the row and the column while pixels stay white (the cards are #FFFFFF on the lilac
page). Uses the ORIG env var like the other scripts. Prints x0, y0, x1, y1 (exclusive) per frame.
"""
import os, subprocess, sys
from pathlib import Path
import numpy as np

AQUI = Path(__file__).resolve().parent
FF = str(AQUI.parents[3] / "remotion" / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
SRC = str(AQUI.parent / "originais" / os.environ.get("ORIG", "2026-11-17 12-38-28.mp4"))
args = sys.argv[1:]
for i in range(0, len(args), 3):
    n, x, y = map(int, args[i:i + 3])
    raw = subprocess.run([FF, "-v", "error", "-i", SRC, "-vf", f"select='eq(n\\,{n})'", "-vsync", "0",
                          "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    f = np.frombuffer(raw, np.uint8).reshape(1080, 1920, 3)
    white = (f.min(axis=2) >= 253)

    def run(line, p):
        a = p
        while a > 0 and line[a - 1]:
            a -= 1
        b = p
        while b < len(line) and line[b]:
            b += 1
        return a, b

    x0, x1 = run(white[y, :], x)
    y0, y1 = run(white[:, x], y)
    print(f"n{n}: x {x0}-{x1}  y {y0}-{y1}  (largura {x1 - x0}, altura {y1 - y0})")
