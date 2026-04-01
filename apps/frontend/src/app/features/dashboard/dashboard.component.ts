import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService, ResumoResult } from './dashboard.service';
import { RankingTableComponent } from './ranking-table.component';

interface SummaryCard {
  label: string;
  icon: string;
  color: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, RankingTableComponent],
  template: `
    <h1 class="page-title">Dashboard</h1>

    <div class="cards-row">
      @for (card of cards(); track card.label) {
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="card-icon" [style.background-color]="card.color + '1a'" [style.color]="card.color">
              <mat-icon>{{ card.icon }}</mat-icon>
            </div>
            <div class="card-info">
              <span class="card-value">{{ card.value }}</span>
              <span class="card-label">{{ card.label }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>

    <div class="ranking-section">
      <h2 class="section-title">Ranking de Processos</h2>
      <app-ranking-table />
    </div>
  `,
  styles: `
    .page-title {
      margin: 0 0 24px;
      font-size: 24px;
      font-weight: 500;
      color: #1e293b;
    }

    .cards-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .summary-card {
      border-radius: 12px;
    }

    .summary-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px !important;
    }

    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      flex-shrink: 0;
    }

    .card-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .card-info {
      display: flex;
      flex-direction: column;
    }

    .card-value {
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      color: #1e293b;
    }

    .card-label {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }

    .ranking-section {
      margin-top: 8px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 500;
      color: #1e293b;
      margin: 0 0 16px;
    }

    @media (max-width: 1024px) {
      .cards-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .cards-row {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class DashboardComponent implements OnInit {
  private readonly service = inject(DashboardService);

  readonly cards = signal<SummaryCard[]>([
    { label: 'Total Processos', icon: 'assessment', color: '#3b82f6', value: 0 },
    { label: 'Prioridade Alta', icon: 'priority_high', color: '#22c55e', value: 0 },
    { label: 'Backlog', icon: 'schedule', color: '#eab308', value: 0 },
    { label: 'Descarte', icon: 'cancel', color: '#ef4444', value: 0 },
  ]);

  ngOnInit(): void {
    this.service.getResumo().subscribe({
      next: (resumo: ResumoResult) => {
        this.cards.set([
          { label: 'Total Processos', icon: 'assessment', color: '#3b82f6', value: resumo.total },
          { label: 'Prioridade Alta', icon: 'priority_high', color: '#22c55e', value: resumo.prioridadeAlta },
          { label: 'Backlog', icon: 'schedule', color: '#eab308', value: resumo.backlog },
          { label: 'Descarte', icon: 'cancel', color: '#ef4444', value: resumo.descarte },
        ]);
      },
    });
  }
}
