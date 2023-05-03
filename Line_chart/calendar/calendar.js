/* ===== CONST AND VARIABLES ===== */
const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const years = [2020, 2021];
const timePeriod = [
    [
        ['dummy'],
        ['dummy'],
        Array.from({length: daysInMonth(2020, 03)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 04)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 05)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 06)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 07)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 08)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 09)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 10)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 11)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 12)}, (_, i) => i + 1),
    ],
    [
        Array.from({length: daysInMonth(2020, 01)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 02)}, (_, i) => i + 1),
        Array.from({length: daysInMonth(2020, 03)}, (_, i) => i + 1),
    ]
]
const monthDiv = document.getElementById('month');
const dayDiv = document.getElementById('day');
const yearDiv = document.getElementById('year');
const dayU = document.getElementById('dayup')
const dayD = document.getElementById('daydown')
const monthU = document.getElementById('monthup')
const monthD = document.getElementById('monthdown')
const yearU = document.getElementById('yearup')
const yearD = document.getElementById('yeardown')
const hidD = document.getElementById('hiddenDate')

let indexYear = 0;
let indexMonth = 2;
let indexDay = 0;
let dayArr = timePeriod[indexYear][indexMonth]

yearDiv.innerHTML = years[indexYear]
monthDiv.innerHTML = months[indexMonth]
dayDiv.innerHTML = dayArr[indexDay]

/* ===== REACTIVE NODES ===== */
const calendar  = {
    dateInternal: returnFormatedDate(new Date(yearDiv.innerHTML, monthDiv.innerHTML, dayDiv.innerHTML)),
    dateInternal: function(val) {},
    set date(val) {
      this.dateInternal = val;
      this.aListener(val);
    },
    get date() {
      return this.aInternal;
    },
    registerListener: function(listener) {
      this.aListener = listener;
    }
  }

  calendar.registerListener(function(val) {
    hidD.innerHTML = val
  });

let observerYear = new MutationObserver(function(mutationsList, observer) {
   if (indexYear == 0 && indexMonth <= 2) {
        indexMonth = 2
        monthDiv.innerHTML = months[indexMonth]
   } else if (indexYear == 1 && indexMonth >= 2) {
        indexMonth = 2
        monthDiv.innerHTML = months[indexMonth]
   }
   calendar.date = returnFormatedDate(new Date(yearDiv.innerHTML, monthDiv.innerHTML, dayDiv.innerHTML))
});

let observerMonth = new MutationObserver(function(mutationsList, observer) {
    dayArr = timePeriod[indexYear][indexMonth]
    if (indexDay >= dayArr[dayArr.length - 2]) {
        indexDay = dayArr[dayArr.length - 2]
        dayDiv.innerHTML = dayArr[indexDay]
    }
    if (indexYear == 0) {
        if (indexMonth >= 11) {
            indexMonth = 11;
        }
    } else {
        if (indexMonth >= 2) {
            indexMonth = 2;
        }
    }
    if (indexMonth >= 11) {
        let day = dayDiv.innerHTML;
        if (day < 10) {
            day = '0' + day;
        }
        calendar.date = `${yearDiv.innerHTML}-12-${day}`
    } else {
        calendar.date = returnFormatedDate(new Date(yearDiv.innerHTML, monthDiv.innerHTML, dayDiv.innerHTML))
    }
});

let observerDay = new MutationObserver(function(mutationsList, observer) {
    if (indexMonth >= 11) {
        let day = dayDiv.innerHTML;
        if (day < 10) {
            day = '0' + day;
        }
        calendar.date = `${yearDiv.innerHTML}-12-${day}`
    } else {
        calendar.date = returnFormatedDate(new Date(yearDiv.innerHTML, monthDiv.innerHTML, dayDiv.innerHTML))
    }
});
observerMonth.observe(monthDiv, { subtree: true, childList: true });
observerYear.observe(yearDiv, { subtree: true, childList: true });
observerDay.observe(dayDiv, { subtree: true, childList: true});
 

/* ===== EVENT HANDLERS ===== */

yearDiv.addEventListener('wheel', modifyIndexOnScrollYear);
monthDiv.addEventListener('wheel', modifyIndexOnScrollMonth);
dayDiv.addEventListener('wheel', modifyIndexOnScrollDay);

