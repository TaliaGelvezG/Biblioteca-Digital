import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { maintenanceGuard } from './maintenance-guard';
import { Users } from '../services/users';

describe('maintenanceGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => maintenanceGuard(...guardParameters));

  let userServiceSpy: jasmine.SpyObj<any>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('Users', ['getUserRole']);
    TestBed.configureTestingModule({
      providers: [{ provide: Users, useValue: userServiceSpy }],
    });
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/maintenances' } as RouterStateSnapshot;
    localStorage.clear();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow navigation when user is admin', () => {
    userServiceSpy.getUserRole.and.returnValue({ userName: 'Admin', email: 'a@b.com', rol: 'admin' });
    const adminToken = 'valid-admin-token';
    localStorage.setItem('jwt', adminToken);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
  });

  it('should deny navigation when user is not admin', () => {
    userServiceSpy.getUserRole.and.returnValue({ userName: 'User', email: 'u@b.com', rol: 'user' });
    const userToken = 'valid-user-token';
    localStorage.setItem('jwt', userToken);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
  });

  it('should deny navigation when no token is present', () => {
    localStorage.clear();

    expect(() => executeGuard(mockRoute, mockState)).toThrow();
  });

  it('should return false for non-admin users', () => {
    userServiceSpy.getUserRole.and.returnValue({ userName: 'John', email: 'john@example.com', rol: 'user' });
    const userToken = 'valid-token';
    localStorage.setItem('jwt', userToken);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
  });

  it('should return true for admin users', () => {
    userServiceSpy.getUserRole.and.returnValue({ userName: 'Admin', email: 'admin@example.com', rol: 'admin' });
    const adminToken = 'valid-admin-token';
    localStorage.setItem('jwt', adminToken);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
  });
});

