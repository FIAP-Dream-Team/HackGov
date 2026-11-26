# Decupagem e pré-corte · Celular (bloco C3 do pitch)

**Estado atual (17/11, depois da tomada 2):** ver a seção **Tomada 2** no fim deste arquivo. Os clipes
`B20` a `B23` sem sufixo são da tomada 2; os da tomada 1 ganharam o sufixo `-t1`. O B24 saiu da tomada 3
(seção **Tomada 3 (B24)**), como antes e depois, sem o toque na chave.

## Tomada 1

**Original:** `originais/WhatsApp Video 2026-11-17 at 12.37.24.mp4` (1:17,9, 384×832, ~37,8 fps variável,
comprimido pelo WhatsApp; somente leitura, intocado). Clipes montados por `trabalho/montar.sh` (já gera os nomes com `-t1`); folhas
de contato em `trabalho/folhas/`, conferência de bordas em `trabalho/conf/`.

### Resultado da tomada 1

| Take pedido | Situação | Clipe |
| --- | --- | --- |
| **B20** Início: faixa verde → mapa | Pronto (reserva) | `B20-inicio-t1.mp4` (7,3 s) e `B20-inicio-longo-t1.mp4` (9,8 s) |
| **B21** Reportar: Falta de luz → Enviar → Ocorrência | **Falta regravar**: a tela Reportar abre, mas nenhum tipo é tocado e nada é enviado (o botão fica "Escolha um tipo para enviar") | — (só o extra X3, com a grade de tipos) |
| **B22** Ocorrência: "Ainda está" e "Já voltou" | **Falta regravar**: a tela de Ocorrência nunca é aberta | — |
| **B23** Alerta em cascata, rolando | **Falta regravar**: a faixa verde nunca é tocada; a tela do alerta não aparece | — |
| **B24** Texto maior liga e desliga | **Falta regravar**: a chave aparece (43,5–44,8 s), mas fica desligada; a rolagem volta ao topo sem ligar | — |

Extras limpos (não pedidos, podem servir de inserto no pitch):

| Clipe | Trecho original | Mostra |
| --- | --- | --- |
| `X1-mapa-ao-vivo.mp4` (6,0 s) | 11,8–17,3 s | fim do Início → toque em Mapa → Mapa ao vivo (setas da cascata, legenda) → rola até a lista "Menino Deus" |
| `X2-painel-do-bairro.mp4` (9,5 s) | 21,6–30,6 s | toque em Painel → números do Menino Deus → rola até "A luz cai antes da água" (3,4 h). A tela diz "Dados simulados para a demonstração" |
| `X3-reportar-tipos.mp4` (6,1 s) | 67,8–73,4 s | Início → toque em Reportar → "O que está acontecendo?" com a grade dos 6 tipos, parada |

### Formato

- **Tela nativa do celular, vertical: 384×832**, sem moldura, sem barras, sem upscale e sem encaixar em
  1920×1080 (pedido do John em 17/11: ele usa *Fit* na sequência do Premiere). 30 fps constantes (o original
  é variável), H.264 CRF 16, `yuv420p`, sem áudio.
- **Sem recorte.** A barra de status do iOS fica (relógio; no topo dos primeiros segundos aparece a pílula
  vermelha de gravação de tela). A barra de endereço do navegador também fica: ela encolhe sozinha quando
  a página rola (de ~58 px para um rótulo pequeno), então um recorte fixo cortaria o cabeçalho do app num
  estado ou deixaria sobra no outro. É o comportamento normal do navegador e lê como uso real.
- Cada clipe é um trecho contínuo do original (sem emenda interna); entrada e saída conferidas quadro a
  quadro.

### Lista de cortes

| Clipe | Trecho | Segura final | Observação |
| --- | --- | --- | --- |
| B20-inicio-t1 | 0,30–6,90 s | 0,7 s no último quadro | 0,3–3,4 s parado no topo (faixa verde e Guaíba); 3,4–6,9 s rolagem; termina com o mapa inteiro na tela e o início de "Nos seus bairros". A barra do navegador encolhe em ~3,6 s |
| B20-inicio-longo-t1 | 0,30–9,60 s | 0,5 s | mesma rolagem até o fim do Início (avisos oficiais e "Reportar o que está acontecendo") |
| X1 | 11,80–17,30 s | 0,5 s | o toque em Mapa cai em ~12,2 s; a rolagem até a lista termina em movimento (em 17,5 s o John rola de volta) |
| X2 | 21,60–30,60 s | 0,5 s | toque em Painel em ~21,7 s; rolagem 26–29,5 s |
| X3 | 67,80–73,40 s | 0,5 s | toque em Reportar em ~68,8 s |

