import './style.css';
import * as d3 from 'd3';

const dataExample = d3.csv('./data/dataSet.csv')
    .then((dataExample) => {
        console.log(dataExample)
    }) // return a Promise so all the code that require data should be executed in this scope.
    // this means it can be complicated to manage seve ral dataset as we would need to chain callback .then( .then( .then()))

/* ======= CHART CHECKILIST ========
- [1] `Access data` -- Define how we access the values
- [2] `Create chart dimensions` -- Declare the physical chart parameters
- [3] `Draw canvas` -- Render the wrapper and bounds element
- [4] `Create scales` -- Create scales for every visualized attribute
- [5] `Draw data` -- Render the data elements
- [6] `Draw peripherals` -- Render the axes, labels, legends, annotations, etc
- [7] `Set up interactions` -- Initialize event listeners and create interaction behavior
*/

// easier to work with asynch / await
async function drawChart() {
    const width = 700;
    const height = 500;
    const circleRadius = 4;
    const color = '#FFCAE9';
    // let dataSet;
    // try {
    //     dataSet = await d3.csv('./data/dataSet.csv'); // the await keyword make things synchronous, make it ike the natural way of reading it
    // } catch (e) {
    //     console.error(e);
    // }

    /* [1] ===== ACCESS DATA ===== */
    const dataSet = await d3.json('./data/weather_data_2021.json')
            // Some simple stats


    /* [2] ===== CHART DIMENSION ===== */
    const margin = {top: 20, right: 20, bottom: 35, left: 35};
    const boundedWith = width - margin.left - margin.right;
    const boundedHeight = height - margin.top - margin.bottom;

    /* [3] ===== DRAW CANVAS ===== */
    const svg = d3.select('#viz')
        .append('svg')
            .attr('width', width)
            .attr('height', height)

    const viz = svg.append('g')
        .attr('class', 'line-chart')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    /* [4] ===== CREATE SCALE ===== */


    /* [5] ===== DRAW DATA ===== */


    /* [6] ===== DRAW PERIPHERALS ===== */


    // =====================================
    /* [7] ===== SET UP INTERACTION ===== */
    // =====================================

}

drawChart();




