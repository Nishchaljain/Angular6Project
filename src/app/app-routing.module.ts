import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home.component';
import { PagenotfoundComponent } from './pagenotfound.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  //{ path: 'employees', loadChildren: './employee/employee.module#EmployeeModule' },
  {
    path: 'employees',
    loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
