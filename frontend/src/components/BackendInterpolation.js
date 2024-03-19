let chartData = null;

// Function to fetch chart data from the backend and update the exported data
// async function fetchChartDataAndUpdate() {
//     try {
//         const response = await fetch('http://0.0.0.0:3000/data');
//         if (!response.ok) {
//             throw new Error('Failed to fetch data');
//         }
        
//         const data = await response; //.json();
//         console.log(data);
//         chartData = data;
//         console.log('Fetched data:')
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error; // Re-throw the error for handling in components
//     }
// }

// fetchChartDataAndUpdate();

export function getChartData() {
    return chartData;
}

// setInterval(fetchChartDataAndUpdate, 60000);