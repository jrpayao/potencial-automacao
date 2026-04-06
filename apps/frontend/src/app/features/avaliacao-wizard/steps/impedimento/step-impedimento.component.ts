import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-impedimento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-impedimento.component.html',
  styleUrls: ['./step-impedimento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepImpedimentoComponent {
  readonly form = input.required<FormGroup>();

  readonly opcoes = [
    { value: 1.0, label: 'Nenhum impedimento — processo livre para automação' },
    { value: 0.8, label: 'Impedimento leve — pequenos ajustes necessários' },
    { value: 0.5, label: 'Impedimento moderado — barreiras contornáveis' },
    { value: 0.2, label: 'Impedimento severo — barreiras significativas' },
    { value: 0.0, label: 'Impedimento absoluto — automação inviável' },
  ];
}
