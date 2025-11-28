var QuotationId = 0;
var ColorDropdown = [];
var ProcessDropdown = [];
var FabricDropdown = [];

/* -------------------------- Initial Load Event -------------------------------------- */
$(document).ready(async function () {

    Common.bindDropDown('ClientId', 'Client');
    Common.bindDropDown('CreatedBy', 'SampleReceivedBy');

    var colorDropdown = await Common.bindDropDownSync('Color');
    ColorDropdown = JSON.parse(colorDropdown);

    var processDropdown = await Common.bindDropDownSync('ProcessType');
    ProcessDropdown = JSON.parse(processDropdown);

    var fabricDropdown = await Common.bindDropDownSync('FabricType');
    FabricDropdown = JSON.parse(fabricDropdown);

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
        Common.ajaxCall("GET", "/Sale/GetQuotation", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetQuotationSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Sale/GetQuotation", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetQuotationSuccess, null);
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
            Common.ajaxCall("GET", "/Sale/GetQuotation", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetQuotationSuccess, null);
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
        Common.ajaxCall("GET", "/Sale/GetQuotation", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetQuotationSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Sale/GetQuotation", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetQuotationSuccess, null);

    $(document).on('click', '#AddQuotation', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#QuotationCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#QuotationCanvas").css("width", "50%");
        } else {
            $("#QuotationCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $("#QuotationHeader").text('Add Quotation Details');

        $('.DynamicColorList').empty();
        $('.DynamicProcessList').empty();

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);
        $('#Date').val(formattedDate);

        QuotationId = 0;

        duplicateRowProcess();
        duplicateRowColor();
        CanvasOpenFirstShowingQuotation();
        $('#SaveQuotation').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', function () {
        QuotationId = $(this).data('id');
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#QuotationCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#QuotationCanvas").css("width", "50%");
        } else {
            $("#QuotationCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $("#QuotationHeader").text('Edit Quotation Details');

        $('.DynamicColorList').empty();
        $('.DynamicProcessList').empty();

        duplicateRowProcess();
        duplicateRowColor();
        CanvasOpenFirstShowingQuotation();
        $('#SaveQuotation').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#QuotationCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });
});

function GetQuotationSuccess(response) {
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

        $('#QuotationMainTableDynamic').empty();

        $('#QuotationMainTableDynamic').html(`
                <div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" style="max-height:200px" id="QuotationTable">
                    </table>
                </div>
        `);

        var columns = Common.bindColumn(data[1], ['QuotationId', 'Status_Color']);
        Common.bindTable('QuotationTable', data[1], columns, -1, 'QuotationId', '360px', true, access);
    }
}

function duplicateRowColor() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.ColorListRow').length;

    var ColorSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (ColorDropdown && ColorDropdown[0]?.length > 0) {
        ColorSelectOptions = ColorDropdown[0].map(c =>
            `<option value="${c.ColorId}">${c.PantoneCode}</option>`
        ).join('');
    }

    var FabricSelectOptions = "";
    if (FabricDropdown && FabricDropdown[0]?.length > 0) {
        FabricSelectOptions = FabricDropdown[0].map(f =>
            `<option value="${f.FabricTypeId}">${f.FabricTypeName}</option>`
        ).join('');
    }

    var htmlRow = `
    <div class="row ColorListRow">
        <div class="col-md-3 col-lg-3 col-sm-5 col-5 pr-0 FabricClassDiv">
            <div class="form-group">
                <label class="FabricClass">Fabric<span id="Asterisk">*</span></label>
                <select class="form-control FabricType" id="FabricType${numberIncr}" name="FabricType${numberIncr}">
                    ${defaultOption}${FabricSelectOptions}
                </select>
            </div>
        </div>
        <div class="col-md-2 col-lg-3 col-sm-5 col-5 ColorClassDiv">
            <div class="form-group">
                <label class="ColorClass">Pantone Code<span id="Asterisk">*</span></label>
                <select class="form-control Color" id="Color${numberIncr}" name="Color${numberIncr}">
                    ${defaultOption}${ColorSelectOptions}
                </select>
            </div>
        </div>
        <div class="col-md-2 col-lg-2 col-sm-3 col-3 pr-0 pl-0 ProposedPriceClassDiv">
            <div class="form-group">
                <label class="ProposedPriceClass">Proposed Price<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ProposedPrice" placeholder="Ex: 12000/-" id="ProposedPrice${numberIncr}" name="ProposedPrice${numberIncr}" maxlength="50" required />
            </div>
        </div>
        <div class="col-md-3 col-lg-3 col-sm-3 col-3 pl-3 ApprovedPriceClassDiv">
            <div class="form-group">
                <label class="ApprovedPriceClass">Approved Price<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ApprovedPrice" placeholder="Ex: 10000/-" id="ApprovedPrice${numberIncr}" name="ApprovedPrice${numberIncr}" maxlength="50" required />
            </div>
        </div>
        <div class="col-lg-1 col-md-1 col-sm-3 col-3 thiswillColorshow p-0 mt--1" style="display: ${rowadd == 0 ? 'none' : 'block'}">
            <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRowColor(this)"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    </div>
    `;

    $('.DynamicColorList').append(htmlRow);

    if (QuotationId == 0) {
        $('.FabricClassDiv').removeClass('col-md-4 col-lg-4 col-sm-5 col-5 pr-0 FabricClassDiv').addClass('col-md-3 col-lg-3 col-sm-5 col-5 pr-0 FabricClassDiv');
        $('.ColorClassDiv').removeClass('col-md-2 col-lg-3 col-sm-5 col-5 ColorClassDiv').addClass('col-md-4 col-lg-4 col-sm-5 col-5 ColorClassDiv');
        $('.ProposedPriceClassDiv').removeClass('col-md-3 col-lg-3 col-sm-3 col-3 pr-0 pl-0 ProposedPriceClassDiv').addClass('col-md-3 col-lg-3 col-sm-3 col-3 pr-0 pl-0 ProposedPriceClassDiv');
        $('.thiswillColorshow').removeClass('col-lg-1 col-md-1 col-sm-3 col-3 thiswillColorshow p-0 mt--1').addClass('col-lg-2 col-md-2 col-sm-3 col-3 thiswillColorshow p-0 mt--1');
        $('.ApprovedPriceClassDiv').hide();
    } else {
        $('.FabricClassDiv').removeClass('col-md-3 col-lg-3 col-sm-5 col-5 pr-0 FabricClassDiv').addClass('col-md-3 col-lg-3 col-sm-5 col-5 pr-0 FabricClassDiv');
        $('.ColorClassDiv').removeClass('col-md-4 col-lg-4 col-sm-5 col-5 ColorClassDiv').addClass('col-md-2 col-lg-3 col-sm-5 col-5 ColorClassDiv');
        $('.ProposedPriceClassDiv').removeClass('col-md-3 col-lg-3 col-sm-3 col-3 pr-0 pl-0 ProposedPriceClassDiv').addClass('col-md-2 col-lg-2 col-sm-3 col-3 pr-0 pl-0 ProposedPriceClassDiv');
        $('.thiswillColorshow').removeClass('col-lg-2 col-md-2 col-sm-3 col-3 thiswillColorshow p-0 mt--1').addClass('col-lg-1 col-md-1 col-sm-3 col-3 thiswillColorshow p-0 mt--1');
        $('.ApprovedPriceClassDiv').show();
    }

    updateRemoveButtonsColor();
}

function updateRemoveButtonsColor() {
    var rows = $('.ColorListRow');

    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillColorshow');
        var labels = $(this).find('.FabricClass, .ColorClass, .ProposedPriceClass, .ApprovedPriceClass');

        if (index === 0) {
            labels.show();
            removeButtonDiv.hide();
        } else {
            labels.hide();
            removeButtonDiv.show();
        }
    });
}

