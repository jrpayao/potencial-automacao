import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizacao } from './organizacao.entity.js';
import { OrganizacoesController } from './organizacoes.controller.js';
import { OrganizacoesService } from './organizacoes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Organizacao])],
  controllers: [OrganizacoesController],
  providers: [OrganizacoesService],
  exports: [OrganizacoesService],
})
export class OrganizacoesModule {}
