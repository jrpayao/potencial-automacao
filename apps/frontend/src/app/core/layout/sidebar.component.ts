import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  private readonly allItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Processos', icon: 'account_tree', route: '/admin/processos' },
    {
      label: 'Usuários',
      icon: 'group',
      route: '/admin/usuarios',
      roles: [Perfil.ADMIN, Perfil.SUPERADMIN],
    },
    {
      label: 'Organizações',
      icon: 'corporate_fare',
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

  readonly userInitials = computed(() => {
    const name = this.authService.currentUser()?.nome || 'U';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  readonly userName = computed(() => this.authService.currentUser()?.nome || 'Usuário');
  
  readonly userRoleLabel = computed(() => {
    const role = this.authService.userPerfil();
    if (!role) return 'Visualizador';
    const labels: Record<string, string> = {
      [Perfil.SUPERADMIN]: 'Superadmin',
      [Perfil.ADMIN]: 'Administrador',
      [Perfil.ANALISTA]: 'Analista',
      [Perfil.VISUALIZADOR]: 'Visualizador'
    };
    return labels[role] || role;
  });

  onLogout(): void {
    this.authService.logout();
  }
}
