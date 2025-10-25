$(document).ready(function () {
    MainGridData(); 

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    $('#decrement-month-btn2').click(function () {
        let currentText = $('#dateDisplay2').text().trim();
        let [currentMonth, currentYear] = currentText.split(" ");
        let monthIndex = months.indexOf(currentMonth);

        if (monthIndex === -1) return;

        monthIndex--;
        if (monthIndex < 0) {
            monthIndex = 11;
            currentYear = parseInt(currentYear) - 1;
        }

        let newMonth = months[monthIndex];
        $('#dateDisplay2').text(`${newMonth} ${currentYear}`);
    });

    $('#increment-month-btn2').click(function () {
        let currentText = $('#dateDisplay2').text().trim();
        let [currentMonth, currentYear] = currentText.split(" ");
        let monthIndex = months.indexOf(currentMonth);

        if (monthIndex === -1) return;

        monthIndex++;
        if (monthIndex > 11) {
            monthIndex = 0;
            currentYear = parseInt(currentYear) + 1;
        }

        let newMonth = months[monthIndex];
        $('#dateDisplay2').text(`${newMonth} ${currentYear}`);
    });

    $(document).on('click', '#AddDeliveryPlan', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#DeliveryPlanCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#DeliveryPlanCanvas").css("width", "50%");
        } else {
            $("#DeliveryPlanCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $("#FormDeliveryPlan")[0].reset();
        $('#DeliveryPlanHeader').text('DeliveryPlan Details');
        $('#SaveDeliveryPlan').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        CanvasOpenFirstShowingProduction();
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#DeliveryPlanCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#DeliveryPlanCanvas").css("width", "50%");
        } else {
            $("#DeliveryPlanCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#DeliveryPlanHeader').text('Edit DeliveryPlan Details');
        $('#SaveDeliveryPlan').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
        CanvasOpenFirstShowingProduction();
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#DeliveryPlanCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });

    $(document).on('change', '#Type', function () {
        var $thisVal = $(this).val();
        var $autoNo = $('#OrderNo'); 
        $autoNo.empty().append($('<option>', { value: '', text: '--Select--' })); 

        if (!$thisVal) return; 

        var dataMap = {
            1: { prefix: 'SALE/NO/' },
            2: { prefix: 'JOB/NO/' },
            default: { prefix: 'BATCH/NO/' }
        }; 
        var data = dataMap[$thisVal] || dataMap.default;

        for (var i = 1; i <= 6; i++) {
            $autoNo.append($('<option>', {
                value: i,
                text: data.prefix + ('00' + i).slice(-3)
            }));
        } 
    });
});

function CanvasOpenFirstShowingDeliveryPlan() {
    $('#DeliveryPlanCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2').collapse('hide');
    $('#DeliveryPlanCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#DeliveryPlanCanvas').offset().top
    }, 'fast');
}

function MainGridData() {

    const deliveryPlanData = [
        {
            Date: "02 Oct 2025",
            DeliveryPlanNo: "DEL/PLAN/001",
            Type: "SaleOrder",
            OrderNo: "SALE/NO/001",
            ProductType: "T-Shirt",
            Priority: "High",
            TargetDelivery: "28 Oct 2025",
            QtyScheduled: "374 KG",
            DispatchMode: "Truck",
            DeliveryQty: "374 KG",
            Status: "Planned",
            Status_Color: "#fd7e14"
        },
        {
            Date: "04 Oct 2025",
            DeliveryPlanNo: "DEL/PLAN/002",
            Type: "JobOrder",
            OrderNo: "JOB/NO/002",
            ProductType: "Shirt",
            Priority: "Medium",
            TargetDelivery: "30 Oct 2025",
            QtyScheduled: "250 KG",
            DispatchMode: "Courier",
            DeliveryQty: "250 KG",
            Status: "In-Process",
            Status_Color: "#dc3545"
        },
        {
            Date: "06 Oct 2025",
            DeliveryPlanNo: "DEL/PLAN/003",
            Type: "Batch",
            OrderNo: "BATCH/NO/003",
            ProductType: "Trousers",
            Priority: "Normal",
            TargetDelivery: "02 Nov 2025",
            QtyScheduled: "500 KG",
            DispatchMode: "Rail",
            DeliveryQty: "500 KG",
            Status: "Completed",
            Status_Color: "#6f42c1"
        },
        {
            Date: "08 Oct 2025",
            DeliveryPlanNo: "DEL/PLAN/004",
            Type: "SaleOrder",
            OrderNo: "SALE/NO/004",
            ProductType: "Jeans",
            Priority: "High",
            TargetDelivery: "05 Nov 2025",
            QtyScheduled: "420 KG",
            DispatchMode: "Sea",
            DeliveryQty: "420 KG",
            Status: "Partially Delivered",
            Status_Color: "#007bff"
        },
        {
            Date: "10 Oct 2025",
            DeliveryPlanNo: "DEL/PLAN/005",
            Type: "JobOrder",
            OrderNo: "JOB/NO/005",
            ProductType: "Jacket",
            Priority: "Medium",
            TargetDelivery: "07 Nov 2025",
            QtyScheduled: "300 KG",
            DispatchMode: "Truck",
            DeliveryQty: "300 KG",
            Status: "Delayed",
            Status_Color: "#6c757d"
        },
        {
            Date: "12 Oct 2025",
            DeliveryPlanNo: "DEL/PLAN/006",
            Type: "Batch",
            OrderNo: "BATCH/NO/006",
            ProductType: "Kurta",
            Priority: "High",
            TargetDelivery: "10 Nov 2025",
            QtyScheduled: "280 KG",
            DispatchMode: "Courier",
            DeliveryQty: "280 KG",
            Status: "Planned",
            Status_Color: "#fd7e14"
        },
        {
            Date: "14 Oct 2025",
            DeliveryPlanNo: "DEL/PLAN/007",
            Type: "SaleOrder",
            OrderNo: "SALE/NO/007",
            ProductType: "Saree",
            Priority: "Normal",
            TargetDelivery: "12 Nov 2025",
            QtyScheduled: "350 KG",
            DispatchMode: "Rail",
            DeliveryQty: "350 KG",
            Status: "In-Process",
            Status_Color: "#dc3545"
        },
        {
            Date: "16 Oct 2025",
            DeliveryPlanNo: "DEL/PLAN/008",
            Type: "JobOrder",
            OrderNo: "JOB/NO/008",
            ProductType: "Hoodie",
            Priority: "Medium",
            TargetDelivery: "15 Nov 2025",
            QtyScheduled: "400 KG",
            DispatchMode: "Sea",
            DeliveryQty: "400 KG",
            Status: "Completed",
            Status_Color: "#6f42c1"
        },
        {
            Date: "18 Oct 2025",
            DeliveryPlanNo: "DEL/PLAN/009",
            Type: "Batch",
            OrderNo: "BATCH/NO/009",
            ProductType: "T-Shirt",
            Priority: "High",
            TargetDelivery: "18 Nov 2025",
            QtyScheduled: "450 KG",
            DispatchMode: "Truck",
            DeliveryQty: "450 KG",
            Status: "Partially Delivered",
            Status_Color: "#007bff"
        }
    ];
     
    const inwardColumns = [
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'DeliveryPlanNo', name: 'DeliveryPlanNo', title: 'DeliveryPlan No' },
        { data: 'Type', name: 'Type', title: 'Type' },
        { data: 'OrderNo', name: 'OrderNo', title: 'Order No' },
        { data: 'ProductType', name: 'ProductType', title: 'Product Type' },
        { data: 'Priority', name: 'Priority', title: 'Priority' },
        { data: 'TargetDelivery', name: 'TargetDelivery', title: 'Target Delivery' },
        { data: 'QtyScheduled', name: 'QtyScheduled', title: 'Qty Scheduled' },
        { data: 'DispatchMode', name: 'DispatchMode', title: 'Dispatch Mode' },
        { data: 'DeliveryQty', name: 'DeliveryQty', title: 'Delivery Qty' }, 
        { data: 'Status', name: 'Status', title: 'Status' }
    ];

    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="DeliveryPlanTable">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('DeliveryPlanTable', deliveryPlanData, inwardColumns, 11, 'Date', '350px', true, { update: true, delete: true });
}

