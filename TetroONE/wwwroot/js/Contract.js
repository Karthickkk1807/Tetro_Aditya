let selectedItems = [];
var contractId = 0;
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
var PlantMappingId = 0;

$(document).ready(function () {
    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    Common.ajaxCall("GET", "/Contact/GetContractor", {}, ContractSuccess, null);
    Common.bindDropDownParent('State', 'FormContract', 'State');
    $('#IsActiveHide').hide();

    setPrimaryCheckboxEventListeners();
    $(document).on('click', '#SaveContract', function (e) {
        if (!Common.validateEmailwithErrorwithParent('FormContract', 'Email')) {
            return false;
        }

        var isValid = true;
        $('.Email').each(function () {
            var inputField = $(this);
            var parentElement = inputField.closest('.form-group');

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputField.val()) && inputField.val() != "") {
                inputField.addClass('error');
                isValid = false;
            } else {
                inputField.removeClass('error');
                parentElement.find('.error-message').remove();
            }
        });

        e.preventDefault();
        var isFormValid = validateFormAccordions('.accordion');

        var PrimaryValid = isPrimaryChecked('IsPrimary', 'Contractcontact');

        if (isFormValid && PrimaryValid && isValid && $("#FormContract").valid() && $("#FormContractBank").valid() && $("#FormContractContact").valid()) {
            var DataUpdate1 = JSON.parse(JSON.stringify(jQuery('#FormContract').serializeArray()));
            var DataUpdate2 = JSON.parse(JSON.stringify(jQuery('#FormContractBank').serializeArray()));

            getExistFiles();

            var DataUpdate = DataUpdate1.concat(DataUpdate2);

            var objvalue = {};
            $.each(DataUpdate, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.IsActive = $('#IsActive').is(':checked');
            objvalue.BankName = $('#BankName').val();
            objvalue.BranchName = $('#BranchName').val();

            objvalue.ContractorId = contractId > 0 ? contractId : null;
            objvalue.State = parseInt($('#State').val()) || null;

            var ContactPerson = [];
            var ClosestDiv = $('#FormContractContact .Contractcontact');
            $.each(ClosestDiv, function (index, values) {
                var getContactPersonId = $(values).find('.clientContactPersonId').data('id');
                var getSalutationValues = $(values).find('.Salutation').val();
                var getClientContactPersonNameValues = $(values).find('.ContactPerson').val();
                var getContactNumberValues = $(values).find('.MobileNumber').val();
                var geEmailtValues = $(values).find('.Email').val();
                var getIsPrimaryValues = $(values).find('.IsPrimary').prop('checked');
                ContactPerson.push({
                    ContactPersonId: parseInt(getContactPersonId) || null,
                    Salutation: getSalutationValues,
                    ContactPersonName: getClientContactPersonNameValues,
                    ContactNumber: getContactNumberValues,
                    Email: geEmailtValues,
                    IsPrimary: getIsPrimaryValues,
                    ContactId: parseInt(contractId) || null
                });
            });
            objvalue.contactPersonDetails = ContactPerson;

            formDataMultiple.append("ContractorData", JSON.stringify(objvalue));
            formDataMultiple.append("ContractorContactPersonDetails", JSON.stringify(ContactPerson));
            formDataMultiple.append("Exist", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));
            $.ajax({
                type: "POST",
                url: "/Contact/InsertUpdateContractorDetails",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        formDataMultiple = new FormData();
                        Common.successMsg(response.message);
                        $("#ContractCanvas").css("width", "0%");
                        $('#fadeinpage').removeClass('fadeoverlay');
                        Common.ajaxCall("GET", "/Contact/GetContractor", {}, ContractSuccess, null);
                    }
                    else {
                        formDataMultiple = new FormData();
                        Common.errorMsg(response.message);
                    }
                },
                error: function (response) {
                    Common.errorMsg(response.message);
                }
            });
        }
    });
});

function ContractSuccess(response) {
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

        var columns = Common.bindColumn(data[1], ['ContractorId', 'Status_Color']);
        Common.bindTableStarRating('ContractTable', data[1], columns, -1, 'ContractorId', '350px', true, access);
    }
}

function ContractInsertUpdateSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#ContractCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.ajaxCall("GET", "/Contact/GetContractor", {}, ContractSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

