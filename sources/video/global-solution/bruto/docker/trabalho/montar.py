"""Pré-corte do take A1: emenda trechos dos originais num take único (sem som)."""
import subprocess, sys
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
V = ['originais/2026-11-16 20-18-58.mp4', 'originais/2026-11-16 20-23-54.mp4']
# (vídeo, início, fim, o que mostra)
EDL = [
 (0, 21.00, 22.50, 'terminal pronto, prompt'),
 (0, 27.85, 30.00, 'docker start alertai-oracle -> alertai-oracle'),
 (0, 32.55, 35.60, 'Docker Desktop: container alertai-oracle rodando'),
 (0, 38.50, 40.00, 'menu do Alertaí'),
 (0, 66.95, 70.50, 'opção 1: tabelas e catálogo do piloto gravados'),
 (0, 81.55, 82.40, 'opção 2 -> tipo'),
 (0, 84.05, 84.60, 'tipo 1 -> bairro'),
 (0, 86.30, 86.90, 'bairro 4 -> pessoa'),
 (0, 88.42, 89.00, 'pessoa 1 -> severidade'),
 (0, 90.42, 91.00, 'severidade 3 -> descrição'),
 (0, 97.30, 101.00, 'descrição -> Ocorrencia gravada (relato 1)'),
 (1, 27.55, 28.15, 'relato 2: bairro 4 -> pessoa'),
 (1, 29.70, 30.30, 'pessoa 2 -> severidade'),
 (1, 35.60, 36.20, 'severidade 3 -> descrição'),
 (1, 44.20, 49.50, 'descrição -> Relato entrou na ocorrencia ativa + cascata (plano principal)'),
 (1, 63.90, 67.00, 'seleção em "Relato entrou na ocorrencia ativa"'),
]
parts, labels = [], []
for i, (v, a, b, _) in enumerate(EDL):
    parts.append(f'[{v}:v]trim=start={a}:end={b},setpts=PTS-STARTPTS,fps=30,format=yuv420p[s{i}]')
    labels.append(f'[s{i}]')
fc = ';'.join(parts) + ';' + ''.join(labels) + f'concat=n={len(EDL)}:v=1:a=0[out]'
out = sys.argv[1] if len(sys.argv) > 1 else 'A1-take-unico.mp4'
cmd = [FF, '-y', '-v', 'error', '-i', V[0], '-i', V[1], '-filter_complex', fc, '-map', '[out]',
       '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-tune', 'stillimage', '-r', '30', '-movflags', '+faststart', out]
subprocess.run(cmd, check=True)
t = 0.0
print('| # | Take | Origem | Trecho original | Mostra |\n| --- | --- | --- | --- | --- |')
for i, (v, a, b, d) in enumerate(EDL, 1):
    print(f'| {i} | {int(t//60)}:{t%60:05.2f} | vídeo {v+1} | {a:.2f}–{b:.2f} s | {d} |'); t += b - a
print(f'\nDuração: {t:.2f} s')
