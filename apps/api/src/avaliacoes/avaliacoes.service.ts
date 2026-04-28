import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  calcularIT,
  calcularImpactoCidadao,
  calcularEficiencia,
  calcularIN,
  calcularIPA,
} from '@ipa/shared';
import type {
  CreateAvaliacaoDto,
  DraftAvaliacaoDto,
  UpdateAvaliacaoDto,
} from '@ipa/shared';
import { Avaliacao } from './avaliacao.entity.js';
import { Processo } from '../processos/processo.entity.js';

@Injectable()
export class AvaliacoesService {
  constructor(
    @InjectRepository(Avaliacao)
    private readonly avaliacaoRepo: Repository<Avaliacao>,
    @InjectRepository(Processo)
    private readonly processoRepo: Repository<Processo>,
  ) {}

  async create(
    dto: CreateAvaliacaoDto,
    organizacaoId: number,
    usuarioId: number,
  ): Promise<Avaliacao> {
    // Verificar se o processo existe e pertence à mesma organização
    const processo = await this.processoRepo.findOne({
      where: { idProcesso: dto.processoId, idOrganizacao: organizacaoId },
    });
    if (!processo) {
      throw new NotFoundException(
        `Processo #${dto.processoId} não encontrado`,
      );
    }

    // Verificar se já existe avaliação para este processo
    const existente = await this.avaliacaoRepo.findOne({
      where: { idProcesso: dto.processoId },
    });
    if (existente) {
      throw new ConflictException(
        `Processo #${dto.processoId} já possui avaliação`,
      );
    }

    const calculados = this.computarIPA(dto);

    const avaliacao = this.avaliacaoRepo.create({
      idProcesso: dto.processoId,
      idOrganizacao: organizacaoId,
      idUsuarioAvaliador: usuarioId,

      // Dimensão Técnica
      nuNotaSegurancaAcessos: dto.notaSegurancaAcessos,
      deJustifSegurancaAcessos: dto.justifSegurancaAcessos,
      nuNotaEstabilidadeLegado: dto.notaEstabilidadeLegado,
      deJustifEstabilidadeLegado: dto.justifEstabilidadeLegado,
      nuNotaEstruturacaoDados: dto.notaEstruturacaoDados,
      deJustifEstruturacaoDados: dto.justifEstruturacaoDados,

      // Dimensão Negócio
      nuNotaGestaoRisco: dto.notaGestaoRisco,
      deJustifGestaoRisco: dto.justifGestaoRisco,
      nuNotaReducaoSla: dto.notaReducaoSla,
      nuNotaAbrangencia: dto.notaAbrangencia,
      nuNotaExperienciaCidadao: dto.notaExperienciaCidadao,
      deJustifImpactoCidadao: dto.justifImpactoCidadao,
      nuNotaVolumeMensal: dto.notaVolumeMensal,
      nuNotaFteLiberado: dto.notaFteLiberado,
      deJustifEficiencia: dto.justifEficiencia,

      // Fatores
      vrFatorImpedimento: dto.fatorImpedimento,
      deJustifImpedimento: dto.justifImpedimento,
      vrFatorUrgencia: dto.fatorUrgencia,
      deJustifUrgencia: dto.justifUrgencia,

      // Riscos
      deRiscosContingencia: dto.riscosContingencia ?? null,

      // Calculados
      ...calculados,
    });

    const saved = await this.avaliacaoRepo.save(avaliacao);

    // Atualizar situação do processo para 'avaliado'
    processo.coSituacao = 'avaliado';
    await this.processoRepo.save(processo);

    return saved;
  }

  async findOne(id: number, organizacaoId: number): Promise<Avaliacao> {
    const avaliacao = await this.avaliacaoRepo.findOne({
      where: { idAvaliacao: id, idOrganizacao: organizacaoId },
      relations: ['processo'],
    });
    if (!avaliacao) {
      throw new NotFoundException(`Avaliação #${id} não encontrada`);
    }
    return avaliacao;
  }

