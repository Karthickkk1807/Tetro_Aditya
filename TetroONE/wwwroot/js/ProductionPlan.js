var ProductionPlanId = 0;
var PlantMappingId = 0;
var titleForHeaderProductTab = "";
var titleForHeaderPopRawMatrialTab = "";
var DyeDropdown = [];
var PreTreatmentChemicalProduct = [];
var AfterTreatmentChemicalProduct = [];
var ItemListAdd = [];
var AlreadyAddedIds = [];
var ProcessTypeDropdown = [];
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();

$(document).ready(async function () {

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    titleForHeaderProductTab = "Production Plan";
    titleForHeaderPopRawMatrialTab = "Pre-Treatment";

    $('.datapiker').show();

    Common.bindDropDownParent('PreparedBy', 'FormStatus', 'ProductionUser');
    Common.bindDropDownParent('ProductionPlanStatusId', 'FormStatus', 'ProductionPlanStatus');
    Common.bindDropDownParent('ColorId', 'TopStatic', 'Color');
    Common.bindDropDownParent('MachineId', 'TopStatic', 'Machine');

    var dyeDropdown = await Common.bindDropDownSync('DyeProduct');
    DyeDropdown = JSON.parse(dyeDropdown);

    var preTreatmentChemicalProduct = await Common.bindDropDownSync('PreTreatmentChemicalProduct');
    PreTreatmentChemicalProduct = JSON.parse(preTreatmentChemicalProduct);

    var afterTreatmentChemicalProduct = await Common.bindDropDownSync('AfterTreatmentChemicalProduct');
    AfterTreatmentChemicalProduct = JSON.parse(afterTreatmentChemicalProduct);

    var processTypeDropdown = await Common.bindDropDownSync('ProcessType');
    ProcessTypeDropdown = JSON.parse(processTypeDropdown);

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
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
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
            Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetProductionPlanSuccess, null);
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
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);

    $(document).on('click', '#AddProductionPlan', function () {
        $('.Status-Div').hide();

        Common.removevalidation('TopStatic');
        Common.removevalidation('FormStatus');
        $('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable, #MLRWaterLevelDiv').hide();
        $('#AddAttachLable, #AddNotesLable').show();

        $('#SaveProductionPlan').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        $('.AddedRow').remove();
        $('.RowOfChemical-After').remove();
        $('.RowOfChemical-Pre').remove();
        duplicateRowChemicalPre();
        duplicateRowChemicalAfter();
        $('.RawMetarial').remove();
        duplicateRowRawMetarial();
        $('#ChemicalDynamic-Pre').show();
        $('#ChemicalDynamic-After').hide();

        $("#ProductionPlanSaveBtn span:first").text("Save");
        $("#ProductionPlansaveprintbtn span:first").text("Save & Print");

        //$('#emptyDiv').removeClass('col-lg-3 col-md-3 col-6').addClass('col-lg-5 col-md-5 col-6');
        //$('#ProductionPlanStatusIdDiv').hide();

        $('#LoadingDateTimeDiv').hide();
        $('#UnLoadingDateTimeDiv').hide();
        //$('#SubtotalRow').hide();

        $("#QRCode").html("");
        $("#AddNotesText").val('');

        ProductionPlanId = 0;
        AlreadyAddedIds = [];
        ItemListAdd = [];
        deletedFiles = [];
        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        //const today = new Date().toISOString().split('T')[0];
        //$("#BatchDate").val(today);

        const now = new Date();

        // Format as "YYYY-MM-DD HH:MM"
        const formattedDateTime = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');

        $("#BatchDate").val(formattedDateTime);

        $("#PreparedBy").val(LoginUserId);
        //$('#MachineId').prop('disabled', true);

        Common.ajaxCall("GET", "/Common/GetAutoGenerate", { ModuleName: 'ProductionPlan', PlantId: PlantMappingId }, function (response) {
            Common.AutoGenerateNumberGet(response, "BatchNo", "ProductionNo");
        });

        $('#AddAttachment, #AddNotes').show();
        $('#AddAttachLable, #AddNotesLable, #HideAttachlable, #HideNotesLable').hide();

        $('.modal-body').animate({ scrollTop: 0 }, 300);
        $('#ProductionPlanSaveBtn').show();
        $('#ShippingColumn, #MainProductionPlanPopTable, .DynmicTableRow, #SubtotalRow').css({
            'pointer-events': 'auto',
            'opacity': 1
        });
        $('#PreparedBy').prop('selectedIndex', 1);
        $('#ProductionPlanPreviewbtn').hide();
        $('#ProductionPlanModal').show();
    });

    $(document).on('click', '.btn-edit', function () {
        ProductionPlanId = $(this).data('id');

        Common.removevalidation('TopStatic');
        Common.removevalidation('FormStatus');

        //$('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        //$('#AddAttachLable, #AddNotesLable').show();
        $('#AddAttachment, #AddNotes, #MLRWaterLevelDiv').show();
        $('#AddAttachLable, #AddNotesLable, #HideAttachlable, #HideNotesLable').hide();

        $("#ProductionPlanSaveBtn span:first").text("Update");
        $("#ProductionPlansaveprintbtn span:first").text("Update & Print");

        $('.Status-Div').show();
        $('#SaveProductionPlan').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');

        AlreadyAddedIds = [];
        deletedFiles = [];
        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        $('.AddedRow').remove();
        $('.RowOfChemical-After').remove();
        $('.RowOfChemical-Pre').remove();
        $('.RawMetarial').remove();
        $('#ChemicalDynamic-Pre').show();
        $('#ChemicalDynamic-After').hide();

        //$('#emptyDiv').removeClass('col-lg-5 col-md-5 col-6').addClass('col-lg-3 col-md-3 col-6');
        //$('#ProductionPlanStatusIdDiv').show();

        $('#LoadingDateTimeDiv').show();
        $('#UnLoadingDateTimeDiv').show();
        //$('#SubtotalRow').show();

        $("#QRCode").html("");

        //const today = new Date().toISOString().split('T')[0];
        //$("#BatchDate").val(today);
        //$('#MachineId').prop('disabled', false);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: parseInt(ProductionPlanId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanNotNullSuccess, null);

        $('.modal-body').animate({ scrollTop: 0 }, 300);
        $('#ProductionPlanModal').show();
    });

    $(document).on('click', '#ProductionPlanClose, #ProductionPlanCancelBtn', function () {
        $('#ProductionPlanModal').hide();
    });

    $(document).on('input', '#MLR', function () {
        var $thisVal = $(this).val();
        if ($thisVal != "") {
            CalcuWetreLevel();
        } else {
            $('#WaterLevel').val('');
        }
    });

    $(document).on('click', '#MainTab .navbar-tab', function () {
        $('#tableFilter').val('');
        titleForHeaderProductTab = $(this).text().trim();
        $('.navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderProductTab) {
                $(this).addClass('active');
            }
        });
        if (titleForHeaderProductTab == "Production Plan") {
            $('.datapiker').show();
            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
        }
        else if (titleForHeaderProductTab == "Grey Fabric Stock Info") {
            $('.datapiker').hide();
            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(2), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
        }
    });

    $(document).on('click', '#ChemicalModal .navbar-tab', function () {
        $('#tableFilter').val('');
        titleForHeaderPopRawMatrialTab = $(this).text().trim();
        $('.navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderPopRawMatrialTab) {
                $(this).addClass('active');
            }
        });
        if (titleForHeaderPopRawMatrialTab == "Pre-Treatment") {
            $('#ChemicalDynamic-Pre').show();
            $('#ChemicalDynamic-After').hide();
        }
        else if (titleForHeaderPopRawMatrialTab == "After-Treatment") {
            $('#ChemicalDynamic-Pre').hide();
            $('#ChemicalDynamic-After').show();
        }
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

    $(document).on('click', '#ProductionPlanAddItemClose', function () {
        $('#ProductionPlanAddItemModal').hide();
    });

    $(document).on("input", ".qty", function () {
        let total = 0;
        $(".qty").each(function () {
            total += parseFloat($(this).val()) || 0;
        });

        $("#TotalWeight").val(total);
        CalcuWetreLevel();
    });

    $(document).on('click', '#ProductionPlanSaveBtn', function () {

        var TableLenthDynamicRow = $('.AddedRow').length;
        if (TableLenthDynamicRow == 0) {
            Common.warningMsg('Choose Atleast One Product');
            $('#loader-pms').hide();
            return false;
        }

        if ($("#TopStatic").valid() && $("#TableInputs").valid() && $("#FormStatus").valid()) {
            $('#loader-pms').show();
            getExistFiles();

            var objvalue = {
                ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null,
                PlantId: parseInt(PlantMappingId),
                ProductionNo: $('#BatchNo').val() || null,
                ProductionDate: $('#BatchDate').val() || null,
                TotalWeight: parseFloat($('#TotalWeight').val()) || null,
                ColorId: parseInt($('#ColorId').val()) || null,
                MachineId: parseInt($('#MachineId').val()) || null,
                MLR: parseInt($('#MLR').val()) || null,
                WaterLevel: parseInt($('#WaterLevel').val()) || null,
                LoadingDateTime: $('#LoadingDateTime').val() || null,
                UnLoadingDateTime: $('#UnLoadingDateTime').val() || null,
                ProductionPlanStatusId: parseInt($('#ProductionPlanStatusId').val()) || null,
                Comments: $('#AddNotesText').val() || null,
                PreparedBy: parseInt($('#PreparedBy').val()) || null
            };

            var ProductionPlanFabricDetails = [];
            var ProductionPlanFabricProcessMappingDetails = [];

            $('#ProductionPlanProductTablebody .AddedRow').each(function (rowIndex) {

                var $rowTable = $(this);
                var productionplanfabricid = $rowTable.data('productionplanfabricid-id');
                var inwardFabricId = $rowTable.data('inwardfabricid-id');

                var FabricDetails = {
                    ProductionPlanFabricId: productionplanfabricid ? parseInt(productionplanfabricid) : null,
                    InwardId: parseInt($rowTable.find('.lotNo').parent().data('id')) || null,
                    InwardFabricId: inwardFabricId ? parseInt(inwardFabricId) : null,
                    FabricTypeId: parseInt($rowTable.find('.fabricType').parent().data('id')) || null,
                    ColorId: parseInt($rowTable.find('.colour').parent().data('id')) || null,
                    Quantity: Common.parseFloatValue($rowTable.find('.qty').val()) || null,
                    ProcessCount: Common.parseFloatValue($rowTable.find('.processRoute').val()) || null,
                    Comments: $rowTable.find('.Remarks').val() || null,
                    ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null
                };

                ProductionPlanFabricDetails.push(FabricDetails);

                var selectedProcessIds = $rowTable.find('.Process').val() || [];
                selectedProcessIds.forEach(pid => {
                    var FabricProcessMappingDetails = {
                        ProductionPlanFabricProcessMappingId: $rowTable.data('productionplanfabricprocessmappingid-id') ? parseInt($rowTable.data('productionplanfabricprocessmappingid-id')) : null,
                        ProductionPlanFabricId: productionplanfabricid ? parseInt(productionplanfabricid) : null,
                        RowNo: rowIndex + 1,
                        ProcessTypeId: parseInt(pid)
                    };
                    ProductionPlanFabricProcessMappingDetails.push(FabricProcessMappingDetails);
                });
            });

            var ProductionPlanDyeRequirementDetails = [];
            var ClosestDiv = $('#RawMaterialDynamic .RawMetarial');

            $.each(ClosestDiv, function (index, values) {
                var ProductionPlanDyeRequirementId = $(values).find('.ProductionPlanDyeRequirementId').text() || null;
                var DyeId = $(values).find('.ProductIdRawMaterial').val() || null;
                var PercentageOfDye = $(values).find('.Dye').val() || null;
                var TotalQty = $(values).find('.TotalDyeQty').val() || null;
                var DyeType = $(values).find('.DysType').val() || null;

                ProductionPlanDyeRequirementDetails.push({
                    ProductionPlanDyeRequirementId: parseInt(ProductionPlanDyeRequirementId) || null,
                    DyeId: parseInt(DyeId) || null,
                    DyeType: parseInt(DyeType) || null,
                    PercentageOfDye: parseFloat(PercentageOfDye) || null,
                    TotalQty: parseFloat(TotalQty) || null,
                    ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null
                });
            });

            var ProductionPlanChemicalRequirementDetails = [];

            // ---------- PRE-TREATMENT (ProcessType = 1) ----------
            $('#ChemicalDynamic-Pre .RowOfChemical-Pre').each(function () {
                var $row = $(this);

                ProductionPlanChemicalRequirementDetails.push({
                    ProductionPlanChemicalRequirementId: parseInt($row.find('.ProductionPlanChemicalRequirementId').text()) || null,
                    ProcessType: 1,
                    ChemicalId: parseInt($row.find('.ProductIdPre').val()) || null,
                    ChemicalType: parseInt($row.find('.DysType').val()) || null,
                    GPL: parseFloat($row.find('input[id^="GPL"]').val()) || null,
                    TotalQty: parseFloat($row.find('input[id^="Qty"]').val()) || null,
                    ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null
                });
            });

            // ---------- AFTER-TREATMENT (ProcessType = 2) ----------
            $('#ChemicalDynamic-After .RowOfChemical-After').each(function () {
                var $row = $(this);

                ProductionPlanChemicalRequirementDetails.push({
                    ProductionPlanChemicalRequirementId: parseInt($row.find('.ProductionPlanChemicalRequirementId').text()) || null,
                    ProcessType: 2,
                    ChemicalId: parseInt($row.find('.ProductIdAfter').val()) || null,
                    ChemicalType: parseInt($row.find('.DysType').val()) || null,
                    GPL: parseFloat($row.find('input[id^="GPL"]').val()) || null,
                    TotalQty: parseFloat($row.find('input[id^="Qty"]').val()) || null,
                    ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null
                });
            });

            formDataMultiple.append("ProductionPlanStaticData", JSON.stringify(objvalue));
            formDataMultiple.append("ProductionPlanFabricDetails", JSON.stringify(ProductionPlanFabricDetails));
            formDataMultiple.append("ProductionPlanFabricProcessMappingDetails", JSON.stringify(ProductionPlanFabricProcessMappingDetails));
            formDataMultiple.append("ProductionPlanDyeRequirementDetails", JSON.stringify(ProductionPlanDyeRequirementDetails));
            formDataMultiple.append("ProductionPlanChemicalRequirementDetails", JSON.stringify(ProductionPlanChemicalRequirementDetails));
            formDataMultiple.append("Exist", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));

            $.ajax({
                type: "POST",
                url: "/Productions/InsertUpdateProductionPlanDetails",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        formDataMultiple = new FormData();
                        $('#loader-pms').hide();
                        Common.successMsg(response.message);
                        $('#ProductionPlanModal').hide();
                        var fnData = Common.getDateFilter('dateDisplay2');
                        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
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
            var ProductionPlanId = $(this).data('id');
            Common.ajaxCall("GET", "/Productions/DeleteProductionPlanDetails", { ProductionPlanId: parseInt(ProductionPlanId) }, function (response) {
                if (response.status) {
                    Common.successMsg(response.message);

                    var fnData = Common.getDateFilter('dateDisplay2');
                    Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
                }
            }, null);
        }
    });

    $("#LoadingDateTime").on("change", function () {
        let loadTime = $(this).val();
        let unloadPicker = $("#UnLoadingDateTime")[0]._flatpickr;
        unloadPicker.set("minDate", loadTime);
        $("#UnLoadingDateTime").val('');
    });
});

