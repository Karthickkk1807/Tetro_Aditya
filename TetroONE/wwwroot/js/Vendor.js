let selectedItems = [];
var vendorId = 0;
$(document).ready(function () {

    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    Common.ajaxCall("GET", "/Contact/GetVendor", { FranchiseId: FranchiseMappingId }, VendorSuccess, null);
    Common.bindDropDownParent('StateId', 'FormVendor', 'State');
    //$('#FormFranchiseData #BindFranchiseData').empty();
    $('#IsActiveHide').hide();

    setPrimaryCheckboxEventListeners();
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


            //var FranchiseList = [];
            //var ClosestDivProductList = $('#FormFranchiseData #BindFranchiseData input[type="checkbox"]:checked');

            //$.each(ClosestDivProductList, function (index, element) {
            //    var ContactFranchiseMappingId = $(element).siblings('.ProductMappingId').text();
            //    var moduleId = vendorId;
            //    var franchiseId = $(element).data('id');
            //    var IsActive = $(element).prop('checked');

            //    FranchiseList.push({
            //        ContactFranchiseMappingId: parseInt(ContactFranchiseMappingId) || null,
            //        ContactId: parseInt(moduleId) || null,
            //        FranchiseId: franchiseId,
            //        IsSelected: IsActive,
            //    });
            //});

            //objvalue.franchiseMappingDetails = FranchiseList;


            objvalue.VendorId = parseInt(vendorId) || null;
            objvalue.StateId = parseInt($('#StateId').val()) || null;
            Common.ajaxCall("POST", "/Contact/InsertUpdareVendorDetails", JSON.stringify(objvalue), VendorInsertUpdateSuccess, null);
        }
    });
});

function VendorSuccess(response) {
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

        var columns = Common.bindColumn(data[1], ['VendorId', 'Status_Color']);
        Common.bindTable('VendorTable', data[1], columns, -1, 'VendorId', '330px', true, access);
    }
}

