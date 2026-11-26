"""Builds the Alertaí technical video edit from John's narration.

Input (never modified): sources/video/global-solution/audio/tecnico/narracao-bruta.mp3 (copy of
recursos/alertai-tecnico-enhanced-v2.mp3) and its word timestamps (transcricao-bruta.json, faster-whisper).

The narration was read in one go, with uneven pauses. This script:
  1. cuts it into phrases at the real voice edges (10 ms energy envelope around Whisper's word edges);
  2. lays the phrases out again with pauses chosen for the picture (a breath before the cascade lines are
     explained, silence over the 13-table query and over the B10 indicator, a hold at the end);
  3. writes the edit: every shot starts on a word of the narration (edicao-tecnico.md, version 2), video
     shots trimmed or sped to fit, overlays on the word that calls them, zoom on the DBeaver grids;
  4. writes the measured beat of every motion (src/data/gs-tecnico/beats.json).

Outputs: audio/tecnico/narracao-montada.wav, src/data/gs-tecnico/{edl,beats}.json.
Usage:   python -E -P scripts/gs-tecnico/build.py
"""
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
GS = HERE.parents[2] / "global-solution"
AUD = GS / "audio" / "tecnico"
DATA = ROOT / "src" / "data" / "gs-tecnico"
FF = ROOT / "node_modules" / "ffmpeg-static" / "ffmpeg.exe"
SR = 48000
FPS = 30
LEAD_IN = 0.30         # silence before the first word, while the opening comes in
CUT_LEAD = 0.12        # a shot cuts in this much before its word
PAD_BEFORE, PAD_AFTER, FADE = 0.08, 0.10, 0.02

# --------------------------------------------------------------------- phrases
# (id, fala, source start, source end, pause after) in seconds of narracao-bruta.mp3.
PHRASES = [
    ("p01", "T01", 0.00, 1.36, 0.50),    # Esse é o Alertaí.
    ("p02", "T01", 1.66, 4.28, 0.50),    # No app, a falta de luz vira aviso de falta de água.
    ("p03", "T01", 4.60, 6.90, 0.80),    # Aqui, o motor é em Java e Oracle.
    ("p04", "T02", 7.44, 14.32, 0.80),   # Antes de codar ... e o DAO fala SQL.
    ("p05", "T03", 15.78, 21.98, 0.80),  # Aqui é como pensamos o banco ... 
    ("p06", "T04", 24.44, 27.70, 0.60),  # Com o Oracle no ar, registra uma falta de luz no Arquipélago.
    ("p07", "T04", 28.40, 30.02, 0.60),  # Pronto, gravou uma confirmação.
    ("p08", "T05", 30.42, 31.88, 0.50),  # Agora o vizinho relata o mesmo.
    ("p09", "T05", 32.36, 34.92, 0.85),  # Repara, virou a segunda confirmação. (pausa: the cascade shows)
    ("p10", "T05", 35.38, 40.42, 0.85),  # Com a luz confirmada ... três bairros recebem o aviso.
    ("p11", "T06", 41.06, 42.56, 0.50),  # Aqui estou consultando o banco.
    ("p12", "T06", 43.06, 44.10, 0.55),  # O relato foi inserido,
    ("p13", "T06", 44.56, 46.62, 0.55),  # a estação atualizada para sem energia.
    ("p14", "T06", 47.32, 48.96, 0.75),  # E o alerta tem três notificações.
    ("p15", "T07", 50.54, 62.04, 0.75),  # Quais dados a gente guarda? ... e nunca mostrado.
    ("p16", "T08", 64.04, 68.50, 0.60),  # Aqui, conforme o curso, orientação a objetos ... inválida.
    ("p17", "T08", 68.70, 69.84, 0.40),  # Enums igual o check,
    ("p18", "T08", 70.20, 70.90, 0.30),  # listas no menu
    ("p19", "T08", 70.90, 73.72, 0.75),  # e PreparedStatement para todo dado digitado.
    ("p20", "T09", 74.18, 78.10, 0.55),  # O primeiro problema era que cada vizinho criava uma ocorrência nova.
    ("p21", "T09", 78.16, 84.44, 0.75),  # O índice único ignoraria ... na mesma transação.
    ("p22", "T10", 84.76, 88.96, 0.55),  # O segundo problema foi que o aviso de água repetiria a cada confirmação.
    ("p23", "T10", 89.58, 92.00, 0.40),  # Checar o alerta da ocorrência não bastava,
    ("p24", "T10", 92.32, 93.50, 0.50),  # a trava virou o update.
    ("p25", "T10", 94.24, 96.72, 0.60),  # Só desligava a estação que ainda estava operando.
    ("p26", "T10", 97.38, 99.04, 0.75),  # Olha só, nenhum aviso novo.
    ("p27", "T11", 100.40, 103.38, 0.45),  # E aqui o caso fechou, três vizinhos marcaram que voltou
    ("p28", "T11", 103.38, 105.44, 0.75),  # e a ocorrência saiu da lista do bairro. 
    ("p29", "T11", 106.36, 108.98, 1.60),  # E esse é o Alertaí, com o código no GitHub. (hold on M11)
]


