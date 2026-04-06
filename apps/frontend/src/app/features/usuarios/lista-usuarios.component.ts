import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IUsuario, Perfil, SituacaoUsuario } from '@ipa/shared';
import { UsuariosService, UpdateUsuarioDto } from './usuarios.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaUsuariosComponent implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly fb = inject(FormBuilder);

  readonly usuarios = signal<IUsuario[]>([]);
  readonly searchProp = signal('');
  readonly carregando = signal(true);
  readonly salvando = signal(false);
  readonly mostrarFormulario = signal(false);
  readonly usuarioEditando = signal<IUsuario | null>(null);

  readonly perfis = Object.values(Perfil);
  readonly Situacao = SituacaoUsuario;

  // Busca em memória (Client-side search)
  readonly filteredUsuarios = computed(() => {
    const q = this.searchProp().toLowerCase().trim();
    const list = this.usuarios();
    if (!q) return list;
    
    return list.filter(u => 
      u.nome.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q)
    );
  });

  readonly form = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.minLength(6)]], // Senha opcional na edição
    perfil: [Perfil.ANALISTA, Validators.required],
    organizacaoId: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.usuariosService.listar().subscribe({
      next: (lista) => {
        this.usuarios.set(lista);
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

  editar(u: IUsuario): void {
    this.usuarioEditando.set(u);
    this.mostrarFormulario.set(true);
    this.form.patchValue({
      nome: u.nome,
      email: u.email,
      perfil: u.perfil,
      organizacaoId: u.organizacaoId,
      senha: '', // Não carregamos a senha atual
    });
    // Na edição, a senha não é obrigatória
    this.form.get('senha')?.setValidators([Validators.minLength(6)]);
    this.form.get('senha')?.updateValueAndValidity();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao(): void {
    this.usuarioEditando.set(null);
    this.mostrarFormulario.set(false);
    this.form.reset({ perfil: Perfil.ANALISTA });
    this.form.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('senha')?.updateValueAndValidity();
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando.set(true);
    
    const rawVal = this.form.getRawValue();
    const editando = this.usuarioEditando();

    if (editando) {
      const dto: UpdateUsuarioDto = {
        nome: rawVal.nome || undefined,
        email: rawVal.email || undefined,
        perfil: rawVal.perfil || undefined,
        organizacaoId: rawVal.organizacaoId || undefined,
      };
      // Opcionalmente enviar senha se preenchida
      if (rawVal.senha) {
        dto.senha = rawVal.senha;
      }

      this.usuariosService.atualizar(editando.id, dto).subscribe({
        next: (atualizado) => {
          this.usuarios.update((lista) => 
            lista.map((u) => u.id === editando.id ? atualizado : u)
          );
          this.finalizarAcao();
        },
        error: () => this.salvando.set(false),
      });
    } else {
      // Criar novo (aqui senha é obrigatória se não for rascunho, mas o validador cuida)
      if (!rawVal.senha) {
        this.form.get('senha')?.setErrors({ required: true });
        this.salvando.set(false);
        return;
      }

      this.usuariosService.criar(rawVal as any).subscribe({
        next: (novo) => {
          this.usuarios.update((lista) => [...lista, novo]);
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

  desativar(id: number): void {
    this.usuariosService.alterarSituacao(id, SituacaoUsuario.INATIVO).subscribe({
      next: () => this.carregar(),
      error: () => this.carregar(),
    });
  }

  ativar(id: number): void {
    this.usuariosService.alterarSituacao(id, SituacaoUsuario.ATIVO).subscribe({
      next: () => this.carregar(),
      error: () => this.carregar(),
    });
  }
}
