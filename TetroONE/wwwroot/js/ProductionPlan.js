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
var ProcessTypeDropdown = [];
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
var skipChemicalTabValidation = false;

// ===== Global Chemical Edit Lists =====
var EditPreTreatmentChemicalProduct = [];
var EditDyeBathChemicalProduct = [];
var EditAfterTreatmentChemicalProduct = [];
var EditFinishingChemicalProduct = [];

$(document).ready(async function () {

    $('#DownloadPDFModal').css('z-index', '1003');

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    titleForHeaderProductTab = "Production Plan";
    titleForHeaderPopRawMatrialTab = "Pre-Treatment";

    $('.datapiker').show();
    $('#PDFIcon').hide();

    var start = moment().startOf('month');
    var end = moment(); // today

    $('#reportrange span').html(
        start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY')
    );

    $('.daterangepicker').on('show.daterangepicker', function () {
        $('.ranges li[data-range-key="No Date"]').hide();
    });

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        autoUpdateInput: false,
        alwaysShowCalendars: true,
        showCustomRangeLabel: true,
        locale: {
            format: 'DD-MM-YYYY'
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment()],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'No Date': [moment(), moment()]
        }
    }, cb);

    // default load
    cb(start, end);


    // Apply event
    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {

        if (picker.chosenLabel === 'No Date') {
            $(this).find('span').html('No Date');
            StartDate = null;
            EndDate = null;
        } else {
            $(this).find('span').html(
                picker.startDate.format('DD-MM-YYYY') +
                ' - ' +
                picker.endDate.format('DD-MM-YYYY')
            );

            StartDate = picker.startDate.format('YYYY-MM-DD');
            EndDate = picker.endDate.format('YYYY-MM-DD');
        }

        console.log("StartDate:", StartDate);
        console.log("EndDate:", EndDate);
    });


    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);

    bindDropDownPrint('ReportName', 'GreyFabricCategory', 1);

    Common.bindDropDownParent('PreparedBy', 'FormStatus', 'SampleReceivedBy');
    Common.bindDropDownParent('ProductionPlanStatusId', 'FormStatus', 'ProductionPlanStatus');
    Common.bindDropDownParent('ColorId', 'TopStatic', 'Color');
    Common.bindDropDownParent('MachineId', 'TopStatic', 'Machine');

    var dyeDropdown = await Common.bindDropDownSync('DyeProduct');
    DyeDropdown = JSON.parse(dyeDropdown);

    var processTypeDropdown = await Common.bindDropDownSync('ProcessType');
    ProcessTypeDropdown = JSON.parse(processTypeDropdown);

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

        $('#emptyDiv').removeClass('col-lg-3 col-md-3 col-6').addClass('col-lg-5 col-md-5 col-6');
        $('#ProductionPlanStatusIdDiv').hide();

        $('#LoadingDateTimeDiv').hide();
        $('#UnLoadingDateTimeDiv').hide();
        $('#SubtotalRow').hide();
        $('#MLRWaterLevelDiv').hide();
        $('#TotalWeightDiv').hide();
        $('#ColourDiv').hide();
        $('#MachineDiv').hide();
        $('#ProductionPlanjobCardBtn').hide();
        $('#ProductionPlanJobCardWithRateBtn').hide();

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
        $('#ProductionPlanJobCardWithRateBtn').show();

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

        $('#emptyDiv').removeClass('col-lg-5 col-md-5 col-6').addClass('col-lg-3 col-md-3 col-6');
        $('#ProductionPlanStatusIdDiv').show();

        $('#LoadingDateTimeDiv').show();
        $('#UnLoadingDateTimeDiv').show();
        $('#SubtotalRow').show();

        $("#QRCode").html("");

        //const today = new Date().toISOString().split('T')[0];
        //$("#BatchDate").val(today);
        //$('#MachineId').prop('disabled', false);
        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: null, ModuleName: "DefaultChemicalEdit" }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);

                PreTreatmentChemicalProduct = data[0];
                DyeChemicalProduct = data[1];
                DyeBathChemicalProduct = data[2];
                AfterTreatmentChemicalProduct = data[3];
                FinishingChemicalProduct = data[4];

                Common.ajaxCall("GET", "/Productions/GetDefaultChemicalDetails", { ProcessType: null, ProductionPlanId: parseInt(ProductionPlanId), ColourValue: null }, function (response) {
                    if (response.status) {
                        var data = JSON.parse(response.data);

                        EditPreTreatmentChemicalProduct = (data[0]?.[0]?.ChemicalId != null) ? data[0] : [];
                        EditDyeChemicalProduct = (data[1]?.[0]?.ChemicalId != null) ? data[1] : [];
                        EditDyeBathChemicalProduct = (data[2]?.[0]?.ChemicalId != null) ? data[2] : [];
                        EditAfterTreatmentChemicalProduct = (data[3]?.[0]?.ChemicalId != null) ? data[3] : [];
                        EditFinishingChemicalProduct = (data[4]?.[0]?.ChemicalId != null) ? data[4] : [];

                        var fnData = Common.getDateFilter('dateDisplay2');
                        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: parseInt(ProductionPlanId), FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanNotNullSuccess, null);
                    }
                }, null);
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
        $('#loader-pms').show();
        titleForHeaderProductTab = $(this).text().trim();
        $('#MainTab .navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderProductTab) {
                $(this).addClass('active');
            }
        });
        if (titleForHeaderProductTab == "Production Plan") {
            $('.datapiker').show();
            $('#PDFIcon').hide();
            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
        }
        else if (titleForHeaderProductTab == "Grey Fabric Stock Info") {
            $('.datapiker').hide();
            $('#PDFIcon').show();
            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall("GET", "/Productions/GetProductionPlan", { PlantId: parseInt(PlantMappingId), TypeId: parseInt(2), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
        }
        $('#loader-pms').hide();
    });


    /*Please follow the sequence of tabs.*/
    //$(document).on('click', '#ChemicalModal .navbar-tab', function (e) {

    //    e.preventDefault();
    //    e.stopImmediatePropagation();

    //    var tabOrder = ["Pre-Treatment", "Dye", "DyeBath", "After-Treatment", "Finishing"];

    //    var currentTabText = titleForHeaderPopRawMatrialTab ||
    //        $('#ChemicalModal .navbar-tab.active').text().trim();

    //    var clickedTabText = $(this).text().trim();

    //    var currentIndex = tabOrder.indexOf(currentTabText);
    //    var clickedIndex = tabOrder.indexOf(clickedTabText);

    //    if (skipChemicalTabValidation) {
    //        skipChemicalTabValidation = false;
    //        activateChemicalTab(clickedTabText);
    //        return;
    //    }

    //    if (!validateCurrentChemicalTab()) {
    //        Common.errorMsg("Please fill all required fields in the current tab.");

    //        // 🔁 Always activate the saved header tab
    //        activateChemicalTab(currentTabText);
    //        return false;
    //    }

    //    // ❌ If user tries to skip ahead more than one tab
    //    if (clickedIndex > currentIndex + 1) {
    //        Common.warningMsg("Please follow the sequence of tabs.");

    //        // 👉 Activate next allowed tab automatically
    //        var nextTabText = tabOrder[currentIndex + 1];
    //        activateChemicalTab(nextTabText);
    //        return false;
    //    }

    //    // ✅ Valid move (either next or previous)
    //    activateChemicalTab(clickedTabText);
    //});

    $(document).on('click', '#ChemicalModal .navbar-tab', function (e) {

        e.preventDefault();
        e.stopImmediatePropagation();

        var currentTabText = titleForHeaderPopRawMatrialTab ||
            $('#ChemicalModal .navbar-tab.active').text().trim();

        var clickedTabText = $(this).text().trim();

        if (!validateCurrentChemicalTab()) {
            Common.errorMsg("Please fill all required fields in the current tab.");

            activateChemicalTab(currentTabText);
            return false;
        }

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

        saveProductionPlan(function (ProductionPlanId) {

            $('#ProductionPlanModal').hide();

            var fnData = Common.getDateFilter('dateDisplay2');

            Common.ajaxCall(
                "GET",
                "/Productions/GetProductionPlan",
                {
                    PlantId: parseInt(PlantMappingId),
                    TypeId: 1,
                    ProductionPlanId: null,
                    FromDate: fnData.startDate.toISOString(),
                    ToDate: fnData.endDate.toISOString()
                },
                GetProductionPlanSuccess,
                null
            );

        });

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

    /* ================= GLOBAL VARIABLES ================= */

    var GlobalStartDate = null;
    var GlobalEndDate = null;


    /* ================= DATE RANGE APPLY EVENT ================= */

    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {

        if (picker.chosenLabel === 'No Date') {

            $(this).find('span').html('No Date');
            GlobalStartDate = null;
            GlobalEndDate = null;

        } else {

            $(this).find('span').html(
                picker.startDate.format('DD-MM-YYYY') +
                ' - ' +
                picker.endDate.format('DD-MM-YYYY')
            );

            // Store globally
            GlobalStartDate = picker.startDate.toISOString();
            GlobalEndDate = picker.endDate.toISOString();
        }

        console.log("GlobalStartDate:", GlobalStartDate);
        console.log("GlobalEndDate:", GlobalEndDate);
    });


    /* ================= VIEW BUTTON ================= */

    $(document).on('click', '#ViewToDownloadGF', function () {

        var start = moment().startOf('month');
        var end = moment();

        var drp = $('#reportrange').data('daterangepicker');

        if (drp) {
            drp.setStartDate(start);
            drp.setEndDate(end);

            // Update global values manually
            GlobalStartDate = start.toISOString();
            GlobalEndDate = end.toISOString();
        }

        $('#reportrange span').html(
            start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY')
        );

        $('#reportrange').css('color', '#000');

        $('#DownloadPDFModal').show();
    });


    /* ================= SAVE BUTTON ================= */

    $(document).on('click', '#DownloadPDFSave', function () {

        if (!GlobalStartDate || !GlobalEndDate) {
            Common.warningMsg("Please select date range");
            return;
        }

        var ReportCategory = $('#ReportName').val();
        var Reportvalue = $('#ReportValue').val();

        if (!ReportCategory) {
            Common.warningMsg("Please select report category");
            return;
        }

        var EditDataId = {
            ReportCategory: ReportCategory,
            Reportvalue: Reportvalue,
            FromDate: GlobalStartDate,
            ToDate: GlobalEndDate
        };

        loadGreyFabricStockPrint(EditDataId);
    });

    /* ================= REPORT NAME CHANGE ================= */

    $(document).on('change', '#ReportName', function () {

        var $thisVal = $(this).val();

        if ($thisVal != '') {
            $('#loader-pms').show();
            bindDropDownValuesPrint('ReportValue', 'GreyFabric', parseInt($thisVal), 0);
        }
    });

    /* ================= CLOSE MODAL ================= */

    $(document).on('click', '#DownloadPDFClose', function () {
        $('#DownloadPDFModal').hide();
    });
});

