"""Contact sheet of the rendered technical video: start, middle and end of every shot of the edit.

Writes out/gs-tecnico-sheet-<n>.png (12 shots per sheet), each row labelled with the shot's time and source,
so a cut that lands on the wrong picture or a frame with a stray window shows at a glance.
Usage:  python -E -P scripts/gs-tecnico/sheet.py
"""
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
FF = str(ROOT / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
VIDEO = ROOT / "out" / "gs-tecnico.mp4"
edl = json.loads((ROOT / "src" / "data" / "gs-tecnico" / "edl.json").read_text(encoding="utf-8"))
TW, TH = 384, 216


def grab(t: float) -> Image.Image:
    raw = subprocess.run([FF, "-v", "error", "-i", str(VIDEO), "-ss", f"{t:.3f}", "-frames:v", "1",
                          "-vf", f"scale={TW}:{TH}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    return Image.frombytes("RGB", (TW, TH), raw)


shots = edl["shots"]
for n in range(0, len(shots), 12):
    chunk = shots[n:n + 12]
    sheet = Image.new("RGB", (TW * 3 + 300, TH * len(chunk)), "white")
    d = ImageDraw.Draw(sheet)
    for r, s in enumerate(chunk):
        a, b = s["start"], s["end"]
        for c, t in enumerate([a + 0.15, (a + b) / 2, b - 0.12]):
            sheet.paste(grab(max(0, t)), (300 + c * TW, r * TH))
        label = s.get("src") or s.get("id")
        extra = f"\n{s['from']}-{s['to']} x{s['speed']}" if s["type"] == "video" else ""
        ov = "\n" + "\n".join(o["id"] for o in s.get("overlays", [])) if s.get("overlays") else ""
        d.text((6, r * TH + 6), f"{n + r:02d}  {a:.2f}-{b:.2f}s\n{s['type']} {label}{extra}{ov}", fill="black")
    out = ROOT / "out" / f"gs-tecnico-sheet-{n // 12 + 1}.png"
    sheet.save(out)
    print(out)
