import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrganizacao, CreateOrganizacaoDto } from '@ipa/shared';
import { environment } from '../../../environments/environment';

export interface UpdateOrganizacaoDto {
  nome?: string;
  slug?: string;
  situacao?: string;
}

@Injectable({ providedIn: 'root' })
export class OrganizacoesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/organizacoes`;

  listar(): Observable<IOrganizacao[]> {
    return this.http.get<IOrganizacao[]>(this.baseUrl);
  }

  criar(dto: CreateOrganizacaoDto): Observable<IOrganizacao> {
    return this.http.post<IOrganizacao>(this.baseUrl, dto);
  }

  atualizar(id: number, dto: UpdateOrganizacaoDto): Observable<IOrganizacao> {
    return this.http.patch<IOrganizacao>(`${this.baseUrl}/${id}`, dto);
  }
}
