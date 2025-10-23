var selectedProductQuantity = [];
var selectedProductIdsList = [];
var selectedProductUnitId = [];
var MOPDropdown = [];
let selectedMOPs = new Set();
var formDataMultiple = new FormData();
var deletedFiles = [];
var existFiles = [];
var EditPurhOrder = 0;
var disableChangeEvent = false;
var AutoGenerateFlag = false;
var printType = "";
var PDFformat = "";
var StartDate;
var EndDate;
var TypeId = 1;
var FranchiseMappingId = 0;

$(document).ready(function () {

    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    $('#loader-pms').show();
    $('.Status-Div').hide();


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


    /* -------------------- Validation For Inputs --------------------------- */

    initializePage();

    Common.bindDropDown('Vendor', 'Vendor');

    Common.bindDropDown('StateIdOFfCanvas', 'State');
    Common.bindDropDown('AlternativeCompanyAddress', 'UserFranchiseMapping');

    Common.bindDropDown('ShipTo', 'Distributer_PO');
    Common.bindDropDown('BillFrom', 'Distributer_PO');

    $('#ShipToLocation').prop('disabled', true);
    $('#ShipToLocation').empty().append('<option value="">-- Select --</option>');
    $('.ShippingAddressIcon').hide();

    $("#addPartialPayment").prop('disabled', false);

    $('#BillFrom,#ShipTo').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });
});

$('#BillFrom').on('change', async function () {
    var DistributorId = $(this).val();
    if (DistributorId) {
        var responseData1 = await Common.getAsycData("/Common/DistributorDetailsByDistributorId?DistributorId=" + parseInt(DistributorId));
        if (responseData1 !== null) {
            BillFromAddressDetails(responseData1);
            $('#ShipTo').val(DistributorId).trigger('change');
            $('#ShipTo').prop('disabled', true);
        }
    } else {
        $('#BillFromAddress').text('');
        $('#ShipTo').prop('disabled', false);
    }
});
async function BillFromAddressDetails(response) {
    if (response) {
        var data = JSON.parse(response);

        $("#BillFromName").text(data[0][0].CompanyName || '');
        $("#BillFromAddress").text(data[0][0].DistributorAddress || '');
        $("#BillFromCountry").text(data[0][0].Country || '');
        $("#BillFromStateName").text(data[0][0].State || '');
        $("#VendorEmail").text(data[0][0].Email || '');
        $("#BillFromContactNumber").text(data[0][0].ContactNo || '');
        $("#BillFromGSTNumber").text(data[0][0].GSTNo || '');
        $("#StateCodeId").text(data[0][0].StateId);

        var city = data[0][0].City || '';
        var zipCode = data[0][0].ZipCode || '';

        // Concatenate City and ZipCode if both are available
        var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
        $("#BillFromCity").text(cityName || '');
    }
}

function handleButtonClick(typeId) {
    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: typeId };
    Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
}

$('#ToVendorGrid').on('click', function () {
    $('#AddPurchaseOrderBtn').show();
    handleButtonClick(1);
});

$('#FromDistributorGrid').on('click', function () {
    $('#AddPurchaseOrderBtn').hide();
    handleButtonClick(2);
});
$(document).on('change', '#Vendor', function () {

    var value = $(this).val();
    if (value != "") {
        $('.overraphide').find('.error').remove();
    }
});
//$("#PurchaseOrderDate").on("change", function () {
//    var selectedPODate = $(this).val();
//    $("#ExpectedDeliveryDate").attr("min", selectedPODate);