dayU.addEventListener('click', e => {
    if (indexDay < dayArr[dayArr.length - 2]) {
        indexDay += 1;
        dayDiv.innerHTML = dayArr[indexDay]
    }
})
dayD.addEventListener('click', e => {
    if (indexDay > 0) {
        indexDay -= 1;
        dayDiv.innerHTML = dayArr[indexDay]
    }
})
monthU.addEventListener('click', e => {
    if (indexYear == 0) { // max = 11
        if (indexMonth < 11) {
            indexMonth += 1;
            monthDiv.innerHTML = months[indexMonth]
        }
    } else { // max = 2
        if (indexMonth < 2) {
            indexMonth += 1;
            monthDiv.innerHTML = months[indexMonth]
        }
    }
})
monthD.addEventListener('click', e => {
    if (indexYear == 0) { // min = 2
        if (indexMonth > 2) {
            indexMonth -= 1;
            monthDiv.innerHTML = months[indexMonth]
        }
    } else { // min = 0
        if (indexMonth > 0) {
            indexMonth -= 1;
            monthDiv.innerHTML = months[indexMonth]
        }
    }
})
yearU.addEventListener('click', e => {
    if (indexYear < 1) {
        indexYear += 1;
        yearDiv.innerHTML = years[indexYear]
    }
})
yearD .addEventListener('click', e => {
    if (indexYear > 0) {
        indexYear -= 1;
        yearDiv.innerHTML = years[indexYear]
    }
})


/* ===== METHODS ===== */ 
function modifyIndexOnScrollMonth(event) {
    if (indexYear == 0) {
        if (checkScrollDirectionIsUp(event)) {  // UP
            if (indexMonth >= 11) {
                indexMonth = 11;
                monthDiv.innerHTML = months[indexMonth]
            } else {
                indexMonth = indexMonth + 1;
                monthDiv.innerHTML = months[indexMonth]
            }
        } else {                                // DOWN
            if (indexMonth <= 2) {
                indexMonth = 2;
                monthDiv.innerHTML = months[indexMonth]
            } else {
                indexMonth -= 1;
                monthDiv.innerHTML = months[indexMonth]
            }
        }
    } else {
        if (checkScrollDirectionIsUp(event)) {  // UP
            if (indexMonth >= 2) {
                indexMonth = 2;
                monthDiv.innerHTML = months[indexMonth]
            } else {
                indexMonth = indexMonth + 1;
                monthDiv.innerHTML = months[indexMonth]
            }
        } else {                                // DOWN
            if (indexMonth <= 0) {
                indexMonth = 0;
                monthDiv.innerHTML = months[indexMonth]
            } else {
                indexMonth -= 1;
                monthDiv.innerHTML = months[indexMonth]
            }
        }
    }
    function checkScrollDirectionIsUp(event) {
        if (event.wheelDelta) {
            return event.wheelDelta > 0;
        }
        return event.deltaY < 0;
    }
}

function modifyIndexOnScrollYear(event) {
    if (checkScrollDirectionIsUp(event)) {  // UP
        if (indexYear >= 1) {
            indexYear = 1;
            yearDiv.indexYear = years[indexYear]
        } else {
            indexYear = indexYear + 1;
            yearDiv.innerHTML = years[indexYear]
        }
    } else {                                // DOWN
        if (indexYear <= 0) {
            indexYear = 0;
            yearDiv.innerHTML = years[indexYear]
        } else {
            indexYear -= 1;
            yearDiv.innerHTML = years[indexYear]
        }

    }
    function checkScrollDirectionIsUp(event) {
        if (event.wheelDelta) {
            return event.wheelDelta > 0;
        }
        return event.deltaY < 0;
    }
}

function modifyIndexOnScrollDay(event) {
    if (checkScrollDirectionIsUp(event)) {  // UP
        if (indexDay >= dayArr[dayArr.length - 2]) {
            indexDay = dayArr[dayArr.length - 2];
            dayDiv.indexYear = dayArr[indexDay]
        } else {
            indexDay = indexDay + 1;
            dayDiv.innerHTML = dayArr[indexDay]
        }
    } else {                                // DOWN
        if (indexDay <= 0) {
            indexDay = 0;
            dayDiv.innerHTML = dayArr[indexDay]
        } else {
            indexDay -= 1;
            dayDiv.innerHTML = dayArr[indexDay]
        }

    }
    function checkScrollDirectionIsUp(event) {
        if (event.wheelDelta) {
            return event.wheelDelta > 0;
        }
        return event.deltaY < 0;
    }
}

function returnFormatedDate(date) {
let day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
let month = date.getMonth();
    if (date.getMonth() < 10) {
        month = `0${month}`;
    } 
let year = date.getFullYear();

return year + "-" + month + "-" + day;

}

