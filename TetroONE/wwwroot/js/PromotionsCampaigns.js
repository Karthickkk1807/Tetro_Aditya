var crmId = 0;
var titleForHeaderTab = "All";
var moduleName;
$(document).ready(function () {
    // Update the time when the page loads
    CRMGrid();
    updateTime();
    var StoreId = parseInt(localStorage.getItem('StoreId'));
    //bindDropDown(StoreId,'ProductTypesMulti', 'FormCRM', 'Product'); 
    Common.bindDropDownParent('CRMTypeId', 'FormCRM', 'CRMTypes');
    //Common.bindDropDown(StoreId, 'CRMAmountId', 'CRMAmount');
    $('#UncheckProduct').prop('checked', true);
    $('#UncheckProductForFestival').prop('checked', true);
    $('#ClientEmail').prop('disabled', true);
    $('#CRMAmountId').prop('disabled', true);
    $('#CRMTypeId').val(null).trigger('change');
    $('.CommentLable').text('Comments');
    $('#Comments').attr('placeholder', 'Ex: Dear Enter Your [CRMTypes Name], I hope...');
    //Common.ajaxCall("GET", "CRM/GETCRM/", { ModuleName: "All", CRMId: null }, CRMMainGridSuccess, null);

    $('#CRMMainTable tbody td:last-child').css('display', 'none');
    $('#CRMMainTable_wrapper > div.dataTables_scroll > div.dataTables_scrollHead > div > table > thead > tr > th.sorting_disabled').css('display', 'none');

    CurrentDateStartDate();

    //For In Email CC & BCC
    $('#LabelCC').click(function () {
        $('#CCDiv').toggle();
    });

    $('#LabebCC').click(function () {
        $('#BCCDiv').toggle();
    });


    //For In Email Contact Filter To Send Email
    $(document).on('change', '#ContactFilterId', function () {
        $('#ClientEmail').val(null).trigger('change');
        $('#CRMAmountId').prop('disabled', false);
        if ($(this).val() == '1') {
            $('#PurshaseAmountShow').show();
        }
        else if ($(this).val() == '2') {
            $('#PurshaseAmountShow').hide();
        }
        else if ($(this).val() == '0' || $(this).val() == null) {
            $('#CRMAmountId').prop('disabled', true);
            $('#ClientEmail').val(null).trigger('change');
        }
    });

    //For In Email Contact Filter To Send What'sApp
    $(document).on('change', '#ContactFilterIdWhatsApp', function () {
        $('#CRMAmountIdWhatsApp').val(null).trigger('change');
        $('#CRMAmountIdWhatsApp').prop('disabled', false);
        if ($(this).val() == '1') {
            $('#PurshaseAmountWhatsappShow').show();
        }
        else if ($(this).val() == '2') {
            $('#PurshaseAmountWhatsappShow').hide();
        }
        else if ($(this).val() == '0' || $(this).val() == null) {
            $('#CRMAmountIdWhatsApp').prop('disabled', true);
            $('#CRMAmountIdWhatsApp').val(null).trigger('change');
        }
    });


    /*For the Tick Mark*/
    $(".badge").click(function () {
        // Hide all tick marks within the same card
        /* $(this).closest('.info-card-body').find('.tickMark').hide();*/

        // Show the tick mark next to the clicked badge
        $(this).siblings('.tickMark').show();
    });


    /*Click the Pop To add the record the Grid*/
    $(document).on('click', '#AddCampaigns', function () {

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#openCanvasCRMInsertUpdate").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#openCanvasCRMInsertUpdate").css("width", "50%");
        } else {
            $("#openCanvasCRMInsertUpdate").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('.HeaderText').text('Add CRM');
        $('.info-card-body').removeClass('show'); // Remove 'show' class
        $('.info-card-body').addClass('info-card-body'); // Ensure the class is there
        $('#CRMModel').modal('show');
        $('#SaveClient').text('Save');
        $('#SaveClient').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        DisplayNone();
        $('#CRMTypeId').val('').trigger('change'); 
        $('#SaveClient').css('color', 'white');
        $('#CRMTypeId').prop('disabled', false);
        crmId = 0;
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#openCanvasCRMInsertUpdate").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    /*Click CRMTypeId in Pop Hide and Show The Wanted and Unwanted*/
    $(document).on('change', '#CRMTypeId', function () {
        //$('#ProductTypesMulti').val(null).trigger('change');
        var CRMTypesChange = $(this).val();
        if (CRMTypesChange == '1') {
            inputValEmpty();
            $('#UpcomingProductsShow').show();
            $('#StartDateShow').show();
            $('#OfferPriceShow').show();
            $('#ProductTypesMultiShow').hide();
            $('#ProductTypesShow').hide();
            $('#ProductPriceShow').hide();
            $('#UncheckProductShow').hide();
            $('#TableShowBuyOneDiscount').hide();
            $('#UncheckFestivalShow').hide();
            $('#TableShowFestival').hide();
            $('#TableShowGetOneDiscount').hide();
            $('#ActualPriceShow').hide();
            $('#EndDateShow').hide();
            $('#TableShowDiscount').hide();
            $('.titleforprice').text('Product Price');
            $('.CommentLable').text('Comments');
            $('.titleforProduct').text('Upcoming Product');

            $('#Discount').attr('placeholder', 'Ex: 100/-');
            $('#Name').attr('placeholder', 'Ex: Traditional Appam 1 kg');
            $('#Comments').attr('placeholder', 'Ex: Describe the product features...');
            $('#Discount').prop('disabled', false);
            CurrentDateStartDate();
            $('#tablFilter').val('');
            $('#tableFilter5').val('');
            $('#tableFilter4').val('');
            $('#tableFilter2').val('');
        }
        else if (CRMTypesChange == '2') {
            inputValEmpty();
            $('.titleforprice').text('Discount %');
            $('#UpcomingProductsShow').show();
            $('#ProductTypesShow').hide();
            $('#ProductTypesMultiShow').hide();
            $('#UncheckFestivalShow').hide();
            $('#ProductPriceShow').show();
            $('#ActualPriceShow').hide();
            $('#UncheckProductShow').hide();
            $('#TableShowBuyOneDiscount').hide();
            $('#TableShowGetOneDiscount').hide();
            $('#TableShowFestival').hide();
            $('#OfferPriceShow').hide();
            $('#StartDateShow').show();
            $('#EndDateShow').show();
            $('#TableShowDiscount').show();
            $('.CommentLable').text('Comments');
            $('.titleforProduct').text('Discount Name');

            $('#Name').attr('placeholder', 'Ex: BigDiscount');
            $('#FormCRM #Discount').attr('placeholder', 'Ex: 100/-');
            $('#Discount').attr('placeholder', 'Ex: 100/- or 100%');
            $('#Comments').attr('placeholder', 'Ex: Enter discount Percentage and Amount...');
            $('#FormCRM #Discount').prop('disabled', false);
            CurrentDateStartDate();

            $('#tablFilter').val('');
            $('#tableFilter5').val('');
            $('#tableFilter4').val('');
            $('#tableFilter2').val('');

            var editeDateOfTable = { ModuleName: $('#CRMTypeId option:selected').text() }
            Common.ajaxCall("GET", "/CRM/GETDiscountAndFestivalOffersProductCRM", editeDateOfTable, GETDiscountAndFestivalOffersProductSuccess, null);
        }
        else if (CRMTypesChange == '3') {
            inputValEmpty();
            $('#UpcomingProductsShow').show();
            $('#ProductPriceShow').show();
            $('#OfferPriceShow').show();
            $('#StartDateShow').show();
            $('#EndDateShow').show();
            $('#ProductTypesShow').hide();
            $('#UncheckProductShow').hide();
            $('#UncheckFestivalShow').hide();
            $('#TableShowDiscount').hide();
            $('#ProductTypesMultiShow').show();
            $('#TableShowBuyOneDiscount').hide();
            $('#TableShowGetOneDiscount').hide();
            $('#TableShowFestival').show();
            $('#ActualPriceShow').hide();
            $('.titleforprice').text('Actual Price');
            $('.titleforProduct').text('Offer Name');
            $('#FormCRM #Discount').prop('disabled', true);

            $('#FormCRM #Discount').attr('placeholder', 'Ex: 100/-');
            $('#Discount').attr('placeholder', 'Ex: 100/-');
            $('.CommentLable').text('Comments');
            $('#Name').attr('placeholder', 'Ex: Festival Combo');
            $('#Comments').attr('placeholder', 'Ex: Add any special terms...');
            //var discount = $('#FormCRM #Discount').val();
            //var offerPrice = $('#OfferPrice').val();
            //if (discount > offerPrice) {
            //    Common.warningMsg('To Email is not filled. Please provide a valid email address.');
            //    console.log('To Email is not filled. Please provide a valid email address.');
            //}
            //else {

            $('#tablFilter').val('');
            $('#tableFilter5').val('');
            $('#tableFilter4').val('');
            $('#tableFilter2').val('');

            CurrentDateStartDate();
            var editeDateOfTable = { ModuleName: $('#CRMTypeId option:selected').text() }
            Common.ajaxCall("GET", "/CRM/GETDiscountAndFestivalOffersProductCRM", editeDateOfTable, GETFestivalOffersProductSuccess, null);

        }
        else if (CRMTypesChange == '4') {
            inputValEmpty();
            $('#UpcomingProductsShow').show();
            $('#ProductPriceShow').hide();
            $('#OfferPriceShow').show();
            $('#StartDateShow').show();
            $('#EndDateShow').show();
            $('#ProductTypesShow').hide();
            $('#UncheckProductShow').hide();
            $('#ProductTypesMultiShow').hide();
            $('#UncheckFestivalShow').hide();
            $('#TableShowFestival').hide();
            $('#TableShowDiscount').hide();
            $('#TableShowBuyOneDiscount').show();
            $('#TableShowGetOneDiscount').show();
            $('#ActualPriceShow').show();
            $('.titleforprice').text('Product Price');
            $('.titleforProduct').text('Buy 1 Get 1 Name');
            $('.CommentLable').text('Invite Comments');
            $('#ActualPrice').prop('disabled', true);
            $('#Name').attr('placeholder', 'Ex: Get One, Gift One!');
            $('#Comments').attr('placeholder', 'Ex: Enter a special greeting (e.g., Happy Diwali!)...');
            $('#Discount').prop('disabled', false);

            $('#tablFilter').val('');
            $('#tableFilter5').val('');
            $('#tableFilter4').val('');
            $('#tableFilter2').val('');

            CurrentDateStartDate();
            var editeDateOfTable = { ModuleName: $('#CRMTypeId option:selected').text() }
            Common.ajaxCall("GET", "/CRM/GETDiscountAndFestivalOffersProductCRM", editeDateOfTable, GETDiscountAndFestivalOffersProductGetBuySuccess, null);
        }
        else if (CRMTypesChange == '5') {
            inputValEmpty();
            $('#UpcomingProductsShow').show();
            $('#ProductPriceShow').hide();
            $('#OfferPriceShow').hide();
            $('#StartDateShow').show();
            $('#EndDateShow').show();
            $('#ProductTypesShow').hide();
            $('#UncheckProductShow').hide();
            $('#UncheckFestivalShow').hide();
            $('#ProductTypesMultiShow').hide();
            $('#TableShowBuyOneDiscount').hide();
            $('#TableShowGetOneDiscount').hide();
            $('#TableShowFestival').hide();
            $('#TableShowDiscount').hide();
            $('#ActualPriceShow').hide();
            $('.titleforprice').text('Product Price');
            $('.titleforProduct').text('Wishes Name');
            $('.CommentLable').text('Invite Comments');
            $('#Discount').prop('disabled', false);

            $('#tablFilter').val('');
            $('#tableFilter5').val('');
            $('#tableFilter4').val('');
            $('#tableFilter2').val('');

            CurrentDateStartDate();
            $('#Name').attr('placeholder', 'Ex: Diwali Wishes Name');
            $('#Comments').attr('placeholder', 'Ex: Enter a special greeting (e.g., Happy Diwali!)...');
        }
        else if (CRMTypesChange == '--Select--' || 'null') {
            inputValEmpty();
            DisplayNone();
            $('.CommentLable').text('Comments');
            $('#Comments').attr('placeholder', 'Ex: Dear Enter Your [CRMTypes Name], I hope...');
        }
    });

    //For Multiple Select the input
    //$(document).on('change', '#ProductTypesMulti', function () {
    //    $('#ActualPrice').val('');
    //    var ProductTypesMultiIdArray = [];
    //    var selectedValues = $(this).val();

    //    if (Array.isArray(selectedValues) && selectedValues.length > 0) {
    //        ProductTypesMultiIdArray = selectedValues
    //            .map(function (value) {
    //                return parseInt(value.trim(), 10);
    //            })
    //            .filter(function (value) {
    //                return !isNaN(value);
    //            });
    //        ProductTypesMultiMapping = ProductTypesMultiIdArray.map(function (productId) {
    //            return {
    //                ActualProductPriceId: null,
    //                ProductId: productId,
    //            };
    //        });
    //    }
    //    Common.ajaxCall("GET", "/CRM/ActualProductPriceDetails", { actualProductPriceDetails_CRM: JSON.stringify(ProductTypesMultiMapping) }, ProductPriceSuccess, null);
    //});


    /* For bind the Values of input on click the checkBox or input valuse Binding */
    $(document).on('input', '#Discount', function () {
        console.log("Input event triggered");
        offerPriceDetails();
    });
    $('#DiscountTable').on('click', '.tableCheckProduct', function () {
        offerPriceDetails();
    });

    $('#FestivalTable').on('click', '.tableCheckProductFestival', function () {
        ActualPriceDetailsForFestival();
        //var row = $(this).closest('tr');
        //var actualPrice = row.find("td:last").text().trim();
    });

    $('#FestivalTable').on('input', '.qty-FestivalOffer', function () {
        ActualPriceDetailsForFestival();
    });

    $('#BuyOneTable').on('click', '.tableCheckProduct', function () {
        ActualPriceDetailsForBuy1Get1();
    });

    $('#BuyOneTable').on('input', '.qty-Buy1Get1', function () {
        ActualPriceDetailsForBuy1Get1();
    });

    $('#GetOneTable').on('click', '.tableCheckProduct', function () {
        ActualPriceDetails();
    });
    /* For bind the Values of input on click the checkBox or input valuse Binding */


    /*For click the save button record add*/
    $(document).on('click', '#SaveClient', function () {

        var $this = $('#SaveClient').text();
        if ($this == "Save") {
            Common.successMsg("Compaigns Added Successfully.");
        } else {
            Common.successMsg("Updated Compaigns Successfully.");
        }
        $("#openCanvasCRMInsertUpdate").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
         
        //CurrentDateStartDateEdite();
        //if ($('#FormCRM').valid()) {
        //    var objvalue = {}
        //    if ($('#CRMTypeId option:selected').text() == 'Upcoming Product') {
        //        objvalue.ModuleName = $('#CRMTypeId option:selected').text();
        //        objvalue.CRMId = crmId > 0 ? crmId : 0;
        //        objvalue.CRMTypeId = parseInt($('#CRMTypeId').val());
        //        objvalue.Name = $('#Name').val();
        //        objvalue.OfferPrice = $('#OfferPrice').val();
        //        objvalue.StartDate = $('#StartDate').val();
        //        objvalue.Comments = $('#Comments').val();

        //        Common.ajaxCall("POST", "/CRM/InsertCRM", JSON.stringify(objvalue), InsertSuccess, null);
        //    } else if ($('#CRMTypeId option:selected').text() == 'Discount') {
        //        if ($('.tableCheckProduct:checked').length === 0) {
        //            Common.warningMsg('Select at least One Product in table!');
        //            return false;
        //        }
        //        var cRMProductMapping = [];
        //        $('#DiscountTable .tableCheckProduct:checked').each(function () {
        //            var productId = parseInt($(this).closest('tr').find('td:first').text());
        //            cRMProductMapping.push({
        //                CRMProductMappingId: null,
        //                CRMId: null,
        //                ProductId: productId,
        //                Quantity: null,
        //                IsActive: true
        //            });
        //        });

        //        objvalue.ModuleName = $('#CRMTypeId option:selected').text();
        //        objvalue.CRMId = crmId > 0 ? crmId : 0;
        //        objvalue.CRMTypeId = parseInt($('#CRMTypeId').val());
        //        objvalue.Name = $('#Name').val();
        //        objvalue.Discount = $('#FormCRM #Discount').val();
        //        objvalue.StartDate = $('#StartDate').val();
        //        objvalue.EndDate = $('#EndDate').val();
        //        objvalue.Comments = $('#Comments').val();
        //        objvalue.CRMProductMappingDetails = cRMProductMapping;

        //        Common.ajaxCall("POST", "/CRM/InsertCRM", JSON.stringify(objvalue), InsertSuccess, null);
        //    }
        //    else if ($('#CRMTypeId option:selected').text() == 'Festival Offer') {
        //        var cRMProductMapping = [];
        //        $('#FestivalTable .tableCheckProductFestival:checked').each(function () {
        //            var quantity = $(this).closest('tr').find('.qty-FestivalOffer').val().trim();
        //            // Check if the quantity is valid, otherwise default to 0
        //            if (!quantity || isNaN(quantity)) {
        //                quantity = 0; // Default to 0 if invalid
        //            } else {
        //                quantity = parseFloat(quantity);
        //            }
        //            var productId = parseInt($(this).closest('tr').find('td:first').text());
        //            cRMProductMapping.push({
        //                CRMProductMappingId: null,
        //                CRMId: null,
        //                ProductId: productId,
        //                Quantity: quantity,
        //                IsActive: true
        //            });
        //        });

        //        objvalue.ModuleName = $('#CRMTypeId option:selected').text();
        //        objvalue.CRMId = crmId > 0 ? crmId : 0;
        //        objvalue.CRMTypeId = parseInt($('#CRMTypeId').val());
        //        objvalue.Name = $('#Name').val();
        //        objvalue.OfferPrice = $('#OfferPrice').val();
        //        objvalue.StartDate = $('#StartDate').val();
        //        objvalue.EndDate = $('#EndDate').val();
        //        objvalue.Comments = $('#Comments').val();
        //        objvalue.CRMProductMappingDetails = cRMProductMapping;

        //        Common.ajaxCall("POST", "/CRM/InsertCRM", JSON.stringify(objvalue), InsertSuccess, null);
        //    }
        //    else if ($('#CRMTypeId option:selected').text() == 'Buy 1 Get 1') {
        //        var cRMProductBuyMappingDetails = [];
        //        var cRMProductGetMappingDetails = [];
        //        $('#BuyOneTable .tableCheckProduct:checked').each(function () {
        //            var productId = parseInt($(this).closest('tr').find('td:first').text());
        //            cRMProductBuyMappingDetails.push({
        //                CRMId: null,
        //                BuyProductId: productId,
        //                BuyProductIsActive: true,
        //                BuyQuantity: parseFloat($(this).closest('tr').find('.qty-Buy1Get1').val()),
        //            });
        //        });

        //        $('#GetOneTable .tableCheckProduct:checked').each(function () {
        //            var productId = parseInt($(this).closest('tr').find('td:first').text());
        //            cRMProductGetMappingDetails.push({
        //                CRMId: null,
        //                GetProductId: productId,
        //                GetProductIsActive: true,
        //                GetQuantity: parseFloat($(this).closest('tr').find('.qty-Buy1Get1').val()),
        //            });
        //        });

        //        objvalue.ModuleName = $('#CRMTypeId option:selected').text();
        //        objvalue.CRMId = crmId > 0 ? crmId : 0;
        //        objvalue.CRMTypeId = parseInt($('#CRMTypeId').val());
        //        objvalue.Name = $('#Name').val();
        //        objvalue.OfferPrice = $('#OfferPrice').val();
        //        objvalue.StartDate = $('#StartDate').val();
        //        objvalue.EndDate = $('#EndDate').val();
        //        objvalue.Comments = $('#Comments').val();
        //        objvalue.CRMProductBuyMappingDetails = cRMProductBuyMappingDetails;
        //        objvalue.CRMProductGetMappingDetails = cRMProductGetMappingDetails;


        //        Common.ajaxCall("POST", "/CRM/InsertCRM_Buy1_Get1_OfferDetails", JSON.stringify(objvalue), InsertSuccess, null);
        //    }

        //    else if ($('#CRMTypeId option:selected').text() == 'Wishes') {
        //        objvalue.ModuleName = $('#CRMTypeId option:selected').text();
        //        objvalue.CRMId = crmId > 0 ? crmId : 0;
        //        objvalue.CRMTypeId = parseInt($('#CRMTypeId').val());
        //        objvalue.Name = $('#Name').val();
        //        objvalue.StartDate = $('#StartDate').val();
        //        objvalue.EndDate = $('#EndDate').val();
        //        objvalue.Comments = $('#Comments').val();

        //        Common.ajaxCall("POST", "/CRM/InsertCRM", JSON.stringify(objvalue), InsertSuccess, null);

        //        //if (crmId > 0) {
        //        //    Common.ajaxCall("POST", "/CRM/InsertCRM", JSON.stringify(objvalue), InsertSuccess, null);
        //        //    Common.ajaxCall("POST", "/CRM/InsertCRM", JSON.stringify(objvalue), InsertSuccess, null);
        //        //}
        //        //else {
        //        //    var crmId = Common.askConfirmation(); {
        //        //        if (crmId > 0) {
        //        //            Common.ajaxCall("POST", "/CRM/InsertCRM", JSON.stringify(objvalue), InsertSuccess, null);
        //        //        }
        //        //    }
        //        //}
        //    }
        //}
    });
    /*For click the save button record add*/

    $(document).on('click', '#Cancel', function () {
        $('#CRMModel').modal('hide');
        $('#CRMTypeId').val('').trigger('change');
    });

    $(document).on('click', '#SelectAllProduct', function () {
        if ($(this).prop('checked')) {
            $('.tableCheckProduct').each(function () {
                $(this).prop('checked', true);
                offerPriceDetails();
            });
        }
        else {
            $('.tableCheckProduct').each(function () {
                $(this).prop('checked', false);
                $('#DiscountTable tbody tr').find('td:last').empty();
            });
        }
    });

    //$(document).on('click', '#UncheckProduct', function () {
    //    if ($(this).is(':checked')) {
    //        $('#DiscountTable tbody tr').show();
    //    } else {
    //        $('#DiscountTable tbody tr').hide();
    //    }
    //});


    //===================SHOE HIDE THE CLOSEST ROW OF TABLE==================//
    $(document).on('click', '#UncheckProduct', function () {
        var moduleName = $('#CRMTypeId option:selected').text();
        var isChecked = $(this).is(':checked');
        if (moduleName == 'Discount') {
            $('.tableCheckProduct').each(function () {
                if (isChecked) {
                    if (!$(this).is(':checked')) {
                        $(this).closest('tr').hide();
                    }
                } else {
                    $(this).closest('tr').show();
                }
            });
        }
    });

    $(document).on('click', '#UncheckProductForFestival', function () {
        var moduleNames = $('#CRMTypeId option:selected').text();
        var Checked = $(this).is(':checked');
        if (moduleNames == 'Festival Offer') {
            $('.tableCheckProductFestival').each(function () {
                if (Checked) {
                    if (!$(this).is(':checked')) {
                        $(this).closest('tr').hide();
                    }
                } else {
                    $(this).closest('tr').show();
                }
            });
        }
    });

    //===================SHOE HIDE THE CLOSEST ROW OF TABLE==================//

    $(document).on('click', '.email-badge', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#openCanvasCRMEmail").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#openCanvasCRMEmail").css("width", "60%");
        } else {
            $("#openCanvasCRMEmail").css("width", "32%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#buttonText #SendButton').html('Send Email');
        $('#Subject').text('Upcoming Product');
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#openCanvasCRMEmail").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    //$(document).on('click', '.whatsapp-badge', function () {
    //    var windowWidth = $(window).width();
    //    if (windowWidth <= 600) {
    //        $("#openCanvasDemo").css("width", "95%");
    //    } else if (windowWidth <= 992) {
    //        $("#openCanvasDemo").css("width", "60%");
    //    } else {
    //        $("#openCanvasDemo").css("width", "32%");
    //    }
    //    $('.content-overlay').fadeIn();
    //    $('#FormWhatsAppDetails #WhatsAppBody').empty();
    //});

    //$(document).on('click', '#CloseCanvas', function () {
    //    $("#openCanvasDemo").css("width", "0%");
    //    $('.content-overlay').fadeOut();
    //    $('#FormWhatsAppDetails #WhatsAppBody').empty();
    //});


    $(document).on('click', '.whatsapp-badge', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#openCanvasCRMWhatsapp").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#openCanvasCRMWhatsapp").css("width", "60%");
        } else {
            $("#openCanvasCRMWhatsapp").css("width", "32%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        //$('#FormWhatsAppDetails #WhatsAppBody').empty();
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#openCanvasCRMWhatsapp").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        //$('#FormWhatsAppDetails #WhatsAppBody').empty();
    });
    ///===============================off-canvas============================//

    $(document).on('click', '.navbar-tab', function () {

        titleForHeaderTab = $(this).text().trim();
        $('.navbar-tab').removeClass('active');
        // Find the tab that matches the titleForHeaderTab and add the 'active' class
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderTab) {
                $(this).addClass('active');
            }
        });
        $('#MineAttendanceData').empty('');
        var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                            <table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive" style="max-height:200px" id="CRMMainTable">
                            </table>
                        </div>
                     </div>`;
        $('#MineAttendanceData').append(html);
        //Common.ajaxCall("GET", "CRM/GETCRM/", { ModuleName: titleForHeaderTab, CRMId: null }, CRMMainGridSuccess, null);
    });

    $(document).on('click', '#SendButtonWhatsApp', function () {
        //$('#SendButtonWhatsApp').css('background', 'rgb(49, 206, 54)');
        //var EditDataId = { ModuleName: titleForHeaderTab, CRMId: crmId };
        //$.ajax({
        //    url: '/CRM/GetCRM_PDF',
        //    type: 'GET',
        //    data: EditDataId,
        //    dataType: 'json', // Change the dataType based on your response type
        //    success: function (response) {
        //        if (response.success) {
        //            var downloadLink = document.createElement('a');
        //            downloadLink.href = 'data:application/pdf;base64,' + response.fileContent;

        //            var currentDate = new Date();
        //            var formattedDate = currentDate.toLocaleString().replace(/[\/,\s:]/g, '_');
        //            downloadLink.download = 'CRM_PDF_' + formattedDate + '.pdf'; // Update the filename

        //            downloadLink.click();
        //        } else {
        //            // Handle the case where the server-side PDF generation fails
        //            alert(response.message || 'Failed to generate CRM PDF');
        //        }
        //    },
        //    error: function () {
        //        // Handle AJAX error
        //        alert('Error occurred while making the AJAX request');
        //    }
        //});
        $("#openCanvasCRMWhatsapp").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.successMsg("What'sApp Massage Sended Successfully.");
    });

    //$(document).on('click', '#SendButtonSumma', function () {
    //    $("#openCanvasDemo").css("width", "0%");
    //    $('.content-overlay').fadeOut();
    //    Common.successMsg("What'sApp Massage Sended Successfully.");
    //});

});

function CRMGrid() {
    $('#MineAttendanceData').empty('');
    var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                            <table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive" style="max-height:200px" id="CRMMainTable">
                            </table>
                        </div>
                     </div>`;
    $('#MineAttendanceData').append(html);

    const crmData = [
        {
            CRMId: '1',
            ModuleName: 'Upcoming Product',
            Type: 'Upcoming Product',
            Name: 'Testing CRM For Upcoming',
            Discount: '-',
            OfferPrice: '₹ 1000.00',
            StartDate: '06-10-2025',
            EndDate: '-',
            Comments: 'Limited time Pongal discount offer'
        },
        {
            CRMId: '2',
            ModuleName: 'Discount',
            Type: 'Discount',
            Name: 'Diwali Discount Offer',
            Discount: '10%',
            OfferPrice: '₹ 900.00',
            StartDate: '01-10-2025',
            EndDate: '10-10-2025',
            Comments: 'Limited time Diwali discount offer'
        },
        {
            CRMId: '3',
            ModuleName: 'Festival Offer',
            Type: 'Festival Offer',
            Name: 'Pongal Special Bundle',
            Discount: '15%',
            OfferPrice: '₹ 850.00',
            StartDate: '12-01-2025',
            EndDate: '18-01-2025',
            Comments: 'Special bundle for Pongal festival'
        },
        {
            CRMId: '4',
            ModuleName: 'Buy 1 Get 1',
            Type: 'Buy 1 Get 1',
            Name: 'Shampoo Buy 1 Get 1 Free',
            Discount: '50%',
            OfferPrice: '₹ 150.00',
            StartDate: '05-11-2025',
            EndDate: '15-11-2025',
            Comments: 'Limited time B1G1 offer on select products'
        },
        {
            CRMId: '5',
            ModuleName: 'Wishes',
            Type: 'Wishes',
            Name: 'Deepavali Wishes Campaign',
            Discount: '-',
            OfferPrice: '-',
            StartDate: '06-11-2025',
            EndDate: '07-11-2025',
            Comments: 'Sending Deepavali greetings to all customers'
        },
        {
            CRMId: '6',
            ModuleName: 'Festival Offer',
            Type: 'Festival Offer',
            Name: 'Christmas Combo Pack',
            Discount: '20%',
            OfferPrice: '₹ 1200.00',
            StartDate: '20-12-2025',
            EndDate: '26-12-2025',
            Comments: 'Celebrate Christmas with our special combo'
        },
        {
            CRMId: '7',
            ModuleName: 'Upcoming Product',
            Type: 'Upcoming Product',
            Name: 'New Year Special Product Launch',
            Discount: '-',
            OfferPrice: '₹ 2000.00',
            StartDate: '01-01-2026',
            EndDate: '-',
            Comments: 'Launching our brand new product line for 2026'
        }
    ];

    const crmColumns = [
        { data: 'Type', name: 'Type', title: 'Type' },
        { data: 'Name', name: 'Name', title: 'Name' },
        { data: 'Discount', name: 'Discount', title: 'Discount' },
        { data: 'OfferPrice', name: 'OfferPrice', title: 'Offer Price' },
        { data: 'StartDate', name: 'StartDate', title: 'Start Date' },
        { data: 'EndDate', name: 'EndDate', title: 'End Date' },
        { data: 'Comments', name: 'Comments', title: 'Comments' }
    ];

    bindTableMainGrid('CampaignsTable', crmData, crmColumns, 7, null, true, '380px');
}

function CRMMainGridSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[0], ['ModuleName', 'CRMId', 'CRMTypeId']);
        $('#MineAttendanceData').empty('');
        var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                            <table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive" style="max-height:200px" id="CampaignsTable">
                            </table>
                        </div>
                     </div>`;
        $('#MineAttendanceData').append(html);

        bindTableMainGrid('CampaignsTable', data[0], columns, -1, 'CRMId', true, '380px');
    } else {
        CRMGrid();
    }
}


//function offerPriceDetails() {

//    var firstCellValue = $('#DiscountTable tbody tr:first td:first').text();
//    if (firstCellValue != "No records found") {
//        var dataVal = [];

//        $('#DiscountTable tbody tr').each(function () {
//            var checkboxVal = $(this).find('.tableCheckProduct').prop('checked');
//            if (checkboxVal) {
//                var productId = $(this).find('td:first').text();
//               var offerPrice =  $(this).find('td:last').text();
//                dataVal.push({
//                    ActualProductPriceId: null,
//                    ProductId: parseInt(productId),
//                });
//            }
//        });
//        Common.ajaxCall("GET", "/CRM/GetOfferPriceDetails", { offerPriceDetails: JSON.stringify(dataVal), Discount: parseFloat($('#Discount').val()) }, OfferSuccess , null);

//    }
//}


/* For bind the Values of input on click the checkBox or input valuse Binding */
function offerPriceDetails() {
    var firstCellValue = $('#DiscountTable tbody tr:first td:first').text();
    if (firstCellValue != "No records found") {
        var dataVal = [];

        $('#DiscountTable tbody tr').each(function () {
            var checkboxVal = $(this).find('.tableCheckProduct').prop('checked');

            if (checkboxVal) {
                var productId = $(this).find('.productId').text();
                var offerPriceSelector = $(this).find('td:last'); // Keep the selector
                dataVal.push({
                    ActualProductPriceId: null,
                    ProductId: parseInt(productId),
                    OfferPriceSelector: offerPriceSelector // Store the selector
                });
            }
            else {
                $(this).find('td:last').text('');
            }
        });

        Common.ajaxCall("GET", "/CRM/GetOfferPriceDetails", {
            offerPriceDetails: JSON.stringify(dataVal),
            Discount: parseFloat($('#FormCRM #Discount').val())
        }, function (response) {
            OfferSuccess(response, dataVal); // Pass dataVal to OfferSuccess
        }, null);
    }
}
function OfferSuccess(response, dataVal) {
    if (response.status) {
        var responseData = JSON.parse(response.data);
        var offerPrices = responseData[0];

        dataVal.forEach(function (item, index) {
            if (offerPrices[index].OfferPrice !== "") {
                item.OfferPriceSelector.text(offerPrices[index].OfferPrice);
            } else if (offerPrices[index].OfferPrice == "") {
                item.OfferPriceSelector.text('');
            }

        });
    }
}

function ActualPriceDetails() {
    var firstCellValue = $('#DiscountTable tbody tr:first td:first').text();
    if (firstCellValue != "No records found") {
        var dataVal = [];

        $('#DiscountTable tbody tr').each(function () {
            var checkboxVal = $(this).find('.tableCheckProductFestival').prop('checked');
            if (checkboxVal) {
                var productId = $(this).find('.productId').text();
                dataVal.push({
                    CRMProductMappingId: null,
                    CRMId: null,
                    ProductId: parseInt(productId),
                    IsActive: true,
                });
            }
        });

        Common.ajaxCall("GET", "/CRM/GetActualProductPrice", { cRMProductMapingDetails: JSON.stringify(dataVal) }, function (response) {
            if (response.status) {
                var responseData = JSON.parse(response.data);
                $('#Discount').val(responseData[0][0].ActualPrice);
            }
        }, null);
    }
}

function ActualPriceDetailsForFestival() {
    var firstCellValue = $('#FestivalTable tbody tr:first td:first').text();
    if (firstCellValue != "No records found") {
        var dataVal = [];

        $('#FestivalTable tbody tr').each(function () {
            var checkboxVal = $(this).find('.tableCheckProductFestival').prop('checked');
            if (checkboxVal) {
                var productId = $(this).find('.productId').text();
                var Qty = $(this).find('.qty-FestivalOffer').val();
                dataVal.push({
                    CRMProductMappingId: null,
                    CRMId: null,
                    ProductId: parseInt(productId),
                    Quantity: parseFloat(Qty),
                    IsActive: true,
                });
            }
        });

        Common.ajaxCall("GET", "/CRM/GetActualProductPrice", { cRMProductMapingDetails: JSON.stringify(dataVal) }, function (response) {
            if (response.status) {
                var responseData = JSON.parse(response.data);
                $('#FormCRM #Discount').val(responseData[0][0].ActualPrice);
            }
        }, null);
    }
}

function ActualPriceDetailsForBuy1Get1() {
    var firstCellValue = $('#BuyOneTable tbody tr:first td:first').text();
    if (firstCellValue != "No records found") {
        var dataVal = [];

        $('#BuyOneTable tbody tr').each(function () {
            var checkboxVal = $(this).find('.tableCheckProduct').prop('checked');
            if (checkboxVal) {
                var productId = $(this).find('.productId').text();
                var Qty = $(this).find('.qty-Buy1Get1').val();
                dataVal.push({
                    CRMId: null,
                    BuyProductId: parseInt(productId),
                    BuyProductIsActive: checkboxVal ? true : false,
                    BuyQuantity: parseFloat(Qty),
                });
            }
        });

        Common.ajaxCall("GET", "/CRM/GetActualProductPricForBuy1Get1", { cRMProductBuyMappingDetails: JSON.stringify(dataVal) }, function (response) {
            if (response.status) {
                var responseData = JSON.parse(response.data);
                $('#ActualPrice').val(responseData[0][0].ActualPrice);
            }
        }, null);
    }
}
/* For bind the Values of input on click the checkBox or input valuse Binding */

//function ActualPriceDetailsForBuy1Get1() {
//    var firstCellValue = $('#BuyOneTable tbody tr:first td:first').text();
//    if (firstCellValue != "No records found") {
//        var dataVal = [];

//        $('#BuyOneTable tbody tr').each(function () {
//            var checkboxVal = $(this).find('.tableCheckProduct').prop('checked');
//            if (checkboxVal) {
//                var productId = $(this).find('.productId').text();
//                dataVal.push({
//                    CRMId: null,
//                    BuyProductId: parseInt(productId),
//                    BuyProductIsActive: checkboxVal ? true : false,
//                    BuyQuantity: null,
//                });
//            }
//        });

//        // Send data as JSON
//        $.ajax({
//            type: "GET", // Use GET or POST depending on your design
//            url: "/CRM/GetActualProductPricForBuy1Get1",
//            data: JSON.stringify({ crmProductBuyMappingDetails: dataVal }), // Send JSON data
//            contentType: "application/json", // Set content type to application/json
//            success: function (response) {
//                if (response.status) {
//                    var responseData = JSON.parse(response.data);
//                    $('#ActualPrice').val(responseData[0][0].ActualPrice);
//                }
//            },
//            error: function (e) {
//                // Handle errors here if needed
//                console.error("Request failed", e);
//            }
//        });
//    }
//}

function InsertSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#openCanvasCRMInsertUpdate").css("width", "0%");
        $('.content-overlay').fadeOut();
        $('#MineAttendanceData').empty('');
        var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                            <table class="table  table-hover  table-head-bg-primary basic-datatables tableHeaderResponsive" style="max-height:200px" id="CampaignsTable">
                            </table>
                        </div>  
                     </div>`;
        $('#MineAttendanceData').append(html);
        titleForHeaderTab = $('.navbar-tab').closest('.active').text();
        //Common.ajaxCall("GET", "CRM/GETCRM/", { ModuleName: titleForHeaderTab, CRMId: null }, CRMMainGridSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

var titleText;
function toggleCard(header) {
    const card = header.parentElement; // Get the parent card
    const body = card.querySelector('.info-card-body');
    const arrow = header.querySelector('.arrow');

    body.classList.toggle('show');
    arrow.classList.toggle('show-arrow');

    titleText = $(header).find('.Title').text();
    Common.ajaxCall("GET", "CRM/GETCRM/", { ModuleName: titleText, CRMId: null }, CRMSuccess, null);
}



function CRMSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var moduleTable;
        if (titleText == 'Upcoming Product') {
            moduleTable = $('#dynamicUpcomingProduct');
            $('#dynamicUpcomingProduct').empty('');

        }
        else if (titleText == 'Discount') {
            moduleTable = $('#dynamicDiscount');
            $('#dynamicDiscount').empty('');
        }
        else if (titleText == 'Festival Offer') {
            moduleTable = $('#dynamicFestivalOffers');
            $('#dynamicFestivalOffers').empty('');
        }
        else if (titleText == 'Buy 1 Get 1') {
            moduleTable = $('#dynamicBuy1Get1');
            $('#dynamicBuy1Get1').empty('');
        }
        else if (titleText == 'Wishes') {
            moduleTable = $('#dynamicWishes');
            $('#dynamicWishes').empty('');
        }

        if (data[0][0].CRMId == null || data[0][0].CRMId === "") {
            var html = `
                <img src="/moduleimages/payroll/norecord.svg" style="position: absolute;width: 22px;top: 55px;left: 185px;"><h3 style="margin-top: -2px;margin-bottom: -9px;font-size: 14px;display: flex;justify-content: center;color: red;">No Record Found !</h3>
                `;
            moduleTable.append(html);
        }
        else {
            $.each(data[0], function (index, value) {

                var html = `<div class="row mt-1">
                            <div class="col-6">
                                <span class="name">${value.Name}</span>
                            </div>
                             <div class="col-1 m-auto" style="margin-right: -14px !important;">
                                <i class="far fa-edit" onclick="EditSuccess('${value.ModuleName}','${value.CRMId}')"></i>
                            </div>
                            <div class="col-1 m-auto" style="margin-right: -14px !important;">
                                <i class="far fa-trash-alt btn-delete" onclick="DeleteSuccess('${value.ModuleName}','${value.CRMId}')"></i>
                            </div>
                            <div class="col-2 m-auto">
                                <span class="badge whatsapp-badge" style="background-color: #25d366; border-color: #25d366;" onclick="WhatsAppSuccess('${value.ModuleName}','${value.CRMId}')">WhatsApp</span>
                                <span class="tickMark" style="display:none; position: absolute; top: -4px; left: 44px; font-size: 19px; color: black;">✔️</span>
                            </div>
                            <div class="col-2 m-auto">
                                <span class="badge email-badge" style="background-color: #24acf2; border-color: #24acf2;" onclick="EmailSuccess('${value.ModuleName}','${value.CRMId}')">Email</span>
                                <span class="tickMark" style="display:none; position: absolute; top: -4px; left: 28px; font-size: 19px; color: black;">✔️</span>
                            </div>
                        </div>
                        <div class="border mt-2"></div>`;
                moduleTable.append(html);
            });
        }
    }
}
function DisplayNone() {
    $('#UpcomingProductsShow').hide();
    $('#ProductTypesShow').hide();
    $('#ProductTypesMultiShow').hide();
    $('#UncheckProductShow').hide();
    $('#ProductPriceShow').hide();
    $('#ActualPriceShow').hide();
    $('#OfferPriceShow').hide();
    $('#StartDateShow').hide();
    $('#EndDateShow').hide();
    $('#TableShowDiscount').hide();
    $('#TableShowGetOneDiscount').hide();
    $('#TableShowBuyOneDiscount').hide();
    $('#TableShowFestival').hide();
}

function inputValEmpty() {
    $('#Name').val('');
    $('#Discount').val('');
    $('#ActualPrice').val('');
    $('#OfferPrice').val('');
    $('#StartDate').val('');
    $('#EndDate').val('');
    $('#Comments').val('');
}

function ProductPriceSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        if ($('#CRMTypeId').val() == '2') {
            $('#ActualPrice').val(data[0][0].SellingPrice);
        } else {
            $('#ProductPrice').val(data[0][0].SellingPrice);
        }
    }
}

