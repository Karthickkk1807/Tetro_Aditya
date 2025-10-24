var deletedFiles = [];
var existFiles = [];
var ProductIdArray = [];
var formDataMultiple = new FormData();
var EditTransferId = 0;
var FranchiseMappingId = 0;
var TransferTypeNo = 0;
var IsFromFranchise = "";

$(document).ready(function () {

    $('.Status-Div').removeClass('d-block').addClass('d-none');

    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    

    
    $('#toggleCustomDate').click(function () {
        $('#fromtodateCol').slideToggle(); // smoothly show/hide
    });
   

    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#tableFilter').val('');
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
            Common.ajaxCall("GET", "/Inventory/GetTransfer", { TransferId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString(), FranchiseId: parseInt(FranchiseMappingId) }, GetTransferSuccess, null);
        }
    });

    $('#BranchContent,#ToBranchContent').hide();
    $('#toggleIconBranch').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    $('.BilAddHead').css('border-bottom', 'none');

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        $('#tableFilter').val('');

        displayedDate = new Date(currentYear, currentMonth);
        $('#increment-month-btn2').show();

        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Inventory/GetTransfer", { TransferId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: parseInt(FranchiseMappingId) }, GetTransferSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    //var fnData = Common.getDateFilter('dateDisplay2');
    //Common.ajaxCall("GET", "/Inventory/GetTransfer", { TransferId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: parseInt(FranchiseMappingId) }, GetTransferSuccess, null);
    GetTransferSuccess();
    Common.bindDropDownParent('TransferType', 'FormRightSideHeader', 'TransferType');
    Common.bindDropDownParent('FromAddressId', 'FormVendor', 'Plant');
    Common.bindDropDownParent('ToAddressId', 'FormShipping', 'Plant');
    Common.bindDropDownParent('ModeOfTransferId', 'FormStatus', 'ModeOfTransport');
    $('#TransferStatusId').empty().append($('<option>', { value: '', text: '--Select--', }));

    $(document).on('click', '#AddTransfer', function () {
        $('#loader-pms').show();

        $('#AddItemButtonRow').show();
        $('.ProductTableRow').hide();
        //$('#TransferTypeDiv').hide();
        removeVal();

        $('#BranchContent,#ToBranchContent').hide();
        $('#toggleIconBranch').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        $('.BilAddHead').css('border-bottom', 'none');

        Common.removeMessage('FormRightSideHeader');
        Common.removeMessage('FormVendor');
        Common.removeMessage('FormShipping');
        Common.removeMessage('FormStatus');

        $('#Transferheader').text('Add Transfer');
        $('#TransferStatusId').empty().prop('disabled', false);

        if ($('#TransferType option[value="1"]').length === 0) {
            $('#TransferType').prepend('<option value="1">Request</option>');
        }
        if ($('#TransferType option[value="2"]').length === 0) {
            $('#TransferType').prepend('<option value="2">OutWard</option>');
        }
        if ($('#TransferType option[value="3"]').length === 0) {
            $('#TransferType').prepend('<option value="3">InWard</option>');
        }

        $('#TransferType').val('1').trigger('change').prop('disabled', true);
        $('#TransferSaveBtn').show();

        var today = new Date();
        var formattedDate = today.toISOString().split('T')[0];
        $('#TransferDate').val(formattedDate);
        $('#TransferSaveBtn').show();

        EditTransferId = 0;
        ProductIdArray = [];

        Common.ajaxCall("GET", "/Common/GetAutoGenerate", { ModuleName: "Transfer", FranchiseId: parseInt(FranchiseMappingId) }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                $('#TransferNo').val('');
                $('#TransferNo').val(data[0][0].TransferNo);

                $('.Status-Div').removeClass('d-block').addClass('d-none');
                $("#TransferSaveBtn span:first").text("Save");
                $('#TransferModal .modal-body').scrollTop(0);
                $('#FromAddressId').val(null).trigger('change');
                $('#TransferModal').show();
            }

            $('#loader-pms').hide();
        }, function () {
            $('#loader-pms').hide();
        });
    });

    $(document).on('change', '#FromAddressId', function () {
        var thisval = $(this).val();
        if (thisval != "") {
            disableSameOption('#FromAddressId', '#ToAddressId');

            $.ajax({
                type: 'GET',
                dataType: "json",
                url: '/Sale/DispatchAddressDetails',
                data: {
                    MasterInfoId: parseInt(thisval),
                    ModuleName: "Product_Transfer_FranchiseAddress"
                },
                success: function (response) {
                    if (response.status) {
                        var data = JSON.parse(response.data);
                        $('#FromAddress').text(data[0][0].FranchiseAddress);
                        $('#FromCity').text(data[0][0].FranchiseCity);
                        $('#FromContactNumber').text(data[0][0].FranchiseContactNo);
                    }
                },
                error: function (response) {
                    // Handle error here
                }
            });
        } else {
            $('#FromAddress').text('');
            $('#FromCity').text('');
            $('#FromContactNumber').text('');

            $('#FromStateId').text('');
            $('#TransferNo').val('');

            var FromAddress = $('#FromAddressId').val();
            var ToAddress = $('#ToAddressId').val();
            if (FromAddress === "" && ToAddress === "") {
                $('#FromAddressId option').each(function () {
                    $(this).prop('disabled', false).removeClass('d-none');
                });
                $('#ToAddressId option').each(function () {
                    $(this).prop('disabled', false).removeClass('d-none');
                });

                $('#AddItemButtonRow').show();
                $('#POProductTablebody .ProductTableRow').remove('');
                $('#AssetTotal').val('');
                $('.imageAppend').empty();
            }
        }
    });

    $(document).on('change', '#ToAddressId', function () {
        var thisval = $(this).val();
        if (thisval != "") {
            disableSameOption('#ToAddressId', '#FromAddressId');
            $.ajax({
                type: 'GET',
                dataType: "json",
                url: '/Sale/DispatchAddressDetails',
                data: {
                    MasterInfoId: parseInt(thisval),
                    ModuleName: "Product_Transfer_FranchiseAddress"
                },
                success: function (response) {
                    if (response.status) {
                        var data = JSON.parse(response.data);
                        $('#ToAddress').text(data[0][0].FranchiseAddress);
                        $('#ToCity').text(data[0][0].FranchiseCity);
                        $('#ToContactNumber').text(data[0][0].FranchiseContactNo);
                    }
                },
                error: function (response) {
                    // Handle error here
                }
            });
        }
        else {
            $('#ToAddress').text('');
            $('#ToCity').text('');
            $('#ToContactNumber').text('');

            $('#ToStateId').text('');

            var FromAddress = $('#FromAddressId').val();
            var ToAddress = $('#ToAddressId').val();
            if (FromAddress === "" && ToAddress === "") {
                $('#ToAddressId option').each(function () {
                    $(this).prop('disabled', false).removeClass('d-none');
                });
                $('#FromAddressId option').each(function () {
                    $(this).prop('disabled', false).removeClass('d-none');
                });

                $('#AddItemButtonRow').show();
                $('#POProductTablebody .ProductTableRow').remove('');
                $('#AssetTotal').val('');
                $('.imageAppend').empty();
            }
        }
    });

    $(document).on('change', '#TransferType', function () {
        var thisval = $(this).val();

        var ValArray = [];
        if ($('#TransferType option[value="3"]').length === 1) {
            $('#POProductTable tbody tr.ProductTableRow').each(function (index, row) {
                var $outwardedQty = $(row).find('.OutwardedQtyMainTable');
                var $thisVal = parseFloat($outwardedQty.val());
                ValArray.push($thisVal.toFixed(2));
            });
        } else {
            $('#POProductTable tbody tr.ProductTableRow').each(function (index, row) {
                var $outwardedQty = $(row).find('.QtyMainTable');
                var $thisVal = parseFloat($outwardedQty.val());
                ValArray.push($thisVal.toFixed(2));
            });
        }

        $('#POProductTable tbody tr.ProductTableRow td.TD_Outwarded_Col').remove();
        $('#POProductTable tbody tr.ProductTableRow td.TD_Inwarded_Col').remove();

        if (thisval === "1") {
            $('#DivModeOfTransport').hide();
            $('#DivTransportno').hide();
            $('#AddItemButtonRow').show();

            $('.QtyMainTable').prop('disabled', false);
            $('.OutwardedQtyMainTable').prop('disabled', false);

            var FromAddressId = $('#FromAddressId').val();
            var ToAddressId = $('#ToAddressId').val();

            $('#FromAddressId').val(FromAddressId).trigger('change');
            $('#ToAddressId').val(ToAddressId).trigger('change');

            $('.TH_Request_Col').show();
            $('.TH_Inwarded_Col').hide();
            $('.TH_Outwarded_Col').hide();

            var totalColumns = $('#POProductTable thead tr th').length;
            $('#AddItemButtonRow td').attr('colspan', 5);
            $('#SubtotalRow td').eq(0).attr('colspan', 3);
            $('#SubtotalRow td').eq(1).attr('colspan', 1);
            $('#SubtotalRow td').eq(2).attr('colspan', 1);

            var today = new Date();
            var formattedDate = today.toISOString().split('T')[0];
            $('#TransferDate').val(formattedDate);

            /*if (EditTransferId == 0) {*/
            var EditDataId = { ModuleName: "Transfer", ModuleId: EditTransferId, type: parseInt(thisval) };

            Common.ajaxCall("GET", "/Inventory/GetTransferStatusDetails", EditDataId, function (response) {
                StatusSuccess(response);
                $('#TransferStatusId').val(1).trigger('change');
            }, null);
            //}
        }
        else if (thisval === "2" || thisval === "3") {

            $('#DivModeOfTransport').show();
            $('#DivTransportno').show();
            $('#AddItemButtonRow').hide();

            if (thisval === "2") {
                $('#ChangeTheTransferNoLable').html(`Request No<span id="Asterisk">*</span>`);

                if (IsFromFranchise == "Yes")
                    $('#TransferSaveBtn').show();
                else
                    $('#TransferSaveBtn').hide();

                if (TransferTypeNo == 1) {
                    $('#TransferSaveBtn').show();
                }

                $('.TH_Request_Col').show();
                $('.TH_Inwarded_Col').hide();
                $('.TH_Outwarded_Col').show();
                var totalColumns = $('#POProductTable thead tr th').length;
                $('#AddItemButtonRow td').attr('colspan', totalColumns);

                var FromAddressId = $('#FromAddressId').val();
                var ToAddressId = $('#ToAddressId').val();

                $('#FromAddressId').val(ToAddressId).trigger('change');
                $('#ToAddressId').val(FromAddressId).trigger('change');

                $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 3);
                $('#SubtotalRow td').eq(1).attr('colspan', 1);
                $('#SubtotalRow td').eq(2).attr('colspan', 1);
                $('.ProductNameSpanHead').text('11111111111');
                $('.UnitSpanHead').text('111111111');

                $('.QtyMainTable').prop('disabled', true);

                $('#POProductTable tbody tr.ProductTableRow').each(function (index, row) {
                    let unique = index + 1;
                    let qtyVal = parseFloat($(row).find('.QtyMainTable').val()) || 0;
                    let outwardColIndex = $('#POProductTable thead th.TH_Outwarded_Col').index();

                    let tdHtmlOutward = `
                        <td class="TD_Outwarded_Col">
                            <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${ValArray[index]}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                        </td>
                    `;

                    if (outwardColIndex >= 0) {
                        $(row).find('td.TD_Outwarded_Col').remove();
                        $(row).find('td.TD_Inward_Col').remove();
                        $(row).find('td').eq(outwardColIndex - 1).after(tdHtmlOutward);
                    }
                });

                var EditDataId = { ModuleName: "Transfer", ModuleId: null, type: parseInt(thisval) };
                Common.ajaxCall("GET", "/Inventory/GetTransferStatusDetails", EditDataId, function (response) {
                    StatusSuccess(response);
                    $('#TransferStatusId').val(3).trigger('change');
                    $('#ModeOfTransferId').prop('disabled', false);
                    $('#Transportno').prop('disabled', false);
                }, null);
            }
            else {
                $('#ChangeTheTransferNoLable').html(`OutWard No<span id="Asterisk">*</span>`);
                $('#TransferSaveBtn').show();
                $('.TH_Request_Col').show();
                $('.TH_Inwarded_Col').show();
                $('.TH_Outwarded_Col').show();
                var totalColumns = $('#POProductTable thead tr th').length;
                $('#AddItemButtonRow td').attr('colspan', totalColumns);

                var FromAddressId = $('#FromAddressId').val();
                var ToAddressId = $('#ToAddressId').val();

                $('#FromAddressId').val(FromAddressId).trigger('change');
                $('#ToAddressId').val(ToAddressId).trigger('change');

                $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 2);
                $('#SubtotalRow td').eq(1).attr('colspan', 1);
                $('#SubtotalRow td').eq(2).attr('colspan', 1);
                $('.ProductNameSpanHead').text('1111111');
                $('.UnitSpanHead').text('111');

                $('#POProductTable tbody tr.ProductTableRow').each(function (index, row) {
                    let unique = index + 1;
                    let qtyVal = parseFloat($(row).find('.QtyMainTable').val()) || 0;
                    let outwardColIndex = $('#POProductTable thead th.TH_Outwarded_Col').index();
                    let inwardColIndex = $('#POProductTable thead th.TH_Inwarded_Col').index();

                    let tdHtmlOutward = `
                        <td class="TD_Outwarded_Col">
                            <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${ValArray[index]}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                        </td>
                    `;

                    let tdHtmlInward = `
                        <td class="TD_Inward_Col">
                            <input type="text" class="form-control InwardedQtyMainTable" id="InwardedQtyMainTable${unique}" name="InwardedQtyMainTable${unique}" value="${ValArray[index]}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                        </td>
                    `;

                    if (outwardColIndex >= 0) {
                        $(row).find('td.TD_Outwarded_Col').remove();
                        $(row).find('td.TD_Inward_Col').remove();

                        $(row).find('td').eq(outwardColIndex - 1).after(tdHtmlOutward);
                        $(row).find('td').eq(inwardColIndex - 1).after(tdHtmlInward);
                    }
                    $('.QtyMainTable').prop('disabled', true);
                    $('.OutwardedQtyMainTable').prop('disabled', true);
                    $('.DynrowRemove').prop('disabled', true);
                });

                var EditDataId = { ModuleName: "Transfer", ModuleId: null, type: parseInt(thisval) };

                Common.ajaxCall("GET", "/Inventory/GetTransferStatusDetails", EditDataId, function (response) {
                    StatusSuccess(response);
                    $('#TransferStatusId').val(4).trigger('change');
                    $('#ModeOfTransferId').prop('disabled', true);
                    $('#Transportno').prop('disabled', true);
                }, null);
            }
        }
        else {
            $('#DivModeOfTransport').hide();
            $('#DivTransportno').hide();
            $('#AddItemButtonRow').show();
            $('#TransferTypeDiv').hide();
            $('#AddItemButtonRow').show();
            $('.ProductTableRow').remove();
            $('#ToAddressId').val('');
            $('#TypeID').val('');
            $('.TH_Request_Col').show();
            $('.TH_Inwarded_Col').hide();
            $('.TH_Outwarded_Col').hide();

            $('.QtyMainTable').prop('disabled', false);
            $('.OutwardedQtyMainTable').prop('disabled', false);
            removeVal();

            $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', false);

            var totalColumns = $('#POProductTable thead tr th').length;
            $('#AddItemButtonRow td').attr('colspan', 5);

            // Assume default logic (same as "3" perhaps, or adjust as needed)
            $('#SubtotalRow td').eq(0).attr('colspan', 3);
            $('#SubtotalRow td').eq(1).attr('colspan', 1);
            $('#SubtotalRow td').eq(2).attr('colspan', 1);
        }
    });

    $(document).on('click', '.btn-edit', async function () {
        EditTransferId = $(this).data('id');
        $('#TransferModal').show();
        $('#loader-pms').show();
        $('#TransferModal .modal-body').scrollTop(0);

        $('.ProductTableRow').show();
        $('#TransferTypeDiv').hide();
        $('#Transferheader').text('Edit Transfer');
        $("#TransferSaveBtn span:first").text("Update");
        $("#btnTransfersaveprintbtn span:first").text("Update & Print");
        $("#btnPreviewTransfer span:first").text("Update & Preview");
        $('#TransferStatusId').prop('disabled', false);
        $('.Status-Div').removeClass('d-none').addClass('d-block');
        //enableAllFields();
        removeVal();
        $('#BranchContent,#ToBranchContent').hide();
        $('#toggleIconBranch').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        $('.BilAddHead').css('border-bottom', 'none');
        $('#TransferSaveBtn').show();

        if ($('#TransferType option[value="1"]').length === 0) {
            $('#TransferType').prepend('<option value="1">Request</option>');
        }
        if ($('#TransferType option[value="2"]').length === 0) {
            $('#TransferType').prepend('<option value="2">OutWard</option>');
        }
        if ($('#TransferType option[value="3"]').length === 0) {
            $('#TransferType').prepend('<option value="3">InWard</option>');
        }

        ProductIdArray = [];

        Common.removeMessage('FormRightSideHeader');
        Common.removeMessage('FormVendor');
        Common.removeMessage('FormShipping');
        Common.removeMessage('FormStatus');

        const fnData = Common.getDateFilter('dateDisplay2');

        try {
            const activityResponse = await ajaxPromise("GET", "/Common/ActivityHistoryDetails", {
                ModuleName: "Transfer",
                ModuleId: EditTransferId
            });
            StatusActivitySuccess(activityResponse);

            // 3. GetTransfer (last so that QR, asset list, etc. finish before hiding loader)
            const transferResponse = await ajaxPromise("GET", "/Inventory/GetTransfer", {
                TransferId: EditTransferId,
                FromDate: fnData.startDate.toISOString(),
                ToDate: fnData.endDate.toISOString(),
                FranchiseId: parseInt(FranchiseMappingId)
            });

            GetTransferNotNullSuccess(transferResponse);
            $('#loader-pms').hide();

        } catch (err) {
            console.error("Error loading transfer details:", err);
            $('#loader-pms').hide();
        }
    });

    $(document).on('click', '#TransferSaveBtn', async function () {
        getExistFiles();

        $('#loader-pms').show();

        var FormRightSideHeaderIsValid = $("#FormRightSideHeader").validate().form();
        var FormVendorIsValid = $("#FormVendor").validate().form();
        var FormShippingIsValid = $("#FormShipping").validate().form();
        var FormStatusIsValid = $("#FormStatus").validate().form();
        var FromTableMainProductPopIsValid = $("#FromTableMainProductPop").validate().form();
        if (!FormRightSideHeaderIsValid || !FormVendorIsValid || !FormShippingIsValid || !FormStatusIsValid || !FromTableMainProductPopIsValid) {
            $('#loader-pms').hide();
            return false;
        }

        var TableLenthDynamicRow = $('.ProductTableRow').length;
        if (TableLenthDynamicRow == 0) {
            Common.warningMsg('Choose Atleast One Product.');
            $('#loader-pms').hide();

            return false;
        }

        var transferType = $('#TransferType').val();
        var typeID = $('#TypeID').val();
        var fromAddressId = $('#FromAddressId').val();
        var toAddressId = $('#ToAddressId').val();

        var transferStatusId = parseInt($('#TransferStatusId').val());
        let selectedStatusName = $('#TransferStatusId option:selected').text().trim();

        if (selectedStatusName === "Cancelled" || selectedStatusName === "Rejected") {
            const message = selectedStatusName === "Cancelled"
                ? "Confirm cancellation of this Transfer?"
                : "Confirm rejection of this Transfer?";

            const response = await Common.askConfirmationforCancel(message);

            if (!response) {
                $('#loader-pms').hide();
                return false;
            }
        }

        var InsertUpdateTransferStatic = {};
        InsertUpdateTransferStatic = {
            TransferId: EditTransferId > 0 ? EditTransferId : null,
            TransferNo: $('#TransferNo').val() || null,
            TransferDate: $('#TransferDate').val() || null,
            TransferType: parseInt(transferType) || null,
            TransferTypeId: parseInt(typeID) || null,
            FromFranchiseId: parseInt(fromAddressId) || null,
            ToFranchiseId: parseInt(toAddressId) || null,
            NoOfProducts: parseFloat($('#AssetTotal').val() || 0.00),
            Notes: $('#AddNotesText').val() || "",
            TermsandCondition: $('#TermsAndCondition').val() || "",
            ModeOfTransportId: parseInt($('#ModeOfTransferId').val()) || null,
            TransportNo: $('#Transportno').val() || null,
            TransferStatusId: transferStatusId || null,
        };

        var InsertUpdateTransferDetails = [];

        $('#POProductTablebody .ProductTableRow').each(function () {
            var $rowTable = $(this);

            var ProductId = parseInt($rowTable.find('.ProductId').text());
            var TransferProductMappingId = $rowTable.find('.TransferProductMappingId').text();
            var parseMappingId = TransferProductMappingId === "" ? null : parseInt(TransferProductMappingId);

            var transferType = $('#TransferType').val();
            var quantity;

            if (transferType == '2') {
                quantity = parseFloat($rowTable.find('.OutwardedQtyMainTable').val());
            } else if (transferType == '3') {
                quantity = parseFloat($rowTable.find('.InwardedQtyMainTable').val());
            } else {
                quantity = parseFloat($rowTable.find('.QtyMainTable').val());
            }

            quantity = Number.isNaN(quantity) ? null : quantity.toFixed(2);

            var productDetail = {
                TransferProductMappingId: parseMappingId,
                ProductId: ProductId,
                TransferId: EditTransferId > 0 ? EditTransferId : null,
                Quantity: quantity,
                UnitId: parseInt($rowTable.find('.ForBindtableProductUnit').val()) || null,
            };

            InsertUpdateTransferDetails.push(productDetail);
        });

        formDataMultiple.append("InsertUpdateTransferStatic", JSON.stringify(InsertUpdateTransferStatic));
        formDataMultiple.append("InsertUpdateTransferDetails", JSON.stringify(InsertUpdateTransferDetails));
        formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
        formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

        $.ajax({
            type: "POST",
            url: "/Inventory/InsertUpdateTransferDetails",
            data: formDataMultiple,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status) {
                    Common.successMsg(response.message);
                    $('#TransferModal').hide();
                    $('#selectedFiles,#ExistselectedFiles').empty('');
                    existFiles = [];
                    formDataMultiple = new FormData();
                    $('#loader-pms').hide();
                    var fnData = Common.getDateFilter('dateDisplay2');
                    Common.ajaxCall("GET", "/Inventory/GetTransfer", { TransferId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: parseInt(FranchiseMappingId) }, GetTransferSuccess, null);
                }
            },
            error: function (response) {
                $('#loader-pms').hide();
            },
        });
    });

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var EditTransferId = $(this).data('id');
            Common.ajaxCall("GET", "/Inventory/DeleteTransferDetails", { TransferId: parseInt(EditTransferId) }, DeleteTransferSuccess, null);
        }
    });

    $(document).on('click', '#BtnAdd', function () {

        $('.modal-body').scrollTop(0);

        let isAnyChecked = false;
        $('.AllProductRowItem').each(function () {
            if ($(this).find('input[type="checkbox"]').prop('checked')) {
                isAnyChecked = true;
                return false;
            }
        });

        if (!isAnyChecked) {
            Common.warningMsg('Select at least one Asset to add.');
            return;
        }


        $('.AllProductRowItem').each(function () {
            var $row = $(this);
            var $checkbox = $row.find('input[type="checkbox"]');

            if ($checkbox.prop('checked')) {
                var ProductId = $row.find('.ProductId').text().trim();
                var ProductName = $row.find('.ProductName').text().trim();
                var ProductType = $row.find('.ProductType').text().trim();
                var QtyProductAdd = $row.find('.QtyProductAdd').val().trim();
                var defaultDescription = ProductName;

                var $unitSelect = $row.find('select.unit-dropdown-select');

                var unitDropdownHtml = '<select class="form-control ForBindtableProductUnit" data-productid="' + ProductId + '">';

                $unitSelect.find('option').each(function () {
                    var optionValue = $(this).val();
                    var optionText = $(this).text();
                    var isSelected = $(this).is(':selected') ? 'selected' : '';
                    unitDropdownHtml += `<option value="${optionValue}" ${isSelected}>${optionText}</option>`;
                });

                unitDropdownHtml += '</select>';


                ProductIdArray.push(ProductId);

                var newRow = `
                <tr class="ProductTableRow">
                    <td data-label="No"></td>
                    <td data-label="Asset Name">
                        <label class="d-none TransferProductMappingId"></label>
                        <label class="d-none ProductId">${ProductId}</label>
                        <label>${ProductName}</label>
                        <textarea class="form-control mt-2 descriptiontdtext d-none" placeholder="Description">${defaultDescription}</textarea>
                    </td>
                    <td>
                        ${unitDropdownHtml}
                    <td>
                       <input type="text" class="form-control QtyMainTable" id="QtyMainTable" name="QtyMainTable" value="${QtyProductAdd}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)">
                    </td>
                    <td data-label="Action" style="display: flex; justify-content: center; align-items: center; border: none;">
                        <button class="btn DynremoveBtn DynrowRemove" style="margin-top: 1px;" type="button">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
                `;

                $('#AddItemButtonRow').before(newRow);

                $checkbox.prop('checked', false);
            }
        });

        $('#ProductModal').hide();

        $('#POProductTablebody .ProductTableRow').each(function (index) {
            $(this).find('td:first').text(index + 1);
        });

        $('#AssetTotal').val($('#POProductTablebody .ProductTableRow').length);
        $('#BarodeNumberDiv').addClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-flex justify-content-end');
    });

    $(document).on('click', '.DynrowRemove', function () {
        var $row = $(this).closest('tr');
        var ProductId = $row.find('.ProductId').text().trim();
        ProductIdArray = ProductIdArray.filter(id => id !== ProductId);
        $row.remove();
        $('#POProductTablebody .ProductTableRow').each(function (index) {
            $(this).find('td:first').text(index + 1);
        });
        $('#AssetTotal').val($('#POProductTablebody .ProductTableRow').length);
    });

    $(document).on('click', '.addQtyBtn', function () {
        $(this).hide();
        $(this).closest('td').find('.OtyColumn').toggleClass('d-none');
        updateSelectedItemCount()
    });

    $(document).on('change', '#ProductItem-table-body .AllProductRowItem input[type="checkbox"]', function () {
        updateSelectedItemCount();
    });

    $(document).on('change', '.ForBindtableProductUnit', function () {
        $(this).closest('tr').find('.QtyMainTable').val('');
    });

    $(document).on('input', '#AdditemSearch', function () {
        applyTableFilterForPopAsset();
    });

    $(document).on('click', '.modal-close-btn', function () {
        $('#ProductModal').hide();
    });

    $(document).on('click', '#TransferClose, #TransferCancelBtn', function () {
        $('#TransferModal').hide();
    });

    $(document).on('click', '#AddItemBtn', function () {
        var FromBranch = $('#FromAddressId').val();
        if (FromBranch != "") {

            $('#loader-pms').show();
            $('#AdditemSearch').val('');
            updateSelectedItemCount();
            $('#TotalItemSelect').text('');
            $('.TotalSelectedItmsPra').hide();
            $('#ProductItem-table-body').empty('');
            $('#ProductItem-table-body .AllProductRowItem').remove();
            $.ajax({
                type: 'GET',
                dataType: "json",
                url: '/Sale/DispatchAddressDetails',
                data: {
                    MasterInfoId: parseInt(FromBranch),
                    ModuleName: "Product_Transfer"
                },
                success: function (response) {
                    GetAssetFromPopSuccess(response);
                },
                error: function (response) {
                    // Handle error here
                }
            });
        }
        else {
            Common.warningMsg("Choose From Address.");
        }
    });

    $(document).on('click', '#toggleVendorInfo', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#BranchContent, #ToBranchContent').stop(true, true).slideToggle(300, function () {
            const isVisible = $(this).is(':visible');
            $('.BilAddHead').css('border-bottom', isVisible ? '1px solid #c7c7c7' : 'none');
        });
        $('#toggleIconBranch').toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('#closePopup, #popupOverlay').on('click', function () {
        $('#imagePreviewPopup, #popupOverlay').fadeOut();
    });

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
});

