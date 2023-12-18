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

    const deltaLat = Math.abs(radLat2 - radLat1);
    const deltaLon = Math.abs(radLon2 - radLon1);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const earthRadius = 6371; // in kilometers

    return earthRadius * c;
}

function fetchData() {
    getReservations(reservations => {
        const monthlyReservations = {};
        for (const reservation of reservations) {
            const route = reservation.route || [];

            for (const track of route) {
                const startDate = new Date(reservation.periodStart);
                const endDate = new Date(reservation.periodStop);




                const monthKey = `${startDate.getFullYear()}-${startDate.getMonth() + 1}`;
                const distance = getTrackLength(track);

                const startTimestamp = new Date(startDate).getTime();
                const stopTimestamp = new Date(endDate).getTime();


                const durationMs = stopTimestamp - startTimestamp;


                const durationHours = durationMs / (1000 * 60 * 60);
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

        const ctx = document.getElementById('bar-chart').getContext('2d');
        const barChart = new Chart(ctx, {
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
                labels: {
                    font: {
                        size: 20
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            font: {
                                size: 20
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Reservations (%)",
                            font: {
                                size: 20
                            }
                        },
                        max: 100
                    }
                }
            }
        });
    });
}

fetchData();









