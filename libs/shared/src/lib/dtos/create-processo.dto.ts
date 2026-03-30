export interface CreateProcessoDto {
  nome: string;
  area: string;
  departamento?: string;
  donoProcesso: string;
  solicitante?: string;
  dataLevantamento: string;
}
