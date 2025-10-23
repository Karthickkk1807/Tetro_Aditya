var employeeId = 0;
var formDataMultiple = new FormData();
var deletedFiles = [];
var nonEditable = true;

$(document).ready(function () {
    const LabelTextForRequired = [{ ClassName: '.InsuNoLable', Text: 'Insurance Number' }, { ClassName: '.ValidFromLable', Text: 'Valid From' }, { ClassName: '.ExpiredOnLable', Text: 'Expired On' }];
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    $('#IsLoginUserdiv').hide();
    Common.ajaxCall("GET", "/HumanResource/Get", { EmployeeTypeId: 1, EmployeeId: null, FranchiseId: FranchiseMappingId }, employeeSuccess, null);
    Common.ajaxCall("GET", "/HumanResource/GetDocumentDetails", null, documentSuccess, null);

    Common.bindDropDownParent('EmployeeTypeId', 'FormEmployee', 'EmployeeType');
    Common.bindDropDownParent('EmployeeStatusId', 'FormEmployee', 'EmployeeStatus');
    Common.bindDropDownParent('GenderId', 'FormEmployee', 'Gender');
    Common.bindDropDownParent('ReligionId', 'FormEmployee', 'Religion');
    Common.bindDropDownParent('MaritalStatusId', 'FormEmployee', 'MaritalStatus');
    Common.bindDropDownParent('PayTypeId', 'FormEmployee', 'PayType');
    Common.bindDropDownParent('PaymentTypeId', 'FormEmployee', 'PaymentType');
    Common.bindDropDownParent('ShiftId', 'FormEmployee', 'Shift');
    Common.bindDropDownParent('DepartmentId', 'FormEmployee', 'Department');
    Common.bindDropDownParent('UserGroupId', 'FormEmployee', 'EmployeeUserGroup');
    Common.bindDropDownParent('UserTypeId', 'FormEmployee', 'EmployeeUserType');
    Common.bindDropDownMulti('AttendanceMachineId', 'AttendanceMachine');

    Common.inputMaxDateNotAllow('DateOfBirth');

    $('#ReportingPersonId').select2({
        dropdownParent: $('#FormEmployee'),
        width: '100%'
    }).on('select2:open', function () {
        $('.select2-container').css('z-index', 1100);
    });

    $('#ReportingPersonId').val('').trigger('change');

    let today = new Date().toISOString().split('T')[0];
    //$('#DateOfJoining').attr('max', today);
    $('#DateOfJoining').val(today);
    $('#MachinesHide').hide();
    $(document).on('focus', ':input', function () {
        $(this).attr('autocomplete', 'no-' + Math.random());
    });

    $('.MainErrorLable').hide();

    $('#ReportingPersonId').on('change', function () {
        const selected = $(this).val(); // Gets an array or null

        if (selected && selected.length > 0) {
            // Valid selection
            $(this).removeClass('error');
            $('#ReportingPersonId-error').hide();
        } else {
            // No selection
            $(this).addClass('error');
            $('#ReportingPersonId-error').show();
        }
    });


    var aadhaarAttached = false;
    $(document).on('click', '#SaveEmployee', function (e) {
        if ($('#EmployeeTypeId').val() == "") {
            //$('.employee-avatar-upload .avatar-edit input + label').css('top', '-32px');
        }

        if (!Common.validateEmailwithErrorwithParent('FormEmployee', 'Email')) {
            return false;
        }

        e.preventDefault();
        var isFormValid = validateFormAccordions('.accordion');

        var FullFormValiadtion = true;
        if (!$("#FormEmployee").valid()) {
            FullFormValiadtion = false;
            return false;
        }

        $('.fileInput').each(function () {
            var $parentCard = $(this).closest('.col-lg-6, .col-md-6, .col-sm-12, .col-12');
            var labelText = $parentCard.find('label b').text().trim();

            if (labelText === "Attach AadhaarCard") {
                var $selectedUl = $parentCard.find('ul[id^="selectedFiles"]');
                var $existUl = $parentCard.find('ul[id^="ExistselectedFiles"]');

                var selectedFilesCount = $selectedUl.find('li').length;
                var existFilesCount = $existUl.find('li').length;

                if (selectedFilesCount > 0 || existFilesCount > 0) {
                    aadhaarAttached = true;
                } else {
                    aadhaarAttached = false;
                }
            }
        });

        if (FullFormValiadtion && isFormValid && aadhaarAttached) {
            $('.MainErrorLable').hide();
            //$('#SaveEmployee').html('Save <i class="fa fa-spinner fa-spin"></i> ');
            var EmployeeDataUpdate = JSON.parse(JSON.stringify(jQuery('#FormEmployee').serializeArray()));
            var objvalue = {};
            $.each(EmployeeDataUpdate, function (index, item) {
                objvalue[item.name] = item.value;
            });
            if ($('#imageUploadlabel-manageuser2').get(0).files?.length > 0) {
                objvalue.EmployeeImage = $("#imageUploadlabel-manageuser2").get(0).files[0].name.split('.').pop();
            }

            var AttendanceMachineMapping = [];
            var attendanceMachineId = $('#AttendanceMachineId').val();
            if (attendanceMachineId && typeof attendanceMachineId === 'object' && attendanceMachineId.length > 0) {
                var attendanceMachineIdArray = Array.from(attendanceMachineId);
                attendanceMachineIdArray.forEach(function (machine) {
                    var parsedmachine = parseInt(machine.trim(), 10);
                    if (!isNaN(parsedmachine)) {
                        AttendanceMachineMapping.push({
                            EmployeeDeviceMappingId: null,
                            EmployeeId: employeeId == 0 ? null : employeeId,
                            AttendanceMachineId: parsedmachine,
                            IsBlock: false
                        });
                    }
                });
            }
            var dateOfJoining = $('#DateOfJoining').val();
            dateOfJoining = new Date(dateOfJoining);

            var EmployeeReportingPersonMappingDetails = [];
            let selectedIds = $('#ReportingPersonId').val() || [];
            let intSelectedIds = selectedIds.map(function (id) {
                return parseInt(id, 10);
            });

            intSelectedIds.forEach(function (poId) {
                EmployeeReportingPersonMappingDetails.push({
                    EmployeeReportingPersonMappingId: null,
                    EmployeeId: employeeId == 0 ? null : employeeId,
                    ReportingPersonId: parseInt(poId)
                });
            });


            objvalue.EmployeeId = employeeId == 0 ? null : employeeId;
            objvalue.EmployeeCompanyId = $('#EmployeeCompanyId').val();
            objvalue.EmployeeImage = $('#imageUploadlabel-manageuser2').get(0)?.files[0]?.name;
            objvalue.ExistingImage = $('#ExistingImage').text();
            objvalue.DateOfjoining = dateOfJoining;
            objvalue.EmployeeTypeId = Common.parseInputValue('EmployeeTypeId');
            objvalue.EmployeeStatusId = Common.parseInputValue('EmployeeStatusId') || null;
            objvalue.ShiftId = Common.parseInputValue('ShiftId');
            objvalue.DepartmentId = Common.parseInputValue('DepartmentId');

            objvalue.IsInsuranceApplicable = $('#IsInsuranceApplicable').is(':checked');
            objvalue.InsuranceNumber = Common.parseStringValue('InsuranceNumber');
            objvalue.InsuranceDate = Common.stringToDateTimeSendTimeAlso('InsuranceDate') || null;
            objvalue.ExpiryDate = Common.stringToDateTimeSendTimeAlso('ExpiryDate') || null;

            objvalue.EmployeeESINumber = Common.parseFloatInputValue('EmployeeESINumber');
            objvalue.EmployeeESIContribution = Common.parseFloatInputValue('EmployeeESIContribution');
            objvalue.EmployeeContribution = Common.parseFloatInputValue('EmployeeContribution');
            objvalue.PayTypeId = Common.parseInputValue('PayTypeId');
            objvalue.CTC = Common.parseFloatInputValue('CTC');
            objvalue.CashAmount = Common.parseFloatInputValue('CashAmount');
            objvalue.AccountAmount = Common.parseFloatInputValue('AccountAmount');
            objvalue.PayGroupId = Common.parseInputValue('PayGroupId');
            objvalue.EmployeeContribution = Common.parseFloatInputValue('EmployeeContribution');
            objvalue.EmployerContribution = Common.parseFloatInputValue('EmployerContribution');
            objvalue.ESIEmployeeContribution = Common.parseFloatInputValue('ESIEmployeeContribution');
            objvalue.ESIEmployerContribution = Common.parseFloatInputValue('ESIEmployerContribution');
            objvalue.IsPFApplicable = $('#IsPFApplicable').is(':checked');
            objvalue.IsESIApplicable = $('#IsESIApplicable').is(':checked');
            objvalue.UANNumber = $('#UANNumber').val();
            objvalue.PFNumber = $('#PFNumber').val();
            objvalue.FranchiseId = parseInt(localStorage.getItem('FranchiseId'));

            objvalue.UserTypeId = Common.parseInputValue('UserTypeId');
            objvalue.UserGroupId = Common.parseInputValue('UserGroupId');
            objvalue.IsLoginUser = $('#IsLoginUser').is(':checked');

            if (objvalue.EmployeeImage == undefined) {
                objvalue.EmployeeImage = null;
            }


            let fileDetails = [];
            let existFile = [];

            $('#appendDocument .fileInput').each(function () {
                let documentId = $(this).data('id');
                let inputId = $(this).attr('id');
                let uniqueId = inputId.replace('fileInput', '');
                let relatedListId = '#ExistselectedFiles' + uniqueId;

                $(relatedListId).find('li').each(function () {
                    let fileName = $(this).data('id');
                    let dataPath = $(this).find('.download-button').data('path');
                    let spanDocumentId = $(this).find('span').data('id');

                    let mappingId = $(this).find('.download-button').data('id');

                    if (fileName && fileName !== "null" && fileName !== "") {
                        if (spanDocumentId == 0) {
                            fileDetails.push({
                                DocumentId: parseInt(documentId),
                                DocumentFileName: fileName
                            });
                        }
                        if (spanDocumentId == 1) {
                            existFile.push({
                                EmployeeDocumentMappingId: parseInt(mappingId),
                                EmployeeId: employeeId == 0 ? null : employeeId,
                                DocumentId: parseInt(documentId),
                                DocumentFileName: fileName,
                                DocumentFilePath: dataPath,
                                AttachmentExactFileName: fileName
                            });
                        }
                    }
                });
            });


            formDataMultiple.append("StaticData", JSON.stringify(objvalue));
            formDataMultiple.append("AttendanceMachineMapping", JSON.stringify(AttendanceMachineMapping));
            formDataMultiple.append("EmployeeReportingPersonMappingDetails", JSON.stringify(EmployeeReportingPersonMappingDetails));
            formDataMultiple.append("documentName", JSON.stringify(fileDetails));
            formDataMultiple.append("Exist", JSON.stringify(existFile));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));

            $.ajax({
                type: "POST",
                url: "/HumanResource/InsertEmployee",
                data: formDataMultiple,
                contentType: false,
                processData: false,
                success: function (response) {
                    formDataMultiple = new FormData();
                    if (response.status == true) {
                        Common.successMsg(response.message);
                        imageguid = response.data;
                        $("#employeeCanvas").css("width", "0%");
                        $('#fadeinpage').removeClass('fadeoverlay');
                        var employeeTypeId = 0;
                        if ($('#Permanent-TabBtn').hasClass('active')) {
                            employeeTypeId = 1;
                        } else if ($('#Labour-TabBtn').hasClass('active')) {
                            employeeTypeId = 2;
                        }
                        $('#ReportingPersonId').val('').trigger('change');
                        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
                        Common.ajaxCall("GET", "/HumanResource/Get", { EmployeeTypeId: employeeTypeId, EmployeeId: null, FranchiseId: FranchiseMappingId }, employeeSuccess, null);
                        var fileUpload = $("#imageUploadlabel-manageuser2").get(0);
                        var files = fileUpload.files;
                        Common.fileupload(files, imageguid, null);
                    } else {
                        formDataMultiple = new FormData();
                        Common.errorMsg(response.message);

                    }
                },
                error: function (response) {
                    Common.errorMsg(response.message);
                }
            });
        } else {
            if (!aadhaarAttached) {
                Common.warningMsg("Please attach the Aadhaar Card.");
            }
        }
    });

    $(".accordion").on("click", ".accordion-header a", function (e) {
        e.preventDefault();
        var target = $(this).attr('data-target');
        var targetCollapse = $(target);

        $(".accordion-item .collapse").not(targetCollapse).collapse('hide');

        targetCollapse.collapse('toggle');
    });

    $(document).on('click', '#EmployeeTable .btn-edit', function () {
        $('#fadeinpage').addClass('fadeoverlay');
        $('.MainErrorLable').hide();
        $('#MachinesHide').hide();
        Common.removevalidation('FormEmployee');
        $('#SaveEmployee').text('Update').removeClass('btn-success').addClass('btn-update');
        $('#employeeHeader').text('Edit Employee Details');
        $('#AttendanceMachineId').val('').trigger('change');
        $('#ReportingPersonId').val('').trigger('change');
        $('#EmployeeStatusCol').show();

        const LabelTextForRequired = [{ ClassName: '.InsuNoLable', Text: 'Insurance Number' }, { ClassName: '.ValidFromLable', Text: 'Valid From' }, { ClassName: '.ExpiredOnLable', Text: 'Expired On' }];
        LabelTextForRequired.forEach(item => {
            $(`${item.ClassName}`).html(`${item.Text}`);
        });

        employeeId = $(this).data('id');
        nonEditable = false;
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        Common.ajaxCall("GET", "/HumanResource/Get", { EmployeeTypeId: null, EmployeeId: employeeId, FranchiseId: FranchiseMappingId }, editSuccess, null);
        $('#employeeCanvas .collapse').removeClass('show');
        $('#collapse1').addClass('show');
        $('.attachcolumn ul').empty("")
    });

    $(document).on('click', '#EmployeeTable .btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var employeeId = $(this).data('id');
            Common.ajaxCall("GET", "/HumanResource/Delete", { EmployeeId: employeeId }, InsertSuccess, null);
        }
    });


    $(document).on('click', '#AddEmployee', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#employeeCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#employeeCanvas").css("width", "50%");
        } else {
            $("#employeeCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('.MainErrorLable').hide();
        Common.removevalidation('FormEmployee');
        Common.bindDropDownMulti('AttendanceMachineId', 'AttendanceMachine');
        $('#MachinesHide').show();
        $('#EmpImage').attr('src', "/assets/commonimages/user.png");
        $('#SaveEmployee').text('Save').removeClass('btn-update').addClass('btn-success');
        $('#employeeHeader').text('Add Employee Details');
        $('#ReportingPersonId').prop('disabled', true);
        $('#PayGroupId').prop('disabled', true).empty().append('<option value="">--Select--</option>');
        $('#CTClabel').html('Salary <span id="Asterisk">*</span>');
        $('#CTC').attr('placeholder', 'Salary');
        $('#ReportingPersonId').val('').trigger('change');
        employeeId = 0;
        $('#EmployeeStatusCol').hide();
        $('#UANNumber,#PFNumber,#EmployeeContribution,#EmployeerContribution,#EmployerContribution').prop('disabled', true);
        $('#ESINumber,#ESIEmployeeContribution,#ESIEmployerContribution').prop('disabled', true);
        $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').prop('disabled', true);
        $('#ExistingImage').text("");
        $('#State').val('Tamil Nadu');
        $('#Country').val('India');
        $('#employeeCanvas .collapse').removeClass('show');
        $('#collapse1').addClass('show');
        $('.attachcolumn ul').empty("");
        $('.custom-file-input').prop('disabled', false);
        $('#ReportingPersonId').select2({
            dropdownParent: $('#FormEmployee'),
            width: '100%',
            placeholder: '--Select Reporting Person--'
        }).trigger('change');

        const LabelTextForRequired = [{ ClassName: '.InsuNoLable', Text: 'Insurance Number' }, { ClassName: '.ValidFromLable', Text: 'Valid From' }, { ClassName: '.ExpiredOnLable', Text: 'Expired On' }];
        LabelTextForRequired.forEach(item => {
            $(`${item.ClassName}`).html(`${item.Text}`);
        });

    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#employeeCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('.imageUpload2-manageuser').change(function () {
        var input = $(this)[0];
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#EmpImage').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    });

    $('#ToggleEye').click(function () {
        var passwordField = $('#Password');
        var icon = $(this);
        togglePassword(passwordField, icon);
    });

    $(document).on("input", '#FormEmployee #Email', function (event) {
        if (Common.validateEmailwithErrorwithParent('FormEmployee', 'Email')) {
            $('#FormEmployee #Email-error').remove();
        }
    });

    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });

    $('#IsPFApplicable').on('change', function () {
        if ($('#IsPFApplicable').is(':checked')) {
            $('#UANNumber,#PFNumber,#EmployeeContribution,#EmployeerContribution,#EmployerContribution').prop('disabled', false);
        } else {
            $('#UANNumber,#PFNumber,#EmployeeContribution,#EmployeerContribution,#EmployerContribution').prop('disabled', true);
            $('#UANNumber,#PFNumber,#EmployeeContribution,#EmployeerContribution,#EmployerContribution').val("");
        }
    });

    $('#IsESIApplicable').on('change', function () {
        if ($('#IsESIApplicable').is(':checked')) {
            $('#ESINumber,#ESIEmployeeContribution,#ESIEmployerContribution').prop('disabled', false);
        } else {
            $('#ESINumber,#ESIEmployeeContribution,#ESIEmployerContribution').prop('disabled', true);
            $('#ESINumber,#ESIEmployeeContribution,#ESIEmployerContribution').val("");
        }
    });

    $('#Permanent-TabBtn').on('click', function () {
        $('#tableFilter').val('');
        Common.ajaxCall("GET", "/HumanResource/Get", { EmployeeTypeId: 1, EmployeeId: null, FranchiseId: FranchiseMappingId }, employeeSuccess, null);
    });

    $('#Labour-TabBtn').on('click', function () {
        $('#tableFilter').val('');
        Common.ajaxCall("GET", "/HumanResource/Get", { EmployeeTypeId: 2, EmployeeId: null, FranchiseId: FranchiseMappingId }, employeeSuccess, null);
    });

    $('#IsInsuranceApplicable').on('change', function () {
        const LabelTextForRequired = [{ ClassName: '.InsuNoLable', Text: 'Insurance Number' }, { ClassName: '.ValidFromLable', Text: 'Valid From' }, { ClassName: '.ExpiredOnLable', Text: 'Expired On' }];
        if ($('#IsInsuranceApplicable').is(':checked')) {
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').prop('disabled', false);
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').attr('required', true);
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').removeClass('is-invalid error');
            LabelTextForRequired.forEach(item => {
                $(`${item.ClassName}`).html(`${item.Text} <span id="Asterisk">*</span>`);
            });
        } else {
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').prop('disabled', true);
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').attr('required', false);
            $('#InsuranceNumber-error, #InsuranceDate-error, #ExpiryDate-error').hide();
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').removeClass('is-invalid error');
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').val("");
            LabelTextForRequired.forEach(item => {
                $(`${item.ClassName}`).html(`${item.Text}`);
            });
        }
    });

    $(document).on('click', '.download-button', function (e) {
        e.preventDefault();
        let path = $(this).data('path');
        if (path) {
            const link = document.createElement('a');
            link.href = path;
            link.download = '';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }
    });

    $(document).on('click', '.delete-button', function (e) {
        e.preventDefault();

        var listItem = $(this).closest('li');
        var fileText = listItem.attr('data-id');
        var filePath = $(this).closest('li').find('.download-button').data('path');
        var mappingId = $(this).closest('li').find('.download-button').data('id');
        var docId = $(this).closest('ul').data('document-id');

        deletedFiles.push({
            EmployeeDocumentMappingId: mappingId ?? null,
            EmployeeId: null,
            DocumentId: docId ?? null,
            DocumentFileName: fileText,
            DocumentFilePath: filePath
        });
        const listId = $(this).closest('ul').attr('id');
        const suffix = listId.replace('ExistselectedFiles', '');
        const inputId = `fileInput${suffix}`;

        $(`#${inputId}`).prop('disabled', false);
        $(listItem).remove();

    });

    $('#PayGroupId').on('change', function () {
        var payGroup = $('#PayGroupId option:selected').text();
        if (payGroup == "Monthly") {
            $('#CTClabel').html('Monthly Salary <span id="Asterisk">*</span>');
            $('#CTC').attr('placeholder', 'Monthly Salary');
        } else {
            $('#CTClabel').html('Daily Salary <span id="Asterisk">*</span>');
            $('#CTC').attr('placeholder', 'Daily Salary');
        }
    });

    //$('#DateOfJoining').on('change', function () {
    //    let selectedDate = new Date($(this).val());
    //    let today = new Date();

    //    // Remove the time part for accurate comparison
    //    selectedDate.setHours(0, 0, 0, 0);
    //    today.setHours(0, 0, 0, 0);

    //    if (selectedDate > today) {
    //        alert('Future dates are not allowed for Date Of Joining.');
    //        $(this).val(''); // Clear the invalid date
    //    }
    //});

    $('#EmployeeTypeId').on('change', function () {
        var employeeType = $(this).val();
        //$('.employee-avatar-upload .avatar-edit input + label').css('top', '-5px');
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        if (employeeType != "" && nonEditable) {
            Common.ajaxCall("GET", "/HumanResource/GetAutoGenerateId", { FranchiseId: FranchiseMappingId, EmployeeTypeId: parseInt(employeeType) }, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    $('#EmployeeCompanyId').val(data[0][0].EmployeeCompanyId);
                }
            }, null);
            Common.ajaxCall("GET", "/HumanResource/GetPayTypePayGroup", { EmployeeTypeId: parseInt(employeeType) }, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    $('#PayTypeId').val(data[0][0].PayTypeId).trigger('change');
                    //$('#PayGroupId').val(data[0][0].PayGroupId);
                }
            }, null);

            Common.ajaxCall("GET", "/HumanResource/GetUserTypeId", { PayTypeId: parseInt(employeeType) }, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    $('#UserTypeId').val(data[0][0].UserTypeId);
                    $('#UserGroupId').val(data[0][0].UserGroupId);
                }
            }, null);
        }

        if ($('#EmployeeTypeId option:selected').text() == "Permanent") {
            $('#IsLoginUser').prop({ checked: true, disabled: true });
            $('#IsInsuranceApplicableDiv,#InsuranceNumberDiv,#InsuranceDateDiv,#ExpiryDateDiv,#ESIDetailsDiv,#PFDetailsDiv').show();
            $('#AccPayment').prop('disabled', false).val('');
            $('#IsLoginUserdiv').hide();

        } else {

            $('#IsLoginUser').prop({ checked: false, disabled: true });
            $('#IsInsuranceApplicableDiv,#InsuranceNumberDiv,#InsuranceDateDiv,#ExpiryDateDiv,#ESIDetailsDiv,#PFDetailsDiv').hide();
            $('#AccPayment').prop('disabled', true).val(0);
            $('#IsLoginUserdiv').hide();
        }
    });

    $('#DepartmentId').on('change', function () {
        var department = $(this).val();
        if (department != "" && nonEditable) {
            Common.ajaxCall("GET", "/HumanResource/GetReportingPerson", { DepartmentId: parseInt(department) }, function (response) {
                if (response.status) {
                    Common.bindDropDownSuccess(response.data, "ReportingPersonId");
                    $('#ReportingPersonId').prop('disabled', false);
                }
            }, null);
        }
    });

    $('#PayTypeId').on('change', function () {
        var payTypeId = $(this).val();
        if (payTypeId != "" && nonEditable) {
            Common.ajaxCall("GET", "/HumanResource/GetPayGroup", { PayTypeId: parseInt(payTypeId) }, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    Common.bindDropDownSuccess(response.data, "PayGroupId");
                    $('#PayGroupId').prop('disabled', false);
                    $('#PayGroupId').val(data[0][0].PayGroupId);
                }
            }, null);
        }
        if (payTypeId == 1) {
            $('#CTClabel').html('Daily Salary <span id="Asterisk">*</span>');
            $('#CTC').attr('placeholder', 'Daily Salary');
        } else {
            $('#PayGroupId').prop('disabled', true).empty().append('<option value="">--Select--</option>');
            $('#CTClabel').html('Salary <span id="Asterisk">*</span>');
            $('#CTC').attr('placeholder', 'Salary');
        }
    });

    $('#CTC').on('input', function () {
        let employeeType = $('#EmployeeTypeId').val();

        if (employeeType === '1') {
            $('#CashPayment').prop('disabled', false);
        } else {
            $('#CashPayment').prop('disabled', true).val($(this).val());
        }
    });


    $('#InsuranceDate').on('change', function () {
        var insuranceDate = $(this).val();
        //$('#ExpiryDate').attr('min', insuranceDate);
        //$('#ExpiryDate').val(insuranceDate);
    });

    $('#CashPayment, #AccPayment').on('input', function () {
        var cashPaymentValue = parseFloat($('#CashPayment').val()) || 0;
        var accPaymentValue = parseFloat($('#AccPayment').val()) || 0;
        var ctcValue = parseFloat($('#CTC').val()) || 0;

        var totalPayment = cashPaymentValue + accPaymentValue;

        if (totalPayment > ctcValue) {
            $('#CashPayment').val(ctcValue / 2);
            $('#AccPayment').val(ctcValue / 2);
        }
    });

});

function employeeSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $("#TotalEmployeesText").text(CounterBox[0]);
        $("#DayOffText").text(CounterBox[1]);
        $("#AtWorkText").text(CounterBox[2]);
        $("#ActiveAtCurrentShiftText").text(CounterBox[3]);

        $('#TotalEmployeesVal').text(data[0][0][CounterBox[0]]);
        $('#DayOffVal').text(data[0][0][CounterBox[1]]);
        $('#AtWorkVal').text(data[0][0][CounterBox[2]]);
        $('#ActiveAtCurrentShiftVal').text(data[0][0][CounterBox[3]]);

        var columns = Common.bindColumn(data[1], ['EmployeeId', 'EmployeeImage', 'Status_Color']);
        bindTable('EmployeeTable', data[1], columns, -1, 'EmployeeId', '335px', true, access);


        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();

        if (activeTabText.includes("Permanent")) {
            $('#CounterImage1').prop('src', '/assets/moduleimages/employee/employeepermanenticon_1.svg');
            $('#CounterImage2').prop('src', '/assets/moduleimages/employee/employeepermanenticon_2.svg');
            $('#CounterImage3').prop('src', '/assets/moduleimages/employee/employeepermanenticon_3.svg');
            $('#CounterImage4').prop('src', '/assets/moduleimages/employee/employeepermanenticon_4.svg');
        } else if (activeTabText.includes("Labour")) {
            $('#CounterImage1').prop('src', '/assets/moduleimages/employee/employeeiconlabour_1.svg');
            $('#CounterImage2').prop('src', '/assets/moduleimages/employee/employeeiconlabour_2.svg');
            $('#CounterImage3').prop('src', '/assets/moduleimages/employee/employeeiconlabour_3.svg');
            $('#CounterImage4').prop('src', '/assets/moduleimages/employee/employeeiconlabour_4.svg');
        } else {
            $('#CounterImage1').prop('src', '/assets/moduleimages/employee/employeeiconlabour_1.svg');
            $('#CounterImage2').prop('src', '/assets/moduleimages/employee/employeeiconlabour_2.svg');
            $('#CounterImage3').prop('src', '/assets/moduleimages/employee/employeeiconlabour_3.svg');
            $('#CounterImage4').prop('src', '/assets/moduleimages/employee/employeeiconlabour_4.svg');
        }
    }
}

