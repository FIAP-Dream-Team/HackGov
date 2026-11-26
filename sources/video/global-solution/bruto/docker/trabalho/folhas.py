import subprocess, sys, re, os
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
def freezes(path):
    out = subprocess.run([FF, '-hide_banner', '-nostats', '-i', path, '-vf', 'freezedetect=n=0.002:d=0.8', '-map', '0:v', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = [float(x) for x in re.findall(r'freeze_start: ([0-9.]+)', out)]
    e = [float(x) for x in re.findall(r'freeze_end: ([0-9.]+)', out)]
    return s, e
def frame(path, t, w=960):
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{t:.2f}', '-i', path, '-frames:v', '1', '-vf', f'scale={w}:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    from io import BytesIO
    return Image.open(BytesIO(raw)).convert('RGB')
font = ImageFont.truetype('arial.ttf', 28)
for idx, name in enumerate(sorted(os.listdir('originais')), 1):
    p = os.path.join('originais', name)
    s, e = freezes(p)
    times = sorted(set([round(x + 0.4, 2) for x in s]))
    thumbs = [(t, frame(p, t)) for t in times]
    per = 6
    for k in range(0, len(thumbs), per):
        chunk = thumbs[k:k + per]
        sheet = Image.new('RGB', (960 * 2 + 30, 540 * 3 + 40), (40, 40, 40))
        for j, (t, im) in enumerate(chunk):
            x, y = 10 + (j % 2) * 970, 10 + (j // 2) * 550
            sheet.paste(im, (x, y))
            d = ImageDraw.Draw(sheet); d.rectangle([x, y, x + 150, y + 40], fill=(255, 220, 0)); d.text((x + 8, y + 4), f'v{idx} {t:.1f}s', fill=(0, 0, 0), font=font)
        out = f'trabalho/folha-v{idx}-{k // per + 1}.png'
        sheet.save(out); print(out, [t for t, _ in chunk])
