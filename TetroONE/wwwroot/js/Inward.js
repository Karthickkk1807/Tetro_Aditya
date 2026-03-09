var PlantMappingId = 0;
var InWardId = 0;
var WidthDropdown = [];
var FabricTypeDropdown = [];
var ProcessTypeDropdown = [];
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();

$(document).ready(async function () {

    bindDropDownClientAddItem('ClientId', 'Client');
    Common.bindDropDown('TransactionId', 'TransactionType');
    //Common.bindDropDown('ReceivedFrom', 'JobWorker');
    Common.bindDropDown('ReceivedFrom', 'Client');
    Common.bindDropDown('ReceivedBy', 'SampleReceivedBy');
    bindDropDownColorAddItem('ColorId', 'Color');
    Common.bindDropDown('PaymentTypeId', 'PaymentType');
    Common.bindDropDown('InWardStatusId', 'InWardStatus');
    Common.bindDropDown('StorageLocationId', 'StorageLocation');
    Common.bindDropDown('InwardTypeId', 'InWardType');
    Common.bindDropDownParent('State', 'FromAddItem', 'State');

    $('#ClientId,#ReceivedFrom, #ColorId, #StorageLocationId').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });

    var fabricTypeDropdown = await Common.bindDropDownSync('FabricType');
    FabricTypeDropdown = JSON.parse(fabricTypeDropdown);

    var processTypeDropdown = await Common.bindDropDownSync('ProcessType');
    ProcessTypeDropdown = JSON.parse(processTypeDropdown);

    var widthDropdown = await Common.bindDropDownSync('Width');
    WidthDropdown = JSON.parse(widthDropdown);

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var todayDate = new Date().toISOString().split('T')[0];
    $('#InwardDate').attr('max', todayDate);

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

        const toDate = new Date(fnData.endDate);
        toDate.setDate(toDate.getDate() + 1);

        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: null, FromDate: fnData.startDate.toISOString(), ToDate: toDate.toISOString() }, GetInwardSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');

        const toDate = new Date(fnData.endDate);
        toDate.setDate(toDate.getDate() + 1);

        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: null, FromDate: fnData.startDate.toISOString(), ToDate: toDate.toISOString() }, GetInwardSuccess, null);
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
            Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetInwardSuccess, null);
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
        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);

    $(document).on('click', '#AddInWard', function () {
        InWardId = 0;
        $('.dynamic-item-row').remove();
        $('.dynamic-item-row_Second').remove();
        duplicateFabric();

        deletedFiles = [];
        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        Common.removevalidation('TopStatic');
        Common.removevalidation('FormStatus');

        $('#PaymentTypeId').val('2');
        $('#ReceivedBy').val(LoginUserId);
        $('#emptyDiv').removeClass('col-lg-2 col-md-2 col-6').addClass('col-lg-4 col-md-4 col-6');
        $('#InWardStatusIdDiv').hide();

        $('#ModalHeading').text('InWard Details');
        $("#BtnSave span:first").text("Save");

        $('#AlterReceivedFrom').hide();
        //$('#AlterClientId').hide();

        $('#ReceivedFrom').val('').trigger('change');
        $('#ColorId').val('').trigger('change');
        $('#ClientId').val('').trigger('change');
        $('#StorageLocationId').val('').trigger('change');

        $('.Status-Div').hide();
        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);
        $('#InwardDate').val(formattedDate);

        Common.ajaxCall("GET", "/Common/GetAutoGenerate", { ModuleName: 'InWard', PlantId: PlantMappingId }, function (response) {
            Common.AutoGenerateNumberGet(response, "InWardNo", "InWardNo");
        });

        $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        $('#AddAttachLable, #AddNotesLable').show();
        $('#Notes').val('');
        $('#InwardTypeId').val('1');

        $('.modal-body').animate({ scrollTop: 0 }, 300);
        $('#InWardModal').show();
    });

    $(document).on('click', '.btn-edit', async function () {
        InWardId = $(this).data('id');
        $('#loader-pms').show();
        deletedFiles = [];
        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        $('#ModalHeading').text('Edit InWard Details');
        $("#BtnSave span:first").text("Update");
        $('#emptyDiv').removeClass('col-lg-4 col-md-4 col-6').addClass('col-lg-2 col-md-2 col-6');
        $('#InWardStatusIdDiv').show();

        $('#AlterReceivedFrom').hide();
        //$('#AlterClientId').hide();

        $('#ReceivedFrom').val('').trigger('change');
        $('#ColorId').val('').trigger('change');
        $('#ClientId').val('').trigger('change');
        $('#StorageLocationId').val('').trigger('change');

        $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        $('#AddAttachLable, #AddNotesLable').show();

        $('.modal-body').animate({ scrollTop: 0 }, 300);
        $('.Status-Div').show();

        const activityResponse = await ajaxPromise("GET", "/Common/ActivityHistoryDetails", {
            ModuleName: "Inward",
            ModuleId: InWardId
        });
        StatusActivitySuccess(activityResponse);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: parseInt(InWardId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardNotNullSuccess, null);

        $('#InWardModal').show();
    });

    $(document).on('click', '#BtnCancel, #InWardClose', function () {
        $('#InWardModal').hide();
    });

    $(document).on('click', '#BtnSave', function () {

        let isValid = true;

        $(".QtyInput").each(function (index) {
            let value = $(this).val().trim();
            if (value === "" || parseFloat(value) === 0) {
                $(this).focus();
                isValid = false;
                return false;
            }
        });

        if (!isValid) {
            Common.warningMsg("No empty or Zero values found in Qty.");
            return false;
        }

        if ($("#TopStatic").valid() && $("#TableInputs").valid() && $("#FormStatus").valid()) {
            var DataUpdate1 = JSON.parse(JSON.stringify(jQuery('#TopStatic').serializeArray()));
            var DataUpdate2 = JSON.parse(JSON.stringify(jQuery('#FormStatus').serializeArray()));

            getExistFiles();

            var DataUpdate = DataUpdate1.concat(DataUpdate2);

            var objvalue = {};
            $.each(DataUpdate, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.InWardId = InWardId > 0 ? parseInt(InWardId) : null;
            objvalue.PlantId = parseInt(PlantMappingId);

            objvalue.InWardNo = $('#InWardNo').val();
            objvalue.PaymentTypeId = parseInt($('#PaymentTypeId').val()) || null;
            objvalue.ClientId = parseInt($('#ClientId').val()) || null;
            objvalue.ReceivedFrom = parseInt($('#ReceivedFrom').val()) || null;
            objvalue.ColorId = parseInt($('#ColorId').val()) || null;
            objvalue.InwardType = parseInt($('#InwardTypeId').val()) || null;
            objvalue.StorageLocationId = parseInt($('#StorageLocationId').val()) || null;
            objvalue.ReceivedBy = parseInt($('#ReceivedBy').val()) || null;
            objvalue.StorageLocationId = parseInt($('#StorageLocationId').val()) || null;
            objvalue.InWardStatusId = parseInt($('#InWardStatusId').val()) || null;

            objvalue.NoofFabric = Common.parseFloatInputValue('NoofFabric') || null;
            objvalue.TotalQty = Common.parseFloatInputValue('TotalQty') || null;
            objvalue.TotalRolls = Common.parseFloatInputValue('TotalRolls') || null;

            objvalue.InWardDate = $('#InWardDate').val();
            objvalue.Notes = $('#Notes').val();

            var FabricMapping = [];
            var FabricProcessMapping = [];

            var currentGroupRowNo = 0;
            var parentFabricTypeId = null;

            $("#InwardTableBody .dynamic-item-row, #InwardTableBody .dynamic-item-row_Second").each(function () {

                let row = $(this);
                let currentRowFabricVal = row.find(".FabricSelect").val();

                // ---- IDENTIFY PARENT OR CHILD ROW ----
                if (row.hasClass("dynamic-item-row")) {
                    currentGroupRowNo = 1;
                    parentFabricTypeId = currentRowFabricVal;
                }
                else if (row.hasClass("dynamic-item-row_Second")) {
                    currentGroupRowNo++;
                }

                // ---- GET InwardFabricId ----
                let InwardFabricId = row.find(".InwardFabricId").text().trim();
                if (!InwardFabricId) {
                    InwardFabricId = row.prevAll(".dynamic-item-row").first().find(".InwardFabricId").text().trim();
                }

                let InwardFabricProcessMappingId = row.find(".InwardFabricProcessMappingId").text().trim();

                // ---- PUSH FABRIC MAPPING ROW DATA ----
                FabricMapping.push({
                    InwardFabricId: InwardFabricId ? parseInt(InwardFabricId) : null,
                    FabricId: parseInt(parentFabricTypeId) || null,
                    ProcessCount: row.find(".Process").val()?.length || 0,
                    Dia: parseFloat(row.find(".DiaInput").val()) || null,
                    GSM: parseFloat(row.find(".GsmInput").val()) || null,
                    Qty: parseFloat(row.find(".QtyInput").val()) || null,
                    NoOfRolls: parseInt(row.find(".RollsInput").val()) || null,
                    Width: parseInt(row.find(".WidthSelect").val()) || null,
                    InWardId: InWardId > 0 ? parseInt(InWardId) : null,
                    RowNo: currentGroupRowNo,
                });

                // ---- PROCESS MAPPING ----
                let processIds = row.find(".Process").val(); // ← Select2 multi values
                if (processIds && processIds.length > 0) {
                    processIds.forEach(pid => {
                        FabricProcessMapping.push({
                            RowNo: currentGroupRowNo,
                            InwardFabricProcessMappingId: InwardFabricProcessMappingId ? parseInt(InwardFabricProcessMappingId) : null,
                            InwardFabricId: InwardFabricId ? parseInt(InwardFabricId) : null,
                            FabricTypeId: parentFabricTypeId ? parseInt(parentFabricTypeId) : null,
                            ProcessId: parseInt(pid)
                        });
                    });
                }

            });


            formDataMultiple.append("InwardStaticData", JSON.stringify(objvalue));
            formDataMultiple.append("InwardFabricDetails", JSON.stringify(FabricMapping));
            formDataMultiple.append("InwardFabricProcessMappingDetails", JSON.stringify(FabricProcessMapping));
            formDataMultiple.append("Exist", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));
            $.ajax({
                type: "POST",
                url: "/Productions/InsertUpdateInwardDetails",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        formDataMultiple = new FormData();
                        Common.successMsg(response.message);
                        $('#InWardModal').hide();

                        var fnData = Common.getDateFilter('dateDisplay2');
                        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);
                    }
                    else {
                        formDataMultiple = new FormData();
                        Common.errorMsg(response.message);
                    }
                },
                error: function (response) {
                    Common.errorMsg(response.message);
                }
            });
        }
    });

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var InwardId = $(this).data('id');
            Common.ajaxCall("GET", "/Productions/DeleteInWardDetails", { InWardId: parseInt(InwardId) }, function (response) {
                if (response.status) {
                    Common.successMsg(response.message);
                    var fnData = Common.getDateFilter('dateDisplay2');
                    Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);
                }
            }, null);
        }
    });

    $(document).on('change', '#ClientId', function () {
        var $thisVal = $(this).val();
        $('#ReceivedFrom').val($thisVal).trigger('change');
        $('#CommonId').val('');
        if ($thisVal == "AddItem") {
            $('#AlterReceivedFrom').show();
            //$('#AlterClientId').show();
            $('#ReceivedFrom').hide();
            //$('#ClientId').hide();
            Common.removevalidation('FromAddItem');
            $('#FromAddItem #State').val('32').trigger('change');
            $('#AddItemModal').show();
        } else {
            $('#AddItemModal').hide();
            $('#AlterReceivedFrom').hide();
            //$('#AlterClientId').hide();
            $('#ReceivedFrom').show();
            //$('#ClientId').show();
            $('#AlterClientId').val('');
            $('#AlterReceivedFrom').val('');
            Common.removevalidation('FromAddItem');
        }
    });

    $(document).on('click', '#AddItemClose, #AddItemBtnClose', function () {
        $('#AddItemModal').hide();
        $('#ClientId').val('').trigger('change');
        Common.removevalidation('FromAddItem');
    });

    $(document).on('input', '#AlterClientId', function () {
        var $thisVal = $(this).val();
        if ($thisVal == '') {
            $('#AddItemModal').hide();
            $('#AlterReceivedFrom').hide();
            $('#AlterClientId').hide();
            $('#ReceivedFrom').show();
            //$('#ClientId').show();
            $('#AlterClientId').val('');
            $('#AlterReceivedFrom').val('');
            $('#ClientId').val('').trigger('change');
            $('#ReceivedFrom').val('').trigger('change');
        } else {
            $('#AlterReceivedFrom').val($thisVal);
        }
    });

    $(document).on('click', '#AddItemSave', function () {
        if ($("#FromAddItem").valid()) {
            var formDataMultiple = new FormData();
            var existFiles = [];
            var deletedFiles = [];

            var DataClientStatic = JSON.parse(JSON.stringify(jQuery('#FromAddItem').serializeArray()));
            var objvalue = {};
            $.each(DataClientStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.ClientId = null;
            objvalue.ClientName = $('#CommonId').val() || null;
            objvalue.Email = null;
            objvalue.State = Common.parseInputValue('State') || null;
            objvalue.CreditLimit = 25000.00;

            objvalue.IsActive = true;

            var ContactPerson = [];
            ContactPerson.push({
                ContactPersonId: null,
                Salutation: null,
                ContactPersonName: null,
                ContactNumber: null,
                Email: null,
                IsPrimary: null,
                ContactId: null
            });

            formDataMultiple.append("ClientData", JSON.stringify(objvalue));
            formDataMultiple.append("ClientContactPersonDetails", JSON.stringify(ContactPerson));
            formDataMultiple.append("Exist", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));
            $.ajax({
                type: "POST",
                url: "/Contact/InsertUpdateClientDetails",
                data: formDataMultiple,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.status) {

                        var data = JSON.parse(response.data);
                        let ClientId = data[0][0].ClientId;
                        let ResponseMessage = response.message;

                        formDataMultiple = new FormData();

                        var request = {
                            moduleName: 'Client'
                        };
                        $.ajax({
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            url: '/Common/GetDropDown',
                            data: JSON.stringify(request),
                            success: function (response) {
                                if (response.status == true) {
                                    bindDropDownSuccessClientAddItem(response.data, 'ClientId');
                                    var request = {
                                        moduleName: 'Client'
                                    };
                                    $.ajax({
                                        type: 'POST',
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        url: '/Common/GetDropDown',
                                        data: JSON.stringify(request),
                                        success: function (response) {
                                            if (response.status == true) {
                                                bindDropDownSuccessNormal(response.data, 'ReceivedFrom');
                                                $('#ClientId').val(ClientId).trigger('change');
                                                $('#ReceivedFrom').val(ClientId).trigger('change');

                                                $('#AddItemModal').hide();
                                                Common.successMsg(ResponseMessage);
                                            }
                                        },
                                        error: function (response) {
                                            Common.errorMsg(response.message);
                                        },
                                    });
                                }
                            },
                            error: function (response) {
                                Common.errorMsg(response.message);
                            },
                        });
                    }
                    else {
                        formDataMultiple = new FormData();
                        Common.errorMsg(response.message);
                    }
                },
                error: function (response) {
                    Common.errorMsg(response.message);
                }
            });
        }
    });

    $(document).on('change', '#ColorId', function () {
        let ColorId = $(this).val();
        if (ColorId == 'AddItemColor') {
            $('#FormColor')[0].reset();
            Common.removevalidation('FormColor');
            Common.removeMessage('FormColor');
            $('#ColorModal').show();
        }
    });

    $(document).on('click', '#ColorClose', function () {
        $('#ColorModal').hide();
        $('#ColorId').val('').trigger('change');
        Common.removevalidation('FormColor');
        Common.removeMessage('FormColor');
    });

    $("#ColorSave").click(function (e) {
        if ($("#FormColor").valid()) {
            var DataColorStatic = JSON.parse(JSON.stringify(jQuery('#FormColor').serializeArray()));

            var objvalue = {};
            $.each(DataColorStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.ColorId = null;

            Common.ajaxCall("POST", "/Settings/InsertUpdateColorInfo", JSON.stringify(objvalue), function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    var ColorId = data[0][0].ColorId;
                    var ResponseMessage = response.message;

                    var request = {
                        moduleName: 'Color'
                    };
                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: '/Common/GetDropDown',
                        data: JSON.stringify(request),
                        success: function (response) {
                            if (response.status == true) {
                                bindDropDownSuccessColorAddItem(response.data, 'ColorId');

                                $('#ColorId').val(ColorId).trigger('change');

                                $('#FormColor')[0].reset();
                                Common.removevalidation('FormColor');
                                Common.removeMessage('FormColor');
                                $('#ColorModal').hide();

                                Common.successMsg(ResponseMessage);
                            } else {
                                Common.errorMsg(response.message);
                            }
                        },
                        error: function (response) {
                            Common.errorMsg(response.message);
                        },
                    });
                }
                else {
                    Common.errorMsg(response.message);
                }
            }, null);
        }
    });

    $(document).on('change', '.FabricSelect', function () {

        var $select = $(this);
        var selectedValue = $select.val();

        if (selectedValue === "AddItemFabric") {
            var $currentRow = $select.closest('tr');
            $('#FabricInfoModal').data('currentRow', $currentRow);
            $select.val('');

            Common.removevalidation('FormFabricInfo');
            Common.removeMessage('FormFabricInfo');

            $('#FabricInfoModal').modal('show');
        }
        else {
            refreshProductDropdowns(".FabricSelect");
        }
    });

    $(document).on('click', '#FabricClose', function () {
        Common.removevalidation('FormFabricInfo');
        Common.removeMessage('FormFabricInfo');
        $('#FabricInfoModal').modal('hide');
    });

    $("#FabricSave").click(async function () {

        if ($("#FormFabricInfo").valid()) {

            var objvalue = {
                MasterInfoId: null,
                ModuleName: 'Fabric',
                MasterInfoName: $('#FabricName').val(),
                MasterInfoDescription: $('#FabricDescription').val()
            };

            await Common.ajaxCall(
                "POST",
                "/Settings/InsertUpdateMasterInfo",
                JSON.stringify(objvalue),
                async function (response) {

                    if (response.status) {

                        var data = JSON.parse(response.data);
                        var returnId = data[1][0].ModuleId;
                        var ResponseMessage = response.message;

                        var fabricTypeDropdown = await Common.bindDropDownSync('FabricType');
                        FabricTypeDropdown = JSON.parse(fabricTypeDropdown);

                        if (FabricTypeDropdown && FabricTypeDropdown.length > 0) {

                            var selectedMap = {};

                            $('.FabricSelect').each(function () {
                                selectedMap[$(this).attr('id')] = $(this).val();
                            });

                            var options = '<option value="">--Select--</option>';

                            if (FabricTypeDropdown[0] && FabricTypeDropdown[0].length > 0) {
                                options += FabricTypeDropdown[0].map(function (item) {
                                    return `<option value="${item.FabricTypeId}">${item.FabricTypeName}</option>`;
                                }).join('');
                                options += `<option value="AddItemFabric" class="add-item-option">+ Add Item</option>`;
                            }

                            $('.FabricSelect').each(function () {
                                var currentId = $(this).attr('id');
                                var oldValue = selectedMap[currentId];

                                $(this).html(options);

                                if (oldValue && oldValue !== "AddItemFabric") {
                                    $(this).val(oldValue);
                                }
                            });

                            var $row = $('#FabricInfoModal').data('currentRow');

                            if ($row && returnId) {
                                $row.find('.FabricSelect').val(returnId);
                            }

                            refreshProductDropdowns(".FabricSelect");
                            $('.FabricSelect').trigger('change');
                        }

                        Common.removevalidation('FormFabricInfo');
                        Common.removeMessage('FormFabricInfo');
                        $('#FabricInfoModal').modal('hide');

                        Common.successMsg(ResponseMessage);
                    } else {
                        Common.errorMsg(response.message);
                    }
                },
                null
            );
        }
    });

    $(document).on('change', '.Process', function () {

        let $select = $(this);
        let selectedValues = $select.val() || [];

        if (selectedValues.includes("AddItemProcess")) {

            $select.select2('close');

            selectedValues = selectedValues.filter(v => v !== "AddItemProcess");
            $select.val(selectedValues).trigger('change.select2');

            let $currentRow = $select.closest('tr');
            $('#ProcessInfoModal').data('currentRow', $currentRow);

            Common.removevalidation('FormProcessInfo');
            Common.removeMessage('FormProcessInfo');

            $('#ProcessInfoModal').modal('show');
        }
    });

    $(document).on('click', '#ProcessClose', function () {
        Common.removevalidation('FormProcessInfo');
        Common.removeMessage('FormProcessInfo');
        $('#ProcessInfoModal').modal('hide');
    });

    $("#ProcessSave").click(function () {

        if (!$("#FormProcessInfo").valid())
            return;

        let processName = $('#ProcessName').val().trim();
        let processDescription = $('#ProcessDescription').val();

        let objvalue = {
            MasterInfoId: null,
            ModuleName: 'Process',
            MasterInfoName: processName,
            MasterInfoDescription: processDescription
        };

        Common.ajaxCall("POST", "/Settings/InsertUpdateMasterInfo", JSON.stringify(objvalue), function (response) {
            if (response.status) {

                let data = JSON.parse(response.data);
                let returnId = data[1][0].ModuleId.toString();
                let responseMessage = response.message;

                // 🔥 Add new option to ALL .Process dropdowns
                $('.Process').each(function () {

                    let $select = $(this);

                    // Add option only if not exists
                    if ($select.find("option[value='" + returnId + "']").length === 0) {

                        // Insert before "+ Add Item"
                        let $addOption = $select.find("option[value='AddItemProcess']");

                        let newOption = new Option(processName, returnId, false, false);

                        if ($addOption.length > 0) {
                            $(newOption).insertBefore($addOption);
                        } else {
                            $select.append(newOption);
                        }
                    }
                });

                // 🔥 Select new Process in ONLY current row
                let $row = $('#ProcessInfoModal').data('currentRow');

                if ($row) {

                    let $processSelect = $row.find('.Process');
                    let currentVals = $processSelect.val() || [];

                    if (!currentVals.includes(returnId)) {
                        currentVals.push(returnId);
                    }

                    // This line makes Select2 generate:
                    // <li class="select2-selection__choice">...</li>
                    $processSelect.val(currentVals).trigger('change.select2');
                }

                $('.Process').select2({
                    theme: 'bootstrap4',
                    width: '100%',
                    placeholder: 'Select Process'
                });

                // Close modal
                Common.removevalidation('FormProcessInfo');
                Common.removeMessage('FormProcessInfo');
                $('#ProcessInfoModal').modal('hide');

                Common.successMsg(responseMessage);
            } else {
                Common.errorMsg(response.message);
            }
        }, null);
    });
});

