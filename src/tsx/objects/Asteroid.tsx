import { checkifPointIsInsidePolygon } from "../utils/Functions";
import { Universe, vec2 } from "../utils/Types";
import GameObject from "./GameObject";

export default class Asteroid  extends GameObject {
    super(position: vec2, velocity: vec2, size: number) {
        this.pos = position;
        this.vel = velocity;
        this.s = size;
        this.r = Math.random()*360;
        this.points = [];
        this.altPoints = [];
    }
    move(dt: number, universe: Universe) {
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
        for (let i = 0; i < universe.bullets.length; i++) {
            if (checkifPointIsInsidePolygon(universe.bullets[i].pos, this.points) || checkifPointIsInsidePolygon(universe.bullets[i].pos, this.altPoints)) {
                if (this.s > 6) {
                    universe.asteroids.push(new Asteroid(this.pos, new vec2((Math.random()-0.5)*0.75, (Math.random()-0.5)*0.75), this.s/2))
                    universe.asteroids.push(new Asteroid(this.pos, new vec2((Math.random()-0.5)*0.75, (Math.random()-0.5)*0.75), this.s/2))
                }
                universe.score+=parseInt(((5/this.s)*10).toFixed(0));
                universe.asteroids.splice(universe.asteroids.indexOf(this), 1);
                universe.bullets.splice(universe.bullets.indexOf(universe.bullets[i]), 1);
                break;
            } 
        }
        return universe;
    }
}

