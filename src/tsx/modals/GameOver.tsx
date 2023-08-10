import Modal from "react-modal";
import { ScoreProp } from "../utils/Types";
import { ChangeEvent, useEffect, useState } from "react";
import { callAPI, sortScores } from "../utils/Functions";

export default function GameOver({
  modalOpen,
  curData,
}: {
  modalOpen: boolean;
  closeModal: () => void;
  curData: ScoreProp;
}) {
  const [data, setData] = useState<ScoreProp[]>();
  const [hs, setHS] = useState(false);
  const [n, setN] = useState('');
  const [hsd, setHSD] = useState(false);
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setN(e.target.value);
    curData.name = n;
  }
  const submitName = () => {
    callAPI("/scores", "POST", {...curData}).then((res: { scores: ScoreProp[] }) => {
      setData(sortScores(res.scores));
      setHSD(true);
      setHS(false);
    });
  }
  useEffect(() => {
    callAPI("/scores", "GET").then((res: { scores: ScoreProp[] }) => {
      setData(sortScores(res.scores));
    });
    setHS(data?.filter((v) => v.score < curData.score).length != 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curData.score]);
  return (
    <Modal
      closeTimeoutMS={250}
      isOpen={modalOpen}
      className="flex flex-col m-auto bg-neutral-800 my-20 w-fit p-2 px-4 text-center outline-none text-neutral-200 rounded opacity-100 outline-double outline-8 outline-white"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-80"
      ariaHideApp={false}
    >
      <p className="align-middle justify-center m-auto mb-5 pt-5 bg-transparent rounded animate-bouncepulse text-6xl">
        Game Over!
      </p>
      {hs ? (
        <div>
          <p className="align-middle justify-center m-auto mb-5 bg-transparent rounded-xl animate-bouncepulse text-2xl">
            High Score!
          </p>
          <div className='flex flex-col'>
          <input className='justify-center m-auto text-neutral-200 placeholder:text-neutral-400 bg-neutral-900 outline-double rounded focus:outline-double focus:outline-white py-1 text-center w-1/2' placeholder='Enter a username' value={n} onChange={handleTextChange} />
          <button className='className="text-2xl m-auto justify-center align-middle text-center my-5 py-2 px-6 outline-double outline-4 hover:animate-colorpulse bg-opacity-50 rounded hover:cursor-pointer bg-black' onClick={submitName}>Submit</button>
          </div>
        </div>
      ) : hsd? <p className='animate-colorpulse'>Submited!</p> :(
        <></>
      )}
      <table className="justify-center m-auto table-auto">
        <thead>
          <tr>
            <th></th>
            <th className="text-3xl text-center py-4">High Scores</th>
            <th></th>
          </tr>
          <tr>
            <th>Rank</th>
            <th>Score</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((score, i) => {
            return <tr key={i} className="text-center">
              <td>{i + 1}</td>
              <td>{score.score}</td>
              <td>{score.name}</td>
            </tr>
        })}
        </tbody>
      </table>
      <button
        onClick={() => window.location.reload()}
        className="text-4xl m-auto justify-center align-middle text-center my-5 py-3 px-10 outline-double outline-4 hover:animate-colorpulse bg-opacity-50 rounded hover:cursor-pointer bg-black"
      >
        Play Again
      </button>
    </Modal>
  );
}
