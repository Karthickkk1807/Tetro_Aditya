var ticketId = 0;
var createdById = 0;
var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
var formDataMultiple = new FormData();
var NameDropdown = [];

$(document).ready(function () {

    Common.bindDropDownParent('TickectingTypeId', 'TicketingInfoForm', 'TickectingType');
    Common.bindDropDownParent('ExternalTypeId', 'TicketingInfoForm', 'ExternalType');
    Common.bindDropDownParent('VendorId', 'TicketingInfoForm', 'Vendor');
    Common.bindDropDownParent('ClientId', 'TicketingInfoForm', 'Client');
    Common.bindDropDownParent('ModuleTypeId', 'TicketingInfoForm', 'TicketModuleType');
    Common.bindDropDownParent('AssignedToId', 'TicketingInfoForm', 'AssignedTo');
    Common.bindDropDownParent('TicketStatusId', 'TicketingInfoForm', 'TicketStatus');
    Common.bindDropDownParent('CreatedById', 'TicketingInfoForm', 'CreatedByEmpName');

    $('#TicketingInfoForm #StatusHide').hide();

    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(null), ModuleName: 'FollowupEmpName' }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            NameDropdown = [data[0]];
        }
    }, null);

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    var fnData = Common.getDateFilter('dateDisplay2');

    $('#AddAttachment').hide();

    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var EditDataId = { TicketId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
    Common.ajaxCall("GET", "/Ticketing/GetTicketing", EditDataId, TicketSuccess, null);

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#OtherChargesDropDown').length && !target.closest('#OtherchargesAdd').length) {
            $('#OtherChargesDropDown').css('display', 'none');
        }
    });

    $(document).on('click', function (event) {
        var $target = $(event.target);
        if (!$target.closest('.dropdown-menu').length && !$target.closest('#dropdownMenuButton2').length) {
            $('.dropdown-menu').removeClass('show');
        }
    });

    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('#ShareDropdownitems').length && !target.closest('#btnsharePorder').length) {
            $('#ShareDropdownitems').css('display', 'none');
        }
    });

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();

        var fnData = Common.getDateFilter('dateDisplay2');
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        if ($('#ToVendorGrid').hasClass('purchaseactive')) {
            TypeId = 1;
        } else if ($('#FromDistributorGrid').hasClass('purchaseactive')) {
            TypeId = 2;
        }

        var EditDataId = { TicketId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Ticketing/GetTicketing", EditDataId, TicketSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { TicketId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Ticketing/GetTicketing", EditDataId, TicketSuccess, null);
    });

    function updateMonthDisplay(date) {
        let monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear();
        $('#dateDisplay2').text(month + " " + year);

        let now = new Date();
        let currentMonth = now.getMonth();
        let currentYear = now.getFullYear();

        if (date.getFullYear() > currentYear || (date.getFullYear() === currentYear && date.getMonth() >= currentMonth)) {
            $('#increment-month-btn2').hide();
        } else {
            $('#increment-month-btn2').show(); // Show again if going back to previous months
        }
    }

    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
            var EditDataId = { TicketId: null, FranchiseId: FranchiseMappingId, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString() };
            Common.ajaxCall("GET", "/Ticketing/GetTicketing", EditDataId, TicketSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);

        var EditDataId = { TicketId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Ticketing/GetTicketing", EditDataId, TicketSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });


    $(document).on('click', '#AddTicketing', function () {
        ticketId = 0;
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#TicketingCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#TicketingCanvas").css("width", "50%");
        } else {
            $("#TicketingCanvas").css("width", "39%");
        }
        formDataMultiple = new FormData();
        $('#fadeinpage').addClass('fadeoverlay');
        Common.removevalidation('TicketingInfoForm');
        Common.removevalidation('FormFollowUpInfo');
        $("#TicketingHeader").text('Add Manual Ticketing Details');
        $('#TickectingTypeId').val('1').trigger('change');
        $('#TickectingTypeId').prop('disabled', false);
        $('#selectedFiles,#ExistselectedFiles').empty('');
        const today = new Date().toISOString().split('T')[0];
        $("#TicketDate").val(today);
        //$("#TicketDate").attr("max", today).val(today);
        $('#BindFollowupInfo').empty('');
        $('#TicketingInfoForm #StatusHide').hide();
        $('#CreatedById').val(UserName);
        $('#SaveTicketing').text('Save');
        $('#HidingDynamicRow').hide();
        $('#SaveTicketing').removeClass('btn-update').addClass('btn-success');
        $('#Attachrow').removeClass('col-lg-8 col-md-8 col-sm-8 col-8 mt-2').addClass('col-lg-12 col-md-12 col-sm-12 col-12 mt-2');
        DynamicHtml();
        var EditDataId = { ModuleName: 'Ticket', FranchiseId: FranchiseMappingId };
        Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                $('#TicketNo').val(data[0][0].TicketNo);
            };
        });
    });

    $(document).on('click', '.btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#TicketingCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#TicketingCanvas").css("width", "50%");
        } else {
            $("#TicketingCanvas").css("width", "39%");
        }
        formDataMultiple = new FormData();
        Common.removevalidation('TicketingInfoForm');
        Common.removevalidation('FormFollowUpInfo');
        $('#SaveTicketing').text('Update');
        $('#fadeinpage').addClass('fadeoverlay');
        $("#TicketingHeader").text('Edit Ticketing Details');
        $('#BindFollowupInfo').empty('');
        $('#selectedFiles,#ExistselectedFiles').empty('');
        $('#TicketingInfoForm #StatusHide').show();
        $('#TickectingTypeId').val('');
        $('#TickectingTypeId').prop('disabled', false);
        $('#Attachrow').removeClass('col-lg-12 col-md-12 col-sm-12 col-12 mt-2').addClass('col-lg-8 col-md-8 col-sm-8 col-8 mt-2');
        $('#SaveTicketing').removeClass('btn-success').addClass('btn-update');
        $('#HidingDynamicRow').show();
        ticketId = $(this).data('id');
        formDataMultiple = new FormData();

        var fnData = Common.getDateFilter('dateDisplay2');
        var EditDataId = { TicketId: parseInt(ticketId), FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Ticketing/GetTicketing", EditDataId, GetNotNullTicketSuccess, null);
    });
    
    $(document).on('change', '#TickectingTypeId', function () {
        var TypeId =parseInt($(this).val());
        if (TypeId == 1) {
            $('.ExternalTypeDiv,.VendorDiv,.ClientDiv').hide();
            $('.AssignedToDiv').show();
        } else if (TypeId == 2) {

            $('.ExternalTypeDiv').show();
            $('..VendorDiv,.ClientDiv').hide();
            $('.AssignedToDiv').hide();
            
        }
    });


    $(document).on('change', '#ExternalTypeId', function () {
        $('.AssignedToDiv').hide();
        var ExternalTypeId = parseInt($('#ExternalTypeId').val());
        if (ExternalTypeId == 1) {
            $('.VendorDiv').show();
            $('.ClientDiv').hide();
        } else if (ExternalTypeId == 2) {
            $('.VendorDiv').hide();
            $('.ClientDiv').show();
        } else {
            $('.VendorDiv').hide();
            $('.ClientDiv').hide();
        }
    });
    $(document).on('click', '#CloseTicketing', function () {
        $("#TicketingCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        $("#TicketingHeader").text('');
        Common.removevalidation('TicketingInfoForm');
        Common.removevalidation('FormFollowUpInfo');
    });

    $(document).on('click', '#SaveTicketing', function () {
        var FormValidation = $('#TicketingInfoForm').valid();
        var FormValidationDynamic = $('#FormFollowUpInfo').valid();
        if (FormValidation && FormValidationDynamic) {
            getExistFiles();

            var TicketDateString = $('#TicketingInfoForm #TicketDate').val();
            var TicketDate = new Date(TicketDateString);

            var TicketDetailsStatic = {
                TicketId: ticketId > 0 ? ticketId : null,
                CreatedById: createdById > 0 ? createdById : null,
                FranchiseId: FranchiseMappingId > 0 ? FranchiseMappingId : FranchiseMappingId,
                TicketNo: $('#TicketNo').val(),
                TickectingTypeId: parseInt($('#TickectingTypeId').val()),
                TicketDate: TicketDate,
                ModuleTypeId: parseInt($('#ModuleTypeId').val()),
                AssignedToId: parseInt($('#AssignedToId').val()),
                Query: $('#Query').val(),
                TicketStatusId: $('#TicketStatusId').val(),
            };

            var FollowupInfo = [];
            var DyanamicAttachment = [];
            var existFilesDyanamicAttachment = [];
            var ClosestDiv = $('#BindFollowupInfo .FollowupInfoDynamic');
            if (ticketId > 0) {
                $.each(ClosestDiv, function (index, values) {
                    var RowNumberTake = index + 1;

                    var getFollowUpEmpId = $(values).find('.NameId').val();
                    var getfollowupInfoDynamicId = $(values).find('.followupInfoDynamicId').data('id');
                    var getDate = $(values).find('.Date').val();
                    var getComments = $(values).find('.Comments').val();
                    FollowupInfo.push({
                        TicketFollowUpId: parseInt(getfollowupInfoDynamicId) || null,
                        TicketFollowUpDate: getDate,
                        FollowUpEmpId: parseInt(getFollowUpEmpId) || null,
                        Comments: getComments,
                        TicketId: parseInt(ticketId) || null,
                        RowNumber: parseInt(RowNumberTake) || null,
                    });

                    $(values).find('.download-button').each(function () {
                        var dataIdName = $(this).find('i').data('id');
                        if (dataIdName) {
                            DyanamicAttachment.push({
                                RowNumber: RowNumberTake,
                                AttachmentFileName: dataIdName
                            });
                        }
                    });

                    $(values).find('.existselectedFiles li').each(function () {
                        var attachmentId = $(this).find('.delete-buttonattach').attr('attachmentid');
                        var moduleRefId = $(this).find('.delete-buttonattach').attr('modulerefid');
                        var filePath = $(this).find('.download-link').attr('href');
                        var fileName = $(this).find('.download-link').attr('download');

                        if (fileName && filePath) {
                            existFilesDyanamicAttachment.push({
                                TicketFollowUpAttachmentId: parseInt(attachmentId),
                                TicketId: parseInt(ticketId),
                                TicketFollowUpId: parseInt(getfollowupInfoDynamicId) || null,
                                AttachmentFileName: fileName,
                                AttachmentFilePath: filePath,
                                AttachmentExactFileName: filePath,
                                RowNumber: RowNumberTake
                            });
                        }
                    });
                });
            }
            
            formDataMultiple.append("TicketDetailsStatic", JSON.stringify(TicketDetailsStatic));
            formDataMultiple.append("TicketFollowupDetailsArray", JSON.stringify(FollowupInfo));
            formDataMultiple.append("DyanamicAttachment", JSON.stringify(DyanamicAttachment));
            formDataMultiple.append("ExistFilesDyanamicAttachment", JSON.stringify(existFilesDyanamicAttachment));
            formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

            $.ajax({
                type: "POST",
                url: "/Ticketing/InsertUpdateTicketing",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        Common.successMsg(response.message);
                        $("#TicketingCanvas").css("width", "0%");
                        $('#fadeinpage').removeClass('fadeoverlay');
                        $("#TicketingHeader").text('');

                        var fnData = Common.getDateFilter('dateDisplay2');
                        var EditDataId = { TicketId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
                        Common.ajaxCall("GET", "/Ticketing/GetTicketing", EditDataId, TicketSuccess, null);

                        $('#selectedFiles,#ExistselectedFiles').empty('');
                        existFiles = []; s
                        formDataMultiple = new FormData();
                    }
                    else {
                        Common.errorMsg(response.message);
                        formDataMultiple = new FormData();
                    }
                },
                error: function (response) {
                    Common.errorMsg(response.message);
                    formDataMultiple = new FormData();
                }
            });
        }
    });

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var ticketId = $(this).data('id');
            Common.ajaxCall("GET", "/Ticketing/DeleteTicket", { TicketId: ticketId }, function (response) {
                console.log(response);  // Log the response to inspect its structure
                if (response.status) {
                    Common.successMsg(response.message);

                    var fnData = Common.getDateFilter('dateDisplay2');
                    var EditDataId = { TicketId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
                    Common.ajaxCall("GET", "/Ticketing/GetTicketing", EditDataId, TicketSuccess, null);
                }
            }, null);
        }
    });
});