function removeRowColor(button) {
    var totalRows = $('.ColorListRow').length;
    if (totalRows > 1) {
        $(button).closest('.ColorListRow').remove();
        updateRemoveButtonsColor();
    }
}

function duplicateRowProcess() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.ProcessListRow').length

    var ProcessSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (ProcessDropdown != null && ProcessDropdown.length > 0 && ProcessDropdown[0].length > 0) {
        ProcessSelectOptions = ProcessDropdown[0].map(function (ProcessTypeId) {
            return `<option value="${ProcessTypeId.ColorId}">${ProcessTypeId.ProcessTypeName}</option>`;
        }).join('');
    }

    var htmlRow = `
    <div class="row ProcessListRow"> 
        <div class="col-md-5 col-lg-5 col-sm-5 col-5 ProcessTypeDiv">
            <div class="form-group">
                <label class="ProcessTypeIdClass">Process Type<span id="Asterisk">*</span></label>
                <select class="form-control ProcessTypeId" id="ProcessTypeId${numberIncr}" name="ProcessTypeId${numberIncr}">
                    ${defaultOption}${ProcessSelectOptions}
                </select>
            </div>
        </div>
        <div class="col-md-3 col-lg-3 col-sm-3 col-3 pl-0 pr-0 ProposedPriceClassProcessDiv">
            <div class="form-group">
                <label class="ProposedPriceProcess">Proposed Price<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ProcessProposedPrice" placeholder="Ex: 12000/-" id="ProcessProposedPrice${numberIncr}" name="ProcessProposedPrice${numberIncr}" maxlength="50" required />
            </div>
        </div>
        <div class="col-md-3 col-lg-3 col-sm-3 col-3 ApprovedPriceProcessDiv">
            <div class="form-group">
                <label class="ApprovedPriceProcess">Approved Price<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ProcessApprovedPrice" placeholder="Ex: 10000/-" id="ProcessApprovedPrice${numberIncr}" name="ProcessApprovedPrice${numberIncr}" maxlength="50" required />
            </div>
        </div>
        <div class="col-lg-1 col-md-1 col-sm-3 col-3 thiswillProcessshow mt--1 p-0" style="display: ${rowadd == 0 ? 'none' : 'block'}"> 
            <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRowProcess(this)"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    </div>
    `;
    $('.DynamicProcessList').append(htmlRow);

    if (QuotationId == 0) {
        $('.ProcessTypeDiv').removeClass('col-md-6 col-lg-6 col-sm-5 col-5 ProcessTypeDiv').addClass('col-md-7 col-lg-7 col-sm-5 col-5 ProcessTypeDiv');
        $('.ProposedPriceClassProcessDiv').removeClass('col-md-3 col-lg-3 col-sm-3 col-3 pl-0 pr-0 ProposedPriceClassProcessDiv').addClass('col-md-3 col-lg-3 col-sm-3 col-3 pl-0 pr-0 ProposedPriceClassProcessDiv');
        $('.thiswillProcessshow').removeClass('col-lg-1 col-md-1 col-sm-3 col-3 thiswillColorshow p-0 mt--1').addClass('col-lg-2 col-md-2 col-sm-3 col-3 thiswillProcessshow mt--1 p-0');
        $('.ApprovedPriceProcessDiv').hide();
    } else {
        $('.ProcessTypeDiv').removeClass('col-md-7 col-lg-7 col-sm-5 col-5 ProcessTypeDiv').addClass('col-md-6 col-lg-6 col-sm-5 col-5 ProcessTypeDiv');
        $('.ProposedPriceClassProcessDiv').removeClass('col-md-3 col-lg-3 col-sm-3 col-3 pl-0 pr-0 ProposedPriceClassDiv').addClass('col-md-2 col-lg-2 col-sm-3 col-3 pl-0 pr-0 ProposedPriceClassProcessDiv');
        $('.thiswillProcessshow').removeClass('col-lg-1 col-md-1 col-sm-3 col-3 thiswillColorshow p-0 mt--1').addClass('col-lg-1 col-md-1 col-sm-3 col-3 thiswillColorshow p-0 mt--1');
        $('.ApprovedPriceProcessDiv').show();
    }
    updateRemoveButtonsProcess();
}

function updateRemoveButtonsProcess() {
    var rows = $('.ProcessListRow');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillProcessshow');
        var labels = $(this).find('.ProcessTypeIdClass, .ProposedPriceProcess, .ApprovedPriceProcess');
        if (index === 0) {
            labels.show();
            removeButtonDiv.hide();
        } else {
            labels.hide();
            removeButtonDiv.show();
        }
    });
}

function removeRowProcess(button) {
    var totalRows = $('.ProcessListRow').length;
    if (totalRows > 1) {
        $(button).closest('.ProcessListRow').remove();
        updateRemoveButtonsProcess();
    }
}

function CanvasOpenFirstShowingQuotation() {
    $('#QuotationCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2').collapse('hide');
    $('#QuotationCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#QuotationCanvas').offset().top
    }, 'fast');
}
