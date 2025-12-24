var PlantMappingId = 0;
var OutWardId = 0;
var WidthDropdown = [];
var FabricTypeDropdown = [];
var ProcessTypeDropdown = [];
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();

$(document).ready(async function () {

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    Common.bindDropDown('InwardNo', 'InwardNo');
    Common.bindDropDown('OutWardTo', 'OutWardType');
    Common.bindDropDown('OutWardBy', 'SampleReceivedBy');
    Common.bindDropDown('ShipFromId', 'Plant');
    Common.bindDropDown('OutWardStatus', 'OutWardStatus');

    var fabricTypeDropdown = await Common.bindDropDownSync('FabricType');
    FabricTypeDropdown = JSON.parse(fabricTypeDropdown);

    var processTypeDropdown = await Common.bindDropDownSync('ProcessType');
    ProcessTypeDropdown = JSON.parse(processTypeDropdown);

    var widthDropdown = await Common.bindDropDownSync('Width');
    WidthDropdown = JSON.parse(widthDropdown);

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
        Common.ajaxCall("GET", "/Productions/GetOutward", { PlantId: parseInt(PlantMappingId), OutWardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetOutward", { PlantId: parseInt(PlantMappingId), OutWardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardSuccess, null);
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
            Common.ajaxCall("GET", "/Productions/GetOutward", { PlantId: parseInt(PlantMappingId), OutWardId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetOutwardSuccess, null);
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
        Common.ajaxCall("GET", "/Productions/GetOutward", { PlantId: parseInt(PlantMappingId), OutWardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetOutward", { PlantId: parseInt(PlantMappingId), OutWardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardSuccess, null);

    $(document).on('click', '#AddOutWard', function () {
        $('.dynamic-item-row').remove();
        $('.dynamic-item-row_Second').remove();
        duplicateFabric();
        ShipToAddressClear();
        ShipFromAddressClear();
        $('#ShipToId').prop('disabled', true);
        $('#ShipFromId').prop('disabled', true);

        $('#ShipToId').empty().append($('<option>', { value: '', text: '--Select--', }));
        $('#ModalHeading').text('OutWard Details');
        $("#BtnSavePreviewbtn span:first").text("Save & Print");
        $("#BtnSave span:first").text("Save");

        OutWardId = 0;
        deletedFiles = [];
        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        Common.removevalidation('TopStatic');
        Common.removevalidation('FormShipping');
        Common.removevalidation('FormShipTo');
        Common.removevalidation('FormStatus');

        Common.ajaxCall("GET", "/Common/GetAutoGenerate", { ModuleName: 'OutWard', PlantId: PlantMappingId }, function (response) {
            Common.AutoGenerateNumberGet(response, "OutwardNo", "OutWardNo");
        });

        var currentDate = new Date().toISOString().slice(0, 10);
        $('#OutwardDate').attr("max", currentDate);
        $('#OutwardDate').val(currentDate);

        $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        $('#AddAttachLable, #AddNotesLable').show();
        $('.ShipTo-edit').hide();

        $('#OutWardBy').val(LoginUserId);

        $('#emptyDiv').removeClass('col-lg-2 col-md-2 col-6').addClass('col-lg-4 col-md-4 col-6');
        $('#OutWardStatusIdDiv').hide();

        $('.modal-body').animate({ scrollTop: 0 }, 300);
        $('#ShipFromColumn .row.mt-3, #ShipToColumn .row.mt-3').hide();
        $('#toggleIconShipFrom').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        $('#toggleIconShipTo').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        $('.ShipTo-edit').hide();

        $('#OutWardModal').show();
    });

    $(document).on('click', '#toggleShipTo, #toggleIconShipTo, #toggleShipFrom, #toggleIconShipFrom', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $rows = $('#ShipFromColumn .row.mt-3, #ShipToColumn .row.mt-3');
        const isCurrentlyVisible = $rows.is(':visible');
        $rows.stop(true, true).slideToggle(300);

        $('#toggleIconShipTo, #toggleIconShipFrom').toggleClass('fa-chevron-up fa-chevron-down');
        $('#ShipFromColumn .BilAddHead, #ShipToColumn .BilAddHead').css('border-bottom', '1px solid #c7c7c7');
        if (isCurrentlyVisible) $('.ShipTo-edit').hide();
        else $('.ShipTo-edit').show();
    });

    $(document).on('click', '.btn-edit', function () {
        OutWardId = $(this).data('id');

        $('.dynamic-item-row').remove();
        $('.dynamic-item-row_Second').remove();

        ShipToAddressClear();
        ShipFromAddressClear();
        $('#ShipToId').prop('disabled', false);
        $('#ShipFromId').prop('disabled', false);

        $('#ShipToId').empty().append($('<option>', { value: '', text: '--Select--', }));
        $('#ModalHeading').text('Edit OutWard Details');
        $("#BtnSavePreviewbtn span:first").text("Update & Print");
        $("#BtnSave span:first").text("Update");

        $('#emptyDiv').removeClass('col-lg-4 col-md-4 col-6').addClass('col-lg-2 col-md-2 col-6');
        $('#OutWardStatusIdDiv').show();

        $('.ShipTo-edit').show();

        $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        $('#AddAttachLable, #AddNotesLable').show();

        $('.modal-body').animate({ scrollTop: 0 }, 300);
        Common.ajaxCall("GET", "/Productions/GetOutward", { PlantId: parseInt(PlantMappingId), OutWardId: parseInt(OutWardId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardNotNullSuccess, null);
        $('#OutWardModal').show();
    });

    $(document).on('click', '#BtnCancel, #OutWardClose', function () {
        $('#OutWardModal').hide();
    });

    $(document).on('change', '#InwardNo', function () {
        var $thisVal = $(this).val();
        if ($thisVal != "") {
            Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), InwardId: parseInt($thisVal), FromDate: null, ToDate: null }, GetInwardNotNullSuccess, null);
        }
        else {
            $('#OutWardTo').val('').trigger('change');
            $('.dynamic-item-row').remove();
            $('.dynamic-item-row_Second').remove();
            duplicateFabric();
            $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
            $('#AddNotesLable, #AddAttachLable').show();
        }
    });

    $(document).on('change', '#OutWardTo', function () {
        var $thisVal = $(this).val();
        ShipToAddressClear();
        if ($thisVal !== "") {
            var EditData = { OutwardType: parseInt($thisVal) }
            Common.ajaxCall("GET", "/Productions/GetOutWardTypeContactDetails", EditData,
                function (response) {
                    if (response.status) {
                        Common.bindDropDownSuccess(response.data, "ShipToId"); 
                        $('#ShipFromId').val(PlantMappingId).trigger('change');
                        $('#ShipToId').prop('disabled', false);
                        $('#ShipFromId').prop('disabled', false);
                    }
                },
                null
            );
        }
        else {
            $('#ShipToId').empty().append($('<option>', { value: '', text: '--Select--', }));
            $('#ShipFromId, #ShipToId').val('').trigger('change');
            $('#ShipToId').prop('disabled', true);
            $('#ShipFromId').prop('disabled', true);
        }
    });

    $(document).on('change', '#ShipFromId', function () {
        var ShipFromId = $(this).val();
        if (ShipFromId != "" && ShipFromId != null) {
            Common.ajaxCall("GET", "/Settings/GetPlantDetails", { PlantId: parseInt(ShipFromId) }, function (response) {
                if (response.status) {
                    ShipFromAddress(response);
                } else {
                    ShipFromAddressClear();
                }
            }, null);
        } else {
            ShipFromAddressClear();
        }
    });

    $(document).on('change', '#ShipToId', function () {
        var $thisVal = $(this).val();
        var $OutwardTypeVal = $('#OutWardTo').val();
        if ($thisVal !== "") {
            var ModuleName = "";
            $OutwardTypeVal == "1" ? ModuleName = 'Client' : ModuleName = 'Job';
            var EditData = { ModuleName: ModuleName, ModuleId: parseInt($thisVal) }
            Common.ajaxCall("GET", "/Productions/GetOutWardTypeClientJobDetails", EditData, function (response) {
                if (response.status) {
                    ShipToAddress(response)
                } else {
                    ShipToAddressClear();
                }
            }, null);
        }
        else {
            ShipToAddressClear();
        }
    });

    $(document).on('click', '#BtnSave', function () {
        if ($(".ShipToedit-icon i.fas.fa-save:visible").length > 0) {
            Common.warningMsg('Please Save the Ship To Address before Proceeding.');
            return false;
        }
        if ($("#TopStatic").valid() && $("#FormShipping").valid() && $("#FormShipTo").valid() && $("#TableInputs").valid() && $("#FormStatus").valid()) {
            $('#loader-pms').show();
            getExistFiles();

            var objvalue = {
                OutWardId: OutWardId > 0 ? parseInt(OutWardId) : null,
                OutwardDate: $('#OutwardDate').val() || null,
                OutwardNo: $('#OutwardNo').val() || null,
                OutWardTo: parseInt($('#OutWardTo').val()) || null,
                PackingSlipNo: $('#PackingSlipNo').val() || null,
                ShipFrom: $('#ShipFromId').val() || null,
                ShipTo: $('#ShipToId').val() || null,
                ShipToAddress: $('#ShipToAddress').text() || null,
                ShipToCity: $('#ShipToCity').text() || null,
                ShiptoMobileNo: $('#ShipToContactNumber').text() || null,
                ShipToPlaceOfSupply: $('#ShipToPlaceOfSupply').text() || null,
                OutWardedBy: parseInt($('#OutWardBy').val()) || null,
                NoofFabric: parseInt($('#NoofFabric').val()) || null,
                TotalQty: parseFloat($('#TotalQty').val()) || null,
                TotalRolls: parseFloat($('#TotalRolls').val()) || null,
                Notes: $('#AddNotesText').val() || null,
                VehicleNo: $('#VehicleNO').val() || null,
                DriverName: $('#DriverName').val() || null,
                OutWardStatusId: parseInt($('#OutWardStatus').val()) || null,
                InwardId: parseInt($('#InwardNo').val()) || null,
                PlantId: parseInt(PlantMappingId),
            };

            var FabricMapping = [];
            var FabricProcessMapping = [];

            var currentGroupRowNo = 0;
            var parentFabricTypeId = null;

            $("#OutWardTableBody .dynamic-item-row, #OutWardTableBody .dynamic-item-row_Second").each(function () {
                let row = $(this);
                let currentRowFabricVal = row.find(".FabricSelect").val();

                // ---- IDENTIFY PARENT OR CHILD ROW ----
                if (row.hasClass("dynamic-item-row")) {
                    currentGroupRowNo = 1;
                    parentFabricTypeId = currentRowFabricVal;
                    row.find(".FabricSelect").val(parentFabricTypeId);
                } else if (row.hasClass("dynamic-item-row_Second")) {
                    currentGroupRowNo++;
                }

                // ---- GET OutwardFabricId ----
                let OutwardFabricId = row.find(".outwardFabricId").text().trim();
                if (!OutwardFabricId) {
                    OutwardFabricId = row.prevAll(".dynamic-item-row").first().find(".outwardFabricId").text().trim();
                }

                let OutwardFabricProcessMappingId = row.find(".OutwardFabricProcessMappingId").text().trim();

                // ---- PUSH FABRIC MAPPING ROW DATA INLINE ----
                FabricMapping.push({
                    OutwardFabricId: OutwardFabricId ? parseInt(OutwardFabricId) : null,
                    FabricTypeId: parseInt(parentFabricTypeId) || null,
                    ProcessCount: row.find(".Process").val()?.length || 0,
                    Dia: parseFloat(row.find(".DiaInput").val()) || null,
                    GSM: parseFloat(row.find(".GsmInput").val()) || null,
                    Qty: parseFloat(row.find(".QtyInput").val()) || null,
                    NoOfRolls: parseInt(row.find(".RollsInput").val()) || null,
                    Width: parseInt(row.find(".WidthSelect").val()) || null,
                    OutwardId: OutWardId > 0 ? parseInt(OutWardId) : null,
                    RowNo: currentGroupRowNo,
                });

                // ---- PUSH PROCESS MAPPING INLINE ----
                let selectedProcessIds = row.find("select.Process").val() || [];
                selectedProcessIds.forEach(pid => {
                    FabricProcessMapping.push({
                        RowNo: currentGroupRowNo,
                        OutwardFabricProcessMappingId: OutwardFabricProcessMappingId ? parseInt(OutwardFabricProcessMappingId) : null,
                        OutwardFabricId: OutwardFabricId ? parseInt(OutwardFabricId) : null,
                        FabricTypeId: parentFabricTypeId ? parseInt(parentFabricTypeId) : null,
                        ProcessId: parseInt(pid)
                    });
                });
            });

            formDataMultiple.append("OutwardStaticData", JSON.stringify(objvalue));
            formDataMultiple.append("OutwardFabricDetails", JSON.stringify(FabricMapping));
            formDataMultiple.append("OutwardFabricProcessMappingDetails", JSON.stringify(FabricProcessMapping));
            formDataMultiple.append("Exist", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));

            $.ajax({
                type: "POST",
                url: "/Productions/InsertUpdateOutwardDetails",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        formDataMultiple = new FormData();
                        $('#loader-pms').hide();
                        Common.successMsg(response.message);
                        $('#OutWardModal').hide();
                        var fnData = Common.getDateFilter('dateDisplay2');
                        Common.ajaxCall("GET", "/Productions/GetOutward", { PlantId: parseInt(PlantMappingId), OutWardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardSuccess, null);
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


    $(document).on('click', '#BtnSavePreviewbtn', function () {
        $('#loader-pms').show();
        var EditData = { NoOfCopies: 1, printType: "preview" }

        $.ajax({
            url: '/Productions/OutwardPrint',
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
                                              <head><title>Outward Preview</title></head>
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

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var OutWardId = $(this).data('id');
            Common.ajaxCall("GET", "/Productions/DeleteOutWardDetails", { OutWardId: parseInt(OutWardId) }, function (response) {
                if (response.status) {
                    Common.successMsg(response.message);

                    var fnData = Common.getDateFilter('dateDisplay2');
                    Common.ajaxCall("GET", "/Productions/GetOutward", { PlantId: parseInt(PlantMappingId), OutWardId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardSuccess, null);
                }
            }, null);
        }
    });
});

function GetOutwardSuccess(response) {
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
        var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="OutWardTable">
                </table>
            `;
        $('#MainGrid').append(html);

        var columns = Common.bindColumn(data[1], ['OutWardId', 'Status_Color']);
        Common.bindTable('OutWardTable', data[1], columns, -1, 'OutWardId', '360px', true, access);
    }
}

function GetOutwardNotNullSuccess(response) {
    if (!response.status) return;  
    var data = JSON.parse(response.data); 

    const header = data[0][0];
    $('#OutwardDate').val(header.Date);
    $('#OutwardNo').val(header.OutwardNo);
    $('#PackingSlipNo').val(header.PackingSlipNo);
    $('#OutWardBy').val(header.OutWardedBy);
    $('#OutWardTo').val(header.OutWardTo);
    $('#NoofFabric').val(header.NoOfFabric);
    $('#TotalQty').val(header.TotalQty);
    $('#TotalRolls').val(header.TotalRolls);
    $('#VehicleNO').val(header.VehicleNo);
    $('#DriverName').val(header.DriverName);
    $('#OutWardStatus').val(header.OutWardStatusId);
    $('#InwardNo').val(header.InwardId);
     
    Common.ajaxCall("GET", "/Productions/GetOutWardTypeContactDetails", { OutwardType: parseInt(header.OutWardTo) }, function (responseOutWardType) {
        if (responseOutWardType.status) {
            Common.bindDropDownSuccess(responseOutWardType.data, "ShipToId");
            Common.ajaxCall("GET", "/Settings/GetPlantDetails", { PlantId: parseInt(header.ShipFrom) }, function (responsePlantDetails) {
                if (responsePlantDetails.status) {
                    $('#ShipFromId').val(header.ShipFrom);
                    ShipFromAddress(responsePlantDetails);
                    $('#ShipToId').val(header.ShipTo);
                    ShipToAddress(response);
                }
            }, null);
        } else {
            ShipFromAddressClear();
        }
    }, null);

    Inventory.toggleField(header.Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable", "HideNotesLable");
    Inventory.toggleFieldForAttachment(data[3][0]?.AttachmentId, "#AddAttachLable", "#AddAttachment", "HideAttachlable");
    Inventory.bindAttachments(data[3]);

    const outwardRows = data[1];
    const processMapping = data[2];

    let fabricGroup = {};
    let mappingLookup = {};
    let renderRowTracker = {};
     
    processMapping.forEach(m => {
        let key = `${m.FabricTypeId}_${m.RowNo}`;
        if (!mappingLookup[key]) mappingLookup[key] = [];
        mappingLookup[key].push(m);
    });

    outwardRows.forEach((item, index) => {
        let uid = `row_${index}_${Date.now()}`;

        let WidthHTML = WidthDropdown[0].map(w => `<option value="${w.WidthId}" ${item.Width == w.WidthId ? 'selected' : ''}>${w.Width}</option>`).join('');
        let FabricHTML = FabricTypeDropdown[0].map(f => `<option value="${f.FabricTypeId}" ${item.FabricTypeId == f.FabricTypeId ? 'selected' : ''}>${f.FabricTypeName}</option>`).join('');

        if (!renderRowTracker[item.FabricTypeId]) renderRowTracker[item.FabricTypeId] = 1;
        else renderRowTracker[item.FabricTypeId]++;

        let currentRowNo = renderRowTracker[item.FabricTypeId];
        let lookupKey = `${item.FabricTypeId}_${currentRowNo}`;
        let mapped = mappingLookup[lookupKey] || [];

        let processMappingId = mapped.length ? mapped[0].OutwardFabricProcessMappingId : "";
        let selectedProcessIds = mapped.map(x => x.ProcessId.toString()) || [];

        let isFirstRowOfFabric = !fabricGroup[item.FabricTypeId];
         
        let html = `
            <tr class="${isFirstRowOfFabric ? 'dynamic-item-row' : 'dynamic-item-row_Second'}" data-id="${uid}" data-rowno="${currentRowNo}"> 
                <td class="sno"></td> 
                <td>
                    ${isFirstRowOfFabric ? `<select class="form-control FabricSelect">${FabricHTML}</select>` : ""}
                    <label class="outwardFabricId d-none">${item.OutwardFabricId}</label>
                </td> 
                <td>
                    <label class="OutwardFabricProcessMappingId d-none">${processMappingId}</label>
                    <select multiple class="form-control Process" required>
                        ${ProcessTypeDropdown[0].map(p => `
                            <option value="${p.ProcessTypeId}" ${selectedProcessIds.includes(p.ProcessTypeId.toString()) ? 'selected' : ''}>
                                ${p.ProcessTypeName}
                            </option>`).join('')}
                    </select> 
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
    $(".Process").select2({
        theme: 'bootstrap4',
        placeholder: '-- Select Process --',
        allowClear: true,
        closeOnSelect: false,
        width: 'style',
    });
}


function GetInwardNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

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

            let processMappingId = mapped.length ? mapped[0].InwardFabricProcessMappingId : "";
            let selectedProcessIds = mapped.map(x => x.ProcessId.toString()) || [];

            let isFirstRowOfFabric = !fabricGroup[item.FabricTypeId];
             
            let html = `
                <tr class="${isFirstRowOfFabric ? 'dynamic-item-row' : 'dynamic-item-row_Second'}" data-id="${uid}" data-rowno="${currentRowNo}"> 
                    <td class="sno"></td> 
                    <td>
                        ${isFirstRowOfFabric ? `<select class="form-control FabricSelect">${FabricHTML}</select>` : ""}
                        <label class="InwardFabricId d-none">${item.InwardFabricId || ''}</label>
                    </td> 
                    <td>
                        <label class="InwardFabricProcessMappingId d-none">${processMappingId || ''}</label>
                        <select multiple class="form-control Process" required>
                            ${ProcessTypeDropdown[0].map(p => `
                                <option value="${p.ProcessTypeId}" ${selectedProcessIds.includes(p.ProcessTypeId.toString()) ? 'selected' : ''}>
                                    ${p.ProcessTypeName}
                                </option>`).join('')}
                        </select> 
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
        $(".Process").select2({
            theme: 'bootstrap4',
            placeholder: '-- Select Process --',
            allowClear: true,
            closeOnSelect: false,
            width: 'style',
        }); 
    }
}
 
let isShipToEditing = false;

$('#ShipToEdit').on('click', function (e) {
    e.preventDefault();

    const fields = ['ShipToAddress', 'ShipToCity', 'ShipToContactNumber', 'ShipToPlaceOfSupply'];

    if (!isShipToEditing) {
        fields.forEach(id => {
            const $label = $('#' + id);
            const val = $label.text().trim();
            const inputId = 'edit_' + id;

            if (!$('#' + inputId).length) {
                $label.after(`<input type="text" id="${inputId}" class="form-control edit-field mt-1" value="${val === '-' ? '' : val}">`);
            }
        });

        $('#ShipToAddress, #ShipToCity, #ShipToContactNumber, #ShipToPlaceOfSupply').hide();
        $('#ShipToEdit i').removeClass('fa-pencil-alt').addClass('fa-save').attr('title', 'Save Shipping Address');

        isShipToEditing = true;

    } else {
        fields.forEach(id => {
            const $label = $('#' + id);
            const $input = $('#edit_' + id);
            const val = $input.val().trim() || '-';

            $label.text(val);
            $input.remove();
        });

        $('#ShipToAddress, #ShipToCity, #ShipToContactNumber, #ShipToPlaceOfSupply').show();
        $('#ShipToEdit i').removeClass('fa-save').addClass('fa-pencil-alt').attr('title', 'Edit Shipping Address');

        isShipToEditing = false;
    }
});

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
                <lable class="outwardFabricId d-none"></lable>
                <select class="form-control FabricSelect" id="Fabric_${uid}" name="Fabric_${uid}">
                    ${defaultOption}${FabricTypeSelectOptions}
                </select>
            </td> 
            <td data-id="">
                 <lable class="OutwardFabricProcessMappingId d-none"></lable>
                 <select multiple class="select2 Process" data-coreui-search="true" id="Process_${uid}" name="Process_${uid}" required>
                 </select>
            </td> 
            <td><input type="text" class="form-control DiaInput" id="Dia_${uid}" name="Dia_${uid}" placeholder="Dia" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td> 
            <td><input type="text" class="form-control GsmInput" id="Gsm_${uid}" name="Gsm_${uid}" placeholder="GSM" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td> 
            <td><input type="text" class="form-control QtyInput" id="Qty_${uid}" name="Qty_${uid}" placeholder="Qty" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td> 
            <td><input type="text" class="form-control RollsInput" id="Rolls_${uid}" name="Rolls_${uid}" placeholder="No. of Rolls" required oninput="Common.allowOnlyNumberLength(this,3)" ></td> 
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

    bindDropDownWidth("Width_" + uid, "Width", function () {
        $("#Width_" + uid).val(2).trigger("change");
    });

    Common.bindDropDownMulti("Process_" + uid, 'ProcessType');

    $("#AddItemButtonRow").before(html);

    $("#Process_" + uid).select2({
        theme: 'bootstrap4',
        placeholder: '-- Select Process --',
        allowClear: true,
        closeOnSelect: false,
        width: 'style',
    });

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
            <td><lable class="outwardFabricId d-none"></lable></td> 
            <td data-id="">
                 <lable class="OutwardFabricProcessMappingId d-none"></lable>
                 <select multiple class="select2 Process" data-coreui-search="true" id="Process_${uid}" name="Process_${uid}" required>
                 </select>
            </td> 
            <td><input type="text" class="form-control DiaInput" id="Dia_${uid}" name="Dia_${uid}" placeholder="Dia" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td>
            <td><input type="text" class="form-control GsmInput" id="Gsm_${uid}" name="Gsm_${uid}" placeholder="GSM" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td>
            <td><input type="text" class="form-control QtyInput" id="Qty_${uid}" name="Qty_${uid}" placeholder="Qty" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td>
            <td><input type="text" class="form-control RollsInput" id="Rolls_${uid}" name="Rolls_${uid}" placeholder="No. of Rolls" required oninput="Common.allowOnlyNumberLength(this,3)" ></td> 
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

    bindDropDownWidth("Width_" + uid, "Width", function () {
        $("#Width_" + uid).val(2).trigger("change");
    });

    Common.bindDropDownMulti("Process_" + uid, 'ProcessType');

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
    $("#OutWardTableBody .dynamic-item-row").each(function (i) {

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

    // Handling Alt + p
    if (event.altKey && event.key === 'p') {
        event.preventDefault();
        $('#BtnSavePreviewbtn').click();
    }

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

//-----------------------------------------------------------------------------Top Static Column-------------------------------------------------------------/
function ShipFromAddress(DataSet) {
    var data = JSON.parse(DataSet.data);
    $("#ShipFromColumn #ShipFromAddress").text(data[0][0].PlantAddress || '');
    $("#ShipFromColumn #ShipFromContactNumber").text(data[0][0].PlantContactNo || '');
    $("#ShipFromColumn #ShipFromState").text(data[0][0].PlantState);

    var city = data[0][0].PlantCity || '';
    var zipCode = data[0][0].PlantZipCode || '';

    var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
    $("#ShipFromColumn #ShipFromCity").text(cityName || '');
}

function ShipFromAddressClear() {
    $("#ShipFromColumn #ShipFromAddress").text('');
    $("#ShipFromColumn #ShipFromCity").text('');
    $("#ShipFromColumn #ShipFromContactNumber").text('');
    $("#ShipFromColumn #ShipFromState").text('');
}

function ShipToAddress(DataSet) {
    var data = JSON.parse(DataSet.data);
    $("#ShipToColumn #ShipToAddress").text(data[0][0].Address || '');
    $("#ShipToColumn #ShipToCity").text(data[0][0].City || '');
    $("#ShipToColumn #ShipToContactNumber").text(data[0][0].ContactNumber || '');
    $("#ShipToColumn #ShipToPlaceOfSupply").text(data[0][0].State || '');

    $('.ShipTo-edit').show();
}

function ShipToAddressClear() {
    $("#ShipToColumn #ShipToAddress").text('');
    $("#ShipToColumn #ShipToCity").text('');
    $("#ShipToColumn #ShipToContactNumber").text('');
    $("#ShipToColumn #ShipToPlaceOfSupply").text('');
    $('#ShipToAddress, #ShipToCity, #ShipToContactNumber, #ShipToPlaceOfSupply').show();
    $('#edit_ShipToAddress, #edit_ShipToCity, #edit_ShipToContactNumber, #edit_ShipToPlaceOfSupply').hide();
    $('#ShipToEdit i').removeClass('fa-save').addClass('fa-pencil-alt').attr('title', 'Edit Shipping Address');
    $('.ShipTo-edit').hide();
}



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

//------------------------------Attachment------------------------

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "OutWard",
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
            ModuleName: "OutWard",
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