function ajaxPromise(method, url, data) {
    return new Promise((resolve, reject) => {
        Common.ajaxCall(method, url, data, resolve, reject);
    });
}
function GetTransferSuccess() {
    // ✅ Hardcoded mock API response
    const response = {
        status: true,
        data: JSON.stringify([
            [
                {
                    "This Month": 1,
                    "Total Request": 0,
                    "Total OutWard": 0,
                    "Total InWard": 0
                }
            ],
            [
                {
                    "TransferId": 1,
                    "TransferNo": "TRANS_112",
                    "TransferDate": "04-10-2025",
                    "TransferType": "Request",
                    "FromPlant": "Unit1_Palladam",
                    "ToPlant": "HO_Coimbatore",
                    "NoOfProducts": 3,
                    "Status": "Goods Inwarded",
                    "Status_Color": "#6f42c1"
                }
            ]
        ])
    };

    // ✅ Access rights for actions
    const access = {
        update: true,
        delete: true
    };

    if (response.status) {
        var data = JSON.parse(response.data);

        // ✅ Counter binding
        var CounterBox = Object.keys(data[0][0]);
        $("#CounterTextBox1").text(CounterBox[0]);
        $("#CounterTextBox2").text(CounterBox[1]);
        $("#CounterTextBox3").text(CounterBox[2]);
        $("#CounterTextBox4").text(CounterBox[3]);

        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        // ✅ Reset table container
        $('#TransferMainTableDynamic').empty();
        $('#TransferMainTableDynamic').html(`
            <div class="table-responsive">
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="TransferTable"></table>
            </div>
        `);

        // ✅ Define DataTable columns
        var columns = [
            { data: "TransferNo", title: "Transfer No" },
            { data: "TransferDate", title: "Transfer Date" },
            { data: "TransferType", title: "Transfer Type" },
            { data: "FromPlant", title: "From Plant" },
            { data: "ToPlant", title: "To Plant" },
            { data: "NoOfProducts", title: "No Of Products" },
            { data: "Status", title: "Status" }
        ];

        // ✅ Use your existing reusable table binder
        Common.bindTable('TransferTable', data[1], columns, -1, 'TransferId', '360px', true, access);
    }
}
//function GetTransferSuccess(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var CounterBox = Object.keys(data[0][0]);

