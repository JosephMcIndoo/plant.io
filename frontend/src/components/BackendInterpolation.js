let chartData = 
    {
        time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        temperature: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
        humidity: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
        light: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
        moisture: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
    };

let variables = [];



// Function to fetch chart data from the backend and update the exported data
export async function fetchChartDataAndUpdate() {
    // try {
        const response = await fetch('http://0.0.0.0:3000/data');
        // if (!response.ok) {
        //     throw new Error('Failed to fetch data');
        // }
        const data = JSON.parse(await response.json());
        // console.log(data);
        chartData = data;
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    //     throw error; // Re-throw the error for handling in components
    // }
}

fetchChartDataAndUpdate();

export function getChartData() {
    return chartData;
}

setInterval(fetchChartDataAndUpdate, 5000);

export async function fetchVariables() {
    const response = await fetch('http://0.0.0.0:3000/variables');
    const jsonData = JSON.parse(await response.json());
    variables = jsonData;
}

export function getVariableData() {
    return variables;
}
