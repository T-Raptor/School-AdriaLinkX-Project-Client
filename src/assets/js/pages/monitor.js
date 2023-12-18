"use strict";

import { createMap, drawShuttle, fetchAndDrawStationsAndTracks, getEntity, updateShuttle, drawBreak, drawWarning } from "../components/map.js";
import { getEvents, getTracks } from "../api.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map);
    renderEntities(map, "MOVE", drawAndUpdateShuttles, "shuttles");
    renderEntities(map, "BREAK", drawAndUpdateNotices, "notices");
    renderEntities(map, "WARN", drawAndUpdateNotices, "notices");
}

// Shuttles
function renderEntities(map, eventType, drawAndUpdateFunction, elementId) {
    fetchAndRenderEntities(map, eventType, drawAndUpdateFunction, elementId);
    setInterval(() => fetchAndRenderEntities(map, eventType, drawAndUpdateFunction, elementId), 5000);
}

function fetchAndRenderEntities(map, eventType, drawAndUpdateFunction, elementId) {
    const eventObject = {
        subject: eventType,
    };

    getEvents((entities) => {
        const entityList = prepareEntityList(entities);
        renderEntityList(entityList, elementId);
        drawAndUpdateFunction(map, entities, eventType);
    }, eventObject);
}

function prepareEntityList(entities) {
    return entities.map((entity) => ({
        id: entity.id,
        name: `Tempname #${Math.floor(Math.random() * 100)}`
    }));
}

function renderEntityList(entityList, elementId) {
    const entityListElement = document.querySelector(`#${elementId}`);
    entityListElement.innerHTML = entityList.map((entity) => `
        <ul data-id="${entity.id}">
            <li>${entity.name}</li>
        </ul>`
    ).join("");
}

function drawAndUpdateShuttles(map, entities) {
    const uniqueIds = getUniqueIds(entities);
    uniqueIds.forEach((id) => {
        const move = getLastMoveForId(entities, id);
        const ent = getEntity(map, "shuttles", id);

        if (ent === null) {
            drawShuttle(map, move.target.id, [move.latitude, move.longitude]);
        } else {
            updateShuttle(ent, [move.latitude, move.longitude]);
        }
    });
}

function getUniqueIds(entities) {
    return [...new Set(
        entities
            .filter((entity) => entity.subject === "MOVE")
            .map((entity) => entity.target.id)
    )];
}

function getLastMoveForId(entities, id) {
    return entities.find(
        (entity) => entity.subject === "MOVE" && entity.target.id === id
    ) || null;
}

// Notices
function drawAndUpdateNotices(map, entities, eventType) {
    entities.forEach(async (notice) => {
        try {
            const entity = getEntity(map, eventType === "BREAK" ? "breaks" : "warnings", notice.id);

            if (entity === null) {
                const trackLongLat = await getLonLatFromTrackId(notice.target.id);

                if (eventType === "BREAK") {
                    drawBreak(map, notice.id, [trackLongLat.long, trackLongLat.lat]);
                } else if (eventType === "WARN") {
                    drawWarning(map, notice.id, [trackLongLat.long, trackLongLat.lat]);
                }
            }
        } catch (error) {
            console.error(error.message);
        }
    });
}

function fetchAndRenderNotices(map) {
    fetchAndRenderEntities(map, "BREAK", drawAndUpdateNotices, "notices");
    fetchAndRenderEntities(map, "WARN", drawAndUpdateNotices, "notices");
}

function getLonLatFromTrackId(trackId) {
    return new Promise((resolve, reject) => {
        getTracks((tracks) => {
            const foundTrack = tracks.find((track) => track.id === trackId);

            if (foundTrack) {
                const longLat = {
                    lat: foundTrack.station1.latitude,
                    long: foundTrack.station1.longitude
                };
                resolve(longLat);
            } else {
                reject(new Error(`Track with ID ${trackId} not found`));
            }
        });
    });
}
