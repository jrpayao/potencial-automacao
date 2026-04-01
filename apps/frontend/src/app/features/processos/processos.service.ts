import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProcessoItem {
  id: number;
  noProcesso: string;
  noArea: string;
  noDono: string;
  coStatus: string;
  vrIpaFinal: number | null;
  dtLevantamento: string;
  idAvaliacao?: number;
}

export interface ProcessoListResult {
  data: ProcessoItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ProcessoFiltros {
  area?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class ProcessosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  listar(filtros?: ProcessoFiltros): Observable<ProcessoListResult> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.area) params = params.set('area', filtros.area);
      if (filtros.status) params = params.set('status', filtros.status);
      if (filtros.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params = params.set('dataFim', filtros.dataFim);
      if (filtros.page) params = params.set('page', filtros.page.toString());
      if (filtros.limit) params = params.set('limit', filtros.limit.toString());
    }
    return this.http.get<ProcessoListResult>(`${this.apiUrl}/processos`, { params });
  }

  buscarPorId(id: number): Observable<ProcessoItem> {
    return this.http.get<ProcessoItem>(`${this.apiUrl}/processos/${id}`);
  }

  criar(dto: any): Observable<ProcessoItem> {
    return this.http.post<ProcessoItem>(`${this.apiUrl}/processos`, dto);
  }

  atualizar(id: number, dto: any): Observable<ProcessoItem> {
    return this.http.patch<ProcessoItem>(`${this.apiUrl}/processos/${id}`, dto);
  }

  arquivar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/processos/${id}`);
  }
}
