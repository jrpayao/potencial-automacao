# Frontend IPA — 100% Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar o frontend IPA a 100% — commitar todo o trabalho existente no working directory, verificar o build, fazer deploy, remover código morto e implementar o que genuinamente falta (testes unitários + ajustes finais).

**Architecture:** O working directory já tem toda a implementação Stitch (Login, Dashboard, Wizard, Resultado, Usuários, Organizações, Layout) mas NUNCA foi commitada. O deploy usa `git archive` que só empacota arquivos commitados. A Fase 1 resolve isso. A Fase 2 limpa e finaliza.

**Tech Stack:** Angular 21 standalone + zoneless, SCSS, NestJS, SQLite, CapRover

---

## Fase 1 — Commit de todo o trabalho existente

### Task 1: Commitar shared components e styles globais

**Files:**
- Commit: `apps/frontend/src/app/shared/` (pasta inteira, untracked)
- Commit: `apps/frontend/src/styles.scss` (modificado)
- Commit: `apps/frontend/src/index.html` (modificado)

- [ ] **Step 1: Verificar conteúdo da pasta shared**

```bash
ls apps/frontend/src/app/shared/components/
```
Esperado: `custom-paginator/`, `page-header/`, `search-input/`, `status-badge/`

- [ ] **Step 2: Stage e commit dos shared components e styles**

```bash
git add apps/frontend/src/app/shared/
git add apps/frontend/src/styles.scss
git add apps/frontend/src/index.html
git commit -m "feat(frontend): adicionar shared components e styles globais Stitch"
```

---

### Task 2: Commitar core layout (AdminLayout, Header, Sidebar)

**Files:**
- Modify+Commit: `apps/frontend/src/app/core/layout/admin-layout.component.ts`
- New+Commit: `apps/frontend/src/app/core/layout/admin-layout.component.html`
- New+Commit: `apps/frontend/src/app/core/layout/admin-layout.component.scss`
- Modify+Commit: `apps/frontend/src/app/core/layout/header.component.ts`
- New+Commit: `apps/frontend/src/app/core/layout/header.component.html`
- New+Commit: `apps/frontend/src/app/core/layout/header.component.scss`
- Modify+Commit: `apps/frontend/src/app/core/layout/sidebar.component.ts`
- New+Commit: `apps/frontend/src/app/core/layout/sidebar.component.html`
- New+Commit: `apps/frontend/src/app/core/layout/sidebar.component.scss`

- [ ] **Step 1: Stage e commit do layout**

```bash
git add apps/frontend/src/app/core/layout/
git commit -m "feat(layout): refatorar AdminLayout, Header e Sidebar para design Stitch"
```

---

### Task 3: Commitar Login (Stitch)

**Files:**
- Modify+Commit: `apps/frontend/src/app/features/login/login.component.ts`
- New+Commit: `apps/frontend/src/app/features/login/login.component.html`
- New+Commit: `apps/frontend/src/app/features/login/login.component.scss`
- Modify+Commit: `apps/frontend/src/app/core/auth/auth.service.ts`
- Modify+Commit: `apps/frontend/src/app/app.config.ts`

- [ ] **Step 1: Stage e commit do login e auth**

```bash
git add apps/frontend/src/app/features/login/
git add apps/frontend/src/app/core/auth/
git add apps/frontend/src/app/app.config.ts
git commit -m "feat(login): refatorar LoginComponent para design Stitch (fundo navy, card branco)"
```

---

### Task 4: Commitar Dashboard e Ranking Table (Stitch)

**Files:**
- Modify+Commit: `apps/frontend/src/app/features/dashboard/dashboard.component.ts`
- New+Commit: `apps/frontend/src/app/features/dashboard/dashboard.component.html`
- New+Commit: `apps/frontend/src/app/features/dashboard/dashboard.component.scss`
- Modify+Commit: `apps/frontend/src/app/features/dashboard/dashboard.service.ts`
- Modify+Commit: `apps/frontend/src/app/features/dashboard/ranking-table.component.ts`
- New+Commit: `apps/frontend/src/app/features/dashboard/ranking-table.component.html`
- New+Commit: `apps/frontend/src/app/features/dashboard/ranking-table.component.scss`

- [ ] **Step 1: Stage e commit do dashboard**

```bash
git add apps/frontend/src/app/features/dashboard/
git commit -m "feat(dashboard): refatorar Dashboard e RankingTable para design Stitch"
```

---

### Task 5: Commitar Lista de Processos (Stitch)

