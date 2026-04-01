import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AvaliacaoService } from '../avaliacao-wizard/avaliacao.service';
import { RadarChartComponent, RadarChartData } from './radar-chart.component';
import { IAvaliacao } from '@ipa/shared';

@Component({
  selector: 'app-resultado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    RadarChartComponent,
  ],
  styles: `
    .resultado-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 8px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-label {
      font-size: 12px;
      color: #666;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 15px;
      color: #222;
    }

    .calculo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .calculo-item {
      text-align: center;
      padding: 16px 8px;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .calculo-label {
      font-size: 12px;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .calculo-value {
      font-size: 24px;
      font-weight: 700;
      color: #333;
    }

    .ipa-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      font-size: 36px;
      font-weight: 800;
      color: white;
      margin: 0 auto;
    }

    .ipa-badge.alto {
      background: linear-gradient(135deg, #4caf50, #2e7d32);
      box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
    }

    .ipa-badge.medio {
      background: linear-gradient(135deg, #ff9800, #e65100);
      box-shadow: 0 4px 16px rgba(255, 152, 0, 0.4);
    }

    .ipa-badge.baixo {
      background: linear-gradient(135deg, #f44336, #b71c1c);
      box-shadow: 0 4px 16px rgba(244, 67, 54, 0.4);
    }

    .ipa-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px 0;
    }

    .ipa-label {
      font-size: 14px;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .ipa-classificacao {
      font-size: 16px;
      font-weight: 600;
    }

    .ipa-classificacao.alto { color: #2e7d32; }
    .ipa-classificacao.medio { color: #e65100; }
    .ipa-classificacao.baixo { color: #b71c1c; }

    .chart-section {
      display: flex;
      justify-content: center;
      padding: 16px 0;
    }

    .riscos-lista {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .riscos-lista li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
      color: #444;
    }

    .riscos-lista li:last-child {
      border-bottom: none;
    }

    .riscos-lista mat-icon {
      color: #f44336;
      font-size: 18px;
      margin-top: 1px;
      flex-shrink: 0;
    }

    .actions-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      padding-top: 8px;
    }

    .loading-wrapper {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }

    mat-card {
      margin-bottom: 20px;
    }
  `,
  template: `
    @if (carregando()) {
      <div class="loading-wrapper">
        <mat-spinner diameter="48"></mat-spinner>
      </div>
    } @else if (avaliacao()) {
      <div class="resultado-container">

        <!-- Identificacao -->
        <mat-card>
          <mat-card-header>
            <mat-card-title class="section-title">Identificacao do Processo</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Nome do Processo</span>
                <span class="info-value">{{ processo()?.nome || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Area</span>
                <span class="info-value">{{ processo()?.area || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Departamento</span>
                <span class="info-value">{{ processo()?.departamento || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Dono do Processo</span>
                <span class="info-value">{{ processo()?.donoProcesso || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Solicitante</span>
                <span class="info-value">{{ processo()?.solicitante || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Data do Levantamento</span>
                <span class="info-value">{{ processo()?.dataLevantamento | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- IPA Final Badge -->
        <mat-card>
          <mat-card-content>
            <div class="ipa-section">
              <span class="ipa-label">IPA Final</span>
              <div class="ipa-badge" [class]="badgeClass()">
                {{ avaliacao()!.ipaFinal | number:'1.1-2' }}
              </div>
              <span class="ipa-classificacao" [class]="badgeClass()">
                {{ classificacaoTexto() }}
              </span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Memoria de Calculo -->
        <mat-card>
          <mat-card-header>
            <mat-card-title class="section-title">Memoria de Calculo</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="calculo-grid">
              <div class="calculo-item">
                <div class="calculo-label">Indice Tecnico (IT)</div>
                <div class="calculo-value">{{ avaliacao()!.indiceTecnico | number:'1.2-2' }}</div>
              </div>
              <div class="calculo-item">
                <div class="calculo-label">Indice Negocio (IN)</div>
                <div class="calculo-value">{{ avaliacao()!.indiceNegocio | number:'1.2-2' }}</div>
              </div>
              <div class="calculo-item">
                <div class="calculo-label">IPA Base</div>
                <div class="calculo-value">{{ avaliacao()!.ipaBase | number:'1.2-2' }}</div>
              </div>
              <div class="calculo-item">
                <div class="calculo-label">Fator Impedimento (FI)</div>
                <div class="calculo-value">{{ avaliacao()!.fatorImpedimento }}</div>
              </div>
              <div class="calculo-item">
                <div class="calculo-label">Fator Urgencia (FU)</div>
                <div class="calculo-value">{{ avaliacao()!.fatorUrgencia }}</div>
              </div>
              <div class="calculo-item">
                <div class="calculo-label">IPA Final</div>
                <div class="calculo-value" [class]="badgeClass()">
                  {{ avaliacao()!.ipaFinal | number:'1.2-2' }}
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Radar Chart -->
        <mat-card>
          <mat-card-header>
            <mat-card-title class="section-title">Perfil Radar IT / IN</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-section">
              <app-radar-chart [data]="radarData()!"></app-radar-chart>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Riscos -->
        @if (riscos().length > 0) {
          <mat-card>
            <mat-card-header>
              <mat-card-title class="section-title">Riscos e Contingencias</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ul class="riscos-lista">
                @for (risco of riscos(); track $index) {
                  <li>
                    <mat-icon>warning</mat-icon>
                    <span>{{ risco }}</span>
                  </li>
                }
              </ul>
            </mat-card-content>
          </mat-card>
        }

        <!-- Acoes -->
        <mat-card>
          <mat-card-content>
            <div class="actions-row">
              <button mat-raised-button color="primary" (click)="editar()">
                <mat-icon>edit</mat-icon>
                Editar
              </button>
              <button mat-raised-button color="accent" (click)="exportarPdf()">
                <mat-icon>picture_as_pdf</mat-icon>
                Exportar PDF
              </button>
              <button mat-stroked-button (click)="voltar()">
                <mat-icon>arrow_back</mat-icon>
                Voltar
              </button>
            </div>
          </mat-card-content>
        </mat-card>

      </div>
    } @else if (erro()) {
      <div class="resultado-container">
        <mat-card>
          <mat-card-content>
            <p style="color: #f44336; text-align: center; padding: 40px 0;">
              <mat-icon>error_outline</mat-icon>
              Erro ao carregar resultado: {{ erro() }}
            </p>
            <div style="display:flex; justify-content:center;">
              <button mat-stroked-button (click)="voltar()">Voltar</button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
})
export class ResultadoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly avaliacaoService = inject(AvaliacaoService);

  readonly avaliacao = signal<IAvaliacao | null>(null);
  readonly processo = signal<{ nome: string; area: string; departamento?: string; donoProcesso: string; solicitante?: string; dataLevantamento: string } | null>(null);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.erro.set('ID de avaliacao invalido');
      this.carregando.set(false);
      return;
    }

    this.avaliacaoService.buscarPorId(id).subscribe({
      next: (avaliacao) => {
        this.avaliacao.set(avaliacao);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(err?.message ?? 'Erro desconhecido');
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
    if (cls === 'medio') return 'Medio Potencial';
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
