import {
  Controller,
  Get,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Perfil } from '@ipa/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { TenantGuard } from '../common/tenant.guard.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { DashboardService } from './dashboard.service.js';

interface JwtUser {
  sub: number;
  email: string;
  perfil: string;
  organizacaoId: number;
}

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(Perfil.VISUALIZADOR)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('ranking')
  ranking(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.service.ranking(user.organizacaoId, { page, limit });
  }

  @Get('resumo')
  resumo(@CurrentUser() user: JwtUser) {
    return this.service.resumo(user.organizacaoId);
  }
}
