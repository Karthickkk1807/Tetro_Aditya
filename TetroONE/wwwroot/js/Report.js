var NewLogistics = true;

$(document).ready(function () {
    $('#ExcelReportTicketing').hide();
    $('#ReportValueNewHide').hide();
    $('.LableReportCategory').text('Report Category');
    $('.LableReportValue').text('Report Value');
    $('#ReportSearchDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end');
    Common.ajaxCall("GET", "/HumanResource/GetExpenseDD", { ModuleName: "ReportModules" }, function (response) {
        if (response.status) {
            bindReportModuleNameDropDownSuccess(response.data, "mainModuleDropdown");
        }
    }, null);

    getDate();

    $(document).on('click', '#reportSubmit', function () {
        $("#loader-pms").fadeIn();
        if ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
            getReportNewSuccess();
        } else {
            getReportSuccess();
        }
    });

    $('#ReportCategoryId').on('change input', function () {
        if ($thisValFromNew != '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
            $('#ReportValueId').empty();
            var reportCategoryName = $('#ReportCategoryId option:selected').text();
            bindDropReportValueDropDown('ReportValueId', reportCategoryName);
        }
    });

    $(document).on('click', '.tab-menu li', function () {
        $("#loader-pms").fadeIn();

        $('.tab-menu li a').removeClass('active');
        $(this).find('a').addClass('active');
        $('#reportGrid').empty();
        $('#ReportCategoryId').empty();
        $('#ReportValueId').empty();
        $('#ExcelReportTicketing').hide();

        //if ($('.tab-menu li a.active').text() == 'Testing Excel') {
        //    $('#ExcelReportTicketing').show();
        //    $('#loader-pms').hide();
        //    return false;
        //}

        getDate();

        var newTable = '<table class="table basic-datatables table-rounded tableResponsive" id="reportGrid">  </table>';
        $("#reportGridContainer").html(newTable);

        var tabText = $('.tab-menu li a.active').text();
        var activeTabText;

        //if (tabText.includes(" ")) {
        //    activeTabText = tabText.replace(/\s/g, "");
        //} else {
        //    activeTabText = tabText;
        //}

        activeTabText = tabText;

        PassingText = ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') ? tabText : activeTabText;

        NewLogistics = true;
        bindDropReportCategoryDropDown('ReportCategoryId', PassingText);

        if (tabText == "Vendor" || tabText == "Client" || tabText == "Franchise" || tabText == "Product" || tabText == "Employee") {
            $('.frmdatediv').hide();
            $('.todatediv').hide();
        }
        else {
            $('.frmdatediv').show();
            $('.todatediv').show();
        }

        if ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
            if (tabText == "Taget VS Actual") {
                $('.frmdatediv').hide();
                $('.todatediv').hide();
                $('#ReportSearchDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end');
            }
            else if (tabText == "Production" || tabText == "Monthly Rpt" || tabText == "Refund %" || tabText == "RM (Franchise)") {
                $('.frmdatediv').show();
                $('.todatediv').show();
                $('.ReportCategorydiv').show();
                $('.ReportValuediv').hide();
                $('#ReportValueNewHide').hide();
                $('#ReportSearchDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end');
            }
            else if (tabText == "Profit & Loss") {
                $('.ReportCategorydiv').hide();
                $('.ReportValuediv').hide();
                $('#ReportValueNewHide').hide();
                $('#ReportSearchDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end');
            } else {
                $('.ReportCategorydiv').show();
                $('.ReportValuediv').show();
                $('#ReportValueNewHide').show();
                $('.frmdatediv').show();
                $('.todatediv').show();
                $('#ReportSearchDiv').removeClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end');
            }
        }
    });

    $(document).on('click', '#downloadPdfBtn', function () {
        $('#loader-pms').show();
        var tabText = $('.tab-menu li a.active').text();
        var activeTabText;

        //if (tabText.includes(" ")) {
        //    activeTabText = tabText.replace(/\s/g, "");
        //} else {
        //    activeTabText = tabText;
        //}

        activeTabText = tabText;

        if ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
            var objvalue = {
                ReportName: tabText,
                FromDate: $('#fromDateRpt').val(),
                ToDate: $('#toDateRpt').val(),
                Franchise: parseInt($('#ReportCategoryId').val()),
                ReportCategory: parseInt($('#ReportValueId').val()),
                ReportValue: parseInt($('#ReportValueNewId').val()),
                IsReport: false
            };
        }
        else {
            var objvalue = {
                ReportName: activeTabText,
                FromDate: $('#fromDateRpt').val(),
                ToDate: $('#toDateRpt').val(),
                ReportCategory: $('#ReportCategoryId option:selected').text(),
                ReportValue: parseInt($('#ReportValueId').val()),
                IsReport: false
            };
        }

        pdfAjaxCall(objvalue);
        //setTimeout(function () {
        //    $("#loader-pms").delay(100).fadeOut();
        //}, 1000);
    });

    $(document).on('click', '#exportToExcelBtn', function () {
        $('#loader-pms').show();
        var tabText = $('.tab-menu li a.active').text();
        var activeTabText;

        //if (tabText.includes(" ")) {
        //    activeTabText = tabText.replace(/\s/g, "");
        //} else {
        //    activeTabText = tabText;
        //}

        activeTabText = tabText;

        if ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
            var objvalue = {
                ReportName: tabText,
                FromDate: $('#fromDateRpt').val(),
                ToDate: $('#toDateRpt').val(),
                Franchise: parseInt($('#ReportCategoryId').val()),
                ReportCategory: parseInt($('#ReportValueId').val()),
                ReportValue: parseInt($('#ReportValueNewId').val()),
                IsReport: false
            };
        }
        else {
            var objvalue = {
                ReportName: activeTabText,
                FromDate: $('#fromDateRpt').val(),
                ToDate: $('#toDateRpt').val(),
                ReportCategory: $('#ReportCategoryId option:selected').text(),
                ReportValue: parseInt($('#ReportValueId').val()),
                IsReport: false
            };
        }

        excelajaxCall(objvalue);
        //setTimeout(function () {
        //    $("#loader-pms").delay(100).fadeOut();
        //}, 1000);
    });
});