//        $("#CounterTextBox1").text(CounterBox[0]);
//        $("#CounterTextBox2").text(CounterBox[1]);
//        $("#CounterTextBox3").text(CounterBox[2]);
//        $("#CounterTextBox4").text(CounterBox[3]);

//        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
//        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
//        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
//        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

//        $('#TransferMainTableDynamic').empty();

//        $('#TransferMainTableDynamic').html(`
//            <div class="table-responsive">
//                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="TransferTable"></table>
//            </div>
//        `);

//        var columns = Common.bindColumn(data[1], ['TransferId', 'Status_Color']);
//        Common.bindTable('TransferTable', data[1], columns, -1, 'TransferId', '360px', true, access);
//    }
//}

async function GetTransferNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        TransferTypeNo = data[0][0].TransferType;

        $('#TransferType').val(data[0][0].TransferType).prop('disabled', false);
        if (data[0][0].TransferType == 1) {
            $('#TransferType option[value="3"]').remove();
        }
        else if (data[0][0].TransferType == 2) {
            $('#TransferType option[value="1"]').remove();
        }
        else if (data[0][0].TransferType == 3) {
            $('#TransferType').prop('disabled', true);
        }

        if (data[0][0].TransferType == 1 && data[0][0].TransferStatusId == 1) {
            $('#TransferType').prop('disabled', true);
        } else {
            $('#TransferType').prop('disabled', false);
        }

        $('#TransferType option[value=""]').remove();

        IsFromFranchise = data[0][0].IsFromFranchise;
        if (data[0][0].TransferType == 2 && data[0][0].TransferStatusId == 3) {
            $('#TransferSaveBtn').hide();
        }
        else if (data[0][0].IsFromFranchise == "Yes") {
            $('#TransferSaveBtn').hide();
        } else if (data[0][0].IsFromFranchise == "No") {
            $('#TransferSaveBtn').show();
        }

        if (data[0][0].TransferType != 1) {
            $('#FromAddressId, #ToAddressId, #TypeID, #AddNotesText, #TransferNo, #AssetTotal').val('');
            $('#FromAddress, #FromCity, #FromContactNumber, #FromStateId').text('');
            $('#AddNotes, #HideNotesLable, #AddAttachment, #HideAttachlable, #AddItemButtonRow').hide();
            $('#AddNotesLable, #AddAttachLable, #TransferTypeDiv').show();
            $('#selectedFiles,#ExistselectedFiles').empty('');
            $('#BarodeNumberDiv').removeClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-flex justify-content-end').addClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-none justify-content-end');
            $('#TransferStatusId').empty();
            $('.ProductTableRow').remove();
            $('#DivModeOfTransport').show();
            $('#DivTransportno').show();

            $('#FromAddressId').val(data[0][0].FromFranchiseId).trigger('change');
            $('#ToAddressId').val(data[0][0].ToFranchiseId).trigger('change');
        }
        else {
            $('#TransferTypeDiv, #AddNotes, #AddTerms, #HideTermsLable, #HideAttachlable, #AddAttachment, #HideNotesLable').hide();
            $('#AddItemButtonRow, #AddNotesLable, #AddTermsLable, #AddAttachLable').show();
            $('#ToAddressId, #TypeID, #AddNotesText, #TermsAndCondition, #ModeOfTransferId, #Transportno, #AssetTotal').val('');
            $('#selectedFiles,#ExistselectedFiles').empty('');
            $('#BarodeNumberDiv').removeClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-flex justify-content-end').addClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-none justify-content-end');
            $('#TransferStatusId').empty();
            $('.ProductTableRow').remove();
            $('#DivModeOfTransport').hide();
            $('#DivTransportno').hide();

            $('#FromAddressId').val(data[0][0].FromFranchiseId).trigger('change');
            $('#ToAddressId').val(data[0][0].ToFranchiseId).trigger('change');
        }

        $('#TransferType').val(data[0][0].TransferType);
        var DateFormate = data[0][0].TransferDate;
        var DateFormateSplit = DateFormate.split('T')[0];
        $('#TransferDate').val(DateFormateSplit);

        $('#AssetTotal').val(data[0][0].NoOfProducts);
        $('#TransferNo').val(data[0][0].TransferNo);

        $('#ModeOfTransferId').val(data[0][0].ModeOfTransportId).trigger('change');
        $('#Transportno').val(data[0][0].TransportNo).trigger('change');

        var thisTransferType = $('#TransferType').val();
        $('.ProductTableRow').remove();

        if (data[1] && data[1].length > 0 && data[1][0].ProductId != "" && data[1][0].ProductId != null) {
            let rowIndex = 1;

            data[1].forEach(item => {
                ProductIdArray.push(item.ProductId.toString());

                let unique = Math.random().toString(36).substring(2);

                var optionVal = `
                    <option value="${item.PrimaryUnitId}" ${item.SelectedUnitId === item.PrimaryUnitId ? 'selected' : ''}>${item.PrimaryUnitName}</option>
                    <option value="${item.SecondaryUnitId}" ${item.SelectedUnitId === item.SecondaryUnitId ? 'selected' : ''}>${item.SecondaryUnitName}</option>
                `;

                // Start building the row
                let newRow = `
                <tr class="ProductTableRow">
                    <td data-label="No"></td>
                    <td data-label="Asset Name">
                        <label class="d-none TransferProductMappingId">${item.TransferProductMappingId}</label>
                        <label class="d-none ProductId">${item.ProductId}</label>
                        <label>${item.ProductName}</label>
                        <textarea class="form-control mt-2 descriptiontdtext d-none" placeholder="Description">${item.ProductName}</textarea>
                    </td>
                    <td>
                        <select class="form-control ForBindtableProductUnit" id="ForBindtableProductUnit" name="ForBindtableProductUnit" required>
                            ${optionVal}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control QtyMainTable" id="QtyMainTable${unique}" name="QtyMainTable${unique}" value="${item.RequestQty.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>`;

                // 🔽 Conditionally add extra <td> only when EditTransferId != 0
                if (EditTransferId == 0 && data[0][0].TransferType == 1) {
                    newRow += `
                    <td class="TD_Outwarded_Col">
                        <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${item.OutwardQty.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>`;
                } else if (EditTransferId != 0 && data[0][0].TransferType == 2) {
                    newRow += `
                    <td class="TD_Outwarded_Col">
                        <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${item.OutwardQty.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>`;
                }
                else if (EditTransferId == 0 && data[0][0].TransferType == 2) {
                    newRow += `
                    <td class="TD_Outwarded_Col">
                        <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${item.OutwardQty.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>
                    <td class="TD_Inward_Col">
                        <input type="text" class="form-control InwardedQtyMainTable" id="InwardedQtyMainTable${unique}" name="InwardedQtyMainTable${unique}" value="${item.InwardQty.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>`;
                } else if (EditTransferId != 0 && data[0][0].TransferType == 3) {
                    newRow += `
                   <td class="TD_Outwarded_Col">
                        <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${item.OutwardQty.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>
                    <td class="TD_Inward_Col">
                        <input type="text" class="form-control InwardedQtyMainTable" id="InwardedQtyMainTable${unique}" name="InwardedQtyMainTable${unique}" value="${item.InwardQty.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>`;
                }
                // Finish the row
                newRow += `
                    <td data-label="Action" style="display: flex; justify-content: center; align-items: center; border: none;">
                        <button class="btn DynremoveBtn DynrowRemove" style="margin-top: 1px;" type="button">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>`;

                // Append the row to the table
                $('#AddItemButtonRow').before(newRow);

                // Update row numbers
                $('#POProductTablebody .ProductTableRow').each(function (index) {
                    $(this).find('td:first').text(index + 1);
                });

                // Enable/disable fields based on transfer type
                //if (thisTransferType == 2) {
                //    $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', false);
                //} else if (thisTransferType == 3) {
                //    $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', true);
                //}
            });
        }

        if (data[0][0].IsWhereTypeTwo == "Yes") {
            //$('#TransferType').prop('disabled', true);
            $('.DynrowRemove').prop('disabled', false);
        } else {
            //$('#TransferType').prop('disabled', false);
            $('.DynrowRemove').prop('disabled', true);
        }

        if (data[0][0].TransferType == 2) {
            $('.TH_Request_Col').show();
            $('.TH_Inwarded_Col').hide();
            $('.TH_Outwarded_Col').show();

            var totalColumns = $('#POProductTable thead tr th').length;
            $('#AddItemButtonRow td').attr('colspan', totalColumns);
            $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 3);
            $('#SubtotalRow td').eq(1).attr('colspan', 1);
            $('#SubtotalRow td').eq(2).attr('colspan', 1);

            $('.ProductNameSpanHead').text('11111111111');
            $('.UnitSpanHead').text('111111111');
        } else if (data[0][0].TransferType == 3) {
            $('.QtyMainTable, .OutwardedQtyMainTable, .InwardedQtyMainTable, .DynrowRemove').prop('disabled', true);
            $('.TH_Request_Col').show();
            $('.TH_Inwarded_Col').show();
            $('.TH_Outwarded_Col').show();

            var totalColumns = $('#POProductTable thead tr th').length;
            $('#AddItemButtonRow td').attr('colspan', totalColumns);
            $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 2);
            $('#SubtotalRow td').eq(1).attr('colspan', 1);
            $('#SubtotalRow td').eq(2).attr('colspan', 1);

            $('.ProductNameSpanHead').text('1111111');
            $('.UnitSpanHead').text('111');
        } else {
            $('.TH_Request_Col').show();
            $('.TH_Inwarded_Col').hide();
            $('.TH_Outwarded_Col').hide();

            var totalColumns = $('#POProductTable thead tr th').length;
            $('#AddItemButtonRow td').attr('colspan', 5);
            $('#SubtotalRow td').eq(0).attr('colspan', 3);
            $('#SubtotalRow td').eq(1).attr('colspan', 1);
            $('#SubtotalRow td').eq(2).attr('colspan', 1);
        }

        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();
        if (data[2] && data[2].length > 0 && data[2][0].AttachmentId != "" && data[2][0].AttachmentId != null) {
            Common.bindAttachments(data[2]);
            $('#AddAttachment').show();
            $('#AddAttachLable').hide();
            $('#HideAttachlable').show();
        }
        else {
            $('#AddAttachment').hide();
            $('#AddAttachLable').show();
            $('#HideAttachlable').hide();
        }

        if (data[0][0].TermsandCondition != "" && data[0][0].TermsandCondition != null) {
            $('#AddTerms').show();
            $('#AddTermsLable').hide();
            $('#HideTermsLable').show();
            $('#TermsAndCondition').val(data[0][0].TermsandCondition);
        }
        else {
            $('#AddTerms').hide();
            $('#AddTermsLable').show();
            $('#HideTermsLable').hide();
            $('#TermsAndCondition').val('');
        }

        $('#AddNotesText').val(data[0][0].Notes);
        if (data[0][0].Notes != "" && data[0][0].Notes != null) {
            $('#AddNotes').show();
            $('#AddNotesLable').hide();
            $('#HideNotesLable').show();
            $('#AddNotesText').val(data[0][0].Notes);
        }
        else {
            $('#AddNotes').hide();
            $('#AddNotesLable').show();
            $('#HideNotesLable').hide();
            $('#AddNotesText').val('');
        }

        var EditDataId = { ModuleName: "Transfer", ModuleId: parseInt(EditTransferId), type: parseInt(data[0][0].TransferType) };
        Common.ajaxCall("GET", "/Inventory/GetTransferStatusDetails", EditDataId, function (response) {
            StatusSuccess(response);
            if (data[0][0].TransferStatusId == 2)
                $('#TransferStatusId option[value="1"]').remove();

            $('#TransferStatusId').val(data[0][0].TransferStatusId).trigger('change');
        }, null);
    }
}

function DeleteTransferSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        formDataMultiple = new FormData();
        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Inventory/GetTransfer", { TransferId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: parseInt(FranchiseMappingId) }, GetTransferSuccess, null);
    }
}

function StatusSuccess(response) {
    var id = "TransferStatusId";
    Common.bindDropDownSuccess(response.data, id);
}

/*========================================================Status Tracking=================================================================*/

function StatusActivitySuccess(response) {
    var parsedData = JSON.parse(response.data);
    var timelineData = parsedData[0];

    var $timeline = $(".horizontal-timeline");

    // Remove existing stages
    $timeline.find(".timeline-stage").remove();
    var progressStatuses = [];

    // Append new timeline stages
    $.each(timelineData, function (index, item) {
        var status = item.InventoryStatusName || "Unknown";
        var user = item.UserName || "N/A";
        var color = item.Status_Color || "#000";

        var date = new Date(item.CreatedDate);
        var formattedDate = date.toLocaleDateString('en-GB') + ', ' +
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        var statusClass = "status-" + status.toLowerCase().replace(/\s+/g, '');

        var $stage = $('<div>', {
            class: `timeline-stage ${statusClass}`
        });

        var $marker = $('<div>', { class: 'stage-marker' });

        var $statusSpan = $('<span>', {
            class: 'stage-status',
            text: status,
            css: { color: color }
        });

        $marker.append($statusSpan);

        var $content = $('<div>', { class: 'stage-content' });
        $('<span>', { class: 'stage-approver', text: user }).appendTo($content);
        $('<span>', { class: 'stage-datetime', text: formattedDate }).appendTo($content);

        $stage.append($marker).append($content);
        $timeline.append($stage);

        progressStatuses.push(status);

    });

    setTimeout(function () {
        updateTimelineProgress(progressStatuses);
    }, 1000);
}

