import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgetPassword } from './pages/forget-password/forget-password';
import { Maintenances } from './pages/maintenances/maintenances';
import { maintenanceGuard } from './guards/maintenance-guard';
import { userGuard } from './guards/user-guard';

export const routes: Routes = [
  {
    path: 'main',
    canActivate : [userGuard],
    component: Main,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'maintenances',
    canActivate: [maintenanceGuard],
    component: Maintenances,
    loadChildren: () => import('./maintenances.routes'),
  },
  {
    path: 'forget-password',
    component: ForgetPassword,
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
