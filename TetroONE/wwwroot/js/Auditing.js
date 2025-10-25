let deskResults = {};
let currentDesk = "";
let html5QrCode;
let camerasList = [];
var formDataMultiple = new FormData();
let currentCameraIndex = 0;
var EditAuditId = 0;
$(document).ready(function () {

    BranchMappingId = parseInt(localStorage.getItem('BranchId'));

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);

    //Common.ajaxCall("GET", "/Inventory/GetAudit", { AuditId: null, FromDate: null, ToDate: null, BranchId: parseInt(BranchMappingId) }, GetAuditingSuccess, null);
    GetAuditingSuccess();

    $(document).on('change', '.customLengthDropdown', function () {
        var $this = $(this);
        var tableSelector = $this.data('table');
        var pageLength = parseInt($this.val());

        if ($.fn.DataTable.isDataTable(tableSelector)) {
            $(tableSelector).DataTable().page.len(pageLength).draw();
        }
    });


    Common.bindDropDownParent('BranchId', 'FormAudit', 'Plant');
   // Common.bindDropDownParent('StoreInchangeId', 'FormAudit', 'Incharge');

});


//function GetAuditingSuccess(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var CounterBox = Object.keys(data[0][0]);

//        //$("#CounterTextBox1").text(CounterBox[0]);
//        //$("#CounterTextBox2").text(CounterBox[1]);
//        //$("#CounterTextBox3").text(CounterBox[2]);
//        //$("#CounterTextBox4").text(CounterBox[3]);

//        //$('#CounterValBox1').text(data[0][0][CounterBox[0]]);
//        //$('#CounterValBox2').text(data[0][0][CounterBox[1]]);
//        //$('#CounterValBox3').text(data[0][0][CounterBox[2]]);
//        //$('#CounterValBox4').text(data[0][0][CounterBox[3]]);

//        var columns = Common.bindColumn(data[1], ['AuditId', 'Status_Color']);
//        Common.bindTable('Audittable', data[1], columns, -1, 'AuditId', '330px', true, access);
//        $('#loader-pms').hide();
//    }
//}

function GetAuditingSuccess() {
    // ✅ Hardcoded mock API response (matching your screenshot)
    const response = {
        status: true,
        data: JSON.stringify([
            [
                {
                    "This Month": 2,
                    "Total Completed": 1,
                    "Total InProgress": 1,
                    "Total Pending": 0
                }
            ],
            [
                {
                    "AuditId": 1001,
                    "Date": "15-10-2025",
                    "AuditNo": "IGS-AUD-0004",
                    "BranchName": "Ganapathy",
                    "HallName": "Hall-A",
                    "TotalDesk": 77,
                    "NoOfDesksAudited": 2,
                    "Status": "In-Progress",
                    "Status_Color": "#f5a623" // orange
                },
                {
                    "AuditId": 1002,
                    "Date": "11-10-2025",
                    "AuditNo": "IGS-AUD-0002",
                    "BranchName": "Chennai",
                    "HallName": "CHE-First Floor",
                    "TotalDesk": 1,
                    "NoOfDesksAudited": 1,
                    "Status": "Completed",
                    "Status_Color": "#28a745" // green
                }
            ]
        ])
    };

    // ✅ User access configuration
    const access = {
        update: true,
        delete: true
    };

    // ✅ Parse and bind
    if (response.status) {
        var data = JSON.parse(response.data);

        // ✅ Create/Bind Table
        $('#AuditTableContainer').empty();
        $('#AuditTableContainer').html(`
            <div class="table-responsive">
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="Audittable"></table>
            </div>
        `);

        // ✅ Define columns (matching your image)
        var columns = [
            { data: "Date", title: "Date" },
            { data: "AuditNo", title: "Audit No" },
            { data: "BranchName", title: "Branch Name" },
            { data: "HallName", title: "Hall Name" },
            { data: "TotalDesk", title: "Total Desk" },
            { data: "NoOfDesksAudited", title: "No Of Desks Audited" },
            { data: "Status", title: "Status" }
        ];

        // ✅ Bind table using your reusable function
        Common.bindTable('Audittable', data[1], columns, -1, 'AuditId', '330px', true, access);

        $('#loader-pms').hide();
    }
}



