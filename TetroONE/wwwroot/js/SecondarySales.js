var shoptId = 0;
var clientId = 0;
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();

$(document).ready(function () {
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    Common.bindDropDownParent('ShopStateId', 'FormShop', 'State');
    Common.bindDropDownParent('ShopTypeId', 'FormShop', 'ShopType');

    //Common.ajaxCall("GET", "/Contact/GetShop", { ShopId: null, DistributorId: clientId }, SecondarySalesSuccess, null);
    Common.ajaxCall("GET", "/Contact/GetShop", { ShopId: null, DistributorId: parseInt(1) }, SecondarySalesSuccess, null);

    $(document).on('click', '#AddSecondarySales', function () {
        shoptId = 0;
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#SecondarySalesCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#SecondarySalesCanvas").css("width", "50%");
        } else {
            $("#SecondarySalesCanvas").css("width", "39%");
        }
        CanvasOpenFirstShowingSecondarySales();
        $("#SecondarySalesHeader").text('Add Secondary Sales Details');
        $('#fadeinpage').addClass('fadeoverlay');
        Common.removevalidation('FormShop');
        $('#FormShop #ShopStateId').val('32');
        $('#FormShop #ShopCountry').val('India');
        $('#FormContactShop #BindContactShop').empty("");
        duplicateShopRow();
        $('#SaveShop').text('Save').removeClass('btn-update').addClass('btn-success'); 
        $('#ShopEmail-error').remove();
        $('#VisicoolerHideShop').removeClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2').addClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2');
        $('#hideActive').hide();
    });

    $(document).on('click', '#CloseSecondarySalesCanvas', function () {
        $("#SecondarySalesCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.removevalidation('FormShop');
        $('#FormContactShop #BindContactShop').empty("");  
    });

    $(document).on('click', '#ShopClose', function () {
        $('#ShopModal').hide();
        Common.removevalidation('FormShop');
        $('#FormContactShop #BindContactShop').empty("");
    });

    $(document).on('input', '#FormShop #MaxCreditLimit', function () {
        if (shoptId == 0) {
            var thisVal = $(this).val();
            $('#FormShop #CurrentCreditLimit').val(thisVal);
        }
    });

    $(document).on('click', '#SaveShop', function () {
        var isValid = true;
        $('.Email').each(function () {
            var inputField = $(this);
            var parentElement = inputField.closest('.form-group');

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputField.val()) && inputField.val() != "") {
                inputField.addClass('error');
                isValid = false;
            } else {
                inputField.removeClass('error');
                parentElement.find('.error-message').remove();
            }
        });

        if (!Common.validateEmailwithErrorwithParent('FormShop', 'ShopEmail')) {
            return false;
        }

        var PrimaryValid = isPrimaryShopChecked('IsPrimary_1', 'Shopcontact');
        if ($("#FormShop").valid() && $("#FormContactShop").valid() && PrimaryValid && isValid) {
            var DataShopStatic = JSON.parse(JSON.stringify(jQuery('#FormShop').serializeArray()));
            var objvalue = {};
            $.each(DataShopStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.ShopId = parseInt(shoptId) || null;
            objvalue.ShopTypeId = parseInt($('#ShopTypeId').val()) || null;
            objvalue.ShopStateId = parseInt($('#ShopStateId').val()) || null;
            objvalue.Visicooler = parseInt($('#Visicooler').val()) || null;
            objvalue.IsActive = $('#FormShop #IsActive').is(':checked');
            objvalue.DistributorId = parseInt(1) || null;
            //objvalue.DistributorId = parseInt(clientId) || null;
            objvalue.CurrentCreditLimit = parseFloat($('#FormShop #CurrentCreditLimit').val()) || null;
            objvalue.MaxCreditLimit = parseFloat($('#FormShop #MaxCreditLimit').val()) || null;

            var ContactPerson = [];
            var ClosestDiv = $('#FormContactShop .Shopcontact');
            $.each(ClosestDiv, function (index, values) {
                var getContactPersonId = $(values).find('.clientContactPersonId').data('id');
                var getSalutationValues = $(values).find('.Salutation').val();
                var getClientContactPersonNameValues = $(values).find('.ContactPerson').val();
                var getContactNumberValues = $(values).find('.MobileNumber').val();
                var geEmailtValues = $(values).find('.Email').val();
                var getIsPrimaryValues = $(values).find('.IsPrimary_1').prop('checked');
                ContactPerson.push({
                    ContactPersonId: parseInt(getContactPersonId) || null,
                    Salutation: getSalutationValues,
                    ContactPersonName: getClientContactPersonNameValues,
                    ContactNumber: getContactNumberValues,
                    Email: geEmailtValues,
                    IsPrimary: getIsPrimaryValues,
                    ContactId: parseInt(shoptId) || null
                });
            });

            objvalue.ShopContactPersonDetails = ContactPerson;

            Common.ajaxCall("POST", "/Contact/InsertUpdateShop", JSON.stringify(objvalue), ShopInsertUpdateSuccess, null);
        }
    });
     
});

