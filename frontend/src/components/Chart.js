import Chart from "chart.js/auto";
import { Line } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import { ReactComponent as Plus } from './plus.svg';
import { Graph } from "./Graphs";
import { useState, useEffect } from "react";
import { fetchVariables, getVariableData } from './BackendInterpolation';

export function ChartModal() {
    // Format: [1, 2, ....]
    const [graphs, setGraphs] = useState([0]);
    return (
        <>
            <div className='relative flex flex-col items-center justify-center bg-slate-100 rounded-2xl mt-20 m-12 p-10 px-32'>
                <h1 className='mt-0 font-bold text-4xl py-10 flex w-4/5 justify-center text-center'>Plantio</h1>
                    {graphs.map((graph, index) => {
                        return(
                            <div className='relative w-full m-5 justify-center flex'>
                                <Graph chartNum = {index}/>
                            </div>
                    )})}
                <div className='absolute top-5 left-5 justify-center'>
                    <button 
                        className="flex items-center justify-center px-2 py-2 bg-slate-700 z-10 rounded-xl text-white hover:bg-slate-500 duration-200 ease-in-out"
                        onClick={() => setGraphs([...graphs, graphs.length])}
                    >
                        <Plus className="w-6 h-6 fill-current" />
                    </button>
                </div>
            </div>
            <div className='w-4/5 m-5 justify-center flex'>
                <Link to="/automation">
                    <button className='bg-blue-500 hover:bg-blue-700 text-white absolute top-3 right-3 font-bold py-2 px-4 rounded duration-200 ease-in-out'>Automation</button>
                </Link>
            </div>
        </>
    )
};
