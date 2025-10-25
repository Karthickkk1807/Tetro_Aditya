var ForwardEmpDropdown = [];
let ForwardEmpDropdownVal = [];
var FranchiseId = 0;
var VisitorId = 0;

$(document).ready(function () {
    FranchiseId = parseInt(localStorage.getItem('FranchiseId'));
    $('.backdrop').show();
    initialize(FranchiseId);
    $('.Error-Showing-Lable').hide();
    $('#HideVisitorStatus').hide();
    var currentrow = $('.isLookUp');
    if ($(this).prop('checked')) {
        $(currentrow).closest('.dynamicrow').find('.checkboxalign').css({ 'margin-bottom': '0px' });
    } else {
        $(currentrow).closest('.dynamicrow').find('.checkboxalign').css({ 'margin-bottom': '8px' });
    }
    //Common.SetMinDate('.lookUpDate');
    //Common.SetMinDate('#VisitorLookUpDate');
    $('#LookForwardHoleDivHide').hide();
    $('#CheckInOutHoleDivHide').hide();
    $('#StaticAttachment').hide();
    $('#ForLableEmpAttend').text('Attendant');
    $('.mydatetimepicker').mdtimepicker();
    $('#queryTextarea').css('height', '33px');
});

async function initialize(FranchiseId) {

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
        Common.ajaxCall("GET", "/Visitor/GetVisitor", { FranchiseId: parseInt(FranchiseId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, VisitorSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        if (displayedDate.getFullYear() > currentYear || (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() > currentMonth)) {
            $('#increment-month-btn2').hide();
        }

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Visitor/GetVisitor", { FranchiseId: parseInt(FranchiseId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, VisitorSuccess, null);
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
            Common.ajaxCall("GET", "/Visitor/GetVisitor", { FranchiseId: parseInt(FranchiseId), FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString() }, VisitorSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);
        var EditDataId = { FranchiseId: parseInt(FranchiseId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Visitor/GetVisitor", EditDataId, VisitorSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });

    //var fnData = Common.getDateFilter('dateDisplay2');
   // Common.ajaxCall("GET", "/Visitor/GetVisitor", { FranchiseId: parseInt(FranchiseId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, VisitorSuccess, null);
    VisitorSuccess();
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
        var FranchiseId = parseInt($("#UserFranchiseMappingId").val());
        var response = await Common.askConfirmation();
        if (response == true) {
            var VisitorId = $(this).data('id');
            Common.ajaxCall("GET", "/Visitor/DeleteVisitor", { VisitorId: VisitorId, FranchiseId: FranchiseId }, VisitorReload, null);
        }
    });
}

//function VisitorSuccess(response) {
//    if (response.status) {

//        var data = JSON.parse(response.data);

//        var CounterBox = Object.keys(data[0][0]);

//        $("#CounterTextBox1").text(CounterBox[0]);
//        $("#CounterTextBox2").text(CounterBox[1]);
//        $("#CounterTextBox3").text(CounterBox[2]);
//        $("#CounterTextBox4").text(CounterBox[3]);

//        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
//        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
//        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
//        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

//        var columns = Common.bindColumn(data[1], ['VisitorId', 'Status_Color']);
//        bindTableVisitor('VisitorTable', data[1], columns, -1, 'VisitorId', '330px', true, access);
//    }
//}



function VisitorSuccess(response) {

    // Hardcoded counter box labels
    $("#CounterTextBox1").text("Total");
    $("#CounterTextBox2").text("Open");
    $("#CounterTextBox3").text("InFollowUp");
    $("#CounterTextBox4").text("Close");

    // Hardcoded counter box values
    $("#CounterValBox1").text("1");
    $("#CounterValBox2").text("1");
    $("#CounterValBox3").text("0");
    $("#CounterValBox4").text("0");

    // Hardcoded visitor table data
    var data = [
        {
            VisitorId: 1,
            VisitorType: "Customer",
            VisitorNo: "VIS-0001",
            Date: "2025-10-25",
            PersonName: "Arun Kumar",
            ContactNo: "9876543210",
            AttenentName: "Suresh",
            Status: "Open",
            Status_Color: "#28a745"
        },
        {
            VisitorId: 2,
            VisitorType: "Vendor",
            VisitorNo: "VIS-0002",
            Date: "2025-10-24",
            PersonName: "Priya R",
            ContactNo: "9876501234",
            AttenentName: "Ramesh",
            Status: "Close",
            Status_Color: "#dc3545"
        }
    ];


    // Hardcoded grid column definition
    var columns = [
        { data: "VisitorType", title: "Visitor Type" },
        { data: "VisitorNo", title: "Visitor No" },
        { data: "Date", title: "Date" },
        { data: "PersonName", title: "Person Name" },
        { data: "ContactNo", title: "Contact No" },
        { data: "AttenentName", title: "Attenent Name" },
        { data: "Status", title: "Status" }
    ];

    // Dummy access object (if your actual one is not present)
    var access = { update: true, delete: true };

    // Bind the hardcoded table
    bindTableVisitor('VisitorTable', data, columns, -1, 'VisitorId', '330px', true, access);
}


function VisitorReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        var FranchiseId = parseInt($("#UserFranchiseMappingId").val());
        var editDataId = {
            FranchiseId: FranchiseId
        }

        var fnData = Common.getDateFilter('dateDisplay2');
        var EditDataId = { FranchiseId: parseInt(FranchiseId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Visitor/GetVisitor", EditDataId, VisitorSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}
//===========================insert=======================================================================================
var formDataMultiple = new FormData();
$(document).on('click', '#customBtn_VisitorTable', function () {

    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#InsertVisitorDetails").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#InsertVisitorDetails").css("width", "60%");
    } else {
        $("#InsertVisitorDetails").css("width", "40%");
    }
    CanvasOpenFirstShowingVisitor();
    $('#fadeinpage').addClass('fadeoverlay');
    $('#InsertVisitorDetails.collapse').removeClass('show');
    $('#collapse1').addClass('show');
    $('#HideVisitorStatus').hide();
    $('.Error-Showing-Lable').hide();
    $('.accordion-collapse').hide();
    $('#VisitorInfoAccrdion').show();
    $('.accordion-collapse').removeClass('show').addClass('collapse');
    $('.accordion-item .arrowicon i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    $('#VisitorInfoAccrdion').removeClass('collapse').addClass('show');
    $('#productBtn1 .arrowicon i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    $('#followupdetails').hide();
    $('#VisitorIsLookUp').prop('checked', false);
    $('#VisitorLookUpDate').closest('.form-group').hide();
    $('#insertIsLookUp').css('margin-top', '33px');

    $('#VisitorIsForwardOption').prop('checked', false);
    $('#ForwardEmpId').closest('.form-group').hide();
    $('#insertForward').css('margin-top', '33px');
    VisitorId = 0;
    $('#InsertVisitorForm')[0].reset();
    Common.removevalidation('InsertVisitorForm');
    ResetDataVisitor();
    $('#InsertVisitorInfo').modal('show');
    $('#VisitorPopupHeader').text('Add Visitor');
    $('#InsertEquiry').show();
    $('#UpdateEquiry').hide();
    $('#followupinfo').hide();
    $('#ContactNumberError').hide();
    //Common.SetMinDate('#VisitorLookUpDate');
    //Common.SetMaxDate('#VisitorDate');
    $('#VisitorTypeId').val(3).trigger('change')
    var FranchiseId = parseInt($("#UserFranchiseMappingId").val());
    var EditDataId = { ModuleName: 'Visitor', FranchiseId: FranchiseId };

    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "VisitorNo", "VisitorNo");
    });

});


$(document).on('click', '#InsertEquiry', function () {

    if (!Common.validateEmailwithErrorwithParent('InsertVisitorForm', 'VisitorEmail')) {
        return false;
    }

    getExistFiles();

    var insertVisitorForm = $('#InsertVisitorForm').validate().form();

    var VisitorDateString = $('#VisitorDate').val();
    var Visitordate = new Date(VisitorDateString);

    var lookUpDateString = $('#VisitorLookUpDate').val();
    var lookUpDate = new Date(lookUpDateString);

    var InsertVisitorDetailsStatic = {
        VisitorDate: Visitordate,
        VisitorPersonName: $('#VisitorPersonName').val(),
        VisitorNo: $('#VisitorNo').val(),
        ContactNumber: $('#ContactNumber').val(),
        VisitorEmail: $('#VisitorEmail').val(),
        VisitorTypeId: parseInt($('#VisitorTypeId').val()),
        AttendantId: parseInt($('#AttendantId').val()),
        CheckIn: $('#CheckIn').val(),
        CheckOut: $('#CheckOut').val(),
        Query: $('#queryTextarea').val(),
        Comments: $('#commentsTextarea').val(),
        VisitorIsLookUp: $('#VisitorIsLookUp').is(':checked'),
        VisitorLookUpDate: $('#VisitorLookUpDate').is(':checked') ? "" : lookUpDate,
        VisitorIsForwardOption: $('#VisitorIsForwardOption').is(':checked'),
        ForwardEmpId: $('#VisitorIsForwardOption').is(':checked') ? parseInt($('#ForwardEmpId').val()) : 0,
        FranchiseId: parseInt($("#UserFranchiseMappingId").val())
    };

    if (insertVisitorForm) {
        formDataMultiple.append("InsertVisitorDetailsStatic", JSON.stringify(InsertVisitorDetailsStatic));
        formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
        formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

        $.ajax({
            type: "POST",
            url: "/Visitor/InsertVisitor",
            data: formDataMultiple,
            contentType: false,
            processData: false,

            success: function (response) {
                if (response.status) {
                    formDataMultiple = new FormData();
                    Common.successMsg(response.message);
                    var FranchiseId = parseInt($("#UserFranchiseMappingId").val());

                    var fnData = Common.getDateFilter('dateDisplay2');
                    var EditDataId = { FranchiseId: parseInt(FranchiseId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
                    Common.ajaxCall("GET", "/Visitor/GetVisitor", EditDataId, VisitorSuccess, null);
                    $('#InsertVisitorInfo').modal('hide');
                    $('#selectedFiles,#ExistselectedFiles').empty('');
                    existFiles = [];
                    $("#InsertVisitorDetails").css("width", "0%");
                    $('#fadeinpage').removeClass('fadeoverlay');
                }
                else {
                    Common.errorMsg(response.message);
                    formDataMultiple = new FormData();
                }
            },
            error: function (e) {
                Common.errorMsg(response.message);
                formDataMultiple = new FormData();
            }

        });
    }
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

var ThisInterChangeVal = true;
$(document).on('change', '#VisitorTypeId', function () {
    var thisValues = $(this).val();
    if (thisValues == 1 || thisValues == 2) {
        $('#LookForwardHoleDivHide').show();
        $('#StaticAttachment').show();
        $('#CheckInOutHoleDivHide').hide();
        $('#ForLableEmpAttend').text('Attendant');
        $('#queryTextarea').css('height', '77px');
        if (VisitorId != 0) {
            $('#followupdetails').show();
        }
        if (ThisInterChangeVal == true) {
            $('#CheckIn').val('');
            $('#CheckOut').val('');
            $('#VisitorLookUpDate').val('');
            $('#ForwardEmpId').val('');
            $('#VisitorIsLookUp').prop('checked', false);
            $('#VisitorIsForwardOption').prop('checked', false);
        }
    }
    else if (thisValues == 3) {
        $('#LookForwardHoleDivHide').hide();
        $('#StaticAttachment').hide();
        $('#CheckInOutHoleDivHide').show();
        $('#ForLableEmpAttend').text('Employee');
        $('#queryTextarea').css('height', '113px');
        if (VisitorId != 0) {
            $('#followupdetails').hide();
        }
        if (ThisInterChangeVal == true) {
            $('#CheckIn').val('');
            $('#CheckOut').val('');
            $('#VisitorLookUpDate').val('');
            $('#ForwardEmpId').val('');
            $('#VisitorIsLookUp').prop('checked', false);
            $('#VisitorIsForwardOption').prop('checked', false);
        }
        //$('#CheckIn').val('');
        //$('#CheckOut').val('');
        //$('#VisitorLookUpDate').val('');
        //$('#ForwardEmpId').val('');
        //$('#VisitorIsLookUp').prop('checked', false);
        //$('#VisitorIsForwardOption').prop('checked', false);
    }
    else {
        $('#LookForwardHoleDivHide').hide();
        $('#CheckInOutHoleDivHide').hide();
        $('#StaticAttachment').hide();
        $('#ForLableEmpAttend').text('Attendant');
        $('#followupdetails').hide();
        $('#queryTextarea').css('height', '33px');
        if (VisitorId != 0) {
            $('#followupdetails').hide();
        }
        if (ThisInterChangeVal == true) {
            $('#CheckIn').val('');
            $('#CheckOut').val('');
            $('#VisitorLookUpDate').val('');
            $('#ForwardEmpId').val('');
            $('#VisitorIsLookUp').prop('checked', false);
            $('#VisitorIsForwardOption').prop('checked', false);
        }
        //$('#CheckIn').val('');
        //$('#CheckOut').val('');
        //$('#VisitorLookUpDate').val('');
        //$('#ForwardEmpId').val('');
        //$('#VisitorIsLookUp').prop('checked', false);
        //$('#VisitorIsForwardOption').prop('checked', false);
    }
});

//=========================not null =======================================================================================

var numberIncr = 0;
var limit = 5;
var incrementlimit = 0;


$('#dyanmicplusbtn').click(function () {
    // $('.dynamicrow').remove();
    $('.fieldset').show();

    if (incrementlimit < limit) {
        numberIncr++;
        var selectOptions = "";
        var ContactPersonselectOptions = "";
        var defaultOption = '<option value="">--Select--</option>';

        if (ForwardEmpDropdown != null && ForwardEmpDropdown.length > 0 && ForwardEmpDropdown[0].length > 0) {
            selectOptions = ForwardEmpDropdown[0].map(function (dynamicrow) {
                return `<option value="${dynamicrow.ForwardEmpId}">${dynamicrow.ForwardEmpName}</option>`;
            }).join('');
        }

        if (ContactPersonDropdown != null && ContactPersonDropdown.length > 0 && ContactPersonDropdown[0].length > 0) {
            ContactPersonselectOptions = ContactPersonDropdown[0].map(function (dynamicrow) {
                return `<option value="${dynamicrow.ContactPerson}">${dynamicrow.ContactPersonName}</option>`;
            }).join('');
        }
        var rowadd = $('.dynamicrow').length;
        var DynamicLableNo = rowadd + 1;

        if ((rowadd < 3)) {
            var html = `
            <div class="row dynamicrow mt-0">
                <div class="col-lg-8 col-md-8 col-sm-8 col-8 mt-2 d-flex flex-column mb-2">
                    <label class="DynamicLable">Visitor Followup ${DynamicLableNo}</label>
                </div>
                <input type="hidden" class="form-control" name="VisitorFollowUpId" id="VisitorFollowUpId">
                <!-- Follow-Up Date -->
                <div class="col-lg-6 col-md-6 col-sm-12 col-12 mt-2 d-flex flex-column">
                    <div class="form-group">
                        <label for="FollowUpDate${numberIncr}">FollowUpDate</label>
                        <input type="date" class="form-control followUpDate" placeholder="Select the Date"
                               id="FollowUpDate${numberIncr}" autocomplete="off" name="FollowUpDate${numberIncr}">
                    </div>
                    <div class="border border-radius mt-2" style="background-color:#F1F0EF; max-height:10.5rem; height: 126px;">
                        <label class="d-flex justify-content-center align-content-center mt-1"
                               style="text-decoration: underline; color: #7D7C7C;"
                               onclick="Attachment(${numberIncr})">
                            <b class="attachlabel" style="white-space: nowrap; margin-left: 4px;">Click Here to Attach your files</b>
                            <input type="file" id="fileInput${numberIncr}" multiple class="custom-file-input" hidden>
                        </label>
                        <div class="file-preview d-flex justify-content-center" id="preview${numberIncr}">
                            <div class="attachrow">
                                <div class="attachcolumn">
                                    <ul id="selectedFiles${numberIncr}"></ul>
                                </div>
                                <div class="attachcolumn existselectedFiles">
                                    <ul class="DynamicExistselectedFiles" id="ExistselectedFiles"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div class="col-lg-6 col-md-6 col-sm-12 col-12 mt-2 d-flex flex-column">
                    <!-- Contact Person -->
                    <div class="form-group">
                        <label for="ContactPerson${numberIncr}">Name</label>
                        <select class="form-control ContactPerson" id="ContactPerson${numberIncr}" autocomplete="off" name="ContactPerson${numberIncr}">
                            ${defaultOption}${ContactPersonselectOptions}
                        </select>
                    </div>
                    <!-- Next FollowUp Date Checkbox -->
                    <div class="form-check d-flex align-items-center maxdevicecolumnsnew mt-2">
                        <input class="form-check-input isLookUp" type="checkbox" id="IsLookUp${numberIncr}" name="IsLookUp${numberIncr}">
                        <label class="form-check-label newlabelFollowuptonew ml-1" for="IsLookUp${numberIncr}">
                            <span>Next FollowUpDate</span>
                        </label>
                    </div>
                    <!-- Next FollowUp Date Input (Initially Hidden) -->
                    <div class="form-group is-lookup3 mt-2" style="display: none; margin-top: -11px;">
                        <input type="date" class="form-control lookUpDate" id="LookUpDate${numberIncr}" name="LookUpDate" autocomplete="off" placeholder="Select the Date">
                    </div>
                    <!-- Assign To Checkbox -->
                    <div class="form-check d-flex align-items-center maxdevicecolumnsnew">
                        <input class="form-check-input isForwardOption" type="checkbox" id="IsForwardOption${numberIncr}" name="IsForwardOption${numberIncr}">
                        <label class="form-check-label newlabelFollowuptonew ml-1" for="IsForwardOption${numberIncr}">
                            <span>Assign To</span>
                        </label>
                    </div>
                    <!-- Assign To Dropdown (Initially Hidden) -->
                    <div class="form-group forward-option3" style="display: none;">
                        <select class="form-control forwardEmpId" id="ForwardEmpId${numberIncr}" autocomplete="off" required
                                name="ForwardEmpId${numberIncr}">
                            ${defaultOption}${selectOptions}
                        </select>
                    </div>
                    <input type="hidden" class="form-control" name="VisitorId" id="VisitorId${numberIncr}">
                </div>
                <!-- Comments Input -->
                <div class="col-lg-11 col-md-11 col-sm-11 col-11 mt-1">
                    <div class="form-group">
                        <label>Comments</label>
                        <textarea class="form-control Comments" id="Comments${numberIncr}" name="Comments${numberIncr}" autocomplete="off" placeholder="Comments" maxlength="250" rows="1"></textarea>
                    </div>
                </div>
                <!-- Remove Button -->
                <div class="col-lg-1 col-md-1 col-sm-1 col-1 p-1 removebtn thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                    <button class="btn DynrowRemove" type="button" onclick="removeRow(this)">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            `;
            $('#duplicaterow').append(html);
            incrementlimit++;
            //Common.SetMinDate('.lookUpDate');
            var currentrow = $('.isLookUp');
            if ($(this).prop('checked')) {
                $(currentrow).closest('.dynamicrow').find('.checkboxalign').css({ 'margin-bottom': '0px' });
            } else {
                $(currentrow).closest('.dynamicrow').find('.checkboxalign').css({ 'margin-bottom': '8px' });
            }
            updateRemoveButtons();
            setMinDateForFollowUp();
        }
    }
});


function updateRowLabels() {
    $('.dynamicrow').each(function (index) {
        $(this).find('.DynamicLable').text('Visitor Followup ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.dynamicrow');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow');
        if (rows.length == 1) {
            removeButtonDiv.css('display', 'none');
        } else {
            removeButtonDiv.css('display', 'block');
        }
    });
}

function removeRow(button) {
    var totalRows = $('.dynamicrow').length;
    if (totalRows > 1) {
        $(button).closest('.dynamicrow').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
}

$('#VisitorTable').on('click', '.btn-edit', function () {

    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#InsertVisitorDetails").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#InsertVisitorDetails").css("width", "60%");
    } else {
        $("#InsertVisitorDetails").css("width", "40%");
    }
    CanvasOpenFirstShowingVisitor();
    $('#HideVisitorStatus').show();

    $('#fadeinpage').addClass('fadeoverlay');
    $('#InsertVisitorDetails.collapse').removeClass('show');
    $('#collapse1').addClass('show');
    $('#followupdetails').show();
    $('#InsertVisitorForm').show();
    $('#InsertVisitorForm')[0].reset();
    Common.removevalidation('InsertVisitorForm');
    ResetDataVisitor();
    $('#selectedFiles,#ExistselectedFiles, #updateSelectedFiles').empty('');
    $('#VisitorPopupHeader').text('Visitor Info');
    $('#InsertEquiry').hide();
    $('#UpdateEquiry').show();
    $('#followupinfo').show();
    $('#addfollowup').show();
    $('#VisitorNo').attr('readonly', true);
    $('#InsertVisitorInfo').modal('show');
    $('#duplicaterow').show();

    //Common.SetMinDate('#VisitorLookUpDate');

    VisitorId = $(this).data('id');
    var FranchiseId = parseInt($("#UserFranchiseMappingId").val());

    var EditDataId = { VisitorId: VisitorId, ReturnType: null, FranchiseId: FranchiseId };
    Common.ajaxCall("GET", "/Visitor/GetPopupVisitorDetails", EditDataId, VisitorGetNotNull, null);

    $('.accordion-collapse').hide();
    $('#VisitorInfoAccrdion').show();
    $('#VisitorFollowupInfoAccrdion').hide();
    $('.accordion-collapse').removeClass('show').addClass('collapse');
    $('.accordion-item .arrowicon i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    $('#VisitorInfoAccrdion').removeClass('collapse').addClass('show');
    $('#productBtn1 .arrowicon i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    $('#VisitorFollowupInfoAccrdion').removeClass('show').addClass('collapse');
    $('#productBtn2 .arrowicon i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
});

function formatDateToYYYYMMDD(dateString) {
    var parts = dateString.split('-');
    var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
    return formattedDate;
}


var ForwardempPerson = null;
function VisitorGetNotNull(response) {
    if (response.status) {

        ThisInterChangeVal = false;

        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'InsertVisitorDetails');
        $('#queryTextarea').val(data[0][0].Query);
        $('#commentsTextarea').val(data[0][0].Comments);
        $('#HideVisitorStatus').show();
        debugger;

        var VisitorIsLookUp = data[0][0].VisitorIsLookUp
        var VisitorLookUpDate = data[0][0].VisitorLookUpDate
        var VisitorIsForwardOption = data[0][0].VisitorIsForwardOption
        var forwardEmpId = data[0][0].ForwardEmpId

        $('#VisitorTypeId').val(data[0][0].VisitorTypeId).trigger('change');

        if (VisitorIsLookUp == 1) {
            $("#VisitorIsLookUp").prop("checked", true);
            $(".isLookUpenqdate").removeClass('d-none');
            $(".isLookUpenqdate").show();
            $("#VisitorLookUpDate").val(formatDateToYYYYMMDD(VisitorLookUpDate));
            $('#queryTextarea').css('height', '95px');
        } else {
            $("#VisitorIsLookUp").prop("checked", false);
            $(".isLookUpenqdate").addClass('d-none');
            $(".isLookUpenqdate").hide();
            $("#VisitorLookUpDate").val('');
            $('#queryTextarea').css('height', '77px');
        }

        if (VisitorIsForwardOption == 1) {
            $("#VisitorIsForwardOption").prop("checked", true);
            $(".forward-option").removeClass('d-none')
            $(".forward-option").show();
            $("#ForwardEmpId").val(forwardEmpId);
            $('#queryTextarea').css('height', '95px');
        } else {
            $("#VisitorIsForwardOption").prop("checked", false);
            $(".forward-option").addClass('d-none')
            $(".forward-option").hide();
            $("#ForwardEmpId").val('');
            $('#queryTextarea').css('height', '77px');
        }

        $('#duplicaterow').html("");

        var numberIncrNotNull = 0;
        if (data[1] != null && data[1].length > 0 && data[1][0].VisitorId != null) {

            $.each(data[1], function (index, value) {

                let uniqueId = Math.random().toString(36).substring(2);

                numberIncrNotNull++;

                var selectOptions = "";
                var ContactPersonselectOptions = "";
                var defaultOption = '<option value="">--Select--</option>';

                if (ForwardEmpDropdown != null && ForwardEmpDropdown.length > 0 && ForwardEmpDropdown[0].length > 0) {
                    selectOptions = ForwardEmpDropdown[0].map(function (dynamicrow) {
                        var isSelected = value.ForwardEmpId == dynamicrow.ForwardEmpId ? 'selected' : '';
                        return `<option value="${dynamicrow.ForwardEmpId}"  ${isSelected}>${dynamicrow.ForwardEmpName}</option>`;
                    }).join('');
                }

                if (ContactPersonDropdown != null && ContactPersonDropdown.length > 0 && ContactPersonDropdown[0].length > 0) {
                    ContactPersonselectOptions = ContactPersonDropdown[0].map(function (dynamicrow) {
                        var isContactPersonSelected = value.ContactPerson == dynamicrow.ContactPerson ? 'selected' : '';
                        return `<option value="${dynamicrow.ContactPerson}" ${isContactPersonSelected}>${dynamicrow.ContactPersonName}</option>`;
                    }).join('');
                }


                var IsLookUp = value.IsLookUp == 1 ? 'checked' : '';
                var lookupdate = value.IsLookUp == false ? 'display:none' : '';


                var IsForwardOption = value.IsForwardOption == 1 ? 'checked' : '';
                var forwardoption = value.IsForwardOption == false ? 'display:none' : '';

                var matchingAttachments = data[3].filter(att => att.RoWNumber === value.RowNumber);
                var existHtml = "";
                existHtml = matchingAttachments.map(att => {
                    // Apply the truncation logic to the AttachmentFileName
                    const truncatedFileName = att.AttachmentFileName.length > 10 ? att.AttachmentFileName.substring(0, 10) + '...' : att.AttachmentFileName;

                    return `
                            <li>
                                <span>${truncatedFileName}</span>
                                <a class="download-link" href="${att.AttachmentFilePath}" download="${att.AttachmentFileName}">
                                    <i class="fas fa-download"></i>
                                </a>
                                <a src="${att.AttachmentFilePath}" attachmentid="${att.VisitorAttachmentId}" modulerefid="${att.ModuleRefId}" 
                                   id="deletefile" class="delete-buttonattach">
                                    <i class="fas fa-trash"></i>
                                </a>
                            </li>
                        `;
                }).join('');

                var rowadd = $('.dynamicrow').length;
                var DynamicLableNo = rowadd + 1;
                if (value.VisitorId) {
                    var html = `
                        <div class="row dynamicrow">
                            <div class="col-lg-8 col-md-8 col-sm-8 col-12 mt-2 d-flex flex-column mb-2">
                                <label class="DynamicLable">Visitor Followup ${DynamicLableNo}</label>
                            </div>
                            <input type="hidden" class="form-control" name="VisitorFollowUpId" id="VisitorFollowUpId">
                            <div class="col-lg-6 col-md-6 col-sm-12 col-12 mt-2 d-flex flex-column">
                                <div class="form-group">
                                    <label>FollowUpDate</label>
                                    <input type="date" class="form-control followUpDate" placeholder="Select the Date" id="FollowUpDate${uniqueId}" value="${value.FollowUpDate}" autocomplete="off" name="FollowUpDate${uniqueId}">
                                </div>
                                <div class="border border-radius mt-2" style="background-color:#F1F0EF; max-height:10.5rem; height: 126px;">
                                    <label class="d-flex justify-content-center align-content-center mt-1" style="text-decoration: underline; color: #7D7C7C; margin-left: 15px;" onclick="Attachment(${numberIncrNotNull})">
                                        <b class="attachlabel" style="white-space: nowrap;margin-left: 4px;">Click Here to Attach your files</b>
                                        <input type="file" id="fileInput${numberIncrNotNull}" multiple class="custom-file-input">
                                    </label>
                                    <div class="file-preview d-flex justify-content-center" id="preview${numberIncrNotNull}">
                                        <div class="attachrow">
                                            <div class="attachcolumn">
                                                <ul class="ExistFiles" id="selectedFiles${numberIncrNotNull}"></ul>
                                            </div>
                                            <div class="attachcolumn existselectedFiles"><ul class="DynamicExistselectedFiles" id="ExistselectedFiles${numberIncrNotNull}">${existHtml}</ul></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 col-12 mt-2 d-flex flex-column">
                                <!-- Contact Person -->
                                <div class="form-group">
                                    <label>Name</label>
                                    <select class="form-control ContactPerson" id="ContactPerson${numberIncr}" autocomplete="off" name="ContactPerson${numberIncr}">${defaultOption}${ContactPersonselectOptions}</select>
                                </div>
                                <div class="form-check d-flex align-items-center maxdevicecolumnsnew mt-2">
                                    <input class="form-check-input isLookUp" type="checkbox" id="IsLookUp${uniqueId}" name="IsLookUp${uniqueId}" value="${value.IsLookUp}" ${IsLookUp} />
                                    <label class="form-check-label newlabelFollowuptonew ml-1">
                                        <span class="">Next FollowUpDate</span>
                                    </label>
                                </div>
                                <div class="form-group is-lookup3" style="${lookupdate}">
                                    <input type="date" class="form-control lookUpDate" id="LookUpDate" name="LookUpDate" autocomplete="off" placeholder="Select the Date" value="${value.LookUpDate}">
                                </div>
                                <div class="form-check d-flex align-items-center maxdevicecolumnsnew mt-2">
                                    <input type="checkbox" class="form-check-input isForwardOption" id="IsForwardOption" name="IsForwardOption" value="${value.IsForwardOption}" ${IsForwardOption} />
                                    <label class="form-check-label newlabelFollowuptonew ml-1">
                                        <span class="">Assign To</span>
                                    </label>
                                </div>
                                <div class="form-group forward-option3" style="${forwardoption}">
                                    <select class="form-control forwardEmpId" id="ForwardEmpId${numberIncr}" required autocomplete="off" name="ForwardEmpId${numberIncr}">${defaultOption}${selectOptions}</select>
                                </div>
                                <input type="hidden" class="form-control" name="VisitorId" id="VisitorId">
                            </div>
                            <div class="col-lg-11 col-md-11 col-sm-11 col-11 mt-1">
                                <div class="form-group">
                                    <label>Comments</label>
                                    <textarea class="form-control Comments" id="Comments${uniqueId}" name="Comments${uniqueId}" autocomplete="off" placeholder="Comments" maxlength="250" rows="1">${value.Comments}</textarea>
                                </div>
                            </div>
                            <div class="col-lg-1 col-md-1 col-sm-1 col-1 p-1 removebtn thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                                <button id="" class="btn DynrowRemove" type="button" onclick="removeRow(this)"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                     `;


                    $('#duplicaterow').append(html);
                    //Common.SetMinDate('.lookUpDate');
                    $('#followupinfo').css('display', 'block');
                    var lastDiv = $('.dynamicrow').last();
                    if (value.FollowUpDate != null) {
                        var parts = value.FollowUpDate.split("-");
                        var formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                        $(lastDiv).find('.followUpDate').val(formattedDate);

                    }
                    if (value.LookUpDate != null) {
                        var part = value.LookUpDate.split("-");
                        var formatDate = part[2] + "-" + part[1] + "-" + part[0];
                        $(lastDiv).closest('#duplicaterow').find('.lookUpDate').val(formatDate);
                    }
                    $(lastDiv).find('.comments').val(value.Comments);
                    updateRemoveButtons();
                }
            });
        }
        else {
            $('#dyanmicplusbtn').click();
        }

        var ulElement = $('#InsertVisitorInfo #ExistselectedFiles');

        $('#ExistselectedFiles, #selectedFiles').empty();
        var ulElement = $('#ExistselectedFiles');
        $.each(data[2], function (index, file) {
            if (file.AttachmentId != null) {
                var truncatedFileName = file.AttachmentFileName.length > 10 ? file.AttachmentFileName.substring(0, 10) + '...' : file.AttachmentFileName;
                var liElement = $('<li>');
                var spanElement = $('<span>').text(truncatedFileName);
                var downloadLink = $('<a>').addClass('download-link')
                    .attr('href', file.AttachmentFilePath)
                    .attr('download', file.AttachmentFileName)
                    .html('<i class="fas fa-download"></i>');

                var deleteButton = $('<a>').attr({
                    'src': file.AttachmentFilePath,
                    'AttachmentId': file.AttachmentId,
                    'ModuleRefId': file.ModuleRefId,
                    'id': 'deletefile'
                }).addClass('delete-buttonattach').html('<i class="fas fa-trash"></i>');

                liElement.append(spanElement);
                liElement.append(downloadLink);
                liElement.append(deleteButton);
                ulElement.append(liElement);
            }
        });

        if (VisitorLookUpDate != null) {
            var parts = VisitorLookUpDate.split('-');
            var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0]; // '2025-07-03'

            //$('.followUpDate').each(function () {
            //    $(this).attr('min', formattedDate);
            //});
        }
    }
}

//=====================================================update=============================================
$(document).on('click', '#UpdateEquiry', function (e) {
    debugger;
    var isMainFormValid = $('#InsertVisitorForm').valid();
    var isDynamicFormValid = $('#DynamicFollowupDetails').valid();

    e.preventDefault();
    var isFormValid = validateFormAccordions('.accordion');

    if (isMainFormValid && isDynamicFormValid) {
        $('.Error-Showing-Lable').hide();
        getExistFiles();

        var VisitorDateString = $('#InsertVisitorForm #VisitorDate').val();
        var Visitordate = new Date(VisitorDateString);

        var lookUpDateValue = $('#VisitorLookUpDate').val().trim();
        var lookUpDate = lookUpDateValue === '' ? null : new Date(lookUpDateValue);

        var UpdateVisitorDetailsStatic = {
            VisitorId: VisitorId,
            VisitorDate: Visitordate,
            VisitorPersonName: $('#VisitorPersonName').val(),
            VisitorNo: $('#VisitorNo').val(),
            VisitorStatusId: parseInt($('#VisitorStatusId').val()),
            ContactNumber: $('#ContactNumber').val(),
            VisitorEmail: $('#VisitorEmail').val(),
            VisitorTypeId: parseInt($('#VisitorTypeId').val()),
            AttendantId: parseInt($('#AttendantId').val()),
            CheckIn: $('#CheckIn').val(),
            CheckOut: $('#CheckOut').val(),
            Query: $('#queryTextarea').val(),
            Comments: $('#commentsTextarea').val(),
            VisitorIsLookUp: $('#VisitorIsLookUp').is(':checked'),
            VisitorLookUpDate: $('#VisitorLookUpDate').is(':checked') ? "" : lookUpDate,
            VisitorIsForwardOption: $('#VisitorIsForwardOption').is(':checked'),
            ForwardEmpId: $('#VisitorIsForwardOption').is(':checked') ? parseInt($('#ForwardEmpId').val()) : 0,
            FranchiseId: parseInt($("#UserFranchiseMappingId").val())
        };

        var VisitorFollowupDetailsArray = [];
        var DyanamicAttachment = [];
        var existFilesDyanamicAttachment = [];
        var VisitorFollowupDetails = $('.dynamicrow');

        if (!$('#followupdetails').is(':hidden')) {
            $.each(VisitorFollowupDetails, function (index, value) {
                var contactPerson = $(value).find('.ContactPerson').val();

                // Skip this row if ContactPerson is empty
                if (!contactPerson || contactPerson.trim() === '') {
                    return; // Continue to next iteration
                }
                var FollowUpDateString = $(value).find('.followUpDate').val();
                var followUpDate = new Date(FollowUpDateString);
                var IsLookUpString = $(value).find('.lookUpDate').val();
                var lookUpDate = new Date(IsLookUpString);
                // Check if the date is valid
                if (isNaN(lookUpDate.getTime())) {
                    lookUpDate = null; // Set it to null if the date is invalid
                }

                var RowNumberTake = index + 1;

                VisitorFollowupDetailsArray.push({
                    VisitorFollowUpId: null,
                    ContactPerson: $(value).find('.ContactPerson').val() || null,
                    FollowUpDate: followUpDate,
                    Comments: $(value).find('.Comments').val() || null,
                    IsLookUp: $(value).find('.isLookUp').is(":checked"),
                    LookUpDate: lookUpDate,
                    IsForwardOption: $(value).find('.isForwardOption').is(":checked"),
                    ForwardEmpId: $(value).find('.forwardEmpId').val(),
                    VisitorId: VisitorId,
                    RowNumber: RowNumberTake
                });

                $(value).find('.download-button').each(function () {
                    var dataIdName = $(this).find('i').data('id');
                    if (dataIdName) {
                        DyanamicAttachment.push({
                            RowNumber: RowNumberTake,
                            AttachmentFileName: dataIdName
                        });
                    }
                });

                $(value).find('.existselectedFiles li').each(function () {
                    var attachmentId = $(this).find('.delete-buttonattach').attr('attachmentid');
                    var moduleRefId = $(this).find('.delete-buttonattach').attr('modulerefid');
                    var filePath = $(this).find('.download-link').attr('href');
                    var fileName = $(this).find('.download-link').attr('download');

                    if (fileName && filePath) {
                        existFilesDyanamicAttachment.push({
                            VisitorAttachmentId: parseInt(attachmentId),
                            ModuleName: "Visitor",
                            ModuleRefId: parseInt(moduleRefId),
                            AttachmentFileName: fileName,
                            AttachmentFilePath: filePath,
                            AttachmentExactFileName: filePath,
                            RowNumber: RowNumberTake
                        });
                    }
                });
            });
        }

        debugger;

        formDataMultiple.append("UpdateVisitorDetailsStatic", JSON.stringify(UpdateVisitorDetailsStatic));
        formDataMultiple.append("VisitorFollowupDetailsArray", JSON.stringify(VisitorFollowupDetailsArray));
        formDataMultiple.append("DyanamicAttachment", JSON.stringify(DyanamicAttachment));
        formDataMultiple.append("ExistFilesDyanamicAttachment", JSON.stringify(existFilesDyanamicAttachment));
        formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
        formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

        $.ajax({
            type: "POST",
            url: "/Visitor/UpdateVisitor",
            data: formDataMultiple,
            contentType: false,
            processData: false,

            success: function (response) {
                if (response.status) {
                    Common.successMsg(response.message);
                    $('#InsertVisitorForm').modal('hide');
                    var FranchiseId = parseInt($("#UserFranchiseMappingId").val());

                    var fnData = Common.getDateFilter('dateDisplay2');
                    var EditDataId = { FranchiseId: parseInt(FranchiseId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
                    Common.ajaxCall("GET", "/Visitor/GetVisitor", EditDataId, VisitorSuccess, null);

                    $('#selectedFiles,#ExistselectedFiles').empty('');
                    existFiles = [];
                    formDataMultiple = new FormData();
                    $("#InsertVisitorDetails").css("width", "0%");
                    $('#fadeinpage').removeClass('fadeoverlay');
                    $('.Error-Showing-Lable').hide();
                }
                else {
                    Common.errorMsg(response.message);
                }
            },
            error: function (response) {
                Common.errorMsg(response.message);
            }
        });
    }
    else {
        return false;
    }

});

//$(document).on('click', '#VisitorLookUpDate', function () {
//    setMinDateForFollowUp();
//});

//function setMinDateForFollowUp() {
//    var lookupMinDate = $('#VisitorLookUpDate').val();

//    $('.followUpDate').each(function () {
//        $(this).attr('min', lookupMinDate);
//    });
//}


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
//=============================== attachment===================================================================================
var formDataMultiple = new FormData();

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const selectedFiles = document.getElementById('selectedFiles');
    selectedFiles.innerHTML = '';
    fileInput.addEventListener('change', (e) => {

        const files = e.target.files;
        for (var i = 0; i < files.length; i++) {
            formDataMultiple.append('files[]', files[i]);
        }

        if (files.length > 0) {
            preview.style.display = 'block';


            for (const file of files) {
                const fileItem = document.createElement('li');
                const fileName = document.createElement('span');
                const downloadButton = document.createElement('button');
                const deleteButton = document.createElement('button');
                downloadButton.innerHTML = '<i class="fas fa-download"></i>';
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                downloadButton.className = 'download-button';
                deleteButton.className = 'delete-button p-0';

                downloadButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const blob = new Blob([file]);
                    const blobURL = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobURL;
                    a.download = file.name;
                    a.click();
                    URL.revokeObjectURL(blobURL);
                });

                deleteButton.addEventListener('click', () => {
                    var itemName = $(fileItem).find('span').text();
                    var newFormData = new FormData();
                    $.each(formDataMultiple.getAll('files[]'), function (index, value) {
                        if (value.name !== itemName) {
                            newFormData.append('files[]', value);
                        }
                    });
                    formDataMultiple = newFormData;

                    fileItem.remove();
                });

                fileName.textContent = file.name.length > 10 ? file.name.substring(0, 11) + '...' : file.name;
                fileItem.appendChild(fileName);
                fileItem.appendChild(downloadButton);
                fileItem.appendChild(deleteButton);
                selectedFiles.appendChild(fileItem);
            }
        } else {
            preview.style.display = 'none';
        }
    });
});

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Visitor",
        ModuleRefId: parseInt(moduleRefId),
        AttachmentFileName: fileText,
        AttachmentFilePath: src
    });
    $(listItem).remove();
});
var deletedFiles = [];
var existFiles = [];
function getExistFiles() {

    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "Visitor",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

$(document).on('click', '.isLookUp', function () {
    var currentrow = $(this);
    if ($(this).prop('checked')) {
        $(currentrow).closest('.dynamicrow').find('.is-lookup3').removeAttr('style').css('display', 'block');
        $(currentrow).closest('.dynamicrow').find('.lookUpDate').val('');
        $(currentrow).closest('.dynamicrow').find('.lookUpDate').prop('required', true);
        $(currentrow).closest('.dynamicrow').find('.checkboxalign').css({ 'margin-bottom': '0px' });
    } else {
        $(currentrow).closest('.dynamicrow').find('.is-lookup3').removeAttr('style').css('display', 'none');
        $(currentrow).closest('.dynamicrow').find('.lookUpDate').prop('required', false);
        $(currentrow).closest('.dynamicrow').find('.checkboxalign').css({ 'margin-bottom': '8px' });
    }
});

$(document).on('click', '.isForwardOption', function () {
    Common.bindDropDownSuccess(ForwardEmpDropdownVal, 'ForwardEmpId1');
    var currentrow = $(this);
    if ($(this).prop('checked')) {
        $(currentrow).closest('.dynamicrow').find('.forward-option3').removeAttr('style').css('display', 'block');
        $(currentrow).closest('.dynamicrow').find('.forwardEmpId').val('');
        $(currentrow).closest('.dynamicrow').find('.forwardEmpId').prop('required', true);
    } else {
        $(currentrow).closest('.dynamicrow').find('.forward-option3').removeAttr('style').css('display', 'none');
        $(currentrow).closest('.dynamicrow').find('.forwardEmpId').prop('required', false);
    }
});

$(document).on('click', '.isForwardOption', function () {
    var currentrow = $(this);
    if ($(this).prop('checked')) {
        $(currentrow).closest('.originalRow').find('.forward-option3').removeAttr('style').css('display', 'block');
        $(currentrow).closest('.originalRow').find('.ForwardEmpId').val('');
        $(currentrow).closest('.originalRow').find('.ForwardEmpId').prop('required', true);
    } else {
        $(currentrow).closest('.originalRow').find('.forward-option3').removeAttr('style').css('display', 'none');
        $(currentrow).closest('.originalRow').find('.ForwardEmpId').prop('required', false);
    }
});

$(document).on('click', '.isLookUp', function () {
    var currentrow = $(this);
    if ($(this).prop('checked')) {
        $(currentrow).closest('.originalRow').find('.is-lookup3').removeAttr('style').css('display', 'block');
        $(currentrow).closest('.originalRow').find('.lookUpDate').val('');
        $(currentrow).closest('.originalRow').find('.lookUpDate').prop('required', true);
    } else {
        $(currentrow).closest('.originalRow').find('.is-lookup3').removeAttr('style').css('display', 'none');
        $(currentrow).closest('.originalRow').find('.lookUpDate').prop('required', false);
    }
});


$(document).on('click', '.isLookUpenq', function () {
    var currentrow = $(this);
    var parentDiv = $(currentrow).closest('.VisitorInsert');
    var insertDiv = parentDiv.find('#insertIsLookUp');

    if ($(this).prop('checked')) {
        parentDiv.find('.isLookUpenqdate').removeAttr('style').css('display', 'block');
        parentDiv.find('.isLookUp_enq').val('');
        parentDiv.find('.isLookUp_enq').prop('required', true);
        insertDiv.css('margin-top', '0px');
    } else {
        parentDiv.find('.isLookUpenqdate').removeAttr('style').css('display', 'none');
        parentDiv.find('.isLookUp_enq').prop('required', false);
        insertDiv.css('margin-top', '0px');
    }
});

$(document).on('click', '.IsForwardOptionVisitor', function () {
    var currentrow = $(this);
    var insertForward = $(currentrow).closest('.VisitorInsert').find('#insertForward');
    if ($(this).prop('checked')) {
        $(currentrow).closest('.VisitorInsert').find('.forward-option').removeAttr('style').css('display', 'block');
        $(currentrow).closest('.VisitorInsert').find('.ForwardOption_Visitor').val('');
        $(currentrow).closest('.VisitorInsert').find('.ForwardOption_Visitor').prop('required', true);
        insertForward.css('margin-top', '0px');
    } else {
        $(currentrow).closest('.VisitorInsert').find('.forward-option').removeAttr('style').css('display', 'none');
        $(currentrow).closest('.VisitorInsert').find('.ForwardOption_Visitor').prop('required', false);
        insertForward.css('margin-top', '0px');
    }
});
function checkboxchecked() {

    $('#VisitorLookUpDate').parent().hide();

    $('#VisitorIsLookUp').change(function () {
        if ($(this).is(':checked')) {
            $('#VisitorLookUpDate').parent().show();
            $('#queryTextarea').css('height', '95px');
        } else {
            $('#VisitorLookUpDate').parent().hide();
            $('#queryTextarea').css('height', '77px');
        }
    });

}

// Function to format date as dd-mm-yyyy
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

function validateInput(input) {
    input.value = input.value.replace(/\D/g, '');
    validateContactNumber(input);
}

function validateContactNumber(input) {
    const value = input.value;
    const errorElement = document.getElementById('ContactNumberError');

    if (/^\d{10}$/.test(value)) {
        errorElement.style.display = 'none';
    } else {
        errorElement.style.display = 'block';
    }
}

$(document).on("input", '#InsertVisitorForm #VisitorEmail', function (event) {
    if (Common.validateEmailwithErrorwithParent('InsertVisitorForm', 'VisitorEmail')) {
        $('#InsertVisitorForm #VisitorEmail-error').remove();
    }
});


function validateForm() {
    let isValid = true;

    if ($('#FollowUpDate').val() === "") {
        $('#FollowUpDate_ChosenError').show();
        isValid = false;
    } else {
        $('#FollowUpDate_ChosenError').hide();

    }

    if ($('#ContactPerson').val() === "" || $('#ContactPerson').val() === "0") {
        $('#ContactPerson_ChosenError').show();
        isValid = false;
    } else {
        $('#ContactPerson_ChosenError').hide();
    }
    return isValid;
}

let fileList = []; // Franchise selected files
function Attachment(Unique) {
    const fileInput = document.getElementById(`fileInput${Unique}`);
    const preview = document.getElementById('preview');
    const selectedFiles = document.getElementById(`selectedFiles${Unique}`);

    // Remove any existing event listener before adding a new one
    fileInput.replaceWith(fileInput.cloneNode(true));
    const newFileInput = document.getElementById(`fileInput${Unique}`);

    newFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);

        // Only add new files that are not already in the list
        files.forEach((file) => {
            if (!fileList.some(f => f.name === file.name)) {
                fileList.push(file);
                addFileToUI(file, selectedFiles);
                formDataMultiple.append('files[]', file); // Use 'file' directly
            }
        });

        preview.style.display = fileList.length > 0 ? 'block' : 'none';
    });
}

