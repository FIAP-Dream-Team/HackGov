"""Gera roteiro-pitch-grupo.md a partir de roteiro-pitch.md: só o nome de quem fala e a fala, na ordem do vídeo."""
import re, sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')
pasta = Path(__file__).resolve().parent.parent
txt = (pasta / 'roteiro-pitch.md').read_text(encoding='utf-8')
out = ['# Roteiro do Pitch · Alertaí', '']
anterior = None
for m in re.finditer(r'^\*\*\[f\d\d\] Slide \d+ · [^·]+? · fala: ([^*]+)\*\*.*?\n(.*?)(?=^\*\*\[f\d\d\]|^---)', txt, re.S | re.M):
    quem, corpo = m.groups()
    fala = ' '.join(l[1:].strip() for l in corpo.split('\n') if l.startswith('>'))
    fala = re.sub(r'\s*\(pausa\)\s*', ' ', fala.replace('**', '')).strip()
    if quem.strip() != anterior:
        out += [f'**{quem.strip()}**', '']
    out += [fala, '']
    anterior = quem.strip()
(pasta / 'roteiro-pitch-grupo.md').write_text('\n'.join(out), encoding='utf-8')
print('ok')
