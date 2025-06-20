import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import { environment } from '../../../../environments/environment';
import { jwtPayload } from '../infrastructure';

export interface menu {
  icon: string;
  resource: string;
  routerLink: string;
  label: string;
  childred?: menu[];
}

interface loginProps {
  login: string;
  password: string;
  remember: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly URL: string = environment.apiUrl;

  private _menu = signal<menu[]>([]);
  menu = computed(() => this._menu());

  private _user = signal<jwtPayload | null>(null);
  user = computed(() => this._user());

  constructor() {}

  login({ login, password, remember }: loginProps) {
    if (remember) {
      localStorage.setItem('login', login);
    } else {
      localStorage.removeItem('login');
    }
    return this.http
      .post<{ token: string }>(`${this.URL}/auth`, {
        login,
        password,
      })
      .pipe(
        map(({ token }) => {
          this.setAuthentication(token);
          return true;
        })
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<{
        token: string;
        menu: menu[];
      }>(`${this.URL}/auth`)
      .pipe(
        map(({ token, menu }) => {
          this._menu.set(menu);
          this.setAuthentication(token);
          return true;
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._user.set(null);
  }

  private setAuthentication(token: string) {
    const payload: jwtPayload = jwtDecode(token);
    this._user.set(payload);
    localStorage.setItem('token', token);
  }
}