// Function to add file details to UI
function addFileToUI(file, selectedFiles) {
    const fileItem = document.createElement('li');
    const fileName = document.createElement('span');
    const downloadButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    fileName.textContent = file.name.length > 10 ? file.name.substring(0, 11) + '...' : file.name;


    downloadButton.type = 'button';
    deleteButton.type = 'button';

    downloadButton.innerHTML = `<i class="fas fa-download" data-id="${file.name}"></i>`;
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    downloadButton.className = 'download-button';
    deleteButton.className = 'delete-button';

    downloadButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const blob = new Blob([file]);
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(blobURL);
    });

    deleteButton.addEventListener('click', () => {
        fileList = fileList.filter(f => f.name !== file.name);
        fileItem.remove();

        let newFormData = new FormData();
        fileList.forEach(f => newFormData.append('files[]', f));

        formDataMultiple = newFormData;

        if (fileList.length === 0) {
            document.getElementById('preview').style.display = 'none';
        }
    });

    fileItem.appendChild(fileName);
    fileItem.appendChild(downloadButton);
    fileItem.appendChild(deleteButton);

    selectedFiles.appendChild(fileItem);
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


$('.accordion-header').on('click', function () {
    var $offcanvas = $(this).closest('.offcanvas-container');
    var $accordion = $(this).closest('.accordion');
    var target = $(this).find('a').attr('data-target');
    $offcanvas.find('.collapse').not(target).collapse('hide');
    $(target).collapse('toggle');
});