function TicketSuccess(response) {
    var data = JSON.parse(response.data);
    var CounterBox = Object.keys(data[0][0]);

    $("#CounterTextBox1").text(CounterBox[0]);
    $("#CounterTextBox2").text(CounterBox[1]);
    $("#CounterTextBox3").text(CounterBox[2]);
    $("#CounterTextBox4").text(CounterBox[3]);

    $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
    $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
    $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
    $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

    var columns = Common.bindColumn(data[1], ['TicketId', 'Status_Color']);
    Common.bindTablePurchase('TicketingTable', data[1], columns, -1, 'TicketId', '330px', true, access);
    $('#loader-pms').hide();
}

function GetNotNullTicketSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
        createdById = data[0][0].CreatedById;
        $('#CreatedById').val (data[0][0].CreatedByName);

        var ulElement = $('#TicketingInfoForm #ExistselectedFiles');
        $('#ExistselectedFiles, #selectedFiles').empty();
        var ulElement = $('#ExistselectedFiles');
        $.each(data[1], function (index, file) {
            if (file.AttachmentId != null) {
                var truncatedFileName = file.AttachmentFileName.length > 10 ? file.AttachmentFileName.substring(0, 10) + '...' : file.AttachmentFileName;
                var liElement = $('<li>');
                var spanElement = $('<span>').text(truncatedFileName);
                var downloadLink = $('<a>').addClass('download-link')
                    .attr('href', file.AttachmentFilePath)
                    .attr('download', file.AttachmentFileName)
                    .html('<i class="fas fa-download"></i>');

                var deleteButton = $('<a>').attr({
                    'src': file.AttachmentFilePath,
                    'AttachmentId': file.AttachmentId,
                    'ModuleRefId': file.ModuleRefId,
                    'id': 'deletefile'
                }).addClass('delete-buttonattach').html('<i class="fas fa-trash"></i>');

                liElement.append(spanElement);
                liElement.append(downloadLink);
                liElement.append(deleteButton);
                ulElement.append(liElement);
            }
        });

        if (data[2] != null && data[2].length > 0 && data[2][0].FollowUpEmpId != null) {
            $.each(data[2], function (index, value) {
                let numberIncr = Math.random().toString(36).substring(2);
                var rowadd = $('.FollowupInfoDynamic').length
                var DynamicLableNo = rowadd + 1;
                var html = '';

                const formattedDate = formatToISODate(value.TicketFollowUpDate);

                var NameselectOptions = "";
                var defaultOption = '<option value="">--Select--</option>';

                if (NameDropdown != null && NameDropdown.length > 0 && NameDropdown[0].length > 0) {
                    NameselectOptions = NameDropdown[0].map(function (EmployeeId) {
                        var isSelected = EmployeeId.EmployeeId == value.FollowUpEmpId ? 'selected' : '';
                        return `<option value="${EmployeeId.EmployeeId}"  ${isSelected}>${EmployeeId.EmployeeName}</option>`;
                    }).join('');
                }
                if (data[3] != null && data[3].length > 0 && data[3][0].TicketId != null) {
                    var matchingAttachments = data[3].filter(att => att.RowNumber === value.RowNumber);
                    var existHtml = "";
                    existHtml = matchingAttachments.map(att => {
                        // Apply the truncation logic to the AttachmentFileName
                        const truncatedFileName = att.AttachmentFileName.length > 10 ? att.AttachmentFileName.substring(0, 10) + '...' : att.AttachmentFileName;

                        return `
                            <li>
                                <span>${truncatedFileName}</span>
                                <a class="download-link" href="${att.AttachmentFilePath}" download="${att.AttachmentFileName}">
                                    <i class="fas fa-download"></i>
                                </a>
                                <a src="${att.AttachmentFilePath}" attachmentid="${att.TicketFollowUpAttachmentId}" modulerefid="${att.TicketFollowUpId}" 
                                   id="deletefile" class="delete-buttonattach">
                                    <i class="fas fa-trash"></i>
                                </a>
                            </li>
                        `;
                    }).join('');
                }

                html =
                    `
                    <div class="row FollowupInfoDynamic">
                    <input type="hidden" class="followupInfoDynamicId" id="FollowupInfoDynamicId" name="FollowupInfoDynamicId" data-id="${value.TicketFollowUpId}">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                            <label class="DynamicLable">Followup Info ${DynamicLableNo}</label>
                        </div>
                        <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                            <div class="form-group">
                                <label>Date<span id="Asterisk">*</span></label>
                                <input type="date" class="form-control Date" id="Date${numberIncr}" name="Date${numberIncr}" value="${formattedDate}" required>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                            <div class="form-group">
                                <label>Name<span id="Asterisk">*</span></label>
                                <select class="form-control NameId" id="NameId${numberIncr}" name="NameId${numberIncr}" required>
                                    ${defaultOption}${NameselectOptions}
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12">
                            <div class="form-group">
                                <label>Comments</label>
                                <textarea class="form-control Comments" id="Comments${numberIncr}" name="Comments${numberIncr}" style="overflow-y: auto;" rows="2" oninput="Common.allowAllCharacters(this,250)">${value.Comments}</textarea>
                            </div>
                        </div>
                        <div class="col-lg-10 col-md-10 col-sm-10 col-6 mt-1" id="Attachrow">
                            <div class="border border-radius mt-2" style="background-color:#F1F0EF; max-height:10.5rem;height: 95px;">
                                <label class="d-flex justify-content-center align-content-center mt-1" style="text-decoration: underline; color: #7D7C7C;" onclick="Attachment('${numberIncr}')">
                                    <b class="attachlabel" style="white-space: nowrap; margin-left: 4px;">Click Here to Attach your files</b>
                                    <input type="file" id="fileInput${numberIncr}" multiple class="custom-file-input" hidden>
                                </label>
                                <div class="file-preview d-flex justify-content-center" id="preview${numberIncr}">
                                    <div class="attachrow">
                                        <div class="attachcolumn">
                                            <ul class="row justify-content-center px-3 mb-2" id="selectedFiles${numberIncr}"></ul>
                                        </div>
                                        <div class="attachcolumn existselectedFiles DynamicAttachment">
                                            <ul class="row justify-content-center px-3 mb-2" id="ExistselectedFiles${numberIncr}">${existHtml || ''}</ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-2 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                            <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                                <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </div>
                `;

                $('#BindFollowupInfo').append(html);
                updateRemoveButtons();
            });
        }
        else
            DynamicHtml();
    }
}