var $thisValFromNew = '';
var PassingText = '';

$(document).on('change', '#mainModuleDropdown', function () {
    $thisValFromNew = $(this).val();
    getDate();
    if ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
        $("#loader-pms").fadeIn();
        $('#ReportValueNewHide').show();
        NewLogistics = true;
        GetReportName();
        $('.LableReportCategory').text('Franchise');
        $('.LableReportValue').text('Report Category');
        $('#ReportSearchDiv').removeClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end');
    } else {
        $("#loader-pms").fadeIn();
        $('#ReportValueNewHide').hide();
        GetReportName();
        $('.LableReportCategory').text('Report Category');
        $('.LableReportValue').text('Report Value');
        $('#ReportSearchDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end');
    }
});

function getDate() {
    var currentDate = new Date();
    var previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
    $('#toDateRpt').val(currentDate.toISOString().slice(0, 10));
    var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
    $('#fromDateRpt').val(firstDayOfMonth.toISOString().slice(0, 10));
}

function getReportSuccess() {
    var tabText = $('.tab-menu li a.active').text();
    var activeTabText;

    //if (tabText.includes(" ")) {
    //    activeTabText = tabText.replace(/\s/g, "");
    //} else {
    //    activeTabText = tabText;
    //}
    activeTabText = tabText;

    var objvalue = {
        ReportName: activeTabText,
        FromDate: $('#fromDateRpt').val(),
        ToDate: $('#toDateRpt').val(),
        ReportCategory: $('#ReportCategoryId option:selected').text(),
        ReportValue: parseInt($('#ReportValueId').val()),
        IsReport: true

    };
    Common.ajaxCall("POST", "/Report/GetReport", JSON.stringify(objvalue), GetReport, null);
}

