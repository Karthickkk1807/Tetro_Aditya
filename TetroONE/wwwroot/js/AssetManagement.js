var BranchMappingId = 0;
var assetId = 0;

var tagValue = "";
var bulkInsertData = [];
var BulkDynamic = false;
var disableManufacturerChangeEvent = false;

$(document).ready(function () {
    BranchMappingId = parseInt(localStorage.getItem('BranchId'));
    if (BranchMappingId != 0) {
        $('.bulk-dropdownrow').show();
    } else {
        $('.bulk-dropdownrow').hide();
    }
    /*-------------------- Validation For Inputs ---------------------------*/

    $('#ManufacturerId').each(function () {
        $(this).select2({
            dropdownParent: $(this).parent()
        });
    });

    /* -------------------- Validation For Inputs --------------------------- */

    //Common.ajaxCall("GET", "/Inventory/GetAsset", { BranchId: parseInt(BranchMappingId), AssetTypeId: parseInt(1), AssetId: null }, GetAssetSuccess, null);

    GetAssetSuccess();
    Common.bindDropDownParent('AssetTypeId', 'FormAssetInfo', 'AssetType');

    //Common.bindDropDownParent('AssetCategoryId', 'FormAssetInfo', 'AssetCategory');
    Common.bindDropDownParent('ManufacturerId', 'FormAssetInfo', 'Manufacturer');
    Common.bindDropDownParent('AssetMaintenanceFrequencyId', 'FormAssetInfo', 'AssetMaintenanceFrequency');
    Common.bindDropDownParent('AssetStatusId', 'FormAssetInfo', 'AssetStatus');
    Common.bindDropDownParent('VendorId', 'FormAcquisitionInfo', 'Vendor');
    Common.bindDropDownParent('AssetInsuranceCoverageId', 'FormAcquisitionInfo', 'AssetInsuranceCoverage');
    Common.bindDropDownParent('AssetTagTypeId', 'FormTagInfo', 'AssetTagType');
    Common.bindDropDownParent('BranchId', 'FormLocationInfo', 'BranchName_BulkInsert');
    //Common.bindDropDownParent('HallId', 'FormLocationInfo', 'HallName_BulkInsert');
    //Common.bindDropDownParent('DepartmentId', 'FormLocationInfo', 'DepartmentName_BulkInsert');
    //Common.bindDropDownParent('AssignedTo', 'FormLocationInfo', 'AssignedTo');
    Common.bindDropDownParent('PaymentTypeId', 'FormAssetInfo', 'PaymentTypeAsset');
    Common.bindDropDownParent('BillingTypeId', 'FormAssetInfo', 'BillingType');
    Common.bindDropDown('NoOfEMIId', 'NoOfEMI');
    Common.bindDropDown('BranchId', 'Plant');

    //automatically reflect Data AssetName
    $('#ModelNumber, #TagSerialNumber').on('input', updateAssetName);
    $('#AssetSubCategoryId, #ManufacturerId').on('change', updateAssetName);

    $('#FormLocationInfo #HallId').empty().append('<option value="">-- Select --</option>');
    $('#FormAssetInfo #AssetCategoryId').empty().append('<option value="">-- Select --</option>');
    $('#FormAssetInfo #AssetSubCategoryId').empty().append('<option value="">-- Select --</option>');

    $('#TagInfoHide').hide();
    $('#locationHide').hide();
    $('#HideRepairHistory').hide();
    $('#HideMappingHistory').hide();
    $('#BulkInsertAssetUpdate').hide();
    $('#DivAssetValueHide').hide();
    $('#DynamicBulkTable').empty();
    $('#ErroButtonBulk').hide();
    $('#SplitErroButtonBulk').hide();
    $('.imageAppend').append(`<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Please Select the TagType.</div>`);

    $('#multi-select').each(function () {
        $(this).select2({
            theme: 'bootstrap4',
            width: 'style',
            placeholder: $(this).attr('placeholder'),
            allowClear: Boolean($(this).data('allow-clear')),
        });
    });

    $('#PaymentTypeId').on('change', function () {
        var paymentType = $(this).val();

        if (paymentType === "2") {
            $('#EmiColumn').show();

        } else {
            $('#EmiColumn').hide();

        }
    });

    $(document).on('click', '#AddAsset', function () {
        $('#fadeinpage').addClass('fadeoverlay');
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#AssetCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#AssetCanvas").css("width", "50%");
        } else {
            $("#AssetCanvas").css("width", "39%");
        }
        $('#AssetHeader').text('Add Asset Details');
        $('#AssetNo').val('');


        $('#AssetCanvas .collapse').removeClass('show');
        $('#SaveAsset').text('Save').removeClass('btn-update').addClass('btn-success');
        $('#collapse1').addClass('show');
        $('#TagInfoHide').hide();
        $('#locationHide').hide();
        $('#HideRepairHistory').hide();
        $('#HideMappingHistory').hide();
        $('#DivAssetValueHide').hide();
        $('.imageAppend').empty();
        $('.imageAppend').append(`<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Please Select the TagType.</div>`);
        assetId = 0;
        tagValue = "";
        Common.removeMessage('FormAssetInfo');
        Common.removeMessage('FormAcquisitionInfo');
        Common.removeMessage('FormTagInfo');
        Common.removeMessage('FormLocationInfo');
        $('#FormAssetInfo #AssetCategoryId').empty().append('<option value="">-- Select --</option>');
        $('#FormAssetInfo #AssetSubCategoryId').empty().append('<option value="">-- Select --</option>');
        const today = new Date().toISOString().split('T')[0];
        $('#PODate').attr('max', today);
        $('#PurchaseDate').attr('max', today);
        $('#LastMaintenanceDate').attr('max', today);
        $('#NextMaintenanceDate').attr('min', today);
        $('#FormLocationInfo #HallId').empty().append('<option value="">-- Select --</option>');
        $('#LastBilledDatediv,#NextBillingDatediv,#Emifilesetdiv').hide();

        $("#ManufacturerId").val('').trigger('change');
        if (BranchMappingId != 0) {
           // $('#BranchId').val(null).trigger('change').prop('disabled', true);
            $('#BranchId').prop('disabled', false).val($('#BranchId option:eq(1)').val()).trigger('change');
        } else {
            $('#BranchId').prop('disabled', false).val($('#BranchId option:eq(1)').val()).trigger('change');
        }

    });

    $(document).on('click', '.btn-edit', function () {
        assetId = $(this).data('id');
        Common.removeMessage('FormAssetInfo');
        Common.removeMessage('FormAcquisitionInfo');
        Common.removeMessage('FormTagInfo');
        Common.removeMessage('FormLocationInfo');
        $("#ManufacturerId").val('').trigger('change');
        const today = new Date().toISOString().split('T')[0];
        $('#PODate').attr('max', today);
        $('#PurchaseDate').attr('max', today);
        $('#LastMaintenanceDate').attr('max', today);
        $('#LastMaintenanceDate').attr('max', today);
        $('#NextMaintenanceDate').attr('min', today);
        $('#FormLocationInfo #HallId').empty().append('<option value="">-- Select --</option>');
        $('#FormAssetInfo #AssetCategoryId').empty().append('<option value="">-- Select --</option>');
        $('#FormAssetInfo #AssetSubCategoryId').empty().append('<option value="">-- Select --</option>');
        $('#LastBilledDatediv,#NextBillingDatediv').show();

        Common.ajaxCall("GET", "/Inventory/GetAsset", { BranchId: parseInt(BranchMappingId), AssetTypeId: parseInt(1), AssetId: assetId }, GetAssetNotNullSuccess, null);
    });

    $(document).on('change', '#AssetTypeId', function () {
        var $thisval = $(this).val();

        if ($thisval == 1) {
            $("#WarrantyExpiryDate").attr("required", true);
            $("#asterisk").show();
            getAssetTypeValue(1, 'DepreciationValue');
        } else if ($thisval == 2) {
            $("#WarrantyExpiryDate").removeAttr("required");
            $("#asterisk").hide();
            getAssetTypeValue(2, 'DepreciationValue');
        }

        if ($thisval != "") {
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: '/Common/GetDropDownNotNull',
                data: JSON.stringify({ MasterInfoId: parseInt($thisval), ModuleName: "AssetInfo_Category" }),
                success: function (response) {
                    if (response.status) {
                        Common.bindParentDropDownSuccessForChosen(response.data, "AssetCategoryId", "FormAssetInfo");
                    }
                },
                error: function (response) {
                    console.error("Error fetching asset data", response);
                },
            });
        }
        else {
            $('#FormAssetInfo #AssetCategoryId').empty().append('<option value="">-- Select --</option>');
            $('#FormAssetInfo #AssetSubCategoryId').empty().append('<option value="">-- Select --</option>');
        }
    });

    $(document).on('change', '#AssetCategoryId', function () {
        var $thisval = $(this).val();
        if ($thisval != "") {

            Common.ajaxCall("Post", "/Common/GetDropDownNotNull", JSON.stringify({ MasterInfoId: parseInt($thisval), ModuleName: "AssetInfo_SubCategory" }), function (response) {
                if (response.status) {
                    Common.bindParentDropDownSuccessForChosen(response.data, "AssetSubCategoryId", "FormAssetInfo");
                }
            }, null);
        }
        else {
            $('#FormAssetInfo #AssetSubCategoryId').empty().append('<option value="">-- Select --</option>');
        }
    });

    $(document).on('click', '#CloseCanvas', function () {
        $("#AssetCanvas").css("width", "0");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    $(document).on('click', '#SaveAsset', function (e) {
        if ($('#AssetNo').val() == "") {
            Common.warningMsg("Please Fill in the OtherSetting Module Prefix Info for the Asset in this Branch.");
        }

        e.preventDefault();
        var isFormValid = validateFormAccordions('.accordion');

        var manufacturerVal = $('#ManufacturerId').val();

        // Remove any existing error message
        $('#ManufacturerId')
            .closest('.form-group')
            .find('.invalid-feedback')
            .remove();

        // If manufacturer is not selected, show the error
        if (!manufacturerVal) {
            $('<div class="invalid-feedback removeAfterVal">This field is required</div>')
                .insertAfter($('#ManufacturerId').next('.select2'));
        }

        if (isFormValid && $("#FormAssetInfo").valid() && $("#FormAcquisitionInfo").valid() && $("#FormTagInfo").valid() && $("#FormLocationInfo").valid()) {
            var DataUpdate1 = JSON.parse(JSON.stringify(jQuery('#FormAssetInfo').serializeArray()));
            var DataUpdate2 = JSON.parse(JSON.stringify(jQuery('#FormAcquisitionInfo').serializeArray()));
            var DataUpdate3 = JSON.parse(JSON.stringify(jQuery('#FormTagInfo').serializeArray()));
            var DataUpdate4 = JSON.parse(JSON.stringify(jQuery('#FormLocationInfo').serializeArray()));

            var DataUpdate = DataUpdate1.concat(DataUpdate2, DataUpdate3, DataUpdate4);

            var objvalue = {};
            $.each(DataUpdate, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.AssetId = parseInt(assetId) || null;
            objvalue.AssetNo = $('#AssetNo').val() || null;
            objvalue.AssetTypeId = Common.parseInputValue('AssetTypeId') || null;
            objvalue.AssetCategoryId = Common.parseInputValue('AssetCategoryId') || null;
            objvalue.AssetSubCategoryId = Common.parseInputValue('AssetSubCategoryId') || null;
            objvalue.AssetName = $('#AssetName').val();
            objvalue.TagSerialNumber = $('#TagSerialNumber').val();
            objvalue.ModelNumber = $('#ModelNumber').val();
            objvalue.ManufacturerId = Common.parseInputValue('ManufacturerId') || null;
            objvalue.LicenseKey = $('#LicenseKey').val() || null;
            objvalue.AssetMaintenanceFrequencyId = Common.parseInputValue('AssetMaintenanceFrequencyId') || null;
            objvalue.LastMaintenanceDate = Common.stringToDateTime('LastMaintenanceDate') || null;
            objvalue.NextMaintenanceDate = Common.stringToDateTime('NextMaintenanceDate') || null;
            objvalue.AssetStatusId = Common.parseInputValue('AssetStatusId') || null;
            objvalue.Description = $('#Description').val();
            objvalue.VendorId = Common.parseInputValue('VendorId') || null;
            objvalue.InVoiceNumber = $('#InVoiceNumber').val() || null;
            objvalue.PurchaseDate = Common.stringToDateTime('PurchaseDate') || null;
            objvalue.PurchaseValue = Common.parseFloatInputValue('PurchaseValue') || null;
            objvalue.AssetLifeSpan = $('#AssetLifeSpan').val() || null;
            objvalue.InsurancePolicyNo = $('#InsurancePolicyNo').val() || null;
            objvalue.InsuranceExpiryDate = Common.stringToDateTime('InsuranceExpiryDate') || null;
            objvalue.WarrantyStartDate = Common.stringToDateTime('WarrantyStartDate') || null;
            objvalue.WarrantyExpiryDate = Common.stringToDateTime('WarrantyExpiryDate') || null;

            objvalue.InsCoverageFromDate = Common.stringToDateTime('InsCoverageFromDate') || null;
            objvalue.BranchId = parseInt($('#BranchId').val()) || null;

            objvalue.BillingTypeId = Common.parseInputValue('BillingTypeId') || null;
            objvalue.PONumber = $('#PONumber').val() || null;
            objvalue.PODate = Common.stringToDateTime('PurchaseDate') || null;

            objvalue.LastBilledDate = Common.stringToDateTime('LastBilledDate') || null;
            objvalue.NextBillingDate = Common.stringToDateTime('ExpiredDate') || null;
            objvalue.PaymentType = parseInt($('#PaymentTypeId').val()) || null;
            objvalue.NoofEMI = parseInt($('#NoOfEMIId').val()) || null;

            Common.ajaxCall("POST", "/Inventory/InsertUpdateAsset", JSON.stringify(objvalue), InsertUpdateAssetSuccess, null);
        }
    });

    $(document).on('click', '.btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            assetId = $(this).data('id');
            Common.ajaxCall("GET", "/Inventory/DeleteAsset", { AssetId: assetId }, InsertUpdateAssetSuccess, null);
        }
    });

    $('#ManufacturerId').on('change', function () {
        if ($(this).val()) {

            $(this)
                .closest('.form-group')
                .find('.invalid-feedback')
                .remove();
        }
    });
    $(document).on('change', '.customLengthDropdown', function () {
        var $this = $(this);
        var tableSelector = $this.data('table');
        var pageLength = parseInt($this.val());

        if ($.fn.DataTable.isDataTable(tableSelector)) {
            $(tableSelector).DataTable().page.len(pageLength).draw();
        }
    });


    $('#AssetTagTypeId').change(function () {
        let selectedTag = $(this).val();
        tagValue = generateUniqueTag();


        $('.imageAppend').empty();

        if (selectedTag == "1") {
            generateBarcode(tagValue);
        } else if (selectedTag == "2") {
            generateQRCode(tagValue);
        } else if (selectedTag == "3") {
            generateRFIDTag(tagValue);
        }
        else {
            $('.imageAppend').empty();
            $('.imageAppend').append(`<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Please Select the TagType.</div>`);
        }
    });

    

    $('#InsuranceExpiryDate').on('change', function () {
        const insuranceDateStr = $(this).val();

        if (insuranceDateStr) {
            const insuranceDate = new Date(insuranceDateStr);


            const minWarrantyDate = new Date(insuranceDate);
            minWarrantyDate.setDate(minWarrantyDate.getDate() + 1);

            const minDateFormatted = minWarrantyDate.toISOString().split('T')[0];


            $('#WarrantyStartDate').attr('min', minDateFormatted);


            const warrantyDateStr = $('#WarrantyStartDate').val();
            if (warrantyDateStr) {
                const warrantyDate = new Date(warrantyDateStr);
                if (warrantyDate <= insuranceDate) {
                    $('#WarrantyStartDate').val('');
                    $('#WarrantyExpiryDate').val('');
                }
            }

        } else {
            $('#WarrantyStartDate').removeAttr('min');
            $('#WarrantyExpiryDate').removeAttr('min');
        }
    });

    $('#WarrantyStartDate').on('change', function () {
        const WarrantyDateStr = $(this).val();

        if (WarrantyDateStr) {
            const Warranty = new Date(WarrantyDateStr);

            // Set min = insuranceDate + 1 day
            const minWarrantyDate = new Date(Warranty);
            minWarrantyDate.setDate(minWarrantyDate.getDate() + 1);

            const minDateFormatted = minWarrantyDate.toISOString().split('T')[0];

            $('#WarrantyExpiryDate').attr('min', minDateFormatted);
            const warrantyDateStr = $('#WarrantyExpiryDate').val();
            if (warrantyDateStr) {
                const warrantyDate = new Date(warrantyDateStr);
                if (warrantyDate <= Warranty) {
                    $('#WarrantyExpiryDate').val('');
                }
            }

        } else {
            $('#WarrantyExpiryDate').removeAttr('min');
        }
    });

    $(document).on('change', '#FormLocationInfo #BranchId', function () {
        var $thisVal = $(this).val();
        if ($thisVal != "") {
            Common.ajaxCall("GET", "/Settings/GetHallDetails_BranchId", { BranchId: parseInt($thisVal) }, function (response) {
                if (response != null) {
                    Common.bindParentDropDownSuccessForChosen(response.data, "HallId", "FormLocationInfo");
                }
            }, null);
        }
        else {
            $('#FormLocationInfo #HallId').empty().append('<option value="">-- Select --</option>');
        }
    });

});
$(document).on('change', '#ManufacturerId', function () {
    if (disableManufacturerChangeEvent) return;
    var SubcategoryId = $('#AssetSubCategoryId').val();
    var ManufacturerId = $(this).val();
    Common.ajaxCall("GET", "/Inventory/GetAssetAutoGenerateNo", { AssetSubcategoryId: SubcategoryId, ManufacturerId: ManufacturerId }, function (response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            if (data[0][0].AssetNo != null) {
                $('#AssetNo').val(data[0][0].AssetNo);
            }

        }
    }, null);
});


