import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

export function Automation() {
    return (
        <div className='flex flex-col items-center justify-center'>
            <h1 className='mt-5 font-bold flex w-full justify-center text-center'>Plantio</h1>
            <div className='w-4/5 m-5 justify-center flex'>
            </div>
            <div className='w-4/5 m-5 justify-center flex'>
                <Link to="/">
                    <button className='bg-blue-500 hover:bg-blue-700 text-white absolute top-3 right-3 font-bold py-2 px-4 rounded'>Graphs</button>
                </Link>
            </div>
        </div>
    );
}
