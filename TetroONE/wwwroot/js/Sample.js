$(document).ready(function () {
    MainGridData();
    $('.mydatetimepicker').mdtimepicker();

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
        $('#ChemicalListRow').empty();
        duplicateRowChemical();
        $('#SaveSample').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
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
        $('#SampleHeader').text('Edit Production Details');
        $('#ChemicalListRow').empty();
        duplicateRowChemical();
        $('#SaveSample').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
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
});

function CanvasOpenFirstShowingProduction() {
    $('#SampleCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2').collapse('hide');
    $('#SampleCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#SampleCanvas').offset().top
    }, 'fast');
}
 
function duplicateRowChemical() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfChemical').length
    if (rowadd < 3) {
        var htmlRow = `
            <div class="row RowOfChemical">
                <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Chemical Used<span id="Asterisk">*</span></label>
                        <select class="form-control" id="ChemicalUsed${numberIncr}" name="ChemicalUsed${numberIncr}" required>
                            <option value="">--Select--</option>
                            <option value="1">Sodium Sulphate</option>
                            <option value="2">CO2</option>
                            <option value="3">Sulphate</option>
                            <option value="4">H2O</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                    <div class="form-group">
                        <label>GPL%<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" />
                    </div>
                </div>
                <div class="col-md-3 col-lg-2 col-sm-6 col-6 pr-0">
                    <div class="form-group">
                        <label>Qty<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control" placeholder="Ex: 0" id="Qty${numberIncr}" name="Qty${numberIncr}" />
                    </div>
                </div>
                <div class="col-lg-2 col-md-1 col-sm-3 col-3 thiswillshow">
                    <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                        <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemove" type="button" onclick="removeRow(this)"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
           `;
    }
    $('#ChemicalListRow').append(htmlRow);
}

$(document).on('click', '.RowOfChemicalRemove', function () {
    var totalRows = $('#ChemicalListRow .RowOfChemical').length;
    if (totalRows > 1) {
        $(this).closest('.RowOfChemical').remove();
    }
});

function MainGridData() { 
    const SampleData = [
        {
            Date: "02 Oct 2025",
            SampleNo: "SAM/NO/001",
            SampleName: "Fit Sample",
            SaleOrderNo: "SALE/NO/001",
            Customer: "H&M Group",
            FabricType: "Cotton",
            MachineType: "Jet Dyeing",
            ApprovedBy: "",
            Status: "Draft",
            Status_Color: "#fd7e14" // Orange
        },
        {
            Date: "04 Oct 2025",
            SampleNo: "SAM/NO/002",
            SampleName: "Size Set",
            SaleOrderNo: "SALE/NO/002",
            Customer: "Nike",
            FabricType: "Blended",
            MachineType: "Winch",
            ApprovedBy: "KAVINESH RAJASEKAR",
            Status: "Approved",
            Status_Color: "#6f42c1" // Purple
        },
        {
            Date: "06 Oct 2025",
            SampleNo: "SAM/NO/003",
            SampleName: "Pattern Sample",
            SaleOrderNo: "SALE/NO/003",
            Customer: "Zara (Inditex)",
            FabricType: "Polyester",
            MachineType: "Pad-Dry",
            ApprovedBy: "",
            Status: "Cancelled",
            Status_Color: "#dc3545" // Red
        },
        {
            Date: "09 Oct 2025",
            SampleNo: "SAM/NO/004",
            SampleName: "Production Sample",
            SaleOrderNo: "SALE/NO/004",
            Customer: "Arvind Limited",
            FabricType: "Cotton",
            MachineType: "Jet Dyeing",
            ApprovedBy: "MITHRAN",
            Status: "Approved",
            Status_Color: "#6f42c1"
        },
        {
            Date: "12 Oct 2025",
            SampleNo: "SAM/NO/005",
            SampleName: "Shipment Sample",
            SaleOrderNo: "SALE/NO/005",
            Customer: "Raymond Ltd",
            FabricType: "Blended",
            MachineType: "Winch",
            ApprovedBy: "",
            Status: "Draft",
            Status_Color: "#fd7e14"
        },
        {
            Date: "15 Oct 2025",
            SampleNo: "SAM/NO/006",
            SampleName: "Salesman Sample",
            SaleOrderNo: "SALE/NO/006",
            Customer: "Gokaldas Exports Ltd",
            FabricType: "Cotton",
            MachineType: "Pad-Dry",
            ApprovedBy: "DEXY",
            Status: "Approved",
            Status_Color: "#6f42c1"
        },
        {
            Date: "18 Oct 2025",
            SampleNo: "SAM/NO/007",
            SampleName: "Lab Dip",
            SaleOrderNo: "SALE/NO/007",
            Customer: "RPKS & CO",
            FabricType: "Polyester",
            MachineType: "Jet Dyeing",
            ApprovedBy: "",
            Status: "Cancelled",
            Status_Color: "#dc3545"
        },
        {
            Date: "21 Oct 2025",
            SampleNo: "SAM/NO/008",
            SampleName: "Fabric Sample",
            SaleOrderNo: "SALE/NO/008",
            Customer: "RM CHEMICAL",
            FabricType: "Blended",
            MachineType: "Winch",
            ApprovedBy: "INDRASENAN",
            Status: "Approved",
            Status_Color: "#6f42c1"
        },
        {
            Date: "23 Oct 2025",
            SampleNo: "SAM/NO/009",
            SampleName: "Design / Development Sample",
            SaleOrderNo: "SALE/NO/009",
            Customer: "Pothys",
            FabricType: "Cotton",
            MachineType: "Jet Dyeing",
            ApprovedBy: "",
            Status: "Draft",
            Status_Color: "#fd7e14"
        },
        {
            Date: "25 Oct 2025",
            SampleNo: "SAM/NO/010",
            SampleName: "Photo / Shoot Sample",
            SaleOrderNo: "SALE/NO/010",
            Customer: "Shahi Exports",
            FabricType: "Blended",
            MachineType: "Pad-Dry",
            ApprovedBy: "KARTHIKEYANI",
            Status: "Approved",
            Status_Color: "#6f42c1"
        },
        {
            Date: "27 Oct 2025",
            SampleNo: "SAM/NO/011",
            SampleName: "Sealing Sample",
            SaleOrderNo: "SALE/NO/011",
            Customer: "Page Industries",
            FabricType: "Polyester",
            MachineType: "Winch",
            ApprovedBy: "",
            Status: "Draft",
            Status_Color: "#fd7e14"
        }
    ];
     
    const sampleColumns = [
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'SampleNo', name: 'SampleNo', title: 'Sample No' },
        { data: 'SampleName', name: 'SampleName', title: 'Sample Name' },
        { data: 'SaleOrderNo', name: 'SaleOrderNo', title: 'Sale Order No' },
        { data: 'Customer', name: 'Customer', title: 'Customer' },
        { data: 'FabricType', name: 'FabricType', title: 'Fabric Type' },
        { data: 'MachineType', name: 'MachineType', title: 'Machine Type' },
        { data: 'ApprovedBy', name: 'ApprovedBy', title: 'Approved By' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];


    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="SampleTable">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('SampleTable', SampleData, sampleColumns, 9, 'Date', '350px', true, { update: true, delete: true });
}