function DynamicHtml() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.FollowupInfoDynamic').length
    var DynamicLableNo = rowadd + 1;
    var html = '';

    var NameselectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (NameDropdown != null && NameDropdown.length > 0 && NameDropdown[0].length > 0) {
        NameselectOptions = NameDropdown[0].map(function (EmployeeId) {
            return `<option value="${EmployeeId.EmployeeId}">${EmployeeId.EmployeeName}</option>`;
        }).join('');
    }

    html = `
        <div class="row FollowupInfoDynamic">
        <input type="hidden" class="followupInfoDynamicId" id="FollowupInfoDynamicId" name="FollowupInfoDynamicId" data-id="0">
            <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                <label class="DynamicLable">Followup Info ${DynamicLableNo}</label>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Date<span id="Asterisk">*</span></label>
                    <input type="date" class="form-control Date" id="Date${numberIncr}" name="Date${numberIncr}" required>
                </div>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group">
                    <label>Name<span id="Asterisk">*</span></label>
                    <select class="form-control NameId" id="NameId${numberIncr}" name="NameId${numberIncr}" required>
                        ${defaultOption}${NameselectOptions}
                    </select>
                </div>
            </div>
            <div class="col-lg-12 col-md-12">
                <div class="form-group">
                    <label>Comments</label>
                    <textarea class="form-control Comments" id="Comments${numberIncr}" name="Comments${numberIncr}" style="overflow-y: auto;" rows="2" oninput="Common.allowAllCharacters(this,250)"></textarea>
                </div>
            </div>
            <div class="col-lg-10 col-md-10 col-sm-10 col-6 mt-1" id="Attachrow">
                <div class="border border-radius mt-2" style="background-color:#F1F0EF; max-height:10.5rem;height: 95px;">
                    <label class="d-flex justify-content-center align-content-center mt-1"
                           style="text-decoration: underline; color: #7D7C7C;"
                           onclick="Attachment('${numberIncr}')">
                        <b class="attachlabel" style="white-space: nowrap; margin-left: 4px;">Click Here to Attach your files</b>
                        <input type="file" id="fileInput${numberIncr}" multiple class="custom-file-input" hidden>
                    </label>
                    <div class="file-preview d-flex justify-content-center" id="preview${numberIncr}">
                        <div class="attachrow">
                            <div class="attachcolumn">
                                <ul class="row justify-content-center px-3 mb-2" id="selectedFiles${numberIncr}"></ul>
                            </div>
                            <div class="attachcolumn existselectedFiles">
                                <ul class="row justify-content-center px-3 mb-2" id="ExistselectedFiles"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-2 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                    <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;

    $('#BindFollowupInfo').append(html);
    updateRemoveButtons();
}


function updateRowLabels() {
    $('.FollowupInfoDynamic').each(function (index) {
        // Update the label text with the correct row number
        $(this).find('.DynamicLable').text('Followup Info ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.FollowupInfoDynamic');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow');
        if (rows.length == 1) {
            removeButtonDiv.css('display', 'none');
        } else {
            removeButtonDiv.css('display', 'block');
        }
    });
}

function removeRow(button) {
    var totalRows = $('.FollowupInfoDynamic').length;
    if (totalRows > 1) {
        $(button).closest('.FollowupInfoDynamic').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
}



/*=======================================================================DyanamicAttachment===================================================================*/
let fileList = []; // Store selected files

function Attachment(Unique) {
    const fileInput = document.getElementById(`fileInput${Unique}`);
    const preview = document.getElementById('preview');
    const selectedFiles = document.getElementById(`selectedFiles${Unique}`);

    // Remove any existing event listener before adding a new one
    fileInput.replaceWith(fileInput.cloneNode(true));
    const newFileInput = document.getElementById(`fileInput${Unique}`);

    newFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);

        // Only add new files that are not already in the list
        files.forEach((file) => {
            if (!fileList.some(f => f.name === file.name)) {
                fileList.push(file);
                addFileToUI(file, selectedFiles);
                formDataMultiple.append('files[]', file); // Use 'file' directly
            }
        });

        preview.style.display = fileList.length > 0 ? 'block' : 'none';
    });
}

// Function to add file details to UI
function addFileToUI(file, selectedFiles) {
    const fileItem = document.createElement('li');
    const fileName = document.createElement('span');
    const downloadButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    fileName.textContent = file.name.length > 10 ? file.name.substring(0, 11) + '...' : file.name;


    downloadButton.type = 'button';
    deleteButton.type = 'button';

    downloadButton.innerHTML = `<i class="fas fa-download" data-id="${file.name}"></i>`;
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    downloadButton.className = 'download-button';
    deleteButton.className = 'delete-button';

    downloadButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const blob = new Blob([file]);
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(blobURL);
    });

    deleteButton.addEventListener('click', () => {
        fileList = fileList.filter(f => f.name !== file.name);
        fileItem.remove();

        let newFormData = new FormData();
        fileList.forEach(f => newFormData.append('files[]', f));

        formDataMultiple = newFormData;

        if (fileList.length === 0) {
            document.getElementById('preview').style.display = 'none';
        }
    });

    fileItem.appendChild(fileName);
    fileItem.appendChild(downloadButton);
    fileItem.appendChild(deleteButton);

    selectedFiles.appendChild(fileItem);
}

//=============================== Stactic Attachment===================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const selectedFiles = document.getElementById('selectedFiles');
    selectedFiles.innerHTML = '';
    fileInput.addEventListener('change', (e) => {

        const files = e.target.files;
        for (var i = 0; i < files.length; i++) {
            formDataMultiple.append('files[]', files[i]);
        }

        if (files.length > 0) {
            preview.style.display = 'block';


            for (const file of files) {
                const fileItem = document.createElement('li');
                const fileName = document.createElement('span');
                const downloadButton = document.createElement('button');
                const deleteButton = document.createElement('button');
                downloadButton.innerHTML = '<i class="fas fa-download"></i>';
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                downloadButton.className = 'download-button';
                deleteButton.className = 'delete-button';

                downloadButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const blob = new Blob([file]);
                    const blobURL = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobURL;
                    a.download = file.name;
                    a.click();
                    URL.revokeObjectURL(blobURL);
                });

                deleteButton.addEventListener('click', () => {
                    var itemName = $(fileItem).find('span').text();
                    var newFormData = new FormData();
                    $.each(formDataMultiple.getAll('files[]'), function (index, value) {
                        if (value.name !== itemName) {
                            newFormData.append('files[]', value);
                        }
                    });
                    formDataMultiple = newFormData;

                    fileItem.remove();
                });

                fileName.textContent = file.name.length > 10 ? file.name.substring(0, 11) + '...' : file.name;
                fileItem.appendChild(fileName);
                fileItem.appendChild(downloadButton);
                fileItem.appendChild(deleteButton);
                selectedFiles.appendChild(fileItem);
            }
        } else {
            preview.style.display = 'none';
        }
    });
});

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Ticket",
        ModuleRefId: parseInt(moduleRefId),
        AttachmentFileName: fileText,
        AttachmentFilePath: src
    });
    $(listItem).remove();
});
var deletedFiles = [];
var existFiles = [];
function getExistFiles() {

    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "Ticket",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

function formatToISODate(ddmmyyyy) {
    if (!ddmmyyyy) return '';

    const parts = ddmmyyyy.split('-');
    if (parts.length !== 3) return '';

    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
}

$(document).on('click', '#ExcelReportTicketing', function () {
    $('#loader-pms').show();
    $.ajax({
        url: '/Report/ExcelReportDownloadNew',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ ReportName: 'Profit & Loss' }),
        xhrFields: { responseType: 'blob' },
        success: function (response, status, xhr) {
            var filename = "file.xlsx";
            var disposition = xhr.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                if (matches && matches[1]) {
                    filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
                }
            }
            var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            $('#loader-pms').hide();
        },
        error: function () {
            $('#loader-pms').hide();
            alert("Failed to generate Report Excel");
        }
    });
});