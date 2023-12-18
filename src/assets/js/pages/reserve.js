"use strict";
import { createCalendar } from "../components/date.js";
import { createMap, fetchAndDrawStationsAndTracks } from "../components/map.js";
import { createRoutePicker } from "../components/routepicker.js";
import { createTimePicker } from "../components/time.js";


document.addEventListener('DOMContentLoaded', function () {
    const map = createMap("centra-map");
    createRoutePicker(map);
    fetchAndDrawStationsAndTracks(map);

    createCalendar(".calendar");
    createTimePicker(".timepicker", []);
});
