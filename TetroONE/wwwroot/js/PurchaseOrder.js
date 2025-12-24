var deletedFiles = [];
var existFiles = [];
var ProductIdArray = [];
var formDataMultiple = new FormData();
var EditPurchaseId = 0;
var PlantMappingId = 0;
var printType = "";
var TriggerValues = true;

$(document).ready(function () {
    $('.Status-Div').removeClass('d-block').addClass('d-none');

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

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
        $('#tableFilter').val('');

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", { PlantId: parseInt(PlantMappingId), PurchaseOrderId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetPurchaseOrderSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", { PlantId: parseInt(PlantMappingId), PurchaseOrderId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetPurchaseOrderSuccess, null);
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
            $('#increment-month-btn2').show();
        }
    }

    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#tableFilter').val('');
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
            Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", { PlantId: parseInt(PlantMappingId), PurchaseOrderId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetPurchaseOrderSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        $('#tableFilter').val('');

        displayedDate = new Date(currentYear, currentMonth);
        $('#increment-month-btn2').show();

        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", { PlantId: parseInt(PlantMappingId), PurchaseOrderId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetPurchaseOrderSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", { PlantId: parseInt(PlantMappingId), PurchaseOrderId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetPurchaseOrderSuccess, null);

    $(document).on('click', '#AddPurchaseOrderBtn', function () {
        EditPurchaseId = 0;
        $('#POTopHeadbind').empty();
        bindHeaderNormal();
        VendorAlignmentClose();

        Common.bindDropDownParent('BillFrom', 'FormBillFrom', 'BillFrom');
        Common.bindDropDownParent('Vendor', 'FormVendor', 'Vendor');
        Common.bindDropDownParent('AlternativeCompanyAddress', 'FormShipping', 'PlantBillFrom');

        $("#ModalHeading").text("Add Purchase Order");

        $('#TypeOfRequest').empty().append('<option value="">--Select--</option>');
        $('#RequestNo').empty().append('<option value="">--Select--</option>');
        $("#PurchaseOrderStatusId").val('');
        $('#POProductTablebody .ProductTableRow').remove();

        $("#PurchaseOrderSaveBtn span:first").text("Save");
        $("#btnPordersaveprintbtn span:first").text("Save & Print");
        $("#btnPreviewPorder span:first").text("Save & Preview");

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);
        $('#PurchaseOrderDate').val(formattedDate);
        $('#ExpectedDeliveryDate').attr('min', formattedDate);

        TriggerValues = true;
        EditPurchaseId = 0;
        ProductIdArray = [];
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        $('.Status-Div').hide();
        Common.removevalidation('FormBillFrom');

        var EditDataId = { ModuleName: 'PurchaseOrder', ModuleId: null }
        Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, function (response) {
            if (response.status);
            Common.bindDropDownSuccess(response.data, "PurchaseOrderStatusId");
            $('#PurchaseOrderStatusId').val(1).trigger('change');
        }, null);

        ClearInputs(); // Clear inputs

        $('#PurchaseOrderModal').show();
        $("#PurchaseOrderModal .modal-body").animate({ scrollTop: 0 }, "fast");
    });

    $(document).on('click', '#toggleShipTo, #toggleIconShipTo', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const $rows = $('#VendorColumn .row.mt-3, #ShippingColumn .row.mt-3');
        const isCurrentlyVisible = $rows.is(':visible');
        $rows.stop(true, true).slideToggle(300);
        $('#toggleIconShipTo').toggleClass('fa-chevron-up fa-chevron-down');
        $('#VendorColumn .BilAddHead, #ShippingColumn .BilAddHead').css('border-bottom', '1px solid #c7c7c7');
    });

    $(document).on('click', '#PurchaseOrderCancelBtn, #PurchaseOrderClose', function () {
        $('#PurchaseOrderModal').hide();
    });

    $(document).on('click', '#CloseInAddItem', function () {
        $('#AddProductModal').hide();
    });

    $(document).on('click', '#AddVendorLable', function () {
        VendorAlignmentOpen();
        $('#BillFrom').val('1').trigger('change');
        $('#AlternativeCompanyAddress').val(PlantMappingId).trigger('change');
    });

    $(document).on('change', '#VendorColumn #Vendor', async function () {
        if (TriggerValues) {
            var BillToId = $('#VendorColumn #Vendor').val();
            $('#POProductTablebody .ProductTableRow').remove();
            ClearInputs(); // Clear inputs

            if (BillToId != "" || BillToId != null) {
                var response = await Common.getAsycData("/Common/VendorDetailsByVendorId?vendorId=" + parseInt(BillToId));
                if (response !== null) {
                    BillToAddress(response);
                    updateGSTVisibility('#VendorStateName', '#StateName');
                }
            }
            else {
                BillToAddressClear();
            }
        }
    });

    $(document).on('change', '#AlternativeCompanyAddress', function () {
        if (TriggerValues) {
            var ShipToId = $(this).val();
            $('#POProductTablebody .ProductTableRow').remove();
            ClearInputs(); // Clear inputs

            Common.ajaxCall("GET", "/Settings/GetPlantDetails", { PlantId: parseInt(ShipToId) }, function (responsePlant) {
                if (responsePlant !== null) {
                    ShipToAddress(responsePlant);
                    updateGSTVisibility('#VendorStateName', '#StateName');
                }
            }, null);
            if (ShipToId != "" || ShipToId != null) {
                updateGSTVisibility('#VendorStateName', '#StateName');
            } else {
                ShipToAddressClear();
            }

            var ShipId = $('#ShippingColumn #AlternativeCompanyAddress').val();
            var EditDataId = { ModuleName: 'PurchaseOrder', PlantId: ShipId };

            Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
                Common.AutoGenerateNumberGet(response, "PurchaseOrderNumber", "PurchaseOrderNo");
            });
        }
    });

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

    $(document).on('click', '#AddItemBtn', function () {
        var FromBranch = $('#FromAddressId').val();
        if (FromBranch != "") {

            $('#loader-pms').show();
            $('#AdditemSearch').val('');
            updateSelectedItemCount();
            $("#ItemSelectedCount").text('0');
            $("#TotalItemsAmount").text('₹ 0.00/-');
            $('#TotalItemSelect').text('');
            $('.TotalSelectedItmsPra').hide();
            $('#product-table-body').empty('');
            $('#product-table-body .AllProductEmptyRow').remove();
            var vendorId = $('#Vendor').val();
            $.ajax({
                type: 'GET',
                dataType: "json",
                url: 'PurchaseOrder/GetProduct',
                data: {
                    ModuleName: "Purchase",
                    VendorId: parseInt(vendorId),
                    PlantId: parseInt(PlantMappingId),
                },
                success: function (response) {
                    GetProductPopSuccess(response);
                },
                error: function (response) {
                }
            });
        }
        else {
            Common.warningMsg("Choose From Address.");
        }
    });

    $(document).on('click', '.addQtyBtn', function () {
        $(this).hide();
        $(this).closest('td').find('.OtyColumn').toggleClass('d-none');
        updateSelectedItemCount();
    });

    $(document).on('change', '#product-table-body .AllProductRowItem input[type="checkbox"]', function () {
        updateSelectedItemCount();
    });

    $(document).on('change', '#product-table-body .AllProductRowItem input[type="checkbox"]', function () {
        updateSelectedItemCount();
    });


    $(document).on('click', '#PurchaseOrderSaveBtn', function () {

        savePurchaseOrder(function () {

            $("#PurchaseOrderModal").hide();

            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall(
                "GET",
                "/PurchaseOrder/GetPurchaseOrder",
                {
                    PlantId: parseInt(PlantMappingId),
                    PurchaseOrderId: null,
                    FromDate: fnData.startDate.toISOString(),
                    ToDate: fnData.endDate.toISOString()
                },
                GetPurchaseOrderSuccess,
                null
            );
        });

    });


    function savePurchaseOrder(callback) {

        getExistFiles();

        var RightSideHeaderFormIsValid = $("#FormRightSideHeader").validate().form();
        var ShippingFormIsValid = $("#FormShipping").validate().form();
        var VendorFormIsValid = $("#FormVendor").validate().form();
        var StatusFormIsValid = $("#FormStatus").validate().form();
        var BillFromIsValid = $("#FormBillFrom").validate().form();

        if (!RightSideHeaderFormIsValid || !ShippingFormIsValid || !VendorFormIsValid || !StatusFormIsValid || !BillFromIsValid) {
            return;
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

        var PurchaseOrderDetailsStatic;
        var vendorId = $('#Vendor').val();
        var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();

        var POStatusId = $('#PurchaseOrderStatusId option:selected').text();
        POStatusId = (POStatusId == '-- Select --') ? null : $('#PurchaseOrderStatusId').val();

        PurchaseOrderDetailsStatic = {
            PurchaseOrderId: EditPurchaseId > 0 ? EditPurchaseId : null,
            VendorId: parseInt(vendorId),
            BillFromPlantId: parseInt($('#BillFrom').val()),
            ShipToPlantId: parseInt(alternativeCompanyAddress),
            PlantId: PlantMappingId || null,
            PurchaseOrderNo: $('#PurchaseOrderNumber').val(),
            PurchaseOrderDate: $('#PurchaseOrderDate').val(),
            ExpectedDeliveryDate: $('#ExpectedDeliveryDate').val(),
            SubTotal: parseFloat($('#Subtotal').val() || 0.00),
            RoundOffValue: parseFloat($('#roundOff').val() || 0.00),
            GrantTotal: parseFloat($('#GrantTotal').val() || 0.00),
            Notes: $('#AddNotesText').val(),
            TermsAndCondition: $('#TermsAndCondition').val(),
            PurchaseOrderStatusId: parseInt(POStatusId),
        };

        var PurchaseOrderProductMappingDetails = [];

        $('#POProductTablebody .ProductTableRow').each(function () {
            var $rowTable = $(this);
            var productId = $rowTable.data('product-id');
            //var productInfoStr = $rowTable.attr('data-product-info');
            var PurchaseOrderProductMappingId = $rowTable.attr('data-productmapping-id');
            //var productInfo = JSON.parse(productInfoStr);

            var productDetail = {
                PurchaseOrderProductMappingId: PurchaseOrderProductMappingId == null ? null : parseInt(PurchaseOrderProductMappingId),
                ModuleId: EditPurchaseId > 0 ? EditPurchaseId : null,
                ProductId: parseInt(productId),
                PurchasePrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()),
                Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val() || 0),
                UnitId: parseInt($rowTable.find('.ForBindtableProductUnit').val()),
                ProductDescription: $rowTable.find('.descriptiontdtext').val(),
                SubTotal: Common.parseFloatValue($rowTable.find('.SubTotalQty').val()),
                CGST_Percentage: Common.parseFloatValue($rowTable.find('.CGST input').val().replace('%', '').trim()),
                CGST_Value: Common.parseFloatValue($rowTable.find('.CGST .CGSTAmount').text().trim()),
                SGST_Percentage: Common.parseFloatValue($rowTable.find('.SGST input').val().replace('%', '').trim()),
                SGST_Value: Common.parseFloatValue($rowTable.find('.SGST .SGSTAmount').text().trim()),
                IGST_Percentage: Common.parseFloatValue($rowTable.find('.IGST input').val().replace('%', '').trim()),
                IGST_Value: Common.parseFloatValue($rowTable.find('.IGST .IGSTAmount').text().trim()),
                CESS_Percentage: Common.parseFloatValue($rowTable.find('.CESS input').val().replace('%', '').trim()),
                CESS_Value: Common.parseFloatValue($rowTable.find('.CESS .CESSAmount').text().trim()),
                TotalAmount: Common.parseFloatValue($rowTable.find('.Total input').val()),
            };
            PurchaseOrderProductMappingDetails.push(productDetail);
        });

        formDataMultiple.append("PurchaseOrderDetailsStatic", JSON.stringify(PurchaseOrderDetailsStatic));
        formDataMultiple.append("PurchaseOrderProductMappingDetails", JSON.stringify(PurchaseOrderProductMappingDetails));
        formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
        formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

        $.ajax({
            type: "POST",
            url: "/PurchaseOrder/InsertUpdatePurchaseOrder",
            data: formDataMultiple,
            contentType: false,
            processData: false,
            success: function (response) {

                if (response.status) {
                    formDataMultiple = new FormData();
                    Common.successMsg(response.message);

                    // 🔑 Return PurchaseOrderId
                    if (callback) {
                        var dataId = JSON.parse(response.data);
                        callback(dataId[0][0].PurchaseOrderId);
                    }

                } else {
                    Common.errorMsg(response.message);
                }
            },
            error: function (response) {
                Common.errorMsg(response.message);
            }
        });


    }
    //$(document).on('click', '#PurchaseOrderSaveBtn', function () {

    //    getExistFiles();

    //    var RightSideHeaderFormIsValid = $("#FormRightSideHeader").validate().form();
    //    var ShippingFormIsValid = $("#FormShipping").validate().form();
    //    var VendorFormIsValid = $("#FormVendor").validate().form();
    //    var StatusFormIsValid = $("#FormStatus").validate().form();
    //    var BillFromIsValid = $("#FormBillFrom").validate().form();
    //    if (!RightSideHeaderFormIsValid || !ShippingFormIsValid || !VendorFormIsValid || !StatusFormIsValid || !BillFromIsValid) {
    //        $('#PurchaseOrderStatusId-error').insertAfter('#statusError');
    //        $('#Vendor-error').insertAfter('.vendorerror');
    //        $('#AlternativeCompanyAddress-error').insertAfter('.AlternativeCompanyError');
    //        $('#loader-pms').hide();
    //        return false;
    //    }

    //    var vendorInput = $('#Vendor').val();

    //    if (vendorInput == '') {
    //        Common.warningMsg('Click + Add Vendor and Fill the Input');
    //        $('#loader-pms').hide();
    //        return false;
    //    }

    //    var TableLenthDynamicRow = $('.ProductTableRow').length;
    //    if (TableLenthDynamicRow == 0) {
    //        Common.warningMsg('Choose Atleast One Product');
    //        $('#loader-pms').hide();
    //        return false;
    //    }

    //    var PurchaseOrderDetailsStatic;
    //    var vendorId = $('#Vendor').val();
    //    var alternativeCompanyAddress = $('#AlternativeCompanyAddress').val();

    //    var POStatusId = $('#PurchaseOrderStatusId option:selected').text();
    //    POStatusId = (POStatusId == '-- Select --') ? null : $('#PurchaseOrderStatusId').val();

    //    PurchaseOrderDetailsStatic = {
    //        PurchaseOrderId: EditPurchaseId > 0 ? EditPurchaseId : null,
    //        VendorId: parseInt(vendorId),
    //        BillFromPlantId: parseInt($('#BillFrom').val()),
    //        ShipToPlantId: parseInt(alternativeCompanyAddress),
    //        PlantId: PlantMappingId || null,
    //        PurchaseOrderNo: $('#PurchaseOrderNumber').val(),
    //        PurchaseOrderDate: $('#PurchaseOrderDate').val(),
    //        ExpectedDeliveryDate: $('#ExpectedDeliveryDate').val(),
    //        SubTotal: parseFloat($('#Subtotal').val() || 0.00),
    //        RoundOffValue: parseFloat($('#roundOff').val() || 0.00),
    //        GrantTotal: parseFloat($('#GrantTotal').val() || 0.00),
    //        Notes: $('#AddNotesText').val(),
    //        TermsAndCondition: $('#TermsAndCondition').val(),
    //        PurchaseOrderStatusId: parseInt(POStatusId),
    //    };

    //    var PurchaseOrderProductMappingDetails = [];

    //    $('#POProductTablebody .ProductTableRow').each(function () {
    //        var $rowTable = $(this);
    //        var productId = $rowTable.data('product-id');
    //        //var productInfoStr = $rowTable.attr('data-product-info');
    //        var PurchaseOrderProductMappingId = $rowTable.attr('data-productmapping-id');
    //        //var productInfo = JSON.parse(productInfoStr);

    //        var productDetail = {
    //            PurchaseOrderProductMappingId: PurchaseOrderProductMappingId == null ? null : parseInt(PurchaseOrderProductMappingId),
    //            ModuleId: EditPurchaseId > 0 ? EditPurchaseId : null,
    //            ProductId: parseInt(productId),
    //            PurchasePrice: Common.parseFloatValue($rowTable.find('.SellingPrice').val()),
    //            Quantity: Common.parseFloatValue($rowTable.find('.TableRowQty').val() || 0),
    //            UnitId: parseInt($rowTable.find('.ForBindtableProductUnit').val()),
    //            ProductDescription: $rowTable.find('.descriptiontdtext').val(),
    //            SubTotal: Common.parseFloatValue($rowTable.find('.SubTotalQty').val()),
    //            CGST_Percentage: Common.parseFloatValue($rowTable.find('.CGST input').val().replace('%', '').trim()),
    //            CGST_Value: Common.parseFloatValue($rowTable.find('.CGST .CGSTAmount').text().trim()),
    //            SGST_Percentage: Common.parseFloatValue($rowTable.find('.SGST input').val().replace('%', '').trim()),
    //            SGST_Value: Common.parseFloatValue($rowTable.find('.SGST .SGSTAmount').text().trim()),
    //            IGST_Percentage: Common.parseFloatValue($rowTable.find('.IGST input').val().replace('%', '').trim()),
    //            IGST_Value: Common.parseFloatValue($rowTable.find('.IGST .IGSTAmount').text().trim()),
    //            CESS_Percentage: Common.parseFloatValue($rowTable.find('.CESS input').val().replace('%', '').trim()),
    //            CESS_Value: Common.parseFloatValue($rowTable.find('.CESS .CESSAmount').text().trim()),
    //            TotalAmount: Common.parseFloatValue($rowTable.find('.Total input').val()),
    //        };
    //        PurchaseOrderProductMappingDetails.push(productDetail);
    //    });

    //    formDataMultiple.append("PurchaseOrderDetailsStatic", JSON.stringify(PurchaseOrderDetailsStatic));
    //    formDataMultiple.append("PurchaseOrderProductMappingDetails", JSON.stringify(PurchaseOrderProductMappingDetails));
    //    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    //    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

    //    $.ajax({
    //        type: "POST",
    //        url: "/PurchaseOrder/InsertUpdatePurchaseOrder",
    //        data: formDataMultiple,
    //        contentType: false,
    //        processData: false,
    //        success: function (response) {
    //            if (response.status) {
    //                formDataMultiple = new FormData();
    //                Common.successMsg(response.message);
    //                $("#PurchaseOrderModal").hide();
    //                var fnData = Common.getDateFilter('dateDisplay2');
    //                Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", { PlantId: parseInt(PlantMappingId), PurchaseOrderId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetPurchaseOrderSuccess, null);
    //            }
    //            else {
    //                formDataMultiple = new FormData();
    //                Common.errorMsg(response.message);
    //            }
    //        },
    //        error: function (response) {
    //            Common.errorMsg(response.message);
    //        }
    //    });
    //});

    $(document).on('click', '.btn-edit', function () {

        $('#loader-pms').show();
        EditPurchaseId = $(this).data('id');
        $('#POTopHeadbind').empty();
        bindHeaderNormal();
        VendorAlignmentOpen();
        ClearInputs(); // Clear inputs

        $("#ModalHeading").text("Edit Purchase Order");

        $('#TypeOfRequest').empty().append('<option value="">--Select--</option>');
        $('#RequestNo').empty().append('<option value="">--Select--</option>');
        $('#POProductTablebody .ProductTableRow').remove();

        $("#PurchaseOrderSaveBtn span:first").text("Update");
        $("#btnPordersaveprintbtn span:first").text("Update & Print");
        $("#btnPreviewPorder span:first").text("Update & Preview");

        ProductIdArray = [];
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        $('.Status-Div').show();

        $("#PurchaseOrderModal .modal-body").animate({ scrollTop: 0 }, "fast");
        $('#PurchaseOrderModal').show();

        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = {
            PlantId: parseInt(PlantMappingId),
            PurchaseOrderId: parseInt(EditPurchaseId),
            FromDate: fnData.startDate.toISOString(),
            ToDate: fnData.endDate.toISOString()
        };

        Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", EditDataId, PurchaseOrderGetNotNull, null);
    });

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            EditPurchaseId = $(this).data('id');
            Common.ajaxCall("GET", "/PurchaseOrder/DeletePurchaseOrderDetails", { PurchaseOrderId: parseInt(EditPurchaseId) }, function (response) {
                response = response.status ? Common.successMsg(response.message) : Common.errorMsg(response.message);
                var fnData = Common.getDateFilter('dateDisplay2');
                Common.ajaxCall("GET", "/PurchaseOrder/GetPurchaseOrder", { PlantId: parseInt(PlantMappingId), PurchaseOrderId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetPurchaseOrderSuccess, null);
            }, null);
        }
    });

    $(document).on('click', '#UpdateProductsTableInAddItem', function () {

        $('.modal-body').scrollTop(0);
        let isAnyChecked = false;
        $('.AllProductRowItem').each(function () {
            if ($(this).find('input[type="checkbox"]').prop('checked')) {
                isAnyChecked = true;
                return false;
            }
        });

        if (!isAnyChecked) {
            Common.warningMsg('Select at least one Product to add.');
            return;
        }

        $('.AllProductRowItem').each(function (index, item) {
            var $row = $(this);
            var $checkbox = $row.find('input[type="checkbox"]');

            if ($checkbox.prop('checked')) {
                var ProductId = $row.find('.ProductId').text().trim();
                var ProductName = $row.find('.ProductName').text().trim();
                //var SecondaryPrice = parseFloat($row.find('.SellingPrice').text().trim()) || 0;
                //SecondaryPrice = SecondaryPrice.toFixed(2);

                var productInfoStr = $row.attr('data-product-info');
                var productInfo = {};

                try {
                    productInfo = JSON.parse(productInfoStr.replace(/&quot;/g, '"'));
                } catch (e) {
                    console.error("Failed to parse productInfo for ProductId:", ProductId, e);
                    return;
                }

                productInfo.PrimaryPrice = parseFloat(productInfo.PrimaryPrice) || 0;
                productInfo.SecondaryPrice = parseFloat(productInfo.SecondaryPrice) || 0;

                var $unitSelect = $row.find('select.unit-dropdown-select');

                var selectedIndex = $unitSelect.prop("selectedIndex");  // 0 or 1

                var option0 = $unitSelect.find("option").eq(0).val() || "";
                var option1 = $unitSelect.find("option").eq(1).val() || "";

                var PrimaryPrice = productInfo.PrimaryPrice;
                var SecondaryPrice = productInfo.SecondaryPrice;

                var SelectedPrice;

                if (option0 === option1) {
                    SelectedPrice = PrimaryPrice;
                }
                else {
                    SelectedPrice = selectedIndex === 0 ? PrimaryPrice : SecondaryPrice;
                }

                SelectedPrice = SelectedPrice.toFixed(2);

                var QtyProductAdd = $row.find('.QtyProductAdd').val().trim() || 1;
                var defaultDescription = ProductName;

                var productInfoStr = $row.attr('data-product-info');
                var productInfo = {};

                try {
                    productInfo = JSON.parse(productInfoStr.replace(/&quot;/g, '"'));
                } catch (e) {
                    console.error('Error parsing product info for ProductId:', ProductId, e);
                }

                var productDataForThat = JSON.stringify(productInfo).replace(/"/g, "&quot;");

                var $unitSelect = $row.find('select.unit-dropdown-select');
                var productInfoJson = $row.attr('data-product-info');
                var productInfo = JSON.parse(productInfoJson);

                var CGST = parseFloat(productInfo.CGST) || 0;
                var SGST = parseFloat(productInfo.SGST) || 0;
                var IGST = parseFloat(productInfo.IGST) || 0;
                var CESS = parseFloat(productInfo.CESS) || 0;

                var SubTotal = (SecondaryPrice * QtyProductAdd).toFixed(2);

                var BillToState = $('#VendorStateName').text().toLowerCase();
                var ShipToState = $('#StateName').text().toLowerCase();

                var cgstAmt = 0, sgstAmt = 0, igstAmt = 0, cessAmt = 0;

                if (BillToState && ShipToState && BillToState.trim() !== ShipToState.trim()) {
                    igstAmt = (SubTotal * IGST / 100).toFixed(2);
                    cessAmt = (SubTotal * CESS / 100).toFixed(2);
                } else {
                    cgstAmt = (SubTotal * CGST / 100).toFixed(2);
                    sgstAmt = (SubTotal * SGST / 100).toFixed(2);
                    cessAmt = (SubTotal * CESS / 100).toFixed(2);
                }

                var totalAmount = (
                    parseFloat(SubTotal) +
                    parseFloat(cgstAmt) +
                    parseFloat(sgstAmt) +
                    parseFloat(igstAmt) +
                    parseFloat(cessAmt)
                ).toFixed(2);

                var unitDropdownHtml = '<select class="form-control ForBindtableProductUnit" data-productid="' + ProductId + '">';
                $unitSelect.find('option').each(function () {
                    var optionValue = $(this).val();
                    var optionText = $(this).text();
                    var isSelected = $(this).is(':selected') ? 'selected' : '';
                    unitDropdownHtml += `<option value="${optionValue}" ${isSelected}>${optionText}</option>`;
                });
                unitDropdownHtml += '</select>';

                var productId = parseInt(ProductId);

                ProductIdArray.push(productId);

                var newRow = `
                    <tr class="ProductTableRow" data-product-id="${ProductId}" data-productMapping-id="" data-product-info="${productDataForThat}">
                        <td data-label="No"></td>
                        <td data-label="Asset Name">
                            <label class="d-none ProductId">${ProductId}</label>
                            <label>${ProductName}</label>
                            <textarea class="form-control mt-2 descriptiontdtext" placeholder="Description">${defaultDescription}</textarea>
                        </td>
                        <td data-label="Selling Price">
                            <input type="text" class="form-control SellingPrice" value="${SelectedPrice}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)" />
                        </td>
                        <td data-label="QTY">
                            <div class="input-group" style="width: 124px;">
                                <input type="text" class="form-control TableRowQty" value="${QtyProductAdd}" min="1" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" />
                                <div class="input-group-append">
                                    <span class="unit-dropdown">${unitDropdownHtml}</span>
                                </div>
                            </div>
                            <div style="justify-content:center;display:flex;margin-top:5px;">
                                <span class="remaining-stock ml-2 d-none" style="color:green;">(${productInfo.SecondaryUnitStockInHand || 0})</span>
                            </div>
                        </td>
                        <td data-label="SubTotal" class="SubTotal">
                            <input type="text" class="form-control SubTotalQty DisabledTextBox" value="${SubTotal || ''}" />
                        </td>
                        <td data-label="CGST" class="CGST">
                            <input type="text" class="form-control CGST DisabledTextBox" value="${productInfo.CGST || 0} %" />
                            <small class="CGSTAmount d-flex justify-content-center" style="color: #5de95d;">${cgstAmt}</small>
                        </td>
                        <td data-label="SGST" class="SGST">
                            <input type="text" class="form-control SGST DisabledTextBox" value="${productInfo.SGST || 0} %" />
                            <small class="SGSTAmount d-flex justify-content-center" style="color: #5de95d;">${sgstAmt}</small>
                        </td>
                        <td data-label="IGST" class="IGST">
                            <input type="text" class="form-control IGST DisabledTextBox" value="${productInfo.IGST || 0} %" />
                            <small class="IGSTAmount d-flex justify-content-center" style="color: #5de95d;">${igstAmt}</small>
                        </td>
                        <td data-label="CESS" class="CESS">
                            <input type="text" class="form-control CESS DisabledTextBox" value="${productInfo.CESS || 0} %" />
                            <small class="CESSAmount d-flex justify-content-center" style="color: #5de95d;">${cessAmt}</small>
                        </td>
                        <td data-label="Total" class="Total">
                            <input type="text" class="form-control Total DisabledTextBox" value="${totalAmount || 0}" />
                        </td>
                        <td data-label="Action" style="text-align:center;">
                            <button class="btn DynremoveBtn DynrowRemove" type="button">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;

                $('#AddItemButtonRow').before(newRow);
                $checkbox.prop('checked', false);
            }
        });

        $('#AddProductModal').hide();
        updateGSTVisibility('#VendorStateName', '#StateName');

        calculateGrandTotal();

        $('#POProductTablebody .ProductTableRow').each(function (index) {
            $(this).find('td:first').text(index + 1);
        });
    });

    $(document).on('click', '.DynrowRemove', function () {
        var $row = $(this).closest('tr');
        var ProductId = parseInt($row.find('.ProductId').text().trim(), 10);
        ProductIdArray = ProductIdArray.filter(id => id !== ProductId);
        $row.remove();
        $('#POProductTablebody .ProductTableRow').each(function (index) {
            $(this).find('td:first').text(index + 1);
        });

        calculateRow($row);
        calculateGrandTotal();
    });

    $(document).on('change', '#POProductTablebody .ForBindtableProductUnit', function () {
        let $row = $(this).closest('tr.ProductTableRow');
        let selectedUnitText = $(this).find('option:selected').text().trim();
        let productInfoStr = $row.attr('data-product-info');
        if (!productInfoStr) return;

        let productInfo;
        try {
            productInfo = JSON.parse(productInfoStr);
        } catch (e) {
            console.error("Error parsing product info:", e);
            return;
        }

        let newPrice = 0;
        if (selectedUnitText === productInfo.PrimaryUnitName) {
            newPrice = parseFloat(productInfo.PrimaryPrice || 0);
        } else if (selectedUnitText === productInfo.SecondaryUnitName) {
            newPrice = parseFloat(productInfo.SecondaryPrice || 0);
        }

        $row.find('.SellingPrice').val(newPrice.toFixed(2));

        calculateRow($row);
        calculateGrandTotal();
    });

    $(document).on('click', '#btnSalePreviewbtn', function () {
        $('#loader-pms').show();
        var EditData = { ModuleId: parseInt(purchaseOrderId), NoOfCopies: 1, printType: "preview" }

        $.ajax({
            url: '/Sale/SaleOrderPrint',
            method: 'GET',
            data: EditData,
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response) {
                var printType = "Preview";
                $('#ShareDropdownitems').css('display', 'none');
                var blob = new Blob([response], { type: 'application/pdf' });
                var blobUrl = URL.createObjectURL(blob);
                if (printType == "Preview") {
                    var newTab = window.open();
                    if (newTab) {
                        newTab.document.write(`
                                              <html>
                                              <head><title>TaxInvoice Preview</title></head>
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
                $('#loader-pms').hide();
                /* Print*/
            },
            error: function () {
                $('#loader-pms').hide();
                Common.errorMsg(response.message);
            }
        });
    });

   $(document).on('click', '#btnPordersaveprintbtn', function () {

    $('#loader-pms').show();

    savePurchaseOrder(function (purchaseOrderId) {

        var EditData = {
            ModuleId: parseInt(purchaseOrderId), // 🔥 Correct ID
            NoOfCopies: 1,
            printType: "preview"
        };

        $.ajax({
            url: '/PurchaseOrder/PurchaseOrderPrint',
            method: 'GET',
            data: EditData,
            xhrFields: { responseType: 'blob' },

            success: function (response) {
                var printType = "Preview";
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
                $('#loader-pms').hide();
            },

            error: function () {
                $('#loader-pms').hide();
                Common.errorMsg("Print failed");
            }
        });
    });

});

    $(document).on('change', '#PurchaseOrderDate', function () {
        var selectedDate = $(this).val();
        $('#ExpectedDeliveryDate').attr('min', selectedDate);
        $('#ExpectedDeliveryDate').val(selectedDate);
    });
});

