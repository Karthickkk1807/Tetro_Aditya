var productId = 0;
var PlantMappingId = 0;
var PlantDropdown = [];
var ProducTab = 0;
var titleForHeaderProductTab = "";
var dynamicInputsHtmlForManPower = "";
var dynamicInputsHtmlForRawMaterial = "";
var UnitDropDown = [];
var ProductDropDown = [];
var ProductDropDownManPower = [];
var TranistProductDropDown = [];
var IsTrigger = true;

$(document).ready(async function () {

    titleForHeaderProductTab = "Raw Material";

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));
    Common.ajaxCall("GET", "/Product/GetProduct", { PlantId: parseInt(PlantMappingId), ProductTypeId: parseInt(1) }, ProductSuccess, null);
    Common.bindDropDownParent('PrimaryUnitId', 'ProductInfoForm', 'Unit');
    Common.bindDropDownParent('SecondaryUnitId', 'ProductInfoForm', 'Unit');
    Common.bindDropDownParent('ProductTypeId', 'ProductInfoForm', 'ProductType');
    Common.bindDropDownParent('ProductCategoryId', 'ProductInfoForm', 'ProductCategory');
    Common.bindDropDownParent('TaxInfoId', 'ProductInfoForm', 'TaxInfo');

    $('#ProcessBtnhide').show();
    $('#ManPowerInfoBtn').hide();
    $('#RawMaterialInfoBtn').hide();

    var UnitDropDownData = await Common.bindDropDownSync('Unit');
    UnitDropDown = JSON.parse(UnitDropDownData);

    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(PlantMappingId), ModuleName: 'FranchiseProduct' }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            ProductDropDown = [data[0]];
        }
    }, null);
    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: null, ModuleName: 'ManPower_ProductType' }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            ProductDropDownManPower = [data[0]];
        }
    }, null);
    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(null), ModuleName: 'TransitProduct' }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            TranistProductDropDown = [data[0]];
        }
    }, null);

    $("#FormProductPlantData").validate({
        errorPlacement: function (error, element) {
            if (element.hasClass("select2-hidden-accessible")) {
                error.insertAfter(element.next(".select2-container"));
            } else {
                error.insertAfter(element);
            }
        },
        rules: {
            "employeeName[]": {
                required: true
            }
        },
        messages: {
            "employeeName[]": {
                required: "This field is required."
            }
        }
    });

    var PlantData = await Common.bindDropDownSync('Plant');
    PlantDropdown = JSON.parse(PlantData);

    $('.ProductFlavors').hide();
    $('#ProductProcessHide').hide();
    $('#RawMaterialInfoHide').hide();
    $('.ProductDescription').removeClass('col-lg-12 col-md-12 col-sm-12 col-12').addClass('col-lg-6 col-md-6 col-sm-6 col-6');

    $(document).on('click', '#AddProduct', function () {
        $('#loader-pms').show();
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#ProductCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#ProductCanvas").css("width", "50%");
        } else {
            $("#ProductCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#ProductHeader').text('Add Product Details');
        productId = 0;
        $('#SaveProduct').text('Save').addClass('btn-success').removeClass('btn-update');
        Common.removevalidation('ProductInfoForm');
        $('#SecondaryUnitSymbol').text('Unit')
        $('#PrimaryUnitSymbol').text('1 Unit =');
        $("#ReorderLevelSymbol").text('Unit');
        $('#ProductTypeId').val('1');
        $('.ProductFlavors').hide();
        $('#ProductProcessHide').hide();
        $('#RawMaterialInfoHide').hide();
        $('.ProductDescription').removeClass('col-lg-12 col-md-12 col-sm-12 col-12').addClass('col-lg-6 col-md-6 col-sm-6 col-6');
        Common.bindDropDown('PlantName', 'Franchise');
        $('#BindPlantDyanimcData .PlantDetailsMappingInfo').remove();
        IsTrigger = true;

        dyanmicRow();
        $('#loader-pms').hide();
        $('#ProductInfoForm #ProductSubCategoryId').empty().append('<option value="">-- Select --</option>');
        $('#ProductCanvas .collapse').removeClass('show');
        $('#ProductCanvas #collapse1').addClass('show');
    });

    $(document).on('change', '#ProductCategoryId', function () {
        if (IsTrigger) {
            var $thisval = $(this).val();
            if ($thisval != "") {

                Common.ajaxCall("Post", "/Common/GetDropDownNotNull", JSON.stringify({ MasterInfoId: parseInt($thisval), ModuleName: "ProductSubCategory" }), function (response) {
                    if (response.status) {
                        $('#ProductInfoForm #ProductSubCategoryId').empty();
                        Common.bindParentDropDownSuccessForChosen(response.data, "ProductSubCategoryId", "ProductInfoForm");
                    }
                }, null);
            }
            else {
                $('#ProductInfoForm #ProductSubCategoryId').empty().append('<option value="">-- Select --</option>');
            }
        }
    });

    $(document).on('click', '#SaveProduct', async function () {
        var ValidOfProduct = $("#ProductInfoForm").valid();
        var ValidOfProduct1 = $("#FormProductPlantData").valid();
        var isFormValid = validateFormAccordions('.accordion');

        if (!ValidOfProduct) {
            $('#ConvertionValue-error').insertAfter('#ember325');
            return false;
        }

        if (!isFormValid || !ValidOfProduct || !ValidOfProduct1 || !validateQCNames()) {
            return false;
        }
        var DataProduct = JSON.parse(JSON.stringify(jQuery('#ProductInfoForm').serializeArray()));

        var objvalue = {};
        $.each(DataProduct, function (index, item) {
            objvalue[item.name] = item.value;
        });

        objvalue.ProductId = parseInt(productId) || null;
        objvalue.ProductTypeId = Common.parseInputValue('ProductTypeId') || null;
        objvalue.ProductCategoryId = Common.parseInputValue('ProductCategoryId') || null;
        objvalue.ProductSubCategoryId = Common.parseInputValue('ProductSubCategoryId') || null;
        objvalue.PrimaryUnitId = Common.parseInputValue('PrimaryUnitId') || null;
        objvalue.TaxInfoId = Common.parseInputValue('TaxInfoId') || null;
        objvalue.PrimaryPrice = Common.parseFloatInputValue('PrimaryPrice') || null;
        objvalue.ReOrderLevel = Common.parseFloatInputValue('ReOrderLevel') || null;

        //objvalue.IsDefault = $('#ProductInfoForm #IsDefault').is(':checked');

        //objvalue.CGST = Common.parseFloatInputValue('CGST') || null;
        //objvalue.SGST = Common.parseFloatInputValue('SGST') || null;
        //objvalue.IGST = Common.parseFloatInputValue('IGST') || null;
        //objvalue.CESS = Common.parseFloatInputValue('CESS') || null;

        var PlantData = [];
        var ClosestDiv = $('#BindPlantDyanimcData .PlantDetailsMappingInfo');
        $.each(ClosestDiv, function (index, values) {
            var ProductPlantMappingId = $(values).find('.productPlantMappingId').val();
            var ProductId = parseInt(productId) || null;
            var PlantId = $(values).find('.PlantName').val();
            var OpeningStock = $(values).find('.OpeningStock').val();
            var StockInHand = $(values).find('.StockInHand').val();
            PlantData.push({
                ProductPlantMappingId: parseInt(ProductPlantMappingId) || null,
                ProductId: ProductId,
                PlantId: parseInt(PlantId) || null,
                OpeningStock: parseFloat(OpeningStock),
                StockInHand: parseInt(StockInHand),
            });
        });

        objvalue.ProductPlantMappingDetails = PlantData;

        $('#loader-pms').hide();
        try {
            await Common.ajaxCall("POST", "/Product/InsertUpdateProductDetails", JSON.stringify(objvalue), ProductInsertUpdateSuccess, null);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    });

    function validateQCNames() {
        let isValid = true;
        $('.QCName').each(function () {
            if ($(this).val().trim() === '') {
                Common.warningMsg("Please Fill The Name In QC.");
                isValid = false;
                return false;
            }
        });

        return isValid;
    }

    $(document).on('click', '.navbar-tab', function () {

        $('#tableFilter').val('');

        titleForHeaderProductTab = $(this).text().trim();
        $('.navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderProductTab) {
                $(this).addClass('active');
            }
        });
        if (titleForHeaderProductTab == "Raw Material") {
            $('#ProductDynamic').empty('');
            var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                           <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ProductTable"></table>
                        </div>
                     </div>`;
            $('#ProductDynamic').append(html);
            //$('.QcMappingHide').show();
            $('#ProcessBtnhide').show();
            $('#AddProduct').show();
            Common.ajaxCall("GET", "/Product/GetProduct", { PlantId: parseInt(PlantMappingId), ProductTypeId: parseInt(1) }, ProductSuccess, null);
        }
        else if (titleForHeaderProductTab == "Un-Processed") {
            $('#ProcessBtnhide').hide();
            $('#AddProduct').hide();
            $('#ProductDynamic').empty('');
            var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                           <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ProductTable"></table>
                        </div>
                     </div>`;
            $('#ProductDynamic').append(html);
            Common.ajaxCall("GET", "/Product/GetProduct", { PlantId: parseInt(PlantMappingId), ProductTypeId: parseInt(2) }, ProductSuccess, null);
        }
        else if (titleForHeaderProductTab == "Processed") {
            $('#ProcessBtnhide').hide();
            $('#AddProduct').hide();
            $('#ProductDynamic').empty('');
            var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                           <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ProductTable"></table>
                        </div>
                     </div>`;
            $('#ProductDynamic').append(html);
            Common.ajaxCall("GET", "/Product/GetProduct", { PlantId: parseInt(PlantMappingId), ProductTypeId: parseInt(3) }, ProductSuccess, null);
        }
    });

    $(document).on('click', '.btn-edit', function () {
        $('#loader-pms').show();
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#ProductCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#ProductCanvas").css("width", "50%");
        } else {
            $("#ProductCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#ProductHeader').text('Edit Product Details');
        $('#SaveProduct').text('Update').addClass('btn-update').removeClass('btn-success');
        $('#BindPlantDyanimcData .PlantDetailsMappingInfo').remove();

        IsTrigger = false;
        productId = $(this).data('id');
        var plantId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Product/GetProductId", { ProductId: productId, PlantId: plantId }, EditProductSuccess, null);

        $('#ProductCanvas .collapse').removeClass('show');
        $('#ProductCanvas #collapse1').addClass('show');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#ProductCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        $('#ProductHeader').text('');
        $('#BindPlantDyanimcData .PlantDetailsMappingInfo').remove();
    });

    $(document).on('input', '.OpeningStock', function () {
        var OpeningStockVal = $(this).val();
        $(this).closest('.PlantDetailsMappingInfo').find('.StockInHand').val(OpeningStockVal);
    });

    $(document).on('click', '#PrimaryUnitId', function () {
        var thisval = $(this).val();
        if (thisval == '') {
            $('#PrimaryUnitSymbol').text(`1 Unit =`);
            $('#ReorderLevelSymbol').text(`Unit`);
            $('.ReorderLevelSymbol').each(function () {
                $(this).text('Unit');
            });
        } else {
            var selectedText = $('#PrimaryUnitId option:selected').text();
            $('#PrimaryUnitSymbol').text(`1 (${selectedText}) =`);
            $('#ReorderLevelSymbol').text(`${selectedText}`);
            $('.ReorderLevelSymbol').each(function () {
                $(this).text(`${selectedText}`);
            });
        }
    });

    $(document).on('click', '#SecondaryUnitId', function () {
        var thisval = $(this).val();
        if (thisval == '')
            $('#SecondaryUnitSymbol').text(`Unit`);
        else {
            var data = $('#SecondaryUnitId option:selected').text();
            $('#SecondaryUnitSymbol').text(`(${data})`);
        }
    });

    $(document).on('input', '.PrimaryPrice', function () {
        var thisval = $(this).val();
        var Unitval = parseFloat($('#ConvertionValue').val());
        if (!isNaN(thisval) && !isNaN(Unitval) && Unitval !== 0) {
            var DividedVal = thisval / Unitval;
            var totalval = parseFloat(DividedVal).toFixed(2);
            $('#SecondaryPrice').val(totalval);
        } else {
            $('#SecondaryPrice').val('');
        }
    });

    $(document).on('change', '#ProductTypeId', function () {
        var ProductTypeIdVal = $(this).val();
        if (ProductTypeIdVal == 2) { 
            $('#ProductProcessHide').show();
            $('#RawMaterialInfoHide').show();
            $('.ProductDescription').addClass('col-lg-12 col-md-12 col-sm-12 col-12').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
        }
        else { 
            $('#ProductProcessHide').hide();
            $('#RawMaterialInfoHide').hide();
            $('.ProductDescription').addClass('col-lg-6 col-md-6 col-sm-6 col-6').removeClass('col-lg-12 col-md-12 col-sm-12 col-12');
        }
    });

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var productId = $(this).data('id');
            Common.ajaxCall("GET", "/Product/DeleteProduct", { ProductId: productId }, ProductInsertUpdateSuccess, null);
        }
    });

    /*===================================================================== ManPowerInfo ============================================================================*/

    $(document).on('click', '#ManPowerInfoBtn', function () {
        $('#loader-pms').show();
        $('#TableMenPower').remove();
        $('#FormManpower #RawNoOfProducts').val('');

        Common.ajaxCall("GET", "/Product/GetManPower", null, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);

                // Build the table structure
                var tableHtml = `
                    <table class="table table-bordered" id="TableMenPower">
                        <thead>
                            <tr style="background: #a3c1df;"></tr>
                        </thead>
                        <tbody id="dynamicManpowerPet"></tbody>
                    </table>
                `;
                $('#FormManpower #TableManPowerBinding').append(tableHtml);

                var headerHtml = '';
                if (data[0] && data[0].length > 0) {
                    var firstItem = data[0][0];
                    for (var key in firstItem) {
                        if (firstItem.hasOwnProperty(key) && key !== 'UnitId' && key !== 'ProductTypeId' && key !== 'TetroONEnocount' && !key.includes('-')) {
                            var style = key === 'Qty' ? ' style="border-right: 2px solid #00aaff;"' : '';
                            if (key.includes('_')) {
                                var parts = key.split('_');
                                var displayName = parts[0];
                                var dataId = parts[1];
                                headerHtml += `<th data-id="${dataId}">${displayName}</th>`;
                            } else {
                                headerHtml += `<th${style}>${key}</th>`;
                            }
                        }
                    }
                }
                /*headerHtml += `<th style="border-right: 2px solid #00aaff;">Action</th>`;*/
                $('#FormManpower #TableManPowerBinding thead tr').append(headerHtml);

                data[0].forEach(function (value, index) {
                    var dynamicInputsHtmlForManPower = "";
                    var thlength = $('#TableManPowerBinding').find('th').length;
                    //var thisLenRemov = thlength - 1;
                    var thisLenTotManPowerRemov = thlength - 1;
                    var thisLenTotOperationsRemov = thlength - 2;

                    var UnitSelectOptions = "";
                    var ProductSelectOptions = "";
                    var defaultOption = '<option value="">--Select--</option>';

                    var ProductSelectOptions = ProductDropDownManPower[0].map(function (ProductTypeId) {
                        var isSelected = ProductTypeId.ProductTypeId == value.ProductTypeId ? 'selected' : '';
                        return `<option value="${ProductTypeId.ProductTypeId}" ${isSelected}>${ProductTypeId.ProductTypeName}</option>`;
                    }).join('');


                    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: null, ModuleName: 'Unit' }, function (response) {

                        if (response.status) {
                            var UnitDropDown = JSON.parse(response.data);
                            if (UnitDropDown != null && UnitDropDown.length > 0) {
                                var UnitSelectOptions = UnitDropDown[0].map(function (UnitVal) {
                                    var isSelected = UnitVal.UnitId == value.UnitId ? 'selected' : '';
                                    return `<option value="${UnitVal.UnitId}" ${isSelected}>${UnitVal.UnitName}</option>`;
                                }).join('');
                            }
                        }

                        for (var i = 0; i < thlength; i++) {
                            if (i === 0) {
                                dynamicInputsHtmlForManPower += `<td>
                                    <select class="form-control ProductTypeId" id="ProductTypeId" disabled name="ProductTypeId">
                                        ${defaultOption}${ProductSelectOptions}
                                    </select>
                                </td>`;
                            } else if (i === 1) {
                                dynamicInputsHtmlForManPower += `<td>
                                    <select class="form-control UnitId" id="UnitId" name="UnitId" disabled>
                                        ${defaultOption}${UnitSelectOptions}
                                    </select>
                                </td>`;
                            } else if (i === 2) {
                                dynamicInputsHtmlForManPower += `<td>
                                    <input type="text" class="form-control Qty" value="${value.Quantity || ''}" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,8)"/>
                                </td>`;
                            } else if (i === thisLenTotManPowerRemov) {
                                dynamicInputsHtmlForManPower += `<td>
                                    <input type="text" class="form-control TotManPower" value="${value.TotalManPower || ''}" disabled/>
                                </td>`;
                            } else if (i === thisLenTotOperationsRemov) {
                                dynamicInputsHtmlForManPower += `<td>
                                    <input type="text" class="form-control TotOperations" value="${value.TotalStages || ''}" disabled/>
                                </td>`;
                            }
                            //else if (i === thisLenRemov) {
                            //    dynamicInputsHtmlForManPower += `<td>
                            //        <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                            //            <button id="RemoveButton" class="btn DynrowRemove" type="button">
                            //                <i class="fas fa-trash-alt"></i>
                            //            </button>
                            //        </div>
                            //    </td>`;
                            //}
                            else {
                                var dataId = $('#TableManPowerBinding').find('th').eq(i).attr('data-id');
                                var matchingKey = Object.keys(value).find(function (key) {
                                    return key.endsWith('_' + dataId);
                                });
                                var colValue = matchingKey ? value[matchingKey] ?? '' : '';
                                var isDisabled = '';
                                if (matchingKey) {
                                    var statusKey = Object.keys(value).find(function (key) {
                                        return key.endsWith('-Status') && matchingKey.startsWith(key.split('-Status')[0]);
                                    });
                                    if (statusKey) {
                                        var statusVal = value[statusKey];
                                        isDisabled = (statusVal == 0 || statusVal == '0') ? 'disabled' : '';
                                    }
                                }
                                dynamicInputsHtmlForManPower += `<td>
                                    <input type="text" class="form-control ColDynamicInput" value="${colValue}" ${isDisabled} oninput="Common.allowOnlyNumberLength(this,3)">
                                </td>`;
                            }
                        }

                        var newRow = `<tr id="DynamicInputs">${dynamicInputsHtmlForManPower}</tr>`;
                        $('#TableManPowerBinding tbody').append(newRow);

                        var LenghtOfRows = $('#dynamicManpowerPet #DynamicInputs').length;
                        $('#FormManpower #RawNoOfProducts').val(LenghtOfRows);
                        $('#loader-pms').hide();
                        $('#ManPowerModal').show();
                    });

                });
            }
        }, null);
    });

    $(document).on('change', '#DynamicInputs .ProductTypeId', function () {
        var thisSelectedValue = $(this).val();
        var thisSelectElement = $(this);
        $('select.ProductTypeId').each(function (index, value) {
            var existVal = $(value).val();
            if (existVal == thisSelectedValue && value !== thisSelectElement[0] && existVal != null) {
                thisSelectElement.val("");
                $(thisSelectElement).val($('option:contains("--Select--")').val()).trigger('change');
                return false;
            }
        });

        var $row = $(this).closest('tr');
        var $unitDropdown = $row.find('.UnitId');

        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(thisSelectedValue), ModuleName: 'FinishedProductUnit' }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                $unitDropdown.empty();
                var dataValue = data[0];

                $unitDropdown.append($('<option>', {
                    value: '',
                    text: '--Select--'
                }));

                if (dataValue != null && dataValue.length > 0) {
                    var valueproperty = Object.keys(dataValue[0])[0];
                    var textproperty = Object.keys(dataValue[0])[1];

                    $.each(dataValue, function (index, item) {
                        $unitDropdown.append($('<option>', {
                            value: item[valueproperty],
                            text: item[textproperty]
                        }));
                    });
                }
            }
        }, null);
    });

    $(document).on('click', '#SaveManPower', function () {
        var ManPowerInsertData = [];
        var inputs = [];
        $('#loader-pms').show();

        $('#dynamicManpowerPet tr').each(function () {
            if ($(this).attr('id') === 'DynamicInputs') {
                var productTypeId = $(this).find('.ProductTypeId').val();
                var unitId = $(this).find('.UnitId').val();
                var Qty = $(this).find('.Qty').val();
                var TotOperations = $(this).find('.TotOperations').val();
                var TotManPower = $(this).find('.TotManPower').val();

                $(this).find('.ColDynamicInput').each(function () {
                    var value = $(this).val();
                    var index = $(this).closest('td, th').index();
                    var dataId = $(this).closest('table').find('th').eq(index).data('id');
                    var textId = $(this).closest('table').find('th').eq(index).text();
                    inputs.push({
                        ProductManPSMappingId: null,
                        ProductTypeId: parseInt(productTypeId) || null,
                        ProductionStagesId: parseInt(dataId) || null,
                        Value: parseInt(value) || null,
                    });
                });

                ManPowerInsertData.push({
                    ProductManPowerId: null,
                    ProductTypeId: parseInt(productTypeId) || null,
                    UnitId: parseInt(unitId) || null,
                    Quantity: parseFloat(Qty) || null,
                    TotalStages: parseInt(TotOperations) || null,
                    TotalManPower: parseInt(TotManPower) || null,
                });
            }
        });

        var objvalue = {};
        objvalue.productManPowerDetails = ManPowerInsertData;
        objvalue.productManPowerPSMappingDetails = inputs;

        Common.ajaxCall("POST", "/Product/InsertProductManPower", JSON.stringify(objvalue), ProductManPowerInsertSuccess, null);
    });

    $(document).on('click', '#ManPowerModalClose', function () {
        $('#ManPowerModal').hide();
    });

    $(document).on('click', '#TableManPowerBinding .DynrowRemove', function () {
        let tbody = $(this).closest("tr");
        let lenghtData = $('#dynamicManpowerPet #DynamicInputs').length

        if (lenghtData > 1) {
            tbody.remove();
        }
        var LenghtOfRows = $('#dynamicManpowerPet #DynamicInputs').length;
        $('#FormManpower #RawNoOfProducts').val(LenghtOfRows);
    });

    $(document).on("input", "#TableMenPower .ColDynamicInput", function () {
        let $row = $(this).closest("tr");
        let total = 0;
        let filledCount = 0;
        $row.find(".ColDynamicInput").each(function () {
            let value = $(this).val().trim();
            if (value !== "") {
                filledCount++;
                let num = parseFloat(value);
                if (!isNaN(num)) {
                    total += num;
                }
            }
        });
        $row.find(".TotManPower").val(total);
        $row.find(".TotOperations").val(filledCount);
    });


    /*===================================================================== RawMaterialInfo ============================================================================*/

    $(document).on('click', '#RawMaterialInfoBtn', function () {
        $('#tableFilter_RawMaterial').val('').trigger('input');
        $('#loader-pms').show();
        $('#TableRawMaterial').remove();
        $('#FormRawMaterial #RawNoOfProducts').val('');

        Common.ajaxCall("GET", "/Product/GetProductRawMaterial", { Type: parseInt(2), ModuleName: "RawMaterial" }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                // Build the table structure
                var tableHtml =
                    `
                    <table class="table table-bordered" id="TableRawMaterial">
                        <thead>
                            <tr style="background: #a3c1df;"></tr>
                        </thead>
                        <tbody id="dynamicRawMaterial"></tbody>
                    </table>
                `;
                $('#FormRawMaterial #TableRawMaterialBinding').append(tableHtml);

                var headerHtml = '';
                if (data[0] && data[0].length > 0) {
                    var firstItem = data[0][0];
                    for (var key in firstItem) {
                        if (firstItem.hasOwnProperty(key) && key !== 'UnitId' && key !== 'ProductId' && key !== 'TetroONEnocount' && !key.includes('-')) {
                            var style = key === 'Qty' ? ' style="border-right: 2px solid #00aaff;"' : '';
                            if (key === 'ProductName') {
                                headerHtml += `<th>${key}<strong class="ProductNameNo"></strong><span style=" visibility: hidden; ">1111</span></th>`;
                            } else if (key.includes('_')) {
                                var parts = key.split('_');
                                var displayName = parts[0];
                                var dataId = parts[1];
                                headerHtml += `<th data-id="${dataId}">${displayName}</th>`;
                            } else {
                                headerHtml += `<th${style}>${key}<span style=" visibility: hidden; "></span></th>`;
                            }
                        }
                    }
                }
                //headerHtml += `<th style="border-right: 2px solid #00aaff;">Action</th>`;
                $('#FormRawMaterial #TableRawMaterialBinding thead tr').append(headerHtml);
                let pendingRequests = data[0].length; // total number of iterations
                let completedRequests = 0;

                data[0].forEach(function (value, index) {
                    var dynamicInputsHtmlForManPower = "";
                    var thlength = $('#TableRawMaterialBinding').find('th').length;
                    //var thisLenRemov = thlength - 1;
                    var thisLenTotManPowerRemov = thlength - 1;
                    //var thisLenTotOperationsRemov = thlength - 1;

                    var UnitSelectOptions = "";
                    var ProductSelectOptions = "";
                    var defaultOption = '<option value="">--Select--</option>';

                    var ProductSelectOptions = TranistProductDropDown[0].map(function (ProductId) {
                        var isSelected = ProductId.ProductId == value.ProductId ? 'selected' : '';
                        return `<option value="${ProductId.ProductId}" ${isSelected}>${ProductId.ProductName}</option>`;
                    }).join('');

                    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(value.ProductId), ModuleName: 'TransitProductUnit' }, function (response) {
                        if (response.status) {
                            var UnitDropDown = JSON.parse(response.data);
                            if (UnitDropDown != null && UnitDropDown.length > 0) {
                                var UnitSelectOptions = UnitDropDown[0].map(function (UnitVal) {
                                    var isSelected = UnitVal.PrimaryUnitId == value.UnitId ? 'selected' : '';
                                    return `<option value="${UnitVal.PrimaryUnitId}" ${isSelected}>${UnitVal.PrimaryUnitName}</option>`;
                                }).join('');
                            }


                            for (var i = 0; i < thlength; i++) {
                                if (i === 0) {
                                    dynamicInputsHtmlForManPower += `<td>
                                        <select class="form-control ProductId" id="ProductId" name="ProductId" disabled required>
                                            ${defaultOption}${ProductSelectOptions}
                                        </select>
                                    </td>`;
                                } else if (i === 1) {
                                    dynamicInputsHtmlForManPower += `<td>
                                        <select class="form-control UnitId" id="UnitId" name="UnitId" required>
                                            ${defaultOption}${UnitSelectOptions}
                                        </select>
                                    </td>`;
                                } else if (i === thisLenTotManPowerRemov) {
                                    dynamicInputsHtmlForManPower += `<td><input type="text" class="form-control TotalRawMaterialsQty" required value="${value.TotalRawMaterialsQty || ''}" disabled/></td>`;
                                }
                                //else if (i === thisLenTotOperationsRemov) {
                                //    dynamicInputsHtmlForManPower += `<td><input type="text" class="form-control TotalRawMaterials" required value="${value.TotalRawMaterials || ''}" disabled/></td>`;
                                //}
                                //else if (i === thisLenRemov) {
                                //    dynamicInputsHtmlForManPower += `<td>
                                //        <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                                //            <button id="RemoveButton" class="btn DynrowRemove" type="button">
                                //                <i class="fas fa-trash-alt"></i>
                                //            </button>
                                //        </div>
                                //    </td>`;
                                //}
                                else {
                                    var dataId = $('#TableRawMaterialBinding').find('th').eq(i).attr('data-id');
                                    var matchingKey = Object.keys(value).find(function (key) {
                                        return key.endsWith('_' + dataId);
                                    });

                                    var colValue = matchingKey ? value[matchingKey] ?? '' : '';
                                    var isDisabled = '';
                                    if (matchingKey) {
                                        var statusKey = Object.keys(value).find(function (key) {
                                            return key.endsWith('-Status') && matchingKey.startsWith(key.split('-Status')[0]);
                                        });
                                        if (statusKey) {
                                            var statusVal = value[statusKey];
                                            isDisabled = (statusVal == 0 || statusVal == '0') ? 'disabled' : '';
                                        }
                                    }

                                    dynamicInputsHtmlForManPower += `<td><input type="text" class="form-control ColDynamicInput" value="${colValue}" ${isDisabled} oninput="Common.allowOnlyNumbersAndDecimalRawMaterial6Digit(this,8)"></td>`;

                                }

                            }

                            var newRow = `<tr id="DynamicInputs">${dynamicInputsHtmlForManPower}</tr>`;
                            $('#TableRawMaterialBinding tbody').append(newRow);


                            var LenghtOfRows = $('#dynamicRawMaterial #DynamicInputs').length;
                            //$('#FormRawMaterial #RawNoOfProducts').val(LenghtOfRows);
                            $('#FormRawMaterial .ProductNameNo').text(` (${LenghtOfRows})`);
                            $('#RawMaterialModal').show();
                            completedRequests++;
                            if (completedRequests === pendingRequests) {
                                $('#loader-pms').hide();
                            }
                        }
                    });
                });
            }
            else {
                Common.errorMsg(response.message);
                $('#loader-pms').hide();
            }
        }, null);
    });

    $(document).on('change', '#TableRawMaterialBinding .ProductId', function () {
        var thisSelectedValue = $(this).val();
        var thisSelectElement = $(this);
        $('select.ProductId').each(function (index, value) {
            var existVal = $(value).val();
            if (existVal == thisSelectedValue && value !== thisSelectElement[0] && existVal != null) {
                thisSelectElement.val("");
                $(thisSelectElement).val($('option:contains("--Select--")').val()).trigger('change');
                return false;
            }
        });

        var $row = $(this).closest('tr');
        var $unitDropdown = $row.find('.UnitId');

        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(thisSelectedValue), ModuleName: 'TransitProductUnit' }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                $unitDropdown.empty();
                var dataValue = data[0];

                $unitDropdown.append($('<option>', {
                    value: '',
                    text: '--Select--'
                }));

                if (dataValue != null && dataValue.length > 0) {
                    var valueproperty = Object.keys(dataValue[0])[0];
                    var textproperty = Object.keys(dataValue[0])[1];

                    $.each(dataValue, function (index, item) {
                        $unitDropdown.append($('<option>', {
                            value: item[valueproperty],
                            text: item[textproperty]
                        }));
                    });
                }
            }
        }, null);
    });

    $(document).on('click', '#SaveRawMaterial', function () {
        var ManPowerInsertData = [];
        var inputOfDyanmic = [];
        $('#loader-pms').show();

        $('#dynamicRawMaterial tr').each(function () {
            if ($(this).attr('id') === 'DynamicInputs') {
                var productId = $(this).find('.ProductId').val();
                var unitId = $(this).find('.UnitId').val();
                var Qty = $(this).find('.Qty').val();
                var TotalRawMaterials = $(this).find('.TotalRawMaterials').val();
                var TotalRawMaterialsQty = $(this).find('.TotalRawMaterialsQty').val();

                $(this).find('.ColDynamicInput').each(function () {
                    var value = $(this).val();
                    var index = $(this).closest('td, th').index();
                    var dataId = $(this).closest('table').find('th').eq(index).data('id');
                    var textId = $(this).closest('table').find('th').eq(index).text();
                    inputOfDyanmic.push({
                        ProductRawMaterialMappingId: null,
                        ProductId: parseInt(productId) || null,
                        RawMaterialId: parseInt(dataId) || null,
                        Value: parseFloat(value) || null
                    });
                });

                ManPowerInsertData.push({
                    ProductRawMaterialId: null,
                    ProductId: parseInt(productId) || null,
                    UnitId: parseInt(unitId) || null,
                    Quantity: parseFloat(Qty) || null,
                    TotalRawMaterials: parseInt(TotalRawMaterials) || null,
                    TotalRawMaterialsQty: parseInt(TotalRawMaterialsQty) || null,
                });
            }
        });

        var objvalue = {};
        objvalue.productRawMaterialDetails = ManPowerInsertData;
        objvalue.ProductRawMaterialMappingDetails = inputOfDyanmic;

        Common.ajaxCall("POST", "/Product/InsertProductRawMaterial", JSON.stringify(objvalue), ProductManPowerInsertSuccess, null);

    });

    $(document).on('click', '#RawMaterialClose', function () {
        $('#RawMaterialModal').hide();
    });

    $(document).on('click', '#addRawMaterialHtml', function () {
        var $lastRow = $('#dynamicRawMaterial tr:last');
        var $newRow = $lastRow.clone();

        $newRow.find('input').val('');
        $newRow.find('select').val('');

        $('#dynamicRawMaterial').append($newRow);

        var LenghtOfRows = $('#dynamicRawMaterial #DynamicInputs').length;
        //$('#FormRawMaterial #RawNoOfProducts').val(LenghtOfRows);
        $('#FormRawMaterial .ProductNameNo').text(`(${LenghtOfRows})`);
    });

    $(document).on('click', '#TableRawMaterialBinding .DynrowRemove', function () {
        let tbody = $(this).closest("tr");
        let lenghtData = $('#dynamicRawMaterial #DynamicInputs').length

        if (lenghtData > 1) {
            tbody.remove();
        }

        var LenghtOfRows = $('#dynamicRawMaterial #DynamicInputs').length;
        //$('#FormRawMaterial #RawNoOfProducts').val(LenghtOfRows);
        $('#FormRawMaterial .ProductNameNo').text(`(${LenghtOfRows})`);
    });

    $(document).on("input", "#TableRawMaterial .ColDynamicInput", function () {
        let $row = $(this).closest("tr");
        let total = 0;
        let filledCount = 0;
        $row.find(".ColDynamicInput").each(function () {
            let value = $(this).val().trim();
            if (value !== "") {
                let num = parseFloat(value);
                if (!isNaN(num) && num != 0) {
                    total += num;
                    filledCount++;
                }
            }
        });
        //$row.find(".TotalRawMaterialsQty").val(total);
        //$row.find(".TotalRawMaterials").val(filledCount);
        $row.find(".TotalRawMaterialsQty").val(filledCount);
    });

    $(document).on('input', '#ConvertionValue', function () {
        $('.PrimaryPrice').val('').trigger('input');
    })
});

