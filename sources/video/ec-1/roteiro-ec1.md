# Roteiro de gravação · Enterprise Challenge, Atividade 1

Narração: **John**, sozinho. 10 slides, 652 palavras.

> **Gravado em 08/11/2026.** Este é o texto que foi lido. O que foi falado de diferente está em
> `remotion/src/data/ec-1/roteiro.json`, que é o que o vídeo usa para sincronizar (detalhes no
> `README.md`, "A gravação de 08/11/2026").

Tempo estimado no seu ritmo médio da Fase 3 (158 palavras/min): **4:21** com o encerramento. No seu ritmo
mais lento (139 palavras/min): **4:55**. O limite do enunciado é 5:00. Se a gravação passar disso, o
alinhamento avisa e o render não roda.

O texto abaixo é o mesmo de `remotion/src/data/ec-1/roteiro.json`. É desse arquivo que o vídeo tira a
posição de cada animação: o elemento entra na palavra que o cita. Ler como está escrito dá o melhor
sincronismo. Se trocar alguma palavra ao gravar, não tem problema, só me avise qual foi, que eu ajusto
o `roteiro.json`.

## Como gravar

- **Um arquivo só**, do começo ao fim: `sources/video/ec-1/audio.wav` (WAV, 44,1 ou 48 kHz). MP3 ou M4A
  também servem, que eu converto. Gravar em partes também funciona: mande `01.wav` … `10.wav`, que eu junto.
- **Pausa de um segundo entre os blocos** (cada `[f..]` é um slide). É nessa pausa que o slide troca.
- Errou? Pare, respire e **repita a frase inteira**. Eu corto a tentativa errada antes de alinhar.
- Fale para a câmera, sem pressa. O vídeo espera você: os tempos vêm da sua voz, não o contrário.
- O mesmo lugar e microfone da Fase 3 servem. O tratamento de voz se ajusta à gravação nova.

## Texto

**[f01] Slide 1 · Grupo** (capa verde; cada foto entra quando você diz o nome)

> Olá! Somos o Grupo 1 do HackGov. Eu sou o John, e comigo estão a Ana Larissa, o João Pedro, o Vinícius e
> a Brenda. Hoje vamos mostrar como a inteligência artificial e a ciência de dados entram no Minha Vez.

**[f02] Slide 2 · O problema público** (a linha sai da UBS, se parte em papel, ligação e sistema paralelo e não chega ao especialista)

> Primeiro, o problema. Quando a UBS encaminha um paciente para o especialista, o pedido vira papel,
> ligação ou sistema paralelo. Daí em diante, ninguém rastreia: o cidadão não sabe em que pé está, e o
> gestor não enxerga a fila. Falta um fluxo com dados padronizados, e uma auditoria do TCU já apontou isso
> como gargalo de visibilidade.

**[f03] Slide 3 · Por que resolver** (fundo escuro; o 94% conta de 0 a 94, a barra enche, um dos três bonecos “desiste”)

> E resolver isso importa, porque a espera custa saúde. Segundo o Instituto Locomotiva, 94% dos
> brasileiros da classe C acham que a espera no SUS coloca vidas em risco, e cerca de 1 em cada 3 já
> desistiu de uma consulta demorada. Quem mais perde são idosos e trabalhadores informais.

**[f04] Slide 4 · O Minha Vez** (print do app, os três canais e a regra RNF01)

> A nossa resposta é o Minha Vez, um sistema de gestão pública que acompanha o encaminhamento da UBS até a
> consulta especializada. Pelo app ou pelo totem, o cidadão vê a etapa do pedido e agenda o horário. O
> painel da sala de espera chama pela senha. E a equipe e o gestor veem a fila no painel web. Uma regra
> guia tudo: dado clínico nunca aparece nas telas públicas.

**[f05] Slide 5 · Onde a IA e os dados entram** (linha do encaminhamento: IA na origem, dados no fim, seta “volta”)

