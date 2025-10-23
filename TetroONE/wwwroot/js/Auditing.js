const stockRowsData = [
    { ProductId: "Laptop_5F7J8A2B9L0", ModalNo: "Dell XPS 13", SerialNo: "5F7J8A2B9L0", BarcodeNo: "B1001", Unit: "Box", SystemStock: "50", ManualStock: "48", DiffValue: "32" },
    { ProductId: "Wired Mouse_1X3W9R2M4C7", ModalNo: "LaserJet P1108", SerialNo: "1X3W9R2M4C7", BarcodeNo: "B1002", Unit: "Piece", SystemStock: "120", ManualStock: "118", DiffValue: "2" },
    { ProductId: "Smartphone_9Q7S4T5D2P3", ModalNo: "Samsung A52", SerialNo: "9Q7S4T5D2P3", BarcodeNo: "B1003", Unit: "Packet", SystemStock: "70", ManualStock: "75", DiffValue: "5" },
    { ProductId: "Headphone_3A2M9N4F7X8", ModalNo: "Lava A52", SerialNo: "3A2M9N4F7X8", BarcodeNo: "B1004", Unit: "Box", SystemStock: "90", ManualStock: "90", DiffValue: "0" },
    { ProductId: "Keyboard_8B2H5Y1L9K6", ModalNo: "Dell WH-CH510", SerialNo: "8B2H5Y1L9K6", BarcodeNo: "B1005", Unit: "Piece", SystemStock: "200", ManualStock: "198", DiffValue: "2" },
    { ProductId: "Office Chair_CHR123456", ModalNo: "Godrej SpinePro", SerialNo: "CHR123456", BarcodeNo: "B1006", Unit: "Packet", SystemStock: "30", ManualStock: "30", DiffValue: "0" },
    { ProductId: "Air Conditioner_AC445566", ModalNo: "Daikin 1.5 Ton", SerialNo: "AC445566", BarcodeNo: "B1007", Unit: "Box", SystemStock: "150", ManualStock: "155", DiffValue: "5" },
    { ProductId: "Laptop_5F7J8A2B9L0", ModalNo: "Dell XPS 13", SerialNo: "5F7J8A2B9L0", BarcodeNo: "B1008", Unit: "Piece", SystemStock: "80", ManualStock: "79", DiffValue: "5" },
    { ProductId: "Wired Mouse_1X3W9R2M4C7", ModalNo: "LaserJet P1108", SerialNo: "1X3W9R2M4C7", BarcodeNo: "B1009", Unit: "Packet", SystemStock: "60", ManualStock: "60", DiffValue: "0" },
    { ProductId: "Smartphone_9Q7S4T5D2P3", ModalNo: "Samsung A52", SerialNo: "9Q7S4T5D2P3", BarcodeNo: "B1010", Unit: "Box", SystemStock: "110", ManualStock: "112", DiffValue: "2" }
];

