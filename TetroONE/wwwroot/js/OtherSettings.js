var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
$(document).ready(function () { 

    Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: FranchiseMappingId, ModuleName: "Unit" }, UnitSuccess, null);
    Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: FranchiseMappingId, ModuleName: "ProductCategory" }, ProductCategorySuccess, null);
    Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: FranchiseMappingId, ModuleName: "QualityParameter" }, QualityParameterSuccess, null);
    Common.ajaxCall("GET", "/Settings/GetProductionStage", { ProductionStagesId: null, FranchiseId: FranchiseMappingId }, ProductionSuccess, null);
    //Common.ajaxCall("GET", "/Settings/GetCretaria", { CriteriaId: null, FranchiseId: FranchiseMappingId }, CriteriaSuccess, null);
    Common.ajaxCall("GET", "/Settings/GetAutoGeneratePrefix", { AutoGeneratePrefixId: null, FranchiseId: FranchiseMappingId }, ModulePrefixSuccess, null);
    Common.ajaxCall("GET", "/Settings/GetAttendanceDevice", { AttendanceMachineId: null, FranchiseId: FranchiseMappingId }, AttendanceMachineSuccess, null);
    Common.ajaxCall("GET", "/Settings/GetOtherCharges", { OtherChargesId: null, FranchiseId: FranchiseMappingId }, OtherChargesSuccess, null);
    Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: FranchiseMappingId, ModuleName: "ClaimType" }, ClaimTypeSuccess, null);
    Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: FranchiseMappingId, ModuleName: "DocType" }, DocTypeSuccess, null);

    Common.ajaxCall("GET", "/Settings/GetProductSubCategoryDetails", { ProductSubCategoryId: null }, SubCategorySuccess, null);


    Common.bindDropDownParent('CriteriaTypeId', 'FormCretaria', 'CriteriaType');
    Common.bindDropDownParent('ModuleTypeId', 'FormModulePrefix', 'ModuleType');
    Common.bindDropDownParent('FranchiseId', 'FormModulePrefix', 'UserFranchiseMapping');
    Common.bindDropDownParent('FranchiseId', 'FormAttendanceMachine', 'Franchise');
    Common.bindDropDownParent('ProductCategoryId', 'FormsubCategory', 'ProductCategory');

    $('#DivAttendanceMachineMappingTable').hide();

    /*==================================================================Unit=====================================================================*/
    var masterInfoUnitId = 0;

    $(document).on('click', '#AddUnit', function () {
        $('#UnitModal').modal('show');
        $('#FormUnitName #BindFranchiseData').empty('');
        $('#SaveUnit').val('Save').addClass('btn-success').removeClass('btn-update');
        Common.removevalidation('FormUnitName');
        var parentId = "FormUnitName";
        Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, function (response) { FranchiseSuccess(response, parentId); }, null);
        masterInfoUnitId = 0;
    });
    $(document).on('click', '#UnitModalClose', function () {
        $('#UnitModal').modal('hide');
    });

    function UnitSuccess(response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            var columns = Common.bindColumn(data[0], ['UnitId']);
            bindTableSettings('UnitTable', data[0], columns, -1, 'UnitId', '275px', true);
        }
    }

    $("#SaveUnit").click(function (e) {

        const checkedCount = $('#BindFranchiseData input[type="checkbox"]:checked').length;

        if (checkedCount === 0) {
            e.preventDefault();
            $("#FormUnitName").valid()
            Common.warningMsg("Please select at least one Franchise.");
            return false;
        }

        if ($("#FormUnitName").valid()) {
            var objvalue = {};
            objvalue.MasterInfoId = masterInfoUnitId != 0 ? masterInfoUnitId : null
            objvalue.ModuleName = "Unit"
            objvalue.MasterInfoName = $('#UnitName').val();
            objvalue.MasterInfoDescription = $('#UnitDescription').val();

            var FranchiseList = [];
            var ClosestDivProductList = $('#FormUnitName #BindFranchiseData input[type="checkbox"]:checked');

            $.each(ClosestDivProductList, function (index, element) {
                var UserfranchiseMappingId = $(element).siblings('.ProductMappingId').text();
                var moduleId = masterInfoUnitId;
                var franchiseId = $(element).data('id');
                var IsActive = $(element).prop('checked');

                FranchiseList.push({
                    MasterInfoId: parseInt(UserfranchiseMappingId) || null,
                    ModuleId: parseInt(moduleId) || null,
                    franchiseId: franchiseId,
                    IsSelected: IsActive,
                });
            });

            objvalue.masterInfoMappingDetails = FranchiseList;

            Common.ajaxCall("POST", "/Settings/InsertUpdateMasterInfo", JSON.stringify(objvalue), MasterInfoUnitGetReload, null);
        }
    });

    $(document).on('click', '#UnitTable .btn-edit', function () {
        masterInfoUnitId = $(this).data('id');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: masterInfoUnitId, FranchiseId: franchiseId, ModuleName: "Unit" }, UnitNotNullSuccess, null);
    });

    function MasterInfoUnitGetReload(response) {
        if (response.status == true) {
            Common.successMsg(response.message);
            Common.removevalidation('FormUnitName');
            $('#UnitModal').modal('hide');
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: franchiseId, ModuleName: "Unit" }, UnitSuccess, null);
            masterInfoUnitId = 0;
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    function UnitNotNullSuccess(response) {
        if (response.status == true) {
            var data = JSON.parse(response.data);
            $('#FormUnitName #BindFranchiseData').empty('');
            $('#SaveUnit').val('Update').addClass('btn-update').removeClass('btn-success');
            Common.removevalidation('FormUnitName');
            $('#UnitModal').modal('show');
            $('#UnitName').val(data[0][0].UnitName);
            $('#UnitDescription').val(data[0][0].UnitDescription);

            var htmlDynamicProduct = "";
            if (data[1][0].FranchiseId != null && data[1][0].FranchiseId != "") {
                $.each(data[1], function (index, Franchise) {
                    var userFranchiseMappingId = Franchise.UnitFranchiseMappingId;
                    var franchiseId = Franchise.FranchiseId;
                    var franchiseName = Franchise.FranchiseName;
                    var isCheck = Franchise.IsSelected == true ? 'checked' : '';

                    htmlDynamicProduct += `
                        <div class="col-md-4 col-lg-4 col-sm-4 col-6 mt-2">
                            <lable class="ProductMappingId d-none">${userFranchiseMappingId}</lable>
                            <input type="checkbox" data-id="${franchiseId}" name="FormUnitName-${franchiseId}" value="product-${franchiseId}" ${isCheck} id="FormUnitName-${franchiseId}">
                            <label for="FormUnitName-${franchiseId}" class="checkbox-label">${franchiseName}</label>
                        </div>
                    `;
                });
                $('#FormUnitName #BindFranchiseData').append(htmlDynamicProduct);
            }
            else {
                $('#FormUnitName #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
            }
        }
    }

    $(document).on('click', '#UnitTable .btn-delete', async function () {
        masterInfoUnitId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteMasterInfo", { MasterInfoId: masterInfoUnitId, ModuleName: "Unit" }, UnitDeleteSuccess, null);
        }
    });

    function UnitDeleteSuccess(response) {
        if (response.status) {
            Common.successMsg(response.message);
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: franchiseId, ModuleName: "Unit" }, UnitSuccess, null);
        }
        else {
            Common.errorMsg(response.message);
        }
    }


    /*================================================================End Unit===================================================================*/

    /*==================================================================ProductCategory=====================================================================*/
    var masterInfoProductCategoryId = 0;

    $(document).on('click', '#AddProductCategory', function () {
        $('#ProductCategoryModal').modal('show');
        Common.removevalidation('FormProductCategory');
        $('#SaveProductCategory').val('Save').addClass('btn-success').removeClass('btn-update');
        $('#FormProductCategory #BindFranchiseData').empty('');
        var parentId = "FormProductCategory";
        Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, function (response) { FranchiseSuccess(response, parentId); }, null);
        masterInfoProductCategoryId = 0;
    });
    $(document).on('click', '#ProductCategoryModalClose', function () {
        $('#ProductCategoryModal').modal('hide');
    });

    function ProductCategorySuccess(response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            var columns = Common.bindColumn(data[0], ['ProductCategoryId']);
            bindTableSettings('ProductCategoryTable', data[0], columns, -1, 'ProductCategoryId', '275px', true);
        }
    }

    $("#SaveProductCategory").click(function (event) {

        const checkedCount = $('#BindFranchiseData input[type="checkbox"]:checked').length;

        if (checkedCount === 0) {
            event.preventDefault();
            $("#FormProductCategory").valid()
            Common.warningMsg("Please select at least one Franchise.");
            return false;
        }

        if ($("#FormProductCategory").valid()) {
            var objvalue = {
                MasterInfoId: masterInfoProductCategoryId != 0 ? masterInfoProductCategoryId : null,
                ModuleName: "ProductCategory",
                MasterInfoName: $('#ProductCategory').val(),
                MasterInfoDescription: $('#ProductCategoryDescription').val(),
            };

            var FranchiseList = [];
            var ClosestDivProductList = $('#FormProductCategory #BindFranchiseData input[type="checkbox"]:checked');

            $.each(ClosestDivProductList, function (index, element) {
                var UserfranchiseMappingId = $(element).siblings('.ProductMappingId').text();
                var moduleId = masterInfoProductCategoryId;
                var franchiseId = $(element).data('id');
                var IsActive = $(element).prop('checked');

                FranchiseList.push({
                    MasterInfoId: parseInt(UserfranchiseMappingId) || null,
                    ModuleId: parseInt(moduleId) || null,
                    franchiseId: franchiseId,
                    IsSelected: IsActive,
                });
            });

            objvalue.masterInfoMappingDetails = FranchiseList;

            Common.ajaxCall("POST", "/Settings/InsertUpdateMasterInfo", JSON.stringify(objvalue), MasterInfoProductCategoryGetReload, null);
        }
    });

    function MasterInfoProductCategoryGetReload(response) {
        if (response.status == true) {
            Common.successMsg(response.message);
            Common.removevalidation('FormProductCategory');
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: franchiseId, ModuleName: "ProductCategory" }, ProductCategorySuccess, null);
            $('#ProductCategoryModal').modal('hide');
            masterInfoProductCategoryId = 0;
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    $(document).on('click', '#ProductCategoryTable .btn-edit', function () {
        masterInfoProductCategoryId = $(this).data('id');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: masterInfoProductCategoryId, FranchiseId: franchiseId, ModuleName: "ProductCategory" }, ProductCategoryNotNullSuccess, null);
    });

    function ProductCategoryNotNullSuccess(response) {
        if (response.status == true) {
            var data = JSON.parse(response.data);
            $('#FormProductCategory #BindFranchiseData').empty('');
            $('#SaveProductCategory').val('Update').addClass('btn-update').removeClass('btn-success');
            Common.removevalidation('FormProductCategory');
            $('#ProductCategoryModal').modal('show');
            $('#ProductCategory').val(data[0][0].ProductCategoryName);
            $('#ProductCategoryDescription').val(data[0][0].ProductCategoryDescription);

            var htmlDynamicProduct = "";
            if (data[1][0].FranchiseId != null && data[1][0].FranchiseId != "") {
                $.each(data[1], function (index, Franchise) {
                    var userFranchiseMappingId = Franchise.ProductionStagesfranchiseMappingId;
                    var franchiseId = Franchise.FranchiseId;
                    var franchiseName = Franchise.FranchiseName;
                    var isCheck = Franchise.IsSelected == true ? 'checked' : '';

                    htmlDynamicProduct += `
                <div class="col-md-4 col-lg-4 col-sm-4 col-6 mt-2">
                    <lable class="ProductMappingId d-none">${userFranchiseMappingId}</lable>
                    <input type="checkbox" data-id="${franchiseId}" name="FormProductCategory-${franchiseId}" value="${franchiseName}" ${isCheck} id="FormProductCategory-${franchiseId}">
                    <label for="FormProductCategory-${franchiseId}" class="checkbox-label">${franchiseName}</label>
                </div>
            `;
                });
                $('#FormProductCategory #BindFranchiseData').append(htmlDynamicProduct);
            }
            else {
                $('#FormProductCategory #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
            }
        }
    }

    $(document).on('click', '#ProductCategoryTable .btn-delete', async function () {
        masterInfoProductCategoryId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteMasterInfo", { MasterInfoId: masterInfoProductCategoryId, ModuleName: "ProductCategory" }, ProductCategDeleteSuccess, null);
        }
    });

    function ProductCategDeleteSuccess(response) {
        if (response.status) {
            Common.successMsg(response.message);
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: franchiseId, ModuleName: "ProductCategory" }, ProductCategorySuccess, null);
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    /*===========================================================End ProductCategory===================================================================*/


    /*===========================================================QualityParameter===================================================================*/
    var masterInfoQualityParameterId = 0;

    $(document).on('click', '#AddQualityParameter', function () {
        $('#QualityModal').modal('show');
        $('#FormQualityParameter #BindFranchiseData').empty('');
        Common.removevalidation('FormQualityParameter');
        $('#SaveQualityParameter').val('Save').addClass('btn-success').removeClass('btn-update');
        var parentId = "FormQualityParameter";
        Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, function (response) { FranchiseSuccess(response, parentId); }, null);
        masterInfoQualityParameterId = 0;
    });
    $(document).on('click', '#QualityModalClose', function () {
        $('#QualityModal').modal('hide');
    });


    function QualityParameterSuccess(response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            var columns = Common.bindColumn(data[0], ['QualityParameterId']);
            bindTableSettings('QualityParameterTable', data[0], columns, -1, 'QualityParameterId', '275px', true);
        }
    }

    $("#SaveQualityParameter").click(function () {
        if ($("#FormQualityParameter").valid()) {
            var objvalue = {
                MasterInfoId: masterInfoQualityParameterId != 0 ? masterInfoQualityParameterId : null,
                ModuleName: "QualityParameter",
                MasterInfoName: $('#QualityParameterName').val(),
                MasterInfoDescription: $('#QualityParameterDescription').val(),
            };

            var FranchiseList = [];
            var ClosestDivProductList = $('#FormQualityParameter #BindFranchiseData input[type="checkbox"]:checked');

            $.each(ClosestDivProductList, function (index, element) {
                var UserfranchiseMappingId = $(element).siblings('.ProductMappingId').text();
                var moduleId = masterInfoProductCategoryId;
                var franchiseId = $(element).data('id');
                var IsActive = $(element).prop('checked');

                FranchiseList.push({
                    MasterInfoId: parseInt(UserfranchiseMappingId) || null,
                    ModuleId: parseInt(moduleId) || null,
                    franchiseId: franchiseId,
                    IsSelected: IsActive,
                });
            });

            objvalue.masterInfoMappingDetails = FranchiseList;
            Common.ajaxCall("POST", "/Settings/InsertUpdateMasterInfo", JSON.stringify(objvalue), MasterInfoQualityParameterGetReload, null);
        }
    });

    function MasterInfoQualityParameterGetReload(response) {
        if (response.status == true) {
            Common.successMsg(response.message);
            Common.removevalidation('FormQualityParameter');
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: franchiseId, ModuleName: "QualityParameter" }, QualityParameterSuccess, null);
            $('#QualityModal').modal('hide');
            masterInfoQualityParameterId = 0;
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    $(document).on('click', '#QualityParameterTable .btn-edit', function () {
        masterInfoQualityParameterId = $(this).data('id');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: masterInfoQualityParameterId, FranchiseId: franchiseId, ModuleName: "QualityParameter" }, QualityParameterNotNullSuccess, null);
    });

    function QualityParameterNotNullSuccess(response) {
        if (response.status == true) {
            var data = JSON.parse(response.data);
            $('#FormQualityParameter #BindFranchiseData').empty('');
            $('#QualityModal').modal('show');
            Common.removevalidation('FormQualityParameter');
            $('#SaveQualityParameter').val('Update').addClass('btn-update').removeClass('btn-success');
            $('#QualityParameterName').val(data[0][0].QualityParameterName);
            $('#QualityParameterDescription').val(data[0][0].QualityParameterDescription);

            var htmlDynamicProduct = "";
            if (data[1][0].FranchiseId != null && data[1][0].FranchiseId != "") {
                $.each(data[1], function (index, Franchise) {
                    var userFranchiseMappingId = Franchise.QualityParameterFranchiseMappingId;
                    var franchiseId = Franchise.FranchiseId;
                    var franchiseName = Franchise.FranchiseName;
                    var isCheck = Franchise.IsSelected == true ? 'checked' : '';

                    htmlDynamicProduct += `
                    <div class="col-md-4 col-lg-4 col-sm-4 col-6 mt-2">
                        <lable class="ProductMappingId d-none">${userFranchiseMappingId}</lable>
                        <input type="checkbox" data-id="${franchiseId}" name="FormQualityParameter-${franchiseId}" value="product-${franchiseId}" ${isCheck} id="FormQualityParameter-${franchiseId}">
                        <label for="FormQualityParameter-${franchiseId}" class="checkbox-label">${franchiseName}</label>
                    </div>
                `;
                });
                $('#FormQualityParameter #BindFranchiseData').append(htmlDynamicProduct);
            }
            else {
                $('#FormQualityParameter #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
            }
        }
    }


    $(document).on('click', '#QualityParameterTable .btn-delete', async function () {
        masterInfoQualityParameterId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteMasterInfo", { MasterInfoId: masterInfoQualityParameterId, ModuleName: "QualityParameter" }, QualityParameterDeleteSuccess, null);
        }
    });

    function QualityParameterDeleteSuccess(response) {
        if (response.status) {
            Common.successMsg(response.message);
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: franchiseId, ModuleName: "QualityParameter" }, QualityParameterSuccess, null);
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    /*===========================================================End QualityParameter===================================================================*/


    /*===========================================================Production===================================================================*/
    var masterInfoproductionStagesId = 0;

    $(document).on('click', '#AddProduction', function () {
        $('#ProductionModal').modal('show');
        $('#FormProductionStages #BindFranchiseData').empty('');
        Common.removevalidation('FormProductionStages');
        $('#SaveProductionStages').val('Save').addClass('btn-success').removeClass('btn-update');
        var parentId = "FormProductionStages";
        Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, function (response) { FranchiseSuccess(response, parentId); }, null);
        masterInfoproductionStagesId = 0;
    });

    $(document).on('click', '#ProductionModalClose', function () {
        $('#ProductionModal').modal('hide');
    });

    function ProductionSuccess(response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            var columns = Common.bindColumn(data[0], ['ProductionStagesId']);
            bindTableSettings('ProductionStagesTable', data[0], columns, -1, 'ProductionStagesId', '275px', true);
        }
    }

    $("#SaveProductionStages").click(function (e) {

        var checkValidation = $("#FormProductionStages").valid();
        const checkedCount = $('#BindFranchiseData input[type="checkbox"]:checked').length;

        if (checkedCount === 0) {
            e.preventDefault();
            $("#FormProductionStages").valid()
            Common.warningMsg("Please select at least one Franchise.");
            return false;
        }

        if (checkValidation) {
            var objvalue = {
                ProductionStagesId: masterInfoproductionStagesId != 0 ? masterInfoproductionStagesId : null,
                ProductionStagesName: $('#ProductionStageName').val(),
                IsRGB: $('#IsRGB').is(':checked'),
                IsPet: $('#IsPet').is(':checked'),
            };
            var FranchiseList = [];
            var ClosestDivProductList = $('#FormProductionStages #BindFranchiseData input[type="checkbox"]:checked');

            $.each(ClosestDivProductList, function (index, element) {
                var UserfranchiseMappingId = $(element).siblings('.ProductMappingId').text();
                var moduleId = masterInfoUnitId;
                var franchiseId = $(element).data('id');
                var IsActive = $(element).prop('checked');

                FranchiseList.push({
                    MasterInfoId: parseInt(UserfranchiseMappingId) || null,
                    ModuleId: parseInt(masterInfoproductionStagesId) || null,
                    franchiseId: franchiseId,
                    IsSelected: IsActive,
                });
            });

            objvalue.masterInfoMappingDetails = FranchiseList;

            Common.ajaxCall("POST", "/Settings/InsertUpdateProductionStage", JSON.stringify(objvalue), ProductionStagesGetReload, null);
        }
    });

    $(document).on('click', '#ProductionStagesTable .btn-edit', function () {
        masterInfoproductionStagesId = $(this).data('id');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        var editdata = { ProductionStagesId: masterInfoproductionStagesId, FranchiseId: franchiseId };
        Common.ajaxCall("GET", "/Settings/GetProductionStage", editdata, ProductionStagesNotNullSuccess, null);
    });

    function ProductionStagesNotNullSuccess(response) {
        if (response.status == true) {
            var data = JSON.parse(response.data);
            $('#ProductionModal').modal('show');
            Common.removevalidation('FormProductionStages');
            $('#SaveProductionStages').val('Update').addClass('btn-update').removeClass('btn-success');
            $('#FormProductionStages #BindFranchiseData').empty('');
            $('#ProductionStageName').val(data[0][0].ProductionStagesName);
            $('#FormProductionStages #BindFranchiseData').empty();
            if (data[0][0].IsPet == 0) {
                $('#IsPet').prop('checked', false);
            } else {
                $('#IsPet').prop('checked', true);
            }
            if (data[0][0].IsRGB == 0) {
                $('#IsRGB').prop('checked', false);
            } else {
                $('#IsRGB').prop('checked', true);
            }

            var htmlDynamicProduct = "";
            if (data[1][0].franchiseId != null && data[1][0].franchiseId != "") {
                $.each(data[1], function (index, Franchise) {
                    var userFranchiseMappingId = Franchise.ProductionStagesfranchiseMappingId;
                    var franchiseId = Franchise.franchiseId;
                    var franchiseName = Franchise.FranchiseName;
                    var isCheck = Franchise.IsSelected == true ? 'checked' : '';

                    htmlDynamicProduct += `
                <div class="col-md-4 col-lg-4 col-sm-4 col-6 mt-2">
                    <lable class="ProductMappingId d-none">${userFranchiseMappingId}</lable>
                    <input type="checkbox" data-id="${franchiseId}" name="FormProductionStages-${franchiseId}" value="${franchiseName}" ${isCheck} id="FormProductionStages-${franchiseId}">
                    <label for="FormProductionStages-${franchiseId}" class="checkbox-label">${franchiseName}</label>
                </div>
            `;
                });
                $('#FormProductionStages #BindFranchiseData').append(htmlDynamicProduct);
            }
            else {
                $('#FormProductionStages #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
            }
        }
    }

    function ProductionStagesGetReload(response) {
        if (response.status == true) {
            Common.successMsg(response.message);
            Common.removevalidation('FormProductionStages');
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetProductionStage", { ProductionStagesId: null, FranchiseId: franchiseId }, ProductionSuccess, null);
            $('#ProductionModal').modal('hide');
            masterInfoproductionStagesId = 0;
        }
        else {
            Common.errorMsg(response.message);
        }
    }


    $(document).on('click', '#ProductionStagesTable .btn-delete', async function () {
        masterInfoproductionStagesId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteProductionStage", { ProductionStagesId: masterInfoproductionStagesId }, ProductionStagesDeleteSuccess, null);
        }
    });

    function ProductionStagesDeleteSuccess(response) {
        if (response.status) {
            Common.successMsg(response.message);
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetProductionStage", { ProductionStagesId: null, FranchiseId: franchiseId }, ProductionSuccess, null);
        }
        else {
            Common.errorMsg(response.message);
        }
    }


    /*===========================================================End Production===================================================================*/

    /*===========================================================Criteria===================================================================*/
    var masterInfoSubCatogoryId = 0;

    $(document).on('click', '#AddSubCategory', function () {
        $('#SubCategoryModal').modal('show');
        $('#FormsubCategory #BindFranchiseData').empty('');
        Common.removevalidation('FormsubCategory');
        Common.bindDropDownParent('CriteriaTypeId', 'FormsubCategory', 'CriteriaType');
        $('#SaveSubCategory').val('Save').addClass('btn-success').removeClass('btn-update');
        masterInfoSubCatogoryId = 0;
    });
    $(document).on('click', '#SubCategoryModalClose', function () {
        $('#SubCategoryModal').modal('hide');
    });

    function SubCategorySuccess(response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            var columns = Common.bindColumn(data[0], ['ProductSubCategoryId']);
            bindTableSettings('SubCategoryTable', data[0], columns, -1, 'ProductSubCategoryId', '275px', true);
        }
    }

    $("#SaveSubCategory").click(function (event) {

        if ($("#FormsubCategory").valid()) {
            var objvalue = {
                ProductSubCategoryId: masterInfoSubCatogoryId != 0 ? masterInfoSubCatogoryId : null,
                ProductCategoryId: $('#ProductCategoryId').val(),
                ProductSubCategoryName: $('#ProductSubCategoryName').val(),
                ProductionCost: $('#Prodcost').val() || null,
                ProductSubCategoryDescription: $('#ProductSubCategoryDescription').val(),
            };
            
            Common.ajaxCall("POST", "/Settings/InsertUpdateProductSubCategory", JSON.stringify(objvalue), SubCategoryGetReload, null);
        }
    });

    function SubCategoryGetReload(response) {
        if (response.status == true) {
            Common.successMsg(response.message);
            Common.removevalidation('FormsubCategory');
            Common.ajaxCall("GET", "/Settings/GetProductSubCategoryDetails", { ProductSubCategoryId: null }, SubCategorySuccess, null);
            $('#SubCategoryModal').modal('hide');
            masterInfocriteriaId = 0;
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    $(document).on('click', '#SubCategoryTable .btn-edit', function () {
        masterInfoSubCatogoryId = $(this).data('id');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Settings/GetProductSubCategoryDetails", { ProductSubCategoryId: masterInfoSubCatogoryId }, SubCategoryNotNullSuccess, null);
    });

    function SubCategoryNotNullSuccess(response) {
        if (response.status == true) {
            var data = JSON.parse(response.data);
            $('#SubCategoryModal').modal('show');
            $('#SaveSubCategory').val('Update').addClass('btn-update').removeClass('btn-success');
            Common.removevalidation('FormsubCategory');
            
            $('#ProductCategoryId').val(data[0][0].ProductCategoryId);
            $('#ProductSubCategoryName').val(data[0][0].ProductSubCategoryName);
            $('#Prodcost').val(data[0][0].Productioncost);
            $('#ProductSubCategoryDescription').val(data[0][0].ProductSubCategoryDescription);

            
        }
    }

    $(document).on('click', '#SubCategoryTable .btn-delete', async function () {
        masterInfoSubCatogoryId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteProductSubCategory", { ProductSubCategoryId: masterInfoSubCatogoryId }, SubCategoryDelete, null);
        }
    });

    function SubCategoryDelete(response) {
        if (response.status) {
            Common.successMsg(response.message);
            Common.ajaxCall("GET", "/Settings/GetProductSubCategoryDetails", { ProductSubCategoryId: null }, SubCategorySuccess, null);
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    /*===========================================================End Criteria===================================================================*/


    /*==================================================================ModulePrefix=====================================================================*/
    var ModulePrefixId = 0;

    $(document).on('click', '#AddModulePrefix', function () {
        $('#ModulePrefixModal').modal('show');
        Common.removevalidation('FormModulePrefix');
        $('#SaveModulePrefix').val('Save').addClass('btn-success').removeClass('btn-update');
        ModulePrefixId = 0;
    });
    $(document).on('click', '#ModulePrefixModalClose', function () {
        $('#ModulePrefixModal').modal('hide');
    });

    function ModulePrefixSuccess(response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            var columns = Common.bindColumn(data[0], ['AutoGeneratePrefixId']);
            bindTableSettings('ModulePrefixTable', data[0], columns, -1, 'AutoGeneratePrefixId', '275px', true);
        }
    }

    $("#SaveModulePrefix").click(function () {
        if ($("#FormModulePrefix").valid()) {
            var objvalue = {};
            objvalue.AutoGeneratePrefixId = ModulePrefixId != 0 ? ModulePrefixId : null
            objvalue.ModuleType = $('#ModuleTypeId').val();
            objvalue.Prefix = $('#Prefix').val();
            objvalue.StartingFrom = $('#StartingFrom').val();
            objvalue.FranchiseId = parseInt($('#FranchiseId').val());

            Common.ajaxCall("POST", "/Settings/InsertUpdateAutoGeneratePrefix", JSON.stringify(objvalue), GetAutoGeneratePrefixReload, null);
        }
    });

    $(document).on('click', '#ModulePrefixTable .btn-edit', function () {
        ModulePrefixId = $(this).data('id');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Settings/GetAutoGeneratePrefix", { AutoGeneratePrefixId: ModulePrefixId, FranchiseId: franchiseId }, ModulePrefixNotNullSuccess, null);
    });

    function GetAutoGeneratePrefixReload(response) {
        if (response.status == true) {
            Common.successMsg(response.message);
            Common.removevalidation('FormModulePrefix');
            $('#ModulePrefixModal').modal('hide');
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetAutoGeneratePrefix", { AutoGeneratePrefixId: null, FranchiseId: franchiseId }, ModulePrefixSuccess, null);
            masterInfoUnitId = 0;
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    function ModulePrefixNotNullSuccess(response) {
        if (response.status == true) {
            var data = JSON.parse(response.data);
            $('#SaveModulePrefix').val('Update').addClass('btn-update').removeClass('btn-success');
            $('#ModulePrefixModal').modal('show');
            Common.removevalidation('FormModulePrefix');
            $('#ModuleTypeId').val(data[0][0].ModuleType);
            $('#Prefix').val(data[0][0].Prefix);
            $('#StartingFrom').val(data[0][0].StartingFrom);
            $('#FranchiseId').val(data[0][0].FranchiseId);
        }
    }

    $(document).on('click', '#ModulePrefixTable .btn-delete', async function () {
        ModulePrefixId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/AutoGeneratePrefixDelete", { AutoGeneratePrefixId: ModulePrefixId }, ModulePrefixDeleteSuccess, null);
        }
    });

    function ModulePrefixDeleteSuccess(response) {
        if (response.status) {
            Common.successMsg(response.message);
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetAutoGeneratePrefix", { AutoGeneratePrefixId: null, FranchiseId: franchiseId }, ModulePrefixSuccess, null);
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    /*==================================================================AttendanceMachine=====================================================================*/

    var attendanceMachineId = 0;
    $(document).on('click', '#SaveAttendanceMachine', function () {
        if ($('#FormAttendanceMachine').valid()) {
            var InsertData = JSON.parse(JSON.stringify(jQuery('#FormAttendanceMachine').serializeArray()));
            var objvalue = {};
            $.each(InsertData, function (index, item) {
                objvalue[item.name] = item.value;
            });
            let dataval = [];
            if (attendanceMachineId > 0) {
                objvalue.AttendanceMachineId = parseInt(attendanceMachineId);
                objvalue.IsActives = $("#FormAttendanceMachine #IsActive").is(":checked");

                var noRecordsFound = $('#AttendanceMachineMappingTable tbody td').filter(function () {
                    return $(this).text().trim().toLowerCase() === 'no records found';
                }).length > 0;

                if (!noRecordsFound) {
                    // Loop through all rows in AttendanceMachineMappingTable
                    $('#AttendanceMachineMappingTable tbody tr').each(function () {
                        let $row = $(this);
                        let $toggle = $row.find('.is-active-toggle');
                        let $AttendanceMachineId = $row.find('.AttendanceMachineId').text();

                        if ($toggle.length > 0 && $toggle.prop('checked')) {
                            let employeeId = $toggle.data('id');

                            dataval.push({
                                AttendanceMachineId: parseInt(attendanceMachineId) || null,
                                EmployeeId: employeeId,
                                EmployeeDeviceMappingId: parseInt($AttendanceMachineId) || null,
                                IsBlock: true
                            });
                        }
                    });

                    objvalue.deviceMappingDetailsList = dataval.length > 0 ? dataval : null;
                } else {
                    objvalue.deviceMappingDetailsList = null;
                }
            } else {
                objvalue.AttendanceMachineId = null;
                objvalue.IsActives = true;

                var noRecordsFound = $('#AttendanceMachineMappingTable tbody td').filter(function () {
                    return $(this).text().trim().toLowerCase() === 'no records found';
                }).length > 0;

                if (!noRecordsFound) {
                    // Loop through all rows in AttendanceMachineMappingTable
                    $('#AttendanceMachineMappingTable tbody tr').each(function () {
                        let $row = $(this);
                        let $toggle = $row.find('.is-active-toggle');
                        let $AttendanceMachineId = $row.find('.AttendanceMachineId').text();

                        if ($toggle.length > 0 && $toggle.prop('checked')) {
                            let employeeId = $toggle.data('id');

                            dataval.push({
                                AttendanceMachineId: parseInt(attendanceMachineId) || null,
                                EmployeeId: employeeId,
                                EmployeeDeviceMappingId: parseInt($AttendanceMachineId) || null,
                                IsBlock: true
                            });
                        }
                    });

                    objvalue.deviceMappingDetailsList = dataval.length > 0 ? dataval : null;
                } else {
                    objvalue.deviceMappingDetailsList = null;
                }
            }

            objvalue.FranchiseId = parseInt($('#FormAttendanceMachine #FranchiseId').val());
            Common.ajaxCall("POST", "/Settings/InsertUpdateAttendanceMachine", JSON.stringify(objvalue), function (response) {
                if (response.status == true) {
                    Common.successMsg(response.message);
                    Common.removevalidation('FormAttendanceMachine');
                    $('#AttendanceMachineModal').modal("hide");
                    Common.ajaxCall("GET", "/Settings/GetAttendanceDevice", { AttendanceMachineId: null, FranchiseId: FranchiseMappingId }, AttendanceMachineSuccess, null);
                }
                else {
                    Common.errorMsg(response.message);
                }
            }, null);
        }
    });

    $(document).on('click', '#AddAttendanceMachine', function () {
        $('#AttendanceMachineModal').modal("show");
        $('#DivAttendanceMachineMappingTable').hide();
        $('#SaveAttendanceMachine').val('Save').removeClass('btn-update').addClass('btn-success');
        $('#AttendanceDescription').removeClass('col-lg-8 col-md-12 col-sm-12 col-8').addClass('col-lg-12 col-md-12 col-sm-12 col-12');
        $('#AttendanceIsActive').removeClass('col-lg-4 col-md-4 col-sm-4 col-4 mt-4').addClass('col-lg-4 col-md-4 col-sm-4 col-4 mt-4 d-none');
        Common.removevalidation('FormAttendanceMachine');
        attendanceMachineId = 0;
        $('#SaveAttendanceMachine').val('Save');
        $('#FormAttendanceMachine #BindFranchiseData').empty("");
        Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, function (response) { FranchiseSuccess(response, "FormAttendanceMachine"); }, null);

    });
    $(document).on('click', '#AttendanceMachineTable .btn-edit', function () {
        attendanceMachineId = $(this).data('id');
        $('#DivAttendanceMachineMappingTable').show();
        $('#SaveAttendanceMachine').val('Update').removeClass('btn-success').addClass('btn-update');
        $('#AttendanceDescription').removeClass('col-lg-12 col-md-12 col-sm-12 col-12').addClass('col-lg-8 col-md-12 col-sm-12 col-8');
        $('#AttendanceIsActive').removeClass('col-lg-4 col-md-4 col-sm-4 col-4 mt-4 d-none').addClass('col-lg-4 col-md-4 col-sm-4 col-4 mt-4');
        $('#FormAttendanceMachine #BindFranchiseData').empty("");
        Common.ajaxCall("GET", "/Settings/GetAttendanceDevice", { AttendanceMachineId: attendanceMachineId }, EditAttendanceMachineSuccess, null);
    });

    $(document).on('change', '#FormAttendanceMachine #FranchiseId', function () {
        var $thisVal = $(this).val();
        if (attendanceMachineId == 0) {
            if ($thisVal != '') {
                $('#DivAttendanceMachineMappingTable').show();
                Common.ajaxCall("GET", "/Settings/GetEmployeeDetails_Franchise", { FranchiseId: parseInt($thisVal) }, MachineMappingSuccess, null);
            } else {
                $('#DivAttendanceMachineMappingTable').hide();
            }
        }
    });

    $(document).on('click', '#AttendanceMachineTable .btn-delete', async function () {
        var attendanceId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteDeviceMapping", { AttendanceMachineId: attendanceId }, function (response) {
                if (response.status == true) {
                    Common.successMsg(response.message);
                    Common.ajaxCall("GET", "/Settings/GetAttendanceDevice", { AttendanceMachineId: null, FranchiseId: FranchiseMappingId }, AttendanceMachineSuccess, null);
                }
                else {
                    Common.errorMsg(response.message);
                }
            }, null);
        }
    });

    Common.ajaxCall("GET", "/Settings/GetEmployeeDeviceMapping", null, MachineMappingSuccess, null);
    $(document).on('click', '#AttendanceMachineClose', function () {
        $('#AttendanceMachineModal').modal("hide");
    });


    /*==================================================================OtherCharges=====================================================================*/

    var otherChargesId = 0;
    $(document).on('click', '#SaveOtherCharges', function (event) {

        const checkedCount = $('#BindFranchiseData input[type="checkbox"]:checked').length;

        if (checkedCount === 0) {
            event.preventDefault();
            $("#FormOtherCharges").valid()
            Common.warningMsg("Please select at least one Franchise.");
            return false;
        }

        if ($('#FormOtherCharges').valid()) {
            var objvalue = {
                OtherChargesId: otherChargesId != 0 ? otherChargesId : null,
                OtherChargesType: $('#OtherChargesType').val(),
                OtherChargesName: $('#OtherChargesName').val(),
                IsPercentage: $("#FormOtherCharges #IsPercentage").is(":checked"),
                Value: parseFloat($('#Value').val()),
            };
            var FranchiseList = [];
            var ClosestDivProductList = $('#FormOtherCharges #BindFranchiseData input[type="checkbox"]:checked');

            $.each(ClosestDivProductList, function (index, element) {
                var UserfranchiseMappingId = $(element).siblings('.ProductMappingId').text();
                var moduleId = masterInfoUnitId;
                var franchiseId = $(element).data('id');
                var IsActive = $(element).prop('checked');

                FranchiseList.push({
                    MasterInfoId: parseInt(UserfranchiseMappingId) || null,
                    ModuleId: parseInt(otherChargesId) || null,
                    franchiseId: franchiseId,
                    IsSelected: IsActive,
                });
            });

            objvalue.masterInfoMappingDetails = FranchiseList;
            Common.ajaxCall("POST", "/Settings/InsertUpdateOtherCharges", JSON.stringify(objvalue), OtherChargesInsertSuccess, null);
        }
    });
    $(document).on('click', '#AddOtherCharges', function () {
        $('#OtherChargesModal').modal("show");
        $('#SaveOtherCharges').val('Save').removeClass('btn-update').addClass('btn-success');
        Common.removevalidation('FormOtherCharges');
        Common.ajaxCall("GET", "/Settings/GetEmployeeDeviceMapping", null, MachineMappingSuccess, null);
        otherChargesId = 0;
        $('#SaveOtherCharges').val('Save');
        $('#FormOtherCharges #BindFranchiseData').empty("");
        Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, function (response) { FranchiseSuccess(response, "FormOtherCharges"); }, null);

    });

    $(document).on('click', '#OtherChargesTable .btn-edit', function () {
        otherChargesId = $(this).data('id');
        $('#SaveOtherCharges').val('Save').removeClass('btn-success').addClass('btn-update');
        $('#FormOtherCharges #BindFranchiseData').empty("");
        Common.ajaxCall("GET", "/Settings/GetOtherCharges", { OtherChargesId: otherChargesId, FranchiseId: FranchiseMappingId }, EditOtherChargesSuccess, null);
    });

    $(document).on('click', '#OtherChargesTable .btn-delete', async function () {
        var otherChargesId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteOtherCharges", { OtherChargesId: otherChargesId }, OtherChargesInsertSuccess, null);
        }
    });
    $(document).on('click', '#OtherChargesModalClose', function () {
        $('#OtherChargesModal').modal("hide");
    });

    $(document).on('change', '#IsPercentage', function () {
        $('#Value').val('');
        if ($(this).is(':checked')) {
            $('#Value').attr('oninput', 'Common.validateDepreciationValue(this,3)');
        } else {
            $('#Value').attr('oninput', 'Common.allowOnlyNumbersAndDecimalwithmaxlength(this,5)');
        }
    });


    function OtherChargesInsertSuccess(response) {
        if (response.status == true) {
            $('#OtherChargesModal').modal("hide");
            Common.successMsg(response.message);
            Common.ajaxCall("GET", "/Settings/GetOtherCharges", { OtherChargesId: null, FranchiseId: parseInt(localStorage.getItem('FranchiseId')) }, OtherChargesSuccess, null);
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    /*==================================================================Claim=====================================================================*/
    var masterInfoClaimId = 0;

    $(document).on('click', '#AddClaim', function () {
        $('#ClaimModal').modal('show');
        $('#FormClaim #BindFranchiseData').empty('');
        $('#SaveClaim').val('Save').addClass('btn-success').removeClass('btn-update');
        Common.removevalidation('FormClaim');
        var parentId = "FormClaim";
        Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, function (response) { FranchiseSuccess(response, parentId); }, null);
        masterInfoClaimId = 0;
    });

    $(document).on('click', '#ClaimModalClose', function () {
        $('#ClaimModal').modal('hide');
    });

    function ClaimTypeSuccess(response) {
        if (response.status) {
            var data = JSON.parse(response.data);
            var columns = Common.bindColumn(data[0], ['ClaimTypeId']);
            bindTableSettings('ClaimTypeTable', data[0], columns, -1, 'ClaimTypeId', '275px', true);
        }
    }

    $("#SaveClaim").click(function (event) {

        const checkedCount = $('#BindFranchiseData input[type="checkbox"]:checked').length;

        if (checkedCount === 0) {
            event.preventDefault();
            $("#FormClaim").valid()
            Common.warningMsg("Please select at least one Franchise.");
            return false;
        }

        if ($("#FormClaim").valid()) {
            var objvalue = {};
            objvalue.MasterInfoId = masterInfoClaimId != 0 ? masterInfoClaimId : null
            objvalue.ModuleName = "ClaimType"
            objvalue.MasterInfoName = $('#ClaimName').val();
            objvalue.MasterInfoDescription = $('#ClaimDescription').val();

            var FranchiseList = [];
            var ClosestDivProductList = $('#FormClaim #BindFranchiseData input[type="checkbox"]:checked');

            $.each(ClosestDivProductList, function (index, element) {
                var UserfranchiseMappingId = $(element).siblings('.ProductMappingId').text();
                var moduleId = masterInfoClaimId;
                var franchiseId = $(element).data('id');
                var IsActive = $(element).prop('checked');

                FranchiseList.push({
                    MasterInfoId: parseInt(UserfranchiseMappingId) || null,
                    ModuleId: parseInt(moduleId) || null,
                    franchiseId: franchiseId,
                    IsSelected: IsActive,
                });
            });

            objvalue.masterInfoMappingDetails = FranchiseList;

            Common.ajaxCall("POST", "/Settings/InsertUpdateMasterInfo", JSON.stringify(objvalue), MasterInfoClaimGetReload, null);
        }
    });

    $(document).on('click', '#ClaimTypeTable .btn-edit', function () {
        masterInfoClaimId = $(this).data('id');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: masterInfoClaimId, FranchiseId: franchiseId, ModuleName: "ClaimType" }, ClaimNotNullSuccess, null);
    });

    function MasterInfoClaimGetReload(response) {
        if (response.status == true) {
            Common.successMsg(response.message);
            Common.removevalidation('FormClaim');
            $('#ClaimModal').modal('hide');
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: franchiseId, ModuleName: "ClaimType" }, ClaimTypeSuccess, null);
            masterInfoClaimId = 0;
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    function ClaimNotNullSuccess(response) {
        if (response.status == true) {
            var data = JSON.parse(response.data);
            $('#FormClaim #BindFranchiseData').empty('');
            $('#SaveClaim').val('Update').addClass('btn-update').removeClass('btn-success');
            Common.removevalidation('FormClaim');
            $('#ClaimModal').modal('show');
            $('#ClaimName').val(data[0][0].ClaimTypeName);
            $('#ClaimDescription').val(data[0][0].ClaimTypeDescription);

            var htmlDynamicProduct = "";
            if (data[1][0].FranchiseId != null && data[1][0].FranchiseId != "") {
                $.each(data[1], function (index, Franchise) {
                    var userFranchiseMappingId = Franchise.UnitFranchiseMappingId;
                    var franchiseId = Franchise.FranchiseId;
                    var franchiseName = Franchise.FranchiseName;
                    var isCheck = Franchise.IsSelected == true ? 'checked' : '';

                    htmlDynamicProduct += `
                        <div class="col-md-4 col-lg-4 col-sm-4 col-6 mt-2">
                            <lable class="ProductMappingId d-none">${userFranchiseMappingId}</lable>
                            <input type="checkbox" data-id="${franchiseId}" name="FormClaim-${franchiseId}" value="product-${franchiseId}" ${isCheck} id="FormClaim-${franchiseId}">
                            <label for="FormClaim-${franchiseId}" class="checkbox-label">${franchiseName}</label>
                        </div>
                    `;
                });
                $('#FormClaim #BindFranchiseData').append(htmlDynamicProduct);
            }
            else {
                $('#FormClaim #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
            }
        }
    }

    $(document).on('click', '#ClaimTypeTable .btn-delete', async function () {
        masterInfoClaimId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteMasterInfo", { MasterInfoId: masterInfoClaimId, ModuleName: "ClaimType" }, ClaimDeleteSuccess, null);
        }
    });

    function ClaimDeleteSuccess(response) {
        if (response.status) {
            Common.successMsg(response.message);
            var franchiseId = parseInt($('#UserFranchiseMappingId').val());
            Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: franchiseId, ModuleName: "ClaimType" }, ClaimTypeSuccess, null);
        }
        else {
            Common.errorMsg(response.message);
        }
    }

    /*==============================================================Document Info =====================================================================*/


    var masterInfoDocumentId = 0;

    $(document).on('click', '#AddDocument', function () {
        $('#DocumentModal').modal('show');
        $('#FormDocument #BindFranchiseData').empty('');
        $('#SaveDocument').val('Save').addClass('btn-success').removeClass('btn-update');
        Common.removevalidation('FormDocument');
        var parentId = "FormDocument";
        Common.ajaxCall("GET", "/Myprofile/GetFranchise", null, function (response) { FranchiseSuccess(response, parentId); }, null);
        masterInfoDocumentId = 0;
    });

    $(document).on('click', '#DocumentClose', function () {
        $('#DocumentModal').modal('hide');
    });

    $("#SaveDocument").click(function (event) {

        const checkedCount = $('#BindFranchiseData input[type="checkbox"]:checked').length;

        if (checkedCount === 0) {
            event.preventDefault();
            $("#FormDocument").valid();
            Common.warningMsg("Please select at least one Franchise.");
            return false;
        }

        if ($("#FormDocument").valid()) {
            var objvalue = {};
            objvalue.MasterInfoId = masterInfoDocumentId != 0 ? masterInfoDocumentId : null
            objvalue.ModuleName = "DocType"
            objvalue.MasterInfoName = $('#DocTypeName').val();
            objvalue.MasterInfoDescription = $('#DocTypeDescription').val();

            var FranchiseList = [];
            var ClosestDivProductList = $('#FormDocument #BindFranchiseData input[type="checkbox"]:checked');

            $.each(ClosestDivProductList, function (index, element) {
                var UserfranchiseMappingId = $(element).siblings('.ProductMappingId').text();
                var moduleId = masterInfoDocumentId;
                var franchiseId = $(element).data('id');
                var IsActive = $(element).prop('checked');

                FranchiseList.push({
                    MasterInfoId: parseInt(UserfranchiseMappingId) || null,
                    ModuleId: parseInt(moduleId) || null,
                    franchiseId: franchiseId,
                    IsSelected: IsActive,
                });
            });

            objvalue.masterInfoMappingDetails = FranchiseList;

            Common.ajaxCall("POST", "/Settings/InsertUpdateMasterInfo", JSON.stringify(objvalue), DocTypeGetReload, null);
        }
    });


    $(document).on('click', '#DocumentTable .btn-edit', function () {
        masterInfoDocumentId = $(this).data('id');
        $('#SaveDocument').val('Update').addClass('btn-update').removeClass('btn-success');
        $('#FormDocument #BindFranchiseData').empty("");
        Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: masterInfoDocumentId, FranchiseId: FranchiseMappingId, ModuleName: "DocType" }, EditDocTypeSuccess, null);
    });

    $(document).on('click', '#DocumentTable .btn-delete', async function () {
        var DocumentId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteMasterInfo", { MasterInfoId: DocumentId, ModuleName: "DocType" }, DocTypeGetReload, null);

        }
    });
});

