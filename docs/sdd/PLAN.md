# PLAN — Sistema IPA (Indice de Potencial de Automacao)

> Decisoes tecnicas, stack e estrutura de pastas

---

## 1. Stack Tecnico

| Camada | Tecnologia | Versao |
|---|---|---|
| Monorepo | Nx | 21.x |
| Frontend | Angular | 21.x |
| UI Components | Angular Material | 21.x |
| Backend | NestJS | 11.x |
| ORM | TypeORM | 0.3.x |
| Banco de Dados | SQLite (better-sqlite3) | MVP |
| Auth | @nestjs/jwt + passport-jwt | — |
| Hash Senha | bcrypt | — |
| Validacao | class-validator + class-transformer | — |
| Testes Backend | Jest + supertest | — |
| Testes Frontend | Vitest | — |
| Testes E2E | Playwright | — |
| PDF Export | pdfmake | — |
| Runtime | Node.js | 22.x |

---

## 2. Decisoes de Arquitetura

### 2.1 Monorepo Nx
- Angular e NestJS no mesmo workspace Nx
- Lib `shared` para tipos, DTOs, enums e funcoes de calculo
- Compartilhamento de tipos elimina drift frontend/backend

### 2.2 Banco de Dados
- SQLite para MVP (zero config, arquivo local)
- TypeORM com entities decoradas → migravel para PostgreSQL mudando config
- Nomenclatura conforme Guia de Diagramacao (docs/db/)
- Migrations manuais via TypeORM CLI

### 2.3 Autenticacao
- JWT com access token (15min) + refresh token (7d)
- Refresh token salvo em banco (revogavel)
- Payload JWT: { sub: userId, email, perfil, organizacaoId }
- Guards: JwtAuthGuard, RolesGuard, TenantGuard

### 2.4 Multi-tenancy
- Coluna ID_ORGANIZACAO em todas as entidades
- TenantGuard injeta filtro automatico em toda query via decorator @CurrentUser
- Superadmin bypassa filtro de tenant

### 2.5 Calculo IPA
- Funcoes puras na lib shared (calcularIT, calcularIN, calcularIPA)
- Frontend usa para preview em tempo real
- Backend usa como fonte da verdade ao salvar
- Mesmos testes rodam em ambos os contextos

### 2.6 Frontend
- Standalone components, OnPush, Signals, Zoneless
- Angular Material para UI (forms, stepper, table, cards, toolbar)
- Wizard usa MatStepper com linear=false (hibrido)
- Preview IPA como componente lateral com signals reativos
- Lazy loading por feature module

### 2.7 API REST
- Prefixo global: /api
- Versionamento: nao neste MVP
- Paginacao: ?page=1&limit=20
- Filtros: query params (?area=X&status=Y)
- Erros: { statusCode, message, error }

### 2.8 PDF Export
- pdfmake no backend (gera buffer PDF)
- Endpoint GET /api/avaliacoes/:id/pdf retorna application/pdf
- Template replicando a estrutura do formulario_avaliacao.pdf

---

## 3. Estrutura de Pastas

