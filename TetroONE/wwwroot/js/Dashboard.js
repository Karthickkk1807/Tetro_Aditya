
$(document).ready(async function () {

    var today = new Date();

    const today1 = new Date().toISOString().split('T')[0];
    $('#ToDate').attr('max', today1);
    $('#FromDate').attr('max', today1);

    // First day of current month
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    function formatDate(date) {
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        return year + "-" + month + "-" + day;
    }

    $("#FromDate").val(formatDate(firstDay));
    $("#ToDate").val(formatDate(today));

    Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetails", { FromDate: $("#FromDate").val(), ToDate: $("#ToDate").val() }, DashboardSuccess, null);

    //Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetailsTetro1", { ModuleId: ModuleId, Type: Type, Value: Value }, DashboardTetroSuccess, null);
    // 1. Load all main dropdowns
    Promise.all([
        bindDropDownPromise('GreyFabricAllId', 'FabricCategory'),
        bindDropDownPromise('FinishFabricStockAllId', 'FabricCategory'),
        bindDropDownPromise('ProdTrendOverAllId', 'FabricCategory')
    ]).then(function () {

        // 2. Call GetDDMasterInfoValue based on ProdTrendOverAllId
        return new Promise(function (resolve, reject) {
            var masterInfoId = parseInt($('#ProdTrendOverAllId').val());
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: masterInfoId, ModuleName: 'DashboardDD' }, function (response) {
                bindDropDownSuccessDashboard(response.data, 'ProdTrendValId');
                resolve(); // proceed after this is done
            },
                function (err) { reject(err); }
            );
        });

    }).then(function () {

        // 3. Call Dashboard AJAX for GreyFabricAllId
        return new Promise(function (resolve) {
            Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetailsTetro1", { ModuleId: 1, Type: parseInt($('#GreyFabricAllId').val()), Value: null }, DashboardTetroSuccess, null);
            resolve();
        });

    }).then(function () {

        // 4. Call Dashboard AJAX for FinishFabricStockAllId
        return new Promise(function (resolve) {
            Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetailsTetro1", { ModuleId: 2, Type: parseInt($('#FinishFabricStockAllId').val()), Value: null }, DashboardTetroSuccess, null);
            resolve();
        });

    }).then(function () {

        // 5. Call Dashboard AJAX for ProdTrendOverAllId + ProdTrendValId
        Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetailsTetro1", { ModuleId: 3, Type: parseInt($('#ProdTrendOverAllId').val()), Value: parseInt($('#ProdTrendValId').val()) }, DashboardTetroSuccess, null);

    }).catch(function (err) {
        console.error("Error in dropdown/dashboard sequence:", err);
    });

    $(document).on('change', '#ProdTrendOverAllId', function () {
        var $thisVal = $(this).val();

        if ($thisVal !== '') {

            // Wrap the first AJAX call in a Promise
            function getDDMasterInfo() {
                return new Promise((resolve, reject) => {
                    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt($thisVal), ModuleName: 'DashboardDD' }, function (response) {
                        bindDropDownSuccessDashboard(response.data, 'ProdTrendValId');
                        resolve(); // resolve the promise when done
                    },
                        function (error) {
                            reject(error); // reject if there is an error
                        }
                    );
                });
            }

            // Call the first AJAX, then after completion call the second
            getDDMasterInfo()
                .then(() => {
                    // Now safe to call the second AJAX
                    Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetailsTetro1", { ModuleId: 3, Type: parseInt($thisVal), Value: parseInt($('#ProdTrendValId').val()) }, DashboardTetroSuccess, null);
                })
                .catch((err) => {
                    console.error("Error in fetching DD Master Info:", err);
                });
        }
    });

    $(document).on('change', '#ProdTrendValId', function () {
        let $thisValue = $(this).val();
        let $thisTypeVal = $('#ProdTrendOverAllId').val();

        if ($thisValue !== '') {
            // Now safe to call the second AJAX
            Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetailsTetro1", { ModuleId: 3, Type: parseInt($thisTypeVal), Value: parseInt($thisValue) }, DashboardTetroSuccess, null);
        }
    });

    $(document).on('change', '#FinishFabricStockAllId', function () {
        let $thisValue = $(this).val();

        if ($thisValue !== '') {
            // Now safe to call the second AJAX
            Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetailsTetro1", { ModuleId: 2, Type: parseInt($thisValue), Value: null }, DashboardTetroSuccess, null);
        }
    });

    $(document).on('change', '#GreyFabricAllId', function () {
        let $thisValue = $(this).val();

        if ($thisValue !== '') {
            // Now safe to call the second AJAX
            Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetailsTetro1", { ModuleId: 1, Type: parseInt($thisValue), Value: null }, DashboardTetroSuccess, null);
        }
    });

    $(document).on('change', '#FromDate, #ToDate', function () {
        const fromDate = $('#FromDate').val();
        const toDate = $("#ToDate").val();

        $('#ToDate').attr('min', fromDate);

        if (fromDate) {
            Common.ajaxCall("GET", "/Dashboard/GetDashBoardDetails", { FromDate: fromDate, ToDate: toDate }, DashboardSuccess, null);
        }
    });
});

function DashboardTetroSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[1][0].TypeName == 'Grey Fabric Stock') {
            /*console.log('Grey Fabric Stock')*/
            renderGreyFabricStockChart('clientInfoChart', data[0]);
        } else if (data[1][0].TypeName == 'Finish Fabric Stock') {
            /*console.log('Finish Fabric Stock')*/
            renderFinishClientChart('finishClient', data[0]);
        } else if (data[1][0].TypeName == 'Prod Trend') {
            /*console.log('Prod Trend')*/
            renderProductionGaugeFromData('productionGaugChart', data[0]);
        }
    }
}

function DashboardSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $("#EmployeePresentText").text(CounterBox[0]);
        $("#InwardText").text(CounterBox[2]);
        $("#ProductionText").text(CounterBox[4]);
        //$("#OutwardDeliveredText").text(CounterBox[6]);
        $("#PendingDispatchText").text(CounterBox[7]);
        $("#PendingApprovalText").text(CounterBox[8]);

        $("#EmployeePresentVal").text(data[0][0].EmployeesPresent);
        $("#EmployeePresentPer").text(data[0][0].PresentCount);

        $("#InwardVal").text(data[0][0].InWard);
        $("#InwardPer").text(data[0][0].QtyPercent);

        $("#ProductionVal").text(data[0][0].Production);
        $("#ProductionPer").text(data[0][0].ProductionPercent);

        $("#OutwardDeliveredVal").text(data[0][0].OutWardDelivered);

        $("#PendingDispatchVal").text(data[0][0].PendingDisPatches);

        $("#PendingApprovalVal").text(data[0][0].PendingApprovals);

        bindOngoingProduction(data[1]);

        bindRemainder(data[2]);

        bindPendingPayments(data[3]);

        bindLowStockAlerts(data[5]);

        bindInwardTrendChart(data[7]);

        bindQuotationChart(data[6]);

        bindProductionInwardChart(data[4]);
    }
}

function bindOngoingProduction(data) {

    $("#OngoingProduction").empty();

    if (!data || data.length === 0 || data.every(item => !item.ClientName || item.ClientName === null)) {
        container.innerHTML = "<div class='text-center'>No Data Available</div>";
        return;
    }

    $.each(data, function (i, item) {

        // Use the CompletionPercentage from your item, default 0 if missing
        let percent = item.CompletionPercentage || 0;

        let html = `
            <div class="expense-row d-flex justify-content-between align-items-center pr-2 mb-2">
                <div>
                    <div>${item.ProductionNo}</div>
                    <div>${item.ColorName || ''}</div>
                    <div>${item.ClientName}</div>
                </div>
                <div class="donut-wrapper">
                    <canvas class="statusDonut" data-percent="${percent}" width="50" height="50"></canvas>
                    <span class="donut-text">${percent}%</span>
                </div>
                <div>
                    ${item.Process}
                </div>
            </div>
        `;

        $("#OngoingProduction").append(html);
    });

    OngoingProductionInfo();
}

