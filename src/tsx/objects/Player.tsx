import { Point, Graphics as G } from "pixi.js";
import { Graphics } from "@pixi/react";
import { Universe, vec2 } from "../utils/Types";
import GameObject from "./GameObject";
import { makeCopy, rotatePointsAndScale } from "../utils/Functions";

export default class Player extends GameObject {
  isMoving: boolean = false;
  super(position: vec2, velocity: vec2, size: number) {
    this.pos = position;
    this.vel = velocity;
    this.s = size;
    this.r = 0;
    this.points = [];
    this.altPoints = [];
  }
  move(dt: number, universe: Universe) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.isMoving = true;
    return universe;
  }
  draw(screen: vec2, i: number = 1) {
    const x: number = this.pos.x;
    const y: number = this.pos.y;
    const trail: Point[] = [
      new Point(x, y),
      new Point(x - 6, y - 24),
      new Point(x, y - 36),
      new Point(x + 6, y - 24),
      new Point(x, y),
    ];
    let points: Point[] = [
      new Point(x, y),
      new Point(x + 8, y - 32),
      new Point(x, y - 20),
      new Point(x - 8, y - 32),
    ];
    if (this.isMoving) points.push(...trail);
    else points.push(new Point(x, y));
    points = rotatePointsAndScale(points, this.r, this.s);
    const altPoints = makeCopy(points, screen);
    const draw = (g: G) => {
      g.clear();
      g.lineStyle(2, "#ffffff");
      g.drawPolygon(points);
    };
    const altDraw = (g: G) => {
      g.clear();
      g.lineStyle(2, "#ffffff");
      g.drawPolygon(altPoints);
    };
    this.points = points;
    this.altPoints = altPoints;
    this.pos.x =
      points[0].x < 0 ||
      points[0].x > screen.x ||
      points[0].y < 0 ||
      points[0].y > screen.y
        ? altPoints[0].x
        : points[0].x;
    this.pos.y =
      points[0].x < 0 ||
      points[0].x > screen.x ||
      points[0].y < 0 ||
      points[0].y > screen.y
        ? altPoints[0].y
        : points[0].y;
    return [
      <Graphics key={i * Math.random() * 1000} draw={draw} />,
      <Graphics key={i * Math.random() * 1000} draw={altDraw} />,
    ];
  }
}
