import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  DestroyRef,
  inject,
  OnInit,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="preview-card">
      <h3>Preview IPA</h3>

      <div class="section">
        <h4>Indice Tecnico (IT)</h4>
        <div class="value">{{ it() | number:'1.2-2' }}</div>
      </div>

      <div class="section">
        <h4>Indice de Negocio (IN)</h4>
        <div class="value">{{ in_() | number:'1.2-2' }}</div>
      </div>

      <hr />

      <div class="section">
        <h4>IPA Base</h4>
        <div class="value">{{ resultado().ipaBase | number:'1.2-2' }}</div>
      </div>

      <div class="section row">
        <div class="factor">
          <span class="factor-label">FI</span>
          <span class="factor-value">{{ fi() | number:'1.2-2' }}</span>
        </div>
        <div class="factor">
          <span class="factor-label">FU</span>
          <span class="factor-value">{{ fu() | number:'1.2-2' }}</span>
        </div>
      </div>

      <hr />

      <div class="section final">
        <h4>IPA Final</h4>
        <div class="value large">{{ resultado().ipaFinal | number:'1.2-2' }}</div>
      </div>

      <div class="status-badge" [class]="statusClass()">
        {{ statusLabel() }}
      </div>
    </div>
  `,
  styles: `
    .preview-card {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      position: sticky;
      top: 16px;
    }
    h3 {
      margin: 0 0 16px;
      color: #333;
      font-size: 1.1rem;
      text-align: center;
    }
    h4 {
      margin: 0 0 4px;
      color: #666;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .section {
      margin-bottom: 12px;
    }
    .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1976d2;
    }
    .value.large {
      font-size: 2rem;
    }
    .row {
      display: flex;
      gap: 24px;
    }
    .factor {
      display: flex;
      flex-direction: column;
    }
    .factor-label {
      font-size: 0.8rem;
      color: #888;
      font-weight: 500;
    }
    .factor-value {
      font-size: 1.2rem;
      font-weight: 600;
      color: #555;
    }
    hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 12px 0;
    }
    .final {
      text-align: center;
    }
    .status-badge {
      text-align: center;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      margin-top: 12px;
    }
    .status-prioridade_alta {
      background: #c8e6c9;
      color: #2e7d32;
    }
    .status-backlog {
      background: #fff9c4;
      color: #f57f17;
    }
    .status-descarte {
      background: #ffcdd2;
      color: #c62828;
    }
  `,
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

  readonly statusClass = signal('status-descarte');
  readonly statusLabel = signal('Descarte');

  ngOnInit(): void {
    this.form()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => this.recalcular(val));

    // Calculo inicial
    this.recalcular(this.form().getRawValue());
  }

  private recalcular(val: Record<string, unknown>): void {
    const seg = this.num(val['notaSegurancaAcessos']);
    const est = this.num(val['notaEstabilidadeLegado']);
    const estr = this.num(val['notaEstruturacaoDados']);

    const gestao = this.num(val['notaGestaoRisco']);
    const sla = this.num(val['notaReducaoSla']);
    const abrang = this.num(val['notaAbrangencia']);
    const exp = this.num(val['notaExperienciaCidadao']);
    const vol = this.num(val['notaVolumeMensal']);
    const fte = this.num(val['notaFteLiberado']);

    const fiVal = this.num(val['fatorImpedimento'], 1);
    const fuVal = this.num(val['fatorUrgencia'], 1);

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

    this.statusClass.set(`status-${res.status}`);
    this.statusLabel.set(this.statusToLabel(res.status));
  }

  private num(v: unknown, fallback = 0): number {
    return typeof v === 'number' ? v : fallback;
  }

  private statusToLabel(status: StatusIpa): string {
    switch (status) {
      case StatusIpa.PRIORIDADE_ALTA:
        return 'Prioridade Alta';
      case StatusIpa.BACKLOG:
        return 'Backlog';
      case StatusIpa.DESCARTE:
        return 'Descarte';
    }
  }
}
