import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PageChangeEvent {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomPaginatorComponent {
  totalItems = input.required<number>();
  pageSize = input.required<number>();
  currentPage = input.required<number>();
  pageSizeOptions = input<number[]>([10, 20, 50]);

  pageChange = output<PageChangeEvent>();

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);
  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  endIndex = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.pageChange.emit({ page, pageSize: this.pageSize() });
  }

  changePageSize(size: string): void {
    const pageSize = parseInt(size, 10);
    this.pageChange.emit({ page: 1, pageSize });
  }
}