**Files:**
- Modify+Commit: `apps/frontend/src/app/features/processos/lista-processos.component.ts`
- New+Commit: `apps/frontend/src/app/features/processos/lista-processos.component.html`
- New+Commit: `apps/frontend/src/app/features/processos/lista-processos.component.scss`
- Modify+Commit: `apps/frontend/src/app/features/processos/processos.service.ts`

- [ ] **Step 1: Stage e commit de processos**

```bash
git add apps/frontend/src/app/features/processos/
git commit -m "feat(processos): refatorar ListaProcessos para design Stitch"
```

---

### Task 6: Commitar Resultado e RadarChart

**Files:**
- Modify+Commit: `apps/frontend/src/app/features/resultado/resultado.component.ts`
- Modify+Commit: `apps/frontend/src/app/features/resultado/radar-chart.component.ts`

- [ ] **Step 1: Stage e commit do resultado**

```bash
git add apps/frontend/src/app/features/resultado/
git commit -m "feat(resultado): implementar ResultadoComponent e RadarChartComponent"
```

---

### Task 7: Commitar Usuários e Organizações

**Files:**
- Modify+Commit: `apps/frontend/src/app/features/usuarios/lista-usuarios.component.ts`
- New+Commit: `apps/frontend/src/app/features/usuarios/lista-usuarios.component.html`
- New+Commit: `apps/frontend/src/app/features/usuarios/lista-usuarios.component.scss`
- Modify+Commit: `apps/frontend/src/app/features/usuarios/usuarios.service.ts`
- Modify+Commit: `apps/frontend/src/app/features/organizacoes/lista-organizacoes.component.ts`
- New+Commit: `apps/frontend/src/app/features/organizacoes/lista-organizacoes.component.html`
- New+Commit: `apps/frontend/src/app/features/organizacoes/lista-organizacoes.component.scss`
- Modify+Commit: `apps/frontend/src/app/features/organizacoes/organizacoes.service.ts`

- [ ] **Step 1: Stage e commit de usuários e organizações**

```bash
git add apps/frontend/src/app/features/usuarios/
git add apps/frontend/src/app/features/organizacoes/
git commit -m "feat(gestao): implementar ListaUsuarios e ListaOrganizacoes com design Stitch"
```

---

### Task 8: Limpar código morto e atualizar TASKS.md

**Files:**
- Delete: `apps/frontend/src/app/features/avaliacao-wizard/step-identificacao.component.ts`
- Delete: `apps/frontend/src/app/features/avaliacao-wizard/step-impedimento.component.ts`
- Delete: `apps/frontend/src/app/features/avaliacao-wizard/step-negocio.component.ts`
- Delete: `apps/frontend/src/app/features/avaliacao-wizard/step-riscos.component.ts`
- Delete: `apps/frontend/src/app/features/avaliacao-wizard/step-tecnica.component.ts`
- Delete: `apps/frontend/src/app/features/avaliacao-wizard/step-urgencia.component.ts`
- Delete: `apps/frontend/src/app/features/avaliacao-wizard/ipa-preview.component.ts`
- Modify: `docs/sdd/TASKS.md`
- Modify: `docs/CHANGELOG.md`

- [ ] **Step 1: Remover arquivos mortos da raiz do wizard**

```bash
git rm apps/frontend/src/app/features/avaliacao-wizard/step-identificacao.component.ts
git rm apps/frontend/src/app/features/avaliacao-wizard/step-impedimento.component.ts
git rm apps/frontend/src/app/features/avaliacao-wizard/step-negocio.component.ts
git rm apps/frontend/src/app/features/avaliacao-wizard/step-riscos.component.ts
git rm apps/frontend/src/app/features/avaliacao-wizard/step-tecnica.component.ts
git rm apps/frontend/src/app/features/avaliacao-wizard/step-urgencia.component.ts
git rm apps/frontend/src/app/features/avaliacao-wizard/ipa-preview.component.ts
```

- [ ] **Step 2: Marcar tasks concluídas no TASKS.md**

Abrir `docs/sdd/TASKS.md` e atualizar as seguintes tasks para `[x]` com timestamp `2026-04-06`:
- T41 (ResultadoComponent), T42 (RadarChartComponent), T43 (botões resultado)
- T44 (UsuariosService + ListaUsuariosComponent)
- T45 (OrganizacoesService + ListaOrganizacoesComponent)
- T56 (Login Stitch), T57 (Wizard container Stitch)
- T58 (Steps 1-3 Stitch), T59 (Steps 4-6 Stitch), T60 (IpaPreview Stitch)
- T61 (Resultado Stitch), T62 (ListaUsuarios Stitch), T63 (ListaOrganizacoes Stitch)

