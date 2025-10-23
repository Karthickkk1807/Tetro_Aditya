var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
var updatedData = [];

$(document).ready(function () {

    $('#TeamCheckInCheckOutCol').hide();
    $('#AdminCheckInCheckOutCol').hide();
    $('.mydatetimepicker').mdtimepicker();

    var todayDate = new Date().toISOString().split('T')[0];
    $("#ManualDate").val(todayDate).attr("max", todayDate);

    /*-----------------------Employee--------------------*/
    let currentDateEmployee = new Date();
    let currentMonthEmployee = currentDateEmployee.getMonth();
    let currentYearEmployee = currentDateEmployee.getFullYear();

    let displayedDateEmployee = new Date(currentYearEmployee, currentMonthEmployee);
    updateMonthDisplayEmployee(displayedDateEmployee);
    $('#EmployeeDatePicker #increment-month-btn2').hide();

    /*-----------------------Team--------------------*/
    let currentDateTeam = new Date();
    let currentMonthTeam = currentDateTeam.getMonth();
    let currentYearTeam = currentDateTeam.getFullYear();

    let displayedDateTeam = new Date(currentYearTeam, currentMonthTeam);
    $('#TeamDatePicker #increment-month-btn2').hide();

    /*-----------------------Admin--------------------*/
    let currentDateAdmin = new Date();
    let currentMonthAdmin = currentDateAdmin.getMonth();
    let currentYearAdmin = currentDateAdmin.getFullYear();

    let displayedDateAdmin = new Date(currentYearAdmin, currentMonthAdmin);
    $('#AdminDatePicker #increment-month-btn2').hide();

    /*------------------------------------------------------------------------------------------Employee-----------------------------------------------------------------------------------------*/
    $('#EmployeeDatePicker #increment-month-btn2').click(function () {
        displayedDateEmployee.setMonth(displayedDateEmployee.getMonth() + 1);
        updateMonthDisplayEmployee(displayedDateEmployee);

        if (displayedDateEmployee.getFullYear() === currentYearEmployee && displayedDateEmployee.getMonth() === currentMonthEmployee) {
            $('#EmployeeDatePicker #increment-month-btn2').hide();
        }
        EmployeeDataTaleBinding();
    });

    $('#EmployeeDatePicker #decrement-month-btn2').click(function () {
        displayedDateEmployee.setMonth(displayedDateEmployee.getMonth() - 1);
        updateMonthDisplayEmployee(displayedDateEmployee);
        $('#EmployeeDatePicker #increment-month-btn2').show();

        EmployeeDataTaleBinding();
    });

    $(document).on('change', '#EmployeeDatePicker #FromDate,#EmployeeDatePicker #ToDate', function () {
        var fromDate = $('#EmployeeDatePicker #FromDate').val();
        var toDate = $('#EmployeeDatePicker #ToDate').val();
        $('#EmployeeDatePicker #ToDate').attr('min', fromDate);

        if (fromDate != '' && toDate != '') {
            EmployeeDataTaleBinding();
        }
    });

    $(document).on('click', '#EmployeeDatePicker #bulkEmployee, #EmployeeDatePicker #downloadExcelBtn', function () {
        $('#EmployeeDatePicker #FromDate').val('');
        $('#EmployeeDatePicker #ToDate').val('');
        $('#EmployeeDatePicker #ToDate').removeAttr('max');
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        let displayedDate = new Date(currentYear, currentMonth);
        updateMonthDisplayEmployee(displayedDate);
        $('#EmployeeDatePicker #increment-month-btn2').hide();
        EmployeeDataTaleBinding();
    });

    $(document).on('click', '.datapiker .dropdown-item', function () {
        var selectedText = $(this).text().trim();
        var $parent = $(this).closest('.datapiker');

        var $bulkBtn = $parent.find('.Bulk-Action');
        var $icon = $bulkBtn.find('svg').first().clone(); // clone the clean svg

        // Replace button content safely
        $bulkBtn.html(''); // clear existing
        $bulkBtn.append($icon).append(' ' + selectedText);

        // Active class control
        $parent.find('.dropdown-item').removeClass('active');
        $(this).addClass('active');
        $parent.find('.dropdown-menu').removeClass('show');

        // Show/hide logic
        if (selectedText === "Custom") {
            $parent.find('#monthPickerCol').hide();
            $parent.find('#fromtodateCol').show();
        } else {
            $parent.find('#monthPickerCol').show();
            $parent.find('#fromtodateCol').hide();
        }
    });

    $(document).on('click', '#TeamDatePicker .dropdown-item', function () {
        var selectedText = $(this).text();
        $('#TeamDatePicker .Bulk-Action').text(selectedText);
        $('#TeamDatePicker .dropdown-menu .dropdown-item').removeClass('active');
        $(this).addClass('active');
        $('#TeamDatePicker .dropdown-menu').removeClass('show');

        if (selectedText == "Custom") {
            $('#TeamDatePicker #monthPickerCol').hide();
            $('#TeamDatePicker #fromtodateCol').show();
        } else {
            $('#TeamDatePicker #monthPickerCol').show();
            $('#TeamDatePicker #fromtodateCol').hide();
        }
    });

    $(document).on('click', '#AdminDatePicker .dropdown-item', function () {
        var selectedText = $(this).text();
        $('#AdminDatePicker .Bulk-Action').text(selectedText);
        $('#AdminDatePicker .dropdown-menu .dropdown-item').removeClass('active');
        $(this).addClass('active');
        $('#AdminDatePicker .dropdown-menu').removeClass('show');

        if (selectedText == "Custom") {
            $('#AdminDatePicker #monthPickerCol').hide();
            $('#AdminDatePicker #fromtodateCol').show();
        } else {
            $('#AdminDatePicker #monthPickerCol').show();
            $('#AdminDatePicker #fromtodateCol').hide();
        }
    });


    /*------------------------------------------------------------------------------------------Team-----------------------------------------------------------------------------------------*/

    $('#TeamDatePicker #increment-month-btn2').click(function () {
        displayedDateTeam.setMonth(displayedDateTeam.getMonth() + 1);
        updateMonthDisplayTeam(displayedDateTeam);
        if (displayedDateTeam.getFullYear() === currentYearEmployee && displayedDateTeam.getMonth() === currentMonthTeam) {
            $('#TeamDatePicker #increment-month-btn2').hide();
        }
        getAttendanceMyTeam();
    });

    $('#TeamDatePicker #decrement-month-btn2').click(function () {
        displayedDateTeam.setMonth(displayedDateTeam.getMonth() - 1);
        updateMonthDisplayTeam(displayedDateTeam);
        $('#TeamDatePicker #increment-month-btn2').show();
        getAttendanceMyTeam();
    });

    $(document).on('change', '#TeamDatePicker #FromDate,#TeamDatePicker #ToDate', function () {
        var fromDate = $('#TeamDatePicker #FromDate').val();
        var toDate = $('#TeamDatePicker #ToDate').val();
        $('#TeamDatePicker #ToDate').attr('min', fromDate);

        if (fromDate != '' && toDate != '') {
            getAttendanceMyTeam();
        }
    });

    $(document).on('click', '#TeamDatePicker #bulkEmployee, #TeamDatePicker #downloadExcelBtn', function () {
        $('#TeamDatePicker #FromDate').val('');
        $('#TeamDatePicker #ToDate').val('');
        $('#TeamDatePicker #ToDate').removeAttr('max');
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        let displayedDate = new Date(currentYear, currentMonth);
        updateMonthDisplayTeam(displayedDate);
        $('#TeamDatePicker #increment-month-btn2').hide();
        getAttendanceMyTeam();
    });

    /*------------------------------------------------------------------------------------------Admin-----------------------------------------------------------------------------------------*/

    $('#AdminDatePicker #increment-month-btn2').click(function () {
        displayedDateAdmin.setMonth(displayedDateAdmin.getMonth() + 1);
        updateMonthDisplayAdmin(displayedDateAdmin);
        if (displayedDateAdmin.getFullYear() === currentYearEmployee && displayedDateAdmin.getMonth() === currentMonthTeam) {
            $('#AdminDatePicker #increment-month-btn2').hide();
        }
        getAttendanceAdmin();
    });

    $('#AdminDatePicker #decrement-month-btn2').click(function () {
        displayedDateAdmin.setMonth(displayedDateAdmin.getMonth() - 1);
        updateMonthDisplayAdmin(displayedDateAdmin);
        $('#AdminDatePicker #increment-month-btn2').show();
        getAttendanceAdmin();
    });

    $(document).on('change', '#AdminDatePicker #FromDate,#AdminDatePicker #ToDate', function () {
        var fromDate = $('#AdminDatePicker #FromDate').val();
        var toDate = $('#AdminDatePicker #ToDate').val();
        $('#AdminDatePicker #ToDate').attr('min', fromDate);

        if (fromDate != '' && toDate != '') {
            getAttendanceAdmin();
        }
    });

    $(document).on('click', '#AdminDatePicker #bulkEmployee, #AdminDatePicker #downloadExcelBtn', function () {
        $('#AdminDatePicker #FromDate').val('');
        $('#AdminDatePicker #ToDate').val('');
        $('#AdminDatePicker #ToDate').removeAttr('max');
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        let displayedDate = new Date(currentYear, currentMonth);
        updateMonthDisplayAdmin(displayedDate);
        $('#AdminDatePicker #increment-month-btn2').hide();
        getAttendanceAdmin();
    });

    $(document).on('click', '#Mine-TabBtn', function () {
        $('#EmployeeCheckInCheckOutCol').show();
        $('#TeamCheckInCheckOutCol').hide();
        $('#AdminCheckInCheckOutCol').hide();
        $('#Labour-TabBtn').removeClass('active');
        $('#Permanent-TabBtn').addClass('active');
    });

    $(document).on('click', '#EmployeeView-TabBtn', function () {
        $('#TeamCheckInCheckOutCol').show();
        $('#EmployeeCheckInCheckOutCol').hide();
        $('#AdminCheckInCheckOutCol').hide();
        $('#Labour-TabBtn').removeClass('active');
        $('#Permanent-TabBtn').addClass('active');
        updateMonthDisplayTeam(displayedDateTeam);
        getAttendanceMyTeam();
        $('#loader-pms').show();
    });

    $(document).on('click', '#AdminView-TabBtn', function () {
        $('#EmployeeCheckInCheckOutCol').hide();
        $('#TeamCheckInCheckOutCol').hide();
        $('#AdminCheckInCheckOutCol').show();
        $('#Labour-TabBtn').removeClass('active');
        $('#Permanent-TabBtn').addClass('active');
        updateMonthDisplayAdmin(displayedDateAdmin);
        getAttendanceAdmin();
        $('#loader-pms').show();
    });

    Common.ajaxCall("GET", "/HumanResource/GetAttendanceInOut", null, GetInOutData, null);
    EmployeeDataTaleBinding();

    $(document).on('click', '.camimg', function () {
        $('#InOutImageModal').show();
        var filepath = $(this).attr('data-id');
        $('#DisplayedPreviewImage').html(`<img src="${filepath}" class="img-fluid" alt="Preview" />`);
    });

    $(document).on('click', '#InOutImageModal .close', function () {
        $('#InOutImageModal').hide();
    });

    var date = new Date();
    date.setDate(date.getDate() - 1);
    Common.ajaxCall("GET", "/HumanResource/GetAttendanceCheckList", { CheckListDate: date.toISOString() }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            if (data[0][0].CheckListDate == null) {
                $('#CheckListMessage').removeClass('d-none');
                //$('#toggleButton').attr('disabled', true);
                $('#toggleButton').css('background-color', 'rgb(172, 219, 172)');
                $('#Comments,#CheckListDate').val("");
            } else {
                $('#CheckListMessage').addClass('d-none');
                //$('#toggleButton').attr('disabled', false);
                $('#toggleButton').css('background-color', 'rgb(73, 180, 73)');
                $('#Comments,#CheckListDate').val("");
                var data = JSON.parse(response.data);
                $('#CheckListDate').val(data[0][0].CheckListDate);
                attendanceCheckListId = data[0][0].AttendanceCheckListId == null ? 0 : data[0][0].AttendanceCheckListId;
                $('#Comments').val(data[0][0].Comments);
            }
        }
    }, null);

    $(document).on('click', '#EditCheckList', function () {
        $('#CheckListModal').show();
        Common.removevalidation('FormCheckList');
        var today = new Date();
        today.setDate(today.getDate());
        var nextDay = today.toISOString().split('T')[0];
        $('#CheckListDate').attr('max', nextDay);
        $('#CheckListDate').val(nextDay);

        Common.ajaxCall("GET", "/HumanResource/GetAttendanceCheckList", { CheckListDate: today.toISOString() }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                if (data[0][0].CheckListDate != null) {
                    var today = new Date().toISOString().split('T')[0];
                    $('#CheckListDate').attr('max', today);
                    $('#CheckListDate').val(today);
                    var data = JSON.parse(response.data);
                    $('#CheckListDate').val(data[0][0].CheckListDate);
                    attendanceCheckListId = data[0][0].AttendanceCheckListId == null ? 0 : data[0][0].AttendanceCheckListId;
                    $('#Comments').val(data[0][0].Comments);
                    $('#SaveCheckList').text('Update').removeClass('btn-success').addClass('btn-update');
                }
                else
                    $('#SaveCheckList').text('Save').removeClass('btn-update').addClass('btn-success');
            }
        }, null);
    });

    $(document).on('click', '#CheckListModal .close', function () {
        $('#CheckListModal').hide();
    });

    $('#closeCameraBtn').click(function () {
        // Stop camera stream
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
        }

        // Hide camera container
        $('#cameraContainer').hide();
    });


    var attendanceCheckListId = 0;
    $('#CheckListDate').on('change', function () {
        if ($('#CheckListDate').val() != "") {
            var date = Common.stringToDateTime('CheckListDate');
            date.setDate(date.getDate() + 1);
            Common.ajaxCall("GET", "/HumanResource/GetAttendanceCheckList", { CheckListDate: date.toISOString() }, function (response) {
                if (response.status) {
                    $('#Comments').val("");
                    var data = JSON.parse(response.data);
                    if (data[0][0].CheckListDate != null) {
                        attendanceCheckListId = data[0][0].AttendanceCheckListId == null ? 0 : data[0][0].AttendanceCheckListId;
                        $('#Comments').val(data[0][0].Comments);
                        $('#SaveCheckList').text('Update').removeClass('btn-success').addClass('btn-update');
                    }
                    else
                        $('#SaveCheckList').text('Save').removeClass('btn-update').addClass('btn-success');
                    attendanceCheckListId = null;
                }

            }, null);
        }
    });


    $('#SaveCheckList').click(function () {
        if ($('#FormCheckList').valid()) {

            var commentsText = $('#Comments').val().trim();
            var wordCount = commentsText.split(/\s+/).filter(function (word) {
                return word.length > 0;
            }).length;

            if (wordCount < 50) {
                Common.warningMsg('Please enter at least 50 words in the Comments.');
                return;
            }
            var objvalue = {};
            let dateStr = $('#CheckListDate').val();
            let dateObj = new Date(dateStr);

            objvalue.AttendanceCheckListId = attendanceCheckListId == 0 ? null : attendanceCheckListId;
            objvalue.CheckListDate = dateObj;
            objvalue.Comments = Common.parseStringValue('Comments');
            Common.ajaxCall("POST", "/HumanResource/InsertAttendanceCheckList", JSON.stringify(objvalue), function (response) {
                if (response.status) {
                    Common.successMsg(response.message);
                    $('#CheckListModal').hide();
                    var date = new Date();
                    date.setDate(date.getDate() - 1);
                    Common.ajaxCall("GET", "/HumanResource/GetAttendanceCheckList", { CheckListDate: date.toISOString() }, function (response) {
                        if (response.status) {
                            var data = JSON.parse(response.data);
                            if (data[0][0].CheckListDate == null) {
                                $('#CheckListMessage').removeClass('d-none');
                                //$('#toggleButton').attr('disabled', true);
                                $('#toggleButton').css('background-color', 'rgb(172, 219, 172)');
                            } else {
                                $('#CheckListMessage').addClass('d-none');
                                //$('#toggleButton').attr('disabled', false);
                                $('#toggleButton').css('background-color', 'rgb(73, 180, 73)');
                            }
                        }
                    }, null);
                } else {
                    Common.errorMsg(response.message);
                }
            }, null);
        }
    });

    $(document).on('click', '#toggleButton', function () {
        $('#uploadAttendImage').click();
        sendData();
    });

    $('#uploadAttendImage').change(function () {
        var input = $(this)[0];
        if (input.files && input.files[0]) {
            var data = {
                Location: locationAddress,
                PunchTime: Common.getCurrentDateTime(),
                DocumentFilePath: $('#uploadAttendImage').get(0)?.files[0]?.name,
                PunchDate: Common.getCurrentDateTime(),
            };
            Common.ajaxCall("Post", "/HumanResource/InsertAttendanceEmployee", JSON.stringify(data), AttendanceInsertSuccess, null);
        }
    });

    $(document).on('click', '.btneye', function () {
        var button = this;
        var table = $(button).closest('table');
        var tableId = table.attr('id');
        EyeButtonView(button, '#' + tableId);
    });

    $('#CloseCanvas').click(function () {
        $("#attndanceCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('click', '#AddManual', function () {
        Common.ajaxCall("GET", "/HumanResource/GetManualAttendance", { PunchDate: Common.stringToDateTime('ManualDate').toISOString() }, getManualSuccess, null);
        $('#add_manualattend').modal('show');
    });

    $(document).on('change', '#ManualDate', function () {
        Common.ajaxCall("GET", "/HumanResource/GetManualAttendance", { PunchDate: Common.stringToDateTime('ManualDate').toISOString() }, getManualSuccess, null);
    });

    $(document).on('click', '.close', function () {
        $('#add_manualattend').modal('hide');
    });

    $('#add_manualattend #tableFilter').on('keyup', function () {
        Common.applyGridFilters("AttendanceManualTable");
    });

    $('#AttendanceManualTable').on('change', 'input.mydatetimepickerpunchIn,input.mydatetimepickerpunchOut', function () {
        var table = $('#AttendanceManualTable').DataTable();
        var cell = $(this);
        var row = table.row(cell.closest('tr'));
        var newDateValue = cell.val();
        var rowdata = row.data();

        var punchInData = cell.hasClass('mydatetimepickerpunchIn') ? cell.val() : "";
        var punchOutData = cell.hasClass('mydatetimepickerpunchOut') ? cell.val() : "";

        if (punchInData != null && punchInData.length > 0) {
            rowdata["PunchIn"] = punchInData;
        }
        if (punchOutData != null && punchOutData.length > 0) {
            rowdata["PunchOut"] = punchOutData;
        }
        if (updatedData != null && updatedData.length > 0) {
            var exist = updatedData.some(x => x.EmployeeId == rowdata.EmployeeId);
            if (exist) {
                updatedData = updatedData.filter(x => x.EmployeeId != rowdata.EmployeeId);
            }
            updatedData.push(rowdata);
        } else {
            updatedData.push(rowdata);
        }
    });


    $('#btnsaveadmin').on('click', function () {
        $('#loader-pms').show();
        var data = updatedData;
        if (data != null && data.length > 0) {
            var dataval = data.map(function (item) {
                return {
                    EmployeeId: item.EmployeeId,
                    PunchIn: item.PunchIn == "" ? null : item.PunchIn,
                    PunchOut: item.PunchOut == "" ? null : item.PunchOut
                };
            });

            var attendanceSaveRequest = {
                PunchDate: Common.stringToDateTime('ManualDate'),
                manualData: dataval
            };

            Common.ajaxCall("POST", "/HumanResource/InsertManualAttendance", JSON.stringify(attendanceSaveRequest), function (response) {
                if (response.status) {
                    Common.successMsg(response.message);
                    Common.ajaxCall("GET", "/HumanResource/GetManualAttendance", { PunchDate: Common.stringToDateTime('ManualDate').toISOString() }, getManualSuccess, null);
                    $('#loader-pms').hide();
                    getAttendanceAdmin();
                }
                else {
                    Common.errorMsg(response.message);
                    $('#loader-pms').hide();
                }
            }, null);
        }
        else {
            $('#loader-pms').hide();
            Common.warningMsg("There are no changes to update.");
        }
    });

    $('#Permanent-TabBtn').click(function () {
        $('#tableFilterEmployee').val('');
        $('#tableFilterEmployee').val('');
        $('#downloadExcelBtn').trigger('click');
        $('#Labour-TabBtn').removeClass('active');
        $('#Permanent-TabBtn').addClass('active');
        getAttendanceAdmin();
    });

    $('#Labour-TabBtn').click(function () {
        $('#tableFilterEmployee').val('');
        $('#Permanent-TabBtn').removeClass('active');
        $('#Labour-TabBtn').addClass('active');
        $('#downloadExcelBtn').trigger('click');
        getAttendanceAdmin();
    });

    var attendanceCheckListId = 0;
    $('#CheckListDate').on('change', function () {
        if ($('#CheckListDate').val() != "") {
            var date = Common.stringToDateTime('CheckListDate');
            date.setDate(date.getDate() + 1);
            Common.ajaxCall("GET", "/HumanResource/GetAttendanceCheckList", { CheckListDate: date.toISOString() }, function (response) {
                if (response.status) {
                    $('#Comments').val("");
                    var data = JSON.parse(response.data);
                    if (data[0][0].CheckListDate != null) {
                        attendanceCheckListId = data[0][0].AttendanceCheckListId == null ? 0 : data[0][0].AttendanceCheckListId;
                        $('#Comments').val(data[0][0].Comments);
                        $('#SaveCheckList').text('Update').removeClass('btn-success').addClass('btn-update');
                    }
                    else
                        $('#SaveCheckList').text('Save').removeClass('btn-update').addClass('btn-success');
                    attendanceCheckListId = null;
                }

            }, null);
        }
    });
});

