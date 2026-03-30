# Design — Sistema IPA (Indice de Potencial de Automacao)

**Data:** 2026-03-30
**Status:** Aprovado

---

## 1. Visao Geral

Sistema web standalone para avaliar o potencial de automacao de processos organizacionais. Um analista cadastra um processo, responde perguntas estruturadas por dimensao (Tecnica, Negocio, Impedimento, Urgencia), o sistema calcula o IPA (Indice de Potencial de Automacao) e gera um ranking priorizado.

### Metodologia IPA

```
IPA Final = [(0,50 x IT) + (0,50 x IN)] x FI x FU
```

- **IT** (Indice Tecnico): Viabilidade tecnologica (0 a 5)
- **IN** (Indice de Negocio): Valor publico gerado (0 a 5)
- **FI** (Fator de Impedimento): Restricoes juridico-normativas (0,00 a 1,00)
- **FU** (Fator de Urgencia): Prioridade estrategica/temporal (0,90 a 1,20)

### Classificacao

| Score IPA | Status | Acao |
|---|---|---|
| >= 4,0 | Prioridade Alta | Aprovacao imediata, inicio do PDD |
| 2,5 - 3,9 | Backlog | Reavaliacao focada em Quick Wins |
| < 2,5 | Descarte | Viabilidade baixa ou ROI insuficiente |

---

## 2. Stack Tecnico

| Camada | Tecnologia |
|---|---|
| Monorepo | Nx |
| Frontend | Angular 21 (standalone, OnPush, Signals, Zoneless) |
| UI | Angular Material |
| Backend | NestJS |
| ORM | TypeORM |
| Banco | SQLite (MVP), migravel para PostgreSQL |
| Auth | JWT + refresh token |
| Testes Backend | Jest + supertest |
| Testes Frontend | Vitest + Playwright |
| Tipos Compartilhados | Lib shared Nx (interfaces, DTOs, enums, calculos) |

---

## 3. Arquitetura

```
potencial-automacao-api/          <- Nx Monorepo
├── apps/
│   ├── frontend/                 <- Angular 21
│   │   ├── src/app/
│   │   │   ├── core/             <- auth, guards, interceptors
│   │   │   ├── shared/           <- components reutilizaveis
│   │   │   ├── features/
│   │   │   │   ├── login/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── processos/
│   │   │   │   ├── avaliacao-wizard/
│   │   │   │   ├── resultado/
│   │   │   │   ├── usuarios/
│   │   │   │   └── organizacoes/
│   │   │   └── app.routes.ts
│   │   └── e2e/                  <- Playwright
│   └── api/                      <- NestJS
│       ├── src/
│       │   ├── auth/
│       │   ├── organizacoes/
│       │   ├── usuarios/
│       │   ├── processos/
│       │   ├── avaliacoes/
│       │   ├── dashboard/
│       │   ├── database/         <- TypeORM config, migrations
│       │   └── common/           <- tenant guard, decorators
│       └── test/                 <- e2e supertest
├── libs/
│   └── shared/
│       └── src/
│           ├── interfaces/
│           ├── dtos/
│           ├── enums/
│           └── calculos/         <- calcularIPA(), calcularIT(), calcularIN()
├── docker-compose.yml
├── nx.json
└── package.json
```

### Fluxo de Dados

```
Analista preenche wizard -> POST /avaliacoes -> NestJS calcula IPA -> Salva SQLite -> Dashboard atualiza
```

---

## 4. Modelo de Dados

Nomenclatura conforme Guia de Diagramacao e Dicionarizacao de Dados (docs/db/).
Sigla do esquema: **IPA**.

### IPATB001_ORGANIZACAO

| Coluna | Classe | Tipo | Restricao |
|---|---|---|---|
| `ID_ORGANIZACAO` | ID | INTEGER | PK, NOT NULL |
| `NO_ORGANIZACAO` | NO | VARCHAR(200) | NOT NULL |
| `CO_SLUG` | CO | VARCHAR(100) | AK, NOT NULL |
| `IC_SITUACAO` | IC | CHAR(1) | NOT NULL (A/I) |
| `TS_CRIACAO` | TS | TIMESTAMP | NOT NULL |

### IPATB002_USUARIO

