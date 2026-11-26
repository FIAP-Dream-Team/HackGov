"""Renderiza os clipes do celular a partir de uma EDL em JSON.

Uso (dentro de bruto/celular):
    python -E -P trabalho/render.py trabalho/edl-tomada2.json
    python -E -P trabalho/render.py trabalho/edl-tomada2.json --fonte "originais/<original do celular>.mp4"

Os tempos da EDL são segundos do arquivo de origem, então valem para qualquer versão do MESMO vídeo
(WhatsApp ou original do celular). O recorte, se houver, está em pixels da fonte decupada e é
reescalado pela largura da fonte nova. Saída: tela nativa vertical, 30 fps constantes, H.264 CRF 16,
yuv420p, sem áudio, dimensões pares.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

FF = str(Path("../../../remotion/node_modules/ffmpeg-static/ffmpeg.exe").resolve())


def tamanho(fonte):
    out = subprocess.run([FF, "-hide_banner", "-i", fonte], capture_output=True, text=True).stderr
    m = re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", out)
    return int(m.group(1)), int(m.group(2))


def par(n):
    return int(n) // 2 * 2


def main():
    edl_path = sys.argv[1]
    edl = json.loads(Path(edl_path).read_text(encoding="utf-8"))
    fonte = edl["fonte_decupada"]
    if "--fonte" in sys.argv:
        fonte = sys.argv[sys.argv.index("--fonte") + 1]
    w, h = tamanho(fonte)
    k = w / edl["largura_decupada"]
    pos = ""
    if edl.get("crop"):
        cw, ch, cx, cy = edl["crop"]
        pos = f",crop={par(cw * k)}:{par(ch * k)}:{par(cx * k)}:{par(cy * k)}"
    else:
        pos = f",crop={par(w)}:{par(h)}:0:0"
    print(f"fonte {fonte} {w}x{h} (escala {k:.3f})")

    for c in edl["clipes"]:
        partes, rotulos = [], []
        for i, (s, e) in enumerate(c["segmentos"]):
            partes.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS,fps=30{pos},setsar=1[v{i}]")
            rotulos.append(f"[v{i}]")
        n = len(rotulos)
        fim = f"{''.join(rotulos)}concat=n={n}:v=1:a=0[c];[c]tpad=stop_mode=clone:stop_duration={c['segura']},format=yuv420p[o]"
        grafo = ";".join(partes) + ";" + fim
        cmd = [FF, "-v", "error", "-y", "-i", fonte, "-filter_complex", grafo, "-map", "[o]", "-an",
               "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-movflags", "+faststart", c["saida"]]
        subprocess.run(cmd, check=True)
        print(c["saida"])


if __name__ == "__main__":
    main()
