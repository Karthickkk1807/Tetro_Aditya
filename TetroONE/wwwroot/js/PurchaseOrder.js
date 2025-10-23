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

    $('#loader-pms').show();
    $('.Status-Div').hide();

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

    /* -------------------- Validation For Inputs --------------------------- */

    initializePage(FranchiseMappingId);

    $('#Vendor,#AlternativeCompanyAddress').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });
});

$('#BillFrom').on('change', async function () {
    if (disableChangeEvent) return;

    $('#loader-pms').show();
    const ModuleId = $(this).val();
    const ModuleName = "FranchiseFrom";

    if (ModuleId) {
        const url = `/Common/BillFromDetails_BillFromId?ModuleId=${parseInt(ModuleId)}`;
        const responseData = await Common.getAsycData(url);
        if (responseData !== null) {
            Inventory.BillFromAddressDetails(responseData);
        }
    } else {
        $('#BillFromAddress').text('');
    }

    $('#loader-pms').hide();
});

$(document).on('change', '#Vendor', function () {
    var value = $(this).val();
    $('#RequestNo').empty().append('<option value="">--Select--</option>');
    $("#MainPurchaseOrderPopTable").show();
    $("#MainPurchaseProposalReturnPopTable").hide();
    if (value != "") {
        $('.overraphide').find('.error').remove();
        Common.bindDropDown('TypeOfRequest', 'TypeOfRequest');
    } else {
        $('#TypeOfRequest').empty().append('<option value="">--Select--</option>');
    }
});

$(document).on('change', '#ClientId', async function () {

    var clientId = $('#ClientId').val();
    var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(clientId));
    if (responseData1 !== null) {
        var data = JSON.parse(responseData1);
        $("#VendorColumn #ClientName").text(data[0][0].ClientName || '');
        $("#VendorColumn #ClientAddress").text(data[0][0].Address || '');
        $("#VendorColumn #ClientCountry").text(data[0][0].Country || '');
        $("#VendorColumn #ClientPlaceOfSupply").text(data[0][0].StateName || '');
        $("#VendorColumn #ClientEmail").text(data[0][0].Email || '');
        $("#VendorColumn #ClientMobileNumber").text(data[0][0].ContactNumber || '');
        $("#VendorColumn #ClientGSTNumber").text(data[0][0].GSTNumber || '');
        $("#VendorColumn #ClientStateId").text(data[0][0].StateId || '');

        var city = data[0][0].City || '';
        var zipCode = data[0][0].ZipCode || '';

        // Check if both City and ZipCode are non-empty before concatenating the dash
        var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
        $("#VendorColumn #ClientCity").text(cityName || '');
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

function handleButtonClick(typeId) {
    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: typeId };
    Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);
}

$('#ToVendorGrid, #FromDistributorGrid').on('click', function () {

    $('#ToVendorGrid, #FromDistributorGrid').removeClass('purchaseactive');
    $('#tableFilter').val('');
    $(this).addClass('purchaseactive');
    if (this.id === 'ToVendorGrid') {
        $('#AddPurchaseOrderBtn').show();
        handleButtonClick(1);
    } else {
        $('#AddPurchaseOrderBtn').hide();
        handleButtonClick(2);
    }
});

async function initializePage(FranchiseMappingId) {

    $("#MainPurchaseOrderPopTable").show();
    $("#MainPurchaseProposalReturnPopTable").hide();

    $('.page-inner-footer').hide();
    var today = new Date().toISOString().split('T')[0];
    $("#PurchaseOrderDate").attr("max", today).val(today);

    $('#AddAttachment').hide();

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    var fnData = Common.getDateFilter('dateDisplay2');

    $('#AddAttachment').hide();

    let MOPDropdownVal = await Common.bindDropDownSync('ModeOfPayment');
    Common.bindDropDownSuccess(MOPDropdownVal, 'ModeOfPaymentId');
    MOPDropdown = JSON.parse(MOPDropdownVal);

    if ($('#ToVendorGrid').hasClass('purchaseactive')) {
        TypeId = 1;
    } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
        TypeId = 2;
    }
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };
    Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);

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

        Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);
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

        Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);
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

            var EditDataId = { FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };
            Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);
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

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };
        Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);
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
        $("#lblCounterBox4").text('Converted to PI');

        $('#valCounterBox1').text('39 / ₹ 6,80,706.00');
        $('#valCounterBox2').text('18 / ₹ 2,46,830.00');
        $('#valCounterBox3').text('15 / ₹ 1,99,220.00');
        $('#valCounterBox4').text('6 / ₹ 4,39,482.00');

        var columns = Common.bindColumn(data[1], ['PurchaseOrderId', 'Status_Color']);
        Common.bindTablePurchase('PurchaseOrderData', data[1], columns, -1, 'PurchaseOrderId', '330px', true, access);
        $('#loader-pms').hide();
    }
}

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
    var moduleName = 'Purchase';
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    if ($('#ToVendorGrid').hasClass('purchaseactive')) {
        var VendorId = $('#VendorColumn #Vendor').val();
        var moduleName = 'Purchase';
        if (VendorId) {
            $('#AddProductModal').show();
            Inventory.AllProductTable(mainTable, moduleName, VendorId, FranchiseMappingId);
            $(".TotalSelectedItmsCount,.TotalSelctAmount").hide();
        } else {
            Common.warningMsg("Choose a Vendor to Continue.");
            $('#loader-pms').hide();
        }
    } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
        var VendorId = $('#VendorColumn #ClientId').val();
        var moduleName = 'Sale';
        if (VendorId) {
            $('#AddProductModal').show();
            Inventory.AllProductTable(mainTable, moduleName, VendorId, FranchiseMappingId);
            $(".TotalSelectedItmsCount,.TotalSelctAmount").hide();
        } else {
            Common.warningMsg("Choose a Vendor to Continue.");
            $('#loader-pms').hide();
        }
    }

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

function bindDropDownPO(id, moduleName, callback) {

    var request = {
        moduleName: moduleName
    };
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Common/GetDropDown',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status == true) {
                Common.bindDropDownSuccess(response.data, id);
                if (typeof callback === "function") {
                    callback();
                }
            }
        },
        error: function (response) {

        },
    });
}

$(document).on('click', '#AddVendorLable', function () {
    VendorAlignmentOpen();
});

$(document).on('click', '#AddPurchaseOrderBtn', function () {
    $('#PurchaseOrderModal').show();
    $('#POTopHeadbind').empty('');
    bindHeaderNormal();
    VendorAlignmentClose();

    $("#ModalHeading").text("Add Purchase Order ");

    $('#TypeOfRequest').empty().append('<option value="">--Select--</option>');
    $('#RequestNo').empty().append('<option value="">--Select--</option>');

    Common.bindDropDown('Vendor', 'Vendor');
    bindDropDownPO('AlternativeCompanyAddress', 'UserFranchiseMapping', function () {
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        $('#AlternativeCompanyAddress').val(FranchiseMappingId).trigger('change');
    });

    var EditDataId = { ModuleId: null, ModuleName: null };
    Common.ajaxCall("GET", "/Common/GetBillFromDDDetails", EditDataId, function (response) {
        var id = "BillFrom";
        Common.bindDropDownSuccess(response.data, id);
        $('#BillFrom').prop('selectedIndex', 1).trigger('change');
    }, null);


    Common.removevalidation('FormStatus');
    $('.ProductTableRow').empty();
    $("#PurchaseOrderStatusId").val('').trigger('change');
    EditPurhOrder = 0;

    $("#PurchaseOrderSaveBtn span:first").text("Save");
    $("#btnPordersaveprintbtn span:first").text("Save & Print");
    $("#btnPreviewPorder span:first").text("Save & Preview");

    $('.page-inner-footer').show();
    $('.Status-Div').hide();

    $("#MainPurchaseOrderPopTable").show();
    $("#MainPurchaseProposalReturnPopTable").hide();

    var EditDataId = { ModuleName: "PurchaseOrder", ModuleId: null };


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
    selectedProductIdsList = [];
    $('#ViewBankLable').hide();

    Common.removevalidation('FormBillFrom');
    $("#PurchaseOrderModal .modal-body").animate({ scrollTop: 0 }, "fast");
})

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
    var EditDataId = { ModuleName: 'PurchaseOrder', FranchiseId: ShipId };

    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "PurchaseOrderNumber", "PurchaseOrderNo");
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

    Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);
    AddPurchaseOrderBtn
    $('#AddPurchaseOrderBtn').show();
    ResetDataDetails("others");
    Common.VendorRemoveValidation();
    $('#AlternativeCompanyAddress').val('').trigger('change');
});

