var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
var EditSaleId = 0;
var PlantMappingId = 0;
var OtherChangesDiscountDropdown = [];
var OtherChangesOthersDropdown = [];
var printType = "";
var TriggerValues = true;

/* -------------------------- Initial Load Event -------------------------------------- */

$(document).ready(async function () {
    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    $('#ClientId').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });

    initializePage();

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#OtherChargesDropDown').length && !target.closest('#OtherchargesAdd').length) {
            $('#OtherChargesDropDown').css('display', 'none');
        }
    });
});

async function initializePage() {

    $('#TaxInvoiceModal').hide();

    Common.bindDropDownParent('BillFrom', 'FormBillFrom', 'BillFrom');
    Common.bindDropDownParent('ClientId', 'FormClient', 'Client');
    Common.bindDropDownParent('SaleStatusId', 'FormStatus', 'SaleStatus');
    Common.bindDropDownParent('TaxInfoId', 'FormRightSideHeader', 'TaxInfo');

    var otherChangesDiscountDropdown = await Common.bindDropDownSync('OtherChargesDiscount');
    OtherChangesDiscountDropdown = JSON.parse(otherChangesDiscountDropdown);

    var otherChangesOthersDropdown = await Common.bindDropDownSync('OtherChargesOther');
    OtherChangesOthersDropdown = JSON.parse(otherChangesOthersDropdown);

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    var fnData = Common.getDateFilter('dateDisplay2');

    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SaleId: null };
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
        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SaleId: null };
        Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);
    });

    $('#increment-month-btn2').click(function () {

        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SaleId: null };
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
            var EditDataId = { FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), SaleId: null };
            Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SaleId: null };
        Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });
}

function SaleSuccess(response) {
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

        var columns = Common.bindColumn(data[1], ['SaleId', 'Status_Color']);
        Common.bindTablePurchase('SaleData', data[1], columns, -1, 'SaleId', '330px', true, access);
    }
}

/* ================================  CRUD Function ==================================== */

$(document).on('click', '#customBtn_SaleData', function () {
    EditSaleId = 0;
    $('#loader-pms').show();

    Common.removevalidation('FormBillFrom');
    Common.removevalidation('FormClient');
    Common.removevalidation('FormRightSideHeader');
    Common.removevalidation('frmtaxdiscountothers');
    Common.removevalidation('FormStatus');
    TriggerValues = true;

    $("#ModalHeading").text("Add Tax Invoice");
    $('#ClientColumn').hide();
    $('#ShippingColumn').hide();

    var currentDate = new Date().toISOString().slice(0, 10);
    $('#InvoiceDate').attr("max", currentDate);
    $('#InvoiceDate').val(currentDate).trigger('change');

    var currentDate = new Date().toISOString().slice(0, 10);
    $('#DueDate').attr("min", currentDate);

    $("#btnSaveSale span:first").text("Save");
    $("#btnPrintSale span:first").text("Save & Print");
    $("#btnPreviewSale span:first").text("Save & Preview");

    $('#toggleIconShipTo').attr('title', 'Click to expand');

    $('#InwardId').empty().append('<option value="">-- Select --</option>');
    $('#OutwardId').empty().append($('<option>', { value: 'change', text: '--No Outward--' })).val('change').trigger('change').prop('disabled', true);

    BillingAddressDivClose();
    resetCommonData();

    $('#SaleStatusId').val('1');

    $('#TaxInfoIdDiv').hide();
    $('.Status-Div').hide();
    $("#TaxInvoiceModal .modal-body").animate({ scrollTop: 0 }, "fast");

    var EditDataId = { ModuleName: 'Sale', PlantId: PlantMappingId };
    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "TaxInvoiceNumber", "SaleNo");
    });

    $('#loader-pms').hide();
    $('#TaxInvoiceModal').show();
});

$(document).on('change', '#InvoiceDate', function () {
    var selectedDate = $(this).val();

    if (selectedDate) {

        var date = new Date(selectedDate);

        date.setDate(date.getDate() + 15);

        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        var nextDay = year + '-' + month + '-' + day;

        $('#DueDate').val(nextDay);
        //$('#DueDate').attr('min', nextDay);
    }
});

$('#SaleData').on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    EditSaleId = $(this).data('id');
    TriggerValues = false;

    Common.removevalidation('FormBillFrom');
    Common.removevalidation('FormClient');
    Common.removevalidation('FormRightSideHeader');
    Common.removevalidation('frmtaxdiscountothers');
    Common.removevalidation('FormStatus');

    $("#ModalHeading").text("Edit Tax Invoice");

    $("#btnSaveSale span:first").text("Update");
    $("#btnPrintSale span:first").text("Update & Print");
    $("#btnPreviewSale span:first").text("Update & Preview");

    $('#toggleIconShipTo').attr('title', 'Click to expand');

    $('#InwardId').empty().append('<option value="">-- Select --</option>');
    $('#OutwardId').empty().append($('<option>', { value: 'change', text: '--No Outward--' })).val('change').trigger('change').prop('disabled', true);

    BillingAddressDivOpen();
    resetCommonData();

    $('.Status-Div').hide();
    $('#TaxInfoIdDiv').hide();
    $("#TaxInvoiceModal .modal-body").animate({ scrollTop: 0 }, "fast");

    $('#TaxInvoiceModal').show();

    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SaleId: parseInt(EditSaleId) };
    Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, GetNotNullSale, null);
});

$(document).on('click', '#toggleShipTo, #toggleIconShipTo', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $rows = $('#ClientColumn .row.mt-3');
    const $taxDiv = $('#TaxInfoIdDiv');

    // Toggle both rows and Tax div together
    $rows.add($taxDiv).stop(true, true).slideToggle(300);

    const $icon = $('#toggleIconShipTo');
    $icon.toggleClass('fa-chevron-up fa-chevron-down');

    if ($icon.hasClass('fa-chevron-up')) {
        $icon.attr('title', 'Click to expand');
    } else {
        $icon.attr('title', 'Click to collapse');
    }

    $('#ClientColumn .BilAddHead')
        .css('border-bottom', '1px solid #c7c7c7');
});

$(document).on('click', '#TaxInvoiceClose, #btnCancelSale', function () {
    $('#TaxInvoiceModal').hide();
});

$(document).on('click', '#AddVendorLable', function () {
    BillingAddressDivOpen()
    $('#BillFrom').val('1').trigger('change');
});

$(document).on('change', '#ClientColumn #ClientId', async function () {
    if (TriggerValues) {
        $('#ClientId-error').remove();
        var ClientId = $('#ClientColumn #ClientId').val();
        //ClearInputs(); // Clear inputs 
        $('#InwardId').empty().append('<option value="">-- Select --</option>');
        $('#OutwardId').empty().append($('<option>', { value: 'change', text: '--No Outward--' })).val('change').trigger('change').prop('disabled', true);

        var response = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(ClientId));
        if (response !== null) {
            BillToAddress(response);

            var EditDataId = { MasterInfoId: parseInt(ClientId), ModuleName: "SaleInwardInsert" }
            //var EditDataId = { MasterInfoId: parseInt(ClientId), ModuleName: "TaxInvoiceMulti" }
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", EditDataId, function (response) {
                if (response.status);
                Common.bindDropDownMultiSuccess(response.data, "InwardId");
                //Common.bindDropDownSuccess(response.data, "InwardId");
            }, null);
        } else {
            BillToAddressClear();
            TableCommonData();
        }
    }
});

