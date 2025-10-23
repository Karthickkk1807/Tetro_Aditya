var titleForHeaderTab = "";

$(document).ready(function () {

    if ($('.scroll-scrolly_visible .nav-item .activesubmenu').text().trim() == "Dashboard") {
        $('#DashboardDrop').show();
    } else {
        $('#DashboardDrop').hide();
    } 

    Common.ajaxCall("GET", "/Myprofile/GetMyprofile", null, profileSuccess, null);

    $(document).on('click', '#sidebar-menu a', function () {
        const clickedText = $(this).text().trim(); 

        if ($(this).hasClass('activesubmenu') && clickedText === "Dashboard" && $('#DashboardDrop').val() === "/NewDashboard") {
            $('#DashboardDrop').show();
        } else {
            $('#DashboardDrop').hide();
        }
    });
     
    Common.bindDropDownParent('UserTypeId', 'ManageUserForm', 'UserType');
    $('#UserGroupId').empty().append('<option value="">-- Select --</option>');
    $('#ContactId').empty().append('<option value="">-- Select --</option>');
    Common.bindDropDownMulti('DepartmentDetailsId', 'Department');
    $(document).on('focus', ':input', function () {
        $(this).attr('autocomplete', 'no-' + Math.random());
    });

    $("#EmployeeImage").change(function () {
        readURL(this);
    });

    $('#ManageUserOpen').on('click', function () {
        $('#ManageUserModal').show();
        $('#myProfileModal').hide();
        $('#ManageUserDynamic').html('');
        titleForHeaderTab = "Company User";
        Common.ajaxCall("GET", "/Myprofile/GetManageUser", { ModuleName: "Company User" }, ManageUserSuccess, null);
    });

    $('#ManageUserModalClose').on('click', function () {
        $('#ManageUserModal').hide();
        $('#myProfileModal').show();
        Common.ajaxCall("GET", "/Myprofile/GetMyprofile", null, profileSuccess, null);
    });

    $('#AddUser').on('click', function () {
        $('#AddUserModal').show();
        $('#ManageUserModal').hide();
        $('#SaveManageUser').val('Save').removeClass('btn-update').addClass('btn-success');
        $('#Email-error').hide();
        Common.removevalidation('ManageUserForm');
        $('#imagePreview').attr('src', '/assets/commonimages/user.png');
        $('#UserGroupId').empty().append('<option value="">-- Select --</option>');
        InfoId = 0;
        $('#DeleteManageUser').hide();
        $('#ManageUserForm #Password').attr('type', 'password');
        $('#ManageUserEye').removeClass('fa-eye-slash').addClass('fa-eye');
        $('#UserGroupId').prop('disabled', false)
        $('#ClientVendorhide').hide();
        $('#DepartmentManageUserhide').hide();
        $('#ContactId').empty().append('<option value="">-- Select --</option>');
        $('#DepartmentDetailsId').val('').trigger('change');
        Common.bindDropDownMulti('DepartmentDetailsId', 'Department');
        Common.bindDropDownParent('UserTypeId', 'ManageUserForm', 'UserType');
        $('#BindFranchiseDataProfile').empty('');
        ignoreUserTypeChangeEvent = false;
        Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, FranchiseSuccessMyProfile, null);
    });


    $('#myProfileViewbtn').on('click', function () {
        $('#myProfileModal').modal('show');
    });

    $('#AddUserModalClose').on('click', function () {
        $('#AddUserModal').hide();
        $('#ManageUserModal').show();
    });

    $('#ChangePassOpen').on('click', function () {
        Common.removevalidation('ChangePassForm');
        $('#ChangePassModal').show();
        $('#myProfileModal').hide();
        $('#ChangePassForm #OldPassword,#NewPassword,#ConfirmPassword').attr('type', 'password');
        $('#ToggleEyeOld,#ToggleEyeNew,#ToggleEyeConfirm').removeClass('fa-eye-slash').addClass('fa-eye');
    });

    $('#PassModalClose').on('click', function () {
        $('#ChangePassModal').hide();
        $('#ChangePassForm')[0].reset();
        $('#OldPassword,#NewPassword,#ConfirmPassword').removeClass('error-message');
        $('#OldPassword-error,#NewPassword-error,#ConfirmPassword-error').remove();
        $('#myProfileModal').show();
    });

    $('#ToggleEyeOld').click(function () {
        var passwordField = $('#OldPassword');
        var icon = $(this);
        togglePassword(passwordField, icon);
    });

    $('#ToggleEyeNew').click(function () {
        var passwordField = $('#NewPassword');
        var icon = $(this);
        togglePassword(passwordField, icon);
    });

    $('#ToggleEyeConfirm').click(function () {
        var passwordField = $('#ConfirmPassword');
        var icon = $(this);
        togglePassword(passwordField, icon);
    });
    $('#ManageUserEye').click(function () {
        var passwordField = $('#Password');
        var icon = $(this);
        togglePassword(passwordField, icon);
    });
    $('#OldPassword,#NewPassword,#ConfirmPassword, #Password').on("cut copy paste", function (e) {
        e.preventDefault();
    });

    $('#input-lk-text-enb-dis-btn').click(function () {
        $("#input-lk-text-enb-dis").focus();
        $("#input-lk-text-enb-dis").toggleClass("input-lk-inputbox");
        $("#input-lk-text-enb-dis").attr('disabled', !$("#input-lk-text-enb-dis").attr('disabled'));
        $("#input-lk-text-enb-dis-btn").css("display", "none");
    });

    $(document).on('click', '#UpdateProfile', function () {
        event.preventDefault();
        if ($("#FormMyProfile").valid()) {
            var UpdateData = JSON.parse(JSON.stringify(jQuery('#FormMyProfile').serializeArray()));
            var objvalue = {};
            $.each(UpdateData, function (index, item) {
                objvalue[item.name] = item.value;
            });
            if ($('#EmployeeImage').get(0).files?.length > 0) {
                objvalue.UserImageFileName = $("#EmployeeImage").get(0).files[0].name;
            }
            objvalue.ContactNumber = $('#input-lk-text-enb-dis').val();
            objvalue.ExistingImage = $('#UserImageFilePath').text();
            objvalue.UserImageFileName = $('#EmployeeImage').get(0)?.files[0]?.name;
            Common.ajaxCall("POST", "/Myprofile/UpdateProfile", JSON.stringify(objvalue), ProfileInsertSuccess, null);
        }
    });

    $("#ChangePassForm").validate({
        rules: {
            OldPassword: {
                required: true,
                minlength: 5
            },
            NewPassword: {
                required: true,
                minlength: 5
            },
            ConfirmPassword: {
                required: true,
                equalTo: "#NewPassword"
            }
        },
        messages: {
            OldPassword: {
                required: "Old Password is required.",
                minlength: "Old Password must be at least 5 characters."
            },
            NewPassword: {
                required: "New Password is required.",
                minlength: "New Password must be at least 5 characters."
            },
            ConfirmPassword: {
                required: "Confirm Password is required.",
                equalTo: "New Password and Confirm Password must match."
            }
        },
        errorElement: "label",
        errorClass: "error-message",
        errorPlacement: function (error, element) {
            element.closest(".form-group").append(error);
        },
        highlight: function (element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid");
        }
    });


    $("#SaveChangePass").click(function () {

        if ($("#ChangePassForm").valid()) {

            var InsertData = JSON.parse(JSON.stringify(jQuery('#ChangePassForm').serializeArray()));
            var objvalue = {};
            $.each(InsertData, function (index, item) {
                objvalue[item.name] = item.value;
            });
            Common.ajaxCall("POST", "/MyProfile/UpdateChangePassword", JSON.stringify(objvalue), InsertSuccess, null);
        }
    });


    $("#SaveManageUser").click(function (e) {
        if (!Common.validateEmailwithErrorwithParent('ManageUserForm', 'Email')) {
            return false;
        }

        const checkedCount = $('#BindFranchiseDataProfile input[type="checkbox"]:checked').length;

        if (checkedCount === 0) {
            e.preventDefault();
            Common.warningMsg("Please select at least one Franchise.");
            return false;
        }

        if ($("#ManageUserForm").valid()) {
            if (InfoId == 0) {
                var UpdateData = JSON.parse(JSON.stringify(jQuery('#ManageUserForm').serializeArray()));
                var objvalue = {};
                $.each(UpdateData, function (index, item) {
                    objvalue[item.name] = item.value;
                });
                if ($('#imageUpload').get(0).files?.length > 0) {
                    objvalue.UserImageFileName = $("#imageUpload").get(0).files[0].name;
                }
                objvalue.UserGroupId = parseInt($('#UserGroupId').val());
                objvalue.UserTypeId = parseInt($('#ManageUserForm #UserTypeId').val());
                objvalue.ContactId = parseInt($('#ContactId').val()) || null;
                objvalue.UserImageFileName = $('#imageUpload').get(0)?.files[0]?.name;

                if (objvalue.UserImageFileName == undefined) {
                    objvalue.UserImageFileName = null;
                }

                var DepartmentMapping = [];
                var departmentId = $('#DepartmentDetailsId').val();

                // Check if departmentId is an array and contains values
                if (Array.isArray(departmentId) && departmentId.length > 0) {
                    departmentId.forEach(function (machine) {
                        var parsedMachine = parseInt(machine.trim(), 10);

                        // Check if parsedMachine is a valid number
                        if (!isNaN(parsedMachine)) {
                            DepartmentMapping.push({
                                UserDepartmentMappingId: null,
                                DepartmentId: parsedMachine, // Use parsedMachine as DepartmentId
                                UserId: parseInt(InfoId) || null, // Assign UserId or null
                                IsSelected: true,
                            });
                        }
                    });
                }

                var FranchiseList = [];
                var ClosestDivProductList = $('.expensefild #BindFranchiseDataProfile input[type="checkbox"]:checked');

                $.each(ClosestDivProductList, function (index, element) {
                    var UserfranchiseMappingId = $(element).siblings('.ProductMappingId').text();
                    var UserId = InfoId;
                    var franchiseId = $(element).data('id');
                    var IsActive = $(element).prop('checked');

                    FranchiseList.push({
                        UserfranchiseMappingId: parseInt(UserfranchiseMappingId) || null,
                        UserId: parseInt(UserId) || null,
                        franchiseId: franchiseId,
                        IsActive: IsActive,
                    });
                });

                objvalue.userFranchiseMappingDetails = FranchiseList;
                objvalue.userDepartmentMappingDetails = DepartmentMapping;

                Common.ajaxCall("POST", "/Myprofile/InsertUser", JSON.stringify(objvalue), UserInsertSuccess, null);

            } else {
                var InsertData = JSON.parse(JSON.stringify(jQuery('#ManageUserForm').serializeArray()));
                var objvalue = {};
                $.each(InsertData, function (index, item) {
                    objvalue[item.name] = item.value;
                });
                if ($('#imageUpload').get(0).files?.length > 0) {
                    objvalue.UserImageFileName = $("#imageUpload").get(0).files[0].name;
                }
                objvalue.UserId = parseInt(InfoId);
                objvalue.UserGroupId = parseInt($('#UserGroupId').val());
                objvalue.UserTypeId = parseInt($('#ManageUserForm #UserTypeId').val());
                objvalue.ContactId = parseInt($('#ContactId').val()) || null;
                objvalue.ExistingImage = $('#UserPathExist').text();
                objvalue.UserImageFileName = $('#imageUpload').get(0)?.files[0]?.name;

                if (objvalue.UserImageFileName == undefined) {
                    objvalue.UserImageFileName = null;
                }

                var DepartmentMapping = [];
                var departmentId = $('#DepartmentDetailsId').val();

                // Check if departmentId is an array and contains values
                if (Array.isArray(departmentId) && departmentId.length > 0) {
                    departmentId.forEach(function (machine) {
                        var parsedMachine = parseInt(machine.trim(), 10);
                        if (!isNaN(parsedMachine)) {
                            DepartmentMapping.push({
                                UserDepartmentMappingId: parsedMachine,
                                DepartmentId: parsedMachine,
                                UserId: parseInt(InfoId) || null, 
                                IsSelected: true,
                            });
                        }
                    });
                }

                var FranchiseList = [];
                var ClosestDivProductList = $('.expensefild #BindFranchiseDataProfile input[type="checkbox"]:checked');

                $.each(ClosestDivProductList, function (index, element) {
                    var UserfranchiseMappingId = $(element).siblings('.ProductMappingId').text();
                    var UserId = InfoId;
                    var franchiseId = $(element).data('id');
                    var IsActive = $(element).prop('checked');

                    FranchiseList.push({
                        UserfranchiseMappingId: null,
                        UserId: parseInt(UserId) || null,
                        franchiseId: franchiseId,
                        IsActive: IsActive,
                    });
                });

                objvalue.userFranchiseMappingDetails = FranchiseList;
                objvalue.userDepartmentMappingDetails = DepartmentMapping;

                Common.ajaxCall("POST", "/Myprofile/UpdateUser", JSON.stringify(objvalue), UserInsertSuccess, null);
            }
        }
    });

    $(document).on("input", '#ManageUserForm #Email', function (event) {
        if (Common.validateEmailwithErrorwithParent('ManageUserForm', 'Email')) {
            $('#ManageUserForm #Email-error').remove();
        }
    });

    $('#DeleteManageUser').on('click', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var editdata = { UserId: InfoId };
            Common.ajaxCall("GET", "/Myprofile/DeleteUserId", editdata, UserDeleteSuccess, null);
        }
    });

    $('#myProfileClose').on('click', function () {
        $('#UserFranchiseMappingId').val($('#UserFranchiseMappingId option:first').val()).trigger('change');
        $('#myProfileModal').modal('hide');
    });
});



