var ForwardEmpDropdown = [];
let ForwardEmpDropdownVal = [];
var PlantMappingId = 0;
var VisitorId = 0;
var formDataMultiple = new FormData();

$(document).ready(function () {
    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));
    $('.backdrop').show();
    initialize(PlantMappingId);
    $('.Error-Showing-Lable').hide();
    $('#HideVisitorStatus').hide();
    var currentrow = $('.isLookUp');
    if ($(this).prop('checked')) {
        $(currentrow).closest('.dynamicrow').find('.checkboxalign').css({ 'margin-bottom': '0px' });
    } else {
        $(currentrow).closest('.dynamicrow').find('.checkboxalign').css({ 'margin-bottom': '8px' });
    }

    //$('#LookForwardHoleDivHide').hide();
    //$('#CheckInOutHoleDivHide').hide();
    $('#StaticAttachment').hide();
    //$('#ForLableEmpAttend').text('Attendant');
    $('.mydatetimepicker').mdtimepicker();
    //$('#queryTextarea').css('height', '33px');
});

async function initialize(PlantMappingId) {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').show();

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/CRM/GetVisitor", { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, VisitorSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        if (displayedDate.getFullYear() > currentYear || (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() > currentMonth)) {
            $('#increment-month-btn2').hide();
        }

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/CRM/GetVisitor", { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, VisitorSuccess, null);
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
            Common.ajaxCall("GET", "/CRM/GetVisitor", { PlantId: parseInt(PlantMappingId), FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString() }, VisitorSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);
        var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/CRM/GetVisitor", EditDataId, VisitorSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/CRM/GetVisitor", { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, VisitorSuccess, null);

    Common.bindDropDown('AttendantId', 'Attendant');
    Common.bindDropDown('VisitorStatusId', 'EnquiryStatus');
    Common.bindDropDown('VisitorTypeId', 'VisitorType');

    ForwardEmpDropdownVal = await Common.bindDropDownSync('ForwardEmpName');
    Common.bindDropDownSuccess(ForwardEmpDropdownVal, 'ForwardEmpId');
    ForwardEmpDropdown = JSON.parse(ForwardEmpDropdownVal);

    ContactPersonDropdownVal = await Common.bindDropDownSync('VisitorContactPerson');
    Common.bindDropDownSuccess(ContactPersonDropdownVal, 'ContactPerson');
    ContactPersonDropdown = JSON.parse(ContactPersonDropdownVal);

    $('#VisitorTable').on('click', '.btn-delete', async function () { 
        var response = await Common.askConfirmation();
        if (response == true) {
            var VisitorId = $(this).data('id');
            Common.ajaxCall("GET", "/CRM/GetVisitorDelete", { VisitorId: VisitorId}, VisitorReload, null);
        }
    });
}

function VisitorSuccess(response) {
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

        var columns = Common.bindColumn(data[1], ['VisitorId', 'Status_Color']);
        bindTableVisitor('VisitorTable', data[1], columns, -1, 'VisitorId', '330px', true, access);
    }
}


function VisitorReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#InsertVisitorDetails").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        var fnData = Common.getDateFilter('dateDisplay2');
        var EditDataId = { PlantId: parseInt(PlantMappingId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/CRM/GetVisitor", EditDataId, VisitorSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}
//===========================insert=======================================================================================

$(document).on('click', '#customBtn_VisitorTable', function () {

    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#InsertVisitorDetails").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#InsertVisitorDetails").css("width", "60%");
    } else {
        $("#InsertVisitorDetails").css("width", "40%");
    } 
    $('#fadeinpage').addClass('fadeoverlay');  
    $('#HideVisitorStatus').hide();
    $('.Error-Showing-Lable').hide();
    $('.accordion-collapse').hide();
    $('#VisitorInfoAccrdion').show(); 
    $('#followupdetails').hide();
    $('#SaveVistors').text('Save').addClass('btn-success').removeClass('btn-update');
    $('#CommentsDiv').removeClass('col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12').addClass('col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'); 
    VisitorId = 0; 
    Common.removevalidation('InsertVisitorForm');
    $('#CheckIn').val('');
    $('#CheckOut').val('');
    $('#InsertVisitorInfo').modal('show');
    $('#VisitorPopupHeader').text('Add Visitor');    
    $('#VisitorTypeId').val(3); 
    $('#AttendantId').val(EmployeeId);
    var EditDataId = { ModuleName: 'Visitor', PlantId: PlantMappingId };

    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "VisitorNo", "VisitorNo");
    });

});
 
$(document).on('change', '#CheckIn', function () {
    var thisVal = $(this).val();
    var $endTimePicker = $('#CheckOut');
    $endTimePicker.val('');

    var endTimePlugin = $endTimePicker.data('mdtimepicker');

    if (endTimePlugin) {
        endTimePlugin.setMinTime(thisVal);
        //$endTimePicker.val(thisVal);
    }
}); 

