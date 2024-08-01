import Asteroid from "../components/game/GameObject";
import Player from "../components/game/Player";
import Bullet from "../components/game/Bullet";
import { ReactNode } from "react";

export enum STATUS_CODES {
  SUCCESS,
  GENERIC_ERROR,
  USER_NOT_FOUND,
  INVALID_EMAIL,
  INVALID_SERVICE,
  SENT_CODE,
  EMAIL_NOT_EXIST,
  ERROR_SENDING_CODE,
  CODE_DENIED,
  CODE_EXPIRED,
  CODE_FAILED,
  NO_CONNECTION,
  EMAIL_IN_USE,
  USERNAME_IN_USE,
  NONE_IN_USE,
  NO_GAME_FOUND,
  GAME_FULL,
}

export interface AlertModalProps extends BaseModalProps {
  title: string;
  text: string;
  cancel?: boolean;
  action?: () => void;
}

export interface BaseModalProps {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

export interface VerificationModalProps extends BaseModalProps {
  email: string;
  action: (v: boolean) => void;
}

export interface LoadingScreenProps {
  loading: boolean;
  text?: string;
  children?: ReactNode;
}

export interface User {
  _id: string;
  avatar: string;
  username: string;
  email: string;
  dateJoined: Date;
}

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

export interface LinkButtonProps {
  text: string;
  route?: string;
  action?: () => void;
  disabled?: boolean;
  selected?: boolean;
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
  background?: boolean;
}

export interface HighScoreProp {
  _id: string;
  username: string;
  avatar: string;
  score: number;
  level: number;
}

export enum GAMES {
  ASTEROIDS = "asteroidsData.games",
}

export interface ProfileStatsProp {
  score: number;
  level: number;
  gamesPlayed: number;
}

export interface ScoreProp {
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
