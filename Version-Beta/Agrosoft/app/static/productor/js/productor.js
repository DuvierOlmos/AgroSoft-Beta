document.addEventListener('DOMContentLoaded', () => {
    const ventasChartCanvas = document.getElementById('ventasChart').getContext('2d');

    const ventasData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Ventas (€)',
            data: [1500, 1800, 2200, 2000, 2500, 2800, 2600, 3000, 2300, 2100, 2400, 2700],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const ventasChart = new Chart(ventasChartCanvas, {
        type: 'bar', // Puedes cambiar 'bar' por 'line', 'pie', etc.
        data: ventasData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Ventas (€)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mes'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false, // O true si quieres mostrar la leyenda
                },
                title: {
                    display: false, // O true si ya tienes un título en el HTML
                    text: 'Ventas Mensuales'
                }
            }
        }
    });
});