function FranchiseSuccess(response, formId) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var htmlDynamicProduct = "";

        if (data[0][0].FranchiseId != null && data[0][0].FranchiseId != "") {
            data[0].forEach(function (franchiseData) {
                var FranchiseId = franchiseData.FranchiseId;
                var FranchiseName = franchiseData.FranchiseName;
                var IsActiveCheck = franchiseData.IsActive ? 'checked' : '';

                htmlDynamicProduct += `
                <div class="col-md-4 col-lg-4 col-sm-4 col-6 mt-2">
                    <label class="FranchiseMappingId d-none"></label>
                    <input type="checkbox" data-id="${FranchiseId}" name="${formId}-${FranchiseId}" ${IsActiveCheck} id="${formId}-${FranchiseId}">
                    <label for="${formId}-${FranchiseId}" class="checkbox-label">${FranchiseName}</label>
                </div>`;
            });

            $(`#${formId} #BindFranchiseData`).append(htmlDynamicProduct);
        } else {
            $(`#${formId} #BindFranchiseData`).append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        }
    } else {
        console.error("Failed to load franchise data:", response.message);
        // Optionally handle errors like showing a message to the user
    }
}

function AttendanceMachineSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[0], ['AttendanceMachineId', 'Status_Colour']);
        bindTable('AttendanceMachineTable', data[0], columns, -1, 'AttendanceMachineId', '275px', true);
    }
}

