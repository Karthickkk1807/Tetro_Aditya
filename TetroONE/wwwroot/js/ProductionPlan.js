$(document).ready(function () {

    MainGridData();

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

    $(document).on('click', '#AddProductionPlan', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#ProductionPlanCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#ProductionPlanCanvas").css("width", "50%");
        } else {
            $("#ProductionPlanCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingProductionPlan();
        $('.BatchDynamic').remove();
        duplicateRowProductionPlan();
        $("#FormProductionPlan")[0].reset();
        $('#ProductionPlanHeader').text('ProductionPlan Details');
        $('#SaveProductionPlan').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#ProductionPlanCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#ProductionPlanCanvas").css("width", "50%");
        } else {
            $("#ProductionPlanCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingProductionPlan();
        $('.BatchDynamic').remove();
        duplicateRowProductionPlan();
        $('#ProductionPlanHeader').text('Edit ProductionPlan Details');
        $('#SaveProductionPlan').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#ProductionPlanCanvas").css("width", "0%");
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

function duplicateRowProductionPlan() {
    let unique = Math.random().toString(36).substring(2);
    var rowadd = $('.BatchDynamic').length;
    var DynamicLableNo = rowadd + 1;
    if (rowadd < 3) {
        var html = `
            <div class="row BatchDynamic">
                <div class="col-lg-7 col-md-7 col-sm-7 col-7 mt-2 d-flex flex-column mb-2">
                    <label class="DynamicLable">Batch No ${DynamicLableNo}</label>
                </div>
                <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Batch No<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control BatchNo" placeholder="Ex: BATCH/001" id="BatchNo${unique}" name="BatchNo${unique}" maxlength="50" required disabled />
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Date<span id="Asterisk">*</span></label>
                        <input type="date" class="form-control Date" id="Date${unique}" name="Date${unique}" />
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Fabric Type<span id="Asterisk">*</span></label>
                        <select class="form-control FabricTypeId" id="FabricTypeId${unique}" name="FabricTypeId${unique}" required>
                            <option value="">--Select--</option>
                            <option value="1">Cotton</option>
                            <option value="2" selected>Polyester</option>
                            <option value="3">Blend</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>GSM<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control GSM1" placeholder="Ex: 200 GSM" id="GSM${unique}" name="GSM${unique}" required />
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Lot No<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control LotNo" placeholder="Ex: SKJ123" id="LotNo${unique}" name="LotNo${unique}" required />
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Shade<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control ShadeColor" placeholder="Ex: SkyBlue" id="ShadeColor${unique}" name="ShadeColor${unique}" required />
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Batch Size<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control BatchSize" placeholder="Ex: 200 KG" id="BatchSize${unique}" name="BatchSize${unique}" required />
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Recipe No<span id="Asterisk">*</span></label> 
                        <select class="form-control RecipeNo" id="RecipeNo${unique}" name="RecipeNo${unique}" required>
                            <option value="">--Select--</option>
                            <option value="1">REC/NO/001</option>
                            <option value="2">REC/NO/002</option>
                            <option value="3">REC/NO/003</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Process Stage<span id="Asterisk">*</span></label>
                        <select class="form-control ProcessStage" id="ProcessStage${unique}" name="ProcessStage${unique}">
                            <option value="">--Select--</option>
                            <option value="1">Pre-treatment</option>
                            <option value="2">Dyeing</option>
                            <option value="3">Finishing</option>
                            <option value="4">Packing</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Machine<span id="Asterisk">*</span></label>
                        <select class="form-control MachineType" id="MachineType${unique}" name="MachineType${unique}">
                            <option value="">--Select--</option>
                            <option value="1">Jet</option>
                            <option value="2">Jigger</option>
                            <option value="3">Rotary</option>
                            <option value="4">Stenter</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Start Time<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control mydatetimepicker StartTime" id="StartTime${unique}" name="StartTime${unique}" placeholder="Start Time" style="background-color: #ffffff;" readonly>
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>End Time<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control mydatetimepicker EndTime" id="EndTime${unique}" name="EndTime${unique}" placeholder="End Time" style="background-color: #ffffff;" readonly>
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Output<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control Output" id="Output${unique}" name="Output${unique}" placeholder="Ex: 340 KG">
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Status<span id="Asterisk">*</span></label>
                        <select class="form-control StatusType" id="StatusType${unique}" name="StatusType${unique}">
                            <option value="">--Select--</option>
                            <option value="1">Planned</option>
                            <option value="2">In-Progress</option>
                            <option value="3">Completed</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Operator<span id="Asterisk">*</span></label>
                        <select class="form-control Operator" id="Operator${unique}" name="Operator${unique}">
                            <option value="">--Select--</option>
                            <option value="1">RAGHURAMAN GOBINATHAN</option>
                            <option value="2">KARTHIKEYANI</option>
                            <option value="3">MITHRAN</option>
                            <option value="6">DEXY</option>
                            <option value="34">INDRASENAN</option>
                            <option value="109">KAVINESH RAJASEKAR</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-10 col-lg-10 col-sm-6 col-6">
                    <div class="form-group">
                        <label>Remarks<span id="Asterisk">*</span></label>
                        <textarea class="form-control Remarks" id="Remarks${unique}" name="Remarks${unique}" rows="1" oninput="Common.allowAllCharacters(this,250)" placeholder="Ex: Querys"></textarea>
                    </div>
                </div>
                <div class="col-lg-2 col-md-1 col-sm-3 col-3 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'}"> 
                    <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                        <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;
        $('#DynamicBatchBinding').append(html);
        $('.mydatetimepicker').mdtimepicker();
        updateRemoveButtons();
    }
}

function updateRowLabels() {
    $('.BatchDynamic').each(function (index) {
        $(this).find('.DynamicLable').text('Batch No ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.BatchDynamic');
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
    var totalRows = $('.BatchDynamic').length;
    if (totalRows > 1) {
        $(button).closest('.BatchDynamic').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
}

function CanvasOpenFirstShowingProductionPlan() {
    $('#ProductionPlanCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#ProductionPlanCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#ProductionPlanCanvas').offset().top
    }, 'fast');
}

function MainGridData() {

    const ProductionPlanData = [
        {
            Date: "01 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/001",
            JobOrderNo: "JOB/NO/001",
            Priority: "Normal",
            NoOfBatch: 3,
            PlannedBy: "Sathasivam",
            ApprovedBy: "-",
            Status: "Draft",
            Status_Color: "#fd7e14" // Orange
        },
        {
            Date: "03 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/002",
            JobOrderNo: "JOB/NO/002",
            Priority: "Medium",
            NoOfBatch: 5,
            PlannedBy: "Sowmiya",
            ApprovedBy: "KAVINESH RAJASEKAR",
            Status: "Approved",
            Status_Color: "#6f42c1" // Purple
        },
        {
            Date: "05 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/003",
            JobOrderNo: "JOB/NO/003",
            Priority: "High",
            NoOfBatch: 7,
            PlannedBy: "Sathasivam",
            ApprovedBy: "-",
            Status: "Cancelled",
            Status_Color: "#dc3545" // Red
        },
        {
            Date: "07 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/004",
            JobOrderNo: "JOB/NO/004",
            Priority: "Medium",
            NoOfBatch: 6,
            PlannedBy: "Vijay",
            ApprovedBy: "MITHRAN",
            Status: "Approved",
            Status_Color: "#6f42c1"
        },
        {
            Date: "10 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/005",
            JobOrderNo: "JOB/NO/005",
            Priority: "Normal",
            NoOfBatch: 4,
            PlannedBy: "Anitha",
            ApprovedBy: "-",
            Status: "Draft",
            Status_Color: "#fd7e14"
        },
        {
            Date: "13 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/006",
            JobOrderNo: "JOB/NO/006",
            Priority: "High",
            NoOfBatch: 8,
            PlannedBy: "Meena",
            ApprovedBy: "DEXY",
            Status: "Approved",
            Status_Color: "#6f42c1"
        },
        {
            Date: "17 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/007",
            JobOrderNo: "JOB/NO/007",
            Priority: "Medium",
            NoOfBatch: 2,
            PlannedBy: "Raghavan",
            ApprovedBy: "-",
            Status: "Cancelled",
            Status_Color: "#dc3545"
        },
        {
            Date: "20 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/008",
            JobOrderNo: "JOB/NO/008",
            Priority: "Normal",
            NoOfBatch: 5,
            PlannedBy: "Nirmala",
            ApprovedBy: "INDRASENAN",
            Status: "Approved",
            Status_Color: "#6f42c1"
        },
        {
            Date: "23 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/009",
            JobOrderNo: "JOB/NO/009",
            Priority: "High",
            NoOfBatch: 4,
            PlannedBy: "Harini",
            ApprovedBy: "-",
            Status: "Draft",
            Status_Color: "#fd7e14"
        },
        {
            Date: "25 Oct 2025",
            ProductionPlanNo: "PRO/PLAN/010",
            JobOrderNo: "JOB/NO/010",
            Priority: "Medium",
            NoOfBatch: 6,
            PlannedBy: "Jayanti",
            ApprovedBy: "KARTHIKEYANI",
            Status: "Approved",
            Status_Color: "#6f42c1"
        }
    ];

    const productionPlanColumns = [
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'ProductionPlanNo', name: 'ProductionPlanNo', title: 'ProductionPlan No' },
        { data: 'JobOrderNo', name: 'JobOrderNo', title: 'Job Order No' },
        { data: 'Priority', name: 'Priority', title: 'Priority' },
        { data: 'NoOfBatch', name: 'NoOfBatch', title: 'No Of Batch' },
        { data: 'PlannedBy', name: 'PlannedBy', title: 'Planned By' },
        { data: 'ApprovedBy', name: 'ApprovedBy', title: 'Approved By' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];

    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="ProductionPlanTable">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('ProductionPlanTable', ProductionPlanData, productionPlanColumns, 8, 'Date', '350px', true, { update: true, delete: true });
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