function getAssetTypeValue(masterInfoId, moduleName) {
    var request = {
        MasterInfoId: masterInfoId,
        ModuleName: moduleName
    };

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Common/GetDropDownNotNull',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status === true && response.data.length > 0) {
                var data = JSON.parse(response.data);
                let assetTypeValue = data[0][0].AssetTypeValue;
                if (assetTypeValue !== null && assetTypeValue !== undefined) {
                    $('#DepreciationValue').val(parseFloat(assetTypeValue).toFixed(2));
                } else {
                    $('#DepreciationValue').val("");
                }
            } else {
                $('#DepreciationValue').val("");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching AssetTypeValue:", error);
        }
    });
}

//function GetAssetSuccess(response) {
//    if (response.status) {
//        var data = JSON.parse(response.data);
//        var CounterBox = Object.keys(data[0][0]);

//        $("#CounterTextBox1").text(CounterBox[0]);
//        $("#CounterTextBox2").text(CounterBox[1]);
//        $("#CounterTextBox3").text(CounterBox[2]);
//        $("#CounterTextBox4").text(CounterBox[3]);

//        $('#CounterValBox1').text(data[0][0][CounterBox[0]]);
//        $('#CounterValBox2').text(data[0][0][CounterBox[1]]);
//        $('#CounterValBox3').text(data[0][0][CounterBox[2]]);
//        $('#CounterValBox4').text(data[0][0][CounterBox[3]]);

