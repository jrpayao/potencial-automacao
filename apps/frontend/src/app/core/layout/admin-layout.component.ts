import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="admin-layout">
      <app-sidebar />
      <div class="main-area">
        <app-header />
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: `
    .admin-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .main-area {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background-color: #f5f5f5;
    }
  `,
})
export class AdminLayoutComponent {}
