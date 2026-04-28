import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizacao } from '../organizacoes/organizacao.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import { Processo } from '../processos/processo.entity.js';
import { Avaliacao } from '../avaliacoes/avaliacao.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env['DATABASE_PATH'] || 'data/ipa.sqlite',
      synchronize: true,
      entities: [Organizacao, Usuario, Processo, Avaliacao],
    }),
  ],
})
export class DatabaseModule {}
