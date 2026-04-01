import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateAvaliacaoDto, UpdateAvaliacaoDto, IAvaliacao } from '@ipa/shared';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/avaliacoes`;

  criarAvaliacao(dto: CreateAvaliacaoDto): Observable<IAvaliacao> {
    return this.http.post<IAvaliacao>(this.baseUrl, dto);
  }

  atualizarAvaliacao(id: number, dto: UpdateAvaliacaoDto): Observable<IAvaliacao> {
    return this.http.patch<IAvaliacao>(`${this.baseUrl}/${id}`, dto);
  }

  salvarRascunho(id: number, dto: Partial<CreateAvaliacaoDto>): Observable<IAvaliacao> {
    return this.http.post<IAvaliacao>(`${this.baseUrl}/${id}/rascunho`, dto);
  }

  buscarPorId(id: number): Observable<IAvaliacao> {
    return this.http.get<IAvaliacao>(`${this.baseUrl}/${id}`);
  }

  exportarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}
