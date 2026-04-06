import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, ResumoResult } from './dashboard.service';
import { RankingTableComponent } from './ranking-table.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

interface SummaryCard {
  label: string;
  sublabel: string;
  accent: string;
  value: number;
  countColor: string;
  countBg: string;
  hasAccentBar: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RankingTableComponent, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly service = inject(DashboardService);
  private readonly router = inject(Router);

  readonly cards = signal<SummaryCard[]>([
    {
      label: 'Total Processos',
      sublabel: 'Base de Dados IPA',
      accent: '#3b82f6',
      countColor: '#2563eb',
      countBg: '#eff6ff',
      value: 0,
      hasAccentBar: false,
    },
    {
      label: 'Prioridade Alta',
      sublabel: 'Potencial Imediato',
      accent: '#22c55e',
      countColor: '#16a34a',
      countBg: '#f0fdf4',
      value: 0,
      hasAccentBar: true,
    },
    {
      label: 'Backlog',
      sublabel: 'Média Complexidade',
      accent: '#eab308',
      countColor: '#ca8a04',
      countBg: '#fefce8',
      value: 0,
      hasAccentBar: true,
    },
    {
      label: 'Descarte',
      sublabel: 'Baixo Retorno',
      accent: '#ef4444',
      countColor: '#dc2626',
      countBg: '#fef2f2',
      value: 0,
      hasAccentBar: true,
    },
  ]);

  ngOnInit(): void {
    this.service.getResumo().subscribe({
      next: (resumo: ResumoResult) => {
        this.cards.update((prev) =>
          prev.map((c, i) => ({
            ...c,
            value: [resumo.total, resumo.prioridadeAlta, resumo.backlog, resumo.descarte][i],
          }))
        );
      },
    });
  }

  getIconFor(label: string): string {
    switch (label) {
      case 'Total Processos': return 'database';
      case 'Prioridade Alta': return 'bolt';
      case 'Backlog': return 'assignment_late';
      case 'Descarte': return 'delete_sweep';
      default: return 'analytics';
    }
  }

  novoProcesso(): void {
    this.router.navigate(['/admin/avaliacoes/nova']);
  }
}
