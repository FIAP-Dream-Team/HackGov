# Decupagem e pré-corte · Tomada A2 (o banco por fora do programa, no DBeaver)

**Resultado (v2, 17/11):** `A2-take-unico.mp4` (**65,4 s**, 1920×1080, 30 fps, sem som), montado por
`trabalho/render_v2.py` a partir de `originais/2026-11-16 21-02-04.mp4` (B06 a B09b) e
`originais/2026-11-17 12-26-13.mp4` (B10 regravado, taxa 100%), os dois somente leitura. Para refazer:
`python -E -P trabalho/edl.py && python -E -P trabalho/render_v2.py`. A versão anterior (75,9 s, com o B10 em
0%) ficou em `A2-take-unico-v1.mp4`; a descrição dela continua abaixo, da seção "Como o take foi montado" em
diante.

## Versão 2 (17/11): B10 com taxa 100%

O B10 antigo saiu inteiro: a digitação (com `COUNT()` digitado sem o `*`) e o resultado 0%. Entrou o B10
regravado depois do encerramento da ocorrência.

**Onde entra o corte.** A digitação antiga não casa com o take novo: `COUNT()` × `COUNT(*)`, `ab.ID_BAIRRO` ×
`ab.id_bairro` no B09b, uma linha em branco a mais antes do B10, árvore de conexões expandida × recolhida e o
pop-up de autocompletar aberto. Então o corte entra na troca de consulta: do fim do resultado do B09b (0:60,6)
para o editor já rolado com o B10 pronto. A grade de baixo mostra os mesmos três bairros avisados dos dois
lados do corte, e o editor "desce" para a próxima consulta. O B10 aparece já escrito (não há digitação dele).

| No take | Origem | Trecho / quadros | Velocidade | Mostra |
| --- | --- | --- | --- | --- |
| 0:00,0–1:00,6 | 16/11 | EDL antiga até o resultado do B09b (1.819 quadros) | como antes | conexão, B06 a B09b |
| 1:00,6 | 17/11 | quadro 130 congelado 0,5 s | — | B10 escrito, editor parado, grade ainda com o B09b |
| 1:01,1 | 17/11 | quadros 130–232 (4,33–7,73 s) | 1x | Ctrl+Enter (quadro 152) → **REGISTRADAS 1 · RESOLVIDAS 1 · TAXA_PCT 100** assentado no quadro 162 |
| 1:04,6 | 17/11 | quadro 232 congelado 0,8 s | — | resultado limpo; total de ~3,1 s de resultado na tela |

**Conferido quadro a quadro:** os quadros 1817–1820 (dois lados da emenda) e o último quadro (grade 1 · 1 ·
100, sem ponteiro na grade). Do take novo ficaram de fora 0–4,3 s (o mouse indo e voltando no editor, clique
na consulta) e 7,77 s em diante (o mouse entra na grade e clica nas células).

**Limitações da v2:** a árvore de conexões à esquerda passa de expandida a recolhida no corte, e o `ID_BAIRRO`
do B09b vira minúsculo (o B09b da sessão nova foi digitado de novo). É uma troca de consulta, então lê como
rolagem; um zoom na grade do B10 no Premiere esconde as duas diferenças. O ponteiro em forma de I fica parado
no meio do editor durante o B10. A ressalva do `COUNT()` agora só vale para o B09a (0:46,8).

## Como o take foi montado

- **Teste de conexão curto:** clique em *Test Connection* → "Connected (171 ms)", e corte seco para o editor vazio.
  A tentativa de criar um script novo (7 a 32 s) saiu.
- **Digitação a 3x, resultado a 1x.** Cada consulta é digitada acelerada e o resultado fica 2,6 a 3,5 s em
  velocidade normal. Toda pausa de digitação maior que 0,6 s virou 0,25 s.
- **Erro de digitação cortado sem rastro.** O corte entra no último quadro antes do erro e sai no primeiro
  quadro em que o texto volta ao mesmo ponto, já correto: no editor, os dois quadros são iguais e o corte não
  aparece. Foram 31 cortes desse tipo (ex.: `SEW`→`SEL`, `n./i`, `a.id_alke`, `FROM alws`, `ROUND(1--`,
  `'RESOLVIDA'` apagado e redigitado, `THEN 12`, `ELSE -`).
- **Consulta que deu erro e foi colada por cima:** a digitação vai até a última palavra e corta direto para a
  consulta executada e o resultado certo. Nenhuma aba de erro, pop-up de erro ou colagem aparece.
