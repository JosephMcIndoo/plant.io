import Chart from "chart.js/auto";
import { Line, Scatter} from 'react-chartjs-2';
import Settings from './settings.png';
import { ReactComponent as Plus } from './plus.svg';
import { useState, useEffect, useRef } from "react";
import { fetchChartDataAndUpdate, fetchVariables, getChartData, getVariableData } from './BackendInterpolation';


export function Graph(chartNum) {
    // await fetchVariables();
    const chartRef = useRef(null);

    // const [data, updateData] = useState(
    //     {
    //         time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    //         temperature: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    //         humidity: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    //         light: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
    //         moisture: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
    //     }
    //     );

    const variables = ["time", "temperature", "humidity", "light", "moisture"];
    const [axes, setAxes] = useState([0, [1, 2]]);
    const [settings, setSettings] = useState(false);

    const graphColors = ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"];

    // Function to toggle settings
    function toggleSettings() {
        setSettings(!settings);
    }

    // Function to update datasets
    useEffect(() => {
        // fetchChartDataAndUpdate();
        updateDataSets();
        const timer = setInterval(() => {
            updateDataSets();
        }, 1000); // Update every 1 seconds
    
        return () => clearInterval(timer);
    }, [axes]);


    function updateDataSets() {
        // updateData(getChartData());
        const data = getChartData();
        console.log(Object.values(data));
        const useData = Object.values(getChartData());
        console.log(useData);
        const yDataSet = axes[1].map(index => ({
            label: variables[index],
            data: useData[index].map((y_val, i) => ({ x: useData[axes[0]][i], y: y_val })) ?? [],
            borderColor: graphColors[index], 
            borderWidth: 2
        }));

        const newChartData = {
            labels: data[variables[axes[0]]],
            datasets: yDataSet
        };

        setChartData(newChartData);
    }

    // Sample data


    const [chartData, setChartData] = useState({
        datasets: []
    });


    useEffect(() => {
        const canvas = document.getElementById(`myChart${chartNum}`);
        const ctx = canvas.getContext('2d');
        chartRef.current = new Chart(ctx, config);
        return () => chartRef.current.destroy(); // Cleanup chart on component unmount
    }, []); // Empty dependency array ensures this effect runs only once after initial render

    // Function to update chart data and options
    // useEffect(() => {
    //     updateData(getChartData());
    //     console.log(getChartData());
    //     console.log("Updated data:" + data);
    //     updateDataSets();
    //     console.log("Chart object:", chartRef);
    //     try {
    //         chartRef.current.data = chartData;
    //         chartRef.current.update();
    //         console.log("Chart updated successfully");
    //     } catch (error) {
    //         console.error("Failed to update chart:", error);
    //     }
    //     const timer = setInterval(() => {
    //         updateData(getChartData());
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, []);
    useEffect(() => {
        try {
            chartRef.current.data = chartData;
            chartRef.current.update();
            console.log("Chart updated successfully");
        } catch (error) {
            console.error("Failed to update chart:", error);
        }
    }, [chartData]);
    
    // Configuration for Chart.js
    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            animation: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }, y : {
                    max : 100,    
                    min : 0
                }
            }
        }
    };

    return (
        <>
            <canvas id={`myChart${chartNum}`}></canvas>
            {/* Settings panel */}
            <div className={`absolute top-10 right-7 z-30 p-2 items-center justify-center bg-slate-500 rounded-xl ${settings ? "w-56" : "w-10 h-10"} duration-200 ease-in-out`}>
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
                        {/* <div className="flex flex-col p-2 animate-fade-in">
                            <h1 className="font-bold"> X-Axis </h1>
                            {variables.map((variable, index) => (
                                <label key={index}>
                                    <input type="radio" name="axes" value={index} onChange={() => setAxes([index, axes[1]])}/>
                                    {variable}
                                </label>
                            ))}
                        </div> */}
                        {/* Y-Axis */}
                        <div className="flex flex-col p-2 animate-fade-in">
                            <h1 className="font-bold"> Y Vars </h1>
                            {variables.map((variable, index) => (
                                <label key={index}>
                                    <input type="checkbox" name="axes" value={index} onChange={() => {
                                        const newAxes = axes[1].includes(index)
                                            ? axes[1].filter(i => i !== index)
                                            : [...axes[1], index];
                                        setAxes([axes[0], newAxes]);
                                    }}
                                    checked={axes[1].includes(index)}
                                    />
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