$(document).ready(function () {

    GridShow();

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


    $(document).on('click', '#AddAuditing', function () {
        $('#AuditingModal').show();
        $('#AuditingModalText').text('Add Auditing');
        $('#Finished-Tab').hide();
        $('#Transit-Tab').hide();
        $('#RawMaterials-Tab').show();
        $('#SaveManageStock').val('Save');

        $('.stockRow').remove();
        const row = stockRowsData[1];
        const Dynstockrow = `
                        <tr class="stockRow">
                          <td><input type="text" class="form-control productId" placeholder="Product" disabled value="${row.ProductId}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Modal No" disabled value="${row.ModalNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Serial No" disabled value="${row.SerialNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="barcode No" disabled value="${row.BarcodeNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Unit" disabled value="${row.Unit}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control" placeholder="No Of Products" disabled value="${row.SystemStock}"></td>
                          <td><input type="text" class="form-control manualStockInput" placeholder="No Of Products" value="${row.ManualStock}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control DiffValueInput" placeholder="Diff Values" disabled value="${row.DiffValue}"></td>
                          <td class="d-flex justify-content-center">
                            <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;">
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>`;
        $('#AuditingDyn').append(Dynstockrow);

        let totalManualStock = 0;
        $('.manualStockInput').each(function () {
            const val = parseFloat($(this).val());
            if (!isNaN(val)) {
                totalManualStock += val;
            }
        });
        $('#NoOfProducts').val(totalManualStock);

        let totalDiffValue = 0;
        $('.DiffValueInput').each(function () {
            const val = parseFloat($(this).val());
            if (!isNaN(val)) {
                totalDiffValue += val;
            }
        });
        $('#NoofDiff').val(totalDiffValue);

        let Equalvalue = totalManualStock += totalDiffValue;
        $('#TotalEqual').val(Equalvalue);

        $('#AuditingDate').val('');
        $('#BranchId').val('1');
        $('#StoreInchangeId').val('1');

        $('#ProductId').val('');
        $('#ProductId2').val('');
        $('#Unit').val('');
        $('#SystemStock').val('');
        $('#ManualStock').val('');
        $('#DiffValue').val('');

    });

    $('#AuditingClose').click(function () {
        $('#AuditingModal').hide();
    });

    $(document).on('click', '.DynrowRemove', function () {
        $(this).closest('tr').remove();
        let totalManualStock = 0;
        $('.manualStockInput').each(function () {
            const val = parseFloat($(this).val());
            if (!isNaN(val)) {
                totalManualStock += val;
            }
        });
        $('#NoOfProducts').val(totalManualStock);

        let totalDiffValue = 0;
        $('.DiffValueInput').each(function () {
            const val = parseFloat($(this).val());
            if (!isNaN(val)) {
                totalDiffValue += val;
            }
        });
        $('#NoofDiff').val(totalDiffValue);

        // Calculate the final Equalvalue
        let Equalvalue = totalManualStock + totalDiffValue;

        // Set values to inputs
        $('#TotalEqual').val(Equalvalue);
    });


    $(document).on('click', '.btn-edit', function () {
        $('#AuditingModal').show();
        $('#AuditingModalText').text('Edit Auditing');
        $('#SaveManageStock').val('Update');

        var $row = $(this).closest('tr');
        var dateText = $row.find('td:eq(0)').text().trim(); // dd-mm-yyyy
        var parts = dateText.split('-');
        var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

        var branch = $row.find('td:eq(1)').text().trim();
        var noofproducts = $row.find('td:eq(2)').text().trim();
        var systemstock = $row.find('td:eq(3)').text().trim();
        var manualstock = $row.find('td:eq(4)').text().trim();
        var differentstock = $row.find('td:eq(5)').text().trim();


        $('#AuditingDate').val(formattedDate);
        $('#BranchId').val(branch);
        $('#StoreInchangeId').val('1');

        $('#ProductId').val('Laptop');
        $('#ProductId2').val('HeadPhone');
        $('#Unit').val('10');
        $('#NoOfProducts').val(noofproducts);
        $('#SystemStock').val(systemstock);
        $('#ManualStock').val(manualstock);
        $('#DiffValue').val(differentstock);

        $('.stockRow').remove();
        $('#BranchId').val('Ganapathy').trigger('change');
    });

    $(document).on('change', '#BranchId', function () {
        $('.stockRow').remove();
        let thisval = $(this).val();
        if (thisval === 'Ganapathy') {
            for (let i = 7; i < stockRowsData.length; i++) {
                const row = stockRowsData[i];
                const Dynrow = `
                        <tr class="stockRow">
                          <td><input type="text" class="form-control productId" placeholder="Product" disabled value="${row.ProductId}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Modal No" disabled value="${row.ModalNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Serial No" disabled value="${row.SerialNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="barcode No" disabled value="${row.BarcodeNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Unit" disabled value="${row.Unit}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control" placeholder="No Of Products" disabled value="${row.SystemStock}"></td>
                          <td><input type="text" class="form-control manualStockInput" placeholder="No Of Products" value="${row.ManualStock}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control DiffValueInput" placeholder="Diff Values" disabled value="${row.DiffValue}"></td>
                          <td class="d-flex justify-content-center">
                            <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;">
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>`;
                $('#AuditingDyn').append(Dynrow);

                let totalManualStock = 0;
                $('.manualStockInput').each(function () {
                    const val = parseFloat($(this).val());
                    if (!isNaN(val)) {
                        totalManualStock += val;
                    }
                });
                $('#NoOfProducts').val(totalManualStock);

                let totalDiffValue = 0;
                $('.DiffValueInput').each(function () {
                    const val = parseFloat($(this).val());
                    if (!isNaN(val)) {
                        totalDiffValue += val;
                    }
                });
                $('#NoofDiff').val(totalDiffValue);

                let Equalvalue = totalManualStock += totalDiffValue;
                $('#TotalEqual').val(Equalvalue);
            }
        }
        else if (thisval === 'Sivananda Colony') {
            for (i = 5; i < stockRowsData.length; i++) {
                const row = stockRowsData[i];
                const Dynrow = `
                        <tr class="stockRow">
                          <td><input type="text" class="form-control productId" placeholder="Product" disabled value="${row.ProductId}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Modal No" disabled value="${row.ModalNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Serial No" disabled value="${row.SerialNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="barcode No" disabled value="${row.BarcodeNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Unit" disabled value="${row.Unit}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control" placeholder="No Of Products" disabled value="${row.SystemStock}"></td>
                          <td><input type="text" class="form-control manualStockInput" placeholder="No Of Products" value="${row.ManualStock}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control DiffValueInput" placeholder="Diff Values" disabled value="${row.DiffValue}"></td>
                          <td class="d-flex justify-content-center">
                            <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;">
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>`;
                $('#AuditingDyn').append(Dynrow);

                let totalManualStock = 0;
                $('.manualStockInput').each(function () {
                    const val = parseFloat($(this).val());
                    if (!isNaN(val)) {
                        totalManualStock += val;
                    }
                });
                $('#NoOfProducts').val(totalManualStock);

                let totalDiffValue = 0;
                $('.DiffValueInput').each(function () {
                    const val = parseFloat($(this).val());
                    if (!isNaN(val)) {
                        totalDiffValue += val;
                    }
                });
                $('#NoofDiff').val(totalDiffValue);

                let Equalvalue = totalManualStock += totalDiffValue;
                $('#TotalEqual').val(Equalvalue);
            }
        }
        else if (thisval === 'Avinashi Rd') {
            for (i = 2; i < stockRowsData.length; i++) {
                const row = stockRowsData[i];
                const Dynrow = `
                        <tr class="stockRow">
                          <td><input type="text" class="form-control productId" placeholder="Product" disabled value="${row.ProductId}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Modal No" disabled value="${row.ModalNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Serial No" disabled value="${row.SerialNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="barcode No" disabled value="${row.BarcodeNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Unit" disabled value="${row.Unit}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control" placeholder="No Of Products" disabled value="${row.SystemStock}"></td>
                          <td><input type="text" class="form-control manualStockInput" placeholder="No Of Products" value="${row.ManualStock}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control DiffValueInput" placeholder="Diff Values" disabled value="${row.DiffValue}"></td>
                          <td class="d-flex justify-content-center">
                            <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;">
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>`;
                $('#AuditingDyn').append(Dynrow);

                let totalManualStock = 0;
                $('.manualStockInput').each(function () {
                    const val = parseFloat($(this).val());
                    if (!isNaN(val)) {
                        totalManualStock += val;
                    }
                });
                $('#NoOfProducts').val(totalManualStock);

                let totalDiffValue = 0;
                $('.DiffValueInput').each(function () {
                    const val = parseFloat($(this).val());
                    if (!isNaN(val)) {
                        totalDiffValue += val;
                    }
                });
                $('#NoofDiff').val(totalDiffValue);

                let Equalvalue = totalManualStock += totalDiffValue;
                $('#TotalEqual').val(Equalvalue);
            }
        }
        else if (thisval === 'Chennai') {
            for (i = 7; i < stockRowsData.length; i++) {
                const row = stockRowsData[i];
                const Dynrow = `
                        <tr class="stockRow">
                          <td><input type="text" class="form-control productId" placeholder="Product" disabled value="${row.ProductId}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Modal No" disabled value="${row.ModalNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Serial No" disabled value="${row.SerialNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="barcode No" disabled value="${row.BarcodeNo}"></td>
                          <td><input type="text" class="form-control unitId" placeholder="Unit" disabled value="${row.Unit}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control" placeholder="No Of Products" disabled value="${row.SystemStock}"></td>
                          <td><input type="text" class="form-control manualStockInput" placeholder="No Of Products" value="${row.ManualStock}"></td>
                          <td class="manageStockFinished"><input type="text" class="form-control DiffValueInput" placeholder="Diff Values" disabled value="${row.DiffValue}"></td>
                          <td class="d-flex justify-content-center">
                            <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height: 34px;width: 34px;">
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>`;
                $('#AuditingDyn').append(Dynrow);

                let count = $('.stockRow').length;
                $('#NoOfProducts').val(count);
                $('#NoOfProducts').val(count);

                let totalDiffValue = 0;
                $('.DiffValueInput').each(function () {
                    const val = parseFloat($(this).val());
                    if (!isNaN(val)) {
                        totalDiffValue += val;
                    }
                });
                $('#NoofDiff').val(totalDiffValue);

                let Equalvalue = count += totalDiffValue;
                $('#TotalEqual').val(Equalvalue);
            }
        }
        else {
            $('#ManageStockDyn').append(Dynrow);
        }
    });
});


