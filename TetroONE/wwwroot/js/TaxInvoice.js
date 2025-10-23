var EditSaleId = 0;
var disableChangeEvent = false;
var AutoGenerateFlag = false;
var formDataMultiple = new FormData();
var deletedFiles = [];
var existFiles = [];
var backgroundColor, textColor;
let selectedMOPs = new Set();
var numberIncr = 1;
var printType = "";
var PDFformat = "";
var StartDate;
var EndDate;
var selectedProductQuantity = [];
var selectedProductUnitId = [];
var selectedProductIdsList = []
var IsOutWard = 0;
var FranchiseMappingId = 0;

/* -------------------------- Initial Load Event -------------------------------------- */

$(document).ready(function () {
    $('#loader-pms').show();
    //$('#ForAliginment').hide();
    //$('#SaleDataShowing').show();
    ///*$('#QuickBillShowing').hide();*/
    //$(".Einvoicetable").hide();
    //$('.HideEinvoiceLable').hide();
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
   /* $('[data-toggle="tooltip"]').tooltip();*/
    /////////Email Validation////////
    Inventory.EmailValidationOnInputClient();
    Inventory.EmailValidationOnInputAlterAddress();

    Common.SetMinDate('#GoodsDeliveryDate');
    selectedProductIdsList = [];
    $('#SpinnerWhatsApp').hide();
    //$('.PartiallyPaidHide').hide();

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

   
    //============SET THE MIN DATE================//


    initializePage();

    $(document).on('change', '#ClientId', function () {
        // Common.removeerrormsg('VendorName');
        var value = $(this).val();
        if (value != "") {
            $(this).siblings('.error').remove();
        }
    });

    $(document).on('change', '.taxandothers ', function () {
        // Common.removeerrormsg('VendorName');
        var value = $(this).val();
        if (value != "") {
            $(this).siblings('.error').remove();
        }
    });

    $('.taxandothers').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent(),
        });
    });
    $('#EstimateId,#DCNo,#ClientId,#ShipToClientId,#TakeId,.Product,#AlternativeCompanyAddress').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });

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

            Inventory.updateGSTVisibility('#ClientPlaceOfSupply', '#StateName');
        }
    }, null);

    if (AutoGenerateFlag) {
        return false;
    }

    var ShipId = $('#ShippingColumn #AlternativeCompanyAddress').val();
    var EditDataId = { ModuleName: 'Sale', FranchiseId: ShipId };

    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "TaxInvoiceNumber", "SaleNo");
    });

   
});

//$("#InvoiceDate").on("change", function () {
//    var selectedPODate = $(this).val();
//    $("#GoodsDelDate").attr("min", selectedPODate);


//    if ($("#GoodsDelDate").val() < selectedPODate) {
//        $("#GoodsDelDate").val("");
//    }
//});

async function initializePage() {

    Common.bindDropDown('StateIdOFfCanvas', 'StateId');
    Common.bindDropDownParent('ClientId', 'ClientColumn', 'Client', null);
    Common.bindDropDown('AlternativeCompanyAddress', 'UserFranchiseMapping');
    $('#ShippingColumn #ShipToClientId').empty().append('<option value="">--Select--</option>').trigger('change');

    $("#addPartialPayment").prop('disabled', false);

    Common.bindDropDown('BillFrom', 'BillFrom');

    let MOPDropdownVal = await Common.bindDropDownSync('ModeOfPayment');
    Common.bindDropDownSuccess(MOPDropdownVal, 'ModeOfPaymentId');
    MOPDropdown = JSON.parse(MOPDropdownVal);

    //$('#DispatchFrom').empty().append('<option value="">--Select--</option>').prop('disabled', false); $("#DispatchName").text(''); $("#DispatchAddress").text(''); $("#DispatchCity").text(''); $("#DispatchPlaceOfSupply").text('');
    //$("#DispatchCountry").text(''); $("#DispatchEmail").text(''); $("#DispatchMobileNumber").text(''); $("#DispatchGSTNumber").text(''); $("#DispatchStateId").text('');

    //$("#DispatchAddressEdit").hide();

    $('#TaxInvoiceModal').hide();

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    var fnData = Common.getDateFilter('dateDisplay2');

    $('#AddAttachment').hide();

    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);

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
        Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);
    });

    $('#increment-month-btn2').click(function () {

        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);
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
            Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });
}

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

function SaleSuccess(response) {

    if (response.status) {

        $('#SaleDataShowing').show();
        /* $('#QuickBillShowing').hide();*/

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

        var columns = Common.bindColumn(data[1], ['SaleId', 'Status_Color']);
        Common.bindTablePurchase('SaleData', data[1], columns, -1, 'SaleId', '330px', true, access);
    }
}

function GridChange() {
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    $('#SaleDataShowing').show();
    /* $('#QuickBillShowing').hide();*/

    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);
}

