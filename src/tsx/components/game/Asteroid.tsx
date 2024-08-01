import { pointIsInPoly } from "../../utils/Functions";
import { Universe, vec2 } from "../../utils/Types";
import GameObject from "./GameObject";

export default class Asteroid extends GameObject {
  super(position: vec2, velocity: vec2, size: number) {
    this.pos = position;
    this.vel = velocity;
    this.s = size;
    this.r = Math.random() * 360;
    this.points = [];
    this.altPoints = [];
  }
  move(dt: number, universe: Universe) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    for (let i = 0; i < universe.bullets.length; i++) {
      if (
        pointIsInPoly(universe.bullets[i].pos, this.points) ||
        pointIsInPoly(universe.bullets[i].pos, this.altPoints)
      ) {
        if (this.s > 5) {
          universe.asteroids.push(
            new Asteroid(
              new vec2(
                this.pos.x + Math.random() * 10,
                this.pos.y + Math.random() * 10,
              ),
              new vec2(
                (Math.random() - 0.5) * 0.75,
                (Math.random() - 0.5) * 0.75,
              ),
              this.s / 2,
            ),
          );
          universe.asteroids.push(
            new Asteroid(
              new vec2(
                this.pos.x + Math.random() * 10,
                this.pos.y + Math.random() * 10,
              ),
              new vec2(
                (Math.random() - 0.5) * 0.75,
                (Math.random() - 0.5) * 0.75,
              ),
              this.s / 2,
            ),
          );
        } else {
          universe.score += 0;
        }
        universe.score += parseInt(((5 / this.s) * 10).toFixed(0));
        universe.asteroids.splice(universe.asteroids.indexOf(this), 1);
        universe.bullets.splice(
          universe.bullets.indexOf(universe.bullets[i]),
          1,
        );
        break;
      }
    }
    for (let l = 0; l < universe.ship.points.length; l++) {
      if (
        pointIsInPoly(universe.ship.points[l], this.points) ||
        pointIsInPoly(universe.ship.points[l], this.altPoints)
      ) {
        universe.done = true;
      }
    }
    return universe;
  }
}
