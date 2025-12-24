var QuotationId = 0;
var PlantMappingId = 0;
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
        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);
        $('#QuotationDate').val(formattedDate);

        QuotationId = 0;

        duplicateRowProcess();
        duplicateRowColor();
        CanvasOpenFirstShowingQuotation();

        Common.ajaxCall("GET", "/Common/GetAutoGenerate", { ModuleName: 'Quotation', PlantId: PlantMappingId }, function (response) {
            Common.AutoGenerateNumberGet(response, "QuotationNo", "QuotationNo");
        });

        $('#SaveQuotation').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        $('#PrintQuotation').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
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

        Common.removevalidation('FormQuotation');
        $('#CreatedByDiv').show(); 
        CanvasOpenFirstShowingQuotation();
        $('#SaveQuotation').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
        $('#PrintQuotation').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Sale/GetQuotation", { PlantId: parseInt(PlantMappingId), QuotationId: QuotationId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, QuotationNotNullSuccess, null);
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#QuotationCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('click', '#SaveQuotation', async function () {
        var IsValidOfProduct1 = $("#FormQuotation").valid();

        if (!IsValidOfProduct1) {
            return false;
        }
        var DataQuotation = JSON.parse(JSON.stringify(jQuery('#FormQuotation').serializeArray()));

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

        var ColorDetails = [];
        var ClosestDiv = $('.DynamicColorList .ColorListRow');
        $.each(ClosestDiv, function (index, values) {
            var QuotationColorMappingId = $(values).find('.ColorListMappingId').text();
            var FabricId = $(values).find('.FabricType').val();
            var ColorId = $(values).find('.Color').val();
            var ProposedPrice = $(values).find('.ProposedPrice').val() || null;
            var ApprovedPrice = $(values).find('.ApprovedPrice').val() || null;
            ColorDetails.push({
                QuotationColorMappingId: parseInt(QuotationColorMappingId) || null,
                QuotationId: parseInt(QuotationId) || null,
                FabricId: parseInt(FabricId) || null,
                ColorId: parseInt(ColorId) || null,
                ProposedPrice: parseFloat(ProposedPrice) || null,
                ApprovedPrice: parseFloat(ApprovedPrice) || null,
            });
        });

        objvalue.QuotationColorMappingDetails = ColorDetails;

        var QuotationProcessTypeDetails = [];
        var ClosestDiv = $('.DynamicProcessList .ProcessListRow');
        $.each(ClosestDiv, function (index, values) {
            var QuotationProcessTypeMappingId = $(values).find('.ProcessTypeMappingId').text();
            var ProcessTypeId = $(values).find('.ProcessTypeId').val();
            var ProposedPrice = $(values).find('.ProcessProposedPrice').val() || null;
            var ApprovedPrice = $(values).find('.ProcessApprovedPrice').val() || null;
            QuotationProcessTypeDetails.push({
                QuotationProcessTypeMappingId: parseInt(QuotationProcessTypeMappingId) || null,
                ProcessTypeId: parseInt(ProcessTypeId) || null,
                ProposedPrice: parseFloat(ProposedPrice) || null,
                ApprovedPrice: parseFloat(ApprovedPrice) || null,
                QuotationId: parseInt(QuotationId) || null
            });
        });

        objvalue.QuotationColorMappingDetails = ColorDetails;
        objvalue.QuotationProcessTypeMappingDetails = QuotationProcessTypeDetails;

        $('#loader-pms').hide();
        try {
            await Common.ajaxCall("POST", "/Sale/InsertUpdateQuotationDetails", JSON.stringify(objvalue), QuotationInsertUpdateSuccess, null);
        } catch (error) {
            console.error("Error Saving Quotation:", error);
        }
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
        var EditData = { NoOfCopies: 1, printType: "preview" }

        $.ajax({
            url: '/Sale/QuotationPrint',
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
                                              <head><title>Quotation Preview</title></head>
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
                    link.download = 'Quotation.pdf';
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

function QuotationNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);

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
                            <label class="ProposedPriceClass">Proposed Price<span id="Asterisk">*</span></label>
                            <input type="text" class="form-control ProposedPrice" placeholder="Ex: 12000/-" id="ProposedPrice${numberIncr}" name="ProposedPrice${numberIncr}" required value="${ProposedPrice}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
                        </div>                                                                                                                                                
                    </div>                                                                                                                                                    
                    <div class="col-md-3 col-lg-3 col-sm-3 col-3 pl-3 ApprovedPriceClassDiv">                                                                                 
                        <div class="form-group">                                                                                                                              
                            <label class="ApprovedPriceClass">Approved Price</label>                                                              
                            <input type="text" class="form-control ApprovedPrice" placeholder="Ex: 10000/-" id="ApprovedPrice${numberIncr}" name="ApprovedPrice${numberIncr}" value="${ApprovedPrice || ProposedPrice}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
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
                            <label class="ProposedPriceProcess">Proposed Price<span id="Asterisk">*</span></label>
                            <input type="text" class="form-control ProcessProposedPrice" placeholder="Ex: 12000/-" id="ProcessProposedPrice${numberIncr}" name="ProcessProposedPrice${numberIncr}" required value="${ProposedPrice}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
                        </div>
                    </div>
                    <div class="col-md-3 col-lg-3 col-sm-3 col-3 ApprovedPriceProcessDiv">
                        <div class="form-group">
                            <label class="ApprovedPriceProcess">Approved Price</label>
                            <input type="text" class="form-control ProcessApprovedPrice" placeholder="Ex: 10000/-" id="ProcessApprovedPrice${numberIncr}" name="ProcessApprovedPrice${numberIncr}" value="${ApprovedPrice || ProposedPrice}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
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
                <label class="ProposedPriceClass">Proposed Price<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ProposedPrice" placeholder="Ex: 12000/-" id="ProposedPrice${numberIncr}" name="ProposedPrice${numberIncr}" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
            </div>                                                                                                                                                
        </div>                                                                                                                                                    
        <div class="col-md-3 col-lg-3 col-sm-3 col-3 pl-3 ApprovedPriceClassDiv">                                                                                 
            <div class="form-group">                                                                                                                              
                <label class="ApprovedPriceClass">Approved Price</label>                                                              
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
                <label class="ProposedPriceProcess">Proposed Price<span id="Asterisk">*</span></label>
                <input type="text" class="form-control ProcessProposedPrice" placeholder="Ex: 12000/-" id="ProcessProposedPrice${numberIncr}" name="ProcessProposedPrice${numberIncr}" required oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
            </div>
        </div>
        <div class="col-md-3 col-lg-3 col-sm-3 col-3 ApprovedPriceProcessDiv">
            <div class="form-group">
                <label class="ApprovedPriceProcess">Approved Price</label>
                <input type="text" class="form-control ProcessApprovedPrice" placeholder="Ex: 10000/-" id="ProcessApprovedPrice${numberIncr}" name="ProcessApprovedPrice${numberIncr}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 3)"/>
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