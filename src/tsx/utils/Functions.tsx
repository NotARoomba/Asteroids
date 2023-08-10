import { Point } from "pixi.js";
import { ScoreProp, vec2 } from "./Types";
import Crypto from "crypto-js";
import robustPointInPolygon from "robust-point-in-polygon";

export function makeCopy(points: Point[], screen: vec2) {
  const altPoints: Point[] = points.map((point) => point.clone());
  for (let i = 0; i < points.length; i++) {
    if (points[i].x < 0) {
      altPoints[i].x = screen.x + points[i].x;
      const diff: vec2 = new vec2(
        points[i].x - altPoints[i].x,
        points[i].y - altPoints[i].y,
      );
      for (let j = 0; j < points.length; j++) {
        altPoints[j].x = points[j].x - diff.x;
        altPoints[j].y = points[j].y - diff.y;
      }
    } else if (points[i].x > screen.x) {
      altPoints[i].x = points[i].x - screen.x;
      const diff: vec2 = new vec2(
        points[i].x - altPoints[i].x,
        points[i].y - altPoints[i].y,
      );
      for (let j = 0; j < points.length; j++) {
        altPoints[j].x = points[j].x - diff.x;
        altPoints[j].y = points[j].y - diff.y;
      }
    } else if (points[i].y < 0) {
      altPoints[i].y = screen.y + points[i].y;
      const diff: vec2 = new vec2(
        points[i].x - altPoints[i].x,
        points[i].y - altPoints[i].y,
      );
      for (let j = 0; j < points.length; j++) {
        altPoints[j].x = points[j].x - diff.x;
        altPoints[j].y = points[j].y - diff.y;
      }
    } else if (points[i].y > screen.y) {
      altPoints[i].y = points[i].y - screen.y;
      const diff: vec2 = new vec2(
        points[i].x - altPoints[i].x,
        points[i].y - altPoints[i].y,
      );
      for (let j = 0; j < points.length; j++) {
        altPoints[j].x = points[j].x - diff.x;
        altPoints[j].y = points[j].y - diff.y;
      }
    }
  }
  return altPoints;
}

export function pointIsInPoly(p: vec2, polygon: Point[]) {
  if (polygon.length == 0) return false;
  let minX = polygon[0].x,
    maxX = polygon[0].x;
  let minY = polygon[0].y,
    maxY = polygon[0].y;
  for (let n = 1; n < polygon.length; n++) {
    const q = polygon[n];
    minX = Math.min(q.x, minX);
    maxX = Math.max(q.x, maxX);
    minY = Math.min(q.y, minY);
    maxY = Math.max(q.y, maxY);
  }

  if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) return false;
  return (
    robustPointInPolygon(
      polygon.map((v) => [v.x, v.y]),
      [p.x, p.y],
    ) <= 0
  );
}

export function checkifPointIsInsidePolygon(
  point: vec2,
  pointsOfPolygon: Point[],
) {
  let i = 0,
    j = 0;
  let c: boolean = false;
  for (
    i = 0, j = pointsOfPolygon.length - 1;
    i < pointsOfPolygon.length;
    j = i++
  ) {
    if (
      pointsOfPolygon[i].y > point.y != pointsOfPolygon[j].y > point.y &&
      point.x <
        ((pointsOfPolygon[j].x - pointsOfPolygon[i].x) *
          (point.y - pointsOfPolygon[i].y)) /
          (pointsOfPolygon[j].y - pointsOfPolygon[i].y) +
          pointsOfPolygon[i].x
    )
      c = !c;
  }
  return c;
}

export function rotatePointsAndScale(
  points: Point[],
  angle: number,
  scale: number = 1,
) {
  //has gets the x, y of the first point
  const cx = points[0].x;
  const cy = points[0].y;
  angle += 180;
  for (let i = 1; i < points.length - 1; i++) {
    //gets the next point in the series
    const x = points[i].x;
    const y = points[i].y;
    //adds the original point to the original point and unknown cos and sin calc
    const x2 =
      cx +
      (x - cx) * scale * Math.cos((angle * Math.PI) / 180) -
      (cy - y) * scale * Math.sin((angle * Math.PI) / 180);
    const y2 =
      cy +
      (cy - y) * scale * Math.cos((angle * Math.PI) / 180) +
      (x - cx) * scale * Math.sin((angle * Math.PI) / 180);
    points[i] = new Point(x2, y2);
  }
  return points;
}

export async function callAPI(
  endpoint: string,
  method: string,
  body: object = {},
) {
  const API = "https://asteroids-api.notaroomba.xyz";
  const time = Date.now().toString();
  const data = JSON.stringify(body);
  const digest = Crypto.enc.Hex.stringify(
    Crypto.HmacSHA256(
      time + method + endpoint + Crypto.MD5(data).toString(),
      Math.floor(Date.now() / (30 * 1000)).toString(),
    ),
  );
  const hmac = `HMAC ${time}:${digest}`;
  return method === "POST"
    ? await (
        await fetch(API + endpoint, {
          method: method,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: hmac,
          },
          body: JSON.stringify(body),
        })
      ).json()
    : await (
        await fetch(API + endpoint, {
          method: method,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: hmac,
          },
        })
      ).json();
}

export function sortScores(scores: ScoreProp[]) {
  return scores
        .sort((a: ScoreProp, b: ScoreProp) => a.score - b.score)
        .concat(
          Array(5 - scores.length).fill({
            name: "Unknown",
            score: 0,
            level: 0,
          }),
        );
}