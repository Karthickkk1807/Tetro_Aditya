$(document).ready(function () {

    MainGrid();

    $('#ProcessTypeId').select2({
        dropdownParent: $('#FormFabric'),
        width: '100%',
        placeholder: '--Select ProcessType--'
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
     
    $(document).on('click', '#customBtn_SaleOrderData', function () { 
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#SaleOrderCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#SaleOrderCanvas").css("width", "50%");
        } else {
            $("#SaleOrderCanvas").css("width", "39%");
        } 
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingSaleOrder();
        UnFilledData();
        $('#SaleOrderHeader').text('SaleOrder Details');
        $('#SaveSaleOrder').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });
     
    $(document).on('click', '.btn-edit', function () { 
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#SaleOrderCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#SaleOrderCanvas").css("width", "50%");
        } else {
            $("#SaleOrderCanvas").css("width", "39%");
        } 
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingSaleOrder();
        FilledData();
        $('#SaleOrderHeader').text('Edit SaleOrder Details');
        $('#SaveSaleOrder').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#SaleOrderCanvas").css("width", "0%");
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
    const SaleOrderData = [
        {
            Date: "02 Oct 2025",
            SaleNo: "SO/NO/001",
            OrderType: "Domestic",
            Client: "Classic Garments",
            FrabricType: "Cotton",
            Qty: "1200 KGS",
            ProcessType: "Dyeing, Printing",
            Status: "Draft",
            Status_Color: "#79da79"
        },
        {
            Date: "04 Oct 2025",
            SaleNo: "SO/NO/002",
            OrderType: "Export",
            Client: "StyleHub Textiles",
            FrabricType: "Polyester",
            Qty: "850 KGS",
            ProcessType: "Printing, Bleaching",
            Status: "Approved",
            Status_Color: "Blue"
        },
        {
            Date: "06 Oct 2025",
            SaleNo: "SO/NO/003",
            OrderType: "Job Work",
            Client: "Modern Wear Pvt Ltd",
            FrabricType: "Viscose",
            Qty: "950 KGS",
            ProcessType: "Dyeing, Finishing",
            Status: "Goods Inwarded",
            Status_Color: "green"
        },
        {
            Date: "08 Oct 2025",
            SaleNo: "SO/NO/004",
            OrderType: "Domestic",
            Client: "Fashion Makers",
            FrabricType: "Cotton",
            Qty: "600 KGS",
            ProcessType: "Printing, Finishing",
            Status: "Goods Inspected",
            Status_Color: "Purple"
        },
        {
            Date: "10 Oct 2025",
            SaleNo: "SO/NO/005",
            OrderType: "Export",
            Client: "Vogue Fashions",
            FrabricType: "Viscose",
            Qty: "1800 KGS",
            ProcessType: "Bleaching, Printing",
            Status: "Job Order",
            Status_Color: "#95a5a6"
        },
        {
            Date: "12 Oct 2025",
            SaleNo: "SO/NO/006",
            OrderType: "Domestic",
            Client: "NextGen Clothing",
            FrabricType: "Cotton",
            Qty: "2200 KGS",
            ProcessType: "Dyeing, Finishing",
            Status: "In-Production",
            Status_Color: "Red"
        },
        {
            Date: "15 Oct 2025",
            SaleNo: "SO/NO/007",
            OrderType: "Export",
            Client: "Royal Apparels",
            FrabricType: "Polyester",
            Qty: "1000 KGS",
            ProcessType: "Printing, Bleaching",
            Status: "Final QC",
            Status_Color: "gray"
        },
        {
            Date: "17 Oct 2025",
            SaleNo: "SO/NO/008",
            OrderType: "Job Work",
            Client: "Trendline Garments",
            FrabricType: "Viscose",
            Qty: "1300 KGS",
            ProcessType: "Dyeing, Printing",
            Status: "Outwarded",
            Status_Color: "#708090"
        },
        {
            Date: "20 Oct 2025",
            SaleNo: "SO/NO/009",
            OrderType: "Export",
            Client: "Elite Fashions",
            FrabricType: "Cotton",
            Qty: "950 KGS",
            ProcessType: "Finishing, Bleaching",
            Status: "Delivered",
            Status_Color: "Indigo"
        },
        {
            Date: "23 Oct 2025",
            SaleNo: "SO/NO/010",
            OrderType: "Domestic",
            Client: "Urban Threads",
            FrabricType: "Polyester",
            Qty: "1600 KGS",
            ProcessType: "Printing, Finishing",
            Status: "Closed",
            Status_Color: "#492db9"
        }
    ];
     
    const columns = [
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'SaleNo', name: 'Sale No', title: 'Sale Order No' },
        { data: 'OrderType', name: 'OrderType', title: 'Order Type' },
        { data: 'Client', name: 'Client', title: 'Client' },
        { data: 'FrabricType', name: 'FrabricType', title: 'Fabric Type' },
        { data: 'Qty', name: 'Qty', title: 'Qty' },
        { data: 'ProcessType', name: 'ProcessType', title: 'Process Type' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];

    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="SaleOrderData">
                </table>
            `;
    $('#MainGrid').append(html);
    bindTable('SaleOrderData', SaleOrderData, columns, 8, 'SaleOrderName', '350px', true, { update: true, delete: true });
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
 
function CanvasOpenFirstShowingSaleOrder() {
    $('#SaleOrderCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#SaleOrderCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#SaleOrderCanvas').offset().top
    }, 'fast');
    $('#ProcessTypeId').val(['']).trigger('change');
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
    $('#ProcessTypeId').val(['2', '3']).trigger('change');
    $('#NoofRolls').val('85');
    $('#GSM').val('');
    $('#Weight').val('45 KG');
    $('#Width').val('67 MM');
    $('#Colour').val('#FFFFFF'); 
    $('#LotNo').val('SKJ123');
    $('#BatchNo').val('15907');
    $('#ProcessTypeId').val('2');
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