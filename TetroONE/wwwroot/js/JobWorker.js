var jobWorkerId = 0;
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData(); 

$(document).ready(function () {
    Common.bindDropDownParent('State', 'FormJobWorker', 'State');

    Common.ajaxCall("GET", "/Contact/GetJobWorker", {}, JobWorkersSuccess, null);

    $(document).on('click', '#AddJobWorker', function () { 
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#JobWorkerCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#JobWorkerCanvas").css("width", "50%");
        } else {
            $("#JobWorkerCanvas").css("width", "39%");
        }
        $("#JobWorkerHeader").text('Add JobWorker Details'); 
        $('#fadeinpage').addClass('fadeoverlay');
        $("#FormJobWorker")[0].reset();
        CanvasOpenFirstShowingJobWorker();

        $('#TransactionsHide').hide();

        Common.removevalidation('FormJobWorker');
        Common.removeMessage('FormJobWorker');
        Common.removevalidation('FormJobWorkersBank');
        Common.removeMessage('FormJobWorkersBank');

        $('#FormContactJobWorker').empty('');
        duplicateRow();

        $('#State').val('32');
        $('#Country').val('India');

        JobWorkerId = 0;
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();
        $('#RemarksDiv').removeClass('col-md-7 col-lg-7 col-sm-7 col-7').addClass('col-md-12 col-lg-12 col-sm-12 col-12'); 
        $('#CurrentlimitHide').hide();
        $('#IsActiveHide').hide();
        $('#SaveJobWorker').text('Save').addClass('btn-success').removeClass('btn-update');  
    });
    
    $(document).on('click', '#CloseCanvas', function () {
        $("#JobWorkerCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });
    
    $(document).on('click', '#SaveJobWorker', function (e) {
        if (!Common.validateEmailwithErrorwithParent('FormJobWorker', 'Email')) {
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

        var PrimaryValid = isPrimaryChecked('IsPrimary', 'JobWorkerContact');
        if (isFormValid && PrimaryValid && isValid && $("#FormJobWorker").valid() && $("#FormJobWorkersBank").valid()) {
            var DataUpdate1 = JSON.parse(JSON.stringify(jQuery('#FormJobWorker').serializeArray()));
            var DataUpdate2 = JSON.parse(JSON.stringify(jQuery('#FormJobWorkersBank').serializeArray()));

            getExistFiles();
             
            var DataUpdate = DataUpdate1.concat(DataUpdate2);

            var objvalue = {};
            $.each(DataUpdate, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.JobWorkerId = jobWorkerId > 0 ? jobWorkerId : null;
            objvalue.State = Common.parseInputValue('State') || null;
            objvalue.BankName = $('#BankName').val();
            objvalue.BranchName = $('#BranchName').val();

            objvalue.IsActive = $('#FormJobWorker #IsActive').is(':checked');

            var ContactPerson = [];
            var ClosestDiv = $('#FormContactJobWorker .JobWorkerContact');
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
                    ContactId: parseInt(jobWorkerId) || null
                });
            });

            formDataMultiple.append("JobWorkersData", JSON.stringify(objvalue));
            formDataMultiple.append("JobWorkerContactPersonDetails", JSON.stringify(ContactPerson));
            formDataMultiple.append("Exist", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));
            $.ajax({
                type: "POST",
                url: "/Contact/InsertUpdateJobWorkerDetails",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        formDataMultiple = new FormData();
                        Common.successMsg(response.message);
                        $("#JobWorkerCanvas").css("width", "0%");
                        $('#fadeinpage').removeClass('fadeoverlay'); 
                        Common.ajaxCall("GET", "/Contact/GetJobWorker", {}, JobWorkersSuccess, null);
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

    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });  

    $(document).on('click', '.btn-edit', function () {
        $('#loader-pms').show();
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#JobWorkerCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#JobWorkerCanvas").css("width", "50%");
        } else {
            $("#JobWorkerCanvas").css("width", "39%");
        }
        CanvasOpenFirstShowingJobWorker();

        $('#TransactionsHide').show();

        Common.removeMessage('FormJobWorker');  
        $('#IsActiveHide').show(); 
        $("#JobWorkerHeader").text('Edit JobWorkers Details');
        $('#fadeinpage').addClass('fadeoverlay');
        $('#SaveJobWorker').text('Update').addClass('btn-update').removeClass('btn-success');
        $('#CurrentlimitHide').show();
        $('#loader-pms').hide();

        $('#selectedFiles').empty('');
        $('#ExistselectedFiles').empty('');
        $('#RemarksDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-12').addClass('col-md-7 col-lg-7 col-sm-7 col-12'); 

        existFiles = [];
        jobWorkerId = $(this).data('id');

        var PasseingData = { JobWorkerId: jobWorkerId }
        Common.ajaxCall("GET", "/Contact/GetJobWorker", PasseingData, editSuccess, null);
        $('#ClientCanvas .collapse').removeClass('show');
        $('#collapse1').addClass('show');
    });  
});
 
$(document).on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var jobWorkersId = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/DeleteJobWorker", { JobWorkerId: jobWorkersId }, function (response) {
            if (response.status) {
                Common.successMsg(response.message);
                Common.ajaxCall("GET", "/Contact/GetJobWorker", {}, JobWorkersSuccess, null);
            }
        }, null);
    }
});
 
$(document).on("input", '#FormJobWorker #Email', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormClient', 'Email')) {
        $('#FormClient #Email-error').remove();
        if (inputElement != "") {
            $(element).addClass('is-invalid error');
        }
    }
});

function JobWorkersSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        $('#editCounterbox #CounterImage1').prop('');
        $('#editCounterbox #CounterImage2').prop('');
        $('#editCounterbox #CounterImage3').prop('');
        $('#editCounterbox #CounterImage4').prop('');

        $('#editCounterbox #CounterImage1').prop('src', '/assets/moduleimages/contact/distributoricon_1.svg');
        $('#editCounterbox #CounterImage2').prop('src', '/assets/moduleimages/contact/distributoricon_2.svg');
        $('#editCounterbox #CounterImage3').prop('src', '/assets/moduleimages/contact/distributoricon_3.svg');
        $('#editCounterbox #CounterImage4').prop('src', '/assets/moduleimages/contact/distributoricon_4.svg');

        var CounterBox = Object.keys(data[0][0]);

        $("#CounterTextBox1").text(CounterBox[0]);
        $("#CounterTextBox2").text(CounterBox[1]);
        $("#CounterTextBox3").text(CounterBox[2]);
        $("#CounterTextBox4").text(CounterBox[3]);

        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        var columns = Common.bindColumn(data[1], ['JobWorkerId', 'Status_Color']);
        Common.bindTableStarRating('JobWorkerTable', data[1], columns, -1, 'JobWorkerId', '330px', true, access);
    }
}

function editSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);

        Common.renderRatingStars(data[0][0].Ratings, "RatingStars");

        if (data[0][0].IsActive == true)
            $('#FormJobWorker #IsActive').prop('checked', true);
        else
            $('#FormJobWorker #IsActive').prop('checked', false);

        $('#FormContactJobWorker').empty('');
        $.each(data[1], function (index, value) {
            var rowadd = $('.Vendorcontact').length;
            var DynamicLableNo = rowadd + 1;
            let unique = Math.random().toString(36).substring(2);
            var PrimaryCheck = value.IsPrimary == true ? 'checked' : '';
            var htmlAppend =
                `
                   <div class="row JobWorkerContact">
                     <input type="hidden" class="clientContactPersonId" id="ClientContactPersonId" name="ClientContactPersonId" data-id="${value.ClientContactPersonId}" />
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

            $('#FormContactJobWorker').append(htmlAppend);
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

        $('#TransactionsHide').show();
        $('#TransactionsInfo').empty('');
        var html =
        `
         <div class="table-responsive">
             <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="Managetable"></table>
         </div>
         `;
        $('#TransactionsInfo').append(html);

        var columns = Common.bindColumn(data[3], ['TransactionId', 'Status_Color']);
        bindTableTransactionsInfo('Managetable', data[3], columns, -1, 'TransactionId', '151px', true);

        updateRemoveButtons();
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
            $('.IsPrimary').not(this).prop('checked', false);
            $('#IsPrimaryError').addClass('d-none');
        } else {
            $('#IsPrimaryError').removeClass('d-none');
        }
    });
}

function validateFormAccordions(accordionSelector, errorMessageDefault = 'This field is required') {
    var isFormValid = true;
    var firstInvalidAccordion = null;

    $(accordionSelector).each(function () {
        var currentAccordion = $(this);
        var headerText = currentAccordion.find('.accordion-header strong').text().trim();
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

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "JobWorker",
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
            ModuleName: "JobWorker",
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

function duplicateRow() {

    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.JobWorkerContact').length
    var DynamicLableNo = rowadd + 1;

    if ((rowadd < 2)) {
        var htmlRow = `
            <div class="row JobWorkerContact">
             <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                <label class="DynamicLable">Contact Person ${DynamicLableNo}</label>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group account989">
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


            <div class="col-md-6 col-lg-6 col-sm-6 col-6 ">
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
           `;

        $('#FormContactJobWorker').append(htmlRow);
        setPrimaryCheckboxEventListeners();
        updateRemoveButtons();
    }
}
 
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

function updateRowLabels() {
    $('.JobWorkerContact').each(function (index) { 
        $(this).find('.DynamicLable').text('Contact Person ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.JobWorkerContact');
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
    var totalRows = $('.JobWorkerContact').length;
    if (totalRows > 1) {
        $(button).closest('.JobWorkerContact').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
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

function CanvasOpenFirstShowingJobWorker() {
    $('#JobWorkerCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#JobWorkerCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#JobWorkerCanvas').offset().top
    }, 'fast');
}


function bindTableTransactionsInfo(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isbuyernocount = data[0].hasOwnProperty('TetroONEnocount');
    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

    if (isAction == true && data != null && data.length > 0 && !isbuyernocount) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    } else {
        columns.push({
            "data": "Action", "name": "Action", "autoWidth": true, "title": "Action", orderable: false, visible: false
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
        },

    ];


    renderColumn.push(
        {
            targets: actionTarget,
            render: function (data, type, row, meta) {
                return `<td>
                            <div class="actionEllipsis">
                                <i class="edity mx-1" data-id="${row[editcolumn]}" title="Edit">
                                    <img src="/assets/CommonImages/eye_icon.svg" alt="View">
                                </i>
                            </div>
                        </td> `;
            }
        }
    ) 
    var dataTableOptions = {
        "dom": "Blfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !isbuyernocount ? data : [],
        "columns": columns,
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "scrollX": true,
        "scroller": true,
        "scrollCollapse": true,
        "aaSorting": [],
        "language": {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        },
        "searching": false,
        "info": false,
        "paging": false,
        "pageLength": 30,
        //"lengthMenu": [5, 10, 25, 50],
        "columnDefs": renderColumn
    };
    $('#' + tableid).DataTable(dataTableOptions);
    var tableId = $('#' + tableid).DataTable();
    Common.autoAdjustColumns(tableId);

}