$(document).on('select2:select', '#InwardId', function (e) {
    if (TriggerValues) {
        var currentSelectedId = e.params.data.id;
        var EditDataId = { MasterInfoId: parseInt(currentSelectedId), ModuleName: "SaleOutwardInsert"};

        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", EditDataId, function (response) {
            if (response.status) {
                $('#OutwardId').prop('disabled', false);
                if ($('#OutwardId option[value="change"]').length == 1) {
                    $('#OutwardId').empty();
                }
                bindDropDownMultiSuccess(response.data, "OutwardId");
                $('#OutwardId').trigger('change');
            }
        }, null);
    } else {
        TableCommonData();
        $('#OutwardId').empty().append($('<option>', { value: 'change', text: '--No Outward--' })).val('change').trigger('change').prop('disabled', true);
    }
});

$(document).on('select2:unselect', '#InwardId', function (e) {
    var removedId = e.params.data.id;
    $('#OutwardId option[data-inward="' + removedId + '"]').remove();
    if ($('#OutwardId option').length == 0) {
        $('#OutwardId').empty().append($('<option>', { value: 'change', text: '--No Outward--' })).val('change').trigger('change').prop('disabled', true);
    }
    $('#OutwardId').trigger('change');
});

$(document).on('change', '#OutwardId', function () {
    if (TriggerValues) {
        var selectedOutwardIds = $(this).val() || [];

        $('#SaleProductTablebody .SaleProductRow').each(function () {
            var rowOutwardId = $(this).find('.OutWardIdTable').text().trim();
            if (!selectedOutwardIds.includes(rowOutwardId)) {
                $(this).remove();
            }
        });

        UpdateSaleTableSerialNumbers();
        CalculateSubtotal();

        if (selectedOutwardIds.length === 0) {
            TableCommonData();
            return;
        }

        var existingIds = [];

        $('#SaleProductTablebody .SaleProductRow').each(function () {
            var id = $(this).find('.OutWardIdTable').text().trim();
            if (id && !existingIds.includes(id)) {
                existingIds.push(id);
            }
        });

        var newIdsToLoad = selectedOutwardIds.filter(function (id) {
            return !existingIds.includes(id);
        });

        newIdsToLoad.forEach(function (outwardId) {
            var inwardId = $('#OutwardId option[value="' + outwardId + '"]').data('inward');
            var EditDataId = {
                InWardId: parseInt(inwardId),
                OutWardId: parseInt(outwardId)
            };
            Common.ajaxCall("GET", "/Sale/GetOutwardDetails_ByInWardId", EditDataId, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    BindTheDataOfTable(data);
                }
            }, null);
        });
    }
});

function BindTheDataOfTable(data) {

    if (!data || data.length === 0) {
        CalculateSubtotal();
        return;
    }

    var tableData = Array.isArray(data[0]) ? data[0] : data;

    var outwardId = tableData[0].OutWardId
        ? tableData[0].OutWardId.toString()
        : "";

    var alreadyLoaded = false;

    $('#SaleProductTablebody .SaleProductRow').each(function () {
        var existingId = $(this).find('.OutWardId').text().trim();
        if (existingId === outwardId) {
            alreadyLoaded = true;
            return false;
        }
    });

    if (alreadyLoaded) return;

    $.each(tableData, function (index, item) {

        let numberIncr = Math.random().toString(36).substring(2);

        const InWardNo = item.InWardNo || "-";
        const OutwardNo = item.OutwardNo || "-";
        const ColourProcess = item.ColourProcess || "-";
        const Roll = item.Roll || "-";
        const Weight = item.Weight ? parseFloat(item.Weight).toFixed(3) : "-";
        const Rate = item.Rate ? parseFloat(item.Rate).toFixed(2) : "";

        let actionTd = "-";

        if (!item.InWardNo) {
            actionTd = `<button class="btn DynrowRemove DynrowTaxRemove removeRowBtn"><i class="fas fa-trash-alt"></i></button>`;
        }

        let total = 0;
        if (InWardNo !== "-" && OutwardNo !== "-" && Weight === "-" && Rate !== "") {
            total = parseFloat(Rate);
        }
        else if (Weight !== "-" && Rate !== "") {
            total = parseFloat(Weight) * parseFloat(Rate);
        }

        var newRow = `
            <tr class="SaleProductRow">
                <td></td> 
                <td class="MappingId d-none"></td>
                <td class="OutWardIdTable d-none">${outwardId}</td>
                <td><input type="text" class="form-control DisabledTextBox InWardNo" value="${InWardNo}" /></td> 
                <td><input type="text" class="form-control DisabledTextBox OutwardNo" value="${OutwardNo}" /></td> 
                <td><input type="text" class="form-control DisabledTextBox ColourProcess" value="${ColourProcess}" /></td> 
                <td><input type="text" class="form-control DisabledTextBox Roll" value="${Roll}" /></td> 
                <td><input type="text" class="form-control DisabledTextBox Weight" value="${Weight}" /></td> 
                <td><input type="text" class="form-control Rate" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" value="${Rate}" id="${numberIncr}" name="${numberIncr}" required/></td> 
                <td><input type="text" class="form-control DisabledTextBox Amount" value="${formatRupee(total)}" /></td>
                <td style="text-align: center;">${actionTd}</td>
            </tr>
        `;

        $('#SubtotalRow').before(newRow);
    });

    UpdateSaleTableSerialNumbers();
    CalculateSubtotal();
}

$(document).on('click', '.DynrowTaxRemove', function () {
    $(this).closest("tr").remove();

    UpdateSaleTableSerialNumbers();
    CalculateSubtotal();
});

function UpdateSaleTableSerialNumbers() {
    $('#SaleProductTablebody .SaleProductRow').each(function (index) {
        $(this).find('td:first').text(index + 1);
    });
}

// ===============================
// Tax Change Event
// ===============================
$(document).on('change', '#TaxInfoId', function () {
    CalculateSubtotal();
});


// ===============================
// Rate Input Change
// ===============================
$(document).on('input', '.Rate', function () {

    var $row = $(this).closest('tr');

    var inWardNo = $row.find('.InWardNo').val();
    var outWardNo = $row.find('.OutwardNo').val();
    var weightVal = $row.find('.Weight').val();
    var rate = parseFloat($(this).val()) || 0;

    var total = 0;

    if (inWardNo !== "-" && outWardNo !== "-" && weightVal === "-") {
        total = rate;
    } else {
        var qty = parseFloat(weightVal) || 0;
        total = qty * rate;
    }

    total = parseFloat(total.toFixed(2));

    $row.find('.Amount').val(formatRupee(total));

    CalculateSubtotal();
});