function updateTimelineProgress(progressStatuses) {
    var $timeline = $(".horizontal-timeline");
    var $fillLine = $timeline.find(".timeline-progress-line-fill");
    var $stages = $timeline.find(".timeline-stage");

    if ($stages.length === 0) return;

    let $lastValidStage = null;

    $stages.each(function () {
        const statusText = $(this).find(".stage-status").text().trim();
        if (progressStatuses.includes(statusText)) {
            $lastValidStage = $(this);
        }
    });

    if ($lastValidStage) {
        const $marker = $lastValidStage.find(".stage-marker");
        const timelineLeft = $timeline.offset().left;
        const markerCenter = $marker.offset().left + ($marker.outerWidth() / 2);

        const fillWidth = markerCenter - timelineLeft;

        $fillLine.css({
            width: fillWidth + "px"
        });
    } else {
        $fillLine.css({ width: "0" });
    }
}

/*========================================================End Status Tracking=================================================================*/

/*========================================================Attachment=================================================================*/

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Transfer",
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

                downloadButton.addEventListener('click', () => {
                    const blob = new Blob([file]);
                    const blobURL = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobURL;
                    a.download = file.name;
                    a.click();
                    URL.revokeObjectURL(blobURL);
                });

                deleteButton.addEventListener('click', () => {
                    var itemName = $(fileItem).find('span').text().trim();

                    var newFormData = new FormData();
                    var remainingFiles = formDataMultiple.getAll('files[]');

                    remainingFiles.forEach(file => {
                        // Keep only files with a different name
                        if (file.name !== itemName) {
                            newFormData.append('files[]', file);
                        }
                    });

                    formDataMultiple = newFormData;

                    // Remove from UI
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

function getExistFiles() {

    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "Transfer",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

/*========================================================End Attachment=================================================================*/

function updateSelectedItemCount() {
    let count = $('#ProductItem-table-body .AllProductRowItem input[type="checkbox"]:checked').length;
    $('#TotalItemSelect').text(count);
    $('.TotalSelectedItmsPra').toggle(count > 0);
}

$('#ProductItem-table-body').on('change', '.AllProductRowItem input[type="checkbox"]', function () {
    updateSelectedItemCount();

    if (!$(this).is(':checked')) {
        let $row = $(this).closest('tr');
        $row.find('.addQtyBtn').show();
        $row.find('.QtyProductAdd').val('1');
    }
});

$(document).on('input', '.QtyProductAdd', function () {
    let $row = $(this).closest('tr');
    let stockInHand = Number($row.find('.StockInHand').text().trim());
    let enteredQty = Number($(this).val());

    if (enteredQty > stockInHand) {
        $(this).val(stockInHand);
    }
});

function disableSameOption(fromSelector, toSelector) {
    const selectedVal = $(fromSelector).val();
    $(toSelector + ' option').prop('disabled', false).removeClass('d-none');
    if (selectedVal !== "") {
        $(toSelector + ' option').filter(function () {
            return $(this).val() === selectedVal;
        }).prop('disabled', true).addClass('d-none');
    }
}

function GetAssetFromPopSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        const Product = data[0];

        $('#ProductItem-table-body .AllProductEmptyRow').remove();

        if (Product && Product.length > 0 && Product[0].ProductId != "" && Product[0].ProductId != null) {
            let hasNewAsset = false;

            Product.forEach(product => {
                const ProductIdStr = product.ProductId.toString();

                if (ProductIdArray.includes(ProductIdStr)) {
                    return;
                }

                hasNewAsset = true;

                const row = `
                <tr class="AllProductRowItem">
                    <td>
                        <div class="d-flex">
                            <input class="mr-2" type="checkbox" id="ProductId-${product.ProductId}">
                            <label class="ProductId d-none">${product.ProductId}</label>
                            <label class="ProductName" for="ProductId-${product.ProductId}">${product.ProductName}</label>
                        </div>
                    </td>
                    <td><label class="ProductType">${product.Type}</label></td>
                    <td><label class="StockInHand">${product.StockInHand}</label></td>
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
                $('#ProductItem-table-body').append(row);
                const $lastRow = $('#ProductItem-table-body tr').last();
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

            // ✅ If no new assets were added
            if (!hasNewAsset) {
                $('#ProductItem-table-body').html(`
                    <tr>
                        <td valign="top" colspan="3" class="dataTables_empty">
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
            $('#ProductItem-table-body').html(`
                <tr>
                    <td valign="top" colspan="3" class="dataTables_empty">
                        <div class="d-flex justify-content-center">
                            <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                            No Record Found
                        </div>
                    </td>
                </tr>
            `);
        }
        $('#ProductModal').show();
        $('#loader-pms').hide();
    }
}

function applyTableFilterForPopAsset() {
    let filterValue = $('#AdditemSearch').val().toLowerCase().trim();
    let visibleRowCount = 0;

    $('#ProductItem-table-body .AllProductEmptyRow').remove();

    $('#ProductItem-table-body .AllProductRowItem').each(function () {
        let ProductName = $(this).find('label.ProductName').text().toLowerCase();
        let ProductType = $(this).find('label.ProductType').text().toLowerCase();

        let isVisible = ProductName.includes(filterValue) || ProductType.includes(filterValue);

        $(this).toggle(isVisible);

        if (isVisible) {
            visibleRowCount++;
        }
    });

    if (visibleRowCount === 0) {
        $('#ProductItem-table-body').append(`
            <tr class="AllProductEmptyRow">
                <td colspan="3" class="text-center text-danger">No matching products found.</td>
            </tr>
        `);
    }
}

$(document).keydown(function (event) {

    // Handling Alt + p
    if (event.altKey && event.key === 'p') {
        event.preventDefault();
        $('#btnTransfersaveprintbtn').click();
    }

    // Handling alt + v
    if (event.altKey && event.key === 'v') {
        event.preventDefault();
        $('#btnPreviewTransfer').click();
    }

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#TransferSaveBtn').click();
    }

    // Handling alt + h
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        $('#btnshareTransfer').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#TransferCancelBtn').click();
    }
});

function removeVal() {

    $('#FromAddress').text('');
    $('#FromCity').text('');
    $('#FromContactNumber').text('');
    $('#FromStateId').text('');

    $('#ToAddress').text('');
    $('#ToCity').text('');
    $('#ToContactNumber').text('');
    $('#ToName').text('');
    $('#ToStateId').text('');

    $('#FromAddressId').val('');
    $('#ToAddressId').val('');

    $('#TransferNo').val('');
    $('#TransferDate').val('');
    $('#TransferType').val('');
    $('#TypeID').val('');
    $('#AssetTotal').val('');
    $('#AddNotesText').val('');
    $('#TermsAndCondition').val('');
    $('#TransferStatusId').val('');

    $('#AddTerms').hide();
    $('#AddTermsLable').show();
    $('#HideTermsLable').hide();
    $('#TermsAndCondition').val('');

    //$('#TransferTypeDiv').hide();

    $('#AddNotes').hide();
    $('#AddNotesLable').show();
    $('#HideNotesLable').hide();
    $('#AddNotesText').val('');

    $('#AddAttachment').hide();
    $('#AddAttachLable').show();
    $('#HideAttachlable').hide();

    $('.imageAppend').empty();

    $('#POProductTablebody .ProductTableRow').remove('');

    $('#BarodeNumberDiv').removeClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-flex justify-content-end').addClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-none justify-content-end');

    $('#selectedFiles,#ExistselectedFiles').empty('');
    ProductIdArray = [];
    deletedFiles = [];
    existFiles = [];
    formDataMultiple = new FormData();

    var totalColumns = $('#POProductTable thead tr th').length;
    $('#AddItemButtonRow td').attr('colspan', 5);
    $('#SubtotalRow td').eq(0).attr('colspan', 3);
    $('#SubtotalRow td').eq(1).attr('colspan', 1);
    $('#SubtotalRow td').eq(2).attr('colspan', 1);
}