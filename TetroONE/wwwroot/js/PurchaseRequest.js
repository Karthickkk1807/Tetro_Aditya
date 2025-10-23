var selectedProductQuantity = [];
var selectedProductIdsList = [];
var formDataMultiple = new FormData();
var deletedFiles = [];
var existFiles = [];
var EditPurchaseRequest = 0;
var disableChangeEvent = false;
var AutoGenerateFlag = false;
var printType = "";
var PDFformat = "";
var StartDate;
var EndDate;
var IsCommaFormat = 1;
$(document).ready(function () {

    $('#loader-pms').show();
    $('.Status-Div').hide();

    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    Inventory.EmailValidationOnInputVendor();
    $('#SpinnerWhatsApp').hide();
    $('.PartiallyPaidHide').hide();
    $('#RechangeClassName').removeClass('modal-dialog modal-dialog-centered modal-xl').addClass('modal-dialog modal-dialog-centered modal-lg');
    $('#AdditemSearch').removeClass('searchbar__input').addClass('searchbarinput');
    selectedProductIdsList = [];


    /*-------------------- Validation For Inputs ---------------------------*/

    var form = $("#FormStatus,#FormVendor").validate({
        rules: {
            Vendor: {
                required: true,
            } 
        },
        messages: {
            Vendor: {
                required: "This field is required.",
            }
        }, 
    });


    /* -------------------- Validation For Inputs --------------------------- */

    initializePage(FranchiseMappingId);

    Common.bindDropDown('Vendor', 'Vendor');
    Common.bindDropDown('AlternativeCompanyAddress', 'Franchise');

    Common.bindDropDown('BillFrom', 'FranchiseBillFrom');


    $('#Vendor,#AlternativeCompanyAddress').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
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


$('#BillFrom').on('change', async function () {
    if (disableChangeEvent) return;
    $('#loader-pms').show();
    const ModuleId = $(this).val();
    const ModuleName = "FranchiseFrom";

    if (ModuleId) {
        const url = `/Common/BillFromDetails_BillFromId?ModuleId=${parseInt(ModuleId)}&ModuleName=${encodeURIComponent(ModuleName)}`;
        const responseData = await Common.getAsycData(url);
        if (responseData !== null) {
            Inventory.BillFromAddressDetails(responseData);
            ResetDataDetails();
        }
    } else {
        $('#BillFromAddress').text('');
    }
    $('#loader-pms').hide();
});

$(document).on('change', '#Vendor', function () {

    var value = $(this).val();
    if (value != "") {
        $('.overraphide').find('.error').remove();
    }
});

$(document).on('change', '#PurchaseRequestStatusId', function () {

    var value = $(this).val();
    if (value != "") {
        $('.statusError').find('.error').remove();
    }
});

async function initializePage(FranchiseMappingId) {

    $('.page-inner-footer').hide();
    var today = new Date().toISOString().split('T')[0];
    $("#PurchaseRequestDate").attr("max", today);

    $('#AddAttachment').hide();

    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);

    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, PurchaseRequestId: null, FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/PurchaseRequest/GetPurchaseRequest", EditDataId, PurchaseRequestSuccessSuccess, null);

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#ShareDropdownitems').length && !target.closest('#btnsharePurchaseRequest').length) {
            $('#ShareDropdownitems').css('display', 'none');
        }
    });
}
 
function PurchaseRequestSuccessSuccess(response) {

    if (response.status) {

        var data = JSON.parse(response.data); 
        var CounterBox = Object.keys(data[0][0]);

        $("#lblCounterBox1").text(CounterBox[0]);
        $("#lblCounterBox2").text(CounterBox[1]);
        $("#lblCounterBox3").text(CounterBox[2]);
        $("#lblCounterBox4").text(CounterBox[3]);

        $('#valCounterBox1').text(data[0][0][CounterBox[0]]);
        $('#valCounterBox2').text(data[0][0][CounterBox[1]]);
        $('#valCounterBox3').text(data[0][0][CounterBox[2]]);
        $('#valCounterBox4').text(data[0][0][CounterBox[3]]);

        var columns = Common.bindColumn(data[1], ['PurchaseRequestId', 'Status_Color']);
        Common.bindTablePurchase('PurchaseRequestData', data[1], columns, -1, 'PurchaseRequestId', '330px', true, access);
        $('#loader-pms').hide();
    }
}
/* ------------------------------------------- Vendor  Functionality  -----------------------------------------*/
$(document).on('change', '#VendorColumn #Vendor', async function () {
    if (disableChangeEvent) return;

    const VendorId = $(this).val();
    const ModuleName = "BillTo";
    if (VendorId) {
        const url = `/Common/BillFromDetails_BillFromId?ModuleId=${parseInt(VendorId)}&ModuleName=${encodeURIComponent(ModuleName)}`;
        const responseData = await Common.getAsycData(url);
        if (responseData !== null) {
            var data = JSON.parse(responseData); 
            $("#VendorColumn #VendorAddress").text(data[0][0].Address || '');
            $("#VendorColumn #VendorCountry").text(data[0][0].Country || ''); 
            $("#VendorColumn #VendorContactNumber").text(data[0][0].ContactNumber || '');
            $("#VendorColumn #VendorGSTNumber").text(data[0][0].GSTNumber || ''); 

            var city = data[0][0].BranchCity || '';
            var zipCode = data[0][0].ZipCode || '';

            // Check if both City and ZipCode are non-empty before concatenating the dash
            var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
            $("#VendorColumn #VendorCity").text(cityName || '');
        } else {
            Inventory.ClearDataForVendorAddressDetails();
        }
    }
     
    ResetDataDetails("Vendor");
});


