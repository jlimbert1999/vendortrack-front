import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/presentation/guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/presentation/pages/login/login.component'),
  },
  {
    path: 'home',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./layout/presentation/pages/home/home.component'),
    children: [
      {
        path: 'traders',
        loadComponent: () =>
          import(`./commerce/presentation/pages/traders/traders.component`),
      },
      {
        path: 'stalls',
        loadComponent: () =>
          import(`./commerce/presentation/pages/stalls/stalls.component`),
      },
    ],
  },
  {
    path: 'certificates/verify/:id',
    loadComponent: () =>
      import(
        `./commerce/presentation/pages/verify-certificate/verify-certificate.component`
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
];
