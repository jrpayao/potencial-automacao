# TASKS — Sistema IPA (Indice de Potencial de Automacao)

> Tasks atomicas numeradas. Marcar [x] ao concluir com timestamp.

---

## G1 — Scaffold Nx + Shared Lib

- **T01** — Criar workspace Nx com preset `apps` *(concluida em 2026-03-30 21:30)*
- **T02** — Criar app Angular no Nx *(concluida em 2026-03-30 21:30)*
- **T03** — Criar app NestJS no Nx *(concluida em 2026-03-30 21:30)*
- **T04** — Criar lib shared *(concluida em 2026-03-30 21:30)*

---

## G2 — Backend: Database + Entities

- **T05** — Configurar TypeORM + SQLite *(concluida em 2026-03-30 22:00)*
- **T06** — Criar entity Organizacao *(concluida em 2026-03-30 22:00)*
- **T07** — Criar entity Usuario *(concluida em 2026-03-30 22:00)*
- **T08** — Criar entities Processo e Avaliacao *(concluida em 2026-03-30 22:00)*

---

## G3 — Backend: Auth

- **T09** — Criar AuthModule + AuthService *(concluida em 2026-03-30 22:10)*
- **T10** — Criar JwtStrategy + JwtAuthGuard *(concluida em 2026-03-30 22:10)*
- **T11** — Criar RolesGuard + @Roles decorator *(concluida em 2026-03-30 22:10)*
- **T12** — Criar TenantGuard + @CurrentUser decorator *(concluida em 2026-03-30 22:10)*

---

## G4 — Backend: CRUD + Calculo IPA

- **T13** — Implementar calcularIPA na lib shared *(concluida em 2026-03-30 22:40)*
- **T14** — CRUD Organizacoes *(concluida em 2026-03-30 22:40)*
- **T15** — CRUD Usuarios *(concluida em 2026-03-30 22:40)*
- **T16** — CRUD Processos *(concluida em 2026-03-30 22:40)*
- **T17** — CRUD Avaliacoes *(concluida em 2026-03-30 22:40)*
- **T18** — Seed de dados iniciais *(concluida em 2026-03-30 22:40)*

---

## G5 — Backend: Dashboard + PDF

- [x] **T19** — Endpoints Dashboard *(concluida em 2026-03-30 23:07)*
- [x] **T20** — Export PDF *(concluida em 2026-03-30 23:07)*
- [x] **T21** — Testes E2E do backend *(concluida em 2026-03-30 23:07)*

---

## G6 — Frontend: Scaffold + Auth

- [x] **T22** — Instalar Angular Material + configurar tema *(concluida em 2026-03-31 00:30)*
- [x] **T23** — Criar AuthService *(concluida em 2026-03-31 00:30)*
- [x] **T24** — Criar Guards *(concluida em 2026-03-31 00:30)*
- [x] **T25** — Criar LoginComponent *(concluida em 2026-03-31 00:30)*

---

## G7 — Frontend: Layout (Sidebar + Header)

- [x] **T26** — Criar AdminLayoutComponent *(concluida em 2026-03-31 10:30)*
- [x] **T27** — Criar SidebarComponent *(concluida em 2026-03-31 10:30)*
- [x] **T28** — Criar HeaderComponent + Rotas *(concluida em 2026-03-31 10:30)*

---

## G8 — Frontend: Dashboard

- [x] **T29** — Criar DashboardService *(concluida em 2026-03-31 22:10)*
  - getRanking(page, limit) → Observable ranking
  - getResumo() → Observable { total, prioridadeAlta, backlog, descarte }
- [x] **T30** — Criar DashboardComponent *(concluida em 2026-03-31 22:10)*
  - 4 cards resumo: Total Processos, Prioridade Alta (verde), Backlog (amarelo), Descarte (vermelho)
  - Cada card com icone + numero + label
- [x] **T31** — Criar RankingTableComponent *(concluida em 2026-03-31 22:10)*
  - Tabela Material com colunas: Posicao, Nome do Processo, Area, IPA Final, Status
  - Status com badge colorido (verde/amarelo/vermelho)
  - Ordenado por IPA Final desc
  - Paginacao
  - Clique na linha → navega para resultado da avaliacao

---

## G9 — Frontend: Processos

- [x] **T32** — Criar ProcessosService *(concluida em 2026-03-31 22:18)*
  - listar(filtros) → Observable lista paginada
  - buscarPorId(id) → Observable processo
  - criar(dto) → Observable processo criado
  - atualizar(id, dto) → Observable
  - arquivar(id) → Observable
- [x] **T33** — Criar ListaProcessosComponent *(concluida em 2026-03-31 22:18)*
  - Filtros: area (text), status (select), periodo (date range)
  - Tabela Material: Nome, Area, Dono, Status, IPA Final, Data
  - Botao "+ Nova Avaliacao" → navega para wizard
  - Botao "Ver" por linha → navega para resultado

---

## G10 — Frontend: Wizard Avaliacao

