# Decupagem e pré-corte · Tomada A3 (B04 terceira confirmação · B05 três "Ja voltou")

**Resultado (v2, 17/11):** `A3-take-unico.mp4` (**35,3 s**, 1920×1080, 30 fps, sem som), montado por
`trabalho/montar_v2.py` a partir de `originais/2026-11-16 21-19-51.mp4` (B04 e B05) e
`originais/2026-11-17 12-29-03.mp4` (passo final), os dois somente leitura. Para refazer:
`python -E -P trabalho/montar_v2.py`. A versão anterior (26,2 s, sem o passo final) ficou em
`A3-take-unico-v1.mp4`; a descrição dela continua abaixo.

## Versão 2 (17/11): o passo final, opção 3

Os 26,2 s da v1 ficam iguais (trechos 1 a 12). Depois da seleção em "Status: RESOLVIDA" entra a tomada de
17/11: opção `3` → bairro `4` → "Nenhuma ocorrencia ativa em Arquipelago.", com a seleção dessa linha.

**Escala.** O take novo foi gravado em tela cheia, sem barra de abas, mas recebe a mesma transformação da v1
(recorte de 1862×1048 e reescala para 1920×1080, +3%), com o recorte em y=0 em vez de y=32. Medido nos dois
lados da emenda: entrelinha de 35 px e margem esquerda de 41 px. O texto tem o mesmo tamanho no take inteiro.

**A emenda.** O programa foi reaberto antes da tomada nova, então a tela começa limpa ("Alertaí" no alto e o
menu com "Opcao:"). Não há quadro em comum com a tela rolada do fim da v1, por isso o corte é seco, do menu
com "Opcao:" no rodapé (fim da v1) para o mesmo menu com "Opcao:" no alto. Lê como a tela sendo limpa antes da
consulta. Os outros cortes da tomada nova caem em tempo parado, com a tela idêntica dos dois lados.

| # | No take | Trecho de 17/11 | Velocidade | Mostra |
| --- | --- | --- | --- | --- |
| 13 | 0:26,2 | 5,00–6,05 s | 1x | menu limpo, "Opcao:" → `3` + Enter |
| 14 | 0:27,3 | 6,85–7,75 s | 1x | lista de bairros → "Bairro:" |
| 15 | 0:28,2 | 8,05–8,45 s | 1x | `4` + Enter |
| 16 | 0:28,6 | 8,45–9,70 s | 1x | **"Nenhuma ocorrencia ativa em Arquipelago."** e o menu |
| 17 | 0:29,8 | 11,00–13,55 s | 1x | o mouse vai até a linha e seleciona |
| 18 | 0:32,4 | 13,55–16,50 s | 1x | segura a seleção, 2,95 s |

**Ficou de fora da tomada nova:** 0–5 s (o menu parado e o ponteiro passando sobre o texto), 6,05–6,85 s e
7,75–8,05 s (espera, tela igual), 9,70–11,00 s (tempo parado), 16,5 s em diante (o mouse sai da linha e, em
24,7 s, abre o menu Iniciar do Windows).

**Conferido quadro a quadro:** os dois lados de cada corte novo (quadros 784/787, 816/819, 843/847, 891/896)
e o último quadro (seleção na linha, menu abaixo, "Opcao:").

**Limitação da v2:** o ponteiro do mouse fica parado logo à direita da linha selecionada no fim do take.

Para escolher as tentativas certas, conferi a tela quadro a quadro e cruzei com a tabela `CONFIRMACAO` do
banco (só as tentativas válidas gravam linha): Morador 3 CONFIRMA às 21:20:45, Morador 1 RESOLVEU às 21:23:00,
Morador 2 às 21:23:55 e Morador 3 às 21:24:13, que encerra a ocorrência. Os Enter certos no vídeo caem em
0:54, 3:09, 4:04 e 4:22.

## Como o take foi montado

- **Janela fora de tela cheia:** a gravação mostra a barra de abas do Windows Terminal. Cortei os 32 px de
  cima e reescalei para 1920×1080 (texto 3% maior que no original). Fica limpo, mas o texto sai um pouco
  maior que no A1.
