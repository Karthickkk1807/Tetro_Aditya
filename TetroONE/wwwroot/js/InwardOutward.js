var distributorId = 0;
var inWardOutWardId = 0;
var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
var criteriaType = [];
var isPrint = false;

$(document).ready(function () {

    $('#DivPurchaseOrderHide').hide();
    $('#DivPoDateHide').hide();
    $('#FormInOutStactic').css('margin-top', '-6px');

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
        Common.ajaxCall("GET", "/Productions/GetInWardOutWard", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), InWardOutWardDate: null, DistributorId: null }, InWardOutWardSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        if (displayedDate.getFullYear() > currentYear || (displayedDate.getFullYear() === currentYear && displayedDate.getMonth() > currentMonth)) {
            $('#increment-month-btn2').hide();
        }

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetInWardOutWard", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), InWardOutWardDate: null, DistributorId: null }, InWardOutWardSuccess, null);
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
            Common.ajaxCall("GET", "/Productions/GetInWardOutWard", { FranchiseId: FranchiseMappingId, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTime('ToDate').toISOString(), InWardOutWardDate: null, DistributorId: null }, InWardOutWardSuccess, null);
        }
    });

    Common.bindDropDownParent('ToFranchiseId', 'FormInOutStactic', 'Franchise');


    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetInWardOutWard", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), InWardOutWardDate: null, DistributorId: null }, InWardOutWardSuccess, null);

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        displayedDate = new Date(currentYear, currentMonth);
        $('#increment-month-btn2').show();

        updateMonthDisplay(displayedDate);
        Common.ajaxCall("GET", "/Productions/GetInWardOutWard", { FranchiseId: FranchiseMappingId, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString(), InWardOutWardDate: null, DistributorId: null }, InWardOutWardSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
    });

    $('#SaveInWard').click(function () {
        var staticForm = $('#FormInOutStactic').valid();
        var InWardForm = $('#FormInWard').valid();
        if (staticForm && InWardForm) {
            var objvalue = {};

            var FranchiseMapping = parseInt(localStorage.getItem('FranchiseId'));
            objvalue.InWardOutWardId = inWardOutWardId == 0 ? null : inWardOutWardId;
            objvalue.InWardOutWardDate = Common.stringToDateTime('InWardOutWardDate');
            objvalue.InWardOutWardType = "1";
            objvalue.FromFranchiseId = FranchiseMapping;
            objvalue.ToFranchiseId = Common.parseInputValue('ToFranchiseId');
            objvalue.DistributorId = Common.parseInputValue('DistributorId');
            objvalue.PurchaseOrderId = Common.parseInputValue('PurchaseOrderId') || null;

            var inWardProductMapping = [];
            var outWardProductMapping = [];

            var parentRows = $('#dynamicOutWard .InWardOutWardrow');
            $.each(parentRows, function (index, parentRow) {
                var outWardProductMappingId = $(this).attr('data-id') || null;
                var productId = $(parentRow).find('.productId').val() || null;
                var productFlavourId = $(parentRow).find('.productFlavourId').val() || null;
                var outWardQty = $(parentRow).find('.outwardQty').val() || null;
                var POQty = $(parentRow).find('.POQty').val() || null;

                outWardProductMapping.push({
                    OutWardProductMappingId: outWardProductMappingId == "" ? null : outWardProductMappingId,
                    ProductId: productId,
                    ProductFlavourId: productFlavourId,
                    POQty: POQty,
                    OutWardQty: outWardQty,
                    InWardOutWardId: inWardOutWardId == 0 ? null : inWardOutWardId,
                });
            });


            var parentRows = $('#dynamicInWard .InWardOutWardrow');
            $.each(parentRows, function (index, parentRow) {
                var indexVal = index + 1;
                var inWardProductMappingId = $(this).attr('data-id') || null;
                var productId = $(parentRow).find('.productId').val() || null;
                var inWardQty = $(parentRow).find('.inwardQty').val() || null;
                var refundQty = $(parentRow).find('.refundQty').val() || null;
                var sortingQty_Others = $(parentRow).find('.SortingQty_Others').val() || null;
                var sortingQty_Damage = $(parentRow).find('.SortingQty_Damage').val() || null;
                var sortingQty_OtherBottles = $(parentRow).find('.SortingQty_OtherBottles').val() || null;
                var finalInWardQty = $(parentRow).find('.finalInwardQty').val() || null;


                inWardProductMapping.push({
                    InWardProductMappingId: inWardProductMappingId == "" ? null : inWardProductMappingId,
                    ProductId: productId,
                    InWardQty: parseInt(inWardQty),
                    RefundQty: parseInt(refundQty) || null,
                    SortingQty_Others: sortingQty_Others,
                    SortingQty_Damage: sortingQty_Damage,
                    SortingQty_OtherBottles: sortingQty_OtherBottles,
                    FinalInWardQty: parseInt(finalInWardQty),
                    InWardOutWardId: inWardOutWardId == 0 ? null : inWardOutWardId,
                    RowNumber: indexVal
                });


            });

            objvalue.inWardProductMapping = inWardProductMapping;
            objvalue.outWardProductMapping = outWardProductMapping;
            Common.ajaxCall("POST", "/Productions/InsertUpdateInWardOutWardDetails", JSON.stringify(objvalue), SaveSuccess, null);
        }
    });

    function refreshInOutwardList() {
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var text = $('#dropdownMenuButton2').text();
        var fnData = Common.getDateFilter('dateDisplay2');
        var fromDate, toDate;
        if (text == "Custom") {
            fromDate = Common.stringToDateTime('FromDate');
            toDate = Common.stringToDateTime('ToDate');
        } else {
            fromDate = fnData.startDate.toISOString();
            toDate = fnData.endDate.toISOString();
        }

        Common.ajaxCall("GET", "/Productions/GetInWardOutWard", {
            FranchiseId: FranchiseMappingId,
            FromDate: fromDate,
            ToDate: toDate,
            InWardOutWardDate: null,
            DistributorId: null
        }, InWardOutWardSuccess, null);
    }

    $('#SaveOutWard').click(function () {
        saveOutWardData(false);
    });

    $('#PrintSaveOutWard').click(function () {
        saveOutWardData(true);
    });
    function saveOutWardData(isPrint) {
        var staticForm = $('#FormInOutStactic').valid();
        var InWardForm = $('#FormOutWard').valid();
        if (staticForm && InWardForm) {
            var objvalue = {};

            var FranchiseMapping = parseInt(localStorage.getItem('FranchiseId'));
            objvalue.InWardOutWardId = inWardOutWardId == 0 ? null : inWardOutWardId;
            objvalue.InWardOutWardDate = Common.stringToDateTime('InWardOutWardDate');
            objvalue.InWardOutWardType = "2";
            objvalue.FromFranchiseId = FranchiseMapping;
            objvalue.ToFranchiseId = Common.parseInputValue('ToFranchiseId');
            objvalue.DistributorId = Common.parseInputValue('DistributorId');
            objvalue.PurchaseOrderId = Common.parseInputValue('PurchaseOrderId');

            var inWardProductMapping = [];

            var outWardProductMapping = [];

            var parentRows = $('#dynamicOutWard .InWardOutWardrow');
            $.each(parentRows, function (index, parentRow) {
                var outWardProductMappingId = $(this).attr('data-id') || null;
                var productId = $(parentRow).find('.productId').val() || null;
                var productFlavourId = $(parentRow).find('.productFlavourId').val() || null;
                var outWardQty = $(parentRow).find('.outwardQty').val() || null;
                var POQty = $(parentRow).find('.POQty').val() || null;

                outWardProductMapping.push({
                    OutWardProductMappingId: parseInt(outWardProductMappingId) == "" ? null : parseInt(outWardProductMappingId),
                    ProductId: parseInt(productId) || 0,
                    ProductFlavourId: parseInt(productFlavourId) || 0,
                    POQty: parseInt(POQty),
                    OutWardQty: parseFloat(outWardQty),
                    InWardOutWardId: parseInt(inWardOutWardId) == 0 ? null : parseInt(inWardOutWardId),
                });
            });


            var parentRows = $('#dynamicInWard .InWardOutWardrow');
            $.each(parentRows, function (index, parentRow) {
                var indexVal = index + 1;
                var inWardProductMappingId = $(this).attr('data-id');
                var productId = $(parentRow).find('.productId').val() || null;
                var inWardQty = $(parentRow).find('.inwardQty').val() || null;
                var refundQty = $(parentRow).find('.refundQty').val() || null;
                var sortingQty_Others = $(parentRow).find('.SortingQty_Others').val() || null;
                var sortingQty_Damage = $(parentRow).find('.SortingQty_Damage').val() || null;
                var sortingQty_OtherBottles = $(parentRow).find('.SortingQty_OtherBottles').val() || null;
                var finalInWardQty = $(parentRow).find('.finalInwardQty').val() || null;

                inWardProductMapping.push({
                    InWardProductMappingId: parseInt(inWardProductMappingId) == "" ? null : parseInt(inWardProductMappingId),
                    ProductId: parseInt(productId),
                    InWardQty: parseFloat(inWardQty) || null,
                    RefundQty: parseFloat(refundQty) || null,
                    SortingQty_Others: parseFloat(sortingQty_Others),
                    SortingQty_Damage: parseFloat(sortingQty_Damage),
                    SortingQty_OtherBottles: parseFloat(sortingQty_OtherBottles),
                    FinalInWardQty: parseFloat(finalInWardQty) || null,
                    InWardOutWardId: parseInt(inWardOutWardId),
                    RowNumber: parseInt(indexVal)
                });

            });

            objvalue.inWardProductMapping = inWardProductMapping;

            objvalue.outWardProductMapping = outWardProductMapping;

            Common.ajaxCall("POST", "/Productions/InsertUpdateInWardOutWardDetails", JSON.stringify(objvalue), function (response) {
                $('#loader-pms').show();
                if (response.status) {
                    if (isPrint) {
                        var data = JSON.parse(response.data);
                        var saleId = (data && data[0] && data[0][0] && typeof data[0][0].SaleId !== 'undefined') ? (data[0][0].SaleId || 0) : 0;
                        var printType = "Print";
                        var EditDataId = {
                            ModuleId: parseInt(saleId),
                            ContactId: parseInt($("#DistributorId").val()),
                            NoOfCopies: 1,
                            printType: printType,
                            FranchiseId: parseInt($("#ToFranchiseId").val())
                        };

                        $.ajax({
                            url: '/Sale/TaxInvoicePrint',
                            method: 'GET',
                            data: EditDataId,
                            xhrFields: { responseType: 'blob' },
                            success: function (response) {
                                $('#loader-pms').hide();
                                var blob = new Blob([response], { type: 'application/pdf' });
                                var blobUrl = URL.createObjectURL(blob);

                                if (printType === "Preview") {
                                    var newTab = window.open();
                                    if (newTab) {
                                        newTab.document.write(`
                                        <html>
                                        <head><title>Purchase Invoice Preview</title></head>
                                        <body style="margin:0;">
                                            <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%" />
                                        </body>
                                        </html>
                                    `);
                                        newTab.document.close();
                                    }
                                } else if (printType === "Download") {
                                    var link = document.createElement('a');
                                    link.href = blobUrl;
                                    link.download = 'Purchase Invoice.pdf';
                                    link.click();
                                } else if (printType === "Print") {
                                    var iframe = document.createElement('iframe');
                                    iframe.style.display = 'none';
                                    iframe.src = blobUrl;
                                    document.body.appendChild(iframe);
                                    iframe.onload = function () {
                                        iframe.contentWindow.print();
                                    };
                                }

                                Common.successMsg("Save & Print Successfully.");
                                $('#InWardOutWardModal').hide();
                                refreshInOutwardList();
                            },
                            error: function () {
                                $('#loader-pms').hide();
                                Common.errorMsg(response.message);
                            }
                        });

                    } else {
                        $('#loader-pms').hide();
                        Common.successMsg(response.message);
                        $('#InWardOutWardModal').hide();
                        refreshInOutwardList();
                    }
                } else {
                    Common.errorMsg(response.message);
                }
            }, null);
        }
    }

    $('#AddInWardOutWard').click(function () {
        $('#InWardOutWardModal').show();
        $('#dynamicInWard').empty("");
        $('#dynamicOutWard').empty("");
        $('#DivPurchaseOrderHide').hide();
        $('#DivPoDateHide').hide();
        $('#FormInOutStactic').css('margin-top', '-6px');
        $('.table-wrapper').css('max-height', '227.5px');
        //$('#addDynInWard').click();
        //$('#addDynOutWard').click();
        Common.removevalidation('FormInOutStactic');
        Common.removevalidation('FormInWard');
        Common.removevalidation('FormOutWard');
        $('#editCounterbox').hide();
        $('#InWard-Tab').show();
        $('#OutWard-Tab').hide();
        $('#InWardOuttilteModal').text("Add InWardOutWard");
        $('#SaveInWard').show();
        $('#SaveOutWard').hide();
        $('#PrintSaveOutWard').hide();
        $('#SaveInWard,#SaveOutWard').val('Save').addClass('btn-success').removeClass('btn-update');
        $('#PrintSaveOutWard').val('Save/Print');
        distributorId = 0; inWardOutWardId = 0;
        $('#editCounterbox').hide();
        //$('#DistributorId').prop('disabled', true);
        $('.hideColumn').css('display', 'none');
        $('#myTabInOut #OutWard-TabBtn').removeClass('active');
        $('#myTabInOut #InWard-TabBtn').addClass('active');
        $('#addDynInWardLiTag').show();
        $('#addDynOutWardLiTage').hide();
        $('#DistributorId').empty().append('<option value="">-- Select --</option>');
        $('#PurchaseOrderId').empty().append('<option value="">-- Select --</option>');
        $('#ToFranchiseId').val(FranchiseMappingId).trigger('change');
        var today = new Date();
        var todayFormatted = today.toISOString().split('T')[0];
        $('#InWardOutWardDate').val(todayFormatted);
        //$('#InWardOutWardDate').attr('min', todayFormatted).val(todayFormatted);
        calculateInwardTotals();
    });

    $('#InWardOutWardClose').click(function () {
        $('#InWardOutWardModal').hide();
    });

    $('#myTabInOut #InWard-TabBtn').click(function () {
        $('#InWard-Tab').show();
        $('#OutWard-Tab').hide();
        $('#SaveInWard').show();
        $('#SaveOutWard').hide();
        $('#PrintSaveOutWard').hide();
        calculateInwardTotals();
        $('#DivPurchaseOrderHide').hide();
        $('#DivPoDateHide').hide();
        $('#addDynInWardLiTag').show();
        $('#addDynOutWardLiTage').hide();
    });

    $('#myTabInOut #OutWard-TabBtn').click(function () {
        $('#OutWard-Tab').show();
        $('#InWard-Tab').hide();
        $('#SaveInWard').hide();
        $('#SaveOutWard').show();
        $('#PrintSaveOutWard').show();
        calculateOutwardTotals();
        $('#DivPurchaseOrderHide').show();
        $('#DivPoDateHide').show();
        $('#addDynInWardLiTag').hide();
        $('#addDynOutWardLiTage').show();
    });

    $(document).on('change', '#ToFranchiseId', function () {
        //$('#dynamicInWard').empty("");
        //$('#dynamicOutWard').empty("");
        if (!inWardOutWardId) {
            $('#addDynInWard').click();
            $('#addDynOutWard').click();

            $('#DistributorId').prop('disabled', false);
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('ToFranchiseId'), ModuleName: 'FranchiseDistributor' }, function (response) {
                Common.bindDropDownSuccess(response.data, 'DistributorId');
            });
        }
       
        
        //if ($('#ToFranchiseId').val() != "" && $('#DistributorId').val() != "") {
        //    Common.ajaxCall("GET", "/Inventory/GetOutWardPo", { FranchiseId: Common.parseInputValue('ToFranchiseId'), DistributorId: Common.parseInputValue('DistributorId') }, function (response) {
        //        Common.bindDropDownSuccess(response.data, 'PurchaseOrderId');
        //    });
        //}
    });
    $(document).on('change', '#DistributorId', function () {
        if ($('#ToFranchiseId').val() != "" && $('#DistributorId').val() != "") {
            Common.ajaxCall("GET", "/Inventory/GetOutWardPo", { FranchiseId: Common.parseInputValue('ToFranchiseId'), DistributorId: Common.parseInputValue('DistributorId') }, function (response) {
                Common.bindDropDownSuccess(response.data, 'PurchaseOrderId');
            });
        }
    });

    $(document).on('input', '.outwardQty,.POQty', function () {
        const row = $(this).closest('tr');
        var POQTY = parseInt(row.find('.POQty').val());
        DiffrentQty(row, POQTY);
        if ($('#OutWard-TabBtn').hasClass('active')) {
            calculateOutwardTotals();
        }
    });


    $(document).on('change', '#PurchaseOrderId', function () {
        $('#loader-pms').show();
        if ($('#PurchaseOrderId').val() != "") {
            var products = [];

            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", {
                MasterInfoId: Common.parseInputValue('ToFranchiseId'),
                ModuleName: 'FranchiseProduct'
            }, function (productResponse) {

                products = JSON.parse(productResponse.data);

                Common.ajaxCall("GET", "/Inventory/GetOutWardPoOutWard", {
                    PurchaseOrderId: Common.parseInputValue('PurchaseOrderId')
                }, function (response) {

                    var data = JSON.parse(response.data);

                    // Set PO date
                    let rawDate = data[0][0].PurchaseOrderDate_DBT;
                    let parts = rawDate.split('-');
                    let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    $('#PoDate').val(formattedDate);

                    // Clear existing rows
                    $('#dynamicOutWard').empty();

                    let items = data[1];
                    let totalItems = items.length;

                    if (totalItems === 0) {
                        $('#loader-pms').hide();
                        return;
                    }

                    // Create an array of promises
                    let promises = items.map((item, index) => {
                        return new Promise((resolve) => {
                            let unique = Math.random().toString(36).substring(2);

                            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", {
                                MasterInfoId: item.ProductId_DBT,
                                ModuleName: 'ProductFlavour'
                            }, function (flavourResponse) {

                                let flavourOptions = "";
                                if (flavourResponse.data != null && flavourResponse.data.length > 0) {
                                    var flavourdata = JSON.parse(flavourResponse.data);
                                    flavourOptions = flavourdata[0].map(function (flavourVal) {
                                        var isSelected = flavourVal.ProductFlavourId == item.ProductFlavourId ? 'selected' : '';
                                        return `<option value="${flavourVal.ProductFlavourId}" ${isSelected}>${flavourVal.ProductFlavourName}</option>`;
                                    }).join('');
                                }

                                let productsOptions = "";
                                if (products != null && products.length > 0 && products[0].length > 0) {
                                    productsOptions = products[0].map(function (productsVal) {
                                        var isSelected = productsVal.ProductId == item.ProductId_DBT ? 'selected' : '';
                                        return `<option value="${productsVal.ProductId}" ${isSelected}>${productsVal.ProductName}</option>`;
                                    }).join('');
                                }

                                var defaultOption = '<option value="">--Select--</option>';

                                var html = `<tr class="InWardOutWardrow" data-id="">
                                    <td class="type-cell" data-label="Type" style="text-align: center;vertical-align: baseline;">${item.Type}</td>
                                    <td>
                                        <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required disabled>
                                            ${defaultOption}${productsOptions}
                                        </select>
                                    </td>
                                    <td>
                                        <select class="form-control productFlavourId" id="ProductFlavourId${unique}" name="ProductFlavourId${unique}" required disabled>
                                            ${defaultOption}${flavourOptions}
                                        </select>
                                    </td>
                                    <td class="POQty-cell">
                                        <input type="text" id="POQty${unique}" name="POQty${unique}" class="form-control POQty" placeholder="PO Qty" value="${item.POQty || item.Quantity}" disabled>
                                    </td>
                                    <td>
                                        <input type="text" id="OutwardQty${unique}" name="OutwardQty${unique}" class="form-control outwardQty" placeholder="OutWard Qty" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 5)" required>
                                    </td>
                                    <td class="DifferenceCell" data-label="Total"></td>
                                    <td class="d-flex justify-content-center">
                                        <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height:34px;width:34px;">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>`;

                                resolve({ html: html, item: item });
                            });
                        });
                    });

                    // Wait for all AJAX calls to finish, then render rows in order
                    Promise.all(promises).then(results => {
                        results.forEach(result => {
                            let $newRow = $(result.html);
                            $('#dynamicOutWard').append($newRow);
                            DiffrentQty($newRow, result.item.POQty);
                        });
                        $('#loader-pms').hide();
                    });
                });
            });

            $('.POQty-cell,.DifferenceCell,#POQTYHEAD,#DIFFQTYHEAD').show();
        } else {
            $('#addDynOutWardLiTage').show();
            $('.POQty-cell,.DifferenceCell,#POQTYHEAD,#DIFFQTYHEAD').hide();
            $('#loader-pms').hide();
        }
    });

    $('#addDynInWard').click(function () {
        let rows = $("#dynamicInWard .InWardOutWardrow");
        let unique = Math.random().toString(36).substring(2);
        var products = [];
        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('ToFranchiseId'), ModuleName: 'InWardProduct' }, function (response) {
            products = JSON.parse(response.data);
            if (products != null && products.length > 0 && products[0].length > 0) {
                var productsOptions = products[0].map(function (productsVal) {
                    return `<option value="${productsVal.ProductId}">${productsVal.ProductName}</option>`;
                }).join('');
            }

            var defaultOption = '<option value="">--Select--</option>';

            var html = `<tr class="InWardOutWardrow" data-id="">
                                                    <td>
                                                  <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required>
                                                            ${defaultOption}${productsOptions}
                                                   </select>
                                                    </td>
                                                    <td><input type="text" id="InwardQty${unique}" name="InwardQty${unique}" class="form-control inwardQty" placeholder="InWard Qty" required oninput="Common.allowOnlyNumberLength(this, 10)"></td>
                                                    <td><input type="text" id="RefundQty${unique}" name="RefundQty${unique}" class="form-control refundQty" placeholder="Refund Qty" oninput="Common.allowOnlyNumberLength(this, 10)"></td>
                                                  
                                                    <td><input type="text" id="FinalInwardQty${unique}" name="FinalInwardQty${unique}" class="form-control finalInwardQty" placeholder="Final Inward Qty" disabled></td>
                                                    <td class="d-flex justify-content-center">
                                                        <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height:34px;width:34px;">
                                                            <i class="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>`;

            $('#dynamicInWard').append(html);
            $('#SortingReason' + unique).each(function () {
                $(this).select2({
                    theme: 'bootstrap4',
                    width: 'style',
                    placeholder: $(this).attr('placeholder'),
                    allowClear: Boolean($(this).data('allow-clear')),
                });
            });
            calculateInwardTotals();
        }, null);

    });

    $(document).on('click', '#dynamicInWard .DynrowRemove', function () {
        let rows = $("#dynamicInWard .InWardOutWardrow");
        if (rows.length > 1) {
            $(this).closest('.InWardOutWardrow').remove();
        }
        calculateInwardTotals();
    });


    $('#addDynOutWard').click(function () {
        var products = [];
        let rows = $("#dynamicOutWard .InWardOutWardrow");
        var pxl = rows.length >= 1 ? '0px' : '21px';
        let unique = Math.random().toString(36).substring(2);
        Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('ToFranchiseId'), ModuleName: 'FranchiseProduct' }, function (response) {
            products = JSON.parse(response.data);
            if (products != null && products.length > 0 && products[0].length > 0) {
                var productsOptions = products[0].map(function (productsVal) {
                    return `<option value="${productsVal.ProductId}">${productsVal.ProductName}</option>`;
                }).join('');
            }
            var defaultOption = '<option value="">--Select--</option>';

            var html = `<tr class="InWardOutWardrow"  data-id="">
             <td class="type-cell" data-label="Type" Style="text-align: center;vertical-align: baseline;">RGB</td>

                                                    <td>
                                                 <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required>
                                                   ${defaultOption}${productsOptions}
                                                   </select>
                                                    </td>
                                                    <td>
                                                        <select class="form-control productFlavourId" id="ProductFlavourId${unique}" name="ProductFlavourId${unique}" required disabled>
                                                         ${defaultOption}
                                                        </select>
                                                    </td>
                                                    <td class="POQty-cell"><input type="text" id="POQty${unique}" name="POQty${unique}" class="form-control POQty" placeholder="PO Qty"></td>

                                                    <td><input type="text" id="OutwardQty${unique}" name="OutwardQty${unique}" class="form-control outwardQty" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 5)" placeholder="OutWard Qty" required></td>
                                                                   <td class="DifferenceCell" data-label="Total"></td>
              

                                                    <td class="d-flex justify-content-center">
                                                        <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height:34px;width:34px;">
                                                            <i class="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>`;

            $('#dynamicOutWard').append(html);

            if ($('#PurchaseOrderId').val() == "") {
                $('.POQty-cell,.DifferenceCell,#POQTYHEAD,#DIFFQTYHEAD').hide();
            } else {
                $('.POQty-cell,.DifferenceCell,#POQTYHEAD,#DIFFQTYHEAD').show();
            }
        });

    });

    $(document).on('click', '#dynamicOutWard .DynrowRemove', function () {
        let rows = $("#dynamicOutWard .InWardOutWardrow");
        if (rows.length > 1) {
            $(this).closest('.InWardOutWardrow').remove();
        }
        calculateOutwardTotals();
    });


    $("#FormInWard").validate({
        errorPlacement: function (error, element) {
            if (element.hasClass("select2-hidden-accessible")) {
                error.insertAfter(element.next(".select2-container"));
            } else {
                error.insertAfter(element);
            }
        },
        rules: {
            "insCategoryId[]": {
                required: true
            }
        },
        messages: {
            "insCategoryId[]": {
                required: "This field is required."
            }
        }
    });

    $.validator.addMethod("requiredSelect", function (value, element, arg) {
        return $(element).val() != null && $(element).val().length > 0;
    }, "This field is required.");



    $(document).on('click', '#InWardOutWardTable .btn-edit', function () {
        $('#dynamicInWard').empty("");
        $('#dynamicOutWard').empty("");
        Common.removevalidation('FormInOutStactic');
        Common.removevalidation('FormInWard');
        Common.removevalidation('FormOutWard');
        $('#editCounterbox').hide();
        $('#InWard-Tab').show();
        $('#OutWard-Tab').hide();
        $('#InWardOuttilteModal').text("InWardOutWard Info");
        $('#SaveInWard').show();
        $('#SaveOutWard').hide();
        $('#PrintSaveOutWard').hide();
        $('#SaveInWard,#SaveOutWard').val('Update').addClass('btn-update').removeClass('btn-success');
        $('#PrintSaveOutWard').val('Update/Print');
        $('#myTabInOut #OutWard-TabBtn,#myTabInOut #InWard-TabBtn').removeClass('active');
        $('#FormInOutStactic').css('margin-top', '-17px');
        $('.table-wrapper').css('max-height', '167.5px');
        $('#myTabInOut #InWard-TabBtn').addClass('active');
        $('#editCounterbox').show();
        $('#OutWard-TabBtn').removeClass('active');
        $('#myTabInOut #InWard-TabBtn').addClass('active');
        $('#DivPurchaseOrderHide').hide();
        $('#addDynInWardLiTag').show();
        $('#addDynOutWardLiTage').show();
        $('#DivPoDateHide').hide();
        distributorId = $(this).data('id');
        hiddenColumnValue = $(this).closest("tr").find("td:eq(0)").text().trim();

        var dateText = $(this).closest("tr").find("td:first").text().trim();

        var parts = dateText.split("-");
        var formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        $('#loader-pms').show();

        Common.ajaxCall("GET", "/Productions/GetInWardOutWard", { FranchiseId: FranchiseMappingId, FromDate: null, ToDate: null, InWardOutWardDate: formattedDate.toDateString(), DistributorId: distributorId }, EditInWardOutWardSuccess, null);
    });

    $(document).on('click', '#InWardOutWardTable .btn-delete', async function () {
        //var dateText = $(this).closest("tr").find("td:first").text().trim();
        //
        //var parts = dateText.split("-");
        //var formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        var InWardOutWardId = $(this).data('inwardoutwardid');
        var response = await Common.askConfirmation();
        if (response == true) {
            var distributorId = $(this).data('id');
            Common.ajaxCall("GET", "/Productions/DeleteInWardOutWard", { InWardOutWardId: parseInt(InWardOutWardId), DistributorId: distributorId }, SaveSuccess, null);
        }
    });

    $(document).on('change', '#dynamicInWard .productId', function () {
        var productId = $(this).val();
        var $row = $(this).closest('tr');
        var $flavourDropdown = $row.find('.productFlavourId');
        var thisSelectElement = $(this);
        $('#dynamicInWard select.productId').each(function (index, value) {
            var existVal = $(value).val();
            if (existVal == productId && value !== thisSelectElement[0] && existVal != null) {
                thisSelectElement.val("");
                $(thisSelectElement).val($('option:contains("--Select--")').val()).trigger('change');
                productId = "";
                return false;
            }
        });
        if (productId != "") {
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(productId), ModuleName: 'ProductFlavour' }, function (response) {
                if (response != null) {
                    $flavourDropdown.empty().prop('disabled', false);
                    var data = JSON.parse(response.data);
                    $flavourDropdown.empty();
                    var dataValue = data[0];
                    if (dataValue != null && dataValue.length > 0) {
                        var valueproperty = Object.keys(dataValue[0])[0];
                        var textproperty = Object.keys(dataValue[0])[1];
                        $flavourDropdown.append($('<option>', {
                            value: '',
                            text: '--Select--',
                        }));
                        $.each(dataValue, function (index, item) {
                            $flavourDropdown.append($('<option>', {
                                value: item[valueproperty],
                                text: item[textproperty],
                            }));
                        });
                    } else {
                        $flavourDropdown.append($('<option>', {
                            value: '',
                            text: '--Select--',
                        }));
                    }
                }
            });
        }
    });

    $(document).on('input', '#dynamicInWard .inwardQty,.refundQty,.sortingQty', function () {
        var $row = $(this).closest('tr');
        var inwardQty = parseFloat($row.find('.inwardQty').val()) || 0;
        var refundQty = parseFloat($row.find('.refundQty').val()) || 0;
        var sortingQty = parseFloat($row.find('.sortingQty').val()) || 0;

        var finalInwardQty = inwardQty - (sortingQty + refundQty);
        $row.find('.finalInwardQty').val(finalInwardQty);

        calculateInwardTotals();
    });

    $(document).on('change', '#dynamicOutWard .productId', function () {
        var productId = $(this).val();
        var $row = $(this).closest('tr');
        var $flavourDropdown = $row.find('.productFlavourId');
        var thisSelectElement = $(this);
        $('#dynamicOutWard select.productId').each(function (index, value) {
            var existVal = $(value).val();
            if (existVal == productId && value !== thisSelectElement[0] && existVal != null) {
                thisSelectElement.val("");
                $(thisSelectElement).val($('option:contains("--Select--")').val()).trigger('change');
                productId = "";
                return false;
            }
        });
        if (productId != "") {
            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(productId), ModuleName: 'ProductFlavour' }, function (response) {
                if (response != null) {
                    $flavourDropdown.empty().prop('disabled', false);
                    var data = JSON.parse(response.data);
                    $flavourDropdown.empty();
                    var dataValue = data[0];
                    if (dataValue != null && dataValue.length > 0) {
                        var valueproperty = Object.keys(dataValue[0])[0];
                        var textproperty = Object.keys(dataValue[0])[1];
                        $flavourDropdown.append($('<option>', {
                            value: '',
                            text: '--Select--',
                        }));
                        $.each(dataValue, function (index, item) {
                            $flavourDropdown.append($('<option>', {
                                value: item[valueproperty],
                                text: item[textproperty],
                            }));
                        });
                    } else {
                        $flavourDropdown.append($('<option>', {
                            value: '',
                            text: '--Select--',
                        }));
                    }
                }
            });
        }
    });


});

