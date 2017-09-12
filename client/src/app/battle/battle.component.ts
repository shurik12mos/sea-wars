import { Component, OnInit } from '@angular/core';

import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Socket } from 'ng2-socket-io';
import {Observable} from "rxjs/Observable";

import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {
  me: any;
  roomId: string;
  battle: any;
  userready: boolean = false;
  ownPoles: any;
  enemyPoles: any;
  preparing: boolean = true;
  waitForEnemy: boolean = false;
  userReady: boolean = false;
  userTime: number = 60;
  ships:any = {
    1: [{id: 11, length: 1}, {id: 12, length: 1}, {id: 13, length: 1}, {id: 14, length: 1}],
    2: [{id: 21, length: 2}, {id: 22, length: 2}, {id: 23, length: 2}],
    3: [{id: 31, length: 3}, {id: 32, length: 3}],
    4: [{id: 41, length: 4}]
  };

  readyShips: any = [];

  isDroppedAlowed: boolean = true;
  draggableElement: any;
  createdShips: any = {};


  constructor(private router: Router, private socket: Socket, private route: ActivatedRoute, private authService: AuthService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.socket.emit('leave room', '');
        this.socket.removeAllListeners('leave room');
        this.socket.removeAllListeners('ready timer');
      }
    });

    this.me = this.authService.getUserLocal();

    this.roomId = this.route.snapshot.params['id'];
    console.log('room id ', this.roomId);

    this.joinRoom();

    this.socket.on('battle schema', (data) => {

      this.battle = data;
      console.log('battle schema', this.battle);
    });
  }

  ngOnInit() {
    this.socket.on('leave room', (data) => {
        console.log('leave room event', data['message']);
        this.socket.emit('leave room', '');

        this.socket.removeListener('leave room');

        setTimeout(()=> {this.router.navigate(['/list'])}, 5000);
    });

    this.ownPoles = this.createPoles();
    this.enemyPoles = this.createPoles();

    this.socket.on('battle move', (data) => {
          let move = data['move'],
            result;

          result = this.setShootOwn(move);

          this.socket.emit('battle move result', {result: result});
        }
      );


    this.startReadyTimer();
  }

  joinRoom(): void {
    this.socket.emit('join room', {
      me: this.me,
      roomId: this.roomId
    });
  }

  startReadyTimer(): void {
    this.socket.on('ready timer', (data) => {
      console.log('userTimer', data);
      let time = data;
      this.userTime = +data;
    });
  }

  readyForBattle():void {
    this.socket.emit('ready for battle', this.readyShips);
    this.userReady = true;
  }

  createPoles(): any {
    let pole = [];

    for (let i = 0; i < 10; i++) {
      pole.push([]);
      for (let j = 0; j < 10; j ++) {
        pole[i].push({address: ''+i+j, state: 0, ship: null, shipId: null});
      }
    }

    return pole;
  }

  changeOrientation(ship: any):void {
    ship.direction = (ship.direction === 'vertical')?'horizontal':'vertical';
  }

  startDragShip(event: any, ship: any): void {
    this.draggableElement = ship;
  }

  leaveDragShip(ship: any): void {
    this.isDroppedAlowed = true;
  }

  endDragShip(event: any, ship: any): void {
    this.isDroppedAlowed = true;
  }

  checkFigure(pole: any): boolean {
    //debugger;
    let startPosition = pole.address;

    this.isDroppedAlowed = true;

    if (!startPosition || !startPosition.match(/\d\d/)) {
      pole.error = true;
      this.isDroppedAlowed = false;
      return false;
    }

    let length = this.draggableElement.length,
        direction = this.draggableElement.direction || 'horizontal';

    let i = parseInt(startPosition[0]),
      j = parseInt(startPosition[1]),
      result = false;

    if (direction === 'horizontal') {
      if (i > 9 || (j + length -1) > 9) {
        pole.error = true;
        this.isDroppedAlowed = false;
        return false;
      }


      for (let k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k > 9) continue;
        for (let l = j - 1; l <= j+length; l++) {
          if (l < 0 || l > 9) continue;
          let a = this.ownPoles[k][l];
          if (this.ownPoles[k][l].state === 1) {
            this.isDroppedAlowed = false;
            return false;
          }
        }
      }

      result = true;

    }else {

      for (let k = i - 1; k <= i + length; k++) {
        if (k < 0 || k > 9) continue;
        for (let l = j - 1; l <= j+1; l++) {
          if (l < 0 || l > 9) continue;
          if (this.ownPoles[k][l].state === 1) {
            this.isDroppedAlowed = false;
            return false;
          }
        }
      }

      result = true;
    }


    return result;
  }



  addFigure(pole: any, event: any): boolean {
    let startPosition = pole.address;
    debugger;
    if (!startPosition || !startPosition.match(/\d\d/)) {
      return false;
    }

    let length = event.dragData.length,
      direction = event.dragData.direction || 'horizontal';

    let inrow = parseInt(startPosition[0]),
      incol = parseInt(startPosition[1]);

    if (direction === 'horizontal') {
      for (let row = inrow - 1; row <= inrow + 1; row++) {
        if (row < 0 || row > 9) continue;
        for (let col = incol - 1; col <= incol+length; col++) {
          if (col < 0 || col > 9) continue;

          if (row === inrow && col >= incol && col < incol+length) {
            this.ownPoles[row][col].state = 1;
          }else {
            this.ownPoles[row][col].state += 2;
          }
        }
      }
    }else {
      for (let row = inrow - 1; row <= inrow + length; row++) {
        if (row < 0 || row > 9) continue;
        for (let col = incol - 1; col <= incol+1; col++) {
          if (col < 0 || col > 9) continue;

          if (col === incol && row >= inrow && row < inrow+length) {
            this.ownPoles[row][col].state = 1;
            this.ownPoles[row][col].shipId = this.draggableElement.id;
          }else {
            this.ownPoles[row][col].state += 2;
          }
        }
      }
    }

    // copy object
    pole.ship = Object.assign({}, this.draggableElement);
    this.readyShips.push(pole.ship);

    // remove ship
    this.ships[this.draggableElement.length] = this.ships[this.draggableElement.length].filter((item) => {
      return item.id !== this.draggableElement.id;
    });

    this.draggableElement = null;

    console.log(this.readyShips, pole.ship);

    return true;
  }

  deleteShip(pole: any) {
    //clean pole for this ship
    let poleRow = +pole.address[0],
        poleCol = +pole.address[1],
        startRow = (+pole.address[0] - 1)<0?+pole.address[0]:+pole.address[0] - 1,
        endRow = (pole.ship.direction === 'horizontal')?poleRow+pole.ship.length:poleRow+1,
        startCol = (+pole.address[1] - 1)<0?+pole.address[1]:+pole.address[1] - 1,
        endCol = (pole.ship.direction === 'horizontal')?poleCol + 1:poleCol+pole.ship.length;

    //add ship to this.ships
    this.ships[pole.ship.length].push(pole.ship);

    for(let i = startRow; i <= endRow; i++) {
      if (i < 0 || i > 9) continue;
      for (let j = startCol; j <= endCol; j++) {
        if (j < 0 || j > 9) continue;
        if (this.ownPoles[i][j].state === 1) {
          this.ownPoles[i][j].state = 0;
          this.ownPoles[i][j].ship = null;
        }else if (this.ownPoles[i][j].state > 1) {
          this.ownPoles[i][j].state -= 2;
        }
      }
    }



  }

  setShootOwn(shoot: string): boolean {
    if (!shoot.match(/\d\d/)) {
      return false;
    }

    let i = parseInt(shoot[0]),
      j = parseInt(shoot[1]),
      result;

    result = (this.ownPoles[i][j] === 1)?true:false;

    return result;
  }

  makeShoot(shoot: string):void {
    let i = parseInt(shoot[0]),
      j = parseInt(shoot[1]);

    this.waitForEnemy = true;

   this.socket.emit('battle move', {move: shoot});

   this.socket.on('battle move result', (data) => {
          let result = data['result'];

          this.enemyPoles[i][j] = parseInt(result);
        }
      );
  }



}
