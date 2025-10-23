
/* ================================== Initial Load Event ======================================== */
var EditSaleReturnId = 0;
var IsIGST = true;
var FranchiseMappingId = 0;

$(document).ready(function () {

    $('#loader-pms').show();
    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    /*--------------------Validation For Inputs---------------------------*/
    $('#ClientId').append('<option value="">-- Select --</option>');
    Common.handleDropdownError('#SaleReturnStatusId');
    Common.handleDropdownError('#SaleDate');
    Common.handleDropdownError('#SaleId');

    /*--------------------Validation For Inputs---------------------------*/

    initializePage(FranchiseMappingId);
    $('#SaleReturnModal').hide();

    /* Common.bindDropDown('ClientId', 'Client');*/

    Common.bindDropDown('AlternativeCompanyAddress', 'UserFranchiseMapping');

    $('#ClientId,#AlternativeCompanyAddress').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });


    $('#addSaleReturn').click(function () {
        var products = [];
        let unique = Math.random().toString(36).substring(2);
        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('AlternativeCompanyAddress'), ModuleName: 'FranchiseProduct' }, function (response) {
            products = JSON.parse(response.data);
            if (products != null && products.length > 0 && products[0].length > 0) {
                var productsOptions = products[0].map(function (productsVal) {
                    return `<option value="${productsVal.ProductId}">${productsVal.ProductName}</option>`;
                }).join('');
            }
            var defaultOption = '<option value="">--Select--</option>';
            var html = `<tr class="dynSaleReturn" data-id="">
                                <td>
                                    <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required="" fdprocessedid="cq7cm" autocomplete="no-0.49987932811255653">
                                           ${defaultOption}${productsOptions}
                                    </select>
                                </td>
                                <td>
                                    <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required="" fdprocessedid="cq7cm" autocomplete="no-0.49987932811255653">
                                        <option value="">--Select--</option>
                                    </select>
                                </td>
                                <td><input type="text" id="Price${unique}" name="Price${unique}" class="form-control Price" placeholder="0.00" required=""   oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)""></td>

                                <td><input type="text" id="RefundQty${unique}" name="RefundQty${unique}" class="form-control refundQty" placeholder="Qty" required=""  oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)"></td>

                             <td Class="CGSTValues" data-label="CGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="CGSTPercentage" value="" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>
                         
                    </div>
                   
                     <input type="text" id="CGSTAmount" value="" class="form-control d-none mt-2" placeholder="₹" Readonly>
                     <small class="CGSTDisplay mt-3">0.00(0%)</small>
                 </td>

                 <td Class="SGSTValues" data-label="SGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="SGSTPercentage" value="" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="SGSTAmount" value="" class="form-control d-none mt-2" placeholder="₹" Readonly>
                     <small class="SGSTDisplay mt-3">0.00(0%)</small>
                 </td>
           
                 <td Class="IGSTValues" data-label="IGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="IGSTPercentage" value="" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="IGSTAmount" value="" class="form-control d-none mt-2" placeholder="₹" Readonly>
                     <small class="IGSTDisplay mt-3">0.00(0%)</small>
                 </td>

                <td Class="CessValues" data-label="Cess" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="CESSPercentage" value="" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="CESSAmount" value="" class="form-control d-none mt-2" placeholder="₹" Readonly>
                     <small class="CESSDisplay mt-3">0.00(0%)</small>
                 </td>
                                <td><input type="text" id="TotalAmount${unique}" name="TotalAmount${unique}" class="form-control totalAmount" placeholder="0.00" disabled></td>
                                <td class="d-flex justify-content-center">
                                    <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height:34px;width:34px;" fdprocessedid="m7p2j9">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>`;
            $('#dynamicSaleReturn').append(html);

            let $row = $('#dynamicSaleReturn tr').last();
            if (IsIGST == false) {
                IsIGST = false;
                $row.find('.SGSTValues,.CGSTValues').show();
                $('#CGSTHead,#SGSTHead').show();
                $row.find('.IGSTValues').hide();
                $('#IGSTHead').hide();
            } else {
                IsIGST = true;
                $row.find('.SGSTValues,.CGSTValues').hide();
                $('#CGSTHead,#SGSTHead').hide();
                $row.find('.IGSTValues').show();
                $row.find('#IGSTHead').show();
            }
        });


    });

    $(document).on('change', '#AlternativeCompanyAddress', function () {
        var franchis = $(this).val();
        bindDistributorDropdown(franchis);
        if (franchis != "") {

            $('#dynamicSaleReturn').empty("");
            $('#addSaleReturn').click();
        }
    });

    $(document).on('change', '#dynamicSaleReturn .productId', function () {
        var productId = $(this).val();
        var thisSelectElement = $(this);
        $('select.productId').each(function (index, value) {
            var existVal = $(value).val();
            if (existVal == productId && value !== thisSelectElement[0] && existVal != null) {
                thisSelectElement.val("");
                $(thisSelectElement).val($('option:contains("--Select--")').val()).trigger('change');
                productId = '';
                return false;
            }
        });

        var $row = $(this).closest('tr');
        var $flavourDropdown = $row.find('.unitId');

        if (productId != "") {
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(productId), ModuleName: 'ProductIdByUnit' }, function (response) {
                if (response != null) {
                    var data = JSON.parse(response.data);
                    var unitList = data[0];
                    $flavourDropdown.empty();


                    $flavourDropdown.append($('<option>', {
                        value: '',
                        text: '--Select--',
                    }));

                    if (unitList && unitList.length > 0) {
                        $.each(unitList, function (index, item) {
                            $flavourDropdown.append($('<option>', {
                                value: item.SecondaryUnitId,
                                text: item.SecondaryUnitName
                            }));
                        });


                        if (unitList.length === 1) {
                            $flavourDropdown.val(unitList[0].SecondaryUnitId).trigger('change');
                        } else if (unitList.length >= 2) {
                            $flavourDropdown.val(unitList[1].SecondaryUnitId).trigger('change');
                        }
                    }
                }
            });

        }

        updateNoOfProducts();
    });


    $("#FromSaleReturn").validate({
        errorPlacement: function (error, element) {
            if (element.hasClass("select2-hidden-accessible")) {
                error.insertAfter(element.next(".select2-container"));
            } else {
                error.insertAfter(element);
            }
        },
        rules: {
            AlternativeCompanyAddress: {
                required: true
            },
        },
        messages: {
            AlternativeCompanyAddress: {
                required: "This field is required."
            },
        }
    });

});
function bindDistributorDropdown(franchiseId) {
    $.ajax({
        url: 'SaleReturn/GetDistributorByFranchiseId',
        type: 'GET',
        data: { FranchiseId: franchiseId },
        success: function (response) {
            let $dropdown = $('#ClientId');
            $dropdown.empty(); // Clear old options

            // Always show this default first
            $dropdown.append('<option value="">-- Select --</option>');

            if (response.data) {
                let parsedData = JSON.parse(response.data);
                let distributors = parsedData[0];

                let hasValidData = false;

                $.each(distributors, function (index, item) {
                    if (item.ClientName && item.ClientName.trim() !== "") {
                        $dropdown.append(`<option value="${item.ClientId}">${item.ClientName}</option>`);
                        hasValidData = true;
                    }
                });
            }

            $dropdown.val("").trigger('change');
            $dropdown.select2();
        },
        error: function () {
            alert('Failed to load distributors.');
        }
    });
}