/* -------------------- Header  ADDRESS DETAILS -------------------------------------- */
$(document).on('change', '#ClientColumn #ClientId', async function () {

    if (disableChangeEvent) {
        return false;
    }

    Inventory.ClientAddressBind();
    var clientId = $('#ClientId').val();
    var moduleName = "Estimate";
    var responseData = await Common.getAsycData(`/Sale/GetEstimateDetails_ByClientId?moduleName=${moduleName}&ClientId=${parseInt(clientId)}`);
    if (responseData != null) {
        Common.bindParentDropDownSuccessForChosen(responseData, 'EstimateId', 'TaxInvoiceColumn');
    }

    var moduleName = "DeliveryChallan";
    var responseData2 = await Common.getAsycData(`/Sale/GetEstimateDetails_ByClientId?moduleName=${moduleName}&ClientId=${parseInt(clientId)}`);
    if (responseData2 != null) {
        Common.bindParentDropDownSuccessForChosen(responseData2, 'DCNoId', 'TaxInvoiceColumn');
    }

    if (clientId) {
        Inventory.updateGSTVisibility('#ClientPlaceOfSupply', '#StateName');
    }


});
$(document).on('change', '#TakeId', async function () {
    sss
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

/* ==================================================== Bank Details ====================================== */
$(document).on('click', '#BankEdit', function () {
    Inventory.BankCanvasOpen();
});
$(document).on('click', '#CloseCanvas,#CloseBankBtn', function () {
    Inventory.BankCanvasClose();
});

$(document).on('click', '#UpdateBankBtn', function () {

    var BankUpdateFormIsValid = $("#BankUpdateForm").validate().form();

    if (!BankUpdateFormIsValid) {
        return false;
    } else {
        Inventory.BankDetailsUpdate(
            function (response) { Inventory.handleBankUpdateSuccess(response); },
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



/*==================================== PRODUCT TABLE ============================================*/

var selectedProductQuantity = [];
var selectedProductUnitId = [];
$(document).on('click', '#UpdateProductsInAddItem', function () {

    var AllProductTable = 'AllProductTable';
    var tablebody = $('#SaleProductTablebody');
    var mainTable = $('#SaleProductTable');
    var moduleName = 'Sale';
    $('#loader-pms').show();
    var stateSelector1 = "#ClientPlaceOfSupply";
    var stateSelector2 = "#StateName";
    Inventory.AddProductsToMainTable(AllProductTable, tablebody, mainTable, moduleName, stateSelector1, stateSelector2);

});

$(document).on('click', '.DynremoveBtn', function () {
    const row = $(this).closest('tr');
    let productId = row.data('product-id');
    var mainTable = $('#SaleProductTable');
    Inventory.RemoveProductMainRow(row, productId, mainTable);

});
$(document).on('input', '.SellingPrice', function () {

    const row = $(this).closest('tr');
    var mainTable = $('#SaleProductTable');
    Inventory.calculateTaxableAmount(row);

    Inventory.SalecalculateCGST(row);
    Inventory.SalecalculateSGST(row);
    Inventory.SalecalculateIGST(row);
    Inventory.SalecalculateCESS(row);
    Inventory.SalecalculateTotalAmount(row);
    Inventory.SaleupdateSubtotalRow(mainTable);

    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();

    calculateBalance();

});
$(document).on('input', '.TableRowQty', function () {

    const finalQTY = parseInt($(this).val() || 0);
    const row = $(this).closest('tr');
    var QtyUnitDropDown = parseInt(row.find('.QtyUnitDropDown').val());
    const data = row.data('product-info');
    const productId = row.data('product-id');

    var tablebody = $('#SaleProductTablebody');
    var mainTable = $('#SaleProductTable');

    let existingRow = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`);
    let existingRowFirst = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`).first();

    Inventory.QuantityInputChange(finalQTY, row, QtyUnitDropDown, data, productId, tablebody, mainTable, existingRow, existingRowFirst);
});
$(document).on('input', '#DisInput', function () {

    const row = $(this).closest('tr');
    var mainTable = $('#SaleProductTable');
    Inventory.calculateTaxableAmount(row);
    Inventory.SalecalculateCGST(row);
    Inventory.SalecalculateSGST(row);
    Inventory.SalecalculateIGST(row);
    Inventory.SalecalculateCESS(row);
    Inventory.SalecalculateTotalAmount(row);
    Inventory.SaleupdateSubtotalRow(mainTable);
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
    var tablebody = $('#SaleProductTablebody');
    var mainTable = $('#SaleProductTable');

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
    var mainTable = $('#SaleProductTable');
    Inventory.calculateTaxableAmount(row);
    Inventory.SalecalculateCGST(row);
    Inventory.SalecalculateSGST(row);
    Inventory.SalecalculateIGST(row);
    Inventory.SalecalculateCESS(row);
    Inventory.SalecalculateTotalAmount(row);
    Inventory.SaleupdateSubtotalRow(mainTable);
    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();
});

$(document).on('change', '.QtyUnitDropDown', function () {

    let rowElement = $(this).closest('tr');
    let selectedUnit = parseInt($(this).val());
    let productData = rowElement.data('product-info');
    let tableBody = $('#SaleProductTablebody');
    var mainTable = $('#SaleProductTable');
    Inventory.updateSellingPriceBasedOnUnitProductRow(selectedUnit, tableBody, rowElement, productData, mainTable);
});
$(document).on('click', '#AddItemBtn', function () {

    $('#loader-pms').show();
    var mainTable = $("SaleProductTable");
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

/* ======================================= MODE OF PAYMENT ======================================  */

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
    var TotalAmount = totalMOP + static;

    var balanceAmount = (grantTotal + CreditAmount) - TotalAmount;
    $('#BalanceAmount').val(balanceAmount.toFixed(2)).css('color', balanceAmount > 0 ? 'red' : balanceAmount < 0 ? 'orange' : 'green');

}
/* ======================================= OTHER CHARGES  ============================================ */
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

/* ================================  CRUD Function ==================================== */
$(document).on('click', '#customBtn_SaleData', function () {

    EditSaleId = 0;
    $('#loader-pms').show();
    Common.removevalidation('FormBillFrom');
    Common.removevalidation('FormShipping');
    Common.removevalidation('FormStatus');
    var EditDataId = { ModuleName: "Sale", ModuleId: null };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, function (response) {
        StatusSuccess(response);
        $('#SaleStatusId').val(1).trigger('change');
    }, null);

    $("#ModalHeading").text("Add Tax Invoice");
    $('#ClientColumn').hide();
    $('#ShippingColumn').hide();
    Common.bindDropDownParent('ClientId', 'ClientColumn', 'Client', null);
    /* $('#ShippingColumn #ShipToClientId').empty().append('<option value="">--Select--</option>').trigger('change');*/
    $('#EstimateId').empty();
    $('#EstimateId').append('<option value="0">--Select--</option>');

    $('#DCNoId').empty();
    $('#DCNoId').append('<option value="0">--Select--</option>');

    $("#InvoiceDate").val(Common.CurrentDate());

    $("#btnSaveSale span:first").text("Save");
    $("#btnPrintSale span:first").text("Save & Print");
    $("#btnPreviewSale span:first").text("Save & Preview");

    $('#IsPartiallyPaid').prop('checked', false);
    $('#Paidfrom').val(null).trigger('change');
    $('#AddAttachment').hide();

    $('#TaxInvoiceModal').show();
    $('#ViewBankLable').hide();

    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId')); 
    $('#AlternativeCompanyAddress').val(FranchiseMappingId).trigger('change');
    var EditDataId = { ModuleId: null, ModuleName: null };
    Common.ajaxCall("GET", "/Common/GetBillFromDDDetails", EditDataId, function (response) {
        var id = "BillFrom";
        Common.bindDropDownSuccess(response.data, id);
        $('#BillFrom').prop('selectedIndex', 1).trigger('change');
    }, null);
    $('#appendContainer').empty();


    $('#AddVendorlableColumn').show();
    $("#btnEInvoiceSale").hide();
    $("#btnGenerateEWB").hide();
    $("#btnViewEWB").hide();
    $("#EinvoiceResponseDiv").hide();
    $('#loader-pms').hide();
    $('.Status-Div').hide();
    $("#TaxInvoiceModal .modal-body").animate({ scrollTop: 0 }, "fast");
    selectedProductIdsList = [];

    var selectedPODate = $('#InvoiceDate').val();
    $("#GoodsDelDate").val(selectedPODate);
    //$("#GoodsDelDate").attr("min", selectedPODate);
    //if ($("#GoodsDelDate").val() < selectedPODate) {
    //    $("#GoodsDelDate").val("");
    //}

    $('#EstimateDate,#GoodsDelDate,#DcDate').val("");
});
function StatusSuccess(response) {
    var id = "SaleStatusId";
    Common.bindDropDownSuccess(response.data, id);
}
$(document).on('click', '#AddVendorLable', function () {
    BillingAddressDivOpen();
});

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Sale",
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
$(document).on('click', '#SaleData .btn-delete', async function () {

    var response = await Common.askConfirmation();
    if (response == true) {
        var saleId = $(this).data('id');
        Common.ajaxCall("GET", "/Sale/DeleteSaleDetails", { SaleId: saleId }, SaleReload, null);
    }
});
$(document).on('click', '#btnSaveSale', function () {
    sendSaleRequest(handleSaleSuccess, handleSaleError);
});
$(document).on('click', '#btnCancelSale,#TaxInvoiceClose', function () {
    var type = "other";
    ResetDataDetails(type);
    GridChange();
    $('#TaxInvoiceModal').hide();
    
    BillingAddressDivClose();
})

function sendSaleRequest(successCallback, errorCallback) {

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

    var StatusFormIsValid = $('#FormStatus').validate().form();
    var BillFromIsValid = $("#FormBillFrom").validate().form();


    if (!ClientFormIsValid || !ShippingFormIsValid || !RightSideHeaderFormIsValid || !taxdiscountFormIsValid || !isValid || !StatusFormIsValid || !BillFromIsValid) {
        $('#loader-pms').hide();
        $('#AlternativeCompanyAddress-error').insertAfter('.AlternativeCompanyError');
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
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var SaleDateString = $('#InvoiceDate').val();
    var SaleDate = new Date(SaleDateString);

    var paidFrom = $('#PaidFrom').val();
    paidFrom = (paidFrom === '--Select--') ? null : paidFrom;

    var CheckBox = $('#IsPartiallyPaid').is(':checked');

    if (CheckBox) {
        CheckBox = true;
    } else {
        CheckBox = false;
    }
    var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();
    var SaleDetailsStatic = {
        SaleId: EditSaleId > 0 ? EditSaleId : null,
        ClientId: parseInt($('#ClientId').val()),
        FranchiseId: FranchiseMappingId,
        BillingFranchiseId: parseInt(alternativeCompanyAddress),
        BillFromFranchiseId: parseInt($('#BillFrom').val()),
        EstimateId: parseInt($('#EstimateId').val()) || null,
        SaleDate: SaleDate,
        SaleNo: $('#TaxInvoiceNumber').val(),
        SubTotal: parseFloat($('#Subtotal').val()),
        GrantTotal: parseFloat($('#GrantTotal').val()),
        RoundOffValue: parseFloat($('#roundOff').val()) || 0.00,
        DeliveryChallanId: parseInt($('#DCNoId').val()) || null,
        DeliveryChallanDate: $('#DcDate').val() || null,
        Notes: $('#Notes').val() || null,
        EstimateDate: $('#EstimateDate').val() || null,
        GoodsDeliveryDate: $('#GoodsDelDate').val() || null,

        SaleStatusId: parseInt($('#SaleStatusId').val()),
        TermsAndCondition: $('#TermsAndCondition').val() || null,
        //TransporterId: $('#AddTransportDetails #TransportID').text(),
        //TransportName: $('#AddTransportDetails #TransportName').text(),
        //ModeofTransport: $('#AddTransportDetails #ModeofTransport').text(),
        //Distance: $('#AddTransportDetails #Distance').text(),
        //TransportDocNo: $('#AddTransportDetails #TransportDocNo').text(),
        //TransportDocDate: $('#AddTransportDetails #TransportDocDate').text(),
        //VehicleNumber: $('#AddTransportDetails #VehicleNumber').text(),
        //VehicleType: $('#AddTransportDetails #VehicleType').text(),
        //DocumentType: $("#DocumentType").val(),
        //SupplyType: $("#SupplyType").val(),
        //TransactionType: $("#TransactionType").val(),
        //DispatchAddressId: parseInt($('#DispatchFrom').val()) || null,


    };

    var SaleProductMappingDetailsArray = [];

    $('#SaleProductTablebody .ProductTableRow').each(function () {
        var $rowTable = $(this);
        var productId = $rowTable.data('product-id');
        var isIGSTVisible = $rowTable.find('.IGSTValues').is(':visible');
        if (isIGSTVisible) {
            var igstpercentage = Common.parseFloatValue($rowTable.find('#IGSTPercentage').val());
        } else {
            var igstpercentage = null;
        }

        SaleProductMappingDetailsArray.push({
            SaleProductMappingId: null,
            ProductId: parseInt(productId),
            SellingPrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()),
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
            Discount:  null,
            TotalAmount: Common.parseFloatValue($rowTable.find('.Totalamount-cell').text()),
            ModuleId: EditSaleId > 0 ? EditSaleId : null,

        });

    });

    var SaleOtherChargesMappingDetailsArray = [];
    var SaleOtherChargesMappingDetails = $("#dynamicBindRow .dynamicBindRow");

    $.each(SaleOtherChargesMappingDetails, function (index, value) {
        var ispercentageval = $(value).find('#IsPercentage').attr('name');
        var oid = $(value).find('.taxandothers').val();

        if (oid != undefined) {
            SaleOtherChargesMappingDetailsArray.push({
                SaleOtherChargesMappingId: null,
                SaleId: EditSaleId > 0 ? EditSaleId : null,
                OtherChargesId: parseInt($(value).find('.taxandothers').val() == "" ? 0 : $(this).find('.taxandothers').val()),
                OtherChargesType: $(value).find('.taxandothers').attr('OtherChargesType'),
                OtherChargesName: $(value).find('.taxandothers option:selected').text(),
                IsPercentage: Boolean($("input[name='" + ispercentageval + "']:checked").val() == '1' ? true : false),
                Value: parseFloat($(value).find('.calculateinventoryvalue').val() == "" ? 0 : $(this).find('.calculateinventoryvalue').val()),
                OtherChargeValue: parseFloat($(value).find('.otherChargeValue').val() == "" ? 0 : $(this).find('.otherChargeValue').val())
            });
        }

    });


    formDataMultiple.append("SaleDetailsStatic", JSON.stringify(SaleDetailsStatic));
    formDataMultiple.append("SaleProductMappingDetails", JSON.stringify(SaleProductMappingDetailsArray));
    formDataMultiple.append("SaleOtherChargesMappingDetails", JSON.stringify(SaleOtherChargesMappingDetailsArray));
    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    $.ajax({
        type: "POST",
        url: "/Sale/InsertUpdateSale",
        data: formDataMultiple,
        contentType: false, processData: false,
        success: successCallback,
        error: errorCallback
    });

}

function handleSaleSuccess(response) {

    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }

    if (data && data[0] && data[0][0] && typeof data[0][0].SaleId !== 'undefined') {
        EditSaleId = data[0][0].SaleId > 0 ? data[0][0].SaleId : 0;

    } else {
        EditSaleId = 0;
    }

    Common.successMsg(response.message);

    GridChange();

    $('#TaxInvoiceModal').hide();

    BillingAddressDivClose();

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    var type = "other";
    ResetDataDetails(type);
}

function handleSaleError(response) {
    let message = 'An error occurred.';
    if (response && response.message) {
        message = response.message;
    }
    $('#loader-pms').hide();
    Common.errorMsg(message);
}

function SaleReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        GridChange();
    }
    else {
        Common.errorMsg(response.message);
    }
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
            ModuleName: "Sale",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

/* ========================================= NOT NULL GET ========================================== */
$('#SaleData').on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    EditSaleId = $(this).data('id');
    $('#appendContainer').empty();
    var EditDataId = { ModuleName: "Sale", ModuleId: EditSaleId };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, StatusSuccess, null);
    editSale(EditSaleId);
});

