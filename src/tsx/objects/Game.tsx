import { useState } from "react";
import { useTick } from '@pixi/react';
import { GameProps, Universe, vec2 } from "../utils/Types";
import Keyboard from 'pixi.js-keyboard';

import Asteroid from "./Asteroid";
import Bullet from "./Bullet";

const SHIP_SPEED: number = 0.05;
const BULLET_SPEED: number = 10;


let universe: Universe;

export default function Game({ player, screen, count, setLevel, setScore}: GameProps) {
  const [render, setRender] = useState(0);
  useTick(delta => {
    setRender(render+1);
    if (universe != null) {
      if (universe.asteroids.length == 0) {
        universe.level++
        setLevel(universe.level);
        for (let i = 0; i < count; i++) {
          universe.asteroids.push(new Asteroid(new vec2(Math.random()*screen.x, Math.random()*screen.y), new vec2((Math.random()-0.5)*0.75, (Math.random()-0.5)*0.75), (Math.random()*10)+5));
        }
      }
      if (player) {
        Keyboard.update();
        if (Keyboard.isKeyDown('ArrowUp', 'KeyW')) {
          universe.ship.addVel(new vec2(SHIP_SPEED*Math.sin(-universe.ship.r* Math.PI/180), SHIP_SPEED*Math.cos(-universe.ship.r* Math.PI/180)), delta);
          //if (Math.abs(universe[0].vel.x) > 1) universe[0].vel.x = universe[0].vel.x > 0?1:-1;
          //if (Math.abs(universe[0].vel.y) > 1) universe[0].vel.y = universe[0].vel.y > 0?1:-1;
        }
        if (Keyboard.isKeyDown('ArrowLeft', 'KeyA')) {
          universe.ship.addRot(-3);
        }
        if (Keyboard.isKeyDown('ArrowRight', 'KeyD')) {
          universe.ship.addRot(3);
        }
        if (Keyboard.isKeyDown('Space')) {
          if (render%12==0) universe.bullets.push(new Bullet(new vec2(universe.ship.pos.x, universe.ship.pos.y), new vec2(BULLET_SPEED*Math.sin(-universe.ship.r* Math.PI/180), BULLET_SPEED*Math.cos(-universe.ship.r* Math.PI/180)), 1))
        }
      }
      if (player) universe.ship.move(delta, universe);
      universe.asteroids.forEach(v => {
        universe = v.move(delta, universe);
      })
      setScore(universe.score);
      universe.bullets.forEach((v) => {
        if (v.pos.x > screen.x || v.pos.x < 0 || v.pos.y > screen.y || v.pos.y < 0) return universe?.bullets.splice(universe.bullets.indexOf(v), 1)
        v.move(delta, universe);
      })
    }
  })
  if (universe == null ) {
    universe = new Universe(screen);
  }
  return [...universe.asteroids.map((v, i) => v.draw(screen, i+1)), ...universe.bullets.map((v, i) => v.draw(screen, i+2)), player?universe.ship.draw(screen):undefined];
}