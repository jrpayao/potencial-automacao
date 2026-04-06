import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-identificacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-identificacao.component.html',
  styleUrls: ['./step-identificacao.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepIdentificacaoComponent {
  readonly form = input.required<FormGroup>();

  isInvalid(controlName: string): boolean | undefined {
    const control = this.form().get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }
}