//    if ($("#ExpectedDeliveryDate").val() < selectedPODate) {
//        $("#ExpectedDeliveryDate").val("");
//    }
//});
$(document).on('change', '#PurchaseOrderStatusId', function () {

    var value = $(this).val();
    if (value != "") {
        $('.statusError').find('.error').remove();
    }
});
async function initializePage() {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    $('.page-inner-footer').hide();
    var today = new Date().toISOString().split('T')[0];
    $("#PurchaseOrderDate").val(today);
    var fnData = Common.getDateFilter('dateDisplay2');

    //$("#PurchaseOrderDate").attr("max", today);

    //var today = new Date().toISOString().split('T')[0];
    //$("#ExpectedDeliveryDate").attr("min", today);

    $('#AddAttachment').hide();

    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    if ($('#ToVendorGrid').hasClass('purchaseactive')) {
        TypeId = 1;
    } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
        TypeId = 2;
    }
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };

    Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);

    let MOPDropdownVal = await Common.bindDropDownSync('ModeOfPayment');
    Common.bindDropDownSuccess(MOPDropdownVal, 'ModeOfPaymentId');
    MOPDropdown = JSON.parse(MOPDropdownVal);

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
        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };
        Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
    });

    $('#increment-month-btn2').click(function () {

        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        if ($('#ToVendorGrid').hasClass('purchaseactive')) {
            TypeId = 1;
        } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
            TypeId = 2;
        }

        var fnData = Common.getDateFilter('dateDisplay2');
        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };
        Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
    });

    function updateMonthDisplay(date) {
        let monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear();
        $('#dateDisplay2').text(month + " " + year);

        // Hide increment button if displayedDate is current or future
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
            if ($('#ToVendorGrid').hasClass('purchaseactive')) {
                TypeId = 1;
            } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
                TypeId = 2;
            }

            var EditDataId = { FranchiseId: parseInt(FranchiseId), FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), TypeId: TypeId };
            Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);

        if ($('#ToVendorGrid').hasClass('purchaseactive')) {
            TypeId = 1;
        } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
            TypeId = 2;
        }

        var EditDataId = { FranchiseId: parseInt(FranchiseId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), TypeId: TypeId };
        Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });
}

function POSuccess(response) {

    if (response.status) {

        var data = JSON.parse(response.data);

        var CounterBox = Object.keys(data[0][0]);

        //$("#lblCounterBox1").text(CounterBox[0]);
        //$("#lblCounterBox2").text(CounterBox[1]);
        //$("#lblCounterBox3").text(CounterBox[2]);
        //$("#lblCounterBox4").text(CounterBox[3]);

        //$('#valCounterBox1').text(data[0][0][CounterBox[0]]);
        //$('#valCounterBox2').text(data[0][0][CounterBox[1]]);
        //$('#valCounterBox3').text(data[0][0][CounterBox[2]]);
        //$('#valCounterBox4').text(data[0][0][CounterBox[3]]);

        $("#lblCounterBox1").text('Total');
        $("#lblCounterBox2").text('Sent');
        $("#lblCounterBox3").text('Accepted');
        $("#lblCounterBox4").text('Converted to TI');

        $('#valCounterBox1').text('74 / ₹ 5,45,952.00');
        $('#valCounterBox2').text('23 / ₹ 1,43,704.00');
        $('#valCounterBox3').text('34 / ₹ 3,04,380.00');
        $('#valCounterBox4').text('17 / ₹ 23,900.00');

        var columns = Common.bindColumn(data[1], ['PurchaseOrderId_DBT', 'Status_Color']);
        Common.bindTablePurchase('PurchaseOrderData', data[1], columns, -1, 'PurchaseOrderId_DBT', '330px', true, access);
        $('#loader-pms').hide();
    }
}

/* ------------------------------------------- Vendor  Functionality  -----------------------------------------*/
$(document).on('change', '#VendorColumn #ShipTo', async function () {

    var ClientId = $(this).val();

    var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(ClientId));
    if (responseData1 !== null) {
        Inventory.VendorAddressDetails(responseData1);
    }


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
    var tablebody = $('#POProductTablebody');
    var mainTable = $('#POProductTable');
    var moduleName = 'Sale';
    $('#loader-pms').show();
    Inventory.AddProductsToMainTable(AllProductTable, tablebody, mainTable, moduleName);

});

$(document).on('click', '.DynremoveBtn', function () {
    const row = $(this).closest('tr');
    let productId = row.data('product-id');
    var mainTable = $('#POProductTable');

    Inventory.RemoveProductMainRow(row, productId, mainTable);
});
$(document).on('input', '.SellingPrice', function () {

    const row = $(this).closest('tr');
    var mainTable = $('#POProductTable');
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

    var tablebody = $('#POProductTablebody');
    var mainTable = $('#POProductTable');

    let existingRow = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`);
    let existingRowFirst = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`).first();

    Inventory.QuantityInputChange(finalQTY, row, QtyUnitDropDown, data, productId, tablebody, mainTable, existingRow, existingRowFirst);
});


