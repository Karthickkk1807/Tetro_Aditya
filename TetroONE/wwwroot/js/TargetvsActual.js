
var TargetId = 0;
var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
$(document).ready(function () {

    //let currentDate = new Date();
    //let currentMonth = currentDate.getMonth();
    //let currentYear = currentDate.getFullYear();

    //let displayedDate = new Date(currentYear, currentMonth);
    //updateMonthDisplay(displayedDate);
    //$('#increment-month-btn2').show();

    //$('#decrement-month-btn2').click(function () {
    //    displayedDate.setMonth(displayedDate.getMonth() - 1);
    //    updateMonthDisplay(displayedDate);
    //    $('#increment-month-btn2').show();

    //    var fnData = Common.getDateFilter('dateDisplay2');
    //    Common.ajaxCall("GET", "/Productions/GetTarget", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), TargetId: null }, TargetSuccess, null);
    //});

    //$('#increment-month-btn2').click(function () {
    //    displayedDate.setMonth(displayedDate.getMonth() + 1);
    //    updateMonthDisplay(displayedDate);

    //    if (displayedDate.getFullYear() > currentYear || (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() > currentMonth)) {
    //        $('#increment-month-btn2').hide();
    //    }

    //    var fnData = Common.getDateFilter('dateDisplay2');
    //    Common.ajaxCall("GET", "/Productions/GetTarget", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), TargetId: null }, TargetSuccess, null);
    //});

    //function updateMonthDisplay(date) {
    //    let monthNames = [
    //        "January", "February", "March", "April", "May", "June",
    //        "July", "August", "September", "October", "November", "December"
    //    ];
    //    let month = monthNames[date.getMonth()];
    //    let year = date.getFullYear();
    //    $('#dateDisplay2').text(month + " " + year);
    //}
    //var today = new Date().toISOString().split('T')[0];
    //$('#FromDate, #ToDate').attr('max', today);
    //$(document).on('change', '#FromDate,#ToDate', function () {
    //    var fromDate = $('#FromDate').val();
    //    $('#ToDate').attr('min', fromDate);
    //    if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
    //        Common.ajaxCall("GET", "/Productions/GetTarget", { FranchiseId: FranchiseMappingId, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), TargetId: null }, TargetSuccess, null);
    //    }
    //});



    //var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    //var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    Common.ajaxCall("GET", "/Productions/GetTarget", { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, TargetId: null }, TargetSuccess, null);


    Common.bindDropDownParent('FranchiseId', 'FormTarget', 'Franchise');
    Common.bindDropDownParent('Months', 'FormTarget', 'Month');
    Common.bindDropDownParent('NoOfDays', 'FormTarget', 'NoOfDays');

});

function TargetSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        var columns = Common.bindColumn(data[0], ['TargetId']);
        Common.bindTableForNoStatus('TargetTable', data[0], columns, -1, 'TargetId', '330px', true, access);
    }
}

$(document).on('click', '#AddTargetvsActual', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#TargetvsActual").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#TargetvsActual").css("width", "50%");
    } else {
        $("#TargetvsActual").css("width", "19%");
    }

    $('#EditContainer').hide();
    let div1 = $("#FranchiseIdDiv");
    let div2 = $("#MonthsDiv");
    let div3 = $("#TargetQtyDiv");
    let div4 = $("#NoOfDaysDiv");

    div1.removeClass("col-md-6 col-lg-6 col-sm-6 col-6")
        .addClass("col-md-12 col-lg-12 col-sm-12 col-12");
    div2.removeClass("col-md-6 col-lg-6 col-sm-6 col-6")
        .addClass("col-md-12 col-lg-12 col-sm-12 col-12");
    div3.removeClass("col-md-6 col-lg-6 col-sm-6 col-6")
        .addClass("col-md-12 col-lg-12 col-sm-12 col-12");
    div4.removeClass("col-md-6 col-lg-6 col-sm-6 col-6")
        .addClass("col-md-12 col-lg-12 col-sm-12 col-12");
    vendorId = 0;
    $("#TargetvsActualHeader").text('Target vs Actual');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#FormTarget")[0].reset();

    Common.removeMessage('FormTarget');
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    $('#FranchiseId').val(FranchiseMappingId).trigger('change');
    $('#SaveTargetvsActual').text('Save').addClass('btn-success').removeClass('btn-update');

    $('#loader-pms').hide();


    $('#TargetvsActual.collapse').removeClass('show');

});