function CalcuWetreLevel() {
    var $thisVal = $('#MLR').val();
    if ($thisVal != "") {
        var MLR = parseFloat($('#MLR').val());
        var totalWeight = parseFloat($('#TotalWeight').val()) || 0;
        var Values = MLR * totalWeight
        $('#WaterLevel').val(Values.toFixed(2));
    }
}

function GetProductionPlanSuccess(response) {
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
        var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="ProductionPlanTable">
                </table>
            `;
        $('#MainGrid').append(html);

        var columns = Common.bindColumn(data[1], ['ProductionPlanId', 'Status_Color', 'StatusColor']);
        if (titleForHeaderProductTab == "Production Plan") {
            bindTable('ProductionPlanTable', data[1], columns, -1, 'ProductionPlanId', '350px', true, access);
            $(".dataTables_scrollBody").css("max-height", "350px");
        } else {
            bindTable('ProductionPlanTable', data[1], columns, -1, 'ProductionPlanId', '350px', false, access);
            $(".dataTables_scrollBody").css("max-height", "315px");
        }
    }
}

async function GetProductionPlanNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        const header = data[0][0];
        $('#ColorId').val(header.ColorId);
        $('#AddNotesText').val(header.Comments);
        $('#LoadingDateTime').val(header.LoadingDateTime || '');
        $('#MachineId').val(header.MachineId);
        $('#BatchDate').val(header.ProductionDate);
        $('#BatchNo').val(header.ProductionNo);
        $('#ProductionPlanStatusId').val(header.ProductionPlanStatusId);
        $('#TotalWeight').val(header.TotalWeight);
        $('#UnLoadingDateTime').val(header.UnLoadingDateTime);
        $('#PreparedBy').val(header.PreparedBy);
        $('#MLR').val(header.MLR);
        $('#WaterLevel').val(header.WaterLevel);

        if (header.ProductionPlanStatusId == 3) {
            $('#ProductionPlanSaveBtn').hide();
            $('#ProductionPlanPreviewbtn').show();
            $('#ShippingColumn, #MainProductionPlanPopTable, .DynmicTableRow').css({
                'pointer-events': 'none',
                'opacity': 0.9
            });
            $('#SubtotalRow').css({
                'pointer-events': 'auto',
                'opacity': 1
            });
        } else {
            $('#ProductionPlanSaveBtn').show();
            $('#ProductionPlanPreviewbtn').hide();
            $('#ShippingColumn, #MainProductionPlanPopTable, .DynmicTableRow, #SubtotalRow').css({
                'pointer-events': 'auto',
                'opacity': 1
            });
        }

        if (header.LoadingDateTime == null || header.LoadingDateTime == '') {
            SetDateFroLoadingAndUnLoading();
        }

        Inventory.toggleField(header.Comments, "#AddNotesText", "#AddNotes", "#AddNotesLable", "HideNotesLable");
        Inventory.toggleFieldForAttachment(data[5][0]?.AttachmentId, "#AddAttachLable", "#AddAttachment", "HideAttachlable");
        Inventory.bindAttachments(data[5]);

        if (data[1] && data[1].length > 0) {

            data[1].forEach(item => {

                let numberIncr = Math.random().toString(36).substring(2);

                if (AlreadyAddedIds.includes(item.InwardFabricId.toString())) return;
                AlreadyAddedIds.push(item.InwardFabricId.toString());

                const processes = data[2].filter(p => p.ProductionPlanFabricId == item.ProductionPlanFabricId);
                const selectedProcessIds = processes.map(p => p.ProcessTypeId);

                const processDropdownOptions = ProcessTypeDropdown[0].map(p =>
                    `<option value="${p.ProcessTypeId}" ${selectedProcessIds.includes(p.ProcessTypeId) ? 'selected' : ''}>${p.ProcessTypeName}</option>`
                ).join('');

                const newRow = `
                <tr class="AddedRow" data-productionplanfabricid-id="${item.ProductionPlanFabricId}" data-inwardfabricid-id="${item.InwardFabricId}"> 
                    <td></td> 
                    <td data-id="${item.InwardId}">
                        <input type="text" class="form-control lotNo" value="${item.InwardNo}" disabled>
                    </td> 
                    <td data-id="${item.ColorId}">
                        <input type="text" class="form-control colour" value="${item.ColorName}" disabled>
                    </td> 
                    <td data-id="${item.FabricTypeId}">
                        <input type="text" class="form-control fabricType" value="${item.FabricTypeName}" disabled>
                    </td> 
                    <td><input type="text" class="form-control GSM" value="${item.GSM}" disabled></td>
                    <td><input type="text" class="form-control Width" value="${item.Width}" disabled></td>
                    <td><input type="text" class="form-control qty" value="${item.Quantity || ''}" required oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td> 
                    <td>
                        <select multiple class="form-control Process" id="processRoute${numberIncr}" name="processRoute${numberIncr}">
                            ${processDropdownOptions}
                        </select>
                    </td> 
                    <td>
                        <button class="btn DynremoveBtn DynrowRemove" type="button" data-id="${item.InwardFabricId}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
                `;

                $("#ProductionPlanProductTablebody #AddItemButtonRow").before(newRow);
                $(".Process").select2({
                    theme: 'bootstrap4',
                    placeholder: '-- Select Process --',
                    allowClear: true,
                    closeOnSelect: false,
                    width: 'style',
                });
            });

            RenumberRows();
        }

        if (data[4] && data[4].length > 0 && data[4][0].ProductionPlanChemicalRequirementId != null) {
            // Clear existing rows
            $('#ChemicalDynamic-Pre').html('');
            $('#ChemicalDynamic-After').html('');

            data[4].forEach(item => {
                if (item.ProcessType === 1) {
                    createChemicalRow('Pre', item); // Pre-Treatment
                } else if (item.ProcessType === 2) {
                    createChemicalRow('After', item); // After-Treatment
                }
            });
        } else {
            $('.RowOfChemical-After').remove();
            $('.RowOfChemical-Pre').remove();
            duplicateRowChemicalPre();
            duplicateRowChemicalAfter();
        }

        if (data[3] && data[3].length > 0 && data[3][0].DyeId != null) {
            bindRawMaterialRows(data[3]);
        } else {
            $('.RawMetarial').remove();
            duplicateRowRawMetarial();
        }

        $("#QRCode").html("");

        let qrData = {
            BatchNo: $("#BatchNo").val(),
            BatchDate: $("#BatchDate").val(),
            TotalWeight: $("#TotalWeight").val(),
            ColorId: $("#ColorId").val(),
            MachineId: $("#MachineId").val(),
            LoadingDateTime: ProductionPlanId === 0 ? '' : $("#LoadingDateTime").val(),
            UnLoadingDateTime: ProductionPlanId === 0 ? '' : $("#UnLoadingDateTime").val()
        };

        new QRCode(document.getElementById("QRCode"), {
            text: JSON.stringify(qrData),
            width: 120,
            height: 120
        });

        $('#AddAttachment, #AddNotes').show();
        $('#AddAttachLable, #AddNotesLable, #HideAttachlable, #HideNotesLable').hide();

        const activityResponse = await ajaxPromise("GET", "/Common/ActivityHistoryDetails", {
            ModuleName: "ProductionPlan",
            ModuleId: parseInt(ProductionPlanId)
        });
        StatusActivitySuccess(activityResponse);
    }
}

function bindRawMaterialRows(rawArray) {

    if (!rawArray || rawArray.length === 0) return;

    $('#RawMaterialDynamic').html("");

    rawArray.forEach((item, index) => {

        let randomId = Math.random().toString(36).substring(2);
        let isFirstRow = index === 0;

        // Build Dye dropdown options
        let DyeHTML = DyeDropdown[0]
            .map(w => `<option value="${w.ProductId}" ${item.DyeId == w.ProductId ? 'selected' : ''}>${w.ProductName}</option>`)
            .join('');

        let html = `
        <div class="row RawMetarial">
            <label class="ProductionPlanDyeRequirementId d-none">${item.ProductionPlanDyeRequirementId}</label>

            <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                <div class="form-group">
                    <label class="DyeNameClass">DyeName<span id="Asterisk">*</span></label>
                    <select class="form-control ProductIdRawMaterial ProductId" id="ProductId_${randomId}" name="ProductId_${randomId}" required>
                        <option value="">--Select--</option>
                        ${DyeHTML}
                    </select>
                </div>
            </div>

            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                <div class="form-group">
                    <label class="DyeClass">Value<span id="Asterisk">*</span></label>
                    <div class="input-group" style="gap:8px;">
                        <select class="form-control DysType" id="DysType${randomId}" name="DysType${randomId}" required>
                            <option value="1">GPL</option>
                            <option value="2">%</option>
                        </select> 
                        <input type="text" class="form-control Dye" placeholder="Ex: 8.3" id="Dye_${randomId}" name="Dye_${randomId}" value="${item.PercentageOfDye != null ? Number(item.PercentageOfDye).toFixed(3) : ''}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required />
                    </div>
                </div>
            </div>

            <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                <div class="form-group">
                    <label class="TotalDyeQtyClass">TotalDyeQty<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control TotalDyeQty" placeholder="Ex: 0" id="TotalDyeQty_${randomId}" name="TotalDyeQty_${randomId}" value="${item.TotalQty != null ? Number(item.TotalQty).toFixed(3) : ''}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" required />
                </div>
            </div>

            <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                <div class="p-1 buttonsRow" style="display:${isFirstRow ? 'block' : 'none'}">
                    <button class="btn AddStockBtn" type="button" onclick="duplicateRowRawMetarial(this)" style="position:absolute; top:22px; right:14px;">
                        <i class="fas fa-plus" style="color:#000"></i>
                    </button>
                </div>

                <div class="p-1 buttonsRow" style="display:${isFirstRow ? 'none' : 'block'}">
                    <button class="btn DynrowRemove RowOfMetarialRemove" type="button" onclick="removeRowMaterial(this)" style="position:absolute; top:4px; right:13px;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>

            </div>
        </div>`;

        $("#RawMaterialDynamic").append(html);

        // ✅ Bind values safely by ID
        $(`#DysType${randomId}`).val(item.DyeType);
        $(`#ProductId_${randomId}`).val(item.DyeId);

    });

    updateRemoveButtonsRawMetarial();
}

