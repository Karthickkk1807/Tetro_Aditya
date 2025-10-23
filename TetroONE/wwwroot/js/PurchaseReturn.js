var selectedProductQuantity = [];
var selectedProductIdsList = [];
var selectedProductUnitId = [];
var MOPDropdown = [];
let selectedMOPs = new Set();
var formDataMultiple = new FormData();
var deletedFiles = [];
var existFiles = [];
var EditPurchaseReturnId = 0;
var disableChangeEvent = false;
var AutoGenerateFlag = false;
var printType = "";
var PDFformat = "";
var StartDate;
var EndDate;
var FranchiseMappingId = 0;

$(document).ready(function () {

    $('#loader-pms').show();
    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    Inventory.EmailValidationOnInputVendor();
    $('#SpinnerWhatsApp').hide();
    $('.PartiallyPaidHide').hide();
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

    //Common.VendorhandleDropDown();
    //Common.VendorRquiredMassage();
    //Common.handleDropdownError('#PurchaseReturnStatus');

    /* -------------------- Validation For Inputs --------------------------- */

    initializePage(FranchiseMappingId);

    Common.bindDropDown('Vendor', 'Vendor');
    Common.bindDropDown('StateIdOFfCanvas', 'State');
    Common.bindDropDown('AlternativeCompanyAddress', 'UserFranchiseMapping');


    Common.bindDropDown('ReturnReasonId', 'ReturnReason');
    Common.bindDropDown('ReturnMethodId', 'ReturnType');

    Common.bindDropDown('BillFrom', 'BillFrom');
    
    

    $('#ShipToLocation').prop('disabled', true);
    $('#ShipToLocation').empty().append('<option value="">-- Select --</option>');
    $('.ShippingAddressIcon').hide();

    $("#addPartialPayment").prop('disabled', false);

    $('#Vendor,#PurchaseOrderStatusId,#AlternativeCompanyAddress').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });

    $('#ShipToLocation').prop('disabled', true);
    $('#PInvoiceNo').empty().append('<option value="">-- Select --</option>');
    $('.ShippingAddressIcon').hide();

    $("#addPartialPayment").prop('disabled', false);
    $("#AlternativeCompanyAddress").prop('disabled', false);

    $('#Vendor,#AlternativeCompanyAddress').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });
});


$('#BillFrom').on('change', async function () {
    var ModuleId = $(this).val();
    if (ModuleId) {
        var responseData1 = await Common.getAsycData("/Common/BillFromDetails_BillFromId?ModuleId=" + parseInt(ModuleId));
        if (responseData1 !== null) {
            Inventory.BillFromAddressDetails(responseData1);
        }
    } else {
        $('#BillFromAddress').text('');
    }
});
$(document).on('change', '#Vendor', function () {
    var value = $(this).val();
    if (value != "") {
        $('.overraphide').find('.error').remove();
    }
});

$(document).on('change', '#PurchaseReturnStatus', function () {

    var value = $(this).val();
    if (value != "") {
        $('.statusError').find('.error').remove();
    }
});

async function initializePage(FranchiseMappingId) {
    $('.page-inner-footer').hide();
    var today = new Date().toISOString().split('T')[0];
    $("#InvoiceDate").val(today);
    //$("#InvoiceDate").attr("max", today);

    $('#AddAttachment').hide();

    let MOPDropdownVal = await Common.bindDropDownSync('ModeOfPayment');
    Common.bindDropDownSuccess(MOPDropdownVal, 'ModeOfPaymentId');
    MOPDropdown = JSON.parse(MOPDropdownVal);

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    var fnData = Common.getDateFilter('dateDisplay2');

    $('#AddAttachment').hide();

    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/PurchaseReturn/GetPurchaseReturn", EditDataId, PurchaseREturnSuccess, null);

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#OtherChargesDropDown').length && !target.closest('#OtherchargesAdd').length) {
            $('#OtherChargesDropDown').css('display', 'none');
        }
    });

    $(document).on('click', function (event) {
        var $target = $(event.target);
        if (!$target.closest('.dropdown-menu').length && !$target.closest('#dropdownMenuButton2').length) {
            $('.dropdown-menu').removeClass('show');
        }
    });

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#ShareDropdownitems').length && !target.closest('#btnsharePorder').length) {
            $('#ShareDropdownitems').css('display', 'none');
        }
    });

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();

        var fnData = Common.getDateFilter('dateDisplay2');
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        if ($('#ToVendorGrid').hasClass('purchaseactive')) {
            TypeId = 1;
        } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
            TypeId = 2;
        }
        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/PurchaseReturn/GetPurchaseReturn", EditDataId, PurchaseREturnSuccess, null);
    });

    $('#increment-month-btn2').click(function () {

        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/PurchaseReturn/GetPurchaseReturn", EditDataId, PurchaseREturnSuccess, null);
    });

    function updateMonthDisplay(date) {
        let monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear();
        $('#dateDisplay2').text(month + " " + year);

        let now = new Date();
        let currentMonth = now.getMonth();
        let currentYear = now.getFullYear();

        if (date.getFullYear() > currentYear || (date.getFullYear() === currentYear && date.getMonth() >= currentMonth)) {
            $('#increment-month-btn2').hide();
        } else {
            $('#increment-month-btn2').show(); // Show again if going back to previous months
        }
    }

    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
            var EditDataId = { FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), FranchiseId: FranchiseMappingId };
            Common.ajaxCall("GET", "/PurchaseReturn/GetPurchaseReturn", EditDataId, PurchaseREturnSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/PurchaseReturn/GetPurchaseReturn", EditDataId, PurchaseREturnSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });
}

