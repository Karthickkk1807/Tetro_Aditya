var UnitDropdown = [];
let selectedProductData = [];

$(document).ready(async function () {

    var UnitData = await Common.bindDropDownSync('PORUnit');
    UnitDropdown = JSON.parse(UnitData);

    $('#roundOff').css('color', 'black');

    $(document).on('change', '#TypeOfRequest', function () {
        var $thisVal = $(this).val();
        var $VendorVal = $('#Vendor').val();
        var $purchaseRequestNo = null;
        var $proposalRequestNo = null;
        $('#PRSubTotalTotal, #PRCGSTTotal, #PRSGSTTotal, #PRIGSTTotal, #PRCESSTotal, #PRSubtotal, #roundOff, #GrantTotal').val('0.00');

        $thisVal == 1 ? $('#MainPurchaseProposalReturnPopTable #AddItemButtonRow').show() : $('#MainPurchaseProposalReturnPopTable #AddItemButtonRow').hide();

        $('.ProductTableRow').remove();
        if ($thisVal != '' && $VendorVal != '') {
            $("#MainPurchaseOrderPopTable").hide();
            $("#MainPurchaseProposalReturnPopTable").show();
            const url = `/PurchaseOrder/GetPurchaseReturn_ProposalReturn_ReturnNo?FranchiseId=${parseInt(FranchiseMappingId)}&ModuleId=${parseInt($thisVal)}&BillTo=${parseInt($VendorVal)}&PurchaseRequestNo=${$purchaseRequestNo}&ProposalRequestNo=${$proposalRequestNo}`;
            ajaxCall(url, function (response) {
                if (response.status) {
                    var controlid = "RequestNo";
                    var data = response.data;
                    DropDowmRequest(data, controlid);
                    ShowingColumnsTable();
                }
            }, null);
        }
        else {
            $('#RequestNo').empty().append('<option value="">--Select--</option>');
            $("#MainPurchaseOrderPopTable").show();
            $("#MainPurchaseProposalReturnPopTable").hide();
        }
    });

    $(document).on('change', '#RequestNo', function () {
        var $thisVal = $(this).val();
        var $Vendor = $('#Vendor').val();
        var $TypeOfRequest = $('#TypeOfRequest').val();
        $('.ProductTableRow').remove();
        ShowingColumnsTable();

        if ($thisVal != '' || $thisVal != 0) {
            var $purchaseRequestNo = null;
            var $proposalRequestNo = null;

            var EditDataId = {
                FranchiseId: parseInt(FranchiseMappingId),
                ModuleId: parseInt($TypeOfRequest),
                BillTo: parseInt($Vendor),
                PurchaseRequestNo: $TypeOfRequest == 1 ? parseInt($thisVal) : parseInt($purchaseRequestNo),
                ProposalRequestNo: $TypeOfRequest == 1 ? parseInt($proposalRequestNo) : parseInt($thisVal)
            };

            Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseReturn_ProposalReturn_ReturnNo", EditDataId, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    bindPurchaseReturnTable(data[0], $TypeOfRequest);
                }
            }, null);
        }
    });

    $(document).on('change', '#PurchaseProposalReturnTablebody .PRQtyUnitDropDown', function () {
        let $row = $(this).closest('tr.ProductTableRow');
        let selectedUnitText = $(this).find('option:selected').text().trim();
        let productInfo = JSON.parse($row.attr('data-product-info').replace(/&quot;/g, '"'));
        let newPrice = 0;
        if (selectedUnitText === productInfo.PrimaryUnitName) {
            newPrice = parseFloat(productInfo.PrimaryPrice || 0);
        } else if (selectedUnitText === productInfo.SecondaryUnitName) {
            newPrice = parseFloat(productInfo.SecondaryPrice || 0);
        }
        $row.find('.SellingPrice').val(newPrice);
        calculateAllTotals($row);
    });

    $(document).on('input', '.SellingPrice, .TableRowQty', function () {
        let $row = $(this).closest('tr.ProductTableRow');
        calculateAllTotals($row)
    });

    let selectedProductData = [];

    $(document).on('click', '.addQtyBtn', function () {
        if ($('#MainPurchaseProposalReturnPopTable').is(':visible')) {
            const $row = $(this).closest('tr');
            $(this).hide();
            $row.find('.OtyColumn').removeClass('d-none');
        } else {
            $(this).hide();
            $(this).closest('td').find('.OtyColumn').toggleClass('d-none');
        }
    });

    $(document).on('click', '#UpdateProductsInAddItem', function () {
        if ($('#MainPurchaseProposalReturnPopTable').is(':visible')) {
            const selectedRows = $('#ProductListTable tbody .AllProductRow')
                .has('input[type="checkbox"]:checked');

            if (selectedRows.length === 0) {
                Common.warningMsg("No products selected to bind.");
                return;
            }

            selectedProductData = [];

            selectedRows.each(function () {
                const $row = $(this);
                const productInfoStr = $row.attr('data-product-info');

                try {
                    const rawProductData = JSON.parse(productInfoStr);

                    const qty = parseFloat($row.find('.QtyProductAdd').val()) || 1;
                    const selectedUnitId = $row.find('.unit-select').val();

                    let price = 0;
                    if (selectedUnitId == rawProductData.PrimaryUnitId) {
                        price = rawProductData.PrimaryPrice;
                    } else if (selectedUnitId == rawProductData.SecondaryUnitId) {
                        price = rawProductData.SecondaryPrice;
                    }

                    const productObj = {
                        ProductId: rawProductData.ProductId,
                        ProductName: rawProductData.ProductName,
                        ProductDescription: '',
                        Price: parseFloat(price) || 0,
                        Quantity: qty,

                        PrimaryUnitId: rawProductData.PrimaryUnitId,
                        SecondaryUnitId: rawProductData.SecondaryUnitId,
                        PrimaryUnitName: rawProductData.PrimaryUnitName,
                        SecondaryUnitName: rawProductData.SecondaryUnitName,
                        SelectedUnit: selectedUnitId,

                        CGST: parseFloat(rawProductData.CGST) || 0,
                        SGST: parseFloat(rawProductData.SGST) || 0,
                        IGST: parseFloat(rawProductData.IGST) || 0,
                        CESS: parseFloat(rawProductData.CESS) || 0,

                        PrimaryPrice: rawProductData.PrimaryPrice,
                        SecondaryPrice: rawProductData.SecondaryPrice
                    };

                    const exists = selectedProductData.some(p => p.ProductId === productObj.ProductId);
                    if (!exists) {
                        selectedProductData.push(productObj);
                    }

                } catch (e) {
                    console.error('Invalid JSON in data-product-info:', e);
                }
            });

            if (selectedProductData.length > 0) {
                AddProductBindPurchaseReturnTable(selectedProductData);
                selectedProductData = [];

                $('#AddProductModal').hide();

                $('#ProductListTable tbody .AllProductRow').each(function () {
                    $(this).find('.addQtyBtn').show();
                    $(this).find('.OtyColumn').addClass('d-none');
                    $(this).find('.QtyProductAdd').val('1');
                    $(this).find('input[type="checkbox"]').prop('checked', false);
                });

            } else {
                Common.warningMsg("No valid product data found.");
            }

        } else {
            const AllProductTable = 'AllProductTable';
            const tablebody = $('#POProductTablebody');
            const mainTable = $('#POProductTable');
            const moduleName = 'Purchase';
            $('#loader-pms').show();
            const stateSelector1 = "#VendorStateName";
            const stateSelector2 = "#StateName";

            Inventory.AddProductsToMainTable(AllProductTable, tablebody, mainTable, moduleName, stateSelector1, stateSelector2);
        }
    }); 

    $(document).on('click', '.DynremoveBtn', function () {
        const row = $(this).closest('tr');
        let productId = row.data('product-id');
        var mainTable = $('#POProductTable'); 
        Inventory.RemoveProductMainRow(row, productId, mainTable);
        if ($('#MainPurchaseProposalReturnPopTable').is(':visible')) {
            updateSerialNumbers();
            let $row = $("#PurchaseProposalReturnTablebody tr.ProductTableRow:last");
            calculateAllTotals($row);
        } 
    });
});

