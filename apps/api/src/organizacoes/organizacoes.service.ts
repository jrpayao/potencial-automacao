import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizacao } from './organizacao.entity.js';
import type { CreateOrganizacaoDto } from '@ipa/shared';

@Injectable()
export class OrganizacoesService {
  constructor(
    @InjectRepository(Organizacao)
    private readonly repo: Repository<Organizacao>,
  ) {}

  async findAll(): Promise<Organizacao[]> {
    return this.repo.find({ order: { tsCriacao: 'DESC' } });
  }

  async create(dto: CreateOrganizacaoDto): Promise<Organizacao> {
    const org = this.repo.create({
      noOrganizacao: dto.nome,
      coSlug: dto.slug,
      icSituacao: 'A',
    });
    return this.repo.save(org);
  }

  async update(
    id: number,
    dto: Partial<CreateOrganizacaoDto>,
  ): Promise<Organizacao> {
    const org = await this.repo.findOne({ where: { idOrganizacao: id } });
    if (!org) {
      throw new NotFoundException(`Organização #${id} não encontrada`);
    }
    if (dto.nome !== undefined) org.noOrganizacao = dto.nome;
    if (dto.slug !== undefined) org.coSlug = dto.slug;
    
    // Suporte para ativação/arquivamento
    const extra = dto as any;
    if (extra.situacao !== undefined) org.icSituacao = extra.situacao;

    return this.repo.save(org);
  }

  async softDelete(id: number): Promise<void> {
    const org = await this.repo.findOne({ where: { idOrganizacao: id } });
    if (!org) {
      throw new NotFoundException(`Organização #${id} não encontrada`);
    }
    org.icSituacao = 'I';
    await this.repo.save(org);
  }

}
