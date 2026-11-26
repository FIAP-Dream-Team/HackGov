"""Pré-corte das tomadas de código (Bloco B): um clipe por tomada + rolo de revisão."""
import subprocess, os, sys
FF = r"C:/Users/John Silverio/Documents/projects/HackGov/sources/video/remotion/node_modules/ffmpeg-static/ffmpeg.exe"
V1 = 'originais/2026-11-16 21-30-19.mp4'
V2 = 'originais/2026-11-16 21-34-21.mp4'
MEZ = ['-an', '-c:v', 'libx264', '-crf', '8', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-r', '30']

def rect_vf(r):
    x, y, w = r; h = round(w * 9 / 16)
    return f'crop={w}:{h}:{x}:{y},scale=1920:1080:flags=lanczos'

def ramp_vf(r, d):
    x, y, w = r
    e = f'(st(0,clip(it/{d},0,1))*0+ld(0)*ld(0)*(3-2*ld(0)))'
    return (f"scale=3840:2160:flags=lanczos,zoompan=z='3840/(3840+({2*w}-3840)*{e})'"
            f":x='{2*x}*{e}':y='{2*y}*{e}':d=1:s=1920x1080:fps=30")

def seg(out, kind, src, a, b=None, speed=1.0, rect=None, ramp=None, hold=None):
    if kind == 'f':  # freeze frame a, held for `hold` seconds
        png = out.replace('.mp4', '.png')
        subprocess.run([FF, '-y', '-v', 'error', '-ss', f'{max(0, a - 2):.3f}', '-i', src, '-ss', f'{min(a, 2):.3f}', '-frames:v', '1', png], check=True)
        vf = rect_vf(rect) if rect else 'scale=1920:1080'
        subprocess.run([FF, '-y', '-v', 'error', '-loop', '1', '-t', f'{hold}', '-i', png, '-vf', vf + ',fps=30', *MEZ, out], check=True)
        return hold
    chain = [f'setpts=(PTS-STARTPTS)/{speed}']
    if ramp: chain.append(ramp_vf(rect, ramp))
    elif rect: chain += [rect_vf(rect), 'fps=30']
    else: chain.append('fps=30')
    subprocess.run([FF, '-y', '-v', 'error', '-ss', f'{a:.3f}', '-t', f'{b - a:.3f}', '-i', src, '-vf', ','.join(chain), *MEZ, out], check=True)
    return (b - a) / speed

R_B11 = (420, 90, 1440); R_B12A = (410, 40, 960); R_B12B = (380, 170, 1280)
R_B16A = (420, 160, 1280); R_B16B = (410, 100, 1130); R_B13 = (420, 90, 1440); R_B14 = (410, 150, 1440)

CLIPS = {
 'B15-arvore-projeto': [
   ('s', V2, 341.4, 352.6, 3.0, None, None, None, 'árvore: dao, model, service e view se abrindo'),
   ('f', V2, 352.4, None, 1, None, None, 3.0, 'árvore com as quatro camadas expandidas (segura)')],
 'B11-ocorrencia-construtor': [
   ('s', V1, 9.6, 12.4, 3.0, None, None, None, 'árvore: model → Ocorrencia'),
   ('s', V1, 26.1, 27.6, 1.0, None, None, None, 'construtor public Ocorrencia( (linha 18)'),
   ('s', V1, 28.7, 31.8, 4.0, None, None, None, 'rolagem pelas validações'),
   ('s', V1, 40.5, 43.1, 2.0, None, None, None, 'rolagem até a linha 42'),
   ('r', V1, 44.4, 45.4, 0.75, R_B11, 1.0, None, 'seleção da linha 42 + zoom'),
   ('s', V1, 45.4, 48.4, 1.0, R_B11, None, None, 'throw "A severidade fica entre 1 e 3." selecionado')],
 'B12a-enum-statusestacao': [
   ('s', V1, 78.4, 79.5, 1.0, None, None, None, 'abre StatusEstacao'),
   ('r', V1, 79.5, 83.7, 1.0, R_B12A, 1.0, None, 'enum OPERANDO, SEM_ENERGIA, DESLIGADA + zoom')],
 'B12b-check-sql': [
   ('s', V2, 17.2, 18.95, 1.0, None, None, None, 'alerta_bairro.sql: rolagem até ESTACAO_BOMBEAMENTO'),
   ('r', V2, 18.95, 22.6, 1.0, R_B12B, 1.2, None, 'CONSTRAINT CK_EST_STATUS CHECK (linha 121) + zoom')],
 'B16-listas-menu': [
   ('s', V2, 70.9, 72.4, 1.5, None, None, None, 'árvore: view → MenuPrincipal'),
   ('s', V2, 73.0, 79.4, 5.0, None, None, None, 'rolagem até a linha 166'),
   ('r', V2, 79.4, 80.4, 1.0, R_B16A, 1.0, None, 'escolherBairro (166) + zoom'),
   ('s', V2, 90.45, 91.6, 0.75, R_B16A, None, None, 'seleção de bancoService.listarBairros() (169)'),
   ('s', V2, 92.2, 94.2, 1.0, R_B16A, None, None, 'listarBairros() selecionado (segura)'),
   ('s', V2, 98.4, 103.5, 5.0, None, None, None, 'rolagem até a linha 217'),
   ('r', V2, 112.9, 114.35, 0.75, R_B16B, 0.9, None, 'seleção de escolher( ... List<T> itens ...) + zoom'),
   ('f', V2, 114.35, None, 1, R_B16B, None, 2.5, 'linhas 217–222 selecionadas (segura)')],
 'B13-registrar-agrupa': [
   ('s', V2, 157.6, 159.0, 1.5, None, None, None, 'árvore: service → OcorrenciaService'),
   ('s', V2, 162.2, 164.6, 1.5, None, None, None, 'registrar( (linha 24)'),
   ('r', V2, 183.35, 185.7, 1.0, R_B13, 0.8, None, 'buscarAtivaNaJanela selecionado (31–33) + zoom'),
   ('s', V2, 192.1, 194.0, 2.0, R_B13, None, None, 'rolagem até o else'),
   ('r', V2, 196.5, 197.5, 0.75, R_B13, 0.001, None, 'seleção de 44–47'),
   ('s', V2, 197.5, 200.7, 1.0, R_B13, None, None, 'somarConfirmacao e agrupada = true selecionados')],
 'B14-update-trava': [
   ('s', V2, 245.0, 246.3, 1.5, None, None, None, 'árvore: dao → EstacaoDAO'),
   ('s', V2, 249.6, 253.5, 3.0, None, None, None, 'rolagem até marcarSemEnergia'),
   ('r', V2, 255.0, 257.6, 1.0, R_B14, 1.0, None, 'marcarSemEnergia (linha 65) destacado + zoom'),
   ('s', V2, 270.55, 271.3, 0.75, R_B14, None, None, 'início da seleção do UPDATE'),
   ('s', V2, 271.6, 272.3, 0.75, R_B14, None, None, 'seleção até o WHERE'),
   ('f', V2, 272.9, None, 1, R_B14, None, 3.0, 'UPDATE ... WHERE ... AND STATUS = ? selecionado (segura)')],
}
ORDER = ['B15-arvore-projeto', 'B11-ocorrencia-construtor', 'B12a-enum-statusestacao', 'B12b-check-sql',
         'B16-listas-menu', 'B13-registrar-agrupa', 'B14-update-trava']
only = sys.argv[1:] or ORDER
os.makedirs('trabalho/seg', exist_ok=True)
report = []
for name in only:
    parts, t, rows = [], 0.0, []
    for i, (kind, src, a, b, speed, rect, ramp, hold, desc) in enumerate(CLIPS[name]):
        out = f'trabalho/seg/{name}-{i:02d}.mp4'
        d = seg(out, 'f' if kind == 'f' else kind, src, a, b, speed, rect, ramp, hold)
        parts.append(out)
        origem = 'v1' if src == V1 else 'v2'
        rows.append((t, origem, a, b, speed if kind != 'f' else None, rect, ramp, d, desc)); t += d
    lst = f'trabalho/seg/{name}.txt'
    with open(lst, 'w', encoding='utf-8') as f:
        for p in parts: f.write(f"file '{os.path.basename(p)}'\n")
    subprocess.run([FF, '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow',
                    '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', f'{name}.mp4'], check=True)
    report.append((name, t, rows))
import json
json.dump([(n, t, [list(r) for r in rows]) for n, t, rows in report], open('trabalho/relatorio.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for n, t, rows in report: print(n, round(t, 2))
