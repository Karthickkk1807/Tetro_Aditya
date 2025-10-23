var titleForHeaderMoveNonTab = "";
var assetManagementId = 0;
var formDataMultiple = new FormData();
var deletedFiles = [];
var existFiles = [];
var FranchiseMappingId = 0;

$(document).ready(function () {
    FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    Common.bindDropDownParent('DepartmentId', 'AssetNonInfoForm', 'Department');
    Common.bindDropDownParent('FranchiseId', 'AssetNonInfoForm', 'Franchise');
    Common.bindDropDownParent('NonMoveableAssetTypeId', 'AssetNonInfoForm', 'MachineType');
    Common.bindDropDownParent('CompanyAssetTypeId', 'AssetNonInfoForm', 'MovableAssetType');

    $('.datapiker').hide();

    var EditData = { FranchiseId: parseInt(FranchiseMappingId), AssetManagementId: null, TypeId: parseInt(1), ClientId: null, Type: null };
    Common.ajaxCall("GET", "/Inventory/GetAssetManagementDetails", EditData, AssetManagementSuccess, null);

    $(document).on('input', '#DepreciationPercentage', function () {
        var $thisVal = $(this).val();
        var $AmountVal = $('#Amount').val();
        var $PurchaseDateVal = $('#PurchaseDate').val() || null;
        if ($thisVal) {
            //Common.ajaxCall("GET", "/Inventory/GetDepreciationValueDetails_AssetManagement", { PurchaseDate: Common.stringToDateTimeSendTimeAlso('PurchaseDate'), Amount: $AmountVal, DepreciationPercentage: parseFloat($thisVal) }, function (response) {
            Common.ajaxCall("GET", "/Inventory/GetDepreciationValueDetails_AssetManagement", { PurchaseDate: $PurchaseDateVal, Amount: $AmountVal, DepreciationPercentage: parseFloat($thisVal) }, function (response) {
                if (response.status) {
                    var data = JSON.parse(response.data);
                    $('#DepreciationValue').val(data[0][0].DepreciationValue)
                }
            }, null);
        }
    });

    var today = new Date().toISOString().split('T')[0];
    //$('#PurchaseDate').attr('max', today);
    //$('#PurchaseDate').on('change', function () {
    //    var purchaseDate = $(this).val();
    //    if (purchaseDate) {
    //        $('#NextServiceDate').attr('min', purchaseDate);
    //    } else {
    //        $('#NextServiceDate').removeAttr('min');
    //    }
    //});

    $(document).on('click', '#AddAssetManagement', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#AssetCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#AssetCanvas").css("width", "50%");
        } else {
            $("#AssetCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');

        $('#SaveNonAsset').text('Save').removeClass('btn-update').addClass('btn-success');
        assetManagementId = 0;
        Reset();

        if (titleForHeaderMoveNonTab == "Moveable Asset") {
            $('.NonMoveableAssetTypeDiv').hide();
            $('.CompanyAssetTypeDiv').hide();
            $('.MachineNameMoveableDiv').hide();
            $('.TypeNameCompanyDiv').hide();
            $('.NextServiceDiv').hide();
        } else if (titleForHeaderMoveNonTab == "Non-Moveable Asset") {
            $('.NonMoveableAssetTypeDiv').show();
            $('.CompanyAssetTypeDiv').hide();
            $('.MachineNameMoveableDiv').show();
            $('.TypeNameCompanyDiv').hide();
            $('.NextServiceDiv').show();
            $('#FranchiseId').val(FranchiseMappingId);
            $("#AssetnonHeader").text('Add Non-Moveable Asset');
        } else if (titleForHeaderMoveNonTab == "Company Assets") {
            $('.NonMoveableAssetTypeDiv').hide();
            $('.CompanyAssetTypeDiv').show();
            $('.MachineNameMoveableDiv').hide();
            $('.TypeNameCompanyDiv').show();
            $('.NextServiceDiv').show();
            $('#FranchiseId').val(FranchiseMappingId);
            $("#AssetnonHeader").text('Add Company Asset');
        }
    });

    $(document).on('change', '#CompanyAssetTypeId', function () {
        var $thisVal = $(this).val();
        var $thisText = $('#CompanyAssetTypeId option:selected').text();
        if ($thisVal == null || $thisVal == '') {
            $('#TypeName').val('');
            $('.NextServiceDiv').show();
        } else if ($thisVal == '1') {
            $('#TypeName').val($thisText);
            $('.NextServiceDiv').hide();
        } else if ($thisVal == '2') {
            $('#TypeName').val($thisText);
            $('.NextServiceDiv').show();
        }
    });

    $(document).on('click', '.btn-edit', function () {
        assetManagementId = $(this).data('id');

        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#AssetCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#AssetCanvas").css("width", "50%");
        } else {
            $("#AssetCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');

        $('#SaveNonAsset').text('Update').removeClass('btn-success').addClass('btn-update');
        Reset();

        if (titleForHeaderMoveNonTab == "Non-Moveable Asset") {
            $('.NonMoveableAssetTypeDiv').show();
            $('.CompanyAssetTypeDiv').hide();
            $('.MachineNameMoveableDiv').show();
            $('.TypeNameCompanyDiv').hide();
            $('.NextServiceDiv').show();
            $("#AssetnonHeader").text('Edit Non-Moveable Asset');

            var EditData = { FranchiseId: parseInt(FranchiseMappingId), AssetManagementId: assetManagementId, TypeId: parseInt(2), ClientId: null, Type: null };
            Common.ajaxCall("GET", "/Inventory/GetAssetManagementDetails", EditData, EditAssetManagementSuccess, null);
        } else if (titleForHeaderMoveNonTab == "Company Assets") {
            $('.NonMoveableAssetTypeDiv').hide();
            $('.CompanyAssetTypeDiv').show();
            $('.MachineNameMoveableDiv').hide();
            $('.TypeNameCompanyDiv').show();
            $('.NextServiceDiv').show();
            $("#AssetnonHeader").text('Edit Company Asset');

            var EditData = { FranchiseId: parseInt(FranchiseMappingId), AssetManagementId: assetManagementId, TypeId: parseInt(3), ClientId: null, Type: null };
            Common.ajaxCall("GET", "/Inventory/GetAssetManagementDetails", EditData, EditAssetManagementSuccess, null);
        }
    });

    $(document).on('click', '#CloseNonCanvas', function () {
        $("#AssetCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        $("#AssetnonHeader").text('');
    });

    $(document).on('click', '#SaveNonAsset', function (e) {
        if ($("#AssetNonInfoForm").valid()) {

            if (titleForHeaderMoveNonTab == "Non-Moveable Asset") {

                getExistFiles();

                var DataClientStatic = JSON.parse(JSON.stringify($('#AssetNonInfoForm').serializeArray()));
                var objvalue = {};

                $.each(DataClientStatic, function (index, item) {
                    objvalue[item.name] = item.value;
                });

                objvalue.AssetNon_MovableId = typeof assetManagementId !== "undefined" && assetManagementId > 0 ? parseInt(assetManagementId) : null;
                objvalue.FranchiseId = parseInt($('#FranchiseId').val()) || null;
                objvalue.MachineTypeId = parseInt($('#NonMoveableAssetTypeId').val()) || null;
                objvalue.MachineName = $('#MachineName').val() || null;
                objvalue.DepartmentId = parseInt($('#DepartmentId').val()) || null;
                objvalue.PurchaseDate = Common.stringToDateTimeSendTimeAlso('PurchaseDate') || null;
                objvalue.NoOfAssets = parseInt($('#NoOfAsset').val()) || null;
                objvalue.Amount = Common.parseFloatInputValue('Amount') || null;
                objvalue.NextServiceDate = Common.stringToDateTimeSendTimeAlso('NextServiceDate') || null;
                if (Common.parseFloatInputValue('DepreciationPercentage') == null || Common.parseFloatInputValue('DepreciationPercentage') == "") {
                    $('#DepreciationValue').val(objvalue.Amount);
                }
                objvalue.DepreciationPercentage = Common.parseFloatInputValue('DepreciationPercentage') || null;
                objvalue.Comments = $('#Comments').val() || null;

                formDataMultiple.append("AssetNonMovableStatic", JSON.stringify(objvalue));
                formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
                formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

                $.ajax({
                    type: "POST",
                    url: "/Inventory/InsertUpdateNonMovableAssetDetails",
                    data: formDataMultiple,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        formDataMultiple = new FormData();

                        if (response.status) {
                            Common.successMsg(response.message);
                            assetManagementId = 0;
                            $("#AssetCanvas").css("width", "0%");
                            $('#fadeinpage').removeClass('fadeoverlay');
                            Reset();
                            Common.ajaxCall("GET", "/Inventory/GetAssetManagementDetails", { FranchiseId: parseInt(FranchiseMappingId), AssetManagementId: null, TypeId: parseInt(2), ClientId: null, Type: null }, AssetManagementSuccess, null);
                        } else {
                            Common.errorMsg(response.message);
                        }
                    },
                    error: function (response) {
                        Common.errorMsg("An error occurred while saving data.");
                        formDataMultiple = new FormData();
                    }
                });

            } else if (titleForHeaderMoveNonTab == "Company Assets") {
                getExistFiles();

                var DataClientStatic = JSON.parse(JSON.stringify($('#AssetNonInfoForm').serializeArray()));
                var objvalue = {};

                $.each(DataClientStatic, function (index, item) {
                    objvalue[item.name] = item.value;
                });

                objvalue.MovableAssetId = typeof assetManagementId !== "undefined" && assetManagementId > 0 ? parseInt(assetManagementId) : null;
                objvalue.FranchiseId = parseInt($('#FranchiseId').val()) || null;
                objvalue.MovableAssetTypeId = parseInt($('#CompanyAssetTypeId').val()) || null;
                objvalue.TypeName = $('#TypeName').val() || null;
                objvalue.DepartmentId = parseInt($('#DepartmentId').val()) || null;
                objvalue.PurchaseDate = Common.stringToDateTimeSendTimeAlso('PurchaseDate') || null;
                objvalue.NoOfAssets = parseInt($('#NoOfAsset').val()) || null;
                objvalue.Amount = Common.parseFloatInputValue('Amount') || null;
                objvalue.NextServiceDate = Common.stringToDateTimeSendTimeAlso('NextServiceDate') || null;
                if (Common.parseFloatInputValue('DepreciationPercentage') == null || Common.parseFloatInputValue('DepreciationPercentage') == "") {
                    $('#DepreciationValue').val(objvalue.Amount);
                }
                objvalue.DepreciationPercentage = Common.parseFloatInputValue('DepreciationPercentage') || null;
                objvalue.Comments = $('#Comments').val() || null;

                formDataMultiple.append("AssetNonMovableStatic", JSON.stringify(objvalue));
                formDataMultiple.append("ExistFiles", JSON.stringify(existFiles));
                formDataMultiple.append("DeletedFiles", JSON.stringify(deletedFiles));

                $.ajax({
                    type: "POST",
                    url: "/Inventory/InsertUpdateAssetMovableDetails",
                    data: formDataMultiple,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        formDataMultiple = new FormData();

                        if (response.status) {
                            Common.successMsg(response.message);
                            assetManagementId = 0;
                            $("#AssetCanvas").css("width", "0%");
                            $('#fadeinpage').removeClass('fadeoverlay');
                            Reset();
                            Common.ajaxCall("GET", "/Inventory/GetAssetManagementDetails", { FranchiseId: parseInt(FranchiseMappingId), AssetManagementId: null, TypeId: parseInt(3), ClientId: null, Type: null }, AssetManagementSuccess, null);
                        } else {
                            Common.errorMsg(response.message);
                        }
                    },
                    error: function (response) {
                        Common.errorMsg("An error occurred while saving data.");
                        formDataMultiple = new FormData();
                    }
                });

            }
        }
    });


    $(document).on('click', '.navbar-tab', function () {
        var typeId = 0;
        assetManagementId = 0;
        titleForHeaderMoveNonTab = $(this).text().trim().replace(/\s*\(\d+\)$/, '');

        $('.navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim().replace(/\s*\(\d+\)$/, '') === titleForHeaderMoveNonTab) {
                $(this).addClass('active');
            }
            else if ($(this).text().trim() === titleForHeaderMoveNonTab) {

            }
        });

        if (titleForHeaderMoveNonTab == "Moveable Asset") {
            typeId = 1;
            $('.datapiker').hide();
        } else if (titleForHeaderMoveNonTab == "Non-Moveable Asset") {
            typeId = 2;
            $('.datapiker').show();
        } else if (titleForHeaderMoveNonTab == "Company Assets") {
            typeId = 3;
            $('.datapiker').show();
        }

        var EditData = { FranchiseId: parseInt(FranchiseMappingId), AssetManagementId: null, TypeId: parseInt(typeId), ClientId: null, Type: null };
        Common.ajaxCall("GET", "/Inventory/GetAssetManagementDetails", EditData, AssetManagementSuccess, null);
    });

    $(document).on('click', '.btn-delete', async function () {
        assetManagementId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (titleForHeaderMoveNonTab == "Non-Moveable Asset") {
            if (response == true) {
                Common.ajaxCall("GET", "/Inventory/DeleteNon_Movable", { AssetNon_MovableId: parseInt(assetManagementId) }, function (response) {
                    if (response.status) {
                        Common.successMsg(response.message);
                        Common.ajaxCall("GET", "/Inventory/GetAssetManagementDetails", { FranchiseId: parseInt(FranchiseMappingId), AssetManagementId: null, TypeId: parseInt(2), ClientId: null, Type: null }, AssetManagementSuccess, null);
                    }
                }, null);
            }
        } else if (titleForHeaderMoveNonTab == "Company Assets") {
            if (response == true) {
                Common.ajaxCall("GET", "/Inventory/DeleteMovable", { MovableAssetId: parseInt(assetManagementId) }, function (response) {
                    if (response.status) {
                        Common.successMsg(response.message);
                        Common.ajaxCall("GET", "/Inventory/GetAssetManagementDetails", { FranchiseId: parseInt(FranchiseMappingId), AssetManagementId: null, TypeId: parseInt(3), ClientId: null, Type: null }, AssetManagementSuccess, null);
                    }
                }, null);
            }
        }
    });

    $(document).on('click', '.btn-eye', function () {
        var ClientDataId = $(this).data('id');
        var Type = $(this).closest('tr').find('td').eq(1).text().trim();
        Common.ajaxCall("GET", "/Inventory/GetAssetManagementDetails", { FranchiseId: parseInt(FranchiseMappingId), AssetManagementId: null, TypeId: parseInt(1), ClientId: parseInt(ClientDataId), Type: Type }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                var windowWidth = $(window).width();
                if (windowWidth <= 600) {
                    $("#MoveableCanvas").css("width", "95%");
                } else if (windowWidth <= 992) {
                    $("#MoveableCanvas").css("width", "50%");
                } else {
                    $("#MoveableCanvas").css("width", "39%");
                }
                $('#fadeinpage').addClass('fadeoverlay');
                $("#MoveableHeader").text('Moveable Asset Info');

                var ResponseData = data[0];

                // Target the table
                var $table = $('#MoveableAssetManagementDynamicTable');

                // Clear existing thead and tbody rows
                $table.find('thead').empty();
                $table.find('tbody').empty();

                // If data is available
                if (ResponseData.length > 0) {
                    // Create header row from keys, skipping 'TetroONEnocount'
                    var keys = Object.keys(ResponseData[0]);
                    var visibleKeys = keys.filter(function (key) {
                        return key !== 'TetroONEnocount';
                    });

                    var theadRow = '<tr>';
                    visibleKeys.forEach(function (key) {
                        theadRow += '<th>' + key + '</th>';
                    });
                    theadRow += '</tr>';
                    $table.find('thead').append(theadRow);

                    // Create tbody rows
                    var tbodyHtml = '';
                    var allNull = true;

                    ResponseData.forEach(function (item) {
                        // Check if all relevant values are null
                        var hasNonNull = visibleKeys.some(function (key) {
                            return item[key] !== null && item[key] !== undefined && item[key] !== '';
                        });

                        if (hasNonNull) {
                            allNull = false;
                            tbodyHtml += '<tr>';
                            visibleKeys.forEach(function (key) {
                                tbodyHtml += '<td>' + (item[key] ?? '') + '</td>';
                            });
                            tbodyHtml += '</tr>';
                        }
                    });

                    // If all items are null or empty, show the "no records" row
                    if (allNull) {
                        tbodyHtml += '<tr>';
                        tbodyHtml += '<td valign="top" colspan="' + visibleKeys.length + '" class="dataTables_empty">';
                        tbodyHtml += '<div><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>';
                        tbodyHtml += '</td>';
                        tbodyHtml += '</tr>';
                    }

                    $table.find('tbody').append(tbodyHtml);
                }
            }
            else {
                Common.errorMsg(response.message);
            }
        }, null);
    });

    $(document).on('click', '#CloseMoveable', function () {
        $("#MoveableCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        $("#MoveableHeader").text('');
    });
});

