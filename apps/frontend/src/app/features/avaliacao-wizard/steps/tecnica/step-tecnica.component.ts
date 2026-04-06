import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface CriterioDescriptors {
  label: string;
  sublabel: string;
  controlNota: string;
  controlJustif: string;
  descriptors: { value: number; label: string }[];
}

@Component({
  selector: 'app-step-tecnica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-tecnica.component.html',
  styleUrls: ['./step-tecnica.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepTecnicaComponent {
  readonly form = input.required<FormGroup>();

  readonly criterios: CriterioDescriptors[] = [
    {
      label: 'Segurança e Acessos',
      sublabel: 'Complexidade de login e protocolos de segurança.',
      controlNota: 'notaSegurancaAcessos',
      controlJustif: 'justifSegurancaAcessos',
      descriptors: [
        { value: 5, label: 'API documentada' },
        { value: 4, label: 'Login simples' },
        { value: 3, label: 'MFA contornável' },
        { value: 2, label: 'MFA+VPN' },
        { value: 1, label: 'Token A3 limitado' },
        { value: 0, label: 'Token A3 obrigatório' },
      ],
    },
    {
      label: 'Estabilidade do Legado',
      sublabel: 'Frequência de mudanças nas aplicações envolvidas.',
      controlNota: 'notaEstabilidadeLegado',
      controlJustif: 'justifEstabilidadeLegado',
      descriptors: [
        { value: 5, label: 'API estável' },
        { value: 4, label: 'Interface estável' },
        { value: 3, label: 'Mudanças ocasionais' },
        { value: 2, label: 'Mudanças frequentes' },
        { value: 1, label: 'Legado instável' },
        { value: 0, label: 'Substituição prevista' },
      ],
    },
    {
      label: 'Estruturação dos Dados',
      sublabel: 'Qualidade e formato dos dados de entrada.',
      controlNota: 'notaEstruturacaoDados',
      controlJustif: 'justifEstruturacaoDados',
      descriptors: [
        { value: 5, label: 'Dados via API' },
        { value: 4, label: 'Excel/CSV padronizado' },
        { value: 3, label: 'PDFs digitais (OCR)' },
        { value: 2, label: 'PDFs não estruturados' },
        { value: 1, label: 'Escaneados (baixa)' },
        { value: 0, label: 'Documentos físicos' },
      ],
    },
  ];
}
