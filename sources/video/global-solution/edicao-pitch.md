# Roteiro de edição · Pitch (Remotion)

Base: `roteiro-pitch.md`. O pitch é montado como os vídeos do HackGov: o deck HTML é a base, cada elemento
entra na palavra que o cita e os takes do app entram **dentro do slide**, em moldura de celular ou de
navegador. Este arquivo é o mapa de cenas; ele vira `scene-map.json` e `reveals.json` na composição
`GSPitch` (E6). As âncoras são **trechos literais** do roteiro: se alguém falar diferente na gravação,
ajusta-se o texto da fala e a âncora junto.

Tempo medido com as gravações (16/11): **~2:39** a 2:43, conforme o ritmo do John. Teto: 3:00.

## Regras da edição

- **Uma cena por fala** (`f01`…`f11`), com o corte na pausa entre as falas. Onze cenas.
- **Selo de quem fala** (o `SpeakerTag` dos vídeos do HackGov) no canto superior direito (o deck deixa esse canto livre; o rodapé é das fontes), entrando junto com
  a voz e saindo 2 s depois. Aparece toda vez que a voz muda: John → João → Brenda → John → Vinícius →
  Larissa → Brenda → Larissa → John.
- **Takes do app**: sem som, em velocidade normal (os toques precisam ser visíveis), cortados para a duração
  da âncora até a próxima. O celular fica em moldura com sombra mínima; o computador, em moldura de navegador
  sem barra de endereço.
- **Mapa**: o mesmo SVG de `frontend/src/components/MapaBairros.tsx` (600×400), redesenhado no deck, para o
  mapa do vídeo ser o mesmo do app.
- **Fonte de todo número** no rodapé da cena em que ele é falado.
- **Trilha** baixa, mixada a −14 LUFS com a voz na frente, como na Fase 3. Vozes de cinco microfones: o
  tratamento casa volume e timbre pessoa a pessoa antes da mixagem.

## Cenas

Formato de cada entrada: `âncora` → o que entra (como entra).

### s01 · A torneira seca · John · 0:00–0:14

Fundo Tinta `#221B33`, texto Pétala. Sem o app.

- `Janeiro de 2024` → "Porto Alegre · janeiro de 2024" no alto (fade)
- `temporal comum` → ícone de chuva + "temporal" (wipe)
- `derruba a luz` → "→ luz" (wipe)
- `a torneira seca` → "→ água" e a torneira (wipe)
- `dois dias e meio` → "60 h" (count de 0 a 60)
- `cento e cinquenta e sete mil` → "157,3 mil pessoas sem água" (count)
- rodapé: "Fonte: Jornal do Comércio, 19/01/2024"

### s02 · Por que acontece · João Pedro · 0:15–0:29

Fundo Pétala. A cadeia do s01 vira um diagrama de quatro nós em linha.

- `estações que bombeiam água` → nó "estação de bombeamento" (pop)
- `dependem de energia` → nó "luz" ligado à estação (draw)
- `sem luz, a água para` → a luz apaga e o traço até "água" se desenha (draw)
- `um puxa o outro` → marca-texto em "um puxa o outro" (highlight)
- `um de nós` → linha curta: "vivência de um integrante do grupo, que é do Sul" (fade)

### s03 · Quem sofre · João Pedro · 0:30–0:45

- `Quem mora no bairro` → silhueta de casa e rua (fade)
- `só na sua casa` → "Só aqui ou na rua toda?" (wipe)
- `ainda dá tempo` → "Ainda dá tempo de guardar água?" (wipe)
- `acamado` → "pessoas acamadas" (fade)
- `idoso` → "idosos" (fade)
- `aparelho de saúde` → "quem depende de aparelho elétrico de saúde" (fade)
- `pesam mais` → os três itens ganham a cor Perigo `#E8731C` com a palavra escrita (highlight)

### s04 · A prova nos dados · Brenda · 0:46–1:04

Gráfico de barras dos 46 bairros (dados da aba `Dados_Bairros`), ordenado do maior para o menor.

- `cento e sessenta mil` → "160.210 moradores em área afetada" (count)
- `quarenta e seis bairros` → as 46 barras crescem da esquerda para a direita (wipe)
- `só cinco` → as 5 primeiras ficam Jacarandá, as outras ficam cinza (highlight)
- `mais da metade` → chave sobre as 5 com "52,3%" (draw + count)
- `O risco tem endereço` → nomes nas 5 barras: Sarandi, Menino Deus, Farrapos, Humaitá, Cidade Baixa (fade)
- rodapé: "Fonte: Prefeitura de Porto Alegre, painel Áreas Afetadas (cota 5,35 m), 2024; Censo 2022.
  Análise da equipe."
- **Não** mostrar os bairros do piloto nesta cena (ver a nota da conferência dos fatos no roteiro).

### s05 · Alertaí · John · 1:05–1:13

- início → logo Alertaí grande, à esquerda (pop)
- `uma pergunta` → "O que está acontecendo no meu bairro agora, e o que eu faço?" (wipe)
- `o que está acontecendo` → celular à direita com o take **B20** (Início: faixa verde, Guaíba, mapa)

### s06 · Como funciona · Vinícius · 1:14–1:26

Celular ao centro; à esquerda, três linhas de texto que acendem.

