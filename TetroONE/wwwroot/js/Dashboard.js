var StartDate;
var EndDate;
let employeeChartInstance = null;
let productionChartInstance = null;
let salesChartInstance;
let transferStatusChartInstance;
let flavorChartInstance;
let areaDistributionChartInstance;
let payrollOverviewChartInstance;
let payrollChart = null;
let vendorFranchiseChart = null;
let paymentExpenseChart = null;
let assetDoughnutChart = null;
let currentView = 'overview';
let overviewChart = null;
let individualChart = null;

$(document).ready(function () {
    $('#loader-pms').show();
    var start = moment().startOf('month');
    var end = moment().endOf('month');
    Common.bindDropDown('distributorSelect', 'Client');
    $('#reportrange span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));


    StartDate = start.format('YYYY-MM-DD');
    EndDate = end.format('YYYY-MM-DD');

    var EditDataId = {
        FromDate: StartDate,
        ToDate: EndDate,
    };
    Common.ajaxCall("GET", "/Dashboard/GetDropDown", EditDataId, BindDropdown, null);


});

function BindDropdown(response) {
    Common.bindDropDownSuccess(response.data, 'DaysDropDown');
    $('#DaysDropDown').val(1).trigger('change');

}
$(document).on('change', '#DaysDropDown', function () {
    $('#loader-pms').show();
    var DaysDropDown = $(this).val();
    var FranchiseMapping = parseInt(localStorage.getItem('FranchiseId'));
    var EditDataId = {
        FranchiseId: FranchiseMapping,
        FromDate: StartDate,
        ToDate: EndDate,
        ReportCategoryId: DaysDropDown
    };

    Common.ajaxCall("GET", "/Dashboard/GetDashBoard1", EditDataId, GetDashboard, null);
});
$(function () {
    function cb(start, end, label) {
        if (label === 'No Date') {
            $('#reportrange span').html('No Date');
        } else {
            $('#reportrange span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));
        }
    }

    $('#reportrange').daterangepicker({
        autoUpdateInput: false,
        alwaysShowCalendars: true,
        showCustomRangeLabel: true,
        locale: {
            format: 'DD-MM-YYYY'
        }
    }, cb);

    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
        $('#loader-pms').show();

        if (picker.chosenLabel === 'No Date') {
            $(this).find('span').html('No Date');
            StartDate = null;
            EndDate = null;
        } else {
            $(this).find('span').html(picker.startDate.format('DD-MM-YYYY') + ' - ' + picker.endDate.format('DD-MM-YYYY'));
            StartDate = picker.startDate.format('YYYY-MM-DD');
            EndDate = picker.endDate.format('YYYY-MM-DD');
        }
        var EditDataId = {
            FromDate: StartDate,
            ToDate: EndDate,
        };
        Common.ajaxCall("GET", "/Dashboard/GetDropDown", EditDataId, BindDropdown, null);

    });
});
function loadDashboardData(contactId) {
    $('#loader-pms').show();
    var FranchiseMapping = parseInt(localStorage.getItem('FranchiseId'));
    var EditDataId = {
        FranchiseId: FranchiseMapping,
        FromDate: StartDate,
        ToDate: EndDate,
        ReportCategoryId: $('#DaysDropDown').val(),
        ContactId: contactId
    };

    Common.ajaxCall("GET", "/Dashboard/GetDashBoard2", EditDataId, GetDashboardSecond, null);
}
$('#vendorBtn').on('click', function () {
    $('#vendorBtn').addClass('active');
    $('#franchiseBtn').removeClass('active');
    loadDashboardData(1);
});

$('#franchiseBtn').on('click', function () {
    $('#vendorBtn').removeClass('active');
    $('#franchiseBtn').addClass('active');
    loadDashboardData(2);
});
function GetDashboard(response) {
    var data = JSON.parse(response.data);

    CounterBox(data);
    TotalActiveEmployees(data);
    ProductionTrends(data);
    FlavorChart(data);
    TicketingAction(data);
    TransferStatusChart(data);
    SalesChart(data);
    AreaDistributionChart(data);

    $('#loader-pms').hide();
    var FranchiseMapping = parseInt(localStorage.getItem('FranchiseId'));
    var EditDataId = {
        FranchiseId: FranchiseMapping,
        FromDate: StartDate,
        ToDate: EndDate,
        ReportCategoryId: $('#DaysDropDown').val(),
        ContactId: 1
    };

    Common.ajaxCall("GET", "/Dashboard/GetDashBoard2", EditDataId, GetDashboardSecond, null);

}

