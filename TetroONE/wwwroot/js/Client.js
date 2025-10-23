var clientId = 0;
var shoptId = 0;
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
/*var titleForHeaderProductTab = "";*/
var UnitDropDown = [];

$(document).ready(function () {
    //titleForHeaderProductTab = "Distributor";
    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    Common.ajaxCall("GET", "/Contact/GetClient", { FranchiseId: FranchiseMappingId, ClientTypeId: parseInt(1) }, ClientSuccess, null);
    Common.bindDropDownParent('StateId', 'FormClient', 'State');
    Common.bindDropDownParent('ShopStateId', 'FormShop', 'State');
    Common.bindDropDownParent('ShopTypeId', 'FormShop', 'ShopType');
    Common.bindDropDown('ClientTypeId', 'ClientType');
    setPrimaryCheckboxEventListeners();
    //$('#FormFranchiseData #BindFranchiseData').empty();
    $('#ShopAccordian').hide();
    $('#IsActiveHide').hide();
    $('#CurrentlimitHide').removeClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2').addClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2');
    var today = new Date().toISOString().split('T')[0];
    $("#CollaboratedDate").val(today);
    //$("#CollaboratedDate").attr("max", today);
    //$("#Visi_CollaboratedDate").attr("max", today);


    //$("#CollaboratedDate").on("change", function () {
    //    var selectedPODate = $(this).val();
    //    $("#ExpiryDate").attr("min", selectedPODate);


    //    if ($("#ExpiryDate").val() < selectedPODate) {
    //        $("#ExpiryDate").val("");
    //    }
    //});
    //---------------------
    //$("#Visi_CollaboratedDate").on("change", function () {
    //    var selectedDate = $(this).val();
    //    $("#Visi_ExpiryDate").attr("min", selectedDate);


    //    if ($("#Visi_ExpiryDate").val() < selectedDate) {
    //        $("#Visi_ExpiryDate").val("");
    //    }
    //});

    $(document).on('hover', 'input[type="checkbox"]', function (event) {
        const parent = $(this).closest('.d-flex');
        if (event.type === 'mouseenter') {
            parent.find('.blur-target .dynamicinput, .blur-target .dynamicinputselect').css('filter', 'blur(0)');
        } else if (event.type === 'mouseleave') {
            if (!$(this).is(':checked')) {
                parent.find('.blur-target .dynamicinput, .blur-target .dynamicinputselect').css('filter', 'blur(1px)');
            }
        }
    });

    // Handle checkbox checked state using delegation
    $(document).on('change', 'input[type="checkbox"]', function () {
        const parent = $(this).closest('.d-flex');
        if ($(this).is(':checked')) {
            parent.find('.blur-target .dynamicinput, .blur-target .dynamicinputselect').css('filter', 'blur(0)');
        } else {
            parent.find('.blur-target .dynamicinput, .blur-target .dynamicinputselect').css('filter', 'blur(1px)');
        }
    });

    $(document).on('click', '#SaveClient', function (e) {
        if (!Common.validateEmailwithErrorwithParent('FormClient', 'Email')) {
            return false;
        }

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

        e.preventDefault();
        var isFormValid = validateFormAccordions('.accordion');

        //var IsFormVisicooler = $("#FormVisicooler").valid();

        var PrimaryValid = isPrimaryChecked('IsPrimary', 'Clientcontact');
        if (isFormValid && PrimaryValid && isValid && $("#FormClient").valid()) {

            getExistFiles();

            var DataClientStatic1 = JSON.parse(JSON.stringify(jQuery('#FormClient').serializeArray()));
            //var DataClientStatic2 = JSON.parse(JSON.stringify(jQuery('#FormEligibility').serializeArray()));
            //var DataClientStatic = DataClientStatic1.concat(DataClientStatic2);
            var objvalue = {};
            $.each(DataClientStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.ClientId = clientId > 0 ? clientId : null;
            objvalue.ClientTypeId = Common.parseInputValue('ClientTypeId') || null;
            objvalue.StateId = Common.parseInputValue('StateId') || null;
            objvalue.CreditLimit = Common.parseFloatInputValue('CreditLimit') || null;
            objvalue.CurrentCreditLimit = Common.parseFloatInputValue('CurrentCreditLimit') || null;
            objvalue.PerCrateCost = Common.parseFloatInputValue('PerCrateCost') || null;

            objvalue.CollabratedDate = Common.stringToDateTime('CollabratedDate') || null;
            objvalue.ExpiryDate = Common.stringToDateTime('ExpiryDate') || null;
            objvalue.InvoiceAmount = Common.parseFloatInputValue('InvoiceAmount') || null;
            objvalue.NoOfCrates = Common.parseFloatInputValue('NoOfCrates') || null;
            objvalue.CurrentEligibility = Common.parseFloatInputValue('CurrentEligibility') || null;

            //objvalue.Visi_CollaboratedDate = Common.stringToDateTime('Visi_CollaboratedDate') || null;
            //objvalue.Visi_ExpiryDate = Common.stringToDateTime('Visi_ExpiryDate') || null;
            //objvalue.Visi_InvoiceAmount = Common.parseFloatInputValue('Visi_InvoiceAmount') || null;
            //objvalue.Visi_NoOfQty = Common.parseInputValue('Visi_NoOfQty') || null;
            //objvalue.GivenVisiCooler = Common.parseInputValue('GivenVisiCooler') || null;

            objvalue.IsActive = $('#FormClient #IsActive').is(':checked');
            objvalue.ClientNo = $('#ClientNo').val() || null;

            var ContactPerson = [];
            var ClosestDiv = $('#FormContactClient .Clientcontact');
            $.each(ClosestDiv, function (index, values) {
                var getContactPersonId = $(values).find('.clientContactPersonId').data('id');
                var getSalutationValues = $(values).find('.Salutation').val();
                var getClientContactPersonNameValues = $(values).find('.ContactPerson').val();
                var getContactNumberValues = $(values).find('.MobileNumber').val();
                var geEmailtValues = $(values).find('.Email').val();
                var getIsPrimaryValues = $(values).find('.IsPrimary').prop('checked');
                ContactPerson.push({
                    ContactPersonId: parseInt(getContactPersonId) || null,
                    Salutation: getSalutationValues,
                    ContactPersonName: getClientContactPersonNameValues,
                    ContactNumber: getContactNumberValues,
                    Email: geEmailtValues,
                    IsPrimary: getIsPrimaryValues,
                    ContactId: parseInt(clientId) || null
                });
            });

            //var FranchiseList = [];
            //var ClosestDivProductList = $('#FormFranchiseData #BindFranchiseData input[type="checkbox"]:checked');

            //$.each(ClosestDivProductList, function (index, element) {
            //    var ContactFranchiseMappingId = $(element).siblings('.ProductMappingId').text();
            //    var moduleId = clientId;
            //    var franchiseId = $(element).data('id');
            //    var IsActive = $(element).prop('checked');

            //    FranchiseList.push({
            //        ContactFranchiseMappingId: parseInt(ContactFranchiseMappingId) || null,
            //        ContactId: parseInt(moduleId) || null,
            //        FranchiseId: franchiseId,
            //        IsSelected: IsActive,
            //    });
            //});

            //objvalue.franchiseMappingDetails = FranchiseList

            //var ProductList = [];
            //var ClosestDivProductList = $('#FormProductData #BindProductData input[type="checkbox"]:checked');

            //$.each(ClosestDivProductList, function (index, element) {
            //    var container = $(element).closest('.d-flex');
            //    var moduleId = clientId;
            //    var productId = $(element).data('id');
            //    var sellingPrice = container.find('.dynamicinput').val();
            //    var unitId = container.find('.dynamicinputselect').val();
            //    var ClientProductMappingId = container.find('.ClientProductMappingId').val();
            //    ProductList.push({
            //        ClientProductMappingId: parseInt(ClientProductMappingId) || null,
            //        ClientId: parseInt(moduleId) || null,
            //        ProductId: parseInt(productId) || null,
            //        SellingPrice: parseFloat(sellingPrice) || null,
            //        UnitId: parseInt(unitId) || null,
            //    });
            //});

            //objvalue.ClientProductMappingDetails = ProductList;


            var VisicoolerDetailsArray = [];
            var VisicoolerDyanamicAttachment = [];
            var existFilesDyanamicAttachment = [];
            var VisicoolerDetails = $('.VisicoolerDynamic');

            $.each(VisicoolerDetails, function (index, value) {
                var MappingVisicooler = $(value).find('.MappingVisicoolerDynamicLable').text();
                var CollaboratedDateString = $(value).find('.CollaboratedDate').val();
                var collaboratedDate = new Date(CollaboratedDateString);
                var ExpiryDateString = $(value).find('.ExpiryDate').val();
                var expiryDate = new Date(ExpiryDateString);
                var RowNumberTake = index + 1;

                //VisicoolerDetailsArray.push({
                //    DistributorVisicoolarId: parseInt(MappingVisicooler) || null,
                //    VisicoolarName: $(value).find('.VisicoolerName').val() || null,
                //    CollaboratedDate: collaboratedDate,
                //    ExpiryDate: expiryDate,
                //    InvAmount: $(value).find('.VisicoolerAmount').val(),
                //    RowNumber: RowNumberTake,
                //    ClientId: parseInt(clientId) || null,
                //});

                $(value).find('.download-button').each(function () {
                    var dataIdName = $(this).find('i').data('id');
                    if (dataIdName) {
                        VisicoolerDyanamicAttachment.push({
                            RowNumber: RowNumberTake,
                            Visi_AttachmentFileName: dataIdName
                        });
                    }
                });

                $(value).find('.existselectedFiles li').each(function () {
                    var attachmentId = $(this).find('.delete-buttonattach').attr('attachmentid');
                    var moduleRefId = $(this).find('.delete-buttonattach').attr('modulerefid');
                    var filePath = $(this).find('.download-link').attr('href');
                    var fileName = $(this).find('.download-link').attr('download');

                    if (fileName && filePath) {
                        existFilesDyanamicAttachment.push({
                            VisicoolarAttachmentId: parseInt(attachmentId) || null,
                            ModuleName: "Client",
                            DistributorVisicoolarId: parseInt(moduleRefId) || null,
                            Visi_AttachmentFileName: fileName,
                            Visi_AttachmentFilePath: filePath,
                            RowNumber: RowNumberTake,
                            ClientId: parseInt(clientId) || null,
                        });
                    }
                });
            });

            formDataMultiple.append("ClientDetailsStatic", JSON.stringify(objvalue));
            formDataMultiple.append("ClientContactPersonDetails", JSON.stringify(ContactPerson));
            formDataMultiple.append("ClientProductMappingDetails", JSON.stringify(ProductList));
            formDataMultiple.append("FranchiseStaticData", JSON.stringify(FranchiseList));
            formDataMultiple.append("DistributorVisicoolarDetails", JSON.stringify(VisicoolerDetailsArray));
            formDataMultiple.append("VisicoolerDyanamicAttachment", JSON.stringify(VisicoolerDyanamicAttachment));
            formDataMultiple.append("ExistFilesDyanamicAttachment", JSON.stringify(existFilesDyanamicAttachment));
            formDataMultiple.append("Exist", JSON.stringify(existFiles));
            formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));
            $.ajax({
                type: "POST",
                url: "/Contact/InsertUpdareClientDetails",
                data: formDataMultiple,
                contentType: false,
                processData: false,

                success: function (response) {
                    if (response.status) {
                        formDataMultiple = new FormData();
                        Common.successMsg(response.message);
                        $("#ClientCanvas").css("width", "0%");
                        $('#fadeinpage').removeClass('fadeoverlay');
                        //$('#FormFranchiseData #BindFranchiseData').empty();
                        //$('.titleForHeaderProductTab').removeClass('active');
                        //$('.this').addClass('active');
                        $('#ClientGridDynamic').empty('');
                        var html = `<div class="col-sm-12 p-0">
                            <div class="table-responsive">
                                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ClientTable"></table>
                            </div>
                        </div>`;
                        $('#ClientGridDynamic').append(html);
                        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
                        var PasseingData = { FranchiseId: franchiseId, ClientTypeId: parseInt(1) }
                        Common.ajaxCall("GET", "/Contact/GetClient", PasseingData, ClientSuccess, null);
                    }
                    else {
                        formDataMultiple = new FormData();
                        Common.errorMsg(response.message);
                    }
                },
                error: function (response) {
                    Common.errorMsg(response.message);
                }
            });
        }
    });

    $(document).on('change', 'input[type="checkbox"]', function () {
        var accordion = $(this).closest('.accordion-item');
        var anyChecked = accordion.find('input[type="checkbox"]').is(':checked');
        if (anyChecked) {
            accordion.find('.checkbox-error').remove();
        }
    });


    //$(document).on('click', '.navbar-tab', function () {

    //    titleForHeaderProductTab = $(this).text().trim();
    //    $('.navbar-tab').removeClass('active');
    //    $(this).each(function () {
    //        if ($(this).text().trim() === titleForHeaderProductTab) {
    //            $(this).addClass('active');
    //        }
    //    });

    //    if (titleForHeaderProductTab == "Distributor") {
    //        $('#ClientGridDynamic').empty('');
    //        var html = `<div class="col-sm-12 p-0">
    //                        <div class="table-responsive">
    //                            <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ClientTable"></table>
    //                        </div>
    //                 </div>`;
    //        $('#ClientGridDynamic').append(html);
    //        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    //        Common.ajaxCall("GET", "/Contact/GetClient", { FranchiseId: FranchiseMappingId, ClientTypeId: parseInt(1) }, ClientSuccess, null);
    //    }
    //    else {
    //        $('#ClientGridDynamic').empty('');
    //        var html = `<div class="col-sm-12 p-0">
    //                        <div class="table-responsive">
    //                            <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ClientTable"></table>
    //                        </div>
    //                 </div>`;
    //        $('#ClientGridDynamic').append(html);
    //        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    //        Common.ajaxCall("GET", "/Contact/GetClient", { FranchiseId: FranchiseMappingId, ClientTypeId: parseInt(2) }, ClientSuccess, null);
    //    }
    //});
});

function ClientSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        $('#editCounterbox #CounterImage1').prop('');
        $('#editCounterbox #CounterImage2').prop('');
        $('#editCounterbox #CounterImage3').prop('');
        $('#editCounterbox #CounterImage4').prop('');

        $('#editCounterbox #CounterImage1').prop('src', '/assets/moduleimages/contact/distributoricon_1.svg');
        $('#editCounterbox #CounterImage2').prop('src', '/assets/moduleimages/contact/distributoricon_2.svg');
        $('#editCounterbox #CounterImage3').prop('src', '/assets/moduleimages/contact/distributoricon_3.svg');
        $('#editCounterbox #CounterImage4').prop('src', '/assets/moduleimages/contact/distributoricon_4.svg');

        var CounterBox = Object.keys(data[0][0]);

        $("#CounterTextBox1").text(CounterBox[0]);
        $("#CounterTextBox2").text(CounterBox[1]);
        $("#CounterTextBox3").text(CounterBox[2]);
        $("#CounterTextBox4").text(CounterBox[3]);

        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        var columns = Common.bindColumn(data[1], ['ClientId', 'Status_Color']);
        bindTableForClient('ClientTable', data[1], columns, -1, 'ClientId', '330px', true, access);
    }
}

function ReloadSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#ClientCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        //$('#FormFranchiseData #BindFranchiseData').empty();
        //$('.titleForHeaderProductTab').removeClass('active');
        //$('.this').addClass('active');
        $('#ClientGridDynamic').empty('');
        var html = `<div class="col-sm-12 p-0">
                            <div class="table-responsive">
                                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ClientTable"></table>
                            </div>
                        </div>`;
        $('#ClientGridDynamic').append(html);
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var PasseingData = {};
        if (titleForHeaderProductTab == "DirectClient") {
            PasseingData = { FranchiseId: franchiseId, ClientTypeId: parseInt(2) }
        }
        else if (titleForHeaderProductTab == "Distributor") {
            PasseingData = { FranchiseId: franchiseId, ClientTypeId: parseInt(1) }
        }
        Common.ajaxCall("GET", "/Contact/GetClient", PasseingData, ClientSuccess, null);
    } else {
        Common.errorMsg(response.message);
    }
}