// ===============================
// Calculate Subtotal
// ===============================
function CalculateSubtotal() {

    var subtotal = 0;

    $('#SaleProductTablebody .SaleProductRow').each(function () {
        var total = getNumber($(this).find('.Amount').val());
        subtotal += total;
    });

    subtotal = parseFloat(subtotal.toFixed(2));

    $('#Subtotal').val(formatRupee(subtotal));

    // 🔥 Pass subtotal to next step
    calculateFinalAmount(subtotal);
}


// ===============================
// GST + Round Off + Grand Total
// ===============================
function calculateFinalAmount(subtotal) {

    let finalTotal = subtotal;

    // ===============================
    // APPLY OTHER CHARGES
    // ===============================
    $("#dynamicBindRow .OtherChargesRow").each(function () {

        let row = $(this);
        let type = row.attr("data-id");

        let value = getNumber(row.find(".OtherValueInsert").val());
        let isPercentage = row.find("input[value='1']").is(":checked");

        let calcValue = 0;

        if (isPercentage) {
            calcValue = (subtotal * value) / 100;
        } else {
            calcValue = value;
        }

        calcValue = parseFloat(calcValue.toFixed(2));

        row.find(".otherChargeValue").val(formatRupee(calcValue));

        if (type === "Discount") {
            finalTotal -= calcValue;
        } else {
            finalTotal += calcValue;
        }
    });

    finalTotal = parseFloat(finalTotal.toFixed(2));

    // ===============================
    // APPLY GST
    // ===============================
    var gstPercent = 0;
    var selectedVal = $('#TaxInfoId').val();

    if (selectedVal == "1") gstPercent = 5;
    else if (selectedVal == "2") gstPercent = 12;
    else if (selectedVal == "3") gstPercent = 18;
    else if (selectedVal == "4") gstPercent = 28;

    var gstAmount = (finalTotal * gstPercent) / 100;
    gstAmount = parseFloat(gstAmount.toFixed(2));

    $('#GSTAmount').val(formatRupee(gstAmount));

    finalTotal += gstAmount;
    finalTotal = parseFloat(finalTotal.toFixed(2));

    // ===============================
    // ROUND OFF
    // ===============================
    let roundedTotal = Math.round(finalTotal);
    let roundOffValue = parseFloat((roundedTotal - finalTotal).toFixed(2));

    // ✅ Keep original sign for color logic
    if (roundOffValue > 0) {
        $('#roundOff').css('color', 'green');
    } else if (roundOffValue < 0) {
        $('#roundOff').css('color', 'orange');
    } else {
        $('#roundOff').css('color', 'blue');
    }

    // ✅ Always show positive value
    $('#roundOff').val(formatRupee(Math.abs(roundOffValue)));

    $('#GrantTotal').val(formatRupee(roundedTotal));
}

function BillToAddress(DataSet) {
    var data = JSON.parse(DataSet);
    $("#ClientColumn #ClientAddress").text(data[0][0].Address || '');
    $("#ClientColumn #ClientMobileNumber").text(data[0][0].ContactNumber || '');
    $("#ClientColumn #ClientPlaceOfSupply").text(data[0][0].StateName || '');
    $("#ClientColumn #ClientGSTNumber").text(data[0][0].GSTNumber || '');

    var city = data[0][0].City || '';
    var zipCode = data[0][0].ZipCode || '';

    var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
    $("#ClientColumn #ClientCity").text(cityName || '');
}

function BillToAddressClear() {
    $("#ClientColumn #ClientAddress").text('');
    $("#ClientColumn #ClientMobileNumber").text('');
    $("#ClientColumn #ClientPlaceOfSupply").text('');
    $("#ClientColumn #ClientGSTNumber").text('');
    $("#ClientColumn #ClientCity").text('');
}


$(document).on('change', '#BillFrom', async function () {
    $('#loader-pms').show();
    const ModuleId = $(this).val();
    const ModuleName = "BillFrom";

    if (ModuleId) {
        const url = `/Common/BillFromDetails_BillFromId?ModuleId=${parseInt(ModuleId)}&ModuleName=${ModuleName}`;
        const response = await Common.getAsycData(url);
        if (response !== null) {
            var data = JSON.parse(response);
            $("#BillFromAddress").text(data[0][0].BillFromAddress || '');
        }
    } else {
        $('#BillFromAddress').text('');
    }
    $('#loader-pms').hide();
});

function StatusSuccess(response) {
    var id = "SaleStatusId";
    Common.bindDropDownSuccess(response.data, id);
}

/* ========================================= CURD Operation ========================================== */

$(document).on('click', '#btnSaveSale', function () {
    saveSaleOrder(function (savedSaleId) {
        //console.log('Sale saved successfully with ID:', savedSaleId);
        EditSaleId = savedSaleId;
        $('#TaxInvoiceModal').hide();
    }, { showLoader: true, showSuccessMsg: true });
});