function validateFormAccordions(accordionSelector, errorMessageDefault = 'This field is required') {
    let isFormValid = true;
    let firstInvalidAccordion = null;

    $(accordionSelector).each(function () {
        const $accordion = $(this);
        const requiredFields = $accordion.find('input[required], select[required], textarea[required]');
        let isCurrentValid = true;

        requiredFields.each(function () {
            const $input = $(this);
            const value = $input.val() ? $input.val().trim() : '';
            const minLength = $input.attr('minlength');
            const maxLength = $input.attr('maxlength');
            let errorMessage = errorMessageDefault;
            let isInvalid = false;
            if (!value) {
                isInvalid = true;
                errorMessage = errorMessageDefault;
            } else if (minLength && value.length < parseInt(minLength)) {
                isInvalid = true;
                errorMessage = `Please enter at least ${minLength} characters.`;
            } else if (maxLength && value.length > parseInt(maxLength)) {
                isInvalid = true;
                errorMessage = `Please enter no more than ${maxLength} characters.`;
            }
            if (isInvalid) {
                $input.addClass('is-invalid error');
                $input.nextAll('.invalid-feedback, .error').remove();
                $input.after(`<div class="invalid-feedback d-none">${errorMessage}</div>`);
                isFormValid = isCurrentValid = false;

                if (!firstInvalidAccordion) firstInvalidAccordion = $accordion;
            } else {
                $input.removeClass('is-invalid error');
                $input.nextAll('.invalid-feedback, .error').remove();
            }
        });
        if (isCurrentValid) {
            $accordion.find('.collapse').collapse('hide');
        }
    });

    if (firstInvalidAccordion) {
        firstInvalidAccordion.find('.collapse').collapse('show');
    }

    return isFormValid;
}

function CanvasOpenFirstShowingVisitor() {
    $('#InsertVisitorDetails').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse3').collapse('hide');
    $('#InsertVisitorDetails .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#InsertVisitorDetails').offset().top
    }, 'fast');
}