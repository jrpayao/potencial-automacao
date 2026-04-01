import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

interface CriterioDescriptors {
  label: string;
  controlNota: string;
  controlJustif: string;
  descriptors: { value: number; label: string }[];
}

@Component({
  selector: 'app-step-tecnica',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule],
  template: `
    <div class="step-container" [formGroup]="form()">
      <h3>Dimensao Tecnica (IT)</h3>

      @for (criterio of criterios; track criterio.controlNota) {
        <div class="criterio-section">
          <h4>{{ criterio.label }}</h4>

          <mat-radio-group [formControlName]="criterio.controlNota" class="radio-group-horizontal">
            @for (desc of criterio.descriptors; track desc.value) {
              <mat-radio-button [value]="desc.value" class="radio-option">
                <span class="radio-label">
                  <strong>{{ desc.value }}</strong> — {{ desc.label }}
                </span>
              </mat-radio-button>
            }
          </mat-radio-group>

          <mat-form-field appearance="outline" class="full-width justificativa">
            <mat-label>Justificativa</mat-label>
            <textarea matInput [formControlName]="criterio.controlJustif" rows="2"></textarea>
          </mat-form-field>
        </div>
      }
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
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    h4 {
      margin: 0 0 12px;
      color: #555;
    }
    .radio-group-horizontal {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 12px;
    }
    .radio-option {
      margin-bottom: 2px;
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
export class StepTecnicaComponent {
  readonly form = input.required<FormGroup>();

  readonly criterios: CriterioDescriptors[] = [
    {
      label: 'Seguranca e Acessos',
      controlNota: 'notaSegurancaAcessos',
      controlJustif: 'justifSegurancaAcessos',
      descriptors: [
        { value: 5, label: 'API documentada' },
        { value: 4, label: 'Login simples' },
        { value: 3, label: 'MFA contornavel' },
        { value: 2, label: 'MFA+VPN' },
        { value: 1, label: 'Token A3 limitado' },
        { value: 0, label: 'Token A3 obrigatorio' },
      ],
    },
    {
      label: 'Estabilidade do Legado',
      controlNota: 'notaEstabilidadeLegado',
      controlJustif: 'justifEstabilidadeLegado',
      descriptors: [
        { value: 5, label: 'API estavel, documentada' },
        { value: 4, label: 'Interface estavel' },
        { value: 3, label: 'Alteracoes ocasionais' },
        { value: 2, label: 'Mudancas frequentes' },
        { value: 1, label: 'Legado parcial' },
        { value: 0, label: 'Instavel/substituicao' },
      ],
    },
    {
      label: 'Estruturacao dos Dados',
      controlNota: 'notaEstruturacaoDados',
      controlJustif: 'justifEstruturacaoDados',
      descriptors: [
        { value: 5, label: 'Dados estruturados/API' },
        { value: 4, label: 'Planilhas padronizadas' },
        { value: 3, label: 'PDFs com OCR' },
        { value: 2, label: 'PDFs nao estruturados' },
        { value: 1, label: 'Digitalizados baixa qualidade' },
        { value: 0, label: 'Documentos fisicos' },
      ],
    },
  ];
}
