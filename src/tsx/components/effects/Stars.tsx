import { Stage } from "@pixi/react";
import { vec2 } from "../../utils/Types";
import { useWindowDimension } from "../../utils/useWindowDimension";
import Game from "../game/Game";

export default function Stars() {
  const [width, height] = useWindowDimension();
  return (
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
        background
      />
    </Stage>
  );
}
