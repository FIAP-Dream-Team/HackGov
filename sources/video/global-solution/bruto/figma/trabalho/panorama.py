"""Stitch the stopped frames of a stepwise Figma pan into one panorama and render a smooth pan.

The canvas is static between drags, so each stop is the same render shifted by a pure translation.
Shifts come from phase correlation; overlapping pixels are combined with a median, which removes
the mouse cursor (it sits in a different place in each stop).

Usage:
  python -E -P panorama.py <ffmpeg> <input> <name> <t1,t2,...> <seconds> [--zoom=1.0]
Writes trabalho/<name>-panorama.png, trabalho/<name>-shifts.json and ../<name>.mp4 (smooth pan).
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image

ffmpeg, src, name, times, secs = sys.argv[1:6]
times = [float(t) for t in times.split(",")]
secs = float(secs)
here = os.path.dirname(os.path.abspath(__file__))
Y0, Y1 = 38, 1068  # below the Figma/Windows tab bar, above the bottom scrollbar
X0, X1 = 1, 1915  # inside the window border, left of the vertical scrollbar


def grab(t):
    cmd = [ffmpeg, "-v", "error", "-i", src, "-ss", f"{t:.3f}", "-frames:v", "1",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(1080, 1920, 3)[Y0:Y1, X0:X1].copy()


def shift(a, b):
    """Translation d such that b(x) ~= a(x + d), i.e. content moved by -d."""
    ga = a.mean(axis=2) - a.mean()
    gb = b.mean(axis=2) - b.mean()
    win = np.outer(np.hanning(ga.shape[0]), np.hanning(ga.shape[1]))
    fa, fb = np.fft.fft2(ga * win), np.fft.fft2(gb * win)
    r = fa * np.conj(fb)
    r /= np.abs(r) + 1e-9
    c = np.fft.ifft2(r).real
    dy, dx = np.unravel_index(np.argmax(c), c.shape)
    h, w = c.shape
    if dy > h // 2:
        dy -= h
    if dx > w // 2:
        dx -= w
    return int(dy), int(dx)


frames = [grab(t) for t in times]
pos = [(0, 0)]
for a, b in zip(frames, frames[1:]):
    dy, dx = shift(a, b)
    # b(x) = a(x + d): b's origin sits at a's origin plus d in panorama coordinates
    py, px = pos[-1]
    pos.append((py + dy, px + dx))
pos = np.array(pos)
pos -= pos.min(axis=0)
H, W = frames[0].shape[:2]
PH, PW = int(pos[:, 0].max()) + H, int(pos[:, 1].max()) + W

stack = np.full((len(frames), PH, PW, 3), np.nan, np.float32)
for k, (f, (y, x)) in enumerate(zip(frames, pos)):
    stack[k, y:y + H, x:x + W] = f
pano = np.nanmedian(stack, axis=0)
pano = np.nan_to_num(pano, nan=244.0).clip(0, 255).astype(np.uint8)
for arg in sys.argv[6:]:
    if arg.startswith("--clear-top="):  # empty canvas above the frame labels: wipe stray scrollbar marks
        rows = int(arg[12:])
        pano[:rows] = np.median(pano[:rows].reshape(-1, 3), axis=0).astype(np.uint8)
Image.fromarray(pano).save(os.path.join(here, f"{name}-panorama.png"))

# residual check: how well each stop matches the panorama (mean abs diff, 0 = identical)
resid = [float(np.abs(pano[y:y + H, x:x + W].astype(int) - f.astype(int)).mean())
         for f, (y, x) in zip(frames, pos)]
with open(os.path.join(here, f"{name}-shifts.json"), "w") as fh:
    json.dump({"times": times, "pos": pos.tolist(), "pano": [PH, PW], "resid": resid}, fh, indent=1)
print("pos", pos.tolist(), "pano", PH, PW, "resid", [round(r, 2) for r in resid])

# smooth pan: window of the frame size moves from the first stop to the last with ease-in-out
fps = 30
n = int(round(secs * fps))
hold = int(0.5 * fps)  # still at both ends
(y0, x0), (y1, x1) = pos[0], pos[-1]
for arg in sys.argv[6:]:
    if arg.startswith("--path="):  # window origin in panorama pixels: x0:y0,x1:y1
        (x0, y0), (x1, y1) = [tuple(int(v) for v in p.split(":")) for p in arg[7:].split(",")]
OW, OH = 1920, 1080
cw = int(round(H * 16 / 9))  # 16:9 crop of the visible height
pad = (cw - W) // 2
out = os.path.join(here, "..", f"{name}.mp4")
enc = subprocess.Popen([ffmpeg, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                        "-s", f"{cw}x{H}", "-r", str(fps), "-i", "-",
                        "-vf", f"scale={OW}:{OH}:flags=lanczos,format=yuv420p",
                        "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-r", str(fps), "-an", out],
                       stdin=subprocess.PIPE)
padded = np.pad(pano, ((0, 0), (max(pad, 0), max(pad, 0)), (0, 0)), constant_values=244)
total = n + 2 * hold
for i in range(total):
    u = min(max((i - hold) / max(n - 1, 1), 0.0), 1.0)
    e = u * u * (3 - 2 * u)  # smoothstep
    y = y0 + (y1 - y0) * e
    x = x0 + (x1 - x0) * e
    yi = min(max(int(round(y)), 0), padded.shape[0] - H)
    xi = min(max(int(round(x)), 0), padded.shape[1] - cw)
    crop = padded[yi:yi + H, xi:xi + cw]
    assert crop.shape == (H, cw, 3), crop.shape
    enc.stdin.write(np.ascontiguousarray(crop).tobytes())
enc.stdin.close()
enc.wait()
print("wrote", out, total / fps, "s")
