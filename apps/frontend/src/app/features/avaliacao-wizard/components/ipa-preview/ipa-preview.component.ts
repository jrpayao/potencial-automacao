import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  DestroyRef,
  inject,
  OnInit,
  computed,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  calcularIT,
  calcularIN,
  calcularIPA,
  calcularImpactoCidadao,
  calcularEficiencia,
  StatusIpa,
} from '@ipa/shared';
import type { ResultadoIPA } from '@ipa/shared';

@Component({
  selector: 'app-ipa-preview',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './ipa-preview.component.html',
  styleUrls: ['./ipa-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IpaPreviewComponent implements OnInit {
  readonly form = input.required<FormGroup>();
  private readonly destroyRef = inject(DestroyRef);

  readonly it = signal(0);
  readonly in_ = signal(0);
  readonly fi = signal(1);
  readonly fu = signal(1);
  readonly resultado = signal<ResultadoIPA>({
    ipaBase: 0,
    ipaFinal: 0,
    status: StatusIpa.DESCARTE,
  });

  readonly statusLabel = signal('Aguardando');

  readonly percentValue = computed(() => (this.resultado().ipaFinal / 5) * 100);
  readonly dashOffset = computed(() => {
    const circum = 351.85;
    return circum - (this.percentValue() / 100) * circum;
  });

  statusColor(): string {
    const s = this.resultado().status;
    if (s === StatusIpa.PRIORIDADE_ALTA) return '#22c55e'; // Verde
    if (s === StatusIpa.BACKLOG) return '#eab308'; // Amarelo
    return '#ef4444'; // Vermelho
  }

  ngOnInit(): void {
    this.form()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => this.recalcular(val));
    this.recalcular(this.form().getRawValue());
  }

  private recalcular(val: any): void {
    const tec = val.tecnica || {};
    const neg = val.negocio || {};
    const imp = val.impedimento || {};
    const urg = val.urgencia || {};

    const seg = this.num(tec.notaSegurancaAcessos);
    const est = this.num(tec.notaEstabilidadeLegado);
    const estr = this.num(tec.notaEstruturacaoDados);

    const gestao = this.num(neg.notaGestaoRisco);
    const sla = this.num(neg.notaReducaoSla);
    const abrang = this.num(neg.notaAbrangencia);
    const exp = this.num(neg.notaExperienciaCidadao);
    const vol = this.num(neg.notaVolumeMensal);
    const fte = this.num(neg.notaFteLiberado);

    const fiVal = this.num(imp.fatorImpedimento, 1);
    const fuVal = this.num(urg.fatorUrgencia, 1);

    const itVal = calcularIT(seg, est, estr);
    const impCidadao = calcularImpactoCidadao(sla, abrang, exp);
    const eficiencia = calcularEficiencia(vol, fte);
    const inVal = calcularIN(gestao, impCidadao, eficiencia);
    const res = calcularIPA(itVal, inVal, fiVal, fuVal);

    this.it.set(itVal);
    this.in_.set(inVal);
    this.fi.set(fiVal);
    this.fu.set(fuVal);
    this.resultado.set(res);

    if (res.status === StatusIpa.PRIORIDADE_ALTA) {
      this.statusLabel.set('Prioridade Alta');
    } else if (res.status === StatusIpa.BACKLOG) {
      this.statusLabel.set('Backlog');
    } else {
      this.statusLabel.set('Descarte');
    }
  }

  private num(v: unknown, fallback = 0): number {
    return typeof v === 'number' ? v : fallback;
  }
}