function EditSuccess(ModuleName, Id) {

    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#openCanvasCRMInsertUpdate").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#openCanvasCRMInsertUpdate").css("width", "50%");
    } else {
        $("#openCanvasCRMInsertUpdate").css("width", "39%");
    }
     
    $('#fadeinpage').addClass('fadeoverlay');

    $('.HeaderText').text('Edit CRM'); 
    $('#SaveClient').text('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');

    crmId = parseInt(Id);
    moduleName = ModuleName;
    if (moduleName == 'Discount') {
        //CurrentDateStartDateEdite();
        $('#UncheckProductShow').show();
        $('#UncheckProduct').prop('checked', true);
    }
    else if (moduleName == 'Festival Offer') {
        //CurrentDateStartDateEdite();
        $('#UncheckFestivalShow').show();
        $('#UncheckProductForFestival').prop('checked', true);
    }
    else {
        $('#UncheckProduct').hide();
        //CurrentDateStartDateEdite();
    }

    // Map text to corresponding value
    var moduleMap = {
        "Upcoming Product": "1",
        "Discount": "2",
        "Festival Offer": "3",
        "Buy 1 Get 1": "4",
        "Wishes": "5"
    };

    // Set select value and trigger change if match found
    if (moduleMap.hasOwnProperty(ModuleName)) {
        $('#CRMTypeId').val(moduleMap[ModuleName]).trigger('change');
    }
}