/* ======================================= PRODUCT TABLE ========================================== */
$(document).on('input', '.descriptiontdtext', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

$(document).on('click', '#UpdateProductsInAddItem', function () {

    var AllProductTable = 'AllProductTable';
    var tablebody = $('#PurchaseRequestProductTablebody');
    var mainTable = $('#PurchaseRequestProductTable');
    var moduleName = 'Purchase';
    $('#loader-pms').show();
    var stateSelector1 = "#VendorStateName";
    var stateSelector2 = "#StateName";
    Inventory.AddProductsToMainTable(AllProductTable, tablebody, mainTable, moduleName, stateSelector1, stateSelector2);
    $('.input-group').css('width', 'unset');
});

$(document).on('click', '.DynremoveBtn', function () {
    const row = $(this).closest('tr');
    let productId = row.data('product-id');
    var mainTable = $('#PurchaseRequestProductTable');
    const BillFromId = $('#BillFrom').prop('selectedIndex') || 1;
    Inventory.RemoveProductMainRow(row, productId, mainTable, BillFromId, IsCommaFormat);
});

$(document).on('click', '#AddItemBtn', function () {

    $('#loader-pms').show();

    var mainTable = $('#PurchaseRequestProductTable');
    var VendorId = $('#VendorColumn #Vendor').val();
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var moduleName = 'Purchase';
    if (VendorId) {
        $('#AddProductModal').show(); 
        Inventory.AllProductTable(mainTable, moduleName, VendorId, FranchiseMappingId);
        $(".TotalSelectedItmsCount,.TotalSelctAmount").hide();
    } else {
        Common.warningMsg("Choose a Vendor to Continue.");
        $('#loader-pms').hide();
    }
});

$(document).on('click', '.addQtyBtn', function () {
    $(this).hide();
    $(this).closest('td').find('.OtyColumn').toggleClass('d-none');
});

/*  =================== ================ CRUD Functionlity  ===================================  */
$(document).on('click', '#AddVendorLable', function () {
    VendorAlignmentOpen();
});

$(document).on('click', '#AddPurchaseRequestBtn', function () {
   
    Common.removevalidation('FormBillFrom');
    Common.removevalidation('FormStatus');

    $("#PurchaseRequestStatusId").val('').trigger('change');
    EditPurchaseRequest = 0;

    $("#PurchaseRequestSaveBtn span:first").text("Save");

    $('.page-inner-footer').show();
    $('.Status-Div').hide();
    VendorAlignmentClose();
    $("#ModalHeading").text("Add Purchase Request ");

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    $('#PurchaseRequestDate').val(formattedDate);


    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    if (FranchiseMappingId != 0) {
        $('#AlternativeCompanyAddress').val(FranchiseMappingId).trigger('change').prop('disabled', false);
    } else {
        $('#AlternativeCompanyAddress').prop('disabled', false).val($('#AlternativeCompanyAddress option:eq(1)').val()).trigger('change');

    }
     
    $('#BillFromAddress').val('');
    $('#BillFrom').val(FranchiseMappingId).trigger('change');
    $('#PurchaseRequestNumber').prop('disabled', true);
    selectedProductIdsList = [];
    $('#ViewBankLable').hide();
    var EditDataId = { ModuleName: "PurchaseRequest", ModuleId: null };

    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, function (response) {
        StatusSuccess(response);
        handlePurchaseRequestApprovedStatus();
    }, null);
    $('#PurchaseRequestModal').show();
    $("#PurchaseRequestModal .modal-body").animate({ scrollTop: 0 }, "fast");

})

$(document).on('change', '#AlternativeCompanyAddress', function () {
    const ShipId = parseInt($(this).val());
    const ModuleName = "ShipTo";

    Common.ajaxCall("GET", "/Common/BillFromDetails_BillFromId", { ModuleId: ShipId, ModuleName: ModuleName }, function (response) {
        if (response.status) {
            const data = JSON.parse(response.data)[0][0];

            $("#ShippingColumn #StoreAddress").text(data.FranchiseAddress || '');
            $("#ShippingColumn #StoreCity").text(data.BranchCity || '');
            $("#ShippingColumn #StateName").text(data.BranchState || '');
            $("#ShippingColumn #StoreContactNumber").text(data.FranchiseContactNo || '');
            $("#ShippingColumn #StateId").text(data.BranchState);
        }
    });

    if (!AutoGenerateFlag) {
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        const EditDataId = { ModuleName: 'PurchaseRequest', FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/Payment/GetAutoGenerateNo", EditDataId, function (response) {
            Common.AutoGenerateNumberGet(response, "PurchaseRequestNumber", "PurchaseRequestNo");
        });
    }
});


function StatusSuccess(response) {
    var id = "PurchaseRequestStatusId";
    Common.bindDropDownSuccess(response.data, id);
    if (!EditPurchaseRequest) {

        $('#PurchaseRequestStatusId').val(1).trigger('change');
    }
}
$(document).on('click', '#PurchaseRequestCancelBtn,#PurchaseRequestClose', function () {
    $('#PurchaseRequestModal').hide();
    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, PurchaseRequestId: null, FranchiseId: FranchiseMappingId };


    Common.ajaxCall("GET", "/PurchaseRequest/GetPurchaseRequest", EditDataId, PurchaseRequestSuccessSuccess, null);

    ResetDataDetails("others");
    /*Common.VendorRemoveValidation();*/
    $('#AlternativeCompanyAddress').val('').trigger('change');
});

$('#PurchaseRequestData').on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {

        var EditPurchaseRequest = $(this).data('id');
        Common.ajaxCall("GET", "/PurchaseRequest/DeletePurchaseRequestDetails", { PurchaseRequestId: EditPurchaseRequest }, function (response) {
            response = response.status ? Common.successMsg(response.message) : Common.errorMsg(response.message);

            var formattedStartDate = formatDateForSQL(StartDate);
            var formattedEndDate = formatDateForSQL(EndDate);
            var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

            var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, PurchaseRequestId: null, FranchiseId: FranchiseMappingId };
            Common.ajaxCall("GET", "/PurchaseRequest/GetPurchaseRequest", EditDataId, PurchaseRequestSuccessSuccess, null);
        }, null);
    }
});