$(document).on('change', '.unitId', function () {
    let $row = $(this).closest('tr');

    let unitId = parseInt($(this).val());
    let productId = parseInt($row.find('.productId').val());
    let FranchiseId = parseInt($('#AlternativeCompanyAddress').val());
    let ClientId = parseInt($('#ClientId').val());


    if (unitId && productId) {
        $.ajax({
            url: '/SaleReturn/GetProductPrice',
            type: 'GET',
            data: {
                UnitId: unitId,
                ProductId: productId,
                FranchiseId: FranchiseId,
                DistributorId: ClientId
            },
            success: function (response) {
                var Data = JSON.parse(response.data);

                $row.find('.Price').val(Data[0][0].Price);
                $row.find('.refundQty').val(1);

                $row.find('#CGSTPercentage').val(Data[0][0].CGST || 0);
                $row.find('#CGSTAmount').val(Data[0][0].CGST_Value || 0);
                $row.find('#SGSTPercentage').val(Data[0][0].SGST || 0);
                $row.find('#SGSTAmount').val(Data[0][0].SGST_Value || 0);
                $row.find('#IGSTPercentage').val(Data[0][0].IGST || 0);
                $row.find('#IGSTAmount').val(Data[0][0].IGST_Value || 0);
                $row.find('#CESSPercentage').val(Data[0][0].CESS || 0);
                $row.find('#CESSAmount').val(Data[0][0].CESS_Value || 0);

                if (Data[0][0].IGST == null) {
                    IsIGST = false;
                    $row.find('.SGSTValues,.CGSTValues').show();
                    $('#CGSTHead,#SGSTHead').show();
                    $row.find('.IGSTValues').hide();
                    $('#IGSTHead').hide();
                } else {
                    IsIGST = true;
                    $row.find('.SGSTValues,.CGSTValues').hide();
                    $('#CGSTHead,#SGSTHead').hide();
                    $row.find('.IGSTValues').show();
                    $row.find('#IGSTHead').show();
                }
                SalecalculateCESS($row);
                SalecalculateCGST($row);
                SalecalculateSGST($row);
                SalecalculateIGST($row);
                SalecalculateTotalAmount($row);
                updateNoOfProducts();
                updateTotalqty();
                updateOverallAmount();
            },

        });
    }
});


