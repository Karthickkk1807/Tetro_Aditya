var productionPlanLogId = 0;

$(document).ready(async function () {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();
        $('#tableFilter').val('');

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogSuccess, null);
    });

    function updateMonthDisplay(date) {
        let monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear();
        $('#dateDisplay2').text(month + " " + year);

        let now = new Date();
        let currentMonth = now.getMonth();
        let currentYear = now.getFullYear();

        if (date.getFullYear() > currentYear || (date.getFullYear() === currentYear && date.getMonth() >= currentMonth)) {
            $('#increment-month-btn2').hide();
        } else {
            $('#increment-month-btn2').show();
        }
    }

    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#tableFilter').val('');
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
            Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetProductionLogSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        $('#tableFilter').val('');

        displayedDate = new Date(currentYear, currentMonth);
        $('#increment-month-btn2').show();

        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogSuccess, null);
      
    $(document).on('click', '.btn-edit', function () {
        ProductionId = $(this).data('id');
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#ProductionLogCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#ProductionLogCanvas").css("width", "50%");
        } else {
            $("#ProductionLogCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#ProductionHeader').text('ProductionLog Details');
        $("#FormProduction")[0].reset();
        $('#SaveProductionLog').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
        CanvasOpenFirstShowingProduction();

        var hotcodeData = [
            { 
                CreatedBy: "Kavinesh Raj",
                Date: "2025-01-12 10:23:45",
                Process: "Reversing",
                Qty: "3900 KG"
            },
            { 
                CreatedBy: "Sathiesh Kumar",
                Date: "2025-01-12 11:45:12",
                Process: "Stitching",
                Qty: "3800 KG"
            },
            { 
                CreatedBy: "Tharani",
                Date: "2025-01-12 14:05:33",
                Process: "Softflow",
                Qty: "3800 KG"
            },
            { 
                CreatedBy: "Karthick",
                Date: "2025-01-12 16:18:59",
                Process: "Stentering",
                Qty: "3700 KG"
            },
            { 
                CreatedBy: "Dhanush",
                Date: "2025-01-12 19:46:09",
                Process: "Dryer",
                Qty: "3500 KG"
            },
            { 
                CreatedBy: "Mariyan",
                Date: "2025-01-12 23:30:00",
                Process: "Compacting",
                Qty: "3300 KG"
            }
        ];

        const productionColumns = [ 
            { data: 'Date', name: 'Date', title: 'Date' },
            { data: 'Process', name: 'Process', title: 'Process' },
            { data: 'Qty', name: 'Qty', title: 'Qty' },
            { data: 'CreatedBy', name: 'CreatedBy', title: 'Created By' }
        ];

        $('#TransactionsInfo').empty('');
        var html =
        `
        <div class="table-responsive">
            <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="TransactionsInfoTable"></table>
        </div>
        `;
        $('#TransactionsInfo').append(html);

        bindTableTransactionsInfo('TransactionsInfoTable', hotcodeData, -1, productionColumns, '350px', true);
        //var columns = Common.bindColumn(data[3], ['PurchaseRequestId', 'Status_Color']);
        //bindTableTransactionsInfo('TransactionsInfoTable', data[3], columns, -1, 'PurchaseRequestId', '151px', true);
         
        /*============================QRCODE*/

        $("#QRCode").html("");

        //var scanUrl = "http://103.174.10.91:8108/ProductionQRCode/QRCodePop";
        var scanUrl = "https://localhost:44366/Productions/ProductionPlan/ProductionQRCode/QRCodePop";

        new QRCode(document.getElementById("QRCode"), {
            text: scanUrl,
            width: 100,
            height: 100
        });
        $("#QRCode").removeAttr("title");
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#ProductionLogCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });

    $(document).on('click', '.btn-edit-Trans', function () {
        $('#Process').val('5');
        $('#Quantity').val('2900 KG');
        $('#PreparedBy').val('1');
    });
});

function CanvasOpenFirstShowingProduction() {
    $('#ProductionLogCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2').collapse('hide');
    $('#ProductionLogCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#ProductionLogCanvas').offset().top
    }, 'fast');
}

function GetProductionLogSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $("#CounterTextBox1").text(CounterBox[0]);
        $("#CounterTextBox2").text(CounterBox[1]);
        $("#CounterTextBox3").text(CounterBox[2]);
        $("#CounterTextBox4").text(CounterBox[3]);

        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        $('#MainGrid').empty('');
        var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="ProductionLogTable">
                </table>
            `;
        $('#MainGrid').append(html);

        var columns = Common.bindColumn(data[1], ['ProductionPlanId', 'Status_Color']);

        bindTable('ProductionLogTable', data[1], columns, -1, 'ProductionPlanId', '350px', true, access);
        $(".dataTables_scrollBody").css("max-height", "310px");
    }
}

function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($('#' + tableid).length && $.fn.DataTable.isDataTable('#' + tableid)) {
        try {
            //$('#' + tableid).DataTable().clear().destroy();
        } catch (error) {
            console.error('DataTable destroy error:', error);
            return; // stop execution if there's an error
        }
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

    if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [
        {
            "targets": StatusColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Status_Color != null && row.Status_Color.length > 0) {
                    var dataText = row.Status;
                    var statusColor = row.Status_Color.toLowerCase();

                    var htmlContent = '<div>';
                    htmlContent += '<span class="ana-span badge text-white" style="background:' + statusColor + ';width: 115px;font-size: 12px;height: 23px;">' + dataText + '</span>';
                    htmlContent += '</div>';

                    return htmlContent;
                }
                return data;
            }
        }
    ];
    if (access.update || access.delete) {
        renderColumn.push(
            {
                targets: actionTarget,
                render: function (data, type, row, meta) {
                    var editCondition = access.update;
                    var deleteCondition = access.delete;
                    let html = "";
                    if (tableid === "Audittable") {
                        html += `<i class="btn-report mx-1 fas fa-file-alt text-primary" 
                            data-id="${row[editcolumn]}" 
                            title="Report" 
                            style="cursor:pointer; font-size:16px;">
                        </i>`;
                    }
                    if (editCondition) {
                        html += `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit">
                            <img src="/assets/commonimages/edit.svg" />
                         </i>`;
                    }
                    if (deleteCondition) {
                        html += `<i class="btn-delete alert_delete mx-1" data-id="${row[editcolumn]}" title="Delete">
                            <img src="/assets/commonimages/delete.svg" />
                         </i>`;
                    }

                    return html;
                }
            }
        )
    }
    var lang = {};
    var screenWidth = $(window).width();
    if (screenWidth <= 575) {
        var lang = {
            "paginate": {
                "next": ">",
                "previous": "<"
            }
        }
    }

    var table = $('#' + tableid).DataTable({
        "dom": "Bfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !isTetroONEnocount ? data : [],
        "columns": columns,
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "aaSorting": [],
        "scrollCollapse": true,
        "oSearch": { "bSmart": false, "bRegex": true },
        "info": hasValidData,
        "paging": hasValidData,
        "pageLength": 7,
        "lengthMenu": [7, 14, 50],
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "columnDefs": !isTetroONEnocount
            ? renderColumn : [],
    });
    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });
    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}

function bindTableTransactionsInfo(tableid, data, actionTarget, columns, scrollpx, isAction) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isbuyernocount = data[0].hasOwnProperty('TetroONEnocount');

    if (isAction == true && data != null && data.length > 0) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [];

    renderColumn.push(
        {
            targets: actionTarget,
            render: function (data, type, row, meta) {
                return `<td>
                            <div class="actionEllipsis">
                                <i class="btn-edit-Trans mx-1" data-id="" title="Edit">
                                   <img src="/assets/commonimages/edit.svg" />
                                </i> 
                            </div>
                        </td> `;
            }
        }
    )

    var dataTableOptions = {
        "dom": "Blfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !isbuyernocount ? data : [],
        "columns": columns,
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "scrollX": true,
        "scroller": true,
        "scrollCollapse": true,
        "aaSorting": [],
        "language": {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        },
        "searching": false,
        "info": false,
        "paging": false,
        "pageLength": 30,
        //"lengthMenu": [5, 10, 25, 50],
        "columnDefs": renderColumn
    };
    $('#' + tableid).DataTable(dataTableOptions);
    var tableId = $('#' + tableid).DataTable();
    Common.autoAdjustColumns(tableId);

}