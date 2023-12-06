"use strict";
import { createMap, drawStation } from "../components/map.js";
import { getStations } from "../api.js";


document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStations(map);
    displayCompanyName();
    displayReservations();
}

function fetchAndDrawStations(map) {
    getStations((stations) => {
        for (const station of stations) {
            drawStation(map, station.name, [station.longitude, station.latitude]);
        }
    });
}


const reservations = [
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
        const random = reservations[Math.floor(Math.random() * reservations.length)];
        reservationsList.insertAdjacentHTML("beforeend", `<ul data-id="${random.id}">
    <li>#${random.id}</li>
    <li>${random.date}</li>
    <li>${random.start_time} + ${random.timeframe}</li>
    </ul>`
        );
    }
}

function displayCompanyName() {
    const companyName = document.querySelector("#company-name");
    const company = { name: "TempComp" };

    if (JSON.parse(localStorage.getItem("company"))) {
        const company = JSON.parse(localStorage.getItem("company"));

        companyName.textContent = company.name;
    }

    companyName.textContent = company.name;
}

function tempGetLocalStorageReservation() {
    return localStorage.getItem("reservation");
}