  async update(
    id: number,
    organizacaoId: number,
    dto: UpdateAvaliacaoDto,
  ): Promise<Avaliacao> {
    const avaliacao = await this.avaliacaoRepo.findOne({
      where: { idAvaliacao: id, idOrganizacao: organizacaoId },
    });
    if (!avaliacao) {
      throw new NotFoundException(`Avaliação #${id} não encontrada`);
    }

    // Atualizar campos fornecidos
    if (dto.notaSegurancaAcessos !== undefined)
      avaliacao.nuNotaSegurancaAcessos = dto.notaSegurancaAcessos;
    if (dto.justifSegurancaAcessos !== undefined)
      avaliacao.deJustifSegurancaAcessos = dto.justifSegurancaAcessos;
    if (dto.notaEstabilidadeLegado !== undefined)
      avaliacao.nuNotaEstabilidadeLegado = dto.notaEstabilidadeLegado;
    if (dto.justifEstabilidadeLegado !== undefined)
      avaliacao.deJustifEstabilidadeLegado = dto.justifEstabilidadeLegado;
    if (dto.notaEstruturacaoDados !== undefined)
      avaliacao.nuNotaEstruturacaoDados = dto.notaEstruturacaoDados;
    if (dto.justifEstruturacaoDados !== undefined)
      avaliacao.deJustifEstruturacaoDados = dto.justifEstruturacaoDados;

    if (dto.notaGestaoRisco !== undefined)
      avaliacao.nuNotaGestaoRisco = dto.notaGestaoRisco;
    if (dto.justifGestaoRisco !== undefined)
      avaliacao.deJustifGestaoRisco = dto.justifGestaoRisco;
    if (dto.notaReducaoSla !== undefined)
      avaliacao.nuNotaReducaoSla = dto.notaReducaoSla;
    if (dto.notaAbrangencia !== undefined)
      avaliacao.nuNotaAbrangencia = dto.notaAbrangencia;
    if (dto.notaExperienciaCidadao !== undefined)
      avaliacao.nuNotaExperienciaCidadao = dto.notaExperienciaCidadao;
    if (dto.justifImpactoCidadao !== undefined)
      avaliacao.deJustifImpactoCidadao = dto.justifImpactoCidadao;
    if (dto.notaVolumeMensal !== undefined)
      avaliacao.nuNotaVolumeMensal = dto.notaVolumeMensal;
    if (dto.notaFteLiberado !== undefined)
      avaliacao.nuNotaFteLiberado = dto.notaFteLiberado;
    if (dto.justifEficiencia !== undefined)
      avaliacao.deJustifEficiencia = dto.justifEficiencia;

    if (dto.fatorImpedimento !== undefined)
      avaliacao.vrFatorImpedimento = dto.fatorImpedimento;
    if (dto.justifImpedimento !== undefined)
      avaliacao.deJustifImpedimento = dto.justifImpedimento;
    if (dto.fatorUrgencia !== undefined)
      avaliacao.vrFatorUrgencia = dto.fatorUrgencia;
    if (dto.justifUrgencia !== undefined)
      avaliacao.deJustifUrgencia = dto.justifUrgencia;

    if (dto.riscosContingencia !== undefined)
      avaliacao.deRiscosContingencia = dto.riscosContingencia ?? null;

    // Recalcular IPA com os valores atuais
    const calculados = this.computarIPAFromEntity(avaliacao);
    Object.assign(avaliacao, calculados);

    return this.avaliacaoRepo.save(avaliacao);
  }

  async saveRascunho(
    id: number,
    organizacaoId: number,
    dto: UpdateAvaliacaoDto,
  ): Promise<Avaliacao> {
    // Rascunho: salva parcial, notas podem ser 0/null
    return this.update(id, organizacaoId, dto);
  }

