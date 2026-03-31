import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avaliacao } from './avaliacao.entity.js';
import { Processo } from '../processos/processo.entity.js';
import { AvaliacoesController } from './avaliacoes.controller.js';
import { AvaliacoesService } from './avaliacoes.service.js';
import { PdfService } from './pdf.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Avaliacao, Processo])],
  controllers: [AvaliacoesController],
  providers: [AvaliacoesService, PdfService],
  exports: [AvaliacoesService],
})
export class AvaliacoesModule {}
