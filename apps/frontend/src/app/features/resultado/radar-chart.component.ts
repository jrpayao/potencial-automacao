import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export interface RadarChartData {
  /** Dimensao Tecnica: [Seguranca, Estabilidade, Estruturacao] */
  tecnica: [number, number, number];
  /** Dimensao Negocio: [GestaoRisco, ImpactoCidadao, Eficiencia] */
  negocio: [number, number, number];
}

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-wrapper">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: `
    .chart-wrapper {
      position: relative;
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
    }
  `,
})
export class RadarChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() data!: RadarChartData;

  @ViewChild('chartCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chart) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private createChart(): void {
    if (!this.data) return;

    const labels = [
      'Seguranca',
      'Estabilidade',
      'Estruturacao',
      'Gestao Risco',
      'Impacto Cidadao',
      'Eficiencia',
    ];

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Indice Tecnico (IT)',
            data: [...this.data.tecnica, ...Array(3).fill(null)],
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            borderColor: '#2196F3',
            borderWidth: 2,
            pointBackgroundColor: '#2196F3',
          },
          {
            label: 'Indice Negocio (IN)',
            data: [...Array(3).fill(null), ...this.data.negocio],
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderColor: '#4CAF50',
            borderWidth: 2,
            pointBackgroundColor: '#4CAF50',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              backdropColor: 'transparent',
            },
            pointLabels: {
              font: { size: 12 },
            },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  private updateChart(): void {
    if (!this.chart || !this.data) return;
    this.chart.data.datasets[0].data = [
      ...this.data.tecnica,
      ...Array(3).fill(null),
    ];
    this.chart.data.datasets[1].data = [
      ...Array(3).fill(null),
      ...this.data.negocio,
    ];
    this.chart.update();
  }
}
