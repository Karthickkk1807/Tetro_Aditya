var PlantMappingId = 0;
var OutWardId = 0;

$(document).ready(function () {

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    Common.bindDropDown('InwardNo', 'InwardNo');
    Common.bindDropDown('OutwardType', 'OutWardType');
    Common.bindDropDown('OutWardBy', 'SampleReceivedBy');

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
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#OutWardCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#OutWardCanvas").css("width", "50%");
        } else {
            $("#OutWardCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingOutWard(); 

        $('#FormProcessing').empty();
        duplicateFabric();

        $('#StatusDiv').hide();

        $('.OutwardNoBindLable').html('Name<span id="Asterisk">*</span>');

        $('#OutwardNoBind').empty().append($('<option>', { value: '', text: '--Select--', }));
        $('#TypeNo').text('Type No');
        $("#FormOutWard")[0].reset();
        $('#OutWardHeader').text('OutWard Details');
        $('#SaveOutWard').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        $('#PrintOutWard').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#OutWardCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#OutWardCanvas").css("width", "50%");
        } else {
            $("#OutWardCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingOutWard();

        $('.OutwardNoBindLable').html('Name<span id="Asterisk">*</span>');

        $('#FormProcessing').empty();
        duplicateFabric();

        $('#StatusDiv').show();

        $('#OutwardNo').empty().append($('<option>', { value: '', text: '--Select--', }));
        $('#OutWardHeader').text('Edit OutWard Details');
        $('#SaveOutWard').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
        $('#PrintOutWard').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#OutWardCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });

    $(document).on('change', '#OutwardType', function () {
        var $thisVal = $(this).val();
        if ($thisVal !== "") {
            var EditData = { OutwardType: parseInt($thisVal) }
            Common.ajaxCall("GET", "/Productions/GetOutWardTypeContactDetails", EditData,
                function (response) {
                    if (response.status) {
                        Common.bindDropDownSuccess(response.data, "OutwardNoBind");
                        $thisVal == "1" ? $('.OutwardNoBindLable').html('Client Name<span id="Asterisk">*</span>') : $('.OutwardNoBindLable').html('JobWorker Name<span id="Asterisk">*</span>'); 
                    }
                },
                null
            );
        }
        else {
            $('#OutwardNoBind').empty().append($('<option>', { value: '', text: '--Select--', }));
            $('.OutwardNoBindLable').html('Name<span id="Asterisk">*</span>');
        }
    });

    $(document).on('click', '#PrintOutWard', function () {
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
});

function CanvasOpenFirstShowingOutWard() {
    $('#OutWardCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#OutWardCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#OutWardCanvas').offset().top
    }, 'fast');
}
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
                    <label>OutWard Qty<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control" placeholder="Ex: 40" id="OutWardQuantity${numberIncr}" name="OutWardQuantity${numberIncr}" required oninput="Common.allowOnlyNumbersAndDecimalInventory(this)" />
                </div>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                <div class="form-group">
                    <label>No Of Roll<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control RollCount" placeholder="Ex: 100" id="RollCount${numberIncr}" name="RollCount${numberIncr}" required />
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

    var FabricTypeId = "FabricType" + numberIncr;
    Common.bindDropDown(FabricTypeId, 'FabricType');

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