function editSale(EditSaleId) {

    $('#dynamicBindRow').empty('');
    var EditDataId = { ModuleName: "Sale", ModuleId: EditSaleId };
    Common.ajaxCall("GET", "/Common/ActivityHistoryDetails", EditDataId, Inventory.StatusActivity, null);

    var EditDataId = { ModuleId: EditSaleId, ModuleName: "Sale" };
    Common.ajaxCall("GET", "/Common/GetBillFromDDDetails", EditDataId, function (response) {
        var id = "BillFrom";
        Common.bindDropDownSuccess(response.data, id);


    }, null);
    var EditDataId = { SaleId: EditSaleId };


    $("#btnSaveSale span:first").text("Update");
    $("#btnPrintSale span:first").text("Update & Print");
    $("#btnPreviewSale span:first").text("Update & Preview");
    $('.Status-Div').show();
    $("#ModalHeading").text("Tax Invoice Info");
    $('#TaxInvoiceModal').show();
    $("#TaxInvoiceModal .modal-body").animate({ scrollTop: 0 }, "fast");

    $('#ClientColumn').show();


    Common.ajaxCall("GET", "/Sale/NotNullGetSale", EditDataId, SaleGetNotNull, null);
}

async function SaleGetNotNull(response) {


    disableChangeEvent = true;

    if (response.status) {


        const data = JSON.parse(response.data);
        //var DispatchForHide = data[12][0].AltAddressId;
        //if (DispatchForHide == '' || DispatchForHide == null || DispatchForHide == undefined) {
        //    $(".Einvoicetable").hide();
        //    $('.HideEinvoiceLable').hide();
        //    $('.AddEinvoiceLable').show();
        //}
        //else {
        //    $(".Einvoicetable").show();
        //    $('.HideEinvoiceLable').show();
        //    $('.AddEinvoiceLable').hide();
        //}
        const ClientId = data[1][0].ClientId;
        var eid = parseInt(data[1][0].EstimateId);
        var dcid = parseInt(data[1][0].DeliveryChallanId);

        Inventory.toggleField(data[1][0].Notes, "#Notes", "#AddNotes", "#AddNotesLable");
        Inventory.toggleField(data[1][0].TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
        Inventory.toggleFieldForAttachment(data[3][0].AttachmentId, "#AddAttachLable", "#AddAttachment");

        BillingAddressDivOpen();

        if (ClientId) {
            loadEstimateAndDeliveryChallan(ClientId, data);
        } else {
            clearDropDowns();
        }


        bindSaleDetails(data);
        Inventory.ClientAddressBind();
        //$(".E-InvoiceColumn #Irn").text(data[13][0].Irn);
        //$(".E-InvoiceColumn #AckNo").text(data[13][0].AckNo);
        //$(".E-InvoiceColumn #AckDate").text(data[13][0].AckDate);
        //$(".E-InvoiceColumn #Status").text(data[13][0].EInvoiceStatus);

        //$(".E-WayColumn #EwayBillNo").text(data[13][0].EwbNo);
        //$(".E-WayColumn #EwayBillDate").text(data[13][0].EwbDate);
        //$(".E-WayColumn #EwayBillValid").text(data[13][0].EwbValidTill);
        //$(".E-WayColumn #Status").text(data[13][0].EwayBillStatus);

        //if (data[13][0].Irn != null && data[13][0].Irn != "") {
        //    $("#EinvoiceResponseDiv").show();
        //    $("#btnEInvoiceSale").hide();

        //} else {
        //    $("#EinvoiceResponseDiv").hide();
        //    $("#btnEInvoiceSale").show();
        //}

        //if (data[13][0].Irn != null && data[13][0].Irn != "" && (data[13][0].EwbNo == "" || data[13][0].EwbNo == null)) {
        //    $("#btnGenerateEWB").show();
        //} else {
        //    $("#btnGenerateEWB").hide();
        //}

        //if (data[13][0].EwbNo != "" && data[13][0].EwbNo != null) {
        //    $("#btnViewEWB").show();
        //} else {
        //    $("#btnViewEWB").hide();
        //}

        var tablebody = $('#SaleProductTablebody');
        var mainTable = $('#SaleProductTable');
        var stateSelector1 = "#ClientPlaceOfSupply";
        var stateSelector2 = "#StateName";

        Inventory.bindSaleProducts(data[0], tablebody, mainTable, null, stateSelector1, stateSelector2);


        $('#dynamicBindRow').empty('');

        Inventory.bindOtherCharges(data[2]);

        $('#selectedFiles, #ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();
        Inventory.bindAttachments(data[3]);

        setTimeout(() => {
            $("#SaleStatusId").val(data[1][0].SaleStatusId).trigger('change');
            if (eid > 0) {
                $("#EstimateId").val(eid).trigger('change');
            }
            if (dcid > 0) {
                $("#DCNoId").val(dcid).trigger('change');
            }
            disableChangeEvent = false;
            AutoGenerateFlag = false;

            Inventory.updateGSTVisibility('#ClientPlaceOfSupply', '#StateName');
            $('#loader-pms').hide();
        }, 500);
    }
}

async function bindSaleDetails(data) {

    const poData = data[1][0];
    EditSaleId = poData.SaleId;
    disableChangeEvent = true;

    if (poData.IsOutWard) {
        IsOutWard = 1;
    }
    else {
        IsOutWard = 0;
    }

    var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(poData.ClientId));
    if (responseData1 !== null) {
        Inventory.ClientAddressDetails(responseData1);
    }
    AutoGenerateFlag = true;
    $("#SaleStatusId option").each(function () {
        if ($(this).val() !== "" && $(this).val() < poData.SaleStatusId) {
            $(this).remove();
        }
    });
    $("#ClientId").val(poData.ClientId).trigger('change');
    $('#InvoiceDate').val(extractDate(poData.SaleDate));
    $('#DCDate').val(extractDate(poData.DeliveryChallanDate));
    $('#EstimateDate').val(extractDate(poData.EstimateDate));
    $('#GoodsDelDate').val(extractDate(poData.GoodsDeliveryDate));
    $('#TaxInvoiceNumber').val(poData.SaleNo);
    //$("#Subtotal").val(poData.SubTotal);
    //$("#GrantTotal").val(poData.GrantTotal);
    $('#BillFrom').val(poData.BillFromFranchiseId).trigger('change');
    $('#AlternativeCompanyAddress').val(poData.BillingFranchiseId).trigger('change');

    //$("#AddTransportDetails #TransportId").text(data[4][0].TransporterId);
    //$("#AddTransportDetails #TransportName").text(data[4][0].TransportName);
    //$("#AddTransportDetails #ModeOfTransport").text(data[4][0].ModeofTransport);
    //$("#AddTransportDetails #Distance").text(data[4][0].Distance);
    //$("#AddTransportDetails #TransportDocNo").text(data[4][0].TransportDocNo);
    //$("#AddTransportDetails #TransportDocDate").text(data[4][0].TransportDocDate.split('T')[0]);
    //$("#AddTransportDetails #VehicleNumber").text(data[4][0].VehicleNumber);
    //$("#AddTransportDetails #VehicleType").text(data[4][0].VehicleType);

    //$("#DocumentType").val(poData.DocumentType);
    //$("#SupplyType").val(poData.SupplyType);
    //$("#TransactionType").val(poData.TransactionType);

    //var DispatchAddressId = poData.DispatchAddressId;

    //if (DispatchAddressId == null) {

    //    var responseData = await Common.getAsycData("/Sale/CompanyAddressDetails");
    //    if (responseData !== null) {
    //        var data = JSON.parse(responseData);

    //        var city = data[0][0].CompanyCity;
    //        var zipcode = data[0][0].CompanyZipcode;
    //        var cityZipcode = city + " - " + zipcode;

    //        var companyName = data[0][0].CompanyName;
    //        var option = $('<option>', {
    //            value: companyName,
    //            text: companyName,
    //            selected: true,
    //            disabled: true
    //        });

    //        // Clear existing options and disable the dropdown
    //        $('#DispatchFrom').empty().append(option).prop('disabled', true);

    //        // Populate Dispatch details
    //        $("#DispatchName").text(data[0][0].CompanyName);
    //        $("#DispatchAddress").text(data[0][0].CompanyAddress);
    //        $("#DispatchCity").text(cityZipcode);
    //        $("#DispatchPlaceOfSupply").text(data[0][0].StateName);
    //        $("#DispatchCountry").text(data[0][0].CompanyCountry);
    //        $("#DispatchEmail").text(data[0][0].CompanyEmail);
    //        $("#DispatchMobileNumber").text(data[0][0].CompanyContactNumber);
    //        $("#DispatchGSTNumber").text(data[0][0].GSTNumber);
    //        $("#DispatchStateId").text(data[0][0].StateId);
    //    }
    //}
    //else if (DispatchAddressId > 0) {

    //    var masterInfoId = DispatchAddressId;
    //    var moduleName = "SaleDispatchAddress";

    //    if (masterInfoId > 0) {

    //        Common.bindDropDown('DispatchFrom', 'SaleDispatchAddress');

    //        setTimeout(function () {
    //            $("#DispatchFrom").val(DispatchAddressId);
    //        }, 500);

    //        var responseData = await Common.getAsycData("/Sale/DispatchAddressDetails?masterInfoId=" + masterInfoId + "&moduleName=" + moduleName); if (responseData !== null) {

    //            var data = JSON.parse(responseData);

    //            var city = data[0][0].AltCity;
    //            var zipcode = data[0][0].AltZipCode;
    //            var cityZipcode = city + " - " + zipcode;

    //            $("#DispatchName").text(data[0][0].AliasName);
    //            $("#DispatchAddress").text(data[0][0].AltAddress);
    //            $("#DispatchCity").text(cityZipcode);
    //            $("#DispatchPlaceOfSupply").text(data[0][0].StateName);
    //            $("#DispatchCountry").text(data[0][0].AltCountry);
    //            $("#DispatchEmail").text(data[0][0].AltEmail);
    //            $("#DispatchMobileNumber").text(data[0][0].AltContactNumber);
    //            $("#DispatchStateId").text(data[0][0].AltStateCodeId);
    //            $("#DispatchGSTNumber").text(data[0][0].GSTNumber);
    //            $("#DispatchCompanyId").text(data[0][0].CompanyId);

    //            $("#DispatchAddressEdit").show();
    //        }
    //    }
    //}


    var moduleName = "DeliveryChallan";

    var responseData2 = await Common.getAsycData(`/Sale/GetEstimateDetails_ByClientId?moduleName=${moduleName}&ClientId=${parseInt(poData.ClientId)}`);
    if (responseData2 != null) {
        Common.bindParentDropDownSuccessForChosen(responseData2, 'DCNoId', 'TaxInvoiceColumn');
    }

    Inventory.toggleField(poData.Notes, "#Notes", "#AddNotes", "#AddNotesLable");
    Inventory.toggleField(poData.TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
    $("#roundOff").css("color", getColorForRoundOff(poData.RoundOffValue));
    $("#SaleStatusId").val(poData.SaleStatusId).trigger('change');


    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();

    calculateBalance();

}
async function loadEstimateAndDeliveryChallan(ClientId, data) {

    const moduleName = ["Estimate", "DeliveryChallan"];

    for (let module of moduleName) {
        const responseData = await Common.getAsycData(`/Sale/GetEstimateDetails_ByClientId?moduleName=${module}&ClientId=${parseInt(ClientId)}`);
        if (responseData) {
            Common.bindParentDropDownSuccess(responseData, module === "Estimate" ? 'EstimateId' : 'DCNoId', 'TaxInvoiceColumn');
            $(`#${module === "Estimate" ? 'EstimateId' : 'DCNoId'}`).val(data[0][0][module === "Estimate" ? 'EstimateId' : 'DeliveryChallanId']).trigger('change');
        }
    }
}
function clearDropDowns() {
    $('#EstimateId, #DCNoId').empty().append('<option value="0">--Select--</option>');
}
function getColorForBalance(balanceAmount) {
    return balanceAmount > 0 ? 'red' : balanceAmount < 0 ? 'orange' : 'green';
}
function getColorForRoundOff(roundOffValue) {
    return roundOffValue === 0 ? "orange" : roundOffValue > 0 ? "#4ce53d" : "red";
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

//$(document).on('click', '.clickable-label', function () {
//    window.open('https://einvoice1.gst.gov.in/Others/GetPinCodeDistance', '_blank');
//});

function extractDate(inputDate) {

    if (!inputDate) {
        return '';
    }
    var parts = inputDate.split('T');
    var datePart = parts[0];
    return datePart;
}

function BillingAddressDivOpen() {
    $('#AddVendorlableColumn').hide();
    $('#ClientColumn').show();
    $('#BillFromColumn').show();
    $('#ShippingColumn').show();
    $('#AddVendorlableColumn').removeClass('d-flex justify-content-center');
    $('#TaxInvoiceColumn').removeClass('col-6').addClass('col-4');
    $('#InvoiceNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#InvoiceDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#EstimateNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#EstimateDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#DCNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#DCDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#GoodsDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#TaxInvoiceColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-12').addClass('col-lg-4 col-md-12 col-sm-12 col-12');
}

function BillingAddressDivClose() {
    $('#AddVendorlableColumn').show();
    $('#ClientColumn').hide();
    $('#BillFromColumn').hide();
    $('#ShippingColumn').hide();

    /*$('#AddVendorlableColumn').addClass('d-flex justify-content-center');*/
    $('#TaxInvoiceColumn').addClass('col-6').removeClass('col-4');
    $('#InvoiceNoDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#InvoiceDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#EstimateNoDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#EstimateDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#DCNoDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#DCDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#GoodsDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#TaxInvoiceColumn').addClass('col-lg-6 col-md-6 col-sm-6 col-12').removeClass('col-lg-4 col-md-12 col-sm-12 col-12');
}

function resetCommonData() {
    $('#GoodsDelDate,#DCDate, #EstimateDate').val(null).trigger('change');
    $('#discounttotal,#GSTtotal,#Subtotal,#GrantTotal, #roundOff').val('');
    $('#SubTotalTotal, #CGSTTotal, #SGSTTotal, #IGSTTotal, #CESSTotal').val('');
    $('#selectedFiles, #ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    $('#SaleProductTable .ProductTableRow').remove();
    $('#dynamicBindRow').empty('');
    $('#appendContainer .input-group').slice(1).empty();
    selectedProductIdsList = [];
    $('#AddAttachLable').show();
    $('#AddAttachment').hide();

    $('#AddNotes').hide();
    $('#AddNotesLable').show();

    $('#AddTerms').hide();
    $('#AddTermsLable').show();



    //$("#DocumentType").val('');
    //$("#SupplyType").val('');
    //$("#TransactionType").val('').trigger('change');

    //$("#AddTransportDetails #TransportId").text('');
    //$("#AddTransportDetails #TransportName").text('');
    //$("#AddTransportDetails #ModeOfTransport").text('');
    //$("#AddTransportDetails #Distance").text('');
    //$("#AddTransportDetails #TransportDocNo").text('');
    //$("#AddTransportDetails #TransportDocDate").text('');
    //$("#AddTransportDetails #VehicleNumber").text('');
    //$("#AddTransportDetails #VehicleType").text('');

    //$(".E-InvoiceColumn #Irn").text('');
    //$(".E-InvoiceColumn #AckNo").text('');
    //$(".E-InvoiceColumn #AckDate").text('');
    //$(".E-InvoiceColumn #Status").text('');
    //$(".E-WayColumn #EwayBillNo").text('');
    //$(".E-WayColumn #EwayBillDate").text('');
    //$(".E-WayColumn #EwayBillValid").text('');
    //$(".E-WayColumn #Status").text('');

    //Common.removevalidation('SaleProductTableForm');
    //Common.removevalidation('frmtaxdiscountothers');
}
function ResetDataDetails(type) {
    resetCommonData();

    if (type === 'Estimate') {
        $('#DCNo').val(null).trigger('change');
        $('#EstimateDate').val(null).trigger('change');
        $('#DCDate').val(null).trigger('change');

    } else if (type === 'DeliveryChallan') {
        $('#Estimateid').val(null).trigger('change');
    }
    else if (type === 'empty') {

        $('#EstimateDate').val(null).trigger('change');
        $('#DCDate').val(null).trigger('change');
    } else if (type === 'Client') {
        $('#EstimateDate').val(null).trigger('change');
        $('#DCDate').val(null).trigger('change');
    }
    else {

        $('#InvoiceDate, #TaxInvoiceNumber, #Estimateid, #DCNo,#ClientId').val(null).trigger('change');
        $("#BillFromAddress").text('');
        $('#TermsAndCondition, #Notes').val('');
    }
}

/* ================================ Estimateid,DCNo change ========================================= */

//$(document).on('change', '#EstimateId,#DCNoId', async function () {


//    if (disableChangeEvent) {
//        return false;
//    }

//    var id = $(this).val();
//    var moduleName = this.id === 'EstimateId' ? 'Estimate' : 'DeliveryChallan';
//    var franchiseId = parseInt($('#UserFranchiseMappingId').val());

//    if (id !== "") {
//        var url = `/PurchaseInvoice/GetPurchaseDetails_ByPurchaseId?PurchaseId=${id}&ModuleName=${moduleName}&FranchiseId=${franchiseId}`;

//        var responseData = await Common.getAsycDataInventory(url);
//        ResetDataDetails(moduleName);
//        moduleName === 'Estimate' ? EstimateNumberDetails(responseData, moduleName) : DeliverychallanNumberDetails(responseData, moduleName);
//    } else {
//        ResetDataDetails('empty');
//    }

//});
function EstimateNumberDetails(response, typeOfModule) {

    handleNumberDetails(response, typeOfModule, '#EstimateDate');
}
function DeliverychallanNumberDetails(response, typeOfModule) {

    handleNumberDetails(response, typeOfModule, '#DcDate');
}
function handleNumberDetails(response, typeOfModule, dateField) {

    formDataMultiple = new FormData();

    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[1].length > 0) {
            Common.bindData(data[0]);
            var poData = data[1][0];

            if (typeOfModule === 'Estimate') {
                $('#EstimateDate').val(extractDate(poData.EstimateDate));
            } else if (typeOfModule === 'DeliveryChallan') {
                $(dateField).val(extractDate(poData.DeliveryChallanDate));
            }
        }
    }

    NumberDetailsBind(response, typeOfModule);
}
function NumberDetailsBind(response, typeOfModule) {

    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[1].length > 0) {

            var poData = data[1][0];

            $("#Subtotal").val(poData.SubTotal);
            $("#GrantTotal").val(poData.GrantTotal);

            Inventory.toggleField(poData.Notes, "#Notes", "#AddNotes", "#AddNotesLable");
            Inventory.toggleField(poData.TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");

            var roundOff = poData.RoundOffValue;

            const colorMap = roundOff === 0 ? "orange" : roundOff > 0 ? "#4ce53d" : "red";
            $("#roundOff").css("color", colorMap);



            $("#SubTotal").val(data[1][0].SubTotal);
            $("#GrantTotal").val(data[1][0].GrantTotal);
            $("#SaleStatusId").val(data[1][0].SaleStatusId).trigger('change');

        }
        var tablebody = $('#SaleProductTablebody');
        var mainTable = $('#SaleProductTable');

        if (typeOfModule == "Estimate") {
            Inventory.bindSaleProducts(data[0], tablebody, mainTable, null);
            $('#dynamicBindRow').empty('');
            Inventory.bindOtherCharges(data[2]);

            $('#selectedFiles, #ExistselectedFiles').empty('');
            existFiles = [];
            formDataMultiple = new FormData();
            Inventory.bindAttachments(data[3]);
        } else {
            Inventory.bindSaleProducts(data[0], tablebody, mainTable, null);

            $('#dynamicBindRow').empty('');
            Inventory.bindOtherCharges(data[2]);

            $('#selectedFiles, #ExistselectedFiles').empty('');
            existFiles = [];
            formDataMultiple = new FormData();
            Inventory.bindAttachments(data[3]);
        }

    }

    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();

}



/* =============================================== M A I L ================================= */

$(document).on('click', '#closeMail', function () {
    $("#SendMail").modal('hide');
    editSale(EditSaleId);
});
$(document).on('click', '#btnEmailSale', function () {


    $('#loader-pms').show();
    $("#AttachmentArea").html('');

    $("#EmailDetails #Subject").val('Tax Invoice');

    sendSaleRequest(MailAttachmentSaleSuccess);

});
$(document).on('click', '#SendButton', function () {
    $('#loader-pms').show();
    $('#SendButton').html('Sending...');
    Inventory.EmailSendbutton();
});
function MailAttachmentSaleSuccess(response) {

    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }


    if (data && data[0] && data[0][0] && typeof data[0][0].SaleId !== 'undefined') {
        EditSaleId = data[0][0].SaleId > 0 ? data[0][0].SaleId : 0;

    } else {

        EditSaleId = 0;

    }


    var module = EditSaleId;

    if (module > 0) {
        var EditDataId = { ModuleName: 'Sale', ModuleId: module, returnType: null };

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

        var SaleNumber = $('#SaleNumber').val();
        var companyName = data[0][0].CompanyName;
        var ClientName = $('#ClientId option:selected').text();
        var SaleDate = $('#SaleDate').val();
        if (SaleDate) {
            var dateParts = SaleDate.split("-"); // Split by hyphen
            SaleDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearrange to DD-MM-YYYY
        }
        var deliveryAddress = data[0][0].FullAddress;
        var yourFullName = data[0][0].Fullname;
        var yourPosition = data[0][0].UserGroupName;
        var SaleNumber = data[0][0].InvoiceNumber;
        var SaleDate = data[0][0].InvoiceDate;

        var emailBody = `
<div style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
    <div style="color: #007BFF; font-size: 16px;">
        Dear <strong>${ClientName}</strong>,
    </div>
    <p>Your order has been processed successfully. Please review the details below and confirm receipt.</p>
    <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3>Invoice Details</h3>
        <p><b>Invoice Number  :</b> ${SaleNumber}</p>
        <p><b>Invoice Date        :</b> ${SaleDate}</p>
        <p><b>Delivery Address:</b> ${deliveryAddress}</p>
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

        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var EditDataId = {
            ModuleId: parseInt(EditSaleId),
            ContactId: parseInt($("#ClientId").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: FranchiseMappingId
        };

        Common.ajaxCall("GET", "/Sale/TaxInvoicePrint", EditDataId, function (response) {
            Inventory.AttachmentPdfSuccess(response, "TaxInvoice.PDF");
        }, null);


    }
}
/*============================================PREVIEW & DOWNLOAD & PRINT =============================================================*/

$(document).on('click', '#btnPreviewSale, #btnPrintSale, #downloadLink', function () {

    printType = this.id === 'btnPreviewSale' ? 'Preview' :
        this.id === 'btnPrintSale' ? 'Print' : 'Download';

    $('#loader-pms').show();


    sendSaleRequest(GetPreviewAndDownloadAddress);
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


        if (data && data[0] && data[0][0] && typeof data[0][0].SaleId !== 'undefined') {
            EditSaleId = data[0][0].SaleId > 0 ? data[0][0].SaleId : 0;

        } else {

            EditSaleId = 0;

        }
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditSaleId),
            ContactId: parseInt($("#ClientId").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };


        $.ajax({
            url: '/Sale/TaxInvoicePrint',
            method: 'GET',
            data: EditDataId,
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response) {
                $('#loader-pms').hide();
                $('#ShareDropdown').css('display', 'none');
                var blob = new Blob([response], { type: 'application/pdf' });
                var blobUrl = URL.createObjectURL(blob);
                if (printType == "Preview") {
                    var newTab = window.open();
                    if (newTab) {
                        newTab.document.write(`
                                              <html>
                                              <head><title>Tax Invoice Preview</title></head>
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
                    link.download = 'TaxInvoice.pdf';
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

/* ====================================  CLIENT DROPDOWN   ================================================ */
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

$('#btnshareSale').click(function () {
    $('#ShareDropdown').toggle();
});
/*===============================================FILTER===================================================*/

$(document).off('click', '#FilterBtn').on('click', '#FilterBtn', function () {
    var ModuleName = "Sales";
    openFilterOffcanvas(ModuleName);
});


$(document).off('click', '.apply-filter').on('click', '.apply-filter', function () {
    Inventory.SearchFilter("sales");
});


$('.clear-filter').on('click', function () {
    selectedFilters = {};
    $('.filter-button').removeClass('active ');
    var storeId = parseInt($("#StoreBinfLog").val());
    Common.ajaxCall("GET", "/Sale/GetQuickBill", { IsSale: true }, SaleSuccess, null);
    $("#Filteroffcanvas").css("width", "0%");
    $('.content-overlay').fadeOut();

});


// ========================================  WhatsApp Sending  =================================
$(document).on('click', '#SaleWhatsAppBtn', function () {
    sendSaleRequest(GetWhatsAppDetails);
});
function GetWhatsAppDetails(response) {
    $('#SpinnerWhatsApp').show();

    formDataMultiple = new FormData();
    existFiles = [];

    if (response.status) {

        var data = JSON.parse(response.data);

        if (data && data[0] && data[0][0] && typeof data[0][0].SaleId !== 'undefined') {
            EditSaleId = data[0][0].SaleId > 0 ? data[0][0].SaleId : 0;

        } else {

            EditSaleId = 0;

        }

        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditSaleId),
            ContactId: parseInt($("#ClientId").val()),
            NoOfCopies: 1,
            printType: 'whatsapp',
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/Sale/TaxInvoicePrint',
            method: 'GET',
            data: EditDataId,
            success: function (response) {

                $('#loader-pms').show();
                var moduleId = EditSaleId;
                if (moduleId > 0) {
                    Common.ajaxCall("GET", "/Common/GetInventoryWhatsappDetails", { ModuleName: "Sale", ModuleId: EditSaleId, FilePath: response.data }, DataWhatsAppDetails, null);
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
        $('#btnPrintSale').click();
    }

    // Handling alt + v
    if (event.altKey && event.key === 'v') {
        event.preventDefault();
        $('#btnPreviewSale').click();
    }

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#btnSaveSale').click();
    }

    // Handling alt + h
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        $('#btnshareSale').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#btnCancelSale').click();
    }

});


