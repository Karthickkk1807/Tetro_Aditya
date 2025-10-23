
Inventory = {
    BillFromAddressDetails: async function (response) {
        if (response) {
            var data = JSON.parse(response); 
            $("#BillFromAddress").text(data[0][0].BillFromAddress || ''); 
        }
    },

    BankCanvasOpen: function () {
        var AccountName = $("#AddBankDetails #AccountName").text();
        var BankName = $("#AddBankDetails #BankName").text();
        var BranchName = $("#AddBankDetails #BranchName").text();
        var AccountNo = $("#AddBankDetails #AccountNo").text();
        var AccountType = $("#AddBankDetails #AccountType").text();
        var IFSCCode = $("#AddBankDetails #IFSCCode").text();
        var UPIID = $("#AddBankDetails #UPIID").text();

        $(".bankCanvas #AccountName").val(AccountName);
        $(".bankCanvas #BankName").val(BankName);
        $(".bankCanvas #BranchName").val(BranchName);
        $(".bankCanvas #AccountNo").val(AccountNo);
        $(".bankCanvas #AccountType").val(AccountType);
        $(".bankCanvas #IFSCCode").val(IFSCCode);
        $(".bankCanvas #UPIID").val(UPIID);

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $(".bankCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $(".bankCanvas").css("width", "60%");
        } else {
            $(".bankCanvas").css("width", "35%");
        }
        $('.content-overlay').fadeIn();
    },
    BankCanvasClose: function () {
        $(".vendorCanvas,.bankCanvas").css("width", "0%");
        $('.content-overlay').fadeOut();
    },
    BillingAddressDetails: function (response) {
        debugger;
        if (response.status) {
            var data = JSON.parse(response.data);
            $("#AddBankDetails #AccountName").text(data[0][0].AccountName ? data[0][0].AccountName : "-----");
            $("#AddBankDetails #BankName").text(data[0][0].BankName ? data[0][0].BankName : "-----");
            $("#AddBankDetails #BranchName").text(data[0][0].BranchName ? data[0][0].BranchName : "-----");
            $("#AddBankDetails #AccountNo").text(data[0][0].AccountNumber ? data[0][0].AccountNumber : "-----");
            $("#AddBankDetails #AccountType").text(data[0][0].AccountType ? data[0][0].AccountType : "-----");
            $("#AddBankDetails #IFSCCode").text(data[0][0].IFSCCode ? data[0][0].IFSCCode : "-----");
            $("#AddBankDetails #UPIID").text(data[0][0].UPIId ? data[0][0].UPIId : "-----");
        }
    },
    BankDetailsUpdate: function (successCallback, errorCallback) {
        debugger;
        var moduleId = $('#Vendor').val();
        if (moduleId == undefined || moduleId == '') {
            moduleId == null;
        }
        else {
            parseInt(moduleId);
        }
        var BankAddressDetails = {
            //ModuleId: $(".bankCanvas #ModuleId").val() || null,
            ModuleId: moduleId,
            ModuleName: $(".bankCanvas #ModuleName").val() || null,
            AccountName: $(".bankCanvas #AccountName").val(),
            BankName: $(".bankCanvas #BankName").val(),
            BranchName: $(".bankCanvas #BranchName").val(),
            AccountNumber: $(".bankCanvas #AccountNo").val(),
            AccountType: $(".bankCanvas #AccountType").val(),
            IFSCCode: $(".bankCanvas #IFSCCode").val(),
            UPIId: $(".bankCanvas #UPIID").val(),
        };

        $.ajax({
            type: "POST",
            url: "/PurchaseOrder/UpdateBankInfo",
            data: JSON.stringify(BankAddressDetails),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: false,
            success: function (response) {
                successCallback(response);
            },
            error: function (error) {
                errorCallback(error);
            },
        });
    },
    handleBankUpdateSuccess: function (response, EditDataId) {
        debugger;
        Common.successMsg(response.message);

        Common.ajaxCall("GET", "/Common/GetBillingAddressDetails", EditDataId, Inventory.BillingAddressDetails, null);
        Inventory.BankCanvasClose();
    },
    handleBankUpdateError: function (response) {
        let message = 'An error occurred.';
        if (response && response.message) {
            message = response.message;
        }
        $('#loader-pms').hide();
        Common.errorMsg(message);
    },
    EditVendorAddressCanvasOpen: function () {

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#BillAddressCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#BillAddressCanvas").css("width", "60%");
        } else {
            $("#BillAddressCanvas").css("width", "35%");
        }
        $('.content-overlay').fadeIn();
    },
    EditVendorAddressCanvasClose: function () {
        $("#BillAddressCanvas,.bankCanvas").css("width", "0%");
        $('.content-overlay').fadeOut();
        Common.removevalidation('BillingAddressForm');
    },
    VendorDetailsLabeltoCanvas: function () {
        var $vendorColumn = $("#VendorColumn");

        var VendorName = $("#VendorColumn #Vendor option:selected").text().trim();

        var VendorAddress = $vendorColumn.find("#VendorAddress").text().trim();
        var VendorCountry = $vendorColumn.find("#VendorCountry").text().trim();
        var VendorCityText = $vendorColumn.find("#VendorCity").text().trim();
        var VendorStateName = $vendorColumn.find("#VendorStateName").text().trim();
        var VendorEmail = $vendorColumn.find("#VendorEmail").text().trim();
        var VendorContactNumber = $vendorColumn.find("#VendorContactNumber").text().trim();
        var VendorGSTNumber = $vendorColumn.find("#VendorGSTNumber").text().trim();

        // Splitting city and zip code safely
        var cityParts = VendorCityText.split('-');
        var VendorCity = cityParts.length > 1 ? cityParts[0].trim() : VendorCityText;
        var VendorZipCode = cityParts.length > 1 ? cityParts[1].trim() : "";

        var $billingBody = $("#BillingAddressBody");

        $billingBody.find("#StoreName").val(VendorName);
        $billingBody.find("#StoreAddress").val(VendorAddress);
        $billingBody.find("#StoreCountry").val(VendorCountry);
        $billingBody.find("#StoreCity").val(VendorCity);
        $billingBody.find("#StoreZipcode").val(VendorZipCode);
        $billingBody.find("#StoreEmail").val(VendorEmail);
        $billingBody.find("#StoreContactNumber").val(VendorContactNumber);
        $billingBody.find("#StoreGSTNumber").val(VendorGSTNumber);


        $("#StateIdOFfCanvas option").each(function () {
            if ($(this).text().trim().toLowerCase() === VendorStateName.toLowerCase()) {
                $("#StateIdOFfCanvas").val($(this).val()).trigger("change");
            }
        }); 
        Inventory.EditVendorAddressCanvasOpen(); 
    },

    VendorAddressUpdate: function () {

        var FormBillingAddress = $('#BillingAddressForm').validate().form();
        var BillingAddressUpdate = {};
        var vendorID = $('#VendorColumn #Vendor').val();
        var stateId = $('#BillingAddressForm #StateIdOFfCanvas').val();
        if (FormBillingAddress) {
            BillingAddressUpdate = {
                VendorId: parseInt(vendorID),
                Name: $('#BillingAddressBody #StoreName').val(),
                Address: $('#BillingAddressBody #StoreAddress').val(),
                City: $('#BillingAddressBody #StoreCity').val(),
                Zipcode: $('#BillingAddressBody #StoreZipcode').val(),
                StateId: parseInt(stateId),
                ContactNumber: $('#BillingAddressBody #StoreContactNumber').val(),
                Country: $('#BillingAddressBody #StoreCountry').val(),
                Email: $('#BillingAddressBody #StoreEmail').val(),
                GSTNumber: $('#BillingAddressBody #StoreGSTNumber').val(),
            };
        }
        else {
            console.log("Form validation failed.");
            return false;
        }
        $.ajax({
            type: "POST",
            url: "/PurchaseOrder/UpdateVendorDetail",
            data: JSON.stringify(BillingAddressUpdate),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: false,
            success: function (response) {
                if (response.status == true) {
                    Common.successMsg(response.message);
                    Common.removevalidation('BillingAddressForm');
                    Inventory.EditVendorAddressCanvasClose();
                    $('#Vendor').val(vendorID).trigger('change');
                } else {
                    Common.errorMsg(response.message);
                }
            },
            error: function (response) {
                Common.errorMsg(response.message);
            },
        });
    },
    VendorAddressDetails: async function (response) {
        if (response) {
            var data = JSON.parse(response);
            $("#VendorColumn #VendorName").text(data[0][0].VendorName || '');
            $("#VendorColumn #VendorAddress").text(data[0][0].Address || '');
            $("#VendorColumn #VendorCountry").text(data[0][0].Country || '');
            $("#VendorColumn #VendorStateName").text(data[0][0].StateName || '');
            $("#VendorColumn #VendorEmail").text(data[0][0].Email || '');
            $("#VendorColumn #VendorContactNumber").text(data[0][0].ContactNumber || '');
            $("#VendorColumn #VendorGSTNumber").text(data[0][0].GSTNumber || '');
            $("#VendorColumn #StateIdGet").text(data[0][0].StateId);

            var city = data[0][0].City || '';
            var zipCode = data[0][0].ZipCode || '';

            // Check if both City and ZipCode are non-empty before concatenating the dash
            var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
            $("#VendorColumn #VendorCity").text(cityName || '');

            //$('#AddAttachment').hide();
            //$('#AddAttachLable').show();
            //$('#HideAttachlable').hide();
        }
    },
    ClearDataForVendorAddressDetails: function () {
        $("#VendorColumn #VendorName").text('');
        $("#VendorColumn #VendorAddress").text('');
        $("#VendorColumn #VendorCountry").text('');
        $("#VendorColumn #VendorStateName").text('');
        $("#VendorColumn #VendorCity").text('');
        $("#VendorColumn #VendorEmail").text('');
        $("#VendorColumn #VendorContactNumber").text('');
        $("#VendorColumn #VendorGSTNumber").text('');
    },
    ClearDataForShipToAddressDetails: function () {
        $("#ShippingColumn #StoreName").text('');
        $("#ShippingColumn #StoreAddress").text('');
        $("#ShippingColumn #StoreIdVal").text('');
        $("#ShippingColumn #StateName").text('');
        $("#ShippingColumn #StoreContactNumber").text('');
        $("#ShippingColumn #StoreZipCode").text('');
        $("#ShippingColumn #StoreCity").text('');
        $("#ShippingColumn #StoreNoId").text('');

        $('.ShippingAddressIcon').hide();
    },
    CompanyAddressInPurchase: function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);

            $("#ShippingColumn #StoreName").text(data[0][0].CompanyName || '');
            $("#ShippingColumn #StoreAddress").text(data[0][0].Address || '');
            $("#ShippingColumn #StoreCity").text(data[0][0].City || '');
            $("#ShippingColumn #StateName").text(data[0][0].State || '');
            $("#ShippingColumn #StoreContactNumber").text(data[0][0].ContactNumber || '');
            //$("#ShippingColumn #VendorContactNumber").text(data[0][0].ContactNumber || '');
            //$("#ShippingColumn #VendorGSTNumber").text(data[0][0].GSTNumber || '');
            $("#ShippingColumn #StateId").text(data[0][0].StateId);

        }
    },
    ShipToLocationChange: function () {
        debugger;

        var ShipTypeText = $('#ShipType').val();
        var ShipingId = $("#ShipToLocation").val();

        if (ShipTypeText === 'Warehouse') {
            if (ShipingId != "") {
                var editeWareHouseId = { WareHouseId: ShipingId };
                Common.ajaxCall("GET", "/PurchaseInvoice/ShippingAddressForWareHouseId", editeWareHouseId, Inventory.ShippingLocationSuccess, null);
            }
            else if (ShipingId == "") {
                Inventory.ClearDataForShipToAddressDetails();
            }
        }
        else if (ShipTypeText === 'Store') {
            if (ShipingId != "") {
                var editeStoreId = { StoreId: ShipingId };
                Common.ajaxCall("GET", "/PurchaseInvoice/ShippingAddressForStoreId", editeStoreId, Inventory.ShippingLocationSuccess, null);
            }
            else if (ShipingId == "") {
                Inventory.ClearDataForShipToAddressDetails();
            }
        }
    },
    ShippingLocationSuccess: function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            $("#ShippingColumn #StoreName").text(data[0][0].StoreName);
            $("#ShippingColumn #StoreAddress").text(data[0][0].StoreAddress);
            $("#ShippingColumn #StateName").text(data[0][0].StateName);
            $("#ShippingColumn #StoreContactNumber").text(data[0][0].StoreContactNumber);
            $("#ShippingColumn #StoreZipCode").text(data[0][0].StoreZipCode);
            $("#ShippingColumn #StateId").text(data[0][0].StateCodeId);

            $("#ShippingColumn #StoreNoId").text(data[0][0].StoreId);

            var city = data[0][0].StoreCity + " - " + data[0][0].StoreZipCode
            $("#ShippingColumn #StoreCity").text(city);

            $('.ShippingAddressIcon').show();
        }
    },
    ShipTypeChange: function () {

        var ShipTypeText = $("#ShipType").val();

        if (ShipTypeText === 'Warehouse') {
            $('#ShipToLocation').prop('disabled', false);
            Common.bindDropDown('ShipToLocation', 'UserWareHouse');
        }
        else if (ShipTypeText === 'Store') {
            $('#ShipToLocation').prop('disabled', false);
            Common.bindDropDown('ShipToLocation', 'UserStore');
        }
        else if (ShipTypeText === '') {
            $('#ShipToLocation').empty().append('<option value="">-- Select --</option>');
            $('#ShipToLocation').prop('disabled', true);
        }

        $('.ShippingAddressIcon').hide();
        Inventory.ClearDataForShipToAddressDetails();
    },
    forShipToLocationClear: function () {
        $('#ShipToLocation').val('');
        $('#ShipToLocation').prop('disabled', false);
        $('.ShippingAddressIcon').hide();
        Inventory.ClearDataForShipToAddressDetails();
    },
    EditStoreAddressCanvasOpen: function () {

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#StoreCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#StoreCanvas").css("width", "60%");
        } else {
            $("#StoreCanvas").css("width", "30%");
        }
        $('.content-overlay').fadeIn();
    },
    EditStoreAddressCanvasClose: function () {
        $("#StoreCanvas").css("width", "0%");
        $('.content-overlay').fadeOut();
        Common.removevalidation('StoreWareAddressForm');
    },
    StoreAddressLabeltoCanvas: function () {
        var StoreName = $("#ShippingColumn #StoreName").text();
        var StoreAddress = $("#ShippingColumn #StoreAddress").text();
        var StoreContactNumber = $("#ShippingColumn #StoreContactNumber").text();
        var StoreCity = $("#ShippingColumn #StoreCity").text().split('-')[0];
        var StoreZipCode = $("#ShippingColumn #StoreCity").text().split('-')[1];
        var StoreStateName = $('#ShippingColumn #StateName').text();
        var stateId = $('#ShippingColumn #StateId').text();

        $('#StoreAddressBody #StoreName').val(StoreName);
        $('#StoreAddressBody #StoreAddress').val(StoreAddress);
        $('#StoreAddressBody #StoreContactNumber').val(StoreContactNumber);
        $('#StoreAddressBody #StoreCity').val(StoreCity);
        $('#StoreAddressBody #StoreZipCode').val(StoreZipCode);
        $("#StoreAddressBody #StateId").val(StoreStateName);

        $('#StoreAddressBody #StateId').select2({
            dropdownParent: $('#StoreAddressBody')
        });
        if (StoreStateName != null && StoreStateName !== "") {
            Common.bindDropDownParent('StateId', 'StoreCanvas', 'State', function () {
                $("#StoreCanvas #StateId").val(stateId).trigger('change');
            });
        } else {
            $('#StoreCanvas #StateId').empty().append('<option value="">--Select--</option>').trigger('change');
        }

        Inventory.EditStoreAddressCanvasOpen();
    },
    StoreAddressUpdate: function () {

        var StoreWareAddressFormIsValid = $("#StoreWareAddressForm").validate().form();

        if (!StoreWareAddressFormIsValid) {
            return false;
        }

        var StoreId = $("#ShippingColumn #StoreNoId").text();
        var StoreWareName = $('#ShippingColumn  #ShipType').val();
        var stateId = $('#StoreAddressBody #StateId').val();

        if (StoreWareName === 'Warehouse') {
            var InsertData = JSON.parse(JSON.stringify(jQuery('#StoreWareAddressForm').serializeArray()));
            var objvalue = {};
            $.each(InsertData, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.StoreId = parseInt(StoreId);
            objvalue.StateCodeId = parseInt(stateId);
            objvalue.StoreName = $('#StoreWareAddressForm #StoreName').val();
            Common.ajaxCall("POST", "/PurchaseInvoice/UpdateWareHouseInfoDetails", JSON.stringify(objvalue), Inventory.StoreWareEidtAddressSuccess, null);
        }
        else if (StoreWareName === 'Store') {
            var InsertData = JSON.parse(JSON.stringify(jQuery('#StoreWareAddressForm').serializeArray()));
            var objvalue = {};
            $.each(InsertData, function (index, item) {
                objvalue[item.name] = item.value;
            });
            objvalue.StoreId = parseInt(StoreId);
            objvalue.StateCodeId = parseInt(stateId);
            objvalue.StoreName = $('#StoreWareAddressForm #StoreName').val();
            Common.ajaxCall("POST", "/PurchaseInvoice/UpdateStoreForShippingDetails", JSON.stringify(objvalue), Inventory.StoreWareEidtAddressSuccess, null);
        }
    },
    StoreWareEidtAddressSuccess: function (response) {
        if (response.status) {
            Common.successMsg(response.message);
            Inventory.EditStoreAddressCanvasClose();
            Common.removevalidation('StoreWareAddressForm');
            var IdChange = $('#ShippingColumn #StoreNoId').text();
            $('#ShipToLocation').val(IdChange).trigger('change');;
        }
        else {
            Common.errorMsg(response.message);
        }
    },
    ShippingColumnClearData: function () {
        $('#TakeId').empty().append('<option value="">-- Select --</option>').trigger('change');
        $('#TakeId').prop('disabled', false);
        $("#ShippingColumn #ShippingName").text('');
        $("#ShippingColumn #ShippingAddress").text('');
        $("#ShippingColumn #ShippingCountry").text('');
        $("#ShippingColumn #ShippingPlaceOfSupply").text('');
        $("#ShippingColumn #ShippingEmail").text('');
        $("#ShippingColumn #ShippingMobileNumber").text('');
        $("#ShippingColumn #ShippingGSTNumber").text('');
        $("#ShippingColumn #ShippingStateId").text('');
        $("#ShippingColumn #ShippingCity").text('');
    },
    ClientColumnClearData: function () {
        $("#ClientColumn #ClientName").text('');
        $("#ClientColumn #ClientAddress").text('');
        $("#ClientColumn #ClientCountry").text('');
        $("#ClientColumn #ClientPlaceOfSupply").text('');
        $("#ClientColumn #ClientEmail").text('');
        $("#ClientColumn #ClientMobileNumber").text('');
        $("#ClientColumn #ClientGSTNumber").text('');
        $("#ClientColumn #ClientStateId").text('');
        $("#ClientColumn #ClientCity").text('');
        $('#ClientColumn #Check').prop('checked', false);
    },
    ClientAddressDetails: async function (response) {

        if (response) {
            var isChecked = $('#Check').prop('checked');

            if (isChecked == true) {
                var data = JSON.parse(response);
                $("#ClientColumn #ClientName").text(data[0][0].ClientName || '');
                $("#ClientColumn #ClientAddress").text(data[0][0].Address || '');
                $("#ClientColumn #ClientCountry").text(data[0][0].Country || '');
                $("#ClientColumn #ClientPlaceOfSupply").text(data[0][0].StateName || '');
                $("#ClientColumn #ClientEmail").text(data[0][0].Email || '');
                $("#ClientColumn #ClientMobileNumber").text(data[0][0].ContactNumber || '');
                $("#ClientColumn #ClientGSTNumber").text(data[0][0].GSTNumber || '');
                $("#ClientColumn #ClientStateId").text(data[0][0].StateId || '');

                var city = data[0][0].City || '';
                var zipCode = data[0][0].ZipCode || '';

                // Check if both City and ZipCode are non-empty before concatenating the dash
                var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
                $("#ClientColumn #ClientCity").text(cityName || '');

                var ClientId = $('#ClientColumn #ClientId').val();
                $('#TakeId').append('<option value="' + ClientId + '">' + $('#ClientId option:selected').text() + '</option>');
                $('#TakeId').val(ClientId);

                Inventory.ShippingColumnBindData(data);
            }
            else {
                var data = JSON.parse(response);
                $("#ClientColumn #ClientName").text(data[0][0].ClientName || '');
                $("#ClientColumn #ClientAddress").text(data[0][0].Address || '');
                $("#ClientColumn #ClientCountry").text(data[0][0].Country || '');
                $("#ClientColumn #ClientPlaceOfSupply").text(data[0][0].StateName || '');
                $("#ClientColumn #ClientEmail").text(data[0][0].Email || '');
                $("#ClientColumn #ClientMobileNumber").text(data[0][0].ContactNumber || '');
                $("#ClientColumn #ClientGSTNumber").text(data[0][0].GSTNumber || '');
                $("#ClientColumn #ClientStateId").text(data[0][0].StateId || '');

                var city = data[0][0].City || '';
                var zipCode = data[0][0].ZipCode || '';

                // Check if both City and ZipCode are non-empty before concatenating the dash
                var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
                $("#ClientColumn #ClientCity").text(cityName || '');

                //Inventory.ShippingColumnClearData();

                //var clientId = $('#ClientColumn #ClientId').val();
                //var responseData2 = await Common.getAsycData("/Sale/GetShifingDropdownByClientId?ModuleType=" + "Client" + "&ModuleTypeId=" + parseInt(clientId));
                //if (responseData2 !== null) {
                //    Common.bindParentDropDownSuccess(responseData2, 'TakeId', 'ShippingColumn');
                //}
            }
        }
    },
    ShippingColumnBindData: function (data) {
        $("#ShippingColumn #ShippingName").text(data[0][0].ClientName || '');
        $("#ShippingColumn #ShippingAddress").text(data[0][0].Address || '');
        $("#ShippingColumn #ShippingCountry").text(data[0][0].Country || '');
        $("#ShippingColumn #ShippingPlaceOfSupply").text(data[0][0].StateName || '');
        $("#ShippingColumn #ShippingEmail").text(data[0][0].Email || '');
        $("#ShippingColumn #ShippingMobileNumber").text(data[0][0].ContactNumber || '');
        $("#ShippingColumn #ShippingGSTNumber").text(data[0][0].GSTNumber || '');
        $("#ShippingColumn #ShippingStateId").text(data[0][0].StateId || '');

        var city = data[0][0].City || '';
        var zipCode = data[0][0].ZipCode || '';

        // Check if both City and ZipCode are non-empty before concatenating the dash
        var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
        $("#ShippingColumn #ShippingCity").text(cityName || '');
    },
    ClientAlternativeAddressDetails: async function (response) {
        if (response) {
            var data = JSON.parse(response);
            $("#ShippingColumn #ShippingName").text(data[0][0].AliasName || '');
            $("#ShippingColumn #ShippingAddress").text(data[0][0].AltAddress || '');
            $("#ShippingColumn #ShippingCountry").text(data[0][0].AltCountry || '');
            $("#ShippingColumn #ShippingPlaceOfSupply").text(data[0][0].StateName || '');
            $("#ShippingColumn #ShippingEmail").text(data[0][0].AltEmail || '');
            $("#ShippingColumn #ShippingMobileNumber").text(data[0][0].AltContactNumber || '');
            $("#ShippingColumn #ShippingStateId").text(data[0][0].AltStateCodeId || '');
            $("#ShippingColumn #ShippingAltAddressId").text(data[0][0].AltAddressId || '');

            var city = data[0][0].AltCity || '';
            var zipCode = data[0][0].AltZipCode || '';

            // Check if both City and ZipCode are non-empty before concatenating the dash
            var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
            $("#ShippingColumn #ShippingCity").text(cityName || '');
        }
    },
    ClientAddressLabelToForm: function () {
        var ClientName = $('#ClientColumn #ClientName').text();
        var ClientAddress = $('#ClientColumn #ClientAddress').text();
        var ClientCountry = $('#ClientColumn #ClientCountry').text();
        var ClientStateName = $('#ClientColumn #ClientStateId').text();
        var ClientCity = $('#ClientColumn #ClientCity').text().split('-')[0];
        var ClientZipCode = $('#ClientColumn #ClientCity').text().split('-')[1];
        var ClientEmail = $('#ClientColumn #ClientEmail').text();
        var ClientMobileNumber = $('#ClientColumn #ClientMobileNumber').text();
        var ClientGSTNumber = $('#ClientColumn #ClientGSTNumber').text();

        $('#EditeAddress #ClientName').val(ClientName);
        $('#EditeAddress #ClientAddress').val(ClientAddress);
        $('#EditeAddress #ClientCity').val(ClientCity);
        $('#EditeAddress #ClientZipCode').val(ClientZipCode);
        $('#EditeAddress #ClientEmail').val(ClientEmail);
        $('#EditeAddress #ClientCountry').val(ClientCountry);
        $('#EditeAddress #ClientMobileNumber').val(ClientMobileNumber);
        $('#EditeAddress #ClientGSTNumber').val(ClientGSTNumber);

        $("#StateIdOFfCanvas option").each(function () {
            if ($(this).text().trim().toLowerCase() === ClientStateName.toLowerCase()) {
                $("#StateIdOFfCanvas").val($(this).val()).trigger("change");
            }
        });
        Inventory.EditAddressCanvasOpen();
    },
    AlternateAddressLabelTOForm: function () {
        var AlternativeName = $('#ShippingColumn #ShippingName').text();
        var AlternativeAddress = $('#ShippingColumn #ShippingAddress').text();
        var AlternativeCountry = $('#ShippingColumn #ShippingCountry').text();
        var AlternativeStateName = $('#ShippingColumn #ShippingStateId').text();
        var AlternativeCity = $('#ShippingColumn #ShippingCity').text().split('-')[0];
        var AlternativeZipCode = $('#ShippingColumn #ShippingCity').text().split('-')[1];
        var AlternativeEmail = $('#ShippingColumn #ShippingEmail').text();
        var AlternativeMobileNumber = $('#ShippingColumn #ShippingMobileNumber').text();
        var AlternativeGSTNumber = $('#ShippingColumn #ShippingGSTNumber').text();

        $('#AlternativeEditeAddress #AlternativeName').val(AlternativeName);
        $('#AlternativeEditeAddress #AlternativeAddress').val(AlternativeAddress);
        $('#AlternativeEditeAddress #AlternativeCity').val(AlternativeCity);
        $('#AlternativeEditeAddress #AlternativeZipCode').val(AlternativeZipCode);
        $('#AlternativeEditeAddress #AlternativeEmail').val(AlternativeEmail);
        $('#AlternativeEditeAddress #AlternativeCountry').val(AlternativeCountry);
        $('#AlternativeEditeAddress #AlternativeMobileNumber').val(AlternativeMobileNumber);
        $('#AlternativeEditeAddress #AlternativeGSTNumber').val(AlternativeGSTNumber);
        $('#AlternativeEditeAddress #AlternativeStateId').val(AlternativeStateName);

        $('#AlternativeEditeAddress #AlternativeStateId').select2({
            dropdownParent: $('#AlternativeEditeAddress')
        });
        if (AlternativeStateName != null && AlternativeStateName !== "") {

            Common.bindDropDownParent('AlternativeStateId', 'AlternativeAddressCanvas', 'State', function () {
                $("#AlternativeAddressCanvas #AlternativeStateId").val(AlternativeStateName).trigger('change');
            });
        } else {
            $('#AlternativeAddressCanvas #AlternativeStateId').empty().append('<option value="">-- Select --</option>').trigger('change');
        }
        Inventory.AlternativeEditAddressCanvasOpen();
    },
    AlternativeEditAddressCanvasOpen: function () {

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#AlternativeAddressCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#AlternativeAddressCanvas").css("width", "60%");
        } else {
            $("#AlternativeAddressCanvas").css("width", "30%");
        }
        $('.content-overlay').fadeIn();
    },
    AlternativeEditAddressCanvasClose: function () {
        $("#AlternativeAddressCanvas, .bankCanvas").css("width", "0%");
        $('.content-overlay').fadeOut();
        Common.removevalidation('FormClientAddress');
    },
    ClientDetailsUpdate: function (successCallback, errorCallback) {

        var ClientAddresDetails = {};
        var BillingType = $("#BillAddressCanvas #BillingType").text();
        var ShippingAddressId = parseInt($("#BillAddressCanvas #ShippingAddressIdLabel").text());
        var URL = "";

        if (BillingType == "Client" && ShippingAddressId > 0) {

            ClientAddresDetails = {
                ClientId: ShippingAddressId,
                Name: $("#BillAddressCanvas #Name").val(),
                Address: $("#BillAddressCanvas #Address").val(),
                City: $("#BillAddressCanvas #City").val(),
                Zipcode: $("#BillAddressCanvas #Zipcode").val(),
                StateId: parseInt($("#BillAddressCanvas #StateId").val()),
                ContactNumber: $("#BillAddressCanvas #MobileNo").val(),
                Country: $("#BillAddressCanvas #Country").val(),
                Email: $("#BillAddressCanvas #Email").val()
            };

            URL = "/Sale/UpdateClientDetails";
        }

        else if (BillingType == "AlternateAddress" && ShippingAddressId > 0) {

            ClientAddresDetails = {
                AltAddressId: ShippingAddressId,
                AliasName: $("#BillAddressCanvas #Name").val(),
                AltAddress: $("#BillAddressCanvas #Address").val(),
                AltCity: $("#BillAddressCanvas #City").val(),
                AltZipCode: $("#BillAddressCanvas #Zipcode").val(),
                AltStateCodeId: parseInt($("#BillAddressCanvas #StateId").val()),
                AltCountry: $("#BillAddressCanvas #Country").val(),
                AltContactNumber: $("#BillAddressCanvas #MobileNo").val(),
                AltEmail: $("#BillAddressCanvas #Email").val(),
                Type: "Client",
                ModuleTypeId: parseInt($("#ClientColumn #ClientId").val())
            };

            URL = "/Client/InsertUpdateAlternateAddress";
        }

        $.ajax({
            type: "POST",
            url: URL,
            data: JSON.stringify(ClientAddresDetails),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: false,
            success: function (response) {
                successCallback(response);
            },
            error: function (error) {
                errorCallback(error);
            },
        });
    },
    handleClientUpdateSuccess: async function (response) {

        Common.successMsg(response.message);

        var ClientId = $("#ClientColumn #ClientId").val();
        var IsSameAddress = $("#Check").prop('checked');
        var BillingType = $("#BillingType").text();

        if (BillingType == "Client") {
            if (!IsSameAddress) {

                var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(ClientId));
                if (responseData1 !== null) {

                    Inventory.ClientAddressDetails(responseData1);
                }
            }
            else {
                $("#ClientColumn #ClientId").trigger('change');
            }
        }
        else {
            await handleShiptoClientAddressChange();

        }

        Inventory.EditAddressCanvasClose();
    },
    handleClientUpdateError: function (response) {
        let message = 'An error occurred.';
        if (response && response.message) {
            message = response.message;
        }
        $('#loader-pms').hide();
        Common.errorMsg(message);
    },
    EditAddressCanvasOpen: function () {

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#ClientAddressCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#ClientAddressCanvas").css("width", "60%");
        } else {
            $("#ClientAddressCanvas").css("width", "30%");
        }
        $('.content-overlay').fadeIn();
    },
    EditAddressCanvasClose: function () {
        $("#ClientAddressCanvas, .bankCanvas").css("width", "0%");
        $('.content-overlay').fadeOut();
        Common.removevalidation('FormAlternative');
    },
    ClientAddressUpdate: async function () {
        var ClientAddressFormIsValid = $('#FormClientAddress').validate().form();

        if (!ClientAddressFormIsValid) {
            return false;
        }

        var clientAddressPassingUpdate = {};
        var clientId = $('#ClientColumn #ClientId').val();
        var clientStateId = $('#EditeAddress #stateId').val();

        clientAddressPassingUpdate = {
            ClientId: parseInt(clientId),
            Name: $('#EditeAddress #ClientName').val(),
            Address: $('#EditeAddress #ClientAddress').val(),
            City: $('#EditeAddress #ClientCity').val(),
            Zipcode: $('#EditeAddress #ClientZipCode').val(),
            StateId: parseInt(clientStateId),
            ContactNumber: $('#EditeAddress #ClientMobileNumber').val(),
            Country: $('#EditeAddress #ClientCountry').val(),
            Email: $('#EditeAddress #ClientEmail').val(),
            GSTNumber: $('#EditeAddress #ClientGSTNumber').val(),
        };

        var response = await $.ajax({
            type: "POST",
            url: "/Sale/UpdateClientDetails",
            data: JSON.stringify(clientAddressPassingUpdate),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: false,
        });

        if (response.status === true) {
            Common.successMsg(response.message);
            Inventory.EditAddressCanvasClose();

            var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(clientId));

            if (responseData1 !== null) {
                var data = JSON.parse(responseData1);

                $("#ClientColumn #ClientName").text(data[0][0].ClientName || '');
                $("#ClientColumn #ClientAddress").text(data[0][0].Address || '');
                $("#ClientColumn #ClientCountry").text(data[0][0].Country || '');
                $("#ClientColumn #ClientPlaceOfSupply").text(data[0][0].StateName || '');
                $("#ClientColumn #ClientEmail").text(data[0][0].Email || '');
                $("#ClientColumn #ClientMobileNumber").text(data[0][0].ContactNumber || '');
                $("#ClientColumn #ClientGSTNumber").text(data[0][0].GSTNumber || '');
                $("#ClientColumn #ClientStateId").text(data[0][0].StateId || '');

                var city = data[0][0].City || '';
                var zipCode = data[0][0].ZipCode || '';
                var cityName = city && zipCode ? city + " - " + zipCode : city + zipCode;
                $("#ClientColumn #ClientCity").text(cityName || '');

                $("#ClientId").val(data[0][0].ClientId).trigger('change');
            }
        } else {
            Common.errorMsg(response.message);
        }
    },
    AlternateUpdateAddress: function () {

        var AlternativeFormIsValid = $('#FormAlternative').validate().form();

        if (!AlternativeFormIsValid) {
            return false;
        }

        var AlternativeAddressPassingUpdate = {};
        var AlterId = $("#ShippingColumn #ShippingAltAddressId").text();
        var clientId = $('#ClientColumn #ClientId').val();
        var alternativeStateId = $('#AlternativeEditeAddress #AlternativeStateId').val();

        AlternativeAddressPassingUpdate = {
            AltAddressId: parseInt(AlterId),
            AliasName: $('#AlternativeEditeAddress #AlternativeName').val(),
            AltAddress: $('#AlternativeEditeAddress #AlternativeAddress').val(),
            AltCity: $('#AlternativeEditeAddress #AlternativeCity').val(),
            AltStateCodeId: parseInt(alternativeStateId),
            AltCountry: $('#AlternativeEditeAddress #AlternativeCountry').val(),
            AltZipCode: $('#AlternativeEditeAddress #AlternativeZipCode').val(),
            AltContactNumber: $('#AlternativeEditeAddress #AlternativeMobileNumber').val(),
            AltEmail: $('#AlternativeEditeAddress #AlternativeEmail').val(),
            Type: "Client",
            ModuleTypeId: parseInt(clientId),
        }

        $.ajax({
            type: "POST",
            url: "/Client/InsertUpdateAlternateAddress",
            data: JSON.stringify(AlternativeAddressPassingUpdate),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: false,
            success: function (response) {
                if (response.status == true) {
                    Common.successMsg(response.message);
                    Inventory.AlternativeEditAddressCanvasClose();
                    Common.removevalidation('FormAlternative');
                    Common.removevalidation('FormClientAddress');
                    $('#ShippingColumn #TakeId').val(AlterId).trigger('change');
                } else {
                    Common.errorMsg(response.message);
                }
            },
            error: function (response) {
                Common.errorMsg(response.message);
            },
        });
    },
    ClientAddressBind: async function () {

        var clientId = $('#ClientId').val();

        if (clientId == "") {
            Inventory.ShippingColumnClearData();
            Inventory.ClientColumnClearData();
            $('#VendorEdit').hide();
            $('#ShippingEdit').hide();
            var type = 'Client';
            ResetDataDetails(type);
            return false;
        }
        else {
            var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(clientId));
            if (responseData1 !== null) {
                Inventory.ClientAddressDetails(responseData1);
            }

            $('#VendorEdit').show();
            $('#ShippingEdit').show();

            var type = 'Client';
            ResetDataDetails(type);
        }
    },
    sameasAddressCheck: async function () {
        var Checkvalues = $("#Check").prop('checked');
        var ClientId = $('#ClientColumn #ClientId').val();

        if (Checkvalues == true) {

            $('#TakeId').prop('disabled', true);
            $('#TakeId').empty();
            $('#TakeId').append('<option value="' + ClientId + '">' + $('#ClientId option:selected').text() + '</option>');

            var SameClientId = $('#TakeId').val();
            var response = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(SameClientId));
            if (response !== null) {
                var data = JSON.parse(response);
                Inventory.ShippingColumnBindData(data);
            }
        }
        else {
            Inventory.ShippingColumnClearData();
            var clientId = $('#ClientColumn #ClientId').val();
            var responseData2 = await Common.getAsycData("/Sale/GetShifingDropdownByClientId?ModuleType=" + "Client" + "&ModuleTypeId=" + parseInt(clientId));
            if (responseData2 !== null) {
                Common.bindParentDropDownSuccess(responseData2, 'TakeId', 'ShippingColumn');
            }
        }
    },


    BindOtherChargesDataDetails: async function (value, index) {
        var OtherChargesType = value.OtherChargesType;

        var OtherChargesTypeData = await Common.getAsycData("/PurchaseOrder/GetOtherChargesType?OtherChargesTypeName=" + OtherChargesType);
        Inventory.OtherchargesEditResponseWithDropdown(value, OtherChargesTypeData, index);
    },
    OtherchargesEditResponseWithDropdown: function (response, data, index) {

        var dataval = JSON.parse(data);
        var selectOptions = "";

        var defaultOption = '<option value="0">--Select--</option>';
        var finalOption = '';

        if (dataval != null && dataval.length > 0 && dataval[0].length > 0 && dataval[0][0].OtherChargesId != null) {
            selectOptions = dataval[0].map(function (product) {
                var isSelected = product.OtherChargesId == response.OtherChargesId ? 'selected' : '';
                var objproduct = Object.entries(product);
                return `<option value="${objproduct[1][1]}" IsPercentage="${product.IsPercentage}" Values="${product.Value}" ${isSelected}>${objproduct[2][1]}</option>`;
            }).join('');

            var ispercentage = response.IsPercentage == 1 ? "checked" : "";
            var isamount = response.IsPercentage == 0 ? "checked" : "";
            let uniqueId = Math.random().toString(36).substring(2);

            var finalOption = defaultOption + selectOptions;

            var newRow = `
            <div class="col-12 OtherChargesRow">
               <div class="mt-3">
                   <div class="discount-row dynamicBindRow">
                          <div class="discount-drop">
                             <select class="form-control discount-select taxandothers "  id="OtherChargesId${uniqueId}" name="OtherChargesId${uniqueId}"  otherchargestype="${dataval[0][0].OtherChargesType}" required>
                                  ${finalOption}
                             </select>
                          </div>
                         <div class="discount-radio">
                               <label><input type="radio" name="amounttype1${uniqueId}" id="IsPercentage" value="1" ${ispercentage} class="calculateinventory"> %</label>
                               <label><input type="radio" name="amounttype1${uniqueId}" id="Amount" value="0" ${isamount} class="calculateinventory"> ₹</label>
                          </div>

                          <input type="text" class="form-control discount-input calculateinventoryvalue"
			                	                id="Value${uniqueId}" name ="Value${uniqueId}"  value="${response.Value}"
			                            oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,8)" placeholder="0.00">

                          <input type="text" class="form-control discount-input otherChargeValue" id="OtherChargeValue" name="OtherChargeValue${uniqueId}"
			                	    placeholder="0.00" style="background-color:#dee2e647" readonly="" value="${response.OtherChargeValue}" disabled>
			            <button id="" class="btn DynremoveBtn DynrowRemove" type="button"><i class="fas fa-trash-alt"></i></button> 
             
                   </div>
               </div>
              </div>
	
                `;

            $('#dynamicBindRow').append(newRow);
            Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
        }

    },
    GetOtherCharges: function (OtherChargestext) {
        Common.ajaxCall("GET", "/PurchaseInvoice/GetOtherChargesType?OtherChargesTypeName=" + OtherChargestext, null, Inventory.InsertOtherchargesResponse, null);
    },
    InsertOtherchargesResponse: function (response) {
        let uniqueId = Math.random().toString(36).substring(2);
        if (response.status) {

            var data = JSON.parse(response.data);

            var selectOptions = "";
            var defaultOption = '<option value="">--Select--</option>';
            var finalOption = '';

            if (data != null && data.length > 0 && data[0].length > 0 && !data[0][0].hasOwnProperty('tetroposnocount')) {
                selectOptions = data[0].map(function (product) {
                    var objproduct = Object.entries(product);

                    var value = objproduct[1] ? objproduct[1][1] : '';
                    var isPercentage = product.IsPercentage === true ? 1 : 0;
                    var values = product.Value && parseFloat(product.Value) > 0 ? product.Value : '0.00';
                    var text = objproduct[2][1] ? objproduct[2][1] : 'Nill';

                    if (text === 'Nill') {
                        $('#OtherChargesId').prop('disabled', true)

                    } else {
                        $('#OtherChargesId').prop('disabled', false)
                        return `<option value="${value}" IsPercentage="${isPercentage}" Values="${values}"> ${text} </option>`;
                    }

                }).join('');
            } else {
                selectOptions = '<option value="" IsPercentage="0" Values="0.00">--Select--</option>';
            }

            finalOption = defaultOption + selectOptions;

            var newRow = `
            <div class="col-12 OtherChargesRow">
               <div class="mt-3">
                   <div class="discount-row dynamicBindRow">
                       <div class="discount-drop">
                          <select class="form-control discount-select taxandothers  "  id="OtherChargesId${uniqueId}" name="OtherChargesId${uniqueId}" OtherChargesType="${data[0][0].OtherChargesType}" required>
                            ${finalOption}
                          </select>
                       </div>
                       <div class="discount-radio">
                           <label><input type="radio" name="amounttype1${uniqueId}" id="IsPercentage" value="1" class="calculateinventory"> %</label>
                           <label><input type="radio" name="amounttype1${uniqueId}" id="Amount" class="calculateinventory"> ₹</label>
                       </div>

                       <input type="text" class="form-control discount-input calculateinventoryvalue"
				                id="Value${uniqueId}" name ="Value${uniqueId}"  placeholder="0.00"
				        oninput="Common.allowOnlyNumbersAndDecimalwithmaxlength(this,8)" placeholder="0.00">

                       <input type="text" class="form-control discount-input otherChargeValue" id="OtherChargeValue" name="OtherChargeValue${uniqueId}"
				         placeholder="0.00" style="background-color:#dee2e647" readonly="" disabled>

                       <button id="" class="btn DynremoveBtn DynrowRemove" type="button"><i class="fas fa-trash-alt"></i></button> 

                   </div>
               </div>
              </div>
             `;

            $('#dynamicBindRow').append(newRow);
            $('#OtherChargesId' + uniqueId).closest('.dynamicBindRow').find('input.calculateinventory[value="1"]').prop('checked', true);


        }
    },
    OtherChargesRemoveRow: function (button) {
        var row = button.closest('tbody tr');
        var table = row.parentElement;
        table.removeChild(row);
        Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
    },
    TaxAndOthersDropdownChange: function () {

        var thisSelectedValue = $(this).val();
        var thisSelectElement = $(this);

        // Prevent duplicate values
        $('select.taxandothers').each(function (index, value) {
            var existVal = $(value).val();
            if (existVal === thisSelectedValue && value !== thisSelectElement[0] && existVal != null) {
                thisSelectElement.val("");  // Clear the duplicate selection
                return false;  // Exit the loop early
            }
        });

        var selectElement = $(this);
        var selectedOption = selectElement.find('option:selected');
        var isPercentage = selectedOption.attr("ispercentage");
        var values = selectedOption.attr("values");

        var dynamicBindRow = selectElement.closest('.dynamicBindRow');

        if (values) {  // Check if values is not null, undefined, or empty
            var otherChargeValue = 0;
            if (isPercentage === "1") {
                otherChargeValue = ((Common.parseFloatValue($('#Subtotal').val()) / 100) * parseFloat(values)).toFixed(2);
                dynamicBindRow.find('#IsPercentage').prop('checked', true);
            } else {
                otherChargeValue = parseFloat(values).toFixed(2);
                dynamicBindRow.find('#Amount').prop('checked', true);
            }
            dynamicBindRow.find('.calculateinventoryvalue').val(parseFloat(values).toFixed(2));
            dynamicBindRow.find('#OtherChargeValue').val(parseFloat(otherChargeValue).toFixed(2));
        } else {
            dynamicBindRow.find('#IsPercentage').prop('checked', false);
            dynamicBindRow.find('#Amount').prop('checked', false);
            dynamicBindRow.find('.calculateinventoryvalue').val("0.00");
            dynamicBindRow.find('#OtherChargeValue').val("0.00");
        }
    },


    PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue: function () {

        var totalDiscount = 0;
        var Subtotal = parseFloat($('#Subtotal').val()) || 0;
        var NewSubtotal = 0;

        $("#dynamicBindRow .dynamicBindRow").each(function (index, value) {

            var taxtype = $(value).find('.taxandothers').attr('otherchargestype');
            var isPercentage = $(value).find('#IsPercentage:checked').val();
            var calculateinventoryvalue = parseFloat($(value).find('.calculateinventoryvalue').val() || 0);

            if (taxtype == "Discount") {
                if (isPercentage === "1") {
                    var currentRowDiscountTotalCharges = ((Subtotal / 100) * calculateinventoryvalue).toFixed(2)
                    $(value).find('#OtherChargeValue').val(currentRowDiscountTotalCharges);
                    totalDiscount = totalDiscount + parseFloat(currentRowDiscountTotalCharges);

                } else {
                    $(value).find('#OtherChargeValue').val(calculateinventoryvalue.toFixed(2));
                    totalDiscount = totalDiscount + parseFloat(calculateinventoryvalue.toFixed(2));
                }
            }
        });

        NewSubtotal = Subtotal - totalDiscount;
        var totalOtherCharges = 0;
        $("#dynamicBindRow .dynamicBindRow").each(function (index, value) {
            var taxtype = $(value).find('.taxandothers').attr('otherchargestype');
            var isPercentage = $(value).find('#IsPercentage:checked').val();
            var calculateinventoryvalue = parseFloat($(value).find('.calculateinventoryvalue').val() || 0);

            if (taxtype == "OtherCharges") {
                if (isPercentage === "1") {
                    var currentRowOtherChargesTotalCharges = ((NewSubtotal / 100) * calculateinventoryvalue).toFixed(2);
                    $(value).find('#OtherChargeValue').val(currentRowOtherChargesTotalCharges);
                    totalOtherCharges = totalOtherCharges + parseFloat(currentRowOtherChargesTotalCharges);

                } else {
                    $(value).find('#OtherChargeValue').val(calculateinventoryvalue.toFixed(2));
                    totalOtherCharges = totalOtherCharges + parseFloat(calculateinventoryvalue);
                }
            }
        });

        NewSubtotal = NewSubtotal + totalOtherCharges;
        var totalTax = 0;
        $("#dynamicBindRow .dynamicBindRow").each(function (index, value) {
            var taxtype = $(value).find('.taxandothers').attr('otherchargestype');
            var isPercentage = $(value).find('#IsPercentage:checked').val();
            var calculateinventoryvalue = parseFloat($(value).find('.calculateinventoryvalue').val() || 0);

            if (taxtype == "Tax") {
                if (isPercentage === "1") {
                    var currentRowOtherChargesTotalCharges = ((NewSubtotal / 100) * calculateinventoryvalue).toFixed(2);
                    $(value).find('#OtherChargeValue').val(currentRowOtherChargesTotalCharges);
                    totalTax = totalTax + parseFloat(currentRowOtherChargesTotalCharges);
                } else {
                    $(value).find('#OtherChargeValue').val(calculateinventoryvalue.toFixed(2));
                    totalTax = totalTax + parseFloat(calculateinventoryvalue);
                }
            }
        });

        $("#dynamicBindRow .dynamicBindRow").each(function (index, value) {
            var originalId = $(value).attr("id");
            var fixedId = parseFloat(originalId).toFixed(2);
            $(value).attr("id", fixedId);
        });

        NewSubtotal += totalTax;
        var roundoffGrantTotal = Math.round(NewSubtotal);

        var roundOffDifference = roundoffGrantTotal - NewSubtotal;

        $('#roundOff').val(roundOffDifference.toFixed(2));

        if (roundOffDifference === 0) {
            $("#roundOff").css("color", "orange");
        } else if (roundOffDifference > 0) {
            $("#roundOff").css("color", "#4ce53d");
        } else {
            $("#roundOff").css("color", "red");
        }
        $("#roundOff").show();
        $('#GrantTotal').val(roundoffGrantTotal.toFixed(2));

    },


    customRound: function (amount) {
        var rounded = Math.floor(amount);
        var fraction = amount - rounded;

        if (fraction >= 0.50) {
            rounded += 1;
        }

        return rounded;
    },
    number2text: function (value) {
        var fraction = Math.round(Inventory.frac(value) * 100);
        var f_text = "";

        if (fraction > 0) {
            f_text = " and " + Inventory.convert_number(fraction) + " Paise ";
        }
        return "Rupees " + Inventory.convert_number(value) + f_text + " Only ";
    },
    frac: function (f) {
        return f % 1;
    },
    convert_number: function (number) {
        if ((number < 0) || (number > 999999999)) {
            return "Number Out Of Range!";
        }
        var Gn = Math.floor(number / 10000000);  /* Crore */
        number -= Gn * 10000000;
        var kn = Math.floor(number / 100000);     /* lakhs */
        number -= kn * 100000;
        var Hn = Math.floor(number / 1000);      /* thousand */
        number -= Hn * 1000;
        var Dn = Math.floor(number / 100);       /* Tens (deca) */
        number = number % 100;               /* Ones */
        var tn = Math.floor(number / 10);
        var one = Math.floor(number % 10);
        var res = "";

        if (Gn > 0) {
            res += (Inventory.convert_number(Gn) + " Crore ");
        }
        if (kn > 0) {
            res += (((res == "") ? "" : " ") +
                Inventory.convert_number(kn) + " Lakh ");
        }
        if (Hn > 0) {
            res += (((res == "") ? "" : " ") +
                Inventory.convert_number(Hn) + " Thousand ");
        }

        if (Dn) {
            res += (((res == "") ? "" : " ") +
                Inventory.convert_number(Dn) + " Hundred ");
        }

        var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen");
        var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety");

        if (tn > 0 || one > 0) {
            if (!(res == "")) {
                res += " and ";
            }
            if (tn < 2) {
                res += ones[tn * 10 + one];
            }
            else {

                res += tens[tn];
                if (one > 0) {
                    res += (" " + ones[one]);
                }
            }
        }

        if (res == "") {
            res = "zero";
        }
        return res;
    },

    /*======================================NEW FUNCTION==========================================*/
    ResetProductListTable: function () {
        $('#AdditemSearch').val('');
        $('#ProductListTable #product-table-body .AllProductRow').remove();
        $('#AddProductModal').hide();
    },

    AllProductTable: function (mainTable, moduleName, vendorId, FranchiseMappingId) {
        vendorId = vendorId ?? 0;
        EditDataId = { ModuleName: moduleName, VendorId: vendorId, FranchiseId: FranchiseMappingId };
        $('#tableFilter1').val('');

        $.ajax({
            url: 'PurchaseOrder/GetProduct',
            type: 'GET',
            data: EditDataId,
            success: function (response) {
                var datas = JSON.parse(response.data);
                if (datas[0][0].ProductId == null || datas[0][0].ProductId == undefined) { 
                    if (mainTable.is($('#PurchaseRequestProductTable'))) {
                        $('#Price,#SIH').hide();
                        $('#Category11,#SubCategory').show();
                        //var newRow = `<tr class="AllProductEmptyRow">
                        //              <td colspan="4" class="text-center text-danger">No matching products found.</td>
                        //          </tr>`;
                        //$('#product-table-body').append(newRow);
                    } else {
                        $('#Price,#SIH').show();
                        $('#Category11,#SubCategory').hide();
                    }
                    $('#loader-pms').hide();
                    return false;
                }
                var datas = JSON.parse(response.data, function (key, value) {
                    if (key === 'PrimaryPrice') {
                        if (value === Math.floor(value)) {
                            return value + ".00";
                        } else {
                            return parseFloat(value.toFixed(2));
                        }
                    }
                    return value;
                });
                var data = datas[0];

                if (data[0].ProductId != null && data.length > 0) {
                    let productData = data;
                    if (mainTable.is($('#PurchaseRequestProductTable'))) { 
                        $('#Price,#SIH').hide(); 
                        $('#Category11,#SubCategory').show();
                    } else {
                        $('#Price,#SIH').show();
                        $('#Category11,#SubCategory').hide();
                    }
                    productData.forEach(function (product) {
                        if (selectedProductIdsList.includes(product.ProductId)) {
                            return;
                        }
                        var newRow = `
                        <tr Class="AllProductRow" data-product-id="${product.ProductId}" data-product-info='${JSON.stringify(product)}'>
                            <td>
                                <div class="d-flex">
                                    <input class="mr-2" type="checkbox" aria-label="Select Item">
                                    <label>${product.ProductName || '-'}</label>
                                </div>
                             </td> 
                             <td ${mainTable.attr('id') !== 'PurchaseRequestProductTable' ? 'class="d-none"' : ''}>
                                <label class="">${product.ProductSubCategoryName  || '–'}</label>
                             </td>
                             <td style="display:none;"><label>${product.SecondaryPrice}</label></td> 
                             <td ${mainTable.attr('id') !== 'PurchaseRequestProductTable' ? 'class="d-none"' : ''}>
                                <label>${product.ProductCategoryName || '0'}</label>
                            </td> 
                            <td ${mainTable.attr('id') === 'PurchaseRequestProductTable' ? 'class="d-none"' : ''}>
                                <label class="SellingPrice">${product.PrimaryPrice || '–'}</label>
                            </td>
                            <td style="display:none;"><label>${product.SecondaryPrice}</label></td>

                            <td ${mainTable.attr('id') === 'PurchaseRequestProductTable' ? 'class="d-none"' : ''}>
                                <label>${product.StockInHand || '0'}</label>
                            </td>

                            <td style="width:16%">
                                     <button type="button" class="btn btn-custom addQtyBtn">+ Add</button>
                                       <div class="align-items-center OtyColumn d-none">
                                        <div class="d-flex align-items-center qty-wrapper">
                                         <div class="qty-group">
                                            <button type="button" class="btn btn-primary RowMinus qty-btn qty-decrease">-</button>
                                             <input type="Number" class="form-control text-center qty-input QtyProductAdd" oninput="Common.allowOnlyNumberLength(this,4)" value="1" min="1">
                                             <button type="button" class="btn btn-primary RowPlus qty-btn qty-increase">+</button>
                                          </div>

                                        <div class="input-group-append">
                                           
                                             <span id="unitDropdownContainer" class="unit-dropdown ">
                                       
                                             </span>
                                        </div>
            
                                    </div>
                                </div>
                            </td>
                          
                        </tr>
                    `;

                        $('#product-table-body').append(newRow);

                        if ($('#product-table-body').children('tr').length === 1) {
                            $('.AllProductEmptyRow').show();
                        } else {
                            $('.AllProductEmptyRow').hide();
                        }

                        let $unitDropdownContainer = $('#product-table-body tr').last().find('#unitDropdownContainer');
                        let Nrow = $('#product-table-body tr').last();

                        var $select = $('<select class="additemdrop unit-select"></select>');
                        if (product.PrimaryUnitId && product.SecondaryUnitId) {

                            $select.append($('<option></option>').val(product.PrimaryUnitId).text(product.PrimaryUnitName));
                            $select.append($('<option></option>').val(product.SecondaryUnitId).text(product.SecondaryUnitName));
                        } else if (product.PrimaryUnitId) {

                            $select.append($('<option></option>').val(product.PrimaryUnitId).text(product.PrimaryUnitName));
                        }

                        $unitDropdownContainer.append($select);
                        let selectedUnit = parseInt(Nrow.find('.additemdrop').val());
                        const Data = Nrow.data('product-info');
                        Inventory.updateSellingPriceBasedOnUnit(selectedUnit, Nrow, Data, mainTable);

                        $('#loader-pms').hide();
                    });
                } else {

                    if ($('#product-table-body').children('tr').length === 1) {
                        $('.AllProductEmptyRow').show();
                    } else {
                        $('.AllProductEmptyRow').hide();
                    }
                }
                $('#loader-pms').hide();
            },
            error: function (xhr, status, error) {
                console.error('Error fetching products: ', error);
                $('#loader-pms').hide();
            }
        });

        /* Common.bindDropDown('Category', 'ProductType');*/

        $('#Category,#Brand').each(function () {
            $(this).select2({
                dropdownParent: $(this).parent()
            });
        });
    },

    updateSellingPriceBasedOnUnit: function (unit, rowElement, data, mainTable) {
        let sellingPriceInput = rowElement.find('.SellingPrice');

        let CurrentStock = rowElement.find('.remaining-stock');
        let QtyProductAdd = rowElement.find('.QtyProductAdd');
        if (QtyProductAdd.val() === undefined || QtyProductAdd.val() === '') {
            QUantity = parseInt(BarcodeQtyProductAdd.val() || 0);
        } else {
            QUantity = parseInt(QtyProductAdd.val() || 0);
        }

        var ReorderLevel = data.ReOrderlevel;
        var SecondaryUnitValue = data.SecondaryUnitValue || 0;
        var StockInHand = data.StockInHand || 0;
        var SecondaryUnitStockInHand = data.SecondaryUnitStockInHand || 0;

        if (mainTable === "DebitNoteProductTable" && mainTable === "EstimateProductTable" && mainTable === "CNProductTable") {
            if (unit === data.PrimaryUnitId) {
                sellingPriceInput.text(
                    mainTable === "DebitNoteProductTable" ? data.PrimaryPrice : data.PrimaryPrice
                );


                CurrentStock.text(StockInHand);
                Inventory.updateRowColor(rowElement, ReorderLevel, StockInHand);


            } else if (unit === data.SecondaryUnitId) {

                sellingPriceInput.text(
                    (
                        mainTable === "DebitNoteProductTable"
                            ? data.PrimaryPrice / SecondaryUnitValue
                            : data.PrimaryPrice / SecondaryUnitValue
                    ).toFixed(2)

                );


                var SecondaryUnitReorderLevel = ReorderLevel * SecondaryUnitValue;

                CurrentStock.text(SecondaryUnitStockInHand);
                Inventory.updateRowColor(rowElement, SecondaryUnitReorderLevel, SecondaryUnitStockInHand);
            }
        } else if (mainTable !== "POProductTable" && mainTable !== "PIProductTable" && mainTable !== "SaleReturnProductTable") {
            if (unit === data.PrimaryUnitId) {
                sellingPriceInput.text(data.PrimaryPrice ? data.PrimaryPrice : 0.00);

                CurrentStock.text(StockInHand);
                Inventory.updateRowColor(rowElement, ReorderLevel, StockInHand);


            } else if (unit === data.SecondaryUnitId) {

                sellingPriceInput.text((data.PrimaryPrice / SecondaryUnitValue).toFixed(2));


                var SecondaryUnitReorderLevel = ReorderLevel * SecondaryUnitValue;

                CurrentStock.text(SecondaryUnitStockInHand);
                Inventory.updateRowColor(rowElement, SecondaryUnitReorderLevel, SecondaryUnitStockInHand);
            }
        } else {
            if (unit === data.PrimaryUnitId) {
                sellingPriceInput.text(
                    mainTable === "SaleReturnProductTable"
                        ? data.PrimaryPrice
                        : data.PrimaryPrice
                );


                CurrentStock.text(StockInHand);
                Inventory.updateRowColor(rowElement, ReorderLevel, StockInHand);


            } else if (unit === data.SecondaryUnitId) {

                sellingPriceInput.text(
                    (
                        mainTable === "SaleReturnProductTable"
                            ? data.PrimaryPrice / SecondaryUnitValue
                            : data.PrimaryPrice / SecondaryUnitValue
                    ).toFixed(2)

                );


                var SecondaryUnitReorderLevel = ReorderLevel * SecondaryUnitValue;

                CurrentStock.text(SecondaryUnitStockInHand);
                Inventory.updateRowColor(rowElement, SecondaryUnitReorderLevel, SecondaryUnitStockInHand);
            }
        }
    },
    updateRowColor: function (row, reOrderLevel, remainingStock) {
        remainingStock = parseInt(remainingStock);
        reOrderLevel = parseInt(reOrderLevel);


        const remainingStockElement = row.find('.remaining-stock');

        if (remainingStock <= reOrderLevel) {
            remainingStockElement.css('color', 'red');
        } else {
            remainingStockElement.css('color', 'green');
        }
    },

    AddProductsToMainTable: function (Table, tablebody, mainTable, moduleName) {

        let selectedProductIds = [];
        selectedProductQuantity = [];
        selectedProductUnitId = [];
        let productsWithZeroStock = [];
        let validProductIds = [];
        var Franchise = parseInt(localStorage.getItem('FranchiseId'));
        if (Table === "AllProductTable") {
            $('#product-table-body .AllProductRow').each(function () {
                let checkbox = $(this).find('input[type="checkbox"]');
                if (checkbox.is(':checked')) {
                    let productId = $(this).data('product-id');

                    let quantityInput = $(this).find('input[type="number"]');
                    let quantity = parseFloat(quantityInput.val(), 10);

                    let UnitDropDown = $(this).find('.additemdrop');
                    let UnitId = parseInt(UnitDropDown.val(), 10);


                    let remainingStock = parseInt($(this).find('.remaining-stock').text(), 10);

                    if (remainingStock <= 0) {
                        let productName = $(this).find('td:first').find('label').text();
                        productsWithZeroStock.push(productName);
                        selectedProductIds.push(productId);
                        selectedProductUnitId.push(UnitId);
                        selectedProductQuantity.push(quantity);
                    } else {
                        validProductIds.push(productId);
                        selectedProductIds.push(productId);
                        selectedProductQuantity.push(quantity);
                        selectedProductUnitId.push(UnitId);

                        if (!selectedProductIdsList.includes(productId)) {
                            selectedProductIdsList.push(productId);
                        }
                    }
                }
            });
        }
        if (selectedProductIds.length === 0) {

            Common.warningMsg('Please select at least one product.');
            $('#loader-pms').hide(); 
        } else {

            if (!mainTable.is($('#POProductTable, #PIProductTable, #PRProductTable')) && productsWithZeroStock.length > 0) {
                let errorMessage = "The following products have 0 remaining stock and cannot be added: " + productsWithZeroStock.join(', ');
                Common.warningMsg(errorMessage);
                $('#loader-pms').hide();
            } else {

                let promises = selectedProductIds.map(product => {
                    let EditDataId = { ProductId: product, FranchiseId: Franchise, ModuleName: moduleName };
                    return new Promise((resolve, reject) => {
                        Common.ajaxCall("GET", "/PurchaseOrder/GetProductsPopupDetails", EditDataId, function (response) {
                            resolve({ productId: product, response: response });
                        }, function (error) {
                            reject(error);
                        });
                    });
                });

                Promise.all(promises)
                    .then(results => {
                        results.sort((a, b) => selectedProductIds.indexOf(a.productId) - selectedProductIds.indexOf(b.productId));
                        results.forEach(result => {
                            Inventory.ProductsGetNotNull(result.response, tablebody, mainTable);
                        });
                        Inventory.ResetProductListTable();
                        if (!mainTable.is($('#PurchaseRequestProductTable'))) {
                           
                                $('.gstFields').show();
                                Inventory.updateGSTVisibility('#VendorStateName', '#StateName');
                                $(".totalRow").attr("colspan", "4");
                                if (mainTable.is($('#PIProductTable'))) {
                                    $(".SubtotalTD").attr("colspan", "5");
                                    $('#Subtotal').css('width', '125px');

                                }
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching product details:", error);
                    });
            }
        }
    },
    callProductQC: function (selectedProductIds) {
        if (!selectedProductIds || selectedProductIds.length === 0) return;

        let qcProducts = selectedProductIds.map(id => ({ ProductId: id }));

        $.ajax({
            url: '/PurchaseInvoice/GetProductQC',
            type: 'POST',
            data: { FilterType: JSON.stringify(qcProducts) },
            success: function (response) {
                if (response.status) {
                    if (response.data && response.data.length > 0) {
                        Inventory.bindQCDetails(response.data);
                    }
                }
            },
            error: function () {
                Common.errorMsg("Failed to fetch QC details.");
            }
        });
    },
    bindQCDetails: function (data) {

        const filteredData = data.filter(item => item.productId != null);
        if (filteredData.length === 0) return;

        let groupedData = {};
        data.forEach(item => {
            if (!groupedData[item.productName]) {
                groupedData[item.productName] = [];

            }
            groupedData[item.productName].push(item);
        });

        if ($('.DynmicqcRow').find('h3.main-heading').length === 0) {
            let heading = $('<h3>')
                .addClass('main-heading')
                .text("Quality Check")
                .css({
                    'border': '1px solid #ccc',
                    'width': '100%',
                    'padding': '10px',
                    'text-align': 'center',
                    'font-weight': '800'
                });
            $('.DynmicqcRow').append(heading);
        }

        for (let productName in groupedData) {
            let productData = groupedData[productName];
            let productId = productData[0].productId;

            if ($(`.productlabel h3[data-productid="${productId}"]`).length > 0) {
                continue;
            }

            let productDiv = $('<div>').addClass('productlabel');
            let heading = $('<h3>')
                .text(productName)
                .attr('data-productid', productId)
                .css({
                    'font-weight': '800',
                    'font-size': '12px',
                    'margin': '10px 0px 0px 0px',
                    'width': '100%'
                });
            productDiv.append(heading);

            productData.forEach((qc, index) => {
                let setContainer = $('<div>').addClass('set-container');

                let checkboxId = `pf${qc.productQCMappingId}`;
                let checkbox = $('<input>')
                    .attr('type', 'checkbox')
                    .attr('id', checkboxId)
                    .attr('data-productqcmapid', qc.productQCMappingId)
                    .prop('checked', qc.PurchaseBillQCMappingId != null);

                let label = $('<label>')
                    .attr('for', checkboxId)
                    .text(`${qc.qcName}`);

                let textInput = $('<input>')
                    .addClass('form-control')
                    .attr('type', 'text')
                    .attr('placeholder', '0.00')
                    .val(qc.value || '');

                setContainer.append(checkbox, label, textInput);
                productDiv.append(setContainer);
            });
            //let setContainers = productDiv.find('.set-container');
            //if (setContainers.length >= 5) {
            //    setContainers.eq(4).css('margin-left', '103px');

            //    if (setContainers.length >= 9) {
            //        setContainers.eq(8).css('margin-left', '103px');
            //    }
            //}
            $('.DynmicqcRow').append(productDiv);
        }
    },


    calculateTaxableAmount: function (row) {

        var sellingPrice = parseFloat(row.find('.SellingPrice').val()) || 0;
        var discount = parseFloat(row.find('#DisInput').val()) || 0;

        var Qty = parseFloat(row.find('.TableRowQty').val()) || 0;
        var sp = sellingPrice * Qty;

        row.find('#subtotalAmount').val(sp.toFixed(2));
        var discountSymbol = row.find('.DiscountDropdown option:selected').text();

        var taxableAmount = 0;
        if (discountSymbol === "₹") {
            taxableAmount = sp - discount;
        } else if (discountSymbol === "%") {
            var discountValue = (sp * discount) / 100;
            taxableAmount = sp - discountValue;
        } else {
            taxableAmount = sp;
        }


        row.find('.TaxableAmount-cell').text(taxableAmount.toFixed(2));

        return taxableAmount;
    },
    calculateCESS: function (row) {
        var cessPercentage = parseFloat(row.find('#CESSPercentage').val()) || 0;
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var cessAmount = (cessPercentage * taxableAmount) / 100;
        row.find('#CESSAmount').val(cessAmount.toFixed(2));

        return cessAmount;
    },
    calculateCGST: function (row) {
        var CGSTPercentage = parseFloat(row.find('#CGSTPercentage').val()) || 0;
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var CGSTAmount = (CGSTPercentage * taxableAmount) / 100;
        row.find('#CGSTAmount').val(CGSTAmount.toFixed(2));

        return CGSTAmount;
    },
    calculateSGST: function (row) {
        var SGSTPercentage = parseFloat(row.find('#SGSTPercentage').val()) || 0;
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var SGSTAmount = (SGSTPercentage * taxableAmount) / 100;
        row.find('#SGSTAmount').val(SGSTAmount.toFixed(2));

        return SGSTAmount;
    },
    calculateIGST: function (row) {
        var IGSTPercentage = parseFloat(row.find('#IGSTPercentage').val()) || 0;
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var IGSTAmount = (IGSTPercentage * taxableAmount) / 100;
        row.find('#IGSTAmount').val(IGSTAmount.toFixed(2));

        return IGSTAmount;
    },
    calculateTotalAmount: function (row) {
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var CGSTAmount = parseFloat(row.find('#CGSTAmount').val()) || 0;
        var SGSTAmount = parseFloat(row.find('#SGSTAmount').val()) || 0;
        var IGSTAmount = parseFloat(row.find('#IGSTAmount').val()) || 0;
        var CESSAmount = parseFloat(row.find('#CESSAmount').val()) || 0;

        var totalAmount = 0;
        var totalTAX = 0;

        var isIGSTVisible = row.find('.IGSTValues').is(':visible');
        var isCGST_SGST_Visible = row.find('.CGSTValues').is(':visible') || row.find('.SGSTValues').is(':visible');

        if (isIGSTVisible) {
            totalAmount = taxableAmount + IGSTAmount + CESSAmount;
            totalTAX = IGSTAmount + CESSAmount;
        } else if (isCGST_SGST_Visible) {
            totalAmount = taxableAmount + CGSTAmount + SGSTAmount + CESSAmount;
            totalTAX = CGSTAmount + SGSTAmount + CESSAmount;
        } else {
            totalAmount = taxableAmount + CESSAmount;
            totalTAX = CESSAmount;
        }

        row.find('.TotalTax-cell').text(totalTAX.toFixed(2));
        row.find('.Totalamount-cell').text(totalAmount.toFixed(2));

        return totalAmount;
    },
    updateSubtotalRow: function (mainTable) {
        var discountTotal = 0;
        var CGSTPercentageTotal = 0;
        var SGSTPercentageTotal = 0;
        var IGSTPercentageTotal = 0;
        var cessPercentageTotal = 0;
        var TotalamountTotal = 0;
        var SuntotalTotalamount = 0;
        mainTable.find('.ProductTableRow').each(function () {
            var symbol = $(this).find('.DiscountDropdown option:selected').text();
            var originalPrice = $(this).find('.SellingPrice').val();
            if (symbol === '₹') {
                var discountValue = parseFloat($(this).find('#DisInput').val()) || 0;
                discountTotal += discountValue;
            } else if (symbol === '%') {
                var discountPercentage = parseFloat($(this).find('#DisInput').val()) || 0;
                var discountValue = (discountPercentage / 100) * originalPrice;
                discountTotal += discountValue;
            }

            var TotalSubValue = parseFloat($(this).find('#subtotalAmount').val()) || 0;
            SuntotalTotalamount += TotalSubValue;

            var TotalCGSTValue = parseFloat($(this).find('#CGSTAmount').val()) || 0;
            CGSTPercentageTotal += TotalCGSTValue;

            var TotalSGSTValue = parseFloat($(this).find('#SGSTAmount').val()) || 0;
            SGSTPercentageTotal += TotalSGSTValue;

            var TotalIGSTValue = parseFloat($(this).find('#IGSTAmount').val()) || 0;
            IGSTPercentageTotal += TotalIGSTValue;

            var TotalCESSValue = parseFloat($(this).find('#CESSAmount').val()) || 0;
            cessPercentageTotal += TotalCESSValue;
            var TotalamountValue = parseFloat($(this).find('.Totalamount-cell').text()) || 0;
            TotalamountTotal += TotalamountValue;
        });

        mainTable.find('#SubTotalTotal').val(SuntotalTotalamount.toFixed(2));
        mainTable.find('#discounttotal').val(discountTotal.toFixed(2));
        mainTable.find('#CGSTTotal').val(CGSTPercentageTotal.toFixed(2));
        mainTable.find('#SGSTTotal').val(SGSTPercentageTotal.toFixed(2));
        mainTable.find('#IGSTTotal').val(IGSTPercentageTotal.toFixed(2));
        mainTable.find('#CESSTotal').val(cessPercentageTotal.toFixed(2));

        mainTable.find('#Subtotal').val(TotalamountTotal.toFixed(2));
    },



    normalizeState: function (stateText) {
        return stateText.replace(/[^a-zA-Z]/g, '').toLowerCase();
    },
    updateGSTVisibility: function (stateSelector1, stateSelector2) {
        var State1 = Inventory.normalizeState($(stateSelector1).text());
        var State2 = Inventory.normalizeState($(stateSelector2).text());

        if (State1 !== State2) {

            $('#CGSTTotalDiv, #CGSTHead, #SGSTHead, .CGSTValues, .SGSTValues, #SGSTTotalDiv').hide();
            $('#IGSTHead, .IGSTValues, #IGSTTotalDiv').show();
        } else {

            $('#SGSTTotalDiv, #CGSTHead, #SGSTHead, .CGSTValues, .SGSTValues, #CGSTTotalDiv').show();
            $('#IGSTHead, .IGSTValues, #IGSTTotalDiv').hide();
        }
    },
    updateSellingPriceBasedOnUnitProductRow: function (unit, tableBody, rowElement, data, mainTable) {

        let sellingPriceInput = rowElement.find('.SellingPrice');
        let remainingStock = rowElement.find('.remaining-stock');
        var ReorderLevel = data.ReOrderLevel;
        var SecondaryUnitValue = data.SecondaryUnitValue;
        var StockInHand = data.StockInHand;
        var Qty = rowElement.find('.TableRowQty');
        const productId = rowElement.data('product-id');

        tableBody.find('.ProductTableRow').each(function () {
            const otherRow = rowElement.next();
            const otherProductId = otherRow.data('product-id');

            if (mainTable.is($('#DebitNoteProductTable, #EstimateProductTable, #CNProductTable'))) {
                if (unit === data.PrimaryUnitId) {

                    sellingPriceInput.val(
                        mainTable === "DebitNoteProductTable" ? data.PrimaryPrice : data.PrimaryPrice
                    );
                    remainingStock.text(StockInHand);
                    Inventory.updateRowColor(rowElement, ReorderLevel, StockInHand);

                } else if (unit === data.SecondaryUnitId) {
                    sellingPriceInput.val(
                        (
                            mainTable === "DebitNoteProductTable"
                                ? data.SecondaryPrice
                                : data.SecondaryPrice
                        ).toFixed(2)
                    );

                    remainingStock.text(data.SecondaryUnitStockInHand);

                    var SecondaryUnitROLevel = SecondaryUnitValue * ReorderLevel;
                    Inventory.updateRowColor(rowElement, SecondaryUnitROLevel, data.SecondaryUnitStockInHand);
                }
            }
            else if (!mainTable.is($('#POProductTable, #PIProductTable, #SaleReturnProductTable'))) {
                if (otherProductId === productId) {
                    var otherQuantity = parseInt(otherRow.find('.Quantity-cell').val()) || 1;

                    if (unit === data.PrimaryUnitId) {
                        sellingPriceInput.val(
                            mainTable === "PRProductTable" ? data.PrimaryPrice : data.PrimaryPrice
                        );
                        var TotalQUANTITY = otherQuantity + parseInt(Qty.val(), 10);
                        remainingStock.text(StockInHand);
                        Inventory.updateRowColor(rowElement, ReorderLevel, StockInHand);


                    } else if (unit === data.SecondaryUnitId) {
                        sellingPriceInput.val((mainTable === "PRProductTable" ? data.SecondaryPrice : data.SecondaryPrice).toFixed(2));

                        var TotalQUANTITY = otherQuantity + parseInt(Qty.val(), 10);
                        remainingStock.text(data.SecondaryUnitStockInHand);

                        var SecondaryUnitROLevel = SecondaryUnitValue * ReorderLevel;
                        Inventory.updateRowColor(rowElement, SecondaryUnitROLevel, data.SecondaryUnitStockInHand);

                    }

                } else {
                    if (unit === data.PrimaryUnitId) {
                        sellingPriceInput.val(
                            mainTable === "PRProductTable" ? data.PrimaryPrice : data.PrimaryPrice
                        );
                        remainingStock.text(StockInHand);
                        Inventory.updateRowColor(rowElement, ReorderLevel, StockInHand);
                        if (IsOutWard) {
                            Qty.val(data.Quantity);
                        }

                    } else if (unit === data.SecondaryUnitId) {
                        sellingPriceInput.val((mainTable === "PRProductTable" ? data.SecondaryPrice : data.SecondaryPrice).toFixed(2));


                        remainingStock.text(data.SecondaryUnitStockInHand);

                        var SecondaryUnitROLevel = SecondaryUnitValue * ReorderLevel;
                        Inventory.updateRowColor(rowElement, SecondaryUnitROLevel, data.SecondaryUnitStockInHand);
                        if (IsOutWard) {
                            Qty.val(data.SecondaryQuantity);
                        }
                    }

                }
            } else {
                if (unit === data.PrimaryUnitId) {
                    sellingPriceInput.val(
                        mainTable === "SaleReturnProductTable"
                            ? data.PrimaryPrice
                            : data.PrimaryPrice
                    );

                    remainingStock.text(StockInHand);
                    Inventory.updateRowColor(rowElement, ReorderLevel, StockInHand);

                } else if (unit === data.SecondaryUnitId) {
                    sellingPriceInput.val(
                        (
                            mainTable === "SaleReturnProductTable"
                                ? data.SecondaryPrice
                                : data.SecondaryPrice
                        ).toFixed(2)

                    );


                    remainingStock.text(data.SecondaryUnitStockInHand);

                    var SecondaryUnitROLevel = SecondaryUnitValue * ReorderLevel;
                    Inventory.updateRowColor(rowElement, SecondaryUnitROLevel, data.SecondaryUnitStockInHand);
                }

            }

        });
        Inventory.calculateTaxableAmount(rowElement);
        if (!mainTable.is($('#SaleProductTable'))) {
            Inventory.calculateCGST(rowElement);
            Inventory.calculateSGST(rowElement);
            Inventory.calculateIGST(rowElement);
            Inventory.calculateCESS(rowElement);
            Inventory.calculateTotalAmount(rowElement);
            Inventory.updateSubtotalRow(mainTable);
        } else {
            Inventory.SalecalculateCGST(rowElement);
            Inventory.SalecalculateSGST(rowElement);
            Inventory.SalecalculateIGST(rowElement);
            Inventory.SalecalculateCESS(rowElement);
            Inventory.SalecalculateTotalAmount(rowElement);
            Inventory.SaleupdateSubtotalRow(mainTable);
        }
        Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();

        calculateBalance();

    },


    ProductsGetNotNull: function (response, tablebody, mainTable) {

        if (response.status) {
            var datas = JSON.parse(response.data);
            var datas = JSON.parse(response.data, function (key, value) {
                if (key === 'PrimaryPrice') {
                    if (value === Math.floor(value)) {
                        return value + ".00";
                    } else {
                        return parseFloat(value.toFixed(2));
                    }
                }
                return value;
            });

            var data = datas[0][0];

            const productQuantity = selectedProductQuantity.shift() || 1;
            var ProductUnitId = 0;

            if (data.SaleId != null) {
                ProductUnitId = data.UnitId;
            } else {
                ProductUnitId = selectedProductUnitId.shift() || 1;
            }

            const gstPercentage = parseFloat(data.GSTPercentage) || 0;
            const taxableAmount = parseFloat(data.TaxableAmount) || 0;
            const gstAmount = (taxableAmount * gstPercentage) / 100;
            const cgstAmount = gstAmount / 2;
            const sgstAmount = gstAmount / 2;

            let currentRowNumber = tablebody.find('.ProductTableRow').length + 1;

            let existingRow = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`);
            let existingRowFirst = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`).first();

            if (existingRow.length) {
                //Code

            } else {
                mainTable.find('#AddItemButtonRow,#SubtotalRow').remove();
                let newRowHtml = `
            <tr class="ProductTableRow" data-product-id="${data.ProductId}" data-product-info='${JSON.stringify(data)}'>
                <td data-label="No">${currentRowNumber}</td>
                <td data-label="Product Name">
                    <label style="WHITE-SPACE: pre-wrap;">${data.ProductName || '-'}</label>
                    <textarea class="form-control mt-2 descriptiontdtext" placeholder="Description">${data.ProductDescription || ''}</textarea>
                </td>
               
                <td data-label="Selling Price" class="SellingPricediv">
                    <input type="text" class="form-control SellingPrice" value="" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)"/>
                    <label class="WholeSalePriceLabel" style="color: #ca8c00 !important; cursor: pointer; margin-top: 12px;display:none;">(WholeSale)</label>
                </td>
               
                <td data-label="QTY">
                 
                       <div class="input-group" style="width: 124px;">
                           <input type="text" class="form-control TableRowQty" value="${productQuantity || 1}" min="1" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" style=" width: 0%;"/>
                            <div class="input-group-append">
                                <span id="unitDropdownContainer" class="unit-dropdown">
                                       
                                </span>
                            </div>
                           <div class="freeqty d-none"><a>+ Free Qty</a></div>
                       </div>
                       <div style="justify-content: center;display: flex;margin-top: 5px;">
                            <span class="remaining-stock ml-2 d-none" style="color: green;display: flex ; align-items: center;">(${data.StockInHand || 0})</span>

                       </div>
                   
                </td>
                <td Class="Subtotal"  style="padding: 7px !important;">
                    
                     <input type="number" id="subtotalAmount" value="${data.SubTotal || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                 </td>

                <td class ="Dis-cell" data-label="Discount">  
                 <div style="display:flex;">
                       <select class="DiscountDropdown"><option value="1">%</option><option value="2">₹</option></select>
                       <input type="text" id="DisInput" class="form-control" value="${data.Discount || 0}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)" placeholder="0" aria-label="Text input with dropdown button">
                   </div>    
                </td>
                 <td class="StockInHand-cell" style="display:none;" data-label="Total">${data.StoreStockInHand || 0.00}</td>
                 <td class="ReOrderlevel-cell" style="display:none;" data-label="Total">${data.StoreReOrderLevel || 0.00}</td>
                 <td class="WholesalePrice-cell" style="display:none;" data-label="Total">${data.WholesalePrice || 0.00}</td>
                 <td class="WholesaleMinQty-cell" style="display:none;" data-label="Total">${data.WholesaleMinQty || 0.00}</td>
                 <td class="DiscountValue-cell" style="display:none;" data-label="Total">${data.DiscountValue || '₹'}</td>
                 <td class="TaxableAmount-cell" style="display:none;" data-label="Total">${data.TaxableAmount || 0.00}</td>
              
               <td Class="CGSTValues" data-label="CGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="CGSTPercentage" value="${data.CGST || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                 
                     <input type="text" id="CGSTAmount" value="${data.CESSAdAmount || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                     <small class="CGSTDisplay"></small>
                 </td>

                 <td Class="SGSTValues" data-label="SGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="SGSTPercentage" value="${data.SGST || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                  
                     <input type="text" id="SGSTAmount" value="${data.CESSAdAmount || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                      <small class="SGSTDisplay"></small>
                 </td>
           
                 <td Class="IGSTValues" data-label="IGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="IGSTPercentage" value="${data.IGST || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="IGSTAmount" value="${data.CESSAdAmount || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                     <small class="IGSTDisplay"></small>
                 </td>

                <td Class="CessValues" data-label="Cess" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="CESSPercentage" value="${data.CESS || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="CESSAmount" value="${data.CESSAdAmount || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                     <small class="CESSDisplay"></small>
                 </td>
                
                 <td style="display:none;"class="TotalTax-cell" data-label="Totaltax">${data.TotalTax || 0.00}</td>
                <td class="Totalamount-cell" data-label="Total">${data.TotalItemValue || 0.00}</td>
                <td data-label="Action" style="display: flex;justify-content: center;align-items: center;border: none;">
                    <button class="btn DynremoveBtn DynrowRemove" style="margin-top: 11px;" type="button"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>`;


                let newRow = $(newRowHtml);

                tablebody.append(newRow);
                mainTable.find('#AddItemButtonRow').remove();
                mainTable.find('#SubtotalRow').remove();
                let AddButtonRowHtml = `
            <tr id="AddItemButtonRow">
                                            <td colspan="12" class="add-item">
                                                <div class="add-item">
                                                    <a id="AddItemBtn" class="d-flex justify-content-center">+ Add Item</a>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr id="SubtotalRow" style="background-color: #e4edf5;">
                                                <td class="SubtotalTD" colspan="3"><div class="summary-label"><a>Sub Total</a></div></td>
                                              <td style="padding: 4px;" id="subtotalTotalDiv"> <input type="text" id="SubTotalTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>

                                                <td style="padding: 4px;" class="discounttotal" ><input id="discounttotal" type="text" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>
                                                <td style="padding: 4px;" id="CGSTTotalDiv"> <input type="text" id="CGSTTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>
                                                <td style="padding: 4px;" id="SGSTTotalDiv"> <input type="text" id="SGSTTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>
                                                <td style="padding: 4px;" id="IGSTTotalDiv"> <input type="text" id="IGSTTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>
                                                <td style="padding: 4px;" id="CESSTotalDiv"> <input type="text" id="CESSTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>

                                            <td colspan="3"><input type="text" disabled id="Subtotal" class="form-control" placeholder="0.00" style="width: 165px;background: #fbfbfb !important;"></td>
                                        </tr>

        `;
                tablebody.append(AddButtonRowHtml);
                if (mainTable.is($('#POProductTable,#PIProductTable,#PurchaseRequestProductTable'))) {

                    newRow.find('.Dis-cell').hide();

                    $(".SubtotalTD").attr("colspan", "4");
                    $(".totalRow").attr("colspan", "2");
                    $('.discounttotal,#DiscountColumn').hide();

                } else {

                    newRow.find('.Dis-cell').hide();

                    $(".SubtotalTD").attr("colspan", "4");
                    $(".totalRow").attr("colspan", "3");
                    $('.discounttotal,#DiscountColumn').hide();
                }
                if (mainTable.is($('#CNProductTable, #SaleReturnProductTable, #DebitNoteProductTable, #PRProductTable'))) {

                    $('#AddItemButtonRow').hide();
                } else {
                    $('#AddItemButtonRow').show();
                }


                if (!mainTable.is('#SaleProductTable, #DCProductTable')) {
                    newRow.find('.freeqty').hide();
                    $('#CGSTAmount, #SGSTAmount, #IGSTAmount, #CESSAmount').show();
                    $('.CGSTDisplay, .SGSTDisplay, .IGSTDisplay, .CESSDisplay').hide();
                } else {

                    $('#CGSTAmount, #SGSTAmount, #IGSTAmount, #CESSAmount').hide();
                    $('.CGSTDisplay, .SGSTDisplay, .IGSTDisplay, .CESSDisplay').show();
                }
                 
                if (mainTable.is('#PurchaseRequestProductTable')) { 
                    $('.Subtotal,.CGSTValues, .SGSTValues,.IGSTValues,.CessValues,.Totalamount-cell,.SellingPricediv').hide();
                    $('#SubtotalRow').hide();
                    $('.input-group').css('width', 'unset');
                } else {

                    $('.Subtotal, .CGSTValues, .SGSTValues,.IGSTValues,.CessValues,.Totalamount-cell,.SellingPricediv').show();
                    $('#SubtotalRow').show();
                }

                let $unitDropdownContainer = $('.ProductTableRow').last().find('#unitDropdownContainer');
                let Nrow = $('.ProductTableRow').last();

                var qtyInput = Nrow.find('.TableRowQty');
                var finalQTY = parseInt(qtyInput.val() || 0);

                var $select = $('<select class="QtyUnitDropDown"></select>');

                if (data.PrimaryUnitId && data.SecondaryUnitId) {

                    $select.append($('<option></option>').val(data.PrimaryUnitId).text(data.PrimaryUnitName));
                    $select.append($('<option></option>').val(data.SecondaryUnitId).text(data.SecondaryUnitName));

                    if (ProductUnitId === data.PrimaryUnitId) {
                        Inventory.PriceDetails(Nrow, mainTable, data, 1);
                        $select.find('option[value="' + data.PrimaryUnitId + '"]').prop('selected', true);
                        Nrow.find('.remaining-stock').text(data.StockInHand);
                        Nrow.find('.SellingPrice').val(data.PrimaryPrice);
                        Inventory.updateRowColor(Nrow, data.ReOrderLevel, data.StockInHand);
                        //if (!mainTable.is($('#POProductTable, #PIProductTable, #DebitNoteProductTable, #PRProductTable,#EstimateProductTable'))) {

                        //    if (finalQTY >= data.WholesaleMinQty && data.WholesaleMinQty > 0 && WholeSalePriceCheckBox.checked && finalQTY <= data.StoreStockInHand) {
                        //        Nrow.find('.SellingPrice').val(data.WholesalePrice);
                        //        Nrow.find('.WholeSalePriceLabel').show();

                        //    } else {

                        //        Nrow.find('.SellingPrice').val(data.PrimaryPrice);
                        //        Nrow.find('.WholeSalePriceLabel').hide();
                        //    }
                        //}
                    } else if (ProductUnitId === data.SecondaryUnitId) {
                        Inventory.PriceDetails(Nrow, mainTable, data, 0);
                        $select.find('option[value="' + data.SecondaryUnitId + '"]').prop('selected', true);
                        Nrow.find('.remaining-stock').text(data.SecondaryUnitStockInHand);
                        Nrow.find('.SellingPrice').val((data.PrimaryPrice / data.SecondaryUnitValue).toFixed(2));
                        var SEcondaryUnitReorderLevel = data.SecondaryUnitValue * data.ReOrderLevel;
                        Inventory.updateRowColor(Nrow, SEcondaryUnitReorderLevel, data.SecondaryUnitStockInHand);
                        //if (!mainTable.is($('#POProductTable, #PIProductTable, #DebitNoteProductTable, #PRProductTable,#EstimateProductTable'))) {

                        //    if (finalQTY >= data.SecondrayunitWholesaleMinQty && data.SecondrayunitWholesaleMinQty > 0 && WholeSalePriceCheckBox.checked && finalQTY <= data.SecondaryUnitStockInHand) {
                        //        Nrow.find('.SellingPrice').val(data.SecondaryunitWholesalePrice);
                        //        Nrow.find('.WholeSalePriceLabel').show();

                        //    } else {
                        //        Nrow.find('.SellingPrice').val((data.PrimaryPrice / data.SecondaryUnitValue).toFixed(2));
                        //        Nrow.find('.WholeSalePriceLabel').hide();
                        //    }
                        //}
                    }

                } else if (data.PrimaryUnitId) {
                    $select.append($('<option></option>').val(data.PrimaryUnitId).text(data.PrimaryUnitName));
                    Inventory.PriceDetails(Nrow, mainTable, data, 1);
                    Nrow.find('.remaining-stock').text(data.StockInHand);
                    Inventory.updateRowColor(Nrow, data.StoreReOrderLevel, data.StockInHand);
                    //if (!mainTable.is($('#POProductTable, #PIProductTable, #DebitNoteProductTable, #PRProductTable,#EstimateProductTable'))) {

                    //    if (finalQTY >= data.WholesaleMinQty && data.WholesaleMinQty > 0 && WholeSalePriceCheckBox.checked && finalQTY <= data.StoreStockInHand) {
                    //        Nrow.find('.SellingPrice').val(data.WholesalePrice);
                    //        Nrow.find('.WholeSalePriceLabel').show();

                    //    } else {

                    //        Nrow.find('.SellingPrice').val(data.Price);
                    //        Nrow.find('.WholeSalePriceLabel').hide();
                    //    }
                    //}
                }

                $unitDropdownContainer.append($select);
               
                Inventory.calculateTaxableAmount(Nrow);
                if (mainTable.is($('#SaleProductTable'))) {

                    Inventory.SalecalculateCESS(Nrow);
                    Inventory.SalecalculateCGST(Nrow);
                    Inventory.SalecalculateSGST(Nrow);
                    Inventory.SalecalculateIGST(Nrow);
                    Inventory.SalecalculateTotalAmount(Nrow);
                    Inventory.SaleupdateSubtotalRow(mainTable);

                    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();

                    calculateBalance();

                } else {
                    if (!mainTable.is($('#PurchaseRequestProductTable'))) {
                        Inventory.calculateCGST(Nrow);
                        Inventory.calculateSGST(Nrow);
                        Inventory.calculateIGST(Nrow);
                        Inventory.calculateCESS(Nrow);
                        Inventory.calculateTotalAmount(Nrow);
                        Inventory.updateSubtotalRow(mainTable);

                        Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();

                        calculateBalance();
                    }
                    
                }

            }
        }
        $('#loader-pms').hide();

    },

    TableProperty: function (Row) {
        Row.find('#DisInput').val(0);
        Row.find('.TaxableAmount-cell').text(0);
        /* Row.find('.CESSNonAdAmount, .StateCESSNonAmount ').val(0).prop('disabled', false);*/
        Row.find('#CESSPercentage, #StateCESSPercentage,#IGSTPercentage,#SGSTPercentage,#CGSTPercentage').val(0).prop('disabled', false);
    },
    PriceDetails: function (Row, mainTable, data, unit) {
        var priceInput = Row.find('.SellingPrice');

        if ($(mainTable).is('#POProductTable') || $(mainTable).is('#PIProductTable') || $(mainTable).is('#DebitNoteProductTable') || $(mainTable).is('#PRProductTable')) {


            if (unit == 1) {
                priceInput.val(data.PrimaryPrice);
            } else {
                priceInput.val((data.PrimaryPrice / data.SecondaryUnitValue).toFixed(2));
            }

        } else {
            if (unit == 1) {
                priceInput.val(data.PrimaryPrice);
            } else {
                priceInput.val((data.PrimaryPrice / data.SecondaryUnitValue).toFixed(2));
            }
        }

        if ($(mainTable).is('#SaleProductTable')) {
            if (unit == 1) {
                priceInput.val(data.PrimaryPrice);
            } else {
                priceInput.val((data.SecondaryPrice).toFixed(2));
            }
        }
    },
    GetNotNull: function (data, tablebody, mainTable, POID, stateSelector1, stateSelector2) {

        if (!selectedProductIdsList.includes(data.ProductId)) {
            selectedProductIdsList.push(data.ProductId);
        }

        var ProductUnitId = 0;
        ProductUnitId = data.UnitId;
        const gstPercentage = parseFloat(data.GSTPercentage) || 0;
        const taxableAmount = parseFloat(data.TaxableAmount) || 0;
        const gstAmount = (taxableAmount * gstPercentage) / 100;
        const cgstAmount = gstAmount / 2;
        const sgstAmount = gstAmount / 2;

        let currentRowNumber = tablebody.find('.ProductTableRow').length + 1;
        let existingRow = tablebody.find(`.ProductTableRow[data-product-id="${data.ProductId}"]`);


        var TotalValueOfItem = data.TotalItemValue;

        if (existingRow.length && TotalValueOfItem != 0) {

        } else if (existingRow.length && TotalValueOfItem == 0) {

        } else {
            mainTable.find('#AddItemButtonRow,#SubtotalRow ').remove();


            let newRowHtml = `
             <tr class="ProductTableRow" data-product-id="${data.ProductId}" data-product-info='${JSON.stringify(data)}'>
                <td data-label="No">${currentRowNumber}</td>
                <td data-label="Product Name">
                    <label style="WHITE-SPACE: pre-wrap;">${data.ProductName || '-'}</label>
                    <textarea class="form-control mt-2 descriptiontdtext" placeholder="Description">${data.ProductDescription || ''}</textarea>
                </td>
               
                <td data-label="Selling Price" class="SellingPricediv">
                    <input type="text" class="form-control SellingPrice" value="${data.PurchasePrice || data.SellingPrice}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)"/>
                    <label class="WholeSalePriceLabel" style="color: #ca8c00 !important; cursor: pointer; margin-top: 12px;display:none;">(WholeSale)</label>
                </td>
                 <td class="POQty-cell" data-label="Total">${data.POQty || data.Quantity}</td>
                 <td data-label="QTY">
                   
                       <div class="input-group" style="width: 124px;">
                           <input type="text" class="form-control TableRowQty" value="${data.Quantity || 1}" min="1" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 4)" style=" width: 0%;"/>
                            <div class="input-group-append">
                                <span id="unitDropdownContainer" class="unit-dropdown">
                                       
                                </span>
                            </div>
                           <div class="freeqty d-none"><a>+ Free Qty</a>${0}</div>
                       </div>
                       <div style="justify-content: center;display: flex;margin-top: 5px;">
                        <span class="remaining-stock ml-2 d-none" style="color: green;display: flex ; align-items: center;">(${data.StockInHand})</span>
                        </div>
                </td>
                 
               <td class="DifferenceCell" data-label="Total"></td>
               <td Class="Subtotal"  style="padding: 7px !important;">

                     <input type="text" id="subtotalAmount" value="${data.SubTotal || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                 </td>

                <td class ="Dis-cell" data-label="Discount">
                 <div style="display:flex;">
                       <select class="DiscountDropdown"><option value="1">%</option><option value="2">₹</option></select>
                       <input type="text" id="DisInput" class="form-control" value="${data.Discount || 0}" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 6)" placeholder="0" aria-label="Text input with dropdown button">
                   </div>    
                </td>
                 <td class="StockInHand-cell" style="display:none;" data-label="Total">${data.StoreStockInHand || 0.00}</td>
                 <td class="ReOrderlevel-cell" style="display:none;" data-label="Total">${data.StoreReOrderLevel || 0.00}</td>
                 <td class="WholesalePrice-cell" style="display:none;" data-label="Total">${data.WholesalePrice || 0.00}</td>
                 <td class="WholesaleMinQty-cell" style="display:none;" data-label="Total">${data.WholesaleMinQty || 0.00}</td>
                 <td class="DiscountValue-cell" style="display:none;" data-label="Total">${data.DiscountValue || '₹'}</td>
                 <td class="TaxableAmount-cell" style="display:none;" data-label="Total">${data.TaxableAmount || 0.00}</td>
               
                <td Class="CGSTValues" data-label="CGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="CGSTPercentage" value="${data.CGST || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>
                         
                    </div>
                   
                     <input type="text" id="CGSTAmount" value="${data.CGST_Value || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                     <small class="CGSTDisplay"></small>
                 </td>

                 <td Class="SGSTValues" data-label="SGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="SGSTPercentage" value="${data.SGST || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="SGSTAmount" value="${data.SGST_Value || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                     <small class="SGSTDisplay"></small>
                 </td>
           
                 <td Class="IGSTValues" data-label="IGST" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="IGSTPercentage" value="${data.IGST || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="IGSTAmount" value="${data.IGST_Value || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                     <small class="IGSTDisplay"></small>
                 </td>

                <td Class="CessValues" data-label="Cess" style="padding: 7px !important;">
                    <div style="display:none;">
                       <span class="ProductTablesymbol mt-2 mr-2";>%</span>
                         <input type="text" id="CESSPercentage" value="${data.CESS || 0.00}" class="form-control" oninput="Common.allowOnlyNumbersAndAfterDecimalTwoVal(this, 2)" placeholder="%" disabled>

                    </div>
                   
                     <input type="text" id="CESSAmount" value="${data.CESS_Value || 0.00}" class="form-control DisabledTextBox mt-2" placeholder="₹" Readonly>
                     <small class="CESSDisplay"></small>
                 </td>
                 <td style="display:none;"class="TotalTax-cell" data-label="Totaltax">${data.TotalTax || 0.00}</td>
                <td class="Totalamount-cell" data-label="Total">${data.TotalAmount || 0.00}</td>
                <td data-label="Action" style="display: flex;justify-content: center;align-items: center;border: none;">
                    <button class="btn DynremoveBtn DynrowRemove" style="margin-top: 11px;" type="button"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>`;


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

                                        <tr id="SubtotalRow" style="background-color: #e4edf5;">
                                            <td  class="SubtotalTD" colspan="3"><div class="summary-label"><a>Sub Total</a></div></td>
                                            <td style="padding: 4px;" id="subtotalTotalDiv"> <input type="text" id="SubTotalTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>

                                              <td style="padding: 4px;" class="discounttotal" ><input id="discounttotal" type="text" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>
                                              <td style="padding: 4px;" id="CGSTTotalDiv"> <input type="text" id="CGSTTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>
                                                <td style="padding: 4px;" id="SGSTTotalDiv"> <input type="text" id="SGSTTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>
                                                <td style="padding: 4px;" id="IGSTTotalDiv"> <input type="text" id="IGSTTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>
                                                <td style="padding: 4px;" id="CESSTotalDiv"> <input type="text" id="CESSTotal" class="form-control form-control-sm" placeholder="0.00" style="background: #fbfbfb !important;" disabled></td>

                                            <td class="totalRow" colspan="3"><input type="text" disabled id="Subtotal" class="form-control" placeholder="0.00" style="width: 165px;background: #fbfbfb !important;"></td>
                                        </tr>

        `;
            tablebody.append(AddButtonRowHtml);

            if (mainTable.is($('#POProductTable,#PIProductTable,#PRProductTable'))) {


                newRow.find('.Dis-cell').hide();

                $(".SubtotalTD").attr("colspan", "4");
                $(".totalRow").attr("colspan", "2");
                $('.discounttotal,#DiscountColumn').hide();



            } else {

                newRow.find('.Dis-cell').hide();

                $(".SubtotalTD").attr("colspan", "4");
                $(".totalRow").attr("colspan", "3");
                $('.discounttotal,#DiscountColumn').hide();
            }

            if (mainTable.is($('#PIProductTable'))) {

                var isPOID = POID ? true : false;
                if (isPOID) {
                    newRow.find('.DifferenceCell,.POQty-cell').show();
                    $('#POQTyColumn,#DifferenceColumn').show();
                    $('#PIQTyColumn').text(isPOID ? 'Actual Qty ' : 'Quantity');
                    $(".SubtotalTD").attr("colspan", "5");
                    $(".totalRow").attr("colspan", "3");
                    $('#SpanProduct').text('11111111');
                } else {
                    newRow.find('.DifferenceCell,.POQty-cell').hide();
                    $('#POQTyColumn,#DifferenceColumn').hide();
                    $('#PIQTyColumn').text('Quantity');
                    $(".SubtotalTD").attr("colspan", "4");
                    $(".totalRow").attr("colspan", "4");

                    $('#SpanProduct').text('11111111');
                }
                DiffrentQty(newRow, data.Quantity);
            } else {
                newRow.find('.DifferenceCell,.POQty-cell').hide();
                $('#POQTyColumn,#DifferenceColumn').hide();
                $('#PIQTyColumn').text('Quantity');
            }


            if (mainTable.is($('#CNProductTable, #SaleReturnProductTable, #DebitNoteProductTable, #PRProductTable'))) {

                $('#AddItemButtonRow').hide();
            } else {
                $('#AddItemButtonRow').show();
            }

            if (!mainTable.is('#SaleProductTable, #DCProductTable')) {
                newRow.find('.freeqty').hide();
                $('#CGSTAmount, #SGSTAmount, #IGSTAmount, #CESSAmount').show();
                $('.CGSTDisplay, .SGSTDisplay, .IGSTDisplay, .CESSDisplay').hide();
            } else {

                $('#CGSTAmount, #SGSTAmount, #IGSTAmount, #CESSAmount').hide();
                $('.CGSTDisplay, .SGSTDisplay, .IGSTDisplay, .CESSDisplay').show();
            }
            if (mainTable.is('#PurchaseRequestProductTable')) {

                $('.Subtotal,.CGSTValues, .SGSTValues,.IGSTValues,.CessValues,.Totalamount-cell,.SellingPricediv').hide();
                $('#SubtotalRow').hide();
            } else {

                $('.Subtotal, .CGSTValues, .SGSTValues,.IGSTValues,.CessValues,.Totalamount-cell,.SellingPricediv').show();
                $('#SubtotalRow').show();
            }
            let $unitDropdownContainer = $('.ProductTableRow').last().find('#unitDropdownContainer');
            let Nrow = $('.ProductTableRow').last();

            var qtyInput = Nrow.find('.TableRowQty');
            var finalQTY = parseInt(qtyInput.val() || 0);

            var $select = $('<select class="QtyUnitDropDown"></select>');

            if (data.PrimaryUnitId && data.SecondaryUnitId) {

                $select.append($('<option></option>').val(data.PrimaryUnitId).text(data.PrimaryUnitName));
                $select.append($('<option></option>').val(data.SecondaryUnitId).text(data.SecondaryUnitName));

                if (ProductUnitId === data.PrimaryUnitId) {
                    $select.find('option[value="' + data.PrimaryUnitId + '"]').prop('selected', true);
                    Inventory.PriceDetails(Nrow, mainTable, data, 1);
                    Nrow.find('.remaining-stock').text(data.StockInHand);
                    Inventory.updateRowColor(Nrow, data.ReOrderLevel, data.StockInHand);
                    //if (!mainTable.is($('#POProductTable, #PIProductTable, #DebitNoteProductTable, #PRProductTable,#EstimateProductTable'))) {

                    //    if (finalQTY >= data.WholesaleMinQty && data.WholesaleMinQty > 0 && WholeSalePriceCheckBox.checked && finalQTY <= data.StoreStockInHand) {
                    //        /* Nrow.find('.SellingPrice').val(data.WholesalePrice);*/
                    //        Nrow.find('.WholeSalePriceLabel').show();

                    //    } else {
                    //        /*Nrow.find('.SellingPrice').val(data.Price);*/
                    //        Nrow.find('.WholeSalePriceLabel').hide();
                    //    }
                    //}
                }

                else if (ProductUnitId === data.SecondaryUnitId) {
                    $select.find('option[value="' + data.SecondaryUnitId + '"]').prop('selected', true);
                    Inventory.PriceDetails(Nrow, mainTable, data, 2);
                    /* Nrow.find('.SellingPrice').val(data.SecondaryUnitPurchasePrice);*/

                    Nrow.find('.remaining-stock').text(data.SecondaryUnitStockInHand);
                    var SEcondaryUnitReorderLevel = data.SecondaryUnitValue * data.ReOrderLevel;

                    Inventory.updateRowColor(Nrow, SEcondaryUnitReorderLevel, data.SecondaryUnitStockInHand);
                    //if (!mainTable.is($('#POProductTable, #PIProductTable, #DebitNoteProductTable, #PRProductTable,#EstimateProductTable'))) {

                    //    if (finalQTY >= data.SecondrayunitWholesaleMinQty && data.SecondrayunitWholesaleMinQty > 0 && WholeSalePriceCheckBox.checked && finalQTY <= data.SecondaryUnitStockInHand) {
                    //        /*Nrow.find('.SellingPrice').val(data.SecondaryunitWholesalePrice);*/
                    //        Nrow.find('.WholeSalePriceLabel').show();

                    //    } else {
                    //        /* Nrow.find('.SellingPrice').val((data.Price / data.SecondaryUnitValue).toFixed(2));*/
                    //        Nrow.find('.WholeSalePriceLabel').hide();
                    //    }
                    //}
                }

            } else if (data.PrimaryUnitId) {

                $select.append($('<option></option>').val(data.PrimaryUnitId).text(data.PrimaryUnitName));
                Inventory.PriceDetails(Nrow, mainTable, data, 1);
                Nrow.find('.remaining-stock').text(data.StoreStockInHand);
                Inventory.updateRowColor(Nrow, data.ReOrderLevel, data.StockInHand);
                //if (!mainTable.is($('#POProductTable, #PIProductTable, #DebitNoteProductTable, #PRProductTable,#EstimateProductTable'))) {

                //    if (finalQTY >= data.WholesaleMinQty && data.WholesaleMinQty > 0 && WholeSalePriceCheckBox.checked && finalQTY <= data.StoreStockInHand) {
                //        /* Nrow.find('.SellingPrice').val(data.WholesalePrice);*/
                //        Nrow.find('.WholeSalePriceLabel').show();

                //    } else {
                //        /* Nrow.find('.SellingPrice').val(data.Price);*/
                //        Nrow.find('.WholeSalePriceLabel').hide();
                //    }
                //}
            }


            $unitDropdownContainer.append($select);


            if (data.IGST !== null) {
                var Visible = 'True';
            } else {
                var Visible = 'False';
            }
            //Inventory.updateGSTVisibility(stateSelector1, stateSelector2);
            Inventory.calculateTaxableAmount(Nrow);
            if (mainTable.is($('#SaleProductTable'))) {

                Inventory.SalecalculateCESS(Nrow);
                Inventory.SalecalculateCGST(Nrow);
                Inventory.SalecalculateSGST(Nrow);
                Inventory.SalecalculateIGST(Nrow);
                Inventory.calculateNotNullTotalAmount(Nrow, Visible);
                Inventory.SaleupdateSubtotalRow(mainTable);
                Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
                calculateBalance();

            } else {

                if (!mainTable.is($('#PurchaseRequestProductTable'))) {
                    
                    Inventory.updateSubtotalRow(mainTable);

                    Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();

                    calculateBalance();
                }
            }
           
        }
    },

    calculateNotNullTotalAmount: function (row, Visible) {
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var CGSTAmount = parseFloat(row.find('#CGSTAmount').val()) || 0;
        var SGSTAmount = parseFloat(row.find('#SGSTAmount').val()) || 0;
        var IGSTAmount = parseFloat(row.find('#IGSTAmount').val()) || 0;
        var CESSAmount = parseFloat(row.find('#CESSAmount').val()) || 0;

        var totalAmount = 0;
        var totalTAX = 0;
        if (Visible == "True") {
            totalAmount = taxableAmount + IGSTAmount + CESSAmount;
            totalTAX = IGSTAmount + CESSAmount;
        } else if (Visible == "False") {
            totalAmount = taxableAmount + CGSTAmount + SGSTAmount + CESSAmount;
            totalTAX = CGSTAmount + SGSTAmount + CESSAmount;
        } else {
            totalAmount = taxableAmount + CESSAmount;
            totalTAX = CESSAmount;
        }

        row.find('.TotalTax-cell').text(totalTAX.toFixed(2));
        row.find('.Totalamount-cell').text(totalAmount.toFixed(2));

        return totalAmount;
    },
    RemoveProductMainRow: function (row, productId, mainTable) {
        let mainRow = mainTable.find(`.ProductTableRow[data-product-id="${productId}"]`).first();
        let TotalRow = mainTable.find(`.ProductTableRow[data-product-id="${productId}"]`);
        selectedProductIdsList = selectedProductIdsList.filter(id => id !== productId);
        row.remove();
        Inventory.updateSubtotalRow(mainTable);
        Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();

        calculateBalance();

        $('.ProductTableRow').each(function (index) {
            $(this).find('td[data-label="No"]').text(index + 1);
        });
    },

    QuantityInputChange: function (finalQTY, row, QtyUnitDropDown, data, productId, tablebody, mainTable, existingRow, existingRowFirst) {
        tablebody.find('.ProductTableRow').each(function () {
            const otherRow = row.next();
            const otherProductId = otherRow.data('product-id');
            var NewRow = parseInt(otherRow.find('.Quantity-cell').val()) || 1;
            var Qty = NewRow + finalQTY;
            if (otherProductId === productId) {

            } else {

                if (QtyUnitDropDown === data.PrimaryUnitId) {

                    if (mainTable.is($('#DCProductTable,#SaleProductTable'))) {
                        if (finalQTY >= data.StockInHand) {
                            Inventory.QuantityRange(data.StockInHand, existingRow);
                            existingRow.find('.TableRowQty').val(data.StockInHand);

                        }
                    }
                    existingRow.find('.remaining-stock').text(data.StockInHand);
                    Inventory.updateRowColor(existingRow, data.ReOrderLevel, data.StockInHand);
                    //if (!mainTable.is($('#POProductTable, #PIProductTable, #DebitNoteProductTable, #PRProductTable,#EstimateProductTable'))) {

                    //    if (finalQTY >= data.WholesaleMinQty && data.WholesaleMinQty > 0 && WholeSalePriceCheckBox.checked && finalQTY <= data.StoreStockInHand) {
                    //        existingRowFirst.find('.SellingPrice').val(data.WholesalePrice);
                    //        existingRowFirst.find('.WholeSalePriceLabel').show();

                    //    } else {
                    //        existingRowFirst.find('.SellingPrice').val(data.Price);
                    //        existingRowFirst.find('.WholeSalePriceLabel').hide();
                    //    }
                    //}
                }
                else if (QtyUnitDropDown === data.SecondaryUnitId) {
                    /*Inventory.PriceDetails(existingRow, mainTable, data, 0);*/

                    if (mainTable.is($('#DCProductTable,#SaleProductTable'))) {
                        if (finalQTY >= data.SecondaryUnitStockInHand) {
                            Inventory.QuantityRange(data.SecondaryUnitStockInHand, existingRow);
                            existingRow.find('.TableRowQty').val(data.SecondaryUnitStockInHand);

                        }
                    }

                    existingRow.find('.remaining-stock').text(data.SecondaryUnitStockInHand);
                    var SEcondaryUnitReorderLevel = data.SecondaryUnitValue * data.ReOrderLevel;
                    Inventory.updateRowColor(existingRow, SEcondaryUnitReorderLevel, data.SecondaryUnitStockInHand);
                    //if (!mainTable.is($('#POProductTable, #PIProductTable, #DebitNoteProductTable, #PRProductTable,#EstimateProductTable'))) {

                    //    if (finalQTY >= data.SecondrayunitWholesaleMinQty && data.SecondrayunitWholesaleMinQty > 0 && WholeSalePriceCheckBox.checked && finalQTY <= data.SecondaryUnitStockInHand) {
                    //        existingRowFirst.find('.SellingPrice').val(data.SecondaryunitWholesalePrice);
                    //        existingRowFirst.find('.WholeSalePriceLabel').show();

                    //    } else {
                    //        existingRowFirst.find('.SellingPrice').val((data.Price / data.SecondaryUnitValue).toFixed(2));
                    //        existingRowFirst.find('.WholeSalePriceLabel').hide();
                    //    }
                    //}
                }
            }
        });

        Inventory.calculateTaxableAmount(row);

        if (mainTable.is($('#SaleProductTable'))) {

            Inventory.SalecalculateCESS(row);
            Inventory.SalecalculateCGST(row);
            Inventory.SalecalculateSGST(row);
            Inventory.SalecalculateIGST(row);
            Inventory.SalecalculateTotalAmount(row);
            Inventory.SaleupdateSubtotalRow(mainTable);

        } else {
            Inventory.calculateCGST(row);
            Inventory.calculateSGST(row);
            Inventory.calculateIGST(row);
            Inventory.calculateCESS(row);
            Inventory.calculateTotalAmount(row);
            Inventory.updateSubtotalRow(mainTable);
        }

        Inventory.PercentageAmountInventoryCalculateGrandTotalByOtherChargeValue();
        calculateBalance();
    },
    QuantityRange: function (data, existingRow) {

        //existingRow.find('.TableRowQty').tooltip({
        //    trigger: 'manual',
        //    placement: 'top',
        //    title: "Quantity cannot exceed available stock (" + data + ")",
        //}).tooltip('show');

        //setTimeout(function () {
        //    existingRow.find('.TableRowQty').tooltip('hide');
        //}, 2000);
        Common.warningMsg("Quantity cannot exceed available stock (" + data + ")");
    },
    FreeQuantityRange: function (data, Row) {

        Row.find('.freeqty').tooltip({
            trigger: 'manual',
            placement: 'bottom',
            title: "Quantity cannot exceed available stock (" + data + ")",
        }).tooltip('show');

        setTimeout(function () {
            Row.find('.freeqty').tooltip('hide');
        }, 2000);

    },
    AddDateFromDays: function (AddDays, DueDateId) {

        var CurrentDate = new Date(Common.CurrentDate());
        CurrentDate = CurrentDate.setDate(CurrentDate.getDate() + AddDays);

        var date = new Date(CurrentDate);

        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');

        var AddedDate = `${year}-${month}-${day}`;

        $("#" + DueDateId).val(AddedDate);

    },
    AddDayFromDate: function (date, PaidFromDays) {

        var CurrentDate = Common.CurrentDate();

        var date1 = new Date(date);
        var date2 = new Date(CurrentDate);

        var differenceInTime = date1.getTime() - date2.getTime();

        var differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

        $("#" + PaidFromDays).val(differenceInDays);

    },
    updateMOPDropdowns: function () {
        const allDropdowns = $('.ModeOfPaymentId');

        allDropdowns.each(function () {
            const currentValue = $(this).val();
            $(this).find('option').each(function () {
                // Check if the option should be disabled
                if (selectedMOPs.has($(this).val()) && $(this).val() !== currentValue) {
                    $(this).prop('disabled', true).css({
                        'background-color': '#dfd4d4', // Gray out disabled options
                        'cursor': 'not-allowed'        // Indicate that the option is not selectable
                    });
                } else {
                    $(this).prop('disabled', false).css({
                        'background-color': 'white',   // Reset the background color to white for enabled options
                        'cursor': 'pointer'            // Normal cursor for selectable options
                    });
                }
            });
        });
    },

    BindMopDetails: function (value, index) {

        // Dynamic row binding
        var numberIncr = index;
        var defaultOption = '<option value="">--Select--</option>';
        var selectOptions = "";

        if (MOPDropdown != null && MOPDropdown.length > 0 && MOPDropdown[0].length > 0) {
            selectOptions = MOPDropdown[0].map(function (product) {
                var isSelected = product.ModeOfPaymentId == value.ModeOfPaymentId ? 'selected' : '';
                return `<option value="${product.ModeOfPaymentId}" ${isSelected}>${product.ModeOfPaymentName}</option>`;
            }).join('');
        }

        var totalOption = defaultOption + selectOptions;

        if (index == 0) {
            var newRowDataHtml = `
            <div class="input-group mt-2 mb-2 MOPdynamicRow">
                  <input type="text"  value="${value.MOPAmount}"  id="PaymenyTextBox${numberIncr}" name="PaymenyTextBox${numberIncr}" class="MOPAmount form-control" placeholder="Amount" aria-label="Store Name">
                  <select class="form-select form-control ModeOfPaymentId" name="ModeOfPaymentId${numberIncr}" id="ModeOfPaymentId${numberIncr}" required>
                      ${totalOption}
                  </select>
                <!-- Add Button on the Right -->
                <button id="addPartialPayment" class="btn DynAddBtn AddStockBtn ml-2" type="button">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            `;
        }
        else {
            var newRowDataHtml = `
            <div class="input-group mt-2 mb-2 MOPdynamicRow">
                  <input type="text"  value="${value.MOPAmount}"  id="PaymenyTextBox${numberIncr}" name="PaymenyTextBox${numberIncr}" class="MOPAmount form-control" placeholder="Amount" aria-label="Store Name">
                  <select class="form-select form-control ModeOfPaymentId" name="ModeOfPaymentId${numberIncr}" id="ModeOfPaymentId${numberIncr}" required>
                      ${totalOption}
                  </select>
                <button class="btn DynRemoveBtn PaymentDynremoveBtn DynrowRemove ml-2" type="button" onclick="removeRow(${numberIncr})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            `;
        }
        $('#appendContainer').append(newRowDataHtml);

    },

    toggleField: function (fieldValue, fieldId, addFieldId, addFieldLabelId) {
        if (fieldValue) {
            $(fieldId).val(fieldValue);
            $(addFieldId).show();
            $(addFieldLabelId).hide();
        } else {
            $(addFieldId).hide();
            $(addFieldLabelId).show();
        }
    },

    toggleFieldForAttachment: function (fieldValue, fieldId, addFieldId) {
        if (fieldValue != null) {
            $(fieldId).hide();
            $(addFieldId).show();
        } else {
            $(fieldId).show();
            $(addFieldId).hide();
        }
    },

    PurchaseHeaderBindData: async function (response) {

        var data = JSON.parse(response.data);
        var poData = data[1][0];

        $('#AddNotesText').val(poData.Notes);
        $('#TermsAndCondition').val(poData.TermsAndCondition);

        $('#Subtotal').val(poData.Subtotal);

        $('#roundOff').val(poData.RoundOffValue);
        var roundOff = poData.RoundOffValue;
        const colorMap = roundOff === 0 ? "orange" : roundOff > 0 ? "#4ce53d" : "red";
        $("#roundOff").css("color", colorMap);

        $('#GrantTotal').val(poData.GrantTotal);



        var VendorId = parseInt(poData.VendorId);
        var responseData1 = await Common.getAsycData("/Common/VendorDetailsByVendorId?vendorId=" + parseInt(VendorId));
        if (responseData1 !== null) {
            Inventory.VendorAddressDetails(responseData1);
        } else {
            Inventory.ClearDataForVendorAddressDetails();
        }

        $('#Vendor').val(parseInt(VendorId)).trigger('change');


    },
    bindSaleHeaderBillingAddress: function (data) {

        var clientId = parseInt(data[1][0].ClientId);
        var shippingAddressId = parseInt(data[1][0].ShippingAddressId);
        var isSameBillingAddress = data[1][0].IsBillingAndShippingSameAddress

        if (isSameBillingAddress == 1) {
            $("#Check").prop('checked', true);
            $("#TakeId").prop('disabled', true);
        } else {
            $("#Check").prop('checked', false);
            $("#TakeId").prop('disabled', false);
        }

        if (clientId > 0 && isSameBillingAddress == 1 && shippingAddressId > 0) {
            Common.bindDropDownParent('ClientId', 'ClientColumn', 'Client', async function () {
                $("#ClientId").val(clientId).trigger('change');
                var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(clientId));
                if (responseData1 !== null) {
                    Inventory.ClientAddressDetails(responseData1);
                }
            });

            $('#VendorEdit').show();
            $('#ShippingEdit').hide();
        }
        else if (clientId > 0 && isSameBillingAddress == 0 && shippingAddressId > 0) {

            Common.bindDropDownParent('ClientId', 'ClientColumn', 'Client', async function () {
                $("#ClientId").val(clientId).trigger('change');
                var responseData1 = await Common.getAsycData("/Common/ClientDetailsByClientId?clientId=" + parseInt(clientId));
                if (responseData1 !== null) {

                    Inventory.ClientAddressDetails(responseData1);

                    var responseData2 = await Common.getAsycData("/Sale/GetShifingDropdownByClientId?ModuleType=" + "Client" + "&ModuleTypeId=" + parseInt(clientId));
                    if (responseData2 !== null) {
                        Common.bindParentDropDownSuccess(responseData2, 'TakeId', 'ShippingColumn');
                    }

                    $("#TakeId").val(shippingAddressId).trigger('change');

                    var responseData3 = await Common.getAsycData("/Sale/GetAlternateAddressDetails?Type=Client&AltAddressId=" + parseInt(shippingAddressId) + "&ModuleTypeId=" + parseInt(clientId));
                    if (responseData3 !== null) {

                        Inventory.ClientAlternativeAddressDetails(responseData3);
                    }
                }
            });

            $('#VendorEdit').show();
            $('#ShippingEdit').show();
        }
        else {
            $('#VendorEdit').hide();
            $('#ShippingEdit').hide();
        }
    },
    bindSaleProducts: function (products, tablebody, mainTable, POID, stateSelector1, stateSelector2) {

        if (products.length > 0) {
            products.forEach(row => {
                Inventory.GetNotNull(row, tablebody, mainTable, POID, stateSelector1, stateSelector2);
            });
        }
    },
    bindOtherCharges: function (charges) {

        if (charges && charges.length > 0) {
            charges.forEach((charge, index) => {
                Inventory.BindOtherChargesDataDetails(charge, index);
            });
        }
    },
    GetMopDetails: function (mopDetails) {

        if (mopDetails && mopDetails.length > 0) {
            mopDetails.forEach((detail, index) => {
                Inventory.BindMopDetails(detail, index);
                Inventory.updateMOPDropdowns();
            });
        }
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

    AttachmentPdfSuccess: function (response, moduleName) {

        if (response.success) {
            // Decode the base64 string to a binary format
            const byteCharacters = atob(response.fileContent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);


            const linkText = `${moduleName}`;

            var attachmentHtml = `
        <div class="attachment-item">
            <a id="PDF" href="${blobUrl}" target="_blank">
                <i class="fas fa-file-pdf" style="color: red;"></i> ${linkText}
            </a>  
        </div>`;

            // Append the attachment to the AttachmentArea
            $("#AttachmentArea").append(attachmentHtml);

            // Show the SendMail modal
            $('#SendMail').modal('show');
            $('#loader-pms').hide();
        } else {
            Common.errorMsg('Error occurred while Print document');
        }
    },
    EmailSendbutton: function () {

        var recipientEmails = $("#EmailDetails #VendorEmail").val().split(';');
        var ccEmails = $("#EmailDetails #CC").val() ? $("#EmailDetails #CC").val().split(';') : null;
        var bccEmails = $("#EmailDetails #BCC").val() ? $("#EmailDetails #BCC").val().split(';') : null;
        var recipientSubject = $("#EmailDetails #Subject").val();
        var recipientEmailBody = $("#EmailDetails .note-editable").html();
        var emailUserName = $("#EmailDetails #EmailUserName").val();
        var emailPassword = $("#EmailDetails #EmailPassword").val();
        var attachmentUrl = $('#AttachmentArea a').attr('href');

        // Fetch the file and convert to base64
        var xhr = new XMLHttpRequest();
        xhr.open('GET', attachmentUrl, true);
        xhr.responseType = 'blob'; // Set response type to blob
        xhr.onload = function () {
            if (xhr.status === 200) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    var base64String = reader.result.split(',')[1]; // Extract base64 string

                    // Pass all the parameters to the sendEmail function
                    Inventory.sendEmail(recipientEmails, ccEmails, bccEmails, recipientSubject, recipientEmailBody, emailUserName, emailPassword, base64String);
                };
                reader.readAsDataURL(xhr.response); // Convert blob to base64
            } else {
                Common.errorMsg('Error occurred while fetching the attachment');
                $('#loader-pms').hide();
                $('#SendButton').html('Send');
            }
        };

        xhr.onerror = function () {
            Common.errorMsg('Error occurred while fetching the attachment');
            $('#loader-pms').hide();
            $('#SendButton').html('Send');
        };

        xhr.send();
        $('#loader-pms').hide();
    },
    sendEmail: function (recipientEmails, ccEmails, bccEmails, subject, body, userName, password, fileContent) {
        // Define emailData object
        var emailData = {
            RecipientEmails: recipientEmails,
            CCEmails: ccEmails,
            BCCEmails: bccEmails,
            Subject: subject,
            Body: body,
            EmailUserName: userName,
            EmailPassword: password,
            FileContent: fileContent,
            ModuleName: "Tax Invoice"
        };

        // AJAX call to send email
        $.ajax({
            url: '/Common/SendEmailWithAttachment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(emailData),
            success: function (emailResponse) {
                if (emailResponse.success) {
                    Common.successMsg('Email sent successfully');
                    $('#loader-pms').hide();
                    $('#SendMail').modal('hide');

                } else {
                    Common.errorMsg('Error: ' + emailResponse.message);
                }
            },
            error: function () {
                Common.errorMsg('Error occurred while sending the email');
            },
            complete: function () {
                $('#loader-pms').hide();
                $('#SendButton').html('Send');
            }
        });
    },

    toggleContentTermAndNoteData: function (content, addLabel, hideLabel, contentElement, textElement) {
        if (content && content.trim() !== "") {
            $(addLabel).hide();
            $(hideLabel).show();
            $(contentElement).show();
            $(textElement).val(content);
        } else {
            $(addLabel).show();
            $(hideLabel).hide();
            $(contentElement).hide();
            $(textElement).val("");
        }
    },

    StatusActivity: function (response) {
        var parsedData = JSON.parse(response.data);
        var timelineData = parsedData[0];

        var $timeline = $(".horizontal-timeline");


        $timeline.find(".timeline-stage").remove();
        var progressStatuses = [];

        $.each(timelineData, function (index, item) {
            var status = item.InventoryStatusName || "Unknown";
            var user = item.UserName || "N/A";
            var color = item.Status_Color || "#000";

            var date = new Date(item.CreatedDate);
            var formattedDate = date.toLocaleDateString('en-GB') + ', ' +
                date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            var statusClass = "status-" + status.toLowerCase().replace(/\s+/g, '');

            var $stage = $('<div>', {
                class: `timeline-stage ${statusClass}`
            });

            var $marker = $('<div>', { class: 'stage-marker' });

            var $statusSpan = $('<span>', {
                class: 'stage-status',
                text: status,
                css: { color: color }
            });

            $marker.append($statusSpan);

            var $content = $('<div>', { class: 'stage-content' });
            $('<span>', { class: 'stage-approver', text: user }).appendTo($content);
            $('<span>', { class: 'stage-datetime', text: formattedDate }).appendTo($content);

            $stage.append($marker).append($content);
            $timeline.append($stage);


            progressStatuses.push(status);

        });

        setTimeout(function () {
            Inventory.updateTimelineProgress(progressStatuses);

        }, 1000);
    },

    updateTimelineProgress: function (progressStatuses) {
        var $timeline = $(".horizontal-timeline");
        var $fillLine = $timeline.find(".timeline-progress-line-fill");
        var $stages = $timeline.find(".timeline-stage");

        if ($stages.length === 0) return;

        let $lastValidStage = null;

        $stages.each(function () {
            const statusText = $(this).find(".stage-status").text().trim();
            if (progressStatuses.includes(statusText)) {
                $lastValidStage = $(this);
            }
        });

        if ($lastValidStage) {
            const $marker = $lastValidStage.find(".stage-marker");
            const timelineLeft = $timeline.offset().left;
            const markerCenter = $marker.offset().left + ($marker.outerWidth() / 2);

            const fillWidth = markerCenter - timelineLeft;

            $fillLine.css({
                width: fillWidth + "px"
            });
        } else {
            $fillLine.css({ width: "0" });
        }
    },

    SalecalculateCESS: function (row) {
        var cessPercentage = parseFloat(row.find('#CESSPercentage').val()) || 0;
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var cessAmount = (cessPercentage * taxableAmount) / 100;

        // Set numeric value to input field only
        row.find('#CESSAmount').val(cessAmount.toFixed(2)).data('raw', cessAmount.toFixed(2));

        // Optional: update formatted display text
        row.find('.CESSDisplay').text(`${cessAmount.toFixed(2)} (${cessPercentage}%)`);

        return cessAmount;
    },

    SalecalculateCGST: function (row) {
        var CGSTPercentage = parseFloat(row.find('#CGSTPercentage').val()) || 0;
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var CGSTAmount = (CGSTPercentage * taxableAmount) / 100;

        row.find('#CGSTAmount').val(CGSTAmount.toFixed(2)).data('raw', CGSTAmount.toFixed(2));
        row.find('.CGSTDisplay').text(`${CGSTAmount.toFixed(2)} (${CGSTPercentage}%)`);

        return CGSTAmount;
    },

    SalecalculateSGST: function (row) {
        var SGSTPercentage = parseFloat(row.find('#SGSTPercentage').val()) || 0;
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var SGSTAmount = (SGSTPercentage * taxableAmount) / 100;

        row.find('#SGSTAmount').val(SGSTAmount.toFixed(2)).data('raw', SGSTAmount.toFixed(2));
        row.find('.SGSTDisplay').text(`${SGSTAmount.toFixed(2)} (${SGSTPercentage}%)`);

        return SGSTAmount;
    },

    SalecalculateIGST: function (row) {
        var IGSTPercentage = parseFloat(row.find('#IGSTPercentage').val()) || 0;
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var IGSTAmount = (IGSTPercentage * taxableAmount) / 100;

        row.find('#IGSTAmount').val(IGSTAmount.toFixed(2)).data('raw', IGSTAmount.toFixed(2));
        row.find('.IGSTDisplay').text(`${IGSTAmount.toFixed(2)} (${IGSTPercentage}%)`);

        return IGSTAmount;
    },

    SalecalculateTotalAmount: function (row) {
        var taxableAmount = parseFloat(row.find('.TaxableAmount-cell').text()) || 0;

        var CGSTAmount = parseFloat(row.find('#CGSTAmount').data('raw')) || 0;
        var SGSTAmount = parseFloat(row.find('#SGSTAmount').data('raw')) || 0;
        var IGSTAmount = parseFloat(row.find('#IGSTAmount').data('raw')) || 0;
        var CESSAmount = parseFloat(row.find('#CESSAmount').data('raw')) || 0;

        var totalAmount = 0;
        var totalTAX = 0;

        var isIGSTVisible = row.find('.IGSTValues').is(':visible');
        var isCGST_SGST_Visible = row.find('.CGSTValues').is(':visible') || row.find('.SGSTValues').is(':visible');

        if (isIGSTVisible) {
            totalAmount = taxableAmount + IGSTAmount + CESSAmount;
            totalTAX = IGSTAmount + CESSAmount;
        } else if (isCGST_SGST_Visible) {
            totalAmount = taxableAmount + CGSTAmount + SGSTAmount + CESSAmount;
            totalTAX = CGSTAmount + SGSTAmount + CESSAmount;
        } else {
            totalAmount = taxableAmount + CESSAmount;
            totalTAX = CESSAmount;
        }

        row.find('.TotalTax-cell').text(totalTAX.toFixed(2));
        row.find('.Totalamount-cell').text(totalAmount.toFixed(2));

        return totalAmount;
    },

    SaleupdateSubtotalRow: function (mainTable) {
        var discountTotal = 0;
        var CGSTPercentageTotal = 0;
        var SGSTPercentageTotal = 0;
        var IGSTPercentageTotal = 0;
        var cessPercentageTotal = 0;
        var TotalamountTotal = 0;
        var SuntotalTotalamount = 0;

        mainTable.find('.ProductTableRow').each(function () {
            var row = $(this);

            var symbol = row.find('.DiscountDropdown option:selected').text();
            var originalPrice = parseFloat(row.find('.SellingPrice').val()) || 0;

            if (symbol === '₹') {
                var discountValue = parseFloat(row.find('#DisInput').val()) || 0;
                discountTotal += discountValue;
            } else if (symbol === '%') {
                var discountPercentage = parseFloat(row.find('#DisInput').val()) || 0;
                var discountValue = (discountPercentage / 100) * originalPrice;
                discountTotal += discountValue;
            }

            var TotalSubValue = parseFloat(row.find('#subtotalAmount').val()) || 0;
            SuntotalTotalamount += TotalSubValue;

            var TotalCGSTValue = parseFloat(row.find('#CGSTAmount').data('raw')) || 0;
            CGSTPercentageTotal += TotalCGSTValue;

            var TotalSGSTValue = parseFloat(row.find('#SGSTAmount').data('raw')) || 0;
            SGSTPercentageTotal += TotalSGSTValue;

            var TotalIGSTValue = parseFloat(row.find('#IGSTAmount').data('raw')) || 0;
            IGSTPercentageTotal += TotalIGSTValue;

            var TotalCESSValue = parseFloat(row.find('#CESSAmount').data('raw')) || 0;
            cessPercentageTotal += TotalCESSValue;

            var TotalamountValue = parseFloat(row.find('.Totalamount-cell').text()) || 0;
            TotalamountTotal += TotalamountValue;
        });

        mainTable.find('#SubTotalTotal').val(SuntotalTotalamount.toFixed(2));
        mainTable.find('#discounttotal').val(discountTotal.toFixed(2));
        mainTable.find('#CGSTTotal').val(CGSTPercentageTotal.toFixed(2));
        mainTable.find('#SGSTTotal').val(SGSTPercentageTotal.toFixed(2));
        mainTable.find('#IGSTTotal').val(IGSTPercentageTotal.toFixed(2));
        mainTable.find('#CESSTotal').val(cessPercentageTotal.toFixed(2));
        mainTable.find('#Subtotal').val(TotalamountTotal.toFixed(2));
    },




    /* =====================================  Kavinesh  ============================== */
    ForRemoveBindVendorColumnPurshase: function () {
        // Array of the IDs you want to clear text for
        const vendorFields = [
            "#VendorName",
            "#VendorAddress",
            "#VendorCountry",
            "#VendorStateName",
            "#VendorEmail",
            "#VendorContactNumber",
            "#VendorGSTNumber",
            "#VendorCity",
            "#StateIdGet"
        ];

        // Loop through each element and set its text to empty
        vendorFields.forEach(function (field) {
            $("#VendorColumn " + field).text('');
        });
        $('#VendorColumn  #Vendor').val("").trigger('change');
    },

    ForRemoveBindClientAlternativeColumnSales: function () {
        const clientFields = [
            "#ClientName",
            "#ClientAddress",
            "#ClientCountry",
            "#ClientPlaceOfSupply",
            "#ClientEmail",
            "#ClientMobileNumber",
            "#ClientGSTNumber",
            "#ClientStateId",
            "#ClientCity",
        ];

        const shippingFields = [
            "#ShippingName",
            "#ShippingAddress",
            "#ShippingCountry",
            "#ShippingPlaceOfSupply",
            "#ShippingEmail",
            "#ShippingMobileNumber",
            "#ShippingGSTNumber",
            "#ShippingStateId",
            "#ShippingCity",
        ];
        clientFields.forEach(function (fields) {
            $("#ClientColumn " + fields).text('');
        });

        shippingFields.forEach(function (fields) {
            $('#ShippingColumn ' + fields).text('');
        });

        /*=====ClientColumn=====*/
        $('#ClientColumn #ClientId').val('').trigger('change');
        $('#Check').prop('checked', false);

        /*=====ShippingColumn=====*/
        $('#TakeId').empty().append('<option value="">-- Select --</option>').trigger('change');
        $('#TakeId').prop('disabled', false);

        $('#ShipType').val('').trigger('change');
    },

    RestDataForPurchaseBilNo: function () {
        $('#discounttotal').val('');
        $('#GstTotal').val('');
        $('#CESSTotal').val('');
        $('#StateCESSTotal').val('');
        $('#Subtotal').val('');

        $('#Notes').val('');
        $('#TermsAndCondition').val('');
        $('#PaidFrom').val(null).trigger('change');
        $('#IsPartiallyPaid').prop('checked', false);
        $('#PaidFromDays').val(0);
        $('#PaidFromDueDate').val(null).trigger('change');
        $('#PaidFromDays').val('');
        $('#PaymenyTextBox').val('');
        $('#ModeOfPaymentId').val(null).trigger('change');
        $('#GrantTotal').val('');
        $('#roundOff').val('');
        $('#BalanceAmount').val('');
        $('#roundOff').css('color', '#495057');
        $('#BalanceAmount').css('color', '#495057');

        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();

        $('#AddNotes').hide();
        $('#AddTerms').hide();
        $('#AddAttachment').hide();
        $('#AddNotesLable').show();
        $('#AddTermsLable').show();
        $('#AddAttachLable').show();
        $('#dynamicBindRow').empty('');
        $('#appendContainer .input-group').slice(1).empty();

        $('#ShipType').val('').trigger('change');
        $('#ShipToLocation').prop('disabled', true);

        $("#VendorColumn #VendorName").text('');
        $("#VendorColumn #VendorAddress").text('');
        $("#VendorColumn #VendorCountry").text('');
        $("#VendorColumn #VendorCity").text('');
        $("#VendorColumn #StateIdGet").text('');
        $("#VendorColumn #VendorEmail").text('');
        $("#VendorColumn #VendorContactNumber").text('');
        $("#VendorColumn #VendorGSTNumber").text('');
        $("#VendorColumn #VendorStateName").text('');
    },

    EmailValidationOnInputVendor: function () {
        $(document).on('input', '#BillingAddressForm #StoreEmail', function () {
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
            } else if (inputValue.length > 0 && errorLabel.length === 0) {
                inputField.addClass('error');
                parentElement.append('<label class="error-message">Valid email address is required</label>');
                return false;
            }
            return true;
        });
    },

    EmailValidationOnInputClient: function () {
        $(document).on('input', '#FormClientAddress #ClientEmail', function () {
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
            } else if (inputValue.length > 0 && errorLabel.length === 0) {
                inputField.addClass('error');
                parentElement.append('<label class="error-message">Valid email address is required</label>');
                return false;
            }
            return true;
        });
    },

    EmailValidationOnInputAlterAddress: function () {
        $(document).on('input', '#FormAlternative #AlternativeEmail', function () {
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
            } else if (inputValue.length > 0 && errorLabel.length === 0) {
                inputField.addClass('error');
                parentElement.append('<label class="error-message">Valid email address is required</label>');
                return false;
            }
            return true;
        });
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

    ckeckforTakeIdValidtion: function () {
        var checkbox = $("#Check").prop('checked');
        if (checkbox) {
            $('#TakeId-error').hide();
            $('#TakeId').removeAttr('required');
        }
        else {
            $('#TakeId-error').show();
            $('#TakeId').attr('required', true);
        }
    },
};
