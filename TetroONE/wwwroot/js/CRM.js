$(document).ready(function () {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').show();

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        if (displayedDate.getFullYear() > currentYear || (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() > currentMonth)) {
            $('#increment-month-btn2').hide();
        }
    });

    function updateMonthDisplay(date) {
        let monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear();
        $('#dateDisplay2').text(month + " " + year);
    }

    $('.StartDateDiv').hide();
    $('.EndDateDiv').hide();
    $('.ABCIdDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-12 col-md-12 col-sm-12 col-12');
    $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-font > button:nth-child(3)').hide();
    $('.note-table').hide();
    $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-insert > button:nth-child(2)').hide();
    $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-insert > button:nth-child(3)').hide();
    $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-view > button:nth-child(3)').hide();
    $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-view > button.note-btn.btn.btn-light.btn-sm.btn-codeview.note-codeview-keep').hide();
    $('.note-statusbar').hide();

    $(document).on('click', '#AddCRM', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#CRMCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#CRMCanvas").css("width", "50%");
        } else {
            $("#CRMCanvas").css("width", "39%");
        }
        $('.note-editable').empty();
        $('#fadeinpage').addClass('fadeoverlay');
        $('#CRMHeader').text('Add CRM Details');
        Common.removevalidation('CRMInfoForm');
        $('.StartDateDiv').hide();
        $('.EndDateDiv').hide();
        $('.ABCIdDiv').removeClass('col-lg-6 col-md-6 col-sm-6 col-6').addClass('col-lg-12 col-md-12 col-sm-12 col-12');
        $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-font > button:nth-child(3)').hide();
        $('.note-table').hide();
        $('.note-statusbar').hide();
        $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-insert > button:nth-child(2)').hide();
        $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-insert > button:nth-child(3)').hide();
        $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-view > button:nth-child(3)').hide();
        $('#CRMInfoForm > div > div > div.form-group > div.note-editor.note-frame.card > div.note-toolbar.card-header > div.note-btn-group.btn-group.note-view > button.note-btn.btn.btn-light.btn-sm.btn-codeview.note-codeview-keep').hide();
    });

    $(document).on('click', '.btn-fullscreen', function () {
        $('#CRMInfoForm > div > div:nth-child(9) > div > div.note-editor.note-frame.card > div.note-editing-area > div.note-editable.card-block').css('height', '300px !important');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#CRMCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        $('#CRMHeader').text('');
    });

    $(document).on('change', '#TypeId', function () {
        var TakeVal = $(this).val();
        if (TakeVal == 2) {
            $('.StartDateDiv').show();
            $('.EndDateDiv').show();
            $('.ABCIdDiv').addClass('col-lg-6 col-md-6 col-sm-6 col-6').removeClass('col-lg-12 col-md-12 col-sm-12 col-12');
        } else {
            $('.StartDateDiv').hide();
            $('.EndDateDiv').hide();
            $('.ABCIdDiv').addClass('col-lg-12 col-md-12 col-sm-12 col-12').removeClass('col-lg-6 col-md-6 col-sm-6 col-6');
        }
    });

    $(document).on('click', '.titleForHeaderTab', function () {
        $('.navbar-tab').removeClass('active');
        $(this).closest('.nav-item').find('.navbar-tab').addClass('active');
    });

    $(document).on('click', '.fa-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#CRMCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#CRMCanvas").css("width", "50%");
        } else {
            $("#CRMCanvas").css("width", "39%");
        }
        $('.note-editable').empty();
        $('#fadeinpage').addClass('fadeoverlay');
        $('#CRMHeader').text('Edit CRM Info');
        $('#CRMTypeId').val('3');
        $('#CRMName').val('Pongal');
        $('#IsSchedule').prop('checked', true);
        $('#TypeId').val('2').trigger('change');
        $('#ABCId').val('3');
        $('#StartDate').val('2025-03-10');
        $('#EndDate').val('2025-03-12');
        $('#commentsTextarea').val('Wishing you a joyful and prosperous Pongal! 🌾🍚 May this festive season bring you happiness, success, and good health! 🌟🥳 Have a bountiful harvest and a year full of blessings! 🙏🍀');
    });

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            $(this).closest('tr').remove();
            var tableLenght = $('#CRMTable').find('tr').length;
            if (tableLenght == 1) {
                $('#CRMTable').append('<tr><td valign="top" colspan="8" class="dataTables_empty"><div><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div></td></tr>');
            }
            Common.successMsg('Record Deleted Success');
        }
    });

});
