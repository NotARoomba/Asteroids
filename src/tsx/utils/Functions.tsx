import { Point } from "pixi.js";
import { HighScoreProp, STATUS_CODES, User, vec2 } from "./Types";
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

const API_URL = "https://api.notaroomba.dev";

export async function callAPI(
  endpoint: string,
  method: string,
  body: object = {},
) {
  const time = Date.now().toString();
  const data = JSON.stringify(body);
  const digest = Crypto.enc.Hex.stringify(
    Crypto.HmacSHA256(
      time + method + endpoint + Crypto.MD5(data).toString(),
      Math.floor(Date.now() / (60 * 1000)).toString(),
    ),
  );
  const hmac = `HMAC ${time}:${digest}`;
  try {
    return method === "POST"
      ? await (
          await fetch(API_URL + endpoint, {
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
          await fetch(API_URL + endpoint, {
            method: method,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: hmac,
            },
          })
        ).json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (!error.response) {
      alert(
        "We couldn't connect to the server! Please check your internet connection.",
      );
      return { status: STATUS_CODES.NO_CONNECTION };
    }
    return {
      status: STATUS_CODES.GENERIC_ERROR,
    };
  }
}

export function sortScores(scores: HighScoreProp[], top: boolean = true) {
  scores.sort((a: HighScoreProp, b: HighScoreProp) => b.score - a.score);
  if (scores.length < 5)
    scores = scores.concat(
      Array(5 - scores.length).fill({
        username: "Unknown",
        score: 0,
        level: 0,
      }),
    );
  return top ? scores.slice(0, 5) : scores;
}

export async function checkIfLogin(): Promise<false | User> {
  const userID = getCookie("userID");
  if (!userID) return false;
  const validUser = await callAPI(`/users/${userID}`, "GET");
  if (validUser.status === STATUS_CODES.USER_NOT_FOUND) {
    setCookie("userID", null);
    return false;
  }
  return validUser.user;
}

export function convertToBase64(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export function setCookie(key: string, value: string | null) {
  const expires = new Date();
  expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
  document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();
}
export function deleteCookies() {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}
export function getCookie(key: string) {
  const keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  return keyValue ? keyValue[2] : null;
}
