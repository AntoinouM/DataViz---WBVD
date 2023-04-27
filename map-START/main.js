import * as d3 from 'd3';
import { transformData } from './src/util';
import './style.css';



const width = window.innerWidth * 0.9
const height = window.innerHeight * 0.6 //60% screen width


const minYear = 1913;
const maxYear = 2019;
let currentYear = 2000;
let minLifeE, meanLifeE, maxLifeE;
let mergedGeoJson;

// reference to the tooltip
const tooltip = d3.select('#tooltip');
const tooltipText = d3.select('#information');

// reference to the current year
const currentYearEl = d3.select('#currentYear');
//Generators
const projection = d3.geoMercator()
  .translate([width / 2, height / 1.4])
  .scale([150])

const path = d3.geoPath().projection(projection);
const colorScale = d3
  .scaleSequential()
  .interpolator(d3.interpolateRdYlGn)

const colorScale2 = d3
  .scaleLinear()
  .range(['#cb0f20', '#ecf279', '#2f6e5f']);


const drawViz = async () => {

  //load world data
  const worldData = await d3.json('./data/world.geo.json');
  //load life expectancy data
  const lifeData = await d3.csv('./data/life-expectancy.csv', (row) => { // new feature of d3, that allow to modify data before storing it in the const
    return {
      entity: row['Entity'],
      lifeExpectacy: +row['LifeExpectacy'],
      code: row['Code'],
      year: +row['Year']
    }
  });

  minLifeE = Math.ceil(d3.min(lifeData, (d) => d.lifeExpectacy));
  meanLifeE = Math.ceil(d3.mean(lifeData, (d) => d.lifeExpectacy));
  maxLifeE = Math.ceil(d3.max(lifeData, (d) => d.lifeExpectacy));

  mergedGeoJson = transformData(lifeData, worldData, currentYear);

  // =====================
  // Generators and Scales
  // =====================


  //Scales

  //Sequential scale to show the extremes with diverging colors
  colorScale.domain([minLifeE, maxLifeE]);

  // Linerar scale
  colorScale2.domain([minLifeE, meanLifeE, maxLifeE]);


  // =====================
  // Draw a map
  // =====================
  const svg = d3.select('#viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const g = svg.append('g').attr('class', 'mapViz');
  drawMap(mergedGeoJson, g);

  // ZOOM AND PAN

}

const drawMap = (mergedGeoJson, sel) => {
  const countries = sel.selectAll('path')
    .data(mergedGeoJson)
    .join('path')
    .attr('d', path)
    .attr('class', 'country')
    .style('fill', (d) => {
      return colorScale2(d.lifeExpectacy)
    })
    createTooltips(countries);
}

const createTooltips = (countries) => {
  countries.on('mousemove', function(event, d) {
    // Move the tooltip itself
    tooltip
      .style('opacity', 1)
      .style('left', event.pageX - 86 + 'px')
      .style('top', event.pageY - 60 + 'px');
    tooltipText
      .html(function() {
        return `
          <table>
            <tr>
              <td><b>Country:</b></td>
              <td>${d.entity}</td>
            </tr>
            <tr>
              <td><b>Life Expactancy:</b></td>
              <td>${Math.ceil(d.lifeExpectacy)}</td>
           </tr>
          </table>
        `
      })
  }).on('mouseout', function() {
    tooltip.style('opacity', 0);
  })
}

drawViz();