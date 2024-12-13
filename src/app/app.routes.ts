import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterPage } from './register/register.page';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterPage,
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes').then(m => m.vehiculoRoutes),
  }
];
