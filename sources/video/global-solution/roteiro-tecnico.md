# Roteiro · Vídeo técnico do Alertaí (Entrega 2)

Narração: **John**. Limite do enunciado: **2:00**. Alvo: 1:55.

**Versão 2 (17/11), ajustada ao material gravado.** Cada fala foi encaixada no que os pré-cortes e os motions
mostram de fato (durações medidas em `bruto/` e `motion/`). O que mudou da versão 1:

- **T01** abre no celular (B20, a faixa verde do Início) antes de ir ao Java: o técnico mostra o protótipo
  por um instante e diz que o que roda aqui é o motor dele.
- **T03** termina, sem fala própria, na consulta das 13 tabelas (B06), que estava sobrando no A2.
- **T04** começa no começo real do A1 ("com o Oracle no ar"), com o Docker e a opção 1 acelerados por
  baixo. Não diz "tabelas criadas" (a tela imprime 14: 13 tabelas e 1 índice).
- **T11** deixou de ser mudo no encerramento: narra os três "já voltou" e a ocorrência sumindo da lista
  (opção 3, regravada); o B10 com a taxa de 100% entra com o rótulo "indicador I2", sem fala.
- **T05 e T10** ficaram mais curtos onde a tela já diz: o M04b mostra "virou confirmação", e o M10 escreve
  o motivo de "checar o alerta" não bastar. Assim o total voltou a 1:49.

Este vídeo é uma **demonstração de tela**. Quem assiste é a banca técnica, e o tom é de alguém com a tela
aberta mostrando o que fez para um colega: "aqui a gente decidiu X porque Y". Primeira pessoa do plural, frase
curta, termo técnico dito e explicado na mesma frase.

## Contagem e tempo

Ver a tabela "Tempo" no fim do arquivo (gerada por `scripts/minutagem.py`), no seu ritmo da Fase 3 e do EC-1
e no 10% mais lento, mais o tempo de tela sem fala.

## Técnicas usadas neste roteiro

- **A fala segue a mão.** Cada fala está presa ao que aparece na tela naquele segundo ("Registro…",
  "Repara:"). Nada é dito antes de aparecer, e nada aparece sem ser dito.
- **Decisão sempre com o porquê.** Toda escolha técnica vem no formato "fizemos X porque Y". É isso que a
  banca avalia em "decisões tomadas durante a construção".
- **Um fio só do começo ao fim.** O vídeo inteiro acompanha um caso: uma falta de luz no Arquipélago que
  vira aviso de água em três bairros e termina resolvida. Arquitetura, banco, código e problemas aparecem
  como partes desse caso.
- **Problema contado como história curta:** o que dava errado → o que pensamos → o que fizemos → prova na
  tela.
- **Palavra-chave do enunciado dita em voz alta:** inserido, atualizada, consultando, orientação a objetos,
  enum, PreparedStatement, transação, indicador. O avaliador procura esses termos.
- **Prova antes da explicação no clímax.** Em T05 a tela mostra o aviso saindo e só depois a fala explica.

## Como gravar

1. As telas já estão gravadas e cortadas (`bruto/`, ver `gravacao.md`).
2. **Grave a narração assistindo à tela**, uma fala por vez, com 1 s de silêncio entre elas. O jeito mais
   fácil: abra o `bruto/docker/A1-take-unico.mp4` e os outros pré-cortes no player, na ordem da tabela
   "Tela" de cada fala, e fale em cima. Ver a tela enquanto fala faz o "repara", o "olha" e o "aqui" saírem
   naturais.
3. Leia o texto uma vez para pegar a ideia e grave **falando**, não lendo. Pode trocar uma palavra ou outra;
   só não troque número, nome de classe nem termo técnico.
4. Errou? Repita a fala inteira. Eu corto a tentativa errada.
5. Arquivo: `sources/video/global-solution/audio/tecnico.wav` (ou `T01.wav` … `T11.wav`).

**Legenda da direção:** palavra em **negrito** = ênfase. `(pausa)` = respiro de meio segundo, que dá tempo
de a tela mostrar o que você citou.

---

## Texto

### [T01] Abertura

**Tela:** `GS-M01-abertura` (logo e a cadeia luz → estação → água, 3,5 s) → `celular/B20-inicio.mp4` com
*Fit* (a faixa verde do efeito cascata, ~3 s) → `docker/A1` em 0:00 (terminal).
**Direção:** direto, sem "olá". Animado, de quem vai mostrar algo que funciona.

> Esse é o Alertaí: no app, a falta de luz vira **aviso de falta de água**. Aqui, o motor, em Java e
> Oracle.

### [T02] Arquitetura

