import { Point } from "pixi.js";
import { vec2 } from "./Types";

export function makeCopy(points: Point[], screen: vec2) {
	const altPoints: Point[] = points.map(point => point.clone());
    for (let i = 0; i < points.length; i++) {
		if (points[i].x < 0) {
			altPoints[i].x = screen.x + points[i].x;
			const diff: vec2 = new vec2(points[i].x - altPoints[i].x, points[i].y - altPoints[i].y);
			for (let j = 0; j < points.length; j++)
			{
				altPoints[j].x = points[j].x - diff.x;
				altPoints[j].y = points[j].y - diff.y;
			}
		}
		else if (points[i].x > screen.x) {
			altPoints[i].x = points[i].x - screen.x;
			const diff: vec2 = new vec2(points[i].x - altPoints[i].x, points[i].y - altPoints[i].y);
			for (let j = 0; j < points.length; j++)
			{
				altPoints[j].x = points[j].x - diff.x;
				altPoints[j].y = points[j].y - diff.y;
			}
		}
		else if (points[i].y < 0) {
			altPoints[i].y = screen.y + points[i].y;
			const diff: vec2 = new vec2(points[i].x - altPoints[i].x, points[i].y - altPoints[i].y);
			for (let j = 0; j < points.length; j++)
			{
				altPoints[j].x = points[j].x - diff.x;
				altPoints[j].y = points[j].y - diff.y;
			}
		}
		else if (points[i].y > screen.y) {
			altPoints[i].y = points[i].y - screen.y;
			const diff: vec2 = new vec2(points[i].x - altPoints[i].x, points[i].y - altPoints[i].y);
			for (let j = 0; j < points.length; j++)
			{
				altPoints[j].x = points[j].x - diff.x;
				altPoints[j].y = points[j].y - diff.y;
			}
		}

	}
    return altPoints;
}

export function checkifPointIsInsidePolygon(point: vec2, pointsOfPolygon: Point[]) {
	let i = 0, j = 0;
	let c: boolean = false;
	for (i = 0, j = pointsOfPolygon.length - 1; i < pointsOfPolygon.length; j = i++) {
		if (((pointsOfPolygon[i].y > point.y) != (pointsOfPolygon[j].y > point.y)) &&
			(point.x < (pointsOfPolygon[j].x - pointsOfPolygon[i].x) * (point.y - pointsOfPolygon[i].y) / (pointsOfPolygon[j].y - pointsOfPolygon[i].y) + pointsOfPolygon[i].x))
			c = !c;
	}
	return c;
}

