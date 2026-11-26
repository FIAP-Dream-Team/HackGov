import re, sys
sys.stdout.reconfigure(encoding='utf-8')
FALADO = {'2024': 'dois mil e vinte e quatro', 'SQL': 'esse quê éle', 'DAO': 'dáo', 'UPDATE': 'âpdeit',
          'CHECK': 'tchéqui', 'PreparedStatement': 'pripérd stêitment', 'GitHub': 'guit rabi', 'ODS': 'ó dê ésse',
          'Java': 'djava', 'Oracle': 'órakou', 'enums': 'inâmes', 'injection': 'indjécheon', 'Alertaí': 'alertaí',
          '1': 'um'}
RITMO = {'john': 5.4, 'joão pedro': 4.43, 'brenda': 4.43, 'vinícius': 5.39, 'ana larissa': 6.2}  # sílabas/s medidas; Brenda sem medida: usa o mais lento
def silabas(texto):
    for k, v in FALADO.items(): texto = re.sub(r'\b' + re.escape(k) + r'\b', v, texto)
    return sum(max(1, len(re.findall(r'[aeiouáéíóúâêôãõày]+', w.lower()))) for w in re.findall(r"[\wÀ-ú'-]+", texto))
path, extra, rotulo = sys.argv[1], float(sys.argv[2]), sys.argv[3]
txt = open(path, encoding='utf-8').read()
rows = []
for m in re.finditer(r'\[([Tf]\d\d)\]([^\n]*)\n(.*?)(?=\n(?:### |\*\*)\[[Tf]\d\d\]|\n---)', txt, re.S):
    quem = re.search(r'fala: ([^*]+)\*\*', m.group(2)); quem = quem.group(1).strip().lower() if quem else 'john'
    quote = ' '.join(l[1:].strip() for l in m.group(3).split('\n') if l.startswith('>'))
    p = quote.count('(pausa)'); quote = re.sub(r'\(pausa\)|\*', '', quote)
    n = len(re.findall(r"[\wÀ-ú'-]+", quote)); s = silabas(quote)
    t = s / RITMO[quem] + 0.5 * p
    rows.append((m.group(1), quem, n, s, t))
def fmt(s):
    s = int(round(s)); return f"{s//60}:{s%60:02d}" if s >= 60 else f"{s} s"
fala = sum(r[4] for r in rows)
norm, lento = fala + extra, fala / 0.9 + extra
out = ["\n## Tempo\n",
       "Estimado por sílaba falada (número e sigla contados como se pronunciam), no ritmo medido de cada pessoa nas",
       "gravações da Fase 3 e do EC-1. A Brenda não tem gravação anterior; usei o ritmo mais lento do grupo (o do",
       "João). A coluna \"10% mais devagar\" é a margem para nervosismo ou leitura mais cuidadosa.", "",
       "| Fala | Quem | Palavras | Sílabas | Tempo | 10% mais devagar |", "| --- | --- | --- | --- | --- | --- |"]
for r in rows: out.append(f"| {r[0]} | {r[1].title()} | {r[2]} | {r[3]} | {fmt(r[4])} | {fmt(r[4]/0.9)} |")
out.append(f"| **Total** ({rotulo}) | | **{sum(r[2] for r in rows)}** | **{sum(r[3] for r in rows)}** | **{fmt(norm)}** | **{fmt(lento)}** |")
txt = re.sub(r'\n## Tempo\n.*?(?=\n## |\Z)', '', txt, flags=re.S)
open(path, 'w', encoding='utf-8').write(txt.rstrip('\n') + '\n' + '\n'.join(out) + '\n')
print('\n'.join(out[5:]))
