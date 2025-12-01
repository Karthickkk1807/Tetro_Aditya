var ProductionPlanId = 0;
var titleForHeaderProductTab = "";
var ProductDropdown = [];
var ItemListAdd = [];
var AlreadyAddedIds = [];

$(document).ready(async function () {
    titleForHeaderProductTab = "Production Plan";
    $('.datapiker').show();

    Common.bindDropDownParent('PreparedBy', 'FormStatus', 'SampleReceivedBy');

    var productDropdown = await Common.bindDropDownSync('SampleChemical');
    ProductDropdown = JSON.parse(productDropdown);

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    let displayedDate = new Date(currentYear, currentMonth);
    updateMonthDisplay(displayedDate);
    $('#increment-month-btn2').hide();

    $('#decrement-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        updateMonthDisplay(displayedDate);
        $('#increment-month-btn2').show();
        $('#tableFilter').val('');

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
    });

    $('#increment-month-btn2').click(function () {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
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
            $('#increment-month-btn2').show();
        }
    }

    var today = new Date().toISOString().split('T')[0];
    $('#FromDate, #ToDate').attr('max', today);
    $(document).on('change', '#FromDate,#ToDate', function () {
        var fromDate = $('#FromDate').val();
        $('#tableFilter').val('');
        $('#ToDate').attr('min', fromDate);
        if ($('#FromDate').val() != "" && $('#ToDate').val() != "") {
            Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: Common.stringToDateTime('FromDate').toISOString(), ToDate: Common.stringToDateTimeSendTimeAlso('ToDate').toISOString() }, GetProductionPlanSuccess, null);
        }
    });

    $(document).on('click', '#downloadExcelBtn', function () {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        $('#tableFilter').val('');

        displayedDate = new Date(currentYear, currentMonth);
        $('#increment-month-btn2').show();

        updateMonthDisplay(displayedDate);

        var fnData = Common.getDateFilter('dateDisplay2');
        Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
    });

    $(document).on('click', '#bulkEmployee', function () {
        $('#FromDate').val('');
        $('#ToDate').val('');
        $('#ToDate').removeAttr('max');
        $('#tableFilter').val('');
    });

    var fnData = Common.getDateFilter('dateDisplay2');
    Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);

    $(document).on('click', '#AddProductionPlan', function () {
        $('.Status-Div').hide();
        $('#SaveProductionPlan').text('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        $('.AddedRow').remove();
        $('.RowOfChemical').remove();
        duplicateRowChemical();
        $('.RawMetarial').remove();
        duplicateRowRawMetarial();

        $('#LoadingDateTimeDiv').hide();
        $('#UnLoadingDateTimeDiv').hide();

        $("#QRCode").html("");

        AlreadyAddedIds = [];
        ItemListAdd = [];

        const today = new Date().toISOString().split('T')[0];
        $("#BatchDate").val(today);

        $('#ProductionPlanModal').show();
    });

    $(document).on('click', '.btn-edit', function () {
        ProductionPlanId = $(this).data('id');

        $('.Status-Div').show();
        $('#SaveProductionPlan').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');

        AlreadyAddedIds = [];
        $('.AddedRow').remove();
        $('.RowOfChemical').remove();
        duplicateRowChemical();
        $('.RawMetarial').remove();
        duplicateRowRawMetarial();

        $('#LoadingDateTimeDiv').show();
        $('#UnLoadingDateTimeDiv').show();

        $("#QRCode").html("");

        const today = new Date().toISOString().split('T')[0];
        $("#BatchDate").val(today);

        $('#ProductionPlanModal').show();
    });

    $(document).on('click', '#ProductionPlanClose, #ProductionPlanCancelBtn', function () {
        $('#ProductionPlanModal').hide();
    });

    $(document).on('click', '.navbar-tab', function () {

        $('#tableFilter').val('');
        titleForHeaderProductTab = $(this).text().trim();
        $('.navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderProductTab) {
                $(this).addClass('active');
            }
        });
        if (titleForHeaderProductTab == "Production Plan") {
            $('.datapiker').show();
            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(1), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
        }
        else if (titleForHeaderProductTab == "Grey Fabric Stock Info") {
            $('.datapiker').hide();
            var fnData = Common.getDateFilter('dateDisplay2');
            Common.ajaxCall("GET", "/Productions/GetProductionPlan", { TypeId: parseInt(2), ProductionPlanId: null, FromDate: fnData.startDate.toISOString(), ToDate: fnData.endDate.toISOString() }, GetProductionPlanSuccess, null);
        }
    });

    $(document).on('click', '#AddNotesLable', function () {
        $('#AddNotes').show();
        $('#AddNotesLable').hide();
        $('#HideNotesLable').show();
    });

    $(document).on('click', '#HideNotesLable', function () {
        $('#AddNotes').hide();
        $('#AddNotesLable').show();
        $('#HideNotesLable').hide();
    });

    $(document).on('click', '#AddAttachLable', function () {
        $('#AddAttachment').show();
        $('#AddAttachLable').hide();
        $('#HideAttachlable').show();
    });

    $(document).on('click', '#HideAttachlable', function () {
        $('#AddAttachment').hide();
        $('#AddAttachLable').show();
        $('#HideAttachlable').hide();
    });

    $(document).on('click', '#ProductionPlanAddItemClose', function () {
        $('#ProductionPlanAddItemModal').hide();
    });
});

