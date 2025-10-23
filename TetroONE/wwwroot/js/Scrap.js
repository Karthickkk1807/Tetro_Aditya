$(document).ready(function () { 

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    $('#decrement-month-btn2').click(function () {
        let currentText = $('#dateDisplay2').text().trim();
        let [currentMonth, currentYear] = currentText.split(" ");
        let monthIndex = months.indexOf(currentMonth);

        if (monthIndex === -1) return;

        monthIndex--;
        if (monthIndex < 0) {
            monthIndex = 11;
            currentYear = parseInt(currentYear) - 1;
        }

        let newMonth = months[monthIndex];
        $('#dateDisplay2').text(`${newMonth} ${currentYear}`);
    });

    $('#increment-month-btn2').click(function () {
        let currentText = $('#dateDisplay2').text().trim();
        let [currentMonth, currentYear] = currentText.split(" ");
        let monthIndex = months.indexOf(currentMonth);

        if (monthIndex === -1) return;

        monthIndex++;
        if (monthIndex > 11) {
            monthIndex = 0;
            currentYear = parseInt(currentYear) + 1;
        }

        let newMonth = months[monthIndex];
        $('#dateDisplay2').text(`${newMonth} ${currentYear}`);
    });

    $(document).on('click', '#AddScrap', function () {
        $('#ScrapModal').show();
        $('#AuditingModalText').text('Add Scraping');
        $("#ScrapSaveBtn span:first").text("Save");
        $('.Status-Div').removeClass('d-block').addClass('d-none');
        $('#AddNotesText').val('');
        $('#ScrapNo').val('SCAP_001');
        $('#ScrapDate').val(''); 
        $('#BranchId').val('');
        $('#BillNoTextBox').val('');
        $('#MovementTypeId').val('').trigger('change');
        $('.noOfdivRow').removeClass('col-6').addClass('col-12');   
        $('.statusdiv').hide();
    });

    $(document).on('click', '#ScrapClose', function () {
        $('#ScrapModal').hide();
    });

    $('#MovementTypeId').on('change', function () {
        var selectedValue = $(this).val();

        if (selectedValue == '1') {
            $('#TextboxbillNumberDiv label').text('Ticket No').append('<span id="Asterisk">*</span>');
            $('#TextboxbillNumberDiv').show();
        } else if (selectedValue == '2') {
            $('#TextboxbillNumberDiv label').text('Service No').append('<span id="Asterisk">*</span>');
            $('#TextboxbillNumberDiv').show();
        } else {
            $('#TextboxbillNumberDiv label').text('').append('<span id="Asterisk">*</span>');
            $('#TextboxbillNumberDiv').hide();
        }
    });

    $(document).on('click', '#AddItemButtonRow', function () {
        $('#ProductModal').show();
    });

    $(document).on('click', '.modal-close-btn', function () {
        $('#ProductModal').hide();
    });

    const assetData = [
        {
            id: 1,
            assetNo: 'IGS-NVR-LG-0001',
            assetName: 'LG_Network Video Recorder_AJGD_1896_SKHF-UYWY-RDCS',
            assetType: 'IT Assets',
            category: 'CCTV',
            serialNumber: 'SKHF-UYWY-RDCS',
            modelNumber: 'AJGD_1896'
        },
        {
            id: 2,
            assetNo: 'IGS-CAM-LG-0002',
            assetName: 'LG_Camera_XPTO_2020_ABC-1234-XYZ',
            assetType: 'IT Assets',
            category: 'CCTV',
            serialNumber: 'ABC-1234-XYZ',
            modelNumber: 'XPTO_2020'
        },
        {
            id: 3,
            assetNo: 'IGS-SRV-DL-0003',
            assetName: 'Dell_Server_PowerEdge_T40_DEF-4567-GHIJ',
            assetType: 'IT Assets',
            category: 'Servers',
            serialNumber: 'DEF-4567-GHIJ',
            modelNumber: 'PowerEdge_T40'
        },
        {
            id: 4,
            assetNo: 'IGS-PRT-HP-0004',
            assetName: 'HP_LaserJet_Pro_M404dn_JKL-7890-MNOP',
            assetType: 'IT Assets',
            category: 'Printers',
            serialNumber: 'JKL-7890-MNOP',
            modelNumber: 'M404dn'
        } 
    ];
     
    let selectedAssets = []; 

    $(document).on('click', '#AddItemButtonRow', function () {
        let tableBody = $('#ProductItem-table-body');
        tableBody.empty(); // Clear existing rows

        assetData.forEach(item => {
            const rowHtml = `
        <tr class="AllProductRowItem">
            <td>
                <div class="d-flex align-items-center">
                    <input class="mr-2 asset-checkbox" type="checkbox" id="AssetNo-${item.id}"
                        data-id="${item.id}" data-assetno="${item.assetNo}" data-assetname="${item.assetName}">
                    <label class="AssetId d-none">${item.id}</label>
                    <label class="AssetNo" for="AssetNo-${item.id}">${item.assetNo}</label>
                </div>
            </td>
            <td><label class="AssetName">${item.assetName}</label></td>
            <td class="AssetType">${item.assetType}</td>
            <td class="Category">${item.category}</td>
            <td class="SerialNumber">${item.serialNumber}</td>
            <td class="ModelNumber">${item.modelNumber}</td>
        </tr>
    `;
            tableBody.append(rowHtml);
        });

        $('#ProductModal').show();
    });

    $(document).on('change', '.asset-checkbox', function () {
        const assetId = $(this).data('id');
        const assetNo = $(this).data('assetno');
        const assetName = $(this).data('assetname');

        if (this.checked) {
            // Add if not already selected
            if (!selectedAssets.some(a => a.assetId === assetId)) {
                selectedAssets.push({ assetId, assetNo, assetName });
            }
        } else {
            // Remove if unchecked
            selectedAssets = selectedAssets.filter(a => a.assetId !== assetId);
        } 
    });

    $(document).on('click', '#BtnAdd', function () {
        const tableBody = $('#ScrapProductTablebody');

        // ✅ Prevent removing #SubtotalRow
        tableBody.find('tr').not('#AddItemButtonRow, #SubtotalRow').remove();

        if (selectedAssets.length === 0) {
            alert('Please select at least one asset.');
            return;
        }

        selectedAssets.forEach((asset, index) => {
            const rowHtml = `
            <tr class="ProductTableRow">
                <td>${index + 1}</td>
                <td><label>${asset.assetNo}</label></td>
                <td>
                    <label>${asset.assetName}</label>
                    <textarea class="form-control mt-2 descriptiontdtext d-none"
                        placeholder="Description">${asset.assetName}</textarea>
                </td>
                <td>
                    <select class="form-control condition" required>
                        <option value="">-- Select --</option>
                        <option value="1">Damaged</option>
                        <option value="2">Obsolete</option>
                        <option value="3">Not Working</option>
                        <option value="5">End of Life</option>
                        <option value="7">Lost</option>
                        <option value="8">Stolen</option>
                        <option value="10">Broken Beyond Repair</option>
                        <option value="11">Malfunctioning</option>
                    </select>
                </td>
                <td>
                    <select class="form-control WarrantyType" required>
                        <option value="">-- Select --</option>
                        <option value="1">Warranty</option>
                        <option value="2">Non-Warranty</option>
                    </select>
                </td>
                <td>
                    <textarea class="form-control commentsScarp" placeholder="Comments"
                        style="overflow:hidden;resize:none;min-height:35px;line-height:1.4em;height:35px;"></textarea>
                </td>
                <td style="text-align:center;">
                    <button class="btn btn-danger btn-sm DynrowRemove" type="button">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
            $(rowHtml).insertBefore('#AddItemButtonRow');
        });

        $('#ProductModal').hide(); // Close modal after updating
    });


    $(document).on('click', '.DynrowRemove', function () {
        $(this).closest('tr').remove();
    });

    $(document).on('click', '#ScrapSaveBtn', function () {
        if ($('#AuditingModalText').text() == "Add Scraping") {
            Common.successMsg("Scraping Added Successfully.");
        } else {
            Common.successMsg("Updated Scraping Successfully.");
        } 
        $('#ScrapModal').hide();
    });

    $(document).on('click', '.btn-edit', function () {
        $('#ScrapModal').show();
        bindScrapEditTable(editScrapData);
        StatusActivitySuccess(responseDataStatus);
        $('#AuditingModalText').text('Edit Scraping');
        $('#AddNotesText').val('No longer compatible with current software infrastructure. Unit failed QA testing repeatedly – marked for disposal. Asset not located during verification – assumed lost.'); 
        $('#ScrapNo').val('SCAP_001');
        $('#ScrapDate').val('2025-10-09');
        $('.Status-Div').removeClass('d-none').addClass('d-block');
        $('#BranchId').val('1');
        $('#BillNoTextBox').val('TRAN_2025_0001');
        $('#MovementTypeId').val('1').trigger('change'); 
        $("#ScrapSaveBtn span:first").text("Update");
        $('#SubtotalRow').show();
        $('.noOfdivRow').removeClass('col-12').addClass('col-6');  
        $('.statusdiv').show();
    });

    const ScrapData = [
        {
            AssetCode: "AST001",
            Name: "Monitor",
            Category: "IT-Asset",
            ScrapDate: "2025-05-28",
            Condition: "Damaged",
            ApprovedBy: "John D.",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            AssetCode: "AST002",
            Name: "Keyboard",
            Category: "IT-Asset",
            ScrapDate: "2025-06-15",
            Condition: "Working",
            ApprovedBy: "Priya S.",
            Status: "Draft",
            Status_Color: "#ffa500"
        },
        {
            AssetCode: "AST003",
            Name: "Mouse",
            Category: "IT-Asset",
            ScrapDate: "2025-07-20",
            Condition: "Not Working",
            ApprovedBy: "Arun K.",
            Status: "Rejected",
            Status_Color: "#ff7f7f"
        },
        {
            AssetCode: "AST004",
            Name: "CPU",
            Category: "IT-Asset",
            ScrapDate: "2025-08-10",
            Condition: "Obsolete",
            ApprovedBy: "Revathi G.",
            Status: "Cancelled",
            Status_Color: "#dc3545"
        },
        {
            AssetCode: "AST005",
            Name: "Laptop",
            Category: "IT-Asset",
            ScrapDate: "2025-09-01",
            Condition: "Damaged",
            ApprovedBy: "Karthik M.",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            AssetCode: "AST006",
            Name: "Printer",
            Category: "Non_IT-Asset",
            ScrapDate: "2025-09-15",
            Condition: "Broken",
            ApprovedBy: "Meena R.",
            Status: "Draft",
            Status_Color: "#ffa500"
        },
        {
            AssetCode: "AST007",
            Name: "Router",
            Category: "Non_IT-Asset",
            ScrapDate: "2025-10-05",
            Condition: "Old Model",
            ApprovedBy: "Sundar V.",
            Status: "Rejected",
            Status_Color: "#ff7f7f"
        }
    ];

    const ScrapColumns = [
        { data: 'AssetCode', name: 'AssetCode', title: 'Asset Code' },
        { data: 'Name', name: 'Name', title: 'Name' },
        { data: 'Category', name: 'Category', title: 'Category' },
        { data: 'ScrapDate', name: 'ScrapDate', title: 'Scrap Date' },
        { data: 'Condition', name: 'Condition', title: 'Condition' },
        { data: 'ApprovedBy', name: 'ApprovedBy', title: 'Approved By' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];

    $('#ScrapDynamic').empty();
    var assetHTML = `<div class="table-responsive">
                    <table class="table table-rounded dataTable table-striped tableResponsive" id="ScrapTable"></table>
                </div>`;
    $('#ScrapDynamic').append(assetHTML);
    bindTable('ScrapTable', ScrapData, ScrapColumns, 7, 'AssetCode', '335px', true, { update: true, delete: true });
});  

let editScrapData = [
    {
        SNo: 1,
        AssetNo: "IGS-NVR-LG-0001",
        AssetName: "LG_Network Video Recorder_AJGD_1896_SKHF-UYWY-RDCS",
        Condition: "3", // Not Working
        WarrantyType: "1", // Warranty
        Comments: "Display issue"
    },
    {
        SNo: 2,
        AssetNo: "IGS-CAM-LG-0002",
        AssetName: "LG_Camera_XPTO_2020_ABC-1234-XYZ",
        Condition: "2", // Obsolete
        WarrantyType: "2", // Non-Warranty
        Comments: "Outdated model"
    },
    {
        SNo: 3,
        AssetNo: "IGS-SRV-DL-0003",
        AssetName: "Dell_Server_PowerEdge_T40_DEF-4567-GHIJ",
        Condition: "1", // Damaged
        WarrantyType: "1", // Warranty
        Comments: "Fan failure"
    }
];

function bindScrapEditTable(editScrapData) {
    
    const tableBody = $('#ScrapProductTablebody');
    tableBody.find('tr').not('#AddItemButtonRow, #SubtotalRow').remove(); // keep Add and Subtotal rows

    editScrapData.forEach((item, index) => {
        const rowHtml = `
        <tr class="ProductTableRow">
            <td>${index + 1}</td>
            <td><label>${item.AssetNo}</label></td>
            <td>
                <label>${item.AssetName}</label>
                <textarea class="form-control mt-2 descriptiontdtext d-none" placeholder="Description">${item.AssetName}</textarea>
            </td>
            <td>
                <select class="form-control condition" required>
                    <option value="">-- Select --</option>
                    <option value="1" ${item.Condition == "1" ? "selected" : ""}>Damaged</option>
                    <option value="2" ${item.Condition == "2" ? "selected" : ""}>Obsolete</option>
                    <option value="3" ${item.Condition == "3" ? "selected" : ""}>Not Working</option>
                    <option value="5" ${item.Condition == "5" ? "selected" : ""}>End of Life</option>
                    <option value="7" ${item.Condition == "7" ? "selected" : ""}>Lost</option>
                    <option value="8" ${item.Condition == "8" ? "selected" : ""}>Stolen</option>
                    <option value="10" ${item.Condition == "10" ? "selected" : ""}>Broken Beyond Repair</option>
                    <option value="11" ${item.Condition == "11" ? "selected" : ""}>Malfunctioning</option>
                </select>
            </td>
            <td>
                <select class="form-control WarrantyType" required>
                    <option value="">-- Select --</option>
                    <option value="1" ${item.WarrantyType == "1" ? "selected" : ""}>Warranty</option>
                    <option value="2" ${item.WarrantyType == "2" ? "selected" : ""}>Non-Warranty</option>
                </select>
            </td>
            <td>
                <textarea class="form-control commentsScarp" placeholder="Comments"
                    style="overflow:hidden;resize:none;min-height:35px;line-height:1.4em;height:35px;">${item.Comments || ""}</textarea>
            </td>
            <td style="text-align:center;">
                <button class="btn btn-danger btn-sm DynrowRemove" type="button">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;
        $(rowHtml).insertBefore('#AddItemButtonRow');
    });

}


function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($('#' + tableid).length && $.fn.DataTable.isDataTable('#' + tableid)) {
        try {
        } catch (error) {
            console.error('DataTable destroy error:', error);
            return;
        }
    }

    $('#' + tableid).empty();
    columns = columns.filter(x => x.name !== "TetroONEnocount");

    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");
    var LocationColumnIndex = columns.findIndex(column => column.data === "HiringLocation");

    if (isAction && data && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [];

    if (StatusColumnIndex !== -1) {
        renderColumn.push({
            "targets": StatusColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Status_Color) {
                    var dataText = row.Status;
                    var statusColor = row.Status_Color.toLowerCase();

                    return `
                        <div>
                            <span class="ana-span badge text-white" style="background:${statusColor};width: 115px;font-size: 12px;height: 23px;">
                                ${dataText}
                            </span>
                        </div>`;
                }
                return data;
            }
        });
    }

    if (LocationColumnIndex !== -1) {
        renderColumn.push({
            "targets": LocationColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    var hotDot = row.IsHot === true || row.IsHot === "true"
                        ? '<span style="color:red;font-size:20px;vertical-align:middle;">•</span> '
                        : '';
                    return hotDot + row.HiringLocation;
                }
                return data;
            }
        });
    }

    if (access.update || access.delete) {
        renderColumn.push({
            targets: actionTarget,
            render: function (data, type, row, meta) {
                var html = '';
                if (access.update) {
                    html += `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit">
                                <img src="/assets/commonimages/edit.svg" />
                             </i>`;
                }
                if (access.delete) {
                    html += `<i class="btn-delete alert_delete mx-1" data-id="${row[editcolumn]}" title="Delete">
                                <img src="/assets/commonimages/delete.svg" />
                             </i>`;
                }
                return html;
            }
        });
    }

    var lang = {};
    if ($(window).width() <= 575) {
        lang = {
            "paginate": {
                "next": ">",
                "previous": "<"
            }
        };
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
            "emptyTable": `
                <div>
                    <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                    No records found
                </div>`
        }),
        "columnDefs": !isTetroONEnocount ? renderColumn : [],
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}


/*========================================================Status Tracking=================================================================*/

var responseDataStatus = {
    data: JSON.stringify([[
        {
            InventoryStatusName: "Draft",
            UserName: "Ajay Kumar",
            Status_Color: "orange",
            CreatedDate: "2025-09-19T09:30:00"
        },
        {
            InventoryStatusName: "Approved",
            UserName: "Kavinesh Rajasekar",
            Status_Color: "Green",
            CreatedDate: "2025-09-18T12:14:00"
        },
        {
            InventoryStatusName: "Rejected",
            UserName: "Sathiesh Kumar",
            Status_Color: "#ff7f7f",
            CreatedDate: "2025-09-19T09:30:00"
        },
        {
            InventoryStatusName: "Cancelled",
            UserName: "Tharani",
            Status_Color: "red",
            CreatedDate: "2025-09-20T15:45:00"
        }
    ]])
};

//StatusActivitySuccess(response);

function StatusActivitySuccess(responseDataStatus) {
    var parsedData = JSON.parse(responseDataStatus.data);
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