function ProductSuccess(response) {
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

        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();

        if (activeTabText.includes("Raw Material")) {
            $('#CounterImage1').prop('src', '/assets/moduleimages/inventory/rawproducticon_1.svg');
            $('#CounterImage2').prop('src', '/assets/moduleimages/inventory/rawproducticon_2.svg');
            $('#CounterImage3').prop('src', '/assets/moduleimages/inventory/rawproducticon_3.svg');
            $('#CounterImage4').prop('src', '/assets/moduleimages/inventory/rawproducticon_4.svg');
            var columns = Common.bindColumn(data[1], ['ProductId', 'StockInHand_Colour']);
            bindTableProduct('ProductTable', data[1], columns, -1, 'ProductId', '330px', true, access);
        } else if (activeTabText.includes("Un-Processed")) {
            $('#CounterImage1').prop('src', '/assets/moduleimages/inventory/fgproducticon_1.svg');
            $('#CounterImage2').prop('src', '/assets/moduleimages/inventory/fgproducticon_2.svg');
            $('#CounterImage3').prop('src', '/assets/moduleimages/inventory/fgproducticon_3.svg');
            $('#CounterImage4').prop('src', '/assets/moduleimages/inventory/fgproducticon_4.svg');
            var columns = Common.bindColumn(data[1], ['ProductId', 'StockInHand_Colour']);
            var access1 = { create: false, delete: false, update: false, view: false }
            bindTableProduct('ProductTable', data[1], columns, -1, 'ProductId', '330px', false, access1);
        } else if (activeTabText.includes("Processed")) {
            $('#CounterImage1').prop('src', '/assets/moduleimages/inventory/fgproducticon_1.svg');
            $('#CounterImage2').prop('src', '/assets/moduleimages/inventory/fgproducticon_2.svg');
            $('#CounterImage3').prop('src', '/assets/moduleimages/inventory/fgproducticon_3.svg');
            $('#CounterImage4').prop('src', '/assets/moduleimages/inventory/fgproducticon_4.svg');
            var columns = Common.bindColumn(data[1], ['ProductId', 'StockInHand_Colour']);
            var access1 = { create: false, delete: false, update: false, view: false }
            bindTableProduct('ProductTable', data[1], columns, -1, 'ProductId', '330px', false, access1);
        }

        $('#loader-pms').hide();
    }
}

function ProductInsertUpdateSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#ProductCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        productId = 0;

        $('#ProductDynamic').empty('');
        var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                           <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ProductTable"></table>
                        </div>
                     </div>`;
        $('#ProductDynamic').append(html);
        $('#ProcessBtnhide').hide();
        var PlantMappingId = parseInt(localStorage.getItem('PlantId'));

        var PassingData = {};
        if (titleForHeaderProductTab == "Raw Material") {
            PassingData = { PlantId: parseInt(PlantMappingId), ProductTypeId: parseInt(1) }
            $('#ProcessBtnhide').show();
            Common.ajaxCall("GET", "/Product/GetProduct", PassingData, ProductSuccess, null);
        } else if (titleForHeaderProductTab == "Un-Processed") {
            $('#ProcessBtnhide').hide();
        } else if (titleForHeaderProductTab == "Processed") {
            $('#ProcessBtnhide').hide();
        }
    }
    else {
        Common.errorMsg(response.message);
    }
}

function EditProductSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);

        if (data[0][0].ProductTypeId == "1")
            $('#ProductTypeId').val('1').trigger('change');
        else if (data[0][0].ProductTypeId == "2")
            $('#ProductTypeId').val('2').trigger('change');

        var PrimaryText = data[0][0].PrimaryUnitName;
        var SecondaryText = data[0][0].SecondaryUnitName;

        $('#PrimaryUnitSymbol').text(`1 (${PrimaryText}) =`);
        $('#SecondaryUnitSymbol').text(`(${SecondaryText})`);
        $('#ReorderLevelSymbol').text(`${PrimaryText}`);

        if (data[0][0].productSubCategoryId) {
            Common.ajaxCall("Post", "/Common/GetDropDownNotNull", JSON.stringify({ MasterInfoId: data[0][0].ProductCategoryId, ModuleName: "ProductSubCategory" }), function (response) {
                if (response.status) {
                    $('#ProductSubCategoryId').empty();
                    Common.bindParentDropDownSuccessForChosen(response.data, "ProductSubCategoryId", "ProductInfoForm");
                    $('#ProductSubCategoryId').val(data[0][0].productSubCategoryId);

                    $('#BindPlantDyanimcData .PlantDetailsMappingInfo').empty('');
                    $.each(data[1], function (index, value) {

                        let numberIncr = Math.random().toString(36).substring(2);
                        var rowadd = $('.PlantDetailsMappingInfo').length
                        var DynamicLableNo = rowadd + 1;

                        var PlantSelectOptions = "";

                        var defaultOption = '<option value="">--Select--</option>';

                        var PlantSelectOptions = PlantDropdown[0].map(function (PlantId) {
                            var isSelected = PlantId.PlantId == value.PlantId ? 'selected' : '';
                            return `<option value="${PlantId.PlantId}" ${isSelected}>${PlantId.PlantName}</option>`;
                        }).join('');

                        var dynamicHTML = `

                            <div class="row PlantDetailsMappingInfo">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                                        <label class="DynamicLable">Plant Info ${DynamicLableNo}</label>
                                        <label class="productPlantMappingId d-none">${value.ProductPlantMappingId}</label>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-6 col-6 ProductCategory">
	        			            <div class="form-group">
	        				            <label>Plant Name<span id="Asterisk">*</span></label>
	        				            <select class="select PlantName" id="PlantName${numberIncr}" name="PlantName${numberIncr}" required>
                                             ${defaultOption}${PlantSelectOptions}
	        				            </select>
	        			            </div>
	        		            </div>
	                             <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div class="form-group">
                                        <label>Opening Stock<span id="Asterisk">*</span></label>
                                        <div id="ember325" class="input-group ember-view" style="flex-wrap: nowrap;">
                                            <input type="text" class="form-control OpeningStock" id="OpeningStock${numberIncr}" name="OpeningStock${numberIncr}" placeholder="Ex: 1250" value="${value.OpeningStock}" autocomplete="off" onclick="Common.allowOnlyNumbersAndDecimalInventory(this,5)" required disabled>
                                            <button class="btn btn-secondary p-0 ReorderLevelSymbol" type="button" style="padding: 4px !important;border-top-left-radius: 0;border-bottom-left-radius: 0;font-size:12px; width: 48px;"> ${value.PrimaryUnitName} </button>
                                        </div>
                                    </div>
                                </div> 
	                             <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                    <div class="form-group">
                                       <label>Stock In Hand</label>
                                        <div id="ember325" class="input-group ember-view" style="flex-wrap: nowrap;">
                                            <input type="text" class="form-control StockInHand" id="StockInHand${numberIncr}" name="StockInHand${numberIncr}" placeholder="Ex: 1250" value="${value.StockInHand}" autocomplete="off" disabled>
                                            <button class="btn btn-secondary p-0 ReorderLevelSymbol" type="button" style="padding: 4px !important;border-top-left-radius: 0;border-bottom-left-radius: 0;font-size:12px; width: 48px;"> ${value.PrimaryUnitName} </button>
                                        </div>
                                    </div>
                                </div>  
                                 <div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-2 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                                    <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                                        <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                </div>
                             </div>
                        `;

                        $('#FormProductPlantData #BindPlantDyanimcData').append(dynamicHTML);
                        $('.PlantName').each(function () {
                            $(this).select2({
                                dropdownParent: $(this).parent()
                            });
                        });
                    });
                    IsTrigger = true;
                }
            }, null);
        }
    }
    updateRemoveButtons();
    $('#loader-pms').hide();
}

function dyanmicRow() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.PlantDetailsMappingInfo').length
    var DynamicLableNo = rowadd + 1;

    var PlantSelectOptions = "";

    var defaultOption = '<option value="">--Select--</option>';

    var Initial = parseInt(0);
    if (PlantDropdown != null && PlantDropdown.length > 0 && PlantDropdown[0].length > 0) {
        PlantSelectOptions = PlantDropdown[0].map(function (PlantId) {
            return `<option value="${PlantId.PlantId}">${PlantId.PlantName}</option>`;
        }).join('');
        var numberOfOptions = PlantDropdown[0].length;
        var DropDownVal = parseInt(numberOfOptions);
    }
    if (typeof Initial === 'number' && typeof DropDownVal === 'number' && rowadd < DropDownVal) {
        var dynamicHTML =
            `
            <div class="row PlantDetailsMappingInfo">
                <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                        <label class="DynamicLable">Plant Info ${DynamicLableNo}</label>
                        <label class="productPlantMappingId d-none"></label>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-6 col-6 ProductCategory">
	    		    <div class="form-group">
	    			    <label class="FranchiseLable">Plant Name<span id="Asterisk">*</span></label>
	    			    <select class="select PlantName" id="PlantName${numberIncr}" name="PlantName${numberIncr}" required>
                                ${defaultOption}${PlantSelectOptions}
	    			    </select>
	    		    </div>
	    	    </div>
	             <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Opening Stock<span id="Asterisk">*</span></label>
                        <div id="ember325" class="input-group ember-view" style="flex-wrap: nowrap;">
                            <input type="text" class="form-control OpeningStock" id="OpeningStock${numberIncr}" name="OpeningStock${numberIncr}" placeholder="Ex: 1250" autocomplete="off" onclick="Common.allowOnlyNumbersAndDecimalInventory(this,5)" required>
                            <button class="btn btn-secondary p-0 ReorderLevelSymbol" type="button" style="padding: 4px !important;border-top-left-radius: 0;border-bottom-left-radius: 0;font-size:12px; width: 48px;"> Unit </button>
                        </div>
                    </div>
                </div>  
	             <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Stock In Hand</label>
                        <div id="ember325" class="input-group ember-view" style="flex-wrap: nowrap;">
                            <input type="text" class="form-control StockInHand" id="StockInHand${numberIncr}" name="StockInHand${numberIncr}" placeholder="Ex: 1250" autocomplete="off" onclick="Common.allowOnlyNumbersAndDecimalInventory(this,5)" disabled required>
                            <button class="btn btn-secondary p-0 ReorderLevelSymbol" type="button" style="padding: 4px !important;border-top-left-radius: 0;border-bottom-left-radius: 0;font-size:12px; width: 48px;"> Unit </button>
                        </div>
                    </div>
                </div>    
                <div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-2 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                    <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                        <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
             </div>
        `;
    }
    $('#FormProductPlantData #BindPlantDyanimcData').append(dynamicHTML);
    $('.PlantName').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });
    $('.PlantName').val(PlantMappingId).trigger('change');

    updateRemoveButtons();
}

function updateRowLabels() {
    $('.PlantDetailsMappingInfo').each(function (index) {
        $(this).find('.DynamicLable').text('Plant Info ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.PlantDetailsMappingInfo');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow');
        if (rows.length == 1) {
            removeButtonDiv.css('display', 'none');
        } else {
            removeButtonDiv.css('display', 'block');
        }
    });
}

function removeRow(button) {
    var totalRows = $('.PlantDetailsMappingInfo').length;
    if (totalRows > 1) {
        $(button).closest('.PlantDetailsMappingInfo').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
}

function ProductManPowerInsertSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#loader-pms').hide();
        $('#ManPowerModal').hide();
        $('#RawMaterialModal').hide();
    } else {
        $('#loader-pms').hide();
        Common.errorMsg(response.message);
    }
}

$('.accordion-header').on('click', function () {
    var $offcanvas = $(this).closest('.offcanvas-container');
    var $accordion = $(this).closest('.accordion');
    var target = $(this).find('a').attr('data-target');
    $offcanvas.find('.collapse').not(target).collapse('hide');
    $(target).collapse('toggle');
});

$('#tableFilter_RawMaterial').on('keyup', function () {
    var searchText = $(this).val().toLowerCase().trim();
    let visibleRowCount = 0;

    $('#TableRawMaterial .AllProductEmptyRow').remove(); // Clean old message

    $('#TableRawMaterial tbody tr#DynamicInputs').each(function () {
        let productName = $(this).find('select.ProductId option:selected').text().toLowerCase();
        let unitName = $(this).find('select.UnitId option:selected').text().toLowerCase();

        let isVisible = productName.includes(searchText) || unitName.includes(searchText) || searchText === "";

        $(this).toggle(isVisible);
        if (isVisible) visibleRowCount++;
    });

    $('.ProductNameNo').text(` (${visibleRowCount})`);

    if (visibleRowCount === 0) {
        $('#TableRawMaterial').hide();

        // Remove old content first
        $('#TableRawMaterialBindingNoRecordFound').empty();

        // Append a single "No records found" message table
        $('#TableRawMaterialBindingNoRecordFound').append(`
            <table class="table table-bordered table-sm text-center" style="width: 100%;">
                <thead style="background: #c0daf5; line-height: 2.5;">
                    <tr>
                        <th>ProductName (0)</th>
                        <th>UnitName</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="line-height: 3.5;">
                        <td colspan="2" class="text-muted">
                            <div class="d-flex align-items-center justify-content-center">
                                <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px; width: 30px;">
                                <span>No records found</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        `);
    } else {
        $('#TableRawMaterial').show();
        $('#TableRawMaterialBindingNoRecordFound').empty();
    }
});

function validateFormAccordions(accordionSelector, errorMessageDefault = 'This field is required') {
    let isFormValid = true;
    let firstInvalidAccordion = null;

    $(accordionSelector).each(function () {
        const $accordion = $(this);
        //const headerText = $accordion.find('.accordion-header strong').text().trim();
        const requiredFields = $accordion.find('input[required], select[required], textarea[required]');
        let isCurrentValid = true;

        requiredFields.each(function () {
            const $input = $(this);
            const errorMessage = $input.data('error-message') || errorMessageDefault;

            if (!$input.val() || !$input.val().trim()) {
                $input.addClass('is-invalid error');
                if (!$input.next('.invalid-feedback').length) {
                    $input.after(`<div class="invalid-feedback d-none">${errorMessage}</div>`);
                }
                isFormValid = isCurrentValid = false;
                if (!firstInvalidAccordion) firstInvalidAccordion = $accordion;
            } else {
                $input.removeClass('is-invalid error');
                $input.next('.invalid-feedback').remove();
            }
        });

        if (isCurrentValid) {
            $accordion.find('.collapse').collapse('hide');
        }
    });

    if (firstInvalidAccordion) {
        firstInvalidAccordion.find('.collapse').collapse('show');
    }
    return isFormValid;
}


function bindTableProduct(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($('#' + tableid).length && $.fn.DataTable.isDataTable('#' + tableid)) {
        try {
            //$('#' + tableid).DataTable().clear().destroy();
        } catch (error) {
            console.error('DataTable destroy error:', error);
            return; // stop execution if there's an error
        }
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    //var secondaryStockIndex = columns.findIndex(column => column.data === "SecondaryStock");
    var CurrentStockIndex = columns.findIndex(column => column.data === "CurrentStock");

    if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [
        {
            "targets": CurrentStockIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.StockInHand_Colour != null && row.StockInHand_Colour.length > 0) {
                    //var dataText = row.SecondaryStock;
                    var dataText = row.CurrentStock;
                    let data = dataText.split(/ (.+)/);

                    var statusColor = row.StockInHand_Colour.toLowerCase();

                    return '<div>' + '<span style="color:' + statusColor + ';width: 99px;font-size: 12px;height: 20px;">' + data[0] + '</span>' + '<span>' + ' ' + data[1] + '</span>' + '</div>'
                }
                return data;
            }
        }
    ];

    if (access.update || access.delete) {
        renderColumn.push(
            {
                targets: actionTarget,
                render: function (data, type, row, meta) {
                    var editCondition = access.update;
                    var deleteCondition = access.delete;
                    if (editCondition || deleteCondition) {
                        return `
                                 ${editCondition ? `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-delete alert_delete mx-1"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
                    }
                }
            }
        )
    }
    var lang = {};
    var screenWidth = $(window).width();
    if (screenWidth <= 575) {
        var lang = {
            "paginate": {
                "next": ">",
                "previous": "<"
            }
        }
    }

    var table = $('#' + tableid).DataTable({
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
        "lengthMenu": [7, 14, 50],
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "columnDefs": !isTetroONEnocount
            ? renderColumn : [],
    });
    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });
    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}