function PurchaseREturnSuccess(response) {

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

        var columns = Common.bindColumn(data[1], ['PurchaseReturnId', 'Status_Color']);
        Common.bindTablePurchase('PurchaseReturnData', data[1], columns, -1, 'PurchaseReturnId', '330px', true, access);
        $('#loader-pms').hide();
    }
}

$(document).on('change', '#AlternativeCompanyAddress', function () {
    var thisVal = $(this).val();
    var parseingIntOfAlterCompAdd = parseInt(thisVal);
    Common.ajaxCall("GET", "/Contact/GetFranchise", { FranchiseId: parseingIntOfAlterCompAdd }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            $("#ShippingColumn #StoreName").text(data[0][0].FranchiseName || '');
            $("#ShippingColumn #StoreAddress").text(data[0][0].FranchiseAddress || '');
            $("#ShippingColumn #StoreCity").text(data[0][0].FranchiseCity || '');
            $("#ShippingColumn #StateName").text(data[0][0].StateName || '');
            $("#ShippingColumn #StoreContactNumber").text(data[0][0].FranchiseContactNo || '');
            //$("#ShippingColumn #VendorContactNumber").text(data[0][0].ContactNumber || '');
            //$("#ShippingColumn #VendorGSTNumber").text(data[0][0].GSTNumber || '');
            $("#ShippingColumn #StateId").text(data[0][0].FranchiseStateId);

            Inventory.updateGSTVisibility('#VendorStateName', '#StateName');
        }
    }, null);

    if (AutoGenerateFlag) {
        return false;
    }
    var ShipId = $('#ShippingColumn #AlternativeCompanyAddress').val();
    var EditDataId = { ModuleName: 'PurchaseReturn', FranchiseId: ShipId };

    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "InvoiceNo", "PurchaseReturnNo");
    });

    
});


/* ------------------------------------------- Vendor  Functionality  -----------------------------------------*/
$(document).on('change', '#VendorColumn #Vendor', async function () {

    if (disableChangeEvent) {
        return false;
    }

    var VendorId = $('#VendorColumn #Vendor').val();

    

    var responseData1 = await Common.getAsycData("/Common/VendorDetailsByVendorId?vendorId=" + parseInt(VendorId));
    if (responseData1 !== null) {
        Inventory.VendorAddressDetails(responseData1);
    } else {
        Inventory.ClearDataForVendorAddressDetails();
    }
    if (VendorId === "") {
        Inventory.VendorAddressDetails(responseData1);
        $("#AddBankDetails #AccountName").text('');
        $("#AddBankDetails #BankName").text('');
        $("#AddBankDetails #BranchName").text('');
        $("#AddBankDetails #AccountNo").text('');
        $("#AddBankDetails #AccountType").text('');
        $("#AddBankDetails #IFSCCode").text('');
        $("#AddBankDetails #UPIID").text('');
    }


    if (VendorId != null) {
        var ShipId = $('#ShippingColumn #AlternativeCompanyAddress').val();
        Common.ajaxCall("GET", "/PurchaseInvoice/GetInventoryNumberDetailsByVendorId", { moduleName: "PurchaseBill", ModuleId: null, vendorId: parseInt(VendorId), ShipToFranchiseId: parseInt(ShipId) }, function (response) {
            Common.bindParentDropDownSuccessForChosen(response.data, 'PInvoiceNo', 'POColumn');
        }, null);
    }

    if (VendorId) {
        Inventory.updateGSTVisibility('#VendorStateName', '#StateName');
    }
    ResetDataDetails("Vendor");
});
$(document).on('click', '#EditBillingAddress', function () {
    Inventory.VendorDetailsLabeltoCanvas();
});
$(document).on('click', '#BillingAddressUpdateBtn', function () {
    Inventory.VendorAddressUpdate();
});
$(document).on('click', '#CloseCanvas ,#BillingAddressCancelBtn', function () {
    Inventory.EditVendorAddressCanvasClose();
});



/* ======================================= PRODUCT TABLE ========================================== */


$(document).on('click', '#UpdateProductsInAddItem', function () {

    var AllProductTable = 'AllProductTable';
    var tablebody = $('#PReturnTablebody');
    var mainTable = $('#PRProductTable');
    var moduleName = 'Purchase';
    var stateSelector1 = "#VendorStateName";
    var stateSelector2 = "#StateName";
    $('#loader-pms').show();
    Inventory.AddProductsToMainTable(AllProductTable, tablebody, mainTable, moduleName, stateSelector1, stateSelector2);

});

$(document).on('click', '.DynremoveBtn', function () {
    const row = $(this).closest('tr');
    let productId = row.data('product-id');
    var mainTable = $('#PRProductTable');

    Inventory.RemoveProductMainRow(row, productId, mainTable);
});
$(document).on('input', '.SellingPrice', function () {

    const row = $(this).closest('tr');
    var mainTable = $('#PRProductTable');
    Inventory.calculateTaxableAmount(row);
    Inventory.calculateCGST(row);
    Inventory.calculateSGST(row);
    Inventory.calculateIGST(row);
    Inventory.calculateCESS(row);
    Inventory.calculateTotalAmount(row);
    Inventory.updateSubtotalRow(mainTable);
    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();

});
$(document).on('input', '.TableRowQty', function () {

    const finalQTY = parseInt($(this).val() || 0);
    const row = $(this).closest('tr');
    var QtyUnitDropDown = parseInt(row.find('.QtyUnitDropDown').val());
    const data = row.data('product-info');
    const productId = row.data('product-id');

    var tablebody = $('#PReturnTablebody');
    var mainTable = $('#PRProductTable');

    let existingRow = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`);
    let existingRowFirst = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`).first();

    Inventory.QuantityInputChange(finalQTY, row, QtyUnitDropDown, data, productId, tablebody, mainTable, existingRow, existingRowFirst);
});