- **Um pop-up branco** de um quadro só (386,43 s, autocomplete) foi removido.

## Lista de cortes (por bloco)

| No take | Trecho original | Trechos | Velocidade | Mostra |
| --- | --- | --- | --- | --- |
| 0:00,0 | 4,0–4,7 s | 1 | 1x | clica em *Test Connection* |
| 0:00,7 | 4,7–5,5 s | 1 | 2x | testando |
| 0:01,1 | 5,5–7,1 s | 1 | 1x | "Connected (171 ms)" |
| 0:02,7 | 32,3–48,5 s | 9 | 3x | B06 digitando: `SELECT table_name FROM user_tables ORDER BY table_name;` |
| 0:06,4 | 49,4–52,8 s | 1 | 1x | **B06 resultado:** as 13 tabelas |
| 0:09,8 | 59,7–160,2 s | 44 | 3x | B07 digitando: a ocorrência com os dois JOIN |
| 0:24,6 | 164,8–167,4 s | 1 | 1x | **B07 resultado:** ocorrência 1, Falta de luz, Arquipelago, ATIVA, 2 confirmações |
| 0:27,3 | 185,3–204,8 s | 10 | 3x | B08 digitando: `SELECT nome, tipo, status FROM estacao_bombeamento ...` |
| 0:31,8 | 207,0–209,9 s | 1 | 1x | **B08 resultado:** ETA Arquipelago `SEM_ENERGIA`, Drenagem Bom Jesus `OPERANDO` |
| 0:34,7 | 223,7–301,3 s | 31 | 3x | B09a digitando: o alerta com a subconsulta de notificações |
| 0:46,8 | 318,1–321,0 s | 1 | 1x | **B09a resultado:** alerta 1, CASCATA, "Possivel falta de agua", origem 1, 3 notificações |
| 0:49,8 | 369,5–403,7 s | 13 | 3x | B09b digitando: os bairros avisados |
| 0:57,9 | 406,6–409,4 s | 1 | 1x | **B09b resultado:** Centro Historico, Menino Deus, Praia de Belas |
| 1:00,6 | 420,6–512,9 s | 49 | 3x | B10 digitando: registradas, resolvidas e taxa |
| 1:12,9 | 528,5–531,5 s | 1 | 1x | **B10 resultado:** 1 registrada, 0 resolvidas, taxa 0 |

A lista quadro a quadro (165 trechos, com o tempo de cada um no take) está em `trabalho/edl-tempos.json`.

## O que ficou de fora, e por quê

| Trecho | Motivo |
| --- | --- |
| 0–4 s e 7–32 s | abertura da janela e a tentativa de criar um script que já existia |
| 31 trechos de erro de digitação | ver "Como o take foi montado" |
| 93,3–100,9 s | digitação do `, o.criada_em`: a coluna existe na consulta executada, mas fica fora da área visível do editor (linha longa); cortar evita a rolagem horizontal |
| 167–185, 210–224, 321–369, 409–420, 513–528 s | mouse procurando, rolagem, execução com erro, aba de erro e colagem da consulta certa |
| 532–539 s | fim da gravação |

## Limitações que ficaram

- **`COUNT()` vira `COUNT(*)` no corte para o resultado** do B09a (0:46,8) e do B10 (1:12,9): é a consulta
  colada por cima que funcionou. A troca é de dois caracteres, na hora da execução; se incomodar, um zoom no
  resultado no Premiere esconde.
- ~~**B10 mostra taxa 0%**~~ **Resolvido na v2 (17/11):** o B10 foi regravado depois do A3 e mostra 100%.
- A coluna `CRIADA_EM` aparece no resultado do B07, embora o texto visível da consulta termine em
  `o.confirmacoes,` (o resto da linha está fora da tela). Coerente com o que foi executado.

## Para as próximas tomadas

- Antes de gravar, deixe a janela do editor larga o bastante para a linha mais longa, ou quebre a consulta em
  várias linhas: evita colunas fora da tela.
- Digitar com calma compensa: no pré-corte a digitação vai a 3x de qualquer jeito.
- Se a consulta der erro, apague e digite de novo em vez de colar: o pré-corte fica sem nenhum salto de texto.
- No A3 (console), a ordem continua: terceira confirmação (sem aviso), três "Ja voltou" e opção 3.
