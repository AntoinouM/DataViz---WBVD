import * as d3 from 'd3';
import './style.css';

  /* ===== Preparation ===== */

async function drawChart() {

  /* ===== Load Data ===== */
  const dataSet = await d3.json('./data/weather_data_2021.json')
  console.log(dataSet); 

  // Table view in console
  console.table(dataSet[0]);

  // define accessor functions
  const yAccessor = d => d.temperatureMax;
  const xAccessore = d => d.date;

  

}

drawChart();