function EditAttendanceMachineSuccess(response) {
    if (response.status == true) {
        var data = JSON.parse(response.data);
        Common.removevalidation('FormAttendanceMachine');
        $('#AttendanceMachineModal').modal("show");
        Common.bindParentData(data[0], 'FormAttendanceMachine');

        var columns = Common.bindColumn(data[1], ['EmployeeId', 'EmployeeDeviceMappingId']);
        bindDeviceTable('AttendanceMachineMappingTable', data[1], columns, '300px');
    }
}

function MachineMappingSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[0], ['EmployeeId', 'EmployeeDeviceMappingId']);
        bindDeviceTable('AttendanceMachineMappingTable', data[0], columns, '300px');
    }
}

function bindDeviceTable(tableid, data, columns, scrollpx) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        if ($('#' + tableid).DataTable().rows().data().toArray().length > 0) {
            $('#' + tableid).DataTable().clear().destroy();
        }
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "TetroONEnocount");
    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');

    var checkboxColumnIndex = columns.findIndex(column => column.name === "IsActive");
    if (!isTetroONEnocount) {
        if (checkboxColumnIndex > -1) {
            columns[checkboxColumnIndex].title = columns[checkboxColumnIndex].title + ' <div class="form-check form-switch d-inline-flex"><input class="form-check-input" id="SelectAll" type="checkbox"> </div>';
        }
    }

    var renderColumn = [
        {
            targets: -1,
            render: function (data, type, row, meta) {

                var value = row.IsActive;

                return `<div class="form-check form-switch">
                  <input class="form-check-input is-active-toggle  isuseractive" data-id="${row.EmployeeId}" type="checkbox" ${value ? 'checked' : ''}>
                  <lable class="d-none AttendanceMachineId">${row.EmployeeDeviceMappingId}</lable>
               </div>`;
            }
        }
    ];

    var dataTableOptions = {
        "dom": "Blfrtip",
        "bDestroy": true,
        "responsive": true,
        "data": !isTetroONEnocount ? data : [],
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
        "searching": true,
        "info": false,
        "paging": false,
        "oSearch": { "bSmart": false, "bRegex": true },
        "columnDefs": renderColumn,
        "createdRow": function (row, data, dataIndex) {
            $(row).find('.isuseractive').on('change', function () {
                var allChecked = $('#' + tableid + ' .isuseractive').length === $('#' + tableid + ' .isuseractive:checked').length;
                $('#SelectAll').prop('checked', allChecked);
            });
        }
    };

    $('#' + tableid).DataTable(dataTableOptions);
    var table = $('#' + tableid).DataTable();
    autoAdjustColumns(table);
    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });
    $('#SelectAll').on('change', function () {
        var rows = table.rows({ 'search': 'applied' }).nodes();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });
    updateSelectAllState();
}

