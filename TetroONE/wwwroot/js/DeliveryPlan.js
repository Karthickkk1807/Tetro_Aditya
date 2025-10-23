var deliveryPlanId = 0;
var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
var DistributorDDArray = [];
var ProductDDArray = [];
var UnitDDArray = [];
var titleForHeaderDeliveryTab = "";

$(document).ready(async function () {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    var fnData = Common.getDateFilter('dateDisplay2');
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').show();

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();
        getSuccess();
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        if (displayedDate.getFullYear() > currentYear || (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() > currentMonth)) {
            $('#increment-month-btn2').hide();
        }
        getSuccess();
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

    Common.bindDropDownParent('ToFranchiseId', 'FormDeliveryPlan', 'Franchise');
    getSuccess();

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        displayedDate = new Date(currentYear, currentMonth);
        $('#increment-month-btn2').show();

        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetDeliveryPlan", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), DeliveryPlanId: null }, DeliveryPlanSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });


    var DistributorDD = await Common.bindDropDownDynamicBind('Distributor');
    DistributorDDArray = JSON.parse(DistributorDD);

    var ProductDD = await Common.bindDropDownDynamicBind('ProductDeliveryPlan');
    ProductDDArray = JSON.parse(ProductDD);

    var UnitDD = await Common.bindDropDownDynamicBind('UnitDeliveryPlan');
    UnitDDArray = JSON.parse(UnitDD);


    $('#SaveDeliveryPlan').click(function () {
        if ($('#FormDeliveryPlan').valid()) {

            let isValid = true;

            $('.deliveryPlanRow, .ExtraDeliveryPlanRow').each(function () {
                const $row = $(this);

                $row.find('input[required], select[required]').each(function () {
                    const $field = $(this);
                    const fieldName = $field.attr('name')?.toLowerCase() || '';

                    // Skip deliveryTime ONLY inside .ExtraDeliveryPlanRow
                    if ($row.hasClass('ExtraDeliveryPlanRow') && fieldName.includes('deliverytime')) {
                        return; // skip this one
                    }

                    const value = $field.val()?.trim();

                    if (!value) {
                        $field.addClass('is-invalid');
                        isValid = false;
                    } else {
                        $field.removeClass('is-invalid');
                    }
                });
            });

            if (!isValid) {
                Common.warningMsg('Please fill the required in Distributor Mapping Tab For Delivery Time and Quantity fields.');
                return;
            }

            var objvalue = {};
            objvalue.DeliveryPlanId = deliveryPlanId == 0 ? null : deliveryPlanId;
            objvalue.DeliveryPlanDate = Common.stringToDateTime('DeliveryPlanDate');
            objvalue.FromFranchiseId = FranchiseMappingId;
            objvalue.ToFranchiseId = Common.parseInputValue('ToFranchiseId');
            objvalue.TransportRoute = $('#Route').val();
            objvalue.NoOfDistributor = Common.parseInputValue('NoOfDistributor');
            objvalue.NoOfProducts = Common.parseInputValue('NoOfProducts');
            objvalue.TotalQty_PET = Common.parseInputValue('TotalBalancePET');
            objvalue.TotalQty_RGB = Common.parseInputValue('TotalBalanceRGB');

            // ✅ Sync DeliveryTime from .deliveryPlanRow to matching .ExtraDeliveryPlanRow
            var deliveryPlanRows = $('#dynamicDistributor').find('.deliveryPlanRow');
            var extraDeliveryPlanRows = $('#dynamicDistributor').find('.ExtraDeliveryPlanRow');

            deliveryPlanRows.each(function () {
                var $mainRow = $(this);
                var mainDistributorId = $mainRow.find('.distributorId').val();
                var mainDeliveryTime = $mainRow.find('.deliveryTime').val();

                if (mainDeliveryTime && mainDistributorId) {
                    extraDeliveryPlanRows.each(function () {
                        var $extraRow = $(this);
                        var extraDistributorId = $extraRow.find('.distributorId').val();

                        if (mainDistributorId === extraDistributorId) {
                            $extraRow.find('.deliveryTime').val(mainDeliveryTime);
                        }
                    });
                }
            });

            var ExpenseAmount = $('.Amount').text();
            var ExpenseAmountConvert = 0.00;
            if (ExpenseAmount != "") {
                var cleanAmountExpense = ExpenseAmount.replace('₹', '').replace('/-', '').trim();
                ExpenseAmountConvert = parseFloat(cleanAmountExpense);
            } else {
                ExpenseAmountConvert = 0.00;
            }

            var PerBottleCost = $('#PerBottleCost').val();
            var PerBottleCostAmount = 0.00;
            if (PerBottleCost != "") {
                var cleanAmountBottleCost = PerBottleCost.replace('₹', '').replace('/-', '').trim();
                PerBottleCostAmount = parseFloat(cleanAmountBottleCost);
            } else {
                PerBottleCostAmount = 0.00;
            }

            // ✅ Build DeliveryPlanDistributorMappingDetails array
            var DeliveryPlanDistributorMappingDetails = [];
            var parentRows = $('#dynamicDistributor').find('.deliveryPlanRow, .ExtraDeliveryPlanRow');
            $.each(parentRows, function (index, parentRow) {
                var $row = $(parentRow);
                var DeliveryPlanDistributorMappingId = $row.attr('data-id');
                var DistributorId = $row.find('.distributorId').val();
                var ProductId = $row.find('.productId').val();
                var DeliveryTime = $row.find('.deliveryTime').val();
                var UnitId = $row.find('.unitId').val();
                var POQuantity = $row.find('.poquantity').val();
                var Quantity = $row.find('.quantity').val();
                var ConvertionValues = $row.find('.ConvertionVal').val();

                DeliveryPlanDistributorMappingDetails.push({
                    DeliveryPlanDistributorMappingId: DeliveryPlanDistributorMappingId == "" ? null : parseInt(DeliveryPlanDistributorMappingId),
                    DistributorId: parseInt(DistributorId) || null,
                    ProductId: parseInt(ProductId) || null,
                    DeliveryTime: DeliveryTime || null,
                    UnitId: parseInt(UnitId) || null,
                    POQuantity: parseInt(POQuantity),
                    Quantity: parseFloat(Quantity) || null,
                    DeliveryPlanId: deliveryPlanId == 0 ? null : deliveryPlanId,
                    ConvertionValues: parseFloat(ConvertionValues) || null,
                });
            });

            var ExpenseMapping = [];
            var ClosestDiv = $('.ExpenseDetails .MainDivExpenseDyanmic');

            $.each(ClosestDiv, function (index, values) {
                var DeliveryPlanExpenseMappingId = $(values).find('.DeliveryPlanExpenseMappingId').text();
                var ExpenseName = $(values).find('.ExpenseName').val();
                var ExpenseAmount = $(values).find('.ExpenseAmount').val();
                //var ExpenseAmountConvert = $(values).find('.ExpenseAmountConvert').val(); // Assuming this exists
                //var PerBottleCostAmount = $(values).find('.PerBottleCostAmount').val();   // Assuming this exists

                // If ExpenseName is empty or null, push nulls
                if (!ExpenseName || ExpenseName.trim() === "") {
                    ExpenseMapping.push({
                        DeliveryPlanExpenseMappingId: null,
                        ExpenseName: null,
                        ExpenseAmount: null,
                        TotalAmount: null,
                        PerBottleCost: null,
                        DeliveryPlanId: null
                    });
                } else {
                    ExpenseMapping.push({
                        DeliveryPlanExpenseMappingId: DeliveryPlanExpenseMappingId === "" ? null : parseInt(DeliveryPlanExpenseMappingId),
                        ExpenseName: ExpenseName,
                        ExpenseAmount: parseFloat(ExpenseAmount),
                        TotalAmount: parseFloat(ExpenseAmountConvert),
                        PerBottleCost: parseFloat(PerBottleCostAmount),
                        DeliveryPlanId: deliveryPlanId === 0 ? null : deliveryPlanId
                    });
                }
            });

            objvalue.DeliveryPlanDistributorMappingDetails = DeliveryPlanDistributorMappingDetails;
            objvalue.DeliveryPlanExpenseMappingDetails = ExpenseMapping;

            // ✅ Final AJAX Call
            Common.ajaxCall("POST", "/Productions/InsertUpdateDeliveryPlan", JSON.stringify(objvalue), SaveSuccess, null);
        }
    });

    $('#AddDeliveryPlan').click(function () {
        Common.removevalidation('FormDeliveryPlan');
        $('#SaveDeliveryPlan').val("Save").removeClass('btn-update').addClass('btn-success');
        deliveryPlanId = 0;
        $('#dynamicDeliveryPlan').html("");
        $('#DeliveryPlanModal #ModalTitle').text("Add DeliveryPlan");
        var today = new Date();
        var todayformatted = today.toISOString().split('T')[0];
        $('#DeliveryPlanDate').val(todayformatted);
        $('#ToFranchiseId').val(FranchiseMappingId).trigger('change');
        InitialModelShow();
    });

    $(document).on('click', '#Distributor-TabBtn', function () {
        $('#Distributor-TabRecord').show();
        $('.searchbar').show();
        $('.ExpenseDetails').hide();
        $('#AmountMainDiv').hide();
        $('#Expense-RecordFooter').hide().removeClass('d-flex').addClass('d-none');
        $('#Distributor-RecordFooter').show().removeClass('d-none').addClass('d-flex');
        $('#DeliveryPlanModal .modal-dialog').removeClass('modal-md').addClass('modal-xl');
        $('#DeliveryPlanDateDiv').removeClass('col-lg-6 col-md-6 col-sm-4 col-4').addClass('col-lg-2 col-md-6 col-sm-4 col-4');
        $('#ToFranchiseIdDiv').removeClass('col-lg-6 col-md-6 col-sm-4 col-4').addClass('col-lg-2 col-md-6 col-sm-4 col-4');
        $('#RouteDiv').removeClass('col-lg-12 col-md-6 col-sm-4 col-4').addClass('col-lg-4 col-md-6 col-sm-4 col-4');
    });

    $(document).on('click', '#Expense-TabBtn', function () {
        $('#Distributor-TabRecord').hide();
        $('.ExpenseDetails').show();
        $('.searchbar').hide();
        $('#Expense-RecordFooter').show().removeClass('d-none').addClass('d-flex');
        $('#Distributor-RecordFooter').hide().removeClass('d-flex').addClass('d-none');
        $('#DeliveryPlanModal .modal-dialog').removeClass('modal-xl').addClass('modal-md');
        $('#DeliveryPlanDateDiv').removeClass('col-lg-2 col-md-6 col-sm-4 col-4').addClass('col-lg-6 col-md-6 col-sm-4 col-4');
        $('#ToFranchiseIdDiv').removeClass('col-lg-2 col-md-6 col-sm-4 col-4').addClass('col-lg-6 col-md-6 col-sm-4 col-4');
        $('#RouteDiv').removeClass('col-lg-4 col-md-6 col-sm-4 col-4').addClass('col-lg-12 col-md-6 col-sm-4 col-4');
        ShowOrHideAmountDiv();
    });

    $('#DeliveryPlanModal .close').click(function () {
        $('#DeliveryPlanModal').hide();
    });

    $(document).on('change', '.distributorId', function () {
        var $element = $(this); // Save original 'this'
        var thisSelectElement = $element;
        var distributorId = $element.val();
        var $currentRow = $element.closest("tr");

        // Prevent duplicate distributor selection
        var isDuplicate = false;

        $('select.distributorId').each(function (index, value) {
            var existVal = $(value).val();
            if (existVal == distributorId && value !== thisSelectElement[0] && existVal != null) {
                isDuplicate = true;
                return false; // break loop
            }
        });

        if (isDuplicate) {
            Common.warningMsg("This distributor is already selected. Please choose a different one.");
            thisSelectElement.val("").trigger('change');

            var extraRows = $currentRow.nextUntil('.deliveryPlanRow', '.ExtraDeliveryPlanRow');
            extraRows.remove();

            $currentRow.find('.productId').val('');
            $currentRow.find('.unitId').val('');
            $currentRow.find('.poquantity').val('');
            $currentRow.find('.productCategoryName').val('');
            $currentRow.find('.primaryPOQuantity').val('');
            $currentRow.find('.secondaryPOQuantity').val('');

            let NoOfDistributorVal = $('.deliveryPlanRow').length - 1;
            $('#NoOfDistributor').val(NoOfDistributorVal);

            let NoOfProductVal = $('#dynamicDistributor').find('.productId').length - 1;
            $('#NoOfProducts').val(NoOfProductVal);

            $('.quantity').trigger('input');

            return; // exit early
        }

        if (distributorId != "") {
            // Remove ExtraDeliveryPlanRow (if any) before loading new ones
            var extraRows = $currentRow.nextUntil('.deliveryPlanRow', '.ExtraDeliveryPlanRow');
            extraRows.remove();

            var FranchiseId = $('#ToFranchiseId').val();
            var DeliveryPlanDate = $('#DeliveryPlanDate').val();
            var EditData = {
                FranchiseId: parseInt(FranchiseId),
                DeliveryPlanDate: DeliveryPlanDate,
                DistributorId: parseInt(distributorId)
            };

            Common.ajaxCall("GET", "/Productions/GetDeliveryProduct", EditData, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);

                    data[0].forEach((item, index) => {
                        let unique = Math.random().toString(36).substring(2);

                        var defaultOption = '<option value="">--Select--</option>';
                        var UnitSelectOptions = '', ProductSelectOptions = '', DistributorSelectOptions = '';

                        if (UnitDDArray.length > 0 && UnitDDArray[0]) {
                            UnitSelectOptions = UnitDDArray[0].map(val => {
                                const selected = val.UnitId == item.UnitId_DBT ? 'selected' : '';
                                return `<option value="${val.UnitId}" ${selected}>${val.UnitName}</option>`;
                            }).join('');
                        }
                        if (ProductDDArray.length > 0 && ProductDDArray[0]) {
                            ProductSelectOptions = ProductDDArray[0].map(val => {
                                const selected = val.ProductId == item.ProductId_DBT ? 'selected' : '';
                                return `<option value="${val.ProductId}" ${selected}>${val.ProductName}</option>`;
                            }).join('');
                        }
                        if (DistributorDDArray.length > 0 && DistributorDDArray[0]) {
                            DistributorSelectOptions = DistributorDDArray[0].map(val => {
                                const selected = val.DistributorId == item.DistributorId ? 'selected' : '';
                                return `<option value="${val.DistributorId}" ${selected}>${val.DistributorName}</option>`;
                            }).join('');
                        }

                        if (index === 0) {
                            $currentRow.find('.productId').val(item.ProductId_DBT);
                            $currentRow.find('.unitId').val(item.UnitId_DBT);
                            $currentRow.find('.poquantity').val(item.PrimaryPOQuantity);
                            $currentRow.find('.productCategoryName').val(item.ProductCategoryName);
                            $currentRow.find('.primaryPOQuantity').val(item.PrimaryPOQuantity);
                            $currentRow.find('.secondaryPOQuantity').val(item.SecondaryPOQuantity);
                        } else {
                            var html = `
                            <tr class="ExtraDeliveryPlanRow" data-id="">
                                <td class="d-none">
                                    <select class="form-control distributorId" id="distributorId${unique}" name="distributorId${unique}">
                                        ${defaultOption}${DistributorSelectOptions}
                                    </select>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control mydatetimepicker deliveryTime" id="DeliveryTime${unique}" name="DeliveryTime${unique}" placeholder="Delivery Time" style="background-color: #ffffff;" readonly>
                                </td>
                                <td></td>
                                <td></td>
                                <td class="d-none">
                                    <input type="text" class="form-control productCategoryName" id="ProductCategoryName${unique}" name="ProductCategoryName${unique}" value="${item.ProductCategoryName}" disabled>
                                </td>
                                <td>
                                    <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required disabled>
                                        ${defaultOption}${ProductSelectOptions}
                                    </select>
                                </td>
                                <td>
                                    <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required>
                                        ${defaultOption}${UnitSelectOptions}
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-control poquantity" id="PoQuantity${unique}" name="PoQuantity${unique}" value="${item.PrimaryPOQuantity}" placeholder="PO-Quantity" disabled>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control primaryPOQuantity" id="PrimaryPOQuantity${unique}" name="PrimaryPOQuantity${unique}" value="${item.PrimaryPOQuantity}" disabled>
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control secondaryPOQuantity" id="SecondaryPOQuantity${unique}" name="SecondaryPOQuantity${unique}" value="${item.SecondaryPOQuantity}" disabled>
                                </td>
                                <td>
                                    <input type="text" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" placeholder="Quantity" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this,6)">
                                </td>
                                <td class="d-none">
                                    <input type="text" class="form-control ConvertionVal" id="ConvertionVal${unique}" name="ConvertionVal${unique}" placeholder="ConvertionVal" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)">
                                </td>
                                <td class="d-flex justify-content-center">
                                    <button id="RemoveButton" class="btn btn-danger DynrowRemoveDistributor text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;border: none;">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                            $currentRow.after(html);
                            $('.mydatetimepicker').mdtimepicker();

                            let NoOfDistributorVal = $('.deliveryPlanRow').length;
                            $('#NoOfDistributor').val(NoOfDistributorVal);

                            let NoOfProductVal = $('#dynamicDistributor').find('.productId').length;
                            $('#NoOfProducts').val(NoOfProductVal);
                        }
                    });
                }
            }, null);
        }
    });


    $(document).on('change', '.unitId', function () {
        var $this = $(this);
        var selectedIndex = $this.prop('selectedIndex');
        var $row = $this.closest('tr');
        var quantityValue = "";
        if (selectedIndex == 1)
            quantityValue = $row.find('.primaryPOQuantity').val();
        else if (selectedIndex == 2)
            quantityValue = $row.find('.secondaryPOQuantity').val();
        else if (selectedIndex == 0)
            quantityValue = 0.00;

        $row.find('.poquantity').val(quantityValue);
        $row.find('.quantity').val('');
    });

    $(document).on('input', '.ExpenseAmount', function () {
        ShowOrHideAmountDiv();
        ExpensePaise();
    });

    $(document).on('input', '.quantity', function () {
        var $thisval = $(this).val();
        var $row = $(this).closest('tr');
        var selectedIndex = $row.find('.unitId').prop('selectedIndex');
        if (selectedIndex == 1) {
            let QuantityBeforeDecimal = parseInt($thisval.split('.')[0] || "0", 10);
            let QuantityAfterDecimal = parseInt($thisval.split('.')[1] || "0", 10);
            let MultipleByUnitVal = QuantityBeforeDecimal * 24;
            let AddValues = MultipleByUnitVal + QuantityAfterDecimal;
            $row.find('.ConvertionVal').val(AddValues);
        } else {
            $row.find('.ConvertionVal').val($thisval);
        }
        QuantityVal();
        ExpensePaise();
    });

    $(document).on('click', '#DeliveryPlanTable .btn-edit', function () {
        Common.removevalidation('FormDeliveryPlan');
        $('#SaveDeliveryPlan').val("Update").removeClass('btn-success').addClass('btn-update');
        $('#DeliveryPlanModal #ModalTitle').text("DeliveryPlan Info");
        InitialModelShow();
        deliveryPlanId = $(this).data('id');
        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetDeliveryPlan", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), DeliveryPlanId: deliveryPlanId }, EditDeliveryPlanSuccess, null);
    });

    $(document).on('click', '#DeliveryPlanTable .btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var deliveryPlanId = $(this).data('id');
            Common.ajaxCall("GET", "/Productions/DeleteDeliveryPlan", { DeliveryPlanId: deliveryPlanId }, SaveSuccess, null);
        }
    });

    $(document).on('click', '#dynamicDistributor .DynrowRemoveDistributor', function () {
        var currentRow = $(this).closest("tr");

        if (currentRow.hasClass('deliveryPlanRow')) {
            var LengthOfRow = $('#dynamicDistributor .deliveryPlanRow').length;
            if (LengthOfRow > 1) {
                var extraRows = currentRow.nextUntil('.deliveryPlanRow', '.ExtraDeliveryPlanRow');
                extraRows.remove();
                currentRow.remove();

                let NoOfDistributorVal = $('.deliveryPlanRow').length;
                $('#NoOfDistributor').val(NoOfDistributorVal);

                let NoOfProductVal = $('#dynamicDistributor').find('.productId').length;
                $('#NoOfProducts').val(NoOfProductVal);
            }
        } else
            currentRow.remove();

        QuantityVal();
        ExpensePaise();
    });

    $(document).on('click', '#ExtraDeliveryPlanRow .DynrowRemoveDistributor', function () {
        var currentRow = $(this).closest("tr");
        currentRow.remove();

        let NoOfDistributorVal = $('.deliveryPlanRow').length;
        $('#NoOfDistributor').val(NoOfDistributorVal);

        let NoOfProductVal = $('#dynamicDistributor').find('.productId').length;
        $('#NoOfProducts').val(NoOfProductVal);

        QuantityVal();
        ExpensePaise();
    });

    $(document).on('click', '.DynrowRemoveExpense', function () {
        var currentRow = $(this).closest('.MainDivExpenseDyanmic');
        var totalRows = $('.MainDivExpenseDyanmic').length;

        if (totalRows > 1) {
            currentRow.remove();

            var remainingRows = $('.MainDivExpenseDyanmic');
            remainingRows.each(function (index) {
                if (index === 0) {
                    $(this).find('label').removeClass('d-none');
                    $(this).find('#DynamicExpenseRemoveDiv').attr('style', 'margin-top:20px');
                } else {
                    $(this).find('label').addClass('d-none');
                    $(this).find('#DynamicExpenseRemoveDiv').attr('style', 'margin-top:3px');
                }
            });
            ShowOrHideAmountDiv();
            ExpensePaise();
        }
    });

    $(document).on('click', '.navbar-tab', function () {

        titleForHeaderDeliveryTab = $(this).text().trim().replace(/\s*\(\d+\)$/, '');

        $(this).each(function () {
            if ($(this).text().trim().replace(/\s*\(\d+\)$/, '') === titleForHeaderDeliveryTab) {
                $(this).addClass('active');
            }
            else if ($(this).text().trim() === titleForHeaderDeliveryTab) {

            }
        });
    });

    $(document).on('click', '#DyanmicRowAdd', function () {
        if (titleForHeaderDeliveryTab == "Distributor Mapping") {
            DeliveryPlanDynamic();
        } else if (titleForHeaderDeliveryTab == "Expense Mapping") {
            ExpenseDynamic();
        }
    });
});

function DeliveryPlanSuccess(response) {
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

        var columns = Common.bindColumn(data[1], ['DeliveryPlanId']);
        Common.bindTableForNoStatus('DeliveryPlanTable', data[1], columns, -1, 'DeliveryPlanId', '330px', true, access);
    }
}

function EditDeliveryPlanSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        // Set DPD date
        let rawDate = data[0][0].DeliveryPlanDate;
        let parts = rawDate.split('-');
        let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        $('#DeliveryPlanDate').val(formattedDate);

        $('#ToFranchiseId').val(data[0][0].ToFranchiseId);
        $('#TotalBalancePET').val(data[0][0].TotalQty_PET || '0.00');
        $('#TotalBalanceRGB').val(data[0][0].TotalQty_RGB || '0.00');
        $('#NoOfProducts').val(data[0][0].NoOfProducts || '0.00');
        $('#NoOfDistributor').val(data[0][0].NoOfDistributor || '0.00');
        $('#Route').val(data[0][0].TransportRoute);

        let groupedData = {};
        $('#dynamicDistributor').empty();

        // 1. Group by DistributorId
        data[1].forEach(item => {
            let distributorId = item.DistributorId;
            if (!groupedData[distributorId]) {
                groupedData[distributorId] = [];
            }
            groupedData[distributorId].push(item);
        });

        // 2. Iterate over grouped records and generate rows
        for (let distributorId in groupedData) {
            let records = groupedData[distributorId];

            records.forEach((item, index) => {
                let unique = Math.random().toString(36).substring(2); // generate unique ID
                let html = '';

                var defaultOption = '<option value="">--Select--</option>';
                if (UnitDDArray.length > 0 && UnitDDArray[0]) {
                    UnitSelectOptions = UnitDDArray[0].map(val => {
                        const selected = val.UnitId == item.UnitId ? 'selected' : '';
                        return `<option value="${val.UnitId}" ${selected}>${val.UnitName}</option>`;
                    }).join('');
                }
                if (ProductDDArray.length > 0 && ProductDDArray[0]) {
                    ProductSelectOptions = ProductDDArray[0].map(val => {
                        const selected = val.ProductId == item.ProductId ? 'selected' : '';
                        return `<option value="${val.ProductId}" ${selected}>${val.ProductName}</option>`;
                    }).join('');
                }
                if (DistributorDDArray.length > 0 && DistributorDDArray[0]) {
                    DistributorSelectOptions = DistributorDDArray[0].map(val => {
                        const selected = val.DistributorId == item.DistributorId ? 'selected' : '';
                        return `<option value="${val.DistributorId}" ${selected}>${val.DistributorName}</option>`;
                    }).join('');
                }

                if (index === 0) {
                    // First record - use html1
                    html = `
                <tr class="deliveryPlanRow" data-id="${item.DeliveryPlanDistributorMappingId}">
                    <td class="d-none">
                        <input type="text" class="form-control productCategoryName" id="ProductCategoryName${unique}" name="ProductCategoryName${unique}" value="${item.ProductCategoryName}" placeholder="ProductCategoryName">
                    </td>
                    <td>
                        <select class="form-control distributorId" id="DistributorId${unique}" name="DistributorId${unique}" required>
                            ${defaultOption}${DistributorSelectOptions}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control mydatetimepicker deliveryTime" id="DeliveryTime${unique}" name="DeliveryTime${unique}" required placeholder="Delivery Time" value="${item.DeliveryTime}" style="background-color: #ffffff;" readonly>
                    </td>
                    <td>
                        <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required disabled>
                            ${defaultOption}${ProductSelectOptions}
                        </select>
                    </td>
                    <td>
                        <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required>
                            ${defaultOption}${UnitSelectOptions}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control poquantity" id="PoQuantity${unique}" name="PoQuantity${unique}" value="${item.UnitId == 3 ? item.SecondaryPOQuantity : item.PrimaryPOQuantity}" placeholder="PO-Quantity" disabled>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control primaryPOQuantity" id="PrimaryPOQuantity${unique}" name="PrimaryPOQuantity${unique}" value="${item.PrimaryPOQuantity}" placeholder="PrimaryPOQuantity" disabled>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control secondaryPOQuantity" id="SecondaryPOQuantity${unique}" name="SecondaryPOQuantity${unique}" value="${item.SecondaryPOQuantity}" placeholder="SecondaryPOQuantity" disabled>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control primaryQuantity" id="PrimaryPOQuantity${unique}" name="PrimaryPOQuantity${unique}" value="${item.PrimaryQuantity}" placeholder="PrimaryPOQuantity" disabled>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control secondaryQuantity" id="SecondaryPOQuantity${unique}" name="SecondaryPOQuantity${unique}" value="${item.SecondaryQuantity}" placeholder="SecondaryPOQuantity" disabled>
                    </td>
                    <td>
                        <input type="text" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" placeholder="Quantity" value="${item.UnitId == 3 ? (item.SecondaryQuantity ?? '') : (item.PrimaryQuantity ?? '')}"  required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)">
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control ConvertionVal" id="ConvertionVal${unique}" name="ConvertionVal${unique}" placeholder="ConvertionVal" value="${item.ConvertionValues}" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)">
                    </td>
                    <td class="d-flex justify-content-center">
                        <button id="RemoveButton" class="btn btn-danger DynrowRemoveDistributor text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;border: none;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
                `;
                } else {
                    // Additional record - use html2
                    html = `
                <tr class="ExtraDeliveryPlanRow" data-id="${item.DeliveryPlanDistributorMappingId}">
                    <td class="d-none">
                        <select class="form-control distributorId" id="distributorId${unique}" name="distributorId${unique}">
                            ${defaultOption}${DistributorSelectOptions}
                        </select>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control mydatetimepicker deliveryTime" id="DeliveryTime${unique}" name="DeliveryTime${unique}" value="${item.DeliveryTime}" placeholder="Delivery Time" style="background-color: #ffffff;" readonly>
                    </td>
                    <td></td>
                    <td></td>
                    <td class="d-none">
                        <input type="text" class="form-control productCategoryName" id="ProductCategoryName${unique}" name="ProductCategoryName${unique}" value="${item.ProductCategoryName}" placeholder="ProductCategoryName">
                    </td>
                    <td>
                        <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required disabled>
                            ${defaultOption}${ProductSelectOptions}
                        </select>
                    </td>
                    <td>
                        <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required>
                            ${defaultOption}${UnitSelectOptions}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control poquantity" id="PoQuantity${unique}" name="PoQuantity${unique}" value="${item.UnitId == 3 ? item.SecondaryPOQuantity : item.PrimaryPOQuantity}" placeholder="PO-Quantity" disabled>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control primaryPOQuantity" id="PrimaryPOQuantity${unique}" name="PrimaryPOQuantity${unique}" value="${item.PrimaryPOQuantity}" placeholder="PrimaryPOQuantity" disabled>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control secondaryPOQuantity" id="SecondaryPOQuantity${unique}" name="SecondaryPOQuantity${unique}" value="${item.SecondaryPOQuantity}" placeholder="SecondaryPOQuantity" disabled>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control primaryPOQuantity" id="PrimaryPOQuantity${unique}" name="PrimaryPOQuantity${unique}" value="${item.PrimaryQuantity}" placeholder="PrimaryPOQuantity" disabled>
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control secondaryPOQuantity" id="SecondaryPOQuantity${unique}" name="SecondaryPOQuantity${unique}" value="${item.SecondaryQuantity}" placeholder="SecondaryPOQuantity" disabled>
                    </td>
                    <td>
                        <input type="text" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" placeholder="Quantity" value="${item.UnitId == 3 ? (item.SecondaryQuantity ?? '') : (item.PrimaryQuantity ?? '')}" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)">
                    </td>
                    <td class="d-none">
                        <input type="text" class="form-control ConvertionVal" id="ConvertionVal${unique}" name="ConvertionVal${unique}" placeholder="ConvertionVal" value="${item.ConvertionValues}" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)">
                    </td>
                    <td class="d-flex justify-content-center">
                        <button id="RemoveButton" class="btn btn-danger DynrowRemoveDistributor text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;border: none;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
                `;
                }

                // Finally, append to your table
                $('#dynamicDistributor').append(html);
                $('.mydatetimepicker').mdtimepicker();

            });
            QuantityVal();
            ExpensePaise();
        }

        $('.ExpenseDetails .MainDivExpenseDyanmic').remove();
        if (data[2][0].DeliveryPlanExpenseMappingId != null && data[2][0].DeliveryPlanExpenseMappingId != "") {
            var htmlExpenseMapping = "";
            $.each(data[2], function (index, ExpenseMapping) {
                let unique = Math.random().toString(36).substring(2);
                htmlExpenseMapping += `
                    <div class="row MainDivExpenseDyanmic">
                        <lable class="DeliveryPlanExpenseMappingId d-none">${ExpenseMapping.DeliveryPlanExpenseMappingId}</lable>
                        <div class="col-lg-7 col-md-6 col-sm-4 col-4" id="DynamicExpenseNameDiv">
                            <div class="form-group">
                                <label class="${index == 0 ? '' : 'd-none'}">Expense Name</label>
                                <input type="text" id="ExpenseName${unique}" name="ExpenseName${unique}" class="form-control ExpenseName" value="${ExpenseMapping.ExpenseName || ''}" placeholder="Ex: Fuel" oninput="Common.allowOnlyTextLength(this,50)">
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-4 col-4" id="DynamicExpenseAmountDiv">
                            <div class="form-group">
                                <label class="${index == 0 ? '' : 'd-none'}">Expense Amount</label>
                                <input type="text" id="ExpenseAmount${unique}" name="ExpenseAmount${unique}" class="form-control ExpenseAmount" placeholder="Ex: 110.12" value="${ExpenseMapping.ExpenseAmount || ''}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)">
                            </div>
                        </div>
                        <div class="col-lg-1 col-md-6 col-sm-4 col-4 p-0" id="DynamicExpenseRemoveDiv" style="${index == 0 ? 'margin-top:20px' : 'margin-top:3px'}">
                            <button id="RemoveButton" class="btn btn-danger DynrowRemoveExpense text-white" type="button" style="margin-left:-4px;margin-top:0px;height: 30px;width: 30px;border: none;">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `;

                if (ExpenseMapping.TotalAmount == null)
                    ExpenseMapping.TotalAmount = 0.00;
                $('.Amount').text('₹ ' + ExpenseMapping.TotalAmount.toFixed(2) + ' /-');

                if (ExpenseMapping.PerBottleCost == null)
                    ExpenseMapping.PerBottleCost = 0.00;
                $('#PerBottleCost').val('₹ ' + ExpenseMapping.PerBottleCost.toFixed(2) + ' /-');
            });
            $('.ExpenseDetails').append(htmlExpenseMapping);
        }
        else
            ExpenseDynamic();

        QuantityVal();
        ExpensePaise();
    }
}

function SaveSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#DeliveryPlanModal').hide();
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
    Common.ajaxCall("GET", "/Productions/GetDeliveryPlan", { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, DeliveryPlanId: null }, DeliveryPlanSuccess, null);
}

function DeliveryPlanDynamic() {
    let unique = Math.random().toString(36).substring(2);

    var DistributorSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';
    if (DistributorDDArray != null && DistributorDDArray.length > 0 && DistributorDDArray[0].length > 0) {
        DistributorSelectOptions = DistributorDDArray[0].map(function (DistributorId) {
            return `<option value="${DistributorId.DistributorId}">${DistributorId.DistributorName}</option>`;
        }).join('');
    }

    var ProductSelectOptions = "";
    if (ProductDDArray != null && ProductDDArray.length > 0 && ProductDDArray[0].length > 0) {
        ProductSelectOptions = ProductDDArray[0].map(function (ProductId) {
            return `<option value="${ProductId.ProductId}">${ProductId.ProductName}</option>`;
        }).join('');
    }

    var UnitSelectOptions = "";
    if (UnitDDArray != null && UnitDDArray.length > 0 && UnitDDArray[0].length > 0) {
        UnitSelectOptions = UnitDDArray[0].map(function (UnitId) {
            return `<option value="${UnitId.UnitId}">${UnitId.UnitName}</option>`;
        }).join('');
    }

    var html = `
    <tr class="deliveryPlanRow" data-id="">
        <td class="d-none">
            <input type="text" class="form-control productCategoryName" id="ProductCategoryName${unique}" name="ProductCategoryName${unique}" placeholder="PO-Quantity" disabled>
        </td>
        <td>
            <select class="form-control distributorId" id="DistributorId${unique}" name="DistributorId${unique}" required>
                ${defaultOption}${DistributorSelectOptions}
            </select>
        </td>
        <td>
            <input type="text" class="form-control mydatetimepicker deliveryTime" id="DeliveryTime${unique}" name="DeliveryTime${unique}" required placeholder="Delivery Time" style="background-color: #ffffff;" readonly>
        </td>
        <td>
            <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required disabled>
                ${defaultOption}${ProductSelectOptions}
            </select>
        </td>
        <td>
            <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required>
                ${defaultOption}${UnitSelectOptions}
            </select>
        </td>
        <td>
            <input type="text" class="form-control poquantity" id="PoQuantity${unique}" name="PoQuantity${unique}" placeholder="PO-Quantity" disabled>
        </td>
        <td class="d-none">
            <input type="text" class="form-control primaryPOQuantity" id="PrimaryPOQuantity${unique}" name="PrimaryPOQuantity${unique}" placeholder="PrimaryPOQuantity" disabled>
        </td>
        <td class="d-none">
            <input type="text" class="form-control secondaryPOQuantity" id="SecondaryPOQuantity${unique}" name="SecondaryPOQuantity${unique}" placeholder="SecondaryPOQuantity" disabled>
        </td>
        <td>
            <input type="text" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" placeholder="Quantity" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)">
        </td>
        <td class="d-none">
            <input type="text" class="form-control ConvertionVal" id="ConvertionVal${unique}" name="ConvertionVal${unique}" placeholder="ConvertionVal" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)">
        </td>
        <td class="d-flex justify-content-center">
            <button id="RemoveButton" class="btn btn-danger DynrowRemoveDistributor text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;border: none;">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    </tr>
    `;

    $('#dynamicDistributor').append(html);
    $('.mydatetimepicker').mdtimepicker();
}

function ExpenseDynamic() {
    let unique = Math.random().toString(36).substring(2);
    var LengthOfRow = $('.MainDivExpenseDyanmic').length;
    var html = `
        <div class="row MainDivExpenseDyanmic">
            <lable class="DeliveryPlanExpenseMappingId d-none"></lable>
            <div class="col-lg-7 col-md-6 col-sm-4 col-4" id="DynamicExpenseNameDiv">
                <div class="form-group">
                    <label class="${LengthOfRow == 0 ? '' : 'd-none'}">Expense Name</label>
                    <input type="text" id="ExpenseName${unique}" name="ExpenseName${unique}" class="form-control ExpenseName" placeholder="Ex: Fuel" oninput="Common.allowOnlyTextLength(this,50)">
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-4 col-4" id="DynamicExpenseAmountDiv">
                <div class="form-group">
                    <label class="${LengthOfRow == 0 ? '' : 'd-none'}">Expense Amount</label>
                    <input type="text" id="ExpenseAmount${unique}" name="ExpenseAmount${unique}" class="form-control ExpenseAmount" placeholder="Ex: 110.12" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)">
                </div>
            </div>
            <div class="col-lg-1 col-md-6 col-sm-4 col-4 p-0" id="DynamicExpenseRemoveDiv" style="${LengthOfRow == 0 ? 'margin-top:20px' : 'margin-top:3px'}">
                <button id="RemoveButton" class="btn btn-danger DynrowRemoveExpense text-white" type="button" style="margin-left:-4px;margin-top:0px;height: 30px;width: 30px;border: none;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `;
    $('.ExpenseDetails').append(html);
}

function ShowOrHideAmountDiv() {
    let showAmountDiv = false;
    let totalExpenseAmount = 0;

    $('.ExpenseDetails .ExpenseAmount').each(function () {
        const val = $(this).val().trim();

        if (val !== '') {
            showAmountDiv = true;
            const numericVal = parseFloat(val);
            if (!isNaN(numericVal)) {
                totalExpenseAmount += numericVal;
            }
        }
    });

    if (showAmountDiv)
        $('#AmountMainDiv').show();
    else
        $('#AmountMainDiv').hide();
    $('.Amount').text('₹ ' + totalExpenseAmount.toFixed(2) + ' /-');
}

function ExpensePaise() {
    var QuatityRGB = parseInt($('#TotalBalanceRGB').val());
    var QuatityPET = parseInt($('#TotalBalancePET').val());

    var QuatityOfDistribution = QuatityRGB + QuatityPET;
    var ExpenseAmount = $('.Amount').text();
    var cleanAmount = ExpenseAmount.replace('₹', '').replace('/-', '').trim();
    var amountValue = parseFloat(cleanAmount);
    var totalCostAmount = parseInt(amountValue) / parseFloat(QuatityOfDistribution);
    if (totalCostAmount === 0 || isNaN(totalCostAmount) || !isFinite(totalCostAmount))
        totalCostAmount = 0.00
    $('#PerBottleCost').val('₹ ' + totalCostAmount.toFixed(2) + ' /-');
}

function QuantityVal() {
    let totalRGB = 0;
    let totalPET = 0;

    $('#dynamicDistributor').find('.ConvertionVal').each(function () {
        const quantityInput = $(this);
        const quantityVal = parseFloat(quantityInput.val().trim());

        if (!isNaN(quantityVal)) {
            const category = quantityInput.closest('tr').find('.productCategoryName').val()?.trim().toUpperCase();

            if (category === 'RGB') {
                totalRGB += quantityVal;
            } else if (category === 'PET') {
                totalPET += quantityVal;
            }
        }
    });

    $('#TotalBalanceRGB').val(totalRGB);
    $('#TotalBalancePET').val(totalPET);
}

function InitialModelShow() {
    $('#DeliveryPlanModal').show();
    $('#Distributor-TabRecord').show();
    $('.ExpenseDetails').hide();
    $('#AmountMainDiv').hide();
    $('.searchbar').show();
    $('#Distributor-RecordFooter').show().removeClass('d-none').addClass('d-flex');
    $('#Expense-RecordFooter').hide().removeClass('d-flex').addClass('d-none');
    $('#DeliveryPlanModal .modal-dialog').removeClass('modal-md').addClass('modal-xl');
    $('#Distributor-TabBtn').removeClass('active').addClass('active');
    $('#DeliveryPlanDateDiv').removeClass('col-lg-6 col-md-6 col-sm-4 col-4').addClass('col-lg-2 col-md-6 col-sm-4 col-4');
    $('#ToFranchiseIdDiv').removeClass('col-lg-6 col-md-6 col-sm-4 col-4').addClass('col-lg-2 col-md-6 col-sm-4 col-4');
    $('#RouteDiv').removeClass('col-lg-12 col-md-6 col-sm-4 col-4').addClass('col-lg-4 col-md-6 col-sm-4 col-4');
    $('#Expense-TabBtn').removeClass('active');
    $('#dynamicDistributor').empty();
    $('.ExpenseDetails .MainDivExpenseDyanmic').remove();
    titleForHeaderDeliveryTab = "Distributor Mapping";
    DeliveryPlanDynamic();
    ExpenseDynamic();
    $('#NoOfDistributor').val('');
    $('#NoOfProducts').val('');
    $('#TotalBalanceRGB').val('');
    $('#TotalBalancePET').val('');
    $('#PerBottleCost').val('');
    $('.Amount').text('₹ 0.00 /-');
}


$(document).on('input', '#tableForPopFilter', function () {
    applyTableFilterForProduction();
});

function applyTableFilterForProduction() {
    let filterValue = $('#tableForPopFilter').val().toLowerCase().trim();
    let visibleRowCount = 0;

    $('#dynamicDistributor .AllProductEmptyRow').remove();

    $('#dynamicDistributor .deliveryPlanRow').each(function () {
        let $row = $(this);
        let DistributorText = $row.find('select.distributorId option:selected').text().toLowerCase();
        let DeliveryTime = $(this).find('input.deliveryTime').val()?.toLowerCase() || "";

        let isVisible = DistributorText.includes(filterValue) || DeliveryTime.includes(filterValue);
        $row.toggle(isVisible);

        // Toggle the related QC rows (until the next productionRow)
        let $relatedQCRows = $row.nextUntil('.productionRow', '.ExtraDeliveryPlanRow');
        $relatedQCRows.toggle(isVisible);

        if (isVisible) {
            visibleRowCount++;
        }
    });

    if (visibleRowCount === 0) {
        $('#dynamicDistributor').append(`
            <tr class="AllProductEmptyRow">
                <td colspan="7" class="text-center text-danger">No matching products found.</td>
            </tr>
        `);
    }
}