def load_pcm(path: Path) -> np.ndarray:
    pcm = subprocess.run([str(FF), "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.float32).astype(np.float64)


def envelope_db(x: np.ndarray) -> np.ndarray:
    hop = SR // 100
    n = len(x) // hop
    return 20 * np.log10(np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1)) + 1e-9)


def voice_edges(env, w0, w1, lo, hi):
    floor = float(np.percentile(env, 8))
    seg = env[int(w0 * 100):int(w1 * 100)]
    peak = float(np.percentile(seg, 90)) if len(seg) else floor + 30
    thr = max(floor + 8, peak - 38)
    a = int(w0 * 100)
    while a > max(int(lo * 100), int(w0 * 100) - 40) and env[a - 1] > thr:
        a -= 1
    b = int(w1 * 100)
    lim = min(int(hi * 100), int(w1 * 100) + 60, len(env) - 1)
    quiet = 0
    while b < lim:
        quiet = quiet + 1 if env[b] <= thr else 0
        if quiet >= 10:
            b -= quiet - 1
            break
        b += 1
    return a / 100, max(b / 100, w1)


def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))


# --------------------------------------------------------------------- build
# John chose the raw take (the "enhanced" one sounded processed). Same recording, aligned to the millisecond,
# so the phrase times below hold for both.
raw = load_pcm(AUD / "narracao-bruta-original.mp3")
# Where the voice starts and stops is measured on the enhanced take (same recording, no noise floor): on the
# raw one the room noise reads as voice and every phrase grew half a second of hiss at each end.
env = envelope_db(load_pcm(AUD / "narracao-bruta.mp3"))
words = json.loads((AUD / "transcricao-bruta.json").read_text(encoding="utf-8"))["words"]

placed, pieces, t = {}, [np.zeros(int(LEAD_IN * SR))], LEAD_IN
for k, (pid, fala, w0, w1, gap) in enumerate(PHRASES):
    lo = PHRASES[k - 1][3] + 0.02 if k else 0.0
    hi = PHRASES[k + 1][2] - 0.02 if k + 1 < len(PHRASES) else len(raw) / SR
    v0, v1 = voice_edges(env, w0, w1, lo, hi)
    a, b = max(lo, v0 - PAD_BEFORE), min(hi, v1 + PAD_AFTER)
    seg = raw[int(a * SR):int(b * SR)].copy()
    f = int(FADE * SR)
    seg[:f] *= np.linspace(0, 1, f)
    seg[-f:] *= np.linspace(1, 0, f)
    placed[pid] = {"id": pid, "fala": fala, "cut": [a, b], "at": t, "len": b - a,
                   "speech": [t + (v0 - a), t + (v1 - a)],
                   "words": [w for w in words if a - 0.05 <= w["s"] < b]}
    pieces += [seg, np.zeros(int(gap * SR))]
    t += (b - a) + gap
audio = np.concatenate(pieces)
AUD.mkdir(parents=True, exist_ok=True)
sf.write(AUD / "narracao-montada.wav", audio.astype(np.float32), SR, subtype="PCM_24")
TOTAL = len(audio) / SR


