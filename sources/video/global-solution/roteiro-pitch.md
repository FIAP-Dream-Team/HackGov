# Roteiro · Pitch do Alertaí (Entrega 1)

Narração: **os cinco integrantes**, cada um no bloco da sua área. **Texto definitivo** (16/11, 22h): é o que foi
gravado; as falas f08 e f10 foram reescritas pela Larissa e conferidas com a documentação. Limite do enunciado: **3:00**. Alvo: 2:50.

> **Revisão de 18/11 (vale sobre o texto abaixo):** o grupo ajustou o roteiro em
> `review/Roteiro_Pitch_Alertai (1).pdf` para o pitch apresentar o Alertaí como app de alertas de risco
> climático por bairro. Mudou: **f04** (Larissa) "E isso não é um caso isolado. Na cheia histórica do Guaíba,
> em 2024, …"; **f05** (João) "Por isso criamos o Alertaí, um app de alertas por bairro que responde a uma
> pergunta: …"; **f05m, nova** (João, com a tela do Mapa ao vivo) "No mapa, cada bairro mostra seus riscos:
> chuva forte, alagamento, árvore caída, falta de luz e de água, com os avisos oficiais e o nível do Guaíba.
> E a previsão é de mais chuva forte até 2027."; **f06** (Larissa) "… Junto com os avisos oficiais, a
> comunidade é a principal fonte, sem sensor caro." As outras falas não mudaram. Texto exato usado no
> vídeo: `remotion/src/data/gs-pitch/roteiro.json`; montagem em `pitch-remotion.md`.

## Quem fala o quê

Cada pessoa fala do que construiu no projeto (divisão da seção 15 da documentação). Assim a voz muda junto
com o assunto, e a banca de empresas vê a equipe inteira.

| Quem | Blocos | Assunto | Tamanho |
| --- | --- | --- | --- |
| John | f01, f05, f11 | Abertura, apresentação do Alertaí e fecho | 70 palavras, ~25 s |
| João Pedro | f02, f03 | Por que acontece e quem sofre | 79 palavras, ~29 s |
| Brenda | f04, f09 | A prova nos dados e como medir | 72 palavras, ~33 s |
| Vinícius | f06, f07 | Como funciona e o efeito cascata (as regras que ele programou) | 84 palavras, ~30 s |
| Ana Larissa | f08, f10 | O protótipo e os ODS | 84 palavras, ~30 s |

Ordem de entrada das vozes: John → João → Brenda → John → Vinícius → Larissa → Brenda → Larissa → John. O
nome de quem fala aparece no canto da tela quando a voz entra (o mesmo selo dos vídeos do HackGov).

**Em aberto (John):** a frase "Um de nós é do Sul e já viveu isso" (f02) ganha força se for dita por quem é
do Sul. Se for outra pessoa do grupo, o f02 passa para ela e o João fica só com o f03.

Mesmo formato dos vídeos do HackGov: deck animado no Remotion, sincronizado com a narração; cada elemento
entra na palavra que o cita. O app aparece em **takes curtos**, dentro de uma moldura de celular ou de
navegador, só nos pontos-chave (f05 a f08). Quem assiste são as empresas parceiras: linguagem de produto,
sem nome de classe nem de tabela.

## Contagem e tempo

Ver a tabela "Tempo" no fim do arquivo: estimada por sílaba falada, no ritmo medido de cada pessoa nas
gravações da Fase 3 e do EC-1, com 1 s de troca de slide entre os blocos.

## Técnicas usadas neste roteiro

- **Abertura fria com uma cena concreta.** Começa no temporal de janeiro de 2024, não em "olá, somos o
  grupo". Os primeiros 10 s decidem se a pessoa continua assistindo.
- **Problema → por que acontece → quem sofre → prova → solução → diferencial → como medir → visão.** É o
  arco que responde, na ordem, às perguntas do enunciado do pitch.
- **Gancho que volta no fim.** "A torneira seca" abre o vídeo e "o aviso chega antes" fecha. A última frase
  responde à primeira.
- **Um número por frase, sempre com fonte na tela.** Número escrito por extenso para ler sem tropeço.
- **Vivência real do grupo como prova humana** (seção 2.3 da documentação: um integrante é do Sul e já
  passou por isso). Nenhum personagem inventado.
- **Diferencial em uma frase que dá para repetir:** avisar sobre a falta de água antes de ela acontecer.
- **Regra de três** no ritmo: "o porquê, o que fazer e para quem ligar".

