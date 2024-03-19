import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

export function Automation() {
    return (
        <>
            <div className='flex flex-col h-screen items-center justify-center '>
                <h1 className='mt-5 font-bold text-6xl py-10 flex w-full justify-center text-center text-slate-100'>Plantio</h1>
                <div className='w-4/5 m-5 justify-center flex'>
                    <input type="text" className='w-4/5 p-2 rounded-lg' placeholder='Enter your automation script' />
                </div>                    
            </div>
            <div className='w-4/5 m-5 justify-center flex'>
                <Link to="/">
                    <button className='bg-blue-500 hover:bg-blue-700 text-white absolute top-3 right-3 font-bold py-2 px-4 rounded duration-200 ease-in-out'>Graphs</button>
                </Link>
            </div>
        </>
    );
}
