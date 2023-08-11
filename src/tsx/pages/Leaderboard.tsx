import { useEffect, useState } from "react";
import { callAPI, sortScores } from "../utils/Functions";
import Transitions from "../utils/Transitions";
import { ScoreProp, vec2 } from "../utils/Types";
import { Stage } from "@pixi/react";
import Game from "../objects/Game";
import { useWindowDimension } from "../utils/useWindowDimension";
import { Link } from "react-router-dom";

export default function Leaderboard() {
    const [scores, setScores] = useState<ScoreProp[]>();
    const [width, height] = useWindowDimension();
    useEffect(() => {
        callAPI("/scores", "GET").then((res: { scores: ScoreProp[] }) => {
            setScores(sortScores(res.scores, false));
        });
      }, []);
    return <Transitions>
        <div className='flex flex-col text-neutral-300 justify-center'>
            <p className="text-2xl sm:text-4xl w-min md:w-max md:text-4xl mt-8 align-middle justify-center m-auto mb-10 py-2 px-8 bg-black rounded animate-colorpulse bg-opacity-90">High Score Leaderboard</p>
            <Link
          to="/"
          className="text-xl m-auto justify-center align-middle text-center mb-10 py-2 px-8 outline-double outline-4 hover:animate-colorpulse bg-opacity-90 bg-black"
        >
          Home
        </Link>
            <table className='justify-around m-auto w-[85vw] table-fixed bg-black bg-opacity-90'>
            <thead>
            <tr className="py-8 text-xl md:text-2xl">
                <th>Rank</th>
                <th>Score</th>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
            {scores?.map((score, i) => {
                return <tr key={i} className="py-8 text-center break-words">
                <td className="py-2">{i + 1}</td>
                <td>{score.score}</td>
                <td>{score.name}</td>
                </tr>
            })}
            </tbody>
        </table>
        </div>
        <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x000 }}
        className="absolute -z-50 w-screen h-screen top-0 left-1/2 right-1/2 -translate-x-1/2"
      >
        <Game
          count={25}
          screen={new vec2(width, height)}
          player={false}
          setScore={() => 1}
          setLevel={() => 1}
          gameOver={() => 1}
        />
      </Stage>
    </Transitions>
}