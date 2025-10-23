var ExpenseDropdown = [];
var expenseId = 0;
var FranchiseMappingId = 0;
var StartDate;
var EndDate;

var claimData = [];

let dropdownCache = {
    ExpenseCategory: [],


};

$(document).ready(function () {
    dropdownCache.ExpenseCategory = [];
    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    initializePage(FranchiseMappingId);

    Common.ajaxCall("GET", "/HumanResource/GetExpenseNo", { ModuleId: null, ModuleName: "Claim" }, function (response) {
        if (response.status) {
            claimData = JSON.parse(response.data);
        }
    });

    getDropDownData('ExpenseCategory', function (data) {
        dropdownCache.ExpenseCategory = data;
    });

});
function getDropDownData(moduleName, callback) {
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Common/GetDropDown',
        data: JSON.stringify({ moduleName }),
        success: function (response) {
            if (response.status === true && typeof callback === 'function') {
                callback(response.data);
            }
        }
    });
}
function bindDropDownFromCache(element, dataList, idField, nameField) {
    element.empty().append('<option value="">-- Select --</option>');
    $.each(dataList, function (i, item) {
        element.append($('<option>', {
            value: item[idField],
            text: item[nameField]
        }));
    });
}
async function initializePage(FranchiseMappingId) {
    Common.bindDropDown('BillingFranchise', 'UserFranchiseMapping');
    let ExpenseDropdownVal = await Common.bindDropDownSync('ExpenseType');
    ExpenseDropdown = JSON.parse(ExpenseDropdownVal);
    var today = new Date().toISOString().split('T')[0];
    $("#ExpenseDate").val(today);

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    var fnData = Common.getDateFilter('dateDisplay2');

    $('#AddAttachment').hide();

    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var EditDataId = { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
    Common.ajaxCall("GET", "/Expense/GetExpense", EditDataId, ExpenseSuccess, null);

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
        var EditDataId = { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Expense/GetExpense", EditDataId, ExpenseSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var fnData = Common.getDateFilter('dateDisplay2');

        var EditDataId = { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Expense/GetExpense", EditDataId, ExpenseSuccess, null);
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
            var EditDataId = { FranchiseId: FranchiseMappingId, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString() };
            Common.ajaxCall("GET", "/Expense/GetExpense", EditDataId, ExpenseSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let displayedDate = new Date(currentYear, currentMonth)
        updateMonthDisplay(displayedDate);

        var EditDataId = { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Expense/GetExpense", EditDataId, ExpenseSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });
}

$(document).on('click', '#customBtn_ExpenseData', function () {
    $('.ExpenseTypeId').val(null).trigger('change');
    $('#Headings').text('Add Expense');
    $('#ExpenseModalId').modal('show');
    Common.removevalidation('ExpenseDateForm');
    $('#ExpenseHeader').text('Add Expense Details');
    const today = new Date().toISOString().split('T')[0];
    $("#ExpenseDate").val(today);
    //$("#ExpenseDate").attr("max", today).val(today);
    $('#ExpanseDynRow').empty('');
    $('#InsertExpense').val('Save');
    $('#InsertExpense').text('Save').addClass('btn-success').removeClass('btn-update');
    $('#selectedFiles').empty();
    $('#ExistselectedFiles').empty();
    $('#BillingFranchise').val(null).trigger('change');
    CanvasOpen();
    expenseId = 0;
    $('#dyanmicplusbtn').click();
});


$(document).on('click', '#InsertExpense', function () {
    var FormExpenseDate = $('#ExpenseDateForm').validate().form();
    if (!FormExpenseDate) {
        return false;
    }
    getExistFiles();
    var ExpanseDateString = $('#ExpenseDate').val();
    var expenseDate = new Date(ExpanseDateString);
    var ExpenseDetailsStatic = {
        ExpenseId: expenseId > 0 ? expenseId : null,
        FranchiseId: parseInt(localStorage.getItem('FranchiseId')),
        BillingFranchiseId: $('#BillingFranchise').val(),
        ExpenseDate: expenseDate,
        ExpenseNo: $('#ExpenseNo').val(),
    };
    var ExpenseTypeMappingDetailsArray = [];
    var ExpenseTypeMappingDetails = $('.dynamicclass')
    $.each(ExpenseTypeMappingDetails, function (index, value) {
        ExpenseTypeMappingDetailsArray.push({
            ExpenseTypeMappingId: $(value).data('id') || null,
            ClaimId: parseInt($(value).find('.ClaimId').val()) || null,
            ExpenseCategoryId: parseInt($(value).find('.ExpenseCategoryId').val()) || null,
            TypeId: Common.parseIntValue($(value).find('.ExpenseTypeId').val()),
            ExpenseAmount: Common.parseFloatValue($(value).find('.ExpenseAmount').val()),
            Description: $(value).find('.Comments').val(),
            ExpenseId: expenseId > 0 ? expenseId : null
        });
    });
    formDataMultiple.append("ExpenseDetailsStatic", JSON.stringify(ExpenseDetailsStatic));
    formDataMultiple.append("ExpenseTypeMappingDetails", JSON.stringify(ExpenseTypeMappingDetailsArray));
    formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
    formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));
    $.ajax({
        type: "POST",
        url: "/Expense/InsertUpdateExpenseDetails",
        data: formDataMultiple,
        contentType: false,
        processData: false,
        success: function (response) {

            Common.successMsg(response.message);

            var fnData = Common.getDateFilter('dateDisplay2');
            var EditDataId = { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
            Common.ajaxCall("GET", "/Expense/GetExpense", EditDataId, ExpenseSuccess, null);

            $("#ExpenseCanvas").css("width", "0%");
            $('#fadeinpage').removeClass('fadeoverlay');
            $('#selectedFiles,#ExistselectedFiles').empty('');
            existFiles = [];
            formDataMultiple = new FormData();
            setTimeout(function () {
                var table1 = $('.tableResponsive').DataTable();
                Common.autoAdjustColumns(table1);
            }, 100);
        },
        error: function (response) {
            Common.errorMsg(response.message);
            formDataMultiple = new FormData();
        }
    });
});

$(document).on('click', '#cancelExpense', function () {
    Common.removevalidation('ExpenseDateForm');
    $('#ExpenseModalId').modal('hide');
    $('#ExpanseDynRow').empty('');
    $('#selectedFiles,#ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    setTimeout(function () {
        var table1 = $('.tableResponsive').DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);

});

$('#ExpenseData').on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var ExpenseId = $(this).data('id');
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        Common.ajaxCall("GET", "/Expense/DeleteExpense", { ExpenseId: parseInt(ExpenseId), FranchiseId: FranchiseMappingId }, ExpenseReload, null);
    }
});

$('#BillingFranchise').on('change', function () {
    var franchiseId = parseInt($('#BillingFranchise').val());
    if (franchiseId != "" && franchiseId != null && franchiseId != undefined) {
        var editeData = { FranchiseId: franchiseId, ModuleName: "Expense" };
        Common.ajaxCall("GET", "/Payment/GetAutoGenerateNo", editeData, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                $("#ExpenseNo").val(data[0][0].ExpenseNo);
            }
        }, null);
    }
});