function togglePassword(passwordField, icon) {
    if (passwordField.attr('type') === 'password') {
        passwordField.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        passwordField.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
}
function profileSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'FormMyProfile');
        $('#input-lk-text-enb-dis').val(data[0][0].ContactNumber);
        setTimeout(function () {
            if (data[0] != null && data[0].length > 0 && data[0][0].UserImageFilePath != null && data[0][0].UserImageFilePath != "" && data[0][0].UserImageFilePath) {
                $('#ProfileImage').attr('src', data[0][0].UserImageFilePath);

                var namespan = $('.nav-item #LandingUserImage').eq(0);
                $(namespan).attr('src', data[0][0].UserImageFilePath);
                var userimg = $('.avatar-lg #UserImage').eq(0);
                $(userimg).attr('src', data[0][0].UserImageFilePath);
            } else {
                $('#ProfileImage').attr('src', '/assets/commonimages/user.png');
            }
        }, 200);

    }
}

function previewFile() {
    var input = $("#EmployeeImage")[0];
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#ProfileImage").attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function userPreviewFile() {
    var input = $("#imageUpload")[0];
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#imagePreview").attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function ProfileInsertSuccess(response) {
    var imageguid = "";
    if (response.status) {
        imageguid = response.data;
        $('#ProfileImage').attr('src', "../BuyerImage/" + imageguid);
        Common.successMsg(response.message);
        var fileUpload = $("#EmployeeImage").get(0);
        var files = fileUpload.files;
        Common.fileupload(files, imageguid, null);
        //$("#loader-pms").fadeIn();
        setTimeout(function () {
            Common.ajaxCall("GET", "/Myprofile/GetMyprofile", null, profileSuccess, null);
            //$("#loader-pms").delay(100).fadeOut();
        }, 500);
        $('#input-lk-text-enb-dis').removeClass('input-lk-inputbox');
        $('#input-lk-text-enb-dis-btn').show();
    }
    else {
        Common.errorMsg(response.message);
    }
}
function InsertSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#ChangePassModal').hide();
        $('#myProfileModal').show();
        Common.ajaxCall("GET", "/Myprofile/GetMyprofile", null, profileSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

function UserInsertSuccess(response) {
    var imageguid = "";
    if (response.status) {
        imageguid = response.data;
        $('#imagePreview').attr('src', "../BuyerImage/" + imageguid);
        Common.successMsg(response.message);
        var fileUpload = $("#imageUpload").get(0);
        var files = fileUpload.files;
        Common.fileupload(files, imageguid, null);
        $('#AddUserModal').hide();
        //$("#loader-pms").fadeIn();

        //titleForHeaderTab = "Company User";
        setTimeout(function () {
            Common.ajaxCall("GET", "/Myprofile/GetManageUser", { ModuleName: titleForHeaderTab }, ManageUserSuccess, null);
            $('#ManageUserModal').show();
            //$("#loader-pms").delay(100).fadeOut();
        }, 1100);
    }
    else {
        Common.errorMsg(response.message);
    }
}

function ManageUserSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        $('#CompanyUserCount').text('(' + data[1][1].CompanyUserCount + ')');
        $('#FranchiseUserCount').text('(' + data[1][2].CompanyUserCount + ')');
        $('#VendorUserCount').text('(' + data[1][3].CompanyUserCount + ')');
        $('#ClientUserCount').text('(' + data[1][0].CompanyUserCount + ')');
        
        var manageUser = '';
        $('#ManageUserDynamic').html('');
        if (data[0][0].UserId != null && data[0][0].UserId != "") {
            data[0].forEach(function (user) {
                if (user.UserId > 0) {
                    var backgroundColor = "";
                    if (user.UserGroupName == "SuperAdmin") {
                        backgroundColor = '#beebed';
                    }
                    else if (user.UserGroupName == "Admin") {
                        backgroundColor = '#f5b0e09c';
                    }
                    else if (user.UserGroupName == "GeneralUser") {
                        backgroundColor = '#1558f321';
                    }
                    else if (user.UserGroupName == "Vendor") {
                        backgroundColor = '#bdeead63';
                    }
                    else if (user.UserGroupName == "Client") {
                        backgroundColor = '#eed4ad63';
                    } else if (user.UserGroupName == "Executive") {
                        backgroundColor = '#00000021';
                    }
                    else {
                        backgroundColor = '#f0ede963';
                    }

                    var divImage = '';
                    if (user.UserImageFilePath != null && user.UserImageFilePath != "" && user.UserImageFilePath != undefined) {
                        divImage = `<img src="${user.UserImageFilePath}" class="avatar-img rounded-circle">`;
                    } else {
                        // Set the default images based on UserGroupTypeName
                        switch (user.UserGroupTypeName) {
                            case "Company User":
                                divImage = `<img src="/assets/commonimages/user.png" class="avatar-img rounded-circle">`;
                                break;
                            case "Franchise User":
                                divImage = `<img src="/assets/commonimages/franchise.svg" class="avatar-img rounded-circle">`;
                                break;
                            case "Vendor":
                                divImage = `<img src="/assets/commonimages/vendor.svg" class="avatar-img rounded-circle">`;
                                break;
                            case "Client":
                                divImage = `<img src="/assets/commonimages/client.svg" class="avatar-img rounded-circle">`;
                                break;
                            default:
                                divImage = `<img src="/assets/commonimages/default.svg" class="avatar-img rounded-circle">`; // You can set a default image if needed
                                break;
                        }
                    }
                    let displayName = user.UserName.length > 17 ? user.UserName.substring(0, 18) + ". . .": user.UserName;
                    manageUser += `
                    <div class="col-sm-6 col-md-4 managee-user-sepe-grid">
                        <a href="#" onclick="manageUserClick(${user.UserId}); return false;">
                            <div class="box_shadow card card-stats card-round p-0" style="margin-bottom: 20px !important;">
                                <div class="card-body p-0-imp" style="box-shadow: 5px;background-color: ${backgroundColor};">
                                    <div class="row">
                                        <div class="col-3 col-sm-3 col-md-3 ml-1">
                                            <div class="icon-big text-center">
                                                <div class="avatar-sm mb-2">
                                                    ${divImage}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-9 col-sm-9 col-md-9 mt-2 userDetails">
                                            <div class="">
                                                <p class="card-category">${displayName}</p>
                                                <p class="card-category">${user.ContactNo}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    `;
                }
            });
            $('#ManageUserDynamic').append(manageUser);
        }
        else {
            $('#ManageUserDynamic').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        }
        $('.navbar-tab').removeClass('active');
        $('.navbar-tab').each(function () {
            if ($(this).text().trim().replace(/\s*\(\d+\)$/, '') === titleForHeaderTab) {
                $(this).addClass('active');
            }
        });
        //if (titleForHeaderTab == "Company User") {
        //    $('#lableForUserGroup').removeClass('col-9');
        //    $('#lableForUserGroup').addClass('col-9 d-flex mt-3');
        //    $('#lableForUserGroup').show();
        //    $('#AlaginClass').addClass('col-3');
        //    $('#AlaginClass').removeClass('col-12');
        //}
    }
}

function FranchiseGetSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var htmlDynamicFranchise = "";
        if (data[0][0].FranchiseId != null && data[0][0].FranchiseId != "") {
            $.each(data[0], function (index, franchiseData) {
                var FranchiseId = franchiseData.FranchiseId;
                var FranchiseName = franchiseData.FranchiseName;
                var IsActiveCheck = franchiseData.IsActive == true ? 'checked' : '';

                htmlDynamicFranchise += `
                <div class="col-md-6 col-lg-6 col-sm-6 col-4 mt-2">
                    <lable class="FranchiseMappingId d-none"></lable>
                    <input type="checkbox" data-id="${FranchiseId}" name="products" ${IsActiveCheck} id="product-${FranchiseId}">
                    <label for="product-${FranchiseId}" class="checkbox-label">${FranchiseName}</label>
                </div>
            `;
            });
            $('#BindFranchiseDataProfile').append(htmlDynamicFranchise);
        }
        else {
            $('#BindFranchiseDataProfile').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        }
    }
}

function FranchiseSuccessMyProfile(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var htmlDynamicFranchise = "";
        if (data[0][0].FranchiseId != null && data[0][0].FranchiseId != "") {
            $.each(data[0], function (index, franchiseData) {
                var FranchiseId = franchiseData.FranchiseId;
                var FranchiseName = franchiseData.FranchiseName;
                var IsActiveCheck = franchiseData.IsActive == true ? 'checked' : '';

                htmlDynamicFranchise += `
                <div class="col-md-6 col-lg-6 col-sm-6 col-4 mt-2">
                    <lable class="FranchiseMappingId d-none"></lable>
                    <input type="checkbox" data-id="${FranchiseId}" name="products" ${IsActiveCheck} id="product-${FranchiseId}">
                    <label for="product-${FranchiseId}" class="checkbox-label">${FranchiseName}</label>
                </div>
            `;
            });
            $('#BindFranchiseDataProfile').append(htmlDynamicFranchise);
        }
        else {
            $('#BindFranchiseDataProfile').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        }
    }
}


