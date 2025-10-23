var productionPlanId = 0;
var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
var editable = true;
$(document).ready(function () {

    $('#SaveProductionPlan').hide();

    $('#reportrange').daterangepicker({
        autoUpdateInput: false,
        locale: {
            format: 'DD-MM-YYYY',
            cancelLabel: 'Clear',
            applyLabel: 'Apply'
        }
    }, function (start, end) {
        $('#reportrange span').html(
            start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY')
        );
    });

    $('#reportrange').on('cancel.daterangepicker', function (ev, picker) {
        $(this).find('span').html('No Date');
    });

    $('#TotalBalanceRGB').val('');
    $('#TotalBalancePET').val('');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').show();

    $('#decrement-month-btn2').click(function () {
        $('#tableFilter').val('');
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();
        getSuccess();
    });

    $('#increment-month-btn2').click(function () {
        $('#tableFilter').val('');
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        if (displayedDate.getFullYear() > currentYear || (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() > currentMonth)) {
            $('#increment-month-btn2').hide();
        }
        getSuccess();
    });
    $('#POMultiSelectDropdown').select2({
        dropdownParent: $('#FormProductionPlan'),
        width: '100%'
    }).on('select2:open', function () {
        $('.select2-container').css('z-index', 1100);
    });

    var fnData = Common.getDateFilter('dateDisplay2');

    $(document).on('click', '#downloadExcelBtn', function () {
        $('#tableFilter').val('');
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        displayedDate = new Date(currentYear, currentMonth);
        $('#increment-month-btn2').show();

        updateMonthDisplay(displayedDate);

        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ProductionPlanId: null }, ProductionPlanSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#tableFilter').val('');
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });

    function updateMonthDisplay(date) {
        let monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear();
        $('#dateDisplay2').text(month + " " + year);
    }
    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
            getSuccess();
        }
    });

    var today = new Date();
    var todayformatted = today.toISOString().split('t')[0];
    $('#productionplandate').val(todayformatted);
    //$('#productionplandate').attr('min', todayformatted).val(todayformatted);

    Common.bindDropDownParent('ToFranchiseId', 'FormProductionPlan', 'Franchise');
    getSuccess();

    $('#SaveProductionPlan').click(function () {
        if ($('#FormProductionPlan').valid()) {
            var objvalue = {};
            objvalue.ProductionPlanId = productionPlanId == 0 ? null : productionPlanId;
            objvalue.ProductionPlanDate = Common.stringToDateTime('ProductionPlanDate');
            objvalue.FromFranchiseId = FranchiseMappingId;
            objvalue.ToFranchiseId = Common.parseInputValue('ToFranchiseId');
            objvalue.TotalQuantity_RGB = Common.parseInputValue('TotalBalanceRGB');
            objvalue.TotalQuantity_PET = Common.parseInputValue('TotalBalancePET');
            var dateRange = $('#reportrange span').text().trim();
            if (dateRange !== 'No Date') {
                var dates = dateRange.split(' - ');
                var fromDate = moment(dates[0], 'DD-MM-YYYY').toDate();
                var toDate = moment(dates[1], 'DD-MM-YYYY').toDate();
                objvalue.FromDate = fromDate;
                objvalue.ToDate = toDate;
            } else {
                objvalue.FromDate = null;
                objvalue.ToDate = null;
            }

            objvalue.NoOfProducts = Common.parseInputValue('NoOfProducts');

            var ProductionPlanDistributorPoMappingDetails = [];
            let selectedIds = $('#POMultiSelectDropdown').val() || [];
            let intSelectedIds = selectedIds.map(function (id) {
                return parseInt(id, 10);
            });

            intSelectedIds.forEach(function (poId) {
                ProductionPlanDistributorPoMappingDetails.push({
                    ProductionPlanDistributorPoMappingId: null,
                    ProductionPlanId: productionPlanId == 0 ? null : productionPlanId,
                    PurchaseOrderId: poId
                });
            });


            var productionPlanMappingDetails = [];

            var parentRows = $('#dynamicProductionPlan .productionPlanRow');
            $.each(parentRows, function (index, parentRow) {
                var productionPlanMappingId = $(this).attr('data-id');
                var productId = $(parentRow).find('.productId').val();
                var unitId = $(parentRow).find('.unitId').val();
                var SystemBalance = $(parentRow).find('.openingBalance').val();
                var ManualOpenBal = $(parentRow).find('.ManualOpenBal').val();
                var purchaseOrderQuantity = $(parentRow).find('.poquantity').val();
                var emptyBottles = $(parentRow).find('.emptyBottles').val();
                var quantity = $(parentRow).find('.quantity').val();
                var openingBalance = $(parentRow).find('.openingBalance').val();

                productionPlanMappingDetails.push({
                    ProductionPlanMappingId: productionPlanMappingId == "" ? null : productionPlanMappingId,
                    ProductId: parseInt(productId),
                    UnitId: parseInt(unitId),
                    SystemOpeningBalance: parseFloat(SystemBalance),
                    ManualOpeningBalance: parseFloat(ManualOpenBal),
                    PurchaseOrderQuantity: parseInt(purchaseOrderQuantity),
                    EmptyBottles: parseInt(emptyBottles),
                    Quantity: parseFloat(quantity),
                    ProductionPlanId: productionPlanId == 0 ? null : productionPlanId,
                });
            });

            objvalue.ProductionPlanDistributorPoMappingDetails = ProductionPlanDistributorPoMappingDetails;
            objvalue.productionPlanMappingDetails = productionPlanMappingDetails;
            Common.ajaxCall("POST", "/Productions/InsertUpdateProductionPlan", JSON.stringify(objvalue), SaveSuccess, null);
        }
    });

    $('#AddProductionPlan').click(function () {
        $('#ProductionPlanModal').show();
        $('#dynamicProductionPlan').html("");
        $('.daterangepicker').css('z-index', 111111);
        Common.removevalidation('FormProductionPlan');

        var today = new Date();
        var todayFormatted = today.toISOString().split('T')[0];
        $('#ProductionPlanDate').val(todayFormatted);
        //$('#ProductionPlanDate').attr('min', todayFormatted).val(todayFormatted);

        $('#reportrange span').text('No Date');
        $('#reportrange').data('daterangepicker').setStartDate(moment());
        $('#reportrange').data('daterangepicker').setEndDate(moment());

        $('#TotalBalanceRGB').val('');
        $('#TotalBalancePET').val('');

        productionPlanId = 0;
        editable = true;
        $('#ProductionPlanModal #ModalTitle').text("Add ProductionPlan");
        $('#SaveProductionPlan').val('Save').removeClass('btn-update').addClass('btn-success');
        $('#ToFranchiseId').prop('selectedIndex', 1).change();
        $('#POMultiSelectDropdown').select2({
            dropdownParent: $('#FormProductionPlan'),
            width: '100%',
            placeholder: '--Select PO No--'
        }).trigger('change');

        $('#SaveProductionPlan').hide();
        $('#POMultiSelectDropdown').prop('disabled', false);
        $('#SubmitBtn').show();
    });

    $(document).on('change', '#POMultiSelectDropdown', function () {
        var $thisval = $(this).val();
        if (!$thisval || ($.isArray($thisval) && $thisval.length === 0)) {
            $('#dynamicProductionPlan').html("");
            DynamicHtmlEmptyTbody();
            $('#TotalBalanceRGB').val('');
            $('#TotalBalancePET').val('');
            $('#SaveProductionPlan').hide();
        }
    });

    $(document).on('change', '#ToFranchiseId', function () {
        var $thisval = $(this).val();
        if ($thisval == null || $thisval == '') {
            $('#dynamicProductionPlan').html("");
            DynamicHtmlEmptyTbody();
        }
    });

    $('#addProduction').click(function () {
        let unique = Math.random().toString(36).substring(2);
        var defaultOption = '<option value="">--Select--</option>';
        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('ToFranchiseId'), ModuleName: 'FranchiseProduct' }, function (response) {
            var products = JSON.parse(response.data);

            if (products != null && products.length > 0 && products[0].length > 0) {
                var selectedProductIds = [];
                $('#dynamicProductionPlan .productId').each(function () {
                    var val = $(this).val();
                    if (val) selectedProductIds.push(val);
                });


                var availableProducts = products[0].filter(function (product) {
                    return !selectedProductIds.includes(product.ProductId.toString());
                });
                var productsOptions = availableProducts.map(function (product) {
                    return `<option value="${product.ProductId}">${product.ProductName}</option>`;
                }).join('');
            }
            var html = `
            <tr class="productionPlanRow" data-id="">
                <td class="type-cell" data-label="Type" Style="text-align: center;vertical-align: baseline;"> -- </td>

                    <td>
                        <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required>
                            ${defaultOption}${productsOptions}
                        </select>
                    </td>
                    <td>
                        <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required>
                            ${defaultOption}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control openingBalance" id="OpeningBalance${unique}" name="OpeningBalance${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control PrimaryopeningBalance" id="PrimaryopeningBalance${unique}" name="PrimaryopeningBalance${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control SecondaryopeningBalance" id="SecondaryopeningBalance${unique}" name="SecondaryopeningBalance${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td>
                        <input type="text" class="form-control ManualOpenBal" id="ManualOpenBal${unique}" name="ManualOpenBal${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control PrimaryManualOpenBal" id="PrimaryManualOpenBal${unique}" name="PrimaryManualOpenBal${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control SecondaryManualOpenBal" id="SecondaryManualOpenBal${unique}" name="SecondaryManualOpenBal${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td>
                        <input type="text" class="form-control poquantity" id="PoQuantity${unique}" name="PoQuantity${unique}" value="" placeholder="0" required>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control Primarypoquantity" id="PrimaryPoQuantity${unique}" name="PrimaryPoQuantity${unique}" value="" placeholder="0" readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control Secondarypoquantity" id="SecondaryPoQuantity${unique}" name="SecondaryPoQuantity${unique}" value="" placeholder="0" readonly>
                    </td>
                    <td>
                        <input type="text" class="form-control emptyBottles" id="EmptyBottles${unique}" name="EmptyBottles${unique}" placeholder="0" oninput="Common.allowOnlyNumberLength(this, 7)">
                    </td>
                    <td>
                        <input type="text" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" placeholder="0" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)">
                        <lable class="d-none ConvertionValues"></lable>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control SecondaryUnitValue" id="SecondaryUnitValue${unique}" name="SecondaryUnitValue${unique}" placeholder="0" readonly>
                    </td>
                    <td class="d-flex justify-content-center">
                        <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;border: none;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
			    </tr>
            `;

            $('#dynamicProductionPlan').append(html);
            var lengthProduction = $('#dynamicProductionPlan .productionPlanRow').length;
            $('#NoOfProducts').val(lengthProduction);
        });
    });

    $(document).on('click', '#ProductionPlanTable .btn-edit', function () {
        $('#loader-pms').show();
        $('#dynamicProductionPlan').html("");
        Common.removevalidation('FormProductionPlan');
        $('#ProductionPlanModal #ModalTitle').text("ProductionPlan Info");
        $('#SaveProductionPlan').val('Update').removeClass('btn-success').addClass('btn-update');
        $('.daterangepicker').css('z-index', 111111);
        $('#SaveProductionPlan').hide();
        $('#POMultiSelectDropdown').prop('disabled', true);
        $('#SubmitBtn').hide();
        productionPlanId = $(this).data('id');
        editable = false;

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", {
            FranchiseId: FranchiseMappingId,
            FromDate: fnData.startDate.toISOString(),
            ToDate: fnData.endDate.toISOString(),
            ProductionPlanId: parseInt(productionPlanId)
        },
            EditProductionPlanSuccess,
            null
        );
    });

    function EditProductionPlanSuccess(response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            Common.bindParentData(data[0], 'FormProductionPlan');

            $('#TotalBalanceRGB').val(data[0][0].TotalQuantity_RGB);
            $('#TotalBalancePET').val(data[0][0].TotalQuantity_PET);

            let fromDate = data[0][0].FromDate;
            let toDate = data[0][0].ToDate;

            let picker = $('#reportrange').data('daterangepicker');

            if (picker) {
                if (fromDate && toDate) {
                    let start = moment(fromDate, 'YYYY-MM-DD');
                    let end = moment(toDate, 'YYYY-MM-DD');

                    picker.setStartDate(start);
                    picker.setEndDate(end);

                    $('#reportrange span').html(
                        start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY')
                    );
                } else {
                    picker.setStartDate('');
                    picker.setEndDate('');
                    $('#reportrange span').html('No Date');
                }
            }

            fetchPONumbersEdit(fromDate, toDate, data[0][0].ToFranchiseId, data);

            var parts = data[0][0].ProductionPlanDate.split('-');
            var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
            $('#ProductionPlanDate').val(formattedDate);
            //$('#ProductionPlanDate').attr('min', formattedDate);

            $('#dynamicProductionPlan').empty();

            // Use Promises to wait for all rows
            let promises = data[2].map(item => {
                return new Promise((resolve) => {
                    let unique = Math.random().toString(36).substring(2);
                    let defaultOption = '<option value="">--Select--</option>';

                    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('ToFranchiseId'), ModuleName: 'FranchiseProduct' }, function (response1) {
                        let products = JSON.parse(response1.data);
                        let productsOptions = "";
                        if (products && products.length > 0 && products[0].length > 0) {
                            productsOptions = products[0].map(p => {
                                let selected = p.ProductId == item.ProductId ? 'selected' : '';
                                return `<option value="${p.ProductId}" ${selected}>${p.ProductName}</option>`;
                            }).join('');
                        }

                        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: item.ProductId, ModuleName: 'ProductIdByUnit' }, function (response2) {
                            let unit = JSON.parse(response2.data);
                            let unitOptions = "";
                            if (unit && unit.length > 0 && unit[0].length > 0) {
                                unitOptions = unit[0].map(u => {
                                    let selected = u.SecondaryUnitId == item.UnitId ? 'selected' : '';
                                    return `<option value="${u.SecondaryUnitId}" ${selected}>${u.SecondaryUnitName}</option>`;
                                }).join('');
                            }

                            let emptyBottlesDisabled = item.Type === 'Pet' ? 'disabled' : '';
                            let emptyBottlesValue = item.Type === 'Pet' ? '0' : item.EmptyBottles;
                            let diffValue = item.Quantity - item.POQty;

                            var UnitIdValue = item.UnitId;
                            var SystemBalance;
                            var ManualOpenBal;
                            if (UnitIdValue == 14) {
                                SystemBalance = item.SystemOpeningBalance;
                                ManualOpenBal = item.ManualOpeningBalance;
                            } else {
                                SystemBalance = item.SecondarySystemOpeningBalance;
                                ManualOpenBal = item.SecondaryManualOpeningBalance;
                            }

                            let html = `
                            <tr class="productionPlanRow" data-id="${item.ProductionPlanMappingId}">
                                <td class="type-cell" style="text-align: center; vertical-align: baseline;">${item.Type}</td>
                                <td>
                                    <select class="form-control productId" id="ProductId${unique}" disabled name="ProductId${unique}">
                                        ${defaultOption}${productsOptions}
                                    </select>
                                </td>
                                <td>
                                    <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}">
                                        ${unitOptions}
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-control openingBalance" id="OpeningBalance${unique}" name="OpeningBalance${unique}" value="${SystemBalance ?? '0'}" placeholder="Opening Balance" oninput="Common.allowOnlyNumberLength(this, 7)" disabled>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control PrimaryopeningBalance" id="PrimaryopeningBalance${unique}" name="PrimaryopeningBalance${unique}" value="${item.SystemOpeningBalance}" placeholder="0" required readonly>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control SecondaryopeningBalance" id="SecondaryopeningBalance${unique}" name="SecondaryopeningBalance${unique}" value="${item.SecondarySystemOpeningBalance}" placeholder="0" required readonly>
                                </td>
                                <td>
                                    <input type="text" class="form-control ManualOpenBal" id="ManualOpenBal${unique}" name="ManualOpenBal${unique}" value="${ManualOpenBal}" placeholder="Opening Balance" oninput="Common.allowOnlyNumberLength(this, 7)" disabled>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control PrimaryManualOpenBal" id="PrimaryManualOpenBal${unique}" name="PrimaryManualOpenBal${unique}" value="${item.ManualOpeningBalance ?? '0'}" placeholder="Opening Balance" oninput="Common.allowOnlyNumberLength(this, 7)" disabled>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control SecondaryManualOpenBal" id="SecondaryManualOpenBal${unique}" name="SecondaryManualOpenBal${unique}" value="${item.SecondaryManualOpeningBalance ?? '0'}" placeholder="Opening Balance" oninput="Common.allowOnlyNumberLength(this, 7)" disabled>
                                </td>
                                <td>
                                    <input type="text" class="form-control poquantity" id="PoQuantity${unique}" name="PoQuantity${unique}" value="${item.POQty || ''}" disabled placeholder="PO-Quantity" oninput="Common.allowOnlyNumberLength(this, 7)">
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control Primarypoquantity" id="PrimaryPoQuantity${unique}" name="PrimaryPoQuantity${unique}" value="${item.POQty || ''}" readonly>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control Secondarypoquantity" id="SecondaryPoQuantity${unique}" name="SecondaryPoQuantity${unique}" value="${item.SecondaryPOQty || ''}" readonly>
                                </td>
                                <td>
                                    <input type="text" class="form-control emptyBottles" id="EmptyBottles${unique}" name="EmptyBottles${unique}" value="${emptyBottlesValue}" ${emptyBottlesDisabled || ''} placeholder="Empty Bottles" oninput="Common.allowOnlyNumberLength(this, 7)">
                                </td>
                                <td>
                                    <input type="text" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" value="${item.Quantity ?? '0'}" placeholder="Planned Quantity" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)">
                                    <lable class="d-none ConvertionValues"></lable>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control SecondaryUnitValue" id="SecondaryUnitValue${unique}" name="SecondaryUnitValue${unique}" value="${item.SecondaryUnitValue || ''}" placeholder="0" readonly>
                                </td>
                                <td class="d-flex justify-content-center">
                                    <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;border: none;">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>`;

                            $('#dynamicProductionPlan').append(html);

                            var $row = $('#dynamicProductionPlan .productionPlanRow').last(); // Correctly target the newly added row

                            if (diffValue < 0) {
                                $row.find('.diffquantity').css('color', 'red');
                            } else {
                                $row.find('.diffquantity').css('color', 'green');
                            }

                            let lengthProduction = $('#dynamicProductionPlan .productionPlanRow').length;
                            $('#NoOfProducts').val(lengthProduction);
                            $('#TotalQuantity').val(data[0][0].TotalQuantity);

                            resolve();
                        });
                    });
                });
            });

            Promise.all(promises).then(() => {
                editable = true;
                $('#loader-pms').hide();
                $('#ProductionPlanModal').show();
            });
        } else {
            $('#loader-pms').hide();
            $('#ProductionPlanModal').show();
        }
    }


    $(document).on('click', '#ProductionPlanTable .btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var productionPlanId = $(this).data('id');
            Common.ajaxCall("GET", "/Productions/DeleteProductionPlan", { ProductionPlanId: productionPlanId }, SaveSuccess, null);
        }

    });

    $(document).on('click', '.cancelBtn', function () {
        $('#reportrange span').text('No Date');
        $('#reportrange').data('daterangepicker').setStartDate(moment());
        $('#reportrange').data('daterangepicker').setEndDate(moment());
    });


    $('#ProductionPlanModal .close').click(function () {
        ResetData();
        $('#ProductionPlanModal').hide();
    });

    $(document).on('click', '#dynamicProductionPlan .DynrowRemove', function () {
        let $row = $(this).closest('.productionPlanRow');

        const type = $row.find('.type-cell').text().trim().toUpperCase();
        const quantity = parseFloat($row.find('.ConvertionValues').text().trim()) || 0;

        let rows = $("#dynamicProductionPlan .productionPlanRow");
        if (rows.length > 1) {
            $row.remove();
            if (type === 'RGB') {
                let currentRGB = parseFloat($('#TotalBalanceRGB').val()) || 0;
                $('#TotalBalanceRGB').val(currentRGB - quantity);
            } else if (type === 'PET') {
                let currentPET = parseFloat($('#TotalBalancePET').val()) || 0;
                $('#TotalBalancePET').val(currentPET - quantity);
            }
        }
        var lengthProduction = $('#dynamicProductionPlan .productionPlanRow').length;
        $('#NoOfProducts').val(lengthProduction);
    });

    $(document).on('input', '.quantity', function () {
        let color = 'blue';
        var $row = $(this).closest('tr');
        var ManualOpenBal = parseFloat($row.find('.ManualOpenBal').val()) || 0;
        var poquantity = parseFloat($row.find('.poquantity').val()) || 0;
        var quantity = $row.find('.quantity').val() || 0;
        var diffquantity = parseFloat($row.find('.diffquantity').val()) || 0;
        var SecondaryUnitValue = parseFloat($row.find('.SecondaryUnitValue').val()) || 0;

        var selectedIndex = $row.find('.unitId').prop('selectedIndex');

        if (quantity == '0') {
            $row.find('.diffquantity').val('');
            $row.find('.ConvertionValues').empty().text('0');
        }
        else if (selectedIndex === 0) {
            let ManualOpenBalBeforeDecimal = parseInt(ManualOpenBal.toString().split('.')[0] || "0", 10);
            let ManualOpenBalAfterDecimal = parseInt(ManualOpenBal.toString().split('.')[1] || "0", 10);
            let ManualOpenBalBeforeDecimalVal = ManualOpenBalBeforeDecimal * SecondaryUnitValue;
            let ManualOpenBalsecondaryValue = ManualOpenBalBeforeDecimalVal + ManualOpenBalAfterDecimal;

            let poquantityBeforeDecimal = parseInt(poquantity.toString().split('.')[0] || "0", 10);
            let poquantityAfterDecimal = parseInt(poquantity.toString().split('.')[1] || "0", 10);
            let poquantityBeforeDecimalVal = poquantityBeforeDecimal * SecondaryUnitValue;
            let poquantityUnitValue = poquantityBeforeDecimalVal + poquantityAfterDecimal;

            var SumOfManualPOQuantity = ManualOpenBalsecondaryValue + poquantityUnitValue;

            let quantityBeforeDecimal = parseInt(quantity.toString().split('.')[0] || "0", 10);
            let quantityAfterDecimal = parseInt(quantity.toString().split('.')[1] || "0", 10);
            let quantityBeforeDecimalVal = quantityBeforeDecimal * SecondaryUnitValue;
            let quantityUnitValue = quantityBeforeDecimalVal + quantityAfterDecimal;

            var SumOfManualquantityPOQuantity = SumOfManualPOQuantity - quantityUnitValue;
            let ConvertHowMuch = SumOfManualquantityPOQuantity / SecondaryUnitValue;
            let ConvertHowMuchTakeBeforeVal = parseInt(ConvertHowMuch.toString().split('.')[0] || "0", 10);
            let multipliedValue = ConvertHowMuchTakeBeforeVal * SecondaryUnitValue;
            let multipliedValSubConvertion = SumOfManualquantityPOQuantity - multipliedValue;
            let absoluteSubValue = Math.abs(multipliedValSubConvertion);

            let totalDiff = `${ConvertHowMuchTakeBeforeVal}.${absoluteSubValue}`;

            if (quantity != '' && quantity != '0') {
                if (parseFloat(totalDiff) > 0) {
                    color = 'green';
                } else if (parseFloat(totalDiff) < 0) {
                    color = 'red';
                } else if (SumOfManualquantityPOQuantity == 0) {
                    color = 'blue';
                }
            } else {
                color = '#495057';
            }

            $row.find('.diffquantity').val(totalDiff).css('color', color);

            let quantityBeforeDecimal1 = parseInt(quantity.toString().split('.')[0] || "0", 10);
            let quantityAfterDecimal1 = parseInt(quantity.toString().split('.')[1] || "0", 10);
            let quantityBeforeDecimalVal1 = quantityBeforeDecimal1 * SecondaryUnitValue;
            let quantityUnitValue1 = quantityBeforeDecimalVal1 + quantityAfterDecimal1;
            $row.find('.ConvertionValues').empty().text(quantityUnitValue1);
        } else {
            var BottleUnitQuantityValSum = ManualOpenBal + poquantity;
            var BottleUnitQuantityVal = BottleUnitQuantityValSum - quantity;
            $row.find('.ConvertionValues').empty().text(quantity);
            if (quantity != '' && quantity != '0') {
                if (parseFloat(BottleUnitQuantityVal) > 0) {
                    color = 'green';
                } else if (parseFloat(BottleUnitQuantityVal) < 0) {
                    color = 'red';
                } else if (BottleUnitQuantityVal == 0) {
                    color = 'blue';
                }
            } else {
                color = 'black';
            }
            $row.find('.diffquantity').val(BottleUnitQuantityVal).css('color', color);
        }
        calculateQuantityTotalPET_RGB();
    });

    function calculateQuantityTotalPET_RGB() {
        let totalRGBQuantity = 0;
        let totalPETQuantity = 0;

        $('#dynamicProductionPlan .productionPlanRow').each(function () {
            const $row = $(this);
            const type = $row.find('.type-cell').text().trim().toUpperCase(); // "RGB" or "PET"

            const $valueLabel = $row.find('.ConvertionValues'); // This is a <label>
            const quantity = parseFloat($valueLabel.text().trim()) || 0;

            if (type === 'RGB') {
                totalRGBQuantity += quantity;
            } else if (type === 'PET') {
                totalPETQuantity += quantity;
            }
        });

        $('#TotalBalanceRGB').val(totalRGBQuantity);
        $('#TotalBalancePET').val(totalPETQuantity);
    }

    //$(document).on('input', '.quantity', function () {
    //    var $row = $(this).closest('tr');
    //    var openingBalance = parseFloat($row.find('.openingBalance').val()) || 0;
    //    var poQuantity = parseFloat($row.find('.poquantity').val()) || 0;
    //    var quantity = parseFloat($(this).val()) || 0;

    //    var Values1 = openingBalance + poQuantity;
    //    var Values2 = quantity - Values1;
    //    $row.find('.diffquantity').val(Values2.toFixed(2));
    //    if (Values2 < 0) {
    //        $row.find('.diffquantity').css('color', 'red');
    //    }
    //    else {
    //        $row.find('.diffquantity').css('color', 'green');
    //    }

    //    var total = 0;
    //    $('.quantity').each(function () {
    //        total += parseFloat($(this).val()) || 0;
    //    });
    //    $('#TotalQuantity').val(total.toFixed(2));
    //});

    $(document).on('change', '#dynamicProductionPlan .productId', function () {
        var productId = $(this).val();
        var thisSelectElement = $(this);
        $('select.productId').each(function (index, value) {
            var existVal = $(value).val();
            if (existVal == productId && value !== thisSelectElement[0] && existVal != null) {
                thisSelectElement.val("");
                $(thisSelectElement).val($('option:contains("--Select--")').val()).trigger('change');
                return false;
            }
        });

        var FranchiseId = $('#FormProductionPlan #ToFranchiseId').val();

        var $row = $(this).closest('tr');
        var $flavourDropdown = $row.find('.unitId');
        if (productId != "") {
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: productId, ModuleName: 'ProductIdByUnit' }, function (response) {
                var data = JSON.parse(response.data);
                var dataValue = data[0];
                $flavourDropdown.empty("");
                if (dataValue != null && dataValue.length > 0) {
                    var valueproperty = Object.keys(dataValue[0])[0];
                    var textproperty = Object.keys(dataValue[0])[1];
                    $flavourDropdown.append($('<option>', {
                        value: '',
                        text: '--Select--',
                    }));
                    $.each(dataValue, function (index, item) {
                        $flavourDropdown.append($('<option>', {
                            value: item[valueproperty],
                            text: item[textproperty],
                        }));
                    });
                    $flavourDropdown.prop('selectedIndex', 1).trigger('change');

                } else {
                    $flavourDropdown.append($('<option>', {
                        value: '',
                        text: '--Select--',
                    }));
                }
            });
            Common.ajaxCall("GET", "/Inventory/USP_DD_GetProductDetails_ByProductId_ProductionPlan", { FranchiseId: parseInt(FranchiseId), ProductId: parseInt(productId) }, function (response) {
                if (response.status) {
                    let parsedData = JSON.parse(response.data);
                    let productData = parsedData[0][0];

                    const emptyBottlesDisabled = productData.Type === 'Pet';
                    const emptyBottlesValue = emptyBottlesDisabled ? '0' : '';

                    $row.find('.type-cell').text(productData.Type);

                    $row.find('.unitId').empty()
                        .html(`
                        <option value="${productData.UnitId_DBT1}" selected>${productData.Unit1}</option>
                        <option value="${productData.UnitId_DBT}">${productData.Unit}</option>
                    `);
                    
                    $row.find('.openingBalance').val(productData.SystemOpeningBalance).attr('value', productData.SystemOpeningBalance);
                    $row.find('.PrimaryopeningBalance').val(productData.SystemOpeningBalance).attr('value', productData.SystemOpeningBalance);
                    $row.find('.SecondaryopeningBalance').val(productData.SecondarySystemOpeningBalance).attr('value', productData.SecondarySystemOpeningBalance);
                    $row.find('.ManualOpenBal').val(productData.ManualOpeningBalance).attr('value', productData.ManualOpeningBalance);
                    $row.find('.PrimaryManualOpenBal').val(productData.ManualOpeningBalance).attr('value', productData.ManualOpeningBalance);
                    $row.find('.SecondaryManualOpenBal').val(productData.SecondaryManualOpeningBalance).attr('value', productData.SecondaryManualOpeningBalance);
                    $row.find('.emptyBottles').val(emptyBottlesValue).attr('value', emptyBottlesValue).prop('disabled', emptyBottlesDisabled);
                    $row.find('.quantity').val('').attr('value', '');
                    $row.find('.diffquantity').val('').attr('value', '');
                    $row.find('.SecondaryUnitValue').val(productData.SecondaryUnitValue).attr('value', productData.SecondaryUnitValue);
                }
            });
        }
    });

    $(document).on('change', '.unitId', function () {
        var $row = $(this).closest('tr');
        var type = $row.find('.type-cell').text().trim().toUpperCase();
        var currentConvertedQty = parseFloat($row.find('.ConvertionValues').text().trim()) || 0;

        if (type === 'RGB') {
            let currentRGB = parseFloat($('#TotalBalanceRGB').val()) || 0;
            $('#TotalBalanceRGB').val(currentRGB - currentConvertedQty);
        } else if (type === 'PET') {
            let currentPET = parseFloat($('#TotalBalancePET').val()) || 0;
            $('#TotalBalancePET').val(currentPET - currentConvertedQty);
        }

        var selectedIndex = $(this).prop('selectedIndex');

        var primaryStock = $row.find('.Primarypoquantity').val();
        var secondaryStock = $row.find('.Secondarypoquantity').val();

        var SecondaryopeningBalance = $row.find('.SecondaryopeningBalance').val();
        var PrimaryopeningBalance = $row.find('.PrimaryopeningBalance').val();

        var SecondaryManualOpenBal = $row.find('.SecondaryManualOpenBal').val();
        var PrimaryManualOpenBal = $row.find('.PrimaryManualOpenBal').val();

        if (selectedIndex === 0) {
            $row.find('.poquantity').val(primaryStock);
            $row.find('.openingBalance').val(PrimaryopeningBalance);
            $row.find('.ManualOpenBal').val(PrimaryManualOpenBal);
        } else if (selectedIndex === 1) {
            $row.find('.poquantity').val(secondaryStock);
            $row.find('.openingBalance').val(SecondaryopeningBalance);
            $row.find('.ManualOpenBal').val(SecondaryManualOpenBal);
        } else {
            $row.find('.poquantity').val('');
        }

        $row.find('.quantity').val('');
        $row.find('.ConvertionValues').text('');
        $row.find('.diffquantity').val('').css('color', '#495057');
    });

    $('#dynamicProductionPlan').on('input change', 'input, select, textarea', function () {
        $('#SaveProductionPlan').show();
    });
});


function ProductionPlanSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $("#CounterTextBox1").text(CounterBox[0]);
        $("#CounterTextBox2").text(CounterBox[1]);
        $("#CounterTextBox3").text(CounterBox[2]);
        $("#CounterTextBox4").text(CounterBox[3]);

        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        var columns = Common.bindColumn(data[1], ['ProductionPlanId']);
        Common.bindTableForNoStatus('ProductionPlanTable', data[1], columns, -1, 'ProductionPlanId', '330px', true, access);
    }
}





function SaveSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        ResetData();
        $('#ProductionPlanModal').hide();
        getSuccess();
    }
    else {
        Common.errorMsg(response.message);
    }
}


function getSuccess() {
    var text = $('#dropdownMenuButton2').text();
    var fromDate;
    var toDate;
    if (text == "Custom") {
        var fromDate = $('#FromDate').val();
        $('#ToDate').attr('min', fromDate);

        var dateObject = new Date(fromDate);
        dateObject.setDate(dateObject.getDate() - 1);

        var toDate = $('#ToDate').val();
        var todateObject = new Date(toDate);

        fromDate = dateObject.toISOString();
        toDate = todateObject.toISOString();
    }
    else {
        var dateText = $("#dateDisplay2").text();

        var parts = dateText.split(" ");
        var month = parts[0];
        var year = parts[1];

        var startDate = null;
        var endDate = null;

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthIndex = monthNames.indexOf(month);
        if (monthIndex !== -1) {

            startDate = new Date(year, monthIndex, 1);
            fromDate = startDate.toISOString();

            if (!isNaN(startDate.getTime())) {

                var currentDate = new Date();

                if (startDate.getMonth() === currentDate.getMonth() && startDate.getFullYear() === currentDate.getFullYear()) {
                    endDate = currentDate;
                    toDate = endDate.toISOString();
                } else {
                    endDate = new Date(year, monthIndex + 1, 0);
                    endDate.setDate(endDate.getDate() + 1);
                    toDate = endDate.toISOString();
                }
            }
        }
    }
    Common.ajaxCall("GET", "/Productions/GetProductionPlan", { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, ProductionPlanId: null }, ProductionPlanSuccess, null);
}
/*------------------------------------------------------------------------------------*/
$(function () {
    function cb(start, end, label) {
        if (label === 'No Date') {
            $('#reportrange span').html('No Date');
        } else {
            $('#reportrange span').html(start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY'));
            $('#reportrange-error').hide();
        }
    }

    $('#reportrange').daterangepicker({
        autoUpdateInput: false,
        alwaysShowCalendars: true,
        showCustomRangeLabel: true,
        locale: {
            format: 'DD-MM-YYYY'
        }
    }, cb);

    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
        if (picker.chosenLabel === 'No Date') {
            $(this).find('span').html('No Date');
        } else {
            $(this).find('span').html(picker.startDate.format('DD-MM-YYYY') + ' - ' + picker.endDate.format('DD-MM-YYYY'));
            var startDate = picker.startDate.format('YYYY-MM-DD');
            var endDate = picker.endDate.format('YYYY-MM-DD');
            var FranchiseMapping = parseInt(localStorage.getItem('FranchiseId'));

            fetchPONumbers(startDate, endDate, FranchiseMapping);
        }
    });
});

