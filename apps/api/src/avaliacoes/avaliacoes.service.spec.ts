import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AvaliacoesService } from './avaliacoes.service.js';
import { Avaliacao } from './avaliacao.entity.js';
import { Processo } from '../processos/processo.entity.js';

describe('AvaliacoesService', () => {
  let service: AvaliacoesService;

  const mockAvaliacaoRepo = {
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };

  const mockProcessoRepo = {
    findOne: vi.fn(),
    save: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvaliacoesService,
        { provide: getRepositoryToken(Avaliacao), useValue: mockAvaliacaoRepo },
        { provide: getRepositoryToken(Processo), useValue: mockProcessoRepo },
      ],
    }).compile();

    service = module.get<AvaliacoesService>(AvaliacoesService);
    vi.clearAllMocks();
  });

  it('deve salvar rascunho parcial por processo', async () => {
    const processo = {
      idProcesso: 10,
      idOrganizacao: 1,
      coSituacao: 'rascunho',
      deRascunhoAvaliacao: JSON.stringify({
        notaSegurancaAcessos: 3,
      }),
      tsAtualizacao: new Date(),
      avaliacao: undefined,
    } as unknown as Processo;

    mockProcessoRepo.findOne.mockResolvedValue(processo);
    mockProcessoRepo.save.mockImplementation(async (input: Processo) => input);

    const result = await service.saveProcessoRascunho(10, 1, {
      notaEstabilidadeLegado: 4,
    });

    expect(result.processoId).toBe(10);
    expect(result.situacao).toBe('rascunho');
    expect(result.rascunho).toMatchObject({
      notaSegurancaAcessos: 3,
      notaEstabilidadeLegado: 4,
    });
    expect(mockProcessoRepo.save).toHaveBeenCalledTimes(1);
  });

  it('deve falhar ao finalizar rascunho incompleto', async () => {
    const processo = {
      idProcesso: 11,
      idOrganizacao: 1,
      coSituacao: 'rascunho',
      deRascunhoAvaliacao: JSON.stringify({
        notaSegurancaAcessos: 5,
      }),
      tsAtualizacao: new Date(),
      avaliacao: undefined,
    } as unknown as Processo;

    mockProcessoRepo.findOne.mockResolvedValue(processo);

    await expect(
      service.finalizarProcessoRascunho(11, 1, 99, {}),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve retornar NotFound quando processo não existe no rascunho', async () => {
    mockProcessoRepo.findOne.mockResolvedValue(null);

    await expect(service.getProcessoRascunho(999, 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve mapear deJustifReducaoSla, deJustifAbrangencia e deJustifVolumeMensal para o draft', async () => {
    const processo = {
      idProcesso: 5,
      idOrganizacao: 1,
      coSituacao: 'avaliado',
      deRascunhoAvaliacao: null,
      avaliacao: {
        nuNotaSegurancaAcessos: 3, deJustifSegurancaAcessos: 'a',
        nuNotaEstabilidadeLegado: 3, deJustifEstabilidadeLegado: 'b',
        nuNotaEstruturacaoDados: 3, deJustifEstruturacaoDados: 'c',
        nuNotaGestaoRisco: 3, deJustifGestaoRisco: 'd',
        nuNotaReducaoSla: 2, deJustifReducaoSla: 'SLA justif',
        nuNotaAbrangencia: 4, deJustifAbrangencia: 'Abrangencia justif',
        nuNotaExperienciaCidadao: 3, deJustifImpactoCidadao: 'e',
        nuNotaVolumeMensal: 1, deJustifVolumeMensal: 'Volume justif',
        nuNotaFteLiberado: 2, deJustifEficiencia: 'f',
        vrFatorImpedimento: 1, deJustifImpedimento: 'g',
        vrFatorUrgencia: 1, deJustifUrgencia: 'h',
        deRiscosContingencia: null,
      },
    };

    mockProcessoRepo.findOne.mockResolvedValue(processo);

    const draft = await service.getProcessoRascunho(5, 1);

    expect(draft.justifReducaoSla).toBe('SLA justif');
    expect(draft.justifAbrangencia).toBe('Abrangencia justif');
    expect(draft.justifVolumeMensal).toBe('Volume justif');
  });

  it('deve mapear null em deJustifReducaoSla como undefined no draft', async () => {
    const processo = {
      idProcesso: 6,
      idOrganizacao: 1,
      coSituacao: 'avaliado',
      deRascunhoAvaliacao: null,
      avaliacao: {
        nuNotaSegurancaAcessos: 3, deJustifSegurancaAcessos: 'a',
        nuNotaEstabilidadeLegado: 3, deJustifEstabilidadeLegado: 'b',
        nuNotaEstruturacaoDados: 3, deJustifEstruturacaoDados: 'c',
        nuNotaGestaoRisco: 3, deJustifGestaoRisco: 'd',
        nuNotaReducaoSla: 2, deJustifReducaoSla: null,
        nuNotaAbrangencia: 4, deJustifAbrangencia: null,
        nuNotaExperienciaCidadao: 3, deJustifImpactoCidadao: 'e',
        nuNotaVolumeMensal: 1, deJustifVolumeMensal: null,
        nuNotaFteLiberado: 2, deJustifEficiencia: 'f',
        vrFatorImpedimento: 1, deJustifImpedimento: 'g',
        vrFatorUrgencia: 1, deJustifUrgencia: 'h',
        deRiscosContingencia: null,
      },
    };

    mockProcessoRepo.findOne.mockResolvedValue(processo);

    const draft = await service.getProcessoRascunho(6, 1);

    expect(draft.justifReducaoSla).toBeUndefined();
    expect(draft.justifAbrangencia).toBeUndefined();
    expect(draft.justifVolumeMensal).toBeUndefined();
  });
});
