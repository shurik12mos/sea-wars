import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Socket } from 'ng2-socket-io';

import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [AuthService]
})
export class UsersComponent implements OnInit {
  me: any;
  users: any;
  askUser: any = {};
  showAskBattleModal: boolean = false;
  busy: boolean = false;

  constructor(private authService: AuthService, private socket: Socket, private router: Router) {
    console.log('constructor UsersComponent');
    this.me = {};
    this.users = [];//socketService.getUsers

    this.me = this.authService.getUserLocal();
    this.socket.emit('add to list', {user: this.me});
  }

  ngOnInit() {

    console.log('this.me ', this.me);

    this.socket.on('connect',
      (data) => {
        console.log('socket connect')
        this.socket.emit('add to list', {user: this.me});
      }
    );

    this.socket.on('change list', (data) => {
          let users = data['users'];

          users = users.filter(
            (item) => {
              return item._id !== this.me._id
            }
          );

          console.log('change list ', data);
          this.users = users;
        }
      );

    this.socket.on('busy users', (data) => {
          let users = data['users'],
            busy = users[0].busy;

          this.users.forEach((item) => {
            if (item._id === users[0]._id || item._id == users[1]._id) {
              item.busy = busy;
            }
          });

          console.log('busy users ', data);

        }
      );

    this.socket.on('ask battle', (data) => {
          console.log('ask battle ', data);
          this.askUser = data['user'];

          this.showAskBattleModal = true;
          this.busy = true;
        }
      );

    this.socket.on('go to battle',
      (data) => {
        let battleId = data['battleId'];
        console.log('go to battle', data);
        this.me.busy = true;

        this.busy = true;

        this.router.navigate(['/battle/' + battleId]);
      }
    );

    this.socket.on('battle response',
      (data) => {
        let answer = data.answer;
        console.log('battle answer', answer);
        this.busy = answer;
      }
    );


  }

  askForBattle(user: any) {
    this.socket.emit('ask battle', {me: this.me, user: user});

    console.log('waiting for answer');
    this.busy = true;

    //this.router.navigate(['/battle']);
  }

  closeAskBattleModal(res: boolean) {
    this.showAskBattleModal = false;
    this.socket.emit('battle response', {me: this.me, answer: res, user: this.askUser});
  }

}
