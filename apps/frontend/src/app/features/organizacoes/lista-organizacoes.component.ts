import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  inject,
  computed,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IOrganizacao } from '@ipa/shared';
import { OrganizacoesService } from './organizacoes.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-lista-organizacoes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    PageHeaderComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './lista-organizacoes.component.html',
  styleUrls: ['./lista-organizacoes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaOrganizacoesComponent implements OnInit {
  private readonly organizacoesService = inject(OrganizacoesService);
  private readonly fb = inject(FormBuilder);

  readonly organizacoes = signal<IOrganizacao[]>([]);
  readonly searchProp = signal('');
  readonly carregando = signal(true);
  readonly salvando = signal(false);
  readonly mostrarFormulario = signal(false);
  readonly organizacaoEditando = signal<IOrganizacao | null>(null);

  // Busca em memória (Client-side search)
  readonly filteredOrganizacoes = computed(() => {
    const q = this.searchProp().toLowerCase().trim();
    const list = this.organizacoes();
    if (!q) return list;
    
    return list.filter(o => 
      o.nome.toLowerCase().includes(q) || 
      o.slug.toLowerCase().includes(q)
    );
  });

  readonly form = this.fb.group({
    nome: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.organizacoesService.listar().subscribe({
      next: (lista) => {
        this.organizacoes.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
      },
    });
  }

  onSearch(term: string): void {
    this.searchProp.set(term);
  }

  toggleFormulario(): void {
    if (this.mostrarFormulario()) {
      this.cancelarEdicao();
    } else {
      this.mostrarFormulario.set(true);
    }
  }

  editar(o: IOrganizacao): void {
    this.organizacaoEditando.set(o);
    this.mostrarFormulario.set(true);
    this.form.patchValue({
      nome: o.nome,
      slug: o.slug,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao(): void {
    this.organizacaoEditando.set(null);
    this.mostrarFormulario.set(false);
    this.form.reset();
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando.set(true);
    
    const dto = this.form.getRawValue() as { nome: string; slug: string };
    const editando = this.organizacaoEditando();

    if (editando) {
      this.organizacoesService.atualizar(editando.id, dto).subscribe({
        next: (atualizada) => {
          this.organizacoes.update((lista) => 
            lista.map((o) => o.id === editando.id ? atualizada : o)
          );
          this.finalizarAcao();
        },
        error: () => this.salvando.set(false),
      });
    } else {
      this.organizacoesService.criar(dto).subscribe({
        next: (nova) => {
          this.organizacoes.update((lista) => [...lista, nova]);
          this.finalizarAcao();
        },
        error: () => this.salvando.set(false),
      });
    }
  }

  private finalizarAcao(): void {
    this.salvando.set(false);
    this.cancelarEdicao();
  }

  arquivar(id: number): void {
    this.organizacoesService.arquivar(id).subscribe({
      next: () => {
        this.organizacoes.update((lista) =>
          lista.map((o) =>
            o.id === id ? { ...o, situacao: 'I' } : o,
          ),
        );
      },
    });
  }

  ativar(id: number): void {
    this.organizacoesService.ativar(id).subscribe({
      next: (atualizada) => {
        this.organizacoes.update((lista) =>
          lista.map((o) => (o.id === id ? atualizada : o)),
        );
      },
    });
  }
}
