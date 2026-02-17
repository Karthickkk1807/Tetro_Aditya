const ctx = document.getElementById('productionInward').getContext('2d');

new Chart(ctx, {
    type: 'line',   // 🔁 changed from 'bar' to 'line'
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                label: 'Production',
                data: [3, 6, 4, 6, 7],
                backgroundColor: '#3498db',
                borderColor: '#3498db',
                tension: 0.4,        // smooth line
                fill: false          // no area fill
            },
            {
                label: 'Outward',
                data: [5, 4, 7, 3, 6],
                backgroundColor: '#2ecc71',
                borderColor: '#2ecc71',
                tension: 0.4,
                fill: false
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
                        return value + ' kg';
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + ': '
                            + context.parsed.y + ' kg';
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
                backgroundColor: 'grey'
            },
            {
                label: 'Raw Matrical',
                data: [5, 4, 7, 3, 6],
                backgroundColor: 'purple'
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
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
            {
                label: 'Quotation',
                data: [8, 6, 9, 4, 7, 10],
                backgroundColor: 'blue'
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
                        return value;   // Y-axis label
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false   // ✅ hides "Quotation" label
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.parsed.y;
                    }
                }
            }
        }
    }
});

const clientData = [
    { name: "Client A", kg: 120 },
    { name: "Client B", kg: 90 },
    { name: "Client C", kg: 60 },
    { name: "Client D", kg: 30 }
];

// Total KG
const totalKg = clientData.reduce((sum, item) => sum + item.kg, 0);

// Prepare chart data
const labels = clientData.map(item => item.name);
const dataKg = clientData.map(item => item.kg);
const percentages = clientData.map(item =>
    ((item.kg / totalKg) * 100).toFixed(1)
);

const clientChart = document.getElementById('clientInfoChart').getContext('2d');

new Chart(clientChart, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            data: dataKg,
            backgroundColor: [
                '#4e73df',
                '#1cc88a',
                '#f6c23e',
                '#e74a3b'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',   // 👈 labels on right
                align: 'center'
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems) {
                        return tooltipItems[0].label;
                    },
                    label: function (context) {
                        const kg = context.raw;
                        const percent = percentages[context.dataIndex];
                        return `KG: ${kg} (${percent}%)`;
                    }
                }
            }
        }
    }
});




// Total KG
const totalFinishKg = clientData.reduce((sum, item) => sum + item.kg, 0);

// Prepare chart data
const finshlabels = clientData.map(item => item.name);
const finishdataKg = clientData.map(item => item.kg);
const finishpercentages = clientData.map(item =>
    ((item.kg / totalFinishKg) * 100).toFixed(1)
);

const finish = document.getElementById('finishClient').getContext('2d');

new Chart(finish, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            data: dataKg,
            backgroundColor: [
                '#4e73df',
                '#1cc88a',
                '#f6c23e',
                '#e74a3b'
            ],
            borderWidth: 2,           // 🔥 Increase border thickness
            borderColor: '#ffffff'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
            legend: {
                display: true,        // ✅ show legend
                position: 'right',    // ✅ right side
                align: 'center'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const kg = context.raw;
                        const percent = percentages[context.dataIndex];
                        return `KG: ${kg} (${percent}%)`;
                    }
                }
            }
        }
    }
});

//var percentValue = 85.8;

//var percentageChart = $('#percentageChart')[0].getContext('2d');

//new Chart(percentageChart, {
//    type: 'doughnut',
//    data: {
//        datasets: [{
//            data: [percentValue, 100 - percentValue],
//            backgroundColor: [
//                '#1296f0',
//                '#e6e6e6'
//            ],
//            borderWidth: 0
//        }]
//    },
//    options: {
//        responsive: true,              // ✅ native responsiveness
//        maintainAspectRatio: true,     // ✅ auto resize
//        aspectRatio: 1,                // ✅ keeps circle
//        cutout: '75%',
//        rotation: -90,
//        plugins: {
//            legend: { display: false },
//            tooltip: { enabled: false }
//        }
//    },
//    plugins: [{
//        id: 'centerText',
//        afterDraw: function (chart) {
//            var ctx = chart.ctx;
//            var width = chart.width;
//            var height = chart.height;

//            ctx.save();

//            // 🔹 font auto scales
//            var fontSize = (height / 5).toFixed(0);
//            ctx.font = 'bold ' + fontSize + 'px Arial';
//            ctx.fillStyle = '#7a7a7a';
//            ctx.textAlign = 'center';
//            ctx.textBaseline = 'middle';

//            ctx.fillText(percentValue + '%', width / 2, height / 2);
//            ctx.restore();
//        }
//    }]
//});



document.addEventListener("DOMContentLoaded", function () {

    const value = 92;                 
    const whiteStartPercent = 40;     

    const canvas = document.getElementById('productionGaugChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, 100 - value],
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { chartArea } = chart;
                    if (!chartArea) return;

                    const gradient = ctx.createLinearGradient(
                        chartArea.left,
                        chartArea.top,
                        chartArea.right,
                        chartArea.top
                    );

                    if (value <= whiteStartPercent) {
                        gradient.addColorStop(0, '#2ecc71');
                        gradient.addColorStop(1, '#1e8449');
                    } else {
                        const whiteStart = whiteStartPercent / value;
                        gradient.addColorStop(0, '#2ecc71');
                        gradient.addColorStop(whiteStart, '#2ecc71');
                        gradient.addColorStop(1, '#ffffff');
                    }

                    return [gradient, '#e5e5e5'];
                },
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            rotation: -90,          
            circumference: 180,     
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        },
        plugins: [{
            id: 'gaugeNeedle',
            afterDraw(chart) {

                const ctx = chart.ctx;
                const arc = chart.getDatasetMeta(0).data[0];

                const cx = arc.x;
                const cy = arc.y;
                const radius = arc.outerRadius;

                const angle = Math.PI * (value / 100) - Math.PI;

                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);

                // Needle
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(radius - 15, 0);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#222';
                ctx.stroke();

                // Needle center dot
                ctx.beginPath();
                ctx.arc(0, 0, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#222';
                ctx.fill();

                ctx.restore();

                // Center text
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.fillText(value + '%', cx, cy - 20);
            }
        }]
    });

});