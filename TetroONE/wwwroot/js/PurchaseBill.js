var selectedProductQuantity = [];
var selectedProductIdsList = [];
var selectedProductUnitId = [];
var MOPDropdown = [];
let selectedMOPs = new Set();
var formDataMultiple = new FormData();
var deletedFiles = [];
var existFiles = [];
var EditPurchaseBillId = 0;
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
    $('#PurchaseOrderNo').empty().append('<option value="">-- Select --</option>');

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
    //Common.handleDropdownError('#PurchaseInvoiceStatusId');

    /* -------------------- Validation For Inputs --------------------------- */

    initializePage(FranchiseMappingId);

    Common.bindDropDown('Vendor', 'Vendor');
    Common.bindDropDown('StateIdOFfCanvas', 'State');
    Common.bindDropDown('AlternativeCompanyAddress', 'Plant');
    $('#PurchaseOrderNo').tooltip({
        trigger: 'manual',
        placement: 'top',
        title: " choose Bill to & Ship to address"
    });

    $('#PurchaseOrderNo').hover(function () {
        $(this).tooltip('show'); // Show tooltip on hover
    }, function () {
        $(this).tooltip('hide'); // Hide tooltip when mouse leaves
    });



    $('#ShipToLocation').prop('disabled', true);
    $('#ShipToLocation').empty().append('<option value="">-- Select --</option>');
    $('.ShippingAddressIcon').hide();

    $("#addPartialPayment").prop('disabled', false);

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
    }
});

$(document).on('change', '#Vendor', function () {

    var value = $(this).val();
    if (value != "") {
        $('.overraphide').find('.error').remove();
    }
});

$(document).on('change', '#PurchaseInvoiceStatusId', function () {
    var selectedValue = $(this).val();

    let allChecked = $('.productlabel input[type="checkbox"]').length > 0 &&
        $('.productlabel input[type="checkbox"]').length === $('.productlabel input[type="checkbox"]:checked').length;
    var len = $('.productlabel input[type="checkbox"]').length;

    if (selectedValue == "2" && len == 0) {
        $(this).val("2");
        return;
    }
    else if (selectedValue == "2" && !allChecked) {
        Common.warningMsg("All quality checks must be completed before approval.");
        $(this).val("1");
        return;
    }
    if (selectedValue != "") {
        $('.statusError').find('.error').remove();
    }
});

async function initializePage(FranchiseMappingId) {

    $('.page-inner-footer').hide();
    var today = new Date().toISOString().split('T')[0];
    $("#InvoiceDate").val(today);
    //$("#InvoiceDate").attr("max", today);

    $('#AddAttachment').hide();

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
    Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseBill", EditDataId, PurchasebillSuccess, null);

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
        Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseBill", EditDataId, PurchasebillSuccess, null);
    });

    $('#increment-month-btn2').click(function () {

        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseBill", EditDataId, PurchasebillSuccess, null);
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
            Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseBill", EditDataId, PurchasebillSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseBill", EditDataId, PurchasebillSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });
}

function PurchasebillSuccess(response) {

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

        var columns = Common.bindColumn(data[1], ['PurchaseBillId', 'Status_Color']);
        Common.bindTablePurchase('PurchasebillData', data[1], columns, -1, 'PurchaseBillId', '330px', true, access);
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
    var EditDataId = { ModuleName: 'PurchaseBill', FranchiseId: ShipId };
    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "InvoiceNo", "PurchaseBillNo");
    });



});