function getManualSuccess(response) {
    if (response.status) {
        $('#loader-pms').show();
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[0], ['EmployeeId', 'EmployeeImage', 'Status_Colour', 'Date', 'TetroONEnocount']);
        bindTableManual('AttendanceManualTable', data[0], columns, '260px');
        $('.mydatetimepickerpunchIn,.mydatetimepickerpunchOut').mdtimepicker();
        $('#add_manualattend').modal('show');
        $('#loader-pms').hide();
    }
}

function getAttendanceMyTeam() {

    var text = $('#TeamDatePicker #dropdownMenuButton2').text();
    var fromDate;
    var toDate;
    if (text == "Custom") {
        var fromDate = $('#TeamDatePicker #FromDate').val();
        $('#TeamDatePicker #ToDate').attr('min', fromDate);

        var dateObject = new Date(fromDate);
        dateObject.setDate(dateObject.getDate() - 1);

        var toDate = $('#TeamDatePicker #ToDate').val();
        var todateObject = new Date(toDate);

        fromDate = dateObject.toISOString();
        toDate = todateObject.toISOString();
    } else {
        var dateText = $("#TeamDatePicker #dateDisplay2").text();

        var parts = dateText.split(" ");
        var month = parts[0];
        var year = parts[1];

        var startDate = null;
        var endDate = null;

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthIndex = monthNames.indexOf(month);
        if (monthIndex !== -1) {

            startDate = new Date(year, monthIndex, 1);
            fromDate = startDate.toISOString();

            if (!isNaN(startDate.getTime())) {

                var currentDate = new Date();

                if (startDate.getMonth() === currentDate.getMonth() && startDate.getFullYear() === currentDate.getFullYear()) {
                    endDate = currentDate;
                    toDate = endDate.toISOString();
                } else {
                    endDate = new Date(year, monthIndex + 1, 0);
                    endDate.setDate(endDate.getDate() + 1);
                    toDate = endDate.toISOString();
                }
            }
        }
    }

    Common.ajaxCall("GET", "/HumanResource/GetAttendanceMyTeam", { EmployeeId: null, FromDate: fromDate, ToDate: toDate, PunchDate: null }, attendanceTeamSuccess, null);
}
 
