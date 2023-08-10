import Modal from 'react-modal';
import { ScoreProp } from '../utils/Types';
import { useEffect, useState } from 'react';
import { callAPI } from '../utils/Functions';

export default function GameOver({modalOpen, curData}: {modalOpen: boolean, closeModal: ()=>void, curData: ScoreProp}) {
    const [data, setData] = useState<ScoreProp[]>();
    const [hs, setHS] = useState(false);
    useEffect(() => {
        callAPI('/scores', 'GET').then((d: {scores: ScoreProp[]})=> {
            d.scores = d.scores.sort((a: ScoreProp, b: ScoreProp) => a.score-b.score).concat(Array(5-d.scores.length).fill({name: 'Unknown', score: 0, level: 0}))
            console.log(d)
            setData(d.scores)
        });
        setHS(data?.filter((v) => v.score<curData.score).length != 0)
    }, [curData])
    return <Modal closeTimeoutMS={250} isOpen={modalOpen} className='flex flex-col m-auto bg-neutral-800 my-20 w-fit p-2 px-4 text-center outline-none text-neutral-200 rounded opacity-100' overlayClassName='fixed top-0 left-0 right-0 bottom-0 bg-black opacity-80'>
            <p className="align-middle justify-center m-auto mb-5 pt-5 bg-transparent rounded animate-bouncepulse text-6xl">
                Game Over!</p>
            {hs? <div><p className="align-middle justify-center m-auto mb-5 bg-transparent rounded-xl animate-bouncepulse text-2xl">High Score!</p><form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={'Enter Your Name'}/>
        </label>
        <input type="submit" value="Submit" />
      </form></div>:<></>}
            <table className='justify-center m-auto table-auto'>
            <thead>
                <tr>
                   <th></th>     
                   <th className='text-3xl text-center py-4'>High Scores</th>     
                   <th></th>     
                </tr>
                <tr>
                    <th>Rank</th>
                    <th>Score</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
            {data?.map((score, i) => (<tr key={i} className='text-center'><td>{i+1}</td><td>{score.score}</td><td>{score.name}</td></tr>))}
            </tbody>
                
            </table>
            <button
            onClick={() => window.location.reload()}
          className="text-4xl m-auto justify-center align-middle text-center my-5 py-3 px-10 outline-double outline-4 hover:animate-colorpulse bg-opacity-50 bg-black"
        >
          Play Again
        </button>
    </Modal>
}