var leaveId = 0;
var permissionId = 0;
var compOffId = 0;
var isHalfVal = null;

$(document).ready(function () {
    Common.bindDropDownParent('LevEmployeeId', 'FormLeave', 'Employee');
    Common.bindDropDownParent('LeaveTypeId', 'FormLeave', 'LeaveType');

    Common.ajaxCall("GET", "/Leave/GetLeave", { LeaveId: null, }, LeaveSuccess, null);
    $('#AddLeave').attr('title', 'Add Leave');

    $(document).on('change', '#LevEmployeeId', function () {
        var value = $(this).val();
        if (value != "") {
            $(this).siblings('.error').remove();
        }
    });

    $(document).on('change', '#FromDate', function () {
        var value = $(this).val();
        if (value != "") {
            $(this).removeClass('error');
            $(this).siblings('.error').remove();
        }
    });

    $(document).on('click', '#SaveLeave', function () {
        if ($("#FormLeave").valid()) {
            var noD = $('#NoOfDays').val();
            var noDDecimal = parseFloat(noD.match(/\d+(\.\d+)?/)[0]);
            var isFirstHalf = $('#IsFirstHalf').prop('checked');
            var objvalue = {};
            objvalue.LeaveId = leaveId == 0 ? null : leaveId;
            objvalue.EmployeeId = Common.parseInputValue('LevEmployeeId');
            objvalue.FromDate = $('#FromDate').val();
            objvalue.ToDate = $('#ToDate').val();
            objvalue.LeaveTypeId = $('#LeaveTypeId').val();
            objvalue.NoOfDays = parseFloat($('#NoOfDays').val());
            objvalue.IsHalfDay = Common.parseInputValue('IsHalfDay');
            objvalue.LeaveStatusId = Common.parseInputValue('LeaveStatusId');
            objvalue.LeaveDescription = Common.parseStringValue('LeaveDescription');
            objvalue.Comments = $('#FormLeave #Comments').val() == "" ? null : $('#FormLeave #Comments').val();

            Common.ajaxCall("POST", "/Leave/InserUpdatetLeave", JSON.stringify(objvalue), InsertSuccessLeave, null); 
        }
    });

    $('#AddLeave').click(function () {
        if ($('#Leave-TabBtn').hasClass('active')) {
            leaveId = 0;
            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $("#LeaveCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#LeaveCanvas").css("width", "50%");
            } else {
                $("#LeaveCanvas").css("width", "39%");
            }
            $('#fadeinpage').addClass('fadeoverlay');
            Common.removevalidation('FormLeave');
            $('#SaveLeave').text('Save').removeClass('btn-update').addClass('btn-success');
            $('#SaveLeave').show();
            $('#LeaveHeader').text('Add Leave');
            $('#StatusCol').hide();
            $('#IsFirstHalf').prop('checked', false);
            $('#LeaveComments').hide();
            $('#Comments').val('');
            $('#LevEmployeeId').val(null).trigger('change');
            $('#LevEmployeeId').prop('disabled', false);
            $('#FromDate').prop('disabled', false);
            $('#IsHalfDay').prop('disabled', false);
            $('#LeaveStatusId').prop('disabled', false);
            $('#LeaveTypeId').val('3');
            isHalfVal = null;
            if (isAdminAccess != "True") {
                $('#LevEmployeeId').val(UserId).trigger('change');
                $('#LevEmployeeId').prop('disabled', true);
            }
            $('#LeaveDescCol').removeClass('col-md-12 col-lg-12 col-sm-12 col-12').addClass('col-md-6 col-lg-6 col-sm-6 col-6');
        }
    });

    $("#FormLeave").validate({
        errorPlacement: function (error, element) {
            if (element.hasClass("select2-hidden-accessible")) {
                error.insertAfter(element.next(".select2-container"));
            } else {
                error.insertAfter(element);
            }
        },
        rules: {
            EmployeeId: {
                required: true
            }
        },
        messages: {
            EmployeeId: {
                required: "This field is required."
            }
        }
    });

    $(document).on('click', '.btn-edit', function () {
        if ($('#Leave-TabBtn').hasClass('active')) {
            Common.removevalidation('FormLeave')
            leaveId = $(this).data('id');
            $('#SaveLeave').text('Update').removeClass('btn-success').addClass('btn-update');
            $('#SaveLeave').show();
            $('#LeaveHeader').text('Leave Info');
            $('#StatusCol').show();
            $('#LevEmployeeId').val(null).trigger('change');
            $('#LevEmployeeId').prop('disabled', false);
            if (isAdminAccess != "True") {
                $('#LevEmployeeId').val(UserId).trigger('change');
                $('#LevEmployeeId').prop('disabled', true);
            }
            $('#FromDate').prop('disabled', false);
            $('#IsHalfDay').prop('disabled', false);
            $('#LeaveDescCol').removeClass('col-md-6 col-lg-6 col-sm-6 col-6').addClass('col-md-12 col-lg-12 col-sm-12 col-12');
            Common.ajaxCall("POST", "/Leave/GetStatus", JSON.stringify({ ModuleName: 'LeaveStatus', ModuleId: leaveId }), function (response) {
                Common.bindDropDownSuccess(response.data, 'LeaveStatusId');
                Common.ajaxCall("GET", "/Leave/GetLeave", { LeaveId: leaveId, }, editSuccessLeave, null);
            }, null);
        }
    });

    $(document).on('click', '.btn-delete', async function () {
        if ($('#Leave-TabBtn').hasClass('active')) {
            var response = await Common.askConfirmation();
            if (response == true) {
                var DelLeaveId = $(this).data('id');
                Common.ajaxCall("GET", "/Leave/DeleteLeave", { LeaveId: DelLeaveId }, InsertSuccessLeave, null);
            }
        }
    });


    $('#FromDate').on('change', function () {
        var fromDate = $(this).val();
        $('#ToDate').val(fromDate);
        /* $('#NoOfDays').val("1 Day");*/
        //$('#RemainingLeaves').val("0");
    });

    $('#IsHalfDay').on('change', function () {
        if ($('#IsHalfDay').val() == "2") {
            $('#NoOfDays').val("0.5 Day");
        } else if ($('#IsHalfDay').val() == "3") {
            $('#NoOfDays').val("0.5 Day");
        } else if ($('#IsHalfDay').val() == "1") {
            $('#NoOfDays').val("1 Day");
        } else {
            $('#NoOfDays').val("");
        }
    });

    $('#LeaveStatusId').on('change', function () {
        if ($("#LeaveStatusId option:selected").text() == "Rejected" || $("#LeaveStatusId option:selected").text() == "Cancelled") {
            $('#LeaveComments').show();
        } else {
            $('#LeaveComments').hide();
            $('#Comments').val('');
        }
    });

    $('#LeaveCanvas #CloseCanvas').click(function () {
        $("#LeaveCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('#LevEmployeeId,#FromDate').on('change', function () {
        if ($('#LevEmployeeId').val() != "" && $('#FromDate').val() != "") {
            var empId = $('#LevEmployeeId').val();
            var date = $('#FromDate').val();
            Common.ajaxCall("GET", "/Leave/GetRemainingDetails", { ModuleId: leaveId == 0 ? null : leaveId, Type: null, EmployeeId: parseInt(empId), ModuleName: "Leave", Date: date }, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    $('#SaveLeave').show();
                    var leaveOptions = [
                        { id: "1", name: "Full Day" },
                        { id: "2", name: "First Half Day" },
                        { id: "3", name: "Second Half Day" }
                    ];

                    var $dropdown = $('#IsHalfDay');
                    $dropdown.empty();

                    $dropdown.append($('<option>', {
                        value: '',
                        text: '--Select--',
                    }));

                    var remaining = data[0][0].RemainingLeave;
                    var taken = data[0][0].TakenLeave;

                    var filteredData = [];

                    if ((remaining === 0.5 && taken === 0.0) || (remaining === 0.0 && taken === 0.5)) {
                        filteredData = leaveOptions.filter(x => x.id !== "1");
                    } else {
                        filteredData = leaveOptions;
                    }

                    $.each(filteredData, function (index, item) {
                        $dropdown.append($('<option>', {
                            value: item.id,
                            text: item.name,
                        }));
                    });
                    $dropdown.val(isHalfVal != null ? isHalfVal : '').trigger('change');

                    if (data[0][0].RemainingLeave == 0.5 && data[0][0].TakenLeave == 0) {
                        $('#NoOfDays').val("0.5 Day");
                        $('#IsHalfDay').val("2");
                        //$('#IsHalfDay').prop('disabled', true);
                    } else if (data[0][0].RemainingLeave == 0 && data[0][0].TakenLeave == 0) {
                        $('#SaveLeave').hide();
                        Common.warningMsg('You have 0 day leave.');
                    } else {
                        /// $('#NoOfDays').val("1 Day");
                    }

                }
            }, null);
        }
    });

    $('#Leave-TabBtn').click(function () {
        Common.ajaxCall("GET", "/Leave/GetLeave", { LeaveId: null, }, LeaveSuccess, null);
        $('#AddLeave').attr('title', 'Add Leave');
        $('#CounterBoxImg1').prop('src', '/assets/moduleimages/leavepermission/leaveicon_1.svg');
        $('#CounterBoxImg2').prop('src', '/assets/moduleimages/leavepermission/leaveicon_2.svg');
        $('#CounterBoxImg3').prop('src', '/assets/moduleimages/leavepermission/leaveicon_3.svg');
        $('#CounterBoxImg4').prop('src', '/assets/moduleimages/leavepermission/leaveicon_4.svg');
        $('#tableFilter').val("");
    });
    $('#Permission-TabBtn').click(function () {
        Common.ajaxCall("GET", "/Permission/GetPermission", { PermissionId: null, }, PermissionSuccess, null);
        $('#AddLeave').attr('title', 'Add Permission');
        $('#CounterBoxImg1').prop('src', '/assets/moduleimages/leavepermission/permissionicon_1.svg');
        $('#CounterBoxImg2').prop('src', '/assets/moduleimages/leavepermission/permissionicon_2.svg');
        $('#CounterBoxImg3').prop('src', '/assets/moduleimages/leavepermission/permissionicon_3.svg');
        $('#CounterBoxImg4').prop('src', '/assets/moduleimages/leavepermission/permissionicon_4.svg');
        $('#tableFilter').val("");
    });
    $('#CompOff-TabBtn').click(function () {
        Common.ajaxCall("GET", "/CompOff/GetCompOff", { CompOffId: null, }, CompOffSuccess, null);
        $('#AddLeave').attr('title', 'Add Compensatory Off');
        $('#CounterBoxImg1').prop('src', '/assets/moduleimages/leavepermission/permissionicon_1.svg');
        $('#CounterBoxImg2').prop('src', '/assets/moduleimages/leavepermission/permissionicon_2.svg');
        $('#CounterBoxImg3').prop('src', '/assets/moduleimages/leavepermission/permissionicon_3.svg');
        $('#CounterBoxImg4').prop('src', '/assets/moduleimages/leavepermission/permissionicon_4.svg');
        $('#tableFilter').val("");
    });
});


function LeaveSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $('#leaveTblCol').html('<table class="table table-rounded dataTable data-table table-striped tableResponsive" id="LeaveTable"></table>');

        $("#CounterTextBox1").text(CounterBox[0]);
        $("#CounterTextBox2").text(CounterBox[1]);
        $("#CounterTextBox3").text(CounterBox[2]);
        $("#CounterTextBox4").text(CounterBox[3]);

        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        var columns = Common.bindColumn(data[1], ['LeaveId', 'Status_Color']);
        Common.bindTable('LeaveTable', data[1], columns, -1, 'LeaveId', '334px', true, access);

        $('#leaveTblCol').show();
        $('#permissionTblCol').hide();
        $('#CompOffTblCol').hide();
    }
}


function editSuccessLeave(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#LeaveCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#LeaveCanvas").css("width", "50%");
        } else {
            $("#LeaveCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        Common.bindParentData(data[0], 'FormLeave');
        $('#LevEmployeeId').val(data[0][0].EmployeeId).trigger('change');
        isHalfVal = data[0][0].IsHalfDay;

        $("#LeaveStatusId option").each(function () {
            if ($(this).val() !== "" && $(this).val() < data[0][0].LeaveStatusId) {
                $(this).remove();
            }
        });
        if (isAdminAccess != "True") {
            if ($("#LeaveStatusId option:selected").text() == "Approved") {
                $('#FromDate').prop('disabled', true);
                $('#IsHalfDay').prop('disabled', true);
            } else if ($("#LeaveStatusId option:selected").text() == "Rejected") {
                $('#FromDate').prop('disabled', true);
                $('#IsHalfDay').prop('disabled', true);
                $('#LeaveStatusId').prop('disabled', true);
            }
            else {
                $('#FromDate').prop('disabled', false);
                $('#IsHalfDay').prop('disabled', false);
                $('#LeaveStatusId').prop('disabled', false);
            }
        }
    }
}

