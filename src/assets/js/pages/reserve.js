"use strict";
import { createCalendar } from "../components/date.js";
import { createMap, fetchAndDrawStationsAndTracks } from "../components/map.js";
import { createRoutePicker } from "../components/routepicker.js";


document.addEventListener('DOMContentLoaded', function () {
    const map = createMap("centra-map");
    createRoutePicker(map);
    fetchAndDrawStationsAndTracks(map);

    const reservationForm = document.querySelector('#reservationForm');
    const submitForm = document.querySelector('#submitForm');
    const reservationDetails = document.querySelector('#reservationDetails');
    const addTimeButton = document.querySelector('#addTime');
    const additionalTimesContainer = document.querySelector('#additionalTimes');

    let timeCounter = 1;
    let additionalTime = null;

    createCalendar(".calendar");


    updateDetails();


    submitForm.addEventListener('click', function (event) {
        event.preventDefault();

        const selectedDate = document.querySelector('#selectedDate').value;
        const selectedTime = document.querySelector('#timeing').value;
        const routes = document.querySelector('#routes').value;
        const additionalTimes = document.querySelectorAll('.timeing');

        if (additionalTimes.length > 0) {

            additionalTime = additionalTimes[0].value;
        }


        if (selectedDate && selectedTime && additionalTime && routes) {
            const selectedDateTime = new Date(selectedDate + 'T' + selectedTime);
            const currentDateTime = new Date();


            if (selectedDateTime > currentDateTime) {
                const reservation = {
                    date: selectedDate,
                    time: selectedTime,
                    additionalTime: additionalTime,
                    routes: routes
                };

                localStorage.setItem('reservation', JSON.stringify(reservation));
                alert('Thank you for using AdriaLinkX. Your reservation has been placed.');
                reservationForm.style.display = 'none';
                reservationDetails.innerHTML = `
                    <p>Date: ${reservation.date}</p>
                    <p>Time: ${reservation.time}</p>
                    <p>Additional Time: ${reservation.additionalTime}</p>
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

    addTimeButton.addEventListener('click', function () {
        const newTimeLabel = document.createElement('label');
        newTimeLabel.textContent = 'Select Another Time';

        const newTimeInput = document.createElement('input');
        newTimeInput.type = 'text';
        newTimeInput.id = 'timeing' + timeCounter;
        newTimeInput.name = 'timeing';
        newTimeInput.className = 'timeing'; // Use className instead of class

        additionalTimesContainer.appendChild(newTimeLabel);
        additionalTimesContainer.appendChild(newTimeInput);

        timeCounter++;
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


function updateDetails() {
    const reservation = JSON.parse(localStorage.getItem('reservation'));
    console.log('Reservation:', reservation);
    if (reservation === null) {
        return;
    }

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








