var permissionId = 0;
var remHours;

$(document).ready(function () {
    Common.bindDropDownParent('PerEmployeeId', 'FormPermission', 'Employee');

    $('#SavePermission').click(function () {
        if ($('#FormPermission').valid()) {
            var objvalue = {};

            objvalue.PermissionId = permissionId == 0 ? null : permissionId;
            objvalue.Type = $('#Type').val();
            objvalue.EmployeeId = Common.parseInputValue('PerEmployeeId');
            objvalue.NumberOfHours = $('#NoOfHoursId').val();
            objvalue.Date = $('#PermissionDate').val();
            objvalue.StartTime = $('#StartTime').val();
            objvalue.EndTime = $('#EndTime').val();
            objvalue.PermissionStatusId = Common.parseInputValue('PermissionStatusId');
            objvalue.Description = Common.parseStringValue('PermissionDescription');
            objvalue.Comments = $('#FormPermission #Comments').val() == "" ? null : $('#FormPermission #Comments').val();

            Common.ajaxCall("POST", "/Permission/InserUpdatetPermission", JSON.stringify(objvalue), InsertSuccessPermission, null);
        }
    });

    $('#AddLeave').click(function () {
        if ($('#Permission-TabBtn').hasClass('active')) {
            permissionId = 0;
            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $("#PermissionCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#PermissionCanvas").css("width", "50%");
            } else {
                $("#PermissionCanvas").css("width", "39%");
            }
            $('#fadeinpage').addClass('fadeoverlay');
            Common.removevalidation('FormPermission');
            $('#SavePermission').show();
            $('#SavePermission').text('Save').removeClass('btn-update').addClass('btn-success');
            $('#PermissionHeader').text('Add Permission');
            $('#StartTime').prop('disabled', true);
            $('#StartTime').css('background-color', 'rgb(233, 236, 239)');
            $('#LableChange').text('Description');
            $('#StatusPerCol').hide();
            $('#PermissionComments').hide();
            $('#Type').prop('disabled', false);
            $('#Comments').val('');
            $('#PerEmployeeId').val(null).trigger('change');
            $('#NoOfHoursId').prop('disabled', true);
            $('#PermissionDate').prop('disabled', false);
            if (isAdminAccess != "True") {
                $('#PerEmployeeId').val(UserId).trigger('change');
                $('#PerEmployeeId').prop('disabled', true);
            }
            $('#PermissionDescCol').removeClass('col-md-6 col-lg-6 col-sm-6 col-6').addClass('col-md-12 col-lg-12 col-sm-12 col-12');
        }
    });

    $(document).on('click', '.btn-edit', function () {
        if ($('#Permission-TabBtn').hasClass('active')) {
            Common.removevalidation('FormPermission');
            $('#SavePermission').show();
            permissionId = $(this).data('id');
            $('#SavePermission').text('Update').removeClass('btn-success').addClass('btn-update');
            $('#PermissionHeader').text('Permission Info');
            $('#StatusPerCol').show();
            if (isAdminAccess != "True") {
                $('#PerEmployeeId').prop('disabled', true);
            }
            $('#PerEmployeeId').val(null).trigger('change');
            $('#PermissionDescCol').removeClass('col-md-12 col-lg-12 col-sm-12 col-12').addClass('col-md-6 col-lg-6 col-sm-6 col-6');

            Common.ajaxCall("POST", "/Leave/GetStatus", JSON.stringify({ ModuleName: 'PermissionStatus', ModuleId: permissionId }), function (response) {
                Common.bindDropDownSuccess(response.data, 'PermissionStatusId');
                Common.ajaxCall("GET", "/Permission/GetPermission", { PermissionId: permissionId, }, editSuccessPermission, null);
            }, null);
        }
    });

    $(document).on('click', '.btn-delete', async function () {
        if ($('#Permission-TabBtn').hasClass('active')) {
            var response = await Common.askConfirmation();
            if (response == true) {
                var DelpermissionId = $(this).data('id');
                Common.ajaxCall("GET", "/Permission/DeletePermission", { PermissionId: DelpermissionId }, InsertSuccessPermission, null);
            }
        }
    });

    $('#NoOfHoursId').on('change', function () {
        var NoOfHours = $(this).val();
        if (NoOfHours != "") {
            $('#StartTime').prop('disabled', false);
            $('#StartTime').css('background-color', 'rgb(255, 255, 255)');
            calculateEndTime();

            let noOfMinutes = parseTime(NoOfHours);
            let remMinutes = parseTime(remHours);

            let remCal = noOfMinutes - remMinutes;

            const totalMinutes = Math.abs(remCal);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            let formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

            $('#RemainingHours').val(formattedTime + ' Hrs');
        }
    });

    $('#StartTime').on('change', function () {
        calculateEndTime();
    });

    $('.mydatetimepicker').mdtimepicker();

    $("#FormPermission").validate({
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
    $('#PermissionCanvas #CloseCanvas').click(function () {
        $("#PermissionCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('#PermissionStatusId').on('change', function () {
        if ($("#PermissionStatusId option:selected").text() == "Rejected" || $("#PermissionStatusId option:selected").text() == "Cancelled") {
            $('#PermissionComments').show();
        } else {
            $('#PermissionComments').hide();
            $('#Comments').val('');
        }
    });

    $('#PerEmployeeId,#PermissionDate,#Type').on('change', function () {
        if ($('#PerEmployeeId').val() != "" && $('#Date').val() != "") {
            var empId = $('#PerEmployeeId').val();
            var date = $('#PermissionDate').val();
            var type = $('#Type').val();
            if (empId != "" && date != "" && type != "") {
                Common.ajaxCall("GET", "/Leave/GetRemainingDetails", { ModuleId: permissionId == 0 ? null : permissionId, Type: type, EmployeeId: parseInt(empId), ModuleName: "Permission", Date: date }, function (response) {
                    if (response.status) {
                        Common.bindDropDownSuccess(response.data, "NoOfHoursId");
                        $('#NoOfHoursId').prop('disabled', false);
                        var data = JSON.parse(response.data);
                        $('#RemainingHours').val(data[1][0].RemainingHours);
                        remHours = data[1][0].RemainingHours;
                        if (data[0][0].RemainingPermissionId == null)
                            $('#SavePermission').hide();
                        else
                            $('#SavePermission').show();
                    }
                }, null);
            }
        }
    });

    $('#Type').on('change', function () {
        var thisval = $(this).val();
        if (thisval == "1")
            $('#LableChange').text('Permission Description');
        else if (thisval == "2")
            $('#LableChange').text('CompOff Description');
        else
            $('#LableChange').text('Description');
        //$('#FormPermission  #PerEmployeeId').val(null).trigger('change');
        $('#FormPermission #RemainingHours').val('');
        $('#FormPermission #PermissionDate').val('');
        $('#FormPermission #NoOfHoursId').val('');
        $('#FormPermission #StartTime').val('');
        $('#StartTime').prop('disabled', true);
        $('#StartTime').css('background-color', 'rgb(233, 236, 239)');
        $('#FormPermission #EndTime').val('');
        $('#FormPermission #PermissionDescription').val('');
    });
});

function PermissionSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $('#permissionTblCol').html('<table class="table table-rounded dataTable data-table table-striped tableResponsive" id="PermissionTable"></table>');

        //$("#CounterTextBox1").text(CounterBox[0]);
        //$("#CounterTextBox2").text(CounterBox[1]);
        //$("#CounterTextBox3").text(CounterBox[2]);
        //$("#CounterTextBox4").text(CounterBox[3]);

        //$('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        //$('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        //$('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        //$('#CounterValBox4').text(data[0][0][CounterBox[3]]);
         
        $("#CounterTextBox1").text('Total');
        $("#CounterTextBox2").text('Requested');
        $("#CounterTextBox3").text('Approved');
        $("#CounterTextBox4").text('Rejected');

        $('#CounterValBox1').text('113');
        $('#CounterValBox2').text('25');
        $('#CounterValBox3').text('59');
        $('#CounterValBox4').text('29');


        var columns = Common.bindColumn(data[1], ['PermissionId', 'Status_Color']);
        Common.bindTable('PermissionTable', data[1], columns, -1, 'PermissionId', '330px', true, accessPermission);

        $('#permissionTblCol').show();
        $('#leaveTblCol').hide();
    }
}