function updateSelectAllState() {
    if ($('.isuseractive:checked').length === $('.isuseractive').length) {
        $('#SelectAll').prop('checked', true);
    } else {
        $('#SelectAll').prop('checked', false);
    }
}

function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction) {
    if ($.fn.DataTable.isDataTable('#' + tableid)) {
        $('#' + tableid).DataTable().clear().destroy();
    }
    $('#' + tableid).empty();
    columns = columns.filter(x => x.name != "TetroONEnocount");
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    if (isAction == true && data != null && data.length > 0 && !isTetroONEnocount) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }
    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");

    var renderColumn = [
        {
            "targets": StatusColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Status_Colour != null && row.Status_Colour.length > 0) {
                    var dataText = row.Status;
                    var statusColor = row.Status_Colour.toLowerCase();

                    var htmlContent = '<div>';
                    htmlContent += '<span class="ana-span badge text-white" style="background:' + statusColor + '">' + dataText + '</span>';
                    htmlContent += '</div>';

                    return htmlContent;
                }
                return data;
            }
        }];
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
        "pageLength": 8,
        "lengthMenu": [7, 14, 50],
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "columnDefs": !isTetroONEnocount
            ? renderColumn : [],
    });

    $('#tableFilter' + tableid).on('keyup', function () {
        table.search($(this).val()).draw();
    });

    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}
function OtherChargesSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[0], ['OtherChargesId']);
        bindTableSettings('OtherChargesTable', data[0], columns, -1, 'OtherChargesId', '275px', true);
    }
}

function EditOtherChargesSuccess(response) {
    if (response.status == true) {
        var data = JSON.parse(response.data);
        Common.removevalidation('FormOtherCharges');
        $('#OtherChargesModal').modal("show");
        Common.bindParentData(data[0], 'FormOtherCharges');

        var htmlDynamicProduct = "";
        if (data[1][0].FranchiseId != null && data[1][0].FranchiseId != "") {
            $.each(data[1], function (index, Franchise) {
                var userFranchiseMappingId = Franchise.ProductionStagesfranchiseMappingId;
                var franchiseId = Franchise.FranchiseId;
                var franchiseName = Franchise.FranchiseName;
                var isCheck = Franchise.IsSelected == true ? 'checked' : '';

                htmlDynamicProduct += `
                <div class="col-md-4 col-lg-4 col-sm-4 col-6 mt-2">
                    <lable class="AttendanceMachineId d-none">${userFranchiseMappingId}</lable>
                    <input type="checkbox" data-id="${franchiseId}" name="FormAttendanceMachine-${franchiseId}" value="${franchiseName}" ${isCheck} id="FormAttendanceMachine-${franchiseId}">
                    <label for="FormAttendanceMachine-${franchiseId}" class="checkbox-label">${franchiseName}</label>
                </div>
            `;
            });
            $('#FormOtherCharges #BindFranchiseData').append(htmlDynamicProduct);
        }
        else {
            $('#FormOtherCharges #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        }
    }
}

function DocTypeSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var columns = Common.bindColumn(data[0], ['DocTypeId']);
        bindTableSettings('DocumentTable', data[0], columns, -1, 'DocTypeId', '275px', true);
    }
}