def at(pid: str, word: str | None = None, nth: int = 1, edge: str = "s") -> float:
    """Narration time of a word of a phrase (its start), or of the phrase's speech start/end."""
    p = placed[pid]
    if word is None:
        return p["speech"][0] if edge == "s" else p["speech"][1]
    hits = [w for w in p["words"] if norm(w["w"]).startswith(norm(word))]
    if len(hits) < nth:
        raise SystemExit(f"palavra '{word}' nao encontrada em {pid}: {[w['w'] for w in p['words']]}")
    w = hits[nth - 1]
    return p["at"] + (w[edge] - p["cut"][0])


# --------------------------------------------------------------------- shots
# Each shot: start time (narration seconds) and what plays. A shot ends where the next one starts.
#   video: src under public/gs-tecnico/takes, source range [a, b] fitted to the slot
#          ("fit": sped up to fill, at most max_speed; otherwise 1x and the last frame holds)
#   motion: a GS-M* component; phone: B20 inside a phone frame; overlays and zoom ride on the shot.
def V(src, a, b, fit=False, max_speed=4.0, **kw):
    return {"type": "video", "src": src, "from": a, "to": b, "fit": fit, "maxSpeed": max_speed, **kw}


A1, A2, A3 = "A1-take-unico.mp4", "A2-take-unico.mp4", "A3-take-unico.mp4"
L = CUT_LEAD
# A DBeaver result grid zoomed in (the grid text is small in 1080p): scale, centre (x, y) of the frame.
GRID_B07 = {"scale": 1.45, "cx": 760, "cy": 600}
GRID_B08 = {"scale": 1.7, "cx": 620, "cy": 600}
GRID_B09 = {"scale": 1.5, "cx": 700, "cy": 600}
GRID_B10 = {"scale": 1.6, "cx": 560, "cy": 640}
GRID_B06 = {"scale": 1.55, "cx": 330, "cy": 715}
# One framing for the three DBeaver results: it eases in on the first and holds on the next two.
GRID = {"scale": 1.4, "cx": 700, "cy": 620}
GRID_HELD = {**GRID, "static": True}
# Docker Desktop shows the Windows taskbar (y 1035-1080): 5% from the top pushes it out, from the first frame.
NO_TASKBAR = {"scale": 1.05, "cx": 960, "cy": 0, "static": True}
# First second of the source where each overlay's text is on screen (overlays.tsx, "sobre").
SRC_MIN = {"GS-M04a-relato1": 15.3, "GS-M04b-confirmacao": 20.8, "GS-M04c-cascata": 20.8, "GS-M04d-sem-aviso": 5.2,
           "GS-M04e-resolvida": 20.3, "GS-M06a-insercao": 24.7, "GS-M06b-atualizacao": 31.8, "GS-M06c-consulta": 46.8,
           "GS-M06d-taxa": 62.2, "GS-M12a-enum": 2.2, "GS-M12b-check": 3.0}

