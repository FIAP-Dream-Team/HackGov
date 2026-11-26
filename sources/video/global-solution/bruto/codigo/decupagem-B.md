# Decupagem e pré-corte · Bloco B (código no IntelliJ)

**Resultado:** um clipe por tomada e um rolo de revisão, todos em 1920×1080, 30 fps, sem som, montados por
`trabalho/montar.py` a partir dos originais em `originais/` (somente leitura, intocados):

- v1 = `2026-11-16 21-30-19.mp4` (2:35) · v2 = `2026-11-16 21-34-21.mp4` (6:23)
- Rolo: `B-codigo-rolo.mp4` (60,5 s), na ordem do vídeo, com 0,5 s de preto entre os clipes.

## Como os clipes foram montados

- **Entrada curta e acelerada** (1,5x a 5x): árvore do projeto → arquivo → rolagem. Mostra que é o projeto
  real, sem gastar tempo.
- **Código em velocidade normal**, e o arrasto da seleção a 0,75x para dar tempo de ler.
- **Zoom digital** só na parte do código: entra com um movimento de ~1 s (aceleração e desaceleração) do
  quadro inteiro até a região das linhas, e fica parado ali. A fonte do IntelliJ já é legível em 1080p
  (linha de ~36 px), então o zoom é moderado: 1,33x nos arquivos longos, 1,5x a 1,7x nos médios, 2x no enum.
  O recorte mantém os números de linha.
- **Segura final** de 2,5 a 3 s na seleção. Quando a seleção durava pouco no bruto (o John desmarcou logo),
  o quadro com a seleção completa foi congelado.

## Clipes

| Clipe | Duração | Mostra | Zoom (x, y, largura) | Linha certa selecionada e legível? |
| --- | --- | --- | --- | --- |
| `B15-arvore-projeto.mp4` | 6,7 s | árvore com `dao`, `model`, `service` e `view` abrindo; segura com os quatro expandidos | sem zoom (a árvore é alta e estreita) | não há seleção; árvore legível em tela cheia |
| `B11-ocorrencia-construtor.mp4` | 8,5 s | `Ocorrencia.java`: o construtor (linha 18) passa na rolagem; seleção do `throw ... "A severidade fica entre 1 e 3."` (linha 42) | 1,33x (420, 90, 1440) | sim, linha 42 inteira |
| `B12a-enum-statusestacao.mp4` | 5,3 s | `StatusEstacao.java`: `OPERANDO`, `SEM_ENERGIA`, `DESLIGADA` | 2x (410, 40, 960) | **sem seleção** no bruto; as três linhas legíveis |
| `B12b-check-sql.mp4` | 5,4 s | `alerta_bairro.sql` (no VS Code): `CONSTRAINT CK_EST_STATUS CHECK (STATUS IN ('OPERANDO', 'SEM_ENERGIA', 'DESLIGADA'))`, linha 121 | 1,5x (380, 170, 1280) | **sem seleção** no bruto; linha 121 legível |
| `B16-listas-menu.mp4` | 11,8 s | `MenuPrincipal.java`: `escolherBairro` (166) com `bancoService.listarBairros()` selecionado (169); depois `escolher(` com `List<T> itens` (217–222 selecionadas) | 1,5x (420, 160, 1280) e 1,7x (410, 100, 1130) | sim, 169 e 217–222 |
| `B13-registrar-agrupa.mp4` | 10,0 s | `OcorrenciaService.java`: `registrar(` (24); seleção de `buscarAtivaNaJanela` (31–33); seleção de `somarConfirmacao`/`agrupada = true` (44–47) | 1,33x (420, 90, 1440) | sim, 31–33 e 44–47 |
| `B14-update-trava.mp4` | 9,7 s | `EstacaoDAO.java`: `marcarSemEnergia` (65) destacado; seleção do `UPDATE ... WHERE ID_ESTACAO = ? AND TIPO = ? AND STATUS = ?` (67–69) | 1,33x (410, 150, 1440) | sim, 67–69 |

## Lista de cortes por clipe (trecho original → velocidade)

**B15** · v2 341,4–352,6 s a 3x (árvore abrindo) → quadro de 352,4 s congelado por 3 s.

**B11** · v1 9,6–12,4 a 3x (árvore → Ocorrencia) → 26,1–27,6 a 1x (construtor, linha 18) → 28,7–31,8 a 4x →
40,5–43,1 a 2x (rolagem até a 42) → 44,4–45,4 a 0,75x (seleção da 42, com zoom) → 45,4–48,4 a 1x (segura).

