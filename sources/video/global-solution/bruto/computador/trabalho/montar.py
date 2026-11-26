"""Builds the computer-app clips from the raw take (original stays untouched).

Each segment: (start_frame, end_frame_exclusive, speed, freeze_after_seconds, note).
All frames are 30 fps frame numbers of the original, found with mouse.json, analise.json and quadros.py.
The whole picture is cropped to 1877x1056 at (12, 0) and scaled back to 1920x1080: this removes Chrome's
link-URL bubble (bottom-left, appears whenever the mouse is over a link) and the page scrollbar (right edge).
Prints the EDL with the clip time of every segment and writes edl.json.
"""
import json, subprocess
from pathlib import Path

AQUI = Path(__file__).resolve().parent
FF = str(AQUI.parents[3] / "remotion" / "node_modules" / "ffmpeg-static" / "ffmpeg.exe")
SRC = str(AQUI.parent / "originais" / "2026-11-17 12-38-28.mp4")
OUT = AQUI.parent
FPS = 30
CROP = "crop=1877:1056:12:0,scale=1920:1080:flags=lanczos,setsar=1"

CLIPS = {
    "B25-fluxo-computador": [
        (189, 255, 1, 0, "Inicio: o mouse vai ate 'Abrir mapa'"),
        (299, 314, 1, 0, "Inicio: parado em 'Abrir mapa' e clique (espera de 1,5 s cortada)"),
        (658, 923, 1, 0, "Mapa: abre com Menino Deus; escolhe Praia de Belas na lista; clica em Centro Historico no mapa; mouse vai a 'Painel'"),
        (951, 1008, 1, 0, "Painel abre (Menino Deus) (1 s de mouse parado em 'Painel' cortado)"),
        (1059, 1174, 1, 1.0, "Painel: abas Praia de Belas e Centro Historico (2 s parado cortados); segura no fim"),
    ],
    "B28-reportar-ocorrencia-computador": [
        (1781, 2130, 1, 0, "Reportar abre; Falta de luz; bairro Centro Historico (Trabalho); Grande perigo; clique na descricao"),
        (2130, 2367, 2, 0, "digitando 'Rua sem luz as 14h' (2x)"),
        (2367, 2418, 1, 1.4, "Enviar -> Ocorrencia 'Relato enviado', Ainda esta 1, Ja voltou 0 de 3; segura"),
        (2601, 2677, 1, 0, "mouse ja em 'Ja voltou' -> clique -> 'Obrigado!', Ja voltou 1 de 3"),
        (2704, 2860, 1, 0, "mouse ate a seta de voltar -> Inicio com a falta de luz nova em Centro Historico"),
    ],
    "B29-meus-bairros": [
        (1338, 1380, 1, 0, "Meus bairros abre"),
        (1410, 1514, 1, 0.8, "marca Arquipelago: ele entra em 'Seus bairros' na lateral (1 s parado cortado); segura"),
    ],
}


def build(name, segs):
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
    fc.append("".join(parts) + f"concat=n={len(segs)}:v=1:a=0,fps={FPS},{CROP},format=yuv420p[v]")
    out = OUT / f"{name}.mp4"
    subprocess.run([FF, "-v", "error", "-y", "-i", SRC, "-filter_complex", ";".join(fc), "-map", "[v]",
                    "-an", "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-r", str(FPS), str(out)], check=True)
    return edl, t


tudo = {}
for name, segs in CLIPS.items():
    edl, total = build(name, segs)
    tudo[name] = {"duracao": round(total, 2), "edl": edl}
    print(f"{name}: {total:.2f} s")
    for e in edl:
        print(f"  {e['no_clipe']:6.2f}  orig {e['original'][0]:6.2f}-{e['original'][1]:6.2f}  {e['velocidade']}x  {e['mostra']}")
(AQUI / "edl.json").write_text(json.dumps(tudo, ensure_ascii=False, indent=1))
