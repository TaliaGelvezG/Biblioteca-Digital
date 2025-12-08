import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Loans } from './loans';
import { Loan } from '../interfaces/loan';

describe('Loans', () => {
  let service: Loans;
  let httpMock: HttpTestingController;
  const basePath = 'http://localhost:3000/api/v1/biblioteca-digital/loans';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Loans],
    });
    service = TestBed.inject(Loans);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLoans', () => {
    it('should fetch all loans', () => {
      const mockLoans: Loan[] = [
        {
          id: '1',
          bookId: 'book1',
          documentNumberUser: '12345678',
          bookName: 'Angular Guide',
          userName: 'John Doe',
          loanDate: '2023-01-15',
          loanTime: 14,
        },
        {
          id: '2',
          bookId: 'book2',
          documentNumberUser: '87654321',
          bookName: 'TypeScript Handbook',
          userName: 'Jane Smith',
          loanDate: '2023-01-20',
          loanTime: 7,
        },
      ];

      service.getLoans().subscribe((loans) => {
        expect(loans).toEqual(mockLoans);
        expect(loans.length).toBe(2);
      });

      const req = httpMock.expectOne(basePath);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush(mockLoans);
    });

    it('should handle empty loan list', () => {
      const mockLoans: Loan[] = [];

      service.getLoans().subscribe((loans) => {
        expect(loans).toEqual([]);
        expect(loans.length).toBe(0);
      });

      const req = httpMock.expectOne(basePath);
      req.flush(mockLoans);
    });
  });

  describe('registerLoan', () => {
    it('should register a new loan', () => {
      const mockLoan: Loan = {
        id: '3',
        bookId: 'book3',
        documentNumberUser: '11111111',
        bookName: 'Web Development',
        userName: 'Alice Johnson',
        loanDate: '2023-02-01',
        loanTime: 21,
      };

      service.registerLoan(mockLoan).subscribe((loan) => {
        expect(loan).toEqual(mockLoan);
        expect(loan.id).toBe('3');
        expect(loan.bookName).toBe('Web Development');
      });

      const req = httpMock.expectOne(basePath);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoan);
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush(mockLoan);
    });
  });

  describe('updateLoan', () => {
    it('should update an existing loan', () => {
      const mockLoan: Loan = {
        id: '1',
        bookId: 'book1',
        documentNumberUser: '12345678',
        bookName: 'Angular Guide',
        userName: 'John Doe',
        loanDate: '2023-01-15',
        loanTime: 7, // Updated loan time
      };

      service.updateLoan(mockLoan).subscribe((loan) => {
        expect(loan).toEqual(mockLoan);
        expect(loan.loanTime).toBe(7);
      });

      const req = httpMock.expectOne(`${basePath}/${mockLoan.id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockLoan);
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush(mockLoan);
    });
  });

  describe('deleteLoan', () => {
    it('should delete a loan', () => {
      const loanId = '1';

      service.deleteLoan(loanId).subscribe();

      const req = httpMock.expectOne(`${basePath}/${loanId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
    });

    it('should send request to correct endpoint for delete', () => {
      const loanId = '123';

      service.deleteLoan(loanId).subscribe();

      const req = httpMock.expectOne(req => req.url === `${basePath}/${loanId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
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

    it('should include Bearer token in Authorization header', () => {
      const token = 'test-token-loans';
      localStorage.setItem('jwt', token);

      const headers = service.getHeaderAuthorization();

      expect(headers.get('Authorization')).toContain('Bearer');
      expect(headers.get('Authorization')).toContain(token);
    });

    it('should work correctly with different token values', () => {
      const tokens = ['token1', 'token2', 'another-token'];

      tokens.forEach((token) => {
        localStorage.setItem('jwt', token);
        const headers = service.getHeaderAuthorization();
        expect(headers.get('Authorization')).toBe(`Bearer ${token}`);
      });
    });
  });
});
