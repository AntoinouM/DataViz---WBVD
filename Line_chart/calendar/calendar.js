const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const timePeriod = {
    2020: {
        03: Array.from({length: daysInMonth(2020, 03)}, (_, i) => i + 1),
        04: Array.from({length: daysInMonth(2020, 04)}, (_, i) => i + 1),
        05: Array.from({length: daysInMonth(2020, 05)}, (_, i) => i + 1),
        06: Array.from({length: daysInMonth(2020, 06)}, (_, i) => i + 1),
        07: Array.from({length: daysInMonth(2020, 07)}, (_, i) => i + 1),
        08: Array.from({length: daysInMonth(2020, 08)}, (_, i) => i + 1),
        09: Array.from({length: daysInMonth(2020, 09)}, (_, i) => i + 1),
        10: Array.from({length: daysInMonth(2020, 10)}, (_, i) => i + 1),
        11: Array.from({length: daysInMonth(2020, 11)}, (_, i) => i + 1),
        12: Array.from({length: daysInMonth(2020, 12)}, (_, i) => i + 1),
    },

    2021: {
        01: Array.from({length: daysInMonth(2020, 01)}, (_, i) => i + 1),
        02: Array.from({length: daysInMonth(2020, 02)}, (_, i) => i + 1),
        03: Array.from({length: daysInMonth(2020, 03)}, (_, i) => i + 1),
    }
}

console.log(timePeriod)


const monthDiv = document.getElementById('month');
let index = 0;

monthDiv.addEventListener('wheel', modifyIndexOnScroll);

function modifyIndexOnScroll(event) {
    if (checkScrollDirectionIsUp(event)) {  // UP
        if (index >= 12) {
            index = 12;
        } else {
            index = index + 1;
        }
    } else {                                // DOWN
        if (index <= 0) {
            index = 0;
        } else {
            index -= 1;
        }
    }
    console.log(index)
    function checkScrollDirectionIsUp(event) {
        if (event.wheelDelta) {
            return event.wheelDelta > 0;
        }
        return event.deltaY < 0;
    }
}


