# Decupagem e pré-corte · Tomada A1 (banco vazio → relato → cascata)

**Resultado:** `A1-take-unico.mp4` (28,7 s, 1920×1080, 30 fps, sem som), montado por
`trabalho/montar.py` a partir dos originais em `originais/` (somente leitura, intocados).

## Como o take foi montado

- **Tempo parado cortado.** No terminal, cortar um trecho em que a tela não muda é invisível: o quadro
  antes e depois do corte é o mesmo. Todas as esperas entre teclas (2 a 28 s) viraram 0,5 s.
- **Troca de janela com corte seco** (terminal → Docker Desktop → Alertaí): lê como um Alt+Tab.
- **Emenda entre os vídeos 1 e 2** no "Pessoa:" do segundo relato, quando a tela já não mostra o
  "Ja existiam: 14" da opção 1 repetida. Para quem assiste, é o programa imprimindo a resposta.
- **Segura nos resultados:** 3 s na opção 1, 3,7 s no "Ocorrencia gravada", 5,3 s na cascata.

## Lista de cortes (EDL)

| # | No take | Origem | Trecho original | Mostra |
| --- | --- | --- | --- | --- |
| 1 | 0:00,0 | vídeo 1 (20-18-58) | 21,00–22,50 s | terminal pronto |
| 2 | 0:01,5 | vídeo 1 | 27,85–30,00 s | `docker start alertai-oracle` → `alertai-oracle` |
| 3 | 0:03,7 | vídeo 1 | 32,55–35,60 s | Docker Desktop com o container rodando |
| 4 | 0:06,7 | vídeo 1 | 38,50–40,00 s | menu do Alertaí |
| 5 | 0:08,2 | vídeo 1 | 66,95–70,50 s | opção 1: tabelas e catálogo do piloto gravados |
| 6–10 | 0:11,8 | vídeo 1 | 81,55–91,00 s (5 trechos de ~0,6 s) | relato 1: opção 2, tipo 1, bairro 4, pessoa 1, severidade 3 |
| 11 | 0:14,9 | vídeo 1 | 97,30–101,00 s | descrição → **Ocorrencia gravada** |
| 12–14 | 0:18,5 | vídeo 2 (20-23-54) | 27,55–36,20 s (3 trechos de 0,6 s) | relato 2: pessoa 2, severidade 3, descrição |
| 15 | 0:20,4 | vídeo 2 | 44,20–49,50 s | **Relato entrou na ocorrencia ativa** + as três linhas da cascata |
| 16 | 0:25,6 | vídeo 2 | 63,90–67,00 s | seleção com o mouse em "Relato entrou na ocorrencia ativa" |

## O que ficou de fora, e por quê

| Trecho | Motivo |
| --- | --- |
| Vídeo 1, 0–21 s | terminal fora de tela cheia (barra de tarefas visível) e a tela inteira selecionada em cinza |
| Vídeo 1, 113–143 s | seleção em "Registrada em" e a opção 3 começada e abandonada |
| Vídeo 2, 0–27 s | sistema reaberto e a opção 1 rodada de novo ("Ja existiam: 14" contradiz o vídeo 1) |
| Vídeo 3 inteiro | seleções que repetem a do vídeo 2 e um pop-up "Enter command number:" no canto |

## Para as próximas tomadas

- **Manter o mesmo terminal** (fundo preto, fonte branca) no A3, para casar com o A1. O perfil "Alertaí ·
  demo" (fundo roxo) fica para regravação geral, se for o caso; misturar os dois quebra a continuidade.
- A **seleção com o mouse** na linha-chave depois do resultado funcionou bem como marca-texto. Vale repetir
  no A3: selecione "Confirmacoes: 3" no B04 e "Status: RESOLVIDA" no B05.
- Não rodar a opção 1 de novo com o banco já criado.
- Entrar em tela cheia (`F11`) **antes** do `F9`.
