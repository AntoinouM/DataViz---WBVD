import './style.css';
import * as d3 from 'd3';

/* ======= CHART CHECKILIST ========
- [ ] `Access data` -- Define how we access the values
- [ ] `Create chart dimensions` -- Declare the physical chart parameters
- [ ] `Draw canvas` -- Render the wrapper and bounds element
- [ ] `Create scales` -- Create scales for every visualized attribute
- [ ] `Draw data` -- Render the data elements
- [ ] `Draw peripherals` -- Render the axes, labels, legends, annotations, etc
- [ ] `Set up interactions` -- Initialize event listeners and create interaction behavior
*/

const data = d3.csv('./data/dataSet.csv');
console.log(data);