//        var columns = Common.bindColumn(data[1], ['AssetId', 'Status_Color']);
//        Common.bindTable('AssetTable', data[1], columns, -1, 'AssetId', '330px', true, access);
//        $('#loader-pms').hide();
//    }
//}
function GetAssetSuccess() {
    // ---- Hardcoded Counter Box Values ----
    var counters = [
        { id: "#CounterTextBox1", label: "Total", valueId: "#CounterValBox1", value: 219 },
        { id: "#CounterTextBox2", label: "Total Category", valueId: "#CounterValBox2", value: "5 / 23" },
        { id: "#CounterTextBox3", label: "Mapped", valueId: "#CounterValBox3", value: 21 },
        { id: "#CounterTextBox4", label: "Not-Mapped", valueId: "#CounterValBox4", value: 198 }
    ];

    counters.forEach(c => {
        $(c.id).text(c.label);
        $(c.valueId).text(c.value);
    });

    // ---- Hardcoded Asset Table Data (4 rows) ----
    var hardcodedData = [
        {
            PlantName: "Ganapathy",
            AssetNo: "IGS-GRC-HP-0019",
            AssetName: "HP_Graphics Card_ERRTRT_AAAAAA",
            Category: "Computer & Peripherals",
            SubCategory: "Graphics Card",
            Manufacturer: "HP",
            ModelNumber: "ERRTRT",
            TagSerialNumber: "AAAAAA",
            AssetValue: "2300",
            Hall: "",
            DeskNo: "",
            PurchaseDate: "22-10-2025",
            LifeSpan: "",
            WarrantyExpiryDate: "06-11-2025",
            LastMaintenanceDate: "",
            NextMaintenanceDate: "",
            InsuranceStatus: "Not Available",
            Status: "In Store",
            Status_Color: "orange"
        },
        {
            PlantName: "Chennai",
            AssetNo: "IGS-RTR-MI-0004",
            AssetName: "Router_Router456",
            Category: "Network Equipments",
            SubCategory: "Router",
            Manufacturer: "MI",
            ModelNumber: "SFGSFG",
            TagSerialNumber: "Router456",
            AssetValue: "0",
            Hall: "",
            DeskNo: "",
            PurchaseDate: "17-10-2025",
            LifeSpan: "",
            WarrantyExpiryDate: "07-11-2025",
            LastMaintenanceDate: "",
            NextMaintenanceDate: "",
            InsuranceStatus: "Not Available",
            Status: "In Store",
            Status_Color: "orange"
        },
        {
            PlantName: "Chennai",
            AssetNo: "IGS-RTR-MI-0003",
            AssetName: "Router_Router123",
            Category: "Network Equipments",
            SubCategory: "Router",
            Manufacturer: "MI",
            ModelNumber: "SFGSFG",
            TagSerialNumber: "Router123",
            AssetValue: "0",
            Hall: "",
            DeskNo: "",
            PurchaseDate: "17-10-2025",
            LifeSpan: "",
            WarrantyExpiryDate: "07-11-2025",
            LastMaintenanceDate: "",
            NextMaintenanceDate: "",
            InsuranceStatus: "Not Available",
            Status: "In Store",
            Status_Color: "orange"
        },
        {
            PlantName: "Chennai",
            AssetNo: "IGS-PRI-ADO-0002",
            AssetName: "Printers_Printers456",
            Category: "Computer & Peripherals",
            SubCategory: "Printers",
            Manufacturer: "ADOBE",
            ModelNumber: "SFGSFG",
            TagSerialNumber: "Printers456",
            AssetValue: "0",
            Hall: "",
            DeskNo: "",
            PurchaseDate: "17-10-2025",
            LifeSpan: "",
            WarrantyExpiryDate: "30-10-2025",
            LastMaintenanceDate: "",
            NextMaintenanceDate: "",
            InsuranceStatus: "Not Available",
            Status: "In Store",
            Status_Color: "orange"
        }
    ];

    // ---- Table Columns ----
    var columns = [
        { data: "PlantName", title: "Plant Name" },
        { data: "AssetNo", title: "Asset No" },
        { data: "AssetName", title: "Asset Name" },
        { data: "Category", title: "Category" },
        { data: "SubCategory", title: "Sub Category" },
        { data: "Manufacturer", title: "Manufacturer" },
        { data: "ModelNumber", title: "Model Number" },
        { data: "TagSerialNumber", title: "Tag / Serial Number" },
        { data: "AssetValue", title: "Asset Value" },
        { data: "Hall", title: "Hall" },
        { data: "DeskNo", title: "Desk No" },
        { data: "PurchaseDate", title: "Purchase Date" },
        { data: "LifeSpan", title: "Life Span" },
        { data: "WarrantyExpiryDate", title: "Warranty Expiry Date" },
        { data: "LastMaintenanceDate", title: "Last Maintenance Date" },
        { data: "NextMaintenanceDate", title: "Next Maintenance Date" },
        { data: "InsuranceStatus", title: "Insurance Status" },
        { data: "Status", title: "Status" }
    ];

    // ---- Bind Hardcoded Table ----
    Common.bindTable('AssetTable', hardcodedData, columns, -1, 'AssetNo', '330px', true, {
        update: true,
        delete: true
    });

    $('#loader-pms').hide();
}


