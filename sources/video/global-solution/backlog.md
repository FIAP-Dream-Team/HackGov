# Backlog de edição · Vídeos da Global Solution (Alertaí)

Plano de produção dos dois vídeos da Global Solution 2026 (CitizenTech, 2SIOR). Dono: John (roteiro, slides
e vídeos). Montado em 16/11/2026 a partir de `sources/global-solution/recursos/` (principalmente
`Alertaí — Documentação do Projeto.md`) e do código em `sources/global-solution/global-solution-1-2026-main/`.

Cada item tem um ID, quem faz, do que depende e o que precisa existir para ser considerado pronto. Marque
`[x]` ao fechar. Quando o roteiro de edição (E3) existir, as listas provisórias de gravação (E5) e de motion
(E6) são reescritas com os tempos reais.

---

## 0. Prazos e prioridade

| Quando | O quê | Card no Linear |
| --- | --- | --- |
| **17/11 (ter)** | Os dois vídeos publicados como não listados | `DT-103` técnico, `DT-101` pitch |
| **18/11 (qua)** | Os dois `.txt` com os links e o ZIP enviado | `DT-104`, `DT-102`, `DT-105` |
| 19/11 | Prazo final da FIAP ON (folga, não plano) | — |

**Ordem de prioridade: vídeo técnico primeiro.** Ele vale nota; o pitch inscreve na competição, mas não
compõe a avaliação técnica. Se o tempo apertar, o pitch reaproveita os assets do técnico, não o contrário.

Plano por dia:

- **16/11 (hoje, noite):** E1 setup, E2 roteiros dos dois vídeos, início de E4 slides.
- **17/11 manhã:** E3 roteiro de edição, narração (E5.0), gravações de tela do técnico.
- **17/11 tarde:** motion do técnico, montagem no Premiere, publicar o técnico. Depois gravações e
  montagem do pitch; publicar à noite.
- **18/11:** folga para retoques, `.txt`, links no documento (seções 16.2 e 17) e ZIP.

---

## 1. Os dois vídeos, em uma tabela

| | Vídeo técnico (Entrega 2) | Pitch (Entrega 1) |
| --- | --- | --- |
| Duração | **até 2:00** (alvo 1:55) | **até 3:00** (alvo 2:50) |
| Palavras de narração | ~250 a 270 | ~380 a 400 |
| Para quem | Banca técnica da FIAP | Empresas parceiras |
| Vale nota | Sim | Não (competição) |
| Forma | **Demonstração na tela**: gravações de OBS do console, do banco e do código, narradas; motion só para os dois diagramas e alguns destaques | **Deck animado no Remotion**, no mesmo formato dos vídeos do HackGov (slides sincronizados com a narração), com takes curtos do app só nos pontos-chave |
| Linguagem | **Informal, de quem mostra a tela**: "aqui foi como a gente pensou o banco; decidimos separar ocorrência de alerta porque…" Primeira pessoa do plural, frases curtas, termo técnico dito e explicado na mesma frase | **Produto**: problema, pessoa, solução e impacto; frases de efeito com número e fonte |
| Montagem | Sequência própria no Premiere | Render no Remotion; o Premiere só junta trilha e acabamento, se precisar |
| Obrigatório mostrar | Java rodando; persistência (inserção, consulta, atualização); dados coletados, finalidade e tratamento; conceitos do curso com tela ou código; 1 ou 2 problemas técnicos com alternativas e solução | Problema; para quem; como funciona; diferencial; melhoria para o cidadão; protótipo; como o impacto será medido |

### Decisão D1 (recomendada, confirmar com o grupo): o que vai em cada vídeo

A Larissa pediu para "separar bem pra mostrar tudo". Em 2 minutos não cabe tudo; a separação abaixo cobre
cada pedido do grupo em um dos dois vídeos sem repetir.

| Pedido do grupo | Vai para | Por quê |
| --- | --- | --- |
| Prototipação no Figma (wireframes → alta fidelidade) | Pitch | Mostra a evolução da interface; o enunciado pede protótipo no pitch |
| Apresentação geral do app em pontos-chave (no celular) | Pitch | É o "como funciona" para o cidadão |
| Fluxo de usuário (no computador) | Pitch | É a jornada das 7 telas |
| Dados da Brenda (evidências e indicadores) | Pitch (evidência e impacto) + 1 frase no técnico (indicadores saem das tabelas) | O pitch precisa da evidência; o técnico precisa de "dados coletados e tratamento" |
| Código | Técnico | Item obrigatório "trechos de código" |
| Modelagem (arquitetura e modelo de dados) | Técnico | Item obrigatório "modelagem" |
| Java rodando + banco | Técnico | Item obrigatório |

### Decisão D3 (fechada pelo John em 17/11): takes do celular nos dois vídeos

Os clipes do celular (`bruto/celular/B20`…`B24`) saem na proporção nativa da tela, sem moldura, e servem
aos dois vídeos com usos diferentes: no **técnico**, o John encaixa no Premiere com *Fit*; no **pitch**, o
Remotion põe o mesmo arquivo dentro da moldura de celular das cenas s05 a s08.

### Decisão D2 (fechada pelo John em 16/11): quem narra

**Pitch: os cinco integrantes**, cada um no bloco da sua área (tabela em `roteiro-pitch.md`; falas
para mandar ao grupo, só com nome e fala, em `roteiro-pitch-grupo.md`). **Técnico: só o John.**

