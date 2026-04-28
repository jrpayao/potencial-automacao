import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity.js';
import { SituacaoUsuario } from '@ipa/shared';
import type { CreateUsuarioDto } from '@ipa/shared';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async findAll(organizacaoId: number) {
    const usuarios = await this.repo.find({
      where: { idOrganizacao: organizacaoId },
      order: { tsCriacao: 'DESC' },
    });
    return usuarios.map((u) => this.sanitize(u));
  }

  async create(dto: CreateUsuarioDto) {
    const existente = await this.repo.findOne({
      where: { deEmail: dto.email },
    });
    if (existente) {
      throw new ConflictException('Email já cadastrado');
    }

    const hash = await bcrypt.hash(dto.senha, 10);
    const usuario = this.repo.create({
      noUsuario: dto.nome,
      deEmail: dto.email,
      coSenhaHash: hash,
      coPerfil: dto.perfil,
      idOrganizacao: dto.organizacaoId,
    });
    const saved = await this.repo.save(usuario);
    return this.sanitize(saved);
  }

  async update(
    id: number,
    organizacaoId: number,
    dto: Partial<CreateUsuarioDto>,
  ) {
    const usuario = await this.findUsuarioOrFail(id, organizacaoId);

    if (dto.nome !== undefined) usuario.noUsuario = dto.nome;
    if (dto.email !== undefined) usuario.deEmail = dto.email;
    if (dto.perfil !== undefined) usuario.coPerfil = dto.perfil;
    if (dto.senha !== undefined) {
      usuario.coSenhaHash = await bcrypt.hash(dto.senha, 10);
    }

    const saved = await this.repo.save(usuario);
    return this.sanitize(saved);
  }

  async alterarSituacao(
    id: number,
    organizacaoId: number,
    situacao: string,
  ) {
    const validada = this.validarSituacao(situacao);
    const usuario = await this.findUsuarioOrFail(id, organizacaoId);
    usuario.icSituacao = validada;
    const saved = await this.repo.save(usuario);
    return this.sanitize(saved);
  }

  async softDelete(id: number, organizacaoId: number): Promise<void> {
    const usuario = await this.findUsuarioOrFail(id, organizacaoId);
    usuario.icSituacao = SituacaoUsuario.INATIVO;
    await this.repo.save(usuario);
  }

  private async findUsuarioOrFail(
    id: number,
    organizacaoId: number,
  ): Promise<Usuario> {
    const usuario = await this.repo.findOne({
      where: { idUsuario: id, idOrganizacao: organizacaoId },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuário #${id} não encontrado`);
    }
    return usuario;
  }

  private validarSituacao(situacao: string): SituacaoUsuario {
    const valores = Object.values(SituacaoUsuario) as string[];
    if (!valores.includes(situacao)) {
      throw new BadRequestException(
        `Situação inválida "${situacao}". Valores aceitos: ${valores.join(', ')}`,
      );
    }
    return situacao as SituacaoUsuario;
  }

  private sanitize(usuario: Usuario) {
    return {
      idUsuario: usuario.idUsuario,
      noUsuario: usuario.noUsuario,
      deEmail: usuario.deEmail,
      coPerfil: usuario.coPerfil,
      idOrganizacao: usuario.idOrganizacao,
      icSituacao: usuario.icSituacao,
      tsCriacao: usuario.tsCriacao,
    };
  }
}
