import { getReservations } from "../api.js";

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

function getMonthlyReservationCoverage(successHandler) {

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
            labels: { font: { size: 20 } },
            scales: {
                x: { title: { display: true, font: { size: 20 } } },
                y: { title: { display: true, text: "Reservations (%)", font: { size: 20 } }, max: 100 }
            }
        }
    });
}

function fetchData() {
    getReservations(reservations => {
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

        const labels = Object.keys(monthlyReservations);
        const dataValues = Object.values(monthlyReservations);
        createMonthlyReservationGraph(labels, dataValues);
    });
}

fetchData();