$(document).on('click', '#ViewInvoiceLable', function () {
    debugger;
    $(".Einvoicetable").show();
    $('.HideEinvoiceLable').show();
    $('.AddEinvoiceLable').hide();
});

$(document).on('click', '#HideEinvoiceLable', function () {
    debugger;
    $(".Einvoicetable").hide();
    $('.HideEinvoiceLable').hide();
    $('.AddEinvoiceLable').show();
});

$('#BankUpdateForm #UPIId').on('keypress', function (e) {
    if (e.which === 32) {
        return false;
    }
});

/*=====================================================================================================*/

$(document).on('click', '#btnViewEWB', function () {

    $('#loader-pms').show();

    var EwayBillNo = $("#EwayBillNo").text();

    if (EwayBillNo == "") {
        $('#loader-pms').hide();
        return false;
    }

    $.ajax({
        type: "POST",
        url: "/EINV/PrintEInvoice",
        contentType: "application/json",
        data: JSON.stringify({ SaleId: EditSaleId }),
        xhrFields: {
            responseType: 'blob'
        },
        success: function (response) {
            $('#loader-pms').hide();
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        },
        error: function (xhr, status, error) {
            $('#loader-pms').hide();
            console.error("Error occurred:", error);
        }
    });
});


/* =========================================== Transport Details ====================================== */