$(document).on('change', '.QtyUnitDropDown', function () {

    let rowElement = $(this).closest('tr');
    let selectedUnit = parseInt($(this).val());
    let productData = rowElement.data('product-info');
    let tableBody = $('#PReturnTablebody');
    var mainTable = $('#PRProductTable');
    Inventory.updateSellingPriceBasedOnUnitProductRow(selectedUnit, tableBody, rowElement, productData, mainTable);
});
$(document).on('click', '#AddItemBtn', function () {
    $('#loader-pms').show();
    var VendorId = $('#VendorColumn #Vendor').val();
    var mainTable = $("PRProductTable");
    var moduleName = 'Purchase';
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
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

function calculateBalance() {

    var grantTotal = parseFloat($('#GrantTotal').val()) || 0;
    var totalMOP = 0;
    $('.MOPAmount').each(function () {
        var value = parseFloat($(this).val()) || 0;
        totalMOP += value;
    });

    var static = parseFloat($('#PaymenyTextBox').val()) || 0;
    var TotalAmount = totalMOP + static;

    var balanceAmount = grantTotal - TotalAmount;
    $('#BalanceAmount').val(balanceAmount.toFixed(2)).css('color', balanceAmount > 0 ? 'red' : balanceAmount < 0 ? 'orange' : 'green');

}


/*  =================== ================ CRUD Functionlity  ===================================  */
$(document).on('click', '#AddVendorLable', function () {
    VendorAlignmentOpen();
});

$(document).on('click', '#AddPurchaseReturn', function () {

    Common.removevalidation('FormBillFrom');
    Common.removevalidation('FormStatus');
    $('.ProductTableRow').empty();
    $("#PurchaseReturnStatus").val('').trigger('change');
    EditPurchaseReturnId = 0;

    $("#PurchaseReturnSaveBtn span:first").text("Save");
    $("#btnPurchaseReturnsaveprintbtn span:first").text("Save & Print");
    $("#btnPreviewPurchaseReturn span:first").text("Save & Preview");


    $('.page-inner-footer').show();
    VendorAlignmentClose();
    
    $("#ModalHeading").text("Add Purchase Return");
    //Common.ajaxCall("GET", "/Settings/GetCompanySetting", null, Inventory.CompanyAddressInPurchase, null);

    var EditDataId = { ModuleName: "PurchaseReturn", ModuleId: null };


    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, function (response) {
        StatusSuccess(response);
        $('#PurchaseReturnStatus').val(1).trigger('change');
    }, null);

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    $('#InvoiceDate').val(formattedDate);

    $('#PurchaseReturnModal').show();
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    $('#AlternativeCompanyAddress').val(FranchiseMappingId).trigger('change');
    var EditDataId = { ModuleId: null, ModuleName: null };
    Common.ajaxCall("GET", "/Common/GetBillFromDDDetails", EditDataId, function (response) {
        var id = "BillFrom";
        Common.bindDropDownSuccess(response.data, id);
        $('#BillFrom').prop('selectedIndex', 1).trigger('change');
    }, null);
    selectedProductIdsList = [];
    $('#ViewBankLable').hide();
    $('.Status-Div').hide();
    $("#PurchaseReturnModal .modal-body").animate({ scrollTop: 0 }, "fast");

})

function StatusSuccess(response) {
    var id = "PurchaseReturnStatus";
    Common.bindDropDownSuccess(response.data, id);
}
$(document).on('click', '#PurchaseReturnCancelBtn,#PurchaseReturnClose', function () {

    $('#PurchaseReturnModal').hide();

    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/PurchaseReturn/GetPurchaseReturn", EditDataId, PurchaseREturnSuccess, null);

    ResetDataDetails("others");
    Common.VendorRemoveValidation();
    $('#AlternativeCompanyAddress').val('').trigger('change');
});

$('#PurchaseReturnData').on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {

        var EditPurchaseReturnId = $(this).data('id');
        Common.ajaxCall("GET", "/PurchaseReturn/DeletePurchaseReturnDetails", { PurchaseReturnId: EditPurchaseReturnId }, function (response) {
            response = response.status ? Common.successMsg(response.message) : Common.errorMsg(response.message);

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
            Common.ajaxCall("GET", "/PurchaseReturn/GetPurchaseReturn", EditDataId, PurchaseREturnSuccess, null);

        }, null);
    }
});

$(document).on('click', '#PurchaseReturnSaveBtn', function () {

    SavePurchaseReturn(SavePurchaseReturnSuccess, SavePurchaseReturnError);
});
$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "PurchaseReturn",
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