function AssetManagementSuccess(response) {
    if (response.status) {
        //$('#loader-pms').show();
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

        $('#AssetManagementMainTableDynamic').empty();

        $('#AssetManagementMainTableDynamic').html(`
            <div class="table-responsive">
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="AssetManagementTable"></table>
            </div>
        `);

        if ('ClientId' in data[1][0] && data[1][0].ClientId == null || data[1][0].ClientId != null) {
            var columns = Common.bindColumn(data[1], ['ClientId', 'Colour']);
            bindTableForAssetManagement('AssetManagementTable', data[1], columns, -1, 'ClientId', '330px', true, access);

        } else if ('AssetNon_MovableId' in data[1][0] && data[1][0].AssetNon_MovableId == null || data[1][0].AssetNon_MovableId != null) {
            var columns = Common.bindColumn(data[1], ['AssetNon_MovableId']);
            Common.bindTableForNoStatus('AssetManagementTable', data[1], columns, -1, 'AssetNon_MovableId', '330px', true, access);
        } else if ('MovableAssetId' in data[1][0] && data[1][0].MovableAssetId == null || data[1][0].MovableAssetId != null) {
            var columns = Common.bindColumn(data[1], ['MovableAssetId']);
            bindTableForCompanyAsset('AssetManagementTable', data[1], columns, -1, 'MovableAssetId', '330px', true, access);
        }
        $('#loader-pms').hide();
    }
    else {
        //$('#loader-pms').hide();
        Common.errorMsg(response.message);
    }
}

function EditAssetManagementSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        if ('AssetNon_MovableId' in data[0][0]) {
            $('#FranchiseId').val(data[0][0].FranchiseId).trigger('change');
            $('#NonMoveableAssetTypeId').val(data[0][0].MachineTypeId).trigger('change');
            $('#MachineName').val(data[0][0].MachineName);
            $('#DepartmentId').val(data[0][0].DepartmentId).trigger('change');
            $('#NoOfAsset').val(data[0][0].NoOfAssets);
            $('#Amount').val(data[0][0].Amount);
            $('#DepreciationPercentage').val(data[0][0].DepreciationPercentage);
            $('#Comments').val(data[0][0].Comments);
            $('#DepreciationValue').val(data[0][0].DepreciationValue);

            const formattedPurchaseDate = formatToISODate(data[0][0].PurchaseDate);
            const formattedNextServiceDate = formatToISODate(data[0][0].NextServiceDate);
            $('#PurchaseDate').val(formattedPurchaseDate);
            //$('#NextServiceDate').attr('min', formattedPurchaseDate);
            $('#NextServiceDate').val(formattedNextServiceDate);
        }
        else if ('MovableAssetId' in data[0][0]) {
            $('#FranchiseId').val(data[0][0].FranchiseId).trigger('change');
            $('#CompanyAssetTypeId').val(data[0][0].MovableAssetTypeId).trigger('change');
            $('#TypeName').val(data[0][0].TypeName);
            $('#DepartmentId').val(data[0][0].DepartmentId).trigger('change');
            $('#NoOfAsset').val(data[0][0].NoOfAssets);
            $('#Amount').val(data[0][0].Amount);
            $('#DepreciationPercentage').val(data[0][0].DepreciationPercentage);
            $('#Comments').val(data[0][0].Comments);
            $('#DepreciationValue').val(data[0][0].DepreciationValue);

            const formattedPurchaseDate = formatToISODate(data[0][0].PurchaseDate);
            const formattedNextServiceDate = formatToISODate(data[0][0].NextServiceDate);
            $('#PurchaseDate').val(formattedPurchaseDate);
            //$('#NextServiceDate').attr('min', formattedPurchaseDate);
            $('#NextServiceDate').val(formattedNextServiceDate);
        }

        $('#ExistselectedFiles, #selectedFiles').empty("");
        var ulElement = $('#ExistselectedFiles');
        $.each(data[1], function (index, file) {
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
        $('#loader-pms').hide();
    }
}

