import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProcessosService, ProcessoItem } from './processos.service';

@Component({
  selector: 'app-lista-processos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="page-header">
      <h1 class="page-title">Processos</h1>
      <button mat-flat-button color="primary" (click)="novaAvaliacao()">
        <mat-icon>add</mat-icon>
        Nova Avaliacao
      </button>
    </div>

    <div class="filters-row">
      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Area</mat-label>
        <input matInput [(ngModel)]="filtroArea" (ngModelChange)="onFiltroChange()" placeholder="Filtrar por area" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="filtroStatus" (ngModelChange)="onFiltroChange()">
          <mat-option value="">Todos</mat-option>
          <mat-option value="rascunho">Rascunho</mat-option>
          <mat-option value="avaliado">Avaliado</mat-option>
          <mat-option value="arquivado">Arquivado</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Data Inicio</mat-label>
        <input matInput [matDatepicker]="pickerInicio" [(ngModel)]="filtroDataInicio" (dateChange)="onFiltroChange()" />
        <mat-datepicker-toggle matIconSuffix [for]="pickerInicio"></mat-datepicker-toggle>
        <mat-datepicker #pickerInicio></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Data Fim</mat-label>
        <input matInput [matDatepicker]="pickerFim" [(ngModel)]="filtroDataFim" (dateChange)="onFiltroChange()" />
        <mat-datepicker-toggle matIconSuffix [for]="pickerFim"></mat-datepicker-toggle>
        <mat-datepicker #pickerFim></mat-datepicker>
      </mat-form-field>
    </div>

    <div class="table-container">
      <table mat-table [dataSource]="items()" class="processos-table">
        <ng-container matColumnDef="noProcesso">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let row">{{ row.noProcesso }}</td>
        </ng-container>

        <ng-container matColumnDef="noArea">
          <th mat-header-cell *matHeaderCellDef>Area</th>
          <td mat-cell *matCellDef="let row">{{ row.noArea }}</td>
        </ng-container>

        <ng-container matColumnDef="noDono">
          <th mat-header-cell *matHeaderCellDef>Dono</th>
          <td mat-cell *matCellDef="let row">{{ row.noDono }}</td>
        </ng-container>

        <ng-container matColumnDef="coStatus">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let row">
            <span class="badge" [ngClass]="statusClass(row.coStatus)">
              {{ statusLabel(row.coStatus) }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="vrIpaFinal">
          <th mat-header-cell *matHeaderCellDef>IPA Final</th>
          <td mat-cell *matCellDef="let row" class="col-number">
            {{ row.vrIpaFinal != null ? (row.vrIpaFinal | number: '1.2-2') : '—' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="dtLevantamento">
          <th mat-header-cell *matHeaderCellDef>Data Levantamento</th>
          <td mat-cell *matCellDef="let row">
            {{ row.dtLevantamento | date: 'dd/MM/yyyy' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row">
            <button mat-stroked-button (click)="verProcesso(row); $event.stopPropagation()">
              Ver
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns"
          class="clickable-row"
          (click)="verProcesso(row)"
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
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: #1e293b;
    }

    .filters-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .filter-field {
      flex: 1;
      min-width: 180px;
      max-width: 260px;
    }

    .table-container {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .processos-table {
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

    .badge-rascunho {
      background-color: #e2e8f0;
      color: #475569;
    }

    .badge-avaliado {
      background-color: #dcfce7;
      color: #166534;
    }

    .badge-arquivado {
      background-color: #ffedd5;
      color: #9a3412;
    }

    @media (max-width: 768px) {
      .filters-row {
        flex-direction: column;
      }

      .filter-field {
        max-width: 100%;
      }
    }
  `,
  providers: [DatePipe],
})
export class ListaProcessosComponent implements OnInit {
  private readonly service = inject(ProcessosService);
  private readonly router = inject(Router);

  readonly displayedColumns = [
    'noProcesso',
    'noArea',
    'noDono',
    'coStatus',
    'vrIpaFinal',
    'dtLevantamento',
    'acoes',
  ];

  readonly items = signal<ProcessoItem[]>([]);
  readonly totalItems = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = signal(20);

  filtroArea = '';
  filtroStatus = '';
  filtroDataInicio: Date | null = null;
  filtroDataFim: Date | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  onFiltroChange(): void {
    this.currentPage.set(1);
    this.loadData();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }

  novaAvaliacao(): void {
    this.router.navigate(['/admin/avaliacoes/nova']);
  }

  verProcesso(row: ProcessoItem): void {
    if (row.idAvaliacao) {
      this.router.navigate(['/admin/avaliacoes', row.idAvaliacao]);
    } else {
      this.router.navigate(['/admin/processos', row.id]);
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'rascunho':
        return 'Rascunho';
      case 'avaliado':
        return 'Avaliado';
      case 'arquivado':
        return 'Arquivado';
      default:
        return status;
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'rascunho':
        return 'badge-rascunho';
      case 'avaliado':
        return 'badge-avaliado';
      case 'arquivado':
        return 'badge-arquivado';
      default:
        return '';
    }
  }

  private loadData(): void {
    const filtros: any = {
      page: this.currentPage(),
      limit: this.pageSize(),
    };

    if (this.filtroArea) filtros.area = this.filtroArea;
    if (this.filtroStatus) filtros.status = this.filtroStatus;
    if (this.filtroDataInicio) {
      filtros.dataInicio = this.filtroDataInicio.toISOString().split('T')[0];
    }
    if (this.filtroDataFim) {
      filtros.dataFim = this.filtroDataFim.toISOString().split('T')[0];
    }

    this.service.listar(filtros).subscribe({
      next: (result) => {
        this.items.set(result.data);
        this.totalItems.set(result.total);
      },
    });
  }
}
