import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';
import { BattleComponent } from './battle/battle.component';

/*
  AUTH
 */

import { AuthModule } from './auth/auth.module';
import { CanActivateLoggedIn } from './lib/auth.guard';
import { AuthService } from './services/auth.service';

/*
  Routes
 */
import { AppRoutingModule } from './app.routes';

/*
  Socket
 */
import { SocketIoModule, SocketIoConfig } from 'ng2-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

/*
  Drag and drop
 */
import { Ng2DragDropModule } from 'ng2-drag-drop';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    UsersComponent,
    BattleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AuthModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    Ng2DragDropModule.forRoot()
  ],
  providers: [
    AuthService,
    CanActivateLoggedIn
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
