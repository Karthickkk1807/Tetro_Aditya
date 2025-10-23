function logoutsusccess() {
    window.location.href = "/Login";
}

function landingsusccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var bindData = data[0];
        if (bindData[0].UserImageFilePath != null && bindData[0].UserImageFilePath != "") {
            $('#UserImage').attr('src', bindData[0].UserImageFilePath);
            //$('#UserFranchiseMappingId').val($('#UserFranchiseMappingId option:first').val());
        } else {
            $('#UserImage').attr('src', "/assets/commonimages/user.png");
            $('#LandingUserImage').attr('src', "/assets/commonimages/user.png");
            /*$('#UserFranchiseMappingId').val($('#UserFranchiseMappingId option:first').val());*/
        }
    }
}

$(document).ready(function () {
    $("#Logoutbtn").on('click', async function () {
        var response = await Common.askConfirmation("Are you sure want to logout?");
        if (response == true) {
            Common.ajaxCall("GET", "/Login/Logout", null, logoutsusccess, null);
        }
    });

    Common.ajaxCall("GET", "/Common/Getlanding", null, landingsusccess, null);

});
 
$(document).ready(function () {
    var currentURL = window.location.pathname;

    $('#sidebar-menu li a').removeClass('activesubmenu');
    //$('#sidebar-menu li ul').hide(); 

    $('#sidebar-menu a').each(function () {
        var menuItemURL = $(this).attr('href');

        if (currentURL === menuItemURL) {
            $(this).closest('a').addClass('activesubmenu');
            $(this).parents('div').addClass('show');
            $(this).parents('ul').show();
        }
    });

    var urlParts = currentURL.split('/');
    var controller = urlParts[1];
    var action = urlParts[2];

    var dynamicSelector = '#sidebar-menu a:has(a[href="/' + controller + '/' + action + '"])';
    $(dynamicSelector).addClass('activesubmenu');

    Common.ajaxCall("GET", "/Common/GetNotificationDetails", null, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            BindNotification(data[0]);
        }
    }, null);


    $(document).on('click', '#notificationBell', function () {
        $('#notificationDropdown').show();
    });

    $(document).on('click', '#notifyClose', function () {
        $('#notificationDropdown').hide();
    });

    $(document).on('click', '#notifDropdownMenu', function (event) {
        event.stopPropagation();
    });

    $(document).on('click', '.dropdown-item', function () {
        var selectedText = $(this).text();
        $('.Bulk-Action').text(selectedText);
        $('.dropdown-menu .dropdown-item').removeClass('active');
        $(this).addClass('active');
        $('.dropdown-menu').removeClass('show');

        if (selectedText == "Custom") {
            $('#monthPickerCol').hide();
            $('#fromtodateCol').show();
            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $("#filter-Column").removeClass("Date-SearchColumn");
                $("#Human-Filter-Column").removeClass("date-column");
            } else {
                $("#Human-Filter-Column").addClass("Date-SearchColumn");
                $("#Human-Filter-Column").addClass("date-column");
            }
        } else {
            $('#monthPickerCol').show();
            $('#fromtodateCol').hide();
            $("#filter-Column").addClass("Date-SearchColumn");
            $("#Human-Filter-Column").addClass("date-column");
        }
    });

    $(document).on('click', '.Bulk-Action', function () {
        $(this).next('.dropdown-menu').toggleClass('show');
    });

    //$(document).on('click', function (e) {
    //    if (!$(e.target).closest('.table-responsive, .dataTables_paginate, .paginate_button, .page-link, .searchbar__input').length) {
    //        $('input.form-control-sm, #tableFilter, .searchbar__input').val('').trigger('input');
    //        //$(this).val("").trigger('input');
    //        //$('.form-control-sm').val("").trigger('input');
    //        //$('#tableFilter').val('');
    //        //$('.searchbar__input').val('');
    //        //$('#tableForPopFilter').val('').trigger('input');
    //    }
    //});

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.table-responsive, .dataTables_paginate, .paginate_button, .page-link, .searchbar__input').length) {
            $('input.form-control-sm, #tableFilter, .searchbar__input').val('').trigger('input');
        }
    });
});