$(document).on('click', '#TransportEdit', function () {
    Common.removevalidation('TransportUpdateForm');
    TransportCanvasOpen();
});

$(document).on('click', '#CloseCanvas,#CloseTransportBtn', function () {
    TransportCanvasClose();
    Common.removevalidation('TransportUpdateForm');
});

$(document).on('click', '#UpdateTransportBtn', function () {

    var FormTransportUpdate = $('#TransportUpdateForm').validate().form();
    if (!FormTransportUpdate) {
        return false;
    }

    var TransportId = $("#TransportUpdateForm #TransportId").val();
    var TransportName = $("#TransportUpdateForm #TransportName").val();
    var ModeOfTransport = $("#TransportUpdateForm #ModeOfTransport").val();
    var Distance = $("#TransportUpdateForm #Distance").val();
    var TransportDocNo = $("#TransportUpdateForm #TransportDocNo").val();
    var TransportDocDate = $("#TransportUpdateForm #TransportDocDate").val();
    var VehicleNumber = $("#TransportUpdateForm #VehicleNumber").val();
    var VehicleType = $("#TransportUpdateForm #VehicleType").val();


    $("#AddTransportDetails #TransportId").text(TransportId);
    $("#AddTransportDetails #TransportName").text(TransportName);
    $("#AddTransportDetails #ModeOfTransport").text(ModeOfTransport);
    $("#AddTransportDetails #Distance").text(Distance);
    $("#AddTransportDetails #TransportDocNo").text(TransportDocNo);
    $("#AddTransportDetails #TransportDocDate").text(TransportDocDate);
    $("#AddTransportDetails #VehicleNumber").text(VehicleNumber);
    $("#AddTransportDetails #VehicleType").text(VehicleType);

    TransportCanvasClose();
});

