import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { LandingPage } from './features/landing-page/landing-page';
import { guestGuard } from './core/guards/guest-guard';
import { Member } from './features/member/member';
import { VerifyEmail } from './features/auth/verify-email/verify-email';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    canActivate: [guestGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },
  {
    path: 'verify-email', 
    component: VerifyEmail
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password')
        .then(m => m.ForgotPassword)
  },
  {
    path: 'member',
    component: Member,
    canActivate: [authGuard, roleGuard('MEMBER')],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/enquiry/components/my-enquiry-list/my-enquiry-list')
            .then(m => m.MyEnquiryList)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile')
            .then(m => m.Profile)
      }
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
        path: 'dashboard',
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
        path: 'registration',
        loadComponent: () =>
          import('./features/auth/register-admin/register-admin')
            .then(m => m.RegisterAdmin)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];