function saveSaleOrder(callback, options = {}) {
    const showLoader = options.showLoader !== false; // default true
    const showSuccessMsg = options.showSuccessMsg !== false; // default true

    if (showLoader) $('#loader-pms').show();

    getExistFiles();

    // Validate forms
    const BillFromIsValid = $("#FormBillFrom").validate().form();
    const ClientIsValid = $("#FormClient").validate().form();
    const RightSideHeaderIsValid = $("#FormRightSideHeader").validate().form();
    const taxdiscountothersValid = $("#frmtaxdiscountothers").validate().form();
    const StatusIsValid = $("#FormStatus").validate().form();
    const TableInputIsValid = $("#FromTableInput").validate().form();

    if (!BillFromIsValid || !ClientIsValid || !RightSideHeaderIsValid || !taxdiscountothersValid || !StatusIsValid || !TableInputIsValid) {
        $('#ClientId-error').insertAfter('.clienterror');
        if (showLoader) $('#loader-pms').hide();
        return;
    }

    var $thisValOfTax = $('#TaxInfoId').val();
    if ($thisValOfTax == "") {
        Common.warningMsg('Please fill in the Tax and click the arrow to expand.');
        $('#loader-pms').hide();
        return false;
    }

    const ClientInput = $('#ClientId').val();
    if (ClientInput === '') {
        Common.warningMsg('Click + Add Client and Fill the Input');
        if (showLoader) $('#loader-pms').hide();
        return;
    }

    if ($('.SaleProductRow').length === 0) {
        Common.warningMsg('Choose At least One Outward.');
        if (showLoader) $('#loader-pms').hide();
        return;
    }

    // Prepare SaleDetailsStatic
    const SaleDetailsStatic = {
        SaleId: EditSaleId > 0 ? EditSaleId : null,
        SaleNo: $('#TaxInvoiceNumber').val(),
        SaleDate: $('#InvoiceDate').val(),
        BillFrom: parseInt($('#BillFrom').val()),
        ClientId: parseInt(ClientInput),
        InWardId: parseInt($('#InwardId').val()),
        SubTotal: parseFloatValueInsert($('#Subtotal').val() || 0.00),
        RoundOffValue: parseFloatValueInsert($('#roundOff').val() || 0.00),
        GrantTotal: parseFloatValueInsert($('#GrantTotal').val() || 0.00),
        DueDate: $('#DueDate').val(),
        SaleStatusId: parseInt($('#SaleStatusId').val()),
        Notes: $('#Notes').val(),
        TaxInfoId: parseInt($('#TaxInfoId').val()),
    };

    // Prepare SaleOutWardMappingDetails
    const SaleOutWardMappingDetails = [];
    const OutwardId = $('#OutwardId').val();
    if (Array.isArray(OutwardId) && OutwardId.length > 0) {
        OutwardId.forEach(id => {
            SaleOutWardMappingDetails.push({
                SaleOutWardMappingId: null,
                SaleId: EditSaleId > 0 ? EditSaleId : null,
                OutWardId: parseInt(id) || null,
            });
        });
    }

    // Prepare SaleInwardMappingDetails
    const SaleInwardMappingDetails = [];
    const InwardId = $('#InwardId').val();
    if (Array.isArray(InwardId) && InwardId.length > 0) {
        InwardId.forEach(id => {
            SaleInwardMappingDetails.push({
                SaleInWardMappingId: null,
                SaleId: EditSaleId > 0 ? EditSaleId : null,
                InWardId: parseInt(id) || null,
            });
        });
    }

    // Prepare SaleOutWardFabricDetails
    const SaleOutWardFabricDetails = [];
    $('#SaleProductTablebody .SaleProductRow').each(function () {
        const $row = $(this);
        SaleOutWardFabricDetails.push({
            SaleOutWardFabricId: parseInt($row.find('.MappingId').text()) || null,
            OutWardId: parseInt($row.find('.OutWardIdTable').text()) || null,
            InWardNo: $row.find('.InWardNo').val(),
            OutWardNo: $row.find('.OutwardNo').val(),
            ColourProcess: $row.find('.ColourProcess').val(),
            NoOfRolls: safeParseInt($row.find('.Roll').val()),
            OutWardQty: safeParseFloat($row.find('.Weight').val()),
            Rate: safeParseFloat($row.find('.Rate').val()),
            Amount: parseFloatValueInsert($row.find('.Amount').val()),
            SaleId: EditSaleId > 0 ? EditSaleId : null,
        });
    });

    // Prepare PurchaseSaleOtherChargesMappingDetails
    const PurchaseSaleOtherChargesMappingDetails = [];
    $('#dynamicBindRow .dynamicBindRow').each(function () {
        const $row = $(this);
        const PurchaseSaleOtherChargesMappingId = $row.find('.dynamicBindRow').attr('data-OtherChargeMapping-id') || null;
        const ispercentageval = $row.find("input[type='radio']").attr("name");
        const oid = $row.find('.taxandothers').val();

        if (oid !== undefined) {
            PurchaseSaleOtherChargesMappingDetails.push({
                PurchaseSaleOtherChargesMappingId: PurchaseSaleOtherChargesMappingId === '' ? null : parseInt(PurchaseSaleOtherChargesMappingId),
                OtherChargesId: parseInt(oid || 0),
                OtherChargesType: $row.find('.taxandothers').attr('OtherChargesType'),
                IsPercentage: $row.find(`input[name='${ispercentageval}']:checked`).val() === "1",
                Value: parseFloatValueInsert($row.find('.OtherValueInsert').val() || 0),
                OtherChargeValue: parseFloatValueInsert($row.find('.otherChargeValue').val() || 0),
                ModuleId: EditSaleId > 0 ? EditSaleId : null,
            });
        }
    });

    // Append data to FormData
    formDataMultiple.append("SaleDetailsStatic", JSON.stringify(SaleDetailsStatic));
    formDataMultiple.append("SaleInwardMappingDetails", JSON.stringify(SaleInwardMappingDetails));
    formDataMultiple.append("SaleOutWardMappingDetails", JSON.stringify(SaleOutWardMappingDetails));
    formDataMultiple.append("SaleOutWardFabricDetails", JSON.stringify(SaleOutWardFabricDetails));
    formDataMultiple.append("PurchaseSaleOtherChargesMappingDetails", JSON.stringify(PurchaseSaleOtherChargesMappingDetails));
    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    // AJAX call to insert/update sale
    $.ajax({
        type: "POST",
        url: "/Sale/InsertUpdateSale",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: function (response) {
            formDataMultiple = new FormData();

            if (response.status) {
                if (showSuccessMsg) Common.successMsg(response.message);

                const dataId = JSON.parse(response.data);
                EditSaleId = dataId[0][0].SaleId;

                // Refresh sale data
                const fnData = Common.getDateFilter('dateDisplay2');
                const EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SaleId: null };
                Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);

                if (callback) callback(EditSaleId);
            } else {
                Common.errorMsg(response.message);
            }

            if (showLoader) $('#loader-pms').hide();
        },
        error: function (xhr) {
            formDataMultiple = new FormData();
            Common.errorMsg(xhr.responseJSON?.message || 'Something went wrong.');
            if (showLoader) $('#loader-pms').hide();
        }
    });
}

function safeParseInt(value) {
    if (!value || value.trim() === "-" || isNaN(value)) {
        return 0;   // or return null if preferred
    }
    return parseInt(value, 10);
}

function safeParseFloat(value) {
    if (!value || value.trim() === "-" || isNaN(value)) {
        return 0;   // or return null if preferred
    }
    return parseFloat(value);
}


$(document).on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var editSaleId = $(this).data('id');
        Common.ajaxCall("GET", "/Sale/DeleteSaleDetails", { SaleId: parseInt(editSaleId) }, function (response) {
            response = response.status ? Common.successMsg(response.message) : Common.errorMsg(response.message);

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SaleId: null };
            Common.ajaxCall("GET", "/Sale/GetSale", EditDataId, SaleSuccess, null);
        }, null);
    }
});

/* ========================================= NOT NULL GET ========================================== */

//async function GetNotNullSale(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var dataMultiplOutWard = data[1];
//        var dataMultiplInward = data[5];
//        var dataMainTable = data[2];
//        var dataOtherSett = data[3];

//        $('#TaxInvoiceNumber').val(data[0][0].SaleNo);
//        $('#InvoiceDate').val(formatDateForInput(data[0][0].SaleDate));
//        $('#BillFrom').val(data[0][0].BillFrom).trigger('change');
//        $('#roundOff').val(data[0][0].RoundOffValue);
//        $('#GrantTotal').val(data[0][0].GrantTotal);
//        $('#DueDate').val(formatDateForInput(data[0][0].DueDate));
//        $('#SaleStatusId').val(data[0][0].SaleStatusId);
//        $('#TaxInfoId').val(data[0][0].TaxInfoId);

//        toggleField(data[0][0].Notes, "#Notes", "#AddNotes", "#AddNotesLable", "#HideNotes");
//        toggleFieldForAttachment(data[4][0].AttachmentId, "#AddAttachment", "#AddAttachLable", "#hideAttach");

//        Inventory.bindAttachments(data[4]);

