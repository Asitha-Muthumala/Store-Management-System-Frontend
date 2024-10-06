import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { ProductDashboardComponent } from './component/product-dashboard/product-dashboard.component';
import { AuthGuard } from './shared/service/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'dashboard', component: ProductDashboardComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
