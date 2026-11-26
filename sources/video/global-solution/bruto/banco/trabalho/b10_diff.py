"""Mapa de mudanças quadro a quadro do take novo do B10 (2026-11-17 12-26-13), por região."""
import subprocess, sys, numpy as np
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = sys.argv[1] if len(sys.argv) > 1 else 'originais/2026-11-17 12-26-13.mp4'
W, H = 480, 270
p = subprocess.run([FF, '-v', 'error', '-i', SRC, '-vf', f'fps=30,scale={W}:{H},format=gray', '-f', 'rawvideo', '-'],
                   capture_output=True, check=True)
f = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W).astype(int)
REG = {'editor': (slice(10, 140), slice(30, 480)), 'grade': (slice(140, 265), slice(30, 480)), 'tudo': (slice(0, H), slice(0, W))}
for i in range(1, len(f)):
    d = {k: int((abs(f[i][r] - f[i - 1][r]) > 12).sum()) for k, r in REG.items()}
    if d['tudo'] > 0:
        print(f'{i:4d} {i/30:6.2f}s ' + ' '.join(f'{k}={v}' for k, v in d.items()))
print('quadros', len(f))