function extractPercentage(value) {
    const match = value.match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
}

function setProgressBar(id, percent, color) {
    const bar = $(`${id} .progress-bar`);
    bar.css({
        width: `${Math.min(Math.abs(percent), 100)}%`,
        backgroundColor: color
    });
}

function CounterBox(data) {
    const d = data[0][0];

    // Basic Text & Icon Updates
    $('#TotalProduction').text(d.TotalProduction);
    $('#TodayProduction')
        .text(d.TodayProduction)
        .css('color', d.ProductionPercent_Colour);

    $('#ProductionSymbol')
        .html(
            d.ProductionSymbol === '▲'
                ? '<i class="fas fa-arrow-up"></i>'
                : '<i class="fas fa-arrow-down"></i>'
        )
        .css('color', d.ProductionPercent_Colour);

    $('#ProductionPercentage')
        .text(d.ProductionPercent)
        .css('color', d.ProductionPercent_Colour);

    $('#TotalRevenue').text(d.TotalRevenue);
    $('#TotalProfit').text(d.TotalProfit).css('color', d.ProfitLossPercent_Colour);
    $('#ProfitLossSymbol').html(
        d.ProfitLossSymbol === '▲'
            ? '<i class="fas fa-arrow-up"></i>'
            : '<i class="fas fa-arrow-down"></i>'
    ).css('color', d.ProfitLossPercent_Colour);

    $('#ProfitLossPercent').text(d.ProfitLossPercent).css('color', d.ProfitLossPercent_Colour);

    $('#TotalEfficiency').text(d.TotalEfficiency);
    $('#AveragePercentage').text(d.AveragePencentage).css('color', d.IncrementPencentage_Colour);
    $('#IncrementSymbol').html(
        d.IncrementSymbol === '▲'
            ? '<i class="fas fa-arrow-up"></i>'
            : '<i class="fas fa-arrow-down"></i>'
    ).css('color', d.IncrementPencentage_Colour);
    $('#IncrementPercentage').text(d.IncrementPencentage).css('color', d.IncrementPencentage_Colour);


    setProgressBar(
        '#TotalProductionCard',
        extractPercentage(d.ProductionPercent),
        d.ProductionPercent_Colour.toLowerCase()
    );
    setProgressBar(
        '#TotalRevenueCard',
        extractPercentage(d.ProfitLossPercent),
        d.ProfitLossPercent_Colour.toLowerCase()
    );
    setProgressBar(
        '#TotalEfficiencyCard',
        extractPercentage(d.IncrementPencentage),
        d.IncrementPencentage_Colour.toLowerCase()
    );
}


function TotalActiveEmployees(data) {
    var D = data[1][0];
    const totalEmployees = D.TotalEmployees;
    const presentEmployees = D.PresentEmployees;
    const absentEmployees = D.AbsentEmployees;

    const ctx = $('#employeeDoughnutChart')[0].getContext('2d');

    if (employeeChartInstance) {
        employeeChartInstance.destroy();
    }

    employeeChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                data: [presentEmployees, absentEmployees],
                backgroundColor: ['#28a745', '#e74c3c'],
                borderWidth: 2
            }]
        },
        options: {
            cutout: '70%',
            responsive: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw;
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function (chart) {
                const { width, height } = chart;
                const ctx = chart.ctx;
                ctx.restore();

                const fontSize = (width / 7);
                ctx.font = `${fontSize}px Arial`;
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#2c3e50";

                const text = `${presentEmployees} / ${totalEmployees}`;
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2 - 5;
                ctx.fillText(text, textX, textY);

                ctx.font = `${fontSize * 0.5}px Arial`;
                ctx.fillStyle = "#999";
                const subText = "Employees";
                const subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
                const subTextY = height / 2 + 15;
                ctx.fillText(subText, subTextX, subTextY);

                ctx.save();
            }
        }]
    }); 
}

