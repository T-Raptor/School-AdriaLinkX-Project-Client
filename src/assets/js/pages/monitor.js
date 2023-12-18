"use strict";
import { createMap, drawShuttle, fetchAndDrawStationsAndTracks } from "../components/map.js";
import { getEventsWith } from "../api.js";


document.addEventListener("DOMContentLoaded", init);

function init() {
    const map = createMap("centra-map");
    fetchAndDrawStationsAndTracks(map);
    getEventsWith("?subject=MOVE", function(events) {
        for (const event of events) {
            drawShuttle(map, event.target.serial, [event.latitude, event.longitude]);
        }
    });
    displayWarnings();
    displayShuttles();
}






const warnings = ["Track Blocked At: \n Adria &lt;-&gt; Badria",
    "Track Blocked At: \n Adria &lt;-&gt; Cedria",
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
        const random = warnings[Math.floor(Math.random() * warnings.length)];
        warningList.insertAdjacentHTML("beforeend", `<ul>
    <li>${random}</li>
    <li class="material-icons">warning</li>
    </ul>`
        );
    }

}

function displayShuttles() {
    const shuttlesList = document.querySelector("#shuttles");

    for (let i = 0; i < 2; i++) {
        const random = shuttles[Math.floor(Math.random() * shuttles.length)];
        shuttlesList.insertAdjacentHTML("beforeend", `<ul>
    <li>${random}</li>
    <li class="material-icons">train</li>
    </ul>`
        );
    }
}