$(document).on('change', '.QtyUnitDropDown', function () {

    let rowElement = $(this).closest('tr');
    let selectedUnit = parseInt($(this).val());
    let productData = rowElement.data('product-info');
    let tableBody = $('#POProductTablebody');
    var mainTable = $('#POProductTable');
    Inventory.updateSellingPriceBasedOnUnitProductRow(selectedUnit, tableBody, rowElement, productData, mainTable);
});
$(document).on('click', '#AddItemBtn', function () {

    $('#loader-pms').show();
    var mainTable = $("POProductTable");
    var moduleName = 'Sale';
    var VendorId = $('#BillFrom').val();
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    if (VendorId) {
        $('#AddProductModal').show();
        Inventory.AllProductTable(mainTable, moduleName, VendorId, FranchiseMappingId);
        $(".TotalSelectedItmsCount,.TotalSelctAmount").hide();
    } else {
        Common.warningMsg("Choose a Distributor to Continue.");
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

$(document).on('click', '#AddPurchaseOrderBtn', function () {

    Common.removevalidation('FormBillFrom');
    Common.removevalidation('FormStatus');

    $('.ProductTableRow').empty();
    $("#PurchaseOrderStatusId").val('').trigger('change');
    EditPurhOrder = 0;

    $("#PurchaseOrderSaveBtn span:first").text("Save");
    $("#btnPordersaveprintbtn span:first").text("Save & Print");
    $("#btnPreviewPorder span:first").text("Save & Preview");

    $('.page-inner-footer').show();
    $('.Status-Div').hide();
    VendorAlignmentClose();
    $("#ModalHeading").text("Add Purchase Order ");



    var EditDataId = { ModuleName: "PurchaseOrder_DBT", ModuleId: null };

    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, function (response) {
        StatusSuccess(response);
        $('#PurchaseOrderStatusId').val(1).trigger('change');
    }, null);



    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    $('#PurchaseOrderDate').val(formattedDate);


    $("#ExpectedDeliveryDate").val(formattedDate);
    //$("#ExpectedDeliveryDate").attr("min", formattedDate);

    //if ($("#ExpectedDeliveryDate").val() < formattedDate) {
    //    $("#ExpectedDeliveryDate").val("");
    //}

    $('#PurchaseOrderModal').show();
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    $('#AlternativeCompanyAddress').val(FranchiseMappingId).trigger('change');


    selectedProductIdsList = [];
    $('#ViewBankLable').hide();
    $("#PurchaseOrderModal .modal-body").animate({ scrollTop: 0 }, "fast");

    //autoSelectIfSingle($('#BillFrom'));
    //autoSelectIfSingle($('#ShipTo'));
})

function autoSelectIfSingle($select) {
    var realOptions = $select.find('option').filter(function () {
        return $(this).val() !== "";
    });

    if (realOptions.length === 1) {
        realOptions.prop('selected', true);
        $select.prop('disabled', true).trigger('change');
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

            Inventory.updateGSTVisibility();
        }
    }, null);

    if (AutoGenerateFlag) {
        return false;
    }
    var ShipId = $('#ShippingColumn #AlternativeCompanyAddress').val();
    var EditDataId = { ModuleName: 'Distributor_PO', FranchiseId: ShipId };

    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "PurchaseOrderNumber", "PurchaseOrderNo_DBT");
    });


});

function StatusSuccess(response) {
    var id = "PurchaseOrderStatusId";
    Common.bindDropDownSuccess(response.data, id);
}
$(document).on('click', '#PurchaseOrderCancelBtn,#PurchaseOrderClose', function () {
    $('#PurchaseOrderModal').hide();
    if ($('#ToVendorGrid').hasClass('purchaseactive')) {
        TypeId = 1;
    } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
        TypeId = 2;
    }
    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };

    Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);

    ResetDataDetails("others");
    Common.VendorRemoveValidation();
    $('#AlternativeCompanyAddress').val('').trigger('change');
});

$('#PurchaseOrderData').on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {

        var EditPurhOrder = $(this).data('id');
        Common.ajaxCall("GET", "/DPO/DeletePurchaseOrderDetails", { purchaseOrderId: EditPurhOrder }, function (response) {
            response = response.status ? Common.successMsg(response.message) : Common.errorMsg(response.message);

            if ($('#ToVendorGrid').hasClass('purchaseactive')) {
                TypeId = 1;
            } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
                TypeId = 2;
            }

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };

            Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
        }, null);
    }
});

$(document).on('click', '#PurchaseOrderSaveBtn', function () {

    SavePurchaseOrder(PurshaceOrderSuccess, PurshaceOrderError);
});
$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "PurchaseOrder",
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


