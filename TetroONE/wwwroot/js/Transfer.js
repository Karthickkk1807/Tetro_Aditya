var deletedFiles = [];
var existFiles = [];
var ProductIdArray = [];
var formDataMultiple = new FormData();
var EditTransferId = 0;
var FranchiseMappingId = 0;
var printType = "";

$(document).ready(function () {

    $('.Status-Div').removeClass('d-block').addClass('d-none');

    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

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
        Common.ajaxCall("GET", "/Inventory/GetTransfer", { TransferId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: parseInt(FranchiseMappingId) }, GetTransferSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Inventory/GetTransfer", { TransferId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: parseInt(FranchiseMappingId) }, GetTransferSuccess, null);
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

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Inventory/GetTransfer", { TransferId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), FranchiseId: parseInt(FranchiseMappingId) }, GetTransferSuccess, null);

    Common.bindDropDownParent('TransferType', 'FormRightSideHeader', 'TransferType');
    Common.bindDropDownParent('FromAddressId', 'FormVendor', 'FromFranchise_Transfer');
    Common.bindDropDownParent('ToAddressId', 'FormShipping', 'ToFranchise_Transfer');
    Common.bindDropDownParent('ModeOfTransferId', 'FormStatus', 'ModeOfTransport');
    $('#TransferStatusId').empty().append($('<option>', { value: '', text: '--Select--', }));

    $(document).on('click', '#AddTransfer', function () {
        $('#loader-pms').show();

        $('#AddItemButtonRow').show();
        $('.ProductTableRow').hide();
        $('#TransferTypeDiv').hide();
        removeVal();
        //enableAllFields();

        $('#BranchContent,#ToBranchContent').hide();
        $('#toggleIconBranch').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        $('.BilAddHead').css('border-bottom', 'none');

        Common.removeMessage('FormRightSideHeader');
        Common.removeMessage('FormVendor');
        Common.removeMessage('FormShipping');
        Common.removeMessage('FormStatus');

        $('#Transferheader').text('Add Transfer');
        $('#TransferStatusId').empty().prop('disabled', false);
        //$('#TransferType').val('1').trigger('change').prop('disabled', true);

        var request = {
            moduleName: 'TransferType'
        };
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: '/Common/GetDropDown',
            data: JSON.stringify(request),
            success: function (response) {
                if (response.status == true) {
                    if (response != null) {
                        $('#TransferType').empty();
                        var data = JSON.parse(response.data);
                        var dataValue = data[0];
                        var parent = 'FormRightSideHeader';
                        var controlid = 'TransferType';
                        if (dataValue != null && dataValue.length > 0 && !dataValue[0].hasOwnProperty('TetroONEnocount')) {
                            var valueproperty = Object.keys(dataValue[0])[0];
                            var textproperty = Object.keys(dataValue[0])[1];
                            $('#' + parent + ' #' + controlid).empty();
                            $('#' + parent + ' #' + controlid).append($('<option>', {
                                value: '',
                                text: '--Select--',
                            }));
                            $.each(dataValue, function (index, item) {
                                $('#' + parent + ' #' + controlid).append($('<option>', {
                                    value: item[valueproperty],
                                    text: item[textproperty],
                                }));
                            });
                        }
                    }
                }
                $('#TransferType option[value="3"]').remove();
                $('#TransferType').val('1').trigger('change');
            },
            error: function (response) {

            },
        });

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
                $("#btnTransfersaveprintbtn span:first").text("Save & Print");
                $("#btnPreviewTransfer span:first").text("Save & Preview");

                //enableAllFields();
                $('#btnTransfersaveprintbtn').hide();
                $('#TransferModal .modal-body').scrollTop(0);
                $('#FromAddressId').val(FranchiseMappingId).trigger('change');
                $('#TransferModal').show();
            }

            $('#loader-pms').hide();
        }, function () {
            $('#loader-pms').hide();

        });
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

    $(document).on('input', '#AdditemSearch', function () {
        applyTableFilterForPopAsset();
    });

    $(document).on('click', '.modal-close-btn', function () {
        $('#ProductModal').hide();
    });

    $(document).on('click', '.btn-edit', async function () {
        EditTransferId = $(this).data('id');
        $('#TransferModal').show();
        $('#loader-pms').show();
        $('#TransferModal .modal-body').scrollTop(0);

        var request = {
            moduleName: 'TransferType'
        };
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: '/Common/GetDropDown',
            data: JSON.stringify(request),
            success: function (response) {
                if (response.status == true) {
                    if (response != null) {
                        $('#TransferType').empty();
                        var data = JSON.parse(response.data);
                        var dataValue = data[0];
                        var parent = 'FormRightSideHeader';
                        var controlid = 'TransferType';
                        if (dataValue != null && dataValue.length > 0 && !dataValue[0].hasOwnProperty('TetroONEnocount')) {
                            var valueproperty = Object.keys(dataValue[0])[0];
                            var textproperty = Object.keys(dataValue[0])[1];
                            $('#' + parent + ' #' + controlid).empty();
                            $('#' + parent + ' #' + controlid).append($('<option>', {
                                value: '',
                                text: '--Select--',
                            }));
                            $.each(dataValue, function (index, item) {
                                $('#' + parent + ' #' + controlid).append($('<option>', {
                                    value: item[valueproperty],
                                    text: item[textproperty],
                                }));
                            });
                        }
                    }
                }
            },
            error: function (response) {

            },
        });

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
        if (thisval === "1") {
            $('#FromAddressId').val(FranchiseMappingId).trigger('change');
            $('#TransferTypeDiv').hide();
            $('#AddItemButtonRow').show();
            $('#ToAddressId').val('');
            $('#TypeID').val('');
            $('#AddNotes').hide();
            $('#DivModeOfTransport').hide();
            $('#DivTransportno').hide();
            $('#AddNotesLable').show();
            $('#HideNotesLable').hide();
            $('#AddNotesText').val('');
            $('#AddTerms').hide();
            $('#AddTermsLable').show();
            $('#HideTermsLable').hide();
            $('#TermsAndCondition').val('');
            $('#selectedFiles,#ExistselectedFiles').empty('');
            $('#AddAttachment').hide();
            $('#AddAttachLable').show();
            $('#HideAttachlable').hide();
            $('#BarodeNumberDiv').removeClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-flex justify-content-end').addClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-none justify-content-end');
            $('#TransferStatusId').empty();
            $('.ProductTableRow').remove();
            $('#ModeOfTransferId').val('').trigger('change');
            $('#Transportno').val('');
            $('#AssetTotal').val('');
            $('#ToAddress').text('');
            $('#ToCity').text('');
            $('#ToContactNumber').text('');
            $('#ToName').text('');
            $('#ToStateId').text('');

            $('.TH_Request_Col').show();
            $('.TH_Inwarded_Col').hide();
            $('.TH_Outwarded_Col').hide();

            var totalColumns = $('#POProductTable thead tr th').length;
            $('#AddItemButtonRow td').attr('colspan', 5);

            // Assume default logic (same as "3" perhaps, or adjust as needed)
            $('#SubtotalRow td').eq(0).attr('colspan', 3);
            $('#SubtotalRow td').eq(1).attr('colspan', 1);
            $('#SubtotalRow td').eq(2).attr('colspan', 1);

            var today = new Date();
            var formattedDate = today.toISOString().split('T')[0];
            $('#TransferDate').val(formattedDate);

            if (EditTransferId == 0) {
                Common.ajaxCall("GET", "/Common/GetAutoGenerate", { ModuleName: "Transfer", FranchiseId: parseInt(FranchiseMappingId) }, function (response) {
                    if (response.status) {
                        var data = JSON.parse(response.data);
                        $('#TransferNo').val('');
                        $('#TransferNo').val(data[0][0].TransferNo);
                    }
                }, null);
            }

            if (EditTransferId == 0) {
                var EditDataId = { ModuleName: "Transfer", ModuleId: EditTransferId, type: parseInt(thisval) };

                Common.ajaxCall("GET", "/Inventory/GetTransferStatusDetails", EditDataId, function (response) {
                    StatusSuccess(response);
                    $('#TransferStatusId').val(1).trigger('change');
                }, null);
            }
        }
        else if (thisval === "2" || thisval === "3") {
            $('#FromAddressId').val(FranchiseMappingId).trigger('change');
            $('#TransferTypeDiv').show();
            $('#AddItemButtonRow').hide();
            $('#ToAddressId').val('');
            $('#TypeID').val('');
            $('#AddNotes').hide();
            $('#AddNotesLable').show();
            $('#HideNotesLable').hide();
            $('#DivModeOfTransport').show();
            $('#DivTransportno').show();
            $('#AddNotesText').val('');
            $('#AddTerms').hide();
            $('#AddTermsLable').show();
            $('#HideTermsLable').hide();
            $('#TermsAndCondition').val('');
            $('#selectedFiles,#ExistselectedFiles').empty('');
            $('#AddAttachment').hide();
            $('#AddAttachLable').show();
            $('#HideAttachlable').hide();
            $('#BarodeNumberDiv').removeClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-flex justify-content-end').addClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-none justify-content-end');
            $('#TransferStatusId').empty();
            $('.ProductTableRow').remove();

            /*if (EditTransferId == 0) {*/
            var EditDataId = { ModuleName: "Transfer", ModuleId: null, type: parseInt(thisval) };

            Common.ajaxCall("GET", "/Inventory/GetTransferStatusDetails", EditDataId, function (response) {
                StatusSuccess(response);
                $('#TransferStatusId').val(3).trigger('change');
                bindDropDownTransferNo(EditTransferId, thisval, FranchiseMappingId, 'TypeID', 'FormRightSideHeader');
            }, null);
            /*}*/
            bindDropDownTransferNo(EditTransferId, thisval, FranchiseMappingId, 'TypeID', 'FormRightSideHeader');

            if (thisval === "2") {
                $('#ChangeTheTransferNoLable').html(`Request No<span id="Asterisk">*</span>`);
                $('.TH_Request_Col').show();
                $('.TH_Inwarded_Col').hide();
                $('.TH_Outwarded_Col').show();
                //Calculated the Th Count
                var totalColumns = $('#POProductTable thead tr th').length;
                $('#AddItemButtonRow td').attr('colspan', totalColumns);

                $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 3);
                $('#SubtotalRow td').eq(1).attr('colspan', 1);
                $('#SubtotalRow td').eq(2).attr('colspan', 1);

                $('.ProductNameSpanHead').text('11111111111');
                $('.UnitSpanHead').text('111111');
            }
            else {
                $('#ChangeTheTransferNoLable').html(`OutWard No<span id="Asterisk">*</span>`);
                $('.TH_Request_Col').show();
                $('.TH_Inwarded_Col').show();
                $('.TH_Outwarded_Col').show();
                //Calculated the Th Count
                var totalColumns = $('#POProductTable thead tr th').length;
                $('#AddItemButtonRow td').attr('colspan', totalColumns);

                $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 2);
                $('#SubtotalRow td').eq(1).attr('colspan', 1);
                $('#SubtotalRow td').eq(2).attr('colspan', 1);

                $('.ProductNameSpanHead').text('1111111');
                $('.UnitSpanHead').text('111');
            }

            $('#FromAddress').text('');
            $('#FromCity').text('');
            $('#FromContactNumber').text('');

            $('#FromStateId').text('');
            $('#TransferNo').val('');
            $('#AssetTotal').val('');

            $('#ToAddress').text('');
            $('#ToCity').text('');
            $('#ToContactNumber').text('');
            $('#ToName').text('');
            $('#ToStateId').text('');
        }
        else {
            $('#DivModeOfTransport').hide();
            $('#DivTransportno').hide();
            $('#TransferTypeDiv').hide();
            $('#AddItemButtonRow').show();
            $('.ProductTableRow').remove();
            $('#ToAddressId').val('');
            $('#TypeID').val('');
            $('.TH_Request_Col').show();
            $('.TH_Inwarded_Col').hide();
            $('.TH_Outwarded_Col').hide();
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

    $(document).on('change', '#TypeID', function () {
        var thisval = $(this).val();
        if (thisval != "")
            Common.ajaxCall("GET", "/Inventory/DD_GetTransferDetails_TransferNo", { TransferId: thisval }, function (response) {
                if (response.status) {
                    var $thisTransferType = $('#TransferType').val();
                    if (EditTransferId == 0 && $thisTransferType == 2) {
                        $('#selectedFiles,#ExistselectedFiles').empty('');
                        existFiles = [];
                        formDataMultiple = new FormData();
                        GetTransferNotNullSuccess(response);
                    } else {
                        $('#selectedFiles,#ExistselectedFiles').empty('');
                        existFiles = [];
                        formDataMultiple = new FormData();
                        GetTransferNotNullForTransferType3Success(response);
                    }
                }
            }, null);
        else {
            $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', false);
            removeVal();
            $('#AddItemButtonRow').show();
            $('#POProductTablebody .ProductTableRow').remove('');
            $('#AssetTotal').val('');
            $('.imageAppend').empty();
        }
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
            TransportNo: $('#Transportno').val() || "",
            TransferStatusId: transferStatusId || null,
        };

        var InsertUpdateTransferDetails = [];

        $('#POProductTablebody .ProductTableRow').each(function () {
            var $rowTable = $(this);

            var ProductId = parseInt($rowTable.find('.ProductId').text());
            var TransferProductMappingId = $rowTable.find('.TransferProductMappingId').text();
            var parseMappingId = TransferProductMappingId == "" ? null : parseInt(TransferProductMappingId);

            var productDetail = {
                TransferProductMappingId: parseMappingId,
                ProductId: parseInt(ProductId),
                TransferId: EditTransferId > 0 ? EditTransferId : null,
                Quantity: Number.isNaN(parseFloat($rowTable.find('.QtyMainTable').val()))
                    ? null
                    : parseFloat($rowTable.find('.QtyMainTable').val()).toFixed(2),
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
});

function ajaxPromise(method, url, data) {
    return new Promise((resolve, reject) => {
        Common.ajaxCall(method, url, data, resolve, reject);
    });
}

function GetTransferSuccess(response) {
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

        $('#TransferMainTableDynamic').empty();

        $('#TransferMainTableDynamic').html(`
            <div class="table-responsive">
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="TransferTable"></table>
            </div>
        `);

        var columns = Common.bindColumn(data[1], ['TransferId', 'Status_Color']);
        Common.bindTable('TransferTable', data[1], columns, -1, 'TransferId', '360px', true, access);
    }
}

function StatusSuccess(response) {
    var id = "TransferStatusId";
    Common.bindDropDownSuccess(response.data, id);
}

async function GetTransferNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        if (EditTransferId != 0) {
            if (data[0][0].TransferType != 1) {
                $('#TransferType').val(data[0][0].TransferType);

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

                var id = 'TypeID';
                var parent = 'FormRightSideHeader';
                var request = {
                    ModuleId: parseInt(EditTransferId) || null,
                    TransferType: parseInt(data[0][0].TransferType),
                    FranchiseId: parseInt(FranchiseMappingId)
                };
                $.ajax({
                    type: 'GET',
                    dataType: "json",
                    url: '/Inventory/DD_GetTransferNoDetails_TransferType',
                    data: request,
                    success: function (response) {
                        if (response.status == true) {
                            Common.bindParentDropDownSuccess(response.data, id, parent);
                            $('#TypeID').val(data[0][0].TransferTypeId);
                        } else {

                        }
                    },
                    error: function () {
                    }
                });

                $('#FromAddressId').val(data[0][0].FromFranchiseId).trigger('change');
                $('#ToAddressId').val(data[0][0].ToFranchiseId).trigger('change');
            }
            else {
                $('#TransferType').val(data[0][0].TransferType);

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

            var EditDataId = { ModuleName: "Transfer", ModuleId: parseInt(EditTransferId), type: parseInt(data[0][0].TransferType) };
            Common.ajaxCall("GET", "/Inventory/GetTransferStatusDetails", EditDataId, function (response) {
                StatusSuccess(response);
                if (data[0][0].TransferStatusId == 2)
                    $('#TransferStatusId option[value="1"]').remove();
                else if (data[0][0].TransferStatusId == 3)
                    $('#TransferStatusId option[value="2"]').remove();

                if (data[0][0].TransferType == 3 && data[0][0].TransferStatusId == 1)
                    $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', false);

                $('#TransferStatusId').val(data[0][0].TransferStatusId).trigger('change');
            }, null);

            if (data[0][0].TransferStatusId === 4 || data[0][0].TransferStatusId === 3 || data[0][0].TransferStatusId === 2) {
                $('#TransferSaveBtn').hide();
                $('#TransferStatusId').prop('disabled', true);
                //disableAllFields();
            }
            else {
                $('#TransferSaveBtn').show();
                $('#TransferStatusId').prop('disabled', false);
                //enableAllFields();
            }
        } else {
            var thisTransferType = $('#TransferType').val();
            if (thisTransferType == 2) {
                $('#DivModeOfTransport, #DivTransportno').show();
                $('#ModeOfTransferId, #Transportno').prop('disabled', false);
                $('#FromAddressId').val(data[0][0].ToFranchiseId).trigger('change');
                $('#ToAddressId').val(data[0][0].FromFranchiseId).trigger('change');
                $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', false);
            } else if (thisTransferType == 3) {
                $('#DivModeOfTransport, #DivTransportno').show();
                $('#ModeOfTransferId, #Transportno').prop('disabled', true);

                $('#FromAddressId').val(data[0][0].FromFranchiseId).trigger('change');
                $('#ToAddressId').val(data[0][0].ToFranchiseId).trigger('change');
                $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', true);
            } else {
                $('#DivModeOfTransport, #DivTransportno').hide();
                $('#ModeOfTransferId, #Transportno').prop('disabled', false);
            }
        }

        if (data[0][0].TransferType == 2) {
            $('#ChangeTheTransferNoLable').html(`Request No<span id="Asterisk">*</span>`);
        } else if (data[0][0].TransferType == 3) {
            $('#ChangeTheTransferNoLable').html(`OutWard No<span id="Asterisk">*</span>`);
        }

        if (EditTransferId == 0) {
            if (data[0][0].TransferType === 1) {
                $('#ChangeTheTransferNoLable').html(`Request No<span id="Asterisk">*</span>`);
                $('.TH_Request_Col').show();
                $('.TH_Inwarded_Col').hide();
                $('.TH_Outwarded_Col').show();
                //Calculated the Th Count
                var totalColumns = $('#POProductTable thead tr th').length;
                $('#AddItemButtonRow td').attr('colspan', totalColumns);

                $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 3);
                $('#SubtotalRow td').eq(1).attr('colspan', 1);
                $('#SubtotalRow td').eq(2).attr('colspan', 1);

                $('.ProductNameSpanHead').text('11111111111');
                $('.UnitSpanHead').text('111111');
            } else if (data[0][0].TransferType == 2) {
                $('#ChangeTheTransferNoLable').html(`OutWard No<span id="Asterisk">*</span>`);
                $('.TH_Request_Col').show();
                $('.TH_Inwarded_Col').show();
                $('.TH_Outwarded_Col').show();
                //Calculated the Th Count
                var totalColumns = $('#POProductTable thead tr th').length;
                $('#AddItemButtonRow td').attr('colspan', totalColumns);

                $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 2);
                $('#SubtotalRow td').eq(1).attr('colspan', 1);
                $('#SubtotalRow td').eq(2).attr('colspan', 1);

                $('.ProductNameSpanHead').text('1111111');
                $('.UnitSpanHead').text('111');
            }
        } else {
            if (data[0][0].TransferType === 2) {
                $('#ChangeTheTransferNoLable').html(`Request No<span id="Asterisk">*</span>`);
                $('.TH_Request_Col').show();
                $('.TH_Inwarded_Col').hide();
                $('.TH_Outwarded_Col').show();
                //Calculated the Th Count
                var totalColumns = $('#POProductTable thead tr th').length;
                $('#AddItemButtonRow td').attr('colspan', totalColumns);

                $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 3);
                $('#SubtotalRow td').eq(1).attr('colspan', 1);
                $('#SubtotalRow td').eq(2).attr('colspan', 1);

                $('.ProductNameSpanHead').text('11111111111');
                $('.UnitSpanHead').text('111111');
            } else if (data[0][0].TransferType == 3) {
                $('#ChangeTheTransferNoLable').html(`OutWard No<span id="Asterisk">*</span>`);
                $('.TH_Request_Col').show();
                $('.TH_Inwarded_Col').show();
                $('.TH_Outwarded_Col').show();
                //Calculated the Th Count
                var totalColumns = $('#POProductTable thead tr th').length;
                $('#AddItemButtonRow td').attr('colspan', totalColumns);

                $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 2);
                $('#SubtotalRow td').eq(1).attr('colspan', 1);
                $('#SubtotalRow td').eq(2).attr('colspan', 1);

                $('.ProductNameSpanHead').text('1111111');
                $('.UnitSpanHead').text('111');
            }
            else {
                $('.TH_Request_Col').show();
                $('.TH_Inwarded_Col').hide();
                $('.TH_Outwarded_Col').hide();

                var totalColumns = $('#POProductTable thead tr th').length;
                $('#AddItemButtonRow td').attr('colspan', 5);

                // Assume default logic (same as "3" perhaps, or adjust as needed)
                $('#SubtotalRow td').eq(0).attr('colspan', 3);
                $('#SubtotalRow td').eq(1).attr('colspan', 1);
                $('#SubtotalRow td').eq(2).attr('colspan', 1);
            }
        }

        var DateFormate = data[0][0].TransferDate;
        var DateFormateSplit = DateFormate.split('T')[0];
        $('#TransferDate').val(DateFormateSplit);

        $('#AssetTotal').val(data[0][0].NoOfProducts);
        $('#TransferNo').val(data[0][0].TransferNo);

        $('#ModeOfTransferId').val(data[0][0].ModeOfTransportId).trigger('change');
        $('#Transportno').val(data[0][0].TransportNo).trigger('change');

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
                        <input type="text" class="form-control QtyMainTable" id="QtyMainTable${unique}" name="QtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>`;

                // 🔽 Conditionally add extra <td> only when EditTransferId != 0
                if (EditTransferId == 0 && data[0][0].TransferType == 1) {
                    newRow += `
                    <td>
                        <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>`;
                } else if (EditTransferId != 0 && data[0][0].TransferType == 2) {
                    newRow += `
                    <td>
                        <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>`;
                }
                else if (EditTransferId == 0 && data[0][0].TransferType == 2) {
                    newRow += `
                    <td>
                        <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>
                    <td>
                        <input type="text" class="form-control InwardedQtyMainTable" id="InwardedQtyMainTable${unique}" name="InwardedQtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>`;
                } else if (EditTransferId != 0 && data[0][0].TransferType == 3) {
                    newRow += `
                   <td>
                        <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>
                    <td>
                        <input type="text" class="form-control InwardedQtyMainTable" id="InwardedQtyMainTable${unique}" name="InwardedQtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
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
                if (thisTransferType == 2) {
                    $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', false);
                } else if (thisTransferType == 3) {
                    $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', true);
                }
            });
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
    }
}


async function GetTransferNotNullForTransferType3Success(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        //$('#TransferType').val(data[0][0].TransferType);

        $('#FromAddressId, #ToAddressId, #TypeID, #AddNotesText, #TransferNo, #AssetTotal').val('');
        $('#FromAddress, #FromCity, #FromContactNumber, #FromStateId').text('');
        $('#AddNotes, #HideNotesLable, #AddAttachment, #HideAttachlable, #AddItemButtonRow').hide();
        $('#AddNotesLable, #AddAttachLable, #TransferTypeDiv, #DivTransportno, #DivModeOfTransport').show();
        $('#selectedFiles,#ExistselectedFiles').empty('');
        $('#BarodeNumberDiv').removeClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-flex justify-content-end').addClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-none justify-content-end');
        $('#TransferStatusId').empty();
        $('.ProductTableRow').remove();
        $('#TransferSaveBtn').show();
        $('#TransferStatusId').prop('disabled', false);
        $('#ModeOfTransferId, #Transportno').prop('disabled', true);

        var id = 'TypeID';
        var parent = 'FormRightSideHeader';
        var request = {
            ModuleId: parseInt(EditTransferId) || null,
            TransferType: parseInt(3),
            FranchiseId: parseInt(FranchiseMappingId)
        };
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: '/Inventory/DD_GetTransferNoDetails_TransferType',
            data: request,
            success: function (response) {
                if (response.status == true) {
                    Common.bindParentDropDownSuccess(response.data, id, parent);
                    $('#TypeID').val(data[0][0].TransferId);
                } else {

                }
            },
            error: function () {
            }
        });

        $('#FromAddressId').val(data[0][0].FromFranchiseId).trigger('change');
        $('#ToAddressId').val(data[0][0].ToFranchiseId).trigger('change');

        var EditDataId = { ModuleName: "Transfer", ModuleId: parseInt(EditTransferId), type: parseInt(3) };
        Common.ajaxCall("GET", "/Inventory/GetTransferStatusDetails", EditDataId, function (response) {
            StatusSuccess(response);
            $('#TransferStatusId option[value="2"]').remove();
            $('#TransferStatusId').val('4').trigger('change');
        }, null);

        if (data[0][0].TransferType == 2) {
            $('#ChangeTheTransferNoLable').html(`Request No<span id="Asterisk">*</span>`);
        } else if (data[0][0].TransferType == 3) {
            $('#ChangeTheTransferNoLable').html(`OutWard No<span id="Asterisk">*</span>`);
        }

        $('#ChangeTheTransferNoLable').html(`OutWard No<span id="Asterisk">*</span>`);
        $('.TH_Request_Col').show();
        $('.TH_Inwarded_Col').show();
        $('.TH_Outwarded_Col').show();
        //Calculated the Th Count
        var totalColumns = $('#POProductTable thead tr th').length;
        $('#AddItemButtonRow td').attr('colspan', totalColumns);

        $('#SubtotalRow td').eq(0).attr('colspan', totalColumns - 2);
        $('#SubtotalRow td').eq(1).attr('colspan', 1);
        $('#SubtotalRow td').eq(2).attr('colspan', 1);

        $('.ProductNameSpanHead').text('1111111');
        $('.UnitSpanHead').text('111');

        var DateFormate = data[0][0].TransferDate;
        var DateFormateSplit = DateFormate.split('T')[0];
        $('#TransferDate').val(DateFormateSplit);

        $('#AssetTotal').val(data[0][0].NoOfProducts);
        $('#TransferNo').val(data[0][0].TransferNo);

        $('#ModeOfTransferId').val(data[0][0].ModeOfTransportId).trigger('change');
        $('#Transportno').val(data[0][0].TransportNo).trigger('change');

        $('.ProductTableRow').remove();
        var thisTransferType = $('#TransferType').val();


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
                        <input type="text" class="form-control QtyMainTable" id="QtyMainTable${unique}" name="QtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>
                    <td>
                        <input type="text" class="form-control OutwardedQtyMainTable" id="OutwardedQtyMainTable${unique}" name="OutwardedQtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>
                    <td>
                        <input type="text" class="form-control InwardedQtyMainTable" id="InwardedQtyMainTable${unique}" name="InwardedQtyMainTable${unique}" value="${item.Quantity.toFixed(2)}" style="height: 26px;" oninput="Common.allowOnlyNumbersAndDecimalInventory(this,4)" required>
                    </td>                
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
                if (thisTransferType == 2) {
                    $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', false);
                } else if (thisTransferType == 3) {
                    $('.ForBindtableProductUnit, .QtyMainTable, .DynrowRemove, #ToAddressId').prop('disabled', true);
                }
            });
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

function handlePurchaseRequestApprovedStatus() {
    var selectedText = $('#TransferStatusId option:selected').text().trim();
    if (selectedText === "Draft") {
        //enableAllFields();
        $('#btnTransfersaveprintbtn').hide();
    } else if (selectedText === "Approved") {
        if (isEmployee === 4 || isEmployee === 3) {

            //disableAllFields();
        } else {

            //enableAllFields();
        }
        $('#btnTransfersaveprintbtn').hide();
    } else if (selectedText === "Sent" || selectedText === "Authorized" || selectedText === "Received" || selectedText === "Accepted") {
        //disableAllFields();
        $('#btnTransfersaveprintbtn').show();
    } else if (selectedText === "Cancelled") {
        $('#btnTransfersaveprintbtn').hide();
        //disableAllFields();
    }
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

    $('#TransferTypeDiv').hide();

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

    // Assume default logic (same as "3" perhaps, or adjust as needed)
    $('#SubtotalRow td').eq(0).attr('colspan', 3);
    $('#SubtotalRow td').eq(1).attr('colspan', 1);
    $('#SubtotalRow td').eq(2).attr('colspan', 1);
}

function disableAllFields() {
    $('#FormBillFrom select, #FormVendor select, #FormShipping select').prop('disabled', true);
    $('#FormRightSideHeader input, #FormRightSideHeader select').prop('disabled', true);

    $('#AddNotesText, #TermsAndCondition').prop('disabled', true);
    $('.DynrowRemove').prop('disabled', true);
    $('#AddItemButtonRow').hide();
    $('#TransferNo').prop('disabled', true);
    $('#fileInput').prop('disabled', true);
    $('#selectedFiles #deletefile, #ExistselectedFiles #deletefile')
        .prop('disabled', true)
        .css({ 'pointer-events': 'none', 'opacity': '0.5' });
    $('label[for="fileInput"], label:has(#fileInput)').css({
        'pointer-events': 'none',
        'opacity': '0.6',
        'cursor': 'not-allowed'
    });
    $('.QtyMainTable').prop('disabled', true);
    $('#ModeOfTransferId,#Transportno').prop('disabled', true);
}

function enableAllFields() {
    $('#FormBillFrom select, #FormShipping select').prop('disabled', false);
    $('#FormRightSideHeader input, #FormRightSideHeader select').prop('disabled', false);

    $('#AddNotesText, #TermsAndCondition').prop('disabled', false);
    $('.DynrowRemove').prop('disabled', false);
    $('#AddItemButtonRow').show();
    $('#TransferNo').prop('disabled', true);
    $('#fileInput').prop('disabled', false);
    $('#selectedFiles #deletefile, #ExistselectedFiles #deletefile')
        .prop('disabled', false)
        .css({ 'pointer-events': '', 'opacity': '' });
    $('label[for="fileInput"], label:has(#fileInput)').css({
        'pointer-events': '',
        'opacity': '',
        'cursor': ''
    });
    $('.QtyMainTable').prop('disabled', false);
    $('#ModeOfTransferId,#Transportno').prop('disabled', false);
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

function bindDropDownTransferNo(ModuleId, TransferType, FranchiseId, id, parent) {
    var request = {
        ModuleId: parseInt(ModuleId) || null,
        TransferType: parseInt(TransferType),
        FranchiseId: parseInt(FranchiseId)
    };
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: '/Inventory/DD_GetTransferNoDetails_TransferType',
        data: request,
        success: function (response) {
            if (response.status == true) {
                Common.bindParentDropDownSuccess(response.data, id, parent);
            } else {

            }
        },
        error: function () {
        }
    });
}