function createChemicalRow(rowType, chemicalData) {
    let numberIncr = Math.random().toString(36).substring(2);
    let rowadd = $(`.RowOfChemical-${rowType}`).length;

    let selectOptions = "";
    let defaultOption = '<option value="">--Select--</option>';

    if (rowType === 'Pre') {
        if (PreTreatmentChemicalProduct && PreTreatmentChemicalProduct[0]) {
            selectOptions = PreTreatmentChemicalProduct[0].map(c => `<option value="${c.ChemicalId}">${c.ChemicalName}</option>`).join('');
        }
    } else {
        if (AfterTreatmentChemicalProduct && AfterTreatmentChemicalProduct[0]) {
            selectOptions = AfterTreatmentChemicalProduct[0].map(c => `<option value="${c.ChemicalId}">${c.ChemicalName}</option>`).join('');
        }
    }

    let htmlRow = `
        <div class="row RowOfChemical-${rowType}">
            <label class="ProductionPlanChemicalRequirementId d-none">${chemicalData.ProductionPlanChemicalRequirementId}</label>
            <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                <div class="form-group">
                    <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                    <select class="form-control ProductSelect${rowType} ProductId${rowType}" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                        ${defaultOption}${selectOptions}
                    </select>
                </div>
            </div> 
            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                <div class="form-group">
                <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                    <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                        <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                            <option value="1">GPL</option>
                            <option value="2">%</option>
                        </select>
                        <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" value="${chemicalData.GPL != null ? Number(chemicalData.GPL).toFixed(3) : ''}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required/>
                    </div>
                </div>
            </div> 
            <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                <div class="form-group">
                    <label class="QtyClass">Qty<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control" placeholder="Ex: 0" id="Qty${numberIncr}" name="Qty${numberIncr}" value="${chemicalData.TotalQty != null ? Number(chemicalData.TotalQty).toFixed(3) : ''}" oninput="Common.allowOnlyNumberLength(this,3)" required/>
                </div>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'block' : 'none'}">
                    <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemical${rowType}Testing(this)" style="position: absolute; top: 22px; right: 14px;">
                        <i class="fas fa-plus" style="color: #000000;"></i>
                    </button>
                </div>
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                    <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemove${rowType} mt-0" type="button" onclick="removeRowRowChemical${rowType}(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;

    $(`#ChemicalDynamic-${rowType}`).append(htmlRow);

    // ✅ Correct product binding
    $(`#ChemicalDynamic-${rowType} .ProductId${rowType}`)
        .last()
        .val(String(chemicalData.ChemicalId));

    // ✅ Correct GPL / % binding
    $(`#ChemicalDynamic-${rowType} .DysType`)
        .last()
        .val(String(chemicalData.ChemicalType));

    if (rowType === 'Pre') updateRemoveChemicalPre();
    else updateRemoveChemicalAfter();
}

