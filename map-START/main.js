import * as d3 from 'd3';
import { transformData } from './src/util';

import './style.css';

// ====================
// SETUP
// ====================
const width = window.innerWidth * 0.8;
const height = window.innerHeight * 0.7;

const minYear = 1913;
const maxYear = 2019;
let currentYear = 2000;
let minLifeE, meanLifeE, maxLifeE;
let mergedGeoJson;

// Reference to the tooltip
const tooltip = d3.select('#tooltip');
const tooltipText = d3.select('#information');

// Reference to current year
const currentYearEl = d3.select('#currentYear');

// Generators
const projection = d3
  .geoMercator()
  .translate([width / 2, height / 1.4]) // Translate to center screen
  .scale([150]);
const path = d3.geoPath().projection(projection);

// Scales
const colorScale = d3
  .scaleSequential()
  .interpolator(d3.interpolateRdYlGn);

// Linear scale with pivot element in order to emphasize extremes
const colorScale2 = d3
  .scaleLinear()
  .range(['#cb0f20', '#ecf279', '#2f6e5f']);


const drawViz = async () => {
  // ====================
  // Load Data
  // ====================

  // Load world data
  const worldData = await d3.json('./data/world.geo.json');

  // Load life expactancy data
  const lifeData = await d3.csv('./data/life-expectancy.csv', (row) => { // allow to modify dataset
    return {
      entity: row['Entity'],
      lifeExpectancy: +row['LifeExpectacy'],
      code: row['Code'],
      year: +row['Year'],
    };
  });

  // Get the min, mean and max life expactancy from the data
  minLifeE = Math.ceil(d3.min(lifeData, (d) => d.lifeExpectancy));
  meanLifeE = Math.ceil(d3.mean(lifeData, (d) => d.lifeExpectancy));
  maxLifeE = Math.ceil(d3.max(lifeData, (d) => d.lifeExpectancy));

  // Initial call with the default year
  mergedGeoJson = transformData(lifeData, worldData, currentYear);

  // ====================
  // Scales
  // ====================

  // Sequential scale to show the extremes with diverging colors
  colorScale.domain([minLifeE, maxLifeE]);

  // Linear Scale
  colorScale2.domain([minLifeE, meanLifeE, maxLifeE]);

  // ====================
  // DRAW
  // ====================
  const svg = d3
    .select('#viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg.append('g').attr('class', 'mapViz');

  // Draw the countries initially
  drawMap(mergedGeoJson, g);

  // ====================
  // ZOOM & PAN
  // ====================
  const zoom = d3.zoom()
    .scaleExtent([1, 10]) // scale factor
    .translateExtent([
      [-300, -300], // x0 and y0
      [1500, 1000] // x1 and y1
    ])
    .on('zoom', function(event) {
      console.log(event)
      g.attr('transform', event.transform)
    });

    // Call the zoom on the next parent element of your 'to be zoomed' selection
    d3.select('#viz').call(zoom);

  // ====================
  // SLider setup
  // ====================
  const slider = d3.select('#currentYearSlider').on('input', function() {
    // Update the current year globally
    currentYear = +this.value; // + there convert to a number

    // Display
    currentYearEl.html(currentYear);

    //call the redraw function
    redraw(currentYear);
  })

  // ====================
  // Redraw function
  // ====================
  function redraw(currentYear) {
    // 1. Grab the data based on the current year
    mergedGeoJson = transformData(lifeData, worldData, currentYear);
    
    // 2. Redraw the countries based on the new data
    drawMap(mergedGeoJson, g);
  }

};

/**
 * This function draws the map with the current data set
 * @param {*} mergedGeoJson 
 * @param {*} sel 
 */
const drawMap = (mergedGeoJson, sel) => {
  const countries = sel
    .selectAll('path')
    .data(mergedGeoJson)
    .join('path')
    .attr('d', path)
    .attr('class', 'country')
    .style('fill', (d) => {
      return colorScale2(d.lifeExpectancy)
    })

  // Call tooltlip function with countries
  createTooltips(countries);
};

/**
 * This function creates the tooltips for the current countries based on the data set
 * @param {*} countries 
 */
const createTooltips = (countries) => {
  countries.on('mousemove', function(event, d) {
    if (d.hasOwnProperty('year')) {
      // Move the tooltip itself
      tooltip.style('opacity', 1)
        .style('left', event.pageX - 86 + 'px')
        .style('top', event.pageY - 60 + 'px');

      tooltipText.html(function() {
        return `
          <table>
            <tr>
              <td><b>Country:</b></td>
              <td>${d.entity}</td>
            </tr>
            <tr>
              <td><b>Life Expactancy:</b></td>
              <td>${Math.ceil(d.lifeExpectancy)}</td>
            </tr>
          </table>
        `
      });
    }
  }).on('mouseout', function() {
    tooltip.style('opacity', 0);
  });
}

// Draw the map for the first time
drawViz();

// ====================
// Play button
// ====================
const playBtn = d3.select('#btnPlay');
