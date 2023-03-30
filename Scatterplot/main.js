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
    const dataSet = await d3.csv('./data/dataSet.csv')
            // Some simple stats
        console.log('===== Stats =====')
        console.log('The mean value of X is: ' + d3.mean(dataSet, (e) => e.x))
        console.log('The mean value of Y is: ' + d3.mean(dataSet, (e) => e.y))
        console.log('The min value of X is: ' + d3.min(dataSet, (e) => e.x) + ' and the max is : ' + d3.max(dataSet, (e) => e.x))
        console.log('=================')

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
        .attr('class', 'scatterplot')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    /* [4] ===== CREATE SCALE ===== */
    // A lot of scales exists, check documentation to find the fitting one
    // Here we will create a linear scale
            // FROM INPUT DOMAIN TO OUTPUT RANGE
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataSet, e => e.x)) // Requires arry of min and max as input
        .range([0, boundedWith]); // Also requires an arry of mean and max as input
    //console.log(xScale(n)) --> used as a function, it gives the sclaed value of n
    // we can convert back scaled value to data value using xScyle.invert(value)
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataSet, e => e.y)])
        .range([boundedHeight, 0]) // we flip it because we need the highet point to be on top
        .nice();

    /* [5] ===== DRAW DATA ===== */
    /**
     * Data binding steps:
     * 1) Select the container
     * 2) Select the element to bind the data to
     * 3) Call the .data() function and bind the data
     * 4) Call .join() and continue with enter, update, exit pattern
     */
    const circles = viz.selectAll('circle') // select what is not there yet
        .data(dataSet) // bind it with data (create an enter() for each elem in dataSet)
        .join('circle') // short version of .enter().append('circle') and later .merge() with existing update selection
            .attr('r', circleRadius)
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('fill', color)

    /* [6] ===== DRAW PERIPHERALS ===== */
    const yAxis = d3.axisLeft(yScale) // Call the axis generator
        .tickValues([20, 40, 60, 80, 100])
        .tickSize(5)
    // Actually create the Y axis
    viz.append('g')
        .attr('class', 'y-axis')
        .call(yAxis)

}



drawChart();