//$(document).on('click', '#AddAuditing', function () {
//    $('#loader-pms').show();
//    deskResults = {};
//    $('#FormAudit input, #FormAudit select').prop('disabled', false);
//    Common.ajaxCall("GET", "/Inventory/GetAutoGenerateNo", { ModuleName: "Auditing", BranchId: null }, function (response) {
//        if (response.status) {
//            var data = JSON.parse(response.data);
//            $('#AuditId').val('');
//            $('#AuditId').val(data[0][0].AuditingNo);
//            $('#AuditId').prop('disabled', true);
//            $('#NoOfDeskCount,#AuditedDeskCount').text(0);


//            var today = new Date();
//            var formattedDate = today.toISOString().split('T')[0];
//            $('#AuditingDate').val(formattedDate);

//            var BranchMappingId = parseInt(localStorage.getItem('BranchId'));
//            if (BranchMappingId != 0) {
//                $('#BranchId').val(BranchMappingId).trigger('change').prop('disabled', true);
//            } else {
//                $('#BranchId').val($('#BranchId option:eq(1)').val()).trigger('change').prop('disabled', false);
//            }
//            EditAuditId = 0;
//            $('#StoreInchangeId').val($('#StoreInchangeId option:eq(1)').val()).trigger('change').prop('disabled', true);

//            $("#FormAudit .row > div").show();
//            $("#deskContainer").empty();
//            $(".buttonAuditrow").hide();
//            $("#deskContainer").hide();
//            $("#tablenotnullContainer").hide();
//            $('#AuditingModalText').text('Add Auditing');
//            $('#Btnstart').show();
//            $('#AuditcompletedBtn').show();

//            $('#AuditingModal').show();

//        }

//        $('#loader-pms').hide();
//    }, function () {
//        $('#loader-pms').hide();

//    });
//});

$(document).on('click', '#AddAuditing', function () {
    $('#loader-pms').show();
    deskResults = {};
    $('#FormAudit input, #FormAudit select').prop('disabled', false);

    
    $('#AuditId').val('');
    $('#AuditId').val('AUD/2025-0001');
    $('#AuditId').prop('disabled', true);
    $('#NoOfDeskCount,#AuditedDeskCount').text(0);


    var today = new Date();
    var formattedDate = today.toISOString().split('T')[0];
    $('#AuditingDate').val(formattedDate);

    var BranchMappingId = parseInt(localStorage.getItem('BranchId'));
    if (BranchMappingId != 0) {
        // $('#BranchId').val(BranchMappingId).trigger('change').prop('disabled', true);
        $('#BranchId').val($('#BranchId option:eq(1)').val()).trigger('change').prop('disabled', false);
    } else {
        $('#BranchId').val($('#BranchId option:eq(1)').val()).trigger('change').prop('disabled', false);
    }
    EditAuditId = 0;
    $('#StoreInchangeId').val($('#StoreInchangeId option:eq(1)').val()).trigger('change').prop('disabled', true);

    $("#FormAudit .row > div").show();
    $("#deskContainer").empty();
    $(".buttonAuditrow").hide();
    $("#deskContainer").hide();
    $("#tablenotnullContainer").hide();
    $('#AuditingModalText').text('Add Auditing');
    $('#Btnstart').show();
    $('#AuditcompletedBtn').show();

    $('#AuditingModal').show();
    $('#loader-pms').hide();

});

//$(document).on('change', '#BranchId', function () {
//    var thisval = parseInt($(this).val());
//    if (thisval) {
//        $('#HallId').empty();
//        Common.bindDropDownNotNull(thisval, 'HallForAudit', 'HallId', 'FormAudit');
//    }
//    else {
//        $('#HallId').empty();
//        Common.bindDropDownNotNull(200, 'HallForAudit', 'HallId', 'FormAudit');
//    }
//});

$('#AuditingClose').click(function () {
    $('#AuditingModal').hide();
});



$(document).on('click', '#Btnstart', function () {

    let hallId = parseInt($('#HallId').val());
    let branchId = parseInt($('#BranchId').val());
    let date = $('#AuditingDate').val();
    //if (hallId && branchId) {
    //    $.ajax({
    //        url: "/Inventory/GetDeskName",
    //        type: "GET",
    //        data: { BranchId: branchId, FloorId: hallId, AuditDate: date },
    //        success: function (response) {
    //            renderDeskButtons(response);
    //        }
    //    });
    //} else {
    //    Common.warningMsg("Choose Branh & Hall");
    //}
    renderDeskButtons();
});




//function renderDeskButtons(response) {


//    $("#deskContainer").empty();
//    if (response.status) {

//        $("#deskContainer").show();

//        $("#AuditNodiv,#AuditingDatediv,#Branchdiv,#Buttondivstart").hide();
//        $("#Halldiv,#StoreInchangediv").show();

