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

    $(document).on('click', '#AddOutWard', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#OutWardCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#OutWardCanvas").css("width", "50%");
        } else {
            $("#OutWardCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingOutWard();
        $('#AutoGenertedNo').empty().append($('<option>', { value: '', text: '--Select--', }));
        $('#TypeNo').text('Type No');
        $("#FormOutWard")[0].reset();
        $('#OutWardHeader').text('OutWard Details');
        $('#SaveOutWard').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#OutWardCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#OutWardCanvas").css("width", "50%");
        } else {
            $("#OutWardCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingOutWard();
        $('#OutWardHeader').text('Edit OutWard Details');
        $('#SaveOutWard').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#OutWardCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });

    $(document).on('change', '#TransactionId', function () {
        var $thisVal = $(this).val();
        var $autoNo = $('#AutoGenertedNo'); 
        var $typeNo = $('#TypeNo');

        $autoNo.empty().append($('<option>', { value: '', text: '--Select--' })); 
        $typeNo.text('Type No');

        $thisVal == 4 || $thisVal == '' ? $('#DivName').hide() : $('#DivName').show();

        if (!$thisVal) return;

        var dataMap = { 
            1: { prefix: 'SALE/NO/', typelable: 'SaleOrder No' },
            2: { prefix: 'JOB/NO/', typelable: 'JobOrder No' },
            default: { prefix: 'TRANS/NO/', typelable: 'Transfer No' }
        };

        var data = dataMap[$thisVal] || dataMap.default;

        for (var i = 1; i <= 6; i++) {
            $autoNo.append($('<option>', {
                value: i,
                text: data.prefix + ('00' + i).slice(-3)
            }));
        }
         
        $typeNo.text(data.typelable);
    });


});

function CanvasOpenFirstShowingOutWard() {
    $('#OutWardCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#OutWardCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#OutWardCanvas').offset().top
    }, 'fast'); 
}
 
function MainGridData() {

    const OutwardData = [
        {
            Date: "03 Oct 2025",
            OutwardNo: "OUT/NO/001",
            Transaction: "Sales Order",
            OrderNo: "SALE/NO/001",
            DeliveryChallanNo: "DC/NO/001",
            OutwardQty: "125 KGS",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "06 Oct 2025",
            OutwardNo: "OUT/NO/002",
            Transaction: "Job Order",
            OrderNo: "JOB/NO/002",
            DeliveryChallanNo: "DC/NO/002",
            OutwardQty: "210 KGS",
            Status: "Hold",
            Status_Color: "#ffc107"
        },
        {
            Date: "09 Oct 2025",
            OutwardNo: "OUT/NO/003",
            Transaction: "Transfer Order",
            OrderNo: "TRANS/NO/003",
            DeliveryChallanNo: "DC/NO/003",
            OutwardQty: "175 KGS",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "12 Oct 2025",
            OutwardNo: "OUT/NO/004",
            Transaction: "Sales Order",
            OrderNo: "SALE/NO/004",
            DeliveryChallanNo: "DC/NO/004",
            OutwardQty: "145 KGS",
            Status: "Rejected",
            Status_Color: "#dc3545"
        },
        {
            Date: "16 Oct 2025",
            OutwardNo: "OUT/NO/005",
            Transaction: "Job Order",
            OrderNo: "JOB/NO/005",
            DeliveryChallanNo: "DC/NO/005",
            OutwardQty: "190 KGS",
            Status: "Hold",
            Status_Color: "#ffc107"
        },
        {
            Date: "18 Oct 2025",
            OutwardNo: "OUT/NO/006",
            Transaction: "Transfer Order",
            OrderNo: "TRANS/NO/006",
            DeliveryChallanNo: "DC/NO/006",
            OutwardQty: "165 KGS",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "21 Oct 2025",
            OutwardNo: "OUT/NO/007",
            Transaction: "Sales Order",
            OrderNo: "SALE/NO/007",
            DeliveryChallanNo: "DC/NO/007",
            OutwardQty: "155 KGS",
            Status: "Rejected",
            Status_Color: "#dc3545"
        },
        {
            Date: "23 Oct 2025",
            OutwardNo: "OUT/NO/008",
            Transaction: "Transfer Order",
            OrderNo: "TRANS/NO/008",
            DeliveryChallanNo: "DC/NO/008",
            OutwardQty: "180 KGS",
            Status: "Approved",
            Status_Color: "#28a745"
        }
    ];
     
    const outwardColumns = [
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'OutwardNo', name: 'OutwardNo', title: 'Outward No' },
        { data: 'Transaction', name: 'Transaction', title: 'Transaction' },
        { data: 'OrderNo', name: 'OrderNo', title: 'Order No' },
        { data: 'DeliveryChallanNo', name: 'DeliveryChallanNo', title: 'Delivery Challan No' },
        { data: 'OutwardQty', name: 'OutwardQty', title: 'Outward Qty' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];
    
    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="OutWardTable">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('OutWardTable', OutwardData, outwardColumns, 7, 'Date', '350px', true, { update: true, delete: true });
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

