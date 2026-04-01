import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUsuario, CreateUsuarioDto } from '@ipa/shared';
import { environment } from '../../../environments/environment';

export interface UpdateUsuarioDto {
  nome?: string;
  email?: string;
  perfil?: string;
  organizacaoId?: number;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  listar(): Observable<IUsuario[]> {
    return this.http.get<IUsuario[]>(this.baseUrl);
  }

  criar(dto: CreateUsuarioDto): Observable<IUsuario> {
    return this.http.post<IUsuario>(this.baseUrl, dto);
  }

  atualizar(id: number, dto: UpdateUsuarioDto): Observable<IUsuario> {
    return this.http.patch<IUsuario>(`${this.baseUrl}/${id}`, dto);
  }

  desativar(id: number): Observable<IUsuario> {
    return this.http.patch<IUsuario>(`${this.baseUrl}/${id}/desativar`, {});
  }
}
