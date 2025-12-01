var titleForHeaderProductTab = "";
var PlantMappingId = 0;
var manageStockId = 0;

$(document).ready(function () {

    PlantMappingId = parseInt(localStorage.getItem('UserFranchiseMappingId'));

    titleForHeaderProductTab = "Raw Material";

    var start = moment().startOf('month');
    var end = moment().endOf('month');
    Common.bindDropDown('distributorSelect', 'Client');
    $('#reportrange span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));

    function cb(start, end, label) {
        if (label === 'No Date') {
            $('#reportrange span').html('No Date');
        } else {
            $('#reportrange span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));
        }
    }

    // Initialize Date Range Picker
    $('#reportrange').daterangepicker({
        autoUpdateInput: false,
        alwaysShowCalendars: true,
        showCustomRangeLabel: true,
        locale: {
            format: 'DD-MM-YYYY'
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month')],
            'No Date': [moment(), moment()]
        }
    }, cb);

    // Default display
    cb(moment().startOf('month'), moment().endOf('month'));

    // Apply event
    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {

        if (picker.chosenLabel === 'No Date') {
            $(this).find('span').html('No Date');
            StartDate = null;
            EndDate = null;
        } else {
            $(this).find('span').html(
                picker.startDate.format('DD-MM-YYYY') +
                ' - ' +
                picker.endDate.format('DD-MM-YYYY')
            );

            StartDate = picker.startDate.format('YYYY-MM-DD');
            EndDate = picker.endDate.format('YYYY-MM-DD');
        }

        console.log("StartDate:", StartDate);
        console.log("EndDate:", EndDate);
    });

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    var fnData = Common.getDateFilter('dateDisplay2');

    var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(3) };
    Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);

    $(document).on('click', function (event) {
        var $target = $(event.target);
        if (!$target.closest('.dropdown-menu').length && !$target.closest('#dropdownMenuButton2').length) {
            $('.dropdown-menu').removeClass('show');
        }
    });

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();

        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(3) };
        Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(3) };
        Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);
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
            $('#increment-month-btn2').show(); // Show again if going back to previous months
        }
    }

    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
            var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) };
            Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) };
        Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });

    $(document).on('click', '.navbar-tab', function () {

        titleForHeaderProductTab = $(this).text().trim();
        $('.navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderProductTab) {
                $(this).addClass('active');
            }
        });

        if (titleForHeaderProductTab == "Raw Material") {
            $('#ManageStockDynamic').empty('');
            var html = ` 
                <div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ManageStockTable">
                    </table>
                </div>
                `;
            $('#ManageStockDynamic').append(html);

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) };
            Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);

        } else if (titleForHeaderProductTab == "Un-Processed") {
            $('#ManageStockDynamic').empty('');
            var html = ` 
                <div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ManageStockTable">
                    </table>
                </div>
                `;
            $('#ManageStockDynamic').append(html);

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(2) };
            Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);
        } else if (titleForHeaderProductTab == "Processed") {
            $('#ManageStockDynamic').empty('');
            var html = ` 
                <div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ManageStockTable">
                    </table>
                </div>
                `;
            $('#ManageStockDynamic').append(html);

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(3) };
            Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);
        }
    });

    $(document).on('click', '.btneye', function () {
        $('#ManageStockModal').show();
        manageStockId = $(this).data('id'); 
        var fnData = Common.getDateFilter('dateDisplay2');

        var ProductTypeId;

        ProductTypeId =
            titleForHeaderProductTab === "Raw Material" ? 1 :
                titleForHeaderProductTab === "Un-Processed" ? 2 :
                    titleForHeaderProductTab === "Processed" ? 3 :
                        0;

        var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: parseInt(manageStockId), ProductTypeId: parseInt(ProductTypeId) };
        Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                var columns = Common.bindColumn(data[0], ['MappingManageStockId', '']);
                
                $('#EditManageStockDynamic').empty('');
                var html = ` 
                <div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="EditManageStockTable">
                    </table>
                </div>
                `;
                $('#EditManageStockDynamic').append(html);


                bindTableEditManageStock('EditManageStockTable', data[0], columns, '330px');
            }
        }, null);
    });

    $(document).on('click', '#ManageStockClose', function () {
        $('#ManageStockModal').hide();
    });
});

function ManageStockSuccess(response) {
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

        //var activeTabText = $('.nav-link.navbar-tab.active').text().trim();
        $('#ManageStockDynamic').empty('');
        var html = ` 
                <div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ManageStockTable">
                    </table>
                </div>
                `;
        $('#ManageStockDynamic').append(html);

        var columns = Common.bindColumn(data[1], ['ManageStockId', '']);
        bindTableManageStock('ManageStockTable', data[1], columns, -1, 'ManageStockId', '330px', true, access);

        $('#loader-pms').hide();
    }
}
 
function bindTableManageStock(tableid, data, columns, actionTarget, editcolumn, scrollpx) {
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

    var renderColumn = [];

    renderColumn.push(
        {
            targets: actionTarget,
            render: function (data, type, row, meta) {
                return `<i class="btneye actionEllipsis" data-id="${row[editcolumn]}" title="View">
                            <img src="/assets/commonimages/attendanceeye.svg" />
                        </i>`;
            }
        }
    )

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

function bindTableEditManageStock(tableid, data, columns, scrollpx) {
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

    var renderColumn = [];

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
    $('#tableFilter1').on('keyup', function () {
        table.search($(this).val()).draw();
    });
    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}