function editSuccessPermission(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#PermissionCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#PermissionCanvas").css("width", "50%");
        } else {
            $("#PermissionCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        Common.bindParentData(data[0], 'FormPermission');
        $('#PerEmployeeId').val(data[0][0].EmployeeId).trigger('change');
        if ($('#NoOfHoursId').val() != "") {
            $('#StartTime').prop('disabled', false);
            $('#StartTime').css('background-color', 'rgb(255, 255, 255)');

            calculateEndTime();
        }

        $("#PermissionStatusId option").each(function () {
            if ($(this).val() !== "" && $(this).val() < data[0][0].PermissionStatusId) {
                $(this).remove();
            }
        });

        let formattedDate;
        try {
            const [day, month, year] = data[0][0].PermissionDate.split("-");
            const rawDate = new Date(`${year}-${month}-${day}`); // Reformatted to ISO
            if (isNaN(rawDate.getTime())) throw new Error("Invalid date format");
            formattedDate = rawDate.toISOString().split('T')[0]; // "yyyy-MM-dd"
        } catch (e) {
            console.error("Invalid PermissionDate:", data[0][0].PermissionDate);
            formattedDate = null;
        }

        Common.ajaxCall("GET", "/Leave/GetRemainingDetails", { ModuleId: permissionId == 0 ? null : permissionId, Type: data[0][0].Type, EmployeeId: parseInt(data[0][0].EmployeeId), ModuleName: "Permission", Date: formattedDate }, function (response) {
            if (response.status) {
                Common.bindDropDownSuccess(response.data, "NoOfHoursId");
                $('#NoOfHoursId').val(data[0][0].NoOfHours);
                $('#RemainingHours').val(data[1][0].RemainingHours);
            }
        }, null);

        if (isAdminAccess != "True") {
            if ($("#PermissionStatusId option:selected").text() == "Approved") {
                $('#Type,#PermissionDate,#NoOfHoursId,#StartTime').prop('disabled', true);
                $('#StartTime').css('background-color', 'rgb(233, 236, 239)');
            } else if ($("#PermissionStatusId option:selected").text() == "Rejected") {
                $('#Type,#PermissionDate,#NoOfHoursId,#StartTime,#LeaveStatusId').prop('disabled', true);
                $('#StartTime').css('background-color', 'rgb(233, 236, 239)');
            } else {
                $('#Type,#PermissionDate,#NoOfHoursId,#StartTime').prop('disabled', false);
                $('#StartTime').css('background-color', 'rgb(225, 225, 225)');
            }
        }
    }
}