- **T34** — Criar AvaliacaoService
  - criarAvaliacao(dto) → Observable avaliacao com IPA calculado
  - atualizarAvaliacao(id, dto) → Observable
  - salvarRascunho(id, dto) → Observable
  - buscarPorId(id) → Observable
  - exportarPdf(id) → Observable Blob
- **T35** — Criar WizardComponent (container)
  - MatStepper com linear=false
  - 6 steps como child components
  - FormGroup pai com subgroups por step
  - Navegacao: proximo/anterior + barra clicavel
  - Botao "Calcular e Salvar" no ultimo step (habilitado quando todos validos)
- **T36** — Criar StepIdentificacaoComponent
  - Campos: nome do processo, area, departamento, dono, solicitante, data do levantamento
  - Validacao: nome e area obrigatorios
- **T37** — Criar StepTecnicaComponent
  - 3 criterios: Seguranca e Acessos, Estabilidade do Legado, Estruturacao dos Dados
  - Cada criterio: slider ou radio 0-5 + descritores objetivos + campo justificativa (textarea)
  - Descritores carregados da metodologia (constante na lib shared)
- **T38** — Criar StepNegocioComponent
  - 3 blocos: Gestao de Risco (1 nota), Impacto no Cidadao (3 sub-notas), Eficiencia Operacional (2 sub-notas)
  - Cada nota: radio 0-5 + descritores + justificativa por bloco
  - Descritores carregados da metodologia
- **T39** — Criar StepImpedimentoComponent + StepUrgenciaComponent + StepRiscosComponent
  - Impedimento: radio com 5 opcoes (1.00, 0.80, 0.50, 0.20, 0.00) + descricao + justificativa
  - Urgencia: radio com 4 opcoes (1.20, 1.10, 1.00, 0.90) + descricao + justificativa
  - Riscos: tabela editavel com botao "+ Adicionar Risco" (campos: risco, protocolo contingencia)
- **T40** — Criar IpaPreviewComponent
  - Painel lateral fixo (visivel a partir do Step 2)
  - Usa calcularIPA() da lib shared em tempo real
  - Exibe: IT, IN, IPA Base, FI, FU, IPA Final, Status (badge colorido)
  - Atualiza reativamente via signals conforme usuario preenche

---

## G11 — Frontend: Resultado

- **T41** — Criar ResultadoComponent
  - Busca avaliacao por :id da rota
  - Secao "Identificacao do Processo"
  - Secao "Memoria de Calculo" com todas as notas, pesos, calculos parciais
  - Badge grande com IPA Final + status
- **T42** — Criar RadarChartComponent
  - Chart.js radar com 2 datasets: IT (criterios tecnicos) e IN (criterios negocio)
  - 6 eixos: Seguranca, Estabilidade, Estruturacao, Risco, Impacto, Eficiencia
- **T43** — Botoes de acao no resultado
  - "Editar" → abre wizard preenchido com dados da avaliacao
  - "Exportar PDF" → chama endpoint /pdf, faz download
  - "Voltar" → retorna para lista de processos

---

## G12 — Frontend: Usuarios + Organizacoes

- **T44** — Criar UsuariosService + ListaUsuariosComponent
  - CRUD completo com signals
  - Tabela: Nome, Email, Perfil (badge), Status
  - Dialog para criar/editar usuario
  - Filtro por perfil
  - Visivel apenas para admin
- **T45** — Criar OrganizacoesService + ListaOrganizacoesComponent
  - CRUD com signals
  - Tabela: Nome, Slug, Status, Data Criacao
  - Dialog para criar/editar
  - Visivel apenas para superadmin
- **T46** — Testes unitarios frontend
  - Vitest: AuthService (login, logout, isAuthenticated)
  - Vitest: calcularIPA (importado da lib shared)
  - Vitest: WizardComponent (navegacao entre steps)
  - Vitest: DashboardComponent (renderiza cards e tabela)

---

## G13 — E2E + Docker

- **T47** — Configurar Playwright
  - playwright.config.ts com baseURL frontend + api proxy
  - Auth setup compartilhado (login admin, salva session)
  - Projeto chromium
- **T48** — Testes E2E
  - login.spec.ts: login valido → dashboard, login invalido → erro
  - dashboard.spec.ts: cards resumo visiveis, tabela ranking com dados
  - wizard.spec.ts: preencher todos os 6 steps → salvar → verificar resultado com IPA calculado
  - processos.spec.ts: filtrar, ver detalhe
- **T49** — Docker Compose
  - Dockerfile frontend: node:22-alpine build → nginx:1.27-alpine serve
  - Dockerfile api: node:22-alpine build → node:22-alpine run
  - docker-compose.yml: api (porta 3000) + frontend (porta 80, proxy /api → api:3000)
  - Volume para SQLite persistir
- **T50** — Seed automatico + README
  - Seed roda automaticamente no primeiro boot da API (verifica se banco vazio)
  - README.md com instrucoes: como rodar (dev e docker), como acessar, credenciais seed
  - Screenshots do sistema no README