---

## 2. Regras de conteúdo (o que pode e o que não pode ser dito)

Toda frase do roteiro passa por esta lista antes de ser gravada.

**Números que podem ir para a narração, com fonte na tela:**

| Número | Fonte |
| --- | --- |
| 157,3 mil pessoas em 31 bairros sem água por mais de 60 h; 22 estações paradas (jan/2024, temporal sem cheia) | TATSCH, Jornal do Comércio, 2024 |
| 160.210 moradores em área afetada (12,0% da cidade), cheia de 2024, cota 5,35 m | Painel Áreas Afetadas, Prefeitura de POA; Censo 2022 |
| 5 bairros concentram 52,3%; 10 concentram 73,3% (de 46 bairros) | Análise da Brenda sobre o painel |
| Sarandi 26.042 e Menino Deus 18.231 afetados; Menino Deus com 65,2% dos moradores atingidos | Painel + Censo 2022 |
| Média 3.483 × mediana 1.371; desvio-padrão 5.465; CV 157%; r = 0,89 e r = 0,38 | Análise da Brenda |
| DMAE: falta de energia em 2 estações pode afetar 51 bairros (set/2022) | DMAE, 2022 |
| Guaíba 5,33 m em mai/2024, acima do recorde de 4,76 m de 1941 | MATOS, InfoMoney, 2024 |
| Mais de 79% de chance de El Niño forte até mar/2027 | Climate Prediction Center, 12/11/2026 |

**Não dizer, nem insinuar:**

- **Resultados do teste de usabilidade.** Os números de `coletadedados.md` (88,3% de sucesso, 3,8/5, 80%
  entenderam a cascata) são **simulados**. O documento oficial diz que o teste foi planejado e não aplicado.
  No vídeo: "o teste com moradores está planejado, com seis tarefas e meta de 4 de 5".
- Que o app envia push, SMS ou consulta a API do Guaíba. Não envia: o aviso fica gravado em `NOTIFICACAO`.
- Que existe cadastro com nome e celular funcionando. Está previsto; os três moradores da demo vêm do banco.
- Que ocorrências expiram sozinhas. `ExpiracaoService` está no diagrama e não no código.
- Que o protótipo em React usa dados reais. São simulados.
- "210 moradores": é erro de digitação na síntese de `coletadedados.md`. O número é 160.210.

**ODS do projeto:** 11 (meta 11.5), 13 (13.1 e 13.3), 3 (3.d) e 6 (6.b). Não usar o 7 nem o 10, que aparecem
só no rascunho da Brenda e saíram do documento final.

**Nome e pronúncia:** Alertaí ("alerta aí"). O pacote Java se chama `alertabairro` (nome antigo): se aparecer
na tela, não precisa explicar.

---

## 3. Fases

### E1 · Setup para rodar tudo no seu computador

**Estado em 16/11, 17h15: E1.1 a E1.5, E1.7 e E1.8 prontos e verificados pelo Claude.** O clone está em
`%USERPROFILE%\Documents\projects\global-solution-1-2026` (commit `633ae58`, 14/11). Maven 3.9.16 instalado
em `%USERPROFILE%\tools\apache-maven-3.9.16` e no PATH do usuário (terminais abertos antes disso não o
enxergam). O banco está **limpo** (0 tabelas), pronto para gravar a opção 1.

**Toda sessão de trabalho começa assim:** abrir o Docker Desktop, esperar ficar verde e rodar
`docker start alertai-oracle` (o container já existe; não precisa do `docker run` de novo).

**Dois detalhes que aparecem na tela:**
- A opção 1 imprime **"Tabelas criadas: 14"**: o contador conta os comandos do script (13 tabelas + 1
  índice). A narração diz "13 tabelas" e mostra a consulta B06, que lista as 13; não pôr zoom nesse 14.
- O horário sai certo (fuso de São Paulo) porque o container foi criado com `TZ=America/Sao_Paulo`. Sem isso
  ele sai em UTC, 3 h adiantado.

- [x] **E1.1 · Pegar a versão mais nova do repositório.** Clonado fora do HackGov, para não misturar
  `node_modules` e `target` neste repositório. A cópia em `sources/global-solution/global-solution-1-2026-main/`
  fica só para leitura.
- [x] **E1.2 · Subir o Oracle local no Docker.** O Docker Desktop fica em
  `%LOCALAPPDATA%\Programs\DockerDesktop`. Comando usado (só para recriar o banco do zero):
  ```
  docker rm -f alertai-oracle
  docker run -d --name alertai-oracle -p 1521:1521 -e TZ=America/Sao_Paulo -e ORACLE_PASSWORD=Alertai2026 -e APP_USER=alertai -e APP_USER_PASSWORD=alertai gvenzl/oracle-free:23-slim-faststart
  ```
  Fica pronto em ~20 s (`docker logs alertai-oracle` mostra `DATABASE IS READY TO USE!`).
- [x] **E1.3 · Criar o `.env`** na raiz do clone (o programa procura em `.env`, `backend/.env` e `../.env`):
  ```
  DB_URL=jdbc:oracle:thin:@//localhost:1521/FREEPDB1
  DB_USER=alertai
  DB_PASS=alertai
  ```
  O `.env` está no `.gitignore` do projeto e nunca entra no vídeo nem em commit.
