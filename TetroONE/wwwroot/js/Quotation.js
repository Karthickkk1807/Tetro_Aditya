var QuotationId = 0;
var PlantMappingId = 0;
var ColorDropdown = [];
var ProcessDropdown = [];
var FabricDropdown = [];
var formDataMultiple = new FormData();

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

    var todayDate = new Date().toISOString().split('T')[0];
    $('#QuotationDate').attr('max', todayDate);

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
        Common.removevalidation('FormQuotation');
        $('#CreatedByDiv').hide(); 
        $('.Status-Div').hide();
        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);
        $('#QuotationDate').val(formattedDate);
        $('#ReMarks').attr('rows', 1);

        deletedFiles = [];
        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        QuotationId = 0;

        duplicateRowProcess();
        duplicateRowColor();
        CanvasOpenFirstShowingQuotation();

        var EditDataId = { ModuleName: 'Quotation', ModuleId: null }
        Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, function (response) {
            if (response.status);
            Common.bindDropDownSuccess(response.data, "QuotationStatusId");
            $('#QuotationStatusId').val(1).trigger('change');
        }, null);
         
        Common.ajaxCall("GET", "/Common/GetAutoGenerate", { ModuleName: 'Quotation', PlantId: PlantMappingId }, function (response) {
            Common.AutoGenerateNumberGet(response, "QuotationNo", "QuotationNo");
        });

        $('#SaveQuotation').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        $('#PrintQuotation').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', async function () {
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

        Common.removevalidation('FormQuotation');
        $('#ReMarks').attr('rows', 5);

        deletedFiles = [];
        existFiles = [];
        formDataMultiple = new FormData();
        $('#selectedFiles').empty();
        $('#ExistselectedFiles').empty();

        $('.Status-Div').show();
        $('#CreatedByDiv').show();
        CanvasOpenFirstShowingQuotation();
        $('#SaveQuotation').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
        $('#PrintQuotation').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');

        const activityResponse = await ajaxPromise("GET", "/Common/ActivityHistoryDetails", {
            ModuleName: "Quotation",
            ModuleId: QuotationId
        });
        StatusActivitySuccess(activityResponse);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Sale/GetQuotation", { PlantId: parseInt(PlantMappingId), QuotationId: QuotationId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, QuotationNotNullSuccess, null);
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#QuotationCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    function saveQuotation(callback, options = {}) {
        const showSuccessMsg = options.showSuccessMsg !== false; // default = true

        if (!$("#FormQuotation").valid()) {
            return false;
        }

        getExistFiles();

        var DataQuotation = $('#FormQuotation').serializeArray();
        var objvalue = {};
        $.each(DataQuotation, function (index, item) {
            objvalue[item.name] = item.value;
        });

        objvalue.QuotationId = parseInt(QuotationId) || null;
        objvalue.PlantId = parseInt(PlantMappingId) || null;
        objvalue.QuotationNo = $('#QuotationNo').val();
        objvalue.ClientId = Common.parseInputValue('ClientId') || null;
        objvalue.QuotationStatusId = Common.parseInputValue('QuotationStatusId') || null;
        objvalue.QuotationDate = $('#QuotationDate').val() || null;
        objvalue.ValidTo = $('#ValidTo').val() || null;

        // ===== Color Details =====
        var QuotationColorMappingDetails = [];
        $('.DynamicColorList .ColorListRow').each(function () {
            var row = $(this);
            QuotationColorMappingDetails.push({
                QuotationColorMappingId: parseInt(row.find('.ColorListMappingId').text()) || null,
                QuotationId: objvalue.QuotationId,
                FabricId: parseInt(row.find('.FabricType').val()) || null,
                ColorId: parseInt(row.find('.Color').val()) || null,
                ProposedPrice: parseFloat(row.find('.ProposedPrice').val()) || null,
                ApprovedPrice: parseFloat(row.find('.ApprovedPrice').val()) || null
            });
        });
        objvalue.QuotationColorMappingDetails = QuotationColorMappingDetails;

        // ===== Process Type Details =====
        var QuotationProcessTypeMappingDetails = [];
        $('.DynamicProcessList .ProcessListRow').each(function () {
            var row = $(this);
            QuotationProcessTypeMappingDetails.push({
                QuotationProcessTypeMappingId: parseInt(row.find('.ProcessTypeMappingId').text()) || null,
                ProcessTypeId: parseInt(row.find('.ProcessTypeId').val()) || null,
                ProposedPrice: parseFloat(row.find('.ProcessProposedPrice').val()) || null,
                ApprovedPrice: parseFloat(row.find('.ProcessApprovedPrice').val()) || null,
                QuotationId: objvalue.QuotationId
            });
        });
        objvalue.QuotationProcessTypeMappingDetails = QuotationProcessTypeMappingDetails;

        $('#loader-pms').show();

        formDataMultiple.append("QuotationData", JSON.stringify(objvalue));
        formDataMultiple.append("QuotationColorMappingDetails", JSON.stringify(QuotationColorMappingDetails));
        formDataMultiple.append("QuotationProcessTypeMappingDetails", JSON.stringify(QuotationProcessTypeMappingDetails));
        formDataMultiple.append("Exist", JSON.stringify(existFiles));
        formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));

        $.ajax({
            type: "POST",
            url: "/Sale/InsertUpdateQuotationDetails",
            data: formDataMultiple,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status) {
                    if (showSuccessMsg) {
                        Common.successMsg(response.message);
                    }

                    if (callback) {
                        var data = JSON.parse(response.data);

                        deletedFiles = [];
                        existFiles = [];
                        formDataMultiple = new FormData();
                        $('#selectedFiles').empty();
                        $('#ExistselectedFiles').empty();

                        QuotationId = data[0][0].QuotationId; 
                        callback(data[0][0].QuotationId);
                    }
                } else {
                    Common.errorMsg(response.message);
                    formDataMultiple = new FormData();
                }
            },
            function(error) {
                $('#loader-pms').hide();
                console.error("Error saving quotation:", error);
                Common.errorMsg("Failed to save quotation");
            }
        });
    }

    $(document).on('click', '#SaveQuotation', function () {
        saveQuotation(function (quotationId) {
            $("#QuotationCanvas").css("width", "0%");
            $('#fadeinpage').removeClass('fadeoverlay');
            $('#loader-pms').hide();

            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall(
                "GET",
                "/Sale/GetQuotation",
                {
                    PlantId: parseInt(PlantMappingId),
                    QuotationId: null,
                    FromDate: fnData.startDate.toISOString(),
                    ToDate: fnData.endDate.toISOString()
                },
                GetQuotationSuccess,
                null
            );
        });
    });

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var QuotationId = $(this).data('id');
            Common.ajaxCall("GET", "/Sale/DeleteQuotationDetails", { QuotationId: QuotationId }, QuotationInsertUpdateSuccess, null);
        }
    });

    $(document).on('click', '#PrintQuotation', function () {
        $('#loader-pms').show();

        saveQuotation(function (quotationId) {

            if (!quotationId) {
                $('#loader-pms').hide();
                Common.errorMsg("Quotation ID not found");
                return;
            }

            var EditData = {
                ModuleId: parseInt(quotationId),
                NoOfCopies: 1,
                printType: "Print"
            };

            $.ajax({
                url: '/Sale/QuotationPrint',
                method: 'GET',
                data: EditData,
                xhrFields: { responseType: 'blob' },
                success: function (response) {
                    var blob = new Blob([response], { type: 'application/pdf' });
                    var blobUrl = URL.createObjectURL(blob);

                    var printType = EditData.printType;

                    if (printType === "Preview") {
                        var newTab = window.open();
                        if (newTab) {
                            newTab.document.write(`
                            <html>
                            <head><title>Quotation Preview</title></head>
                            <body style="margin:0;">
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
                        link.download = 'Quotation.pdf';
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

        }, {
            showSuccessMsg: false // ❌ disable save success toast when printing
        });
    });
    
    $(document).on("change", ".FabricType", function () {

        const classMap = [".FabricType"];
        const changedClass = classMap.find(c => $(this).hasClass(c.substring(1)));
        refreshProductDropdowns(changedClass);
    });

    $(document).on("change", ".ProcessTypeId", function () {

        const classMap = [".ProcessTypeId"];
        const changedClass = classMap.find(c => $(this).hasClass(c.substring(1)));
        refreshProductProcessTypedowns(changedClass);
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

function QuotationInsertUpdateSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#QuotationCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        QuotationId = 0;

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Sale/GetQuotation", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetQuotationSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
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

function QuotationNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
         
        var EditDataId = { ModuleName: 'Quotation', ModuleId: parseInt(QuotationId) }
        Common.ajaxCall("GET", "/Common/GetInventoryStatusDetails", EditDataId, function (response) {
            if (response.status);
            Common.bindDropDownSuccess(response.data, "QuotationStatusId");
            $('#QuotationStatusId').val(data[0][0].QuotationStatusId);
        }, null);
         
        if (data[1][0].QuotationColorMappingId != null && data[1][0].QuotationColorMappingId != "") {

            $('.DynamicColorList').empty();

            $.each(data[1], function (index, QuotationColor) {
                var rowadd = $('.ColorListRow').length;
                let numberIncr = Math.random().toString(36).substring(2);

                var QuotationColorMappingId = QuotationColor.QuotationColorMappingId;
                var FabricId = QuotationColor.FabricId;
                var PantoneColorId = QuotationColor.ColorId;
                var ProposedPrice = QuotationColor.ProposedPrice;
                var ApprovedPrice = QuotationColor.ApprovedPrice;

                var defaultOption = '<option value="">--Select--</option>';

                var FabricSelectOptions = "";
                FabricSelectOptions = FabricDropdown[0].map(function (FabricTypeId) {
                    var isSelected = FabricTypeId.FabricTypeId == FabricId ? 'selected' : '';
                    return `<option value="${FabricTypeId.FabricTypeId}" ${isSelected}>${FabricTypeId.FabricTypeName}</option>`;
                }).join('');

                var ColorSelectOptions = "";
                ColorSelectOptions = ColorDropdown[0].map(function (ColorId) {
                    var isSelected = ColorId.ColorId == PantoneColorId ? 'selected' : '';
                    return `<option value="${ColorId.ColorId}" ${isSelected}>${ColorId.PantoneCode}</option>`;
                }).join('');

                var htmlRow = `
                <div class="row ColorListRow">
                    <label class="ColorListMappingId d-none">${QuotationColorMappingId}</label>
                    <div class="col-md-3 col-lg-3 col-sm-5 col-5 pr-0 FabricClassDiv">
                        <div class="form-group">
                            <label class="FabricClass">Fabric<span id="Asterisk">*</span></label>
                            <select class="form-control FabricType" id="FabricType${numberIncr}" name="FabricType${numberIncr}" required>
                                ${defaultOption}${FabricSelectOptions}
                            </select>
                        </div>
                    </div>
                    <div class="col-md-2 col-lg-3 col-sm-5 col-5 ColorClassDiv">
                        <div class="form-group">
                            <label class="ColorClass">Color<span id="Asterisk">*</span></label>
                            <select class="form-control Color" id="Color${numberIncr}" name="Color${numberIncr}" required>
                                ${defaultOption}${ColorSelectOptions}
                            </select>
                        </div>
                    </div>
                    <div class="col-md-2 col-lg-2 col-sm-3 col-3 pr-0 pl-0 ProposedPriceClassDiv">
                        <div class="form-group">
                            <label class="ProposedPriceClass">Proposed (₹)<span id="Asterisk">*</span></label>
                            <input type="text" class="form-control ProposedPrice" placeholder="Ex: 12000/-" id="ProposedPrice${numberIncr}" name="ProposedPrice${numberIncr}" required value="${ProposedPrice.toFixed(2)}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
                        </div>                                                                                                                                                
                    </div>                                                                                                                                                    
                    <div class="col-md-3 col-lg-3 col-sm-3 col-3 pl-3 ApprovedPriceClassDiv">                                                                                 
                        <div class="form-group">                                                                                                                              
                            <label class="ApprovedPriceClass">Approved (₹)<span id="Asterisk">*</span></label>
                            <input type="text" class="form-control ApprovedPrice" placeholder="Ex: 10000/-" id="ApprovedPrice${numberIncr}" name="ApprovedPrice${numberIncr}" value="${(ApprovedPrice || ProposedPrice).toFixed(2)}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" required/>
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
            });
            updateRemoveButtonsColor();
        }

        if (data[2][0].QuotationProcessTypeMappingId != null && data[2][0].QuotationProcessTypeMappingId != "") {

            $('.DynamicProcessList').empty();

            $.each(data[2], function (index, QuotationProcess) {
                let numberIncr = Math.random().toString(36).substring(2);
                var rowadd = $('.ProcessListRow').length

                var QuotationColorMappingId = QuotationProcess.QuotationProcessTypeMappingId;
                var ProcessDDTypeId = QuotationProcess.ProcessTypeId;
                var ProposedPrice = QuotationProcess.ProposedPrice;
                var ApprovedPrice = QuotationProcess.ApprovedPrice;

                var defaultOption = '<option value="">--Select--</option>';

                var ProcessSelectOptions = "";
                ProcessSelectOptions = ProcessDropdown[0].map(function (ProcessTypeId) {
                    var isSelected = ProcessTypeId.ProcessTypeId == ProcessDDTypeId ? 'selected' : '';
                    return `<option value="${ProcessTypeId.ProcessTypeId}" ${isSelected}>${ProcessTypeId.ProcessTypeName}</option>`;
                }).join('');


                var htmlRow = `
                <div class="row ProcessListRow">
                    <label class="ProcessTypeMappingId d-none">${QuotationColorMappingId}</label>
                    <div class="col-md-5 col-lg-5 col-sm-5 col-5 ProcessTypeDiv">
                        <div class="form-group">
                            <label class="ProcessTypeIdClass">Process Type<span id="Asterisk">*</span></label>
                            <select class="form-control ProcessTypeId" id="ProcessTypeId${numberIncr}" name="ProcessTypeId${numberIncr}" required>
                                ${defaultOption}${ProcessSelectOptions}
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3 col-lg-3 col-sm-3 col-3 pl-0 pr-0 ProposedPriceClassProcessDiv">
                        <div class="form-group">
                            <label class="ProposedPriceProcess">Proposed (₹)<span id="Asterisk">*</span></label>
                            <input type="text" class="form-control ProcessProposedPrice" placeholder="Ex: 12000/-" id="ProcessProposedPrice${numberIncr}" name="ProcessProposedPrice${numberIncr}" required value="${ProposedPrice.toFixed(2)}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
                        </div>
                    </div>
                    <div class="col-md-3 col-lg-3 col-sm-3 col-3 ApprovedPriceProcessDiv">
                        <div class="form-group">
                            <label class="ApprovedPriceProcess">Approved (₹)<span id="Asterisk">*</span></label>
                            <input type="text" class="form-control ProcessApprovedPrice" placeholder="Ex: 10000/-" id="ProcessApprovedPrice${numberIncr}" name="ProcessApprovedPrice${numberIncr}" value="${(ApprovedPrice || ProposedPrice).toFixed(2)}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" required/>
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
            });
            updateRemoveButtonsProcess();
        }

        $('#ExistselectedFiles, #selectedFiles').empty("");
        var ulElement = $('#ExistselectedFiles');
        $.each(data[3], function (index, file) {
            if (file.AttachmentId != null) {
                var truncatedFileName = file.AttachmentFileName.length > 10 ? file.AttachmentFileName.substring(0, 10) + '...' : file.AttachmentFileName;
                var liElement = $('<li>');
                var spanElement = $('<span>').text(truncatedFileName);
                var downloadLink = $('<a>').addClass('download-link')
                    .attr('href', file.AttachmentFilePath)
                    .attr('download', file.AttachmentFileName)
                    .html('<i class="fas fa-download"></i>');

                var deleteButton = $('<a>').attr({
                    'src': file.AttachmentFilePath,
                    'AttachmentId': file.AttachmentId,
                    'ModuleRefId': file.ModuleRefId,
                    'id': 'deletefile'
                }).addClass('delete-buttonattach').html('<i class="fas fa-trash"></i>');

                liElement.append(spanElement);
                liElement.append(downloadLink);
                liElement.append(deleteButton);
                ulElement.append(liElement);
            }
        });
    }
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


function refreshProductProcessTypedowns(selector) {

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
        <label class="ColorListMappingId d-none"></label>
        <div class="col-md-3 col-lg-3 col-sm-5 col-5 pr-0 FabricClassDiv">
            <div class="form-group">
                <label class="FabricClass">Fabric<span id="Asterisk">*</span></label>
                <select class="form-control FabricType" id="FabricType${numberIncr}" name="FabricType${numberIncr}" required>
                    ${defaultOption}${FabricSelectOptions}
                </select>
            </div>
        </div>
        <div class="col-md-2 col-lg-3 col-sm-5 col-5 ColorClassDiv">
            <div class="form-group">
                <label class="ColorClass">Color<span id="Asterisk">*</span></label>
                <select class="form-control Color" id="Color${numberIncr}" name="Color${numberIncr}" required>
                    ${defaultOption}${ColorSelectOptions}
                </select>
            </div>
        </div>
        <div class="col-md-2 col-lg-2 col-sm-3 col-3 pr-0 pl-0 ProposedPriceClassDiv">
            <div class="form-group">
                <label class="ProposedPriceClass">Proposed (₹)<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ProposedPrice" placeholder="Ex: 12000/-" id="ProposedPrice${numberIncr}" name="ProposedPrice${numberIncr}" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
            </div>                                                                                                                                                
        </div>                                                                                                                                                    
        <div class="col-md-3 col-lg-3 col-sm-3 col-3 pl-3 ApprovedPriceClassDiv">                                                                                 
            <div class="form-group">                                                                                                                              
                <label class="ApprovedPriceClass">Approved (₹)<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ApprovedPrice" placeholder="Ex: 10000/-" id="ApprovedPrice${numberIncr}" name="ApprovedPrice${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
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
    refreshProductDropdowns(".FabricType");
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
        refreshProductDropdowns(".FabricType");
    }
}

function duplicateRowProcess() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.ProcessListRow').length

    var ProcessSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (ProcessDropdown != null && ProcessDropdown.length > 0 && ProcessDropdown[0].length > 0) {
        ProcessSelectOptions = ProcessDropdown[0].map(function (ProcessTypeId) {
            return `<option value="${ProcessTypeId.ProcessTypeId}">${ProcessTypeId.ProcessTypeName}</option>`;
        }).join('');
    }

    var htmlRow = `
    <div class="row ProcessListRow">
        <label class="ProcessTypeMappingId d-none"></label>
        <div class="col-md-5 col-lg-5 col-sm-5 col-5 ProcessTypeDiv">
            <div class="form-group">
                <label class="ProcessTypeIdClass">Process Type<span id="Asterisk">*</span></label>
                <select class="form-control ProcessTypeId" id="ProcessTypeId${numberIncr}" name="ProcessTypeId${numberIncr}" required>
                    ${defaultOption}${ProcessSelectOptions}
                </select>
            </div>
        </div>
        <div class="col-md-3 col-lg-3 col-sm-3 col-3 pl-0 pr-0 ProposedPriceClassProcessDiv">
            <div class="form-group">
                <label class="ProposedPriceProcess">Proposed (₹)<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ProcessProposedPrice" placeholder="Ex: 12000/-" id="ProcessProposedPrice${numberIncr}" name="ProcessProposedPrice${numberIncr}" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
            </div>
        </div>
        <div class="col-md-3 col-lg-3 col-sm-3 col-3 ApprovedPriceProcessDiv">
            <div class="form-group">
                <label class="ApprovedPriceProcess">Approved (₹)<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ProcessApprovedPrice" placeholder="Ex: 10000/-" id="ProcessApprovedPrice${numberIncr}" name="ProcessApprovedPrice${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)" required/>
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
    refreshProductProcessTypedowns(".ProcessTypeId");
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
        refreshProductProcessTypedowns(".ProcessTypeId");
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

//==============================================Attachment============================================//

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Quotation",
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
            ModuleName: "Quotation",
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

function ajaxPromise(method, url, data) {
    return new Promise((resolve, reject) => {
        Common.ajaxCall(method, url, data, resolve, reject);
    });
}