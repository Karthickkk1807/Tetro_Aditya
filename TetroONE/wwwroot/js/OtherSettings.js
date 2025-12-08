var PlantMappingId = parseInt(localStorage.getItem('UserFranchiseMappingId'));
var masterInfoId = 0;

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

//const moduleOrder = ["EmployeeType", "Department", "UserGroup", "UserType", "PayType", "ClaimType", "EmployeeStatus", "LeaveStatus", "DocType"];
const moduleOrder = ["Department", "ClaimType", "EmployeeStatus", "LeaveStatus", "DocType", "Unit", "ProductCategory"];

$(document).ready(function () {
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
        $('#MasterDataTwoParaModal').show();
        masterInfoId = 0;
    });

    $(document).on('click', '.btn-edit', function () {
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

    $(document).on('click', '.btn-delete', async function () {
        masterInfoId = $(this).data('id'); var card = $(this).closest('.card');

        var card = $(this).closest('.card');
        var TitleTextLabel = card.find('.card-header .card-title').text().trim().split(' ')[0];
        var response = await Common.askConfirmation();
        if (response == true) {
            Common.ajaxCall("GET", "/Settings/DeleteMasterInfo", { MasterInfoId: parseInt(masterInfoId), ModuleName: TitleTextLabel }, MasterInfoGetReload, null);
        }
    }); 
});

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
					    <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="${ModuleName}Table"></table>
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