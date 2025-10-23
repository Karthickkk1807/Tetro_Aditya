Common = {
    warning: "warning",
    success: "success",
    error: "error",
    currentYear: (new Date).getFullYear(),
    setLoadStatusText: function (option) {
        if (option)
            $('#LoadingStatus').text('Please wait...');
        else
            $('#LoadingStatus').text('Please wait...');
    },
    parseIntValue: function (inputId) {
        var inputValue = inputId;
        if (inputValue === "") {
            return null;
        }
        return parseInt(inputValue) || 0;
    },
    askConfirmationforCancel: function (messageText) {
        return new Promise((resolve, reject) => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showCancelButton: true,
                confirmButtonColor: '#4bb942',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                //timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    document.getElementById('toastBackdrop').style.display = 'block';
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
                willClose: () => {
                    document.getElementById('toastBackdrop').style.display = 'none';
                }
            });

            Toast.fire({
                icon: 'error',
                animation: false,
                title: messageText
            }).then((result) => {
                if (result.isConfirmed) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },
    getAsycDataInventory: function (input) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: input,
                data: null,
                success: function (response) {
                    if (response.status == true) {
                        resolve(response);
                    }
                },
                error: function (response) {
                    resolve([]);
                },
            });
        });
    },
    allowOnlyNumbersAndDecimalInventory: function (inputElement) {
        let cleanedValue = inputElement.value.replace(/[^\d.]/g, ''); // Remove non-numeric and non-decimal characters

        let parts = cleanedValue.split('.'); // Split into integer and decimal parts

        let integerPart = parts[0].slice(0, 6); // Limit integer part to maximum two digits
        let decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : ''; // Limit decimal part to maximum two digits

        // Combine integer and decimal parts
        let resultValue = integerPart + decimalPart;

        inputElement.value = resultValue; // Set the input element value to the sanitized result
    },
    allowOnlyNumbersAndDecimalRawMaterial6Digit: function (inputElement) {
        let cleanedValue = inputElement.value.replace(/[^\d.]/g, ''); // Remove non-numeric and non-decimal characters

        let parts = cleanedValue.split('.'); // Split into integer and decimal parts

        let integerPart = parts[0].slice(0, 6); // Limit integer part to maximum two digits
        let decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 5) : ''; // Limit decimal part to maximum two digits

        // Combine integer and decimal parts
        let resultValue = integerPart + decimalPart;

        inputElement.value = resultValue; // Set the input element value to the sanitized result
    },
    bindDropDownParentforChosen: function (id, parent, moduleName) {
        var request = {
            moduleName: moduleName
        };
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: '/Common/GetDropdownDetails',
            data: JSON.stringify(request),
            success: function (response) {
                if (response.status == true) {
                    Common.bindParentDropDownSuccessForChosen(response.data, id, parent);
                }
            },
            error: function (response) {

            },
        });
    },
    bindParentDropDownSuccessForChosen: function (response, controlid, parent) {
        if (response != null) {
            var data = JSON.parse(response);
            var dataValue = data[0];
            if (dataValue != null && dataValue.length > 0 && !dataValue[0].hasOwnProperty('airlogix')) {
                $('#' + parent + ' #' + controlid).empty(); // Clear existing options
                var valueproperty = Object.keys(dataValue[0])[0];
                var textproperty = Object.keys(dataValue[0])[1];

                // Add an empty option to mimic the default behavior of Chosen
                $('#' + parent + ' #' + controlid).append($('<option>', {
                    value: '',
                    text: '-- Select --',
                    css: {
                        'font-weight': '400'
                    }
                }));

                // Iterate over the data and add options to the chosen dropdown
                $.each(dataValue, function (index, item) {
                    $('#' + parent + ' #' + controlid).append($('<option>', {
                        value: item[valueproperty],
                        text: item[textproperty],
                    }));
                });

                // Trigger Chosen to update the dropdown
                $('#' + parent + ' #' + controlid).trigger('chosen:updated');
            } else {
                // Clear existing options and add an empty default option
                $('#' + parent + ' #' + controlid).empty();
                $('#' + parent + ' #' + controlid).append($('<option>', {
                    value: '',
                    text: '-- Select --',
                    css: {
                        'font-weight': '400'
                    }
                }));

                // Trigger Chosen to update the dropdown
                $('#' + parent + ' #' + controlid).trigger('chosen:updated');
            }
        }
    },

    VendorRemoveValidation: function () {
        ;
        Common.removevalidation('FormRightSideHeader');
        Common.removevalidation('FormShipping');
        Common.removevalidation('FormVendor');
        Common.removevalidation('FormPaidBalance');
        Common.removevalidation('frmtaxdiscountothers');
    },
    AutoGenerateNumberGet: function (response, IdColumn, ResponseName) {

        if (response.status) {
            try {
                var data = JSON.parse(response.data);
                if (data && data.length > 0 && data[0][0].hasOwnProperty(ResponseName)) {
                    $("#" + IdColumn).val(data[0][0][ResponseName]);
                } else {
                    console.error("PurchaseOrderNumber key not found in response data.");
                }
            } catch (e) {
                console.error("Error parsing response data:", e);
            }
        } else {
            console.error("Response status is false.");
        }
    },
    parseInputValue: function (inputId) {
        var inputValue = $('#' + inputId).val();
        if (inputValue === "") {
            return null;
        }
        return parseInt(inputValue) || 0;
    },
    parseFloatInputValue: function (inputId) {
        var inputValue = $('#' + inputId).val();
        if (inputValue === "") {
            return null;
        }
        return parseFloat(inputValue) || 0;

    },
    parseFloatValue: function (inputId) {
        var inputValue = inputId;
        if (inputValue === "") {
            return null;
        }
        return parseFloat(inputValue) || 0;

    },
    ajaxCall: function (type, url, data, onSuccess, onError) {

        if (onError == undefined)
            onError = Common.g_onError;
        var g_onSuccess = function (bool) {
            return function (response, textStatus, jqXHR) {
                onSuccess(response);
            }
        };

        $.ajax({
            type: type,
            contentType: "application/json",
            dataType: "json",
            url: url,
            data: data,
            success: g_onSuccess(true),
            error: onError
        });
    },
    ajaxCallAsync: function (type, url, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: type,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: url,
                data: JSON.stringify(data),
                success: function (response) {
                    if (response.status == true) {
                        resolve(response.data);
                    }
                },
                error: function (response) {
                    resolve([]);
                },
            });
        });
    },
    setupValidation: function (formId, rules, messages) {
        ;
        $(formId).validate({
            rules: rules,
            messages: messages,
            errorPlacement: function (error, element) {
                if (element.is("select")) {
                    var select2Container = element.siblings(".select2-container");
                    if (select2Container.length) {
                        error.insertAfter(select2Container);
                    } else {
                        error.insertAfter(element);
                    }
                } else {
                    error.insertAfter(element);
                }
            }
        });
    },
    handleDropdownError: function (selector) {
        $(document).on('change', selector, function () {
            var value = $(this).val();
            if (value != "") {
                $(this).siblings('.error').remove();
            }
        });
    },
    VendorhandleDropDown: function () {
        Common.handleDropdownError('#Vendor');
        Common.handleDropdownError('#ShipType');
        Common.handleDropdownError('#ShipToLocation');
        Common.handleDropdownError('#PaidFrom');
        Common.handleDropdownError('.taxandothers');
        Common.handleDropdownError('#StateId');
    },
    getAsycData: function (input) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: input,
                data: null,
                success: function (response) {
                    if (response.status == true) {
                        resolve(response.data);
                    }
                },
                error: function (response) {
                    resolve([]);
                },
            });
        });
    },
    ClientRemoveValidation: function () {
        Common.removevalidation('FormShipping');
        Common.removevalidation('FormRightSideHeader');
        Common.removevalidation('frmtaxdiscountothers');
        Common.removevalidation('FormPaidBalance');
        Common.removevalidation('FormClient');
    },
    VendorRquiredMassage: function () {
        Common.Select2RequiredMassage('#FormShipping');
        Common.Select2RequiredMassage('#FormVendor');
        Common.Select2RequiredMassage('#FormPaidBalance');
        Common.Select2RequiredMassage('#frmtaxdiscountothers');
        Common.Select2RequiredMassage('#StoreWareAddressForm');
        Common.Select2RequiredMassage('#BillingAddressForm');
    },
    bindData: function (data) {
        if (data != null && data.length > 0) {
            var datavalue = data[0];
            for (const key in datavalue) {
                if (datavalue.hasOwnProperty(key) && $('#' + key).length > 0) {
                    switch ($('#' + key)[0].nodeName.toLowerCase()) {
                        case "p":
                        case "label":
                            $('#' + key).text(datavalue[key]);
                            break;
                        case "a":
                            $('#' + key).text(datavalue[key]);
                            break;
                        case "input":
                            if ($('#' + key).attr('type') === 'date') {
                                var dateString = datavalue[key];

                                var dateComponents = dateString.split("-");
                                var day = dateComponents[0];
                                var month = dateComponents[1];
                                var year = dateComponents[2];

                                var formattedDate = year + "-" + month + "-" + day;
                                $('#' + key).val(formattedDate);
                            }
                            else if ($('#' + key).attr('type') === 'checkbox') {
                                $('#' + key).prop('checked', ((datavalue[key] == "Yes" || datavalue[key] == "1" || datavalue[key] == 1) ? true : false));
                            } else {
                                if ($('#' + key).attr('type') === 'checkbox') {
                                    $('#' + key).prop('checked', ((datavalue[key] == "Yes" || datavalue[key] == "1" || datavalue[key] == 1) ? true : false));
                                }
                                $('#' + key).val(datavalue[key]);
                            }
                            break;
                        case "select":
                            $('#' + key).val(datavalue[key]);
                            $('#' + key).val(datavalue[key]).trigger('change');
                            break;
                        case "textarea":
                            $('#' + key).val(datavalue[key]);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    },
    bindParentData: function (data, parentId) {
        if (data != null && data.length > 0) {
            var datavalue = data[0];
            for (const key in datavalue) {
                if (datavalue.hasOwnProperty(key) && datavalue[key] != null && datavalue[key] !== "" && $('#' + parentId + ' #' + key).length > 0) {
                    switch ($('#' + parentId + ' #' + key)[0].nodeName.toLowerCase()) {
                        case "p":
                        case "label":
                            $('#' + parentId + ' #' + key).text(datavalue[key]);
                            break;
                        case "a":
                            $('#' + parentId + ' #' + key).text(datavalue[key]);
                            break;
                        case "input":
                            if ($('#' + parentId + ' #' + key).attr('type') === 'date' && datavalue[key] != null) {
                                var dateString = datavalue[key];
                                var dateComponents = dateString.split("-");
                                var day = dateComponents[0];
                                var month = dateComponents[1];
                                var year = dateComponents[2];
                                var formattedDate = year + "-" + month + "-" + day;
                                $('#' + parentId + ' #' + key).val(formattedDate);
                            }
                            else if ($('#' + parentId + ' #' + key).attr('type') === 'checkbox') {
                                $('#' + parentId + ' #' + key).prop('checked', ((datavalue[key] == "Yes" || datavalue[key] == "1" || datavalue[key] == 1) ? true : false));
                            } else {
                                if ($('#' + parentId + ' #' + key).attr('type') === 'checkbox') {
                                    $('#' + parentId + ' #' + key).prop('checked', ((datavalue[key] == "Yes" || datavalue[key] == "1" || datavalue[key] == 1) ? true : false));
                                }
                                $('#' + parentId + ' #' + key).val(datavalue[key]);
                            }
                            break;
                        case "select":
                            $('#' + parentId + ' #' + key).val(datavalue[key]);
                            $('#' + parentId + ' #' + key).val(datavalue[key]).trigger('change');
                            break;
                        case "textarea":
                            $('#' + parentId + ' #' + key).val(datavalue[key]);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    },

    bindDropDown: function (id, moduleName) {

        var request = {
            moduleName: moduleName
        };
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: '/Common/GetDropDown',
            data: JSON.stringify(request),
            success: function (response) {
                if (response.status == true) {
                    Common.bindDropDownSuccess(response.data, id);
                }
            },
            error: function (response) {

            },
        });
    },

    bindDropDownSuccess: function (response, controlid) {
        if (response != null) {
            var data = JSON.parse(response);
            $('#' + controlid).empty();
            var dataValue = data[0];
            if (dataValue != null && dataValue.length > 0) {
                var valueproperty = Object.keys(dataValue[0])[0];
                var textproperty = Object.keys(dataValue[0])[1];
                $('#' + controlid).append($('<option>', {
                    value: '',
                    text: '--Select--',
                }));
                $.each(dataValue, function (index, item) {
                    $('#' + controlid).append($('<option>', {
                        value: item[valueproperty],
                        text: item[textproperty],
                    }));
                });
            } else {
                $('#' + controlid).append($('<option>', {
                    value: '',
                    text: '--Select--',
                }));
            }
        }
    },

    bindDropDownSync: function (moduleName) {
        return new Promise((resolve, reject) => {
            var request = {
                moduleName: moduleName
            };
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: '/Common/GetDropDown',
                data: JSON.stringify(request),
                success: function (response) {
                    if (response.status == true) {
                        resolve(response.data);
                    }
                },
                error: function (response) {
                    resolve([]);
                },
            });
        });
    },

    bindDropDownDynamicBind: function (moduleName) {
        return new Promise((resolve, reject) => {
            var request = {
                masterInfoId: null,
                moduleName: moduleName
            };
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: '/Common/GetDropDown',
                data: JSON.stringify(request),
                success: function (response) {
                    if (response.status == true) {
                        resolve(response.data);
                    }
                },
                error: function (response) {
                    resolve([]);
                },
            });
        });
    },

    allowOnlyContactNoAlternativeLength: function (inputElement, maxLength) {
        let value = inputElement.value;

        // Allow digits, parentheses, hyphens, and a single '+' at the start, but no spaces
        value = value.replace(/[^+\d()\-\+\s]+/g, '');  // Remove all non-valid characters including spaces

        // Ensure only one '+' at the start
        if (value.charAt(0) === '+') {
            // If there are any other '+' symbols, remove them
            value = '+' + value.substring(1).replace(/\+/g, '');
        } else {
            // If there's no '+' at the start, remove all '+' symbols from the rest of the string
            value = value.replace(/\+/g, '');
        }

        let openBracketCount = (value.match(/\(/g) || []).length;
        let closeBracketCount = (value.match(/\)/g) || []).length;
        let hyphenCount = (value.match(/-/g) || []).length;
        let SpaceCount = (value.match(/\s/g) || []).length;

        // Fix multiple opening brackets
        if (openBracketCount > 1) {
            let lastOpenBracketIndex = value.lastIndexOf('(');
            value = value.substring(0, lastOpenBracketIndex) + value.substring(lastOpenBracketIndex).replace(/\(/g, '');
        }

        // Fix multiple spaces (keep only one space between valid characters)
        if (SpaceCount > 1) {
            value = value.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
        }

        // Fix multiple closing brackets
        if (closeBracketCount > 1) {
            let lastCloseBracketIndex = value.lastIndexOf(')');
            value = value.substring(0, lastCloseBracketIndex) + value.substring(lastCloseBracketIndex).replace(/\)/g, '');
        }

        // Fix multiple hyphens
        if (hyphenCount > 1) {
            let lastHyphenIndex = value.lastIndexOf('-');
            value = value.substring(0, lastHyphenIndex) + value.substring(lastHyphenIndex).replace(/-/g, '');
        }

        // Limit the input length
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },
    bindDropDownParent: function (id, parent, moduleName) {
        var request = {
            moduleName: moduleName
        };
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: '/Common/GetDropDown',
            data: JSON.stringify(request),
            success: function (response) {
                if (response.status == true) {
                    Common.bindParentDropDownSuccess(response.data, id, parent);
                }
            },
            error: function (response) {

            },
        });
    },
    bindParentDropDownSuccess: function (response, controlid, parent) {
        if (response != null) {
            var data = JSON.parse(response);
            var dataValue = data[0];
            if (dataValue != null && dataValue.length > 0 && !dataValue[0].hasOwnProperty('TetroONEnocount')) {
                var valueproperty = Object.keys(dataValue[0])[0];
                var textproperty = Object.keys(dataValue[0])[1];
                $('#' + parent + ' #' + controlid).empty();
                $('#' + parent + ' #' + controlid).append($('<option>', {
                    value: '',
                    text: '--Select--',
                }));
                $.each(dataValue, function (index, item) {
                    $('#' + parent + ' #' + controlid).append($('<option>', {
                        value: item[valueproperty],
                        text: item[textproperty],
                    }));
                });
            }
        }
    },

    bindColumn: function (data, hideColumns) {
        var columns = [];
        if (data != null && data.length > 0) {
            for (const key of Object.keys(data[0])) {
                const columnName = key.replace(/([A-Z])/g, ' $1');
                if (hideColumns != null && hideColumns.length > 0) {
                    var filterdata = hideColumns.filter(x => x == key);
                    if (filterdata != null && filterdata.length > 0) {
                        columns.push({
                            "data": key, "name": key, "visible": false, "title": columnName
                        });
                    } else {
                        columns.push({
                            "data": key, "name": key, "title": columnName
                        });
                    }
                } else {
                    columns.push({
                        "data": key, "name": key, "title": columnName
                    });
                }
            }
        }
        return columns;
    },

    bindTableSettings: function (tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction) {
        if ($.fn.DataTable.isDataTable('#' + tableid)) {
            $('#' + tableid).DataTable().clear().destroy();
        }
        $('#' + tableid).empty();
        columns = columns.filter(x => x.name != "TetroONEnocount");

        var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
        if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount) {
            columns.push({
                "data": "Action", "name": "Action", "title": "Action", orderable: false
            });
        }

        var renderColumn = [];
        renderColumn.push(
            {
                targets: actionTarget,
                render: function (data, type, row, meta) {
                    return `<td><div class="actionEllipsis"><i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i> 
                                <i class="btn-delete alert_delete"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></td></div>`;

                }
            }
        )

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

        var table = $('#' + tableid).DataTable({
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
            "info": false,
            "paging": false,
            "pageLength": 7,
            "lengthMenu": [7, 14, 50],
            "language": $.extend({}, lang, {
                "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
            }),
            "columnDefs": !isTetroONEnocount
                ? renderColumn : [],
        });
        $('#tableFilter').on('keyup', function () {
            table.search($(this).val()).draw();
        });
        setTimeout(function () {
            var table1 = $('#' + tableid).DataTable();
            Common.autoAdjustColumns(table1);
        }, 100);
    },

    bindTableForNoStatus: function (tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
        if ($.fn.DataTable.isDataTable('#' + tableid)) {
            $('#' + tableid).DataTable().clear().destroy();
        }
        $('#' + tableid).empty();

        columns = columns.filter(x => x.name != "TetroONEnocount");
        var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
        var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

        if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
            columns.push({
                "data": "Action", "name": "Action", "title": "Action", orderable: false
            });
        }

        var renderColumn = [

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
                                 ${editCondition ? `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-delete alert_delete mx-1"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
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

        var table = $('#' + tableid).DataTable({
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
            "pageLength": 7,
            "lengthMenu": [7, 14, 50],
            "language": $.extend({}, lang, {
                "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
            }),
            "columnDefs": !isTetroONEnocount
                ? renderColumn : [],
        });
        $('#tableFilter').on('keyup', function () {
            table.search($(this).val()).draw();
        });
        setTimeout(function () {
            var table1 = $('#' + tableid).DataTable();
            Common.autoAdjustColumns(table1);
        }, 100);
    },

    bindTable: function (tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
        if ($('#' + tableid).length && $.fn.DataTable.isDataTable('#' + tableid)) {
            try {
                //$('#' + tableid).DataTable().clear().destroy();
            } catch (error) {
                console.error('DataTable destroy error:', error);
                return; // stop execution if there's an error
            }
        }
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
                        htmlContent += '<span class="ana-span badge text-white" style="background:' + statusColor + ';width: 115px;font-size: 12px;height: 23px;">' + dataText + '</span>';
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
                                 ${editCondition ? `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-delete alert_delete mx-1"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
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

        var table = $('#' + tableid).DataTable({
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
            "pageLength": 7,
            "lengthMenu": [7, 14, 50],
            "language": $.extend({}, lang, {
                "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
            }),
            "columnDefs": !isTetroONEnocount
                ? renderColumn : [],
        });
        $('#tableFilter').on('keyup', function () {
            table.search($(this).val()).draw();
        });
        setTimeout(function () {
            var table1 = $('#' + tableid).DataTable();
            Common.autoAdjustColumns(table1);
        }, 100);
    },

    bindTablePurchase: function (tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
        if ($.fn.DataTable.isDataTable('#' + tableid)) {
            $('#' + tableid).DataTable().clear().destroy();
        }
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
                                 ${editCondition ? `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-delete alert_delete mx-1"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
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
        var table = $('#' + tableid).DataTable({
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
            "pageLength": 7,
            "lengthMenu": [5, 10, 50],
            "language": $.extend({}, lang, {
                "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
            }),
            "columnDefs": !isTetroONEnocount
                ? renderColumn : [],
        });
        $('#tableFilter').on('keyup', function () {
            table.search($(this).val()).draw();
        });
        setTimeout(function () {
            var table1 = $('#' + tableid).DataTable();
            Common.autoAdjustColumns(table1);
        }, 100);
    },

    bindTableAuditPreview: function (tableid, data, columns, scrollpx) {
        if ($.fn.DataTable.isDataTable('#' + tableid)) {
            $('#' + tableid).DataTable().clear().destroy();
        }
        $('#' + tableid).empty();
        columns = columns.filter(x => x.name != "TetroONEnocount");
        var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');

        var renderColumn = [];

        $('#' + tableid).DataTable({
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
            "info": false,
            "paging": false,
            "searching": false,
            "pageLength": 7,
            "lengthMenu": [5, 10, 50],
            "language": {
                "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
            },
            "columnDefs": !isTetroONEnocount
                ? renderColumn : [],
        });
        setTimeout(function () {
            var table1 = $('#' + tableid).DataTable();
            Common.autoAdjustColumns(table1);
        }, 100);
    },


    parseInputValue: function (inputId) {
        var inputValue = $('#' + inputId).val();
        if (inputValue === "") {
            return null;
        }
        return parseInt(inputValue) || 0;
    },

    allowOnlyTextLength: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^A-Za-z\s]+/g, '');
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }
        inputElement.value = value;
    },

    allowOnlyNumbersAndDecimalwithmaxlength: function (inputElement, maxLength) {
        let cleanedValue = inputElement.value.replace(/[^\d.]/g, '');

        let parts = cleanedValue.split('.');

        let integerPart = parts[0].slice(0, maxLength); // Restrict before decimal to maxLength
        let decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : '';

        let resultValue = integerPart + decimalPart;

        inputElement.value = resultValue;
    },
    allowOnlyNumberLength: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/\D/g, '');
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }
        inputElement.value = value;
    },

    allowOnlyNumbersAndAfterDecimalTwoVal: function (inputElement, maxLength) {
        let cleanedValue = inputElement.value.replace(/[^\d.]/g, '');
        let parts = cleanedValue.split('.');
        let integerPart = parts[0];
        let decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : '';
        if (integerPart.length > maxLength) {
            integerPart = integerPart.slice(0, maxLength);
        }
        let resultValue = integerPart + decimalPart;
        inputElement.value = resultValue;
    },
    
    allowTextNumberAndWithoutSpace: function (inputElement, maxLength) {
        let value = inputElement.value;
        // Allow letters, numbers, and special characters, disallowing spaces
        value = value.replace(/[^\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '');

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }
        inputElement.value = value;
    },
    allowEmailAndNumber: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^a-zA-Z0-9@.]+/g, '');

        const atSymbolCount = (value.match(/@/g) || []).length;
        const dotCount = (value.match(/\./g) || []).length;

        if (atSymbolCount > 1) {
            const secondAtPosition = value.indexOf('@', value.indexOf('@') + 1);
            value = value.substring(0, secondAtPosition) + value.substring(secondAtPosition + 1);
        }

        if (dotCount > 3) {
            const fourthDotPosition = value.indexOf('.', value.indexOf('.', value.indexOf('.') + 1) + 1);
            value = value.substring(0, fourthDotPosition) + value.substring(fourthDotPosition + 1);
        }

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }
        inputElement.value = value;
    },

    allowOnlyTextAndampersand: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^A-Za-z0-9\s&\-,.\/]+/g, '');


        let commaCount = (value.match(/,/g) || []).length;
        if (commaCount > 5) {
            let index = value.lastIndexOf(',');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let hyphenCount = (value.match(/-/g) || []).length;
        if (hyphenCount > 4) {
            let index = value.lastIndexOf('-');
            value = value.substring(0, index) + value.substring(index + 1);
        }
        let ampersandCount = (value.match(/&/g) || []).length;
        if (ampersandCount > 3) {
            let index = value.lastIndexOf('&');
            value = value.substring(0, index) + value.substring(index + 1);
        }
        let dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 3) {
            let index = value.lastIndexOf('.');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let slashCount = (value.match(/\//g) || []).length;
        if (slashCount > 3) {
            let index = value.lastIndexOf('/');
            value = value.substring(0, index) + value.substring(index + 1);
        }
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },

    allowOnlyAddress: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^A-Za-z0-9\s,&\-\./()\\]+/g, '');

        let commaCount = (value.match(/,/g) || []).length;
        if (commaCount > 5) {
            let index = value.lastIndexOf(',');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let hyphenCount = (value.match(/-/g) || []).length;
        if (hyphenCount > 4) {
            let index = value.lastIndexOf('-');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let ampersandCount = (value.match(/&/g) || []).length;
        if (ampersandCount > 3) {
            let index = value.lastIndexOf('&');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let digitCount = (value.match(/\d/g) || []).length;
        if (digitCount > 10) {
            value = value.slice(0, -1);
        }

        let dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 3) {
            let index = value.lastIndexOf('.');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let slashCount = (value.match(/\//g) || []).length;
        if (slashCount > 3) {
            let index = value.lastIndexOf('/');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let openBracketCount = (value.match(/\(/g) || []).length;
        if (openBracketCount > 2) {
            let index = value.lastIndexOf('(');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let closeBracketCount = (value.match(/\)/g) || []).length;
        if (closeBracketCount > 2) {
            let index = value.lastIndexOf(')');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let backslashCount = (value.match(/\\/g) || []).length;
        if (backslashCount > 2) {
            let index = value.lastIndexOf('\\');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },

    allowOnlyCompanyContactNumber: function (inputElement, maxLength) {
        let value = inputElement.value;
        //if (/\s/.test(value)) {
        //    inputElement.value = value.replace(/\s/g, '');
        //    return;
        //}
        value = value.replace(/[^\d()+\-\s]/g, '');

        let openBracketCount = (value.match(/\(/g) || []).length;
        let closeBracketCount = (value.match(/\)/g) || []).length;
        let hyphenCount = (value.match(/-/g) || []).length;
        let plusCount = (value.match(/\+/g) || []).length;

        if (openBracketCount > 2) {
            let lastOpenBracketIndex = value.lastIndexOf('(');
            value = value.substring(0, lastOpenBracketIndex) + value.substring(lastOpenBracketIndex).replace(/\(/g, '');
        }

        if (closeBracketCount > 2) {
            let lastCloseBracketIndex = value.lastIndexOf(')');
            value = value.substring(0, lastCloseBracketIndex) + value.substring(lastCloseBracketIndex).replace(/\)/g, '');
        }

        if (hyphenCount > 4) {
            let lastHyphenIndex = value.lastIndexOf('-');
            value = value.substring(0, lastHyphenIndex) + value.substring(lastHyphenIndex).replace(/-/g, '');
        }

        if (plusCount > 1) {
            let lastPlusIndex = value.lastIndexOf('+');
            value = value.substring(0, lastPlusIndex) + value.substring(lastPlusIndex).replace(/\+/g, '');
        }

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },

    allowOnlyContactNumberLength: function (inputElement, maxLength) {
        let value = inputElement.value;
        if (/\s/.test(value)) {
            inputElement.value = value.replace(/\s/g, '');
            return;
        }
        value = value.replace(/[^\d()+\-\s]/g, '');

        let openBracketCount = (value.match(/\(/g) || []).length;
        let closeBracketCount = (value.match(/\)/g) || []).length;
        let hyphenCount = (value.match(/-/g) || []).length;
        let plusCount = (value.match(/\+/g) || []).length;

        if (openBracketCount > 1) {
            let lastOpenBracketIndex = value.lastIndexOf('(');
            value = value.substring(0, lastOpenBracketIndex) + value.substring(lastOpenBracketIndex).replace(/\(/g, '');
        }

        if (closeBracketCount > 1) {
            let lastCloseBracketIndex = value.lastIndexOf(')');
            value = value.substring(0, lastCloseBracketIndex) + value.substring(lastCloseBracketIndex).replace(/\)/g, '');
        }

        if (hyphenCount > 1) {
            let lastHyphenIndex = value.lastIndexOf('-');
            value = value.substring(0, lastHyphenIndex) + value.substring(lastHyphenIndex).replace(/-/g, '');
        }

        if (plusCount > 1) {
            let lastPlusIndex = value.lastIndexOf('+');
            value = value.substring(0, lastPlusIndex) + value.substring(lastPlusIndex).replace(/\+/g, '');
        }

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },

    allowGSTNumber: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^A-Za-z0-9]+/g, '');
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }
        value = value.toUpperCase();
        inputElement.value = value;
    },
    allowTextNumberAndNoSpCharater: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^A-Za-z0-9]+/g, '');
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }
        inputElement.value = value;
    },
    allowOnlyValidURL: function (inputElement, maxLength) {
        let value = inputElement.value;
        let urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

        if (!urlPattern.test(value)) {
            value = value.replace(/[^A-Za-z0-9\s,&\-.\/]+/g, '');
        }

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },

    allowGST: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^A-Za-z0-9]+/g, '');
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }
        value = value.toUpperCase();
        inputElement.value = value;
    },
    allowOnlyTextLengthwithwhitespace: function (inputElement, maxLength) {
        let value = inputElement.value;

        // Allow letters and whitespace, disallowing other characters
        value = value.replace(/[^A-Za-z\s]+/g, '');

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },
    allowAllCharacters: function (inputElement, maxLength) {
        let value = inputElement.value;

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },

    validateDepreciationValue: function (input) {
        let value = input.value;

        // Remove invalid characters (allow only digits and one decimal)
        value = value.replace(/[^0-9.]/g, '');

        // Allow only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts[1];
        }

        // Limit to 2 digits after decimal
        if (parts.length === 2) {
            parts[1] = parts[1].slice(0, 2);
            value = parts[0] + '.' + parts[1];
        }

        // Convert to float and cap at 99.99
        let numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            if (numericValue > 99.99) {
                value = '100';
            }
        }

        // Assign cleaned value back to input
        input.value = value;
    },

    validateEmailwithErrorwithParent: function (parentId, elementId) {
        var inputField = $('#' + parentId).find('#' + elementId);

        inputField.on('input', function () {
            $(this).val(function (_, value) {
                return value.replace(/\s/g, '');
            });
        });

        var inputValue = inputField.val();

        if (inputField.prop('required') && inputValue.length === 0) {
            inputField.removeClass('error');
            $('#' + elementId + '-error').remove();
            return true;
        }

        if (/^[^\s@]+@[^\s@]+(\.[^\s@]+)+$/.test(inputValue)) {
            inputField.removeClass('error');
            $('#' + elementId + '-error').remove();
        } else if (inputValue.length > 0) {
            inputField.addClass('error');
            $('#' + elementId + '-error').remove();
            inputField.after('<label id="' + elementId + '-error" class="error-message" for="' + elementId + '">Valid email is required</label>');
            return false;
        }

        return true;

    },

    allowEmailAndLength: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^A-Za-z0-9@.]+/g, '');
        if (/\s/.test(value)) {
            inputElement.value = value.replace(/\s/g, '');
            return;
        }

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        const atIndex = value.indexOf('@');
        if (atIndex !== -1) {
            const afterFirstAt = value.indexOf('@', atIndex + 1);
            if (afterFirstAt !== -1) {
                value = value.substring(0, afterFirstAt);
            }
        }

        const dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 2) {
            const lastDotIndex = value.lastIndexOf('.');
            value = value.substring(0, lastDotIndex) + value.substring(lastDotIndex + 1);
        }

        inputElement.value = value;
    },

    allowTextNumberAndSpecificSpCharater: function (inputElement, maxLength) {
        const allowedCharactersRegex = /^[&\-\/.%()0-9a-zA-Z\s]*$/;

        let value = inputElement.value;

        if (!allowedCharactersRegex.test(value)) {
            inputElement.value = value.replace(/[^&\-\/.%()0-9a-zA-Z\s]/g, '');
            return;
        }

        let countAmpersand = (value.match(/&/g) || []).length;
        let countDash = (value.match(/-/g) || []).length;
        let countSlash = (value.match(/\//g) || []).length;
        let countDot = (value.match(/\./g) || []).length;
        let countOpenParen = (value.match(/\(/g) || []).length;
        let countCloseParen = (value.match(/\)/g) || []).length;
        let countPercent = (value.match(/%/g) || []).length;

        if (countAmpersand > 2 || countDash > 2 || countSlash > 2 || countDot > 2 || countOpenParen > 1 || countCloseParen > 1 || countPercent > 2) {
            inputElement.value = value.substring(0, value.length - 1);
            return;
        }

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },

    allowOnlyTextAndUnderscore: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^A-Za-z0-9\s\-_\/]+/g, '');

        let hyphenCount = (value.match(/-/g) || []).length;
        if (hyphenCount > 2) {
            let index = value.lastIndexOf('-');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let slashCount = (value.match(/\//g) || []).length;
        if (slashCount > 2) {
            let index = value.lastIndexOf('/');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        let underscoreCount = (value.match(/_/g) || []).length;
        if (underscoreCount > 2) {
            let index = value.lastIndexOf('_');
            value = value.substring(0, index) + value.substring(index + 1);
        }

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },

    allowOnlyNumbersAndDecimal: function (inputElement, maxLength) {

        let cleanedValue = inputElement.value.replace(/[^\d.]/g, '');

        let parts = cleanedValue.split('.');

        let integerPart = parts[0].slice(0, maxLength);

        let decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : '';

        let resultValue = integerPart + decimalPart;

        inputElement.value = resultValue;
    },

    allowOnlyColor: function (inputElement, maxLength) {
        let value = inputElement.value;
        value = value.replace(/[^\d()+\-\s#a-zA-Z&]/g, '');

        let openBracketCount = (value.match(/\(/g) || []).length;
        let closeBracketCount = (value.match(/\)/g) || []).length;
        let hyphenCount = (value.match(/-/g) || []).length;
        let hashCount = (value.match(/#/g) || []).length;
        let ampersandCount = (value.match(/&/g) || []).length;

        if (ampersandCount > 2) {
            let lastAmpersandIndex = value.lastIndexOf('&');
            value = value.substring(0, lastAmpersandIndex) + value.substring(lastAmpersandIndex).replace(/&/g, '');
        }

        if (openBracketCount > 2) {
            let lastOpenBracketIndex = value.lastIndexOf('(');
            value = value.substring(0, lastOpenBracketIndex) + value.substring(lastOpenBracketIndex).replace(/\(/g, '');
        }

        if (closeBracketCount > 2) {
            let lastCloseBracketIndex = value.lastIndexOf(')');
            value = value.substring(0, lastCloseBracketIndex) + value.substring(lastCloseBracketIndex).replace(/\)/g, '');
        }

        if (hyphenCount > 4) {
            let lastHyphenIndex = value.lastIndexOf('-');
            value = value.substring(0, lastHyphenIndex) + value.substring(lastHyphenIndex).replace(/-/g, '');
        }
        if (hashCount > 5) {
            let lastHashIndex = value.lastIndexOf('#');
            value = value.substring(0, lastHashIndex) + value.substring(lastHashIndex).replace(/#/g, '');
        }
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        inputElement.value = value;
    },
    allowPFNumber: function (input) {
        let value = input.value.toUpperCase();

        // Only allow letters, numbers, and slashes
        value = value.replace(/[^A-Z0-9/]/g, '');

        const parts = value.split('/');

        let formattedValue = '';

        // 1. Region Code (2 letters)
        if (parts[0]) {
            formattedValue += parts[0].replace(/[^A-Z]/g, '').substring(0, 2);
        }

        if (formattedValue.length === 2) {
            formattedValue += '/';
        }

        // 2. Office Code (3 letters)
        if (parts[1]) {
            formattedValue += parts[1].replace(/[^A-Z]/g, '').substring(0, 3);
        }

        if (parts[1] && parts[1].length >= 3) {
            formattedValue += '/';
        }

        // 3. Establishment Code (7 digits)
        if (parts[2]) {
            formattedValue += parts[2].replace(/\D/g, '').substring(0, 7);
        }

        if (parts[2] && parts[2].length >= 7) {
            formattedValue += '/';
        }

        // 4. Extension Code (3 digits or 000)
        if (parts[3]) {
            formattedValue += parts[3].replace(/\D/g, '').substring(0, 3);
        }

        if (parts[3] && parts[3].length >= 3) {
            formattedValue += '/';
        }

        // 5. PF Member ID (7 digits)
        if (parts[4]) {
            formattedValue += parts[4].replace(/\D/g, '').substring(0, 7);
        }

        input.value = formattedValue;
    },

    allowOnlyESI: function (inputElement) {
        let value = inputElement.value.replace(/[^\d–]/g, '');

        value = value
            .replace(/^(\d{2})(\d)/, '$1–$2')
            .replace(/^(\d{2}–\d{2})(\d)/, '$1–$2')
            .replace(/^(\d{2}–\d{2}–\d{6})(\d)/, '$1–$2')
            .replace(/^(\d{2}–\d{2}–\d{6}–\d{3})(\d)/, '$1–$2')
            .slice(0, 22);

        inputElement.value = value;
    },
    getCurrentDateTime() {
        var currentDate = new Date();

        // Format the date and time as a string
        var dateString = currentDate.getFullYear() + '-' +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
            currentDate.getDate().toString().padStart(2, '0') + ' ' +
            currentDate.getHours().toString().padStart(2, '0') + ':' +
            currentDate.getMinutes().toString().padStart(2, '0') + ':' +
            currentDate.getSeconds().toString().padStart(2, '0');
        return dateString;
    },
    SetMaxDate: function (inputId) {
        var today = new Date();
        var day = ('0' + today.getDate()).slice(-2);
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var year = today.getFullYear();
        var currentDateString = year + '-' + month + '-' + day;
        $(inputId).val(currentDateString);
        $(inputId).attr('max', currentDateString);
    },

    SetMinDate: function (inputId) {
        var today = new Date();
        var day = ('0' + today.getDate()).slice(-2);
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var year = today.getFullYear();
        var currentDateString = year + '-' + month + '-' + day;
        $(inputId).val(currentDateString);
        $(inputId).attr('min', currentDateString);
    },
    CurrentDate: function () {
        var currentDate = new Date();
        var formattedCurrentDate =
            currentDate.getFullYear() + '-' +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
            currentDate.getDate().toString().padStart(2, '0');
        return formattedCurrentDate;
    },
    getDateTimeFromString: function (inputDateStr) {
        var dateReturn;
        dateReturn = moment(inputDateStr, "DD MMM YYYY").format("DD-MM-YYYY");

        return moment(dateReturn, 'DD-MM-YYYY').toDate();
    },

    removevalidation: function (formId) {
        var form = $("#" + formId);
        $("#" + formId).validate().resetForm();
        var allInputs = form.find('input, select, textarea');
        allInputs.each(function () {
            $(this).rules('remove', 'required');
            $(this).removeClass('error')
        });
        $("#" + formId)[0].reset();
    },

    removeerrormsg: function (inputId) {
        const selectedValue = $("#" + inputId).val();
        const formGroup = $("#" + inputId).closest('.form-group');

        if (selectedValue !== "") {
            formGroup.find('.error').remove();
        }
    },

    fileupload: function (file, id, type) {
        if (file != null && file.length > 0) {
            var fdata = new FormData();
            var files = file;
            fdata.append(files[0].name, files[0]);
            fdata.append("id", id);

            var progressLabel = $("#progressLabel");
            var progressBar = $("#progressBar");

            $.ajax({
                type: "POST",
                url: "/Common/fileupload",
                data: fdata,
                contentType: false,
                processData: false,
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();

                    xhr.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = (evt.loaded / evt.total) * 100;
                            progressLabel.text(percentComplete.toFixed(2) + "%");
                            progressBar.val(percentComplete);
                        }
                    }, false);

                    return xhr;
                },
                beforeSend: function () {
                    progressLabel.text("0%");
                    progressBar.val(0);
                },
                success: function (response) {

                },
                error: function (e) {

                }
            });
        }
    },

    askConfirmation: function (messageText = "Are you sure want to delete?") {
        return new Promise((resolve, reject) => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showCancelButton: true,
                confirmButtonColor: '#4bb942',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                //timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    document.getElementById('toastBackdrop').style.display = 'block';
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
                willClose: () => {
                    document.getElementById('toastBackdrop').style.display = 'none';
                }
            });

            Toast.fire({
                icon: 'error',
                animation: false,
                title: messageText
            }).then((result) => {
                if (result.isConfirmed) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },
    successMsg: function (message, title = '') {

        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 1400,
            timerProgressBar: true,
            didOpen: (toast) => {
                document.getElementById('toastBackdrop').style.display = 'block';
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
            willClose: () => {
                document.getElementById('toastBackdrop').style.display = 'none';
            }
        });

        Toast.fire({
            icon: 'success',
            animation: false,
            title: message
        });

    },
    errorMsg: function (message, title = '') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 1800,
            timerProgressBar: true,
            didOpen: (toast) => {
                document.getElementById('toastBackdrop').style.display = 'block';
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
            willClose: () => {
                document.getElementById('toastBackdrop').style.display = 'none';
            }
        });

        Toast.fire({
            icon: 'error',
            animation: false,
            title: message
        });
    },
    warningMsg: function (message, title = '') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2100,
            timerProgressBar: true,
            didOpen: (toast) => {
                document.getElementById('toastBackdrop').style.display = 'block';
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
            willClose: () => {
                document.getElementById('toastBackdrop').style.display = 'none';
            }
        });

        Toast.fire({
            icon: 'info',
            animation: false,
            title: message
        });
    },
    warning: function (message, title = '') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                document.getElementById('toastBackdrop').style.display = 'block';
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
            willClose: () => {
                document.getElementById('toastBackdrop').style.display = 'none';
            }
        });

        Toast.fire({
            icon: 'warning',
            animation: false,
            title: message
        });
    },

    PreviewPrint: function () {

        var printCSS = "@media print { body { margin: 0; } }";

        $('head').append('<style type="text/css">' + printCSS + '</style>');

        $("#PreviewPrintArea").printThis();
    },

    EditPreviewPrint: function () {

        var printCSS = "@media print { body { margin: 0; } }";

        $('head').append('<style type="text/css">' + printCSS + '</style>');

        $("#EditPrint").printThis();
    },

    autoAdjustColumns: function (table) {
        var container = table.table().container();
        if (container != null) {
            var resizeObserver = new ResizeObserver(function () {
                table.columns.adjust();
            });
            resizeObserver.observe(container);
        }
    },

    applyGridFilters: function (gridname) {
        let textFilterValue = $('#tableFilter').val().toLowerCase();
        let hasVisibleRows = false;

        let tableSelector = `#${gridname} tbody`;

        $(`${tableSelector} tr`).each(function () {
            let rowText = $(this).text().toLowerCase();
            let matchesTextFilter = textFilterValue === "" || rowText.indexOf(textFilterValue) > -1;

            $(this).toggle(matchesTextFilter);

            if (matchesTextFilter) {
                hasVisibleRows = true;
            }
        });

        let emptyRow = $(`${tableSelector} .enptyrow`);

        if (hasVisibleRows) {
            emptyRow.remove();
        } else {


            $(tableSelector).append(`
                <tr class="odd enptyrow">
                    <td valign="top" colspan="9" class="dataTables_empty">
                        <div>
                            <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found
                        </div>
                    </td>
                </tr>
            `);

        }
    },

    ProductsGetNotNull: function (mainTable, tablebody) {


        mainTable.find('#AddItemButtonRow,#subtotalRow ').remove();

        let newRowHtml = `
            <tr class="Dyntabletr">
                                                <td data-label="No">1</td>
                                                <td data-label="Item">
                                                    <label>	Sugar </label>
                                                    <textarea type="text" class="form-control mt-2 descriptiontdtext" placeholder="Description" autocomplete="no-0.31642548817076377"></textarea>
                                                </td>

                                                <td data-label="Price">
                                                    <input type="number" class="form-control" value="110.00" placeholder="Price" id="Price" fdprocessedid="2wq2v2">
                                                </td>
                                                <td data-label="QTY">
                                                    <div class="d-flex">
                                                        <div class="input-group">
                                                            <input type="text" class="form-control" value="1" placeholder="0" aria-label="Quantity input" style=" width: 0%;" id="Qtyinput" fdprocessedid="s9sinq">
                                                            <div class="input-group-append">
                                                                <span id="unitDropdownContainer" class="unit-dropdown">
                                                                    <select class="QtyUnitDropDown" fdprocessedid="ofa6ly">
                                                                        <option value="1">KG</option>
                                                                        <option value="2">BOX</option>
                                                                    </select>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span class="remaining-stock ml-2 mt-1" style="color: green;">(100)</span>
                                                    </div>
                                                </td>
                                                <td class="d-none" data-label="Discount">
                                                    <div style="display:flex;">
                                                        <span class="ProductDiscountsymbol  ProductTablesymbol">₹</span>
                                                        <input type="text" id="DisInput" class="form-control" value="2" oninput="Common.allowOnlyNumberLength(this,3)" placeholder="0" aria-label="Text input with dropdown button" fdprocessedid="071zgr">
                                                    </div>
                                                </td>
                                                <td data-label="GST">
                                                    <input type="number" class="form-control GSTs" placeholder="GST" fdprocessedid="ah08l6">
                                                </td>
                                                <td data-label="Total">
                                                    129.8
                                                </td>
                                                <td>
                                                    <button id="" class="btn DynrowRemove" type="button" fdprocessedid="fj6wspw"><i class="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>

                                            
                                            <tr class="Dyntabletr">
                                                <td data-label="No">2</td>
                                                <td data-label="Item">
                                                    <label>	Carbon Dioxide (CO2) </label>
                                                    <textarea type="text" class="form-control mt-2 descriptiontdtext" placeholder="Description" autocomplete="no-0.31642548817076377"></textarea>
                                                </td>

                                                <td data-label="Price">
                                                    <input type="number" class="form-control" value="125"  placeholder="Price" id="Price" fdprocessedid="2wq2v2">
                                                </td>
                                                <td data-label="QTY">
                                                    <div class="d-flex">
                                                        <div class="input-group">
                                                            <input type="text" class="form-control" value="1" placeholder="0" aria-label="Quantity input" style=" width: 0%;" id="Qtyinput" fdprocessedid="s9sinq">
                                                            <div class="input-group-append">
                                                                <span id="unitDropdownContainer" class="unit-dropdown">
                                                                    <select class="QtyUnitDropDown" fdprocessedid="ofa6ly">
                                                                        <option value="1">LTR</option>
                                                                        <option value="2">KG</option>
                                                                    </select>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span class="remaining-stock ml-2 mt-1" style="color: green;">(20)</span>
                                                    </div>
                                                </td>
                                                <td class="d-none" data-label="Discount">
                                                    <div style="display:flex;">
                                                        <span class="ProductDiscountsymbol  ProductTablesymbol">₹</span>
                                                        <input type="text" id="DisInput" class="form-control" value="2" oninput="Common.allowOnlyNumberLength(this,3)" placeholder="0" aria-label="Text input with dropdown button" fdprocessedid="071zgr">
                                                    </div>
                                                </td>
                                                <td data-label="GST">
                                                    <input type="number" class="form-control GSTs" value="" placeholder="GST" fdprocessedid="ah08l6">
                                                </td>
                                                <td data-label="Total">
                                                    147.5
                                                </td>
                                                <td>
                                                    <button id="" class="btn DynrowRemove" type="button" fdprocessedid="fj6wspw"><i class="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>

                                            <tr class="Dyntabletr">
                                                <td data-label="No">3</td>
                                                <td data-label="Item">
                                                    <label>	Glass Goli Soda Bottles </label>
                                                    <textarea type="text" class="form-control mt-2 descriptiontdtext" placeholder="Description" autocomplete="no-0.31642548817076377"></textarea>
                                                </td>

                                                <td data-label="Price">
                                                    <input type="number" class="form-control" value="50.00" placeholder="Price" id="Price" fdprocessedid="2wq2v2">
                                                </td>
                                                <td data-label="QTY">
                                                    <div class="d-flex">
                                                        <div class="input-group">
                                                            <input type="text" class="form-control" value="1" placeholder="0" aria-label="Quantity input" style=" width: 0%;" id="Qtyinput" fdprocessedid="s9sinq">
                                                            <div class="input-group-append">
                                                                <span id="unitDropdownContainer" class="unit-dropdown">
                                                                    <select class="QtyUnitDropDown" fdprocessedid="ofa6ly">
                                                                        <option value="1">PCS</option>
                                                                        <option value="2">BOX</option>
                                                                    </select>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span class="remaining-stock ml-2 mt-1" style="color: green;">(100)</span>
                                                    </div>
                                                </td>
                                                <td class="d-none" data-label="Discount">
                                                    <div style="display:flex;">
                                                        <span class="ProductDiscountsymbol  ProductTablesymbol">₹</span>
                                                        <input type="text" id="DisInput" class="form-control" value="2" oninput="Common.allowOnlyNumberLength(this,3)" placeholder="0" aria-label="Text input with dropdown button" fdprocessedid="071zgr">
                                                    </div>
                                                </td>
                                                <td data-label="GST">
                                                    <input type="number" class="form-control GSTs" placeholder="GST" fdprocessedid="ah08l6">
                                                </td>
                                                <td data-label="Total">
                                                    59.00
                                                </td>
                                                <td>
                                                    <button id="" class="btn DynrowRemove" type="button" fdprocessedid="fj6wspw"><i class="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>

                                            `;


        let newRow = $(newRowHtml);

        tablebody.append(newRow);

        let AddButtonRowHtml = `
            <tr id="AddItemButtonRow">
                                                <td colspan="12" class="add-item">
                                                    <div class="add-item">
                                                        <a id="AddItemBtn" class="d-flex justify-content-center">+ Add Item</a>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr id="subtotalRow" style="background-color: #e4edf5;">
                                                <td colspan="4"><div class="summary-label"><a>Sub Total</a></div></td>
                                                <td><input type="text" id="GSTtotal" class="form-control form-control-sm" placeholder="0.00"></td>
                                                <td colspan="3"><input type="text" id="Subtotal" class="form-control" placeholder="0.00" style="width: 165px;"></td>
                                            </tr>

        `;
        tablebody.append(AddButtonRowHtml);

    },

    SaleProductsGetNotNull: function (mainTable, tablebody) {


        mainTable.find('#AddItemButtonRow,#subtotalRow ').remove();

        let newRowHtml = `
            <tr class="Dyntabletr">
                                                <td data-label="No">1</td>
                                                <td data-label="Item">
                                                    <label>	500ml PET Soda (Paneer) </label>
                                                    <textarea type="text" class="form-control mt-2 descriptiontdtext" placeholder="Description" autocomplete="no-0.31642548817076377"></textarea>
                                                </td>

                                                <td data-label="Price">
                                                    <input type="number" class="form-control" value="110.00" placeholder="Price" id="Price" fdprocessedid="2wq2v2">
                                                </td>
                                                <td data-label="QTY">
                                                    <div class="d-flex">
                                                        <div class="input-group">
                                                            <input type="text" class="form-control" value="1" placeholder="0" aria-label="Quantity input" style=" width: 0%;" id="Qtyinput" fdprocessedid="s9sinq">
                                                            <div class="input-group-append">
                                                                <span id="unitDropdownContainer" class="unit-dropdown">
                                                                    <select class="QtyUnitDropDown" fdprocessedid="ofa6ly">
                                                                        <option value="1">PCS</option>
                                                                        <option value="2">BOX</option>
                                                                    </select>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span class="remaining-stock ml-2 mt-1" style="color: green;">(100)</span>
                                                    </div>
                                                </td>
                                                <td class="d-none" data-label="Discount">
                                                    <div style="display:flex;">
                                                        <span class="ProductDiscountsymbol  ProductTablesymbol">₹</span>
                                                        <input type="text" id="DisInput" class="form-control" value="2" oninput="Common.allowOnlyNumberLength(this,3)" placeholder="0" aria-label="Text input with dropdown button" fdprocessedid="071zgr">
                                                    </div>
                                                </td>
                                                <td data-label="GST">
                                                    <input type="number" class="form-control GSTs" value="18" placeholder="GST" fdprocessedid="ah08l6">
                                                </td>
                                                <td data-label="Total">
                                                    153.16
                                                </td>
                                                <td>
                                                    <button id="" class="btn DynrowRemove" type="button" fdprocessedid="fj6wspw"><i class="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>

                                            
                                            <tr class="Dyntabletr">
                                                <td data-label="No">2</td>
                                                <td data-label="Item">
                                                    <label>500ml PET Soda (Lemon) </label>
                                                    <textarea type="text" class="form-control mt-2 descriptiontdtext" placeholder="Description" autocomplete="no-0.31642548817076377"></textarea>
                                                </td>

                                                <td data-label="Price">
                                                    <input type="number" class="form-control" value="125"  placeholder="Price" id="Price" fdprocessedid="2wq2v2">
                                                </td>
                                                <td data-label="QTY">
                                                    <div class="d-flex">
                                                        <div class="input-group">
                                                            <input type="text" class="form-control" value="1" placeholder="0" aria-label="Quantity input" style=" width: 0%;" id="Qtyinput" fdprocessedid="s9sinq">
                                                            <div class="input-group-append">
                                                                <span id="unitDropdownContainer" class="unit-dropdown">
                                                                    <select class="QtyUnitDropDown" fdprocessedid="ofa6ly">
                                                                        <option value="1">LTR</option>
                                                                        <option value="2">KG</option>
                                                                    </select>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span class="remaining-stock ml-2 mt-1" style="color: green;">(20)</span>
                                                    </div>
                                                </td>
                                                <td class="d-none" data-label="Discount">
                                                    <div style="display:flex;">
                                                        <span class="ProductDiscountsymbol  ProductTablesymbol">₹</span>
                                                        <input type="text" id="DisInput" class="form-control" value="2" oninput="Common.allowOnlyNumberLength(this,3)" placeholder="0" aria-label="Text input with dropdown button" fdprocessedid="071zgr">
                                                    </div>
                                                </td>
                                                <td data-label="GST">
                                                    <input type="number" class="form-control GSTs" value="18" placeholder="GST" fdprocessedid="ah08l6">
                                                </td>
                                                <td data-label="Total">
                                                    174.05
                                                </td>
                                                <td>
                                                    <button id="" class="btn DynrowRemove" type="button" fdprocessedid="fj6wspw"><i class="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>

                                            <tr class="Dyntabletr">
                                                <td data-label="No">3</td>
                                                <td data-label="Item">
                                                    <label>BlueBerry Soda </label>
                                                    <textarea type="text" class="form-control mt-2 descriptiontdtext" placeholder="Description" autocomplete="no-0.31642548817076377"></textarea>
                                                </td>

                                                <td data-label="Price">
                                                    <input type="number" class="form-control" value="50.00" placeholder="Price" id="Price" fdprocessedid="2wq2v2">
                                                </td>
                                                <td data-label="QTY">
                                                    <div class="d-flex">
                                                        <div class="input-group">
                                                            <input type="text" class="form-control" value="1" placeholder="0" aria-label="Quantity input" style=" width: 0%;" id="Qtyinput" fdprocessedid="s9sinq">
                                                            <div class="input-group-append">
                                                                <span id="unitDropdownContainer" class="unit-dropdown">
                                                                    <select class="QtyUnitDropDown" fdprocessedid="ofa6ly">
                                                                        <option value="1">PCS</option>
                                                                        <option value="2">BOX</option>
                                                                    </select>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span class="remaining-stock ml-2 mt-1" style="color: green;">(100)</span>
                                                    </div>
                                                </td>
                                                <td class="d-none" data-label="Discount">
                                                    <div style="display:flex;">
                                                        <span class="ProductDiscountsymbol  ProductTablesymbol">₹</span>
                                                        <input type="text" id="DisInput" class="form-control" value="2" oninput="Common.allowOnlyNumberLength(this,3)" placeholder="0" aria-label="Text input with dropdown button" fdprocessedid="071zgr">
                                                    </div>
                                                </td>
                                                <td data-label="GST">
                                                    <input type="number" class="form-control GSTs" value="18" placeholder="GST" fdprocessedid="ah08l6">
                                                </td>
                                                <td data-label="Total">
                                                    69.62
                                                </td>
                                                <td>
                                                    <button id="" class="btn DynrowRemove" type="button" fdprocessedid="fj6wspw"><i class="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>

                                            `;


        let newRow = $(newRowHtml);

        tablebody.append(newRow);

        let AddButtonRowHtml = `
            <tr id="AddItemButtonRow">
                                                <td colspan="12" class="add-item">
                                                    <div class="add-item">
                                                        <a id="AddItemBtn" class="d-flex justify-content-center">+ Add Item</a>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr id="subtotalRow" style="background-color: #e4edf5;">
                                                <td colspan="4"><div class="summary-label"><a>Sub Total</a></div></td>
                                                <td><input type="text" id="GSTtotal" class="form-control form-control-sm" placeholder="0.00"></td>
                                                <td colspan="3"><input type="text" id="Subtotal" class="form-control" placeholder="0.00" style="width: 165px;"></td>
                                            </tr>

        `;
        tablebody.append(AddButtonRowHtml);
    },

    parseStringValue: function (inputId) {
        var inputValue = $('#' + inputId).val();
        return (inputValue && inputValue.trim() !== "") ? inputValue : null;
    },
    parseInputValue: function (inputId) {
        var inputValue = $('#' + inputId).val();
        if (inputValue === "") {
            return null;
        }
        return parseInt(inputValue) || null;
    },
    parseFloatInputValue: function (inputId) {
        var inputValue = $('#' + inputId).val();
        if (inputValue === "") {
            return null;
        }
        return parseFloat(inputValue) || 0;
    },

    stringToDateTime: function (date) {
        let dateStr = $('#' + date).val();
        if (!dateStr) return null;

        dateStr = dateStr.replace(/-/g, '/');

        let parts = dateStr.split('/');
        if (parts.length !== 3) return null;

        let year, month, day;

        if (parts[0].length === 4) {
            year = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1;
            day = parseInt(parts[2], 10);
        } else {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1;
            year = parseInt(parts[2], 10);
        }

        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

        let parsedDate = new Date(year, month, day);

        return parsedDate;
    },

    stringToDateTimeSendTimeAlso: function (date) {
        let dateStr = $('#' + date).val();
        if (!dateStr) return null;

        // Normalize date string
        dateStr = dateStr.replace(/-/g, '/');

        // Split date and time if time is provided
        let [datePart, timePart] = dateStr.split(' ');

        let dateParts = datePart.split('/');
        if (dateParts.length !== 3) return null;

        let year, month, day;

        // Handle format YYYY/MM/DD or DD/MM/YYYY
        if (dateParts[0].length === 4) {
            year = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            day = parseInt(dateParts[2], 10);
        } else {
            day = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            year = parseInt(dateParts[2], 10);
        }

        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

        let hours = 0, minutes = 0, seconds = 0;

        if (timePart) {
            let timeParts = timePart.split(':');
            if (timeParts.length >= 2) {
                hours = parseInt(timeParts[0], 10);
                minutes = parseInt(timeParts[1], 10);
                if (timeParts.length === 3) {
                    seconds = parseInt(timeParts[2], 10);
                }
            }
            if ([hours, minutes, seconds].some(isNaN)) return null;
        } else {
            // Use current time
            const now = new Date();
            hours = now.getHours();
            minutes = now.getMinutes();
            seconds = now.getSeconds();
        }

        let parsedDate = new Date(year, month, day, hours, minutes, seconds);
        return parsedDate;
    },

    parseYearMonthDateFormat(input) {
        var input = $('#' + input).val();
        let parts = input.includes("-") ? input.split("-") : input.split("/");

        let day = parts[0].padStart(2, "0");
        let month = parts[1].padStart(2, "0");
        let year = parts[2];

        return `${year}-${month}-${day}`;
    },
    getDateFilter: function (dateDisplay) {
        var dateText = $("#" + dateDisplay).text();

        var parts = dateText.split(" ");
        var month = parts[0];
        var year = parts[1];

        var startDate = null;
        var endDate = null;


        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthIndex = monthNames.indexOf(month);
        if (monthIndex !== -1) {

            startDate = new Date(year, monthIndex, 1);


            if (!isNaN(startDate.getTime())) {

                var currentDate = new Date();

                if (startDate.getMonth() === currentDate.getMonth() && startDate.getFullYear() === currentDate.getFullYear()) {
                    endDate = currentDate;
                } else {
                    endDate = new Date(year, monthIndex + 1, 0);
                }
            }
        }
        return {
            "startDate": startDate,
            "endDate": endDate
        }

    },

    /*==========================this for MultipleSelect========================*/
    bindDropDownMulti: function (id, moduleName) {
        var request = {
            moduleName: moduleName
        };

        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: '/Common/GetDropDown',
            data: JSON.stringify(request),
            success: function (response) {
                if (response.status === true) {
                    Common.bindDropDownMultiSuccess(response.data, id);
                } else {
                    console.error("Error: " + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Ajax error:", error);
            },
        });
    },



    bindDropDownMultiSuccess: function (response, controlid) {
        if (response != null) {
            var data = JSON.parse(response);
            var dataValue = data[0];
            if (dataValue != null && dataValue.length > 0 && !dataValue[0].hasOwnProperty('TetroONEnocount')) {
                $('#' + controlid).empty();
                var valueproperty = Object.keys(dataValue[0])[0];
                var textproperty = Object.keys(dataValue[0])[1];
                $.each(dataValue, function (index, item) {
                    $('#' + controlid).append($('<option>', {
                        value: item[valueproperty],
                        text: item[textproperty],
                    }));
                });
            } else {
                $('#' + controlid).empty();
            }
        }
    },
    /*==========================this for MultipleSelect End========================*/
    removeInvalidFeedback: function (element) {
        if ($(element).val().trim() === '') {
            $(element).addClass('is-invalid error');
        } else {
            $(element).removeClass('is-invalid error');
        }
        if ($(element).val().trim() === '') {
            $(element).next('.invalid-feedback').show();
        } else {
            $(element).next('.invalid-feedback').hide();
        }
    },

    removeMessage: function (formId) {
        var form = $("#" + formId);
        $("#" + formId).validate().resetForm();
        var allInputs = form.find('input, select, textarea');
        allInputs.each(function () {
            $(this).rules('remove', 'required');
            $(this).removeClass('error is-invalid');
            $(this).next('.invalid-feedback').hide();
        });
        $("#" + formId)[0].reset();
    },

    inputMaxDateNotAllow: function (formId) {
        var today = new Date();
        var day = today.getDate().toString().padStart(2, '0');
        var month = (today.getMonth() + 1).toString().padStart(2, '0');
        var year = today.getFullYear();

        var activatedOn = year + '-' + month + '-' + day;

        $("#" + formId).attr('max', activatedOn);
    },

    bindAttachments: function (attachments) {

        const ulElement = $('#ExistselectedFiles');
        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();
        if (attachments && attachments.length > 0) {
            attachments.forEach(file => {
                if (file.AttachmentId) {
                    $('#AddAttachment').show();
                    const truncatedFileName = file.AttachmentFileName.length > 10 ? `${file.AttachmentFileName.substring(0, 10)}...` : file.AttachmentFileName;
                    const liElement = $('<li>');
                    const downloadLink = $('<a>').addClass('download-link')
                        .attr('href', file.AttachmentFilePath)
                        .attr('download', file.AttachmentFileName)
                        .html('<i class="fas fa-download"></i>');
                    const deleteButton = $(`<a src="${file.AttachmentFilePath}" AttachmentId="${file.AttachmentId}" id="deletefile">`)
                        .addClass('delete-buttonattach').html('<i class="fas fa-trash"></i>');
                    liElement.append($('<span>').text(truncatedFileName), downloadLink, deleteButton);
                    ulElement.append(liElement);
                    $('#AddAttachLable').hide();
                }
            });
        } else {
            $('#AddAttachment').hide();
            $('#AddAttachLable').show();
        }
    },

    bindDropDownNotNull: function (masterInfoId, moduleName, id, parent) {
        return new Promise((resolve, reject) => {
            var request = {
                masterInfoId: parseInt(masterInfoId),
                moduleName: moduleName
            };
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: '/Common/GetDropDownNotNull',
                data: JSON.stringify(request),
                success: function (response) {
                    if (response.status == true) {
                        Common.bindParentDropDownSuccess(response.data, id, parent);
                        resolve();
                    } else {
                        reject("Dropdown fetch failed");
                    }
                },
                error: function (err) {
                    reject(err);
                },
            });
        });
    },    
}




