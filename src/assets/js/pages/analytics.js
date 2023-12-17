async function fetchData() {
    try {
        const response = await fetch("http://localhost:8080/api/reservations");
        const data = await response.json();

        const monthlyReservations = {};

        data.forEach(entry => {
            const routes = entry.route || [];

            console.log(routes)
            routes.forEach(route => {
                const periodStart = new Date(entry.periodStart);
                const monthKey = `${periodStart.getFullYear()}-${periodStart.getMonth() + 1}`;

                if (!monthlyReservations[monthKey]) {
                    monthlyReservations[monthKey] = 0;
                }

                monthlyReservations[monthKey] += (route.station1 ? 1 : 0) + (route.station2 ? 1 : 0);
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
