import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/presentation/guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar sesión',
    loadComponent: () =>
      import('./auth/presentation/pages/login/login.component'),
  },
  {
    path: 'home',
    title: 'Inicio',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () => import('./layout/presentation/pages/home/home.component'),
    children: [
      {
        path: 'main',
        loadComponent: () => import(`./layout/presentation/pages/main/main.component`),
      },
      {
        path: 'traders',
        title: 'Comerciantes',
        loadComponent: () => import(`./commerce/presentation/pages/traders/traders.component`),
      },
      {
        path: 'stalls',
        title:'Puestos',
        loadComponent: () => import(`./commerce/presentation/pages/stalls/stalls.component`),
      },
       {
        path: 'users',
        title: 'Usuarios',
        loadComponent: () => import(`./users/presentation/pages/users-manage/users-manage.component`),
      },
      { path: '', pathMatch: 'full', redirectTo: 'main' },
    ],
  },
  {
    path: 'certificates/verify/:id',
    loadComponent: () => import(  `./commerce/presentation/pages/verify-certificate/verify-certificate.component`),
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' },
];
