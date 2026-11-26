import subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = 'originais/2026-11-16 21-02-04.mp4'
out, ts = sys.argv[1], [float(x) for x in sys.argv[2].split(',')]
w = int(sys.argv[3]) if len(sys.argv) > 3 else 960
font = ImageFont.truetype('arial.ttf', 22)
ims = []
for t in ts:
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{max(0,t-3):.3f}', '-i', SRC, '-ss', f'{min(t,3):.3f}', '-frames:v', '1', '-vf', f'scale={w}:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    ims.append(Image.open(BytesIO(raw)).convert('RGB'))
h = ims[0].size[1]
s = Image.new('RGB', (2 * w + 30, ((len(ims) + 1) // 2) * (h + 10) + 10), (90, 90, 90))
for j, (t, im) in enumerate(zip(ts, ims)):
    x, y = 10 + (j % 2) * (w + 10), 10 + (j // 2) * (h + 10)
    s.paste(im, (x, y)); d = ImageDraw.Draw(s); d.rectangle([x, y, x + 90, y + 28], fill=(255, 220, 0)); d.text((x + 4, y + 2), f'{t:.2f}', fill=(0, 0, 0), font=font)
s.save(out); print(out)