function fetchPONumbers(fromDate, toDate, FranchiseMapping) {
    $.ajax({
        type: 'GET',
        url: '/Productions/GetPONumberbyDate',
        data: { fromDate: fromDate, toDate: toDate, FranchiseId: FranchiseMapping },
        success: function (result) {
            bindPODropdown(result);
            const $dropdown = $('#POMultiSelectDropdown');
            let disabledOptions = $dropdown.data('disabled-options') || [];
            disabledOptions.forEach(id => {
                $dropdown.find(`option[value="${id}"]`).prop('disabled', true);

            });
        },
        error: function (err) {
            Common.errorMsg('Error fetching PO Numbers:', err);
        }
    });
}
function bindPODropdown(poList) {
    let parsedList = JSON.parse(poList.data);
    let poArray = Array.isArray(parsedList[0]) ? parsedList[0] : [];

    const $dropdown = $('#POMultiSelectDropdown');
    $dropdown.empty();


    const disabledOptions = [];

    $.each(poArray, function (i, po) {
        const option = new Option(po.PurchaseOrderNo_DBT, po.PurchaseOrderId_DBT, false, false);


        if (po.Disable === 0) {
            disabledOptions.push(po.PurchaseOrderId_DBT.toString());
        }

        $dropdown.append(option);
    });

    $dropdown.select2({
        dropdownParent: $('#FormProductionPlan'),
        width: '100%',
        placeholder: '--Select PO No--'
    });


    $dropdown.data('disabled-options', disabledOptions);
}