function SecondarySalesSuccess(response) {
    if (response.status) {
        var dataShop = JSON.parse(response.data);
        var CounterBox = Object.keys(dataShop[0][0]);

        $('#CounterImage1').prop('src', '');
        $('#CounterImage2').prop('src', '');
        $('#CounterImage3').prop('src', '');
        $('#CounterImage4').prop('src', '');

        $('#CounterImage1').prop('src', '/assets/moduleimages/contact/distributoricon_1.svg');
        $('#CounterImage2').prop('src', '/assets/moduleimages/contact/distributoricon_2.svg');
        $('#CounterImage3').prop('src', '/assets/moduleimages/contact/distributoricon_3.svg');
        $('#CounterImage4').prop('src', '/assets/moduleimages/contact/distributoricon_4.svg');

        $("#SecondarySalesCounterBoxName1").text(CounterBox[0]);
        $("#SecondarySalesCounterBoxName2").text(CounterBox[1]);
        $("#SecondarySalesCounterBoxName3").text(CounterBox[2]);
        $("#SecondarySalesCounterBoxName4").text(CounterBox[3]);

        $('#SecondarySalesCounterBoxValue1').text(dataShop[0][0][CounterBox[0]]);
        $('#SecondarySalesCounterBoxValue2').text(dataShop[0][0][CounterBox[1]]);
        $('#SecondarySalesCounterBoxValue3').text(dataShop[0][0][CounterBox[2]]);
        $('#SecondarySalesCounterBoxValue4').text(dataShop[0][0][CounterBox[3]]);

        $('.table-responsive').empty('');
        var html = `
            <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="SecondarySalesTable"></table>
        `
        $('.table-responsive').append(html);
        var columns = Common.bindColumn(dataShop[1], ['ShopId', 'Status_Color']);
        bindTableShop('SecondarySalesTable', dataShop[1], columns, -1, 'ShopId', '150px', true, access);
    }
}

function ShopInsertUpdateSuccess(response) {
    if (response.status) {
        var Headertext = $("#SecondarySalesHeader").text();
        $("#SecondarySalesHeader").text('');
        if (Headertext == "Edit Secondary Sales") {
            Common.successMsg("Updated Secondary Sales Successfully.");
        } else if (Headertext == '') {
            Common.successMsg("Deleted Successfully.");
        }else {
            Common.successMsg("Secondary Sales Added Successfully.");
        }
        $("#SecondarySalesCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.removevalidation('FormShop');
        $('#FormContactShop #BindContactShop').empty("");
        //Common.ajaxCall("GET", "/Contact/GetShop", { ShopId: null, DistributorId: clientId }, SecondarySalesSuccess, null);
        Common.ajaxCall("GET", "/Contact/GetShop", { ShopId: null, DistributorId: parseInt(1) }, SecondarySalesSuccess, null);
    }
}

$(document).on('click', '.btn-deleteShop', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var shoptId = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/DeletedShop", { ShopId: shoptId }, ShopInsertUpdateSuccess, null);
    }
});