/* ------------------------------------------- Vendor  Functionality  -----------------------------------------*/
$(document).on('change', '#VendorColumn #Vendor', async function () {

    if (disableChangeEvent) {
        return false;
    }

    var VendorId = $('#VendorColumn #Vendor').val();
    var ShipId = $('#ShippingColumn #AlternativeCompanyAddress').val();


    var responseData1 = await Common.getAsycData("/Common/VendorDetailsByVendorId?vendorId=" + parseInt(VendorId));
    if (responseData1 !== null) {
        Inventory.VendorAddressDetails(responseData1);
    } else {
        Inventory.ClearDataForVendorAddressDetails();
    }

    if (VendorId) {
        Inventory.updateGSTVisibility('#VendorStateName', '#StateName');
    }


    if (disableChangeEvent) {
        return false;
    }
    if (VendorId != null) {

        Common.ajaxCall("GET", "/PurchaseInvoice/GetInventoryNumberDetailsByVendorId", { moduleName: "PurchaseOrder", ModuleId: null, vendorId: parseInt(VendorId), ShipToFranchiseId: parseInt(ShipId) }, function (response) {
            Common.bindParentDropDownSuccessForChosen(response.data, 'PurchaseOrderNo', 'POColumn');
        }, null);
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
    var tablebody = $('#PIProductTablebody');
    var mainTable = $('#PIProductTable');
    var moduleName = 'Purchase';
    var stateSelector1 = "#VendorStateName";
    var stateSelector2 = "#StateName";
    $('#loader-pms').show();
    Inventory.AddProductsToMainTable(AllProductTable, tablebody, mainTable, moduleName, stateSelector1, stateSelector2);

});

$(document).on('click', '.DynremoveBtn', function () {
    const row = $(this).closest('tr');
    let productId = row.data('product-id');
    var mainTable = $('#PIProductTable');

    Inventory.RemoveProductMainRow(row, productId, mainTable);
});
$(document).on('input', '.SellingPrice', function () {

    const row = $(this).closest('tr');
    var mainTable = $('#PIProductTable');
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

    var tablebody = $('#PIProductTablebody');
    var mainTable = $('#PIProductTable');

    let existingRow = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`);
    let existingRowFirst = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`).first();

    Inventory.QuantityInputChange(finalQTY, row, QtyUnitDropDown, data, productId, tablebody, mainTable, existingRow, existingRowFirst);

    DiffrentQty(row, finalQTY);

});

function DiffrentQty(row, finalQTY) {
    var poQty = parseFloat(row.find('.POQty-cell').text()) || 0;
    var remainingQty = finalQTY - poQty;

    var differenceCell = row.find('.DifferenceCell');
    differenceCell.text(remainingQty);


    if (remainingQty < 0) {
        differenceCell.css('color', 'red');
    } else if (remainingQty > 0) {
        differenceCell.css('color', 'green');
    } else {
        differenceCell.css('color', 'blue');
    }
}

$(document).on('change', '.QtyUnitDropDown', function () {

    let rowElement = $(this).closest('tr');
    let selectedUnit = parseInt($(this).val());
    let productData = rowElement.data('product-info');
    let tableBody = $('#PIProductTablebody');
    var mainTable = $('#PIProductTable');
    Inventory.updateSellingPriceBasedOnUnitProductRow(selectedUnit, tableBody, rowElement, productData, mainTable);
});
$(document).on('click', '#AddItemBtn', function () {
    $('#loader-pms').show();
    var VendorId = $('#VendorColumn #Vendor').val();
    var mainTable = $("PIProductTable");
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
    //var totalMOP = 0;
    //$('.MOPAmount').each(function () {
    //    var value = parseFloat($(this).val()) || 0;
    //    totalMOP += value;
    //});

    //var static = parseFloat($('#PaymenyTextBox').val()) || 0;
    //var TotalAmount = totalMOP + static;

    var balanceAmount = grantTotal;
    $('#BalanceAmount').val(balanceAmount.toFixed(2)).css('color', balanceAmount > 0 ? 'red' : balanceAmount < 0 ? 'orange' : 'green');

}


/*  =================== ================ CRUD Functionlity  ===================================  */
$(document).on('click', '#AddVendorLable', function () {
    VendorAlignmentOpen();
});

$(document).on('click', '#AddPurchaseInvoice', function () {

    Common.removevalidation('FormBillFrom');
    Common.removevalidation('FormStatus');
    $('.ProductTableRow').empty();
    $("#PurchaseInvoiceStatusId").val('').trigger('change');
    EditPurchaseBillId = 0;

    $("#PurchaseInvoiceSaveBtn span:first").text("Save");
    $("#btnPordersaveprintbtn span:first").text("Save & Print");
    $("#btnPreviewPInvoicebtn span:first").text("Save & Preview");

    $('.page-inner-footer').show();
    VendorAlignmentClose();

    $("#ModalHeading").text("Add Purchase Invoice");
    //Common.ajaxCall("GET", "/Settings/GetCompanySetting", null, Inventory.CompanyAddressInPurchase, null);

    var EditDataId = { ModuleName: "PurchaseBill", ModuleId: null };


    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, function (response) {
        StatusSuccess(response);
        $('#PurchaseInvoiceStatusId').val(1).trigger('change');
    }, null);

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    $('#InvoiceDate').val(formattedDate);

    $('#PurchaseInvoiceModal').show();
    $('#POQTyColumn,#DifferenceColumn').hide();
    $('#PIQTyColumn').text('Quantity');
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    $('#AlternativeCompanyAddress').val(null).trigger('change');
    var EditDataId = { ModuleId: null, ModuleName: null };
    Common.ajaxCall("GET", "/Common/GetBillFromDDDetails", EditDataId, function (response) {
        var id = "BillFrom";
        Common.bindDropDownSuccess(response.data, id);
        $('#BillFrom').prop('selectedIndex', 1).trigger('change');
    }, null);
    selectedProductIdsList = [];
    $('#ViewBankLable').hide();
    $('.Status-Div').hide();
    $('.DynmicqcRow').empty();
    $("#PurchaseInvoiceModal .modal-body").animate({ scrollTop: 0 }, "fast");

})

