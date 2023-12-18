"use strict";

import { createMap, drawShuttle, fetchAndDrawStationsAndTracks, getEntity, updateShuttle } from "../components/map.js";
import { getEvents } from "../api.js";


document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map);
    renderShuttles(map);
    renderNotices(map);
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
function renderNotices(map) {
    fetchAndRenderNotices(map);
    setInterval(() => fetchAndRenderNotices(), 5000);
}

function fetchAndRenderNotices(map) {
    getEvents((notices) => {
        const filteredNotices = notices.filter((notice) => notice.subject === "BREAK" || notice.subject === "WARN");
        const noticeList = prepareNoticeList(filteredNotices);
        renderNoticeList(noticeList);
        drawAndUpdateNotices(map, noticeList);
    });
}

function prepareNoticeList(notices) {
    return notices.map((notice) => ({
        id: notice.id,
        target: notice.target,
        type: notice.subject,
        reason: notice.reason,
    }));
}

function renderNoticeList(noticeList) {
    const noticeListElement = document.querySelector("#notices");

    noticeListElement.innerHTML = noticeList.map((notice) => {
        if (notice.type === "BREAK") {
            return `<ul data-id="${notice.id}">
                    <li>🛑<b>ALERT!</b>🛑</li>
                    <li>${notice.reason}</li>
                </ul>`;
        } else {
            return `<ul data-id="${notice.id}">
                    <li>⚠️<b>WARNING</b>⚠️</li>
                    <li>${notice.reason}</li>
                </ul>`;
        }
        }).join("");
}

function drawAndUpdateNotices(map, events) {
    return;
}
