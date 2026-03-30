import { Perfil } from '../enums/perfil.enum.js';

export interface IUsuario {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  organizacaoId: number;
  situacao: string;
  criadoEm: string;
}
