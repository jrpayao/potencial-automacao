import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { Usuario } from '../usuarios/usuario.entity.js';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsuario: Partial<Usuario> = {
    idUsuario: 1,
    noUsuario: 'Admin Teste',
    deEmail: 'admin@ipa.com',
    coSenhaHash: '',
    coPerfil: 'admin',
    idOrganizacao: 1,
    icSituacao: 'A',
    tsCriacao: new Date(),
  };

  const mockUsuarioRepo = {
    findOne: vi.fn(),
  };

  const mockJwtService = {
    sign: vi.fn().mockReturnValue('mock-token'),
    verify: vi.fn(),
  };

  beforeAll(async () => {
    mockUsuario.coSenhaHash = await bcrypt.hash('senha123', 10);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Usuario), useValue: mockUsuarioRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar tokens com credenciais válidas', async () => {
      mockUsuarioRepo.findOne.mockResolvedValue(mockUsuario);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.login({
        email: 'admin@ipa.com',
        senha: 'senha123',
      });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.usuario).toBeDefined();
      expect(result.usuario.email).toBe('admin@ipa.com');
      expect(result.usuario).not.toHaveProperty('coSenhaHash');
    });

    it('deve lançar UnauthorizedException com senha inválida', async () => {
      mockUsuarioRepo.findOne.mockResolvedValue(mockUsuario);

      await expect(
        service.login({ email: 'admin@ipa.com', senha: 'errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException com email inexistente', async () => {
      mockUsuarioRepo.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'naoexiste@ipa.com', senha: 'senha123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('me', () => {
    it('deve retornar usuário sem hash da senha', async () => {
      mockUsuarioRepo.findOne.mockResolvedValue(mockUsuario);

      const result = await service.me(1);

      expect(result.id).toBe(1);
      expect(result.email).toBe('admin@ipa.com');
      expect(result).not.toHaveProperty('coSenhaHash');
    });

    it('deve lançar UnauthorizedException se usuário não encontrado', async () => {
      mockUsuarioRepo.findOne.mockResolvedValue(null);

      await expect(service.me(999)).rejects.toThrow(UnauthorizedException);
    });
  });
});