function getReportNewSuccess() {
    var tabText = $('.tab-menu li a.active').text();
    var activeTabText;

    //if (tabText.includes(" ")) {
    //    activeTabText = tabText.replace(/\s/g, "");
    //} else {
    //    activeTabText = tabText;
    //}

    activeTabText = tabText;

    var objvalue = {
        ReportName: tabText,
        FromDate: $('#fromDateRpt').val(),
        ToDate: $('#toDateRpt').val(),
        Franchise: parseInt($('#ReportCategoryId').val()),
        ReportCategory: parseInt($('#ReportValueId').val()),
        ReportValue: parseInt($('#ReportValueNewId').val())
    };

    Common.ajaxCall("POST", "/Report/GetReportNew", JSON.stringify(objvalue), GetReport, null);
}

function excelajaxCall(objvalue) {

    var URL = ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') ? '/Report/CommonExcelDownloadNew' : '/Report/CommonExcelDownload';

    $.ajax({
        url: URL,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(objvalue),
        xhrFields: {
            responseType: 'blob'
        },
        success: function (response, status, xhr) {
            var filename;
            var disposition = xhr.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
                }
            }
            var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename || 'file.xlsx';
            link.click();
            $('#loader-pms').hide();
        },
        error: function (xhr, status, error) {
            $('#loader-pms').hide();
            alert('Failed to generate Report Excel');
        }
    });
}

function pdfAjaxCall(objvalue) {

    var URL = ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') ? '/Report/GenerateReportPDFNew' : '/Report/GenerateReportPDF';

    $.ajax({
        url: URL,
        type: 'POST',
        data: JSON.stringify(objvalue),
        contentType: 'application/json',
        dataType: 'json',
        success: function (response) {

            if (response.success) {
                var downloadLink = document.createElement('a');
                var currentDate = new Date();
                var formattedDate = currentDate.toLocaleString().replace(/[\/,\s:]/g, '_');
                downloadLink.download = 'Report_' + objvalue.ReportName + '_' + formattedDate + '.pdf';
                downloadLink.href = 'data:application/pdf;base64,' + response.fileContent;
                downloadLink.click();
                $('#loader-pms').hide();
            } else {
                $('#loader-pms').hide();
                alert('Failed to generate Report PDF');
            }
        },
        error: function () {
            $('#loader-pms').hide();
            alert('Error occurred while generating the report');
        }
    });
}

//var reportData = []; // global variable
//var currentPage = 0;
//var pageSize = 20;

//function GetReport(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        reportData = data[2]; // full data saved globally
//        var columns = Common.bindColumn(reportData, ['Status_Color', 'Colour', 'StockInHand_Color']);

//        $('#reportGridContainer').empty("");
//        $('#reportGridContainer').html(`
//            <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="reportGrid"> </table>
//            <button id="loadMoreBtn" class="btn btn-primary mt-2">Load More</button>
//        `);

//        currentPage = 0;
//        loadNextPage(columns);

//        $("#loader-pms").delay(100).fadeOut();

//        let allItemsNull = reportData.every(item =>
//            Object.values(item).every(value => value === null || value === '')
//        );

//        if (allItemsNull) {
//            $('#showButton').hide();
//        } else {
//            $('#showButton').show();
//        }

//        // Attach click event to "Load More" button
//        $('#loadMoreBtn').on('click', function () {
//            loadNextPage(columns);
//        });
//    }
//}

//function loadNextPage(columns) {
//    var start = currentPage * pageSize;
//    var end = start + pageSize;
//    var pageData = reportData.slice(start, end);

//    if (pageData.length > 0) {
//        if (currentPage === 0) {
//            bindReportTable('reportGrid', pageData, columns, '450px');
//        } else {
//            appendRowsToTable('reportGrid', pageData, columns);
//        }

//        currentPage++;
//    }

//    if (end >= reportData.length) {
//        $('#loadMoreBtn').hide(); // hide when all data is loaded
//    }
//}

