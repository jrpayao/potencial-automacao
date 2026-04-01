import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-step-identificacao',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="step-container" [formGroup]="form()">
      <h3>Identificacao do Processo</h3>

      <div class="form-row">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome do Processo</mat-label>
          <input matInput formControlName="nome" />
          @if (form().get('nome')?.hasError('required') && form().get('nome')?.touched) {
            <mat-error>Nome do processo e obrigatorio</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="form-row two-cols">
        <mat-form-field appearance="outline">
          <mat-label>Area</mat-label>
          <input matInput formControlName="area" />
          @if (form().get('area')?.hasError('required') && form().get('area')?.touched) {
            <mat-error>Area e obrigatoria</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Departamento</mat-label>
          <input matInput formControlName="departamento" />
        </mat-form-field>
      </div>

      <div class="form-row two-cols">
        <mat-form-field appearance="outline">
          <mat-label>Dono do Processo</mat-label>
          <input matInput formControlName="donoProcesso" />
          @if (form().get('donoProcesso')?.hasError('required') && form().get('donoProcesso')?.touched) {
            <mat-error>Dono do processo e obrigatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Solicitante</mat-label>
          <input matInput formControlName="solicitante" />
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Data do Levantamento</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dataLevantamento" />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
          @if (form().get('dataLevantamento')?.hasError('required') && form().get('dataLevantamento')?.touched) {
            <mat-error>Data do levantamento e obrigatoria</mat-error>
          }
        </mat-form-field>
      </div>
    </div>
  `,
  styles: `
    .step-container {
      padding: 16px 0;
    }
    h3 {
      margin-bottom: 24px;
      color: #333;
    }
    .form-row {
      margin-bottom: 8px;
    }
    .two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    mat-form-field {
      width: 100%;
    }
  `,
})
export class StepIdentificacaoComponent {
  readonly form = input.required<FormGroup>();
}
