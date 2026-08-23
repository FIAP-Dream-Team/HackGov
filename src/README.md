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
`npm run dev`/`npm run build` rodam antes um script (`scripts/generate-theme-css.mjs`) que lê
`docs/design/tokens.json` e gera `src/theme/tokens.generated.css`, um bloco `@theme { --color-green-500:
...; }`. O Tailwind v4 lê esse `@theme` e passa a gerar as classes de verdade a partir dele — então usa
`bg-green-500`, `text-blue-500`, `border-yellow-200` etc. normalmente, **nunca** `bg-[#1E8E63]` nem hex
solto num componente. Se o Vinícius mudar um tom no `tokens.json`, rodar `npm run generate:theme` (ou só
`npm run dev`, que já roda sozinho) atualiza o frontend inteiro.

**Cuidado com os extremos da escala.** `verde`, `azul`, `amarelo` e `vermelho` no `tokens.json` só têm os
degraus 100–900. O Tailwind por padrão também tem `green-50` e `green-950` (e equivalentes) — como a
gente não redefine esses dois extremos, usá-los pega a cor **padrão do Tailwind**, não a da marca, sem
aviso nenhum. Fica só entre 100 e 900 pra essas quatro famílias. `neutral` é a exceção: o token já cobre
50 a 950 inteiro, então essa está 100% coberta.

O arquivo gerado não é commitado (está no `.gitignore`) e não existe até a primeira vez que alguém rodar
`npm run dev` ou `npm run generate:theme` — é esperado o editor reclamar de import não encontrado antes
disso.

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
