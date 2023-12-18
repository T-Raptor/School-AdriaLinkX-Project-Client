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
           const routes = entry.route || [];


            routes.forEach(route => {

                const startDate = new Date(entry.periodStart);
                const endDate = new Date(entry.periodStop);


                const monthKey = `${startDate.getFullYear()}-${startDate.getMonth() + 1}`;

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

                const startTimestamp = new Date(startDate).getTime();
                const stopTimestamp = new Date(endDate).getTime();


                const durationMs = stopTimestamp - startTimestamp;


                const durationHours = durationMs / (1000 * 60 * 60);
                const reservedTime = distance * durationHours ;
                const availableTime = hoursDay * daysMonth * distance;
                const percentage  = reservedTime /availableTime * 100 ;

                if (!monthlyReservations[monthKey]) {
                    monthlyReservations[monthKey] = 0;
                }

                monthlyReservations[monthKey] += (percentage);
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



async function fetchEventsData() {
    try {
        const response = await fetch("http://localhost:8080/api/events");
        const data = await response.json();

        console.log(data);

        data.forEach(event => {
            const incident = event.target;
            console.log(incident);
        });

    }catch (error) {
        console.error("Error fetching incidents data ",error);
    }

    }

fetchEventsData();