function BindNotification(response) {
    var ul = "";
    if (response[0].NotificationId != null && response[0].NotificationId != "") {
        var notifycountval = (response?.length == 1 && response[0].NotificationId == null) ? '' : response?.length;
        if (notifycountval != null && notifycountval != 0) {
            $('#notifycount').text(notifycountval);
            $('#totalNotification').text(`You have ${notifycountval} new notifications`);
        } else {
            $('#notifycount').text(0);
            $('#totalNotification').text(`You have 0 notifications`);
        }


        $('#Notification').html("");
        $.each(response, function (index, values) {
            if (values.NotificationId != null && values.NotificationId != 'null') {

                var value = {
                    EmpImage: "/assets/commonimages/user.png",
                    CreationTime: "2 days ago",

                };

                var liElement = document.createElement("li");
                liElement.classList.add("notification-message", "collapsed");

                var mediaElement = document.createElement("div");
                mediaElement.classList.add("media", "d-flex");

                var avatarElement = document.createElement("span");
                avatarElement.classList.add("avatarnoti", "flex-shrink-0");

                var imgElement = document.createElement("img");
                imgElement.setAttribute("alt", "");
                imgElement.setAttribute("src", values.CompanyLogoFilePath);
                imgElement.classList.add("container1");

                avatarElement.appendChild(imgElement);

                var containerElement = document.createElement("div");
                containerElement.classList.add("container1");

                var contentElement = document.createElement("div");
                contentElement.classList.add("content", "collapsed");
                contentElement.setAttribute("id", "content");

                var mediaBodyElement = document.createElement("div");
                mediaBodyElement.classList.add("media-body", "flex-grow-1");

                var notiDetailsElement = document.createElement("p");
                notiDetailsElement.classList.add("noti-details");


                var notiTitleElement2 = document.createElement("span");
                notiTitleElement2.classList.add("noti-title");
                notiTitleElement2.textContent = values.DetailedMessage;

                notiDetailsElement.appendChild(notiTitleElement2);

                mediaBodyElement.appendChild(notiDetailsElement);
                contentElement.appendChild(mediaBodyElement);

                var toggleButtonElement = document.createElement("div");
                toggleButtonElement.classList.add("toggle-button");
                toggleButtonElement.setAttribute("id", "toggle-button");
                toggleButtonElement.setAttribute("onclick", "toggleContent(event)");
                toggleButtonElement.textContent = "Read More";

                contentElement.appendChild(toggleButtonElement);

                var closeButtonElement = document.createElement("span");
                closeButtonElement.setAttribute("style", "float: right;");
                closeButtonElement.setAttribute("id", values.NotificationId);
                closeButtonElement.classList.add("close-button");
                closeButtonElement.setAttribute("onclick", "closeNotification(event)");
                closeButtonElement.textContent = "Close";

                contentElement.appendChild(closeButtonElement);

                var notiTimeElement = document.createElement("p");
                notiTimeElement.classList.add("noti-time");

                var notificationTimeElement = document.createElement("span");
                notificationTimeElement.classList.add("notification-time");
                notificationTimeElement.textContent = values.CreationTime;

                notiTimeElement.appendChild(notificationTimeElement);

                containerElement.appendChild(contentElement);
                containerElement.appendChild(notiTimeElement);

                mediaElement.appendChild(avatarElement);
                mediaElement.appendChild(containerElement);

                liElement.appendChild(mediaElement);


                $('#Notification').append(liElement);
            }
        });
    }
    else {
        $('#notifycount').text(0);
        $('#totalNotification').text(`You have 0 notifications`);
    }
}

function toggleContent(event) {
    event.stopPropagation();
    var content = event.target.previousElementSibling;
    var toggleButton = event.target;

    if ($(event.target).closest("#content").hasClass("collapsed")) {
        $(event.target).closest("#content").removeClass("collapsed");
        toggleButton.textContent = "Read Less";
    } else {
        $(event.target).closest("#content").addClass("collapsed");
        toggleButton.textContent = "Read More";
    }

}

function closeNotification(event) {
    event.stopPropagation();
    var notificationMessage = event.target.closest('.notification-message');
    notificationMessage.style.display = 'none';
    var notificationId = event.target.attributes.id.value;
    Common.ajaxCall("Get", "/Common/GetNotificationDetailsId?NotificationId=" + parseInt(notificationId), null, NotificationReload, null);

}

function NotificationReload() {
    Common.ajaxCall("GET", "/Common/GetNotificationDetails", null, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            BindNotification(data[0]);
        }
    }, null);

}

setInterval(function () {
    Common.ajaxCall("GET", "/Common/SetUserAccess", null, null, null);
}, 50000);