$(document).on('click', '#AddClient', function () {
    $('#loader-pms').show();

    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#ClientCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#ClientCanvas").css("width", "50%");
    } else {
        $("#ClientCanvas").css("width", "39%");
    }
    $("#ClientHeader").text('Add Client Details');
    $('#ShopAccordian').hide();
    CanvasOpenFirstShowing();
    $('#fadeinpage').addClass('fadeoverlay');
    $("#FormClient")[0].reset();

    $('#TransactionsHide').hide();
    Common.removevalidation('FormClient');
    
    Common.removeMessage('FormClient');
    
    $('#FormClient #StateId').val('32');
    $('#FormClient #Country').val('India');
    $('#FormContactClient').empty('');
   

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    $('#CollaboratedDate').val(formattedDate);
   

    duplicateRow();
    //duplicateVisicooler();
    clientId = 0;
    $('#selectedFiles').empty();
    $('#ExistselectedFiles').empty();
    $("#FormClient select").val("").trigger("change");
    $('#SaveClient').text('Save').addClass('btn-success').removeClass('btn-update');
    $('#loader-pms').hide();
    $('#IsActiveHide').hide();
    $('#CurrentlimitHide').removeClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2').addClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2');
  
   // $('#FormProductData #BindProductData').empty('');

    //Common.ajaxCall("GET", "/Contact/GetProductListVendor", { ModuleName: "Client" }, ProductListSuccess, null);

    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    var EditDataId = { ModuleName: 'Distributor', FranchiseId: franchiseId };
    Common.ajaxCall("GET", "/Common/GetAutoGenerate", EditDataId, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            $('#ClientNo').val(data[0][0].ClientNo);
        };
    });

    $('#ClientCanvas .collapse').removeClass('show');
    $('#collapse1').addClass('show');
});


//function ProductListSuccess(response) { 
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var products = data[0]; // Extract the actual array of products
//        var htmlDynamicProduct = '';
//        if (data[0][0].ProductId != null && data[0][0].ProductId != "") {
//            $.each(products, function (index, product) {
//                var ProductId = product.ProductId;
//                var ProductName = product.ProductName;

//                Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(ProductId), ModuleName: 'FinishedProductUnit' }, function (response) {

//                    var data = JSON.parse(response.data);
//                    UnitDropDown = data;

//                    var defaultOption = '<option value="">--Select--</option>';
//                    //if (response.status) {
//                    //    var UnitDropDown = JSON.parse(response.data);
//                    //    if (UnitDropDown != null && UnitDropDown.length > 0) {
//                    //        var UnitSelectOptions = UnitDropDown[0].map(function (UnitVal) {
//                    //            var isSelected = UnitVal.PrimaryUnitId == UnitVal.PrimaryUnitId ? 'selected' : '';
//                    //            return `<option value="${UnitVal.PrimaryUnitId}" ${isSelected}>${UnitVal.PrimaryUnitName}</option>`;
//                    //        }).join('');
//                    //    }
//                    //}

//                    if (response.status) {
//                        var UnitDropDown = JSON.parse(response.data);
//                        if (UnitDropDown != null && UnitDropDown.length > 0 && UnitDropDown[0].length > 0) {
//                            var UnitSelectOptions = UnitDropDown[0].map(function (PrimaryUnitId) {
//                                return `<option value="${PrimaryUnitId.PrimaryUnitId}">${PrimaryUnitId.PrimaryUnitName}</option>`;
//                            }).join('');
//                        }
//                    }

//                    htmlDynamicProduct = `
//                    <div class="col-md-12 col-lg-12 col-sm-12 col-12 mt-2">
//                        <div class="d-flex">
//                            <div style="display: flex; align-items: center; width: 166px;">
//                            <input type="hidden" class="ClientProductMappingId" id="ClientProductMappingId" name="ClientProductMappingId" value="" />
//                                <input type="checkbox" data-id="${ProductId}" name="products" value="${ProductName}" id="product-${ProductId}">
//                                <label for="product-${ProductId}" class="checkbox-label_1 ml-1">${ProductName}</label>
//                            </div>
//                            <div class="d-flex ml-3 blur-target">
//                                <input type="text" class="form-control dynamicinput" placeholder="0.00" id="Amount" name="Amount" oninput="allowOnlyNumbersAndAfterDecimalTwoValForClient(this,8)" value="${product.SecondaryPrice}" />
//                                <select class="form-control dynamicinputselect" id="UnitId" name="UnitId">
//                                    ${UnitSelectOptions}
//                                </select>
//                            </div>
//                        </div>
//                    </div>
//                `;
//                    $("#FormProductData #BindProductData").append(htmlDynamicProduct);
//                }, null);
//            });
//        } else {
//            $('#FormProductData #BindProductData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
//        }
//    }
//}

//$(document).on('change', '#BindProductData input[type="checkbox"]', function () {
//    var $checkbox = $(this);
//    var productId = $checkbox.data('id');
//    var $unitWrapper = $checkbox.closest('tr').find('.unit-wrapper');

//    Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", { MasterInfoId: parseInt(productId), ModuleName: 'FinishedProductUnit' }, function (response) {
//        if (response.status) {
//            var unitData = JSON.parse(response.data)[0];
//            var $unitDropdown = $unitWrapper.find('select');

//            if (unitData && unitData.length > 0) {
//                var valueProp = Object.keys(unitData[0])[0];
//                var textProp = Object.keys(unitData[0])[1];

