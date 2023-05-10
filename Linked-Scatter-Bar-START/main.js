import * as d3 from 'd3';

import './style.css';
import Scatterplot from './visualizations/Scatterplot';

let data, scatterplot, barchart;

async function startChart() {

    // Define and initialize the dispacher : Dispacher allows you to give a name/group to an event and attach event listener to this event
    const dispatcher = d3.dispatch('filerDifficulties');

    data = await d3.csv('./data/vancouver_trails.csv', rows => {
        return {
            ...rows,
            time: +rows.time,
            distance: +rows.distance
        }
    })

    // Define a scolor scale for both visualization based on the data
    const colorScale = d3.scaleOrdinal()
        //.domain([new Set(data.map(e => e.difficulty))])
        .domain(['Easy', 'Intermediate', 'Difficult'])
        .range(['#66c2a5', '#fc8d62', '#8da0cb']);

        // Create scatterplot instance
        scatterplot = new Scatterplot(data, {
            parentElement: '#scatterplot',
            colorScale
        })
        scatterplot.updateViz();

        // Create barchart instance

        // Attach event listeners
}

startChart();