$(document).on('click', '.btn-editShop', function () {
    shoptId = $(this).data('id');
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#SecondarySalesCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#SecondarySalesCanvas").css("width", "50%");
    } else {
        $("#SecondarySalesCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingSecondarySales();
    $('#ShopEmail-error').remove();
    $("#SecondarySalesHeader").text('Edit Secondary Sales');
    Common.removevalidation('FormShop');
    $('#fadeinpage').addClass('fadeoverlay');
    $('#SaveShop').text('Update').removeClass('btn-success').addClass('btn-update');
    //Common.ajaxCall("GET", "/Contact/GetShop", { ShopId: shoptId, DistributorId: clientId }, ShopNotNullSuccess, null);
    Common.ajaxCall("GET", "/Contact/GetShop", { ShopId: shoptId, DistributorId: parseInt(1) }, ShopNotNullSuccess, null);
});
 
function ShopNotNullSuccess(response) {
    var data = JSON.parse(response.data);
    Common.removeMessage('FormShop');
    $('#SaveShop').text('Update').removeClass('btn-success').addClass('btn-update');
    $('#hideActive').show();
    $('#VisicoolerHideShop').removeClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2').addClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2');
    $('#FormContactShop #BindContactShop').empty("");

    Common.bindData(data[0]);

    if (data[0][0].IsActive == true)
        $('#FormShop #IsActive').prop('checked', true);
    else
        $('#FormShop #IsActive').prop('checked', false);

    $('#FormShop #CurrentCreditLimit').val(data[0][0].CurrentCreditLimit);
    $('#FormShop #MaxCreditLimit').val(data[0][0].MaxCreditLimit);
    $.each(data[1], function (index, value) {
        var rowadd = $('.Shopcontact').length;
        var DynamicLableNo = rowadd + 1;
        let unique = Math.random().toString(36).substring(2);
        var PrimaryCheck = value.IsPrimary == true ? 'checked' : '';
        var htmlAppend =
            `
                   <div class="row Shopcontact">
                     <input type="hidden" class="clientContactPersonId" id="ClientContactPersonId" name="ClientContactPersonId" data-id="${value.ShopContactPersonId}" />
                     <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                        <label class="DynamicLable_1">Contact Person ${DynamicLableNo}</label>
                    </div>
                    <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                        <div class="form-group account989">
                            <label>Contact Person Name<span id="Asterisk">*</span></label>
                            <div class="input-group">
                                <div>
                                     <select class="form-control Salutation" autocomplete="off" name="Salutation ${unique}" id="Salutation ${unique}" required>
                                            <option value="Mr" ${value.Salutation == 'Mr' ? 'selected' : ''}>Mr</option>
                                            <option value="Ms" ${value.Salutation == 'Ms' ? 'selected' : ''}>Ms</option>
                                            <option value="Mrs" ${value.Salutation == 'Mrs' ? 'selected' : ''}>Mrs</option>
                                        </select>
                                </div>
                                <input type="text" class="form-control ContactPerson" placeholder="Full Name" name="ContactPerson${unique}" id="ContactPerson${unique}" value="${value.ContactPersonName}" oninput="Common.allowOnlyTextLength(this, 25); Common.removeInvalidFeedback(this)" required />
                            </div>
                        </div>
                    </div>


                    <div class="col-md-6 col-lg-6 col-sm-6 col-6 ">
                        <div class="form-group">
                            <label>Mobile Number<span id="Asterisk">*</span></label>
                            <input type="text" class="form-control MobileNumber" placeholder="Ex:9876543210" id="MobileNumber ${unique}" value="${value.ContactNumber || ''}" name="MobileNumber ${unique}" minlength="10" maxlength="10" oninput="Common.allowOnlyNumberLength(this,10); Common.removeInvalidFeedback(this)" required />
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="form-control Email" placeholder="Ex: example@gmail.com" id="Email${unique}" value="${value.Email || ''}" name="Email${unique}" />
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3 col-sm-6 col-6 ">
                        <div class="d-flex position-absolute justify-content-start isprimaryerror" style="top:10px;left:12%;">
                            <div id="IsPrimary_1Error" class="d-none">
                                <span class="text-danger">Primary is required.</span>
                            </div>
                        </div>
                        <div>
                            <div class="d-flex align-items-center mt-4 ml-4">
                                <input type="checkbox" name="IsPrimary${unique}" class="form-check-input IsPrimary_1" id="IsPrimary${unique}" ${PrimaryCheck}>
                                <label for="IsPrimary_1" class="text-black ml-2 mt-1">IsPrimary</label>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-3 col-sm-6 col-6 thiswillshow">
                        <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                            <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRowShop(this)"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                 </div>
            `;

        $('#FormContactShop #BindContactShop').append(htmlAppend);
        setPrimaryShopCheckboxEventListeners();
    });
}

