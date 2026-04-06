import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService, RankingItem } from './dashboard.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { CustomPaginatorComponent, PageChangeEvent } from '../../shared/components/custom-paginator/custom-paginator.component';

@Component({
  selector: 'app-ranking-table',
  standalone: true,
  imports: [CommonModule, DecimalPipe, StatusBadgeComponent, CustomPaginatorComponent],
  templateUrl: './ranking-table.component.html',
  styleUrls: ['./ranking-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingTableComponent implements OnInit {
  private readonly service = inject(DashboardService);
  private readonly router = inject(Router);

  readonly items = signal<RankingItem[]>([]);
  readonly totalItems = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = signal(20);

  readonly filteredItems = computed(() => {
    return this.items();
  });

  ngOnInit(): void {
    this.carregarDados();
  }

  onPageChange(event: PageChangeEvent): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.carregarDados();
  }

  verDetalhes(row: RankingItem): void {
    this.router.navigate(['/admin/avaliacoes', row.idAvaliacao]);
  }

  ipaColor(ipa: number): string {
    if (ipa >= 6) return '#16a34a'; // Verde
    if (ipa >= 3) return '#ca8a04'; // Amarelo
    return '#dc2626'; // Vermelho
  }

  private carregarDados(): void {
    this.service.getRanking(this.currentPage(), this.pageSize()).subscribe({
      next: (res) => {
        this.items.set(res.data);
        this.totalItems.set(res.total);
      },
    });
  }
}