- [x] **E1.4 · Compilar o backend.** `mvn -q package` dentro de `backend` gerou
  `backend/target/backend-0.1.0.jar` (7,3 MB, com o driver do Oracle dentro).
- [x] **E1.5 · Primeiro teste do console.** Ensaio completo feito em 16/11 com as teclas de E5.2: tudo saiu
  como descrito abaixo. As consultas de E5.3 também foram conferidas. Comando para você rodar: No Windows Terminal, dentro de `backend`:
  ```
  chcp 65001
  java -Dstdout.encoding=UTF-8 -jar target/backend-0.1.0.jar
  ```
  Opção 1 deve imprimir "Tabelas criadas" e "Bairros, tipos, pessoas e estacoes do piloto gravados".
  Rodar o roteiro de E5.2 inteiro uma vez e conferir que a cascata imprime
  `Aviso de agua para: Centro Historico, Menino Deus, Praia de Belas.` e `Notificacoes: 3.`
  (os bairros saem em ordem alfabética).
- [ ] **E1.6 · Cliente SQL para as consultas na tela.** Recomendado: DBeaver Community
  (`winget install dbeaver.dbeaver`), conexão Oracle `localhost:1521`, service `FREEPDB1`, usuário `alertai`.
  Alternativa: SQL Developer, que é o da disciplina. Fonte do editor em 18 a 20 pt para ficar legível em
  1080p. Senha: `alertai`. Abrir no cliente o arquivo `sql/consultas-gravacao.sql` desta pasta.
- [x] **E1.7 · Script de reset para regravar** (testado em 16/11: depois dele a cascata dispara de novo).
  Arquivo pronto: `sql/reset-demo.sql`. Depois da cascata, a estação fica `SEM_ENERGIA` e a cascata
  não dispara de novo (é a regra). Para refazer uma tomada sem recriar o container:
  ```sql
  DELETE FROM NOTIFICACAO; DELETE FROM ALERTA_BAIRRO; DELETE FROM ALERTA;
  DELETE FROM CONFIRMACAO; DELETE FROM OCORRENCIA;
  UPDATE ESTACAO_BOMBEAMENTO SET STATUS = 'OPERANDO';
  COMMIT;
  ```
  Os IDs voltam a começar em 1 porque o `Identificador` usa `MAX + 1`. Para regravar também a opção 1
  ("Tabelas criadas"), recriar o banco do zero: `docker rm -f alertai-oracle` e repetir E1.2 (~1 a 2 min).
- [x] **E1.8 · Rodar o protótipo em React.** Dependências instaladas. Para subir: dentro de `frontend`,
  `npm run dev -- --host`. No computador: `http://localhost:5173`. No celular, na mesma rede Wi-Fi:
  `http://192.168.18.11:5173` em 16/11 (o IP pode mudar; o terminal do Vite mostra o atual na linha
  `Network`). Os dados são simulados e voltam ao início ao
  recarregar a página, o que facilita regravar.
- [ ] **E1.9 · Acesso ao Figma.** Abrir o arquivo "Alertaí · Protótipo"
  (`https://www.figma.com/design/V8VN4hV6fPULl2ZnAh6Aet`), conferir as páginas Wireframes e Alta fidelidade e
  os fluxos "Alertaí · celular" e "Alertaí · computador" no modo Apresentar.
- [x] **E1.10 · Planilha da Brenda recebida** em `sources/global-solution/recursos/relatorio_teste_usabilidade.xlsx`
  (16/11). Conferir a aba `Dados_Bairros` no início de E2. Os PNGs das Figuras 1 a 5 não vieram; os gráficos
  serão refeitos no Remotion a partir da planilha. Sem a planilha não dá para animar o gráfico dos 10 bairros: o documento só
  traz os valores de Sarandi e Menino Deus. Até ela chegar, o motion usa só os números da seção 2 deste
  arquivo.

### E2 · Roteiro de falas do narrador

Saída: `sources/video/global-solution/roteiro-tecnico.md` e `roteiro-pitch.md`, cada um com falas
numeradas (`T01`, `T02`... e `P01`, `P02`...), contagem de palavras por fala e tempo estimado a 140
palavras por minuto.

**Direção definida pelo John em 16/11:** são dois roteiros e duas sequências separadas, cada um com a sua
linguagem (ver a linha "Linguagem" da tabela da seção 1).

- **Técnico:** fala de quem está com a tela aberta mostrando o que fez. "Aqui é o menu. Vou registrar uma
  falta de luz no Arquipélago…", "Aqui foi como a gente pensou o banco: decidimos separar ocorrência de
  alerta porque…". Cada fala é presa ao que está aparecendo naquele segundo; o roteiro diz o que a mão faz
  na tela em paralelo ao que a voz fala.
- **Pitch:** mesma estrutura dos vídeos do HackGov (deck animado e sincronizado com a narração no Remotion),
  com linguagem de produto. O app aparece só em takes curtos, nos pontos-chave.

