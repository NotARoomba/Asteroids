import { Point, Graphics as G } from "pixi.js";
import { Graphics } from "@pixi/react";
import { Universe, vec2 } from "../utils/Types";
import { makeCopy } from "../utils/Functions";

export default class GameObject {
    pos: vec2;
    vel: vec2
    s: number;
    r: number
    points: Point[];
    altPoints: Point[];
    constructor(position: vec2, velocity: vec2, size: number) {
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
        return universe;
    }
    addVel(v: vec2, dt: number) {
        this.vel.x += v.x*dt;
        this.vel.y += v.y*dt;
    }
    addRot(rot: number) {
        this.r += rot;
    }
    draw(screen: vec2, i: number = 1) {
        const x: number = this.pos.x;
        const y: number = this.pos.y;
        const points: Point[] = ([new Point(x, y), new Point((x + 2), y - 1), new Point(x + 3, y + 1), new Point(x + 4, y + 3), new Point(x + 2, y + 5), new Point(x + 2, y + 6), new Point(x + 3, y + 7), new Point(x - 1, y + 9), new Point(x - 3, y + 7), new Point(x - 4, y + 8), new Point(x - 6, y + 7), new Point(x - 6, y + 4), new Point(x - 5, y + 2), new Point(x - 5, y - 0), new Point(x - 3, y + 1), new Point(x - 3, y - 1), new Point(x, y) ].map(v => new Point(((v.x-x)*this.s)+x, ((v.y-y)*this.s)+y)))
        const altPoints = makeCopy(points, screen)
        const draw = ((g: G) => {
            g.clear()
            g.lineStyle(2, '#ffffff')
            g.drawPolygon(points)
        })
        const altDraw = ((g: G) => {
            g.clear()
            g.lineStyle(2, '#f0d56f')
            g.drawPolygon(altPoints)
        })
        this.points = points;
        this.altPoints = altPoints;
        this.pos.x = ((points[0].x < 0) || (points[0].x >screen.x) || (points[0].y < 0) || (points[0].y >screen.y)) ? altPoints[0].x : points[0].x;
        this.pos.y = ((points[0].x < 0) || (points[0].x >screen.x) || (points[0].y < 0) || (points[0].y >screen.y)) ? altPoints[0].y : points[0].y;
        return [<Graphics key={i*Math.random()*1000} draw={draw} />, <Graphics key={i*Math.random()*1000} draw={altDraw} />]
    }
}

