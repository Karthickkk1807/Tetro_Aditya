let selectedMOPs = new Set();
var formDataMultiple = new FormData();
var EditDeliveryChallanId = 0;
var deletedFiles = [];
var existFiles = [];
var disableChangeEvent = false;
var AutoGenerateFlag = false;
var printType = "";
var PDFformat = "";
var StartDate;
var EndDate;
var selectedProductQuantity = [];
var selectedProductUnitId = [];
var selectedProductIdsList = [];

/* ================================== Initial Load Event ======================================== */
$(document).ready(function () {
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    $('#SpinnerWhatsApp').hide();
    //$('.PartiallyPaidHide').hide();

    /////////Email Validation////////
    Inventory.EmailValidationOnInputClient();
    Inventory.EmailValidationOnInputAlterAddress();

    /*--------------------Validation For Inputs---------------------------*/
    Common.setupValidation("#FormPaidBalance",
        { "PaidFrom": { required: true }, "PaidFromDays": { required: true }, "DeliveryChallanStatusId": { required: true } },
        { "PaidFrom": { required: "This field is required." }, "PaidFromDays": { required: "This field is required." }, "DeliveryChallanStatusId": { required: "This field is required." } }
    );

    Common.setupValidation("#frmtaxdiscountothers",
        { "taxandothers": { required: true } },
        { "taxandothers": { required: "This field is required." } }
    );



    /*--------------------Validation For Inputs---------------------------*/

    initializePage(FranchiseMappingId);

    Common.bindDropDown('ClientId', 'Client');
    Common.bindDropDown('StateIdOFfCanvas', 'StateId');
    Common.bindDropDown('AlternativeCompanyAddress', 'UserFranchiseMapping');
    Common.bindDropDown('BillFrom', 'BillFrom');
   


    

    $('#VendorEdit').hide();

    $("#addPartialPayment").prop('disabled', false);

    $('#ClientId,#TakeId,#EstimateId,#AlternativeCompanyAddress').each(function () {
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
        }
    }, null);

    if (AutoGenerateFlag) {
        return false;
    }

    var ShipId = $('#ShippingColumn #AlternativeCompanyAddress').val();
    var EditDataId = { ModuleName: 'DeliveryChallan', FranchiseId: ShipId };

    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "DeliveryChallanNumber", "DeliveryChallanNo");
    });
});

async function initializePage(FranchiseMappingId) {
    $('#loader-pms').show();
    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);
    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: FranchiseMappingId };

    Common.ajaxCall("GET", "/DeliveryChallan/GetDC", EditDataId, DCSuccess, null);

    let MOPDropdownVal = await Common.bindDropDownSync('ModeOfPayment');
    Common.bindDropDownSuccess(MOPDropdownVal, 'ModeOfPaymentId');
    MOPDropdown = JSON.parse(MOPDropdownVal);

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#OtherChargesDropDown').length && !target.closest('#OtherchargesAdd').length) {
            $('#OtherChargesDropDown').css('display', 'none');
        }
    });

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#ShareDropdown').length && !target.closest('#btnshareDc').length) {
            $('#ShareDropdown').css('display', 'none');
        }
    });


    $('#VendorColumn').hide();
    $('#ShippingColumn').hide();
}
function DCSuccess(response) {

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

        var columns = Common.bindColumn(data[1], ['DeliveryChallanId', 'Status_Color']);
        Common.bindTablePurchase('DCData', data[1], columns, -1, 'DeliveryChallanId', '330px', true, access);


    }
}

/* -------------------- Header  ADDRESS DETAILS -------------------------------------- */

$('#ChallanType').val('');

$(document).on('change', '#ClientColumn #ClientId', function () {

    if (disableChangeEvent) {
        return false;
    }

    Inventory.ClientAddressBind();

    const ClientId = $('#ClientId').val();
    const data = null;

    loadEstimateAndDeliveryChallan(ClientId, data);

});
$(document).on('change', '#TakeId', async function () {

    if (disableChangeEvent) {
        return false;
    }
    var AlternativeAddress = $(this).val();
    var clientId = $('#ClientId').val();
    var responseData = await Common.getAsycData("/Sale/GetAlternateAddressDetails?Type=Client&AltAddressId=" + parseInt(AlternativeAddress) + "&ModuleTypeId=" + parseInt(clientId));
    if (responseData !== null) {
        Inventory.ClientAlternativeAddressDetails(responseData);
    }
});
$(document).on('click', '#Check', function () {


    if (disableChangeEvent) {
        return false;
    }
    var checkbox = $("#Check").prop('checked');
    if (checkbox) {
        $("#ShippingEdit").hide();
        $('#TakeId-error').hide();
        $('#TakeId').removeAttr('required');
    }
    else {
        $("#ShippingEdit").show();
        $('#TakeId-error').show();
        $('#TakeId').attr('required', true);
    }

    Inventory.sameasAddressCheck();
});
$(document).on('click', '#VendorEdit', function () {

    Inventory.ClientAddressLabelToForm();
});
$(document).on('click', '#ShippingEdit', function () {
    Inventory.AlternateAddressLabelTOForm();
});
$(document).on('click', '#CloseCanvas,#ClientAlterAddressCloseBtn', function () {
    Inventory.EditAddressCanvasClose();
});
$(document).on('click', '.btn-close,#ClientAlterAddressCloseBtn', function () {
    Inventory.AlternativeEditAddressCanvasClose();
});
$(document).on('click', '#ClientAddressUpdateBtn', function () {
    Inventory.ClientAddressUpdate();
});
$(document).on('click', '#AlternativeUpdateBtn', function () {
    Inventory.AlternateUpdateAddress();
});

