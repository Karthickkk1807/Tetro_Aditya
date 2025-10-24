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

    $(document).on('click', '#AddFinalQC', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#FinalQCCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#FinalQCCanvas").css("width", "50%");
        } else {
            $("#FinalQCCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingFinalQC();
        $('#FinalQCHeader').text('FinalQC Details');
        $('#SaveFinalQC').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#FinalQCCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#FinalQCCanvas").css("width", "50%");
        } else {
            $("#FinalQCCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingFinalQC();
        $('#FinalQCHeader').text('Edit FinalQC Details');
        $('#SaveFinalQC').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#FinalQCCanvas").css("width", "0%");
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

function CanvasOpenFirstShowingFinalQC() {
    $('#FinalQCCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#FinalQCCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#FinalQCCanvas').offset().top
    }, 'fast');
}

function MainGridData() {

    const FinalQCData = [
        {
            Date: "02 Oct 2025",
            FinalQCNo: "FIN/QC/001",
            ProcessType: "Dyed",
            JobOrderNo: "JOB/NO/001",
            InspectedBy: "KAVINESH RAJASEKAR",
            ApprovedBy: "INDRASENAN",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "05 Oct 2025",
            FinalQCNo: "FIN/QC/002",
            ProcessType: "Printed",
            JobOrderNo: "JOB/NO/002",
            InspectedBy: "DEXY",
            ApprovedBy: "RAGHURAMAN",
            Status: "Hold",
            Status_Color: "#ffc107"
        },
        {
            Date: "08 Oct 2025",
            FinalQCNo: "FIN/QC/003",
            ProcessType: "Finished",
            JobOrderNo: "JOB/NO/003",
            InspectedBy: "MITHRAN",
            ApprovedBy: "KARTHIKEYANI",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "11 Oct 2025",
            FinalQCNo: "FIN/QC/004",
            ProcessType: "Coated",
            JobOrderNo: "JOB/NO/004",
            InspectedBy: "INDRASENAN",
            ApprovedBy: "DEXY",
            Status: "Rejected",
            Status_Color: "#dc3545"
        },
        {
            Date: "14 Oct 2025",
            FinalQCNo: "FIN/QC/005",
            ProcessType: "Dyed",
            JobOrderNo: "JOB/NO/005",
            InspectedBy: "KARTHIKEYANI",
            ApprovedBy: "MITHRAN",
            Status: "Hold",
            Status_Color: "#ffc107"
        },
        {
            Date: "18 Oct 2025",
            FinalQCNo: "FIN/QC/006",
            ProcessType: "Printed",
            JobOrderNo: "JOB/NO/006",
            InspectedBy: "RAGHURAMAN",
            ApprovedBy: "INDRASENAN",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "21 Oct 2025",
            FinalQCNo: "FIN/QC/007",
            ProcessType: "Finished",
            JobOrderNo: "JOB/NO/007",
            InspectedBy: "DEXY",
            ApprovedBy: "KAVINESH RAJASEKAR",
            Status: "Rejected",
            Status_Color: "#dc3545"
        },
        {
            Date: "23 Oct 2025",
            FinalQCNo: "FIN/QC/008",
            ProcessType: "Coated",
            JobOrderNo: "JOB/NO/008",
            InspectedBy: "INDRASENAN",
            ApprovedBy: "RAGHURAMAN",
            Status: "Approved",
            Status_Color: "#28a745"
        }
    ];
     
    const finalQCColumns = [
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'FinalQCNo', name: 'FinalQCNo', title: 'Final QC No' },
        { data: 'ProcessType', name: 'ProcessType', title: 'Process Type' },
        { data: 'JobOrderNo', name: 'JobOrderNo', title: 'JobOrder No' },
        { data: 'InspectedBy', name: 'InspectedBy', title: 'Inspected By' },
        { data: 'ApprovedBy', name: 'ApprovedBy', title: 'Approved By' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];
     
    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="FinalQCTable">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('FinalQCTable', FinalQCData, finalQCColumns, 7, 'Date', '350px', true, { update: true, delete: true });
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