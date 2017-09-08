import {
  RouterModule,
  Routes
} from '@angular/router';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';
import { BattleComponent } from './battle/battle.component';

import { CanActivateLoggedIn } from './lib/auth.guard'

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'list',
    component: UsersComponent,
    canActivate: [CanActivateLoggedIn]
  },
  {
    path: 'battle/:id',
    component: BattleComponent,
    canActivate: [CanActivateLoggedIn]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }



