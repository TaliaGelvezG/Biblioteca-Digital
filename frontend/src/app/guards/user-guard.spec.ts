import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { userGuard } from './user-guard';
import { Users } from '../services/users';
import { signal } from '@angular/core';

describe('userGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => userGuard(...guardParameters));

  let userService: Users;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Users],
    });
    userService = TestBed.inject(Users);
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/test' } as RouterStateSnapshot;
    localStorage.clear();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow navigation when user is authenticated', () => {
    // Set user as authenticated
    userService.userIsAuthenticated.set(true);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
  });

  it('should deny navigation when user is not authenticated', () => {
    // User is not authenticated (default state)
    userService.userIsAuthenticated.set(false);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
  });

  it('should check the current authentication state', () => {
    // First authenticated
    userService.userIsAuthenticated.set(true);
    expect(executeGuard(mockRoute, mockState)).toBe(true);

    // Then not authenticated
    userService.userIsAuthenticated.set(false);
    expect(executeGuard(mockRoute, mockState)).toBe(false);
  });
});