// ===================================================================
// FUNCTION TO LOAD ITEMS INTO POPUP TABLE
// ===================================================================
function LoadPopupItems(allItems) {
    $("#ProductionPlanAddItem-table-body").empty();

    allItems.forEach(item => {
        const row = `
            <tr class="AddItemRow">
                <td>
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="mr-2 ItemCheckbox" id="ItemId-${item.ItemId}">
                        <label for="ItemId-${item.ItemId}" class="Customer mb-0">${item.Customer}</label>
                    </div>
                </td>
                <td><label class="LotNo mb-0">${item.LotNo}</label></td>
                <td><label class="Colour mb-0">${item.Colour}</label></td>
                <td><label class="FabricType mb-0">${item.FabricType}</label></td>
                <td><label class="GSM mb-0">${item.GSM}</label></td>
                <td><label class="Width mb-0">${item.Width}</label></td>
                <td><label class="Quantity mb-0">${item.Quantity}</label></td>
                <td>
                    <input type="text" class="form-control AvailableQuantity" value="${item.Quantity}">
                </td>
            </tr>
        `;
        $("#ProductionPlanAddItem-table-body").append(row);
    });

    $("#ProductionPlanAddItemModal").show();
}

// ===================================================================
// CHECKBOX CLICK HANDLER
// ===================================================================
$(document).on('change', '.ItemCheckbox', function () {
    const itemId = $(this).attr('id').replace("ItemId-", "");
    const $row = $(this).closest("tr");
    const $tbody = $("#ProductionPlanAddItem-table-body");

    if (this.checked) {
        $row.fadeOut(200, function () {
            $row.detach();               // remove row temporarily
            $tbody.prepend($row);        // move to top
            $row.fadeIn(300);            // fade in smoothly
        });
    } else {
        $row.fadeOut(200, function () {
            $row.detach();
            $tbody.append($row);         // move to bottom
            $row.fadeIn(300);
        });
    }

    const itemObj = {
        ItemId: itemId,
        LotNo: $row.find(".LotNo").text() || '',
        Customer: $row.find(".Customer").text() || '',
        FabricType: $row.find(".FabricType").text() || '',
        Colour: $row.find(".Colour").text() || '',
        GSM: $row.find(".GSM").text() || '',
        Width: $row.find(".Width").text() || '',
        Quantity: parseFloat($row.find(".Quantity").text()) || 0,
        AvailableQuantity: parseFloat($row.find(".AvailableQuantity").val()) || 0,
        IsChecked: $(this).prop("checked")
    };

    if (itemObj.IsChecked) {
        if (!ItemListAdd.some(x => x.ItemId == itemObj.ItemId)) {
            ItemListAdd.push(itemObj);
        }
    } else {
        ItemListAdd = ItemListAdd.filter(x => x.ItemId != itemObj.ItemId);
    }

    UpdateSelectedItemCount();
    UpdateTotalQuantity();
});

$(document).on('input', '.AvailableQuantity', function () {
    UpdateTotalQuantity();
});

// ===================================================================
// UPDATE TOTAL QTY IN POPUP
// ===================================================================
function UpdateTotalQuantity() {
    let totalQty = 0;

    ItemListAdd.forEach(item => {
        // Find the row corresponding to this ItemId
        let $row = $("#ProductionPlanAddItem-table-body").find(`#ItemId-${item.ItemId}`).closest("tr");
        if ($row.length) {
            // Update the AvailableQuantity from the input field
            item.AvailableQuantity = parseFloat($row.find(".AvailableQuantity").val()) || 0;
            totalQty += item.AvailableQuantity;
        }
    });

    $("#NoOfQty").text(totalQty);
}





