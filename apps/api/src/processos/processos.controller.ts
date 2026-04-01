import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Perfil } from '@ipa/shared';
import type { CreateProcessoDto } from '@ipa/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { TenantGuard } from '../common/tenant.guard.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { ProcessosService } from './processos.service.js';

interface JwtUser {
  sub: number;
  email: string;
  perfil: string;
  organizacaoId: number;
}

@Controller('processos')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(Perfil.ANALISTA)
export class ProcessosController {
  constructor(private readonly service: ProcessosService) {}

  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Query('area') area?: string,
    @Query('status') status?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.service.findAll(user.organizacaoId, {
      area,
      status,
      dataInicio,
      dataFim,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.service.findOne(id, user.organizacaoId);
  }

  @Post()
  create(@Body() dto: CreateProcessoDto, @CurrentUser() user: JwtUser) {
    return this.service.create(dto, user.organizacaoId, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
    @Body() dto: Partial<CreateProcessoDto>,
  ) {
    return this.service.update(id, user.organizacaoId, dto);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.service.archive(id, user.organizacaoId);
  }
}
