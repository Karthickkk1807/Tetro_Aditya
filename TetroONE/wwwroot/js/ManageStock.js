var titleForHeaderProductTab = "";
var PlantMappingId = 0;
var manageStockId = 0;

$(document).ready(function () {

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    titleForHeaderProductTab = "Raw Material";

    var start = moment().startOf('month');
    var end = moment(); // today

    Common.bindDropDown('distributorSelect', 'Client');

    $('#reportrange span').html(
        start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY')
    );

    $('.daterangepicker').on('show.daterangepicker', function () {
        $('.ranges li[data-range-key="No Date"]').hide();
    });

    function cb(start, end, label) {
        if (label === 'No Date') {
            $('#reportrange span').html('No Date');
        } else {
            $('#reportrange span').html(
                start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY')
            );
            $('#reportrange').css('color', '#000'); // remove disabled look
        }
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
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
            'This Month': [moment().startOf('month'), moment()],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'No Date': [moment(), moment()]
        }
    }, cb);

    // default load
    cb(start, end);


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
    var EditDataId = { ProductId: 0, ProductTypeId: parseInt(1), PlantId: parseInt(PlantMappingId), Dia: null, GSM: null, Width: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
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

        var EditDataId = { ProductId: 0, ProductTypeId: parseInt(1), PlantId: parseInt(PlantMappingId), Dia: null, GSM: null, Width: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { ProductId: 0, ProductTypeId: parseInt(1), PlantId: parseInt(PlantMappingId), Dia: null, GSM: null, Width: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
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
            var EditDataId = { ProductId: 0, ProductTypeId: parseInt(1), PlantId: parseInt(PlantMappingId), Dia: null, GSM: null, Width: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
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

        var EditDataId = { ProductId: 0, ProductTypeId: parseInt(1), PlantId: parseInt(PlantMappingId), Dia: null, GSM: null, Width: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
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
            var EditDataId = { ProductId: 0, ProductTypeId: parseInt(1), PlantId: parseInt(PlantMappingId), Dia: null, GSM: null, Width: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
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
            var EditDataId = { ProductId: 0, ProductTypeId: parseInt(2), PlantId: parseInt(PlantMappingId), Dia: null, GSM: null, Width: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
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
            var EditDataId = { ProductId: 0, ProductTypeId: parseInt(3), PlantId: parseInt(PlantMappingId), Dia: null, GSM: null, Width: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
            Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, ManageStockSuccess, null);
        }
    });

    $(document).on('click', '.btneye', function () {
        $('#ManageStockModal').show();
        manageStockId = $(this).data('id');
        var fnData = Common.getDateFilter('dateDisplay2');
        var ProductTypeId;

        var start = moment().startOf('month');
        var end = moment();

        var drp = $('#reportrange').data('daterangepicker');
        if (drp) {
            drp.setStartDate(start);
            drp.setEndDate(end);
        }
        $('#reportrange span').html(
            start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY')
        );
        $('#reportrange').css('color', '#000');
        $('#reportrange').trigger('apply.daterangepicker', [drp]);

        ProductTypeId =
            titleForHeaderProductTab === "Raw Material" ? 1 :
                titleForHeaderProductTab === "Un-Processed" ? 2 :
                    titleForHeaderProductTab === "Processed" ? 3 :
                        0;
        var dia = null, gsm = null, width = null;

        if (ProductTypeId !== 1) {
            var $row = $(this).closest('tr');

            dia = $row.find('td').eq(1).text().trim();
            gsm = $row.find('td').eq(2).text().trim();
            width = $row.find('td').eq(6).text().trim();
            if (width == 'Tubler')
                width = 2;
            else width = 1;
        }

        var EditDataId = { ProductId: parseInt(manageStockId), ProductTypeId: parseInt(ProductTypeId), PlantId: parseInt(PlantMappingId), Dia: parseFloat(dia), GSM: parseFloat(gsm), Width: parseInt(width), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);

                $('#ProductName').text(data[1][0].ProductName);
                $('#OpeningStock').text(data[1][0].OpeningStock);
                $('#ClosingStock').text(data[1][0].ClosingStock);
                $('#TotalInward').text(data[1][0].InwardQty);
                $('#TotalOutward').text(data[1][0].OutwardQty);

                $('#EditManageStockDynamic').empty('');
                var html = ` 
                <div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="EditManageStockTable">
                    </table>
                </div>
                `;
                $('#EditManageStockDynamic').append(html);

                var columns = Common.bindColumn(data[0], ['MappingManageStockId', '']);
                bindTableEditManageStock('EditManageStockTable', data[0], columns, '330px');
            }
        }, null);
    });

    $(document).on('click', '#ManageStockClose', function () {
        $('#ManageStockModal').hide();
    });
});

