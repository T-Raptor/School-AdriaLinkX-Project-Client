// date.js
"use strict";

document.addEventListener("DOMContentLoaded", init);

const prevMonthBtn = document.querySelector('#prevMonth');
const nextMonthBtn = document.querySelector('#nextMonth');
const currentMonthYear = document.querySelector('#currentMonthYear');
const selectedDateInput = document.querySelector('#selectedDate');
const calendarBody = document.querySelector('#calendarBody');

let currentDate = new Date(),
    currentMonth = currentDate.getMonth(),
    currentYear = currentDate.getFullYear();

function init() {
    renderCalendar();
}


function renderCalendar() {
    calendarBody.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1),
        lastDay = new Date(currentYear, currentMonth + 1, 0);

    currentMonthYear.textContent = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    }).format(firstDay);

    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => calendarBody.innerHTML += `<div class="day">${day}</div>`);

    for (let i = 1 - firstDay.getDay(); i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';

        if (i > 0) {
            dayElement.textContent = i;
            if (currentDate.getDate() === i && currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentYear) dayElement.classList.add('current-day');

            // Add click event to capture selected date
            dayElement.addEventListener('click', function (event) {
                event.preventDefault();
                const selectedDate = new Date(currentYear, currentMonth, i + 1);
                const formattedDate = selectedDate.toISOString().split('T')[0];
                selectedDateInput.value = formattedDate;
            });
        }

        calendarBody.appendChild(dayElement);
    }
}


prevMonthBtn.addEventListener('click', function (event) {
    event.preventDefault();
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener('click', function (event) {
    event.preventDefault();
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

export { renderCalendar, prevMonthBtn, nextMonthBtn };
