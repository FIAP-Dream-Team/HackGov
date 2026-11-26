import json, subprocess, sys
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
rep = {n: (t, rows) for n, t, rows in json.load(open('trabalho/relatorio.json', encoding='utf-8'))}
font = ImageFont.truetype('arial.ttf', 20)
for name in sys.argv[1:]:
    total, rows = rep[name]
    FP = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe"
    dur = lambda p: float(subprocess.run([FP, '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
    acc, times = 0.0, []
    for i in range(len(rows) - 1):
        acc += dur(f'trabalho/seg/{name}-{i:02d}.mp4')
        times += [acc - 1/30, acc + 1/30]
    total = dur(f'{name}.mp4')
    times.append(total - 0.5)
    ims = []
    for t in times:
        raw = subprocess.run([FF, '-v', 'error', '-i', f'{name}.mp4', '-ss', f'{max(0,t):.3f}', '-frames:v', '1', '-vf', 'scale=640:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
        ims.append((t, Image.open(BytesIO(raw)).convert('RGB')))
    cols = 2; w, h = 640, 360
    sheet = Image.new('RGB', (cols * (w + 6) + 6, ((len(ims) + 1) // 2) * (h + 6) + 6), (40, 40, 40))
    for j, (t, im) in enumerate(ims):
        x, y = 6 + (j % 2) * (w + 6), 6 + (j // 2) * (h + 6)
        sheet.paste(im, (x, y)); d = ImageDraw.Draw(sheet); d.rectangle([x, y, x + 90, y + 26], fill=(255, 220, 0)); d.text((x + 4, y + 2), f'{t:.2f}', fill=(0, 0, 0), font=font)
    sheet.save(f'trabalho/conf-{name}.png'); print(name, len(ims))
