

$(document).ready(function () {

    $(document).on('focus', ':input', function () {
        $(this).attr('autocomplete', 'no-' + Math.random());
    });

    $('#ToggleEye').click(function () {
        const passwordField = $('#Password');
        const icon = $(this);

        if (passwordField.attr('type') === 'password') {
            passwordField.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordField.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });


    var $loginForm = $("#loginForm");


    $('#LoginBtn').on('click', function () {
        $('#LoginBtn i').addClass('fa fa-spinner fa-spin');
        $(".error-message").remove();
        $loginForm.validate({
            errorLabelContainer: '.error-container',
            errorElement: 'span',
            rules: {
                UserName: {
                    required: true,
                    minlength: 10
                },

                Password: {
                    required: true,
                    minlength: 5
                }
            },
            messages: {
                UserName: {
                    required: "Mobile number / Email is required",
                    minlength: "Invalid Mobile number / Email"
                },
                Password: {
                    required: "Password is required",
                    minlength: "Your password is too short."
                }
            },
            errorPlacement: function (error, element) {
                $('#LoginBtn i').removeClass('fa fa-spinner fa-spin');
                if (element.attr("name") === "Password") {
                    error.appendTo("#passerrorMessage");
                } else {
                    error.insertAfter(element);
                }
            },
        });
        if ($loginForm.valid()) {
            $('#LoginBtn i').addClass('fa fa-spinner fa-spin');
            var txtUserName = $("#UserName").val();
            var txtPassword = $("#Password").val();
            var _LoginCredential = {
                userName: txtUserName,
                password: txtPassword
            };
            $('#validation-error').hide();
            $('#SucessMessage-error').hide();
            $.ajax({
                type: "POST",
                url: "/ProductionQRCode/ProductionQRCodeLoginValue",
                data: JSON.stringify(_LoginCredential),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (ReturnMessage) {
                    $('#LoginBtn i').removeClass('fa fa-spinner fa-spin');
                    if (ReturnMessage.status == true) {
                        var data = JSON.parse(ReturnMessage.data);
                        $('#SucessMessage-error').html(ReturnMessage.message).show();
                        setTimeout(function () {
                            const urlParams = new URLSearchParams(window.location.search);
                            const productionPlanId = urlParams.get('ProductionPlanId');
                            const plantMappingId = urlParams.get('PlantMappingId');
                            const userId = data[0][0].UserId;

                            const newUrl = `http://103.174.10.91:8123/ProductionQRCode/QRCodePop?ProductionPlanId=${productionPlanId}&PlantMappingId=${plantMappingId}&UserId=${userId}`;
                            //const newUrl = `https://localhost:44366/ProductionQRCode/QRCodePop?ProductionPlanId=${productionPlanId}&PlantMappingId=${plantMappingId}&UserId=${userId}`;

                            window.location.href = newUrl;

                            $('#SucessMessage-error').hide();
                        }, 1000);
                    } else {
                        $('#validation-error').html(ReturnMessage.message).show();
                    }
                },
                error: function (r) {
                    $('#LoginBtn i').removeClass('fa fa-spinner fa-spin');
                    Swal.fire(
                        '',
                        r.statusText,
                        'error'
                    );
                }
            });
        }
        else {
            $('#LoginBtn i').removeClass('fa fa-spinner fa-spin');
            $loginForm.find(".error").each(function () {
                if ($(this).hasClass("required")) {
                    $(this).after('<span class="error-message">This field is required</span>');
                }
            });
        }
    });

    $('#Password').on("cut copy paste", function (e) {
        e.preventDefault();
    });

    $("#Password").keypress(function (e) {
        if (e.which === 13) {
            $("#LoginBtn").click();
        }
    });

    $("#LoginBtn").keyup(function (event) {
        if (event.key === "Enter") {
            $("#LoginBtn").click();
        }
    });

    $('#showSignUp').click(function () {
        $('#loginCard').addClass('rotated');
        $('#signUpCard').removeClass('d-none');
        setTimeout(function () {
            $('#signUpCard').addClass('rotated');
            $('#loginCard').addClass('d-none');
        }, 100);
    });

    $('#showLogin').click(function () {
        $('#signUpCard').removeClass('rotated');
        $('#loginCard').removeClass('d-none');
        setTimeout(function () {
            $('#loginCard').removeClass('rotated');
            $('#signUpCard').addClass('d-none');
        }, 100);
    });

    $(document).on('click', '#ForgotBtn', function () {
        if (!Common.validateEmailwithErrorwithParent('signUpForm', 'Email')) {
            return false;
        }
        if ($("#signUpForm").valid()) {
            var signupData = JSON.parse(JSON.stringify(jQuery('#signUpForm').serializeArray()));
            var objvalue = {};
            $.each(signupData, function (index, item) {
                objvalue[item.name] = item.value;
            });
            $('#ForgotBtn i').addClass('fa fa-spinner fa-spin');
            Common.ajaxCall("POST", "/Login/SignUp", JSON.stringify(objvalue), SignUpSuccess, null);

        }
    });

    $(document).on("input", '#signUpForm #Email', function (event) {
        if (Common.validateEmailwithErrorwithParent('signUpForm', 'Email')) {
            $('#signUpForm #Email-error').remove();
        }
    });

    $('#forgetPassword').on('click', function () {
        // window.location.href = "/ForgotPassword";
    });

    $('#Password,#UserName').on('input', function () {
        $('#validation-error').hide();
        $('#SucessMessage-error').hide();
    });
});