//function EditSuccess(ModuleName, Id) {
//    var windowWidth = $(window).width();
//    if (windowWidth <= 600) {
//        $("#openCanvasCRMInsertUpdate").css("width", "95%");
//    } else if (windowWidth <= 992) {
//        $("#openCanvasCRMInsertUpdate").css("width", "60%");
//    } else {
//        $("#openCanvasCRMInsertUpdate").css("width", "43%");
//    }
//    $('.content-overlay').fadeIn();

//    crmId = parseInt(Id);
//    moduleName = ModuleName;
//    if (moduleName == 'Discount') {
//        CurrentDateStartDateEdite();
//        $('#UncheckProductShow').show();
//        $('#UncheckProduct').prop('checked', true);
//    }
//    else if (moduleName == 'Festival Offer') {
//        CurrentDateStartDateEdite();
//        $('#UncheckFestivalShow').show();
//        $('#UncheckProductForFestival').prop('checked', true);
//    }
//    else {
//        $('#UncheckProduct').hide();
//        CurrentDateStartDateEdite();
//    }
//    if (moduleName == 'Festival Offer') {
//        Common.ajaxCall("GET", "/CRM/GETCRM/", { ModuleName: ModuleName, CRMId: Id }, CrmEditSuccessForFestivelOffer, null);
//    }
//    else if (moduleName == 'Buy 1 Get 1') {
//        Common.ajaxCall("GET", "/CRM/GETCRM/", { ModuleName: ModuleName, CRMId: Id }, CrmEditSuccessForBuyOneGetOne, null);
//    }
//    else {
//        Common.ajaxCall("GET", "/CRM/GETCRM/", { ModuleName: ModuleName, CRMId: Id }, CrmEditSuccess, null);
//    }
//}


