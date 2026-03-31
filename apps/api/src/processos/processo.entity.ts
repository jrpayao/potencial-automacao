import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organizacao } from '../organizacoes/organizacao.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import type { Avaliacao } from '../avaliacoes/avaliacao.entity.js';

@Entity({ name: 'IPATB003_PROCESSO' })
export class Processo {
  @PrimaryGeneratedColumn({ name: 'ID_PROCESSO' })
  idProcesso!: number;

  @Column({ name: 'NO_PROCESSO', type: 'varchar', length: 500, nullable: false })
  noProcesso!: string;

  @Column({ name: 'NO_AREA', type: 'varchar', length: 200, nullable: false })
  noArea!: string;

  @Column({ name: 'NO_DEPARTAMENTO', type: 'varchar', length: 200, nullable: true })
  noDepartamento!: string | null;

  @Column({ name: 'NO_DONO_PROCESSO', type: 'varchar', length: 200, nullable: false })
  noDonoProcesso!: string;

  @Column({ name: 'NO_SOLICITANTE', type: 'varchar', length: 200, nullable: true })
  noSolicitante!: string | null;

  @Column({ name: 'DT_LEVANTAMENTO', type: 'date', nullable: false })
  dtLevantamento!: string;

  @Column({ name: 'ID_ORGANIZACAO', type: 'int', nullable: false })
  idOrganizacao!: number;

  @ManyToOne(() => Organizacao)
  @JoinColumn({ name: 'ID_ORGANIZACAO' })
  organizacao!: Organizacao;

  @Column({ name: 'ID_USUARIO_CRIACAO', type: 'int', nullable: false })
  idUsuarioCriacao!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'ID_USUARIO_CRIACAO' })
  usuarioCriacao!: Usuario;

  @Column({ name: 'CO_SITUACAO', type: 'varchar', length: 20, nullable: false, default: 'rascunho' })
  coSituacao!: string;

  @OneToOne('Avaliacao', 'processo')
  avaliacao?: Avaliacao;

  @CreateDateColumn({ name: 'TS_CRIACAO' })
  tsCriacao!: Date;

  @UpdateDateColumn({ name: 'TS_ATUALIZACAO' })
  tsAtualizacao!: Date;
}
