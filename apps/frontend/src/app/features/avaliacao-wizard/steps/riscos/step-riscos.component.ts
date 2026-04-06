import { Component, ChangeDetectionStrategy, input, Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Pipe({ name: 'asFormGroupArray', standalone: true })
export class AsFormGroupArrayPipe implements PipeTransform {
  transform(values: any[]): FormGroup[] {
    return values as FormGroup[];
  }
}

@Component({
  selector: 'app-step-riscos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsFormGroupArrayPipe],
  templateUrl: './step-riscos.component.html',
  styleUrls: ['./step-riscos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepRiscosComponent {
  readonly formArray = input.required<FormArray>();

  get riscos(): FormArray {
    return this.formArray();
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
