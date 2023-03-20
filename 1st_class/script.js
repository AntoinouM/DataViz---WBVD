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
sel2.style('color', 'cornflowerblue'); // change for all elements

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
    function(d, i, nodes) {
        // console.log(d, i, nodes);
        return `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
)