function DocTypeGetReload(response) {
    if (response.status == true) {
        Common.successMsg(response.message);
        $('#DocumentModal').modal('hide');
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, FranchiseId: FranchiseMappingId, ModuleName: "DocType" }, DocTypeSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}


function EditDocTypeSuccess(response) {
    if (response.status == true) {
        var data = JSON.parse(response.data);
        Common.removevalidation('FormDocument');
        $('#DocumentModal').modal("show");
        Common.bindParentData(data[0], 'FormDocument');

        var htmlDynamicProduct = "";
        if (data[1][0].FranchiseId != null && data[1][0].FranchiseId != "") {
            $.each(data[1], function (index, Franchise) {
                var userFranchiseMappingId = Franchise.ProductionStagesfranchiseMappingId;
                var franchiseId = Franchise.FranchiseId;
                var franchiseName = Franchise.FranchiseName;
                var isCheck = Franchise.IsSelected == true ? 'checked' : '';

                htmlDynamicProduct += `
                <div class="col-md-4 col-lg-4 col-sm-4 col-6 mt-2">
                    <lable class="AttendanceMachineId d-none">${userFranchiseMappingId}</lable>
                    <input type="checkbox" data-id="${franchiseId}" name="FormAttendanceMachine-${franchiseId}" value="${franchiseName}" ${isCheck} id="FormAttendanceMachine-${franchiseId}">
                    <label for="FormAttendanceMachine-${franchiseId}" class="checkbox-label">${franchiseName}</label>
                </div>
            `;
            });
            $('#FormDocument #BindFranchiseData').append(htmlDynamicProduct);
        }
        else {
            $('#FormDocument #BindFranchiseData').append('<div class="col-12 d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        }
    }
}


function bindTableSettings(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction) {
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
        "searching": true,
        "pageLength": 7,
        "lengthMenu": [7, 14, 50],
        "language": $.extend({}, lang, {
            "emptyTable": '<div><img  src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>'
        }),
        "columnDefs": !isTetroONEnocount
            ? renderColumn : [],
    });

    $('#tableFilter' + tableid).on('keyup', function () {
        table.search($(this).val()).draw();
    });

    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}