function SavePurchaseOrder(successCallback, errorCallback) {

    getExistFiles();

    var RightSideHeaderFormIsValid = $("#FormRightSideHeader").validate().form();
    var ShippingFormIsValid = $("#FormShipping").validate().form();
    var VendorFormIsValid = $("#FormVendor").validate().form();
    var StatusFormIsValid = $("#FormStatus").validate().form();
    var BillFromIsValid = $("#FormBillFrom").validate().form();
    if (!RightSideHeaderFormIsValid || !ShippingFormIsValid || !VendorFormIsValid || !StatusFormIsValid || !BillFromIsValid) {
        $('#PurchaseOrderStatusId-error').insertAfter('#statusError');
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
    var vendorId = $('#ShipTo').val();
    var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();
    var franchiseId = parseInt($('#BillFrom').val());

    var POStatusId = $('#PurchaseOrderStatusId option:selected').text();
    POStatusId = (POStatusId == '-- Select --') ? null : $('#PurchaseOrderStatusId').val();
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));


    PurchaseDetailsStatic = {
        PurchaseOrderId: EditPurhOrder > 0 ? EditPurhOrder : null,
        PurchaseOrderNo: $('#PurchaseOrderNumber').val(),
        VendorId: parseInt(vendorId),
        ShipToFranchiseId: parseInt(alternativeCompanyAddress),
        FranchiseId: parseInt(FranchiseMappingId),
        BillFromFranchiseId: parseInt(vendorId),
        PurchaseOrderDate: $('#PurchaseOrderDate').val(),
        ExpectedDeliveryDate: $('#ExpectedDeliveryDate').val(),
        TermsAndCondition: $('#TermsAndCondition').val() || null,
        Notes: $('#AddNotesText').val() || null,
        SubTotal: parseFloat($('#Subtotal').val() || 0.00),
        GrantTotal: parseFloat($('#GrantTotal').val() || 0.00),
        RoundOffValue: parseFloat($('#roundOff').val() || 0.00),
        PurchaseOrderStatusId: parseInt(POStatusId),
    };

    var PurchaseOrderProductMappingDetails = [];

    $('#POProductTablebody .ProductTableRow').each(function () {
        var $rowTable = $(this);
        var productId = $rowTable.data('product-id');

        var productDetail = {
            PurchaseOrderProductMappingId: null,
            PurchaseOrderId: EditPurhOrder > 0 ? EditPurhOrder : null,
            ProductId: parseInt(productId),
            ProductDescription: $rowTable.find('.descriptiontdtext').val(),
            PurchasePrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()),
            Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val() || 0),
            UnitId: parseInt($rowTable.find('.QtyUnitDropDown').val()),

            SubTotal: Common.parseFloatValue($rowTable.find('#subtotalAmount').val()),
            CGST_Percentage: Common.parseFloatValue($rowTable.find('#CGSTPercentage').val()),
            CGST_Value: Common.parseFloatValue($rowTable.find('#CGSTAmount').val()),
            SGST_Percentage: Common.parseFloatValue($rowTable.find('#SGSTPercentage').val()),
            SGST_Value: Common.parseFloatValue($rowTable.find('#SGSTAmount').val()),
            IGST_Percentage: Common.parseFloatValue($rowTable.find('#IGSTPercentage').val()),
            IGST_Value: Common.parseFloatValue($rowTable.find('#IGSTAmount').val()),
            CESS_Percentage: Common.parseFloatValue($rowTable.find('#CESSPercentage').val()),
            CESS_Value: Common.parseFloatValue($rowTable.find('#CESSAmount').val()),
            TotalAmount: Common.parseFloatValue($rowTable.find('.Totalamount-cell').text())
        };
        PurchaseOrderProductMappingDetails.push(productDetail);
    });



    formDataMultiple.append("PurchaseDetailsStatic", JSON.stringify(PurchaseDetailsStatic));
    formDataMultiple.append("PurchaseOrderProductMappingDetails", JSON.stringify(PurchaseOrderProductMappingDetails));
    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    $.ajax({
        type: "POST",
        url: "/DPO/InsertUpdatePurchaseOrder",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: successCallback,
        error: errorCallback

    });

}
function PurshaceOrderSuccess(response) {
    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }

    formDataMultiple = new FormData();

    if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseOrderId_DBT !== 'undefined') {
        EditPurhOrder = data[0][0].PurchaseOrderId_DBT > 0 ? data[0][0].PurchaseOrderId_DBT : 0;

    } else {
        EditPurhOrder = 0;
    }
    $('#loader-pms').hide();
    Common.successMsg(response.message);

    Common.VendorRemoveValidation();


    if ($('#ToVendorGrid').hasClass('purchaseactive')) {
        TypeId = 1;
    } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
        TypeId = 2;
    }

    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };

    Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
    $('#PurchaseOrderModal').hide();

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

        if ($('#ToVendorGrid').hasClass('purchaseactive')) {
            TypeId = 1;
        } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
            TypeId = 2;
        }

        var fnData = Common.getDateFilter('dateDisplay2');
        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };

        Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
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
            ModuleName: "PurchaseOrder",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