### O que ficou de fora, e por quê

| Trecho | Motivo |
| --- | --- |
| 9,6–11,8 s | fim do Início parado; a barra do navegador volta a crescer |
| 17,3–21,6 s | volta da rolagem e Mapa parado por 3,5 s |
| 30,6–34,0 s | volta da rolagem no Painel |
| 34,0–52,0 s | Meus bairros: rolagem até "Seus dados" (nome "Ana Souza", celular) e a chave Texto maior **sem ligar**. Mostrar o cadastro no pitch sugeriria que ele funciona, e ele não está implementado |
| 52,0–67,8 s | Início parado 11 s e uma rolagem que repete o B20 |
| 73,4–77,0 s | rolagem no Reportar até "Quão grave?" sem escolher tipo (botão desabilitado) |
| 77,0–77,9 s | Central de Controle do iOS (fim da gravação) |

### Qualidade (384×832 do WhatsApp)

Com *Fit* numa sequência 1080p o clipe sobe para 1080 px de altura (~2,6x; quadro em
`trabalho/conf/qual-1080.png`, detalhe 1:1 em `qual-1080-detalhe.png`). O texto principal continua
legível ("Possível falta de água", "Perigo", "Atenção"), mas a imagem fica **visivelmente mole**: halo de
compressão em volta das letras, ícones borrados e texto pequeno ("Aviso oficial · Defesa Civil de…")
no limite. Ao lado dos takes do computador e do código, em 1080p nítido, a diferença aparece. A 760 px
de altura (`qual-760.png`) passaria sem problema.

**Recomendação:** pedir o **original do celular** (por cabo ou Google Drive; o WhatsApp reduz para 384 px de
largura e recomprime). Na gravação nativa do iPhone a tela tem 3x essa largura, e com *Fit* em 1080p ela
desce em vez de subir. Como B21 a B24 precisam ser regravados de qualquer jeito, vale regravar o B20 na
mesma tomada, para todos os takes terem a mesma nitidez. O B20 atual serve como reserva.

### Para a regravação (B21 a B24)

Uma gravação só, recarregando a página antes (os dados voltam ao início):
1. **B21** Reportar → toque em *Falta de luz* → *Enviar* → espere a Ocorrência abrir, 2 s.
2. **B22** Na Ocorrência: *Ainda está* → 2 s → *Já voltou* → 2 s (contador "Já voltou 1 de 3").
3. **B23** Início → toque na **faixa verde** → no Alerta em cascata, role devagar por "Por que isso está
   acontecendo", "O que fazer agora" e os contatos (199, 156); 2 s no fim.
4. **B24** Bairros → role até *Texto maior* → **toque para ligar** → 2 s (a letra cresce) → toque para
   desligar. Não parar a rolagem em "Seus dados".

---

## Tomada 2

**Original:** `originais/WhatsApp Video 2026-11-17 at 13.08.46.mp4` (1:57,6, 384×832, ~41,7 fps variável,
de novo pelo WhatsApp; somente leitura, intocado). EDL em `trabalho/edl-tomada2.json`, render em
`trabalho/render.py`; folhas de contato em `trabalho/folhas2/`, conferência em `trabalho/conf2/`.

### Resultado da tomada 2