function getExistFiles() {

    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "PurchaseOrder",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: src
        });
    });
}
$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "AssetNon_Movable",
        ModuleRefId: parseInt(moduleRefId),
        AttachmentFileName: fileText,
        AttachmentFilePath: src
    });
    $(listItem).remove();
});

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
                deleteButton.className = 'delete-button p-0';

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

function Reset() {
    $('#selectedFiles, #ExistselectedFiles').empty('');
    existFiles = [];
    formDataMultiple = new FormData();
    Common.removevalidation('AssetNonInfoForm');
}

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

function extractDate(inputDate) {
    if (!inputDate) {
        return '';
    }
    var parts = inputDate.split('T');
    var datePart = parts[0];
    return datePart;
}

function formatToISODate(ddmmyyyy) {
    if (!ddmmyyyy) return '';

    const parts = ddmmyyyy.split('-');
    if (parts.length !== 3) return '';

    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
}

function bindTableForAssetManagement(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();

    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var EligibilityColumnIndex = columns.findIndex(column => column.data === "Eligibility");

    if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [
        {
            "targets": EligibilityColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Colour != null && row.Colour.length > 0) {
                    var dataText = row.Eligibility;
                    var EligibilityColor = row.Colour.toLowerCase();

                    var htmlContent = '<div>';
                    htmlContent += '<span style="color:' + EligibilityColor + ';width: 99px;font-size: 12px;height: 20px;">' + dataText + '</span>';
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
                        return `<i class="btn-eye fas fa-eye d-flex justify-content-center" data-id="${row[editcolumn]}" title="View"></i>`;
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

function bindTableForCompanyAsset(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
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
                    if (row.MovableAssetId != null) {
                        if (editCondition || deleteCondition) {
                            return `
                                 ${editCondition ? `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit"><img src="/assets/commonimages/edit.svg" /></i>` : ''} 
                                ${deleteCondition ? ` <i class="btn-delete alert_delete mx-1"  data-id="${row[editcolumn]}" title="Delete"><img src="/assets/commonimages/delete.svg" /></i></div>` : ''}`;
                        }
                    }
                    else {
                        return `<div style="color: #000000;">No Action</div>`;
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
}