/* ================= AJAX FUNCTION ================= */

function loadGreyFabricStockPrint(EditDataId) {

    $('#loader-pms').show();

    $.ajax({
        type: 'GET',
        url: '/Productions/GreyFabricStockPrint',
        data: EditDataId,
        xhrFields: { responseType: 'blob' },

        success: function (response) {

            $('#ShareDropdownitems').hide();

            var blob = new Blob([response], { type: 'application/pdf' });
            var blobUrl = URL.createObjectURL(blob);

            var newTab = window.open(blobUrl);

            if (!newTab) {
                Common.warningMsg("Popup blocked. Please allow popups.");
            }

            $('#loader-pms').hide();
        },

        error: function () {
            $('#loader-pms').hide();
            Common.errorMsg("JobCard print failed");
        }
    });
}

function saveProductionPlan(callback, options = {}) {

    const showSuccessMsg = options.showSuccessMsg !== false; // default true

    $('#loader-pms').show();

    var TableLenthDynamicRow = $('.AddedRow').length;
    if (TableLenthDynamicRow == 0) {
        Common.warningMsg('Choose Atleast One Product');
        $('#loader-pms').hide();
        return false;
    }

    if (!$("#TopStatic").valid() || !$("#TableInputs").valid() || !$("#FormStatus").valid()) {
        $('#loader-pms').hide();
        return false;
    }

    getExistFiles();

    let weightStr = $('#TotalWeight').val();
    let cleaned = weightStr.replace(/,/g, '').replace(/[^\d.]/g, '');
    let TotalWeight = parseFloat(cleaned) || null;

    // ===============================
    // STATIC DATA
    // ===============================
    var ProductionPlanStaticData = {
        ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null,
        PlantId: parseInt(PlantMappingId),
        ProductionNo: $('#BatchNo').val() || null,
        ProductionDate: $('#BatchDate').val() || null,
        TotalWeight: TotalWeight || null,
        ColorId: parseInt($('#ColorId').val()) || null,
        MachineId: parseInt($('#MachineId').val()) || null,
        MLR: parseFloat($('#MLR').val()) || null,
        WaterLevel: parseInt($('#WaterLevel').val()) || null,
        ProductionPlanStatusId: ProductionPlanId > 0 ? parseInt($('#ProductionPlanStatusId').val()) || null : 1,
        Comments: $('#AddNotesText').val() || null,
        PreparedBy: parseInt($('#PreparedBy').val()) || null
    };

    // ===============================
    // FABRIC DETAILS
    // ===============================
    var ProductionPlanFabricDetails = [];
    var ProductionPlanFabricProcessMappingDetails = [];

    $('#ProductionPlanProductTablebody .AddedRow').each(function (rowIndex) {

        var $rowTable = $(this);

        var productionPlanFabricId = $rowTable.data('productionplanfabricid-id') || null;
        var inwardFabricId = $rowTable.data('inwardfabricid') || null;
        var productionPlanFabricProcessMappingId = $rowTable.data('productionplanfabricprocessmappingid-id') || null;

        ProductionPlanFabricDetails.push({
            ProductionPlanFabricId: productionPlanFabricId ? parseInt(productionPlanFabricId) : null,
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
        });

        var selectedProcessIds = $rowTable.find('.Process').val() || [];

        selectedProcessIds.forEach(function (pid) {
            ProductionPlanFabricProcessMappingDetails.push({
                ProductionPlanFabricProcessMappingId: productionPlanFabricProcessMappingId ? parseInt(productionPlanFabricProcessMappingId) : null,
                ProductionPlanFabricId: productionPlanFabricId ? parseInt(productionPlanFabricId) : null,
                RowNo: rowIndex + 1,
                ProcessTypeId: parseInt(pid)
            });
        });
    });

    // ===============================
    // CHEMICAL DETAILS
    // ===============================
    var ProductionPlanChemicalRequirementDetails = [];

    function pushChemical(container, rowClass, processType, productClass) {
        $(container + ' .' + rowClass).each(function () {
            var $row = $(this);

            ProductionPlanChemicalRequirementDetails.push({
                ProductionPlanChemicalRequirementId: parseInt($row.find('.ProductionPlanChemicalRequirementId').text()) || null,
                ProcessType: processType,
                ChemicalId: parseInt($row.find(productClass).val()) || null,
                ChemicalType: parseInt($row.find('.DysType').val()) || null,
                GPL: parseFloat($row.find('input[id^="GPL"]').val()) || null,
                TotalQty: parseFloat($row.find('input[id^="Qty"]').val()) || null,
                ProductionPlanId: ProductionPlanId > 0 ? parseInt(ProductionPlanId) : null
            });
        });
    }

    pushChemical('#ChemicalDynamic-Pre', 'RowOfChemical-Pre', 1, '.ProductIdPre');
    pushChemical('#ChemicalDynamic-Dye', 'RowOfChemical-Dye', 2, '.ProductIdDye');
    pushChemical('#ChemicalDynamic-DyeBath', 'RowOfChemical-DyeBath', 3, '.ProductIdDyeBath');
    pushChemical('#ChemicalDynamic-After', 'RowOfChemical-After', 4, '.ProductIdAfter');
    pushChemical('#ChemicalDynamic-Finishing', 'RowOfChemical-Finishing', 5, '.ProductIdFinishing');

    // ===============================
    // APPEND FORM DATA
    // ===============================
    formDataMultiple.append("ProductionPlanStaticData", JSON.stringify(ProductionPlanStaticData));
    formDataMultiple.append("ProductionPlanFabricDetails", JSON.stringify(ProductionPlanFabricDetails));
    formDataMultiple.append("ProductionPlanFabricProcessMappingDetails", JSON.stringify(ProductionPlanFabricProcessMappingDetails));
    formDataMultiple.append("ProductionPlanChemicalRequirementDetails", JSON.stringify(ProductionPlanChemicalRequirementDetails));
    formDataMultiple.append("Exist", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));

    // ===============================
    // AJAX
    // ===============================
    $.ajax({
        type: "POST",
        url: "/Productions/InsertUpdateProductionPlanDetails",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: function (response) {

            $('#loader-pms').hide();

            if (response.status) {

                formDataMultiple = new FormData();

                // ✅ Show success only if allowed
                if (showSuccessMsg) {
                    Common.successMsg(response.message);
                }

                // 🔑 Return ProductionPlanId
                if (callback) {
                    var dataId = JSON.parse(response.data);
                    ProductionPlanId = dataId[0][0].ProductionPlanId;
                    callback(dataId[0][0].ProductionPlanId);
                }

            } else {
                formDataMultiple = new FormData();
                Common.errorMsg(response.message);
            }
        },
        error: function (response) {
            $('#loader-pms').hide();
            formDataMultiple = new FormData();
            Common.errorMsg(response?.message || "Something went wrong");
        }
    });
}