function EmployeeDataTaleBinding() {

    var text = $('#EmployeeDatePicker #dropdownMenuButton2').text();
    var fromDate;
    var toDate;
    if (text == "Custom") {
        var fromDate = $('#EmployeeDatePicker #FromDate').val();
        $('#EmployeeDatePicker #ToDate').attr('min', fromDate);

        var dateObject = new Date(fromDate);
        dateObject.setDate(dateObject.getDate() - 1);

        var toDate = $('#EmployeeDatePicker #ToDate').val();
        var todateObject = new Date(toDate);

        fromDate = dateObject.toISOString();
        toDate = todateObject.toISOString();
    } else {
        var dateText = $("#EmployeeDatePicker #dateDisplay2").text();

        var parts = dateText.split(" ");
        var month = parts[0];
        var year = parts[1];

        var startDate = null;
        var endDate = null;

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthIndex = monthNames.indexOf(month);
        if (monthIndex !== -1) {

            startDate = new Date(year, monthIndex, 1);
            fromDate = startDate.toISOString();

            if (!isNaN(startDate.getTime())) {

                var currentDate = new Date();

                if (startDate.getMonth() === currentDate.getMonth() && startDate.getFullYear() === currentDate.getFullYear()) {
                    endDate = currentDate;
                    toDate = endDate.toISOString();
                } else {
                    endDate = new Date(year, monthIndex + 1, 0);
                    endDate.setDate(endDate.getDate() + 1);
                    toDate = endDate.toISOString();
                }
            }
        }
    }
    Common.ajaxCall("GET", "/HumanResource/GetAttendanceEmployee", { EmployeeId: null, FromDate: fromDate, ToDate: toDate, PunchDate: null }, attendanceEmployeeSuccess, null);
}

function getAttendanceAdmin() {
    var text = $('#AdminDatePicker #dropdownMenuButton2').text();
    var fromDate;
    var toDate;
    if (text == "Custom") {
        var fromDate = $('#AdminDatePicker #FromDate').val();
        $('#AdminDatePicker #ToDate').attr('min', fromDate);

        var dateObject = new Date(fromDate);
        dateObject.setDate(dateObject.getDate() - 1);

        var toDate = $('#AdminDatePicker #ToDate').val();
        var todateObject = new Date(toDate);

        fromDate = dateObject.toISOString();
        toDate = todateObject.toISOString();
    } else {
        var dateText = $("#AdminDatePicker #dateDisplay2").text();

        var parts = dateText.split(" ");
        var month = parts[0];
        var year = parts[1];

        var startDate = null;
        var endDate = null;

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthIndex = monthNames.indexOf(month);
        if (monthIndex !== -1) {

            startDate = new Date(year, monthIndex, 1);
            fromDate = startDate.toISOString();

            if (!isNaN(startDate.getTime())) {

                var currentDate = new Date();

                if (startDate.getMonth() === currentDate.getMonth() && startDate.getFullYear() === currentDate.getFullYear()) {
                    endDate = currentDate;
                    toDate = endDate.toISOString();
                } else {
                    endDate = new Date(year, monthIndex + 1, 0);
                    endDate.setDate(endDate.getDate() + 1);
                    toDate = endDate.toISOString();
                }
            }
        }
    }

    var employeeTypeId = 0;
    if ($('#Permanent-TabBtn').hasClass('active')) {
        employeeTypeId = 1;
    } else if ($('#Labour-TabBtn').hasClass('active')) {
        employeeTypeId = 2;
    }
    Common.ajaxCall("GET", "/HumanResource/GetAttendanceAdmin", { EmployeeId: null, FromDate: fromDate, ToDate: toDate, EmployeeTypeId: employeeTypeId, PunchDate: null }, attendanceAdminSuccess, null);
}

function AttendanceLog(key, employeeId) {
    var fnData = Common.getDateFilter('dateDisplay2');
    var employeeTypeId = 0;
    if ($('#Permanent-TabBtn').hasClass('active')) {
        employeeTypeId = 1;
    } else if ($('#Labour-TabBtn').hasClass('active')) {
        employeeTypeId = 2;
    }
    Common.ajaxCall("GET", "/HumanResource/GetAttendanceAdmin", { EmployeeId: employeeId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), EmployeeTypeId: employeeTypeId, PunchDate: key }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            $('#EmployeeName').text(data[0][0].EmployeeName)
            $('#PunchDate').text(data[0][0].PunchDate)
            $('#EmployeeCompanyId').text(data[0][0].EmployeeCompanyId)
            $('#TotalHours').text(data[0][0].TotalHours)
            $('#WorkingHours').text(data[0][0].WorkingHours)

            $('#Todayactivity').empty('');
            if (data[1][0].PunchIn != null && data[1][0].PunchIn != "") {
                data[1].forEach(function (attendData) {
                    if (attendData.PunchIn !== null && attendData.PunchIn !== "") {
                        var Inhtml = `<li class="list1">
										<div class="row">
											<div class="col-6">
												<p class="text-dark">Punch In</p>
												<p class="res-activity-time">
													<i class="fa fa-clock-o"></i> <label>${attendData.PunchIn}</label>
												</p>
											</div>
											<div class="col-4">
                                           ${attendData.InLocation != null ? `<img src="/assets/commonimages/map-pin.svg" width="20px"><p class="text-dark">${attendData.InLocation}</p>` : ''}
                                             </div>
                                        ${!!(attendData.DocumentFilePath && attendData.DocumentFilePath.trim()) ? `
                                      <div class="col-2">
                                          <img  data-id="${attendData.DocumentFilePath}"  class="camimg" src="/assets/commonimages/camera.svg" width="20px">
                                      </div>` : ``}
										</div>
									</li>`;
                        $('#Todayactivity').append(Inhtml);
                    }
                    if (attendData.PunchOut !== null && attendData.PunchOut !== "") {
                        var Outhtml = `<li class="list2">
										<div class="row">
											<div class="col-6">
												<p class="text-dark">Punch Out</p>
												<p class="res-activity-time">
													<i class="fa fa-clock-o"></i> <label>${attendData.PunchOut}</label>
												</p>
											</div>
											<div class="col-4">
                                           ${attendData.OutLocation != null ? `<img src="/assets/commonimages/map-pin.svg" width="20px"><p class="text-dark">${attendData.OutLocation}</p>` : ''}
                                            </div>
                                               ${!!(attendData.DocumentFilePath && attendData.DocumentFilePath.trim()) ? `
                                     <div class="col-2">
                                         <img data-id="${attendData.DocumentFilePath}" class="camimg" src="/assets/commonimages/camera.svg" width="20px">
                                     </div>` : ``}
										</div>
									</li>`;

                        $('#Todayactivity').append(Outhtml);
                    }
                });

            } else {
                $('#Todayactivity').append(`<div><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;"> No Data</div>`);
            }



            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $("#attndanceCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#attndanceCanvas").css("width", "50%");
            } else {
                $("#attndanceCanvas").css("width", "33%");
            }
            $('#fadeinpage').addClass('fadeoverlay');
        }
    }, null);
}
 
