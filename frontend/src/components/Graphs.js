import Chart from "chart.js/auto";
import { Line, Scatter} from 'react-chartjs-2';
import Settings from './settings.png';
import { ReactComponent as Plus } from './plus.svg';
import { useState, useEffect } from "react";
import { fetchVariables, getChartData, getVariableData } from './BackendInterpolation';


export function Graph() {
    // await fetchVariables();

    // TODO: Data representation.


    const variables = ["time", "temperature", "humidity", "light", "moisture"]; //getVariableData();
    const data = {
        time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        temperature: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
        humidity: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
        light: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
        moisture: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
    }      //getChartData();

    const dataValues = Object.values(data);
    const [axes, setAxes] = useState([0, [1]]);

    const [settings, setSettings] = useState(false);
    function setttings() {
        setSettings(!settings);
    }

    function updateDataSets() {
        var yDataSet = [];
        for (let i = 0; i < axes[1].length; i++) {
            yDataSet.push({
                label: variables[axes[1][i]],
                data: data[variables[axes[1][i]]],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            });
        }
        setChartData({
            labels: data[variables[axes[0]]],
            datasets: yDataSet
        });
    }

    console.log(data[variables[axes[1][0]]]);
    const dataToGraph = [{
        label: variables[axes[1][0]], // You can set any label you like
        data: data[variables[axes[1][0]]].map((y_val, i) => ({x: data[variables[axes[0]]][i], y: y_val})),
        // Assuming x-axis and y-axis data are correctly mapped
        // x values are taken from data[variables[axes[0]]], y values from data[variables[axes[1][0]]]
        // You might need to adjust this depending on how your data is structured
        // Also, make sure both arrays are of the same length
        // If not, you'll have to handle missing or extra data points.
        backgroundColor: 'rgba(75,192,192,0.2)', // Sample background color
        borderColor: 'rgba(75,192,192,1)', // Sample border color
        borderWidth: 1 // Sample border width
    }];
    const [chartData, setChartData] = useState({
        datasets: dataToGraph,
    });

    return (
        <>
            <Line
                labels="Graph"
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
                                {variables.map((variable, index) => {
                                    return (
                                        <label><input type="radio" id="x" name="axes" value="x"/> {variable} </label>
                                    )
                                })}
                            </div>
                            <div className="flex flex-col p-2 animate-fade-in">
                                <h1 className="font-bold"> Y-Axis </h1>
                                {variables.map((variable, index) => {
                                    return (
                                        <label><input type="checkbox" id="y" name="axes" value="y"/> {variable} </label>
                                    )
                                })}
                            </div>
                        </div>) 
                    : (<> </>)}
            </div>
        </>
    )
}
