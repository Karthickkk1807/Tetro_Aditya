var compOffId = 0;
var permissionId = 0;
var isHalfVal = null;

$(document).ready(function () {
    Common.bindDropDownParent('ComEmployeeId', 'FormCompOff', 'Employee');

    const today = new Date().toISOString().split('T')[0];
    $("#CompOffDate").val(today);

    //Common.ajaxCall("GET", "/CompOff/GetCompOff", { CompOffId: null, }, CompOffSuccess, null);
    $('#AddLeave').attr('title', 'Add Compensatory Off');

    $(document).on('change', '#ComEmployeeId', function () {
        var value = $(this).val();
        if (value != "") {
            $(this).siblings('.error').remove();
        }
    });

    $(document).on('change', '#CompOffDate', function () {
        var value = $(this).val();
        if (value != "") {
            $(this).removeClass('error');
            $(this).siblings('.error').remove();
        }
    });

    $(document).on('click', '#SaveCompOff', function () {
        if ($("#FormCompOff").valid()) {
            var objvalue = {};
            objvalue.CompOffId = compOffId == 0 ? null : compOffId;
            objvalue.EmployeeId = Common.parseInputValue('ComEmployeeId');
            objvalue.CompensatoryOffDate = $('#CompOffDate').val();
            objvalue.IsHalfDay = $('#ComhalfDay').prop('checked');
            objvalue.NoOfDays = parseFloat($('#ComNoOfDays').val());
            objvalue.AvlCompOff = parseFloat($('#AvlCompOff').val());
            objvalue.CompOffDescription = Common.parseStringValue('CompOffDescription');
            objvalue.CompOffStatusId = parseInt($('#CompStatusId').val());
            objvalue.Comments = $('#FormCompOff #CompComments').val() == "" ? null : $('#FormCompOff #CompComments').val();

            Common.ajaxCall("POST", "/CompOff/InserUpdatetCompensatoryOff", JSON.stringify(objvalue), InsertSuccessCompOff, null);
        }
    });

    $('#AddLeave').click(function () {
        if ($('#CompOff-TabBtn').hasClass('active')) {
            compOffId = 0;
            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $("#CompOffCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#CompOffCanvas").css("width", "50%");
            } else {
                $("#CompOffCanvas").css("width", "39%");
            }
            $('#fadeinpage').addClass('fadeoverlay');
            Common.removevalidation('FormCompOff');
            $('#SaveCompOff').text('Save').removeClass('btn-update').addClass('btn-success');
            $('#SaveCompOff').show();
            $('#CompOffHeader').text('Add Compensatory Off');
            $('#CompStatusIdCol').hide();
            $('#ComhalfDay').prop('checked', false);
            $('#CompCommentsCol').hide();
            $('#CompComments').val('');
            $('#ComEmployeeId').prop('disabled', false);
            $('#CompOffDate').prop('disabled', false);
            $('#ComhalfDay').prop('disabled', false);
            $('#CompStatusId').prop('disabled', false);

            const today = new Date().toISOString().split('T')[0];
            $("#CompOffDate").val(today);

            isHalfVal = null;
            if (isAdminAccess != "True") {
                $('#ComEmployeeId').val(UserId).trigger('change');
                $('#ComEmployeeId').prop('disabled', true);
            }
            $('#CompOffDescriptionCol').removeClass('col-md-6 col-lg-6 col-sm-6 col-6').addClass('col-md-12 col-lg-12 col-sm-12 col-12');
        }
    });

    $("#FormCompOff").validate({
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
        if ($('#CompOff-TabBtn').hasClass('active')) {
            Common.removevalidation('FormCompOff')
            compOffId = $(this).data('id');
            $('#SaveCompOff').text('Update').removeClass('btn-success').addClass('btn-update');
            $('#SaveCompOff').show();
            $('#CompOffHeader').text('Compensatory Off Info');
            $('#CompCommentsCol').show();
            $('#ComEmployeeId').prop('disabled', false);
            $('#CompOffDate').prop('disabled', false);
            $('#ComhalfDay').prop('disabled', false);
            $('#CompStatusIdCol').show();
            $('#CompOffDescriptionCol').removeClass('col-md-12 col-lg-12 col-sm-12 col-12').addClass('col-md-6 col-lg-6 col-sm-6 col-6');
            Common.ajaxCall("POST", "/Leave/GetStatus", JSON.stringify({ ModuleName: 'CompOffStatus', ModuleId: parseInt(compOffId) }), function (response) {
                Common.bindDropDownSuccess(response.data, 'CompStatusId');
                //Common.ajaxCall("GET", "/CompOff/GetCompOff", { CompOffId: parseInt(compOffId), }, editSuccessComp, null);
            }, null);
        }
    });

    $(document).on('click', '.btn-delete', async function () {
        if ($('#CompOff-TabBtn').hasClass('active')) {
            var response = await Common.askConfirmation();
            if (response == true) {
                var DelCompId = $(this).data('id');
                Common.ajaxCall("GET", "/CompOff/DeleteCompOff/", { CompOffId: parseInt(DelCompId) }, InsertSuccessCompOff, null);
            }
        }
    });

    $('#CompStatusId').on('change', function () {
        if ($("#CompStatusId option:selected").text() == "Rejected" || $("#CompStatusId option:selected").text() == "Cancelled") {
            $('#CompCommentsCol').show();
        } else {
            $('#CompCommentsCol').hide();
            $('#Comments').val('');
        }
    });

    $(document).on('change', '#ComEmployeeId', function (e) {
        var $thisVal = $(this).val();
        var date = $('#CompOffDate').val();
        GetRemainingCompOff(parseInt($thisVal), date);
    });

    $(document).on('change', '#CompOffDate', function (e) {
        $('#ComNoOfDays').val('1 Day');
        $('#AvlCompOff').val(originalvalue + 1);
        $('#ComhalfDay').prop('checked', false);
    });

    $('#CompOffCanvas #CloseCanvas').click(function () {
        $("#CompOffCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('#ComhalfDay').on('change', function () {
        if ($(this).is(':checked')) {
            $('#ComNoOfDays').val('0.5 Day');
            $('#AvlCompOff').val(originalvalue + 0.5);
        } else {
            $('#ComNoOfDays').val('1 Day');
            $('#AvlCompOff').val(originalvalue + 1);
        }
    });
});


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