$(document).on('click', '#AddContract', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#ContractCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#ContractCanvas").css("width", "50%");
    } else {
        $("#ContractCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingContract();
    $("#ContractHeader").text('Add Contract Details');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#FormContract")[0].reset();
    $("#FormContractBank")[0].reset();
    $("#FormContractContact")[0].reset();
    Common.removeMessage('FormContract');
    Common.removeMessage('FormContractBank');
    Common.removeMessage('FormContractContact');
    $('#FormContractContact').empty('');
    duplicateRow();

    $("#FormContract,#FormContractBank select").val("").trigger("change");
    $('#FormContract #State').val('32');
    $('#Country').val('India');
    $('#AccountType').val('Current');
    $('#IsActiveHide').hide();
    $('#SaveContract').text('Save').addClass('btn-success').removeClass('btn-update');
    $("input[name='employees']").prop("checked", false);
    $('#RemarksDiv').removeClass('col-md-7 col-lg-7 col-sm-7 col-12').addClass('col-md-12 col-lg-12 col-sm-12 col-12');
    $('#loader-pms').hide();

    deletedFiles = [];
    existFiles = [];
    formDataMultiple = new FormData();
    $('#selectedFiles').empty();
    $('#ExistselectedFiles').empty();

    contractId = 0;
    $('#TransactionsHide').hide();

    $('#ContractCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});

$(document).on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#ContractCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#ContractCanvas").css("width", "50%");
    } else {
        $("#ContractCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingContract();
    Common.removeMessage('FormContract');
    Common.removeMessage('FormContractBank');
    Common.removeMessage('FormContractContact');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#ContractHeader").text('Edit Contract Details');
    $('#SaveContract').text('Update').addClass('btn-update').removeClass('btn-success');
    $('#IsActiveHide').show();
    $('#TransactionsHide').show();

    $('#RemarksDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-12').addClass('col-md-7 col-lg-7 col-sm-7 col-12');

    deletedFiles = [];
    existFiles = [];
    formDataMultiple = new FormData();
    $('#selectedFiles').empty();
    $('#ExistselectedFiles').empty();

    contractId = $(this).data('id');
    Common.ajaxCall("GET", "/Contact/GetContractor", { ContractorId: parseInt(contractId) }, editSuccess, null);

    Common.ajaxCall("Post", "/Common/GetDropDownNotNull", JSON.stringify({ MasterInfoId: parseInt(contractId), ModuleName: "ContractorDetails" }), EmployeeListSuccess, null);
     
    $('#ContractCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});

$(document).on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var contractId = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/DeleteContractor", { ContractorId: contractId }, function (response) {
            if (response.status) {
                Common.successMsg(response.message);
                $("#ContractCanvas").css("width", "0%");
                $('#fadeinpage').removeClass('fadeoverlay');
                Common.ajaxCall("GET", "/Contact/GetContractor", {}, ContractSuccess, null);
            }
        }, null);
    }
});

function editSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        $('#loader-pms').hide()
        Common.bindData(data[0]);
        Common.bindData(data[1]);
        $('#Email').val(data[0][0].Email);
        $('#ContactNumber').val(data[0][0].ContactNumber);
        $('#State').val(data[0][0].StateId);

        $('#FormContractContact').empty('');
        $.each(data[1], function (index, value) {
            var rowadd = $('.Contractcontact').length;
            var DynamicLableNo = rowadd + 1;
            let unique = Math.random().toString(36).substring(2);
            var PrimaryCheck = value.IsPrimary == true ? 'checked' : '';
            var htmlAppend =
                `
                       <div class="row Contractcontact">
                         <input type="hidden" class="clientContactPersonId" id="ClientContactPersonId" name="ClientContactPersonId" data-id="${value.VendorContactPersonId}" />
                         <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                            <label class="DynamicLable">Contact Person ${DynamicLableNo}</label>
                        </div>
                        <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                            <div class="form-group">
                                <label>Contact Person Name<span id="Asterisk">*</span></label>
                                <div class="input-group">
                                         <select class="form-control Salutation" autocomplete="off" name="Salutation ${unique}" id="Salutation ${unique}" required>
                                                <option value="Mr" ${value.Salutation == 'Mr' ? 'selected' : ''}>Mr</option>
                                                <option value="Ms" ${value.Salutation == 'Ms' ? 'selected' : ''}>Ms</option>
                                                <option value="Mrs" ${value.Salutation == 'Mrs' ? 'selected' : ''}>Mrs</option>
                                            </select>
                                    <input type="text" class="form-control ContactPerson" placeholder="Full Name" name="ContactPerson${unique}" id="ContactPerson${unique}" value="${value.ContactPersonName}" oninput="Common.allowOnlyTextLength(this, 25); Common.removeInvalidFeedback(this)" required />
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 col-lg-6 col-sm-6 col-6 ">
                            <div class="form-group">
                                <label>Mobile Number<span id="Asterisk">*</span></label>
                                <input type="text" class="form-control MobileNumber" placeholder="Ex:9876543210" id="MobileNumber ${unique}" value="${value.ContactNumber || ''}" name="MobileNumber ${unique}" minlength="10" maxlength="10" oninput="Common.allowOnlyNumberLength(this,10); Common.removeInvalidFeedback(this)" required />
                            </div>
                        </div>

                        <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="text" class="form-control Email" placeholder="Ex: example@gmail.com" id="Email${unique}" value="${value.Email || ''}" name="Email${unique}" />
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                            <div>
                                <div class="d-flex align-items-center ml-4" style=" margin-top: 36px; ">
                                    <input type="checkbox" name="IsPrimary${unique}" class="form-check-input IsPrimary" id="IsPrimary${unique}" ${PrimaryCheck}>
                                    <label for="IsPrimary" class="text-black ml-2">IsPrimary</label>
                                </div>
                            </div>
                            <div class="d-flex justify-content-start isprimaryerror">
                                <div id="IsPrimaryError" class="d-none">
                                    <span class="text-danger">Primary is required.</span>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-3 col-md-3 col-sm-3 col-3 thiswillshow">
                            <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                                <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>

                     </div>
                `;

            $('#FormContractContact').append(htmlAppend);
            setPrimaryCheckboxEventListeners();
        });

        $('#ExistselectedFiles, #selectedFiles').empty("");
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

        $('#TransactionsInfo').empty('');
        var html =
            `
                 <div class="table-responsive">
                     <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="Managetable"></table>
                 </div>
             `;

        $('#TransactionsInfo').append(html);
        var columns = Common.bindColumn(data[3], ['ContractorId', 'Status_Color']);
        bindTableTransactionsInfo('Managetable', data[3], columns, -1, 'ContractorId', '250px', false);

        updateRemoveButtons();
    }
}

function EmployeeListSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var employee = data[0]; // Extract the actual array of products
        var htmlDynamicEmployee = '';
        if (data[0][0].Employee != null && data[0][0].Employee != "") {
            $.each(employee, function (index, employee) {
                var Employee = employee.Employee; 

                htmlDynamicEmployee += `
                <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                    <label for="product-${Employee}" class="checkbox-label">${Employee}</label>
                </div>
                `;
            });
            $("#FormEmployeeMapp #EmployeeList").html(htmlDynamicEmployee);
        } else {
            $('#FormEmployeeMapp #EmployeeList').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;width: 25px;">No records found</div>');
        }
    }
}