function GetReport(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[2], ['Status_Color', 'Colour', 'StockInHand_Color']);
        $('#reportGridContainer').empty("");
        $('#reportGridContainer').html(`<table class="table table-rounded dataTable data-table table-striped tableResponsive" id="reportGrid"> </table>`);
        bindReportTable('reportGrid', data[2], columns, '500px');
        $("#loader-pms").delay(100).fadeOut();
        let allItemsNull = true;

        data[2].forEach(item => {
            let hasNonNullValue = Object.values(item).some(value => value !== null && value !== '');
            if (hasNonNullValue) {
                allItemsNull = false;
                return false;
            }
        });

        if (allItemsNull) {
            $('#showButton').hide();
        } else {
            $('#showButton').show();
        }

    }
}

function bindReportModuleNameDropDownSuccess(response, controlid) {
    if (response != null) {
        $('#' + controlid).empty();
        var data = JSON.parse(response);
        var dataValue = data[0];
        if (dataValue != null && dataValue.length > 0) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];

            $.each(dataValue, function (index, item) {
                $('#' + controlid).append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty],
                }));
            });
        }
        GetReportName();
    }
}

function GetReportName() {
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Report/GetReportName',
        data: {
            ReportId: Common.parseInputValue('mainModuleDropdown')
        },
        success: function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                $('#subModuleList').empty("");

                data[0].forEach(function (item, index) {
                    var isActive = index === 0 ? 'active' : '';
                    var reportMainName = `<li>
						<a  class="${isActive}">${item.ReportModuleName}</a>
					</li>`;
                    $('#subModuleList').append(reportMainName);
                });
                if (data[0].length > 7) {
                    $('#subModuleList').removeClass('justify-content-center');
                    $('#rightarrow').show();
                    $('#rightarrow').addClass('d-flex');
                }
                else {
                    $('#subModuleList').addClass('justify-content-center');
                    $('#rightarrow').hide();
                    $('#rightarrow').removeClass('d-flex');
                }
                var tabText = $('.tab-menu li a.active').text();
                if (tabText == "Vendor" || tabText == "Client" || tabText == "Franchise" || tabText == "Product" || tabText == "Employee" || tabText == "Taget VS Actual" || tabText == "Production" || tabText == "Monthly Rpt" || tabText == "Refund %" || tabText == "RM (Franchise)") {
                    $('.frmdatediv').hide();
                    $('.todatediv').hide();
                } else {
                    $('.frmdatediv').show();
                    $('.todatediv').show();
                }

                if ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
                    if (tabText == "Taget VS Actual") {
                        $('.frmdatediv').hide();
                        $('.todatediv').hide();
                        $('#ReportSearchDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end');
                    } else if (tabText == "Production" || tabText == "Monthly Rpt" || tabText == "Refund %" || tabText == "RM (Franchise)") {
                        $('.frmdatediv').show();
                        $('.todatediv').show();
                        $('.ReportCategorydiv').show();
                        $('.ReportValuediv').hide();
                        $('#ReportValueNewHide').hide();
                        $('#ReportSearchDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end');
                    } else {
                        $('.frmdatediv').show();
                        $('.todatediv').show();
                        $('#ReportSearchDiv').removeClass('col-md-12 col-lg-3 col-sm-6 col-6 d-flex align-items-center justify-content-end').addClass('col-md-12 col-lg-12 col-sm-12 col-12 d-flex align-items-center justify-content-end');
                    }
                }

                var $ul = $('#subModuleList');
                var $firstLi = $ul.find('li:first');

                $ul.animate({
                    scrollLeft: $firstLi.position().left
                }, 500); // 500ms animation

                var activeTabText;

                //if (tabText.includes(" ")) {
                //    activeTabText = tabText.replace(/\s/g, "");
                //} else {
                //    activeTabText = tabText;
                //}

                activeTabText = tabText;

                PassingText = ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') ? tabText : activeTabText;

                bindDropReportCategoryDropDown('ReportCategoryId', PassingText);
            }
        },
        error: function (response) {

        },
    });
}

// For ReportCategory DropDown
function bindDropReportCategoryDropDown(id, reportName) {
    var request = {
        ReportName: reportName
    };

    var URL = ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') ? '/Report/ReportCategoryDropdownNew' : '/Report/ReportCategoryDropdown';

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: URL,
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status == true) {
                bindReportCategoryDropDownSuccess(response.data, id);
            }
        },
        error: function (response) {

        },
    });
}