//        var data = JSON.parse(response.data);
//        if (!data || data.length === 0) {
//            $("#deskContainer").append("<p>No desks found for this hall.</p>");
//            return;
//        }

//        if (data[0].length === 1 && data[0][0].DeskId === null && data[0][0].AssetId === null) {
//            // Show "No desk available"
//            $("#deskContainer").append(`
//        <div class="text-center text-danger fw-bold p-2" style="font-size: 12px;">
//            No desk available
//        </div>
//    `);
//        } else {
//            // Build desk buttons
//            data[0].forEach(item => {
//                let btn = `
//            <button type="button" 
//                    class="btn btn-sm m-1 deskBtn"
//                    style="background-color:#e16262; border:1px solid #cc0000; color:#000;font-size: 10px;font-weight: 600;"
//                    data-assetid="${item.AssetId}"
//                    data-assetno="${item.AssetNo}"
//                    data-deskno="${item.DeskNo}"
//                    data-deskid="${item.DeskId}"
//                    data-assetname="${item.AssetName}">
//                ${item.DeskNo}
//            </button>
//        `;
//                $("#deskContainer").append(btn);
//            });
//            $("#NoOfDeskCount").text(data[0].length);
//        }
//    } else {
//        Common.warningMsg(response.message)
//        $("#deskContainer").hide();
//        $("#AuditNodiv,#AuditingDatediv,#Branchdiv,#Buttondivstart").show();
//    }

//}
function renderDeskButtons() {

    $("#deskContainer").empty();

    // Show container and hide unrelated divs
    $("#deskContainer").show();
    $("#AuditNodiv,#AuditingDatediv,#Branchdiv,#Buttondivstart").hide();
    $("#Halldiv,#StoreInchangediv").show();

    // Hardcoded department data
    var data = [
        { DeptId: 1, DeptName: "Production" },
        { DeptId: 2, DeptName: "Dyeing" },
        { DeptId: 3, DeptName: "Washing" },
        { DeptId: 4, DeptName: "Finishing" },
        { DeptId: 5, DeptName: "Quality Control" },
        { DeptId: 6, DeptName: "Maintenance" },
        { DeptId: 7, DeptName: "Packing" },
        { DeptId: 8, DeptName: "Stores" },
        { DeptId: 9, DeptName: "Lab & Testing" },
        { DeptId: 10, DeptName: "Admin" }
    ];

    // Build buttons for each department
    data.forEach(item => {
        let btn = `
            <button type="button" 
                    class="btn btn-sm m-1 deskBtn"
                    style="background-color:#e16262; border:1px solid #cc0000; color:#000;font-size: 10px;font-weight: 600;"
                    data-deptid="${item.DeptId}"
                    data-deptname="${item.DeptName}">
                ${item.DeptName}
            </button>
        `;
        $("#deskContainer").append(btn);
    });

    $("#NoOfDeskCount").text(data.length);
}


// ---------- Desk Button Click ----------
$(document).on("click", ".deskBtn", function () {
    currentDesk = $(this).data("deskno");
    let assetId = $(this).data("assetid") || "";
    let assetNo = $(this).data("assetno") || "";
    currentDeskId = $(this).data("deskid");


    let assets = assetNo ? assetNo.split(",") : [];
    let assetIds = assetId ? assetId.toString().split(",") : [];

    $("#assetList").empty();

    if (deskResults[currentDesk] && deskResults[currentDesk].length > 0) {

        deskResults[currentDesk].forEach(item => {
            let badgeClass =
                item.Status === "Matched" ? "bg-success" :
                    item.Status === "Missed" ? "bg-primary" :
                        item.Status === "Extra" ? "bg-danger" :
                            "bg-secondary";

            $("#assetList").append(`
                <div class="assetRow" 
                     data-assetid="${item.AssetId}" 
                     data-assetno="${item.AssetNo}">
                  ${item.AssetNo} : <span class="status badge ${badgeClass}">${item.Status}</span>
                </div>
            `);
        });
    } else {

        if (assets.length > 0) {
            assets.forEach((a, i) => {
                if (a && assetIds[i]) {
                    $("#assetList").append(`
                      <div class="assetRow" 
                           data-assetid="${assetIds[i]}" 
                           data-assetno="${a.trim()}">
                        ${a.trim()} : <span class="status badge bg-secondary">Pending</span>
                      </div>
                    `);
                }
            });
        }

        deskResults[currentDesk] = [];
    }

    $("#deskModal").show();


    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            camerasList = devices;


            let backCamera = devices.findIndex(d =>
                d.label.toLowerCase().includes("back") ||
                d.label.toLowerCase().includes("rear")
            );

            if (backCamera !== -1) {
                currentCameraIndex = backCamera;
            } else if (devices.length > 1) {
                currentCameraIndex = 1;
            } else {
                currentCameraIndex = 0;
            }

            startScanner(camerasList[currentCameraIndex].id);
        }
    }).catch(err => console.error("Camera error:", err));


    toggleOkButton();

});



