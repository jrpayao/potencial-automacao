# TASKS — Sistema IPA (Indice de Potencial de Automacao)

> Tasks atomicas numeradas. Marcar [x] ao concluir com timestamp.

---

## G1 — Scaffold Nx + Shared Lib

- [x] **T01** — Criar workspace Nx com preset `apps` *(concluida em 2026-03-30 17:00)*
- [x] **T02** — Criar app Angular no Nx *(concluida em 2026-03-30 17:00)*
- [x] **T03** — Criar app NestJS no Nx *(concluida em 2026-03-30 17:00)*
- [x] **T04** — Criar lib shared *(concluida em 2026-03-30 17:00)*

---

## G2 — Backend: Database + Entities

- [x] **T05** — Configurar TypeORM + SQLite *(concluida em 2026-03-30 17:10)*
- [x] **T06** — Criar entity Organizacao *(concluida em 2026-03-30 17:10)*
- [x] **T07** — Criar entity Usuario *(concluida em 2026-03-30 17:10)*
- [x] **T08** — Criar entities Processo e Avaliacao *(concluida em 2026-03-30 17:10)*

---

## G3 — Backend: Auth

- [x] **T09** — Criar AuthModule + AuthService *(concluida em 2026-03-30 17:15)*
- [x] **T10** — Criar JwtStrategy + JwtAuthGuard *(concluida em 2026-03-30 17:15)*
- [x] **T11** — Criar RolesGuard + @Roles decorator *(concluida em 2026-03-30 17:15)*
- [x] **T12** — Criar TenantGuard + @CurrentUser decorator *(concluida em 2026-03-30 17:15)*

---

## G4 — Backend: CRUD + Calculo IPA

- [ ] **T13** — Implementar calcularIPA na lib shared
  - Funcoes puras: calcularIT(), calcularIN(), calcularIPA(), classificarIPA()
  - Testes: calcular-ipa.spec.ts
    - Caso basico (notas medias)
    - Edge: todas as notas 0 → IPA = 0
    - Edge: todas as notas 5, FI=1, FU=1.20 → IPA maximo (6.0)
    - Edge: FI=0 → IPA = 0 (impedimento absoluto)
    - Classificacao: 4.0 → prioridade_alta, 3.0 → backlog, 1.0 → descarte
    - Normalizacao ImpactoCidadao: min(valor, 5.0)

- [ ] **T14** — CRUD Organizacoes
  - OrganizacoesModule, Controller, Service
  - Endpoints: GET /api/organizacoes, POST, PATCH /:id
  - Guard: @Roles(Perfil.SUPERADMIN)
  - Testes: organizacoes.service.spec.ts

- [ ] **T15** — CRUD Usuarios
  - UsuariosModule, Controller, Service
  - Endpoints: GET /api/usuarios, POST, PATCH /:id, DELETE /:id
  - Senha hasheada com bcrypt ao criar
  - Scoped por tenant (TenantGuard)
  - Guard: @Roles(Perfil.ADMIN)
  - Testes: usuarios.service.spec.ts

- [ ] **T16** — CRUD Processos
  - ProcessosModule, Controller, Service
  - Endpoints: GET /api/processos (filtros), GET /:id, POST, PATCH /:id, DELETE /:id
  - Filtros: area, status, dataInicio, dataFim
  - Scoped por tenant
  - Guard: @Roles(Perfil.ANALISTA, Perfil.ADMIN)
  - Testes: processos.service.spec.ts

- [ ] **T17** — CRUD Avaliacoes
  - AvaliacoesModule, Controller, Service
  - POST /api/avaliacoes: recebe notas + justificativas, calcula IPA no service usando calcularIPA() da lib shared, salva tudo
  - PATCH /api/avaliacoes/:id: atualiza e recalcula
  - POST /api/avaliacoes/:id/rascunho: salva parcial (campos nullable)
  - GET /api/avaliacoes/:id: retorna com calculos
  - Scoped por tenant
  - Testes: avaliacoes.service.spec.ts (incluindo calculo integrado)

- [ ] **T18** — Seed de dados iniciais
  - Arquivo: `database/seed.ts`
  - Criar 1 organizacao: "Ministerio da Gestao"
  - Criar 1 superadmin: admin@ipa.gov.br / admin123
  - Criar 1 analista: analista@ipa.gov.br / analista123
  - Criar 3 processos com avaliacoes completas (dados do PDF como exemplo)
  - Executavel via: `nx run api:seed`

---

## G5 — Backend: Dashboard + PDF

- [ ] **T19** — Endpoints Dashboard
  - DashboardModule, Controller, Service
  - GET /api/dashboard/ranking: query processos JOIN avaliacoes ORDER BY VR_IPA_FINAL DESC, paginado
  - GET /api/dashboard/resumo: COUNT por CO_STATUS_IPA + total
  - Scoped por tenant
  - Testes: dashboard.service.spec.ts