//        var responseClient = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(data[0][0].ClientId));
//        if (responseClient !== null) {
//            BillToAddress(responseClient);
//            $('#ClientId').val(data[0][0].ClientId).trigger('change');
//            $('#loader-pms').show();

//            var EditDataId = { MasterInfoId: parseInt(data[0][0].ClientId), ModuleName: "SaleInward" }
//            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", EditDataId, function (responseSaleInward) {
//                if (responseSaleInward.status);
//                $('#loader-pms').show();

//                Common.bindDropDownMultiSuccess(responseSaleInward.data, "InwardId");
//                //Common.bindDropDownSuccess(responseSaleInward.data, "InwardId");

//                var selectedValues = [];
//                if (Array.isArray(dataMultiplInward)) {
//                    selectedValues = dataMultiplInward.map(function (item) {
//                        return item.InWardId;
//                    });
//                } else if (dataMultiplInward) {
//                    selectedValues.push(dataMultiplInward.InWardId);
//                }
//                $('#InwardId').val(selectedValues).trigger('change');

//                //var EditDataId = { MasterInfoId: parseInt(data[0][0].InWardId), ModuleName: "SaleOutward" }
//                var EditDataId = { MasterInfoId: parseInt(selectedValues), ModuleName: "SaleOutward" }
//                Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", EditDataId, function (responseSaleOutward) {
//                    if (responseSaleOutward.status);
//                    $('#OutwardId').prop('disabled', false);
//                    $('#OutwardId').empty();

//                    bindDropDownMultiSuccess(responseSaleOutward.data, "OutwardId");

//                    var selectedValues = [];
//                    if (Array.isArray(dataMultiplOutWard)) {
//                        selectedValues = dataMultiplOutWard.map(function (item) {
//                            return item.OutWardId;
//                        });
//                    } else if (dataMultiplOutWard) {
//                        selectedValues.push(dataMultiplOutWard.OutWardId);
//                    }

//                    $('#OutwardId').val(selectedValues).trigger('change');

//                    BindOutWardFabricDataSequentially(dataMainTable);
//                    OtherChangesNotNull(dataOtherSett);

//                    TriggerValues = true;
//                    $('#loader-pms').hide();
//                }, null);
//            }, null);
//        }
//    }
//}


async function GetNotNullSale(response) {
    if (!response.status) return;

    try {
        var data = JSON.parse(response.data);

        var dataMultiplOutWard = data[1];
        var dataMultiplInward = data[5];
        var dataMainTable = data[2];
        var dataOtherSett = data[3];
        var saleInfo = data[0][0];
        var attachments = data[4];

        // Fill basic fields
        $('#TaxInvoiceNumber').val(saleInfo.SaleNo);
        $('#InvoiceDate').val(formatDateForInput(saleInfo.SaleDate));
        $('#BillFrom').val(saleInfo.BillFrom).trigger('change');
        $('#roundOff').val(saleInfo.RoundOffValue);
        $('#GrantTotal').val(saleInfo.GrantTotal);
        $('#DueDate').val(formatDateForInput(saleInfo.DueDate));
        $('#SaleStatusId').val(saleInfo.SaleStatusId);
        $('#TaxInfoId').val(saleInfo.TaxInfoId);

        toggleField(saleInfo.Notes, "#Notes", "#AddNotes", "#AddNotesLable", "#HideNotes");
        toggleFieldForAttachment(attachments[0].AttachmentId, "#AddAttachment", "#AddAttachLable", "#hideAttach");
        Inventory.bindAttachments(attachments);

        // Get client details
        const responseClient = await Common.getAsycData(`/Common/ClientDetailsByClientId?clientId=${saleInfo.ClientId}`);
        if (responseClient !== null) {
            BillToAddress(responseClient);
            $('#ClientId').val(saleInfo.ClientId).trigger('change');
            $('#loader-pms').show();

            // Load Inward dropdown
            const EditDataIdInward = { MasterInfoId: parseInt(saleInfo.ClientId), ModuleName: "SaleInward" };
            const responseSaleInward = await ajaxCallAsync("GET", "/Inventory/GetDDMasterInfoValue", EditDataIdInward);

            if (responseSaleInward && responseSaleInward.status) {
                Common.bindDropDownMultiSuccess(responseSaleInward.data, "InwardId");

                // select saved inward values
                let selectedInwardValues = [];
                if (Array.isArray(dataMultiplInward)) {
                    selectedInwardValues = dataMultiplInward.map(item => item.InWardId);
                } else if (dataMultiplInward) {
                    selectedInwardValues.push(dataMultiplInward.InWardId);
                }

                $('#InwardId').val(selectedInwardValues).trigger('change');

                // Clear and enable Outward dropdown
                $('#OutwardId').prop('disabled', false).empty();

                // Fetch Outwards for each selected Inward sequentially
                for (let inwardId of selectedInwardValues) {
                    const EditDataIdOutward = { MasterInfoId: parseInt(inwardId), ModuleName: "SaleOutward" };
                    const responseSaleOutward = await ajaxCallAsync("GET", "/Inventory/GetDDMasterInfoValue", EditDataIdOutward);

                    if (responseSaleOutward && responseSaleOutward.status) {
                        // append options
                        bindDropDownMultiSuccess(responseSaleOutward.data, "OutwardId");
                    }
                }

                // select saved Outward values
                let selectedOutwardValues = [];
                if (Array.isArray(dataMultiplOutWard)) {
                    selectedOutwardValues = dataMultiplOutWard.map(item => item.OutWardId);
                } else if (dataMultiplOutWard) {
                    selectedOutwardValues.push(dataMultiplOutWard.OutWardId);
                }

                $('#OutwardId').val(selectedOutwardValues).trigger('change');

                // Bind main table data and other settings
                BindOutWardFabricDataSequentially(dataMainTable);
                OtherChangesNotNull(dataOtherSett);

                TriggerValues = true;
                $('#loader-pms').hide();
            }
        }
    } catch (err) {
        console.error("GetNotNullSale error:", err);
        $('#loader-pms').hide();
    }
}

function ajaxCallAsync(method, url, data) {
    return new Promise((resolve, reject) => {
        Common.ajaxCall(method, url, data, function (response) {
            resolve(response);
        }, function (err) {
            reject(err);
        });
    });
}


