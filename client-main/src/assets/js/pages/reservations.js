"use strict";
import { createMap, fetchAndDrawStationsAndTracks } from "../components/map.js";


document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map);
    displayCompanyName();
    displayReservations();
    const routePicker = createRoutePicker(map);
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

function createRoutePicker(map) {
    const routePicker = {map: map, selection: []};

    map.olMap.on("click", function (e) {
        map.olMap.forEachFeatureAtPixel(e.pixel, function (feat, layer) {
            if (map.lyrTracks === layer) {
                const entity = trackFeatureToEntity(map, feat);
                if (entity.selected) {
                    entity.selected = false;
                    feat.setStyle();
                } else {
                    entity.selected = true;
                    feat.setStyle(MARKER_TRACK_SELECTED_STYLE);
                }
            }
        });
    });

    return routePicker;
}
