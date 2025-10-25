var serviceEngrId = 0;
var BranchMappingId = 0;

$(document).ready(function () {

    BranchMappingId = parseInt(localStorage.getItem('BranchId'));

    //Common.ajaxCall("GET", "/Contact/GetServiceEngr", { BranchId: parseInt(BranchMappingId), ServiceEngrId: null }, ServiceEngrSuccess, null);
    ServiceEngrSuccess();
    Common.bindDropDown('ServiceEngrTypeId', 'ServiceEngrType');
    setPrimaryCheckboxEventListeners();
    //$('#FormBranchData #BindBranchDataProfile').empty('');
    $('#IsActiveHide').hide();
    $('#TransactionsHide').hide();
    $('#AssetMappingHide').hide();
    $('#CurrentlimitHide').hide();

    $('#CurrentlimitHide').removeClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2').addClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2');

    $(document).on('click', '#SaveSeriveEngr', function (e) {

        if ($('#ServiceEngrNo').val() == "") {
            Common.warningMsg("Please Fill in the OtherSetting Module Prefix Info for the ServiceEngr in this Branch.");
        }

        if (!Common.validateEmailwithErrorwithParent('FormServiceEngr', 'Email')) {
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

        var PrimaryValid = isPrimaryChecked('IsPrimary', 'ServiceContact');
        if (isFormValid && PrimaryValid && isValid && $("#FormServiceEngr").valid()) {

            var DataStatic = JSON.parse(JSON.stringify(jQuery('#FormServiceEngr').serializeArray()));
            var objvalue = {};
            $.each(DataStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.ServiceEngrId = serviceEngrId > 0 ? serviceEngrId : null;
            objvalue.ServiceEngrNo = $('#ServiceEngrNo').val();
            objvalue.ServiceEngrTypeId = Common.parseInputValue('ServiceEngrTypeId') || null;
            objvalue.CurrentCreditLimit = Common.parseFloatInputValue('CurrentCreditLimit') || null;
            objvalue.IsActive = $('#FormServiceEngr #IsActive').is(':checked');
            objvalue.Remarks = $('#Remarks').val();

            var ContactPerson = [];
            var ClosestDiv = $('#FormContactService .ServiceContact');
            $.each(ClosestDiv, function (index, values) {
                var getContactPersonId = $(values).find('.ContactPersonId').data('id');
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
                    ContactId: parseInt(serviceEngrId) || null
                });
            });

            objvalue.ContactPersonDetails = ContactPerson;

            //var BranchList = [];
            //var ClosestDivProductList = $('#FormBranchData #BindBranchDataProfile input[type="checkbox"]:checked');

            //$.each(ClosestDivProductList, function (index, element) {
            //    var UserBranchMappingId = $(element).siblings('.userBranchMappingId').text();
            //    var branchId = $(element).data('id');
            //    var IsActive = $(element).prop('checked');

            //    BranchList.push({
            //        ContactBranchMappingId: parseInt(UserBranchMappingId) || null,
            //        ContactId: parseInt(serviceEngrId) || null,
            //        BranchId: parseInt(branchId) || null,
            //        IsSelected: IsActive,
            //    });
            //});

            //objvalue.ContactBranchMappingDetails = BranchList;
            Common.ajaxCall("POST", "/Contact/InsertUpdateServiceEngr", JSON.stringify(objvalue), ReloadSuccess, null);
        }
    });

    $(document).on('change', 'input[type="checkbox"]', function () {
        var accordion = $(this).closest('.accordion-item');
        var anyChecked = accordion.find('input[type="checkbox"]').is(':checked');
        if (anyChecked) {
            accordion.find('.checkbox-error').remove();
        }
    });
});
$(document).on('change', '.customLengthDropdown', function () {
    var $this = $(this);
    var tableSelector = $this.data('table');
    var pageLength = parseInt($this.val());

    if ($.fn.DataTable.isDataTable(tableSelector)) {
        $(tableSelector).DataTable().page.len(pageLength).draw();
    }
});

//function ServiceEngrSuccess(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var CounterBox = Object.keys(data[0][0]);

//        $("#CounterTextBox1").text(CounterBox[0]);
//        $("#CounterTextBox2").text(CounterBox[1]);
//        $("#CounterTextBox3").text(CounterBox[2]);
//        $("#CounterTextBox4").text(CounterBox[3]);

//        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
//        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
//        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
//        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

