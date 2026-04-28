import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizacao } from '../organizacoes/organizacao.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import { Processo } from '../processos/processo.entity.js';
import { Avaliacao } from '../avaliacoes/avaliacao.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'] || 'localhost',
      port: parseInt(process.env['DB_PORT'] || '5432'),
      username: process.env['DB_USER'] || 'postgres',
      password: process.env['DB_PASS'] || 'postgres',
      database: process.env['DB_NAME'] || 'ipa',
      synchronize: true,
      entities: [Organizacao, Usuario, Processo, Avaliacao],
    }),
  ],
})
export class DatabaseModule {}