$(document).on('click', '#CloseCanvas', function () {
    $("#ContractCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});


$('.accordion-header').on('click', function () {
    var $offcanvas = $(this).closest('.offcanvas-container');
    var $accordion = $(this).closest('.accordion');
    var target = $(this).find('a').attr('data-target');

    $offcanvas.find('.collapse').not(target).collapse('hide');

    $(target).collapse('toggle');
});


function duplicateRow() {

    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.Contractcontact').length
    var DynamicLableNo = rowadd + 1;
    if ((rowadd < 2)) {
        var htmlRow = ``;
        htmlRow = `
            
            <div class="row Contractcontact">
             <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                <label class="DynamicLable">Contact Person ${DynamicLableNo}</label>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Contact Person Name<span id="Asterisk">*</span></label>
                    <div class="input-group">
                            <select class="form-control Salutation" id="Salutation ${numberIncr}" name="Salutation ${numberIncr}">
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                            </select>
                        <input type="text" class="form-control ContactPerson" placeholder="Full Name" name="ContactPerson${numberIncr}" id="ContactPerson${numberIncr}" oninput="Common.allowOnlyTextLength(this, 25); Common.removeInvalidFeedback(this)" required />
                    </div>
                </div>
            </div>


            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Mobile Number<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control MobileNumber" placeholder="Ex:9876543210" id="MobileNumber ${numberIncr}" name="MobileNumber ${numberIncr}" minlength="10" maxlength="10" oninput="Common.allowOnlyNumberLength(this,10); Common.removeInvalidFeedback(this)" required />
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" class="form-control Email" placeholder="Ex: example@gmail.com" id="Email${numberIncr}" name="Email${numberIncr}" />
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                <div>
                    <div class="d-flex align-items-center ml-4" style=" margin-top: 36px; ">
                        <input type="checkbox" name="IsPrimary${numberIncr}" class="form-check-input IsPrimary" id="IsPrimary${numberIncr}">
                        <label for="IsPrimary" class="text-black ml-2">IsPrimary</label>
                    </div>
                </div>
                 <div class="d-flex justify-content-start isprimaryerror">
                    <div id="IsPrimaryError" class="d-none">
                        <span class="text-danger">Primary is required.</span>
                    </div>
                </div>
            </div>

            <div class="col-lg-3 col-md-3 col-sm-3 col-3 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                    <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>

         </div>

           `;

        $('#FormContractContact').append(htmlRow);
        setPrimaryCheckboxEventListeners();
        updateRemoveButtons();
    }
}

function updateRowLabels() {
    $('.Contractcontact').each(function (index) {
        $(this).find('.DynamicLable').text('Contact Person ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.Contractcontact');
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
    var totalRows = $('.Contractcontact').length;
    if (totalRows > 1) {
        $(button).closest('.Contractcontact').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
}

$('#IFSCCode').on('input', function () {
    var ifsc = $(this).val().toUpperCase();
    Ifsc(ifsc);

});

function Ifsc(ifsc) {

    var regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    // Check if the field is empty
    if (ifsc === '') {
        $('#ifscError').hide().text("This field is required");
        $('#BankName').val('');
        $('#BranchName').val('');
        return; // Exit the function if the field is empty
    }


    if (regex.test(ifsc)) {

        $.ajax({
            url: 'https://ifsc.razorpay.com/' + ifsc,
            method: 'GET',
            success: function (response) {
                $('#ifscError').hide();
                $('#BankName').val(response.BANK);
                $('#BranchName').val(response.BRANCH);
            },
            error: function () {
                $('#ifscError').show().text("Invalid IFSC Code");

                $('#BankName').val('');
                $('#BranchName').val('');
            }
        });
    } else {
        $('#ifscError').show().text("Invalid IFSC Code Format");

        $('#BankName').val('');
        $('#BranchName').val('');
    }
}

function isPrimaryChecked(SelectId, SelectClass) {
    var inputVal = $('#' + SelectId).val();
    if (inputVal == "2") {
        return true;
    }

    var isChecked = false;
    $('.' + SelectClass).each(function () {
        var checkbox = $(this).find('.IsPrimary');
        if (checkbox.prop('checked')) {
            isChecked = true;
            return false;
        }
    });

    if (!isChecked) {
        $('#IsPrimaryError').removeClass('d-none');
    } else {
        $('#IsPrimaryError').addClass('d-none');
    }

    return isChecked;
}

function setPrimaryCheckboxEventListeners() {

    $('.IsPrimary').off('change').on('change', function () {
        if ($(this).prop('checked')) {
            // Uncheck all other "IsPrimary" checkboxes
            $('.IsPrimary').not(this).prop('checked', false);

            $('#IsPrimaryError').addClass('d-none');

        } else {

            $('#IsPrimaryError').removeClass('d-none');
        }
    });
}


$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Contractor",
        ModuleRefId: parseInt(moduleRefId),
        AttachmentFileName: fileText,
        AttachmentFilePath: src
    });
    $(listItem).remove();
});

function getExistFiles() {

    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "Contractor",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

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

function validateFormAccordions(accordionSelector, errorMessageDefault = 'This field is required') {
    var isFormValid = true;
    var firstInvalidAccordion = null;

    $(accordionSelector).each(function () {
        var currentAccordion = $(this);
        var requiredFields = currentAccordion.find('input[required], select[required], textarea[required]');
        var isCurrentValid = true;

        requiredFields.each(function () {
            var input = $(this);
            var value = input.val().trim();
            var minLength = input.attr('minlength');
            var maxLength = input.attr('maxlength');
            var errorMessage = errorMessageDefault;
            var isInvalid = false;

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
                input.addClass('is-invalid error');
                input.nextAll('.invalid-feedback, .error').remove();
                input.after('<div class="invalid-feedback">' + errorMessage + '</div>');

                isCurrentValid = false;
                isFormValid = false;

                if (!firstInvalidAccordion) {
                    firstInvalidAccordion = currentAccordion;
                }
            } else {
                input.removeClass('is-invalid error');
                input.nextAll('.invalid-feedback, .error').remove();
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


$(document).on("input", '#FormContract #Email', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormContract', 'Email')) {
        $('#FormContract #Email-error').remove();
        if (inputElement != "") {
            $(element).addClass('is-invalid error');
        }
    }
});

$(document).on('input', '.Email', function () {
    var inputField = $(this);
    var parentElement = inputField.closest('.form-group');
    var errorLabel = parentElement.find('.error-message');

    var inputValue = inputField.val();

    errorLabel.filter('[data-for="' + inputField.attr('id') + '"]').remove();

    if (inputField.prop('required') && inputValue.length === 0) {
        inputField.removeClass('error');
        return true;
    }

    if (/^[^\s@]+@[^\s@]+(\.[^\s@]+)+$/.test(inputValue)) {
        inputField.removeClass('error');
        errorLabel.remove();
    }
    else if (inputValue.length > 0 && errorLabel.length === 0) {
        inputField.addClass('error');
        parentElement.append('<label class="error-message" style="font-weight: 600;color: red !important;font-size: 12px !important;margin-top: .5rem;">Valid email is required</label>');
        return false;
    }
    else if (inputValue.length === 0) {
        inputField.removeClass('error');
        errorLabel.remove();
    }

    return true;
});

function CanvasOpenFirstShowingContract() {
    $('#ContractCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#ContractCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#ContractCanvas').offset().top
    }, 'fast');
}
  
function isNoDataRow(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return true;
    }

    return data.every(row =>
        Object.values(row).every(
            val => val === null || val === undefined || val === ''
        )
    );
}

function bindTableTransactionsInfo(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction) {

    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }

    $('#' + tableid).empty();

    // Remove unwanted column
    columns = columns.filter(x => x.name != "TetroONEnocount");

    var isbuyernocount = data && data.length > 0 && data[0].hasOwnProperty('TetroONEnocount');
    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

    // ================= ACTION COLUMN (FIXED) =================
    if (isAction === true && data != null && data.length > 0 && !isbuyernocount) {
        columns.push({
            data: null,                // IMPORTANT FIX
            title: "Action",
            orderable: false,
            render: function (data, type, row) {
                return `
                    <button class="btn btn-sm btn-primary edit-btn"
                        data-id="${row[editcolumn]}">
                        Edit
                    </button>
                `;
            }
        });
    } else {
        columns.push({
            data: null,
            title: "Action",
            visible: false,
            orderable: false,
            defaultContent: ''
        });
    }

    // ================= COLUMN RENDERERS =================
    var renderColumn = [
        {
            targets: StatusColumnIndex,
            render: function (data, type, row) {
                if (type === 'display' && row.Status_Color) {
                    return `
                        <span class="ana-span badge text-white"
                              style="background:${row.Status_Color.toLowerCase()};
                              width:87px;font-size:10px;height:16px;">
                              ${row.Status}
                        </span>
                    `;
                }
                return data;
            }
        }
    ];

    // ================= DATATABLE OPTIONS =================
    var dataTableOptions = {
        dom: "Blfrtip",
        destroy: true,
        responsive: true,
        data: !isbuyernocount ? data : [],
        columns: columns,
        scrollY: scrollpx,
        scrollX: true,
        scrollCollapse: true,
        scroller: true,
        ordering: false,
        searching: false,
        info: false,
        paging: false,
        pageLength: 30,
        language: {
            emptyTable:
                '<div><img src="/assets/commonimages/nodata.svg" style="margin-right:10px;">No records found</div>'
        },
        columnDefs: renderColumn
    };

    var table = $('#' + tableid).DataTable(dataTableOptions);
    Common.autoAdjustColumns(table);
}