- [ ] **Step 3: Atualizar CHANGELOG**

Adicionar ao `docs/CHANGELOG.md`:

```markdown
## [2026-04-06] — feat(frontend): completar implementação e design Stitch

- Commitado todo o trabalho existente no working directory
- Shared components: PageHeader, StatusBadge, SearchInput, CustomPaginator
- Layout Stitch: AdminLayout, Header, Sidebar
- Login Stitch: fundo navy, card branco, logo IPA
- Dashboard + RankingTable Stitch
- Lista Processos Stitch
- Resultado + RadarChart implementados
- ListaUsuarios + ListaOrganizacoes com design Stitch
- Wizard reorganizado em steps/ (código morto removido)
- Tasks cobertas: T41-T45, T56-T63
```

- [ ] **Step 4: Commit de limpeza + documentação**

```bash
git add docs/sdd/TASKS.md docs/CHANGELOG.md
git commit -m "chore(cleanup): remover steps obsoletos e atualizar TASKS.md + CHANGELOG"
```

---

## Fase 2 — Build, Deploy e Verificação

### Task 9: Build local para verificar compilação

**Files:** Nenhum (só verificação)

- [ ] **Step 1: Rodar build de produção**

```bash
npm run build:frontend 2>&1 | tail -30
```
Esperado: `Successfully ran target build for project frontend`

Se falhar com erro de import/módulo:
- Verificar se o componente importado existe no caminho indicado
- Verificar se shared components estão exportados corretamente

- [ ] **Step 2: Se houver erro de compilação, corrigir antes de prosseguir**

Ler a mensagem de erro. Os erros mais prováveis são:
- `Cannot find module '../../shared/components/...'` → verificar caminho relativo
- `'app-page-header' is not a known element` → verificar imports no `@Component({ imports: [...] })`
- `Property 'X' does not exist on type 'Y'` → verificar interface no shared

---

### Task 10: Deploy e smoke test

**Files:** Nenhum

- [ ] **Step 1: Deploy do frontend**

```bash
npm run deploy:frontend
```
Esperado: `Deploy de ipa-frontend concluido!`

- [ ] **Step 2: Verificar login em produção**

Acessar `http://ipa-frontend.payao.tech/login`

Checklist visual (comparar com `docs/stitch/login_ipa/screen.png`):
- [ ] Fundo navy/dark blue
- [ ] Card branco centralizado
- [ ] Logo "IPA" em destaque
- [ ] Campos email + senha
- [ ] Botão "ENTRAR" azul escuro

- [ ] **Step 3: Testar fluxo de login**

Usar credenciais do seed: `admin@ipa.gov.br` / `Admin@123` (ou conforme seed)

Após login, verificar:
- [ ] Redireciona para `/admin/dashboard`
- [ ] Sidebar visível com itens: Dashboard, Processos, Usuários, Organizações
- [ ] Header com nome do usuário

- [ ] **Step 4: Verificar cada tela**

| Tela | URL | Referência Stitch |
|------|-----|-------------------|
| Dashboard | `/admin/dashboard` | `docs/stitch/dashboard_ipa/screen.png` |
| Processos | `/admin/processos` | `docs/stitch/processos_ipa/screen.png` |
| Usuários | `/admin/usuarios` | `docs/stitch/usu_rios_ipa/screen.png` |
| Organizações | `/admin/organizacoes` | `docs/stitch/organiza_es_ipa/screen.png` |

---

## Fase 3 — Finalização

### Task 11: Testes unitários frontend (T46)

**Files:**
- Create: `apps/frontend/src/app/features/resultado/resultado.component.spec.ts`
- Create: `apps/frontend/src/app/features/usuarios/lista-usuarios.component.spec.ts`
- Create: `apps/frontend/src/app/features/organizacoes/lista-organizacoes.component.spec.ts`

- [ ] **Step 1: Criar spec do ResultadoComponent**

