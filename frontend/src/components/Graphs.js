import Chart from "chart.js/auto";
import { Line } from 'react-chartjs-2';
import Settings from './settings.png';
import { ReactComponent as Plus } from './plus.svg';
import { useState, useEffect } from "react";
import { getChartData } from './BackendInterpolation';

const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Sample Data',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        }
    ]
};


export function Graph(x, y) {
    const variables = ['var1', 'var2', 'var3', 'var4', 'var5']; // Replace with actual variables from backend
    const [axes, setAxes] = useState([x, y]);
    const [settings, setSettings] = useState(false);
    function setttings() {
        setSettings(!settings);
    }
    return (
        <>
            <Line
                data={chartData}
                options={{
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }}
            > 
            </Line>
            <div className={`absolute top-10 right-7 z-30 p-2 items-center justify-center bg-slate-500 rounded-xl ${settings ? "w-72 " : "w-10 h-10"} duration-200 ease-in-out`}>
                <button
                    className={`absolute items-center justify-center px-2 py-2 z-40 ${settings ? "top-1 right-1" : "top-0 right-0"} rounded-xl text-white hover:bg-slate-600 duration-200 ease-in-out`}
                    onClick={() => setttings()}
                >
                    {/* <Plus className="w-6 h-6 fill-current" /> */}
                    <img src={Settings} alt="settings" className="w-6 h-6 fill-current"/>
                    
                </button>
                {settings ? (
                        <div className={`flex top-20 left-0 z-20`}>
                            <div className="flex flex-col p-2 animate-fade-in">
                                <h1 className="font-bold"> X-Axis </h1>
                                <label><input type="radio" id="x" name="axes" value="x"/> var12524234 </label>
                                <label><input type="radio" id="x" name="axes" value="x"/> var1 </label>
                                <label><input type="radio" id="x" name="axes" value="x"/> var135 </label>
                                <label><input type="radio" id="x" name="axes" value="x"/> var4 </label>
                            </div>
                            <div className="flex flex-col p-2 animate-fade-in">
                                <h1 className="font-bold"> Y-Axis </h1>
                                <label><input type="checkbox" id="y" name="axes" value="y"/> var2 asfsdf</label>
                                <label><input type="checkbox" id="y" name="axes" value="y"/> var3 </label>
                                <label><input type="checkbox" id="y" name="axes" value="y"/> var4 </label>
                                <label><input type="checkbox" id="y" name="axes" value="y"/> var5 </label>
                            </div>
                        </div>) 
                    : (<> </>)}
            </div>
        </>
    )
}
