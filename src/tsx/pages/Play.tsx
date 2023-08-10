import { useState } from "react";
import Transitions from "../utils/Transitions";
import { Stage } from "@pixi/react";
import { useWindowDimension } from "../utils/useWindowDimension";
import Game from "../objects/Game";
import { vec2 } from "../utils/Types";
import GameOver from "../modals/GameOver";

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
  }
  return (
    <Transitions>
      <p className="absolute top-0 left-0 p-5 text-4xl text-neutral-300 bg-transparent">
        Score: {score}
      </p>
      <p className="absolute top-0 right-0 p-5 text-4xl text-neutral-300 bg-transparent">
        Level: {level}
      </p>
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x000 }}
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
      </Stage>
      {done ? (
        <GameOver modalOpen={gameModal} closeModal={closeGameModal} curData={{name: '', level, score}}/>
      ) : (
        <></>
      )}
    </Transitions>
  );
}