/* ======================================= PRODUCT TABLE ========================================== */


$(document).on('click', '#UpdateProductsInAddItem', function () {

    var AllProductTable = 'AllProductTable';
    var tablebody = $('#DCProductTablebody');
    var mainTable = $('#DCProductTable');
    var moduleName = 'Sale';
    $('#loader-pms').show();
    Inventory.AddProductsToMainTable(AllProductTable, tablebody, mainTable, moduleName);

});

$(document).on('click', '.DynremoveBtn', function () {
    const row = $(this).closest('tr');
    let productId = row.data('product-id');
    var mainTable = $('#DCProductTable');
    Inventory.RemoveProductMainRow(row, productId, mainTable);

});
$(document).on('input', '.SellingPrice', function () {

    const row = $(this).closest('tr');
    var mainTable = $('#DCProductTable');
    Inventory.calculateTaxableAmount(row);
    Inventory.calculateCGST(row);
    Inventory.calculateSGST(row);
    Inventory.calculateIGST(row);
    Inventory.calculateCESS(row);
    Inventory.calculateTotalAmount(row);
    Inventory.updateSubtotalRow(mainTable);
    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    var clientId = parseInt($("#ClientColumn #ClientId").val());

    calculateBalance();

});
$(document).on('input', '.TableRowQty', function () {

    const finalQTY = parseInt($(this).val() || 0);
    const row = $(this).closest('tr');
    var QtyUnitDropDown = parseInt(row.find('.QtyUnitDropDown').val());
    const data = row.data('product-info');
    const productId = row.data('product-id');

    var tablebody = $('#DCProductTablebody');
    var mainTable = $('#DCProductTable');

    let existingRow = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`);
    let existingRowFirst = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`).first();

    Inventory.QuantityInputChange(finalQTY, row, QtyUnitDropDown, data, productId, tablebody, mainTable, existingRow, existingRowFirst);
});
$(document).on('input', '#DisInput', function () {

    const row = $(this).closest('tr');
    var mainTable = $('#DCProductTable');
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
$(document).on('click', '.freeqty', function () {

    const $row = $(this).closest('tr');
    const productData = $row.data('product-info');
    var unit = parseInt($row.find('.QtyUnitDropDown').val(), 10) || 0;
    var remainingStock = $row.find('.remaining-stock');

    const currentQty = parseInt($row.find('.TableRowQty').val(), 10) || 0;
    const $nextRow = $row.next();
    const nextRowQty = $nextRow.find('.Quantity-cell').val() || 0;
    var Calculate = parseInt(currentQty) + parseInt(nextRowQty);
    var StoreStockInHand = productData.StoreStockInHand;
    var tablebody = $('#DCProductTablebody');
    var mainTable = $('#DCProductTable');

    if (unit === productData.PrimaryUnitId) {

        if (Calculate < productData.StoreStockInHand) {

            Inventory.addRow(productData, $row, mainTable, tablebody);
        } else {
            Inventory.FreeQuantityRange(productData.StoreStockInHand, $row);
        }


    } else if (unit === productData.SecondaryUnitId) {

        var Val = productData.SecondaryUnitValue * StoreStockInHand;
        if (Calculate < Val) {

            Inventory.addRow(productData, $row, mainTable, tablebody);
        } else {
            Inventory.FreeQuantityRange(Val, $row);
        }

    }

});

$(document).on('change', '.DiscountDropdown', function () {
    const row = $(this).closest('tr');
    var mainTable = $('#DCProductTable');
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

$(document).on('change', '.QtyUnitDropDown', function () {

    let rowElement = $(this).closest('tr');
    let selectedUnit = parseInt($(this).val());
    let productData = rowElement.data('product-info');
    let tableBody = $('#DCProductTablebody');
    var mainTable = $('#DCProductTable');
    Inventory.updateSellingPriceBasedOnUnitProductRow(selectedUnit, tableBody, rowElement, productData, mainTable);
});
$(document).on('click', '#AddItemBtn', function () {

    $('#loader-pms').show();
    var mainTable = $("DCProductTable");
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var moduleName = 'Sale';

    var ClientId = $('#ClientColumn #ClientId').val();
    if (ClientId) {
        $('#AddProductModal').show();
        Inventory.AllProductTable(mainTable, moduleName, null, FranchiseMappingId);
        $(".TotalSelectedItmsCount,.TotalSelctAmount").hide();
    } else {
        Common.warningMsg("Choose a Client to Continue.");
        $('#loader-pms').hide();
    }
});
$(document).on('click', '.addQtyBtn', function () {
    $(this).hide();
    $(this).closest('td').find('.OtyColumn').toggleClass('d-none');
});




$(document).on('input', '#PaymenyTextBox', function () {
    calculateBalance();
});
$(document).on('input', '.MOPAmount', function () {
    calculateBalance();
});
$(document).on('change', '.GrantTotal', function () {
    calculateBalance();
});
function calculateBalance() {

    var grantTotal = parseFloat($('#GrantTotal').val()) || 0;
    var CreditAmount = parseFloat($('#CreditAmount').val()) || 0;
    var totalMOP = 0;
    $('.MOPAmount').each(function () {
        var value = parseFloat($(this).val()) || 0;
        totalMOP += value;
    });

    var static = parseFloat($('#PaymenyTextBox').val()) || 0;
    var TotalAmount = totalMOP + static + CreditAmount;

    var balanceAmount = grantTotal - TotalAmount;
    $('#BalanceAmount').val(balanceAmount.toFixed(2)).css('color', balanceAmount > 0 ? 'red' : balanceAmount < 0 ? 'orange' : 'green');

}

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
    var clientId = parseInt($("#ClientColumn #ClientId").val());

    calculateBalance();
});
$(document).on('click', '.DynremoveBtn', function () {
    $(this).closest('.OtherChargesRow').remove();
    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    var clientId = parseInt($("#ClientColumn #ClientId").val());

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


/* ============= =============== CRUD Function  ====================== ========================= */
$(document).on('click', '#customBtn_DCData', function () {
    BillingAddressDivClose();
    /*Common.ClientRemoveValidation();*/
    Inventory.ForRemoveBindClientAlternativeColumnSales();
    Common.removevalidation('FormBillFrom');
    Common.removevalidation('FormShipping');
    Common.removevalidation('FormRightSideHeader');
    Common.removevalidation('FormStatus');
    $("#DCSaveBtn span:first").text("Save");
    $("#btnPrintDC span:first").text("Save & Print");
    $("#btnPreviewDc span:first").text("Save & Preview");

    $('#Headings').text('Sale');
    $('#DeliveryChallanModal').show();
    $("#DeliveryChallanModal .modal-body").animate({ scrollTop: 0 }, "fast");


    EditDeliveryChallanId = 0;
    $('#AddAttachment').hide();
    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    $('#DeliveryChallanDate').val(formattedDate);
    $('#EstimateId').append('<option value="0">--Select--</option>');

    var EditDataId = { ModuleName: "Estimate", ModuleId: null };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, StatusSuccess, null);
    $('#ViewBankLable').hide();

    $('#appendContainer').empty();
    $('.Status-Div').hide();
    $('#AlternativeCompanyAddress').val('').trigger('change');


});

function StatusSuccess(response) {
    var id = "DeliveryChallanStatusId";
    Common.bindDropDownSuccess(response.data, id);
}
$(document).on('click', '#AddVendorLable', function () {
    BillingAddressDivOpen();
});

$(document).on('click', '#DCSaveBtn', function () {
    sendDCRequest(handleDCSuccess, handleDCError);
});
$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Deliverychallan",
        ModuleRefId: parseInt(moduleRefId),
        AttachmentFileName: fileText,
        AttachmentFilePath: src
    });
    $(listItem).remove();
});
$(document).on('click', '#DCCancelBtn,#DeliveryChallanClose', function () {
    $('#DeliveryChallanModal').hide();
    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: FranchiseMappingId };

    Common.ajaxCall("GET", "/DeliveryChallan/GetDC", EditDataId, DCSuccess, null);

    var type = 'others';
    ResetDataDetails(type);

});
$(document).on('click', '#DCData .btn-delete', async function () {

    var response = await Common.askConfirmation();
    if (response == true) {
        var DCId = $(this).data('id');

        Common.ajaxCall("GET", "/DeliveryChallan/DeleteDCDetails", { DeliveryChallanId: DCId }, DeliveryChallanReload, null);
    }
});
function DeliveryChallanReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var formattedStartDate = formatDateForSQL(StartDate);
        var formattedEndDate = formatDateForSQL(EndDate);
        var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: franchiseId };
        Common.ajaxCall("GET", "/DeliveryChallan/GetDC", EditDataId, DCSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
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
function getExistFiles() {

    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "Deliverychallan",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}
function sendDCRequest(successCallback, handleError) {

    var isValid = true;

    // Clear previous error messages
    $('.error-label').remove();

    // Loop through all required fields inside #appendContainer
    $('#appendContainer input[required], #appendContainer select[required]').each(function () {
        var field = $(this);

        if (!field.val()) {  // Check if the field is empty
            isValid = false;

            // Create and insert error message if not already added
            if (!field.next('.error-label').length) {
                field.after(`<label class="error-label text-danger error" for="${field.attr('id')}">This field is required.</label>`);
            }
        }
    });

    Inventory.ckeckforTakeIdValidtion();

    getExistFiles();

    var ClientFormIsValid = $('#FormClient').validate().form();
    var ShippingFormIsValid = $('#FormShipping').validate().form();
    var RightSideHeaderFormIsValid = $('#FormRightSideHeader').validate().form();
    var taxdiscountFormIsValid = $('#frmtaxdiscountothers').validate().form();

    var BillFromIsValid = $("#FormBillFrom").validate().form();
    var StatusFromIsValid = $("#FormStatus").validate().form();

    if (!ClientFormIsValid || !ShippingFormIsValid || !RightSideHeaderFormIsValid || !taxdiscountFormIsValid || !isValid || !BillFromIsValid || !StatusFromIsValid) {
        $('#AlternativeCompanyAddress-error').insertAfter('.AlternativeCompanyError');
        $('#loader-pms').hide();
        return false;
    }

    var ClientId = $('#ClientId').val();

    if (ClientId == '') {
        Common.warningMsg('Click + Add Client and Fill the Input');
        $('#loader-pms').hide();
        return false;
    }

    var TableLenthDynamicRow = $('.ProductTableRow').length;
    if (TableLenthDynamicRow == 0) {
        Common.warningMsg('Choose Atleast One Product');
        $('#loader-pms').hide();
        return false;
    }

    $('#loader-pms').show();
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var DueDateString = $('#PaidFromDueDate').val();
    var dueDate = new Date(DueDateString);

    var paidFrom = parseInt($('#PaidFrom').val());
    paidFrom = paidFrom > 0 ? paidFrom : null;


    var EstimateDateString = $('#EstimateDate').val();
    var EstimateDate = new Date(EstimateDateString);

    var DeliveryChallanDateString = $('#DeliveryChallanDate').val();
    var DeliveryChallanDate = new Date(DeliveryChallanDateString);
    var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();
    var DeliveryChallanDetailsStatic = {
        DeliveryChallanId: EditDeliveryChallanId > 0 ? EditDeliveryChallanId : null,
        ClientId: parseInt($('#ClientId').val()),
        FranchiseId: FranchiseMappingId || null,
        BillingFranchiseId: parseInt(alternativeCompanyAddress),
        BillFromFranchiseId: parseInt($('#BillFrom').val()),
        DeliveryChallanNo: $('#DeliveryChallanNumber').val(),
        DeliveryChallanDate: DeliveryChallanDate,
        EstimateId: parseInt($('#EstimateId').val()) || null,
        EstimateDate: EstimateDate,
        ChallanType: $('#ChallanType option:selected').text(),
        ReferenceNo: $('#ReferenceNumber').val(),
        TermsAndCondition: $('#TermsAndCondition').val() || null,
        Notes: $('#AddNotesText').val() || null,
        SubTotal: parseFloat($('#Subtotal').val()),
        GrantTotal: parseFloat($('#GrantTotal').val()),
        RoundOffValue: parseFloat($('#roundOff').val()),
        DeliveryChallanStatusId: $('#DeliveryChallanStatusId').val() || null,
    };

    var DeliveryChallanProductMappingDetailsArray = [];


    $('#DCProductTablebody .ProductTableRow').each(function () {
        var $rowTable = $(this);
        var productId = $rowTable.data('product-id');


        DeliveryChallanProductMappingDetailsArray.push({
            SaleProductMappingId: null,
            ProductId: parseInt(productId),
            SellingPrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()),
            Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val() || 0),
            UnitId: parseInt($rowTable.find('.QtyUnitDropDown').val()),
            ProductDescription: $rowTable.find('.descriptiontdtext').val(),
            Discount: Common.parseFloatValue($rowTable.find('#DisInput').val()) || null,
            GstPercentage: Common.parseFloatValue($rowTable.find('#GSTInput').val()),
            TotalAmount: Common.parseFloatValue($rowTable.find('.Totalamount-cell').text()),
            ModuleId: EditDeliveryChallanId > 0 ? EditDeliveryChallanId : null,


        });

    });

    var DeliveryChallanOtherChargesMappingDetailsArray = [];
    var DeliveryChallanOtherChargesMappingDetails = $("#dynamicBindRow .dynamicBindRow");

    $.each(DeliveryChallanOtherChargesMappingDetails, function (index, value) {
        var ispercentageval = $(value).find('#IsPercentage').attr('name');
        var oid = $(value).find('.taxandothers').val();

        if (oid != undefined) {
            DeliveryChallanOtherChargesMappingDetailsArray.push({
                PurchaseSaleOtherChargesMappingId: null,
                OtherChargesId: parseInt($(value).find('.taxandothers').val() == "" ? 0 : $(this).find('.taxandothers').val()),
                OtherChargesType: $(value).find('.taxandothers').attr('OtherChargesType'),
                IsPercentage: Boolean($("input[name='" + ispercentageval + "']:checked").val() == '1' ? true : false),
                Value: parseFloat($(value).find('.calculateinventoryvalue').val() == "" ? 0 : $(this).find('.calculateinventoryvalue').val()),
                OtherChargeValue: parseFloat($(value).find('.otherChargeValue').val() == "" ? 0 : $(this).find('.otherChargeValue').val()),
                ModuleId: EditDeliveryChallanId > 0 ? EditDeliveryChallanId : null,
            });
        }

    });



    formDataMultiple.append("DeliveryChallanDetailsStatic", JSON.stringify(DeliveryChallanDetailsStatic));
    formDataMultiple.append("DeliveryChallanProductMappingDetails", JSON.stringify(DeliveryChallanProductMappingDetailsArray));
    formDataMultiple.append("DeliveryChallanOtherChargesMappingDetails", JSON.stringify(DeliveryChallanOtherChargesMappingDetailsArray));
    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    $.ajax({
        type: "POST",
        url: "/DeliveryChallan/InsertUpdateDeliveryChallan",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: successCallback,
        error: handleError
    });

    //if (Estimatepopupform && EstimateStatusForm && productMappingDetails && taxdiscountothers) {

    //}
}
function handleDCSuccess(response) {
    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }

    if (data && data[0] && data[0][0] && typeof data[0][0].DeliveryChallanId !== 'undefined') {
        EditDeliveryChallanId = data[0][0].DeliveryChallanId > 0 ? data[0][0].DeliveryChallanId : 0;

    } else {
        EditDeliveryChallanId = 0;
    }
    $('#loader-pms').hide();
    Common.successMsg(response.message);
    /* Common.ClientRemoveValidation();*/
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);
    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: franchiseId };

    Common.ajaxCall("GET", "/DeliveryChallan/GetDC", EditDataId, DCSuccess, null);
    $('#DeliveryChallanModal').hide();

    var type = 'others';
    ResetDataDetails(type);
}
function handleDCError(response) {
    let message = 'An error occurred.';
    if (response && response.message) {
        message = response.message;
    }
    $('#loader-pms').hide();
    Common.errorMsg(message);
}

