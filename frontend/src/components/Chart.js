import Chart from "chart.js/auto";
import { Line } from 'react-chartjs-2';
import { Link } from "react-router-dom";

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

export function ChartModal() {
    
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
            <div className='w-4/5 m-5 justify-center flex'>
                <Link to="/automation">
                    <button className='bg-blue-500 hover:bg-blue-700 text-white absolute top-3 right-3 font-bold py-2 px-4 rounded'>Automation</button>
                </Link>
            </div>
        </div>
    )
};
