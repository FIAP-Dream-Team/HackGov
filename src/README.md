# Protótipo — Minha Vez

Esqueleto de estrutura, sem lógica de negócio ainda.

## Backend (`backend/`)

Java 17, Spring Boot, banco H2 embarcado (não precisa instalar banco externo).

```bash
cd src/backend
mvn spring-boot:run
```

Sobe em `http://localhost:8080`. Console do H2 em `http://localhost:8080/h2-console`.

## Frontend (`frontend/`)

Vite + React + TypeScript, com React Router. Consome os tokens de design direto de
`docs/design/tokens.json`, sem duplicar cor.

```bash
cd src/frontend
npm install
npm run dev
```

Sobe em `http://localhost:5173`, com `/api` proxiado para o backend em `:8080`.

Rotas (nomes de pasta e componente em inglês, caminho de URL em português para bater com o
vocabulário do produto):

| Rota | Componente | O que é |
| --- | --- | --- |
| `/totem` | `routes/kiosk` | Totem da UBS: identificação e etapa do encaminhamento |
| `/acompanhar` | `routes/tracking` | Acompanhamento remoto — o eixo do produto |
| `/painel` | `routes/panel` | Painel público da sala de espera |
| `/equipe` | `routes/staff` | Canal web da equipe e do gestor |
