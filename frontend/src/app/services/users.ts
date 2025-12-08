import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { User } from '../interfaces/user';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../interfaces/jwt';

@Injectable({
  providedIn: 'root',
})
export class Users {
  basePath = 'http://localhost:3000/api/v1/biblioteca-digital/users';
  userIsAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.basePath, {
      headers: this.getHeaderAuthorization(),
    });
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.basePath}/register`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${this.basePath}/${user.id}`, user, {
      headers: this.getHeaderAuthorization(),
    });
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.basePath}/${userId}`, {
      headers: this.getHeaderAuthorization(),
    });
  }

  loginUser(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(`${this.basePath}/login`, { email, password }).pipe(
      map((jwt) => {
        localStorage.setItem('jwt', jwt.token);
        this.userIsAuthenticated.update((value) => true);
        return true;
      })
    );
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

  getUserRole(token: string): JwtPayload | null{
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (e) {
      return null;
    }
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
