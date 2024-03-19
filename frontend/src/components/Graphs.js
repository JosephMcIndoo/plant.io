import Chart from "chart.js/auto";
import { Line } from 'react-chartjs-2';
import Settings from './settings.png';
import { ReactComponent as Plus } from './plus.svg';


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
    function setttings() {
        console.log('settings');
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
            <button 
                className="absolute items-center top-10 right-7 justify-center px-2 py-2 z-20 rounded-xl text-white hover:bg-slate-500 duration-200 ease-in-out"
                onClick={() => setttings()}
            >
                {/* <Plus className="w-6 h-6 fill-current" /> */}
                <img src={Settings} alt="settings" className="w-6 h-6 fill-current"/>
            </button>
        </>
    )
}
