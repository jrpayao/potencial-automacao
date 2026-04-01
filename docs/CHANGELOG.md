# CHANGELOG — Sistema IPA

## [2026-03-31] — feat(usuarios-organizacoes)
- UsuariosService: listar, criar, atualizar, desativar
- ListaUsuariosComponent: mat-table com badges por perfil/status, filtro por perfil, dialog criar/editar
- OrganizacoesService: listar, criar, atualizar
- ListaOrganizacoesComponent: mat-table, dialog criar/editar com validacao slug
- Testes unitarios: AuthService (isAuthenticated, logout), calcularIPA (casos edge)
- Tasks cobertas: T44, T45, T46

## [2026-03-31] — feat(resultado)
- ResultadoComponent: identificacao, memoria de calculo (IT/IN/IPA com pesos), badge IPA Final, riscos
- RadarChartComponent: Chart.js radar 6 eixos (2 datasets IT/IN), escala 0-5, afterNextRender
- Botoes acao: Editar (wizard?edit=id), Exportar PDF (download blob), Voltar
- Tasks cobertas: T41, T42, T43

## [2026-03-31 22:30] — feat(wizard)
- AvaliacaoService: criar, atualizar, rascunho, buscarPorId, exportarPdf
- WizardComponent: MatStepper hibrido 6 steps, layout 70/30 com preview lateral
- StepIdentificacaoComponent: nome, area, departamento, dono, solicitante, data
- StepTecnicaComponent: 3 criterios (Seguranca, Estabilidade, Estruturacao) com radio 0-5 + descritores + justificativa
- StepNegocioComponent: Gestao de Risco, Impacto no Cidadao (3 sub), Eficiencia (2 sub)
- StepImpedimentoComponent: radio 5 opcoes FI + justificativa
- StepUrgenciaComponent: radio 4 opcoes FU + justificativa
- StepRiscosComponent: tabela editavel risco/contingencia
- IpaPreviewComponent: calculo reativo em tempo real (IT, IN, IPA Base/Final, badge status)
- Tasks cobertas: T34, T35, T36, T37, T38, T39, T40

## [2026-03-31 22:20] — feat(processos)
- ProcessosService: listar (com filtros), buscarPorId, criar, atualizar, arquivar
- ListaProcessosComponent: filtros (area, status, periodo), mat-table com 7 colunas, badges coloridos por status, paginacao, botao Nova Avaliacao, botao Ver por linha
- Tasks cobertas: T32, T33

## [2026-03-31 22:10] — feat(dashboard)
- DashboardService: getRanking (paginado), getResumo (contagens por status)
- DashboardComponent: 4 cards resumo (Total, Prioridade Alta, Backlog, Descarte) com grid responsivo
- RankingTableComponent: mat-table com posicao, nome, area, IPA Final, badge status colorido, paginacao, clique navega para resultado
- Tasks cobertas: T29, T30, T31

## [2026-03-31 10:30] — feat(layout)
- AdminLayoutComponent: shell com sidebar 256px + header 64px + body scrollavel
- SidebarComponent: menu com icones Material, items condicionais por perfil, routerLinkActive, botao Sair
- HeaderComponent: toolbar com titulo, avatar iniciais, dropdown menu com Sair
- Rotas completas: /login (noAuthGuard), /admin (authGuard) com 6 children lazy-loaded, roleGuard
- 6 stub components criados (dashboard, processos, wizard, resultado, usuarios, organizacoes)
- Tasks cobertas: T26, T27, T28

## [2026-03-31] — feat(frontend-auth)
- Angular Material instalado com tema custom (paleta azul, fonte Inter)
- SCSS variables: $primary, $primary-dark, $surface, $success, $warning, $danger
- AuthService com signals (isAuthenticated, currentUser), login/refresh/logout
- HttpInterceptor: Bearer token + refresh automatico em 401
- Guards: authGuard, noAuthGuard, roleGuard
- LoginComponent: form reativo, card centralizado, gradiente azul, toggle senha
- Rotas configuradas com lazy loading e guards
- Tasks cobertas: T22, T23, T24, T25

## [2026-03-30 23:07] — feat(dashboard-pdf)
- DashboardModule: GET /api/dashboard/ranking (JOIN processos+avaliacoes, paginado, tenant scoped), GET /api/dashboard/resumo (contagem por status)
- PdfService: export PDF com pdfmake (6 secoes: identificacao, tecnica, negocio, fatores, riscos, resultado)
- GET /api/avaliacoes/:id/pdf → Content-Type: application/pdf
- Testes E2E backend: auth, CRUD processo, avaliacao+IPA, PDF export, dashboard, tenant isolation
- Tasks cobertas: T19, T20, T21

## [2026-03-30 22:40] — feat(crud-calculo)
- calcularIPA lib shared: 6 funcoes puras (calcularIT, calcularIN, calcularIPA, etc.) + 22 testes
- CRUD Organizacoes: GET/POST/PATCH com @Roles(SUPERADMIN)
- CRUD Usuarios: GET/POST/PATCH/DELETE com hash bcrypt e tenant scoping
- CRUD Processos: GET (filtros area/status/periodo)/POST/PATCH/DELETE com tenant scoping
- CRUD Avaliacoes: POST (calcula IPA), GET, PATCH (recalcula), rascunho
- Seed: 1 org, 2 usuarios, 3 processos com avaliacoes (IPA 5.54, 3.12, 0.78)
- 27 testes passando (22 calculo + 5 auth)
- Tasks cobertas: T13, T14, T15, T16, T17, T18

## [2026-03-30] — feat(auth)
- AuthModule: login (bcrypt), refresh token, logout, me
- JwtStrategy + JwtAuthGuard (Bearer token)
- RolesGuard com hierarquia superadmin > admin > analista > visualizador
- TenantGuard + @CurrentUser decorator
- 5 testes unitarios passando (auth.service.spec.ts)
- Arquivos criados: auth.module, auth.service, auth.controller, jwt.strategy, jwt-auth.guard, roles.guard, roles.decorator, tenant.guard, current-user.decorator
- Tasks cobertas: T09, T10, T11, T12

## [2026-03-30] — feat(database)
- DatabaseModule com TypeORM + better-sqlite3 (data/ipa.sqlite)
- Entity Organizacao → IPATB001_ORGANIZACAO
- Entity Usuario → IPATB002_USUARIO (FK Organizacao)
- Entity Processo → IPATB003_PROCESSO (FK Organizacao, Usuario)
- Entity Avaliacao → IPATB004_AVALIACAO (todas dimensoes, fatores, calculados)
- Nomenclatura conforme Guia de Diagramacao (classes ID, NO, DE, IC, CO, TS, NU, VR, DT)
- Tasks cobertas: T05, T06, T07, T08

## [2026-03-30] — feat(scaffold)
- Workspace Nx 22 com Angular 21 + NestJS + lib shared
- Angular: standalone, zoneless, SCSS, environments (dev/prod)
- NestJS: ValidationPipe global, prefixo /api, CORS
- Lib shared (@ipa/shared): enums (StatusIpa, Perfil, SituacaoProcesso, FatorImpedimento, FatorUrgencia), interfaces (IOrganizacao, IUsuario, IProcesso, IAvaliacao), DTOs (Login, CreateProcesso, CreateAvaliacao, UpdateAvaliacao)
- 3 builds passando (shared, api, frontend)
- Tasks cobertas: T01, T02, T03, T04