function GetInwardSuccess(response) {
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

        $('#MainGrid').empty('');
        var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="InWardTable">
                </table>
            `;
        $('#MainGrid').append(html);

        var columns = Common.bindColumn(data[1], ['InWardId', 'Status_Color']);
        Common.bindTable('InWardTable', data[1], columns, -1, 'InWardId', '360px', true, access);
    }
}

function GetInwardNotNullSuccess(response) {
    if (!response.status) return;

    var data = JSON.parse(response.data);

    Common.bindData(data[0]);

    Inventory.toggleField(data[0][0].Notes, "#Notes", "#AddNotes", "#AddNotesLable", "HideNotesLable");
    Inventory.toggleFieldForAttachment(data[3][0].AttachmentId, "#AddAttachLable", "#AddAttachment", "HideAttachlable");
    Inventory.bindAttachments(data[3]);

    $('.dynamic-item-row, .dynamic-item-row_Second').remove();

    const InwardRows = data[1];
    const processMapping = data[2];

    let fabricFirstRowTracker = {};
    let rowCountTracker = {};
    let processLookup = {};

    processMapping.forEach(p => {
        let key = `${p.FabricTypeId}_${p.RowNo}`;
        if (!processLookup[key]) processLookup[key] = [];
        processLookup[key].push(p);
    });

    InwardRows.forEach((item, index) => {

        if (!rowCountTracker[item.FabricTypeId]) rowCountTracker[item.FabricTypeId] = 1;
        else rowCountTracker[item.FabricTypeId]++;

        let currentRowNo = rowCountTracker[item.FabricTypeId];
        let lookupKey = `${item.FabricTypeId}_${currentRowNo}`;

        let mappedProcesses = processLookup[lookupKey] || [];
        let selectedProcesses = mappedProcesses.map(x => x.ProcessId);
        let processMappingId = mappedProcesses.length ? mappedProcesses[0].InwardFabricProcessMappingId : "";

        let uid = `row_${item.FabricTypeId}_${currentRowNo}_${Date.now()}`;

        let isParentRow = currentRowNo === 1;

        let FabricHTML = FabricTypeDropdown[0].map(f =>
            `    <option value="${f.FabricTypeId}" ${f.FabricTypeId == item.FabricTypeId ? 'selected' : ''}>${f.FabricTypeName}</option>
            `).join('')
            + `
                <option value="AddItemFabric" class="add-item-option">
                    + Add Item
                </option>
            `;

        let WidthHTML = WidthDropdown[0].map(w => `
            <option value="${w.WidthId}" ${item.Width == w.WidthId ? 'selected' : ''}>${w.Width}</option>
        `).join('');

        let rowHTML = `
        <tr class="${isParentRow ? 'dynamic-item-row' : 'dynamic-item-row_Second'}"
            data-id="${uid}" data-rowno="${currentRowNo}"> 
            <td class="sno"></td> 
            <td>
                ${isParentRow ? `<select class="form-control FabricSelect"><option value="">--Select--</option>${FabricHTML}</select>` : ""}
                <label class="InwardFabricId d-none">${item.InwardFabricId || ''}</label>
            </td> 
            <td>
                <label class="InwardFabricProcessMappingId d-none">${processMappingId || ''}</label> 
                <select multiple class="select2 Process" data-coreui-search="true" required>${ProcessTypeDropdown[0].map(p =>
            `<option value="${p.ProcessTypeId}" ${selectedProcesses.includes(p.ProcessTypeId) ? 'selected' : ''}>
                                    ${p.ProcessTypeName}
                             </option>`
        ).join('')}
                 <option value="AddItemProcess">+ Add Item</option>
                </select>
            </td> 
            <td><input class="form-control DiaInput" value="${item.Dia || ''}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)"></td>
            <td><input class="form-control GsmInput" value="${item.GSM || ''}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"></td>
            <td><input class="form-control QtyInput" value="${Number(item.Qty || 0).toFixed(3)}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td>
            <td><input class="form-control RollsInput" value="${item.NoOfRolls || ''}" placeholder="Ex: 8" oninput="Common.allowOnlyNumberLength(this,3)"></td> 
            <td><select class="form-control WidthSelect">${WidthHTML}</select></td> 
            <td><input type="text" class="form-control RopeLenghtInput" id="RopeLenght_${uid}" name="RopeLenght_${uid}" placeholder="Ex: 250" disabled /></td> 
            <td style="text-align:center">
                ${isParentRow ?
                `<button class="btn AddStockBtn AddFabric"><i class="fas fa-plus"></i></button>`
                : ""
            }
                <button class="btn DynrowRemove removeRowBtn"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>`;

        if (isParentRow) {
            $("#AddItemButtonRow").before(rowHTML);
        } else {
            let parentRow = $(`tr.dynamic-item-row[data-id*="row_${item.FabricTypeId}_1"]`);
            parentRow.last().after(rowHTML);
        }
    });

    $(".Process").select2({
        theme: 'bootstrap4',
        placeholder: '-- Select Process --',
        allowClear: true,
        closeOnSelect: false,
        width: 'style',
    });

    updateSerialNumbers();
    refreshProductDropdowns(".FabricSelect");
    $('#loader-pms').hide();
}

function duplicateFabric() {
    let uid = Math.random().toString(36).substring(2);

    var defaultOption = '<option value="">--Select--</option>';
    var FabricTypeSelectOptions = "";
    //if (FabricTypeDropdown != null && FabricTypeDropdown.length > 0 && FabricTypeDropdown[0].length > 0) {
    //    FabricTypeSelectOptions = FabricTypeDropdown[0].map(function (FabricTypeId) {
    //        return `<option value="${FabricTypeId.FabricTypeId}">${FabricTypeId.FabricTypeName}</option>`;
    //    }).join(''); +
    //        `<option value="AddItemFabric" class="add-item-option">+ Add Item</option>`;
    //}

    if (FabricTypeDropdown != null && FabricTypeDropdown.length > 0 && FabricTypeDropdown[0].length > 0) {
        FabricTypeSelectOptions = FabricTypeDropdown[0].map(function (FabricTypeId) {
            return `<option value="${FabricTypeId.FabricTypeId}">${FabricTypeId.FabricTypeName}</option>`;
        }).join('') + `<option value="AddItemFabric" class="add-item-option" data-select2-id="135">+ Add Item</option>`;
    }

    let html = `
        <tr class="dynamic-item-row" data-id="${uid}">
            <td class="sno"></td> 
            <td>
                <select class="form-control FabricSelect" id="Fabric_${uid}" name="Fabric_${uid}" required> 
                    ${defaultOption}${FabricTypeSelectOptions}
                </select>
                <label class="InwardFabricId d-none"></label>
            </td> 
            <td data-id=""> 
                <label class="InwardFabricProcessMappingId d-none"></label>
                <select multiple class="select2 Process" data-coreui-search="true" id="Process_${uid}" name="Process_${uid}" required>
                </select>
            </td> 
            <td><input type="text" class="form-control DiaInput" id="Dia_${uid}" name="Dia_${uid}" placeholder="Dia" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required /></td> 
            <td><input type="text" class="form-control GsmInput" id="Gsm_${uid}" name="Gsm_${uid}" placeholder="GSM" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" required /></td> 
            <td><input type="text" class="form-control QtyInput" id="Qty_${uid}" name="Qty_${uid}" placeholder="Qty" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)" required /></td> 
            <td><input type="text" class="form-control RollsInput" id="Rolls_${uid}" name="Rolls_${uid}" placeholder="Ex: 8" oninput="Common.allowOnlyNumberLength(this,3)" required /></td> 
            <td>
                <select class="form-control WidthSelect" id="Width_${uid}" name="Width_${uid}" required> 
                </select>
            </td> 
            <td><input type="text" class="form-control RopeLenghtInput" id="RopeLenght_${uid}" name="RopeLenght_${uid}" placeholder="Ex: 250" disabled /></td> 
            <td style="text-align: center;">
                <button id="dyanmicplusbtn" class="btn AddStockBtn AddFabric" type="button">
                    <i class="fas fa-plus" id="AddButton"></i>
                </button>
                <button id="RemoveButton" class="btn DynrowRemove removeRowBtn" type="button">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

    bindDropDownWidth("Width_" + uid, "Width", function () {
        $("#Width_" + uid).val(2).trigger("change");
    });

    bindDropDownMultiAddItem("Process_" + uid, 'ProcessType');

    $("#AddItemButtonRow").before(html);

    $("#Process_" + uid).select2({
        theme: 'bootstrap4',
        placeholder: '-- Select Process --',
        allowClear: true,
        closeOnSelect: false,
        width: 'style',
    });

    //$('.FabricSelect').each(function () {
    //    $(this).select2({ dropdownParent: $(this).parent() });
    //});

    updateSerialNumbers();
    refreshProductDropdowns(".FabricSelect");
}

