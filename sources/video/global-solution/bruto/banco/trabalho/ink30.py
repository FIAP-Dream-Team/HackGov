import subprocess, numpy as np, json
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
W, H = 1610, 400
PH = {'P6': (32.4, 48.6), 'P7': (58.0, 160.8), 'P8': (184.0, 205.2), 'P9a': (222.0, 301.5), 'P9b': (369.3, 406.0), 'P10': (413.5, 513.5)}
out = {}
for k, (a, b) in PH.items():
    p = subprocess.Popen([FF, '-v', 'error', '-ss', f'{a-2:.3f}', '-i', 'originais/2026-11-16 21-02-04.mp4', '-ss', '2', '-t', f'{b-a:.3f}', '-vf', 'crop=1610:400:290:90', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    ink = []
    while True:
        buf = p.stdout.read(W * H * 3)
        if len(buf) < W * H * 3: break
        c = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.int16)
        g = c.mean(axis=2)
        pm = (c[:, :, 2] - c[:, :, 0] >= 6) & (c[:, :, 0] >= 48) & (c[:, :, 0] <= 56)
        txt = g > 100
        if pm.sum() > 4000:
            rows = np.nonzero(pm.sum(axis=1) > 120)[0]; cols = np.nonzero(pm.sum(axis=0) > 40)[0]
            if len(rows) and len(cols):
                txt = txt.copy(); txt[max(0, rows[0] - 6):rows[-1] + 6, max(0, cols[0] - 6):cols[-1] + 6] = False
        ink.append(int(txt.sum()))
    out[k] = {'t0': a, 'ink': ink}
    print(k, len(ink))
json.dump(out, open('trabalho/ink30.json', 'w'))