function GetAssetNotNullSuccess(response) {
    if (response.status) {
        disableManufacturerChangeEvent = true;
        $('#fadeinpage').addClass('fadeoverlay');
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#AssetCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#AssetCanvas").css("width", "50%");
        } else {
            $("#AssetCanvas").css("width", "39%");
        }

        $('#AssetHeader').text('Edit Asset Details');
        $('#TagInfoHide').show();
        //$('#locationHide').show();
        $('#HideRepairHistory').show();
        $('#HideMappingHistory').show();
        $('#DivAssetValueHide').show();

        $('#AssetCanvas .collapse').removeClass('show');
        $('#SaveAsset').text('Update').removeClass('btn-success').addClass('btn-update');
        $('#collapse1').addClass('show');
        $('.imageAppend').empty();
        Common.removeMessage('FormAssetInfo');
        Common.removeMessage('FormAcquisitionInfo');
        Common.removeMessage('FormTagInfo');
        Common.removeMessage('FormLocationInfo');
        $("#ManufacturerId").val('').trigger('change');

        var data = JSON.parse(response.data);
        $('#BillingTypeId').val(data[0][0].BillingTypeId);
        $('#AssetStatusId').val(data[0][0].AssetStatusId);

        $('#AssetNo').val(data[0][0].AssetNo);
        if (BranchMappingId != 0) {
            $('#BranchId').val(data[0][0].BranchId).trigger('change').prop('disabled', true);
        } else {
            $('#BranchId').val(data[0][0].BranchId).trigger('change').prop('disabled', false);
        }

        $('#PaymentTypeId').val(data[0][0].PaymentType).trigger('change');
        $('#NoOfEMIId').val(data[0][0].NoofEMI).trigger('change');

        $('#LastBilledDate').val(data[0][0].LastBilledDate).trigger('change');
        $('#NextBillingDate').val(data[0][0].NextBillingDate).trigger('change');
        $('#InVoiceNumber').val(data[0][0].InVoiceNumber);
        $('#PurchaseDate').val(data[0][0].PurchaseDate).trigger('change');
        $('#PurchaseValue').val(data[0][0].PurchaseValue);
        $('#InsCoverageFromDate').val(data[0][0].InsCoverageFromDate).trigger('change');
        $('#WarrantyStartDate').val(data[0][0].WarrantyStartDate).trigger('change');




        Common.bindDataAsset(data[0]);



        if (data[0][0].PODate != null) {
            var parts1 = data[0][0].PODate.split('-');
            var formattedDate1 = parts1[2] + '-' + parts1[1] + '-' + parts1[0];
            $('#PODate').attr('max', formattedDate1);
        }

        if (data[0][0].PurchaseDate != null) {
            var parts2 = data[0][0].PurchaseDate.split('-');
            var formattedDate2 = parts2[2] + '-' + parts2[1] + '-' + parts2[0];
            $('#PurchaseDate').attr('max', formattedDate2);
        }

        if (data[0][0].LastMaintenanceDate != null) {
            var parts3 = data[0][0].LastMaintenanceDate.split('-');
            var formattedDate3 = parts3[2] + '-' + parts3[1] + '-' + parts3[0];
            $('#LastMaintenanceDate').attr('max', formattedDate3);
        }

        if (data[0][0].NextMaintenanceDate != null) {
            var parts4 = data[0][0].NextMaintenanceDate.split('-');
            var formattedDate4 = parts4[2] + '-' + parts4[1] + '-' + parts4[0];
            $('#NextMaintenanceDate').attr('min', formattedDate4);
        }

        $('#ManufacturerId').val(data[0][0].ManufacturerId).trigger('change');
        $('#VendorId').val(data[0][0].VendorId);

        $('.imageAppend').empty();

        tagValue = data[0][0].TagTypeCode;
        var HeadQrCode = data[0][0].Header;
        var FirstLineQrCode = data[0][0].Firstline;
        var SecondLineQrCode = data[0][0].Secondline;

        if (tagValue) {
            $('#AssetTagTypeId').val('2');
            generateQRCode(tagValue, HeadQrCode, FirstLineQrCode, SecondLineQrCode);
        } else {
            $('#AssetTagTypeId').val('');
            $('.imageAppend').empty().append(`
        <div>
            <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
            Please Select the TagType.
        </div>
    `);
        }


        if (data[0][0].PaymentType == 2) {
            $('#NextBillingList').empty();

            let innerContent = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; font-weight: bold; text-align: center; margin-bottom: 8px;">
    <div>Date</div>
        <div>Amount</div>
        
    </div>
`;

            let billingData = data[3];

            billingData.forEach((item, index) => {
                const isLast = index === billingData.length - 1;

                innerContent += `
        <div style="display: grid; grid-template-columns: 1fr 1fr; text-align: center; padding: 2px 0;">
            
            <div>${item.Date}</div>
            <div>${item.Amount}</div>
        </div>
    `;

                if (!isLast) {
                    innerContent += `
            <div style="display: grid; grid-template-columns: 1fr 1fr; text-align: center; color: green;">
                <div>&#8595;</div>
                <div>&#8595;</div>
            </div>
        `;
                }
            });


            let html = `
    <fieldset style="border: 1px solid #ccc; padding: 10px; border-radius: 4px;">
        <legend style="font-size: 14px; font-weight: 600; width: auto; padding: 0 10px;">EMI Payemnt History</legend>
        ${innerContent}
    </fieldset>
`;

            $('#NextBillingList').html(html);
            $('#Emifilesetdiv').show();
        } else {

            $('#Emifilesetdiv').hide();
        }

        Common.ajaxCall("Post", "/Common/GetDropDownNotNull", JSON.stringify({ MasterInfoId: parseInt(data[0][0].AssetTypeId), ModuleName: "AssetInfo_Category" }), function (response) {
            if (response.status) {
                Common.bindParentDropDownSuccessForChosen(response.data, "AssetCategoryId", "FormAssetInfo");
                $('#AssetCategoryId').val(data[0][0].AssetCategoryId);
                Common.ajaxCall("Post", "/Common/GetDropDownNotNull", JSON.stringify({ MasterInfoId: parseInt(data[0][0].AssetCategoryId), ModuleName: "AssetInfo_SubCategory" }), function (response) {
                    if (response.status) {
                        Common.bindParentDropDownSuccessForChosen(response.data, "AssetSubCategoryId", "FormAssetInfo");
                        $('#AssetSubCategoryId').val(data[0][0].AssetSubCategoryId);

                        Common.ajaxCall("GET", "/Settings/GetHallDetails_BranchId", { BranchId: parseInt(data[0][0].BranchId) }, function (response) {
                            if (response != null) {
                                Common.bindParentDropDownSuccessForChosen(response.data, "HallId", "FormLocationInfo");
                                $('#FormLocationInfo #HallId').val(data[0][0].HallId);
                            }
                        }, null);

                        $('#RepairHistoryInfo').empty('');
                        var html =
                            `
                                <div class="table-responsive">
                                    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="RepairHistorytable"></table>
                                </div>
                             `;
                        $('#RepairHistoryInfo').append(html);

                        var columns = Common.bindColumn(data[2], ['']);
                        bindTableMappingHistoryAndAssociatedAssetInfo('RepairHistorytable', data[2], columns, -1, 'Date', '151px', true);

                        $('#MappingHistoryInfo').empty('');
                        var html =
                            `
                               <div class="table-responsive">
                                   <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="MappingHistorytable"></table>
                               </div>
                            `;
                        $('#MappingHistoryInfo').append(html);

                        var columns = Common.bindColumn(data[1], ['']);
                        bindTableMappingHistoryAndAssociatedAssetInfo('MappingHistorytable', data[1], columns, -1, 'Date', '151px', false);
                    }
                }, null);
            }
        }, null);

        $('#AssetName').val(data[0][0].AssetName);

        disableManufacturerChangeEvent = false;

    }
}
function generateQRCode(tagValue, header = "", firstLine = "", secondLine = "") {
    $('.imageAppend').empty();

    // Create main container
    let container = $(`
        <div style="border:1px solid #ccc; padding:5px; width:300px; font-family: Arial, sans-serif; position: relative;">
            <div style="text-align:center; font-weight:bold; margin-bottom:3px;">${header}</div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                <div style="font-weight: bold;">Asset Id</div>
                    <div style="margin-bottom:2px;">${firstLine}</div>
                    <div style="font-weight: bold;">Expiry Date</div>
                    <div>${secondLine}</div>
                </div>
                <div id="qrcode" style="width:77px; height:60px;margin-top: 15px;"></div>
            </div>
        </div>
    `);

    $('.imageAppend').append(container);

    new QRCode(document.getElementById("qrcode"), {
        text: tagValue,
        width: 60,
        height: 60
    });
}

function InsertUpdateAssetSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#AssetCanvas").css("width", "0");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.removevalidation('FormAssetInfo');
        Common.removevalidation('FormAcquisitionInfo');
        Common.removevalidation('FormTagInfo');
        Common.removevalidation('FormLocationInfo');
       
        $('.this').addClass('active');
        $('#AssetDynamic').empty('');
        var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                           <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="AssetTable"></table>
                        </div>
                     </div>
                     `;
        $('#AssetDynamic').append(html);
        Common.ajaxCall("GET", "/Inventory/GetAsset", { BranchId: parseInt(BranchMappingId), AssetTypeId: parseInt(1), AssetId: null }, GetAssetSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}
function generateUniqueTag() {
    return 'TAG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}


function generateBarcode(tagValue) {
    let barcodeSvg = $('<svg id="barcode"></svg>');
    $('.imageAppend').append(`<p style="margin-right: 10px;">${tagValue}</p>`, barcodeSvg);

    JsBarcode("#barcode", tagValue, {
        format: "CODE128",
        lineColor: "#0aa",
        width: 2,
        height: 50,
        displayValue: true
    });
}

function generateRFIDTag(tagValue) {
    $('.imageAppend').append(`<p>${tagValue}</p>`);
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
            var errorMessage = input.data('error-message') || errorMessageDefault;

            if (!input.val().trim()) {
                input.addClass('is-invalid error');
                if (!input.next('.invalid-feedback').length) {
                    input.after('<div class="invalid-feedback">' + errorMessage + '</div>');
                }
                isCurrentValid = false;
                isFormValid = false;
                if (!firstInvalidAccordion) {
                    firstInvalidAccordion = currentAccordion;
                }
            } else {
                input.removeClass('is-invalid error');
                input.next('.invalid-feedback').remove();
            }
        });

        if (isCurrentValid) {
            currentAccordion.find('.collapse').collapse('hide');
        }
    });

    if (firstInvalidAccordion) {
        firstInvalidAccordion.find('.collapse').collapse('show');
    }

    return isFormValid;
}

