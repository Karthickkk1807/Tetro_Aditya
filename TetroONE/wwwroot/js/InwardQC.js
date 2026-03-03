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

    $(document).on('change', '#InwardNo', function () {
        var $thisVal = $(this).val();
         
        var inwardMap = {
            1: { TransactionId: '1', AutoGenertedNo: '1', PersonName: '1', InwardDate: '2025-10-24',Weight:'50',NoOfRoll:'6' },
            2: { TransactionId: '2', AutoGenertedNo: '2', PersonName: '2', InwardDate: '2025-10-23',Weight:'40',NoOfRoll:'7' },
            3: { TransactionId: '3', AutoGenertedNo: '4', PersonName: '3', InwardDate: '2025-10-15',Weight:'100',NoOfRoll:'7' },
            4: { TransactionId: '4', AutoGenertedNo: '5', PersonName: '4', InwardDate: '2025-10-18',Weight:'200',NoOfRoll:'9' },
            5: { TransactionId: '2', AutoGenertedNo: '5', PersonName: '6', InwardDate: '2025-10-12',Weight:'790',NoOfRoll:'2' },
            6: { TransactionId: '2', AutoGenertedNo: '5', PersonName: '6', InwardDate: '2025-10-12',Weight:'120',NoOfRoll:'12' }
        };
         
        var data = inwardMap[$thisVal] || { TransactionId: '', AutoGenertedNo: '', PersonName: '', InwardDate: '', Weight: '', NoOfRoll :''};
         
        $('#TransactionId').val(data.TransactionId).trigger('change');
        $('#AutoGenertedNo').val(data.AutoGenertedNo).trigger('change');
        $('#PersonName').val(data.PersonName).trigger('change');
        $('#InwardDate').val(data.InwardDate);
        $('#Weight').val(data.Weight);
        $('#RollCount').val(data.NoOfRoll);
    });


    $(document).on('change', '#TransactionId', function () {
        var $thisVal = $(this).val();
        var $autoNo = $('#AutoGenertedNo');
        var $personNameLable = $('#PersonNameLable');
        var $typeNo = $('#TypeNo');

        $autoNo.empty().append($('<option>', { value: '', text: '--Select--' }));
        $personNameLable.text('Name');
        $typeNo.text('Type No');

        $thisVal == 4 || $thisVal == '' ? $('#DivName').hide() : $('#DivName').show();

        if (!$thisVal) return;

        var dataMap = {
            1: { prefix: 'PO/NO/', label: 'Vendor Name', typelable: 'PurchaseOrder No' },
            2: { prefix: 'SALE/NO/', label: 'Client Name', typelable: 'SaleOrder No' },
            3: { prefix: 'JOB/NO/', label: 'Client Name', typelable: 'JobOrder No' },
            default: { prefix: 'TRANS/NO/', label: 'Client Name', typelable: 'Transfer No' }
        };

        var data = dataMap[$thisVal] || dataMap.default;

        for (var i = 1; i <= 6; i++) {
            $autoNo.append($('<option>', {
                value: i,
                text: data.prefix + ('00' + i).slice(-3)
            }));
        }

        $personNameLable.text(data.label);
        $typeNo.text(data.typelable);
    });

    $(document).on('click', '#AddInWardQC', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#InWardQCCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#InWardQCCanvas").css("width", "50%");
        } else {
            $("#InWardQCCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder();
        $("#FormProcessing")[0].reset();
        $('#AutoGenertedNo').empty().append($('<option>', { value: '', text: '--Select--', }));
        $('#DivName').hide(); 
        $('#InWardQCHeader').text('InWard QC Details');
        $('#SaveInWardQC').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#InWardQCCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#InWardQCCanvas").css("width", "50%");
        } else {
            $("#InWardQCCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder();
        $('#InWardQCHeader').text('Edit InWard QC Details');
        $('#SaveInWardQC').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#InWardQCCanvas").css("width", "0%");
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

function CanvasOpenFirstShowingJobOrder() {
    $('#InWardQCCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#InWardQCCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#InWardQCCanvas').offset().top
    }, 'fast'); 
}
 
function MainGridData() {

    const InwardQCData = [
        {
            Date: "02 Oct 2025",
            InwardQCNo: "INW/QC/001",
            InwardQuantity: 150,
            InspectorName: "KAVINESH RAJASEKAR",
            NoOfQCPassed: 140,
            NoOfQCFailed: 10,
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "05 Oct 2025",
            InwardQCNo: "INW/QC/002",
            InwardQuantity: 180,
            InspectorName: "INDRASENAN",
            NoOfQCPassed: 175,
            NoOfQCFailed: 5,
            Status: "Draft",
            Status_Color: "#ffc107"
        },
        {
            Date: "08 Oct 2025",
            InwardQCNo: "INW/QC/003",
            InwardQuantity: 160,
            InspectorName: "DEXY",
            NoOfQCPassed: 155,
            NoOfQCFailed: 5,
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "11 Oct 2025",
            InwardQCNo: "INW/QC/004",
            InwardQuantity: 190,
            InspectorName: "MITHRAN",
            NoOfQCPassed: 160,
            NoOfQCFailed: 30,
            Status: "Authorized",
            Status_Color: "#0000ff"
        },
        {
            Date: "15 Oct 2025",
            InwardQCNo: "INW/QC/005",
            InwardQuantity: 210,
            InspectorName: "KARTHIKEYANI",
            NoOfQCPassed: 205,
            NoOfQCFailed: 5,
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "18 Oct 2025",
            InwardQCNo: "INW/QC/006",
            InwardQuantity: 175,
            InspectorName: "RAGHURAMAN",
            NoOfQCPassed: 170,
            NoOfQCFailed: 5,
            Status: "Draft",
            Status_Color: "#ffc107"
        },
        {
            Date: "21 Oct 2025",
            InwardQCNo: "INW/QC/007",
            InwardQuantity: 160,
            InspectorName: "DEXY",
            NoOfQCPassed: 120,
            NoOfQCFailed: 40,
            Status: "Authorized",
            Status_Color: "#0000ff"
        },
        {
            Date: "23 Oct 2025",
            InwardQCNo: "INW/QC/008",
            InwardQuantity: 200,
            InspectorName: "INDRASENAN",
            NoOfQCPassed: 198,
            NoOfQCFailed: 2,
            Status: "Approved",
            Status_Color: "#28a745"
        }
    ];

    const inwardQCColumns = [
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'InwardQCNo', name: 'InwardQCNo', title: 'InwardQC No' },
        { data: 'InwardQuantity', name: 'InwardQuantity', title: 'Inward Quantity' },
        { data: 'InspectorName', name: 'InspectorName', title: 'Inspector By' },
        { data: 'NoOfQCPassed', name: 'NoOfQCPassed', title: 'No Of QC Passed' },
        { data: 'NoOfQCFailed', name: 'NoOfQCFailed', title: 'No Of QC Failed' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];


    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="InWardQCTable">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('InWardQCTable', InwardQCData, inwardQCColumns, 7, 'Date', '350px', true, { update: true, delete: true });
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