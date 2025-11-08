import { CanActivateFn } from '@angular/router';
import { JwtPayload } from '../interfaces/jwt';
import { inject } from '@angular/core';
import { Users } from '../services/users';

export const maintenanceGuard: CanActivateFn = (route, state) => {
  const userService = inject(Users);
  const token = localStorage.getItem('jwt');
  const user: JwtPayload | null = userService.getUserRole(token!);;

  if(user!.rol==='admin') return true;
  else return false;
};
