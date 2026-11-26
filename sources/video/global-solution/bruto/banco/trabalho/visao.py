import subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = 'originais/2026-11-16 21-02-04.mp4'
step, w, cols, rows = float(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
t0, t1, prefix = float(sys.argv[5]), float(sys.argv[6]), sys.argv[7]
crop = sys.argv[8] if len(sys.argv) > 8 else None
# extract all frames in one pass with fps filter
vf = (f'crop={crop},' if crop else '') + f'fps=1/{step},scale={w}:-1'
raw = subprocess.run([FF, '-v', 'error', '-ss', str(t0), '-to', str(t1), '-i', SRC, '-vf', vf, '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
# split PNG stream
sig = b'\x89PNG\r\n\x1a\n'
pngs = [sig + p for p in raw.split(sig)[1:]]
ims = [Image.open(BytesIO(p)).convert('RGB') for p in pngs]
h = ims[0].size[1]
font = ImageFont.truetype('arial.ttf', 18)
per = cols * rows
for k in range(0, len(ims), per):
    sheet = Image.new('RGB', (cols * (w + 6) + 6, rows * (h + 6) + 6), (60, 60, 60))
    for j, im in enumerate(ims[k:k + per]):
        t = t0 + (k + j) * step
        x, y = 6 + (j % cols) * (w + 6), 6 + (j // cols) * (h + 6)
        sheet.paste(im, (x, y)); d = ImageDraw.Draw(sheet); d.rectangle([x, y, x + 64, y + 22], fill=(255, 220, 0)); d.text((x + 3, y + 1), f'{t:.0f}', fill=(0, 0, 0), font=font)
    out = f'trabalho/{prefix}-{k // per + 1}.png'; sheet.save(out); print(out)