function activateChemicalTab(tabText) {
    $('#tableFilter').val('');
    titleForHeaderPopRawMatrialTab = tabText;

    // Activate the tab visually
    $('#ChemicalModal .navbar-tab').removeClass('active');
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
            bindTable('ProductionPlanTable', data[1], columns, -1, 'ProductionPlanId', '356px', true, access);
            $(".dataTables_scrollBody").css("max-height", "356px");
        } else {
            bindTable('ProductionPlanTable', data[1], columns, -1, 'ProductionPlanId', '356px', false, access);
            $(".dataTables_scrollBody").css("max-height", "320px");
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

        if (header.ProductionPlanStatusId == 6) {
            $('#ProductionPlanStatusId option').each(function () {
                if ($(this).val() !== "") {
                    $(this).addClass('d-none');
                }
            });

            $('#ProductionPlanStatusId').append('<option value="6">In_Production</option>');
            $('#ProductionPlanStatusId option[value="6"]').removeClass('d-none');
        } else if (header.ProductionPlanStatusId == 9) {
            $('#ProductionPlanStatusId option').each(function () {
                if ($(this).val() !== "") {
                    $(this).addClass('d-none');
                }
            });

            $('#ProductionPlanStatusId').append('<option value="9">Delivered</option>');
            $('#ProductionPlanStatusId option[value="6"]').removeClass('d-none'); 
        }else if (header.ProductionPlanStatusId == 8) {
            $('#ProductionPlanStatusId option').each(function () {
                if ($(this).val() !== "") {
                    $(this).addClass('d-none');
                }
            });

            $('#ProductionPlanStatusId').append('<option value="8">Yet to Deliver</option>');
            $('#ProductionPlanStatusId option[value="6"]').removeClass('d-none'); 
        }
        else {
            $('#ProductionPlanStatusId option[value="6"]').remove();
            $('#ProductionPlanStatusId option[value="8"]').remove();
            $('#ProductionPlanStatusId option[value="9"]').remove();
            $('#ProductionPlanStatusId option').removeClass('d-none');
        }

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
                <tr class="AddedRow" data-productionplanfabricid-id="${item.ProductionPlanFabricId}" data-inwardfabricid="${item.InwardFabricId}" data-originalqty="${item.Quantity.toFixed(3)}"> 
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

    // 🔴 Skip appending if Dye and ChemicalId is null
    //if (rowType === 'Dye' && !chemicalData?.ChemicalId) {
    //    return; // Stop execution completely
    //}

    let numberIncr = Math.random().toString(36).substring(2);
    let rowadd = $(`.RowOfChemical-${rowType}`).length;

    let defaultOption = `<option value="" ${chemicalData?.ChemicalId == null ? 'selected' : ''}>--Select--</option>`;

    let editProducts = [];
    let masterProducts = [];

    // 🔹 Get correct arrays
    switch (rowType) {

        case 'Pre':
            editProducts = EditPreTreatmentChemicalProduct || [];
            masterProducts = PreTreatmentChemicalProduct || [];
            break;

        case 'After':
            editProducts = EditAfterTreatmentChemicalProduct || [];
            masterProducts = AfterTreatmentChemicalProduct || [];
            break;

        case 'Dye':
            editProducts = EditDyeChemicalProduct || [];
            masterProducts = DyeChemicalProduct || []; // 🔥 IMPORTANT
            //masterProducts = EditDyeChemicalProduct || []; // 🔥 IMPORTANT
            break;

        case 'DyeBath':
            editProducts = EditDyeBathChemicalProduct || [];
            masterProducts = DyeBathChemicalProduct || [];
            break;

        case 'Finishing':
            editProducts = EditFinishingChemicalProduct || [];
            masterProducts = FinishingChemicalProduct || [];
            break;
    }

    // 🔹 Remove duplicates (Edit first, remaining from Master)
    let editIds = editProducts.map(e => e.ChemicalId);
    let remainingProducts = masterProducts.filter(m => !editIds.includes(m.ChemicalId));
    let finalProducts = [...editProducts, ...remainingProducts];

    // 🔹 Build dropdown
    let selectOptions = finalProducts.map(c => `
        <option value="${c.ChemicalId}" 
            ${chemicalData.ChemicalId == c.ChemicalId ? 'selected' : ''}>
            ${c.ChemicalName}
        </option>
    `).join('');

    let htmlRow = `
        <div class="row RowOfChemical-${rowType}">
            <label class="ProductionPlanChemicalRequirementId d-none">
                ${chemicalData.ProductionPlanChemicalRequirementId || ''}
            </label>

            <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                <div class="form-group">
                    <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                    <select class="form-control ProductSelect${rowType} ProductId${rowType}" 
                            id="ProductId${numberIncr}" 
                            name="ProductId${numberIncr}" required>
                        ${defaultOption}
                        ${selectOptions}
                    </select>
                </div>
            </div> 

            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                <div class="form-group">
                    <label class="GPLClass">Value<span id="Asterisk">*</span></label>
                    <div class="input-group" style="gap: 8px;">
                        <select class="form-control DysType" 
                                id="DysType${numberIncr}" 
                                name="DysType${numberIncr}" required>
                            <option value="2">%</option>
                            <option value="1">GPL</option>
                        </select>
                        <input type="text" class="form-control" 
                               placeholder="Ex: 8.3"
                               id="GPL${numberIncr}" 
                               name="GPL${numberIncr}" 
                               value="${chemicalData.GPL != null ? Number(chemicalData.GPL).toFixed(5) : ''}"
                               oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" 
                               required/>
                    </div>
                </div>
            </div> 

            <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                <div class="form-group">
                    <label class="QtyClass">Qty<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control" 
                           placeholder="Ex: 0"
                           id="Qty${numberIncr}" 
                           name="Qty${numberIncr}" 
                           value="${chemicalData.TotalQty != null ? Number(chemicalData.TotalQty).toFixed(5) : ''}"
                           oninput="Common.allowOnlyNumberLength(this,3)" 
                           required/>
                </div>
            </div>

            <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                <div class="p-1 align-items-center buttonsRow" 
                     style="display: ${rowadd == 0 ? 'block' : 'none'}">
                    <button class="btn AddStockBtn" type="button"
                        onclick="duplicateRowChemical${rowType}Testing(this)"
                        style="position: absolute; top: 22px; right: 14px;">
                        <i class="fas fa-plus" style="color: #000000;"></i>
                    </button>
                </div>

                <div class="p-1 align-items-center buttonsRow" 
                     style="display: ${rowadd == 0 ? 'none' : 'block'}">
                    <button class="btn DynrowRemove RowOfChemicalRemove${rowType} mt-0" 
                            type="button"
                            onclick="removeRowRowChemical${rowType}(this)"
                            style="top: 4px; position: absolute; right: 13px;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    $(`#ChemicalDynamic-${rowType}`).append(htmlRow);

    // 🔹 Set selected values safely
    $(`#ChemicalDynamic-${rowType} .ProductId${rowType}`).last()
        .val(String(chemicalData.ChemicalId || ''));

    $(`#ChemicalDynamic-${rowType} .DysType`).last()
        .val(String(chemicalData.ChemicalType || '2'));

    // 🔹 Update remove button logic
    switch (rowType) {
        case 'Pre':
            updateRemoveChemicalPre();
            break;
        case 'After':
            updateRemoveChemicalAfter();
            break;
        case 'Dye':
            updateRemoveChemicalDye();
            break;
        case 'DyeBath':
            updateRemoveChemicalDyeBath();
            break;
        case 'Finishing':
            updateRemoveChemicalFinishing();
            break;
    }
}

