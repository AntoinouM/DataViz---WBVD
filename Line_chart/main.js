import * as d3 from 'd3';
import './style.css';

  /* ===== Preparation ===== */

async function drawChart() {
  const width = 700;
  const height = 500;
  const circleRadius = 4;
  const color = '#FFCAE9';
  /* ===== Load Data ===== */
  let dataSet = await d3.json('./data/weather_data_2021.json')
    // add a corresponding season to all my entries
    dataSet = dataSet.map(function(d) {
      let month = new Date(d.date).getMonth();
        d.season = getSeason(month);
      return d;
    });
    // add a temperature in celcius
    dataSet = dataSet.map(function(d) {
        d.temperatureMax = parseFloat(((d.temperatureMax - 32) * 5/9).toFixed(2));
      return d;
    });

  /* ===== CHART DIMENSION ===== */
  const margin = {top: 20, right: 20, bottom: 35, left: 35};
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


  // Table view in console
  console.table(dataSet[243]);

  // define accessor functions
  const yAccessor = d => d.temperatureMax;
  const xAccessore = d => d.date;


    
  // compute statistics
  console.log('===== Stats =====')
  
  console.log('=================')
  

}

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