function attendanceAdminSuccess(response) {
    if (response.status) {
        if (response.status) {
            var data = JSON.parse(response.data);
            var AttendanceCounterBox = Object.keys(data[0][0]);

            $("#AdminCounterTextBox1").text(AttendanceCounterBox[0]);
            $("#AdminCounterTextBox2").text(AttendanceCounterBox[1]);
            $("#AdminCounterTextBox3").text(AttendanceCounterBox[2]);
            $("#AdminCounterTextBox4").text(AttendanceCounterBox[3]);

            $('#AdminCounterValBox1').text(data[0][0][AttendanceCounterBox[0]]);
            $('#AdminCounterValBox2').text(data[0][0][AttendanceCounterBox[1]]);
            $('#AdminCounterValBox3').text(data[0][0][AttendanceCounterBox[2]]);
            $('#AdminCounterValBox4').text(data[0][0][AttendanceCounterBox[3]]);

            $('#loader-pms').hide();

            var columns = Common.bindColumn(data[1], ['EmployeeId', 'EmployeeImage']);
            function customSort(a, b) {
                if (!isNaN(parseInt(a.data)) && !isNaN(parseInt(b.data))) {
                    return parseInt(a.data) - parseInt(b.data);
                }

                if (a.data === 'EmployeeName') return -1;
                if (b.data === 'EmployeeName') return 1;
                return a.data.localeCompare(b.data);
            }

            columns.sort(customSort);

            var fnData = Common.getDateFilter('dateDisplay2');
            var date = {
                "startDate": fnData.startDate,
                "endDate": fnData.endDate,
            }
            var endMonth = date.endDate.getMonth();
            var currentMonth = new Date();
            var cMonth = currentMonth.getMonth();
            var scrollType = false;
            if (endMonth == cMonth) {
                scrollType = true;
            }
            bindTableAttendanceImage('AdminTable', data[1], columns, scrollType, 'EmployeeId', '389px', false);
        }

    }
}


function attendanceTeamSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var AttendanceCounterBox = Object.keys(data[0][0]);

        //$("#TeamCounterTextBox1").text(AttendanceCounterBox[0]);
        //$("#TeamCounterTextBox2").text(AttendanceCounterBox[1]);
        //$("#TeamCounterTextBox3").text(AttendanceCounterBox[2]);
        //$("#TeamCounterTextBox4").text(AttendanceCounterBox[3]);

        //$('#TeamCounterValBox1').text(data[0][0][AttendanceCounterBox[0]]);
        //$('#TeamCounterValBox2').text(data[0][0][AttendanceCounterBox[1]]);
        //$('#TeamCounterValBox3').text(data[0][0][AttendanceCounterBox[2]]);
        //$('#TeamCounterValBox4').text(data[0][0][AttendanceCounterBox[3]]);

        $("#TeamCounterTextBox1").text('Total');
        $("#TeamCounterTextBox2").text('Present');
        $("#TeamCounterTextBox3").text('Absent');
        $("#TeamCounterTextBox4").text('OverTime');

        $('#TeamCounterValBox1').text('60');
        $('#TeamCounterValBox2').text('52');
        $('#TeamCounterValBox3').text('8');
        $('#TeamCounterValBox4').text('0');

        $('#loader-pms').hide();
        var columns = Common.bindColumn(data[1], ['EmployeeId', 'Status_Colour', 'EmployeeTypeId','EODStatus_Colour']);
        bindTable('TeamTable', data[1], columns, -1, '380px', true);

    }
}


function attendanceEmployeeSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var AttendanceCounterBox = Object.keys(data[0][0]);

        $("#EmployeeCounterTextBox1").text(AttendanceCounterBox[0]);
        $("#EmployeeCounterTextBox2").text(AttendanceCounterBox[1]);
        $("#EmployeeCounterTextBox3").text(AttendanceCounterBox[2]);
        $("#EmployeeCounterTextBox4").text(AttendanceCounterBox[3]);

        $('#EmployeeCounterValBox1').text(data[0][0][AttendanceCounterBox[0]]);
        $('#EmployeeCounterValBox2').text(data[0][0][AttendanceCounterBox[1]]);
        $('#EmployeeCounterValBox3').text(data[0][0][AttendanceCounterBox[2]]);
        $('#EmployeeCounterValBox4').text(data[0][0][AttendanceCounterBox[3]]);

        $('#loader-pms').hide();
        var columns = Common.bindColumn(data[1], ['EmployeeId', 'Status_Colour', 'EmployeeTypeId','EODStatus_Colour']);
        bindTable('EmployeeTable', data[1], columns, -1, '386px', true);
    }
}

function GetInOutData(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[0][0].PunchInAt != null && data[0][0].PunchInAt != "") {
            $('#PunchInAt').html(data[0][0].PunchInAt).css('color', '#575962');
        } else {
            $('#PunchInAt').html('Yet To CheckIn').css('color', 'red');
        }
        var breakAndOvertime = Object.keys(data[2][0]);

        $("#BreakTimeText").text(breakAndOvertime[0]);
        $("#OverTimeText").text(breakAndOvertime[1]);

        $('#BreakTimeVal').text(data[2][0][breakAndOvertime[0]] == null ? "00:00 Hrs" : data[2][0][breakAndOvertime[0]]);
        $('#OverTimeVal').text(data[2][0][breakAndOvertime[1]] == null ? "00:00 Hrs" : data[2][0][breakAndOvertime[1]]);

        var checkincheckoutdata = data[1];

        if (checkincheckoutdata != null && checkincheckoutdata.length > 0) {
            if (checkincheckoutdata.length == 1 && (checkincheckoutdata[0].PunchIn == null || checkincheckoutdata[0].PunchIn == undefined)
                && (checkincheckoutdata[0].PunchOut == null || checkincheckoutdata[0].PunchOut == undefined)
                && (checkincheckoutdata[0].tetropaynocount == null || checkincheckoutdata[0].tetropaynocount == undefined)) {
                return;
            };

            var hours = "";
            var minutes = "";
            var seconds = "";

            const todayRecord = data[0];
            var result = {};
            if (checkincheckoutdata.length == 1 && (checkincheckoutdata[0].PunchOut == null || checkincheckoutdata[0].PunchOut.length == 0)) {

                var ProductionHourTime = "";
                ProductionHourTime = todayRecord[0].Production.split(':');
                result.hours = parseInt(ProductionHourTime[0]);
                result.minutes = parseInt(ProductionHourTime[1]);
                result.seconds = parseInt(ProductionHourTime[2].split(' '));

                localStorage.setItem('hasCheckedIn', 'true');
                hasCheckedIn = true;
                $('#timerBorder').css('border', '5px solid #55ce63');
            }
            else if (checkincheckoutdata.length > 0) {

                var lastItem = checkincheckoutdata[checkincheckoutdata.length - 1];//Get the last record

                if (todayRecord != null && todayRecord.length > 0 && todayRecord[0] != null && todayRecord[0] != "") {
                    var ProductionHourTime = "";
                    ProductionHourTime = todayRecord[0].Production.split(':');
                    hours = parseInt(ProductionHourTime[0]);
                    minutes = parseInt(ProductionHourTime[1]);
                    seconds = parseInt(ProductionHourTime[2].split(' '));
                }

                //PunchIn & PunchOut - Again PunchIn Only
                if (lastItem != null && lastItem.PunchOut == null || lastItem.PunchOut.length == 0) {
                    result.hours = hours;
                    result.minutes = minutes;
                    result.seconds = seconds;

                    localStorage.setItem('hasCheckedIn', 'true');
                    hasCheckedIn = true;
                    $('#timerBorder').css('border', '5px solid #55ce63');
                }
                //Punch In & PunchOut Only
                else if (lastItem != null && lastItem.PunchOut != null || lastItem.PunchOut.length > 0) {
                    result.hours = hours;
                    result.minutes = minutes;
                    result.seconds = seconds;
                    localStorage.setItem('hasCheckedIn', 'false');
                    hasCheckedIn = false;
                    $('#timerBorder').css('border', '5px solid #ff0000');
                }
            }

            var elapsedTimeInMilliseconds = (result.hours * 3600 + result.minutes * 60 + result.seconds) * 1000;
            localStorage.setItem('totalElapsedTime', elapsedTimeInMilliseconds);
            totalElapsedTime = elapsedTimeInMilliseconds;


            if (localStorage.getItem('hasCheckedIn') === 'true') {
                hasCheckedIn = true;
                totalElapsedTime = parseInt(localStorage.getItem('totalElapsedTime'), 10) || 0;
                if (hasCheckedIn) {
                    startTimer();
                    updateToggleButton("Check-Out", "rgb(231, 15, 15)");
                    $('.punch-info .punch-hours').css('border-color', '#37f53d');
                }
            } else {
                totalElapsedTime = parseInt(localStorage.getItem('totalElapsedTime'), 10) || 0;
                localStorage.setItem('hasCheckedIn', 'false');
                isTimerRunning = false;
                updateToggleButton("Check-In", "rgb(73, 180, 73)");
                $('.punch-info .punch-hours').css('border-color', 'red');
                updateTimerDisplay();
            }
        }
    }
}

