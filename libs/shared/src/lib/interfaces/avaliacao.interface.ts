import { FatorImpedimento } from '../enums/fator-impedimento.enum.js';
import { FatorUrgencia } from '../enums/fator-urgencia.enum.js';
import { StatusIpa } from '../enums/status-ipa.enum.js';

export interface IAvaliacao {
  id: number;
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

  // Calculados
  indiceTecnico: number;
  indiceNegocio: number;
  ipaBase: number;
  ipaFinal: number;
  statusIpa: StatusIpa;

  avaliadoPorId: number;
  organizacaoId: number;
  criadoEm: string;
  atualizadoEm: string;

  processo?: {
    noProcesso?: string;
    noArea?: string;
    noDepartamento?: string;
    noDonoProcesso?: string | null;
    noDono?: string | null;
  };
}
