"""Monta o take a partir de trabalho/edl.json: decodifica o original uma vez e escolhe os quadros."""
import json, subprocess, sys
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = 'originais/2026-11-16 21-02-04.mp4'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'A2-take-unico.mp4'
edl = json.load(open('trabalho/edl.json'))
idx, mapa = [], []
for e in edl:
    n = max(1, round((e['b'] - e['a']) / e['v'] * 30))
    for k in range(n):
        idx.append(round((e['a'] + k * e['v'] / 30) * 30))
assert all(x < y for x, y in zip(idx, idx[1:])) or True
W, H = 1920, 1080; FS = W * H * 3 // 2
dec = subprocess.Popen([FF, '-v', 'error', '-i', SRC, '-map', '0:v', '-vf', 'fps=30', '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-'], stdout=subprocess.PIPE, bufsize=FS * 4)
enc = subprocess.Popen([FF, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
                        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
need = {}
for i in idx: need[i] = need.get(i, 0) + 1
last = max(idx); n = 0; written = 0
while n <= last:
    buf = dec.stdout.read(FS)
    if len(buf) < FS: break
    for _ in range(need.get(n, 0)):
        enc.stdin.write(buf); written += 1
    n += 1
enc.stdin.close(); enc.wait(); dec.kill()
print('quadros', written, 'de', len(idx), '->', OUT, round(written / 30, 2), 's')