var EditExpenseId = 0;
$('#ExpenseData').on('click', '.btn-edit', function () {
    Common.removevalidation('ExpenseDateForm');
    $('#ExpanseDynRow').empty();
    $('#Headings').text('Expanse Info');
    $('#ExpenseHeader').text('Edit Expense Details');
    var row = $(this).closest('tr');
    var EditExpenseDate = row.find('td:first').text().trim();
    var parts = EditExpenseDate.split('-');
    var day = parts[0];
    var month = parts[1];
    var year = parts[2];
    var formattedDate = month + '/' + day + '/' + year;
    var EditDataId = { ExpenseDate: formattedDate };
    $('#InsertExpense').val('Update');
    $('#InsertExpense').text('Update').addClass('btn-update').removeClass('btn-success');
    $('#selectedFiles').empty();
    $('#ExistselectedFiles').empty();
    CanvasOpen();
    Common.ajaxCall("GET", "/Expense/NotNullGetExpense", EditDataId, ExpenseGetNotNull, null);
});

function ExpenseGetNotNull(response) {
    formDataMultiple = new FormData();
    if (response.status) {
        $('.accordion-collapse').css('display', 'flex');
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
        expenseId = data[0][0].ExpenseId;
        $("#ExpenseNo").val(data[0][0].ExpenseNo);
        $('#ExpenseDate').val(extractDate(data[0][0].ExpenseDate));
        $('#BillingFranchise').val(data[0][0].BillingFranchiseId).trigger('change');
        if (data[1] != null && data[1].length > 0) {
            $('#ExpanseDynRow').empty("");

            var numberIncr = 0;
            $.each(data[1], function (index, value) {
                numberIncr = numberIncr + 1;
                var defaultOption = '<option value="">--Select--</option>';
                var selectOptionsClaim;
                var selectOptionsExpence;

                if (claimData != null && claimData.length > 0 && claimData[0].length > 0) {
                    if (claimData[0][0].ClaimId != null) {
                        selectOptionsClaim = claimData[0].map(function (claimNo) {
                            var isSelected = claimNo.ClaimId == value.ClaimId ? 'selected' : '';
                            return `<option value="${claimNo.ClaimId}" ${isSelected}>${claimNo.ClaimNo}</option>`;
                        }).join('');
                    }
                }
                if (ExpenseDropdown != null && ExpenseDropdown.length > 0 && ExpenseDropdown[0].length > 0) {
                    selectOptionsExpence = ExpenseDropdown[0].map(function (ExpenseTypeId) {
                        var isSelected = ExpenseTypeId.ClaimId == value.ExpenseTypeId ? 'selected' : '';
                        return `<option value="${ExpenseTypeId.ExpenseTypeId}" ${isSelected}>${ExpenseTypeId.ExpenseTypeName}</option>`;
                    }).join('');
                }

                var newRowDataHtml = `
                       <div class="row duplicaterow dynamicclass" data-id="${value.ExpenseTypeMappingId}">
                             <div class="col-lg-4 col-md-6 col-sm-6 col-6">
                              <div class="form-group">
                                  <label>Claim No</label>
                                  <select class="form-control ClaimId" id="ClaimId${numberIncr}" name="ClaimId${numberIncr}" >${defaultOption}${selectOptionsClaim}</select>
                                  
                              </div>
                          </div>
                          <div class="col-lg-4 col-md-6 col-sm-6 col-6">
                            <div class="form-group">
                                <label>Expense Category<span id="Asterisk">*</span></label>
                                <select class="form-control ExpenseCategoryId" id="ExpenseCategoryId${numberIncr}" name="ExpenseCategoryId${numberIncr}" required></select>
        
                            </div>
                        </div>
                           <div class="col-lg-4 col-md-6 col-sm-6 col-6">
                              <div class="form-group">
                                  <label>Expense Type <span id="Asterisk">*</span></label>
                                  <select class="form-control ExpenseTypeId" id="ExpenseTypeId${numberIncr}" name="ExpenseTypeId${numberIncr}" required ${value.ClaimId != null && value.ClaimId != "" ? 'disabled' : ''}>${defaultOption}${selectOptionsExpence}</select>
                                  
                              </div>
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                              <div class="form-group">
                                 <label>Amount <span id="Asterisk">*</span></label>
                                  <input type="text" class="form-control ExpenseAmount" id="ExpenseAmount${numberIncr}" name="ExpenseAmount${numberIncr}" value="${value.ExpenseAmount}" required  ${value.ClaimId != null && value.ClaimId != "" ? 'disabled' : ''}>
                              </div>
                          </div>
                          <div class="col-lg-7 col-md-10 col-sm-10 col-10">
                              <div class="form-group">
                                 <label>Description</label>
                                  <input type="text" class="form-control Comments" id="Comments${numberIncr}" name="Comments${numberIncr}"autocomplete="off" value="${value.Description}"
                                         placeholder="Description">
                              </div>
                          </div>  
                          <div class="col-lg-2 col-md-2 col-sm-2 col-2 p-1 d-flex justify-content-center align-items-center">
                              <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                                     <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                                 </div>
                          </div>
                     </div>`;
                $('#ExpanseDynRow').append(newRowDataHtml)

                let $latestRow = $('#ExpanseDynRow .duplicaterow').last();

                let $dropdown = $latestRow.find('.ExpenseCategoryId');

                let ExpenseCategoryList = JSON.parse(dropdownCache.ExpenseCategory)[0];


                bindDropDownFromCache($dropdown, ExpenseCategoryList, 'ExpenseCategoryId', 'ExpenseCategoryName');

                if (value.ExpenseCategoryId) {
                    $dropdown.val(value.ExpenseCategoryId);
                }


            });
        }
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

                var deleteButton = $(`<a src="${file.AttachmentFilePath}" AttachmentId="${file.AttachmentId}" ModuleRefId="${file.ModuleRefId}" id="deletefile">`)
                    .addClass('delete-buttonattach').html(`<i class="fas fa-trash"></i>`);

                liElement.append(spanElement);
                liElement.append(downloadLink);
                liElement.append(deleteButton);
                ulElement.append(liElement);
            }
        });
    }
}

function ExpenseSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        $("#lblCounterBox1").text(CounterBox[0]);
        $("#lblCounterBox2").text(CounterBox[1]);
        $("#lblCounterBox3").text(CounterBox[2]);
        $("#lblCounterBox4").text(CounterBox[3]);

        $('#valCounterBox1').text(data[0][0][CounterBox[0]]);
        $('#valCounterBox2').text(data[0][0][CounterBox[1]]);
        $('#valCounterBox3').text(data[0][0][CounterBox[2]]);
        $('#valCounterBox4').text(data[0][0][CounterBox[3]]);

        var columns = Common.bindColumn(data[1], ['ExpenseId', 'Status_Colour']);
        Common.bindTableSettings('ExpenseData', data[1], columns, -1, 'ExpenseId', '330px', true, access);
    }
}

var numberIncr = 0;
$(document).on('click', '#dyanmicplusbtn', function () {
    numberIncr = numberIncr + 1;
    var defaultOption = '<option value="">--Select--</option>';
    var selectOptionsClaim;
    var selectOptionsExpence;

    if (claimData != null && claimData.length > 0 && claimData[0].length > 0) {
        if (claimData[0][0].ClaimId != null) {
            selectOptionsClaim = claimData[0].map(function (claimNo) {
                return `<option value="${claimNo.ClaimId}">${claimNo.ClaimNo}</option>`;
            }).join('');
        }
    }
    if (ExpenseDropdown != null && ExpenseDropdown.length > 0 && ExpenseDropdown[0].length > 0) {
        selectOptionsExpence = ExpenseDropdown[0].map(function (ExpenseTypeId) {
            return `<option value="${ExpenseTypeId.ExpenseTypeId}" >${ExpenseTypeId.ExpenseTypeName}</option>`;
        }).join('');
    }

    var newRowDataHtml = `
      <div class="row duplicaterow dynamicclass" data-id="">
            <div class="col-lg-4 col-md-6 col-sm-6 col-6">
             <div class="form-group">
                 <label>Claim No</label>
                 <select class="form-control ClaimId" id="ClaimId${numberIncr}" name="ClaimId${numberIncr}">${defaultOption}${selectOptionsClaim}</select>
                 
             </div>
         </div>
         <div class="col-lg-4 col-md-6 col-sm-6 col-6">
             <div class="form-group">
                 <label>Expense Category<span id="Asterisk">*</span></label>
                 <select class="form-control ExpenseCategoryId" id="ExpenseCategoryId${numberIncr}" name="ExpenseCategoryId${numberIncr}" required></select>
                 
             </div>
         </div>
          <div class="col-lg-4 col-md-6 col-sm-6 col-6">
             <div class="form-group">
                 <label>Expense Type <span id="Asterisk">*</span></label>
                 <select class="form-control ExpenseTypeId" id="ExpenseTypeId${numberIncr}" name="ExpenseTypeId${numberIncr}" required>${defaultOption}${selectOptionsExpence}</select>
                 
             </div>
         </div>
         <div class="col-lg-3 col-md-6 col-sm-6 col-6">
             <div class="form-group">
                <label>Amount <span id="Asterisk">*</span></label>
                 <input type="text" class="form-control ExpenseAmount" id="ExpenseAmount${numberIncr}" name="ExpenseAmount${numberIncr}" required autocomplete="off" oninput="Common.allowOnlyNumbersAndDecimalInventory(this)"
                        placeholder="0.00" required >
             </div>
         </div>
         <div class="col-lg-7 col-md-10 col-sm-10 col-10">
             <div class="form-group">
                <label>Description</label>
                 <input type="text" class="form-control Comments" id="Comments${numberIncr}" name="Comments${numberIncr}"autocomplete="off"
                        placeholder="Description">
             </div>
         </div>  
         <div class="col-lg-2 col-md-2 col-sm-2 col-2 p-1 d-flex justify-content-center align-items-center">
             <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                    <button id="RemoveButton" class="btn DynrowRemove mt-3" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                </div>
         </div>
    </div>`;
    $('#ExpanseDynRow').append(newRowDataHtml)


    let $latestRow = $('#ExpanseDynRow .duplicaterow').last();

    let $dropdown = $latestRow.find('.ExpenseCategoryId');

    let ExpenseCategoryList = JSON.parse(dropdownCache.ExpenseCategory)[0];


    bindDropDownFromCache($dropdown, ExpenseCategoryList, 'ExpenseCategoryId', 'ExpenseCategoryName');

});

