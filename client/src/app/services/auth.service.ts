import { Injectable } from '@angular/core';

import { AuthModule } from '../auth/auth.module';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  user: any;


  constructor(public authHttp: AuthHttp, public http: Http) {
    let token = sessionStorage.getItem('token');

    if (token) {
      this.getUser(token);
    }

  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post('api/user/login', {username: username, password: password})
      .map((data) => {
        let token = data.json().token;

        if (token) {
          this.isLoggedIn = true;
          sessionStorage.setItem('token', token);
          return true;
        }else {
          this.isLoggedIn = false;
          sessionStorage.setItem('token', null);
          return false;
        }
      });
  }

  signup(username: string, password: string): Observable<boolean> {
    return this.http.post('api/user/signup', {username: username, password: password})
      .map((data) => {
        let user = data.json();
        let token = user.token;

        if (token) {
          this.isLoggedIn = true;
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(user));
          this.user = user;

          return true;
        }else {
          this.isLoggedIn = false;
          sessionStorage.setItem('token', null);
          return false;
        }
      });
  }

  getUser(token: string): Observable<any> {
    return this.authHttp.get('api/user')
      .map(
        (success) => {
          let user = success.json();
          sessionStorage.setItem('user', user);
          this.user = user;

        },
        (error) => {
          console.log('get user error - ', error);
        }
      );
  }

  getUserLocal(): any {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  logout(): void {
    this.isLoggedIn = false;
    sessionStorage.setItem('token', null);
  }
}
