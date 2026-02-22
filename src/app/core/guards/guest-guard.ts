import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    const role = auth.getRole();

    if (role === 'ADMIN') {
      return router.createUrlTree(['/admin/dashboard']);
    } else {
      return router.createUrlTree(['/member']);
    }
  }

  return true;
};