function SavePurchaseReturn(successCallback, errorCallback) {

    getExistFiles();

    var RightSideHeaderFormIsValid = $("#FormRightSideHeader").validate().form();
    var ShippingFormIsValid = $("#FormShipping").validate().form();
    var VendorFormIsValid = $("#FormVendor").validate().form();
    var StatusFormIsValid = $("#FormStatus").validate().form();
    var BillFromIsValid = $("#FormBillFrom").validate().form();
    var DiscountFromIsValid = $("#frmtaxdiscountothers").validate().form();
    if (!RightSideHeaderFormIsValid || !ShippingFormIsValid || !VendorFormIsValid || !StatusFormIsValid || !BillFromIsValid || !DiscountFromIsValid) {
        $('#PurchaseReturnStatus-error').insertAfter('#statusError');
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
        Common.warningMsg('Choose Atleast One Product');
        $('#loader-pms').hide();
        return false;
    }

    var PurchaseReturnDetailsStatic = {};
    var vendorId = $('#Vendor').val();
    var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();

    var PRStatusId = $('#PurchaseReturnStatus option:selected').text();
    PRStatusId = (PRStatusId == '-- Select --') ? null : $('#PurchaseReturnStatus').val();
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());



    PurchaseReturnDetailsStatic = {
        PurchaseReturnId: EditPurchaseReturnId > 0 ? EditPurchaseReturnId : null,
        PurchaseReturnNo: $('#InvoiceNo').val(),
        VendorId: parseInt(vendorId),
        PurchaseReturnDate: $('#InvoiceDate').val(),
        ShipToId: parseInt(alternativeCompanyAddress),
        FranchiseId: franchiseId || null,
        BillFromFranchiseId: parseInt($('#BillFrom').val()),
        PurchaseBillId: $('#PInvoiceNo').val(),
        PurchaseBillDate: $('#PInvoiceDate').val(),
        OriginalInvoiceNo: $('#OriginalInvoiceNo').val(),

        TermsAndCondition: $('#TermsAndCondition').val() || null,
        Notes: $('#AddNotesText').val() || null,
        SubTotal: parseFloat($('#Subtotal').val() || 0.00),
        GrantTotal: parseFloat($('#GrantTotal').val() || 0.00),
        RoundOffValue: parseFloat($('#roundOff').val() || 0.00),
        PurchaseReturnStatusId: parseInt(PRStatusId),
        ReturnReasonId: $('#ReturnReasonId').val(),
        ReturnTypeId: $('#ReturnMethodId').val(),

    };

    var PurchaseReturnProductMappingDetails = [];

    $('#PReturnTablebody .ProductTableRow').each(function () {
        var $rowTable = $(this);
        var productId = $rowTable.data('product-id');
        var isIGSTVisible = $rowTable.find('.IGSTValues').is(':visible');
        if (isIGSTVisible) {
            var igstpercentage = Common.parseFloatValue($rowTable.find('#IGSTPercentage').val());
        } else {
            var igstpercentage = null;
        }
        var productDetail = {
            PurchaseProductMappingId: null,

            ProductId: parseInt(productId),
            PurchasePrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()),
            Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val() || 0),
            UnitId: parseInt($rowTable.find('.QtyUnitDropDown').val()),
            ProductDescription: $rowTable.find('.descriptiontdtext').val(),
            SubTotal: Common.parseFloatValue($rowTable.find('#subtotalAmount').val()),
            CGST_Percentage: Common.parseFloatValue($rowTable.find('#CGSTPercentage').val()),
            CGST_Value: Common.parseFloatValue($rowTable.find('#CGSTAmount').val()),
            SGST_Percentage: Common.parseFloatValue($rowTable.find('#SGSTPercentage').val()),
            SGST_Value: Common.parseFloatValue($rowTable.find('#SGSTAmount').val()),
            IGST_Percentage: igstpercentage,
            IGST_Value: Common.parseFloatValue($rowTable.find('#IGSTAmount').val()),
            CESS_Percentage: Common.parseFloatValue($rowTable.find('#CESSPercentage').val()),
            CESS_Value: Common.parseFloatValue($rowTable.find('#CESSAmount').val()),
            TotalAmount: Common.parseFloatValue($rowTable.find('.Totalamount-cell').text()),
            PurchaseReturnId: EditPurchaseReturnId > 0 ? EditPurchaseReturnId : null,
        };
        PurchaseReturnProductMappingDetails.push(productDetail);
    });

    var PurchaseReturnOtherChargesMappingDetails = [];
    var PROtherChargesMappingDetails = $("#dynamicBindRow .dynamicBindRow");

    $.each(PROtherChargesMappingDetails, function (index, value) {
        var ispercentageval = $(value).find('#IsPercentage').attr('name');
        var oid = $(value).find('.taxandothers').val();

        if (oid != undefined) {
            PurchaseReturnOtherChargesMappingDetails.push({
                PurchaseReturnOtherChargesMappingId: null,
                PurchaseReturnId: EditPurchaseReturnId > 0 ? EditPurchaseReturnId : null,
                OtherChargesId: parseInt($(value).find('.taxandothers').val() == "" ? 0 : $(this).find('.taxandothers').val()),
                OtherChargesType: $(value).find('.taxandothers').attr('OtherChargesType'),
                OtherChargesName: $(value).find('.taxandothers option:selected').text(),
                IsPercentage: Boolean($("input[name='" + ispercentageval + "']:checked").val() == '1' ? true : false),
                Value: parseFloat($(value).find('.calculateinventoryvalue').val() == "" ? 0 : $(this).find('.calculateinventoryvalue').val()),
                OtherChargeValue: parseFloat($(value).find('.otherChargeValue').val() == "" ? 0 : $(this).find('.otherChargeValue').val())
            });
        }
    });

    formDataMultiple.append("PurchaseReturnDetailsStatic", JSON.stringify(PurchaseReturnDetailsStatic));
    formDataMultiple.append("PurchaseReturnProductMappingDetails", JSON.stringify(PurchaseReturnProductMappingDetails));
    formDataMultiple.append("PurchaseReturnOtherChargesMappingDetails", JSON.stringify(PurchaseReturnOtherChargesMappingDetails));

    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    $.ajax({
        type: "POST",
        url: "/PurchaseReturn/InsertUpdatePurchaseReturn",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: successCallback,
        error: errorCallback

    });

}
function SavePurchaseReturnSuccess(response) {
    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }

    formDataMultiple = new FormData();

    if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseReturnId !== 'undefined') {
        EditPurchaseReturnId = data[0][0].PurchaseReturnId > 0 ? data[0][0].PurchaseReturnId : 0;

    } else {
        EditPurchaseReturnId = 0;
    }
    $('#loader-pms').hide();
    Common.successMsg(response.message);

    Common.VendorRemoveValidation();

    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/PurchaseReturn/GetPurchaseReturn", EditDataId, PurchaseREturnSuccess, null);
    $('#PurchaseReturnModal').hide();

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    ResetDataDetails("others");
}