var storedNonGroupedItems = [];
var storedNonGroupedInWardIds = [];
var ItemListAdd = [];
var AddedItems = [];
var AlreadyAddedIds = [];

function LoadPopupItems(allItems) {

    $("#ProductionPlanAddItem-table-body").empty();

    allItems.forEach((item) => {

        let uniqueId = `ItemId-${item.InwardFabricId}`;

        const row = `
            <tr class="AddItemRow"
                data-inwardfabricid="${item.InwardFabricId}"
                data-inwardid="${item.InWardId}">
                <td>
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="mr-2 ItemCheckbox" id="${uniqueId}">
                        <label for="${uniqueId}" class="MachineName mb-0" style="color:${item.StatusColor || '#000'}!important"> ${item.MachineName || ''} </label>
                    </div>
                </td>
                <td><label class="Customer">${item.ClientDcNumber || ''}</label></td> 
                <td><label class="Customer">${item.Customer || ''}</label></td> 
                <td>
                    <label class="d-none InWardNo">${item.InWardId}</label>
                    <label class="LotNo">${item.InWardNo || ''}</label>
                </td>
                <td>
                    <label class="d-none InWardTypeNo"></label>
                    <label class="InWardType mb-0">${item.InWardType || ''}</label>
                </td>
                <td><label class="Colour">${item.ColorName || ''}</label></td>
                <td><label class="FabricType">${item.Fabric || ''}</label></td>
                <td><label class="Dia">${item.Dia || ''}</label></td>
                <td><label class="GSM">${item.GSM || ''}</label></td>
                <td><label class="NoOfRolls">${item.NoOfRolls || ''}</label></td>
                <td><label class="Width">${item.Width || ''}</label></td>
                <td><label class="FabricQty">${item.FabricQty || ''}</label></td>
                <td><label class="InWardQty">${item.InWardQty || ''}</label></td>
            </tr>
        `;

        $("#ProductionPlanAddItem-table-body").append(row);
    });

    $('#loader-pms').hide();
    $("#ProductionPlanAddItemModal").show();
}

