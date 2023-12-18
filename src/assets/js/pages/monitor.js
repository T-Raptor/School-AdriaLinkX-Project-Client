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
        renderEntityList(entityList, eventType, elementId);
        drawAndUpdateFunction(map, entities, eventType);
    }, eventObject);
}

function prepareEntityList(entities) {
    return entities.map((entity) => {
        let params = {};

        if (entity.subject === "MOVE") {
            params = {
                name: `Tempname #${Math.floor(Math.random() * 100)}`,
            };
        } else if (entity.subject === "BREAK" || entity.subject === "WARN") {
            params = {
                target: entity.target,
                type: entity.subject,
                reason: entity.reason,
            };
        }
        return {
            id: entity.id,
            ...params,
        };
    });
}

function renderEntityList(entityList, eventType, elementId) {
    const entityListElement = document.querySelector(`#${elementId}`);

    entityList.forEach((entity) => {
        const existingElement = entityListElement.querySelector(`[data-id="${entity.id}"]`);

        if (!existingElement) {
            const html = generateHtml(entity, eventType);
            entityListElement.insertAdjacentHTML('beforeend', html);
        }
    });
}

function generateHtml(entity, eventType) {
    switch (eventType) {
        case "MOVE":
            return `<ul data-id="${entity.id}">
                        <li>${entity.name}</li>
                    </ul>`;
        case "WARN":
            return `<ul data-id="${entity.id}">
                        <li>⚠️<b>WARNING!</b>⚠️</li>
                        <li>${entity.reason}</li>
                    </ul>`;
        case "BREAK":
            return `<ul data-id="${entity.id}">
                        <li>🛑<b>ALERT!</b>🛑</li>
                        <li>${entity.reason}</li>
                    </ul>`;
        default:
            return "";
    }
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
            if (notice.subject === eventType) {
                const entity = getEntity(map, eventType === "BREAK" ? "breaks" : "warnings", notice.id);

                if (entity === null) {
                    const trackLongLat = await calculateMiddleTrack(notice.target.id);

                    if (eventType === "BREAK") {
                        drawBreak(map, notice.id, [trackLongLat.long, trackLongLat.lat]);
                    } else if (eventType === "WARN") {
                        drawWarning(map, notice.id, [trackLongLat.long, trackLongLat.lat]);
                    }
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

function calculateMiddleTrack(trackId) {
    return new Promise((resolve, reject) => {
        getTracks((tracks) => {
            const foundTrack = tracks.find((track) => track.id === trackId);

            if (foundTrack) {
                const midpoint = calculateMidpointBetweenStations(foundTrack.station1, foundTrack.station2);
                resolve(midpoint);
            } else {
                reject(new Error(`Track with ID ${trackId} not found`));
            }
        });
    });
}

function calculateMidpointBetweenStations(station1, station2) {
    return {
        lat: (station1.latitude + station2.latitude) / 2,
        long: (station1.longitude + station2.longitude) / 2,
    };
}
