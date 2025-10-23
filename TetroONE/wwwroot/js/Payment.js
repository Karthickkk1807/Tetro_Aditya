var numberIncr = 1;
var paymentId = 0;
var ModeOfPayDropdown = [];
var PaymentStatusDropdown = [];
var BillNoDropdown = [];
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
var PaymentAmount = [];
var FranchiseMappingId = 0;
var titleForHeaderProductTab = "Payment Request";

$(document).ready(async function () {
    Common.bindDropDownParent('FranchiseId', 'FormPayment', 'UserFranchiseMapping');
    Common.bindDropDownParent('PaymentTypeId', 'FormPayment', 'PamentType');
    Common.bindDropDownParent('PaymentCategory', 'FormPayment', 'PamentCategory');

    $('#ContactId').append($('<option>', { value: '', text: '--Select--', }));
    $("#ContactIdLabel").text('Name');

    var ModeOfPayData = await Common.bindDropDownSync('ModeOfPayment');
    ModeOfPayDropdown = JSON.parse(ModeOfPayData);
    var PaymentStatusData = await Common.bindDropDownSync('PaymentStatus');
    PaymentStatusDropdown = JSON.parse(PaymentStatusData);

    var today = new Date().toISOString().split('T')[0];
    $("#PaymentDate").val(today);
    //$("#PaymentDate").attr("max", today);

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    var fnData = Common.getDateFilter('dateDisplay2');

    $('#AddAttachment').hide();

    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
    Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);

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
        var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);
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
            var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString() };
            Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);

        var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });

    $(document).on('click', '.navbar-tab', function () {

        titleForHeaderProductTab = $(this).text().trim();
        $('.navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderProductTab) {
                $(this).addClass('active');
            }
        });

        if (titleForHeaderProductTab == "Payment Request") {
            $('.table-responsive').empty('');
            var html = ` 
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="PaymentTable"></table>
                `;
            $('.table-responsive').append(html);

            var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
            Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);

        } else if (titleForHeaderProductTab == "Accounts Payable") {
            $('.table-responsive').empty('');
            var html = ` 
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="PaymentTable"></table>
                `;
            $('.table-responsive').append(html);

            var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
            Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);
        }
        else {
            $('.table-responsive').empty('');
            var html = ` 
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="PaymentTable"></table>
                `;
            $('.table-responsive').append(html);

            var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
            Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);
        }
    });
});

function PaymentSuccess(response) {
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

    $('.table-responsive').empty('');
    var html = ` 
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="PaymentTable"></table>
                `;
    $('.table-responsive').append(html);

    var columns = Common.bindColumn(data[1], ["PaymentId", "Status_Color"]);
    Common.bindTablePurchase('PaymentTable', data[1], columns, -1, 'PaymentId', '338px', true, access);
    $('#loader-pms').hide();
}

$(document).on('click', '#AddPayment', function () {
    $('#loader-pms').show();
    $("#ContactIdLabel").text('Name');
    $('#PaymentModal').show(); 
    $("#PaymentHeader").text(
        titleForHeaderProductTab === "Payment Request" ? "Add Payment Request Details" :
            titleForHeaderProductTab === "Accounts Payable" ? "Add Accounts Payable Details" : "Add Accounts Receivable Details"
    );
    $("#PaymentNo").val("");
    $('.addr1').remove();
    duplicateRow();
    Common.removevalidation('FormPayment');
    $('#SavePayment').css('background', '#31CE36');
    $('#SavePayment').css('border-color', '#31CE36');
    $('#SavePayment').text('Save');
    $('#SavePayment').text('Save').addClass('btn-success').removeClass('btn-update');
    $('#selectedFiles').empty();
    $('#ExistselectedFiles').empty();
    const today = new Date().toISOString().split('T')[0];
    $("#PaymentDate").val(today);
    //$("#PaymentDate").attr("max", today).val(today);
    PaymentAmount = [];
    paymentId = 0;
    $('#ContactId').append($('<option>', { value: '', text: '--Select--', }));
    $('#loader-pms').hide();
});


$(document).on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        paymentId = $(this).data('id');
        var EditDataId = { PaymentId: paymentId };
        Common.ajaxCall("GET", "/Payment/DeletePayment", EditDataId, function (response) {
            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
            Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);
        }, null);
    }
});
 
$(document).on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    $('#PaymentModal').show(); 
    $("#PaymentHeader").text(
        titleForHeaderProductTab === "Payment Request" ? "Edit Payment Request Details" :
            titleForHeaderProductTab === "Accounts Payable" ? "Edit Accounts Payable Details" : "Edit Accounts Receivable Details"
    );
    $('#SavePayment').css('background', 'blue');
    $('#SavePayment').css('border-color', 'blue');
    $("#PaymentNo").val("");
    $('#SavePayment').text('Update');
    $('#SavePayment').text('Update').addClass('btn-update').removeClass('btn-success');
    $('#loader-pms').hide();
    PaymentAmount = [];

    paymentId = $(this).data('id');
    var fnData = Common.getDateFilter('dateDisplay2');
    var EditDataId = { PaymentId: parseInt(paymentId), FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
    Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, EditPaymentSuccess, null);
});