function SalecalculateCESS(row) {
    var cessPercentage = parseFloat(row.find('#CESSPercentage').val()) || 0;
    var Price = parseFloat(row.find('.Price').val()) || 0;
    var QTY = parseFloat(row.find('.refundQty').val()) || 0;
    var Total = Price * QTY;

    var cessAmount = (cessPercentage * Total) / 100;

    // Set numeric value to input field only
    row.find('#CESSAmount').val(cessAmount.toFixed(2)).data('raw', cessAmount.toFixed(2));

    // Optional: update formatted display text
    row.find('.CESSDisplay').text(`${cessAmount.toFixed(2)} (${cessPercentage}%)`);

    return cessAmount;
}

function SalecalculateCGST(row) {
    var CGSTPercentage = parseFloat(row.find('#CGSTPercentage').val()) || 0;
    var Price = parseFloat(row.find('.Price').val()) || 0;
    var QTY = parseFloat(row.find('.refundQty').val()) || 0;
    var Total = Price * QTY;

    var CGSTAmount = (CGSTPercentage * Total) / 100;

    row.find('#CGSTAmount').val(CGSTAmount.toFixed(2)).data('raw', CGSTAmount.toFixed(2));
    row.find('.CGSTDisplay').text(`${CGSTAmount.toFixed(2)} (${CGSTPercentage}%)`);

    return CGSTAmount;
}

function SalecalculateSGST(row) {
    var SGSTPercentage = parseFloat(row.find('#SGSTPercentage').val()) || 0;
    var Price = parseFloat(row.find('.Price').val()) || 0;
    var QTY = parseFloat(row.find('.refundQty').val()) || 0;
    var Total = Price * QTY;

    var SGSTAmount = (SGSTPercentage * Total) / 100;

    row.find('#SGSTAmount').val(SGSTAmount.toFixed(2)).data('raw', SGSTAmount.toFixed(2));
    row.find('.SGSTDisplay').text(`${SGSTAmount.toFixed(2)} (${SGSTPercentage}%)`);

    return SGSTAmount;
}

