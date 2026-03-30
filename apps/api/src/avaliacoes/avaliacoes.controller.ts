import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Perfil } from '@ipa/shared';
import type { CreateAvaliacaoDto, UpdateAvaliacaoDto } from '@ipa/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { TenantGuard } from '../common/tenant.guard.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { AvaliacoesService } from './avaliacoes.service.js';

interface JwtUser {
  sub: number;
  email: string;
  perfil: string;
  organizacaoId: number;
}

@Controller('api/avaliacoes')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(Perfil.ANALISTA)
export class AvaliacoesController {
  constructor(private readonly service: AvaliacoesService) {}

  @Post()
  create(@Body() dto: CreateAvaliacaoDto, @CurrentUser() user: JwtUser) {
    return this.service.create(dto, user.organizacaoId, user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.service.findOne(id, user.organizacaoId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateAvaliacaoDto,
  ) {
    return this.service.update(id, user.organizacaoId, dto);
  }

  @Post(':id/rascunho')
  saveRascunho(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateAvaliacaoDto,
  ) {
    return this.service.saveRascunho(id, user.organizacaoId, dto);
  }
}