function SavePurchaseReturnError(response) {
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

        var fnData = Common.getDateFilter('dateDisplay2');
        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/PurchaseReturn/GetPurchaseReturn", EditDataId, PurchaseREturnSuccess, null);
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
            ModuleName: "PurchaseReturn",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

/* ====================================== NOT NULL GET ================================================= */
$('#PurchaseReturnData').on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    EditPurchaseReturnId = $(this).data('id');
    var EditDataId = { ModuleName: "PurchaseReturn", ModuleId: EditPurchaseReturnId };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, StatusSuccess, null);

    var EditDataId = { ModuleId: EditPurchaseReturnId, ModuleName: "PurchaseReturn" };
    Common.ajaxCall("GET", "/Common/GetBillFromDDDetails", EditDataId, function (response) {
        var id = "BillFrom";
        Common.bindDropDownSuccess(response.data, id);


    }, null);
    editPurchaseReturn(EditPurchaseReturnId);
});
function editPurchaseReturn(EditPurchaseReturnId) {

    VendorAlignmentOpen();
    $("#PurchaseReturnSaveBtn span:first").text("Update");
    $("#btnPurchaseReturnsaveprintbtn span:first").text("Update & Print");
    $("#btnPreviewPurchaseReturn span:first").text("Update & Preview");

    $("#ModalHeading").text("Purchase Return Info");

    $('.page-inner-footer').show();
    $('.Status-Div').show();
    $('#PurchaseReturnModal').show();
    $("#PurchaseReturnModal .modal-body").animate({ scrollTop: 0 }, "fast");

    var EditDataId = { ModuleName: "PurchaseReturn", ModuleId: EditPurchaseReturnId };
    Common.ajaxCall("GET", "/Common/ActivityHistoryDetails", EditDataId, Inventory.StatusActivity, null);

   

    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    var EditDataId = { PurchaseReturnId: EditPurchaseReturnId, FranchiseId: franchiseId };
    Common.ajaxCall("GET", "/PurchaseReturn/NotNullGetPurchaseReturn", EditDataId, PurchaseReturnGetNotNull, null);
}
async function PurchaseReturnGetNotNull(response) {

    disableChangeEvent = true;
    formDataMultiple = new FormData();

    if (response.status) {

        var data = JSON.parse(response.data);


        Common.ajaxCall("GET", "/PurchaseInvoice/GetInventoryNumberDetailsByVendorId", { moduleName: "PurchaseBill", ModuleId: EditPurchaseReturnId, vendorId: parseInt(data[1][0].VendorId), ShipToFranchiseId:data[1][0].ShipToId }, function (response) {
            Common.bindParentDropDownSuccessForChosen(response.data, 'PInvoiceNo', 'POColumn');
        }, null);

        if (data[1].length > 0) {
            var poData = data[1][0];

            AutoGenerateFlag = true;
            $("#PurchaseReturnStatus option").each(function () {
                if ($(this).val() !== "" && $(this).val() < poData.PurchaseReturnStatusId) {
                    $(this).remove();
                }
            });

            $('#PInvoiceDate').val(extractDate(poData.PurchaseBillDate));
            $('#OriginalInvoiceNo').val(poData.OriginalInvoiceNo);
            $('#InvoiceDate').val(extractDate(poData.PurchaseReturnDate));
            $('#AlternativeCompanyAddress').val(poData.ShipToId).trigger('change');

            $('#InvoiceNo').val(poData.PurchaseReturnNo);
            $('#PurchaseReturnStatus').val(poData.PurchaseReturnStatusId).trigger('change');
            $('#ReturnReasonId').val(poData.ReturnReasonId).trigger('change');
            $('#ReturnMethodId').val(poData.ReturnTypeId).trigger('change');
            $('#BillFrom').val(poData.BillFromFranchiseId).trigger('change');
            Common.bindData(data[0]);
            var poData = data[1][0];
            EditPurchaseReturnId = poData.PurchaseReturnId;

            Inventory.toggleField(poData.Notes, "#Notes", "#AddNotes", "#AddNotesLable");
            Inventory.toggleField(poData.TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
            Inventory.toggleFieldForAttachment(data[3][0].AttachmentId, "#AddAttachLable", "#AddAttachment");

            $("#ViewBankLable").hide();

        }

        var tablebody = $('#PReturnTablebody');
        var mainTable = $('#PRProductTable');

        var stateSelector1 = "#VendorStateName";
        var stateSelector2 = "#StateName";
        Inventory.PurchaseHeaderBindData(response);
        Inventory.bindSaleProducts(data[0], tablebody, mainTable, null, stateSelector1, stateSelector2);

        $('#dynamicBindRow').empty('');

        Inventory.bindOtherCharges(data[2]);
        Inventory.GetMopDetails(data[3]);


        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];

        var ulElement = $('#ExistselectedFiles');

        $.each(data[3], function (index, file) {
            if (file.AttachmentId != null) {
                $('#AddAttachment').show();
                $('#AddAttachLable').hide();

                var truncatedFileName = file.AttachmentFileName.length > 10 ? file.AttachmentFileName.substring(0, 10) + '...' : file.AttachmentFileName;

                var liElement = $('<li>');
                var spanElement = $('<span>').text(truncatedFileName);
                var downloadButton = $(`<a src="${file.AttachmentFilePath}" href="${file.AttachmentFilePath}">`)
                    .addClass('download-button').html(`<i class="fas fa-download"></i>`);

                var downloadLink = $('<a>').addClass('download-link')
                    .attr('href', file.AttachmentFilePath)
                    .attr('download', file.AttachmentFileName)
                    .html('<i class="fas fa-download"></i>');

                var deleteButton = $(`<a src="${file.AttachmentFilePath}" AttachmentId="${file.AttachmentId}" ModuleRefId="${file.ModuleRefId}" id="deletefile">`)
                    .addClass('delete-buttonattach').html(`<i class="fas fa-trash"></i>`);

                liElement.append(spanElement);
                liElement.append(downloadLink);
                liElement.append(deleteButton);
                ulElement.append(liElement);

            } else {
                $('#AddAttachment').hide();
                $('#AddAttachLable').show();
            }
        });

    }

    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();

    setTimeout(function () {
        $('#PInvoiceNo').val(poData.PurchaseBillId).trigger('change');
        disableChangeEvent = false;
        AutoGenerateFlag = false;
        Inventory.updateGSTVisibility('#VendorStateName', '#StateName');
        $('#loader-pms').hide();
    }, 500);

}

