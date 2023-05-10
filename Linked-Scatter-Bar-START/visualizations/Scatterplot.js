import * as d3 from 'd3';

class Scatterplot {
    constructor(data, config) {
        this.data = data;
        // Config object with default
        this.config = {
            parentElement: config.parentElement || 'body',
            colorScale: config.colorScale,
            width: config.width || 500,
            height: config.height || 400,
            margin: config.margin || {top: 25, right: 20, bottom: 30, left: 30},
            tooltipPadding: config.tooltipPadding || 15,
            xAxisLabelPostfix: config.xAxisLabelPostfix || 'km',
            yAxisLabelPostfix: config.yAxisLabelPostfix || 'h',
            xAxisText: config.xAxisText || 'Distance',
            yAxisText: config.yAxisText || 'Time',
            dataAccessors: config.dataAccessors || {
                color:  'difficulty',
                x: 'distance',
                y: 'time'
            },
        };

        this.initViz(); // Create the chart
    }

    // Initializes the scale, axes, appends static elements (axis, title...)
    initViz() {
        const that = this;

        // Calculate the inner bounds
        that.boundedWidth = that.config.width - that.config.margin.left - that.config.margin.right;
        that.boundedHeight = that.config.height - that.config.margin.top - that.config.margin.bottom;

        // Initialize scales
        that.xScale = d3.scaleLinear()
            .range([0, that.boundedWidth]);
        that.yScale = d3.scaleLinear()
            .range([that.boundedHeight, 0]);

        // Initialize axes
        that.xAxis = d3.axisBottom(that.xScale)
            .ticks(6)
            .tickSize(-that.boundedHeight - 10)
            .tickPadding(10)
            .tickFormat((d) => `${d} ${that.config.xAxisLabelPostfix}`);
        that.yAxis = d3.axisLeft(that.yScale)
            .ticks(6)
            .tickSize(-that.boundedWidth - 10)
            .tickPadding(10)
            .tickFormat((d) => `${d} ${that.config.yAxisLabelPostfix}`)
        
        // Initialize the svg
        that.svg = d3.select(that.config.parentElement)
            .append('svg')
                .attr('width', that.config.width)
                .attr('height', that.config.height);
        // Initialize the real drawing area
        that.viz = that
            .svg.append('g')
                .attr('transform', `translate(
                    ${that.config.margin.left},
                    ${that.config.margin.top}
            )`);
        
        /**
         * STATIC ELEMTS
         */

        // axes
        that.xAxisG = that.viz.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${that.boundedHeight})`);
        that.yAxisG = that.viz.append('g')
            .attr('class', 'axis y-axis');

        // titles for both axes
        that.xAxisG.append('text')
            .attr('class', 'title axis-title')
            .attr('x', that.boundedWidth + 10)
            .attr('y', -15)
            .attr('dy', '0.71em')
            .style('text-anchor', 'end')
            .text(that.config.xAxisText)
        that.yAxisG.append('text')
            .attr('class', 'title axis-title')
            .attr('x', 5)
            .attr('y', -25)
            .attr('dy', '0.71em')
            .style('text-anchor', 'end')
            .text(that.config.yAxisText)

    }

    // updating all the dynamic propreties (x/y domain...)
    updateViz() {
        const that = this;

        that.colorAccessor = d => d[that.config.dataAccessors.color];
        that.xAccessor = d => d[that.config.dataAccessors.x];
        that.yAccessor = d => d[that.config.dataAccessors.y];

        // Set the domains for scales
        that.xScale.domain([0, d3.max(that.data, that.xAccessor)]);
        that.yScale.domain([0, d3.max(that.data, that.yAccessor)]);

        this.renderViz(); // Render the vizualisation

    }

    // render the visualization
    renderViz() {
        const that = this;

        // Add circles
        const circles = that.viz.selectAll('circle')
            .data(that.data)
            .join('circle')
                .attr('class', 'point')
                .attr('r', 4)
                .attr('cx', d => that.xScale(that.xAccessor(d)))
                .attr('cy', d => that.yScale(that.yAccessor(d)))
                .attr('fill', d => that.config.colorScale(that.colorAccessor(d)));

        // Create the axes
        that.xAxisG
            .call(that.xAxis)
            .call(g => {
                g.select('.domain').remove(); // get rid of the axis and use the markers
            })
        that.yAxisG
            .call(that.yAxis)
            .call(g => {
                g.select('.domain').remove(); // get rid of the axis and use the markers
            })
    }

}

export default Scatterplot;