//// ===================================================================
//// CHECKBOX CLICK HANDLER
//// ===================================================================
//$(document).on('change', '.ItemCheckbox', function () {

//    const itemId = $(this).attr('id').replace("ItemId-", "");
//    const $row = $(this).closest("tr");

//    const itemObj = {
//        ItemId: itemId,
//        LotNo: $row.find(".LotNo").text() || '',
//        Customer: $row.find(".Customer").text() || '',
//        FabricType: $row.find(".FabricType").text() || '',
//        Colour: $row.find(".Colour").text() || '',
//        GSM: $row.find(".GSM").text() || '',           // Add GSM
//        Width: $row.find(".Width").text() || '',       // Add Width
//        Quantity: parseFloat($row.find(".Quantity").text()) || 0,
//        AvailableQuantity: parseFloat($row.find(".AvailableQuantity").val()) || 0,
//        IsChecked: $(this).prop("checked")
//    };

//    if (itemObj.IsChecked) {
//        if (!ItemListAdd.some(x => x.ItemId == itemObj.ItemId)) {
//            ItemListAdd.push(itemObj);
//        }
//    } else {
//        ItemListAdd = ItemListAdd.filter(x => x.ItemId != itemObj.ItemId);
//    }

//    UpdateSelectedItemCount();
//    UpdateTotalQuantity();
//});

//$(document).on('input', '.AvailableQuantity', function () {
//    UpdateTotalQuantity();
//});


//// ===================================================================
//// UPDATE TOTAL QTY IN POPUP
//// ===================================================================
//function UpdateTotalQuantity() {
//    let totalQty = 0;
//    ItemListAdd.forEach(x => {
//        totalQty += x.AvailableQuantity; // sum from input
//    });
//    $("#NoOfQty").text(totalQty);
//}







// ===================================================================
// POPUP → SELECTED ITEM COUNT
// ===================================================================
function UpdateSelectedItemCount() {
    const count = $(".ItemCheckbox:checked").length;
    $("#TotalItemSelect").text(count);
}

// ===================================================================
// ADD SELECTED ITEMS TO MAIN TABLE
// ===================================================================
var AddedItems = [];

