var numberIncr = 0;
var disableChangeEvent = false;
var AutoGenerateFlag = false;
var formDataMultiple = new FormData();
var deletedFiles = [];
var existFiles = [];
var EditEstimateId = 0;
let selectedMOPs = new Set();
var backgroundColor, textColor;
var printType = "";
var PDFformat = "";
var StartDate;
var EndDate;

var selectedProductQuantity = [];
var selectedProductUnitId = [];
var selectedProductIdsList = [];

/* -------------------------- Initial Load Event -------------------------------------- */
$(document).ready(function () {
    $('#loader-pms').show();
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    Inventory.EmailValidationOnInputClient();
    Inventory.EmailValidationOnInputAlterAddress();

    $('#SpinnerWhatsApp').hide();



    /*--------------------Validation For Inputs---------------------------*/

    Common.setupValidation("#FormPaidBalance",
        { "PaidFrom": { required: true }, "PaidFromDays": { required: true }, "EstimateStatusId": { required: true } },
        { "PaidFrom": { required: "This field is required." }, "PaidFromDays": { required: "This field is required." }, "EstimateStatusId": { required: "This field is required." } }
    );

    Common.setupValidation("#frmtaxdiscountothers",
        { "taxandothers": { required: true } },
        { "taxandothers": { required: "This field is required." } }
    );

    Common.setupValidation("#frmtaxdiscountothers",
        { "taxandothers": { required: true } },
        { "taxandothers": { required: "This field is required." } }
    );



    /*--------------------Validation For Inputs---------------------------*/

    initializePage(FranchiseMappingId);
    $('.billtocolumn').hide();


    Common.bindDropDown('ClientId', 'Client');
    Common.bindDropDown('StateIdOFfCanvas', 'State');
    Common.bindDropDown('AlternativeCompanyAddress', 'UserFranchiseMapping');
    Common.bindDropDown('BillFrom', 'BillFrom');
     
    $('#VendorEdit').hide();

    $("#addPartialPayment").prop('disabled', false);

    $('#ClientColumn #ClientId,#TakeId,#AlternativeCompanyAddress').each(function () {
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

$("#EstimateDate").on("change", function () {
    var selectedPODate = $(this).val();
    $("#ValidDate").attr("min", selectedPODate);


    if ($("#ValidDate").val() < selectedPODate) {
        $("#ValidDate").val("");
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
    var EditDataId = { ModuleName: 'Estimate', FranchiseId: ShipId };

    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "EstimateNumber", "EstimateNo");
    });

});

async function initializePage(FranchiseMappingId) {

    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);
    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/Estimate/GetEstimate", EditDataId, EstimateSuccess, null);

    let MOPDropdownVal = await Common.bindDropDownSync('ModeOfPayment');
    Common.bindDropDownSuccess(MOPDropdownVal, 'ModeOfPaymentId');
    MOPDropdown = JSON.parse(MOPDropdownVal);

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#ShareDropdown').length && !target.closest('#btnshareEstimate').length) {
            $('#ShareDropdown').css('display', 'none');
        }
    });

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#OtherChargesDropDown').length && !target.closest('#OtherchargesAdd').length) {
            $('#OtherChargesDropDown').css('display', 'none');
        }
    }); 
}

function EstimateSuccess(response) {

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

        var columns = Common.bindColumn(data[1], ['EstimateId', 'Status_Color']);
        Common.bindTablePurchase('EstimateData', data[1], columns, -1, 'EstimateId', '330px', true, access);
        $('#loader-pms').hide();
    }
}

/* -------------------------- Header  DETAILS -------------------------------------- */
$(document).on('change', '#ClientColumn #ClientId', function () {
     
    if (disableChangeEvent) {
        return false;
    } 
    Inventory.ClientAddressBind();

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
    var tablebody = $('#EstimateProductTablebody');
    var mainTable = $('#EstimateProductTable');
    var moduleName = 'Sale';
    $('#loader-pms').show();
    Inventory.AddProductsToMainTable(AllProductTable, tablebody, mainTable, moduleName);
     
});

