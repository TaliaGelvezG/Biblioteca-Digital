import { Routes } from '@angular/router';
import { MaintenancesBooks } from './pages/maintenances-books/maintenances-books';
import { MaintenancesUsers } from './pages/maintenances-users/maintenances-users';
import { MaintenancesLoans } from './pages/maintenances-loans/maintenances-loans';

const routes: Routes = [
  {
    path: 'books',
    component: MaintenancesBooks,
  },
  {
    path: 'loans',
    component: MaintenancesLoans,
  },
  {
    path: 'users',
    component: MaintenancesUsers,
  },
  {
    path: '**',
    redirectTo: 'users',
  },
];

export default routes;