function InsertSuccessPermission(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#PermissionCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.ajaxCall("GET", "/Permission/GetPermission", { PermissionId: null, }, PermissionSuccess, null);
    } else {
        Common.errorMsg(response.message);
    }
}

function calculateEndTime() {
    const startTime = $('#StartTime').val();
    const duration = $('#NoOfHoursId').val();

    if (!startTime || !duration) return;

    const { hours, minutes } = convertTo24Hour(startTime);
    const totalStartMins = hours * 60 + minutes;
    const durationMins = getDurationInMinutes(duration);
    const endTotalMins = totalStartMins + durationMins;

    const endHours = Math.floor(endTotalMins / 60) % 24;
    const endMinutes = endTotalMins % 60;

    const endTimeFormatted = convertTo12Hour(endHours, endMinutes);
    $('#EndTime').val(endTimeFormatted);
}

function convertTo24Hour(timeStr) {
    let [time, meridian] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (meridian === 'PM' && hours !== 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
}

function convertTo12Hour(hours, minutes) {
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    let minStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minStr} ${ampm}`;
}

function getDurationInMinutes(durationStr) {
    if (durationStr.includes('Min')) {
        return parseInt(durationStr.split(':')[1].trim());
    } else if (durationStr.includes('Hrs')) {
        let [h, m] = durationStr.replace('Hrs', '').split(':').map(Number);
        return h * 60 + m;
    } else if (durationStr.includes(':')) {
        let [h, m] = durationStr.split(':').map(Number);
        return h * 60 + m;
    }
    return 0;
}

function parseTime(str) {
    str = str.replace(/[^0-9:]/g, '');
    const [hours, minutes] = str.split(':').map(Number);
    return hours * 60 + minutes;
}