async function DeleteSuccess(ModuleName, Id) {
    var response = await Common.askConfirmation(); {
        if (response == true) { 
            Common.successMsg("Deleted Successfully.");
            //Common.ajaxCall("GET", "/CRM/DeleteCRM", { CRMId: Id }, SuccessDelete, null);
            //moduleName = $('.navbar-tab').closest('.active').text();
        }
    }
}

function SuccessDelete(response) {
    if (response.status) {
        Common.successMsg(response.message);
        //Common.ajaxCall("GET", "CRM/GETCRM/", { ModuleName: moduleName, CRMId: null }, CRMMainGridSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

function CrmEditSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[1]) {
            var selectedValues = data[1].map(item => item.ProductId.toString());
            $('#ProductTypesMulti').val(selectedValues).trigger('change');
        }
        $('#CRMModel').modal('show');
        $('#SaveClient').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
        $('#SaveClient').val('Update');
        $('#SaveClient').css('color', 'white');
        Common.bindParentData(data[0], 'FormCRM');
        CurrentDateStartDateEdite();
        var checkBox = data[1];
        setTimeout(function () {
            $('#DiscountTable .tableCheckProduct').each(function () {
                var productId = $(this).closest('.d-flex').find('.productId').text();

                var product = checkBox.find(item => item.ProductId === parseInt(productId));
                //if (product) {
                //    $(this).prop('checked', product.IsActive === 1);
                //}
                if (product) {
                    $(this).prop('checked', product.IsActive === 1);
                    if (product.IsActive === 0) {
                        $(this).closest('tr').hide();
                    } else {
                        $(this).closest('tr').show();
                    }
                }
            });
            offerPriceDetails();
        }, 400);

        if (data[0][0].CRMTypeId == 2) {
            $('#UncheckProductShow').show();
            $('#UncheckProduct').prop('checked', true);
        }
        else {
            $('#UncheckProduct').hide();
        }
        $('#CRMTypeId').prop('disabled', true);
        $('#Discount').prop('disabled', false);
    }
}

function CrmEditSuccessForFestivelOffer(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[1]) {
            var selectedValues = data[1].map(item => item.ProductId.toString());
            $('#ProductTypesMulti').val(selectedValues).trigger('change');
        }
        $('#CRMModel').modal('show');
        $('#btnSave').css('background-color', 'orange');
        $('#btnSave').val('Update');
        $('#btnSave').css('color', 'white');
        CurrentDateStartDateEdite();
        Common.bindParentData(data[0], 'FormCRM');
        $('#FormCRM #Discount').val(data[2][0].SellingPrice);
        var checkBox = data[1];
        setTimeout(function () {
            $('#FestivalTable .tableCheckProductFestival').each(function () {
                var productId = $(this).closest('.d-flex').find('.productId').text();

                var product = checkBox.find(item => item.ProductId === parseInt(productId));
                //if (product) {
                //    $(this).prop('checked', product.IsActive === 1);
                //}
                if (product) {
                    $(this).prop('checked', product.IsActive === 1);
                    $(this).closest('tr').find('.qty-FestivalOffer').val(product.Quantity);
                    if (product.IsActive === 0) {
                        $(this).closest('tr').hide();
                    } else {
                        $(this).closest('tr').show();
                    }
                }
            });
        }, 400);

        if (data[0][0].CRMTypeId == 3) {
            $('#UncheckFestivalShow').show();
            $('#UncheckProductForFestival').prop('checked', true);
        }
        else {
            $('#UncheckProductForFestival').hide();
        }
        $('#CRMTypeId').prop('disabled', true);
    }
}

function CrmEditSuccessForBuyOneGetOne(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        $('#CRMModel').modal('show');
        $('#btnSave').css('background-color', 'orange');
        $('#btnSave').val('Update');
        $('#btnSave').css('color', 'white');
        Common.bindParentData(data[0], 'FormCRM');
        CurrentDateStartDateEdite();
        $('#ActualPrice').val(data[3][0].SellingPrice);
        var checkBoxBuyOne = data[1];
        setTimeout(function () {
            $('#BuyOneTable .tableCheckProduct').each(function () {
                var buyProductId = $(this).closest('.d-flex').find('.productId').text();

                var buyProduct = checkBoxBuyOne.find(item => item.BuyProductId === parseInt(buyProductId));
                //if (product) {
                //    $(this).prop('checked', product.IsActive === 1);
                //}
                if (buyProduct) {
                    $(this).prop('checked', buyProduct.IsActive === true);
                    $(this).closest('tr').find('.qty-Buy1Get1').val(buyProduct.BuyQuantity);
                    if (buyProduct.IsActive === false) {
                        $(this).closest('tr').hide();
                    } else {
                        $(this).closest('tr').show();
                    }

                }
            });
            ActualPriceDetails();
        }, 400);

        var checkBoxGetOne = data[2];
        setTimeout(function () {
            $('#GetOneTable .tableCheckProduct').each(function () {
                var getProductId = $(this).closest('.d-flex').find('.productId').text();

                var getProduct = checkBoxGetOne.find(item => item.GetProductId === parseInt(getProductId));
                //if (product) {
                //    $(this).prop('checked', product.IsActive === 1);
                //}
                if (getProduct) {
                    $(this).prop('checked', getProduct.IsActive === true);
                    $(this).closest('tr').find('.qty-Buy1Get1').val(getProduct.GetQuantity);
                    if (getProduct.IsActive === false) {
                        $(this).closest('tr').hide();
                    } else {
                        $(this).closest('tr').show();
                    }
                }
            });
        }, 400);

        if (data[0][0].CRMTypeId == 4) {
            $('#UncheckProductShow').show();
            $('#UncheckProduct').prop('checked', true);
        }
        else {
            $('#UncheckProduct').hide();
        }
        $('#CRMTypeId').prop('disabled', true);
    }
}

/*for Disount Table Binding */
var ProductId = 0;
function GETDiscountAndFestivalOffersProductSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[1], []);
        bindTableDiscount('DiscountTable', data[1], columns, -1, 'ProductId', true, '50vh');
        $('#TableShowDiscount').show();
    }
}

/*for Festival Offer Table Binding */
function GETFestivalOffersProductSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[1], []);
        bindTableProductFestivelOffer('FestivalTable', data[1], columns, -1, 'ProductId', true, '50vh');
        $('#TableShowFestival').show();
    }
}

/*for Buy 1 Get 1 Table Binding */
function GETDiscountAndFestivalOffersProductGetBuySuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[1], ['', 'Brand', 'Category', 'ActualPrice']);
        bindTableforBuyOneGetOne('BuyOneTable', data[1], columns, -1, 'ProductId', true, '50vh');
        bindTableforBuyOneGetOne('GetOneTable', data[1], columns, -1, 'ProductId', true, '50vh');
    }
}

/*Select Dropdown */
//function bindDropDown(storeId,id, parentId, moduleName) {

//    var request = {
//        moduleName: moduleName,
//        storeId: storeId
//    };
//    $.ajax({
//        type: 'POST',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        url: '/Common/GetDropdownDetails',
//        data: JSON.stringify(request),
//        success: function (response) {
//            if (response.status == true) {
//                bindDropDownSuccess(response.data, id, parentId);
//            }
//        },
//        error: function (response) {

//        },
//    });
//}

/*multiple select */
//function bindDropDownSuccess(response, controlid, parent) {
//    var $dropdown = $('#' + parent + ' #' + controlid);
//    $dropdown.empty();
//    if (response != null) {
//        var data = JSON.parse(response);
//        var dataValue = data[0];
//        if (dataValue != null && dataValue.length > 0 && !dataValue[0].hasOwnProperty('tetropaynocount')) {
//            var valueproperty = Object.keys(dataValue[0])[0];
//            var textproperty = Object.keys(dataValue[0])[1];
//            $('#' + parent + ' #' + controlid).empty();
//            $('#' + parent + ' #' + controlid).append($('<option>', {
//                value: ''
//            }));
//            $.each(dataValue, function (index, item) {
//                $('#' + parent + ' #' + controlid).append($('<option>', {
//                    value: item[valueproperty],
//                    text: item[textproperty],
//                }));
//            });
//        }
//    }
//}

/*===================================================================for emojiPicker====================================================================*/
document.getElementById('emojiBtn').addEventListener('click', function () {
    const picker = document.getElementById('emojiPicker');
    picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
});

function insertEmoji(emoji) {
    const textarea = document.getElementById('Comments');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    // Insert emoji at cursor position
    textarea.value = textarea.value.substring(0, startPos) + emoji + textarea.value.substring(endPos);

    // Move the cursor after the inserted emoji
    textarea.selectionStart = textarea.selectionEnd = startPos + emoji.length;
    textarea.focus();

    // Hide the emoji picker after selecting
    document.getElementById('emojiPicker').style.display = 'none';
}

// Optional: Hide the emoji picker when clicking outside of it
document.addEventListener('click', function (event) {
    const emojiPicker = document.getElementById('emojiPicker');
    if (!emojiPicker.contains(event.target) && event.target.id !== 'emojiBtn') {
        emojiPicker.style.display = 'none';
    }
});