/* =================================== NOT NULL GET ================================================ */
$('#DCData').on('click', '.btn-edit', function () {
    $('#loader-pms').show();

    EditDeliveryChallanId = $(this).data('id');
    $('#appendContainer').empty();
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    editDeliverychallan(EditDeliveryChallanId, FranchiseMappingId);
});

function editDeliverychallan(EditDeliveryChallanId, FranchiseMappingId) {

    var EditDataId = { ModuleName: "DeliveryChallan", ModuleId: EditDeliveryChallanId };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, StatusSuccess, null);
    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);


    $("#DCSaveBtn span:first").text("Update");
    $("#btnPrintDC span:first").text("Update & Print");
    $("#btnPreviewDc span:first").text("Update & Preview");
    $('.Status-Div').show();
    $('#DeliveryChallanModal').show();
    $("#DeliveryChallanModal .modal-body").animate({ scrollTop: 0 }, "fast");

    var EditDataId = { ModuleName: "DeliveryChallan", ModuleId: EditDeliveryChallanId };
    Common.ajaxCall("GET", "/Common/ActivityHistoryDetails", EditDataId, Inventory.StatusActivity, null);

    var EditDataId = { DeliveryChallanId: EditDeliveryChallanId, FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/DeliveryChallan/NotNullGetDeliveryChallan", EditDataId, DeliveryChallanGetNotNull, null);


}

