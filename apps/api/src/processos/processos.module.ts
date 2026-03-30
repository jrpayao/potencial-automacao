import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Processo } from './processo.entity.js';
import { ProcessosController } from './processos.controller.js';
import { ProcessosService } from './processos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Processo])],
  controllers: [ProcessosController],
  providers: [ProcessosService],
  exports: [ProcessosService],
})
export class ProcessosModule {}
