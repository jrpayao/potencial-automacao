import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Processo } from './processo.entity.js';
import type { CreateProcessoDto } from '@ipa/shared';

interface ProcessoFilters {
  area?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
}

@Injectable()
export class ProcessosService {
  constructor(
    @InjectRepository(Processo)
    private readonly repo: Repository<Processo>,
  ) {}

  async findAll(
    organizacaoId: number,
    filters: ProcessoFilters = {},
  ): Promise<Processo[]> {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.avaliacao', 'a')
      .where('p.idOrganizacao = :orgId', { orgId: organizacaoId });

    if (filters.area) {
      qb.andWhere('p.noArea = :area', { area: filters.area });
    }
    if (filters.status) {
      qb.andWhere('p.coSituacao = :status', { status: filters.status });
    }
    if (filters.dataInicio) {
      qb.andWhere('p.dtLevantamento >= :inicio', {
        inicio: filters.dataInicio,
      });
    }
    if (filters.dataFim) {
      qb.andWhere('p.dtLevantamento <= :fim', { fim: filters.dataFim });
    }

    qb.orderBy('p.tsCriacao', 'DESC');
    return qb.getMany();
  }

  async findOne(id: number, organizacaoId: number): Promise<Processo> {
    const processo = await this.repo.findOne({
      where: { idProcesso: id, idOrganizacao: organizacaoId },
      relations: ['avaliacao'],
    });
    if (!processo) {
      throw new NotFoundException(`Processo #${id} não encontrado`);
    }
    return processo;
  }

  async create(
    dto: CreateProcessoDto,
    organizacaoId: number,
    usuarioId: number,
  ): Promise<Processo> {
    const processo = this.repo.create({
      noProcesso: dto.nome,
      noArea: dto.area,
      noDepartamento: dto.departamento ?? null,
      noDonoProcesso: dto.donoProcesso,
      noSolicitante: dto.solicitante ?? null,
      dtLevantamento: dto.dataLevantamento,
      idOrganizacao: organizacaoId,
      idUsuarioCriacao: usuarioId,
      coSituacao: 'rascunho',
    });
    return this.repo.save(processo);
  }

  async update(
    id: number,
    organizacaoId: number,
    dto: Partial<CreateProcessoDto>,
  ): Promise<Processo> {
    const processo = await this.repo.findOne({
      where: { idProcesso: id, idOrganizacao: organizacaoId },
    });
    if (!processo) {
      throw new NotFoundException(`Processo #${id} não encontrado`);
    }

    if (dto.nome !== undefined) processo.noProcesso = dto.nome;
    if (dto.area !== undefined) processo.noArea = dto.area;
    if (dto.departamento !== undefined)
      processo.noDepartamento = dto.departamento ?? null;
    if (dto.donoProcesso !== undefined)
      processo.noDonoProcesso = dto.donoProcesso;
    if (dto.solicitante !== undefined)
      processo.noSolicitante = dto.solicitante ?? null;
    if (dto.dataLevantamento !== undefined)
      processo.dtLevantamento = dto.dataLevantamento;

    return this.repo.save(processo);
  }

  async archive(id: number, organizacaoId: number): Promise<void> {
    const processo = await this.repo.findOne({
      where: { idProcesso: id, idOrganizacao: organizacaoId },
    });
    if (!processo) {
      throw new NotFoundException(`Processo #${id} não encontrado`);
    }
    processo.coSituacao = 'arquivado';
    await this.repo.save(processo);
  }
}
