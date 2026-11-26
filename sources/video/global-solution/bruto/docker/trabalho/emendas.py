import subprocess
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
cuts = [8.20, 11.75, 14.91, 18.61, 20.41, 25.71]
font = ImageFont.truetype('arial.ttf', 22)
def fr(t):
    raw = subprocess.run([FF, '-v', 'error', '-ss', f'{t:.3f}', '-i', 'A1-take-unico.mp4', '-frames:v', '1', '-vf', 'crop=1920:1080:0:0,scale=640:-1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    return Image.open(BytesIO(raw)).convert('RGB')
W, H = 640, 360
sheet = Image.new('RGB', (W * 2 + 30, (H + 10) * len(cuts) + 10), (40, 40, 40))
for r, c in enumerate(cuts):
    for k, t in enumerate((c - 1/30, c + 1/30)):
        x, y = 10 + k * (W + 10), 10 + r * (H + 10)
        sheet.paste(fr(t), (x, y)); d = ImageDraw.Draw(sheet); d.rectangle([x, y, x + 190, y + 30], fill=(255, 220, 0))
        d.text((x + 5, y + 3), f'{"antes" if k == 0 else "depois"} {c:.2f}', fill=(0, 0, 0), font=font)
sheet.save('trabalho/emendas.png')