## Como gravar

Instruções para mandar no grupo (cada um grava em casa, no celular ou no computador):

- **Um arquivo por pessoa**, com toda a sua parte e 2 s de pausa entre um parágrafo e outro (`.wav`,
  `.m4a` ou `.mp3`, do gravador do celular mesmo). O texto para mandar ao grupo está em
  `roteiro-pitch-grupo.md`, gerado deste arquivo por `scripts/gerar-roteiro-grupo.py`. Mandar no WhatsApp **como documento**, não como áudio, para não perder qualidade.
- **Lugar silencioso e sem eco**: quarto com cama e cortina é melhor que sala ou banheiro. Celular a um
  palmo da boca, um pouco de lado, sempre na mesma posição.
- **2 segundos de silêncio no começo** de cada arquivo (é com esse silêncio que eu limpo o ruído de fundo).
- Ler como está escrito dá o melhor sincronismo. Se trocar alguma palavra, avise qual.
- Errou? Repita a frase inteira no mesmo arquivo; eu corto.
- **Prazo: 17/11 até 12h**, para dar tempo de sincronizar e renderizar no mesmo dia.

Os arquivos ficam em `sources/video/global-solution/audio/pitch/`.

**Legenda da direção:** **negrito** = ênfase. `(pausa)` = respiro de meio segundo.

---

## Texto

**[f01] Slide 1 · A torneira seca · fala: John** (fundo Tinta escuro; as frases entram uma a uma; "60 horas" e "157 mil"
contam de zero; rodapé com a fonte: Jornal do Comércio, 2024)

**Direção:** grave e calmo, contando uma história. Pausa curta depois de cada frase do começo.

> Janeiro de 2024, Porto Alegre. (pausa) Um temporal comum derruba a luz. (pausa) Horas depois, sem nenhum
> aviso, a torneira seca. E fica seca: **dois dias e meio** depois, **cento e cinquenta e sete mil pessoas**
> seguem sem água.

**[f02] Slide 2 · Por que acontece · fala: João Pedro** (a cadeia se desenha em linha: temporal → luz → estação de bombeamento
→ água; cada elo acende na palavra)

**Direção:** explicativo, tom de "olha que simples". A frase da vivência sai mais pessoal.

> Isso acontece porque as estações que bombeiam água dependem de energia: sem luz, a água para. Parecem
> dois problemas, mas **um puxa o outro**. E um de nós, que é do Sul, já viveu algo assim.

**[f03] Slide 3 · Quem sofre · fala: João Pedro** (o morador do bairro no centro; em seguida, três destaques: pessoa acamada,
idoso, aparelho de saúde)

**Direção:** empático, sem dramatizar. Ênfase em "ainda dá tempo".

> Quem mora no bairro não sabe se o problema é só na sua casa, nem se **ainda dá tempo** de guardar água. E para
> quem cuida de um acamado, de um idoso ou de quem usa aparelho de saúde, essas horas pesam mais.

**[f04] Slide 4 · A prova nos dados · fala: Brenda** (160.210 conta de zero; o gráfico dos 46 bairros aparece e os 5
maiores acendem, com a barra de 52,3%; rodapé: Prefeitura de Porto Alegre, painel Áreas Afetadas, 2024;
análise da equipe)

**Direção:** confiante, de quem fez a conta. "Só cinco" é a virada da fala.

> E não é caso isolado. Na cheia de 2024, **cento e sessenta mil** moradores ficaram em área afetada. Dos
> quarenta e seis bairros atingidos, **só cinco** concentram mais da metade dessas pessoas. (pausa) O risco
> tem endereço.

**[f05] Slide 5 · Alertaí · fala: John** (logo entra; ao lado, take do celular: tela Início com a faixa verde e o
mapa)

**Direção:** a virada do vídeo; tom mais leve, um sorriso na voz. A pergunta é dita como o morador diria.

> Por isso criamos o **Alertaí**, um app que responde a uma pergunta: o que está acontecendo no meu bairro
> agora, e o que eu faço?

**[f06] Slide 6 · Como funciona · fala: Vinícius** (takes do celular: Reportar → toca em Falta de luz → Enviar; depois
Ocorrência com "Ainda está" e "Já voltou 0 de 3")

**Direção:** ágil, frases curtas, no ritmo dos toques na tela.

