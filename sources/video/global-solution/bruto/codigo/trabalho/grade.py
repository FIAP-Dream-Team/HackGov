import subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
src, out, items = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
font = ImageFont.truetype('arial.ttf', 14); big = ImageFont.truetype('arial.ttf', 22)
tiles = []
for it in items:
    t = float(it)
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{max(0,t-2):.2f}', '-i', src, '-ss', f'{min(t,2):.2f}', '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    im = Image.open(BytesIO(raw)).convert('RGB').resize((960, 540), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    for x in range(0, 1920, 100):
        d.line([(x/2, 0), (x/2, 540)], fill=(255, 0, 0) if x % 500 == 0 else (120, 0, 0)); d.text((x/2 + 2, 2), str(x), fill=(255, 80, 80), font=font)
    for y in range(0, 1080, 100):
        d.line([(0, y/2), (960, y/2)], fill=(0, 200, 255) if y % 500 == 0 else (0, 90, 120)); d.text((2, y/2 + 2), str(y), fill=(80, 200, 255), font=font)
    d.rectangle([860, 510, 960, 540], fill=(255, 220, 0)); d.text((865, 513), it, fill=(0, 0, 0), font=big)
    tiles.append(im)
sheet = Image.new('RGB', (1930, 550 * ((len(tiles) + 1) // 2)), (40, 40, 40))
for j, im in enumerate(tiles): sheet.paste(im, ((j % 2) * 970, (j // 2) * 550))
sheet.save(out); print(out)
