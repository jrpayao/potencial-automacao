# CHANGELOG — Sistema IPA

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