$(document).on("click", "#BtnAdd", function () {

    let isAnyChecked = false;
    $('.AddItemRow').each(function () {
        if ($(this).find('input[type="checkbox"]').prop('checked')) {
            isAnyChecked = true;
            return false;
        }
    });

    if (!isAnyChecked) {
        Common.warningMsg('Select at least one Customer to add.');
        return;
    }

    $('table tbody tr').each(function () {
        const rowData = {
            CustomerName: $(this).find('.customerName').text(),
            LotNo: $(this).find('.lotNo').text(),
            Colour: $(this).find('.colour').text(),
            FabricType: $(this).find('.fabricType').text(),
            GSM: $(this).find('.gsm').text(),
            Width: $(this).find('.width').text(),
            AvailableQuantity: $(this).find('.quantity').text()
        };

        // Avoid duplicates (optional)
        if (!AddedItems.find(item => item.LotNo === rowData.LotNo)) {
            AddedItems.push(rowData);
        }
    });

    ItemListAdd.forEach(item => {

        if (AlreadyAddedIds.includes(item.ItemId.toString())) return;

        AlreadyAddedIds.push(item.ItemId.toString());

        const newRow = `
            <tr class="AddedRow">
                <td></td>
                <td><input type="text" class="form-control lotNo" value="${item.LotNo}" disabled></td>
                <td><input type="text" class="form-control colour" value="${item.Colour}" disabled></td>
                <td><input type="text" class="form-control fabricType" value="${item.FabricType}" disabled></td>
                <td><input type="text" class="form-control GSM" value="${item.GSM}" disabled></td>
                <td><input type="text" class="form-control Width" value="${item.Width}" disabled></td>
                <td><input type="number" class="form-control qty" value="${item.AvailableQuantity}"></td>
                <td><input type="text" class="form-control processRoute" placeholder="Click"></td>
                <td><textarea class="form-control Remarks" name="Remarks" placeholder="Ex: Type Querys" rows="1"></textarea></td>
                <td>
                    <button class="btn DynremoveBtn DynrowRemove" type="button" data-id="${item.ItemId}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;

        $("#AddItemButtonRow").before(newRow);
    });

    //let qrDataList = [];

    //$("table tbody tr.AddedRow").each(function () {
    //    let obj = {
    //        LotNo: $(this).find('.lotNo').val(),
    //        Colour: $(this).find('.colour').val(),
    //        FabricType: $(this).find('.fabricType').val(),
    //        GSM: $(this).find('.GSM').val(),
    //        Width: $(this).find('.Width').val(),
    //        Qty: $(this).find('.qty').val()
    //    };

    //    qrDataList.push(obj);
    //});

    //let qrFinalString = JSON.stringify(qrDataList);

    //$("#QRCode").html("");

    //new QRCode(document.getElementById("QRCode"), {
    //    text: qrFinalString,
    //    width: 200,
    //    height: 200
    //});

    $("#QRCode").html("");

    new QRCode(document.getElementById("QRCode"), {
        text: JSON.stringify([{ LotNo: "123", Colour: "Red" }]),
        width: 100,
        height: 100
    });

    RenumberRows();
    UpdateMainTableQuantity();
    ItemListAdd = [];
    $("#ProductionPlanAddItemModal").hide();
});

// ===================================================================
// DELETE ROW
// ===================================================================
$(document).on('click', '.DynrowRemove', function () {
    const id = $(this).data("id").toString();

    // Remove row from main table
    $(this).closest("tr").remove();

    // Remove from AlreadyAddedIds so popup will show again
    AlreadyAddedIds = AlreadyAddedIds.filter(x => x !== id);

    // Remove from ItemListAdd if exists (important if popup is open)
    ItemListAdd = ItemListAdd.filter(x => x.ItemId.toString() !== id);

    // Remove from RowProcesses array if you are tracking process selection
    RowProcesses = RowProcesses.filter(x => x.ItemId.toString() !== id);

    // Renumber rows
    RenumberRows();

    // Update main total quantity
    UpdateMainTableQuantity();
});
// ===================================================================
// RENUMBER TABLE S.NO
// ===================================================================
function RenumberRows() {
    $('#ProductionPlanProductTablebody .AddedRow').each(function (index) {
        $(this).find('td:first').text(index + 1);
    });
}

// ===================================================================
// UPDATE TOTAL QTY IN MAIN TABLE
// ===================================================================
$(document).on('input', '.qty', function () {
    UpdateMainTableQuantity();
});

function UpdateMainTableQuantity() {

    let total = 0;

    $("#ProductionPlanProductTablebody tr.AddedRow").each(function () {
        let qty = parseFloat($(this).find("input.qty").val()) || 0;
        total += qty;
    });

    $("#Subtotal").val(total.toFixed(2));
}

// ===================================================================
// OPEN POPUP BUTTON CLICK
// ===================================================================
$(document).on('click', '#AddItemBtn', function () {

    $("#TotalItemSelect").text('');
    $("#NoOfQty").text('');

    const mockData = [
        { ItemId: 1, Customer: "Customer A", LotNo: "LOT-1001", Colour: "Blue", FabricType: "Cotton", GSM: 120, Width: 45, Quantity: 500, AvailableQuantity: 400 },
        { ItemId: 2, Customer: "Customer A", LotNo: "LOT-1002", Colour: "Light Blue", FabricType: "Cotton", GSM: 125, Width: 46, Quantity: 300, AvailableQuantity: 250 },
        { ItemId: 3, Customer: "Customer A", LotNo: "LOT-1003", Colour: "Dark Blue", FabricType: "Cotton", GSM: 130, Width: 44, Quantity: 400, AvailableQuantity: 350 },

        // Customer B
        { ItemId: 4, Customer: "Customer B", LotNo: "LOT-2001", Colour: "Black", FabricType: "Polyester", GSM: 110, Width: 50, Quantity: 300, AvailableQuantity: 280 },
        { ItemId: 5, Customer: "Customer B", LotNo: "LOT-2002", Colour: "Gray", FabricType: "Polyester", GSM: 115, Width: 52, Quantity: 250, AvailableQuantity: 220 },

        // Customer C
        { ItemId: 6, Customer: "Customer C", LotNo: "LOT-3001", Colour: "Red", FabricType: "Silk", GSM: 90, Width: 40, Quantity: 200, AvailableQuantity: 150 },

        // Customer D
        { ItemId: 7, Customer: "Customer D", LotNo: "LOT-4001", Colour: "White", FabricType: "Linen", GSM: 100, Width: 48, Quantity: 350, AvailableQuantity: 300 },

        // Customer E
        { ItemId: 8, Customer: "Customer E", LotNo: "LOT-5001", Colour: "Navy Blue", FabricType: "Denim", GSM: 200, Width: 60, Quantity: 600, AvailableQuantity: 500 },

        // Customer F
        { ItemId: 9, Customer: "Customer F", LotNo: "LOT-6001", Colour: "Green", FabricType: "Rayon", GSM: 150, Width: 55, Quantity: 400, AvailableQuantity: 350 },

        // Customer G
        { ItemId: 10, Customer: "Customer G", LotNo: "LOT-7001", Colour: "Yellow", FabricType: "Viscose", GSM: 130, Width: 52, Quantity: 250, AvailableQuantity: 200 }
    ];

    const filteredData = mockData.filter(item => !AlreadyAddedIds.includes(item.ItemId.toString()));

    LoadPopupItems(filteredData);
});

// Array to store processes for each row
let RowProcesses = []; // { ItemId: 1, Processes: ["Knitting", "Washing"] }

// ===================================================================
// CLICK ON .processRoute TO OPEN MODAL
// ===================================================================

$(document).on('click', '.processRoute', function () {
    const $row = $(this).closest('tr');
    const itemId = $row.find('.DynrowRemove').data('id'); // get row item id

    // Remove any existing modal
    $('#ProcessModal').remove();

    // Create modal HTML
    let html = `
    <div class="modal fade show" id="ProcessModal" tabindex="-1" aria-labelledby="ProcessModalLabel" style="padding-right: 5px; display: flex; align-items: center;">
        <div class="modal-dialog modal-sm">
            <div class="modal-content"> 
                <div class="modal-header d-flex align-items-center justify-content-between">
                    <h2 id="ModalHeading">Select Processes</h2>
                    <span id="ProcessPopupClose" class="close" style="font-size:30px;cursor:pointer;color:#fffefe;" title="Close">×</span>
                </div>
                 
                <div class="modal-body">
                    <div id="ProcessCheckboxContainer" class="row g-2">
                        <div class="col-md-6 col-lg-6 col-sm-6 col-6 checkDiv">
                            <input type="checkbox" class="ProcessCheck me-2 mr-2" data-id="6" name="products" value="Dyeing" id="Dyeing">
                            <label for="Dyeing" class="checkbox-label">Dyeing</label>
                        </div>  
                        <div class="col-md-6 col-lg-6 col-sm-6 col-6 checkDiv">
                            <input type="checkbox" class="ProcessCheck me-2 mr-2" data-id="6" name="products" value="Printing" id="Printing">
                            <label for="Printing" class="checkbox-label">Printing</label>
                        </div>  
                        <div class="col-md-6 col-lg-6 col-sm-6 col-6 checkDiv">
                            <input type="checkbox" class="ProcessCheck me-2 mr-2" data-id="6" name="products" value="Finishing" id="Finishing">
                            <label for="Finishing" class="checkbox-label">Finishing</label>
                        </div>  
                        <div class="col-md-6 col-lg-6 col-sm-6 col-6 checkDiv">
                            <input type="checkbox" class="ProcessCheck me-2 mr-2" data-id="6" name="products" value="Biowash" id="Biowash">
                            <label for="Biowash" class="checkbox-label">Biowash</label>
                        </div>  
                        <div class="col-md-6 col-lg-6 col-sm-6 col-6 checkDiv">
                            <input type="checkbox" class="ProcessCheck me-2 mr-2" data-id="6" name="products" value="DoubleDyeing" id="DoubleDyeing">
                            <label for="DoubleDyeing" class="checkbox-label">DoubleDyeing</label>
                        </div>   
                    </div>
                </div>
                <div class="modal-footer py-2">
                    <button type="button" class="btn btn-primary btn-sm d-none" id="SaveProcessBtn">Save</button>
                </div>
            </div>
        </div>
    </div>
    `;

    $('body').append(html);

    // Pre-check checkboxes if already selected
    let selectedRow = RowProcesses.find(r => r.ItemId == itemId);
    let selectedProcesses = selectedRow ? selectedRow.Processes : [];
    $('.ProcessCheck').each(function () {
        $(this).prop('checked', selectedProcesses.includes($(this).val()));
    });

    // Show/hide Save button based on pre-checked items
    toggleSaveButton();

    // CLOSE MODAL
    $('#ProcessPopupClose').click(function () {
        $('#ProcessModal').remove();
    });

    // CHECKBOX CHANGE → toggle Save button
    $(document).on('change', '.ProcessCheck', function () {
        toggleSaveButton();
    });

    function toggleSaveButton() {
        const checkedCount = $('.ProcessCheck:checked').length;
        if (checkedCount > 0) {
            $('#SaveProcessBtn').removeClass('d-none');
        } else {
            $('#SaveProcessBtn').addClass('d-none');
        }
    }

    // SAVE PROCESS SELECTION
    $('#SaveProcessBtn').click(function () {
        const checked = [];
        $('.ProcessCheck:checked').each(function () {
            checked.push($(this).val());
        });

        let existingRow = RowProcesses.find(r => r.ItemId == itemId);
        if (existingRow) {
            existingRow.Processes = checked;
        } else {
            RowProcesses.push({ ItemId: itemId, Processes: checked });
        }

        // Update the input field in main table with the COUNT of selected processes
        $row.find('.processRoute').val(checked.length);

        $('#ProcessModal').remove();
    });
});

$(document).on('click', '#RawMetarialInfo', function () {
    $('#RawMaterialModal').show();
});

$(document).on('click', '#RawMaterialClose', function () {
    $('#RawMaterialModal').hide();
});

$(document).on('click', '#ChemicalInfo', function () {
    $('#ChemicalModal').show();
});

$(document).on('click', '#ChemicalClose', function () {
    $('#ChemicalModal').hide();
});

function duplicateRowChemical() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RowOfChemical').length;

    var ProductSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (ProductDropdown != null && ProductDropdown.length > 0 && ProductDropdown[0].length > 0) {
        ProductSelectOptions = ProductDropdown[0].map(function (ProductId) {
            return `<option value="${ProductId.ProductId}">${ProductId.ProductName}</option>`;
        }).join('');
    }

    if (rowadd < 3) {
        var htmlRow = `
            <div class="row RowOfChemical">
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="ProcessClass">Process<span id="Asterisk">*</span></label>
                        <select class="form-control Process" id="Process${numberIncr}" name="Process${numberIncr}" required> 
                            <option value="">--Select--</option>
                            <option value="1">Pre-Treatment</option>
                            <option value="2">After-Treatment</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4 col-lg-4 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="ProductClass">Product<span id="Asterisk">*</span></label>
                        <select class="form-control ProductId" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required> 
                            ${defaultOption}${ProductSelectOptions}
                        </select>
                    </div>
                </div>
                <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="GPLClass">GPL%<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control" placeholder="Ex: 8.3" id="GPL${numberIncr}" name="GPL${numberIncr}" />
                    </div>
                </div>
                <div class="col-md-2 col-lg-2 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="QtyClass">Qty<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control" placeholder="Ex: 0" id="Qty${numberIncr}" name="Qty${numberIncr}" />
                    </div>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'block' : 'none'}">
                        <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowChemical(this)" style="position: absolute; top: 22px; right: 14px;">
                            <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                        </button>
                    </div>
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                        <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemove mt-0" type="button" onclick="removeRowRowChemical(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
           `;
    }
    $('#ChemicalDynamic').append(htmlRow);
}

function removeRowRowChemical(button) {
    var totalRows = $('.RowOfChemical').length;
    if (totalRows > 1) {
        $(button).closest('.RowOfChemical').remove();
    }
}

function duplicateRowRawMetarial() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.RawMetarial').length;

    var ProductSelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';

    if (ProductDropdown != null && ProductDropdown.length > 0 && ProductDropdown[0].length > 0) {
        ProductSelectOptions = ProductDropdown[0].map(function (ProductId) {
            return `<option value="${ProductId.ProductId}">${ProductId.ProductName}</option>`;
        }).join('');
    }

    if (rowadd < 3) {
        var htmlRow = `
            <div class="row RawMetarial"> 
                <div class="col-md-5 col-lg-5 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="DyeNameClass">DyeName<span id="Asterisk">*</span></label>
                        <select class="form-control ProductId" id="ProductId${numberIncr}" name="ProductId${numberIncr}" required> 
                            ${defaultOption}${ProductSelectOptions}
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="DyeClass">Dye%<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control Dye" placeholder="Ex: 8.3" id="Dye${numberIncr}" name="Dye${numberIncr}" />
                    </div>
                </div>
                <div class="col-md-3 col-lg-3 col-sm-6 col-6">
                    <div class="form-group">
                        <label class="TotalDyeQtyClass">TotalDyeQty<span id="Asterisk">*</span></label>
                        <input type="text" class="form-control TotalDyeQty" placeholder="Ex: 0" id="TotalDyeQty${numberIncr}" name="TotalDyeQty${numberIncr}" />
                    </div>
                </div>
                <div class="col-lg-1 col-md-1 col-sm-3 col-3 p-0 thiswillshow">
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'block' : 'none'}">
                        <button id="" class="btn AddStockBtn" type="button" onclick="duplicateRowRawMetarial(this)" style="position: absolute; top: 22px; right: 14px;">
                            <i class="fas fa-plus" id="AddButton" style="color: #000000;"></i>
                        </button>
                    </div>
                    <div class="p-1 align-items-center buttonsRow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
                        <button id="RemoveButton" class="btn DynrowRemove RowOfChemicalRemove mt-0" type="button" onclick="removeRowMaterial(this)" style="top: 4px; position: absolute; right: 13px;"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
           `;
    }
    $('#RawMaterialDynamic').append(htmlRow);
}

function removeRowMaterial(button) {
    var totalRows = $('.RawMetarial').length;
    if (totalRows > 1) {
        $(button).closest('.RawMetarial').remove();
    }
}

function GetProductionPlanSuccess(response) {
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

        $('#MainGrid').empty('');
        var html = `<table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive tableResponsive" style="max-height:200px" id="ProductionPlanTable">
                </table>
            `;
        $('#MainGrid').append(html);

        var columns = Common.bindColumn(data[1], ['ProductionPlanId', 'Status_Color']);
        if (titleForHeaderProductTab == "Production Plan") {
            bindTable('ProductionPlanTable', data[1], columns, -1, 'ProductionPlanId', '350px', true, access);
            $(".dataTables_scrollBody").css("max-height", "350px");
        } else {
            bindTable('ProductionPlanTable', data[1], columns, -1, 'ProductionPlanId', '350px', false, access);
            $(".dataTables_scrollBody").css("max-height", "315px");
        }
    }
}


function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
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
                    let html = "";
                    if (tableid === "Audittable") {
                        html += `<i class="btn-report mx-1 fas fa-file-alt text-primary" 
                            data-id="${row[editcolumn]}" 
                            title="Report" 
                            style="cursor:pointer; font-size:16px;">
                        </i>`;
                    }
                    if (editCondition) {
                        html += `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit">
                            <img src="/assets/commonimages/edit.svg" />
                         </i>`;
                    }
                    if (deleteCondition) {
                        html += `<i class="btn-delete alert_delete mx-1" data-id="${row[editcolumn]}" title="Delete">
                            <img src="/assets/commonimages/delete.svg" />
                         </i>`;
                    }

                    return html;
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
}

$(document).on('input', '#AdditemSearchProduction', function () {
    applyProductionFilters();
});

function applyProductionFilters() {
    let searchValue = $('#AdditemSearchProduction').val().toLowerCase();
    let visibleRowCount = 0;

    $('#ProductionPlanAddItem-table-body tr').each(function () {
        let customer = $(this).find('.Customer').text().toLowerCase();
        let lotNo = $(this).find('.LotNo').text().toLowerCase();
        let colour = $(this).find('.Colour').text().toLowerCase();
        let fabricType = $(this).find('.FabricType').text().toLowerCase();
        let gsm = $(this).find('.GSM').text().toLowerCase();
        let width = $(this).find('.Width').text().toLowerCase();
        let quantity = $(this).find('.Quantity').text().toLowerCase();
         
        let rowText = customer + ' ' + lotNo + ' ' + colour + ' ' + fabricType + ' ' + gsm + ' ' + width + ' ' + quantity;

        let isVisible = !searchValue || rowText.includes(searchValue);

        $(this).toggle(isVisible);

        if (isVisible) visibleRowCount++;
    });

    $('.ProductionEmptyRow').toggle(visibleRowCount === 0);
}