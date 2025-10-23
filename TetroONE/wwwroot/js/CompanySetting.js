var alternateCompanyId = 0;
var PlantId = 0;
var BankId = 0;
$(document).ready(function () {
    $(document).on('focus', ':input', function () {
        $(this).attr('autocomplete', 'no-' + Math.random());
    });

    $('#AddAlternativeCompany').hide();
    //$('#BankInfoHide').hide();
    $('#UpdateSetting').show();
    $('#IsPrimaryHide').hide();
    //$('#GSTNumberHide').removeClass('col-md-2 col-6');
    //$('#GSTNumberHide').addClass('col-md-3 col-6');
    $('#imageUploadlabel-manageuser').prop('disabled', false)

    Common.ajaxCall("GET", "/Settings/GetCompanySetting", null, CompanySuccess, null);
    Common.ajaxCall("GET", "/Settings/GetCompanyAlternativeSetting", { AlternateCompanyId: null }, AlternativeCompanySuccess, null);

    Common.ajaxCall("GET", "/Settings/GetBankDetails", { BankId: null }, BankSuccess, null);
    Common.ajaxCall("GET", "/Settings/GetPlantDetails", { PlantId: null }, PlantSuccess, null);
    $(document).on('click', '#UpdateSetting', function () {
        if (!Common.validateEmailwithErrorwithParent('FormSetting', 'Email')) {
            return false;
        }
        if ($("#FormSetting").valid()) {
            var UpdateData = JSON.parse(JSON.stringify(jQuery('#FormSetting').serializeArray()));
            var objvalue = {};
            $.each(UpdateData, function (index, item) {
                objvalue[item.name] = item.value;
            });

            if ($('#imageUploadlabel-manageuser').get(0).files?.length > 0) {
                objvalue.CompanyLogoFileName = $('#imageUploadlabel-manageuser').get(0).files[0]?.name;
            }
            objvalue.ExistingImage = $('#ExistingImage').text();
            objvalue.CompanyLogoFileName = $('#imageUploadlabel-manageuser').get(0).files[0]?.name;

            if (objvalue.CompanyLogoFileName == undefined) {
                objvalue.CompanyLogoFileName = null;
            }

            objvalue.SignatureExistingImage = $('#SignatureExistingImage').text();
            objvalue.Signature = $('#addSignatureLabel').get(0).files[0]?.name;

            if (objvalue.Signature == undefined) {
                objvalue.Signature = null;
            }

         

            Common.ajaxCall("POST", "/Settings/UpdateSetting", JSON.stringify(objvalue), UpdateSuccess, null);
        }
    });

    $(document).on("input", '#FormSetting #Email', function (event) {

        if (Common.validateEmailwithErrorwithParent('FormSetting', 'Email')) {
            $('#FormSetting #Email-error').remove();
        }
    });

    $(".imageUpload-manageuser").change(function () {
        var input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(input).closest('.picbox').find('.imagePreview-manageuser').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    });
    /*==============================================================Company Alternative==================================================*/

    $(document).on('click', '#AddCompanyBtn', function () {
        $('#AddAlternativeCompany').show();
        $('#AddAlternativeCompany').val('Save');
        $('#UpdateSetting').hide();
        $('#AddAlternativeCompany').addClass('btn-success');
        $('#AddAlternativeCompany').removeClass('btn-update');
        Common.removevalidation('FormSetting');
        $('#State').val('TamilNadu');
        $('#Country').val('India');
        $('#AccountType').val('Current');
        alternateCompanyId = 0;
        //$('#BankInfoHide').hide();
       // $('#imageUploadlabel-manageuser').prop('disabled', true);
        $('#IsPrimaryHide').show();
        //$('#GSTNumberHide').addClass('col-md-3 col-6');
        //$('#GSTNumberHide').removeClass('col-md-2 col-6');
        /*$('#CompanyLogoUpload').attr('src', '../assets/commonimages/kaalaiyanfavicon.png');*/
        
    });

    $(document).on('click', '.btn-edit', function () {
        $('#AddAlternativeCompany').show();
        $('#AddAlternativeCompany').val('Update');
        $('#AddAlternativeCompany').addClass('btn-update');
        $('#AddAlternativeCompany').removeClass('btn-success');
        //$('#BankInfoHide').hide();
        $('#UpdateSetting').hide();
        $('#imageUploadlabel-manageuser').prop('disabled', true);
        $('#IsPrimaryHide').show();
        //$('#GSTNumberHide').addClass('col-md-3 col-6');
        //$('#GSTNumberHide').removeClass('col-md-2 col-6');
        alternateCompanyId = $(this).data('id');
        Common.ajaxCall("GET", "/Settings/GetCompanyAlternativeSetting", { AlternateCompanyId: alternateCompanyId }, AlterBindDataSuccess, null);
    });

    $(document).on('click', '#AlternativeCompanyTable .btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            alternateCompanyId = $(this).data('id');
            Common.ajaxCall("GET", "/Settings/DeleteAlternativeSetting", { AlternateCompanyId: alternateCompanyId }, InsertUpdateSuccess, null);
        }
    });

    $(document).on('click', '#AddAlternativeCompany', function () {
        if ($('#FormSetting').valid()) {
            var AlternativeUpdateData = JSON.parse(JSON.stringify(jQuery('#FormSetting').serializeArray()));
            var objvalue = {};
            $.each(AlternativeUpdateData, function (index, item) {
                objvalue[item.name] = item.value;
            });
            var AlterCompanyId = parseInt(alternateCompanyId);
            objvalue.AlternateCompanyId = AlterCompanyId > 0 ? AlterCompanyId : null;;
            objvalue.ContactNumber = $('#ContactNumber').val();
      

            Common.ajaxCall("POST", "/Settings/InsertAlternativeSetting", JSON.stringify(objvalue), InsertUpdateSuccess, null);
        }
    });

    //$(document).on('click', '#AddAlternativeCompany', function () {
    //    if ($('#FormSetting').valid()) {
    //        var AlternativeUpdateData = JSON.parse(JSON.stringify(jQuery('#FormSetting').serializeArray()));
    //        var objvalue = {};
    //        $.each(AlternativeUpdateData, function (index, item) {
    //            objvalue[item.name] = item.value;
    //        });
    //        var AlterCompanyId = parseInt(alternateCompanyId);
    //        objvalue.AlternateCompanyId = AlterCompanyId > 0 ? AlterCompanyId : null;;
    //        objvalue.ContactNumber = $('#ContactNumber').val();

    //        objvalue.BankName = $('#BankName').val();
    //        objvalue.BranchName = $('#PlantName').val();

    //        Common.ajaxCall("POST", "/Settings/InsertAlternativeSetting", JSON.stringify(objvalue), InsertUpdateSuccess, null);
    //    }
    //});
});

function InsertUpdateSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        Common.ajaxCall("GET", "/Settings/GetCompanyAlternativeSetting", { AlternateCompanyId: null }, AlternativeCompanySuccess, null);
        Common.ajaxCall("GET", "/Settings/GetCompanySetting", null, CompanySuccess, null);
        //$('#BankInfoHide').show();
        $('#AddAlternativeCompany').hide();
        $('#UpdateSetting').show();
        $('#IsPrimaryHide').hide();
        $('#GSTNumberHide').removeClass('col-md-2 col-6');
        $('#GSTNumberHide').addClass('col-md-3 col-6');
        $('#imageUploadlabel-manageuser').prop('disabled', false);
    }
}

function InsertUpdateBankSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        Common.ajaxCall("GET", "/Settings/GetBankDetails", { BankId: null }, BankSuccess, null);
        //$('#BankInfoHide').show();
        $("#BankCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    }
}

function CompanySuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);

        if (data[0][0].CompanyLogoFilePath != null && data[0][0].CompanyLogoFilePath != "") {
            setTimeout(function () {
                $('#CompanyLogoUpload').attr('src', data[0][0].CompanyLogoFilePath);
                $('#ExistingImage').text(data[0][0].CompanyLogoFilePath);

            }, 150);
        } else {
            $('#CompanyLogoUpload').attr('src', '../images/tetrosot_logo.png');
        }
        if (data[0][0].Signature != null && data[0][0].Signature != "") {
            setTimeout(function () {
                $('#signatureUpload').attr('src', data[0][0].Signature);
                $('#SignatureExistingImage').text(data[0][0].Signature);
            }, 150);
        } else {
            $('#SignatureExistingImage').text("");
        }
        $('.navbar-header #NavCompanyName').text(data[0][0]?.CompanyName);
        //$('#BankInfoHide').show();
        $('#AddAlternativeCompany').hide();
        $('#UpdateSetting').show();
        $('#IsPrimaryHide').hide();
        $('#GSTNumberHide').removeClass('col-md-2 col-6');
        $('#GSTNumberHide').addClass('col-md-3 col-6');
        $('#imageUploadlabel-manageuser').prop('disabled', false);
    }
}

function AlternativeCompanySuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[0], ['AlternateCompanyId']);
        Common.bindTableSettings('AlternativeCompanyTable', data[0], columns, -1, 'AlternateCompanyId', '150px', true);
    }
}

function BankSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[0], ['BankId']);
        Common.bindTableSettings('BankTable', data[0], columns, -1, 'BankId', '150px', true);
    }
}


function AlterBindDataSuccess(response) {   
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
    }
}

//function AlterBindDataSuccess(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        Common.bindData(data[0]);
//    }
//}


function UpdateSuccess(response) {  
    if (response.status) {
        Common.successMsg(response.message);

        var imageguid = "";
        var signatureguid = "";

        imageguid = response.data.filePath;
        signatureguid = response.data.signaturePath;

        var fileUpload = $('#imageUploadlabel-manageuser').get(0);
        var files = fileUpload.files;
        Common.fileupload(files, imageguid, null);

        var fileUploadSign = $('#addSignatureLabel').get(0);
        var Signfiles = fileUploadSign.files;
        Common.fileupload(Signfiles, signatureguid, null);

        setTimeout(function () {
            Common.ajaxCall("GET", "/Settings/GetCompanySetting", null, CompanySuccess, null);
        }, 90);
    }
    else {
        Common.errorMsg(response.message);
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
/*===================================================================================*/

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



/*===================================================================================================*/

$(document).on('click', '#AddBankBtn', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#BankCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#BankCanvas").css("width", "50%");
    } else {
        $("#BankCanvas").css("width", "39%");
    }
    //CanvasOpenFirstShowingVendor();
    BankId = 0;
    $("#VendorHeader").text('Add Vendor Details');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#FormBank")[0].reset();

    Common.removeMessage('FormBank');

    $('#SaveBank').text('Save').addClass('btn-success').removeClass('btn-update');

    $('#loader-pms').hide();


    $('#BankCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});


$(document).on('click', '#SaveBank', function (e) {

    e.preventDefault();
   

    if ($("#FormBank").valid()) {
        var DataUpdate = JSON.parse(JSON.stringify(jQuery('#FormBank').serializeArray()));

        var objvalue = {};
        $.each(DataUpdate, function (index, item) {
            objvalue[item.name] = item.value;
        });

        objvalue.BankId = BankId > 0 ? BankId : null;
        objvalue.BankName = $('#BankName').val();
        objvalue.BranchName = $('#BranchName').val();


        Common.ajaxCall("POST", "/Settings/InsertBankDetails", JSON.stringify(objvalue), InsertUpdateBankSuccess, null);
    }
});
$(document).on('click', '#CloseCanvas', function () {
    $("#BankCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});




$(document).on('click', '#BankTable .btn-edit', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#BankCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#BankCanvas").css("width", "50%");
    } else {
        $("#BankCanvas").css("width", "39%");
    }
    //CanvasOpenFirstShowingVendor();
    Common.removeMessage('FormBank');
    
    $('#fadeinpage').addClass('fadeoverlay');
    $("#BankHeader").text('Edit Bank Details');
    $('#SaveBank').text('Update').addClass('btn-update').removeClass('btn-success');
   
    BankId = $(this).data('id');
   
    Common.ajaxCall("GET", "/Settings/GetBankDetails", { BankId: BankId }, editSuccess, null);

    $('#BankCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});

$(document).on('click', '#BankTable .btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var BankId = $(this).data('id');
        Common.ajaxCall("GET", "/Settings/DeleteBankDetails", { BankId: BankId }, InsertUpdateBankSuccess, null);
    }
});

function editSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        $('#loader-pms').hide()
        Common.bindData(data[0]);
       
    }
}

/*   ===================================================================================================================*/

function PlantSuccess(response) {
    if (response.status) {
        $('#GetPlantDetails').empty();
        var data = JSON.parse(response.data);
        var html = "";
        if (data[0][0].PlantId != null && data[0][0].PlantId != "") {
            $.each(data[0], function (index, branchData) {
                html += `
                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div class="custom-counter-box">
                        <img src="/assets/commonimages/plantlogo.svg" alt="Image" class="counter-image">
                        <div class="counter-content">
                            <p class="counter-text" id="CounterBoxtext1">${branchData.Name}</p>
                            <div class="counter-value" id="CounterBoxVal1">${branchData.City}</div>
                        </div>
                        <div class="d-flex flex-column align-items-end" style="gap: 8px;">
                            <i class="btn-edit-Plant mx-1" title="Edit" data-id="${branchData.PlantId}"><img src="/assets/commonimages/edit.svg"></i>
                            <i class="btn-delete-Plant alert_delete mx-1" title="Delete" data-id="${branchData.PlantId}"><img src="/assets/commonimages/delete.svg"></i>
                        </div>
                    </div>
                </div>
                `;
            });

            $('#GetPlantDetails').append(html);
        }
        else {
            var html = `<div class="col-12 d-flex justify-content-center"><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>`;
            $('#GetPlantDetails').append(html);
        }
    }
}

$(document).on('click', '#AddPlantBtn', function () {
    PlantId = 0;
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#AddPlantCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#AddPlantCanvas").css("width", "50%");
    } else {
        $("#AddPlantCanvas").css("width", "39%");
    }

    $('#fadeinpage').addClass('fadeoverlay');
    $('#PlantHeader').text('Add Plant Details');

    //// Close all accordion panels
    //$('#AddPlantCanvas .collapse').removeClass('show');
    //$('#AddPlantCanvas [data-toggle="collapse"]').attr('aria-expanded', 'false');

    //// Open the first (Plant Info)
    $('#AddPlantCanvas #collapse1').addClass('show');
    //$('#styleAccordion [data-target="#collapse1"]').attr('aria-expanded', 'true');

    // Reset forms
    Common.removevalidation('FormPlant');
    Common.removevalidation('FormPlantContact');
    $('#FormPlantContact .Plantcontact').remove();
    duplicateRow();

    $('#SavePlant').text('Save').removeClass('btn-update').addClass('btn-success');
});


$(document).on('click', '#CloseCanvas', function () {
    $("#AddPlantCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
    Common.removevalidation('FormPlant');
    Common.removevalidation('FormPlantContact');
    $('#FormPlantContact .Plantcontact').remove('');
});

$(document).on('click', '.btn-edit-Plant', function () {
    PlantId = $(this).data('id');
    $('#SavePlant').text('Update').removeClass('btn-success').addClass('btn-update');
    Common.ajaxCall("GET", "/Settings/GetPlantDetails", { PlantId: PlantId }, PlantNotNullSuccess, null);
});

$(document).on('click', '.btn-delete-Plant', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        PlantId = $(this).data('id');
        Common.ajaxCall("GET", "/Settings/DeletePlantDetails", { PlantId: PlantId }, InsertUpdatePlantSuccess, null);
    }
});

$(document).on('click', '#SavePlant', function (e) {
    if (!Common.validateEmailwithErrorwithParent('FormPlant', 'PlantEmail')) {
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
    //var isFormValid = validateFormAccordions('.accordion');

    var PrimaryValid = isPrimary('IsPrimary', 'Plantcontact');
    if (PrimaryValid && isValid && $("#FormPlant").valid()) {

        var DataStatic = JSON.parse(JSON.stringify(jQuery('#FormPlant').serializeArray()));
        var objvalue = {};
        $.each(DataStatic, function (index, item) {
            objvalue[item.name] = item.value;
        });

        objvalue.PlantId = PlantId > 0 ? PlantId : null;
        objvalue.PlantEmail = $('#FormPlant #PlantEmail').val() || null;
        objvalue.IsActive = true;
        //objvalue.IsActive = $('#FormPlant #IsActive').is(':checked');

        var ContactPerson = [];
        var ClosestDiv = $('#FormPlantContact .Plantcontact');
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
                ContactId: parseInt(PlantId) || null
            });
        });

        objvalue.ContactPersonDetailsPlant = ContactPerson;

        Common.ajaxCall("POST", "/Settings/InsertPlantDetails", JSON.stringify(objvalue), InsertUpdatePlantSuccess, null);
    }
});


function InsertUpdatePlantSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#AddPlantCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.removevalidation('FormPlant');
        Common.removevalidation('FormPlantContact');
        $('#FormPlantContact .Plantcontact').remove('');
        Common.ajaxCall("GET", "/Settings/GetPlantDetails", { PlantId: null }, PlantSuccess, null);
    }
    else
        Common.errorMsg(response.message);
}

function PlantNotNullSuccess(response) {
    if (response.status) {

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#AddPlantCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#AddPlantCanvas").css("width", "50%");
        } else {
            $("#AddPlantCanvas").css("width", "39%");
        }
        $('#PlantHeader').text('Edit Plant Details');
        $('#SaveClient').text('Update');
        $('#SaveClient').addClass('btn-update');
        $('#fadeinpage').addClass('fadeoverlay');
        $('#AddPlantCanvas .collapse').removeClass('show');
        $('#AddPlantCanvas #collapse1').addClass('show');
        $('#FormPlantContact .Plantcontact').remove('');
        Common.removevalidation('FormPlant');
        Common.removevalidation('FormPlantContact');

        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
        $('#FormPlant #PlantCountry').val(data[0][0].PlantCountry);
        $('#FormPlant #Email').val(data[0][0].PlantEmail);
        $('#FormPlant #PlantName').val(data[0][0].PlantName);

        if (data[1][0].PlantContactPersonMappingId != null && data[1][0].PlantContactPersonMappingId != "") {

            $.each(data[1], function (index, value) {
                var rowadd = $('.Plantcontact').length;
                var DynamicLableNo = rowadd + 1;
                let unique = Math.random().toString(36).substring(2);
                var PrimaryCheck = value.IsPrimary == true ? 'checked' : '';
                var htmlAppend =
                    `
                   <div class="row Plantcontact">
                     <input type="hidden" class="clientContactPersonId" id="ClientContactPersonId" name="ClientContactPersonId" data-id="${value.PlantContactPersonMappingId}" />
                     <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                        <label class="DynamicLable">Contact Person ${DynamicLableNo}</label>
                    </div>
                    <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                        <div class="form-group">
                            <label>Name<span id="Asterisk">*</span></label>
                            <div class="input-group">
                                     <select class="form-control Salutation" autocomplete="off" name="Salutation ${unique}" id="Salutation ${unique}" required>
                                            <option value="Mr" ${value.Salutation == 'Mr' ? 'selected' : ''}>Mr</option>
                                            <option value="Ms" ${value.Salutation == 'Ms' ? 'selected' : ''}>Ms</option>
                                            <option value="Mrs" ${value.Salutation == 'Mrs' ? 'selected' : ''}>Mrs</option>
                                        </select>
                                <input type="text" class="form-control ContactPerson" placeholder="Ex: ABC" name="ContactPerson${unique}" id="ContactPerson${unique}" value="${value.ContactPersonName}" oninput="Common.allowOnlyTextLength(this, 25); Common.removeInvalidFeedback(this)" required />
                            </div>
                        </div>
                    </div>


                    <div class="col-md-6 col-lg-6 col-sm-6 col-6 ">
                        <div class="form-group">
                            <label>Mobile Number<span id="Asterisk">*</span></label>
                            <input type="text" class="form-control MobileNumber" placeholder="Ex:9876543210" id="MobileNumber ${unique}" value="${value.ContactNumber || ''}" name="MobileNumber ${unique}" minlength="6" oninput="Common.allowOnlyContactNoAlternativeLength(this,20); Common.removeInvalidFeedback(this)" required />
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

                $('#FormPlantContact').append(htmlAppend);
                setPrimaryCheckboxEventListeners();
            });
        }
        else {
            duplicateRow();
        }

        //if (data[2][0].AssetId != null && data[2][0].AssetId != "") {
        //    var html = "";
        //    $.each(data[2], function (index, AssMappData) {
        //        var Check = AssMappData.IsActive == true ? 'checked' : '';
        //        html = `
        //            <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
        //                <lable class="AssMappingMappingId d-none">${AssMappData.AssetPlantMappingId}</lable>
        //                <input type="checkbox" data-id="${AssMappData.AssetId}" class="AssId" name="Assets" ${Check} id="product-${AssMappData.AssetId}">
        //                <label for="product-${AssMappData.AssetId}" class="checkbox-label">${AssMappData.AssetName}</label>
        //            </div>
        //        `;
        //    });

        //    $('#FormAssMapp #BindAssMappingData').append(html);
        //}

    }
}


function duplicateRow() {

    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.Plantcontact').length
    var DynamicLableNo = rowadd + 1;

    if ((rowadd < 2)) {
        var htmlRow = `
            <div class="row Plantcontact">
            <input type="hidden" class="clientContactPersonId" id="ClientContactPersonId" name="ClientContactPersonId" data-id="" />
             <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                <label class="DynamicLable_1">Contact Person ${DynamicLableNo}</label>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group account989">
                    <label>Name<span id="Asterisk">*</span></label>
                    <div class="input-group">
                        <select class="form-control Salutation" id="Salutation ${numberIncr}" name="Salutation ${numberIncr}">
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                        </select>
                        <input type="text" class="form-control ContactPerson" placeholder="Ex: ABC" name="ContactPerson${numberIncr}" id="ContactPerson${numberIncr}" oninput="Common.allowOnlyTextLength(this, 25); Common.removeInvalidFeedback(this)" required />
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-6 col-6 ">
                <div class="form-group">
                    <label>Mobile Number<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control MobileNumber" placeholder="Ex:9876543210" id="MobileNumber ${numberIncr}" name="MobileNumber ${numberIncr}" minlength="6" oninput="Common.allowOnlyContactNoAlternativeLength(this,20); Common.removeInvalidFeedback(this)" required />
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control Email" placeholder="Ex: example@gmail.com" id="Email${numberIncr}" name="Email${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-3 col-sm-6 col-6 ">
                <div class="d-flex position-absolute justify-content-start isprimaryerror" style="top:10px;left:12%;">
                    <div id="IsPrimaryError" class="d-none">
                        <span class="text-danger">Primary is required.</span>
                    </div>
                </div>
                <div>
                    <div class="d-flex align-items-center mt-4 ml-4">
                        <input type="checkbox" name="IsPrimary${numberIncr}" class="form-check-input IsPrimary" id="IsPrimary${numberIncr}">
                        <label for="IsPrimary" class="text-black ml-2 mt-1">IsPrimary</label>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-lg-3 col-sm-6 col-6 thiswillshow_1" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                    <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
           `;

        $('#FormPlantContact').append(htmlRow);
        setPrimaryCheckboxEventListeners();
        updateRemoveButtons();
    }
}

function isPrimary(SelectId, SelectClass) {
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

function updateRowLabels() {
    $('.Plantcontact').each(function (index) {
        // Update the label text with the correct row number
        $(this).find('.DynamicLable_1').text('Contact Person ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.Plantcontact');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow_1');
        if (rows.length == 1) {
            removeButtonDiv.css('display', 'none');
        } else {
            removeButtonDiv.css('display', 'block');
        }
    });
}

function removeRow(button) {
    var totalRows = $('.Plantcontact').length;
    if (totalRows > 1) {
        $(button).closest('.Plantcontact').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
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
            var errorMessage = input.data('error-message') || errorMessageDefault;

            if (!input.val().trim()) {
                input.addClass('is-invalid error');
                if (!input.next('.invalid-feedback').length) {
                    input.after('<div class="invalid-feedback">' + errorMessage + '</div>');
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

        if (headerText === "Asset Mapping Info") {
            var checkboxes = currentAccordion.find('input[type="checkbox"]');
            var anyChecked = checkboxes.is(':checked');

            if (!anyChecked) {
                isCurrentValid = false;
                isFormValid = false;

                if (!currentAccordion.find('.checkbox-error').length) {
                    currentAccordion.find('#BindAssMappingData').append(
                        '<div class="invalid-feedback checkbox-error d-flex justify-content-start ml-3">Please select at least one Asset Mapping</div>'
                    );
                }

                if (!firstInvalidAccordion) {
                    firstInvalidAccordion = currentAccordion;
                }
            } else {
                currentAccordion.find('.checkbox-error').remove();
            }
        }

        if (isCurrentValid) {
            currentAccordion.find('.collapse').collapse('hide');
        }
    });

    if (firstInvalidAccordion) {
        firstInvalidAccordion.find('.collapse').collapse('show');
    }

    return isFormValid;
}


$(document).on("input", '#FormPlant #Email', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormPlant', 'Email')) {
        $('#FormPlant #Email-error').remove();
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