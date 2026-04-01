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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IOrganizacao } from '@ipa/shared';
import { OrganizacoesService } from './organizacoes.service';

@Component({
  selector: 'app-lista-organizacoes',
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
    MatProgressSpinnerModule,
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

    .badge-ativo {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: #e8f5e9;
      color: #2e7d32;
    }

    .badge-inativo {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: #f5f5f5;
      color: #757575;
    }

    .slug-chip {
      font-family: monospace;
      background: #e3f2fd;
      color: #1565c0;
      padding: 2px 8px;
      border-radius: 4px;
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
        <h1 class="page-title">Organizacoes</h1>
        <button mat-raised-button color="primary" (click)="toggleFormulario()">
          <mat-icon>{{ mostrarFormulario() ? 'close' : 'add' }}</mat-icon>
          {{ mostrarFormulario() ? 'Cancelar' : '+ Nova Organizacao' }}
        </button>
      </div>

      @if (mostrarFormulario()) {
        <mat-card class="form-card">
          <mat-card-content>
            <p class="form-title">Nova Organizacao</p>
            <form [formGroup]="form" (ngSubmit)="salvar()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Nome</mat-label>
                  <input matInput formControlName="nome" placeholder="Nome da organizacao">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Slug</mat-label>
                  <input matInput formControlName="slug" placeholder="slug-unico">
                  <mat-hint>Identificador unico (letras minusculas e hifens)</mat-hint>
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
            <table mat-table [dataSource]="organizacoes()">

              <ng-container matColumnDef="nome">
                <th mat-header-cell *matHeaderCellDef>Nome</th>
                <td mat-cell *matCellDef="let o">{{ o.nome }}</td>
              </ng-container>

              <ng-container matColumnDef="slug">
                <th mat-header-cell *matHeaderCellDef>Slug</th>
                <td mat-cell *matCellDef="let o">
                  <span class="slug-chip">{{ o.slug }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="situacao">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let o">
                  <span [class]="o.situacao === 'A' ? 'badge-ativo' : 'badge-inativo'">
                    {{ o.situacao === 'A' ? 'Ativa' : 'Inativa' }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="criadoEm">
                <th mat-header-cell *matHeaderCellDef>Data de Criacao</th>
                <td mat-cell *matCellDef="let o">{{ o.criadoEm | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="colunas"></tr>
              <tr mat-row *matRowDef="let row; columns: colunas;"></tr>

              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" [attr.colspan]="colunas.length" style="text-align:center; padding:32px; color:#999;">
                  Nenhuma organizacao encontrada.
                </td>
              </tr>
            </table>
          </mat-card-content>
        </mat-card>
      }

    </div>
  `,
})
export class ListaOrganizacoesComponent implements OnInit {
  private readonly organizacoesService = inject(OrganizacoesService);
  private readonly fb = inject(FormBuilder);

  readonly organizacoes = signal<IOrganizacao[]>([]);
  readonly carregando = signal(true);
  readonly salvando = signal(false);
  readonly mostrarFormulario = signal(false);

  readonly colunas = ['nome', 'slug', 'situacao', 'criadoEm'];

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

  toggleFormulario(): void {
    this.mostrarFormulario.update((v) => !v);
    if (!this.mostrarFormulario()) {
      this.form.reset();
    }
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const dto = this.form.getRawValue() as { nome: string; slug: string };
    this.organizacoesService.criar(dto).subscribe({
      next: (nova) => {
        this.organizacoes.update((lista) => [...lista, nova]);
        this.salvando.set(false);
        this.mostrarFormulario.set(false);
        this.form.reset();
      },
      error: () => {
        this.salvando.set(false);
      },
    });
  }
}