function duplicateShopRow() {

    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.Shopcontact').length
    var DynamicLableNo = rowadd + 1;

    if ((rowadd < 2)) {
        var htmlRow = `
            <div class="row Shopcontact">
             <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                <label class="DynamicLable_1">Contact Person ${DynamicLableNo}</label>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group account989">
                    <label>Contact Person Name<span id="Asterisk">*</span></label>
                    <div class="input-group">
                        <div>
                            <select class="mrselect Salutation" id="Salutation ${numberIncr}" name="Salutation ${numberIncr}">
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                            </select>
                        </div>
                        <input type="text" class="form-control ContactPerson" placeholder="Full Name" name="ContactPerson${numberIncr}" id="ContactPerson${numberIncr}" oninput="Common.allowOnlyTextLength(this, 25); Common.removeInvalidFeedback(this)" required />
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-6 col-6 ">
                <div class="form-group">
                    <label>Mobile Number<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control MobileNumber" placeholder="Ex:9876543210" id="MobileNumber ${numberIncr}" name="MobileNumber ${numberIncr}" minlength="10" maxlength="10" oninput="Common.allowOnlyNumberLength(this,10); Common.removeInvalidFeedback(this)" required />
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control Email" placeholder="Ex: example@gmail.com" id="Email${numberIncr}" name="Email${numberIncr}" />
                </div>
            </div>
            <div class="col-md-6 col-lg-3 col-sm-6 col-6 ">
                <div class="d-flex position-absolute justify-content-start isprimaryerror" style="top:10px;left:12%;">
                    <div id="IsPrimary_1Error" class="d-none">
                        <span class="text-danger">Primary is required.</span>
                    </div>
                </div>
                <div>
                    <div class="d-flex align-items-center mt-4 ml-4">
                        <input type="checkbox" name="IsPrimary${numberIncr}" class="form-check-input IsPrimary_1" id="IsPrimary${numberIncr}">
                        <label for="IsPrimary_1" class="text-black ml-2 mt-1">IsPrimary</label>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-lg-3 col-sm-6 col-6 thiswillshow_1" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                    <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRowShop(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
           `;

        $('#FormContactShop #BindContactShop').append(htmlRow);
        setPrimaryShopCheckboxEventListeners();
        updateRemoveButtonsShop();
    }
}




function isPrimaryShopChecked(SelectId, SelectClass) {
    var inputVal = $('#' + SelectId).val();
    if (inputVal == "2") {
        return true;
    }
    var isChecked = false;
    $('.' + SelectClass).each(function () {
        var checkbox = $(this).find('.IsPrimary_1');
        if (checkbox.prop('checked')) {
            isChecked = true;
            return false;
        }
    });
    if (!isChecked) {
        $('#IsPrimary_1Error').removeClass('d-none');
    } else {
        $('#IsPrimary_1Error').addClass('d-none');
    }
    return isChecked;
}

function setPrimaryShopCheckboxEventListeners() {
    $('.IsPrimary_1').off('change').on('change', function () {
        if ($(this).prop('checked')) {
            $('.IsPrimary_1').not(this).prop('checked', false);
            $('#IsPrimary_1Error').addClass('d-none');
        } else {
            $('#IsPrimary_1Error').removeClass('d-none');
        }
    });
}

function updateRowLabelsShop() {
    $('.Shopcontact').each(function (index) {
        // Update the label text with the correct row number
        $(this).find('.DynamicLable_1').text('Contact Person ' + (index + 1));
    });
}

function updateRemoveButtonsShop() {
    var rows = $('.Shopcontact');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow_1');
        if (rows.length == 1) {
            removeButtonDiv.css('display', 'none');
        } else {
            removeButtonDiv.css('display', 'block');
        }
    });
}

function removeRowShop(button) {
    var totalRows = $('.Shopcontact').length;
    if (totalRows > 1) {
        $(button).closest('.Shopcontact').remove();
        updateRowLabelsShop();
        updateRemoveButtonsShop();
    }
}

function validateFormAccordions(accordionSelector, errorMessageDefault = 'This field is required') {
    var isFormValid = true;
    var firstInvalidAccordion = null;

    $(accordionSelector).each(function () {
        var currentAccordion = $(this);
        var headerText = currentAccordion.find('.accordion-header strong').text().trim();
        var requiredFields = currentAccordion.find('input[required], select[required], textarea[required]');
        var isCurrentValid = true;

        requiredFields.each(function () {
            var input = $(this);
            var value = input.val().trim();
            var minLength = input.attr('minlength');
            var maxLength = input.attr('maxlength');
            var errorMessage = errorMessageDefault;

            var isInvalid = false;

            if (!value) {
                isInvalid = true;
                errorMessage = errorMessageDefault;
            } else if (minLength && value.length < parseInt(minLength)) {
                isInvalid = true;
                errorMessage = `Please enter at least ${minLength} characters.`;
            } else if (maxLength && value.length > parseInt(maxLength)) {
                isInvalid = true;
                errorMessage = `Please enter no more than ${maxLength} characters.`;
            }

            if (isInvalid) {
                input.addClass('is-invalid error');
                input.nextAll('.invalid-feedback, .error').remove();
                input.after('<div class="invalid-feedback">' + errorMessage + '</div>');
                isCurrentValid = false;
                isFormValid = false;
                if (!firstInvalidAccordion) {
                    firstInvalidAccordion = currentAccordion;
                }
            } else {
                input.removeClass('is-invalid error');
                input.nextAll('.invalid-feedback, .error').remove();
            }
        });

        if (headerText === "Franchise Mapping Info") {
            var checkboxes = currentAccordion.find('input[type="checkbox"]');
            var anyChecked = checkboxes.is(':checked');
            if (!anyChecked) {
                isCurrentValid = false;
                isFormValid = false;
                if (!currentAccordion.find('.checkbox-error').length) {
                    currentAccordion.find('#BindFranchiseData').append(
                        '<div class="invalid-feedback checkbox-error d-flex justify-content-center">Please select at least one franchise</div>'
                    );
                }

                if (!firstInvalidAccordion) {
                    firstInvalidAccordion = currentAccordion;
                }
            } else {
                currentAccordion.find('.checkbox-error').remove();
            }
        }

        if (isCurrentValid) {
            currentAccordion.find('.collapse').collapse('hide');
        }
    });

    if (firstInvalidAccordion) {
        firstInvalidAccordion.find('.collapse').collapse('show');
    }

    return isFormValid;
}

