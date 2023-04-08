import * as d3 from 'd3';
import './style.css';

/* ===== Preparation ===== */
const hidD = document.getElementById('hiddenDate');
const infoTemp = document.getElementById('info');
const vizDiv = document.getElementById('viz');
const seasonDiv = document.getElementById('season');
const summary = document.getElementById('summary');
const temperature = document.getElementById('temperature');

infoTemp.style.left = vizDiv.getBoundingClientRect().right + 380 + "px";
infoTemp.style.top = vizDiv.getBoundingClientRect().top + 20 + "px";

async function drawChart() {
  const width = 700;
  const height = 500;
  /* ===== Load Data ===== */
  let dataSet = await d3.json('./data/weather_data_2021.json')
  // add a corresponding season to all my entries
  dataSet = dataSet.map(function (d) {
    let month = new Date(d.date).getMonth();
    d.season = getSeason(month);
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
  let checkbox = document.querySelector("input[name=checkbox]");

  /* ===== DRAW CANVAS ===== */
  const svg = d3.select('#viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const viz = svg.append('g')
    .attr('class', 'box-plot')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  let userDate = hidD.innerHTML;

  /* ===== CREATE SCALE ===== */
  // create the vivaldi scale
  const xScale = d3.scaleBand()
    .domain(['winter', 'spring', 'summer', 'fall'])
    .range([0, boundedWith])
    .padding(0.5)

  // Create a scale for the y-axis (temperatureMax)
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataSet, function (g) {
      return g.humidity;
    })])
    .range([boundedHeight, 0])
    .nice();

  // compute statistics
  let dataBySeason = Array.from(d3.group(dataSet, function (d) {
    return d.season;
  })); // 0:Spring 1:Summer 2:Fall 3:Winter-- data in [1]
  let selectedDay;

  const box = {
    width: xScale.bandwidth(),
    center: xScale.bandwidth() / 2
  }

  viz.append('g')
    .attr('id', 'temp')
  viz.append('g')
    .attr('id', 'temptext')

  // get observable on date
  let observer = new MutationObserver(function (mutationsList, observer) {
    userDate = hidD.innerHTML;
    dataSet.forEach(element => {
      if (element.date == userDate) {
        selectedDay = element
      }
    });
    if (checkbox.checked) {
      if (selectedDay != undefined) {
        viz.select("#temp").remove();
        viz.selectAll("#temptext").remove();
        // append a line to viz
        generateTempLine(viz, selectedDay)

      } 
      generateInfoBox(selectedDay, userDate)
    }
  });

  observer.observe(hidD, {
    subtree: true,
    childList: true
  });

  // add event for checkbox
  checkbox.addEventListener('change', function () {
    if (!this.checked) {
      viz.select("#temp").remove();
      viz.select("#temptext").remove();
      infoTemp.style.visibility = "hidden";
    } else {
      infoTemp.style.visibility = "visible";
      if (selectedDay != undefined) {
        viz.select("#temp").remove();
        // append a line to viz
        generateTempLine(viz, selectedDay)
        generateInfoBox(selectedDay, userDate)
      }
    }
  });


  // box plot generation
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

  // show x axe on the bottom with offset to hide line
  const xAxis = d3.axisTop(xScale)
    .tickSize(0)
  svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + (height + 1) + ')')
    .attr('class', 'x-axis axes')
    .call(xAxis)
  d3.selectAll(".tick text") // selects the text within all groups of ticks
    .attr("y", "-20");

  const yAxis = d3.axisLeft(yScale) // Call the axis generator
    .tickValues([0, 0.2, 0.4, 0.6, 0.8, 1])
    .tickSize(5)
  // Actually create the Y axis
  viz.append('g')
    .attr('class', `x-axis, axes`)
    .call(yAxis)

  function generateTempLine(DOMel, selectedDay) {
    DOMel.append('g')
      .attr('id', 'temp')
      .append('line')
      .attr('class', 'daycompare')
      .attr('x1', 0)
      .attr('x2', boundedWith)
      .attr('y1', yScale(selectedDay.humidity))
      .attr('y2', yScale(selectedDay.humidity))
    DOMel.append('g')
      .attr('id', 'temptext')
      .append("text")
      .attr("x", boundedWith - 35)
      .attr("y", yScale(selectedDay.humidity) - 10)
      .style("font-size", "16px")
      .attr('fill', 'orange')
      .text(`${(selectedDay.humidity * 100).toFixed(0)}%`);
  }

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
  let q1 = d3.quantile(array.map(function (g) {
    return g.humidity;
  }).sort(d3.ascending), .25)
  let median = d3.quantile(array.map(function (g) {
    return g.humidity;
  }).sort(d3.ascending), .5)
  let q3 = d3.quantile(array.map(function (g) {
    return g.humidity;
  }).sort(d3.ascending), .75)
  let interQuantileRange = q3 - q1
  let min = d3.min(array.map(function (g) {
    return g.humidity;
  }))
  let max = d3.max(array.map(function (g) {
    return g.humidity;
  }))

  return ({
    q1: q1,
    median: median,
    q3: q3,
    interQuantileRange: interQuantileRange,
    min: min,
    max: max
  })
}

function generateInfoBox(array, date) {
  console.log(array)
  if (array.season != undefined || userDate < array.date) {
    seasonDiv.innerHTML = array.season
    summary.innerHTML = array.summary
    temperature .innerHTML = ( `${((array.temperatureMax - 32) * (5/9)).toFixed(1)}°C` )
  }
}