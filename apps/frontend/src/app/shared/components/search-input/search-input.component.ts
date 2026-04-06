import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  placeholder = input<string>('Pesquisar...');
  initialValue = input<string>('', { alias: 'value' });
  debounceMs = input<number>(300);
  
  search = output<string>();
  
  value = signal('');
  isFocused = signal(false);
  
  private searchSubject = new Subject<string>();
  private inputElement = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  constructor() {
    // Sincronizar valor inicial se fornecido
    effect(() => {
      const init = this.initialValue();
      this.value.set(init);
    }, { allowSignalWrites: true });

    // Lógica de debounce para emissão da busca
    this.searchSubject.pipe(
      debounceTime(this.debounceMs()),
      distinctUntilChanged()
    ).subscribe(val => {
      this.search.emit(val);
    });
  }

  onInput(val: string): void {
    this.value.set(val);
    this.searchSubject.next(val);
  }

  clear(): void {
    this.value.set('');
    this.searchSubject.next('');
    this.inputElement()?.nativeElement.focus();
  }
}