function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {

    if ($('#' + tableid).length && $.fn.DataTable.isDataTable('#' + tableid)) {
        try {
            $('#' + tableid).DataTable().destroy();
        } catch (error) {
            console.error('DataTable destroy error:', error);
            return;
        }
    }

    $('#' + tableid).empty();

    const StatusColumnIndex = columns.findIndex(col => col.data === 'Status');
    const LocationColumnIndex = columns.findIndex(col => col.data === 'HiringLocation');
    const SourcesColumnIndex = columns.findIndex(col => col.data === 'Sources');
    const PriorityColumnIndex = columns.findIndex(col => col.data === 'Priority');

    const renderColumn = [];

    if (StatusColumnIndex !== -1) {
        renderColumn.push({
            targets: StatusColumnIndex,
            render: function (data, type, row) {
                if (type === 'display' && row.Status_Color) {
                    return `
                        <div>
                            <span class="ana-span badge text-white" 
                                  style="background:${row.Status_Color};width: 115px;font-size: 12px;height: 23px;">
                                ${row.Status}
                            </span>
                        </div>`;
                }
                return data;
            }
        });
    }

    if (PriorityColumnIndex !== -1) {
        renderColumn.push({
            targets: PriorityColumnIndex,
            render: function (data, type, row) {
                if (type === 'display') {
                    let color = '';
                    switch (data?.toLowerCase()) {
                        case 'high':
                            color = 'red';
                            break;
                        case 'medium':
                            color = 'orange';
                            break;
                        case 'normal':
                            color = 'green';
                            break;
                        default:
                            color = 'black';
                    }
                    return `<span style="color:${color};font-weight:600;">${data}</span>`;
                }
                return data;
            }
        });
    }

    if (LocationColumnIndex !== -1) {
        renderColumn.push({
            targets: LocationColumnIndex,
            render: function (data, type, row) {
                if (type === 'display') {
                    const hotDot = row.IsHot ? '<span style="color:red;font-size:20px;">•</span> ' : '';
                    return hotDot + data;
                }
                return data;
            }
        });
    }

    if (isAction && (access.update || access.delete)) {
        columns.push({
            data: "Action", name: "Action", title: "Action", orderable: false
        });

        renderColumn.push({
            targets: actionTarget,
            render: function (data, type, row) {
                let html = '';
                if (access.update) {
                    html += `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit">
                                <img src="/assets/commonimages/edit.svg" />
                             </i>`;
                }
                if (access.delete) {
                    html += `<i class="btn-delete alert_delete mx-1" data-id="${row[editcolumn]}" title="Delete">
                                <img src="/assets/commonimages/delete.svg" />
                             </i>`;
                }
                return html;
            }
        });
    }

    const hasValidData = data.length > 0 && Object.values(data[0]).some(v => v !== null);

    const lang = $(window).width() <= 575 ? {
        "paginate": {
            "next": ">",
            "previous": "<"
        }
    } : {};

    const table = $('#' + tableid).DataTable({
        dom: "Bfrtip",
        bDestroy: true,
        responsive: true,
        data: data,
        columns: columns,
        scrollY: scrollpx,
        sScrollX: "100%",
        scrollCollapse: true,
        aaSorting: [],
        info: hasValidData,
        paging: hasValidData,
        pageLength: 7,
        lengthMenu: [7, 14, 50],
        language: $.extend({}, lang, {
            emptyTable: `
                <div>
                    <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                    No records found
                </div>`
        }),
        columnDefs: renderColumn
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    setTimeout(function () {
        const table1 = $('#' + tableid).DataTable();
        if (window.Common && Common.autoAdjustColumns) {
            Common.autoAdjustColumns(table1);
        }
    }, 100);
}