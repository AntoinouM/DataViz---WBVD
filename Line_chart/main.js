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
  const xAccessore = d => d.date;

  /* ===== CREATE SCALE ===== */
  // create the vivaldi scale
  const xScale = d3.scaleBand()
    .domain(['winter', 'spring', 'summer', 'fall'])
    .range([0, boundedWith])
    .padding(0.2)

  // Create a scale for the y-axis (temperatureMax)
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataSet.map(function(g) {return g.temperatureMax;})))
    .range([boundedHeight, 0]);

  // compute statistics
  let dataBySeason = Array.from(d3.group(dataSet, function (d) {
    return d.season;
  })); // 0:Spring 1:Summer 2:Fall 3:Winter-- data in [1]
    // Table view in console
    console.table(dataBySeason[0][1][2]);

  const springStats = generateStats(dataBySeason[0][1])
  const summerStats = generateStats(dataBySeason[1][1])
  const fallStats = generateStats(dataBySeason[2][1])
  const winterStats = generateStats(dataBySeason[3][1])

  console.log(summerStats.q1)
  // Draw the box plots for winter data
  let boxWidth = (Math.ceil( (xScale.bandwidth() + 1) / 10 ) * 10) - 30

  const boxSpring = viz.selectAll('.spring')
    .data([dataBySeason[0][1]])
    .enter()
    .append('rect')
      .attr('class', 'box')
      .attr('x', xScale('spring'))
      .attr('y', parseFloat(yScale(springStats.q1).toFixed(1))) // Lower quartile
      .attr('width', boxWidth)
      .attr('height', boundedHeight - yScale(springStats.interQuantileRange)) // Interquartile range
      .attr('fill', 'steelblue')

    const boxSummer = viz.selectAll('.summer')
    .data([dataBySeason[1][1]])
    .enter()
    .append('rect')
      .attr('class', 'box')
      .attr('x', xScale('summer'))
      .attr('y', parseFloat(yScale(summerStats.q1).toFixed(1))) // Lower quartile
      .attr('width', boxWidth)
      .attr('height', boundedHeight - yScale(summerStats.interQuantileRange)) // Interquartile range
      .attr('fill', 'steelblue')

    const boxFall = viz.selectAll('.fall')
    .data([dataBySeason[2][1]])
    .enter()
    .append('rect')
      .attr('class', 'box')
      .attr('x', xScale('fall'))
      .attr('y', parseFloat(yScale(fallStats.q1).toFixed(1))) // Lower quartile
      .attr('width', boxWidth)
      .attr('height', boundedHeight - yScale(fallStats.interQuantileRange)) // Interquartile range
      .attr('fill', 'steelblue')

    const boxWinter = viz.selectAll('.winter')
    .data([dataBySeason[3][1]])
    .enter()
    .append('rect')
      .attr('class', 'box')
      .attr('x', xScale('winter'))
      .attr('y', yScale(winterStats.q1)) // Lower quartile
      .attr('width', boxWidth)
      .attr('height', boundedHeight - yScale(winterStats.interQuantileRange)) // Interquartile range
      .attr('fill', 'steelblue')


const yAxis = d3.axisLeft(yScale) // Call the axis generator
.tickValues([-5, 5, 15, 25, 35])
.tickSize(5)
// Actually create the Y axis
viz.append('g')
.attr('class', `x-axis, axes`)
.call(yAxis)


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