# Protótipo — Minha Vez

Backend em Spring com as US01 a US05 e front em React consumindo a API real. O contrato está em
`docs/fase-4/contrato-da-api.md`.

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

### Organização do front

| Pasta | O que tem |
| --- | --- |
| `src/api/` | Cliente HTTP (`client.ts`) e um módulo por canal: `citizen.ts`, `staff.ts`, `panel.ts`. Tipos em `types.ts`, espelhando o contrato. Todo erro vira `ApiError` com o `codigo` e a `mensagem` do servidor. |
| `src/hooks/` | `useQuery` (leitura ao abrir a tela), `useAction` (envio de formulário) e `useForm` (validação por campo). Os estados são sempre `idle`, `loading`, `success` e `error`. |
| `src/session/` | Token do aplicativo e da equipe em `sessionStorage`. O totem guarda a sessão só em memória. |
| `src/lib/` | Validação de CPF, Cartão SUS, nascimento e senha com as mesmas regras do backend; formatação de data. |
| `src/components/ui/` | `Button`, `TextField`, `Alert`, `ErrorAlert`, `Toast`, `Card`, `Badge`, `EmptyState`, `Skeleton`, `StatusTrail` (trilha em etapas), `AppointmentTicket` (horário marcado), `NumericKeypad` (teclado do totem), `AppShell`. Ícones: `lucide-react`. |
| `src/lib/errors.ts` | Traduz cada `codigo` do contrato em título, explicação e dica. Ação concluída e sessão vencida avisam por toast; erro de formulário e de carregamento fica no lugar, com `ErrorAlert`. |
| `src/routes/` | Uma pasta por canal. |

### Roteiro de demonstração

Com o backend recém-subido, o encaminhamento sintético está em `RECEBIDO_TRIADO`. A ordem que mostra tudo:

1. `/painel` numa aba à parte. Fica esperando.
2. `/equipe`, login `atendente.centro`, senha `minhavez`. **Liberar agendamento**.
3. `/acompanhar`, CPF `529.982.247-25`, senha `minhavez`. **Escolher horário**, confirmar. Reagendar ou cancelar, se quiser mostrar.
4. `/equipe`, **Atualizar**, **Chamar senha** (ex.: `A12`, sala `2`). O painel muda na hora.
5. `/totem`, Cartão SUS `100 0000 0006 0018` ou CPF com nascimento `12/04/1988`. **Encerrar e limpar a tela**.

### Dados sintéticos de demonstração

Criados por `DadosSinteticos.java` a cada subida, cerca de 1 s depois de `Started BackendApplication` (o hash das senhas
leva esse tempo). Nomes inventados; CPFs gerados só para passar no dígito verificador. Senha de todos: `minhavez`.
Tudo fica em memória: reiniciar volta a este estado.

| Quem | Login | Encaminhamento |
| --- | --- | --- |
| Maria Andrade | CPF `529.982.247-25` ou Cartão SUS `100 0000 0006 0018` (nasc. 12/04/1988) | `MV-2026-0001` Cardiologia, recebido e triado |
| João Pedro Ribeiro | CPF `123.456.781-43` | `MV-2026-0002` Dermatologia, aguardando agendamento |
| Antônia Lima Dias | CPF `987.654.320-29` | `MV-2026-0003` Ortopedia, recebido e triado, urgente |
| Carlos Eduardo Souza | CPF `111.444.777-35` | `MV-2026-0004` Ortopedia, já agendado (dá para chamar no painel) |
| Lúcia Ferreira | CPF `246.813.579-28` | `MV-2026-0005` Dermatologia aguardando e `MV-2026-0006` Ortopedia em triagem |
| Pedro Henrique Lima | CPF `135.792.468-28` | nenhum (estado vazio) |
| Equipe, atendente | `atendente.centro` | UBS Centro |
| Equipe, gestor | `gestor.centro` | UBS Centro. Hoje vê e faz o mesmo que o atendente |

Não há falta nem encaminhamento concluído semeados: o domínio recusa agendamento no passado.

