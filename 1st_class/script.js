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

sel.style('background-color', '#222531')

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
console.log(sel2); // <-- return a NodeList that works like an array