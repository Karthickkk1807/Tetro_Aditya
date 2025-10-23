var activeText = "Candidates";
var titleForHeaderCandidatesTab = "";

$(document).ready(function () {
    GridTableCandidates();
    $('.MainDiv').show();
    $('#CandidatesEditScreen').hide();
    $('.DetailsView').show();
    $('.OtherDetailsDiv').hide();
    $('.documentTableShow').hide();
    $('.EducationInfo').hide();
    $('.CareerInfo').hide();

    titleForHeaderCandidatesTab = "Pipeline";

    $('.likebutton').on('click', function () {
        $('.likebutton').removeClass('ActiveTopButton');
        $(this).addClass('ActiveTopButton');
        activeText = $(this).text().trim();
        if (activeText == "Candidates") {
            GridTableCandidates();
        } else {
            GridTableProfiles();
        }
    });

    $(document).on('click', '#ScheduleCanvaOff', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#ScheduledCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#ScheduledCanvas").css("width", "50%");
        } else {
            $("#ScheduledCanvas").css("width", "39%");
        }
        $('#ScheduledHeader').text('Screening (Phone/Video) Details - UI/UX Developer');
        $('#SaveCandidates').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        ScheduledCanvasOpenFirstShowing();
        $('#fadeinpage').addClass('fadeoverlay');

        $('#InterviewMode').val('Face To Face');
        $('#FormScheduled #joining_date').val('2025-10-09');
        $('#StartTime').val('14:44');
        $('#EndTime').val('16:44');
        $('#Location').val('Coimbatore');
        $('#Duration').val('2');
        $('#MainInterviewerId').select2();
        $('#SubInterviewerId').select2();
        $('#MainInterviewerId').val(['13', '3']).trigger('change');
        $('#SubInterviewerId').val(['2']).trigger('change');
    });

    $(document).on('click', '#AddCandidates, .AddCandidate-btn', function () {
        if (activeText == "Candidates") {
            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $("#CandidatesCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#CandidatesCanvas").css("width", "50%");
            } else {
                $("#CandidatesCanvas").css("width", "39%");
            }
            $('#CandidatesHeader').text('Add Candidates Details');
            $('#SaveCandidates').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
            CandidatesCanvasOpenFirstShowing();

            $('#CandidateId').val('CND_1');
            $('.file-label').text('CND_1-Resume.pfd');
            $('#FirstName').val('Sarath');
            $('#LastName').val('R');
            $('#Email').val('abcd@gmail.com');
            $('#ContactNumber').val('+91 0987654321');
            $('#AppliedFor').val('4');
            $('#AppliedSource').val('2');
            $('#Gender').val('2');
            $('#PrimarySkill').val('HTML, CSS');
            $('#SecondarySkill').val('Bootstrap');
            $('#CurrentCompany').val('Tetrosoft');
            $('#CurrentCTC').val('12,00,000.00');
            $('#ExpCTC').val('15,00,000.00');
            $('#IsImmediateJoiner').val('1');
            $('#joining_date').val('2025-10-09');
            $('#LinkedinLink').val('www.linkedin.com/in/Sarath'); 
        }
        else {
            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $("#ProfileCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#ProfileCanvas").css("width", "50%");
            } else {
                $("#ProfileCanvas").css("width", "39%");
            }
            $('#ProfileHeader').text('Add Profile Details');
            $('#SaveProfile').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
            ProfileCanvasOpenFirstShowing();

            $('#CandidateId').val('');
            $('.file-label').text('CVResume.Attach');
            $('#FirstName').val('');
            $('#LastName').val('');
            $('#Email').val('');
            $('#ContactNumber').val('');
            $('#AppliedFor').val('');
            $('#AppliedSource').val('');
            $('#Gender').val('');
            $('#PrimarySkill').val('');
            $('#SecondarySkill').val('');
            $('#CurrentCompany').val('');
            $('#CurrentCTC').val('');
            $('#ExpCTC').val('');
            $('#IsImmediateJoiner').val('');
            $('#joining_date').val('');
            $('#LinkedinLink').val('');
        }
        $('#fadeinpage').addClass('fadeoverlay');
    });

    $(document).on('click', '.btn-edit', function () {
        if (activeText == "Candidates") {
            $('.MainDiv').hide();
            $('#CandidatesEditScreen').show();
            $('#fadeinpage').removeClass('fadeoverlay');
        }
        else {
            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $("#ProfileCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#ProfileCanvas").css("width", "50%");
            } else {
                $("#ProfileCanvas").css("width", "39%");
            }
            $('#ProfileHeader').text('Edit Profile Details');
            $('#SaveProfile').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
            ProfileCanvasOpenFirstShowing();
            $('#fadeinpage').addClass('fadeoverlay');

            $('#ProfileId').val('CND_1');
            $('.file-label').text('CND_1-Resume.pfd');
            $('#FirstName').val('Sarath');
            $('#LastName').val('R');
            $('#Email').val('abcd@gmail.com');
            $('#ContactNumber').val('+91 0987654321');
            $('#AppliedFor').val('4');
            $('#AppliedSource').val('2');
            $('#Gender').val('2');
            $('#PrimarySkill').val('HTML, CSS');
            $('#SecondarySkill').val('Bootstrap');
            $('#CurrentCompany').val('Tetrosoft');
            $('#CurrentCTC').val('12,00,000.00');
            $('#ExpCTC').val('15,00,000.00');
            $('#IsImmediateJoiner').val('1');
            $('#joining_date').val('2025-10-09');
            $('#LinkedinLink').val('www.linkedin.com/in/Sarath');

        }
    });

    $(document).on('click', '.Leave-btn', function () {
        $('.MainDiv').show();
        $('#CandidatesEditScreen').hide();
    });

    $(document).on('click', '#CloseCanvas', function () {
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('click', '#SaveProfile', function () {
        var ProfileHeader = $('#ProfileHeader').text();
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        if (ProfileHeader == "Add Profile Details") {
            Common.successMsg("Profile Added Successfully.");
        } else {
            Common.successMsg("Updated Profile Successfully.");
        }
    });

    $(document).on('click', '.nav-link', function () {
        titleForHeaderCandidatesTab = $(this).text().trim();
        $('.nav-link').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderCandidatesTab) {
                $(this).addClass('active');
            }
        });
        if (titleForHeaderCandidatesTab == "Pipeline") {
            $('.DetailsView').show();
            $('.OtherDetailsDiv').hide();
            $('.documentTableShow').hide();
            $('.CareerInfo').hide();
            $('.EducationInfo').hide();
        } else if (titleForHeaderCandidatesTab == "Other Details") {
            $('.DetailsView').hide();
            $('.OtherDetailsDiv').show();
            $('.documentTableShow').hide();
            $('.CareerInfo').hide();
            $('.EducationInfo').hide();
        } else if (titleForHeaderCandidatesTab == "Documents") {
            $('.DetailsView').hide();
            $('.OtherDetailsDiv').hide();
            $('.documentTableShow').show();
            $('.CareerInfo').hide();
            $('.EducationInfo').hide();
        } else if (titleForHeaderCandidatesTab == "Education Info") {
            $('.DetailsView').hide();
            $('.OtherDetailsDiv').hide();
            $('.documentTableShow').hide();
            $('.CareerInfo').hide();
            $('.EducationInfo').show();
        } else if (titleForHeaderCandidatesTab == "Career Info") {
            $('.DetailsView').hide();
            $('.OtherDetailsDiv').hide();
            $('.documentTableShow').hide();
            $('.EducationInfo').hide();
            $('.CareerInfo').show();
        }
    });

    $('.accordion-header').on('click', function () {
        var $offcanvas = $(this).closest('.offcanvas-container');
        var $accordion = $(this).closest('.accordion');
        var target = $(this).find('a').attr('data-target');

        $offcanvas.find('.collapse').not(target).collapse('hide');

        $(target).collapse('toggle');
    });

    $('.customBrowse').on('click', function () {
        $(this).closest('.upload-box').find('.hiddenFileInput').click();
    });

    //$('.hiddenFileInput').on('change', function () {
    //    var file = this.files[0];
    //    if (file) {
    //        console.log("Selected file:", file.name);
    //    }
    //});

    $('.menu-toggle').on('click', function (e) {
        e.stopPropagation();
        const $menuDot = $(this).closest('.pippline-name').find('.menu-dot');
        $('.menu-dot .menu-list').not($menuDot.find('.menu-list')).removeClass('show');
        $menuDot.find('.menu-list').toggleClass('show');
    });

    $(document).on('click', function () {
        $('.menu-dot .menu-list').removeClass('show');
    });

    $('#MainInterviewerId').select2({
        dropdownParent: $('#FormScheduled'),
        width: '100%',
        placeholder: '--Select Main Interviewer--'
    }).on('select2:open', function () {
        $('.select2-container').css('z-index', 1100);
    }).trigger('change');

    $('#SubInterviewerId').select2({
        dropdownParent: $('#FormScheduled'),
        width: '100%',
        placeholder: '--Select Sub Interviewer--'
    }).on('select2:open', function () {
        $('.select2-container').css('z-index', 1100);
    }).trigger('change');
});