| Take | Situação | Clipe | Mostra |
| --- | --- | --- | --- |
| **B20** | **Pronto (melhor que a t1)** | `B20-inicio.mp4` (7,1 s) | topo do Início parado (faixa verde e Guaíba), rolagem em 3,2–4,3 s, e a rolagem **para sozinha no mapa** por 3 s, sem quadro congelado. A t1 fica como reserva |
| **B21** | **Pronto** | `B21-reportar.mp4` (4,0 s) | Reportar abre → toque em **Falta de água** (não Falta de luz) → corte → formulário pronto com "2. Enviar: falta de água"; termina no formulário, no quadro antes de a Ocorrência abrir (sem a faixa "Avisamos quem segue o bairro") |
| | Alternativa | `B21-reportar-completo.mp4` (18,3 s) | o mesmo sem corte: tipo, bairro Praia de Belas, gravidade Grande perigo, "Sem água" digitado com o teclado aberto, Enviar |
| **B22** | **Pronto, com ressalva** | `B22-ocorrencia.mp4` (4,8 s) | Ocorrência "Falta de água · Praia de Belas" já rolada, sem o texto da faixa: Ainda está 1, Já voltou 0 de 3 → toque em **Já voltou** → **1 de 3** e a linha do tempo "Mais uma pessoa disse que já voltou" → volta ao topo com "Obrigado! Registramos que voltou para você." |
| **B23** | **Pronto, com ressalva** | `B23-alerta-cascata.mp4` (10,6 s) | Mapa (filtro Efeito cascata, lista Praia de Belas) → toque em "Possível falta de água" → alerta "Efeito cascata": "A ETA Arquipélago ficou sem energia…", rola por "Por que isso está acontecendo" (chuva → luz caiu → ETA parou → água pode faltar), "O que fazer agora" e os contatos 199, 193, 192 e 156; segura 1 s nos contatos |
| **B24** | **Falta regravar** | — | a chave Texto maior aparece de novo (72–73,5 s) e **não é ligada**; logo antes a rolagem passa por "Seus dados" |

### Ressalvas de conteúdo

- **B21 e B22 usam Falta de água**, não Falta de luz como dizem `gravacao.md` e `edicao-pitch.md`. A fala
  do Vinícius no f06 ("Viu um problema? Relata em dois toques") não nomeia o tipo, então serve. A cena do
  efeito cascata (s07) não depende disso.
- **"Relato enviado. Avisamos quem segue o bairro."** aparece na faixa verde da Ocorrência de **100,98 s a
  ~104,05 s** do original (texto legível). Sugere aviso enviado de verdade (push não existe), então **saiu dos
  dois clipes (17/11)**: o `B21-reportar` termina em 100,96 s, no formulário, e o `B22-ocorrencia` começa em
  104,10 s. No começo do B22 fica, sob o cabeçalho, uma borda verde lisa da faixa (só o pé das letras, sem
  texto legível) até a faixa "Obrigado!" ocupar o lugar. O `B21-reportar-completo` **ainda mostra** a faixa
  nos últimos 1,6 s (não foi alterado).