**Estado em 16/11:** os dois roteiros estão escritos e aguardam a revisão do John:
`roteiro-tecnico.md` (260 palavras, 1:49 esperado, 1:59 no pior caso) e `roteiro-pitch.md` (389 palavras,
2:39 esperado, 2:55 no pior caso). Revisados em 16/11 contra a documentação, a planilha, o código e o
protótipo; tempo estimado por sílaba no ritmo medido de cada pessoa (`scripts/minutagem.py`). As
tabelas abaixo foram a proposta inicial; o texto final está nos arquivos.

- [ ] **E2.1 · Roteiro do vídeo técnico** (Claude escreve, John revisa). Estrutura proposta:

  | Bloco | Tempo | O que a fala cobre | Imagem dominante |
  | --- | --- | --- | --- |
  | T1 Abertura | 0:00–0:08 | O que o sistema faz em uma frase: relato, confirmação, aviso de água | Motion |
  | T2 Modelagem | 0:08–0:25 | Camadas (menu → serviço → DAO → `ConnectionFactory` → Oracle); 13 tabelas; ocorrência ≠ alerta | Motion do diagrama |
  | T3 Java rodando | 0:25–0:55 | Relato 1; relato 2 vira confirmação; cascata avisa 3 bairros | Console (OBS) |
  | T4 Persistência | 0:55–1:15 | Inserção em `OCORRENCIA`, `UPDATE` da estação, `ALERTA` e `NOTIFICACAO`; três "já voltou" encerram | Cliente SQL (OBS) |
  | T5 Dados e tratamento | 1:15–1:25 | O que é coletado, para quê; autor nunca aparece; `PreparedStatement`; `.env` | Motion |
  | T6 Conceitos do curso | 1:25–1:40 | OO com validação no construtor; enums ↔ `CHECK`; coleções e `DISTINCT`; JDBC e `Transacao` | IntelliJ (OBS) + motion de código |
  | T7 Desafios | 1:40–1:55 | P1 relato duplicado; P2 aviso repetido: alternativas e a trava no `UPDATE ... WHERE STATUS = 'OPERANDO'` | Motion + console |
  | T8 Fecho | 1:55–2:00 | Logo, repositório | Motion |

  Pronto quando: soma ≤ 270 palavras; cada item obrigatório do enunciado (seção 1) está numa fala
  identificada; nenhuma frase viola a seção 2.
- [ ] **E2.2 · Roteiro do pitch** (Claude escreve, John revisa). Estrutura proposta:

  | Bloco | Tempo | O que a fala cobre | Imagem dominante |
  | --- | --- | --- | --- |
  | P1 Gancho | 0:00–0:18 | Jan/2024: temporal comum, 157,3 mil sem água por 60 h; a torneira seca sem aviso | Motion (cadeia temporal → luz → água) |
  | P2 Problema e público | 0:18–0:40 | Porto Alegre; quem sofre mais (acamados, idosos, aparelhos de saúde); como o grupo chegou ao problema | Motion |
  | P3 Evidência | 0:40–1:00 | 160.210 afetados; 5 bairros = 52,3%; piloto de 5 bairros já alcança boa parte do risco | Motion dos dados |
  | P4 Como funciona | 1:00–1:35 | Relato em 2 toques; vizinhos confirmam; 3 "já voltou" encerram; mapa e painel | Celular (app) |
  | P5 Diferencial | 1:35–2:00 | Efeito cascata: a luz cai na estação, os bairros que ela abastece são avisados antes | Celular + motion |
  | P6 Fluxo e protótipo | 2:00–2:20 | Wireframes → alta fidelidade no Figma; jornada das 7 telas; acessibilidade WCAG AA | Computador (Figma e app) |
  | P7 Impacto e ODS | 2:20–2:42 | Indicador central I5 (antecedência ≥ 2 h); I6; ODS 11.5, 13.1, 3.d, 6.b | Motion |
  | P8 Fecho | 2:42–2:50 | Próximo passo (Sarandi), equipe, logo | Motion |

  Pronto quando: soma ≤ 400 palavras; responde às cinco perguntas do enunciado do pitch; nenhuma frase
  viola a seção 2.
- [ ] **E2.3 · Leitura em voz alta cronometrada** (John). Ler cada roteiro uma vez com cronômetro. Se passar
  de 1:55 ou 2:50, cortar no texto, não na edição.
- [ ] **E2.4 · OK do grupo** (opcional, mandar no WhatsApp com prazo de 1 h). Sem resposta, segue.

### E3 · Roteiro de edição

Saída: `sources/video/global-solution/edicao-tecnico.md` e `edicao-pitch.md`. Uma linha por corte:

| Fala | Tempo na narração | Trilha V1 (base) | Trilha V2 (sobreposição) | Asset | Transição | Observação |
| --- | --- | --- | --- | --- | --- | --- |

**Estado em 16/11, 19h:** `edicao-tecnico.md` (timeline do Premiere) e `edicao-pitch.md` (mapa de cenas e
âncoras do Remotion) escritos. Deck em `deck/alertai.html`: sistema visual e 3 cenas de amostra (s01, s04,
s07, PNGs em `deck/export/`). Identidade aprovada pelo John; revisão anti-template feita em 16/11 (regras no
topo do HTML). Verificador de layout em `deck/check-layout.js`: `node scripts/deck.mjs` só exporta se nenhum
texto se sobrepuser ou encostar em outro.

