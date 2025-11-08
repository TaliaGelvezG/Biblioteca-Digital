import { CanActivateFn } from '@angular/router';
import { Users } from '../services/users';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {
  const userService = inject(Users);
  return userService.userIsAuthenticated();
};