let scanLine = document.getElementById("scan-line");
let resultSpan = document.getElementById("result");

function startScanner(cameraId) {
    if (html5QrCode._isScanning) {
        html5QrCode.stop().then(() => {
            runScanner(cameraId);
        });
    } else {
        runScanner(cameraId);
    }
}

function runScanner(cameraId) {
    html5QrCode.start(
        { deviceId: { exact: cameraId } },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        qrCodeMessage => { onQrScanned(qrCodeMessage); },
        errorMessage => { /* ignore */ }
    ).then(() => {

        let label = camerasList[currentCameraIndex].label.toLowerCase();
        if (label.includes("front") || label.includes("usb2.0 hd uvc webcam")) {
            $("#reader video").css("transform", "scaleX(-1)");
        } else {
            $("#reader video").css("transform", "scaleX(1)");
        }
    }).catch(err => console.error("Scanner start error:", err));
}



$(document).on("click", "#switchCamera", function () {
    if (camerasList.length > 1) {
        currentCameraIndex = (currentCameraIndex + 1) % camerasList.length;


        html5QrCode.stop().then(() => {
            startScanner(camerasList[currentCameraIndex].id);
        }).catch(err => console.error("Stop error:", err));
    }
});

function onQrScanned(scannedCode) {
    let matched = false;


    for (let desk in deskResults) {
        if (deskResults[desk].some(item => item.AssetNo === scannedCode && item.Status === "Matched")) {
            return;
        }
    }

    let deskAssets = $(".deskBtn[data-deskno='" + currentDesk + "']").data("assetno").split(",");
    if (deskAssets.includes(scannedCode)) {
        matched = true;


        let alreadyScanned = deskResults[currentDesk].some(
            x => x.AssetNo === scannedCode && x.Status === "Matched"
        );
        if (alreadyScanned) return;


        $("#assetList .assetRow").each(function () {
            if ($(this).data("assetno") === scannedCode) {
                $(this).find(".status")
                    .text("Matched")
                    .removeClass()
                    .addClass("status badge bg-success");
            }
        });


        deskResults[currentDesk].push({
            DeskId: currentDeskId,
            AssetId: deskAssets.indexOf(scannedCode) !== -1 ? $(".assetRow[data-assetno='" + scannedCode + "']").data("assetid") : 0,
            AssetNo: scannedCode,
            Status: "Matched"
        });
        toggleOkButton();
        return;
    }


    let alreadyExtra = deskResults[currentDesk].some(
        x => x.AssetNo === scannedCode && x.Status === "Extra"
    );
    if (alreadyExtra) return;

    $("#assetList").append(`
      <div class="assetRow" data-assetid="0" data-assetno="${scannedCode}">
        ${scannedCode} : <span class="status badge bg-danger">Extra</span>
      </div>
    `);

    deskResults[currentDesk].push({
        DeskId: currentDeskId,
        AssetId: 0,
        AssetNo: scannedCode,
        Status: "Extra"
    });
    toggleOkButton();
}

function toggleOkButton() {
    let hasAssets = $("#assetList .assetRow").length > 0;


    let hasScanned = $("#assetList .assetRow .status").filter(function () {
        let status = $(this).text();
        return status === "Matched" || status === "Extra";
    }).length > 0;

    if (hasAssets && hasScanned) {
        $("#btnOk").prop("disabled", false);
    } else {
        $("#btnOk").prop("disabled", true);
    }
}


