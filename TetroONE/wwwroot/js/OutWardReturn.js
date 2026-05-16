var PlantMappingId = 0;
var OutWardReturnId = 0;
var FabricTypeDropdown = [];
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();

$(document).ready(async function () {

    $('#OutwardReturnNo').prop('disabled', false);

    Common.bindDropDown('ShipToId', 'Client');
    Common.bindDropDown('OutWardBy', 'SampleReceivedBy');
    Common.bindDropDown('ShipFromId', 'Plant');
    Common.bindDropDown('OutWardStatus', 'InWardReturnStatus');

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var fabricTypeDropdown = await Common.bindDropDownSync('FabricType');
    FabricTypeDropdown = JSON.parse(fabricTypeDropdown);

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

        Common.ajaxCall("GET", "/OutWardReturn/GetInwardReturn", { PlantId: parseInt(PlantMappingId), InwardReturnId: null, FromDate: fnData.startDate.toISOString(), ToDate: toDate.toISOString() }, GetOutwardReturnSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');

        const toDate = new Date(fnData.endDate);
        toDate.setDate(toDate.getDate() + 1);

        Common.ajaxCall("GET", "/OutWardReturn/GetInwardReturn", { PlantId: parseInt(PlantMappingId), InwardReturnId: null, FromDate: fnData.startDate.toISOString(), ToDate: toDate.toISOString() }, GetOutwardReturnSuccess, null);
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
            Common.ajaxCall("GET", "/OutWardReturn/GetInwardReturn", { PlantId: parseInt(PlantMappingId), InwardReturnId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetOutwardReturnSuccess, null);
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
        Common.ajaxCall("GET", "/OutWardReturn/GetInwardReturn", { PlantId: parseInt(PlantMappingId), InwardReturnId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardReturnSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/OutWardReturn/GetInwardReturn", { PlantId: parseInt(PlantMappingId), InwardReturnId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardReturnSuccess, null);


    $(document).on('click', '#AddOutWardReturn', function () {

        $('.dynamic-item-row').remove();
        $('.dynamic-item-row_Second').remove();

        duplicateFabric();
        ShipToAddressClear();
        ShipFromAddressClear();
        $('#ShipToId').prop('disabled', true);
        $('#ShipFromId').prop('disabled', true);

        $('#OutwardNo').prop('disabled', false);

        $('#ModalHeading').text('OutWard Return Details');
        $("#BtnSavePreviewbtn span:first").text("Save & Print");
        $("#BtnSave span:first").text("Save");

        OutWardReturnId = 0;
        deletedFiles = [];
        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();
        $('.Status-Div').hide();
        $('#AddNotesText').val('');

        $('#BtnSavePreviewbtn').hide();
        $('#BtnSaveEPSONbtn').hide();

        $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        $('#AddAttachLable, #AddNotesLable').show();
        $('#NoofFabric, #TotalInward, #TotalPro, #TotalQty, #TotalInwardRet, #TotalReturn, #TotalRolls').val('');

        Common.removevalidation('TopStatic');
        Common.removevalidation('FormShipping');
        Common.removevalidation('FormShipTo');
        Common.removevalidation('FormStatus');

        Common.bindDropDown('InwardNo', 'ReturnInwardNoInsert');

        Common.ajaxCall("GET", "/Common/GetAutoGenerate", { ModuleName: 'InwardReturn', PlantId: PlantMappingId }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                $('#OutwardReturnNo').val(data[0][0].InwardReturnNo);
            }
        });

        var currentDate = new Date().toISOString().slice(0, 10);
        $('#OutwardReturnDate').attr("max", currentDate);
        $('#OutwardReturnDate').val(currentDate);

        $('#OutWardBy').val(LoginUserId);

        $('#emptyDiv').removeClass('col-lg-2 col-md-2 col-6').addClass('col-lg-4 col-md-4 col-6');
        $('#OutWardStatusIdDiv').hide();
        $('#OutWardTo').empty().append($('<option>', { value: '', text: '--Select--', }));

        $('.modal-body').animate({ scrollTop: 0 }, 300);
        $('.ShipTo-edit').hide();

        $('#ProductionPlanTopHeadbind, #OutWardTableBody, #FotterDiv .DynmicTableRow').css({
            'pointer-events': 'auto',
            'opacity': 1
        });
        $('#BtnSave').show();

        $('#OutWardReturnModal').show();
    });

    $(document).on('click', '#BtnCancel, #OutWardReturnClose', function () {
        $('#OutWardReturnModal').hide();
    });

    $(document).on('click', '.btn-edit', async function () {
        OutWardReturnId = $(this).data('id');

        $('.dynamic-item-row').remove();
        $('.dynamic-item-row_Second').remove();

        ShipToAddressClear();
        ShipFromAddressClear();
        $('#ShipToId').prop('disabled', false);
        $('#ShipFromId').prop('disabled', false);

        $('#OutwardNo').prop('disabled', true);

        //$('#ShipToId').empty().append($('<option>', { value: '', text: '--Select--', }));
        $('#OutWardTo').empty().append($('<option>', { value: '', text: '--Select--', }));
        $('#ModalHeading').text('Edit OutWard Return Details');
        $("#BtnSavePreviewbtn span:first").text("Update & Print");
        $("#BtnSave span:first").text("Update");

        $('#emptyDiv').removeClass('col-lg-4 col-md-4 col-6').addClass('col-lg-2 col-md-2 col-6');
        $('#OutWardStatusIdDiv').show();
        $('#BtnSave').show();

        $('#BtnSavePreviewbtn').show();
        $('#BtnSaveEPSONbtn').show();

        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        $('.ShipTo-edit').show();

        $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        $('#AddAttachLable, #AddNotesLable').show();
        $('#NoofFabric, #TotalInward, #TotalPro, #TotalQty, #TotalInwardRet, #TotalReturn, #TotalRolls').val('');

        $('.modal-body').animate({ scrollTop: 0 }, 300);
        $('.Status-Div').show();

        const activityResponse = await ajaxPromise("GET", "/Common/ActivityHistoryDetails", {
            ModuleName: "InwardReturn",
            ModuleId: OutWardReturnId
        });
        StatusActivitySuccess(activityResponse);

        Common.ajaxCall("GET", "/OutWardReturn/GetInwardReturn", { PlantId: parseInt(PlantMappingId), InwardReturnId: parseInt(OutWardReturnId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwarReturndNotNullSuccess, null);
        $('#OutWardReturnModal').show();
    });

    $(document).on('change', '#OutWardTo', function () {
        var $thisVal = $(this).val();
        var $InwardNoVal = $('#InwardNo').val();
        ShipToAddressClear();

        if ($thisVal !== "" && $InwardNoVal !== "") {
            var EditData = { MasterInfoId: parseInt($InwardNoVal), ModuleName: 'InwardClientDetail' }
            Common.ajaxCall("POST", "/Common/GetDropDownNotNull", JSON.stringify(EditData), function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    $('#ShipToId').val(data[0][0].ClientId).trigger('change');
                    $('#ShipFromId').val(PlantMappingId).trigger('change');
                    $('#ShipFromId').prop('disabled', false);
                }
            });
        }
        else {
            //$('#ShipToId').empty().append($('<option>', { value: '', text: '--Select--', })); 
            $('#ShipFromId, #ShipToId').val('').trigger('change');
            $('#ShipToId').prop('disabled', true);
            $('#ShipFromId').prop('disabled', true);
            $('.ShipTo-edit').hide();
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
            if ($OutwardTypeVal == '2') {
                $('.ShipTo-edit').show();
            } else {
                $('.ShipTo-edit').hide();
            }
            var ModuleName = "";
            //$OutwardTypeVal == "1" ? ModuleName = 'Client' : ModuleName = 'Job';
            var EditData = { ModuleName: 'Client', ModuleId: parseInt($thisVal) }
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

    $(document).on('change', '#InwardNo', function () {
        $('.dynamic-item-row').remove();

        var $thisVal = $(this).val();
        if ($thisVal != "") {
            Common.bindDropDown('OutWardTo', 'OutWardType');
            var EditData = { MasterInfoId: parseInt($thisVal), ModuleName: 'InwardReturnStock' }
            Common.ajaxCall("POST", "/Common/GetDropDownNotNull", JSON.stringify(EditData), function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    OutWardReturnRows = data[0];
                    OutWardReturnBinding(OutWardReturnRows);
                }
            });
        }
        else {
            $('#OutWardTo').val('').trigger('change');
            duplicateFabric();
            $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
            $('#AddNotesLable, #AddAttachLable').show();
            $('#OutWardTo').empty().append($('<option>', { value: '', text: '--Select--', }));
        }
    });

    $(document).on('click', '#BtnSave', function () {

        saveOutward(function () {
            $('#OutWardReturnModal').hide();
            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall("GET", "/OutWardReturn/GetInwardReturn", { PlantId: parseInt(PlantMappingId), InwardReturnId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardReturnSuccess, null);
        });
    });

    function saveOutward(callback, options = {}) {

        const showSuccessMsg = options.showSuccessMsg !== false; // default true

        if ($(".ShipToedit-icon i.fas.fa-save:visible").length > 0) {
            Common.warningMsg('Please Save the Ship To Address before Proceeding.');
            return;
        }

        let isValid = true;

        $('input[id^="ReturnQty_"]').each(function () {
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

        if (!$("#TopStatic").valid() || !$("#FormShipping").valid() || !$("#FormShipTo").valid() || !$("#TableInputs").valid() || !$("#FormStatus").valid()) {
            return;
        }

        $('#loader-pms').show();
        getExistFiles();

        /* ================= STATIC DATA ================= */
        var objvalue = {
            InwardReturnId: OutWardReturnId > 0 ? parseInt(OutWardReturnId) : null,
            InwardReturnDate: $('#OutwardReturnDate').val() || null,
            InwardReturnNo: $('#OutwardReturnNo').val() || null,
            InwardReturnBy: parseInt($('#OutWardBy').val()) || null,
            PackingSlipNo: $('#PackingSlipNo').val() || null,
            ShipFrom: $('#ShipFromId').val() || null,
            ShipTo: $('#ShipToId').val() || null,
            ShipToAddress: $('#ShipToAddress').text() || null,
            ShipToCity: $('#ShipToCity').text() || null,
            ShiptoMobileNo: $('#ShipToContactNumber').text() || null,
            ShipToPlaceOfSupply: $('#ShipToPlaceOfSupply').text() || null,
            NoofFabric: parseInt($('#NoofFabric').val()) || null,
            TotalReturnQty: parseFloat($('#TotalReturn').val()) || null,
            TotalRolls: parseFloat($('#TotalRolls').val()) || null,
            Notes: $('#AddNotesText').val() || null,
            VehicleNo: $('#VehicleNO').val() || null,
            DriverName: $('#DriverName').val() || null,
            InwardId: parseInt($('#InwardNo').val()) || null,
            PlantId: parseInt(PlantMappingId),
            ReturnStatusId: parseInt($('#OutWardStatus').val()) || null,
            TotalInwardQty: parseFloat($('#TotalInward').val()) || null,
            TotalOutwardQty: parseFloat($('#TotalQty').val()) || null,
            OutWardTo: parseInt($('#OutWardTo').val()) || null,
        };

        /* ================= FABRIC & PROCESS ================= */
        var FabricMapping = [];

        $("#OutWardTableBody .dynamic-item-row").each(function () {
            let row = $(this);
            FabricMapping.push({
                InwardReturnFabricId: row.find(".outwardFabricId").text().trim() ? parseInt(row.find(".outwardFabricId").text().trim()) : null,
                FabricTypeId: row.find(".FabricSelect").val() ? parseInt(row.find(".FabricSelect").val()) : null,
                Dia: parseFloat(row.find(".DiaInput").val()) || null,
                GSM: parseFloat(row.find(".GsmInput").val()) || null,
                NoOfRolls: parseInt(row.find(".RollsInput").val()) || null,
                InwardQty: parseFloat(row.find('input[id^="InwardQty_"]').val()) || null,
                OutwardQty: parseFloat(row.find('input[id^="OutwardQty_"]').val()) || null,
                ReturnQty: parseFloat(row.find('input[id^="ReturnQty_"]').val()) || null,
                ProQty: parseFloat(row.find('input[id^="ProQty_"]').val()) || null,
                InwardRTNQty: parseFloat(row.find('input[id^="InwardRTNQty_"]').val()) || null,
            });
        });

        formDataMultiple.append("OutwardReturnStaticData", JSON.stringify(objvalue));
        formDataMultiple.append("OutwardReturnFabricDetails", JSON.stringify(FabricMapping));
        formDataMultiple.append("Exist", JSON.stringify(existFiles));
        formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));

        $.ajax({
            type: "POST",
            url: "/OutWardReturn/InsertUpdateOutwardReturnDetails",
            data: formDataMultiple,
            contentType: false,
            processData: false,
            success: function (response) {

                $('#loader-pms').hide();

                if (response.status) {
                    formDataMultiple = new FormData();

                    if (showSuccessMsg) {
                        Common.successMsg(response.message);
                    }

                    if (callback) {
                        var data = JSON.parse(response.data);
                        OutWardId = data[0][0].OutWardId;
                        callback(data[0][0].OutWardId);
                    }

                } else {
                    Common.errorMsg(response.message);
                }
            },
            error: function () {
                $('#loader-pms').hide();
                Common.errorMsg("Save failed");
            }
        });
    }

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var InWardReturnId = $(this).data('id');
            Common.ajaxCall("GET", "/OutWardReturn/DeleteInWardReturnDetails", { InWardReturnId: parseInt(InWardReturnId) }, function (response) {
                if (response.status) {
                    Common.successMsg(response.message);

                    var fnData = Common.getDateFilter('dateDisplay2');
                    Common.ajaxCall("GET", "/OutWardReturn/GetInwardReturn", { PlantId: parseInt(PlantMappingId), InwardReturnId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetOutwardReturnSuccess, null);
                }
            }, null);
        }
    });

    $.getJSON("https://api.ipify.org?format=json", function (data) {
        console.log("Your IP:", data.ip);
    });

    $(document).on('click', '#BtnSaveEPSONbtn', function () {
        $('#loader-pms').show();

        $.ajax({
            type: 'GET',
            url: '/EPSON/PrintDotMatrix',
            data: {
                ModuleId: parseInt(OutWardReturnId),
                ModuleName: "InwardReturn EPSON"
            },
            success: function (res) {
                if (res.success) {
                    setTimeout(function () {
                        Common.successMsg("EPSON FX-2175 is Printing...");
                        $('#loader-pms').hide();
                    }, 5000);
                } else {
                    $('#loader-pms').hide();
                    Common.errorMsg(res.message);
                }
            }
        });
    });

    $(document).on('click', '#BtnSavePreviewbtn', function () {
        saveOutward(function (outwardId) {
            $('#loader-pms').show();

            if (!outwardId) {
                $('#loader-pms').hide();
                Common.errorMsg("Outward ID not found");
                return;
            }

            $.ajax({
                type: 'GET',
                url: '/Productions/OutwardPrint',
                data: {
                    ModuleId: parseInt(OutWardReturnId),
                    NoOfCopies: 1,
                    printType: "Print"
                },
                xhrFields: { responseType: 'blob' },
                success: function (response) {

                    var blob = new Blob([response], { type: 'application/pdf' });
                    var blobUrl = URL.createObjectURL(blob);

                    var newTab = window.open();
                    if (newTab) {
                        newTab.document.write(`
                            <html>
                            <head><title>Outward Return Preview</title></head>
                            <body style="margin:0;">
                                <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%" />
                            </body>
                            </html>
                        `);
                        newTab.document.close();
                    }

                    $('#loader-pms').hide();
                },
                error: function () {
                    $('#loader-pms').hide();
                    Common.errorMsg("Preview failed");
                }
            });

        }, {
            showSuccessMsg: false   // ❌ disable save success toast
        });
    });

    $(document).on("input", 'input[id^="ReturnQty_"], input[id^="Rolls_"]', function () {
        calculateTotals();
    });

    $(document).on("click", ".removeRowBtn", function () {
        let rowCount = $("#OutWardTableBody .dynamic-item-row").length;
        if (rowCount <= 1) {
            return;
        }

        $(this).closest("tr").remove();
        updateSerialNumbers();
        calculateTotals();
    });
});

function GetOutwardReturnSuccess(response) {
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
        var html = `<table class="table table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="OutWardReturnTable">
                </table>
            `;
        $('#MainGrid').append(html);

        var columns = Common.bindColumn(data[1], ['InwardReturnId', 'Status_Color']);
        Common.bindTable('OutWardReturnTable', data[1], columns, -1, 'InwardReturnId', '360px', true, access);
    }
}

function GetOutwarReturndNotNullSuccess(response) {
    if (!response.status) return;
    var data = JSON.parse(response.data);

    const header = data[0][0];
    $('#OutwardReturnDate').val(header.Date);
    $('#OutwardReturnNo').val(header.InwardReturnNo);
    $('#PackingSlipNo').val(header.PackingSlipNo);
    $('#NoofFabric').val(header.NoOfFabric);
    $('#TotalQty').val(header.TotalQty);
    $('#TotalRolls').val(header.TotalRolls);
    $('#VehicleNO').val(header.VehicleNo);
    $('#DriverName').val(header.DriverName);
    $('#OutWardStatus').val(header.ReturnStatusId);
    $('#OutWardBy').val(header.InwardReturnBy);

    $('#ShipToId').prop('disabled', true);

    if (![11].includes(header.ReturnStatusId)) {
        $('#BtnSave').show();
        $('#ProductionPlanTopHeadbind, #OutWardTableBody, #FotterDiv .DynmicTableRow').css({
            'pointer-events': 'auto',
            'opacity': 1
        });
    } else {
        $('#BtnSave').hide();
        $('#ProductionPlanTopHeadbind, #OutWardTableBody, #FotterDiv .DynmicTableRow').css({
            'pointer-events': 'none',
            'opacity': 0.9
        });
    }

    //Common.ajaxCall("GET", "/Productions/GetOutWardTypeContactDetails", { OutwardType: parseInt(header.OutWardTo) }, function (responseOutWardType) {
    Common.ajaxCall("POST", "/Common/GetDropDown", JSON.stringify({ MasterInfoId: null, ModuleName: 'ReturnInwardNo' }), function (responseReturnInwardNo) {
        if (responseReturnInwardNo.status) {
            Common.bindDropDownSuccess(responseReturnInwardNo.data, "InwardNo");
            $('#InwardNo').val(header.InwardId);
        }
        Common.ajaxCall("POST", "/Common/GetDropDown", JSON.stringify({ MasterInfoId: null, ModuleName: 'OutWardType' }), function (responseOutwardTo) {
            if (responseOutwardTo.status) {
                Common.bindDropDownSuccess(responseOutwardTo.data, "OutWardTo");
                $('#OutWardTo').val(header.OutWardTo);
            }

            Common.ajaxCall("GET", "/Productions/GetOutWardTypeContactDetails", { OutwardType: parseInt(1) }, function (responseOutWardType) {
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
        }, null);
    }, null);

    Inventory.toggleField(header.Notes, "#AddNotesText", "#AddNotes", "#AddNotesLable", "HideNotesLable");
    Inventory.toggleFieldForAttachment(data[2][0]?.AttachmentId, "#AddAttachLable", "#AddAttachment", "HideAttachlable");
    Inventory.bindAttachments(data[2]);

    // Remove existing dynamic rows
    $('.dynamic-item-row').remove();

    /* ===============================
       RENDER FABRIC ROWS
    =============================== */
    OutWardReturnRows = data[1];
    OutWardReturnBinding(OutWardReturnRows);
}

function OutWardReturnBinding(OutWardReturnRows) {

    OutWardReturnRows.forEach((item, index) => {

        let uid = Math.random().toString(36).substring(2);

        let FabricHTML = `<option value="">--Select--</option>` + FabricTypeDropdown[0].map(f => `<option value="${f.FabricTypeId}" ${f.FabricTypeId == item.FabricTypeId ? 'selected' : ''}> ${f.FabricTypeName}</option>`).join('');

        let html = `
            <tr class="dynamic-item-row" data-id="${uid}">
                <td class="sno"></td> 
                <td>
                    <lable class="outwardFabricId d-none"></lable>
                    <select class="form-control FabricSelect" id="Fabric_${uid}" name="Fabric_${uid}">
                        ${FabricHTML}
                    </select>
                </td> 
                <td><input type="text" class="form-control DiaInput" id="Dia_${uid}" name="Dia_${uid}" placeholder="Dia" value="${item.Dia}" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td> 
                <td><input type="text" class="form-control GsmInput" id="Gsm_${uid}" name="Gsm_${uid}" placeholder="GSM" value="${item.GSM}" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td> 
                <td><input type="text" class="form-control QtyInput" id="InwardQty_${uid}" name="InwardQty_${uid}" value="${Number(item.InwardQty).toFixed(3)}" placeholder="0.00" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td> 
                <td><input type="text" class="form-control QtyInput" id="ProQty_${uid}" name="ProQty_${uid}" value="${Number(item.ProQty).toFixed(3)}" placeholder="0.00" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td> 
                <td><input type="text" class="form-control QtyInput" id="OutwardQty_${uid}" name="OutwardQty_${uid}" value="${Number(item.OutwardQty).toFixed(3)}" placeholder="0.00" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td> 
                <td><input type="text" class="form-control QtyInput" id="InwardRTNQty_${uid}" name="InwardRTNQty_${uid}" value="${Number(item.InwardRTNQty ?? '0.00').toFixed(3)}" placeholder="0.00" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4); validateReturnQty(this)" ></td> 
                <td><input type="text" class="form-control QtyInput" id="ReturnQty_${uid}" name="ReturnQty_${uid}" value="${Number(item.ReturnQty ?? '0.00').toFixed(3)}" placeholder="0.00" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4); validateReturnQty(this)" ></td> 
                <td><input type="text" class="form-control RollsInput" id="Rolls_${uid}" name="Rolls_${uid}" value="${item.NoOfRolls}" placeholder="0" required oninput="Common.allowOnlyNumberLength(this,3)" ></td> 
                <td style="text-align: center;">
                    <button id="dyanmicplusbtn" class="btn AddStockBtn AddFabric d-none" type="button">
                        <i class="fas fa-plus" id="AddButton"></i>
                    </button>
                    <button id="RemoveButton" class="btn DynrowRemove removeRowBtn" type="button">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;

        $("#AddItemButtonRow").before(html);
    });

    /* ===============================
       FINAL UI FIXES
    =============================== */
    updateSerialNumbers();
    refreshProductDropdowns(".FabricSelect");
    calculateTotals();
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
                <lable class="outwardFabricId d-none"></lable>
                <select class="form-control FabricSelect" id="Fabric_${uid}" name="Fabric_${uid}">
                    ${defaultOption}${FabricTypeSelectOptions}
                </select>
            </td> 
            <td><input type="text" class="form-control DiaInput" id="Dia_${uid}" name="Dia_${uid}" placeholder="Dia" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td> 
            <td><input type="text" class="form-control GsmInput" id="Gsm_${uid}" name="Gsm_${uid}" placeholder="GSM" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)"></td> 
            <td><input type="text" class="form-control QtyInput" id="InwardQty_${uid}" name="InwardQty_${uid}" placeholder="0.00" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td> 
            <td><input type="text" class="form-control QtyInput" id="ProQty_${uid}" name="ProQty_${uid}" placeholder="0.00" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td> 
            <td><input type="text" class="form-control QtyInput" id="OutwardQty_${uid}" name="OutwardQty_${uid}" placeholder="0.00" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td> 
            <td><input type="text" class="form-control QtyInput" id="InwardRTNQty_${uid}" name="InwardRTNQty_${uid}" placeholder="0.00" disabled oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4); validateReturnQty(this)" ></td> 
            <td><input type="text" class="form-control QtyInput" id="ReturnQty_${uid}" name="ReturnQty_${uid}" placeholder="0.00" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4); validateReturnQty(this)"></td> 
            <td><input type="text" class="form-control RollsInput" id="Rolls_${uid}" name="Rolls_${uid}" placeholder="0" required oninput="Common.allowOnlyNumberLength(this,3)" ></td> 
            <td style="text-align: center;">
                <button id="dyanmicplusbtn" class="btn AddStockBtn AddFabric d-none" type="button">
                    <i class="fas fa-plus" id="AddButton"></i>
                </button>
                <button id="RemoveButton" class="btn DynrowRemove removeRowBtn" type="button">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

    $("#AddItemButtonRow").before(html);

    updateSerialNumbers();
    refreshProductDropdowns(".FabricSelect");
}

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

function updateSerialNumbers() {
    let count = 0;
    $("#OutWardTableBody .dynamic-item-row").each(function (i) {

        $(this).find(".sno").text(i + 1);
        if ($(this).find("select.FabricSelect").length > 0) {
            count++;
        }
    });

    $("#NoofFabric").val(count);
    //calculateGsmNoOfRollTotal();
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

    if (event.altKey && event.key === 'e') {
        event.preventDefault();
        $('#BtnSaveEPSONbtn').click();
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

/*========================================================Attachment=================================================================*/

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "InwardReturn",
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
            ModuleName: "InwardReturn",
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

/*========================================================End Attachment=================================================================*/

/*========================================================Avoid the Duplicate to select=================================================================*/

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

/*========================================================End Avoid the Duplicate to select=================================================================*/

/*========================================================Update the Address and Name For JobWorker=================================================================*/
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

/*========================================================End Update the Address and Name For JobWorker=================================================================*/

/*========================================================Compare values With OutwardQty and Return Qty=================================================================*/
function validateReturnQty(input) {

    let row = $(input).closest("tr");

    let inwardQty = parseFloat(row.find('input[id^="InwardQty_"]').val()) || 0;
    let outwardQty = parseFloat(row.find('input[id^="OutwardQty_"]').val()) || 0;
    let proQty = parseFloat(row.find('input[id^="ProQty_"]').val()) || 0;
    let inwardRTNQty = parseFloat(row.find('input[id^="InwardRTNQty_"]').val()) || 0;
    let returnQty = parseFloat($(input).val()) || 0;

    // Correct calculation
    let allowedQty = inwardQty - (outwardQty + proQty + inwardRTNQty);

    // Avoid negative values
    if (allowedQty < 0) {
        allowedQty = 0;
    }

    // Validation
    if (returnQty > allowedQty) {

        Common.warningMsg(
            "You can enter only upto " + allowedQty.toFixed(3)
        );

        $(input).val(allowedQty.toFixed(3));
    }
}
/*========================================================End Compare values With OutwardQty and Return Qty=================================================================*/

/*========================================================Calculating the Total Weight=================================================================*/
function calculateTotals() {
    let totalFabric = 0;
    let totalInward = 0;
    let totalOutward = 0;
    let totalReturn = 0;
    let totalRolls = 0;
    let totalPro = 0;
    let totalInwardRTN = 0;

    $("#OutWardTableBody .dynamic-item-row").each(function () {
        totalFabric++;
        totalInward += parseFloat($(this).find('input[id^="InwardQty_"]').val()) || 0;
        totalOutward += parseFloat($(this).find('input[id^="OutwardQty_"]').val()) || 0;
        totalReturn += parseFloat($(this).find('input[id^="ReturnQty_"]').val()) || 0;
        totalPro += parseFloat($(this).find('input[id^="ProQty_"]').val()) || 0;
        totalInwardRTN += parseFloat($(this).find('input[id^="InwardRTNQty_"]').val()) || 0;
        totalRolls += parseInt($(this).find(".RollsInput").val()) || 0;
    });

    $("#NoofFabric").val(totalFabric);
    $("#TotalInward").val(totalInward.toFixed(3));
    $("#TotalQty").val(totalOutward.toFixed(3));
    $("#TotalReturn").val(totalReturn.toFixed(3));
    $("#TotalPro").val(totalPro.toFixed(3));
    $("#TotalInwardRet").val(totalInwardRTN.toFixed(3));
    $("#TotalRolls").val(totalRolls);
}
/*========================================================Calculating the Total Weight=================================================================*/