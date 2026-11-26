# Pitch no Remotion · como foi feito e como refazer

Composição `GSPitch` (`sources/video/remotion/src/GSPitch.tsx`), montada em 17/11/2026. Pipeline copiado do
EC-1 para `remotion/scripts/gs-pitch/` e `remotion/src/data/gs-pitch/`; nada do EC-1 nem da Fase 3 muda.

## O que entra

| Peça | Arquivo |
| --- | --- |
| Falas gravadas (nunca alteradas) | `falas/john.mp3` (f01, f05, f11: cópia de `recursos/SEQ_16x9_1920x1080_2997.mp3`), `joao.mp4`, `joao2.mp4`, `brenda.ogg`, `brenda2.ogg`, `vinicius.mp4` (f06+f07), `lari.mp4`, `lari2.mp4` |
| Gravação bruta do John (reserva) | `falas/whatsapp-1733.mp4` (com contagem e repetições; não usada) |
| Deck | `deck/alertai.html` (11 cenas) |
| Takes do app | `bruto/celular/B20`–`B23`, `bruto/computador/B25`, copiados para `remotion/public/gs-pitch/takes/` |

## Passo a passo (de `sources/video/remotion`)

```bash
python -E -P scripts/gs-pitch/build-narration.py   # 1. as 11 falas numa narração só (audio/pitch/audio.wav)
python -E -P scripts/gs-pitch/transcribe-falas.py  # 2. palavras com tempo: medium, fala a fala, roteiro como contexto (~4 min)
node scripts/gs-pitch/align.mjs                    # 3. cortes de cena, reveals, trocas de voz e o relatório "Sincronia"
python -E scripts/gs-pitch/treat-voice.py          # 4. tratamento voz a voz (ruído, timbre, nível, picos)
node scripts/gs-pitch/music-bed.mjs                # 5. trilha com ducking
python -E scripts/gs-pitch/mix.py                  # 6. mix a -14 LUFS, pico -1 dBTP
node scripts/gs-pitch/extract-deck.mjs             # 7. deck.json e imagens/fontes em public/gs-pitch
npx remotion render GSPitch out/gs-pitch.mp4 && node scripts/gs-pitch/finalize-audio.mjs   # 8. vídeo
python -E scripts/gs-pitch/ab-samples.py           # trechos antes/depois por voz em out/gs-pitch-ab/
```

`treat-voice.py`, `mix.py` e `ab-samples.py` rodam com `-E` sem `-P`: importam `audio_dsp.py` da própria pasta.

## Decisões

- **Narração montada, não gravada junto.** `build-narration.py` corta cada fala nos limites de palavra do
  Whisper e os afasta até onde a voz realmente começa e termina (envelope de 10 ms), com 0,10 s antes e
  0,18 s depois; põe 0,85 s de silêncio entre vozes diferentes e 0,65 s quando a mesma pessoa continua.
  Nenhum corte entra na voz medida. Resultado: 2:40 de narração, 2:44 de vídeo.
- **Os limites de voz vêm da montagem**, não do Whisper (`audio/pitch/falas.json`, lido pelo `align.mjs`): o
  Whisper ouviu "endereço. Por isso" como "por isso" e colou f04 em f05.
- **Tratamento:** as 11 falas saem a −16,3 LUFS antes da mix (eram de −17,8 a −23,0), cada voz com o seu EQ,
  redução de ruído e controle de pico; a mix final fica a −14 LUFS com a voz 18 a 22 dB acima da trilha.
- **Selo de quem fala:** `components/GsSpeakerTag.tsx`, no sistema do Alertaí (Sora, Figtree, raio 16, bloco
  Tinta), no canto superior direito, a cada troca de voz; não aparece na assinatura (s11), que já tem os nomes.
- **Takes dentro do deck (revisão de 17/11, noite):** as gravações do celular são do Safari no iPhone. No
  topo da página ele mostra a barra de endereço inteira e uma barra de ferramentas embaixo; ao rolar, encolhe
  as duas. Cada quadro foi classificado (texto da barra de endereço nas linhas 68–80 = Safari inteiro) e só
  entram os trechos rolados, montados em sequência (`TAKES` em `GSPitch.tsx`):
  s05 B20 3,5–7,1 s → X1 4,1–6,0 s; s06 Reportar completo 3,55–4,5 s → 7,0–10,6 s, depois B22 1,2–4,15 s;
  s07 B23 4,85–10,55 s. Isso tirou o recarregamento do começo do B20, a tela do Mapa no começo do B23, o
  seletor de bairro e o teclado do iOS e a faixa "Avisamos quem segue o bairro". Os 92 px de cima continuam
  escondidos (barra de status e a pílula de endereço). A imagem estática do deck fica escondida onde o take
  entra junto com o celular, para não aparecer "fantasma" no fade.
