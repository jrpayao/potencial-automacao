import { FatorImpedimento } from '../enums/fator-impedimento.enum.js';
import { FatorUrgencia } from '../enums/fator-urgencia.enum.js';

export interface CreateAvaliacaoDto {
  processoId: number;

  // Dimensão Técnica (IT)
  notaSegurancaAcessos: number;
  justifSegurancaAcessos: string;
  notaEstabilidadeLegado: number;
  justifEstabilidadeLegado: string;
  notaEstruturacaoDados: number;
  justifEstruturacaoDados: string;

  // Dimensão Negócio (IN)
  notaGestaoRisco: number;
  justifGestaoRisco: string;
  notaReducaoSla: number;
  notaAbrangencia: number;
  notaExperienciaCidadao: number;
  justifImpactoCidadao: string;
  notaVolumeMensal: number;
  notaFteLiberado: number;
  justifEficiencia: string;

  // Fatores
  fatorImpedimento: FatorImpedimento;
  justifImpedimento: string;
  fatorUrgencia: FatorUrgencia;
  justifUrgencia: string;

  // Riscos
  riscosContingencia?: string;
}
