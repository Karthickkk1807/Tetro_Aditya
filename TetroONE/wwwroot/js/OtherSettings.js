var PlantMappingId = 0;
var masterInfoId = 0;
var MachineId = 0;
var ColorId = 0;
var ProductCategoryId = 0;
var ProductSubCategoryId = 0;
var AutoGeneratePrefixId = 0;

function getMasterData(moduleName) {
    return new Promise((resolve, reject) => {
        Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, ModuleName: moduleName }, function (response) {
            resolve(response);
        },
            function (error) {
                reject(error);
            }
        );
    });
}

//const moduleOrder = ["EmployeeType", "Department", "UserGroup", "UserType", "PayType", "ClaimType", "EmployeeStatus", "LeaveStatus", "DocType", "ClaimType", "ExpenseType"];
const moduleOrder = ["Fabric", "Process", "Unit", "Department", "ExpenseType"]; 

Common.ajaxCall("GET", "/Settings/GetProductCategory", { ProductCategoryId: null }, ProductCategorySuccess, null);
Common.ajaxCall("GET", "/Settings/GetProductSubCategory", { ProductSubCategoryId: null }, ProductSubCategorySuccess, null);
Common.ajaxCall("GET", "/Settings/GetMachine", { MachineId: null }, MachineSuccess, null);
Common.ajaxCall("GET", "/Settings/GetColor", { ColorId: null }, ColorSuccess, null);
Common.ajaxCall("GET", "/Settings/GetAutoGeneratePrefixDetails", { AutoGeneratePrefixId: null, PlantId: parseInt(PlantMappingId) }, AutoGeneratePrefixSuccess, null);

Common.bindDropDownParent('ProductTypeId', 'FormProductCategory', 'ProductType');
Common.bindDropDownParent('ProductCategoryId', 'FormProductSubCategory', 'ProductCategory');
Common.bindDropDownParent('ModuleTypeId', 'FormAutoGeneratePrefix', 'ModuleType');