function StatusSuccess(response) {
    var id = "PurchaseInvoiceStatusId";
    Common.bindDropDownSuccess(response.data, id);
}
$(document).on('click', '#PurchaseInvoiceCancelBtn,#PurchaseinvoiceClose', function () {

    $('#PurchaseInvoiceModal').hide();
    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseBill", EditDataId, PurchasebillSuccess, null);
    ResetDataDetails("others");
    Common.VendorRemoveValidation();
    $('#AlternativeCompanyAddress').val('').trigger('change');
});

$('#PurchasebillData').on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {

        var EditPurchaseBillId = $(this).data('id');
        Common.ajaxCall("GET", "/PurchaseInvoice/DeletePurchaseBillDetails", { PurchaseBillId: EditPurchaseBillId }, function (response) {
            response = response.status ? Common.successMsg(response.message) : Common.errorMsg(response.message);

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };

            Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseBill", EditDataId, PurchasebillSuccess, null);
        }, null);
    }
});

$(document).on('click', '#PurchaseInvoiceSaveBtn', function () {

    SavePurchaseINvoice(SavePurchasebillSuccess, SavePurchasebillError);
});
$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "PurchaseBill",
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

function SavePurchaseINvoice(successCallback, errorCallback) {

    getExistFiles();

    var RightSideHeaderFormIsValid = $("#FormRightSideHeader").validate().form();
    var ShippingFormIsValid = $("#FormShipping").validate().form();
    var VendorFormIsValid = $("#FormVendor").validate().form();
    var StatusFormIsValid = $("#FormStatus").validate().form();
    var BillFromIsValid = $("#FormBillFrom").validate().form();
    var DiscountFromIsValid = $("#frmtaxdiscountothers").validate().form();
    if (!RightSideHeaderFormIsValid || !ShippingFormIsValid || !VendorFormIsValid || !StatusFormIsValid || !BillFromIsValid || !DiscountFromIsValid) {
        $('#PurchaseInvoiceStatusId-error').insertAfter('#statusError');
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

    var PurchaseDetailsStatic = {};
    var vendorId = $('#Vendor').val();
    var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();

    var PIStatusId = $('#PurchaseInvoiceStatusId option:selected').text();
    PIStatusId = (PIStatusId == '-- Select --') ? null : $('#PurchaseInvoiceStatusId').val();

    var franchiseId = parseInt($('#UserFranchiseMappingId').val());

    PurchaseBillDetailsStatic = {
        PurchaseBillId: EditPurchaseBillId > 0 ? EditPurchaseBillId : null,
        VendorId: parseInt(vendorId),
        FranchiseId: franchiseId || null,
        ShipToFranchiseId: parseInt(alternativeCompanyAddress),
        BillFromFranchiseId: parseInt($('#BillFrom').val()),
        PurchaseBillNo: $('#InvoiceNo').val(),
        PurchaseBillDate: $('#InvoiceDate').val(),
        PurchaseOrderId: $('#PurchaseOrderNo').val(),

        OriginalInvoiceNo: $('#InvoiceNoOriginal').val(),
        TermsAndCondition: $('#TermsAndCondition').val(),
        Notes: $('#AddNotesText').val(),
        SubTotal: parseFloat($('#Subtotal').val() || 0.00),
        GrantTotal: parseFloat($('#GrantTotal').val() || 0.00),
        RoundOffValue: parseFloat($('#roundOff').val() || 0.00),
        BalanceAmount: parseFloat($('#BalanceAmount').val() || 0.00),
        PurchaseBillStatusId: parseInt(PIStatusId),
    };

    var PurchaseBillProductMappingDetails = [];

    $('#PIProductTablebody .ProductTableRow').each(function () {
        var $rowTable = $(this);
        var productId = $rowTable.data('product-id');
        var isIGSTVisible = $rowTable.find('.IGSTValues').is(':visible');
        if (isIGSTVisible) {
            var igstpercentage = Common.parseFloatValue($rowTable.find('#IGSTPercentage').val());
        } else {
            var igstpercentage = null;
        }
        var productDetail = {
            PurchaseBillProductMappingId: null,
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
            PurchaseBillId: EditPurchaseBillId > 0 ? EditPurchaseBillId : null,

        };
        PurchaseBillProductMappingDetails.push(productDetail);
    });

    var PurchaseBillOtherChargesMappingDetails = [];
    var PurhInvoiceOtherChargesMappingDetails = $("#dynamicBindRow .dynamicBindRow");

    $.each(PurhInvoiceOtherChargesMappingDetails, function (index, value) {
        var ispercentageval = $(value).find('#IsPercentage').attr('name');
        var oid = $(value).find('.taxandothers').val();

        if (oid != undefined) {
            PurchaseBillOtherChargesMappingDetails.push({
                PurchaseBillOtherChargesMappingId: null,
                PurchaseBillId: EditPurchaseBillId > 0 ? EditPurchaseBillId : null,
                OtherChargesId: parseInt($(value).find('.taxandothers').val() == "" ? 0 : $(this).find('.taxandothers').val()),
                OtherChargesType: $(value).find('.taxandothers').attr('OtherChargesType'),
                OtherChargesName: $(value).find('.taxandothers option:selected').text(),
                IsPercentage: Boolean($("input[name='" + ispercentageval + "']:checked").val() == '1' ? true : false),
                Value: parseFloat($(value).find('.calculateinventoryvalue').val() == "" ? 0 : $(this).find('.calculateinventoryvalue').val()),
                OtherChargeValue: parseFloat($(value).find('.otherChargeValue').val() == "" ? 0 : $(this).find('.otherChargeValue').val())
            });
        }
    });

    var PurchaseBillProductQCDetails = [];


    $('.DynmicqcRow .productlabel').each(function () {
        var productlabel = $(this);


        var productId = productlabel.find('h3').data('productid');
        productlabel.find('.set-container').each(function () {
            var container = $(this);
            var checkbox = container.find('input[type="checkbox"]');
            var textBox = container.find('input[type="text"]');

            if (checkbox.is(':checked')) {
                var qcDetail = {
                    PurchaseBillQCMappingId: null,
                    ProductId: productId,
                    ProductQCMappingId: checkbox.data('productqcmapid'),
                    Value: parseFloat(textBox.val()) || null,
                    PurchaseBillId: EditPurchaseBillId > 0 ? EditPurchaseBillId : null
                };
                PurchaseBillProductQCDetails.push(qcDetail);
            }
        });
    });



    formDataMultiple.append("PurchaseBillDetailsStatic", JSON.stringify(PurchaseBillDetailsStatic));
    formDataMultiple.append("PurchaseBillProductMappingDetails", JSON.stringify(PurchaseBillProductMappingDetails));
    formDataMultiple.append("PurchaseBillOtherChargesMappingDetails", JSON.stringify(PurchaseBillOtherChargesMappingDetails));
    formDataMultiple.append("PurchaseBillProductQCDetails", JSON.stringify(PurchaseBillProductQCDetails));
    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    $.ajax({
        type: "POST",
        url: "/PurchaseInvoice/InsertUpdatePurchaseBill",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: successCallback,
        error: errorCallback

    });

}
function SavePurchasebillSuccess(response) {
    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }

    formDataMultiple = new FormData();

    if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseBillId !== 'undefined') {
        EditPurchaseBillId = data[0][0].PurchaseBillId > 0 ? data[0][0].PurchaseBillId : 0;

    } else {
        EditPurchaseBillId = 0;
    }
    $('#loader-pms').hide();
    Common.successMsg(response.message);

    Common.VendorRemoveValidation();

    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseBill", EditDataId, PurchasebillSuccess, null);
    $('#PurchaseInvoiceModal').hide();

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    ResetDataDetails("others");
}