function TransportCanvasOpen() {

    var TransportId = $("#AddTransportDetails #TransportId").text();
    var TransportName = $("#AddTransportDetails #TransportName").text();
    var ModeOfTransport = $("#AddTransportDetails #ModeOfTransport").text();
    var Distance = $("#AddTransportDetails #Distance").text();
    var TransportDocNo = $("#AddTransportDetails #TransportDocNo").text();
    var TransportDocDate = $("#AddTransportDetails #TransportDocDate").text();
    var VehicleNumber = $("#AddTransportDetails #VehicleNumber").text();
    var VehicleType = $("#AddTransportDetails #VehicleType").text();

    $("#TransportUpdateForm #TransportId").val(TransportId);
    $("#TransportUpdateForm #TransportName").val(TransportName);
    $("#TransportUpdateForm #ModeOfTransport").val(ModeOfTransport);
    $("#TransportUpdateForm #Distance").val(Distance);
    $("#TransportUpdateForm #TransportDocNo").val(TransportDocNo);
    $("#TransportUpdateForm #TransportDocDate").val(TransportDocDate);
    $("#TransportUpdateForm #VehicleNumber").val(VehicleNumber);
    $("#TransportUpdateForm #VehicleType").val(VehicleType);

    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $(".TransportCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $(".TransportCanvas").css("width", "60%");
    } else {
        $(".TransportCanvas").css("width", "35%");
    }
    $('.content-overlay').fadeIn();
}

