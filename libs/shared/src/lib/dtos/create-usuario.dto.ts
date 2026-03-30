import { Perfil } from '../enums/perfil.enum.js';

export interface CreateUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
  organizacaoId: number;
}
