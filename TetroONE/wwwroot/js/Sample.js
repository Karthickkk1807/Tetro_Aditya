var SampleId = 0;
var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
var formDataMultiple = new FormData();
var existFiles = [];
var deletedFiles = [];
var disableChangeEvent = false;

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

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetSample", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SampleId: null }, SampleSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        if (displayedDate.getFullYear() > currentYear || (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() > currentMonth)) {
            $('#increment-month-btn2').hide();
        }

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetSample", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SampleId: null }, SampleSuccess, null);
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
    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
            Common.ajaxCall("GET", "/Productions/GetSample", { FranchiseId: FranchiseMappingId, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), SampleId: null }, SampleSuccess, null);
        }
    });


    Common.bindDropDownParent('Incharge', 'FormSample', 'StoreIncharge');
    Common.bindDropDownParent('FranchiseId', 'FormSample', 'Franchise');


    var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    Common.ajaxCall("GET", "/Productions/GetSample", { FranchiseId: FranchiseMappingId, FromDate: startDate.toISOString(), ToDate: endDate.toISOString(), SampleId: null }, SampleSuccess, null);

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        displayedDate = new Date(currentYear, currentMonth);
        $('#increment-month-btn2').show();

        updateMonthDisplay(displayedDate);

        Common.ajaxCall("GET", "/Productions/GetSample", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), SampleId: null }, SampleSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });



    $('#AddProduction').click(function () {
        $('#ProductionModal').show();

        $('#dynamicProduction').empty("");
        $('#TotalBalanceRGB').val('');


        $('#ProductionModalTitle').text('Sample Info');
        $('#SaveProduction').val('Save').removeClass('btn-update').addClass('btn-success');
        $('.table-wrapper').css('max-height', '257px');
        Common.removevalidation('FormSample');
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        $('#FranchiseId').val(FranchiseMappingId).trigger('change');
        var today = new Date();
        var todayFormatted = today.toISOString().split('T')[0];
        $('#SampleDate').val(todayFormatted);

        formDataMultiple = new FormData();

        SampleId = 0;
    });

    $('#ProductionClose').click(function () {
        $('#ProductionModal').hide();
    });

    $('#addProduction').click(function () {
        let unique = Math.random().toString(36).substring(2);
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

        Common.ajaxCall("GET", "/Productions/GetSampleProductDetails", { FranchiseId: FranchiseMappingId }, function (response) {
            var products = JSON.parse(response.data);

            if (products && products.length > 0 && products[0].length > 0) {
                var productsOptions = products[0].map(function (p) {

                    return `<option value="${p.ProductId}" data-flavour="${p.Flavour}" data-unit="${p.UnitName}">
                            ${p.ProductName}
                        </option>`;
                }).join('');
            }

            var defaultOption = '<option value="">--Select--</option>';

            var html = `
        <tr class="productionRow" data-id="" data-row="${unique}productionRow">
            <td class="d-none"><label class="ProductCategoryName"></label></td>
            <td>
                <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required>
                    ${defaultOption}${productsOptions}
                </select>
            </td>
            <td>
                <input type="text" class="form-control productFlavour" id="productFlavour${unique}" name="productFlavour${unique}" placeholder="Flavour" required disabled>
            </td>
            <td>
                <input type="text" class="form-control unit" id="unit${unique}" name="unit${unique}" placeholder="Unit" required disabled>
            </td>
            <td>
                <input type="number" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" placeholder="Qty" required oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
            </td>
            <td>
                <textarea class="form-control Comments" placeholder="Comments" id="Comments${unique}" name="Comments${unique}"></textarea>
            </td>
            <td>
                <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>`;

            $('#dynamicProduction').append(html);
            refreshProductDropdowns();
        }, null);
    });

    $(document).on('input', '.quantity', function () {
        TotalBalanceRGB();
    });
    function TotalBalanceRGB() {
        let totalQty = 0;

        $('#dynamicProduction .productionRow').each(function () {
            let qtyVal = $(this).find('.quantity').val();

            if (qtyVal && !isNaN(qtyVal)) {
                totalQty += parseFloat(qtyVal);
            }
        });


        $('#TotalBalanceRGB').val(totalQty);
    }


    $(document).on('change', '.productId', function () {
        let selectedOption = $(this).find('option:selected');
        let flavour = selectedOption.data('flavour') || "";
        let unit = selectedOption.data('unit') || "";

        let row = $(this).closest('tr');
        row.find('.productFlavour').val(flavour);
        row.find('.unit').val(unit);


        refreshProductDropdowns();


        TotalProducts();
    });

    function refreshProductDropdowns() {

        let selectedIds = [];
        $('.productId').each(function () {
            let val = $(this).val();
            if (val) selectedIds.push(val);
        });


        $('.productId').each(function () {
            let currentVal = $(this).val();

            $(this).find('option').each(function () {
                let optionVal = $(this).val();

                if (optionVal === "") return;


                if (selectedIds.includes(optionVal) && optionVal !== currentVal) {
                    $(this).prop('disabled', true).hide();
                } else {
                    $(this).prop('disabled', false).show();
                }
            });
        });
    }
    function TotalProducts() {
        let selectedCount = 0;
        $('#dynamicProduction .productionRow').each(function () {
            let productId = $(this).find('.productId').val();
            if (productId && productId !== "") {
                selectedCount++;
            }
        });

        $('#NoOfProducts').val(selectedCount);
    }
    $(document).on('click', '#dynamicProduction .DynrowRemove', function () {
        if ($('#dynamicProduction .productionRow').length > 1) {
            $(this).closest("tr").remove();
            TotalProducts();
            TotalBalanceRGB();
        }
    });



    $('#SaveProduction').click(function () {
        if ($('#FormSample').valid()) {

            var SampleDetailsStatic = {
                SampleId: SampleId == 0 ? null : SampleId,
                FranchiseId: FranchiseMappingId,
                InchargeId: parseInt($('#Incharge').val()),
                SampleDate: Common.stringToDateTimeSendTimeAlso('SampleDate'),
                NoOfProducts: parseInt($('#NoOfProducts').val()),
                NoOfQty: parseInt($('#TotalBalanceRGB').val()),

            };
            var SampleProductMappingDetails = [];
            var parentRows = $('#dynamicProduction .productionRow');

            $.each(parentRows, function (index, parentRow) {
                let $row = $(parentRow);

                let productionProductMappingId = $row.data("id") || null;
                let productId = parseInt($row.find('.productId').val()) || null;
                let quantity = parseFloat($row.find('.quantity').val()) || 0;
                let comments = $row.find('.Comments').val() || null;

                SampleProductMappingDetails.push({
                    SampleProductMappingId: productionProductMappingId,
                    SampleId: SampleId == 0 ? null : SampleId,
                    ProductId: productId,
                    Quantity: quantity,
                    Comments: comments
                });
            });


            formDataMultiple.append("SampleDetailsStatic", JSON.stringify(SampleDetailsStatic));
            formDataMultiple.append("SampleProductMappingDetails", JSON.stringify(SampleProductMappingDetails));


            $.ajax({
                type: "POST",
                url: "/Productions/InsertUpdateSample",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        Common.successMsg(response.message);
                        $('#ProductionModal').hide();
                        var text = $('#dropdownMenuButton2').text();
                        var fnData = Common.getDateFilter('dateDisplay2');
                        var fromDate;
                        var toDate;
                        if (text == "Custom") {
                            fromDate = Common.stringToDateTime('FromDate')
                            toDate = Common.stringToDateTime('ToDate')
                        } else {
                            fromDate = fnData.startDate.toISOString()
                            toDate = fnData.endDate.toISOString()
                        }
                        Common.ajaxCall("GET", "/Productions/GetSample", { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, SampleId: null }, SampleSuccess, null);


                        formDataMultiple = new FormData();
                    }
                    else {
                        Common.errorMsg(response.message);
                    }
                },
                error: function (response) {
                    Common.errorMsg(response.message);
                }
            });
        } else {

        }
    });

    $(document).on('change', '#FranchiseId', function () {
        
        if (disableChangeEvent) {
            return false;
        }
        $('#dynamicProduction').empty("");
        $('#addProduction').click();
        $('#NoOfProducts').val('');
        $('#TotalBalanceRGB').val('');

    });


    $(document).on('click', '#SampleTable .btn-delete', async function () {

        var SampleId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Productions/DeleteSampleDetails", { SampleId: parseInt(SampleId) }, function (response) {
                if (response.status) {
                    Common.successMsg(response.message);
                    $('#ProductionModal').hide();
                    var text = $('#dropdownMenuButton2').text();
                    var fnData = Common.getDateFilter('dateDisplay2');
                    var fromDate;
                    var toDate;
                    if (text == "Custom") {
                        fromDate = Common.stringToDateTime('FromDate');
                        toDate = Common.stringToDateTime('ToDate');
                    } else {
                        fromDate = fnData.startDate.toISOString()
                        toDate = fnData.endDate.toISOString()
                    }
                    Common.ajaxCall("GET", "/Productions/GetSample", { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, SampleId: null }, SampleSuccess, null);

                    formDataMultiple = new FormData();
                }
                else {
                    Common.errorMsg(response.message);
                }
            }, null);
        }
    });

});



