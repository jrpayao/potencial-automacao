import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>Dashboard</h1><p>Em construcao...</p>`,
})
export class DashboardComponent {}
