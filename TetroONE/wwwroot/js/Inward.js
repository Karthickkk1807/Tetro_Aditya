var PlantMappingId = 0;
var InwardId = 0;

$(document).ready(function () {

    Common.bindDropDown('ClientId', 'Client');
    Common.bindDropDown('TransactionId', 'TransactionType');
    Common.bindDropDown('ReceivedBy', 'SampleReceivedBy');

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
        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);
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
            Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetInwardSuccess, null);
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
        Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetInward", { PlantId: parseInt(PlantMappingId), QuotationId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetInwardSuccess, null);

    $(document).on('click', '#AddInWard', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#InWardCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#InWardCanvas").css("width", "50%");
        } else {
            $("#InWardCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder();
        $('#TransactionNo').empty().append($('<option>', { value: '', text: '--Select--', }));

        $('#InWardStatusDiv').hide(); 

        $('#FormProcessing').empty();
        duplicateFabric();

        $("#FormInWard")[0].reset();
        $('#InWardHeader').text('InWard Details');
        $('#SaveInWard').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        duplicateFabricRow();
    });
    $(document).on('click', '.AddStockBtn', function () {
       
        duplicateFabricRow();
    });
    $(document).on('click', '.DynrowRemove', function () {
       
        removeFabricRow(this);
    });



    function duplicateFabricRow() {     
        let numberIncr = Math.random().toString(36).substring(2);
        let rowCount = $('.FabricEntry').length;
        let labelNo = rowCount + 1;

        let html = `
    <div class="FabricEntry p-1 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="DynamicLabel fw-bold">Fabric ${labelNo}</label>
            <button type="button" class="btn DynrowRemove">
                <i class="fas fa-trash-alt"></i>
            </button>   
        </div>

       <div class="row">
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Fabric Type<span id="Asterisk">*</span></label>
                    <select class="form-control FabricType" id="FabricType${numberIncr}" required onchange="onFabricTypeChange(this)">
                        <option value="">--Select--</option>
                        <option value="1">Woven</option>
                        <option value="2">Knitted</option>
                        <option value="3">Terry</option>
                    </select>
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Dia<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control Dia" id="Dia${numberIncr}" placeholder="Ex: 30 KG" required disabled/>
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>GSM<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control GSM" id="GSM${numberIncr}" placeholder="Ex: 200 GSM" required disabled/>
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Quantity Received<span id="Asterisk">*</span></label>
                    <div class="input-group" style="flex-wrap: nowrap;">
                        <input type="text" class="form-control QuantityReceived" id="QuantityReceived${numberIncr}" placeholder="Ex: 40 M" required/>
                        <select class="form-control QuantityReceivedUnitId" id="QuantityReceivedUnitId${numberIncr}" required style="width: 38%;">
                            <option value="">--Select--</option>
                            <option value="1">Meter</option>
                            <option value="2">Kg</option>
                            <option value="3">Roll</option>
                            <option value="4">MMeter</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>No Of Rolls<span id="Asterisk">*</span></label>
                    <input type="number" class="form-control RollCount" id="RollCount${numberIncr}" placeholder="Ex: 100" required/>
                </div>
            </div>

            <div class="col-md-12 col-lg-12 col-sm-6 col-6">
                <div class="form-group">
                    <label>Remarks</label>
                    <textarea class="form-control Remarks" id="Remarks${numberIncr}" rows="1" placeholder="Ex: Queries"></textarea>
                </div>
            </div>
     </div>
    </div>`;

        $('#FormProcessing').append(html);
        updateFabricLabels();
        updateFabricRemoveButtons();
    }

    function removeFabricRow(button) {
        var total = $('.FabricEntry').length;
        if (total > 1) {
            $(button).closest('.FabricEntry').remove();
            updateFabricLabels();
            updateFabricRemoveButtons();
        }
    }

    function updateFabricLabels() {
        $('.FabricEntry').each(function (i) {
            $(this).find('.DynamicLabel').text('Fabric ' + (i + 1));
        });
    }

    function updateFabricRemoveButtons() {
        let rows = $('.FabricEntry');
        rows.each(function () {
            let removeBtn = $(this).find('.DynrowRemove');
            if (rows.length === 1) removeBtn.hide();
            else removeBtn.show();
        });
    }


    function onFabricTypeChange(selectElem) {
        const parent = $(selectElem).closest('.FabricEntry');
        parent.find('.Dia, .GSM').prop('disabled', false);
    }





    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#InWardCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#InWardCanvas").css("width", "50%");
        } else {
            $("#InWardCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder();
        $('#InWardHeader').text('Edit InWard Details');
        $('#TransactionNo').empty().append($('<option>', { value: '', text: '--Select--', }));

        $('#FormProcessing').empty();
        duplicateFabric();

        $('#InWardStatusDiv').show(); 

        $('#SaveInWard').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#InWardCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('change', '#TransactionId', function () {
        var $thisVal = $(this).val();
        if ($thisVal != '' || $thisVal != null) {
            var EditData = {
                PlantId: parseInt(PlantMappingId), Transactiontype: parseInt($thisVal)
            }
            Common.ajaxCall("GET", "/Productions/GetTransactionTypeNoDetails", EditData,
                function (response) {
                    if (response.status) {
                        Common.bindDropDownSuccess(response.data, "TransactionNo");
                    }
                },
                null
            );
        }
        else {
            $('#TransactionNo').empty().append($('<option>', { value: '', text: '--Select--', }));
        }
    });
     
    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });

});