**Tela:** `GS-M02-camadas` (as camadas acendem em "menu", "serviço" e "DAO") → `codigo/B15-arvore-projeto.mp4`
(a árvore `model / dao / service / view`) no fim da frase.
**Direção:** explicando no quadro, ritmo de conversa. Cada camada citada é a que acende no diagrama.

> Antes de codar, separamos em camadas: o **menu** só lê a opção, o **serviço** tem as regras, e só o
> **DAO** fala SQL.

### [T03] Modelagem

**Tela:** `GS-M03-modelo` (`OCORRENCIA` acende em "ocorrência", `ALERTA` em "alerta") → `banco/A2` em
0:06,4–0:09,8 (B06: a lista das 13 tabelas no DBeaver), sem fala própria, nos 2 s finais do M03 (rótulo
opcional "13 tabelas" no Premiere).
**Direção:** é a decisão mais importante do banco; diga devagar a diferença.

> Aqui é como pensamos o banco: separar **ocorrência**, o que o morador viu, de **alerta**, o aviso que o
> sistema manda.

### [T04] Rodando e o primeiro relato

**Tela:** `docker/A1` de 0:01,5 a 0:18,5, com o começo acelerado: `docker start` → Docker Desktop → menu →
opção 1 (catálogo do piloto gravado; sem zoom no "14") → relato 1 (opção 2, Falta de luz, Arquipelago, Morador 1) → "Ocorrencia gravada",
Confirmacoes: 1. Sobreposição `GS-M04a-relato1` no resultado.
**Direção:** narrando o que a mão faz, no presente.

> Com o Oracle no ar, registro uma falta de luz no Arquipélago. (pausa) Gravou, com uma confirmação.

### [T05] Segundo relato e a cascata

**Tela:** `docker/A1` de 0:18,5 ao fim (relato 2 → "Relato entrou na ocorrencia ativa" e as três linhas da
cascata), com `GS-M04b-confirmacao` e depois `GS-M04c-cascata` → `GS-M05-mapa-cascata` em "três bairros".
**Direção:** este é o clímax. Deixe a tela mostrar o aviso antes de explicar. Leve surpresa no "repara".

> Agora o vizinho relata o mesmo. **Repara:** virou a **segunda confirmação**. (pausa) Com a luz
> confirmada, a estação fica **sem energia**, e três bairros recebem o aviso.

### [T06] Persistência: inserção, consulta e atualização

**Tela:** `banco/A2`, só os resultados: B07 (0:24,6–0:27,3, ocorrência ATIVA com 2 confirmações) → B08
(0:31,8–0:34,7, `SEM_ENERGIA`) → B09a (0:46,8–0:49,8, alerta `CASCATA`, 3 notificações), cada um com o
seu rótulo `GS-M06a/b/c`. A digitação pode entrar acelerada em 2 a 3 trechos de meio segundo.
**Direção:** ritmo de checklist, uma batida por item. Cada item cai na grade que está na tela.

> Consultando o banco: o relato foi **inserido**, a estação **atualizada** pra sem energia, e o alerta tem
> três notificações.

### [T07] Dados coletados e tratamento

**Tela:** `GS-M07-dados` (três linhas: dado → para quê → cuidado; "nunca mostrado" ganha o marca-texto;
rodapé da LGPD sem narração).
**Direção:** tom de cuidado, um pouco mais sério. O fim da frase é o mais importante.

> Que dados a gente guarda? Nome e celular, pra cada um contar uma vez; os bairros seguidos, pra saber quem
> avisar; e o relato, com o autor salvo só pra evitar voto repetido, e **nunca mostrado**.

### [T08] Conceitos do curso

**Tela:** `codigo/B11` (só a seleção do `throw`, a partir de 5,0 s) → `B12a` com `GS-M12a-enum` →
`B12b` com `GS-M12b-check` → `B16` (só a 2ª metade, a partir de 6,8 s: `List<T> itens`) → `GS-M08-prepared`.
**Direção:** enumerando, uma batida por conceito. O nome do conceito vem antes do exemplo.

> Do curso: **orientação a objetos**, com a Ocorrência recusando severidade inválida; **enums** iguais ao
> CHECK; **listas** no menu; e **PreparedStatement** pra todo dado digitado.

### [T09] Problema 1: relato duplicado

**Tela:** `GS-M09-problema1` (duas linhas iguais → "índice único" riscado → as duas viram uma, com o trecho
de `registrar`) → `codigo/B13` (a seleção de `buscarAtivaNaJanela` e do `agrupada = true`) em "transação".
**Direção:** contando um perrengue real, tom leve. "Então" marca a virada.

> Primeiro problema: cada vizinho criava uma ocorrência nova. Um índice único ignoraria a janela de horas do
> tipo, **então** a regra foi pro serviço, na mesma **transação**.

### [T10] Problema 2: aviso repetido