**B12a** · v1 78,4–79,5 a 1x (abre o arquivo) → 79,5–83,7 a 1x com zoom.

**B12b** · v2 17,2–18,95 a 1x (rolagem no SQL) → 18,95–22,6 a 1x com zoom de 1,2 s.

**B16** · v2 70,9–72,4 a 1,5x (árvore → MenuPrincipal) → 73,0–79,4 a 5x → 79,4–80,4 com zoom →
90,45–91,6 a 0,75x (seleção da 169) → 92,2–94,2 a 1x (segura) → 98,4–103,5 a 5x (rolagem até a 217, em tela
cheia) → 112,9–114,35 a 0,75x (seleção de 217–222, com zoom) → quadro de 114,35 s congelado por 2,5 s.

**B13** · v2 157,6–159,0 a 1,5x (árvore → OcorrenciaService) → 162,2–164,6 a 1,5x (`registrar(`) →
183,35–185,7 a 1x (31–33 selecionadas, zoom de 0,8 s) → 192,1–194,0 a 2x (rolagem) → 196,5–197,5 a 0,75x
(seleção de 44–47) → 197,5–200,7 a 1x (segura).

**B14** · v2 245,0–246,3 a 1,5x (árvore → EstacaoDAO) → 249,6–253,5 a 3x → 255,0–257,6 a 1x (nome do método
destacado, com zoom) → 270,55–271,3 e 271,6–272,3 a 0,75x (seleção de 67–69) → quadro de 272,9 s congelado por 3 s.

## Tentativas escolhidas e descartadas

| Tomada | Escolhida | Descartada, e por quê |
| --- | --- | --- |
| B11 | v1 44,6–54,5 s: seleção limpa da linha 42 | v1 18,9–19,8 s: menu de clique direito aberto; v1 54,5 s em diante: seleção desfeita |
| B12a | v1 79–118 s (tela limpa, árvore com StatusEstacao marcado) | v1 134–147 s: menu "Packages" e tooltips de digitação; v2 61–71 s: tela igual, sem ganho, e com a barra de tarefas visível em 65,7 s |
| B12b | v2 18,9–35,2 s (VS Code, sem barra de tarefas) | v2 36–58 s: duplo clique em "CONSTRAINT" (destaca todas as ocorrências) e cursor no meio da linha; v2 58 s: barra de tarefas visível; v2 63 s: diálogo "Do you trust the authors…" do VS Code |
| B16 | v2 90,5–98,4 s (169 inteira) e v2 114,35 s (217–222) | v2 82,3 s: tooltip da classe Bairro; v2 84,7–90,5 s: seleção só do nome `escolherBairro` (não fala de lista); v2 114,7–138 s: seleção que passa da assinatura e pega o corpo do método |
| B13 | v2 183,3 s (31–33) e v2 197,4 s (44–47) | v2 166–167 s: tooltip da classe e seleção parcial da linha 24; v2 179–183 s: tooltip aberto |
| B14 | v2 272,9 s (67–69 completas) | v2 225–244 s: EstacaoBairroDAO aberto por engano; v2 270,2 s: tooltip "No data sources are configured"; v2 273 s em diante: seleção desfeita; v2 369–375 s: menus Window → Layouts |

## Limitações

- **B12a e B12b não têm seleção** no material. O código está legível com o zoom; se a fala precisar apontar
  a linha, a marcação entra na edição (callout no Premiere ou no Remotion) ou se regrava só esse trecho.
- **B12b foi gravado no VS Code**, não no IntelliJ, então o visual difere dos outros clipes (tema e fonte do
  editor). Funciona como "o mesmo enum, agora no banco", mas a troca de editor aparece.
- **A linha 76 de B14** (`executeUpdate() == 1`) só aparece com o cursor nela, sem seleção; está visível
  dentro do zoom, abaixo do UPDATE.
- **B16 ficou com 11,8 s**, acima do alvo de 9 s, porque junta as duas referências a lista (169 e 217–222). Se
  a fala do T08 só tiver ~2 s para listas, use a segunda metade (a partir de 6,8 s).
- Em B12a, nos primeiros quadros depois de abrir o arquivo, o IntelliJ ainda não mostra as dicas "2 usages";
  elas aparecem logo em seguida e as linhas descem um pouco. É o comportamento real do editor.
