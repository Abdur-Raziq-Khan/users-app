import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

const routes: Routes = [
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }, 
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: 'admin-layout', loadChildren: () => import('./admin-layout/admin-layout.module').then(m => m.AdminLayoutModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// const appRoutes: Routes = [
//     // { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
//     // { path: '', component: AdminComponent, canActivate: [AuthGuard] },
//     { path: '', component: AdminLayoutComponent, canActivate: [AuthGuard] },
//     // { path: '', component: DashboardComponent },
//     { path: 'login', component: LoginComponent },
//     { path: 'register', component: RegisterComponent },

//     // otherwise redirect to home
//     { path: '**', redirectTo: '' }
// ];

// export const routing = RouterModule.forRoot(appRoutes);