function extractDate(inputDate) {
    if (typeof inputDate !== 'string' || !inputDate.includes('T')) {
        return "";
    }
    var parts = inputDate.split('T');
    var datePart = parts[0];
    return datePart;
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

    $('#PurchaseReturnNumberDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');

    $('#PurchaseReturnDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#PurchaseInvoiceNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#PIDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#OriginalInvoiceNumberDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');

    $('#ReturnTypeDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#ReasonDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');


    $('#POColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-12').addClass('col-lg-4 col-md-12 col-sm-12 col-12');
}
function VendorAlignmentClose() {
    $('#AddVendorlableColumn').show();
    $('#BillFromColumn').hide();
    $('#VendorColumn').hide();
    $('#ShippingColumn').hide();
    $('#AddVendorlableColumn').removeClass('d-flex justify-content-center');


    $('#PurchaseReturnNumberDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');

    $('#PurchaseReturnDateDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#PurchaseInvoiceNoDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#PIDateDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#OriginalInvoiceNumberDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');

    $('#ReturnTypeDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#ReasonDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#POColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-12');
}


function resetCommonData() {
    $('#discounttotal, #GSTtotal, #CESSTotal, #StateCESSTotal, #Subtotal,#GrantTotal,#roundOff,#BalanceAmount').val('');
    $('#SubTotalTotal, #CGSTTotal, #SGSTTotal, #IGSTTotal, #CESSTotal').val('');
    selectedProductIdsList = [];

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();

    $('#PRProductTable .ProductTableRow').remove();
    $('#dynamicBindRow').empty('');
    $('#appendContainer .input-group').slice(1).empty();
    
}
function ResetDataDetails(type) {
    resetCommonData();

    if (type !== 'Vendor') {
        $('#Vendor, #ShipType').val('').trigger('change');
        $('#ClientColumn, #ShippingColumn, #AddNotes, #AddTerms, #AddAttachment').hide();
        $('#AddVendorlableColumn, #AddNotesLable, #AddTermsLable, #AddAttachLable').show();
        $('#AddNotesText, #TermsAndCondition').val('');
        $('#PurchaseReturnStatus').val('').trigger('change');
        $("#BillFromAddress").text('');
    }

}


