"use strict";

import { createMap, fetchAndDrawStationsAndTracks } from "../components/map.js";
import { getReservations } from "../api.js";
import { requireIdentity } from "../storage.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map);
    const currentCompany = checkAndRetrieveCompany();
    displayReservations(currentCompany);
}

function displayReservations(currentCompany) {
    getReservations((reservations) => {
        reservations.forEach((reservation) => {
            if (currentCompany === "Admin" || reservation.company === currentCompany) {
                const displayedReservation = prepareDisplayedReservation(reservation);
                renderReservationItems(displayedReservation);
            }
        });
    });
}

function checkAndRetrieveCompany() {
    const companyName = requireIdentity();
    showCompanyName(companyName);
    return companyName;
}

function showCompanyName(companyName) {
    const companyNameText = document.querySelector("#company-name");
    companyNameText.textContent = companyName;
}

function renderReservationItems(reservation) {
    const reservationsHTMLList = document.querySelector("#reservations");
    reservationsHTMLList.insertAdjacentHTML("beforeend",
        `<ul data-id="${reservation.id}">
            ${reservation.company ? `<li><b>${reservation.company}</b></li>` : ''}
            <li>#${reservation.id}</li>
            <li>${reservation.date}</li>
            <li>${reservation.start_time} - ${reservation.stop_time}</li>
        </ul>`
    );
}

function prepareDisplayedReservation(reservation) {
    const isAdmin = localStorage.getItem("companyName") === "Admin";

    return {
        id: reservation.id,
        date: formatDate(reservation.periodStart),
        start_time: formatTime(reservation.periodStart),
        stop_time: formatTime(reservation.periodStop),
        timeframe: formatTime(reservation.periodStop - reservation.periodStart),
        ...(isAdmin ? { company: reservation.company } : {})
    };
}

function formatDate(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleString("nl-BE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function formatTime(timestamp) {
    const time = new Date(timestamp);

    return time.toLocaleString("nl-BE", {
        hourCycle: "h24",
        hour: "2-digit",
        minute: "2-digit"
    });
}