async function DeliveryChallanGetNotNull(response) {

    disableChangeEvent = true;
    formDataMultiple = new FormData();

    if (response.status) {

        const data = JSON.parse(response.data);
        const ClientId = data[1][0].ClientId;
        var eid = parseInt(data[1][0].EstimateId);
        var dcstatus = parseInt(data[1][0].DeliveryChallanStatusId);


        BillingAddressDivOpen();

        if (ClientId) {
            /*loadEstimateAndDeliveryChallan(ClientId, data);*/
            const moduleName = ["Estimate"];
            Common.ajaxCall("GET", "/Sale/GetEstimateDetails_ByClientId", { moduleName: "Estimate", ClientId: ClientId }, function (response) {
                Common.bindParentDropDownSuccessForChosen(response.data, 'EstimateId', 'DeliveryChallanColumn');


                setTimeout(() => {
                    $("#DeliveryChallanStatusId").val(dcstatus).trigger('change');
                    if (eid > 0) {  
                        $("#EstimateId").val(eid).trigger('change');
                    }

                    disableChangeEvent = false;
                    AutoGenerateFlag = false;
                    $('#loader-pms').hide();
                }, 500);
            }, null);

        }else {
            clearDropDowns();
        }

        bindDCDetails(data);
        Inventory.ClientAddressBind();
        var tablebody = $('#DCProductTablebody');
        var mainTable = $('#DCProductTable');

        Inventory.bindSaleProducts(data[0], tablebody, mainTable, null);

        $('#dynamicBindRow').empty('');

        Inventory.bindOtherCharges(data[2]);

        $('#selectedFiles, #ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();
        Inventory.bindAttachments(data[3]);

        Inventory.toggleField(data[1][0].Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable");
        Inventory.toggleField(data[1][0].TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
        Inventory.toggleFieldForAttachment(data[3][0].AttachmentId, "#AddAttachLable", "#AddAttachment");

        Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
        calculateBalance();

       
    }
}

async function bindDCDetails(data) {

    const poData = data[1][0];
    EditDeliveryChallanId = poData.DeliveryChallanId;

    $('#ViewBankLable').hide();
    disableChangeEvent = true;

    var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(poData.ClientId));
    if (responseData1 !== null) {
        Inventory.ClientAddressDetails(responseData1);
    }
    AutoGenerateFlag = true;
    $("#DeliveryChallanStatusId option").each(function () {
        if ($(this).val() !== "" && $(this).val() < data[1][0].DeliveryChallanStatusId) {
            $(this).remove();
        }
    });
    $('#AlternativeCompanyAddress').val(poData.BillingFranchiseId).trigger('change');

    $("#ClientId").val(poData.ClientId).trigger('change');
    $('#DeliveryChallanNumber').val(poData.DeliveryChallanNo);
    $('#DeliveryChallanDate').val(extractDate(poData.DeliveryChallanDate));
    $('#ReferenceNumber').val(poData.ReferenceNo);
    $('#EstimateDate').val(extractDate(poData.EstimateDate));
    $('#BillFrom').val(poData.BillFromFranchiseId).trigger('change');

    const challanTypeMap = {
        "Job Work": 1,
        "Supply on Approval": 2,
        "Others": 3
    };

    var EstimateId = $('#EstimateId').val(poData.EstimateId);
    EstimateId = EstimateId > 0 ? EstimateId : $('#EstimateId').empty().append('<option value="">-- Select --</option>');
    $("#ChallanType").val(challanTypeMap[poData.ChallanType]);

    $("#Subtotal").val(poData.SubTotal);
    $("#GrantTotal").val(poData.GrantTotal);
    $("#roundOff").css("color", getColorForRoundOff(poData.RoundOffValue));
    $("#DeliveryChallanStatusId").val(data[1][0].DeliveryChallanStatusId).trigger('change');
}
async function loadEstimateAndDeliveryChallan(ClientId, data) {

    const moduleName = ["Estimate"];

    for (let module of moduleName) {
        const responseData = await Common.getAsycData(`/Sale/GetEstimateDetails_ByClientId?moduleName=${module}&ClientId=${parseInt(ClientId)}`);
        if (responseData) {
            Common.bindParentDropDownSuccess(responseData, 'EstimateId', 'DeliveryChallanColumn');
        }
    }
}

function clearDropDowns() {
    $('#EstimateId').empty().append('<option value="0">--Select--</option>');
}
function getColorForBalance(balanceAmount) {
    return balanceAmount > 0 ? 'red' : balanceAmount < 0 ? 'orange' : 'green';
}
function getColorForRoundOff(roundOffValue) {
    return roundOffValue === 0 ? "orange" : roundOffValue > 0 ? "#4ce53d" : "red";
}

/* ====================================== Common Function ================================ */
$(document).on('click', '#AddNotesLable', function () {
    $('#AddNotes').show();
    $('#AddNotesLable').hide();
});
$(document).on('click', '#HideNotesLable', function () {
    $('#AddNotes').hide();
    $('#AddNotesLable').show();
});
$(document).on('click', '#AddTermsLable', function () {
    $('#AddTerms').show();
    $('#AddTermsLable').hide();
});
$(document).on('click', '#HideTermsLable', function () {
    $('#AddTerms').hide();
    $('#AddTermsLable').show();
});
$(document).on('click', '#AddAttachLable', function () {
    $('#AddAttachment').show();
    $('#AddAttachLable').hide();
});
$(document).on('click', '#HideAttachlable', function () {
    $('#AddAttachment').hide();
    $('#AddAttachLable').show();
});
function extractDate(inputDate) {

    if (inputDate != null) {
        // Split the input date string by 'T'
        var parts = inputDate.split('T');

        // The date part will be in parts[0]
        var datePart = parts[0];

        return datePart;
    }

}
function BillingAddressDivOpen() {

    $("#AddVendorlableColumn").hide();

    $('#ClientColumn').show();
    $('#BillFromColumn').show();
    $('#ShippingColumn').show();

    $('#DeliveryChallanColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-12').addClass('col-lg-4 col-md-12 col-sm-12 col-12');

    $('#InvoiceNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#ReferenceNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#InvoiceDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#ChallanTypeDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#EstimateDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#EstimateNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#GoodsDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');

}
function BillingAddressDivClose() {

    $("#AddVendorlableColumn").show();

    $('#ClientColumn').hide();
    $('#BillFromColumn').hide();
    $('#ShippingColumn').hide();

    $('#DeliveryChallanColumn').removeClass('col-lg-4 col-md-12 col-sm-12 col-12').addClass('col-lg-6 col-md-6 col-sm-6 col-12');
    $('#ReferenceNoDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');

    $('#InvoiceNoDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#InvoiceDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#ChallanTypeDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#EstimateDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#EstimateNoDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#GoodsDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');

}
function resetCommonData() {
    $('#PaidFrom, #PaidFromDueDate,#DeliveryChallanStatusId, #ModeOfPaymentId').val(null).trigger('change');
    $('#PaymenyTextBox,#discounttotal,#GSTtotal,#Subtotal, #GrantTotal, #roundOff,#PaidFromDays, #BalanceAmount').val('');

    $('#IsPartiallyPaid').prop('checked', false);
    $('#selectedFiles, #ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    $('#dynamicBindRow').empty('');
    $('#DCProductTable .ProductTableRow').remove();

    $('#appendContainer .input-group').slice(1).empty();
    $('#TermsAndCondition, #AddNotesText').val('');

    $('#AddAttachment').hide();
    $('#AddAttachLable').show();

    $('#AddNotes').hide();
    $('#AddNotesLable').show();

    $('#AddTerms').hide();
    $('#AddTermsLable').show();



}
function ResetDataDetails(type) {
    resetCommonData();

    if (type === 'Estimate') {
        $('#EstimateDate').val(null).trigger('change');
    }
    else if (type === 'empty') {

        $('#EstimateDate').val(null).trigger('change');
    } else if (type === 'Client') {
        $('#ReferenceNumber').val(null).trigger('change');
        $('#EstimateDate').val(null).trigger('change');
        $('#ChallanType').val();

    }
    else {
        $('#DeliveryChallanDate,#DeliveryChallanNumber,#ReferenceNumber,#EstimateDate, #EstimateId,#ClientId').val(null).trigger('change');
        $('#TermsAndCondition, #AddNotesText').val('');
        $("#BillFromAddress").text('');

    }
}

/* ================================== EstimateId change =========================================== */
$(document).on('change', '#EstimateId', async function () {
    if (disableChangeEvent) {
        return false;
    }

    var id = $(this).val();
    var moduleName = this.id === 'EstimateId' ? 'Estimate' : 'DeliveryChallan';
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());

    if (id !== "") {
        var url = `/PurchaseInvoice/GetPurchaseDetails_ByPurchaseId?PurchaseId=${id}&ModuleName=${moduleName}&FranchiseId=${franchiseId}`;

        var responseData = await Common.getAsycDataInventory(url);
        ResetDataDetails(moduleName);
        moduleName === 'Estimate' ? EstimateNumberDetails(responseData, moduleName) : DeliverychallanNumberDetails(responseData, moduleName);
    } else {
        ResetDataDetails('empty');
    }
});

function EstimateNumberDetails(response, type) {
    handleNumberDetails(response, type, '#EstimateDate');
}
function handleNumberDetails(response, type, dateField) {
    disableChangeEvent = true;
    formDataMultiple = new FormData();

    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[1].length > 0) {
            Common.bindData(data[0]);
            var poData = data[1][0];
            if (type === 'Estimate') {
                $(dateField).val(extractDate(poData.EstimateDate));
            }
        }
    }

    NumberDetailsBind(response);

    setTimeout(function () {
        disableChangeEvent = false;
    }, 500);
}
function NumberDetailsBind(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[1].length > 0) {

            var poData = data[1][0];
            BillingAddressDivOpen();
            $('#ViewBankLable').hide();

            $("#Subtotal").val(poData.SubTotal);
            $("#GrantTotal").val(poData.GrantTotal);

            Inventory.toggleField(poData.Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable");
            Inventory.toggleField(poData.TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");

            var roundOff = poData.RoundOffValue;

            const colorMap = roundOff === 0 ? "orange" : roundOff > 0 ? "#4ce53d" : "red";
            $("#roundOff").css("color", colorMap);

            $("#Subtotal").val(data[0][0].SubTotal);
            $("#GrantTotal").val(data[0][0].GrantTotal);

        }

        var tablebody = $('#DCProductTablebody');
        var mainTable = $('#DCProductTable');

        Inventory.bindSaleProducts(data[0], tablebody, mainTable, null);

        $('#dynamicBindRow').empty('');
        Inventory.bindOtherCharges(data[2]);

        $('#selectedFiles, #ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();
        Inventory.bindAttachments(data[3]);



    }

    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();

}

/* ============================================ M A I L ======================================= */
$(document).on('click', '#closeMail', function () {
    $("#SendMail").modal('hide');
    editDeliverychallan(EditDeliveryChallanId);
});
$(document).on('click', '#DCMailBtn', function () {


    $('#loader-pms').show();
    $("#AttachmentArea").html('');

    $("#EmailDetails #Subject").val('Delivery Challan');

    sendDCRequest(MailAttachmentSuccess);
});
$(document).on('click', '#SendButton', function () {
    $('#loader-pms').show();
    $('#SendButton').html('Sending...');
    Inventory.EmailSendbutton();
});
function MailAttachmentSuccess(response) {

    $('#loader-pms').show();
    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }


    if (data && data[0] && data[0][0] && typeof data[0][0].DeliveryChallanId !== 'undefined') {
        EditDeliveryChallanId = data[0][0].DeliveryChallanId > 0 ? data[0][0].DeliveryChallanId : 0;
    } else {
        EditDeliveryChallanId = 0;
    }


    var moduleId = EditDeliveryChallanId;


    if (moduleId > 0) {
        var EditDataId = { ModuleName: 'DeliveryChallan', ModuleId: moduleId };

        Common.ajaxCall("GET", "/Common/GetEmailToAddressDetails", EditDataId, GetEmailToAddress, $('#loader-pms').hide());
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

        var DeliveryChallanNumber = $('#DeliveryChallanNumber').val();
        var companyName = data[0][0].CompanyName;
        var ClientId = $('#ClientId option:selected').text();
        var DeliveryChallanDate = $('#DeliveryChallanDate').val();
        if (DeliveryChallanDate) {
            var dateParts = DeliveryChallanDate.split("-"); // Split by hyphen
            DeliveryChallanDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearrange to DD-MM-YYYY
        }
        var deliveryAddress = data[0][0].FullAddress;
        var yourFullName = data[0][0].Fullname;
        var yourPosition = data[0][0].UserGroupName;

        var emailBody = `
<div style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
    <div style="color: #007BFF; font-size: 16px;">
        Dear <strong>${ClientId}</strong>,
    </div>
    <p>Please find the attached Delivery Challan for the products you requested. Below are the details:</p>
    <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3>Delivery Challan Details</h3>
        <p><b>Delivery Challan Number:</b> ${DeliveryChallanNumber}</p>
        <p><b>Delivery Challan Date:</b> ${DeliveryChallanDate}</p>
        <p><b>Delivery Address:</b> ${deliveryAddress}</p>
    </div>
   
    <div style="margin-top: 20px; font-size: 14px;">
        <p>Thank you for choosing <strong>${companyName}</strong>. We look forward to continuing to serve you.</p>
        <p>Best regards,</p>
        <p style="font-weight:700;">${yourFullName},<br>${companyName}</p>
    </div>
</div>
`;

        $("#EmailDetails .note-editable").html(emailBody);

        printType = "Mail";
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditDeliveryChallanId),
            ContactId: parseInt($("#ClientId").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId

        };


        Common.ajaxCall("GET", "/DeliveryChallan/DCPrint", EditDataId, function (response) {
            Inventory.AttachmentPdfSuccess(response, "Delivery Challan.PDF");
        }, null);
    }
}