**Estado em 16/11, 20h30:** as 11 cenas do pitch estão prontas em `deck/alertai.html` (PNGs e folha de
contato `contato.png` em `deck/export/`), passando no verificador. Coesão: abertura e fecho em Tinta, a
virada (s05) em Jacarandá, o resto em Pétala; celular sempre no mesmo lugar; as mesmas marcas para luz,
estação e água em s02, s07 e s09; o mapa do app no s10. Próximo: base do Remotion (E6.0) e motions do técnico.

- [ ] **E3.1 · Edição do técnico** (Claude, a partir de E2.1). Regra de ritmo: nenhum plano parado por mais de
  6 s; console e SQL alternam com motion a cada fala; ao mostrar texto do console, um callout (V2) aponta a
  linha que a narração está dizendo.
- [ ] **E3.2 · Edição do pitch** (Claude, a partir de E2.2). O pitch é montado como os vídeos do HackGov: o
  deck animado é a base, cada entrada e cada corte ancorados numa palavra da narração
  (`scene-map.json`/`reveals.json`, como na Fase 3), e os takes do app entram dentro de moldura de celular ou
  de navegador como cenas do próprio deck. Aqui o roteiro de edição é o mapa de cenas, não uma timeline do
  Premiere.
- [ ] **E3.3 · Ajuste aos tempos reais** depois da narração (E5.0): transcrever com o
  `scripts/fase-3/transcribe.py` já existente, trocar os tempos estimados pelos medidos e reescrever as
  durações de cada asset de E6.

### E4 · Slides com a identidade do Alertaí

Os slides são a fonte dos motions: cada asset de E6 nasce de um slide. Eles **não** são exigidos na entrega da
GS, mas o PDF pode ir no ZIP como "outros registros úteis".

**Sistema visual** (vem do arquivo "Alertaí · Protótipo" e de `frontend/src/styles/tema.css`):

| Item | Valor |
| --- | --- |
| Jacarandá (primária) | `#5B3FA8` |
| Folha (cascata, foco) | `#27704C` |
| Tinta (texto, fundo escuro) | `#221B33` |
| Pétala (fundo claro) | `#F6F3FB` |
| Lilás suave | `#ECE6F8` |
| Água no mapa | `#E0D9F1` |
| Acento do logo (só decorativo, nunca texto) | `#9B7FE0` |
| Severidade | Atenção `#F2C230`, Perigo `#E8731C`, Grande perigo `#C62828`, Resolvido `#2E7D4F`, sempre com a palavra escrita |
| Títulos | Sora |
| Texto | Figtree |
| Logo | `sources/global-solution/Logo · Alertaí.svg`; variantes em `docs/marca/` do repositório |

Restrições que valem aqui (as mesmas que aprovaram o deck da Fase 3): espaço em múltiplos de 8; um raio só;
sem cartão com sombra suave em tudo; sem faixa colorida na borda; sem pílula decorativa (selo só onde é
severidade de verdade, como no app); sem rótulo em caixa alta espaçada sobre todo título; contraste AA, que é
o próprio discurso do produto.

- [ ] **E4.1 · Baixar Sora e Figtree** (OFL) para `sources/video/global-solution/deck/fonts/` e
  `sources/video/remotion/public/gs/fonts/`. Fonte do Google carregada pela rede cai em fonte reserva no
  Chrome headless (armadilha já paga na Fase 3).
- [ ] **E4.2 · Deck HTML 1920×1080** em `sources/video/global-solution/deck/alertai.html`, um slide por bloco
  de roteiro (T1–T8 e P1–P8; os que se repetem entre os vídeos são um slide só). Claude monta, John aprova.
- [ ] **E4.3 · Exportar PNG e PDF** do deck (`deck/export/`). Pronto quando John aprovar o visual em tela
  cheia.

### E5 · Narração e gravações de tela (OBS)

**Padrão para todo material bruto:** 1920×1080, 30 fps, sem notificações (Assistente de foco ligado), barra
de tarefas escondida, cursor visível, mouse devagar. No OBS: tela base e saída em 1920×1080, 30 fps, gravação
em MKV com remux para MP4 no fim (não perde o arquivo se o OBS travar), qualidade de gravação alta (CQP/CRF
16 a 18). Uma cena por fonte: "Terminal", "SQL", "IntelliJ", "Navegador", "Figma". Gravar cada tomada com 2 s
parado antes e depois.

**Nomes dos arquivos:** `sources/video/global-solution/bruto/<vídeo>-<ID>-<descrição>-t<tomada>.mp4`, por
exemplo `tec-B03-cascata-console-t2.mp4`.

- [ ] **E5.0a · Narração do técnico** (John, Audition), **depois** das gravações de tela, assistindo ao bruto.
  WAV 48 kHz, 24 bits, mono, sala sem eco, uma fala por trecho com 1 s de silêncio. Saída:
  `audio/tecnico.wav`.
- [ ] **E5.0b · Narração do pitch** (os cinco). **16/11, 22h:** chegaram João (f02, f03), Brenda (f04, f09),
  Vinícius (f06+f07) e Larissa (f08, f10, reescritas por ela) em `falas/`; transcritas e comparadas em
  `falas/transcricao/transcricao.json` (`scripts/transcrever-falas.py`). Faltam as do John (f01, f05, f11). John manda hoje no grupo as mensagens de
  `roteiro-pitch-grupo.md`; cada um grava toda a sua parte num arquivo só e devolve até **17/11, 12h**.
  Saída: `audio/pitch/<nome>.*`, que eu separo nos blocos f01…f11. Vozes de cinco microfones diferentes: o tratamento casa o volume e o timbre
  pessoa a pessoa, como na Fase 3.

