var SampleId = 0;
var ProductDropdown = [];

$(document).ready(async function () {
   
    Common.bindDropDownParent('Client', 'FormSample', 'Client');
    Common.bindDropDownParent('SampleTypeId', 'FormSample', 'SampleType');
    Common.bindDropDownParent('FabricTypeId', 'FormSample', 'FabricType');
    Common.bindDropDownParent('HandledById', 'FormSample', 'SampleReceivedBy');
    Common.bindDropDownParent('SampleStatusId', 'FormSample', 'SampleStatus');
    Common.bindDropDownParent('FinishedTypeId', 'FormRecipeParameter', 'FinishType');
    Common.bindDropDownParent('HandFeelAppearance', 'FormTestingResults', 'HandFeel');
    Common.bindDropDownParent('ShadeMatching', 'FormTestingResults', 'ShadeMatching');
    Common.bindDropDownParent('SampleRecivedById', 'FormSample', 'SampleReceivedBy');
    Common.bindDropDownMulti('ProcessTypeId', 'ProcessType');

    var productDropdown = await Common.bindDropDownSync('SampleChemical');
    ProductDropdown = JSON.parse(productDropdown);

    $('#ProcessTypeId').select2({
        dropdownParent: $('#FormSample'),
        width: '100%',
        placeholder: '--Select ProcessType--'
    }).on('select2:open', function () {
        $('.select2-container').css('z-index', 1100);
    }).trigger('change');

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
        Common.ajaxCall("GET", "/Productions/GetSample", { PlantId: parseInt(PlantMappingId), SampleId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetSampleSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetSample", { PlantId: parseInt(PlantMappingId), SampleId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetSampleSuccess, null);
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
            Common.ajaxCall("GET", "/Productions/GetSample", { PlantId: parseInt(PlantMappingId), SampleId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetSampleSuccess, null);
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
        Common.ajaxCall("GET", "/Productions/GetSample", { PlantId: parseInt(PlantMappingId), SampleId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetSampleSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetSample", { PlantId: parseInt(PlantMappingId), SampleId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetSampleSuccess, null);

    $(document).on('click', '#AddSample', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#SampleCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#SampleCanvas").css("width", "50%");
        } else {
            $("#SampleCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $("#FormSample")[0].reset();
        $('#SampleHeader').text('Sample Details');

        $('#SampleTypeId').val('1');

        $('#HandledByIdDiv').hide();
        $('#SampleStatusIdDiv').hide();
        $('#BuyerCommentsIdDiv').hide();

        $('#AccordionHide1').hide();
        $('#AccordionHide2').hide();
        $('#AccordionHide3').hide();

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);
        $('#SampleDate').val(formattedDate);

        $('#FormOutputLabOptionInfo').empty();
        DynamicForOutputLabOption();

        $('#ChemicalListRow').empty();
        duplicateRowChemical();
        $('#SaveSample').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        $('#RemarksDiv').removeClass('col-md-6 col-lg-6 col-sm-6 col-6').addClass('col-md-12 col-lg-12 col-sm-12 col-6');
        CanvasOpenFirstShowingProduction();
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#SampleCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#SampleCanvas").css("width", "50%");
        } else {
            $("#SampleCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#SampleHeader').text('Edit Sample Details');
         
        $('#HandledByIdDiv').show();
        $('#SampleStatusIdDiv').show();
        $('#BuyerCommentsIdDiv').show();

        $('#AccordionHide1').show();
        $('#AccordionHide2').show();
        $('#AccordionHide3').show();

        $('#FormOutputLabOptionInfo').empty();
        DynamicForOutputLabOption();

        $('#ChemicalListRow').empty();
        duplicateRowChemical();
        $('#SaveSample').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
        $('#RemarksDiv').removeClass('col-md-12 col-lg-12 col-sm-12 col-6').addClass('col-md-6 col-lg-6 col-sm-6 col-6');
        CanvasOpenFirstShowingProduction();
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#SampleCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });

    $(document).on('change', '#SaleOrderNoId', function () {
        var $thisVal = $(this).val();
        if ($thisVal != '') {
            $('#CustomerId').val('109');
            $('#FabricType').val('2');
            $('#ProcessType').val('3');
            $('#GSM').val('250 GSM');
            $('#Weight').val('45 KG');
            $('#Color').val('Purple');
        } else {
            $('#CustomerId, #FabricType, #ProcessType, #GSM, #Weight, #Color').val('');
        }
    });
});

function GetSampleSuccess(response) {
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
        var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="SampleTable">
                </table>
            `;
        $('#MainGrid').append(html);

        var columns = Common.bindColumn(data[1], ['SampleId', 'Status_Color']);
        Common.bindTable('SampleTable', data[1], columns, -1, 'SampleId', '360px', true, access);
    }
}

function CanvasOpenFirstShowingProduction() {
    $('#SampleCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2').collapse('hide');
    $('#collapse3').collapse('hide');
    $('#SampleCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#SampleCanvas').offset().top
    }, 'fast');
}

function duplicateRowChemical() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfChemical').length;

    var ProductSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (ProductDropdown != null && ProductDropdown.length > 0 && ProductDropdown[0].length > 0) {
        ProductSelectOptions = ProductDropdown[0].map(function (ProductId) {
            return `<option value="${ProductId.ProductId}">${ProductId.ProductName}</option>`;
        }).join('');
    }

    if (rowadd < 3) {
        var htmlRow = `
            <div class="row RowOfChemical">
                <div class="col-md-4 col-lg-5 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                        <select class="form-control ProductId" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required> 
                            ${defaultOption}${ProductSelectOptions}
                        </select>
                    </div>
                </div>
                <div class="col-md-4 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="GPLClass">GPL%<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" />
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6 pr-2">
                    <div class="form-group">
                        <label class="QtyClass">Qty<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control" placeholder="Ex: 0" id="Qty${numberIncr}" name="Qty${numberIncr}" />
                    </div>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                    <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                        <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemove mt-0" type="button" onclick="removeRowRowChemical(this)"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
           `;
    }
    $('#ChemicalListRow').append(htmlRow); 
    updateRemoveButtonsRowChemical();
}
 
function updateRemoveButtonsRowChemical() {
    var rows = $('.RowOfChemical');

    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow');
        var labels = $(this).find('.ProductClass, .GPLClass, .QtyClass');

        if (index === 0) {
            labels.show();
            removeButtonDiv.hide();
        } else {
            labels.hide();
            removeButtonDiv.show();
        }
    });
}

function removeRowRowChemical(button) {
    var totalRows = $('.RowOfChemical').length;
    if (totalRows > 1) {
        $(button).closest('.RowOfChemical').remove();
        updateRemoveButtonsRowChemical();
    }
}

function DynamicForOutputLabOption() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.OutputLabOptionInfo').length;

    var htmlLab = `
    <div class="row OutputLabOptionInfo">
        <div class="col-md-3 col-lg-3 col-sm-6 col-6">
            <div class="form-group">
                <label>Lab Option<span id="Asterisk">*</span></label>
                <input type="text" class="form-control" placeholder="Ex: 1" id="LabOption${numberIncr}" name="LabOption${numberIncr}" required/>
            </div>
        </div>
        <div class="col-md-3 col-lg-3 col-sm-6 col-6 pl-0">
            <div class="form-group">
                <label>Recipe<span id="Asterisk">*</span></label>
                <input type="text" class="form-control" placeholder="Ex: Recipe" id="Recipe${numberIncr}" name="Recipe${numberIncr}" required style="background: #ffffff;" />
            </div>
        </div>
        <div class="col-md-5 col-lg-5 col-sm-6 col-6 pl-0">
            <div class=" border border-radius" style="background-color:#F1F0EF; max-height:10.5rem;height: 56px;">
                <label class=" d-flex justify-content-center align-content-center mt-1" style="text-decoration:underline; color:#7D7C7C;">
                    <b>Click Here to Attach your files</b>
                    <input type="file" id="fileInput" multiple="" class="custom-file-input">
                </label>
                <div class="file-preview d-flex justify-content-center" id="preview">
                    <div class="attachrow">
                        <div class="attachcolumn">
                            <ul class="row justify-content-center px-3 mb-2" id="selectedFiles"></ul>
                        </div>
                        <div class="attachcolumn"><ul class="row justify-content-center px-3 mb-2" id="ExistselectedFiles"></ul></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
            <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                <button id="RemoveButton" class="btn DynrowRemove mt-0" type="button" onclick="removeRowOutputLabOption(this)" style="margin-top:12px !important; margin-left: -15px;"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    </div>
    `;
    $('#FormOutputLabOptionInfo').append(htmlLab); 
}
  
function removeRowOutputLabOption(button) {
    var totalRows = $('.OutputLabOptionInfo').length;
    if (totalRows > 1) {
        $(button).closest('.OutputLabOptionInfo').remove(); 
    }
}