//                $.each(unitData, function (index, item) {
//                    $unitDropdown.append($('<option>', {
//                        value: item[valueProp],
//                        text: item[textProp]
//                    }));
//                });
//            }
//        }
//    }, null);
//});

$(document).on('input', '#FormClient #CreditLimit', function () {
    var thisVal = $(this).val();
    if (clientId == 0)
        $('#CurrentCreditLimit').val(thisVal);
});

$(document).on('change', '#ClientTypeId', function () {
    var thisval = $(this).val();
    if (thisval == "") {
        if (clientId != null && clientId != "") {
            $('#ShopAccordian').hide();
        }
    }
    else if (thisval == 2) {
        if (clientId != null && clientId != "") {
            $('#ShopAccordian').hide();
        }
    }
    else if (thisval == 1) {
        if (clientId != null && clientId != "") {
            $('#ShopAccordian').show();
        }
    }
});

//function FranchiseSuccess(response) {   
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var htmlDynamicProduct = "";
//        if (data[0][0].FranchiseId != null && data[0][0].FranchiseId != "") {
//            $.each(data[0], function (index, franchiseData) {
//                var FranchiseId = franchiseData.FranchiseId;
//                var FranchiseName = franchiseData.FranchiseName;
//                var IsActiveCheck = franchiseData.IsActive == true ? 'checked' : '';

//                htmlDynamicProduct += `
//                 <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
//                    <lable class="FranchiseMappingId d-none"></lable>
//                    <input type="checkbox" data-id="${FranchiseId}" name="products" ${IsActiveCheck} id="product-${FranchiseId}${FranchiseName}">
//                    <label for="product-${FranchiseId}${FranchiseName}" class="checkbox-label">${FranchiseName}</label>
//                </div>
//            `;
//            });
//            $('#FormFranchiseData #BindFranchiseData').append(htmlDynamicProduct);
//        }
//        else {
//            $('#FormFranchiseData #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
//        }
//        $('#FormClient #StateId').val('32');
//    }
//}


$('.accordion-header').on('click', function () {
    var $offcanvas = $(this).closest('.offcanvas-container');
    var $accordion = $(this).closest('.accordion');
    var target = $(this).find('a').attr('data-target');
    $offcanvas.find('.collapse').not(target).collapse('hide');
    $(target).collapse('toggle');
});

function calculateValues() {
    var inWard = parseFloat($('#Inward').val()) || 0;
    var outWard = parseFloat($('#OutWard').val()) || 0;
    var shortage = inWard - outWard;
    var eligibility = Math.max(0, (inWard - outWard) * 0.8);
    $('#Shortage').val(shortage);
    $('#Eligibility').val(eligibility.toFixed(2));
}

$('#Inward, #OutWard').on('input', calculateValues);

$('#InvoiceAmount').on('input', function () {
    var invoiceAmount = parseFloat($(this).val());
    var noOfCrates = 0;

    if (!isNaN(invoiceAmount) && invoiceAmount > 0) {
        noOfCrates = Math.ceil(invoiceAmount / 250);
    }

    $('#NoOfCrates').val(noOfCrates);
});

//$('#Visi_InvoiceAmount').on('input', function () {
//    var invoiceAmount = parseFloat($(this).val());
//    var noOfqty = 0;

//    if (!isNaN(invoiceAmount) && invoiceAmount > 0) {
//        noOfqty = Math.ceil(invoiceAmount / 15000);
//    }

//    $('#Visi_NoOfQty').val(noOfqty);
//});


$(document).on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#ClientCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#ClientCanvas").css("width", "50%");
    } else {
        $("#ClientCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowing();
    Common.removeMessage('FormClient');
    //Common.removeMessage('FormEligibility');
   // $('#FormVisicooler .VisicoolerDynamic').remove();
    $('#ShopAccordian').show();
    $('#IsActiveHide').show();
    $('#CurrentlimitHide').removeClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2').addClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2');
    $("#ClientHeader").text('Edit Client Details');
    $('#fadeinpage').addClass('fadeoverlay');
    $('#SaveClient').text('Update').addClass('btn-update').removeClass('btn-success');
    $('#loader-pms').hide();
    //$('#FormFranchiseData #BindFranchiseData').empty();
    existFiles = [];
    Common.bindDropDownParent('ShopTypeId', 'FormShop', 'ShopType');
    clientId = $(this).data('id');
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
   
    var PasseingData = { ClientId: clientId, FranchiseId: franchiseId, ClientTypeId: parseInt(1) }
    Common.ajaxCall("GET", "/Contact/GetClientID", PasseingData, editSuccess, null);
    $('#ClientCanvas .collapse').removeClass('show');
    $('#collapse1').addClass('show');
});

function editSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);

        $('#CollaboratedDate').val(formatDateForInput(data[0][0].CollaboratedDate));
        $('#ExpiryDate').val(formatDateForInput(data[0][0].ExpiryDate));
        //$("#CollaboratedDate").attr("max", formatDateForInput(data[0][0].CollaboratedDate));
        //$("#ExpiryDate").attr("min", formatDateForInput(data[0][0].CollaboratedDate));

        if (data[0][0].IsActive == true)
            $('#FormClient #IsActive').prop('checked', true);
        else
            $('#FormClient #IsActive').prop('checked', false);

        $('#ClientTypeId').val(data[0][0].ClientTypeId).trigger('change');

        $('#FormContactClient').empty('');
        $.each(data[1], function (index, value) {
            var rowadd = $('.Vendorcontact').length;
            var DynamicLableNo = rowadd + 1;
            let unique = Math.random().toString(36).substring(2);
            var PrimaryCheck = value.IsPrimary == true ? 'checked' : '';
            var htmlAppend =
                `
                   <div class="row Clientcontact">
                     <input type="hidden" class="clientContactPersonId" id="ClientContactPersonId" name="ClientContactPersonId" data-id="${value.ClientContactPersonId}" />
                     <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                        <label class="DynamicLable">Contact Person ${DynamicLableNo}</label>
                    </div>
                    <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                        <div class="form-group">
                            <label>Contact Person Name<span id="Asterisk">*</span></label>
                            <div class="input-group">
                                     <select class="form-control Salutation" autocomplete="off" name="Salutation ${unique}" id="Salutation ${unique}" required>
                                            <option value="Mr" ${value.Salutation == 'Mr' ? 'selected' : ''}>Mr</option>
                                            <option value="Ms" ${value.Salutation == 'Ms' ? 'selected' : ''}>Ms</option>
                                            <option value="Mrs" ${value.Salutation == 'Mrs' ? 'selected' : ''}>Mrs</option>
                                        </select>
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
                    <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                        <div>
                            <div class="d-flex align-items-center ml-4" style=" margin-top: 36px; ">
                                <input type="checkbox" name="IsPrimary${unique}" class="form-check-input IsPrimary" id="IsPrimary${unique}" ${PrimaryCheck}>
                                <label for="IsPrimary" class="text-black ml-2">IsPrimary</label>
                            </div>
                        </div>
                        <div class="d-flex justify-content-start isprimaryerror">
                            <div id="IsPrimaryError" class="d-none">
                                <span class="text-danger">Primary is required.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-3 col-sm-3 col-3 thiswillshow">
                        <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                            <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>

                 </div>
            `;

            $('#FormContactClient').append(htmlAppend);
            setPrimaryCheckboxEventListeners();
        });

        //if (data[2][0].ProductId != null && data[2][0].ProductId != "") {
        //    $('#FormProductData #BindProductData').empty();
        //    var products = data[2];

        //    // Map of promises
        //    var htmlPromises = products.map((product, index) => {
        //        return new Promise((resolve, reject) => {
        //            Common.ajaxCall("GET", "/Inventory/GetDDMasterInfoValue", {
        //                MasterInfoId: parseInt(product.ProductId),
        //                ModuleName: 'FinishedProductUnit'
        //            }, function (response) {
        //                var data = JSON.parse(response.data);
        //                let UnitSelectOptions = '';
        //                if (response.status && data && data[0]) {
        //                    UnitSelectOptions = data[0].map(UnitVal => {
        //                        var isSelected = UnitVal.PrimaryUnitId == product.UnitId ? 'selected' : '';
        //                        return `<option value="${UnitVal.PrimaryUnitId}" ${isSelected}>${UnitVal.PrimaryUnitName}</option>`;
        //                    }).join('');
        //                }

        //                var PrimaryCheck = product.IsActive == true ? 'checked' : '';
        //                var blurStyle = product.IsActive ? 'blur(0px)' : 'blur(1px)';

        //                var htmlDynamicProduct = `
        //                <div class="col-md-12 col-lg-12 col-sm-12 col-12 mt-2" data-order="${index}">
        //                    <div class="d-flex">
        //                        <input type="hidden" class="ClientProductMappingId" name="ClientProductMappingId" value="${product.ClientProductMappingId}" />
        //                        <div style="display: flex; align-items: center; width: 166px;">
        //                            <input type="checkbox" data-id="${product.ProductId}" name="products" value="${product.ProductName}" ${PrimaryCheck} id="product-${product.ProductId}">
        //                            <label for="product-${product.ProductId}" class="checkbox-label_1 ml-1">${product.ProductName}</label>
        //                        </div>
        //                        <div class="d-flex ml-3 blur-target">
        //                            <input type="text" class="form-control dynamicinput" placeholder="0.00" name="Amount" oninput="allowOnlyNumbersAndAfterDecimalTwoValForClient(this,8)" value="${product.SellingPrice || ''}" style="filter: ${blurStyle};" />
        //                            <select class="form-control dynamicinputselect" name="UnitId" style="filter: ${blurStyle};">
        //                                ${UnitSelectOptions}
        //                            </select>
        //                        </div>
        //                    </div>
        //                </div>`;

        //                resolve({ index, html: htmlDynamicProduct });
        //            });
        //        });
        //    });

        //    Promise.all(htmlPromises).then(results => {
        //        results.sort((a, b) => a.index - b.index);
        //        results.forEach(res => {
        //            $('#FormProductData #BindProductData').append(res.html);
        //        });
        //    });
        //} else {
        //    $('#FormProductData #BindProductData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        //}

        $('#ExistselectedFiles, #selectedFiles').empty("");
        var ulElement = $('#ExistselectedFiles');
        $.each(data[3], function (index, file) {
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

        //var htmlDynamicProduct = "";
        //if (data[4][0].FranchiseId != null && data[4][0].FranchiseId != "") {
        //    $.each(data[4], function (index, franchiseData) {
        //        var FranchiseMappingId = franchiseData.ClientFranchiseMappingId;
        //        var FranchiseId = franchiseData.FranchiseId;
        //        var FranchiseName = franchiseData.FranchiseName;
        //        var IsActiveCheck = franchiseData.IsSelected == true ? 'checked' : '';

        //        htmlDynamicProduct += `
        //        <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
        //            <lable class="FranchiseMappingId d-none">${FranchiseMappingId}</lable>
        //            <input type="checkbox" data-id="${FranchiseId}" name="products" ${IsActiveCheck} id="product-${FranchiseId}">
        //            <label for="product-${FranchiseId}" class="checkbox-label">${FranchiseName}</label>
        //        </div>
        //    `;
        //    });
        //    $('#FormFranchiseData #BindFranchiseData').append(htmlDynamicProduct);
        //}
        //else {
        //    $('#FormFranchiseData #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        //}

        //var numberIncrNotNull = 0;
        //if (data[5] != null && data[5].length > 0 && data[5][0].DistributorVisicoolarId != null) {

        //    $.each(data[5], function (index, value) {

        //        var matchingAttachments = data[6].filter(att => att.RowNumber === value.RowNumber);
        //        var existHtml = "";
        //        existHtml = matchingAttachments.map(att => {

        //            const truncatedFileName = att.Visi_AttachmentFileName.length > 10 ? att.Visi_AttachmentFileName.substring(0, 10) + '...' : att.Visi_AttachmentFileName;

        //            return `
        //                <li>
        //                    <span>${truncatedFileName}</span>
        //                    <a class="download-link" href="${att.Visi_AttachmentFilePath}" download="${att.Visi_AttachmentFileName}">
        //                        <i class="fas fa-download"></i>
        //                    </a>
        //                    <a src="${att.AttachmentFilePath}" attachmentid="${att.VisicoolarAttachmentId}" modulerefid="${att.DistributorVisicoolarId}"
        //                       id="deletefile" class="delete-buttonattach">
        //                        <i class="fas fa-trash"></i>
        //                    </a>
        //                </li>
        //            `;
        //        }).join('');

        //        var rowadd = $('.VisicoolerDynamic').length;
        //        var DynamicLableNo = rowadd + 1;


        //        let uniqueId = Math.random().toString(36).substring(2);
        //        numberIncrNotNull++;


        //        var html = `
        //            <div class="row VisicoolerDynamic">
        //                <div class="col-lg-9 col-md-9 col-sm-9 col-9 mt-2 d-flex flex-column mb-2">
        //                        <label class="DynamicLable">Visicooler ${DynamicLableNo}</label>
        //                        <label class="MappingVisicoolerDynamicLable d-none">${value.DistributorVisicoolarId}</label>
        //                    </div>
        //                <div class="col-md-4 col-lg-4 col-sm-4 col-6">
        //                    <div class="form-group">
        //                        <label>Visicooler Name<span id="Asterisk">*</span></label>
        //                        <input type="text" class="form-control VisicoolerName" id="VisicoolerName${uniqueId}" name="VisicoolerName${uniqueId}" maxlength="50" placeholder="Ex: Visicooler_1" required value="${value.VisicoolarName}" oninput="Common.removeInvalidFeedback(this)">
        //                    </div>
        //                </div>
        //                <div class="col-md-4 col-lg-4 col-sm-4 col-6">
        //                    <div class="form-group">
        //                        <label>Collabrated Date<span id="Asterisk">*</span></label>
        //                        <input type="date" class="form-control CollaboratedDate" id="CollaboratedDate${uniqueId}" name="CollaboratedDate${uniqueId}" required value="${formatDateForInput(value.CollaboratedDate)}" oninput="Common.removeInvalidFeedback(this)">
        //                    </div>
        //                </div>
        //                <div class="col-md-4 col-lg-4 col-sm-4 col-6">
        //                    <div class="form-group">
        //                        <label>Expiry Date<span id="Asterisk">*</span></label>
        //                        <input type="date" class="form-control ExpiryDate" id="ExpiryDate${uniqueId}" name="ExpiryDate${uniqueId}" required value="${formatDateForInput(value.ExpiryDate)}" oninput="Common.removeInvalidFeedback(this)">
        //                    </div>
        //                </div>
        //                <div class="col-md-4 col-lg-4 col-sm-4 col-6">
        //                    <div class="form-group">
        //                        <label>Amount<span id="Asterisk">*</span></label>
        //                        <input type="text" class="form-control VisicoolerAmount" placeholder="0.00" id="Amount${uniqueId}" required name="Amount${uniqueId}" oninput="Common.allowOnlyNumberLength(this,8);Common.removeInvalidFeedback(this)" value="${value.InvAmount}">
        //                    </div>
        //                </div>

        //               <div class="col-lg-7 col-md-7 col-sm-12 col-12 mt-2 d-flex flex-column">
        //                    <div class="border border-radius mt-2" style="background-color:#F1F0EF; max-height:10.5rem; height: 100px;">
        //                        <label class="d-flex justify-content-center align-content-center mt-1" style="text-decoration: underline; color: #7D7C7C; margin-left: 40px;" onclick="Attachment(${numberIncrNotNull})">
        //                            <b class="attachlabel" style="white-space: nowrap;margin-left: 4px;">Click Here to Attach your files</b>
        //                            <input type="file" id="fileInput${numberIncrNotNull}" multiple class="custom-file-input">
        //                        </label>
        //                        <div class="file-preview d-flex justify-content-center" id="preview${numberIncrNotNull}" style="margin-top: -8px;">
        //                            <div class="attachrow">
        //                                <div class="attachcolumn">
        //                                    <ul class="ExistFiles" id="selectedFiles${numberIncrNotNull}" style="margin-top: -3px; margin-bottom: 27px;"></ul>
        //                                </div>
        //                                <div class="attachcolumn existselectedFiles" style="margin-top: -32px;"><ul class="DynamicExistselectedFiles" id="ExistselectedFiles${numberIncrNotNull}">${existHtml}</ul></div>
        //                            </div>
        //                        </div>
        //                    </div>
        //                </div>
        //                <div class="col-lg-1 col-md-1 col-sm-1 col-1 p-1 removebtn thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
        //                    <button class="btn DynrowRemove" type="button" onclick="removeRow(this)">
        //                        <i class="fas fa-trash-alt"></i>
        //                    </button>
        //                </div>
        //            </div>
        //        `;
        //        $('#FormVisicooler').append(html);
        //        // Then handle setting the min date

        //        var $newRow = $('#FormVisicooler .VisicoolerDynamic').last();
        //        var $collabInput = $newRow.find('.CollaboratedDate');
        //        var $expiryInput = $newRow.find('.ExpiryDate');
        //        var collaboratedDateVal = $collabInput.val();

        //        if (collaboratedDateVal) {
        //            $expiryInput.attr('min', collaboratedDateVal);

        //            if ($expiryInput.val() && $expiryInput.val() < collaboratedDateVal) {
        //                $expiryInput.val('');
        //            }
        //        }
        //        updateRemoveButtonsVisicooler();
        //    });
        //} else {
        //    //duplicateVisicooler();
        //}



        $('#TransactionsHide').show();
        $('#TransactionsInfo').empty('');
        var html =
            `
         <div class="table-responsive">
             <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="Managetable"></table>
         </div>
         `;
        $('#TransactionsInfo').append(html);

        var columns = Common.bindColumn(data[3], ['PurchaseRequestId', 'Status_Color']);
        bindTableTransactionsInfo('Managetable', data[3], columns, -1, 'PurchaseRequestId', '151px', true);



        updateRemoveButtons();
    }
}

