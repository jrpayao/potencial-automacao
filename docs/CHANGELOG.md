# CHANGELOG — Linedata Dashboard Frontend

## [2026-03-30] — feat(paginas)
- SaudeDadosComponent: gauge, checklist, alertas CRÍTICOS, grid sensores com filtros, tabela falhas
- ListaProdutoComponent: tabs, filtros reativos computed, tabela expansível agentes, footer tokens
- ListaAgenteComponent: tabs, filtros, tabela expansível prompts, botão criar
- ListaPromptComponent: tabs, editor inline 3 tabs (Conteúdo/Identificação/Configuração), badge docs
- ListaProvedorComponent: tabs, API key mascarada, modelos chips
- ConsumoComponent: tabs, progress bar global, gráfico barras CSS
- ListaUsuarioComponent: CRUD, filtros por role, badges coloridos
- DashboardService com signals para KPIs
- T44/T50 (WebSocket real-time) adiadas — requer backend WS
- Tasks cobertas: T43, T45-T49, T51-T53

## [2026-03-30] — feat(services-crud)
- ProdutoService: CRUD completo com Signals + 7 testes Vitest
- AgenteService: CRUD completo com Signals
- PromptService: CRUD + listarHistorico(id) para versionamento
- ProvedorService: CRUD completo com Signals
- SensorService: somente leitura (listar + buscarPorId)
- ConsumoService: somente leitura, signal único consumo
- UsuarioService: CRUD completo com UsuarioAdminResponse
- Todos com offline check, métodos em português, padrão SDD §4.2
- 25 testes passando (5 test files), build OK
- Tasks cobertas: T35, T36, T37, T38, T39, T40, T41, T42

## [2026-03-30] — feat(compartilhados)
- KpiCardComponent: card reutilizável com ícone, título, valor, variação %, inputs via input()
- StatusBadgeComponent: badge com 10 status mapeados (ativo, inativo, online, offline, alerta, pendente, resolvido, investigando, rascunho, critico)
- GaugeChartComponent: gauge circular Chart.js (doughnut 270°), afterNextRender, effect para atualização reativa
- ExpandableTableComponent: tabela Material com multiTemplateDataRows, animation, content projection (#expandedRow, #cellTemplate)
- MaskApiKeyPipe: sk-abc123xyz → sk-****xyz
- RelativeTimePipe: timestamp → "há 5 min" com pluralização pt-BR
- HasRoleDirective: *appHasRole="['admin']" reativo via effect()
- ConfirmDialogComponent: dialog Material com 3 tipos (warn/danger/info)
- Build passa, 18 testes passando
- Tasks cobertas: T28, T29, T30, T31, T32, T33, T34

## [2026-03-27] — feat(layout)
- Rotas: app.routes (login + wildcard) e admin.routes (12 lazy-loaded pages com roleGuard)
- AdminLayoutComponent: shell com sidebar + header + body + offline-indicator
- SidebarComponent: menu azul marinho ($primary-dark), ícones Material, submenu "Configurar IA" expansível, item ativo, versão colapsável
- HeaderComponent: "Gestão Hídrica SP", busca pill, sino, engrenagem, avatar com iniciais + menu dropdown logout
- BodyComponent: wrapper com padding e background $surface
- OfflineIndicatorComponent: banner vermelho fixo quando offline
- LoginComponent: form email+senha, validação, lockout visual, fundo gradiente azul
- DashboardComponent: 7 KPI cards (sensores, alertas, vazão, pressão, qualidade, tokens, uptime) com dados mock
- 9 páginas stub (saúde-dados, produtos, agentes, prompts, provedores, consumo, usuários, bairros-setores, fórmulas)
- Cores e ícones corrigidos para fidelidade ao Figma
- Testes: LoginComponent (6 testes) — 18 testes passando total
- Screenshots capturadas em docs/evolucao/layout/
- Tasks cobertas: T19, T20, T21, T22, T23, T24, T25, T26, T27

## [2026-03-27] — feat(infra-codigo)
- Models: api-response, auth, produto, agente, prompt, provedor, sensor, consumo, usuario, organizacao
- Services: AuthService (JWT + refresh + lockout + signals), NetworkService, ErrorHandlerService, AnalyticsService, WebSocketService
- Interceptors: security, auth (refresh 401), retry (2x exponencial), http-error, logging (dev), mock
- Guards: authGuard, noAuthGuard, roleGuard, authGuardMatch
- Testes: AuthService (7 testes), Guards (3 testes) — Vitest
- Build passa, 12 testes passando
- Arquivos criados: 30 arquivos
- Tasks cobertas: T08, T09, T10, T11, T12, T13, T14, T15, T16, T17, T18

## [2026-03-27] — feat(mocks)
- MockInterceptor com 35 rotas mockadas e delay 300-800ms
- 10 arquivos de dados mock (auth, produtos, agentes, prompts, provedores, sensores, consumo, usuarios, dashboard, saude-dados)
- Flag `useMocks` nos environments (true em dev, false em prod)
- Dados realistas do domínio saneamento (SABESP, sensores SET-01 a SET-20)
- Tasks cobertas: T18b, T18c

## [2026-03-27] — feat(scaffold)
- Scaffold Angular 21.2 com standalone components e Zoneless
- Configuração de environments (dev + prod) com apiUrl e wsUrl
- app.config.ts com provideZonelessChangeDetection(), Router, HttpClient, AnimationsAsync, ServiceWorker
- Angular Material 21.2 com tema custom (Material 3, fonte Inter, paleta blue)
- Dependências: Chart.js 4, Dexie 4, ngx-mask 21, Vitest 4
- SCSS modular: _variables, _mixins, _main, _mobile, _dialogs, _snackbar, _angular-material-theme
- PWA configurado: manifest.webmanifest + ngsw-config.json com cache strategies
- TypeScript strict mode (Constitution §2.1)
- AppComponent com OnPush + standalone + RouterOutlet
- Build passa, Vitest (1 teste) passa
- Arquivos criados/modificados: 22 arquivos
- Tasks cobertas: T01, T02, T03, T04, T05, T06, T07
