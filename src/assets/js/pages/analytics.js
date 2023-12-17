function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

const hoursDay = 24;
const daysMonth = 30;

async function fetchData() {


    try {
        const response = await fetch("http://localhost:8080/api/reservations");
        const data = await response.json();

        const monthlyReservations = {};

        data.forEach(entry => {
            routes = entry.route || [];


            routes.forEach(route => {
                const date = new Date(entry.periodStart);
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

                const radLat1 = toRadians(route.station1.latitude);
                const radLon1 = toRadians(route.station1.longitude);

                const radLat2 = toRadians(route.station2.latitude);
                const radLon2 = toRadians(route.station2.longitude);

                const deltaLat = radLat2 - radLat1;
                const deltaLon = radLon2 - radLon1;

                const a =
                    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const earthRadius = 6371; // Radius of the Earth in kilometers

                const distance = earthRadius * c;

                

                console.log(distance)
               // console.log(date.getFullYear(),date.getMonth() + 1)
                if (!monthlyReservations[monthKey]) {
                    monthlyReservations[monthKey] = 0;
                }

                monthlyReservations[monthKey] += (route.station1 ? 1 : 0) + (route.station2 ? 1 : 0);
                console.log(monthlyReservations)
            });
        });

        const labels = Object.keys(monthlyReservations);
        const dataValues = Object.values(monthlyReservations);

        const ctx = document.getElementById('bar-chart').getContext('2d');
        const barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels : labels,
                datasets: [{
                    label: 'Reservations/Month',
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                }],
            },
            options : {
                labels : {
                    font : {
                        size : 20
                    }
                },
                    scales : {
                        x : {
                            title : {
                                display : true,
                                font: {
                                    size : 20
                                }
                            }
                        },
                        y : {
                            title : {
                                display: true,
                                text : "Reservations (%)",
                                font : {
                                    size : 20
                                }
                            },
                            max: 100
                        }
                    }
            }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchData();







