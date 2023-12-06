"use strict";
import { createMap, drawStation, drawTrack } from "../components/map.js";
import { getStations, getTracks } from "../api.js";


document.addEventListener("DOMContentLoaded", init);
function init() {
    const map = createMap("centra-map");
    fetchAndDrawStations(map, fetchAndDrawTracks);
    displayWarnings();
    displayShuttles();
}


function fetchAndDrawStations(map, successHandler) {
    getStations((stations) => {
        const entStations = {};
        for (const station of stations) {
            entStations[station.name] = drawStation(map, station.name, [station.longitude, station.latitude]);
        }
        successHandler(map, entStations);
    });
}

function fetchAndDrawTracks(map, entStations) {
    getTracks((tracks) => {
        for (const track of tracks) {
            const entStation1 = entStations[track.station1.name];
            const entStation2 = entStations[track.station2.name];
            drawTrack(map, entStation1, entStation2);
        }
    });
}



const warnings = ["Track Blocked At: \n Adria <-> Badria",
                          "Track Blocked At: \n Adria <-> Cedria",
                          "Some heavy wind expect in Badria",
                          "Rain expected in Cedria",
                          "Storm expected in Dadria"];

const shuttles = [
    "AE4-BSD-XES",
    "AE5-DSD-XMD",
    "AE6-DBD-XSM",
    "AE8-DAB-FMX"
];

function displayWarnings() {
    const warningList = document.querySelector("#notices");

    for (let i = 0; i < 2; i++) {
        const random =  warnings[Math.floor(Math.random() * warnings.length)];
        warningList.insertAdjacentHTML("beforeend",`<ul>
    <li>${random}</li>
    <li class="material-icons">warning</li>
    </ul>`
        );}

}

function displayShuttles() {
    const shuttlesList = document.querySelector("#shuttles");

    for (let i = 0; i < 2; i++) {
        const random =  shuttles[Math.floor(Math.random() * shuttles.length)];
        shuttlesList.insertAdjacentHTML("beforeend",`<ul>
    <li>${random}</li>
    <li class="material-icons">train</li>
    </ul>`
        );
    }
}
