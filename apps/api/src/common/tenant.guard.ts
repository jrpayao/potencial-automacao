import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Perfil } from '@ipa/shared';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as
      | { perfil: string; organizacaoId: number }
      | undefined;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // Superadmin bypasses tenant filter
    if (user.perfil === Perfil.SUPERADMIN) {
      return true;
    }

    // Attach organizacaoId to the request for downstream use in query scoping
    request.organizacaoId = user.organizacaoId;

    if (!user.organizacaoId) {
      throw new ForbiddenException(
        'Usuário sem organização vinculada',
      );
    }

    return true;
  }
}