function CanvasOpenFirstShowingJobOrder() {
    $('#InWardCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#InWardCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#InWardCanvas').offset().top
    }, 'fast');
}

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

function duplicateFabric() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.DynamicRowProcessing').length;
    var DynamicLableNo = rowadd + 1;

    var htmlRow = `
        <div class="row DynamicRowProcessing">
            <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                <label class="DynamicLable">Fabric Details ${DynamicLableNo}</label>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Fabric<span id="Asterisk">*</span></label>
                    <select class="form-control FabricType" id="FabricType${numberIncr}" name="FabricType${numberIncr}" required> 
                    </select>
                </div>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                <div class="form-group">
                    <label>Width<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control Width" placeholder="Ex: 30" id="Width${numberIncr}" name="Width${numberIncr}" required oninput="Common.allowOnlyNumbersAndDecimalInventory(this)" />
                </div>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                <div class="form-group">
                    <label>GSM<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control GSM" placeholder="Ex: 200" id="GSM${numberIncr}" name="GSM${numberIncr}" required />
                </div>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                <div class="form-group">
                    <label>Received Qty<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control" placeholder="Ex: 40" id="QuantityReceived${numberIncr}" name="QuantityReceived${numberIncr}" required oninput="Common.allowOnlyNumbersAndDecimalInventory(this)" />
                </div>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                <div class="form-group">
                    <label>No Of Roll<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control RollCount" placeholder="Ex: 100" id="RollCount${numberIncr}" name="RollCount${numberIncr}" required />
                </div>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                <div class="form-group">
                    <label>Storage Location<span id="Asterisk">*</span></label>
                    <select class="form-control StorageLocationId" id="StorageLocationId${numberIncr}" name="StorageLocationId${numberIncr}" required>
                    </select>
                </div>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                <div class="form-group">
                    <label>Lab Option</label>
                    <input type="text" class="form-control LabOption" placeholder="Ex: 12" id="LabOption${numberIncr}" name="LabOption${numberIncr}" maxlength="50" />
                </div>
            </div>
            <div class="col-md-12 col-lg-12 col-sm-12 col-12">
                <div class="form-group">
                    <label>Process Involved</label>
                    <select class="form-control ProcessTypeId" id="ProcessTypeId${numberIncr}" name="ProcessTypeId${numberIncr}" multiple>
                    </select>
                </div>
            </div>
            <div class="col-md-9 col-lg-9 col-sm-6 col-6">
                <div class="form-group">
                    <label>Remarks</label>
                    <textarea class="form-control Remarks" id="Remarks${numberIncr}" name="Remarks${numberIncr}" rows="1" oninput="Common.allowAllCharacters(this,250)" placeholder="Ex: Querys"></textarea>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-3 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                    <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;
    $('#FormProcessing').append(htmlRow);

    $('.ProcessTypeId').select2({
        dropdownParent: $('#FormProcessing'),
        width: '100%',
        placeholder: '--Select ProcessType--'
    }).on('select2:open', function () {
        $('.select2-container').css('z-index', 1100);
    }).trigger('change');

    var ProcessTypeId = "ProcessTypeId" + numberIncr;
    var FabricTypeId = "FabricType" + numberIncr;
    var StorageLocationId = "StorageLocationId" + numberIncr;

    Common.bindDropDown(FabricTypeId, 'FabricType'); 
    Common.bindDropDown(StorageLocationId, 'StorageLocation'); 
    Common.bindDropDownMulti(ProcessTypeId, 'ProcessType');

    updateRemoveButtons();
}

function updateRowLabels() {
    $('.DynamicRowProcessing').each(function (index) {
        $(this).find('.DynamicLable').text('Fabric Details ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.DynamicRowProcessing');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow');
        if (rows.length == 1) {
            removeButtonDiv.css('display', 'none');
        } else {
            removeButtonDiv.css('display', 'block');
        }
    });
}

function removeRow(button) {
    var totalRows = $('.DynamicRowProcessing').length;
    if (totalRows > 1) {
        $(button).closest('.DynamicRowProcessing').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
}
