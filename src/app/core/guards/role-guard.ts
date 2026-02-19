import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard = (role: 'ADMIN' | 'MEMBER'): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.getRole() !== role) {
      return router.createUrlTree(['/login']);
    }

    return true;
  };
};


