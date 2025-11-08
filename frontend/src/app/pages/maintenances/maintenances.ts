import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Users } from '../../services/users';
import { JwtPayload } from '../../interfaces/jwt';

@Component({
  selector: 'app-maintenances',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './maintenances.html',
  styleUrl: './maintenances.scss',
})
export class Maintenances {
  user: JwtPayload | null = null;

  constructor(private userService: Users, private router: Router) {
    const token = localStorage.getItem('jwt');
    this.user = userService.getUserRole(token!);
  }

  logout() {
    this.userService.logout();
  }

  goToMain() {
    this.router.navigateByUrl('/main');
  }
}