function editSuccessComp(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#CompOffCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#CompOffCanvas").css("width", "50%");
        } else {
            $("#CompOffCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        data[0][0].CompensatoryOffDate =
            data[0][0].CompensatoryOffDate.split("-").reverse().join("-");

        $('#CompOffDate').val(data[0][0].CompensatoryOffDate);

        if (data[0][0].IsHalfDay == true)
            $('#FormCompOff #ComhalfDay').prop('checked', true);
        else
            $('#FormCompOff #ComhalfDay').prop('checked', false);

        if (isAdminAccess != "True") {
            $('#ComEmployeeId').val(UserId).trigger('change');
            $('#ComEmployeeId').prop('disabled', true);
        }

        $('#ComEmployeeId').val(data[0][0].EmployeeId).trigger('change');
        isHalfVal = data[0][0].IsHalfDay;

        $('#ComNoOfDays').val(data[0][0].NoOfDays);
        $('#AvlCompOff').val(data[0][0].AvlCompOff);
        $('#CompStatusId').val(data[0][0].CompOffStatusId);
        $('#CompOffDescription').val(data[0][0].CompOffDescription);
        $('#CompComments').val(data[0][0].Comments);

        if (data[0][0].CompOffstatusName == 'Rejected' || data[0][0].CompOffstatusName == 'Cancelled')
            $('#CompCommentsCol').show();
        else
            $('#CompCommentsCol').hide();
 
        $("#CompStatusId option").each(function () {
            if ($(this).val() !== "" && $(this).val() < data[0][0].CompOffStatusId) {
                $(this).remove();
            }
        });

        $('#ComEmployeeId').prop('disabled', true);
        if (isEmployee != null && isEmployee == 'True') {
            $('#ComEmployeeId').prop('disabled', true);

            if (data[0][0].CompOffstatusName == 'Rejected') {
                $('#SaveCompOff').hide();
            }
            if (data[0][0].CompOffstatusName == 'Approved') {
                $('#CompOffDate').prop('disabled', true);
                $('#ComEmployeeId').prop('disabled', true);
                $('#ComhalfDay').prop('disabled', true);
            }
        }
        if (isAdmin != null && isAdmin == 'True') {
            if (data[0][0].CompOffstatusName == 'Approved' || data[0][0].CompOffstatusName == 'Rejected') {
                $('#CompOffDate').prop('disabled', true);
                $('#ComEmployeeId').prop('disabled', true);
                $('#ComhalfDay').prop('disabled', true);
            } else {
                $('#CompOffDate').prop('disabled', false);
                $('#ComhalfDay').prop('disabled', false);
            }
        }
    }
}

function InsertSuccessCompOff(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#CompOffCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        //Common.ajaxCall("GET", "/CompOff/GetCompOff", { CompOffId: null, }, CompOffSuccess, null);
    } else {
        Common.errorMsg(response.message);
    }
}

var originalvalue = 0;
function GetRemainingCompOff(empId, date) {
    if (empId != "") {
        Common.ajaxCall("GET", "/Leave/GetRemainingDetails", { ModuleId: compOffId == 0 ? null : compOffId, Type: null, EmployeeId: parseInt(empId), ModuleName: "CompensatoryOff", Date: date }, function (response) {
            if (response.status) {
                var values = JSON.parse(response.data);
                if (values != null && values?.length > 0) {
                    var ValuesOfAval = parseInt(values[0][0].Remaining);
                    var FinalValuesOfAval = ValuesOfAval + 1;
                    $('#AvlCompOff').val(FinalValuesOfAval);
                    originalvalue = values[0][0].Remaining;
                }
            }
            if ($('#ComhalfDay').is(':checked')) {
                $('#RemainingCompensatoryOff').val(originalvalue + 0.5);
            }
        });
    }
}