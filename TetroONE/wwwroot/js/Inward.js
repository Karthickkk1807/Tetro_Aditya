var PlantMappingId = 0;
var InWardId = 0;
var WidthDropdown = [];
var FabricTypeDropdown = [];
var ProcessTypeDropdown = [];
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();

$(document).ready(async function () {

    Common.bindDropDown('ClientId', 'Client');
    Common.bindDropDown('TransactionId', 'TransactionType');
    Common.bindDropDown('ReceivedFrom', 'JobWorker');
    Common.bindDropDown('ReceivedBy', 'SampleReceivedBy');
    Common.bindDropDown('ColorId', 'Color');
    Common.bindDropDown('PaymentTypeId', 'PaymentType');
    Common.bindDropDown('InWardStatusId', 'InWardStatus');

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
        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);
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

        $('#emptyDiv').removeClass('col-lg-2 col-md-2 col-6').addClass('col-lg-4 col-md-4 col-6');
        $('#InWardStatusIdDiv').hide();

        $('#ModalHeading').text('InWard Details');
        $("#BtnSave span:first").text("Save");

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);
        $('#InwardDate').val(formattedDate);

        Common.ajaxCall("GET", "/Common/GetAutoGenerate", { ModuleName: 'InWard', PlantId: PlantMappingId }, function (response) {
            Common.AutoGenerateNumberGet(response, "InWardNo", "InWardNo");
        });

        $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        $('#AddAttachLable, #AddNotesLable').show();
        $('.modal-body').animate({ scrollTop: 0 }, 300);
        $('#InWardModal').show();
    });

    $(document).on('click', '.btn-edit', function () {
        InWardId = $(this).data('id');

        deletedFiles = [];
        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        $('#ModalHeading').text('Edit InWard Details');
        $("#BtnSave span:first").text("Update");
        $('#emptyDiv').removeClass('col-lg-4 col-md-4 col-6').addClass('col-lg-2 col-md-2 col-6');
        $('#InWardStatusIdDiv').show();

        $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        $('#AddAttachLable, #AddNotesLable').show();

        $('.modal-body').animate({ scrollTop: 0 }, 300);
        $('#InWardModal').show();

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: parseInt(InWardId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardNotNullSuccess, null);
    });

    $(document).on('click', '#BtnCancel, #InWardClose', function () {
        $('#InWardModal').hide();
    });

    $(document).on('click', '#BtnSave', function () {

        if ($("#TableInputs").valid() && $("#TopStatic").valid() && $("#FormStatus").valid()) {
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

                if (row.hasClass("dynamic-item-row")) {
                    currentGroupRowNo = 1;
                    parentFabricTypeId = currentRowFabricVal;
                    row.find(".FabricSelect").val(parentFabricTypeId);

                } else if (row.hasClass("dynamic-item-row_Second")) {
                    currentGroupRowNo++;
                }

                let InwardFabricId = row.find(".InwardFabricId").text().trim();

                let InwardFabricProcessMappingId = row.find(".InwardFabricProcessMappingId").text().trim();

                pushFabricMapping(row, InwardFabricId, parentFabricTypeId, currentGroupRowNo);

                if (InwardFabricId === "" || InwardFabricId === null) {
                    InwardFabricId = row.prevAll(".dynamic-item-row").first().find(".InwardFabricId").text().trim();
                }

                appendProcessMapping(row, InwardFabricId, parentFabricTypeId, InwardFabricProcessMappingId, currentGroupRowNo);
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

            function pushFabricMapping(row, fabricId, fabricTypeId, rowNo) {

                FabricMapping.push({
                    InwardFabricId: fabricId ? parseInt(fabricId) : null,
                    FabricId: parseInt(fabricTypeId) || null,
                    ProcessCount: parseInt(row.find(".processRoute").val()) || null,
                    Dia: parseFloat(row.find(".DiaInput").val()) || null,
                    GSM: parseFloat(row.find(".GsmInput").val()) || null,
                    Qty: parseFloat(row.find(".QtyInput").val()) || null,
                    NoOfRolls: parseInt(row.find(".RollsInput").val()) || null,
                    Width: parseInt(row.find(".WidthSelect").val()) || null,
                    InWardId: InWardId > 0 ? parseInt(InWardId) : null,
                    RowNo: rowNo,
                });
            }

            function appendProcessMapping(row, InwardFabricId, fabricTypeId, InwardFabricProcessMappingId, rowNo) {

                let processData = row.find("td[data-id]").attr("data-id");
                if (!processData) return;

                let ids = processData.split(',').map(x => parseInt(x.trim()));

                ids.forEach(pid => {
                    FabricProcessMapping.push({
                        RowNo: rowNo,
                        InwardFabricProcessMappingId: InwardFabricProcessMappingId ? parseInt(InwardFabricProcessMappingId) : null,
                        InwardFabricId: InwardFabricId ? parseInt(InwardFabricId) : null,
                        FabricTypeId: fabricTypeId ? parseInt(fabricTypeId) : null,
                        ProcessId: parseInt(pid)
                    });
                });
            }
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
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);

        Inventory.toggleField(data[0][0].Notes, "#Notes", "#AddNotes", "#AddNotesLable", "HideNotesLable");
        Inventory.toggleFieldForAttachment(data[3][0].AttachmentId, "#AddAttachLable", "#AddAttachment", "HideAttachlable");
        Inventory.bindAttachments(data[3]);

        $('.dynamic-item-row').remove();
        $('.dynamic-item-row_Second').remove();

        const InwardRows = data[1];
        const processMapping = data[2];

        let fabricGroup = {};
        let mappingLookup = {};
        let renderRowTracker = {};

        processMapping.forEach(m => {
            let key = `${m.FabricTypeId}_${m.RowNo}`;
            if (!mappingLookup[key]) mappingLookup[key] = [];
            mappingLookup[key].push(m);
        });

        InwardRows.forEach((item, index) => {
            let uid = `row_${index}_${Date.now()}`;

            let WidthHTML = WidthDropdown[0].map(w => `<option value="${w.WidthId}" ${item.Width == w.WidthId ? 'selected' : ''}>${w.Width}</option>`).join('');
            let FabricHTML = FabricTypeDropdown[0].map(f => `<option value="${f.FabricTypeId}" ${item.FabricTypeId == f.FabricTypeId ? 'selected' : ''}>${f.FabricTypeName}</option>`).join('');

            if (!renderRowTracker[item.FabricTypeId]) renderRowTracker[item.FabricTypeId] = 1;
            else renderRowTracker[item.FabricTypeId]++;

            let currentRowNo = renderRowTracker[item.FabricTypeId];
            let lookupKey = `${item.FabricTypeId}_${currentRowNo}`;

            let mapped = mappingLookup[lookupKey] || [];

            let processIds = mapped.map(x => x.ProcessId).join(",");
            let processMappingId = mapped.length ? mapped[0].InwardFabricProcessMappingId : "";

            let isFirstRowOfFabric = !fabricGroup[item.FabricTypeId];

            let html = `
                <tr class="${isFirstRowOfFabric ? 'dynamic-item-row' : 'dynamic-item-row_Second'}" 
                    data-id="${uid}" 
                    data-rowno="${currentRowNo}">

                    <td class="sno"></td> 
                    <td>
                        ${isFirstRowOfFabric ? `<select class="form-control FabricSelect">${FabricHTML}</select>` : ""}
                        <label class="InwardFabricId d-none">${item.InwardFabricId || ''}</label>
                    </td>

                    <td data-id="${processIds}">
                        <label class="InwardFabricProcessMappingId d-none">${processMappingId || ''}</label>
                        <input type="text" class="form-control processRoute" value="${item.ProcessCount}" readonly>
                    </td>

                    <td><input class="form-control DiaInput" value="${item.Dia}"></td>
                    <td><input class="form-control GsmInput" value="${item.GSM}"></td>
                    <td><input class="form-control QtyInput" value="${item.Qty}"></td>
                    <td><input class="form-control RollsInput" value="${item.NoOfRolls || ''}"></td>
                    <td><select class="form-control WidthSelect">${WidthHTML}</select></td>

                    <td style="text-align:center">
                        ${isFirstRowOfFabric ? `<button id="dyanmicplusbtn" class="btn AddStockBtn AddFabric" type="button"><i class="fas fa-plus" id="AddButton"></i></button>` : ""}
                        <button id="RemoveButton" class="btn DynrowRemove removeRowBtn" type="button">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;

            if (isFirstRowOfFabric) {
                $("#AddItemButtonRow").before(html);
                fabricGroup[item.FabricTypeId] = uid;
            } else {
                $(`tr[data-id='${fabricGroup[item.FabricTypeId]}']`).after(html);
            }
        });

        updateSerialNumbers();
        refreshProductDropdowns(".FabricSelect");
    }
}

function duplicateFabric() { 
    let uid = Math.random().toString(36).substring(2);

    var defaultOption = '<option value="">--Select--</option>'; 
    var FabricTypeSelectOptions = "";
    if (FabricTypeDropdown != null && FabricTypeDropdown.length > 0 && FabricTypeDropdown[0].length > 0) {
        FabricTypeSelectOptions = FabricTypeDropdown[0].map(function (FabricTypeId) {
            return `<option value="${FabricTypeId.FabricTypeId}">${FabricTypeId.FabricTypeName}</option>`;
        }).join('');
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
                 <input type="text" class="form-control processRoute" id="ProcessTypeId${uid}" name="ProcessTypeId${uid}"" placeholder="Click Here" required readonly>
            </td> 
            <td><input type="text" class="form-control DiaInput" id="Dia_${uid}" name="Dia_${uid}" placeholder="Dia" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" required /></td> 
            <td><input type="text" class="form-control GsmInput" id="Gsm_${uid}" name="Gsm_${uid}" placeholder="GSM" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" required /></td> 
            <td><input type="text" class="form-control QtyInput" id="Qty_${uid}" name="Qty_${uid}" placeholder="Qty" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" required /></td> 
            <td><input type="text" class="form-control RollsInput" id="Rolls_${uid}" name="Rolls_${uid}" placeholder="No. of Rolls" oninput="Common.allowOnlyNumberLength(this,3)" required /></td> 
            <td>
                <select class="form-control WidthSelect" id="Width_${uid}" name="Width_${uid}" required> 
                </select>
            </td> 
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

    Common.bindDropDown("Width_" + uid, 'Width');
    $("#AddItemButtonRow").before(html);

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
                 <input type="text" class="form-control processRoute" id="ProcessTypeId${uid}" name="ProcessTypeId${uid}"" placeholder="Click Here" required readonly>
            </td> 
            <td><input type="text" class="form-control DiaInput" id="Dia_${uid}" name="Dia_${uid}" placeholder="Dia" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" required /></td> 
            <td><input type="text" class="form-control GsmInput" id="Gsm_${uid}" name="Gsm_${uid}" placeholder="GSM" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" required /></td> 
            <td><input type="text" class="form-control QtyInput" id="Qty_${uid}" name="Qty_${uid}" placeholder="Qty" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" required /></td> 
            <td><input type="text" class="form-control RollsInput" id="Rolls_${uid}" name="Rolls_${uid}" placeholder="No. of Rolls" oninput="Common.allowOnlyNumberLength(this,3)" required /></td> 
            <td>
                <select class="form-control WidthSelect" id="Width_${uid}" name="Width_${uid}" required> 
                </select>
            </td> 
            <td style="text-align: end;padding-right: 21px;">
                <button class="btn DynrowRemove removeRowBtn" type="button">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

    Common.bindDropDown("Width_" + uid, 'Width');
    $(afterRow).after(newRow);

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
    let totalGsm = 0;
    let totalNoOfRoll = 0;

    $(".QtyInput").each(function () {
        let value = parseFloat($(this).val());
        if (!isNaN(value)) {
            totalGsm += value;
        }
    });
    $(".RollsInput").each(function () {
        let value = parseFloat($(this).val());
        if (!isNaN(value)) {
            totalNoOfRoll += value;
        }
    });

    $("#TotalQty").val(totalGsm.toFixed(2));
    $("#TotalRolls").val(totalNoOfRoll.toFixed(2));
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
    }).get().filter(v => v !== "");

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
