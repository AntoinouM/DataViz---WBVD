const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const monthDiv = document.getElementById('month');
let index = 0;

monthDiv.addEventListener('wheel', modifyIndexOnScroll);

function modifyIndexOnScroll(event) {
    if (checkScrollDirectionIsUp(event)) {  // UP
        if (index >= 30) {
            index = 30;
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


