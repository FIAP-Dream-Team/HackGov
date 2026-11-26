"""Pré-corte do take A3: B04 (terceira confirmação sem aviso novo) e B05 (três "Ja voltou")."""
import subprocess, sys
sys.stdout.reconfigure(encoding='utf-8')
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = 'originais/2026-11-16 21-19-51.mp4'
# A janela não estava em tela cheia: corta a barra de abas (32 px) e reescala para 1920x1080 (+3%).
CROP = 'crop=1862:1048:0:32,scale=1920:1080:flags=lanczos'
# (início, fim, velocidade, o que mostra)
EDL = [
 (0.20, 1.60, 1, 'menu depois da cascata do A1 (continuidade)'),
 (13.25, 14.05, 1, 'B04: opção 4 -> bairro'),
 (20.55, 21.35, 1, 'bairro 4 -> ocorrências ativas'),
 (36.35, 37.15, 1, 'ocorrência 1 -> retorno'),
 (48.45, 49.25, 1, 'retorno 1 (Ainda esta) -> pessoa'),
 (53.15, 58.20, 1, 'pessoa 3 -> Ocorrencia atualizada, Confirmacoes: 3, nenhuma linha de aviso'),
 (181.95, 182.85, 1, 'B05/1: opção 4, bairro 4, ocorrência 1 -> retorno'),
 (184.35, 185.25, 1, 'retorno 2 (Ja voltou) -> pessoa'),
 (188.00, 191.85, 1, 'pessoa 1 -> Ocorrencia atualizada (ainda ATIVA)'),
 (242.95, 246.95, 1, 'B05/2: pessoa 2 -> Ocorrencia atualizada (ainda ATIVA)'),
 (261.00, 264.10, 1, 'B05/3: pessoa 3 -> Status: RESOLVIDA, Encerrada em 21:24'),
 (278.80, 282.60, 1, 'seleção com o mouse em "Status: RESOLVIDA"'),
]
parts, labels = [], []
for i, (a, b, v, _) in enumerate(EDL):
    parts.append(f'[0:v]trim=start={a}:end={b},setpts=(PTS-STARTPTS)/{v},{CROP},fps=30,format=yuv420p[s{i}]')
    labels.append(f'[s{i}]')
fc = ';'.join(parts) + ';' + ''.join(labels) + f'concat=n={len(EDL)}:v=1:a=0[out]'
out = sys.argv[1] if len(sys.argv) > 1 else 'A3-take-unico.mp4'
subprocess.run([FF, '-y', '-v', 'error', '-i', SRC, '-filter_complex', fc, '-map', '[out]', '-c:v', 'libx264', '-preset', 'slow',
                '-crf', '14', '-tune', 'stillimage', '-r', '30', '-movflags', '+faststart', out], check=True)
t = 0.0
for i, (a, b, v, d) in enumerate(EDL, 1):
    print(f'{i}\t{int(t//60)}:{t%60:04.1f}\t{a:.2f}-{b:.2f}\t{v}x\t{d}'); t += (b - a) / v
print(f'total {t:.2f}')
