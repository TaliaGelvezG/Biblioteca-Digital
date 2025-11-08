import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Users } from '../../services/users';

@Component({
  selector: 'app-maintenances-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenances-users.html',
  styleUrl: './maintenances-users.scss',
})
export class MaintenancesUsers implements OnInit {
  users!: User[];

  selectedUser: User = {} as User;
  selectedIndex: number = -1;

  constructor(private userService: Users){}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(usersUpdated => {
      this.users = usersUpdated});
  }

  openEditModal(user: User, index: number) {
    this.selectedUser = { ...user };
    this.selectedIndex = index;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
  }

  saveUser() {
    if (this.selectedIndex > -1) {
      this.users[this.selectedIndex] = { ...this.selectedUser };
      this.userService.updateUser(this.selectedUser).subscribe();
    }
    const modalEl = document.getElementById('editUserModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  deleteUser(index: number, id: string) {
    this.users.splice(index, 1);
    this.userService.deleteUser(id).subscribe();
  }
}
