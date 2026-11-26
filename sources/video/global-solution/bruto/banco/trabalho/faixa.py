import subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = 'originais/2026-11-16 21-02-04.mp4'
prefix, t0, t1, step = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
crop = sys.argv[5] if len(sys.argv) > 5 else '1610:400:290:90'
raw = subprocess.run([FF, '-v', 'error', '-ss', f'{t0:.2f}', '-i', SRC, '-t', f'{t1-t0:.2f}', '-vf', f'fps=1/{step},crop={crop},scale=iw/2:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
sig = b'\x89PNG\r\n\x1a\n'
ims = [Image.open(BytesIO(sig + p)).convert('RGB') for p in raw.split(sig)[1:]]
w, h = ims[0].size
font = ImageFont.truetype('arial.ttf', 18)
per = int(sys.argv[6]) if len(sys.argv) > 6 else 16
for k in range(0, len(ims), per):
    ch = ims[k:k+per]
    s = Image.new('RGB', (2 * w + 28, ((len(ch) + 1) // 2) * (h + 8) + 8), (90, 90, 90))
    for j, im in enumerate(ch):
        t = t0 + (k + j) * step
        x, y = 8 + (j % 2) * (w + 12), 8 + (j // 2) * (h + 8)
        s.paste(im, (x, y)); d = ImageDraw.Draw(s); d.rectangle([x, y, x + 70, y + 22], fill=(255, 220, 0)); d.text((x + 3, y + 1), f'{t:.1f}', fill=(0, 0, 0), font=font)
    out = f'trabalho/{prefix}-{k//per+1}.png'; s.save(out); print(out)
