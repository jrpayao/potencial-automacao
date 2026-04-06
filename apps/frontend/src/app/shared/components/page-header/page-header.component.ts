import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchInputComponent } from '../search-input/search-input.component';

export interface Breadcrumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, SearchInputComponent],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  private readonly router = inject(Router);

  title = input.required<string>();
  description = input<string>();
  breadcrumbs = input<Breadcrumb[]>([]);
  
  // Search Configuration
  showSearch = input<boolean>(false);
  searchPlaceholder = input<string>('Pesquisar nesta página...');
  
  // Events
  search = output<string>();

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  onSearch(term: string): void {
    this.search.emit(term);
  }
}
