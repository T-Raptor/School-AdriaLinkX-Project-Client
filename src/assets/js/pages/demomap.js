"use strict";
import { createMap, drawStation, drawShuttle, updateShuttle } from "../components/map.js";

document.addEventListener("DOMContentLoaded", init);
function init() {
    const map = createMap("centra-map");

    stations.forEach(station => {
        drawStation(map, station, locStations[station]);
    });

    shuttles.forEach(shuttle => {
        entShuttles[shuttle] = drawShuttle(map, shuttle, locShuttles[shuttle]);
    });

    setInterval(moveAndUpdate, 50);
}

function moveAndUpdate() {
    applyRandomMovement();
    updateShuttles();
}


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