- **B22: "Ainda está" não é tocado.** O botão fica desabilitado ("Você já respondeu sobre essa
  ocorrência"), porque quem relatou já conta como 1. Mostra só o "Já voltou 0 de 3 → 1 de 3", que é o que
  a fala usa ("Quando três pessoas avisam que voltou").
- **B23 entra pelo mapa, não pela faixa verde do Início.** O alerta é o mesmo ("Efeito cascata · há 37
  min"); a fala do f07 não cita o caminho.
- **Ficou de fora:** "Seus dados" com nome e celular (69,5–73,5 s), o aceite de SMS e o alerta da Chuva
  forte (45–50 s).
- A barra de status mostra a hora em pílula vermelha (gravação de tela), como na tomada 1.

### Lista de cortes (segundos do original)

| Clipe | Trechos | Segura final | Conferência |
| --- | --- | --- | --- |
| B20-inicio | 0,30–7,40 | — | entra no topo parado; sai no mapa parado |
| B21-reportar | 84,62–87,65 · **corte** · 100,37–100,96 | 0,3 s | entra com o Reportar já aberto. Corte: antes, a grade com Falta de água selecionada (topo); depois, o formulário rolado com o teclado já fechado (o teclado some em 100,36 s). Termina em 100,96 s, último quadro do formulário (a Ocorrência com a faixa abre em 100,98 s) |
| B21-reportar-completo | 84,62–102,60 | 0,3 s | sem corte |
| B22-ocorrencia | 104,10–108,45 | 0,5 s | começa com a Ocorrência já rolada e o texto da faixa fora da tela; o toque em Já voltou cai em ~105,8 s; sai no topo com "Obrigado!" |
| B23-alerta-cascata | 34,80–44,40 | 1,0 s | toque no item em ~35,8 s; sai com os quatro contatos na tela (em 44,6 s o John rola de volta) |

### O que ficou de fora

| Trecho | Motivo |
| --- | --- |
| 7,4–16,5 s | rolagem até o fim do Início e volta (repete o B20) |
| 16,5–34,8 s | Mapa: filtros rolando de lado e troca de bairro no "Ir para" (menu aberto em 31 s) |
| 44,6–50,0 s | volta da rolagem e toque em "Chuva forte", que abre outro alerta |
| 50–61 s | Painel (já há o extra X2) |
| 61–74 s | Meus bairros: marca e desmarca Arquipélago, passa por "Seus dados", Texto maior não ligado |
| 74–84,6 s | Mapa de novo |
| 87,65–100,37 s | (só no B21 curto) rolagem, bairro, gravidade e digitação |
| 108,45–117,6 s | volta ao Início, mapa e Central de Controle |

### Trocar a fonte pelo original do celular

A EDL guarda tempos em segundos do arquivo de origem. O mesmo vídeo em resolução cheia tem os mesmos
tempos, então basta apontar a fonte nova:

```
python -E -P trabalho/render.py trabalho/edl-tomada2.json --fonte "originais/<original do celular>.mp4"
```

O script lê a resolução da fonte nova, reescala o recorte (hoje `null`, sem recorte) pela razão das
larguras e mantém as dimensões pares. Antes, conferir dois quadros: se o original tiver outra duração ou
começar em outro ponto (o WhatsApp às vezes corta o começo), medir a diferença num evento nítido (por
exemplo, a Ocorrência abrindo em 100,98 s) e somá-la aos tempos da EDL.

### O que ainda falta

- **B24 (Texto maior):** regravar só isto, ~10 s. Bairros → rolar direto até *Acessibilidade* (sem parar
  em "Seus dados") → **tocar na chave para ligar** → 2 s com a letra maior → tocar de novo para desligar.
- **Original do celular:** a recomendação da tomada 1 continua: com *Fit* em 1080p estes 384×832 ficam
  moles. Se o John mandar o arquivo original (cabo ou Drive), é só re-renderizar pela linha acima.

---

## Tomada 3 (B24)

**Original:** `originais/WhatsApp Video 2026-11-17 at 13.47.42.mp4` (25,8 s, 384×832, ~34 fps variável, pelo
WhatsApp; somente leitura). EDL em `trabalho/edl-tomada3.json`, render pelo mesmo `trabalho/render.py`
(`python -E -P trabalho/render.py trabalho/edl-tomada3.json [--fonte <original>]`). Folhas em
`trabalho/folhas3/`, conferência em `trabalho/conf2/b24.png`. Não havia B24 anterior para renomear.

**O que a tomada tem:** Início (0–5,5 s) → Bairros (6,0 s) → rolagem até Acessibilidade (10–13,7 s) → a
chave Texto maior é **ligada em ~15,3 s** → a página cresce e a tela fica parada em **"Seus dados"** com o
texto ampliado (15,3–21,4 s) → volta ao topo de Meus bairros, ampliado (21,5–24,0 s) → toque em Início,
ampliado (24,0–24,9 s) → Central de Controle (25 s). **A chave não é desligada.**

**Por que não há o toque na chave:** em todo quadro em que a chave aparece (13,7–15,2 s), "Seus dados" está
logo acima e legível (nome "Ana Souza", celular, aceite de SMS); depois de ligar, a tela fica só em "Seus
dados". Pela regra, nenhum desses quadros entra.

### Clipe

| Clipe | Trechos (s do original) | Segura final | Mostra |
| --- | --- | --- | --- |
| `B24-texto-maior.mp4` (4,1 s) | 8,00–9,70 · **corte** · 23,30–24,85 | 0,8 s | **antes e depois**: topo de Meus bairros com o texto normal (1,7 s) → corte para a mesma tela com Texto maior ligado (a letra cresce visivelmente) → toque em Início, que também aparece ampliado; segura no Início |

Conferência: o corte junta duas vezes a mesma tela (Meus bairros, barra do navegador aberta nos dois
lados), então lê como "antes/depois". Nos primeiros quadros depois do corte a rolagem ainda assenta 1–2 px.
O relógio da barra de status muda de 13:46 para 13:47 no corte. Nenhum quadro do clipe mostra "Seus dados".

### Ressalvas

- **Sem o toque na chave e sem desligar.** Para a fala da Larissa basta o efeito; se o John quiser o toque,
  a edição pode pôr um rótulo "Texto maior" sobre o corte, ou regravar com a página rolada só até
  Acessibilidade e um zoom no Premiere que deixe "Seus dados" fora do quadro.
- **Texto maior aumenta 12,5%**, não dobra. A frase "a letra pode dobrar de tamanho" (f08) se apoia no teste
  de zoom de 200% do navegador (`falas/transcricao/zoom200/`), não neste clipe; não legendar este clipe como
  "200%".