```
potencial-automacao-api/
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   │   ├── auth.interceptor.ts
│   │   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   │   └── role.guard.ts
│   │   │   │   │   └── layout/
│   │   │   │   │       ├── admin-layout.component.ts
│   │   │   │   │       ├── sidebar.component.ts
│   │   │   │   │       └── header.component.ts
│   │   │   │   ├── shared/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── status-badge.component.ts
│   │   │   │   │   │   ├── ipa-gauge.component.ts
│   │   │   │   │   │   └── confirm-dialog.component.ts
│   │   │   │   │   └── pipes/
│   │   │   │   │       └── ipa-status.pipe.ts
│   │   │   │   ├── features/
│   │   │   │   │   ├── login/
│   │   │   │   │   │   └── login.component.ts
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── dashboard.component.ts
│   │   │   │   │   │   ├── ranking-table.component.ts
│   │   │   │   │   │   └── dashboard.service.ts
│   │   │   │   │   ├── processos/
│   │   │   │   │   │   ├── lista-processos.component.ts
│   │   │   │   │   │   └── processos.service.ts
│   │   │   │   │   ├── avaliacao-wizard/
│   │   │   │   │   │   ├── wizard.component.ts
│   │   │   │   │   │   ├── step-identificacao.component.ts
│   │   │   │   │   │   ├── step-tecnica.component.ts
│   │   │   │   │   │   ├── step-negocio.component.ts
│   │   │   │   │   │   ├── step-impedimento.component.ts
│   │   │   │   │   │   ├── step-urgencia.component.ts
│   │   │   │   │   │   ├── step-riscos.component.ts
│   │   │   │   │   │   ├── ipa-preview.component.ts
│   │   │   │   │   │   └── avaliacao.service.ts
│   │   │   │   │   ├── resultado/
│   │   │   │   │   │   ├── resultado.component.ts
│   │   │   │   │   │   └── radar-chart.component.ts
│   │   │   │   │   ├── usuarios/
│   │   │   │   │   │   ├── lista-usuarios.component.ts
│   │   │   │   │   │   └── usuarios.service.ts
│   │   │   │   │   └── organizacoes/
│   │   │   │   │       ├── lista-organizacoes.component.ts
│   │   │   │   │       └── organizacoes.service.ts
│   │   │   │   ├── app.component.ts
│   │   │   │   ├── app.config.ts
│   │   │   │   └── app.routes.ts
│   │   │   ├── environments/
│   │   │   │   ├── environment.ts
│   │   │   │   └── environment.prod.ts
│   │   │   ├── styles/
│   │   │   │   ├── _variables.scss
│   │   │   │   └── styles.scss
│   │   │   ├── index.html
│   │   │   └── main.ts
│   │   ├── e2e/
│   │   │   ├── shared/
│   │   │   │   ├── auth.setup.ts
│   │   │   │   └── helpers.ts
│   │   │   ├── login/
│   │   │   │   └── login.spec.ts
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.spec.ts
│   │   │   ├── avaliacao/
│   │   │   │   └── wizard.spec.ts
│   │   │   └── playwright.config.ts
│   │   └── project.json
│   └── api/
│       ├── src/
│       │   ├── auth/
│       │   │   ├── auth.module.ts
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.service.ts
│       │   │   ├── jwt.strategy.ts
│       │   │   ├── jwt-auth.guard.ts
│       │   │   ├── roles.guard.ts
│       │   │   ├── roles.decorator.ts
│       │   │   └── auth.service.spec.ts
│       │   ├── common/
│       │   │   ├── tenant.guard.ts
│       │   │   ├── tenant.decorator.ts
│       │   │   ├── current-user.decorator.ts
│       │   │   └── pagination.dto.ts
│       │   ├── organizacoes/
│       │   │   ├── organizacoes.module.ts
│       │   │   ├── organizacoes.controller.ts
│       │   │   ├── organizacoes.service.ts
│       │   │   ├── organizacao.entity.ts
│       │   │   └── organizacoes.service.spec.ts
│       │   ├── usuarios/
│       │   │   ├── usuarios.module.ts
│       │   │   ├── usuarios.controller.ts
│       │   │   ├── usuarios.service.ts
│       │   │   ├── usuario.entity.ts
│       │   │   └── usuarios.service.spec.ts
│       │   ├── processos/
│       │   │   ├── processos.module.ts
│       │   │   ├── processos.controller.ts
│       │   │   ├── processos.service.ts
│       │   │   ├── processo.entity.ts
│       │   │   └── processos.service.spec.ts
│       │   ├── avaliacoes/
│       │   │   ├── avaliacoes.module.ts
│       │   │   ├── avaliacoes.controller.ts
│       │   │   ├── avaliacoes.service.ts
│       │   │   ├── avaliacao.entity.ts
│       │   │   ├── pdf.service.ts
│       │   │   └── avaliacoes.service.spec.ts
│       │   ├── dashboard/
│       │   │   ├── dashboard.module.ts
│       │   │   ├── dashboard.controller.ts
│       │   │   └── dashboard.service.ts
│       │   ├── database/
│       │   │   ├── database.module.ts
│       │   │   └── seed.ts
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── test/
│       │   └── app.e2e-spec.ts
│       └── project.json
├── libs/
│   └── shared/
│       └── src/
│           ├── index.ts
│           ├── interfaces/
│           │   ├── organizacao.interface.ts
│           │   ├── usuario.interface.ts
│           │   ├── processo.interface.ts
│           │   └── avaliacao.interface.ts
│           ├── dtos/
│           │   ├── create-processo.dto.ts
│           │   ├── create-avaliacao.dto.ts
│           │   ├── update-avaliacao.dto.ts
│           │   └── login.dto.ts
│           ├── enums/
│           │   ├── status-ipa.enum.ts
│           │   ├── perfil.enum.ts
│           │   ├── situacao-processo.enum.ts
│           │   ├── fator-impedimento.enum.ts
│           │   └── fator-urgencia.enum.ts
│           └── calculos/
│               ├── calcular-ipa.ts
│               └── calcular-ipa.spec.ts
├── docker-compose.yml
├── Dockerfile
├── nx.json
├── package.json
├── tsconfig.base.json
├── CLAUDE.md
└── docs/
    ├── sdd/
    │   ├── SPEC.md
    │   ├── PLAN.md
    │   └── TASKS.md
    ├── db/
    │   └── guia-diagramacao-dicionarizacao-dados.md
    ├── formulario_avaliacao.pdf
    └── superpowers/
        └── specs/
            └── 2026-03-30-ipa-system-design.md
```

---

## 4. Grupos de Features (ordem de implementacao)

| Grupo | Feature | Tasks |
|---|---|---|
| G1 | Scaffold Nx + Shared Lib | T01-T04 |
| G2 | Backend: Database + Entities | T05-T08 |
| G3 | Backend: Auth | T09-T12 |
| G4 | Backend: CRUD + Calculo IPA | T13-T18 |
| G5 | Backend: Dashboard + PDF | T19-T21 |
| G6 | Frontend: Scaffold + Auth | T22-T25 |
| G7 | Frontend: Layout (Sidebar + Header) | T26-T28 |
| G8 | Frontend: Dashboard | T29-T31 |
| G9 | Frontend: Processos | T32-T33 |
| G10 | Frontend: Wizard Avaliacao | T34-T40 |
| G11 | Frontend: Resultado | T41-T43 |
| G12 | Frontend: Usuarios + Organizacoes | T44-T46 |
| G13 | E2E + Docker | T47-T50 |

---

## 5. Convencoes

### 5.1 Commits
```
feat({feature}): {descricao em portugues}
```

### 5.2 Branches
- Branch de trabalho definida pelo usuario

### 5.3 Nomes de Arquivos
- kebab-case para arquivos: `lista-processos.component.ts`
- PascalCase para classes: `ListaProcessosComponent`
- camelCase para variaveis/metodos: `calcularIPA()`

### 5.4 API
- Endpoints em portugues: `/api/processos`, `/api/avaliacoes`
- DTOs validados com class-validator
- Erros padronizados: `{ statusCode, message, error }`

### 5.5 Banco de Dados
- Nomenclatura conforme Guia (docs/db/)
- Sigla: IPA
- TypeORM entities mapeiam para nomes fisicos do guia