| Coluna | Classe | Tipo | Restricao |
|---|---|---|---|
| `ID_USUARIO` | ID | INTEGER | PK, NOT NULL |
| `NO_USUARIO` | NO | VARCHAR(200) | NOT NULL |
| `DE_EMAIL` | DE | VARCHAR(200) | AK, NOT NULL |
| `CO_SENHA_HASH` | CO | VARCHAR(255) | NOT NULL |
| `CO_PERFIL` | CO | VARCHAR(20) | NOT NULL (admin/analista/visualizador) |
| `ID_ORGANIZACAO` | ID | INTEGER | FK -> IPATB001, NOT NULL |
| `IC_SITUACAO` | IC | CHAR(1) | NOT NULL (A/I) |
| `TS_CRIACAO` | TS | TIMESTAMP | NOT NULL |

### IPATB003_PROCESSO

| Coluna | Classe | Tipo | Restricao |
|---|---|---|---|
| `ID_PROCESSO` | ID | INTEGER | PK, NOT NULL |
| `NO_PROCESSO` | NO | VARCHAR(500) | NOT NULL |
| `NO_AREA` | NO | VARCHAR(200) | NOT NULL |
| `NO_DEPARTAMENTO` | NO | VARCHAR(200) | NULL |
| `NO_DONO_PROCESSO` | NO | VARCHAR(200) | NOT NULL |
| `NO_SOLICITANTE` | NO | VARCHAR(200) | NULL |
| `DT_LEVANTAMENTO` | DT | DATE | NOT NULL |
| `ID_ORGANIZACAO` | ID | INTEGER | FK -> IPATB001, NOT NULL |
| `ID_USUARIO_CRIACAO` | ID | INTEGER | FK -> IPATB002, NOT NULL |
| `CO_SITUACAO` | CO | VARCHAR(20) | NOT NULL (rascunho/avaliado/arquivado) |
| `TS_CRIACAO` | TS | TIMESTAMP | NOT NULL |
| `TS_ATUALIZACAO` | TS | TIMESTAMP | NOT NULL |

### IPATB004_AVALIACAO

| Coluna | Classe | Tipo | Restricao |
|---|---|---|---|
| `ID_AVALIACAO` | ID | INTEGER | PK, NOT NULL |
| `ID_PROCESSO` | ID | INTEGER | FK -> IPATB003, NOT NULL |
| `ID_ORGANIZACAO` | ID | INTEGER | FK -> IPATB001, NOT NULL |
| `ID_USUARIO_AVALIADOR` | ID | INTEGER | FK -> IPATB002, NOT NULL |
| **Dimensao Tecnica** ||||
| `NU_NOTA_SEGURANCA_ACESSOS` | NU | INTEGER | NOT NULL (0-5) |
| `DE_JUSTIF_SEGURANCA_ACESSOS` | DE | TEXT | NOT NULL |
| `NU_NOTA_ESTABILIDADE_LEGADO` | NU | INTEGER | NOT NULL (0-5) |
| `DE_JUSTIF_ESTABILIDADE_LEGADO` | DE | TEXT | NOT NULL |
| `NU_NOTA_ESTRUTURACAO_DADOS` | NU | INTEGER | NOT NULL (0-5) |
| `DE_JUSTIF_ESTRUTURACAO_DADOS` | DE | TEXT | NOT NULL |
| **Dimensao Negocio** ||||
| `NU_NOTA_GESTAO_RISCO` | NU | INTEGER | NOT NULL (0-5) |
| `DE_JUSTIF_GESTAO_RISCO` | DE | TEXT | NOT NULL |
| `NU_NOTA_REDUCAO_SLA` | NU | INTEGER | NOT NULL (0-5) |
| `NU_NOTA_ABRANGENCIA` | NU | INTEGER | NOT NULL (0-5) |
| `NU_NOTA_EXPERIENCIA_CIDADAO` | NU | INTEGER | NOT NULL (0-5) |
| `DE_JUSTIF_IMPACTO_CIDADAO` | DE | TEXT | NOT NULL |
| `NU_NOTA_VOLUME_MENSAL` | NU | INTEGER | NOT NULL (0-5) |
| `NU_NOTA_FTE_LIBERADO` | NU | INTEGER | NOT NULL (0-5) |
| `DE_JUSTIF_EFICIENCIA` | DE | TEXT | NOT NULL |
| **Fatores** ||||
| `VR_FATOR_IMPEDIMENTO` | VR | DECIMAL(3,2) | NOT NULL (0.00-1.00) |
| `DE_JUSTIF_IMPEDIMENTO` | DE | TEXT | NOT NULL |
| `VR_FATOR_URGENCIA` | VR | DECIMAL(3,2) | NOT NULL (0.90-1.20) |
| `DE_JUSTIF_URGENCIA` | DE | TEXT | NOT NULL |
| **Riscos** ||||
| `DE_RISCOS_CONTINGENCIA` | DE | TEXT | NULL (JSON) |
| **Calculados** ||||
| `VR_INDICE_TECNICO` | VR | DECIMAL(4,2) | NOT NULL |
| `VR_INDICE_NEGOCIO` | VR | DECIMAL(4,2) | NOT NULL |
| `VR_IPA_BASE` | VR | DECIMAL(4,2) | NOT NULL |
| `VR_IPA_FINAL` | VR | DECIMAL(4,2) | NOT NULL |
| `CO_STATUS_IPA` | CO | VARCHAR(20) | NOT NULL (prioridade_alta/backlog/descarte) |
| `TS_CRIACAO` | TS | TIMESTAMP | NOT NULL |
| `TS_ATUALIZACAO` | TS | TIMESTAMP | NOT NULL |