- [ ] **T20** — Export PDF
  - PdfService usando pdfmake
  - Template: replica estrutura do formulario_avaliacao.pdf
  - Secoes: Identificacao, Dimensao Tecnica (notas + justificativas), Dimensao Negocio, Fatores, Riscos, Resultado Final (memoria de calculo)
  - GET /api/avaliacoes/:id/pdf → Content-Type: application/pdf

- [ ] **T21** — Testes E2E do backend
  - test/app.e2e-spec.ts com supertest
  - Fluxo completo: login → criar processo → criar avaliacao → verificar IPA calculado → dashboard ranking
  - Verificar tenant isolation: org A nao ve dados de org B

---

## G6 — Frontend: Scaffold + Auth

- [ ] **T22** — Instalar Angular Material + configurar tema
  - `nx g @angular/material:ng-add --project=frontend`
  - Tema custom com paleta azul (similar ao design)
  - Fontes: Inter (Google Fonts) como principal
  - SCSS variables: cores do design

- [ ] **T23** — Criar AuthService
  - login(email, senha) → salva tokens no localStorage
  - refresh() → renova access token
  - logout() → limpa tokens, redireciona para /login
  - isAuthenticated signal
  - currentUser signal
  - HttpInterceptor para injetar Authorization header

- [ ] **T24** — Criar Guards
  - authGuard: redireciona para /login se nao autenticado
  - noAuthGuard: redireciona para /admin/dashboard se ja autenticado
  - roleGuard: verifica perfil minimo

- [ ] **T25** — Criar LoginComponent
  - Form reativo: email + senha
  - Validacao: email obrigatorio + formato, senha obrigatoria
  - Botao "Entrar" → authService.login() → redirect dashboard
  - Mensagem de erro em caso de credenciais invalidas
  - Layout: tela cheia com card centralizado

---

## G7 — Frontend: Layout (Sidebar + Header)

- [ ] **T26** — Criar AdminLayoutComponent
  - Shell: sidebar fixa esquerda + header fixo topo + body scrollavel
  - Router outlet no body

- [ ] **T27** — Criar SidebarComponent
  - Menu items: Dashboard, Processos, Usuarios (admin), Organizacoes (superadmin)
  - Icones Material Symbols: dashboard, assignment, group, business
  - Item ativo destacado
  - Botao "Sair" na parte inferior
  - Responsivo: colapsavel em mobile

- [ ] **T28** — Criar HeaderComponent + Rotas
  - Titulo da pagina atual
  - Avatar do usuario + nome + menu dropdown (perfil, sair)
  - app.routes.ts: /login (noAuthGuard) + /admin (authGuard, AdminLayout) com children lazy-loaded
  - admin.routes.ts: dashboard, processos, avaliacoes/nova, avaliacoes/:id, usuarios, organizacoes

---

## G8 — Frontend: Dashboard

- [ ] **T29** — Criar DashboardService
  - getRanking(page, limit) → Observable ranking
  - getResumo() → Observable { total, prioridadeAlta, backlog, descarte }

- [ ] **T30** — Criar DashboardComponent
  - 4 cards resumo: Total Processos, Prioridade Alta (verde), Backlog (amarelo), Descarte (vermelho)
  - Cada card com icone + numero + label

- [ ] **T31** — Criar RankingTableComponent
  - Tabela Material com colunas: Posicao, Nome do Processo, IT, IN, IPA Final, Status
  - Status com badge colorido (verde/amarelo/vermelho)
  - Ordenado por IPA Final desc
  - Paginacao
  - Clique na linha → navega para resultado da avaliacao

---

## G9 — Frontend: Processos

- [ ] **T32** — Criar ProcessosService
  - listar(filtros) → Observable lista paginada
  - buscarPorId(id) → Observable processo
  - criar(dto) → Observable processo criado
  - atualizar(id, dto) → Observable
  - arquivar(id) → Observable

- [ ] **T33** — Criar ListaProcessosComponent
  - Filtros: area (text), status (select), periodo (date range)
  - Tabela Material: Nome, Area, Dono, Status, IPA Final, Data
  - Botao "+ Nova Avaliacao" → navega para wizard
  - Botao "Ver" por linha → navega para resultado

---

## G10 — Frontend: Wizard Avaliacao

- [ ] **T34** — Criar AvaliacaoService
  - criarAvaliacao(dto) → Observable avaliacao com IPA calculado
  - atualizarAvaliacao(id, dto) → Observable
  - salvarRascunho(id, dto) → Observable
  - buscarPorId(id) → Observable
  - exportarPdf(id) → Observable Blob

