"""Clips from the 13-48 re-recording (originais/2026-11-17 13-48-13.mp4, untouched). Same EDL format as montar.py.

B27: full frame, same crop/scale as B25 (1877x1056 at (12, 0) -> 1920x1080).
B30: only the Acessibilidade card. Screen window x 590-1570, y 840-1050 (the same window holds the card in
both layouts, Texto maior off and on; above it there is only the empty bottom padding of the "Seus dados"
card, never its text), scaled 1.6x and centred on a canvas with the page colour #F5F2FA. Name, phone, SMS
consent and "Excluir minha conta" are therefore never in the picture.
Writes edl-1348.json.
"""
import json, subprocess
from pathlib import Path

AQUI = Path(__file__).resolve().parent
FF = str(AQUI.parents[3] / "remotion" / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
SRC = str(AQUI.parent / "originais" / "2026-11-17 13-48-13.mp4")
OUT = AQUI.parent
FPS = 30
TELA = "crop=1877:1056:12:0,scale=1920:1080:flags=lanczos,setsar=1"
CARTAO = "crop=980:210:590:840,scale=1568:336:flags=lanczos,pad=1920:1080:176:372:color=0xF5F2FA,setsar=1"

CLIPS = {
    "B27-teclado-foco": (TELA, [
        (435, 655, 1, 1.0, "Inicio (Texto maior ligado); Tab a Tab: Mapa, Painel, Meus bairros, Reportar, "
                           "Menino Deus, Centro Historico, faixa do efeito cascata, Abrir mapa, bairros do mapa, "
                           "alertas da lista, Avisos oficiais (com o contorno verde); segura"),
    ]),
    "B30-texto-maior-computador": (CARTAO, [
        (255, 301, 1, 0, "cartao Acessibilidade, Texto maior desligado; o mouse vai ate a chave"),
        (338, 358, 1, 1.2, "clique: chave ligada, o proprio cartao com letra maior (a pagina reflui; 1,2 s cortados); segura"),
        (1062, 1108, 1, 0.8, "mais tarde, ainda ligado: o mouse volta a chave e desliga; o cartao volta ao tamanho normal; segura"),
    ]),
}


def build(name, post, segs):
    parts, fc, t, edl = [], [], 0.0, []
    for i, (a, b, sp, frz, note) in enumerate(segs):
        chain = f"[0:v]trim=start_frame={a}:end_frame={b},setpts=(PTS-STARTPTS)/{sp}"
        if frz:
            chain += f",tpad=stop_mode=clone:stop_duration={frz}"
        fc.append(chain + f"[s{i}]")
        parts.append(f"[s{i}]")
        dur = (b - a) / FPS / sp + frz
        edl.append({"no_clipe": round(t, 2), "duracao": round(dur, 2), "original": [round(a / FPS, 2), round(b / FPS, 2)],
                    "velocidade": sp, "segura": frz, "mostra": note})
        t += dur
    fc.append("".join(parts) + f"concat=n={len(segs)}:v=1:a=0,fps={FPS},{post},format=yuv420p[v]")
    subprocess.run([FF, "-v", "error", "-y", "-i", SRC, "-filter_complex", ";".join(fc), "-map", "[v]", "-an",
                    "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-r", str(FPS), str(OUT / f"{name}.mp4")],
                   check=True)
    return edl, t


tudo = {}
for name, (post, segs) in CLIPS.items():
    edl, total = build(name, post, segs)
    tudo[name] = {"duracao": round(total, 2), "edl": edl}
    print(f"{name}: {total:.2f} s")
    for e in edl:
        print(f"  {e['no_clipe']:6.2f}  orig {e['original'][0]:6.2f}-{e['original'][1]:6.2f}  {e['velocidade']}x  {e['mostra'][:90]}")
(AQUI / "edl-1348.json").write_text(json.dumps(tudo, ensure_ascii=False, indent=1))
