"use strict";
import { createMap, fetchAndDrawStationsAndTracks } from "../components/map.js";
import { getReservations } from "../api.js";


document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map);
    displayCompanyName();
    displayReservations();
}


const tempReservations = [
    {
        id: 274,
        date: "22/11/2023",
        start_time: "12:00",
        timeframe: "03.00"
    },
    {
        id: 275,
        date: "23/11/2023",
        start_time: "19:00",
        timeframe: "02.00"
    },
    {
        id: 276,
        date: "25/11/2023",
        start_time: "07:00",
        timeframe: "09.00"
    },
    {
        id: 277,
        date: "26/11/2023",
        start_time: "15:00",
        timeframe: "01:30"
    },
    {
        id: 278,
        date: "27/11/2023",
        start_time: "11:00",
        timeframe: "04:15"
    }
];

function displayReservations() {
    const reservationsList = document.querySelector("#reservations");

    if (tempGetLocalStorageReservation()) {
        const locsto = JSON.parse(tempGetLocalStorageReservation());

        reservationsList.insertAdjacentHTML("beforeend", `<ul data-id="localStorage">
    <li>#justReserved</li>
    <li>${locsto.date}</li>
    <li>${locsto.time} + ${locsto.additionalTime}</li>
    </ul>`
        );
    }

    for (let i = 0; i < 2; i++) {
        const random = tempReservations[Math.floor(Math.random() * tempReservations.length)];
        reservationsList.insertAdjacentHTML("beforeend", `<ul data-id="${random.id}">
    <li>#${random.id}</li>
    <li>${random.date}</li>
    <li>${random.start_time} + ${random.timeframe}</li>
    </ul>`
        );
    }
}

function setCompanyName(companyName) {
    const companyNameText = document.querySelector("#company-name");

    companyNameText.textContent = companyName;
}