$(document).on('change', '.ItemCheckbox', function () {

    const $row = $(this).closest("tr");

    let fabricQtyText = $row.find(".FabricQty").text() || "0";

    let numbers = fabricQtyText.match(/[\d,.]+/g) || [];

    let totalQty = 0;

    numbers.forEach(val => {
        totalQty += parseFloat(val.replace(/,/g, "")) || 0;
    });

    const itemObj = {
        ItemId: $row.data("inwardfabricid").toString(),
        InwardFabricId: $row.data("inwardfabricid"),
        InWardId: $row.data("inwardid"),
        LotNo: $row.find(".LotNo").text(),
        Colour: $row.find(".Colour").text(),
        FabricType: $row.find(".FabricType").text(),
        FabricQty: totalQty
    };

    if ($(this).prop("checked")) {
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
        totalQty += parseFloat(item.FabricQty) || 0;
    });

    $("#NoOfQty").text(
        totalQty.toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        })
    );
}

function UpdateSelectedItemCount() {
    const count = $(".ItemCheckbox:checked").length;
    $("#TotalItemSelect").text(count);
}

$(document).on("click", "#BtnAdd", function () {

    if (ItemListAdd.length === 0) {
        Common.warningMsg('Select at least one item.');
        return;
    }

    // 🔹 Calculate total KG
    let FinalValues = 0;

    ItemListAdd.forEach(item => {
        FinalValues += parseFloat(item.FabricQty) || 0;
    });

    let firstColor = ItemListAdd.length > 0 ? ItemListAdd[0].Colour : "";

    // 🔹 AJAX FIRST
    Common.ajaxCall("GET", "/Productions/GetFabricDetailsProductionPlan", { PlantId: parseInt(PlantMappingId), IsUpdate: 1, KG: parseFloat(FinalValues), Color: firstColor }, function (response) {

        if (!response.status) {
            Common.warningMsg(response.message);
            return;
        }

        var data = JSON.parse(response.data);

        // 🔹 Set Header Values
        $('#TotalWeight').val(FinalValues);

        if (data[0] && data[0][0]) {
            $('#MachineId').val(data[0][0].MachineId).trigger("change");
            $('#ColorId').val(data[0][0].SelectedColorId).trigger("change");
        }

        // =====================================================
        // 🔥 APPEND ROWS INSIDE SUCCESS
        // =====================================================

        ItemListAdd.forEach(item => {

            if (AlreadyAddedIds.includes(item.ItemId.toString())) return;

            AlreadyAddedIds.push(item.ItemId.toString());

            let inwardDetails = storedNonGroupedItems.filter(x =>
                x.InWardId == item.InWardId
            );

            if (inwardDetails.length === 0) {
                inwardDetails = [item];
            }

            inwardDetails.forEach(detail => {

                // 1️⃣ Parse Quantity
                let qtyValue = 0;

                if (detail.FabricQty) {
                    let matches = detail.FabricQty.match(/[\d,.]+/g);
                    if (matches) {
                        matches.forEach(val => {
                            qtyValue += parseFloat(val.replace(/,/g, "")) || 0;
                        });
                    }
                }

                // 2️⃣ Convert ProcessList to array
                let mappedProcesses = [];

                if (detail.ProcessList) {
                    mappedProcesses = detail.ProcessList
                        .split(',')
                        .map(x => x.trim())
                        .filter(x => x !== "");

                    mappedProcesses = [...new Set(mappedProcesses)];
                }

                // 3️⃣ Unique Select ID
                let uid = "Process_" + detail.InWardId + "_" +
                    Math.random().toString(36).substr(2, 5);

                const newRow = `
                       <tr class="AddedRow" data-inwardid="${detail.InWardId}" data-inwardfabricid="${detail.InwardFabricId || item.InwardFabricId}" data-productionplanfabricid="${detail.ProductionPlanFabricId || ''}" data-productionplanfabricprocessmappingid="${detail.ProductionPlanFabricProcessMappingId || ''}" data-originalqty="${qtyValue.toFixed(3)}">

                            <td class="rowNo"></td>

                            <td data-id="${detail.InWardId}">
                                <input type="text" class="form-control lotNo" value="${detail.InWardNo}" disabled>
                            </td>
                            <td data-id="${detail.ColorId}">
                                <input type="text" class="form-control colour" value="${detail.ColorName}" disabled>
                            </td>
                            <td data-id="${detail.FabricId}">
                                <input type="text" class="form-control fabricType" value="${detail.Fabric}" disabled>
                            </td>
                            <td>
                                <input type="text" class="form-control Dia" value="${detail.Dia || ''}" disabled>
                            </td>
                            <td>
                                <input type="text" class="form-control GSM" value="${detail.GSM || ''}" disabled>
                            </td>
                            <td>
                                <input type="text" class="form-control NoOfRolls" value="${detail.NoOfRolls || ''}" disabled>
                            </td>
                            <td>
                                <input type="text" class="form-control Width" value="${detail.Width || ''}" disabled>
                            </td>
                            <td>
                                <input type="text"
                                       class="form-control qty"
                                       value="${qtyValue.toFixed(3)}"
                                       required>
                            </td>
                            <td>
                                <select multiple
                                        id="${uid}"
                                        class="select2 Process"
                                        name="Process_${detail.InWardId}">
                                </select>
                            </td>
                            <td>
                                <button class="btn DynremoveBtn DynrowRemove"
                                        type="button"
                                        data-id="${detail.InWardId}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `;

                $("#AddItemButtonRow").before(newRow);

                // 🔹 Bind Process Dropdown
                bindDropDownMultiProcess(uid, 'ProcessType', mappedProcesses);

                // 🔹 Initialize Select2 for this dropdown only
                $("#" + uid).select2();
            });

        });

        // 🔹 After Append Calculations
        RenumberRows();
        UpdateMainTableQuantity();
        CalcuWetreLevel();

        // 🔹 QR Code
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

        // 🔹 UI Visibility
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

        ItemListAdd = [];
        $("#ProductionPlanAddItemModal").hide();
    }
    );
});