### Constraints

| Tipo | Nome | Referencia |
|---|---|---|
| PK | `PK_IPATB001` a `PK_IPATB004` | - |
| FK | `FK_IPATB002_IPATB001` | Usuario -> Organizacao |
| FK | `FK_IPATB003_IPATB001` | Processo -> Organizacao |
| FK | `FK_IPATB003_IPATB002` | Processo -> Usuario (criador) |
| FK | `FK_IPATB004_IPATB003` | Avaliacao -> Processo |
| FK | `FK_IPATB004_IPATB001` | Avaliacao -> Organizacao |
| FK | `FK_IPATB004_IPATB002` | Avaliacao -> Usuario (avaliador) |
| IN | `IN_IPATB003_01` | Processo.ID_ORGANIZACAO |
| IN | `IN_IPATB004_01` | Avaliacao.ID_PROCESSO |

### Formulas de Calculo

```
IT = (NU_NOTA_SEGURANCA_ACESSOS x 0.40) + (NU_NOTA_ESTABILIDADE_LEGADO x 0.30) + (NU_NOTA_ESTRUTURACAO_DADOS x 0.30)

Impacto Cidadao = (NU_NOTA_REDUCAO_SLA x 0.50) + (NU_NOTA_ABRANGENCIA x 0.35) + (NU_NOTA_EXPERIENCIA_CIDADAO x 0.25)
  -> normalizar: Impacto Cidadao = min(valor, 5.0)

Eficiencia = (NU_NOTA_VOLUME_MENSAL x 0.50) + (NU_NOTA_FTE_LIBERADO x 0.50)

IN = (NU_NOTA_GESTAO_RISCO x 0.50) + (Impacto Cidadao x 0.30) + (Eficiencia x 0.20)

IPA Base = (0.50 x IT) + (0.50 x IN)
IPA Final = IPA Base x FI x FU

Status: >= 4.0 -> prioridade_alta | 2.5-3.9 -> backlog | < 2.5 -> descarte
```

---

## 5. Paginas e Navegacao

### Paginas

| Pagina | Rota | Roles | Descricao |
|---|---|---|---|
| Login | `/login` | publico | Email + senha, JWT |
| Dashboard | `/admin/dashboard` | todos | Ranking IPA, cards resumo |
| Processos | `/admin/processos` | todos | Lista filtrada, "+ Nova Avaliacao" |
| Wizard | `/admin/avaliacoes/nova` | analista+ | 6 steps hibrido com preview IPA |
| Resultado | `/admin/avaliacoes/:id` | todos | Memoria de calculo, radar, PDF |
| Usuarios | `/admin/usuarios` | admin | CRUD por tenant |
| Organizacoes | `/admin/organizacoes` | superadmin | CRUD de tenants |

### Sidebar

| Item | Icone | Roles |
|---|---|---|
| Dashboard | `dashboard` | todos |
| Processos | `assignment` | todos |
| Usuarios | `group` | admin |
| Organizacoes | `business` | superadmin |

### Wizard Hibrido (6 steps)