$('#PurchaseOrderData').on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {

        var EditPurhOrder = $(this).data('id');
        Common.ajaxCall("GET", "/PurchaseOrder/DeletePurchaseOrderDetails", { purchaseOrderId: EditPurhOrder }, function (response) {
            response = response.status ? Common.successMsg(response.message) : Common.errorMsg(response.message);

            if ($('#ToVendorGrid').hasClass('purchaseactive')) {
                TypeId = 1;
            } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
                TypeId = 2;
            }

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };

            Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);
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
    var vendorId = $('#Vendor').val();
    var ClientId = $('#ClientId').val();
    var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();
    var franchiseId = parseInt($('#BillFrom').val());
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var POStatusId = $('#PurchaseOrderStatusId option:selected').text();
    POStatusId = (POStatusId == '-- Select --') ? null : $('#PurchaseOrderStatusId').val();

    var TypeOfRequestId = parseInt($('#TypeOfRequest').val());
    var RequestNo = parseInt($('#RequestNo').val());

    if ($('#ToVendorGrid').hasClass('purchaseactive')) {
        PurchaseDetailsStatic = {
            PurchaseOrderId: EditPurhOrder > 0 ? EditPurhOrder : null,
            PurchaseOrderNo: $('#PurchaseOrderNumber').val(),
            VendorId: parseInt(vendorId),
            ShipToFranchiseId: parseInt(alternativeCompanyAddress),
            FranchiseId: parseInt(franchiseId),
            BillFromFranchiseId: parseInt($('#BillFrom').val()),
            PurchaseOrderDate: $('#PurchaseOrderDate').val(),
            ExpectedDeliveryDate: $('#ExpectedDeliveryDate').val(),
            TermsAndCondition: $('#TermsAndCondition').val() || null,
            Notes: $('#AddNotesText').val() || null,
            SubTotal: parseFloat($('#Subtotal').val() || 0.00),
            GrantTotal: parseFloat($('#GrantTotal').val() || 0.00),
            RoundOffValue: parseFloat($('#roundOff').val() || 0.00),
            PurchaseOrderStatusId: parseInt(POStatusId),
            TypeOfRequestId: parseInt(TypeOfRequestId),
            RequestNo: parseInt(RequestNo),
        };
    } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {

        PurchaseDetailsStatic = {
            PurchaseOrderId: EditPurhOrder > 0 ? EditPurhOrder : null,
            PurchaseOrderNo: $('#PurchaseOrderNumber').val(),
            VendorId: parseInt(ClientId),

            ShipToFranchiseId: parseInt(alternativeCompanyAddress),
            FranchiseId: parseInt(FranchiseMappingId),
            BillFromFranchiseId: parseInt(franchiseId),

            PurchaseOrderDate: $('#PurchaseOrderDate').val(),
            ExpectedDeliveryDate: $('#ExpectedDeliveryDate').val(),
            TermsAndCondition: $('#TermsAndCondition').val() || null,
            Notes: $('#AddNotesText').val() || null,
            SubTotal: parseFloat($('#Subtotal').val() || 0.00),
            GrantTotal: parseFloat($('#GrantTotal').val() || 0.00),
            RoundOffValue: parseFloat($('#roundOff').val() || 0.00),
            PurchaseOrderStatusId: parseInt(POStatusId),
        };
    }

    var PurchaseOrderProductMappingDetails = [];
    var PurchaseOrderProposalProductMappingDetails = [];
    if ($('#MainPurchaseProposalReturnPopTable').is(':visible')) {
        if ($('#TypeOfRequest').val() == 1) {
            $('#PurchaseProposalReturnTablebody .ProductTableRow').each(function () {
                var $rowTable = $(this);
                var productId = $rowTable.data('product-id');
                var isIGSTVisible = $rowTable.find('.IGSTValues').is(':visible');
                if (isIGSTVisible) {
                    var igstpercentage = Common.parseFloatValue($rowTable.find('.igst-perc').val()) || 0.00;
                } else {
                    var igstpercentage = 0.00;
                }

                var productDetail = {
                    PurchaseOrderProductMappingId: null,
                    PurchaseOrderId: EditPurhOrder > 0 ? EditPurhOrder : null,
                    ProductId: parseInt(productId),
                    ProductDescription: $rowTable.find('.descriptiontdtext').val() || null,
                    PurchasePrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()) || 0.00,
                    Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val()) || 0.00,
                    UnitId: Common.parseFloatValue($rowTable.find('.PRQtyUnitDropDown').val()),
                    SubTotal: Common.parseFloatValue($rowTable.find('.subtotal').val()) || 0.00,
                    CGST_Percentage: Common.parseFloatValue($rowTable.find('.cgst-perc').val()) || 0.00,
                    CGST_Value: Common.parseFloatValue($rowTable.find('.cgst-amt').val()) || 0.00,
                    SGST_Percentage: Common.parseFloatValue($rowTable.find('.sgst-perc').val()) || 0.00,
                    SGST_Value: Common.parseFloatValue($rowTable.find('.sgst-amt').val()) || 0.00,
                    IGST_Percentage: igstpercentage,
                    IGST_Value: Common.parseFloatValue($rowTable.find('.igst-amt').val()) || 0.00,
                    CESS_Percentage: Common.parseFloatValue($rowTable.find('.cess-perc').val()) || 0.00,
                    CESS_Value: Common.parseFloatValue($rowTable.find('.cess-amt').val()) || 0.00,

                    TotalAmount: Common.parseFloatValue($rowTable.find('.totalValue').val()) || 0.00
                };
                PurchaseOrderProductMappingDetails.push(productDetail);
            });

            var PurchaseProposalDetails = {
                PurchaseOrderProposalProductMappingId: null, PurchaseOrderId: null, ProposalProductName: null, ProposalDescription: null, ProposalPrice: null, Quantity: null, UnitId: null,
                SubTotal: null, CGST: null, SGST: null, IGST: null, CESS: null, Total: null,
            }
            PurchaseOrderProposalProductMappingDetails.push(PurchaseProposalDetails);
        }
        else {
            $('#PurchaseProposalReturnTablebody .ProductTableRow').each(function () {
                var $rowTable = $(this);

                var PurchaseProposalDetails = {
                    PurchaseOrderProposalProductMappingId: null,
                    PurchaseOrderId: EditPurhOrder > 0 ? EditPurhOrder : null,
                    ProposalProductName: $rowTable.find('.ProposalName').text(),
                    ProposalDescription: $rowTable.find('.descriptiontdtext').text(),
                    ProposalPrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()),
                    Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val()),
                    UnitId: parseInt($rowTable.find('.PRQtyUnitDropDown').val()),
                    SubTotal: Common.parseFloatValue($rowTable.find('.subtotal').val()),
                    CGST: Common.parseFloatValue($rowTable.find('.cgst-perc').val()),
                    SGST: Common.parseFloatValue($rowTable.find('.sgst-perc').val()),
                    IGST: Common.parseFloatValue($rowTable.find('.igst-perc').val()),
                    CESS: Common.parseFloatValue($rowTable.find('.cess-perc').val()),
                    Total: Common.parseFloatValue($rowTable.find('.totalValue').val()),
                }
                PurchaseOrderProposalProductMappingDetails.push(PurchaseProposalDetails);
            });

            var productDetail = {
                PurchaseOrderProductMappingId: null, PurchaseOrderId: null, ProductId: null, ProductDescription: null, PurchasePrice: null, Quantity: null, UnitId: null, SubTotal: null,
                CGST_Percentage: null, CGST_Value: null, SGST_Percentage: null, SGST_Value: null, IGST_Percentage: null, IGST_Value: null, CESS_Percentage: null, CESS_Value: null, TotalAmount: null
            };
            PurchaseOrderProductMappingDetails.push(productDetail);

        }
    } else {
        $('#POProductTablebody .ProductTableRow').each(function () {
            var $rowTable = $(this);
            var productId = $rowTable.data('product-id');
            var isIGSTVisible = $rowTable.find('.IGSTValues').is(':visible');
            if (isIGSTVisible) {
                var igstpercentage = Common.parseFloatValue($rowTable.find('#IGSTPercentage').val());
            } else {
                var igstpercentage = null;
            }

            var productDetail = {
                PurchaseOrderProductMappingId: null,
                PurchaseOrderId: EditPurhOrder > 0 ? EditPurhOrder : null,
                ProductId: parseInt(productId),
                ProductDescription: $rowTable.find('.descriptiontdtext').val(),
                PurchasePrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()),
                Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val() || 0),
                UnitId: Common.parseFloatValue($rowTable.find('.QtyUnitDropDown').val()),
                SubTotal: Common.parseFloatValue($rowTable.find('#subtotalAmount').val()),
                CGST_Percentage: Common.parseFloatValue($rowTable.find('#CGSTPercentage').val()) || null,
                CGST_Value: Common.parseFloatValue($rowTable.find('#CGSTAmount').val()) || null,
                SGST_Percentage: Common.parseFloatValue($rowTable.find('#SGSTPercentage').val()) || null,
                SGST_Value: Common.parseFloatValue($rowTable.find('#SGSTAmount').val()) || null,
                IGST_Percentage: igstpercentage,
                IGST_Value: Common.parseFloatValue($rowTable.find('#IGSTAmount').val()) || null,
                CESS_Percentage: Common.parseFloatValue($rowTable.find('#CESSPercentage').val()) || null,
                CESS_Value: Common.parseFloatValue($rowTable.find('#CESSAmount').val()) || null,

                TotalAmount: Common.parseFloatValue($rowTable.find('.Totalamount-cell').text()) || null
            };
            PurchaseOrderProductMappingDetails.push(productDetail); 
        });

        var PurchaseProposalDetails = {
            PurchaseOrderProposalProductMappingId: null, PurchaseOrderId: null, ProposalProductName: null, ProposalDescription: null, ProposalPrice: null, Quantity: null, UnitId: null,
            SubTotal: null, CGST: null, SGST: null, IGST: null, CESS: null, Total: null,
        }
        PurchaseOrderProposalProductMappingDetails.push(PurchaseProposalDetails);
    }


    formDataMultiple.append("PurchaseDetailsStatic", JSON.stringify(PurchaseDetailsStatic));
    formDataMultiple.append("PurchaseOrderProductMappingDetails", JSON.stringify(PurchaseOrderProductMappingDetails));
    formDataMultiple.append("PurchaseOrderProposalProductMappingDetails", JSON.stringify(PurchaseOrderProposalProductMappingDetails));
    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    let postUrl = "";

    if ($('#ToVendorGrid').hasClass('purchaseactive')) {
        postUrl = "/PurchaseOrder/InsertUpdatePurchaseOrder";
    } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
        postUrl = "/DPO/InsertUpdatePurchaseOrder";
    }

    if (postUrl) {
        $.ajax({
            type: "POST",
            url: postUrl,
            data: formDataMultiple,
            contentType: false,
            processData: false,
            success: successCallback,
            error: errorCallback
        });
    }


}
function PurshaceOrderSuccess(response) {
    try {
        data = JSON.parse(response.data);
    } catch (e) {
        console.error("Error parsing response data:", e);
        data = null;
    }

    formDataMultiple = new FormData();

    if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseOrderId !== 'undefined') {
        EditPurhOrder = data[0][0].PurchaseOrderId > 0 ? data[0][0].PurchaseOrderId : 0;

    } else {
        EditPurhOrder = 0;
    }
    $('#loader-pms').hide();
    Common.successMsg(response.message);
    Common.VendorRemoveValidation();

    var fnData = Common.getDateFilter('dateDisplay2');
    if ($('#ToVendorGrid').hasClass('purchaseactive')) {
        TypeId = 1;
    } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
        TypeId = 2;
    }
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId, TypeId: TypeId };
    Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);

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

        Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, POSuccess, null);
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
    if (newVal != null && $el.val() !== newVal.toString()) {
        $el.val(newVal).trigger('change');
    }
}