function sendData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const geocoder = new google.maps.Geocoder();
            const latlng = new google.maps.LatLng(latitude, longitude);

            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    let area = '';
                    let state = '';
                    results[0].address_components.forEach(comp => {
                        if (comp.types.includes('locality') || comp.types.includes('sublocality')) {
                            area = comp.long_name;
                        }
                        if (comp.types.includes('administrative_area_level_1')) {
                            state = comp.long_name;
                        }
                    });
                    locationAddress = area + ', ' + state;
                } else {
                    locationAddress = null;
                }
            });
        }, function () {
            locationAddress = null;
        });
    } else {
        locationAddress = null;
    }
}

function AttendanceInsertSuccess(response) {
    if (response.status) {
        Common.ajaxCall("GET", "/HumanResource/GetAttendanceInOut", null, GetInOutData, null);
        var imageguid = "";
        imageguid = response.data;
        var fileUpload = $("#uploadAttendImage").get(0);
        var files = fileUpload.files;
        Common.fileupload(files, imageguid, null);
        Common.successMsg(response.message);
        getAttendanceEmployee();

    } else {
        Common.errorMsg(response.message);
    }
}

let timerInterval;
let startTime;
let totalElapsedTime = 0;
let isTimerRunning = false;
let hasCheckedIn = false;
var locationAddress = null;

function toggleTimer() {
    if (hasCheckedIn) {
        if (!isTimerRunning) {
            startTimer();
            updateToggleButton("Check-Out", "rgb(231, 15, 15)");
            $('.punch-info .punch-hours').css('border-color', '#37f53d');
        } else {
            pauseTimer();
            checkOut();
            updateToggleButton("Check-In", "rgb(73, 180, 73)");
            $('.punch-info .punch-hours').css('border-color', 'red');
        }
    } else {
        checkIn();
        updateToggleButton("Check-Out", "rgb(231, 15, 15)");
        $('.punch-info .punch-hours').css('border-color', '#37f53d');
    }
}

function startTimer() {
    startTime = Date.now() - totalElapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
    isTimerRunning = true;
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    totalElapsedTime = Date.now() - startTime;
    localStorage.setItem('totalElapsedTime', totalElapsedTime);
}

function checkIn() {
    hasCheckedIn = true;
    localStorage.setItem('hasCheckedIn', 'true');
    totalElapsedTime = 1000;
    startTimer();
}

function checkOut() {
    hasCheckedIn = false;
    localStorage.setItem('hasCheckedIn', 'false');
    isTimerRunning = false;
    localStorage.setItem('totalElapsedTime', totalElapsedTime);
    updateToggleButton("Check-In", "rgb(73, 180, 73)");
    $('.punch-info .punch-hours').css('border-color', 'red');
}

function updateToggleButton(text, backgroundColor) {
    const button = $("#toggleButton");
    button.text(text);
    button.css("background-color", backgroundColor);
}

function updateTimer() {
    if (hasCheckedIn == true) {
        totalElapsedTime = Date.now() - startTime;
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    const formattedTime = formatTime(totalElapsedTime);
    $("#timer").text(formattedTime);
}

function resetTimer() {
    totalElapsedTime = 0;
    localStorage.setItem('totalElapsedTime', '0');
    updateTimerDisplay();
}

function formatTime(timeInMillis) {
    const seconds = Math.floor(timeInMillis / 1000) % 60;
    const minutes = Math.floor(timeInMillis / 1000 / 60) % 60;
    const hours = Math.floor(timeInMillis / 1000 / 60 / 60);
    return `${formatDigit(hours)}:${formatDigit(minutes)}:${formatDigit(seconds)}`;
}

function formatDigit(digit) {
    return digit.toString().padStart(2, '0');
}

function getCalculatedHour(inputTime) {
    var hours = "";
    var minutes = "";
    var seconds = "";

    var today = new Date();
    var todayyear = today.getFullYear();
    var todaymonth = today.getMonth() + 1;
    var todayday = today.getDate();

    var formattedDate = todayyear + "-" + (todaymonth < 10 ? '0' : '') + todaymonth + "-" + (todayday < 10 ? '0' : '') + todayday;

    var checkInTime = formattedDate + " " + inputTime;

    var checkInDate = new Date(checkInTime);

    //CrossDays
    if (checkInDate > today) {
        checkInDate.setDate(checkInDate.getDate() - 1);
    }

    var currentDate = new Date();

    var timeDiff = currentDate - checkInDate;

    hours = Math.floor(timeDiff / (1000 * 60 * 60));
    timeDiff %= 1000 * 60 * 60;
    minutes = Math.floor(timeDiff / (1000 * 60));
    timeDiff %= 1000 * 60;
    seconds = Math.floor(timeDiff / 1000);

    return {
        "hours": hours, "minutes": minutes, "seconds": seconds
    }
}



/*====================================================================EmployeeAvailability=============================================================*/

var dateTable = "";
var TypeDropdown = [];

$(document).on('click', '#AddAvailability', function () {
    $('#HideMainInputAvailability').show();
    $('#SaveAvailibity').text('Save');
    $('#SaveAvailibity').removeClass('btn-update').addClass('btn-success');
    $('#FormAvailability').empty('');
    duplicateRow();
    $('#AddAvailability').hide();
    dateTable = "";
    var nextDay = new Date().toISOString().split('T')[0];
    $('#AvailabilityDate').attr('min', nextDay).val(nextDay);
});

$(document).on('click', '#CancelAvailibity', function () {
    $('#HideMainInputAvailability').hide();
    $('#SaveAvailibity').text('Save');
    $('#SaveAvailibity').removeClass('btn-update').addClass('btn-success');
    $('#FormAvailability').empty('');
    dateTable = "";
    var nextDay = new Date().toISOString().split('T')[0];
    $('#AvailabilityDate').attr('min', nextDay).val(nextDay);
});

$(document).on('click', '#Availability', async function () {
    Common.ajaxCall("GET", "/HumanResource/GetAvailability", { Date: null }, AvailabilitySuccess, null);
    $('#AvailabilityModal').show();
    $('#HideMainInputAvailability').show();
    $('#AddAvailability').hide();
    $('#FormAvailability').empty('');
    $('.searchbar__input').val('');
    $('#SaveAvailibity').text('Save');
    $('#SaveAvailibity').removeClass('btn-update').addClass('btn-success');
    var nextDay = new Date().toISOString().split('T')[0];
    $('#AvailabilityDate').attr('min', nextDay).val(nextDay);
    var AvailabilityTypeData = await Common.bindDropDownSync('AvailabilityType');
    TypeDropdown = JSON.parse(AvailabilityTypeData);
    dateTable = "";
});

$(document).on('click', '#closeAvailabilityModal', function () {
    $('#AvailabilityModal').hide();
    $('#FormAvailability').empty('');
    dateTable = "";
});

$(document).on('click', '#SaveAvailibity', function () {
    if ($("#FormAvailability").valid()) {
        //var DataClientStatic1 = JSON.parse(JSON.stringify(jQuery('#FormClient').serializeArray()));
        var objvalue = {};
        var AvailabilityDetails = [];
        var ClosestDiv = $('#FormAvailability .AvailabilityDynamic');
        $.each(ClosestDiv, function (index, values) {
            var EmployeeAvailabilityId = $(values).find('.EmployeeAvailabilityId').data('id');
            var employeeId = parseInt(EmployeeId);
            var AvailabilityDate = $('#AvailabilityDate').val();
            var Type = $(values).find('.Type').val();
            var Description = $(values).find('.Description').val();
            var StartTime = $(values).find('.StartTime').val();
            var EndTime = $(values).find('.EndTime').val();
            AvailabilityDetails.push({
                EmployeeAvailabilityId: parseInt(EmployeeAvailabilityId) || null,
                EmployeeId: employeeId,
                Date: AvailabilityDate,
                AvailabilityTypeId: Type,
                Description: Description,
                StartTime: StartTime,
                EndTime: EndTime
            });
        });
        objvalue.employeeAvailabilityDetails = AvailabilityDetails;
        Common.ajaxCall("POST", "/HumanResource/UpdateAvailability", JSON.stringify(objvalue), ProductEmployeeAvailabilityIdUpdateSuccess, null);
    }
});

$(document).on('click', '#AvailabilityTable .btn-edit', async function () {
    dateTable = $(this).closest('tr').find('td').eq(0).text().trim();
    var data = dateTable
    var split1 = data.split('-')[0];
    var split2 = data.split('-')[1];
    var split3 = data.split('-')[2];
    var formattedDate = split3 + "-" + split2 + "-" + split1;
    Common.ajaxCall("GET", "/HumanResource/GetAvailability", { Date: formattedDate }, getNotNullAvalibility, null);
});

$(document).on('click', '#AvailabilityTable .btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        EmployeeAvailabilityId = $(this).data('id');
        Common.ajaxCall("GET", "/HumanResource/DeleteAvailability", { EmployeeAvailabilityId: EmployeeAvailabilityId }, ProductEmployeeAvailabilityIdUpdateSuccess, null);
    }
});

function ProductEmployeeAvailabilityIdUpdateSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#HideMainInputAvailability').hide();
        $('#FormAvailability').empty('');
        Common.ajaxCall("GET", "/HumanResource/GetAvailability", { Date: null }, AvailabilitySuccess, null);
        dateTable = "";
    }
}

