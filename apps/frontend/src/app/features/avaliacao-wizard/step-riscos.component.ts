import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-step-riscos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  template: `
    <div class="step-container">
      <h3>Riscos e Contingencia</h3>

      <p class="description">
        Identifique os riscos associados a automacao deste processo e os
        respectivos protocolos de contingencia.
      </p>

      <table mat-table [dataSource]="riscos.controls" class="riscos-table">
        <ng-container matColumnDef="risco">
          <th mat-header-cell *matHeaderCellDef>Risco</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <mat-form-field appearance="outline" class="cell-field">
              <input matInput [formControl]="getControl(i, 'risco')" placeholder="Descreva o risco" />
            </mat-form-field>
          </td>
        </ng-container>

        <ng-container matColumnDef="contingencia">
          <th mat-header-cell *matHeaderCellDef>Protocolo de Contingencia</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <mat-form-field appearance="outline" class="cell-field">
              <input matInput [formControl]="getControl(i, 'contingencia')" placeholder="Protocolo de contingencia" />
            </mat-form-field>
          </td>
        </ng-container>

        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef>Acoes</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <button mat-icon-button color="warn" (click)="removerRisco(i)" type="button">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="colunas"></tr>
        <tr mat-row *matRowDef="let row; columns: colunas"></tr>
      </table>

      @if (riscos.length === 0) {
        <p class="empty-message">Nenhum risco cadastrado. Clique no botao abaixo para adicionar.</p>
      }

      <button mat-stroked-button color="primary" (click)="adicionarRisco()" type="button" class="add-btn">
        <mat-icon>add</mat-icon>
        Adicionar Risco
      </button>
    </div>
  `,
  styles: `
    .step-container {
      padding: 16px 0;
    }
    h3 {
      margin-bottom: 16px;
      color: #333;
    }
    .description {
      margin-bottom: 16px;
      color: #666;
      font-size: 0.9rem;
    }
    .riscos-table {
      width: 100%;
      margin-bottom: 16px;
    }
    .cell-field {
      width: 100%;
      margin: 4px 0;
    }
    .add-btn {
      margin-top: 8px;
    }
    .empty-message {
      color: #999;
      text-align: center;
      padding: 24px;
      font-style: italic;
    }
  `,
})
export class StepRiscosComponent {
  readonly formArray = input.required<FormArray>();

  readonly colunas = ['risco', 'contingencia', 'acoes'];

  get riscos(): FormArray {
    return this.formArray();
  }

  getControl(index: number, field: string): FormControl {
    return (this.riscos.at(index) as FormGroup).get(field) as FormControl;
  }

  adicionarRisco(): void {
    this.riscos.push(
      new FormGroup({
        risco: new FormControl(''),
        contingencia: new FormControl(''),
      }),
    );
  }

  removerRisco(index: number): void {
    this.riscos.removeAt(index);
  }
}
