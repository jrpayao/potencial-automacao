import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organizacao } from '../organizacoes/organizacao.entity.js';

@Entity({ name: 'IPATB002_USUARIO' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'ID_USUARIO' })
  idUsuario!: number;

  @Column({ name: 'NO_USUARIO', type: 'varchar', length: 200, nullable: false })
  noUsuario!: string;

  @Column({ name: 'DE_EMAIL', type: 'varchar', length: 200, unique: true, nullable: false })
  deEmail!: string;

  @Column({ name: 'CO_SENHA_HASH', type: 'varchar', length: 255, nullable: false })
  coSenhaHash!: string;

  @Column({ name: 'CO_PERFIL', type: 'varchar', length: 20, nullable: false })
  coPerfil!: string;

  @Column({ name: 'ID_ORGANIZACAO', nullable: false })
  idOrganizacao!: number;

  @ManyToOne(() => Organizacao)
  @JoinColumn({ name: 'ID_ORGANIZACAO' })
  organizacao!: Organizacao;

  @Column({ name: 'IC_SITUACAO', type: 'char', length: 1, nullable: false, default: 'A' })
  icSituacao!: string;

  @CreateDateColumn({ name: 'TS_CRIACAO' })
  tsCriacao!: Date;
}