**Preparação do terminal (uma vez):** perfil do Windows Terminal "Alertaí" com fundo `#221B33`, texto
`#F6F3FB`, cursor `#9B7FE0`, fonte monoespaçada em 20 pt, janela maximizada. O console do Java não tem acento
de propósito; o `chcp 65001` corrige só o "Alertaí" do título.

**Lista provisória de gravações do técnico** (os números entre parênteses são o que se digita no menu num
banco recém-criado: bairros 1 Menino Deus, 2 Praia de Belas, 3 Centro Historico, 4 Arquipelago, 5 Bom Jesus;
tipos 1 Falta de luz … 6 Granizo; pessoas 1, 2 e 3 = Morador 1, 2 e 3):

- [ ] **E5.1 · B01 Console: aplicar o script num banco vazio.** Container recém-criado (E1.7). Abrir o jar,
  opção `1`. Mostra "Tabelas criadas" e o catálogo do piloto. → bloco T3.
- [ ] **E5.2 · B02 a B05 Console: a demo completa, numa tomada só** (cortar em pedaços na edição):
  1. **B02 Relato 1:** `2` → tipo `1` (Falta de luz) → bairro `4` (Arquipelago) → pessoa `1` → severidade `3`
     → descrição "Caiu a luz na rua toda". Mostra "Ocorrencia gravada", Confirmacoes 1. → T3
  2. **B03 Relato 2 vira confirmação e dispara a cascata:** `2` → `1` → `4` → pessoa `2` → `3` →
     "Aqui tambem ficou sem luz". Mostra "Relato entrou na ocorrencia ativa", Confirmacoes 2, "Estacao ETA
     Arquipelago sem energia", "Aviso de agua para: Centro Historico, Menino Deus, Praia de Belas",
     "Notificacoes: 3". **É o plano principal do vídeo.** → T3 e T7 (P1)
  3. **B04 Terceira confirmação não repete o aviso:** `4` → bairro `4` → a ocorrência → `1` (Ainda esta) →
     pessoa `3`. Mostra Confirmacoes 3 e **nenhuma** linha de aviso. → T7 (P2)
  4. **B05 Três "já voltou" encerram:** `4` → `4` → ocorrência → `2` (Ja voltou) → pessoa `1`; repetir com as
     pessoas `2` e `3`. Na terceira: Status RESOLVIDA e "Encerrada em". → T4
  5. Depois do passo 4, opção `3` → bairro `4`: "Nenhuma ocorrencia ativa em Arquipelago" (a consulta do
     próprio Java). → fecho do vídeo

  **Ordem de gravação (vale para a continuidade do vídeo):** passos 1 e 2 → **pausa no console e grave o
  E5.3 no DBeaver** → volte ao console para os passos 3, 4 e 5. Assim a ocorrência aparece no banco com 2
  confirmações, igual ao T05, e o caso anda sempre para a frente.
- [ ] **E5.3 · B06 a B10 Cliente SQL: persistência fora do programa.** Gravar entre os passos 2 e 3 de E5.2
  (estação já sem energia, ocorrência ATIVA com 2 confirmações). Uma consulta por tomada, resultado em grade:
  ```sql
  -- B06 · as 13 tabelas que o script criou
  SELECT table_name FROM user_tables ORDER BY table_name;

  -- B07 · inserção: o relato gravado, sem o nome de quem relatou
  SELECT o.id_ocorrencia, t.nome AS tipo, b.nome AS bairro, o.status, o.confirmacoes, o.criada_em
    FROM ocorrencia o JOIN tipo_ocorrencia t ON t.id_tipo = o.id_tipo
                      JOIN bairro b ON b.id_bairro = o.id_bairro;

  -- B08 · atualização feita pela cascata: a estação mudou de status
  SELECT nome, tipo, status FROM estacao_bombeamento ORDER BY id_estacao;

  -- B09 · o aviso gerado e para onde foi
  SELECT a.id_alerta, a.origem, a.titulo, a.id_ocorrencia_origem,
         (SELECT COUNT(*) FROM notificacao n WHERE n.id_alerta = a.id_alerta) AS notificacoes
    FROM alerta a;
  SELECT b.nome FROM alerta_bairro ab JOIN bairro b ON b.id_bairro = ab.id_bairro ORDER BY b.nome;

  -- B10 · dado vira indicador (I2, taxa de resolvidas), com os dados da demo
  SELECT COUNT(*) AS registradas,
         SUM(CASE WHEN status = 'RESOLVIDA' THEN 1 ELSE 0 END) AS resolvidas,
         ROUND(100 * SUM(CASE WHEN status = 'RESOLVIDA' THEN 1 ELSE 0 END) / COUNT(*), 1) AS taxa_pct
    FROM ocorrencia;
  ```
  B10 só entra se couber no tempo; se entrar, a tela diz "dados da demonstração". → T4 e T5