$(document).on('input', '#DisInput', function () {

    const row = $(this).closest('tr');
    var mainTable = $('#EstimateProductTable');
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
$(document).on('click', '.DynremoveBtn', function () {
    const row = $(this).closest('tr');
    let productId = row.data('product-id');
    var mainTable = $('#EstimateProductTable');
    Inventory.RemoveProductMainRow(row, productId, mainTable);

});
$(document).on('input', '.SellingPrice', function () {

    const row = $(this).closest('tr');
    var mainTable = $('#EstimateProductTable');
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

    var tablebody = $('#EstimateProductTablebody');
    var mainTable = $('#EstimateProductTable');

    let existingRow = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`);
    let existingRowFirst = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`).first();

    Inventory.QuantityInputChange(finalQTY, row, QtyUnitDropDown, data, productId, tablebody, mainTable, existingRow, existingRowFirst);
});


$(document).on('change', '.DiscountDropdown', function () {
    const row = $(this).closest('tr');
    var mainTable = $('#EstimateProductTable');
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
    let tableBody = $('#EstimateProductTablebody');
    var mainTable = $('#EstimateProductTable');
    Inventory.updateSellingPriceBasedOnUnitProductRow(selectedUnit, tableBody, rowElement, productData, mainTable);
});

$(document).on('click', '#AddItemBtn', function () {
    $('#loader-pms').show();
    var mainTable = $("EstimateProductTable");
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var moduleName = 'Sale';
   
    var ClientId = $('#ClientColumn #ClientId').val();
    if (ClientId) {
        $('#AddProductModal').show();
        //Inventory.AllProductTable(mainTable, moduleName, null, FranchiseMappingId);

        var EditDataId = { ModuleName: moduleName, VendorId: null, FranchiseId: FranchiseMappingId };
        GetProductItem(EditDataId, mainTable);

        $('#tableFilter1').val(''); 
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

/* ================================== CRUD Function  ================================= ============ */
$(document).on('click', '#customBtn_EstimateData', function () {
    Common.ClientRemoveValidation();
    Common.removevalidation('FormBillFrom');
    Common.removevalidation('FormStatus');
    BillingAddressDivClose();
    $('#EstimateModal').show();
    $('.Status-Div').hide();
    $("#EstimateModal .modal-body").animate({ scrollTop: 0 }, "fast");

    $('#SendEmail').show();
    EditEstimateId = 0;
    Common.SetMaxDate('#EstimateDate');
    var selectedPODate = $('#EstimateDate').val();
    $("#ValidDate").attr("min", selectedPODate);
    if ($("#ValidDate").val() < selectedPODate) {
        $("#ValidDate").val("");
    }

    var EditDataId = { ModuleName: "Estimate", ModuleId: null };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, StatusSuccess, null);

    $("#EstimateSaveBtn span:first").text("Save");
    $("#btnPrintEstimate span:first").text("Save & Print");
    $("#btnPreviewEstimate span:first").text("Save & Preview");


    $('#ClientColumn').hide();
    $('#ShippingColumn').hide();
    $('#AddAttachment').hide();
    $('#ViewBankLable').hide();
    $('#AlternativeCompanyAddress').val('').trigger('change');
 
});
function StatusSuccess(response) {
    var id = "EstimateStatusId";
    Common.bindDropDownSuccess(response.data, id);
}
$(document).on('click', '#AddVendorLable', function () {
    BillingAddressDivOpen();
});

$(document).on('click', '#EstimateCancelBtn,#EstimateClose', function () {

    $('#EstimateModal').hide();
    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/Estimate/GetEstimate", EditDataId, EstimateSuccess, null);
    Common.ClientRemoveValidation();
    var type = 'others';
    ResetDataDetails(type);
});
$(document).on('click', '#EstimateData .btn-delete', async function () {

    var response = await Common.askConfirmation();
    if (response == true) {
        Common.successMsg("Deleted Successfully.");
    //    var EstimateId = $(this).data('id');
    //    Common.ajaxCall("GET", "/Estimate/DeleteEstimateDetails", { EstimateId: EstimateId }, EstimateReload, null);
    }
});
$(document).on('click', '#EstimateSaveBtn', function () {
    sendEstimateRequest(handleEstimateSuccess, handleEstimateError);
});
$(document).on('click', '#btnCancelSale', function () {
    var type = "other";
    ResetDataDetails(type);
    Common.ajaxCall("GET", "/Sale/GetSale", null, SaleSuccess, null);
    $('#SalePopUp').hide();
    $('#Mainpage-inner').show();
    BillingAddressDivClose();
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
$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Estimate",
        ModuleRefId: parseInt(moduleRefId),
        AttachmentFileName: fileText,
        AttachmentFilePath: src
    });
    $(listItem).remove();
});
function EstimateReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        var formattedStartDate = formatDateForSQL(StartDate);
        var formattedEndDate = formatDateForSQL(EndDate);
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: franchiseId };
        Common.ajaxCall("GET", "/Estimate/GetEstimate", EditDataId, EstimateSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

function sendEstimateRequest(successCallback, handleError) {

    getExistFiles();

    var ClientFormIsValid = $('#FormClient').validate().form();
    var ShippingFormIsValid = $('#FormShipping').validate().form();
    var RightSideHeaderFormIsValid = $('#FormRightSideHeader').validate().form();
    var taxdiscountFormIsValid = $('#frmtaxdiscountothers').validate().form();
    var StatusFormIsValid = $('#FormStatus').validate().form();
    var BillFromIsValid = $("#FormBillFrom").validate().form();

    if (!ClientFormIsValid || !ShippingFormIsValid || !RightSideHeaderFormIsValid || !taxdiscountFormIsValid || !StatusFormIsValid || !BillFromIsValid) {
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
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    $('#loader-pms').show();

    var EstimateDateString = $('#EstimateDate').val();
    var EstimateDate = new Date(EstimateDateString);

    var ValidDateString = $('#ValidDate').val();
    var ValidDate = new Date(ValidDateString);
    var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();
    var EstimateDetailsStatic = {
        EstimateId: EditEstimateId > 0 ? EditEstimateId : null,
        EstimateNo: $('#EstimateNumber').val(),
        ClientId: parseInt($('#ClientId').val()),
        BillingFranchiseId: parseInt(alternativeCompanyAddress),
        FranchiseId: franchiseId,
        BillFromFranchiseId: parseInt($('#BillFrom').val()),
        EstimateDate: EstimateDate,
        SubTotal: parseFloat($('#Subtotal').val()),
        GrantTotal: parseFloat($('#GrantTotal').val()),
        RoundOffValue: parseFloat($('#roundOff').val()),
        EstimateStatusId: $('#EstimateStatusId').val(),
        TermsAndCondition: $('#TermsAndCondition').val() || null,
        ValidDate: ValidDate,
        Notes: $('#AddNotesText').val() || null,

    };

    var EstimateProductMappingDetailsArray = [];

    $('#EstimateProductTablebody .ProductTableRow').each(function () {
        var $rowTable = $(this);
        var productId = $rowTable.data('product-id');

        EstimateProductMappingDetailsArray.push({
            SaleProductMappingId: null,
            ProductId: parseInt(productId),
            SellingPrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()),
            Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val() || 0),
            UnitId: parseInt($rowTable.find('.QtyUnitDropDown').val()),
            ProductDescription: $rowTable.find('.descriptiontdtext').val(),
            Discount: Common.parseFloatValue($rowTable.find('#DisInput').val()) || null,
            GstPercentage: Common.parseFloatValue($rowTable.find('#GSTInput').val()) || null,
            TotalAmount: Common.parseFloatValue($rowTable.find('.Totalamount-cell').text()),
            ModuleId: EditEstimateId > 0 ? EditEstimateId : null,

        });

    });

    var EstimateOtherChargesMappingDetailsArray = [];
    var EstimateOtherChargesMappingDetails = $("#dynamicBindRow .dynamicBindRow");

    $.each(EstimateOtherChargesMappingDetails, function (index, value) {
        var ispercentageval = $(value).find('#IsPercentage').attr('name');
        var oid = $(value).find('.taxandothers').val();

        if (oid != undefined) {
            EstimateOtherChargesMappingDetailsArray.push({
                PurchaseSaleOtherChargesMappingId: null,
                OtherChargesId: parseInt($(value).find('.taxandothers').val() == "" ? 0 : $(this).find('.taxandothers').val()),
                OtherChargesType: $(value).find('.taxandothers').attr('OtherChargesType'),
                IsPercentage: Boolean($("input[name='" + ispercentageval + "']:checked").val() == '1' ? true : false),
                Value: parseFloat($(value).find('.calculateinventoryvalue').val() == "" ? 0 : $(this).find('.calculateinventoryvalue').val()),
                OtherChargeValue: parseFloat($(value).find('.otherChargeValue').val() == "" ? 0 : $(this).find('.otherChargeValue').val()),
                ModuleId: EditEstimateId > 0 ? EditEstimateId : null,
            });
        }

    });



    formDataMultiple.append("EstimateDetailsStatic", JSON.stringify(EstimateDetailsStatic));
    formDataMultiple.append("EstimateProductMappingDetails", JSON.stringify(EstimateProductMappingDetailsArray));
    formDataMultiple.append("EstimateOtherChargesMappingDetails", JSON.stringify(EstimateOtherChargesMappingDetailsArray));
    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    $.ajax({
        type: "POST",
        url: "/Estimate/InsertUpdateEstimate",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: successCallback,
        error: handleError
    });

}
function handleEstimateSuccess(response) {
    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }

    if (data && data[0] && data[0][0] && typeof data[0][0].EstimateId !== 'undefined') {
        EditEstimateId = data[0][0].EstimateId > 0 ? data[0][0].EstimateId : 0;

    } else {
        EditEstimateId = 0;
    }
    $('#loader-pms').hide();
    Common.successMsg(response.message);
    Common.ClientRemoveValidation();
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    var formattedStartDate = formatDateForSQL(StartDate);
    var formattedEndDate = formatDateForSQL(EndDate);
    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: franchiseId };
    Common.ajaxCall("GET", "/Estimate/GetEstimate", EditDataId, EstimateSuccess, null);
    $('#EstimateModal').hide();

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    var type = 'others';
    ResetDataDetails(type);

}
function handleEstimateError(response) {
    let message = 'An error occurred.';
    if (response && response.message) {
        message = response.message;
    }
    $('#loader-pms').hide();
    Common.errorMsg(message);
}
function handleError(response) {
    let message = 'An error occurred.';


    if (response && response.message) {
        message = response.message;
    }
    $('#loader-pms').hide();
    Common.errorMsg(message);
}
function getExistFiles() {
    existFiles = [];
    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "Estimate",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

/*====================================== NOT NULL GET =================================================*/
$('#EstimateData').on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    EditEstimateId = $(this).data('id');
    editEstimate(EditEstimateId);
});
function editEstimate(EditEstimateId) {

    $("#EstimateSaveBtn span:first").text("Update");
    $("#btnPrintEstimate span:first").text("Update & Print");
    $("#btnPreviewEstimate span:first").text("Update & Preview");
    $('.Status-Div').show();
    $('#EstimateModal').show();
    $("#EstimateModal .modal-body").animate({ scrollTop: 0 }, "fast");
    var EditDataId = { ModuleName: "Estimate", ModuleId: EditEstimateId };
    Common.ajaxCall("GET", "/Common/ActivityHistoryDetails", EditDataId, Inventory.StatusActivity, null);

    var EditDataId = { ModuleName: "Estimate", ModuleId: EditEstimateId };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, StatusSuccess, null);

    var EditDataId = { EstimateId: EditEstimateId, FranchiseId: null };
    Common.ajaxCall("GET", "/Estimate/NotNullGetEstimate", EditDataId, EstimateGetNotNull, null);
}
async function EstimateGetNotNull(response) {

    disableChangeEvent = true;
    formDataMultiple = new FormData();

    if (response.status) {
        var data = JSON.parse(response.data);

        if (data[1].length > 0) {
            Common.bindData(data[0]);
            var poData = data[1][0];
            EditEstimateId = poData.EstimateId;
            AutoGenerateFlag = true;
            $("#EstimateStatusId option").each(function () {
                if ($(this).val() !== "" && $(this).val() < poData.EstimateStatusId) {
                    $(this).remove();
                }
            });
            $('#EstimateDate').val(extractDate(poData.EstimateDate));
            $('#ValidDate').val(extractDate(poData.ValidDate));
            $('#AlternativeCompanyAddress').val(poData.BillingFranchiseId).trigger('change');
            $('#EstimateNumber').val(poData.EstimateNo);
            $("#EstimateStatusId").val(poData.EstimateStatusId).trigger('change');
            $("#Subtotal").val(poData.SubTotal);
            $("#GrantTotal").val(poData.GrantTotal);
            $('#BillFrom').val(poData.BillFromFranchiseId).trigger('change');
            disableChangeEvent = true;
            $("#ClientId").val(poData.ClientId).trigger('change');


            var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(poData.ClientId));
            if (responseData1 !== null) {
                Inventory.ClientAddressDetails(responseData1);
            }

            $('#BalanceAmount').val(poData.BalanceAmount).css('color', poData.BalanceAmount > 0 ? 'red' : poData.BalanceAmount < 0 ? 'orange' : 'green');

            Inventory.toggleField(poData.Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable");
            Inventory.toggleField(poData.TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
            Inventory.toggleFieldForAttachment(data[3][0].AttachmentId, "#AddAttachLable", "#AddAttachment");

            $("#ViewBankLable").hide();

            var roundOff = poData.RoundOffValue;

            const colorMap = roundOff === 0 ? "orange" : roundOff > 0 ? "#4ce53d" : "red";
            $("#roundOff").css("color", colorMap);

            $('#VendorEdit').show();
            $('#ShippingEdit').hide();
        }

        var tablebody = $('#EstimateProductTablebody');
        var mainTable = $('#EstimateProductTable');

        Inventory.bindSaleProducts(data[0], tablebody, mainTable,null);

        $('#dynamicBindRow').empty('');
        Inventory.bindOtherCharges(data[2]);

        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();
        Inventory.bindAttachments(data[3]);
    }

    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();

    BillingAddressDivOpen();


    setTimeout(function () {
        disableChangeEvent = false;
        AutoGenerateFlag = false;
        $('#loader-pms').hide();
    }, 500);
}

/* ===================================== Common  FUNCTION =========================================== */
$(document).on('click', '#AddNotesLable', function () {
    $('#AddNotes').show();
    $("#AddNotesLable").hide();
});
$(document).on('click', '#HideNotesLable', function () {
    $('#AddNotes').hide();
    $("#AddNotesLable").show();
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
function BillingAddressDivOpen() {

    $('#AddClientlableColumn').hide();
    $('#ClientColumn').show();
    $('#BillFromColumn').show();
    $('#ShippingColumn').show();
    $('.billtocolumn').show();

    $('#AddClientlableColumn').removeClass('d-flex justify-content-center');
    $('#EstimateColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-12').addClass('col-lg-4 col-md-12 col-sm-12 col-12');

    $('#EstimateNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');

    $('#EstimateNumberDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#EstimateDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#validDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
}

function BillingAddressDivClose() {

    $('#AddClientlableColumn').show();
    $('#ClientColumn').hide();
    $('#BillFromColumn').hide();
    $('#ShippingColumn').hide();
    $('.billtocolumn').hide();
    $('#AddClientlableColumn').removeClass('d-flex justify-content-center');
    $('#EstimateColumn').addClass('col-lg-6 col-md-6 col-sm-6 col-12').removeClass('col-lg-4 col-md-12 col-sm-12 col-12');

    $('#EstimateNoDiv').addClass('col-lg-6 col-md-6 col-sm-6 col-6').removeClass('col-lg-4 col-md-6 col-sm-6 col-6');

    $('#EstimateNumberDiv').addClass('col-lg-6 col-md-6 col-sm-6 col-6').removeClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#EstimateDateDiv').addClass('col-lg-6 col-md-6 col-sm-6 col-6').removeClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#validDateDiv').addClass('col-lg-6 col-md-6 col-sm-6 col-6').removeClass('col-lg-4 col-md-6 col-sm-6 col-6');
}

function setFormattedDate(dateString, elementId) {

    if (dateString && dateString.trim() !== "") {
        var dateComponents = dateString.split("-");
        var day = dateComponents[0];
        var month = dateComponents[1];
        var year = dateComponents[2];

        var formattedDate = day + "-" + month + "-" + year;
        $('#' + elementId).val(formattedDate);
    }
}
function extractDate(inputDate) {
    // Split the input date string by 'T'
    var parts = inputDate.split('T');

    // The date part will be in parts[0]
    var datePart = parts[0];

    return datePart;
}
function ResetDataDetails(type) {
    if (type === 'Client') {


        $('#ValidDate').val(null).trigger('change');
        $('#ValidValue').val('');

        $('#discounttotal').val('');
        $('#GstTotal').val('');
        $('#CESSTotal').val('');
        $('#StateCESSTotal').val('');
        $('#Subtotal').val('');


       
        $('#GrantTotal').val('');
        $('#roundOff').val('');
        $('#BalanceAmount').val('');
        $('#EstimateStatusId').val(null).trigger('change');

        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();


        $('#AddAttachment').hide();

        $('#AddAttachLable').show();
        $('#AddNotes').hide();
        $('#AddNotesLable').show();

        $('#AddTerms').hide();
        $('#AddTermsLable').show();


        $('#EstimateProductTable .ProductTableRow').remove();
        $('#dynamicBindRow').empty('');
        $('#appendContainer .input-group').slice(1).empty();


    } else {
        $('#ClientId').val(null).trigger('change');
        $('#Check').prop('checked', false);
        $('#EstimateNumber').val(null).trigger('change');
        $('#EstimateDate').val(null).trigger('change');
        $('#AddClientlableColumn').show();
        $('#ClientColumn').hide();
        $('#ShippingColumn').hide();
        $('#Notes').val('');
        $('#TermsAndCondition').val('');

        $('#AddNotes').hide();
        $('#AddNotesLable').show();

        $('#AddTerms').hide();
        $('#AddTermsLable').show();
        $("#BillFromAddress").text('');
    }

}

/* ==================================== CLIENT DROPDOWN ================================================= */
function AddClientDropdown() {

    Common.handleDropdown('#ClientId', '+ Add New Client', '');
    Common.bindDropDown('ClientTypeId', 'ClientType')

}
function AddAliasDropdown() {
    Common.handleDropdown('#AliasName', '+ Add Addresss', '');
}
function AddProduct() {
    Common.handleDropdown('.Product', '+ Add New Product', '');
}

/* ================================================ M A I L ============================================ */
$(document).on('click', '#closeMail', function () {
    $("#SendMail").modal('hide');
    editEstimate(EditEstimateId);
});
$(document).on('click', '#EstimateMailBtn', function () {

    $('#loader-pms').show();
    $("#AttachmentArea").html('');

    $("#EmailDetails #Subject").val('Estimate');

    sendEstimateRequest(MailAttachmentEstimateSuccess);
});
$(document).on('click', '#SendButton', function () {
    $('#loader-pms').show();
    $('#SendButton').html('Sending...');


    Inventory.EmailSendbutton();

});
function MailAttachmentEstimateSuccess(response) {

    $('#loader-pms').show();
    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }


    if (data && data[0] && data[0][0] && typeof data[0][0].EstimateId !== 'undefined') {
        EditEstimateId = data[0][0].EstimateId > 0 ? data[0][0].EstimateId : 0;
    } else {
        EditEstimateId = 0;
    }


    if (EditEstimateId > 0) {
        var EditDataId = { ModuleName: 'Estimate', ModuleId: EditEstimateId };

        Common.ajaxCall("GET", "/Common/GetEmailToAddressDetails", EditDataId, GetEmailToAddress, $('.backdrop').hide());
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

        var EstimateNo = $('#EstimateNo').val();
        var companyName = data[0][0].CompanyName;
        var ClientId = $('#ClientId option:selected').text();
        var EstimateDate = $('#EstimateDate').val();
        if (EstimateDate) {
            var dateParts = EstimateDate.split("-"); // Split by hyphen
            EstimateDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearrange to DD-MM-YYYY
        }
        var deliveryAddress = data[0][0].FullAddress;
        var yourFullName = data[0][0].Fullname;
        var yourPosition = data[0][0].UserGroupName;

        var emailBody = `
<div style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
    <div style="color: #007BFF; font-size: 16px;">
        Dear <strong>${ClientId}</strong>,
    </div>
    <p>Please find the attached quotation for the products you requested.</p>
    <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3>Estimate Details</h3>
        <p><b>Estimate Number:</b> ${EstimateNo}</p>
        <p><b>Estimate Date:</b> ${EstimateDate}</p>
        <p><b>Delivery Address:</b> ${deliveryAddress}</p>
    </div>
   
    <div style="margin-top: 20px; font-size: 14px;">
    
        <p>Thank you for choosing <strong>${companyName}</strong>. We look forward to serving you.</p>

        <p>Best regards,</p>
        <p style="font-weight:700;">${yourFullName},<br>${companyName}</p>
    </div>
</div>
`;

        $("#EmailDetails .note-editable").html(emailBody);
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        printType = "Mail";
        var EditDataId = {
            ModuleId: parseInt(EditEstimateId),
            ContactId: parseInt($("#ClientId").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };

        Common.ajaxCall("GET", "/Estimate/EstimatePrint", EditDataId, function (response) {
            Inventory.AttachmentPdfSuccess(response, "Estimate.PDF");
        }, null);
    }
}


/*============================================PREVIEW & DOWNLOAD & PRINT =============================================================*/

$(document).on('click', '#btnPreviewEstimate, #btnPrintEstimate, #downloadLink', function () {



    printType = this.id === 'btnPreviewEstimate' ? 'Preview' :
        this.id === 'btnPrintEstimate' ? 'Print' : 'Download';

    $('#loader-pms').show();
    sendEstimateRequest(GetPreviewAndDownloadAddress);
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


        if (data && data[0] && data[0][0] && typeof data[0][0].EstimateId !== 'undefined') {
            EditEstimateId = data[0][0].EstimateId > 0 ? data[0][0].EstimateId : 0;
        } else {
            EditEstimateId = 0;
        }
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());

        var EditDataId = {
            ModuleId: parseInt(EditEstimateId),
            ContactId: parseInt($("#ClientId").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/Estimate/EstimatePrint',
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
                                              <head><title>Estimate Preview</title></head>
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
                    link.download = 'Estimate.pdf';
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
$(document).on('click', '#EstimateWhatsAppBtn', function () {
    sendEstimateRequest(GetWhatsAppDetails);
});

function GetWhatsAppDetails(response) {
    $('#SpinnerWhatsApp').show();

    formDataMultiple = new FormData();
    existFiles = [];

    if (response.status) {

        var data = JSON.parse(response.data);

        if (data && data[0] && data[0][0] && typeof data[0][0].EstimateId !== 'undefined') {
            EditEstimateId = data[0][0].EstimateId > 0 ? data[0][0].EstimateId : 0;

        } else {

            EditEstimateId = 0;

        }
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditEstimateId),
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: "WhatsApp",
            FranchiseId: franchiseId

        };
        $.ajax({
            url: '/Estimate/EstimatePrint',
            method: 'GET',
            data: EditDataId,
            success: function (response) {

                $('#loader-pms').show();
                var moduleId = EditEstimateId;
                if (moduleId > 0) {
                    Common.ajaxCall("GET", "/Common/GetInventoryWhatsappDetails", { ModuleName: "Estimate", ModuleId: EditEstimateId, FilePath: response.data }, DataWhatsAppDetails, null);
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
        $('#btnPrintEstimate').click();
    }

    // Handling alt + v
    if (event.altKey && event.key === 'v') {
        event.preventDefault();
        $('#btnPreviewEstimate').click();
    }

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#EstimateSaveBtn').click();
    }

    // Handling alt + h
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        $('#btnshareEstimate').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#EstimateCancelBtn').click();
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

    Common.ajaxCall("GET", "/Estimate/GetEstimate", EditDataId, EstimateSuccess, null);
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
        Common.ajaxCall("GET", "/Estimate/GetEstimate", EditDataId, EstimateSuccess, null);
    }
});

function GetProductItem(EditDataId, mainTable) {
    Common.ajaxCall("GET", "/Estimate/GetEstimateProduct", EditDataId, function (response) {
        if (response.status) {
            var datas = JSON.parse(response.data);
            var datas = JSON.parse(response.data, function (key, value) {
                if (key === 'PrimaryPrice') {
                    if (value === Math.floor(value)) {
                        return value + ".00";
                    } else {
                        return parseFloat(value.toFixed(2));
                    }
                }
                return value;
            });
            var data = datas[0];

            if (data[0].ProductId != null && data.length > 0) {
                let productData = data;

                productData.forEach(function (product) {
                    if (selectedProductIdsList.includes(product.ProductId)) {
                        return;
                    }
                    var newRow = `
                        <tr Class="AllProductRow" data-product-id="${product.ProductId}" data-product-info='${JSON.stringify(product)}'>
                            <td>
                                <div class="d-flex">
                                    <input class="mr-2" type="checkbox" aria-label="Select Item">
                                    <label>${product.ProductName || '-'}</label>
                                </div>
                            </td>
   
                            <td><label class="SellingPrice">${product.PrimaryPrice || '–'}</label></td>
                            <td style="display:none;"><label>${product.SecondaryPrice}</label></td>
                             <td class="remaining-stock"><label>${product.StockInHand || '0'}</label></td>

                            <td style="width:16%">
                                     <button type="button" class="btn btn-custom addQtyBtn">+ Add</button>
                                       <div class="align-items-center OtyColumn d-none">
                                        <div class="d-flex align-items-center qty-wrapper">
                                         <div class="qty-group">
                                            <button type="button" class="btn btn-primary RowMinus qty-btn qty-decrease">-</button>
                                             <input type="Number" class="form-control text-center qty-input QtyProductAdd" value="1" min="1">
                                             <button type="button" class="btn btn-primary RowPlus qty-btn qty-increase">+</button>
                                          </div>

                                        <div class="input-group-append">
                                           
                                             <span id="unitDropdownContainer" class="unit-dropdown ">
                                       
                                             </span>
                                        </div>
            
                                    </div>
                                </div>
                            </td>
                          
                        </tr>
                    `;

                    $('#product-table-body').append(newRow);

                    if ($('#product-table-body').children('tr').length === 1) {
                        $('.AllProductEmptyRow').show();
                    } else {
                        $('.AllProductEmptyRow').hide();
                    }

                    let $unitDropdownContainer = $('#product-table-body tr').last().find('#unitDropdownContainer');
                    let Nrow = $('#product-table-body tr').last();

                    var $select = $('<select class="additemdrop unit-select"></select>');
                    if (product.PrimaryUnitId && product.SecondaryUnitId) {

                        $select.append($('<option></option>').val(product.PrimaryUnitId).text(product.PrimaryUnitName));
                        $select.append($('<option></option>').val(product.SecondaryUnitId).text(product.SecondaryUnitName));
                    } else if (product.PrimaryUnitId) {

                        $select.append($('<option></option>').val(product.PrimaryUnitId).text(product.PrimaryUnitName));
                    }

                    $unitDropdownContainer.append($select);
                    let selectedUnit = parseInt(Nrow.find('.additemdrop').val());
                    const Data = Nrow.data('product-info');
                    Inventory.updateSellingPriceBasedOnUnit(selectedUnit, Nrow, Data, mainTable);

                    $('#loader-pms').hide();
                });
            } else {

                if ($('#product-table-body').children('tr').length === 1) {
                    $('.AllProductEmptyRow').show();
                } else {
                    $('.AllProductEmptyRow').hide();
                }
            }
            $('#loader-pms').hide();
        } else {
            console.error('Error fetching products: ', error);
            $('#loader-pms').hide();
        }
    }, null);

    $('#Category,#Brand').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });
}