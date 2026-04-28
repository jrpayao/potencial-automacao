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
});
