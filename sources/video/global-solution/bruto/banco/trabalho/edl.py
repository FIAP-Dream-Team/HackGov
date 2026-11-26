"""EDL do take A2. Gera trabalho/edl.json: lista de (inicio, fim, velocidade, rotulo) em segundos do original."""
import json, numpy as np
D = json.load(open('trabalho/ink30.json'))
TYPE_SPEED = 3.0
# Fases de digitação: (fase do ink30, início, fim, rótulo)
FASES = [
    ('P6', 32.30, 48.45, 'B06 digitando: tabelas'),
    ('P7', 59.70, 160.15, 'B07 digitando: ocorrência'),
    ('P8', 185.30, 204.85, 'B08 digitando: estação'),
    ('P9a', 223.70, 301.30, 'B09a digitando: alerta'),
    ('P9b', 369.50, 403.70, 'B09b digitando: bairros avisados'),
    ('P10', 420.60, 512.90, 'B10 digitando: taxa de resolvidas'),
]
# Trechos com erro de digitação (cortados): o quadro antes e o depois mostram o mesmo texto
ERROS = [(37.20, 38.30), (88.50, 89.30), (93.25, 100.85), (103.60, 109.00), (111.55, 112.10), (123.80, 126.85),
         (128.65, 133.70), (137.25, 138.25), (143.50, 145.05), (185.85, 187.05), (202.55, 203.30),
         (244.45, 244.85), (271.45, 272.40), (277.00, 277.85), (282.38, 283.50), (284.85, 286.00), (298.60, 299.60),
         (374.10, 375.90), (386.41, 386.46), (392.80, 393.95), (399.10, 399.65),
         (425.40, 426.35), (427.20, 428.35), (438.30, 439.15), (440.45, 444.55), (463.75, 464.85), (469.20, 469.95),
         (478.50, 481.65), (484.75, 485.40), (488.30, 489.30), (502.00, 506.80)]
EXTRA_CORTES = json.load(open('trabalho/extra.json')) if __import__('os').path.exists('trabalho/extra.json') else []
# Blocos em velocidade normal (resultado, teste de conexão)
NORMAIS = {
    'conexao': [(4.00, 4.70, 1.0, 'clica em Test Connection'), (4.70, 5.50, 2.0, 'testando'), (5.50, 7.10, 1.0, 'Connected')],
    'P6': [(49.35, 52.80, 1.0, 'B06 resultado: as 13 tabelas')],
    'P7': [(164.75, 167.40, 1.0, 'B07 resultado: ocorrência ATIVA, 2 confirmações')],
    'P8': [(207.00, 209.90, 1.0, 'B08 resultado: ETA sem energia')],
    'P9a': [(318.05, 321.00, 1.0, 'B09a resultado: alerta CASCATA, 3 notificações')],
    'P9b': [(406.65, 409.40, 1.0, 'B09b resultado: 3 bairros avisados')],
    'P10': [(528.55, 531.50, 1.0, 'B10 resultado: taxa de resolvidas')],
}
PAUSA_MIN, PAUSA_FICA = 0.6, 0.25   # pausa maior que 0,6 s vira 0,25 s

def pausas(k, a, b):
    v = D[k]; raw = np.array(v['ink'], float); t0 = v['t0']; n = len(raw)
    med = np.array([np.median(raw[max(0, i - 15):i + 16]) for i in range(n)])
    x = np.where(raw < 0.85 * med, med, raw)
    ink = np.array([x[max(0, i - 9):i + 10].max() for i in range(n)])
    out, i = [], 0
    while i < n:
        j = i
        while j + 1 < n and abs(ink[j + 1] - ink[i]) < 25: j += 1
        ta, tb = t0 + i / 30, t0 + j / 30
        if tb - ta > PAUSA_MIN and ta >= a and tb <= b:
            out.append((ta + PAUSA_FICA / 2, tb - PAUSA_FICA / 2))
        i = j + 1
    return out

def subtrai(iv, cortes):
    res = [iv]
    for c0, c1 in sorted(cortes):
        nova = []
        for a, b in res:
            if c1 <= a or c0 >= b: nova.append((a, b)); continue
            if a < c0: nova.append((a, c0))
            if c1 < b: nova.append((c1, b))
        res = nova
    return [(a, b) for a, b in res if b - a >= 2 / 30]

edl = [dict(a=a, b=b, v=s, r=r) for a, b, s, r in NORMAIS['conexao']]
for k, a, b, rot in FASES:
    cortes = [c for c in ERROS + EXTRA_CORTES if c[1] > a and c[0] < b] + pausas(k, a, b)
    for x, y in subtrai((a, b), cortes):
        edl.append(dict(a=round(x, 3), b=round(y, 3), v=TYPE_SPEED, r=rot))
    for x, y, s, r in NORMAIS[k]:
        edl.append(dict(a=x, b=y, v=s, r=r))
json.dump(edl, open('trabalho/edl.json', 'w'), ensure_ascii=False, indent=0)
dur = sum((e['b'] - e['a']) / e['v'] for e in edl)
print(len(edl), 'trechos; duração', round(dur, 1), 's')