  async getProcessoRascunho(
    processoId: number,
    organizacaoId: number,
  ): Promise<DraftAvaliacaoDto> {
    const processo = await this.processoRepo.findOne({
      where: { idProcesso: processoId, idOrganizacao: organizacaoId },
      relations: ['avaliacao'],
    });

    if (!processo) {
      throw new NotFoundException(`Processo #${processoId} não encontrado`);
    }

    if (processo.avaliacao) {
      return this.mapAvaliacaoToDraft(processo.avaliacao);
    }

    return this.parseDraftPayload(processo.deRascunhoAvaliacao);
  }

  async saveProcessoRascunho(
    processoId: number,
    organizacaoId: number,
    dto: DraftAvaliacaoDto,
  ) {
    const processo = await this.processoRepo.findOne({
      where: { idProcesso: processoId, idOrganizacao: organizacaoId },
      relations: ['avaliacao'],
    });

    if (!processo) {
      throw new NotFoundException(`Processo #${processoId} não encontrado`);
    }

    const baseDraft = processo.avaliacao
      ? this.mapAvaliacaoToDraft(processo.avaliacao)
      : this.parseDraftPayload(processo.deRascunhoAvaliacao);

    const mergedDraft: DraftAvaliacaoDto = {
      ...baseDraft,
      ...dto,
    };

    processo.deRascunhoAvaliacao = JSON.stringify(mergedDraft);
    if (processo.coSituacao === 'arquivado') {
      throw new ConflictException(
        `Processo #${processoId} está arquivado e não aceita rascunho`,
      );
    }
    processo.coSituacao = 'rascunho';
    await this.processoRepo.save(processo);

    return {
      processoId: processo.idProcesso,
      situacao: processo.coSituacao,
      rascunho: mergedDraft,
      atualizadoEm: processo.tsAtualizacao,
    };
  }

  async finalizarProcessoRascunho(
    processoId: number,
    organizacaoId: number,
    usuarioId: number,
    dto: DraftAvaliacaoDto,
  ): Promise<Avaliacao> {
    const processo = await this.processoRepo.findOne({
      where: { idProcesso: processoId, idOrganizacao: organizacaoId },
      relations: ['avaliacao'],
    });

    if (!processo) {
      throw new NotFoundException(`Processo #${processoId} não encontrado`);
    }

    if (processo.coSituacao === 'arquivado') {
      throw new ConflictException(
        `Processo #${processoId} está arquivado e não pode ser finalizado`,
      );
    }

    const baseDraft = processo.avaliacao
      ? this.mapAvaliacaoToDraft(processo.avaliacao)
      : this.parseDraftPayload(processo.deRascunhoAvaliacao);

    const mergedDraft: DraftAvaliacaoDto = { ...baseDraft, ...dto };
    const completeDto = this.assertDraftCompleto(processoId, mergedDraft);
    const calculados = this.computarIPA(completeDto);

    let avaliacao: Avaliacao;

    if (processo.avaliacao) {
      avaliacao = processo.avaliacao;
      this.applyDtoToAvaliacao(avaliacao, completeDto);
      Object.assign(avaliacao, calculados);
      avaliacao.idUsuarioAvaliador = usuarioId;
    } else {
      avaliacao = this.avaliacaoRepo.create({
        idProcesso: processo.idProcesso,
        idOrganizacao: processo.idOrganizacao,
        idUsuarioAvaliador: usuarioId,
        ...this.toAvaliacaoFields(completeDto),
        ...calculados,
      });
    }

    const saved = await this.avaliacaoRepo.save(avaliacao);

    processo.coSituacao = 'avaliado';
    processo.deRascunhoAvaliacao = null;
    await this.processoRepo.save(processo);

    return saved;
  }

