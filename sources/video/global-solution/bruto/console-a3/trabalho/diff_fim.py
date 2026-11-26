"""Mapa de mudanças quadro a quadro do passo final do A3 (2026-11-17 12-29-03)."""
import subprocess, numpy as np
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = 'originais/2026-11-17 12-29-03.mp4'
W, H = 480, 270
p = subprocess.run([FF, '-v', 'error', '-i', SRC, '-vf', f'fps=30,scale={W}:{H},format=gray', '-f', 'rawvideo', '-'],
                   capture_output=True, check=True)
f = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W).astype(int)
prev = None
for i in range(1, len(f)):
    d = int((abs(f[i] - f[i - 1]) > 12).sum())
    if d:
        ys, xs = np.nonzero(abs(f[i] - f[i - 1]) > 12)
        print(f'{i:4d} {i/30:6.2f}s px={d:5d} y={ys.min()*4}-{ys.max()*4} x={xs.min()*4}-{xs.max()*4}')
print('quadros', len(f))
