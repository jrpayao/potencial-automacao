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
import type { CreateOrganizacaoDto } from '@ipa/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { OrganizacoesService } from './organizacoes.service.js';

@Controller('api/organizacoes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Perfil.SUPERADMIN)
export class OrganizacoesController {
  constructor(private readonly service: OrganizacoesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateOrganizacaoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateOrganizacaoDto>,
  ) {
    return this.service.update(id, dto);
  }
}
