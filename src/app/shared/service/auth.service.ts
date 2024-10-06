import { Injectable } from '@angular/core';
import { BASE_URL, LOGIN, TOKEN_KEY, USER_NAME_KEY } from '../const';
import { HttpClient } from '@angular/common/http';
import { Login } from '../userModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  setLogin(login: Login): Observable<any> {
    return this.http.post<any>(`${BASE_URL}${LOGIN}`, login);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUserName(): string | null {
    return localStorage.getItem(USER_NAME_KEY);
  }
}
