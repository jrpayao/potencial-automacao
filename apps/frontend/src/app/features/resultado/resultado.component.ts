import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AvaliacaoService } from '../avaliacao-wizard/avaliacao.service';
import { RadarChartComponent, RadarChartData } from './radar-chart.component';
import { IAvaliacao } from '@ipa/shared';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'any',
  standalone: true
})
export class AnyPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

@Component({
  selector: 'app-resultado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RadarChartComponent,
    AnyPipe
  ],
  template: `
    <div class="resultado-page">
      @if (carregando()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Carregando resultado da avaliação...</p>
        </div>
      } @else if (avaliacao()) {
        <div class="dashboard-container">
          <!-- Top Bar / Actions -->
          <header class="dashboard-header">
            <div class="header-left">
              <button class="btn-icon-only" (click)="voltar()" title="Voltar para Processos">
                <span class="material-symbols-outlined">arrow_back</span>
              </button>
              <div class="header-titles">
                <h1>Resultado da Avaliação</h1>
                <p>Análise detalhada do Potencial de Automação</p>
              </div>
            </div>
            <div class="header-actions">
              <button class="btn-secondary" (click)="editar()">
                <span class="material-symbols-outlined">edit</span>
                Editar Avaliação
              </button>
              <button class="btn-primary" (click)="exportarPdf()">
                <span class="material-symbols-outlined">picture_as_pdf</span>
                Exportar PDF
              </button>
            </div>
          </header>

          <div class="dashboard-grid">
            <!-- Left Column: Score and Stats -->
            <div class="dashboard-col">
              <!-- Score Card -->
              <section class="card glass-card score-card">
                <div class="ipa-display">
                  <div class="ipa-circle" [class]="badgeClass()">
                    <span class="ipa-value">{{ avaliacao()!.ipaFinal | number:'1.1-1' }}</span>
                    <span class="ipa-label">IPA FINAL</span>
                  </div>
                  <div class="ipa-info">
                    <h2 class="classificacao-title" [class]="badgeClass()">{{ classificacaoTexto() }}</h2>
                    <p class="classificacao-desc">
                      Com base nos critérios técnicos e de negócio, este processo apresenta um 
                      <strong>{{ classificacaoTexto().toLowerCase() }}</strong> para automação.
                    </p>
                  </div>
                </div>
              </section>

              <!-- Memory of Calculation Card -->
              <section class="card">
                <h3 class="card-title">Memória de Cálculo</h3>
                <div class="stats-grid">
                  <div class="stat-item">
                    <span class="stat-label">Índice Técnico (IT)</span>
                    <span class="stat-value">{{ avaliacao()!.indiceTecnico | number:'1.2-2' }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Índice Negócio (IN)</span>
                    <span class="stat-value">{{ avaliacao()!.indiceNegocio | number:'1.2-2' }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">IPA Base</span>
                    <span class="stat-value">{{ avaliacao()!.ipaBase | number:'1.2-2' }}</span>
                  </div>
                  <div class="stat-item highlight">
                    <span class="stat-label">Fator Impedimento</span>
                    <span class="stat-value">{{ avaliacao()!.fatorImpedimento | number:'1.1-1' }}</span>
                  </div>
                  <div class="stat-item highlight">
                    <span class="stat-label">Fator Urgência</span>
                    <span class="stat-value">{{ avaliacao()!.fatorUrgencia | number:'1.1-1' }}</span>
                  </div>
                </div>
              </section>

              <!-- Identification Card -->
              <section class="card">
                <h3 class="card-title">Identificação</h3>
                <div class="info-list">
                  <div class="info-row">
                    <span class="info-label">Processo</span>
                    <span class="info-value">{{ (avaliacao() | any)?.processo?.noProcesso || '—' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Área / Depto</span>
                    <span class="info-value">
                      {{ (avaliacao() | any)?.processo?.noArea || '—' }} 
                      @if ((avaliacao() | any)?.processo?.noDepartamento) { / {{ (avaliacao() | any)?.processo?.noDepartamento }} }
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Responsável</span>
                    <span class="info-value">
                      {{ (avaliacao() | any)?.processo?.noDonoProcesso || (avaliacao() | any)?.processo?.noDono || '—' }}
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Data Avaliação</span>
                    <span class="info-value">{{ avaliacao()?.criadoEm | date:'dd/MM/yyyy' }}</span>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right Column: Radar and Risks -->
            <div class="dashboard-col">
              <!-- Radar Chart Card -->
              <section class="card radar-card">
                <h3 class="card-title">Perfil Radar IT / IN</h3>
                <div class="radar-container">
                  <app-radar-chart [data]="radarData()!"></app-radar-chart>
                </div>
              </section>

              <!-- Risks Card -->
              @if (riscos().length > 0) {
                <section class="card risks-card">
                  <h3 class="card-title">Riscos e Contingências</h3>
                  <ul class="riscos-list">
                    @for (risco of riscos(); track $index) {
                      <li class="risco-item">
                        <span class="material-symbols-outlined risco-icon">warning</span>
                        <span class="risco-text">{{ risco }}</span>
                      </li>
                    }
                  </ul>
                </section>
              }
            </div>
          </div>
        </div>
      } @else if (erro()) {
        <div class="error-state">
          <span class="material-symbols-outlined error-icon">error</span>
          <h2>Ops! Algo deu errado.</h2>
          <p>{{ erro() }}</p>
          <button class="btn-primary" (click)="voltar()">Voltar para a página anterior</button>
        </div>
      }
    </div>
  `,
  styles: `
    .resultado-page {
      padding: 32px;
      background-color: var(--surface-container-lowest);
      min-height: calc(100vh - 64px);
    }

    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* Header Styling */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-titles h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-container);
      margin: 0;
      letter-spacing: -0.02em;
    }

    .header-titles p {
      font-size: 14px;
      color: #71717a;
      margin: 2px 0 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    /* Grid Layout */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .dashboard-col {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Card Styling */
    .card {
      background-color: white;
      border: 1px solid var(--outline-variant);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--on-surface);
      margin: 0 0 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Score Card Specifics */
    .score-card {
      background: linear-gradient(135deg, #ffffff, #f8fafc);
      overflow: hidden;
      position: relative;
    }

    .ipa-display {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .ipa-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      border: 4px solid white;
    }

    .ipa-circle.alto {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .ipa-circle.medio {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .ipa-circle.baixo {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .ipa-value {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
    }

    .ipa-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      opacity: 0.8;
    }

    .classificacao-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 4px;
    }

    .classificacao-title.alto { color: #059669; }
    .classificacao-title.medio { color: #d97706; }
    .classificacao-title.baixo { color: #dc2626; }

    .classificacao-desc {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px;
      background-color: var(--surface-container-lowest);
      border-radius: 8px;
    }

    .stat-item.highlight {
      background-color: var(--secondary-container);
    }

    .stat-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 800;
      color: var(--on-surface);
    }

    /* Info List */
    .info-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--outline-variant);
      padding-bottom: 12px;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
    }

    .info-value {
      font-size: 13px;
      font-weight: 700;
      color: var(--on-surface);
      text-align: right;
    }

    /* Radar Section */
    .radar-container {
      height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Risks List */
    .riscos-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .risco-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      background-color: #fff1f2;
      border-left: 4px solid #f43f5e;
      border-radius: 4px 8px 8px 4px;
    }

    .risco-icon {
      color: #f43f5e;
      font-size: 20px;
    }

    .risco-text {
      font-size: 13px;
      color: #881337;
      line-height: 1.4;
    }

    /* State Layouts (Loading/Error) */
    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100px 32px;
      text-align: center;
      gap: 20px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(0,0,0,0.1);
      border-top-color: var(--primary-container);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-icon {
      font-size: 64px;
      color: #ef4444;
    }

    /* Buttons */
    .btn-primary, .btn-secondary, .btn-icon-only {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: var(--primary-container);
      color: white;
    }

    .btn-primary:hover {
      box-shadow: 0 4px 12px rgba(0, 52, 97, 0.2);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: white;
      color: var(--primary-container);
      border: 1px solid var(--outline-variant);
    }

    .btn-secondary:hover {
      background-color: var(--surface-container-low);
      border-color: var(--primary-container);
    }

    .btn-icon-only {
      padding: 8px;
      background: transparent;
      color: #64748b;
    }

    .btn-icon-only:hover {
      background-color: var(--surface-container-low);
      color: var(--primary-container);
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `,
})
export class ResultadoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly avaliacaoService = inject(AvaliacaoService);

  readonly avaliacao = signal<IAvaliacao | null>(null);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.erro.set('ID de avaliação inválido');
      this.carregando.set(false);
      return;
    }

    this.avaliacaoService.buscarPorId(id).subscribe({
      next: (avaliacao) => {
        this.avaliacao.set(avaliacao);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(err?.message ?? 'Erro desconhecido ao carregar a avaliação');
        this.carregando.set(false);
      },
    });
  }

  badgeClass(): string {
    const ipa = this.avaliacao()?.ipaFinal ?? 0;
    if (ipa >= 4) return 'alto';
    if (ipa >= 2.5) return 'medio';
    return 'baixo';
  }

  classificacaoTexto(): string {
    const cls = this.badgeClass();
    if (cls === 'alto') return 'Alto Potencial';
    if (cls === 'medio') return 'Médio Potencial';
    return 'Baixo Potencial';
  }

  radarData(): RadarChartData | null {
    const av = this.avaliacao();
    if (!av) return null;
    return {
      tecnica: [av.notaSegurancaAcessos, av.notaEstabilidadeLegado, av.notaEstruturacaoDados],
      negocio: [av.notaGestaoRisco, av.notaExperienciaCidadao, av.notaFteLiberado],
    };
  }

  riscos(): string[] {
    const riscos = this.avaliacao()?.riscosContingencia;
    if (!riscos || riscos.trim() === '') return [];
    return riscos
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
  }

  editar(): void {
    const id = this.avaliacao()?.id;
    if (id) {
      this.router.navigate(['/admin/avaliacoes/nova'], { queryParams: { edit: id } });
    }
  }

  exportarPdf(): void {
    const id = this.avaliacao()?.id;
    if (!id) return;
    this.avaliacaoService.exportarPdf(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `avaliacao-ipa-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/admin/processos']);
  }
}