SHOTS = [
    # T01-T03: the opening (logo, line, the app running in a phone), then the two diagrams, held.
    (0.0, {"type": "motion", "id": "M00"}),
    (at("p04") - L, {"type": "motion", "id": "M02"}),
    # "...e o DAO fala SQL": the real EstacaoDAO, with its UPDATE, in IntelliJ.
    (at("p04", "fala") - L, V("B15-arvore-projeto.mp4", 3.7, 6.7)),
    (at("p05") - L, {"type": "motion", "id": "M03"}),
    # T04-T05: one continuous console shot (the same take, only the typing sped up), then the map.
    (at("p06") - L, V(A1, 11.8, 14.9, fit=True)),
    (at("p07") - L, V(A1, 14.9, 18.5, overlays=[("GS-M04a-relato1", at("p07", "gravou"))])),
    (at("p08") - L, V(A1, 18.5, 20.4, fit=True)),
    (at("p09") - L, V(A1, 20.4, 28.7, overlays=[("GS-M04b-confirmacao", at("p09")), ("GS-M04c-cascata", at("p10"))])),
    (at("p10", "tres") - L, {"type": "motion", "id": "M05"}),
    # T06: DBeaver, one framing on the result grid for the three results.
    (at("p11") - L, V(A2, 21.0, 24.6, fit=True)),
    (at("p12") - L, V(A2, 24.6, 27.3, zoom=GRID, overlays=[("GS-M06a-insercao", at("p12", "inserido"))])),
    (at("p13") - L, V(A2, 31.8, 34.7, zoom=GRID_HELD, overlays=[("GS-M06b-atualizacao", at("p13", "atualizada"))])),
    (at("p14") - L, V(A2, 46.8, 49.8, zoom=GRID_HELD, overlays=[("GS-M06c-consulta", at("p14", "notificacoes"))])),
    # T07-T10: data, code, the two problems; one picture per idea.
    (at("p15") - L, {"type": "motion", "id": "M07"}),
    (at("p16") - L, V("B11-ocorrencia-construtor.mp4", 3.6, 8.5)),
    (at("p17") - L, {"type": "split",
                     "left": {"src": "B12a-enum-statusestacao.mp4", "from": 2.2, "to": 5.3, "focus": [454, 633],
                              "overlay": "GS-M12a-enum", "overlayAt": at("p17")},
                     "right": {"src": "B12b-check-sql.mp4", "from": 3.0, "to": 5.4, "focus": [1460, 565],
                               "overlay": "GS-M12b-check", "overlayAt": at("p17", "check")}}),
    (at("p19") - L, {"type": "motion", "id": "M08"}),
    (at("p20") - L, {"type": "motion", "id": "M09"}),
    # The solution is the real code: OcorrenciaService.registrar with the "agrupada" lines selected.
    (at("p21", "entao") - L, V("B13-registrar-agrupa.mp4", 6.0, 10.0)),
    (at("p22") - L, {"type": "motion", "id": "M10"}),
    # "A trava virou o update...": the real marcarSemEnergia, its WHERE ... STATUS = ? selected.
    (at("p24") - L, V("B14-update-trava.mp4", 5.0, 9.7)),
    # "Olha so, nenhum aviso novo": the console shows the third confirmation with no warning.
    (at("p26") - 1.2, V(A3, 1.4, 4.6, fit=True)),
    (at("p26") - L, V(A3, 4.6, 9.7, overlays=[("GS-M04d-sem-aviso", at("p26"))])),
    # T11: the case closes (three "ja voltou", RESOLVIDA, the empty list), then the closing.
    (at("p27") - L, V(A3, 15.3, 19.9, fit=True)),
    (at("p27", "voltou") - L, V(A3, 19.9, 26.0, overlays=[("GS-M04e-resolvida", at("p27", "voltou"))])),
    (at("p28", "saiu") - L, V(A3, 27.9, 35.3, overlays=[("GS-M06e-atualizacao-consulta", at("p28", "saiu"))])),
    (at("p29") - L, {"type": "motion", "id": "M11"}),
]

