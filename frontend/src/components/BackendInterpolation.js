let chartData = null;
let variables = [];



// Function to fetch chart data from the backend and update the exported data
async function fetchChartDataAndUpdate() {
    // try {
        const response = await fetch('http://0.0.0.0:3000/data');
        // if (!response.ok) {
        //     throw new Error('Failed to fetch data');
        // }
        const data = JSON.parse(await response.json());
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

setInterval(fetchChartDataAndUpdate, 60000);

export async function fetchVariables() {
    const response = await fetch('http://0.0.0.0:3000/variables');
    const jsonData = JSON.parse(await response.json());
    variables = jsonData;
}

export function getVariableData() {
    return variables;
}
