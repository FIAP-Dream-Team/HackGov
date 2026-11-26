# Per frame at 10 fps: text ink in the editor (popup box masked out), popup pixel count,
# and whole-frame motion (downscaled), to find typing, deletions and dead time.
import subprocess, numpy as np
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
W, H = 1610, 400
p = subprocess.Popen([FF, '-v', 'error', '-i', 'originais/2026-11-16 21-02-04.mp4', '-vf', 'fps=10,crop=1610:400:290:90,format=gray', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
ink, pop, mot = [], [], []
prev = None
while True:
    b = p.stdout.read(W * H)
    if len(b) < W * H: break
    g = np.frombuffer(b, np.uint8).reshape(H, W)
    pm = (g > 55) & (g < 70)
    txt = g > 100
    n = int(pm.sum())
    if n > 3000:
        ys, xs = np.nonzero(pm)
        y0, y1, x0, x1 = np.percentile(ys, 2), np.percentile(ys, 98), np.percentile(xs, 2), np.percentile(xs, 98)
        txt = txt.copy(); txt[max(0,int(y0)-6):int(y1)+6, max(0,int(x0)-6):int(x1)+6] = False
    ink.append(int(txt.sum())); pop.append(n)
    small = g[::8, ::8].astype(int)
    mot.append(0 if prev is None else int(np.abs(small - prev).sum())); prev = small
np.savez('trabalho/analise.npz', ink=np.array(ink), pop=np.array(pop), mot=np.array(mot))
print(len(ink))