$('#reportrange').on('apply.daterangepicker', function (ev, picker) {

    var fromDate = picker.startDate.toISOString();
    var toDate = picker.endDate.toISOString();
    var ProductTypeId;

    ProductTypeId =
        titleForHeaderProductTab === "Raw Material" ? 1 :
            titleForHeaderProductTab === "Un-Processed" ? 2 :
                titleForHeaderProductTab === "Processed" ? 3 :
                    0;
    var dia = null, gsm = null, width = null;

    var EditDataId = {
        ProductId: parseInt(manageStockId),
        ProductTypeId: parseInt(ProductTypeId),
        PlantId: parseInt(PlantMappingId),
        Dia: parseFloat(dia),
        GSM: parseFloat(gsm),
        Width: parseInt(width),
        FromDate: fromDate,
        ToDate: toDate
    };

    Common.ajaxCall("GET", "/Inventory/GetManageStock", EditDataId, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);

            $('#ProductName').text(data[1][0].ProductName);
            $('#OpeningStock').text(data[1][0].OpeningStock);
            $('#ClosingStock').text(data[1][0].ClosingStock);
            $('#TotalInward').text(data[1][0].InwardQty);
            $('#TotalOutward').text(data[1][0].OutwardQty);

            $('#EditManageStockDynamic').empty();

            var html = `
                <div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive"
                           id="EditManageStockTable">
                    </table>
                </div>
            `;

            $('#EditManageStockDynamic').append(html);

            var columns = Common.bindColumn(data[0], ['MappingManageStockId', '']);
            bindTableEditManageStock('EditManageStockTable', data[0], columns, '330px');
        }
         
    }, null);

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

        var columns = Common.bindColumn(data[1], ['ManageStockId', 'ProductId', 'StockInHand_Colour']);
        bindTableManageStock('ManageStockTable', data[1], columns, -1, 'ProductId', '330px', true, access);

        $('#loader-pms').hide();
    }
}

function bindTableManageStock(tableid, data, columns, actionTarget, editcolumn, scrollpx) {

    /* ---------------- DESTROY EXISTING TABLE ---------------- */
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }

    $('#' + tableid).empty();

    /* ---------------- REMOVE UNWANTED COLUMN ---------------- */
    columns = columns.filter(x => x.name !== "TetroONEnocount");

    /* ---------------- FILTER ALL-NULL ROWS ---------------- */
    if (Array.isArray(data)) {
        data = data.filter(row => {
            // keep row if at least one value is not null/empty
            return Object.values(row).some(val =>
                val !== null && val !== undefined && val !== ''
            );
        });
    }

    var hasValidData = data && data.length > 0;

    /* ---------------- ADD ACTION COLUMN ---------------- */
    columns.push({
        data: null,
        title: 'Action',
        orderable: false,
        searchable: false
    });

    /* ---------------- RENDER EYE ICON ---------------- */
    var renderColumn = [{
        targets: -1,
        render: function (data, type, row) {
            return `
                <i class="btneye actionEllipsis" 
                   data-id="${row[editcolumn]}" 
                   title="View" 
                   style="cursor:pointer">
                    <img src="/assets/commonimages/attendanceeye.svg" />
                </i>`;
        }
    }];

    /* ---------------- MOBILE PAGINATION ---------------- */
    var lang = {};
    if ($(window).width() <= 575) {
        lang = {
            paginate: {
                next: ">",
                previous: "<"
            }
        };
    }

    /* ---------------- INIT DATATABLE ---------------- */
    var table = $('#' + tableid).DataTable({
        dom: "Bfrtip",
        destroy: true,
        responsive: true,
        data: data,
        columns: columns,
        columnDefs: renderColumn,
        scrollY: scrollpx,
        scrollX: true,
        scrollCollapse: true,
        ordering: false,
        paging: hasValidData,
        info: hasValidData,
        pageLength: 7,
        lengthMenu: [7, 14, 50],
        language: $.extend({}, lang, {
            emptyTable:
                '<div><img src="/assets/commonimages/nodata.svg" style="margin-right:10px;">No records found</div>'
        })
    });

    /* ---------------- SEARCH ---------------- */
    $('#tableFilter').off('keyup').on('keyup', function () {
        table.search(this.value).draw();
    });

    /* ---------------- AUTO ADJUST ---------------- */
    setTimeout(function () {
        Common.autoAdjustColumns(table);
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

document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.querySelector("#ManageStockModal .searchbar__button");
    const searchInput = document.querySelector("#ManageStockModal .searchbar__input");
    const searchGroup = document.querySelector("#ManageStockModal .searchInput-group");

    searchBtn.addEventListener("click", () => {
        if (window.innerWidth <= 576) {
            if (searchInput.style.display === "block") {
                searchInput.style.display = "none";
                searchInput.style.zIndex = "2";
                searchBtn.style.borderRadius = "5px";
                //searchGroup.classList.remove("active");
            }
            else {
                searchInput.style.display = "block";
                //searchGroup.classList.add("active");
                searchBtn.style.borderRadius = "0 5px 5px 0";
            }
        }
    });
});