

function updateSelectionSummary(table) {
    let selectedRows = table.find("tbody input[type='checkbox']:checked").closest("tr");
    let selectedCount = selectedRows.length;
    let totalAmount = 0;

    selectedRows.each(function () {
        let sellingPrice = parseFloat($(this).find(".SellingPrice").text()) || 0;
        let Qty = parseFloat($(this).find(".QtyProductAdd").val()) || 0;
        var Total = sellingPrice * Qty;

        totalAmount += Total;
    });


    $("#ItemSelectedCount").text(selectedCount);
    $("#TotalItemsAmount").text('₹ ' + totalAmount.toFixed(2));


    if (selectedCount > 0) {
        $(".TotalSelectedItmsCount,.TotalSelctAmount").show();
    } else {
        $(".TotalSelectedItmsCount,.TotalSelctAmount").hide();
    }
}



/*======================*/



$(document).on('click', '#CloseInAddItem', function () {
    Inventory.ResetProductListTable();
});



$(document).on('click', '.dropdown-item', function () {
    var selectedUnit = $(this).text();
    var $dropdownButton = $(this).closest('.input-group').find('.QtyBtnDrop');

    $dropdownButton.text(selectedUnit);
});

$(document).off('click', '.RowMinus').on('click', '.RowMinus', function () {
    var $input = $(this).closest('.qty-group').find('input');
    var currentValue = parseInt($input.val(), 10);
    const row = $(this).closest('tr');
    if (currentValue > 1) {
        $input.val(currentValue - 1);
        updateSelectionSummary($("#ProductListTable"));

    }

   
});
$(document).off('input', '.QtyProductAdd').on('input', '.QtyProductAdd', function () {
    const row = $(this).closest('tr');
    const data = row.data('product-info');
    const Qty = parseInt($(this).val() || 0);
    let stock = parseInt(row.find('.remaining-stock').text().trim());
   
    let pathPart = window.location.pathname.split('/')[1];
    if (pathPart == 'Sale') {
        quantitycheck(row, Qty, stock);
    }
    updateSelectionSummary($("#ProductListTable"));
});


function quantitycheck(row, Qty, stock) {
    if (Qty > stock) {
        const $qtyInput = row.find('.QtyProductAdd');
        $qtyInput.val(stock);
        Common.warningMsg("Quantity cannot exceed available stock (" + stock + ")");
    }
}



$(document).off('click', '.RowPlus').on('click', '.RowPlus', function () {
    var $input = $(this).closest('.qty-group').find('input');
    var currentValue = parseInt($input.val() || 0, 10);
    const row = $(this).closest('tr');
    $input.val(currentValue + 1);

    let pathPart = window.location.pathname.split('/')[1];
    if (pathPart == 'Sale') {
        const Qty = parseInt(row.find('.QtyProductAdd').val() || 0);
        let stock = parseInt(row.find('.remaining-stock').text().trim());
        quantitycheck(row, Qty, stock);
    }
    updateSelectionSummary($("#ProductListTable"));
});

$(document).on('change', '.additemdrop', function () {
    let rowElement = $(this).closest('tr');
    let selectedUnit = parseInt($(this).val());
    let productData = rowElement.data('product-info');

    var mainTable = $('#SaleProductTable');
    Inventory.updateSellingPriceBasedOnUnit(selectedUnit, rowElement, productData, mainTable);
    updateSelectionSummary($("#ProductListTable"));
});


$(document).on('click', '.addQtyBtn', function () {
    $(this).closest('tr').find('input[type="checkbox"]').prop('checked', true);
    updateSelectionSummary($("#ProductListTable"));
});


$(document).on('change', 'input[type="checkbox"]', function () {
    if ($(this).is(':checked')) {

        $(this).closest('tr').find('.OtyColumn').removeClass('d-none');
        $(this).closest('tr').find('.addQtyBtn').hide();
    } else {

        $(this).closest('tr').find('.OtyColumn').addClass('d-none');
        $(this).closest('tr').find('.addQtyBtn').show();
    }
    updateSelectionSummary($("#ProductListTable"));
});


function applyFilters() {
    let textFilterValue = $('#AdditemSearch').val().toLowerCase();
    let categoryFilterValue = $('#Category').val()?.toLowerCase() || "";
    let brandFilterValue = $('#Brand').val()?.toLowerCase() || "";
    let visibleRowCount = 0;

    $('#product-table-body tr').each(function () {
        let rowText = $(this).text().toLowerCase();

        let matchesTextFilter = !textFilterValue || rowText.includes(textFilterValue);
        let matchesCategoryFilter = !categoryFilterValue || categoryFilterValue === "-- select --" || rowText.includes(categoryFilterValue);
        let matchesBrandFilter = !brandFilterValue || brandFilterValue === "-- select --" || rowText.includes(brandFilterValue);

        let isVisible = matchesTextFilter && matchesCategoryFilter && matchesBrandFilter;
        $(this).toggle(isVisible);

        if (isVisible) {
            visibleRowCount++;
        }
    });

    $('.AllProductEmptyRow').toggle(visibleRowCount === 0);
}


$(document).on('input', '#AdditemSearch', function () {

    applyFilters();
});



$(document).on('click', '#AddNewProduct', function () {
    ProductCanvasOpen();
});
$(document).on('click', '#addnewProductInBarcodePage', function () {
    ProductCanvasOpen();
});
function ProductCanvasOpen() {
    $('#DiscountValue').text('')
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#openCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#openCanvas").css("width", "60%");
    } else {
        $("#openCanvas").css("width", "40%");
    }
    $('.content-overlay').fadeIn();

}