- **Abertura (s01) refeita:** a cadeia com os ícones do app (chuva, raio, gota). O caminho e as três paradas
  aparecem em contorno logo depois de "Janeiro de 2024", e cada parada acende na palavra dela; a espera entre
  a luz e a água é uma linha tracejada longa ("horas depois, sem nenhum aviso").
- **Sem contadores:** nenhum número conta de zero (aparecia "0 horas", ",3 mil" no meio da contagem); o
  número entra inteiro, junto com a palavra.
- **Entradas mais suaves:** só no pitch, cada entrada dura um pouco mais que o padrão do `DeckScene`
  (fade 20, pop 18, wipe 28, draw 32, highlight 22 quadros), via `soften()` em `GSPitch.tsx`.
- **Trilha:** a mesma dos vídeos do HackGov (`public/musica.mp3`).

## Revisão de 18/11 · roteiro ajustado pelo grupo

Referência: `review/Roteiro_Pitch_Alertai (1).pdf` (ajustes para deixar claro que o Alertaí é um app de
alertas de risco climático por bairro, não só de falta de água). Seguido à risca: só as falas que o PDF
muda foram trocadas; as outras entram como estavam, com o mesmo tratamento e os mesmos tempos de palavra.

| Fala | Antes | Agora (gravação em `review/`, copiada para `falas/`) |
| --- | --- | --- |
| f04 | Brenda, `brenda.ogg` | Ana Larissa, `lari-f04.mp4` ("Na cheia histórica do Guaíba, em 2024…") |
| f05 | John, `john.mp3` 15,10–23,06 | João Pedro, `joao-f05.mp4` ("…um app de alertas por bairro…") |
| f05m (nova) | — | João Pedro, `joao-mapa.mp4`: narra enquanto usa o Mapa ao vivo no computador |
| f06 | Vinícius, `vinicius.mp4` 1,58–16,64 | Ana Larissa, `lari-f06.mp4` ("Junto com os avisos oficiais…") |

