var franchise = 0;
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
$(document).ready(function () {
    Common.ajaxCall("GET", "/Contact/GetFranchise", null, FranchiseSuccess, null);
    Common.bindDropDownParent('FranchiseStateId', 'FormFranchise', 'State');
    setPrimaryCheckboxEventListeners();
    $('#IsActiveHide').hide();
    var today = new Date().toISOString().split('T')[0];
    $("#CollaboratedDate").val(today);
    //$("#CollaboratedDate").attr("max", today);



    //$("#CollaboratedDate").on("change", function () {
    //    var selectedPODate = $(this).val();
    //    $("#ExpiryDate").attr("min", selectedPODate);
    //
    //
    //    if ($("#ExpiryDate").val() < selectedPODate) {
    //        $("#ExpiryDate").val("");
    //    }
    //});

    $(document).on('click', '#AddFranchise', function () {
        CanvasOpenFirstShowingFranchise();
        $('#loader-pms').show();
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#FranchiseCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#FranchiseCanvas").css("width", "50%");
        } else {
            $("#FranchiseCanvas").css("width", "39%");
        }
        $("#FranchiseHeader").text('Add Franchise Details');
        $('#fadeinpage').addClass('fadeoverlay');
        $("#FormFranchise")[0].reset();
        Common.removevalidation('FormFranchise');
        Common.removeMessage('FormFranchise');
        Common.removeMessage('FormFranchiseBank');
        Common.removeMessage('FormEligibility');
        $('#signatureUpload').attr('src', "/assets/commonimages/Signature.jpg");

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);
        $('#CollaboratedDate').val(formattedDate);

        //$("#ExpiryDate").attr("min", formattedDate);

        //if ($("#ExpiryDate").val() < formattedDate) {
        //    $("#ExpiryDate").val("");
        //}


        $('#FormFranchiseContact').empty('');
        duplicateRow();
        $('#FormFranchise #FranchiseStateId').val('32');
        $('#FranchiseCountry').val('India');
        $('#AccountType').val('Current');
        $('#IsActiveHide').hide();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();
        franchise = 0;
        $('#SaveFranchise').text('Save').addClass('btn-success').removeClass('btn-update');
        $('#loader-pms').hide();

        $('#FranchiseCanvas .collapse').removeClass('show');
        $('#collapse1').addClass('show');
    });

    $(document).on('click', '#SaveFranchise', function (e) {
        if (!Common.validateEmailwithErrorwithParent('FormFranchise', 'FranchiseEmail')) {
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
        existFiles = [];
        e.preventDefault();
        var isFormValid = validateFormAccordions('.accordion');

        var PrimaryValid = isPrimaryChecked('IsPrimary', 'Franchisecontact');
        if (isFormValid && PrimaryValid && isValid && $("#FormFranchise").valid()) {

            getExistFiles();

            var DataFranchiseStatic1 = JSON.parse(JSON.stringify(jQuery('#FormFranchise').serializeArray()));
            var DataFranchiseStatic2 = JSON.parse(JSON.stringify(jQuery('#FormFranchiseBank').serializeArray()));
            var DataFranchiseStatic3 = DataFranchiseStatic1.concat(DataFranchiseStatic2);
            var objvalue = {};

            $.each(DataFranchiseStatic3, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.FranchiseId = franchise > 0 ? franchise : null;
            objvalue.FranchiseStateId = Common.parseInputValue('FranchiseStateId') || null;
            objvalue.IsActive = $('#IsActive').is(':checked');
            objvalue.BankName = $('#BankName').val();
            objvalue.BranchName = $('#BranchName').val();
            objvalue.CollaboratedDate = Common.stringToDateTimeSendTimeAlso('CollaboratedDate') || null;
            objvalue.ExpiryDate = Common.stringToDateTimeSendTimeAlso('ExpiryDate') || null;

            objvalue.SignatureExistingImage = $('#SignatureExistingImage').text();
            objvalue.Signature = $('#addSignatureLabel').get(0).files[0]?.name;

            var ContactPerson = [];
            var ClosestDiv = $('#FormFranchiseContact .Franchisecontact');
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
                    ContactId: parseInt(franchise) || null
                });
            });

            formDataMultiple.append("FranchiseData", JSON.stringify(objvalue));
            formDataMultiple.append("FranchiseContactData", JSON.stringify(ContactPerson));
            formDataMultiple.append("Exist", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));
            $.ajax({
                type: "POST",
                url: "/Contact/InsertUpdateFranchise",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        formDataMultiple = new FormData();
                        Common.successMsg(response.message);

                        var signatureguid = "";

                        signatureguid = response.data;

                        var fileUploadSign = $('#addSignatureLabel').get(0);
                        var Signfiles = fileUploadSign.files;
                        Common.fileupload(Signfiles, signatureguid, null);

                        $("#FranchiseCanvas").css("width", "0%");
                        $('#fadeinpage').removeClass('fadeoverlay');
                        Common.ajaxCall("GET", "/Contact/GetFranchise", null, FranchiseSuccess, null);
                    }
                    else {
                        Common.errorMsg(response.message);
                        formDataMultiple = new FormData();
                    }
                },
                error: function (response) {
                    Common.errorMsg(response.message);
                    formDataMultiple = new FormData();
                }
            });
        }
    });

    $(document).on('click', '.btn-edit', function () {
        $('#loader-pms').show();
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#FranchiseCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#FranchiseCanvas").css("width", "50%");
        } else {
            $("#FranchiseCanvas").css("width", "39%");
        }
        CanvasOpenFirstShowingFranchise();
        Common.removeMessage('FormFranchise');
        Common.removeMessage('FormFranchiseBank');
        $("#FranchiseHeader").text('Edit Franchise Details');
        $('#fadeinpage').addClass('fadeoverlay');
        $('#FormFranchiseContact').empty('');
        $('#SaveFranchise').text('Update').addClass('btn-update').removeClass('btn-success');
        $('#loader-pms').hide();
        $('#IsActiveHide').show();
        franchise = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/GetFranchise", { FranchiseId: franchise }, EditFranchiseSuccess, null);

        $('#FranchiseCanvas .collapse').removeClass('show');
        $('#collapse1').addClass('show');
    });

});


