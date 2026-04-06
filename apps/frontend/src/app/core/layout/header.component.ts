import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Perfil } from '@ipa/shared';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  readonly isMenuOpen = signal(false);

  readonly userName = computed(() => this.authService.currentUser()?.nome ?? 'Usuário');

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

  readonly initials = computed(() => {
    const nome = this.authService.currentUser()?.nome ?? '';
    const parts = nome.split(' ').filter((p) => p.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
