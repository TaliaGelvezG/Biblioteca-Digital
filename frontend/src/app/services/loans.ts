import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../interfaces/loan';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Loans {
  basePath = 'http://localhost:3000/api/v1/biblioteca-digital/loans';

  constructor(private http: HttpClient) {}

  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.basePath, {
      headers: this.getHeaderAuthorization(),
    });
  }

  registerLoan(loan: Loan): Observable<Loan> {
    return this.http.post<Loan>(`${this.basePath}`, loan, {
      headers: this.getHeaderAuthorization(),
    });
  }

  updateLoan(loan: Loan): Observable<Loan> {
    return this.http.patch<Loan>(`${this.basePath}/${loan.id}`, loan, {
      headers: this.getHeaderAuthorization(),
    });
  }

  deleteLoan(loanId: string) {
    return this.http.delete(`${this.basePath}/${loanId}`, {
      headers: this.getHeaderAuthorization(),
    });
  }

  getJwt(): string {
    const jwt = localStorage.getItem('jwt');
    return `Bearer ${jwt}`;
  }

  getHeaderAuthorization(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.getJwt()}`,
    });
  }
}
