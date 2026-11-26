# Decupagem e pré-corte · Tomada C2 (Figma: wireframes e alta fidelidade)

**Original:** `originais/2026-11-17 12-48-04.mp4` (1:48,7, 1920×1080, 30 fps), somente leitura, intocado.
**Scripts:** `trabalho/analise.py` (movimento e contorno azul por quadro), `trabalho/contorno.py` (contorno de
hover do Figma em resolução cheia), `trabalho/panorama.py` (colagem das paradas e pan suave),
`trabalho/montar.py` (cortes do material real). Para refazer tudo:

```
cd trabalho
python -E -P panorama.py <ffmpeg> <original> B26a-wireframes-pan-suave "30.9,33.0,35.05,36.75,38.4,40.05,41.6" 6.0 --path=594:40,1932:40
python -E -P panorama.py <ffmpeg> <original> B26b-alta-fidelidade-pan-suave "66.15,68.1,70.0,71.8,72.65,73.80" 6.0 --clear-top=110 --path=75:10,1590:10
python -E -P montar.py <ffmpeg>
```
(o segundo grava `../B26b-alta-fidelidade-pan-suave.mp4`, que foi renomeado para `B26b-alta-fidelidade.mp4`;
o primeiro grava `../B26a-wireframes-pan-suave.mp4`, que fica em `trabalho/` e entra no `B26a-wireframes.mp4`.)

## O que tem no original

| Trecho | O que está na tela | Uso |
| --- | --- | --- |
| 0,0–2,9 s | Figma com os painéis abertos, página Wireframes | fora (interface) |
| 3,0–20,0 s | as 7 telas cinza inteiras; o cursor passa por cima e acende o contorno azul de hover em quase todas | fora, exceto 20,00–21,43 (limpo) |
| 20,0–21,4 s | **visão geral dos 7 wireframes, sem contorno** | B26a (abertura) |
| 21,4–30,4 s | zoom para fora e para dentro, contornos de hover | fora |
| 30,4–42,3 s | **pan da tela 1 à 7 nos wireframes**, em seis arrastos curtos com ~1 s parado entre eles | B26a |
| 42,3–46,5 s | contorno de hover na tela 4, ajustes | fora |
| 46,6–47,9 s | **menu Iniciar do Windows aberto** | fora |
| 48,0–53,0 s | painéis do Figma de volta, troca para a página Alta fidelidade | fora |
| 53,0–62,0 s | página Alta fidelidade de longe, com zoom | fora |
| 62,0–64,0 s | zoom chegando na fileira do celular; contorno na tela 1 em 63,90 | fora |
| 64,0–73,8 s | **pan nas 7 telas do celular em alta fidelidade** | B26b |
| 73,83–79,7 s | contorno de hover na tela 7 e depois na tela 1 do computador | fora |
| 79,9–91,2 s | **pan na fileira do computador** (diagonal, com a fileira do celular cortada no alto) | B26c |
| 92,3–94,4 s | zoom para fora | fora |
| 94,5–103,5 s | **página Alta fidelidade inteira: celular em cima, computador embaixo**, sem contorno; cursor só até 95,1 e depois de 101,2 | B26d (95,6–99,6) |
| 103,5–108,7 s | painéis do Figma e **menu Iniciar** | fora |

**Modo Apresentar:** não aparece no material. O protótipo não é navegado em nenhum trecho.

## Clipes

Todos em 1920×1080, 30 fps, H.264 CRF 16, sem som.

| Clipe | Duração | Mostra | Como foi feito |
| --- | --- | --- | --- |
| **`B26a-wireframes.mp4`** | 8,4 s | visão geral das 7 telas cinza (1,4 s) → corte seco → pan suave da tela 1 à 7 (0,5 s parado, 6 s de movimento, 0,5 s parado) | material real (20,00–21,40) + pan suave |
| `B26a-wireframes-pan-real.mp4` | 7,3 s | o mesmo pan como foi gravado, com as paradas reduzidas a 0,2 s | só material real |
| **`B26b-alta-fidelidade.mp4`** | 7,0 s | pan suave pelas 7 telas do celular em alta fidelidade (telas 1–4 → 4–7) | pan suave |
| `B26b-alta-fidelidade-pan-real.mp4` | 6,6 s | o mesmo pan como foi gravado, paradas reduzidas; termina congelado em 73,80 (último quadro antes do contorno na tela 7) | só material real |
| `B26c-computador.mp4` | 7,4 s | pan na fileira do computador (Início → Mapa ao vivo) | só material real, **uso limitado** (ver limitações) |
| **`B26d-alta-fidelidade-visao-geral.mp4`** | 4,0 s | a página Alta fidelidade inteira: as 7 telas do celular em cima e as 7 do computador embaixo, parada, sem cursor | material real 95,6–99,6 |
| `B26a-wireframes-panorama.png` | 4061×1080 | as 7 telas cinza lado a lado, sem cursor nem contorno | colagem das paradas |
| `B26b-alta-fidelidade-panorama.png` | 3939×1076 | as 7 telas do celular em alta fidelidade lado a lado | colagem das paradas |

