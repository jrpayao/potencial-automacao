import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-step-urgencia',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule],
  template: `
    <div class="step-container" [formGroup]="form()">
      <h3>Fator de Urgencia (FU)</h3>

      <div class="criterio-section">
        <p class="description">
          O Fator de Urgencia amplifica ou atenua o IPA com base em prazos
          regulatorios, demandas estrategicas ou pressao temporal.
        </p>

        <mat-radio-group formControlName="fatorUrgencia" class="radio-group">
          @for (opt of opcoes; track opt.value) {
            <mat-radio-button [value]="opt.value" class="radio-option">
              <span class="radio-label">
                <strong>{{ opt.value }}</strong> — {{ opt.label }}
              </span>
            </mat-radio-button>
          }
        </mat-radio-group>

        <mat-form-field appearance="outline" class="full-width justificativa">
          <mat-label>Justificativa</mat-label>
          <textarea matInput formControlName="justifUrgencia" rows="3"></textarea>
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
    .criterio-section {
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    .description {
      margin-bottom: 16px;
      color: #666;
      font-size: 0.9rem;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    .radio-option {
      margin-bottom: 4px;
    }
    .radio-label {
      font-size: 0.875rem;
    }
    .full-width {
      width: 100%;
    }
    .justificativa {
      margin-top: 8px;
    }
  `,
})
export class StepUrgenciaComponent {
  readonly form = input.required<FormGroup>();

  readonly opcoes = [
    { value: 1.2, label: 'Iminente — prazo legal/regulatorio proximo' },
    { value: 1.1, label: 'Estrategico — alinhado a metas prioritarias' },
    { value: 1.0, label: 'Normal — sem pressao temporal especifica' },
    { value: 0.9, label: 'Baixa — pode aguardar proximos ciclos' },
  ];
}
