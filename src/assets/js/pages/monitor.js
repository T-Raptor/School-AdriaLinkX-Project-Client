"use strict";

import { createMap, drawShuttle, fetchAndDrawStationsAndTracks, getEntity, updateShuttle, drawBreak, drawWarning, deleteEntity } from "../components/map.js";
import { getEvents, getShuttles, getTracks } from "../api.js";

const MEMORY_TIME = 10 * 1000;

document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map, () => { });

    fetchAndUpdateShuttles(map);
    fetchAndUpdateNotices(map);

    renderEntities("BREAK", "break-notices");
    renderEntities("WARN", "warn-notices");
}


function fetchAndUpdateShuttles(map) {
    getEvents(moves => {
        updateShuttlesMap(map, moves);
        getShuttles(shuttles => {
            updateShuttlesList(document.querySelector("#shuttles"), moves, shuttles);
            setTimeout(() => fetchAndUpdateShuttles(map), 1000);
        });
    }, {subject: "MOVE", earliest: new Date().getTime() - MEMORY_TIME});
}

function fetchAndUpdateNotices(map) {
    getEvents(warnings => {
        getEvents(async breaks => {
            const notices = warnings.concat(breaks);
            await updateNoticesMap(map, notices);
            setTimeout(() => fetchAndUpdateNotices(map), 1000);
        }, {subject: "BREAK", earliest: new Date().getTime() - MEMORY_TIME});
    }, {subject: "WARN", earliest: new Date().getTime() - MEMORY_TIME});
}


// Shuttles
function renderEntities(map, eventType, drawAndUpdateFunction, elementId) {
    fetchAndRenderEntities(map, eventType, drawAndUpdateFunction, elementId);
    setInterval(() => fetchAndRenderEntities(map, eventType, drawAndUpdateFunction, elementId), 5000);
}

function fetchAndRenderEntities(eventType, elementId) {
    const eventObject = {
        subject: eventType,
        earliest: new Date().getTime() - MEMORY_TIME
    };

    getEvents((entities) => {
        const entityList = prepareEntityList(entities);
        renderEntityList(entityList, eventType, elementId);
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
    entityListElement.innerHTML = entityList.map((entity) => {
        switch (eventType) {
            case "MOVE":
                return `<ul data-id="${entity.id}">
                    <li>${entity.serial}</li>
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
    }).join("");
}


function getUniqueIds(events) {
    return [...new Set(
        events.map((entity) => entity.target.id)
    )];
}

function getLastEventForId(events, id) {
    const eventsForTarget = events.filter(
        (event) => event.target.id === id
    );
    return eventsForTarget[eventsForTarget.length - 1];
}

function updateShuttlesMap(map, moveEvents) {
    const uniqueIds = getUniqueIds(moveEvents);
    for (const id of uniqueIds) {
        const move = getLastEventForId(moveEvents, id);
        const ent = getEntity(map, "shuttles", id);

        if (ent === null) {
            drawShuttle(map, move.target.id, [move.latitude, move.longitude]);
        } else {
            updateShuttle(ent, [move.latitude, move.longitude]);
        }
    }

    for (const entShuttle of map.entities.shuttles) {
        if (!uniqueIds.includes(entShuttle.name)) {
            deleteEntity(map, "shuttles", entShuttle);
        }
    }
}


function updateShuttlesList($list, moveEvents, shuttles) {
    $list.innerHTML = "";
    const uniqueIds = getUniqueIds(moveEvents);

    const shuttles_active = uniqueIds.map(id => shuttles.find(s => s.id === id));
    shuttles_active.sort((s1, s2) => s1.serial.localeCompare(s2.serial));
    for (const shuttle of shuttles_active) {
        $list.innerHTML += `<ul data-id="${shuttle.id}"><li>${shuttle.serial}</li><ul>`;
    }
}


async function updateNoticesMap(map, notices) {
    const uniqueIds = getUniqueIds(notices);
    for (const id of uniqueIds) {
        const notice = getLastEventForId(notices, id);

        if (notice.subject === "WARN") {
            const ent = getEntity(map, "warnings", notice.id);
            if (ent == null) {
                const trackLongLat = await calculateMiddleTrack(notice.target.id);
                drawWarning(map, notice.target.id, [trackLongLat.long, trackLongLat.lat]);
            }
        } else {
            const ent = getEntity(map, "breaks", notice.id);
            if (ent == null) {
                const trackLongLat = await calculateMiddleTrack(notice.target.id);
                drawBreak(map, notice.target.id, [trackLongLat.long, trackLongLat.lat]);
            }
        }
    }

    for (const entWarning of map.entities.warnings) {
        console.log(uniqueIds)
        if (!uniqueIds.includes(entWarning.name)) {
            deleteEntity(map, "warnings", entWarning);
        }
    }

    for (const entBreak of map.entities.breaks) {
        if (!uniqueIds.includes(entBreak.name)) {
            deleteEntity(map, "breaks", entBreak);
        }
    }
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
