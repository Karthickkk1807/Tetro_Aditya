var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

$(document).ready(function () {
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


        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();

        if (activeTabText == 'PF') {
            GetPayOutCome("PF");
        } else if (activeTabText == 'ESI') {
            GetPayOutCome("ESI");
        } else {
            GetPayslip();
        }

    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        if (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() === currentMonth) {
            $('#increment-month-btn2').hide();
        }

        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();

        if (activeTabText == 'PF') {
            GetPayOutCome("PF");
        } else if (activeTabText == 'ESI') {
            GetPayOutCome("ESI");
        } else {
            GetPayslip();
        }

    });

    function updateMonthDisplay(date) {
        let monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear();
        $('#dateDisplay2').text(month + " " + year);
    }
    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {

            var activeTabText = $('.nav-link.navbar-tab.active').text().trim();

            if (activeTabText == 'PF') {
                GetPayOutCome("PF");
            } else if (activeTabText == 'ESI') {
                GetPayOutCome("ESI");
            } else {
                GetPayslip();
            }

        }
    });
    Common.bindDropDown('PayGroupId', 'PayGroup');

    GetPayslip();

    $('#Payslip-TabBtn').click(function () {
        GetPayslip();
        $('#showButton').hide()
        $('.paygroupCol').show();
    });
    $('#PF-TabBtn').click(function () {
        GetPayOutCome("PF");
        $('#showButton').show();
        $('.paygroupCol').hide();
    });

    $('#ESI-TabBtn').click(function () {
        GetPayOutCome("ESI");
        $('#showButton').show()
        $('.paygroupCol').hide();
    });


    $(document).on("click", "#payslipDownload", function (e) {
        e.preventDefault();

        var fileUrl = $(this).attr("href").replace("~", "");
        var fullUrl = window.location.origin + fileUrl;

        var a = document.createElement("a");
        a.href = fullUrl;
        a.download = "Payslip_KA_101-April-2025.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    $(document).on("click", "#exportToExcelBtn", function (e) {
        var month;
        var Gyear;
        if (isAdmin == "True") {
            var dateString = $('#dateDisplay2').text();
            var monthString = dateString.split(' ')[0];
            var yearString = dateString.split(' ')[1];
            Gyear = parseInt(yearString);
            var monthMap = {
                "January": 1,
                "February": 2,
                "March": 3,
                "April": 4,
                "May": 5,
                "June": 6,
                "July": 7,
                "August": 8,
                "September": 9,
                "October": 10,
                "November": 11,
                "December": 12
            };

            month = monthMap[monthString];
        } else {
            const today = new Date();
            Gyear = today.getFullYear();
            month = today.getMonth() + 1;
        }
        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();

        $.ajax({
            url: '/HumanResource/ExcelPFDetails',
            type: 'GET',
            contentType: 'application/json',
            data: { ModuleName: activeTabText, Month: month, Year: Gyear },
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response, status, xhr) {
                var filename;
                var disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename || 'file.xlsx';
                link.click();
                $('#backdrop').fadeOut();
            },
            error: function (xhr, status, error) {
                $('#backdrop').fadeOut();
            }
        });
    });

    $(document).on("click", "#downloadPdfBtn", function (e) {
        var month;
        var Gyear;
        if (isAdmin == "True") {
            var dateString = $('#dateDisplay2').text();
            var monthString = dateString.split(' ')[0];
            var yearString = dateString.split(' ')[1];
            Gyear = parseInt(yearString);
            var monthMap = {
                "January": 1,
                "February": 2,
                "March": 3,
                "April": 4,
                "May": 5,
                "June": 6,
                "July": 7,
                "August": 8,
                "September": 9,
                "October": 10,
                "November": 11,
                "December": 12
            };

            month = monthMap[monthString];
        } else {
            const today = new Date();
            Gyear = today.getFullYear();
            month = today.getMonth() + 1;
        }
        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();

        $.ajax({
            url: '/HumanResource/TextPFDetails',
            type: 'GET',
            contentType: 'application/json',
            data: { ModuleName: activeTabText, Month: month, Year: Gyear },
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response, status, xhr) {
                $('#backdrop').fadeOut();
                const blob = new Blob([response], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${activeTabText}_details.txt`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            },
            error: function (xhr, status, error) {
                $('#backdrop').fadeOut();
                console.error('Error downloading file:', error);
            }
        });
    });

    $('#GeneratePaySlip').click(function () {
        var paygroupid = $('#PayGroupId').val();
        if (paygroupid == "") {
            Common.warningMsg("Choose a PayGroup");
            return false;
        }
        var month;
        var Gyear;
        if (isAdmin == "True") {
            var dateString = $('#dateDisplay2').text();
            var monthString = dateString.split(' ')[0];
            var yearString = dateString.split(' ')[1];
            Gyear = parseInt(yearString);
            var monthMap = {
                "January": 1,
                "February": 2,
                "March": 3,
                "April": 4,
                "May": 5,
                "June": 6,
                "July": 7,
                "August": 8,
                "September": 9,
                "October": 10,
                "November": 11,
                "December": 12
            };

            month = monthMap[monthString];
        } else {
            const today = new Date();
            Gyear = today.getFullYear();
            month = today.getMonth() + 1;
        }
        Common.ajaxCall("GET", "/HumanResource/GeneratePayslip", { Month: month, Year: Gyear, PayGroupId: paygroupid }, function (response) {
            if (response.status) {
                Common.successMsg(response.message);
                Common.ajaxCall("GET", "/HumanResource/GetPayslip", { PaySlipId: null, Month: month, Year: Gyear }, PayslipSuccess, null);

            }
        }, null);


    });

});


function GetPayslip() {
    var month;
    var Gyear;
    if (isAdmin == "True") {
        var dateString = $('#dateDisplay2').text();
        var monthString = dateString.split(' ')[0];
        var yearString = dateString.split(' ')[1];
        Gyear = parseInt(yearString);
        var monthMap = {
            "January": 1,
            "February": 2,
            "March": 3,
            "April": 4,
            "May": 5,
            "June": 6,
            "July": 7,
            "August": 8,
            "September": 9,
            "October": 10,
            "November": 11,
            "December": 12
        };

        month = monthMap[monthString];
    } else {
        const today = new Date();
        Gyear = today.getFullYear();
        month = today.getMonth() + 1;
    }
    Common.ajaxCall("GET", "/HumanResource/GetPayslip", { PaySlipId: null, Month: month, Year: Gyear }, PayslipSuccess, null);
}

function GetPayOutCome(moduleName) {
    var month;
    var Gyear;
    if (isAdmin == "True") {
        var dateString = $('#dateDisplay2').text();
        var monthString = dateString.split(' ')[0];
        var yearString = dateString.split(' ')[1];
        Gyear = parseInt(yearString);
        var monthMap = {
            "January": 1,
            "February": 2,
            "March": 3,
            "April": 4,
            "May": 5,
            "June": 6,
            "July": 7,
            "August": 8,
            "September": 9,
            "October": 10,
            "November": 11,
            "December": 12
        };

        month = monthMap[monthString];
    } else {
        const today = new Date();
        Gyear = today.getFullYear();
        month = today.getMonth() + 1;
    }
    if (moduleName == "ESI") {
        var sampleData = [
            {
                Month: "October 2025",
                EmployeeName: "Renugadevi ( SFL_008 )",
                TotalMonthlyWages: 5000,
                ReasonCodeforZeroWorkingDay: "Sick Leave",
                LastWorkingDay: "2025-09-25"
            },
            {
                Month: "October 2025",
                EmployeeName: "Maragathamani ( SFL_021 )",
                TotalMonthlyWages: 28000,
                ReasonCodeforZeroWorkingDay: "None",
                LastWorkingDay: "2025-09-30"
            },
            {
                Month: "October 2025",
                EmployeeName: "Santhosh ( SFL_016 )",
                TotalMonthlyWages: 0,
                ReasonCodeforZeroWorkingDay: "Planned Vacations",
                LastWorkingDay: "2025-09-05"
            },
            {
                Month: "October 2025",
                EmployeeName: "R Vijaya ( SFL_019 )",
                TotalMonthlyWages: 17000,
                ReasonCodeforZeroWorkingDay: "Casual Leave",
                LastWorkingDay: "2025-09-05"
            },
            {
                Month: "October 2025",
                EmployeeName: "Shalini ( SFL_015 )",
                TotalMonthlyWages: 0,
                ReasonCodeforZeroWorkingDay: "NA",
                LastWorkingDay: "NA"
            },
            {
                Month: "October 2025",
                EmployeeName: "Thulasimani ( SFL_002 )",
                TotalMonthlyWages: 1500,
                ReasonCodeforZeroWorkingDay: "NA",
                LastWorkingDay: "NA"
            },
            {
                Month: "October 2025",
                EmployeeName: "Murugathal ( SFL_004 )",
                TotalMonthlyWages: 1500,
                ReasonCodeforZeroWorkingDay: "NA",
                LastWorkingDay: "NA"
            },
            {
                Month: "October 2025",
                EmployeeName: "Mahalakshmi ( SFL_006 )",
                TotalMonthlyWages: 1500,
                ReasonCodeforZeroWorkingDay: "NA",
                LastWorkingDay: "NA"
            },
            {
                Month: "October 2025",
                EmployeeName: "Renugadevi ( SFL_008 )",
                TotalMonthlyWages: 1500,
                ReasonCodeforZeroWorkingDay: "NA",
                LastWorkingDay: "NA"
            }
        ];
        var columns = [
            { title: "Month", data: "Month" },
            { title: "EmployeeName", data: "EmployeeName" },
            { title: "TotalMonthlyWages", data: "TotalMonthlyWages" },
            { title: "ReasonCodeforZeroWorkingDay", data: "ReasonCodeforZeroWorkingDay" },
            { title: "LastWorkingDay", data: "LastWorkingDay" }
        ];
         
        $("#CounterTextBox1").text('TotalESIAmount');
        $("#CounterTextBox2").text('CurrentMonthESI');
        $("#CounterTextBox3").text('EmployerShare');
        $("#CounterTextBox4").text('AdvanceAmount');

        $('#CounterValBox1').text('₹ 12,500.00');
        $('#CounterValBox2').text('₹ 1,200.00'); 
        $('#CounterValBox3').text('₹ 750.00');   
        $('#CounterValBox4').text('₹ 500.00');   

        $('#PayRollTableMain').empty('');
        var html = `<div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="PayslipTable"></table>
                </div>`;
        $('#PayRollTableMain').append(html);

        bindTablePayOutComeDetails('PayslipTable', sampleData, columns, null, "375px");
    } else if (moduleName == "PF") {
        var pfColumns = [
            { title: "EmployeeName", data: "EmployeeName" },
            { title: "GrossWages", data: "GrossWages" },
            { title: "EPFWages", data: "EPFWages" },
            { title: "EPSWages", data: "EPSWages" },
            { title: "EEShareRemitted", data: "EEShareRemitted" },
            { title: "EPSContributionRemitted", data: "EPSContributionRemitted" },
            { title: "ERShareRemitte", data: "ERShareRemitte" },
            { title: "NCPDays", data: "NCPDays" },
            { title: "Advance", data: "Advance" }
        ];

        var pfData = [
            {
                EmployeeName: "Kaliyammal ( SFL_022 )",
                GrossWages: 25000,
                EPFWages: 15000,
                EPSWages: 15000,
                EEShareRemitted: 1800,
                EPSContributionRemitted: 1250,
                ERShareRemitte: 1550,
                NCPDays: 0,
                Advance: 0
            },
            {
                EmployeeName: "Stella merry ( SFL_023 )",
                GrossWages: 22000,
                EPFWages: 15000,
                EPSWages: 15000,
                EEShareRemitted: 1800,
                EPSContributionRemitted: 1250,
                ERShareRemitte: 1550,
                NCPDays: 2,
                Advance: 2000
            },
            {
                EmployeeName: "R Vijaya ( SFL_019 )",
                GrossWages: 20000,
                EPFWages: 15000,
                EPSWages: 15000,
                EEShareRemitted: 1800,
                EPSContributionRemitted: 1250,
                ERShareRemitte: 1550,
                NCPDays: 0,
                Advance: 0
            },
            {
                EmployeeName: "Latha ( SFL_018 )",
                GrossWages: 18000,
                EPFWages: 15000,
                EPSWages: 15000,
                EEShareRemitted: 1800,
                EPSContributionRemitted: 1250,
                ERShareRemitte: 1550,
                NCPDays: 1,
                Advance: 1500
            },
            {
                EmployeeName: "Santhosh ( SFL_016 )",
                GrossWages: 19500,
                EPFWages: 15000,
                EPSWages: 15000,
                EEShareRemitted: 1800,
                EPSContributionRemitted: 1250,
                ERShareRemitte: 1550,
                NCPDays: 0,
                Advance: 0
            },
            {
                EmployeeName: "Shanmugam ( SFL_010 )",
                GrossWages: 22000,
                EPFWages: 15000,
                EPSWages: 15000,
                EEShareRemitted: 1800,
                EPSContributionRemitted: 1250,
                ERShareRemitte: 1550,
                NCPDays: 0,
                Advance: 1000
            },
            {
                EmployeeName: "Senthil kumar ( SFL_009 )",
                GrossWages: 28000,
                EPFWages: 15000,
                EPSWages: 15000,
                EEShareRemitted: 1800,
                EPSContributionRemitted: 1250,
                ERShareRemitte: 1550,
                NCPDays: 0,
                Advance: 1000
            },
            {
                EmployeeName: "Kalyani ( SFL_007 )",
                GrossWages: 26000,
                EPFWages: 15000,
                EPSWages: 15000,
                EEShareRemitted: 1239,
                EPSContributionRemitted: 1250,
                ERShareRemitte: 1290,
                NCPDays: 0,
                Advance: 0
            },
            {
                EmployeeName: "Renugadevi ( SFL_008 )",
                GrossWages: 29000,
                EPFWages: 15000,
                EPSWages: 15000,
                EEShareRemitted: 1800,
                EPSContributionRemitted: 1250,
                ERShareRemitte: 12660,
                NCPDays: 0,
                Advance: 16700
            }
        ];

        $('#PayRollTableMain').empty('');
        var html = `<div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="PayslipTable"></table>
                </div>`;
        $('#PayRollTableMain').append(html);


        $("#CounterTextBox1").text('TotalAmount');
        $("#CounterTextBox2").text('EmployeeShare');
        $("#CounterTextBox3").text('EmployerShare');
        $("#CounterTextBox4").text('AdvanceAmount');

        $('#CounterValBox1').text('₹ 15,177.20');
        $('#CounterValBox2').text('₹ 7,588.60'); 
        $('#CounterValBox3').text('₹ 7,588.60'); 
        $('#CounterValBox4').text('₹ 5,000.00'); 


        bindTablePayOutComeDetails('PayslipTable', pfData, pfColumns, null, "375px");
    }
    //Common.ajaxCall("GET", "/HumanResource/GetPayOutComeDetails", { ModuleName: moduleName, Month: month, Year: Gyear }, function (response) {
    //    if (response.status) {
    //        var data = JSON.parse(response.data);
    //        var columns = Common.bindColumn(data[0], ['PaySlipId', 'EmployeeId', 'Status_Colour']);
    //        bindTablePayOutComeDetails('PayslipTable', data[0], columns, 'PaySlipId', '270px');
    //    }
    //}, null);
}

function PayslipSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var PayslipCounterBox = Object.keys(data[0][0]);

        //$("#CounterTextBox1").text(PayslipCounterBox[0]);
        //$("#CounterTextBox2").text(PayslipCounterBox[1]);
        //$("#CounterTextBox3").text(PayslipCounterBox[2]);
        //$("#CounterTextBox4").text(PayslipCounterBox[3]);

        //$('#CounterValBox1').text(data[0][0][PayslipCounterBox[0]]);
        //$('#CounterValBox2').text(data[0][0][PayslipCounterBox[1]]);
        //$('#CounterValBox3').text(data[0][0][PayslipCounterBox[2]]);
        //$('#CounterValBox4').text(data[0][0][PayslipCounterBox[3]]);

        $("#CounterTextBox1").text('Total Earning');
        $("#CounterTextBox2").text('Total Deduction');
        $("#CounterTextBox3").text('Net Pay');
        $("#CounterTextBox4").text('No of Month Processed');

        $('#CounterValBox1').text('₹ 126476.62');
        $('#CounterValBox2').text('₹ 3225.81');
        $('#CounterValBox3').text('₹ 123250.81');
        $('#CounterValBox4').text('1');

        $('#PayRollTableMain').empty('');
        var html = `<div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="PayslipTable"></table>
                </div>`;
        $('#PayRollTableMain').append(html);

        var columns = Common.bindColumn(data[1], ['PaySlipId', 'EmployeeId', 'Status_Colour']);
        bindTablePayslip('PayslipTable', data[1], columns, 'PaySlipId', '375px');
    }
}

function bindTablePayslip(tableid, data, columns, editcolumn, scrollpx) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "TetroONEnocount");
    var IsTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var Employee = columns.findIndex(column => column.data === "Name");

    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

    var renderColumn = [{
        "targets": StatusColumnIndex,
        render: function (data, type, row, meta) {
            if (type === 'display' && row.Status_Colour != null && row.Status_Colour.length > 0) {
                var dataText = row.Status;
                var statusColor = row.Status_Colour.toLowerCase();

                var htmlContent = '';
                htmlContent = htmlContent + '<div class="action-label">';
                htmlContent = htmlContent + '<a class="btn btn-white btn-sm btn-rounded" style="cursor: context-menu !important;color:' + statusColor + '!important;">';
                htmlContent = htmlContent + '<i class="fa fa-dot-circle-o""></i> ' + dataText + '</a>';
                htmlContent = htmlContent + '</div >';

                return htmlContent;
            }
            return data;
        }
    }
    ];
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
        "data": !IsTetroONEnocount ? data : [],
        "columns": columns,
        "destroy": true,
        "aaSorting": [],
        "columnDefs": !IsTetroONEnocount
            ? renderColumn : [],
        "scrollY": scrollpx,
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "sScrollX": "100%",
        "pageLength": 8,
        "lengthMenu": [5, 10, 25, 50],
        "oSearch": { "bSmart": false, "bRegex": true },
        "scrollCollapse": true,
        "paging": hasValidData,
        "info": hasValidData
    });
    $('#tableFilter').val(null).trigger('change');
    $('#filterFocus').removeClass('focused');
    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    var tableId = $('#' + tableid).DataTable();
    Common.autoAdjustColumns(tableId);
}

function bindTablePayOutComeDetails(tableid, data, columns, editcolumn, scrollpx) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var renderColumn = [
    ];
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
        "aaSorting": [],
        "columnDefs": !isTetroONEnocount
            ? renderColumn : [],
        "scrollY": scrollpx,
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" alt="No records found" style="margin-right: 10px;">No records found</div>'
        }),
        "sScrollX": "100%",
        "pageLength": 8,
        "lengthMenu": [5, 10, 25, 50],
        "oSearch": { "bSmart": false, "bRegex": true },
        "scrollCollapse": true,
        "paging": hasValidData,
        "info": hasValidData
    });
    $('#tableFilter').val(null).trigger('change');
    $('#filterFocus').removeClass('focused');
    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    var tableId = $('#' + tableid).DataTable();
    Common.autoAdjustColumns(tableId);
}


