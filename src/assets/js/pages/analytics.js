async function fetchData() {
    try {
        const response = await fetch("http://localhost:8080/api/reservations");
        const data = await response.json();

        const companyReservations = data.reduce((acc, entry) => {
            const company = entry.company;
            const reservationCount = entry.route ? entry.route.length : 0;

            if (!acc[company]) {
                acc[company] = 0;
            }

            acc[company] += reservationCount;
            return acc;
        }, {});

        const ctx = document.getElementById('doughnut-chart').getContext('2d');
        const doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(companyReservations),
                datasets: [{
                    data: Object.values(companyReservations),
                    backgroundColor: [
                        'rgba(206,50,233,0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(104,255,99,0.7)',
                        'rgba(255,229,99,0.7)',
                    ],
                }],
            },
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


fetchData();