$(document).on('click', '#PurchaseRequestSaveBtn', function () {

    SavePurchaseRequest(PurshaceOrderSuccess, PurshaceOrderError);
});
$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "PurchaseRequest",
        ModuleRefId: parseInt(moduleRefId),
        AttachmentFileName: fileText,
        AttachmentFilePath: src
    });
    $(listItem).remove();
});

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
                deleteButton.className = 'delete-button p-0';

                downloadButton.addEventListener('click', () => {
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


async function SavePurchaseRequest(successCallback, errorCallback) {

    getExistFiles();

    var RightSideHeaderFormIsValid = $("#FormRightSideHeader").validate().form();
    var ShippingFormIsValid = $("#FormShipping").validate().form();
    var VendorFormIsValid = $("#FormVendor").validate().form();
    var StatusFormIsValid = $("#FormStatus").validate().form();
    var BillFromIsValid = $("#FormBillFrom").validate().form();
    if (!RightSideHeaderFormIsValid || !ShippingFormIsValid || !VendorFormIsValid || !StatusFormIsValid || !BillFromIsValid) {
        $('#PurchaseRequestStatusId-error').insertAfter('#statusError');
        $('#Vendor-error').insertAfter('.vendorerror');
        $('#AlternativeCompanyAddress-error').insertAfter('.AlternativeCompanyError');

        $('#loader-pms').hide();
        return false;
    }

    var vendorInput = $('#Vendor').val();

    if (vendorInput == '') {
        Common.warningMsg('Click + Add Vendor and Fill the Input');
        $('#loader-pms').hide();

        return false;
    }

    var TableLenthDynamicRow = $('.ProductTableRow').length;
    if (TableLenthDynamicRow == 0) {
        Common.warningMsg('Choose Product One Asset');
        $('#loader-pms').hide();

        return false;
    }
    let selectedStatusName = $('#PurchaseRequestStatusId option:selected').text().trim();

    let message = "";
    if (selectedStatusName === "Cancelled") {
        message = "Confirm cancellation of this Purchase Request?";
    }
    else if (selectedStatusName === "Rejected") {
        message = "Confirm rejection of this Purchase Request?";
    }
    else if (selectedStatusName === "Sent") {
        message = "Are you sure you want to send this Purchase Request?";
    }

    if (message) {
        const response = await Common.askConfirmationforCancel(message);

        if (!response) {
            $('#loader-pms').hide();
            return false;
        }
    }

    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var PurchaseRequestDetailsStatic = {};
    var vendorId = $('#Vendor').val();
    var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();
     
    var PreqStatusId = $('#PurchaseRequestStatusId option:selected').text();
    PreqStatusId = (PreqStatusId == '-- Select --') ? null : $('#PurchaseRequestStatusId').val();
     
    PurchaseRequestDetailsStatic = {
        PurchaseRequestId: EditPurchaseRequest > 0 ? EditPurchaseRequest : null,
        PurchaseRequestNo: $('#PurchaseRequestNumber').val(),
        VendorId: parseInt(vendorId),
        ShipToFranchiseId: parseInt(alternativeCompanyAddress),
        TopFranchiseId: parseInt(FranchiseMappingId),
        BillFromFranchiseId: parseInt($('#BillFrom').val()),
        PurchaseRequestDate: $('#PurchaseRequestDate').val(),
        TermsAndCondition: $('#TermsAndCondition').val() || null,
        Notes: $('#AddNotesText').val() || null,
        PurchaseRequestStatusId: parseInt(PreqStatusId), 
    };

    var PurchaseRequestProductMappingDetails = [];
    $('#PurchaseRequestProductTablebody .ProductTableRow').each(function () {
        var $rowTable = $(this); 
        var productData = $rowTable.data('product-id'); 

        var productDetail = {
            PurchaseRequestProductMappingId: null,
            ProductId: parseInt(productData),
            UnitId: Common.parseFloatValue($rowTable.find('.QtyUnitDropDown').val() || 0),
            Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val() || 0),
            ProductDescription: $rowTable.find('.descriptiontdtext').val(),
            PurchaseRequestId: EditPurchaseRequest > 0 ? EditPurchaseRequest : null
        };
        PurchaseRequestProductMappingDetails.push(productDetail);
    });

    formDataMultiple.append("PurchaseRequestDetailsStatic", JSON.stringify(PurchaseRequestDetailsStatic));
    formDataMultiple.append("PurchaseRequestProductMappingDetails", JSON.stringify(PurchaseRequestProductMappingDetails));
    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    $.ajax({
        type: "POST",
        url: "/PurchaseRequest/InsertUpdatePurchaseRequest",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: successCallback,
        error: errorCallback 
    }); 
}

function PurshaceOrderSuccess(response) {
    let data;
    try {
        data = JSON.parse(response.data);
    } catch (e) {
        Common.errorMsg("Error parsing response data:", e);
        data = null;
    }

    $('#loader-pms').hide();
    Common.successMsg(response.message);

    if (!data || !data[0] || !data[0][0]) {
        Common.errorMsg("No data from save, skipping mail.");
        return;
    }

    //let pRInfo = data[0][0];
    //let mailInfo = (data[2] && data[2][0]) ? data[2][0] : null;
    //let TomailInfo = (data[1] && data[1][0]) ? data[1][0] : null;

    //EditPurchaseRequest = pRInfo.PurchaseRequestId > 0 ? pRInfo.PurchaseRequestId : 0;
    //if (TomailInfo.ToMail && mailInfo.IsNotify == 1 && mailInfo.IsMail == 1) {
    //    let templateHtml = mailInfo.TemplateContent || "";

    //    let baseUrl = `${window.location.protocol}//${window.location.host}`;
    //    let acceptUrl = `${baseUrl}/Common/VendorResponse?status=Accepted&Module=PurchaseRequest&requestId=${EditPurchaseRequest}`;
    //    let cancelUrl = `${baseUrl}/Common/VendorResponse?status=Cancelled&Module=PurchaseRequest&requestId=${EditPurchaseRequest}`;

    //    templateHtml = templateHtml.replace(/{{ToName}}/g, TomailInfo.ToName || "");
    //    templateHtml = templateHtml.replace(/{{PRNumber}}/g, mailInfo.PRNumber || "");
    //    templateHtml = templateHtml.replace(/{{RequestDate}}/g, mailInfo.RequestDate || "");
    //    templateHtml = templateHtml.replace(/{{DeliveryAddress}}/g, mailInfo.DeliveryAddress || "");
    //    templateHtml = templateHtml.replace(/{{YourFullName}}/g, mailInfo.YourFullName || "");
    //    templateHtml = templateHtml.replace(/{{CompanyName}}/g, mailInfo.CompanyName || "");
    //    templateHtml = templateHtml.replace(/{{AcceptUrl}}/g, acceptUrl || "#");
    //    templateHtml = templateHtml.replace(/{{CancelUrl}}/g, cancelUrl || "#");

    //    if (mailInfo.IsVendor == 0) {
    //        templateHtml = templateHtml.replace(
    //            /<div style="text-align: center; margin: 30px 0;">[\s\S]*?<\/div>/,
    //            ''
    //        );
    //    }
         
    //    if (mailInfo.IsVendor == 1) {
           
    //        Common.ajaxCall("GET", "/PurchaseRequest/PurchaseRequestPrint", {
    //            ModuleId: EditPurchaseRequest,
    //            NoOfCopies: 1,
    //            printType: "Mail"
    //        }, function (printResponse) {
    //            if (printResponse.success) {
    //                const base64String = printResponse.fileContent;
    //                Inventory.sendAutoMail(
    //                    mailInfo.FromMail,
    //                    mailInfo.MailPassword,
    //                    TomailInfo.ToMail,
    //                    mailInfo.Subject,
    //                    templateHtml,
    //                    base64String,
    //                    "Purchase Request",
    //                    mailInfo.EmailCategory
    //                );
    //            } else {
    //                Common.errorMsg('Error generating PDF for mail.');
    //            }
    //        }, null);
    //    } else {
           
    //        Inventory.sendAutoMail(
    //            mailInfo.FromMail,
    //            mailInfo.MailPassword,
    //            TomailInfo.ToMail,
    //            mailInfo.Subject,
    //            templateHtml,
    //            null,
    //            "Purchase Request",
    //            mailInfo.EmailCategory
    //        );
    //    }
    //}


    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, PurchaseRequestId: null, FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/PurchaseRequest/GetPurchaseRequest", EditDataId, PurchaseRequestSuccessSuccess, null);
    $('#PurchaseRequestModal').hide();

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    ResetDataDetails("others");
}
 
function PurshaceOrderError(response) {
    let message = 'An error occurred.';
    if (response && response.message) {
        message = response.message;
    }
    $('#loader-pms').hide();
    Common.errorMsg(message);
}
function PODeleteReload(response) {
    if (response.status) {
        Common.successMsg(response.message);

        var formattedStartDate = formatDateForSQL(StartDate);
        var formattedEndDate = formatDateForSQL(EndDate);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

        var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, PurchaseRequestId: null, FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/PurchaseRequest/GetPurchaseRequest", EditDataId, PurchaseRequestSuccessSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}
function getExistFiles() {

    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "PurchaseRequest",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

/* ====================================== NOT NULL GET ================================================= */


$('#PurchaseRequestData').on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    EditPurchaseRequest = $(this).data('id');

    const EditDataId = { ModuleName: "PurchaseRequest", ModuleId: EditPurchaseRequest };

    // Fetch dropdown first
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, function (response) {
        StatusSuccess(response); // don’t set val(1) inside this
        // Then call edit logic
        editPurchaseRequest(EditPurchaseRequest);
    }, null);
});

function editPurchaseRequest(EditPurchaseRequest) {
    VendorAlignmentOpen();

    $("#PurchaseRequestSaveBtn span:first").text("Update");
    $('.page-inner-footer, .Status-Div').show(); 
    $('#BillFromAddress').val('');

    const FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    const EditDataId = { PurchaseRequestId: EditPurchaseRequest, FranchiseId: FranchiseMappingId };

    Common.ajaxCall("GET", "/Common/ActivityHistoryDetails", { ModuleName: "PurchaseRequest", ModuleId: EditPurchaseRequest }, Inventory.StatusActivity, null);
    Common.ajaxCall("GET", "/PurchaseRequest/NotNullGetPurchaseRequest", EditDataId, PurchaseRequestGetNotNull, null);
}
async function PurchaseRequestGetNotNull(response) {
    disableChangeEvent = true;
    formDataMultiple = new FormData();
    $("#ModalHeading").text("Purchase Request Info");


    if (!response.status) {
        $('#loader-pms').hide();
        return;
    }

    try {
        const [productData, orderDataArr, attachmentData] = JSON.parse(response.data);
        const orderData = orderDataArr[0];

        AutoGenerateFlag = true;

        let currentStatusId = parseInt(orderData.PurchaseRequestStatusId);

        let $options = $('#PurchaseRequestStatusId option');
        let currentIndex = $options.index($('#PurchaseRequestStatusId option[value="' + currentStatusId + '"]'));

        $options.each(function (index) {
            let statusName = $(this).text().trim();

            if (index === currentIndex || index === currentIndex + 1 || statusName === "Cancelled" || statusName === "Rejected") {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        $('#PurchaseRequestStatusId').val(currentStatusId).trigger('change');
         
        $('#PurchaseRequestDate').val(extractDate(orderData.PurchaseRequestDate));
        $('#PurchaseRequestNumber').val(orderData.PurchaseRequestNo);
         
        if (orderData.BillFromFranchiseId != "") {
            var ModuleName = "FranchiseFrom";
            const url = `/Common/BillFromDetails_BillFromId?ModuleId=${parseInt(orderData.BillFromFranchiseId)}&ModuleName=${encodeURIComponent(ModuleName)}`;
            const responseData = await Common.getAsycData(url);
            if (responseData !== null) {
                $('#BillFrom').val(orderData.BillFromFranchiseId);
                Inventory.BillFromAddressDetails(responseData);
            }
        }

        $('#AlternativeCompanyAddress').val(orderData.ShipToFranchiseId).trigger('change');
        $('#Vendor').val(orderData.VendorId).trigger('change');

        await bindAddressDropdown(orderData.BillFromFranchiseId, orderData.ShipToFranchiseId, orderData.VendorId);

        Common.ajaxCall("GET", "/Common/BillFromDetails_BillFromId", { ModuleId: orderData.ShipToFranchiseId, ModuleName: "ShipTo" }, function (response) {
            if (response.status) {
                const data = JSON.parse(response.data)[0][0];

                $("#ShippingColumn #StoreAddress").text(data.FranchiseAddress || '');
                $("#ShippingColumn #StoreCity").text(data.BranchCity || '');
                $("#ShippingColumn #StateName").text(data.BranchState || '');
                $("#ShippingColumn #StoreContactNumber").text(data.FranchiseContactNo || '');
                $("#ShippingColumn #StateId").text(data.BranchState);
            }
        });

        Common.bindData(productData);
        Inventory.toggleField(orderData.Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable");
        Inventory.toggleField(orderData.TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
        Inventory.toggleFieldForAttachment(attachmentData[0].AttachmentId, "#AddAttachLable", "#AddAttachment");

        $("#ViewBankLable").hide();

        await Inventory.bindSaleProducts(
            productData,
            $('#PurchaseRequestProductTablebody'),
            $('#PurchaseRequestProductTable'),
            null,
            orderData.CurrencyType,
            IsCommaFormat, null, null
        );

        $('.input-group').css('width', 'unset');
        $('#selectedFiles,#ExistselectedFiles').empty();
        existFiles = [];
        Inventory.bindAttachments(attachmentData);


        //handlePurchaseRequestApprovedStatus();
        disableChangeEvent = false;
        AutoGenerateFlag = false;
        $('#PurchaseRequestModal').show();
        $("#PurchaseRequestModal .modal-body").animate({ scrollTop: 0 }, "fast");
        $('#loader-pms').hide();

    } catch (error) {
        console.error("Error in PurchaseRequestGetNotNull:", error);
        $('#loader-pms').hide();
    }
}


async function bindAddressDropdown(BillFromFranchiseId, ShipToFranchiseId, VendorId) {
    const getAddress = (id, moduleName) => {
        return new Promise((resolve) => {
            Common.ajaxCall("GET", "/Common/BillFromDetails_BillFromId", {
                ModuleId: id,
                ModuleName: moduleName
            }, function (response) {
                resolve(response);
            });
        });
    };

    const [billFromRes, shipToRes, vendorRes] = await Promise.all([
        getAddress(BillFromFranchiseId, "BillFrom"),
        getAddress(ShipToFranchiseId, "ShipTo"),
        getAddress(VendorId, "BillTo")
    ]);

    if (billFromRes?.status) {

        var data = JSON.parse(billFromRes.data);

        $("#BillFromName").text(data[0][0].BillFromAddress || '');
    }

    if (shipToRes?.status) {
        const data = JSON.parse(shipToRes.data)[0][0];
        $("#ShippingColumn #StoreAddress").text(data.BranchAddress || '');
        $("#ShippingColumn #StoreCity").text(data.BranchCity || '');
        $("#ShippingColumn #StateName").text(data.BranchState || '');
        $("#ShippingColumn #StoreContactNumber").text(data.BranchContactNo || '');
        $("#ShippingColumn #StateId").text(data.BranchState);
    }

    if (vendorRes?.status) {
        if (vendorRes) {
            var data = JSON.parse(vendorRes.data);
            $("#VendorColumn #VendorName").text(data[0][0].VendorName || '');
            $("#VendorColumn #VendorAddress").text(data[0][0].Address || '');
            $("#VendorColumn #VendorCountry").text(data[0][0].Country || '');
            $("#VendorColumn #VendorStateName").text(data[0][0].State || '');
            $("#VendorColumn #VendorEmail").text(data[0][0].Email || '');
            $("#VendorColumn #VendorContactNumber").text(data[0][0].ContactNumber || '');
            $("#VendorColumn #VendorGSTNumber").text(data[0][0].GSTNumber || '');
            $("#VendorColumn #StateIdGet").text(data[0][0].StateId);
            $("#VendorColumn #VendorCity").text(data[0][0].BranchCity || '');
        }
    }
}

function extractDate(inputDate) {
    if (typeof inputDate !== 'string' || !inputDate.includes('T')) return "";
    return inputDate.split('T')[0];
}

/* ================= ===================== Common Function ================== ============ ========== */
$(document).on('click', '#AddNotesLable', function () {
    $('#AddNotes').show();
    $('#AddNotesLable').hide();
    $('#HideNotesLable').show();
});
$(document).on('click', '#HideNotesLable', function () {
    $('#AddNotes').hide();
    $('#AddNotesLable').show();
    $('#HideNotesLable').hide();

});
$(document).on('click', '#AddTermsLable', function () {
    $('#AddTerms').show();
    $('#AddTermsLable').hide();
    $('#HideTermsLable').show();
});
$(document).on('click', '#HideTermsLable', function () {
    $('#AddTerms').hide();
    $('#AddTermsLable').show();
    $('#HideTermsLable').hide();
});
$(document).on('click', '#AddAttachLable', function () {
    $('#AddAttachment').show();
    $('#AddAttachLable').hide();
    $('#HideAttachlable').show();
});
$(document).on('click', '#HideAttachlable', function () {
    $('#AddAttachment').hide();
    $('#AddAttachLable').show();
    $('#HideAttachlable').hide();
});
function VendorAlignmentOpen() {
    $('#AddVendorlableColumn').hide();
    $('#BillFromColumn').show();
    $('#VendorColumn').show();
    $('#ShippingColumn').show();
    $('#AddVendorlableColumn').removeClass('d-flex justify-content-center');

    $('#PurchaseRequestNumberDiv').addClass('col-lg-12 col-md-6 col-6').removeClass('col-lg-6 col-md-6 col-6');
    $('#PurchaseRequestDateDiv').addClass('col-lg-12 col-md-6 col-6').removeClass('col-lg-6 col-md-6 col-6'); 
    $('#ExpectedDeliveryDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#PRequestColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-12').addClass('col-lg-4 col-md-12 col-sm-12 col-12');
    $("#ShipToLocation").prop('disabled', false);
}

function handlePurchaseRequestApprovedStatus() {
    var selectedText = $('#PurchaseRequestStatusId option:selected').text().trim();
    if (selectedText === "Draft") {
        enableAllFields();
    } else if (selectedText === "Approved") {
        if (isEmployee === 4 || isEmployee === 3) {

            disableAllFields();
        } else {

            enableAllFields();
        }
    } else if (selectedText === "Sent" || selectedText === "Cancelled" || selectedText === "Move To PO" || selectedText === "Accepted" || selectedText === "Authorized" || selectedText === "Rejected") {
        disableAllFields();
    }

}

function disableAllFields() {
    $('#FormBillFrom select, #FormVendor select, #FormShipping select').prop('disabled', true);
    $('#FormRightSideHeader input, #FormRightSideHeader select').prop('disabled', true);
    $('#AssetSection input, #AssetSection select, #AssetSection textarea').prop('disabled', true);
    $('#AddNotesText, #TermsAndCondition').prop('disabled', true);
    $('.DynrowRemove').prop('disabled', true);
    $('#AddItemButtonRow').hide();
    $('#PurchaseRequestNumber').prop('disabled', true);
    $('#fileInput').prop('disabled', true);
    $('#selectedFiles #deletefile, #ExistselectedFiles #deletefile')
        .prop('disabled', true)
        .css({ 'pointer-events': 'none', 'opacity': '0.5' });
    $('label[for="fileInput"], label:has(#fileInput)').css({
        'pointer-events': 'none',
        'opacity': '0.6',
        'cursor': 'not-allowed'
    }); 
}

function enableAllFields() {
    $('#FormBillFrom select, #FormVendor select, #FormShipping select').prop('disabled', false);
    $('#FormRightSideHeader input, #FormRightSideHeader select').prop('disabled', false);
    $('#AssetSection input, #AssetSection select, #AssetSection textarea').prop('disabled', false);
    $('#AddNotesText, #TermsAndCondition').prop('disabled', false);
    $('.DynrowRemove').prop('disabled', false);
    $('#AddItemButtonRow').show();
    $('#PurchaseRequestNumber').prop('disabled', true);
    $('#fileInput').prop('disabled', false);
    $('#selectedFiles #deletefile, #ExistselectedFiles #deletefile')
        .prop('disabled', false)
        .css({ 'pointer-events': '', 'opacity': '' });
    $('label[for="fileInput"], label:has(#fileInput)').css({
        'pointer-events': '',
        'opacity': '',
        'cursor': ''
    });
    //var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    //if (FranchiseMappingId != 0) {
    //    $('#AlternativeCompanyAddress').prop('disabled', true);
    //} else {
    //    $('#AlternativeCompanyAddress').prop('disabled', false);
    //}
}
 
function VendorAlignmentClose() {

    $('#AddVendorlableColumn').show();
    $('#BillFromColumn').hide();
    $('#VendorColumn').hide();
    $('#ShippingColumn').hide();

    $('#PurchaseRequestNumberDiv').addClass('col-lg-6 col-md-6 col-6').removeClass('col-lg-12 col-md-6 col-6');
    $('#PurchaseRequestDateDiv').addClass('col-lg-6 col-md-6 col-6').removeClass('col-lg-12 col-md-6 col-6');
    $('#PRequestColumn').addClass('col-lg-6 col-md-6 col-sm-6 col-12').removeClass('col-lg-4 col-md-12 col-sm-12 col-12'); 
    $("#VendorColumn #VendorName").text('');
    $("#VendorColumn #VendorAddress").text('');
    $("#VendorColumn #VendorCountry").text('');
    $("#VendorColumn #VendorStateName").text('');
    $("#VendorColumn #VendorEmail").text('');
    $("#VendorColumn #VendorContactNumber").text('');
    $("#VendorColumn #VendorGSTNumber").text('');
    $("#VendorColumn #StateIdGet").text('');
    $("#VendorColumn #VendorCity").text('');
}


function resetCommonData() {

    selectedProductIdsList = [];

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    $('#PurchaseRequestProductTable .ProductTableRow').remove();
    /*$('#PurchaseRequestStatusId').val('').trigger('change');*/
}
function ResetDataDetails(type) {
    resetCommonData(); 
    if (type !== 'Vendor') {
        $('#Vendor, #ShipType').val('').trigger('change');
        $('#AddNotes, #AddTerms, #AddAttachment').hide();
        $('#AddNotesLable, #AddTermsLable, #AddAttachLable').show();
        $('#AddNotesText, #TermsAndCondition').val(''); 
    } else {

    }
}
 
/* ====================================== Mail  ================================================= */
$(document).on('click', '#closeMail', function () {
    $("#SendMail").modal('hide');

    editPurchaseRequest(EditPurchaseRequest);
});
$(document).on('click', '#PurchaseRequestMailBtn', function () {
    $('#loader-pms').show();
    $("#AttachmentArea").html('');
    $('#ShareDropdownitems').css('display', 'none');

    SavePurchaseRequest(MailAttachmentPurchaseRequestSuccessSuccess);
});
function MailAttachmentPurchaseRequestSuccessSuccess(response) {
    formDataMultiple = new FormData();
    existFiles = [];

    try {

        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }


    if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseRequestId !== 'undefined') {
        EditPurchaseRequest = data[0][0].PurchaseRequestId > 0 ? data[0][0].PurchaseRequestId : 0;

    } else {

        EditPurchaseRequest = 0;

    }

    var moduleId = EditPurchaseRequest;
    if (moduleId > 0) {
        var EditDataId = { ModuleName: 'PurchaseRequest', ModuleId: moduleId };
        Common.ajaxCall("GET", "/Common/GetEmailToAddressDetails", EditDataId, GetEmailToAddress, null);
    } else {
        $('#loader-pms').hide();
    }
}
function GetEmailToAddress(response) {
    if (response.status) {

        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'EmailDetails');
        var poNumber = $('#PurchaseRequestNumber').val();
        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);
        $("#VendorEmail").val(data[0][0].VendorEmail);
        $("#EmailDetails #Subject").val('IGS-Purchase Request-' + poNumber);


        var companyName = data[0][0].CompanyName;
        var vendorName = $('#Vendor option:selected').text();

        var orderDate = $('#PurchaseRequestDate').val();
        if (orderDate) {
            var dateParts = orderDate.split("-");
            orderDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }
        var deliveryAddress = data[0][0].FullAddress;
        var yourFullName = data[0][0].Fullname;
        var yourPosition = data[0][0].UserGroupName;
        //var baseUrl = '@ViewBag.BaseUrl';

        let baseUrl = `${window.location.protocol}//${window.location.host}`;
        let acceptUrl = `${baseUrl}/Common/VendorResponse?status=Accepted&Module=PurchaseRequest&requestId=${EditPurchaseRequest}`;
        let cancelUrl = `${baseUrl}/Common/VendorResponse?status=Cancelled&Module=PurchaseRequest&requestId=${EditPurchaseRequest}`;

        var emailBody = `

<div style="max-width: 700px; margin: auto; font-family: Arial, sans-serif; background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 20px; color: #333;">
    <p style="font-size: 16px; color: #007BFF;">
        Dear <strong>${vendorName}</strong>,
    </p>

    <p>
        We are pleased to share the details of our purchase request. Please review the attached document and confirm receipt at your earliest convenience.
    </p>

    <div style="background: #fff; padding: 15px 20px; border-radius: 8px; border: 1px solid #ccc; margin: 20px 0;">
        <h3 style="color: #444; margin-bottom: 10px;">Purchase Request Details</h3>
        <p><strong>Request Number:</strong> ${poNumber}</p>
        <p><strong>Request Date:</strong> ${orderDate}</p>
        <p><strong>Delivery Address:</strong><br>${deliveryAddress}</p>
    </div>

    <p>
        If you require any additional information or clarification, please feel free to reach out.
    </p>
    
    <p style="margin-top: 30px;">
        Best regards,<br><br>
        <strong>${yourFullName}</strong><br>
        ${companyName}<br>
        <span style="font-size: 12px; color: #888;">This is a system-generated message. Please do not reply directly to this email.</span>
    </p>
    <div style="text-align: center; margin: 30px 0;">
    <a href="${acceptUrl}" 
   style="padding: 10px 20px; background: #28a745; color: #fff; text-decoration: none; border-radius: 5px; margin-right: 10px;">
    Accept
</a>

<a href="${cancelUrl}" 
   style="padding: 10px 20px; background: #dc3545; color: #fff; text-decoration: none; border-radius: 5px;">
    Cancel
</a>

</div>
</div>

`;

        $("#EmailDetails .note-editable").html(emailBody);

        printType = "Mail";

        const EditDataId = {
            ModuleId: EditPurchaseRequest,
            NoOfCopies: 1,
            printType: printType,

        };

        Common.ajaxCall("GET", "/PurchaseRequest/PurchaseRequestPrint", EditDataId, function (response) {
            Inventory.AttachmentPdfSuccess(response, "Purchase Request.PDF");
        }, null);
    }
}
$(document).on('click', '#SendButton', function () {

    $('#SendButton').prop('disabled', true).html(`
        <span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span> Sending...
    `);
    $('#loader-pms').show();

    Inventory.EmailSendbutton("Purchase Request")
        .then(function () {
        })
        .catch(function () {
            $('#SendButton').prop('disabled', false).html(`<i class="fa fa-envelope"></i> Send`);
            $('#loader-pms').hide();
        });
});

/*============================================PREVIEW & DOWNLOAD & PRINT =============================================================*/

$(document).on('click', '#downloadLink', function () {

    printType = this.id === 'btnPreview' ? 'Preview' :
        this.id === 'btnPordersaveprintbtn' ? 'Print' : 'Download';

    $('#loader-pms').show();
    SavePurchaseRequest(GetPreviewAndDownloadAddress, ErrorPDF);
});
function ErrorPDF(response) {
    $('#loader-pms').hide();
}

function GetPreviewAndDownloadAddress(response) {
    return new Promise((resolve, reject) => {
        $('#loader-pms').show();

        try {
            const data = JSON.parse(response.data);
            const purchaseRequestData = data[0] && data[0][0];
            if (!purchaseRequestData || !purchaseRequestData.PurchaseRequestId) {
                $('#loader-pms').hide();
                Common.errorMsg("Invalid response data. PurchaseRequestId not found.");
                return reject("Invalid response data");
            }

            formDataMultiple = new FormData();
            existFiles = [];

            const EditPurchaseRequest = purchaseRequestData.PurchaseRequestId;


            const EditDataId = {
                ModuleId: EditPurchaseRequest,
                NoOfCopies: 1,
                printType: printType
            };

            $.ajax({
                url: '/PurchaseRequest/PurchaseRequestPrint',
                method: 'GET',
                data: EditDataId,
                xhrFields: { responseType: 'blob' },

                success: function (blobResponse) {
                    $('#loader-pms').hide();
                    $('#ShareDropdownitems').hide();

                    if (!blobResponse || blobResponse.size === 0) {
                        Common.errorMsg("Empty PDF file returned.");
                        return reject("Empty blob received");
                    }

                    const blob = new Blob([blobResponse], { type: 'application/pdf' });
                    const blobUrl = URL.createObjectURL(blob);

                    switch (printType.toLowerCase()) {
                        case "preview":
                            const newTab = window.open();
                            if (newTab) {
                                newTab.document.write(`
                                    <html>
                                    <head><title>Purchase Order Preview</title></head>
                                    <body style="margin:0;">
                                        <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%" />
                                    </body>
                                    </html>
                                `);
                                newTab.document.close();
                            } else {
                                Common.errorMsg("Popup blocked. Please allow popups.");
                                reject("Popup blocked");
                            }
                            break;

                        case "download":
                            const link = document.createElement('a');
                            link.href = blobUrl;
                            link.download = 'Purchase_Request.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            break;

                        case "print":
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            iframe.src = blobUrl;
                            document.body.appendChild(iframe);
                            iframe.onload = function () {
                                iframe.contentWindow.focus();
                                iframe.contentWindow.print();
                            };
                            break;

                        default:
                            Common.errorMsg("Unknown print type.");
                            reject("Invalid print type");
                            return;
                    }

                    resolve();
                },

                error: function (xhr, status, err) {
                    $('#loader-pms').hide();

                    const reader = new FileReader();
                    reader.onload = function () {
                        try {
                            const json = JSON.parse(reader.result);
                            const errorMessage = json.message || json.error || "Unexpected error occurred.";
                            Common.errorMsg(errorMessage);
                            reject(errorMessage);
                        } catch (e) {
                            Common.errorMsg("Unable to parse server error.");
                            reject("Unable to parse server error.");
                        }
                    };

                    if (xhr.response) {
                        reader.readAsText(xhr.response);
                    } else {
                        Common.errorMsg("Server not responding properly.");
                        reject("Server not responding properly.");
                    }
                }

            });
        } catch (ex) {
            $('#loader-pms').hide();
            Common.errorMsg(ex);
            reject(ex);
        }
    });
}




//================================================================================WhatsApp Sending===========================================================================
$(document).on('click', '#PurchaseRequestWhatsAppBtn', function () {
    SavePurchaseRequest(GetWhatsAppDetails);
});

function GetWhatsAppDetails(response) {
    $('#loader-pms').show();

    if (response.status) {
        var data = JSON.parse(response.data);

        if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseRequestId !== 'undefined') {
            var purchaseRequestId = data[0][0].PurchaseRequestId;
        } else {
            $('#loader-pms').hide();
            Common.errorMsg("Invalid Purchase Request data.");
            return;
        }

        const requestData = {
            ModuleId: purchaseRequestId,
            NoOfCopies: 1,
            printType: "whatsapp"
        };

        $.ajax({
            url: '/PurchaseRequest/PurchaseRequestPrint',
            method: 'GET',
            data: requestData,
            success: function (res) {
                if (res.status && res.data) {
                    const pdfPath = res.data;


                    const contactId = $('#Vendor').val();

                    if (!contactId) {
                        $('#loader-pms').hide();
                        Common.errorMsg("Vendor/Contact ID is missing.");
                        return;
                    }

                    Common.ajaxCall(
                        "GET",
                        "/whatsapp/GetInventoryWhatsappDetails",
                        {
                            ModuleName: "PurchaseRequest",
                            ModuleId: purchaseRequestId,
                            FilePath: pdfPath,
                            ContactId: contactId
                        },
                        DataWhatsAppDetails,
                        null
                    );
                } else {
                    $('#loader-pms').hide();
                    Common.errorMsg("PDF generation failed.");
                }
            },
            error: function () {
                $('#loader-pms').hide();
                Common.errorMsg("Error occurred while generating PDF.");
            }
        });
    } else {
        $('#loader-pms').hide();
        Common.errorMsg("Failed to save Purchase Request.");
    }
}

function DataWhatsAppDetails(response) {
    $('#loader-pms').hide();

    if (response.status) {
        $("#ShareDropdownitems").hide();
        setTimeout(function () {
            Common.successMsg("The message was successfully sent on WhatsApp.");
        }, 500);
    } else {
        Common.errorMsg("The message failed to send on WhatsApp.");
    }
}


//=============================================SHORTCUTS==============================================

$(document).keydown(function (event) {

    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#PurchaseRequestSaveBtn').click();
    }

    // Handling alt + h
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        $('#btnsharePurchaseRequest').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#PurchaseRequestCancelBtn').click();
    }

});