function AddProductBindPurchaseReturnTable(productList) {
    var $tbody = $("#PurchaseProposalReturnTablebody");
    var BillTo = ($('#VendorStateName').text() || '').trim().toLowerCase();
    var ShipTo = ($('#StateName').text() || '').trim().toLowerCase();
    var sameState = BillTo === ShipTo;

    if (sameState) {
        $('#PCGSTHead, #PSGSTHead, #PCGSTTotalDiv, #PSGSTTotalDiv').show();
        $('#PIGSTHead, #PIGSTTotalDiv').hide();
    } else {
        $('#PCGSTHead, #PSGSTHead, #PCGSTTotalDiv, #PSGSTTotalDiv').hide();
        $('#PIGSTHead, #PIGSTTotalDiv').show();
    }
    $.each(productList || [], function (i, item) {
        var ProductId = item.ProductId || '';
        var MappingId = item.PurchaseRequestProductMappingId || '';
        var ProductName = item.ProductName || '';
        var ProductDescription = item.ProductDescription || '';
        var Price = parseFloat(item.Price) || 0;
        var Quantity = parseFloat(item.Quantity) || 1;

        var PrimaryUnitId = item.PrimaryUnitId || '';
        var SecondaryUnitId = item.SecondaryUnitId || '';
        var PrimaryUnitName = item.PrimaryUnitName || '';
        var SecondaryUnitName = item.SecondaryUnitName || '';
        var SelectedUnit = item.SelectedUnit || '';

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
                <input type="text" class="form-control DisabledTextBox cgst-perc d-none" value="${CGST || '0'}" readonly>
                <input type="text" class="form-control DisabledTextBox cgst-amt" value="${cgstAmt.toFixed(2)}" readonly>
            </td>

            <td class="SGSTValues" data-label="SGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? '' : 'display:none;'}">
                <input type="text" class="form-control DisabledTextBox sgst-perc d-none" value="${SGST || '0'}" readonly>
                <input type="text" class="form-control DisabledTextBox sgst-amt" value="${sgstAmt.toFixed(2)}" readonly>
            </td>

            <td class="IGSTValues" data-label="IGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? 'display:none;' : ''}">
                <input type="text" class="form-control DisabledTextBox igst-perc d-none" value="${IGST || '0'}" readonly>
                <input type="text" class="form-control DisabledTextBox igst-amt" value="${igstAmt.toFixed(2)}" readonly>
            </td>

            <td class="CessValues" data-label="CESS" style="padding:7px!important;vertical-align: middle;text-align: center;">
                <input type="text" class="form-control DisabledTextBox cess-perc  d-none" value="${CESS || '0'}" readonly>
                <input type="text" class="form-control DisabledTextBox cess-amt" value="${cessAmt.toFixed(2)}" readonly>
            </td>

            <td class="TotalValue" data-label="Total" style="padding:7px!important;vertical-align: middle;text-align: center;">
                <input type="text" class="form-control DisabledTextBox totalValue" value="${totalAmount.toFixed(2)}" readonly>
            </td>

            <td class="PrimaryUnitId-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.PrimaryUnitId}</td>

            <td class="PrimaryUnitName-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.PrimaryUnitName}</td>

            <td class="SecondaryUnitId-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.SecondaryUnitId}</td>

            <td class="SecondaryUnitName-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.SecondaryUnitName}</td>

            <td class="PrimaryPrice-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.PrimaryPrice}</td>

            <td class="SecondaryPrice-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.SecondaryPrice}</td>

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

function bindPurchaseReturnTable(productList, RequestType) {
    var $tbody = $("#PurchaseProposalReturnTablebody");
    $tbody.find("tr.ProductTableRow").remove();
    var BillTo = ($('#VendorStateName').text() || '').trim().toLowerCase();
    var ShipTo = ($('#StateName').text() || '').trim().toLowerCase();
    var sameState = BillTo === ShipTo;

    if (sameState) {
        $('#PCGSTHead, #PSGSTHead, #PCGSTTotalDiv, #PSGSTTotalDiv').show();
        $('#PIGSTHead, #PIGSTTotalDiv').hide();
    } else {
        $('#PCGSTHead, #PSGSTHead, #PCGSTTotalDiv, #PSGSTTotalDiv').hide();
        $('#PIGSTHead, #PIGSTTotalDiv').show();
    }
    if (RequestType == 1) {
        $.each(productList || [], function (i, item) {
            var ProductId = item.ProductId || '';
            var MappingId = item.PurchaseRequestProductMappingId || '';
            var ProductName = item.ProductName || '';
            var ProductDescription = item.ProductDescription || '';
            var Price = parseFloat(item.Price) || 0;
            var Quantity = parseFloat(item.Quantity) || 1;

            var PrimaryUnitId = item.PrimaryUnitId || '';
            var SecondaryUnitId = item.SecondaryUnitId || '';
            var PrimaryUnitName = item.PrimaryUnitName || '';
            var SecondaryUnitName = item.SecondaryUnitName || '';
            var SelectedUnit = item.SelectedUnit || '';

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
                    <input type="text" class="form-control DisabledTextBox cgst-perc d-none" value="${CGST || '0'}" readonly>
                    <input type="text" class="form-control DisabledTextBox cgst-amt" value="${cgstAmt.toFixed(2)}" readonly>
                </td>

                <td class="SGSTValues" data-label="SGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? '' : 'display:none;'}">
                    <input type="text" class="form-control DisabledTextBox sgst-perc d-none" value="${SGST || '0'}" readonly>
                    <input type="text" class="form-control DisabledTextBox sgst-amt" value="${sgstAmt.toFixed(2)}" readonly>
                </td>

                <td class="IGSTValues" data-label="IGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? 'display:none;' : ''}">
                    <input type="text" class="form-control DisabledTextBox igst-perc d-none" value="${IGST || '0'}" readonly>
                    <input type="text" class="form-control DisabledTextBox igst-amt" value="${igstAmt.toFixed(2)}" readonly>
                </td>

                <td class="CessValues" data-label="CESS" style="padding:7px!important;vertical-align: middle;text-align: center;">
                    <input type="text" class="form-control DisabledTextBox cess-perc  d-none" value="${CESS || '0'}" readonly>
                    <input type="text" class="form-control DisabledTextBox cess-amt" value="${cessAmt.toFixed(2)}" readonly>
                </td>

                <td class="TotalValue" data-label="Total" style="padding:7px!important;vertical-align: middle;text-align: center;">
                    <input type="text" class="form-control DisabledTextBox totalValue" value="${totalAmount.toFixed(2)}" readonly>
                </td>

                <td class="PrimaryUnitId-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.PrimaryUnitId}</td>

                <td class="PrimaryUnitName-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.PrimaryUnitName}</td>

                <td class="SecondaryUnitId-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.SecondaryUnitId}</td>

                <td class="SecondaryUnitName-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.SecondaryUnitName}</td>

                <td class="PrimaryPrice-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.PrimaryPrice}</td>

                <td class="SecondaryPrice-cell d-none" style="padding:7px!important;vertical-align: middle;text-align: center;">${item.SecondaryPrice}</td>

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
    else {
        $.each(productList || [], function (i, item) {
            var ProposalRequestId = item.ProposalRequestId || '';
            var MappingId = item.ProposalRequestProductMappingId || '';
            var ProposalName = item.ProposalName || '';

            var defaultOption = '<option value="">-- Select --</option>';

            if (UnitDropdown != null && UnitDropdown.length > 0 && UnitDropdown[0].length > 0) {
                UnitSelectOptions = UnitDropdown[0].map(function (UnitId) {
                    return `<option value="${UnitId.UnitId}">${UnitId.UnitName}</option>`;
                }).join('');
            }

            var sno = i + 1;

            var row = `
            <tr class="ProductTableRow" data-product-id="${ProposalRequestId}" data-ProposalMapping-id="${MappingId}">
                <td class="sno"></td>

                <td data-label="Product Name">
                    <label style="white-space: pre-wrap; class="ProposalName">${ProposalName}</label>
                    <textarea class="form-control mt-2 descriptiontdtext" placeholder="Description"></textarea>
                </td>

                <td data-label="Price" class="SellingPricediv">
                    <input type="text" class="form-control SellingPrice" style="margin-top: 11px;" value="${0}" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,4)">  
                </td>

                <td data-label="QTY">
                    <div class="input-group" style="width: 124px; margin-top: 11px;">
                        <input type="text" class="form-control TableRowQty" value="${0}" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,4)">
                        <div class="input-group-append">
                            <span class="unit-dropdown">
                                <select class="PRQtyUnitDropDown" style="color: #404040;">
                                    ${defaultOption}
                                    ${UnitSelectOptions}
                                </select>
                            </span>
                        </div>
                    </div>
                </td>

                <td class="Subtotal" style="padding:7px!important;vertical-align: middle;text-align: center;"> 
                    <input type="text" class="form-control subtotal" value="${0}" disabled> 
                </td>

                <td class="CGSTValues" data-label="CGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? '' : 'display:none;'}"> 
                    <input type="text" class="form-control cgst-perc" value="${0}" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,4)">
                </td>

                <td class="SGSTValues" data-label="SGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? '' : 'display:none;'}"> 
                    <input type="text" class="form-control sgst-perc" value="${0}" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,4)">
                </td>

                <td class="IGSTValues" data-label="IGST" style="padding:7px!important;vertical-align: middle;text-align: center;${sameState ? 'display:none;' : ''}"> 
                    <input type="text" class="form-control igst-perc" value="${0}" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,4)">
                </td>

                <td class="CessValues" data-label="CESS" style="padding:7px!important;vertical-align: middle;text-align: center;">  
                    <input type="text" class="form-control cess-perc" value="${0}" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,4)">
                </td>

                <td class="TotalValue" data-label="Total" style="padding:7px!important;vertical-align: middle;text-align: center;">
                    <input type="text" class="form-control totalValue" value="${0}" disabled>
                </td>

                <td data-label="Action" style="display:flex;justify-content:center;align-items:center;border:none;">
                    <button class="btn DynremoveBtn DynrowRemove" type="button"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
            `;

            $(row).insertBefore("#PurchaseProposalReturnTablebody #AddItemButtonRow");
        });
        updateSerialNumbers();
    }
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

function ShowingColumnsTable() {
    var BillTo = $('#VendorStateName').text().trim().toLowerCase();;
    var ShipTo = $('#StateName').text().trim().toLowerCase();;
    if (BillTo === ShipTo) {
        $('#PCGSTHead, #PSGSTHead').show();
        $('#PCGSTTotalDiv, #PSGSTTotalDiv').show();
        $('#PIGSTHead, #PIGSTTotalDiv').hide();
    }
    else {
        $('#PCGSTHead, #PSGSTHead').hide();
        $('#PCGSTTotalDiv, #PSGSTTotalDiv').hide();
        $('#PIGSTHead, #PIGSTTotalDiv').show();
    }
}

function DropDowmRequest(data, controlid) {
    var data = JSON.parse(data);
    $('#' + controlid).empty();
    var dataValue = data[0];
    if (dataValue != null && dataValue.length > 0) {
        var valueproperty = Object.keys(dataValue[0])[0];
        var textproperty = Object.keys(dataValue[0])[1];
        $('#' + controlid).append($('<option>', {
            value: '',
            text: '--Select--',
        }));
        $.each(dataValue, function (index, item) {
            $('#' + controlid).append($('<option>', {
                value: item[valueproperty],
                text: item[textproperty],
            }));
        });
    } else {
        $('#' + controlid).append($('<option>', {
            value: '',
            text: '--Select--',
        }));
    }
}

function ajaxCall(url, onSuccess, onError) {

    if (onError == undefined)
        onError = Common.g_onError;
    var g_onSuccess = function (bool) {
        return function (response, textStatus, jqXHR) {
            onSuccess(response);
        }
    };

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: g_onSuccess(true),
        error: onError
    });

} 