function SavePurchasebillError(response) {
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
        Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseBill", EditDataId, PurchasebillSuccess, null);
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
            ModuleName: "PurchaseBill",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

/* ====================================== NOT NULL GET ================================================= */
$('#PurchasebillData').on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    EditPurchaseBillId = $(this).data('id');
    var EditDataId = { ModuleName: "PurchaseBill", ModuleId: EditPurchaseBillId };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, StatusSuccess, null);
    editPurchaseBil(EditPurchaseBillId);

});
function editPurchaseBil(EditPurchaseBillId) {

    VendorAlignmentOpen();

    $("#PurchaseInvoiceSaveBtn span:first").text("Update");
    $("#btnPordersaveprintbtn span:first").text("Update & Print");
    $("#btnPreviewPInvoicebtn span:first").text("Update & Preview");

    $('.page-inner-footer').show();
    $('.Status-Div').show();
    $('#PurchaseInvoiceModal').show();
    $("#ModalHeading").text("Purchase Invoice Info");
    $("#PurchaseInvoiceModal .modal-body").animate({ scrollTop: 0 }, "fast");

    var EditDataId = { ModuleName: "PurchaseBill", ModuleId: EditPurchaseBillId };
    Common.ajaxCall("GET", "/Common/ActivityHistoryDetails", EditDataId, Inventory.StatusActivity, null);

    var EditDataId = { ModuleId: EditPurchaseBillId, ModuleName: "PurchaseBill" };
    Common.ajaxCall("GET", "/Common/GetBillFromDDDetails", EditDataId, function (response) {
        var id = "BillFrom";
        Common.bindDropDownSuccess(response.data, id);
    }, null);
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    var EditDataId = { PurchaseBillId: EditPurchaseBillId, FranchiseId: franchiseId };
    Common.ajaxCall("GET", "/PurchaseInvoice/NotNullGetPurchaseBill", EditDataId, PurchaseBillGetNotNull, null);
}
async function PurchaseBillGetNotNull(response) {

    disableChangeEvent = true;
    formDataMultiple = new FormData();

    if (response.status) {
        var data = JSON.parse(response.data);
        Common.ajaxCall("GET", "/PurchaseInvoice/GetInventoryNumberDetailsByVendorId", { moduleName: "PurchaseOrder", ModuleId: EditPurchaseBillId, vendorId: data[1][0].VendorId, ShipToFranchiseId: data[1][0].ShipToFranchiseId }, function (response) {
            Common.bindParentDropDownSuccessForChosen(response.data, 'PurchaseOrderNo', 'POColumn');

            setTimeout(function () {
                $('#PurchaseOrderNo').val(data[1][0].PurchaseOrderId).trigger('change');
                disableChangeEvent = false;
                AutoGenerateFlag = false;
                Inventory.updateGSTVisibility('#VendorStateName', '#StateName');
                $('#loader-pms').hide();
            }, 400);
        }, null);

        if (data[1].length > 0) {
            Common.bindData(data[0]);
            var piData = data[1][0];
            AutoGenerateFlag = true;
            $("#PurchaseInvoiceStatusId option").each(function () {
                if ($(this).val() !== "" && $(this).val() < piData.PurchaseBillStatusId) {
                    $(this).remove();
                }
            });
            purchBillId = piData.PurchaseBillId;
            $('#AlternativeCompanyAddress').val(piData.ShipToFranchiseId).trigger('change');


            Inventory.toggleField(piData.Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable");
            Inventory.toggleField(piData.TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");

            Inventory.toggleFieldForAttachment(data[3][0].AttachmentId, "#AddAttachLable", "#AddAttachment");

            $("#ViewBankLable").hide();
            $('#InvoiceNo').val(piData.PurchaseBillNo);
            $('#InvoiceDate').val(extractDate(piData.PurchaseBillDate));

            $('#InvoiceNoOriginal').val(piData.OriginalInvoiceNo);

            $('#BillFrom').val(piData.BillFromFranchiseId).trigger('change');

            $("#PurchaseOrderDate").val(extractDate(piData.PurchaseOrderDate));


        }
        var stateSelector1 = "#VendorStateName";
        var stateSelector2 = "#StateName";
        var tablebody = $('#PIProductTablebody');
        var mainTable = $('#PIProductTable');
        Inventory.PurchaseHeaderBindData(response);
        Inventory.bindSaleProducts(data[0], tablebody, mainTable, piData.PurchaseOrderId, stateSelector1, stateSelector2);
        let productQCData = data[3];
        /* let uniqueProductIds = [...new Set(productQCData.map(item => item.ProductId))];*/

        Inventory.bindQCDetails(productQCData);

        $('#dynamicBindRow').empty('');
        Inventory.bindOtherCharges(data[2]);

        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();
        Inventory.bindAttachments(data[4]);
        $('#PurchaseInvoiceStatusId').val(data[1][0].PurchaseBillStatusId).trigger('change');
    }

    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();

}

function extractDate(inputDate) {
    if (typeof inputDate !== 'string' || !inputDate.includes('T')) {
        return "";
    }
    var parts = inputDate.split('T');
    var datePart = parts[0];
    return datePart;
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


$(document).on('change', '.GrantTotal', function () {
    calculateBalance();
});
//function CreditLimitDetails() {

//    var grantTotal = $('#GrantTotal').val();
//    var maxcreditLimit = parseFloat($("#LimitValue").attr("maxcreditlimit"));
//    var currentCreditLimit = parseFloat($("#LimitValue").attr("currentcreditlimit"));
//    var availableCredit = parseFloat(maxcreditLimit - currentCreditLimit);

//    if (grantTotal > availableCredit) {
//        $('#LimitValue').text('Credit limit exceeded. Maximum Allowed Credit Limit is: ' + availableCredit);
//    } else {
//        $('#LimitValue').text('');
//    }
//}

/* ====================================== PO Id Change ================================================= */
$('#PurchaseOrderNo').on('change', function () {

    if (disableChangeEvent) {
        return false;
    }

    var poNumber = $('#PurchaseOrderNo').val();

    if (poNumber == "" || poNumber == null) {
        $('#PurchaseOrderDate').val(null);
        $("#ModeOfPaymentId").val('1');
    }

    if (poNumber != "" && poNumber != null) {
        ResetDataDetails("PurchaseOrder");
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/PurchaseInvoice/GetPurchaseDetails_ByPurchaseId", { PurchaseId: parseInt(poNumber), ModuleName: 'PurchaseOrder', FranchiseId: franchiseId }, POBindingNotNull, null);
    }
    else {
        ResetDataDetails("others");
        $('#POQTyColumn, #DifferenceColumn').hide();
    }

});
function POBindingNotNull(response) {
    var data = JSON.parse(response.data);

    var tablebody = $('#PIProductTablebody');
    var mainTable = $('#PIProductTable');

    if (data != null) {

        Inventory.toggleField(data[1][0].Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable");
        Inventory.toggleField(data[1][0].TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");

        Inventory.toggleFieldForAttachment(data[2][0].AttachmentId, "#AddAttachLable", "#AddAttachment");


        Inventory.bindSaleProducts(data[0], tablebody, mainTable, data[1][0].PurchaseOrderId);
        var selectedProductIds = data[0].map(x => x.ProductId);
        Inventory.callProductQC(selectedProductIds);

        $('#dynamicBindRow').empty('');
        //Inventory.bindOtherCharges(data[2]);

        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();
        Inventory.bindAttachments(data[2]);

        var podate = (data[1][0].PurchaseOrderDate).split('T');
        $("#PurchaseOrderDate").val(podate[0]);
        Inventory.updateGSTVisibility('#VendorStateName', '#StateName');

    }
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

    $('#PurchaseInvoiceNumberDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#PurchaseInvoiceDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#PurchaseOrderNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#OriginalInvoiceNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-12').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#POColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-12').addClass('col-lg-4 col-md-12 col-sm-12 col-12');

    $('#PurchaseOrderDateDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-12').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
}
function VendorAlignmentClose() {
    $('#AddVendorlableColumn').show();
    $('#BillFromColumn').hide();
    $('#VendorColumn').hide();
    $('#ShippingColumn').hide();
    $('#AddVendorlableColumn').removeClass('d-flex justify-content-center');

    $('#PurchaseInvoiceNumberDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#PurchaseInvoiceDateDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#PurchaseOrderNoDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#OriginalInvoiceNoDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#POColumn').addClass('col-lg-6 col-md-6 col-sm-6 col-12');
}


function resetCommonData() {
    $('#SubTotalTotal, #CGSTTotal, #SGSTTotal, #IGSTTotal, #CESSTotal').val('');

    $('#GrantTotal, #roundOff,#PaidFromDays,#InvoiceNoOriginal').val('');
    $('#TermsAndCondition, #AddNotesText').val('');
    $('#AddNotes').hide();
    $('#AddNotesLable').show();


    $('#AddAttachment').hide();
    $('#AddAttachLable').show();


    $('#AddTerms').hide();
    $('#AddTermsLable').show();

    $('#IsPartiallyPaid').prop('checked', false);
    $('#ModeOfPaymentId').val(1);
    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    selectedProductIdsList = [];
    $('#PIProductTable .ProductTableRow').remove();
    $('#dynamicBindRow').empty('');
    $('#appendContainer .input-group').slice(1).empty();
    $('.DynmicqcRow').empty();
    $('#AddAttachment').hide();
    $('#AddAttachLable').show();

    $('#roundOff').css('color', '#495057');
    $('#BalanceAmount').css('color', '#495057');

}
function ResetDataDetails(type) {


    resetCommonData();

    if (type == "others") {
        $('#appendContainer').empty('');
        $("#Vendor").val('').trigger('change');
        $("#BillFromAddress").text('');
    }
    else if (type == "empty") {

        $("#ShipType").val('').trigger('change');
        $("#Vendor").val('').trigger('change');
        $("#PurchaseOrderNo").val('').trigger('change');

        $("#VendorColumn #VendorName").text('');
        $("#VendorColumn #VendorAddress").text('');
        $("#VendorColumn #VendorCountry").text('');
        $("#VendorColumn #VendorCity").text('');
        $("#VendorColumn #StateCodeId").text('');
        $("#VendorColumn #VendorStateName").text('');
        $("#VendorColumn #VendorEmail").text('');
        $("#VendorColumn #VendorContactNumber").text('');
        $("#VendorColumn #VendorGSTNumber").text('');
    }

}

/* ====================================== Mail  ================================================= */
$(document).on('click', '#closeMail', function () {
    $("#SendMail").modal('hide');

    editPurchaseBil(EditPurchaseBillId);
});
$(document).on('click', '#PurchaseInvoiceMailBtn', function () {
    $('#loader-pms').show();
    $("#AttachmentArea").html('');

    $("#EmailDetails #Subject").val('Purchase Order');
    $('#ShareDropdownitems').css('display', 'none');

    SavePurchaseINvoice(MailAttachmentPurchasebillSuccess);
});
function MailAttachmentPurchasebillSuccess(response) {

    try {

        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }


    if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseBillId !== 'undefined') {
        EditPurchaseBillId = data[0][0].PurchaseBillId > 0 ? data[0][0].PurchaseBillId : 0;

    } else {

        EditPurchaseBillId = 0;

    }

    var moduleId = EditPurchaseBillId;
    if (moduleId > 0) {
        var EditDataId = { ModuleName: 'PurchaseBill', ModuleId: moduleId };
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
        $("#VendorEmail").val(data[0][0].VendorEmail);

        var poNumber = $("#InvoiceNo").val();
        var companyName = data[0][0].CompanyName;
        var vendorName = $('#Vendor option:selected').text();
        var orderDate = $('#InvoiceDate').val();
        if (orderDate) {
            var dateParts = orderDate.split("-"); // Split by hyphen
            orderDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearrange to DD-MM-YYYY
        }
        var deliveryAddress = data[0][0].FullAddress;
        var yourFullName = data[0][0].Fullname;
        var yourPosition = data[0][0].UserGroupName;

        // Create the email body content
        var emailBody = `

<div style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
    <div style="color: #007BFF; font-size: 16px;">
        Dear <strong>${vendorName}</strong>,
    </div>
    <p>Kindly find the attached purchase bill for your reference. Please confirm receipt at your earliest convenience.</p>
    <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3>Order Details</h3>
        <p><b style="color: #333;">Order Number&nbsp;&nbsp;&nbsp;&nbsp;:</b> ${poNumber}</p>
        <p><b style="color: #333;">Order Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> ${orderDate}</p>
        <p><b style="color: #333;">Delivery Address&nbsp;:</b> ${deliveryAddress}</p>
    </div>
    <p>Let us know if you need any additional information.</p>
    <div style="margin-top: 20px; font-size: 14px;">
        <p>Best regards,</p>
        <p style="font-weight:700;">${yourFullName},<br>${companyName}</p>
    </div>
</div>
`;

        // Set the email body content
        $("#EmailDetails .note-editable").html(emailBody);
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        printType = "Mail";
        var EditDataId = {
            ModuleId: parseInt(EditPurchaseBillId),
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };

        Common.ajaxCall("GET", "/PurchaseInvoice/PurchaseBillPrint", EditDataId, function (response) {
            Inventory.AttachmentPdfSuccess(response, "Purchase Invoice.PDF");
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

$(document).on('click', '#btnPreviewPInvoicebtn, #btnPordersaveprintbtn, #downloadLink', function () {

    printType = this.id === 'btnPreviewPInvoicebtn' ? 'Preview' :
        this.id === 'btnPordersaveprintbtn' ? 'Print' : 'Download';

    $('#loader-pms').show();
    SavePurchaseINvoice(GetPreviewAndDownloadAddress);
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


        if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseBillId !== 'undefined') {
            EditPurchaseBillId = data[0][0].PurchaseBillId > 0 ? data[0][0].PurchaseBillId : 0;
        } else {
            EditPurchaseBillId = 0;

        }

        var franchiseId = parseInt($('#UserFranchiseMappingId').val());

        var EditDataId = {
            ModuleId: parseInt(EditPurchaseBillId),
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/PurchaseInvoice/PurchaseBillPrint',
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
    const visibleColumns = $('#PIProductTable thead th:visible').length;
    const newWidth = 100 / visibleColumns + '%';

    $('#PIProductTable thead th:visible').css('width', newWidth);
    $('#PIProductTable tbody tr').each(function () {
        $(this).find('td:visible').css('width', newWidth);
    });
}

//================================================================================WhatsApp Sending===========================================================================
$(document).on('click', '#PurchaseInvoiceWhatsAppBtn', function () {
    SavePurchaseINvoice(GetWhatsAppDetails);
});

function GetWhatsAppDetails(response) {
    $('#SpinnerWhatsApp').show();

    formDataMultiple = new FormData();
    existFiles = [];

    if (response.status) {

        var data = JSON.parse(response.data);

        if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseBillId !== 'undefined') {
            EditPurchaseBillId = data[0][0].PurchaseBillId > 0 ? data[0][0].PurchaseBillId : 0;

        } else {

            EditPurchaseBillId = 0;

        }

        var franchiseId = parseInt($('#UserFranchiseMappingId').val());

        var EditDataId = {
            ModuleId: parseInt(EditPurchaseBillId),
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: "WhatsApp",
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/PurchaseInvoice/PurchaseBillPrint',
            method: 'GET',
            data: EditDataId,
            success: function (response) {

                $('#loader-pms').show();
                var moduleId = EditPurchaseBillId;
                if (moduleId > 0) {
                    Common.ajaxCall("GET", "/Common/GetInventoryWhatsappDetails", { ModuleName: "PurchaseBill", ModuleId: EditPurchaseBillId, FilePath: response.data }, DataWhatsAppDetails, null);
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
        $('#btnPordersaveprintbtn').click();
    }

    // Handling alt + v
    if (event.altKey && event.key === 'v') {
        event.preventDefault();
        $('#btnPreviewPInvoicebtn').click();
    }

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#PurchaseInvoiceSaveBtn').click();
    }

    // Handling alt + h
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        $('#btnsharePInvoice').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#PurchaseInvoiceCancelBtn').click();
    }

});