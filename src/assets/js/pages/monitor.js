"use strict";

import { createMap, drawShuttle, fetchAndDrawStationsAndTracks, getEntity, updateShuttle, drawBreak, drawWarning, deleteEntity } from "../components/map.js";
import { getEvents, getShuttles, getTracks } from "../api.js";

const MEMORY_TIME = 30 * 1000;

document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map, () => { });

    fetchAndUpdateShuttles(map);
    fetchAndUpdateNotices(map);

    renderEntities("BREAK", "break-notices");
    renderEntities("WARN", "warn-notices");

    setInterval(updateTime, 1000);
}

const MILISECONDS_IN_HOUR = 60 * 60 * 1000;
function getTimeOffset() {
    const $offset = document.querySelector("#time-offset");
    return (24 - $offset.value) * MILISECONDS_IN_HOUR;
}

function getTimeWithOffset() {
    return (new Date()).getTime() - getTimeOffset();
}

function updateTime() {
    const $time = document.querySelector("#timedate");
    $time.innerHTML = (""+new Date(getTimeWithOffset())).split('(')[0].replace("GMT+0100", "");
}


function fetchAndUpdateShuttles(map) {
    getEvents(moves => {
        updateShuttlesMap(map, moves);
        getShuttles(shuttles => {
            updateShuttlesList(document.querySelector("#shuttles"), moves, shuttles);
            setTimeout(() => fetchAndUpdateShuttles(map), 1000);
        });
    }, {subject: "MOVE", earliest: getTimeWithOffset() - MEMORY_TIME, latest: getTimeWithOffset()});
}

function fetchAndUpdateNotices(map) {
    getEvents(warnings => {
        getEvents(async breaks => {
            const notices = warnings.concat(breaks);
            await updateNoticesMap(map, notices);
            setTimeout(() => fetchAndUpdateNotices(map), 1000);
        }, {subject: "BREAK", earliest: getTimeWithOffset() - MEMORY_TIME, latest: getTimeWithOffset()});
    }, {subject: "WARN", earliest: getTimeWithOffset() - MEMORY_TIME, latest: getTimeWithOffset()});
}


// Shuttles
function renderEntities(eventType, elementId) {
    fetchAndRenderEntities(eventType, elementId);
    setInterval(() => fetchAndRenderEntities(eventType, elementId), 5000);
}

function fetchAndRenderEntities(eventType, elementId) {
    const eventObject = {
        subject: eventType,
        earliest: getTimeWithOffset() - MEMORY_TIME,
        latest: getTimeWithOffset()
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
    drawNewNoticesMap(map, uniqueIds);
    clearOldNoticesMap(map, uniqueIds);
}

async function drawNewNoticesMap(map, uniqueIds) {
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
}

function clearOldNoticesMap(map, uniqueIds) {
    for (const entWarning of map.entities.warnings) {
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