- `dois toques` → take **B21** (Reportar → Falta de luz → Enviar) + linha "relata em dois toques"
- `vira confirmação` → take **B22** (Ocorrência, contador "Ainda está") + linha "relato repetido vira
  confirmação"
- `três pessoas` → zoom no "Já voltou 0 de 3" + linha "3 'já voltou' encerram"
- `sem sensor caro` → linha "a fonte é a comunidade" (fade)

### s07 · O efeito cascata · Vinícius · 1:27–1:45

O momento central. Primeiro a linha do tempo (motion M25), depois o celular.

- `efeito cascata` → título (fade)
- `falta de luz é confirmada` → nós 1 e 2 da linha do tempo: "luz cai", "vizinho confirma" (pop)
- `estação de bombeamento` → nó 3: "estação sem energia" (pop)
- `possível falta de água` → nó 4 "aviso sai" + celular com o take **B23** (Alerta em cascata)
- `o porquê` → no take, a rolagem passa por "Por que isso está acontecendo"
- `o que fazer` → rolagem em "O que fazer agora"
- `para quem ligar` → rolagem nos contatos (199, 156)
- `Antes da torneira secar` → nó 5 "água falta", afastado; o vão entre o aviso e a água ganha a legenda
  "tempo para se preparar" (wipe)

### s08 · O protótipo · Ana Larissa · 1:46–2:02

Texto gravado (definitivo): "Desenhamos sete telas do rascunho à alta fidelidade, tanto no celular quanto no
computador, seguindo as diretrizes internacionais de acessibilidade. A informação nunca depende só da cor:
sempre vem com o ícone e o texto, o contraste adequado para a leitura, e a letra pode dobrar de tamanho sem
perder o conteúdo."

- `sete telas` → take **B26a** (Figma, panorâmica nos wireframes cinza) na faixa de wireframes
- `alta fidelidade` → take **B26b** (as mesmas telas em alta fidelidade)
- `computador` → navegador com o take **B25** (fluxo no computador)
- `diretrizes internacionais` → "WCAG 2.1, nível AA" (fade)
- `só da cor` → os três selos (pop) e "a cor nunca vem sozinha: sempre com ícone e texto"
- `contraste` → "Contraste de 4,5:1 ou mais; o menor do app é 5,0:1" (fade)
- `dobrar de tamanho` → "Zoom de 200% sem perder conteúdo" (fade); opcional: inserto de 2 s do app a 200%
  (capturas em `falas/transcricao/zoom200/`)

### s09 · Como medir · Brenda · 2:00–2:16

- `antecedência` → "Antecedência do aviso" grande (wipe)
- `duas horas` → "meta ≥ 2 h" (count)
- `se o alerta acerta` → linha menor: "O alerta acertou? meta ≥ 70%" (fade)
- `se as pessoas agem` → linha menor: "A pessoa agiu? meta ≥ 40%" (fade)
- rodapé: "Metas do piloto, indicadores I5, I6 e I8 da documentação"

### s10 · ODS e próximo passo · Ana Larissa · 2:19–2:38

Texto gravado (definitivo): "Com isso, já atendemos quatro ODS. O treze e o onze pedem alerta precoce e
cidades mais preparadas para desastres. O três protege a saúde de quem é mais vulnerável, e o seis, a
comunidade participando da gestão da água. Começando por cinco bairros. O próximo é o Sarandi, o mais
atingido em 2024."

Quatro blocos de ODS, na ordem da fala, com a cor oficial e a meta escrita.

- `quatro ODS` → título da cena (já visível) e lista vazia
- `o treze` → ODS 13 · metas 13.1 e 13.3 · "alerta precoce e resiliência" (wipe)
- `o onze` → ODS 11 · meta 11.5 · "cidades mais preparadas para desastres" (wipe)
- `o três` → ODS 3 · meta 3.d · "proteger a saúde de quem é mais vulnerável" (wipe)
- `o seis` → ODS 6 · meta 6.b · "a comunidade participa da gestão da água" (wipe)
- `cinco bairros` → o mapa com os 5 bairros do piloto (fade)
- `Sarandi` → o contorno tracejado do Sarandi com "próximo" (pop)

### s11 · Assinatura · John · 2:35–2:42

- início → logo Alertaí
- `o aviso chega antes` → linha de fecho
- nomes da equipe e "Global Solution 2026 · CitizenTech · 2SIOR" no rodapé, sem narração
- fade para preto nos últimos 12 quadros

## Takes do app que esta edição usa

| Take | Gravação (backlog) | Cena | Duração útil |
| --- | --- | --- | --- |
| B20 | Início no celular | s05 | ~6 s |
| B21 | Reportar em dois toques | s06 | ~4 s |
| B22 | Ocorrência, "Ainda está" e "Já voltou" | s06 | ~6 s |
| B23 | Alerta em cascata, rolando | s07 | ~8 s |
| B24 | Texto maior ligando (antes/depois, `bruto/celular/B24-texto-maior.mp4`, 4,1 s) | s08 | ~3 s. **Não** usar sob "dobrar de tamanho": o Texto maior aumenta só 12,5%. Nessa âncora entram as capturas do zoom de 200% (`falas/transcricao/zoom200/`) |
| B25 | Fluxo no computador | s08 | ~4 s |
| B26a/b | Figma: wireframes e alta fidelidade | s08 | ~3 s cada |
