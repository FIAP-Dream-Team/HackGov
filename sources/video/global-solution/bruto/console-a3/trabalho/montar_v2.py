"""A3 v2: o take de 16/11 (B04 + três "Ja voltou") e o passo final regravado em 17/11 (opção 3 -> bairro 4 ->
"Nenhuma ocorrencia ativa em Arquipelago").

Os dois originais passam pela mesma transformação (corta 1862x1048 e reescala para 1920x1080, +3%), para o
texto ter o mesmo tamanho e a mesma margem nos dois lados da emenda. No de 16/11 o recorte começa em y=32
(barra de abas); no de 17/11, que já está em tela cheia, começa em y=0.
"""
import subprocess, sys
sys.stdout.reconfigure(encoding='utf-8')
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
SRC = ['originais/2026-11-16 21-19-51.mp4', 'originais/2026-11-17 12-29-03.mp4']
CROP = ['crop=1862:1048:0:32,scale=1920:1080:flags=lanczos', 'crop=1862:1048:0:0,scale=1920:1080:flags=lanczos']
# (fonte, início, fim, o que mostra)
EDL = [
 (0, 0.20, 1.60, 'menu depois da cascata do A1 (continuidade)'),
 (0, 13.25, 14.05, 'B04: opção 4 -> bairro'),
 (0, 20.55, 21.35, 'bairro 4 -> ocorrências ativas'),
 (0, 36.35, 37.15, 'ocorrência 1 -> retorno'),
 (0, 48.45, 49.25, 'retorno 1 (Ainda esta) -> pessoa'),
 (0, 53.15, 58.20, 'pessoa 3 -> Ocorrencia atualizada, Confirmacoes: 3, nenhuma linha de aviso'),
 (0, 181.95, 182.85, 'B05/1: opção 4, bairro 4, ocorrência 1 -> retorno'),
 (0, 184.35, 185.25, 'retorno 2 (Ja voltou) -> pessoa'),
 (0, 188.00, 191.85, 'pessoa 1 -> Ocorrencia atualizada (ainda ATIVA)'),
 (0, 242.95, 246.95, 'B05/2: pessoa 2 -> Ocorrencia atualizada (ainda ATIVA)'),
 (0, 261.00, 264.10, 'B05/3: pessoa 3 -> Status: RESOLVIDA, Encerrada em 21:24'),
 (0, 278.80, 282.60, 'seleção com o mouse em "Status: RESOLVIDA"'),
 # 17/11: passo final
 (1, 5.00, 6.05, 'menu limpo, "Opcao:" -> 3 + Enter'),
 (1, 6.85, 7.75, 'lista de bairros -> "Bairro:"'),
 (1, 8.05, 8.45, '4 + Enter'),
 (1, 8.45, 9.70, 'Nenhuma ocorrencia ativa em Arquipelago. + menu'),
 (1, 11.00, 13.55, 'mouse vai até a linha e seleciona "Nenhuma ocorrencia ativa em Arquipelago."'),
 (1, 13.55, 16.50, 'segura a seleção'),
]
parts, labels = [], []
for i, (s, a, b, _) in enumerate(EDL):
    parts.append(f'[{s}:v]trim=start={a}:end={b},setpts=PTS-STARTPTS,{CROP[s]},fps=30,format=yuv420p[s{i}]')
    labels.append(f'[s{i}]')
fc = ';'.join(parts) + ';' + ''.join(labels) + f'concat=n={len(EDL)}:v=1:a=0[out]'
out = sys.argv[1] if len(sys.argv) > 1 else 'A3-take-unico.mp4'
cmd = [FF, '-y', '-v', 'error']
for s in SRC: cmd += ['-i', s]
cmd += ['-filter_complex', fc, '-map', '[out]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-tune', 'stillimage',
        '-r', '30', '-movflags', '+faststart', out]
subprocess.run(cmd, check=True)
t = 0.0
for i, (s, a, b, d) in enumerate(EDL, 1):
    print(f'{i}\t{int(t//60)}:{t%60:04.1f}\t{"16/11" if s == 0 else "17/11"} {a:.2f}-{b:.2f}\t{d}'); t += b - a
print(f'total {t:.2f}')
