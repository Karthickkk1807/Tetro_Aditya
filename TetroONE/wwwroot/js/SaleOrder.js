$(document).ready(function () {

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

    const SaleOrderData = [
        {
            SaleOrderName: "JOB_1 : Full Stack Developer",
            JobCategory: "Full Stack Developer",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 Jan 2025",
            ExpiryDate: "10 Mar 2025",
            TotalHired: "16", 
            Status: "Approved",
            Status_Color: "#28a745",
            IsHot: false
        },
        {
            SaleOrderName: "JOB_2 : Software Engineer",
            JobCategory: "Software Engineer",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "21 Jan 2025",
            ExpiryDate: "10 Feb 2025",
            TotalHired: "10", 
            Status: "Open",
            Status_Color: "#007bff",
            IsHot: false
        },
        {
            SaleOrderName: "JOB_3 : Cloud Engineer",
            JobCategory: "Cloud Engineer",
            JobPostType: "External",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 Feb 2025",
            ExpiryDate: "10 Mar 2025",
            TotalHired: "20", 
            Status: "Draft",
            Status_Color: "#6c757d",
            IsHot: false
        },
        {
            SaleOrderName: "JOB_4 : Security Analyst",
            JobCategory: "Security Analyst",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "01 Apr 2025",
            ExpiryDate: "08 May 2025",
            TotalHired: "19", 
            Status: "Closed",
            Status_Color: "#dc3545",
            IsHot: false
        },
        {
            SaleOrderName: "JOB_5 : Data Engineer",
            JobCategory: "Data Engineer",
            JobPostType: "External",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "05 Jun 2025",
            ExpiryDate: "10 Aug 2025",
            TotalHired: "12", 
            Status: "On-Hold",
            Status_Color: "#ffc107",
            IsHot: false
        },
        {
            SaleOrderName: "JOB_6 : IT Support Specialist",
            JobCategory: "IT Support Specialist",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 July 2025",
            ExpiryDate: "10 Sep 2025",
            TotalHired: "38", 
            Status: "Approved",
            Status_Color: "#28a745",
            IsHot: false
        },
        {
            SaleOrderName: "JOB_7 : Technical Project Manager",
            JobCategory: "Technical Project Manager",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 Aug 2025",
            ExpiryDate: "10 Oct 2025",
            TotalHired: "43", 
            Status: "Open",
            Status_Color: "#007bff",
            IsHot: false
        },
        {
            SaleOrderName: "JOB_8 : Network Engineer",
            JobCategory: "Network Engineer",
            JobPostType: "External",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 Oct 2025",
            ExpiryDate: "10 Nov 2025",
            TotalHired: "17", 
            Status: "Draft",
            Status_Color: "#6c757d",
            IsHot: false
        }
    ];

    const columns = [
        { data: 'SaleOrderName', name: 'SaleOrderName', title: 'SaleOrderName' },
        { data: 'JobCategory', name: 'JobCategory', title: 'Job Category' },
        { data: 'JobPostType', name: 'JobPostType', title: 'Job Post Type' },
        { data: 'HiringLocation', name: 'HiringLocation', title: 'Hiring Location' },
        { data: 'OpeningDate', name: 'OpeningDate', title: 'Opening Date' },
        { data: 'ExpiryDate', name: 'ExpiryDate', title: 'Expiry Date' },
        { data: 'TotalHired', name: 'TotalHired', title: 'Total Hired' },  
        { data: 'Status', name: 'Status', title: 'Status' }
    ];

    $('#MainGrid').empty('');
    var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="SaleOrderData">
                </table>
            `;
    $('#MainGrid').append(html);
    //bindTable('SaleOrderData', SaleOrderData, columns, 8, 'SaleOrderName', '350px', true, { update: true, delete: true });
});
 
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