async function BindOutWardFabricDataSequentially(fabricData) {

    $('#loader-pms').show();

    if (!fabricData || fabricData.length === 0) {
        CalculateSubtotal();
        return;
    }

    const groupedData = {};
    fabricData.forEach(item => {
        if (!groupedData[item.OutWardId]) groupedData[item.OutWardId] = [];
        groupedData[item.OutWardId].push(item);
    });

    for (const outwardId in groupedData) {
        const rows = groupedData[outwardId];

        let alreadyLoaded = false;
        $('#SaleProductTablebody .SaleProductRow').each(function () {
            const existingId = $(this).find('.OutWardIdTable').text().trim();
            if (existingId === outwardId) {
                alreadyLoaded = true;
                return false;
            }
        });

        if (alreadyLoaded) continue;

        for (const item of rows) {

            let numberIncr = Math.random().toString(36).substring(2);

            await new Promise(resolve => {
                const InWardNo = item.InWardNo || "-";
                const OutwardNo = item.OutWardNo || "-";
                const ColourProcess = item.ColourProcess || "-";
                const Roll = item.NoOfRolls || "-";
                const Weight = item.OutWardQty ? parseFloat(item.OutWardQty).toFixed(3) : "-";
                const Rate = item.Rate ? parseFloat(item.Rate).toFixed(2) : "";
                let total = 0;

                let actionTd = "-";

                if (item.InWardNo == '-') {
                    actionTd = `<button class="btn DynrowRemove DynrowTaxRemove removeRowBtn"><i class="fas fa-trash-alt"></i></button>`;
                }

                if (InWardNo !== "-" && OutwardNo !== "-" && Weight === "-" && Rate !== "") {
                    total = parseFloat(Rate);
                } else if (Weight !== "-" && Rate !== "") {
                    total = parseFloat(Weight) * parseFloat(Rate);
                }

                const newRow = `
                    <tr class="SaleProductRow">
                        <td></td>
                        <td class="MappingId d-none">${item.SaleOutWardFabricId}</td>
                        <td class="OutWardIdTable d-none">${outwardId}</td>
                        <td><input type="text" class="form-control DisabledTextBox InWardNo" value="${InWardNo}" /></td>
                        <td><input type="text" class="form-control DisabledTextBox OutwardNo" value="${OutwardNo}" /></td>
                        <td><input type="text" class="form-control DisabledTextBox ColourProcess" value="${ColourProcess}" /></td>
                        <td><input type="text" class="form-control DisabledTextBox Roll" value="${Roll}" /></td>
                        <td><input type="text" class="form-control DisabledTextBox Weight" value="${Weight}" /></td>
                        <td><input type="text" class="form-control Rate" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" value="${Rate}" id="${numberIncr}" name="${numberIncr}" required /></td>
                        <td><input type="text" class="form-control DisabledTextBox Amount" value="${formatRupee(total)}" /></td>
                        <td style="text-align: center;">${actionTd}</td>
                    </tr>
                `;

                $('#SubtotalRow').before(newRow);

                resolve();
            });

        }
    }

    UpdateSaleTableSerialNumbers();
    CalculateSubtotal();
}

function OtherChangesNotNull(OtherChargesArray) {
    if (OtherChargesArray[0].OtherChargesId != null) {
        if (!OtherChargesArray || OtherChargesArray.length === 0) return;

        OtherChargesArray.forEach(function (value) {

            let OtherChangesSelectOptions = "";
            let defaultOption = '<option value="">--Select--</option>';

            let dropdownSource = value.OtherChargesType === "Discount" ? OtherChangesDiscountDropdown : OtherChangesOthersDropdown;

            if (dropdownSource && dropdownSource.length > 0 && dropdownSource[0].length > 0) {
                OtherChangesSelectOptions = dropdownSource[0].map(function (item) {
                    let isSelected = item.OtherChargesId == value.OtherChargesId ? "selected" : "";
                    return `
                    <option value="${item.OtherChargesId}" ${isSelected}>${item.OtherChargesName}</option>`;
                }).join("");
            }

            // Unique ID
            let uniqueId = Math.random().toString(36).substring(2);

            let HtmlOtherCharges = `
            <div class="col-12 OtherChargesRow" data-OtherChargeMapping-id="${value.PurchaseBillOtherChargesMappingId}" data-id="${value.OtherChargesType}">
                <div class="mt-3">
                    <div class="discount-row dynamicBindRow">
                        
                        <!-- DROPDOWN -->
                        <div class="discount-drop">
                            <select class="form-control discount-select taxandothers" id="OtherChargesId${uniqueId}" name="OtherChargesId${uniqueId}" OtherChargesType="${value.OtherChargesType}" required>
                                ${defaultOption}${OtherChangesSelectOptions}
                            </select>
                        </div>

                        <!-- RADIO BUTTONS -->
                        <div class="discount-radio">
                            <label>
                                <input type="radio" name="amounttype${uniqueId}" value="1" class="calculateinventory" ${value.IsPercentage ? "checked" : ""}> %
                            </label>
                            <label>
                                <input type="radio" name="amounttype${uniqueId}" value="0" class="calculateinventory" ${!value.IsPercentage ? "checked" : ""}> ₹
                            </label>
                        </div>

                        <!-- ENTERED VALUE -->
                        <input type="text" class="form-control discount-input OtherValueInsert" id="Value${uniqueId}" name="Value${uniqueId}" value="${value.Value.toFixed(2) ?? ""}" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,8)">

                        <!-- CALCULATED VALUE -->
                        <input type="text" class="form-control discount-input otherChargeValue" name="OtherChargeValue${uniqueId}" value="${value.OtherChargeValue ?? ""}" style="background-color:#dee2e647" readonly disabled>

                        <!-- DELETE BUTTON -->
                        <button class="btn OtherDynamicRemove DynrowRemove" type="button">
                            <i class="fas fa-trash-alt"></i>
                        </button>

                    </div>
                </div>
            </div>
        `;

            $("#dynamicBindRow").append(HtmlOtherCharges);
        });
        calculateOtherCharges();
    }
}

function formatDateForInput(dateStr) {
    if (!dateStr) return "";
    var parts = dateStr.split('-');
    if (parts.length !== 3) return "";
    return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
}

function toggleField(fieldValue, textBoxId, sectionId, addLabelId, hideLabelId) {
    if (fieldValue !== null && fieldValue !== undefined && fieldValue !== "") {
        $(textBoxId).val(fieldValue);
        $(sectionId).show();
        $(addLabelId).hide();
        $(hideLabelId).hide();
    } else {
        $(textBoxId).val("");
        $(sectionId).hide();
        $(addLabelId).show();
        $(hideLabelId).show();
    }
}

function toggleFieldForAttachment(fieldValue, sectionId, addLabelId, hideLabelId) {
    if (fieldValue !== null && fieldValue !== undefined && fieldValue !== "") {
        $(sectionId).show();
        $(addLabelId).hide();
        $(hideLabelId).hide();
    } else {
        $(sectionId).hide();
        $(addLabelId).show();
        $(hideLabelId).show();
    }
}

/* ===================================== Common  FUNCTION =========================================== */
$(document).on('click', '#AddNotesLable', function () {
    $('#AddNotes').show();
    $("#AddNotesLable").hide();
    $('#HideNotes').hide();
});
$(document).on('click', '#HideNotesLable', function () {
    $('#AddNotes').hide();
    $("#AddNotesLable").show();
    $('#HideNotes').show();
});
$(document).on('click', '#AddAttachLable', function () {
    $('#AddAttachment').show();
    $('#AddAttachLable').hide();
    $("#hideAttach").hide();
});
$(document).on('click', '#HideAttachlable', function () {
    $('#AddAttachment').hide();
    $('#AddAttachLable').show();
    $("#hideAttach").show();
});