const stockSummaryData = [
    {
        Month: "09-10-2025",
        Branch: "Ganapathy",
        NoOfProducts: 6,
        SystemStock: 1900,
        ManualStock: 900,
        DifferentStock: 900,
        StatusColor: "success"
    },
    {
        Month: "08-10-2025",
        Branch: "Avinashi Rd",
        NoOfProducts: 5,
        SystemStock: 2300,
        ManualStock: 2100,
        DifferentStock: 200,
        StatusColor: "success"
    },
    {
        Month: "07-10-2025",
        Branch: "Sivananda Colony",
        NoOfProducts: 4,
        SystemStock: 2000,
        ManualStock: 2000,
        DifferentStock: 0,
        StatusColor: "warning"
    },
    {
        Month: "06-10-2025",
        Branch: "Ganapathy",
        NoOfProducts: 7,
        SystemStock: 1800,
        ManualStock: 2000,
        DifferentStock: -200,
        StatusColor: "danger"
    },
    {
        Month: "05-10-2025",
        Branch: "Chennai",
        NoOfProducts: 6,
        SystemStock: 1500,
        ManualStock: 1500,
        DifferentStock: 0,
        StatusColor: "warning"
    },
    {
        Month: "04-10-2025",
        Branch: "Sivananda Colony",
        NoOfProducts: 3,
        SystemStock: 1200,
        ManualStock: 1300,
        DifferentStock: -100,
        StatusColor: "danger"
    },
    {
        Month: "03-10-2025",
        Branch: "Ganapathy",
        NoOfProducts: 5,
        SystemStock: 1920,
        ManualStock: 9028,
        DifferentStock: -90,
        StatusColor: "danger"
    },
    {
        Month: "03-10-2025",
        Branch: "Avinashi Rd",
        NoOfProducts: 7,
        SystemStock: 2890,
        ManualStock: 3268,
        DifferentStock: 89,
        StatusColor: "danger"
    }
];

const stockSummaryColumns = [
    { data: 'Month', name: 'Month', title: 'Month' },
    { data: 'Branch', name: 'Branch', title: 'Branch' },
    { data: 'NoOfProducts', name: 'NoOfProducts', title: 'No Of Products' },
    { data: 'SystemStock', name: 'SystemStock', title: 'System Stock' },
    { data: 'ManualStock', name: 'ManualStock', title: 'Manual Stock' },
    { data: 'DifferentStock', name: 'DifferentStock', title: 'Different Stock' }
];


function GridShow() {
    $('#StockSummaryDynamic').empty();
    let html = `<div class="table-responsive">
                <table class="table table-striped table-bordered table-hover dataTable" id="stockSummaryTable"></table>
            </div>`;
    $('#StockSummaryDynamic').append(html);

    bindTable('stockSummaryTable', stockSummaryData, stockSummaryColumns, 6, 'Branch', '350px', true, { update: true, delete: true });
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
