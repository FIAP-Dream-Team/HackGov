import json, numpy as np, sys
D = json.load(open('trabalho/ink30.json'))
TOL = int(sys.argv[1]) if len(sys.argv) > 1 else 60
SCROLL = [254.9, 296.4, 501.9, 94.3]   # view moves: comparisons don't cross these
out = {}
for k, v in D.items():
    raw = np.array(v['ink'], float); t0 = v['t0']; n = len(raw)
    med = np.array([np.median(raw[max(0, i - 15):i + 16]) for i in range(n)])
    x = np.where(raw < 0.85 * med, med, raw)
    ink = np.array([x[max(0, i - 9):i + 10].max() for i in range(n)])
    t = t0 + np.arange(n) / 30
    cuts = [0] + [int((s - t0) * 30) for s in SCROLL if t0 < s < t[-1]] + [n]
    keep = np.ones(n, bool)
    for a, b in zip(cuts[:-1], cuts[1:]):
        seg = ink[a:b]; suf = np.minimum.accumulate(seg[::-1])[::-1]
        keep[a:b] = seg <= suf + TOL
    runs, i = [], 0
    while i < n:
        if not keep[i]:
            j = i
            while j < n and not keep[j]: j += 1
            runs.append((round(t[i], 2), round(t[j - 1] + 1 / 30, 2))); i = j
        else: i += 1
    out[k] = runs
    print(k, ' '.join(f'[{a:.2f}-{b:.2f}]' for a, b in runs))
json.dump(out, open('trabalho/sufmin.json', 'w'))
