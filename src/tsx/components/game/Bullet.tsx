import { Point, Graphics as G } from "pixi.js";
import { Graphics } from "@pixi/react";
import { vec2 } from "../../utils/Types";
import GameObject from "./GameObject";

export default class Bullet extends GameObject {
  super(position: vec2, velocity: vec2, size: number) {
    this.pos = position;
    this.vel = velocity;
    this.s = size;
    this.r = 0;
  }
  draw(_screen: vec2, i: number = 1) {
    const x: number = this.pos.x;
    const y: number = this.pos.y;
    const points: Point[] = [
      new Point(x, y),
      new Point(x + 2, y - 2),
      new Point(x + 2, y - 2),
      new Point(x + 2, y - 2),
      new Point(x + 2, y + 2),
      new Point(x, y),
    ].map((v) => new Point((v.x - x) * this.s + x, (v.y - y) * this.s + y));
    const draw = (g: G) => {
      g.clear();
      g.lineStyle(2, "#ffffff");
      g.drawPolygon(points);
    };
    return [<Graphics key={i * Math.random() * 1000} draw={draw} />];
  }
}
