import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  CreateAvaliacaoDto,
  DraftAvaliacaoDto,
  UpdateAvaliacaoDto,
  IAvaliacao,
} from '@ipa/shared';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/avaliacoes`;

  criarAvaliacao(dto: CreateAvaliacaoDto): Observable<IAvaliacao> {
    return this.http
      .post<BackendAvaliacao>(this.baseUrl, dto)
      .pipe(map((a) => this.normalizeAvaliacao(a)));
  }

  atualizarAvaliacao(id: number, dto: UpdateAvaliacaoDto): Observable<IAvaliacao> {
    return this.http
      .patch<BackendAvaliacao>(`${this.baseUrl}/${id}`, dto)
      .pipe(map((a) => this.normalizeAvaliacao(a)));
  }

  salvarRascunho(processoId: number, dto: DraftAvaliacaoDto): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseUrl}/processo/${processoId}/rascunho`, dto);
  }

  buscarRascunho(processoId: number): Observable<DraftAvaliacaoDto> {
    return this.http.get<DraftAvaliacaoDto>(`${this.baseUrl}/processo/${processoId}/rascunho`);
  }

  finalizarPorProcesso(
    processoId: number,
    dto: DraftAvaliacaoDto,
  ): Observable<IAvaliacao> {
    return this.http
      .post<BackendAvaliacao>(`${this.baseUrl}/processo/${processoId}/finalizar`, dto)
      .pipe(map((a) => this.normalizeAvaliacao(a)));
  }

  buscarPorId(id: number): Observable<IAvaliacao> {
    return this.http
      .get<BackendAvaliacao>(`${this.baseUrl}/${id}`)
      .pipe(map((a) => this.normalizeAvaliacao(a)));
  }

  exportarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  private normalizeAvaliacao(a: BackendAvaliacao): IAvaliacao {
    const result: IAvaliacao & { processo?: BackendAvaliacao['processo'] } = {
      id: a.id ?? a.idAvaliacao ?? 0,
      processoId: a.processoId ?? a.idProcesso ?? 0,
      notaSegurancaAcessos:
        a.notaSegurancaAcessos ?? a.nuNotaSegurancaAcessos ?? 0,
      justifSegurancaAcessos:
        a.justifSegurancaAcessos ?? a.deJustifSegurancaAcessos ?? '',
      notaEstabilidadeLegado:
        a.notaEstabilidadeLegado ?? a.nuNotaEstabilidadeLegado ?? 0,
      justifEstabilidadeLegado:
        a.justifEstabilidadeLegado ?? a.deJustifEstabilidadeLegado ?? '',
      notaEstruturacaoDados:
        a.notaEstruturacaoDados ?? a.nuNotaEstruturacaoDados ?? 0,
      justifEstruturacaoDados:
        a.justifEstruturacaoDados ?? a.deJustifEstruturacaoDados ?? '',
      notaGestaoRisco: a.notaGestaoRisco ?? a.nuNotaGestaoRisco ?? 0,
      justifGestaoRisco: a.justifGestaoRisco ?? a.deJustifGestaoRisco ?? '',
      notaReducaoSla: a.notaReducaoSla ?? a.nuNotaReducaoSla ?? 0,
      notaAbrangencia: a.notaAbrangencia ?? a.nuNotaAbrangencia ?? 0,
      notaExperienciaCidadao:
        a.notaExperienciaCidadao ?? a.nuNotaExperienciaCidadao ?? 0,
      justifImpactoCidadao:
        a.justifImpactoCidadao ?? a.deJustifImpactoCidadao ?? '',
      notaVolumeMensal: a.notaVolumeMensal ?? a.nuNotaVolumeMensal ?? 0,
      notaFteLiberado: a.notaFteLiberado ?? a.nuNotaFteLiberado ?? 0,
      justifEficiencia: a.justifEficiencia ?? a.deJustifEficiencia ?? '',
      fatorImpedimento:
        (a.fatorImpedimento ?? a.vrFatorImpedimento ?? 1) as IAvaliacao['fatorImpedimento'],
      justifImpedimento: a.justifImpedimento ?? a.deJustifImpedimento ?? '',
      fatorUrgencia:
        (a.fatorUrgencia ?? a.vrFatorUrgencia ?? 1) as IAvaliacao['fatorUrgencia'],
      justifUrgencia: a.justifUrgencia ?? a.deJustifUrgencia ?? '',
      riscosContingencia: a.riscosContingencia ?? a.deRiscosContingencia ?? undefined,
      indiceTecnico: Number(a.indiceTecnico ?? a.vrIndiceTecnico ?? 0),
      indiceNegocio: Number(a.indiceNegocio ?? a.vrIndiceNegocio ?? 0),
      ipaBase: Number(a.ipaBase ?? a.vrIpaBase ?? 0),
      ipaFinal: Number(a.ipaFinal ?? a.vrIpaFinal ?? 0),
      statusIpa: (a.statusIpa ?? a.coStatusIpa ?? 'backlog') as IAvaliacao['statusIpa'],
      avaliadoPorId: a.avaliadoPorId ?? a.idUsuarioAvaliador ?? 0,
      organizacaoId: a.organizacaoId ?? a.idOrganizacao ?? 0,
      criadoEm: a.criadoEm ?? a.tsCriacao ?? new Date().toISOString(),
      atualizadoEm: a.atualizadoEm ?? a.tsAtualizacao ?? new Date().toISOString(),
    };

    if (a.processo) {
      result.processo = a.processo;
    }

    return result;
  }
}