function SalecalculateIGST(row) {
    var IGSTPercentage = parseFloat(row.find('#IGSTPercentage').val()) || 0;
    var Price = parseFloat(row.find('.Price').val()) || 0;
    var QTY = parseFloat(row.find('.refundQty').val()) || 0;
    var Total = Price * QTY;

    var IGSTAmount = (IGSTPercentage * Total) / 100;

    row.find('#IGSTAmount').val(IGSTAmount.toFixed(2)).data('raw', IGSTAmount.toFixed(2));
    row.find('.IGSTDisplay').text(`${IGSTAmount.toFixed(2)} (${IGSTPercentage}%)`);

    return IGSTAmount;
}

function SalecalculateTotalAmount(row) {
    var Price = parseFloat(row.find('.Price').val()) || 0;

    var CGSTAmount = parseFloat(row.find('#CGSTAmount').data('raw')) || 0;
    var SGSTAmount = parseFloat(row.find('#SGSTAmount').data('raw')) || 0;
    var IGSTAmount = parseFloat(row.find('#IGSTAmount').data('raw')) || 0;
    var CESSAmount = parseFloat(row.find('#CESSAmount').data('raw')) || 0;

    var totalAmount = 0;
    var totalTAX = 0;

    //var isIGSTVisible = row.find('.IGSTValues').is(':visible');
    //var isCGST_SGST_Visible = row.find('.CGSTValues').is(':visible') || row.find('.SGSTValues').is(':visible');



    if (IsIGST == true) {
        totalAmount = Price + IGSTAmount + CESSAmount;
        totalTAX = IGSTAmount + CESSAmount;
    } else if (IsIGST == false) {
        totalAmount = Price + CGSTAmount + SGSTAmount + CESSAmount;
        totalTAX = CGSTAmount + SGSTAmount + CESSAmount;
    } else {
        totalAmount = Price + CESSAmount;
        totalTAX = CESSAmount;
    }


    row.find('.totalAmount').val(totalAmount.toFixed(2));

    return totalAmount;
}

$(document).on('input', '.Price', function () {
    let $row = $(this).closest('tr');
    SalecalculateCESS($row);
    SalecalculateCGST($row);
    SalecalculateSGST($row);
    SalecalculateIGST($row);
    SalecalculateTotalAmount($row);

    updateOverallAmount();
});

$(document).on('input', '.refundQty', function () {
    let $row = $(this).closest('tr');
    SalecalculateCESS($row);
    SalecalculateCGST($row);
    SalecalculateSGST($row);
    SalecalculateIGST($row);
    SalecalculateTotalAmount($row);

    updateTotalqty();
    updateOverallAmount();

});

$(document).on('change', '#AlternativeCompanyAddress', function () {
    var ShipId = $('#AlternativeCompanyAddress').val();
    var EditDataId = { ModuleName: 'SaleReturn', FranchiseId: ShipId };
    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        Common.AutoGenerateNumberGet(response, "SaleReturnNumber", "SaleReturnNo");
    });
});

async function initializePage(FranchiseMappingId) {
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
    Common.ajaxCall("GET", "/SaleReturn/GetSaleReturn", EditDataId, SaleReturnSuccess, null);

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
        Common.ajaxCall("GET", "/SaleReturn/GetSaleReturn", EditDataId, SaleReturnSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/SaleReturn/GetSaleReturn", EditDataId, SaleReturnSuccess, null);
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
            Common.ajaxCall("GET", "/SaleReturn/GetSaleReturn", EditDataId, SaleReturnSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);

        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/SaleReturn/GetSaleReturn", EditDataId, SaleReturnSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });
}

function SaleReturnSuccess(response) {

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

        var columns = Common.bindColumn(data[1], ['SaleReturnId', 'Status_Color']);
        Common.bindTablePurchase('SaleReturnData', data[1], columns, -1, 'SaleReturnId', '330px', true, access);
    }
}


