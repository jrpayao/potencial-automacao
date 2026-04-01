import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

interface SubCriterio {
  label: string;
  control: string;
  descriptors: { value: number; label: string }[];
}

interface BlocoNegocio {
  titulo: string;
  subCriterios: SubCriterio[];
  controlJustif: string;
}

@Component({
  selector: 'app-step-negocio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule],
  template: `
    <div class="step-container" [formGroup]="form()">
      <h3>Dimensao de Negocio (IN)</h3>

      @for (bloco of blocos; track bloco.titulo) {
        <div class="bloco-section">
          <h4>{{ bloco.titulo }}</h4>

          @for (sub of bloco.subCriterios; track sub.control) {
            <div class="sub-criterio">
              <label class="sub-label">{{ sub.label }}</label>
              <mat-radio-group [formControlName]="sub.control" class="radio-group-horizontal">
                @for (desc of sub.descriptors; track desc.value) {
                  <mat-radio-button [value]="desc.value" class="radio-option">
                    <span class="radio-label">
                      <strong>{{ desc.value }}</strong> — {{ desc.label }}
                    </span>
                  </mat-radio-button>
                }
              </mat-radio-group>
            </div>
          }

          <mat-form-field appearance="outline" class="full-width justificativa">
            <mat-label>Justificativa</mat-label>
            <textarea matInput [formControlName]="bloco.controlJustif" rows="2"></textarea>
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
    .bloco-section {
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    h4 {
      margin: 0 0 16px;
      color: #555;
    }
    .sub-criterio {
      margin-bottom: 16px;
    }
    .sub-label {
      display: block;
      font-weight: 500;
      margin-bottom: 8px;
      color: #444;
    }
    .radio-group-horizontal {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 8px;
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
export class StepNegocioComponent {
  readonly form = input.required<FormGroup>();

  readonly blocos: BlocoNegocio[] = [
    {
      titulo: 'Gestao de Risco',
      controlJustif: 'justifGestaoRisco',
      subCriterios: [
        {
          label: 'Nivel de Risco',
          control: 'notaGestaoRisco',
          descriptors: [
            { value: 5, label: 'Risco critico — multas/sancoes iminentes' },
            { value: 4, label: 'Risco alto — impacto regulatorio' },
            { value: 3, label: 'Risco medio — perdas operacionais' },
            { value: 2, label: 'Risco baixo — inconveniencias' },
            { value: 1, label: 'Risco minimo — impacto negligenciavel' },
            { value: 0, label: 'Sem risco identificado' },
          ],
        },
      ],
    },
    {
      titulo: 'Impacto no Cidadao',
      controlJustif: 'justifImpactoCidadao',
      subCriterios: [
        {
          label: 'Reducao de SLA',
          control: 'notaReducaoSla',
          descriptors: [
            { value: 5, label: 'Reduz SLA em mais de 80%' },
            { value: 4, label: 'Reduz SLA em 60-80%' },
            { value: 3, label: 'Reduz SLA em 40-60%' },
            { value: 2, label: 'Reduz SLA em 20-40%' },
            { value: 1, label: 'Reduz SLA em ate 20%' },
            { value: 0, label: 'Sem impacto no SLA' },
          ],
        },
        {
          label: 'Abrangencia',
          control: 'notaAbrangencia',
          descriptors: [
            { value: 5, label: 'Atende mais de 100 mil cidadaos/ano' },
            { value: 4, label: 'Atende 50-100 mil cidadaos/ano' },
            { value: 3, label: 'Atende 10-50 mil cidadaos/ano' },
            { value: 2, label: 'Atende 1-10 mil cidadaos/ano' },
            { value: 1, label: 'Atende menos de 1 mil cidadaos/ano' },
            { value: 0, label: 'Uso exclusivamente interno' },
          ],
        },
        {
          label: 'Experiencia do Cidadao',
          control: 'notaExperienciaCidadao',
          descriptors: [
            { value: 5, label: 'Eliminacao total de atendimento presencial' },
            { value: 4, label: 'Autoatendimento digital completo' },
            { value: 3, label: 'Reducao significativa de etapas' },
            { value: 2, label: 'Melhoria parcial da experiencia' },
            { value: 1, label: 'Melhoria minima perceptivel' },
            { value: 0, label: 'Sem impacto na experiencia' },
          ],
        },
      ],
    },
    {
      titulo: 'Eficiencia Operacional',
      controlJustif: 'justifEficiencia',
      subCriterios: [
        {
          label: 'Volume Mensal',
          control: 'notaVolumeMensal',
          descriptors: [
            { value: 5, label: 'Mais de 10 mil execucoes/mes' },
            { value: 4, label: '5-10 mil execucoes/mes' },
            { value: 3, label: '1-5 mil execucoes/mes' },
            { value: 2, label: '500-1000 execucoes/mes' },
            { value: 1, label: '100-500 execucoes/mes' },
            { value: 0, label: 'Menos de 100 execucoes/mes' },
          ],
        },
        {
          label: 'FTE Liberado',
          control: 'notaFteLiberado',
          descriptors: [
            { value: 5, label: 'Libera mais de 5 FTEs' },
            { value: 4, label: 'Libera 3-5 FTEs' },
            { value: 3, label: 'Libera 1-3 FTEs' },
            { value: 2, label: 'Libera 0.5-1 FTE' },
            { value: 1, label: 'Libera menos de 0.5 FTE' },
            { value: 0, label: 'Nao libera FTE' },
          ],
        },
      ],
    },
  ];
}
