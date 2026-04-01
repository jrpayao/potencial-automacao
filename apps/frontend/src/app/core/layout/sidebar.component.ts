import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { Perfil } from '@ipa/shared';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: Perfil[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatListModule, MatButtonModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <span class="logo-text">IPA</span>
      </div>

      <mat-nav-list class="nav-items">
        @for (item of visibleItems(); track item.route) {
          <a
            mat-list-item
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-link"
          >
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </a>
        }
      </mat-nav-list>

      <div class="sidebar-footer">
        <button mat-button class="logout-button" (click)="onLogout()">
          <mat-icon>logout</mat-icon>
          <span>Sair</span>
        </button>
      </div>
    </nav>
  `,
  styles: `
    .sidebar {
      display: flex;
      flex-direction: column;
      width: 256px;
      height: 100vh;
      background-color: #000033;
      color: white;
      overflow-y: auto;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo-text {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 2px;
    }

    .nav-items {
      flex: 1;
      padding-top: 8px;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.7) !important;
      margin: 4px 8px;
      border-radius: 8px;
    }

    .nav-link:hover {
      color: white !important;
      background-color: rgba(255, 255, 255, 0.08) !important;
    }

    .nav-link.active {
      color: #000033 !important;
      background-color: white !important;
    }

    .nav-link mat-icon {
      color: inherit;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-button {
      width: 100%;
      color: rgba(255, 255, 255, 0.7);
      justify-content: flex-start;
    }

    .logout-button:hover {
      color: white;
    }
  `,
})
export class SidebarComponent {
  private readonly authService: AuthService;

  private readonly allItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Processos', icon: 'assignment', route: '/admin/processos' },
    {
      label: 'Usuarios',
      icon: 'group',
      route: '/admin/usuarios',
      roles: [Perfil.ADMIN, Perfil.SUPERADMIN],
    },
    {
      label: 'Organizacoes',
      icon: 'business',
      route: '/admin/organizacoes',
      roles: [Perfil.SUPERADMIN],
    },
  ];

  readonly visibleItems = computed(() => {
    const perfil = this.authService.userPerfil();
    return this.allItems.filter((item) => {
      if (!item.roles) return true;
      return perfil !== null && item.roles.includes(perfil);
    });
  });

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