$('#PurchaseOrderData').on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    EditPurhOrder = $(this).data('id');

    editPurchaseOrder(EditPurhOrder);
});
function editPurchaseOrder(EditPurhOrder) {
    $("#PurchaseOrderSaveBtn span:first").text("Update");
    $("#btnPordersaveprintbtn span:first").text("Update & Print");
    $("#btnPreviewPorder span:first").text("Update & Preview");

    $('.page-inner-footer').show();
    $("#ModalHeading").text("Purchase Order Info ");
    $('.Status-Div').show();
    $("#PurchaseOrderModal .modal-body").animate({ scrollTop: 0 }, "fast");

    let isNormalPO = $('#ToVendorGrid').hasClass('purchaseactive');
    let isDistributorPO = $('#FromDistributorGrid').hasClass('purchaseactive');

    $('#POTopHeadbind').empty();

    if (isNormalPO) {
        bindHeaderNormal();
        VendorAlignmentOpen();
        Common.bindDropDown('Vendor', 'Vendor');

        // Parallel calls
        const franchiseId = parseInt(localStorage.getItem('FranchiseId'));
        const currentFranchiseId = parseInt($('#UserFranchiseMappingId').val());

        const statusPromise = ajaxPromise("GET", "/Common/GetInventoryStatusDetails", {
            ModuleName: "PurchaseOrder", ModuleId: EditPurhOrder
        });

        const billFromPromise = ajaxPromise("GET", "/Common/GetBillFromDDDetails", {
            ModuleId: EditPurhOrder, ModuleName: "PurchaseOrder"
        });

        const activityPromise = ajaxPromise("GET", "/Common/ActivityHistoryDetails", {
            ModuleName: "PurchaseOrder", ModuleId: EditPurhOrder
        });

        const notNullPromise = ajaxPromise("GET", "/PurchaseOrder/NotNullGetPurchaseOrder", {
            PurchaseOrderId: EditPurhOrder, FranchiseId: currentFranchiseId
        });

        const dropDownPromise = bindDropDownPO('AlternativeCompanyAddress', 'UserFranchiseMapping');

        Promise.all([statusPromise, billFromPromise, activityPromise, notNullPromise, dropDownPromise])
            .then(async ([statusRes, billFromRes, activityRes, notNullRes]) => {
                StatusSuccess(statusRes);
                Common.bindDropDownSuccess(billFromRes.data, 'BillFrom');
                Inventory.StatusActivity(activityRes);
                await PurchaseOrderGetNotNull(notNullRes);
            });

    } else if (isDistributorPO) {
        bindHeaderdistributor();
        VendorAlignmentOpen();
        Common.bindDropDown('ClientId', 'Client');

        const franchiseId = parseInt(localStorage.getItem('FranchiseId'));
        const currentFranchiseId = parseInt($('#UserFranchiseMappingId').val());

        const statusPromise = ajaxPromise("GET", "/Common/GetInventoryStatusDetails", {
            ModuleName: "PurchaseOrder_DBT", ModuleId: EditPurhOrder
        });

        const billFromPromise = ajaxPromise("GET", "/Common/GetBillFromDDDetails", {
            ModuleId: EditPurhOrder, ModuleName: "PurchaseOrder_DBT"
        });

        const activityPromise = ajaxPromise("GET", "/Common/ActivityHistoryDetails", {
            ModuleName: "PurchaseOrder_DBT", ModuleId: EditPurhOrder
        });

        const notNullPromise = ajaxPromise("GET", "/DPO/NotNullGetPurchaseOrder", {
            PurchaseOrderId: EditPurhOrder, FranchiseId: currentFranchiseId
        });

        const dropDownPromise = bindDropDownPO('AlternativeCompanyAddress', 'UserFranchiseMapping');

        Promise.all([statusPromise, billFromPromise, activityPromise, notNullPromise, dropDownPromise])
            .then(async ([statusRes, billFromRes, activityRes, notNullRes]) => {
                StatusSuccess(statusRes);
                Common.bindDropDownSuccess(billFromRes.data, 'BillFrom');
                Inventory.StatusActivity(activityRes);
                await DPOPurchaseOrderGetNotNull(notNullRes);
            });
    }
}