//        var columns = Common.bindColumn(data[1], ['ServiceEngrId', 'Status_Color']);
//        bindTableForServiceEngr('ServiceEngrTable', data[1], columns, -1, 'ServiceEngrId', '330px', true, access);
//    }
//}


function ServiceEngrSuccess(response) {

    $("#CounterTextBox1").text("Total");
    $("#CounterTextBox2").text("Top ServiceEngr");
    $("#CounterTextBox3").text("Total Service");
    $("#CounterTextBox4").text("Total Assets");

   
    $("#CounterValBox1").text("6");
    $("#CounterValBox2").text("Electrical Services");
    $("#CounterValBox3").text("2");
    $("#CounterValBox4").text("3");


    var data = [
        {
            ServiceEngrId: 1,
            PlantName: "Aditya Factory",
            ServiceEngrNo: "IGS-SEGR-0006",
            Name: "Hardware Support Anegan DS",
            City: "Chennai",
            ContactNo: "9876543210",
            TotalTransaction: "5",
            Status: "Active",
            Status_Color: "#198754"
        },
        {
            ServiceEngrId: 2,
            PlantName: "Aditya Factory",
            ServiceEngrNo: "IGS-SEGR-0005",
            Name: "Networking NetLink Service",
            City: "Coimbatore",
            ContactNo: "9845001122",
            TotalTransaction: "4",
            Status: "Active",
            Status_Color: "#198754"
        }
    ];


    var columns = [
        { data: "PlantName", title: "Plant Name" },
        { data: "ServiceEngrNo", title: "Service Engr No" },
        { data: "Name", title: "Name" },
        { data: "City", title: "City" },
        { data: "ContactNo", title: "Contact No" },
        { data: "TotalTransaction", title: "Total Transaction" },
        { data: "Status", title: "Status" }
    ];

   
    var access = { update: true, delete: true };

 
    bindTableForServiceEngr('ServiceEngrTable', data, columns, -1, 'ServiceEngrId', '330px', true, access);
}


function ReloadSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#ClientCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
       // $('#FormBranchData #BindBranchDataProfile').empty('');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Contact/GetServiceEngr", { BranchId: parseInt(BranchMappingId), ServiceEngrId: null }, ServiceEngrSuccess, null);
    }
}

$(document).on('click', '#AddClient', function () {
    $('#loader-pms').show();

    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#ClientCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#ClientCanvas").css("width", "50%");
    } else {
        $("#ClientCanvas").css("width", "39%");
    }
    $("#ClientHeader").text('Add Service Engr Details');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#FormServiceEngr")[0].reset();
    Common.removevalidation('FormServiceEngr');
    Common.removeMessage('FormServiceEngr');
    $('#Country').val('India');
    $('#FormContactService').empty('');
    $('#TransactionsHide').hide();
    $('#AssetMappingHide').hide();
    duplicateRow();
    serviceEngrId = 0;
    $("#FormServiceEngr select").val("").trigger("change");
    $('#SaveSeriveEngr').text('Save').addClass('btn-success').removeClass('btn-update');
    //$('#FormAssMapp #BindAssMappingData').empty('');
    $('#loader-pms').hide();
    $('#IsActiveHide').hide();
    $('#CurrentlimitHide').removeClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2').addClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2').hide();
    //$('#FormBranchData #BindBranchDataProfile').empty('');
    $('#ClientCanvas .collapse').removeClass('show');
    $("#State").val('Tamilnadu');
    $('#collapse1').addClass('show');
    $('#CurrentCreditLimit').prop('disabled', false);

    Common.ajaxCall("GET", "/Inventory/GetAutoGenerateNo", { ModuleName: "ServiceEngr", BranchId: null }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            if (data[0][0].ServiceEngrNo != null) {
                $('#ServiceEngrNo').val(data[0][0].ServiceEngrNo);
            }
            else {
                Common.warningMsg("Please Fill in the OtherSetting Module Prefix Info for the ServiceEngr in this Branch.");
            }
        }
    }, null);

   // Common.ajaxCall("GET", "/Myprofile/GetBranchDetails", null, BranchSuccess, null);
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
        $("#ClientCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#ClientCanvas").css("width", "50%");
    } else {
        $("#ClientCanvas").css("width", "39%");
    }
    Common.removeMessage('FormServiceEngr');
    $('#CurrentCreditLimit').prop('disabled', true);
    $('#IsActiveHide').show();
    $('#TransactionsHide').show();
    $('#AssetMappingHide').show();
    $('#CurrentlimitHide').removeClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2').addClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2').show();
    $("#ClientHeader").text('Edit Service Engr Details');
    $('#fadeinpage').addClass('fadeoverlay');
    $('#SaveSeriveEngr').text('Update').addClass('btn-update').removeClass('btn-success');
    //$('#FormAssMapp #BindAssMappingData').empty('');
    $('#loader-pms').hide();
    //$('#FormBranchData #BindBranchDataProfile').empty('');
    serviceEngrId = $(this).data('id');
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    Common.ajaxCall("GET", "/Contact/GetVendorID", { VendorId: 2, FranchiseId: franchiseId }, editSuccess, null);
    //Common.ajaxCall("GET", "/Contact/GetServiceEngr111111111", { BranchId: parseInt(BranchMappingId), ServiceEngrId: serviceEngrId }, editSuccess, null);
    $('#ClientCanvas .collapse').removeClass('show');
    $('#collapse1').addClass('show');
});

function editSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
        $('#ServiceEngrNo').val(data[0][0].ServiceEngrNo);
        $('#ServiceEngrTypeId').val(data[0][0].ServiceEngrTypeId).trigger('change');
        $('#FormContactService').empty('');

        $.each(data[1], function (index, value) {
            var rowadd = $('.ServiceContact').length;
            var DynamicLableNo = rowadd + 1;
            let unique = Math.random().toString(36).substring(2);
            var PrimaryCheck = value.IsPrimary == true ? 'checked' : '';
            var htmlAppend =
                `
                   <div class="row ServiceContact">
                     <input type="hidden" class="ContactPersonId" id="ContactPersonId" name="ContactPersonId" data-id="${value.ClientContactPersonId}" />
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

            $('#FormContactService').append(htmlAppend);
            setPrimaryCheckboxEventListeners();
        });

        //if (data[2][0].BranchId != null && data[2][0].BranchId != "") {
        //    var htmlDynamicBranch = "";
        //    $.each(data[2], function (index, Branch) {
        //        var branchId = Branch.BranchId;
        //        var userBranchMappingId = Branch.VendorBranchMappingId;
        //        var branchName = Branch.BranchName;
        //        var isCheck = Branch.IsSelected == true ? 'checked' : '';

        //        htmlDynamicBranch += `
        //            <div class="col-md-6 col-lg-6 col-sm-6 col-4 mt-2">
        //                <lable class="userBranchMappingId d-none">${userBranchMappingId}</lable>
        //                <input type="checkbox" data-id="${branchId}" name="products" value="${branchName}" ${isCheck} id="product-${branchId}">
        //                <label for="product-${branchId}" class="checkbox-label">${branchName}</label>
        //            </div>
        //        `;
        //    });
        //    $('#BindBranchDataProfile').append(htmlDynamicBranch);
        //}
        //else {
        //    $('#FormAssMapp #BindBranchDataProfile').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
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

        //Common.ajaxCall("GET", "/Contact/GetAssetMappingDetailsPOP", { ContactId: parseInt(serviceEngrId), BranchId: parseInt(BranchMappingId), ModuleName: "ServiceEngr" }, AssMappingProductSuccess, null);
    }
}

$(document).on('click', '#CloseCanvas', function () {
    $("#ClientCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
    //$('#FormAssMapp #BindAssMappingData').empty('');
});

$(document).on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var serviceEngrId = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/DeleteServiceEngr", { ServiceEngrId: serviceEngrId }, ReloadSuccess, null);
    }
});