function TransportCanvasClose() {

    $(".TransportCanvas").css("width", "0%");
    $('.content-overlay').fadeOut();
}

/* ====================================== Dispatch Address Details =================================== */
$(document).on('click', '#DispatchAddressEdit', function () {

    Common.removevalidation('FormDispatchtAddress');
    DispatchCanvasOpen();
});

$(document).on('click', '#CloseCanvas,#DispatchAddressCloseBtn', function () {
    DispatchCanvasClose();
});


$(document).on('change', '#TransactionType', function () {

    var TransactionId = $(this).val();
    handleTransactionTypeChange(TransactionId);
});


async function handleTransactionTypeChange(TransactionId) {

    if (TransactionId == "1" || TransactionId == "2") {
        var responseData = await Common.getAsycData("/Sale/CompanyAddressDetails");
        if (responseData !== null) {
            var data = JSON.parse(responseData);

            var city = data[0][0].CompanyCity;
            var zipcode = data[0][0].CompanyZipcode;
            var cityZipcode = city + " - " + zipcode;

            var companyName = data[0][0].CompanyName;
            var option = $('<option>', {
                value: companyName,
                text: companyName,
                selected: true,
                disabled: true
            });


            $('#DispatchFrom').empty().append(option).prop('disabled', true);


            $("#DispatchName").text(data[0][0].CompanyName);
            $("#DispatchAddress").text(data[0][0].CompanyAddress);
            $("#DispatchCity").text(cityZipcode);
            $("#DispatchPlaceOfSupply").text(data[0][0].StateName);
            $("#DispatchCountry").text(data[0][0].CompanyCountry);
            $("#DispatchEmail").text(data[0][0].CompanyEmail);
            $("#DispatchMobileNumber").text(data[0][0].CompanyContactNumber);
            $("#DispatchGSTNumber").text(data[0][0].GSTNumber);
            $("#DispatchStateId").text(data[0][0].StateId);
        }
    } else if (TransactionId == "3" || TransactionId == "4") {
        $('#DispatchFrom').prop('disabled', false);
        Common.bindDropDown('DispatchFrom', 'SaleDispatchAddress');


        $("#DispatchName").text('');
        $("#DispatchAddress").text('');
        $("#DispatchCity").text('');
        $("#DispatchPlaceOfSupply").text('');
        $("#DispatchCountry").text('');
        $("#DispatchEmail").text('');
        $("#DispatchMobileNumber").text('');
        $("#DispatchGSTNumber").text('');
        $("#DispatchStateId").text('');
        $("#DispatchCompanyId").text('');
    } else {

        $('#DispatchFrom').empty().append('<option value="">--Select--</option>').prop('disabled', false);

        $("#DispatchName").text('');
        $("#DispatchAddress").text('');
        $("#DispatchCity").text('');
        $("#DispatchPlaceOfSupply").text('');
        $("#DispatchCountry").text('');
        $("#DispatchEmail").text('');
        $("#DispatchMobileNumber").text('');
        $("#DispatchGSTNumber").text('');
        $("#DispatchStateId").text('');
        $("#DispatchCompanyId").text('');
    }


    $("#DispatchAddressEdit").hide();
}

