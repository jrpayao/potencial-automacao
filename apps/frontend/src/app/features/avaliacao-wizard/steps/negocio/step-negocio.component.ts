import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface SubCriterio {
  label: string;
  control: string;
  descriptors: { value: number; label: string }[];
}

interface BlocoNegocio {
  titulo: string;
  subCriterios: SubCriterio[];
  controlJustif: string;
}

@Component({
  selector: 'app-step-negocio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-negocio.component.html',
  styleUrls: ['./step-negocio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepNegocioComponent {
  readonly form = input.required<FormGroup>();

  readonly blocos: BlocoNegocio[] = [
    {
      titulo: 'Gestão de Risco',
      controlJustif: 'justifGestaoRisco',
      subCriterios: [
        {
          label: 'Nível de Risco Operacional/Jurídico',
          control: 'notaGestaoRisco',
          descriptors: [
            { value: 5, label: 'Risco crítico (multas iminentes)' },
            { value: 4, label: 'Risco alto (regulatório)' },
            { value: 3, label: 'Risco médio (perdas operacionais)' },
            { value: 2, label: 'Risco baixo (inconveniências)' },
            { value: 1, label: 'Risco mínimo' },
            { value: 0, label: 'Sem risco identificado' },
          ],
        },
      ],
    },
    {
      titulo: 'Impacto no Cidadão',
      controlJustif: 'justifImpactoCidadao',
      subCriterios: [
        {
          label: 'Redução de SLA (Tempo de Resposta)',
          control: 'notaReducaoSla',
          descriptors: [
            { value: 5, label: 'Reduz SLA em > 80%' },
            { value: 4, label: 'Reduz SLA em 60-80%' },
            { value: 3, label: 'Reduz SLA em 40-60%' },
            { value: 2, label: 'Reduz SLA em 20-40%' },
            { value: 1, label: 'Reduz SLA em até 20%' },
            { value: 0, label: 'Sem impacto no SLA' },
          ],
        },
        {
          label: 'Abrangência (Volume de Cidadãos)',
          control: 'notaAbrangencia',
          descriptors: [
            { value: 5, label: '> 100 mil cidadãos/ano' },
            { value: 4, label: '50-100 mil cidadãos/ano' },
            { value: 3, label: '10-50 mil cidadãos/ano' },
            { value: 2, label: '1-10 mil cidadãos/ano' },
            { value: 1, label: '< 1 mil cidadãos/ano' },
            { value: 0, label: 'Uso exclusivamente interno' },
          ],
        },
        {
          label: 'Experiência do Usuário',
          control: 'notaExperienciaCidadao',
          descriptors: [
            { value: 5, label: 'Eliminação de atendimento presencial' },
            { value: 4, label: 'Autoatendimento digital completo' },
            { value: 3, label: 'Redução significativa de etapas' },
            { value: 2, label: 'Melhoria parcial da experiência' },
            { value: 1, label: 'Melhoria mínima perceptível' },
            { value: 0, label: 'Sem impacto na experiência' },
          ],
        },
      ],
    },
    {
      titulo: 'Eficiência Operacional',
      controlJustif: 'justifEficiencia',
      subCriterios: [
        {
          label: 'Volume Mensal de Execuções',
          control: 'notaVolumeMensal',
          descriptors: [
            { value: 5, label: '> 10 mil execuções/mês' },
            { value: 4, label: '5-10 mil execuções/mês' },
            { value: 3, label: '1-5 mil execuções/mês' },
            { value: 2, label: '500-1000 execuções/mês' },
            { value: 1, label: '100-500 execuções/mês' },
            { value: 0, label: '< 100 execuções/mês' },
          ],
        },
        {
          label: 'FTE Liberado (Esforço Humano)',
          control: 'notaFteLiberado',
          descriptors: [
            { value: 5, label: 'Libera > 5 FTEs' },
            { value: 4, label: 'Libera 3-5 FTEs' },
            { value: 3, label: 'Libera 1-3 FTEs' },
            { value: 2, label: 'Libera 0.5-1 FTE' },
            { value: 1, label: 'Libera < 0.5 FTE' },
            { value: 0, label: 'Não libera FTE' },
          ],
        },
      ],
    },
  ];
}