function fetchPONumbersEdit(fromDate, toDate, FranchiseMapping, data) {
    $.ajax({
        type: 'GET',
        url: '/Productions/GetPONumberbyDate',
        data: { fromDate: fromDate, toDate: toDate, FranchiseId: FranchiseMapping },
        success: function (result) {
            bindPODropdown(result);

            let poMappings = data[1] || [];
            let poIds = poMappings
                .filter(item => item && item.PurchaseOrderId != null)
                .map(item => item.PurchaseOrderId.toString());

            const $dropdown = $('#POMultiSelectDropdown');
            poIds.forEach(id => {
                $dropdown.find(`option[value="${id}"]`).prop('disabled', false);
            });

            $dropdown.val(poIds).trigger('change');


            let disabledOptions = $dropdown.data('disabled-options') || [];
            disabledOptions.forEach(id => {

                if (!poIds.includes(id)) {
                    $dropdown.find(`option[value="${id}"]`).prop('disabled', true);
                }
            });
        },
        error: function (err) {
            Common.errorMsg('Error fetching PO Numbers:', err);
        }
    });
}


$('#SubmitBtn').on('click', function () {
    let selectedIds = $('#POMultiSelectDropdown').val();
    var FranchiseMapping = parseInt(localStorage.getItem('FranchiseId'));
    var PPD = $('#ProductionPlanDate').val();
    $('#SaveProductionPlan').hide();

    $('#TotalBalanceRGB').val('');
    $('#TotalBalancePET').val('');

    if (!selectedIds || selectedIds.length === 0) {
        Common.warningMsg("Please select at least one PO.");
        return;
    }
    if ($('#ProductionPlanDate').val() == "") {
        Common.warningMsg("Please select the date.");
        return;
    }

    let filterList = selectedIds.map(id => ({
        PurchaseOrderId_DBT: parseInt(id)
    }));


    let formData = new FormData();
    formData.append("FranchiseId", FranchiseMapping);
    formData.append("ProductionPlanDate", PPD);
    formData.append("FilterType", JSON.stringify(filterList));


    $.ajax({
        url: '/Productions/GetDPODetailsById',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.status && response.data) {
                let parsedData = JSON.parse(response.data);
                let productData = parsedData[0];

                if (productData && productData.length > 0) {
                    $('#dynamicProductionPlan').empty('');
                    productData.forEach(function (item) {
                        let emptyBottlesDisabled = item.Type === 'Pet' ? 'disabled' : '';
                        let emptyBottlesValue = item.Type === 'Pet' ? '0' : '';

                        let unique = Math.random().toString(36).substring(2);

                        let html = `
                            <tr class="productionPlanRow" data-id="">
                                <td class="type-cell" data-label="Type" Style="text-align: center;vertical-align: baseline;">${item.Type}</td>
                                <td>
                                    <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required disabled>
                                        <option value="${item.ProductId_DBT}" selected>${item.ProductName}</option>
                                    </select>
                                </td>
                                <td>
                                    <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required>
                                     <option value="${item.UnitId_DBT1}" selected>${item.Unit1}</option>
                                        <option value="${item.UnitId_DBT}">${item.Unit}</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-control openingBalance" id="OpeningBalance${unique}" name="OpeningBalance${unique}" value="${item.SystemOpeningBalance || ''}" placeholder="0" required readonly>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control PrimaryopeningBalance" id="PrimaryopeningBalance${unique}" name="PrimaryopeningBalance${unique}" value="${item.SystemOpeningBalance}" placeholder="0" required readonly>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control SecondaryopeningBalance" id="SecondaryopeningBalance${unique}" name="SecondaryopeningBalance${unique}" value="${item.SecondarySystemOpeningBalance}" placeholder="0" required readonly>
                                </td>
                                <td>
                                    <input type="text" class="form-control ManualOpenBal" id="ManualOpenBal${unique}" name="ManualOpenBal${unique}" value="${item.ManualOpeningBalance || ''}" placeholder="0" required readonly>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control PrimaryManualOpenBal" id="PrimaryManualOpenBal${unique}" name="PrimaryManualOpenBal${unique}" value="${item.ManualOpeningBalance || ''}" placeholder="0" required readonly>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control SecondaryManualOpenBal" id="SecondaryManualOpenBal${unique}" name="SecondaryManualOpenBal${unique}" value="${item.SecondaryManualOpeningBalance || ''}" placeholder="0" required readonly>
                                </td>
                                <td>
                                    <input type="text" class="form-control poquantity" id="PoQuantity${unique}" name="PoQuantity${unique}" value="${item.POQty || ''}" placeholder="0" required readonly>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control Primarypoquantity" id="PrimaryPoQuantity${unique}" name="PrimaryPoQuantity${unique}" value="${item.POQty || ''}" placeholder="0" readonly>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control Secondarypoquantity" id="SecondaryPoQuantity${unique}" name="SecondaryPoQuantity${unique}" value="${item.SecondaryPOQty || ''}" placeholder="0" readonly>
                                </td>
                                <td>
                                    <input type="text" class="form-control emptyBottles" id="EmptyBottles${unique}" value="${emptyBottlesValue}" name="EmptyBottles${unique}" ${emptyBottlesDisabled || ''} placeholder="0" oninput="Common.allowOnlyNumberLength(this, 7)">
                                </td>
                                <td>
                                    <input type="text" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" placeholder="0" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)">
                                    <lable class="d-none ConvertionValues"></lable>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control SecondaryUnitValue" id="SecondaryUnitValue${unique}" name="SecondaryUnitValue${unique}" value="${item.SecondaryUnitValue || ''}" placeholder="0" readonly>
                                </td>
                                <td class="d-flex justify-content-center">
                                    <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;border: none;">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>`;

                        $('#dynamicProductionPlan').append(html);
                    });

                    let lengthProduction = $('#dynamicProductionPlan .productionPlanRow').length;
                    $('#NoOfProducts').val(lengthProduction);
                } else {
                    Common.errorMsg("No products found for selected PO(s).");
                }
            } else {
                Common.errorMsg(response.message || "Unexpected error occurred.");
            }
        },

        error: function (xhr, status, error) {

            Common.errorMsg("An error occurred while fetching data.");
        }
    });
});
function ResetData() {
    $('#dynamicProductionPlan').empty('');
    $('#ProductionPlanDate').val('');
    $('#ToFranchiseId').val('');
    $('#reportrange span').text('');
    $('#reportrange').find('span').html('No Date');
    $('#POMultiSelectDropdown').empty().trigger('change');
}

