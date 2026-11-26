# Vertical strip of a text band, frame by frame (step s), at full resolution, for reading keystrokes.
import subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = 'originais/2026-11-16 21-02-04.mp4'
out, t0, t1, y0, y1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
step = float(sys.argv[6]) if len(sys.argv) > 6 else 0.1
x0, x1 = (int(sys.argv[7]), int(sys.argv[8])) if len(sys.argv) > 8 else (290, 1900)
raw = subprocess.run([FF, '-v', 'error', '-ss', f'{t0:.2f}', '-i', SRC, '-t', f'{t1-t0:.2f}', '-vf', f'fps={1/step},crop={x1-x0}:{y1-y0}:{x0}:{y0},scale=iw*0.75:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
sig = b'\x89PNG\r\n\x1a\n'
ims = [Image.open(BytesIO(sig + p)).convert('RGB') for p in raw.split(sig)[1:]]
w, h = ims[0].size
font = ImageFont.truetype('arial.ttf', 16)
s = Image.new('RGB', (w + 80, len(ims) * (h + 2)), (120, 120, 120))
for j, im in enumerate(ims):
    y = j * (h + 2); s.paste(im, (80, y)); d = ImageDraw.Draw(s); d.text((4, y + h // 2 - 9), f'{t0 + j*step:.1f}', fill=(255, 255, 0), font=font)
s.save(out); print(out, s.size)
