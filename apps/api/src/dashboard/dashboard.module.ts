import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avaliacao } from '../avaliacoes/avaliacao.entity.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Avaliacao])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
