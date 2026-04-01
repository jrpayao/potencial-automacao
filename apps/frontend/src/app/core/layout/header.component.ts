import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <mat-toolbar class="header-toolbar">
      <span class="header-title">Sistema IPA</span>
      <span class="spacer"></span>

      <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
        <div class="avatar">{{ initials() }}</div>
        <span class="user-name">{{ userName() }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item (click)="onLogout()">
          <mat-icon>logout</mat-icon>
          <span>Sair</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: `
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      height: 64px;
      background-color: #ffffff;
      color: #1a1a2e;
      border-bottom: 1px solid #e0e0e0;
    }

    .header-title {
      font-size: 18px;
      font-weight: 600;
    }

    .spacer {
      flex: 1;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #003461;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
    }
  `,
})
export class HeaderComponent {
  private readonly authService: AuthService;

  readonly userName = computed(() => this.authService.currentUser()?.nome ?? 'Usuario');

  readonly initials = computed(() => {
    const nome = this.authService.currentUser()?.nome ?? '';
    const parts = nome.split(' ').filter((p) => p.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
