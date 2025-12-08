import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Register } from './register';
import { Users } from '../../services/users';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let userService: jasmine.SpyObj<Users>;
  let router: Router;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('Users', ['registerUser']);

    await TestBed.configureTestingModule({
      imports: [Register, ReactiveFormsModule, CommonModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: Users, useValue: userServiceSpy },
      ],
    }).compileComponents();

    userService = TestBed.inject(Users) as jasmine.SpyObj<Users>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize register form on ngOnInit', () => {
      component.ngOnInit();
      expect(component.registerForm).toBeDefined();
    });

    it('should have all required form fields', () => {
      component.ngOnInit();
      expect(component.registerForm.get('name')).toBeDefined();
      expect(component.registerForm.get('documentNumber')).toBeDefined();
      expect(component.registerForm.get('documentType')).toBeDefined();
      expect(component.registerForm.get('email')).toBeDefined();
      expect(component.registerForm.get('password')).toBeDefined();
      expect(component.registerForm.get('passwordConfirmed')).toBeDefined();
      expect(component.registerForm.get('rol')).toBeDefined();
    });

    it('should set default documentType to CC', () => {
      component.ngOnInit();
      expect(component.registerForm.get('documentType')?.value).toBe('CC');
    });

    it('should set default rol to user', () => {
      component.ngOnInit();
      expect(component.registerForm.get('rol')?.value).toBe('user');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should have invalid form when empty', () => {
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should require name field', () => {
      const control = component.registerForm.get('name');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should require documentNumber field', () => {
      const control = component.registerForm.get('documentNumber');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should require email field', () => {
      const control = component.registerForm.get('email');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should validate email format', () => {
      const control = component.registerForm.get('email');
      control?.setValue('invalid-email');
      expect(control?.hasError('email')).toBeTruthy();

      control?.setValue('valid@example.com');
      expect(control?.hasError('email')).toBeFalsy();
    });

    it('should require password field', () => {
      const control = component.registerForm.get('password');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should require passwordConfirmed field', () => {
      const control = component.registerForm.get('passwordConfirmed');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should have valid form with all required fields filled', () => {
      component.registerForm.patchValue({
        name: 'John Doe',
        documentNumber: '12345678',
        documentType: 'CC',
        email: 'john@example.com',
        password: 'password123',
        passwordConfirmed: 'password123',
        rol: 'user',
      });
      expect(component.registerForm.valid).toBeTruthy();
    });
  });

  describe('Password Confirmation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should allow form submission when passwords match', () => {
      userService.registerUser.and.returnValue(of({} as User));
      spyOn(window, 'alert');

      component.registerForm.patchValue({
        name: 'John Doe',
        documentNumber: '12345678',
        documentType: 'CC',
        email: 'john@example.com',
        password: 'password123',
        passwordConfirmed: 'password123',
        rol: 'user',
      });

      component.onSubmit();

      expect(userService.registerUser).toHaveBeenCalled();
    });

    it('should not allow form submission when passwords do not match', () => {
      spyOn(window, 'alert');

      component.registerForm.patchValue({
        name: 'John Doe',
        documentNumber: '12345678',
        documentType: 'CC',
        email: 'john@example.com',
        password: 'password123',
        passwordConfirmed: 'differentPassword',
        rol: 'user',
      });

      component.onSubmit();

      expect(userService.registerUser).not.toHaveBeenCalled();
      // After a failed submission the form is reset, so fields should be cleared
      expect(component.registerForm.get('name')?.value).toBeFalsy();
    });
  describe('onSubmit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should call registerUser with form values on valid submission', () => {
      const mockUser: User = {
        id: '',
        name: 'Jane Doe',
        documentNumber: '87654321',
        documentType: 'CC',
        email: 'jane@example.com',
        password: 'password456',
        rol: 'user',
      };

      userService.registerUser.and.returnValue(of({ ...mockUser, id: '1' }));

      component.registerForm.patchValue({
        ...mockUser,
        passwordConfirmed: 'password456',
      });

      component.onSubmit();

      expect(userService.registerUser).toHaveBeenCalledWith(jasmine.objectContaining({
        name: 'Jane Doe',
        documentNumber: '87654321',
        email: 'jane@example.com',
      }));
    });

    it('should show success alert on successful registration', () => {
      spyOn(window, 'alert');
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        documentNumber: '99999999',
        documentType: 'CC',
        email: 'test@example.com',
        password: 'password789',
        rol: 'user',
      };

      userService.registerUser.and.returnValue(of(mockUser));

      component.registerForm.patchValue({
        ...mockUser,
        passwordConfirmed: 'password789',
      });

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith(
        `el usuario ${mockUser.name} con correo ${mockUser.email}, ha sido registrado correctamente`
      );
    });

    it('should navigate to login page after successful registration', () => {
      const mockUser: User = {
        id: '1',
        name: 'New User',
        documentNumber: '55555555',
        documentType: 'CC',
        email: 'newuser@example.com',
        password: 'pass123',
        rol: 'user',
      };

      userService.registerUser.and.returnValue(of(mockUser));

      component.registerForm.patchValue({
        ...mockUser,
        passwordConfirmed: 'pass123',
      });

      component.onSubmit();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    });

    it('should show error alert on registration failure', () => {
      spyOn(window, 'alert');
      userService.registerUser.and.returnValue(
        throwError(() => new Error('Registration failed'))
      );

      component.registerForm.patchValue({
        name: 'John Doe',
        documentNumber: '12345678',
        documentType: 'CC',
        email: 'john@example.com',
        password: 'password123',
        passwordConfirmed: 'password123',
        rol: 'user',
      });

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith(
        'Número de documento y/o correo electrónico ya se encuentran registrados, por favor revise los datos ingresados o utilice datos diferentes'
      );
    });

    it('should reset form and mark as touched when validation fails', () => {
      spyOn(component.registerForm, 'reset');
      spyOn(component.registerForm, 'markAllAsTouched');

      component.registerForm.patchValue({
        name: 'John Doe',
        documentNumber: '12345678',
        documentType: 'CC',
        email: 'john@example.com',
        password: 'password123',
        passwordConfirmed: 'differentPassword',
        rol: 'user',
      });

      component.onSubmit();

      expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
      expect(component.registerForm.reset).toHaveBeenCalled();
    });

    it('should not submit invalid form', () => {
      component.registerForm.patchValue({
        name: '',
        documentNumber: '',
        documentType: 'CC',
        email: 'invalid-email',
        password: 'password123',
        passwordConfirmed: 'password123',
        rol: 'user',
      });

      component.onSubmit();

      expect(userService.registerUser).not.toHaveBeenCalled();
    });
  });
});

