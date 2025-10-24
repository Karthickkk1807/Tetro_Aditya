var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
var TextTabNameFilter = "";
var titleForHeaderProductTab = "";
var PrimaryUnitSecondaryUnitDropDown = [];
var manageStockId = 0;

$(document).ready(async function () {

    titleForHeaderProductTab = "Raw Material";
    TextTabNameFilter = "Raw Materials";

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Inventory/GetManageStock", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) }, ManageStockSuccess, null);
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        $('#increment-month-btn2').show();
        displayedDate = new Date(currentYear, currentMonth);

        updateMonthDisplay(displayedDate);
        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Inventory/GetManageStock", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) }, ManageStockSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Inventory/GetManageStock", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) }, ManageStockSuccess, null);
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
            Common.ajaxCall("GET", "/Inventory/GetManageStock", { FranchiseId: FranchiseMappingId, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) }, ManageStockSuccess, null);
        }
    });

    Common.bindDropDownParent('ToFranchiseId', 'FormManageStock', 'Plant');
    Common.bindDropDownParent('StoreInchangeId', 'FormManageStock', 'StoreIncharge');

    var UnitDropDownData = await Common.bindDropDownSync('ProductId_ByUnitPrimary_ByUnitSecondary');
    PrimaryUnitSecondaryUnitDropDown = JSON.parse(UnitDropDownData);

    var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    //var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Inventory/GetManageStock", { FranchiseId: FranchiseMappingId, FromDate: startDate.toISOString(), ToDate: endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) }, ManageStockSuccess, null);

    $('#RawNoOfProductsDiv').hide();
    $('#FinishedNoOfProductsDiv').hide();
    $('#TransitNoOfProductsDiv').hide();
    $('#OthersNoOfProductsDiv').hide();

    $('#AddManagaStock').click(function () {
        $('#ManageStockModal').show();
        $('#dynamicRawMaterial').empty("");
        $('#dynamicFinishedProduct').empty("");
        $('#dynamicOtherProduct').empty("");
        $('#NoOfProducts,#DifferentStock').val("");
        $('#editCounterbox').hide();
        $('#addStockBtn').click();
        $('#ManageStockModalText').text('Add ManageStock');
        Common.removevalidation('FormManageStock');
        TextTabNameFilter = "Raw Materials";
        $('#tableForPopFilter').val('').trigger('input');
        $('#Finished-Tab').hide();
        $('#Transit-Tab').hide();
        $('#Others-Tab').hide();
       
        $('#RawMaterials-Tab').show();
        $('.navbar-tab').removeClass('active');
        $('#Finished-TabBtn').removeClass('active');
        $('#Transit-Tab').removeClass('active');
        $('#Others-TabBtn').removeClass('active');
        $('#RawMaterials-TabBtn').addClass('active');
        $('#RawNoOfProductsDiv').show();
        $('#FinishedNoOfProductsDiv').hide();
        $('#TransitNoOfProductsDiv').hide();
        $('#OthersNoOfProductsDiv').hide();
        manageStockId = 0;
        $('#SaveManageStock').val('Save').removeClass('btn btn-primary').addClass('btn btn-success');
        var today = new Date().toISOString().split('T')[0];
        $("#ManageStockDate").val(today);
        //$("#ManageStockDate").attr("max", today);
        //var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        $('#ToFranchiseId').val(null).trigger('change');
        HideShowColumns();
    });

    $(document).on('click', '#myTabMain .navbar-tab', function () {

        titleForHeaderProductTab = $(this).text().trim();
        $('.navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderProductTab) {
                $(this).addClass('active');
            }
        });
        if (titleForHeaderProductTab == "Raw Material") {
            $('#ManageStockDynamic').empty('');
            var html = `<div class="col-sm-12 p-0">
                            <div class="table-responsive">
                                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ManageStockTable">
                                </table>
                            </div>
                        </div>`;
            $('#ManageStockDynamic').append(html);
            var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

            //var fnData = Common.getDateFilter('dateDisplay2');
            //Common.ajaxCall("GET", "/Inventory/GetManageStock", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) }, ManageStockSuccess, null);
            var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            Common.ajaxCall("GET", "/Inventory/GetManageStock", { FranchiseId: FranchiseMappingId, FromDate: startDate.toISOString(), ToDate: endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) }, ManageStockSuccess, null);

        }
        else if (titleForHeaderProductTab == "Finished Product") {
            $('#ManageStockDynamic').empty('');
            var html = `<div class="col-sm-12 p-0">
                            <div class="table-responsive">
                                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ManageStockTable">
                                </table>
                            </div>
                     </div>`;
            $('#ManageStockDynamic').append(html);
            var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

            //var fnData = Common.getDateFilter('dateDisplay2');
            //Common.ajaxCall("GET", "/Inventory/GetManageStock", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(2) }, ManageStockSuccess, null);
            var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            Common.ajaxCall("GET", "/Inventory/GetManageStock", { FranchiseId: FranchiseMappingId, FromDate: startDate.toISOString(), ToDate: endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(2) }, ManageStockSuccess, null);

        } 
        
    });

    $('#ManageStockClose').click(function () {
        $('#ManageStockModal').hide();
        $('#myTabMain.nav-tabs .navbar-tab').removeClass('active');
        $('#myTabMain.nav-tabs .navbar-tab').each(function () {
            if ($(this).text().trim() === titleForHeaderProductTab) {
                $(this).addClass('active');
            }
        });
    });

    $(document).on('click', '#dynamicRawMaterial .DynrowRemove', function () {
        let rows = $("#dynamicRawMaterial .stockRow");
        if (rows.length > 1) {
            $(this).closest('.stockRow').remove();
        }
        var lengthVal = $('#dynamicRawMaterial .stockRow').length;
        $('#RawMaterials-Tab #RawNoOfProducts').val(lengthVal);
    });

    $(document).on('click', '#dynamicFinishedProduct .DynrowRemove', function () {
        let rows = $("#dynamicFinishedProduct .stockRow");
        if (rows.length > 1) {
            $(this).closest('.stockRow').remove();
        }
        var lengthVal = $('#dynamicFinishedProduct .stockRow').length;
        $('#Finished-Tab #FinishedNoOfProducts').val(lengthVal);
    });

    $(document).on('click', '#dynamicOtherProduct .DynrowRemove', function () {
        let rows = $("#dynamicOtherProduct .stockRow");
        if (rows.length > 1) {
            $(this).closest('.stockRow').remove();
        }
        var lengthVal = $('#dynamicOtherProduct .stockRow').length;
        $('#Others-Tab #OthersNoOfProducts').val(lengthVal);
    });


    $(document).on('change', '#ToFranchiseId', function () {
        $('#loader-pms').show();
        $('#dynamicRawMaterial, #dynamicFinishedProduct, #dynamicTransitProduct,#dynamicOtherProduct').empty();
        $('#RawNoOfProducts').val(0);

        let rawCount = 0;
        const defaultOption = '<option value="">--Select--</option>';
        const franchiseId = Common.parseInputValue('ToFranchiseId');

        Common.ajaxCall("GET", "/Inventory/GetMaterialsData", { FranchiseId: franchiseId }, async function (response) {
            if (!response.status) {
                $('#loader-pms').hide();
                alert("No data received.");
                return;
            }

            const data = JSON.parse(response.data); // data[0], data[1], data[2]
            var unitdata = PrimaryUnitSecondaryUnitDropDown[0];
            var optionVal = ``;
            // Helper to fetch unit options
            function getUnitOptions(item) {
                return new Promise(resolve => {
                    let optionVal = '';

                    // ✅ If no product selected yet
                    if (!item || !item.ProductId) {
                        optionVal = `<option value="">-- Select Unit --</option>`;
                        resolve(optionVal);
                        return;
                    }

                    // ✅ Find matching unit from unitdata
                    const matchedUnit = unitdata.find(unit => unit.ProductId === item.ProductId);

                    if (!matchedUnit) {
                        // If product doesn’t have unit mapping
                        optionVal = `<option value="">-- No Units Available --</option>`;
                        resolve(optionVal);
                        return;
                    }

                    // ✅ Build options with proper "selected" based on UnitId, not ProductId
                    optionVal = `
                        <option value="${matchedUnit.PrimaryUnitId}" ${item.UnitId === matchedUnit.PrimaryUnitId ? 'selected' : ''}>${matchedUnit.PrimaryUnitName}</option>
                        <option value="${matchedUnit.SecondaryUnitId}" ${item.UnitId === matchedUnit.SecondaryUnitId ? 'selected' : ''}>${matchedUnit.SecondaryUnitName}</option>
                    `;

                    resolve(optionVal);
                });
            }

            // Bind row using awaited unitOptions
            async function bindRow(item, targetSelector, showTypeColumn = false) {
                const unique = Math.random().toString(36).substring(2);
                const unitOptions = await getUnitOptions(item);

                const html = `
                <tr class="stockRow" data-id="">
                    ${showTypeColumn ? `<td class="type-cell" style="text-align: center; vertical-align: middle;">${item.Type}</td>` : ''}
                    <td><input type="text" class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" data-id="${item.ProductId}" value="${item.ProductName || ''}" placeholder="Product" disabled></td>
                    <td><select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required disabled>${unitOptions}</select></td>
                    <td class="manageStockRaw SystemstockRow"><input type="text" class="form-control systemStock" id="SystemStock${unique}" name="SystemStock${unique}" value="${item.SystemStock !== null && item.SystemStock !== undefined ? item.SystemStock : ''}" disabled></td>
                    <td class="manageStockFinished PrimarySystemstockRow d-none"><input type="text" class="form-control PrimarysystemStock" id="PrimarySystemStock${unique}" name="PrimarySystemStock${unique}" value="${item.PrimaryUnitStock !== null && item.PrimaryUnitStock !== undefined ? item.PrimaryUnitStock : ''}" disabled></td>
                    <td class="manageStockFinished SecondarySystemstockRow d-none"><input type="text" class="form-control secondarysystemStock" id="secondarysystemStock${unique}" name="secondarysystemStock${unique}" value="${item.SystemStock !== null && item.SystemStock !== undefined ? item.SystemStock : ''}" disabled></td>
                    <td class="manageStockFinished SecondaryUnitValueRow d-none"><input type="text" class="form-control secondaryUnitValue" id="secondaryUnitValue${unique}" name="secondaryUnitValue${unique}" value="${item.SecondaryUnitValue !== null && item.SecondaryUnitValue !== undefined ? item.SecondaryUnitValue : ''}" disabled></td>
                    <td><input type="text" class="form-control manualStock" id="ManualStock${unique}" name="ManualStock${unique}" placeholder="Manual Stock" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 7)"></td>
                    <td class="manageStockRaw diffstockRow"><input type="text" class="form-control totalDiff" id="TotalDiff${unique}" name="TotalDiff${unique}" placeholder="Diff Values" disabled></td>
                </tr>`;

                $(targetSelector).append(html);
                if (targetSelector === '#dynamicRawMaterial') rawCount++;
            }

            // Sequentially bind all products in order
            for (const item of data[0]) {
                await bindRow(item, '#dynamicRawMaterial');
            }
            for (const item of data[1]) {
                await bindRow(item, '#dynamicFinishedProduct', true);
            }
            for (const item of data[2]) {
                await bindRow(item, '#dynamicTransitProduct');
            }
            for (const item of data[3]) {
                await bindRow(item, '#dynamicOtherProduct');
            }

            $('#RawNoOfProducts').val(rawCount);
            $('#loader-pms').hide();
        });
    });

    $(document).on('change', '.unitId', function () {
        var $row = $(this).closest('tr');

        var selectedIndex = $(this).prop('selectedIndex');

        var primaryStock = $row.find('.PrimarysystemStock').val();
        var secondaryStock = $row.find('.secondarysystemStock').val();

        if (selectedIndex === 0) {
            $row.find('.systemStock').val(primaryStock);
        } else if (selectedIndex === 1) {
            var formattedStock = $row.find('.systemStock').val(secondaryStock);
            formattedStock = parseFloat(secondaryStock);
            if (formattedStock % 1 === 0) {
                // It's a whole number
                formattedStock = parseInt(formattedStock);
            }
            $row.find('.systemStock').val(formattedStock);
        } else {
            $row.find('.systemStock').val('');
        }
        $row.find('.manualStock').val('');
        $row.find('.totalDiff').val('');
    });


    $(document).on('click', '#ManageStockTable .btn-edit', function () {
        var ManageStockId = $(this).data('id');
        $('#loader-pms').show();
        $('#dynamicRawMaterial').empty("");
        $('#dynamicFinishedProduct').empty("");
        $('#dynamicTransitProduct').empty("");
        $('#editCounterbox').hide();
        $('#ManageStockModalText').text('ManageStock Info');
        Common.removevalidation('FormManageStock');
        TextTabNameFilter = "Raw Materials";
        $('#tableForPopFilter').val('').trigger('input');
        $('#Finished-Tab').hide();
        $('#Transit-Tab').hide();
        $('#Others-Tab').hide();
        $('#RawMaterials-Tab').show();
        $('#SaveManageStock').val('Update').removeClass('btn btn-success').addClass('btn btn-primary');
        $('.navbar-tab').removeClass('active');
        $('#Finished-TabBtn').removeClass('active');
        $('#Transit-Tab').removeClass('active');
        $('#Others-TabBtn').removeClass('active');
        $('#RawMaterials-TabBtn').addClass('active');
        $('#RawNoOfProductsDiv').show();
        $('#FinishedNoOfProductsDiv').hide();
        $('#TransitNoOfProductsDiv').hide();
        $('#OthersNoOfProductsDiv').hide();
        $('#OthersNoOfProducts').hide();
        var dateText = $(this).closest("tr").find("td:first").text().trim();
        //var dateText = $(this).closest("tr").find("td:eq(1)").text().trim();

        var parts = dateText.split("-");
        var formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);

        var PassingData = {};
        if (titleForHeaderProductTab == "Raw Material") {
            PassingData = { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, ManageStockId: parseInt(ManageStockId), ProductTypeId: parseInt(1) }
        } else if (titleForHeaderProductTab == "Finished Product") {
            PassingData = { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, ManageStockId: parseInt(ManageStockId), ProductTypeId: parseInt(2) }
        } else if (titleForHeaderProductTab == "Transit") {
            PassingData = { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, ManageStockId: parseInt(ManageStockId), ProductTypeId: parseInt(3) }
        } else if (titleForHeaderProductTab == "Others") {
            PassingData = { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, ManageStockId: parseInt(ManageStockId), ProductTypeId: parseInt(4) }
        }

        Common.ajaxCall("GET", "/Inventory/GetManageStock", PassingData, EditSuccess, null);
    });

    $('#SaveManageStock').click(function () {

        var hasValidManualStock = false;
        $('.manualStock').each(function () {
            var val = $(this).val().trim();
            if (val !== '' && parseFloat(val) !== 0) {
                hasValidManualStock = true;
                return false; // break loop
            }
        });

        if ($('#FormManageStock').valid()/* && isValid*/) {

            if (!hasValidManualStock) {
                Common.warningMsg("Please fill at least one Manual Stock field before Submitting.");
                return;
            }

            var objvalue = {};
            $('#stockError').hide();
            var StoreInchangeId = $('#StoreInchangeId').val();
            objvalue.ManageStockId = manageStockId == 0 ? null : manageStockId;
            objvalue.ManageStockDate = Common.stringToDateTime('ManageStockDate');
            objvalue.FromFranchiseId = FranchiseMappingId;
            objvalue.ToFranchiseId = Common.parseInputValue('ToFranchiseId');
            objvalue.InchargeId = parseInt(StoreInchangeId);

            var manageStockProductMappingDetails = [];

            var parentRows = $('#dynamicRawMaterial .stockRow');
            $.each(parentRows, function (index, parentRow) {
                var manageStockProductMappingId = $(this).attr('data-id');
                var productId = $(parentRow).find('.productId').attr('data-id');
                var unitId = $(parentRow).find('.unitId').val();
                var productTypeId = 1;
                var systemStock = $(parentRow).find('.systemStock').val() || 0;
                var manualStock = $(parentRow).find('.manualStock').val() || 0;
                var diffStock = $(parentRow).find('.totalDiff').val() || 0;
                if (manualStock === "" || manualStock === null || isNaN(manualStock)) {
                    return;
                }
                manageStockProductMappingDetails.push({
                    ManageStockProductMappingId: manageStockProductMappingId == "" ? null : parseInt(manageStockProductMappingId),
                    ProductId: parseInt(productId),
                    UnitId: parseInt(unitId),
                    ProductTypeId: productTypeId,
                    SystemStock: parseFloat(systemStock),
                    ManualStock: parseFloat(manualStock),
                    DiffStock: parseFloat(diffStock),
                    ManageStockId: manageStockId == 0 ? null : manageStockId,
                });
            });

            var parentRows = $('#dynamicFinishedProduct .stockRow');
            $.each(parentRows, function (index, parentRow) {
                var manageStockProductMappingId = $(this).attr('data-id');
                var productId = $(parentRow).find('.productId').attr('data-id');
                var unitId = $(parentRow).find('.unitId').val();
                var productTypeId = 2;
                var systemStock = $(parentRow).find('.systemStock').val() || 0;
                var manualStock = $(parentRow).find('.manualStock').val() || 0;
                var diffStock = $(parentRow).find('.totalDiff').val() || 0;
                if (manualStock === "" || manualStock === null || isNaN(manualStock)) {
                    return;
                }
                manageStockProductMappingDetails.push({
                    ManageStockProductMappingId: manageStockProductMappingId == "" ? null : parseInt(manageStockProductMappingId),
                    ProductId: parseInt(productId),
                    UnitId: parseInt(unitId),
                    ProductTypeId: productTypeId,
                    SystemStock: parseFloat(systemStock),
                    ManualStock: parseFloat(manualStock),
                    DiffStock: parseFloat(diffStock),
                    ManageStockId: manageStockId == 0 ? null : manageStockId,
                });
            });

            var parentRows = $('#dynamicTransitProduct .stockRow');
            $.each(parentRows, function (index, parentRow) {
                var manageStockProductMappingId = $(this).attr('data-id');
                var productId = $(parentRow).find('.productId').attr('data-id');
                var unitId = $(parentRow).find('.unitId').val();
                var productTypeId = 3;
                var systemStock = $(parentRow).find('.systemStock').val() || 0;
                var manualStock = $(parentRow).find('.manualStock').val() || 0;
                var diffStock = $(parentRow).find('.totalDiff').val() || 0;
                if (manualStock === "" || manualStock === null || isNaN(manualStock)) {
                    return;
                }
                manageStockProductMappingDetails.push({
                    ManageStockProductMappingId: manageStockProductMappingId == "" ? null : parseInt(manageStockProductMappingId),
                    ProductId: parseInt(productId),
                    UnitId: parseInt(unitId),
                    ProductTypeId: productTypeId,
                    SystemStock: parseFloat(systemStock),
                    ManualStock: parseFloat(manualStock),
                    DiffStock: parseFloat(diffStock),
                    ManageStockId: manageStockId == 0 ? null : manageStockId,
                });
            });

            var parentRows = $('#dynamicOtherProduct .stockRow');
            $.each(parentRows, function (index, parentRow) {
                var manageStockProductMappingId = $(this).attr('data-id');
                var productId = $(parentRow).find('.productId').attr('data-id');
                var unitId = $(parentRow).find('.unitId').val();
                var productTypeId = 4;
                var systemStock = $(parentRow).find('.systemStock').val() || 0;
                var manualStock = $(parentRow).find('.manualStock').val() || 0;
                var diffStock = $(parentRow).find('.totalDiff').val() || 0;
                if (manualStock === "" || manualStock === null || isNaN(manualStock)) {
                    return;
                }
                manageStockProductMappingDetails.push({
                    ManageStockProductMappingId: manageStockProductMappingId == "" ? null : parseInt(manageStockProductMappingId),
                    ProductId: parseInt(productId),
                    UnitId: parseInt(unitId),
                    ProductTypeId: productTypeId,
                    SystemStock: parseFloat(systemStock),
                    ManualStock: parseFloat(manualStock),
                    DiffStock: parseFloat(diffStock),
                    ManageStockId: manageStockId == 0 ? null : manageStockId,
                });
            });

            objvalue.manageStockProductMappingDetails = manageStockProductMappingDetails;
            Common.ajaxCall("POST", "/Inventory/InsertUpdateManageStock", JSON.stringify(objvalue), SaveSuccess, null);
        }
    });

    $('#RawMaterials-TabBtn').click(function () {
        TextTabNameFilter = "Raw Materials";
        $('#tableForPopFilter').val('').trigger('input');
        $('#RawMaterials-Tab').show();
        $('#Finished-Tab').hide();
        $('#Transit-Tab').hide();
        $('#Others-Tab').hide();
        $('#FinishedNoOfProductsDiv').hide();
        $('#TransitNoOfProductsDiv').hide();
        $('#OthersNoOfProductsDiv').hide();
        $('#RawNoOfProductsDiv').show();

        HideShowColumns();
        updateProductCounts();
    });

    $('#Finished-TabBtn').click(function () {
        TextTabNameFilter = "Finished Products";
        $('#tableForPopFilter').val('').trigger('input');
        $('#Finished-Tab').show();
        $('#Transit-Tab').hide();
        $('#Others-Tab').hide();
        $('#RawMaterials-Tab').hide();
        $('#RawNoOfProductsDiv').hide();
        $('#TransitNoOfProductsDiv').hide();
        $('#OthersNoOfProductsDiv').hide();
        $('#FinishedNoOfProductsDiv').show();

        HideShowColumns();
        updateProductCounts();
    });

    

   

    $(document).on('click', '#ManageStockTable .btn-delete', async function () {
        //var dateText = $(this).closest("tr").find("td:first").text().trim();
        //var parts = dateText.split("-");
        //var formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        var ManageStockId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Inventory/DeleteManageStock", { ManageStockId: parseInt(ManageStockId) }, SaveSuccess, null);
        }
    });
});

function SaveSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#ManageStockModal').hide();
        var text = $('#dropdownMenuButton2').text();
        //var fnData = Common.getDateFilter('dateDisplay2');
        //var fromDate;
        //var toDate;
        //if (text == "Custom") {
        //    fromDate = Common.stringToDateTime('FromDate')
        //    toDate = Common.stringToDateTime('ToDate')
        //} else {
        //    fromDate = fnData.startDate.toISOString()
        //    toDate = fnData.endDate.toISOString()
        //}

        $('#myTabMain.nav-tabs .navbar-tab').removeClass('active');
        $('#myTabMain.nav-tabs .navbar-tab').each(function () {
            if ($(this).text().trim() === titleForHeaderProductTab) {
                $(this).addClass('active');
            }
        });

        let currentDate = new Date();

        var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        //var PassingData = {};
        //if (titleForHeaderProductTab == "Raw Material") {
        //    PassingData = { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, ManageStockDate: null, ProductTypeId: parseInt(1) }
        //} else if (titleForHeaderProductTab == "Finished Product") {
        //    PassingData = { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, ManageStockDate: null, ProductTypeId: parseInt(2) }
        //} else if (titleForHeaderProductTab == "Transit") {
        //    PassingData = { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, ManageStockDate: null, ProductTypeId: parseInt(3) }
        //}
        var PassingData = {};
        if (titleForHeaderProductTab == "Raw Material") {
            PassingData = { FranchiseId: FranchiseMappingId, FromDate: startDate.toISOString(), ToDate: endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(1) }
        } else if (titleForHeaderProductTab == "Finished Product") {
            PassingData = { FranchiseId: FranchiseMappingId, FromDate: startDate.toISOString(), ToDate: endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(2) }
        } else if (titleForHeaderProductTab == "Transit") {
            PassingData = { FranchiseId: FranchiseMappingId, FromDate: startDate.toISOString(), ToDate: endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(3) }
        } else if (titleForHeaderProductTab == "Others") {
            PassingData = { FranchiseId: FranchiseMappingId, FromDate: startDate.toISOString(), ToDate: endDate.toISOString(), ManageStockId: null, ProductTypeId: parseInt(4) }
        }

        Common.ajaxCall("GET", "/Inventory/GetManageStock", PassingData, ManageStockSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

function updateProductCounts() {
    let rawCount = $('#dynamicRawMaterial tr').length;
    let finishedCount = $('#dynamicFinishedProduct tr').length;
    let transitCount = $('#dynamicTransitProduct tr').length;
    let OthersCount = $('#dynamicOtherProduct tr').length;

    $('#RawNoOfProducts').val(rawCount);
    $('#FinishedNoOfProducts').val(finishedCount);
    $('#TransitNoOfProducts').val(transitCount);
    $('#OthersNoOfProducts').val(OthersCount);
}

function calculateRowDifference1($row) {
    let systemStockStr = $row.find('.systemStock').val() || "0";
    let manualStockStr = $row.find('.manualStock').val() || "0";
    let secondaryUnitValue = parseFloat($row.find('.secondaryUnitValue').val()) || 1;

    var selectedIndex = $row.find('.unitId').prop('selectedIndex');

    if (selectedIndex === 1) {
        let [sysPrimary, sysSecondary] = systemStockStr.split('.').map(Number);
        let [manPrimary, manSecondary] = manualStockStr.split('.').map(Number);

        sysPrimary = isNaN(sysPrimary) ? 0 : sysPrimary;
        sysSecondary = isNaN(sysSecondary) ? 0 : sysSecondary;
        manPrimary = isNaN(manPrimary) ? 0 : manPrimary;
        manSecondary = isNaN(manSecondary) ? 0 : manSecondary;

        let systemTotal = (sysPrimary * secondaryUnitValue) + sysSecondary;
        let manualTotal = (manPrimary * secondaryUnitValue) + manSecondary;

        let diff = systemTotal - manualTotal;
        let absDiff = Math.abs(diff);

        let diffPrimary = Math.floor(absDiff / secondaryUnitValue);
        let diffSecondary = (absDiff % secondaryUnitValue).toFixed(4);

        let formatted = `${diff < 0 ? '' : '-'}${diffPrimary}.${diffSecondary.toString().padStart(2, '0')}`;

        $row.find('.totalDiff').val(formatted);
        let color = 'blue';
        if (diff > 0) {
            color = 'red';
        } else if (diff < 0) {
            color = 'green';
        }
        $row.find('.totalDiff').css('color', color);
    } else if (selectedIndex === 2) {
        let difference1 = manualStockStr - systemStockStr;
        let color = 'blue';
        if (difference1 > 0) {
            color = 'red';
        } else if (difference1 < 0) {
            color = 'green';
        }
        $row.find('.totalDiff').val(difference1);
        $row.find('.totalDiff').css('color', color);
    } else {
        $row.find('.totalDiff').val('');
    }
}

function calculateRowDifference($row) {
    let systemStockStr = parseFloat($row.find('.systemStock').val()) || 0;
    let manualStockStr = parseFloat($row.find('.manualStock').val()) || 0;
    let secondaryUnitValue = parseFloat($row.find('.secondaryUnitValue').val());
    var selectedIndex = $row.find('.unitId').prop('selectedIndex');
    let color = 'blue';


    if (selectedIndex === 1) {
        let parts = String(systemStockStr).split('.');
        let systemBeforeDecimal = parseInt(parts[0] || 0, 10);
        let systemAfterDecimal = parseInt(parts[1] || 0, 10);
        let systemBeforeDecimalVal = systemBeforeDecimal * secondaryUnitValue;
        let secondaryValue = systemBeforeDecimalVal + systemAfterDecimal;

        let parts1 = String(manualStockStr).split('.');
        let manualBeforeDecimal = parseInt(parts1[0] || 0, 10);
        let manualAfterDecimal = parseInt(parts1[1] || 0, 10);
        let manualBeforeDecimalVal = manualBeforeDecimal * secondaryUnitValue;
        let manualUnitValue = manualBeforeDecimalVal + manualAfterDecimal;

        let ManualConvertionVal = 0;
        if (secondaryValue < 0) {
            ManualConvertionVal = secondaryValue + manualUnitValue;
        } else {
            ManualConvertionVal = secondaryValue - manualUnitValue;
        }
        let ConvertHowMuch = ManualConvertionVal / secondaryUnitValue;
        let ConvertHowMuchTakeBeforeVal = parseInt(ConvertHowMuch.toString().split('.')[0] || 0, 10);
        let multipliedValue = ConvertHowMuchTakeBeforeVal * secondaryUnitValue;
        let multipliedValSubConvertion = ManualConvertionVal - multipliedValue;
        let absoluteSubValue = Math.abs(multipliedValSubConvertion);
        let totalDiff = 0;

        if (absoluteSubValue == 0)
            totalDiff = `${ConvertHowMuchTakeBeforeVal}.${absoluteSubValue}`;
        else
            totalDiff = `${ConvertHowMuchTakeBeforeVal}`;

        if (manualStockStr != '' && manualStockStr != 0) {
            if (parseFloat(totalDiff) > 0) {
                color = 'green';
            } else if (parseFloat(totalDiff) < 0) {
                color = 'red';
            } else if (manualStockStr == systemStockStr) {
                color = 'blue';
            }
        } else {
            color = 'blue';
        }

        $row.find('.totalDiff').val(totalDiff).css('color', color);

    } else {
        let TotalDiff = 0;
        if (systemStockStr < 0) {
            TotalDiff = systemStockStr + manualStockStr;
        } else {
            TotalDiff = systemStockStr - manualStockStr;
        }
        if (manualStockStr != '' && manualStockStr != 0) {
            if (parseFloat(TotalDiff) > 0) {
                color = 'green';
            } else if (parseFloat(TotalDiff) < 0) {
                color = 'red';
            } else if (manualStockStr == systemStockStr) {
                color = 'blue';
            }
        } else {
            color = 'blue';
        }

        $row.find('.totalDiff').val(TotalDiff).css('color', color);
    }
}

function updateTotalDifferenceSum(containerSelector, outputFieldSelector) {
    let totalSum = 0;
    $(`${containerSelector} .totalDiff`).each(function () {
        totalSum += parseFloat($(this).val()) || 0;
    });
    $(outputFieldSelector).val(totalSum);
}

function bindManualStockHandler(containerSelector, outputFieldSelector) {
    $(document).on('input', `${containerSelector} .manualStock`, function () {
        let $row = $(this).closest('.stockRow');
        calculateRowDifference($row);
        updateTotalDifferenceSum(containerSelector, outputFieldSelector);
    });
}

bindManualStockHandler('#dynamicRawMaterial', '#RawDifferentStock');
bindManualStockHandler('#dynamicFinishedProduct', '#FinishedDifferentStock');
bindManualStockHandler('#dynamicTransitProduct', '#TransitDifferentStock');
bindManualStockHandler('#dynamicOtherProduct', '#OthersDifferentStock');
function ManageStockSuccess(response) {
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

        var columns = Common.bindColumn(data[1], ['Color', 'ManageStockId']);
        var currentUserType = parseInt(userId);
        bindTablePurchase('ManageStockTable', data[1], columns, -1, 'ManageStockId', '300px', true, access, currentUserType);
    }
}
function bindTablePurchase(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access, userType) {
    const isPrivilegedUser = userType === 8 || userType === 145|| userType === 215;

    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }

    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "TetroONEnocount");

    const isTetroONEnocount = data[0]?.hasOwnProperty('TetroONEnocount');
    const hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    // Remove columns for non-privileged users
    if (!isPrivilegedUser) {
        columns = columns.filter(col => col.data !== "SystemStock" && col.data !== "DifferentStock");
    }

    const StatusColumnIndex = columns.findIndex(column => column.data === "DifferentStock");

    let renderColumn = [];

    // Apply color rendering to DifferentStock only for privileged users
    if (isPrivilegedUser && StatusColumnIndex !== -1) {
        renderColumn.push({
            "targets": StatusColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Color != null && row.Color.length > 0) {
                    const dataText = row.DifferentStock;
                    const statusColor = row.Color.toLowerCase();
                    return `<div><span class="ana-span" style="color:${statusColor};font-size: 12px;height: 20px;">${dataText}</span></div>`;
                }
                return data;
            }
        });
    }

    // Add action buttons if user has update/delete access
    if (isAction && data && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });

        renderColumn.push({
            targets: actionTarget,
            render: function (data, type, row, meta) {
                const editCondition = access.update;
                const deleteCondition = access.delete;
                if (editCondition || deleteCondition) {
                    return `
                        ${editCondition ? `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                        ${deleteCondition ? `<i class="btn-delete alert_delete mx-1" data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i>` : ''}`;
                }
                return '';
            }
        });
    }

    // Language setting for small screens
    let lang = {};
    if ($(window).width() <= 575) {
        lang = {
            "paginate": {
                "next": ">",
                "previous": "<"
            }
        };
    }

    // Initialize DataTable
    const table = $('#' + tableid).DataTable({
        "dom": "Bfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !isTetroONEnocount ? data : [],
        "columns": columns,
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "aaSorting": [],
        "scrollCollapse": true,
        "oSearch": { "bSmart": false, "bRegex": true },
        "info": hasValidData,
        "paging": hasValidData,
        "pageLength": 7,
        "lengthMenu": [5, 10, 50],
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "columnDefs": !isTetroONEnocount ? renderColumn : []
    });

    // Search filter
    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    // Adjust column sizes
    setTimeout(function () {
        const table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}

async function EditSuccess(response) {
    if (response.status) {
        const data = JSON.parse(response.data);
        const CounterBox = Object.keys(data[0][0]);

        $('#ManageStockModal').show();
        manageStockId = data[1][0].ManageStockId;

        $('#ToFranchiseId').val(data[1][0].ToFranchiseId);
        $('#StoreInchangeId').val(data[1][0].InchargeId);

        const dateParts = data[1][0].ManageStockDate.split("-");
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        $('#ManageStockDate').val(formattedDate);

        // Set counter titles and values
        $("#EditCounterTextBox1").text(CounterBox[0]);
        $("#EditCounterTextBox2").text(CounterBox[1]);
        $("#EditCounterTextBox3").text(CounterBox[2]);
        $("#EditCounterTextBox4").text(CounterBox[3]);

        $('#EditCounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#EditCounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#EditCounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#EditCounterValBox4').text(data[0][0][CounterBox[3]]);

        // Reset HTML containers and counters
        let rawCount = 0;
        let finishedCount = 0;
        let transitCount = 0;
        let OthersCount = 0;

        $('#dynamicRawMaterial, #dynamicFinishedProduct, #dynamicTransitProduct,#dynamicOtherProduct').empty();

        const defaultOption = '<option value="">--Select--</option>';

        // Helper function to update totals
        const updateTotalSums = () => {
            const calcTotal = (selector, outputId) => {
                let sum = 0;
                $(selector).each(function () {
                    let val = parseFloat($(this).val()) || 0;
                    sum += val;
                });
                $(outputId).val(sum);
            };

            calcTotal("#dynamicRawMaterial .totalDiff", "#RawDifferentStock");
            calcTotal("#dynamicFinishedProduct .totalDiff", "#FinishedDifferentStock");
            calcTotal("#dynamicTransitProduct .totalDiff", "#TransitDifferentStock");
            calcTotal("#dynamicOtherProduct .totalDiff", "#OthersDifferentStock");

            $('#RawNoOfProducts').val(rawCount);
            $('#FinishedNoOfProducts').val(finishedCount);
            $('#TransitNoOfProducts').val(transitCount);
            $('#OthersNoOfProducts').val(OthersCount);
        };

        // Helper to get unit options as Promise
        var unitdata = PrimaryUnitSecondaryUnitDropDown[0];
        var optionVal = ``;
        // Helper to fetch unit options
        function getUnitOptions(item) {
            return new Promise(resolve => {
                let optionVal = '';
                const matchedUnit = unitdata.find(unit => unit.ProductId === item.ProductId);
                optionVal = `
                        
                        <option value="${matchedUnit.SecondaryUnitId}" ${item.ProductId === matchedUnit.SecondaryUnitId ? 'selected' : ''}>${matchedUnit.SecondaryUnitName}</option>
                    `;

                resolve(optionVal); // ✅ This is what you want to resolve
            });
        }

        // Helper to render each row
        const bindProductItemSequentially = async (item) => {
            const unique = Math.random().toString(36).substring(2);
            const unitOptions = await getUnitOptions(item);

            const productField = `
                <td>
                    <input type="text" class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" data-id="${item.ProductId}" value="${item.ProductName ?? ''}" disabled>
                </td>
                <td>
                    <select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required disabled>
                        ${unitOptions}
                    </select>
                </td>
                <td class="manageStockRaw SystemstockRow">
                    <input type="text" class="form-control systemStock" id="SystemStock${unique}" name="SystemStock${unique}" placeholder="System Stock" value="${item.PrimaryUnitStock ?? ''}" disabled>
                </td>
                <td class="manageStockFinished PrimarySystemstockRow d-none">
                    <input type="text" class="form-control PrimarysystemStock" id="PrimarySystemStock${unique}" name="PrimarySystemStock${unique}" placeholder="System Stock" value="${item.PrimaryUnitStock ?? ''}" disabled>
                </td>
                <td class="manageStockFinished SecondarySystemstockRow d-none">
                    <input type="text" class="form-control secondarysystemStock" id="secondarysystemStock${unique}" name="secondarysystemStock${unique}" placeholder="System Stock" value="${item.SystemStock ?? ''}" disabled>
                </td>
                <td class="manageStockFinished SecondaryUnitValueRow d-none">
                    <input type="text" class="form-control secondaryUnitValue" id="secondaryUnitValue${unique}" name="secondaryUnitValue${unique}" value="${item.SecondaryUnitValue ?? ''}" disabled>
                </td>
                <td>
                    <input type="text" class="form-control manualStock" id="ManualStock${unique}" name="ManualStock${unique}" value="${item.ManualStock ?? ''}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 7)">
                </td>
                <td class="manageStockFinished diffstockRow">
                    <input type="text" class="form-control totalDiff" id="TotalDiff${unique}" name="TotalDiff${unique}" value="${item.DiffStock ?? ''}" disabled>
                </td>`;

            let html = '';
            let newRow;

            if (item.ProductTypeId === 1) {
                html = `<tr class="stockRow" data-id="${item.ManageStockProductMappingId}">${productField}</tr>`;
                newRow = $(html);
                $('#dynamicRawMaterial').append(newRow);
                rawCount++;
            } else if (item.ProductTypeId === 2) {
                html = `<tr class="stockRow" data-id="${item.ManageStockProductMappingId}">
                            <td class="type-cell" style="text-align:center;vertical-align:middle;">${item.Type}</td>
                            ${productField}
                        </tr>`;
                newRow = $(html);
                $('#dynamicFinishedProduct').append(newRow);
                finishedCount++;
            } else if (item.ProductTypeId === 3) {
                html = `<tr class="stockRow" data-id="${item.ManageStockProductMappingId}">${productField}</tr>`;
                newRow = $(html);
                $('#dynamicTransitProduct').append(newRow);
                transitCount++;
            }
            else if (item.ProductTypeId === 4) {
                html = `<tr class="stockRow" data-id="${item.ManageStockProductMappingId}">${productField}</tr>`;
                newRow = $(html);
                $('#dynamicOtherProduct').append(newRow);
                transitCount++;
            }

            calculateRowDifference(newRow);
        };
            
        // Process all items in order with await
        for (const item of data[2]) {
            await bindProductItemSequentially(item);
        }

        // Final updates
        updateTotalSums();
        HideShowColumns();
        $('#loader-pms').hide();
    }
}

function HideShowColumns() {
    if (userId == "8" || userId == "145" || userId == "215") {
        $('.SystemstockRow,#SystemStockColumn,.diffstockRow,#DiffStockColumn').show();
    } else {
        $('.SystemstockRow,#SystemStockColumn,.diffstockRow,#DiffStockColumn').hide();
    }
}

function applyTableFilterForRawMaterials() {
    let filterValue = $('#tableForPopFilter').val().toLowerCase().trim();
    let visibleRowCount = 0;
    $('#dynamicRawMaterial .AllProductEmptyRow').remove();

    $('#dynamicRawMaterial .stockRow').each(function () {
        let productName = $(this).find('input.productId').val()?.toLowerCase() || "";
        let unitText = $(this).find('select.unitId option:selected').text().toLowerCase();
        let isVisible = productName.includes(filterValue) || unitText.includes(filterValue);
        $(this).toggle(isVisible);
        if (isVisible) {
            visibleRowCount++;
        }
    });

    if (visibleRowCount === 0) {
        $('#dynamicRawMaterial').append(`
            <tr class="AllProductEmptyRow">
                <td colspan="9" class="text-center text-danger">No matching products found.</td>
            </tr>
        `);
    }
}

function applyTableFilterForFinishedProducts() {
    let filterValue = $('#tableForPopFilter').val().toLowerCase().trim();
    let visibleRowCount = 0;
    $('#dynamicFinishedProduct .AllProductEmptyRow').remove();

    $('#dynamicFinishedProduct .stockRow').each(function () {
        let productName = $(this).find('input.productId').val()?.toLowerCase() || "";
        let unitText = $(this).find('select.unitId option:selected').text().toLowerCase();
        let typeText = $(this).find('td.type-cell').text().toLowerCase().trim();
        let isVisible = productName.includes(filterValue) || unitText.includes(filterValue) || typeText.includes(filterValue);
        $(this).toggle(isVisible);
        if (isVisible) {
            visibleRowCount++;
        }
    });

    if (visibleRowCount === 0) {
        $('#dynamicFinishedProduct').append(`
            <tr class="AllProductEmptyRow">
                <td colspan="9" class="text-center text-danger">No matching products found.</td>
            </tr>
        `);
    }
}

function applyTableFilterForTransitProducts() {
    let filterValue = $('#tableForPopFilter').val().toLowerCase().trim();
    let visibleRowCount = 0;
    $('#dynamicTransitProduct .AllProductEmptyRow').remove();

    $('#dynamicTransitProduct .stockRow').each(function () {
        let productName = $(this).find('input.productId').val()?.toLowerCase() || "";
        let unitText = $(this).find('select.unitId option:selected').text().toLowerCase();
        let isVisible = productName.includes(filterValue) || unitText.includes(filterValue);
        $(this).toggle(isVisible);
        if (isVisible) {
            visibleRowCount++;
        }
    });

    if (visibleRowCount === 0) {
        $('#dynamicTransitProduct').append(`
            <tr class="AllProductEmptyRow">
                <td colspan="9" class="text-center text-danger">No matching products found.</td>
            </tr>
        `);
    }
}
function applyTableFilterForOthersProducts() {
    let filterValue = $('#tableForPopFilter').val().toLowerCase().trim();
    let visibleRowCount = 0;
    $('#dynamicOtherProduct .AllProductEmptyRow').remove();

    $('#dynamicOtherProduct .stockRow').each(function () {
        let productName = $(this).find('input.productId').val()?.toLowerCase() || "";
        let unitText = $(this).find('select.unitId option:selected').text().toLowerCase();
        let isVisible = productName.includes(filterValue) || unitText.includes(filterValue);
        $(this).toggle(isVisible);
        if (isVisible) {
            visibleRowCount++;
        }
    });

    if (visibleRowCount === 0) {
        $('#dynamicOtherProduct').append(`
            <tr class="AllProductEmptyRow">
                <td colspan="9" class="text-center text-danger">No matching products found.</td>
            </tr>
        `);
    }
}
// Bind input event to search box
$(document).on('input', '#tableForPopFilter', function () {
    if (TextTabNameFilter == "Raw Materials") {
        applyTableFilterForRawMaterials();
    }
    else if (TextTabNameFilter == "Finished Products") {
        applyTableFilterForFinishedProducts();
    }
    else if (TextTabNameFilter == "Transit Products") {
        applyTableFilterForTransitProducts();
    }
    else if (TextTabNameFilter == "Others Products") {
        applyTableFilterForOthersProducts();
    }
});
