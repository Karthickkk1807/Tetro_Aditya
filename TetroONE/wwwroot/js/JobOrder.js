$(document).ready(function () {

    MainGrid();

    $('#JobTypeId').select2({
        dropdownParent: $('#FormJobOrder'),
        width: '100%',
        placeholder: '--Select JobType--'
    }).on('select2:open', function () {
        $('.select2-container').css('z-index', 1100);
    }).trigger('change');
     
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

    $(document).on('click', '#customBtn_JobOrderData', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#JobOrderCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#JobOrderCanvas").css("width", "50%");
        } else {
            $("#JobOrderCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder();
        //UnFilledData();
        $('#ChemicalListRow').empty();
        $('#DyeListRow').empty();
        $('#BatchListRow').empty();
        duplicateRowChemical();
        duplicateRowDye();
        duplicateRowBatch();
        $('#JobOrderHeader').text('JobOrder Details');
        $('#SaveJobOrder').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#JobOrderCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#JobOrderCanvas").css("width", "50%");
        } else {
            $("#JobOrderCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder();
        //FilledData();
        $('#JobOrderHeader').text('Edit JobOrder Details');
        $('#SaveJobOrder').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#JobOrderCanvas").css("width", "0%");
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

function MainGrid() {
    const JobOrderData = [
        {
            Date: "02 Oct 2025",
            JobOrderNo: "JOB/NO/001",
            SaleOrderNo: "SO/NO/001",
            Customer: "Classic Garments Pvt Ltd",
            OrderType: "Domestic",
            JobType: "Dyeing, Printing",
            Qty: "1200 KGS",
            Priority: "Normal",
            NoOfBatches: 4,
            PreProcess: "Singeing, Desizing",
            PostProcess: "Soaping, Washing",
            ExpectedClosingDate: "05 Nov 2025",
            Status: "Draft",
            Status_Color: "#95a5a6"
        },
        {
            Date: "04 Oct 2025",
            JobOrderNo: "JOB/NO/002",
            SaleOrderNo: "SO/NO/002",
            Customer: "StyleHub Textiles",
            OrderType: "Export",
            JobType: "Finishing, Printing",
            Qty: "950 KGS",
            Priority: "Medium",
            NoOfBatches: 6,
            PreProcess: "Bleaching",
            PostProcess: "Drying & Conditioning, Finishing",
            ExpectedClosingDate: "20 Oct 2025",
            Status: "Approved",
            Status_Color: "#79da79"
        },
        {
            Date: "06 Oct 2025",
            JobOrderNo: "JOB/NO/003",
            SaleOrderNo: "SO/NO/003",
            Customer: "Modern Wear Pvt Ltd",
            OrderType: "Job Work",
            JobType: "Finishing, Embossing",
            Qty: "1400 KGS",
            Priority: "Normal",
            NoOfBatches: 7,
            PreProcess: "Desizing, Scouring, Mercerizing",
            PostProcess: "Washing, Finishing",
            ExpectedClosingDate: "08 Nov 2025",
            Status: "In-Production",
            Status_Color: "Purple"
        },
        {
            Date: "08 Oct 2025",
            JobOrderNo: "JOB/NO/004",
            SaleOrderNo: "SO/NO/004",
            Customer: "Vogue Fashions",
            OrderType: "Domestic",
            JobType: "Washing, Embossing",
            Qty: "800 KGS",
            Priority: "High",
            NoOfBatches: 5,
            PreProcess: "Singeing, Bleaching",
            PostProcess: "Soaping, Drying & Conditioning",
            ExpectedClosingDate: "02 Nov 2025",
            Status: "Final QC",
            Status_Color: "Blue"
        },
        {
            Date: "10 Oct 2025",
            JobOrderNo: "JOB/NO/005",
            SaleOrderNo: "SO/NO/005",
            Customer: "Trendline Garments",
            OrderType: "Export",
            JobType: "Embossing, Printing",
            Qty: "1800 KGS",
            Priority: "Medium",
            NoOfBatches: 8,
            PreProcess: "Mercerizing",
            PostProcess: "Washing, Neutralization",
            ExpectedClosingDate: "10 Nov 2025",
            Status: "Outwarded",
            Status_Color: "#e9634e"
        },
        {
            Date: "12 Oct 2025",
            JobOrderNo: "JOB/NO/006",
            SaleOrderNo: "SO/NO/006",
            Customer: "NextGen Clothing",
            OrderType: "Job Work",
            JobType: "Dyeing, Washing",
            Qty: "2100 KGS",
            Priority: "Normal",
            NoOfBatches: 3,
            PreProcess: "Desizing, Scouring",
            PostProcess: "Drying & Conditioning",
            ExpectedClosingDate: "14 Nov 2025",
            Status: "Delivered",
            Status_Color: "Green"
        },
        {
            Date: "14 Oct 2025",
            JobOrderNo: "JOB/NO/007",
            SaleOrderNo: "SO/NO/007",
            Customer: "Royal Apparels",
            OrderType: "Domestic",
            JobType: "Export, Printing",
            Qty: "1100 KGS",
            Priority: "High",
            NoOfBatches: 5,
            PreProcess: "Singeing, Bleaching, Mercerizing",
            PostProcess: "Washing, Finishing",
            ExpectedClosingDate: "28 Oct 2025",
            Status: "Closed",
            Status_Color: "#492db9"
        },
        {
            Date: "16 Oct 2025",
            JobOrderNo: "JOB/NO/008",
            SaleOrderNo: "SO/NO/008",
            Customer: "Elite Fashions",
            OrderType: "Export",
            JobType: "Washing, Finishing",
            Qty: "1550 KGS",
            Priority: "Medium",
            NoOfBatches: 6,
            PreProcess: "Scouring, Bleaching",
            PostProcess: "Neutralization, Drying & Conditioning",
            ExpectedClosingDate: "15 Nov 2025",
            Status: "Approved",
            Status_Color: "#79da79"
        },
        {
            Date: "18 Oct 2025",
            JobOrderNo: "JOB/NO/009",
            SaleOrderNo: "SO/NO/009",
            Customer: "Urban Threads",
            OrderType: "Job Work",
            JobType: "Dyeing, Washing",
            Qty: "1250 KGS",
            Priority: "High",
            NoOfBatches: 4,
            PreProcess: "Desizing",
            PostProcess: "Soaping, Washing, Finishing",
            ExpectedClosingDate: "25 Nov 2025",
            Status: "In-Production",
            Status_Color: "Purple"
        },
        {
            Date: "20 Oct 2025",
            JobOrderNo: "JOB/NO/010",
            SaleOrderNo: "SO/NO/010",
            Customer: "Prime Wear Industries",
            OrderType: "Domestic",
            JobType: "Dyeing, Washing",
            Qty: "1650 KGS",
            Priority: "Normal",
            NoOfBatches: 8,
            PreProcess: "Bleaching, Mercerizing",
            PostProcess: "Neutralization, Drying & Conditioning",
            ExpectedClosingDate: "02 Dec 2025",
            Status: "Final QC",
            Status_Color: "Blue"
        }
    ];

     
    const columns = [
        { data: 'Date', title: 'Date' },
        { data: 'JobOrderNo', title: 'Job Order No' },
        { data: 'SaleOrderNo', title: 'Sale Order No' },
        { data: 'Customer', title: 'Customer' },
        { data: 'OrderType', title: 'Order Type' },
        { data: 'JobType', title: 'Job Type' },
        { data: 'Qty', title: 'Qty' },
        { data: 'Priority', title: 'Priority' },
        { data: 'NoOfBatches', title: 'No Of Batches' },
        { data: 'PreProcess', title: 'Pre-Process' },
        { data: 'PostProcess', title: 'Post-Process' },
        { data: 'ExpectedClosingDate', title: 'Expected Closing Date' },
        { data: 'Status', title: 'Status' }
    ];


    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="JobOrderData">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('JobOrderData', JobOrderData, columns, 13, 'Date', '360px', true, { update: true, delete: true });
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
    const PriorityColumnIndex = columns.findIndex(col => col.data === 'Priority');

    const renderColumn = [];

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
     
    if (PriorityColumnIndex !== -1) {
        renderColumn.push({
            targets: PriorityColumnIndex,
            render: function (data, type, row) {
                if (type === 'display') {
                    let color = '';
                    switch (data?.toLowerCase()) {
                        case 'high':
                            color = 'red';
                            break;
                        case 'medium':
                            color = 'orange';
                            break;
                        case 'normal':
                            color = 'green';
                            break;
                        default:
                            color = 'black';
                    }
                    return `<span style="color:${color};font-weight:600;">${data}</span>`;
                }
                return data;
            }
        });
    }

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

    setTimeout(function () {
        const table1 = $('#' + tableid).DataTable();
        if (window.Common && Common.autoAdjustColumns) {
            Common.autoAdjustColumns(table1);
        }
    }, 100);
}

function CanvasOpenFirstShowingJobOrder() {
    $('#JobOrderCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#JobOrderCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#JobOrderCanvas').offset().top
    }, 'fast'); 
}

function FilledData() {
    $('#SaleOrderNo').val('SO/NO/001');
    $('#OrderDate').val('2025-10-22');
    $('#OrderTypeId').val('2');
    $('#ClientId').val('2');
    $('#ClientPONO').val('CL/PO/001');
    $('#BillingAddress').val('123, ABC Street Erode');
    $('#DeliveryAddress').val('24/AD, ZYX Street Erode');
    $('#ExpDeliveryDate').val('2025-12-30');
    $('#ModeOfDispatchId').val('2');
    $('#OrderStatusId').val('3');
    $('#FabricTypeId').val('2'); 
    $('#NoofRolls').val('85');
    $('#GSM').val('');
    $('#Weight').val('45 KG');
    $('#Width').val('67 MM');
    $('#Colour').val('#FFFFFF');
    $('#LotNo').val('SKJ123');
    $('#BatchNo').val('15907'); 
    $('#ChemicalTreatment').prop('checked', true);
    $('#WeightUnitId').val('3');
    $('#WidthUnitId').val('4');
    $('#Tolerance').val('35.89 %');
    $('#Singeing, #Scouring, #Bleaching, #Soaping, #Washing, #Conditioning').prop('checked', true);
}

function UnFilledData() {
    $("#FormSaleOrder")[0].reset();
    $("#FormFabric")[0].reset();
    $("#FormProcesingData")[0].reset();
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

function duplicateRowDye() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfDye').length
    if (rowadd < 3) {
        var htmlRow = `
        <div class="row RowOfDye">
            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                <div class="form-group">
                    <label>Dyes Used<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control" placeholder="Ex: Blue H2R" id="DyesUsed${numberIncr}" name="DyesUsed${numberIncr}" />
                </div>
            </div>
            <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                <div class="form-group">
                    <label>Volume%<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control" placeholder="Ex: 15.6" id="Volume${numberIncr}" name="Volume${numberIncr} " />
                </div>
            </div> 
            <div class="col-md-3 col-lg-2 col-sm-6 col-6 pr-0">
                <div class="form-group">
                    <label>Qty<span id="Asterisk">*</span></label>
                   <input type="text" class="form-control" placeholder="Ex: 17" id="DyeQty${numberIncr}" name="DyeQty${numberIncr}" />
                </div>
            </div>
            <div class="col-lg-2 col-md-1 col-sm-3 col-3 thiswillshow">
                <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                    <button id="RemoveButton" class="btn DynrowRemove RowOfDyeRemove" type="button" onclick="removeRow(this)"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
           `;
    }
    $('#DyeListRow').append(htmlRow);
}

function duplicateRowBatch() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.Clientcontact').length
    var htmlRow = `
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Production Start Date</label>
                    <input type="date" class="form-control" id="ProductionStartDate${numberIncr}" name="ProductionStartDate${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Production End Date</label>
                    <input type="date" class="form-control" id="ProductionEndDate${numberIncr}" name="ProductionEndDate${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Loading Start Date</label>
                    <input type="date" class="form-control" id="LoadingStartDate${numberIncr}" name="LoadingStartDate${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Loading Start Date</label>
                    <input type="date" class="form-control" id="LoadingEndDate${numberIncr}" name="LoadingEndDate${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Operator Name</label>
                    <input type="text" class="form-control" id="OperatorName${numberIncr}" name="OperatorName${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Supervisor Name</label>
                    <input type="text" class="form-control" id="SupervisorName${numberIncr}" name="SupervisorName${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Shift</label>
                    <input type="text" class="form-control" id="Shift${numberIncr}" name="Shift${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Output Lot No</label>
                    <input type="text" class="form-control" id="OutputLotNo${numberIncr}" name="OutputLotNo${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Output Quantity</label>
                    <input type="text" class="form-control" id="OutputQuantity${numberIncr}" name="OutputQuantity${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Rework Quantity</label>
                    <input type="text" class="form-control" id="ReworkQuantity${numberIncr}" name="ReworkQuantity${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Wastage Quantity</label>
                    <input type="text" class="form-control" id="WastageQuantity${numberIncr}" name="WastageQuantity${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Energy Consumption</label>
                    <input type="text" class="form-control" id="EnergyConsumption${numberIncr}" name="EnergyConsumption${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Water Consumption</label>
                    <input type="text" class="form-control" id="WaterConsumption${numberIncr}" name="WaterConsumption${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Chemical Cost</label>
                    <input type="text" class="form-control" id="ChemicalCost${numberIncr}" name="ChemicalCost${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Labor Hours</label>
                    <input type="datetime" class="form-control" id="LaborHours${numberIncr}" name="LaborHours${numberIncr}" />
                </div>
            </div>
           `;

    $('#BatchListRow').append(htmlRow);
} 

$(document).on('click', '.RowOfChemicalRemove', function () {
    var totalRows = $('#ChemicalListRow .RowOfChemical').length; 
    if (totalRows > 1) {
        $(this).closest('.RowOfChemical').remove();
    }
});

$(document).on('click', '.RowOfDyeRemove', function () {
    var totalRows = $('#DyeListRow .RowOfDye').length;
    if (totalRows > 1) {
        $(this).closest('.RowOfDye').remove();
    }
});