function AvailabilitySuccess(response) {
    if (response.status) {
        if (response.status) {
            var data = JSON.parse(response.data);
            var columns = Common.bindColumn(data[0], ['EmployeeAvailabilityId']);
            bindTableAvailability('AvailabilityTable', data[0], columns, -1, 'EmployeeAvailabilityId', '145px', true);
            $('#AddAvailability').hide();
            $('#HideMainInputAvailability').show();
            $('#FormAvailability').empty('');
            $('#SaveAvailibity').text('Save').removeClass('btn-update').addClass('btn-success');
            duplicateRow();
            var nextDay = new Date().toISOString().split('T')[0];
            $('#AvailabilityDate').attr('min', nextDay).val(nextDay);
        }
    }
}

$(document).on('change', '.StartTime', function () {
    var thisVal = $(this).val();
    var $row = $(this).closest('.AvailabilityDynamic');
    var $endTimePicker = $row.find('.EndTime');
    $endTimePicker.val('');
    var endTimePlugin = $endTimePicker.data('mdtimepicker');
    if (endTimePlugin) {
        endTimePlugin.setMinTime(thisVal);
        $endTimePicker.val(thisVal);
    }
});

function getNotNullAvalibility(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        $('#HideMainInputAvailability').show();
        $('#SaveAvailibity').text('Update');
        $('#SaveAvailibity').removeClass('btn-success').addClass('btn-update');
        $('#FormAvailability').empty('');

        data[0].forEach(function (value, index) {
            let numberIncr = Math.random().toString(36).substring(2);
            var rowadd = $('.AvailabilityDynamic').length;
            var DynamicLableNo = rowadd + 1;
            var TypeSelectOptions = "";
            var defaultOption = '<option value="">--Select--</option>';

            var date = value.Date
            var split1 = date.split('-')[0];
            var split2 = date.split('-')[1];
            var split3 = date.split('-')[2];
            var formattedDate = split3 + "-" + split2 + "-" + split1;
            $('#AvailabilityDate').val(formattedDate);

            if (TypeDropdown != null && TypeDropdown.length > 0 && TypeDropdown[0].length > 0) {
                var TypeSelectOptions = TypeDropdown[0].map(function (availabilityType) {
                    var isSelected = availabilityType.AvailabilityTypeId == value.AvailabilityTypeId ? 'selected' : '';
                    return `<option value="${availabilityType.AvailabilityTypeId}" ${isSelected}>${availabilityType.AvailabilityTypeName}</option>`;
                }).join('');
            }

            var html = `
            <div class="row AvailabilityDynamic">
                <input type="hidden" class="EmployeeAvailabilityId" id="EmployeeAvailabilityId" name="EmployeeAvailabilityId" data-id="${value.EmployeeAvailabilityId}" />
                <div class="col-lg-2 col-md-2 col-sm-2 col-6 ProductCategory">
	            	<div class="form-group">
	            		<label class="dynamic-label" style="display: ${rowadd > 0 ? 'none' : 'block'};">AvailabilityType<span id="Asterisk">*</span></label>
	            		<select class="form-control Type" id="Type${numberIncr}" name="Type${numberIncr}" required>
                             ${defaultOption}${TypeSelectOptions}
	            		</select>
	            	</div>
	            </div>
                <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="dynamic-label" style="display: ${rowadd > 0 ? 'none' : 'block'};">Start Time<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control StartTime mydatetimepicker" id="StartTime${numberIncr}" name="StartTime${numberIncr}" value="${value.StartTime}" style="background-color: rgb(255, 255, 255); required">
                    </div>
                </div>
                <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="dynamic-label" style="display: ${rowadd > 0 ? 'none' : 'block'};">End Time<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control EndTime mydatetimepicker" id="EndTime${numberIncr}" name="EndTime${numberIncr}" value="${value.EndTime}" style="background-color: rgb(255, 255, 255); required">
                    </div>
                </div>
                <div class="col-md-5 col-lg-5 col-sm-5 col-6">
                    <div class="form-group">
                        <label class="dynamic-label" style="display: ${rowadd > 0 ? 'none' : 'block'};">Description<span id="Asterisk">*</span></label>
                        <textarea class="form-control Description" id="Comments${numberIncr}" autocomplete="off" name="Comments${numberIncr}" rows="1" required oninput="Common.allowAllCharacters(this,250)" placeholder="Comments">${value.Description}</textarea>
                    </div>
                </div>
                <div class="col-md-1 col-lg-1 col-sm-6 col-6 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                    <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                        <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7" style="margin-top: ${rowadd > 0 ? '1px !important' : '16px !important'};"><i class="fas fa-trash-alt" style="top: ${rowadd > 0 ? '10px !important' : '25px !important'};"></i></button>
                    </div>
                </div>
            </div>
            `;
            $('#FormAvailability').append(html);
            $('.mydatetimepicker').mdtimepicker();
            //updateRemoveButtons();
            updateRowDisplay();
        });
        $('#AddAvailability').show();
    }
}


async function duplicateRow() {
    var AvailabilityTypeData = await Common.bindDropDownSync('AvailabilityType');
    TypeDropdown = JSON.parse(AvailabilityTypeData);

    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.AvailabilityDynamic').length;
    var TypeSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (TypeDropdown != null && TypeDropdown.length > 0 && TypeDropdown[0].length > 0) {
        TypeSelectOptions = TypeDropdown[0].map(function (availabilityType) {
            return `<option value="${availabilityType.AvailabilityTypeId}">${availabilityType.AvailabilityTypeName}</option>`;
        }).join('');
    }

    if (rowadd < 4) {
        var html = `
            <div class="row AvailabilityDynamic">
                <input type="hidden" class="EmployeeAvailabilityId" id="EmployeeAvailabilityId" name="EmployeeAvailabilityId" data-id="" />  
                <div class="col-lg-2 col-md-2 col-sm-2 col-6 ProductCategory">
                    <div class="form-group">
                        <label class="dynamic-label" style="display: ${rowadd > 0 ? 'none' : 'block'};">AvailabilityType<span id="Asterisk">*</span></label>
                        <select class="form-control Type" id="Type${numberIncr}" name="Type${numberIncr}" required>
                             ${defaultOption}${TypeSelectOptions}
                        </select>
                    </div>
                </div>
                <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="dynamic-label" style="display: ${rowadd > 0 ? 'none' : 'block'};">Start Time<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control StartTime mydatetimepicker" id="StartTime${numberIncr}" name="StartTime${numberIncr}" style="background-color: rgb(255, 255, 255);" required>
                    </div>
                </div>
                <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="dynamic-label" style="display: ${rowadd > 0 ? 'none' : 'block'};">End Time<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control EndTime mydatetimepicker" id="EndTime${numberIncr}" name="EndTime${numberIncr}" style="background-color: rgb(255, 255, 255);" required>
                    </div>
                </div>
                <div class="col-md-5 col-lg-5 col-sm-5 col-6">
                    <div class="form-group">
                        <label class="dynamic-label" style="display: ${rowadd > 0 ? 'none' : 'block'};">Description<span id="Asterisk">*</span></label>
                        <textarea class="form-control Description" id="Comments${numberIncr}" autocomplete="off" name="Comments${numberIncr}" rows="1" required oninput="Common.allowAllCharacters(this,250)" placeholder="Comments"></textarea>
                    </div>
                </div>
                <div class="col-md-1 col-lg-1 col-sm-6 col-6 thiswillshow">
                    <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                        <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7" style="margin-top: ${rowadd > 0 ? '1px !important' : '16px !important'};"><i class="fas fa-trash-alt" style="top: ${rowadd > 0 ? '10px !important' : '25px !important'};"></i></button>
                    </div>
                </div>
            </div>
            `;
        $('#FormAvailability').append(html);
    }
    //updateRemoveButtons();
    updateRowDisplay();
    $('.mydatetimepicker').mdtimepicker();
}

function updateRowDisplay() {
    var rows = $('.AvailabilityDynamic');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow');
        var labelElements = $(this).find('.dynamic-label');

        if (index === 0) {
            labelElements.attr("style", "display: block !important;");
        } else {
            labelElements.attr("style", "display: none !important;");
        }

        if (rows.length === 1) {
            removeButtonDiv.attr("style", "display: none !important;");
        } else {
            removeButtonDiv.attr("style", "display: block !important;");
        }
    });

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
    var totalRows = $('.AvailabilityDynamic').length;
    if (totalRows > 1) {
        $(button).closest('.AvailabilityDynamic').remove();
        updateRowDisplay();
    }
}


function bindTableAvailability(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);
    if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [];
    renderColumn.push(
        {
            targets: actionTarget,
            render: function (data, type, row, meta) {
                return `<td><div class="actionEllipsis"><i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i> 
                                <i class="btn-delete alert_delete"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></td></div>`;

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
        "pageLength": 3,
        "lengthMenu": [3, 6, 9],
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "columnDefs": !isTetroONEnocount
            ? renderColumn : [],
    });
    $('#tableFilter' + tableid).on('keyup', function () {
        table.search($(this).val()).draw();
    });
    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}

