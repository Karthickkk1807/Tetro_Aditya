var Gridname = "Mine";

$(document).ready(function () {
    $('#calendar').show();
    $('.btn-edit').show();
    $('#AddShift').hide();
    $('.ClickCard').hide();
    $('.CardForEmployee').hide();
    $('.Closefieldset').hide();
    $('.Expandfieldset').show();
    $('.calendarScrollWrapper_1').hide();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function updateMonthYear() {
        $('#dateDisplay2').text(`${months[currentMonth]} ${currentYear}`);

        $('#calendar').empty();
        $('#calendarGrid').empty();

        if (Gridname === "Mine") {
            $('#calendar').show();
            $('.calendarScrollWrapper_1').hide();
            buildCalendarMine(currentYear, currentMonth);
        } else if (Gridname === "My Team") {
            $('#calendar').hide();
            $('.calendarScrollWrapper_1').show();
            buildGridViewMyTeam(currentYear, currentMonth);
        }
    }

    $('#decrement-month-btn2').click(function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateMonthYear();
    });

    $('#increment-month-btn2').click(function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateMonthYear();
    });

    updateMonthYear();

    $('.showingGrid').on('click', function () {
        $('.showingGrid').removeClass('show');
        Gridname = $(this).text().trim();
        $(this).addClass('show');
        if (Gridname === "Mine") {
            $('.btn-edit').show();
            $('#AddShift').hide();
        } else { 
            $('#AddShift').show();
            $('.btn-edit').hide();
        }
        updateMonthYear();
    });

    $(document).on('click', '.btn-edit, .general-shift, .weekend, .holiday',function(){
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#EditShiftCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#EditShiftCanvas").css("width", "50%");
        } else {
            $("#EditShiftCanvas").css("width", "39%");
        } 
        $('#ShopAccordian').hide();
        CanvasOpenFirstShowingEdit();
        $('#fadeinpage').addClass('fadeoverlay');
    });
     
    $(document).on('click', '#CloseCanvas', function () {
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('click', '#EditShift', function () {
        Common.successMsg("Updated Shift Successfully.");
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    }); 
    
    $(document).on('click', '#AddShift', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#AddShiftCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#AddShiftCanvas").css("width", "50%");
        } else {
            $("#AddShiftCanvas").css("width", "39%");
        }
        $('#ShopAccordian').hide();
        CanvasOpenFirstShowingAdd();
        $('#fadeinpage').addClass('fadeoverlay');
    });

    $(document).on('click', '#SaveShift', function () {
        Common.successMsg("Shift Added Successfully.");
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('click', '.RequestGrid', function () {
        var windowWidth = $(window).width();
        $('.ClickCard').hide();
        $('.RequestCard').show();
        $('.CardForEmployee').hide();
        $('.Closefieldset').hide();
        $('.Expandfieldset').show();
        if (windowWidth <= 600) {
            $("#RequestShiftCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#RequestShiftCanvas").css("width", "50%");
        } else {
            $("#RequestShiftCanvas").css("width", "39%");
        } 
        CanvasOpenFirstShowingRequest();
        $('#fadeinpage').addClass('fadeoverlay');
    });

    $(document).on('click', '.RequestCard', function () { 
        $('.ClickCard').show();
        $('.ClickCard').fadeIn(1000);
        $('.RequestCard').hide();
        $('.CardForEmployee').hide();
        $('.Closefieldset').hide();
        $('.Expandfieldset').show();
        $('#FormRequestShift #CreatedDate').val('2025-10-03');
        $('#FormRequestShift #StartDate').val('2025-10-04');
        $('#FormRequestShift #EndDate').val('2025-10-22');
        $('#FormRequestShift #Description').val('Night to Morning Shift Work hours typically from 09:30 PM to 06:30 AM, covering overnight operations.');
    });

    $(document).on('click', '.Expandfieldset', function () {
        $('.CardForEmployee').show();
        $('.Closefieldset').show();
        $('.Expandfieldset').hide();
    });

    $(document).on('click', '.Closefieldset', function () { 
        $('.CardForEmployee').hide();
        $('.Closefieldset').hide();
        $('.Expandfieldset').show();
    });
});

const employees = [
    {
        project: "TetroPay",
        people: [
            { name: "Kavinesh Rajasekar", photo: "/profileimages/b266ce31-e946-4c6b-b65e-ad9d78b1af65@@white_background.png" },
            { name: "Tharani", photo: "/profileimages/chef-1.png" },
            { name: "Karthick", photo: "/profileimages/chef-3.png" }
        ]
    },
    {
        project: "TetroPos",
        people: [
            { name: "Dhanush", photo: "/profileimages/testimonial-2.png" },
            { name: "Karthick", photo: "/profileimages/chef-3.png" }
        ]
    },
    {
        project: "TetroFuel",
        people: [
            { name: "Kavinesh Rajasekar", photo: "/profileimages/b266ce31-e946-4c6b-b65e-ad9d78b1af65@@white_background.png" },
            { name: "Priya", photo: "/profileimages/chef-2.png" }
        ]
    }
];