async function PurchaseOrderGetNotNull(response) {
    if (!response.status) return;
    var data = JSON.parse(response.data);

    await Common.bindDropDownParentAsync('BillFrom', 'FormBillFrom', 'BillFrom');
    await Common.bindDropDownParentAsync('Vendor', 'FormVendor', 'Vendor');
    await Common.bindDropDownParentAsync('AlternativeCompanyAddress', 'FormShipping', 'PlantBillFrom');

    const billFromResponse = await ajaxAsync("GET", "/Common/BillFromDetails_BillFromId", { ModuleId: parseInt(data[1][0].BillFromPlantId), ModuleName: "BillFrom" });
    if (billFromResponse.status) {
        var BillFromData = JSON.parse(billFromResponse.data);
        $("#BillFromAddress").text(BillFromData[0][0].BillFromAddress || '');
        TriggerValues = false;

        $("#BillFrom").val(data[1][0].BillFromPlantId).trigger("change");

        const vendorResponse = await Common.getAsycData("/Common/VendorDetailsByVendorId?vendorId=" + parseInt(data[1][0].VendorId));
        if (vendorResponse !== null) {
            BillToAddress(vendorResponse);
            $('#Vendor').val(data[1][0].VendorId).trigger('change');

            const plantResponse = await ajaxAsync("GET", "/Settings/GetPlantDetails", { PlantId: parseInt(data[1][0].ShipToPlantId) });
            if (plantResponse !== null) {
                ShipToAddress(plantResponse);
                $('#AlternativeCompanyAddress').val(data[1][0].ShipToPlantId).trigger('change');
                $('#PurchaseOrderNumber').val(data[1][0].PurchaseOrderNo);

                bindProductRowsInNotNull(data[0], data[1][0].VendorStateName, data[1][0].PlantStateName);

                $('#loader-pms').hide();
            }
        }
    }

    $('#PurchaseOrderDate').val(data[1][0].PurchaseOrderDate.split('T')[0]);
    $('#ExpectedDeliveryDate').attr('min', data[1][0].PurchaseOrderDate.split('T')[0]).val(data[1][0].ExpectedDeliveryDate.split('T')[0]);

    Inventory.toggleField(data[1][0].Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable");
    Inventory.toggleField(data[1][0].TermsAndCondition, "#TermsAndCondition", "#AddTerms", "#AddTermsLable");
    Inventory.toggleFieldForAttachment(data[2][0].AttachmentId, "#AddAttachLable", "#AddAttachment");

    Inventory.bindAttachments(data[2]);

    var EditDataId = { ModuleName: 'PurchaseOrder', ModuleId: parseInt(EditPurchaseId) };

    const statusResponse = await ajaxAsync("GET", "/Common/GetInventoryStatusDetails", EditDataId);

    if (statusResponse.status) {
        Common.bindDropDownSuccess(statusResponse.data, "PurchaseOrderStatusId");
        $('#PurchaseOrderStatusId').val(data[1][0].PurchaseOrderStatusId);
    }
}

function ajaxAsync(method, url, data) {
    return new Promise((resolve, reject) => {
        Common.ajaxCall(method, url, data, resolve, reject);
    });
}

function bindProductRowsInNotNull(productArray, StateName1, StateName2) {
    // Remove old product rows
    $('#POProductTablebody .ProductTableRow').remove();

    $.each(productArray, function (index, productInfo) {

        var PurchaseOrderProductMappingId = productInfo.PurchaseOrderProductMappingId || '';
        var ProductId = productInfo.ProductId || '';
        var ProductName = productInfo.ProductName || '';
        var defaultDescription = productInfo.Description || '';
        var SecondaryPrice = parseFloat(productInfo.PurchasePrice) || 0;
        var QtyProductAdd = parseFloat(productInfo.Quantity).toFixed(2) || 1;

        var CGST = parseFloat(productInfo.CGST) || 0;
        var SGST = parseFloat(productInfo.SGST) || 0;
        var IGST = parseFloat(productInfo.IGST) || 0;
        var CESS = parseFloat(productInfo.CESS) || 0;

        var SubTotal = (SecondaryPrice * QtyProductAdd).toFixed(2);

        var cgstAmt = 0, sgstAmt = 0, igstAmt = 0, cessAmt = 0;

        var firstState = StateName1.toLowerCase().trim();
        var secondState = StateName2.toLowerCase().trim();

        if (firstState && secondState && firstState.trim() !== secondState.trim()) {
            igstAmt = (SubTotal * IGST / 100).toFixed(2);
            cessAmt = (SubTotal * CESS / 100).toFixed(2);
        } else {
            cgstAmt = (SubTotal * CGST / 100).toFixed(2);
            sgstAmt = (SubTotal * SGST / 100).toFixed(2);
            cessAmt = (SubTotal * CESS / 100).toFixed(2);
        }

        var totalAmount = (
            parseFloat(SubTotal) +
            parseFloat(cgstAmt) +
            parseFloat(sgstAmt) +
            parseFloat(igstAmt) +
            parseFloat(cessAmt)
        ).toFixed(2);

        ProductIdArray.push(ProductId);

        var unitDropdownHtml = `<select class="form-control ForBindtableProductUnit" data-productid="${ProductId}">`;
        unitDropdownHtml += `<option value="${productInfo.PrimaryUnitId}" ${productInfo.UnitId == productInfo.PrimaryUnitId ? 'selected' : ''}>${productInfo.PrimaryUnitName}</option>`;
        unitDropdownHtml += `<option value="${productInfo.SecondaryUnitId}" ${productInfo.UnitId == productInfo.SecondaryUnitId ? 'selected' : ''}>${productInfo.SecondaryUnitName}</option>`;
        unitDropdownHtml += `</select>`;

        var encodedProductInfo = JSON.stringify(productInfo)
            .replace(/"/g, '&quot;')   // Replace double quotes
            .replace(/'/g, '&#39;');  // Replace single quotes (for safety)

        var newRow = `
            <tr class="ProductTableRow" data-product-id="${ProductId}" data-productMapping-id="${PurchaseOrderProductMappingId}" data-product-info="${encodedProductInfo}">
                <td data-label="S.No"></td>
                <td data-label="Product Name">
                    <label class="d-none ProductId">${ProductId}</label>
                    <label>${ProductName}</label>
                    <textarea class="form-control mt-2 descriptiontdtext" placeholder="Description">${defaultDescription}</textarea>
                </td>
                <td data-label="Price">
                    <input type="text" class="form-control SellingPrice" value="${SecondaryPrice}" />
                </td>
                <td data-label="Quantity">
                    <div class="input-group" style="width: 124px;">
                        <input type="text" class="form-control TableRowQty" value="${QtyProductAdd}" min="1" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" />
                        <div class="input-group-append">
                            <span class="unit-dropdown">${unitDropdownHtml}</span>
                        </div>
                    </div>
                    <div style="justify-content:center;display:flex;margin-top:5px;">
                        <span class="remaining-stock ml-2 d-none" style="color:green;">(${productInfo.SecondaryUnitStockInHand || 0})</span>
                    </div>
                </td> 
                <td data-label="SubTotal" class="SubTotal">
                    <input type="text" class="form-control SubTotalQty DisabledTextBox" value="${SubTotal}" />
                </td>
                <td data-label="CGST" class="CGST">
                    <input type="text" class="form-control CGST DisabledTextBox" value="${CGST} %" />
                    <small class="CGSTAmount d-flex justify-content-center" style="color: #5de95d;">${cgstAmt}</small>
                </td>
                <td data-label="SGST" class="SGST">
                    <input type="text" class="form-control SGST DisabledTextBox" value="${SGST} %" />
                    <small class="SGSTAmount d-flex justify-content-center" style="color: #5de95d;">${sgstAmt}</small>
                </td>
                <td data-label="IGST" class="IGST">
                    <input type="text" class="form-control IGST DisabledTextBox" value="${IGST} %" />
                    <small class="IGSTAmount d-flex justify-content-center" style="color: #5de95d;">${igstAmt}</small>
                </td>
                <td data-label="CESS" class="CESS">
                    <input type="text" class="form-control CESS DisabledTextBox" value="${CESS} %" />
                    <small class="CESSAmount d-flex justify-content-center" style="color: #5de95d;">${cessAmt}</small>
                </td>
                <td data-label="Total" class="Total">
                    <input type="text" class="form-control Total DisabledTextBox" value="${totalAmount}" />
                </td>
                <td data-label="Action" style="text-align:center;">
                    <button class="btn DynremoveBtn DynrowRemove" type="button">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
        $('#AddItemButtonRow').before(newRow);
    });
    $('#POProductTablebody .ProductTableRow').each(function (index) {
        $(this).find('td:first').text(index + 1);
    });

    updateGSTVisibility('#VendorStateName', '#StateName');
    calculateGrandTotal();
    TriggerValues = true;
}

function updateSelectedItemCount() {
    let count = $('#product-table-body .AllProductRowItem input[type="checkbox"]:checked').length;
    $('#ItemSelectedCount').text(count);
    $('.TotalSelectedItmsCount').toggle(count > 0);
}

function GetProductPopSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        const Product = data[0];

        $('#product-table-body .AllProductEmptyRow').remove();

        if (Product && Product.length > 0 && Product[0].ProductId != "" && Product[0].ProductId != null) {
            let hasNewAsset = false;

            Product.forEach(product => {
                //const ProductIdStr = product.ProductId.toString();
                const ProductIdStr = product.ProductId;

                if (ProductIdArray.includes(ProductIdStr)) {
                    return;
                }

                hasNewAsset = true;

                const row = `
                <tr class="AllProductRowItem" data-product-info='${JSON.stringify(product)}'>
                    <td>
                        <div class="d-flex">
                            <input class="mr-2" type="checkbox" id="ProductId-${product.ProductId}">
                            <label class="ProductId d-none">${product.ProductId}</label>
                            <label class="ProductName" for="ProductId-${product.ProductId}">${product.ProductName}</label>
                        </div>
                    </td>
                    <td><label class="ProductSubCategoryName">${product.ProductSubCategoryName}</label></td>
                    <td><label class="ProductCategoryName">${product.ProductCategoryName}</label></td>
                    <td><label class="SellingPrice">${product.SecondaryPrice}</label></td>
                    <td><label class="SecondaryUnitStockInHand">${product.SecondaryUnitStockInHand}</label></td>
                    <td style="width:16%">
                        <button type="button" class="btn btn-custom addQtyBtn">+ Add</button>
                        <div class="align-items-center OtyColumn d-none">
                            <div class="d-flex align-items-center qty-wrapper justify-content-center">
                                <div class="qty-group">
                                    <button type="button" class="btn btn-primary RowMinus qty-btn qty-decrease">-</button>
                                    <input type="text" class="form-control text-center qty-input QtyProductAdd" value="1" min="1" step="0.0001" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)">
                                    <button type="button" class="btn btn-primary RowPlus qty-btn qty-increase">+</button>
                                </div>
                                <div class="input-group-append">

                                    <span id="unitDropdownContainer" class="unit-dropdown">

                                    </span>
                                </div>

                            </div>
                        </div>
                    </td>
                </tr>
                `;
                $('#product-table-body').append(row);

                const $lastRow = $('#product-table-body tr').last();
                const $unitDropdownContainer = $lastRow.find('.unit-dropdown');

                const $select = $(`<select class="additemdrop unit-select form-control unit-dropdown-select" data-productid="${product.ProductId}"></select>`);

                if (product.PrimaryUnitId && product.PrimaryUnitName) {
                    const $primaryOption = $('<option></option>').val(product.PrimaryUnitId).text(product.PrimaryUnitName).attr('data-unitid', product.PrimaryUnitId)
                        .attr('data-unitname', product.PrimaryUnitName).addClass('unit-option primary-unit');

                    $select.append($primaryOption);
                }

                if (product.SecondaryUnitId && product.SecondaryUnitName) {
                    const $secondaryOption = $('<option></option>').val(product.SecondaryUnitId).text(product.SecondaryUnitName).attr('data-unitid', product.SecondaryUnitId)
                        .attr('data-unitname', product.SecondaryUnitName).addClass('unit-option secondary-unit');

                    $select.append($secondaryOption);
                }
                $unitDropdownContainer.append($select);

            });

            if (!hasNewAsset) {
                $('#product-table-body').html(`
                    <tr>
                        <td valign="top" colspan="5" class="dataTables_empty">
                            <div class="d-flex justify-content-center">
                                <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                                No New Records Found
                            </div>
                        </td>
                    </tr>
                `);
            }

        } else {
            // ✅ No valid data at all
            $('#product-table-body').html(`
                <tr>
                    <td valign="top" colspan="5" class="dataTables_empty">
                        <div class="d-flex justify-content-center">
                            <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                            No Record Found
                        </div>
                    </td>
                </tr>
            `);
        }
        $('#AddProductModal').show();
        $('#loader-pms').hide();
    }
}

function GetPurchaseOrderSuccess(response) {
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

        $('#PurchaseOrderMainTableDynamic').empty();

        $('#PurchaseOrderMainTableDynamic').html(`
                <div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" style="max-height:200px" id="PurchaseOrderTable">
                    </table>
                </div>
        `);

        var columns = Common.bindColumn(data[1], ['PurchaseOrderId', 'Status_Color']);
        Common.bindTable('PurchaseOrderTable', data[1], columns, -1, 'PurchaseOrderId', '360px', true, access);
    }
}

function BillToAddress(DataSet) {
    var data = JSON.parse(DataSet);
    $("#VendorColumn #VendorName").text(data[0][0].VendorName || '');
    $("#VendorColumn #VendorAddress").text(data[0][0].Address || '');
    $("#VendorColumn #VendorCountry").text(data[0][0].Country || '');
    $("#VendorColumn #VendorStateName").text(data[0][0].StateName || '');
    $("#VendorColumn #VendorEmail").text(data[0][0].Email || '');
    $("#VendorColumn #VendorContactNumber").text(data[0][0].ContactNumber || '');
    $("#VendorColumn #VendorGSTNumber").text(data[0][0].GSTNumber || '');
    $("#VendorColumn #StateIdGet").text(data[0][0].StateId);

    var city = data[0][0].City || '';
    var zipCode = data[0][0].ZipCode || '';

    var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
    $("#VendorColumn #VendorCity").text(cityName || '');
}

function BillToAddressClear() {
    $("#VendorColumn #VendorName").text('');
    $("#VendorColumn #VendorAddress").text('');
    $("#VendorColumn #VendorCountry").text('');
    $("#VendorColumn #VendorStateName").text('');
    $("#VendorColumn #VendorEmail").text('');
    $("#VendorColumn #VendorContactNumber").text('');
    $("#VendorColumn #VendorGSTNumber").text('');
    $("#VendorColumn #StateIdGet").text();
    $("#VendorColumn #VendorCity").text('');
}

function ShipToAddress(DataSet) {
    var data = JSON.parse(DataSet.data);
    $("#ShippingColumn #StoreName").text(data[0][0].PlantName || '');
    $("#ShippingColumn #StoreAddress").text(data[0][0].PlantAddress || '');
    $("#ShippingColumn #StoreCity").text(data[0][0].PlantCity || '');
    $("#ShippingColumn #StateName").text(data[0][0].PlantState || '');
    $("#ShippingColumn #StoreContactNumber").text(data[0][0].PlantContactNo || '');
}

function ShipToAddressClear() {
    $("#ShippingColumn #StoreName").text('');
    $("#ShippingColumn #StoreAddress").text('');
    $("#ShippingColumn #StoreCity").text('');
    $("#ShippingColumn #StateName").text('');
    $("#ShippingColumn #StoreContactNumber").text('');
    $("#ShippingColumn #StateId").text();
}


// ========== GST Visibility Function ==========
function updateGSTVisibility(firstStateId, secondStateId) {
    var firstState = ($(firstStateId).text() || '').toLowerCase();
    var secondState = ($(secondStateId).text() || '').toLowerCase();

    if (firstState !== secondState) {
        $('#CGSTTotalDiv, #CGSTHead, #SGSTHead, .CGSTValues, .SGSTValues, #SGSTTotalDiv').hide();
        $('#IGSTHead, .IGSTValues, #IGSTTotalDiv').show();

        $('.ProductTableRow .CGST, .ProductTableRow .SGST').hide();
        $('.ProductTableRow .IGST').show();
    } else {
        $('#SGSTTotalDiv, #CGSTHead, #SGSTHead, .CGSTValues, .SGSTValues, #CGSTTotalDiv').show();
        $('#IGSTHead, .IGSTValues, #IGSTTotalDiv').hide();

        $('.ProductTableRow .IGST').hide();
        $('.ProductTableRow .CGST, .ProductTableRow .SGST').show();
    }
}

// ========== Row Calculation Function ==========
function calculateRow($row) {
    var SecondaryPrice = parseFloat($row.find(".SellingPrice").val()) || 0;
    var QtyProductAdd = parseFloat($row.find(".TableRowQty").val()) || 0;

    // Get % values (remove % sign)
    var CGST = parseFloat(($row.find(".CGST input").val() || "0").replace('%', '').trim()) || 0;
    var SGST = parseFloat(($row.find(".SGST input").val() || "0").replace('%', '').trim()) || 0;
    var IGST = parseFloat(($row.find(".IGST input").val() || "0").replace('%', '').trim()) || 0;
    var CESS = parseFloat(($row.find(".CESS input").val() || "0").replace('%', '').trim()) || 0;

    var vendorState = ($("#VendorStateName").text() || '').trim().toLowerCase();
    var buyerState = ($("#StateName").text() || '').trim().toLowerCase();

    var SubTotal = SecondaryPrice * QtyProductAdd;
    var cgstAmt = 0, sgstAmt = 0, igstAmt = 0, cessAmt = 0;

    // GST logic based on state
    if (vendorState && buyerState && vendorState !== buyerState) {
        igstAmt = (SubTotal * IGST / 100).toFixed(2);
        cessAmt = (SubTotal * CESS / 100).toFixed(2);
        cgstAmt = sgstAmt = (0).toFixed(2);
    } else {
        cgstAmt = (SubTotal * CGST / 100).toFixed(2);
        sgstAmt = (SubTotal * SGST / 100).toFixed(2);
        cessAmt = (SubTotal * CESS / 100).toFixed(2);
        igstAmt = (0).toFixed(2);
    }

    var totalAmount = (
        parseFloat(SubTotal) +
        parseFloat(cgstAmt) +
        parseFloat(sgstAmt) +
        parseFloat(igstAmt) +
        parseFloat(cessAmt)
    ).toFixed(2);

    // Update row values
    $row.find(".SubTotal input").val(SubTotal.toFixed(2));
    $row.find(".CGSTAmount").text(cgstAmt);
    $row.find(".SGSTAmount").text(sgstAmt);
    $row.find(".IGSTAmount").text(igstAmt);
    $row.find(".CESSAmount").text(cessAmt);
    $row.find(".Total input").val(totalAmount);

    // Store numeric values for total calculation
    $row.find('.subtotal').val(SubTotal.toFixed(2));
    $row.find('.cgst-amt').val(cgstAmt);
    $row.find('.sgst-amt').val(sgstAmt);
    $row.find('.igst-amt').val(igstAmt);
    $row.find('.cess-amt').val(cessAmt);
    $row.find('.totalValue').val(totalAmount);
}

// ========== Table Total Calculation ==========
function calculateGrandTotal() {
    let subtotalTotal = 0,
        cgstTotal = 0,
        sgstTotal = 0,
        igstTotal = 0,
        cessTotal = 0,
        grandTotal = 0;

    $('#POProductTablebody .ProductTableRow').each(function () {
        let $row = $(this);

        let subtotal = parseFloat($row.find('.SubTotal input').val()) || 0;
        let cgst = parseFloat($row.find('.CGSTAmount').text()) || 0;
        let sgst = parseFloat($row.find('.SGSTAmount').text()) || 0;
        let igst = parseFloat($row.find('.IGSTAmount').text()) || 0;
        let cess = parseFloat($row.find('.CESSAmount').text()) || 0;
        let total = parseFloat($row.find('.Total input').val()) || 0;

        subtotalTotal += subtotal;
        cgstTotal += cgst;
        sgstTotal += sgst;
        igstTotal += igst;
        cessTotal += cess;
        grandTotal += total;
    });

    $('#SubtotalRow #SubTotalTotal').val(subtotalTotal.toFixed(2));
    $('#SubtotalRow #CGSTTotal').val(cgstTotal.toFixed(2));
    $('#SubtotalRow #SGSTTotal').val(sgstTotal.toFixed(2));
    $('#SubtotalRow #IGSTTotal').val(igstTotal.toFixed(2));
    $('#SubtotalRow #CESSTotal').val(cessTotal.toFixed(2));
    $('#SubtotalRow #Subtotal').val(grandTotal.toFixed(2));

    // Round-off logic
    var decimalPart = grandTotal.toFixed(2).split('.')[0];
    var roundedDecimal = Math.ceil(decimalPart);
    var AddOrSub = roundedDecimal;

    var RoundOffValu = grandTotal.toFixed(2).split('.')[1];
    if (RoundOffValu >= 50) {
        $('#roundOff').css('color', 'green');
        AddOrSub++;
    } else if (RoundOffValu == '00') {
        $('#roundOff').css('color', 'blue');
    } else if (RoundOffValu <= 50) {
        $('#roundOff').css('color', 'orange');
    }

    $('#roundOff').val('0.' + RoundOffValu);
    $('#GrantTotal').val(AddOrSub.toFixed(2));
}

// ========== Trigger Calculation on Input ==========
$(document).on("input", ".SellingPrice, .TableRowQty", function () {
    var $row = $(this).closest("tr");
    calculateRow($row);
    calculateGrandTotal();
});


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

    $('#VendorColumn .row.mt-3, #ShippingColumn .row.mt-3').stop(true, true).slideToggle(300);
    $('#toggleIconShipTo').toggleClass('fa-chevron-up fa-chevron-down');
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
                             <a id="BillFromAddress" name="BillFromAddress"></a>
                         </div>
                     </div>
                 </div>
             </form>
         </div>

         <!--VendorColumn-->
         <div class="col-lg-4 col-md-6 col-sm-6 col-12" id="VendorColumn" style="position: relative; display: none;">
             <form id="FormVendor" novalidate="novalidate">

                <div class="row BilAddHead px-1">
                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6 px-1">
                        <div class="d-flex">
                            <h2 class="mb-0">Bill To<span id="Asterisk">*</span></h2>
                        </div>
                    </div>
                    <div class="col-xl-8 col-lg-6 col-md-6 col-sm-6 col-6 my-2 px-1 overraphide" id="">
                        <div class="form-group mb-0 vendorerror">
                            <select class="form-control" id="Vendor" required>
                            </select>
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
                <div class="row BilAddHead">
                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6 px-1">
                        <div class="d-flex">
                            <h2 class="mb-0">Ship To<span id="Asterisk">*</span></h2>
                        </div>
                    </div>
                    <div class="col-xl-8 col-lg-6 col-md-6 col-sm-6 col-6 my-2 px-1" id="">
                        <div class="form-group mb-0 AlternativeCompanyError">
                            <select class="form-control" id="AlternativeCompanyAddress" name="AlternativeCompanyAddress" required>
                            </select>
                        </div>
                    </div>
                    <div class="col-xl-1 col-lg-2 col-md-2 col-sm-2 col-6 my-2 px-1" id="">
                        <input type="button" id="toggleShipTo" class="btn btn-link p-0" value="" />
                        <i class="fas fa-chevron-down" id="toggleIconShipTo" style="cursor: pointer;font-size: large;color: blue;"></i>
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

                     <div class="col-lg-4 col-md-6 col-6 d-none" id="TypeOfRequestDiv">
                         <div class="form-group">
                             <label>Type Of Request</label> 
                             <select class="form-control" id="TypeOfRequest" name="TypeOfRequest"></select>
                         </div>
                     </div>

                     <div class="col-lg-4 col-md-6 col-6 d-none" id="RequestNoDiv">
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

    $('#Vendor,#AlternativeCompanyAddress').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });
}

//------------------------------Attachment------------------------

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Client",
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
            ModuleName: "Client",
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

/*==============================================================================Used Event Function in PurchaseOrder.JS===============================================================*/

function ClearInputs() {
    $('#ExpectedDeliveryDate').val('');
    $('#SubTotalTotal').val('');
    $('#CGSTTotal').val('');
    $('#SGSTTotal').val('');
    $('#IGSTTotal').val('');
    $('#CESSTotal').val('');
    $('#Subtotal').val('');
    $('#roundOff').val('');
    $('#GrantTotal').val('');

    $('#AddAttachment').hide();
    $('#AddAttachLable').show();
    $('#HideAttachlable').hide();

    $('#AddTerms').hide();
    $('#AddTermsLable').show();
    $('#HideTermsLable').hide();
    $('#TermsAndCondition').val('');

    $('#AddNotes').hide();
    $('#AddNotesLable').show();
    $('#HideNotesLable').hide();
    $('#AddNotesText').val('');

    deletedFiles = [];
    existFiles = [];
    ProductIdArray = [];
    formDataMultiple = new FormData();
}