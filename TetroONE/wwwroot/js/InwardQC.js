$(document).ready(function () {

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

    $(document).on('click', '#AddInWardQC', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#InWardQCCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#InWardQCCanvas").css("width", "50%");
        } else {
            $("#InWardQCCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder();
        $('#InWardQCHeader').text('InWardQC Details');
        $('#SaveInWardQC').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#InWardQCCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#InWardQCCanvas").css("width", "50%");
        } else {
            $("#InWardQCCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        CanvasOpenFirstShowingJobOrder();
        $('#InWardQCHeader').text('Edit InWardQC Details');
        $('#SaveInWardQC').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#InWardQCCanvas").css("width", "0%");
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

function CanvasOpenFirstShowingJobOrder() {
    $('#InWardQCCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#InWardQCCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#InWardQCCanvas').offset().top
    }, 'fast');
    $('#ProcessTypeId').val(['']).trigger('change');
}
