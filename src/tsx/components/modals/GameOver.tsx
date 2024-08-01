import Modal from "react-modal";
import {
  GAMES,
  HighScoreProp,
  ScoreProp,
  STATUS_CODES,
  User,
} from "../../utils/Types";
import { useEffect, useState } from "react";
import {
  callAPI,
  checkIfLogin,
  getCookie,
  sortScores,
} from "../../utils/Functions";
import { Link } from "react-router-dom";
import AlertModal from "./AlertModal";
import LoadingScreen from "../effects/LoadingScreen";

export default function GameOver({
  modalOpen,
  curData,
}: {
  modalOpen: boolean;
  closeModal: () => void;
  curData: ScoreProp;
}) {
  const [highscores, setHighscores] = useState<HighScoreProp[]>([]);
  const [user, setUser] = useState<User>();
  const [hs, setHS] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string[]>(["", ""]);
  const setAlert = (msg: string, title?: string) => {
    title ? setAlertMsg([title, msg]) : setAlertMsg(["Error", msg]);
    setAlertModal(true);
  };

  useEffect(() => {
    //first update user then get high scores
    setLoading(true);
    checkIfLogin().then((u: User | false) => {
      if (u) {
        setUser(u);
        callAPI("/games/update", "POST", {
          userID: u._id,
          type: GAMES.ASTEROIDS,
          game: {
            level: curData.level,
            score: curData.score,
          },
        }).then(() => {
          callAPI(`/games/${GAMES.ASTEROIDS}/highscores`, "GET").then((res) => {
            if (res.status !== STATUS_CODES.SUCCESS) {
              setLoading(false);
              return setAlert("There was an error fetching the highscores!");
            }
            const scores = sortScores(res.highscores);
            setHighscores(scores);
            setHS(scores.filter((v) => v.score < curData.score).length != 0);
            setLoading(false);
          });
        });
      } else {
        callAPI(`/games/${GAMES.ASTEROIDS}/highscores`, "GET").then((res) => {
          if (res.status !== STATUS_CODES.SUCCESS) {
            setLoading(false);
            return setAlert("There was an error fetching the highscores!");
          }
          setHighscores(res.highscores);
          setLoading(false);
        });
      }
    });
  }, [curData.score]);
  return (
    <Modal
      closeTimeoutMS={250}
      isOpen={modalOpen}
      className="flex flex-col transition-opacity m-auto bg-neutral-800 my-20 w-fit p-2 px-4 text-center outline-none text-neutral-200 opacity-100 outline-double outline-8 outline-white"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-80 transition-opacity"
      ariaHideApp={false}
    >
      <p className="align-middle justify-center m-auto mb-5 pt-5 bg-transparent rounded animate-bouncepulse text-6xl">
        Game Over!
      </p>
      {hs && user ? (
        <p className="align-middle justify-center m-auto mb-5 bg-transparent rounded-xl animate-bouncepulse text-2xl">
          High Score!
        </p>
      ) : (
        <p className="text-2xl animate-colorpulse">
          Your Score: {curData.score}
        </p>
      )}
      <div className="flex flex-col w-3/4 mx-auto">
        {!user ? (
          <>
            <p
              className={
                "justify-center mx-auto w-full text-neutral-200 placeholder:text-neutral-400 py-1 text-center "
              }
            >
              Login or sign up save your score!
            </p>
            <div className="flex text-lg font-bold justify-center text-center px-10 mt-4 gap-4 w-full">
              <div className="flex justify-center gap-4 w-fit mx-auto">
                <Link
                  className={
                    "justify-center text-neutral-200 placeholder:text-neutral-400 bg-neutral-900 outline-double rounded  py-1 text-center px-10 hover:animate-colorpulse"
                  }
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className={
                    "justify-center  text-neutral-200 placeholder:text-neutral-400 bg-neutral-900 outline-double rounded focus:outline-double focus:outline-white py-1 text-center px-10 text-nowrap hover:animate-colorpulse"
                  }
                  to="/signup"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col justify-around text-center">
        <p className="text-3xl text-center py-4">High Scores</p>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Score</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {highscores?.map((score, i) => {
              if (i > 4) return;
              return (
                <tr key={i} className="text-center">
                  <td
                    className={
                      score.username == user?.username &&
                      score.score == curData.score
                        ? "animate-bouncepulse"
                        : ""
                    }
                  >
                    {i + 1}
                  </td>
                  <td
                    className={
                      score.username == user?.username &&
                      score.score == curData.score
                        ? "animate-bouncepulse"
                        : ""
                    }
                  >
                    {score.score}
                  </td>
                  <td
                    className={
                      score.username == user?.username &&
                      score.score == curData.score
                        ? "animate-bouncepulse"
                        : ""
                    }
                  >
                    {score.username}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 my-3">
        <button
          onClick={() => window.location.reload()}
          className="text-xl m-auto justify-center align-middle text-center  py-3 px-10 outline-double outline-4 hover:animate-colorpulse bg-opacity-50 hover:cursor-pointer bg-black"
        >
          Play Again
        </button>
        {getCookie("userID") && (
          <Link
            to="/profile"
            className="text-xl m-auto justify-center align-middle text-center  py-3 px-10 outline-double outline-4 hover:animate-colorpulse bg-opacity-50 hover:cursor-pointer bg-black"
          >
            Profile
          </Link>
        )}
        <Link
          to="/leaderboard"
          className="text-xl m-auto justify-center align-middle text-center  py-3 px-10 outline-double outline-4 hover:animate-colorpulse bg-opacity-50 hover:cursor-pointer bg-black"
        >
          Leaderboard
        </Link>
      </div>
      <AlertModal
        title={alertMsg[0]}
        text={alertMsg[1]}
        isOpen={alertModal}
        setIsOpen={setAlertModal}
      />
      <LoadingScreen loading={loading} />
    </Modal>
  );
}