> Viu um problema? Relata em **dois toques**. Se o vizinho já relatou, o seu vira confirmação. Quando três
> pessoas avisam que voltou, o caso fecha. A comunidade é a principal fonte, sem sensor caro.

**[f07] Slide 7 · O efeito cascata · fala: Vinícius** (take do celular: Alerta em cascata, rolando pelo "Por que isso está
acontecendo"; depois a linha do tempo M25: luz cai → vizinho confirma → aviso sai → horas depois, água
falta, com o intervalo marcado "tempo para se preparar")

**Direção:** o momento mais importante do vídeo. Mais devagar. "Antes da torneira secar" sai baixo e firme.

> Esse é o nosso diferencial: o **efeito cascata**. Quando a falta de luz é confirmada no bairro de uma
> estação de bombeamento, o Alertaí avisa quem acompanha os bairros que ela abastece: **possível falta de
> água**. Com o porquê, o que fazer e para quem ligar. (pausa) Antes da torneira secar.

**[f08] Slide 8 · O protótipo · fala: Ana Larissa** (panorâmica no Figma: wireframes cinza → as mesmas telas em alta
fidelidade; depois o fluxo no computador; à direita, os quatro cuidados na ordem da fala: WCAG 2.1 AA,
cor sempre com ícone e texto, contraste, zoom de 200% sem perder conteúdo)

**Direção:** orgulho do trabalho, ritmo médio.

> Desenhamos sete telas do rascunho à alta fidelidade, tanto no celular quanto no computador, seguindo as
> diretrizes internacionais de acessibilidade. A informação nunca depende só da cor: sempre vem com o ícone
> e o texto, o contraste adequado para a leitura, e a letra pode **dobrar de tamanho** sem perder o conteúdo.

**[f09] Slide 9 · Como medir · fala: Brenda** (o indicador "antecedência do aviso" em destaque, com a meta "≥ 2 h";
abaixo, menores, "o alerta acertou?" e "a pessoa agiu?")

**Direção:** objetivo, de quem já pensou na métrica. "Duas horas" com ênfase.

> Como saber se funciona? O indicador central é a antecedência: quantas horas o aviso chega antes da água
> faltar. A meta: pelo menos **duas horas**. Também medimos se o alerta acerta e se as pessoas agem.

**[f10] Slide 10 · ODS e próximo passo · fala: Ana Larissa** (os ODS na ordem da fala, 13, 11, 3 e 6, cada um com a meta e a frase
dita: 13.1 e 13.3 "alerta precoce", 11.5 "cidades mais preparadas para desastres", 3.d "saúde de quem é mais vulnerável", 6.b "gestão da água"; depois o mapa dos 5 bairros do piloto e o Sarandi acendendo como "próximo")

**Direção:** visão de futuro, subindo um pouco o tom no final.

> Com isso, já atendemos quatro ODS. O treze e o onze pedem alerta precoce e cidades mais preparadas para
> desastres. O três protege a saúde de quem é mais vulnerável, e o seis, a comunidade participando da
> gestão da água. Começando por cinco bairros. O próximo é o **Sarandi**, o mais atingido em 2024.

