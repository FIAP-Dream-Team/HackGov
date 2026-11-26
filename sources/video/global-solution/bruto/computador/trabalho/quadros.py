"""Exact frames by frame number (n = round(t*30)), labelled. Use for cut checks.

quadros.py <out.png> <cols> <width> <crop or -> <spec>...
spec: a single time (12.5) or a range a:b:step (12:13:0.1). Times in seconds of the original.
"""
import subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

AQUI = Path(__file__).resolve().parent
FF = str(AQUI.parents[3] / "remotion" / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
import os
SRC = str(AQUI.parent / "originais" / os.environ.get("ORIG", "2026-11-17 12-38-28.mp4"))

out, cols, w, crop = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
ns = []
for s in sys.argv[5:]:
    if ":" in s:
        a, b, st = map(float, s.split(":"))
        t = a
        while t <= b + 1e-9:
            ns.append(round(t * 30)); t += st
    else:
        ns.append(round(float(s) * 30))
ns = sorted(set(ns))
sel = "+".join(f"eq(n\\,{n})" for n in ns)
vf = f"select='{sel}'," + (f"crop={crop}," if crop != "-" else "") + f"scale={w}:-2"
raw = subprocess.run([FF, "-v", "error", "-i", SRC, "-vf", vf, "-vsync", "0", "-f", "rawvideo",
                      "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
h = len(raw) // len(ns) // (w * 3)
rows = (len(ns) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * h), "black")
for i, n in enumerate(ns):
    im = Image.fromarray(np.frombuffer(raw[i * w * h * 3:(i + 1) * w * h * 3], np.uint8).reshape(h, w, 3))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 92, 14], fill="black")
    d.text((3, 2), f"{n / 30:.2f} n{n}", fill="yellow")
    sheet.paste(im, ((i % cols) * w, (i // cols) * h))
sheet.save(out)
print(len(ns), "->", out)