function bindReportCategoryDropDownSuccess(response, controlid) {
    if (response != null) {
        $('#' + controlid).empty();
        var data = JSON.parse(response);
        var dataValue = data[0];
        if (dataValue != null && dataValue.length > 0) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];
            $.each(dataValue, function (index, item) {
                $('#' + controlid).append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty],
                }));
            });
        }

        var reportCategoryName = $('#ReportCategoryId option:selected').text();
        bindDropReportValueDropDown('ReportValueId', reportCategoryName);
    }
}

// For ReportValue DropDown
function bindDropReportValueDropDown(id, reportCategoryName) {

    var URL = ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') ? '/Report/ReportValueDropdownNew' : '/Report/ReportValueDropdown';

    if ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
        var request = {
            ReportName: PassingText
        };
    }
    else {
        var request = {
            ModuleName: reportCategoryName
        };
    }

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: URL,
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status == true) {
                bindReportValueDropDownSuccess(response.data, id);
            }
        },
        error: function (response) {

        },
    });
}


$(document).on('change', '#ReportValueId', function () {
    if ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
        var reportCategoryName = $('#ReportValueId option:selected').text();
        bindDropReportValueNewDropDown('ReportValueNewId', reportCategoryName);
    }
});

function bindReportValueDropDownSuccess(response, controlid) {
    if (response != null) {
        $('#' + controlid).empty();
        var data = JSON.parse(response);
        var dataValue = data[0];
        if (dataValue != null && dataValue.length > 0) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];

            $.each(dataValue, function (index, item) {
                $('#' + controlid).append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty],
                }));
            });
        }

        if ($thisValFromNew == '9' || $thisValFromNew == '10' || $thisValFromNew == '11' || $thisValFromNew == '12') {
            var reportCategoryName = $('#ReportValueId option:selected').text();
            bindDropReportValueNewDropDown('ReportValueNewId', reportCategoryName);
        } else {
            getReportSuccess();
        }

    }
}

// For ReportValue DropDown New
function bindDropReportValueNewDropDown(id, reportCategoryName) {
    var request = {
        ModuleName: reportCategoryName
    };

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Report/ReportValueDropdown',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status == true) {
                bindReportValueDropNewDownSuccess(response.data, 'ReportValueNewId');
            }
        },
        error: function (response) {

        },
    });
}

function bindReportValueDropNewDownSuccess(response, controlid) {
    if (response != null) {
        $('#' + controlid).empty();
        var data = JSON.parse(response);
        var dataValue = data[0];
        if (dataValue != null && dataValue.length > 0) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];

            $.each(dataValue, function (index, item) {
                $('#' + controlid).append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty],
                }));
            });
        }
        if (NewLogistics == true) {
            getReportNewSuccess();
            NewLogistics = false;
        }
    }
}