- [ ] **E5.4 · B11 a B14 IntelliJ: trechos de código.** Modo Apresentação (*View → Appearance → Enter
  Presentation Mode*), tema escuro, rolagem devagar até o trecho e parada de 3 s:
  - B11 `model/Ocorrencia.java`: o construtor que recusa valor incoerente. → T6 (OO)
  - B16 `view/MenuPrincipal.java` (`List<Bairro>` montando a escolha) ou `dao/UsuarioBairroDAO.java` (o
    `SELECT DISTINCT`). → T08 (listas)
  - B12 `model/StatusEstacao.java` lado a lado com o `CHECK` de `ESTACAO_BOMBEAMENTO` no
    `alerta_bairro.sql`. → T6 (enums)
  - B13 `service/OcorrenciaService.java`, método `registrar`: a busca da ativa na janela e o `agrupada`. → T7 (P1)
  - B14 `dao/EstacaoDAO.java`, método `marcarSemEnergia`: o `UPDATE ... WHERE STATUS = 'OPERANDO'`. → T7 (P2)
- [ ] **E5.5 · B15 Estrutura do projeto** no IntelliJ: árvore `model / dao / service / view` expandida. → T2

**Lista provisória de gravações do pitch:**

- [ ] **E5.6 · B20 a B24 Celular: o app em pontos-chave.** Gravador de tela do próprio celular, abrindo o
  React pela rede (E1.8), modo Não Perturbe ligado. Uma tomada por ponto:
  - B20 Início: faixa verde da cascata, nível do Guaíba, mapa resumido. → P4
  - B21 Reportar em dois toques: tipo → Enviar → cai na Ocorrência. → P4
  - B22 Ocorrência: "Ainda está" e "Já voltou", contadores, linha do tempo. → P4
  - B23 Alerta em cascata: o porquê passo a passo, o que fazer, contatos (199, 156). → P5
  - B24 Meus bairros: apelido "casa da mãe", "Texto maior" ligado e desligado. → P6 (acessibilidade)
- [ ] **E5.7 · B25 Computador: o fluxo do usuário de ponta a ponta.** Figma, modo Apresentar, fluxo "Alertaí ·
  computador": Início → Reportar → Ocorrência → Mapa (camada Efeito cascata) → Painel do bairro. Uma tomada
  contínua de ~40 s; a edição usa trechos. → P6
