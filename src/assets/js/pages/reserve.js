"use strict";
import { createCalendar, exportDateSelection } from "../components/date.js";
import { createMap, fetchAndDrawStationsAndTracks } from "../components/map.js";
import { createRoutePicker, exportRouteSelection } from "../components/routepicker.js";
import { createTimePicker, exportTimeSelection } from "../components/time.js";
import { placeReservation } from "../api.js";

function mapHasValue(map) {
    return exportRouteSelection(map).length > 0;
}

function calendarHasValue(calendar) {
    return exportDateSelection(calendar).day != null;
}

function timepickerHasValue(timepicker) {
    return exportTimeSelection(timepicker).start !== Infinity;
}


document.addEventListener('DOMContentLoaded', function () {
    const map = createMap("centra-map");
    createRoutePicker(map);
    fetchAndDrawStationsAndTracks(map);

    const calendar = createCalendar(".calendar");
    const timepicker = createTimePicker(".timepicker", []);

    console.log("aaa");
    document.querySelector("#reservationForm").addEventListener("submit", function(e) {
        e.preventDefault();
        if (mapHasValue(map) && calendarHasValue(calendar) && timepickerHasValue(timepicker)) {
            const route = exportRouteSelection(map);
            const exportedDate = exportDateSelection(calendar);
            const exportedTime = exportTimeSelection(timepicker);
            const start = new Date(exportedDate.year, exportedDate.month, exportedDate.day, exportedTime.start).getTime();
            const stop = new Date(exportedDate.year, exportedDate.month, exportedDate.day, exportedTime.stop).getTime();
            const company = "Hoogle";
            e.submitter.setAttribute("disabled", "");
            e.submitter.innerHTML = "...";
            placeReservation(route, start, stop, company, () => {
                window.location.href = "/reservations.html";
            });
        }
    });
});
