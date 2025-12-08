import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Users } from './users';
import { User } from '../interfaces/user';
import { JwtPayload } from '../interfaces/jwt';

describe('Users', () => {
  let service: Users;
  let httpMock: HttpTestingController;
  const basePath = 'http://localhost:3000/api/v1/biblioteca-digital/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Users],
    });
    service = TestBed.inject(Users);
    httpMock = TestBed.inject(HttpTestingController);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should fetch all users', () => {
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'User 1',
          documentNumber: '123456',
          documentType: 'CC',
          email: 'user1@example.com',
          password: 'password123',
          rol: 'user',
        },
      ];

      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(1);
      });

      const req = httpMock.expectOne(basePath);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush(mockUsers);
    });
  });

  describe('registerUser', () => {
    it('should register a new user', () => {
      const mockUser: User = {
        id: '1',
        name: 'New User',
        documentNumber: '789012',
        documentType: 'CC',
        email: 'newuser@example.com',
        password: 'password123',
        rol: 'user',
      };

      service.registerUser(mockUser).subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(user.name).toBe('New User');
      });

      const req = httpMock.expectOne(`${basePath}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);
      req.flush(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const mockUser: User = {
        id: '1',
        name: 'Updated User',
        documentNumber: '123456',
        documentType: 'CC',
        email: 'updated@example.com',
        password: 'newpassword',
        rol: 'user',
      };

      service.updateUser(mockUser).subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(user.name).toBe('Updated User');
      });

      const req = httpMock.expectOne(`${basePath}/${mockUser.id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockUser);
      req.flush(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      const userId = '1';

      service.deleteUser(userId).subscribe();

      const req = httpMock.expectOne(`${basePath}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
    });
  });

  describe('loginUser', () => {
    it('should login user and store JWT token', () => {
      const mockResponse = { token: 'mock-jwt-token' };
      const email = 'test@example.com';
      const password = 'password123';

      service.loginUser(email, password).subscribe((result) => {
        expect(result).toBe(true);
        expect(localStorage.getItem('jwt')).toBe('mock-jwt-token');
        expect(service.userIsAuthenticated()).toBe(true);
      });

      const req = httpMock.expectOne(`${basePath}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockResponse);
    });

    it('should fail login with invalid credentials', () => {
      const mockError = { error: { message: 'Invalid credentials' } };
      const email = 'test@example.com';
      const password = 'wrongpassword';

      service.loginUser(email, password).subscribe(
        () => {
          fail('should have failed');
        },
        (error) => {
          expect(error).toBeTruthy();
        }
      );

      const req = httpMock.expectOne(`${basePath}/login`);
      req.error(new ErrorEvent('Unauthorized'));
    });
  });

  describe('logout', () => {
    it('should clear localStorage and redirect to login', () => {
      // Setup
      localStorage.setItem('jwt', 'test-token');
      spyOn(window.localStorage, 'clear');

      service.logout();

      expect(window.localStorage.clear).toHaveBeenCalled();
    });
  });

  describe('getUserRole', () => {
    it('should decode and return JWT payload', () => {
      // Mock a simple JWT token (without proper signature, for testing only)
      const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3RVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sIjoiYWRtaW4ifQ.signature';

      const result = service.getUserRole(mockToken);

      expect(result).toBeTruthy();
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      const result = service.getUserRole(invalidToken);

      expect(result).toBeNull();
    });
  });

  describe('getJwt', () => {
    it('should return JWT token with Bearer prefix', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('jwt', token);

      const result = service.getJwt();

      expect(result).toBe(`Bearer ${token}`);
    });

    it('should return "Bearer null" if no token in localStorage', () => {
      const result = service.getJwt();

      expect(result).toBe('Bearer null');
    });
  });

  describe('getHeaderAuthorization', () => {
    it('should return HttpHeaders with authorization', () => {
      localStorage.setItem('jwt', 'test-token');

      const headers = service.getHeaderAuthorization();

      expect(headers.has('Content-Type')).toBe(true);
      expect(headers.has('Authorization')).toBe(true);
      expect(headers.get('Content-Type')).toBe('application/json');
    });
  });
});