function DynamicHtmlEmptyTbody() {
    let unique = Math.random().toString(36).substring(2);
    var defaultOption = '<option value="">--Select--</option>';
    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('ToFranchiseId'), ModuleName: 'FranchiseProduct' }, function (response) {
        var products = JSON.parse(response.data);
        if (products != null && products.length > 0 && products[0].length > 0) {
            var productsOptions = products[0].map(function (productsVal) {
                return `<option value="${productsVal.ProductId}">${productsVal.ProductName}</option>`;
            }).join('');
        }
        var html = `
                <tr class="productionPlanRow" data-id="">
                    <td class="type-cell" data-label="Type" Style="text-align: center;vertical-align: baseline;"> -- </td>

                    <td>
                        <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required disabled>
                            ${defaultOption}${productsOptions}
                        </select>
                    </td>
                    <td>
                        <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required>
                            ${defaultOption}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control openingBalance" id="OpeningBalance${unique}" name="OpeningBalance${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control PrimaryopeningBalance" id="PrimaryopeningBalance${unique}" name="PrimaryopeningBalance${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control SecondaryopeningBalance" id="SecondaryopeningBalance${unique}" name="SecondaryopeningBalance${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td>
                        <input type="text" class="form-control ManualOpenBal" id="ManualOpenBal${unique}" name="ManualOpenBal${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control PrimaryManualOpenBal" id="PrimaryManualOpenBal${unique}" name="PrimaryManualOpenBal${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control SecondaryManualOpenBal" id="SecondaryManualOpenBal${unique}" name="SecondaryManualOpenBal${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td>
                        <input type="text" class="form-control poquantity" id="PoQuantity${unique}" name="PoQuantity${unique}" value="" placeholder="0" required readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control Primarypoquantity" id="PrimaryPoQuantity${unique}" name="PrimaryPoQuantity${unique}" value="" placeholder="0" readonly>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control Secondarypoquantity" id="SecondaryPoQuantity${unique}" name="SecondaryPoQuantity${unique}" value="" placeholder="0" readonly>
                    </td>
                    <td>
                        <input type="text" class="form-control emptyBottles" id="EmptyBottles${unique}" name="EmptyBottles${unique}" placeholder="0" oninput="Common.allowOnlyNumberLength(this, 7)">
                    </td>
                    <td>
                        <input type="text" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" placeholder="0" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)">
                        <lable class="d-none ConvertionValues"></lable>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control SecondaryUnitValue" id="SecondaryUnitValue${unique}" name="SecondaryUnitValue${unique}" value="" placeholder="0" readonly>
                    </td>
                    <td class="d-flex justify-content-center">
                        <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;border: none;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
				</tr>
            `;

        $('#dynamicProductionPlan').append(html);
        var lengthProduction = $('#dynamicProductionPlan .productionPlanRow').length;
        $('#NoOfProducts').val(lengthProduction);
    });
}

//$(document).on('click', '#SendingSMS', function () {
//        Common.ajaxCall("GET", "/Productions/SendingSMS/", null, function (response) {
//            if (response.status) {
//                Common.successMsg(response.message);
//        }
//    }, null);
//});