function bindRemainder(data) {

    const container = document.getElementById("RemainderDynamic");
    container.innerHTML = "";

    if (!data || data.length === 0 || data.every(item => !item.ModuleName || item.ModuleName === null)) {
        container.innerHTML = "<div class='text-center'>No Remainders</div>";
        return;
    }

    data.forEach(item => {
        const html = `
            <div class="reminder-row d-flex justify-content-between align-items-start mb-2">
                <div>
                    <p class="fw-bold" style="font-size:13px;margin-bottom: -4px;">
                        ${item.ModuleNo}
                    </p>
                    <p class="mb-0" style="font-size:13px;">
                        ${item.ModuleName}
                    </p>
                </div>

                <div class="text-end">
                    <p class="text-danger" style="font-size:12px;margin-bottom: -4px;">
                        Due Time
                    </p>
                    <p class="mb-0" style="font-size:12px;">
                        ${item.DueTime}
                    </p>
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", html);
    });
}

function bindPendingPayments(data) {

    const container = document.getElementById("PendingPaymentsDynamic");
    container.innerHTML = "";

    if (!data || data.length === 0 || data.every(item => !item.ClientName || item.ClientName === null)) {
        container.innerHTML = "<div class='text-center'>No Pending Payments</div>";
        return;
    }

    data.forEach(item => {

        // Format amount to currency (Indian format)
        const formattedAmount = new Intl.NumberFormat('en-IN').format(item.PendingAmount);

        const html = `
            <div class="expense-row d-flex justify-content-between align-items-center pr-2 mb-2">
                <div>
                    <div>${item.PaymentNo}</div>
                    <div>${item.ClientName}</div>
                </div>
                <div style="font-weight:600;">
                    ₹ ${formattedAmount}
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", html);
    });
}

