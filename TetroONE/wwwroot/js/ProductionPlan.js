var ProductionPlanId = 0;
var PlantMappingId = 0;
var titleForHeaderProductTab = "";
var titleForHeaderPopRawMatrialTab = "";
var DyeDropdown = [];
var PreTreatmentChemicalProduct = [];
var AfterTreatmentChemicalProduct = [];
var DyeBathChemicalProduct = [];
var DyeChemicalProduct = [];
var FinishingChemicalProduct = [];
var ItemListAdd = [];
var AlreadyAddedIds = [];
var ProcessTypeDropdown = [];
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
var skipChemicalTabValidation = false;

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
        $('.RowOfChemical-DyeBath').remove();
        $('.RowOfChemical-Dye').remove();
        $('.RowOfChemical-Finishing').remove();

        //duplicateRowChemicalPre();
        //duplicateRowChemicalAfter();
        //duplicateRowChemicalDyeBath();
        //duplicateRowChemicalDye();
        //
        //$('#ChemicalDynamic-Pre').show();
        //$('#ChemicalDynamic-After').hide();
        //$('#ChemicalDynamic-DyeBath').hide();
        //$('#ChemicalDynamic-Dye').hide();

        $("#ProductionPlanSaveBtn span:first").text("Save");

        //$('#emptyDiv').removeClass('col-lg-3 col-md-3 col-6').addClass('col-lg-5 col-md-5 col-6');
        //$('#ProductionPlanStatusIdDiv').hide();

        $('#LoadingDateTimeDiv').hide();
        $('#UnLoadingDateTimeDiv').hide();
        $('#SubtotalRow').hide();
        $('#MLRWaterLevelDiv').hide();
        $('#TotalWeightDiv').hide();
        $('#ColourDiv').hide();
        $('#MachineDiv').hide();
        $('#ProductionPlanjobCardBtn').hide();

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

        $('#ProductionPlanStatusId').val('1').trigger('change');
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
        $('#loader-pms').show();
        ProductionPlanId = $(this).data('id');

        Common.removevalidation('TopStatic');
        Common.removevalidation('FormStatus');

        //$('#AddAttachment, #AddNotes, #HideAttachlable, #HideNotesLable').hide();
        //$('#AddAttachLable, #AddNotesLable').show();
        $('#AddAttachment, #AddNotes, #MLRWaterLevelDiv').show();
        $('#AddAttachLable, #AddNotesLable, #HideAttachlable, #HideNotesLable').hide();

        $("#ProductionPlanSaveBtn span:first").text("Update");
        $('#ProductionPlanjobCardBtn').show();

        $('.Status-Div').show();
        $('#MLRWaterLevelDiv').show();
        $('#TotalWeightDiv').show();
        $('#ColourDiv').show();
        $('#MachineDiv').show();
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
        $('.RowOfChemical-DyeBath').remove();
        $('.RowOfChemical-Dye').remove();
        $('.RowOfChemical-Finishing').remove();
        $('#ChemicalDynamic-Pre').show();
        $('#ChemicalDynamic-After').hide();
        $('#ChemicalDynamic-DyeBath').hide();
        $('#ChemicalDynamic-Dye').hide();
        $('#ChemicalDynamic-Finishing').hide();

        $('#ProductionPlanPreviewbtn').show();

        //$('#emptyDiv').removeClass('col-lg-5 col-md-5 col-6').addClass('col-lg-3 col-md-3 col-6');
        //$('#ProductionPlanStatusIdDiv').show();

        $('#LoadingDateTimeDiv').show();
        $('#UnLoadingDateTimeDiv').show();
        $('#SubtotalRow').show();

        $("#QRCode").html("");

        //const today = new Date().toISOString().split('T')[0];
        //$("#BatchDate").val(today);
        //$('#MachineId').prop('disabled', false);

        Common.ajaxCall("GET", "/Productions/GetDefaultChemicalDetails", { ProcessType: null, ProductionPlanId: parseInt(ProductionPlanId), ColourValue: null }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);

                PreTreatmentChemicalProduct = [];
                DyeChemicalProduct = [];
                DyeBathChemicalProduct = [];
                AfterTreatmentChemicalProduct = [];
                FinishingChemicalProduct = [];

                PreTreatmentChemicalProduct = data[0];
                DyeChemicalProduct = data[1];
                DyeBathChemicalProduct = data[2];
                AfterTreatmentChemicalProduct = data[3];
                FinishingChemicalProduct = data[4];

                var fnData = Common.getDateFilter('dateDisplay2');
                Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: parseInt(ProductionPlanId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanNotNullSuccess, null);
            }
        }, null);

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


    $(document).on('click', '#ChemicalModal .navbar-tab', function (e) {

        e.preventDefault();
        e.stopImmediatePropagation();

        var tabOrder = ["Pre-Treatment", "Dye", "DyeBath", "After-Treatment", "Finishing"];

        var currentTabText = titleForHeaderPopRawMatrialTab ||
            $('#ChemicalModal .navbar-tab.active').text().trim();

        var clickedTabText = $(this).text().trim();

        var currentIndex = tabOrder.indexOf(currentTabText);
        var clickedIndex = tabOrder.indexOf(clickedTabText);

        if (skipChemicalTabValidation) {
            skipChemicalTabValidation = false;
            activateChemicalTab(clickedTabText);
            return;
        }

        if (!validateCurrentChemicalTab()) {
            Common.errorMsg("Please fill all required fields in the current tab.");

            // 🔁 Always activate the saved header tab
            activateChemicalTab(currentTabText);
            return false;
        }

        // ❌ If user tries to skip ahead more than one tab
        if (clickedIndex > currentIndex + 1) {
            Common.warningMsg("Please follow the sequence of tabs.");

            // 👉 Activate next allowed tab automatically
            var nextTabText = tabOrder[currentIndex + 1];
            activateChemicalTab(nextTabText);
            return false;
        }

        // ✅ Valid move (either next or previous)
        activateChemicalTab(clickedTabText);
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
        $('#loader-pms').show();

        var TableLenthDynamicRow = $('.AddedRow').length;
        if (TableLenthDynamicRow == 0) {
            Common.warningMsg('Choose Atleast One Product');
            $('#loader-pms').hide();
            return false;
        }

        var ProductionPlanStatusId = $('#ProductionPlanStatusId').val();

        if (ProductionPlanStatusId == 3) {
            if (!validateUpdateAllChemicalTabs()) {
                Common.warningMsg('Please Fill the all Chemical Details');
                $('#loader-pms').hide();
                return false;
            }
        }

        if ($("#TopStatic").valid() && $("#TableInputs").valid() && $("#FormStatus").valid()) { 
            getExistFiles();

            var objvalue = {
                ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null,
                PlantId: parseInt(PlantMappingId),
                ProductionNo: $('#BatchNo').val() || null,
                ProductionDate: $('#BatchDate').val() || null,
                TotalWeight: parseFloat($('#TotalWeight').val()) || null,
                ColorId: parseInt($('#ColorId').val()) || null,
                MachineId: parseInt($('#MachineId').val()) || null,
                MLR: parseFloat($('#MLR').val()) || null,
                WaterLevel: parseInt($('#WaterLevel').val()) || null,
                //LoadingDateTime: $('#LoadingDateTime').val() || null,
                //UnLoadingDateTime: $('#UnLoadingDateTime').val() || null,
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
                    Dia: parseFloat($rowTable.find('.Dia').val()) || null,
                    GSM: parseFloat($rowTable.find('.GSM').val()) || null,
                    NoOfRolls: parseInt($rowTable.find('.NoOfRolls').val()) || null,
                    Width: ($rowTable.find('.Width').val() || '').toLowerCase() === 'tubler' ? 2 : 1,
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

            // ---------- DYE (ProcessType = 2) ----------
            $('#ChemicalDynamic-Dye .RowOfChemical-Dye').each(function () {
                var $row = $(this);

                ProductionPlanChemicalRequirementDetails.push({
                    ProductionPlanChemicalRequirementId: parseInt($row.find('.ProductionPlanChemicalRequirementId').text()) || null,
                    ProcessType: 2,
                    ChemicalId: parseInt($row.find('.ProductIdDye').val()) || null,
                    ChemicalType: parseInt($row.find('.DysType').val()) || null,
                    GPL: parseFloat($row.find('input[id^="GPL"]').val()) || null,
                    TotalQty: parseFloat($row.find('input[id^="Qty"]').val()) || null,
                    ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null
                });
            });

            // ---------- DYEBATH (ProcessType = 3) ----------
            $('#ChemicalDynamic-DyeBath .RowOfChemical-DyeBath').each(function () {
                var $row = $(this);

                ProductionPlanChemicalRequirementDetails.push({
                    ProductionPlanChemicalRequirementId: parseInt($row.find('.ProductionPlanChemicalRequirementId').text()) || null,
                    ProcessType: 3,
                    ChemicalId: parseInt($row.find('.ProductIdDyeBath').val()) || null,
                    ChemicalType: parseInt($row.find('.DysType').val()) || null,
                    GPL: parseFloat($row.find('input[id^="GPL"]').val()) || null,
                    TotalQty: parseFloat($row.find('input[id^="Qty"]').val()) || null,
                    ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null
                });
            });

            // ---------- AFTER-TREATMENT (ProcessType = 4) ----------
            $('#ChemicalDynamic-After .RowOfChemical-After').each(function () {
                var $row = $(this);

                ProductionPlanChemicalRequirementDetails.push({
                    ProductionPlanChemicalRequirementId: parseInt($row.find('.ProductionPlanChemicalRequirementId').text()) || null,
                    ProcessType: 4,
                    ChemicalId: parseInt($row.find('.ProductIdAfter').val()) || null,
                    ChemicalType: parseInt($row.find('.DysType').val()) || null,
                    GPL: parseFloat($row.find('input[id^="GPL"]').val()) || null,
                    TotalQty: parseFloat($row.find('input[id^="Qty"]').val()) || null,
                    ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null
                });
            });

            // ---------- FINISHING (ProcessType = 5) ----------
            $('#ChemicalDynamic-Finishing .RowOfChemical-Finishing').each(function () {
                var $row = $(this);

                ProductionPlanChemicalRequirementDetails.push({
                    ProductionPlanChemicalRequirementId: parseInt($row.find('.ProductionPlanChemicalRequirementId').text()) || null,
                    ProcessType: 5,
                    ChemicalId: parseInt($row.find('.ProductIdFinishing').val()) || null,
                    ChemicalType: parseInt($row.find('.DysType').val()) || null,
                    GPL: parseFloat($row.find('input[id^="GPL"]').val()) || null,
                    TotalQty: parseFloat($row.find('input[id^="Qty"]').val()) || null,
                    ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null
                });
            });

            formDataMultiple.append("ProductionPlanStaticData", JSON.stringify(objvalue));
            formDataMultiple.append("ProductionPlanFabricDetails", JSON.stringify(ProductionPlanFabricDetails));
            formDataMultiple.append("ProductionPlanFabricProcessMappingDetails", JSON.stringify(ProductionPlanFabricProcessMappingDetails));
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
                        $('#loader-pms').hide();
                        formDataMultiple = new FormData();
                        Common.errorMsg(response.message);
                    }
                },

                error: function (response) {
                    $('#loader-pms').hide();
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

function activateChemicalTab(tabText) {
    $('#tableFilter').val('');
    titleForHeaderPopRawMatrialTab = tabText;

    // Activate the tab visually
    $('.navbar-tab').removeClass('active');
    $('#ChemicalModal .navbar-tab').each(function () {
        if ($(this).text().trim() === tabText) {
            $(this).addClass('active');
        }
    });

    $('#ChemicalDynamic-Pre, #ChemicalDynamic-Dye, #ChemicalDynamic-DyeBath, #ChemicalDynamic-After, #ChemicalDynamic-Finishing').hide();

    if (tabText === "Pre-Treatment") {
        $('#ChemicalDynamic-Pre').show();
        if ($('.RowOfChemical-Pre').length === 0) {
            Common.ajaxCall("GET", "/Productions/GetDefaultChemicalDetails",
                { ProcessType: 1, ProductionPlanId: parseInt(ProductionPlanId), ColourValue: null },
                function (response) {
                    if (response.status) {
                        PreTreatmentChemicalProduct = JSON.parse(response.data);
                        duplicateRowChemicalPre();
                    }
                });
        }
    } else if (tabText === "Dye") {
        $('#ChemicalDynamic-Dye').show();
        if ($('.RowOfChemical-Dye').length === 0) {
            Common.ajaxCall("GET", "/Productions/GetDefaultChemicalDetails",
                { ProcessType: 2, ProductionPlanId: parseInt(ProductionPlanId), ColourValue: null },
                function (response) {
                    if (response.status) {
                        DyeChemicalProduct = JSON.parse(response.data);
                        duplicateRowChemicalDye();
                    }
                });
        }
    } else if (tabText === "DyeBath") {
        $('#ChemicalDynamic-DyeBath').show();
        if ($('.RowOfChemical-DyeBath').length === 0) {
            let colourValue = 0;
            $('#ChemicalDynamic-Dye .RowOfChemical-Dye input[id^="GPL"]').each(function () {
                colourValue += parseFloat($(this).val()) || 0;
            });
            Common.ajaxCall("GET", "/Productions/GetDefaultChemicalDetails",
                { ProcessType: 3, ProductionPlanId: parseInt(ProductionPlanId), ColourValue: colourValue.toFixed(3) },
                function (response) {
                    if (response.status) {
                        DyeBathChemicalProduct = JSON.parse(response.data);
                        duplicateRowChemicalDyeBath();
                    }
                });
        }
    } else if (tabText === "After-Treatment") {
        $('#ChemicalDynamic-After').show();
        if ($('.RowOfChemical-After').length === 0) {
            let colourValue = 0;
            $('#ChemicalDynamic-Dye .RowOfChemical-Dye input[id^="GPL"]').each(function () {
                colourValue += parseFloat($(this).val()) || 0;
            });
            Common.ajaxCall("GET", "/Productions/GetDefaultChemicalDetails",
                { ProcessType: 4, ProductionPlanId: parseInt(ProductionPlanId), ColourValue: colourValue.toFixed(3) },
                function (response) {
                    if (response.status) {
                        AfterTreatmentChemicalProduct = JSON.parse(response.data);
                        duplicateRowChemicalAfter();
                    }
                });
        }
    } else if (tabText === "Finishing") {
        $('#ChemicalDynamic-Finishing').show();
        if ($('.RowOfChemical-Finishing').length === 0) {
            Common.ajaxCall("GET", "/Productions/GetDefaultChemicalDetails",
                { ProcessType: 5, ProductionPlanId: parseInt(ProductionPlanId), ColourValue: null },
                function (response) {
                    if (response.status) {
                        FinishingChemicalProduct = JSON.parse(response.data);
                        duplicateRowChemicalFinishing();
                    }
                });
        }
    }
}

function validateUpdateAllChemicalTabs() {

    var tabs = [
        { container: '#ChemicalDynamic-Pre', rows: '.RowOfChemical-Pre' },
        { container: '#ChemicalDynamic-Dye', rows: '.RowOfChemical-Dye' },
        { container: '#ChemicalDynamic-DyeBath', rows: '.RowOfChemical-DyeBath' },
        { container: '#ChemicalDynamic-After', rows: '.RowOfChemical-After' },
        { container: '#ChemicalDynamic-Finishing', rows: '.RowOfChemical-Finishing' }
    ];

    for (var i = 0; i < tabs.length; i++) {

        // 🔥 DO NOT SKIP HIDDEN TABS

        if (!validateUpdateChemicalTab(tabs[i].container, tabs[i].rows)) {
            return false;
        }
    }

    return true;
}


function validateUpdateChemicalTab(container, rowClass) {

    let isValid = true;

    $(container).find(rowClass).each(function () {

        let product = $(this).find('select[id^="ProductId"]').val();
        let gpl = $(this).find('input[id^="GPL"]').val();
        let qty = $(this).find('input[id^="Qty"]').val();

        product = product ? product.trim() : "";
        gpl = gpl ? gpl.trim() : "";
        qty = qty ? qty.trim() : "";

        // If ANY field empty → fail
        if (product === "" || gpl === "" || qty === "") {
            isValid = false;
            return false; // break loop
        }

    });

    return isValid;
}



function validateCurrentChemicalTab() {
    if ($('#ChemicalDynamic-Pre').is(':visible'))
        return validateChemicalTab('#ChemicalDynamic-Pre', '.RowOfChemical-Pre').valid;

    if ($('#ChemicalDynamic-Dye').is(':visible'))
        return validateChemicalTab('#ChemicalDynamic-Dye', '.RowOfChemical-Dye').valid;

    if ($('#ChemicalDynamic-DyeBath').is(':visible'))
        return validateChemicalTab('#ChemicalDynamic-DyeBath', '.RowOfChemical-DyeBath').valid;

    if ($('#ChemicalDynamic-After').is(':visible'))
        return validateChemicalTab('#ChemicalDynamic-After', '.RowOfChemical-After').valid;

    if ($('#ChemicalDynamic-Finishing').is(':visible'))
        return validateChemicalTab('#ChemicalDynamic-Finishing', '.RowOfChemical-Finishing').valid;

    return true;
}

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

        if (![7, 8, 9].includes(header.ProductionPlanStatusId)) {
            $('#ProductionPlanSaveBtn').show();
            $('#ShippingColumn, #MainProductionPlanPopTable, .DynmicTableRow, #SubtotalRow').css({
                'pointer-events': 'auto',
                'opacity': 1
            });
        } else {
            $('#ProductionPlanSaveBtn').hide();
            $('#ShippingColumn, #MainProductionPlanPopTable, .DynmicTableRow').css({
                'pointer-events': 'none',
                'opacity': 0.9
            });
            $('#SubtotalRow').css({
                'pointer-events': 'auto',
                'opacity': 1
            });
        }

        //if (header.LoadingDateTime == null || header.LoadingDateTime == '') {
        //    SetDateFroLoadingAndUnLoading();
        //}

        Inventory.toggleField(header.Comments, "#AddNotesText", "#AddNotes", "#AddNotesLable", "HideNotesLable");
        Inventory.toggleFieldForAttachment(data[4][0]?.AttachmentId, "#AddAttachLable", "#AddAttachment", "HideAttachlable");
        Inventory.bindAttachments(data[4]);

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
                    <td><input type="text" class="form-control Dia" value="${item.Dia}" disabled></td>
                    <td><input type="text" class="form-control GSM" value="${item.GSM}" disabled></td>
                    <td><input type="text" class="form-control NoOfRolls" value="${item.NoOfRolls}" disabled></td>
                    <td><input type="text" class="form-control Width" value="${item.Width}" disabled></td>
                    <td><input type="text" class="form-control qty" value="${item.Quantity.toFixed(3) || ''}" required oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td> 
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

        if (data[3] && data[3].length > 0 && data[3][0].ProductionPlanChemicalRequirementId != null) {
            // Clear existing rows
            $('#ChemicalDynamic-Pre').html('');
            $('#ChemicalDynamic-After').html('');
            $('#ChemicalDynamic-Dye').html('');
            $('#ChemicalDynamic-DyeBath').html('');
            $('#ChemicalDynamic-Finishing').html('');

            data[3].forEach(item => {
                if (item.ProcessType === 1) {
                    createChemicalRow('Pre', item);
                } else if (item.ProcessType === 2) {
                    createChemicalRow('Dye', item);
                } else if (item.ProcessType === 3) {
                    createChemicalRow('DyeBath', item);
                } else if (item.ProcessType === 4) {
                    createChemicalRow('After', item);
                } else if (item.ProcessType === 5) {
                    createChemicalRow('Finishing', item);
                }
            });
            $('#loader-pms').hide();
        } else {
            $('.RowOfChemical-After').remove();
            $('.RowOfChemical-Pre').remove();
            $('.RowOfChemical-DyeBath').remove();
            $('.RowOfChemical-Dye').remove();
            $('.RowOfChemical-Finishing').remove();

            $('#loader-pms').hide();

            //duplicateRowChemicalPre();
            //duplicateRowChemicalAfter();
            //duplicateRowChemicalDyeBath();
            //duplicateRowChemicalDye();
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

function createChemicalRow(rowType, chemicalData) {
    let numberIncr = Math.random().toString(36).substring(2);
    let rowadd = $(`.RowOfChemical-${rowType}`).length;

    let selectOptions = "";
    let defaultOption = '<option value="">--Select--</option>';

    let products = [];
    switch (rowType) {
        case 'Pre':
            products = Array.isArray(PreTreatmentChemicalProduct) ? PreTreatmentChemicalProduct : [];
            break;
        case 'After':
            products = Array.isArray(AfterTreatmentChemicalProduct) ? AfterTreatmentChemicalProduct : [];
            break;
        case 'Dye':
            products = Array.isArray(DyeChemicalProduct) ? DyeChemicalProduct : [];
            break;
        case 'DyeBath':
            products = Array.isArray(DyeBathChemicalProduct) ? DyeBathChemicalProduct : [];
            break;
        case 'Finishing':
            products = Array.isArray(FinishingChemicalProduct) ? FinishingChemicalProduct : [];
            break;
    }

    selectOptions = Array.isArray(products)
        ? products.map(c => `<option value="${c.ChemicalId}">${c.ChemicalName}</option>`).join('')
        : '';

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
                            <option value="2">%</option>
                            <option value="1">GPL</option>
                        </select>
                        <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" value="${chemicalData.GPL != null ? Number(chemicalData.GPL).toFixed(3) : ''}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required/>
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

    $(`#ChemicalDynamic-${rowType} .ProductId${rowType}`).last().val(String(chemicalData.ChemicalId));

    $(`#ChemicalDynamic-${rowType} .DysType`).last().val(String(chemicalData.ChemicalType));

    switch (rowType) {
        case 'Pre':
            updateRemoveChemicalPre();
            break;
        case 'After':
            updateRemoveChemicalAfter();
            break;
        case 'Dyr':
            updateRemoveChemicalDye();
            break;
        case 'DyeBath':
            updateRemoveChemicalDyeBath();
            break;
        case 'Finishing':
            updateRemoveChemicalFinishing();
            break;
    };
}

function LoadPopupItems(allItems) {
    $("#ProductionPlanAddItem-table-body").empty();

    allItems.forEach((item, index) => {
        let uniqueId = `ItemId-${item.InwardFabricId}`;

        let fabricQty = item.FabricQty;
        let matches = fabricQty.match(/^([\d,]+\.?\d*)\s*(\w+)$/);
        let qtyValue = "0";

        if (matches) {
            qtyValue = matches[1].replace(/,/g, "");  // removes commas
        }

        const row = `
            <tr class="AddItemRow" data-id="${item.ProcessList}">
                <td>
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="mr-2 ItemCheckbox" id="${uniqueId}">
                        <label for="${uniqueId}" class="MachineName mb-0" style="color : ${item.StatusColor}!important; white-space: pre-line;">${item.MachineName}</label>
                    </div>
                </td> 
                <td><label class="Customer mb-0" style="white-space: pre-line;">${item.Customer}</label></td>
                <td><label class="d-none InWardNo">${item.InWardId}</label><label class="LotNo mb-0">${item.InWardNo}</label></td>
                <td><label class="d-none InWardTypeNo"></label><label class="InWardType mb-0">${item.InWardType}</label></td>
                <td><label class="d-none ColorId">${item.ColorId}</label><label class="Colour mb-0">${item.ColorName}</label></td>
                <td><label class="d-none FabricId">${item.FabricId}</label><label class="FabricType mb-0">${item.Fabric}</label></td>
                <td><label class="Dia mb-0">${item.Dia}</label></td>
                <td><label class="GSM mb-0">${item.GSM}</label></td>
                <td><label class="NoOfRolls mb-0">${item.NoOfRolls}</label></td>
                <td><label class="Width mb-0">${item.Width}</label></td>
                <td><label class="FabricQty mb-0">${item.FabricQty}</label></td>
                <td><label class="FabricQty mb-0">${item.InWardQty}</label></td> 
                <td> 
                    <div id="ember325" class="input-group ember-view" style="flex-wrap: nowrap;width: 100px;">
                        <input type="text" class="form-control AvailableQuantity" value="${qtyValue}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)">
                        <button id="PrimaryUnitSymbol" class="btn btn-secondary p-0" type="button" style="padding: 4px !important;border-top-left-radius: 0;border-bottom-left-radius: 0;font-size: 12px;width: 29px;height: 26px;"> KG </button>
                    </div>
                </td>
            </tr>
        `;
        $("#ProductionPlanAddItem-table-body").append(row);
    });

    $("#ProductionPlanAddItemModal").show();
}

$(document).on('input', '.AvailableQuantity', function () {

    var $row = $(this).closest('tr');

    var fabricQtyText = $row.find('.FabricQty').first().text();
    var fabricQty = parseFloat(
        fabricQtyText.replace(/,/g, '').replace(/[^0-9.]/g, '')
    ) || 0;

    var val = $(this).val();

    if (val === '') return;

    var enteredQty = parseFloat(val);
    if (isNaN(enteredQty)) return;

    if (enteredQty > fabricQty) {
        $(this).val(parseFloat(fabricQty).toFixed(3));
    }
});

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
        Dia: $row.find(".Dia").text() || '',
        NoOfRolls: $row.find(".NoOfRolls").text() || '',
        Width: $row.find(".Width").text() || '',
        Quantity: parseFloat($row.find(".Quantity").text()) || 0,
        AvailableQuantity: parseFloat(($row.find(".AvailableQuantity").val() || "0").replace(/,/g, "")) || 0,
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
    // CHECK: Are all selected Customers same?
    // -----------------------------------------

    let commonCustomer = checkedRows[0].find('.Customer').text().trim();

    let allSameCustomer = checkedRows.every(row =>
        row.find('.Customer').text().trim() === commonCustomer
    );

    if (!allSameCustomer) {
        Common.warningMsg('Selected rows must have the same Customer.');
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
                    Dia: $(this).find('.Dia').text(),
                    NoOfRolls: $(this).find('.NoOfRolls').text(),
                    Width: $(this).find('.Width').text(),
                    AvailableQuantity: $(this).find('.AvailableQuantity').val().replace(/,/g, ''),
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
                        <td><input type="text" class="form-control Dia" value="${item.Dia}" disabled></td>
                        <td><input type="text" class="form-control GSM" value="${item.GSM}" disabled></td>
                        <td><input type="text" class="form-control NoOfRolls" value="${item.NoOfRolls}" disabled></td>
                        <td><input type="text" class="form-control Width" value="${item.Width}" disabled></td>
                        <td><input type="text" class="form-control qty" value="${item.AvailableQuantity.toFixed(3)}" required oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)"></td>
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

            if (AlreadyAddedIds.length > 0 && ProductionPlanId != 0) {
                $('#MLRWaterLevelDiv').show();
            } else {
                $('#MLRWaterLevelDiv').hide();
            }

            if (AlreadyAddedIds.length > 0) {
                $('#TotalWeightDiv').show();
                $('#ColourDiv').show();
                $('#MachineDiv').show();
            } else {
                $('#TotalWeightDiv').hide();
                $('#ColourDiv').hide();
                $('#MachineDiv').hide();
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
        $('#TotalWeightDiv').show();
        $('#ColourDiv').show();
        $('#MachineDiv').show();
    } else {
        $('#MLRWaterLevelDiv').hide();
        $('#MLR').val('');
        $('#TotalWeightDiv').hide();
        $('#ColourDiv').hide();
        $('#MachineDiv').hide();
    }

    if (AlreadyAddedIds.length > 0 && ProductionPlanId != 0) {
        $('#MLRWaterLevelDiv').show();
    } else {
        $('#MLRWaterLevelDiv').hide();
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

        if (data[0][0].InwardFabricId == null) {
            Common.warningMsg('No grey fabric stock is available.');
        }

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

$(document).on('click', '#ChemicalInfo', function () {
    var TableLenthDynamicRow = $('.AddedRow').length;
    var MLR = $('#MLR').val();

    if (TableLenthDynamicRow == 0) {
        Common.warningMsg('Choose at least one product');
        $('#loader-pms').hide();
        return false;
    }

    if (MLR == "") {
        Common.warningMsg('Fill the MLR');
        return false;
    }

    skipChemicalTabValidation = true;
    $('#ChemicalModal .navbar-tab').first().trigger('click');
    $('#ChemicalModal').show();
});

$(document).on('click', '#ChemicalClose', function () {
    $('#ChemicalModal .navbar-tab').first().trigger('click');
    $('#ChemicalModal').hide();
    $('#FromChemicalDynamic').find('input, select, textarea').each(function () {
        $(this).removeClass('error');
    });
});

function validateChemicalTab(containerSelector, rowSelector) {
    var isValid = true;
    var isFilled = false;

    $(containerSelector).find(rowSelector + ':visible').each(function () {
        var rowValid = true;
        var rowFilled = true;

        $(this).find('input, select').each(function () {
            var value = $(this).val().trim();

            if ($(this).prop('required') && value === "") {
                rowFilled = false;
            }

            if (!this.checkValidity()) {
                rowValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });

        if (!rowValid) isValid = false;
        if (rowFilled) isFilled = true;
    });

    return {
        valid: isValid,
        filled: isFilled
    };
}

function validateChemicalTab1(containerSelector, rowSelector) {

    var isValid = true;

    $(containerSelector).find(rowSelector + ':visible').each(function () {

        $(this).find('input, select').each(function () {

            // Skip non-required
            if (!$(this).prop('required')) return true;

            var value = $(this).val();

            if (value === null || value.trim() === "") {
                isValid = false;
                $(this).addClass('error');
            }
            else if (!this.checkValidity()) {
                isValid = false;
                $(this).addClass('error');
            }
            else {
                $(this).removeClass('error');
            }

        });

    });

    return {
        valid: isValid
    };
}

$(document).on('click', '#BtnAddChemical', function () {

    var tabOrder = [
        { container: '#ChemicalDynamic-Pre', rowClass: '.RowOfChemical-Pre', name: "Pre-Treatment" },
        { container: '#ChemicalDynamic-Dye', rowClass: '.RowOfChemical-Dye', name: "Dye" },
        { container: '#ChemicalDynamic-DyeBath', rowClass: '.RowOfChemical-DyeBath', name: "DyeBath" },
        { container: '#ChemicalDynamic-After', rowClass: '.RowOfChemical-After', name: "After-Treatment" },
        { container: '#ChemicalDynamic-Finishing', rowClass: '.RowOfChemical-Finishing', name: "Finishing" }
    ];

    for (var i = 0; i < tabOrder.length; i++) {

        var tab = tabOrder[i];

        if ($(tab.rowClass).length === 0) {
            //Common.errorMsg(tab.name + " tab has no rows.");
            activateChemicalTab(tab.name);
            return false;
        }

        var result = validateChemicalTab1(tab.container, tab.rowClass);

        if (!result.valid) {
            Common.errorMsg("Please fill all required fields in " + tab.name + " tab.");
            activateChemicalTab(tab.name);
            return false;
        }
    }

    $('#ChemicalModal').hide();
    Common.successMsg("Chemical Details are Saved Successfully.");
});

/* Qty change (dynamic rows supported) */
$(document).on('keyup input change', '#ProductionPlanProductTablebody .qty, #MLR, #TotalWeight', function () {
    recalculateAll();
});

// Dynamically handle input, change, or keyup on any chemical/dye input or type selector
$(document).on('keyup input change',
    '#ChemicalDynamic-Pre input, #ChemicalDynamic-After input, #ChemicalDynamic-Dye input, #ChemicalDynamic-DyeBath input, #ChemicalDynamic-Finishing input,' +
    '#ChemicalDynamic-Pre .DysType, #ChemicalDynamic-After .DysType, #ChemicalDynamic-Dye .DysType, #ChemicalDynamic-DyeBath .DysType, #ChemicalDynamic-Finishing .DysType',
    function () {
        let $row = $(this).closest('.RowOfChemical-Pre, .RowOfChemical-After, .RowOfChemical-Dye, .RowOfChemical-DyeBath, .RowOfChemical-Finishing');
        if (!$row.length) return;

        // Decide whether it's a chemical or dye row
        if ($row.hasClass('RowOfChemical-Pre') || $row.hasClass('RowOfChemical-After') || $row.hasClass('RowOfChemical-Dye') || $row.hasClass('RowOfChemical-DyeBath') || $row.hasClass('RowOfChemical-Finishing')) {
            calculateChemicalQty($row);
        } else if ($row.hasClass('RowOfDye')) {
            calculateDyeQty($row);
        }
    });

// Recalculate everything for all tabs
function recalculateAll() {
    let totalWeight = 0;

    $('#ProductionPlanProductTablebody .qty').each(function () {
        totalWeight += parseFloat($(this).val()) || 0;
    });

    $('#TotalWeight').val(totalWeight.toFixed(3));

    // Calculate dye quantities for all tabs
    $('#ChemicalDynamic-Dye .RowOfDye, #ChemicalDynamic-DyeBath .RowOfDye').each(function () {
        calculateDyeQty($(this));
    });

    // Calculate chemical quantities for all tabs
    $('#ChemicalDynamic-Pre .RowOfChemical-Pre, #ChemicalDynamic-After .RowOfChemical-After, #ChemicalDynamic-Dye .RowOfChemical-Dye, #ChemicalDynamic-DyeBath .RowOfChemical-DyeBath')
        .each(function () {
            calculateChemicalQty($(this));
        });
}

// Calculate dye quantity
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

// Calculate chemical quantity
function calculateChemicalQty($row) {
    if (!$row || !$row.length) return;

    let value = parseFloat($row.find('.input-group input[type="text"]').first().val()) || 0;
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

function duplicateRowChemicalPre() {
    if (!PreTreatmentChemicalProduct || !PreTreatmentChemicalProduct[0] || PreTreatmentChemicalProduct[0].length === 0) {
        return;
    }

    const defaultChemicals = PreTreatmentChemicalProduct[0].filter(c => c.IsDefault === true);

    if (defaultChemicals.length === 0) {
        duplicateRowChemicalPreTesting();
        return;
    }

    defaultChemicals.forEach(function (chemical) {
        let numberIncr = Math.random().toString(36).substring(2);
        var rowadd = $('.RowOfChemical-Pre').length;

        var defaultOption = '<option value="">--Select--</option>';
        var PreTreatmentSelectOptions = PreTreatmentChemicalProduct[0].map(function (c) {
            return `<option value="${c.ChemicalId}">${c.ChemicalName}</option>`;
        }).join('');

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
                                 <option value="2">%</option>
                                 <option value="1">GPL</option>
                              </select>
                              <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required />
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

        // Set product
        $(`#ProductId${numberIncr}`).val(chemical.ChemicalId);

        // Set % or GPL based on DefaultUnit
        $(`#DysType${numberIncr}`).val(chemical.DefaultUnit);

        // Set input value
        $(`#GPL${numberIncr}`).val(chemical.UnitValue !== null ? Number(chemical.UnitValue).toFixed(3) : '');

        // Automatically calculate Qty based on DefaultUnit and UnitValue
        calculateChemicalQty($(`#Qty${numberIncr}`).closest('.RowOfChemical-Pre'));
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
        duplicateRowChemicalAfterTesting();
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
                                  <option value="2">%</option>
                                  <option value="1">GPL</option>
                               </select>
                               <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required/>
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

        // Set product
        $(`#ProductId${numberIncr}`).val(chemical.ChemicalId);

        // Set % or GPL based on DefaultUnit
        $(`#DysType${numberIncr}`).val(chemical.DefaultUnit);

        // Set input value
        $(`#GPL${numberIncr}`).val(chemical.UnitValue !== null ? Number(chemical.UnitValue).toFixed(3) : '');

        // Automatically calculate Qty based on DefaultUnit and UnitValue
        calculateChemicalQty($(`#Qty${numberIncr}`).closest('.RowOfChemical-After'));
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


function duplicateRowChemicalDyeBath() {

    if (DyeBathChemicalProduct == null || DyeBathChemicalProduct.length === 0 || DyeBathChemicalProduct[0].length === 0) {
        return;
    }

    const defaultChemicals = DyeBathChemicalProduct[0].filter(c => c.IsDefault === true);

    if (defaultChemicals.length === 0) {
        duplicateRowChemicalDyeBathTesting();
        return;
    }

    defaultChemicals.forEach(function (chemical) {

        let numberIncr = Math.random().toString(36).substring(2);
        var rowadd = $('.RowOfChemical-DyeBath').length;

        var DyeBathChemicalProductSelectOptions = "";
        var defaultOption = '<option value="">--Select--</option>';

        DyeBathChemicalProductSelectOptions = DyeBathChemicalProduct[0].map(function (ChemicalId) { return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`; }).join('');

        var htmlRow = `
            <div class="row RowOfChemical-DyeBath">
                <label class="ProductionPlanChemicalRequirementId d-none"></label>

                <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                        <select class="form-control ProductSelectDyeBath ProductIdDyeBath" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                            ${defaultOption}${DyeBathChemicalProductSelectOptions}
                        </select>
                    </div>
                </div>
                  
                 <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                      <div class="form-group">
                         <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                          <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                               <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                                  <option value="2">%</option>
                                  <option value="1">GPL</option>
                               </select>
                               <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required/>
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
                        <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalDyeBathTesting(this)" style="position: absolute; top: 22px; right: 14px;">
                            <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                        </button>
                    </div>
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                        <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemoveDyeBath mt-0" type="button" onclick="removeRowRowChemicalDyeBath(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;

        $('#ChemicalDynamic-DyeBath').append(htmlRow);

        // Set product
        $(`#ProductId${numberIncr}`).val(chemical.ChemicalId);

        // Set % or GPL based on DefaultUnit
        $(`#DysType${numberIncr}`).val(chemical.DefaultUnit);

        // Set input value
        $(`#GPL${numberIncr}`).val(chemical.UnitValue !== null ? Number(chemical.UnitValue).toFixed(3) : '');

        // Automatically calculate Qty based on DefaultUnit and UnitValue
        calculateChemicalQty($(`#Qty${numberIncr}`).closest('.RowOfChemical-DyeBath'));
    });

    updateRemoveChemicalDyeBath();
}

function updateRemoveChemicalDyeBath() {
    var rows = $('.RowOfChemical-DyeBath');

    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.RowOfChemicalRemoveDyeBath');
        var labels = $(this).find('.ProductClass, .GPLClass, .QtyClass');

        if (index === 0) {
            labels.show();
            removeButtonDiv.hide();
        } else {
            labels.hide();
            removeButtonDiv.show();
        }
    });
    refreshProductDropdowns(".ProductSelectDyeBath");
}

function removeRowRowChemicalDyeBath(button) {
    var totalRows = $('.RowOfChemical-DyeBath').length;
    if (totalRows > 1) {
        $(button).closest('.RowOfChemical-DyeBath').remove();
    }
    updateRemoveChemicalDyeBath();
    refreshProductDropdowns(".ProductSelectDyeBath");
}

function duplicateRowChemicalDye() {

    if (DyeChemicalProduct == null || DyeChemicalProduct.length === 0 || DyeChemicalProduct[0].length === 0) {
        return;
    }

    const defaultChemicals = DyeChemicalProduct[0].filter(c => c.IsDefault === true);

    if (defaultChemicals.length === 0) {
        duplicateRowChemicalDyeTesting();
        return;
    }

    defaultChemicals.forEach(function (chemical) {

        let numberIncr = Math.random().toString(36).substring(2);
        var rowadd = $('.RowOfChemical-Dye').length;

        var DyeChemicalProductSelectOptions = "";
        var defaultOption = '<option value="">--Select--</option>';

        DyeChemicalProductSelectOptions = DyeChemicalProduct[0].map(function (ChemicalId) { return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`; }).join('');

        var htmlRow = `
            <div class="row RowOfChemical-Dye">
                <label class="ProductionPlanChemicalRequirementId d-none"></label>

                <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                        <select class="form-control ProductSelectDye ProductIdDye" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                            ${defaultOption}${DyeChemicalProductSelectOptions}
                        </select>
                    </div>
                </div>
                  
                 <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                      <div class="form-group">
                         <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                          <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                               <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                                  <option value="2">%</option>
                                  <option value="1">GPL</option>
                               </select>
                               <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required/>
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
                        <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalDyeTesting(this)" style="position: absolute; top: 22px; right: 14px;">
                            <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                        </button>
                    </div>
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                        <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemoveDye mt-0" type="button" onclick="removeRowRowChemicalDye(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;

        $('#ChemicalDynamic-Dye').append(htmlRow);

        // Set product
        $(`#ProductId${numberIncr}`).val(chemical.ChemicalId);

        // Set % or GPL based on DefaultUnit
        $(`#DysType${numberIncr}`).val(chemical.DefaultUnit);

        // Set input value
        $(`#GPL${numberIncr}`).val(chemical.UnitValue !== null ? Number(chemical.UnitValue).toFixed(3) : '');

        // Automatically calculate Qty based on DefaultUnit and UnitValue
        calculateChemicalQty($(`#Qty${numberIncr}`).closest('.RowOfChemical-Dye'));
    });

    updateRemoveChemicalDye();
}

function updateRemoveChemicalDye() {
    var rows = $('.RowOfChemical-Dye');

    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.RowOfChemicalRemoveDye');
        var labels = $(this).find('.ProductClass, .GPLClass, .QtyClass');

        if (index === 0) {
            labels.show();
            removeButtonDiv.hide();
        } else {
            labels.hide();
            removeButtonDiv.show();
        }
    });
    refreshProductDropdowns(".ProductSelectDye");
}

function removeRowRowChemicalDye(button) {
    var totalRows = $('.RowOfChemical-Dye').length;
    if (totalRows > 1) {
        $(button).closest('.RowOfChemical-Dye').remove();
    }
    updateRemoveChemicalDye();
    refreshProductDropdowns(".ProductSelectDye");
}

function duplicateRowChemicalFinishing() {

    if (FinishingChemicalProduct == null || FinishingChemicalProduct.length === 0 || FinishingChemicalProduct[0].length === 0) {
        return;
    }

    const defaultChemicals = FinishingChemicalProduct[0].filter(c => c.IsDefault === true);

    if (defaultChemicals.length === 0) {
        duplicateRowChemicalDyeTesting();
        return;
    }

    defaultChemicals.forEach(function (chemical) {

        let numberIncr = Math.random().toString(36).substring(2);
        var rowadd = $('.RowOfChemical-Finishing').length;

        var FinishingChemicalProductSelectOptions = "";
        var defaultOption = '<option value="">--Select--</option>';

        FinishingChemicalProductSelectOptions = FinishingChemicalProduct[0].map(function (ChemicalId) { return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`; }).join('');

        var htmlRow = `
            <div class="row RowOfChemical-Finishing">
                <label class="ProductionPlanChemicalRequirementId d-none"></label>

                <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                        <select class="form-control ProductSelectFinishing ProductIdFinishing" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                            ${defaultOption}${FinishingChemicalProductSelectOptions}
                        </select>
                    </div>
                </div>
                  
                 <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                      <div class="form-group">
                         <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                          <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                               <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                                  <option value="2">%</option>
                                  <option value="1">GPL</option>
                               </select>
                               <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required/>
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
                        <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalFinishingTesting(this)" style="position: absolute; top: 22px; right: 14px;">
                            <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                        </button>
                    </div>
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                        <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemoveFinishing mt-0" type="button" onclick="removeRowRowChemicalFinishing(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;

        $('#ChemicalDynamic-Finishing').append(htmlRow);

        // Set product
        $(`#ProductId${numberIncr}`).val(chemical.ChemicalId);

        // Set % or GPL based on DefaultUnit
        $(`#DysType${numberIncr}`).val(chemical.DefaultUnit);

        // Set input value
        $(`#GPL${numberIncr}`).val(chemical.UnitValue !== null ? Number(chemical.UnitValue).toFixed(3) : '');

        // Automatically calculate Qty based on DefaultUnit and UnitValue
        calculateChemicalQty($(`#Qty${numberIncr}`).closest('.RowOfChemical-Finishing'));
    });

    updateRemoveChemicalFinishing();
}

function updateRemoveChemicalFinishing() {
    var rows = $('.RowOfChemical-Finishing');

    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.RowOfChemicalRemoveFinishing');
        var labels = $(this).find('.ProductClass, .GPLClass, .QtyClass');

        if (index === 0) {
            labels.show();
            removeButtonDiv.hide();
        } else {
            labels.hide();
            removeButtonDiv.show();
        }
    });
    refreshProductDropdowns(".ProductSelectDye");
}

function removeRowRowChemicalFinishing(button) {
    var totalRows = $('.RowOfChemical-Finishing').length;
    if (totalRows > 1) {
        $(button).closest('.RowOfChemical-Finishing').remove();
    }
    updateRemoveChemicalFinishing();
    refreshProductDropdowns(".ProductSelectDye");
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
        let inWardType = $(this).find('.InWardType').text().toLowerCase();

        let rowText = customer + ' ' + lotNo + ' ' + colour + ' ' + fabricType + ' ' + gsm + ' ' + width + ' ' + quantity + ' ' + inWardType;

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
        $('#ProductionPlanjobCardBtn').click();
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
                            <option value="2">%</option>
                            <option value="1">GPL</option>
                        </select>
                        <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required/>
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
                                <option value="2">%</option>
                                <option value="1">GPL</option>
                            </select>
                            <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required />
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


function duplicateRowChemicalDyeBathTesting() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfChemical-DyeBath').length;

    var DyeBathChemicalSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (DyeBathChemicalProduct != null && DyeBathChemicalProduct.length > 0 && DyeBathChemicalProduct[0].length > 0) {
        DyeBathChemicalSelectOptions = DyeBathChemicalProduct[0].map(function (ChemicalId) {
            return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
        }).join('');
    }

    var htmlRow = `
        <div class="row RowOfChemical-DyeBath">
            <label class="ProductionPlanChemicalRequirementId d-none"></label>
            <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                <div class="form-group">
                    <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                    <select class="form-control ProductSelectDyeBath ProductIdDyeBath" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                        ${defaultOption}${DyeBathChemicalSelectOptions}
                    </select>
                </div>
            </div> 
            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                    <div class="form-group">
                    <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                        <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                            <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                                <option value="2">%</option>
                                <option value="1">GPL</option>
                            </select>
                            <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required />
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
                    <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalDyeBath(this)" style="position: absolute; top: 22px; right: 14px;">
                        <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                    </button>
                </div>
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                    <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemoveDyeBath mt-0" type="button" onclick="removeRowRowChemicalDyeBath(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;
    $('#ChemicalDynamic-DyeBath').append(htmlRow);
    updateRemoveChemicalDyeBath();
}

function duplicateRowChemicalDyeTesting() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfChemical-Dye').length;

    var DyeChemicalSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (DyeChemicalProduct != null && DyeChemicalProduct.length > 0 && DyeChemicalProduct[0].length > 0) {
        DyeChemicalSelectOptions = DyeChemicalProduct[0].map(function (ChemicalId) {
            return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
        }).join('');
    }

    var htmlRow = `
        <div class="row RowOfChemical-Dye">
            <label class="ProductionPlanChemicalRequirementId d-none"></label>
            <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                <div class="form-group">
                    <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                    <select class="form-control ProductSelectDye ProductIdDye" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                        ${defaultOption}${DyeChemicalSelectOptions}
                    </select>
                </div>
            </div> 
            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                    <div class="form-group">
                    <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                        <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                            <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                                <option value="2">%</option>
                                <option value="1">GPL</option>
                            </select>
                            <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required />
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
                    <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalDye(this)" style="position: absolute; top: 22px; right: 14px;">
                        <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                    </button>
                </div>
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                    <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemoveDye mt-0" type="button" onclick="removeRowRowChemicalDye(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;
    $('#ChemicalDynamic-Dye').append(htmlRow);
    updateRemoveChemicalDye();
}

function duplicateRowChemicalFinishingTesting() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfChemical-Finishing').length;

    var FinishingChemicalSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (FinishingChemicalProduct != null && FinishingChemicalProduct.length > 0 && FinishingChemicalProduct[0].length > 0) {
        FinishingChemicalSelectOptions = FinishingChemicalProduct[0].map(function (ChemicalId) {
            return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
        }).join('');
    }

    var htmlRow = `
        <div class="row RowOfChemical-Finishing">
            <label class="ProductionPlanChemicalRequirementId d-none"></label>
            <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                <div class="form-group">
                    <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                    <select class="form-control ProductSelectFinishing ProductIdDye" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required>
                        ${defaultOption}${FinishingChemicalSelectOptions}
                    </select>
                </div>
            </div> 
            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                    <div class="form-group">
                    <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                        <div id="ember325" class="input-group ember-view" style="gap: 8px;">
                            <select class="form-control DysType" id="DysType${numberIncr}" name="DysType${numberIncr}" required style="border-top-right-radius: 3px;border-bottom-right-radius: 3px;">
                                <option value="2">%</option>
                                <option value="1">GPL</option>
                            </select>
                            <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 2)" required />
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
                    <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemicalFinishing(this)" style="position: absolute; top: 22px; right: 14px;">
                        <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                    </button>
                </div>
                <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                    <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemoveFinishing mt-0" type="button" onclick="removeRowRowChemicalFinishing(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;
    $('#ChemicalDynamic-Finishing').append(htmlRow);
    updateRemoveChemicalFinishing();
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
    var scanUrl = "http://103.174.10.91:8123/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;

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

$(document).on('click', '#ProductionPlanjobCardBtn', function () {

    $('#loader-pms').show();
    var scanUrl = "http://103.174.10.91:8123/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;

    var EditData = {
        ModuleId: parseInt(ProductionPlanId),
        NoOfCopies: 1,
        printType: "Preview",
        Url: scanUrl
    };

    $.ajax({
        type: 'GET',
        url: '/Productions/JobCardPrint',
        data: EditData,
        xhrFields: {
            responseType: 'blob'
        },
        success: function (response) {

            $('#ShareDropdownitems').hide();

            var blob = new Blob([response], { type: 'application/pdf' });
            var blobUrl = URL.createObjectURL(blob);

            var printType = EditData.printType;

            if (printType === "Preview") {

                var newTab = window.open();
                if (newTab) {
                    newTab.document.write(`
                            <html>
                            <head>
                                <title>Purchase Order Preview</title>
                            </head>
                            <body style="margin:0; padding:0;">
                                <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%" />
                            </body>
                            </html>
                        `);
                    newTab.document.close();
                } else {
                    Common.warningMsg("Popup blocked. Please allow popups.");
                }

            } else if (printType === "Download") {

                var link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'Purchase Order.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } else if (printType === "Print") {

                var iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = blobUrl;
                document.body.appendChild(iframe);
                iframe.onload = function () {
                    iframe.contentWindow.print();
                };
            }

            $('#loader-pms').hide();
        },
        error: function () {
            $('#loader-pms').hide();
            Common.errorMsg("Print failed");
        }
    });
});

/*GenerateQrContectPdf*/
//$(document).on('click', '#ProductionPlanPreviewbtn', function () {

//    $('#loader-pms').show();

//    var ProductionPlanNo = $('#BatchNo').val();

//    var scanUrl =
//        "BEGIN:VCARD\n" +
//        "VERSION:3.0\n" +
//        "N:S;Vignesh;;;\n" +                       // Last Name; First Name
//        "FN:Vignesh S\n" +                         // Full Name
//        "TITLE:Regional Sales Manager - India\n" + // Job Title
//        "TEL;TYPE=CELL:+918807966096\n" +         // Phone
//        "EMAIL:vignesh.s@vahle.com\n" +           // Email
//        "END:VCARD";

//    $.ajax({
//        url: '/Productions/GenerateQrContectPdf',
//        method: 'GET',
//        data: {
//            URL: scanUrl,
//            ProductionPlanNo: ProductionPlanNo
//        },
//        xhrFields: {
//            responseType: 'blob'
//        },
//        success: function (response) {

//            var blob = new Blob([response], { type: 'application/pdf' });
//            var blobUrl = window.URL.createObjectURL(blob);

//            var iframe = document.createElement('iframe');
//            iframe.style.display = 'none';
//            iframe.src = blobUrl;
//            document.body.appendChild(iframe);

//            iframe.onload = function () {
//                iframe.contentWindow.print();
//            };

//            $('#loader-pms').hide();
//        },
//        error: function () {
//            $('#loader-pms').hide();
//            Common.errorMsg("Failed to generate QR PDF");
//        }
//    });
//});

