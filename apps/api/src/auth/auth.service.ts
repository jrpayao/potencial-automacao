import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/usuario.entity.js';
import type { LoginDto } from '@ipa/shared';

interface RefreshTokenEntry {
  userId: number;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private refreshTokens = new Map<string, RefreshTokenEntry>();

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepo.findOne({
      where: { deEmail: dto.email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.coSenhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: usuario.idUsuario,
      email: usuario.deEmail,
      perfil: usuario.coPerfil,
      organizacaoId: usuario.idOrganizacao,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.refreshTokens.set(refreshToken, {
      userId: usuario.idUsuario,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
      usuario: this.sanitizeUsuario(usuario),
    };
  }

  async refresh(refreshToken: string) {
    const entry = this.refreshTokens.get(refreshToken);
    if (!entry || entry.expiresAt < new Date()) {
      this.refreshTokens.delete(refreshToken);
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    let decoded: { sub: number; email: string; perfil: string; organizacaoId: number };
    try {
      decoded = this.jwtService.verify(refreshToken);
    } catch {
      this.refreshTokens.delete(refreshToken);
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    // Invalidate the old refresh token
    this.refreshTokens.delete(refreshToken);

    const payload = {
      sub: decoded.sub,
      email: decoded.email,
      perfil: decoded.perfil,
      organizacaoId: decoded.organizacaoId,
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.refreshTokens.set(newRefreshToken, {
      userId: decoded.sub,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    this.refreshTokens.delete(refreshToken);
  }

  async me(userId: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { idUsuario: userId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return this.sanitizeUsuario(usuario);
  }

  private sanitizeUsuario(usuario: Usuario) {
    return {
      id: usuario.idUsuario,
      nome: usuario.noUsuario,
      email: usuario.deEmail,
      perfil: usuario.coPerfil,
      organizacaoId: usuario.idOrganizacao,
      situacao: usuario.icSituacao,
      criadoEm: usuario.tsCriacao,
    };
  }
}
