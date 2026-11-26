# Decupagem e pré-corte · App no computador (bloco C1, pitch)

**Resultado:** três clipes em 1920×1080, 30 fps, H.264 CRF 16, sem som, montados por `trabalho/montar.py`
a partir de `originais/2026-11-17 12-38-28.mp4` (1:47, somente leitura, intocado). Para refazer:
`python -E -P trabalho/montar.py`; conferência dos cortes: `python -E -P trabalho/conferir.py` (gera
`trabalho/folhas/cortes-*.png`, quadro antes e depois de cada corte).

| Clipe | Duração | Mostra |
| --- | --- | --- |
| `B25-fluxo-computador.mp4` | 18,3 s | Início → "Abrir mapa" → Mapa (escolhe Praia de Belas na lista, clica em Centro Histórico no mapa) → Painel do bairro (abas Menino Deus, Praia de Belas, Centro Histórico) |
| `B28-reportar-ocorrencia-computador.mp4` | 26,4 s | Reportar: Falta de luz → bairro Centro Histórico → Grande perigo → descrição "Rua sem luz as 14h" → Enviar → Ocorrência → "Já voltou" (1 de 3) → volta ao Início com a falta de luz nova em Centro Histórico |
| `B29-meus-bairros.mp4` | 5,7 s | Meus bairros: marca Arquipélago e ele entra em "Seus bairros" na lateral |

## Como os clipes foram montados

- **Quadro recortado e reescalado em todos os clipes:** 1877×1056 a partir de (12, 0), de volta a
  1920×1080 (2,3% maior). Tira a bolha de endereço do Chrome (`localhost:5173/...`, canto inferior
  esquerdo, aparece sempre que o mouse passa num link) e a barra de rolagem da página (borda direita). Nada
  do app fica de fora: o conteúdo vai de x ≈ 180 a 1700. O navegador já estava em tela cheia (sem barra de
  endereço nem abas).
- **Velocidade 1x** em toda ação; só a digitação da descrição está a 2x.
- **Esperas cortadas sem rastro:** os cortes no meio de uma tela caem onde o mouse está parado (o quadro
  dos dois lados é igual).
- **Troca de tela mascara o mouse:** no B25, o clique em "Abrir mapa" emenda no mapa de 11 s depois, com o
  cursor parado 80 px abaixo; a troca de tela esconde o salto.
- Posição do cursor quadro a quadro em `trabalho/mouse.json`; quadros exatos por número com
  `trabalho/quadros.py`.

## Lista de cortes (EDL)

**B25-fluxo-computador**

| No clipe | Trecho original | Velocidade | Mostra |
| --- | --- | --- | --- |
| 0:00,0 | 6,30–8,50 s | 1x | Início; o mouse vai até "Abrir mapa" |
| 0:02,2 | 9,97–10,47 s | 1x | parado em "Abrir mapa" e clique (1,5 s de espera cortado) |
| 0:02,7 | 21,93–30,77 s | 1x | Mapa com Menino Deus; lista "Ir para" → Praia de Belas; clique em Centro Histórico no mapa; mouse até "Painel" |
| 0:11,5 | 31,70–33,60 s | 1x | Painel abre em Menino Deus (1 s parado em "Painel" cortado) |
| 0:13,4 | 35,30–39,13 s | 1x | abas Praia de Belas e Centro Histórico (2 s parado cortados); segura 1 s no fim |

**B28-reportar-ocorrencia-computador**

| No clipe | Trecho original | Velocidade | Mostra |
| --- | --- | --- | --- |
| 0:00,0 | 59,37–71,00 s | 1x | Reportar abre; Falta de luz; Bairro → Centro Histórico (Trabalho); Grande perigo; clique na descrição |
| 0:11,6 | 71,00–78,90 s | 2x | digita "Rua sem luz as 14h" |
| 0:15,6 | 78,90–80,60 s | 1x | Enviar → Ocorrência: "Relato enviado", Ainda está 1, Já voltou 0 de 3; segura 1,4 s |
| 0:18,7 | 86,70–89,23 s | 1x | mouse já em "Já voltou" → clique → "Obrigado! Registramos que voltou para você", 1 de 3 |
| 0:21,2 | 90,13–95,33 s | 1x | seta de voltar → Início, com "Falta de luz · 1 relato · Grande perigo" em Centro Histórico |