function bindReportTable(tableid, data, columns, scrollpx) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();

    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    columns = columns.filter(x => x.name != "TetroONEnocount");
    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");
    var OpeningStockIndex = columns.findIndex(column => column.data === "OpeningStock");
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var renderColumn = [
        {
            "targets": StatusColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Status_Color != null && row.Status_Color.length > 0) {
                    var dataText = row.Status;
                    var statusColor = row.Status_Color.toLowerCase();
                    return '<div><span class="ana-span badge text-white" style="background:' + statusColor + '">' + dataText + '</span></div>';
                }
                return data;
            }
        },
        {
            "targets": OpeningStockIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.StockInHand_Color != null && row.StockInHand_Color.length > 0) {
                    var dataText = row.OpeningStock;
                    var statusColor = row.StockInHand_Color.toLowerCase();
                    return '<div><span class="ana-span badge text-white" style="background:' + statusColor + '">' + dataText + '</span></div>';
                }
                return data;
            }
        }
    ];

    var table = $('#' + tableid).DataTable({
        "dom": "Bfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !isTetroONEnocount ? data : [],
        "columns": columns,
        "destroy": true,
        "columnDefs": !isTetroONEnocount ? renderColumn : [],
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "language": {
            "emptyTable": '<div><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        },
        "scrollCollapse": true,
        "info": hasValidData,
        "paging": hasValidData,
        "scrollX": true,
        "scrollY": 380,
        "scroller": true,
        "aaSorting": [],
        "oSearch": { "bSmart": false, "bRegex": true },

        "rowCallback": function (row, data) {
            let desc = data.Description ? data.Description.toString().trim() : "";
            let targetRows = ["Gross Profit", "Net Profit / Loss", "GP Percentage"];

            if (targetRows.includes(desc)) {

                $("td:eq(0)", row).css("font-weight", "bold");

                let valCell = $("td:eq(3)", row);
                let val = parseFloat(valCell.text());

                if (isNaN(val)) {
                    if (desc === "GP Percentage") {
                        valCell.text("0 %");
                    } else {
                        valCell.text("0.00");
                    }
                    valCell.css({ "font-weight": "bold", "color": "red" });
                } else {
                    if (desc === "GP Percentage") {
                        valCell.text(val.toFixed(2) + " %");
                    } else {
                        valCell.text(val.toFixed(2));
                    }

                    if (val > 0) {
                        valCell.css({ "font-weight": "bold", "color": "green" });
                    } else if (val < 0) {
                        valCell.css({ "font-weight": "bold", "color": "red" });
                    } else {
                        valCell.css({ "font-weight": "bold", "color": "red" });
                    }
                }
            }
        }
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);

    var borderTextAppend = $('#subModuleList a.active').text().trim();
    if (borderTextAppend == "Profit & Loss") {
        $('table.data-table').css('border-collapse', 'collapse');
        $('table.data-table th, table.data-table td').css({
            'border': '1px solid #ccc',
            'padding': '8px',
            'text-align': 'left'
        });
        $('table.data-table tr').css('border', '1px solid #ccc');
        $('table.data-table tr').each(function () {
            $(this).children('th:eq(4), td:eq(4)').css('border-left', '2px solid rgb(204, 204, 204)');
        });
    } else {
        $('table.data-table th, table.data-table td, table.data-table tr').css('border', 'none');
        $('table.data-table tr').each(function () {
            $(this).children('th:eq(4), td:eq(4)').css('border-left', 'none');
        });
    }
}

//$(document).on('click', '#ExcelReportTicketing', function () {
//    $('#loader-pms').show();
//    $.ajax({
//        url: '/Report/ExcelReportDownloadNew',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify({ ReportName: 'Profit & Loss' }),
//        xhrFields: { responseType: 'blob' },
//        success: function (response, status, xhr) {
//            var filename = "file.xlsx";
//            var disposition = xhr.getResponseHeader('Content-Disposition');
//            if (disposition && disposition.indexOf('attachment') !== -1) {
//                var matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
//                if (matches && matches[1]) {
//                    filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
//                }
//            }
//            var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//            var link = document.createElement('a');
//            link.href = window.URL.createObjectURL(blob);
//            link.download = filename;
//            link.click();
//            $('#loader-pms').hide();
//        },
//        error: function () {
//            $('#loader-pms').hide();
//            alert("Failed to generate Report Excel");
//        }
//    });
//});

function cb(start, end, label) {
    if (label === 'No Date') {
        $('#reportrange span').html('No Date');
    } else {
        $('#reportrange span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));
        $('#reportrange-error').hide();
    }
}

$('#reportrange').daterangepicker({
    autoUpdateInput: false,
    alwaysShowCalendars: true,
    showCustomRangeLabel: true,
    locale: {
        format: 'DD-MM-YYYY'
    }
}, cb);

$('#reportrange').daterangepicker({
    autoUpdateInput: false,
    locale: {
        format: 'DD-MM-YYYY',
        cancelLabel: 'Clear',
        applyLabel: 'Apply'
    }
}, function (start, end) {
    $('#reportrange span').html(
        start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY')
    );
});

$('#reportrange').on('cancel.daterangepicker', function (ev, picker) {
    $(this).find('span').html('No Date');
});