var ContactIdValEdit = 0;
function EditPaymentSuccess(response) {
    var data = JSON.parse(response.data);
    $('#FranchiseId').val(data[0][0].FranchiseId);
    $('#PaymentTypeId').val(data[0][0].PaymentTypeId).trigger('change');
    $('#PaymentCategory').val(data[0][0].PaymentCategory).trigger('change');
    ContactIdValEdit = data[0][0].ContactId;
    $('#ContactId').val(data[0][0].ContactId);
    $('#PaymentNo').val(data[0][0].PaymentNo);
    $('#Comments').val(data[0][0].Comments);

    var dateStr = data[0][0].PaymentDate;
    var dateParts = dateStr.split('-');
    var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
    $('#PaymentDate').val(formattedDate);

    $('.addr1').remove();

    var contactIdVal = parseInt($('#ContactId').val(data[0][0].ContactId));
    if (contactIdVal != NaN && contactIdVal != "" && contactIdVal != undefined)
        //ContactIdValEdit = contactIdVal
        contactIdVal = ContactIdValEdit
    var PamentTypeVal = parseInt($('#PaymentTypeId').val());
    var FranchiseId = parseInt(localStorage.getItem('FranchiseId'));
    var editData = { FranchiseId: FranchiseId, PaymentTypeId: PamentTypeVal, ContactId: contactIdVal };
    Common.ajaxCall("GET", "/Payment/GetPaymentBillNo", editData, function (response) {
        if (response != null && response.data != null) {
            var BillNoDd = JSON.parse(response.data);
            $.each(data[1], function (index, value) {
                numberIncr = numberIncr + 1;
                var table = $("#paymentTable");
                var newRow = document.createElement("tbody");
                newRow.className = 'addr1';
                var rowLen = $('.addr1').length;
                var paymentCategoryVal = $('#PaymentCategory').val();

                var defaultOption = '<option value="">--Select--</option>';
                var BillNoSelectOptions = "";
                BillNoSelectOptions = BillNoDd[0].map(function (BillNoval) {
                    var isSelected = BillNoval.BillNumber == value.BillNumber ? 'selected' : '';
                    return `<option value="${BillNoval.BillNumber}" ${isSelected}>${BillNoval.BillNumber}</option>`;
                }).join('');


                var PaymentStatusSelectOptions = "";
                PaymentStatusSelectOptions = PaymentStatusDropdown[0].map(function (PaymentStatusId) {
                    var isSelected = PaymentStatusId.PaymentStatusId == value.PaymentStatusId ? 'selected' : '';
                    return `<option value="${PaymentStatusId.PaymentStatusId}" ${isSelected}>${PaymentStatusId.PaymentStatusName}</option>`;
                }).join('');

                var ModeOfPaySelectOptions = "";
                ModeOfPaySelectOptions = ModeOfPayDropdown[0].map(function (ModeOfPaymentId) {
                    var isSelected = ModeOfPaymentId.ModeOfPaymentId == value.ModeOfPaymentId ? 'selected' : '';
                    return `<option value="${ModeOfPaymentId.ModeOfPaymentId}" ${isSelected}>${ModeOfPaymentId.ModeOfPaymentName}</option>`;
                }).join('');


                if (paymentCategoryVal == "2") {
                    if (rowLen < 1) {
                        newRow.innerHTML =
                            `
                        <tr>
                            <td class="billNumberTr px-1">
                            <label class="paymentBillInfoId d-none">${value.PaymentBillInfoId}</label>
                                <select class="form-control billNumber" id="BillNumber${numberIncr}" name="BillNumber${numberIncr}" required="" fdprocessedid="otaizf">
                                    ${defaultOption}${BillNoSelectOptions}
                                </select>
                            </td>
                        
                            <td class="totalAmountTr px-1">
                                <input type="number" name="TotalAmount${numberIncr}" value=${value.TotalAmount} placeholder="0.00" class="form-control totalAmount" id="TotalAmount${numberIncr}" disabled />
                            </td>
                        
                            <td class="paidAmountTr px-1">
                                <input type="text" name="PaidAmount${numberIncr}"
                                       class="form-control paidAmount" id="PaidAmount${numberIncr}" placeholder="0.00" value=${value.PaidAmount} oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,6)" required>
                            </td>
                        
                            <td class="balanceAmountTr px-1">
                                <input type="text" name="BalanceAmount${numberIncr}"
                                       class="form-control balanceAmount" id="BalanceAmount${numberIncr}" value=${value.BalanceAmount} readonly placeholder="0.00" />
                            </td>
                        
                            <td class="modeOfPaymentIdTr px-1">
                                <select class="form-control modeOfPaymentId" id="modeOfPaymentId${numberIncr}" name="modeOfPaymentId${numberIncr}" required>
                                   ${defaultOption}${ModeOfPaySelectOptions}
                                </select>
                            </td>
                        
                            <td class="paymentStatusIdTr px-1">
                                <select class="form-control PaymentStatusId" id="PaymentStatusId${numberIncr}" name="PaymentStatusId${numberIncr}" required disabled>
                                    ${defaultOption}${PaymentStatusSelectOptions}
                                </select>
                            </td>
                            <td class="paymentAddBtn px-1 d-flex justify-content-center align-items-center">
                                <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRow(this)">
                                    <i class="fas fa-plus" id="AddButton"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    } else {
                        newRow.innerHTML =
                            `
                        <tr>
                            <td class="billNumberTr px-1">
                            <label class="paymentBillInfoId d-none">${value.PaymentBillInfoId}</label>
                                <select class="form-control billNumber" id="BillNumber${numberIncr}" name="BillNumber${numberIncr}" required="" fdprocessedid="otaizf">
                                    ${defaultOption}${BillNoSelectOptions}
                                </select>
                            </td>
                        
                            <td class="totalAmountTr px-1">
                                <input type="number" name="TotalAmount${numberIncr}" value=${value.TotalAmount} placeholder="0.00" class="form-control totalAmount" id="TotalAmount${numberIncr}" disabled />
                            </td>
                        
                            <td class="paidAmountTr px-1">
                                <input type="text" name="PaidAmount${numberIncr}"
                                       class="form-control paidAmount" id="PaidAmount${numberIncr}" placeholder="0.00" value=${value.PaidAmount} oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,6)" required>
                            </td>
                        
                            <td class="balanceAmountTr px-1">
                                <input type="text" name="BalanceAmount${numberIncr}"
                                       class="form-control balanceAmount" id="BalanceAmount${numberIncr}" value=${value.BalanceAmount} readonly placeholder="0.00" />
                            </td>
                        
                            <td class="modeOfPaymentIdTr px-1">
                                <select class="form-control modeOfPaymentId" id="modeOfPaymentId${numberIncr}" name="modeOfPaymentId${numberIncr}" required>
                                   ${defaultOption}${ModeOfPaySelectOptions}
                                </select>
                            </td>
                        
                            <td class="paymentStatusIdTr px-1">
                                <select class="form-control PaymentStatusId" id="PaymentStatusId${numberIncr}" name="PaymentStatusId${numberIncr}" required disabled>
                                    ${defaultOption}${PaymentStatusSelectOptions}
                                </select>
                            </td>
                            <td class="p-1 d-flex justify-content-center align-items-center">
                                <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                                    <button id="RemoveButton" class="btn DynrowRemovePayment mt-1" type="button" onclick="removeRow(this)"><i class="fas fa-trash-alt"></i></button>
                                </div>
                            </td>
                        </tr>
                    `;
                    }
                }
                else if (paymentCategoryVal == "1") {

                    newRow.innerHTML =
                        `
                    <tr>
                        <td class="billNumberTr px-1">
                            <label class="paymentBillInfoId d-none">${value.PaymentBillInfoId}</label>
                            <select class="form-control billNumber" id="BillNumber${numberIncr}" name="BillNumber${numberIncr}" required="" disabled>
                                ${defaultOption}
                            </select>
                        </td>
                    
                        <td class="totalAmountTr px-1">
                            <input type="number" name="TotalAmount${numberIncr}" placeholder="0.00" class="form-control totalAmount" id="TotalAmount${numberIncr}" disabled />
                        </td>
                    
                        <td class="paidAmountTr px-1">
                            <input type="text" name="PaidAmount${numberIncr}" class="form-control paidAmount" id="PaidAmount${numberIncr}" value=${value.PaidAmount} placeholder="0.00" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,6)" required>
                        </td>
                    
                        <td class="balanceAmountTr px-1">
                            <input type="text" name="BalanceAmount${numberIncr}" class="form-control balanceAmount" id="BalanceAmount${numberIncr}" readonly placeholder="0.00" disabled/>
                        </td>
                    
                        <td class="modeOfPaymentIdTr px-1">
                            <select class="form-control modeOfPaymentId" id="modeOfPaymentId${numberIncr}" name="modeOfPaymentId${numberIncr}" required>
                                ${defaultOption}${ModeOfPaySelectOptions}
                            </select>
                        </td>
                    
                        <td class="paymentStatusIdTr px-1">
                            <select class="form-control PaymentStatusId" id="PaymentStatusId${numberIncr}" name="PaymentStatusId${numberIncr}" required disabled>
                                ${defaultOption}${PaymentStatusSelectOptions}
                            </select>
                        </td>
                    </tr>
                `;
                }
                else {
                    if (rowLen < 1) {
                        newRow.innerHTML =
                            `
                            <tr><td valign="top" colspan="6" class="dataTables_empty"><div class="d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Fill the Above Required Fields</div></td></tr>
                        `;
                    }
                }

                // Append the new row to the table body
                table.append(newRow);

                var tbodyIndex = $("#paymentTable tbody").index($(newRow));
                var row = $(newRow).find("tr");

                var BillNo = row.find('.billNumber').val();
                var inputOfThis = parseFloat(row.find('.paidAmount').val()) || 0;
                var inputOfTotalAmount = parseFloat(row.find('.totalAmount').val()) || 0;
                var BalanceAmount = inputOfTotalAmount - inputOfThis;

                var entry = {
                    tbodyIndex: tbodyIndex,
                    BillNo: BillNo,
                    BalanceAmount: BalanceAmount
                };

                var existingIndex = PaymentAmount.findIndex(function (item) {
                    return item.tbodyIndex === tbodyIndex;
                });

                if (existingIndex === -1) {
                    PaymentAmount.push(entry);
                } else {
                    PaymentAmount[existingIndex] = entry;
                }

            });
        }
    }, null);

    setTimeout(function () {
        $('#ContactId').val(ContactIdValEdit);
    }, 500);


    $('#ExistselectedFiles, #selectedFiles').empty();
    var ulElement = $('#ExistselectedFiles');
    $.each(data[2], function (index, file) {
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
}

$(document).on('click', '#PaymentClose,#ClosePayment', function () {
    $("#FormPayment")[0].reset();
    $('#PaymentModal').hide();
});

$(document).on('change', '#ContactId', function () {
    var $thisVal = $(this).val();
    $('.addr1').remove();
    duplicateRow();
});

$('#PaymentCategory').on('change', function () {
    var paymentCategoryVal = $(this).val();
    $('.addr1').remove();
    if (paymentCategoryVal == 1) {
        $('.addr1').remove();
        duplicateRow();
    }
    else if (paymentCategoryVal == 2) {
        $('.addr1').remove();
        duplicateRow();
    }

    var PayentTypeVal = parseInt($('#PaymentTypeId').val());
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    if (paymentCategoryVal != "" && paymentCategoryVal != NaN && paymentCategoryVal != undefined && paymentCategoryVal != null) {
        var paymentCategory = parseInt(paymentCategoryVal);
        Common.ajaxCall("GET", "/Payment/PaymentGetContactNameDetails", { FranchiseId: FranchiseMappingId, PaymentTypeId: PayentTypeVal, PaymentCategory: paymentCategory }, function (response) {
            if (response != null) {
                var data = JSON.parse(response.data);
                $('#ContactId').empty();
                var dataValue = data[0];
                if (dataValue != null && dataValue.length > 0) {
                    var valueproperty = Object.keys(dataValue[0])[0];
                    var textproperty = Object.keys(dataValue[0])[1];
                    $('#ContactId').append($('<option>', {
                        value: '',
                        text: '--Select--',
                    }));
                    $.each(dataValue, function (index, item) {
                        $('#ContactId').append($('<option>', {
                            value: item[valueproperty],
                            text: item[textproperty],
                        }));
                    });
                } else {
                    $('#ContactId').append($('<option>', {
                        value: '',
                        text: '--Select--',
                    }));
                }
            }
        }, null);
    }
});

$('#ContactId').on('change', function () {
    var contactIdVal = parseInt($(this).val());
    var PamentTypeVal = parseInt($('#PaymentTypeId').val());
    var FranchiseId = parseInt(localStorage.getItem('FranchiseId'));
    var editData = { FranchiseId: FranchiseId, PaymentTypeId: PamentTypeVal, ContactId: contactIdVal };

    if (contactIdVal != null && contactIdVal != "" && contactIdVal != undefined && contactIdVal != NaN) {
        Common.ajaxCall("GET", "/Payment/GetPaymentBillNo", editData, function (response) {
            if (response != null && response.data != null) {
                var data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                BillNoDropdown = data;
                $('.billNumber').empty();

                if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].length > 0 && data[0][0].BillNumber != null) {
                    var dataValue = data[0];
                    var valueProperty = Object.keys(dataValue[0])[0];

                    $('.billNumber').append($('<option>', {
                        value: '',
                        text: '--Select--',
                    }));

                    $.each(dataValue, function (index, item) {
                        $('.billNumber').append($('<option>', {
                            value: item[valueProperty],
                            text: item[valueProperty],
                        }));
                    });
                    $('.billNumber').prop('disabled', false);
                } else {
                    $('.billNumber').append($('<option>', {
                        value: '',
                        text: '--No Bill Mapping--',
                    }));
                }
            }
        }, null);
    }
});


$('#FranchiseId').on('change', function () {
    $('#PaymentCategory').val('').trigger('change');
    $('#PaymentTypeId').val('').trigger('change');
    $('.addr1').remove();
    duplicateRow();
    var franchiseId = parseInt($('#FranchiseId').val());
    var editeData = { FranchiseId: franchiseId, ModuleName: "Payment" };
    Common.ajaxCall("GET", "/Payment/GetAutoGenerateNo", editeData, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            $("#PaymentNo").val(data[0][0].PaymentNo);
        }
    }, null);
});

$('#PaymentTypeId').on('change', function () {
    var PamentTypeVal = parseInt($(this).val());
    if (PamentTypeVal == 1) {
        $("#ContactIdLabel").text('Vendor Name');
        $('#PaymentCategory').val('2').trigger('change');
    }
    else if (PamentTypeVal == 2) {
        $("#ContactIdLabel").text('Vendor Name');
        $('#PaymentCategory').val('2').trigger('change');
    }
    else if (PamentTypeVal == 3) {
        $("#ContactIdLabel").text('Client Name');
        $('#PaymentCategory').val('2').trigger('change');
    }
    else {
        $("#ContactIdLabel").text('Name');
        $('#PaymentCategory').val('').trigger('change');
        duplicateRow();
    }
});

$(document).on('click', '#SavePayment', function () {
    if ($('#FormPayment').valid()) {

        getExistFiles();

        var DataPaymentStatic = JSON.parse(JSON.stringify(jQuery('#FormPayment').serializeArray()));
        var objvalue = {};
        $.each(DataPaymentStatic, function (index, item) {
            objvalue[item.name] = item.value;
        });
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var billingFranchiseId = $('#FranchiseId').val();
        var ContactIdId = $('#ContactId').val();
        objvalue.FranchiseId = FranchiseMappingId;
        objvalue.BillingFranchiseId = parseInt(billingFranchiseId);
        objvalue.ContactId = parseInt(ContactIdId);
        objvalue.PaymentNo = $('#PaymentNo').val();
        objvalue.PaymentId = parseInt(paymentId);

        var PaymentDetails = [];
        var PaymentRows = $('#paymentTable tbody tr'); // Select each row in the payment table
        $.each(PaymentRows, function (index, row) {
            var paymentBillInfoId = $(this).find('.paymentBillInfoId').text();
            var billNumber = $(row).find('.billNumber').val();
            var totalAmount = $(row).find('.totalAmount').val();
            var paidAmount = $(row).find('.paidAmount').val();
            var balanceAmount = $(row).find('.balanceAmount').val();
            var modeOfPayment = $(row).find('.modeOfPaymentId').val();
            var paymentStatus = $(row).find('.PaymentStatusId').val();

            PaymentDetails.push({
                PaymentBillInfoId: parseInt(paymentBillInfoId) || null,
                BillNumber: billNumber || null,
                TotalAmount: parseFloat(totalAmount) || 0.00,
                PaidAmount: parseFloat(paidAmount) || 0.00,
                BalanceAmount: parseFloat(balanceAmount) || 0.00,
                ModeOfPaymentId: parseInt(modeOfPayment) || null,
                PaymentStatusId: parseInt(paymentStatus) || null,
                PaymentId: parseInt(paymentId) || null
            });
        });

        formDataMultiple.append("PaymentDetailsStatic", JSON.stringify(objvalue));
        formDataMultiple.append("paymentBillInfoDetails", JSON.stringify(PaymentDetails));
        formDataMultiple.append("Exist", JSON.stringify(existFiles));
        formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));
        $.ajax({
            type: "POST",
            url: "/Payment/InsertUpdatePaymentDetails",
            data: formDataMultiple,
            contentType: false,
            processData: false,

            success: function (response) {
                if (response.status) {
                    formDataMultiple = new FormData();
                    Common.successMsg(response.message);
                    $('#SavePayment').text('Save').addClass('btn-success').removeClass('btn-update');
                    $('#loader-pms').hide();
                    $('#PaymentModal').hide();
                    PaymentAmount = [];
                    var fnData = Common.getDateFilter('dateDisplay2');
                    var EditDataId = { PaymentId: null, FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
                    Common.ajaxCall("GET", "/Payment/GetPayment", EditDataId, PaymentSuccess, null);
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


$(document).on('change', '.billNumber', function () {
    var row = $(this).closest('tr');
    var billNumberVal = row.find('.billNumber').val();
    var contactIdVal = parseInt($('#ContactId').val());
    var paymentTypeVal = parseInt($('#PaymentTypeId').val());
    var editData = { PaymentTypeId: paymentTypeVal, ContactId: contactIdVal, BillNumber: billNumberVal };

    var currentRow = $(this).closest('tr');
    var currentBillNumberVal = currentRow.find('.billNumber').val();
    var duplicateBalanceAmount = null;
    var isDuplicate = false;
    $('.billNumber').each(function () {
        var otherRow = $(this).closest('tr');
        if ($(this).val() === currentBillNumberVal && otherRow[0] !== currentRow[0]) {
            isDuplicate = true;
            duplicateBalanceAmount = otherRow.find('.balanceAmount').val();
            return false;
        }
    });
    if (isDuplicate) {
        var matches = PaymentAmount.filter(function (item) {
            return item.BillNo === currentBillNumberVal;
        });

        var lastMatch = matches.at(-1);

        if (lastMatch) {
            duplicateBalanceAmount = lastMatch.BalanceAmount;
            currentRow.find('.totalAmount').val(duplicateBalanceAmount);
        } else {
            currentRow.find('.totalAmount').val('');
        }
    }
    else {
        Common.ajaxCall("GET", "/Payment/GetPaymentBillNoAmount", editData, function (response) {
            if (response != null) {
                var data = JSON.parse(response.data);
                row.find('.totalAmount').val(data[0][0].TotalAmount);
            }
        }, null);
    }
});

$(document).on('input', '.paidAmount', function () {
    var row = $(this).closest('tr');
    var tbody = $(this).closest('tbody');
    var tbodyIndex = $("#paymentTable tbody").index(tbody);
    var BillNo = row.find('.billNumber').val();

    var paymentCategoryVal = $('#PaymentCategory').val();
    if (paymentCategoryVal == 2) {
        var inputOfThis = parseFloat(row.find('.paidAmount').val()) || 0;
        var inputOfTotalAmount = parseFloat(row.find('.totalAmount').val()) || 0;
        var BalanceAmount = inputOfTotalAmount - inputOfThis;

        row.find('.balanceAmount').val(BalanceAmount);

        var entry = {
            tbodyIndex: tbodyIndex,
            BillNo: BillNo,
            BalanceAmount: BalanceAmount
        };

        var existingIndex = PaymentAmount.findIndex(function (item) {
            return item.tbodyIndex === tbodyIndex;
        });

        if (existingIndex === -1) {
            PaymentAmount.push(entry);
        } else {
            PaymentAmount[existingIndex] = entry;
        }

        if (inputOfThis > inputOfTotalAmount) {
            Common.warningMsg('The balance amount is negative!');
            row.find('.balanceAmount').val(0);
            row.find('.paidAmount').val(inputOfTotalAmount);
            row.find('.PaymentStatusId').val('8').trigger('change');
            BalanceAmount = 0;
        } else if (inputOfThis == inputOfTotalAmount) {
            row.find('.PaymentStatusId').val('8').trigger('change');
        } else if (inputOfThis === 0 || isNaN(inputOfThis)) {
            row.find('.PaymentStatusId').val('').trigger('change');
            row.find('.balanceAmount').val(0);
            BalanceAmount = 0;
        } else {
            row.find('.PaymentStatusId').val('9').trigger('change');
        }

        if (BalanceAmount === 0) {
            $("#paymentTable tbody").each(function (i) {
                if (i > tbodyIndex && $(this).find(".billNumber").val() === BillNo) {
                    $(this).remove();
                    PaymentAmount = PaymentAmount.filter(function (item) {
                        return item.tbodyIndex !== i;
                    });
                }
            });
            return;
        }

        let allRows = $("#paymentTable tbody").filter(function () {
            return $(this).find(".billNumber").val() === BillNo;
        });

        let prevBalance = BalanceAmount;
        allRows.each(function (i) {
            if (i <= tbodyIndex) return;

            let $nextRow = $(this);
            let total = prevBalance;
            $nextRow.find('.totalAmount').val(total);

            let paid = parseFloat($nextRow.find('.paidAmount').val()) || 0;
            let balance = total - paid;
            $nextRow.find('.balanceAmount').val(balance);

            prevBalance = balance;

            let idx = $("#paymentTable tbody").index($nextRow);
            var nextEntry = {
                tbodyIndex: idx,
                BillNo: BillNo,
                BalanceAmount: balance
            };
            var existIdx = PaymentAmount.findIndex(function (item) {
                return item.tbodyIndex === idx;
            });
            if (existIdx === -1) {
                PaymentAmount.push(nextEntry);
            } else {
                PaymentAmount[existIdx] = nextEntry;
            }
        });
    }
});

async function duplicateRow(button) {
    numberIncr = numberIncr + 1;
    var table = $("#paymentTable");
    var newRow = document.createElement("tbody");
    newRow.className = 'addr1';
    var rowLen = $('.addr1').length;
    var paymentCategoryVal = $('#PaymentCategory').val();

    var ModeOfPaySelectOptions = "";
    var PaymentStatusSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (ModeOfPayDropdown != null && ModeOfPayDropdown.length > 0 && ModeOfPayDropdown[0].length > 0) {
        ModeOfPaySelectOptions = ModeOfPayDropdown[0].map(function (ModeOfPaymentId) {
            return `<option value="${ModeOfPaymentId.ModeOfPaymentId}">${ModeOfPaymentId.ModeOfPaymentName}</option>`;
        }).join('');
    }

    if (PaymentStatusDropdown != null && PaymentStatusDropdown.length > 0 && PaymentStatusDropdown[0].length > 0) {
        PaymentStatusSelectOptions = PaymentStatusDropdown[0].map(function (PaymentStatusId) {
            return `<option value="${PaymentStatusId.PaymentStatusId}">${PaymentStatusId.PaymentStatusName}</option>`;
        }).join('');
    }

    var BillNoSelectOptions = "";
    if (BillNoDropdown != null && BillNoDropdown.length > 0 && BillNoDropdown[0].length > 0) {
        BillNoSelectOptions = BillNoDropdown[0].map(function (BillNumberId) {
            return `<option value="${BillNumberId.BillNumber}">${BillNumberId.BillNumber}</option>`;
        }).join('');

        //var numberOfOptions = FranchiseDropdown[0].length;
        //var DropDownVal = parseInt(numberOfOptions);
    }

    if (paymentCategoryVal == "2") {
        if (rowLen < 1) {
            newRow.innerHTML =
                `
                <tr>
                    <td class="billNumberTr px-1">
                    <label class="paymentBillInfoId d-none"></label>
                        <select class="form-control billNumber" id="BillNumber${numberIncr}" name="BillNumber${numberIncr}" required="" fdprocessedid="otaizf">
                            ${defaultOption}${BillNoSelectOptions}
                        </select>
                    </td>
                
                    <td class="totalAmountTr px-1">
                        <input type="number" name="TotalAmount${numberIncr}" placeholder="0.00"
                               class="form-control totalAmount" id="TotalAmount${numberIncr}" disabled />
                    </td>
                
                    <td class="paidAmountTr px-1">
                        <input type="text" name="PaidAmount${numberIncr}"
                               class="form-control paidAmount" id="PaidAmount${numberIncr}" placeholder="0.00" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,6)" required>
                    </td>
                
                    <td class="balanceAmountTr px-1">
                        <input type="text" name="BalanceAmount${numberIncr}"
                               class="form-control balanceAmount" id="BalanceAmount${numberIncr}" readonly placeholder="0.00" />
                    </td>
                
                    <td class="modeOfPaymentIdTr px-1">
                        <select class="form-control modeOfPaymentId" id="modeOfPaymentId${numberIncr}" name="modeOfPaymentId${numberIncr}" required>
                           ${defaultOption}${ModeOfPaySelectOptions}
                        </select>
                    </td>
                
                    <td class="paymentStatusIdTr px-1">
                        <select class="form-control PaymentStatusId" id="PaymentStatusId${numberIncr}" name="PaymentStatusId${numberIncr}" required disabled>
                            ${defaultOption}${PaymentStatusSelectOptions}
                        </select>
                    </td>
                    <td class="paymentAddBtn px-1 d-flex justify-content-center align-items-center">
                        <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRow(this)">
                            <i class="fas fa-plus" id="AddButton"></i>
                        </button>
                    </td>
                </tr>
            `;
        } else {
            newRow.innerHTML =
                `
                <tr>
                    <td class="billNumberTr px-1">
                        <label class="paymentBillInfoId d-none"></label>
                        <select class="form-control billNumber" id="BillNumber${numberIncr}" name="BillNumber${numberIncr}" required="" fdprocessedid="otaizf">
                            ${defaultOption}${BillNoSelectOptions}
                        </select>
                    </td>
                
                    <td class="totalAmountTr px-1">
                        <input type="number" name="TotalAmount${numberIncr}" placeholder="0.00"
                               class="form-control totalAmount" id="TotalAmount${numberIncr}" disabled />
                    </td>
                
                    <td class="paidAmountTr px-1">
                        <input type="text" name="PaidAmount${numberIncr}"
                               class="form-control paidAmount" id="PaidAmount${numberIncr}" placeholder="0.00" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,6)" required>
                    </td>
                
                    <td class="balanceAmountTr px-1">
                        <input type="text" name="BalanceAmount${numberIncr}"
                               class="form-control balanceAmount" id="BalanceAmount${numberIncr}" readonly placeholder="0.00" />
                    </td>
                
                    <td class="modeOfPaymentIdTr px-1">
                        <select class="form-control modeOfPaymentId" id="modeOfPaymentId${numberIncr}" name="modeOfPaymentId${numberIncr}" required>
                            ${defaultOption}${ModeOfPaySelectOptions}
                        </select>
                    </td>
                
                    <td class="paymentStatusIdTr px-1">
                        <select class="form-control PaymentStatusId" id="PaymentStatusId${numberIncr}" name="PaymentStatusId${numberIncr}" required disabled>
                            ${defaultOption}${PaymentStatusSelectOptions}
                        </select>
                    </td>
                    <td class="p-1 d-flex justify-content-center align-items-center">
                        <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                            <button id="RemoveButton" class="btn DynrowRemovePayment mt-1" type="button" onclick="removeRow(this)"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }
    else if (paymentCategoryVal == "1") {

        newRow.innerHTML =
            `
            <tr>
                <td class="billNumberTr px-1">
                    <label class="paymentBillInfoId d-none"></label>
                    <select class="form-control billNumber" id="BillNumber${numberIncr}" name="BillNumber${numberIncr}" required disabled>
                        ${defaultOption}${BillNoSelectOptions}
                    </select>
                </td>
            
                <td class="totalAmountTr px-1">
                    <input type="number" name="TotalAmount${numberIncr}" placeholder="0.00"
                           class="form-control totalAmount" id="TotalAmount${numberIncr}" disabled />
                </td>
            
                <td class="paidAmountTr px-1">
                    <input type="text" name="PaidAmount${numberIncr}"
                           class="form-control paidAmount" id="PaidAmount${numberIncr}" placeholder="0.00" oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,6)" required>
                </td>
            
                <td class="balanceAmountTr px-1">
                    <input type="text" name="BalanceAmount${numberIncr}"
                           class="form-control balanceAmount" id="BalanceAmount${numberIncr}" readonly placeholder="0.00" disabled/>
                </td>
            
                <td class="modeOfPaymentIdTr px-1">
                    <select class="form-control modeOfPaymentId" id="modeOfPaymentId${numberIncr}" name="modeOfPaymentId${numberIncr}" required>
                        ${defaultOption}${ModeOfPaySelectOptions}
                    </select>
                </td>
            
                <td class="paymentStatusIdTr px-1">
                    <select class="form-control PaymentStatusId" id="PaymentStatusId${numberIncr}" name="PaymentStatusId${numberIncr}" value="8" required disabled>
                        ${PaymentStatusSelectOptions}
                    </select>
                </td>
            </tr>
        `;
    }
    else {
        if (rowLen < 1) {
            newRow.innerHTML =
                `
                <tr><td valign="top" colspan="6" class="dataTables_empty"><div class="d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Fill the Above Required Fields</div></td></tr>
            `;
        }
    }

    table.append(newRow);
}

function removeRow(button) {
    let table = $("#paymentTable");
    let tbody = $(button).closest("tbody");
    let index = table.find("tbody").index(tbody);

    let removedBillNo = tbody.find(".billNumber").val();

    if (Array.isArray(PaymentAmount)) {
        if (index >= 0 && index < PaymentAmount.length) {
            PaymentAmount.splice(index, 1);
        }
    }
    if (table.find("tbody").length > 1) {
        tbody.remove();
    }
    recalcBillRows(removedBillNo);
    PaymentAmount = [];
    table.find("tbody").each(function (i, tb) {
        let $tb = $(tb);
        PaymentAmount.push({
            tbodyIndex: i + 1,
            BillNo: $tb.find(".billNumber").val(),
            BalanceAmount: parseFloat($tb.find(".balanceAmount").val()) || 0
        });
    });
}

/*=========================================Attachment==============================*/
$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Payment",
        ModuleRefId: parseInt(moduleRefId),
        AttachmentFileName: fileText,
        AttachmentFilePath: src
    });
    $(listItem).remove();
});

