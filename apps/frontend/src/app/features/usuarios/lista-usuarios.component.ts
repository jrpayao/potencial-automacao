import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IUsuario, Perfil } from '@ipa/shared';
import { UsuariosService } from './usuarios.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  styles: `
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 22px;
      font-weight: 700;
      color: #333;
      margin: 0;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
    }

    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .badge-superadmin { background: #7b1fa2; color: white; }
    .badge-admin { background: #1565c0; color: white; }
    .badge-analista { background: #00695c; color: white; }
    .badge-visualizador { background: #546e7a; color: white; }

    .status-ativo {
      color: #2e7d32;
      font-weight: 600;
      font-size: 13px;
    }

    .status-inativo {
      color: #757575;
      font-weight: 600;
      font-size: 13px;
    }

    .form-card {
      margin-bottom: 24px;
      border: 1px solid #e0e0e0;
    }

    .form-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .loading-wrapper {
      display: flex;
      justify-content: center;
      padding: 60px 0;
    }

    mat-form-field {
      width: 100%;
    }
  `,
  template: `
    <div style="padding: 24px; max-width: 1100px; margin: 0 auto;">

      <div class="page-header">
        <h1 class="page-title">Usuarios</h1>
        <button mat-raised-button color="primary" (click)="toggleFormulario()">
          <mat-icon>{{ mostrarFormulario() ? 'close' : 'add' }}</mat-icon>
          {{ mostrarFormulario() ? 'Cancelar' : '+ Novo Usuario' }}
        </button>
      </div>

      @if (mostrarFormulario()) {
        <mat-card class="form-card">
          <mat-card-content>
            <p class="form-title">Novo Usuario</p>
            <form [formGroup]="form" (ngSubmit)="salvar()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Nome</mat-label>
                  <input matInput formControlName="nome" placeholder="Nome completo">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="email@exemplo.com">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Senha</mat-label>
                  <input matInput formControlName="senha" type="password" placeholder="Senha inicial">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Perfil</mat-label>
                  <mat-select formControlName="perfil">
                    @for (p of perfis; track p) {
                      <mat-option [value]="p">{{ p }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Organizacao ID</mat-label>
                  <input matInput formControlName="organizacaoId" type="number" placeholder="ID da organizacao">
                </mat-form-field>
              </div>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || salvando()">
                  @if (salvando()) {
                    <mat-spinner diameter="18" style="display:inline-block;"></mat-spinner>
                  } @else {
                    Salvar
                  }
                </button>
                <button mat-stroked-button type="button" (click)="toggleFormulario()">Cancelar</button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      @if (carregando()) {
        <div class="loading-wrapper">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else {
        <mat-card>
          <mat-card-content class="table-container">
            <table mat-table [dataSource]="usuarios()">

              <ng-container matColumnDef="nome">
                <th mat-header-cell *matHeaderCellDef>Nome</th>
                <td mat-cell *matCellDef="let u">{{ u.nome }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let u">{{ u.email }}</td>
              </ng-container>

              <ng-container matColumnDef="perfil">
                <th mat-header-cell *matHeaderCellDef>Perfil</th>
                <td mat-cell *matCellDef="let u">
                  <span class="badge" [class]="'badge-' + u.perfil">{{ u.perfil }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="situacao">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let u">
                  <span [class]="u.situacao === 'A' ? 'status-ativo' : 'status-inativo'">
                    {{ u.situacao === 'A' ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="acoes">
                <th mat-header-cell *matHeaderCellDef>Acoes</th>
                <td mat-cell *matCellDef="let u">
                  @if (u.situacao === 'A') {
                    <button mat-icon-button color="warn"
                      matTooltip="Desativar usuario"
                      (click)="desativar(u.id)">
                      <mat-icon>person_off</mat-icon>
                    </button>
                  }
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="colunas"></tr>
              <tr mat-row *matRowDef="let row; columns: colunas;"></tr>

              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" [attr.colspan]="colunas.length" style="text-align:center; padding:32px; color:#999;">
                  Nenhum usuario encontrado.
                </td>
              </tr>
            </table>
          </mat-card-content>
        </mat-card>
      }

    </div>
  `,
})
export class ListaUsuariosComponent implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly fb = inject(FormBuilder);

  readonly usuarios = signal<IUsuario[]>([]);
  readonly carregando = signal(true);
  readonly salvando = signal(false);
  readonly mostrarFormulario = signal(false);

  readonly colunas = ['nome', 'email', 'perfil', 'situacao', 'acoes'];
  readonly perfis = Object.values(Perfil);

  readonly form = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
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

  toggleFormulario(): void {
    this.mostrarFormulario.update((v) => !v);
    if (!this.mostrarFormulario()) {
      this.form.reset({ perfil: Perfil.ANALISTA });
    }
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const dto = this.form.getRawValue() as {
      nome: string;
      email: string;
      senha: string;
      perfil: Perfil;
      organizacaoId: number;
    };
    this.usuariosService.criar(dto).subscribe({
      next: (novo) => {
        this.usuarios.update((lista) => [...lista, novo]);
        this.salvando.set(false);
        this.mostrarFormulario.set(false);
        this.form.reset({ perfil: Perfil.ANALISTA });
      },
      error: () => {
        this.salvando.set(false);
      },
    });
  }

  desativar(id: number): void {
    this.usuariosService.desativar(id).subscribe({
      next: (atualizado) => {
        this.usuarios.update((lista) =>
          lista.map((u) => (u.id === id ? atualizado : u)),
        );
      },
    });
  }
}