**Tela:** `GS-M10-problema2` (três avisos iguais → "checar o alerta" riscado → viram um, com o `UPDATE`) →
`codigo/B14` (a seleção do `WHERE ... STATUS = ?`) → `console-a3/A3` de 0:01,4 a 0:09,7 (terceira
confirmação: Confirmacoes 3, nenhuma linha de aviso) com `GS-M04d-sem-aviso`.
**Direção:** mesmo tom do T09. O "olha" final é a prova; fale e deixe a tela respirar 1 s.

> Segundo: o aviso de água repetiria a cada confirmação. Checar o alerta da ocorrência não bastava. A
> trava virou o **UPDATE**: só desliga a estação que ainda está operando. (pausa) **Olha:** nenhum aviso
> novo.

### [T11] Encerramento e fecho

**Tela:** `console-a3/A3` de 0:09,7 ao fim (três "Ja voltou" → Status: RESOLVIDA com `GS-M04e-resolvida`
→ opção 3 → "Nenhuma ocorrencia ativa em Arquipelago", com `GS-M06e-atualizacao-consulta`) → `banco/A2` de
1:00,6 ao fim (B10: 1 registrada, 1 resolvida, 100%, com `GS-M06d-taxa`) → `GS-M11-fecho`.
**Direção:** descendo o tom; a última frase é curta e satisfeita.

> E o caso fecha: três vizinhos marcam que voltou, e a ocorrência sai da lista do bairro. Esse é o
> Alertaí. Código no GitHub.

---

## Se passar de 1:55, corte nesta ordem

1. T08: "listas no menu;" (o B16 sai junto)
2. T04: "Gravou, com uma confirmação." (a tela mostra)
3. T01: "no app," e o B20 (abre direto no M01 e no terminal)

Não corte T05, T06, T07 nem a solução de T09 e T10: são os itens obrigatórios do enunciado.

## Onde cada item do enunciado aparece

| Item do enunciado | Fala |
| --- | --- |
| Sistema Java em execução, com uma funcionalidade | T04, T05, T10, T11 |
| Persistência: inserção, consulta e atualização | T04 (inserção), T06 (as três ditas sobre o DBeaver), T11 (atualização para resolvida e consulta pela opção 3) |
| Dados coletados, finalidade e tratamento | T07; o B10 no T11 mostra o dado virando indicador (rótulo, sem fala) |
| Conceitos: OO, estruturas de dados, modelagem, conexão com banco, boas práticas | T02 (camadas), T03 (modelagem), T08 (OO, enum, listas, JDBC), T09 (transação) |
| Exemplos da própria solução: telas, execução, código | T01 (tela do app), T04–T06 e T10–T11 (execução), T08–T10 (código) |
| Um ou dois problemas, alternativas e solução | T09, T10 |

## Regras de conteúdo conferidas

- "No app, uma falta de luz confirmada vira aviso de falta de água" descreve a tela do protótipo (B20); não
  diz que o aviso chega por push ou SMS.
- Nenhuma fala cita "tabelas criadas" (a tela da opção 1 imprime 14). As 13 tabelas aparecem no M03 e no
  B06, que lista 13.
- "Nome e celular" no T07 é o cadastro **previsto**; o M07 escreve "previsto, ainda não implementado".
- O B10 entra com o rótulo "indicador I2 · dados da demonstração" (1 ocorrência), sem fala.

## Tempo

Estimado por sílaba falada (número e sigla contados como se pronunciam), no ritmo medido de cada pessoa nas
gravações da Fase 3 e do EC-1. A Brenda não tem gravação anterior; usei o ritmo mais lento do grupo (o do
João). A coluna "10% mais devagar" é a margem para nervosismo ou leitura mais cuidadosa.

| Fala | Quem | Palavras | Sílabas | Tempo | 10% mais devagar |
| --- | --- | --- | --- | --- | --- |
| T01 | John | 23 | 37 | 7 s | 8 s |
| T02 | John | 23 | 40 | 7 s | 8 s |
| T03 | John | 21 | 40 | 7 s | 8 s |
| T04 | John | 16 | 31 | 6 s | 7 s |
| T05 | John | 26 | 54 | 10 s | 12 s |
| T06 | John | 19 | 42 | 8 s | 9 s |
| T07 | John | 36 | 64 | 12 s | 13 s |
| T08 | John | 24 | 57 | 11 s | 12 s |
| T09 | John | 27 | 58 | 11 s | 12 s |
| T10 | John | 33 | 70 | 13 s | 15 s |
| T11 | John | 24 | 42 | 8 s | 9 s |
| **Total** (mais 8 s de tela sem fala: abertura, a cascata respirando, o 'olha', o B10 e o fecho) | | **272** | **535** | **1:49** | **2:00** |
