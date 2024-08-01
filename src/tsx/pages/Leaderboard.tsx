import { useEffect, useState } from "react";
import { callAPI, sortScores } from "../utils/Functions";
import Transitions from "../components/effects/Transitions";
import { GAMES, HighScoreProp, STATUS_CODES } from "../utils/Types";
import { Link } from "react-router-dom";
import LoadingScreen from "../components/effects/LoadingScreen";
import Stars from "../components/effects/Stars";
import AlertModal from "../components/modals/AlertModal";

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<HighScoreProp[]>();
  const [alertModal, setAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string[]>(["", ""]);
  const setAlert = (msg: string, title?: string) => {
    title ? setAlertMsg([title, msg]) : setAlertMsg(["Error", msg]);
    setAlertModal(true);
  };
  useEffect(() => {
    callAPI(`/games/${GAMES.ASTEROIDS}/highscores`, "GET").then((res) => {
      if (res.status !== STATUS_CODES.SUCCESS) {
        setLoading(false);
        return setAlert("There was an error fetching the highscores!");
      }
      setScores(sortScores(res.highscores));
      setLoading(false);
    });
  }, []);
  return (
    <Transitions>
      <Stars />
      <div className="flex flex-col text-neutral-300 justify-center">
        <p className="text-2xl sm:text-4xl w-min md:w-max md:text-4xl mt-8 align-middle justify-center m-auto mb-10 py-2 px-8 bg-black rounded animate-colorpulse bg-opacity-90">
          High Score Leaderboard
        </p>
        <Link
          to="/"
          className="text-xl m-auto justify-center align-middle text-center mb-10 py-2 px-8 outline-double outline-4 hover:animate-colorpulse bg-opacity-90 bg-black"
        >
          Home
        </Link>
        <table className="justify-around m-auto w-[85vw] table-fixed bg-black bg-opacity-90">
          <thead>
            <tr className="py-8 text-xl md:text-2xl">
              <th>Rank</th>
              <th>Score</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {scores?.map((score, i) => {
              return (
                <tr key={i} className="py-8 text-center break-words">
                  <td className="py-2">{i + 1}</td>
                  <td>{score.score}</td>
                  <td>{score.username}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <AlertModal
        title={alertMsg[0]}
        text={alertMsg[1]}
        isOpen={alertModal}
        setIsOpen={setAlertModal}
      />
      <LoadingScreen loading={loading} />
    </Transitions>
  );
}
