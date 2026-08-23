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

Vite + React + TypeScript, com React Router e Tailwind (v4, via `@tailwindcss/vite`, sem arquivo de
config — o Tailwind escaneia o projeto sozinho).

Estilização é por classe utilitária do Tailwind. Cor **não** é hex nem a paleta padrão do Tailwind —
`src/theme/applyTheme.ts` lê `docs/design/tokens.json` e grava cada cor como variável CSS
(`--color-green-500`, `--color-blue-500` etc.) na raiz do documento; as classes usam essas variáveis
via valor arbitrário, por exemplo `bg-[var(--color-green-500)]`. Se o Vinícius mudar um tom no
`tokens.json`, o frontend inteiro atualiza sozinho — não copiar hex direto num componente.

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