function BillingAddressDivOpen() {
    $('#AddVendorlableColumn').hide();
    $('#ClientColumn').show();
    $('#BillFromColumn').show();
    $('#ShippingColumn').show();
    $('#AddVendorlableColumn').removeClass('d-flex justify-content-center');
    $('#InvoiceNoDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-3 col-md-6 col-sm-6 col-6');
    $('#InvoiceDateDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-2 col-md-6 col-sm-6 col-6');
    $('#InwardDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-3 col-md-6 col-sm-6 col-6');
    $('#OutWardDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');

    $('#TaxInvoiceColumn').removeClass('col-lg-6 col-md-6 col-sm-6 col-12 mb-0').addClass('col-lg-8 col-md-6 col-sm-6 col-12 mb-2');
    $('#toggleIconShipTo').toggleClass('fa-chevron-up fa-chevron-down');
}

function BillingAddressDivClose() {
    $('#AddVendorlableColumn').show();
    $('#ClientColumn').hide();
    $('#BillFromColumn').hide();
    $('#ShippingColumn').hide();

    /*$('#AddVendorlableColumn').addClass('d-flex justify-content-center');*/
    $('#InvoiceNoDiv').removeClass('col-lg-3 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#InvoiceDateDiv').removeClass('col-lg-2 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#InwardDiv').removeClass('col-lg-3 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');
    $('#OutWardDiv').removeClass('col-lg-4 col-md-6 col-sm-6 col-6').addClass('col-lg-4 col-md-6 col-sm-6 col-6');

    $('#TaxInvoiceColumn').removeClass('col-lg-8 col-md-6 col-sm-6 col-12 mb-2').addClass('col-lg-6 col-md-6 col-sm-6 col-12 mb-0');
}

function resetCommonData() {
    $('#discounttotal,#GSTtotal,#Subtotal,#GrantTotal, #roundOff').val('');
    $('#SubTotalTotal, #CGSTTotal, #SGSTTotal, #IGSTTotal, #CESSTotal').val('');
    $('#selectedFiles, #ExistselectedFiles').empty('');
    $('#ClientId').val('').trigger('change');

    existFiles = [];
    formDataMultiple = new FormData();
    $('#SaleProductTable .SaleProductRow').remove();
    $('#dynamicBindRow').empty('');

    $('#AddAttachment').hide();
    $('#AddAttachLable').show();
    $("#hideAttach").show();

    $('#AddNotes').hide();
    $("#AddNotesLable").show();
    $('#HideNotes').show();
    $('#roundOff').css('color', 'black');

    $('#Notes').val('');

    const $rows = $('#ClientColumn .row.mt-3');
    const $icon = $('#toggleIconShipTo');
    $rows.hide();
    $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
    $icon.attr('title', 'Click to expand');

    $('#BillFromAddress').text('');
}

function TableCommonData() {
    $('#discounttotal,#GSTtotal,#Subtotal,#GrantTotal, #roundOff').val('');
    $('#SubTotalTotal, #CGSTTotal, #SGSTTotal, #IGSTTotal, #CESSTotal').val('');
    $('#SaleProductTable .SaleProductRow').remove();
    $('#dynamicBindRow').empty('');
    $('#roundOff').css('color', 'black');
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
//============================================END SHORTCUTS============================================


/*------------------------------Attachment------------------------*/-

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

function getExistFiles() {

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

/*------------------------------End Attachment------------------------*/

/* ======================================= Other Charges  ============================================ */
$('#OtherchargesAdd').click(function () {
    $('#loader-pms').show();
    var TableLenthDynamicRow = $('.SaleProductRow').length;
    if (TableLenthDynamicRow == 0) {
        Common.warningMsg('Choose Atleast One Outward.');
        $('#loader-pms').hide();
        return false;
    } else {
        $('#OtherChargesDropDown').toggle();
    }
    $('#loader-pms').hide();
});

$(document).on('click', '.ddlOtherCharges', function () {
    $('#OtherChargesDropDown').hide();
    var otherChargesTypeName = $(this).attr('OtherCharges');
    Common.ajaxCall("GET", "/PurchaseInvoice/GetOtherChargesType?OtherChargesTypeName=" + otherChargesTypeName + "&OtherChargesId=null", null, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);

            var OtherChangesSelectOptions = "";
            var defaultOption = '<option value="">--Select--</option>';
            if (data[0][0].OtherChargesType == 'Discount') {
                if (OtherChangesDiscountDropdown != null && OtherChangesDiscountDropdown.length > 0 && OtherChangesDiscountDropdown[0].length > 0) {
                    OtherChangesSelectOptions = OtherChangesDiscountDropdown[0].map(function (OtherChargesId) {
                        return `<option value="${OtherChargesId.OtherChargesId}">${OtherChargesId.OtherChargesName}</option>`;
                    }).join('');
                }
            } else {
                if (OtherChangesOthersDropdown != null && OtherChangesOthersDropdown.length > 0 && OtherChangesOthersDropdown[0].length > 0) {
                    OtherChangesSelectOptions = OtherChangesOthersDropdown[0].map(function (OtherChargesId) {
                        return `<option value="${OtherChargesId.OtherChargesId}">${OtherChargesId.OtherChargesName}</option>`;
                    }).join('');
                }
            }

            let uniqueId = Math.random().toString(36).substring(2);

            var HtmlOtherCharges = `
            <div class="col-12 OtherChargesRow" data-id="${otherChargesTypeName}">
                <div class="mt-3">
                    <div class="discount-row dynamicBindRow" data-OtherChargeMapping-id="">
                        <div class="discount-drop">
                        <select class="form-control discount-select taxandothers" id="OtherChargesId${uniqueId}" name="OtherChargesId${uniqueId}" OtherChargesType="${data[0][0].OtherChargesType}" required>
                            ${defaultOption}${OtherChangesSelectOptions}
                        </select>
                        </div>
                        <div class="discount-radio">
                            <label><input type="radio" name="amounttype1${uniqueId}" id="IsPercentage" value="1" class="calculateinventory"> %</label>
                            <label><input type="radio" name="amounttype1${uniqueId}" id="Amount" class="calculateinventory"> ₹</label>
                        </div>

                        <input type="text" class="form-control discount-input OtherValueInsert" id="Value${uniqueId}" name ="Value${uniqueId}" placeholder="0.00" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,8)" placeholder="0.00">

                        <input type="text" class="form-control discount-input otherChargeValue" id="OtherChargeValue" name="OtherChargeValue${uniqueId}" placeholder="0.00" style="background-color:#dee2e647" readonly="" disabled>

                        <button id="" class="btn OtherDynamicRemove DynrowRemove" type="button"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>`;
            $('#dynamicBindRow').append(HtmlOtherCharges);
            $('#OtherChargesId' + uniqueId).closest('.dynamicBindRow').find('input.calculateinventory[value="1"]').prop('checked', false);
            calculateOtherCharges();
        }
    }, null);
});

