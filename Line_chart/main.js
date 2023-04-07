import * as d3 from 'd3';
import './style.css';

/* ===== Preparation ===== */

async function drawChart() {
  const width = 700;
  const height = 500;
  const color = '#FFCAE9';
  /* ===== Load Data ===== */
  let dataSet = await d3.json('./data/weather_data_2021.json')
  // add a corresponding season to all my entries
  dataSet = dataSet.map(function (d) {
    let month = new Date(d.date).getMonth();
    d.season = getSeason(month);
    return d;
  });
  // add a temperature in celcius
  dataSet = dataSet.map(function (d) {
    d.temperatureMax = parseFloat(((d.temperatureMax - 32) * 5 / 9).toFixed(1));
    return d;
  });

  /* ===== CHART DIMENSION ===== */
  const margin = {
    top: 20,
    right: 20,
    bottom: 35,
    left: 35
  };
  const boundedWith = width - margin.left - margin.right;
  const boundedHeight = height - margin.top - margin.bottom;

  /* ===== DRAW CANVAS ===== */
  const svg = d3.select('#viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const viz = svg.append('g')
    .attr('class', 'box-plot')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)


  // define accessor functions
  const yAccessor = d => d.temperatureMax;
  const xAccessore = d => d.season;

  /* ===== CREATE SCALE ===== */
  // create the vivaldi scale
  const xScale = d3.scaleBand()
    .domain(['winter', 'spring', 'summer', 'fall'])
    .range([0, boundedWith])
    .padding(0.5)

  // Create a scale for the y-axis (temperatureMax)
  const yScale = d3.scaleLinear()
    .domain([-5, d3.max(dataSet, function(g) {return g.temperatureMax;})])
    .range([boundedHeight, 0])
    .nice();

  // compute statistics
  let dataBySeason = Array.from(d3.group(dataSet, function (d) {
    return d.season;
  })); // 0:Spring 1:Summer 2:Fall 3:Winter-- data in [1]

  const box = {
    width: xScale.bandwidth(),
    center: xScale.bandwidth() / 2
  }

  const boxSpring = viz.append('g')
    .attr('id', 'springBox')
    generateBoxPlot(boxSpring, dataBySeason[0][1], box, 'spring')

  const boxSummer = viz.append('g')
    .attr('id', 'summerBox')
    generateBoxPlot(boxSummer, dataBySeason[1][1], box, 'summer')

  const boxFall = viz.append('g')
    .attr('id', 'fallBox')
    generateBoxPlot(boxFall, dataBySeason[2][1], box, 'fall') 

  const boxWinter = viz.append('g')
    .attr('id', 'winterBox')
    generateBoxPlot(boxWinter, dataBySeason[3][1], box, 'winter')

const yAxis = d3.axisLeft(yScale) // Call the axis generator
.tickValues([-5, 0, 5, 10, 15, 20, 25, 30, 35])
.tickSize(5)
// Actually create the Y axis
viz.append('g')
.attr('class', `x-axis, axes`)
.call(yAxis)


function generateBoxPlot(constant, arrayData, box, string) {
  const stats = generateStats(arrayData);

  constant.append('line')
      .attr('class', 'minmax')
      .attr('x1', xScale(string) + box.center)
      .attr('x2', xScale(string) + box.center)
      .attr('y1', yScale(stats.min))
      .attr('y2', yScale(stats.max))

  constant.selectAll('.' + string)
      .data(arrayData)
      .enter()
      .append('rect')
          .attr('class', 'box')
          .attr('x', xScale(string))
          .attr('y', yScale(stats.q3)) // Lower quartile
          .attr('width', box.width)
          .attr('height', Math.abs(yScale(0) - yScale(stats.interQuantileRange))) // Interquartile range
          .attr('fill', 'steelblue')

  constant.append('line')
      .attr('class', 'median')
      .attr('x1', xScale(string))
      .attr('x2', xScale(string) + box.width)
      .attr('y1', yScale(stats.median))
      .attr('y2', yScale(stats.median))

  constant.append('line')
      .attr('class', 'minmax')
      .attr('x1', xScale(string) + (box.width * 0.2))
      .attr('x2', xScale(string) + (box.width * 0.8))
      .attr('y1', yScale(stats.min))
      .attr('y2', yScale(stats.min))

  constant.append('line')
      .attr('class', 'minmax')
      .attr('x1', xScale(string) + (box.width * 0.2))
      .attr('x2', xScale(string) + (box.width * 0.8))
      .attr('y1', yScale(stats.max))
      .attr('y2', yScale(stats.max))
}

} // end function






drawChart();



// Helpeing methods
function getSeason(month) {
  switch (month) {
    case 11:
    case 0:
    case 1:
      return "Winter";
    case 2:
    case 3:
    case 4:
      return "Spring";
    case 5:
    case 6:
    case 7:
      return "Summer";
    case 8:
    case 9:
    case 10:
      return "Fall";
    default:
      return "Unknown";
  }
}

function generateStats(array) {
  let q1 = d3.quantile(array.map(function (g) {return g.temperatureMax;}).sort(d3.ascending), .25)
  let median = d3.quantile(array.map(function (g) {return g.temperatureMax;}).sort(d3.ascending), .5)
  let q3 = d3.quantile(array.map(function (g) {return g.temperatureMax;}).sort(d3.ascending), .75)
  let interQuantileRange = q3 - q1
  let min = d3.min(array.map(function (g) {return g.temperatureMax;}))
  let max = d3.max(array.map(function (g) {return g.temperatureMax;}))

  return ({
    q1: q1,
    median: median,
    q3: q3,
    interQuantileRange: interQuantileRange,
    min: min,
    max: max
  })
}