**B29-meus-bairros**

| No clipe | Trecho original | Velocidade | Mostra |
| --- | --- | --- | --- |
| 0:00,0 | 44,60–46,00 s | 1x | Meus bairros abre |
| 0:01,4 | 47,00–50,47 s | 1x | marca Arquipélago (49,1 s): aparece "Arquipélago · Seguindo" na lateral e o campo de apelido; segura 0,8 s |

## Trechos recomendados para a cena s08 ("computador", ~4 s)

| Opção | Clipe e trecho | Por quê |
| --- | --- | --- |
| **1 (recomendada)** | `B25` 0:00,5–0:04,7 | Início com a faixa verde da cascata → clique em "Abrir mapa" → mapa com as setas tracejadas da cascata. Lê como "o mesmo app, no computador" |
| 2 | `B25` 0:09,4–0:13,4 | clique em Centro Histórico no mapa → Painel do bairro abrindo |
| 3 | `B28` 0:15,6–0:19,6 | Enviar → Ocorrência (ver o cuidado abaixo) |

Outros usos possíveis: `B28` 0:00–0:11,6 é o relato completo no computador (a cena s06 usa o celular);
`B29` mostra "seguir outro bairro" (o apelido da casa da mãe, citado no app, não é digitado aqui).

## O que ficou de fora, e por quê

| Trecho original | Motivo |
| --- | --- |
| 0–6,3 s | mouse passeando pela tela inicial; em 0,5–1,0 s o botão "sair da tela cheia" do Chrome aparece no alto |
| 10,6–21,9 s | mouse vagando pelo mapa sem ação |
| 33,6–35,3 s e 30,8–31,7 s | mouse parado |
| 39,1–44,6 s | abas Arquipélago e Bom Jesus (repetem a ideia; a fala tem ~4 s) |
| 46,0–47,0 s | mouse parado em Meus bairros |
| 50,5–59,4 s | desmarca Arquipélago, marca e desmarca Bom Jesus, desmarca e remarca "Falta de luz" nos tipos de alerta, rola até "Seus dados" (tentativas soltas, sem resultado) |
| 80,6–86,7 s | mouse vagando na Ocorrência e passando por "Ainda está" com o cursor de bloqueado (círculo vermelho), que parece erro |
| 89,2–90,1 s | mouse parado na linha do tempo |
| 95,3–107 s | rola o Início e reabre a mesma Ocorrência (repetido) |

## Limitações e cuidados

- **Salto de cursor no B28 em 0:18,7:** do fim da Ocorrência (cursor embaixo, onde ficava o Enviar) para o
  cursor já em "Já voltou". É o único salto visível dos três clipes; o resto dos cortes é invisível. Se
  incomodar, no Premiere: começar o uso do B28 em 0:18,7, ou usar só até 0:18,6.
- **"Relato enviado. Avisamos quem segue o bairro."** (faixa verde da Ocorrência, B28 0:15,6–0:18,6) pode
  sugerir que o app envia notificação. Push e SMS não existem (backlog, seção 2). Se esse trecho entrar no
  pitch, a narração não pode dizer que o aviso chega no celular; prefira as opções 1 ou 2 acima.
- **Tela Meus bairros** (B29) mostra o texto "se você autorizar, para enviar alertas por SMS" só na borda
  de baixo, cortado; não entra em destaque.
- **Dados simulados na tela:** nível do Guaíba 2,61 m ("leitura ilustrativa"), alertas dos bairros, números
  do Painel ("Dados simulados para a demonstração", escrito na própria tela) e o mapa estilizado.
- **Não existe no material:** B27 (Tab com "Pular para o conteúdo" e contorno verde de foco), o Alerta em
  cascata aberto (a faixa verde não foi clicada), "Texto maior" ligado (a chave aparece, mas não foi
  acionada) e o apelido digitado em Meus bairros.
- A digitação a 2x mostra "14h" sublinhado em vermelho pelo corretor do Chrome (dura ~1 s).

---

## Regravação 13-48

**Original:** `originais/2026-11-17 13-48-13.mp4` (40,2 s, somente leitura, intocado). Clipes montados por
`trabalho/montar1348.py` (EDL em `trabalho/edl-1348.json`); conferência: `EDL=edl-1348.json python -E -P
trabalho/conferir.py`. Os scripts de análise aceitam `ORIG="2026-11-17 13-48-13.mp4"`.