function ProductionTrends(data) {
    const d = data[2];

    const labels = d.map(item => item.WeekLabel || item.Days || item.MonthLabel || item.YearLabel);
    const counts = d.map(item => item.ProductionCount || 0);
    const qtys = d.map(item => item.ProductionQty || 0);

    const ctx = document.getElementById('productionChart').getContext('2d');

    if (window.productionChartInstance) {
        window.productionChartInstance.destroy();
    }

    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '',
                    data: counts,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' bottles';
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: false,
                    min: 0,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    };

    window.productionChartInstance = new Chart(ctx, chartConfig);

    $('#trendTypeBtns button').off('click').on('click', function () {
        const type = $(this).data('type');

        $('#trendTypeBtns button').removeClass('active');
        $(this).addClass('active');

        productionChartInstance.data.datasets[0].data = type === 'qty' ? qtys : counts;
        productionChartInstance.update();
    });
}





//function ProductionTrends(data) {
//    const d = data[2];


//    const labels = d.map(item => item.WeekLabel || item.Days || item.MonthLabel || item.YearLabel);
//    const counts = d.map(item => item.ProductionCount || 0);
//    const qtys = d.map(item => item.ProductionQty || 0);

//    const ctx = document.getElementById('productionChart').getContext('2d');


//    if (window.productionChartInstance) {
//        window.productionChartInstance.destroy();
//    }

//    const chartConfig = {
//        type: 'line',
//        data: {
//            labels: labels,
//            datasets: [
//                {
//                    label: '',
//                    data: counts,
//                    borderColor: '#4f46e5',
//                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
//                    borderWidth: 2,
//                    tension: 0.3,
//                    fill: true
//                }
//            ]
//        },
//        options: {
//            responsive: true,
//            maintainAspectRatio: false,
//            plugins: {
//                legend: {
//                    display: false  // ✅ Hides the legend
//                },
//                tooltip: {
//                    mode: 'index',
//                    intersect: false,
//                    callbacks: {
//                        label: function (context) {
//                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' bottles';
//                        }
//                    }
//                }
//            },
//            scales: {
//                x: {
//                    grid: { display: false }
//                },
//                y: {
//                    beginAtZero: false,
//                    min: 0,
//                    ticks: {
//                        callback: function (value) {
//                            return value.toLocaleString();
//                        }
//                    }
//                }
//            }
//        }
//    };


//    window.productionChartInstance = new Chart(ctx, chartConfig);

//    $('#trendTypeBtns button').off('click').on('click', function () {
//        const type = $(this).data('type');

//        $('#trendTypeBtns button').removeClass('active');
//        $(this).addClass('active');

//        productionChartInstance.data.datasets[0].data = type === 'qty' ? qtys : counts;
//        productionChartInstance.update();
//    });
//}