/* ================================== CRUD Function ============================================ */
$(document).on('click', '#customBtn_SaleReturnData', function () {
    EditSaleReturnId = 0;
    Common.removevalidation('FromSaleReturn');
    $("#SRSaveBtn span:first").text("Save");
    $('#SaleReturnModal').show();
    $('.Status-Div').hide();
    $('#ClientId').val('').trigger('change');

    $("#SaleReturnModal .modal-body").animate({ scrollTop: 0 }, "fast");
    //Common.SetMaxDate('#SaleReturnDate');
    var today = new Date().toISOString().split('T')[0];
    $("#SaleReturnDate").val(today);
    $("#ModalHeading").text("Add Sale Return");
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    $('#AlternativeCompanyAddress').val(FranchiseMappingId).trigger('change');
    var EditDataId = { ModuleName: "SaleReturn", ModuleId: null };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, StatusSuccess, null);

    $('#dynamicSaleReturn').empty("");


});

function StatusSuccess(response) {
    var id = "SaleReturnStatusId";
    Common.bindDropDownSuccess(response.data, id);
}

$(document).on('click', '#SRCancelBtn,#SaleReturnClose', function () {

    $('#SaleReturnModal').hide();

    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/SaleReturn/GetSaleReturn", EditDataId, SaleReturnSuccess, null);

});
$(document).on('click', '#SaleReturnData .btn-delete', async function () {

    var response = await Common.askConfirmation();
    if (response == true) {
        var EditSaleReturnId = $(this).data('id');

        Common.ajaxCall("GET", "/SaleReturn/DeleteSaleReturnDetails", { SaleReturnId: EditSaleReturnId }, EstimateReload, null);
    }
});

$(document).on('click', '#SaleReturnData .btn-edit', function () {
    Common.removevalidation('FromSaleReturn');
    $("#SRSaveBtn span:first").text("Update");
    EditSaleReturnId = $(this).data('id');
    var EditDataId = { ModuleName: "SaleReturn", ModuleId: EditSaleReturnId };
    Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, StatusSuccess, null);
    EditSaleReturn(EditSaleReturnId);

});

function EditSaleReturn(EditSaleReturnId) {
    $('.Status-Div').show();
    var EditDataId = { ModuleName: "SaleReturn", ModuleId: EditSaleReturnId };
    Common.ajaxCall("GET", "/Common/ActivityHistoryDetails", EditDataId, Inventory.StatusActivity, null);

    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
    Common.ajaxCall("GET", "/SaleReturn/GetSaleReturn", EditDataId, SaleReturnEditSuccess, null);
}

