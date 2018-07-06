'use strict';
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
    if (!(vector instanceof Vector)) {
      throw new Error(`����� ���������� � ������� ������ ������ ���� Vector!`);
    } 
    return new Vector(this.x + vector.x, this.y + vector.y); 
  }

  times(multiplier) {
    return new Vector(this.x * multiplier, this.y * multiplier); 
  }
}

class Actor {
  constructor(position = new Vector(), size = new Vector(1, 1), speed = new Vector()) {
    if ((!(position instanceof Vector)) || (!(size instanceof Vector)) || (!(speed instanceof Vector)))  {
      throw new Error(`�������� �������, ������� ��� �������� ������� ���� Actor ����� ���� ������� ������ �������� ���� Vector!`);
    }
    this.pos = position;
    this.size = size;
    this.speed = speed;
    this.act = function() {};	
    Object.defineProperties(this, {
      'left': {
        get() { return this.pos.x; }
      },
      'top': {
        get() { return this.pos.y; }
      },
      'right': {
        get() { return this.pos.x + this.size.x; }
      },
      'bottom': {
        get() { return this.pos.y + this.size.y; }
      }
    });
  }

  get type() {
    return 'actor';
  }

  isIntersect(actor) {
    if ((!(actor instanceof Actor)) || (actor === undefined))  {
      throw new Error(`���������� ������ actor ����� ���� ������� ������ �������� ���� Actor, � �� ����� undefined!`);
    } 
    return (this === actor) ? false : ((this.left < actor.right) && (this.right > actor.left) && (this.top < actor.bottom) && (this.bottom > actor.top)) ? true : false;
  }  
}


class Level {
  constructor(gameFieldGrid, listOfActor = []) {
    this.grid = gameFieldGrid;
    this.actors = listOfActor;
    this.player = listOfActor.find((actor) => (actor.type === 'player'));
    this.height = (gameFieldGrid) ? gameFieldGrid.length : 0; 
    this.width = (gameFieldGrid) ? Math.max(...(gameFieldGrid.map((line) => (line.length)))) : 0; 
    this.status = null;
    this.finishDelay = 1;
  }

  isFinished() {
    return ((this.status !== null) && (this.finishDelay < 0)) ? true : false;
  }

  actorAt(actor) {
    if ((!(actor instanceof Actor)) || (actor === undefined))  {
      throw new Error(`���������� ������ actor ����� ���� ������� ������ �������� ���� Actor, � �� ����� undefined!`);
    } 
    return this.actors.find((otherActor) => otherActor.isIntersect(actor));
  }

  obstacleAt(position, size) {
    if ((!(position instanceof Vector)) || (!(size instanceof Vector)))  {
      throw new Error(`�������� ������� ��� ������� ������� ���� Actor ����� ���� ������� ������ �������� ���� Vector!`);
    }
    const actor = new Actor(position, size);
    if ( (actor.left < 0) || (actor.top < 0) || (actor.right > this.width) ) {
       return 'wall';
    } else if (actor.bottom > this.height) {
       return 'lava';
    } 
    for (let x = Math.floor(actor.left); x < actor.right; x++) {
      for (let y = Math.floor(actor.top); y < actor.bottom; y++) {
        if (this.grid[y][x]) {
          return this.grid[y][x];
        }
      }  
    }
  }

  removeActor(actor) {
    this.actors.splice(this.actors.findIndex((obj) => (obj === actor)), 1);
  }

   noMoreActors(typeOfActor) {
    return !(this.actors.find((actor) => (actor.type === typeOfActor))) ? true : false;
  }

   playerTouched(typeOfObject, actor) {
    if (this.status === null) {
      if ((typeOfObject === 'lava') || (typeOfObject === 'fireball')) {
        this.status = 'lost';
      } else if (typeOfObject === 'coin') {
        this.removeActor(actor);
        this.noMoreActors(typeOfObject) ? this.status = 'won' : '';
      }
    }
  }

}

class Player extends Actor {
  constructor(position = new Vector()) {
    super(position);
    this.pos = position.plus(new Vector(0, -0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector();
  }
  
  get type() {
    return 'player';
  }
}