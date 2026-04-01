import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FatorImpedimento, FatorUrgencia, CreateAvaliacaoDto } from '@ipa/shared';

import { AvaliacaoService } from './avaliacao.service';
import { StepIdentificacaoComponent } from './step-identificacao.component';
import { StepTecnicaComponent } from './step-tecnica.component';
import { StepNegocioComponent } from './step-negocio.component';
import { StepImpedimentoComponent } from './step-impedimento.component';
import { StepUrgenciaComponent } from './step-urgencia.component';
import { StepRiscosComponent } from './step-riscos.component';
import { IpaPreviewComponent } from './ipa-preview.component';

@Component({
  selector: 'app-wizard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    StepIdentificacaoComponent,
    StepTecnicaComponent,
    StepNegocioComponent,
    StepImpedimentoComponent,
    StepUrgenciaComponent,
    StepRiscosComponent,
    IpaPreviewComponent,
  ],
  template: `
    <div class="wizard-layout">
      <div class="stepper-panel">
        <h1>Nova Avaliacao IPA</h1>

        <mat-stepper #stepper [linear]="false" [selectedIndex]="currentStep()">
          <mat-step [stepControl]="identificacaoGroup" label="Identificacao">
            <app-step-identificacao [form]="identificacaoGroup" />
            <div class="step-actions">
              <button mat-flat-button color="primary" matStepperNext>Proximo</button>
            </div>
          </mat-step>

          <mat-step [stepControl]="tecnicaGroup" label="Tecnica">
            <app-step-tecnica [form]="tecnicaGroup" />
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>Anterior</button>
              <button mat-flat-button color="primary" matStepperNext>Proximo</button>
            </div>
          </mat-step>

          <mat-step [stepControl]="negocioGroup" label="Negocio">
            <app-step-negocio [form]="negocioGroup" />
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>Anterior</button>
              <button mat-flat-button color="primary" matStepperNext>Proximo</button>
            </div>
          </mat-step>

          <mat-step [stepControl]="impedimentoGroup" label="Impedimento">
            <app-step-impedimento [form]="impedimentoGroup" />
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>Anterior</button>
              <button mat-flat-button color="primary" matStepperNext>Proximo</button>
            </div>
          </mat-step>

          <mat-step [stepControl]="urgenciaGroup" label="Urgencia">
            <app-step-urgencia [form]="urgenciaGroup" />
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>Anterior</button>
              <button mat-flat-button color="primary" matStepperNext>Proximo</button>
            </div>
          </mat-step>

          <mat-step label="Riscos e Finalizar">
            <app-step-riscos [formArray]="riscosArray" />
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>Anterior</button>
              <button
                mat-flat-button
                color="accent"
                (click)="salvar()"
                [disabled]="salvando() || !podeCalcular()"
                type="button"
              >
                @if (salvando()) {
                  Salvando...
                } @else {
                  Calcular e Salvar
                }
              </button>
            </div>
          </mat-step>
        </mat-stepper>
      </div>

      <div class="preview-panel" [class.visible]="currentStep() >= 1">
        <app-ipa-preview [form]="allFieldsGroup" />
      </div>
    </div>
  `,
  styles: `
    .wizard-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    @media (min-width: 960px) {
      .wizard-layout {
        grid-template-columns: 70% 30%;
      }
    }
    h1 {
      margin: 0 0 24px;
      color: #333;
    }
    .stepper-panel {
      min-width: 0;
    }
    .preview-panel {
      display: none;
    }
    .preview-panel.visible {
      display: block;
    }
    .step-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      justify-content: flex-end;
    }
  `,
})
export class WizardComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  private readonly avaliacaoService = inject(AvaliacaoService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly currentStep = signal(0);
  readonly salvando = signal(false);

  // Step 1 — Identificacao
  readonly identificacaoGroup = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    area: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    departamento: new FormControl('', { nonNullable: true }),
    donoProcesso: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    solicitante: new FormControl('', { nonNullable: true }),
    dataLevantamento: new FormControl<Date | null>(null, { validators: [Validators.required] }),
  });

  // Step 2 — Tecnica
  readonly tecnicaGroup = new FormGroup({
    notaSegurancaAcessos: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    justifSegurancaAcessos: new FormControl('', { nonNullable: true }),
    notaEstabilidadeLegado: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    justifEstabilidadeLegado: new FormControl('', { nonNullable: true }),
    notaEstruturacaoDados: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    justifEstruturacaoDados: new FormControl('', { nonNullable: true }),
  });

  // Step 3 — Negocio
  readonly negocioGroup = new FormGroup({
    notaGestaoRisco: new FormControl<number | null>(null, { validators: [Validators.required] }),
    justifGestaoRisco: new FormControl('', { nonNullable: true }),
    notaReducaoSla: new FormControl<number | null>(null, { validators: [Validators.required] }),
    notaAbrangencia: new FormControl<number | null>(null, { validators: [Validators.required] }),
    notaExperienciaCidadao: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    justifImpactoCidadao: new FormControl('', { nonNullable: true }),
    notaVolumeMensal: new FormControl<number | null>(null, { validators: [Validators.required] }),
    notaFteLiberado: new FormControl<number | null>(null, { validators: [Validators.required] }),
    justifEficiencia: new FormControl('', { nonNullable: true }),
  });

  // Step 4 — Impedimento
  readonly impedimentoGroup = new FormGroup({
    fatorImpedimento: new FormControl<number | null>(null, { validators: [Validators.required] }),
    justifImpedimento: new FormControl('', { nonNullable: true }),
  });

  // Step 5 — Urgencia
  readonly urgenciaGroup = new FormGroup({
    fatorUrgencia: new FormControl<number | null>(null, { validators: [Validators.required] }),
    justifUrgencia: new FormControl('', { nonNullable: true }),
  });

  // Step 6 — Riscos
  readonly riscosArray = new FormArray<FormGroup>([]);

  // Combined form group for preview calculations (flat controls)
  readonly allFieldsGroup = new FormGroup({
    // Tecnica
    notaSegurancaAcessos: this.tecnicaGroup.controls.notaSegurancaAcessos,
    notaEstabilidadeLegado: this.tecnicaGroup.controls.notaEstabilidadeLegado,
    notaEstruturacaoDados: this.tecnicaGroup.controls.notaEstruturacaoDados,
    // Negocio
    notaGestaoRisco: this.negocioGroup.controls.notaGestaoRisco,
    notaReducaoSla: this.negocioGroup.controls.notaReducaoSla,
    notaAbrangencia: this.negocioGroup.controls.notaAbrangencia,
    notaExperienciaCidadao: this.negocioGroup.controls.notaExperienciaCidadao,
    notaVolumeMensal: this.negocioGroup.controls.notaVolumeMensal,
    notaFteLiberado: this.negocioGroup.controls.notaFteLiberado,
    // Fatores
    fatorImpedimento: this.impedimentoGroup.controls.fatorImpedimento,
    fatorUrgencia: this.urgenciaGroup.controls.fatorUrgencia,
  });

  constructor() {
    // Nao temos como escutar o step change do MatStepper via signal diretamente,
    // entao usamos um interval check ou podemos usar selectionChange
  }

  podeCalcular(): boolean {
    return (
      this.identificacaoGroup.valid &&
      this.tecnicaGroup.valid &&
      this.negocioGroup.valid &&
      this.impedimentoGroup.valid &&
      this.urgenciaGroup.valid
    );
  }

  salvar(): void {
    if (!this.podeCalcular()) return;

    this.salvando.set(true);

    // identificacaoGroup values used for processo context (future)
    const tec = this.tecnicaGroup.getRawValue();
    const neg = this.negocioGroup.getRawValue();
    const imp = this.impedimentoGroup.getRawValue();
    const urg = this.urgenciaGroup.getRawValue();
    const riscos = this.riscosArray.getRawValue();

    const riscosTexto = riscos
      .filter((r) => r['risco'] || r['contingencia'])
      .map((r) => `${r['risco']} | ${r['contingencia']}`)
      .join('\n');

    const dto: CreateAvaliacaoDto = {
      processoId: 0, // sera definido pelo backend ou contexto
      notaSegurancaAcessos: tec.notaSegurancaAcessos!,
      justifSegurancaAcessos: tec.justifSegurancaAcessos,
      notaEstabilidadeLegado: tec.notaEstabilidadeLegado!,
      justifEstabilidadeLegado: tec.justifEstabilidadeLegado,
      notaEstruturacaoDados: tec.notaEstruturacaoDados!,
      justifEstruturacaoDados: tec.justifEstruturacaoDados,
      notaGestaoRisco: neg.notaGestaoRisco!,
      justifGestaoRisco: neg.justifGestaoRisco,
      notaReducaoSla: neg.notaReducaoSla!,
      notaAbrangencia: neg.notaAbrangencia!,
      notaExperienciaCidadao: neg.notaExperienciaCidadao!,
      justifImpactoCidadao: neg.justifImpactoCidadao,
      notaVolumeMensal: neg.notaVolumeMensal!,
      notaFteLiberado: neg.notaFteLiberado!,
      justifEficiencia: neg.justifEficiencia,
      fatorImpedimento: imp.fatorImpedimento! as unknown as FatorImpedimento,
      justifImpedimento: imp.justifImpedimento,
      fatorUrgencia: urg.fatorUrgencia! as unknown as FatorUrgencia,
      justifUrgencia: urg.justifUrgencia,
      riscosContingencia: riscosTexto || undefined,
    };

    this.avaliacaoService.criarAvaliacao(dto).subscribe({
      next: (avaliacao) => {
        this.salvando.set(false);
        this.snackBar.open('Avaliacao salva com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/admin/avaliacoes', avaliacao.id]);
      },
      error: (err) => {
        this.salvando.set(false);
        this.snackBar.open('Erro ao salvar avaliacao. Tente novamente.', 'Fechar', {
          duration: 5000,
        });
        console.error('Erro ao salvar avaliacao:', err);
      },
    });
  }
}
