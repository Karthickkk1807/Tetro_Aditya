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

    $(document).on('click', '#AddInWard', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#InWardCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#InWardCanvas").css("width", "50%");
        } else {
            $("#InWardCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder();
        $('#AutoGenertedNo').empty().append($('<option>', { value: '', text: '--Select--', }));
        $('#DivName').hide();
        $("#FormInWard")[0].reset();
        $('#InWardHeader').text('InWard Details');
        $('#SaveInWard').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#InWardCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#InWardCanvas").css("width", "50%");
        } else {
            $("#InWardCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder(); 
        $('#InWardHeader').text('Edit InWard Details');
        $('#SaveInWard').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#InWardCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
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

    $(document).on('change', '#AutoGenertedNo', function () {
        var $thisval = $(this).val();
        if ($thisval != null || $thisval != '') {
            $('#PersonName').val('2');
        } else {
            $('#PersonName').val('');
        }
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
    $('#InWardCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#InWardCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#InWardCanvas').offset().top
    }, 'fast'); 
}

function MainGridData() {

    const InwardData = [
        {
            Date: "02 Oct 2025",
            InWardNo: "IN/NO/001",
            Transaction: "Purchase Order",
            OrderNo: "PO/NO/001",
            ContactName: "RPKS & CO",
            RecivedQty: "125 KGS",
            FabricType: "Woven",
            Status: "Draft",
            Status_Color: "#6c757d"
        },
        {
            Date: "05 Oct 2025",
            InWardNo: "IN/NO/002",
            Transaction: "Sale Order",
            OrderNo: "SALE/NO/004",
            ContactName: "H&M Group",
            RecivedQty: "200 KGS",
            FabricType: "Knitted",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "10 Oct 2025",
            InWardNo: "IN/NO/003",
            Transaction: "Job Order",
            OrderNo: "JOB/NO/006",
            ContactName: "Nike",
            RecivedQty: "150 KGS",
            FabricType: "Terry",
            Status: "Sent",
            Status_Color: "#007bff"
        },
        {
            Date: "14 Oct 2025",
            InWardNo: "IN/NO/004",
            Transaction: "Transfer Order",
            OrderNo: "TRANS/NO/001",
            ContactName: "Inditex",
            RecivedQty: "175 KGS",
            FabricType: "Woven",
            Status: "Accepted",
            Status_Color: "#17a2b8"
        },
        {
            Date: "18 Oct 2025",
            InWardNo: "IN/NO/005",
            Transaction: "Purchase Order",
            OrderNo: "PO/NO/005",
            ContactName: "RM CHEMICAL",
            RecivedQty: "98 KGS",
            FabricType: "Knitted",
            Status: "Cancelled",
            Status_Color: "#dc3545"
        },
        {
            Date: "20 Oct 2025",
            InWardNo: "IN/NO/006",
            Transaction: "Sale Order",
            OrderNo: "SALE/NO/007",
            ContactName: "Raymond Ltd",
            RecivedQty: "120 KGS",
            FabricType: "Terry",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            Date: "22 Oct 2025",
            InWardNo: "IN/NO/007",
            Transaction: "Job Order",
            OrderNo: "JOB/NO/008",
            ContactName: "Arvind Limited",
            RecivedQty: "185 KGS",
            FabricType: "Knitted",
            Status: "Draft",
            Status_Color: "#6c757d"
        },
        {
            Date: "24 Oct 2025",
            InWardNo: "IN/NO/008",
            Transaction: "Transfer Order",
            OrderNo: "TRANS/NO/016",
            ContactName: "Gokaldas Exports Ltd",
            RecivedQty: "160 KGS",
            FabricType: "Woven",
            Status: "Sent",
            Status_Color: "#007bff"
        }
    ];
     
    const inwardColumns = [
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'InWardNo', name: 'InWardNo', title: 'InWard No' },
        { data: 'Transaction', name: 'Transaction', title: 'Transaction' },
        { data: 'OrderNo', name: 'OrderNo', title: 'Order No' },
        { data: 'ContactName', name: 'ContactName', title: 'Contact Name' },
        { data: 'RecivedQty', name: 'RecivedQty', title: 'Received Qty' },
        { data: 'FabricType', name: 'FabricType', title: 'Fabric Type' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];


    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="InWardTable">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('InWardTable', InwardData, inwardColumns, 8, 'Date', '350px', true, { update: true, delete: true });
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

