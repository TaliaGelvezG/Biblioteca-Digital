import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { Users } from '../../services/users';
import { CommonModule } from '@angular/common';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let userService: jasmine.SpyObj<Users>;
  let router: Router;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('Users', ['loginUser']);

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule, CommonModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: Users, useValue: userServiceSpy },
      ],
    }).compileComponents();

    userService = TestBed.inject(Users) as jasmine.SpyObj<Users>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should have invalid form when empty', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should have invalid form with only email', () => {
      component.loginForm.get('username')?.setValue('test@example.com');
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should have invalid form with only password', () => {
      component.loginForm.get('password')?.setValue('password123');
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should have valid form with valid email and password', () => {
      component.loginForm.get('username')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');
      expect(component.loginForm.valid).toBeTruthy();
    });

    it('should have invalid form with invalid email', () => {
      component.loginForm.get('username')?.setValue('invalid-email');
      component.loginForm.get('password')?.setValue('password123');
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should mark form as touched on submit with invalid data', () => {
      component.onSubmit();
      expect(component.loginForm.touched).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    it('should call loginUser with correct credentials when form is valid', () => {
      userService.loginUser.and.returnValue(of(true));
      const email = 'test@example.com';
      const password = 'password123';

      component.loginForm.get('username')?.setValue(email);
      component.loginForm.get('password')?.setValue(password);
      component.onSubmit();

      expect(userService.loginUser).toHaveBeenCalledWith(email, password);
    });

    it('should navigate to main page on successful login', () => {
      userService.loginUser.and.returnValue(of(true));

      component.loginForm.get('username')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');
      component.onSubmit();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/main');
    });

    it('should reset form after successful login', () => {
      userService.loginUser.and.returnValue(of(true));
      spyOn(component.loginForm, 'reset');

      component.loginForm.get('username')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');
      component.onSubmit();

      expect(component.loginForm.reset).toHaveBeenCalled();
    });

    it('should show error alert on login failure', () => {
      userService.loginUser.and.returnValue(throwError(() => new Error('Login failed')));
      spyOn(window, 'alert');

      component.loginForm.get('username')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('wrongpassword');
      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith('Usuario y/o contaseña inválidos');
    });

    it('should not submit invalid form', () => {
      component.loginForm.get('username')?.setValue('');
      component.loginForm.get('password')?.setValue('');
      component.onSubmit();

      expect(userService.loginUser).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid on submit', () => {
      component.loginForm.get('username')?.setValue('');
      component.loginForm.get('password')?.setValue('');
      component.onSubmit();

      expect(component.loginForm.get('username')?.touched).toBeTruthy();
      expect(component.loginForm.get('password')?.touched).toBeTruthy();
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email format', () => {
      const control = component.loginForm.get('username');
      control?.setValue('user@example.com');
      expect(control?.hasError('email')).toBeFalsy();
    });

    it('should reject invalid email format', () => {
      const control = component.loginForm.get('username');
      control?.setValue('notanemail');
      expect(control?.hasError('email')).toBeTruthy();
    });

    it('should reject empty email', () => {
      const control = component.loginForm.get('username');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
    });
  });

  describe('Password Validation', () => {
    it('should reject empty password', () => {
      const control = component.loginForm.get('password');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should accept any non-empty password', () => {
      const control = component.loginForm.get('password');
      control?.setValue('anypassword123');
      expect(control?.hasError('required')).toBeFalsy();
    });
  });
});

