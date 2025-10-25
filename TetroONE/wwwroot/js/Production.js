$(document).ready(function () {
    MainGridData();
    $('.mydatetimepicker').mdtimepicker();

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

    $(document).on('click', '#AddProduction', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#ProductionCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#ProductionCanvas").css("width", "50%");
        } else {
            $("#ProductionCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay'); 
        $("#FormProduction")[0].reset();
        $('#ProductionHeader').text('Production Details');
        $('#SaveProduction').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        CanvasOpenFirstShowingProduction();
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#ProductionCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#ProductionCanvas").css("width", "50%");
        } else {
            $("#ProductionCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#ProductionHeader').text('Edit Production Details');
        $('#SaveProduction').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
        CanvasOpenFirstShowingProduction();
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#ProductionCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });
     
    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    }); 
});

function CanvasOpenFirstShowingProduction() {
    $('#ProductionPlanCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2').collapse('hide');
    $('#ProductionPlanCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast'); 
    $('html, body').animate({
        scrollTop: $('#ProductionPlanCanvas').offset().top
    }, 'fast');
}

function MainGridData() {

    const operatorNames = ["Kavinesh Rajasekar", "Karthikeyani", "Mithran", "Dexy", "Indrasenan"];
    const approvedByNames = ["Kavinesh Rajasekar", "Karthikeyani", "Mithran", "Dexy", "Indrasenan"];
    const shifts = ["General Shift", "Morning Shift", "Day Shift", "Night Shift"];
    const processStages = ["Dyeing", "Printing", "Finishing"];
    const reworkComments = ["Minor tear", "Color fade", "Loose stitch", "Small stain", "Measurement error"];

    const ProductionData = [
        {
            Date: "01 Oct 2025",
            ProductionNo: "PRO/NO/001",
            Batch: "BATCH/NO/001",
            Shift: shifts[0],
            ProcessStage: processStages[0],
            MachineNo: "Machine 1",
            Operator: operatorNames[0],
            StartTime: "08:00 AM",
            EndTime: "04:00 PM",
            OutputQty: "8700 KGS",
            ReworkRejection: reworkComments[0],
            Status: "Draft",
            ApprovedBy: "-",
            Status_Color: "#fd7e14" // Orange
        },
        {
            Date: "03 Oct 2025",
            ProductionNo: "PRO/NO/002",
            Batch: "BATCH/NO/002",
            Shift: shifts[1],
            ProcessStage: processStages[1],
            MachineNo: "Machine 2",
            Operator: operatorNames[1],
            StartTime: "06:00 AM",
            EndTime: "02:00 PM",
            OutputQty: "9200 KGS",
            ReworkRejection: "-",
            Status: "Approved",
            ApprovedBy: approvedByNames[1],
            Status_Color: "#6f42c1" // Purple
        },
        {
            Date: "05 Oct 2025",
            ProductionNo: "PRO/NO/003",
            Batch: "BATCH/NO/003",
            Shift: shifts[2],
            ProcessStage: processStages[2],
            MachineNo: "Machine 3",
            Operator: operatorNames[2],
            StartTime: "02:00 PM",
            EndTime: "10:00 PM",
            OutputQty: "7800 KGS",
            ReworkRejection: reworkComments[2],
            Status: "In-Progress",
            ApprovedBy: "-",
            Status_Color: "#dc3545" // Red
        },
        {
            Date: "07 Oct 2025",
            ProductionNo: "PRO/NO/004",
            Batch: "BATCH/NO/004",
            Shift: shifts[3],
            ProcessStage: processStages[0],
            MachineNo: "Machine 4",
            Operator: operatorNames[3],
            StartTime: "10:00 PM",
            EndTime: "06:00 AM",
            OutputQty: "8500 KGS",
            ReworkRejection: reworkComments[3],
            Status: "Draft",
            ApprovedBy: "-",
            Status_Color: "#fd7e14"
        },
        {
            Date: "10 Oct 2025",
            ProductionNo: "PRO/NO/005",
            Batch: "BATCH/NO/005",
            Shift: shifts[0],
            ProcessStage: processStages[1],
            MachineNo: "Machine 5",
            Operator: operatorNames[4],
            StartTime: "08:00 AM",
            EndTime: "04:00 PM",
            OutputQty: "8900 KGS",
            ReworkRejection: "-",
            Status: "Approved",
            ApprovedBy: approvedByNames[4],
            Status_Color: "#6f42c1"
        },
        {
            Date: "12 Oct 2025",
            ProductionNo: "PRO/NO/006",
            Batch: "BATCH/NO/006",
            Shift: shifts[1],
            ProcessStage: processStages[2],
            MachineNo: "Machine 6",
            Operator: operatorNames[0],
            StartTime: "06:00 AM",
            EndTime: "02:00 PM",
            OutputQty: "8100 KGS",
            ReworkRejection: reworkComments[0],
            Status: "In-Progress",
            ApprovedBy: "-",
            Status_Color: "#dc3545"
        },
        {
            Date: "14 Oct 2025",
            ProductionNo: "PRO/NO/007",
            Batch: "BATCH/NO/007",
            Shift: shifts[2],
            ProcessStage: processStages[0],
            MachineNo: "Machine 7",
            Operator: operatorNames[1],
            StartTime: "02:00 PM",
            EndTime: "10:00 PM",
            OutputQty: "8300 KGS",
            ReworkRejection: reworkComments[1],
            Status: "Draft",
            ApprovedBy: "-",
            Status_Color: "#fd7e14"
        },
        {
            Date: "16 Oct 2025",
            ProductionNo: "PRO/NO/008",
            Batch: "BATCH/NO/008",
            Shift: shifts[3],
            ProcessStage: processStages[1],
            MachineNo: "Machine 8",
            Operator: operatorNames[2],
            StartTime: "10:00 PM",
            EndTime: "06:00 AM",
            OutputQty: "8800 KGS",
            ReworkRejection: "-",
            Status: "Approved",
            ApprovedBy: approvedByNames[2],
            Status_Color: "#6f42c1"
        },
        {
            Date: "18 Oct 2025",
            ProductionNo: "PRO/NO/009",
            Batch: "BATCH/NO/009",
            Shift: shifts[0],
            ProcessStage: processStages[2],
            MachineNo: "Machine 9",
            Operator: operatorNames[3],
            StartTime: "08:00 AM",
            EndTime: "04:00 PM",
            OutputQty: "9000 KGS",
            ReworkRejection: reworkComments[3],
            Status: "In-Progress",
            ApprovedBy: "-",
            Status_Color: "#dc3545"
        }
    ];
     
    const productionColumns = [
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'ProductionNo', name: 'ProductionNo', title: 'Production No' },
        { data: 'Batch', name: 'Batch', title: 'Batch No' },
        { data: 'Shift', name: 'Shift', title: 'Shift' },
        { data: 'ProcessStage', name: 'ProcessStage', title: 'Process Stage' },
        { data: 'MachineNo', name: 'MachineNo', title: 'Machine No' },
        { data: 'Operator', name: 'Operator', title: 'Operator' },
        { data: 'StartTime', name: 'StartTime', title: 'Start Time' },
        { data: 'EndTime', name: 'EndTime', title: 'End Time' },
        { data: 'OutputQty', name: 'OutputQty', title: 'Output Qty' },
        { data: 'ReworkRejection', name: 'ReworkRejection', title: 'Rework / Rejection' },
        { data: 'ApprovedBy', name: 'ApprovedBy', title: 'Approved By' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];
     
    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="ProductionPlanTable">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('ProductionPlanTable', ProductionData, productionColumns, 13, 'Date', '350px', true, { update: true, delete: true });
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

    const renderColumn = [];

    // Status rendering with color badge
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

    // Hiring Location with red dot if hot
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

    // Add action buttons column
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

    // Auto adjust columns after small delay
    setTimeout(function () {
        const table1 = $('#' + tableid).DataTable();
        if (window.Common && Common.autoAdjustColumns) {
            Common.autoAdjustColumns(table1);
        }
    }, 100);
}