function bindTable(tableid, data, columns, actionTarget, scrollpx, isAction) {
    // Clear existing table if any
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
        const dt = $('#' + tableid).DataTable();
        dt.clear().draw();
        dt.destroy();
    }
    $('#' + tableid).empty();

    // Remove unwanted column
    columns = columns.filter(x => x.name != "TetroONEnocount");

    var TetroONEnocount = data[0]?.hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");
    var EODStatusColumnIndex = columns.findIndex(column => column.data === "EODStatus");

    if (isAction == true && data != null && data.length > 0 && !TetroONEnocount) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    // ✅ Create new data array: show only Sunday badge, not Sunday records
    let newData = [];
    (data || []).forEach(row => {
        if (row.Day === "Sunday") {
            newData.push({ isSundayBadgeRow: true });
        } else {
            newData.push(row);
        }
    });

    var lang = {};
    var screenWidth = $(window).width();
    if (screenWidth <= 575) {
        lang = {
            "paginate": { "next": ">", "previous": "<" }
        };
    }

    // ✅ Add safe fallback for missing data fields
    columns = columns.map(col => ({
        ...col,
        defaultContent: "" // Prevents "unknown parameter" error
    }));

    var table = $('#' + tableid).DataTable({
        "dom": "Bfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !TetroONEnocount ? newData : [],
        "columns": columns,
        "destroy": true,
        "aaSorting": [],
        "info": hasValidData,
        "paging": hasValidData,
        "pageLength": 8,
        "oSearch": { "bSmart": false, "bRegex": true },
        "lengthMenu": [5, 10, 25, 50],
        "columnDefs": [
            {
                targets: actionTarget,
                render: function (data, type, row) {
                    if (row.isSundayBadgeRow) return "";
                    var stringifydata = JSON.stringify(row);
                    return `<i class="btneye actionEllipsis" data-row='${stringifydata}' title="View">
                                <img src="/assets/commonimages/attendanceeye.svg" />
                            </i>`;
                }
            },
            {
                targets: StatusColumnIndex,
                render: function (data, type, row) {
                    if (row.isSundayBadgeRow) return "";
                    if (type === 'display' && row.Status_Colour) {
                        var dataText = row.Status ?? '';
                        var statusColor = row.Status_Colour.toLowerCase();
                        return `<div>
                                    <span class="ana-span badge text-white" 
                                          style="background:${statusColor};width:99px;font-size:12px;height:20px;">
                                          ${dataText}
                                    </span>
                                </div>`;
                    }
                    return data ?? '';
                }
            },
            {
                targets: EODStatusColumnIndex,
                render: function (data, type, row) {
                    if (row.isSundayBadgeRow) return "";
                    if (type === 'display' && row.EODStatus_Colour) {
                        var dataText = row.EODStatus ?? '';
                        var statusColor = row.EODStatus_Colour.toLowerCase();
                        return `<div>
                                    <span class="ana-span badge text-white" 
                                          style="background:${statusColor};width:99px;font-size:12px;height:20px;">
                                          ${dataText}
                                    </span>
                                </div>`;
                    }
                    return data ?? '';
                }
            }
        ],
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "scrollCollapse": true,
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),

        // ✅ Create custom Sunday badge row
        "createdRow": function (row, data) {
            if (data.isSundayBadgeRow) {
                $(row).empty().css({
                    padding: 0,
                    verticalAlign: "middle",
                    textAlign: "center"
                }).append(`
                    <td colspan="${columns.length}" style="padding:0;vertical-align:middle;text-align:center;">
                        <div style="align-items:center;height:50px;">
                            <span class="ana-span badge text-white" 
                                  style="background:orange;width:105px;font-size:17px;height:24px;margin-top:12px;">
                                Sunday
                            </span>
                        </div>
                    </td>
                `);
            }
        }
    });

    // Search functionality
    $('#tableFilterEmployee' + tableid).on('keyup', function () {
        table.search($(this).val()).draw();
    });

    // Adjust columns after rendering
    setTimeout(() => {
        autoAdjustColumns($('#' + tableid).DataTable());
    }, 100);
}





//function bindTable(tableid, data, columns, actionTarget, scrollpx, isAction) {
//    if ($.fn.DataTable.isDataTable('#' + tableid)) {
//        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
//            $('#' + tableid).DataTable().clear().destroy();
//        }
//        const dt = $('#' + tableid).DataTable();
//        dt.clear().draw();
//        dt.destroy();
//    }
//    $('#' + tableid).empty();
//    columns = columns.filter(x => x.name != "TetroONEnocount");
//    var TetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
//    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

//    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");
//    var EODStatusColumnIndex = columns.findIndex(column => column.data === "EODStatus");

//    if (isAction == true && data != null && data.length > 0 && !TetroONEnocount) {
//        columns.push({
//            "data": "Action", "name": "Action", "title": "Action", orderable: false
//        });
//    }

//    var lang = {};
//    var screenWidth = $(window).width();
//    if (screenWidth <= 575) {
//        var lang = {
//            "paginate": {
//                "next": ">",
//                "previous": "<"
//            }
//        }
//    }
//    var table = $('#' + tableid).DataTable({
//        "dom": "Bfrtip",
//        "bDestroy": true,
//        "responsive": true,
//        "data": !TetroONEnocount ? data : [],
//        "columns": columns,
//        "destroy": true,
//        "aaSorting": [],
//        "info": hasValidData,
//        "paging": hasValidData,
//        "pageLength": 8,
//        "oSearch": { "bSmart": false, "bRegex": true },
//        "lengthMenu": [5, 10, 25, 50],
//        "columnDefs": [
//            {
//                targets: actionTarget,
//                render: function (data, type, row, meta) {
//                    var stringifydata = JSON.stringify(row);
//                    return `<i class="btneye actionEllipsis" data-row="${stringifydata}" title="View"><img src="/assets/commonimages/attendanceeye.svg" /></i>`;
//                }
//            },
//            {
//                "targets": StatusColumnIndex,
//                render: function (data, type, row, meta) {
//                    if (type === 'display' && row.Status_Colour != null && row.Status_Colour.length > 0) {
//                        var dataText = row.Status;
//                        var statusColor = row.Status_Colour.toLowerCase();

//                        var htmlContent = '<div>';
//                        htmlContent += '<span class="ana-span badge text-white" style="background:' + statusColor + ';width: 99px;font-size: 12px;height: 20px;">' + dataText + '</span>';
//                        htmlContent += '</div>';

//                        return htmlContent;
//                    }
//                    return data ?? '';
//                }
//            },
//            {
//                "targets": EODStatusColumnIndex,
//                render: function (data, type, row, meta) {
//                    if (type === 'display' && row.EODStatus_Colour != null && row.EODStatus_Colour.length > 0) {
//                        var dataText = row.EODStatus;
//                        var statusColor = row.EODStatus_Colour.toLowerCase();

//                        var htmlContent = '<div>';
//                        htmlContent += '<span class="ana-span badge text-white" style="background:' + statusColor + ';width: 99px;font-size: 12px;height: 20px;">' + dataText + '</span>';
//                        htmlContent += '</div>';

//                        return htmlContent;
//                    }
//                    return data ?? '';
//                }
//            }
//        ],
//        "scrollY": scrollpx,
//        "sScrollX": "100%",
//        "scrollCollapse": true,
//        "language": $.extend({}, lang, {
//            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
//        }),

//    });
//    $('#tableFilterEmployee' + tableid).on('keyup', function () {
//        table.search($(this).val()).draw();
//    });
//    setTimeout(function () {
//        var table1 = $('#' + tableid).DataTable();
//        autoAdjustColumns(table1);
//    }, 100);
//}


function updateMonthDisplayEmployee(date) {
    let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();
    $('#EmployeeDatePicker #dateDisplay2').text(month + " " + year);
}

function updateMonthDisplayTeam(date) {
    let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();
    $('#TeamDatePicker #dateDisplay2').text(month + " " + year);
}

function updateMonthDisplayAdmin(date) {
    let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();
    $('#AdminDatePicker #dateDisplay2').text(month + " " + year);
}


function EyeButtonView(button, tableName) {
    var closestRow = $(button).closest('tr');
    var table = $(tableName).DataTable();
    var rowData = table.row(closestRow).data();

    var dateString = rowData.Date.replace(/'/g, '');
    var dateObject = new Date(dateString);
    dateObject.setDate(dateObject.getDate() + 1);
    var employeeTypeId = 0;
    if ($('#Permanent-TabBtn').hasClass('active')) {
        employeeTypeId = 1;
    } else if ($('#Labour-TabBtn').hasClass('active')) {
        employeeTypeId = 2;
    }

    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    Common.ajaxCall("GET", "/HumanResource/GetAttendanceEmployee", { EmployeeId: rowData.EmployeeId, FromDate: firstDay.toISOString(), ToDate: dateObject.toISOString(), PunchDate: dateObject.toISOString() }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            $('#EmployeeName').text(data[0][0].EmployeeName)
            $('#PunchDate').text(data[0][0].PunchDate)
            $('#EmployeeCompanyId').text(data[0][0].EmployeeCompanyId)
            $('#TotalHours').text(data[0][0].TotalHours)
            $('#WorkingHours').text(data[0][0].WorkingHours)

            $('#Todayactivity').empty('');
         //   if (data[1][0].PunchIn != null && data[1][0].PunchIn != "") {
         //       data[1].forEach(function (attendData) {
         //           if (attendData.PunchIn !== null && attendData.PunchIn !== "") {
         //               var Inhtml = `<li class="list1">
									//	<div class="row">
									//		<div class="col-6">
									//			<p class="text-dark">Punch In</p>
									//			<p class="res-activity-time">
									//				<i class="fa fa-clock-o"></i> <label>${attendData.PunchIn}</label>
									//			</p>
									//		</div>
									//		<div class="col-6">
         //                                   ${attendData.InLocation != null ? `<img src="/assets/commonimages/map-pin.svg" width="20px"><p class="text-dark">${attendData.InLocation}</p>` : ''}
         //                                   </div>
									//	</div>
									//</li>`;
         //               $('#Todayactivity').append(Inhtml);
         //           }
         //           if (attendData.PunchOut !== null && attendData.PunchOut !== "") {
         //               var Outhtml = `<li class="list2">
									//	<div class="row">
									//		<div class="col-6">
									//			<p class="text-dark">Punch Out</p>
									//			<p class="res-activity-time">
									//				<i class="fa fa-clock-o"></i> <label>${attendData.PunchOut}</label>
									//			</p>
									//		</div>
									//		<div class="col-6">
         //                                      ${attendData.OutLocation != null ? `<img src="/assets/commonimages/map-pin.svg" width="20px"><p class="text-dark">${attendData.OutLocation}</p>` : ''}
         //                                   </div>
									//	</div>
									//</li>`;

         //               $('#Todayactivity').append(Outhtml);
         //           }
         //       });

         //   } else {
         //       $('#Todayactivity').append(`<div><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;"> No Data</div>`);
            //   }


            // Hardcoded attendance data
            var attendDataList = [
                { PunchIn: "09:30 AM", PunchOut: "01:28 PM", InLocation: "Office Entrance", OutLocation: "Main Gate" },
                { PunchIn: "02:55 PM", PunchOut: "06:31 PM", InLocation: "Office Entrance", OutLocation: "Main Gate" }
            ];

            // Loop through each hardcoded entry
            attendDataList.forEach(function (attendData) {
                if (attendData.PunchIn !== null && attendData.PunchIn !== "") {
                    var Inhtml = `
            <li class="list1">
                <div class="row">
                    <div class="col-6">
                        <p class="text-dark">Punch In</p>
                        <p class="res-activity-time">
                            <i class="fa fa-clock-o"></i> <label>${attendData.PunchIn}</label>
                        </p>
                    </div>
                    <div class="col-6">
                        ${attendData.InLocation ? `<img src="/assets/commonimages/map-pin.svg" width="20px"><p class="text-dark">${attendData.InLocation}</p>` : ''}
                    </div>
                </div>
            </li>`;
                    $('#Todayactivity').append(Inhtml);
                }

                if (attendData.PunchOut !== null && attendData.PunchOut !== "") {
                    var Outhtml = `
            <li class="list2">
                <div class="row">
                    <div class="col-6">
                        <p class="text-dark">Punch Out</p>
                        <p class="res-activity-time">
                            <i class="fa fa-clock-o"></i> <label>${attendData.PunchOut}</label>
                        </p>
                    </div>
                    <div class="col-6">
                        ${attendData.OutLocation ? `<img src="/assets/commonimages/map-pin.svg" width="20px"><p class="text-dark">${attendData.OutLocation}</p>` : ''}
                    </div>
                </div>
            </li>`;
                    $('#Todayactivity').append(Outhtml);
                }
            });

            $('#PunchDate').text('09-10-2025');
            $('#EmployeeName').text('Kavinesh Rajasekar');
            $('#EmployeeCompanyId').text('SFB_001');
            $('#TotalHours').text('09:01 Hrs');
            $('#WorkingHours').text('07:34 Hrs');

            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $("#attndanceCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#attndanceCanvas").css("width", "50%");
            } else {
                $("#attndanceCanvas").css("width", "33%");
            }
            $('#fadeinpage').addClass('fadeoverlay');
        }
    }, null);
}


