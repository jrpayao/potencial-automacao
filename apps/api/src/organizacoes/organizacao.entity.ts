import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'IPATB001_ORGANIZACAO' })
export class Organizacao {
  @PrimaryGeneratedColumn({ name: 'ID_ORGANIZACAO' })
  idOrganizacao!: number;

  @Column({ name: 'NO_ORGANIZACAO', type: 'varchar', length: 200, nullable: false })
  noOrganizacao!: string;

  @Column({ name: 'CO_SLUG', type: 'varchar', length: 100, unique: true, nullable: false })
  coSlug!: string;

  @Column({ name: 'IC_SITUACAO', type: 'varchar', length: 1, nullable: false, default: 'A' })
  icSituacao!: string;

  @CreateDateColumn({ name: 'TS_CRIACAO' })
  tsCriacao!: Date;
}