Criar `apps/frontend/src/app/features/resultado/resultado.component.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ResultadoComponent } from './resultado.component';
import { AvaliacaoService } from '../avaliacao-wizard/avaliacao.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const mockAvaliacao = {
  id: 1,
  ipaFinal: 4.5,
  indiceTecnico: 4.0,
  indiceNegocio: 5.0,
  ipaBase: 4.5,
  fatorImpedimento: 1.0,
  fatorUrgencia: 1.0,
  notaSegurancaAcessos: 4,
  notaEstabilidadeLegado: 4,
  notaEstruturacaoDados: 4,
  notaGestaoRisco: 5,
  notaExperienciaCidadao: 5,
  notaFteLiberado: 5,
  riscosContingencia: '',
  criadoEm: '2026-04-06',
};

describe('ResultadoComponent', () => {
  let avaliacaoServiceSpy: jasmine.SpyObj<AvaliacaoService>;

  beforeEach(async () => {
    avaliacaoServiceSpy = jasmine.createSpyObj('AvaliacaoService', ['buscarPorId', 'exportarPdf']);
    avaliacaoServiceSpy.buscarPorId.and.returnValue(of(mockAvaliacao as any));

    await TestBed.configureTestingModule({
      imports: [ResultadoComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AvaliacaoService, useValue: avaliacaoServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(ResultadoComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve classificar IPA >= 4 como alto', () => {
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.badgeClass()).toBe('alto');
  });

  it('deve classificar IPA entre 2.5 e 4 como medio', () => {
    avaliacaoServiceSpy.buscarPorId.and.returnValue(
      of({ ...mockAvaliacao, ipaFinal: 3.0 } as any)
    );
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.badgeClass()).toBe('medio');
  });

  it('deve classificar IPA < 2.5 como baixo', () => {
    avaliacaoServiceSpy.buscarPorId.and.returnValue(
      of({ ...mockAvaliacao, ipaFinal: 2.0 } as any)
    );
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.badgeClass()).toBe('baixo');
  });
});
```

- [ ] **Step 2: Criar spec do ListaUsuariosComponent**

Criar `apps/frontend/src/app/features/usuarios/lista-usuarios.component.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ListaUsuariosComponent } from './lista-usuarios.component';
import { UsuariosService } from './usuarios.service';
import { of } from 'rxjs';
import { Perfil, SituacaoUsuario } from '@ipa/shared';

const mockUsuarios = [
  { id: 1, nome: 'João Silva', email: 'joao@org.gov.br', perfil: Perfil.ANALISTA, situacao: SituacaoUsuario.ATIVO, organizacaoId: 1 },
  { id: 2, nome: 'Maria Souza', email: 'maria@org.gov.br', perfil: Perfil.ADMIN, situacao: SituacaoUsuario.INATIVO, organizacaoId: 1 },
];

describe('ListaUsuariosComponent', () => {
  let usuariosServiceSpy: jasmine.SpyObj<UsuariosService>;

  beforeEach(async () => {
    usuariosServiceSpy = jasmine.createSpyObj('UsuariosService', ['listar', 'criar', 'atualizar', 'alterarSituacao']);
    usuariosServiceSpy.listar.and.returnValue(of(mockUsuarios as any));

    await TestBed.configureTestingModule({
      imports: [ListaUsuariosComponent],
      providers: [
        provideHttpClient(),
        { provide: UsuariosService, useValue: usuariosServiceSpy },
      ],
    }).compileComponents();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve carregar lista de usuários ao inicializar', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    expect(usuariosServiceSpy.listar).toHaveBeenCalled();
    expect(fixture.componentInstance.usuarios().length).toBe(2);
  });

  it('deve filtrar usuários por nome', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('joão');
    expect(fixture.componentInstance.filteredUsuarios().length).toBe(1);
    expect(fixture.componentInstance.filteredUsuarios()[0].nome).toBe('João Silva');
  });

  it('deve filtrar usuários por email', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('maria@');
    expect(fixture.componentInstance.filteredUsuarios().length).toBe(1);
  });

  it('deve retornar todos quando busca está vazia', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('');
    expect(fixture.componentInstance.filteredUsuarios().length).toBe(2);
  });
});
```

- [ ] **Step 3: Criar spec do ListaOrganizacoesComponent**

