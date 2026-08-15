import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserLoginService } from '../services/userLoginService';

export const authGuard: CanActivateFn = (route, state) => {
  const userLoginService = inject(UserLoginService);
  const router = inject(Router);
  if (userLoginService.isLogged()) {
    return true;
  }
  return router.parseUrl('/login');
};