function EstimateReload(response) {
    if (response.status) {
        Common.successMsg(response.message);

        var fnData = Common.getDateFilter('dateDisplay2');
        var EditDataId = { FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/SaleReturn/GetSaleReturn", EditDataId, SaleReturnSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

$('#SRSaveBtn').click(function () {
    if ($('#FromSaleReturn').valid()) {
        var objvalue = {};

        var FranchiseMapping = parseInt(localStorage.getItem('FranchiseId'));
        objvalue.SaleReturnId = EditSaleReturnId == 0 ? null : EditSaleReturnId;
        objvalue.FranchiseId = FranchiseMapping;
        objvalue.SaleReturnDate = $('#SaleReturnDate').val();
        objvalue.SaleReturnNo = $('#SaleReturnNumber').val();
        objvalue.BillingFranchiseId = Common.parseInputValue('AlternativeCompanyAddress');
        objvalue.ClientId = Common.parseInputValue('ClientId');
        objvalue.SaleReturnStatusId = Common.parseInputValue('SaleReturnStatusId');

        var saleReturnMapping = [];

        var parentRows = $('#dynamicSaleReturn .dynSaleReturn');
        $.each(parentRows, function (index, parentRow) {
            var saleReturnProductMappingId = $(this).attr('data-id');
            var productId = $(parentRow).find('.productId').val();
            var unitId = $(parentRow).find('.unitId').val();
            var price = $(parentRow).find('.Price').val();
            var refundQty = $(parentRow).find('.refundQty').val();
            var totalAmount = $(parentRow).find('.totalAmount').val();

            saleReturnMapping.push({
                SaleReturnProductMappingId: saleReturnProductMappingId == "" ? null : parseInt(saleReturnProductMappingId),
                ProductId: parseInt(productId),
                UnitId: parseInt(unitId),
                Price: parseFloat(price),
                Quantity: parseFloat(refundQty),
                TotalAmount: parseFloat(totalAmount) || null,
                SaleReturnId: EditSaleReturnId == 0 ? null : EditSaleReturnId
            });

        });

        objvalue.SaleReturnProductMappingDetails = saleReturnMapping;
        Common.ajaxCall("POST", "/SaleReturn/InsertUpdateSaleReturn", JSON.stringify(objvalue), SaveSuccess, null);
    }
});

function SaleReturnEditSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        $('#SaleReturnModal').show();
        $("#ModalHeading").text("Sale Return Info");
        $("#SaleReturnStatusId option").each(function () {
            if ($(this).val() !== "" && $(this).val() < data[0][0].SaleReturnStatusId) {
                $(this).remove();
            }
        });
        Common.bindParentData(data[0], 'FromSaleReturn');


        var products = [];

        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('AlternativeCompanyAddress'), ModuleName: 'FranchiseProduct' }, function (response) {
            products = JSON.parse(response.data);
            if (products != null && products.length > 0 && products[0].length > 0) {
                var productsOptions = products[0].map(function (productsVal) {
                    return `<option value="${productsVal.ProductId}">${productsVal.ProductName}</option>`;
                }).join('');
            }
            var defaultOption = '<option value="">--Select--</option>';
            $('#dynamicSaleReturn').empty("");
            data[1].forEach((item, index) => {
                var UnitData = [];
                Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: item.ProductId, ModuleName: 'ProductIdByUnit' }, function (response) {
                    if (response != null) {
                        UnitData = JSON.parse(response.data);
                        if (UnitData != null && UnitData.length > 0 && UnitData[0].length > 0) {
                            var UnitDataOptions = UnitData[0].map(function (UnitDataVal) {
                                var isSelected = UnitDataVal.SecondaryUnitId == item.UnitId ? 'selected' : '';
                                return `<option value="${UnitDataVal.SecondaryUnitId}" ${isSelected}>${UnitDataVal.SecondaryUnitName}</option>`;
                            }).join('');
                        }

                        let unique = Math.random().toString(36).substring(2);

                        var html = `<tr class="dynSaleReturn" data-id="">
                                <td>
                                    <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required="" fdprocessedid="cq7cm" autocomplete="no-0.49987932811255653">
                                           ${defaultOption}${productsOptions}
                                    </select>
                                </td>
                                <td>
                                    <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required="" fdprocessedid="cq7cm" autocomplete="no-0.49987932811255653">
                                       ${defaultOption} ${UnitDataOptions}
                                    </select>
                                </td>
                                <td><input type="text" id="Price${unique}" name="Price${unique}" value="${item.Price}" class="form-control Price" placeholder="0.00" required=""   oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)""></td>

                                <td><input type="text" id="RefundQty${unique}" name="RefundQty${unique}" value="${item.Quantity}" class="form-control refundQty" placeholder="Qty" required=""  oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)"></td>

                             <td Class="CGSTValues" data-label="CGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="CGSTPercentage" value="${item.CGST || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>
                         
                    </div>
                   
                     <input type="text" id="CGSTAmount" value="${item.CGST_Value || 0.00}" class="form-control d-none mt-2" placeholder="₹" Readonly>
                     <small class="CGSTDisplay mt-3">0.00(0%)</small>
                 </td>

                 <td Class="SGSTValues" data-label="SGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="SGSTPercentage" value="${item.SGST || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="SGSTAmount" value="${item.SGST_Value || 0.00}" class="form-control d-none mt-2" placeholder="₹" Readonly>
                     <small class="SGSTDisplay mt-3">0.00(0%)</small>
                 </td>
           
                 <td Class="IGSTValues" data-label="IGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="IGSTPercentage" value="${item.IGST || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="IGSTAmount" value="${item.IGST_Value || 0.00}" class="form-control d-none mt-2" placeholder="₹" Readonly>
                     <small class="IGSTDisplay mt-3">0.00(0%)</small>
                 </td>

                <td Class="CessValues" data-label="Cess" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="CESSPercentage" value="${item.CESS || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="CESSAmount" value="${item.CESS_Value || 0.00}" class="form-control d-none mt-2" placeholder="₹" Readonly>
                     <small class="CESSDisplay mt-3">0.00(0%)</small>
                 </td>
                                <td><input type="text" id="TotalAmount${unique}" name="TotalAmount${unique}" class="form-control totalAmount" placeholder="0.00" disabled></td>
                                <td class="d-flex justify-content-center">
                                    <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height:34px;width:34px;" fdprocessedid="m7p2j9">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>`;
                        $('#dynamicSaleReturn').append(html);
                        let $row = $('#dynamicSaleReturn tr').last();

                        if (item.IGST == null) {
                            IsIGST = false;
                            $row.find('.SGSTValues,.CGSTValues').show();
                            $('#CGSTHead,#SGSTHead').show();
                            $row.find('.IGSTValues').hide();
                            $('#IGSTHead').hide();
                        } else {
                            IsIGST = true;
                            $row.find('.SGSTValues,.CGSTValues').hide();
                            $('#CGSTHead,#SGSTHead').hide();
                            $row.find('.IGSTValues').show();
                            $('#IGSTHead').show();
                        }
                        $(`#ProductId${unique}`).val(item.ProductId);
                        SalecalculateCESS($row);
                        SalecalculateCGST($row);
                        SalecalculateSGST($row);
                        SalecalculateIGST($row);
                        SalecalculateTotalAmount($row);
                        updateNoOfProducts();
                        updateTotalqty();
                        updateOverallAmount();
                    }

                });

            });
            $("#SaleReturnStatusId option").each(function () {
                if ($(this).val() !== "" && $(this).val() < data[0][0].SaleReturnStatusId) {
                    $(this).remove();
                }
            });

            $('#SaleReturnStatusId').val(data[0][0].SaleReturnStatusId);
            $('#ClientId').val(data[0][0].ClientId).trigger('change');;

        });
    }
}


function SaveSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#SaleReturnModal').hide();
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        initializePage(FranchiseMappingId);

    } else {
        Common.errorMsg(response.message);
    }
}

$(document).on('click', '.DynrowRemove', function () {
    var row = $(this).closest('tr');
    if ($('#dynamicSaleReturn tr').length > 1) {

        row.remove();
    }
});


function updateNoOfProducts() {
    let uniqueProductIds = new Set();

    $('#dynamicSaleReturn .productId').each(function () {
        let productId = $(this).val();
        if (productId) {
            uniqueProductIds.add(productId);
        }
    });

    $('#NoOfProducts').val(uniqueProductIds.size);
}
function updateTotalqty() {
    let totalQty = 0;

    $('#dynamicSaleReturn .refundQty').each(function () {
        let qty = parseFloat($(this).val());
        if (!isNaN(qty)) {
            totalQty += qty;
        }
    });

    $('#TotalBalance').val(totalQty.toFixed(2));
}
function updateOverallAmount() {
    let overallAmount = 0;

    $('#dynamicSaleReturn .totalAmount').each(function () {
        let amt = parseFloat($(this).val());
        if (!isNaN(amt)) {
            overallAmount += amt;
        }
    });

    $('#OverallAmount').val(overallAmount.toFixed(2));
}


$(document).keydown(function (event) {

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#SRSaveBtn').click();
    }

});