function LoadPopupItems(allItems) {
    $("#ProductionPlanAddItem-table-body").empty();

    allItems.forEach((item, index) => {
        let uniqueId = `ItemId-${item.InwardFabricId}`;

        let fabricQty = item.FabricQty;
        let matches = fabricQty.match(/^([\d,]+\.?\d*)\s*(\w+)$/);
        let qtyValue;

        if (matches) {
            qtyValue = matches[1];
        }

        const row = `
            <tr class="AddItemRow" data-id="${item.ProcessList}">
                <td>
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="mr-2 ItemCheckbox" id="${uniqueId}">
                        <label for="${uniqueId}" class="Customer mb-0" style="color : ${item.StatusColor}!important;">${item.MachineName}</label>
                    </div>
                </td> 
                <td><label class="Customer mb-0">${item.Customer}</label></td>
                <td><label class="d-none InWardNo">${item.InWardId}</label><label class="LotNo mb-0">${item.InWardNo}</label></td>
                <td><label class="d-none ColorId">${item.ColorId}</label><label class="Colour mb-0">${item.ColorName}</label></td>
                <td><label class="d-none FabricId">${item.FabricId}</label><label class="FabricType mb-0">${item.Fabric}</label></td>
                <td><label class="GSM mb-0">${item.GSM}</label></td>
                <td><label class="Width mb-0">${item.Width}</label></td>
                <td><label class="FabricQty mb-0">${item.FabricQty}</label></td>
                <td><label class="FabricQty mb-0">${item.InWardQty}</label></td> 
                <td> 
                    <div id="ember325" class="input-group ember-view" style="flex-wrap: nowrap;width: 100px;">
                        <input type="text" class="form-control AvailableQuantity" value="${qtyValue}">
                        <button id="PrimaryUnitSymbol" class="btn btn-secondary p-0" type="button" style="padding: 4px !important;border-top-left-radius: 0;border-bottom-left-radius: 0;font-size: 12px;width: 29px;height: 26px;"> KG </button>
                    </div>
                </td>
            </tr>
        `;
        $("#ProductionPlanAddItem-table-body").append(row);
    });

    $("#ProductionPlanAddItemModal").show();
}

$(document).on('change', '.ItemCheckbox', function () {
    const itemId = $(this).attr('id').replace("ItemId-", "");
    const $row = $(this).closest("tr");
    const $tbody = $("#ProductionPlanAddItem-table-body");

    if (this.checked) {
        let $lastChecked = $tbody.find('.ItemCheckbox:checked').not(this).last().closest('tr');

        $row.fadeOut(200, function () {
            $row.detach();
            if ($lastChecked.length) {
                $lastChecked.after($row);
            } else {
                $tbody.prepend($row);
            }
            $row.fadeIn(300);
        });
    } else {
        let $lastChecked = $tbody.find('.ItemCheckbox:checked').last().closest('tr');

        $row.fadeOut(200, function () {
            $row.detach();
            if ($lastChecked.length) {
                $lastChecked.after($row);
            } else {
                $tbody.prepend($row);
            }
            $row.fadeIn(300);
        });
    }

    const itemObj = {
        ItemId: itemId,
        InwardFabricId: $(this).attr("id").split("-")[1],
        InWardId: $row.find('.InWardNo').text(),
        ColorId: $row.find('.ColorId').text(),
        FabricId: $row.find('.FabricId').text(),
        LotNo: $row.find(".LotNo").text() || '',
        Customer: $row.find(".Customer").text() || '',
        FabricType: $row.find(".FabricType").text() || '',
        Colour: $row.find(".Colour").text() || '',
        GSM: $row.find(".GSM").text() || '',
        Width: $row.find(".Width").text() || '',
        Quantity: parseFloat($row.find(".Quantity").text()) || 0,
        AvailableQuantity: parseFloat($row.find(".AvailableQuantity").val()) || 0,
        ProcessList: $row.data('id'),
        IsChecked: $(this).prop("checked"),
    };

    if (itemObj.IsChecked) {
        if (!ItemListAdd.some(x => x.ItemId == itemObj.ItemId)) {
            ItemListAdd.push(itemObj);
        }
    } else {
        ItemListAdd = ItemListAdd.filter(x => x.ItemId != itemObj.ItemId);
    }

    UpdateSelectedItemCount();
    UpdateTotalQuantity();
});

$(document).on('input', '.AvailableQuantity', function () {
    UpdateTotalQuantity();
});

function UpdateTotalQuantity() {
    let totalQty = 0;

    ItemListAdd.forEach(item => {
        let $row = $("#ProductionPlanAddItem-table-body").find(`#ItemId-${item.ItemId}`).closest("tr");
        if ($row.length) {
            item.AvailableQuantity = parseFloat($row.find(".AvailableQuantity").val()) || 0;
            totalQty += item.AvailableQuantity;
        }
    });

    $("#NoOfQty").text(totalQty);
}

function UpdateSelectedItemCount() {
    const count = $(".ItemCheckbox:checked").length;
    $("#TotalItemSelect").text(count);
}

var AddedItems = [];

