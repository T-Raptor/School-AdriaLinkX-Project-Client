"use strict";

document.addEventListener('DOMContentLoaded', function () {
    const prevMonthBtn = document.querySelector('#prevMonth');
    const nextMonthBtn = document.querySelector('#nextMonth');
    const currentMonthYear = document.querySelector('#currentMonthYear');
    const calendarBody = document.querySelector('#calendarBody');
    const selectedDateInput = document.querySelector('#selectedDate');
    const reservationForm = document.querySelector('#reservationForm');
    const submitForm = document.querySelector('#submitForm');
    const reservationDetails = document.querySelector('#reservationDetails');


    updateDetails();


    let currentDate = new Date(),
        currentMonth = currentDate.getMonth(),
        currentYear = currentDate.getFullYear();

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

    renderCalendar();

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

    submitForm.addEventListener('click', function (event) {
        event.preventDefault();

        const selectedDate = document.querySelector('#selectedDate').value;
        const selectedTime = document.querySelector('#timeing').value;
        const routes = document.querySelector('#routes').value;


        // Validate that both date and time are selected
        if (selectedDate && selectedTime && routes) {
            const selectedDateTime = new Date(selectedDate + 'T' + selectedTime);
            const currentDateTime = new Date();

            // Compare with the current date and time
            if (selectedDateTime > currentDateTime) {
                const reservation = {
                    date: selectedDate,
                    time: selectedTime,
                    routes: routes
                };

                localStorage.setItem('reservation', JSON.stringify(reservation));
                alert('Thank you for using AdriaLinkX. Your reservation has been placed.');
                reservationForm.style.display = 'none';
                reservationDetails.innerHTML = `
                    <p>Date: ${reservation.date}</p>
                    <p>Time: ${reservation.time}</p>
                    <p>Route: ${reservation.routes}</p>
                `;
                reservationDetails.style.display = 'block';

            } else {
                alert('Please select a future date and time.');
            }
        } else {
            alert('Please select both date and time.');
        }
    });

    function showDescription() {
        const routes = document.querySelector('#routes').value;
        // routeDescription.textContent = routes;
        let description = "";

        switch (routes) {
            case "route1":
                description = "Description for Adrial A.";
                break;
            case "route2":
                description = "Description for Adrial B.";
                break;
            case "route3":
                description = "Description for Adrial C.";
                break;
            default:
                description = "Select a route to see the description.";
        }
        document.querySelector('#routeDescription').innerText = description;
    }

    document.querySelector('#routes').addEventListener('change', showDescription);
});

//get the local storage
function updateDetails() {
    const reservation = JSON.parse(localStorage.getItem('reservation'));
    console.log('Reservation:', reservation);

    if (reservation) {
        document.querySelector('#selectedDate').value = reservation.date;
        document.querySelector('#timeing').value = reservation.time;
        document.querySelector('#routes').value = reservation.routes;
    }

    const getDetailsElement = document.querySelector('#reservationDetails');
    if (getDetailsElement) {
        getDetailsElement.innerHTML = `
                <p>Date: ${reservation.date}</p>
                <p>Time: ${reservation.time}</p>
                <p>Route: ${reservation.routes}</p>
            `;
    }

}