- [ ] **T35** — Criar WizardComponent (container)
  - MatStepper com linear=false
  - 6 steps como child components
  - FormGroup pai com subgroups por step
  - Navegacao: proximo/anterior + barra clicavel
  - Botao "Calcular e Salvar" no ultimo step (habilitado quando todos validos)

- [ ] **T36** — Criar StepIdentificacaoComponent
  - Campos: nome do processo, area, departamento, dono, solicitante, data do levantamento
  - Validacao: nome e area obrigatorios

- [ ] **T37** — Criar StepTecnicaComponent
  - 3 criterios: Seguranca e Acessos, Estabilidade do Legado, Estruturacao dos Dados
  - Cada criterio: slider ou radio 0-5 + descritores objetivos + campo justificativa (textarea)
  - Descritores carregados da metodologia (constante na lib shared)

- [ ] **T38** — Criar StepNegocioComponent
  - 3 blocos: Gestao de Risco (1 nota), Impacto no Cidadao (3 sub-notas), Eficiencia Operacional (2 sub-notas)
  - Cada nota: radio 0-5 + descritores + justificativa por bloco
  - Descritores carregados da metodologia

- [ ] **T39** — Criar StepImpedimentoComponent + StepUrgenciaComponent + StepRiscosComponent
  - Impedimento: radio com 5 opcoes (1.00, 0.80, 0.50, 0.20, 0.00) + descricao + justificativa
  - Urgencia: radio com 4 opcoes (1.20, 1.10, 1.00, 0.90) + descricao + justificativa
  - Riscos: tabela editavel com botao "+ Adicionar Risco" (campos: risco, protocolo contingencia)

- [ ] **T40** — Criar IpaPreviewComponent
  - Painel lateral fixo (visivel a partir do Step 2)
  - Usa calcularIPA() da lib shared em tempo real
  - Exibe: IT, IN, IPA Base, FI, FU, IPA Final, Status (badge colorido)
  - Atualiza reativamente via signals conforme usuario preenche

---

## G11 — Frontend: Resultado

- [ ] **T41** — Criar ResultadoComponent
  - Busca avaliacao por :id da rota
  - Secao "Identificacao do Processo"
  - Secao "Memoria de Calculo" com todas as notas, pesos, calculos parciais
  - Badge grande com IPA Final + status

- [ ] **T42** — Criar RadarChartComponent
  - Chart.js radar com 2 datasets: IT (criterios tecnicos) e IN (criterios negocio)
  - 6 eixos: Seguranca, Estabilidade, Estruturacao, Risco, Impacto, Eficiencia

- [ ] **T43** — Botoes de acao no resultado
  - "Editar" → abre wizard preenchido com dados da avaliacao
  - "Exportar PDF" → chama endpoint /pdf, faz download
  - "Voltar" → retorna para lista de processos

---

## G12 — Frontend: Usuarios + Organizacoes

- [ ] **T44** — Criar UsuariosService + ListaUsuariosComponent
  - CRUD completo com signals
  - Tabela: Nome, Email, Perfil (badge), Status
  - Dialog para criar/editar usuario
  - Filtro por perfil
  - Visivel apenas para admin

- [ ] **T45** — Criar OrganizacoesService + ListaOrganizacoesComponent
  - CRUD com signals
  - Tabela: Nome, Slug, Status, Data Criacao
  - Dialog para criar/editar
  - Visivel apenas para superadmin

- [ ] **T46** — Testes unitarios frontend
  - Vitest: AuthService (login, logout, isAuthenticated)
  - Vitest: calcularIPA (importado da lib shared)
  - Vitest: WizardComponent (navegacao entre steps)
  - Vitest: DashboardComponent (renderiza cards e tabela)

---

## G13 — E2E + Docker

- [ ] **T47** — Configurar Playwright
  - playwright.config.ts com baseURL frontend + api proxy
  - Auth setup compartilhado (login admin, salva session)
  - Projeto chromium

- [ ] **T48** — Testes E2E
  - login.spec.ts: login valido → dashboard, login invalido → erro
  - dashboard.spec.ts: cards resumo visiveis, tabela ranking com dados
  - wizard.spec.ts: preencher todos os 6 steps → salvar → verificar resultado com IPA calculado
  - processos.spec.ts: filtrar, ver detalhe

- [ ] **T49** — Docker Compose
  - Dockerfile frontend: node:22-alpine build → nginx:1.27-alpine serve
  - Dockerfile api: node:22-alpine build → node:22-alpine run
  - docker-compose.yml: api (porta 3000) + frontend (porta 80, proxy /api → api:3000)
  - Volume para SQLite persistir

- [ ] **T50** — Seed automatico + README
  - Seed roda automaticamente no primeiro boot da API (verifica se banco vazio)
  - README.md com instrucoes: como rodar (dev e docker), como acessar, credenciais seed
  - Screenshots do sistema no README