### O que é o "pan suave"

O John arrastou o canvas em pulos (arrasto de ~0,7 s, parada de ~1 s). Entre um arrasto e outro o canvas
fica parado e é o mesmo desenho, só deslocado. As paradas foram coladas numa imagem só (deslocamento medido
por correlação de fase; erro médio de 0,01 a 0,3 em 255, ou seja, encaixe exato) e o pan foi refeito com
movimento contínuo, acelerando e freando nas pontas. Combinar as paradas pela mediana apagou o cursor. É o
mesmo canvas gravado, sem nada redesenhado; muda só o movimento da câmera. As versões `-pan-real` ficam como
alternativa 100% gravada.

### Cortes

- **B26a:** um corte seco em 1,40 s, de "7 telas de longe" para "telas 1–4 de perto". Enquadramentos
  claramente diferentes; lê como aproximação.
- **Versões `-pan-real` e B26c:** cada arrasto mantém 0,1 s parado antes e depois; o resto de cada parada saiu.
  Os quadros de uma parada são idênticos, então o corte não aparece. Conferido: nenhum movimento ficou de fora
  entre dois trechos (o arrasto de um quadro em 89,13 s do B26c foi mantido) e nenhum trecho se repete.
- Varredura dos clipes prontos: o único salto isolado entre quadros é o corte seco planejado do B26a.

### Enquadramento

O take não estava em tela cheia: a barra de abas do Figma/Windows ocupa as linhas 0–37, há barra de rolagem
embaixo (1069–1072) e à direita (1916–1917) e borda de 1 px. Todo clipe recorta 1831×1030 do canvas (abaixo
da barra, dentro das bordas) e reescala para 1920×1080: o desenho fica **4,9% maior** que no original, sem
perda visível.

## Para a cena s08 do pitch (≈3 s por âncora)

| Âncora da fala (Larissa) | Clipe | Entrada → saída | Por quê |
| --- | --- | --- | --- |
| `sete telas` | `B26a-wireframes.mp4` | **0:00,0 → 0:03,0** | abre com as 7 telas cinza inteiras (dá para contar) e já entra no pan |
| `alta fidelidade` | `B26b-alta-fidelidade.mp4` | **0:02,0 → 0:05,0** | trecho de maior velocidade do pan, telas 2 a 6 |
| `computador` | `B26d-alta-fidelidade-visao-geral.mp4` | **0:00,0 → 0:03,0** | mostra celular **e** computador de uma vez, que é o que a frase diz ("tanto no celular quanto no computador"); o B25 (app no navegador) segue como alternativa |

Se a cena usar um pan próprio no Remotion, os dois PNGs de panorâmica permitem qualquer movimento sem
depender do vídeo.

## Limitações

- **Modo Apresentar não foi gravado.** Se o pitch precisar do protótipo navegando no Figma (clique levando de
  uma tela a outra), falta regravar: Figma → Apresentar → fluxo "Alertaí · celular", ~10 s.
- **B26c (computador) tem uso limitado:** a fileira do celular aparece cortada no alto no começo, sobra muito
  canvas vazio, o Figma mostra uma barra azul de carregamento sob a tela 1 nos primeiros quadros e o cursor de
  "ocupado" aparece no fim. Também não deu para fazer o pan suave: o Figma ainda carregava as imagens durante
  o arrasto, e as paradas não batem entre si. Para o computador, usar B26d ou o B25. Regravar só se quiser
  um pan do computador: página Alta fidelidade, zoom na fileira do computador, `Ctrl + \`, mouse fora do canvas,
  esperar carregar antes de arrastar.
- No B26a, durante a visão geral (1,4 s), o cursor está parado no canvas vazio, abaixo das telas.
- No B26b, os rótulos da fileira do computador ("Computador · 1 · Início"...) aparecem cortados no rodapé,
  como no canvas real.