function buildCalendarMine(year, month) {
    let startDate = new Date(year, month, 1);
    let endDate = new Date(year, month + 1, 0);
    let totalDays = endDate.getDate();

    let firstDayIndex = startDate.getDay();

    let html = "<table class='calendar'>";
    html += "<thead><tr>";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let d of days) {
        html += `<th>${d}</th>`;
    }
    html += "</tr></thead><tbody><tr>";

    for (let i = 0; i < firstDayIndex; i++) {
        html += "<td></td>";
    }

    for (let day = 1; day <= totalDays; day++) {
        let thisDate = new Date(year, month, day);
        let dayOfWeek = thisDate.getDay();

        html += "<td>";
        html += `<div class="day-number">${day}</div>`;

        if (thisDate.toDateString() === new Date(2025, 9, 26).toDateString()) {
            html += `
                <div class="card-event holiday">
                    <strong>Holiday</strong>
                </div>`;
        } else if (dayOfWeek === 0) {
            html += `
                <div class="card-event holiday">
                    <strong>Holiday</strong>
                </div>`;
        } else if (dayOfWeek === 6) {
            html += `
                <div class="card-event weekend">
                    <strong>Weekend</strong>
                </div>`;
        } else {
            html += `
                <div class="card-event general-shift">
                    <strong>General Shift</strong><br>
                    09:30 AM – 06:30 PM<br>
                    <img src="/assets/moduleusedtetroone/shift/shiftinfo.svg" style=" width: 13px;"/> 09:00 Hrs
                </div>`;
        }

        html += "</td>";

        if ((firstDayIndex + day) % 7 === 0) {
            html += "</tr><tr>";
        }
    }

    html += "</tr></tbody></table>";
    $("#calendar").html(html);
}
 
function buildGridViewMyTeam(year, month) {
    let $container = $("#calendarGrid");
    let startDate = new Date(year, month, 1);
    let endDate = new Date(year, month + 1, 0);
    let totalDays = endDate.getDate();

    let daysRow = `<tr><th>Project Names</th>`;
    for (let d = 1; d <= totalDays; d++) {
        let date = new Date(year, month, d);
        let weekday = date.toLocaleString('en-us', { weekday: 'short' });
        let dayNum = date.getDate().toString().padStart(2, '0');
        daysRow += `<th>${dayNum}&nbsp;&nbsp;${weekday}</th>`;
    }
    daysRow += `</tr>`;

    let bodyRows = "";

    $.each(employees, function (idx, group) { 
        bodyRows += `<tr class="projectRow_1" data-project="${idx}">`;
        bodyRows += `<td class="projectNameCell" style="background-color: #f9f9f9;">
                        <span class="arrow">&#9654;</span> ${group.project}
                     </td>`;
        for (let d = 1; d <= totalDays; d++) {
            bodyRows += `<td style="background-color: #f9f9f9;"></td>`;
        }
        bodyRows += `</tr>`;
         
        $.each(group.people, function (_, emp) {
            bodyRows += `<tr class="employeeRow" data-project="${idx}">`;
            bodyRows += `
                <td class="employeeInfo_1">
                    <img src="${emp.photo}" class="employeePhoto_1" />
                    <span class="EmpName">${emp.name}</span>
                </td>`;

            for (let d = 1; d <= totalDays; d++) {
                let date = new Date(year, month, d);
                let day = date.getDay();

                if (day === 0 || day === 6) {
                    bodyRows += `<td><div class="shiftCard_1 weekend_1"><strong>Weekend</strong></div></td>`;
                } else if (d === 12) {
                    bodyRows += `<td><div class="shiftCard_1 holiday_1"><strong>Holiday</strong></div></td>`;
                } else {
                    bodyRows += `
                        <td>
                            <div class="shiftCard_1 generalShift_1">
                                <strong>General Shift</strong><br>
                                09:30 AM – 06:30 PM<br>
                                <img src="/assets/moduleusedtetroone/shift/shiftinfo.svg" style="width:13px;" /> 09:00 Hrs
                            </div>
                        </td>`;
                }
            }

            bodyRows += `</tr>`;
        });
    });
     
    $container.html(daysRow + bodyRows);
     
    $(".employeeRow").each(function () {
        if ($(this).data("project") !== 0) {
            $(this).addClass("hiddenRow");
        }
    });
     
    $(`.projectRow_1[data-project="0"] .arrow`).addClass("open");
     
    $(".projectRow_1").on("click", function () {
        let projectId = $(this).data("project");
         
        $(".employeeRow").addClass("hiddenRow");
         
        $(".projectRow_1 .arrow").removeClass("open");
         
        let $employeeRows = $(`.employeeRow[data-project="${projectId}"]`);
        if ($employeeRows.first().hasClass("hiddenRow")) {
            $employeeRows.removeClass("hiddenRow");
            $(this).find(".arrow").addClass("open");
        } else {
            $employeeRows.addClass("hiddenRow");
            $(this).find(".arrow").removeClass("open");
        }
    });
}

function CanvasOpenFirstShowingEdit() {
    $('#EditShiftCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('html, body').animate({
        scrollTop: $('#EditShiftCanvas').offset().top
    }, 'fast');
}

function CanvasOpenFirstShowingAdd() {
    $('#AddShiftCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('html, body').animate({
        scrollTop: $('#AddShiftCanvas').offset().top
    }, 'fast');
}

function CanvasOpenFirstShowingRequest() {
    $('#RequestShiftCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('html, body').animate({
        scrollTop: $('#RequestShiftCanvas').offset().top
    }, 'fast');
}