function VendorInsertUpdateSuccess(response) {
    if (response.status) {
       // $('#FormFranchiseData #BindFranchiseData').empty();
        Common.successMsg(response.message);
        $("#VendorCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Contact/GetVendor", { FranchiseId: franchiseId }, VendorSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

function ProductListSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var products = data[0]; // Extract the actual array of products
        var htmlDynamicProduct = '';
        if (data[0][0].ProductId != null && data[0][0].ProductId != "") {
            $.each(products, function (index, product) {
                var ProductId = product.ProductId;
                var ProductName = product.ProductName;

                htmlDynamicProduct += `
                <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                    <input type="checkbox" data-id="${ProductId}" name="products" value="${ProductName}" id="product-${ProductId}">
                    <label for="product-${ProductId}" class="checkbox-label">${ProductName}</label>
                </div>
                `;
            });
            $("#FormVendorProductMapp #VendorProductList").html(htmlDynamicProduct);
        } else {
            $('#FormVendorProductMapp #VendorProductList').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        }
    }
}

$(document).on('click', '#AddVendor', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#VendorCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#VendorCanvas").css("width", "50%");
    } else {
        $("#VendorCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingVendor();
    vendorId = 0;
    $("#VendorHeader").text('Add Vendor Details');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#FormVendor")[0].reset();
    $("#FormVendorBank")[0].reset();
    $("#FormVendorContact")[0].reset();
    Common.removeMessage('FormVendor');
    Common.removeMessage('FormVendorBank');
    Common.removeMessage('FormVendorContact');
    $('#FormVendorContact').empty('');
    duplicateRow();
    $("#FormVendor,#FormVendorBank select").val("").trigger("change");
    $('#FormVendor #StateId').val('32');
    $('#Country').val('India');
    $('#AccountType').val('Current');
    $('#IsActiveHide').hide();
    $('#SaveClient').text('Save').addClass('btn-success').removeClass('btn-update');
    $("input[name='products']").prop("checked", false);
    $('#loader-pms').hide();
    //$('#FormFranchiseData #BindFranchiseData').empty('');

    $('#TransactionsHide').hide();

    Common.ajaxCall("GET", "/Contact/GetProductListVendor", { ModuleName: "Vendor" }, ProductListSuccess, null);

    //Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, FranchiseSuccess, null);

    $('#VendorCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});

//function FranchiseSuccess(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var htmlDynamicProduct = "";
//        if (data[0][0].FranchiseId != null && data[0][0].FranchiseId != "") {
//            $.each(data[0], function (index, franchiseData) {
//                var FranchiseId = franchiseData.FranchiseId;
//                var FranchiseName = franchiseData.FranchiseName;
//                var IsActiveCheck = franchiseData.IsActive == true ? 'checked' : '';

//                htmlDynamicProduct += `
//                 <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
//                    <lable class="FranchiseMappingId d-none"></lable>
//                    <input type="checkbox" data-id="${FranchiseId}" name="product${FranchiseId}" ${IsActiveCheck} id="product${FranchiseId}">
//                    <label for="product${FranchiseId}" class="checkbox-label">${FranchiseName}</label>
//                </div>
//            `;
//            });
//            $('#FormFranchiseData #BindFranchiseData').append(htmlDynamicProduct);
//        }
//        else {
//            $('#FormFranchiseData #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
//        }
//        $('#FormVendor #StateId').val('32');
//    }
//}

$(document).on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#VendorCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#VendorCanvas").css("width", "50%");
    } else {
        $("#VendorCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingVendor();
    Common.removeMessage('FormVendor');
    Common.removeMessage('FormVendorBank');
    Common.removeMessage('FormVendorContact');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#VendorHeader").text('Edit Vendor Details');
    $('#SaveClient').text('Update').addClass('btn-update').removeClass('btn-success');
    //$('#FormFranchiseData #BindFranchiseData').empty();
    $('#IsActiveHide').show();
    vendorId = $(this).data('id');
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    Common.ajaxCall("GET", "/Contact/GetVendorID", { VendorId: vendorId, FranchiseId: franchiseId }, editSuccess, null);

    $('#VendorCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});

$(document).on('click', '#VendorTable .btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var VendorId = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/DeleteVendor", { VendorId: VendorId }, VendorInsertUpdateSuccess, null);
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

        var htmlDynamicProduct = '';

        if (data[2][0].ProductId == null || data[2][0].ProductId == undefined || data[2][0].ProductId == "") {
            htmlDynamicProduct += `
                <div class="col-12 d-flex justify-content-center">
                   <div><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No Product Found</div>
                </div>
            `;
            $("#FormVendorProductMapp #VendorProductList").html(htmlDynamicProduct);
        }
        else {
            $.each(data[2], function (index, value) {
                let unique = Math.random().toString(36).substring(2);
                var PrimaryCheck = value.IsActive == true ? 'checked' : '';
                htmlDynamicProduct += `
                <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                    <lable class="ProductMappingId d-none">${value.VendorProductMappingId}</lable>
                    <input type="checkbox" data-id="${value.ProductId}" name="products${unique}" value="${value.ProductName}" id="product${unique}" ${PrimaryCheck}>
                    <label for="product${unique}" class="checkbox-label">${value.ProductName}</label>
                </div>
            `;
                $("#FormVendorProductMapp #VendorProductList").html(htmlDynamicProduct);
            });
        }


        $('#FormVendorContact').empty('');
        $.each(data[1], function (index, value) {
            var rowadd = $('.Vendorcontact').length;
            var DynamicLableNo = rowadd + 1;
            let unique = Math.random().toString(36).substring(2);
            var PrimaryCheck = value.IsPrimary == true ? 'checked' : '';
            var htmlAppend =
                `
                       <div class="row Vendorcontact">
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

            $('#FormVendorContact').append(htmlAppend);
            setPrimaryCheckboxEventListeners();
        });

        //var htmlDynamicProduct = "";
        //if (data[3][0].FranchiseId != null && data[3][0].FranchiseId != "") {
        //    $.each(data[3], function (index, franchiseData) {
        //        var FranchiseMappingId = franchiseData.VendorFranchiseMappingId;
        //        var FranchiseId = franchiseData.FranchiseId;
        //        var FranchiseName = franchiseData.FranchiseName;
        //        var IsActiveCheck = franchiseData.IsSelected == true ? 'checked' : '';

        //        htmlDynamicProduct += `
        //         <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
        //            <lable class="FranchiseMappingId d-none">${FranchiseMappingId}</lable>
        //            <input type="checkbox" data-id="${FranchiseId}" name="products" ${IsActiveCheck} id="product-${FranchiseId}">
        //            <label for="product-${FranchiseId}" class="checkbox-label">${FranchiseName}</label>
        //        </div>
        //    `;
        //    });
        //    $('#FormFranchiseData #BindFranchiseData').append(htmlDynamicProduct);
        //}
        //else {
        //    $('#FormFranchiseData #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        //}

        $('#TransactionsHide').show();

        $('#TransactionsInfo').empty('');
        var html =
            `
         <div class="table-responsive">
             <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="Managetable"></table>
         </div>
         `;
        $('#TransactionsInfo').append(html);

        var columns = Common.bindColumn(data[3], ['PurchaseRequestId', 'Status_Color']);
        bindTableTransactionsInfo('Managetable', data[3], columns, -1, 'PurchaseRequestId', '151px', true);


        updateRemoveButtons();
    }
}

$(document).on('click', '#CloseCanvas', function () {
    $("#VendorCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});

$(document).on('input', '#FormVendor #MaxCreditLimit', function () {
    var thisVal = $(this).val();
    if (vendorId == 0) {
        $('#CurrentCreditLimit').val(thisVal);
    }
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
    var rowadd = $('.Vendorcontact').length
    var DynamicLableNo = rowadd + 1;
    if ((rowadd < 2)) {
        var htmlRow = ``;
        htmlRow = `
            
            <div class="row Vendorcontact">
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

        $('#FormVendorContact').append(htmlRow);
        setPrimaryCheckboxEventListeners();
        updateRemoveButtons();
    }
}

function updateRowLabels() {
    $('.Vendorcontact').each(function (index) {
        $(this).find('.DynamicLable').text('Contact Person ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.Vendorcontact');
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
    var totalRows = $('.Vendorcontact').length;
    if (totalRows > 1) {
        $(button).closest('.Vendorcontact').remove();
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

$("input[type='checkbox'][name='products']").on("change", function () {
    let value = $(this).val();
    if ($(this).is(":checked")) {
        if (!selectedItems.includes(value)) {
            selectedItems.push(value);
        }
    } else {
        selectedItems = selectedItems.filter(item => item !== value);
    }
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
            // Uncheck all other "IsPrimary" checkboxes
            $('.IsPrimary').not(this).prop('checked', false);

            $('#IsPrimaryError').addClass('d-none');

        } else {

            $('#IsPrimaryError').removeClass('d-none');
        }


    });
}

function validateFormAccordions(accordionSelector, errorMessageDefault = 'This field is required') {
    var isFormValid = true;
    var foundInvalidAccordion = false;

    $(accordionSelector).each(function () {
        if (foundInvalidAccordion) {
            return false;
        }

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
            }
            else if (minLength && value.length < parseInt(minLength)) {
                isInvalid = true;
                errorMessage = `Please enter at least ${minLength} characters.`;
            }
            else if (maxLength && value.length > parseInt(maxLength)) {
                isInvalid = true;
                errorMessage = `Please enter no more than ${maxLength} characters.`;
            }

            if (isInvalid) {
                input.addClass('is-invalid error');
                input.nextAll('.invalid-feedback, .error').remove();
                input.after('<div class="invalid-feedback">' + errorMessage + '</div>');

                isCurrentValid = false;
            } else {
                input.removeClass('is-invalid error');
                input.nextAll('.invalid-feedback, .error').remove();
            }
        });

        //if (headerText === "Franchise Mapping Info") {
        //    var checkboxes = currentAccordion.find('input[type="checkbox"]');
        //    var anyChecked = checkboxes.is(':checked');

        //    if (!anyChecked) {
        //        isCurrentValid = false;

        //        if (!currentAccordion.find('.checkbox-error').length) {
        //            currentAccordion.find('#BindFranchiseData').append(
        //                '<div class="invalid-feedback checkbox-error d-flex justify-content-center">Please select at least one franchise</div>'
        //            );
        //        }
        //    } else {
        //        currentAccordion.find('.checkbox-error').remove();
        //    }
        //}

        if (!isCurrentValid) {
            isFormValid = false;
            foundInvalidAccordion = true;
            currentAccordion.find('.collapse').collapse('show');
            currentAccordion[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
            $(accordionSelector).not(currentAccordion).find('.collapse').collapse('hide');
        } else {
            currentAccordion.find('.collapse').collapse('hide');
        }
    });

    return isFormValid;
}

$(document).on("input", '#FormVendor #Email', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormVendor', 'Email')) {
        $('#FormVendor #Email-error').remove();
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

function CanvasOpenFirstShowingVendor() {
    $('#VendorCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#VendorCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#VendorCanvas').offset().top
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