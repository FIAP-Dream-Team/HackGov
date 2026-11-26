"""Cut check: for each clip, the frame before and after every cut (plus first and last frame), side by side."""
import json, subprocess
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

AQUI = Path(__file__).resolve().parent
FF = str(AQUI.parents[3] / "remotion" / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
W = 640
import os
edl = json.loads((AQUI / os.environ.get("EDL", "edl.json")).read_text())
for name, info in edl.items():
    src = str(AQUI.parent / f"{name}.mp4")
    cnt = subprocess.run([FF, "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "gray", "-vf", "scale=16:16", "-"], capture_output=True).stdout
    total = len(cnt) // 256
    pares = [(0, 0)]
    for e in info["edl"][1:]:
        n = round(e["no_clipe"] * 30)
        pares.append((n - 1, n))
    pares.append((total - 1, total - 1))
    ns = sorted({n for p in pares for n in p})
    sel = "+".join(f"eq(n\\,{n})" for n in ns)
    raw = subprocess.run([FF, "-v", "error", "-i", src, "-vf", f"select='{sel}',scale={W}:-2", "-vsync", "0",
                          "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    h = W * 1080 // 1920
    assert len(raw) == len(ns) * W * h * 3, (len(raw), len(ns))
    fr = {n: Image.fromarray(np.frombuffer(raw[i * W * h * 3:(i + 1) * W * h * 3], np.uint8).reshape(h, W, 3))
          for i, n in enumerate(ns)}
    sheet = Image.new("RGB", (2 * W, len(pares) * h), "black")
    for r, (a, b) in enumerate(pares):
        for c, n in enumerate((a, b)):
            im = fr[n].copy()
            d = ImageDraw.Draw(im)
            d.rectangle([0, 0, 120, 14], fill="black")
            d.text((3, 2), f"{n / 30:.2f}s n{n}", fill="yellow")
            sheet.paste(im, (c * W, r * h))
    out = AQUI / "folhas" / f"cortes-{name}.png"
    sheet.save(out)
    print(out.name, len(pares), "pares")
