$(document).ready(function () {
    $('.dynamicOffbtn').hide();
    $('.dynamicOnbtn').show();
    $('.dynamicPerviewbtn').show();

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

    const jobData = [
        {
            JobName: "JOB_1 : Full Stack Developer",
            JobCategory: "Full Stack Developer",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 Jan 2025",
            ExpiryDate: "10 Mar 2025",
            TotalHired: "16",
            Sources: ["LinkedIn", "Indeed"],
            Status: "Approved",
            Status_Color: "#28a745",
            IsHot: false
        },
        {
            JobName: "JOB_2 : Software Engineer",
            JobCategory: "Software Engineer",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "21 Jan 2025",
            ExpiryDate: "10 Feb 2025",
            TotalHired: "10",
            Sources: ["LinkedIn", "Indeed"],
            Status: "Open",
            Status_Color: "#007bff",
            IsHot: false
        },
        {
            JobName: "JOB_3 : Cloud Engineer",
            JobCategory: "Cloud Engineer",
            JobPostType: "External",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 Feb 2025",
            ExpiryDate: "10 Mar 2025",
            TotalHired: "20",
            Sources: ["Website"],
            Status: "Draft",
            Status_Color: "#6c757d",
            IsHot: false
        },
        {
            JobName: "JOB_4 : Security Analyst",
            JobCategory: "Security Analyst",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "01 Apr 2025",
            ExpiryDate: "08 May 2025",
            TotalHired: "19",
            Sources: ["LinkedIn", "Naukri"],
            Status: "Closed",
            Status_Color: "#dc3545",
            IsHot: false
        },
        {
            JobName: "JOB_5 : Data Engineer",
            JobCategory: "Data Engineer",
            JobPostType: "External",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "05 Jun 2025",
            ExpiryDate: "10 Aug 2025",
            TotalHired: "12",
            Sources: ["LinkedIn"],
            Status: "On-Hold",
            Status_Color: "#ffc107",
            IsHot: false
        },
        {
            JobName: "JOB_6 : IT Support Specialist",
            JobCategory: "IT Support Specialist",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 July 2025",
            ExpiryDate: "10 Sep 2025",
            TotalHired: "38",
            Sources: ["Indeed", "Website"],
            Status: "Approved",
            Status_Color: "#28a745",
            IsHot: false
        },
        {
            JobName: "JOB_7 : Technical Project Manager",
            JobCategory: "Technical Project Manager",
            JobPostType: "Internal",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 Aug 2025",
            ExpiryDate: "10 Oct 2025",
            TotalHired: "43",
            Sources: ["Naukri"],
            Status: "Open",
            Status_Color: "#007bff",
            IsHot: false
        },
        {
            JobName: "JOB_8 : Network Engineer",
            JobCategory: "Network Engineer",
            JobPostType: "External",
            HiringLocation: "India – HO_Coimbatore",
            OpeningDate: "16 Oct 2025",
            ExpiryDate: "10 Nov 2025",
            TotalHired: "17",
            Sources: ["Website", "Naukri"],
            Status: "Draft",
            Status_Color: "#6c757d",
            IsHot: false
        }
    ];

    const columns = [
        { data: 'JobName', name: 'JobName', title: 'Job Name' },
        { data: 'JobCategory', name: 'JobCategory', title: 'Job Category' },
        { data: 'JobPostType', name: 'JobPostType', title: 'Job Post Type' },
        { data: 'HiringLocation', name: 'HiringLocation', title: 'Hiring Location' },
        { data: 'OpeningDate', name: 'OpeningDate', title: 'Opening Date' },
        { data: 'ExpiryDate', name: 'ExpiryDate', title: 'Expiry Date' },
        { data: 'TotalHired', name: 'TotalHired', title: 'Total Hired' },
        { data: 'Sources', name: 'Sources', title: 'Source' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];

    $(document).on('click', '#AddJob', function () {
        $(".offcanvas-container").css("width", "0%");
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#JobCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#JobCanvas").css("width", "50%");
        } else {
            $("#JobCanvas").css("width", "39%");
        }
        $('#JobHeader').text('Add Job Details');
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowing();
        $('.dynamicPipeLineInfo').remove();
        DynamicPipeLines();
        $('.dynamicOffbtn').hide();
        $('.dynamicOnbtn').show();
        $('.dynamicPerviewbtn').show(); 
        $('#SaveJobPost').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '#CloseDescriptionCanvas', function () {
        $(".offcanvas-container").css("width", "0%");
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#JobCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#JobCanvas").css("width", "50%");
        } else {
            $("#JobCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
    });

    $(document).on('click', '.dynamicPerviewbtn', function () {
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#JobDescriptionCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#JobDescriptionCanvas").css("width", "50%");
        } else {
            $("#JobDescriptionCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        var titleText = $(this).closest('.card-body').find('.card-title').text().trim();
        $('#JobDescriptionHeader').text(`${titleText} Job Post Preview`);
    });

    $(document).on('click', '#PreviewJobPost', function () {
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#JobPreviewCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#JobPreviewCanvas").css("width", "50%");
        } else {
            $("#JobPreviewCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay'); 
    });

    $(document).on('click', '#CloseCanvas', function () {
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('click', '.closeDynamic', function () {
        if ($('.dynamicPipeLineInfo').length > 1) {
            $(this).closest('.dynamicPipeLineInfo').remove();
        }
    });

    $(document).on('click', '.plusDynamic', function () {
        DynamicPipeLines();
    });
     
    $(document).on('click', '#SaveJobPost', function () {
        var JobHeader = $('#JobHeader').text();
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        if (JobHeader == "Add Job Details") {
            Common.successMsg("Job Added Successfully.");
        } else {
            Common.successMsg("Updated Job Successfully.");
        }
    });

    $(document).on('click', '.dynamicOnbtn', function () {
        const $cardBody = $(this).closest('.card-body');
        $(this).hide();

        $cardBody.find('.dynamicOffbtn').show();
        $cardBody.find('.dynamicPerviewbtn').hide();
    });

    $(document).on('click', '.dynamicOffbtn', function () {
        const $cardBody = $(this).closest('.card-body');
        $(this).hide();

        $cardBody.find('.dynamicPerviewbtn').show();
        $cardBody.find('.dynamicOnbtn').show();
    });

    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });

    $(document).on('click', '.btn-edit', function () {
        $(".offcanvas-container").css("width", "0%");
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#JobCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#JobCanvas").css("width", "50%");
        } else {
            $("#JobCanvas").css("width", "39%");
        }
        $('#JobHeader').text('Edit Job Details');
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowing();
        $('.dynamicPipeLineInfo').remove();
        DynamicPipeLines();
        $('#SaveJobPost').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    }); 

    $('#JobDynamic').empty('');
    var html = `<div class="table-responsive">
                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="jobTable"></table>
                </div>`;
    $('#JobDynamic').append(html);
    bindTable('jobTable', jobData, columns, 9, 'JobName', '350px', true, { update: true, delete: true });
});


function DynamicPipeLines() {
    let numberIncr = Math.random().toString(36).substring(2);

    var html = `
        <div class="row dynamicPipeLineInfo" id="dynamicPipeLineInfo">
            <div class="col-md-6 col-lg-2 col-sm-6 col-6 pr-1">
                <div class="form-group">
                    <label>Level</label>
                    <input type="text" class="form-control Level" placeholder="Level 1" id="Level${numberIncr}" name="Level${numberIncr}" maxlength="50" required disabled/>
                </div>
            </div>
            <div class="col-md-6 col-lg-4 col-sm-6 col-6">
                <div class="form-group">
                    <label>Level Name<span id="Asterisk">*</span></label>
                    <select class="form-control LevelName" id="LevelName${numberIncr}" name="LevelName${numberIncr}" required>
                        <option value="1">--Select--</option>
                        <option value="1">HR Final Round</option>
                        <option value="1">Manager Round</option>
                        <option value="1">Technical Round</option>
                    </select>
                </div>
            </div>
            <div class="col-md-6 col-lg-4 col-sm-6 col-6 pl-1">
                <div class="form-group">
                    <label>Medium<span id="Asterisk">*</span></label>
                    <div class="d-flex" style="margin-top: 4px;">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input Male" type="radio" name="gender${numberIncr}" id="Male${numberIncr}" value="Male">
                            <label class="form-check-label" for="Male${numberIncr}">Direct</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input Female" type="radio" name="gender${numberIncr}" id="Female${numberIncr}" value="Female">
                            <label class="form-check-label" for="Female${numberIncr}">Virtual</label>
                        </div>
                    </div>
                    <div class="error-message error" style="color: red; display: none;">Please select your gender.</div>
                </div>
            </div>
            <div class="col-md-6 col-lg-2 col-sm-6 col-6 pl-1">
                <span class="Dynamicbutton closeDynamic">×</span>
            </div>
        </div>
    `;

    $('.dynamiclyappendhtml').append(html);
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

    // Source icons from Sources array
    if (SourcesColumnIndex !== -1) {
        renderColumn.push({
            targets: SourcesColumnIndex,
            className: 'imgiconInTable', 
            render: function (data, type, row) {
                if (type === 'display' && Array.isArray(row.Sources)) {
                    const sourceImageMap = {
                        "LinkedIn": "/assets/moduleusedtetroone/linkedin_icon.svg",
                        "Naukri": "/assets/moduleusedtetroone/naukri_icon.svg",
                        "Indeed": "/assets/moduleusedtetroone/indeed_icon.svg",
                        "Website": "/assets/moduleusedtetroone/website_icon.svg"
                    };
                    return row.Sources.map(source => {
                        const icon = sourceImageMap[source];
                        return icon
                            ? `<img src="${icon}" alt="${source}" title="${source}" style="width:20px;height:20px;margin-right:4px;" />`
                            : '';
                    }).join('');
                }
                return '';
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

function CanvasOpenFirstShowing() {
    $('#JobCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5, #collapse6, #collapse7').collapse('hide');
    $('#JobCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#JobCanvas').offset().top
    }, 'fast');
}
