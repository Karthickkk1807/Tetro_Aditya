const ctx = document.getElementById('productionInward').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                label: 'Production',
                data: [8, 6, 9, 4, 7],
                backgroundColor: '#3498db'
            },
            {
                label: 'Outward',
                data: [5, 4, 7, 3, 6],
                backgroundColor: '#2ecc71'
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value + ' kg';   // Y-axis label
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + ': '
                            + context.parsed.y + ' kg'; // Tooltip
                    }
                }
            }
        }
    }
});
const cty = document.getElementById('inwardTrend').getContext('2d');

new Chart(cty, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                label: 'Grey Fabric',
                data: [8, 6, 9, 4, 7],
                backgroundColor: '#3498db'
            },
            {
                label: 'Raw Matrical',
                data: [5, 4, 7, 3, 6],
                backgroundColor: '#2ecc71'
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value + ' kg';   // Y-axis label
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + ': '
                            + context.parsed.y + ' kg'; // Tooltip
                    }
                }
            }
        }
    }
});
const ctz = document.getElementById('Quotation').getContext('2d');

new Chart(ctz, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                label: 'Grey Fabric',
                data: [8, 6, 9, 4, 7],
                backgroundColor: '#3498db'
            }
           
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value ;   // Y-axis label
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + ': '
                            + context.parsed.y; // Tooltip
                    }
                }
            }
        }
    }
});


