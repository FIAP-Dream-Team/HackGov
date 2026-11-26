# Roteiro de edição · Vídeo técnico (Premiere)

**Versão 2 (17/11)**, montada sobre o material real: pré-cortes em `bruto/`, motions em `motion/` e o
`roteiro-tecnico.md` v2 (1:49 de fala no seu ritmo, 2:00 no 10% mais lento). Os tempos da coluna "Seq." são
a **estimativa**; quando a narração chegar, posicione cada fala pelo marcador e os cortes acompanham a
palavra da coluna "Entra em", não o relógio. Duração esperada: **~1:54**. Teto: 2:00.

As colunas "In → Out" são do **arquivo de origem** (segundos do pré-corte ou do motion). Todos os brutos estão
em `sources/video/global-solution/bruto/`; os motions e sobreposições em `sources/video/global-solution/motion/`.

## Montagem da sequência

| Item | Valor |
| --- | --- |
| Sequência | `TECNICO`, 1920×1080, 30 fps, áudio 48 kHz |
| V1 | Base: pré-corte (OBS) ou motion de tela cheia (`GS-M01`…`GS-M11`, `.mp4`) |
| V2 | Sobreposições com alfa (`GS-M04*`, `GS-M06*`, `GS-M12*`, `.mov` ProRes 4444) |
| V3 | Reservada (rótulo "13 tabelas", legenda, se precisar) |
| A1 | Narração do John, com marcadores T01…T11 |
| A2 | Trilha, com *auto-ducking* do Essential Sound sob a A1 (−20 a −24 dB abaixo da voz) |

## Regras de corte

- **Corte seco** em tudo. A troca acontece no começo da palavra que pede a nova imagem ("Entra em").
- **Nenhum plano parado por mais de 6 s.** Se a fala é longa, o plano ganha zoom ou corta para outro.
- **Resultado sempre em 1x.** Digitação e navegação podem ir a 150–300%; número e texto de resultado não.
- **Zoom na linha que a fala cita**: escala 115 a 130%, entrada em 12 quadros com *ease in/out*. Um zoom por
  vez. Na A2, zoom de 150–200% na grade esconde o `COUNT()` → `COUNT(*)` do B09a.
- **Sobreposição + zoom:** as caixas do V2 foram medidas no pré-corte a 100%. Se der zoom no take, aninhe
  take + sobreposição (*Nest*) e aplique o zoom no aninhado, para a caixa seguir o texto.
- **Celular** (`B20`): *Scale to Frame Size / Fit* sobre fundo Tinta `#221B33` (os lados ficam escuros, como o
  console que vem depois).
- O número "Tabelas criadas: 14" do A1 **não recebe zoom** (são 13 tabelas e 1 índice).
- Sobreposições têm 4 s, com a saída já animada: corte o fim só se o plano acabar antes.

## Linha do tempo

