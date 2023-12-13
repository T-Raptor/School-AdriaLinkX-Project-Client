"use strict";
import { createMap, drawStation, drawShuttle, updateShuttle, drawTrack, drawWarning, drawBreak } from "../components/map.js";
import { createRoutePicker } from "../components/routepicker.js";

document.addEventListener("DOMContentLoaded", init);
function init() {
    const map = createMap("centra-map");

    stations.forEach(station => {
        entStations[station] = drawStation(map, station, locStations[station]);
    });

    shuttles.forEach(shuttle => {
        entShuttles[shuttle] = drawShuttle(map, shuttle, locShuttles[shuttle]);
    });

    tracks.forEach(track => {
        const nameStation1 = track[0];
        const nameStation2 = track[1];
        drawTrack(map, entStations[nameStation1], entStations[nameStation2]);
    });

    notices.forEach(notice => {
        const name = notice.name;
        const location = notice.location;
        if (notice.type === "warning") {
            drawWarning(map, name, location);
        } else {
            drawBreak(map, name, location);
        }
    });

    const routePicker = createRoutePicker(map);

    setInterval(moveAndUpdate, 50);
}

function moveAndUpdate() {
    applyRandomMovement();
    updateShuttles();
}


const notices = [
    {"name": 5, "location": [16.34878, 50.85045], "type": "warning"},
    {"name": 6, "location": [30.3522, 48.8566], "type": "break"},
];


const stations = [
    "Adria",
    "Bdria",
    "Cdria",
    "Ddria"
];

const locStations = {
    "Adria": [4.34878, 50.85045],
    "Bdria": [2.3522, 48.8566],
    "Cdria": [-0.1276, 51.5074],
    "Ddria": [10.7522, 59.9139]
};

const entStations = {};


const tracks = [
    ["Adria", "Bdria"],
    ["Bdria", "Cdria"],
    ["Cdria", "Adria"],
    ["Adria", "Ddria"]
];


const shuttles = [
    "AE6-C72-EFA",
    "ADD-BB2-47D"
];

const locShuttles = {
    "AE6-C72-EFA": [106.8478695, -6.1568562],
    "ADD-BB2-47D": [56.8478695, -6.1568562]
};

const entShuttles = {};



function applyRandomMovement() {
    shuttles.forEach(shuttle => {
        locShuttles[shuttle][0] += Math.random()*2-1;
        locShuttles[shuttle][1] += Math.random()*2-1;
    });
}

function updateShuttles() {
    for (const shuttle of shuttles) {
        updateShuttle(entShuttles[shuttle], locShuttles[shuttle]);
    }
}