function FlavorChart(data) {
    const d = data[3] || [];

    let labels = [];
    let percentages = [];
    let totalQty = 0;

    if (d.length > 0) {
        labels = d.map(item => item.FlavourName);
        percentages = d.map(item => parseFloat(item.Percentage));
        totalQty = d[0].TotalQty;
    } else {
        labels = ['No Data'];
        percentages = [100];
        totalQty = 0;
    }


    if (flavorChartInstance) {
        flavorChartInstance.destroy();
    }


    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw(chart) {
            const { width, height } = chart;
            const ctx = chart.ctx;
            ctx.save();

            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = '#111827';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Total: ' + totalQty, width / 2, height / 2 + 45);

            ctx.restore();
        }
    };


    flavorChartInstance = new Chart(document.getElementById('flavorChart'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: percentages,
                backgroundColor: d.length > 0 ? [
                    '#4f46e5', '#f97316', '#eab308', '#ef4444', '#10b981', '#3b82f6'
                ] : ['#d1d5db'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: d.length > 0,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    enabled: d.length > 0,
                    backgroundColor: '#1f2937',
                    titleFont: { size: 12 },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: function (context) {
                            const percent = context.parsed;
                            const qty = Math.round((percent / 100) * totalQty);
                            return `${context.label}: ${percent.toFixed(2)}% (${qty} Qty)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        },
        plugins: [centerTextPlugin]
    });
}

function TicketingAction(data) {
    const ticketData = data[4] || [];
    const $thead = $('#ticketingTableHead');
    const $tbody = $('#ticketingTableBody');

    $thead.empty();
    $tbody.empty();
    if (ticketData.length === 0) return;

    const keys = Object.keys(ticketData[0]);

    // Header
    let headerRow = '<tr>';
    keys.forEach(key => {
        if (key !== 'Status_Colour' && key !== 'TetroONEnocount') {
            let label = key.replace(/_/g, ' ');
            headerRow += `<th class="text-start">${label}</th>`;
        }
    });
    headerRow += '</tr>';
    $thead.append(headerRow);

    // Rows
    ticketData.forEach(item => {
        let row = '<tr>';
        keys.forEach(key => {
            if (key === 'Status_Colour' || key === 'TetroONEnocount') return;

            let value = item[key];
            if (key === 'Status') {
                const colorClass = getStatusColorClass(item['Status_Colour']);
                value = `<span class="fw-bold text-${colorClass}">${value}</span>`;
            }

            row += `<td class="text-start">${value}</td>`;
        });
        row += '</tr>';
        $tbody.append(row);
    });
}

function getStatusColorClass(color) {
    switch (color?.toLowerCase()) {
        case 'red': return 'danger';
        case 'green': return 'success';
        case 'orange':
        case 'yellow': return 'warning';
        default: return 'secondary';
    }
}

function TransferStatusChart(data) {
    const Data = data[5] || [];

    if (!Data.length) return;
    const labels = Data.map(item => item.WeekLabel || item.Days || item.MonthLabel || item.YearLabel);
    const counts = Data.map(item => item.PurchaseBillCount);
    const quantities = Data.map(item => item.PurchaseBillQty);

    const ctx = document.getElementById('transferStatusChart').getContext('2d');


    if (transferStatusChartInstance) {
        transferStatusChartInstance.destroy();
    }

    transferStatusChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Purchase Count',
                    data: counts,
                    backgroundColor: '#0D3B66',
                    borderRadius: 4
                },
                {
                    type: 'line',
                    label: 'Quantity Trend',
                    data: quantities,
                    borderColor: '#FF4081',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    title: {
                        display: true,
                        text: 'Days'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count / Quantity'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            if (context.dataset.type === 'bar') {
                                return 'Purchase Count: ' + context.parsed.y;
                            }
                            return 'Quantity: ' + context.parsed.y;
                        }
                    }
                }
            }
        }
    });
}

function SalesChart(data) {
    const Data = data[6] || [];
    const labels = Data.map(item => item.WeekLabel || item.Days || item.MonthLabel || item.YearLabel);
    const saleCounts = Data.map(item => item.SaleQty);
    const ctx = document.getElementById('salesChart').getContext('2d');

    if (salesChartInstance) {
        salesChartInstance.destroy();
    }

    salesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sale Count',
                data: saleCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Units Sold'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Days'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.parsed.y} units`
                    }
                }
            }
        }
    });
}