| Fala | Seq. | V1 (base) | In → Out na origem | V2 (sobreposição) | Entra em | Observação |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | 0:00–0:03,5 | `GS-M01-abertura.mp4` | 0 → 3,5 | — | início | Abre já em movimento, sem tela preta |
| T01 | 0:03,5–0:05,5 | `celular/B20-inicio.mp4` (*Fit*) | 0 → 2,0 | — | "no app" | A faixa verde do efeito cascata no topo |
| T01 | 0:05,5–0:08 | `docker/A1-take-unico.mp4` | 1,5 → 6,7 a 200% | — | "Aqui, o motor" | `docker start` e o Docker Desktop: é o "Oracle" da frase |
| T02 | 0:08–0:14 | `GS-M02-camadas.mp4` | 0 → 6,0 | — | "Antes de codar" | Menu, serviço e DAO acendem na palavra (ajustar `BEATS.M02` depois da narração) |
| T02 | 0:14–0:15,5 | `codigo/B15-arvore-projeto.mp4` | 3,7 → 5,2 | — | "fala SQL" | A árvore com as quatro pastas abertas |
| T03 | 0:15,5–0:22,5 | `GS-M03-modelo.mp4` | 0 → 7,0 | — | "Aqui é como pensamos" | `OCORRENCIA` acende em "ocorrência", `ALERTA` em "alerta" |
| T03 | 0:22,5–0:24 | `banco/A2-take-unico.mp4` | 6,4 → 8,0 | (V3 opcional: texto "13 tabelas") | fim da fala | B06, a lista das 13 tabelas; sem fala |
| T04 | 0:24–0:27 | `docker/A1-take-unico.mp4` | 6,7 → 14,9 a 300% | — | "Com o Oracle no ar" | Menu → opção 1 → relato 1 digitado; sem zoom no "14" |
| T04 | 0:27–0:30,5 | `docker/A1-take-unico.mp4` | 14,9 → 18,5 | `GS-M04a-relato1.mov` | "Gravou" | Resultado em 1x |
| T05 | 0:30,5–0:33 | `docker/A1-take-unico.mp4` | 18,5 → 21,0 | `GS-M04b-confirmacao.mov` em "Repara" | "Agora o vizinho" | Relato 2 → "Relato entrou na ocorrencia ativa" |
| T05 | 0:33–0:38,5 | `docker/A1-take-unico.mp4` | 21,0 → 26,5 | `GS-M04c-cascata.mov` | "Com a luz confirmada" | As três linhas da cascata; deixe a tela mostrar antes da fala |
| T05 | 0:38,5–0:41,5 | `GS-M05-mapa-cascata.mp4` | 0 → 3,0 | — | "três bairros" | Arquipélago sem luz, setas para os três bairros; Bom Jesus fora |
| T06 | 0:41,5–0:44 | `banco/A2-take-unico.mp4` | 24,6 → 27,3 | `GS-M06a-insercao.mov` | "Consultando o banco" | B07: ATIVA, 2 confirmações. Opcional: 0,5 s da digitação a 300% antes |
| T06 | 0:44–0:46,5 | `banco/A2-take-unico.mp4` | 31,8 → 34,7 | `GS-M06b-atualizacao.mov` | "atualizada" | B08: `SEM_ENERGIA` |
| T06 | 0:46,5–0:49,5 | `banco/A2-take-unico.mp4` | 46,8 → 49,8 | `GS-M06c-consulta.mov` | "três notificações" | B09a: zoom na grade esconde o `COUNT(*)` |
| T07 | 0:50–1:03 | `GS-M07-dados.mp4` | 0 → 13,0 | — | "Que dados" | Rodapé da LGPD entra sem narração em 11,2 s |
| T08 | 1:03–1:06 | `codigo/B11-ocorrencia-construtor.mp4` | 5,0 → 8,0 | — | "orientação a objetos" | A seleção do `throw` (severidade entre 1 e 3) |
| T08 | 1:06–1:08 | `codigo/B12a-enum-statusestacao.mp4` | 2,2 → 4,2 | `GS-M12a-enum.mov` | "enums" | Depois do zoom do clipe |
| T08 | 1:08–1:10 | `codigo/B12b-check-sql.mp4` | 3,0 → 5,0 | `GS-M12b-check.mov` | "CHECK" | Mesmas caixas nos mesmos três valores: a troca de editor fica fluida |
| T08 | 1:10–1:12 | `codigo/B16-listas-menu.mp4` | 6,8 → 8,8 | — | "listas" | 2ª metade: `List<T> itens` selecionado |
| T08 | 1:12–1:14,5 | `GS-M08-prepared.mp4` | 0 → 2,5 | — | "PreparedStatement" | `OcorrenciaDAO.inserir`: os `?` e os `setXxx` acendem |
| T09 | 1:14,5–1:23 | `GS-M09-problema1.mp4` | 0 → 8,5 | — | "Primeiro problema" | O risco entra em "ignoraria"; a solução em "a regra foi pro serviço" |
| T09 | 1:23–1:26 | `codigo/B13-registrar-agrupa.mp4` | 7,0 → 10,0 | — | "transação" | A seleção de `somarConfirmacao` / `agrupada = true` |
| T10 | 1:26–1:35 | `GS-M10-problema2.mp4` | 0 → 9,0 | — | "Segundo" | O risco em "não bastava"; o `UPDATE` em "A trava" |
| T10 | 1:35–1:37,5 | `codigo/B14-update-trava.mp4` | 6,5 → 9,0 | — | "só desliga a estação" | A seleção do `WHERE ... STATUS = ?` |
| T10 | 1:37,5–1:41 | `console-a3/A3-take-unico.mp4` | 1,4 → 9,7 (navegação a 300%, resultado 1x a partir de 4,6) | `GS-M04d-sem-aviso.mov` em "Olha" | "Olha" | Confirmacoes: 3, nenhuma linha de aviso; segura 1 s depois da fala |
| T11 | 1:41–1:45 | `console-a3/A3-take-unico.mp4` | 15,3 → 22,4 a 150% (RESOLVIDA em 1x) | `GS-M04e-resolvida.mov` | "E o caso fecha" | 2º e 3º "Ja voltou" → Status: RESOLVIDA |
| T11 | 1:45–1:48 | `console-a3/A3-take-unico.mp4` | 26,2 → 31,0 | `GS-M06e-atualizacao-consulta.mov` | "sai da lista" | Opção 3: "Nenhuma ocorrencia ativa em Arquipelago" |
| T11 | 1:48–1:50,5 | `banco/A2-take-unico.mp4` | 62,2 → 65,0 | `GS-M06d-taxa.mov` | logo após a fala | B10: 1 · 1 · 100, sem fala; a trilha sobe 3 dB aqui |
| T11 | 1:50,5–1:56 | `GS-M11-fecho.mp4` | 0 → 5,5 | — | "Esse é o Alertaí" | O fade final já está no motion |

## Material que sobra (fica de fora do técnico, de propósito)

- `banco/A2`: B09b (bairros avisados) e as digitações longas. O M05 já mostra os três bairros.
- `codigo/B16` 1ª metade (`listarBairros()`), `B12` antes do zoom.
- `celular/B21`–`B24`, `computador/B25`–`B30`, `figma/B26*`: são do pitch (cenas s05–s08).

## Antes de exportar

- Timecode final ≤ 2:00 (alvo 1:55). Se passar, use a ordem de corte do roteiro.
- Os seis itens do enunciado estão na tela (tabela "Onde cada item do enunciado aparece" do roteiro).
- Nenhum nome de morador em zoom; nenhuma senha nem `.env` na tela.
- Áudio: −14 LUFS integrado, pico real ≤ −1 dBTP.
