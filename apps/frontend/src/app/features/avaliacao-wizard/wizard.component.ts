import { Component, ChangeDetectionStrategy, OnInit, signal, inject, computed } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {
  CreateProcessoDto,
  DraftAvaliacaoDto,
  FatorImpedimento,
  FatorUrgencia,
} from '@ipa/shared';

import { AvaliacaoService } from './avaliacao.service';
import { ProcessosService } from '../processos/processos.service';

// Novos caminhos dos componentes organizados
import { StepIdentificacaoComponent } from './steps/identificacao/step-identificacao.component';
import { StepTecnicaComponent } from './steps/tecnica/step-tecnica.component';
import { StepNegocioComponent } from './steps/negocio/step-negocio.component';
import { StepImpedimentoComponent } from './steps/impedimento/step-impedimento.component';
import { StepUrgenciaComponent } from './steps/urgencia/step-urgencia.component';
import { StepRiscosComponent } from './steps/riscos/step-riscos.component';
import { IpaPreviewComponent } from './components/ipa-preview/ipa-preview.component';

interface StepDef {
  label: string;
  abbrev: string;
  icon: string;
}

@Component({
  selector: 'app-wizard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepIdentificacaoComponent,
    StepTecnicaComponent,
    StepNegocioComponent,
    StepImpedimentoComponent,
    StepUrgenciaComponent,
    StepRiscosComponent,
    IpaPreviewComponent,
  ],
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent implements OnInit {
  private readonly avaliacaoService = inject(AvaliacaoService);
  private readonly processosService = inject(ProcessosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly carregandoDados = signal(false);

  readonly currentStep = signal(0);
  readonly salvando = signal(false);
  readonly salvandoRascunho = signal(false);
  readonly processoId = signal<number | null>(null);
  readonly feedbackMensagem = signal<string | null>(null);
  readonly feedbackTipo = signal<'sucesso' | 'erro' | 'info'>('info');
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly steps: StepDef[] = [
    { label: 'Identificação', abbrev: 'Identif.', icon: 'fingerprint' },
    { label: 'Técnica', abbrev: 'Técnica', icon: 'settings_suggest' },
    { label: 'Negócio', abbrev: 'Negócio', icon: 'business_center' },
    { label: 'Impedimento', abbrev: 'Imped.', icon: 'block' },
    { label: 'Urgência', abbrev: 'Urgênc.', icon: 'notification_important' },
    { label: 'Riscos', abbrev: 'Riscos', icon: 'warning' },
  ];

  // Forms definition
  readonly identificacaoGroup = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    area: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    departamento: new FormControl(''),
    donoProcesso: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    solicitante: new FormControl(''),
    dataLevantamento: new FormControl(new Date().toISOString().slice(0, 10)),
  });

  readonly tecnicaGroup = new FormGroup({
    notaSegurancaAcessos: new FormControl<number | null>(null, Validators.required),
    justifSegurancaAcessos: new FormControl(''),
    notaEstabilidadeLegado: new FormControl<number | null>(null, Validators.required),
    justifEstabilidadeLegado: new FormControl(''),
    notaEstruturacaoDados: new FormControl<number | null>(null, Validators.required),
    justifEstruturacaoDados: new FormControl(''),
  });

  readonly negocioGroup = new FormGroup({
    notaGestaoRisco: new FormControl<number | null>(null, Validators.required),
    justifGestaoRisco: new FormControl(''),
    notaReducaoSla: new FormControl<number | null>(null, Validators.required),
    justifImpactoCidadao: new FormControl(''),
    notaAbrangencia: new FormControl<number | null>(null, Validators.required),
    notaExperienciaCidadao: new FormControl<number | null>(null, Validators.required),
    notaVolumeMensal: new FormControl<number | null>(null, Validators.required),
    justifEficiencia: new FormControl(''),
    notaFteLiberado: new FormControl<number | null>(null, Validators.required),
  });

  readonly impedimentoGroup = new FormGroup({
    fatorImpedimento: new FormControl<number>(1, Validators.required),
    justifImpedimento: new FormControl(''),
  });

  readonly urgenciaGroup = new FormGroup({
    fatorUrgencia: new FormControl<number>(1, Validators.required),
    justifUrgencia: new FormControl(''),
  });

  readonly riscosArray = new FormArray<FormGroup>([]);
  readonly riscosGroup = new FormGroup({
    riscos: this.riscosArray,
  });

  readonly allFieldsGroup = new FormGroup({
    identificacao: this.identificacaoGroup,
    tecnica: this.tecnicaGroup,
    negocio: this.negocioGroup,
    impedimento: this.impedimentoGroup,
    urgencia: this.urgenciaGroup,
    riscos: this.riscosGroup,
  });

  readonly progressPercent = computed(() => {
    return ((this.currentStep() + 1) / this.steps.length) * 100;
  });

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const processoIdParam = params.get('processoId');
    const editParam = params.get('edit');

    if (editParam) {
      this.carregarAvaliacao(Number(editParam));
    } else if (processoIdParam) {
      this.carregarProcessoComRascunho(Number(processoIdParam));
    }
  }

  private async carregarAvaliacao(avaliacaoId: number): Promise<void> {
    this.carregandoDados.set(true);
    try {
      const av = await firstValueFrom(this.avaliacaoService.buscarPorId(avaliacaoId));
      this.processoId.set(av.processoId);

      if ((av as any).processo) {
        this.preencherIdentificacao((av as any).processo);
      }
      this.preencherDraft(av);
    } catch (err) {
      console.error('Erro ao carregar avaliação para edição:', err);
      this.showFeedback('erro', 'Não foi possível carregar a avaliação.');
    } finally {
      this.carregandoDados.set(false);
    }
  }

  private async carregarProcessoComRascunho(processoId: number): Promise<void> {
    this.carregandoDados.set(true);
    try {
      this.processoId.set(processoId);

      const processo = await firstValueFrom(this.processosService.buscarPorId(processoId));
      this.identificacaoGroup.patchValue({
        nome: processo.noProcesso ?? '',
        area: processo.noArea ?? '',
        donoProcesso: processo.noDono ?? '',
        dataLevantamento: processo.dtLevantamento ?? new Date().toISOString().slice(0, 10),
      });

      try {
        const draft = await firstValueFrom(this.avaliacaoService.buscarRascunho(processoId));
        if (draft && Object.keys(draft).length > 0) {
          this.preencherDraft(draft);
        }
      } catch {
        // Sem rascunho salvo — não é erro
      }
    } catch (err) {
      console.error('Erro ao carregar processo:', err);
      this.showFeedback('erro', 'Não foi possível carregar os dados do processo.');
    } finally {
      this.carregandoDados.set(false);
    }
  }

  private preencherIdentificacao(processo: any): void {
    this.identificacaoGroup.patchValue({
      nome: processo.noProcesso ?? '',
      area: processo.noArea ?? '',
      departamento: processo.noDepartamento ?? '',
      donoProcesso: processo.noDonoProcesso ?? '',
      solicitante: processo.noSolicitante ?? '',
      dataLevantamento: processo.dtLevantamento ?? '',
    });
  }

  private preencherDraft(draft: DraftAvaliacaoDto | any): void {
    if (draft.notaSegurancaAcessos != null || draft.justifSegurancaAcessos) {
      this.tecnicaGroup.patchValue({
        notaSegurancaAcessos: draft.notaSegurancaAcessos ?? null,
        justifSegurancaAcessos: draft.justifSegurancaAcessos ?? '',
        notaEstabilidadeLegado: draft.notaEstabilidadeLegado ?? null,
        justifEstabilidadeLegado: draft.justifEstabilidadeLegado ?? '',
        notaEstruturacaoDados: draft.notaEstruturacaoDados ?? null,
        justifEstruturacaoDados: draft.justifEstruturacaoDados ?? '',
      });
    }

    if (draft.notaGestaoRisco != null || draft.justifGestaoRisco) {
      this.negocioGroup.patchValue({
        notaGestaoRisco: draft.notaGestaoRisco ?? null,
        justifGestaoRisco: draft.justifGestaoRisco ?? '',
        notaReducaoSla: draft.notaReducaoSla ?? null,
        justifImpactoCidadao: draft.justifImpactoCidadao ?? '',
        notaAbrangencia: draft.notaAbrangencia ?? null,
        notaExperienciaCidadao: draft.notaExperienciaCidadao ?? null,
        notaVolumeMensal: draft.notaVolumeMensal ?? null,
        justifEficiencia: draft.justifEficiencia ?? '',
        notaFteLiberado: draft.notaFteLiberado ?? null,
      });
    }

    if (draft.fatorImpedimento != null) {
      this.impedimentoGroup.patchValue({
        fatorImpedimento: Number(draft.fatorImpedimento),
        justifImpedimento: draft.justifImpedimento ?? '',
      });
    }

    if (draft.fatorUrgencia != null) {
      this.urgenciaGroup.patchValue({
        fatorUrgencia: Number(draft.fatorUrgencia),
        justifUrgencia: draft.justifUrgencia ?? '',
      });
    }

    if (draft.riscosContingencia) {
      const linhas = draft.riscosContingencia.split('\n').filter((l: string) => l.trim());
      this.riscosArray.clear();
      for (const linha of linhas) {
        const [risco, contingencia] = linha.split('|').map((s: string) => s.trim());
        this.riscosArray.push(
          new FormGroup({
            risco: new FormControl(risco || ''),
            contingencia: new FormControl(contingencia || ''),
          }),
        );
      }
    }
  }

  goToStep(step: number): void {
    if (step < 0 || step >= this.steps.length) return;
    this.currentStep.set(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async nextStep(): Promise<void> {
    const nextStep = this.currentStep() + 1;
    if (nextStep < this.steps.length) {
      this.salvandoRascunho.set(true);
      try {
        const processoId = await this.upsertIdentificacaoProcesso();
        this.processoId.set(processoId);

        if (this.currentStep() > 0) {
          await firstValueFrom(
            this.avaliacaoService.salvarRascunho(
              processoId,
              this.buildDraftDto(),
            ),
          );
          this.showFeedback('sucesso', 'Rascunho salvo automaticamente.');
        }

        this.currentStep.set(nextStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Erro ao salvar rascunho ao avançar etapa:', err);
        this.showFeedback(
          'erro',
          'Não foi possível salvar o rascunho. Verifique sua conexão e tente novamente.',
        );
      } finally {
        this.salvandoRascunho.set(false);
      }
    }
  }

  prevStep(): void {
    const prevStep = this.currentStep() - 1;
    if (prevStep >= 0) {
      this.currentStep.set(prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  readonly podeCalcular = computed(() => {
    return (
      this.tecnicaGroup.valid &&
      this.negocioGroup.valid &&
      this.impedimentoGroup.valid &&
      this.urgenciaGroup.valid
    );
  });

  async salvar(): Promise<void> {
    if (!this.podeCalcular()) return;

    this.salvando.set(true);
    try {
      const processoId = await this.upsertIdentificacaoProcesso();
      this.processoId.set(processoId);

      const avaliacao = await firstValueFrom(
        this.avaliacaoService.finalizarPorProcesso(
          processoId,
          this.buildDraftDto(),
        ),
      );

      const avaliacaoId = this.extractAvaliacaoId(avaliacao);
      if (!avaliacaoId) {
        throw new Error('ID da avaliação não retornado na finalização');
      }

      this.showFeedback('sucesso', 'Avaliação final salva com sucesso.');
      await this.router.navigate(['/admin/avaliacoes', avaliacaoId]);
    } catch (err) {
      console.error('Erro ao salvar total da avaliação:', err);
      this.showFeedback(
        'erro',
        'Erro ao salvar total da avaliação. Revise os campos obrigatórios.',
      );
    } finally {
      this.salvando.set(false);
    }
  }

  async salvarRascunho(): Promise<void> {
    this.salvandoRascunho.set(true);
    try {
      const processoId = await this.upsertIdentificacaoProcesso();
      this.processoId.set(processoId);
      await firstValueFrom(
        this.avaliacaoService.salvarRascunho(processoId, this.buildDraftDto()),
      );
      this.showFeedback('sucesso', 'Rascunho salvo com sucesso.');
    } catch (err) {
      console.error('Erro ao salvar rascunho:', err);
      this.showFeedback(
        'erro',
        'Erro ao salvar rascunho. Tente novamente em instantes.',
      );
    } finally {
      this.salvandoRascunho.set(false);
    }
  }

  private async upsertIdentificacaoProcesso(): Promise<number> {
    const identificacao = this.identificacaoGroup.getRawValue();
    const createProcessoDto: CreateProcessoDto = {
      nome: identificacao.nome,
      area: identificacao.area,
      departamento: identificacao.departamento || undefined,
      donoProcesso: identificacao.donoProcesso,
      solicitante: identificacao.solicitante || undefined,
      dataLevantamento:
        identificacao.dataLevantamento || new Date().toISOString().slice(0, 10),
    };

    const existingProcessoId = this.processoId();
    if (existingProcessoId) {
      await firstValueFrom(
        this.processosService.atualizar(existingProcessoId, createProcessoDto),
      );
      return existingProcessoId;
    }

    const processo = await firstValueFrom(
      this.processosService.criar(createProcessoDto),
    );
    const createdId = this.extractProcessoId(processo);
    if (!createdId) {
      throw new Error('Não foi possível identificar o ID do processo criado');
    }
    return createdId;
  }

  private buildDraftDto(): DraftAvaliacaoDto {
    const tec = this.tecnicaGroup.getRawValue();
    const neg = this.negocioGroup.getRawValue();
    const imp = this.impedimentoGroup.getRawValue();
    const urg = this.urgenciaGroup.getRawValue();

    const riscosTexto = this.riscosArray.controls
      .map((c) => c.getRawValue())
      .map((r) => `${r['risco']} | ${r['contingencia']}`)
      .join('\n');

    return {
      notaSegurancaAcessos: tec.notaSegurancaAcessos ?? undefined,
      justifSegurancaAcessos: this.nonEmpty(tec.justifSegurancaAcessos),
      notaEstabilidadeLegado: tec.notaEstabilidadeLegado ?? undefined,
      justifEstabilidadeLegado: this.nonEmpty(tec.justifEstabilidadeLegado),
      notaEstruturacaoDados: tec.notaEstruturacaoDados ?? undefined,
      justifEstruturacaoDados: this.nonEmpty(tec.justifEstruturacaoDados),
      notaGestaoRisco: neg.notaGestaoRisco ?? undefined,
      justifGestaoRisco: this.nonEmpty(neg.justifGestaoRisco),
      notaReducaoSla: neg.notaReducaoSla ?? undefined,
      justifImpactoCidadao: this.nonEmpty(neg.justifImpactoCidadao),
      notaAbrangencia: neg.notaAbrangencia ?? undefined,
      notaExperienciaCidadao: neg.notaExperienciaCidadao ?? undefined,
      notaVolumeMensal: neg.notaVolumeMensal ?? undefined,
      justifEficiencia: this.nonEmpty(neg.justifEficiencia),
      notaFteLiberado: neg.notaFteLiberado ?? undefined,
      fatorImpedimento: (imp.fatorImpedimento ?? undefined) as
        | FatorImpedimento
        | undefined,
      justifImpedimento: this.nonEmpty(imp.justifImpedimento),
      fatorUrgencia: (urg.fatorUrgencia ?? undefined) as
        | FatorUrgencia
        | undefined,
      justifUrgencia: this.nonEmpty(urg.justifUrgencia),
      riscosContingencia: riscosTexto || undefined,
    };
  }

  private nonEmpty(value: string | null | undefined): string | undefined {
    const normalized = value?.trim();
    return normalized ? normalized : undefined;
  }

  private showFeedback(
    tipo: 'sucesso' | 'erro' | 'info',
    mensagem: string,
  ): void {
    this.feedbackTipo.set(tipo);
    this.feedbackMensagem.set(mensagem);

    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }

    this.feedbackTimeout = setTimeout(() => {
      this.feedbackMensagem.set(null);
      this.feedbackTimeout = null;
    }, 3200);
  }

  private extractProcessoId(processo: unknown): number | null {
    const candidato = processo as { id?: number; idProcesso?: number };
    return candidato.id ?? candidato.idProcesso ?? null;
  }

  private extractAvaliacaoId(avaliacao: unknown): number | null {
    const candidato = avaliacao as { id?: number; idAvaliacao?: number };
    return candidato.id ?? candidato.idAvaliacao ?? null;
  }
}