function getExistFiles() {

    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "Payment",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

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

function recalcBillRows(billNo) {
    let table = $("#paymentTable");
    let rows = table.find("tbody").filter(function () {
        return $(this).find(".billNumber").val() === billNo;
    });

    if (rows.length === 0) return;

    let $firstRow = $(rows[0]);

    let contactIdVal = parseInt($('#ContactId').val());
    let paymentTypeVal = parseInt($('#PaymentTypeId').val());
    let editData = {
        PaymentTypeId: paymentTypeVal,
        ContactId: contactIdVal,
        BillNumber: billNo
    };

    Common.ajaxCall("GET", "/Payment/GetPaymentBillNoAmount", editData, function (response) {
        if (response != null) {
            var data = JSON.parse(response.data);
            let total = data[0][0].TotalAmount;

            $firstRow.find('.totalAmount').val(total);

            let paid = parseFloat($firstRow.find('.paidAmount').val()) || 0;
            let balance = total - paid;
            $firstRow.find('.balanceAmount').val(balance);

            let prevBalance = balance;

            rows.each(function (i) {
                if (i === 0) return;
                let $row = $(this);
                $row.find('.totalAmount').val(total);
                let paid = parseFloat($row.find('.paidAmount').val()) || 0;
                let balance = total - paid;
                $row.find('.balanceAmount').val(balance);

                prevBalance = balance;
            });
        }
    }, null);
}