import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './guards/auth.guard';
import { NewLayoutComponent } from './layout/new-layout/new-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  /*{
    path: '',
    component: NewLayoutComponent,
    children: [
      {
        path: '',
        component: LandingComponent,
        data: {
          title: 'Welcome to ProCar Dashboard'
        }
      }
    ]
  },*/
  {
    path: '',
    component: DefaultLayoutComponent,
    // canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      /*
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      */
      {
        path: 'admins',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
        data: {
          title: 'Admins'
        }
      },
      {
        path: 'disease',
        loadComponent: () => import('./pages/disease/disease.component').then(m => m.DiseaseComponent),
        data: {
          title: 'Disease'
        }
      },
      {
        path: 'pharmacy',
        loadComponent: () => import('./pages/pharmacy/pharmacy.component').then(m => m.PharmacyComponent),
        data: {
          title: 'Pharmacy'
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
        path: 'reservation',
        loadComponent: () => import('./pages/reservation/reservation.component').then(m => m.ReservationComponent),
        data: {
          title: 'Reservations'
        }
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
        data: {
          title: 'Reports'
        }
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
        data: {
          title: 'Notifications'
        }
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        data: {
          title: 'Profile'
        }
      },
      {
        path: 'app-version',
        loadComponent: () => import('./pages/app-version/app-version.component').then(m => m.AppVersionComponent),
        data: {
          title: 'App Version'
        }
      }
      /*,
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
        path: 'ui-notifications',
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
        */
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
  { path: '**', redirectTo: '404' }
];
