import './style.css';
import * as d3 from 'd3';

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
    /* Preparation */
    const dateParse = d3.timeParse('%Y-%m-%d');

    /* [1] ===== ACCESS DATA ===== */
    const dataSet = await d3.json('./data/weather_data_2021.json')

    console.table(dataSet[0]); // view first element as table in console

    // Define accessor functions
    const yAccessor = d => ((d.temperatureMax - 32) * (5/9));
    const xAccessor = d => dateParse(d.date); 

    /* [2] ===== CHART DIMENSION ===== */
    const dimensions = {
        width: window.innerWidth * 0.75,
        height: 500,
        margin: {top: 20, right: 20, bottom: 35, left: 35},
        boundedWidth: undefined,
        boundedHeight: undefined,
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    /* [3] ===== DRAW CANVAS ===== */




    const wrapper = d3.select('#viz')
    const svg = d3.select('#viz')
        .append('svg')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height);

            const viz = svg.append('g')
            .attr('class', 'line-chart')
            .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)

    /* [4] ===== CREATE SCALE ===== */
     const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataSet, yAccessor)])
        .range([dimensions.boundedHeight, 0])
        .nice();

    const xScale = d3.scaleTime()
        .domain(d3.extent(dataSet, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice();
    /* [5] ===== DRAW DATA ===== */


    /* [6] ===== DRAW PERIPHERALS ===== */


    // =====================================
    /* [7] ===== SET UP INTERACTION ===== */
    // =====================================

}

drawChart();




