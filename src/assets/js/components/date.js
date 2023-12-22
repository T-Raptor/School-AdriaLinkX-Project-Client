// date.js
"use strict";
function createCalendar(selector) {
    const target = document.querySelector(selector);

    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const calendar = { target, month, year };

    registerMapHandlers(calendar, target);

    renderCalendar(calendar);
    return calendar;
}

function registerMapHandlers(calendar, target) {
    const btnPrevious = target.querySelector(".previous");
    btnPrevious.addEventListener("click", function(e) {
        e.preventDefault();
        goToPreviousMonth(calendar);
    });

    const btnNext = target.querySelector(".next");
    btnNext.addEventListener("click", function(e) {
        e.preventDefault();
        goToNextMonth(calendar);
    });

    const body = target.querySelector(".body");
    body.addEventListener("click", function(e) {
        if (e.target.classList.contains("day")
        && e.target.innerHTML
        && !isNaN(+e.target.innerHTML)) {
            setSelectedDay(calendar, e.target);
        }
    });
}


function setSelectedDay(calendar, elmDay) {
    if (calendar.elmDay) {
        calendar.elmDay.classList.remove("selected");
    }
    const day = +elmDay.innerHTML;
    calendar.day = day;
    calendar.elmDay = elmDay;
    elmDay.classList.add("selected");
}


function goToNextMonth(calendar) {
    calendar.month++;
    if (calendar.month > 11) {
        calendar.month = 0;
        calendar.year++;
    }
    renderCalendar(calendar);
}

function goToPreviousMonth(calendar) {
    calendar.month--;
    if (calendar.month < 0) {
        calendar.month = 11;
        calendar.year--;
    }
    renderCalendar(calendar);
}


function renderCalendar(calendar) {
    const body = calendar.target.querySelector(".body");
    body.innerHTML = '';

    const firstDay = new Date(calendar.year, calendar.month, 1);
    const lastDay = new Date(calendar.year, calendar.month + 1, 0);

    const currentMonthYear = calendar.target.querySelector(".current");
    currentMonthYear.textContent = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    }).format(firstDay);

    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    .forEach(day => body.innerHTML += `<div class="day">${day}</div>`);

    for (let i = 1 - firstDay.getDay(); i <= lastDay.getDate(); i++) {
        const elmDay = document.createElement('div');
        elmDay.className = 'day';

        if (i > 0) {
            elmDay.textContent = i;
        }

        body.appendChild(elmDay);
    }
}


function exportDateSelection(calendar) {
    return {year: calendar.year, month: calendar.month + 1, day: calendar.day};
}


export { createCalendar, exportDateSelection };