$(document).on('click', '#CloseCanvas', function () {
    $("#FranchiseCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});


function FranchiseSuccess(response) {
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

        var columns = Common.bindColumn(data[1], ['FranchiseId', 'Status_Color']);
        Common.bindTable('FranchiseTable', data[1], columns, -1, 'FranchiseId', '330px', true, access);
    }
}

function InsertUpdateSuccess(response) {
    if (response.status) {
        formDataMultiple = new FormData();
        Common.successMsg(response.message);
        $("#FranchiseCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.ajaxCall("GET", "/Contact/GetFranchise", null, FranchiseSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

function EditFranchiseSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        $('#signatureUpload').attr('src', '');
        Common.bindData(data[0]);
        
        const formattedCollaboratedDate = formatToISODate(data[0][0].CollaboratedDate);
        $('#CollaboratedDate').val(formattedCollaboratedDate);

        const formattedExpiryDate = formatToISODate(data[0][0].ExpiryDate);
        $('#ExpiryDate').val(formattedExpiryDate);

        if (data[0][0].Signatures != null && data[0][0].Signatures != "") {
            setTimeout(function () {
                $('#signatureUpload').attr('src', data[0][0].Signatures);
                $('#SignatureExistingImage').text(data[0][0].Signatures);
            }, 150);
        } else {
            $('#SignatureExistingImage').text("");
            $('#signatureUpload').attr('src', "/assets/commonimages/Signature.jpg");
        }

        if (data[0][0].IsActive == true)
            $('#FormFranchise #IsActive').prop('checked', true);
        else
            $('#FormFranchise #IsActive').prop('checked', false);

        $('#FormFranchiseContact').empty('');
        $.each(data[1], function (index, value) {
            var rowadd = $('.Franchisecontact').length;
            var DynamicLableNo = rowadd + 1;
            let unique = Math.random().toString(36).substring(2);
            var PrimaryCheck = value.IsPrimary == true ? 'checked' : '';
            var htmlAppend =
                `
                   <div class="row Franchisecontact">
                     <input type="hidden" class="clientContactPersonId" id="ClientContactPersonId" name="ClientContactPersonId" data-id="${value.VendorContactPersonId}" />
                     <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                        <label class="DynamicLable">Contact Person ${DynamicLableNo}</label>
                    </div>
                    <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                        <div class="form-group account989">
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


                    <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                        <div class="form-group">
                            <label>Mobile Number<span id="Asterisk">*</span></label>
                            <input type="text" class="form-control MobileNumber" placeholder="Ex:9876543210" id="MobileNumber ${unique}" value="${value.ContactNumber || ''}" name="MobileNumber ${unique}" minlength="10" maxlength="10" oninput="Common.allowOnlyNumberLength(this,10); Common.removeInvalidFeedback(this)" required />
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="form-control Email" placeholder="Ex: example@gmail.com" id="Email${unique}" value="${value.Email || ''}" name="Email${unique}" />
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

            $('#FormFranchiseContact').append(htmlAppend);
            setPrimaryCheckboxEventListeners();
        });

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
        updateRemoveButtons();
    }
}

$(document).on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        franchise = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/DeleteFranchise", { FranchiseId: franchise }, InsertUpdateSuccess, null);
    }
});


function duplicateRow() {

    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.Franchisecontact').length
    var DynamicLableNo = rowadd + 1;

    if ((rowadd < 2)) {
        var htmlRow = `
            <div class="row Franchisecontact">
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
                    <input type="email" class="form-control Email" placeholder="Ex: example@gmail.com" id="Email${numberIncr}" name="Email${numberIncr}" />
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-3">
             <div>
                    <div class="d-flex align-items-center ml-4" style="margin-top: 36px;">
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
           `;

        $('#FormFranchiseContact').append(htmlRow);
        setPrimaryCheckboxEventListeners();
        updateRemoveButtons();
    }
}

function updateRowLabels() {
    $('.Franchisecontact').each(function (index) {
        // Update the label text with the correct row number
        $(this).find('.DynamicLable').text('Contact Person ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.Franchisecontact');
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
    var totalRows = $('.Franchisecontact').length;
    if (totalRows > 1) {
        $(button).closest('.Franchisecontact').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
}

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Franchise",
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
            ModuleName: "Franchise",
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
            $('.IsPrimary').not(this).prop('checked', false);
            $('#IsPrimaryError').addClass('d-none');
        } else {
            $('#IsPrimaryError').removeClass('d-none');
        }
    });
}

$('.accordion-header').on('click', function () {
    var $offcanvas = $(this).closest('.offcanvas-container');
    var $accordion = $(this).closest('.accordion');
    var target = $(this).find('a').attr('data-target');
    $offcanvas.find('.collapse').not(target).collapse('hide');
    $(target).collapse('toggle');
});



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


$(document).on("input", '#FormFranchise #FranchiseEmail', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormFranchise', 'FranchiseEmail')) {
        $('#FormFranchise #FranchiseEmail-error').remove();
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


$('#addSignatureLabel').on('change', function () {
    var input = this;

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#signatureUpload').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
});

function CanvasOpenFirstShowingFranchise() {
    $('#FranchiseCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4').collapse('hide');
    $('#FranchiseCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#FranchiseCanvas').offset().top
    }, 'fast');
}

function formatToISODate(ddmmyyyy) {
    if (!ddmmyyyy) return '';

    const parts = ddmmyyyy.split('-');
    if (parts.length !== 3) return '';

    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
}
