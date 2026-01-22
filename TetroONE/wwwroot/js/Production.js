var productionPlanLogId = 0;
var productionPlanId = 0;
var PlantMappingId = 0;
var ArrayProcessTypeId = [];

$(document).ready(async function () {

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    Common.bindDropDownParent('PreparedBy', 'FormProduction', 'SampleReceivedBy');
    Common.bindDropDownParent('Status', 'FormProduction', 'ProductionLogStatus');

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
        Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: null, ProductionLogId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: null, ProductionLogId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogSuccess, null);
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
            Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: null, ProductionLogId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetProductionLogSuccess, null);
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
        Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: null, ProductionLogId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: null, ProductionLogId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogSuccess, null);

    $(document).on('click', '.btn-edit', function () {
        productionPlanLogId = 0;
        productionPlanId = 0;
        ArrayProcessTypeId = [];

        Common.removevalidation('FormProduction');

        productionPlanId = $(this).data('id');
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
        $("#Clear").hide();
        $('#SaveProductionLog').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');

        $('#Process, #Status').prop('disabled', false);

        //$('#SaveProductionLog').hide();

        Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: parseInt(productionPlanId), ProductionLogId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogNotNullSuccess, null);
    });

    $(document).on('click', '#Clear', function () {
        productionPlanLogId = 0;
        ArrayProcessTypeId = [];

        $("#Clear").hide();
        $('#SaveProductionLog').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');

        $('#Process, #Status').prop('disabled', false);
        $('#Quantity').val('');
        $('#Status').val('');
        $('#Remarks').val('');
        Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: parseInt(productionPlanId), ProductionLogId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogNotNullSuccess, null);
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#ProductionLogCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('click', '#SaveProductionLog', function () {
        if ($("#FormProduction").valid()) {
            var objvalue = {};
            objvalue.ProductionPlanId = productionPlanId != 0 ? productionPlanId : null;
            objvalue.ProductionLogId = productionPlanLogId != 0 ? productionPlanLogId : null;
            objvalue.PlantId = parseInt(PlantMappingId);

            objvalue.ProcessTypeId = parseInt($('#Process').val());
            objvalue.PreparedBy = parseInt($('#PreparedBy').val());
            objvalue.ProductionLogStatusId = parseInt($('#Status').val());
            objvalue.Quantity = parseFloat($('#Quantity').val());
            objvalue.Remarks = $('#Remarks').val();

            Common.ajaxCall("POST", "/Productions/InsertUpdateProductionLog", JSON.stringify(objvalue), GetProductionLogReload, null);
        }
    });

    $(document).on('click', '.btn-edit-Trans', function () {
        productionPlanLogId = $(this).data('id');
        $("#Clear").show();

        Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: parseInt(productionPlanId), ProductionLogId: parseInt(productionPlanLogId), FromDate: null, ToDate: null }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                bindDropDownSuccessProcessType(data[1], "Process", false);

                $('#Process').val(data[0][0].ProcessTypeId || '').prop('disabled', true);
                $('#Quantity').val(data[0][0].Quantity || '');
                $('#PreparedBy').val(data[0][0].PreparedBy || '');
                $('#Remarks').val(data[0][0].Remarks || '');
                $('#Status').val(data[0][0].ProductionLogStatusId || '').prop('disabled', true);

                //$('#SaveProductionLog').show(); 
            }
        }, null);
    });

    $('#Quantity').on('input', function () {
        var quantityValue = parseFloat($(this).val().replace(/[^\d.]/g, ''));
        var totalWeightValue = parseFloat($('#TotalWeight').val().replace(/[^\d.]/g, ''));

        if (!isNaN(quantityValue) && !isNaN(totalWeightValue)) {
            if (quantityValue > totalWeightValue) {
                Common.warning('Quantity cannot be greater than Total Weight!');
                $(this).val(totalWeightValue);
            }
        }
    });

    $(document).on('change', '#Process', function () {
        //$('.processBtn').hide();
        var selectedVal = $(this).val();

        if (selectedVal === '') {
            return;
        }
        var statusName = $('#Process option:selected').data('statusname');
        if (statusName === 'Started') {
            //$('.processBtn[data-status="Started"]').show();
            $('#Status').val('4').prop('disabled', true);
        } else {
            //$('.processBtn[data-status="Finished"]').show();
            $('#Status').val('5').prop('disabled', true);
        }
    });
});

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

function GetProductionLogNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        $('#BatchNo').val(data[0][0].ProductionNo);
        $('#BatchDate').val(data[0][0].ProductionDate);
        $('#TotalWeight').val(data[0][0].TotalWeight);
        $('#Colour').val(data[0][0].Color);
        $('#Machine').val(data[0][0].Machine);

        bindDropDownSuccessProcessType(data[1], "Process", true);

        //$('#Process').val(data[3][0].ProcessTypeId || '');
        if (data[1] && data[1][0] && data[1][0].StatusName === "Started") {
            $('#Quantity').val('');
            $('#Remarks').val('');
        } else {
            $('#Quantity').val(data[3][0].Quantity != null ? Number(data[3][0].Quantity).toFixed(3) : '');
            $('#Remarks').val(data[3][0].Remarks || '');
        }

        $('#PreparedBy').val(data[3][0].PreparedBy || '');
        $('#Remarks').val(data[3][0].Remarks || '');
        //$('#Status').val(data[3][0].ProductionLogStatusId || '');

        ArrayProcessTypeId = data[4];
        productionPlanLogId = data[5][0].ProductionLogId;
        $('#TransactionsInfo').empty('');
        var html = `
            <div class="table-responsive">
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="TransactionsInfoTable"></table>
            </div>
        `;
        $('#TransactionsInfo').append(html);

        var columns = Common.bindColumn(data[2], ['ProductionLogId']);
        bindTableTransactionsInfo('TransactionsInfoTable', data[2], -1, 'ProductionLogId', columns, '151px', true);

        /*============================QRCODE=============================*/

        $("#QRCode").html("");

        var scanUrl = "http://103.174.10.91:8108/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + productionPlanId + "&PlantMappingId=" + PlantMappingId;
        //var scanUrl = "https://localhost:44366/ProductionQRCode/QRCodePop" + "?ProductionPlanId=" + productionPlanId + "&PlantMappingId=" + PlantMappingId;

        new QRCode(document.getElementById("QRCode"), {
            text: scanUrl,
            width: 100,
            height: 100
        });
        //$("#QRCode").removeAttr("title");
    }
}

function GetProductionLogReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        //$("#ProductionLogCanvas").css("width", "0%");
        //$('#fadeinpage').removeClass('fadeoverlay');
        //$('#SaveProductionLog').hide();

        var fnData = Common.getDateFilter('dateDisplay2');
        //Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: null, ProductionLogId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogSuccess, null);
        Common.ajaxCall("GET", "/Productions/GetProductionLogDetails", { PlantId: parseInt(PlantMappingId), ProductionPlanId: parseInt(productionPlanId), ProductionLogId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionLogNotNullSuccess, null);
    } else {
        Common.errorMsg(response.message);
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

function bindTableTransactionsInfo(tableid, data, actionTarget, editcolumn, columns, scrollpx, isAction) {
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
                                <i class="btn-edit-Trans mx-1" data-id="${row[editcolumn]}" title="Edit">
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

function bindDropDownSuccessProcessType(response, controlid, IsTrigger) {

    if (response != null) {
        var dataValue = response;
        var $ddl = $('#' + controlid);

        $ddl.empty();

        if (dataValue.length > 0 && response[0].ProcessTypeId != null) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];

            $.each(dataValue, function (index, item) {
                $ddl.append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty]
                }).attr('data-StatusName', item.StatusName));
            });
        } else {
            $ddl.append($('<option>', {
                value: '',
                text: 'ProcessCompleted'
            }));
        }

        if (IsTrigger === true) $ddl.prop('selectedIndex', 0).trigger('change');
    }
}