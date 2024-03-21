import Chart from "chart.js/auto";
import { Line, Scatter} from 'react-chartjs-2';
import Settings from './settings.png';
import { ReactComponent as Plus } from './plus.svg';
import { useState, useEffect } from "react";
import { fetchVariables, getChartData, getVariableData } from './BackendInterpolation';


export function Graph(chartNum) {
    // await fetchVariables();

    const variables = ["time", "temperature", "humidity", "light", "moisture"];
    const [axes, setAxes] = useState([0, [1, 2]]);
    const [settings, setSettings] = useState(false);

    // Function to toggle settings
    function toggleSettings() {
        setSettings(!settings);
    }

    // Function to update datasets
    useEffect(() => {
        updateDataSets();
    }, [axes]); // Trigger updateDataSets when axes change

    function updateDataSets() {
        const yDataSet = axes[1].map(index => ({
            label: variables[index],
            data: data[variables[index]].map((y_val, i) => ({ x: data[variables[axes[0]]][i], y: y_val })),
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
        }));

        const newChartData = {
            labels: data[variables[axes[0]]],
            datasets: yDataSet
        };

        setChartData(newChartData);
    }

    // Sample data
    const data = {
        time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        temperature: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
        humidity: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
        light: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
        moisture: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
    };

    const [chartData, setChartData] = useState({
        datasets: []
    });

    // Create chart after component mount
    useEffect(() => { 
        const canvas = document.getElementById(`myChart${chartNum}`);
        const ctx = canvas.getContext('2d');
        const newChart = new Chart(ctx, config);
        return () => newChart.destroy(); // Cleanup chart on component unmount
    }, []); // Empty dependency array ensures this effect runs only once after initial render

    // Configuration for Chart.js
    const config = {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    };

    return (
        <>
            <canvas id={`myChart${chartNum}`}></canvas>
            {/* Settings panel */}
            <div className={`absolute top-10 right-7 z-30 p-2 items-center justify-center bg-slate-500 rounded-xl ${settings ? "w-72 " : "w-10 h-10"} duration-200 ease-in-out`}>
                <button
                    className={`absolute items-center justify-center px-2 py-2 z-40 ${settings ? "top-1 right-1" : "top-0 right-0"} rounded-xl text-white hover:bg-slate-600 duration-200 ease-in-out`}
                    onClick={toggleSettings}
                >
                    <img src={Settings} alt="settings" className="w-6 h-6 fill-current"/>
                </button>
                {/* Settings content */}
                {settings && (
                    <div className="flex top-20 left-0 z-20">
                        {/* X-Axis */}
                        <div className="flex flex-col p-2 animate-fade-in">
                            <h1 className="font-bold"> X-Axis </h1>
                            {variables.map((variable, index) => (
                                <label key={index}>
                                    <input type="radio" name="axes" value={index} onChange={() => setAxes([index, axes[1]])}/>
                                    {variable}
                                </label>
                            ))}
                        </div>
                        {/* Y-Axis */}
                        <div className="flex flex-col p-2 animate-fade-in">
                            <h1 className="font-bold"> Y-Axis </h1>
                            {variables.map((variable, index) => (
                                <label key={index}>
                                    <input type="checkbox" name="axes" value={index} onChange={() => {
                                        const newAxes = axes[1].includes(index)
                                            ? axes[1].filter(i => i !== index)
                                            : [...axes[1], index];
                                        setAxes([axes[0], newAxes]);
                                    }}/>
                                    {variable}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
