import {
  Injectable,
  NotFoundException,
  ConflictException,
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
import type { CreateAvaliacaoDto, UpdateAvaliacaoDto } from '@ipa/shared';
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