1. **Identificacao** — nome, area, departamento, dono, solicitante, data
2. **Dimensao Tecnica** — Seguranca e Acessos, Estabilidade do Legado, Estruturacao dos Dados (nota 0-5 + justificativa cada)
3. **Dimensao Negocio** — Gestao de Risco, Impacto no Cidadao (3 sub), Eficiencia Operacional (2 sub)
4. **Fator de Impedimento** — selecao FI (0.00/0.20/0.50/0.80/1.00) + justificativa
5. **Fator de Urgencia** — selecao FU (0.90/1.00/1.10/1.20) + justificativa
6. **Riscos e Contingencia** — tabela editavel risco/protocolo

**Comportamento:**
- Navegacao sequencial (Proximo/Anterior) + barra de steps clicavel
- Pode pular para qualquer step ja visitado
- Salva rascunho automaticamente
- Preview do IPA no painel lateral a partir do Step 2
- "Calcular e Salvar" so quando todos os steps obrigatorios estao completos

---

## 6. API REST

### Endpoints

**Auth:**
- `POST /api/auth/login` — login
- `POST /api/auth/refresh` — renovar token
- `POST /api/auth/logout` — invalidar refresh
- `GET /api/auth/me` — perfil logado

**Organizacoes (superadmin):**
- `GET /api/organizacoes` — listar
- `POST /api/organizacoes` — criar
- `PATCH /api/organizacoes/:id` — atualizar

**Usuarios (admin do tenant):**
- `GET /api/usuarios` — listar (scoped por tenant)
- `POST /api/usuarios` — criar
- `PATCH /api/usuarios/:id` — atualizar
- `DELETE /api/usuarios/:id` — desativar

**Processos:**
- `GET /api/processos` — listar (filtros: area, status, periodo)
- `GET /api/processos/:id` — detalhe
- `POST /api/processos` — criar
- `PATCH /api/processos/:id` — atualizar
- `DELETE /api/processos/:id` — arquivar

**Avaliacoes:**
- `GET /api/avaliacoes/:id` — detalhe com calculos
- `POST /api/avaliacoes` — criar (calcula IPA no backend)
- `PATCH /api/avaliacoes/:id` — atualizar (recalcula IPA)
- `POST /api/avaliacoes/:id/rascunho` — salvar rascunho parcial
- `GET /api/avaliacoes/:id/pdf` — exportar PDF

**Dashboard:**
- `GET /api/dashboard/ranking` — ranking por IPA (paginado)
- `GET /api/dashboard/resumo` — cards totais

### Seguranca

- **TenantGuard**: toda query filtra por `ID_ORGANIZACAO` do JWT
- **RoleGuard**: superadmin (organizacoes), admin (usuarios), analista (processos/avaliacoes), visualizador (somente GET)
- **Calculo IPA no backend**: frontend faz preview, backend e a fonte da verdade

---

## 7. Testes

- **Backend**: Jest (unitarios services + calcularIPA) + supertest (e2e endpoints)
- **Frontend**: Vitest (unitarios components/services) + Playwright (e2e wizard/dashboard)
- **Lib Shared**: testes unitarios de `calcularIPA()` rodados por ambos

---

## 8. Deploy

- **Dev**: `nx serve api` + `nx serve frontend` (SQLite local)
- **Docker**: docker-compose com 2 containers (api + frontend/nginx)
- **Producao futura**: migrar SQLite -> PostgreSQL (TypeORM abstrai)

---

## 9. Multi-tenancy

- Toda entidade tem `ID_ORGANIZACAO`
- JWT carrega `organizacaoId` no payload
- TenantGuard injeta filtro automaticamente em toda query
- Superadmin pode acessar cross-tenant

---

## 10. Decisoes de Design

| Decisao | Escolha | Motivo |
|---|---|---|
| Monorepo Nx | Sim | Tipos compartilhados, dev solo full-stack |
| SQLite | MVP | Simplicidade, zero config, migravel para PG |
| Metodologia fixa | MVP | Criterios/pesos hardcoded, configuravel depois |
| Calculo duplicado | Preview no front + oficial no back | UX responsiva + integridade |
| Wizard hibrido | Sequencial + navegacao livre | Guia o analista sem restringir |
| Nomenclatura DB | Guia DETRAN-DF | Padrao organizacional existente |