function SampleSuccess(response) {
    if (response.status) {
        
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

        var columns = Common.bindColumn(data[1], ['SampleId']);
        Common.bindTableForNoStatus('SampleTable', data[1], columns, -1, 'SampleId', '330px', true, access);
    }
}

$(document).on('click', '#SampleTable .btn-edit', function () {
    $('#loader-pms').show();

    formDataMultiple = new FormData();

    Common.removevalidation('FormSample');
    $('#dynamicProduction').empty("");
    $('#SaveProduction').val('Update').removeClass('btn-success').addClass('btn-update');
    $('.table-wrapper').css('max-height', '152px');
    $('#ProductionModalTitle').text('Sample Info');

    var SampleId = $(this).data('id');

    Common.ajaxCall("GET", "/Productions/GetSample", { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, SampleId: parseInt(SampleId) }, EditSuccess, null);
});

async function EditSuccess(response) {
    if (!response.status) return;
    disableChangeEvent = true;

    const data = JSON.parse(response.data);

    
    SampleId = data[0][0].SampleId;
    const parts = data[0][0].SampleDate.split('-');
    const formattedProdDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    $('#SampleDate').val(formattedProdDate);
    $('#FranchiseId').val(data[0][0].FranchiseId).trigger('change');
    $('#Incharge').val(data[0][0].InchargeId).trigger('change');
    $('#NoOfProducts').val(data[0][0].NoOfProducts);
    $('#TotalBalanceRGB').val(data[0][0].NoOfQty);

   
    $('#dynamicProduction').empty();

    
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    Common.ajaxCall("GET", "/Productions/GetSampleProductDetails", { FranchiseId: FranchiseMappingId }, function (resp) {
        var products = JSON.parse(resp.data);

        if (products && products.length > 0 && products[0].length > 0) {
            var productsOptions = products[0].map(function (p) {
                return `<option value="${p.ProductId}" data-flavour="${p.Flavour}" data-unit="${p.UnitName}">
                            ${p.ProductName}
                        </option>`;
            }).join('');

            var defaultOption = '<option value="">--Select--</option>';

            
            data[1].forEach(function (prod) {
                let unique = Math.random().toString(36).substring(2);

                var html = `
                <tr class="productionRow" data-id="${prod.SampleProductMappingId}" data-row="${unique}productionRow">
                    <td class="d-none"><label class="ProductCategoryName"></label></td>
                    <td>
                        <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required>
                            ${defaultOption}${productsOptions}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control productFlavour" id="productFlavour${unique}" name="productFlavour${unique}" placeholder="Flavour" required disabled>
                    </td>
                    <td>
                        <input type="text" class="form-control unit" id="unit${unique}" name="unit${unique}" placeholder="Unit" required disabled>
                    </td>
                    <td>
                        <input type="number" class="form-control quantity" id="Quantity${unique}" name="Quantity${unique}" placeholder="Qty" required value="${prod.Quantity}" oninput="Common.allowOnlyNumbersAndDecimalInventory(this, 4)">
                    </td>
                    <td>
                        <textarea class="form-control Comments" placeholder="Comments" id="Comments${unique}" name="Comments${unique}">${prod.Comments || ''}</textarea>
                    </td>
                    <td>
                        <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>`;

                $('#dynamicProduction').append(html);

                
                let $ddl = $(`#ProductId${unique}`);
                $ddl.val(prod.ProductId).trigger('change');

               
                let selectedOption = $ddl.find(':selected');
                $(`#productFlavour${unique}`).val(selectedOption.data('flavour'));
                $(`#unit${unique}`).val(selectedOption.data('unit'));
            });
        }

    }, null);
    disableChangeEvent = false;
    $('#loader-pms').hide();
    $('#ProductionModal').show();
}



function SaveSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#ProductionModal').hide();
        var text = $('#dropdownMenuButton2').text();
        var fnData = Common.getDateFilter('dateDisplay2');
        var fromDate;
        var toDate;
        if (text == "Custom") {
            fromDate = Common.stringToDateTime('FromDate')
            toDate = Common.stringToDateTime('ToDate')
        } else {
            fromDate = fnData.startDate.toISOString()
            toDate = fnData.endDate.toISOString()
        }

        Common.ajaxCall("GET", "/Productions/GetSample", { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, ProductionId: null }, SampleSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}


$(document).on('input', '#tableForPopFilter', function () {
    applyTableFilterForProduction();
});

function applyTableFilterForProduction() {
    let filterValue = $('#tableForPopFilter').val().toLowerCase().trim();
    let visibleRowCount = 0;

    $('#dynamicProduction .AllProductEmptyRow').remove();

    $('#dynamicProduction .productionRow').each(function () {
        let $row = $(this);
        let ProductText = $row.find('select.productId option:selected').text().toLowerCase();

        let isVisible = ProductText.includes(filterValue);
        $row.toggle(isVisible);

        // Toggle the related QC rows (until the next productionRow)
        let $relatedQCRows = $row.nextUntil('.productionRow', '.ProductionQCMappingRow');
        $relatedQCRows.toggle(isVisible);

        if (isVisible) {
            visibleRowCount++;
        }
    });

    if (visibleRowCount === 0) {
        $('#dynamicProduction').append(`
            <tr class="AllProductEmptyRow">
                <td colspan="9" class="text-center text-danger">No matching products found.</td>
            </tr>
        `);
    }
}

