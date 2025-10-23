var productionId = 0;
var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
var formDataMultiple = new FormData();
var existFiles = [];
var deletedFiles = [];

$(document).ready(function () {
    $('#ProductionDynamicAttachmentModal').hide();

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').show();

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProduction", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ProductionId: null }, ProductionSuccess, null);
    });
    $('.clockpicker').clockpicker({
        autoclose: true,
        donetext: 'Done'
    });
    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        if (displayedDate.getFullYear() > currentYear || (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() > currentMonth)) {
            $('#increment-month-btn2').hide();
        }

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProduction", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ProductionId: null }, ProductionSuccess, null);
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
            Common.ajaxCall("GET", "/Productions/GetProduction", { FranchiseId: FranchiseMappingId, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), ProductionId: null }, ProductionSuccess, null);
        }
    });

    Common.bindDropDownParent('ToFranchiseId', 'FormProduction', 'Franchise');

    //var fnData = Common.getDateFilter('dateDisplay2');
    var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    Common.ajaxCall("GET", "/Productions/GetProduction", { FranchiseId: FranchiseMappingId, FromDate: startDate.toISOString(), ToDate: endDate.toISOString(), ProductionId: null }, ProductionSuccess, null);

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        displayedDate = new Date(currentYear, currentMonth);
        $('#increment-month-btn2').show();

        updateMonthDisplay(displayedDate);

        Common.ajaxCall("GET", "/Productions/GetProduction", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), ProductionId: null }, ProductionSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });

    var today = new Date();
    var todayFormatted = today.toISOString().split('T')[0];
    $('#ProductionDate').val(todayFormatted);
    //$('#ProductionDate').attr('min', todayFormatted).val(todayFormatted);

    $('#AddProduction').click(function () {
        $('#ProductionModal').show();
        $('#ProductionDynamicAttachmentModal').hide();
        $('#dynamicProduction').empty("");
        $('#TotalBalanceRGB').val('');
        $('#TotalBalancePET').val('');
        $('#editCounterbox').hide();
        $('#ProductionModalTitle').text('Add Production');
        $('#SaveProduction').val('Save').removeClass('btn-update').addClass('btn-success');
        $('.table-wrapper').css('max-height', '257px');
        Common.removevalidation('FormProduction');
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        $('#ToFranchiseId').val(FranchiseMappingId).trigger('change');
        var today = new Date();
        var todayFormatted = today.toISOString().split('T')[0];
        $('#ProductionDate').val(todayFormatted);
        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        deletedFiles = [];
        formDataMultiple = new FormData();
        //$('#ProductionDate').attr('min', todayFormatted).val(todayFormatted);
        productionId = 0;
    });

    $('#ProductionClose').click(function () {
        $('#ProductionModal').hide();
    });

    $('#addProduction').click(function () {
        var products = [];
        let unique = Math.random().toString(36).substring(2);
        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('ToFranchiseId'), ModuleName: 'FranchiseProduct' }, function (response) {
            products = JSON.parse(response.data);
            if (products != null && products.length > 0 && products[0].length > 0) {
                var productsOptions = products[0].map(function (productsVal) {
                    return `<option value="${productsVal.ProductId}">${productsVal.ProductName}</option>`;
                }).join('');
            }
            var defaultOption = '<option value="">--Select--</option>';

            var html = `
            <tr class="productionRow" data-id="" data-row="${unique}productionRow">
                <td class="d-none"><lable class="ProductCategoryName"></lable></td>
				<td>
					<select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required>
					 ${defaultOption}${productsOptions}
					</select>
				</td>
                <td>
					<select class="form-control productFlavourId" id="ProductFlavourId${unique}" name="ProductFlavourId${unique}" required disabled>
					 ${defaultOption}
					</select>
				</td>ss
				<td>
					<select class="form-control unitId" id="UnitId${unique}" name="UnitId${unique}" required >
					 ${defaultOption}
					</select>
				</td>
				<td>
					<input type="text" class="form-control RejectionQty_Dust" id="RejectionQty_Dust${unique}" name="RejectionQty_Dust${unique}" placeholder="0" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
                <td>
					<input type="text" class="form-control RejectionQty_MarbleDown" id="RejectionQty_MarbleDown${unique}" name="RejectionQty_MarbleDown${unique}" placeholder="0" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
                <td>
					<input type="text" class="form-control RejectionQty_LowFill" id="RejectionQty_LowFill${unique}" name="RejectionQty_LowFill${unique}" placeholder="0" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
                <td>
					<input type="text" class="form-control RejectionQty_RedHazard" id="RejectionQty_RedHazard${unique}" name="RejectionQty_RedHazard${unique}" placeholder="0" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
                <td>
					<input type="text" class="form-control RejectionQty_Others" id="RejectionQty_Others${unique}" name="RejectionQty_Others${unique}" placeholder="0" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
				<td>
					<input type="text" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}"  placeholder="Quantity" required oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
				<td>
					<input type="text" class="form-control openingBalance" id="OpeningBalance${unique}" name="OpeningBalance${unique}" placeholder="Opening Balance" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" disabled>
				</td>
                <td class="d-none">
			        <input type="text" class="form-control PrimaryopeningBalance" id="PrimaryopeningBalance${unique}" name="PrimaryopeningBalance${unique}"  placeholder="Opening Balance" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 7)">
                </td>
                <td class="d-none">
                	<input type="text" class="form-control SeconadryopeningBalance" id="SeconadryopeningBalance${unique}" name="SeconadryopeningBalance${unique}"  placeholder="Opening Balance" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 7)">
                </td>
                <td class="d-none">
			        <input type="text" class="form-control PrimaryDistribution" id="PrimaryDistribution${unique}" name="PrimaryDistribution${unique}"  placeholder="PrimaryDistribution" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 7)">
                </td>
                <td class="d-none">
                	<input type="text" class="form-control SeconadryDistribution" id="SeconadryDistribution${unique}" name="SeconadryDistribution${unique}"  placeholder="SeconadryDistribution" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 7)">
                </td>
				<td>
					<input type="text" class="form-control distribution" id="Distribution${unique}" name="Distribution${unique}" placeholder="Distribution" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" disabled>
				</td>
                 <td class="d-none">
                    <input type="text" class="form-control secondaryUnitValue" id="secondaryUnitValue${unique}" name="secondaryUnitValue${unique}" value="" placeholder="Opening Balance" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 7)">
                </td>
                <td>
					<input type="text" class="form-control closingBalance" id="ClosingBalance${unique}" name="ClosingBalance${unique}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" placeholder="Closing Balance" disabled>
                    <lable class="d-none ConvertionValues"></lable>
				</td>
				<td class="d-flex justify-content-center">
                    <button id="ProductionQCMapping" class="btn AddStockBtn1" type="button">
                        <i class="fas fa-plus" id="AddButton"></i>
                    </button>
					<button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button">
						<i class="fas fa-trash-alt"></i>
					</button>
				</td>
			</tr>
            `;

            $('#dynamicProduction').append(html);
            TotalProducts();
        }, null);
    });


    $(document).on('click', '#ProductionTable .btn-edit', function () {
        $('#loader-pms').show();
        $('#ProductionDynamicAttachmentModal').hide();

        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        deletedFiles = [];
        formDataMultiple = new FormData();

        Common.removevalidation('FormProduction');
        $('#dynamicProduction').empty("");
        //$('#editCounterbox').show();
        $('#editCounterbox').hide();
        $('#SaveProduction').val('Update').removeClass('btn-success').addClass('btn-update');
        $('.table-wrapper').css('max-height', '152px');
        $('#ProductionModalTitle').text('Production Info');
        //var prodDate = $(this).closest("tr").find("td:eq(0)").text().trim();
        //var parts = prodDate.split("-");
        //var formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);

        var productionId = $(this).data('id');

        Common.ajaxCall("GET", "/Productions/GetProduction", { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, ProductionId: parseInt(productionId) }, EditSuccess, null);
    });

    $('#SaveProduction').click(function () {
        if ($('#FormProduction').valid()) {

            var ProductionDetailsStatic = {
                ProductionId: productionId == 0 ? null : productionId,
                ProductionDate: Common.stringToDateTimeSendTimeAlso('ProductionDate'),
                FromFranchiseId: FranchiseMappingId,
                ToFranchiseId: Common.parseInputValue('ToFranchiseId'),
                NoOfHours: $('#NoOfHours').val().replace(':', '.'),
                NoOfProducts: Common.parseInputValue('NoOfProducts'),
                TotalQty_RGB: parseInt($('#TotalBalanceRGB').val()),
                TotalQty_PET: parseInt($('#TotalBalancePET').val()),
            };

            var productionProductMappingDetails = [];
            var ProductionQCMappingDetails = [];
            var DyanamicAttachment = [];
            var existFilesDyanamicAttachment = [];

            var parentRows = $('#dynamicProduction .productionRow');
            $.each(parentRows, function (index, parentRow) {
                var indexVal = index + 1;
                var productionProductMappingId = $(this).attr('data-id');
                var productId = $(parentRow).find('.productId').val();
                var unitId = $(parentRow).find('.unitId').val();
                var productFlavourId = $(parentRow).find('.productFlavourId').val();
                var rejectionQty_Dust = $(parentRow).find('.RejectionQty_Dust').val();
                var rejectionQty_MarbleDown = $(parentRow).find('.RejectionQty_MarbleDown').val();
                var rejectionQty_LowFill = $(parentRow).find('.RejectionQty_LowFill').val();
                var rejectionQty_RedHazard = $(parentRow).find('.RejectionQty_RedHazard').val();
                var rejectionQty_Others = $(parentRow).find('.RejectionQty_Others').val();
                var quantity = $(parentRow).find('.quantity').val();
                var openingBalance = $(parentRow).find('.openingBalance').val();
                var distribution = $(parentRow).find('.distribution').val();
                var closingBalance = $(parentRow).find('.closingBalance').val();

                productionProductMappingDetails.push({
                    ProductionProductMappingId: productionProductMappingId == "" ? null : productionProductMappingId,
                    ProductId: parseInt(productId) || null,
                    UnitId: parseInt(unitId) || null,
                    ProductFlavourId: productFlavourId || null,
                    RejectionQty_Dust: parseFloat(rejectionQty_Dust) || 0.00,
                    RejectionQty_MarbleDown: parseFloat(rejectionQty_MarbleDown) || 0.00,
                    RejectionQty_LowFill: parseFloat(rejectionQty_LowFill) || 0.00,
                    RejectionQty_RedHazard: parseFloat(rejectionQty_RedHazard) || 0.00,
                    RejectionQty_Others: parseFloat(rejectionQty_Others) || 0.00,
                    Quantity: parseFloat(quantity) || 0.00,
                    OpeningBalance: parseFloat(openingBalance) || 0.00,
                    Distribution: Number((parseFloat(distribution) || 0).toFixed(2)),
                    ClosingBalance: parseFloat(closingBalance) || 0.00,
                    RowNumber: indexVal,
                    ProductionId: productionId == 0 ? null : productionId,
                });

                var secondRows = $(this).nextUntil('.productionRow', '.ProductionQCMappingRow');

                secondRows.each(function () {
                    var currentRow = $(this);

                    currentRow.find('.set-container').each(function () {
                        var $container = $(this);
                        var $checkbox = $container.find('input[type="checkbox"]');

                        var productionQCMappingId = $container.find('.ProductionQCMappingId').text().trim();
                        var value = $container.find('.ValuesQCMapping').val();
                        var ProductQCMappingId = $checkbox.data('id');
                        var productId = $checkbox.data('product');
                        var IsActive = $container.find('.ProductQCMappingCheck').is(':checked');

                        ProductionQCMappingDetails.push({
                            ProductionQCMappingId: productionQCMappingId === "" ? null : productionQCMappingId,
                            ProductId: parseInt(productId),
                            ProductQCMappingId: parseInt(ProductQCMappingId),
                            Value: parseFloat(value),
                            RowNumber: indexVal,
                            ProductionId: productionId === 0 ? null : productionId,
                            ProductionProductMappingId: productionProductMappingId == "" ? null : productionProductMappingId,
                            IsActive: IsActive,
                        });
                    });

                    const $modal = currentRow.find('.ProductionDynamicAttachmentModal');

                    $modal.find('.download-button').each(function () {
                        var dataIdName = $(this).find('i').data('id');
                        if (dataIdName) {
                            DyanamicAttachment.push({
                                RowNumber: indexVal,
                                AttachmentFileName: dataIdName
                            });
                        }
                    });

                    $modal.find('.existselectedFiles li').each(function () {
                        var attachmentId = $(this).find('.delete-buttonattach').attr('attachmentid');
                        var filePath = $(this).find('.download-link').attr('href');
                        var fileName = $(this).find('.download-link').attr('download');

                        if (fileName && filePath) {
                            existFilesDyanamicAttachment.push({
                                ProductionAttachmentId: null,
                                AttachmentFileName: fileName,
                                AttachmentFilePath: filePath,
                                ProductionProductMappingId: productionProductMappingId == "" ? null : productionProductMappingId,
                                ProductionId: productionId === 0 ? null : productionId,
                                RowNumber: indexVal,
                            });
                        }
                    });
                });
            });

            formDataMultiple.append("ProductionDetailsStatic", JSON.stringify(ProductionDetailsStatic));
            formDataMultiple.append("productionProductMappingDetails", JSON.stringify(productionProductMappingDetails));
            formDataMultiple.append("ProductionQCMappingDetails", JSON.stringify(ProductionQCMappingDetails));
            formDataMultiple.append("DyanamicAttachment", JSON.stringify(DyanamicAttachment));
            formDataMultiple.append("ExistFilesDyanamicAttachment", JSON.stringify(existFilesDyanamicAttachment));
            formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

            $.ajax({
                type: "POST",
                url: "/Productions/InsertUpdateProduction",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        Common.successMsg(response.message);
                        $('#ProductionModal').hide();
                        var text = $('#dropdownMenuButton2').text();
                        var fnData = Common.getDateFilter('dateDisplay2');
                        var fromDate;
                        var toDate;
                        if (text == "Custom") {
                            fromDate = Common.stringToDateTime('FromDate')
                            toDate = Common.stringToDateTime('ToDate')
                        } else {
                            fromDate = fnData.startDate.toISOString()
                            toDate = fnData.endDate.toISOString()
                        }
                        Common.ajaxCall("GET", "/Productions/GetProduction", { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, ProductionId: null }, ProductionSuccess, null);

                        $('#selectedFiles,#ExistselectedFiles').empty('');
                        existFiles = [];
                        deletedFiles = [];
                        formDataMultiple = new FormData();
                    }
                    else {
                        Common.errorMsg(response.message);
                    }
                },
                error: function (response) {
                    Common.errorMsg(response.message);
                }
            });
        }
    });

    $(document).on('change', '#ToFranchiseId', function () {
        $('#dynamicProduction').empty("");
        $('#addProduction').click();
        $('#NoOfProducts').val('');
        $('#TotalBalanceRGB').val('');
        $('#TotalBalancePET').val('');
    });

    $(document).on('change', '#dynamicProduction .productId', function () {
        var productId = $(this).val();
        var thisSelectElement = $(this);

        var currentRow = $(this).closest("tr");
        currentRow.nextUntil('.productionRow', '.ProductionQCMappingRow').remove();

        $('select.productId').each(function (index, value) {
            var existVal = $(value).val();
            if (existVal == productId && value !== thisSelectElement[0] && existVal != null) {
                thisSelectElement.val("");

                $(thisSelectElement).val($('option:contains("--Select--")').val()).trigger('change');
                productId = "";
                return false;
            }
        });

        var $row = $(this).closest('tr');
        var $flavourDropdown = $row.find('.unitId');

        if (productId != "" && $('#ProductionDate').val() != "") {
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(productId), ModuleName: 'ProductIdByUnit' }, function (response) {
                if (response != null) {
                    $flavourDropdown.empty().prop('disabled', false);
                    var data = JSON.parse(response.data);
                    $flavourDropdown.empty();
                    var dataValue = data[0];
                    if (dataValue != null && dataValue.length > 0) {
                        var valueproperty = Object.keys(dataValue[0])[0];
                        var textproperty = Object.keys(dataValue[0])[1];
                        $.each(dataValue, function (index, item) {
                            $flavourDropdown.append($('<option>', {
                                value: item[valueproperty],
                                text: item[textproperty],
                            }));
                        });
                        $flavourDropdown.val($flavourDropdown.find('option').eq(0).val()).trigger('change');
                    } else {
                        $flavourDropdown.append($('<option>', {
                            value: '',
                            text: '--Select--',
                        }));
                    }
                }
            });

            var productFlavourId = $row.find('.productFlavourId');
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(productId), ModuleName: 'ProductFlavour' }, function (response) {
                if (response != null) {
                    productFlavourId.empty().prop('disabled', true);
                    var data = JSON.parse(response.data);
                    productFlavourId.empty();
                    var dataValue = data[0];
                    if (dataValue != null && dataValue.length > 0) {
                        var valueproperty = Object.keys(dataValue[0])[0];
                        var textproperty = Object.keys(dataValue[0])[1];
                        productFlavourId.append($('<option>', {
                            value: '',
                            text: '--Select--',
                        }));
                        $.each(dataValue, function (index, item) {
                            productFlavourId.append($('<option>', {
                                value: item[valueproperty],
                                text: item[textproperty],
                            }));
                        });
                        productFlavourId.prop('selectedIndex', 1);

                    } else {
                        productFlavourId.append($('<option>', {
                            value: '',
                            text: '--Select--',
                        }));
                    }
                }
            });

            Common.ajaxCall("GET", "/Productions/GetOpeningBalance", { FranchiseId: FranchiseMappingId, ProdDate: Common.stringToDateTime('ProductionDate').toISOString(), ProductId: parseInt(productId) }, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    if (data[0][0].OpeningBalance < 0) {
                        $row.find('.openingBalance').val('0');
                        $row.find('.PrimaryopeningBalance').val('0');
                    }
                    else {
                        $row.find('.openingBalance').val(data[0][0].OpeningBalance);
                        $row.find('.PrimaryopeningBalance').val(data[0][0].OpeningBalance);
                    }
                    $row.find('.SeconadryopeningBalance').val(data[0][0].SecondaryOpeningBalance);
                    $row.find('.secondaryUnitValue').val(data[0][0].SecondaryUnitValue);
                    $row.find('.quantity').val('');
                    $row.find('.RejectedQty').val('');
                    if (data[1][0].SecondaryDistribution != null && data[1][0].Distribution != null) {
                        $row.find('.PrimaryDistribution').val(data[1][0].Distribution);
                        $row.find('.SeconadryDistribution').val(data[1][0].SecondaryDistribution);
                    }
                    $row.find('.distribution').val(data[1][0].Distribution);
                    $row.find('.ProductCategoryName').text(data[0][0].ProductCategoryName);
                    $row.find('.closingBalance').val(data[0][0].OpeningBalance - data[1][0].Distribution).css('color', 'blue');
                    $row.find('.AddStockBtn1').show();
                    let totalQty = 0;
                    $('#dynamicProduction .closingBalance').each(function () {
                        let val = parseFloat($(this).val()) || 0;
                        totalQty += val;
                    });
                    OpeningBalanceCalc($row);
                }
            }, null);
        } else {
            $row.find('.openingBalance').val("");
            $row.find('.distribution').val("");
            $row.find('.closingBalance').val("");
            $row.find('.unitId').val("");
            $row.find('.quantity').val('');
            $row.find('.RejectedQty').val('');
        }

        TotalProducts();
        OpeningBalanceCalc($row);
    });
    $(document).on('change', '.unitId', function () {
        var $row = $(this).closest('tr');

        var selectedIndex = $(this).prop('selectedIndex');

        var primaryStock = $row.find('.PrimaryopeningBalance').val();
        var secondaryStock = $row.find('.SeconadryopeningBalance').val();
        var primaryDistribution = $row.find('.PrimaryDistribution').val();
        var secondaryDistribution = $row.find('.SeconadryDistribution').val();

        if (selectedIndex === 0) {
            $row.find('.openingBalance').val(primaryStock);
            $row.find('.distribution').val(primaryDistribution);
        } else if (selectedIndex === 1) {
            $row.find('.openingBalance').val(secondaryStock);
            $row.find('.distribution').val(secondaryDistribution);
            $row.find('.ConvertionValues').val('');
        } else {
            $row.find('.openingBalance').val('');
            $row.find('.distribution').val('');
            $row.find('.ConvertionValues').val('');
        }
        $row.find('.quantity').val('');
        $row.find('.RejectedQty').val('');
        OpeningBalanceCalc($row);
    });

    $(document).on('input', '#dynamicProduction .closingBalance', function () {
        let totalQty = 0;

        $('#dynamicProduction .closingBalance').each(function () {
            let val = parseFloat($(this).val()) || 0;
            totalQty += val;
        });

        $('#TotalClosingBalance').val(totalQty.toFixed(2));
    });

    $(document).on('click', '#ProductionTable .btn-delete', async function () {
        // var dateText = $(this).closest("tr").find("td:first").text().trim();
        // var parts = dateText.split("-");
        // var formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        var productionId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Productions/DeleteProduction", { ProductionId: parseInt(productionId) }, function (response) {
                if (response.status) {
                    Common.successMsg(response.message);
                    $('#ProductionModal').hide();
                    var text = $('#dropdownMenuButton2').text();
                    var fnData = Common.getDateFilter('dateDisplay2');
                    var fromDate;
                    var toDate;
                    if (text == "Custom") {
                        fromDate = Common.stringToDateTime('FromDate');
                        toDate = Common.stringToDateTime('ToDate');
                    } else {
                        fromDate = fnData.startDate.toISOString()
                        toDate = fnData.endDate.toISOString()
                    }
                    Common.ajaxCall("GET", "/Productions/GetProduction", { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, ProductionId: null }, ProductionSuccess, null);
                    $('#selectedFiles,#ExistselectedFiles').empty('');
                    existFiles = [];
                    deletedFiles = [];
                    formDataMultiple = new FormData();
                }
                else {
                    Common.errorMsg(response.message);
                }
            }, null);
        }
    });

    $(document).on('input', '#dynamicProduction .quantity', function () {
        let $row = $(this).closest('.productionRow');
        OpeningBalanceCalc($row);

    });
});