$(document).ready(function () {

    PlantMappingId = parseInt(localStorage.getItem('FranchiseId'));

    var $cols = $('#FormProductSubCategory .row > div');

    // Hide 3rd div
    $cols.eq(2).hide();

    // Update 1st and 2nd div classes
    $cols.eq(0).removeClass().addClass('col-md-6 col-lg-6 col-sm-6 col-6');
    $cols.eq(1).removeClass().addClass('col-md-6 col-lg-6 col-sm-6 col-6');

    /*=================================================================Common=====================================================================*/

    InstillationMasterDataTwoPara();

    $(document).on('click', '.CommonAddBtn', function () {
        var TitleText = $(this).closest('.card-header').find('.card-title').text();
        var TitleTextLabel = $(this).closest('.card-header').find('.card-title').text().trim().split(' ')[0];
        $('#HeaderTextInfo').text(TitleText);
        $('#MasterInfoNameLabel').html(TitleTextLabel + ' Name <span id="Asterisk">*</span>');
        $('#MasterInfoDescriptionLabel').text(TitleTextLabel + ' ' + 'Description');
        $('#MasterInfoName').attr('placeholder', 'Ex: ' + TitleTextLabel + 'Name');
        $('#MasterInfoDescription').attr('placeholder', 'Ex: ' + TitleTextLabel + 'Description');
        $('#MasterInfoSave').val('Save').addClass('btn-success').removeClass('btn-update');
        $('#FormMasterDataTwoPara')[0].reset();
        Common.removevalidation('FormMasterDataTwoPara');
        Common.removeMessage('FormMasterDataTwoPara');
        $('#MasterDataTwoParaModal').show();
        masterInfoId = 0;
    });

    $(document).on('click', '.CommonTable .btn-edit', function () {
        masterInfoId = $(this).data('id');

        var card = $(this).closest('.card');
        var TitleText = card.find('.card-header .card-title').text().trim();
        var TitleTextLabel = card.find('.card-header .card-title').text().trim().split(' ')[0];
        $('#HeaderTextInfo').text(TitleText);
        $('#MasterInfoNameLabel').html(TitleTextLabel + ' Name <span id="Asterisk">*</span>');
        $('#MasterInfoDescriptionLabel').text(TitleTextLabel + ' ' + 'Description');
        $('#MasterInfoName').attr('placeholder', 'Ex: ' + TitleTextLabel + 'Name');
        $('#MasterInfoDescription').attr('placeholder', 'Ex: ' + TitleTextLabel + 'Description');
        $('#MasterInfoSave').val('Update').addClass('btn-update').removeClass('btn-success');
        $('#FormMasterDataTwoPara')[0].reset();
        Common.removevalidation('FormMasterDataTwoPara');
        Common.removeMessage('FormMasterDataTwoPara');
        $('#MasterDataTwoParaModal').show();

        Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: parseInt(masterInfoId), ModuleName: TitleTextLabel }, MasterInfoGetNotNullSuccess, null);
    });

    $(document).on('click', '#MasterDataTwoParaModalClose', function () {
        $('#MasterDataTwoParaModal').hide();
    });

    $("#MasterInfoSave").click(function (e) {
        if ($("#FormMasterDataTwoPara").valid()) {
            var ModuleName = $(this).closest('#MasterDataTwoParaModal').find('#HeaderTextInfo').text().trim().split(' ')[0];
            var objvalue = {};
            objvalue.MasterInfoId = masterInfoId != 0 ? masterInfoId : null
            objvalue.ModuleName = ModuleName
            objvalue.MasterInfoName = $('#MasterInfoName').val();
            objvalue.MasterInfoDescription = $('#MasterInfoDescription').val();

            Common.ajaxCall("POST", "/Settings/InsertUpdateMasterInfo", JSON.stringify(objvalue), MasterInfoGetReload, null);
        }
    });

    $(document).on('click', '.CommonTable .btn-delete', async function () {
        masterInfoId = $(this).data('id'); var card = $(this).closest('.card');

        var card = $(this).closest('.card');
        var TitleTextLabel = card.find('.card-header .card-title').text().trim().split(' ')[0];
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteMasterInfo", { MasterInfoId: parseInt(masterInfoId), ModuleName: TitleTextLabel }, MasterInfoGetReload, null);
        }
    });


    /*=================================================================Color=====================================================================*/

    $(document).on('click', '#AddColor', function () {
        $('#ColorSave').val('Save').addClass('btn-success').removeClass('btn-update');
        $('#FormColor')[0].reset();
        Common.removevalidation('FormColor');
        Common.removeMessage('FormColor');
        $('#ColorModal').show();
        ColorId = 0;
    });

    $(document).on('click', '#ColorTable .btn-edit', function () {
        ColorId = $(this).data('id');
        $('#ColorSave').val('Update').addClass('btn-update').removeClass('btn-success');
        $('#FormColor')[0].reset();
        Common.removevalidation('FormColor');
        Common.removeMessage('FormColor');
        $('#ColorModal').show();
        Common.ajaxCall("GET", "/Settings/GetColor", { ColorId: parseInt(ColorId) }, GetColorNotNullSuccess, null);
    });

    $("#ColorSave").click(function (e) {
        if ($("#FormColor").valid()) {
            var DataColorStatic = JSON.parse(JSON.stringify(jQuery('#FormColor').serializeArray()));

            var objvalue = {};
            $.each(DataColorStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.ColorId = ColorId != 0 ? parseInt(ColorId) : null

            Common.ajaxCall("POST", "/Settings/InsertUpdateColorInfo", JSON.stringify(objvalue), GetColorInfoReload, null);
        }
    });

    $(document).on('click', '#ColorTable .btn-delete', async function () {
        ColorId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteColorDetails", { ColorId: parseInt(ColorId) }, GetColorInfoReload, null);
        }
    });

    $(document).on('click', '#ColorClose', function () {
        $('#ColorModal').hide();
    });


    /*=================================================================Machine=====================================================================*/

    $(document).on('click', '#AddMachine', function () {
        $('#MachineSave').val('Save').addClass('btn-success').removeClass('btn-update');
        $('#FormMachine')[0].reset();
        Common.removevalidation('FormMachine');
        Common.removeMessage('FormMachine');
        $('#MachineModal').show();
        MachineId = 0;
    });

    $(document).on('click', '#MachineTable .btn-edit', function () {
        MachineId = $(this).data('id');
        $('#MachineSave').val('Update').addClass('btn-update').removeClass('btn-success');
        $('#FormMachine')[0].reset();
        Common.removevalidation('FormMachine');
        Common.removeMessage('FormMachine');
        $('#MachineModal').show();
        Common.ajaxCall("GET", "/Settings/GetMachine", { MachineId: parseInt(MachineId) }, GetMachineNotNullSuccess, null);
    });

    $("#MachineSave").click(function (e) {
        if ($("#FormMachine").valid()) {
            var DataColorStatic = JSON.parse(JSON.stringify(jQuery('#FormMachine').serializeArray()));

            var objvalue = {};
            $.each(DataColorStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.MachineId = MachineId != 0 ? parseInt(MachineId) : null

            Common.ajaxCall("POST", "/Settings/InsertUpdateMachineInfo", JSON.stringify(objvalue), GetMachineInfoReload, null);
        }
    });

    $(document).on('click', '#MachineTable .btn-delete', async function () {
        MachineId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteMachineDetails", { MachineId: parseInt(MachineId) }, GetMachineInfoReload, null);
        }
    });

    $(document).on('click', '#MachineClose', function () {
        $('#MachineModal').hide();
    });

    /*=================================================================ProductCategory=====================================================================*/

    $(document).on('click', '#AddProductCategory', function () {
        $('#ProductCategorySave').val('Save').addClass('btn-success').removeClass('btn-update');
        $('#FormProductCategory')[0].reset();
        Common.removevalidation('FormProductCategory');
        Common.removeMessage('FormProductCategory');
        $('#ProductCategoryModal').show();
        ProductCategoryId = 0;
    });

    $(document).on('click', '#ProductCategoryTable .btn-edit', function () {
        ProductCategoryId = $(this).data('id');
        $('#ProductCategorySave').val('Update').addClass('btn-update').removeClass('btn-success');
        $('#FormProductCategory')[0].reset();
        Common.removevalidation('FormProductCategory');
        Common.removeMessage('FormProductCategory');
        $('#ProductCategoryModal').show();
        Common.ajaxCall("GET", "/Settings/GetProductCategory", { ProductCategoryId: parseInt(ProductCategoryId) }, GetProductCategoryNotNullSuccess, null);
    });

    $("#ProductCategorySave").click(function (e) {
        if ($("#FormProductCategory").valid()) {
            var DataProductCategoryStatic = JSON.parse(JSON.stringify(jQuery('#FormProductCategory').serializeArray()));

            var objvalue = {};
            $.each(DataProductCategoryStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.ProductCategoryId = ProductCategoryId != 0 ? parseInt(ProductCategoryId) : null;
            Common.ajaxCall("POST", "/Settings/InsertUpdateProductCategoryInfo", JSON.stringify(objvalue), GetProductCategoryInfoReload, null);
        }
    });

    $(document).on('click', '#ProductCategoryTable .btn-delete', async function () {
        ProductCategoryId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteProductCategoryDetails", { ProductCategoryId: parseInt(ProductCategoryId) }, GetProductCategoryInfoReload, null);
        }
    });

    $(document).on('click', '#ProductCategoryClose', function () {
        $('#ProductCategoryModal').hide();
    });

    /*=================================================================ProductSubCategory=====================================================================*/

    $(document).on('click', '#AddProductSubCategory', function () {
        $('#ProductSubCategorySave').val('Save').addClass('btn-success').removeClass('btn-update');
        $('#FormProductSubCategory')[0].reset();
        Common.removevalidation('FormProductSubCategory');
        Common.removeMessage('FormProductSubCategory');
        $('#ProductSubCategoryModal').show();
        ProductSubCategoryId = 0;
    });

    $(document).on('click', '#ProductSubCategoryTable .btn-edit', function () {
        ProductSubCategoryId = $(this).data('id');
        $('#ProductSubCategorySave').val('Update').addClass('btn-update').removeClass('btn-success');
        $('#FormProductSubCategory')[0].reset();
        Common.removevalidation('FormProductSubCategory');
        Common.removeMessage('FormProductSubCategory');
        $('#ProductSubCategoryModal').show();
        Common.ajaxCall("GET", "/Settings/GetProductSubCategory", { ProductSubCategoryId: parseInt(ProductSubCategoryId) }, GetProductSubCategoryNotNullSuccess, null);
    });

    $("#ProductSubCategorySave").click(function (e) {
        if ($("#FormProductSubCategory").valid()) {
            var DataProductSubCategoryStatic = JSON.parse(JSON.stringify(jQuery('#FormProductSubCategory').serializeArray()));

            var objvalue = {};
            $.each(DataProductSubCategoryStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.ProductSubCategoryId = ProductSubCategoryId != 0 ? parseInt(ProductSubCategoryId) : null;
            Common.ajaxCall("POST", "/Settings/InsertUpdateProductSubCategoryInfo", JSON.stringify(objvalue), GetProductSubCategoryInfoReload, null);
        }
    });

    $(document).on('click', '#ProductSubCategoryTable .btn-delete', async function () {
        ProductCategoryId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteProductSubCategoryDetails", { ProductSubCategoryId: parseInt(ProductSubCategoryId) }, GetProductSubCategoryInfoReload, null);
        }
    });

    $(document).on('click', '#ProductSubCategoryClose', function () {
        $('#ProductSubCategoryModal').hide();
    });

    $('#MinCapacity').on('input', function () {
        var quantityValue = parseFloat($(this).val().replace(/[^\d.]/g, ''));
        var totalWeightValue = parseFloat($('#MaxCapacity').val().replace(/[^\d.]/g, ''));

        if (!isNaN(quantityValue) && !isNaN(totalWeightValue)) {
            if (quantityValue > totalWeightValue) {
                Common.warning('Capacity cannot be greater than Max Capacity!');
                $(this).val(totalWeightValue);
            }
        }
    });
     

    /*=================================================================AutoGeneratePrefix=====================================================================*/

    $(document).on('click', '#AddAutoGeneratePrefix', function () {
        $('#AutoGeneratePrefixSave').val('Save').addClass('btn-success').removeClass('btn-update');
        $('#FormAutoGeneratePrefix')[0].reset();
        Common.removevalidation('FormAutoGeneratePrefix');
        Common.removeMessage('FormAutoGeneratePrefix');
        $('#AutoGeneratePrefixModal').show();
        AutoGeneratePrefixId = 0;
    });

    $(document).on('click', '#AutoGeneratePrefixTable .btn-edit', function () {
        AutoGeneratePrefixId = $(this).data('id');
        $('#AutoGeneratePrefixSave').val('Update').addClass('btn-update').removeClass('btn-success');
        $('#FormAutoGeneratePrefix')[0].reset();
        Common.removevalidation('FormAutoGeneratePrefix');
        Common.removeMessage('FormAutoGeneratePrefix');
        $('#AutoGeneratePrefixModal').show(); 
        Common.ajaxCall("GET", "/Settings/GetAutoGeneratePrefixDetails", { AutoGeneratePrefixId: parseInt(AutoGeneratePrefixId), PlantId: parseInt(PlantMappingId) }, GetAutoGeneratePrefixNotNullSuccess, null);
    });

    $("#AutoGeneratePrefixSave").click(function (e) {
        if ($("#FormAutoGeneratePrefix").valid()) {
            var DataAutoGeneratePrefixStatic = JSON.parse(JSON.stringify(jQuery('#FormAutoGeneratePrefix').serializeArray()));

            var objvalue = {};
            $.each(DataAutoGeneratePrefixStatic, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.AutoGeneratePrefixId = AutoGeneratePrefixId != 0 ? parseInt(AutoGeneratePrefixId) : null;
            objvalue.PlantId = parseInt(PlantMappingId);

            Common.ajaxCall("POST", "/Settings/InsertUpdateAutoGeneratePrefixInfo", JSON.stringify(objvalue), GetAutoGeneratePrefixInfoReload, null);
        }
    });

    $(document).on('click', '#AutoGeneratePrefixTable .btn-delete', async function () {
        AutoGeneratePrefixId = $(this).data('id');
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteAutoGeneratePrefixDetails", { AutoGeneratePrefixId: parseInt(AutoGeneratePrefixId) }, GetAutoGeneratePrefixInfoReload, null);
        }
    });

    $(document).on('click', '#AutoGeneratePrefixClose', function () {
        $('#AutoGeneratePrefixModal').hide();
    });
});

