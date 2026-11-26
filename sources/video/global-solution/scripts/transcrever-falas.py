"""Transcreve as falas gravadas do pitch e compara com roteiro-pitch.md (faster-whisper small, CPU int8)."""
import re, sys, json, subprocess, difflib, unicodedata
from pathlib import Path
import numpy as np
from faster_whisper import WhisperModel
sys.stdout.reconfigure(encoding='utf-8')
BASE = Path(__file__).resolve().parent.parent
FF = BASE.parent / 'remotion' / 'node_modules' / 'ffmpeg-static' / 'ffmpeg.exe'
MAPA = {'joao.mp4': ['f02'], 'joao2.mp4': ['f03'], 'brenda.ogg': ['f04'], 'vinicius.mp4': ['f06', 'f07'],
        'lari.mp4': ['f08'], 'brenda2.ogg': ['f09'], 'lari2.mp4': ['f10']}
PROMPT = 'Alertaí, Porto Alegre, Guaíba, Sarandi, Arquipélago, ODS, efeito cascata, estação de bombeamento.'
t = (BASE / 'roteiro-pitch.md').read_text(encoding='utf-8')
falas = {m.group(1): re.sub(r'\(pausa\)|\*', '', ' '.join(l[1:].strip() for l in m.group(2).split('\n') if l.startswith('>'))).strip()
         for m in re.finditer(r'^\*\*\[(f\d\d)\].*?\n(.*?)(?=^\*\*\[f\d\d\]|^---)', t, re.S | re.M)}
def norm(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.findall(r"[a-z0-9]+", s)
model = WhisperModel('small', device='cpu', compute_type='int8')
saida = {}
for arq, ids in MAPA.items():
    p = BASE / 'falas' / arq
    if not p.exists(): continue
    pcm = subprocess.run([str(FF), '-v', 'error', '-i', str(p), '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, dtype=np.float32)
    segs, info = model.transcribe(audio, language='pt', word_timestamps=True, initial_prompt=PROMPT, beam_size=5, vad_filter=False)
    words = [{'w': w.word.strip(), 's': round(w.start, 2), 'e': round(w.end, 2)} for sg in segs for w in sg.words]
    texto = ' '.join(w['w'] for w in words)
    esperado = ' '.join(falas[i] for i in ids)
    a, b = norm(esperado), norm(texto)
    ops = [(op, ' '.join(a[i1:i2]), ' '.join(b[j1:j2])) for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if op != 'equal']
    saida[arq] = {'falas': ids, 'duracao': round(len(audio) / 16000, 2), 'fala_inicio': words[0]['s'] if words else None,
                  'fala_fim': words[-1]['e'] if words else None, 'transcricao': texto, 'roteiro': esperado,
                  'semelhanca': round(difflib.SequenceMatcher(None, a, b, autojunk=False).ratio(), 3), 'diferencas': ops, 'palavras': words}
    print(f'\n===== {arq} → {"+".join(ids)}  ({saida[arq]["duracao"]} s; fala {saida[arq]["fala_inicio"]}–{saida[arq]["fala_fim"]} s; semelhança {saida[arq]["semelhanca"]})')
    print('ROTEIRO :', esperado)
    print('GRAVADO :', texto)
    for op, x, y in ops: print(f'  {op:8} roteiro="{x}"  gravado="{y}"')
(BASE / 'falas' / 'transcricao' / 'transcricao.json').write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding='utf-8')
