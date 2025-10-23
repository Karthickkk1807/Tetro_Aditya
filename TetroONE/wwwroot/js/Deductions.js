var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
var advanceId = 0;
var loanId = 0;
var claimId = 0;
$(document).ready(function () {
    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);

    Common.ajaxCall("GET", "/HumanResource/GetAdvance", { AdvanceId: null }, getSuccess, null);

    Common.bindDropDownParent('RequestedBy', 'FormClaim', 'Employee');
    Common.bindDropDownParent('EmployeeId', 'FormAdvance', 'Employee');
    Common.bindDropDownParent('LoanEmployeeId', 'FormLoan', 'Employee');
    Common.bindDropDownParent('ClaimTypeId', 'FormClaim', 'ClaimType');

    Common.ajaxCall("GET", "/HumanResource/GetExpenseNo", { ModuleId: null, ModuleName: "Expense" }, function (response) {
        if (response.status) {
            Common.bindParentDropDownSuccessForChosen(response.data, "ExpenseId", "FormClaim");
        }
    });

    $('#SaveClaim').click(function () {
        if ($("#FormClaim").valid()) {
            getExistFiles();
            var objvalue = {
                ClaimId: claimId,
                ClaimDate: $('#ClaimDate').val(),
                ClaimTypeId: Common.parseInputValue('ClaimTypeId'),
                ClaimNo: $('#ClaimNo').val() == "" ? null : $('#ClaimNo').val(),
                ExpenseId: Common.parseInputValue('ExpenseId'),
                ClaimAmount: Common.parseFloatInputValue('ClaimAmount'),
                ClaimDescription: $('#ClaimDescription').val() == "" ? null : $('#ClaimDescription').val(),
                RequestedBy: Common.parseFloatInputValue('RequestedBy'),
                ApprovedAmount: claimId == 0 ? null : Common.parseFloatInputValue('ApprovedAmount'),
                ApproverComments: claimId == 0 ? null : ($('#ApproverComments').val() == "" ? null : $('#ApproverComments').val()),
                ClaimStatusId: Common.parseInputValue('ClaimStatusId')
            };

            formDataMultiple.append("StaticDetails", JSON.stringify(objvalue));
            formDataMultiple.append("Exist", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));

            $.ajax({
                type: "POST",
                url: "/HumanResource/InsertClaim",
                data: formDataMultiple,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.status) {
                        Common.successMsg(response.message);
                        $(".offcanvas-container").css("width", "0%");
                        $('#fadeinpage').removeClass('fadeoverlay');
                        formDataMultiple = new FormData();
                        Common.ajaxCall("GET", "/HumanResource/GetClaim", { ClaimId: null }, getSuccess, null);
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

    $('#SaveAdvance').click(function () {
        if ($("#FormAdvance").valid()) {
            var objvalue = {};
            objvalue.AdvanceId = advanceId;
            objvalue.AdvanceDate = $('#AdvanceDate').val();
            objvalue.EmployeeId = Common.parseInputValue('EmployeeId');
            objvalue.AdvanceAmount = Common.parseFloatInputValue('AdvanceAmount');
            objvalue.DueAmount = Common.parseFloatInputValue('DueAmount');
            objvalue.AdvanceStatusId = Common.parseInputValue('AdvanceStatusId');
            objvalue.Description = $('#FormAdvance #Description').val() == "" ? null : $('#FormAdvance #Description').val();
            objvalue.Comments = $('#FormAdvance #Comments').val() == "" ? null : $('#FormAdvance #Comments').val();

            Common.ajaxCall("POST", "/HumanResource/InsertAdvance", JSON.stringify(objvalue), SaveSuccess, null);
        }
    });

    $('#SaveLoan').click(function () {
        if ($("#FormLoan").valid()) {
            var objvalue = {};
            objvalue.LoanId = loanId;
            objvalue.LoanDate = $('#LoanDate').val();
            objvalue.EmployeeId = Common.parseInputValue('LoanEmployeeId');
            objvalue.LoanAmount = Common.parseFloatInputValue('LoanAmount');
            objvalue.NoOfDues = Common.parseInputValue('NoOfDues');
            objvalue.DueAmount = $('#FormLoan #DueAmount').val() == "" ? null : parseFloat($('#FormLoan #DueAmount').val());
            objvalue.CompletedDue = $('#FormLoan #CompletedDue').val() == "" ? null : parseInt($('#FormLoan #CompletedDue').val());
            objvalue.PendingDues = Common.parseInputValue('PendingDues');
            objvalue.PendingAmount = Common.parseFloatInputValue('PendingAmount');
            objvalue.LoanStatusId = Common.parseInputValue('LoanStatusId');
            objvalue.Description = $('#FormLoan #Description').val() == "" ? null : $('#FormLoan #Description').val();
            objvalue.Comments = $('#FormLoan #Comments').val() == "" ? null : $('#FormLoan #Comments').val();

            Common.ajaxCall("POST", "/HumanResource/InsertLoan", JSON.stringify(objvalue), SaveSuccess, null);
        }
    });

    $(document).on('click', '#deductionsTable .btn-edit', function () {
        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();
        if (activeTabText.includes("Claim")) {
            $('#preview #selectedFiles').empty("");
            $('#preview #ExistselectedFiles').empty("");
            $('#ClaimStatusCol').show();
            $('#AddDeductions').attr('title', 'Add Claim');
            claimId = $(this).data('id');
            deletedFiles = [];
            existFiles = [];
            $('#FormClaim #RequestedBy').prop('disabled', false);
            $('#FormClaim #RequestedBy').val(null).trigger('change');
            if (isAdminAccess != "True") {
                $('#FormClaim #RequestedBy').val(UserId).trigger('change');
                $('#FormClaim #RequestedBy').prop('disabled', true);
            }
            Common.ajaxCall("POST", "/Leave/GetStatus", JSON.stringify({ ModuleName: 'ClaimStatus', ModuleId: claimId }), function (response) {
                Common.bindDropDownSuccess(response.data, 'ClaimStatusId');
                Common.ajaxCall("GET", "/HumanResource/GetClaim", { ClaimId: claimId }, editClaimIdSuccess, null);
            }, null);
        } else if (activeTabText.includes("Advance")) {
            $('#AdvanceStatusCol').show();
            $('#AddDeductions').attr('title', 'Add Advance');
            advanceId = $(this).data('id');
            $('#FormAdvance #EmployeeId').val(null).trigger('change');
            $('#FormAdvance #EmployeeId').prop('disabled', false);
            if (isAdminAccess != "True") {
                $('#FormAdvance #EmployeeId').val(UserId).trigger('change');
                $('#FormAdvance #EmployeeId').prop('disabled', true);
            }
            Common.ajaxCall("POST", "/Leave/GetStatus", JSON.stringify({ ModuleName: 'AdvanceStatus', ModuleId: advanceId }), function (response) {
                Common.bindDropDownSuccess(response.data, 'AdvanceStatusId');
                Common.ajaxCall("GET", "/HumanResource/GetAdvance", { AdvanceId: advanceId }, editAdvanceSuccess, null);
            }, null);
        } else if (activeTabText.includes("Loan")) {
            $('#LoanStatusCol').show();
            $('#AddDeductions').attr('title', 'Add Loan');
            loanId = $(this).data('id');

            $('#FormLoan #LoanEmployeeId').val(null).trigger('change');
            $('#FormLoan #LoanEmployeeId').prop('disabled', false);

            if (isAdminAccess != "True") {
                $('#FormLoan #LoanEmployeeId').val(UserId).trigger('change');
                $('#FormLoan #LoanEmployeeId').prop('disabled', true);
            }
            Common.ajaxCall("POST", "/Leave/GetStatus", JSON.stringify({ ModuleName: 'LoanStatus', ModuleId: loanId }), function (response) {
                Common.bindDropDownSuccess(response.data, 'LoanStatusId');
                Common.ajaxCall("GET", "/HumanResource/GetLoan", { LoanId: loanId }, editLoanSuccess, null);
            }, null);
        }
    });

    $(document).on('click', '#deductionsTable .btn-delete', async function () {
        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();

        var response = await Common.askConfirmation();
        if (response == true) {
            var infoId = $(this).data('id');
            if (activeTabText.includes("Claim")) {
                Common.ajaxCall("GET", "/HumanResource/DeleteClaim", { ClaimId: infoId }, SaveSuccess, null);
            } else if (activeTabText.includes("Advance")) {
                Common.ajaxCall("GET", "/HumanResource/DeleteAdvance", { AdvanceId: infoId }, SaveSuccess, null);
            } else if (activeTabText.includes("Loan")) {
                Common.ajaxCall("GET", "/HumanResource/DeleteLoan", { LoanId: infoId }, SaveSuccess, null);
            }
        }
    });

    $('#AddDeductions').on('click', function () {
        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();
        var windowWidth = $(window).width();
        if (activeTabText.includes("Claim")) {
            if (windowWidth <= 600) {
                $("#claimCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#claimCanvas").css("width", "50%");
            } else {
                $("#claimCanvas").css("width", "39%");
            }
            $('#fadeinpage').addClass('fadeoverlay');
            $('#claimCanvas #canvasHeader').text("Add Claim");
            $('.approverCol').hide();
            $('#ClaimStatusCol').hide();
            $('#preview #selectedFiles').empty("");
            $('#preview #ExistselectedFiles').empty("");
            Common.removevalidation('FormClaim');
            claimId = 0;
            deletedFiles = [];
            existFiles = [];
            $('#FormClaim #RequestedBy').val(null).trigger('change');
            $('#ClaimDate,#ExpenseId,#ClaimTypeId,#ClaimAmount,#ApprovedAmount,#ClaimStatusId,#FormClaim #RequestedBy').prop('disabled', false);
            $('#DiffAmount').css('color', '');
            if (isAdminAccess != "True") {
                $('#FormClaim #RequestedBy').val(UserId).trigger('change');
                $('#FormClaim #RequestedBy').prop('disabled', true);
            }
            Common.ajaxCall("GET", "/Common/GetAutoGenerate", { FranchiseId: null, ModuleName: "Claim" }, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    $('#ClaimNo').val(data[0][0].ClaimNo);
                }
            });
        } else if (activeTabText.includes("Advance")) {
            if (windowWidth <= 600) {
                $("#advanceCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#advanceCanvas").css("width", "50%");
            } else {
                $("#advanceCanvas").css("width", "39%");
            }
            $('#fadeinpage').addClass('fadeoverlay');
            Common.removevalidation('FormAdvance');
            $('#FormAdvance #EmployeeId').val(null).trigger('change');
            $('#AdvanceDate,#AdvanceAmount,#AdvanceStatusId').prop('disabled', false);
            if (isAdminAccess != "True") {
                $('#FormAdvance #EmployeeId').val(UserId).trigger('change');
                $('#FormAdvance #EmployeeId').prop('disabled', true);
            }
            advanceId = 0;
            $('#advanceCanvas #canvasHeader').text("Add Advance");
            $('#advanceCmtCol').hide();
            $('#AdvanceStatusCol').hide();
            //$('#AdvanceDescCol').removeClass('col-md-12 col-lg-12 col-sm-12 col-12').addClass('col-md-6 col-lg-6 col-sm-6 col-6');
            $('#AdvanceAmountCol').removeClass('col-md-6 col-lg-3 col-sm-6 col-6').addClass('col-md-12 col-lg-6 col-sm-12 col-12');
            $('#AdvanceDueCol').removeClass('col-md-6 col-lg-3 col-sm-6 col-6').addClass('col-md-12 col-lg-6 col-sm-12 col-12');
        } else if (activeTabText.includes("Loan")) {
            if (windowWidth <= 600) {
                $("#loanCanvas").css("width", "95%");
            } else if (windowWidth <= 992) {
                $("#loanCanvas").css("width", "50%");
            } else {
                $("#loanCanvas").css("width", "39%");
            }
            $('#fadeinpage').addClass('fadeoverlay');
            Common.removevalidation('FormLoan');
            $('#FormLoan #LoanEmployeeId').val(null).trigger('change');
            $('#FormLoan #LoanEmployeeId').prop('disabled', false);
            $('#LoanDate,#LoanAmount,#NoOfDues,#LoanStatusId').prop('disabled', false);

            if (isAdminAccess != "True") {
                $('#FormLoan #LoanEmployeeId').val(UserId).trigger('change');
                $('#FormLoan #LoanEmployeeId').prop('disabled', true);
            }
            $('#loanCanvas #canvasHeader').text("Add Loan");
            loanId = 0;
            $('#loanCmtCol').hide();
            $('#LoanStatusCol').hide();
            $('#LoanDescCol').removeClass('col-md-12 col-lg-12 col-sm-12 col-12').addClass('col-md-6 col-lg-6 col-sm-6 col-6');
        }
        $('#SaveClaim,#SaveAdvance,#SaveLoan').text('Save').addClass('btn-success').removeClass('btn-update');
    });
    $('.close').on('click', function () {
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $('#FormAdvance #AdvanceStatusId').change(function () {
        var selectedText = $(this).find('option:selected').text();
        if (selectedText == "Approved") {
            $('#advanceCmtCol').show();
        } else {
            $('#advanceCmtCol').hide();
        }
    });

    $('#FormLoan #LoanStatusId').change(function () {
        var selectedText = $(this).find('option:selected').text();
        if (selectedText == "Approved") {
            $('#loanCmtCol').show();
        } else {
            $('#loanCmtCol').hide();
        }
    });

    $('#FormClaim #ClaimStatusId').change(function () {
        var selectedText = $(this).find('option:selected').text();
        if (selectedText == "Approved") {
            $('.approverCol').show();
        } else {
            $('.approverCol').hide();
        }
    });


    $('#Claim-TabBtn').click(function () {
        $('#AddDeductions').attr('title', 'Add Claim');
        Common.ajaxCall("GET", "/HumanResource/GetClaim", { ClaimId: null }, getSuccess, null);
        $('#tableFilter').val("");
    });

    $('#Advance-TabBtn').click(function () {
        $('#AddDeductions').attr('title', 'Add Advance');
        Common.ajaxCall("GET", "/HumanResource/GetAdvance", { AdvanceId: null }, getSuccess, null);
        $('#tableFilter').val("");
    });
    $('#Loan-TabBtn').click(function () {
        $('#AddDeductions').attr('title', 'Add Loan');
        Common.ajaxCall("GET", "/HumanResource/GetLoan", { LoanId: null }, getSuccess, null);
        $('#tableFilter').val("");
    });

    $('#LoanAmount,#FormLoan #NoOfDues').on('input', function () {
        var value1 = parseFloat($("#LoanAmount").val()) || 0.00;
        var value2 = parseFloat($("#FormLoan #NoOfDues").val()) || 0.00;

        if (!isNaN(value1) && !isNaN(value2) && value2 !== 0) {
            var result = value1 / value2;
            result = truncateToFixed(result, 2).toFixed(2);
            //result = result.toFixed(2);
            $("#FormLoan #DueAmount").val(result);
        }
        if (loanId == 0) {
            $("#FormLoan #PendingAmount").val(value1);
            $("#FormLoan #PendingDues").val(value2);
            $("#FormLoan #CompletedDue").val("0");
        }
    });

    $('#FormClaim #ApprovedAmount').on('input', function () {
        var claimAmount = parseFloat($('#ClaimAmount').val()) || 0;
        var approvedAmount = parseFloat($(this).val()) || 0;

        if (approvedAmount > claimAmount) {
            $(this).val(claimAmount);
        }
    });
    $('#FormClaim #ExpenseId').change(function () {
        var expval = $(this).val();
        if (expval != "") {
            Common.ajaxCall("GET", "/HumanResource/GetExpenseNo", { ModuleId: parseInt(expval), ModuleName: "Expense" }, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    $('#ExpenseAmount').val(data[0][0].ExpenseAmount);
                    var claimAmount = parseFloat($('#ClaimAmount').val());
                    var expenseAmount = parseFloat($('#ExpenseAmount').val());

                    if (!isNaN(claimAmount) && !isNaN(expenseAmount)) {
                        var sumAmount = expenseAmount - claimAmount;
                        var absoluteAmount = Math.abs(sumAmount);
                        $('#DiffAmount').val(absoluteAmount);

                        $('#DiffAmount').css('color', '');

                        if (sumAmount > 0) {
                            $('#DiffAmount').css('color', 'green');
                        } else if (sumAmount < 0) {
                            $('#DiffAmount').css('color', 'red');
                        }
                    } else {
                        $('#DiffAmount').css('color', '');
                    }
                } else {
                    $('#ExpenseAmount').val("");
                }

            });

        }
    });

    $('#ClaimAmount').on('input', function () {
        var claimAmount = parseFloat($(this).val());
        var expenseAmount = parseFloat($('#ExpenseAmount').val());

        if (!isNaN(claimAmount) && !isNaN(expenseAmount)) {
            var sumAmount = expenseAmount - claimAmount;
            var absoluteAmount = Math.abs(sumAmount);
            $('#DiffAmount').val(absoluteAmount);

            $('#DiffAmount').css('color', '');

            if (sumAmount > 0) {
                $('#DiffAmount').css('color', 'green');
            } else if (sumAmount < 0) {
                $('#DiffAmount').css('color', 'red');
            }
        } else {
            $('#DiffAmount').css('color', '');
        }
    });
});

function truncateToFixed(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.floor(num * factor) / factor;
}

function getSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $('#deductionsTableCol').html('<table class="table table-rounded dataTable data-table table-striped tableResponsive" id="deductionsTable"></table>');

        $("#CounterTextBox1").text(CounterBox[0]);
        $("#CounterTextBox2").text(CounterBox[1]);
        $("#CounterTextBox3").text(CounterBox[2]);
        $("#CounterTextBox4").text(CounterBox[3]);

        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        var columnName = Object.keys(data[1][0])[0];
        var columns = Common.bindColumn(data[1], ['AdvanceId', 'Status_Color', 'LoanId', 'ClaimId']);

        Common.bindTable('deductionsTable', data[1], columns, -1, columnName, '330px', true, access);


        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();

        if (activeTabText.includes("Claim")) {
            $('#CounterImage1').prop('src', '/assets/moduleimages/claim/claimicon_1.svg');
            $('#CounterImage2').prop('src', '/assets/moduleimages/claim/claimicon_2.svg');
            $('#CounterImage3').prop('src', '/assets/moduleimages/claim/claimicon_3.svg');
            $('#CounterImage4').prop('src', '/assets/moduleimages/claim/claimicon_4.svg');

            $("#CounterTextBox1").text('Total');
            $("#CounterTextBox2").text('Requested');
            $("#CounterTextBox3").text('Approved');
            $("#CounterTextBox4").text('Rejected');

            $('#CounterValBox1').text('31 / ₹ 29,758.00');
            $('#CounterValBox2').text('4 / ₹ 6590.00');
            $('#CounterValBox3').text('12 / ₹ 18,555.00');
            $('#CounterValBox4').text('19 / ₹ 11,203.00');

        } else if (activeTabText.includes("Advance")) {
            $('#CounterImage1').prop('src', '/assets/moduleimages/advance/advanceicon_1.svg');
            $('#CounterImage2').prop('src', '/assets/moduleimages/advance/advanceicon_2.svg');
            $('#CounterImage3').prop('src', '/assets/moduleimages/advance/advanceicon_3.svg');
            $('#CounterImage4').prop('src', '/assets/moduleimages/advance/advanceicon_4.svg');

            $("#CounterTextBox1").text('Total Advance');
            $("#CounterTextBox2").text('Total Due');
            $("#CounterTextBox3").text('No Of Request');
            $("#CounterTextBox4").text('No Of Rejected');

            $('#CounterValBox1').text('28 / ₹ 3,90,000.00');
            $('#CounterValBox2').text('₹ 31,000.00');
            $('#CounterValBox3').text('7 / ₹ 38,000.00');
            $('#CounterValBox4').text('2 / ₹ 46,000.00');

        } else if (activeTabText.includes("Loan")) {
            $('#CounterImage1').prop('src', '/assets/moduleimages/loan/loanicon_1.svg');
            $('#CounterImage2').prop('src', '/assets/moduleimages/loan/loanicon_2.svg');
            $('#CounterImage3').prop('src', '/assets/moduleimages/loan/loanicon_3.svg');
            $('#CounterImage4').prop('src', '/assets/moduleimages/loan/loanicon_4.svg');

            $("#CounterTextBox1").text('Total Loan');
            $("#CounterTextBox2").text('Total Due');
            $("#CounterTextBox3").text('No Of Request');
            $("#CounterTextBox4").text('No Of Rejected');

            $('#CounterValBox1').text('23 / ₹ 7,22,000.00');
            $('#CounterValBox2').text('₹ 57,000.00');
            $('#CounterValBox3').text('5 / ₹ 51,000.00');
            $('#CounterValBox4').text('3 / ₹ 26,000.00');

        }

    }
}

function editClaimIdSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.removevalidation('FormClaim');
        Common.bindParentData(data[0], 'FormClaim');
        $("#ClaimStatusId option").each(function () {
            if ($(this).val() !== "" && $(this).val() < data[0][0].ClaimStatusId) {
                $(this).remove();
            }
        });

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#claimCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#claimCanvas").css("width", "50%");
        } else {
            $("#claimCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#claimCanvas #canvasHeader').text("Claim Info");
        $('#preview #selectedFiles').empty("");
        $('#preview #ExistselectedFiles').empty("");
        $('#SaveClaim').text('Update').addClass('btn-update').removeClass('btn-success');

        var ulElement = $('#ExistselectedFiles');
        $.each(data[1], function (index, file) {
            if (file.AttachmentId != null) {
                var truncatedFileName = file.AttachmentFileName.length > 10 ? file.AttachmentFileName.substring(0, 10) + '...' : file.AttachmentFileName;
                var liElement = $('<li>');
                var spanElement = $('<span>').text(truncatedFileName);

                var downloadLink = $('<a>').addClass('download-link')
                    .attr('href', file.AttachmentFilepath)
                    .attr('download', file.AttachmentFileName)
                    .html('<i class="fas fa-download"></i>');

                var deleteButton = $(`<a src="${file.AttachmentFilepath}" AttachmentId="${file.AttachmentId}" ModuleRefId="${file.ModuleRefId}" id="deletefile">`)
                    .addClass('delete-buttonattach').html(`<i class="fas fa-trash"></i>`);
                liElement.append(spanElement);
                liElement.append(downloadLink);
                liElement.append(deleteButton);
                ulElement.append(liElement);
            }
        });

        if (isAdminAccess != "True") {
            if ($("#ClaimStatusId option:selected").text() == "Approved") {
                $('#ClaimDate,#ExpenseId,#ClaimTypeId,#ClaimAmount,#ApprovedAmount').prop('disabled', true);
            } else if ($("#ClaimStatusId option:selected").text() == "Rejected") {
                $('#ClaimDate,#ExpenseId,#ClaimTypeId,#ClaimAmount,#ApprovedAmount,#ClaimStatusId').prop('disabled', true);
            }
            else {
                $('#ClaimDate,#ExpenseId,#ClaimTypeId,#ClaimAmount,#ApprovedAmount').prop('disabled', fasle);
            }
        }
    }
}

function editAdvanceSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.removevalidation('FormAdvance');
        Common.bindParentData(data[0], 'FormAdvance');
        $("#AdvanceStatusId option").each(function () {
            if ($(this).val() !== "" && $(this).val() < data[0][0].AdvanceStatusId) {
                $(this).remove();
            }
        });
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#advanceCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#advanceCanvas").css("width", "50%");
        } else {
            $("#advanceCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#advanceCanvas #canvasHeader').text("Advance Info");
        $('#SaveAdvance').text('Update').addClass('btn-update').removeClass('btn-success');
        //$('#AdvanceDescCol').removeClass('col-md-6 col-lg-6 col-sm-6 col-6').addClass('col-md-12 col-lg-12 col-sm-12 col-12');
        $('#AdvanceAmountCol').removeClass('col-md-6 col-lg-6 col-sm-6 col-6').addClass('col-md-12 col-lg-3 col-sm-12 col-12');
        $('#AdvanceDueCol').removeClass('col-md-6 col-lg-6 col-sm-6 col-6').addClass('col-md-12 col-lg-3 col-sm-12 col-12');

        if (isAdminAccess != "True") {
            if ($("#AdvanceStatusId option:selected").text() == "Approved") {
                $('#AdvanceDate,#AdvanceAmount').prop('disabled', true);
            } else if ($("#AdvanceStatusId option:selected").text() == "Rejected") {
                $('#AdvanceDate,#AdvanceAmount,#AdvanceStatusId').prop('disabled', true);
            }
            else {
                $('#AdvanceDate,#AdvanceAmount,#AdvanceStatusId').prop('disabled', false);
            }
        }


    }
}

function editLoanSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.removevalidation('FormLoan');
        Common.bindParentData(data[0], 'FormLoan');

        $("#LoanStatusId option").each(function () {
            if ($(this).val() !== "" && $(this).val() < data[0][0].LoanStatusId) {
                $(this).remove();
            }
        });
        $('#LoanEmployeeId').val(data[0][0].EmployeeId).trigger('change');

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#loanCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#loanCanvas").css("width", "50%");
        } else {
            $("#loanCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#loanCanvas #canvasHeader').text("Loan Info");
        $('#SaveLoan').text('Update').addClass('btn-update').removeClass('btn-success');
        $('#LoanDescCol').removeClass('col-md-6 col-lg-6 col-sm-6 col-6').addClass('col-md-12 col-lg-12 col-sm-12 col-12');

        if (isAdminAccess != "True") {
            if ($("#LoanStatusId option:selected").text() == "Approved") {
                $('#LoanDate,#LoanAmount,#NoOfDues').prop('disabled', true);
            } else if ($("#LoanStatusId option:selected").text() == "Rejected") {
                $('#LoanDate,#LoanAmount,#NoOfDues,#LoanStatusId').prop('disabled', true);
            }
            else {
                $('#LoanDate,#LoanAmount,#NoOfDues,#LoanStatusId').prop('disabled', false);
            }
        }
    }
}

function SaveSuccess(response) {
    if (response.status) {
        var activeTabText = $('.nav-link.navbar-tab.active').text().trim();
        if (activeTabText.includes("Claim")) {
            Common.ajaxCall("GET", "/HumanResource/GetClaim", { ClaimId: null }, getSuccess, null);
        } else if (activeTabText.includes("Advance")) {
            Common.ajaxCall("GET", "/HumanResource/GetAdvance", { AdvanceId: null }, getSuccess, null);
        } else if (activeTabText.includes("Loan")) {
            Common.ajaxCall("GET", "/HumanResource/GetLoan", { LoanId: null }, getSuccess, null);
        }

        Common.successMsg(response.message);
        $(".offcanvas-container").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');

    } else {
        Common.errorMsg(response.message);
    }
}

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Client",
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
            ModuleName: "Client",
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