function duplicateRow() {

    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.ServiceContact').length
    var DynamicLableNo = rowadd + 1;

    if ((rowadd < 2)) {
        var htmlRow = `
            <div class="row ServiceContact">
             <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                <label class="DynamicLable">Contact Person ${DynamicLableNo}</label>
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

        $('#FormContactService').append(htmlRow);
        setPrimaryCheckboxEventListeners();
        updateRemoveButtons();
    }
}

function updateRowLabels() {
    $('.ServiceContact').each(function (index) {
        // Update the label text with the correct row number
        $(this).find('.DynamicLable').text('Contact Person ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.ServiceContact');
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
    var totalRows = $('.ServiceContact').length;
    if (totalRows > 1) {
        $(button).closest('.ServiceContact').remove();
        updateRowLabels();
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

$(document).on("input", '#FormServiceEngr #Email', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormServiceEngr', 'Email')) {
        $('#FormServiceEngr #Email-error').remove();
        if (inputElement != "") {
            $(element).addClass('is-invalid error');
        }
    }
});

//function AssMappingProductSuccess(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var html = "";
//        if (data[0][0].AssetName != null && data[0][0].AssetName != "") {
//            $.each(data[0], function (index, AssMappData) {
//                html += `
//                    <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2 mb-2">
//                        <lable class="AssMappingMappingId d-none"></lable>
//                        <input type="checkbox" data-id="" class="AssId" name="Assets" checked disabled id="product">
//                        <label for="product" class="checkbox-label">${AssMappData.AssetName}</label>
//                    </div>
//                `;
//            });

//            $('#FormAssMapp #BindAssMappingData').append(html);
//        } else {
//            $('#FormAssMapp #BindAssMappingData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
//        }
//    }
//}

//function BranchSuccess(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var htmlDynamicProduct = "";
//        if (data[0][0].BranchId != null && data[0][0].BranchId != "") {
//            $.each(data[0], function (index, branchData) {
//                var branchId = branchData.BranchId;
//                var branchName = branchData.BranchName;

//                htmlDynamicProduct += `
//                <div class="col-md-6 col-lg-6 col-sm-6 col-4 mt-2">
//                    <lable class="FranchiseMappingId d-none"></lable>
//                    <input type="checkbox" data-id="${branchId}" name="products" id="product-${branchId}">
//                    <label for="product-${branchId}" class="checkbox-label">${branchName}</label>
//                </div>
//            `;
//            });
//            $('#BindBranchDataProfile').append(htmlDynamicProduct);
//        }
//        else {
//            $('#BindBranchDataProfile').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
//        }
//    }
//}

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

        //if (headerText === "Branch Mapping Info") {
        //    var checkboxes = currentAccordion.find('input[type="checkbox"]');
        //    var anyChecked = checkboxes.is(':checked');

        //    if (!anyChecked) {
        //        isCurrentValid = false;
        //        isFormValid = false;

        //        if (!currentAccordion.find('.checkbox-error').length) {
        //            currentAccordion.find('#BindBranchDataProfile').append(
        //                '<div class="invalid-feedback checkbox-error d-flex justify-content-start ml-3">Please select at least one Branch.</div>'
        //            );
        //        }

        //        if (!firstInvalidAccordion) {
        //            firstInvalidAccordion = currentAccordion;
        //        }
        //    } else {
        //        currentAccordion.find('.checkbox-error').remove();
        //    }
        //}

        if (isCurrentValid) {
            currentAccordion.find('.collapse').collapse('hide');
        }
    });

    if (firstInvalidAccordion) {
        firstInvalidAccordion.find('.collapse').collapse('show');
    }

    return isFormValid;
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

function bindTableForServiceEngr(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "AssetManagementnocount");

    var BranchIdDropdown = parseInt(localStorage.getItem('BranchId'));
    if (!isNaN(BranchIdDropdown) && BranchIdDropdown !== 0) {
        columns = columns.filter(x => x.data !== "BranchName");
    }
    var isbuyernocount = data[0].hasOwnProperty('AssetManagementnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

    if (isAction == true && data != null && data.length > 0 && !isbuyernocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
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
                        return `
                                 ${editCondition ? `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-delete alert_delete mx-1"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
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
        "dom": "<'dt-custom-wrapper'frtip>",
        "bDestroy": true,
        "responsive": true,
        "data": !isbuyernocount ? data : [],
        "columns": columns,
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "aaSorting": [],
        "scrollCollapse": true,
        "oSearch": { "bSmart": false, "bRegex": true },
        "info": hasValidData,
        "paging": hasValidData,
        "lengthMenu": [
            [5, 10, 25, 50, 100],
            ['5', '10', '25', '50', '100']
        ],
        "pageLength": 10,
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "columnDefs": !isbuyernocount
            ? renderColumn : [],
    });
    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });
    $('#customLengthDropdown').off('change').on('change', function () {
        var selectedLength = parseInt($(this).val(), 10);
        table.page.len(selectedLength).draw();
    });
    setTimeout(function () {
        var table1 = $('.tableResponsive').DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}


/*=============================================Table For Transactions Info===========================================*/

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