import subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = 'originais/2026-11-16 21-02-04.mp4'
pairs = [tuple(map(float, p.split(':'))) for p in sys.argv[2].split(',')]
crop = sys.argv[3] if len(sys.argv) > 3 else '1610:400:290:90'
font = ImageFont.truetype('arial.ttf', 18)
def fr(t):
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{max(0,t-3):.2f}', '-i', SRC, '-ss', f'{min(t,3):.2f}', '-frames:v', '1', '-vf', f'crop={crop},scale=iw/2:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    return Image.open(BytesIO(raw)).convert('RGB')
ims = [(a, fr(a), b, fr(b)) for a, b in pairs]
w, h = ims[0][1].size
per = 8
for k in range(0, len(ims), per):
    ch = ims[k:k+per]
    s = Image.new('RGB', (2 * w + 30, len(ch) * (h + 8) + 8), (90, 90, 90))
    for r, (a, ia, b, ib) in enumerate(ch):
        y = 8 + r * (h + 8)
        for c, (t, im) in enumerate(((a, ia), (b, ib))):
            x = 8 + c * (w + 12); s.paste(im, (x, y)); d = ImageDraw.Draw(s); d.rectangle([x, y, x + 70, y + 22], fill=(255, 220, 0)); d.text((x + 3, y + 1), f'{t:.1f}', fill=(0, 0, 0), font=font)
    out = f'trabalho/{sys.argv[1]}-{k//per+1}.png'; s.save(out); print(out)
