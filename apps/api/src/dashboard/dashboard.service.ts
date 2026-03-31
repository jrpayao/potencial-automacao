import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avaliacao } from '../avaliacoes/avaliacao.entity.js';

export interface RankingQuery {
  page: number;
  limit: number;
}

export interface RankingItem {
  idAvaliacao: number;
  idProcesso: number;
  noProcesso: string;
  noArea: string;
  vrIpaFinal: number;
  coStatusIpa: string;
  tsCriacao: Date;
}

export interface RankingResult {
  data: RankingItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ResumoResult {
  total: number;
  prioridadeAlta: number;
  backlog: number;
  descarte: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Avaliacao)
    private readonly avaliacaoRepo: Repository<Avaliacao>,
  ) {}

  async ranking(
    organizacaoId: number,
    query: RankingQuery,
  ): Promise<RankingResult> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [avaliacoes, total] = await this.avaliacaoRepo
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.processo', 'p')
      .where('a.idOrganizacao = :organizacaoId', { organizacaoId })
      .orderBy('a.vrIpaFinal', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const data: RankingItem[] = avaliacoes.map((a) => ({
      idAvaliacao: a.idAvaliacao,
      idProcesso: a.idProcesso,
      noProcesso: a.processo.noProcesso,
      noArea: a.processo.noArea,
      vrIpaFinal: Number(a.vrIpaFinal),
      coStatusIpa: a.coStatusIpa,
      tsCriacao: a.tsCriacao,
    }));

    return { data, total, page, limit };
  }

  async resumo(organizacaoId: number): Promise<ResumoResult> {
    const avaliacoes = await this.avaliacaoRepo.find({
      where: { idOrganizacao: organizacaoId },
      select: ['coStatusIpa'],
    });

    const total = avaliacoes.length;
    let prioridadeAlta = 0;
    let backlog = 0;
    let descarte = 0;

    for (const a of avaliacoes) {
      switch (a.coStatusIpa) {
        case 'prioridade_alta':
          prioridadeAlta++;
          break;
        case 'backlog':
          backlog++;
          break;
        case 'descarte':
          descarte++;
          break;
      }
    }

    return { total, prioridadeAlta, backlog, descarte };
  }
}