/* ====================================== NOT NULL GET ================================================= */
function setDropdownIfChanged($el, newVal) {
    if ($el.val() !== newVal.toString()) {
        $el.val(newVal).trigger('change');
    }
}

// Convert ajaxCall to return a Promise
Common.promiseAjaxCall = function (method, url, data) {
    return new Promise(function (resolve, reject) {
        Common.ajaxCall(method, url, data, resolve, reject);
    });
};

$('#PurchaseOrderData').on('click', '.btn-edit', function () {
    $('#loader-pms').show();

    EditPurhOrder = $(this).data('id');
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());

    const getStatus = Common.promiseAjaxCall("GET", "/Common/GetInventoryStatusDetails", {
        ModuleName: "PurchaseOrder_DBT",
        ModuleId: EditPurhOrder
    });

    const getActivity = Common.promiseAjaxCall("GET", "/Common/ActivityHistoryDetails", {
        ModuleName: "PurchaseOrder_DBT",
        ModuleId: EditPurhOrder
    });

    const getBillFrom = Common.promiseAjaxCall("GET", "/Common/GetBillFromDDDetails", {
        ModuleName: "PurchaseOrder_DBT",
        ModuleId: EditPurhOrder
    });

    const getPurchaseData = Common.promiseAjaxCall("GET", "/DPO/NotNullGetPurchaseOrder", {
        PurchaseOrderId: EditPurhOrder,
        FranchiseId: franchiseId
    });

    Promise.all([getStatus, getActivity, getBillFrom, getPurchaseData]).then(function ([statusRes, activityRes, billFromRes, poRes]) {
        StatusSuccess(statusRes);
        Inventory.StatusActivity(activityRes);
        Common.bindDropDownSuccess(billFromRes.data, "BillFrom");

        handlePurchaseDataBind(poRes);

    }).catch(function (err) {
        console.error("Error in AJAX calls:", err);
        $('#loader-pms').hide();
    });
});

function StatusSuccess(response) {
    var id = "PurchaseOrderStatusId";
    Common.bindDropDownSuccess(response.data, id);
}

async function handlePurchaseDataBind(response) {
    disableChangeEvent = true;
    formDataMultiple = new FormData();

    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[1].length > 0) {
            var poData = data[1][0];
            AutoGenerateFlag = true;

            $("#PurchaseOrderStatusId option").each(function () {
                if ($(this).val() !== "" && $(this).val() < poData.PurchaseOrderStatusId_DBT) {
                    $(this).remove();
                }
            });

            $('#PurchaseOrderDate').val(extractDate(poData.PurchaseOrderDate_DBT));
            $('#PurchaseOrderNumber').val(poData.PurchaseOrderNo_DBT);
            $('#ExpectedDeliveryDate').val(extractDate(poData.ExpectedDeliveryDate_DBT));

            setDropdownIfChanged($('#PurchaseOrderStatusId'), poData.PurchaseOrderStatusId_DBT);
            autoSelectIfSingle($('#BillFrom'));
            autoSelectIfSingle($('#ShipTo'));
            $('#AlternativeCompanyAddress').val(poData.ShipToFranchiseId_DBT).trigger('change');

            Common.bindData(data[0]);

            EditPurhOrder = poData.PurchaseOrderId_DBT;

            Inventory.toggleField(poData.Notes_DBT, "#AddNotesText", "#AddNotes", "#AddNotesLable");
            Inventory.toggleField(poData.TermsAndCondition_DBT, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
            Inventory.toggleFieldForAttachment(data[2][0]?.AttachmentId, "#AddAttachLable", "#AddAttachment");
        }


        var tablebody = $('#POProductTablebody');
        var mainTable = $('#POProductTable');
        Inventory.bindSaleProducts(data[0], tablebody, mainTable, null);

        $('#selectedFiles,#ExistselectedFiles').empty();
        existFiles = [];
        formDataMultiple = new FormData();
        Inventory.bindAttachments(data[2]);

        Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
        calculateBalance();


        showPurchaseOrderModal();

        disableChangeEvent = false;
        AutoGenerateFlag = false;
        Inventory.updateGSTVisibility();
    }

    $('#loader-pms').hide();
}