function ajaxPromise(type, url, data) {
    return new Promise((resolve, reject) => {
        Common.ajaxCall(type, url, data, resolve, reject);
    });
}

async function PurchaseOrderGetNotNull(response) {
    disableChangeEvent = true;
    formDataMultiple = new FormData();

    if (!response.status) return;

    const data = JSON.parse(response.data);
    const poData = data[1][0];

    if (poData) {
        AutoGenerateFlag = true;

        // Remove old status options
        $("#PurchaseOrderStatusId option").each(function () {
            if ($(this).val() !== "" && $(this).val() < poData.PurchaseOrderStatusId) {
                $(this).remove();
            }
        });

        $('#PurchaseOrderDate').val(extractDate(poData.PurchaseOrderDate));
        $('#PurchaseOrderNumber').val(poData.PurchaseOrderNo);
        $('#ExpectedDeliveryDate').val(extractDate(poData.ExpectedDeliveryDate));

        // Wait for all dropdowns to bind in parallel
        await Promise.all([
            triggerDropdownChangeWithPromise($('#AlternativeCompanyAddress'), poData.ShipToFranchiseId),
            triggerDropdownChangeWithPromise($('#BillFrom'), poData.BillFromFranchiseId),
            bindAddressDropdown(poData.BillFromFranchiseId)
        ]);

        Common.bindData(data[0]);

        EditPurhOrder = poData.PurchaseOrderId;

        Inventory.toggleField(poData.Notes, "#Notes", "#AddNotes", "#AddNotesLable");
        Inventory.toggleField(poData.TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
        Inventory.toggleFieldForAttachment(data[2][0]?.AttachmentId, "#AddAttachLable", "#AddAttachment");

        $("#ViewBankLable").hide();
    }

    // Bind table + attachments
    const tablebody = $('#POProductTablebody');
    const mainTable = $('#POProductTable');

    await Inventory.PurchaseHeaderBindData(response);

    if (poData.TypeOfRequestId != null) {
        $("#MainPurchaseOrderPopTable").hide();
        $("#MainPurchaseProposalReturnPopTable").show();

        var EditDataId = {
            FranchiseId: parseInt(FranchiseMappingId),
            ModuleId: parseInt(poData.TypeOfRequestId),
            BillTo: parseInt(poData.VendorId),
            PurchaseRequestNo: null,
            ProposalRequestNo: null
        };
        if (poData.TypeOfRequestId == 1) {
            Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseReturn_ProposalReturn_ReturnNo", EditDataId, function (response) {
                if (response.status) {
                    Common.bindParentDropDownSuccess(response.data, 'RequestNo', 'FormRightSideHeader');
                    $('#TypeOfRequest').val(poData.TypeOfRequestId);
                    $('#RequestNo').val(poData.RequestNo);
                    PurchasePropsalNotNullBinding(data[0]);
                }
            }, null);
        }
    } else {
        $("#MainPurchaseOrderPopTable").show();
        $("#MainPurchaseProposalReturnPopTable").hide();
        await Inventory.bindSaleProducts(data[0], tablebody, mainTable, null, "#VendorStateName", "#StateName");
    }

    $('#selectedFiles,#ExistselectedFiles').empty();
    existFiles = [];
    formDataMultiple = new FormData();
    Inventory.bindAttachments(data[2]);

    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();

    // Final dropdown set
    if (data[1]?.[0]?.PurchaseOrderStatusId) {
        await triggerDropdownChangeWithPromise($('#PurchaseOrderStatusId'), data[1][0].PurchaseOrderStatusId);
    }

    Inventory.updateGSTVisibility('#VendorStateName', '#StateName');
    $('#loader-pms').hide();
    $('#PurchaseOrderModal').show();

    disableChangeEvent = false;
    AutoGenerateFlag = false;
}