$(document).on('change', '.taxandothers', function () {
    var $thisval = $(this).val();
    const $select = $(this);
    var otherChargesTypeName = $(this).attr('OtherChargesType');
    if ($thisval != null && $thisval != '') {
        Common.ajaxCall("GET", "/PurchaseInvoice/GetOtherChargesType?OtherChargesTypeName=" + otherChargesTypeName + "&OtherChargesId=" + parseInt($thisval), null,
            function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    var $row = $select.closest('.discount-row');
                    if (data[0][0].IsPercentage) {
                        $row.find('#IsPercentage').prop('checked', true);
                        $row.find('#Amount').prop('checked', false);
                    } else {
                        $row.find('#Amount').prop('checked', true);
                        $row.find('#IsPercentage').prop('checked', false);
                    }
                    $row.find('.OtherValueInsert').val(data[0][0].Value ?? 0);
                    calculateOtherCharges();
                }
            },
            null
        );
    } else {
        var $row = $select.closest('.discount-row');
        $row.find('#IsPercentage').prop('checked', false);
        $row.find('#Amount').prop('checked', false);
        $row.find('.OtherValueInsert').val('');
        $row.find('.otherChargeValue').val('');
        calculateOtherCharges();
    }
});

$(document).on('click', '.OtherDynamicRemove', function () {
    $(this).closest('.OtherChargesRow').remove();
    CalculateSubtotal();
});

$(document).on("input change", ".calculateinventory, .OtherValueInsert", function () {
    CalculateSubtotal();
});

function calculateOtherCharges() {

    // ✅ Read grand total WITHOUT ₹
    let grandTotal = getNumber($("#Subtotal").val());
    let finalTotal = grandTotal;

    $("#dynamicBindRow .OtherChargesRow").each(function () {
        let row = $(this);
        let type = row.attr("data-id");

        let value = getNumber(row.find(".OtherValueInsert").val());
        let isPercentage = row.find("input[value='1']").is(":checked");

        let calcValue = 0;

        if (isPercentage) {
            calcValue = (grandTotal * value) / 100;
        } else {
            calcValue = value;
        }

        // ✅ Show ₹, store numeric
        row.find(".otherChargeValue").val(formatRupee(calcValue));
        row.find(".otherChargeValueRaw").val(calcValue.toFixed(2)); // hidden raw field (optional)

        if (type === "Discount") {
            finalTotal -= calcValue;
        } else {
            finalTotal += calcValue;
        }
    });

    // =========================
    // CUSTOM ROUNDING RULE
    // =========================

    let beforeRound = finalTotal.toFixed(2);
    let split = beforeRound.split('.');
    let whole = parseInt(split[0], 10);
    let decimal = parseFloat("0." + split[1]);

    let roundedTotal = 0;
    let roundOffValue = 0;

    // CASE 1 — Decimal = 0 → No rounding
    if (decimal === 0) {
        roundedTotal = whole;
        roundOffValue = 0;
        $('#roundOff').css('color', 'blue');
    }
    // CASE 2 — Decimal < 0.50 → ROUND DOWN
    else if (decimal < 0.50) {
        roundedTotal = whole;
        roundOffValue = decimal;
        $('#roundOff').css('color', 'orange');
    }
    // CASE 3 — Decimal ≥ 0.50 → ROUND UP
    else {
        roundedTotal = whole + 1;
        roundOffValue = 1 - decimal;
        $('#roundOff').css('color', 'green');
    }

    // ✅ Bind with ₹
    $('#roundOff').val(formatRupee(roundOffValue));
    $("#GrantTotal").val(formatRupee(roundedTotal.toFixed(2)));
}


//// ========== Row Insert Parsing Function ==========
function parseFloatValueInsert(value) {
    if (value == null) return 0;

    return parseFloat(
        value
            .toString()
            .replace(/₹/g, '')   // remove rupee symbol
            .replace(/,/g, '')   // remove commas
            .replace('%', '')    // remove percentage if present
            .trim()
    ) || 0;
};

function getNumber(value) {
    if (value == null) return 0;

    return parseFloat(
        value
            .toString()
            .replace(/₹/g, '')
            .replace(/,/g, '')
            .trim()
    ) || 0;
}

function formatRupee(value) {
    let num = getNumber(value);

    return '₹' + num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/* ======================================= End Other Charges  ============================================ */

/* ======================================= Print and Preview  ============================================ */

$(document).on('click', '#btnPrintSale', function () {
    $('#loader-pms').show();

    saveSaleOrder(function (saleId) {
        if (!saleId) {
            $('#loader-pms').hide();
            Common.errorMsg("Sale ID not found");
            return;
        }

        $('#loader-pms').show();

        const EditData = {
            ModuleId: parseInt(saleId),
            NoOfCopies: 1,
            printType: "Print"
        };

        $.ajax({
            type: 'GET',
            url: '/Sale/SaleOrderPrint',
            data: EditData,
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response) {
                $('#ShareDropdownitems').hide();

                const blob = new Blob([response], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);

                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = blobUrl;
                document.body.appendChild(iframe);
                iframe.onload = function () {
                    iframe.contentWindow.print();
                };

                $('#loader-pms').hide();
            },
            error: function () {
                $('#loader-pms').hide();
                Common.errorMsg("Print failed");
            }
        });

    }, {
        showSuccessMsg: false
    });
});

$(document).on('click', '#btnPreviewSale', function () {
    $('#loader-pms').show();

    saveSaleOrder(function (saleId) {
        if (!saleId) {
            $('#loader-pms').hide();
            Common.errorMsg("Sale ID not found");
            return;
        }

        $('#loader-pms').show();

        const EditData = {
            ModuleId: parseInt(saleId),
            NoOfCopies: 1,
            printType: "Preview"
        };

        $.ajax({
            type: 'GET',
            url: '/Sale/SaleOrderPrint',
            data: EditData,
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response) {
                $('#ShareDropdownitems').hide();

                const blob = new Blob([response], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);

                const newTab = window.open();
                if (newTab) {
                    newTab.document.write(`
                        <html>
                        <head><title>Sale Preview</title></head>
                        <body style="margin:0; padding:0;">
                            <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%" />
                        </body>
                        </html>
                    `);
                    newTab.document.close();
                } else {
                    Common.warningMsg("Popup blocked. Please allow popups.");
                }

                $('#loader-pms').hide();
            },
            error: function () {
                $('#loader-pms').hide();
                Common.errorMsg("Preview failed");
            }
        });

    }, {
        showSuccessMsg: false
    });
});

function bindDropDownMultiSuccess(response, controlid) {
    if (response != null) {
        var data = JSON.parse(response);
        var dataValue = data[0];

        if (dataValue != null && dataValue.length > 0 && !dataValue[0].hasOwnProperty('TetroONEnocount')) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[2]; // OutwardNo

            $.each(dataValue, function (index, item) {

                $('#' + controlid).append($('<option>', {
                    value: item[valueproperty],          // OutwardId
                    text: item[textproperty],            // OutwardNo
                    'data-inward': item.InwardId         // store InwardId reference
                }));
            });
        } else {
            $('#' + controlid).empty();
        }
    }
}