> Então, onde entram a IA e os dados? A IA ataca a origem da fila: a consulta, onde o encaminhamento
> nasce. Com dezenas de pacientes em poucas horas, detalhes importantes podem passar despercebidos. Essa é
> uma hipótese nossa, que vamos confirmar na UBS. E um encaminhamento incompleto volta, atrasa ou fica com
> a prioridade errada. Já a ciência de dados ataca o fim: o painel do gestor, que mostra a fila de hoje,
> mas não antecipa a de amanhã.

**[f06] Slide 6 · A ferramenta** (as 6 etapas se acendem uma a uma; anel amarelo na decisão do médico)

> A ferramenta é um assistente de documentação clínica. Não é um chatbot: quem usa é o médico. São seis
> etapas. Com o consentimento do paciente, a consulta é gravada. O reconhecimento de fala transcreve a
> conversa, e o áudio é apagado. Um modelo de linguagem monta o relatório e, depois, o rascunho do
> encaminhamento. Aí vem a única decisão do fluxo, e ela é humana: o médico confirma. Só então o
> encaminhamento nasce, em Recebido e Triado, e segue o fluxo do Minha Vez.

**[f07] Slide 7 · Como a IA entra no Minha Vez** (a câmera passeia pela tela do médico: fala → relatório → rascunho → confirmar)

> Na tela do médico, cada item do relatório aponta para o trecho da fala que o gerou. O rascunho usa o
> que o domínio já tem, a especialidade e o selo de urgência, e escreve a justificativa. Ao confirmar, o
> histórico de status registra quem confirmou e quando. Escolhemos esse ponto porque é onde o erro custa
> mais caro: um encaminhamento mal feito gera semanas de espera inútil. E sem criar mais um sistema
> paralelo.

**[f08] Slide 8 · Ciência de dados** (as linhas do gráfico se desenham, a previsão abre, o mapa de faltas desce)

> A ciência de dados trabalha sobre esses encaminhamentos, já estruturados e anonimizados. O painel do
> gestor passa a mostrar a demanda por especialidade, a previsão da fila e onde as faltas se concentram.
> Os números aqui são ilustrativos; a ideia é ver a especialidade que cresce antes de a espera explodir, e
> planejar vagas com dados.

**[f09] Slide 9 · Benefícios e desafios** (cada linha entra quando citada; “confiança excessiva” acende no fim)

> Os benefícios: o médico olha para o paciente em vez de digitar; o cidadão recebe um encaminhamento
> completo, com prioridade justa; a equipe tem menos retrabalho; e o gestor ganha dados padronizados. Os
> desafios: dado de saúde é sensível na LGPD, então há consentimento, áudio apagado e relatório só no
> canal institucional. A IA pode errar ou inventar um sintoma; por isso, cada item aponta para a fala. E
> ruído, sotaques e a estrutura das UBS pedem um piloto antes de ampliar. O maior risco é o médico assinar
> sem ler.

**[f10] Slide 10 · A IA não decide** (verde; as 5 regras entram uma a uma, depois “Obrigado!”)

> Por isso, a IA não diagnostica, não receita e não encaminha. Tudo entra como rascunho, nada vira
> encaminhamento sem o médico confirmar, ele pode editar ou recusar tudo, e, se a IA falhar, a consulta
> segue igual. A IA organiza a informação; quem decide é o médico. Obrigado!

## De onde vem cada afirmação

Tudo sai de `enterprise-challenge-proposta-ia-ciencia-de-dados.md`. Os números de pesquisa (94%, 1 em 3) são do
Instituto Locomotiva e o gargalo de visibilidade é da auditoria do TCU, as mesmas fontes das Fases 1 a 3.
Nenhuma das duas tem ano e link registrados no repositório: vale completar antes da entrega. O gráfico e o
mapa de faltas do slide 8 são **dados sintéticos**, rotulados assim no slide, com a premissa escrita. A tela
do médico (slide 7) é exemplo ilustrativo, sem paciente real.