/*===================================================================for emojiPicker====================================================================*/
/*for Disount Table */
function bindTableDiscount(tableid, data, columns, actionTarget, editcolumn, isAction, scrollpy) {

    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "tetroposnocount");
    var tetroposnocount = data[0].hasOwnProperty('tetroposnocount');

    var CheckBoxColumnIndex = columns.findIndex(column => column.data === "ProductName");

    if (!tetroposnocount) {
        if (CheckBoxColumnIndex > -1) {
            columns[CheckBoxColumnIndex].title = columns[CheckBoxColumnIndex].title + ' <div class=""><input class="" id="SelectAllProduct" type="checkbox"> </div>';
        }
    }

    var renderColumn = [
        {
            "targets": CheckBoxColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.ProductName != null && row.ProductName.length > 0) {
                    var dataText = row.ProductName;
                    var htmlContent = '';
                    htmlContent = htmlContent + '<div class="d-flex"><label class="d-none productId">' + row.ProductId + '</label><input class="tableCheckProduct" type="checkbox" id="ForCheckProducts" />&nbsp;' + dataText + '</div>';

                    return htmlContent;
                }
                return data;
            }
        }
    ];

    var table = $('#' + tableid).DataTable({
        "dom": "Bfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !tetroposnocount ? data : [],
        "language": {
            "emptyTable": '<div><img  src="/moduleimages/norecord.svg"  style="margin-right: 10px;">No records found</div>'
        },
        "columns": columns,
        "destroy": true,
        "columnDefs": !tetroposnocount ? renderColumn : [],
        "scrollCollapse": true,
        // For Pagination
        "paging": false,
        "pageLength": 5,
        "lengthMenu": [5, 10, 50],
        "info": false,
        "scrollX": true,
        "dom": '<"top"lf>rt<"bottom"ip><"clear">',
        "scrollY": scrollpy,
        "sScrollX": "100%",
        "scrollX": true,
        "scroller": true,
        "aaSorting": [],
        "oSearch": { "bSmart": false, "bRegex": true },
        "ordering": false,
        "initComplete": function (settings, json) {

            // Generate a unique ID for the custom button based on the table ID
            var buttonId = 'customBtn_' + tableid;


            $('#' + tableid + '_length').css('display', 'none');

            $('#' + tableid + '_info').css('margin-left', '1rem');

            $('#' + tableid + '_paginate').css({
                'margin-bottom': '0.1rem',
                'margin-right': '0.1rem'
            });


            $('#' + tableid + '_wrapper table').css({
                'text-align': 'left',
                'padding-left': '10px'
            });

            $('#' + tableid + '_wrapper').css('margin-bottom', '0.5rem');

            $('#' + tableid + '_wrapper div.dataTables_filter input').css({
                'width': '150px',
                'height': '30px',
                'margin-left': '0px',
                'margin-right': '30px',
                'background-color': 'rgb(240,240,240)',
                'margin-top': '10px',
                'margin-bottom': '10px'
            });

            $('#' + tableid + '_wrapper div.dataTables_filter input').css('padding-left', '0.5rem');

            $('#' + tableid + '_wrapper.no-footer .dataTables_scrollBody').css('border-bottom', 'none');


        },
        "drawCallback": function (settings) {
            var api = this.api();
            var pageInfo = api.page.info();
            var currentPage = pageInfo.page + 1;
            var totalPages = pageInfo.pages;


            var paginationControl = $('#' + tableid + '_paginate');
            paginationControl.empty();


            if (totalPages > 1) {
                paginationControl.append(`
                <ul class="pagination">
                    <li class="paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}" id="${tableid}_previous">
                        <a href="#" class="page-link" tabindex="0">Previous</a>
                    </li>
                    <li class="paginate_button page-item active">
                        <a href="#" class="page-link">${currentPage}</a>
                    </li>
                    <li class="paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}" id="${tableid}_next">
                        <a href="#" class="page-link" tabindex="0">Next</a>
                    </li>
                </ul>
            `);
            }
        }

    });


    $(document).on('click', `#${tableid}_previous`, function (e) {
        e.preventDefault();
        var pageInfo = table.page.info();
        var currentPage1 = pageInfo.page + 1;
        if (currentPage1 > 1) {
            table.page(currentPage1 - 2).draw(false);
        }
    });

    $(document).on('click', `#${tableid}_next`, function (e) {
        e.preventDefault();
        var pageInfo = table.page.info();
        var currentPage = pageInfo.page + 1;
        if (currentPage < pageInfo.pages) {
            table.page(currentPage).draw(false);
        }
    });
    $('#tableFilter1').on('keyup', function () {
        table.search($(this).val()).draw();
    });
}
/*for Festival Offer Table*/
function bindTableProductFestivelOffer(tableid, data, columns, actionTarget, editcolumn, isAction, scrollpy) {

    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "tetroposnocount");
    var tetroposnocount = data[0].hasOwnProperty('tetroposnocount');

    var CheckBoxColumnIndex = columns.findIndex(column => column.data === "ProductName");

    //// Ensure each row has the 'qty' property, otherwise set to 0 or a default value
    //data.forEach(row => {
    //    if (!row.hasOwnProperty('qty')) {
    //        row.qty = '';  // Or set to '0', or any default value
    //    }
    //});

    // Add a "Qty" column to the end of the columns array
    columns.push({
        "data": "qty", // Data field for Qty
        "title": "Qty", // Column title for Qty
        "render": function (data, type, row, meta) {
            if (type === 'display') {
                // Ensure "qty" always has a value, defaulting to empty if not present
                return `<input type="text" class="qty-FestivalOffer" value="${data || ''}" oninput="Common.allowOnlyNumberLength(this,6)" />`;
            }
            return data;
        }
    });

    var renderColumn = [
        {
            "targets": CheckBoxColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.ProductName != null && row.ProductName.length > 0) {
                    var dataText = row.ProductName;
                    var htmlContent = '';
                    htmlContent = htmlContent + '<div class="d-flex"><label class="d-none productId">' + row.ProductId + '</label><input class="tableCheckProductFestival" type="checkbox" id="ForCheckProducts" />&nbsp;' + dataText + '</div>';
                    return htmlContent;
                }
                return data;
            }
        }
    ];

    // Ensure the "qty" field exists in every row
    data = data.map(function (item) {
        // If the qty field is missing or undefined, add it with an empty string or 0
        item.qty = item.qty || '';  // Default to empty string if missing
        return item;
    });

    var table = $('#' + tableid).DataTable({
        "dom": "Bfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !tetroposnocount ? data : [],
        "language": {
            "emptyTable": '<div><img  src="/moduleimages/norecord.svg"  style="margin-right: 10px;">No records found</div>'
        },
        "columns": columns,
        "destroy": true,
        "columnDefs": !tetroposnocount ? renderColumn : [],
        "scrollCollapse": true,
        // For Pagination
        "paging": false,
        "pageLength": 5,
        "lengthMenu": [5, 10, 50],
        "info": false,
        "scrollX": true,
        "dom": '<"top"lf>rt<"bottom"ip><"clear">',
        "scrollY": scrollpy,
        "sScrollX": "100%",
        "scrollX": true,
        "scroller": true,
        "aaSorting": [],
        "oSearch": { "bSmart": false, "bRegex": true },
        "ordering": false,
        "initComplete": function (settings, json) {

            // Generate a unique ID for the custom button based on the table ID
            var buttonId = 'customBtn_' + tableid;

            $('#' + tableid + '_length').css('display', 'none');

            $('#' + tableid + '_info').css('margin-left', '1rem');

            $('#' + tableid + '_paginate').css({
                'margin-bottom': '0.1rem',
                'margin-right': '0.1rem'
            });

            $('#' + tableid + '_wrapper table').css({
                'text-align': 'left',
                'padding-left': '10px'
            });

            $('#' + tableid + '_wrapper').css('margin-bottom', '0.5rem');

            $('#' + tableid + '_wrapper div.dataTables_filter input').css({
                'width': '150px',
                'height': '30px',
                'margin-left': '0px',
                'margin-right': '30px',
                'background-color': 'rgb(240,240,240)',
                'margin-top': '10px',
                'margin-bottom': '10px'
            });

            $('#' + tableid + '_wrapper div.dataTables_filter input').css('padding-left', '0.5rem');

            $('#' + tableid + '_wrapper.no-footer .dataTables_scrollBody').css('border-bottom', 'none');
        },
        "drawCallback": function (settings) {
            var api = this.api();
            var pageInfo = api.page.info();
            var currentPage = pageInfo.page + 1;
            var totalPages = pageInfo.pages;

            var paginationControl = $('#' + tableid + '_paginate');
            paginationControl.empty();

            if (totalPages > 1) {
                paginationControl.append(`
                    <ul class="pagination">
                        <li class="paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}" id="${tableid}_previous">
                            <a href="#" class="page-link" tabindex="0">Previous</a>
                        </li>
                        <li class="paginate_button page-item active">
                            <a href="#" class="page-link">${currentPage}</a>
                        </li>
                        <li class="paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}" id="${tableid}_next">
                            <a href="#" class="page-link" tabindex="0">Next</a>
                        </li>
                    </ul>
                `);
            }
        }
    });

    $(document).on('click', `#${tableid}_previous`, function (e) {
        e.preventDefault();
        var pageInfo = table.page.info();
        var currentPage1 = pageInfo.page + 1;
        if (currentPage1 > 1) {
            table.page(currentPage1 - 2).draw(false);
        }
    });

    $(document).on('click', `#${tableid}_next`, function (e) {
        e.preventDefault();
        var pageInfo = table.page.info();
        var currentPage = pageInfo.page + 1;
        if (currentPage < pageInfo.pages) {
            table.page(currentPage).draw(false);
        }
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });
}

/*for Buy 1 Get 1 Table Binding */
function bindTableforBuyOneGetOne(tableid, data, columns, actionTarget, editcolumn, isAction, scrollpy) {

    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "tetroposnocount");
    var tetroposnocount = data[0].hasOwnProperty('tetroposnocount');

    var CheckBoxColumnIndex = columns.findIndex(column => column.data === "ProductName");

    // Add a "Qty" column to the end of the columns array
    columns.push({
        "data": "qty", // Data field for Qty
        "title": "Qty", // Column title for Qty
        "render": function (data, type, row, meta) {
            if (type === 'display') {
                // Ensure "qty" always has a value, defaulting to empty if not present
                return `<input type="text" class="qty-Buy1Get1" value="${data || ''}" oninput="Common.allowOnlyNumberLength(this,6)" />`;
            }
            return data;
        }
    });

    var renderColumn = [
        {
            "targets": CheckBoxColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.ProductName != null && row.ProductName.length > 0) {
                    var dataText = row.ProductName;
                    var htmlContent = '';
                    htmlContent = htmlContent + '<div class="d-flex"><label class="d-none productId">' + row.ProductId + '</label><input class="tableCheckProduct" type="checkbox" id="ForCheckProducts" />&nbsp;' + dataText + '</div>';
                    return htmlContent;
                }
                return data;
            }
        }
    ];

    // Ensure the "qty" field exists in every row
    data = data.map(function (item) {
        // If the qty field is missing or undefined, add it with an empty string or 0
        item.qty = item.qty || '';  // Default to empty string if missing
        return item;
    });

    var table = $('#' + tableid).DataTable({
        "dom": "Bfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !tetroposnocount ? data : [],
        "language": {
            "emptyTable": '<div><img  src="/moduleimages/norecord.svg"  style="margin-right: 10px;">No records found</div>'
        },
        "columns": columns,
        "destroy": true,
        "columnDefs": !tetroposnocount ? renderColumn : [],
        "scrollCollapse": true,
        // For Pagination
        "paging": false,
        "pageLength": 5,
        "lengthMenu": [5, 10, 50],
        "info": false,
        "scrollX": true,
        "dom": '<"top"lf>rt<"bottom"ip><"clear">',
        "scrollY": scrollpy,
        "sScrollX": "100%",
        "scrollX": true,
        "scroller": true,
        "aaSorting": [],
        "oSearch": { "bSmart": false, "bRegex": true },
        "ordering": false,
        "initComplete": function (settings, json) {

            var buttonId = 'customBtn_' + tableid;
            $('#' + tableid + '_length').css('display', 'none');
            $('#' + tableid + '_info').css('margin-left', '1rem');
            $('#' + tableid + '_paginate').css({
                'margin-bottom': '0.1rem',
                'margin-right': '0.1rem'
            });
            $('#' + tableid + '_wrapper table').css({
                'text-align': 'left',
                'padding-left': '10px'
            });
            $('#' + tableid + '_wrapper').css('margin-bottom', '0.5rem');
            $('#' + tableid + '_wrapper div.dataTables_filter input').css({
                'width': '150px',
                'height': '30px',
                'margin-left': '0px',
                'margin-right': '30px',
                'background-color': 'rgb(240,240,240)',
                'margin-top': '10px',
                'margin-bottom': '10px'
            });
            $('#' + tableid + '_wrapper div.dataTables_filter input').css('padding-left', '0.5rem');
            $('#' + tableid + '_wrapper.no-footer .dataTables_scrollBody').css('border-bottom', 'none');
        },
        "drawCallback": function (settings) {
            var api = this.api();
            var pageInfo = api.page.info();
            var currentPage = pageInfo.page + 1;
            var totalPages = pageInfo.pages;

            var paginationControl = $('#' + tableid + '_paginate');
            paginationControl.empty();

            if (totalPages > 1) {
                paginationControl.append(`
                    <ul class="pagination">
                        <li class="paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}" id="${tableid}_previous">
                            <a href="#" class="page-link" tabindex="0">Previous</a>
                        </li>
                        <li class="paginate_button page-item active">
                            <a href="#" class="page-link">${currentPage}</a>
                        </li>
                        <li class="paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}" id="${tableid}_next">
                            <a href="#" class="page-link" tabindex="0">Next</a>
                        </li>
                    </ul>
                `);
            }
        }
    });

    $(document).on('click', `#${tableid}_previous`, function (e) {
        e.preventDefault();
        var pageInfo = table.page.info();
        var currentPage1 = pageInfo.page + 1;
        if (currentPage1 > 1) {
            table.page(currentPage1 - 2).draw(false);
        }
    });

    $(document).on('click', `#${tableid}_next`, function (e) {
        e.preventDefault();
        var pageInfo = table.page.info();
        var currentPage = pageInfo.page + 1;
        if (currentPage < pageInfo.pages) {
            table.page(currentPage).draw(false);
        }
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });
}