- [ ] **E5.8 · B26 Figma: dos wireframes à alta fidelidade.** Canvas com a interface escondida (`Ctrl + \`):
  panorâmica lenta pelas 7 telas da página Wireframes, depois a mesma panorâmica na página Alta fidelidade. → P6
- [ ] **E5.9 · B27 Teclado e foco** (opcional): no navegador do computador, Tab pelo app mostrando o contorno
  verde e o "Pular para o conteúdo". Usar um perfil do Chrome **sem extensões** (a LocatorJS já quebrou o
  contraste uma vez). → P6

### E6 · Motion no Remotion, a partir dos slides

Cada asset é uma composição própria no projeto `sources/video/remotion/`, em `src/gs/`, com os tokens de E4 e
as fontes locais. Todos em 1920×1080 a 30 fps, sem áudio. Assets de tela cheia saem em H.264 (CRF 16);
sobreposições (callouts, legendas de fonte, molduras) saem em ProRes 4444 com transparência
(`--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le`). Saída em
`sources/video/global-solution/motion/<ID>.mov|.mp4`.

**Como cada asset é produzido:** um subagente por asset recebe (1) o slide de origem em PNG, (2) a fala exata e
a duração medida em E3.3, (3) a regra de E4 e (4) este item do backlog. Ele cria a composição, renderiza um
still de conferência no meio da animação e o vídeo. John aprova pelo still; só então o próximo lote sai.

- [ ] **E6.0 · Base do motion** (Claude, antes dos subagentes): pasta `src/gs/`, `tokens.ts` com a paleta,
  carregamento de Sora e Figtree, componentes comuns (título, legenda de fonte no rodapé, moldura de celular,
  moldura de navegador, callout que aponta uma linha) e registro no `Root.tsx`. Pronto quando
  `npx remotion still` de uma composição de teste sair com as fontes certas.

**Lista provisória de assets do técnico:**

| ID | Fala | O que anima | Saída |
| --- | --- | --- | --- |
| M01 | T1 | Logo Alertaí entra; a cadeia temporal → luz → estação → água se desenha em linha | Tela cheia |
| M02 | T2 | Diagrama de camadas monta de cima para baixo; `ExpiracaoService` aparece com a marca "previsto" | Tela cheia |
| M03 | T2 | Modelo de dados: as 13 tabelas, destaque em `OCORRENCIA` × `ALERTA` e nas duas ligações da estação (`ID_BAIRRO` e `ESTACAO_BAIRRO`) | Tela cheia |
| M04 | T3 | Callouts sobre o console: "relato 1", "relato 2 → confirmação", "cascata" | Sobreposição |
| M05 | T3/T7 | Mapa estilizado dos 5 bairros: Arquipélago perde a luz, seta tracejada leva o aviso a Menino Deus, Praia de Belas e Centro Histórico; Bom Jesus (drenagem) fica de fora | Tela cheia |
| M06 | T4 | "Inserção · Consulta · Atualização" marcando cada consulta SQL na hora em que ela aparece | Sobreposição |
| M07 | T5 | Tabela dado → finalidade → tratamento (nome e celular, bairros seguidos, relatos, confirmações) | Tela cheia |
| M08 | T6 | Trecho de código ampliado com realce de linha (enum ↔ `CHECK`; `PreparedStatement`; `Transacao`) | Tela cheia |
| M09 | T7 | Problema 1: duas linhas viram uma; alternativas riscadas (índice único, fundir depois); solução no serviço | Tela cheia |
| M10 | T7 | Problema 2: três avisos viram um; alternativas riscadas; a trava no `UPDATE` | Tela cheia |
| M11 | T8 | Fecho: logo, link do repositório, "Global Solution 2026 · CitizenTech · 2SIOR" | Tela cheia |

**Lista provisória de assets do pitch** (M01, M05 e M11 se reaproveitam):

| ID | Fala | O que anima | Saída |
| --- | --- | --- | --- |
| M20 | P1 | "157,3 mil pessoas · 60 horas sem água", contador, legenda da fonte | Tela cheia |
| M21 | P2 | Quem é afetado: morador do bairro; em destaque acamados, idosos, quem depende de aparelho de saúde | Tela cheia |
| M22 | P3 | 160.210 afetados; barra de concentração 5 bairros = 52,3%, 10 = 73,3% (com a planilha da Brenda: os 10 bairros) | Tela cheia |
| M23 | P3 | Sarandi × Menino Deus: afetados, % do bairro, densidade | Tela cheia |
| M24 | P4 | Moldura de celular para B20–B24, com legenda do ponto-chave ao lado | Sobreposição |
| M25 | P5 | Linha do tempo: luz cai → vizinho confirma → aviso sai → (horas depois) água falta; o intervalo marcado como "tempo para se preparar" | Tela cheia |
| M26 | P6 | Moldura de navegador para B25–B27 | Sobreposição |
| M27 | P6 | Os 4 cuidados de acessibilidade mais visíveis (contraste AA, cor nunca sozinha, texto maior, alvos de 44 px) | Tela cheia |
| M28 | P7 | Indicadores I5 e I6 com meta; ODS 11, 13, 3 e 6 com a meta de cada um | Tela cheia |
| M29 | Geral | Legenda de fonte no rodapé ("Fonte: Jornal do Comércio, 2024") | Sobreposição |

### E7 · Montagem no Premiere

- [ ] **E7.1 · Projeto e sequências.** Projeto `sources/video/global-solution/premiere/alertai.prproj`, duas
  sequências 1920×1080, 30 fps, áudio 48 kHz: `TECNICO` e `PITCH`. Pastas: Narração, Bruto, Motion, Trilha.
- [ ] **E7.2 · Narração primeiro**, fala a fala, com marcadores nomeados pelo ID da fala (T01, P01...).
- [ ] **E7.3 · Corte pelo roteiro de edição** (E3): V1 bruto ou motion de tela cheia; V2 sobreposições. Telas de
  console e SQL com zoom de 110 a 130% na linha que a fala cita.
- [ ] **E7.4 · Trilha** baixa sob a voz (−20 a −24 dB abaixo da narração), sem letra, com licença livre.
  Anotar a fonte da música.
- [ ] **E7.5 · Áudio final:** −14 LUFS integrado, pico real ≤ −1 dBTP (padrão do YouTube).
- [ ] **E7.6 · Conferência antes de exportar:** técnico ≤ 2:00 e pitch ≤ 3:00 contados no timecode final;
  cada item obrigatório da seção 1 aparece; nenhuma frase viola a seção 2; nenhum nome de morador ou senha em
  tela.
- [ ] **E7.7 · Exportar** H.264, 1920×1080, 30 fps, VBR 2 passadas 16 a 20 Mbps, AAC 320 kbps. Saída em
  `sources/video/global-solution/final/alertai-tecnico.mp4` e `alertai-pitch.mp4`.

### E8 · Publicação e entrega

- [ ] **E8.1 · Publicar no YouTube** como não listado, um vídeo por vez, técnico primeiro. Título:
  "Alertaí · Vídeo técnico · Global Solution 2026 (2SIOR)" e "Alertaí · Pitch · Global Solution 2026
  (2SIOR)". Abrir o link numa aba anônima para conferir que toca sem login. → `DT-103`, `DT-101`
- [ ] **E8.2 · Arquivos `.txt`** com um link cada: `link-video-tecnico.txt` e `link-video-pitch.txt`. →
  `DT-104`, `DT-102`
- [ ] **E8.3 · Links no documento:** seção 17 (os dois links, sua parte) e avisar o João para escrever o
  parágrafo da seção 16.2 ("o que foi apresentado no pitch e no vídeo técnico").
- [ ] **E8.4 · Mandar ao grupo** os dois links e os dois `.txt`; o ZIP é de quem cadastrou o grupo na
  plataforma. → `DT-105`
- [ ] **E8.5 · Linear:** mover `DT-101` a `DT-104` para Done quando cada um fechar. Mexer no Linear segue a
  skill `linear-workflow` (pedir o OK antes de alterar card).

---

## 4. Pendências fora do seu controle

| O quê | De quem | Bloqueia |
| --- | --- | --- |
| D1: divisão do conteúdo entre os vídeos | Grupo (padrão: a proposta da seção 1) | Nada; segue com o padrão |
| D2: quem narra | John (padrão: John narra tudo) | E5.0 |
| Parágrafo da seção 16.2 | João | Só o ZIP |
