import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IUsuario, CreateUsuarioDto, SituacaoUsuario } from '@ipa/shared';
import { environment } from '../../../environments/environment';

export interface UpdateUsuarioDto {
  nome?: string;
  email?: string;
  senha?: string;
  perfil?: string;
  organizacaoId?: number;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  listar(): Observable<IUsuario[]> {
    return this.http
      .get<BackendUsuario[]>(this.baseUrl)
      .pipe(map((lista) => lista.map((u) => this.normalizeUsuario(u))));
  }

  criar(dto: CreateUsuarioDto): Observable<IUsuario> {
    return this.http
      .post<BackendUsuario>(this.baseUrl, dto)
      .pipe(map((u) => this.normalizeUsuario(u)));
  }

  atualizar(id: number, dto: UpdateUsuarioDto): Observable<IUsuario> {
    return this.http
      .patch<BackendUsuario>(`${this.baseUrl}/${id}`, dto)
      .pipe(map((u) => this.normalizeUsuario(u)));
  }

  alterarSituacao(id: number, situacao: SituacaoUsuario): Observable<IUsuario> {
    return this.http
      .patch<BackendUsuario>(`${this.baseUrl}/${id}/situacao`, { situacao })
      .pipe(map((u) => this.normalizeUsuario(u)));
  }

  private normalizeUsuario(u: BackendUsuario): IUsuario {
    return {
      id: u.id ?? u.idUsuario ?? 0,
      nome: u.nome ?? u.noUsuario ?? '',
      email: u.email ?? u.deEmail ?? '',
      perfil: (u.perfil ?? u.coPerfil) as IUsuario['perfil'],
      organizacaoId: u.organizacaoId ?? u.idOrganizacao ?? 0,
      situacao: (u.situacao ?? u.icSituacao ?? SituacaoUsuario.ATIVO) as SituacaoUsuario,
      criadoEm: u.criadoEm ?? u.tsCriacao ?? new Date().toISOString(),
    };
  }
}

interface BackendUsuario {
  id?: number;
  idUsuario?: number;
  nome?: string;
  noUsuario?: string;
  email?: string;
  deEmail?: string;
  perfil?: string;
  coPerfil?: string;
  organizacaoId?: number;
  idOrganizacao?: number;
  situacao?: string;
  icSituacao?: string;
  criadoEm?: string;
  tsCriacao?: string;
}