function OpeningBalanceCalc($row) {
    let openingStr = parseFloat($row.find('.openingBalance').val()) || 0;
    let entryStr = parseFloat($row.find('.quantity').val()) || 0;
    let conversion = parseFloat($row.find('.secondaryUnitValue').val()) || 1;
    let distribution = parseFloat($row.find('.distribution').val()) || 0;
    let selectedIndex = $row.find('.unitId').prop('selectedIndex');

    let color = 'blue';

    if (selectedIndex === 0) {
        let entryStrBeforeDecimal = parseInt(entryStr.toString().split('.')[0] || 0, 10);
        let entryStrAfterDecimal = parseInt(entryStr.toString().split('.')[1] || 0, 10);
        let entryStrBeforeDecimalVal = entryStrBeforeDecimal * conversion;
        let entryStrValue = entryStrBeforeDecimalVal + entryStrAfterDecimal;

        let openingStrBeforeDecimal = parseInt(openingStr.toString().split('.')[0] || 0, 10);
        let openingStrAfterDecimal = parseInt(openingStr.toString().split('.')[1] || 0, 10);;
        let openingStrBeforeDecimalVal = openingStrBeforeDecimal * conversion;
        let openingStrValue = openingStrBeforeDecimalVal + openingStrAfterDecimal;

        let SumEntryStr_OpeningStr = entryStrValue + openingStrValue;

        let distributionStrBeforeDecimal = parseInt(distribution.toString().split('.')[0] || 0, 10);
        let distributionStrAfterDecimal = parseInt(distribution.toString().split('.')[1] || 0, 10);
        let distributionStrBeforeDecimalVal = distributionStrBeforeDecimal * conversion;
        let distributionStrValue = distributionStrBeforeDecimalVal + distributionStrAfterDecimal;

        let SubEntryStr_OpeningStr_Distribution = SumEntryStr_OpeningStr - distributionStrValue;
        let HowMuch = SubEntryStr_OpeningStr_Distribution / conversion;
        let ConvertHowMuchTakeBeforeVal = parseInt(HowMuch.toString().split('.')[0] || 0, 10);
        let Mulitval = ConvertHowMuchTakeBeforeVal * conversion;
        let Frix = SubEntryStr_OpeningStr_Distribution - Mulitval;

        if (entryStr == "" || entryStr == "0") {
            color = 'blue';
        } else if (HowMuch > 0) {
            color = 'green';
        } else if (HowMuch < 0) {
            color = 'red';
        }

        let FrixStr = String(Math.abs(Frix)).padStart(2, '0'); // ensures two digits
        let totalDiffStr = `${ConvertHowMuchTakeBeforeVal}.${FrixStr}`;
        let totalDiffNum = Number(totalDiffStr);

        let displayValue;

        // Check if it's a single-digit whole number
        if (totalDiffNum >= 0 && totalDiffNum < 10 && totalDiffNum % 1 === 0) {
            displayValue = totalDiffNum; // no decimal
        } else {
            displayValue = totalDiffNum.toFixed(2); // keep 2 decimal places
        }

        $row.find('.closingBalance').val(displayValue).css('color', color);
        $row.find('.ConvertionValues').text(SubEntryStr_OpeningStr_Distribution);
    } else if (selectedIndex === 1) {
        let SumQuantityOpenBal = entryStr + openingStr;
        let SubAboveDistribution = SumQuantityOpenBal - distribution;

        if (entryStr == "" || entryStr == "0") {
            color = 'blue';
        } else if (SubAboveDistribution > 0) {
            color = 'green';
        } else if (SubAboveDistribution < 0) {
            color = 'red';
        }

        $row.find('.closingBalance').val(Number(SubAboveDistribution).toFixed(2));
        $row.find('.closingBalance').css('color', color);
        $row.find('.ConvertionValues').empty().text(SubAboveDistribution);
    }
    else {
        $row.find('.closingBalance').val('').css('color', 'blue');
        $row.find('.ConvertionValues').empty().text('0');
    }
    calculateQuantityTotalPET_RGB();
}