interface BackendAvaliacao {
  id?: number;
  idAvaliacao?: number;
  processoId?: number;
  idProcesso?: number;
  notaSegurancaAcessos?: number;
  nuNotaSegurancaAcessos?: number;
  justifSegurancaAcessos?: string;
  deJustifSegurancaAcessos?: string;
  notaEstabilidadeLegado?: number;
  nuNotaEstabilidadeLegado?: number;
  justifEstabilidadeLegado?: string;
  deJustifEstabilidadeLegado?: string;
  notaEstruturacaoDados?: number;
  nuNotaEstruturacaoDados?: number;
  justifEstruturacaoDados?: string;
  deJustifEstruturacaoDados?: string;
  notaGestaoRisco?: number;
  nuNotaGestaoRisco?: number;
  justifGestaoRisco?: string;
  deJustifGestaoRisco?: string;
  notaReducaoSla?: number;
  nuNotaReducaoSla?: number;
  notaAbrangencia?: number;
  nuNotaAbrangencia?: number;
  notaExperienciaCidadao?: number;
  nuNotaExperienciaCidadao?: number;
  justifImpactoCidadao?: string;
  deJustifImpactoCidadao?: string;
  notaVolumeMensal?: number;
  nuNotaVolumeMensal?: number;
  notaFteLiberado?: number;
  nuNotaFteLiberado?: number;
  justifEficiencia?: string;
  deJustifEficiencia?: string;
  fatorImpedimento?: number;
  vrFatorImpedimento?: number;
  justifImpedimento?: string;
  deJustifImpedimento?: string;
  fatorUrgencia?: number;
  vrFatorUrgencia?: number;
  justifUrgencia?: string;
  deJustifUrgencia?: string;
  riscosContingencia?: string;
  deRiscosContingencia?: string;
  indiceTecnico?: number;
  vrIndiceTecnico?: number;
  indiceNegocio?: number;
  vrIndiceNegocio?: number;
  ipaBase?: number;
  vrIpaBase?: number;
  ipaFinal?: number;
  vrIpaFinal?: number;
  statusIpa?: string;
  coStatusIpa?: string;
  avaliadoPorId?: number;
  idUsuarioAvaliador?: number;
  organizacaoId?: number;
  idOrganizacao?: number;
  criadoEm?: string;
  tsCriacao?: string;
  atualizadoEm?: string;
  tsAtualizacao?: string;
  processo?: {
    idProcesso?: number;
    noProcesso?: string;
    noArea?: string;
    noDepartamento?: string;
    noDonoProcesso?: string;
  };
}
