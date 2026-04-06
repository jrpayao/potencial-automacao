import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-urgencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-urgencia.component.html',
  styleUrls: ['./step-urgencia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepUrgenciaComponent {
  readonly form = input.required<FormGroup>();

  readonly opcoes = [
    { value: 1.2, label: 'Iminente — prazo legal/regulatório próximo' },
    { value: 1.1, label: 'Estratégico — alinhado a metas prioritárias' },
    { value: 1.0, label: 'Normal — sem pressão temporal específica' },
    { value: 0.9, label: 'Baixa — pode aguardar próximos ciclos' },
  ];
}