Criar `apps/frontend/src/app/features/organizacoes/lista-organizacoes.component.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ListaOrganizacoesComponent } from './lista-organizacoes.component';
import { OrganizacoesService } from './organizacoes.service';
import { of } from 'rxjs';

const mockOrgs = [
  { id: 1, nome: 'Secretaria do Tesouro', slug: 'stn', situacao: 'A', criadoEm: '2026-01-01' },
  { id: 2, nome: 'Polícia Federal', slug: 'pf', situacao: 'I', criadoEm: '2026-01-02' },
];

describe('ListaOrganizacoesComponent', () => {
  let orgServiceSpy: jasmine.SpyObj<OrganizacoesService>;

  beforeEach(async () => {
    orgServiceSpy = jasmine.createSpyObj('OrganizacoesService', ['listar', 'criar', 'atualizar', 'arquivar', 'ativar']);
    orgServiceSpy.listar.and.returnValue(of(mockOrgs as any));

    await TestBed.configureTestingModule({
      imports: [ListaOrganizacoesComponent],
      providers: [
        provideHttpClient(),
        { provide: OrganizacoesService, useValue: orgServiceSpy },
      ],
    }).compileComponents();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve carregar lista ao inicializar', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    fixture.detectChanges();
    expect(orgServiceSpy.listar).toHaveBeenCalled();
    expect(fixture.componentInstance.organizacoes().length).toBe(2);
  });

  it('deve filtrar organizações por nome', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('tesouro');
    expect(fixture.componentInstance.filteredOrganizacoes().length).toBe(1);
  });

  it('deve filtrar organizações por slug', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('pf');
    expect(fixture.componentInstance.filteredOrganizacoes().length).toBe(1);
    expect(fixture.componentInstance.filteredOrganizacoes()[0].slug).toBe('pf');
  });
});
```

- [ ] **Step 4: Rodar os testes**

```bash
npx nx test frontend --testFile=apps/frontend/src/app/features/resultado/resultado.component.spec.ts
npx nx test frontend --testFile=apps/frontend/src/app/features/usuarios/lista-usuarios.component.spec.ts
npx nx test frontend --testFile=apps/frontend/src/app/features/organizacoes/lista-organizacoes.component.spec.ts
```
Esperado: todos os testes passando (PASS)

- [ ] **Step 5: Commit dos testes**

```bash
git add apps/frontend/src/app/features/resultado/resultado.component.spec.ts
git add apps/frontend/src/app/features/usuarios/lista-usuarios.component.spec.ts
git add apps/frontend/src/app/features/organizacoes/lista-organizacoes.component.spec.ts
git commit -m "test(frontend): testes unitarios para Resultado, Usuarios e Organizacoes"
```

---

### Task 12: Configurar CORS na API e deploy final

**Files:** Nenhum (configuração no CapRover)

- [ ] **Step 1: Configurar CORS_ORIGIN no ipa-api do CapRover**

No painel CapRover → Apps → ipa-api → App Configs → Environment Variables:

| Variável | Valor |
|---|---|
| `CORS_ORIGIN` | `http://ipa-frontend.payao.tech` |

Clicar em **Save & Update**

- [ ] **Step 2: Deploy final completo**

```bash
npm run deploy:frontend
```

- [ ] **Step 3: Teste end-to-end manual**

1. Acessar `http://ipa-frontend.payao.tech/login`
2. Login com credenciais do seed
3. Navegar pelo Dashboard → verificar cards e ranking
4. Clicar em "Processos" → verificar tabela
5. Clicar em "+ Nova Avaliação" → verificar wizard abre no Step 1
6. Preencher os 6 steps → salvar
7. Verificar que vai para a tela de Resultado
8. Clicar em "Exportar PDF" → verificar download

- [ ] **Step 4: Atualizar TASKS.md com T46, T64, T65**

Abrir `docs/sdd/TASKS.md` e marcar:
- `[x] T46 — Testes unitários frontend *(concluída em 2026-04-06)*`
- `[x] T64 — Deploy e verificação da API em produção *(concluída em 2026-04-06)*`

```bash
git add docs/sdd/TASKS.md docs/CHANGELOG.md
git commit -m "docs: marcar tasks finais concluidas — sistema 100%"
```

---

## Resumo de Tasks TASKS.md a marcar como concluídas

| Task | Descrição | Fase |
|------|-----------|------|
| T41 | ResultadoComponent | 1 |
| T42 | RadarChartComponent | 1 |
| T43 | Botões resultado | 1 |
| T44 | ListaUsuariosComponent | 1 |
| T45 | ListaOrganizacoesComponent | 1 |
| T46 | Testes unitários frontend | 3 |
| T56 | Login Stitch | 1 |
| T57 | Wizard container Stitch | 1 |
| T58 | Steps 1-3 Stitch | 1 |
| T59 | Steps 4-6 Stitch | 1 |
| T60 | IpaPreview Stitch | 1 |
| T61 | Resultado Stitch | 1 |
| T62 | ListaUsuarios Stitch | 1 |
| T63 | ListaOrganizacoes Stitch | 1 |

**Meta: 63/63 tasks (100%)**