**[f11] Slide 11 · Assinatura · fala: John** (logo; nomes da equipe na tela, sem narrar; "Global Solution 2026 ·
CitizenTech · 2SIOR")

**Direção:** fecho que responde à abertura. Pausa antes de "o aviso chega antes".

> Alertaí. Da próxima vez, (pausa) o aviso chega **antes**.

---

## Se passar de 2:55, corte nesta ordem

1. f06: "A comunidade é a principal fonte, sem sensor caro."
2. f04: "O risco tem endereço."
3. f10: "com alerta precoce," (o slide mostra a meta)

## Conferência dos fatos

| Frase | Fonte |
| --- | --- |
| Temporal de janeiro de 2024; 157,3 mil pessoas sem água mais de 60 h depois | TATSCH, Jornal do Comércio, 19/01/2024 |
| "Sem nenhum aviso, a torneira seca"; "dois dias e meio" = os mais de 60 h da reportagem | Documentação, seções 1 e 2.3; TATSCH, 2024 |
| Um integrante é do Sul e viveu algo assim | Documentação, seção 2.3 ("já passou por situações parecidas") |
| 160.210 moradores em área afetada na cheia de 2024 | Painel Áreas Afetadas, Prefeitura de Porto Alegre |
| 5 de 46 bairros concentram 52,3% | Planilha da Brenda, aba `Dados_Bairros` |
| Relato em dois toques; 3 "já voltou" encerram; relato repetido vira confirmação | Documentação, seção 5.1 |
| Sem sensor caro | Documentação, seção 4 |
| Sete telas; celular e computador; cor sempre com ícone e texto; contraste AA (menor razão 5,0:1) | Documentação, seções 9 e 14.1 |
| "A letra pode dobrar de tamanho sem perder o conteúdo" (zoom de 200%, WCAG 1.4.4) | Testado em 16/11 no protótipo em React: nada cortado nem fora da tela (capturas em `falas/transcricao/zoom200/`) |
| Antecedência com meta ≥ 2 h (I5); acerto do alerta (I6); ação depois do alerta (I8) | Documentação, seção 12.3 |
| ODS 13 (13.1 e 13.3), 11 (11.5), 3 (3.d) e 6 (6.b), cada um com a sua relação dita | Documentação, seção 13 |
| Piloto de 5 bairros; Sarandi como próximo e o mais atingido | Documentação, seções 3, 12.1 e 16.3 |
| "O risco tem endereço" (o problema se concentra em poucos bairros) | Documentação, seção 12.2 |

**Cuidado no slide do f04:** os 5 bairros que acendem (Sarandi, Menino Deus, Farrapos, Humaitá e Cidade
Baixa) **não são** os 5 do piloto. Nenhum texto do f04 ao f10 pode sugerir que o piloto alcança os 52,3%:
os bairros do piloto somam ~32,7 mil afetados (~20%).

**Fica de fora de propósito:** resultado do teste com usuários (os números da planilha são simulados),
push e SMS funcionando, cadastro funcionando.

## Onde cada pergunta do enunciado é respondida

| Pergunta do pitch | Bloco |
| --- | --- |
| Qual é o problema | f01, f02 |
| A quem a solução atende | f03 |
| Como funciona | f05, f06 |
| Qual é o diferencial | f07 |
| Que melhoria gera para o cidadão | f07 ("antes da torneira secar"), f03 |
| Mostrar o protótipo | f05 a f08 |
| Como o impacto será medido | f09 |
| ODS (pedido no desafio) | f10 |

## Tempo medido nas gravações (16/11)

| Áudio | Fala | Duração da fala |
| --- | --- | --- |
| joao.mp4 | f02 | 13,7 s |
| joao2.mp4 | f03 | 13,1 s |
| brenda.ogg | f04 | 13,3 s |
| vinicius.mp4 | f06 + f07 | 34,2 s |
| lari.mp4 | f08 | 15,7 s |
| brenda2.ogg | f09 | 13,3 s |
| lari2.mp4 | f10 | 19,1 s |
| (John, ainda não gravado) | f01, f05, f11 | 25 a 29 s, estimado |

**Total: 2:39**, ou 2:43 com o John 10% mais devagar, contando 12 s de troca de slide e de voz. Limite: 3:00.
A tabela abaixo é a estimativa por sílaba feita antes das gravações; vale a medida acima.

## Tempo (estimativa anterior)

Estimado por sílaba falada (número e sigla contados como se pronunciam), no ritmo medido de cada pessoa nas
gravações da Fase 3 e do EC-1. A Brenda não tem gravação anterior; usei o ritmo mais lento do grupo (o do
João). A coluna "10% mais devagar" é a margem para nervosismo ou leitura mais cuidadosa.

| Fala | Quem | Palavras | Sílabas | Tempo | 10% mais devagar |
| --- | --- | --- | --- | --- | --- |
| f01 | John | 37 | 72 | 14 s | 16 s |
| f02 | João Pedro | 36 | 60 | 14 s | 15 s |
| f03 | João Pedro | 43 | 68 | 15 s | 17 s |
| f04 | Brenda | 36 | 76 | 18 s | 20 s |
| f05 | John | 25 | 43 | 8 s | 9 s |
| f06 | Vinícius | 34 | 63 | 12 s | 13 s |
| f07 | Vinícius | 50 | 95 | 18 s | 20 s |
| f08 | Ana Larissa | 52 | 112 | 18 s | 20 s |
| f09 | Brenda | 36 | 69 | 16 s | 17 s |
| f10 | Ana Larissa | 54 | 112 | 18 s | 20 s |
| f11 | John | 8 | 16 | 3 s | 4 s |
| **Total** (mais 10 s de troca de slide e 2 s de troca de voz) | | **411** | **786** | **2:46** | **3:03** |
