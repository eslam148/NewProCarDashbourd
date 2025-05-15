import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'admins',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
        data: {
          title: 'Admins'
        }
      },
      {
        path: 'location',
        loadComponent: () => import('./pages/location/location.component').then(m => m.LocationComponent),
        data: {
          title: 'Location'
        }
      },
      {
        path: 'servicecategory',
        loadComponent: () => import('./pages/servicecategory/servicecategory.component').then(m => m.ServicecategoryComponent),
        data: {
          title: 'Service Category'
        }
      },
      {
        path: 'request',
        loadComponent: () => import('./pages/requests/requests.component').then(m => m.RequestsComponent),
        data: {
          title: 'Request'
        }
      },
      {
        path: 'nurse',
        loadComponent: () => import('./pages/nurse/nurse.component').then(m => m.NurseComponent),
        data: {
          title: 'Nurse'
        }
      },
      {
        path: 'specialty',
        loadComponent: () => import('./pages/specialty/specialty.component').then(m => m.SpecialtyComponent),
        data: {
          title: 'Specialty'
        }
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/main-login/main-login.component').then(m => m.MainLoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