  private parseDraftPayload(raw: string | null): DraftAvaliacaoDto {
    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as DraftAvaliacaoDto;
    } catch {
      return {};
    }
  }

  private assertDraftCompleto(
    processoId: number,
    draft: DraftAvaliacaoDto,
  ): CreateAvaliacaoDto {
    const requiredFields: Array<keyof DraftAvaliacaoDto> = [
      'notaSegurancaAcessos',
      'justifSegurancaAcessos',
      'notaEstabilidadeLegado',
      'justifEstabilidadeLegado',
      'notaEstruturacaoDados',
      'justifEstruturacaoDados',
      'notaGestaoRisco',
      'justifGestaoRisco',
      'notaReducaoSla',
      'notaAbrangencia',
      'notaExperienciaCidadao',
      'justifImpactoCidadao',
      'notaVolumeMensal',
      'notaFteLiberado',
      'justifEficiencia',
      'fatorImpedimento',
      'justifImpedimento',
      'fatorUrgencia',
      'justifUrgencia',
    ];

    const missing = requiredFields.filter((field) => {
      const value = draft[field];
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      );
    });

    if (missing.length > 0) {
      throw new BadRequestException(
        `Rascunho incompleto para finalização. Campos ausentes: ${missing.join(', ')}`,
      );
    }

    return {
      processoId,
      notaSegurancaAcessos: draft.notaSegurancaAcessos!,
      justifSegurancaAcessos: draft.justifSegurancaAcessos!,
      notaEstabilidadeLegado: draft.notaEstabilidadeLegado!,
      justifEstabilidadeLegado: draft.justifEstabilidadeLegado!,
      notaEstruturacaoDados: draft.notaEstruturacaoDados!,
      justifEstruturacaoDados: draft.justifEstruturacaoDados!,
      notaGestaoRisco: draft.notaGestaoRisco!,
      justifGestaoRisco: draft.justifGestaoRisco!,
      notaReducaoSla: draft.notaReducaoSla!,
      notaAbrangencia: draft.notaAbrangencia!,
      notaExperienciaCidadao: draft.notaExperienciaCidadao!,
      justifImpactoCidadao: draft.justifImpactoCidadao!,
      notaVolumeMensal: draft.notaVolumeMensal!,
      notaFteLiberado: draft.notaFteLiberado!,
      justifEficiencia: draft.justifEficiencia!,
      fatorImpedimento: draft.fatorImpedimento!,
      justifImpedimento: draft.justifImpedimento!,
      fatorUrgencia: draft.fatorUrgencia!,
      justifUrgencia: draft.justifUrgencia!,
      riscosContingencia: draft.riscosContingencia,
    };
  }

  private mapAvaliacaoToDraft(avaliacao: Avaliacao): DraftAvaliacaoDto {
    return {
      notaSegurancaAcessos: avaliacao.nuNotaSegurancaAcessos,
      justifSegurancaAcessos: avaliacao.deJustifSegurancaAcessos,
      notaEstabilidadeLegado: avaliacao.nuNotaEstabilidadeLegado,
      justifEstabilidadeLegado: avaliacao.deJustifEstabilidadeLegado,
      notaEstruturacaoDados: avaliacao.nuNotaEstruturacaoDados,
      justifEstruturacaoDados: avaliacao.deJustifEstruturacaoDados,
      notaGestaoRisco: avaliacao.nuNotaGestaoRisco,
      justifGestaoRisco: avaliacao.deJustifGestaoRisco,
      notaReducaoSla: avaliacao.nuNotaReducaoSla,
      notaAbrangencia: avaliacao.nuNotaAbrangencia,
      notaExperienciaCidadao: avaliacao.nuNotaExperienciaCidadao,
      justifImpactoCidadao: avaliacao.deJustifImpactoCidadao,
      notaVolumeMensal: avaliacao.nuNotaVolumeMensal,
      notaFteLiberado: avaliacao.nuNotaFteLiberado,
      justifEficiencia: avaliacao.deJustifEficiencia,
      fatorImpedimento: avaliacao.vrFatorImpedimento,
      justifImpedimento: avaliacao.deJustifImpedimento,
      fatorUrgencia: avaliacao.vrFatorUrgencia,
      justifUrgencia: avaliacao.deJustifUrgencia,
      riscosContingencia: avaliacao.deRiscosContingencia ?? undefined,
    };
  }

  private toAvaliacaoFields(dto: CreateAvaliacaoDto) {
    return {
      nuNotaSegurancaAcessos: dto.notaSegurancaAcessos,
      deJustifSegurancaAcessos: dto.justifSegurancaAcessos,
      nuNotaEstabilidadeLegado: dto.notaEstabilidadeLegado,
      deJustifEstabilidadeLegado: dto.justifEstabilidadeLegado,
      nuNotaEstruturacaoDados: dto.notaEstruturacaoDados,
      deJustifEstruturacaoDados: dto.justifEstruturacaoDados,
      nuNotaGestaoRisco: dto.notaGestaoRisco,
      deJustifGestaoRisco: dto.justifGestaoRisco,
      nuNotaReducaoSla: dto.notaReducaoSla,
      nuNotaAbrangencia: dto.notaAbrangencia,
      nuNotaExperienciaCidadao: dto.notaExperienciaCidadao,
      deJustifImpactoCidadao: dto.justifImpactoCidadao,
      nuNotaVolumeMensal: dto.notaVolumeMensal,
      nuNotaFteLiberado: dto.notaFteLiberado,
      deJustifEficiencia: dto.justifEficiencia,
      vrFatorImpedimento: dto.fatorImpedimento,
      deJustifImpedimento: dto.justifImpedimento,
      vrFatorUrgencia: dto.fatorUrgencia,
      deJustifUrgencia: dto.justifUrgencia,
      deRiscosContingencia: dto.riscosContingencia ?? null,
    };
  }

  private applyDtoToAvaliacao(avaliacao: Avaliacao, dto: CreateAvaliacaoDto): void {
    Object.assign(avaliacao, this.toAvaliacaoFields(dto));
  }

  private computarIPA(dto: CreateAvaliacaoDto) {
    const it = calcularIT(
      dto.notaSegurancaAcessos,
      dto.notaEstabilidadeLegado,
      dto.notaEstruturacaoDados,
    );

    const impactoCidadao = calcularImpactoCidadao(
      dto.notaReducaoSla,
      dto.notaAbrangencia,
      dto.notaExperienciaCidadao,
    );

    const eficiencia = calcularEficiencia(
      dto.notaVolumeMensal,
      dto.notaFteLiberado,
    );

    const in_ = calcularIN(dto.notaGestaoRisco, impactoCidadao, eficiencia);

    const { ipaBase, ipaFinal, status } = calcularIPA(
      it,
      in_,
      dto.fatorImpedimento,
      dto.fatorUrgencia,
    );

    return {
      vrIndiceTecnico: Number(it.toFixed(2)),
      vrIndiceNegocio: Number(in_.toFixed(2)),
      vrIpaBase: Number(ipaBase.toFixed(2)),
      vrIpaFinal: Number(ipaFinal.toFixed(2)),
      coStatusIpa: status,
    };
  }

  private computarIPAFromEntity(avaliacao: Avaliacao) {
    const it = calcularIT(
      avaliacao.nuNotaSegurancaAcessos,
      avaliacao.nuNotaEstabilidadeLegado,
      avaliacao.nuNotaEstruturacaoDados,
    );

    const impactoCidadao = calcularImpactoCidadao(
      avaliacao.nuNotaReducaoSla,
      avaliacao.nuNotaAbrangencia,
      avaliacao.nuNotaExperienciaCidadao,
    );

    const eficiencia = calcularEficiencia(
      avaliacao.nuNotaVolumeMensal,
      avaliacao.nuNotaFteLiberado,
    );

    const in_ = calcularIN(
      avaliacao.nuNotaGestaoRisco,
      impactoCidadao,
      eficiencia,
    );

    const { ipaBase, ipaFinal, status } = calcularIPA(
      it,
      in_,
      Number(avaliacao.vrFatorImpedimento),
      Number(avaliacao.vrFatorUrgencia),
    );

    return {
      vrIndiceTecnico: Number(it.toFixed(2)),
      vrIndiceNegocio: Number(in_.toFixed(2)),
      vrIpaBase: Number(ipaBase.toFixed(2)),
      vrIpaFinal: Number(ipaFinal.toFixed(2)),
      coStatusIpa: status,
    };
  }
}