function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {

    if ($('#' + tableid).length && $.fn.DataTable.isDataTable('#' + tableid)) {
        try {
            $('#' + tableid).DataTable().destroy();
        } catch (error) {
            console.error('DataTable destroy error:', error);
            return;
        }
    }

    $('#' + tableid).empty();

    const StatusColumnIndex = columns.findIndex(col => col.data === 'Status');
    const LocationColumnIndex = columns.findIndex(col => col.data === 'HiringLocation');
    const SourcesColumnIndex = columns.findIndex(col => col.data === 'Sources');

    const renderColumn = [];

    // Status rendering with color badge
    if (StatusColumnIndex !== -1) {
        renderColumn.push({
            targets: StatusColumnIndex,
            render: function (data, type, row) {
                if (type === 'display' && row.Status_Color) {
                    return `
                        <div>
                            <span class="ana-span badge text-white" 
                                  style="background:${row.Status_Color};width: 115px;font-size: 12px;height: 23px;">
                                ${row.Status}
                            </span>
                        </div>`;
                }
                return data;
            }
        });
    }

    // Hiring Location with red dot if hot
    if (LocationColumnIndex !== -1) {
        renderColumn.push({
            targets: LocationColumnIndex,
            render: function (data, type, row) {
                if (type === 'display') {
                    const hotDot = row.IsHot ? '<span style="color:red;font-size:20px;">•</span> ' : '';
                    return hotDot + data;
                }
                return data;
            }
        });
    }

    // Add action buttons column
    if (isAction && (access.update || access.delete)) {
        columns.push({
            data: "Action", name: "Action", title: "Action", orderable: false
        });

        renderColumn.push({
            targets: actionTarget,
            render: function (data, type, row) {
                let html = '';
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

    const hasValidData = data.length > 0 && Object.values(data[0]).some(v => v !== null);

    const lang = $(window).width() <= 575 ? {
        "paginate": {
            "next": ">",
            "previous": "<"
        }
    } : {};

    const table = $('#' + tableid).DataTable({
        dom: "Bfrtip",
        bDestroy: true,
        responsive: true,
        data: data,
        columns: columns,
        scrollY: scrollpx,
        sScrollX: "100%",
        scrollCollapse: true,
        aaSorting: [],
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
        columnDefs: renderColumn
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    // Auto adjust columns after small delay
    setTimeout(function () {
        const table1 = $('#' + tableid).DataTable();
        if (window.Common && Common.autoAdjustColumns) {
            Common.autoAdjustColumns(table1);
        }
    }, 100);
}