- **Começa onde o A1 termina:** o primeiro quadro mostra a cascata do relato 2 e o menu, a mesma tela do
  fim do A1.
- **B04 completo:** opção 4, bairro 4, ocorrência 1, retorno 1, pessoa 3. Cada tecla com o Enter em trechos
  de 0,8 s; o tempo parado entre elas (até 15 s) saiu.
- **Primeiro "Ja voltou" com a navegação, os outros dois direto no "Pessoa:".** Repetir três vezes a mesma
  navegação cansa. No segundo e no terceiro, a emenda entra no prompt "Pessoa:", e a tela de cima já mostra
  "Opcao: 4 / Bairro: 4 / Ocorrencia: 1 / Retorno: 2" impressos: lê como o programa respondendo.
- **Emenda entre as duas sessões** (o John saiu e reabriu o sistema no meio): no "Ocorrencia: 1" do
  primeiro "Ja voltou", quando a listagem da opção 3 já rolou para fora e o bloco visível ("Numero: 1 ...
  Confirmacoes: 3 ... Registrada em") é idêntico ao resultado do B04.

## Lista de cortes (EDL)

| # | No take | Trecho original | Velocidade | Mostra |
| --- | --- | --- | --- | --- |
| 1 | 0:00,0 | 0,20–1,60 s | 1x | menu depois da cascata do A1 |
| 2–5 | 0:01,4 | 13,25–49,25 s (4 trechos de 0,8 s) | 1x | B04: opção 4, bairro 4, ocorrência 1, retorno 1 (Ainda esta) |
| 6 | 0:04,6 | 53,15–58,20 s | 1x | pessoa 3 → **Ocorrencia atualizada, Confirmacoes: 3, nenhuma linha de aviso** (4,2 s de segura) |
| 7–8 | 0:09,7 | 181,95–185,25 s (2 trechos de 0,9 s) | 1x | primeiro "Ja voltou": ocorrência 1, retorno 2 |
| 9 | 0:11,5 | 188,00–191,85 s | 1x | pessoa 1 → Ocorrencia atualizada, ainda ATIVA |
| 10 | 0:15,3 | 242,95–246,95 s | 1x | segundo "Ja voltou": pessoa 2 → ainda ATIVA |
| 11 | 0:19,3 | 261,00–264,10 s | 1x | terceiro "Ja voltou": pessoa 3 → **Status: RESOLVIDA, Encerrada em: 16/11/2026 21:24** |
| 12 | 0:22,4 | 278,80–282,60 s | 1x | seleção com o mouse em "Status: RESOLVIDA" |

Todos os trechos ficaram em 1x: cortando o tempo parado, a digitação já ficou ágil e acelerar deixaria os
números ilegíveis.

## O que ficou de fora, e por quê

| Trecho | Motivo |
| --- | --- |
| 1,7–5,8 s | menu Iniciar do Windows aberto por cima do terminal |
| 67–80 s | saída do sistema (opção 0) e reabertura numa aba nova |
| 80–116 s | "Ainda esta" do Morador 3 de novo → "Esta pessoa ja registrou este retorno nesta ocorrencia." |
| 116–176 s | duas opções 3 (listagem das ativas), fora do roteiro; a tela delas mostra a listagem |
| 214–243 s | "Ja voltou" do Morador 1 repetido → erro "Esta pessoa ja registrou..."; até ~243 s o erro fica visível no alto da tela, por isso o segundo "Ja voltou" entra só no "Pessoa:" |
| 249–261 s | ponteiro do mouse parado sobre o resultado e navegação repetida |
| 264–279 s | seleção em "Ocorrencia atualizada" (a seleção que importa é a do status) |
| 283–293 s | seleção em "Encerrada em" e barra de tarefas aparecendo no rodapé |

## Limitação

- ~~O passo 3 não foi gravado~~ **Resolvido na v2 (17/11):** a opção 3 → bairro 4 foi gravada e emendada no
  fim (ver "Versão 2").

## Para as próximas tomadas

- `F11` antes do `F9`: a barra de abas obriga a cortar e reescalar o quadro.
- Mouse fora do texto depois de cada seleção (no fim do take ele fica parado no começo de "Encerrada em").
