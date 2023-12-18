"use strict";

import { createMap, fetchAndDrawStationsAndTracks } from "../components/map.js";
import { getEvents } from "../api.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map);
    renderWarnings();
    renderShuttles();

    getEvents((events) => {
        events.forEach((event) => {
            console.log(event);
        });
    });
}


function renderShuttles() {
    const movingShuttle = {
        subject: 'MOVE',
    };

    getEvents((shuttles) => {
        shuttles.forEach((shuttle) => {
            const preparedShuttle = prepareShuttleForList(shuttle);
            renderShuttleItem(preparedShuttle);
        });
    }, movingShuttle);
}

function prepareShuttleForList(shuttle) {
    const preparedShuttle = {id: shuttle.id};

    preparedShuttle.name = `Tempname #${Math.floor(Math.random() * 100)}`;

    return preparedShuttle;
}

function renderShuttleItem(shuttleItem) {
    const shuttleList = document.querySelector("#shuttles");

    shuttleList.insertAdjacentHTML("beforeend",
        `<ul data-id="${shuttleItem.id}">
            <li>${shuttleItem.name}</li>
        </ul>`
    );
}

function renderWarnings() {
    return;
}

function prepareWarningForList(warning) {
    return;
}

function renderWarningItem(warning) {
    const warningList = document.querySelector("#notices");

    for (let i = 0; i < 2; i++) {
        const random = warnings[Math.floor(Math.random() * warnings.length)];
        warningList.insertAdjacentHTML("beforeend", `<ul>
    <li>${random}</li>
    <li class="material-icons">warning</li>
    </ul>`
        );
    }

}
