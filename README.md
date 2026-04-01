# Sistema IPA — Indice de Potencial de Automacao

Sistema web para avaliacao e priorizacao de processos governamentais com potencial de automacao, usando uma metodologia estruturada de pontuacao (IPA).

---

## Visao Geral da Arquitetura

```
potencial-automacao-api/
├── apps/
│   ├── frontend/          # Angular 19 (Standalone, Signals, OnPush)
│   └── api/               # NestJS + TypeORM + SQLite
├── libs/
│   └── shared/            # Tipos, DTOs e logica de calculo IPA compartilhados
├── Dockerfile             # Multi-stage: build → api + frontend (nginx)
├── docker-compose.yml     # Orquestra api (3000) + frontend (80)
└── nginx.conf             # Proxy /api/ → api:3000, SPA fallback
```

**Stack:**
- Frontend: Angular 19, Angular Material, Chart.js, Signals
- Backend: NestJS, TypeORM, SQLite (better-sqlite3), JWT
- Monorepo: Nx 21
- Testes: Vitest (unitario), Playwright (E2E), Jest (api)

---

## Como Rodar em Desenvolvimento

### Pre-requisitos

- Node.js 22+
- npm

### Instalar dependencias

```bash
npm install
```

### Rodar API (porta 3000)

```bash
npx nx serve api
```

### Rodar Frontend (porta 4200)

```bash
npx nx serve frontend
```

> Na primeira execucao com banco vazio, a API executa o seed automaticamente com dados de exemplo.

Acesse: [http://localhost:4200](http://localhost:4200)

---

## Como Rodar com Docker

### Pre-requisitos

- Docker e Docker Compose instalados

### Build e inicializacao

```bash
docker-compose up --build
```

- Frontend: [http://localhost](http://localhost)
- API: [http://localhost:3000/api](http://localhost:3000/api)

O volume `./data` persiste o banco SQLite entre reinicializacoes.

---

## Credenciais de Acesso (Seed Inicial)

| Perfil      | Email                   | Senha        |
|-------------|-------------------------|--------------|
| Superadmin  | admin@ipa.gov.br        | admin123     |
| Analista    | analista@ipa.gov.br     | analista123  |

---

## Funcionalidades Principais

- **Login** com autenticacao JWT e controle de sessao
- **Dashboard** com cards de resumo (total, prioridade alta, backlog, descarte) e ranking de processos por IPA Final
- **Wizard de Avaliacao** em 6 etapas: Identificacao, Criterios Tecnicos, Criterios de Negocio, Impedimentos, Urgencia e Riscos
- **Preview IPA em tempo real** calculado na lib shared durante o preenchimento
- **Resultado** com memoria de calculo detalhada e grafico radar (Chart.js)
- **Export PDF** do resultado da avaliacao
- **Gestao de Usuarios** (admin) e **Gestao de Organizacoes** (superadmin)

---

## Como Rodar os Testes

### Unitarios (Vitest — Frontend)

```bash
npx nx test frontend
```

### Unitarios (Jest — API)

```bash
npx nx test api
```

### E2E (Playwright)

Com o app rodando em dev (api + frontend):

```bash
cd apps/frontend
npx playwright test --config=e2e/playwright.config.ts
```

---

## Build de Producao

```bash
npx nx build frontend --configuration=production
npx nx build api --configuration=production
```
