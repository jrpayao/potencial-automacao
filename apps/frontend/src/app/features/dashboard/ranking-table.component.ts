import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { DashboardService, RankingItem } from './dashboard.service';

@Component({
  selector: 'app-ranking-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  template: `
    <div class="ranking-table-container">
      <table mat-table [dataSource]="items()" class="ranking-table">
        <ng-container matColumnDef="posicao">
          <th mat-header-cell *matHeaderCellDef>#</th>
          <td mat-cell *matCellDef="let row; let i = index">
            {{ (currentPage() - 1) * pageSize() + i + 1 }}
          </td>
        </ng-container>

        <ng-container matColumnDef="noProcesso">
          <th mat-header-cell *matHeaderCellDef>Nome do Processo</th>
          <td mat-cell *matCellDef="let row">{{ row.noProcesso }}</td>
        </ng-container>

        <ng-container matColumnDef="noArea">
          <th mat-header-cell *matHeaderCellDef>Area</th>
          <td mat-cell *matCellDef="let row">{{ row.noArea }}</td>
        </ng-container>

        <ng-container matColumnDef="vrIpaFinal">
          <th mat-header-cell *matHeaderCellDef>IPA Final</th>
          <td mat-cell *matCellDef="let row" class="col-number">
            {{ row.vrIpaFinal | number: '1.2-2' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="coStatusIpa">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let row">
            <span class="badge" [ngClass]="statusClass(row.coStatusIpa)">
              {{ statusLabel(row.coStatusIpa) }}
            </span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns"
          class="clickable-row"
          (click)="onRowClick(row)"
        ></tr>
      </table>

      <mat-paginator
        [length]="totalItems()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons
      ></mat-paginator>
    </div>
  `,
  styles: `
    .ranking-table-container {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .ranking-table {
      width: 100%;
    }

    .col-number {
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }

    .clickable-row {
      cursor: pointer;
    }

    .clickable-row:hover {
      background-color: #f5f5f5;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-prioridade-alta {
      background-color: #dcfce7;
      color: #166534;
    }

    .badge-backlog {
      background-color: #fef9c3;
      color: #854d0e;
    }

    .badge-descarte {
      background-color: #fee2e2;
      color: #991b1b;
    }
  `,
})
export class RankingTableComponent implements OnInit {
  private readonly service = inject(DashboardService);
  private readonly router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly displayedColumns = [
    'posicao',
    'noProcesso',
    'noArea',
    'vrIpaFinal',
    'coStatusIpa',
  ];

  readonly items = signal<RankingItem[]>([]);
  readonly totalItems = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = signal(20);

  ngOnInit(): void {
    this.loadData();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }

  onRowClick(row: RankingItem): void {
    this.router.navigate(['/admin/avaliacoes', row.idAvaliacao]);
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'prioridade_alta':
        return 'Prioridade Alta';
      case 'backlog':
        return 'Backlog';
      case 'descarte':
        return 'Descarte';
      default:
        return status;
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'prioridade_alta':
        return 'badge-prioridade-alta';
      case 'backlog':
        return 'badge-backlog';
      case 'descarte':
        return 'badge-descarte';
      default:
        return '';
    }
  }

  private loadData(): void {
    this.service.getRanking(this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.items.set(result.data);
        this.totalItems.set(result.total);
      },
    });
  }
}