function bindLowStockAlerts(data) {

    const container = document.getElementById("LowStockAlerts");
    container.innerHTML = "";

    if (!data || data.length === 0 || data.every(item => !item.ProductName || item.ProductName === null)) {
        container.innerHTML = "<div class='text-center'>No Low Stock Items</div>";
        return;
    }

    data.forEach(item => {

        // Extract numeric value from "StockInhand"
        const numericStock = parseFloat(item.StockInhand);

        // Highlight negative or low stock
        const stockClass = numericStock <= 0 ? "text-danger fw-bold" : "";

        const html = `
            <div class="expense-row d-flex justify-content-between align-items-center pr-2 mb-2">
                <div>
                    <div>${item.ProductName}</div>
                </div>
                <div class="${stockClass}">
                    ${item.StockInhand}
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", html);
    });
}

function bindInwardTrendChart(apiData) {

    const ctx = document.getElementById('inwardTrend').getContext('2d');

    // 🔹 1. Get Unique Days dynamically
    const days = [...new Set(apiData.map(x => x.DateDay))];

    // Optional: Sort days in correct week order
    const weekOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));

    // 🔹 2. Get Unique Entry Types dynamically
    const entryTypes = [...new Set(apiData.map(x => x.EntryType))];

    // 🔹 3. Build datasets dynamically
    const datasets = entryTypes.map(type => {

        const dataValues = days.map(day => {
            const match = apiData.find(x => x.DateDay === day && x.EntryType === type);
            return match ? match.WeightQty : 0;
        });

        return {
            label: type,
            data: dataValues,
            backgroundColor: getColorByType(type)
        };
    });

    // Destroy old chart if exists
    if (window.inwardChart) {
        window.inwardChart.destroy();
    }

    window.inwardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => value + ' kg'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx =>
                            ctx.dataset.label + ': ' + ctx.parsed.y + ' kg'
                    }
                }
            }
        }
    });
}

function getColorByType(type) {

    const colors = {
        GreyFabric: 'grey',
        RawMaterial: 'purple'
    };

    return colors[type] || '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function bindQuotationChart(apiData) {

    const canvas = document.getElementById('Quotation');
    // Optional: also set height via JS (redundant if inline CSS used)
    canvas.style.height = '168px';
    canvas.style.width = '100%';

    const ctx = canvas.getContext('2d');

    // Week order for sorting days properly
    const weekOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Get unique days dynamically from data
    let days = [...new Set(apiData.map(x => x.DateDay))];

    // Sort days by week order
    days.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));

    // Map counts per day, rounded integers only
    const counts = days.map(day => {
        const match = apiData.find(x => x.DateDay === day);
        return match ? Math.round(match.QuotationCount) : 0;
    });

    // Destroy old chart if exists (for rebind)
    if (window.quotationChart) {
        window.quotationChart.destroy();
    }

    window.quotationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Quotation',
                    data: counts,
                    backgroundColor: 'blue'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // allow custom height
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,            // integer steps
                        callback: value => Math.round(value)
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: context => Math.round(context.parsed.y)
                    }
                }
            }
        }
    });
}

function bindProductionInwardChart(apiData) {

    const canvas = document.getElementById('productionInward');
    canvas.style.height = '180px'; // adjust chart height
    canvas.style.width = '100%';

    const ctx = canvas.getContext('2d');

    // Week order for proper sorting
    const weekOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Get unique days dynamically
    let days = [...new Set(apiData.map(x => x.DateDay))];
    days.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));

    // Map ProductionQty and OutwardQty per day
    const productionData = days.map(day => {
        const match = apiData.find(x => x.DateDay === day);
        return match ? Math.round(match.ProductionQty) : 0;
    });

    const outwardData = days.map(day => {
        const match = apiData.find(x => x.DateDay === day);
        return match ? Math.round(match.OutwardQty) : 0;
    });

    // Destroy existing chart if exists
    if (window.productionInwardChart) {
        window.productionInwardChart.destroy();
    }

    // Create Chart.js line chart
    window.productionInwardChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Production',
                    data: productionData,
                    borderColor: '#3498db',
                    backgroundColor: '#3498db',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Outward',
                    data: outwardData,
                    borderColor: '#2ecc71',
                    backgroundColor: '#2ecc71',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 100, // adjust depending on your quantity scale
                        callback: value => Math.round(value) + ' kg'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.dataset.label + ': ' + Math.round(ctx.parsed.y) + ' kg'
                    }
                }
            }
        }
    });
}

let productionGaugeChart = null;
function renderProductionGaugeFromData(canvasId, data, whiteStartPercent = 40) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let targetValue = 0;
    const rawValue = data?.[0]?.ProductionPercentage;

    if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
        targetValue = parseFloat(rawValue);
    }

    let animatedValue = 0;

    if (productionGaugeChart) {
        productionGaugeChart.destroy();
    }

    productionGaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0, 100], // start from 0
                backgroundColor: function (context) {

                    const chart = context.chart;
                    const { chartArea } = chart;
                    if (!chartArea) return;

                    const gradient = ctx.createLinearGradient(
                        chartArea.left,
                        chartArea.top,
                        chartArea.right,
                        chartArea.top
                    );

                    if (animatedValue <= whiteStartPercent) {
                        gradient.addColorStop(0, '#2ecc71');
                        gradient.addColorStop(1, '#1e8449');
                    } else {
                        const whiteStart = whiteStartPercent / animatedValue;
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
            animation: false, // we control animation manually
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

                const angle = Math.PI * (animatedValue / 100) - Math.PI;

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

                // Center dot
                ctx.beginPath();
                ctx.arc(0, 0, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#222';
                ctx.fill();

                ctx.restore();

                // Text
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.fillText(animatedValue.toFixed(1) + '%', cx, cy - 20);
            }
        }]
    });

    // Smooth 4 second animation
    const duration = 4000;
    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeInOutCubic
        const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        animatedValue = targetValue * ease;

        // Update chart data dynamically
        productionGaugeChart.data.datasets[0].data = [
            animatedValue,
            100 - animatedValue
        ];

        productionGaugeChart.update('none');

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

let finishCharts = {};
function renderFinishClientChart(canvasId, clientDataArray) {
    if (!clientDataArray || clientDataArray.length === 0) return;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Flatten if nested
    const dataFlat = Array.isArray(clientDataArray[0]) ? clientDataArray.flat() : clientDataArray;

    if (!dataFlat || dataFlat.length === 0) return;

    // Dynamically detect label field (first key that is not Weight)
    const firstItem = dataFlat[0] || {};
    const labelField = Object.keys(firstItem).find(key => key.toLowerCase() !== 'weight') || 'Label';
    const valueField = 'Weight';

    // Total value
    const totalValue = dataFlat.reduce((sum, item) => sum + (item[valueField] || 0), 0);

    // Labels, data, and percentages
    const labels = dataFlat.map(item => item[labelField] || 'Unknown');
    const dataValues = dataFlat.map(item => item[valueField] || 0);
    const percentages = dataFlat.map(item =>
        totalValue ? ((item[valueField] || 0) / totalValue * 100).toFixed(1) : 0
    );

    // Colors
    const backgroundColors = [
        '#4e73df', '#1cc88a', '#f6c23e', '#e74a3b',
        '#36b9cc', '#f8f9fc', '#858796', '#fd7e14',
        '#6f42c1', '#20c997', '#fd7e14', '#343a40'
    ];

    // Destroy existing chart to avoid "canvas already in use" error
    if (finishCharts[canvasId]) {
        finishCharts[canvasId].destroy();
    }

    finishCharts[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors.slice(0, dataValues.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    align: 'center'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const val = context.raw;
                            const percent = percentages[context.dataIndex];
                            return `KG: ${val} (${percent}%)`;
                        }
                    }
                }
            }
        }
    });
}

let clientCharts = {};
function renderGreyFabricStockChart(canvasId, clientDataArray) {
    if (!clientDataArray || clientDataArray.length === 0) return;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Safely flatten only if needed
    const dataFlat = Array.isArray(clientDataArray[0]) ? clientDataArray.flat() : clientDataArray;

    if (!dataFlat || dataFlat.length === 0) return;

    const firstItem = dataFlat[0] || {};
    const labelField = Object.keys(firstItem).find(key => key.toLowerCase() !== 'weight') || 'Label';
    const valueField = 'Weight';

    // Total Weight (safely)
    const totalWeight = Array.isArray(dataFlat)
        ? dataFlat.reduce((sum, item) => sum + (item[valueField] || 0), 0)
        : 0;

    const labels = dataFlat.map(item => item[labelField] || 'Unknown');
    const dataValues = dataFlat.map(item => item[valueField] || 0);
    const percentages = dataFlat.map(item =>
        totalWeight ? ((item[valueField] || 0) / totalWeight * 100).toFixed(1) : 0
    );

    const backgroundColors = [
        '#4e73df', '#1cc88a', '#f6c23e', '#e74a3b',
        '#36b9cc', '#f8f9fc', '#858796', '#fd7e14',
        '#6f42c1', '#20c997', '#fd7e14', '#343a40'
    ];

    if (clientCharts[canvasId]) {
        clientCharts[canvasId].destroy();
    }

    clientCharts[canvasId] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors.slice(0, dataValues.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    align: 'center'
                },
                tooltip: {
                    callbacks: {
                        title: function (tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function (context) {
                            const val = context.raw;
                            const percent = percentages[context.dataIndex];
                            return `Weight: ${val} (${percent}%)`;
                        }
                    }
                }
            }
        }
    });
}

function OngoingProductionInfo() {
    document.querySelectorAll('.statusDonut').forEach(canvas => {

        const percent = Number(canvas.dataset.percent);

        new Chart(canvas.getContext('2d'), {  // Pass context explicitly
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percent, 100 - percent],
                    backgroundColor: ['#28a745', '#e9ecef'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });

    });
}

function bindDropDownPromise(id, moduleName) {
    return new Promise(function (resolve, reject) {
        var request = { moduleName: moduleName };
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: '/Common/GetDropDown',
            data: JSON.stringify(request),
            success: function (response) {
                if (response.status == true) {
                    bindDropDownSuccessDashboard(response.data, id);
                    resolve();
                } else {
                    resolve();
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function bindDropDownSuccessDashboard(response, controlid) {
    if (response != null) {
        var data = JSON.parse(response);
        var dataValue = data[0];
        if (dataValue != null && dataValue.length > 0 && !dataValue[0].hasOwnProperty('GenericTetroONE')) {
            $('#' + controlid).empty();
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];
            $.each(dataValue, function (index, item) {
                $('#' + controlid).append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty],
                }));
            });
        } else {
            $('#' + controlid).empty();
        }
    }
}