/* ====================================== Mail  ================================================= */
$(document).on('click', '#closeMail', function () {
    $("#SendMail").modal('hide');

    editPurchaseReturn(EditPurchaseReturnId);
});
$(document).on('click', '#PurchaseReturnMailBtn', function () {
    $('#loader-pms').show();
    $("#AttachmentArea").html('');

    $("#EmailDetails #Subject").val('Purchase Order');
    $('#ShareDropdownitems').css('display', 'none');

    SavePurchaseReturn(MailAttachmentPurchasebillSuccess);
});
function MailAttachmentPurchasebillSuccess(response) {

    try {

        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }


    if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseReturnId !== 'undefined') {
        EditPurchaseReturnId = data[0][0].PurchaseReturnId > 0 ? data[0][0].PurchaseReturnId : 0;

    } else {

        EditPurchaseReturnId = 0;

    }

    var moduleId = EditPurchaseReturnId;
    if (moduleId > 0) {
        var EditDataId = { ModuleName: 'PurchaseReturn', ModuleId: moduleId };
        Common.ajaxCall("GET", "/Common/GetEmailToAddressDetails", EditDataId, GetEmailToAddress, null);
    } else {
        $('#loader-pms').hide();
    }
}
function GetEmailToAddress(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'EmailDetails');
        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);
        $("#VendorEmail").val(data[0][0].ClientEmail);

        var PurchaseReturnNumber = $('#InvoiceNo').val(); // Purchase Return Number
        var companyName = data[0][0].CompanyName; // Company Name
        var VendorName = $('#Vendor option:selected').text(); // Vendor Name
        var PurchaseReturnDate = $('#InvoiceDate').val(); // Purchase Return Date
        if (PurchaseReturnDate) {
            var dateParts = PurchaseReturnDate.split("-"); // Split by hyphen
            PurchaseReturnDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearrange to DD-MM-YYYY
        }
        var deliveryAddress = data[0][0].FullAddress; // Delivery Address
        var yourFullName = data[0][0].Fullname; // Your Full Name
        var yourPosition = data[0][0].UserGroupName; // Your Position

        var emailBody = `
<div style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
    <div style="color: #007BFF; font-size: 16px;">
        Dear <strong>${VendorName}</strong>,
    </div>
    <p>Your Purchase Return has been processed successfully. Please review the details below.</p>
    <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3>Purchase Return Details</h3>
        <p><b>Purchase Return Number  :</b> ${PurchaseReturnNumber}</p>
        <p><b>Purchase Return Date    :</b> ${PurchaseReturnDate}</p>
        <p><b>Delivery Address        :</b> ${deliveryAddress}</p>
    </div>
    <p>If you have any questions, feel free to contact me directly.</p>
    <div style="margin-top: 20px; font-size: 14px;">
        <p>Thank you for choosing <strong>${companyName}</strong>. We look forward to serving you.</p>
        <p>Best regards,</p>
        <p style="font-weight:700;">${yourFullName},<br>${companyName}</p>
    </div>
</div>
`;

        $("#EmailDetails .note-editable").html(emailBody);


        printType = "Mail";

        var franchiseId = parseInt($('#UserFranchiseMappingId').val());

        var EditDataId = {
            ModuleId: parseInt(EditPurchaseReturnId),
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId
        };

        Common.ajaxCall("GET", "/PurchaseReturn/PurchaseReturnPrint", EditDataId, function (response) {
            Inventory.AttachmentPdfSuccess(response, "Purchase Return.PDF");
        }, null);

    }
}
$(document).on('click', '#SendButton', function () {
    $('#loader-pms').show();
    $('#SendButton').html('Sending...');

    Inventory.EmailSendbutton();
    $('#SendButton').html('Send');

});

/*============================================PREVIEW & DOWNLOAD & PRINT =============================================================*/

$(document).on('click', '#btnPreviewPurchaseReturn, #btnPurchaseReturnsaveprintbtn, #downloadLink', function () {

    printType = this.id === 'btnPreviewPurchaseReturn' ? 'Preview' :
        this.id === 'btnPurchaseReturnsaveprintbtn' ? 'Print' : 'Download';

    $('#loader-pms').show();
    SavePurchaseReturn(GetPreviewAndDownloadAddress);
});

function GetPreviewAndDownloadAddress(response) {

    formDataMultiple = new FormData();
    existFiles = [];

    if (response.status) {
        try {
            data = JSON.parse(response.data);
        } catch (e) {
            console.error("Error parsing response data:", e);
            data = null;
        }


        if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseReturnId !== 'undefined') {
            EditPurchaseReturnId = data[0][0].PurchaseReturnId > 0 ? data[0][0].PurchaseReturnId : 0;
        } else {
            EditPurchaseReturnId = 0;

        }

        var franchiseId = parseInt($('#UserFranchiseMappingId').val());

        var EditDataId = {
            ModuleId: parseInt(EditPurchaseReturnId),
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/PurchaseReturn/PurchaseReturnPrint',
            method: 'GET',
            data: EditDataId,
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response) {
                $('#loader-pms').hide();
                $('#ShareDropdownitems').css('display', 'none');
                var blob = new Blob([response], { type: 'application/pdf' });
                var blobUrl = URL.createObjectURL(blob);
                if (printType == "Preview") {
                    var newTab = window.open();
                    if (newTab) {
                        newTab.document.write(`
                                              <html>
                                              <head><title>Purchase Invoice Preview</title></head>
                                              <body style="margin:0;">
                                                  <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%" />
                                              </body>
                                              </html>
                                          `);
                        newTab.document.close();
                    }

                } else if (printType == "Download") {
                    var link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = 'Purchase Invoice.pdf';
                    link.click();
                } else if (printType == "Print") {
                    var iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = blobUrl;
                    document.body.appendChild(iframe);
                    iframe.contentWindow.print();
                }
                /* Print*/

            },
            error: function () {
                $('#loader-pms').hide();
                Common.errorMsg(response.message);
            }
        });



    }
}

/*=========================================PRINT SETTING IMPLEMENT=====================================================*/

function adjustTableColumnWidths() {
    const visibleColumns = $('#PRProductTable thead th:visible').length;
    const newWidth = 100 / visibleColumns + '%';

    $('#PRProductTable thead th:visible').css('width', newWidth);
    $('#PRProductTable tbody tr').each(function () {
        $(this).find('td:visible').css('width', newWidth);
    });
}

//================================================================================WhatsApp Sending===========================================================================
$(document).on('click', '#PurchaseReturnWhatsAppBtn', function () {
    SavePurchaseReturn(GetWhatsAppDetails);
});

