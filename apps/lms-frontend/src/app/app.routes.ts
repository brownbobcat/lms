import { Route } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [canActivateAuthPages],
  },
  {
    path: 'sign-up',
    component: SignupComponent,
    // canActivate: [canActivateAuthPages],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    // canActivate: [canActivateAuthPages],
  },
];