/*============================================PREVIEW & DOWNLOAD & PRINT =============================================================*/

$(document).on('click', '#btnPreviewDc, #btnPrintDC, #downloadLink', function () {

    printType = this.id === 'btnPreviewDc' ? 'Preview' :
        this.id === 'btnPrintDC' ? 'Print' : 'Download';

    $('#loader-pms').show();
    sendDCRequest(GetPreviewAndDownloadAddress);
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


        if (data && data[0] && data[0][0] && typeof data[0][0].DeliveryChallanId !== 'undefined') {
            EditDeliveryChallanId = data[0][0].DeliveryChallanId > 0 ? data[0][0].DeliveryChallanId : 0;
        } else {
            EditDeliveryChallanId = 0;
        }

        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditDeliveryChallanId),
            ContactId: parseInt($("#ClientId").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/DeliveryChallan/DCPrint',
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
                                              <head><title>Delivery Challan Preview</title></head>
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
                    link.download = 'Delivery challan.pdf';
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


//================================================================================WhatsApp Sending===========================================================================
$(document).on('click', '#DeliveryChallanWhatsAppBtn', function () {
    $('#SpinnerWhatsApp').show();
    sendDCRequest(GetWhatsAppDetails);
});

function GetWhatsAppDetails(response) {
    $('#SpinnerWhatsApp').show();

    formDataMultiple = new FormData();
    existFiles = [];

    if (response.status) {

        var data = JSON.parse(response.data);

        if (data && data[0] && data[0][0] && typeof data[0][0].DeliveryChallanId !== 'undefined') {
            EditDeliveryChallanId = data[0][0].DeliveryChallanId > 0 ? data[0][0].DeliveryChallanId : 0;

        } else {

            EditDeliveryChallanId = 0;

        }

        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditDeliveryChallanId),
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: "WhatsApp",
            FranchiseId: franchiseId

        };
        $.ajax({
            url: '/DeliveryChallan/DCPrint',
            method: 'GET',
            data: EditDataId,
            success: function (response) {

                $('#loader-pms').show();
                var moduleId = EditDeliveryChallanId;
                if (moduleId > 0) {
                    Common.ajaxCall("GET", "/Common/GetInventoryWhatsappDetails", { ModuleName: "DeliveryChallan", ModuleId: EditDeliveryChallanId, FilePath: response.data }, DataWhatsAppDetails, null);
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
        $("#ShareDropdown").hide();
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
        $('#btnPrintDC').click();
    }

    // Handling alt + v
    if (event.altKey && event.key === 'v') {
        event.preventDefault();
        $('#btnPreviewDc').click();
    }

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#DCSaveBtn').click();
    }

    // Handling alt + h
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        $('#btnshareDc').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#DCCancelBtn').click();
    }

});

$('#BankUpdateForm #UPIId').on('keypress', function (e) {
    if (e.which === 32) {
        return false;
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
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: franchiseId };

    Common.ajaxCall("GET", "/DeliveryChallan/GetDC", EditDataId, DCSuccess, null);
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
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: franchiseId };
        Common.ajaxCall("GET", "/DeliveryChallan/GetDC", EditDataId, DCSuccess, null);
    }
});

