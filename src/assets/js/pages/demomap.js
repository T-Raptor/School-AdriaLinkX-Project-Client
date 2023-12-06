"use strict";
import { createMap, drawStation } from "../components/map.js";

document.addEventListener("DOMContentLoaded", init);
function init() {
    createMap("centra-map");
    setInterval(moveAndUpdate, 50);
}

function moveAndUpdate() {
    applyRandomMovement();
    updateShuttles();
}





const shuttles = [
    "AE6-C72-EFA",
    "ADD-BB2-47D"
];

const locShuttles = {
    "AE6-C72-EFA": [106.8478695, -6.1568562],
    "ADD-BB2-47D": [56.8478695, -6.1568562]
};


const ftShuttles = {};



function applyRandomMovement() {
    shuttles.forEach(shuttle => {
        locShuttles[shuttle][0] += Math.random()*2-1;
        locShuttles[shuttle][1] += Math.random()*2-1;
    })
}

function updateShuttles() {
    for (const shuttle of shuttles) {
        ftShuttles[shuttle].getGeometry().setCoordinates(
            ol.proj.fromLonLat(locShuttles[shuttle])
        );
    }
}
