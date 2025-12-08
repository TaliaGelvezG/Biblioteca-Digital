import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Users } from '../../services/users';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: Users, private router:Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      documentNumber: ['', Validators.required],
      documentType: ['CC', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmed: ['', Validators.required],
      rol: ['user', Validators.required],
    });
  }

  onSubmit() {
    if (
      this.registerForm.valid &&
      this.registerForm.get('password')!.value === this.registerForm.get('passwordConfirmed')!.value
    ) {
      this.userService.registerUser(this.registerForm.value).subscribe((user) => {
        alert(`el usuario ${user.name} con correo ${user.email}, ha sido registrado correctamente`);
        this.router.navigateByUrl('/login');
      }, error => alert("Número de documento y/o correo electrónico ya se encuentran registrados, por favor revise los datos ingresados o utilice datos diferentes"));
    } else {
      this.registerForm.markAllAsTouched();
      this.registerForm.reset();
    }
  }
}