function showPurchaseOrderModal() {
    VendorAlignmentOpen();

    $("#PurchaseOrderSaveBtn span:first").text("Update");
    $("#btnPordersaveprintbtn span:first").text("Update & Print");
    $("#btnPreviewPorder span:first").text("Update & Preview");

    $('.page-inner-footer').show();
    $('#ModalHeading').text('Purchase Order Info');
    $('.Status-Div').show();
    $('#PurchaseOrderModal').show();
    $("#PurchaseOrderModal .modal-body").animate({ scrollTop: 0 }, "fast");
}

function autoSelectIfSingle($select) {
    const realOptions = $select.find('option').filter(function () {
        return $(this).val() !== "";
    });

    if (realOptions.length === 1) {
        realOptions.prop('selected', true);
        $select.prop('disabled', true).trigger('change');
    }
}

function setDropdownIfChanged($select, newVal) {
    if ($select.val() !== newVal) {
        $select.val(newVal).trigger('change');
    }
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
    /*   $('#AddVendorlableColumn').hide();*/
    $('#BillFromColumn').show();
    $('#VendorColumn').show();
    $('#ShippingColumn').show();
    //$('#AddVendorlableColumn').removeClass('d-flex justify-content-center');

    //$('#PurchaseOrderNumberDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    //$('#PurchaseOrderDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    //$('#ExpectedDeliveryDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    //$('#POColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-12').addClass('col-lg-4 col-md-12 col-sm-12 col-12');
    $("#ShipToLocation").prop('disabled', false);
}
function VendorAlignmentClose() {

    //$('#AddVendorlableColumn').show();
    $('#BillFromColumn').show();
    $('#VendorColumn').show();
    $('#ShippingColumn').show();

    //$('#PurchaseOrderNumberDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    //$('#PurchaseOrderDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    //$('#ExpectedDeliveryDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    //$('#POColumn').addClass('col-lg-6 col-md-6 col-sm-6 col-12');
}


function resetCommonData() {
    $('#discounttotal, #GSTtotal, #CESSTotal, #StateCESSTotal, #Subtotal,#GrantTotal,#roundOff,#BalanceAmount').val('');
    $('#SubTotalTotal, #CGSTTotal, #SGSTTotal, #IGSTTotal, #CESSTotal').val('');
    selectedProductIdsList = [];

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    $('#BillFrom, #ShipTo').val('').trigger('change');
    $('#BillFrom, #ShipTo').prop('disabled', false);
    $('#POProductTable .ProductTableRow').remove();
    $('#dynamicBindRow').empty('');
    $('#appendContainer .input-group').slice(1).empty();
    $('#PurchaseOrderStatusId').val('').trigger('change');
}
function ResetDataDetails(type) {
    resetCommonData();

    if (type !== 'Vendor') {

        $('#ClientColumn, #ShippingColumn, #AddNotes, #AddTerms, #AddAttachment').hide();
        $('#AddVendorlableColumn, #AddNotesLable, #AddTermsLable, #AddAttachLable').show();
        $('#AddNotesText, #TermsAndCondition').val('');
        $('#AddBankDetails #AccountName, #AddBankDetails #BankName, #AddBankDetails #BranchName, #AddBankDetails #AccountNo, #AddBankDetails #AccountType, #AddBankDetails #IFSCCode, #AddBankDetails #UPIID,#BillFromAddress').text('');

    } else {

    }
}