function AreaDistributionChart(data) {
    const Data = data[7] || [];

    const labels = Data.map(item => item.City);
    const distributionAmounts = Data.map(item => item.DistributionAmount);
    const distributionCounts = Data.map(item => item.DistributionCount);

    const predefinedColors = [
        '#4BC0C0', '#FF6384', '#FFCE56', '#36A2EB', '#9966FF',
        '#FF9F40', '#8BC34A', '#D32F2F', '#7E57C2', '#00ACC1'
    ];
    const backgroundColors = Data.map((_, index) => predefinedColors[index % predefinedColors.length]);

    const ctx = document.getElementById('areaDistributionChart').getContext('2d');

    if (areaDistributionChartInstance) {
        areaDistributionChartInstance.destroy();
    }

    areaDistributionChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribution Amount',
                data: distributionAmounts,
                backgroundColor: backgroundColors,
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const city = labels[index];
                            const count = distributionCounts[index];
                            const amount = distributionAmounts[index];
                            return `${city} - Count: ${count}, Amount: ₹${amount.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

function GetDashboardSecond(response) {
    var data = JSON.parse(response.data);

    PayrollOverviewChart(data[0]);
    PaymentExpenseChart(data[1]);
    AssetDoughnutChart(data[2]);
    Quality(data[3]);
    VendorAndDistributor(data[4]);
    $('#loader-pms').hide();

    fetchThirdDashboardData(null);
}

function PayrollOverviewChart(data) {
    const ctx = $('#payrollOverviewChart')[0].getContext('2d');

    // Destroy existing chart if it exists
    if (payrollChart !== null) {
        payrollChart.destroy();
    }

    // Extract and compute from response
    const labels = data.map(row => row.month);
    const originalMonthlyAttendance = data.map(row => parseInt(row.attendance_days));
    const originalMonthlySalary = data.map(row => parseInt(row.earned_salary));
    const originalMonthlyDeduction = data.map(row => parseInt(row.deduction));

    // 🔍 These scale the salary/deduction values to match the attendance scale visually
    const scaleEarnedSalary = 0.8;
    const scaleDeduction = 0.4;

    const monthlyAttendanceMax = Math.max(...originalMonthlyAttendance);
    const monthlySalaryMax = Math.max(...originalMonthlySalary);
    const monthlyDeductionMax = Math.max(...originalMonthlyDeduction);

    const monthlyData = {
        labels: labels,
        datasets: [
            {
                label: 'Attendance Days',
                data: originalMonthlyAttendance,
                backgroundColor: '#6366f1',
                borderRadius: 6
            },
            {
                label: 'Earned Salary (₹)',
                data: originalMonthlySalary.map(val =>
                    (val / monthlySalaryMax) * monthlyAttendanceMax * scaleEarnedSalary
                ),
                backgroundColor: '#22c55e',
                borderRadius: 6
            },
            {
                label: 'Loan/Advance Deduction (₹)',
                data: originalMonthlyDeduction.map(val =>
                    (val / monthlyDeductionMax) * monthlyAttendanceMax * scaleDeduction
                ),
                backgroundColor: '#f97316',
                borderRadius: 6
            }
        ]
    };

    payrollChart = new Chart(ctx, {
        type: 'bar',
        data: monthlyData,
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label || '';
                            const index = context.dataIndex;

                            if (label.includes('Attendance')) {
                                return `${label}: ${originalMonthlyAttendance[index]}`;
                            } else if (label.includes('Earned Salary')) {
                                return `${label}: ₹${originalMonthlySalary[index]}`;
                            } else if (label.includes('Deduction')) {
                                return `${label}: ₹${originalMonthlyDeduction[index]}`;
                            }
                            return `${label}: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Scaled Value' }
                },
                y: {
                    title: { display: true, text: 'Month' }
                }
            }
        }
    });
}
function PaymentExpenseChart(chartData) {
    const ctx = document.getElementById('paymentExpenseChart').getContext('2d');

    // ✅ Destroy the existing chart if it exists
    if (paymentExpenseChart) {
        paymentExpenseChart.destroy();
    }

    const labels = chartData.map(row => row.Month);
    const paymentAmounts = chartData.map(row => row.PaymentAmount);
    const expenseAmounts = chartData.map(row => row.ExpenseAmount);

    const paymentCounts = chartData.map(row => row.PaymentCount);
    const expenseCounts = chartData.map(row => row.ExpenseCount);

    // ✅ Assign to global variable
    paymentExpenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Payment Amount',
                    data: paymentAmounts,
                    backgroundColor: '#22c55e',
                    borderRadius: 6
                },
                {
                    label: 'Expense Amount',
                    data: expenseAmounts,
                    backgroundColor: '#f97316',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const datasetLabel = context.dataset.label;
                            const value = context.raw.toLocaleString();

                            if (datasetLabel === 'Payment Amount') {
                                return `Payment: ₹${value} (${paymentCounts[index]} entries)`;
                            } else if (datasetLabel === 'Expense Amount') {
                                return `Expense: ₹${value} (${expenseCounts[index]} entries)`;
                            } else {
                                return `${datasetLabel}: ₹${value}`;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (₹)'
                    }
                }
            }
        }
    });
}