function GetWhatsAppDetails(response) {
    $('#SpinnerWhatsApp').show();

    formDataMultiple = new FormData();
    existFiles = [];

    if (response.status) {

        var data = JSON.parse(response.data);

        if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseReturnId !== 'undefined') {
            EditPurchaseReturnId = data[0][0].PurchaseReturnId > 0 ? data[0][0].PurchaseReturnId : 0;

        } else {

            EditPurchaseReturnId = 0;

        }

        var franchiseId = parseInt($('#UserFranchiseMappingId').val());

        var EditDataId = {
            ModuleId: parseInt(EditPurchaseReturnId),
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: "WhatsApp",
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/PurchaseReturn/PurchaseReturnPrint',
            method: 'GET',
            data: EditDataId,
            success: function (response) {

                $('#loader-pms').show();
                var moduleId = EditPurchaseReturnId;
                if (moduleId > 0) {
                    Common.ajaxCall("GET", "/Common/GetInventoryWhatsappDetails", { ModuleName: "PurchaseReturn", ModuleId: EditPurchaseReturnId, FilePath: response.data }, DataWhatsAppDetails, null);
                }
            },
            error: function () {
                $('#loader-pms').hide();
                $('#SpinnerWhatsApp').hide();
                Common.errorMsg(response.message);
            }
        });
    }
}

function DataWhatsAppDetails(response) {
    $('#loader-pms').hide();
    if (response.status) {
        $("#ShareDropdownitems").hide();
        setTimeout(function () {
            $('#SpinnerWhatsApp').hide();
            // Proceed with the next action after the spinner is hidden
            Common.successMsg("The message was successfully sent on WhatsApp.");
        }, 500);
    } else {
        Common.errorMsg("The message failed to send on WhatsApp.");
    }
}

//=============================================SHORTCUTS==============================================

$(document).keydown(function (event) {

    // Handling Alt + p
    if (event.altKey && event.key === 'p') {
        event.preventDefault();
        $('#btnPurchaseReturnsaveprintbtn').click();
    }

    // Handling alt + v
    if (event.altKey && event.key === 'v') {
        event.preventDefault();
        $('#btnPreviewPurchaseReturn').click();
    }

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#PurchaseReturnSaveBtn').click();
    }

    // Handling alt + h
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        $('#btnsharePurchaseReturn').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#PurchaseReturnCancelBtn').click();
    }

});

/* ====================================== PInvoiceNo Invoice ============================================ */
$(document).on('change', '#PInvoiceNo', function () {

    if (disableChangeEvent) {
        return false;
    }
    var piNumber = $('#PInvoiceNo').val();

    if (piNumber != null && piNumber != "") {
        $('#PReturnTablebody .ProductTableRow').remove();
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());

        var EditDataId = { PurchaseId: piNumber, ModuleName: "PurchaseBill", FranchiseId: franchiseId };
        Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseDetails_ByPurchaseId", EditDataId, PIBindingNotNull, null);
    }
    else if (piNumber == "") {
        ResetDataDetails("Invoice");
        $('#PReturnTablebody .ProductTableRow').remove();
    }

    
});

function PIBindingNotNull(response) {

    var data = JSON.parse(response.data);
    Inventory.toggleField(data[1][0].Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable");
    Inventory.toggleField(data[1][0].TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
   
    var purchasebillDate = data[1][0].PurchaseBillDate.split('T');
    $('#PInvoiceDate').val(purchasebillDate[0]);

    $("#OriginalInvoiceNo").val(data[1][0].OriginalInvoiceNo)

   

    var tablebody = $('#PReturnTablebody');
    var mainTable = $('#PRProductTable');


    Inventory.bindSaleProducts(data[0], tablebody, mainTable);

    $('#dynamicBindRow').empty('');
    Inventory.bindOtherCharges(data[2]);
    Inventory.GetMopDetails(data[3]);

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    Inventory.bindAttachments(data[3]);

    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();
    Inventory.updateGSTVisibility('#VendorStateName', '#StateName');
}
/* ========================================== Bank Details ====================================== */
$(document).on('click', '#BankEdit', function () {
    Inventory.BankCanvasOpen();
});
$(document).on('click', '#CloseCanvas,#CloseBankBtn', function () {
    Inventory.BankCanvasClose();
});
$(document).on('click', '#UpdateBankBtn', function () {
    var BankUpdateFormIsValid = $("#BankUpdateForm").validate().form();

    var VendorId = parseInt($('#VendorColumn #Vendor').val());
    var EditDataId = { ModuleId: VendorId, ModuleName: "Purchase" };

    if (!BankUpdateFormIsValid) {
        return false;
    } else {
        Inventory.BankDetailsUpdate(
            function (response) { Inventory.handleBankUpdateSuccess(response, EditDataId); },
            function (error) { Inventory.handleBankUpdateError(error); }
        );
    }
});
$(document).on('click', '#ViewBankLable', function () {
    $('#AddBankDetails').show();
    $('#ViewBankLable').hide();
    $('#BankEdit').show();
});
$(document).on('click', '#HideBankLable', function () {
    $('#AddBankDetails').hide();
    $('#BankEdit').hide();
    $('#ViewBankLable').show();
});

/* ======================================= Other Charges  ============================================ */
$('#OtherchargesAdd').click(function () {
    $('#OtherChargesDropDown').toggle();
});


$(document).on('click', '.ddlOtherCharges', function () {
    $('#OtherChargesDropDown').hide();
    /*$('#OtherChargesDropDown').toggle();*/
    var otherChargesTypeName = $(this).attr('OtherCharges');

    Inventory.GetOtherCharges(otherChargesTypeName);
    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();
});
$(document).on('click', '.DynremoveBtn', function () {
    $(this).closest('.OtherChargesRow').remove();
    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();
});
$(document).on('change', '.taxandothers', function () {
    Inventory.TaxAndOthersDropdownChange.call(this);
    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();
});
$(document).on('input', '.calculateinventoryvalue', function () {
    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();
});
$(document).on('click', '.calculateinventory', function () {
    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();
});