/*========================================================================================================*/
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let displayedDate = new Date(currentYear, currentMonth);
updateMonthDisplay(displayedDate);
$('#increment-month-btn2').hide();

$(document).off('click', '#decrement-month-btn2').on('click', '#decrement-month-btn2', function () {
    displayedDate.setMonth(displayedDate.getMonth() - 1);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').show();
    updateStartAndEndDates(displayedDate);
});

$(document).off('click', '#increment-month-btn2').on('click', '#increment-month-btn2', function () {
    displayedDate.setMonth(displayedDate.getMonth() + 1);
    updateMonthDisplay(displayedDate);
    if (displayedDate.getFullYear() > currentYear ||
        (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() >= currentMonth)) {
        $('#increment-month-btn2').hide();
    }
    updateStartAndEndDates(displayedDate);
});

function updateMonthDisplay(date) {
    let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();
    $('#dateDisplay2').text(month + " " + year);
    if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
        $('#increment-month-btn2').hide();
    }
    updateStartAndEndDates(date);
}
function formatDateForSQL(date) {
    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, '0') + "-" +
        String(date.getDate()).padStart(2, '0');
}
function updateStartAndEndDates(date) {
    if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
        StartDate = new Date(currentYear, currentMonth, 1);
        EndDate = new Date();

    } else {
        StartDate = new Date(date.getFullYear(), date.getMonth(), 1);
        EndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, PurchaseRequestId: null, FranchiseId: FranchiseMappingId };

    Common.ajaxCall("GET", "/PurchaseRequest/GetPurchaseRequest", EditDataId, PurchaseRequestSuccessSuccess, null);
}
$(document).on("change", "#FromDate, #ToDate", function () {

    let StartDate = $("#FromDate").val();
    let EndDate = $("#ToDate").val();

    if (EndDate) {
        $("#FromDate").attr("max", EndDate);
    }

    if (StartDate) {
        $("#ToDate").attr("min", StartDate);
    }

    if (StartDate && EndDate && StartDate > EndDate) {
        alert("From Date cannot be after To Date!");
        $("#FromDate").val("");
    }

    if (StartDate && EndDate) {
        let formattedStartDate = formatDateForSQL(new Date(StartDate));
        let formattedEndDate = formatDateForSQL(new Date(EndDate));
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

        var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, PurchaseRequestId: null, FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/PurchaseRequest/GetPurchaseRequest", EditDataId, PurchaseRequestSuccessSuccess, null);
    }
});

/*======================================================================================*/

