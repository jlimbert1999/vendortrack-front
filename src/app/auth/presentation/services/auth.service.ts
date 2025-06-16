import { computed, Injectable, signal } from '@angular/core';

export interface menu {
  icon: string;
  resource: string;
  routerLink: string;
  label: string;
  childred?: menu[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  constructor() {}
}
