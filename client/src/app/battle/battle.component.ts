import { Component, OnInit } from '@angular/core';

import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Socket } from 'ng2-socket-io';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {
  roomId: string;
  ownPoles: any;
  enemyPoles: any;
  preparing: boolean = true;
  waitForEnemy: boolean = false;
  ships4: any = [{id: 41, length: 4}];
  ships3: any = [{id: 31, length: 3}, {id: 32, length: 3}];
  ships2: any = [{id: 21, length: 2}, {id: 22, length: 2}, {id: 23, length: 2}];
  ships1: any = [{id: 11, length: 1}, {id: 12, length: 1}, {id: 13, length: 1}, {id: 14, length: 1}];


  constructor(private router: Router, private socket: Socket, private route: ActivatedRoute) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.socket.emit('leave room', '');
      }

    });

  }

  ngOnInit() {
    this.socket.fromEvent('leave room')
      .subscribe(
        (data) => {
        console.log('leave room event', data['message']);
        this.socket.emit('leave room', '');

        this.router.navigate(['/list']);
    });

    this.ownPoles = this.createPoles();
    this.enemyPoles = this.createPoles();

    this.socket.fromEvent('battle move')
      .subscribe(
        (data) => {
          let move = data['move'],
            result;

          result = this.setShootOwn(move);

          this.socket.emit('battle move result', {result: result});
        }
      );
  }

  createPoles(): any {
    let pole = [];

    for (let i = 0; i < 10; i++) {
      pole.push([]);
      for (let j = 0; j < 10; j ++) {
        pole[i].push({address: ''+i+j, state: 0});
      }
    }

    return pole;
  }

  checkFigure(pole: any, event: any): boolean {
    let startPosition = pole.address;

    if (!startPosition || !startPosition.match(/\d\d/)) {
      pole.error = true;
      return false;
    }

    let length = event.dragData.length,
        direction = event.dragData.direction || 'vertical';

    let i = parseInt(startPosition[0]),
      j = parseInt(startPosition[1]),
      start,
      result = false,
      row = [];

    if (direction === 'horizontal') {
      if (i > 9 || (j + length -1) > 9) {
        pole.error = true;
        return false;
      }

      // check if it already busy
      for (let l = j; l < j+length; l++) {
        if (this.ownPoles[i][l] === 1 ) {
          pole.error = true;
          return result;
        }
      }

      result = true;

    }else {
      // get part of line
      for (let l = i; l < i+length; l++) {
        if (this.ownPoles[l][j] === 1 ) {
          pole.error = true;
          return result;
        }
      }

      result = true;
    }

    pole.error = true;
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

    let i = parseInt(startPosition[0]),
      j = parseInt(startPosition[1]);

    if (direction === 'horizontal') {
      for (let l = j; l < j+length; l++) {
        this.ownPoles[i][l].state = 1;
      }
    }else {
      for (let l = i; l < i+length; l++) {
        this.ownPoles[l][j].state = 1;
      }
    }

    // remove ship
    let shipEl = 'ships' + event.dragData.id.toString()[0];
    this[shipEl] = this[shipEl].filter((item) => {
      return item.id !== event.dragData.id;
    });

    return true;
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

   this.socket.fromEvent('battle move result')
      .subscribe(
        (data) => {
          let result = data['result'];

          this.enemyPoles[i][j] = parseInt(result);
        }
      );
  }



}