$(document).on('change', '#DispatchFrom', async function () {


    var masterInfoId = parseInt($("#DispatchFrom").val());
    var moduleName = "SaleDispatchAddress";

    if (masterInfoId > 0) {

        var responseData = await Common.getAsycData("/Sale/DispatchAddressDetails?masterInfoId=" + masterInfoId + "&moduleName=" + moduleName);

        if (responseData !== null) {
            var data = JSON.parse(responseData);

            var city = data[0][0].AltCity;
            var zipcode = data[0][0].AltZipCode;
            var cityZipcode = city + " - " + zipcode;

            $("#DispatchName").text(data[0][0].AliasName);
            $("#DispatchAddress").text(data[0][0].AltAddress);
            $("#DispatchCity").text(cityZipcode);
            $("#DispatchPlaceOfSupply").text(data[0][0].StateName);
            $("#DispatchCountry").text(data[0][0].AltCountry);
            $("#DispatchEmail").text(data[0][0].AltEmail);
            $("#DispatchMobileNumber").text(data[0][0].AltContactNumber);
            $("#DispatchStateId").text(data[0][0].AltStateCodeId);
            $("#DispatchGSTNumber").text(data[0][0].GSTNumber);
            $("#DispatchCompanyId").text(data[0][0].CompanyId);

            $("#DispatchAddressEdit").show();
        }
    }
    else {
        $("#DispatchName").text('');
        $("#DispatchAddress").text('');
        $("#DispatchCity").text('');
        $("#DispatchPlaceOfSupply").text('');
        $("#DispatchCountry").text('');
        $("#DispatchEmail").text('');
        $("#DispatchMobileNumber").text('');
        $("#DispatchStateId").text('');
        $("#DispatchGSTNumber").text('');
        $("#DispatchCompanyId").text('');

        $("#DispatchAddressEdit").hide();

    }

});

$(document).on('click', '#DispatchUpdateBtn', function () {


    var DispatchAddressFormValid = $("#FormDispatchtAddress").validate().form();

    if (DispatchAddressFormValid) {

        var objvalue = {};

        objvalue.AltAddressId = $("#FormDispatchtAddress #DispatchAddressId").text() == "" ? 0 : parseInt($("#FormDispatchtAddress #DispatchAddressId").text());
        objvalue.AliasName = $("#FormDispatchtAddress #DispatchName").val();
        objvalue.AltAddress = $("#FormDispatchtAddress #DispatchAddress").val();
        objvalue.AltCity = $("#FormDispatchtAddress #DispatchCity").val();
        objvalue.AltZipCode = $("#FormDispatchtAddress #DispatchZipCode").val();
        objvalue.AltStateCodeId = $("#FormDispatchtAddress #DispatchStateId").val() == "" ? 0 : parseInt($("#FormDispatchtAddress #DispatchStateId").val());
        objvalue.AltCountry = $("#FormDispatchtAddress #DispatchCountry").val();
        objvalue.AltContactNumber = $("#FormDispatchtAddress #DispatchMobileNumber").val();
        objvalue.AltEmail = $("#FormDispatchtAddress #DispatchEmail").val();
        objvalue.ModuleTypeId = parseInt($("#FormDispatchtAddress #DispatchCompanyId").text());
        objvalue.Type = "Company";

        Common.ajaxCall("POST", "/Companysetting/InsertUpdateAlternateAddress", JSON.stringify(objvalue), DispatchAddressSuccess, DispatchAddressError);
    }

});
async function DispatchAddressSuccess(response) {

    if (response.status) {


        DispatchCanvasClose();
        Common.successMsg("Dispatch Address Updated");

        var masterInfoId = parseInt($("#DispatchFrom").val());
        var moduleName = "SaleDispatchAddress";

        if (masterInfoId > 0) {
            var responseData = await Common.getAsycData("/Sale/DispatchAddressDetails?masterInfoId=" + masterInfoId + "&moduleName=" + moduleName);
            if (responseData !== null) {
                var data = JSON.parse(responseData);

                var city = data[0][0].AltCity;
                var zipcode = data[0][0].AltZipCode;
                var cityZipcode = city + " - " + zipcode;

                $("#DispatchName").text(data[0][0].AliasName);
                $("#DispatchAddress").text(data[0][0].AltAddress);
                $("#DispatchCity").text(cityZipcode);
                $("#DispatchPlaceOfSupply").text(data[0][0].StateName);
                $("#DispatchCountry").text(data[0][0].AltCountry);
                $("#DispatchEmail").text(data[0][0].AltEmail);
                $("#DispatchMobileNumber").text(data[0][0].AltContactNumber);
                $("#DispatchStateId").text(data[0][0].AltStateCodeId);
                $("#DispatchGSTNumber").text(data[0][0].GSTNumber);
                $("#DispatchCompanyId").text(data[0][0].CompanyId);
            }
        }
    }

}
function DispatchAddressError(response) {
    let message = 'An error occurred.';
    if (response && response.message) {
        message = response.message;
    }
    $('#loader-pms').hide();
    Common.errorMsg(message);
}
function DispatchCanvasOpen() {

    var DispatchFromId = $("#DispatchFrom").val();
    var DispatchName = $("#DispatchName").text();
    var DispatchAddress = $("#DispatchAddress").text();
    var DispatchCity = $('#DispatchCity').text().split('-')[0];
    var DispatchZipCode = $('#DispatchCity').text().split('-')[1];
    var DispatchStateId = $("#DispatchStateId").text();
    var DispatchCountry = $("#DispatchCountry").text();
    var DispatchEmail = $("#DispatchEmail").text();
    var DispatchMobileNumber = $("#DispatchMobileNumber").text();
    var DispatchCompanyId = $("#DispatchCompanyId").text();

    Common.bindDropDownParent('DispatchStateId', 'FormDispatchtAddress', 'StateCode', function () {
        $("#FormDispatchtAddress #DispatchStateId").val(DispatchStateId);
    });

    $("#FormDispatchtAddress #DispatchAddressId").text(DispatchFromId);
    $("#FormDispatchtAddress #DispatchCompanyId").text(DispatchCompanyId);
    $("#FormDispatchtAddress #DispatchName").val(DispatchName);
    $("#FormDispatchtAddress #DispatchAddress").val(DispatchAddress);
    $("#FormDispatchtAddress #DispatchCountry").val(DispatchCountry);
    $("#FormDispatchtAddress #DispatchStateId").val(DispatchStateId);
    $("#FormDispatchtAddress #DispatchCity").val(DispatchCity);
    $("#FormDispatchtAddress #DispatchZipCode").val(DispatchZipCode);
    $("#FormDispatchtAddress #DispatchMobileNumber").val(DispatchMobileNumber);
    $("#FormDispatchtAddress #DispatchEmail").val(DispatchEmail);

    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $(".DispatchAddressCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $(".DispatchAddressCanvas").css("width", "60%");
    } else {
        $(".DispatchAddressCanvas").css("width", "35%");
    }
    $('.content-overlay').fadeIn();
}
function DispatchCanvasClose() {

    $(".DispatchAddressCanvas").css("width", "0%");
    $('.content-overlay').fadeOut();
}

