import subprocess, numpy as np, sys
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
W, H = 805, 200
p = subprocess.Popen([FF, '-v', 'error', '-i', 'originais/2026-11-16 21-02-04.mp4', '-vf', 'fps=10,crop=1610:400:290:90,scale=805:200,format=gray', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
vals, gvals = [], []
while True:
    b = p.stdout.read(W * H)
    if len(b) < W * H: break
    a = np.frombuffer(b, np.uint8).reshape(H, W)
    vals.append(int((a > 100).sum()))
np.save('trabalho/tinta.npy', np.array(vals))
print(len(vals))
