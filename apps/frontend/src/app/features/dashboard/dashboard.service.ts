import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ResumoResult {
  total: number;
  prioridadeAlta: number;
  backlog: number;
  descarte: number;
}

export interface RankingItem {
  idAvaliacao: number;
  idProcesso: number;
  noProcesso: string;
  noArea: string;
  vrIpaFinal: number;
  coStatusIpa: string;
  tsCriacao: string;
}

export interface RankingResult {
  data: RankingItem[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getRanking(page = 1, limit = 20): Observable<RankingResult> {
    return this.http.get<RankingResult>(
      `${this.apiUrl}/dashboard/ranking`,
      { params: { page: page.toString(), limit: limit.toString() } },
    );
  }

  getResumo(): Observable<ResumoResult> {
    return this.http.get<ResumoResult>(`${this.apiUrl}/dashboard/resumo`);
  }
}
