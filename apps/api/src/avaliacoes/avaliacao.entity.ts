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
import { Processo } from '../processos/processo.entity.js';

@Entity({ name: 'IPATB004_AVALIACAO' })
export class Avaliacao {
  @PrimaryGeneratedColumn({ name: 'ID_AVALIACAO' })
  idAvaliacao!: number;

  @Column({ name: 'ID_PROCESSO', nullable: false })
  idProcesso!: number;

  @OneToOne(() => Processo, (processo) => processo.avaliacao)
  @JoinColumn({ name: 'ID_PROCESSO' })
  processo!: Processo;

  @Column({ name: 'ID_ORGANIZACAO', nullable: false })
  idOrganizacao!: number;

  @ManyToOne(() => Organizacao)
  @JoinColumn({ name: 'ID_ORGANIZACAO' })
  organizacao!: Organizacao;

  @Column({ name: 'ID_USUARIO_AVALIADOR', nullable: false })
  idUsuarioAvaliador!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'ID_USUARIO_AVALIADOR' })
  usuarioAvaliador!: Usuario;

  // === Dimensão Técnica ===

  @Column({ name: 'NU_NOTA_SEGURANCA_ACESSOS', type: 'int', nullable: false })
  nuNotaSegurancaAcessos!: number;

  @Column({ name: 'DE_JUSTIF_SEGURANCA_ACESSOS', type: 'text', nullable: false })
  deJustifSegurancaAcessos!: string;

  @Column({ name: 'NU_NOTA_ESTABILIDADE_LEGADO', type: 'int', nullable: false })
  nuNotaEstabilidadeLegado!: number;

  @Column({ name: 'DE_JUSTIF_ESTABILIDADE_LEGADO', type: 'text', nullable: false })
  deJustifEstabilidadeLegado!: string;

  @Column({ name: 'NU_NOTA_ESTRUTURACAO_DADOS', type: 'int', nullable: false })
  nuNotaEstruturacaoDados!: number;

  @Column({ name: 'DE_JUSTIF_ESTRUTURACAO_DADOS', type: 'text', nullable: false })
  deJustifEstruturacaoDados!: string;

  // === Dimensão Negócio ===

  @Column({ name: 'NU_NOTA_GESTAO_RISCO', type: 'int', nullable: false })
  nuNotaGestaoRisco!: number;

  @Column({ name: 'DE_JUSTIF_GESTAO_RISCO', type: 'text', nullable: false })
  deJustifGestaoRisco!: string;

  @Column({ name: 'NU_NOTA_REDUCAO_SLA', type: 'int', nullable: false })
  nuNotaReducaoSla!: number;

  @Column({ name: 'NU_NOTA_ABRANGENCIA', type: 'int', nullable: false })
  nuNotaAbrangencia!: number;

  @Column({ name: 'NU_NOTA_EXPERIENCIA_CIDADAO', type: 'int', nullable: false })
  nuNotaExperienciaCidadao!: number;

  @Column({ name: 'DE_JUSTIF_IMPACTO_CIDADAO', type: 'text', nullable: false })
  deJustifImpactoCidadao!: string;

  @Column({ name: 'NU_NOTA_VOLUME_MENSAL', type: 'int', nullable: false })
  nuNotaVolumeMensal!: number;

  @Column({ name: 'NU_NOTA_FTE_LIBERADO', type: 'int', nullable: false })
  nuNotaFteLiberado!: number;

  @Column({ name: 'DE_JUSTIF_EFICIENCIA', type: 'text', nullable: false })
  deJustifEficiencia!: string;

  // === Fatores ===

  @Column({ name: 'VR_FATOR_IMPEDIMENTO', type: 'decimal', precision: 3, scale: 2, nullable: false })
  vrFatorImpedimento!: number;

  @Column({ name: 'DE_JUSTIF_IMPEDIMENTO', type: 'text', nullable: false })
  deJustifImpedimento!: string;

  @Column({ name: 'VR_FATOR_URGENCIA', type: 'decimal', precision: 3, scale: 2, nullable: false })
  vrFatorUrgencia!: number;

  @Column({ name: 'DE_JUSTIF_URGENCIA', type: 'text', nullable: false })
  deJustifUrgencia!: string;

  // === Riscos ===

  @Column({ name: 'DE_RISCOS_CONTINGENCIA', type: 'text', nullable: true })
  deRiscosContingencia!: string | null;

  // === Calculados ===

  @Column({ name: 'VR_INDICE_TECNICO', type: 'decimal', precision: 4, scale: 2, nullable: false })
  vrIndiceTecnico!: number;

  @Column({ name: 'VR_INDICE_NEGOCIO', type: 'decimal', precision: 4, scale: 2, nullable: false })
  vrIndiceNegocio!: number;

  @Column({ name: 'VR_IPA_BASE', type: 'decimal', precision: 4, scale: 2, nullable: false })
  vrIpaBase!: number;

  @Column({ name: 'VR_IPA_FINAL', type: 'decimal', precision: 4, scale: 2, nullable: false })
  vrIpaFinal!: number;

  @Column({ name: 'CO_STATUS_IPA', type: 'varchar', length: 20, nullable: false })
  coStatusIpa!: string;

  @CreateDateColumn({ name: 'TS_CRIACAO' })
  tsCriacao!: Date;

  @UpdateDateColumn({ name: 'TS_ATUALIZACAO' })
  tsAtualizacao!: Date;
}
