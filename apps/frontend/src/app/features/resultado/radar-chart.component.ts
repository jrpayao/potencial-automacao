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
  ChartConfiguration,
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
  /** Dimensão Técnica: [Seguranca, Estabilidade, Estruturacao] */
  tecnica: [number, number, number];
  /** Dimensão Negócio: [GestaoRisco, ImpactoCidadao, Eficiencia] */
  negocio: [number, number, number];
}

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: `
    .chart-container {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
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
      'Segurança',
      'Estabilidade',
      'Estruturação',
      'Gestão Risco',
      'Impacto Cidadão',
      'Eficiência',
    ];

    const config: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Indice Técnico (IT)',
            data: [...this.data.tecnica, null, null, null],
            backgroundColor: 'rgba(0, 52, 97, 0.1)',
            borderColor: '#003461',
            borderWidth: 2,
            pointBackgroundColor: '#003461',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#003461',
            fill: true,
            tension: 0.1
          },
          {
            label: 'Indice Negócio (IN)',
            data: [null, null, null, ...this.data.negocio],
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: '#10b981',
            borderWidth: 2,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#10b981',
            fill: true,
            tension: 0.1
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 5,
            beginAtZero: true,
            angleLines: {
              display: true,
              color: '#e2e8f0'
            },
            grid: {
              color: '#e2e8f0'
            },
            ticks: {
              stepSize: 1,
              display: false,
            },
            pointLabels: {
              font: {
                family: "'Inter', sans-serif",
                size: 11,
                weight: 600
              },
              color: '#64748b'
            },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                family: "'Inter', sans-serif",
                size: 12,
                weight: 500
              },
              color: '#1e293b'
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { family: "'Inter', sans-serif", size: 13 },
            bodyFont: { family: "'Inter', sans-serif", size: 12 },
            padding: 12,
            cornerRadius: 8,
            displayColors: true
          }
        },
      },
    };

    this.chart = new Chart(this.canvasRef.nativeElement, config);
  }

  private updateChart(): void {
    if (!this.chart || !this.data) return;
    this.chart.data.datasets[0].data = [
      ...this.data.tecnica,
      null, null, null
    ];
    this.chart.data.datasets[1].data = [
      null, null, null,
      ...this.data.negocio
    ];
    this.chart.update();
  }
}
