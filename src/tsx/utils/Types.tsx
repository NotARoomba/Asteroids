import Asteroid from "../objects/GameObject";
import Player from "../objects/Player";
import Bullet from "../objects/Bullet";

interface vec2Prop {
  x: number;
  y: number;
}
export class vec2 implements vec2Prop {
  x: number;
  y: number;
  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
  }
}

export interface KeyProp {
  forward: boolean;
  space: boolean;
  left: boolean;
  right: boolean;
}

export interface GameProps {
  player: boolean;
  screen: vec2;
  count: number;
  setLevel: (l: number) => void;
  setScore: (n: number) => void;
  gameOver: () => void;
}

export interface ScoreProp {
  name: string;
  level: number;
  score: number;
}

export interface UniverseProp {
  asteroids: Asteroid[];
  ship: Player;
  bullets: Bullet[];
  score: number;
  level: number;
  done: boolean;
}

export class Universe implements UniverseProp {
  asteroids: Asteroid[];
  ship: Player;
  bullets: Bullet[];
  score: number;
  level: number;
  done: boolean;
  constructor(screen: vec2) {
    this.asteroids = [];
    this.ship = new Player(
      new vec2(screen.x / 2, screen.y / 2),
      new vec2(0, 0),
      1.5,
    );
    this.bullets = [];
    this.score = 0;
    this.level = 0;
    this.done = false;
  }
}
