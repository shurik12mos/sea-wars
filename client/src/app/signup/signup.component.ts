import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService]
})
export class SignupComponent implements OnInit {
  model: any = {};

  constructor(public authService: AuthService, private router: Router) {
    this.model = {
      username: '',
      password: '',
      repeatPassword: ''
    }
  }

  ngOnInit() {

  }

  signup(): void{
    console.log('password match - ', this.model.password !== this.model.repeatPassword, this.model.password, this.model.repeatPassword);
    if (this.model.password !== this.model.repeatPassword) {
      return;
    }

    this.authService.signup(this.model.username, this.model.password)
      .subscribe((success) => {
          console.log('signup success');
          this.router.navigate(['/list']);
        },
        (error) => {
          console.log('signup error - ', error);
        }
      )
  }

}
