import { Perfil } from '../enums/perfil.enum.js';
import { SituacaoUsuario } from '../enums/situacao-usuario.enum.js';

export interface IUsuario {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  organizacaoId: number;
  situacao: SituacaoUsuario;
  criadoEm: string;
}