# Beats of each motion, relative to its shot start (the GS-M* components read beats.json).
start_of = {s["id"]: t0 for t0, s in SHOTS if s["type"] == "motion"}
rel = lambda mid, x: round(x - start_of[mid], 2)
BEATS = {
    "M00": {"app": rel("M00", at("p02")), "motor": rel("M00", at("p03"))},
    "M02": {"title": 0.0, "entrada": 0.3, "menu": rel("M02", at("p04", "menu")), "servico": rel("M02", at("p04", "servico")),
            "dao": rel("M02", at("p04", "dao")), "banco": rel("M02", at("p04", "sql")), "previsto": rel("M02", at("p04", "sql")) + 0.3},
    "M03": {"title": 0.0, "tabelas": 0.3, "ocorrencia": rel("M03", at("p05", "ocorrencia")),
            "alerta": rel("M03", at("p05", "alerta")), "ligacao": rel("M03", at("p05", "sistema"))},
    "M05": {"mapa": 0.0, "luz": 0.1, "setas": 0.45, "bairros": rel("M05", at("p10", "recebem"))},
    "M07": {"title": 0.0, "nome": rel("M07", at("p15", "nome")), "bairros": rel("M07", at("p15", "bairros")),
            "relato": rel("M07", at("p15", "relato")), "nunca": rel("M07", at("p15", "nunca")),
            "lgpd": rel("M07", at("p15", "nunca")) + 0.9},
    "M08": {"codigo": 0.0, "marca": rel("M08", at("p19", "preparate")), "legenda": rel("M08", at("p19", "digitado"))},
    "M09": {"title": 0.0, "linha1": rel("M09", at("p20", "cada")), "linha2": rel("M09", at("p20", "criava")),
            "indice": rel("M09", at("p21", "indice")), "risco": rel("M09", at("p21", "ignoraria")),
            "solucao": rel("M09", at("p21", "regra"))},
    "M10": {"title": 0.0, "aviso1": rel("M10", at("p22", "aviso")), "aviso2": rel("M10", at("p22", "repetiria")),
            "aviso3": rel("M10", at("p22", "cada")), "checar": rel("M10", at("p23", "checar")),
            "risco": rel("M10", at("p23", "bastava")), "outra": rel("M10", at("p23", "bastava")) + 0.5,
            "trava": rel("M10", at("p24", "trava"))},
    "M11": {"logo": 0.1, "frase": rel("M11", at("p29", "alerta")), "repo": rel("M11", at("p29", "codigo")),
            "fecho": rel("M11", at("p29", "codigo")) + 0.7},
}

shots = []
for i, (t0, s) in enumerate(SHOTS):
    t1 = SHOTS[i + 1][0] if i + 1 < len(SHOTS) else TOTAL
    slot = t1 - t0
    if slot <= 0.3:
        raise SystemExit(f"plano {i} ({s.get('src', s.get('id'))}) com {slot:.2f}s: ancoras fora de ordem")
    item = {k: v for k, v in s.items() if k != "overlays"}
    item.update(start=round(t0, 3), end=round(t1, 3))
    if s["type"] == "video":
        length = s["to"] - s["from"]
        item["speed"] = round(min(s["maxSpeed"], max(1.0, length / slot)), 3) if s["fit"] else 1.0
        # An overlay comes in on its word, but never before its text is on screen in the source.
        item["overlays"] = [{"id": oid, "start": round(max(ot, t0 + max(0.0, SRC_MIN.get(oid, 0) - s["from"]) / item["speed"]), 3)}
                            for oid, ot in s.get("overlays", [])]
    if s["type"] == "split":
        for side in ("left", "right"):
            c = item[side]
            c["overlayAt"] = round(max(c["overlayAt"], t0 + max(0.0, SRC_MIN.get(c["overlay"], 0) - c["from"])), 3)
    if s["type"] == "motion":
        BEATS[s["id"]]["dur"] = round(slot, 2)
    shots.append(item)

DATA.mkdir(parents=True, exist_ok=True)
(DATA / "edl.json").write_text(json.dumps({
    "fps": FPS, "durationSec": round(TOTAL, 3), "durationInFrames": int(round(TOTAL * FPS)),
    "audio": "gs-tecnico/mix.wav",
    "phrases": [{k: (round(v, 3) if isinstance(v, float) else v) for k, v in p.items() if k != "words"} for p in placed.values()],
    "shots": shots,
}, ensure_ascii=False, indent=1), encoding="utf-8")
(DATA / "beats.json").write_text(json.dumps(BEATS, ensure_ascii=False, indent=1), encoding="utf-8")

print(f"narracao montada: {TOTAL:.2f}s ({int(TOTAL // 60)}:{TOTAL % 60:04.1f}) -> {AUD / 'narracao-montada.wav'}")
for s in shots:
    what = s.get("src") or s.get("id") or "split B12a|B12b"
    extra = f" {s['from']}-{s['to']} x{s['speed']}" if s["type"] == "video" else ""
    print(f"  {s['start']:6.2f}-{s['end']:6.2f} ({s['end'] - s['start']:4.1f}s) {s['type']:6} {what}{extra}"
          + (f"  +{len(s['overlays'])} overlay" if s.get("overlays") else ""))
