import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ResultadoComponent } from './resultado.component';
import { AvaliacaoService } from '../avaliacao-wizard/avaliacao.service';
import { RadarChartComponent } from './radar-chart.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';
import { RadarChartData } from './radar-chart.component';

// Mock do RadarChartComponent para evitar erros de canvas/Chart.js em testes
@Component({
  selector: 'app-radar-chart',
  standalone: true,
  template: '<div class="radar-mock"></div>',
})
class RadarChartMockComponent {
  @Input() data!: RadarChartData;
}

const mockAvaliacao = {
  id: 1,
  ipaFinal: 4.5,
  indiceTecnico: 4.0,
  indiceNegocio: 5.0,
  ipaBase: 4.5,
  fatorImpedimento: 1.0,
  fatorUrgencia: 1.0,
  notaSegurancaAcessos: 4,
  notaEstabilidadeLegado: 4,
  notaEstruturacaoDados: 4,
  notaGestaoRisco: 5,
  notaExperienciaCidadao: 5,
  notaFteLiberado: 5,
  riscosContingencia: '',
  criadoEm: '2026-04-06',
};

describe('ResultadoComponent', () => {
  let avaliacaoServiceSpy: any;

  beforeEach(async () => {
    avaliacaoServiceSpy = {
      buscarPorId: () => of(mockAvaliacao),
      exportarPdf: () => of(new Blob()),
    };

    await TestBed.configureTestingModule({
      imports: [ResultadoComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AvaliacaoService, useValue: avaliacaoServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    })
      .overrideComponent(ResultadoComponent, {
        remove: { imports: [RadarChartComponent] },
        add: { imports: [RadarChartMockComponent] },
      })
      .compileComponents();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(ResultadoComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve classificar IPA >= 4 como alto', () => {
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.badgeClass()).toBe('alto');
  });

  it('deve classificar IPA entre 2.5 e 4 como medio', () => {
    avaliacaoServiceSpy.buscarPorId = () => of({ ...mockAvaliacao, ipaFinal: 3.0 });
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.badgeClass()).toBe('medio');
  });

  it('deve classificar IPA < 2.5 como baixo', () => {
    avaliacaoServiceSpy.buscarPorId = () => of({ ...mockAvaliacao, ipaFinal: 2.0 });
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.badgeClass()).toBe('baixo');
  });

  it('deve exibir texto correto para alto potencial', () => {
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.classificacaoTexto()).toBe('Alto Potencial');
  });

  it('deve popular radarData com dados da avaliacao', () => {
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    const radar = fixture.componentInstance.radarData();
    expect(radar).not.toBeNull();
    expect(radar!.tecnica).toEqual([4, 4, 4]);
    expect(radar!.negocio).toEqual([5, 5, 5]);
  });

  it('deve retornar lista vazia de riscos quando riscosContingencia esta vazio', () => {
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.riscos()).toEqual([]);
  });

  it('deve parsear riscos separados por linha', () => {
    avaliacaoServiceSpy.buscarPorId = () =>
      of({ ...mockAvaliacao, riscosContingencia: 'Risco A\nRisco B\n' });
    const fixture = TestBed.createComponent(ResultadoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.riscos()).toEqual(['Risco A', 'Risco B']);
  });
});