- **Cena nova `05m` (O mapa)** entre a 05 e a 06: o vídeo do próprio `joao-mapa.mp4` toca na moldura de
  navegador, sincronizado com a voz dele (o take `sync: "f05m"` em `GSPitch.tsx` lê `placedAt`/`sourceIn`
  que o `align.mjs` copia de `falas.json`). Recorte 1135×680 da janela (título, filtros, mapa e painel com o
  "Aviso oficial · Defesa Civil", sem a barra lateral), em `public/gs-pitch/takes/X2-mapa-computador.mp4`;
  a lista "Ir para" aparece aberta até 3,50 s na gravação e fica coberta com a cor do fundo (#F5F1FA) até
  fechar. À direita, quatro linhas nas palavras: seis tipos de risco, avisos oficiais, nível do Guaíba,
  previsão (El Niño forte até março de 2027, chuva acima da normal no Sul; fonte no rodapé: CPC e INMET,
  documentação seção 1). O rodapé diz que alertas e nível do Guaíba do protótipo são simulados.
- **Slides ajustados ao que é falado:** s04 "na cheia histórica do Guaíba, em 2024"; s06 "Junto com os avisos
  oficiais, a comunidade é a principal fonte…". A s05 já dizia "Um app de alertas por bairro".
- **Selo de quem fala** segue a voz real: John → João → Larissa → João → Larissa → Vinícius → Larissa →
  Brenda → Larissa → John. A Brenda fica só com a f09 e o Vinícius com a f07; o John abre e fecha.
- **Tempos de palavra reaproveitados (`reuse-words.py`):** na narração nova o Whisper `small` pulou a f08
  inteira (52 palavras → 0). Fala com a mesma origem e o mesmo corte é o mesmo áudio, só deslocado: os
  tempos vêm da transcrição anterior (cópia em `backup/pitch-v1-2026-11-18/`), somados ao deslocamento.
  Alinhamento: 87%.
- **Tratamento:** as decisões são por pessoa, com todas as falas dela juntas; a f08 e a f10 da Larissa
  ficaram com o fundo a 0,1 dB do que era. Nas falas novas dela a distância pausa→voz é 34 e 31 dB (a f08
  aprovada tem 37; o John, 28 e 32). A fala do mapa veio muito baixa (−37 LUFS, gravador com supressão de
  ruído) e subiu 21 dB, sem ruído de fundo.
- **Duração:** 2:53,7 de narração, **2:57 de vídeo** (limite 3:00). Se precisar cortar, o PDF manda tirar
  primeiro os ajustes 1 e 3.
- **"2024" na f04 conferido de ouvido pelo John (18/11):** a Larissa fala "2024". O Whisper (small e
  medium) transcreve "2004" nesse trecho; é erro de transcrição, a gravação fica como está. Vale para
  qualquer palavra que o Whisper troque nessas falas: quem decide é o ouvido, com o PDF como referência.
- Versão anterior inteira (dados, deck, áudio, scripts e o mp4 de 2:44) em `backup/pitch-v1-2026-11-18/`.
- `scripts/gs-pitch/stills.mjs` renderizava a composição `EC1` (cópia do EC-1); agora renderiza `GSPitch`.
  `scripts/deck.mjs` aceita id de cena com letra (`05m`).

## Sincronia refeita em 18/11 (noite)

O John viu os elementos entrando atrasados: a pessoa falava e o elemento ainda começava a aparecer. Eram
três causas, e as três foram corrigidas em `align.mjs` e `GSPitch.tsx`. O som não mudou (mesmo `mix.wav`).

1. **Atraso fixo de 0,25 s para entradas de até 1,1 s.** Um wipe de 28 quadros estava 8% visível na sua
   palavra. Agora cada elemento começa cedo o bastante para estar **legível (60%) quando a palavra
   começa**, mais 0,06 s: o atraso depende da animação (fade e pop chegam a 60% com 26% do tempo; wipe,
   traço e marca-texto com 54%). Entradas: fade 16, pop 16, wipe 22, traço 24, marca-texto 18 quadros
   (`ENTRANCE_FRAMES`); o `timing.json` leva a duração de cada uma e o `GSPitch.tsx` usa a mesma.
2. **Palavras sem tempo medido.** 13 âncoras caíam em palavras que o Whisper `small` não reconheceu (a f08
   inteira, números em algarismos) e tinham o tempo interpolado. Agora: `transcribe-falas.py` (medium,
   fala por fala, com o texto da fala como contexto) e números escritos por extenso dos dois lados no
   `align.mjs`. Alinhamento de 87% para 99,2%; nenhuma âncora estimada.
3. **Palavras começando no silêncio.** O Whisper põe o início de algumas palavras na pausa antes delas, e
   vários arquivos do grupo começam com ruído ou respiração que a montagem contava como voz: o slide e o selo
   entravam de 0,3 a 0,8 s antes de a pessoa falar (f02 +0,78, f03 +0,55, f07 +0,55, f06 +0,41, f05 +0,38, f10 +0,31, f04 +0,30 s). Agora o início de cada palavra que cai abaixo do
   limiar de voz da fala (pico − 24 dB) avança até onde a voz sobe, e a fala começa na primeira palavra.
   Bate com o `silencedetect` do ffmpeg em todas as trocas. O contrário também: depois de uma pausa real
   (80 ms ou mais abaixo do limiar, mais que o fechamento de um p, t ou k), o Whisper marcava a palavra de
   0,1 a 0,23 s tarde ("a água" em 22,35 s com a voz em 22,13 s); o início volta para onde a voz se firma.
   Na rodada: 57 inícios avançaram e 63 voltaram.

Também: cada cena entra 0,28 s antes da primeira palavra da sua fala (a transição de 9 quadros termina
com a voz); o elemento da primeira palavra já entra junto com a cena; o selo de quem fala começa 6 quadros
antes da voz; a linha "Um app de alertas por bairro" (s05) entra nessas palavras, que o João agora diz.
Conferido no arquivo final (`.cache/gs-pitch/measure-sync.py`: quando o elemento chega a 60% da entrada,
medido nos pixels do mp4, contra o início da palavra). O `timing.json` guarda a palavra de cada reveal
(`word`). O `align.mjs` imprime o relatório **Sincronia**: 83 elementos ancorados, 82 legíveis até 0,1 s da palavra
(mediana 0,06 s antes); o único depois é a s03-hoje, linha de contexto que ninguém fala, de propósito.
`reuse-words.py` ficou só como registro da rodada anterior: o `transcribe-falas.py` não pula falas.

