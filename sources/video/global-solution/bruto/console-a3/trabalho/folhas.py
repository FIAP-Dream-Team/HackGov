import subprocess, re, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = 'originais/2026-11-16 21-19-51.mp4'
out = subprocess.run([FF, '-hide_banner', '-nostats', '-i', SRC, '-vf', 'freezedetect=n=0.002:d=0.5', '-map', '0:v', '-f', 'null', '-'], capture_output=True, text=True).stderr
s = [float(x) for x in re.findall(r'freeze_start: ([0-9.]+)', out)]
e = [float(x) for x in re.findall(r'freeze_end: ([0-9.]+)', out)] + [293.3]
times = [round(b - 0.15, 2) for a, b in zip(s, e)]
font = ImageFont.truetype('arial.ttf', 28)
def frame(t):
    raw = subprocess.run([FF, '-v', 'error', '-i', SRC, '-ss', f'{t:.2f}', '-frames:v', '1', '-vf', 'scale=960:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    return Image.open(BytesIO(raw)).convert('RGB')
per = 6
for k in range(0, len(times), per):
    chunk = times[k:k + per]
    sheet = Image.new('RGB', (960 * 2 + 30, 540 * 3 + 40), (40, 40, 40))
    for j, t in enumerate(chunk):
        x, y = 10 + (j % 2) * 970, 10 + (j // 2) * 550
        sheet.paste(frame(t), (x, y)); d = ImageDraw.Draw(sheet); d.rectangle([x, y, x + 130, y + 38], fill=(255, 220, 0)); d.text((x + 6, y + 4), f'{t:.1f}', fill=(0, 0, 0), font=font)
    sheet.save(f'trabalho/folha-{k // per + 1:02d}.png'); print(k // per + 1, chunk)
