// Section 1
// =====================

/**
 * Single Selection
 * 
 * d3.select() -- Selecting the element it finds on the dom that match the query string (return a selection)
 * 
 * by Element name / class name / id name
 * 
 */

const sel = d3.select('#section1');

sel._groups[0][0].title = 'Hover me!';
console.log(sel);

sel.attr('title', 'Hover me!'); // better way to change an attribute <-- this is a setter

/**
 * Change a style of an html element
 * It expects either oneparameter -- name of style --> works as a getter
 * Or it expects two param -- name of style + new value --> works as a setter
 */

sel.style('background-color', '#efefef')

/**
 * Method chaining THE WAY TO DO IT


d3.select('#section1')
    .attr('title', 'Hover me!')
    .style('background-color', '#222532')

 */


// ================================================================  
// ================================================================

/** 
 * Multi Selection for querySelectorAll - return a list of element
 * d3.selectAll('...)
 * 
 * by Element name / class name / id name
 * 
 */

const sel2 = d3.selectAll('p'); // would select all p
const sel3 = d3.selectAll('#section1 > p') // == d3.select('#section1).selectAll('p')

//returns a node list (kinda like an array)
console.log(sel2); // <-- return a NodeList that works like an array

// to iterate from the nodelist we dont need foreach or for loop to change all elements
//sel2.style('color', 'cornflowerblue'); // change for all elements

// ================================================================  
// ================================================================

/**
 * Dynamic Propreties
 * 
 * Means we can provide an anonymous function as value for the style function for example in order
 * to set the style based on some arbitary or random values
 */

// !!!!! FAT ARROW FUNCTION as opposed to anonymous (see below) lose the THIS

sel3.style('color',
    function (d, i, nodes) {
        // console.log(d, i, nodes);
        return `hsl(${Math.ceil(Math.random() * 360)}, 100%, 50%)`;
    }
)

// ================================================================  
// ================================================================

/**
 * Repeat Selections and learn methods on selections
 * 
 * Methods:
 *      .attr() --> Changes an Attribute of HTML or SVG element
 *      .style() --> Changes the Style of HTML or SVG element
 *      .classed() --> Toggle a class
 *      .property() --> Toggle a property
 *      .text() --> To set the innerText attribute
 *      .html() --> To set the innerHTML attribute
 */

d3.select('#section2').select('p').html('<strong>have a nice day!</strong>').classed('specialText', true)

const sun = d3.select('#section2')
    .append('span') // append also change the selection, so all chanmge woul apply to the span
        .classed('specialText', true)
        .text('Its sunny :)')


// ================================================================  
// ================================================================

/**
 * Data Binding
 * 
 * In D3 we bind data by using .data() function, which attaches an Array of values
 * (may be numbers, strings, objects, etc.) to each element of a selection.
 */

const dataSet = [10, 25, 8, 40, 32, 12, 18];
const selDataBinding = d3.selectAll('#section3 > p')
    .data(dataSet) // give an enter (what should be given by the provided array) and exit (what has been given) // return a __data__ element bind to the element
    //.datum(dataSet) // attach the entire array as data to each p
    .style('font-size', function (d, i, node) {
        return d + 'pt'
    })
    .text(function (d) {
        return `My font size is ${d}pt`
    })

console.log('Data binding selection: ', selDataBinding)

// ================================================================  
// ================================================================

/**
 * Enter, Update, Exit - OLD
 * 
 * Methods:
 *  .enter() --> for enter selection
 *  .exit() --> for exit selection
 * 
 * The default selection is the update selection (_groups)
 */

// const fontSizes = [6, 10, 25, 30, 12, 39, 8, 4];

// const u = d3.select('#section4')
//     .selectAll('p')
//     .data(fontSizes);
// u.style('background-color', 'red')

// const e = u
//     .enter() //select the enter, _groups got no p yet
//     .append('p') // create <p></p> for all element of the array
//     .style('background-color', 'blue');


// u.merge(e)
//     .style('font-size', function (d, i, node) {
//         return d + 'pt'
//     })
//     .text(function (d) {
//         return `I have a font size of ${d}pt`
//     })

// console.log(u)

/**
 * Enter, Update, Exit - NEW
 * 
 * Methods:
 *  .join()
 *  Ways of calling it:
 *      -   1 Parameter (element name) -- element to be attached and is a short way for .enter().append() and later merge
 *      -   1 Parameter to 3 Parameters -- each is an anonymous function representing the enter, update, exit selection in...
 * 
 */

const fontSizes = [6, 10, 25, 30, 12, 39, 8, 4];

const u = d3.select('#section4')
    .selectAll('p')
    .data(fontSizes)
    .join('p') //.enter().append() and later .merge()
        .append('p') 
            .style('font-size', function (d, i, node) {
                return d + 'pt'
            })
            .text(function (d) {
                return `I have a font size of ${d}pt`
            })

console.log('Selection from Section 4: ', u)

// ================================================================  
// ================================================================



let cities = [
    { name: 'London', population: 8674000},
    { name: 'New York', population: 8406000},
    { name: 'Sydney', population: 4293000},
    { name: 'Paris', population: 2244000},
    { name: 'Beijing', population: 11510000}];

const svg = d3.select('#Section5 > svg')
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