$(document).on('click', '#SaveVistors', function (e) { 
    if ($("#InsertVisitorForm").valid()) {

        var DataStatic = JSON.parse(JSON.stringify(jQuery('#InsertVisitorForm').serializeArray()));
        var objvalue = {};
        $.each(DataStatic, function (index, item) {
            objvalue[item.name] = item.value;
        });

        objvalue.VisitorId = VisitorId > 0 ? VisitorId : null;
        objvalue.VisitorNo = $('#VisitorNo').val() || null; 
        objvalue.VisitorTypeId = parseInt($('#VisitorTypeId').val()); 
        objvalue.AttendantId = parseInt($('#AttendantId').val()); 
        objvalue.VisitorStatusId = parseInt($('#VisitorStatusId').val()) || null; 
        objvalue.Comments = $('#commentsTextarea').val() || null; 
        objvalue.Query = $('#queryTextarea').val() || null; 
        objvalue.PlantId = parseInt(PlantMappingId); 

        Common.ajaxCall("POST", "/CRM/InsertVistorsDetails", JSON.stringify(objvalue), VisitorReload, null);
    } 
});


$(document).on("input", '#InsertVisitorForm #VisitorEmail', function (event) {
    if (Common.validateEmailwithErrorwithParent('InsertVisitorForm', 'VisitorEmail')) {
        $('#InsertVisitorForm #VisitorEmail-error').remove();
    } 
});

$('#VisitorTable').on('click', '.btn-edit', function () {

    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#InsertVisitorDetails").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#InsertVisitorDetails").css("width", "60%");
    } else {
        $("#InsertVisitorDetails").css("width", "40%");
    } 
    $('#HideVisitorStatus').show();

    $('#fadeinpage').addClass('fadeoverlay');  
    Common.removevalidation('InsertVisitorForm');
    $('#CheckIn').val('');
    $('#CheckOut').val('');
    ResetDataVisitor(); 
    $('#VisitorPopupHeader').text('Visitor Info');
    $('#CommentsDiv').removeClass('col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12').addClass('col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12'); 
    $('#InsertEquiry').hide(); 
    $('#addfollowup').show(); 
    $('#InsertVisitorInfo').modal('show');
    $('#SaveVistors').text('Update').addClass('btn-update').removeClass('btn-success'); 
    VisitorId = $(this).data('id');
    var EditDataId = { VisitorId: VisitorId, PlantId: PlantMappingId };
    Common.ajaxCall("GET", "/CRM/GetVisitor", EditDataId, VisitorGetNotNull, null); 
});
 
function formatDateToYYYYMMDD(dateString) {
    var parts = dateString.split('-');
    var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
    return formattedDate;
}


var ForwardempPerson = null;
function VisitorGetNotNull(response) {
    if (response.status) {
         
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'InsertVisitorForm');
        $('#queryTextarea').val(data[0][0].Query);
        $('#commentsTextarea').val(data[0][0].Comments);
        $('#HideVisitorStatus').show(); 
         
    }
} 
//=====================================================dropdown=============================================

var ForwardempPerson = null;
async function LoadForwardPersonId() {
    var request = {
        moduleName: 'ForwardEmp'
    };
    var response = await Common.ajaxCallAsync("POST", "/Common/GetDropdownDetails", request);
    if (response != null) {
        ForwardempPerson = JSON.parse(response);
        Common.bindDropDownSuccess(response, 'ForwardEmpId');
    }
}
$(document).on('click', '#CloseCanvas', function () {
    $("#InsertVisitorDetails").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
    $('.Error-Showing-Lable').hide();
    $('.accordion-collapse').hide();

});

//=============================== Visitor number ====================================================================================
function VisitorNumberGet(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'InsertVisitorForm');
        $('#InsertVisitorForm #VisitorNo').val(),

            $('#InsertVisitorInfo').modal('show');
    }
}  

function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are zero based
    var year = date.getFullYear();

    // Pad day and month with leading zeros if needed
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return day + '-' + month + '-' + year;
}

function ResetDataVisitor() {

    $('#VisitorNo').val('');
    $('#VisitorDate').val('');
    $('#VisitorPersonName').val('');
    $('#ContactNumber').val('');
    $('#VisitorEmail').val('');
    $('#VisitorTypeId').val(null).trigger('change');
    $('#AttendantId').val(null).trigger('change');
    $('#VisitorIsLookUp').val(null).trigger('change');
    $('#VisitorLookUpDate').val(null).trigger('change');
    $('#VisitorIsForwardOption').val(null).trigger('change');
    $('#ForwardEmpId').val(null).trigger('change');
    $('#queryTextarea').val('');
    $('#commentsTextarea').val('');
    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
}
 
 
function bindTableVisitor(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
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
                    htmlContent += '<span class="ana-span badge text-white" style="background:' + statusColor + ';width: 99px;font-size: 12px;height: 20px;">' + dataText + '</span>';
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
                    if (editCondition || deleteCondition) {
                        return `
                                 ${editCondition ? `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-delete alert_delete mx-1"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
                    }
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
        "pageLength": 8,
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
  