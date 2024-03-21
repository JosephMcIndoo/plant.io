import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Automation() {
    const [automationScript, setAutomationScript] = useState('');

    function run() {
        // Post request to backend that sends the automation script
        setAutomationScript('');
    }
    return (
        <>
            <div className='relative top-10 mt-2 flex flex-col h-screen items-center '>
                <h1 className='mt-5 font-bold text-6xl py-10 flex w-full justify-center text-center text-slate-100'>Plantio</h1>
                <div className='w-4/5 m-5 justify-center flex'>
                    <input
                        type="text" className='w-4/5 p-2 mr-2 rounded-lg' placeholder='Enter your automation script'
                        value={automationScript}
                        onChange={(e) => setAutomationScript(e.target.value)}
                    />
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-200 ease-in-out'
                        onClick={() => run()}
                        >Run
                    </button>
                </div>
                <div className='w-full flex-row m-5 p-10 flex justify-between'>
                    <div className="m-5 ml-10 p-5 items-center">
                        <h1 className='mt-5 font-bold text-4xl py-10 flex w-full justify-center text-center text-slate-100'>Automation Blocks</h1>
                    </div>
                    <div className="m-5 mr-10 p-5 items-center">
                        <h1 className='mt-5 font-bold text-4xl py-10 flex w-full justify-center text-center text-slate-100'>Automation Scripts</h1>
                    </div>
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