/*===================================================BulkInsertAndDownload===========================================================*/

$('.bulk-dropdown').on('click', function () {
    $(this).next('.dropdown-menu').toggleClass('show');
    $('#Uploadbody').addClass('d-flex').removeClass('d-none');
    $('#ErroButtonBulk').hide();
    $('#SplitErroButtonBulk').hide();
});

$(document).on('click', function (e) {
    if (!$(e.target).closest('.bulk-grpdrop').length) {
        $('.dropdown-menu').removeClass('show');
        $('.dropdown-item').removeClass('active');
    }
});

let bulkAsset = [];

$(document).on('change', '#AssetBulkdataInsertButton', function (event) {
    debugger;
    $("#error-message").hide();
    $('#AssetBulkTable tbody tr').remove();
    bulkAsset = [];

    var file = event.target.files[0];
    if (file) {

        $('#SelectedFileName').text(`Selected file: ${file.name}`);
        var fileName = file.name.split('.')[0];
        var fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'xls' || fileExtension === 'xlsx') {
            if (fileName === 'AssetInfoDetails') {

                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = new Uint8Array(e.target.result);
                    var workbook = XLSX.read(data, { type: 'array' });


                    var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    var excelRows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                    if (excelRows.length > 1) {
                        for (var i = 1; i < excelRows.length; i++) {
                            var row = excelRows[i];
                            if (row[0] !== undefined && row[0] !== null && row[0].trim() !== '') {


                                var excelToJsDate = function (serial) {
                                    if (serial) {
                                        return new Date((serial - 25569) * 86400 * 1000);
                                    }
                                    return '';
                                }
                                var LastMaintenanceDate = excelToJsDate(row[9]) || null;
                                var NextMaintenanceDate = excelToJsDate(row[10]) || null;
                                var PODate = excelToJsDate(row[20]) || null;
                                var PurchaseDate = excelToJsDate(row[22]) || null;
                                var InsCoverageFromDate = excelToJsDate(row[26]) || null;
                                var InsuranceExpiryDate = excelToJsDate(row[27]) || null;
                                var WarrantyStartDate = excelToJsDate(row[28]) || null;
                                var WarrantyExpiryDate = excelToJsDate(row[29]) || null;
                                var LastBilledDate = excelToJsDate(row[12]) || null;
                                var NextBillingDate = excelToJsDate(row[13]) || null;

                                LastMaintenanceDate = LastMaintenanceDate ? LastMaintenanceDate.toISOString().split('T')[0] : null;
                                NextMaintenanceDate = NextMaintenanceDate ? NextMaintenanceDate.toISOString().split('T')[0] : null;
                                PODate = PODate ? PODate.toISOString().split('T')[0] : null;
                                PurchaseDate = PurchaseDate ? PurchaseDate.toISOString().split('T')[0] : null;
                                InsCoverageFromDate = InsCoverageFromDate ? InsCoverageFromDate.toISOString().split('T')[0] : null;
                                InsuranceExpiryDate = InsuranceExpiryDate ? InsuranceExpiryDate.toISOString().split('T')[0] : null;
                                WarrantyStartDate = WarrantyStartDate ? WarrantyStartDate.toISOString().split('T')[0] : null;
                                WarrantyExpiryDate = WarrantyExpiryDate ? WarrantyExpiryDate.toISOString().split('T')[0] : null;
                                LastBilledDate = LastBilledDate ? LastBilledDate.toISOString().split('T')[0] : null;
                                NextBillingDate = NextBillingDate ? NextBillingDate.toISOString().split('T')[0] : null;

                                bulkAsset.push({
                                    AssetType: row[0] !== undefined ? String(row[0]) : null,
                                    AssetCategory: row[1] !== undefined ? String(row[1]) : null,
                                    AssetSubCategory: row[2] !== undefined ? String(row[2]) : null,
                                    Manufacturer: row[3] !== undefined ? String(row[3]) : null,
                                    ModelNumber: row[4] !== undefined ? String(row[4]) : null,
                                    TagSerialNumber: row[5] !== undefined ? String(row[5]) : null,
                                    AssetName: row[6] !== undefined ? String(row[6]) : null,
                                    LicenseKey: row[7] !== undefined ? String(row[7]) : null,
                                    AssetMaintenanceFrequency: row[8] !== undefined ? String(row[8]) : null,
                                    LastMaintenanceDate: LastMaintenanceDate,
                                    NextMaintenanceDate: NextMaintenanceDate,
                                    BillingType: row[11] !== undefined ? String(row[11]) : null,
                                    LastBilledDate: LastBilledDate,
                                    NextBillingDate: NextBillingDate,
                                    /*TaxInfo: row[14] !== undefined ? String(row[14]) : null,*/
                                    PaymentType: row[14] !== undefined ? String(row[14]) : null,
                                    NoofEMI: row[15] !== undefined ? String(row[15]) : null,
                                    Status: row[16] !== undefined ? String(row[16]) : null,
                                    Description: row[17] !== undefined ? String(row[17]) : null,
                                    Vendor: row[18] !== undefined ? String(row[18]) : null,
                                    PONumber: row[19] !== undefined ? String(row[19]) : null,
                                    PODate: PODate,
                                    InVoiceNumber: row[21] !== undefined ? String(row[21]) : null,
                                    PurchaseDate: PurchaseDate,
                                    PurchaseValue: row[23] !== undefined ? parseFloat(row[23]) : null,
                                    AssetLifeSpan: row[24] !== undefined ? String(row[24]) : null,
                                    InsurancePolicyNo: row[25] !== undefined ? String(row[25]) : null,
                                    InsCoverageFromDate: InsCoverageFromDate,
                                    InsuranceExpiryDate: InsuranceExpiryDate,
                                    WarrantyStartDate: WarrantyStartDate,
                                    WarrantyExpiryDate: WarrantyExpiryDate,
                                });
                            }
                        }
                    }

                    var request = {
                        IsInsert: false,
                        Clear: null,
                        BranchId: parseInt(BranchMappingId),
                        TVP_AssetDetails: bulkAsset,
                    };

                    $('#loader-pms').show();
                    Common.ajaxCall("POST", "/AssetInfo/InsertBulkAsset", JSON.stringify(request), bulkSuccess, null);
                };

                reader.readAsArrayBuffer(file);
            } else {
                Common.errorMsg("Choose the correct file.");
            }
        } else {
            alert('Please select a valid Excel file (.xls or .xlsx)');
            event.target.value = '';
            $('#AssetBulkdataInsertButton').val('');
        }
    }
});

function bulkSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        bulkInsertData = formatDateFieldsInBulkData(data[0]);
        $('#DynamicBulkTable').empty('');
        var html = `<div class="col-sm-12 p-0">
                        <div class="table-responsive">
                           <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="AssetBulkTable"></table>
                        </div>
                     </div>`;
        $('#DynamicBulkTable').append(html);
        var columns = Common.bindColumn(data[0], ['AssetStatus']);
        bindBulkTable('AssetBulkTable', data[0], columns, '135px');
        $('#excelFileUpload').val('');
        $('#bulkModal_info').modal('show');
        $('#loader-pms').hide();
    }
    else {
        Common.errorMsg(response.message);
        $('#excelFileUpload').val('');
    }
}

$('#DownloadSampleAssetBtn').click(function () {
    $('#loader-pms').show();
    var storeId = parseInt($("#StoreBinfLog").val());

    $.ajax({
        url: '/AssetInfo/DownloadExcel',
        type: 'GET',
        contentType: 'application/json',
        data: null,
        xhrFields: {
            responseType: 'blob'
        },
        success: function (response, status, xhr) {
            setTimeout(function () {
                $('#loader-pms').hide();
            }, 500);
            var filename;
            var disposition = xhr.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]=((['"]).?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].split("''").pop();
                }
            }
            var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename || 'file.xlsx';
            link.click();
        },
        error: function (xhr, status, error) {
            console.error('Error downloading file:', status, error);
            setTimeout(function () {
                $('#loader-pms').hide();
            }, 500);

        }
    });
});