function bindTableAttendanceImage(tableid, data, columns, scrollType, editcolumn, scrollpx, isAction) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();
    var columnData = getRows(data);

    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');

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
        "data": !isTetroONEnocount ? columnData : [],
        "columns": columns,
        "aaSorting": [],
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "scrollCollapse": true,
        "scrollLeft": "100%",
        "oSearch": { "bSmart": false, "bRegex": true },
        "fixedColumns": {
            leftColumns: 1,
            // rightColumns: 1
        },
        "initComplete": function () {
            if (scrollType) {
                var scrollContainer = $('#AdminTable').parent('.dataTables_scrollBody');
                scrollContainer.scrollLeft(scrollContainer[0].scrollWidth);
            }
        },
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "paging": true,

        "columnDefs": !isTetroONEnocount
            ? [
                //{
                //    "targets": Employee,
                //    render: function (data, type, row, meta) {
                //        if (type === 'display' && !isTetroONEnocount) {
                //            const imageSrc = (row.EmployeeImage?.trim() == null || row.EmployeeImage?.trim() == undefined || row.EmployeeImage?.trim() == " " || row.EmployeeImage?.trim().length == 0)
                //                ? "../tetropay/assets/img/humanemployee.png" : row.EmployeeImage;
                //            return `<h2 class="table-avatar">
                //                <a class="avatar"><img alt="" src="/${imageSrc}"></a>
                //                <a>${row.EmployeeName}</a>
                //            </h2>`;
                //        }
                //        return data;
                //    }
                //}
            ] : []
    });
    // $('#' + tableid).DataTable(dataTableOptions);
    $('#tableFilterAdmin' + tableid).on('keyup', function () {
        table.search($(this).val()).draw();
    });
    $('.sorting').click();
    setTimeout(function () {
        var table = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table);
    }, 100);
}


function getRows(data) {
    $.each(data, function (index, employee) {
        for (var key in employee) {
            if (key !== 'EmployeeId' && key !== 'EmployeeImage' && key !== 'EmployeeName') {
                if (employee[key] == 'Absent') {
                    employee[key] = '<a title="Absent" flow="left"><img class="xmark" src="/assets/commonimages/absent.svg"  onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                } else if (employee[key] == 'Present') {
                    employee[key] = '<a title="Present" flow="left"><img class="xmark" src="/assets/commonimages/present.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                } else if (employee[key] == 'WeekOff') {
                    employee[key] = '<a title="WeekOff" flow="left"><img class="xmark" src="/assets/commonimages/weekoff.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                } else if (employee[key] == 'Holiday') {
                    employee[key] = '<a title="Holiday" flow="left"><img class="xmark" src="/assets/commonimages/Attendance-holiday.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                }
                else if (employee[key] == 'Leave') {
                    employee[key] = '<a title="Leave" flow="left"><img class="xmark" src="/assets/commonimages/leavemark.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                }
                else if (employee[key] == 'Leave/Present') {
                    employee[key] = '<a title="Leave/Present" flow="left"><img class="xmark" src="/assets/commonimages/leavepresent.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                }
                else if (employee[key] == 'Leave/Absent') {
                    employee[key] = '<a title="Leave/Absent" flow="left"><img class="xmark" src="/assets/commonimages/leaveabsent.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                }
                else if (employee[key] == 'Absent/Leave') {
                    employee[key] = '<a title="Absent/Leave" flow="left"><img class="xmark" src="/assets/commonimages/absentleave.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                }
                else if (employee[key] == 'Present/Leave') {
                    employee[key] = '<a title="Present/Leave" flow="left"><img class="xmark" src="/assets/commonimages/presentleave.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                }
                else if (employee[key] == 'YetToRegularize') {
                    employee[key] = '<a title="YetToRegularize" flow="left"><img class="xmark" src="/assets/commonimages/yettoregularize.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                }
                else if (employee[key] == 'HalfDay') {
                    employee[key] = '<a title="HalfDay" flow="left"><img class="xmark" src="/assets/commonimages/halfday.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                } else if (employee[key] == 'CompOff') {
                    employee[key] = '<a title="CompOff" flow="left"><img class="xmark" src="/assets/commonimages/compensatoryofficon.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                } else if (employee[key] == 'Leave/CompOff') {
                    employee[key] = '<a title="Leave/CompOff" flow="left"><img class="xmark" src="/assets/commonimages/leavecompoffIcon.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                }
                else if (employee[key] == 'CompOff/Leave') {
                    employee[key] = '<a title="CompOff/Leave" flow="left"><img class="xmark" src="/assets/commonimages/compOffleaveicon.svg" onclick=AttendanceLog("' + key + '","' + employee.EmployeeId + '")></img></a>';
                }

            }
        }
    });
    return data;
}

function bindTableManual(tableid, data, columns, scrollpx) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }

    $('#' + tableid).empty();

    var TetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var AttendanceStatus = columns.findIndex(column => column.data === "Status");
    var punchIn = columns.findIndex(column => column.data === "PunchIn");
    var punchOut = columns.findIndex(column => column.data === "PunchOut");

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
        "data": !TetroONEnocount ? data : [],
        "columns": columns,
        "destroy": true,
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "paging": true,
        "columnDefs": [
            {
                "targets": AttendanceStatus,
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        var dataText = "Not Yet";
                        dataText = row.Status;
                        var statusColor = row.Status_Colour.toLowerCase();

                        var htmlContent = '';
                        htmlContent += '<div class="action-label">';
                        htmlContent += '<a class="btn btn-sm btn-rounded">';
                        htmlContent += '<i class="fa fa-dot-circle-o" style="color:' + statusColor + ';"></i> ' + dataText + '</a>';
                        htmlContent += '</div>';

                        return htmlContent;
                    }
                    return data;
                }
            },
            {
                "targets": [punchIn],
                render: function (data, type, row, meta) {
                    var uniqueId = 'punchIn_' + meta.row;
                    return `<input type="text" id="${uniqueId}" class="mydatetimepickerpunchIn" value="${data}" data-rowid="${meta.row}" />`;
                }
            },
            {
                "targets": [punchOut],
                render: function (data, type, row, meta) {
                    var uniqueId = 'punchOut_' + meta.row;
                    var minTime = '';
                    if (meta.row >= 0 && meta.row < data.length) {
                        minTime = data[meta.row].PunchIn;
                    }
                    var inputHtml = `<input type="text" id="${uniqueId}" class="mydatetimepickerpunchOut" value="${data}" data-rowid="${meta.row}" />`;

                    $(inputHtml).mdtimepicker().data('mdtimepicker').setMinTime(minTime);
                    return inputHtml;
                }
            },
        ],
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "scrollCollapse": true,
        "aaSorting": [],
        "oSearch": { "bSmart": false, "bRegex": true },
        "drawCallback": function () {
            $('.mydatetimepickerpunchIn').mdtimepicker();
            $('.mydatetimepickerpunchOut').mdtimepicker();
            $('.mydatetimepickerpunchIn').on('change', function () {
                var punchInValue = $(this).val();
                var rowId = $(this).data('rowid');
                var mdTimePicker = $('#punchOut_' + rowId);
                mdTimePicker.data('mdtimepicker').setMinTime(punchInValue);
            });
        },
        "rowId": function (row) {
            return 'row_' + row.EmployeeID;
        }
    });
    $('#tableFilterManual').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    var tableId = $('#' + tableid).DataTable();
    Common.autoAdjustColumns(tableId);
}