/* ====================================== Mail  ================================================= */
$(document).on('click', '#closeMail', function () {
    $("#SendMail").modal('hide');

    editPurchaseOrder(EditPurhOrder);
});
$(document).on('click', '#PurchaseOrderMailBtn', function () {
    $('#loader-pms').show();
    $("#AttachmentArea").html('');

    $("#EmailDetails #Subject").val('Purchase Order');
    $('#ShareDropdownitems').css('display', 'none');

    SavePurchaseOrder(MailAttachmentPOSuccess);
});
function MailAttachmentPOSuccess(response) {

    try {

        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }


    if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseOrderId_DBT !== 'undefined') {
        EditPurhOrder = data[0][0].PurchaseOrderId_DBT > 0 ? data[0][0].PurchaseOrderId_DBT : 0;

    } else {

        EditPurhOrder = 0;

    }

    var moduleId = EditPurhOrder;
    if (moduleId > 0) {
        var EditDataId = { ModuleName: 'PurchaseOrder', ModuleId: moduleId };
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

        var poNumber = $('#PurchaseOrderNumber').val();
        var companyName = data[0][0].CompanyName;
        var vendorName = $('#Vendor option:selected').text();

        var orderDate = $('#PurchaseOrderDate').val();
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
    <p>We kindly ask you to review the attached document and confirm receipt.</p>
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



        var selectedText = $("#ShipType option:selected").text();
        var aliasName = (selectedText === "-- Select --") ? null : selectedText;
        if (aliasName === 'Store') {
            var IsStore = true;
        } else if (aliasName === 'Warehouse') {
            var IsStore = false;
        }
        printType = "Mail";

        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditPurhOrder),
            IsStore: IsStore,
            ShippingAddressId: $("#ShipToLocation").val(),
            ContactId: parseInt($("#BillFrom").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };

        Common.ajaxCall("GET", "/DPO/PurchaseOrderPrint", EditDataId, function (response) {
            Inventory.AttachmentPdfSuccess(response, "Purchase Order.PDF");
        }, null);
    }
}
$(document).on('click', '#SendButton', function () {
    1
    $('#loader-pms').show();
    $('#SendButton').html('Sending...');

    Inventory.EmailSendbutton();
    $('#SendButton').html('Send');

});

/*============================================PREVIEW & DOWNLOAD & PRINT =============================================================*/

$(document).on('click', '#btnPreviewPorder, #btnPordersaveprintbtn, #downloadLink', function () {

    printType = this.id === 'btnPreviewPorder' ? 'Preview' :
        this.id === 'btnPordersaveprintbtn' ? 'Print' : 'Download';

    $('#loader-pms').show();
    SavePurchaseOrder(GetPreviewAndDownloadAddress, ErrorPDF);
});
function ErrorPDF(response) {
    $('#loader-pms').hide();
}

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


        if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseOrderId_DBT !== 'undefined') {
            EditPurhOrder = data[0][0].PurchaseOrderId_DBT > 0 ? data[0][0].PurchaseOrderId_DBT : 0;

        } else {

            EditPurhOrder = 0;

        }
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditPurhOrder),
            ContactId: parseInt($("#BillFrom").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/DPO/PurchaseOrderPrint',
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
                                              <head><title>Purchase Order Preview</title></head>
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
                    link.download = 'Purchase Order.pdf';
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
    const visibleColumns = $('#POProductTable thead th:visible').length;
    const newWidth = 100 / visibleColumns + '%';

    $('#POProductTable thead th:visible').css('width', newWidth);
    $('#POProductTable tbody tr').each(function () {
        $(this).find('td:visible').css('width', newWidth);
    });
}

//================================================================================WhatsApp Sending===========================================================================
$(document).on('click', '#PurchaseOrderWhatsAppBtn', function () {
    SavePurchaseOrder(GetWhatsAppDetails);
});

function GetWhatsAppDetails(response) {
    $('#SpinnerWhatsApp').show();

    formDataMultiple = new FormData();
    existFiles = [];

    if (response.status) {

        var data = JSON.parse(response.data);

        if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseOrderId_DBT !== 'undefined') {
            EditPurhOrder = data[0][0].PurchaseOrderId_DBT > 0 ? data[0][0].PurchaseOrderId_DBT : 0;

        } else {

            EditPurhOrder = 0;

        }
        var selectedText = $("#ShipType option:selected").text();
        var aliasName = (selectedText === "-- Select --") ? null : selectedText;
        if (aliasName === 'Store') {
            var IsStore = true;
        } else if (aliasName === 'Warehouse') {
            var IsStore = false;
        }
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditPurhOrder),
            IsStore: IsStore,
            ShippingAddressId: $("#ShipToLocation").val(),
            ContactId: parseInt($("#BillFrom").val()),
            NoOfCopies: 1,
            printType: "WhatsApp",
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/DPO/PurchaseOrderPrint',
            method: 'GET',
            data: EditDataId,
            success: function (response) {

                $('#loader-pms').show();
                var moduleId = EditPurhOrder;
                if (moduleId > 0) {
                    Common.ajaxCall("GET", "/Common/GetInventoryWhatsappDetails", { ModuleName: "PurchaseOrder", ModuleId: EditPurhOrder, FilePath: response.data }, DataWhatsAppDetails, null);
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
        $('#btnPreviewPorder').click();
    }

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#PurchaseOrderSaveBtn').click();
    }

    // Handling alt + h
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        $('#btnsharePorder').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#PurchaseOrderCancelBtn').click();
    }

});