$("#btnOk").on("click", function () {
    new Promise((resolve) => {

        $("#assetList .assetRow").each(function () {
            let status = $(this).find(".status").text();
            if (status === "Pending") {
                $(this).find(".status")
                    .text("Missed")
                    .removeClass()
                    .addClass("status badge bg-primary");

                deskResults[currentDesk].push({
                    DeskId: currentDeskId,
                    AssetId: $(this).data("assetid"),
                    AssetNo: $(this).data("assetno"),
                    Status: "Missed"
                });
            }
        });

        $("#deskModal").hide();
        html5QrCode.stop();


        let deskAssets = deskResults[currentDesk];
        let allMatched = deskAssets.length > 0 && deskAssets.every(x => x.Status === "Matched");
        let someMatched = deskAssets.some(x => x.Status === "Matched") && !allMatched;

        let $deskBtn = $(`.deskBtn[data-deskno='${currentDesk}']`);

        if (allMatched) {

            $deskBtn.css({
                "background-color": "rgb(128, 227, 128)",
                "border": "2px solid #00ff00"
            });
        } else if (someMatched) {

            $deskBtn.css({
                "background-color": "rgb(255, 255, 153)",
                "border": "2px solid #cccc00"
            });
        }

        if (EditAuditId) {
            let totalCount = getTotalAuditedCount();
            $("#AuditedDeskCount").text(totalCount);
        }


        toggleCompletedButton();

        resolve();
    })
        .then(() => {

        });
});


function toggleCompletedButton() {

    let scannedCount = Object.keys(deskResults).filter(desk => deskResults[desk]?.length > 0).length;

    if (scannedCount > 0) {
        $(".buttonAuditrow").show();
    } else {
        $(".buttonAuditrow").hide();
    }

    if (!EditAuditId) {
        $("#AuditedDeskCount").text(scannedCount);
    }

}


$("#AuditcompletedBtn").on("click", function () {

    $('#loader-pms').show();

    let scannedCount = Object.keys(deskResults).filter(desk => deskResults[desk]?.length > 0).length;
    var AuditDetailsStatic = {};
    AuditDetailsStatic = {
        AuditId: EditAuditId > 0 ? EditAuditId : null,
        AuditNo: $('#AuditId').val(),
        AuditDate: $('#AuditingDate').val(),
        BranchId: parseInt($('#BranchId').val()) || null,
        FloorId: parseInt($('#HallId').val()) || null,
        AuditStatus: scannedCount > 0 ? 1 : 2,
        Comments: $('#Notes').val(),
        NoOfDeskCount: parseInt($('#NoOfDeskCount').text()) || 0,
        AuditedDeskCount: parseInt($('#AuditedDeskCount').text()) || 0,
    };
    let AuditMappingDetails = [];

    Object.keys(deskResults).forEach(deskNo => {
        deskResults[deskNo].forEach(r => {

            if (r.Status === "Matched") {
                AuditMappingDetails.push({
                    AuditDeskMappingId: null,
                    AuditId: EditAuditId > 0 ? EditAuditId : null,
                    DeskId: r.DeskId,
                    AssetId: r.AssetId,
                    AssetNo: r.AssetNo,
                    AuditDeskStatus: 1
                });

            }
            else if (r.Status === "Missed") {
                AuditMappingDetails.push({
                    AuditDeskMappingId: null,
                    AuditId: EditAuditId > 0 ? EditAuditId : null,
                    DeskId: r.DeskId,
                    AssetId: r.AssetId,
                    AssetNo: r.AssetNo,
                    AuditDeskStatus: 2
                });

            } else if (r.Status === "Extra") {
                let matchingDesk = null;

                $("#deskContainer .deskBtn").each(function () {
                    let assetIds = $(this).data("assetid")?.toString().split(",") || [];
                    let assetNos = $(this).data("assetno")?.toString().split(",") || [];


                    let matchIndex = assetNos.findIndex(no => no.trim() === r.AssetNo.trim());

                    if (matchIndex !== -1) {
                        matchingDesk = {
                            DeskId: $(this).data("deskid"),
                            AssetId: assetIds[matchIndex]
                        };
                        return false;
                    }
                });

                //if (matchingDesk && matchingDesk.AssetId) {

                //}

                AuditMappingDetails.push({
                    AuditDeskMappingId: null,
                    AuditId: EditAuditId > 0 ? EditAuditId : null,
                    DeskId: r.DeskId,
                    AssetId: null,
                    AssetNo: r.AssetNo,
                    AuditDeskStatus: 3
                });

            }
        });
    });


    formDataMultiple.append("AuditDetailsStatic", JSON.stringify(AuditDetailsStatic));
    formDataMultiple.append("AuditMappingDetails", JSON.stringify(AuditMappingDetails));

    $.ajax({
        url: "/Inventory/InsertUpdateAudit",
        method: "POST",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: function (response) {
            Common.successMsg(response.message);
            $('#AuditingModal').hide();
            formDataMultiple = new FormData();
            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall("GET", "/Inventory/GetAudit", { AuditId: null, FromDate: null, ToDate: null, BranchId: parseInt(BranchMappingId) }, GetAuditingSuccess, null);

            $('#loader-pms').hide();

        },
        error: function () {
            $('#loader-pms').hide();

        }
    });

});