$(document).on('click', '#AddItemBtn', function () {
    $('#loader-pms').show();

    $("#TotalItemSelect").text('');
    $("#NoOfQty").text('');

    Common.ajaxCall("GET",
        "/Productions/GetFabricDetailsProductionPlan",
        {
            PlantId: parseInt(PlantMappingId),
            IsUpdate: null,
            KG: 1,
            Color: ""
        },
        function (response) {
            $('#loader-pms').hide();
            if (!response.status) return;
            $('#loader-pms').show();

            var data = JSON.parse(response.data);

            if (!data || !data[0] || data[0].length === 0) {
                Common.warningMsg('No grey fabric stock is available.');
                return;
            }

            var items = data[0];

            // Store detail rows
            storedNonGroupedItems = items.filter(x => x.IsGrouped === 0);
            storedNonGroupedInWardIds = storedNonGroupedItems.map(x => x.InWardId);

            // Only grouped rows for popup
            const groupedItems = items.filter(x => x.IsGrouped === 1);

            const filteredData = groupedItems.filter(item =>
                !AlreadyAddedIds.includes(item.InwardFabricId?.toString())
            );

            if (filteredData.length === 0) {
                $("#ProductionPlanAddItem-table-body").html(`
                    <tr>
                        <td colspan="13" class="text-center text-danger fw-bold py-2">
                            No records found
                        </td>
                    </tr>
                `);
                $("#ProductionPlanAddItemModal").show();
                $('#loader-pms').hide();
                return;
            }

            LoadPopupItems(filteredData);

        }, null);
});

$(document).on('click', '.DynremoveBtn', function () {

    const row = $(this).closest("tr");   // 🔹 Only this row
    const inwardFabricId = row.data("inwardfabricid")?.toString();
    const inwardId = row.data("inwardid")?.toString();

    // 🔹 Remove row from main table
    row.remove();

    // 🔹 Remove only this item from arrays
    if (inwardFabricId) {
        AlreadyAddedIds = AlreadyAddedIds.filter(x => x !== inwardFabricId);
        ItemListAdd = ItemListAdd.filter(x => x.InwardFabricId?.toString() !== inwardFabricId);
    }

    // =====================================================
    // 🔥 Restore ONLY this item in popup
    // =====================================================

    if (inwardFabricId) {

        const popupCheckbox = $("#ProductionPlanAddItem-table-body")
            .find(`#ItemId-${inwardFabricId}`);

        if (popupCheckbox.length) {

            popupCheckbox.prop("checked", false);

            const popupRow = popupCheckbox.closest("tr");

            // Optional: move to bottom
            popupRow.detach().appendTo("#ProductionPlanAddItem-table-body");
        }
    }

    // =====================================================
    // 🔹 Recalculate totals
    // =====================================================

    UpdateMainTableQuantity();
    CalcuWetreLevel();

    // =====================================================
    // 🔹 UI Visibility
    // =====================================================

    if (AlreadyAddedIds.length > 0) {

        $('#TotalWeightDiv').show();
        $('#ColourDiv').show();
        $('#MachineDiv').show();

        if (ProductionPlanId != 0) {
            $('#MLRWaterLevelDiv').show();
        } else {
            $('#MLRWaterLevelDiv').hide();
        }

    } else {

        $('#MLRWaterLevelDiv').hide();
        $('#MLR').val('');
        $('#TotalWeightDiv').hide();
        $('#ColourDiv').hide();
        $('#MachineDiv').hide();
        $('#TotalWeight').val('0.000');
    }

    RenumberRows();
});

function RenumberRows() {
    $('#ProductionPlanProductTablebody .AddedRow').each(function (index) {
        $(this).find('td:first').text(index + 1);
    });
}

$(document).on('input', '.qty', function () {

    const row = $(this).closest("tr");
    const originalQty = parseFloat(row.data("originalqty")) || 0;

    let value = $(this).val();

    // 🔹 Allow only digits and dot
    value = value.replace(/[^0-9.]/g, '');

    // 🔹 Prevent multiple dots
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts[1];
    }

    // 🔹 Limit to 3 decimal places
    if (parts.length === 2) {
        parts[1] = parts[1].substring(0, 3);
        value = parts[0] + '.' + parts[1];
    }

    let numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {

        if (numericValue < 0) {
            numericValue = 0;
        }

        if (numericValue > originalQty) {
            numericValue = originalQty;
            value = numericValue.toString();
        }
    }

    $(this).val(value);

    UpdateMainTableQuantity();
    CalcuWetreLevel();
});