$(document).on('click', '#AssetchooseFileButton', function () {
    $('#AssetBulkdataInsertButton').trigger('click');
});

$('#BulkInsertAssetUpdate').click(function () {
    if (BulkDynamic) {
        var request = {
            TVP_AssetDetails: bulkInsertData,
            Clear: null,
            BranchId: parseInt(BranchMappingId),
            IsInsert: true
        };
        Common.ajaxCall("POST", "/AssetInfo/InsertBulkAsset", JSON.stringify(request), bulkSuccessReload, null);
    }
    else {
        /* Common.warningMsg();*/
    }
});

$(document).on('click', '#BulkUploadBtn', function () {
    $("#NoFileImage").show();
    $("#DynamicBulkTable tbody tr").remove();
    $('#AssetBulkdataInsertButton').val('');
    $('#SelectedFileName').text('');
    $('#BulkAssetInsertForm').modal('show');
    $('#BulkInsertAssetUpdate').hide();
    $('#DynamicBulkTable').empty();
    $('#loader-pms').hide();
    $('#BulkInsertErrorText').text('');
    $('#BulkUploadDuplicateValueError').hide();
});

$(document).on('click', '#BulkInsertAssetCloseBtn,#BulkInsertAssetCancel', function () {
    $('#BulkAssetInsertForm').modal('hide');
    $("#error-message").hide();
    $('#loader-pms').hide();
    $('#BulkInsertErrorText').text('');
    $('#BulkUploadDuplicateValueError').hide();
    $('#Uploadbody').removeClass('d-none').addClass('d-flex');
});