$(document).on('click', '.DynrowRemove', function () {
    var rowCount = $('.duplicaterow').length;
    if (rowCount > 1) {
        $(this).closest('.duplicaterow').remove();
    }
});



$(document).on('change', '.ClaimId', function () {
    var thisSelectedValue = $(this).val();
    var thisSelectElement = $(this);
    $('select.ClaimId').each(function (index, value) {
        var existVal = $(value).val();
        if (existVal == thisSelectedValue && value !== thisSelectElement[0] && existVal != null) {
            thisSelectElement.val("");
            $(thisSelectElement).val($('option:contains("--Select--")').val()).trigger('change');
            return false;
        }
    });
    var $row = $(this).closest('.duplicaterow');
    if ($(this).val() != "") {
        Common.ajaxCall("GET", "/HumanResource/GetExpenseNo", { ModuleId: parseInt($(this).val()), ModuleName: "Claim" }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                $row.find('.ExpenseTypeId').val(data[0][0].ClaimTypeId).prop('disabled', true);
                $row.find('.ExpenseAmount').val(data[0][0].ApprovedAmount ?? '').prop('disabled', true);
            }
        });
    } else {
        $row.find('.ExpenseTypeId').val("").prop('disabled', false);
        $row.find('.ExpenseAmount').val("").prop('disabled', false);
    }
});

var formDataMultiple = new FormData();

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
            ModuleName: "Expense",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "Expense",
        ModuleRefId: parseInt(moduleRefId),
        AttachmentFileName: fileText,
        AttachmentFilePath: src
    });
    $(listItem).remove();
});


function extractDate(inputDate) {
    var parts = inputDate.split('T');
    var datePart = parts[0];

    return datePart;
}

function ExpenseReload(response) {
    if (response.status) {
        Common.successMsg(response.message);

        var fnData = Common.getDateFilter('dateDisplay2');
        var EditDataId = { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() };
        Common.ajaxCall("GET", "/Expense/GetExpense", EditDataId, ExpenseSuccess, null);

        setTimeout(function () {
            var table1 = $('.tableResponsive').DataTable();
            Common.autoAdjustColumns(table1);
        }, 100);

    }
    else {
        Common.errorMsg(response.message);
    }
}

$(document).on('click', '#cancelExpense ,#CloseCanvas', function () {
    $("#ExpenseCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});

function CanvasOpen() {
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#ExpenseCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#ExpenseCanvas").css("width", "60%");
    } else {
        $("#ExpenseCanvas").css("width", "40%");
    }
    $('#fadeinpage').addClass('fadeoverlay');
}