function AssetDoughnutChart(data) {
    const ctx = document.getElementById('assetDoughnutChart').getContext('2d');

    // ✅ Destroy previous chart if it exists
    if (assetDoughnutChart) {
        assetDoughnutChart.destroy();
    }

    const labels = data.map(item => item.AssetType);
    const values = data.map(item => item.AssetAmount);

    const backgroundColors = [
        '#36A2EB', '#9966FF', '#FFCE56', '#4BC0C0', '#FF6384', '#FFA500', '#8B4513', '#00CED1'
    ].slice(0, data.length);

    // ✅ Assign to global variable
    assetDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Asset Value (₹)',
                data: values,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 10
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ₹${context.parsed.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

function Quality(data) {
    var $container = $('#qualityMetricsContainer');
    $container.empty();

    $.each(data, function (index, item) {
        if (index >= 4) {
            return false; // stop iteration after 4 items
        }
        if (index % 4 === 0) {
            $container.append('<div class="row g-4 mb-2"></div>');
        }

        var $row = $container.find('.row').last();

        var colHtml = `
            <div class="col-md-3">
                <div class="p-3 bg-light rounded">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <small class="text-muted d-block mb-1">${item.Name}</small>
                        <h4 class="mb-1">${item.Percentage}%</h4>
                    </div>
                    <span class="badge bg-success">Optimal</span>
                    <div class="progress mt-2">
                        <div class="progress-bar bg-success" style="width: ${item.Percentage}%"></div>
                    </div>
                </div>
            </div>
        `;

        $row.append(colHtml);
    });
}
function VendorAndDistributor(data) {
    const canvas = document.getElementById('vendorFranchiseChart');
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('vendorFranchiseWrapper');
    const container = document.getElementById('canvasContainer');

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    const isVendor = data[0]?.VendorName !== undefined;

    const labels = isVendor ? data.map(x => x.VendorName) : data.map(x => x.DistributorName);
    const values = isVendor ? data.map(x => x.PurchaseAmount) : data.map(x => x.SaleAmount);


    if (labels.length > 8) {
        const barWidth = 50; // pixels per bar
        container.style.minWidth = `${labels.length * barWidth}px`;
    } else {
        container.style.minWidth = '100%';
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: isVendor ? 'Supplies Delivered (₹)' : 'Monthly Sales (₹)',
                data: values,
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2.5, // Adjust to control height
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: isVendor ? 'Vendor' : 'Distributor'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (₹)'
                    }
                }
            }
        }
    });
}

/*===================================================================================*/

$('#overviewBtn').on('click', function () {
    currentView = 'overview';
    $('#overviewChartContainer').show();
    $('#individualChartContainer').hide();
    $(this).addClass('active');
    $('#individualBtn').removeClass('active');
    fetchThirdDashboardData(null);
});
$('#individualBtn').on('click', function () {
    currentView = 'individual';
    $('#overviewChartContainer').hide();
    $('#individualChartContainer').show();
    $(this).addClass('active');
    $('#overviewBtn').removeClass('active');

    $('#distributorSelect').val(1).trigger('change');
});


$('#distributorSelect').on('change', function () {
    if (currentView === 'individual') {
        const distributorId = $(this).val();
        fetchThirdDashboardData(distributorId);
    }
});
function fetchThirdDashboardData(distributorId) {
    const FranchiseMapping = parseInt(localStorage.getItem('FranchiseId'));
    const EditDataId = {
        FranchiseId: FranchiseMapping,
        FromDate: StartDate,
        ToDate: EndDate,
        DistributorId: distributorId || null
    };

    Common.ajaxCall("GET", "/Dashboard/GetDashBoard3", EditDataId, GetDashboardThird, null);
}
function GetDashboardThird(response) {
    const parsed = JSON.parse(response.data);
    const data = parsed[0];

    const labels = data.map(item => item.StatusName);
    const counts = data.map(item => item.DistributorCount);
    const amounts = data.map(item => item.DistributorAmount);

    const chartData = { labels, counts, amounts };

    if (currentView === 'overview') {
        renderOverviewChart(chartData);
    } else {
        renderIndividualChart(chartData);
    }
}

function renderOverviewChart(data) {
    if (overviewChart) overviewChart.destroy();

    const ctx = document.getElementById('overviewDistributorChart').getContext('2d');

    // Define an array of colors (you can expand this list as needed)
    const barColors = ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'];

    overviewChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Distributor Amount (₹)',
                data: data.amounts,
                backgroundColor: barColors.slice(0, data.labels.length), // Assign different color for each bar
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const count = data.counts[index];
                            const amount = data.amounts[index].toLocaleString();
                            return `₹${amount} (${count} distributors)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Amount (₹)' }
                }
            }
        }
    });
}
function renderIndividualChart(data) {
    if (individualChart) individualChart.destroy();

    const ctx = document.getElementById('individualDistributorChart').getContext('2d');

    individualChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Distributor Count',
                data: data.counts,
                backgroundColor: [
                    '#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'
                ]
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { position: 'right' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const count = data.counts[index];
                            const amount = data.amounts[index].toLocaleString();
                            return `${data.labels[index]}: ${count} distributors, ₹${amount}`;
                        }
                    }
                }
            }
        }
    });
}

