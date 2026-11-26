"""Labelled contact strip: tira.py <out.png> <start> <end> <fps> [cols] [width] [crop x:y:w:h]

Frames are taken with -ss AFTER -i (exact), labelled with their source time.
"""
import subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

AQUI = Path(__file__).resolve().parent
FF = str(AQUI.parents[3] / "remotion" / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
import os
SRC = str(AQUI.parent / "originais" / os.environ.get("ORIG", "2026-11-17 12-38-28.mp4"))

out, a, b, fps = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
cols = int(sys.argv[5]) if len(sys.argv) > 5 else 5
w = int(sys.argv[6]) if len(sys.argv) > 6 else 480
crop = sys.argv[7] if len(sys.argv) > 7 else None
vf = (f"crop={crop}," if crop else "") + f"scale={w}:-2"
cmd = [FF, "-v", "error", "-i", SRC, "-ss", str(a), "-t", str(b - a), "-r", str(fps), "-vf", vf,
       "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
raw = subprocess.run(cmd, capture_output=True).stdout
probe = subprocess.run([FF, "-v", "error", "-i", SRC, "-frames:v", "1", "-vf", vf, "-f", "rawvideo",
                        "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
h = len(probe) // (w * 3)
n = len(raw) // (w * h * 3)
imgs = [Image.fromarray(np.frombuffer(raw[i * w * h * 3:(i + 1) * w * h * 3], np.uint8).reshape(h, w, 3))
        for i in range(n)]
rows = (n + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * h), "black")
for i, im in enumerate(imgs):
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 70, 16], fill="black")
    d.text((3, 2), f"{a + i / fps:.2f}", fill="yellow")
    sheet.paste(im, ((i % cols) * w, (i // cols) * h))
sheet.save(out)
print(n, "frames ->", out)
