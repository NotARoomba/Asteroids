import { Point, Graphics as G } from "pixi.js";
import { Graphics } from "@pixi/react";
import { vec2 } from "../utils/Types";
import GameObject from "./GameObject";
import { makeCopy } from "../utils/Functions";

export default class Player extends GameObject {
    super(position: vec2, velocity: vec2, size: number) {
        this.pos = position;
        this.vel = velocity;
        this.s = size;
        this.r = 0;
        this.points = [];
        this.altPoints = [];
    }
    draw(screen: vec2, i: number = 1) {
        const x: number = this.pos.x;
        const y: number = this.pos.y;
        const points: Point[] = ([new Point(x, y), new Point(x + 8, y - 30), new Point(x, y - 20), new Point(x - 8, y - 30), new Point(x, y)].map(v => new Point(((v.x-x)*this.s)+x, ((v.y-y)*this.s)+y)))
        const altPoints = makeCopy(points, screen)
        const draw = ((g: G) => {
            g.clear()
            g.position = {x, y};
            g.pivot = new Point(x, y);
            g.angle = this.r;
            g.lineStyle(2, '#ffffff')
            g.drawPolygon(points)
        })
        const altDraw = ((g: G) => {
            g.clear()
            g.position = altPoints[0];
            g.pivot = altPoints[0];
            g.angle = this.r;
            g.lineStyle(2, '#ffffff')
            g.drawPolygon(altPoints)
        })
        this.points = points;
        this.altPoints = altPoints;
        this.pos.x = ((points[0].x < 0) || (points[0].x >screen.x) || (points[0].y < 0) || (points[0].y >screen.y)) ? altPoints[0].x : points[0].x;
        this.pos.y = ((points[0].x < 0) || (points[0].x >screen.x) || (points[0].y < 0) || (points[0].y >screen.y)) ? altPoints[0].y : points[0].y;
        return [<Graphics key={i*Math.random()*1000} draw={draw} />, <Graphics key={i*Math.random()*1000} draw={altDraw} />]
    }
}

