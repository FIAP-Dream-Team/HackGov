"""A2 v2: o take de 16/11 até o fim do resultado do B09b, depois o B10 regravado em 17/11 (taxa 100%).

O B10 antigo (digitação com COUNT() e resultado 0%) sai inteiro. O texto do take novo não casa com a
digitação antiga (COUNT() x COUNT(*), ID_BAIRRO x id_bairro, uma linha a mais, árvore lateral recolhida),
então o corte entra na troca de consulta: do resultado do B09b para o editor já rolado no B10 pronto.
Decodifica cada original uma vez e escolhe os quadros (sem recodificar o v1).
"""
import json, subprocess, sys
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC1 = 'originais/2026-11-16 21-02-04.mp4'
SRC2 = 'originais/2026-11-17 12-26-13.mp4'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'A2-take-unico.mp4'
W, H = 1920, 1080; FS = W * H * 3 // 2

# Parte 1: a EDL de 16/11 até o resultado do B09b (inclusive)
edl = json.load(open('trabalho/edl.json'))
corte = next(i for i, e in enumerate(edl) if e['r'].startswith('B10'))
idx1 = []
for e in edl[:corte]:
    n = max(1, round((e['b'] - e['a']) / e['v'] * 30))
    idx1 += [round((e['a'] + k * e['v'] / 30) * 30) for k in range(n)]

# Parte 2: B10 regravado (quadros a 30 fps do original novo)
#  130     segura 0,5 s: B10 escrito, editor parado (o mouse se mexe até o quadro 128)
#  130-232 1x: Ctrl+Enter em 152, resultado 100% assentado em 162; o mouse entra na grade em 233
#  232     segura 0,8 s: resultado limpo
idx2 = [130] * 15 + list(range(130, 233)) + [232] * 24

def frames(src, idx):
    need = {}
    for i in idx: need[i] = need.get(i, 0) + 1
    dec = subprocess.Popen([FF, '-v', 'error', '-i', src, '-map', '0:v', '-vf', 'fps=30', '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-'],
                           stdout=subprocess.PIPE, bufsize=FS * 4)
    n, last = 0, max(idx)
    while n <= last:
        buf = dec.stdout.read(FS)
        if len(buf) < FS: break
        for _ in range(need.get(n, 0)): yield buf
        n += 1
    dec.kill()

enc = subprocess.Popen([FF, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
                        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', OUT],
                       stdin=subprocess.PIPE)
w = 0
for src, idx in ((SRC1, idx1), (SRC2, idx2)):
    for buf in frames(src, idx): enc.stdin.write(buf); w += 1
enc.stdin.close(); enc.wait()
print('parte 1:', len(idx1), 'quadros (', round(len(idx1) / 30, 2), 's ) · parte 2:', len(idx2), 'quadros')
print('emenda em', round(len(idx1) / 30, 2), 's · total', w, 'quadros =', round(w / 30, 2), 's ->', OUT)
