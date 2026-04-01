import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Perfil } from '@ipa/shared';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data?.['roles'] as Perfil[] | undefined;
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userPerfil = authService.userPerfil();
  if (userPerfil && requiredRoles.includes(userPerfil)) {
    return true;
  }

  return router.createUrlTree(['/admin/dashboard']);
};