$('#Audittable').on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {

        EditAuditId = $(this).data('id');
        Common.ajaxCall("GET", "/Inventory/DeleteAudit", { AuditId: EditAuditId }, function (response) {
            response = response.status ? Common.successMsg(response.message) : Common.errorMsg(response.message);

            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall("GET", "/Inventory/GetAudit", { AuditId: null, FromDate: null, ToDate: null, BranchId: parseInt(BranchMappingId) }, GetAuditingSuccess, null);

        }, null);
    }
});


$('#Audittable').on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    EditAuditId = $(this).data('id');
    deskResults = {};
    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Inventory/GetAudit", { AuditId: EditAuditId, FromDate: null, ToDate: null, BranchId: parseInt(BranchMappingId) }, editAudit, null);

});
function editAudit(response) {

    var data = JSON.parse(response.data);
    $("#deskContainer").empty();
    $('#FormAudit input, #FormAudit select').prop('disabled', true);
    $('#AuditId').val(data[0][0].AuditNo);
    $('#AuditingDate').val(extractDate(data[0][0].AuditDate));
    $('#BranchId').val(data[0][0].BranchId);
    $('#Notes').val(data[0][0].Comments);
    $('#NoOfDeskCount').text(data[0][0].NoOfDeskCount);


    Common.bindDropDownNotNull(data[0][0].BranchId, 'HallForAudit', 'HallId', 'FormAudit')
        .then(() => {

            $('#HallId').val(data[0][0].FloorId).trigger('change');
        });
    $('#StoreInchangeId').val($('#StoreInchangeId option:eq(1)').val()).trigger('change').prop('disabled', true);


    $('#Btnstart').hide();

    $("#deskContainer").show();
    $('#AuditcompletedBtn').show();


    if (data[1] && data[1].length > 0) {
        data[1].forEach(item => {
            let btnColor = item.Status_Color || "#ffcccc";
            let btnBorder = (btnColor === "rgb(128, 227, 128)" ? "2px solid #00ff00" : "1px solid #cc0000");
            let isDisabled = (
                btnColor === "rgb(128, 227, 128)" ||
                btnColor === "#e9d63b"
            ) ? "disabled" : "";
            let btn = `
                <button type="button"
                        class="btn btn-sm m-1 deskBtn"
                        style="background-color:${btnColor}; font-size: 10px; font-weight: 600;"
                        data-assetid="${item.AssetId}"
                        data-assetno="${item.AssetNo}"  
                        data-deskno="${item.DeskNo}"
                        data-deskid="${item.DeskId}"
                        data-assetname="${item.AssetName}"
                        ${isDisabled}>
                    ${item.DeskNo} 
                </button>
            `;
            $("#deskContainer").append(btn);
        });


    }
    let initialCount = $(".deskBtn[disabled]").length;
    $("#AuditedDeskCount").text(initialCount);
    $('#AuditingModal').show();
    $('#loader-pms').hide();
}


function getDeskMatchCounts(deskResults) {
    let counts = { allMatched: 0, someMatched: 0 };

    for (let desk in deskResults) {
        let deskAssets = deskResults[desk];
        if (!deskAssets || deskAssets.length === 0) continue;

        let allMatched = deskAssets.every(x => x.Status === "Matched");
        let someMatched = deskAssets.some(x => x.Status === "Matched") && !allMatched;

        if (allMatched) {
            counts.allMatched++;
        } else if (someMatched) {
            counts.someMatched++;
        }
    }

    return counts.allMatched + counts.someMatched;
}

function getTotalAuditedCount() {
    let disabledCount = $(".deskBtn[disabled]").length;
    let freshCount = getDeskMatchCounts(deskResults);
    return disabledCount + freshCount;
}


function extractDate(inputDate) {
    if (typeof inputDate !== 'string' || !inputDate.includes('T')) return "";
    return inputDate.split('T')[0];
}
$('#AuditingReportClose').click(function () {
    $('#ReportModal').hide();
});

$('#AuditingScanClose').click(function () {
    $('#deskModal').hide();
    html5QrCode.stop();
});


$('#Audittable').on('click', '.btn-report', function () {
    $('#loader-pms').show();
    EditAuditId = $(this).data('id');
    //Common.ajaxCall("GET", "/Inventory/GetReportAudit", { AuditId: EditAuditId }, ReportAudit, null);
    ReportAudit();

});

