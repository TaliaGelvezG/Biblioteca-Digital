import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Users } from '../../services/users';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  userService = inject(Users);

  constructor(private fb: FormBuilder, private router:Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userService
        .loginUser(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value)
        .subscribe(
          (isOk) => this.router.navigateByUrl('/main'),
          (error) => alert('Usuario y/o contaseña inválidos')
        );
      this.loginForm.reset();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
