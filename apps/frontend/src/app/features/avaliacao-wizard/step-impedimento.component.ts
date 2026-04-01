import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-step-impedimento',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule],
  template: `
    <div class="step-container" [formGroup]="form()">
      <h3>Fator de Impedimento (FI)</h3>

      <div class="criterio-section">
        <p class="description">
          O Fator de Impedimento reduz o IPA quando existem barreiras legais,
          tecnicas ou organizacionais que dificultam ou impedem a automacao.
        </p>

        <mat-radio-group formControlName="fatorImpedimento" class="radio-group">
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
          <textarea matInput formControlName="justifImpedimento" rows="3"></textarea>
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
export class StepImpedimentoComponent {
  readonly form = input.required<FormGroup>();

  readonly opcoes = [
    { value: 1.0, label: 'Nenhum impedimento — processo livre para automacao' },
    { value: 0.8, label: 'Impedimento leve — pequenos ajustes necessarios' },
    { value: 0.5, label: 'Impedimento moderado — barreiras contornaveis' },
    { value: 0.2, label: 'Impedimento severo — barreiras significativas' },
    { value: 0.0, label: 'Impedimento absoluto — automacao inviavel' },
  ];
}
