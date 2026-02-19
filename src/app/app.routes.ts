import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { RegisterAdmin } from './features/auth/register-admin/register-admin';

export const routes: Routes = [

  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'register-admin',
    component: RegisterAdmin
  },

  {
    path: 'member',
    canActivate: [authGuard, roleGuard('MEMBER')],
    loadComponent: () =>
      import('./features/member/member')
        .then(m => m.Member),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/enquiry/components/my-enquiry-list/my-enquiry-list')
            .then(m => m.MyEnquiryList),
      },
      {
        path: 'enquiry',
        loadComponent: () =>
          import('./features/enquiry/components/submit-enquiry/submit-enquiry')
            .then(m => m.SubmitEnquiry),
      },
    ]
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('ADMIN')],
    loadComponent: () =>
      import('./features/admin/admin')
        .then(m => m.Admin),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/enquiry/components/enquiry-list/enquiry-list')
            .then(m => m.EnquiryList),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/category/category')
            .then(m => m.Category),
      },
      {
        path: 'statuses',
        loadComponent: () =>
          import('./features/status/status')
            .then(m => m.Status),
      },
      {
        path: 'enquiries/edit/:id',
        loadComponent: () =>
          import('./features/enquiry/components/enquiry-edit/enquiry-edit')
            .then(m => m.EnquiryEdit),
      }
    ]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

