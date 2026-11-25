# Minha Vez · HackGov

**Minha Vez** é um sistema para o cidadão acompanhar o encaminhamento da UBS até a consulta com especialista, sem
precisar ligar nem ir até a unidade só para perguntar. É o projeto do Grupo 1 no **HackGov**, atividade da FIAP
sobre transformação digital da gestão pública, desenvolvido ao longo de 2026.

> Protótipo acadêmico. Não é um serviço oficial do SUS. Todos os dados usados nas telas são sintéticos.

## O problema

O encaminhamento do cidadão da UBS para a atenção especializada não pode ser acompanhado. Hoje ele vira papel,
ligação ou sistema paralelo, e quem espera não sabe em que pé está o pedido. Uma auditoria do TCU apontou a falta
de alimentação padronizada de dados no sistema do Ministério da Saúde como gargalo de visibilidade, e pesquisa do
Instituto Locomotiva indica que 94% dos brasileiros da Classe C acham que a espera no SUS coloca vidas em risco
(fontes citadas na documentação da Fase 1).

## A solução

Uma mesma informação, a etapa do encaminhamento, chega a quem precisa por quatro canais:

| Canal | Para quem | O que faz |
| --- | --- | --- |
| **Aplicativo** | Cidadão | Acompanha cada etapa, escolhe horário quando a unidade libera, reagenda e cancela |
| **Totem da UBS** | Cidadão na unidade | Consulta a etapa com Cartão SUS ou CPF, sem senha, com letra ampliada, leitura em voz e ajuda |
| **Painel da sala de espera** | Quem aguarda atendimento | Mostra a senha chamada em tempo real, sem nome nem dado clínico |
| **Canal da equipe** | Atendente e gestor da UBS | Fila por especialidade, ações pendentes, espera média e taxa de faltas |

## Situação do projeto

| Fase | Conteúdo | Situação |
| --- | --- | --- |
| Fase 1 | Diagnóstico, requisitos, backlog e dados | Entregue |
| Fase 2 | Backlog refinado, Sprint 1, UML, Java e protótipo de telas | Entregue |
| Fase 3 | Modelo lógico, formas normais, modelo físico e scripts SQL | Entregue |
| Fase 4 | Front-end em React, segurança da informação e reflexão sobre blockchain | Em andamento |

Na Fase 4, o backend Spring atende as cinco User Stories (US01 a US05) e o front-end React consome a API real em
todos os canais. Detalhes em [`docs/fase-4/`](docs/fase-4/).

## Como rodar

Requisitos: Java 17 ou mais recente, Maven e Node.js 20 ou mais recente.

Backend, em um terminal:

```bash
cd src/backend && mvn spring-boot:run
```

Front-end, em outro terminal:

```bash
cd src/frontend && npm install && npm run dev
```

Abrir **http://localhost:5173**. O backend sobe em `localhost:8080`, e o front repassa para ele tudo o que começa
com `/api`. Os dados ficam em memória: reiniciar o backend volta ao estado inicial.

Testes do backend:

```bash
cd src/backend && mvn test
```

### Logins de demonstração

Dados sintéticos, criados a cada vez que o backend sobe. A senha de todos é `minhavez`.

| Onde | Login | Situação |
| --- | --- | --- |
| `/acompanhar` | CPF `529.982.247-25` | Maria: encaminhamento recebido e triado |
| `/acompanhar` | CPF `123.456.781-43` | João: já pode escolher horário |
| `/acompanhar` | CPF `111.444.777-35` | Carlos: horário marcado |
| `/totem` | Cartão SUS `100 0000 0006 0018` | Maria, sem senha |
| `/equipe` | `atendente.centro` | Libera agendamento, chama senha, registra falta |
| `/equipe` | `gestor.centro` | Acompanha indicadores e conclui encaminhamentos |

A lista completa e o roteiro de demonstração estão em [`src/README.md`](src/README.md).

## Tecnologias

