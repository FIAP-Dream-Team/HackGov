"""Count Figma hover-outline blue pixels (#1987DA-ish) per frame at full resolution, plus top-bar check.

Usage: python -E -P contorno.py <ffmpeg> <input> <start> <dur>
"""
import subprocess
import sys

import numpy as np

ffmpeg, src, start, dur = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
W, H = 1920, 1080
cmd = [ffmpeg, "-v", "error", "-i", src, "-ss", str(start), "-t", str(dur),
       "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
raw = subprocess.run(cmd, capture_output=True, check=True).stdout
n = len(raw) // (W * H * 3)
fr = np.frombuffer(raw, np.uint8)[: n * W * H * 3].reshape(n, H, W, 3)
for i in range(n):
    f = fr[i, 40:1076].astype(np.int16)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    blue = int(((b > 190) & (r < 70) & (g > 105) & (g < 165)).sum())
    print(f"{start + i / 30:7.2f} {blue}")
