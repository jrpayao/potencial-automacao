import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
    return this.http
      .get<BackendOrganizacao[]>(this.baseUrl)
      .pipe(map((lista) => lista.map((o) => this.normalizeOrganizacao(o))));
  }

  criar(dto: CreateOrganizacaoDto): Observable<IOrganizacao> {
    return this.http
      .post<BackendOrganizacao>(this.baseUrl, dto)
      .pipe(map((o) => this.normalizeOrganizacao(o)));
  }

  atualizar(id: number, dto: UpdateOrganizacaoDto): Observable<IOrganizacao> {
    return this.http
      .patch<BackendOrganizacao>(`${this.baseUrl}/${id}`, dto)
      .pipe(map((o) => this.normalizeOrganizacao(o)));
  }

  arquivar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  ativar(id: number): Observable<IOrganizacao> {
    return this.http
      .patch<BackendOrganizacao>(`${this.baseUrl}/${id}`, { situacao: 'A' })
      .pipe(map((o) => this.normalizeOrganizacao(o)));
  }


  private normalizeOrganizacao(o: BackendOrganizacao): IOrganizacao {
    return {
      id: o.id ?? o.idOrganizacao ?? 0,
      nome: o.nome ?? o.noOrganizacao ?? '',
      slug: o.slug ?? o.coSlug ?? '',
      situacao: o.situacao ?? o.icSituacao ?? 'A',
      criadoEm: o.criadoEm ?? o.tsCriacao ?? new Date().toISOString(),
    };
  }
}

interface BackendOrganizacao {
  id?: number;
  idOrganizacao?: number;
  nome?: string;
  noOrganizacao?: string;
  slug?: string;
  coSlug?: string;
  situacao?: string;
  icSituacao?: string;
  criadoEm?: string;
  tsCriacao?: string;
}