function calculateQuantityTotalPET_RGB() {
    let totalRGBQuantity = 0;
    let totalPETQuantity = 0;

    $('#dynamicProduction .productionRow').each(function () {
        const $row = $(this);
        const type = $row.find('.ProductCategoryName').text().trim().toUpperCase(); // e.g., "RGB" or "PET"

        const quantity = parseFloat($row.find('.ConvertionValues').text()) || 0;

        if (type === 'RGB') {
            totalRGBQuantity += quantity;
        } else if (type === 'PET') {
            totalPETQuantity += quantity;
        }
    });

    $('#TotalBalanceRGB').val(totalRGBQuantity);
    $('#TotalBalancePET').val(totalPETQuantity);
}

function ProductionSuccess(response) {
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

        var columns = Common.bindColumn(data[1], ['ProductionId']);
        Common.bindTableForNoStatus('ProductionTable', data[1], columns, -1, 'ProductionId', '330px', true, access);
    }
}

async function EditSuccess(response) {
    if (!response.status) return;

    const data = JSON.parse(response.data);
    const [counterData, parentData, productionList, qcList, AttachmentData] = data;

    Common.bindParentData(parentData, 'FormProduction');

    // Bind counters
    const CounterBox = Object.keys(counterData[0]);
    CounterBox.forEach((key, idx) => {
        $(`#EditCounterTextBox${idx + 1}`).text(key);
        $(`#EditCounterValBox${idx + 1}`).text(counterData[0][key]);
    });

    // Set ProductionId and ProductionDate
    productionId = parentData[0].ProductionId;
    const parts = parentData[0].ProductionDate.split('-');
    const formattedProdDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    $('#ProductionDate').val(formattedProdDate);
    //$('#ProductionDate').attr('min', formattedProdDate);

    // Get Product Dropdown Options
    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", {
        MasterInfoId: Common.parseInputValue('ToFranchiseId'),
        ModuleName: 'FranchiseProduct'
    }, async function (prodResp) {
        $('#dynamicProduction').empty();

        const products = JSON.parse(prodResp.data);
        const productsOptions = products[0].map(p => `<option value="${p.ProductId}">${p.ProductName}</option>`).join('');

        for (let item of productionList) {
            await bindSingleProductionRow(item, productsOptions, qcList, AttachmentData);
        }

        $('#TotalBalanceRGB').val(data[1][0].TotalQty_RGB);
        $('#TotalBalanceRGB').val(data[1][0].TotalQty_RGB);
        let numericTime = data[1][0].NoOfHours;  // e.g., 1.5 or "1.50"
        let timeStr = numericTime.toString();   // Make sure it's a string

        let [hours, minutes] = timeStr.split('.');

        // Pad hours/minutes to fit HH:mm format
        hours = hours.padStart(2, '0');
        minutes = minutes.padEnd(2, '0');

        let formattedTime = `${hours}:${minutes}`;
        $('#NoOfHours').val(formattedTime);



        $('#loader-pms').hide();
        $('#ProductionModal').show();
    });
}