function InsertSuccess(response) {
    var imageguid = "";
    if (response.status) {
        imageguid = response.data;
        Common.successMsg(response.message);
        $("#employeeCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');

        var employeeTypeId = 0;
        if ($('#Permanent-TabBtn').hasClass('active')) {
            $('#Permanent-TabBtn').click();
            employeeTypeId = 1;
        } else if ($('#Labour-TabBtn').hasClass('active')) {
            $('#Labour-TabBtn').click();
            employeeTypeId = 2;
        }
        $('#ReportingPersonId').prop('disabled', false);
        $('#PayGroupId').prop('disabled', false);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        Common.ajaxCall("GET", "/HumanResource/Get", { EmployeeTypeId: 1, EmployeeId: null, FranchiseId: FranchiseMappingId }, employeeSuccess, null);
        var fileUpload = $("#imageUploadlabel-manageuser2").get(0);
        var files = fileUpload.files;
        Common.fileupload(files, imageguid, null);
    }
    else {
        Common.errorMsg(response.message);
        if (employeeId == 0) {
            $('#SaveEmployee').html('Save');
        } else {
            $('#SaveEmployee').html('Update');
        }
    }
}


function togglePassword(passwordField, icon) {
    if (passwordField.attr('type') === 'password') {
        passwordField.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        passwordField.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
}


function editSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#employeeCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#employeeCanvas").css("width", "50%");
        } else {
            $("#employeeCanvas").css("width", "39%");
        }

        Common.ajaxCall("GET", "/HumanResource/GetReportingPerson", { DepartmentId: data[0][0].DepartmentId }, function (response) {
            if (response.status) {
                Common.bindDropDownSuccess(response.data, "ReportingPersonId");
                $('#ReportingPersonId').prop('disabled', false);
                Common.ajaxCall("GET", "/HumanResource/GetPayGroup", { PayTypeId: data[2][0].PayTypeId }, function (response) {
                    if (response.status) {

                        Common.bindParentData(data[0], 'FormEmployee');
                        Common.bindParentData(data[1], 'FormEmployee');
                        Common.bindParentData(data[2], 'FormEmployee');
                        Common.bindParentData(data[3], 'FormEmployee');
                        Common.bindParentData(data[4], 'FormEmployee');
                        nonEditable = true;

                        Common.bindDropDownSuccess(response.data, "PayGroupId");
                        $('#PayGroupId').val(data[2][0].PayGroupId).prop('disabled', false);

                        var payGroup = $('#PayGroupId option:selected').text();
                        if (payGroup == "Monthly") {
                            $('#CTClabel').html('Monthly Salary <span id="Asterisk">*</span>');
                        } else {
                            $('#CTClabel').html('Daily Salary <span id="Asterisk">*</span>');
                        }

                        if (Array.isArray(data[7]) && data[7].length > 0 && data[7][0].EmployeeReportingPersonMappingId != null) {
                            const ReportingPersonIdSelectedValues = data[7]
                                .filter(item => item && item.ReportingPersonId != null)
                                .map(item => item.ReportingPersonId.toString());

                            $('#ReportingPersonId').val(ReportingPersonIdSelectedValues).trigger('change');
                        }
                    }
                }, null);

            }
        }, null);

        const LabelTextForRequired = [{ ClassName: '.InsuNoLable', Text: 'Insurance Number' }, { ClassName: '.ValidFromLable', Text: 'Valid From' }, { ClassName: '.ExpiredOnLable', Text: 'Expired On' }];
        if (data[3][0].IsPFApplicable) {
            $('#UANNumber,#PFNumber,#EmployeeContribution,#EmployeerContribution,#EmployerContribution').prop('disabled', false);
            LabelTextForRequired.forEach(item => {
                $(`${item.ClassName}`).html(`${item.Text} <span id="Asterisk">*</span>`);
            });
        } else {
            $('#UANNumber,#PFNumber,#EmployeeContribution,#EmployeerContribution,#EmployerContribution').prop('disabled', true);
            LabelTextForRequired.forEach(item => {
                $(`${item.ClassName}`).html(`${item.Text}`);
            });
        }

        if (data[4][0].IsESIApplicable) {
            $('#ESINumber,#ESIEmployeeContribution,#ESIEmployerContribution').prop('disabled', false);
        } else {
            $('#ESINumber,#ESIEmployeeContribution,#ESIEmployerContribution').prop('disabled', true);
        }

        if (data[0] != null && data[0].length > 0 && data[0][0].EmployeeImage != null && data[0][0].EmployeeImage != "" && data[0][0].EmployeeImage) {
            $('#EmpImage').attr('src', data[0][0].EmployeeImage);
            $('#ExistingImage').text(data[0][0].EmployeeImage);
        } else {
            $('#EmpImage').attr('src', "/assets/commonimages/user.png");
        }

        if (data[1][0].IsInsuranceApplicable) {
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').prop('disabled', false);
        } else {
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').prop('disabled', true);
            $('#InsuranceNumber,#InsuranceDate,#ExpiryDate').val("");
        }

        $('#appendDocument').html("");
        let groupedDocs = {};

        $.each(data[6], function (index, file) {
            if (!groupedDocs[file.DocumentId]) {
                groupedDocs[file.DocumentId] = {
                    DocumentName: file.DocumentName,
                    Files: [],
                    DocumentId: file.DocumentId
                };
            }

            groupedDocs[file.DocumentId].Files.push({
                FileName: file.DocumentFileName,
                FilePath: file.DocumentFilePath,
                EmployeeDocumentMappingId: file.EmployeeDocumentMappingId
            });

        });

        $.each(groupedDocs, function (docId, docGroup) {
            let uniqueId = Math.random().toString(36).substring(2);

            let existingFilesHtml = '';
            let hasFile = false;
            $.each(docGroup.Files, function (i, file) {
                if (file.FileName && file.FileName !== 'null') {
                    hasFile = true;

                    let trimmedName = file.FileName.length > 11
                        ? file.FileName.substring(0, 11) + '...'
                        : file.FileName;

                    existingFilesHtml += `
                <li data-id="${file.FileName}" title="${file.FileName}">
                    <span data-id="1">${trimmedName}</span>
                    <button class="download-button"  data-id="${file.EmployeeDocumentMappingId}" data-path="${file.FilePath}"><i class="fas fa-download"></i></button>
                    <button class="delete-button"><i class="fas fa-trash"></i></button>
                </li>
            `;
                }
            });

            let isDisabled = hasFile ? 'disabled' : '';

            let html = `<div class="col-lg-6 col-md-6 col-sm-12 col-12" style="height: 120px;margin-top:5px;">
                            <div class="border border-radius" style="background-color:#F1F0EF; max-height:10.5rem; height: 100px;">
                                <label class="d-flex justify-content-center align-content-center mt-3" style="text-decoration:underline; color:#7D7C7C; white-space:nowrap;">
                                    <b>Attach ${docGroup.DocumentName}</b>
                                    <input type="file" id="fileInput${uniqueId}" data-id="${docGroup.DocumentId}" class="custom-file-input fileInput" ${isDisabled}    accept=".pdf, .xls, .xlsx, image/*">
                                </label>
                                <div class="file-preview d-flex justify-content-center" style="display: block;">
                                    <div class="attachrow" >
                                        <div class="attachcolumn">
                                            <ul class="row justify-content-center px-3 mb-2" id="selectedFiles${uniqueId}"></ul>
                                        </div>
                                        <div class="attachcolumn">
                                            <ul class="row justify-content-center px-3 mb-2" id="ExistselectedFiles${uniqueId}">
                                                ${existingFilesHtml}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

            $('#appendDocument').append(html);
            initializeAttachmentHandler(uniqueId);

        });
    }
}

function autoAdjustColumns(table) {
    var container = table.table().container();
    var resizeObserver = new ResizeObserver(function () {
        table.columns.adjust();
    });
    resizeObserver.observe(container);
}


function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "TetroONEnocount");
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }
    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

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
                        return `<td> ${editCondition ? `<div class="actionEllipsis"><i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-delete alert_delete"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></td></div>` : ''}`;
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


function validateFormAccordions(accordionSelector, errorMessageDefault = 'This field is required') {
    var isFormValid = true;
    var firstInvalidAccordion = null;
    $(accordionSelector).each(function () {
        var currentAccordion = $(this);
        var requiredFields = currentAccordion.find('input[required]:not(:disabled), select[required]:not(:disabled), textarea[required]:not(:disabled)');
        var isCurrentValid = true;

        requiredFields.each(function () {
            var input = $(this);
            var inputId = input.attr('id');
            var value = input.val();
            if (typeof value === 'string') {
                value = value.trim();
            }
            if (inputId === 'EmployeeStatusId' && employeeId === 0) {
                input.removeClass('is-invalid error');
                input.next('.invalid-feedback').remove();
                return;
            }
            if (!value) {
                input.addClass('is-invalid error');
                if (!input.next('.invalid-feedback').length) {
                    //input.after('<div class="invalid-feedback">' + errorMessage + '</div>');
                }
                isCurrentValid = false;
                isFormValid = false;
                if (!firstInvalidAccordion) {
                    firstInvalidAccordion = currentAccordion;
                }
            } else {
                input.removeClass('is-invalid error');
                input.next('.invalid-feedback').remove();
            }
        });
        if (isCurrentValid) {
            currentAccordion.find('.collapse').collapse('hide');
        }
    });

    if (firstInvalidAccordion) {
        firstInvalidAccordion.find('.collapse').collapse('show');
    }

    return isFormValid;
}



function documentSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        $.each(data[0], function (index, file) {
            let uniqueId = Math.random().toString(36).substring(2);

            var html = `<div class="col-lg-6 col-md-6 col-sm-12 col-12" style="height: 120px;margin-top:5px;">
                                                <div class=" border border-radius" style="background-color:#F1F0EF; max-height:10.5rem;height: 100px;">
                                                    <label class=" d-flex justify-content-center align-content-center mt-3 " style="text-decoration:underline; color:#7D7C7C;white-space:nowrap;">
                                                        <b>Attach ${file.DocumentName}</b>
                                                            <input type="file" id="fileInput${uniqueId}" data-id="${file.DocumentId}" class="custom-file-input fileInput" accept=".pdf, .xls, .xlsx, image/*">
                                                    </label>
                                                    <div class="file-preview d-flex justify-content-center" id="preview" style="display: block;" data-id="" >
                                                        <div class="attachrow"  >
                                                            <div class="attachcolumn">
                                                                <ul class="row justify-content-center px-3 mb-2" id="selectedFiles${uniqueId}"></ul>
                                                            </div>
                                                            <div class="attachcolumn">
                                                                <ul class="row justify-content-center px-3 mb-2" id="ExistselectedFiles${uniqueId}"> </ul>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`;
            $('#appendDocument').append(html);
            initializeAttachmentHandler(uniqueId);
        });


    }
}




function initializeAttachmentHandler(uniqueId) {
    $(document).on('change', `#fileInput${uniqueId}`, function (e) {
        const files = e.target.files;

        for (var i = 0; i < files.length; i++) {
            formDataMultiple.append('files[]', files[i]);
        }

        var sel = $(`#selectedFiles${uniqueId} li`).length;
        var exec = $(`#ExistselectedFiles${uniqueId} li`).length;

        if (exec == 0 && sel == 0) {
            if (files.length > 0) {
                const preview = $(`#preview${uniqueId}`);
                preview.css('display', 'block');
                $(`#fileInput${uniqueId}`).prop('disabled', true);

                for (const file of files) {
                    const fileItem = $('<li>').attr('data-id', file.name);
                    const fileName = $('<span>').attr('data-id', 0);
                    const downloadButton = $('<button>');
                    const deleteButton = $('<button>');
                    downloadButton.html('<i data-id="" class="fas fa-download"></i>');
                    deleteButton.html('<i class="fas fa-trash"></i>');
                    downloadButton.addClass('download-button');
                    deleteButton.addClass('delete-button');

                    downloadButton.on('click', () => {
                        event.preventDefault();
                        const blob = new Blob([file]);
                        const blobURL = URL.createObjectURL(blob);
                        const a = $('<a>');
                        a.attr('href', blobURL);
                        a.attr('download', file.name);
                        a.css('display', 'none');
                        $('body').append(a);
                        a[0].click();
                        a.remove();
                        URL.revokeObjectURL(blobURL);
                    });

                    deleteButton.on('click', () => {
                        var itemName = file.name;
                        var newFormData = new FormData();
                        $.each(formData.getAll('files[]'), function (index, value) {
                            if (value.name !== itemName) {
                                newFormData.append('files[]', value);
                            }
                        });
                        formDataMultiple = newFormData;
                        fileItem.remove();
                    });

                    let displayName = file.name;
                    if (displayName.length > 11) {
                        displayName = displayName.substring(0, 11) + '...';
                    }
                    fileName.text(displayName);
                    fileItem.append(fileName);
                    fileItem.append(downloadButton);
                    fileItem.append(deleteButton);
                    $(`#selectedFiles${uniqueId}`).append(fileItem);
                    $(`#ExistselectedFiles${uniqueId}`).append(fileItem);
                }
            }

        } else {
            Common.warningMsg("File already uploaded.");
        }

    });

}














//e.preventDefault();
//var isFormValid = true;
//var firstInvalidAccordion = null;

//$(".accordion").each(function () {
//    var currentAccordion = $(this);
//    var requiredFields = currentAccordion.find('input[required], select[required], textarea[required]');
//    var isCurrentValid = true;
//    requiredFields.each(function () {
//        var input = $(this);
//        var errorMessage = input.data('error-message') || 'This field is required';

//        if (!input.val().trim()) {
//            input.addClass('is-invalid');
//            if (!input.next('.invalid-feedback').length) {
//                input.after('<div class="invalid-feedback">' + errorMessage + '</div>');
//            }
//            isCurrentValid = false;
//            isFormValid = false;
//            if (!firstInvalidAccordion) {
//                firstInvalidAccordion = currentAccordion;
//            }
//        } else {
//            input.removeClass('is-invalid');
//            input.next('.invalid-feedback').remove();
//        }
//    });
//    if (isCurrentValid) {
//        currentAccordion.find('.collapse').collapse('hide');
//    }
//});
//if (firstInvalidAccordion) {
//    $(".accordion .collapse").collapse('hide');
//    firstInvalidAccordion.find('.collapse').collapse('show');
//}
//return isFormValid;