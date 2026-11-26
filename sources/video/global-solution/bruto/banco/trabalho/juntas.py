import json, subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
exec(open('trabalho/edl.py', encoding='utf-8').read().split("def pausas")[0])  # ERROS
edl = json.load(open('trabalho/edl.json'))
t, js = 0.0, []
for i, e in enumerate(edl):
    n = max(1, round((e['b'] - e['a']) / e['v'] * 30))
    if i:
        p = edl[i - 1]
        gap = (p['b'], e['a'])
        tipo = None
        if any(c[0] < e['a'] and c[1] > p['b'] for c in ERROS): tipo = 'erro'
        elif p['r'] != e['r']: tipo = 'bloco'
        if tipo: js.append((t, tipo, p['b'], e['a'], e['r']))
    t += n / 30
print(len(js), 'juntas')
font = ImageFont.truetype('arial.ttf', 20)
def fr(tt, crop):
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{max(0, tt - 1):.3f}', '-i', 'A2-take-unico.mp4', '-ss', f'{min(tt, 1):.3f}', '-frames:v', '1', '-vf', f'crop={crop},scale=iw/2:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    return Image.open(BytesIO(raw)).convert('RGB')
crop = sys.argv[1] if len(sys.argv) > 1 else '1640:480:260:40'
per = 7
for k in range(0, len(js), per):
    ch = js[k:k + per]; rows = []
    for (tt, tipo, pb, ea, r) in ch:
        rows.append((fr(tt - 1/30, crop), fr(tt, crop), f'{tt:.2f}s {tipo} orig {pb:.2f}->{ea:.2f}'))
    w, h = rows[0][0].size
    s = Image.new('RGB', (2 * w + 30, len(rows) * (h + 30) + 10), (90, 90, 90))
    for r_, (a, b, lab) in enumerate(rows):
        y = 10 + r_ * (h + 30)
        d = ImageDraw.Draw(s); d.text((10, y), lab, fill=(255, 255, 0), font=font)
        s.paste(a, (10, y + 24)); s.paste(b, (20 + w, y + 24))
    out = f'trabalho/junta-{k // per + 1}.png'; s.save(out); print(out)
