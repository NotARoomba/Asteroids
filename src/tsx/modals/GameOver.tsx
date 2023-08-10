import Modal from 'react-modal';
import { generate } from "hmac-auth-express";
import { ScoreProp } from '../utils/Types';
import { useEffect, useState } from 'react';
import { callAPI } from '../utils/Functions';

export default function GameOver({modalOpen, closeModal}: {modalOpen: boolean, closeModal: ()=>void}) {
    const [data, setData] = useState<ScoreProp>();
    useEffect(() => {
        async function updateData() {
            const { d } = await callAPI('/scores', 'GET');
            setData(d);
            console.log(data);
        }
        updateData();
    })
    return <Modal closeTimeoutMS={250} isOpen={modalOpen} className='flex m-auto bg-neutral-700 my-20 w-fit p-2 px-4 outline-none text-neutral-200 rounded opacity-100' overlayClassName='fixed top-0 left-0 right-0 bottom-0 bg-black opacity-80'>
        <p className="align-middle justify-center m-auto mb-10 bg-transparent rounded animate-bouncepulse text-8xl">
            Game Over!
        </p>
    </Modal>
}