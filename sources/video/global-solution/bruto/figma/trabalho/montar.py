"""Cut the Figma take (bruto/figma/originais) into the B26 clips.

Every real-footage piece drops the Windows/Figma tab bar (rows 0-37) and the scrollbars, crops a 16:9
window of the canvas (1831x1030) and scales it to 1920x1080 (+4.9%). Stepwise drags keep 0.1 s of the
still canvas on each side of each drag; the rest of each stop is identical frames, so the cut is invisible.

Usage: python -E -P montar.py <ffmpeg>
"""
import os
import subprocess
import sys

FF = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "originais", "2026-11-17 12-48-04.mp4")
Y0, CH, CW = 38, 1030, 1831
PAD = 0.10


def bursts_to_segments(first_hold, bursts, last_hold):
    segs = [first_hold]
    for a, b in bursts:
        segs.append((a - PAD, b + PAD))
    segs.append(last_hold)
    return segs


def render(name, pieces):
    """pieces: list of ("seg", a, b, x0) | ("freeze", t, secs, x0) | ("file", path)."""
    inputs, chains, labels = [], [], []
    src_idx = None
    for k, p in enumerate(pieces):
        if p[0] == "file":
            inputs += ["-i", p[1]]
            idx = len(inputs) // 2 - 1
            chains.append(f"[{idx}:v]fps=30,format=yuv420p,setsar=1,setpts=PTS-STARTPTS[p{k}]")
        else:
            if src_idx is None:
                inputs += ["-i", SRC]
                src_idx = len(inputs) // 2 - 1
            crop = f"crop={CW}:{CH}:{p[3]}:{Y0},scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p"
            if p[0] == "seg":
                chains.append(f"[{src_idx}:v]trim=start={p[1]:.3f}:end={p[2]:.3f},setpts=PTS-STARTPTS,{crop}[p{k}]")
            else:  # freeze one frame
                n = int(round(p[2] * 30))
                chains.append(f"[{src_idx}:v]trim=start={p[1]:.3f}:end={p[1] + 1 / 30:.4f},setpts=PTS-STARTPTS,"
                              f"loop=loop={n - 1}:size=1:start=0,setpts=N/30/TB,{crop}[p{k}]")
        labels.append(f"[p{k}]")
    # the same source feeds several chains: split it
    uses = sum(1 for p in pieces if p[0] != "file")
    if uses > 1:
        outs = "".join(f"[s{i}]" for i in range(uses))
        pre = f"[{src_idx}:v]split={uses}{outs}"
        i = 0
        fixed = []
        for c in chains:
            if c.startswith(f"[{src_idx}:v]"):
                c = f"[s{i}]" + c[len(f"[{src_idx}:v]"):]
                i += 1
            fixed.append(c)
        chains = [pre] + fixed
    graph = ";".join(chains) + ";" + "".join(labels) + f"concat=n={len(labels)}:v=1:a=0[out]"
    out = os.path.join(ROOT, f"{name}.mp4")
    cmd = [FF, "-v", "error", "-y"] + inputs + ["-filter_complex", graph, "-map", "[out]", "-r", "30",
                                                "-c:v", "libx264", "-crf", "16", "-preset", "slow",
                                                "-pix_fmt", "yuv420p", "-an", out]
    subprocess.run(cmd, check=True)
    print("wrote", name)


X_CENTER = 42  # (1914 - 1831) / 2 + 1

# B26a real pan: still at screens 1-3 (after the hover outline at 30.40), six drags, still at screens 5-7
wf_real = bursts_to_segments(
    (30.45, 30.95),
    [(31.57, 32.40), (33.57, 34.57), (35.57, 36.30), (37.23, 37.93), (38.83, 39.60), (40.53, 40.90)],
    (41.00, 42.20))
render("B26a-wireframes-pan-real", [("seg", a, b, X_CENTER) for a, b in wf_real])

# B26a main: overview of the 7 wireframes (clean window 20.00-21.43, no hover outline) + smooth pan
render("B26a-wireframes", [("seg", 20.00, 21.40, 1),
                           ("file", os.path.join(HERE, "B26a-wireframes-pan-suave.mp4"))])

# B26b real pan: hi-fi phone row; ends on a freeze of 73.80, the last frame before the hover outline on screen 7
hf_real = bursts_to_segments(
    (65.90, 66.40),
    [(66.50, 67.50), (68.70, 69.50), (70.57, 71.40), (72.20, 72.53), (72.77, 73.67)],
    (73.77, 73.80))
render("B26b-alta-fidelidade-pan-real",
       [("seg", a, b, X_CENTER) for a, b in hf_real] + [("freeze", 73.80, 1.2, X_CENTER)])

# B26c desktop row (real only: Figma was still loading image tiles, so the stitch ghosts)
pc_real = bursts_to_segments(
    (79.90, 80.40),
    [(80.50, 81.53), (82.50, 83.60), (84.43, 85.23), (85.87, 86.83), (88.27, 88.67), (89.13, 89.13), (89.93, 90.23)],
    (90.33, 91.20))
render("B26c-computador", [("seg", a, b, X_CENTER) for a, b in pc_real])

# B26d hi-fi page overview, phone row above desktop row, still canvas (94.5-103.47 has no outline)
render("B26d-alta-fidelidade-visao-geral", [("seg", 95.60, 99.60, 84)])