// ✅ Separate function to bind one production row
async function bindSingleProductionRow(item, productsOptions, qcList, AttachmentData) {
    return new Promise((resolve) => {
        let unique = Math.random().toString(36).substring(2);

        // Get Flavour
        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", {
            MasterInfoId: item.ProductId,
            ModuleName: 'ProductFlavour'
        }, function (flavourResp) {
            let productFlavourOptions = '';
            const flavours = JSON.parse(flavourResp.data || '[]');
            if (flavours.length > 0 && flavours[0]) {
                productFlavourOptions = flavours[0].map(val => {
                    const selected = val.ProductFlavourId == item.ProductFlavourId ? 'selected' : '';
                    return `<option value="${val.ProductFlavourId}" ${selected}>${val.ProductFlavourName}</option>`;
                }).join('');
            }

            // Get Units
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", {
                MasterInfoId: item.ProductId,
                ModuleName: 'ProductIdByUnit'
            }, function (unitResp) {

                let selectedIndexUnit = 0;

                let unitOptions = '';
                const units = JSON.parse(unitResp.data || '[]');
                if (units.length > 0 && units[0]) {
                    unitOptions = units[0].map((val, index) => {
                        const selected = val.SecondaryUnitId == item.UnitId ? 'selected' : '';
                        if (selected) selectedIndexUnit = index;
                        return `<option value="${val.SecondaryUnitId}" ${selected}>${val.SecondaryUnitName}</option>`;
                    }).join('');
                }
                let unique = Math.random().toString(36).substring(2);
                let TextSameVal = item.ProductId || '';

                let openingStr = parseFloat(item.OpeningBalance) || 0;
                let entryStr = parseFloat(item.Quantity) || 0;
                let entryStrSecondary = parseFloat(item.SecondaryQuantity) || 0;
                let conversion = parseFloat(item.SecondaryUnitValue) || 1;
                let distribution = parseFloat(item.Distribution) || 0;

                let SubEntryStr_OpeningStr_Distribution = 0;

                if (selectedIndexUnit === 0) {
                    let entryStrBeforeDecimal = parseInt(entryStr.toString().split('.')[0] || 0, 10);
                    let entryStrAfterDecimal = parseInt(entryStr.toString().split('.')[1] || 0, 10);
                    let entryStrBeforeDecimalVal = entryStrBeforeDecimal * conversion;
                    let entryStrValue = entryStrBeforeDecimalVal + entryStrAfterDecimal;

                    let openingStrBeforeDecimal = parseInt(openingStr.toString().split('.')[0] || 0, 10);
                    let openingStrAfterDecimal = parseInt(openingStr.toString().split('.')[1] || 0, 10);
                    let openingStrBeforeDecimalVal = openingStrBeforeDecimal * conversion;
                    let openingStrValue = openingStrBeforeDecimalVal + openingStrAfterDecimal;

                    let SumEntryStr_OpeningStr = entryStrValue + openingStrValue;

                    let distributionStrBeforeDecimal = parseInt(distribution.toString().split('.')[0] || 0, 10);
                    let distributionStrAfterDecimal = parseInt(distribution.toString().split('.')[1] || 0, 10);
                    let distributionStrBeforeDecimalVal = distributionStrBeforeDecimal * conversion;
                    let distributionStrValue = distributionStrBeforeDecimalVal + distributionStrAfterDecimal;

                    SubEntryStr_OpeningStr_Distribution = SumEntryStr_OpeningStr - distributionStrValue;
                } else if (selectedIndexUnit === 1) {
                    let SumQuantityOpenBal = entryStrSecondary + openingStr;
                    SubEntryStr_OpeningStr_Distribution = SumQuantityOpenBal - distribution;
                }

                var OpeningBalancebind = selectedIndexUnit === 0 ? item.OpeningBalance : item.SecondaryOpeningBalance;

                // 🧱 Build Row
                let html = `<tr class="productionRow" data-id="${item.ProductionProductMappingId}" data-row="${TextSameVal}productionRow">
                    <td class="d-none"><lable class="ProductCategoryName" id="ProductCategoryName${unique}" name="ProductCategoryName${unique}">${item.ProductCategoryName || ''}</lable></td>
                    <td><select class="form-control productId" id="productId${unique}" name="productId${unique}">${productsOptions}</select></td>
                    <td><select class="form-control productFlavourId" id="productFlavourId${unique}" name="productFlavourId${unique}" disabled>${productFlavourOptions}</select></td>
                    <td><select class="form-control unitId" id="unitId${unique}" name="unitId${unique}">${unitOptions}</select></td>

                    <td>
					<input type="text" class="form-control RejectionQty_Dust" id="RejectionQty_Dust${unique}" name="RejectionQty_Dust${unique}" placeholder="0" value="${item.RejectionQty_Dust || ''}" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
                <td>
					<input type="text" class="form-control RejectionQty_MarbleDown" id="RejectionQty_MarbleDown${unique}" name="RejectionQty_MarbleDown${unique}" placeholder="0" value="${item.RejectionQty_MarbleDown || ''}" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
                <td>
					<input type="text" class="form-control RejectionQty_LowFill" id="RejectionQty_LowFill${unique}" name="RejectionQty_LowFill${unique}" placeholder="0" value="${item.RejectionQty_LowFill || ''}" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
                <td>
					<input type="text" class="form-control RejectionQty_RedHazard" id="RejectionQty_RedHazard${unique}" name="RejectionQty_RedHazard${unique}" placeholder="0" value="${item.RejectionQty_RedHazard || ''}" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>
                <td>
					<input type="text" class="form-control RejectionQty_Others" id="RejectionQty_Others${unique}" name="RejectionQty_Others${unique}" placeholder="0" value="${item.RejectionQty_Others || ''}" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
				</td>


                    <td><input type="text" class="form-control quantity" id="quantity${unique}" name="quantity${unique}" value="${selectedIndexUnit === 0 ? (item.Quantity || '') : (item.SecondaryQuantity || '')}" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)"></td>
                    <td><input type="text" class="form-control openingBalance" id="openingBalance${unique}" name="openingBalance${unique}" value="${OpeningBalancebind || ''}" disabled></td>
                    <td class="d-none"><input type="text" class="form-control PrimaryopeningBalance" id="PrimaryopeningBalance${unique}" name="PrimaryopeningBalance${unique}" value="${item.OpeningBalance || ''}"></td>
                    <td class="d-none"><input type="text" class="form-control SeconadryopeningBalance" id="SeconadryopeningBalance${unique}" name="SeconadryopeningBalance${unique}" value="${item.SecondaryOpeningBalance || ''}"></td>
                    <td class="d-none"><input type="text" class="form-control secondaryUnitValue" id="secondaryUnitValue${unique}" name="secondaryUnitValue${unique}" value="${item.SecondaryUnitValue || ''}"></td>
                    <td class="d-none"><input type="text" class="form-control PrimaryDistribution" id="PrimaryDistribution${unique}" name="PrimaryDistribution${unique}" value="${item.Distribution || ''}"></td>
                    <td class="d-none"><input type="text" class="form-control SeconadryDistribution" id="SeconadryDistribution${unique}" name="SeconadryDistribution${unique}" value="${item.SecondaryDistribution || ''}"></td>
                    <td><input type="text" class="form-control distribution" id="distribution${unique}" name="distribution${unique}" value="${item.Distribution || ''}" disabled></td>
                    <td><input type="text" class="form-control closingBalance" value="${selectedIndexUnit === 0 ? (item.ClosingBalance || '') : (item.SecondaryClosingBalance || '')}" disabled><lable class="d-none ConvertionValues" id="ConvertionValues${unique}" name="ConvertionValues${unique}">${SubEntryStr_OpeningStr_Distribution}</lable></td>
                    <td class="d-flex justify-content-center">
                        <button id="ProductionQCMapping" class="btn AddStockBtn1" type="button"><i class="fas fa-plus" id="AddButton"></i></button>
					    <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>`;

                $('#dynamicProduction').append(html);

                let $newRow1 = $('#dynamicProduction').find(`tr[data-id="${item.ProductionProductMappingId}"]`);
                let $closingInput = $newRow1.find('.closingBalance');

                if (item.ClosingBalance > 0) {
                    $closingInput.css('color', 'green');
                } else if (item.ClosingBalance < 0) {
                    $closingInput.css('color', 'red');
                } else {
                    $closingInput.css('color', 'black'); // optional default
                }

                const $newRow = $('#dynamicProduction').find('tr.productionRow').last();
                $newRow.find('.productId').val(item.ProductId);

                // 🔁 Set Opening Balance
                const primaryStock = item.OpeningBalance;
                const secondaryStock = item.SecondaryOpeningBalance;
                const selectedIndex = $newRow.find('.unitId').prop('selectedIndex');
                //const $openingBalance = $newRow.find('.openingBalance');
                //if (selectedIndex === 1) $openingBalance.val(primaryStock);
                //else if (selectedIndex === 2) $openingBalance.val(secondaryStock);

                const matchingQCRows = (qcList || []).filter(q => q.RowNumber === item.RowNumber);
                if (Array.isArray(matchingQCRows) && matchingQCRows.length > 0 && matchingQCRows.some(q => q && q.ProductQCMappingId != null && q.QCName != null)) {
                    appendDynamicQCRowNotNull(matchingQCRows, $newRow, TextSameVal, AttachmentData);
                    $newRow.find('.AddStockBtn1').hide();
                }

                //let $htmlRow = $(html);
                //OpeningBalanceCalc($htmlRow);
                //calculateQuantityTotalPET_RGB();

                TotalProducts(); // Your existing function
                resolve(); // 👈 resolve after full binding
            });
        });
    });
}