$(document).on("input", '#FormContactShop #ShopEmail', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormContactShop', 'ShopEmail')) {
        $('#FormContactShop #ShopEmail-error').remove();
        if (inputElement != "") {
            $(element).addClass('is-invalid error');
        }
    }
});

$(document).on("input", '#FormShop #ShopEmail', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormShop', 'ShopEmail')) {
        $('#FormShop #ShopEmail-error').remove();
        if (inputElement != "") {
            $(element).addClass('is-invalid error');
        }
    }
});

$(document).on('input', '.Email', function () {
    var inputField = $(this);
    var parentElement = inputField.closest('.form-group');
    var errorLabel = parentElement.find('.error-message');

    var inputValue = inputField.val();

    errorLabel.filter('[data-for="' + inputField.attr('id') + '"]').remove();

    if (inputField.prop('required') && inputValue.length === 0) {
        inputField.removeClass('error');
        return true;
    }

    if (/^[^\s@]+@[^\s@]+(\.[^\s@]+)+$/.test(inputValue)) {
        inputField.removeClass('error');
        errorLabel.remove();
    }
    else if (inputValue.length > 0 && errorLabel.length === 0) {
        inputField.addClass('error');
        parentElement.append('<label class="error-message" style="font-weight: 600;color: red !important;font-size: 12px !important;margin-top: .5rem;">Valid email is required</label>');
        return false;
    }
    else if (inputValue.length === 0) {
        inputField.removeClass('error');
        errorLabel.remove();
    }

    return true;
});

function bindTableShop(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

    if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [
        {
            "targets": StatusColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Status_Color != null && row.Status_Color.length > 0) {
                    var dataText = row.Status;
                    var statusColor = row.Status_Color.toLowerCase();

                    var htmlContent = '<div>';
                    htmlContent += '<span class="ana-span badge text-white" style="background:' + statusColor + ';width: 99px;font-size: 12px;height: 20px;">' + dataText + '</span>';
                    htmlContent += '</div>';

                    return htmlContent;
                }
                return data;
            }
        }


    ];

    if (access.update || access.delete) {
        renderColumn.push(
            {
                targets: actionTarget,
                render: function (data, type, row, meta) {
                    var editCondition = access.update;
                    var deleteCondition = access.delete;
                    if (editCondition || deleteCondition) {
                        return `
                                 ${editCondition ? `<i class="btn-editShop mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-deleteShop alert_delete mx-1"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
                    }
                }
            }
        )
    }
    var lang = {};
    var screenWidth = $(window).width();
    if (screenWidth <= 575) {
        var lang = {
            "paginate": {
                "next": ">",
                "previous": "<"
            }
        }
    }

    var shoptable = $('#' + tableid).DataTable({
        "dom": "Bfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !isTetroONEnocount ? data : [],
        "columns": columns,
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "aaSorting": [],
        "scrollCollapse": true,
        "oSearch": { "bSmart": false, "bRegex": true },
        "info": hasValidData,
        "paging": hasValidData,
        "pageLength": 8,
        "lengthMenu": [7, 14, 50],
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "columnDefs": !isTetroONEnocount
            ? renderColumn : [],
    });
    $('#tableFilterShop').on('keyup', function () {
        shoptable.search($(this).val()).draw();
    });
    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
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

function CanvasOpenFirstShowingSecondarySales() {
    $('#SecondarySalesCanvas').addClass('show');
    $('#SecondarySalesCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#SecondarySalesCanvas').offset().top
    }, 'fast');
}