| Parte | Tecnologias |
| --- | --- |
| Backend | Java 17, Spring Boot 3.3, H2 (em memória), JUnit e MockMvc |
| Front-end | React 18, TypeScript, Vite 5, React Router, Tailwind CSS 4, Lucide |
| Modelagem | Oracle SQL Developer Data Modeler (modelos lógico e físico) |

## Segurança

O sistema aplica senha com hash e sal, limite de tentativas, sessão com validade, controle de acesso por canal e por
unidade, segregação de funções entre atendente e gestor, validação de entradas, minimização de dados pessoais e
proteção contra clickjacking. A justificativa de cada prática está em
[`docs/fase-4/parte-4-seguranca.md`](docs/fase-4/parte-4-seguranca.md).

## Documentação

| Assunto | Onde |
| --- | --- |
| Backlog, Sprint 1 e métricas (Fase 2) | [`docs/fase-2-parte-1-backlog-e-sprint-1.md`](docs/fase-2-parte-1-backlog-e-sprint-1.md) |
| UML e Java (Fase 2) | [`docs/fase-2-parte-2-uml-e-java.md`](docs/fase-2-parte-2-uml-e-java.md) |
| Protótipo e validação (Fase 2) | [`docs/fase-2-parte-3-prototipo-e-validacao.md`](docs/fase-2-parte-3-prototipo-e-validacao.md) |
| Modelo lógico (Fase 3) | [`docs/modelo-logico/modelo-logico.md`](docs/modelo-logico/modelo-logico.md) |
| Modelo físico (Fase 3) | [`docs/modelo-fisico/`](docs/modelo-fisico/) |
| Scripts SQL (Fase 3) | [`docs/scripts-sql/scripts-sql.md`](docs/scripts-sql/scripts-sql.md) |
| Contrato da API (Fase 4) | [`docs/fase-4/contrato-da-api.md`](docs/fase-4/contrato-da-api.md) |
| Protótipo em React (Fase 4) | [`docs/fase-4/parte-3-prototipo-react.md`](docs/fase-4/parte-3-prototipo-react.md) |
| Segurança da informação (Fase 4) | [`docs/fase-4/parte-4-seguranca.md`](docs/fase-4/parte-4-seguranca.md) |
| Proposta de IA (Enterprise Challenge) | [`docs/enterprise-challenge/proposta-ia-ciencia-de-dados.md`](docs/enterprise-challenge/proposta-ia-ciencia-de-dados.md) |
| Decisões do grupo | [`docs/decisoes.md`](docs/decisoes.md) |
| Tokens de design (cores) | [`docs/design/tokens.json`](docs/design/tokens.json) |

A coleção do Insomnia para testar a API está em [`docs/fase-4/insomnia/`](docs/fase-4/insomnia/).

## Estrutura do repositório

```
docs/            documentação de cada fase, decisões, modelos de dados e prints
src/backend/     API em Java com Spring Boot
src/frontend/    aplicação React (app, totem, painel, equipe e página inicial)
sources/         material de apoio (fotos do grupo, áudio dos vídeos)
```

## Grupo 1

| Integrante | RM |
| --- | --- |
| Ana Larissa Cristo Mendes | 567403 |
| Brenda Cristina Martins Araújo | 575032 |
| João Pedro Thethê Andrade | 568305 |
| John Vitor Silverio Pereira | 566968 |
| Vinícius Cardoso Junqueira | 566906 |

## Como o trabalho é acompanhado

O quadro fica no Linear, workspace `FIAP Dream Team`, time `Dream Team` (prefixo `DT`), project `HackGov`, com uma
milestone por parte de cada fase. Documento, dado e código ficam neste repositório; o Linear guarda só o estado de
execução. Decisões fechadas pelo grupo ficam em [`docs/decisoes.md`](docs/decisoes.md).

Regras de trabalho: documento e card em português, código em inglês; dado inventado é sempre rotulado como
sintético, e dado real vai com fonte (órgão, ano e link).
