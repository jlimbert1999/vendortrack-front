import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../../../environments/environment';
import { iwtPayload } from '../infrastructure';

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
  private _menu = signal<menu[]>([
    {
      routerLink: 'traders',
      label: 'Comerciantes',
      resource: '',
      icon: '',
    },
    {
      routerLink: 'stalls',
      label: 'Puestos',
      resource: '',
      icon: '',
    },
  ]);
  menu = computed(() => this._menu());

  private _user = signal<iwtPayload | null>(null);
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
        map(({ token }) => {
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
    this._user.set(jwtDecode(token));
    localStorage.setItem('token', token);
  }
}