function InsertSuccessLeave(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#LeaveCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.ajaxCall("GET", "/Leave/GetLeave", { LeaveId: null, }, LeaveSuccess, null);
    } else {
        Common.errorMsg(response.message);
    }
}

function PermissionSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $('#permissionTblCol').html('<table class="table table-rounded dataTable data-table table-striped tableResponsive" id="PermissionTable"></table>');

        $("#CounterTextBox1").text(CounterBox[0]);
        $("#CounterTextBox2").text(CounterBox[1]);
        $("#CounterTextBox3").text(CounterBox[2]);
        $("#CounterTextBox4").text(CounterBox[3]);

        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        var columns = Common.bindColumn(data[1], ['PermissionId', 'Status_Color']);
        Common.bindTable('PermissionTable', data[1], columns, -1, 'PermissionId', '330px', true, access);

        $('#leaveTblCol').hide();
        $('#permissionTblCol').show();
        $('#CompOffTblCol').hide();
    }
}

function CompOffSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $('#CompOffTblCol').html('<table class="table table-rounded dataTable data-table table-striped tableResponsive" id="CompOffTable"></table>');

        $("#CounterTextBox1").text(CounterBox[0]);
        $("#CounterTextBox2").text(CounterBox[1]);
        $("#CounterTextBox3").text(CounterBox[2]);
        $("#CounterTextBox4").text(CounterBox[3]);

        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        var columns = Common.bindColumn(data[1], ['CompOffId', 'Status_Color']);
        Common.bindTable('CompOffTable', data[1], columns, -1, 'CompOffId', '330px', true, access);

        $('#leaveTblCol').hide();
        $('#permissionTblCol').hide();
        $('#CompOffTblCol').show();
    }
}