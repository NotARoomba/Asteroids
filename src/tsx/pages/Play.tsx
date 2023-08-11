import { useState } from "react";
import Transitions from "../utils/Transitions";
import { Stage } from "@pixi/react";
import { useWindowDimension } from "../utils/useWindowDimension";
import Game from "../objects/Game";
import { vec2 } from "../utils/Types";
import GameOver from "../modals/GameOver";
import {isMobile} from 'react-device-detect';
import { Link } from "react-router-dom";

export default function Play() {
  const [width, height] = useWindowDimension();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [done, setDone] = useState(false);
  const [gameModal, setGameModal] = useState(false);
  const sLevel = (l: number) => {
    setLevel(l);
  };
  const sScore = (n: number) => {
    setScore(n);
  };
  const gameOver = () => {
    if (!done) {
      setGameModal(true);
      setDone(true);
    }
  };
  const closeGameModal = () => {
    setGameModal(false);
  };
  if (isMobile) return <div className="flex items-center flex-col text-neutral-200 justify-center m-auto h-screen"><p className="animate-colorpulse">Mobile is not supported :(</p><Link
  to="/"
  className="text-xl justify-center align-middle text-center mt-10 py-2 px-8 outline-double outline-4 hover:animate-colorpulse bg-opacity-90 bg-black"
>
  Home
</Link></div>
  return (
    <Transitions>
      <p className="absolute top-0 left-0 p-5 text-3xl text-neutral-300 bg-transparent">
        Score: {score}
      </p>
      <p className="absolute top-5 left-1/2 transform -translate-x-1/2 text-sm text-neutral-300">Use [W] to go forward, [A, D] to steer, and [Space] to shoot!</p>
      <p className="absolute top-0 right-0 p-5 text-3xl text-neutral-300 bg-transparent">
        Level: {level}
      </p>
      {level!=-1?<Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x000, clearBeforeRender: true }}
        className="absolute -z-50 w-screen h-screen top-0 left-1/2 right-1/2 -translate-x-1/2"
      >
        <Game
          count={4}
          screen={new vec2(width, height)}
          player={true}
          setScore={sScore}
          setLevel={sLevel}
          gameOver={gameOver}
        />
      </Stage>:<></>}
      {done ? (
        <GameOver
          modalOpen={gameModal}
          closeModal={closeGameModal}
          curData={{ name: "", level, score }}
        />
      ) : (
        <></>
      )}
    </Transitions>
  );
}