| Clipe | Duração | Mostra |
| --- | --- | --- |
| `B27-teclado-foco.mp4` | 8,3 s | Início, só pelo teclado: o contorno verde passa por Mapa, Painel, Meus bairros, Reportar, Menino Deus, Centro Histórico, a **faixa do efeito cascata**, "Abrir mapa", os bairros do mapa, os alertas da lista e termina em "Avisos oficiais"; segura 1 s |
| `B30-texto-maior-computador.mp4` | 5,7 s | Só o cartão **Acessibilidade**, ampliado 1,6x sobre o fundo da página: chave desligada → liga (o próprio cartão cresce com a letra maior) → segura → desliga (volta ao tamanho normal) → segura |

### Como foram montados

- **B27:** mesmo recorte do B25 (1877×1056 em (12, 0) → 1920×1080), um trecho só, 1x, sem corte. O
  "Texto maior" está **ligado** nesse momento da gravação (foi ligado em 10,0 s e desligado em 36,2 s). A
  bolha de endereço do Chrome aparece no original enquanto o foco está em link, e o recorte tira.
- **B30:** janela da tela x 590–1570, y 840–1050, escalada 1,6x e centrada num quadro cor da página
  (`#F5F2FA`). A mesma janela contém o cartão nos dois tamanhos (desligado: cartão em y 879–1034;
  ligado: y 856–1026). Acima dele só entra a borda branca vazia do cartão "Seus dados", **sem nenhum texto**
  (nome, celular, aceite de SMS e "Excluir minha conta" ficam fora em todos os quadros, conferido quadro a
  quadro).
- O clique que liga a chave faz a página refluir e o cartão sai da tela por 1,2 s (até o John rolar de
  volta): esse trecho foi cortado, e o corte cai no próprio clique (chave desligada → chave ligada, cartão
  maior). O cursor muda de lugar nesse corte (o layout mudou de tamanho).

### Lista de cortes (EDL)

**B27-teclado-foco**

| No clipe | Trecho original | Velocidade | Mostra |
| --- | --- | --- | --- |
| 0:00,0 | 14,50–21,83 s | 1x | Tab a Tab pelo Início, da barra lateral até "Avisos oficiais"; segura 1 s no último quadro |

**B30-texto-maior-computador**

| No clipe | Trecho original | Velocidade | Mostra |
| --- | --- | --- | --- |
| 0:00,0 | 8,50–10,03 s | 1x | Texto maior desligado; o mouse chega à chave |
| 0:01,5 | 11,27–11,93 s | 1x | chave ligada, cartão com letra maior; segura 1,2 s |
| 0:03,4 | 35,40–36,93 s | 1x | (ainda ligado) o mouse volta à chave e desliga; cartão volta ao normal; segura 0,8 s |

### O que ficou de fora, e por quê

| Trecho original | Motivo |
| --- | --- |
| 0–4,6 s | Início com o mouse passeando |
| 4,6–8,5 s e 12,0–14,0 s | Meus bairros rolando por "Seus dados" (nome, celular, SMS, "Excluir minha conta") |
| 10,03–11,27 s | página refluindo com o cartão fora da tela |
| 21,83–27,3 s | a página rola até "Reportar o que está acontecendo" (o botão fica cortado na borda de baixo) e volta |
| 27,3–34,0 s | segunda passada de Tab com a página já rolada (título cortado); a primeira é mais limpa |
| 34,0–35,4 s e 37,0–40,2 s | Meus bairros com "Seus dados" legível; liga e desliga a chave mais duas vezes |

### O que não existe no material

- **"Pular para o conteúdo":** não aparece. O primeiro Tab da gravação já cai em "Mapa" (o foco estava no
  link "Início", clicado antes). Para pegar, é preciso recarregar a página (`F5`) e apertar `Tab` uma vez.
- **Alerta em cascata:** a tela não é aberta (a faixa verde recebe o foco, mas ninguém aperta Enter nem
  clica). **Não há `B31`.**
- **Efeito do Texto maior no app inteiro em tela cheia:** existe no original só junto de "Seus dados" ou
  em rolagem; o B27 já mostra o Início com o Texto maior ligado.
