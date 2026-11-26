import subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
src, out, times = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3].split(',')]
crop = sys.argv[4] if len(sys.argv) > 4 else '1920:540:0:0'
font = ImageFont.truetype('arial.ttf', 26)
ims = []
for t in times:
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{t:.2f}', '-i', src, '-frames:v', '1', '-vf', f'crop={crop},scale=960:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    ims.append((t, Image.open(BytesIO(raw)).convert('RGB')))
w, h = ims[0][1].size
sheet = Image.new('RGB', (w * 2 + 30, (h + 10) * ((len(ims) + 1) // 2) + 10), (40, 40, 40))
for j, (t, im) in enumerate(ims):
    x, y = 10 + (j % 2) * (w + 10), 10 + (j // 2) * (h + 10)
    sheet.paste(im, (x, y)); d = ImageDraw.Draw(sheet); d.rectangle([x, y, x + 110, y + 34], fill=(255, 220, 0)); d.text((x + 6, y + 3), f'{t:.2f}', fill=(0, 0, 0), font=font)
sheet.save(out); print(out, sheet.size)
