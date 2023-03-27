// ================================================================  
// ================================================================



let cities = [
    { name: 'London', population: 8674000},
    { name: 'New York', population: 8406000},
    { name: 'Sydney', population: 4293000},
    { name: 'Paris', population: 2244000},
    { name: 'Beijing', population: 11510000}];

const svg = d3.select('#Section1 > svg')
    .selectAll('circle')
    .data(cities)
    .join('circle')
    .attr('cx', function (d, i) {
        return i * 100 + 45;
    })
    .attr('cy', 100)
    .attr('r', function (d) {
        return d.population * 0.000004;
    })
    .style('fill', 'crimson')

