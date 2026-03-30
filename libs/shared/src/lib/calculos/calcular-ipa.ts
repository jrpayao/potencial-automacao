import { StatusIpa } from '../enums/status-ipa.enum.js';

/**
 * Calcula o Índice Técnico (IT).
 * IT = (seguranca × 0.40) + (estabilidade × 0.30) + (estruturacao × 0.30)
 */
export function calcularIT(
  seguranca: number,
  estabilidade: number,
  estruturacao: number,
): number {
  return seguranca * 0.4 + estabilidade * 0.3 + estruturacao * 0.3;
}

/**
 * Calcula o sub-indicador Impacto ao Cidadão.
 * = min((reducaoSla × 0.50) + (abrangencia × 0.35) + (experiencia × 0.25), 5.0)
 */
export function calcularImpactoCidadao(
  reducaoSla: number,
  abrangencia: number,
  experiencia: number,
): number {
  const raw = reducaoSla * 0.5 + abrangencia * 0.35 + experiencia * 0.25;
  return Math.min(raw, 5.0);
}

/**
 * Calcula o sub-indicador Eficiência Operacional.
 * = (volumeMensal × 0.50) + (fteLiberado × 0.50)
 */
export function calcularEficiencia(
  volumeMensal: number,
  fteLiberado: number,
): number {
  return volumeMensal * 0.5 + fteLiberado * 0.5;
}

/**
 * Calcula o Índice de Negócio (IN).
 * IN = (gestaoRisco × 0.50) + (impactoCidadao × 0.30) + (eficiencia × 0.20)
 */
export function calcularIN(
  gestaoRisco: number,
  impactoCidadao: number,
  eficiencia: number,
): number {
  return gestaoRisco * 0.5 + impactoCidadao * 0.3 + eficiencia * 0.2;
}

export interface ResultadoIPA {
  ipaBase: number;
  ipaFinal: number;
  status: StatusIpa;
}

/**
 * Calcula o IPA completo.
 * ipaBase = (0.50 × it) + (0.50 × in_)
 * ipaFinal = ipaBase × fi × fu
 * status = classificarIPA(ipaFinal)
 */
export function calcularIPA(
  it: number,
  in_: number,
  fi: number,
  fu: number,
): ResultadoIPA {
  const ipaBase = 0.5 * it + 0.5 * in_;
  const ipaFinal = ipaBase * fi * fu;
  const status = classificarIPA(ipaFinal);
  return { ipaBase, ipaFinal, status };
}

/**
 * Classifica o IPA final em um status.
 * >= 4.0 → prioridade_alta
 * 2.5 a 3.99 → backlog
 * < 2.5 → descarte
 */
export function classificarIPA(ipaFinal: number): StatusIpa {
  if (ipaFinal >= 4.0) return StatusIpa.PRIORIDADE_ALTA;
  if (ipaFinal >= 2.5) return StatusIpa.BACKLOG;
  return StatusIpa.DESCARTE;
}
