import { getEvents, getReservations } from "../api.js";
import { createMap, setTrackStyle, fetchAndDrawStationsAndTracks } from "../components/map.js";

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

const hoursDay = 24;
const daysMonth = 30;

function getTrackLength(track) {
    const radLat1 = toRadians(track.station1.latitude);
    const radLon1 = toRadians(track.station1.longitude);

    const radLat2 = toRadians(track.station2.latitude);
    const radLon2 = toRadians(track.station2.longitude);

    const deltaLat = radLat2 - radLat1;
    const deltaLon = radLon2 - radLon1;

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const earthRadius = 6371; // in kilometers

    return earthRadius * c;
}

const MILISECONDS_IN_HOUR = 1000 * 60 * 60;

function getReservationHours(reservation) {
    const startTimestamp = new Date(reservation.periodStart).getTime();
    const stopTimestamp = new Date(reservation.periodStop).getTime();
    return Math.abs(stopTimestamp - startTimestamp) / MILISECONDS_IN_HOUR;
}

function getMonthlyReservationCoverage(reservations) {
    const monthlyReservations = {};
    for (const reservation of reservations) {
        const route = reservation.route || [];

        for (const track of route) {
            const startDate = new Date(reservation.periodStart);
            const monthKey = `${startDate.getFullYear()}-${startDate.getMonth() + 1}`;

            const distance = getTrackLength(track);
            const durationHours = getReservationHours(reservation);

            const reservedTime = distance * durationHours;
            const availableTime = hoursDay * daysMonth * distance;
            const percentage = reservedTime / availableTime * 100;

            if (!monthlyReservations[monthKey]) {
                monthlyReservations[monthKey] = 0;
            }

            monthlyReservations[monthKey] += (percentage);
        }
    }
    return monthlyReservations;
}

function createMonthlyReservationGraph(labels, dataValues) {
    const ctx = document.getElementById('bar-chart').getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Reservations/Month',
                data: dataValues,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
            }],
        },
        options: {
            labels: {font: {size: 20}},
            scales: {
                x: {title: {display: true, font: {size: 20}}},
                y: {title: {display: true, text: "Reservations (%)", font: {size: 20}}, max: 100}
            }
        }
    });
}

function fetchAndDrawReservationCoverage() {
    getReservations((reservations) => {
        const coverage = getMonthlyReservationCoverage(reservations);
        const labels = Object.keys(coverage);
        const dataValues = Object.values(coverage);
        createMonthlyReservationGraph(labels, dataValues);
    });
}



function getIncidents(successHandler) {
    getEvents(function(events) {
        const filtered = events.filter(e => e.subject === "WARN" || e.subject === "BREAK");
        successHandler(filtered);
    });
}

function countIncidentsForPeriod(incidents, periodStart, periodStop) {
    let sumIncidents = 0;
    for (const incident of incidents) {
        const moment = incident.moment;
        if (periodStart <= moment && periodStop >= moment) {
            sumIncidents++;
        }
    }
    return sumIncidents;
}

function countIncidentsForMonth(incidents, year, month) {
    const periodStart = new Date(year, month, 1);
    const periodStop = new Date(year, month + 1, 0);
    return countIncidentsForPeriod(incidents, periodStart, periodStop);
}

function countIncidentsForAllMonths(successHandler) {
    getIncidents(function (incidents) {
        const sums = [];
        for (let i = 0; i < 12; i++) {
            sums.push(countIncidentsForMonth(incidents, 2022, i));
        }
        successHandler(sums);
    });
}

function createBarChart(data) {
    const labels = Array.from({length: 12}, (_, i) => `${i + 1}`);
    const ctx = document.getElementById('events-chart').getContext('2d');

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Incidents/Month',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
            }],
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Month', font: { size: 16 } } },
                y: { title: { display: true, text: 'Number of Incidents', font: { size: 16 } }, max :100, }
            }
        }
    });
}

function fetchAndDrawMonthlyIncidents() {
    countIncidentsForAllMonths(function (sums) {
        createBarChart(sums);
    });
}


function calculateDensity(reservations, periodStart, periodStop) {
    const routeDensity = {};

    for (const reservation of reservations) {
        const route = reservation.route || [];

        for (const track of route) {
            const routeId = track.id;

            const distance = getTrackLength(track);
            const durationHours = getReservationHours(reservation);
            const reservationStart = new Date(reservation.periodStart);
            const reservationStop = new Date(reservation.periodStop);

            if (reservationStart >= periodStart && reservationStop <= periodStop) {
                const reservedTime = distance * durationHours;

                if (!routeDensity[routeId]) {
                    routeDensity[routeId] = {
                        totalReservedTime: 0,
                        totalDistance: 0,
                    };
                }

                routeDensity[routeId].totalReservedTime += reservedTime;
                routeDensity[routeId].totalDistance += distance;
            }
        }
    }

    return routeDensity;
}

function countDensityForMonth(reservations, year, month) {
    const periodStart = new Date(year, month - 1, 1);
    const periodStop = new Date(year, month, 0);
    return calculateDensity(reservations, periodStart, periodStop);
}

const STYLE_TRACK_FULL = new ol.style.Style({
    fill: new ol.style.Fill({ color: "#ff0000" }),
    stroke: new ol.style.Stroke({ color: "#00ff00", width: 4 })
});

const STYLE_TRACK_BUSY = new ol.style.Style({
    fill: new ol.style.Fill({ color: "#ffff66" }),
    stroke: new ol.style.Stroke({ color: "#ffff66", width: 4 })
});

const STYLE_TRACK_CALM = new ol.style.Style({
    fill: new ol.style.Fill({ color: "#0000ff" }),
    stroke: new ol.style.Stroke({ color: "#00ff00", width: 4 })
});

async function wrapAsync(f) {
    return new Promise(r => f(r));
}

const HOURS_IN_MONTH = 672;
function fetchAndDrawRouteDensity(map) {
    getReservations((reservations) => {
        const year = 2022;
        const month = 5;
        const densityForMonth = countDensityForMonth(reservations, year, month);
        console.log(`Density of Use for ${year}-${month}:`, densityForMonth);
        console.log(map.entities.tracks);
        for (const track of Object.keys(densityForMonth)) {
            const density = densityForMonth[track].totalReservedTime / densityForMonth[track].totalDistance / HOURS_IN_MONTH;
            if (density > 0.8) {
                setTrackStyle(map, +track, STYLE_TRACK_FULL);
            } else if (density > 0.5) {
                setTrackStyle(map, +track, STYLE_TRACK_BUSY);
            } else {
                setTrackStyle(map, +track, STYLE_TRACK_CALM);
            }
        }
    });
}


document.addEventListener("DOMContentLoaded", async function () {
    fetchAndDrawMonthlyIncidents();
    fetchAndDrawReservationCoverage();

    const map = createMap("density-map");
    await wrapAsync(successHandler => fetchAndDrawStationsAndTracks(map, successHandler));
    fetchAndDrawRouteDensity(map);
});
