import { useState } from "react";
import Transitions from "../utils/Transitions";
import { Stage } from "@pixi/react";
import { useWindowDimension } from "../utils/useWindowDimension";
import Game from "../objects/Game";
import { vec2 } from "../utils/Types";

export default function Play() {
    const [width, height] = useWindowDimension();
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(0);
    const sLevel = (l: number) => {
        setLevel(l);
    }
    const sScore = (n: number) => {
        setScore(n);
    }
    return (
    <Transitions>
        <p className='absolute top-0 left-0 p-5 text-4xl text-neutral-300 bg-transparent'>Score: {score}</p>
        <p className='absolute top-0 right-0 p-5 text-4xl text-neutral-300 bg-transparent'>Level: {level}</p>
        <Stage width={width} height={height} options={{backgroundColor: 0x000}} className="absolute -z-50 w-screen h-screen top-0 left-1/2 right-1/2 -translate-x-1/2">
            <Game count={10} screen={new vec2(width, height)} player={true} setScore={sScore} setLevel={sLevel}/>
        </Stage>
    </Transitions>)
}