/*========================================================================================================*/

//let currentDate = new Date();
//let currentMonth = currentDate.getMonth();
//let currentYear = currentDate.getFullYear();

//let displayedDate = new Date(currentYear, currentMonth);
//updateMonthDisplay(displayedDate);
//$('#increment-month-btn2').hide();

//$(document).off('click', '#decrement-month-btn2').on('click', '#decrement-month-btn2', function () {
//    displayedDate.setMonth(displayedDate.getMonth() - 1);
//    updateMonthDisplay(displayedDate);
//    $('#increment-month-btn2').show();
//    updateStartAndEndDates(displayedDate);
//});

//$(document).off('click', '#increment-month-btn2').on('click', '#increment-month-btn2', function () {
//    displayedDate.setMonth(displayedDate.getMonth() + 1);
//    updateMonthDisplay(displayedDate);
//    if (displayedDate.getFullYear() > currentYear ||
//        (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() >= currentMonth)) {
//        $('#increment-month-btn2').hide();
//    }
//    updateStartAndEndDates(displayedDate);
//});

//function updateMonthDisplay(date) {
//    let monthNames = [
//        "January", "February", "March", "April", "May", "June",
//        "July", "August", "September", "October", "November", "December"
//    ];
//    let month = monthNames[date.getMonth()];
//    let year = date.getFullYear();
//    $('#dateDisplay2').text(month + " " + year);
//    if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
//        $('#increment-month-btn2').hide();
//    }
//    updateStartAndEndDates(date);
//}
//function formatDateForSQL(date) {
//    return date.getFullYear() + "-" +
//        String(date.getMonth() + 1).padStart(2, '0') + "-" +
//        String(date.getDate()).padStart(2, '0');
//}
//function updateStartAndEndDates(date) {
//    if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
//        StartDate = new Date(currentYear, currentMonth, 1);
//        EndDate = new Date();

//    } else {
//        StartDate = new Date(date.getFullYear(), date.getMonth(), 1);
//        EndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//    }
//    var formattedStartDate = formatDateForSQL(StartDate);
//    var formattedEndDate = formatDateForSQL(EndDate);
//    var franchiseId = parseInt(localStorage.getItem('FranchiseId'));
//    if ($('#ToVendorGrid').hasClass('purchaseactive')) {
//        TypeId = 1;
//    } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
//        TypeId = 2;
//    }
//    var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: franchiseId, TypeId: TypeId };

//    Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
//}
//$(document).on("change", "#FromDate, #ToDate", function () {

//    let StartDate = $("#FromDate").val();
//    let EndDate = $("#ToDate").val();

//    if (EndDate) {
//        $("#FromDate").attr("max", EndDate);
//    }

//    if (StartDate) {
//        $("#ToDate").attr("min", StartDate);
//    }

//    if (StartDate && EndDate && StartDate > EndDate) {
//        alert("From Date cannot be after To Date!");
//        $("#FromDate").val("");
//    }

//    if (StartDate && EndDate) {
//        let formattedStartDate = formatDateForSQL(new Date(StartDate));
//        let formattedEndDate = formatDateForSQL(new Date(EndDate));
//        var franchiseId = parseInt(localStorage.getItem('FranchiseId'));
//        if ($('#ToVendorGrid').hasClass('purchaseactive')) {
//            TypeId = 1;
//        } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
//            TypeId = 2;
//        }
//        var EditDataId = { FromDate: formattedStartDate, ToDate: formattedEndDate, FranchiseId: franchiseId, TypeId: TypeId };
//        Common.ajaxCall("GET", "/DPO/GetPurchaseOrder", EditDataId, POSuccess, null);
//    }
//});

/*======================================================================================*/