function ReportAudit() {

    //var data = JSON.parse(response.data);
    $("#statcDetailsContainer").empty();
    $("#tablenotnullContainer").empty();


    //var CounterBox = Object.keys(data[0][0]);

    //$("#ReportCounterTextBox1").text(CounterBox[0]);
    //$("#ReportCounterTextBox2").text(CounterBox[1]);
    //$("#ReportCounterTextBox3").text(CounterBox[2]);
    //$("#ReportCounterTextBox4").text(CounterBox[3]);

    //$('#ReportCounterValBox1').text(data[0][0][CounterBox[0]]);
    //$('#ReportCounterValBox2').text(data[0][0][CounterBox[1]]);
    //$('#ReportCounterValBox3').text(data[0][0][CounterBox[2]]);
    //$('#ReportCounterValBox4').text(data[0][0][CounterBox[3]]);


    // Hardcoded counter labels
    $("#ReportCounterTextBox1").text("Total");
    $("#ReportCounterTextBox2").text("Mapped");
    $("#ReportCounterTextBox3").text("Not Matched with System");
    $("#ReportCounterTextBox4").text("Not Matched with Manual");

    // Hardcoded counter values
    $("#ReportCounterValBox1").text("85 / 15");  // Total
    $("#ReportCounterValBox2").text("4");       // Mapped
    $("#ReportCounterValBox3").text("1");       // Not Matched with System
    $("#ReportCounterValBox4").text("2");       // Not Matched with Manual

    //let audit = data[1][0];

    let audit = {
        AuditNo: "IGS-AUD-0004",
        AuditDate: "2025-10-15",
        BranchName: "Ganapathy",
        FloorName: "Hall-A",
        AuditStatus: "In-Progress",
        InCharge: "Ram Prakash",
        NoOfDeskCount: 9, // total departments
        AuditedDeskCount: 9,
        Comments: ""
    };
    let data = [
        { DeptName: "Production", AssetNo: "PRD-001", AssetName: "Machine A", Status: "Matched" },
        { DeptName: "Production", AssetNo: "PRD-002", AssetName: "Machine B", Status: "Not Matched" },
        { DeptName: "Production", AssetNo: "PRD-003", AssetName: "Machine C", Status: "Matched" },
        { DeptName: "Production", AssetNo: "PRD-004", AssetName: "Machine D", Status: "Extra" },

        { DeptName: "Dyeing", AssetNo: "DYE-001", AssetName: "Dye Machine A", Status: "Matched" },
        { DeptName: "Dyeing", AssetNo: "DYE-002", AssetName: "Dye Machine B", Status: "Matched" },
        { DeptName: "Dyeing", AssetNo: "DYE-003", AssetName: "Dye Machine C", Status: "Extra" },
        { DeptName: "Dyeing", AssetNo: "DYE-004", AssetName: "Dye Machine D", Status: "Matched" },

        { DeptName: "Washing", AssetNo: "WSH-001", AssetName: "Washer A", Status: "Matched" },
        { DeptName: "Washing", AssetNo: "WSH-002", AssetName: "Washer B", Status: "Not Matched" },
        { DeptName: "Washing", AssetNo: "WSH-003", AssetName: "Washer C", Status: "Matched" },
        { DeptName: "Washing", AssetNo: "WSH-004", AssetName: "Washer D", Status: "Matched" },

        { DeptName: "Finishing", AssetNo: "FIN-001", AssetName: "Finisher A", Status: "Matched" },
        { DeptName: "Finishing", AssetNo: "FIN-002", AssetName: "Finisher B", Status: "Extra" },
        { DeptName: "Finishing", AssetNo: "FIN-003", AssetName: "Finisher C", Status: "Matched" },
        { DeptName: "Finishing", AssetNo: "FIN-004", AssetName: "Finisher D", Status: "Matched" },

        { DeptName: "Quality Control", AssetNo: "QC-001", AssetName: "Tester A", Status: "Matched" },
        { DeptName: "Quality Control", AssetNo: "QC-002", AssetName: "Tester B", Status: "Matched" },
        { DeptName: "Quality Control", AssetNo: "QC-003", AssetName: "Tester C", Status: "Not Matched" },
        { DeptName: "Quality Control", AssetNo: "QC-004", AssetName: "Tester D", Status: "Matched" },

        { DeptName: "Maintenance", AssetNo: "MNT-001", AssetName: "Tool A", Status: "Matched" },
        { DeptName: "Maintenance", AssetNo: "MNT-002", AssetName: "Tool B", Status: "Extra" },
        { DeptName: "Maintenance", AssetNo: "MNT-003", AssetName: "Tool C", Status: "Matched" },
        { DeptName: "Maintenance", AssetNo: "MNT-004", AssetName: "Tool D", Status: "Matched" },

        { DeptName: "Packing", AssetNo: "PAC-001", AssetName: "Pack A", Status: "Matched" },
        { DeptName: "Packing", AssetNo: "PAC-002", AssetName: "Pack B", Status: "Matched" },
        { DeptName: "Packing", AssetNo: "PAC-003", AssetName: "Pack C", Status: "Matched" },
        { DeptName: "Packing", AssetNo: "PAC-004", AssetName: "Pack D", Status: "Extra" },

        { DeptName: "Stores", AssetNo: "STR-001", AssetName: "Shelf A", Status: "Matched" },
        { DeptName: "Stores", AssetNo: "STR-002", AssetName: "Shelf B", Status: "Matched" },
        { DeptName: "Stores", AssetNo: "STR-003", AssetName: "Shelf C", Status: "Matched" },
        { DeptName: "Stores", AssetNo: "STR-004", AssetName: "Shelf D", Status: "Matched" },

        { DeptName: "Lab & Testing", AssetNo: "LAB-001", AssetName: "Tester A", Status: "Matched" },
        { DeptName: "Lab & Testing", AssetNo: "LAB-002", AssetName: "Tester B", Status: "Not Matched" },
        { DeptName: "Lab & Testing", AssetNo: "LAB-003", AssetName: "Tester C", Status: "Matched" },
        { DeptName: "Lab & Testing", AssetNo: "LAB-004", AssetName: "Tester D", Status: "Matched" },
    ];

    let html = `
    <div class="row p-2">
        <div class="col-md-4 detail-field">
            <span class="label">Audit No</span>
            <span class="colon">:</span>
            <span class="value">${audit.AuditNo}</span>
        </div>
        <div class="col-md-4 detail-field">
            <span class="label">Audit Date</span>
            <span class="colon">:</span>
            <span class="value">${audit.AuditDate}</span>
        </div>
        <div class="col-md-4 detail-field">
            <span class="label">Plant</span>
            <span class="colon">:</span>
            <span class="value">${audit.BranchName}</span>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-md-4 detail-field">
            <span class="label">Floor</span>
            <span class="colon">:</span>
            <span class="value">${audit.FloorName}</span>
        </div>
        <div class="col-md-4 detail-field">
            <span class="label">Status</span>
            <span class="colon">:</span>
            <span class="value">${audit.AuditStatus}</span>
        </div>
        <div class="col-md-4 detail-field">
            <span class="label">Incharge</span>
            <span class="colon">:</span>
            <span class="value">${audit.InCharge}</span>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-md-4 detail-field">
            <span class="label">No Of Dept</span>
            <span class="colon">:</span>
            <span class="value">${audit.NoOfDeskCount}</span>
        </div>
        <div class="col-md-4 detail-field">
            <span class="label">Audited Dept</span>
            <span class="colon">:</span>
            <span class="value">${audit.AuditedDeskCount}</span>
        </div>
        <div class="col-md-4 detail-field">
            <span class="label">Comments</span>
            <span class="colon">:</span>
            <span class="value">${audit.Comments}</span>
        </div>
    </div>
`;

    $("#statcDetailsContainer").html(html);


    $('#tablenotnullContainer').show();
    bindDeskTable(data)
    $('#ReportModal').show();

    $('#loader-pms').hide();

}


function bindDeskTable(data) {
    let container = $("#tablenotnullContainer");
    container.empty();
    if (!data || data.length === 0) {
        container.html("<p>No data available</p>");
        return;
    }


    let keys = Object.keys(data[0]);


    let thead = "<thead><tr>";
    keys.forEach(key => {
        thead += `<th style="font-weight: 600;font-size: 14px;color: black;">${key}</th>`;
    });
    thead += "</tr></thead>";

    let table = `
      <table class="table table-bordered">
        ${thead}
        <tbody></tbody>
      </table>
    `;

    container.append(table);

    let tbody = container.find("tbody");

    data.forEach(item => {
        let row = `<tr>`;
        keys.forEach(key => {
            let value = item[key] ?? "";


            if (key === "Status") {
                let badgeClass =
                    value === "Matched" ? "text-success" :
                        value === "Missed" ? "text-primary" :
                            value === "Extra" ? "text-danger" :
                                "text-secondary";

                row += `<td><span class="${badgeClass}">${value}</span></td>`;
            } else {
                row += `<td>${value}</td>`;
            }
        });
        row += "</tr>";
        tbody.append(row);
    });
}


