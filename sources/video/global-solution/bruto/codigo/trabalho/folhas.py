import subprocess, sys, re
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
src, tag, out, times = sys.argv[1], sys.argv[2], sys.argv[3], [float(x) for x in sys.argv[4].split(',')]
W = int(sys.argv[5]) if len(sys.argv) > 5 else 640
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 3
crop = sys.argv[7] if len(sys.argv) > 7 else None
font = ImageFont.truetype('arial.ttf', 24)
ims = []
for t in times:
    vf = (f'crop={crop},' if crop else '') + f'scale={W}:-1:flags=lanczos'
    raw = subprocess.run([FF, '-v', 'error', '-i', src, '-ss', f'{t:.2f}', '-frames:v', '1', '-vf', vf, '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    ims.append((t, Image.open(BytesIO(raw)).convert('RGB')))
w, h = ims[0][1].size
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + 8) + 8, rows * (h + 8) + 8), (60, 60, 60))
for j, (t, im) in enumerate(ims):
    x, y = 8 + (j % cols) * (w + 8), 8 + (j // cols) * (h + 8)
    sheet.paste(im, (x, y)); d = ImageDraw.Draw(sheet); d.rectangle([x, y, x + 120, y + 30], fill=(255, 220, 0)); d.text((x + 4, y + 2), f'{tag}{t:.1f}', fill=(0, 0, 0), font=font)
sheet.save(out); print(out, sheet.size)