function UpdateMainTableQuantity() {

    let total = 0;

    $("#ProductionPlanProductTablebody tr.AddedRow").each(function () {

        let qty = parseFloat($(this).find(".qty").val()) || 0;
        total += qty;
    });

    $("#TotalWeight").val(total.toFixed(3));
}

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
$(document).on('keyup input change', '#ChemicalDynamic-Pre input, #ChemicalDynamic-After input, #ChemicalDynamic-Dye input, #ChemicalDynamic-DyeBath input, #ChemicalDynamic-Finishing input,' + '#ChemicalDynamic-Pre .DysType, #ChemicalDynamic-After .DysType, #ChemicalDynamic-Dye .DysType, #ChemicalDynamic-DyeBath .DysType, #ChemicalDynamic-Finishing .DysType', function () {
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

    //let totalWeight = parseFloat($('#TotalWeight').val()) || 0;

    let weightStr = $('#TotalWeight').val();
    let cleaned = weightStr.replace(/,/g, '').replace(/[^\d.]/g, '');
    let totalWeight = parseFloat(cleaned) || null;

    let mlr = parseFloat($('#MLR').val()) || 0;

    let waterLevel = totalWeight * mlr;
    let totalDyeQty = 0;

    if (DysType == "1") {
        totalDyeQty = (dyeValue / 1000) * waterLevel;
    } else {
        totalDyeQty = (totalWeight * dyeValue) / 100;
    }

    $row.find('.TotalDyeQty').val(totalDyeQty.toFixed(5));
}

// Calculate chemical quantity
function calculateChemicalQty($row) {
    if (!$row || !$row.length) return;

    let value = parseFloat($row.find('.input-group input[type="text"]').first().val()) || 0;
    let DysType = $row.find('.DysType').val();
    //let totalWeight = parseFloat($('#TotalWeight').val()) || 0;

    let weightStr = $('#TotalWeight').val();
    let cleaned = weightStr.replace(/,/g, '').replace(/[^\d.]/g, '');
    let totalWeight = parseFloat(cleaned) || null;

    let mlr = parseFloat($('#MLR').val()) || 0;

    let waterLevel = totalWeight * mlr;
    let qty = 0;

    if (DysType == "1") {
        qty = (value / 1000) * waterLevel;
    } else {
        qty = (totalWeight * value) / 100;
    }

    $row.find('input[type="text"]').last().val(qty.toFixed(5));
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
                              <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required />
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
                               <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required/>
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
                               <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required/>
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
                               <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required/>
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
                               <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required/>
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
    refreshProductDropdowns(".ProductSelectFinishing");
}

function removeRowRowChemicalFinishing(button) {
    var totalRows = $('.RowOfChemical-Finishing').length;
    if (totalRows > 1) {
        $(button).closest('.RowOfChemical-Finishing').remove();
    }
    updateRemoveChemicalFinishing();
    refreshProductDropdowns(".ProductSelectFinishing");
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

//------------------------------END Attachment------------------------
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

    // Handling alt + v
    if (event.altKey && event.key === 'r') {
        event.preventDefault();
        $('#ProductionPlanJobCardWithRateBtn').click();
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

//=============================================END SHORTCUTS==============================================

//=============================================MultiProcess DD==============================================
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
//=============================================END MultiProcess DD==============================================

/*================================Testing================================*/
function duplicateRowChemicalAfterTesting() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfChemical-After').length;

    var AfterTreatmentSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    //if (AfterTreatmentChemicalProduct != null && AfterTreatmentChemicalProduct.length > 0 && AfterTreatmentChemicalProduct[0].length > 0) {
    //    AfterTreatmentSelectOptions = AfterTreatmentChemicalProduct[0].map(function (ChemicalId) {
    //        return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
    //    }).join('');
    //}


    if (Array.isArray(AfterTreatmentChemicalProduct) &&
        AfterTreatmentChemicalProduct.length > 0) {

        let chemicalList = Array.isArray(AfterTreatmentChemicalProduct[0])
            ? AfterTreatmentChemicalProduct[0]
            : AfterTreatmentChemicalProduct;

        AfterTreatmentSelectOptions = chemicalList.map(function (item) {
            return `<option value="${item.ChemicalId}">${item.ChemicalName}</option>`;
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
                        <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required/>
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

    //var PreTreatmentSelectOptions = "";
    //var defaultOption = '<option value="">--Select--</option>';

    //if (PreTreatmentChemicalProduct != null && PreTreatmentChemicalProduct.length > 0 && PreTreatmentChemicalProduct[0].length > 0) {
    //    PreTreatmentSelectOptions = PreTreatmentChemicalProduct[0].map(function (ChemicalId) {
    //        return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
    //    }).join('');
    //}

    //var PreTreatmentSelectOptions = "";
    //var defaultOption = '<option value="">--Select--</option>';

    //if (Array.isArray(PreTreatmentChemicalProduct) && PreTreatmentChemicalProduct.length > 0) {
    //    PreTreatmentSelectOptions = PreTreatmentChemicalProduct.map(function (item) {
    //        return `<option value="${item.ChemicalId}">${item.ChemicalName}</option>`;
    //    }).join('');
    //}


    var PreTreatmentSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (Array.isArray(PreTreatmentChemicalProduct) &&
        PreTreatmentChemicalProduct.length > 0) {

        // If nested array → take first element
        let chemicalList = Array.isArray(PreTreatmentChemicalProduct[0])
            ? PreTreatmentChemicalProduct[0]
            : PreTreatmentChemicalProduct;

        PreTreatmentSelectOptions = chemicalList.map(function (item) {
            return `<option value="${item.ChemicalId}">${item.ChemicalName}</option>`;
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
                            <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required />
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

    //if (DyeBathChemicalProduct != null && DyeBathChemicalProduct.length > 0 && DyeBathChemicalProduct[0].length > 0) {
    //    DyeBathChemicalSelectOptions = DyeBathChemicalProduct[0].map(function (ChemicalId) {
    //        return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
    //    }).join('');
    //}

    if (Array.isArray(DyeBathChemicalProduct) &&
        DyeBathChemicalProduct.length > 0) {

        let chemicalList = Array.isArray(DyeBathChemicalProduct[0])
            ? DyeBathChemicalProduct[0]
            : DyeBathChemicalProduct;

        DyeBathChemicalSelectOptions = chemicalList.map(function (item) {
            return `<option value="${item.ChemicalId}">${item.ChemicalName}</option>`;
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
                            <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required />
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

    //if (DyeChemicalProduct != null && DyeChemicalProduct.length > 0 && DyeChemicalProduct[0].length > 0) {
    //    DyeChemicalSelectOptions = DyeChemicalProduct[0].map(function (ChemicalId) {
    //        return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
    //    }).join('');
    //}

    if (Array.isArray(DyeChemicalProduct) && DyeChemicalProduct.length > 0) {

        let chemicalList = Array.isArray(DyeChemicalProduct[0])
            ? DyeChemicalProduct[0]
            : DyeChemicalProduct;

        DyeChemicalSelectOptions = chemicalList.map(function (item) {
            return `<option value="${item.ChemicalId}">${item.ChemicalName}</option>`;
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
                            <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required />
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

    //if (FinishingChemicalProduct != null && FinishingChemicalProduct.length > 0 && FinishingChemicalProduct[0].length > 0) {
    //    FinishingChemicalSelectOptions = FinishingChemicalProduct[0].map(function (ChemicalId) {
    //        return `<option value="${ChemicalId.ChemicalId}">${ChemicalId.ChemicalName}</option>`;
    //    }).join('');
    //}

    if (Array.isArray(FinishingChemicalProduct) &&
        FinishingChemicalProduct.length > 0) {

        let chemicalList = Array.isArray(FinishingChemicalProduct[0])
            ? FinishingChemicalProduct[0]
            : FinishingChemicalProduct;

        FinishingChemicalSelectOptions = chemicalList.map(function (item) {
            return `<option value="${item.ChemicalId}">${item.ChemicalName}</option>`;
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
                            <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalFiveVal(this, 2)" required />
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
    //var scanUrl = "http://103.174.10.91:8123/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;
    //var scanUrl = "http://103.174.10.91:8108/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;
    var scanUrl = "http://103.181.21.202:8123/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;

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

    // Step 1: Save Production Plan
    saveProductionPlan(function (productionPlanId) {

        $('#loader-pms').show();

        // Safety check
        if (!productionPlanId) {
            $('#loader-pms').hide();
            Common.errorMsg("Production Plan ID not returned");
            return;
        }

        //var scanUrl = "http://103.174.10.91:8123/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;
        //var scanUrl = "http://103.174.10.91:8108/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;
        var scanUrl = "http://103.181.21.202:8123/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;

        // Step 2: Prepare JobCard Print Data
        var EditData = {
            ModuleId: parseInt(productionPlanId),
            NoOfCopies: 1,
            printType: "Preview", // Options: "Print", "Download", "Print"
            Url: scanUrl,
            IsRate: 0
        };

        $.ajax({
            type: 'GET',
            url: '/Productions/JobCardPrint',
            data: EditData,
            xhrFields: { responseType: 'blob' },

            success: function (response) {

                $('#ShareDropdownitems').hide();

                var blob = new Blob([response], { type: 'application/pdf' });
                var blobUrl = URL.createObjectURL(blob);

                // 🔹 PRINT TYPE HANDLER
                if (EditData.printType === "Preview") {

                    var newTab = window.open();
                    if (newTab) {
                        newTab.document.write(`
                            <html>
                            <head>
                                <title>Production Plan Preview</title>
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

                } else if (EditData.printType === "Download") {

                    var link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = 'Production Plan.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                } else if (EditData.printType === "Print") {

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
                Common.errorMsg("JobCard print failed");
            }
        });

    }, {
        showSuccessMsg: false // ❌ Disable success message
    });

});

$(document).on('click', '#ProductionPlanJobCardWithRateBtn', function () {

    $('#loader-pms').show();

    // Step 1: Save Production Plan
    saveProductionPlan(function (productionPlanId) {

        $('#loader-pms').show();

        // Safety check
        if (!productionPlanId) {
            $('#loader-pms').hide();
            Common.errorMsg("Production Plan ID not returned");
            return;
        }

        //var scanUrl = "http://103.174.10.91:8123/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;
        //var scanUrl = "http://103.174.10.91:8108/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;
        var scanUrl = "http://103.181.21.202:8123/ProductionQRCode/ProductionQRCodeLogin?ProductionPlanId=" + ProductionPlanId + "&PlantMappingId=" + PlantMappingId;

        // Step 2: Prepare JobCard Print Data
        var EditData = {
            ModuleId: parseInt(productionPlanId),
            NoOfCopies: 1,
            printType: "Preview", // Options: "Print", "Download", "Print"
            Url: scanUrl,
            IsRate: 1
        };

        $.ajax({
            type: 'GET',
            url: '/Productions/JobCardPrint',
            data: EditData,
            xhrFields: { responseType: 'blob' },

            success: function (response) {

                $('#ShareDropdownitems').hide();

                var blob = new Blob([response], { type: 'application/pdf' });
                var blobUrl = URL.createObjectURL(blob);

                // 🔹 PRINT TYPE HANDLER
                if (EditData.printType === "Preview") {

                    var newTab = window.open();
                    if (newTab) {
                        newTab.document.write(`
                            <html>
                            <head>
                                <title>Production Plan Preview</title>
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

                } else if (EditData.printType === "Download") {

                    var link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = 'Production Plan.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                } else if (EditData.printType === "Print") {

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
                Common.errorMsg("JobCard print failed");
            }
        });

    }, {
        showSuccessMsg: false // ❌ Disable success message
    });

});

/*GenerateQrContectPdf*/
//$(document).on('click', '#ProductionPlanPreviewbtn', function () {

//    $('#loader-pms').show();

//    var ProductionPlanNo = $('#BatchNo').val();

//    //var scanUrl =
//    //    "BEGIN:VCARD\n" +
//    //    "VERSION:3.0\n" +
//    //    "N:S;Vignesh;;;\n" +                       // Last Name; First Name
//    //    "FN:Vignesh S\n" +                         // Full Name
//    //    "TITLE:Regional Sales Manager - India\n" + // Job Title
//    //    "TEL;TYPE=CELL:+918807966096\n" +         // Phone
//    //    "EMAIL:vignesh.s@vahle.com\n" +           // Email
//    //    "END:VCARD";

//    var scanUrl = "https://tetrosoft.co.in/";

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

/*AvailableQuantity*/
//<td>
//    <div class="input-group" style="flex-wrap:nowrap;width:100px;">
//        <input type="text" class="form-control AvailableQuantity" value="${qtyValue}" oninput="Common.allowOnlyNumbersAndAfterDecimalThreeVal(this, 4)">
//            <button class="btn btn-secondary p-0" type="button" style="padding:4px!important; border-top-left-radius:0; border-bottom-left-radius:0; font-size:12px; width:29px; height:26px;">KG</button>
//    </div>
//</td>

function cb(start, end, label) {
    if (label === 'No Date') {
        $('#reportrange span').html('No Date');
    } else {
        $('#reportrange span').html(
            start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY')
        );
        $('#reportrange').css('color', '#000'); // remove disabled look
    }
}

function bindDropDownPrint(id, moduleName, ValuesOfid) {

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
                bindDropDownSuccessPrint(response.data, id, ValuesOfid);
            }
        },
        error: function (response) {

        },
    });
}

function bindDropDownSuccessPrint(response, controlid) {
    if (response != null) {
        var data = JSON.parse(response);
        $('#' + controlid).empty();
        var dataValue = data[0];
        if (dataValue != null && dataValue.length > 0) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];
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
        bindDropDownValuesPrint('ReportValue', 'GreyFabric', 1, 0);
    }
}

function bindDropDownValuesPrint(id, moduleName, MasterInfoId, ValuesOfid) {

    $.ajax({
        type: 'GET',
        dataType: "json",
        url: '/Inventory/GetDDMasterInfoValue',
        data: {
            moduleName: moduleName,
            MasterInfoId: parseInt(MasterInfoId)
        },
        success: function (response) {
            if (response.status === true) {
                bindDropDownSuccessValuesPrint(response.data, id, ValuesOfid);
            }
        },
        error: function (response) {
            console.log("Error:", response);
        }
    });
}

function bindDropDownSuccessValuesPrint(response, controlid, ValuesOfid) {
    if (response != null) {
        var data = JSON.parse(response);
        $('#' + controlid).empty();
        var dataValue = data[0];
        if (dataValue != null && dataValue.length > 0) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];
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
        $('#' + controlid).val(ValuesOfid).trigger('change');
        $('#loader-pms').hide();
    }
}