import { Stage } from "@pixi/react";
import { Link } from "react-router-dom";
import { useWindowDimension } from "../utils/useWindowDimension";
import Game from "../objects/Game.js";
import Transitions from "../utils/Transitions.js";
import { vec2 } from "../utils/Types.js";

export default function Home() {
  const [width, height] = useWindowDimension();
  return (
    <Transitions>
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x000 }}
        className="absolute -z-50 w-screen h-screen top-0 left-1/2 right-1/2 -translate-x-1/2"
      >
        <Game
          key={Math.random()}
          count={25}
          screen={new vec2(width, height)}
          player={false}
          setScore={() => 1}
          setLevel={() => 1}
          gameOver={() => 1}
        />
      </Stage>
      <div className="flex flex-col h-screen text-8xl bg-transparent text-neutral-200 ">
        <p className="align-middle justify-center m-auto mb-10 bg-black rounded animate-bouncepulse bg-opacity-50">
          Asteroids
        </p>
        <Link
          to="/play"
          className="text-4xl m-auto justify-center align-middle text-center mt-5 py-4 px-10 mb-5 outline-double outline-4 hover:animate-colorpulse bg-opacity-80 bg-black"
        >
          Play
        </Link>
        <Link
          to="/leaderboard"
          className="text-4xl m-auto justify-center align-middle text-center mt-5 py-4 px-10 outline-double outline-4 hover:animate-colorpulse bg-opacity-80 bg-black"
        >
          Leaderboard
        </Link>
      </div>
    </Transitions>
  );
}
