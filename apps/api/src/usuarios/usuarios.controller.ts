import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Perfil } from '@ipa/shared';
import type { CreateUsuarioDto } from '@ipa/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { TenantGuard } from '../common/tenant.guard.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { UsuariosService } from './usuarios.service.js';

interface JwtUser {
  sub: number;
  email: string;
  perfil: string;
  organizacaoId: number;
}

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(Perfil.ADMIN)
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.service.findAll(user.organizacaoId);
  }

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
    @Body() dto: Partial<CreateUsuarioDto>,
  ) {
    return this.service.update(id, user.organizacaoId, dto);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.service.softDelete(id, user.organizacaoId);
  }
}
