import { SituacaoProcesso } from '../enums/situacao-processo.enum.js';

export interface IProcesso {
  id: number;
  nome: string;
  area: string;
  departamento?: string;
  donoProcesso: string;
  solicitante?: string;
  dataLevantamento: string;
  organizacaoId: number;
  criadoPorId: number;
  situacao: SituacaoProcesso;
  criadoEm: string;
  atualizadoEm: string;
}