$(document).on("click", "#BtnAdd", function () {

    // -----------------------------------------
    // 1️⃣ CHECK: Is any checkbox selected?
    // -----------------------------------------

    let checkedRows = [];
    $('.AddItemRow').each(function () {
        const checkbox = $(this).find('input[type="checkbox"]');

        if (checkbox.prop('checked')) {
            checkedRows.push($(this));
        }
    });

    if (checkedRows.length === 0) {
        Common.warningMsg('Select at least one Customer to add.');
        return;
    }

    // -----------------------------------------
    // 2️⃣ CHECK: Are all selected colours same?
    // -----------------------------------------

    let commonColour = checkedRows[0].find('.Colour').text().trim();  // Note uppercase 'C'
    let firstColor = commonColour;
    let allSameColor = checkedRows.every(row => row.find('.Colour').text().trim() === commonColour);

    if (!allSameColor) {
        Common.warningMsg('Selected rows must have the same Colour.');
        return;
    }
    // -----------------------------------------
    // 3️⃣ CALCULATE BEFORE AJAX
    // -----------------------------------------

    let FinalValues = 0;

    if ($('#TotalWeight').val() === '' || $('#TotalWeight').val() === null) {
        FinalValues = $("#NoOfQty").text() || 0;
    } else {
        let value1 = $('#TotalWeight').val() || 0;
        let value2 = $("#NoOfQty").text() || 0;
        FinalValues = parseFloat(value1) + parseFloat(value2);
    }

    // -----------------------------------------
    // 4️⃣ AJAX CALL (ONLY IF VALIDATION PASSED)
    // ----------------------------------------- 
    Common.ajaxCall("GET", "/Productions/GetFabricDetailsProductionPlan", { PlantId: parseInt(PlantMappingId), IsUpdate: 1, KG: parseFloat(FinalValues), Color: firstColor }, function (response) {
        if (response.status) {

            var data = JSON.parse(response.data);

            $('#TotalWeight').val(FinalValues);
            $('#MachineId').val(data[0][0].MachineId);
            $('#ColorId').val(data[0][0].SelectedColorId);

            // -----------------------------------------
            // 5️⃣ PERFORM ADD OPERATIONS AFTER AJAX
            // -----------------------------------------

            $('#ProductionPlanAddItem-table-body tr.AddItemRow').each(function () {
                const rowData = {
                    InWardId: $(this).find('.InWardNo').text(),
                    ColorId: $(this).find('.ColorId').text(),
                    FabricId: $(this).find('.FabricId').text(),
                    CustomerName: $(this).find('.Customer').first().text(), // first td label
                    LotNo: $(this).find('.LotNo').text(),
                    Colour: $(this).find('.Colour').text(),
                    FabricType: $(this).find('.FabricType').text(),
                    GSM: $(this).find('.GSM').text(),
                    Width: $(this).find('.Width').text(),
                    AvailableQuantity: $(this).find('.AvailableQuantity').val(),
                    ProcessList: $(this).data('id')
                };

                if (!AddedItems.find(item => item.LotNo === rowData.LotNo)) {
                    AddedItems.push(rowData);
                }
            });

            ItemListAdd.forEach(item => {

                let uid = Math.random().toString(36).substring(2);

                if (AlreadyAddedIds.includes(item.ItemId.toString())) return;
                AlreadyAddedIds.push(item.ItemId.toString());

                let numberIncr = Math.random().toString(36).substring(2);

                const newRow = `
                    <tr class="AddedRow" data-productionplanfabricid-id="" data-inwardfabricid-id="${item.InwardFabricId}" data-productionplanfabricprocessmappingId-id="">
                        <td></td>
                        <td data-id="${item.InWardId}"><input type="text" class="form-control lotNo" value="${item.LotNo}" disabled></td>
                        <td data-id="${item.ColorId}"><input type="text" class="form-control colour" value="${item.Colour}" disabled></td>
                        <td data-id="${item.FabricId}"><input type="text" class="form-control fabricType" value="${item.FabricType}" disabled></td>
                        <td><input type="text" class="form-control GSM" value="${item.GSM}" disabled></td>
                        <td><input type="text" class="form-control Width" value="${item.Width}" disabled></td>
                        <td><input type="text" class="form-control qty" value="${item.AvailableQuantity}" required oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td>
                        <td>
                            <select multiple class="select2 Process" data-coreui-search="true" id="Process_${uid}" name="Process_${uid}" required>
                            </select>
                        </td>
                        <td>
                            <button class="btn DynremoveBtn DynrowRemove" type="button" data-id="${item.ItemId}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;

                $("#AddItemButtonRow").before(newRow);

                let mappedProcesses = [];

                if (item.ProcessList !== null && item.ProcessList !== undefined) {
                    const processStr = String(item.ProcessList);

                    mappedProcesses = processStr.includes(',')
                        ? processStr.split(',').map(p => p.trim())
                        : [processStr.trim()];
                }

                bindDropDownMultiProcess("Process_" + uid, 'ProcessType', mappedProcesses);
            });

            $("#QRCode").html("");

            let qrData = {
                BatchNo: $("#BatchNo").val(),
                BatchDate: $("#BatchDate").val(),
                TotalWeight: $("#TotalWeight").val(),
                ColorId: $("#ColorId").val(),
                MachineId: $("#MachineId").val(),
                LoadingDateTime: ProductionPlanId === 0 ? '' : $("#LoadingDateTime").val(),
                UnLoadingDateTime: ProductionPlanId === 0 ? '' : $("#UnLoadingDateTime").val()
            };

            new QRCode(document.getElementById("QRCode"), {
                text: JSON.stringify(qrData),
                width: 120,
                height: 120
            });

            RenumberRows();
            UpdateMainTableQuantity();
            CalcuWetreLevel();

            ItemListAdd = [];

            if (AlreadyAddedIds.length > 0) {
                $('#MLRWaterLevelDiv').show();
            } else {
                $('#MLRWaterLevelDiv').hide();
            }

            $("#ProductionPlanAddItemModal").hide();
        }
        else {
            Common.warningMsg(response.message);
        }
    }, null);
});


$(document).on('click', '.DynremoveBtn', function () {
    const id = $(this).data("id").toString();
    const row = $(this).closest("tr");

    const qtyVal = parseFloat(row.find(".qty").val()) || 0;
    let totalWeight = parseFloat($("#TotalWeight").val()) || 0;

    let newTotal = totalWeight - qtyVal;
    if (newTotal < 0) newTotal = 0;
    $("#TotalWeight").val(newTotal);
    CalcuWetreLevel();

    row.remove();
    AlreadyAddedIds = AlreadyAddedIds.filter(x => x !== id);
    ItemListAdd = ItemListAdd.filter(x => x.ItemId.toString() !== id);

    if (AlreadyAddedIds.length !== 0) {
        $('#MLRWaterLevelDiv').show();
    } else {
        $('#MLRWaterLevelDiv').hide();
        $('#MLR').val('');
    }

    RenumberRows();
    UpdateMainTableQuantity();
});

function RenumberRows() {
    $('#ProductionPlanProductTablebody .AddedRow').each(function (index) {
        $(this).find('td:first').text(index + 1);
    });
}

$(document).on('input', '.qty', function () {
    UpdateMainTableQuantity();
});

function UpdateMainTableQuantity() {

    let total = 0;

    $("#ProductionPlanProductTablebody tr.AddedRow").each(function () {
        let qty = parseFloat($(this).find("input.qty").val()) || 0;
        total += qty;
    });

    $("#Subtotal").val(total.toFixed(2));
}

$(document).on('click', '#AddItemBtn', function () {

    $("#TotalItemSelect").text('');
    $("#NoOfQty").text('');

    Common.ajaxCall("GET", "/Productions/GetFabricDetailsProductionPlan", { PlantId: parseInt(PlantMappingId), IsUpdate: null, KG: 1, Color: "" }, function (response) {

        if (!response.status) return;

        var data = JSON.parse(response.data);
        var items = data[0];

        const filteredData = items.filter(item =>
            !AlreadyAddedIds.includes(item.InwardFabricId.toString())
        );

        // 🚨 If NO records available, show a 'no record found' row
        if (filteredData.length === 0) {
            $("#ProductionPlanAddItem-table-body").html(`
                    <tr>
                        <td colspan="10" class="text-center text-danger fw-bold py-2">
                            No records found
                        </td>
                    </tr>
                `);
            $("#ProductionPlanAddItemModal").show();
            return;
        }

        // Otherwise load normally
        LoadPopupItems(filteredData);
    }, null);
});

/*------------------------------------------------------------------------------Dynamic Pop-------------------------------------------------------------------*/
let selectedProcessInput = null;

$(document).on('click', '.processRoute', function () {
    const $row = $(this).closest('tr');
    selectedProcessInput = $(this);

    let storedIds = $row.find('input.processRoute').attr('data-id');
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
        const selectedCheckedIds = $('.ProcessCheck:checked').map(function () {
            return $(this).data('id');
        }).get();

        const selectedCount = selectedCheckedIds.length;
        selectedProcessInput.val(selectedCount);

        $row.find('input.processRoute').attr('data-id', selectedCheckedIds.join(','));

        $('#ProcessModal').remove();
    });
});


$(document).on('click', '#RawMetarialInfo', function () {
    var TableLenthDynamicRow = $('.AddedRow').length;
    var MLR = $('#MLR').val();
    if (TableLenthDynamicRow == 0) {
        Common.warningMsg('Choose Atleast One Product');
        $('#loader-pms').hide();
        return false;
    }

    if (MLR == "") {
        Common.warningMsg('Fill the MLR');
        return false;
    }

    $('#RawMaterialModal').show();
});

$(document).on('click', '#RawMaterialClose', function () {
    $('#RawMaterialModal').hide();
    $('#FormRawMaterialDynamic').find('input, select, textarea').each(function () {
        $(this).removeClass('error');
    });
});

$(document).on('click', '#ChemicalInfo', function () {
    $('#ChemicalModal .navbar-tab').first().trigger('click');
    var TableLenthDynamicRow = $('.AddedRow').length;
    var MLR = $('#MLR').val();
    if (TableLenthDynamicRow == 0) {
        Common.warningMsg('Choose Atleast One Product');
        $('#loader-pms').hide();
        return false;
    }

    if (MLR == "") {
        Common.warningMsg('Fill the MLR');
        return false;
    }

    $('#ChemicalModal').show();
});

$(document).on('click', '#ChemicalClose', function () {
    $('#ChemicalModal .navbar-tab').first().trigger('click');
    $('#ChemicalModal').hide();
    $('#FromChemicalDynamic').find('input, select, textarea').each(function () {
        $(this).removeClass('error');
    });
});

$(document).on('click', '#BtnAddRawMaterial', function () {
    var isValid = true;

    $('#FormRawMaterialDynamic .RawMetarial').each(function () {
        $(this).find('input, select').each(function () {
            if (!this.checkValidity()) {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
    });

    if (isValid) {
        $('#RawMaterialModal').hide();
        Common.successMsg("RawMetarial Details are Save Successfully.");
    } else {
        Common.errorMsg("Please fill all required fields.");
    }
});

$(document).on('click', '#BtnAddChemical', function () {
    var isPreValid = true;
    var isPreFilled = false;

    $('#ChemicalDynamic-Pre .RowOfChemical-Pre').each(function () {
        var rowFilled = false;

        $(this).find('input, select').each(function () {
            if ($(this).val() !== "") {
                rowFilled = true;
            }

            if (!this.checkValidity()) {
                isPreValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });

        if (rowFilled) {
            isPreFilled = true;
        }
    });

    var isAfterValid = true;
    var isAfterFilled = false;

    $('#ChemicalDynamic-After .RowOfChemical-After:visible').each(function () {
        var rowFilled = false;

        $(this).find('input, select').each(function () {
            if ($(this).val() !== "") {
                rowFilled = true;
            }

            if (!this.checkValidity()) {
                isAfterValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });

        if (rowFilled) {
            isAfterFilled = true;
        }
    });

    if (isPreValid && isAfterValid && isPreFilled && isAfterFilled) {
        $('#ChemicalModal').hide();
        Common.successMsg("Chemical Details are Save Successfully.");
    } else {
        Common.errorMsg("Please fill all required fields in both tabs.");
    }
});

/* Qty change (dynamic rows supported) */
$(document).on('keyup input change', '#ProductionPlanProductTablebody .qty, #MLR, #TotalWeight', function () {
    recalculateAll();
});

$(document).on('keyup input change', '#RawMaterialDynamic .Dye, #RawMaterialDynamic .DysType', function () {
    calculateDyeQty($(this).closest('.RawMetarial'));
});


$(document).on('keyup input change', '#ChemicalDynamic-Pre input, #ChemicalDynamic-After input, ' + '#ChemicalDynamic-Pre .DysType, #ChemicalDynamic-After .DysType', function () {
    let $row = $(this).closest('.RowOfChemical-Pre');
    if (!$row.length) {
        $row = $(this).closest('.RowOfChemical-After');
    }

    calculateChemicalQty($row);
});

function recalculateAll() {
    let totalWeight = 0;

    $('#ProductionPlanProductTablebody .qty').each(function () {
        totalWeight += parseFloat($(this).val()) || 0;
    });

    $('#TotalWeight').val(totalWeight.toFixed(3));

    $('#RawMaterialDynamic .RawMetarial').each(function () {
        calculateDyeQty($(this));
    });

    $('#ChemicalDynamic-Pre .RowOfChemical-Pre, #ChemicalDynamic-After .RowOfChemical-After')
        .each(function () {
            calculateChemicalQty($(this));
        });
}

function calculateDyeQty($row) {

    if (!$row || !$row.length) return;

    let dyeValue = parseFloat($row.find('.Dye').val()) || 0;
    let DysType = $row.find('.DysType').val();

    let totalWeight = parseFloat($('#TotalWeight').val()) || 0;
    let mlr = parseFloat($('#MLR').val()) || 0;

    let waterLevel = totalWeight * mlr;
    let totalDyeQty = 0;

    if (DysType == "1") {
        totalDyeQty = (dyeValue / 1000) * waterLevel;
    } else {
        totalDyeQty = (totalWeight * dyeValue) / 100;
    }

    $row.find('.TotalDyeQty').val(totalDyeQty.toFixed(3));
}

function calculateChemicalQty($row) {

    if (!$row || !$row.length) return;

    let value = parseFloat(
        $row.find('.input-group input[type="text"]').first().val()
    ) || 0;

    let DysType = $row.find('.DysType').val();
    let totalWeight = parseFloat($('#TotalWeight').val()) || 0;
    let mlr = parseFloat($('#MLR').val()) || 0;

    let waterLevel = totalWeight * mlr;
    let qty = 0;

    if (DysType == "1") {
        qty = (value / 1000) * waterLevel;
    } else {
        qty = (totalWeight * value) / 100;
    }

    $row.find('input[type="text"]').last().val(qty.toFixed(3));
}


//$(document).on('input change', '#RawMaterialDynamic .Dye, #RawMaterialDynamic .DysType', function () {
//    calculateDyeQty($(this).closest('.RawMetarial'));
//});

//$(document).on('input', '#TotalWeight, #MLR, #ProductionPlanProductTablebody .qty', function () { 
//    $('#RawMaterialDynamic .RawMetarial').each(function () {
//        calculateDyeQty($(this));
//    });

//    $('#ChemicalDynamic-Pre .RowOfChemical-Pre, #ChemicalDynamic-After .RowOfChemical-After').each(function () {
//        calculateChemicalQty($(this));
//    });
//});

//$(document).on(
//    'input',
//    '#ChemicalDynamic-Pre input[type="text"], #ChemicalDynamic-After input[type="text"]',
//    function () {
//        calculateChemicalQty($(this).closest('.RowOfChemical-Pre, .RowOfChemical-After'));
//    }
//);

//$(document).on(
//    'change',
//    '#ChemicalDynamic-Pre .DysType, #ChemicalDynamic-After .DysType',
//    function () {
//        calculateChemicalQty($(this).closest('.RowOfChemical-Pre, .RowOfChemical-After'));
//    }
//);

//function calculateDyeQty($row) {

//    var dyeValue = parseFloat($row.find('.Dye').val()) || 0;
//    var DysType = $row.find('.DysType').val();
//    var mlr = parseFloat($('#MLR').val()) || 0;
//    var totalWeight = parseFloat($('#TotalWeight').val()) || 0;

//    var waterLevel = totalWeight * mlr;
//    var totalDyeQty = 0;

//    if (DysType === "1") { // GPL
//        totalDyeQty = (dyeValue / 1000) * waterLevel;
//    } else { // %
//        totalDyeQty = (totalWeight * dyeValue) / 100;
//    }

//    $row.find('.TotalDyeQty').val(totalDyeQty.toFixed(3));
//}

//function calculateChemicalQty($row) {

//    // 🔴 THIS MUST MATCH YOUR HTML
//    var value = parseFloat(
//        $row.find('input[type="text"]:not(.Qty)').first().val()
//    ) || 0;

//    var DysType = $row.find('.DysType').val();
//    var totalWeight = parseFloat($('#TotalWeight').val()) || 0;

//    // ⚠️ IMPORTANT (developer note)
//    // WaterLevel is derived from MLR, not WaterLevel input
//    var mlr = parseFloat($('#MLR').val()) || 0;
//    var waterLevel = totalWeight * mlr;

//    var qty = 0;

//    if (DysType === "1") { // GPL
//        qty = (value / 1000) * waterLevel;
//    } else { // %
//        qty = (totalWeight * value) / 100;
//    }

//    $row.find('.Qty').val(qty.toFixed(3));
//}

function duplicateRowChemicalPre() {

    if (!PreTreatmentChemicalProduct || !PreTreatmentChemicalProduct[0] || PreTreatmentChemicalProduct[0].length === 0) {
        return;
    }

    const defaultChemicals = PreTreatmentChemicalProduct[0].filter(c => c.IsDefault === true);

    if (defaultChemicals.length === 0) {
        return;
    }

    defaultChemicals.forEach(function (chemical) {

        let numberIncr = Math.random().toString(36).substring(2);
        var rowadd = $('.RowOfChemical-Pre').length;

        var defaultOption = '<option value="">--Select--</option>';
        var PreTreatmentSelectOptions = PreTreatmentChemicalProduct[0].map(function (c) { return `<option value="${c.ChemicalId}">${c.ChemicalName}</option>`; }).join('');

        var htmlRow = `
            <div class="row RowOfChemical-Pre">
                <label class="ProductionPlanChemicalRequirementId d-none"></label>

                <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                        <select class="form-control ProductSelectPre ProductIdPre" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                            ${defaultOption}${PreTreatmentSelectOptions}
                        </select>
                    </div>
                </div>
                 
                <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                     <div class="form-group">
                        <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                         <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                              <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                                 <option value="1">GPL</option>
                                 <option value="2">%</option>
                              </select>
                              <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required />
                         </div>
                     </div>
                </div>
               
                <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="QtyClass">Qty<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control" placeholder="Ex: 0" id="Qty${numberIncr}" name="Qty${numberIncr}" oninput="Common.allowOnlyNumberLength(this,3)" required/>
                    </div>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'block' : 'none'}">
                        <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalPreTesting(this)" style="position: absolute; top: 22px; right: 14px;">
                            <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                        </button>
                    </div>
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                        <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemovePre mt-0" type="button" onclick="removeRowRowChemicalPre(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;

        $('#ChemicalDynamic-Pre').append(htmlRow);
        $(`#ProductId${numberIncr}`).val(chemical.ChemicalId);
    });
    updateRemoveChemicalPre();
}


function updateRemoveChemicalPre() {
    var rows = $('.RowOfChemical-Pre');

    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.RowOfChemicalRemovePre');
        var labels = $(this).find('.ProductClass, .GPLClass, .QtyClass');

        if (index === 0) {
            labels.show();
            removeButtonDiv.hide();
        } else {
            labels.hide();
            removeButtonDiv.show();
        }
    });
    refreshProductDropdowns(".ProductSelectPre");
}

function removeRowRowChemicalPre(button) {
    var totalRows = $('.RowOfChemical-Pre').length;
    if (totalRows > 1) {
        $(button).closest('.RowOfChemical-Pre').remove();
    }
    updateRemoveChemicalPre();
    refreshProductDropdowns(".ProductSelectPre");
}

function duplicateRowChemicalAfter() {

    if (AfterTreatmentChemicalProduct == null || AfterTreatmentChemicalProduct.length === 0 || AfterTreatmentChemicalProduct[0].length === 0) {
        return;
    }

    const defaultChemicals = AfterTreatmentChemicalProduct[0].filter(c => c.IsDefault === true);

    if (defaultChemicals.length === 0) {
        return;
    }

    defaultChemicals.forEach(function (chemical) {

        let numberIncr = Math.random().toString(36).substring(2);
        var rowadd = $('.RowOfChemical-After').length;

        var AfterTreatmentSelectOptions = "";
        var defaultOption = '<option value="">--Select--</option>';

        AfterTreatmentSelectOptions = AfterTreatmentChemicalProduct[0].map(function (ChemicalId) { return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`; }).join('');

        var htmlRow = `
            <div class="row RowOfChemical-After">
                <label class="ProductionPlanChemicalRequirementId d-none"></label>

                <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                        <select class="form-control ProductSelectAfter ProductIdAfter" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                            ${defaultOption}${AfterTreatmentSelectOptions}
                        </select>
                    </div>
                </div>
                  
                 <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                      <div class="form-group">
                         <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                          <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                               <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                                  <option value="1">GPL</option>
                                  <option value="2">%</option>
                               </select>
                               <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required/>
                          </div>
                      </div>
                  </div>
              
                 <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="QtyClass">Qty<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control" placeholder="Ex: 0" id="Qty${numberIncr}" name="Qty${numberIncr}" oninput="Common.allowOnlyNumberLength(this,3)" required/>
                    </div>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'block' : 'none'}">
                        <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalAfterTesting(this)" style="position: absolute; top: 22px; right: 14px;">
                            <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                        </button>
                    </div>
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                        <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemoveAfter mt-0" type="button" onclick="removeRowRowChemicalAfter(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;

        $('#ChemicalDynamic-After').append(htmlRow);
        $(`#ProductId${numberIncr}`).val(chemical.ChemicalId);
    });

    updateRemoveChemicalAfter();
}

function updateRemoveChemicalAfter() {
    var rows = $('.RowOfChemical-After');

    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.RowOfChemicalRemoveAfter');
        var labels = $(this).find('.ProductClass, .GPLClass, .QtyClass');

        if (index === 0) {
            labels.show();
            removeButtonDiv.hide();
        } else {
            labels.hide();
            removeButtonDiv.show();
        }
    });
    refreshProductDropdowns(".ProductSelectAfter");
}

function removeRowRowChemicalAfter(button) {
    var totalRows = $('.RowOfChemical-After').length;
    if (totalRows > 1) {
        $(button).closest('.RowOfChemical-After').remove();
    }
    updateRemoveChemicalAfter();
    refreshProductDropdowns(".ProductSelectAfter");
}


function duplicateRowRawMetarial() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RawMetarial').length;

    var DyeSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (DyeDropdown != null && DyeDropdown.length > 0 && DyeDropdown[0].length > 0) {
        DyeSelectOptions = DyeDropdown[0].map(function (ProductId) {
            return `<option value="${ProductId.ProductId}">${ProductId.ProductName}</option>`;
        }).join('');
    }

    var htmlRow = `
        <div class="row RawMetarial">
           <label class="ProductionPlanDyeRequirementId d-none"></label>
           <div class="col-md-5 col-lg-5 col-sm-6 col-6">
               <div class="form-group">
                   <label class="DyeNameClass">DyeName<span id="Asterisk">*</span></label>
                   <select class="form-control ProductIdRawMaterial ProductId" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                       ${defaultOption}${DyeSelectOptions}
                   </select>
               </div>
           </div>
            
           <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                <div class="form-group">
                    <label class="DyeClass">Value<span id="Asterisk">*</span></label>
                    <div id="ember325" class="input-group ember-view" style="gap: 8px;"> 
                         <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                            <option value="1">GPL</option>
                            <option value="2">%</option>
                         </select>
                         <input type="text" class="form-control Dye" placeholder="Ex: 8.3" id="Dye${numberIncr}" name="Dye${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required style="border-top-left-radius: 3px;border-bottom-left-radius: 3px;"/>
                    </div>
                </div>
            </div>
             
            <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                <div class="form-group">
                    <label class="TotalDyeQtyClass">TotalDyeQty<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control TotalDyeQty" placeholder="Ex: 0" id="TotalDyeQty${numberIncr}" name="TotalDyeQty${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" required/>
                </div>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'block' : 'none'}">
                    <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowRawMetarial(this)" style="position: absolute; top: 22px; right: 14px;">
                        <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                    </button>
                </div>
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                    <button id="RemoveButton" class="btn DynrowRemove RowOfMetarialRemove mt-0" type="button" onclick="removeRowMaterial(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;
    $('#RawMaterialDynamic').append(htmlRow);
    updateRemoveButtonsRawMetarial();
}


function updateRemoveButtonsRawMetarial() {
    var rows = $('.RawMetarial');

    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.RowOfMetarialRemove');
        var labels = $(this).find('.DyeNameClass, .DyeClass, .TotalDyeQtyClass');

        if (index === 0) {
            labels.show();
            removeButtonDiv.hide();
        } else {
            labels.hide();
            removeButtonDiv.show();
        }
    });
    refreshProductDropdowns(".ProductIdRawMaterial");
}

function removeRowMaterial(button) {
    var totalRows = $('.RawMetarial').length;
    if (totalRows > 1) {
        $(button).closest('.RawMetarial').remove();
    }
    updateRemoveButtonsRawMetarial();
    refreshProductDropdowns(".ProductIdRawMaterial");
}

function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
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

    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");
    var MachineColumnIndex = columns.findIndex(column => column.data === "MachineName");

    if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [
        {
            "targets": StatusColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Status_Color != null && row.Status_Color.length > 0) {
                    var dataText = row.Status;
                    var statusColor = row.Status_Color.toLowerCase();

                    var htmlContent = '<div>';
                    htmlContent += '<span class="ana-span badge text-white" style="background:' + statusColor + ';width: 115px;font-size: 12px;height: 23px;">' + dataText + '</span>';
                    htmlContent += '</div>';

                    return htmlContent;
                }
                return data;
            }
        }
    ];

    if (MachineColumnIndex !== -1) {
        renderColumn.push({
            targets: MachineColumnIndex,
            render: function (data, type, row) {
                if (type === 'display') {
                    var dataText = row.MachineName;
                    var statusColor = row.StatusColor.toLowerCase();
                    return `<span style="color:${statusColor}; font-weight:600;">${dataText}</span>`;
                }
                return data;
            }
        });
    }

    if (access.update || access.delete) {
        renderColumn.push(
            {
                targets: actionTarget,
                render: function (data, type, row, meta) {
                    var editCondition = access.update;
                    var deleteCondition = access.delete;
                    let html = "";
                    if (tableid === "Audittable") {
                        html += `<i class="btn-report mx-1 fas fa-file-alt text-primary" 
                            data-id="${row[editcolumn]}" 
                            title="Report" 
                            style="cursor:pointer; font-size:16px;">
                        </i>`;
                    }
                    if (editCondition) {
                        html += `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit">
                            <img src="/assets/commonimages/edit.svg" />
                         </i>`;
                    }
                    if (deleteCondition) {
                        html += `<i class="btn-delete alert_delete mx-1" data-id="${row[editcolumn]}" title="Delete">
                            <img src="/assets/commonimages/delete.svg" />
                         </i>`;
                    }

                    return html;
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

$(document).on('input', '#AdditemSearchProduction', function () {
    applyProductionFilters();
});

function applyProductionFilters() {
    let searchValue = $('#AdditemSearchProduction').val().toLowerCase();
    let visibleRowCount = 0;

    $('#ProductionPlanAddItem-table-body tr').each(function () {
        let customer = $(this).find('.Customer').text().toLowerCase();
        let lotNo = $(this).find('.LotNo').text().toLowerCase();
        let colour = $(this).find('.Colour').text().toLowerCase();
        let fabricType = $(this).find('.FabricType').text().toLowerCase();
        let gsm = $(this).find('.GSM').text().toLowerCase();
        let width = $(this).find('.Width').text().toLowerCase();
        let quantity = $(this).find('.Quantity').text().toLowerCase();

        let rowText = customer + ' ' + lotNo + ' ' + colour + ' ' + fabricType + ' ' + gsm + ' ' + width + ' ' + quantity;

        let isVisible = !searchValue || rowText.includes(searchValue);

        $(this).toggle(isVisible);

        if (isVisible) visibleRowCount++;
    });

    $('.ProductionEmptyRow').toggle(visibleRowCount === 0);
}

/*------------------------------------------------------------------Avoid the Duplicate to select----------------------------------------------------------------*/

$(document).on("change", ".ProductSelectPre, .ProductSelectAfter, .ProductIdRawMaterial", function () {

    const classMap = [".ProductSelectPre", ".ProductSelectAfter", ".ProductIdRawMaterial"];
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

function SetDateFroLoadingAndUnLoading() {
    let loadingPicker = document.querySelector("#LoadingDateTime")._flatpickr;
    let unloadingPicker = document.querySelector("#UnLoadingDateTime")._flatpickr;
    let now = new Date();
    loadingPicker.setDate(now);
    unloadingPicker.setDate(now);

    $("#LoadingDateTime").off("change").on("change", function () {
        let selectedTime = $(this).val();
        unloadingPicker.set("minDate", selectedTime);
    });
    $("#UnLoadingDateTime").val('');
}


//=============================================SHORTCUTS==============================================

$(document).keydown(function (event) {
    // Handling Alt + p
    if (event.altKey && event.key === 'p') {
        event.preventDefault();
        $('#ProductionPlansaveprintbtn').click();
    }

    // Handling alt + v
    if (event.altKey && event.key === 'v') {
        event.preventDefault();
        $('#ProductionPlanPreviewPorder').click();
    }

    // Handling Ctrl + s
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('#ProductionPlanSaveBtn').click();
    }

    // Handling alt + h
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        $('#btnshareProductionPlan').click();
    }

    // Handling alt + c
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        $('#ProductionPlanCancelBtn').click();
    } ``
});

function bindDropDownMultiProcess(id, moduleName, preSelectValues = []) {
    var request = { moduleName: moduleName };

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Common/GetDropDown',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status === true) {
                Common.bindDropDownMultiSuccess(response.data, id);
                if (preSelectValues.length > 0) {
                    let $select = $("#" + id);
                    $select.val(preSelectValues).trigger('change');
                    $select.select2({
                        theme: 'bootstrap4',
                        placeholder: '-- Select Process --',
                        allowClear: true,
                        closeOnSelect: false,
                        width: 'style',
                    });
                }
            } else {
                console.error("Error: " + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("Ajax error:", error);
        },
    });
}



/*================================Testing================================*/



function duplicateRowRawMetarialTesting() {

    if (!DyeDropdown || !DyeDropdown[0] || DyeDropdown[0].length === 0) {
        return;
    }

    DyeDropdown[0].forEach(function (product) {

        let numberIncr = Math.random().toString(36).substring(2);

        var defaultOption = '<option value="">--Select--</option>';
        var DyeSelectOptions = DyeDropdown[0].map(function (p) { return `<option value="${p.ProductId}">${p.ProductName}</option>`; }).join('');

        var htmlRow = `
            <div class="row RawMetarial">
                <label class="ProductionPlanDyeRequirementId d-none"></label>

                <div class="col-md-7 col-lg-7 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="DyeNameClass">DyeName<span id="Asterisk">*</span></label>
                        <select class="form-control ProductIdRawMaterial ProductId" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                            ${defaultOption}${DyeSelectOptions}
                        </select>
                    </div>
                </div>

                <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="DyeClass">Value<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control Dye" placeholder="Ex: 8.3" id="Dye${numberIncr}" name="Dye${numberIncr}"oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required />
                    </div>
                </div>

                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="TotalDyeQtyClass">TotalDyeQty<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control TotalDyeQty" placeholder="Ex: 0" id="TotalDyeQty${numberIncr}" name="TotalDyeQty${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" required />
                    </div>
                </div>
            </div>
        `;

        $('#RawMaterialDynamic').append(htmlRow);
        $(`#ProductId${numberIncr}`).val(product.ProductId);
    });
    updateRemoveButtonsRawMetarial();
}