$(document).on("click", ".AddFabric", function () {
    let mainRow = $(this).closest(".dynamic-item-row");
    let childSecondRows = mainRow.nextUntil(".dynamic-item-row", ".dynamic-item-row_Second");

    let insertAfter;
    if (childSecondRows.length > 0) {
        insertAfter = childSecondRows.last();
    } else {
        insertAfter = mainRow;
    }
    addNewFabricRow(insertAfter);
});

function addNewFabricRow(afterRow) {

    let uid = Math.random().toString(36).substring(2);

    let newRow = `
        <tr class="dynamic-item-row_Second" data-id="${uid}">
            <td class="sno"></td> 
            <td><label class="InwardFabricId d-none"></label></lable></td> 
             <td data-id="">
                 <label class="InwardFabricProcessMappingId d-none"></label>
                 <select multiple class="select2 Process" data-coreui-search="true" id="Process_${uid}" name="Process_${uid}" required>
                 </select>
            </td> 
            <td><input type="text" class="form-control DiaInput" id="Dia_${uid}" name="Dia_${uid}" placeholder="Dia" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required /></td> 
            <td><input type="text" class="form-control GsmInput" id="Gsm_${uid}" name="Gsm_${uid}" placeholder="GSM" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" required /></td> 
            <td><input type="text" class="form-control QtyInput" id="Qty_${uid}" name="Qty_${uid}" placeholder="Qty" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)" required /></td> 
            <td><input type="text" class="form-control RollsInput" id="Rolls_${uid}" name="Rolls_${uid}" placeholder="Ex: 8" oninput="Common.allowOnlyNumberLength(this,3)" required /></td> 
            <td>
                <select class="form-control WidthSelect" id="Width_${uid}" name="Width_${uid}" required> 
                </select>
            </td> 
            <td><input type="text" class="form-control RopeLenghtInput" id="RopeLenght_${uid}" name="RopeLenght_${uid}" placeholder="Ex: 250" disabled /></td> 
            <td style="text-align: end;padding-right: 21px;">
                <button class="btn DynrowRemove removeRowBtn" type="button">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

    bindDropDownWidth("Width_" + uid, "Width", function () {
        $("#Width_" + uid).val(2).trigger("change");
    });

    bindDropDownMultiAddItem("Process_" + uid, 'ProcessType');

    $(afterRow).after(newRow);

    $("#Process_" + uid).select2({
        theme: 'bootstrap4',
        placeholder: '-- Select Process --',
        allowClear: true,
        closeOnSelect: false,
        width: 'style',
    });

    updateSerialNumbers();
}

function updateSerialNumbers() {
    let count = 0;
    $("#InwardTableBody .dynamic-item-row").each(function (i) {
        $(this).find(".sno").text(i + 1);
        if ($(this).find("select.FabricSelect").length > 0) {
            count++;
        }
    });

    $("#NoofFabric").val(count);
    calculateGsmNoOfRollTotal();
}

$(document).on("click", ".removeRowBtn", function () {
    let row = $(this).closest("tr");
    let isParentRow = row.hasClass("dynamic-item-row");
    let isChildRow = row.hasClass("dynamic-item-row_Second");

    if (isChildRow) {
        row.remove();
        updateSerialNumbers();
        calculateGsmNoOfRollTotal();
        refreshProductDropdowns(".FabricSelect");
        return;
    }
    if (isParentRow) {

        row.nextUntil(".dynamic-item-row", ".dynamic-item-row_Second").remove();

        if ($(".dynamic-item-row").length > 1) {
            row.remove();
        } else {
            row.find("input,select").val("");
        }

        updateSerialNumbers();
        calculateGsmNoOfRollTotal();
        refreshProductDropdowns(".FabricSelect");
        return;
    }
});

$(document).on('input', '.QtyInput, .RollsInput', function () {
    calculateGsmNoOfRollTotal();
});

function calculateGsmNoOfRollTotal() {
    let totalQty = 0;
    let totalNoOfRoll = 0;

    $(".QtyInput").each(function () {
        let value = parseFloat($(this).val());
        if (!isNaN(value)) {
            totalQty += value;
        }
    });
    $(".RollsInput").each(function () {
        let value = parseFloat($(this).val());
        if (!isNaN(value)) {
            totalNoOfRoll += value;
        }
    });

    $("#TotalQty").val(totalQty.toFixed(3));
    $("#TotalRolls").val(totalNoOfRoll.toFixed(2));

    Common.ajaxCall("GET", "/Productions/GetApplicableMachineData", { companyId: 1, totalWeight: parseFloat(totalQty) }, function (response) {
        if (response) {
            $('#ApplicableMachine').val(response.machineName || '');
            $('#NoOfChambers').val(response.noOfChambers || '');
            $('#ChamberWeight').val(response.chamberWeight != null ? response.chamberWeight.toFixed(3) + ' KG' : '');
            // Recalculate rope length for all rows
            recalculateAllRopeLengths();
        }
    }, null);
}

$(document).on('input', '.DiaInput, .GsmInput, .QtyInput', function () {
    RopeLenCalculate(this);
});


$(document).on('input', '.DiaInput, .GsmInput', function () {
    RopeLenCalculate(this);
});

/* -------------------------------
   ROPE LENGTH CALCULATION
-------------------------------- */
function RopeLenCalculate(input) {
    const $row = $(input).closest('tr');

    const dia = parseFloat($row.find('.DiaInput').val());
    const gsm = parseFloat($row.find('.GsmInput').val());

    // ChamberWeight contains text like "12.345 KG"
    const chamberWeight = parseFloat($('#ChamberWeight').val());

    if (isNaN(dia) || isNaN(gsm) || isNaN(chamberWeight) || dia === 0 || gsm === 0) {
        $row.find('.RopeLenghtInput').val('');
        return;
    }

    const result = (19685 / (dia * gsm)) * chamberWeight;
    $row.find('.RopeLenghtInput').val(result.toFixed(2));
}

/* -------------------------------
   RECALCULATE ALL ROWS
-------------------------------- */
function recalculateAllRopeLengths() {
    $('.dynamic-item-row, .dynamic-item-row_Second').each(function () {
        const diaInput = $(this).find('.DiaInput')[0];
        if (diaInput) {
            RopeLenCalculate(diaInput);
        }
    });
}

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

//=============================================SHORTCUTS==============================================

$(document).keydown(function (event) {

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#BtnSave').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#BtnCancel').click();
    }
});


//------------------------------Attachment------------------------

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "InWard",
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
            ModuleName: "InWard",
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


/*------------------------------------------------------------------------------Dynamic Pop-------------------------------------------------------------------*/
let selectedProcessInput = null;

$(document).on('click', '.processRoute', function () {
    const $row = $(this).closest('tr');
    selectedProcessInput = $(this);

    let storedIds = $row.find('td[data-id]').attr('data-id');
    let selectedIds = storedIds ? storedIds.split(',').map(Number) : [];

    $('#ProcessModal').remove();

    let html = `
    <div class="modal fade show" id="ProcessModal" style="display:flex;align-items:center;">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header d-flex align-items-center justify-content-between">
                    <h2>Select Processes</h2>
                    <span id="ProcessPopupClose" class="close" style="cursor:pointer;font-size:30px">×</span>
                </div>
                <div class="modal-body">
                    <div id="ProcessCheckboxContainer" class="row g-2"></div>
                </div>
                <div class="modal-footer py-2">
                    <button type="button" class="btn btn-primary btn-sm d-none" id="SaveProcessBtn">Save</button>
                </div>
            </div>
        </div>
    </div>`;

    $('body').append(html);

    ProcessTypeDropdown[0].forEach(p => {
        $('#ProcessCheckboxContainer').append(`
            <div class="col-md-6 col-6 checkDiv">
                <input type="checkbox" class="ProcessCheck me-2" data-id="${p.ProcessTypeId}" value="${p.ProcessTypeName}" id="Process_${p.ProcessTypeId}">
                <label for="Process_${p.ProcessTypeId}" class="checkbox-label">${p.ProcessTypeName}</label>
            </div>
        `);
    });

    if (selectedIds.length > 0) {
        $('.ProcessCheck').each(function () {
            $(this).prop('checked', selectedIds.includes($(this).data('id')));
        });
    }

    toggleSaveButton();

    $('#ProcessPopupClose').click(function () {
        $('#ProcessModal').remove();
    });

    $(document).on('change', '.ProcessCheck', function () {
        toggleSaveButton();
    });

    function toggleSaveButton() {
        $('#SaveProcessBtn').toggleClass('d-none', $('.ProcessCheck:checked').length === 0);
    }

    $('#SaveProcessBtn').click(function () {
        const selectedCheckedIds = $('.ProcessCheck:checked').map(function () { return $(this).data('id'); }).get();

        const selectedCount = selectedCheckedIds.length;
        selectedProcessInput.val(selectedCount);

        $row.find('td[data-id]').attr('data-id', selectedCheckedIds.join(','));
        $('#ProcessModal').remove();
    });
});


/*------------------------------------------------------------------Avoid the Duplicate to select----------------------------------------------------------------*/

$(document).on("change", ".FabricSelect", function () {

    const classMap = [".FabricSelect"];
    const changedClass = classMap.find(c => $(this).hasClass(c.substring(1)));
    refreshProductDropdowns(changedClass);
});

function refreshProductDropdowns(selector) {

    let selectedValues = $(selector).map(function () {
        return $(this).val();
    }).get().filter(v => v !== "" && v !== "AddItemFabric");

    $(selector).each(function () {

        let currentVal = $(this).val();

        $(this).find("option").prop("disabled", false).removeClass("d-none");

        selectedValues.forEach(val => {
            if (val !== currentVal) {
                $(this).find(`option[value="${val}"]`).prop("disabled", true).addClass("d-none");
            }
        });
    });
}

function bindDropDownWidth(id, moduleName, callback) {

    var request = {
        moduleName: moduleName
    };

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Common/GetDropDown',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status == true) {
                Common.bindDropDownSuccess(response.data, id);
                if (typeof callback === "function") {
                    callback();
                }
            }
        },
        error: function (response) {
            console.log("Dropdown bind error", response);
        }
    });
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

function ajaxPromise(method, url, data) {
    return new Promise((resolve, reject) => {
        Common.ajaxCall(method, url, data, resolve, reject);
    });
}

/*========================================================End Status Tracking=================================================================*/

/*========================================================DropDown + Add Item=================================================================*/

function bindDropDownClientAddItem(id, moduleName) {

    var request = {
        moduleName: moduleName
    };
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Common/GetDropDown',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status == true) {
                bindDropDownSuccessClientAddItem(response.data, id);
            }
        },
        error: function (response) {

        },
    });
}

function bindDropDownSuccessClientAddItem(response, controlid) {
    if (response != null) {
        var data = JSON.parse(response);
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
            $('#' + controlid).append($('<option>', {
                value: 'AddItem',
                text: '+ Add Item',
                class: 'add-item-option'
            }));
        } else {
            $('#' + controlid).append($('<option>', {
                value: '',
                text: '--Select--',
            }));
        }
    }
}

function bindDropDownColorAddItem(id, moduleName) {

    var request = {
        moduleName: moduleName
    };
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Common/GetDropDown',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status == true) {
                bindDropDownSuccessColorAddItem(response.data, id);
            }
        },
        error: function (response) {

        },
    });
}

function bindDropDownSuccessColorAddItem(response, controlid) {
    if (response != null) {
        var data = JSON.parse(response);
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
            $('#' + controlid).append($('<option>', {
                value: 'AddItemColor',
                text: '+ Add Item',
                class: 'add-item-option'
            }));
        } else {
            $('#' + controlid).append($('<option>', {
                value: '',
                text: '--Select--',
            }));
        }
    }
}

function bindDropDownSuccessNormal(response, controlid) {
    if (response != null) {
        var data = JSON.parse(response);
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
}

function bindDropDownMultiAddItem(id, moduleName) {
    var request = {
        moduleName: moduleName
    };

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Common/GetDropDown',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status === true) {
                bindDropDownMultiAddItemSuccess(response.data, id);
            } else {
                console.error("Error: " + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("Ajax error:", error);
        },
    });
}

function bindDropDownMultiAddItemSuccess(response, controlid) {
    if (response != null) {
        var data = JSON.parse(response);
        var dataValue = data[0];
        if (dataValue != null && dataValue.length > 0 && !dataValue[0].hasOwnProperty('TetroONEnocount')) {
            $('#' + controlid).empty();
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];
            $.each(dataValue, function (index, item) {
                $('#' + controlid).append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty],
                }));
            });
            $('#' + controlid).append($('<option>', {
                value: 'AddItemProcess',
                text: '+ Add Item',
                //class: 'add-item-option'
            }));
        } else {
            $('#' + controlid).empty();
        }
    }
}