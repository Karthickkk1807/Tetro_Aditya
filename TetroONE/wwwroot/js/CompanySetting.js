var alternateCompanyId = 0;
var branchId = 0;
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
    //Common.ajaxCall("GET", "/Settings/GetBranch", { BranchId: null }, BranchSuccess, null);
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

            objvalue.BankName = $('#BankName').val();
            objvalue.BranchName = $('#BranchName').val();

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

    $(document).on('click', '.btn-delete', async function () {
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
           
            objvalue.BankName = $('#BankName').val();
            objvalue.BranchName = $('#BranchName').val();

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
    //        objvalue.BranchName = $('#BranchName').val();

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

//function InsertUpdateSuccess(response) {
//    if (response.status) {
//        Common.successMsg(response.message);
//        Common.ajaxCall("GET", "/Settings/GetCompanyAlternativeSetting", { AlternateCompanyId: null }, AlternativeCompanySuccess, null);
//        Common.ajaxCall("GET", "/Settings/GetCompanySetting", null, CompanySuccess, null);
//        //$('#BankInfoHide').show();
//        $('#AddAlternativeCompany').hide();
//        $('#UpdateSetting').show();
//        $('#IsPrimaryHide').hide();
//        $('#GSTNumberHide').removeClass('col-md-2 col-6');
//        $('#GSTNumberHide').addClass('col-md-3 col-6');
//        $('#imageUploadlabel-manageuser').prop('disabled', false);
//    }
//}

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
    

    Common.ajaxCall("GET", "/Contact/GetProductListVendor", { ModuleName: "Vendor" }, ProductListSuccess, null);

    Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, FranchiseSuccess, null);

    $('#BankCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});


$(document).on('click', '#SaveClient', function (e) {

    if (!Common.validateEmailwithErrorwithParent('FormVendor', 'Email')) {
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

    var PrimaryValid = isPrimaryChecked('IsPrimary', 'Vendorcontact');

    if (isFormValid && PrimaryValid && isValid && $("#FormVendor").valid() && $("#FormVendorBank").valid() && $("#FormVendorContact").valid()) {
        var DataUpdate1 = JSON.parse(JSON.stringify(jQuery('#FormVendor').serializeArray()));
        var DataUpdate2 = JSON.parse(JSON.stringify(jQuery('#FormVendorBank').serializeArray()));

        var DataUpdate = DataUpdate1.concat(DataUpdate2);

        var objvalue = {};
        $.each(DataUpdate, function (index, item) {
            objvalue[item.name] = item.value;
        });

        objvalue.IsActive = $('#IsActive').is(':checked');
        objvalue.BankName = $('#BankName').val();
        objvalue.BranchName = $('#BranchName').val();
        objvalue.MaxCreditLimit = Common.parseFloatInputValue('MaxCreditLimit') || null;
        objvalue.CurrentCreditLimit = Common.parseFloatInputValue('CurrentCreditLimit') || null;

        var ContactPerson = [];
        var ClosestDiv = $('#FormVendorContact .Vendorcontact');
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
                ContactId: parseInt(vendorId) || null
            });
        });
        objvalue.contactPersonDetails = ContactPerson;

        var ProductList = [];
        var ClosestDivProductList = $('#FormVendorProductMapp #VendorProductList input[type="checkbox"]:checked');

        $.each(ClosestDivProductList, function (index, element) {
            var ProductId = $(element).data('id');
            var IsPrimary = $(element).prop('checked');
            var getProductMappingId = $(element).siblings('.ProductMappingId').text();

            ProductList.push({
                VendorProductMappingId: parseInt(getProductMappingId) || null,
                VendorId: parseInt(vendorId) || null,
                ProductId: ProductId
            });
        });

        objvalue.vendorProductMappingDetails = ProductList;




        objvalue.VendorId = parseInt(vendorId) || null;
        objvalue.StateId = parseInt($('#StateId').val()) || null;
        Common.ajaxCall("POST", "/Contact/InsertUpdareVendorDetails", JSON.stringify(objvalue), VendorInsertUpdateSuccess, null);
    }
});
$(document).on('click', '#CloseCanvas', function () {
    $("#BankCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});

/*   ===================================================================================================================*/

function BranchSuccess(response) {
    if (response.status) {
        $('#GetBranchDetails').empty();
        var data = JSON.parse(response.data);
        var html = "";
        if (data[0][0].BranchId != null && data[0][0].BranchId != "") {
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
                            <i class="btn-edit-Branch mx-1" title="Edit" data-id="${branchData.BranchId}"><img src="/assets/commonimages/edit.svg"></i>
                            <i class="btn-delete-Branch alert_delete mx-1" title="Delete" data-id="${branchData.BranchId}"><img src="/assets/commonimages/delete.svg"></i>
                        </div>
                    </div>
                </div>
                `;
            });

            $('#GetBranchDetails').append(html);
        }
        else {
            var html = `<div class="col-12 d-flex justify-content-center"><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>`;
            $('#GetBranchDetails').append(html);
        }
    }
}

$(document).on('click', '#AddBranchBtn', function () {
    branchId = 0;
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#AddBranchCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#AddBranchCanvas").css("width", "50%");
    } else {
        $("#AddBranchCanvas").css("width", "39%");
    }
    $('#fadeinpage').addClass('fadeoverlay');
    $('#BranchHeader').text('Add Branch Details');
    $('#AddBranchCanvas .collapse').removeClass('show');
    $('#collapse1').addClass('show');
    Common.removevalidation('FormBranch');
    Common.removevalidation('FormBranchContact');
    $('#FormBranchContact .Branchcontact').remove('');
    duplicateRow();
    $('#SaveBranch').text('Save').removeClass('btn-update').addClass('btn-success');
});

$(document).on('click', '#CloseCanvas', function () {
    $("#AddBranchCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
    Common.removevalidation('FormBranch');
    Common.removevalidation('FormBranchContact');
    $('#FormBranchContact .Branchcontact').remove('');
});

$(document).on('click', '.btn-edit-Branch', function () {
    branchId = $(this).data('id');
    $('#SaveBranch').text('Update').removeClass('btn-success').addClass('btn-update');
    Common.ajaxCall("GET", "/Settings/GetBranch", { BranchId: branchId }, BranchNotNullSuccess, null);
});

$(document).on('click', '.btn-delete-Branch', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        branchId = $(this).data('id');
        Common.ajaxCall("GET", "/Settings/DeleteBranch", { BranchId: branchId }, InsertUpdateBranchSuccess, null);
    }
});

$(document).on('click', '#SaveBranch', function (e) {
    if (!Common.validateEmailwithErrorwithParent('FormBranch', 'Email')) {
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

    var PrimaryValid = isPrimary('IsPrimary', 'Branchcontact');
    if (isFormValid && PrimaryValid && isValid && $("#FormBranch").valid()) {

        var DataStatic = JSON.parse(JSON.stringify(jQuery('#FormBranch').serializeArray()));
        var objvalue = {};
        $.each(DataStatic, function (index, item) {
            objvalue[item.name] = item.value;
        });

        objvalue.BranchId = branchId > 0 ? branchId : null;
        objvalue.BranchEmail = $('#FormBranch #Email').val() || null;
        objvalue.IsActive = true;
        //objvalue.IsActive = $('#FormBranch #IsActive').is(':checked');

        var ContactPerson = [];
        var ClosestDiv = $('#FormBranchContact .Branchcontact');
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
                ContactId: parseInt(branchId) || null
            });
        });

        objvalue.ContactPersonDetails = ContactPerson;

        Common.ajaxCall("POST", "/Settings/InsertUpdateBranch", JSON.stringify(objvalue), InsertUpdateBranchSuccess, null);
    }
});


function InsertUpdateBranchSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#AddBranchCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.removevalidation('FormBranch');
        Common.removevalidation('FormBranchContact');
        $('#FormBranchContact .Branchcontact').remove('');
        Common.ajaxCall("GET", "/Settings/GetBranch", { BranchId: null }, BranchSuccess, null);
    }
    else
        Common.errorMsg(response.message);
}

function BranchNotNullSuccess(response) {
    if (response.status) {

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#AddBranchCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#AddBranchCanvas").css("width", "50%");
        } else {
            $("#AddBranchCanvas").css("width", "39%");
        }
        $('#BranchHeader').text('Edit Branch Details');
        $('#SaveClient').text('Update');
        $('#SaveClient').addClass('btn-update');
        $('#fadeinpage').addClass('fadeoverlay');
        $('#AddBranchCanvas .collapse').removeClass('show');
        $('#collapse1').addClass('show');
        $('#FormBranchContact .Branchcontact').remove('');
        Common.removevalidation('FormBranch');
        Common.removevalidation('FormBranchContact');

        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
        $('#FormBranch #BranchCountry').val(data[0][0].BranchCountry);
        $('#FormBranch #Email').val(data[0][0].BranchEmail);
        $('#FormBranch #BranchName').val(data[0][0].BranchName);

        if (data[1][0].BranchContactPersonMappingId != null && data[1][0].BranchContactPersonMappingId != "") {

            $.each(data[1], function (index, value) {
                var rowadd = $('.Branchcontact').length;
                var DynamicLableNo = rowadd + 1;
                let unique = Math.random().toString(36).substring(2);
                var PrimaryCheck = value.IsPrimary == true ? 'checked' : '';
                var htmlAppend =
                    `
                   <div class="row Branchcontact">
                     <input type="hidden" class="clientContactPersonId" id="ClientContactPersonId" name="ClientContactPersonId" data-id="${value.BranchContactPersonMappingId}" />
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

                $('#FormBranchContact').append(htmlAppend);
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
        //                <lable class="AssMappingMappingId d-none">${AssMappData.AssetBranchMappingId}</lable>
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
    var rowadd = $('.Branchcontact').length
    var DynamicLableNo = rowadd + 1;

    if ((rowadd < 2)) {
        var htmlRow = `
            <div class="row Branchcontact">
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

        $('#FormBranchContact').append(htmlRow);
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
    $('.Branchcontact').each(function (index) {
        // Update the label text with the correct row number
        $(this).find('.DynamicLable_1').text('Contact Person ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.Branchcontact');
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
    var totalRows = $('.Branchcontact').length;
    if (totalRows > 1) {
        $(button).closest('.Branchcontact').remove();
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


$(document).on("input", '#FormBranch #Email', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormBranch', 'Email')) {
        $('#FormBranch #Email-error').remove();
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