var numberIncrNotNull = 0;
// 🔩 Your existing QC Row function
function appendDynamicQCRowNotNull(qcList, $productionRow, textSameVal, AttachmentData) {

    numberIncrNotNull++;

    var matchingAttachments = AttachmentData.filter(att => att.RowNumber === qcList[0].RowNumber);
    var existHtml = "";
    existHtml = matchingAttachments.map(att => {
        // Apply the truncation logic to the AttachmentFileName
        const truncatedFileName = att.AttachmentFileName.length > 10 ? att.AttachmentFileName.substring(0, 10) + '...' : att.AttachmentFileName;

        return `
                <li>
                    <span>${truncatedFileName}</span>
                    <a class="download-link" href="${att.AttachmentFilePath}" download="${att.AttachmentFileName}">
                        <i class="fas fa-download"></i>
                    </a>
                    <a src="${att.AttachmentFilePath}" attachmentid="${att.ProductionAttachmentId}"
                        id="deletefile" class="delete-buttonattach">
                        <i class="fas fa-trash"></i>
                    </a>
                </li>
                `;
    }).join('');

    const totalColumns = 8;
    const totalItems = qcList.length;
    const baseColspan = Math.floor(totalColumns / totalItems);
    let remainingCols = totalColumns % totalItems;
    let html = `
            <tr class="ProductionQCMappingRow" data-row="${textSameVal}productionRow"><td></td>         
    `;
    let unique = Math.random().toString(36).substring(2);

    qcList.forEach((item, index) => {
        let colspan = baseColspan + (remainingCols-- > 0 ? 1 : 0);
        html += `<td colspan="${colspan}">
            <div class="set-container d-flex align-items-center">
                <lable class="ProductionQCMappingId d-none">${item.ProductionQCMappingId}</lable>
                <input type="checkbox" class="ProductQCMappingCheck" id="ProductQCMappingId${item.ProductQCMappingId}" data-product="${item.ProductId}" data-id="${item.ProductQCMappingId || ''}" ${item.IsActive ? 'checked' : ''}>
                <label class="form-label mb-0" style="margin: 0 5px;" for="ProductQCMappingId${item.ProductQCMappingId}">${item.QCName}</label>
                <input class="form-control ValuesQCMapping" type="text" value="${item.Value || 0}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" style="min-width: 56px;">
                 ${index === qcList.length - 1 ? `
                    <button id="RemoveButton" class="btn btn-danger DynrowRemoveQC text-white flex-shrink-0 m-2" type="button" style="margin-top:0; height:25px; width:25px; padding:0;">
                        <i class="fas fa-minus"></i>
                    </button>
                    <img src="../assets/commonimages/dynamicattachmentproduction.png" class="AttachmentPopDyanmic" style="width: 24px;cursor: pointer;">
                    <div class="ProductionDynamicAttachmentModal modal" data-backdrop="static" style="display:none; padding-right: 3px;">
                        <div class="modal-dialog modal-dialog-centered modal-md" data-bs-loader-pms="static" data-bs-keyboard="false">
	                        <div class="modal-content">
		                        <div class="modal-header d-flex align-items-center justify-content-between">
			                        <h2>Production QC Mapping Attachment Info</h2>
			                        <span class="ProductionDynamicAttachmentModalClose close" style="font-size:30px;cursor:pointer;color:white;" title="Close">×</span>
		                        </div>
		                        <div class="modal-body DynamicAttachmentBind" style="max-height: 70vh; overflow-y: auto; overflow-x: hidden; padding: 0px 0px 10px 0px;">
			                        <div class="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
				                        <div class="border border-radius" style="background-color:#F1F0EF; max-height:10.5rem; height: 126px;">
					                        <label class="d-flex justify-content-center align-content-center m-1" style="text-decoration: underline; color: #7D7C7C;" onclick="Attachment(${numberIncrNotNull})">
						                        <b class="attachlabel" style="white-space: nowrap; margin-left: 1px;">Click Here to Attach your files</b>
						                        <input type="file" id="fileInput${numberIncrNotNull}" multiple class="custom-file-input" hidden>
					                        </label>
					                        <div class="file-preview d-flex justify-content-center" id="preview${numberIncrNotNull}">
						                        <div class="attachrow">
							                        <div class="attachcolumn">
								                        <ul class="ExistFiles" id="selectedFiles${numberIncrNotNull}"></ul>
							                        </div>
							                        <div class="attachcolumn existselectedFiles mt--3"><ul class="DynamicExistselectedFiles" id="ExistselectedFiles${numberIncrNotNull}">${existHtml}</ul></div>
						                        </div>
					                        </div>
				                        </div>
			                        </div>
		                        </div>
	                        </div>
                        </div>
                    </div>
                    ` : ''}
            </div>
        </td>`;
    });

    html += '</tr>';
    $productionRow.after(html);
}

function SaveSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#ProductionModal').hide();
        var text = $('#dropdownMenuButton2').text();
        var fnData = Common.getDateFilter('dateDisplay2');
        var fromDate;
        var toDate;
        if (text == "Custom") {
            fromDate = Common.stringToDateTime('FromDate')
            toDate = Common.stringToDateTime('ToDate')
        } else {
            fromDate = fnData.startDate.toISOString()
            toDate = fnData.endDate.toISOString()
        }

        Common.ajaxCall("GET", "/Productions/GetProduction", { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, ProductionId: null }, ProductionSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

function TotalProducts() {
    let selectedCount = 0;
    $('#dynamicProduction .productionRow').each(function () {
        let productId = $(this).find('.productId').val();
        if (productId !== null && productId !== "" && productId !== "Select") {
            selectedCount++;
        }
    });

    $('#NoOfProducts').val(selectedCount);
}

$(document).on('click', '#ProductionQCMapping', function () {
    let $button = $(this); // 👈 save reference to clicked button
    let $row = $button.closest('tr');
    let $ProductId = $row.find('.productId').val();

    if ($ProductId != null && $ProductId != "") {
        Common.ajaxCall("GET", "/Productions/DD_ProductionQCMapping", { ProductId: $ProductId }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                appendDynamicQCRow(data, $button);
                $button.hide();
            }
        }, null);
    }
    else {
        Common.warningMsg("Select the Product.");
    }
});