/*for Main Grid Table Binding */
function bindTableMainGrid(tableid, data, columns, actionTarget, editcolumn, isAction, scrollpy) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "tetroposnocount");
    var tetroposnocount = data[0].hasOwnProperty('tetroposnocount');

    if (isAction == true && data != null && data.length > 0 && !tetroposnocount) {
        columns.push({
            "data": "Action", "name": "Action", "autoWidth": true, "title": "Action", orderable: false
        });
    } else {

        columns.push({
            "data": "Action", "name": "Action", "autoWidth": true, "title": "Action", orderable: false, visible: false
        });

    }

    //var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

    var renderColumn = [
        //{
        //    "targets": StatusColumnIndex,
        //    render: function (data, type, row, meta) {
        //        if (type === 'display' && row.Status_Color != null && row.Status_Color.length > 0) {
        //            var dataText = row.Status;
        //            var statusColor = row.Status_Color.toLowerCase();
        //            var htmlContent = '';
        //            htmlContent = htmlContent + '<label" style="color:' + statusColor + ';">' + dataText + '</label>';

        //            return htmlContent;
        //        }
        //        return data;
        //    }
        //}
    ];
    
    renderColumn.push(
        {
            targets: actionTarget,
            render: function (data, type, row, meta) {
                return `
                <div class="d-flex">
                        <i class="far fa-edit pt-1 pr-1" onclick="EditSuccess('${row.ModuleName}','${row.CRMId}')" style="color: #657aa1;" title="Edit"></i>
                        <i class="far fa-trash-alt btn-delete pt-1 pl-1 pr-1" onclick="DeleteSuccess('${row.ModuleName}','${row.CRMId}')" style="color: red;" title="Delete"></i>
                        <i class="fab fa-whatsapp whatsapp-badge pt-1 pl-1 pr-1" onclick="WhatsAppSuccess('${row.ModuleName}','${row.CRMId}')" style="color: #21ee21;" title="Sending WhatsApp"></i>
                        <i class="fa fa-envelope email-badge pt-1 pl-1" onclick="EmailSuccess('${row.ModuleName}','${row.CRMId}')" style="color: #7d73ee;" title="Sending Email"></i>
                </div>
                `; 
            }
        }
    )
    
    var table = $('#' + tableid).DataTable({

        "dom": "Bfrtip",
        "bDestroy": true,
        "responsive": false,
        "data": !tetroposnocount ? data : [],
        "language": {
            "emptyTable": '<div><img  src="/moduleimages/payroll/norecord.svg"  style="margin-right: 10px;">No records found</div>'
        },
        "columns": columns,
        "destroy": true,
        "columnDefs": !tetroposnocount ? renderColumn : [],
        "scrollCollapse": true,
        // For Pagination
        "paging": true,
        "pageLength": 7,
        "lengthMenu": [7, 14, 21],
        "info": true,
        "scrollX": true,
        "dom": '<"top"lf>rt<"bottom"ip><"clear">',
        "scrollY": scrollpy,
        "sScrollX": "100%",
        "scrollX": true,
        "scroller": true,
        "aaSorting": [],
        "oSearch": { "bSmart": false, "bRegex": true },
        "initComplete": function (settings, json) {

            // Generate a unique ID for the custom button based on the table ID
            var buttonId = 'customBtn_' + tableid;

            // Append the button with the unique ID

            $('#' + tableid + '_length').css('display', 'none');

            $('#' + tableid + '_info').css('margin-left', '1rem');

            $('#' + tableid + '_paginate').css({
                'margin-bottom': '0.1rem',
                'margin-right': '0.1rem'
            });

            $('#' + tableid + '_wrapper table').css({
                'text-align': 'left',
                'padding-left': '10px'
            });

            $('#' + tableid + '_wrapper').css('margin-bottom', '0.5rem');



            $('#' + tableid + '_wrapper.no-footer .dataTables_scrollBody').css('border-bottom', 'none');


        },
        "drawCallback": function (settings) {
            var api = this.api();
            var pageInfo = api.page.info();
            var currentPage = pageInfo.page + 1;
            var totalPages = pageInfo.pages;


            var paginationControl = $('#' + tableid + '_paginate');
            paginationControl.empty();


            if (totalPages > 1) {
                paginationControl.append(`
                <ul class="pagination">
                    <li class="paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}" id="${tableid}_previous">
                        <a href="#" class="page-link" tabindex="0">Previous</a>
                    </li>
                    <li class="paginate_button page-item active">
                        <a href="#" class="page-link">${currentPage}</a>
                    </li>
                    <li class="paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}" id="${tableid}_next">
                        <a href="#" class="page-link" tabindex="0">Next</a>
                    </li>
                </ul>
                `);
            }
        }
    });


    $(document).on('click', `#${tableid}_previous`, function (e) {
        e.preventDefault();
        var pageInfo = table.page.info();
        var currentPage = pageInfo.page + 1;
        if (currentPage > 1) {
            table.page(currentPage - 2).draw(false);
        }
    });

    $(document).on('click', `#${tableid}_next`, function (e) {
        e.preventDefault();
        var pageInfo = table.page.info();
        var currentPage = pageInfo.page + 1;
        if (currentPage < pageInfo.pages) {
            table.page(currentPage).draw(false);
        }
    });
    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });


    var table = $('#' + tableid).DataTable();
    Common.autoAdjustColumns(table);

    /*For BackDrop*/
    $('.backdrop').hide();
}

/*==========================================================Email To Send CRM===============================================================*/


function EmailSuccess(moduleName, Id) {
    $('#buttonText #SendButton').val('Send Email');
    $('.info-card-body').removeClass('show'); // Remove 'show' class
    $('.info-card-body').addClass('info-card-body'); // Ensure the class is there
    $('.backdrop').show();
    $("#AttachmentArea").html('');
    Common.removevalidation('EmailDetailsForm');
    $("#CCDiv").hide();
    $("#BCCDiv").hide();

    if (moduleName === 'Upcoming Product' || moduleName === 'Wishes') {
        $('#FilterShow').hide();
    }
    else {
        $('#FilterShow').show();
    }

    var module = Id;

    if (module > 0) {
        var EditDataId = { ModuleName: moduleName, CRMId: module };
        if (moduleName == 'Discount') {
            Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetEmailToAddressDiscount, $('.backdrop').hide());
        }
        else if (moduleName == 'Upcoming Product') {
            Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetEmailToAddressUpcoming, $('.backdrop').hide());
        }
        else if (moduleName == 'Festival Offer') {
            Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetEmailToAddressFestivalOffers, $('.backdrop').hide());
        }
        else if (moduleName == 'Buy 1 Get 1') {
            Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetEmailToAddressBuyGet, $('.backdrop').hide());
        }
        else if (moduleName == 'Wishes') {
            Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetEmailToAddressWishes, $('.backdrop').hide());
        }

    } else {
        $('.backdrop').hide();
    }
}

function GetEmailToAddressUpcoming(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'EmailDetails');

        var companyName = data[0][0].CompanyName;
        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);


        //const emailList = data[1].map(value => value.ClientEmail).join('; ');
        //$("#ClientEmail").val(emailList);

        const EmailList = data[1]
            .map(value => value.ClientEmail)
            .filter(email => email !== "")
            .join('; ');

        $('#ClientEmail').val(EmailList);

        $("#EmailDetails #Subject").text(data[2][0].Subject);

        var info = data[2][0].Info;
        var emailbdy = data[2][0].EmailBody;
        var emailBodyThanks = data[2][0].EmailBodyThanks;
        var name = data[2][0].Name;
        var offerPrice = data[2][0].OfferPrice;
        var startDate = data[2][0].StartDate;
        var comments = data[2][0].Comments;

        var emailBody = `
            <div style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
               <div style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: large;">
                   Dear Customer,
               </div>
               <p class="" style="font-family:monospace;font-size:16px;font-weight:800;margin-top: 0px;margin-bottom: 0px;">
                   ${emailbdy}
               </p>
               <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
                   <h3 style="font-size: large; font-family: cursive; color: #d36915; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);margin-bottom: 0px;margin-top: 0px;">${info}</h3>
                   <p style="font-family: cursive;margin-top: 5px;"><b style="font-family: cursive;">Name :</b> ${name}</p>
                   <p style="font-family: cursive;"><b style="font-family: cursive;">Product Price :</b> ${offerPrice}</p>
                   <p style="font-family: cursive;"><b style="font-family: cursive;">Launch Date:</b> ${startDate}</p>
                   <p style="font-family: cursive;"><b style="font-family: cursive;">Comments:</b> ${comments}</p>
               </div>
               <div style="margin-top: 20px; font-size: 14px;">
                   <p style="color: #000000; font-size: 16px;font-family: cursive; font-size: larger;">
                        ${emailBodyThanks}
                   </p>
                   <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                       Best regards,
                   </h5>
                    <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                       ${companyName}
                   </h5>
               </div>
            </div>
        `;

        $("#EmailDetails #EMailBody").html(emailBody);

    }
}

function GetEmailToAddressWishes(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'EmailDetails');

        var companyName = data[0][0].CompanyName;
        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);

        //const EmailList = data[1].map(value => value.Email).join('; ');

        const EmailList = data[1]
            .map(value => value.Email)
            .filter(email => email !== "")
            .join('; ');

        $('#ClientEmail').val(EmailList);


        $("#EmailDetails #Subject").text(data[2][0].Subject);

        var comments = data[2][0].Comments;
        var emailbdy = data[2][0].EmailBody;
        var emailBodyThanks = data[2][0].EmailBodyThanks;
        var name = data[2][0].Name;

        var emailBody = `
        <div style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
            <div style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: large;">
               From Ganapathi Steels,
            </div>
            <p class="" style="font-size: large; font-family: cursive; color: #d36915; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); margin-bottom: 0px; margin-top: 0px;">
                ${name}
            </p>
            <p class="" style="font-family: monospace;">
                ${comments}
            </p>
            <p style="color: #000000; font-size: 16px;font-family: cursive; font-size: larger;">
                ${emailBodyThanks}
            </p>
            <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                Best regards,
            </h5>
            <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                ${companyName}
            </h5>
        </div>
        `;

        $("#EmailDetails #EMailBody").html(emailBody);

    }
}

function GetEmailToAddressDiscount(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'EmailDetails');

        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);

        $("#EmailDetails #Subject").text(data[1][0].Subject);

        var companyName = data[0][0].CompanyName;
        var startDate = data[1][0].StartDate;
        var endDate = data[1][0].EndDate;
        var discount = data[1][0].Discount;
        var emailbdy = data[1][0].EmailBody;
        var emailBodyThanks = data[1][0].EmailBodyThanks;
        var comments = data[1][0].Comments;
        var info = data[1][0].Info;


        var emailBody = `
         <div class="Hi" style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
            <div style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: large;">
                Dear Customer,
            </div>
            <p class="" style="font-family:monospace;font-size:16px;font-weight:800;margin-top: 0px;margin-bottom: 0px;">
                ${emailbdy}
            </p>
            <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h3 style="font-size: large; font-family: cursive; color: #d36915; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);margin-bottom: 0px;margin-top: 0px;">${info}</h3>
                <p style="font-family: cursive;margin-top: 5px;"><b style="font-family: cursive;">Discount           :</b> ${discount + '%'}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">Start Date        :</b> ${startDate}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">End Date:</b> ${endDate}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">Comments:</b> ${comments}</p>
                <div style="display: flex;width: 100%; margin-bottom: 5px;">
                    <!-- Product Table -->
                    <table style="font-family: monospace;border-collapse: collapse; width: 83%;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Product Name</th>
                                <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Actual Price</th>
                                <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Offer Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            `;

        // Create table rows for each product
        data[2].forEach(product => {
            emailBody += `
                            <tr>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.ProductName}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.ActualPrice + '/-'}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.OfferPrice + '/-'}</td>
                            </tr>
                            `;
        });

        emailBody += `
                        </tbody>
                    </table>
                </div>
            </div>
            <p style="color: #000000; font-size: 16px;font-family: cursive; font-size: larger;">
                ${emailBodyThanks}
            </p>
            <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                Best regards,
            </h5>
            <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                ${companyName}
            </h5>
        </div>    
`;
    }

    $("#EmailDetails #EMailBody").html(emailBody);
}

function GetEmailToAddressFestivalOffers(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'EmailDetails');

        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);

        $("#EmailDetails #Subject").text(data[1][0].Subject);

        var companyName = data[0][0].CompanyName;
        var startDate = data[1][0].StartDate;
        var endDate = data[1][0].EndDate;
        var name = data[1][0].Name;
        var offerPrice = data[1][0].OfferPrice;
        var emailbdy = data[1][0].EmailBody;
        var emailBodyThanks = data[1][0].EmailBodyThanks;
        var comments = data[1][0].Comments;
        var info = data[1][0].Info;
        var actualPrice = data[2][0].ActualPrice;

        var emailBody = `
         <div style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
            <div style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: large;">
                Dear Customer,
            </div>
            <p class="" style="font-family:monospace;font-size:16px;font-weight:800;margin-top: 0px;margin-bottom: 0px;">
                ${emailbdy}
            </p>
            <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h3 style="font-size: large; font-family: cursive; color: #d36915; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);margin-bottom: 0px;margin-top: 0px;">${info}</h3>
                <p style="font-family: cursive;margin-top: 5px;"><b style="font-family: cursive;">Name:</b> ${name}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">Product Price:</b>&nbsp;<del> ${'RS : ' + actualPrice + '/-'} </del> &nbsp;&nbsp;${'RS : ' + offerPrice + '/-'}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">Start Date:</b> ${startDate}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">End Date:</b> ${endDate}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">Comments:</b> ${comments}</p>
                <div style="display: flex;width: 100%; margin-bottom: 5px;">
                    <!-- Product Table -->
                    <table style="font-family: monospace;border-collapse: collapse; width: 83%;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Product Name - Qty</th>
                                <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Actual Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            `;

        // Create table rows for each product
        data[3].forEach(product => {
            emailBody += `
                            <tr>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.ProductName} - ${product.Quantity}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.ActualPrice + '/-'}</td>
                            </tr>
                            `;
        });

        emailBody += `
                        </tbody>
                    </table>
                </div>
            </div>
            <div style="margin-top: 20px; font-size: 14px;">
                   <p style="color: #000000; font-size: 16px;font-family: cursive; font-size: larger;">
                        ${emailBodyThanks}
                   </p>
                   <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                       Best regards,
                   </h5>
                    <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                       ${companyName}
                   </h5>
               </div>
        </div>
`;
    }

    $("#EmailDetails #EMailBody").html(emailBody);

}