function GridTableCandidates() {
    const candidateData = [
        {
            Name: "Aarav C",
            Email: "aarav@gmail.com",
            ContactNo: "0987654321",
            Gender: "Male",
            JobName: "Full Stack Developer",
            Experience: "1.0 Yrs",
            Source: "LinkedIn",
            PrimarySkill: "React.Js",
            SecondarySkill: "Hibernate",
            ProfileMatched: "95%",
            Status: "Onboarded",
            Status_Color: "#28a745"
        },
        {
            Name: "Rishi A",
            Email: "rishi@gmail.com",
            ContactNo: "9265267527",
            Gender: "Male",
            JobName: "Security Analyst",
            Experience: "7.0 Yrs",
            Source: "Naukri",
            PrimarySkill: "SQL",
            SecondarySkill: "JavaScript",
            ProfileMatched: "85%",
            Status: "Selected",
            Status_Color: "#007bff"
        },
        {
            Name: "Sanya G",
            Email: "sanya@gmail.com",
            ContactNo: "8263535263",
            Gender: "Female",
            JobName: "Data Engineer",
            Experience: "3.7 Yrs",
            Source: "Company",
            PrimarySkill: "JavaScript",
            SecondarySkill: "Node.js",
            ProfileMatched: "75%",
            Status: "Yet to Scheduled",
            Status_Color: "#ffc107"
        },
        {
            Name: "Sarath R",
            Email: "sarath@gmail.com",
            ContactNo: "6238637827",
            Gender: "Others",
            JobName: "IT Support Specialist",
            Experience: "7.3 Yrs",
            Source: "LinkedIn",
            PrimarySkill: "Angular.Js",
            SecondarySkill: "Git",
            ProfileMatched: "70%",
            Status: "Not-Selected",
            Status_Color: "#dc3545"
        },
        {
            Name: "Saran M",
            Email: "saran@gmail.com",
            ContactNo: "6928302333",
            Gender: "Male",
            JobName: "Technical Project Manager",
            Experience: "5.5 Yrs",
            Source: "Naukri",
            PrimarySkill: "C#",
            SecondarySkill: "REST API",
            ProfileMatched: "78%",
            Status: "Scheduled",
            Status_Color: "#007bff"
        },
        {
            Name: "Tanvi D",
            Email: "tanvi@gmail.com",
            ContactNo: "8734673444",
            Gender: "Female",
            JobName: "Network Engineer",
            Experience: "4.0 Yrs",
            Source: "Company",
            PrimarySkill: "Angular.Js",
            SecondarySkill: "Docker",
            ProfileMatched: "90%",
            Status: "Onboarded",
            Status_Color: "#28a745"
        },
        {
            Name: "Aarav S",
            Email: "aarav@gmail.com",
            ContactNo: "9838409801",
            Gender: "Male",
            JobName: "Cloud Engineer",
            Experience: "1.0 Yrs",
            Source: "Naukri",
            PrimarySkill: "UI/UX",
            SecondarySkill: "Java",
            ProfileMatched: "70%",
            Status: "Yet to Scheduled",
            Status_Color: "#ffc107"
        },
        {
            Name: "Rishi A",
            Email: "rishi@gmail.com",
            ContactNo: "0923872378",
            Gender: "Male",
            JobName: "Web Designer",
            Experience: "2.5 Yrs",
            Source: "Company",
            PrimarySkill: "Angular.Js",
            SecondarySkill: "C#",
            ProfileMatched: "55%",
            Status: "Yet to Scheduled",
            Status_Color: "#ffc107"
        }
    ];

    const columns = [
        { data: 'Name', name: 'Name', title: 'Name' },
        { data: 'Email', name: 'Email', title: 'Email' },
        { data: 'ContactNo', name: 'ContactNo', title: 'Contact No' },
        { data: 'Gender', name: 'Gender', title: 'Gender' },
        { data: 'JobName', name: 'JobName', title: 'Job Name' },
        { data: 'Experience', name: 'Experience', title: 'Experience' },
        { data: 'Source', name: 'Source', title: 'Source' },
        { data: 'PrimarySkill', name: 'PrimarySkill', title: 'Primary Skill' },
        { data: 'SecondarySkill', name: 'SecondarySkill', title: 'Secondary Skill' },
        { data: 'ProfileMatched', name: 'ProfileMatched', title: 'Profile Matched' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];
    $('#CandidatesDynamic').empty('');
    var html = `<div class="col-sm-12 p-0">
                    <div class="table-responsive">
                        <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="candidateTable"></table>
                    </div>
                </div>`;
    $('#CandidatesDynamic').append(html);
    bindTable('candidateTable', candidateData, columns, 9, 'Name', '400px', true, { update: true, delete: true });
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

    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);
    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");
    var profileMatchedIndex = columns.findIndex(col => col.data === "ProfileMatched");

    if (isAction && data && data.length > 0 && (access.update || access.delete)) {
        columns.push({
            data: "Action",
            name: "Action",
            title: "Action",
            orderable: false
        });
    }

    var renderColumn = [];

    if (StatusColumnIndex !== -1) {
        renderColumn.push({
            targets: StatusColumnIndex,
            render: function (data, type, row) {
                if (type === 'display' && row.Status_Color) {
                    return `<span class="ana-span badge" style="background:${row.Status_Color};width: 115px;font-size: 12px;height: 23px;">${row.Status}</span>`;
                }
                return data;
            }
        });
    }

    if (profileMatchedIndex !== -1) {
        renderColumn.push({
            targets: profileMatchedIndex,
            render: function (data, type, row) {
                const percentage = parseInt(data);
                return `
                        <svg viewBox="0 0 36 36" class="circular-chart">
                          <path class="circle-bg"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"/>
                          <path class="circle"
                            stroke-dasharray="${percentage}, 100"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"/>
                          <text x="18" y="20.35" class="percentage">${percentage}%</text>
                        </svg>
                    `;
            }
        });
    }

    if (access.update || access.delete) {
        renderColumn.push({
            targets: columns.length - 1,
            render: function (data, type, row) {
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

    var table = $('#' + tableid).DataTable({
        dom: "Bfrtip",
        responsive: true,
        data: data,
        columns: columns,
        destroy: true,
        scrollY: scrollpx,
        scrollX: true,
        scrollCollapse: true,
        aaSorting: [],
        pageLength: 7,
        lengthMenu: [7, 14, 50],
        info: hasValidData,
        paging: hasValidData,
        oSearch: { bSmart: false, bRegex: true },
        language: {
            emptyTable: `
                        <div>
                            <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" width="32" style="margin-right: 10px;">
                                No records found
                        </div>`,
            paginate: {
                next: ">",
                previous: "<"
            }
        },
        columnDefs: renderColumn
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });
}

function GridTableProfiles() {

    const jobData = [
        {
            Name: "Aarav C",
            Email: "aarav@gmail.com",
            ContactNo: "9424324324",
            JobName: "UI Developer",
            Experience: "3.6 Years",
            CreatedDate: "10 Mar 2025",
            Sources: ["Indeed"], 
            PrimarySkill: "React",
            SecondarySkill: "GitHub"
        },
        {
            Name: "Pranav S",
            Email: "pranav@gmail.com",
            ContactNo: "6123123906",
            JobName: "Backend Developer",
            Experience: "5.5 Years",
            CreatedDate: "14 Jan 2025",
            Sources: ["Website"],  
            PrimarySkill: "HTML, CSS",
            SecondarySkill: "Cybersecurity Analyst"
        },
        {
            Name: "Vikram R",
            Email: "vikram@gmail.com",
            ContactNo: "9123345545",
            JobName: "Full Stack Developer",
            Experience: "2.2 Years",
            CreatedDate: "22 Feb 2025",
            Sources: ["Naukri"],  
            PrimarySkill: "Node.js",
            SecondarySkill: "Software Tester"
        },
        {
            Name: "Kavin M",
            Email: "kavin@gmail.com",
            ContactNo: "9012423423",
            JobName: "DevOps Engineer",
            Experience: "2.7 Years",
            CreatedDate: "08 Apr 2025",
            Sources: ["Indeed"],  
            PrimarySkill: "React",
            SecondarySkill: "Product Manager"
        },
        {
            Name: "Surya P",
            Email: "surya@gmail.com",
            ContactNo: "9123236758",
            JobName: "Data Analyst",
            Experience: "3.8 Years",
            CreatedDate: "19 May 2025",
            Sources: ["Naukri"],
            PrimarySkill: "JavaScript",
            SecondarySkill: "Business Analyst"
        },
        {
            Name: "Harish T",
            Email: "harish@gmail.com",
            ContactNo: "61293872937",
            JobName: "QA Engineer",
            Experience: "4.0 Years",
            CreatedDate: "16 Aug 2025",
            Sources: ["Website"],
            PrimarySkill: "Hibernate",
            SecondarySkill: "Cloud Architect"
        },
        {
            Name: "Santhosh N",
            Email: "santhosh@gmail.com",
            ContactNo: "82328736123",
            JobName: "Mobile App Developer",
            Experience: "2.5 Years",
            CreatedDate: "11 Oct 2025",
            Sources: ["Naukri"],
            PrimarySkill: "Spring Boot",
            SecondarySkill: "QA Engineer"
        },
        {
            Name: "Karthik L",
            Email: "karthik@gmail.com",
            ContactNo: "9876543214",
            JobName: "Cloud Architect",
            Experience: "3.0 Years",
            CreatedDate: "17 Feb 2025",
            Sources: ["Naukri"],
            PrimarySkill: "Java",
            SecondarySkill: "DevOps Engineer"
        }
    ];

    const columns = [
        { data: 'Name', name: 'Name', title: 'Name' },
        { data: 'Email', name: 'Email', title: 'Email' },
        { data: 'ContactNo', name: 'ContactNo', title: 'Contact No' },
        { data: 'JobName', name: 'JobName', title: 'Job Name' },
        { data: 'Experience', name: 'Experience', title: 'Experience' },
        { data: 'CreatedDate', name: 'CreatedDate', title: 'Created Date' },
        { data: 'Sources', name: 'Sources', title: 'Sources' },
        { data: 'PrimarySkill', name: 'PrimarySkill', title: 'Primary Skill' },
        { data: 'SecondarySkill', name: 'SecondarySkill', title: 'Secondary Skill' }
    ];
    $('#CandidatesDynamic').empty('');
    var html = `<div class="col-sm-12 p-0">
                    <div class="table-responsive">
                        <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="candidateTable"></table>
                    </div>
                </div>`;
    $('#CandidatesDynamic').append(html);
    bindTableProfiles('candidateTable', jobData, columns, 9, 'Name', '350px', true, { update: true, delete: true });
}

function bindTableProfiles(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
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

function CandidatesCanvasOpenFirstShowing() {
    $('#CandidatesCanvas').addClass('show');
    $('#CandidatesCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#CandidatesCanvas').offset().top
    }, 'fast');
}

function ScheduledCanvasOpenFirstShowing() {
    $('#ScheduledCanvas').addClass('show');
    $('#ScheduledCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#ScheduledCanvas').offset().top
    }, 'fast');
}

function ProfileCanvasOpenFirstShowing() {
    $('#ProfileCanvas').addClass('show');
    $('#ProfileCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#ProfileCanvas').offset().top
    }, 'fast');
}
