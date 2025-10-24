$(document).ready(function () {

    // Array of months
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // Month navigation (existing code)
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
        $('#dateDisplay2').text(`${months[monthIndex]} ${currentYear}`);
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
        $('#dateDisplay2').text(`${months[monthIndex]} ${currentYear}`);
    });

    // Toggle From–To date range
    $('#toggleCustomDate').click(function () {
        $('#fromtodateCol').slideToggle(); // smoothly show/hide
    });


    const qrData = [
        {
            BarCodeNo: "IGS-QR-0001",
            Date: "07-10-2025",
            Type: "New",
            AssetType: "IT Assets",
            Category: "CCTV",
            SubCategory: "Network Video Recorder",
            NoOfAssets: 1
        },
        {
            BarCodeNo: "IGS-QR-0002",
            Date: "06-10-2025",
            Type: "Regenerate",
            AssetType: "Non-IT Assets",
            Category: "CCTV",
            SubCategory: "IP Camera",
            NoOfAssets: 2
        },
        {
            BarCodeNo: "IGS-QR-0003",
            Date: "05-10-2025",
            Type: "New",
            AssetType: "IT Assets",
            Category: "Laptop",
            SubCategory: "Dell Latitude 5420",
            NoOfAssets: 3
        },
        {
            BarCodeNo: "IGS-QR-0004",
            Date: "04-10-2025",
            Type: "Regenerate",
            AssetType: "Non-IT Assets",
            Category: "Printer",
            SubCategory: "HP LaserJet Pro",
            NoOfAssets: 1
        },
        {
            BarCodeNo: "IGS-QR-0005",
            Date: "03-10-2025",
            Type: "New",
            AssetType: "IT Assets",
            Category: "Networking",
            SubCategory: "Cisco Switch",
            NoOfAssets: 5
        },
        {
            BarCodeNo: "IGS-QR-0006",
            Date: "02-10-2025",
            Type: "Regenerate",
            AssetType: "Non-IT Assets",
            Category: "Monitor",
            SubCategory: "Samsung 24 inch",
            NoOfAssets: 2
        },
        {
            BarCodeNo: "IGS-QR-0007",
            Date: "01-10-2025",
            Type: "New",
            AssetType: "IT Assets",
            Category: "Accessories",
            SubCategory: "Wireless Mouse",
            NoOfAssets: 10
        }
    ];

    const qrColumns = [
        { data: 'BarCodeNo', title: 'Bar Code No' },
        { data: 'Date', title: 'Date' },
        { data: 'Type', title: 'Type' },
        { data: 'AssetType', title: 'Asset Type' },
        { data: 'Category', title: 'Category' },
        { data: 'SubCategory', title: 'Sub Category' },
        { data: 'NoOfAssets', title: 'No Of Assets' }
    ];

    $('#QRGenerationTableDynamic').empty();
    var qrTableHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-striped" id="qrTable"></table>
        </div>
    `;
    $('#QRGenerationTableDynamic').append(qrTableHTML);
    bindTable('qrTable', qrData, qrColumns, 7, 'BarCodeNo', '350px', true, { update: true, delete: true });

    $(document).on('click', '#AddQRGeneration', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#QRBarcodeCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#QRBarcodeCanvas").css("width", "50%");
        } else {
            $("#QRBarcodeCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#Headering').text('Barcode Generate');
        $('#BarcodeNumber').val('IGS-QR-0008');
        $("#Save span:first").text("Save");
        $("#preview span:first").text("Save & Preview");
        $("#generate span:first").text("Save & Print");
        $('#configFieldsContent').slideUp();
        $('#toggleLabelPrintConfigDiv').show();
        $('#SubCategory').val('').trigger('change'); 
        $('#barcodeTableBody').empty();
         
        $('#barcodeTableBody').append(`
                <tr class="text-center text-muted">
                    <td colspan="6"><i class="fas fa-info-circle me-2"></i> No records found</td>
                </tr>
            `);
        $('#selectAllCheckbox').prop('checked', false).prop('disabled', false);
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#QRBarcodeCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('change', '#SubCategory', function () {
        const mockAssetData = [
            {
                BarCodeAssetMappingId: 101,
                AssetId: 1,
                AssetNo: "AST-001",
                AssetName: "LG_Network Video Recorder_AJGD_1896_SKHF-UYWY-RDCS",
                BarCodeId: "BC-1001"
            },
            {
                BarCodeAssetMappingId: 102,
                AssetId: 2,
                AssetNo: "AST-002",
                AssetName: "HP_LaserJet Printer_XTYU_2489_QWER-ASDF-ZXCV",
                BarCodeId: "BC-1002"
            },
            {
                BarCodeAssetMappingId: 103,
                AssetId: 3,
                AssetNo: "AST-003",
                AssetName: "DELL_Laptop_BVFR_1098_PLKM-NBVC-XZAS",
                BarCodeId: "BC-1003"
            }
        ];
        AssetDetailsTable(mockAssetData);
    });

    $('#selectAllCheckbox').on('change', function () {
        var isChecked = $(this).is(':checked');
        $('.rowCheckbox').prop('checked', isChecked);
    });

    $('#toggleLabelPrintConfig').on('click', function () {
        $('#configFieldsContent').slideDown();
        $('#toggleLabelPrintConfigDiv').hide();
    });

    $('#closeLabelPrintConfig').on('click', function () {
        $('#configFieldsContent').slideUp();
        $('#toggleLabelPrintConfigDiv').show();
    });

    $(document).on('#SubCategory', function () {
        var $thisval = $(this).val();
        if ($thisval == '') { 
            $('#barcodeTableBody').empty();

            $('#barcodeTableBody').append(`
                <tr class="text-center text-muted">
                    <td colspan="6"><i class="fas fa-info-circle me-2"></i> No records found</td>
                </tr>
            `); 
        }
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#QRBarcodeCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#QRBarcodeCanvas").css("width", "50%");
        } else {
            $("#QRBarcodeCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#Headering').text('Edit Barcode Generate');
        $('#BarcodeNumber').val('IGS-QR-0008');
        $("#Save span:first").text("Update");
        $("#preview span:first").text("Update & Preview");
        $("#generate span:first").text("Update & Print");
        $('#configFieldsContent').slideDown();
        $('#toggleLabelPrintConfigDiv').hide();
        $('#SubCategory').val('1');
        const mockAssetData = [
            {
                BarCodeAssetMappingId: 101,
                AssetId: 1,
                AssetNo: "AST-001",
                AssetName: "DELL_Laptop_BVFR_1098_PLKM-NBVC-XZAS",
                BarCodeId: "BC-1001"
            },
            {
                BarCodeAssetMappingId: 102,
                AssetId: 2,
                AssetNo: "AST-002",
                AssetName: "HP_LaserJet Printer_XTYU_2489_QWER-ASDF-ZXCV",
                BarCodeId: "BC-1002"
            }
        ];
        AssetDetailsTable(mockAssetData);
        $('.rowCheckbox').prop('checked', true);
        $('#selectAllCheckbox').prop('checked', true).prop('disabled', true);
    });

    $(document).on('click', '#Save', function () {
        if ($('#Headering').text() == "Barcode Generate") {
            Common.successMsg("Barcode Generate Added Successfully.");
        } else {
            Common.successMsg("Updated Barcode Generate Successfully.");
        }
        $("#QRBarcodeCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });
});

function AssetDetailsTable(mockAssetData) {
    $('#loader-pms').show();
    $('#barcodeTableBody').empty();

    const assetData = mockAssetData; // using hardcoded data here

    if (!assetData || assetData.length === 0 || assetData[0].AssetId == null) {
        $('#barcodeTableBody').append(`
            <tr class="text-center text-muted">
                <td colspan="6"><i class="fas fa-info-circle me-2"></i> No records found</td>
            </tr>
        `);
    } else {
        assetData.forEach(function (item) {
            var html = `
                <tr data-asset-id="${item.AssetId}">
                    <td><input type="checkbox" class="rowCheckbox" /></td>
                    <td style="display:none;">${item.BarCodeAssetMappingId ?? ''}</td>
                    <td style="display:none;">${item.AssetId ?? ''}</td>
                    <td>${item.AssetNo ?? ''}</td>
                    <td>${item.AssetName ?? ''}</td>
                    <td style="display:none;">${item.BarCodeId ?? ''}</td>
                </tr>
            `;
            $('#barcodeTableBody').append(html);
        });
    }

    $('#loader-pms').hide();
}

function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($('#' + tableid).length && $.fn.DataTable.isDataTable('#' + tableid)) {
        try {
            $('#' + tableid).DataTable().clear().destroy();
        } catch (error) {
            console.error('DataTable destroy error:', error);
            return;
        }
    }

    $('#' + tableid).empty();
    columns = columns.filter(x => x.name !== "TetroONEnocount");

    var isTetroONEnocount = data[0] && data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");
    var LocationColumnIndex = columns.findIndex(column => column.data === "HiringLocation");

    if (isAction && data && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            data: "Action", name: "Action", title: "Action", orderable: false
        });
    }

    var renderColumn = [];

    if (StatusColumnIndex !== -1) {
        renderColumn.push({
            targets: StatusColumnIndex,
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
            targets: LocationColumnIndex,
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
            paginate: {
                next: ">",
                previous: "<"
            }
        };
    }

    var table = $('#' + tableid).DataTable({
        dom: "Bfrtip",
        bDestroy: true,
        responsive: true,
        data: !isTetroONEnocount ? data : [],
        columns: columns,
        destroy: true,
        scrollY: scrollpx,
        sScrollX: "100%",
        aaSorting: [],
        scrollCollapse: true,
        oSearch: { bSmart: false, bRegex: true },
        info: hasValidData,
        paging: hasValidData,
        pageLength: 7,
        lengthMenu: [7, 14, 50],
        language: $.extend({}, lang, {
            emptyTable: `
                <div>
                    <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                    No records found
                </div>`
        }),
        columnDefs: !isTetroONEnocount ? renderColumn : [],
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        if (typeof Common !== 'undefined' && Common.autoAdjustColumns) {
            Common.autoAdjustColumns(table1);
        }
    }, 100);
}
