"""Per-frame analysis of the Figma take: motion (frame diff) and Figma hover-blue pixels.

Usage: python -E -P analise.py <ffmpeg> <input> <out.json>
"""
import json
import subprocess
import sys

import numpy as np

ffmpeg, src, out = sys.argv[1:4]
W, H = 480, 270
cmd = [ffmpeg, "-v", "error", "-i", src, "-vf", f"scale={W}:{H}:flags=area",
       "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
raw = subprocess.run(cmd, capture_output=True, check=True).stdout
n = len(raw) // (W * H * 3)
frames = np.frombuffer(raw, np.uint8)[: n * W * H * 3].reshape(n, H, W, 3).astype(np.int16)

rows = []
prev = None
for i, f in enumerate(frames):
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    # Figma selection/hover blue (~#0D99FF / #18A0FB): strong blue, low red
    blue = int(((b > 200) & (r < 90) & (g > 110) & (g < 200)).sum())
    dark = float((f.mean(axis=2) < 60).mean())  # UI panels / start menu share
    diff = 0.0 if prev is None else float(np.abs(f - prev).mean())
    rows.append({"i": i, "t": round(i / 30, 3), "diff": round(diff, 3), "blue": blue, "dark": round(dark, 3)})
    prev = f

with open(out, "w") as fh:
    json.dump(rows, fh)
print(n, "frames")