function formatDateForInput(dateStr) {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
}

$(document).on('change', '.CollaboratedDate', function () {
    var collaboratedDate = $(this).val();
    var $row = $(this).closest('.row');
    var $expiryDateInput = $row.find('.ExpiryDate');
    $expiryDateInput.val(collaboratedDate);
    //$expiryDateInput.attr('min', collaboratedDate);
    $expiryDateInput.val('');
});

$(document).on('click', '#CloseCanvas', function () {
    $("#ClientCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});

$(document).on('click', '.btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var clientId = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/DeleteClient", { ClientId: clientId }, ReloadSuccess, null);

    }
});

function duplicateRow() {

    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.Clientcontact').length
    var DynamicLableNo = rowadd + 1;

    if ((rowadd < 2)) {
        var htmlRow = `
            <div class="row Clientcontact">
             <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                <label class="DynamicLable">Contact Person ${DynamicLableNo}</label>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
                <div class="form-group account989">
                    <label>Contact Person Name<span id="Asterisk">*</span></label>
                    <div class="input-group">
                            <select class="form-control Salutation" id="Salutation ${numberIncr}" name="Salutation ${numberIncr}">
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                            </select>
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
            <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                <div>
                    <div class="d-flex align-items-center ml-4" style=" margin-top: 36px; ">
                        <input type="checkbox" name="IsPrimary${numberIncr}" class="form-check-input IsPrimary" id="IsPrimary${numberIncr}">
                        <label for="IsPrimary" class="text-black ml-2">IsPrimary</label>
                    </div>
                </div>
                <div class="d-flex justify-content-start isprimaryerror">
                    <div id="IsPrimaryError" class="d-none">
                        <span class="text-danger">Primary is required.</span>
                    </div>
                </div>
            </div>

            <div class="col-lg-3 col-md-3 col-sm-3 col-3 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                    <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
           `;

        $('#FormContactClient').append(htmlRow);
        setPrimaryCheckboxEventListeners();
        updateRemoveButtons();
    }
}

function updateRowLabels() {
    $('.Clientcontact').each(function (index) {
        // Update the label text with the correct row number
        $(this).find('.DynamicLable').text('Contact Person ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.Clientcontact');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow');
        if (rows.length == 1) {
            removeButtonDiv.css('display', 'none');
        } else {
            removeButtonDiv.css('display', 'block');
        }
    });
}

function removeRow(button) {
    var totalRows = $('.Clientcontact').length;
    if (totalRows > 1) {
        $(button).closest('.Clientcontact').remove();
        updateRowLabels();
        updateRemoveButtons();
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

function isPrimaryChecked(SelectId, SelectClass) {
    var inputVal = $('#' + SelectId).val();
    if (inputVal == "2") {
        return true;
    }
    var isChecked = false;
    $('.' + SelectClass).each(function () {
        var checkbox = $(this).find('.IsPrimary');
        if (checkbox.prop('checked')) {
            isChecked = true;
            return false;
        }
    });
    if (!isChecked) {
        $('#IsPrimaryError').removeClass('d-none');
    } else {
        $('#IsPrimaryError').addClass('d-none');
    }
    return isChecked;
}

function setPrimaryCheckboxEventListeners() {
    $('.IsPrimary').off('change').on('change', function () {
        if ($(this).prop('checked')) {
            $('.IsPrimary').not(this).prop('checked', false);
            $('#IsPrimaryError').addClass('d-none');
        } else {
            $('#IsPrimaryError').removeClass('d-none');
        }
    });
}

/*==========================================================================Shop=================================================================================*/

$(document).on('click', '.btn-Shop', function () {
    var windowWidth = $(window).width();
    Common.removevalidation('FormShop');
    $('#FormContactShop #BindContactShop').empty("");
    Common.removeMessage('FormShop');
    $('#FormContactShop #BindContactShop').empty("");
    $('#VisicoolerHideShop').removeClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2').addClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2');
    $('#hideActive').hide();
    $('#ShopModal').show();
    $('#ShoptilteModal').text('Shop Details');
    $('#ShopCountry').val('India');
    $('#ShopStateId').val('32');
    $('#SaveShop').text('Save').addClass('btn-success').removeClass('btn-update');
    duplicateShopRow();
    $('#ShopEmail-error').remove();
    clientId = $(this).data('id');
    Common.ajaxCall("GET", "/Contact/GetShop", { ShopId: null, DistributorId: clientId }, ShopSuccess, null);
});

$(document).on('click', '#AddShop', function () {
    shoptId = 0;
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#ShopCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#ShopCanvas").css("width", "50%");
    } else {
        $("#ShopCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingShop();
    $("#ShopHeader").text('Shop Details');
    $('#fadeinpage').addClass('fadeoverlay');
    Common.removevalidation('FormShop');
    $('#FormShop #ShopStateId').val('32');
    $('#FormShop #ShopCountry').val('India');
    $('#FormContactShop #BindContactShop').empty("");
    duplicateShopRow();
    $('#SaveShop').text('Save').removeClass('btn-update').addClass('btn-success');
    $('#ShopCanvas').css(
        { 'z-index': '99999991' }
    );
    $('#fadeinpage').css(
        { 'z-index': '1000014' }
    );
    $('#ShopEmail-error').remove();
    $('#VisicoolerHideShop').removeClass('col-md-3 col-lg-3 col-sm-3 col-6 mt-2').addClass('col-md-6 col-lg-6 col-sm-6 col-6 mt-2');
    $('#hideActive').hide();
});

$(document).on('click', '#CloseShopCanvas', function () {
    $("#ShopCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
    Common.removevalidation('FormShop');
    $('#FormContactShop #BindContactShop').empty("");
    $('#ShopCanvas').css(
        { 'z-index': '999950' }
    );
    $('#fadeinpage').css(
        { 'z-index': '999945' }
    );
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
        objvalue.DistributorId = parseInt(clientId) || null;
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


function ShopSuccess(response) {
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

        $("#ShopCounterBoxName1").text(CounterBox[0]);
        $("#ShopCounterBoxName2").text(CounterBox[1]);
        $("#ShopCounterBoxName3").text(CounterBox[2]);
        $("#ShopCounterBoxName4").text(CounterBox[3]);

        $('#ShopCounterBoxValue1').text(dataShop[0][0][CounterBox[0]]);
        $('#ShopCounterBoxValue2').text(dataShop[0][0][CounterBox[1]]);
        $('#ShopCounterBoxValue3').text(dataShop[0][0][CounterBox[2]]);
        $('#ShopCounterBoxValue4').text(dataShop[0][0][CounterBox[3]]);

        $('#ShopModal .table-responsive').empty('');
        var html = `
            <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ShopTable"></table>
        `
        $('#ShopModal .table-responsive').append(html);
        var columns = Common.bindColumn(dataShop[1], ['ShopId', 'Status_Color']);
        bindTableShop('ShopTable', dataShop[1], columns, -1, 'ShopId', '150px', true, access);
    }
}


function ShopInsertUpdateSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#ShopCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.removevalidation('FormShop');
        $('#FormContactShop #BindContactShop').empty("");
        Common.ajaxCall("GET", "/Contact/GetShop", { ShopId: null, DistributorId: clientId }, ShopSuccess, null);
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
        $("#ShopCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#ShopCanvas").css("width", "50%");
    } else {
        $("#ShopCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingShop();
    $('#ShopEmail-error').remove();
    $("#ShopHeader").text('Edit Shop');
    Common.removevalidation('FormShop');
    $('#fadeinpage').addClass('fadeoverlay');
    $('#SaveShop').text('Update').removeClass('btn-success').addClass('btn-update');
    Common.ajaxCall("GET", "/Contact/GetShop", { ShopId: shoptId, DistributorId: clientId }, ShopNotNullSuccess, null);
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

        //if (headerText === "Franchise Mapping Info") {
        //    var checkboxes = currentAccordion.find('input[type="checkbox"]');
        //    var anyChecked = checkboxes.is(':checked');
        //    if (!anyChecked) {
        //        isCurrentValid = false;
        //        isFormValid = false;
        //        if (!currentAccordion.find('.checkbox-error').length) {
        //            currentAccordion.find('#BindFranchiseData').append(
        //                '<div class="invalid-feedback checkbox-error d-flex justify-content-center">Please select at least one franchise</div>'
        //            );
        //        }

        //        if (!firstInvalidAccordion) {
        //            firstInvalidAccordion = currentAccordion;
        //        }
        //    } else {
        //        currentAccordion.find('.checkbox-error').remove();
        //    }
        //}

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

$(document).on("input", '#FormClient #Email', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormClient', 'Email')) {
        $('#FormClient #Email-error').remove();
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


function bindTableForClient(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
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
                                                    <img class="btn-Shop" src="/assets/moduleimages/contact/cart-shopping.svg" data-id="${row[editcolumn]}" title="Shop" />
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

    if ($('.scroll-scrolly_visible .nav-item .activesubmenu').text().trim() == "Distributor MS") {
        $('.btn-Shop').hide();
    } else {
        $('.btn-Shop').show();
    } 
}
  
function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    //$('#' + tableid).DataTable().clear().destroy();
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

    var renderColumn = [];
    if (access.update || access.delete) {
        renderColumn.push(
            {
                targets: actionTarget,
                render: function (data, type, row, meta) {
                    var editCondition = access.update;
                    var deleteCondition = access.delete;
                    if (editCondition || deleteCondition) {
                        return `
                                 ${editCondition ? `<i class="btn-editshop mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-deleteshop alert_delete mx-1"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
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
        var table1 = $('.tableResponsive').DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}

function bindTableShop(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    //$('#' + tableid).DataTable().clear().destroy();
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

var numberIncr = 0;
//function duplicateVisicooler() {
//    numberIncr++;
//    var rowadd = $('.VisicoolerDynamic').length;
//    var DynamicLableNo = rowadd + 1;

//    var html = `
//        <div class="row VisicoolerDynamic">
//            <div class="col-lg-9 col-md-9 col-sm-9 col-9 mt-2 d-flex flex-column mb-2">
//                    <label class="DynamicLable">Visicooler ${DynamicLableNo}</label>
//                    <label class="MappingVisicoolerDynamicLable d-none"></label>
//                </div>
//            <div class="col-md-4 col-lg-4 col-sm-4 col-6">
//                <div class="form-group">
//                    <label>Visicooler Name<span id="Asterisk">*</span></label>
//                    <input type="text" class="form-control VisicoolerName" id="VisicoolerName${numberIncr}" name="VisicoolerName${numberIncr}" required maxlength="50" placeholder="Ex: Visicooler_1" oninput="Common.removeInvalidFeedback(this)">
//                </div>
//            </div>
//            <div class="col-md-4 col-lg-4 col-sm-4 col-6">
//                <div class="form-group">
//                    <label>Collabrated Date<span id="Asterisk">*</span></label>
//                    <input type="date" class="form-control CollaboratedDate" id="CollaboratedDate${numberIncr}" name="CollaboratedDate${numberIncr}" required oninput="Common.removeInvalidFeedback(this)">
//                </div>
//            </div>
//            <div class="col-md-4 col-lg-4 col-sm-4 col-6">
//                <div class="form-group">
//                    <label>Expiry Date<span id="Asterisk">*</span></label>
//                    <input type="date" class="form-control ExpiryDate" id="ExpiryDate${numberIncr}" name="ExpiryDate${numberIncr}" required oninput="Common.removeInvalidFeedback(this)">
//                </div>
//            </div>
//            <div class="col-md-4 col-lg-4 col-sm-4 col-6">
//                <div class="form-group">
//                    <label>Amount<span id="Asterisk">*</span></label>
//                    <input type="text" class="form-control VisicoolerAmount" placeholder="0.00" id="Amount${numberIncr}" name="Amount${numberIncr}" required oninput="Common.allowOnlyNumberLength(this,8);Common.removeInvalidFeedback(this)">
//                </div>
//            </div>

//            <div class="col-lg-7 col-md-7 col-sm-12 col-12 mt-2 d-flex flex-column">
//                <div class="border border-radius mt-2" style="background-color:#F1F0EF; max-height:10.5rem; height: 100px;">
//                    <label class="d-flex justify-content-center align-content-center mt-1"
//                           style="text-decoration: underline; color: #7D7C7C;"
//                           onclick="Attachment(${numberIncr})">
//                        <b class="attachlabel" style="white-space: nowrap; margin-left: 4px;">Click Here to Attach your files</b>
//                        <input type="file" id="fileInput${numberIncr}" multiple class="custom-file-input" hidden>
//                    </label>
//                    <div class="file-preview d-flex justify-content-center" id="preview${numberIncr}" style="margin-top: -8px;">
//                        <div class="attachrow">
//                            <div class="attachcolumn">
//                                <ul id="selectedFiles${numberIncr}" style="margin-top: -3px; margin-bottom: 27px;"></ul>
//                            </div>
//                            <div class="attachcolumn existselectedFiles" style="margin-top: -32px;">
//                                <ul class="DynamicExistselectedFiles" id="ExistselectedFiles"></ul>
//                            </div>
//                        </div>
//                    </div>
//                </div>
//            </div>

//            <div class="col-lg-1 col-md-1 col-sm-1 col-1 p-1 removebtn thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'}">
//                <button class="btn DynrowRemove" type="button" onclick="removeRow(this)">
//                    <i class="fas fa-trash-alt"></i>
//                </button>
//            </div>
//        </div>
//    `;
//    $('#FormVisicooler').append(html);
//    updateRemoveButtonsVisicooler();
//}

function updateRowLabelsVisicooler() {
    $('.VisicoolerDynamic').each(function (index) {
        $(this).find('.DynamicLable').text('Visicooler ' + (index + 1));
    });
}

function updateRemoveButtonsVisicooler() {
    var rows = $('.VisicoolerDynamic');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow');
        if (rows.length == 1) {
            removeButtonDiv.css('display', 'none');
        } else {
            removeButtonDiv.css('display', 'block');
        }
    });
}

function removeRow(button) {
    var totalRows = $('.VisicoolerDynamic').length;
    if (totalRows > 1) {
        $(button).closest('.VisicoolerDynamic').remove();
        updateRowLabelsVisicooler();
        updateRemoveButtonsVisicooler();
    }
}

/*====================================dynamic Attachment====================================*/

let fileList = []; // Franchise selected files
function Attachment(Unique) {
    const fileInput = document.getElementById(`fileInput${Unique}`);
    const preview = document.getElementById('preview');
    const selectedFiles = document.getElementById(`selectedFiles${Unique}`);

    // Remove any existing event listener before adding a new one
    fileInput.replaceWith(fileInput.cloneNode(true));
    const newFileInput = document.getElementById(`fileInput${Unique}`);

    newFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);

        // Only add new files that are not already in the list
        files.forEach((file) => {
            if (!fileList.some(f => f.name === file.name)) {
                fileList.push(file);
                addFileToUI(file, selectedFiles);
                formDataMultiple.append('files[]', file); // Use 'file' directly
            }
        });

        preview.style.display = fileList.length > 0 ? 'block' : 'none';
    });
}

// Function to add file details to UI
function addFileToUI(file, selectedFiles) {
    const fileItem = document.createElement('li');
    const fileName = document.createElement('span');
    const downloadButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    fileName.textContent = file.name.length > 10 ? file.name.substring(0, 11) + '...' : file.name;


    downloadButton.type = 'button';
    deleteButton.type = 'button';

    downloadButton.innerHTML = `<i class="fas fa-download" data-id="${file.name}"></i>`;
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
        fileList = fileList.filter(f => f.name !== file.name);
        fileItem.remove();

        let newFormData = new FormData();
        fileList.forEach(f => newFormData.append('files[]', f));

        formDataMultiple = newFormData;

        if (fileList.length === 0) {
            document.getElementById('preview').style.display = 'none';
        }
    });

    fileItem.appendChild(fileName);
    fileItem.appendChild(downloadButton);
    fileItem.appendChild(deleteButton);

    selectedFiles.appendChild(fileItem);
}

function CanvasOpenFirstShowing() {
    $('#ClientCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse3, #collapse4, #collapse5, #collapse6, #collapse7').collapse('hide');
    $('#ClientCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#ClientCanvas').offset().top
    }, 'fast');
}

function CanvasOpenFirstShowingShop() {
    $('#ShopCanvas').addClass('show');
    $('#ShopCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#ShopCanvas').offset().top
    }, 'fast');
}
function allowOnlyNumbersAndAfterDecimalTwoValForClient(inputElement, maxLength) {
    let cleanedValue = inputElement.value.replace(/[^\d.]/g, '');
    let parts = cleanedValue.split('.');
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 8) : '';
    if (integerPart.length > maxLength) {
        integerPart = integerPart.slice(0, maxLength);
    }
    let resultValue = integerPart + decimalPart;
    inputElement.value = resultValue;
}