$(document).on('click', '#SplitErroButtonBulkId', function () {

    var request = {
        IsInsert: false,
        Clear: 1,
        BranchId: parseInt(BranchMappingId),
        TVP_AssetDetails: bulkAsset,
    };

    $('#loader-pms').show();
    Common.ajaxCall("POST", "/AssetInfo/InsertBulkAsset", JSON.stringify(request), bulkSuccess, null);

    $("#ErroButtonBulk").show();
    $("#SplitErroButtonBulk").hide();
});

$(document).on('click', '#ErroButtonBulkId', function () {
    $("#ErroButtonBulk").hide();

    var request = {
        IsInsert: false,
        Clear: 0,
        BranchId: parseInt(BranchMappingId),
        TVP_AssetDetails: bulkAsset,
    };

    $('#loader-pms').show();
    Common.ajaxCall("POST", "/AssetInfo/InsertBulkAsset", JSON.stringify(request), bulkSuccess, null);
});

function bulkSuccessReload(response) {
    if (response) {
        Common.successMsg(response.message);
        $('#BulkAssetInsertForm').modal('hide');
        $('#loader-pms').hide();
        var StoreId = parseInt($("#UserBranchMappingId").val());
        Common.ajaxCall("GET", "/Inventory/GetAsset", { BranchId: parseInt(BranchMappingId), AssetTypeId: parseInt(1), AssetId: null }, GetAssetSuccess, null);
    }
}

function bindBulkTable(tableid, data, columns, scrollpx) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "tetropaynocount");
    var istetropaynocount = data[0].hasOwnProperty('tetropaynocount');
    var assetstatusNameColumnIndex = columns.findIndex(col => col.data === 'TagSerialNumber');

    var renderColumn = [
        {
            "targets": assetstatusNameColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    var color = '';
                    if (row.AssetStatus === null) {
                        color = 'color: #ff0017;';
                        BulkDynamic = false;
                    }
                    else if (row.AssetStatus.toLowerCase() === 'red') {
                        color = 'color: #ff0017;';
                        BulkDynamic = false;
                    }
                    else if (row.AssetStatus.toLowerCase() === 'green') {
                        color = 'color: #87e026;';
                        BulkDynamic = true;
                    }
                    return `<div style="${color}">${data || ''}</div>`;
                }
                return data;
            }
        },
    ];

    var FlagOfHaveRed = false;
    let invalidFields = [];

    data.forEach(item => {

        if (item.AssetStatus && item.AssetStatus.toLowerCase() !== 'green') {
            invalidFields.push('TagSerialNumber');
            FlagOfHaveRed = true;
        }

        if (invalidFields.length === 0) {
            bulkInsertData = data;
        }
    });

    if (FlagOfHaveRed) {
        if ($('#ErroButtonBulk').is(':visible')) {
            $('#SplitErroButtonBulk').hide();
        }
        else {
            $('#SplitErroButtonBulk').show();
        }
        $('#Uploadbody').addClass('d-none').removeClass('d-flex');
        $('#BulkInsertAssetUpdate').hide();
        $('#BulkUploadDuplicateValueError').show();

        $('#BulkInsertErrorText').text('Check the mentioned (Red) record for issues with: TagSerialNumber.');
    } else {
        if ($('#ErroButtonBulk').is(':visible')) {
            $('#SplitErroButtonBulk').hide();
        }
        else {
            $('#SplitErroButtonBulk').show();
        }
        $('#Uploadbody').addClass('d-none').removeClass('d-flex');
        $('#BulkInsertAssetUpdate').show();
        $('#SplitErroButtonBulk').hide();
        $('#BulkInsertErrorText').text('');
    }

    var dataTableOptions = {
        "dom": "Blfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !istetropaynocount ? data : [],
        "columns": columns,
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "scrollX": true,
        "scroller": true,
        "scrollCollapse": true,
        "aaSorting": [],
        "language": {
            "emptyTable": '<div><img  src="/tetropay/assets/img/norecord.svg" style="margin-right: 10px;">No records found</div>'
        },
        "searching": false,
        "paging": true,
        "oSearch": { "bSmart": false, "bRegex": true },
        "info": true,
        "pageLength": 7,
        "lengthMenu": [7, 14, 28, 50],
        "columnDefs": renderColumn,

    };

    $('#' + tableid).DataTable(dataTableOptions);
    var famtable = $('#' + tableid).DataTable();
    Common.autoAdjustColumns(famtable);
    $('#backdrop').fadeOut();
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    var parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}

function formatDateFieldsInBulkData(dataArray) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    return dataArray.map(item => {
        for (let key in item) {
            if (item.hasOwnProperty(key) && typeof item[key] === 'string' && dateRegex.test(item[key])) {
                item[key] = formatDate(item[key]);
            }
        }
        return item;
    });
}
/*===================================================BulkInsertAndDownload===========================================================*/

function validateDepreciationValue(input) {
    let value = input.value;


    value = value.replace(/[^0-9.]/g, '');

    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts[1];
    }

    if (parts.length === 2) {
        parts[1] = parts[1].slice(0, 2);
        value = parts[0] + '.' + parts[1];
    }

    let numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
        if (numericValue > 99.99) {
            value = '100';
        }
    }

    input.value = value;
}

function updateAssetName() {
    var modelNumber = $('#ModelNumber').val().trim();
    var tagSerial = $('#TagSerialNumber').val().trim();
    var subCategory = $('#AssetSubCategoryId option:selected').text().trim();
    var manufacturer = $('#ManufacturerId option:selected').text().trim();

    subCategory = (subCategory === "--Select--") ? "" : subCategory;
    manufacturer = (manufacturer === "--Select--") ? "" : manufacturer;

    var parts = [];

    if (manufacturer !== "") parts.push(manufacturer);
    if (subCategory !== "") parts.push(subCategory);
    if (modelNumber !== "") parts.push(modelNumber);
    if (tagSerial !== "") parts.push(tagSerial);

    var combined = parts.join('_');

    $('#AssetName').val(combined);
}

/*=============================================Table For MappingHistory And AssociatedAssetInfo===========================================*/

function bindTableMappingHistoryAndAssociatedAssetInfo(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "AssetManagementnocount");

    var isbuyernocount = data[0].hasOwnProperty('AssetManagementnocount');

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
        "data": !isbuyernocount ? data : [],
        "columns": columns,
        "destroy": true,
        "scrollY": scrollpx,
        "sScrollX": "100%",
        "aaSorting": [],
        "scrollCollapse": true,
        "oSearch": { "bSmart": false, "bRegex": true },
        "info": false,
        "paging": false,
        "pageLength": 8,
        "lengthMenu": [7, 14, 50],
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "columnDefs": [],
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });
    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}