function GetEmailToAddressBuyGet(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'EmailDetails');

        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);

        $("#EmailDetails #Subject").text(data[1][0].Subject);

        var companyName = data[0][0].CompanyName;
        var startDate = data[1][0].StartDate;
        var endDate = data[1][0].EndDate;
        var name = data[1][0].Name;
        var offerPrice = data[1][0].OfferPrice;
        var emailbdy = data[1][0].EmailBody;
        var emailBodyThanks = data[1][0].EmailBodyThanks;
        var comments = data[1][0].Comments;
        var buyInfo = data[1][0].BuyInfo;
        var getInfo = data[1][0].GetInfo;
        var detailsInfo = data[1][0].DetailsInfo;
        var offerPrice = data[1][0].OfferPrice;
        var sellingPrice = data[4][0].SellingPrice;

        var buyProductCount = data[5][0].BuyProductCount;
        var getProductCount = data[6][0].GetProductCount;

        var emailBody = `
         <div style="width: 97%; margin: auto; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; color: #333;">
            <div style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: large;">
                Dear Customer,
            </div>
            <p class="" style="font-family:monospace;font-size:16px;font-weight:800;margin-top: 0px;margin-bottom: 0px;">
                ${emailbdy}
            </p>
            <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h3 style="font-size: large; font-family: cursive; color: #d36915; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);margin-bottom: 0px;margin-top: 0px;">${buyInfo} ${buyProductCount} ${getInfo} ${getProductCount} ${detailsInfo}</h3>
                <p style="font-family: cursive;margin-top: 5px;"><b style="font-family: cursive;">Name:</b> ${name}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">Product Price:</b>&nbsp;<del> ${'RS : ' + sellingPrice + '/-'} </del> &nbsp;&nbsp;${'RS : ' + offerPrice + '/-'}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">Start Date:</b> ${startDate}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">End Date:</b> ${endDate}</p>
                <p style="font-family: cursive;"><b style="font-family: cursive;">Comments:</b> ${comments}</p>
                <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                       Buy Product :
                </h5>
                <div style="display: flex;width: 100%; margin-bottom: 5px;">
                    <!-- Product Table -->
                    <table style="font-family: monospace;border-collapse: collapse; width: 83%;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Product Name - Qty</th>
                                <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Actual Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            `;

        // Create table rows for each product
        data[2].forEach(Buyproduct => {
            emailBody += `
                            <tr>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${Buyproduct.ProductName} - ${Buyproduct.BuyQuantity}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${Buyproduct.SellingPrice + '/-'}</td>
                            </tr>
                            `;
        });

        emailBody += `
                        </tbody>
                    </table>
                </div>
                <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                      Get Product :
                </h5>
                <div style="display: flex;width: 100%; margin-bottom: 5px;">
                    <!-- Product Table -->
                    <table style="font-family: monospace;border-collapse: collapse; width: 83%;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Product Name - Qty</th>
                                <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Actual Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            `;

        // Create table rows for each product
        data[3].forEach(Getproduct => {
            emailBody += `
                            <tr>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${Getproduct.ProductName} - ${Getproduct.GetQuantity}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${Getproduct.SellingPrice + '/-'}</td>
                            </tr>
                            `;
        });

        emailBody += `
                        </tbody>
                    </table>
                </div>
            </div>
            <div style="margin-top: 20px; font-size: 14px;">
               <p style="color: #000000; font-size: 16px;font-family: cursive; font-size: larger;">
                     ${emailBodyThanks}
               </p>
               <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                   Best regards,
               </h5>
                <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                   ${companyName}
               </h5>
           </div>
        </div>
            </div>
        `;

        $("#EmailDetails #EMailBody").html(emailBody);


    }
}

$(document).on('change', '#ContactFilterId, #CRMAmountId', function () {
    var EditData = {
        ContactName: parseInt($('#ContactFilterId').val()),
        CRMPurchaseAmountId: parseInt($('#CRMAmountId').val())
    };

    if (EditData.ContactName === 0 || EditData.ContactName == null) {
        $('#CRMAmountId').prop('disabled', true);
        $('#ClientEmail').val('');
        $('#PurshaseAmountShow').show();
        $('#CRMAmountId').prop('disabled', true);
        return;
    }

    Common.ajaxCall("GET", "/CRM/GETEmailForClientVendor", EditData, GetContactEmailToMail, $('.backdrop').hide());
});

$(document).on('change', '#ContactFilterIdWhatsApp, #CRMAmountIdWhatsApp', function () {
    var EditData = {
        ContactName: parseInt($('#ContactFilterIdWhatsApp').val()),
        CRMPurchaseAmountId: parseInt($('#CRMAmountIdWhatsApp').val())
    };

    if (EditData.ContactName === 0 || EditData.ContactName == null) {
        $('#CRMAmountIdWhatsApp').prop('disabled', true);
        $('#ClientWhatsAppNo').val('');
        $('#id="PurshaseAmountWhatsappShow"').show();
        $('#CRMAmountIdWhatsApp').prop('disabled', true);
        return;
    }

    Common.ajaxCall("GET", "/CRM/GETEmailForClientVendor", EditData, GetContactToWhatsApp, $('.backdrop').hide());
});




//function GetContactEmailToMail(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        if (data[0][0].ClientEmail) {
//            const ClientEmail = data[0].map(value => value.ClientEmail).join('; ');
//            $('#ClientEmail').val(ClientEmail);
//        } else {
//            const VendorEmail = data[0].map(value => value.VendorEmail).join('; ');
//            $('#ClientEmail').val(VendorEmail);
//        }
//    }
//}

function GetContactEmailToMail(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        if (data[0][0].ClientEmail) {

            const ClientEmails = data[0]
                .map(value => value.ClientEmail)
                .filter(email => email !== "")
                .join('; ');

            // Set the result to the #ClientEmail input field
            $('#ClientEmail').val(ClientEmails);
        } else {
            // If no ClientEmail, use VendorEmail
            //const VendorEmails = data[0].map(value => value.VendorEmail);

            //// Join the emails with a semicolon and space, but no trailing semicolon
            //const VendorEmail = VendorEmails.join('; '); // No trailing semicolon after last email

            const VendorEmails = data[0]
                .map(value => value.VendorEmail)
                .filter(email => email !== "")
                .join('; ');

            // Set the result to the #ClientEmail input field
            $('#ClientEmail').val(VendorEmails);
        }
    }
}

function GetContactToWhatsApp(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        if (data[1][0].Client_WhatsApp) {

            const client_WhatsApp = data[1]
                .map(value => value.Client_WhatsApp)
                .filter(email => email !== "")
                .join('; ');

            // Set the result to the #ClientEmail input field
            $('#ClientWhatsAppNo').val(client_WhatsApp);
        }
        else {
            // If no ClientEmail, use VendorEmail
            //const VendorEmails = data[0].map(value => value.VendorEmail);

            //// Join the emails with a semicolon and space, but no trailing semicolon
            //const VendorEmail = VendorEmails.join('; '); // No trailing semicolon after last email

            const vendor_WhatsAppNo = data[1]
                .map(value => value.Vendor_WhatsAppNo)
                .filter(email => email !== "")
                .join('; ');

            // Set the result to the #ClientEmail input field
            $('#ClientWhatsAppNo').val(vendor_WhatsAppNo);
        }
    }
}

$(document).on('click', '#SendButton', function () {

    $('#SendMail').modal('hide');
    $('#buttonText #SendButton').val('Sending ......');
    $("#openCanvasCRMEmail").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
    $('.backdrop').hide();

    Common.successMsg("Email Sended Successfully.");

    //var EmailDetailsFormValidation = $('#EmailDetailsForm').valid()

    //if (!EmailDetailsFormValidation) {
    //    return false;
    //}

    //$('.backdrop').show();
    //$('.backdrop').css('z-index', '111111');
    //$('#buttonText #SendButton').val('Sending ......');

    //var recipientEmails = $("#EmailDetails #ClientEmail").val().split(';');
    //var ccEmails = $("#EmailDetails #CC").val() ? $("#EmailDetails #CC").val().split(';') : null;
    //var bccEmails = $("#EmailDetails #BCC").val() ? $("#EmailDetails #BCC").val().split(';') : null;
    //var recipientSubject = $("#EmailDetailsForm #Subject").text();
    //var recipientEmailBody = $("#EmailDetails #EMailBody").html();
    //var emailUserName = $("#EmailDetails #EmailUserName").val();
    //var emailPassword = $("#EmailDetails #EmailPassword").val();
    //var ModuleName = $("#EmailDetails #Info").text();

    //var IsEmailDetailsFormValid = $('#EmailDetailsForm').validate().form();
    //var inputMassage = $('#ClientEmail').val();
    //if ($('#EmailDetailsForm').valid()) {
    //    if (inputMassage == '') {
    //        Common.warningMsg('To Email is not filled. Please provide a valid email address.');
    //        $('.backdrop').hide();
    //        $('#SendButton').html('Send');
    //    }
    //    else {
    //        sendEmail(recipientEmails, ccEmails, bccEmails, recipientSubject, recipientEmailBody, emailUserName, emailPassword, ModuleName);
    //    }
    //}
});
function sendEmail(recipientEmails, ccEmails, bccEmails, subject, body, userName, password, moduleName) {
    // Define emailData object
    $('.backdrop').show();
    var emailData = {
        RecipientEmails: recipientEmails,
        CCEmails: ccEmails,
        BCCEmails: bccEmails,
        Subject: subject,
        Body: body,
        EmailUserName: userName,
        EmailPassword: password,
        ModuleName: moduleName
    };

    // AJAX call to send email
    $.ajax({
        url: '/Common/SendEmailCRM',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(emailData),
        success: function (emailResponse) {
            if (emailResponse.success) {
                Common.successMsg('Email sent successfully');
                $('#SendMail').modal('hide');
                $('#buttonText #SendButton').val('Sending ......');
                $("#openCanvasCRMEmail").css("width", "0%");
                $('#fadeinpage').addClass('fadeoverlay');
                $('.backdrop').hide();
            } else {
                Common.errorMsg('Error: ' + emailResponse.message);
                $('#buttonText #SendButton').val('Send Email');
            }
        },
        error: function () {
            $('.backdrop').hide();
            $('#buttonText #SendButton').val('Send Email');
            Common.errorMsg('Error occurred while sending the email');
        },
        complete: function () {
            $('.backdrop').hide();
            $('#buttonText #SendButton').val('Sending ......');
        }
    });
    $('#SendButton').html('Send.....');
    $('.backdrop').show();
}

//$("#WhatsApp").click(function () {
//    $("#tickMark").show(); // Show tick mark when badge is clicked
//});
//$("#Email").click(function () {
//    $("#tickMark").show(); // Show tick mark when badge is clicked
//});


// Now, generate PDF with jsPDF from the dynamically created HTML content


/*=============================================================================What'sApp ===============================================================*/


function WhatsAppSuccess(moduleName, Id) {
    $('.backdrop').show();
    crmId = parseInt(Id);

    if (moduleName === 'Upcoming Product' || moduleName === 'Wishes') {
        $('#FilterWhatsAppShow').hide();
    }
    else {
        $('#FilterWhatsAppShow').show();
    }

    if (moduleName === 'Upcoming Product') {
        var EditDataId = { ModuleName: moduleName, CRMId: parseInt(Id) };
        Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetUpcomingWhatsAppDetails, $('.backdrop').hide());
    }
    else if (moduleName === 'Discount') {
        var EditDataId = { ModuleName: moduleName, CRMId: parseInt(Id) };
        Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetDiscountWhatsAppDetails, $('.backdrop').hide());
    }
    else if (moduleName === 'Festival Offer') {
        var EditDataId = { ModuleName: moduleName, CRMId: parseInt(Id) };
        Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetFestivalOfferWhatsAppDetails, $('.backdrop').hide());
    }
    else if (moduleName === 'Buy 1 Get 1') {
        var EditDataId = { ModuleName: moduleName, CRMId: parseInt(Id) };
        Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetBuyOnegetOneWhatsAppDetails, $('.backdrop').hide());
    }
    else if (moduleName === 'Wishes') {
        var EditDataId = { ModuleName: moduleName, CRMId: parseInt(Id) };
        Common.ajaxCall("GET", "/Common/GetEmailToAddressDetailsCRM", EditDataId, GetWishesWhatsAppDetails, $('.backdrop').hide());
    }
}


function GetBuyOnegetOneWhatsAppDetails(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'WhatsAppDetails');

        const WhatsAppNoList = data[1]
            .map(value => value.ClientEmail)
            .filter(email => email !== "")
            .join('; ');

        $('#ClientWhatsAppNo').val(WhatsAppNoList);

        var companyName = data[0][0].CompanyName;
        var startDate = data[1][0].StartDate;
        var endDate = data[1][0].EndDate;
        var name = data[1][0].Name;
        var offerPrice = data[1][0].OfferPrice;
        var emailbdy = data[1][0].EmailBody;
        var emailBodyThanks = data[1][0].EmailBodyThanks;
        var comments = data[1][0].Comments;
        var buyInfo = data[1][0].BuyInfo;
        var getInfo = data[1][0].GetInfo;
        var detailsInfo = data[1][0].DetailsInfo;
        var sellingPrice = data[4][0].SellingPrice;
        var buyProductCount = data[5][0].BuyProductCount;
        var getProductCount = data[6][0].GetProductCount;

        // Function to get the current time in the required format
        function getCurrentTime() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format, with 0 as 12
            return `SMS ${hours}:${minutes} ${ampm}`;
        }

        // Get the current timestamp
        var timestamp = getCurrentTime();

        var emailBody = `
            <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 0px 0;">
            <h3 style="font-size: large; font-family: cursive; color: #d36915; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);margin-bottom: 0px;margin-top: 0px;">
                ${buyInfo} ${buyProductCount} ${getInfo} ${getProductCount} ${detailsInfo}
            </h3>
            <p style="font-family: cursive;margin-top: 5px;"><b style="font-family: cursive;">Name:</b> ${name}</p>
            <p style="font-family: cursive;"><b style="font-family: cursive;">Product Price:</b>&nbsp;<del> RS : ${sellingPrice}/-</del> &nbsp;&nbsp;RS : ${offerPrice}/-</p>
            <p style="font-family: cursive;"><b style="font-family: cursive;">Start Date:</b> ${startDate}</p>
            <p style="font-family: cursive;"><b style="font-family: cursive;">End Date:</b> ${endDate}</p>
            <p style="font-family: cursive;"><b style="font-family: cursive;">Comments:</b> ${comments}</p>
            <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                Buy Product:
            </h5>
            <div style="display: flex;width: 100%; margin-bottom: 5px;">
                <!-- Product Table -->
                <table style="font-family: monospace;border-collapse: collapse; width: 83%;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Product Name - Qty</th>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Actual Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        `;

        // Create table rows for each product
        data[2].forEach(Buyproduct => {
            emailBody += `
                        <tr>
                            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;">${Buyproduct.ProductName} - ${Buyproduct.BuyQuantity}</td>
                            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;">${Buyproduct.SellingPrice + '/-'}</td>
                        </tr>
                        `;
        });

        emailBody += `
                    </tbody>
                </table>
            </div>
            <h5 style="color: #007BFF; font-size: 16px;font-family: cursive; font-size: medium;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);">
                Get Product:
            </h5>
            <div style="display: flex;width: 100%; margin-bottom: 5px;">
                <!-- Product Table -->
                <table style="font-family: monospace;border-collapse: collapse; width: 83%;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Product Name - Qty</th>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Actual Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        `;

        // Create table rows for each product
        data[3].forEach(Getproduct => {
            emailBody += `
                        <tr>
                            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;">${Getproduct.ProductName} - ${Getproduct.GetQuantity}</td>
                            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;">${Getproduct.SellingPrice + '/-'}</td>
                        </tr>
                        `;
        });

        emailBody += `
                    </tbody>
                </table>
            </div>
            <div class="SummaTextWhatsApp" style="background-image: url('../moduleimages/crm/whatsapp_image_backgroundimage.png');background-color: beige;">
                <div class="container Summacontainer">
                    <div class="message-blue">
                        <div class="message-content">
                            <p style="font-family: cursive !important;">Dear Customer,</p>
                            <p style="font-family: cursive !important;">${emailbdy}</p>
                            <p style="font-family: cursive !important;">
                                ${emailBodyThanks}
                            </p>
                        </div>
                        <div class="message-timestamp-left" style="font-family: monospace; color: #888;font-size: 1em;">${timestamp}</div> <!-- Timestamp inserted here -->
                    </div>
                </div>
            </div>
        </div>
        `;

        // Inject the generated emailBody HTML into the page
        $("#WhatsAppDetails #WhatsAppBody").html(emailBody);
    }
}

