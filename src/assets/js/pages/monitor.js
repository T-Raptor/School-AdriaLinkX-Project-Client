"use strict";

import { createMap, drawShuttle, fetchAndDrawStationsAndTracks, getEntity, updateShuttle } from "../components/map.js";
import { getEvents } from "../api.js";


document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map);
    renderShuttles(map);

}

// Shuttles
function renderShuttles(map) {
    fetchAndRenderShuttles(map);
    setInterval(() => fetchAndRenderShuttles(map), 5000);
}

function fetchAndRenderShuttles(map) {
    const movingShuttle = {
        subject: 'MOVE',
    };

    getEvents((shuttles) => {
        const shuttleList = prepareShuttleList(shuttles);
        renderShuttleList(shuttleList);
        drawAndUpdateShuttles(map, shuttles);
    }, movingShuttle);
}

function prepareShuttleList(shuttles) {
    return shuttles.map((shuttle) => ({
        id: shuttle.id,
        name: `Tempname #${Math.floor(Math.random() * 100)}`
    }));
}

function renderShuttleList(shuttleList) {
    const shuttleListElement = document.querySelector("#shuttles");

    shuttleListElement.innerHTML = shuttleList.map((shuttle) => `
            <ul data-id="${shuttle.id}">
                <li>${shuttle.name}</li>
            </ul>`
    ).join("");
}

function drawAndUpdateShuttles(map, events) {
    const uniqueIds = getUniqueIds(events);
    uniqueIds.forEach((id) => {
        const move = getLastMoveForId(events, id);
        const ent = getEntity(map, "shuttles", id);

        if (ent === null) {
            drawShuttle(map, move.target.id, [move.latitude, move.longitude]);
        } else {
            updateShuttle(ent, [move.latitude, move.longitude]);
        }
    });
}

function getUniqueIds(events) {
    return [...new Set(
        events
            .filter((event) => event.subject === "MOVE")
            .map((event) => event.target.id)
    )];
}

function getLastMoveForId(events, id) {
    return events.find(
        (event) => event.subject === "MOVE" && event.target.id === id
    ) || null;
}



// Notices
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