/*=================================================================Common=====================================================================*/

function MasterInfoGetNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
    }
}

function MasterInfoGetReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#MasterDataTwoParaModal').hide();
        Common.removevalidation('FormMasterDataTwoPara');
        Common.removeMessage('FormMasterDataTwoPara');
        masterInfoId = 0;
        var data = JSON.parse(response.data);
        var ModuleName = data[0][0].ModuleName;
        Common.ajaxCall("GET", "/Settings/GetMasterInfo", { MasterInfoId: null, ModuleName: ModuleName }, MasterInfoGetReloadSuccess, null);
    }
}

function MasterInfoGetReloadSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        var ModuleNameId = data[1][0].ModuleName + 'Id';
        var ModuleNameTable = data[1][0].ModuleName + 'Table';

        var columns = Common.bindColumn(data[0], [ModuleNameId]);
        bindTableSettings(ModuleNameTable, data[0], columns, -1, ModuleNameId, '271px', true);
        $('#' + ModuleNameTable + '_wrapper, #' + ModuleNameTable + ', .dataTables_scrollHeadInner, .tableResponsive').css('width', '100%');
    }
}

async function InstillationMasterDataTwoPara() {
    for (let module of moduleOrder) {
        try {
            let response = await getMasterData(module);
            MasterInfoSuccess(response);
        } catch (err) {
            console.error("❌ Error loading:", module, err);
        }
    }
}

function MasterInfoSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        var ModuleName = data[1][0].ModuleName;
        var ModuleNameId = data[1][0].ModuleName + 'Id';
        var ModuleNameTable = data[1][0].ModuleName + 'Table';
        DynamicTableCardCreated(ModuleName);

        var columns = Common.bindColumn(data[0], [ModuleNameId]);
        bindTableSettings(ModuleNameTable, data[0], columns, -1, ModuleNameId, '271px', true);

        $('#' + ModuleNameTable + '_wrapper, #' + ModuleNameTable + ', .dataTables_scrollHeadInner, .tableResponsive').css('width', '100%');
    }
}


/*=================================================================Color=====================================================================*/

function GetColorInfoReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#ColorModal').hide();
        Common.removevalidation('FormColor');
        Common.removeMessage('FormColor');
        ColorId = 0;
        Common.ajaxCall("GET", "/Settings/GetColor", { ColorId: null }, ColorSuccess, null);
    }
}

function GetColorNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
    }
}

function ColorSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        var columns = Common.bindColumn(data[0], ['ColorId']);
        bindTableParaDifSettings('ColorTable', data[0], columns, -1, 'ColorId', '271px', true);
    }
}

/*=================================================================Machine=====================================================================*/

function GetMachineInfoReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#MachineModal').hide();
        Common.removevalidation('FormMachine');
        Common.removeMessage('FormMachine');
        MachineId = 0;
        Common.ajaxCall("GET", "/Settings/GetMachine", { MachineId: null }, MachineSuccess, null);
    }
}

function GetMachineNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
    }
}

function MachineSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        var columns = Common.bindColumn(data[0], ['MachineId']);
        bindTableParaDifSettings('MachineTable', data[0], columns, -1, 'MachineId', '271px', true);
    }
}

/*=================================================================ProductCategory=====================================================================*/

function GetProductCategoryInfoReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#ProductCategoryModal').hide();
        Common.removevalidation('FormProductCategory');
        Common.removeMessage('FormProductCategory');
        ProductSubCategoryId = 0;
        Common.ajaxCall("GET", "/Settings/GetProductCategory", { ProductCategoryId: null }, ProductCategorySuccess, null);
    }
}

function GetProductCategoryNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
    }
}

function ProductCategorySuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        var columns = Common.bindColumn(data[0], ['ProductCategoryId']);
        bindTableParaDifSettings('ProductCategoryTable', data[0], columns, -1, 'ProductCategoryId', '271px', true);
    }
}

/*=================================================================ProductSubCategory=====================================================================*/

function GetProductSubCategoryInfoReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#ProductSubCategoryModal').hide();
        Common.removevalidation('FormProductSubCategory');
        Common.removeMessage('FormProductSubCategory');
        ProductSubCategoryId = 0;
        Common.ajaxCall("GET", "/Settings/GetProductSubCategory", { ProductSubCategoryId: null }, ProductSubCategorySuccess, null);
    }
}

function GetProductSubCategoryNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
    }
}

function ProductSubCategorySuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        var columns = Common.bindColumn(data[0], ['ProductSubCategoryId']);
        bindTableParaDifSettings('ProductSubCategoryTable', data[0], columns, -1, 'ProductSubCategoryId', '271px', true);
    }
}


/*=================================================================AutoGeneratePrefix=====================================================================*/

function GetAutoGeneratePrefixInfoReload(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $('#AutoGeneratePrefixModal').hide();
        Common.removevalidation('FormAutoGeneratePrefix');
        Common.removeMessage('FormAutoGeneratePrefix');
        AutoGeneratePrefixId = 0;
        Common.ajaxCall("GET", "/Settings/GetAutoGeneratePrefixDetails", { AutoGeneratePrefixId: null, PlantId: parseInt(PlantMappingId) }, AutoGeneratePrefixSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}

function GetAutoGeneratePrefixNotNullSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindData(data[0]);
    }
}

function AutoGeneratePrefixSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        var columns = Common.bindColumn(data[0], ['AutoGeneratePrefixId']);
        bindTableParaDifSettings('AutoGeneratePrefixTable', data[0], columns, -1, 'AutoGeneratePrefixId', '271px', true);
    }
}

function DynamicTableCardCreated(ModuleName) {
    var html = `
        <div class="col-md-6">
		    <div class="card m-b-30">
			    <div class="card-header">
				    <h4 class="card-title float-left">${ModuleName} Info</h4>
				    <div class="Date-SearchColumn justify-content-end">
					    <div class="d-flex">
						    <div class="searchbar mt-1">
							    <input type="text" class="searchbar__input" name="q" id="tableFilter${ModuleName}Table" placeholder="Search">
							    <button type="submit" class="searchbar__button">
								    <img src="/assets/commonimages/search.svg" />
							    </button>
						    </div>
						    <div class="datapiker ml-2 mt-1" style="position: relative;margin-top:5px;">
							    <div class="add-imp-exp-btn">
								    <div class="exportsiconpop">
									    <span class="pop">
										    <a id="Add${ModuleName}" title="Add ${ModuleName}" class="CommonAddBtn">
											    <img src="/assets/commonimages/addicon.svg" style="height: 25px; width: 25px;" />
										    </a>
									    </span>
								    </div>
							    </div>
						    </div>
					    </div>
				    </div>
			    </div>

			    <div class="card-body">
				    <div class="table-responsive">
					    <table class="table table-rounded dataTable data-table table-striped tableResponsive CommonTable" id="${ModuleName}Table"></table>
				    </div>
			    </div>
		    </div>
	    </div>
    `;
    $('.masterpage-box').append(html);
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


function bindTableParaDifSettings(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction) {
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