function bindTableTransactionsInfo(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isbuyernocount = data[0].hasOwnProperty('TetroONEnocount');
    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

    if (isAction == true && data != null && data.length > 0 && !isbuyernocount) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    } else {
        columns.push({
            "data": "Action", "name": "Action", "autoWidth": true, "title": "Action", orderable: false, visible: false
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
        },

    ];


    renderColumn.push(
        {
            targets: actionTarget,
            render: function (data, type, row, meta) {
                return `<td>
                            <div class="actionEllipsis">
                                <i class="edity mx-1" data-id="${row[editcolumn]}" title="Edit">
                                    <img src="/assets/CommonImages/eye_icon.svg" alt="View">
                                </i>
                            </div>
                        </td> `;
            }
        }
    )


    var dataTableOptions = {
        "dom": "Blfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !isbuyernocount ? data : [],
        "columns": columns,
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "scrollX": true,
        "scroller": true,
        "scrollCollapse": true,
        "aaSorting": [],
        "language": {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        },
        "searching": false,
        "info": false,
        "paging": false,
        "pageLength": 30,
        //"lengthMenu": [5, 10, 25, 50],
        "columnDefs": renderColumn
    };
    $('#' + tableid).DataTable(dataTableOptions);
    var tableId = $('#' + tableid).DataTable();
    Common.autoAdjustColumns(tableId);

}