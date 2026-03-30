import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Perfil } from '@ipa/shared';
import { ROLES_KEY } from './roles.decorator.js';

const ROLE_HIERARCHY: Record<string, number> = {
  [Perfil.SUPERADMIN]: 4,
  [Perfil.ADMIN]: 3,
  [Perfil.ANALISTA]: 2,
  [Perfil.VISUALIZADOR]: 1,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Perfil[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { perfil: string } | undefined;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const userLevel = ROLE_HIERARCHY[user.perfil] ?? 0;
    const minRequired = Math.min(
      ...requiredRoles.map((r) => ROLE_HIERARCHY[r] ?? 0),
    );

    if (userLevel < minRequired) {
      throw new ForbiddenException('Permissão insuficiente');
    }

    return true;
  }
}
