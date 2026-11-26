import subprocess, numpy as np
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
W, H = 805, 200
p = subprocess.Popen([FF, '-v', 'error', '-i', 'originais/2026-11-16 21-02-04.mp4', '-vf', 'fps=10,crop=1610:400:290:90,scale=805:200', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
ink, pop = [], []
while True:
    b = p.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    a = np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(int)
    g = a.mean(axis=2)
    ink.append(int((g > 100).sum()))
    pop.append(int(((g > 55) & (g < 70)).sum()))
np.save('trabalho/ink.npy', np.array(ink)); np.save('trabalho/pop.npy', np.array(pop))
print(len(ink))