async function DPOPurchaseOrderGetNotNull(response) {
    disableChangeEvent = true;
    formDataMultiple = new FormData();

    if (!response.status) return;

    const data = JSON.parse(response.data);
    const poData = data[1][0];

    if (poData) {
        $("#PurchaseOrderStatusId option").each(function () {
            if ($(this).val() !== "" && $(this).val() < poData.PurchaseOrderStatusId_DBT) {
                $(this).remove();
            }
        });

        $('#PurchaseOrderDate').val(extractDate(poData.PurchaseOrderDate_DBT));
        $('#PurchaseOrderNumber').val(poData.PurchaseOrderNo_DBT);
        $('#ExpectedDeliveryDate').val(extractDate(poData.ExpectedDeliveryDate_DBT));

        // Set dropdowns and wait
        await Promise.all([
            triggerDropdownChangeWithPromise($('#PurchaseOrderStatusId'), poData.PurchaseOrderStatusId_DBT),
            triggerDropdownChangeWithPromise($('#AlternativeCompanyAddress'), poData.ShipToFranchiseId_DBT),
            triggerDropdownChangeWithPromise($('#ClientId'), poData.DistributorId_DBT),
            triggerDropdownChangeWithPromise($('#BillFrom'), poData.BillFromFranchiseId_DBT),
            bindAddressDropdown(poData.BillFromFranchiseId_DBT)
        ]);

        Common.bindData(data[0]);

        EditPurhOrder = poData.PurchaseOrderId_DBT;

        Inventory.toggleField(poData.Notes_DBT, "#AddNotesText", "#AddNotes", "#AddNotesLable");
        Inventory.toggleField(poData.TermsAndCondition_DBT, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
        Inventory.toggleFieldForAttachment(data[2][0]?.AttachmentId, "#AddAttachLable", "#AddAttachment");
    }

    // Bind sale products
    const tablebody = $('#POProductTablebody');
    const mainTable = $('#POProductTable');

    await Inventory.bindSaleProducts(data[0], tablebody, mainTable, null);

    $('#selectedFiles,#ExistselectedFiles').empty();
    existFiles = [];
    formDataMultiple = new FormData();
    Inventory.bindAttachments(data[2]);

    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    calculateBalance();

    Inventory.updateGSTVisibility();
    $('#loader-pms').hide();
    $('#PurchaseOrderModal').show();
    disableChangeEvent = false;
    AutoGenerateFlag = false;
}


function bindHeaderdistributor() {
    var html = '';
    html = `
     <div class="row DynPageRow-Div">
                        
                        <div class="col-lg-6 col-md-6 col-sm-6 col-12" id="AddVendorlableColumn">
                            <div class="row BilAddHead">
                                <div class="d-flex justify-content-start p-2">
                                    <h2 class="mb-0">Bill To Address</h2>
                                </div>
                            </div>
                            <div class="row" style="height: 23vh; display: flex; align-items: center; justify-content: center;">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center" style="padding-right: 20px;position:relative;padding-left: 20px;align-items: center;">
                                    <div class="dashed-border">
                                        <label class="company-sign" id="AddVendorLable"> + Add Vendor </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                      
                        <div class="col-lg-12 col-md-12 col-sm-12 col-12" id="BillFromColumn" style="position: relative; display: none;">
                            <form id="FormBillFrom" novalidate="novalidate">

                                <div class="row BillFrom-info-container mt-2">
                                    <div class="info-row" style="margin-right:15px; width:unset;">
                                        <div class="info-label-Purchase" style="margin-top:10px;width: 75px;font-size: 15px; font-weight: 700; white-space: nowrap;">Bill From<span id="Asterisk">*</span></div>
                                        <div class="info-colon"></div>
                                        <div class="">
                                            <div class="form-group mb-0 mr-2">
                                                <select class="form-control" id="BillFrom" name="BillFrom" required>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="info-row" style="margin-right:15px; width:unset;">
                                        <div class="info-value">
                                            <a id="BillFromName" name="BillFromName"></a>
                                        </div>
                                    </div>
                                    <div class="info-row" style="margin-right:15px; width:unset;">
                                        <div class="info-value">
                                            <a id="BillFromAddress" name="BillFromAddress"></a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>



                        <!--ShippingColumn-->
                        <div class="col-lg-4 col-md-6 col-sm-6 col-12" id="ShippingColumn" style="position: relative; display: none;">
                            <form id="FormShipping" novalidate="novalidate">
                                <div class="row BilAddHead mt-2">
                                    <div class="info-row" style="align-items: center;">
                                        <div class="info-label-Purchase">Bill To<span id="Asterisk">*</span></div>
                                        <div class="info-colon"></div>
                                        <div class="">
                                            <div class="form-group mb-0 mr-2 AlternativeCompanyError" style="width: 190px;">
                                                <select class="form-control" id="AlternativeCompanyAddress" name="AlternativeCompanyAddress" required>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div class="row mt-3">
                                <div class="col-12">
                                    <div class="info-container" id="">
                                        <label id="WareHouseStoreId" name="WareHouseStoreId" style="display:none">tesstt</label>



                                        <div id="StoreAddressDiv" class="info-row">
                                            <div class="info-label-Purchase">Address</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="StoreAddress" name="StoreAddress"></a>
                                            </div>
                                        </div>

                                        <div id="StoreCityDiv" class="info-row">
                                            <div class="info-label-Purchase">City</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="StoreCity" name="StoreCity"></a>
                                            </div>
                                        </div>

                                        <div id="StoreContactNumberDiv" class="info-row">
                                            <div class="info-label-Purchase">Mobile Number</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="StoreContactNumber" name="StoreContactNumber"></a>
                                            </div>
                                        </div>

                                        <div id="StateNameDiv" class="info-row">
                                            <div class="info-label-Purchase">State</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="StateName" name="StateName"></a>
                                            </div>
                                        </div>

                                        <div class="info-row d-none">
                                            <div class="info-label-Purchase">StateId</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="StateId" name="StateId">
                                                </a>
                                            </div>
                                        </div>

                                        <div class="info-row d-none">
                                            <div class="info-label-Purchase">StoreId</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="StoreNoId" name="StoreNoId"></a>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>


                        <!--VendorColumn-->
                        <div class="col-lg-4 col-md-6 col-sm-6 col-12" id="VendorColumn" style="position: relative; display: none;">
                            <form id="FormVendor" novalidate="novalidate">
                                <div class="row BilAddHead mt-2">
                                    <div class="info-row" style="align-items: center;">
                                        <div class="info-label-Purchase">Ship To<span id="Asterisk">*</span></div>
                                        <div class="info-colon"></div>
                                        <div class="">
                                            <div class="form-group mb-0 mr-2 vendorerror" style="width: 190px;">
                                                <select class="form-control" id="ClientId">
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div class="row mt-3">
                                <div class="col-12">
                                    <div class="info-container" id="">
                                        
                                        <div id="ClientAddressDiv" class="info-row">
                                            <div class="info-label-Purchase">Address</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="ClientAddress" name="ClientAddress"></a>
                                            </div>
                                        </div>

                                        <div id="ClientCityDiv" class="info-row">
                                            <div class="info-label-Purchase">City</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="ClientCity" name="ClientCity"></a>
                                            </div>
                                        </div>

                                        <div id="ClientEmailDiv" class="info-row d-none">
                                            <div class="info-label-Purchase">Email</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="ClientEmail" name="ClientEmail"></a>
                                            </div>
                                        </div>

                                        <div id="ClientMobileNumberDiv" class="info-row">
                                            <div class="info-label-Purchase">Mobile Number</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="ClientMobileNumber" name="ClientMobileNumber"></a>
                                            </div>
                                        </div>

                                        <div id="ClientPlaceOfSupplyDiv" class="info-row">
                                            <div class="info-label-Purchase">Place Of Supply</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="ClientPlaceOfSupply" name="ClientPlaceOfSupply"></a>
                                            </div>
                                            <label id="StateCodeId" name="StateCodeId" style="display:none"></label>
                                        </div>

                                        <div id="ClientCountryDiv" class="info-row d-none">
                                            <div class="info-label-Purchase">Country</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="ClientCountry" name="ClientCountry"></a>
                                            </div>
                                        </div>

                                        <div id="ClientGSTNumberDiv" class="info-row">
                                            <div class="info-label-Purchase">GST Number</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="ClientGSTNumber" name="ClientGSTNumber"></a>
                                            </div>
                                        </div>

                                        <div id="ClientNameDiv" class="info-row d-none">
                                            <div class="info-label-Purchase">StateIdGet</div>
                                            <div class="info-colon">:</div>
                                            <div class="info-value">
                                                <a id="StateIdGet" name="StateIdGet"></a>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                        <!--POColumn-->
                        <div class="col-lg-6 col-md-6 col-sm-6 col-12" id="POColumn">
                            <form id="FormRightSideHeader">
                                <div class="row mt-2">
                                    <div class="col-lg-4 col-md-6 col-6" id="PurchaseOrderNumberDiv">
                                        <div class="form-group">
                                            <label>PO No<span id="Asterisk">*</span></label>
                                            <input type="text" class="form-control" id="PurchaseOrderNumber" name="PurchaseOrderNumber" placeholder="PO No" autocomplete="off" disabled="" fdprocessedid="eb1wt7" required>
                                        </div>
                                    </div>

                                    <div class="col-lg-4 col-md-6 col-6" id="PurchaseOrderDateDiv">
                                        <div class="form-group">
                                            <label>PO Date<span id="Asterisk">*</span></label>
                                            <input type="date" class="form-control" id="PurchaseOrderDate" name="PurchaseOrderDate" required="">
                                        </div>
                                    </div>

                                    <div class="col-lg-4 col-md-6 col-6" id="ExpectedDeliveryDateDiv">
                                        <div class="form-group">
                                            <label>Exp Delivery Date<span id="Asterisk">*</span></label>
                                            <input type="date" class="form-control" id="ExpectedDeliveryDate" name="ExpectedDeliveryDate" required="">
                                        </div>
                                    </div>

                                     <div class="col-lg-4 col-md-6 col-6" id="TypeOfRequestDiv">
                                         <div class="form-group">
                                             <label>Type Of Request</label>
                                             <select class="form-control" id="TypeOfRequest" name="TypeOfRequest"></select>
                                         </div>
                                     </div>

                                     <div class="col-lg-4 col-md-6 col-6" id="RequestNoDiv">
                                         <div class="form-group">
                                             <label>Request No</label>
                                             <select class="form-control" id="RequestNo" name="RequestNo"></select>
                                         </div>
                                     </div>
                                </div>
                            </form>
                        </div>
                    </div>
    `
    $('#POTopHeadbind').append(html);
}

function bindHeaderNormal() {
    var html = '';
    html = `
      <div class="row DynPageRow-Div">
     <!--AddVendorAddressColumn-->
     <div class="col-lg-6 col-md-6 col-sm-6 col-12" id="AddVendorlableColumn">
         <div class="row BilAddHead">
             <div class="d-flex justify-content-start p-2">
                 <h2 class="mb-0">Bill To Address</h2>
             </div>
         </div>
         <div class="row" style="height: 23vh; display: flex; align-items: center; justify-content: center;">
             <div class="col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center" style="padding-right: 20px;position:relative;padding-left: 20px;align-items: center;">
                 <div class="dashed-border">
                     <label class="company-sign" id="AddVendorLable"> + Add Vendor </label>
                 </div>
             </div>
         </div>
     </div>

    
     <div class="col-lg-12 col-md-12 col-sm-12 col-12" id="BillFromColumn" style="position: relative; display: none;">
         <form id="FormBillFrom" novalidate="novalidate">

             <div class="row BillFrom-info-container mt-2">
                 <div class="info-row" style="margin-right:15px; width:unset;">
                     <div class="info-label-Purchase" style="margin-top:10px;width: 75px;font-size: 15px; font-weight: 700; white-space: nowrap;">Bill From<span id="Asterisk">*</span></div>
                     <div class="info-colon"></div>
                     <div class="">
                         <div class="form-group mb-0 mr-2">
                             <select class="form-control" id="BillFrom" name="BillFrom" required>
                             </select>
                         </div>
                     </div>
                 </div>
                 <div class="info-row" style="margin-right:15px; width:unset;">
                     <div class="info-value">
                         <a id="BillFromName" name="BillFromName"></a>
                     </div>
                 </div>
                 <div class="info-row" style="margin-right:15px; width:unset;">
                     <div class="info-value">
                         <a id="BillFromAddress" name="BillFromAddress"></a>
                     </div>
                 </div>
             </div>
         </form>
     </div>

     <!--VendorColumn-->
     <div class="col-lg-4 col-md-6 col-sm-6 col-12" id="VendorColumn" style="position: relative; display: none;">
         <form id="FormVendor" novalidate="novalidate">
             <div class="row BilAddHead mt-2">
                 <div class="info-row" style="align-items: center;">
                     <div class="info-label-Purchase">Bill To<span id="Asterisk">*</span></div>
                     <div class="info-colon"></div>
                     <div class="">
                         <div class="form-group mb-0 mr-2 vendorerror" style="width: 190px;">
                             <select class="form-control" id="Vendor" name="Vendor" required>
                             </select>
                         </div>
                     </div>
                 </div>
             </div>
         </form>
         <div class="row mt-3">
             <div class="col-12">
                 <div class="info-container" id="">
                     
                     <div id="VendorAddressDiv" class="info-row">
                         <div class="info-label-Purchase">Address</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="VendorAddress" name="VendorAddress"></a>
                         </div>
                     </div>

                     <div id="VendorCityDiv" class="info-row">
                         <div class="info-label-Purchase">City</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="VendorCity" name="VendorCity"></a>
                         </div>
                     </div>



                     <div id="VendorContactNumberDiv" class="info-row">
                         <div class="info-label-Purchase">Mobile Number</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="VendorContactNumber" name="VendorContactNumber"></a>
                         </div>
                     </div>

                     <div id="VendorEmailDiv" class="info-row d-none">
                         <div class="info-label-Purchase">Email</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="VendorEmail" name="VendorEmail"></a>
                         </div>
                     </div>
                     <div id="VendorStateNameDiv" class="info-row">
                         <div class="info-label-Purchase">Place Of Supply</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="VendorStateName" name="VendorStateName"></a>
                         </div>
                         <label id="StateCodeId" name="StateCodeId" style="display:none"></label>
                     </div>

                     <div id="VendorCountryDiv" class="info-row d-none">
                         <div class="info-label-Purchase">Country</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="VendorCountry" name="VendorCountry"></a>
                         </div>
                     </div>
                     <div id="VendorGSTNumberDiv" class="info-row">
                         <div class="info-label-Purchase">GST Number</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="VendorGSTNumber" name="VendorGSTNumber"></a>
                         </div>
                     </div>

                     <div id="VendorNameDiv" class="info-row d-none">
                         <div class="info-label-Purchase">StateIdGet</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="StateIdGet" name="StateIdGet"></a>
                         </div>
                     </div>

                 </div>
             </div>
         </div>

     </div>

     <!--ShippingColumn-->
     <div class="col-lg-4 col-md-6 col-sm-6 col-12" id="ShippingColumn" style="position: relative; display: none;">
         <form id="FormShipping" novalidate="novalidate">
             <div class="row BilAddHead mt-2">
                 <div class="info-row" style="align-items: center;">
                     <div class="info-label-Purchase">Ship To<span id="Asterisk">*</span></div>
                     <div class="info-colon"></div>
                     <div class="">
                         <div class="form-group mb-0 mr-2 AlternativeCompanyError" style="width: 190px;">
                             <select class="form-control" id="AlternativeCompanyAddress" name="AlternativeCompanyAddress" required>
                             </select>
                         </div>
                     </div>
                 </div>
             </div>
         </form>

         <div class="row mt-3">
             <div class="col-12">
                 <div class="info-container" id="">
                     <label id="WareHouseStoreId" name="WareHouseStoreId" style="display:none">tesstt</label>



                     <div id="StoreAddressDiv" class="info-row">
                         <div class="info-label-Purchase">Address</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="StoreAddress" name="StoreAddress"></a>
                         </div>
                     </div>

                     <div id="StoreCityDiv" class="info-row">
                         <div class="info-label-Purchase">City</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="StoreCity" name="StoreCity"></a>
                         </div>
                     </div>

                     <div id="StoreContactNumberDiv" class="info-row">
                         <div class="info-label-Purchase">Mobile Number</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="StoreContactNumber" name="StoreContactNumber"></a>
                         </div>
                     </div>

                     <div id="StateNameDiv" class="info-row">
                         <div class="info-label-Purchase">State</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="StateName" name="StateName"></a>
                         </div>
                     </div>

                     <div class="info-row d-none">
                         <div class="info-label-Purchase">StateId</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="StateId" name="StateId">
                             </a>
                         </div>
                     </div>

                     <div class="info-row d-none">
                         <div class="info-label-Purchase">StoreId</div>
                         <div class="info-colon">:</div>
                         <div class="info-value">
                             <a id="StoreNoId" name="StoreNoId"></a>
                         </div>
                     </div>

                 </div>
             </div>
         </div>
     </div>

     <!--POColumn-->
     <div class="col-lg-6 col-md-6 col-sm-6 col-12" id="POColumn">
         <form id="FormRightSideHeader">
             <div class="row mt-2">
                 <div class="col-lg-4 col-md-6 col-6" id="PurchaseOrderNumberDiv">
                     <div class="form-group">
                         <label>PO No<span id="Asterisk">*</span></label>
                         <input type="text" class="form-control" id="PurchaseOrderNumber" name="PurchaseOrderNumber" placeholder="PO No" autocomplete="off" disabled="" fdprocessedid="eb1wt7" required>
                     </div>
                 </div>

                 <div class="col-lg-4 col-md-6 col-6" id="PurchaseOrderDateDiv">
                     <div class="form-group">
                         <label>PO Date<span id="Asterisk">*</span></label>
                         <input type="date" class="form-control" id="PurchaseOrderDate" name="PurchaseOrderDate" required="">
                     </div>
                 </div>

                 <div class="col-lg-4 col-md-6 col-6" id="ExpectedDeliveryDateDiv">
                     <div class="form-group">
                         <label>Exp Delivery Date<span id="Asterisk">*</span></label>
                         <input type="date" class="form-control" id="ExpectedDeliveryDate" name="ExpectedDeliveryDate" required="">
                     </div>
                 </div>

                 <div class="col-lg-4 col-md-6 col-6" id="TypeOfRequestDiv">
                     <div class="form-group">
                         <label>Type Of Request</label> 
                         <select class="form-control" id="TypeOfRequest" name="TypeOfRequest"></select>
                     </div>
                 </div>

                 <div class="col-lg-4 col-md-6 col-6" id="RequestNoDiv">
                     <div class="form-group">
                         <label>Request No</label>
                         <select class="form-control" id="RequestNo" name="RequestNo"></select> 
                     </div>
                 </div>

             </div>
         </form>
     </div>
 </div>
    `
    $('#POTopHeadbind').append(html);
}
function triggerDropdownChangeWithPromise($select, valueToSet) {
    return new Promise((resolve) => {
        $select.one('change', function () {
            resolve();
        });
        $select.val(valueToSet).trigger('change');
    });
}
async function bindAddressDropdown(BillFromFranchiseId) {
    const getAddress = (id) => {
        return new Promise((resolve) => {
            const moduleId = parseInt(id);
            const moduleName = "BillFrom";
            const url = `/Common/BillFromDetails_BillFromId?ModuleId=${moduleId}&ModuleName=${encodeURIComponent(moduleName)}`;

            Common.ajaxCall("GET", url, {}, function (response) {
                resolve(response);
            });
        });
    };

    const [billFromRes] = await Promise.all([
        getAddress(BillFromFranchiseId),
    ]);

    if (billFromRes?.status) {

        var data = JSON.parse(billFromRes.data);

        // Set values in BillFrom section
        $("#BillFromName").text(data[0][0].CompanyName || '');
        $("#BillFromAddress").text(data[0][0].Address || '');
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

    $('#PurchaseOrderNumberDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#PurchaseOrderDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#ExpectedDeliveryDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#TypeOfRequestDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#RequestNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#POColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-12').addClass('col-lg-4 col-md-12 col-sm-12 col-12');
    $("#ShipToLocation").prop('disabled', false);
}
function VendorAlignmentClose() {

    $('#AddVendorlableColumn').show();
    $('#BillFromColumn').hide();
    $('#VendorColumn').hide();
    $('#ShippingColumn').hide();

    $('#PurchaseOrderNumberDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#PurchaseOrderDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#ExpectedDeliveryDateDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#TypeOfRequestDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#RequestNoDiv').addClass('col-lg-4 col-md-6 col-sm-6 col-6').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
    $('#POColumn').addClass('col-lg-6 col-md-6 col-sm-6 col-12');
}


function resetCommonData() {
    $('#discounttotal, #GSTtotal, #CESSTotal, #StateCESSTotal, #Subtotal,#GrantTotal,#roundOff,#BalanceAmount').val('');
    $('#SubTotalTotal, #CGSTTotal, #SGSTTotal, #IGSTTotal, #CESSTotal').val('');
    selectedProductIdsList = [];

    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();

    $('#POProductTable .ProductTableRow').remove();
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
        $('#PurchaseOrderStatusId').val('').trigger('change');

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


    if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseOrderId !== 'undefined') {
        EditPurhOrder = data[0][0].PurchaseOrderId > 0 ? data[0][0].PurchaseOrderId : 0;

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
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };

        Common.ajaxCall("GET", "/PurchaseOrder/PurchaseOrderPrint", EditDataId, function (response) {
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


        if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseOrderId !== 'undefined') {
            EditPurhOrder = data[0][0].PurchaseOrderId > 0 ? data[0][0].PurchaseOrderId : 0;

        } else {

            EditPurhOrder = 0;

        }
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var EditDataId = {
            ModuleId: parseInt(EditPurhOrder),
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: printType,
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/PurchaseOrder/PurchaseOrderPrint',
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

        if (data && data[0] && data[0][0] && typeof data[0][0].PurchaseOrderId !== 'undefined') {
            EditPurhOrder = data[0][0].PurchaseOrderId > 0 ? data[0][0].PurchaseOrderId : 0;

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
            ContactId: parseInt($("#Vendor").val()),
            NoOfCopies: 1,
            printType: "WhatsApp",
            FranchiseId: franchiseId


        };
        $.ajax({
            url: '/PurchaseOrder/PurchaseOrderPrint',
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

/*==============================================================================Used Event Function in PurchaseOrderReturn.JS===============================================================*/

/*$(document).on('click', '#UpdateProductsInAddItem', function () { --- this event will in PurchaseOrderReturn.JS*/
/*$(document).on('click', '.addQtyBtn', function () { --- this event will in PurchaseOrderReturn.JS*/
/*$(document).on('click', '.DynremoveBtn', function () { --- this event will in PurchaseOrderReturn.JS */


function PurchasePropsalNotNullBinding(productList) {
    var $tbody = $("#PurchaseProposalReturnTablebody");
    var BillTo = ($('#VendorStateName').text() || '').trim().toLowerCase();
    var ShipTo = ($('#StateName').text() || '').trim().toLowerCase();
    var sameState = BillTo === ShipTo;

    // Show/hide tax headers based on state comparison
    if (sameState) {
        $('#PCGSTHead, #PSGSTHead, #PCGSTTotalDiv, #PSGSTTotalDiv').show();
        $('#PIGSTHead, #PIGSTTotalDiv').hide();
    } else {
        $('#PCGSTHead, #PSGSTHead, #PCGSTTotalDiv, #PSGSTTotalDiv').hide();
        $('#PIGSTHead, #PIGSTTotalDiv').show();
    }

    $.each(productList || [], function (i, item) {
        var ProductId = item.ProductId || '';
        var MappingId = item.PurchaseOrderProductMappingId || '';
        var ProductName = item.ProductName || '';
        var ProductDescription = item.ProductDescription || '';
        var Price = parseFloat(item.PurchasePrice) || 0;
        var Quantity = parseFloat(item.Quantity) || 1;

        var PrimaryUnitId = item.PrimaryUnitId || '';
        var SecondaryUnitId = item.SecondaryUnitId || '';
        var PrimaryUnitName = item.PrimaryUnitName || '';
        var SecondaryUnitName = item.SecondaryUnitName || '';
        var SelectedUnit = item.UnitId || '';

        var CGST = parseFloat(item.CGST) || 0;
        var SGST = parseFloat(item.SGST) || 0;
        var IGST = parseFloat(item.IGST) || 0;
        var CESS = parseFloat(item.CESS) || 0;

        var subtotal = Price * Quantity;
        var cgstAmt = subtotal * CGST / 100;
        var sgstAmt = subtotal * SGST / 100;
        var igstAmt = subtotal * IGST / 100;
        var cessAmt = subtotal * CESS / 100;
        var totalAmount = subtotal + cgstAmt + sgstAmt + igstAmt + cessAmt;

        var productInfo = JSON.stringify(item).replace(/"/g, "&quot;");

        var row = `
        <tr class="ProductTableRow" data-product-id="${ProductId}" data-productMapping-id="${MappingId}" data-product-info="${productInfo}">
            <td class="sno"></td>

            <td data-label="Product Name">
                <label style="white-space: pre-wrap;">${ProductName}</label>
                <textarea class="form-control mt-2 descriptiontdtext" placeholder="Description">${ProductDescription}</textarea>
            </td>

            <td data-label="Price" class="SellingPricediv">
                <input type="text" class="form-control SellingPrice mt-2" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,4)" value="${Price.toFixed(2)}">
            </td>

            <td data-label="QTY">
                <div class="input-group mt-2" style="width: 124px;">
                    <input type="text" class="form-control TableRowQty" value="${Quantity}" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,4)">
                    <div class="input-group-append">
                        <span class="unit-dropdown">
                            <select class="PRQtyUnitDropDown">
                                ${PrimaryUnitId ? `<option value="${PrimaryUnitId}" ${SelectedUnit == PrimaryUnitId ? 'selected' : ''}>${PrimaryUnitName}</option>` : ''}
                                ${SecondaryUnitId ? `<option value="${SecondaryUnitId}" ${SelectedUnit == SecondaryUnitId ? 'selected' : ''}>${SecondaryUnitName}</option>` : ''}
                            </select>
                        </span>
                    </div>
                </div>
            </td>

            <td class="Subtotal" style="padding:7px!important;vertical-align: middle;text-align: center;"> 
                <input type="number" class="form-control DisabledTextBox subtotal" value="${subtotal.toFixed(2)}" readonly>
            </td>

            <td class="CGSTValues" data-label="CGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? '' : 'display:none;'}">
                <input type="text" class="form-control DisabledTextBox cgst-perc d-none" value="${CGST}" readonly>
                <input type="text" class="form-control DisabledTextBox cgst-amt" value="${cgstAmt.toFixed(2)}" readonly>
            </td>

            <td class="SGSTValues" data-label="SGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? '' : 'display:none;'}">
                <input type="text" class="form-control DisabledTextBox sgst-perc d-none" value="${SGST}" readonly>
                <input type="text" class="form-control DisabledTextBox sgst-amt" value="${sgstAmt.toFixed(2)}" readonly>
            </td>

            <td class="IGSTValues" data-label="IGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? 'display:none;' : ''}">
                <input type="text" class="form-control DisabledTextBox igst-perc d-none" value="${IGST}" readonly>
                <input type="text" class="form-control DisabledTextBox igst-amt" value="${igstAmt.toFixed(2)}" readonly>
            </td>

            <td class="CessValues" data-label="CESS" style="padding:7px!important;vertical-align: middle;text-align: center;">
                <input type="text" class="form-control DisabledTextBox cess-perc d-none" value="${CESS}" readonly>
                <input type="text" class="form-control DisabledTextBox cess-amt" value="${cessAmt.toFixed(2)}" readonly>
            </td>

            <td class="TotalValue" data-label="Total" style="padding:7px!important;vertical-align: middle;text-align: center;">
                <input type="text" class="form-control DisabledTextBox totalValue" value="${totalAmount.toFixed(2)}" readonly>
            </td>

            <td class="PrimaryUnitId-cell d-none">${PrimaryUnitId}</td>
            <td class="PrimaryUnitName-cell d-none">${PrimaryUnitName}</td>
            <td class="SecondaryUnitId-cell d-none">${SecondaryUnitId}</td>
            <td class="SecondaryUnitName-cell d-none">${SecondaryUnitName}</td>
            <td class="PrimaryPrice-cell d-none">${item.PrimaryPrice || 0}</td>
            <td class="SecondaryPrice-cell d-none">${item.SecondaryPrice || 0}</td>

            <td data-label="Action" style="display:flex;justify-content:center;align-items:center;border:none;">
                <button class="btn DynremoveBtn DynrowRemove" type="button"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
        `;

        $(row).insertBefore("#PurchaseProposalReturnTablebody #AddItemButtonRow");
    });

    updateSerialNumbers();

    let $row = $("#PurchaseProposalReturnTablebody tr.ProductTableRow:last");
    calculateAllTotals($row);
}


function updateSerialNumbers() {
    $('#PurchaseProposalReturnTablebody .ProductTableRow').each(function (index) {
        $(this).find('.sno').text(index + 1);
    });
}

function calculateAllTotals($row) {

    var Price = $row.find('.SellingPrice').val();
    var Quantity = $row.find('.TableRowQty').val();
    var CGSTPer = $row.find('.cgst-perc').val();
    var SGSTPer = $row.find('.sgst-perc').val();
    var IGSTPer = $row.find('.igst-perc').val();
    var CESSPer = $row.find('.cess-perc').val();

    var CGST = parseFloat(CGSTPer) || 0.00;
    var SGST = parseFloat(SGSTPer) || 0.00;
    var IGST = parseFloat(IGSTPer) || 0.00;
    var CESS = parseFloat(CESSPer) || 0.00;

    var subtotal = Price * Quantity;
    var cgstAmt = subtotal * CGST / 100;
    var sgstAmt = subtotal * SGST / 100;
    var igstAmt = subtotal * IGST / 100;
    var cessAmt = subtotal * CESS / 100;
    var totalAmount = subtotal + cgstAmt + sgstAmt + igstAmt + cessAmt;

    $row.find('.subtotal').val(subtotal.toFixed(2));
    $row.find('.cgst-amt').val(cgstAmt.toFixed(2));
    $row.find('.sgst-amt').val(sgstAmt.toFixed(2));
    $row.find('.igst-amt').val(igstAmt.toFixed(2));
    $row.find('.cess-amt').val(cessAmt.toFixed(2));
    $row.find('.totalValue').val(totalAmount.toFixed(2));

    let subtotalTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;
    let cessTotal = 0;
    let grandTotal = 0;

    $('#PurchaseProposalReturnTablebody .ProductTableRow').each(function () {
        let $row = $(this);

        let subtotal = parseFloat($row.find('.subtotal').val()) || 0;
        let cgst = parseFloat($row.find('.cgst-amt').val()) || 0;
        let sgst = parseFloat($row.find('.sgst-amt').val()) || 0;
        let igst = parseFloat($row.find('.igst-amt').val()) || 0;
        let cess = parseFloat($row.find('.cess-amt').val()) || 0;
        let total = parseFloat($row.find('.totalValue').val()) || 0;

        subtotalTotal += subtotal;
        cgstTotal += cgst;
        sgstTotal += sgst;
        igstTotal += igst;
        cessTotal += cess;
        grandTotal += total;
    });

    $('#PRSubtotalRow #PRSubTotalTotal').val(subtotalTotal.toFixed(2));
    $('#PRSubtotalRow #PRCGSTTotal').val(cgstTotal.toFixed(2));
    $('#PRSubtotalRow #PRSGSTTotal').val(sgstTotal.toFixed(2));
    $('#PRSubtotalRow #PRIGSTTotal').val(igstTotal.toFixed(2));
    $('#PRSubtotalRow #PRCESSTotal').val(cessTotal.toFixed(2));
    $('#PRSubtotalRow #PRSubtotal').val(grandTotal.toFixed(2));

    var decimalPart = parseFloat(grandTotal.toFixed(2).split('.')[0]);
    var roundedDecimal = Math.ceil(decimalPart);
    var AddOrSub = roundedDecimal;

    var RoundOffValu = grandTotal.toFixed(2).split('.')[1];
    if (RoundOffValu >= 50) {
        $('#roundOff').css('color', 'green');
        AddOrSub++;
    } else if (RoundOffValu == '00') {
        $('#roundOff').css('color', 'blue');
    }
    else if (RoundOffValu <= 50) {
        $('#roundOff').css('color', 'orange');
    }

    $('#roundOff').val('0.' + RoundOffValu);
    $('#GrantTotal').val(AddOrSub.toFixed(2));
}
