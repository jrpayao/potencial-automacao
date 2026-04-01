import { Route } from '@angular/router';
import { authGuard, noAuthGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { Perfil } from '@ipa/shared';

export const appRoutes: Route[] = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'processos',
        loadComponent: () =>
          import('./features/processos/lista-processos.component').then(
            (m) => m.ListaProcessosComponent,
          ),
      },
      {
        path: 'avaliacoes/nova',
        loadComponent: () =>
          import('./features/avaliacao-wizard/wizard.component').then((m) => m.WizardComponent),
      },
      {
        path: 'avaliacoes/:id',
        loadComponent: () =>
          import('./features/resultado/resultado.component').then((m) => m.ResultadoComponent),
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: { roles: [Perfil.ADMIN, Perfil.SUPERADMIN] },
        loadComponent: () =>
          import('./features/usuarios/lista-usuarios.component').then(
            (m) => m.ListaUsuariosComponent,
          ),
      },
      {
        path: 'organizacoes',
        canActivate: [roleGuard],
        data: { roles: [Perfil.SUPERADMIN] },
        loadComponent: () =>
          import('./features/organizacoes/lista-organizacoes.component').then(
            (m) => m.ListaOrganizacoesComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin/dashboard' },
];
