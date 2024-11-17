import { Route } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/sign-up/sign-up.component';

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
];
