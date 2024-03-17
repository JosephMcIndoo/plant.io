import './App.css';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";
import { Data } from "./data";
import { CreateChart } from "./components/Chart";
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale);

function App() {
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

  return (
    <div className='flex flex-col items-center justify-center'>
        <h1 className='mt-5 font-bold flex w-full justify-center text-center'>Plantio</h1>
        <div className='w-4/5 m-5 justify-center flex'>
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
            />
        </div>
    </div>
  );
};

export default App;