function GetUpcomingWhatsAppDetails(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'WhatsAppDetails');

        var companyName = data[0][0].CompanyName;
        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);


        //const emailList = data[1].map(value => value.ClientEmail).join('; ');
        //$("#ClientEmail").val(emailList);

        const WhatsAppNoList = data[3]
            .map(value => value.WhatsAppNo)
            .filter(ContactNo => ContactNo !== "")
            .join('; ');

        $('#ClientWhatsAppNo').val(WhatsAppNoList);

        var info = data[2][0].Info;
        var emailbdy = data[2][0].EmailBody;
        var emailBodyThanks = data[2][0].EmailBodyThanks;
        var name = data[2][0].Name;
        var offerPrice = data[2][0].OfferPrice;
        var startDate = data[2][0].StartDate;
        var comments = data[2][0].Comments;

        function getCurrentTime() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format, with 0 as 12
            return `SMS ${hours}:${minutes} ${ampm}`;
        }

        // Get the current timestamp
        var timestamp = getCurrentTime();


        var emailBody = `
            <div class="SummaTextWhatsApp" style="background-image: url('../moduleimages/crm/whatsapp_image_backgroundimage.png');background-color: beige;">
                <div class="container Summacontainer">
                    <div class="message-blue">
                        <div class="message-content">
                            <p style="font-family: cursive !important;">Dear Customer,</p>
                            <p style="font-family: cursive !important;">${emailbdy}</p>
                             <p style="font-family: cursive !important;"><b>${info}</b></p>
                             <p style="font-family: cursive !important;"><b>Name :</b> ${name}</p>
                             <p style="font-family: cursive !important;"><b>Product Price :</b> ${offerPrice}</p>
                             <p style="font-family: cursive !important;"><b>Launch Date :</b> ${startDate}</p>
                             <p style="font-family: cursive !important;"><b>Comments :</b> ${comments}</p>
                            <p style="font-family: cursive !important;">
                                ${emailBodyThanks}
                            </p>
                        </div>
                        <div class="message-timestamp-left" style="font-family: monospace; color: #888;font-size: 1em;">${timestamp}</div> <!-- Timestamp inserted here -->
                    </div>
                </div>
           </div>
        `;

        $("#WhatsAppDetails #WhatsAppBody").html(emailBody);

    }
}

function GetDiscountWhatsAppDetails(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'WhatsAppDetails');

        var companyName = data[0][0].CompanyName;
        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);


        //const emailList = data[1].map(value => value.ClientEmail).join('; ');
        //$("#ClientEmail").val(emailList);

        const WhatsAppNoList = data[1]
            .map(value => value.ClientEmail)
            .filter(email => email !== "")
            .join('; ');

        $('#ClientWhatsAppNo').val(WhatsAppNoList);

        var companyName = data[0][0].CompanyName;
        var startDate = data[1][0].StartDate;
        var endDate = data[1][0].EndDate;
        var discount = data[1][0].Discount;
        var emailbdy = data[1][0].EmailBody;
        var emailBodyThanks = data[1][0].EmailBodyThanks;
        var comments = data[1][0].Comments;
        var info = data[1][0].Info;


        function getCurrentTime() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format, with 0 as 12
            return `SMS ${hours}:${minutes} ${ampm}`;
        }

        // Get the current timestamp
        var timestamp = getCurrentTime();


        var emailBody = `
            <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 0px 0;">
            <h3 style="font-size: large; font-family: cursive; color: #d36915; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);margin-bottom: 0px;margin-top: 0px;">${info}</h3>
            <p style="font-family: cursive;margin-top: 5px;"><b style="font-family: cursive;">Discount           :</b> ${discount + '%'}</p>
            <p style="font-family: cursive;"><b style="font-family: cursive;">Start Date        :</b> ${startDate}</p>
            <p style="font-family: cursive;"><b style="font-family: cursive;">End Date:</b> ${endDate}</p>
            <p style="font-family: cursive;"><b style="font-family: cursive;">Comments:</b> ${comments}</p>
            <div style="display: flex;width: 100%; margin-bottom: 5px;">
                <!-- Product Table -->
                <table style="font-family: monospace;border-collapse: collapse; width: 83%;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Product Name</th>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Actual Price</th>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Offer Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        `;

        // Create table rows for each product
        data[2].forEach(product => {
            emailBody += `
                        <tr>
                            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.ProductName}</td>
                            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.ActualPrice + '/-'}</td>
                            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.OfferPrice + '/-'}</td>
                        </tr>
                        `;
        });

        emailBody += `
                    </tbody>
                </table>
            </div>
            <div class="SummaTextWhatsApp" style="background-image: url('../moduleimages/crm/whatsapp_image_backgroundimage.png');background-color: beige;">
                <div class="container Summacontainer">
                    <div class="message-blue">
                        <div class="message-content">
                            <p style="font-family: cursive !important;">Dear Customer,</p>
                            <p style="font-family: cursive !important;">${emailbdy}</p>
                            <p style="font-family: cursive !important;">
                                ${emailBodyThanks}
                            </p>
                        </div>
                        <div class="message-timestamp-left" style="font-family: monospace; color: #888;font-size: 1em;">${timestamp}</div> <!-- Timestamp inserted here -->
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    // Inject the generated emailBody HTML into the page
    $("#WhatsAppDetails #WhatsAppBody").html(emailBody);
}

function GetFestivalOfferWhatsAppDetails(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'WhatsAppDetails');

        var companyName = data[0][0].CompanyName;
        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);


        //const emailList = data[1].map(value => value.ClientEmail).join('; ');
        //$("#ClientEmail").val(emailList);

        const WhatsAppNoList = data[1]
            .map(value => value.ClientEmail)
            .filter(email => email !== "")
            .join('; ');

        $('#ClientWhatsAppNo').val(WhatsAppNoList);

        var companyName = data[0][0].CompanyName;
        var startDate = data[1][0].StartDate;
        var endDate = data[1][0].EndDate;
        var name = data[1][0].Name;
        var offerPrice = data[1][0].OfferPrice;
        var emailbdy = data[1][0].EmailBody;
        var emailBodyThanks = data[1][0].EmailBodyThanks;
        var comments = data[1][0].Comments;
        var info = data[1][0].Info;
        var actualPrice = data[2][0].ActualPrice;


        function getCurrentTime() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format, with 0 as 12
            return `SMS ${hours}:${minutes} ${ampm}`;
        }

        // Get the current timestamp
        var timestamp = getCurrentTime();


        var emailBody = `
            <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 0px 0;">
                   <h3 style="font-size: large; font-family: cursive; color: #d36915; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);margin-bottom: 0px;margin-top: 0px;">${info}</h3>
                   <p style="font-family: cursive;margin-top: 5px;"><b style="font-family: cursive;">Name:</b> ${name}</p>
                   <p style="font-family: cursive;"><b style="font-family: cursive;">Product Price:</b>&nbsp;<del> ${'RS : ' + actualPrice + '/-'} </del> &nbsp;&nbsp;${'RS : ' + offerPrice + '/-'}</p>
                   <p style="font-family: cursive;"><b style="font-family: cursive;">Start Date:</b> ${startDate}</p>
                   <p style="font-family: cursive;"><b style="font-family: cursive;">End Date:</b> ${endDate}</p>
                   <p style="font-family: cursive;"><b style="font-family: cursive;">Comments:</b> ${comments}</p>
               <div style="display: flex;width: 100%; margin-bottom: 5px;">
                   <!-- Product Table -->
                   <table style="font-family: monospace;border-collapse: collapse; width: 83%;">
                       <thead>
                           <tr>
                               <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Product Name - Qty</th>
                               <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace; white-space: nowrap; font-size: 13px; font-weight: 900; color: #66c011;">Actual Price</th>
                           </tr>
                       </thead>
                       <tbody>
           
                        `;

        // Create table rows for each product
        data[3].forEach(product => {
            emailBody += `
                        <tr>
                            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.ProductName} - ${product.Quantity}</td>
                            <td style="border: 1px solid #dddddd;text-align: left;padding: 8px;font-family: monospace;font-size: 12px;">${product.ActualPrice + '/-'}</td>
                        </tr>
                        `;
        });

        emailBody += `
                    </tbody>
                </table>
            </div>
            <div class="SummaTextWhatsApp" style="background-image: url('../moduleimages/crm/whatsapp_image_backgroundimage.png');background-color: beige;">
                <div class="container Summacontainer">
                    <div class="message-blue">
                        <div class="message-content">
                            <p style="font-family: cursive !important;">Dear Customer,</p>
                            <p style="font-family: cursive !important;">${emailbdy}</p>
                            <p style="font-family: cursive !important;">
                                ${emailBodyThanks}
                            </p>
                        </div>
                        <div class="message-timestamp-left" style="font-family: monospace; color: #888;font-size: 1em;">${timestamp}</div> <!-- Timestamp inserted here -->
                    </div>
                </div>
            </div>
        </div>
`;
    }
    // Inject the generated emailBody HTML into the page
    $("#WhatsAppDetails #WhatsAppBody").html(emailBody);

}

function GetWishesWhatsAppDetails(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'WhatsAppDetails');

        var companyName = data[0][0].CompanyName;
        $("#EmailUserName").val(data[0][0].EmailUserName);
        $("#EmailPassword").val(data[0][0].EmailPassword);


        //const emailList = data[1].map(value => value.ClientEmail).join('; ');
        //$("#ClientEmail").val(emailList);

        const WhatsAppNoList = data[3]
            .map(value => value.WhatsAppNo)
            .filter(ContactNo => ContactNo !== "")
            .join('; ');

        $('#ClientWhatsAppNo').val(WhatsAppNoList);


        var comments = data[2][0].Comments;
        var emailbdy = data[2][0].EmailBody;
        var emailBodyThanks = data[2][0].EmailBodyThanks;
        var name = data[2][0].Name;



        function getCurrentTime() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format, with 0 as 12
            return `SMS ${hours}:${minutes} ${ampm}`;
        }

        // Get the current timestamp
        var timestamp = getCurrentTime();

        var emailBody = `
         <div class="SummaTextWhatsApp" style="background-image: url('../moduleimages/crm/whatsapp_image_backgroundimage.png');background-color: beige;">
                <div class="container Summacontainer">
                    <div class="message-blue">
                        <div class="message-content">
                            <p style="font-family: cursive !important;">From ${companyName}</p>
                             <p style="font-family: cursive !important;"><b>Comments :</b> ${comments}</p>
                            <p style="font-family: cursive !important;">
                                ${emailBodyThanks}
                            </p>
                        </div>
                        <div class="message-timestamp-left" style="font-family: monospace; color: #888;font-size: 1em;">${timestamp}</div> <!-- Timestamp inserted here -->
                    </div>
                </div>
           </div>
        `;

        // Inject the generated emailBody HTML into the page
        $("#WhatsAppDetails #WhatsAppBody").html(emailBody);

    }
}


/*============WhatsApp Massage Current Timeing============*/

function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format, with 0 as 12
    const timeString = `SMS ${hours}:${minutes} ${ampm}`;

    $(".message-timestamp-left").text(timeString);
}

// Optional: Update every minute if you want it to stay current
setInterval(updateTime, 60000);

/*=======WhatsApp Massage Current Timeing Ending==========*/


/////////Current Date////////
function CurrentDateStartDate() {
    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    $('#StartDate').val(formattedDate);
    $('#EndDate').attr('min', formattedDate);
}

function CurrentDateStartDateEdite() {
    var startDate = $('#StartDate').val();
    var formattedDate = new Date(startDate);
    var formattedDateString = formattedDate.toISOString().slice(0, 10);
    $('#EndDate').attr('min', formattedDateString);
}

/*========Grid Filter For Pop=========*/

//['#tablFilter', '#tableFilter5', '#tableFilter4', '#tableFilter2'].forEach(function (id, index) {
//    $(id).on('keyup', function () {
//        applyFilters(id, ['#FestivalTable', '#GetOneTable', '#BuyOneTable', '#DiscountTable'][index]);
//    });
//});

//function applyFilters(FilterId, TableId) {
//    let textFilterValue = $(FilterId).val().toLowerCase();
//    let visibleRowCount = 0;
//    $(`${TableId} > tbody tr`).each(function () {
//        let rowText = $(this).text().toLowerCase();

//        let matchesTextFilter = textFilterValue === "" || rowText.indexOf(textFilterValue) > -1;

//        $(this).toggle(matchesTextFilter);
//        let isVisible = matchesTextFilter;
//        $(this).toggle(isVisible);

//        if (isVisible) {
//            visibleRowCount++;
//        }
//    });
//    if (visibleRowCount === 0) {
//        let $tableBody = $(`${TableId} tbody`);
//        $tableBody.find(".dataTables_empty").parent().remove(); // Remove existing message

//        let noRecordRow = `
//        <tr role="row" class="odd">
//            <td valign="top" colspan="3" class="dataTables_empty">
//                <div>
//                    <img src="/moduleimages/payroll/norecord.svg" style="margin-right: 10px;">
//                    No records found
//                </div>
//            </td>
//        </tr>
//    `;
//        $tableBody.append(noRecordRow);
//    } else {
//        $(`${TableId} tbody .dataTables_empty`).parent().remove(); // Remove "No records found" when rows exist
//    }
//}
