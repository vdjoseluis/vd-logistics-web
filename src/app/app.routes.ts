import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { loginRedirectGuard } from './auth/guards/login-redirect.guard';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.component'),
    canActivate: [loginRedirectGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'services',
        pathMatch: 'full'
      },
      {
        path: 'users',
        title: 'Usuarios',
        loadComponent: () => import('./components/users/user-list/user-list.component')
      },
      {
        path: 'user/:id',
        loadComponent: () => import('./components/users/user-form/user-form.component')
      },
      {
        path: 'customers',
        title: 'Clientes',
        loadComponent: () => import('./components/customers/customer-list/customer-list.component')
      },
      {
        path: 'customer/:id',
        loadComponent: () => import('./components/customers/customer-form/customer-form.component')
      },

      {
        path: 'services',
        title: 'Servicios',
        loadComponent: () => import('./components/services/service-list/service-list.component')
      },
      {
        path: 'service/:id',
        loadComponent: () => import('./components/services/service-form/service-form.component')
      },
      {
        path: 'incidents',
        title: 'Incidencias',
        loadComponent: () => import('./components/incidents/incident-list/incident-list.component')
      },
      {
        path: 'incident/:id',
        loadComponent: () => import('./components/incidents/incident-form/incident-form.component')
      },
      {
        path: 'logs',
        title: 'Registro de Actividad',
        loadComponent: () => import('./components/logs/logs-list/logs-list.component')
      }
    ]
  }
];