var InfoId = 0;
function manageUserClick(userId) {
    if (userId != null) {
        $('#ManageUserModal').hide();
        InfoId = userId;
        if (titleForHeaderTab == "") {
            titleForHeaderTab = "Company User";
        }
        else {
            titleForHeaderTab;
        }
        var editdata = { UserId: userId, ModuleName: titleForHeaderTab };
        Common.ajaxCall("GET", "/Myprofile/GetManageUserId", editdata, UserEditSuccess, null);
    }
}

var ignoreUserTypeChangeEvent = false;

function UserEditSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.removevalidation('ManageUserForm');
        $('#ManageUserForm #Password').attr('type', 'password');
        $('#ManageUserEye').removeClass('fa-eye-slash').addClass('fa-eye');
        $('#DeleteManageUser').show();
        $('#SaveManageUser').val('Update').removeClass('btn-success').addClass('btn-update');
        $('#BindFranchiseDataProfile').empty('');
        Common.bindParentData(data[0], 'ManageUserForm');


        $('#UserPathExist').text(data[0][0].UserImageFilePath);
        if (data[0] != null && data[0].length > 0 && data[0][0].UserImageFilePath != null && data[0][0].UserImageFilePath != "" && data[0][0].UserImageFilePath) {
            $('#imagePreview').attr('src', data[0][0].UserImageFilePath);
        } else {
            $('#imagePreview').attr('src', '/assets/commonimages/user.png');
        }

        $('#ManageUserForm #UserTypeId').val(data[0][0].UserTypeId).trigger('change');
        ignoreUserTypeChangeEvent = true;

        setTimeout(function () {
            $('#ManageUserForm #UserGroupId').val(data[0][0].UserGroupId);
        }, 300);

        $('#AddUserModal').show();
        setTimeout(function () {
            $('#ContactId').val(data[0][0].ContactId);
        }, 300);

        if (data[2][0].DepartmentId != null) {
            var SelectedValues = data[2].map(item => item.DepartmentId.toString());
            $('#DepartmentDetailsId').val(SelectedValues).trigger('change');
        }

        var htmlDynamicFranchise = "";
        if (data[1][0].FranchiseId != null && data[1][0].FranchiseId != "") {
            $.each(data[1], function (index, Franchise) {
                var franchiseId = Franchise.FranchiseId;
                var userFranchiseMappingId = Franchise.UserFranchiseMappingId;
                var franchiseName = Franchise.FranchiseName;
                var isCheck = Franchise.IsActive == true ? 'checked' : '';

                htmlDynamicFranchise += `
                <div class="col-md-6 col-lg-6 col-sm-6 col-4 mt-2">
                    <lable class="ProductMappingId d-none">${userFranchiseMappingId}</lable>
                    <input type="checkbox" data-id="${franchiseId}" name="products" value="${franchiseName}" ${isCheck} id="product-${franchiseId}">
                    <label for="product-${franchiseId}" class="checkbox-label">${franchiseName}</label>
                </div>
            `;
            });
            $('#BindFranchiseDataProfile').append(htmlDynamicFranchise);
        }
        else {
            $('#BindFranchiseDataProfile').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        }
    }
}

function UserDeleteSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#AddUserModal').hide();
        $('#ManageUserModal').show();
        Common.ajaxCall("GET", "/Myprofile/GetManageUser", { ModuleName: titleForHeaderTab }, ManageUserSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

$(document).on('click', '.navbar-tab', function () {
    
    //if (titleForHeaderTab == "Client") {
    //    $('#lableForUserGroup').removeClass('col-9 d-flex mt-3');
    //    $('#lableForUserGroup').addClass('col-9');
    //    $('#lableForUserGroup').hide();
    //    $('#AlaginClass').addClass('col-12');
    //    $('#AlaginClass').removeClass('col-3');
    //}
    //else if (titleForHeaderTab == "Vendor") {
    //    $('#lableForUserGroup').removeClass('col-9 d-flex mt-3');
    //    $('#lableForUserGroup').addClass('col-9');
    //    $('#lableForUserGroup').hide();
    //    $('#AlaginClass').addClass('col-12');
    //    $('#AlaginClass').removeClass('col-3');
    //}
    //else if (titleForHeaderTab == "Company User" || titleForHeaderTab == "Franchise User") {
    //    $('#lableForUserGroup').removeClass('col-9');
    //    $('#lableForUserGroup').addClass('col-9 d-flex mt-3');
    //    $('#lableForUserGroup').show();
    //    $('#AlaginClass').addClass('col-3');
    //    $('#AlaginClass').removeClass('col-12');
    //}

    titleForHeaderTab = $(this).text().trim().replace(/\s*\(\d+\)$/, '');

    $('.navbar-tab').removeClass('active');
    // Find the tab that matches the titleForHeaderTab and add the 'active' class
    $(this).each(function () {
        if ($(this).text().trim().replace(/\s*\(\d+\)$/, '') === titleForHeaderTab) {
            $(this).addClass('active');
        }
        else if ($(this).text().trim() === titleForHeaderTab) {

        }
    });
    Common.ajaxCall("GET", "/Myprofile/GetManageUser", { ModuleName: titleForHeaderTab }, ManageUserSuccess, null);
});
$(document).on('change', '#ManageUserForm #UserTypeId', function () {

    if (ignoreUserTypeChangeEvent) {
        ignoreUserTypeChangeEvent = false;
        return; 
    }

    var thisVal = parseInt($(this).val());
    var imageSrc = $('#imagePreview').attr('src');
    $('#DepartmentDetailsId').val('').trigger('change');

    if (thisVal == 1) {
        if (imageSrc === '/assets/commonimages/user.png' || imageSrc === '/assets/commonimages/client.svg' || imageSrc === '/assets/commonimages/franchise.svg' || imageSrc === '/assets/commonimages/vendor.svg') {
            $('#imagePreview').attr('src', '/assets/commonimages/user.png');
        }
        $('#ClientVendorhide').hide();
        $('#DepartmentManageUserhide').show();
        $('.LableName').text('');
    }
    else if (thisVal == 2) {
        if (imageSrc === '/assets/commonimages/user.png' || imageSrc === '/assets/commonimages/client.svg' || imageSrc === '/assets/commonimages/franchise.svg' || imageSrc === '/assets/commonimages/vendor.svg') {
            $('#imagePreview').attr('src', '/assets/commonimages/franchise.svg');
        }
        $('#ClientVendorhide').hide();
        $('#DepartmentManageUserhide').show();
        $('.LableName').text('');
    }
    else if (thisVal == 3) {
        if (imageSrc === '/assets/commonimages/user.png' || imageSrc === '/assets/commonimages/client.svg' || imageSrc === '/assets/commonimages/franchise.svg' || imageSrc === '/assets/commonimages/vendor.svg') {
            $('#imagePreview').attr('src', '/assets/commonimages/vendor.svg');
        }
        $('#ClientVendorhide').show();
        $('#DepartmentManageUserhide').hide();
        $('.LableName').text('Vendor Name');
        var ValueOfContactDropDown = parseInt(thisVal);
        getvalContactDetailsResponse(ValueOfContactDropDown);
    }
    else if (thisVal == 4) {
        if (imageSrc === '/assets/commonimages/user.png' || imageSrc === '/assets/commonimages/client.svg' || imageSrc === '/assets/commonimages/franchise.svg' || imageSrc === '/assets/commonimages/vendor.svg') {
            $('#imagePreview').attr('src', '/assets/commonimages/client.svg');
        }
        $('#ClientVendorhide').show();
        $('#DepartmentManageUserhide').hide();
        $('.LableName').text('Client Name');
        var ValueOfContactDropDown = parseInt(thisVal);
        getvalContactDetailsResponse(ValueOfContactDropDown);
    }
    else {
        $('#imagePreview').attr('src', '/assets/commonimages/user.png');
        $('#ClientVendorhide').hide();
        $('.LableName').text('');
        $('#DepartmentManageUserhide').hide();
    }

    Common.ajaxCall("GET", "/Myprofile/GetUserGroupDetails", { UserTypeId: thisVal }, function (response) {
        if (response != null) {
            var data = JSON.parse(response.data);
            $('#ManageUserForm #UserGroupId').empty();

            if (data != null && data.length > 0) {
                var dataValue = data[0];
                var valueproperty = Object.keys(dataValue[0])[0];
                var textproperty = Object.keys(dataValue[0])[1];

                // If the selected UserTypeId is vendor or client, don't add '--Select--', just preselect the first item
                if (thisVal == 3 || thisVal == 4) {
                    var firstOption = dataValue[0];
                    // Append the first option to the select
                    $('#ManageUserForm #UserGroupId').append($('<option>', {
                        value: firstOption[valueproperty],
                        text: firstOption[textproperty],
                    }).prop('selected', true)); // Mark the first option as selected

                    // Disable the entire select input
                    $('#ManageUserForm #UserGroupId').prop('disabled', true);
                } else {
                    // For other types, include '--Select--'
                    $('#ManageUserForm #UserGroupId').append($('<option>', {
                        value: '',
                        text: '--Select--',
                    }));
                    $.each(dataValue, function (index, item) {
                        $('#ManageUserForm #UserGroupId').append($('<option>', {
                            value: item[valueproperty],
                            text: item[textproperty],
                        }));
                    });
                    $('#ManageUserForm #UserGroupId').prop('disabled', false);
                }
            } else {
                $('#ManageUserForm #UserGroupId').append($('<option>', {
                    value: '',
                    text: '--Select--',
                }));
                $('#ManageUserForm #UserGroupId').prop('disabled', false);
            }
        }
    }, null);
});

function getvalContactDetailsResponse(IdValues) {
    var $ContactDropdown = $('#ContactId');
    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(IdValues), ModuleName: 'UserTypeByContact' }, function (response) {
        if (response != null) {
            $ContactDropdown.empty().prop('disabled', false);
            var data = JSON.parse(response.data);
            $ContactDropdown.empty();
            var dataValue = data[0];
            if (dataValue != null && dataValue.length > 0 && data[0][0].ContactId != null) {
                var valueproperty = Object.keys(dataValue[0])[0];
                var textproperty = Object.keys(dataValue[0])[1];
                $ContactDropdown.append($('<option>', {
                    value: '',
                    text: '--Select--',
                }));
                $.each(dataValue, function (index, item) {
                    $ContactDropdown.append($('<option>', {
                        value: item[valueproperty],
                        text: item[textproperty],
                    }));
                });
            } else {
                $ContactDropdown.append($('<option>', {
                    value: '',
                    text: '--Select--',
                }));
            }
        }
    });
}

$(function () {
    $('.multi-select').each(function () {
        $(this).select2({
            theme: 'bootstrap4',
            width: 'style',
            placeholder: $(this).attr('placeholder'),
            allowClear: Boolean($(this).data('allow-clear')),
        });
    });
});

$("#ManageUserForm").validate({
    errorPlacement: function (error, element) {
        if (element.hasClass("select2-hidden-accessible")) {
            error.insertAfter(element.next(".select2-container"));
        } else {
            error.insertAfter(element);
        }
    },
    rules: {
        AttendanceMachineId: {
            required: true
        },
    },
    messages: {
        AttendanceMachineId: {
            required: "This field is required."
        },
    }
});