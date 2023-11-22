document.addEventListener('DOMContentLoaded', function () {
    const prevMonthBtn = document.querySelector('#prevMonth');
    const nextMonthBtn = document.querySelector('#nextMonth');
    const currentMonthYear = document.querySelector('#currentMonthYear');
    const calendarBody = document.querySelector('#calendarBody');
    const selectedDateInput = document.querySelector('#selectedDate');
    const submitForm = document.querySelector('#submitForm')



    let currentDate = new Date(), currentMonth = currentDate.getMonth(), currentYear = currentDate.getFullYear();

    function renderCalendar() {
        calendarBody.innerHTML = '';
        const firstDay = new Date(currentYear, currentMonth, 1), lastDay = new Date(currentYear, currentMonth + 1, 0);

        currentMonthYear.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(firstDay);

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

        const selectedDate = document.getElementById('selectedDate').value;
        const selectedTime = document.getElementById('timeing').value;

        // Validate that both date and time are selected
        if (selectedDate && selectedTime) {
            // Construct the reservation object
            const reservation = {
                date: selectedDate,
                time: selectedTime
            };

            // Store the reservation object in local storage
            localStorage.setItem('reservation', JSON.stringify(reservation));

            // You can also redirect to another page or perform other actions as needed
            alert('Reservation successful!');
        } else {
            alert('Please select both date and time.');
        }
    })
});

