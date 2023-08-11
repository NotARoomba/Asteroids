import { useEffect, useState } from "react";
import { Graphics, useTick } from "@pixi/react";
import { GameProps, KeyProp, Universe, vec2 } from "../utils/Types";

import Asteroid from "./Asteroid";
import Bullet from "./Bullet";

const SHIP_SPEED: number = 0.05;
const BULLET_SPEED: number = 10;

let universe: Universe;

export default function Game({
  player,
  screen,
  count,
  setLevel,
  setScore,
  gameOver,
}: GameProps) {
  const [keys, setKeys] = useState<KeyProp>({
    forward: false,
    space: false,
    left: false,
    right: false,
  });
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.key == " ") {
        setKeys({ ...keys, space: true });
      }
      if (event.key == "w") {
        setKeys({ ...keys, forward: true });
      }
      if (event.key == "a") {
        setKeys({ ...keys, left: true });
      }
      if (event.key == "d") {
        setKeys({ ...keys, right: true });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.key == " ") {
        setKeys({ ...keys, space: false });
      }
      if (event.key == "w") {
        setKeys({ ...keys, forward: false });
      }
      if (event.key == "a") {
        setKeys({ ...keys, left: false });
      }
      if (event.key == "d") {
        setKeys({ ...keys, right: false });
      }
    };
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    return () => {
      document.onkeydown = null;
      document.onkeyup = null;
    };
  }, [keys]);
  const [render, setRender] = useState(0);
  if (universe == null) {
    universe = new Universe(screen);
  }
  useTick((delta) => {
    setRender(render + 1);
    if (!universe.done || !player) {
      //stupid react
      if ((universe.score == 0 && universe.level >= 1 && universe.asteroids.length > 10 && player)||(!player && universe.ship.vel.x!=0)) universe = new Universe(screen);
      if (universe.asteroids.length == 0) {
        universe.level++;
        setLevel(universe.level);
        for (let i = 0; i < count + (universe.level*2); i++) {
          const ap: vec2 = new vec2(0, 0);
          let size: number = 0;
          do {
            ap.x = Math.random() * screen.x;
            ap.y = Math.random() * screen.y;
            size = Math.random() * 12 + 5;
          } while (
            Math.sqrt(
              Math.pow(ap.x - universe.ship.pos.x, 2) +
                Math.pow(ap.y - universe.ship.pos.y, 2),
            ) +
              size <
            200
          );
          universe.asteroids.push(
            new Asteroid(
              ap,
              new vec2(
                (Math.random() - 0.5) * 0.75,
                (Math.random() - 0.5) * 0.75,
              ),
              size,
            ),
          );
        }
      }
      let moved: boolean = false;
      if (player) {
        if (keys.forward == true) {
          universe.ship.addVel(
            new vec2(
              SHIP_SPEED * Math.sin((-universe.ship.r * Math.PI) / 180),
              SHIP_SPEED * Math.cos((-universe.ship.r * Math.PI) / 180),
            ),
            delta,
          );
          moved = moved ? moved : true;
          //if (Math.abs(universe[0].vel.x) > 1) universe[0].vel.x = universe[0].vel.x > 0?1:-1;
          //if (Math.abs(universe[0].vel.y) > 1) universe[0].vel.y = universe[0].vel.y > 0?1:-1;
        }
        if (keys.left) {
          universe.ship.addRot(-2);
        }
        if (keys.right) {
          universe.ship.addRot(2);
        }
        if (keys.space) {
          universe.bullets.push(
            new Bullet(
              new vec2(universe.ship.pos.x, universe.ship.pos.y),
              new vec2(
                BULLET_SPEED * Math.sin((-universe.ship.r * Math.PI) / 180),
                BULLET_SPEED * Math.cos((-universe.ship.r * Math.PI) / 180),
              ),
              1,
            ),
          );
          setKeys({ ...keys, space: false });
        }
      }
      if (player) universe.ship.move(delta, universe);
      if (!moved) {
        universe.ship.isMoving = false;
        moved = false;
      }
      universe.asteroids.forEach((v) => {
        v.move(delta, universe);
      });
      setScore(universe.score);
      universe.bullets.forEach((v) => {
        if (
          v.pos.x > screen.x ||
          v.pos.x < 0 ||
          v.pos.y > screen.y ||
          v.pos.y < 0
        )
          return universe?.bullets.splice(universe.bullets.indexOf(v), 1);
        v.move(delta, universe);
      });
    } else {
      document.onkeydown = null;
      document.onkeyup = null;
      return gameOver();
      //return <>{universe.asteroids.map((v, i) => v.draw(screen, i+3))}<Text><p className="align-middle justify-center m-auto mb-10 bg-black rounded animate-bouncepulse bg-opacity-50">Game Over</p></Text></>
    }
  });
  return (
    <>
      {universe.asteroids.map((v, i) => v.draw(screen, i + 3))}
      {universe.bullets.map((v, i) => v.draw(screen, i + 2))}
      {player ? universe.ship.draw(screen) : <Graphics />}
    </>
  );
}