var numberIncr1 = 0;
function appendDynamicQCRow(data, triggerElement) {
    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
        console.error("Invalid data format");
        return;
    }

    const qcList = data[0];
    const totalColumns = 8;
    const totalItems = qcList.length;
    let baseColspan = Math.floor(totalColumns / totalItems);
    let remainingCols = totalColumns % totalItems;

    const productionRow = $(triggerElement).closest('tr');
    const dataRowAttr = productionRow.attr('data-row') || '';

    numberIncr1++;

    let html = `
        <tr class="ProductionQCMappingRow" data-id="" data-row="${dataRowAttr}"><td></td>
    `;

    qcList.forEach((item, index) => {
        let colspan = baseColspan + (remainingCols > 0 ? 1 : 0);
        if (remainingCols > 0) remainingCols--;

        html += `
        <td colspan="${colspan}">
            <div class="set-container d-flex align-items-center">
                <label class="ProductionQCMappingId"></label>
                <input type="checkbox" class="ProductQCMappingCheck" id="ProductQCMappingId${item.ProductQCMappingId}" data-product="${item.ProductId}" data-id="${item.ProductQCMappingId || ''}">
                <label class="form-label mb-0" style="margin: 0 5px;" for="ProductQCMappingId${item.ProductQCMappingId}">${item.QCName}</label>
                <input class="form-control flex-fill ValuesQCMapping" type="text" value="${item.Value || 0}" placeholder="0.00" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" style="min-width: 56px;">
                ${index === qcList.length - 1 ? `
                    <button id="RemoveButton" class="btn btn-danger DynrowRemoveQC text-white flex-shrink-0 m-2" type="button" style="margin-top:0; height:25px; width:25px; padding:0;">
                        <i class="fas fa-minus"></i>
                    </button>
                    <img src="../assets/commonimages/dynamicattachmentproduction.png" class="AttachmentPopDyanmic" style="width: 24px;cursor: pointer;">
                    <div class="ProductionDynamicAttachmentModal modal" data-backdrop="static" style="display:none; padding-right: 3px;">
                        <div class="modal-dialog modal-dialog-centered modal-md" data-bs-loader-pms="static" data-bs-keyboard="false">
                            <div class="modal-content">
                                <div class="modal-header d-flex align-items-center justify-content-between">
                                    <h2>Production QC Mapping Attachment Info</h2>
                                    <span class="ProductionDynamicAttachmentModalClose close" style="font-size:30px;cursor:pointer;color:white;" title="Close">×</span>
                                </div>
                                <div class="modal-body DynamicAttachmentBind" style="max-height: 70vh; overflow-y: auto; overflow-x: hidden; padding: 0px 0px 10px 0px;">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
                                      <div class="border border-radius" style="background-color:#F1F0EF; max-height:10.5rem; height: 126px;">
                                          <label class="d-flex justify-content-center align-content-center m-1"
                                                  style="text-decoration: underline; color: #7D7C7C;"
                                                  onclick="Attachment(${numberIncr1})">
                                              <b class="attachlabel" style="white-space: nowrap; margin-left: 1px;">Click Here to Attach your files</b>
                                              <input type="file" id="fileInput${numberIncr1}" multiple class="custom-file-input" hidden>
                                          </label>
                                          <div class="file-preview d-flex justify-content-center" id="preview${numberIncr1}">
                                              <div class="attachrow">
                                                  <div class="attachcolumn">
                                                      <ul class="ExistFiles" id="selectedFiles${numberIncr1}"></ul>
                                                  </div>
                                                  <div class="attachcolumn existselectedFiles mt--3">
                                                      <ul class="DynamicExistselectedFiles" id="ExistselectedFiles${numberIncr1}"></ul>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </td>
        `;
    });

    html += `</tr>`;

    $(triggerElement).closest('tr').after(html);
}

$(document).on('click', '.AttachmentPopDyanmic', function () {
    const $modal = $(this).closest('td').find('.ProductionDynamicAttachmentModal');
    $modal.show();
});

$(document).on('click', '.ProductionDynamicAttachmentModalClose', function () {
    $(this).closest('.ProductionDynamicAttachmentModal').hide();
});

$(document).on('click', '#ProductionDynamicAttachmentModalClose', function () {
    $('#ProductionDynamicAttachmentModal').hide();
});

$(document).on('click', '#dynamicProduction .DynrowRemove', function () {
    var currentRow = $(this).closest("tr");

    if (currentRow.hasClass('ProductionQCMappingRow')) {
        currentRow.remove();
        var parentRow = currentRow.prevAll('.productionRow').first();
        var remainingQCRows = parentRow.nextUntil('.productionRow', '.ProductionQCMappingRow');

        if (remainingQCRows.length === 0) {
            var rowCount = $('#dynamicProduction .productionRow').length;
            if (rowCount > 1) {
                parentRow.remove();
            }
        }
    }

    else if (currentRow.hasClass('productionRow')) {
        var rowCount = $('#dynamicProduction .productionRow').length;

        currentRow.nextUntil('.productionRow', '.ProductionQCMappingRow').remove();
        currentRow.find('.AddStockBtn1').show();
        if (rowCount > 1) {
            currentRow.remove();
        }
    }
    TotalProducts();
    calculateQuantityTotalPET_RGB();
});

$(document).on('click', '.DynrowRemoveQC', function () {
    const qcRow = $(this).closest('tr');
    const dataRow = qcRow.attr('data-row');

    qcRow.remove();

    const matchingProductionRow = $(`.productionRow[data-row="${dataRow}"]`);
    matchingProductionRow.find('.AddStockBtn1').show();
});

$(document).on('input', '#tableForPopFilter', function () {
    applyTableFilterForProduction();
});

function applyTableFilterForProduction() {
    let filterValue = $('#tableForPopFilter').val().toLowerCase().trim();
    let visibleRowCount = 0;

    $('#dynamicProduction .AllProductEmptyRow').remove();

    $('#dynamicProduction .productionRow').each(function () {
        let $row = $(this);
        let ProductText = $row.find('select.productId option:selected').text().toLowerCase();

        let isVisible = ProductText.includes(filterValue);
        $row.toggle(isVisible);

        // Toggle the related QC rows (until the next productionRow)
        let $relatedQCRows = $row.nextUntil('.productionRow', '.ProductionQCMappingRow');
        $relatedQCRows.toggle(isVisible);

        if (isVisible) {
            visibleRowCount++;
        }
    });

    if (visibleRowCount === 0) {
        $('#dynamicProduction').append(`
            <tr class="AllProductEmptyRow">
                <td colspan="9" class="text-center text-danger">No matching products found.</td>
            </tr>
        `);
    }
}


let fileList = []; // Franchise selected files
function Attachment(Unique) {
    const fileInput = document.getElementById(`fileInput${Unique}`);
    const preview = document.getElementById('preview');
    const selectedFiles = document.getElementById(`selectedFiles${Unique}`);

    // Remove any existing event listener before adding a new one
    fileInput.replaceWith(fileInput.cloneNode(true));
    const newFileInput = document.getElementById(`fileInput${Unique}`);

    newFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);

        // Only add new files that are not already in the list
        files.forEach((file) => {
            if (!fileList.some(f => f.name === file.name)) {
                fileList.push(file);
                addFileToUI(file, selectedFiles);
                formDataMultiple.append('files[]', file); // Use 'file' directly
            }
        });

        preview.style.display = fileList.length > 0 ? 'block' : 'none';
    });
}

// Function to add file details to UI
function addFileToUI(file, selectedFiles) {
    const fileItem = document.createElement('li');
    const fileName = document.createElement('span');
    const downloadButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    fileName.textContent = file.name.length > 10 ? file.name.substring(0, 10) + '...' : file.name;

    downloadButton.type = 'button';
    deleteButton.type = 'button';

    downloadButton.innerHTML = `<i class="fas fa-download" data-id="${file.name}"></i>`;
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
        fileList = fileList.filter(f => f.name !== file.name);
        fileItem.remove();

        let newFormData = new FormData();
        fileList.forEach(f => newFormData.append('files[]', f));

        formDataMultiple = newFormData;

        if (fileList.length === 0) {
            document.getElementById('preview').style.display = 'none';
        }
    });

    fileItem.appendChild(fileName);
    fileItem.appendChild(downloadButton);
    fileItem.appendChild(deleteButton);

    selectedFiles.appendChild(fileItem);
}

$(document).on('click', '#existImagePath', function (e) {
    e.preventDefault();

    let path = $(this).attr('href');
    let fileName = $(this).find('i').data('id');
    if (path) {
        const link = document.createElement('a');
        link.href = encodeURI(path);
        link.download = fileName || '';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var hrefValue = $('#existImagePath').attr('href');
    deletedFiles.push({
        ProductionAttachmentId: null,
        AttachmentFileName: fileText,
        AttachmentFilePath: hrefValue,
        ProductionProductMappingId: null,
        ProductionId: null,
        RowNumber: null,
    });
    $(listItem).remove();
    $('#fileInput').prop('disabled', false);
});