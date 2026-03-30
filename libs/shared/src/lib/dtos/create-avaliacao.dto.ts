import { FatorImpedimento } from '../enums/fator-impedimento.enum.js';
import { FatorUrgencia } from '../enums/fator-urgencia.enum.js';

export interface CreateAvaliacaoDto {
  processoId: number;

  // Dimensao Tecnica
  notaVolume: number;
  notaRepeticao: number;
  notaRegras: number;
  notaDigital: number;
  notaEstabilidade: number;
  justificativaVolume?: string;
  justificativaRepeticao?: string;
  justificativaRegras?: string;
  justificativaDigital?: string;
  justificativaEstabilidade?: string;

  // Dimensao Negocio
  notaImpactoErro: number;
  notaGanhoEficiencia: number;
  notaSatisfacao: number;
  notaConformidade: number;
  justificativaImpactoErro?: string;
  justificativaGanhoEficiencia?: string;
  justificativaSatisfacao?: string;
  justificativaConformidade?: string;

  // Fatores
  fatorImpedimento: FatorImpedimento;
  fatorUrgencia: FatorUrgencia;
  justificativaImpedimento?: string;
  justificativaUrgencia?: string;

  // Riscos
  riscoSeguranca: number;
  riscoReputacao: number;
  justificativaRiscoSeguranca?: string;
  justificativaRiscoReputacao?: string;
}