$(document).on('click', '#SaveTargetvsActual', function (e) {

    if ($("#FormTarget").valid()) {
        $('#loader-pms').show();
        var objvalue = {};
        objvalue.TargetId = TargetId == 0 ? null : TargetId;
        objvalue.FranchiseId = parseInt($('#FranchiseId').val());
        objvalue.TargetMonth = $("#Months option:selected").text() || null;
        objvalue.NoOfDays = parseInt($('#NoOfDays').val());
        objvalue.TargetCount = parseInt($('#TargetQty').val());


        Common.ajaxCall("POST", "/Productions/InsertUpdateTarget", JSON.stringify(objvalue), TargetInsertUpdateSuccess, null);
    } else {

    }

});


function TargetInsertUpdateSuccess(response) {
    if (response.status) {

        Common.successMsg(response.message);
        $("#TargetvsActual").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        $('#loader-pms').hide();
        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetTarget", { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, TargetId: null }, TargetSuccess, null);
    }
    else {
        $('#loader-pms').hide();
        Common.errorMsg(response.message);
    }
}



$(document).on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#TargetvsActual").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#TargetvsActual").css("width", "50%");
    } else {
        $("#TargetvsActual").css("width", "39%");
    }

    Common.removeMessage('FormTarget');
    $('#EditContainer').show();

    let div1 = $("#FranchiseIdDiv");
    let div2 = $("#MonthsDiv");
    let div3 = $("#TargetQtyDiv");
    let div4 = $("#NoOfDaysDiv");

    div1.removeClass("col-md-12 col-lg-12 col-sm-12 col-12")
        .addClass("col-md-6 col-lg-6 col-sm-6 col-6");
    div2.removeClass("col-md-12 col-lg-12 col-sm-12 col-12")
        .addClass("col-md-6 col-lg-6 col-sm-6 col-6");
    div3.removeClass("col-md-12 col-lg-12 col-sm-12 col-12")
        .addClass("col-md-6 col-lg-6 col-sm-6 col-6");
    div4.removeClass("col-md-12 col-lg-12 col-sm-12 col-12")
        .addClass("col-md-6 col-lg-6 col-sm-6 col-6");

    $('#fadeinpage').addClass('fadeoverlay');
    $("#TargetvsActualHeader").text('Target vs Actual');
    $('#SaveTargetvsActual').text('Update').addClass('btn-update').removeClass('btn-success');


    TargetId = $(this).data('id');
    
    Common.ajaxCall("GET", "/Productions/GetTarget", { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, TargetId: TargetId }, editSuccess, null);


    $('#TargetvsActual.collapse').removeClass('show');

});

$(document).on('click', '#TargetTable .btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var TargetId = $(this).data('id');
        Common.ajaxCall("GET", "/Productions/DeleteTargetDetails", { TargetId: TargetId }, TargetInsertUpdateSuccess, null);
    }
});

function editSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        
        $('#FranchiseId').val(data[0][0].FranchiseId).trigger('change');
        let targetMonth = data[0][0].TargetMonth; 

        $("#Months option").each(function () {
            if ($(this).text().trim() === targetMonth) {
                $(this).prop("selected", true);
                return false; 
            }
        });

        $('#NoOfDays').val(data[0][0].NoOfDays).trigger('change');
        $('#TargetQty').val(data[0][0].TargetCount);

        $('#CompletedDays').val(data[0][0].CompletedDays);
        $('#CompletedQty').val(data[0][0].CompletedQty);
        $('#CompletedPercentage').val(data[0][0].CompletedPercentage);
        $('#RemainingDays').val(data[0][0].RemainingDays);
        $('#RemainingQty').val(data[0][0].RemainingQty);
        $('#RemainingPercentage').val(data[0][0].RemainingPercentage);
        bindProductionTable(data[1]);
        $('#loader-pms').hide()
    }
}
function bindProductionTable(data) {
    let $table = $("#productionTable");
    $table.empty();

    if (!data || data.length === 0) {
        return;
    }

    let keys = Object.keys(data[0]);

    // 👉 Remove unwanted column
    keys = keys.filter(x => x !== "TetroONEnocount");

    // Build table header always
    let thead = `<thead style="background-color: #E3C8F3;"><tr>`;
    keys.forEach(key => {
        thead += `<th>${key}</th>`;
    });
    thead += `</tr></thead>`;

    let tbody = "<tbody>";

    // Check if ALL rows have ALL null values
    let allNull = data.every(row => {
        return keys.every(k => row[k] === null);
    });

    if (allNull) {
        tbody += `<tr><td colspan="${keys.length}" style="text-align:center;">
            <div><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>
        </td></tr>`;
    } else {
        data.forEach(row => {
            tbody += "<tr>";
            keys.forEach(key => {
                tbody += `<td>${row[key] !== null ? row[key] : ""}</td>`;
            });
            tbody += "</tr>";
        });
    }

    tbody += "</tbody>";
    $table.append(thead + tbody);
}



$(document).on('click', '#CloseCanvas', function () {
    $("#TargetvsActual").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});