function duplicateRowChemicalAfterTesting() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfChemical-After').length;

    var AfterTreatmentSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (AfterTreatmentChemicalProduct != null && AfterTreatmentChemicalProduct.length > 0 && AfterTreatmentChemicalProduct[0].length > 0) {
        AfterTreatmentSelectOptions = AfterTreatmentChemicalProduct[0].map(function (ChemicalId) {
            return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
        }).join('');
    }

    var htmlRow = `
        <div class="row RowOfChemical-After">
            <label class="ProductionPlanChemicalRequirementId d-none"></label>
            <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                <div class="form-group">
                    <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                    <select class="form-control ProductSelectAfter ProductIdAfter" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                        ${defaultOption}${AfterTreatmentSelectOptions}
                    </select>
                </div>
            </div> 
            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                <div class="form-group">
                    <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                    <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                        <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                            <option value="1">GPL</option>
                            <option value="2">%</option>
                        </select>
                        <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required/>
                    </div>
                </div>
            </div>
              
            <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                <div class="form-group">
                    <label class="QtyClass">Qty<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control" placeholder="Ex: 0" id="Qty${numberIncr}" name="Qty${numberIncr}" oninput="Common.allowOnlyNumberLength(this,3)" required/>
                </div>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'block' : 'none'}">
                    <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalAfter(this)" style="position: absolute; top: 22px; right: 14px;">
                        <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                    </button>
                </div>
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                    <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemoveAfter mt-0" type="button" onclick="removeRowRowChemicalAfter(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;
    $('#ChemicalDynamic-After').append(htmlRow);
    updateRemoveChemicalAfter();
}



function duplicateRowChemicalPreTesting() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfChemical-Pre').length;

    var PreTreatmentSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (PreTreatmentChemicalProduct != null && PreTreatmentChemicalProduct.length > 0 && PreTreatmentChemicalProduct[0].length > 0) {
        PreTreatmentSelectOptions = PreTreatmentChemicalProduct[0].map(function (ChemicalId) {
            return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
        }).join('');
    }

    var htmlRow = `
        <div class="row RowOfChemical-Pre">
            <label class="ProductionPlanChemicalRequirementId d-none"></label>
            <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                <div class="form-group">
                    <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                    <select class="form-control ProductSelectPre ProductIdPre" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                        ${defaultOption}${PreTreatmentSelectOptions}
                    </select>
                </div>
            </div> 
            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                    <div class="form-group">
                    <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                        <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                            <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                                <option value="1">GPL</option>
                                <option value="2">%</option>
                            </select>
                            <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" required />
                        </div>
                    </div>
            </div> 
            <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                <div class="form-group">
                    <label class="QtyClass">Qty<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control" placeholder="Ex: 0" id="Qty${numberIncr}" name="Qty${numberIncr}" oninput="Common.allowOnlyNumberLength(this,3)" required/>
                </div>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'block' : 'none'}">
                    <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalPre(this)" style="position: absolute; top: 22px; right: 14px;">
                        <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                    </button>
                </div>
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                    <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemovePre mt-0" type="button" onclick="removeRowRowChemicalPre(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;
    $('#ChemicalDynamic-Pre').append(htmlRow);
    updateRemoveChemicalPre();
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

$(document).on('click', '#ProductionPlanPreviewbtn', function () {

    $('#loader-pms').show();
    var ProductionPlanNo = $('#BatchNo').val();
    // URL to convert into QR
    var scanUrl = "http://103.174.10.91:8108/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;

    $.ajax({
        url: '/Productions/GenerateQrPdf',
        method: 'GET',
        data: { URL: scanUrl, ProductionPlanNo: ProductionPlanNo },
        xhrFields: {
            responseType: 'blob'
        },
        success: function (response) {

            $('#ShareDropdownitems').hide();

            var blob = new Blob([response], { type: 'application/pdf' });
            var blobUrl = window.URL.createObjectURL(blob);

            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.onload = function () {
                iframe.contentWindow.print();
            };
              
            $('#loader-pms').hide();
        },
        error: function (xhr) {
            $('#loader-pms').hide();
            Common.errorMsg("Failed to generate QR PDF");
        }
    });
});