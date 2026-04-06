import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcessosService, ProcessoItem } from './processos.service';
import { PageHeaderComponent, Breadcrumb } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { CustomPaginatorComponent, PageChangeEvent } from '../../shared/components/custom-paginator/custom-paginator.component';

@Component({
  selector: 'app-lista-processos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    DatePipe,
    PageHeaderComponent,
    StatusBadgeComponent,
    CustomPaginatorComponent,
  ],
  templateUrl: './lista-processos.component.html',
  styleUrls: ['./lista-processos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProcessosComponent implements OnInit {
  private readonly processosService = inject(ProcessosService);
  private readonly router = inject(Router);

  readonly items = signal<ProcessoItem[]>([]);
  readonly totalItems = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly query = signal('');

  // Breadcrumbs
  readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Portal IPA', route: '/admin/dashboard' },
    { label: 'Gestão de Processos' }
  ];

  // Filtros Avançados
  filtroStatus = '';
  filtroDataInicio = '';
  filtroDataFim = '';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    const params: any = {
      page: this.currentPage(),
      limit: this.pageSize(),
      area: this.query(), // Mapeando query para area no backend (simplificação p/ essa versão)
      status: this.filtroStatus,
      dataInicio: this.filtroDataInicio,
      dataFim: this.filtroDataFim
    };

    this.processosService.listar(params).subscribe({
      next: (res) => {
        this.items.set(res.data);
        this.totalItems.set(res.total);
      },
    });
  }

  onSearch(term: string): void {
    this.query.set(term);
    this.currentPage.set(1);
    this.carregar();
  }

  onFiltroChange(): void {
    this.currentPage.set(1);
    this.carregar();
  }

  onPageChange(event: PageChangeEvent): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.carregar();
  }

  verProcesso(row: ProcessoItem): void {
    if (row.idAvaliacao) {
      this.router.navigate(['/admin/avaliacoes', row.idAvaliacao]);
    } else {
      this.router.navigate(['/admin/avaliacoes/nova'], {
        queryParams: { processoId: row.id },
      });
    }
  }

  novaAvaliacao(): void {
    this.router.navigate(['/admin/avaliacoes/nova']);
  }

  ipaColor(ipa: number): string {
    if (ipa >= 6) return '#16a34a';
    if (ipa >= 3) return '#ca8a04';
    return '#dc2626';
  }
}
