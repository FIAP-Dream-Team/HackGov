import subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
segs = [(0.20,1.60),(13.25,14.05),(20.55,21.35),(36.35,37.15),(48.45,49.25),(53.15,58.20),(181.95,182.85),(184.35,185.25),(188.00,191.85),(242.95,246.95),(261.00,264.10),(278.80,282.60)]
# frame boundaries as ffmpeg trim produces them (frames whose pts falls in [a,b))
import math
bounds, n = [], 0
for a, b in segs:
    k = math.ceil(b * 30 - 1e-6) - math.ceil(a * 30 - 1e-6); n += k; bounds.append(n)
want = []
for bd in bounds[:-1]: want += [bd - 1, bd]
sel = '+'.join(f'eq(n\,{x})' for x in want)
raw = subprocess.run([FF, '-v', 'error', '-i', 'A3-take-unico.mp4', '-vf', f"select='{sel}',scale=800:-1", '-vsync', '0', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
# split concatenated PNGs
imgs, i = [], 0
sig = b'\x89PNG\r\n\x1a\n'
starts = [p for p in range(len(raw)) if raw.startswith(sig, p)] if False else []
p = raw.find(sig)
while p != -1:
    q = raw.find(sig, p + 8)
    imgs.append(Image.open(BytesIO(raw[p:q if q != -1 else len(raw)])).convert('RGB')); p = q
font = ImageFont.truetype('arial.ttf', 22)
W, H = imgs[0].size
pairs = len(imgs) // 2
for sheet_i in range(0, pairs, 6):
    rows = min(6, pairs - sheet_i)
    s = Image.new('RGB', (W * 2 + 30, (H + 10) * rows + 10), (40, 40, 40))
    for r in range(rows):
        for k in range(2):
            im = imgs[(sheet_i + r) * 2 + k]; x, y = 10 + k * (W + 10), 10 + r * (H + 10)
            s.paste(im, (x, y)); d = ImageDraw.Draw(s); d.rectangle([x, y, x + 210, y + 30], fill=(255, 220, 0))
            d.text((x + 5, y + 3), f'corte {sheet_i + r + 1} {"antes" if k == 0 else "depois"}', fill=(0, 0, 0), font=font)
    s.save(f'trabalho/emendas-{sheet_i // 6 + 1}.png'); print('sheet', sheet_i // 6 + 1, rows)
print('boundaries', bounds, 'imgs', len(imgs))