function DiffrentQty(row, finalQTY) {
    var OutwardQty = parseFloat(row.find('.outwardQty').val()) || 0;
    var remainingQty = OutwardQty - finalQTY;

    var $cell = row.find('.DifferenceCell');
    $cell.text(remainingQty.toFixed(2));

    // Remove previous color classes
    $cell.removeClass('text-danger text-success');

    // Apply color based on value
    if (remainingQty < 0) {
        $cell.addClass('text-danger'); // Red
    } else {
        $cell.addClass('text-success'); // Green
    }
}

function InWardOutWardSuccess(response) {
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

        var columns = Common.bindColumn(data[1], ['DistributorId', 'Status_Colour', 'InWardOutWardId']);
        bindTable('InWardOutWardTable', data[1], columns, -1, 'DistributorId', '330px', true, access);
    }
}

function EditInWardOutWardSuccess(response) {
    if (response.status) {
        $('#loader-pms').show();
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);
        Common.bindParentData(data[1], 'FormInOutStactic');

        var rawDate = data[1][0].InWardOutWardDate; // '30-05-2025'
        var parts = rawDate.split('-'); // [30, 05, 2025]
        var dateObj = new Date(parts[2], parts[1] - 1, parts[0]); // Year, Month (0-based), Day
        dateObj.setDate(dateObj.getDate() + 1);
        var todayFormatted = dateObj.toISOString().split('T')[0];

        $('#InWardOutWardDate').val(todayFormatted);
        //$('#InWardOutWardDate').attr('min', todayFormatted).val(todayFormatted);

        $("#EditCounterTextBox1").text(CounterBox[0]);
        $("#EditCounterTextBox2").text(CounterBox[1]);
        $("#EditCounterTextBox3").text(CounterBox[2]);
        $("#EditCounterTextBox4").text(CounterBox[3]);

        $('#EditCounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#EditCounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#EditCounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#EditCounterValBox4').text(data[0][0][CounterBox[3]]);
        $('.hideColumn').css('display', 'table-cell');

        inWardOutWardId = data[1][0].InWardOutWardId;

        setTimeout(function () {
            Common.ajaxCall("GET", "/Inventory/GetOutWardPo", { FranchiseId: data[1][0].ToFranchiseId, DistributorId: data[1][0].DistributorId }, function (response) {
                Common.bindDropDownSuccess(response.data, 'PurchaseOrderId');

                $('#InWardOutWardModal').show();
                if (data[1][0].PurchaseOrderId != null) {
                    $('#PurchaseOrderId').val(data[1][0].PurchaseOrderId);
                    let rawDate = data[1][0].PurchaseOrderDate;
                    let parts = rawDate.split('-');
                    let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    $('#PoDate').val(formattedDate);
                }

                Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('ToFranchiseId'), ModuleName: 'InWardProduct' }, function (response) {
                    var products = JSON.parse(response.data);
                    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: data[1][0].ToFranchiseId, ModuleName: 'Criteria' }, function (response) {
                        criteriaType = JSON.parse(response.data);

                        if (products != null && products.length > 0 && products[0].length > 0) {
                            var productsOptions = products[0].map(function (productsVal) {
                                return `<option value="${productsVal.ProductId}">${productsVal.ProductName}</option>`;
                            }).join('');
                        }
                        if (criteriaType != null && criteriaType.length > 0 && criteriaType[0].length > 0) {
                            var criteriaTypeOptions = criteriaType[0].map(function (criteriaTypeVal) {
                                return `<option value="${criteriaTypeVal.CriteriaId}">${criteriaTypeVal.CriteriaName}</option>`;
                            }).join('');
                        }

                        $('#dynamicInWard').empty("");

                        data[2].forEach((item, index) => {
                            let unique = Math.random().toString(36).substring(2);

                            var defaultOption = '<option value="">--Select--</option>';
                            if (item.InWardProductMappingId != null) {
                                //Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: item.ProductId, ModuleName: 'ProductFlavour' }, function (response) {
                                //    var flavor = JSON.parse(response.data);
                                //    if (flavor != null && flavor.length > 0 && flavor[0].length > 0) {
                                //        var flavorOptions = flavor[0].map(function (flavorVal) {
                                //            if (flavorVal.ProductFlavourId != null) {
                                //                var isSelected = flavorVal.ProductFlavourId == item.ProductFlavourId ? 'selected' : '';
                                //                return `<option value="${flavorVal.ProductFlavourId}" ${isSelected}>${flavorVal.ProductFlavourName}</option>`;
                                //            }
                                //        }).join('');
                                //    }

                                var html = `<tr class="InWardOutWardrow"  data-id="${item.InWardProductMappingId}">
                                                    <td>
                                                  <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" disabled>
                                                          ${defaultOption}${productsOptions}
                                                    </select>
                                                    </td>
                                                    <td><input type="text" id="InwardQty${unique}" name="InwardQty${unique}" class="form-control inwardQty" value="${item.InWardQty == null ? "" : item.InWardQty}" placeholder="InWard Qty" required oninput="Common.allowOnlyNumberLength(this, 10)"></td>
                                                    <td><input type="text" id="RefundQty${unique}" name="RefundQty${unique}" class="form-control refundQty"  value="${item.RefundQty == null ? "" : item.RefundQty}" placeholder="Refund Qty" oninput="Common.allowOnlyNumberLength(this, 10)"></td>
                                                    <td><input type="text" id="SortingQty_Damage${unique}" name="SortingQty_Damage${unique}" class="form-control SortingQty_Damage" value="${item.SortingQty_Damage == null ? "" : item.SortingQty_Damage}"  placeholder="0" ></td>
                                                    <td><input type="text" id="SortingQty_OtherBottles${unique}" name="SortingQty_OtherBottles${unique}" class="form-control SortingQty_OtherBottles" value="${item.SortingQty_OtherBottles == null ? "" : item.SortingQty_OtherBottles}"  placeholder="0" ></td>
                                                      <td><input type="text" id="SortingQty_Others${unique}" name="SortingQty_Others${unique}" class="form-control SortingQty_Others" value="${item.SortingQty_Others == null ? "" : item.SortingQty_Others}"  placeholder="0" ></td>

                                                    <td><input type="text" id="FinalInwardQty${unique}" name="FinalInwardQty${unique}" class="form-control finalInwardQty" value="${item.FinalInWardQty == null ? "" : item.FinalInWardQty}" placeholder="Final Inward Qty" disabled></td>
                                                    <td class="d-flex justify-content-center">
                                                        <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height:34px;width:34px;">
                                                            <i class="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>`;

                                $('#dynamicInWard').append(html);
                                $('#SortingReason' + unique).each(function () {
                                    $(this).select2({
                                        theme: 'bootstrap4',
                                        width: 'style',
                                        placeholder: $(this).attr('placeholder'),
                                        allowClear: Boolean($(this).data('allow-clear')),
                                    });
                                });
                                const matchingMainRows = data[3].filter(mainItem => mainItem.RowNumber === item.RowNumber);
                                const reasonValues = matchingMainRows.map(mainItem => mainItem.SortingReasonId?.toString() || "");
                                $(`#SortingReason${unique}`).val(reasonValues).trigger('change');

                                $('#ProductId' + unique).val(item.ProductId);
                                $('#DistributorId').val(data[1][0].DistributorId);
                                calculateInwardTotals();
                                $('#addDynInWardLiTag').show();
                                // });
                            } else {
                                $('#dynamicInWard').empty("");
                                $('#addDynInWard').click();
                                $('#addDynInWardLiTag').show();
                                $('#DistributorId').val(data[1][0].DistributorId);
                                $('.hideColumn').css('display', 'none');
                            }

                        });
                    });

                }, null);

                Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: Common.parseInputValue('ToFranchiseId'), ModuleName: 'FranchiseProduct' }, function (response) {
                    var products = JSON.parse(response.data);
                    if (products != null && products.length > 0 && products[0].length > 0) {
                        var productsOptions = products[0].map(function (productsVal) {
                            return `<option value="${productsVal.ProductId}">${productsVal.ProductName}</option>`;
                        }).join('');
                    }
                    $('#dynamicOutWard').empty("");
                    data[4].forEach((item, index) => {
                        let unique = Math.random().toString(36).substring(2);

                        var defaultOption = '<option value="">--Select--</option>';
                        if (item.OutWardProductMappingId != null) {
                            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: item.ProductId, ModuleName: 'ProductFlavour' }, function (response) {
                                var flavor = JSON.parse(response.data);
                                if (flavor != null && flavor.length > 0 && flavor[0].length > 0) {
                                    var flavorOptions = flavor[0].map(function (flavorVal) {
                                        if (flavorVal.ProductFlavourId != null) {
                                            var isSelected = flavorVal.ProductFlavourId == item.ProductFlavourId ? 'selected' : '';
                                            return `<option value="${flavorVal.ProductFlavourId}" ${isSelected}>${flavorVal.ProductFlavourName}</option>`;
                                        }
                                    }).join('');
                                }
                                var html = `<tr class="InWardOutWardrow"  data-id="${item.OutWardProductMappingId}">
                                             <td class="type-cell" data-label="Type" Style="text-align: center;vertical-align: baseline;">${item.Type}</td>

                                                    <td>
                                                 <select class="form-control productId" id="ProductId${unique}" name="ProductId${unique}" required disabled>
                                                   ${defaultOption}${productsOptions}
                                                   </select>
                                                    </td>
                                                    <td>
                                                        <select class="form-control productFlavourId" id="ProductFlavourId${unique}" name="ProductFlavourId${unique}" required disabled>
                                                         ${defaultOption}${flavorOptions}
                                                        </select>
                                                    </td>
                                                    <td class="POQty-cell"><input type="text" id="POQty${unique}" name="POQty${unique}" class="form-control POQty" placeholder="PO Qty" value="${item.POQty}" disabled></td>

                                                    <td><input type="text" id="OutwardQty${unique}" name="OutwardQty${unique}" value="${item.OutWardQty}" class="form-control outwardQty" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 5)" placeholder="OutWard Qty" required></td>
                                                    <td class="DifferenceCell" data-label="Total"></td>
                                                    <td class="d-flex justify-content-center">
                                                        <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height:34px;width:34px;">
                                                            <i class="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>`;

                                $('#dynamicOutWard').append(html);
                                let newRow = $('#dynamicOutWard tr:last');
                                $('#ProductId' + unique).val(item.ProductId);
                                DiffrentQty(newRow, item.POQty);
                                if (data[1][0].PurchaseOrderId != null) {
                                    $('#addDynOutWardLiTage').hide();
                                    $('.POQty-cell,.DifferenceCell,#POQTYHEAD,#DIFFQTYHEAD').show();
                                } else {
                                    $('#addDynOutWardLiTage').show();
                                    $('.POQty-cell,.DifferenceCell,#POQTYHEAD,#DIFFQTYHEAD').hide();
                                }
                            });
                        } else {
                            $('#dynamicOutWard').empty("");
                            $('#addDynOutWard').click();
                            $('#addDynOutWardLiTage').hide();
                        }
                        $('#loader-pms').hide();
                    });
                }, null);
            });
        }, 200);

    }
}

function SaveSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#InWardOutWardModal').hide();
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

        Common.ajaxCall("GET", "/Productions/GetInWardOutWard", { FranchiseId: FranchiseMappingId, FromDate: fromDate, ToDate: toDate, InWardOutWardDate: null, DistributorId: null }, InWardOutWardSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }

}



function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var StatusColumnIndex = columns.findIndex(column => column.data === "Shortage");

    if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [
        {
            "targets": StatusColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Status_Colour != null && row.Status_Colour.length > 0) {
                    var dataText = row.Shortage == null ? "" : row.Shortage;
                    var statusColor = row.Status_Colour.toLowerCase();

                    var htmlContent = '<div>';
                    htmlContent += '<span style="color:' + statusColor + ';width: 99px;font-size: 12px;height: 20px;">' + dataText + '</span>';
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
                                 ${editCondition ? `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" data-InWardOutWardId="${row.InWardOutWardId}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-delete alert_delete mx-1"  data-id="${row[editcolumn]}" data-InWardOutWardId="${row.InWardOutWardId}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
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
        "pageLength": 8,
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
}


function calculateInwardTotals() {
    let totalQty = 0;

    $('#dynamicInWard .InWardOutWardrow').each(function () {
        const qty = parseInt($(this).find('.finalInwardQty').val()) || 0;
        if (qty > 0) {
            totalQty += qty;
        }
    });

    $('#TotalBalance').val(totalQty);
    $('#NoOfProducts').val($('#dynamicInWard .InWardOutWardrow').length);
}

function calculateOutwardTotals() {
    let totalQty = 0;

    $('#dynamicOutWard .InWardOutWardrow').each(function () {
        const qty = parseFloat($(this).find('.outwardQty').val()) || 0;
        if (qty > 0) {
            totalQty += qty;
        }
    });

    $('#TotalBalance').val(totalQty.toFixed(2));
    $('#NoOfProducts').val($('#dynamicOutWard .InWardOutWardrow').length);
}

// Optional: recalculate when quantity input changes
$(document).on('input', '.refundQty', function () {
    if ($('#myTabInOut #InWard-TabBtn').hasClass('active')) {
        calculateInwardTotals();
    }
});

