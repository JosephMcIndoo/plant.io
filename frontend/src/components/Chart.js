import Chart from "chart.js/auto";

export const CreateChart = (chartType, labels, data, title) => {
    const ctx = document.getElementById('myChart');
    return new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
};
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = [65, 59, 80, 81, 56, 55, 40];
const title = 'Sample Data';
const myChart = CreateChart('bar', labels, data, title);