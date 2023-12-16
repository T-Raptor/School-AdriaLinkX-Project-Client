"use strict";
import { createMap, fetchAndDrawStationsAndTracks } from "../components/map.js";
import { getReservations } from "../api.js";


document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map);
    displayCompanyName("Hoogle");
    displayReservations();
}


function displayReservations() {
    getReservations(reservations => {
        reservations.forEach(reservation => {
            const currentReservation = {
                id: reservation.id,
                date: formatDate(reservation.periodStart),
                start_time: formatTime(reservation.periodStart),
                timeframe: formatTime(reservation.periodStop - reservation.periodStart)
            };
            displayReservationItems(currentReservation);
        });
    });
}

function displayCompanyName(companyName) {
    const companyNameText = document.querySelector("#company-name");
    companyNameText.textContent = companyName;
}

function displayReservationItems(reservation) {
    const reservationsHTMLList = document.querySelector("#reservations");
    reservationsHTMLList.insertAdjacentHTML("beforeend",
        `<ul data-id="${reservation.id}">
            <li>#${reservation.id}</li>
            <li>${reservation.date}</li>
            <li>${reservation.start_time} + ${reservation.timeframe}</li>
        </ul>`
    );
}

function formatDate(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleString("nl-BE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
}

function formatTime(timestamp) {
    const time = new Date(timestamp);

    return time.toLocaleString("nl-BE",
        {
            hourCycle: "h24",
            hour: "2-digit",
            minute: "2-digit"
        });
}
