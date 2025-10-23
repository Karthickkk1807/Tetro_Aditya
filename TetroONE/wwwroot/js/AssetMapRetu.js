var titleForHeaderAssetMapRetTab = "Asset Mapping";

$(document).ready(function () {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    $('#decrement-month-btn2').click(function () {
        let currentText = $('#dateDisplay2').text().trim();
        let [currentMonth, currentYear] = currentText.split(" ");
        let monthIndex = months.indexOf(currentMonth);

        if (monthIndex === -1) return;

        monthIndex--;
        if (monthIndex < 0) {
            monthIndex = 11;
            currentYear = parseInt(currentYear) - 1;
        }

        let newMonth = months[monthIndex];
        $('#dateDisplay2').text(`${newMonth} ${currentYear}`);
    });

    $('#increment-month-btn2').click(function () {
        let currentText = $('#dateDisplay2').text().trim();
        let [currentMonth, currentYear] = currentText.split(" ");
        let monthIndex = months.indexOf(currentMonth);

        if (monthIndex === -1) return;

        monthIndex++;
        if (monthIndex > 11) {
            monthIndex = 0;
            currentYear = parseInt(currentYear) + 1;
        }

        let newMonth = months[monthIndex];
        $('#dateDisplay2').text(`${newMonth} ${currentYear}`);
    });

    const assetMapRetuData = [
        {
            AssetMappingNo: "IGS-AST-MAP-0001",
            Date: "07-10-2025",
            Type: "ToDesk",
            Branch: "Sennkarathaaan Food And Beverages - Chennai",
            Hall: "CHE-First Floor",
            Department: "Admin",
            AssetNo: "-",
            NoOfWorkDesk: 1,
            NoOfAsset: 1
        },
        {
            AssetMappingNo: "IGS-AST-MAP-0002",
            Date: "07-10-2025",
            Type: "ToAsset",
            Branch: "Sennkarathaaan Food And Beverages - Ganapathy",
            Hall: "CHE-Second Floor",
            Department: "IT",
            AssetNo: "CH-001",
            NoOfWorkDesk: 2,
            NoOfAsset: 4
        },
        {
            AssetMappingNo: "IGS-AST-MAP-0003",
            Date: "07-10-2025",
            Type: "ToDesk",
            Branch: "Sennkarathaaan Food And Beverages - Sivananda Colony",
            Hall: "CHE-Third Floor",
            Department: "HR",
            AssetNo: "DSK-003",
            NoOfWorkDesk: 3,
            NoOfAsset: 3
        },
        {
            AssetMappingNo: "IGS-AST-MAP-0004",
            Date: "07-10-2025",
            Type: "ToAsset",
            Branch: "Sennkarathaaan Food And Beverages - Suguna",
            Hall: "CHE-First Floor",
            Department: "Finance",
            AssetNo: "CH-004",
            NoOfWorkDesk: 2,
            NoOfAsset: 2
        },
        {
            AssetMappingNo: "IGS-AST-MAP-0005",
            Date: "07-10-2025",
            Type: "ToDesk",
            Branch: "Sennkarathaaan Food And Beverages - Ganapathy",
            Hall: "CHE-Second Floor",
            Department: "Operations",
            AssetNo: "DSK-005",
            NoOfWorkDesk: 4,
            NoOfAsset: 4
        },
        {
            AssetMappingNo: "IGS-AST-MAP-0006",
            Date: "07-10-2025",
            Type: "ToAsset",
            Branch: "Sennkarathaaan Food And Beverages - Sivananda Colony",
            Hall: "CHE-Ground Floor",
            Department: "Support",
            AssetNo: "CH-006",
            NoOfWorkDesk: 3,
            NoOfAsset: 3
        },
        {
            AssetMappingNo: "IGS-AST-MAP-0007",
            Date: "07-10-2025",
            Type: "ToDesk",
            Branch: "Sennkarathaaan Food And Beverages - Chennai",
            Hall: "CHE-Third Floor",
            Department: "Admin",
            AssetNo: "DSK-007",
            NoOfWorkDesk: 2,
            NoOfAsset: 2
        }
    ];

    const assetMapRetuColumns = [
        { data: 'AssetMappingNo', name: 'AssetMappingNo', title: 'Asset Mapping No' },
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'Type', name: 'Type', title: 'Type' },
        { data: 'Branch', name: 'Branch', title: 'Branch' },
        { data: 'Hall', name: 'Hall', title: 'Hall' },
        { data: 'Department', name: 'Department', title: 'Department' },
        { data: 'AssetNo', name: 'AssetNo', title: 'Asset No' },
        { data: 'NoOfWorkDesk', name: 'NoOfWorkDesk', title: 'No Of Work Desk' },
        { data: 'NoOfAsset', name: 'NoOfAsset', title: 'No Of Asset' }
    ];

    $('#AssetMapRetuTableDynamic').empty('');
    var html = `<div class="table-responsive">
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="assetMapRetuTable"></table>
            </div>`;
    $('#AssetMapRetuTableDynamic').append(html);
    bindTable('assetMapRetuTable', assetMapRetuData, assetMapRetuColumns, 9, 'AssetMappingNo', '350px', true, { update: true, delete: true });


    $(document).on('click', '#AddAssetMapRetu', function () {
        if (titleForHeaderAssetMapRetTab == "Asset Mapping") {
            $('#MappingModal').show();
            $('#MapHeader').text("Add Asset Mapping");
            $('#SaveMapping').val('Save').removeClass('btn-update').addClass('btn-success');
            $('#HideBulkInsertDiv').show();
            $('.AssetNoMappingDiv').hide();
            $('.HallDiv').hide();
            $('.DepartmentDiv').hide();
            $('.HideNoofWorkDeskDiv').hide();
            $('.DynamicButtonDiv').hide();
            $('#MainDynamicAssetMapping').empty();
            $('#MainDynamicAssetMapping .DynamicAssetMapping').remove();
            $('#AssetMappingId').val('ASSET_MAPP-01');
            $('#DateMapping').val('2025-10-09');
            $('#TypeMapping').val('');
            $('#NoOfAsset').val('');
            $('#NoofWorkDesk').val('');
            $('#MainDynamicAssetMapping').append(`<tr><td valign="top" colspan="6" class="dataTables_empty"><div class="d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Fill the Above Required Fields</div></td></tr>`);
            $('#SaveMapping').val('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        } else {
            $('#ReturnModal').show();
            $('#ReturnHeader').text("Add Asset Return");
            $('#AssetReturnAutoId').val("ASSET_RETURN-01");
            $('#ReturnDate').val('2025-10-09');
            $('#TypeReturn').val('').trigger('change');
            $('#SaveReturn').val('Save').removeClass('btn btn-primary m-r-20 text-white').addClass('btn btn-success m-r-20 text-white');
        }
    });


    $(document).on('change', '#TypeMapping', function () {
        var $thisval = $(this).val();
        var BranchMapId = parseInt($('#BranchMapping').val());

        $('.DynamicButtonDiv').hide();

        $('#FormAssestMapping #DepartmentMapping').val('').trigger('change');
        $('#FormAssestMapping #HallMapping').val('').trigger('change');

        $('#FormAssestMapping #AssetNoMapping').val('').trigger('change');

        $('#MainDynamicAssetMapping').empty();
        $('#MainDynamicAssetMapping .DynamicAssetMapping').remove();
        $('#MainDynamicAssetMapping').append(`<tr><td valign="top" colspan="6" class="dataTables_empty"><div class="d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Fill the Above Required Fields</div></td></tr>`);

        if ($thisval != null && $thisval == 2 && $thisval != "") {
            $('.FirstThMapping').hide();
            $('.AssetNoMappingDiv').show();
            $('.HideNoofWorkDeskDiv').hide();
            $('.HallDiv').hide();
            $('.DepartmentDiv').hide();

        } else if ($thisval != null && $thisval == 1 && $thisval != "") {
            $('.FirstThMapping').show();
            $('.AssetNoMappingDiv').hide();
            $('.HideNoofWorkDeskDiv').show()
            $('.HallDiv').show();
            $('.DepartmentDiv').show();
        }
        else {
            $('.FirstThMapping').show();
            $('.AssetNoMappingDiv').hide();
            $('.HideNoofWorkDeskDiv').hide();
            $('.HallDiv').hide();
            $('.DepartmentDiv').hide();
        }
    });

    $(document).on('change', '#AssetNoMapping', function () {
        var $thisVal = $(this).val();
        var $TypeVal = $('#TypeMapping').val();
        if ($thisVal != null && $thisVal != "") {
            $('#MainDynamicAssetMapping').empty();
            $('.DynamicButtonDiv').show();
            DynamicToAsset();
        }
        else {
            $('.DynamicButtonDiv').hide();
            $('#MainDynamicAssetMapping').empty();
            $('#MainDynamicAssetMapping .DynamicAssetMapping').remove();
            $('#MainDynamicAssetMapping').append(`<tr><td valign="top" colspan="6" class="dataTables_empty"><div class="d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Fill the Above Required Fields</div></td></tr>`);
        }
    });

    $(document).on('change', '.AssetNoAsset', function () {
        const selectedId = parseInt($(this).val());
        const row = $(this).closest('tr');

        const asset = AssetNoAssetMapRetu[0].find(a => a.AssetId === selectedId);

        if (asset) {
            row.find('.AssetNameMapping').val(asset.AssetName);
            row.find('.CategoryMapping').val(asset.Category);
            row.find('.SubCategoryMapping').val(asset.SubCategory);
        } else {
            row.find('.AssetNameMapping').val('');
            row.find('.CategoryMapping').val('');
            row.find('.SubCategoryMapping').val('');
        }
    });

    $(document).on('click', '.DynrowRemove', function () {
        const rowCount = $('.DynamicAssetMapping').length;

        if (rowCount > 1) {
            $(this).closest('tr').remove();
            $('#NoOfAsset').val($('.DynamicAssetMapping').length);
        }
    });

    $(document).on('click', '#SaveMapping', function () {
        if ($('#MapHeader').text() == "Add Asset Mapping") {
            Common.successMsg("Asset Mapping Added Successfully.");
        } else {
            Common.successMsg("Updated Asset Mapping Successfully.");
        }
        $('#MappingModal').hide();
    });

    $(document).on('click', '#SaveReturn', function () {
        if ($('#ReturnHeader').text() == "Add Asset Return") {
            Common.successMsg("Asset Return Added Successfully.");
        } else {
            Common.successMsg("Updated Asset Return Successfully.");
        }
        $('#ReturnModal').hide();
    });

    $(document).on('click', '.navbar-tab', function () {

        titleForHeaderAssetMapRetTab = $(this).text().trim();
        $('.navbar-tab').removeClass('active');
        $(this).each(function () {
            if ($(this).text().trim() === titleForHeaderAssetMapRetTab) {
                $(this).addClass('active');
            }
        });
    });

    $(document).on('change', '#DepartmentMapping', function () {
        var $this = $(this).val();
        var $HallMapping = $('#HallMapping').val();
        var $BranchMapping = $('#BranchMapping').val();

        if ($this !== "" && $HallMapping !== "" && $BranchMapping !== "") {
            $('.HidingDropDown').show();
            $('#MainDynamicAssetMapping').empty();
            $('#NoofWorkDesk').val("");
            $('#NoOfAsset').val("");

            const data = [
                [
                    { DepartmentDeskMappingId: 101, DeskNo: "WD-001" },
                    { DepartmentDeskMappingId: 102, DeskNo: "WD-002" },
                    { DepartmentDeskMappingId: 103, DeskNo: "WD-003" },
                    { DepartmentDeskMappingId: 104, DeskNo: "WD-004" }
                ]
            ];

            if (data[0] && data[0].length > 0 && data[0][0].DeskNo != null) {
                let numberAssetMapping = 0;

                $.each(data[0], function (index, value) {
                    numberAssetMapping++;

                    let AssetNoAssetSelectOptions = "";
                    const defaultOption = '<option value="">--Select--</option>';

                    const AssetNoAsset = [[
                        { AssetId: 1, AssetNo: "AST-001" },
                        { AssetId: 2, AssetNo: "AST-002" },
                        { AssetId: 3, AssetNo: "AST-003" },
                        { AssetId: 4, AssetNo: "AST-004" }
                    ]];

                    if (AssetNoAsset && AssetNoAsset[0].length > 0) {
                        AssetNoAssetSelectOptions = AssetNoAsset[0].map(function (AssetId) {
                            return `<option value="${AssetId.AssetId}">${AssetId.AssetNo}</option>`;
                        }).join('');
                    }

                    let html = `
                    <tr class="DynamicAssetMapping">
                        <td>
                            <label class="d-none AssetMappingId"></label>
                            <label class="d-none WorkDeskId">${value.DepartmentDeskMappingId}</label>
                            <input type="text" id="WorkDeskNo${numberAssetMapping}" name="WorkDeskNo${numberAssetMapping}" 
                                class="form-control WorkDeskNoMapping" value="${value.DeskNo}" placeholder="WorkDeskNo" disabled required>
                        </td>
                        <td>
                            <select class="form-control AssetNoAsset" id="AssetNo${numberAssetMapping}" name="AssetNo${numberAssetMapping}" required>
                                ${defaultOption}${AssetNoAssetSelectOptions}
                            </select>
                        </td>
                        <td>
                            <label class="d-none AssetId"></label>
                            <input type="text" id="AssetName${numberAssetMapping}" name="AssetName${numberAssetMapping}" 
                                class="form-control AssetNameMapping" placeholder="Asset Name" disabled required>
                        </td>
                        <td>
                            <input type="text" id="Category${numberAssetMapping}" name="Category${numberAssetMapping}" 
                                class="form-control CategoryMapping" placeholder="Category" disabled required>
                        </td>
                        <td>
                            <input type="text" id="SubCategory${numberAssetMapping}" name="SubCategory${numberAssetMapping}" 
                                class="form-control SubCategoryMapping" placeholder="SubCategory" disabled required>
                        </td>
                        <td class="d-flex justify-content-center" style="border: none;">
                            <button id="AddMapping" class="btn AddStockBtn" type="button">
                                <i class="fas fa-plus" id="AddButton"></i>
                            </button>
                            <button id="RemoveButton" class="btn btn-danger DynrowRemove text-white" type="button" 
                                style="margin-top:0px;height:28px;width:28px;">
                                <i class="fas fa-minus"></i>
                            </button>
                        </td>
                    </tr>
                `;
                    $('#MainDynamicAssetMapping').append(html);
                });

                const count = data[0].length;
                $('#NoofWorkDesk').val(count);
                $('#NoOfAsset').val(count);
            } else {
                $('#NoofWorkDesk').val("0");
                $('#NoOfAsset').val("0");
                $('#MainDynamicAssetMapping').empty().append(`
                <tr>
                    <td valign="top" colspan="6" class="dataTables_empty">
                        <div class="d-flex justify-content-center">
                            <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                            Fill the Above Required Fields
                        </div>
                    </td>
                </tr>
            `);
            }
        } else {
            $('#NoofWorkDesk').val("");
            $('#NoOfAsset').val("");
            $('#MainDynamicAssetMapping').empty().append(`
            <tr>
                <td valign="top" colspan="6" class="dataTables_empty">
                    <div class="d-flex justify-content-center">
                        <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                        Fill the Above Required Fields
                    </div>
                </td>
            </tr>
        `);
        }
    });

    $(document).on('click', '.AddStockBtn', function () {
        let numberAssetMapping = Math.random().toString(36).substring(2);

        const AssetNoAsset = [[
            { AssetId: 1, AssetNo: "AST-001" },
            { AssetId: 2, AssetNo: "AST-002" },
            { AssetId: 3, AssetNo: "AST-003" },
            { AssetId: 4, AssetNo: "AST-004" }
        ]];

        let AssetNoAssetSelectOptions = "";
        let defaultOption = '<option value="">--Select--</option>';

        AssetNoAssetSelectOptions = AssetNoAsset[0].map(function (AssetId) {
            return `<option value="${AssetId.AssetId}">${AssetId.AssetNo}</option>`;
        }).join('');

        let html = `
        <tr class="DynamicAssetMappingSecond">
            <td></td>
            <td>
                <select class="form-control AssetNoAsset" id="AssetNo${numberAssetMapping}" name="AssetNo${numberAssetMapping}" required>
                    ${defaultOption}${AssetNoAssetSelectOptions}
                </select>
            </td>
            <td>
                <label class="d-none AssetId"></label>
                <input type="text" id="AssetName${numberAssetMapping}" name="AssetName${numberAssetMapping}" 
                       class="form-control AssetNameMapping" placeholder="Asset Name" disabled required>
            </td>
            <td>
                <input type="text" id="Category${numberAssetMapping}" name="Category${numberAssetMapping}" 
                       class="form-control CategoryMapping" placeholder="Category" disabled required>
            </td>
            <td>
                <input type="text" id="SubCategory${numberAssetMapping}" name="SubCategory${numberAssetMapping}" 
                       class="form-control SubCategoryMapping" placeholder="SubCategory" disabled required>
            </td>
            <td class="d-flex justify-content-center">
                <button class="btn btn-danger DynrowRemove text-white" type="button" 
                        style="margin-top:0px;height:28px;width:28px;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

        let parentRow = $(this).closest('tr');
        let nextRows = parentRow.nextAll();
        let lastChildRow = null;

        nextRows.each(function () {
            if ($(this).hasClass('DynamicAssetMappingSecond')) {
                lastChildRow = $(this);
            } else {
                return false;
            }
        });

        if (lastChildRow) {
            lastChildRow.after(html);
        } else {
            parentRow.after(html);
        }
        let rowCount = $('.DynamicAssetMapping').length + $('.DynamicAssetMappingSecond').length;
        $('#NoOfAsset').val(rowCount);
    });

    $(document).on('click', '.btn-edit', function () {
        if (titleForHeaderAssetMapRetTab == "Asset Mapping") {
            $('#SaveMapping').val('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
            $('#MappingModal').show();
            $('#MapHeader').text("Edit Asset Mapping");
            $('#MainDynamicAssetMapping').empty();
            $('#NoofWorkDesk').val("");
            $('#NoOfAsset').val("");
            $('#TypeMapping').val('2').trigger('change');
            $('#AssetNoMapping').val('1');
            $('#MainDynamicAssetMapping').empty();
            $('#AssetMappingId').val('ASSET_MAPP-01');
            $('#DateMapping').val('2025-10-09');
            const numberAssetMapping = Math.random().toString(36).substring(2);
            let AssetNoAssetSelectOptions = "";
            const defaultOption = '<option value="">--Select--</option>';

            if (AssetNoAssetMapRetu && AssetNoAssetMapRetu[0].length > 0) {
                AssetNoAssetSelectOptions = AssetNoAssetMapRetu[0].map(function (asset) {
                    return `<option value="${asset.AssetId}">${asset.AssetNo}</option>`;
                }).join('');
            }

            const html = `
            <tr class="DynamicAssetMapping">
                <td>
                    <label class="d-none AssetMappingId"></label>
                    <select class="form-control AssetNoAsset" id="AssetNo${numberAssetMapping}" name="AssetNo${numberAssetMapping}" required>
                        ${defaultOption}${AssetNoAssetSelectOptions}
                    </select>
                </td>
                <td>
                    <label class="d-none AssetId"></label>
                    <input type="text" id="AssetName${numberAssetMapping}" name="AssetName${numberAssetMapping}" 
                           class="form-control AssetNameMapping" placeholder="Asset Name" disabled required>
                </td>
                <td>
                    <input type="text" id="Category${numberAssetMapping}" name="Category${numberAssetMapping}" 
                           class="form-control CategoryMapping" placeholder="Category" disabled required>
                </td>
                <td>
                    <input type="text" id="SubCategory${numberAssetMapping}" name="SubCategory${numberAssetMapping}" 
                           class="form-control SubCategoryMapping" placeholder="SubCategory" disabled required>
                </td>
                <td class="d-flex justify-content-center" style="border: none;">
                    <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height:28px;width:28px;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
            `;

            $('#MainDynamicAssetMapping').append(html);
            $('.AssetNoAsset').val('1').trigger('change');
            $('#NoOfAsset').val(1);
        }
        else {
            $('#SaveReturn').val('Update').removeClass('btn btn-success m-r-20 text-white').addClass('btn btn-primary m-r-20 text-white');
            $('#ReturnModal').show();
            $('#ReturnHeader').text("Edit Asset Return");
            $('#AssetReturnAutoId').val("ASSET_RETURN-01");
            $('#ReturnDate').val('2025-10-09');
            $('#TypeReturn').val('1').trigger('change');
            $('#ReturnHall').val('11').trigger('change');
            $('#ReturnDepartment').val('14').trigger('change');
            $('#ReturnWorkDeskNo').val('107').trigger('change');
        }
    });


    $(document).on('click', '#AssetMappingClose', function () {
        $('#MappingModal').hide();
    });

    $(document).on('click', '#AssetReturnClose', function () {
        $('#ReturnModal').hide();
    });

    $(document).on('change', '#TypeReturn', function () {
        var $thisVal = $(this).val();

        $('.HidingDropDown').hide();
        //$('#FormAssestReturn #ReturnBranch').val('').trigger('change'); 
        $('#MainDynamicAssestReturn').empty();
        $('#MainDynamicAssestReturn .DynamicAssestReturn').remove();
        $('#MainDynamicAssestReturn').append(`<tr><td valign="top" colspan="5" class="dataTables_empty"><div class="d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Fill the Above Required Fields</div></td></tr>`);
        $('#ReturnDepartment').val('');
        $('#ReturnHall').val('');

        if ($thisVal != null && $thisVal == 2 && $thisVal != "") {
            $('#HiddingDivReturnHall').hide();
            $('.HiddingDivReturnDepartment').hide();
            $('.AssetNoReturnDiv').show();
        }
        else if ($thisVal != null && $thisVal == 1 && $thisVal != "") {
            $('#HiddingDivReturnHall').show();
            $('.HiddingDivReturnDepartment').show();
            $('.AssetNoReturnDiv').hide();
        }
        else {
            $('#HiddingDivReturnHall').hide();
            $('.HiddingDivReturnDepartment').hide();
            $('.AssetNoReturnDiv').hide();
        }
    });

    $(document).on('change', '#ReturnHall', function () {
        var $this = $(this).val();
        if ($this == "") {
            $('.HidingDropDown').hide();
            $('#MainDynamicAssestReturn').empty();
            $('#MainDynamicAssestReturn .DynamicAssestReturn').remove();
            $('#MainDynamicAssestReturn').append(`<tr><td valign="top" colspan="5" class="dataTables_empty"><div class="d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Fill the Above Required Fields</div></td></tr>`);
        }
    });

    $(document).on('change', '#ReturnDepartment', function () {
        var $this = $(this).val();
        var $ReturnHall = $('#ReturnHall').val();
        var $ReturnBranch = $('#ReturnBranch').val();

        if ($this !== "" && $ReturnHall !== "" && $ReturnBranch !== "") {
            $('.HidingDropDown').show();
            $('#MainDynamicAssestReturn').empty();
            $('#MainDynamicAssestReturn .DynamicAssestReturn').remove();
            $('#MainDynamicAssestReturn').append(`<tr><td valign="top" colspan="5" class="dataTables_empty"><div class="d-flex justify-content-center"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">Fill the Above Required Fields</div></td></tr>`);
        } else {
            $('.HidingDropDown').hide();
        }
    });

    $(document).on('change', '#ReturnWorkDeskNo', function () {
        const data = [[
            {
                AssetId: 1,
                AssetNo: "AST-0001",
                AssetName: "Office Desk",
                AssetCategoryName: "Furniture",
                AssetSubCategoryName: "Work Desk"
            },
            {
                AssetId: 2,
                AssetNo: "AST-0002",
                AssetName: "Ergonomic Chair",
                AssetCategoryName: "Furniture",
                AssetSubCategoryName: "Chair"
            }
        ]];
        var selectedDesk = $(this).val();

        // Clear existing rows
        $('#MainDynamicAssestReturn').empty();
        $('#MainDynamicAssestReturn .DynamicAssestReturn').remove();

        // Check if a desk is selected
        if (selectedDesk !== "") {
            if (data && data[0] && data[0].length > 0 && data[0][0].AssetId != null) {
                let numberAssetReturn = 0;

                $.each(data[0], function (index, value) {
                    numberAssetReturn++;

                    const html = `
                    <tr class="DynamicAssestReturn">
                        <td>
                            <label class="d-none DeskAssetMappingIdReturn"></label>
                            <label class="d-none AssetId">${value.AssetId}</label>
                            <input type="text" id="AssetNo${numberAssetReturn}" name="AssetNo${numberAssetReturn}" 
                                   class="form-control" value="${value.AssetNo}" placeholder="Asset No" disabled required>
                        </td>
                        <td>
                            <input type="text" id="AssetName${numberAssetReturn}" name="AssetName${numberAssetReturn}" 
                                   class="form-control" value="${value.AssetName}" placeholder="Asset Name" disabled required>
                        </td>
                        <td>
                            <input type="text" id="Category${numberAssetReturn}" name="Category${numberAssetReturn}" 
                                   class="form-control" value="${value.AssetCategoryName}" placeholder="Category" disabled required>
                        </td>
                        <td>
                            <input type="text" id="SubCategory${numberAssetReturn}" name="SubCategory${numberAssetReturn}" 
                                   class="form-control" value="${value.AssetSubCategoryName}" placeholder="SubCategory" disabled required>
                        </td>
                        <td class="d-flex justify-content-center">
                            <button class="btn btn-danger DynrowRemove text-white" type="button" 
                                    style="margin-top:0px;height:28px;width:28px;">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
                    $('#MainDynamicAssestReturn').append(html);
                });
            } else {
                // If no data found
                $('#MainDynamicAssestReturn').append(`
                <tr>
                    <td valign="top" colspan="5" class="dataTables_empty">
                        <div class="d-flex justify-content-center">
                            <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                            No asset data found for selected desk.
                        </div>
                    </td>
                </tr>
            `);
            }
        } else {
            // If no desk selected
            $('#MainDynamicAssestReturn').append(`
            <tr>
                <td valign="top" colspan="5" class="dataTables_empty">
                    <div class="d-flex justify-content-center">
                        <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                        Fill the Above Required Fields
                    </div>
                </td>
            </tr>
        `);
        }
    });
    $(document).on('change', '#AssetNoReturn', function () {
        var selected = $(this).val();

        const dataRetunAsset = [[
            {
                AssetId: 1,
                AssetNo: "AST-0001",
                AssetName: "Office Desk",
                AssetCategoryName: "Furniture",
                AssetSubCategoryName: "Work Desk"
            },
            {
                AssetId: 2,
                AssetNo: "AST-0002",
                AssetName: "Ergonomic Chair",
                AssetCategoryName: "Furniture",
                AssetSubCategoryName: "Chair"
            }
        ]];

        if (selected !== "") {
            // Call the reusable hotcode function
            bindAssetReturnRows(dataRetunAsset[0]); // Replace `data[0]` with dynamic data if needed
        } else {
            $('#MainDynamicAssestReturn').empty().append(`
            <tr>
                <td valign="top" colspan="5" class="dataTables_empty">
                    <div class="d-flex justify-content-center">
                        <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                        Fill the Above Required Fields
                    </div>
                </td>
            </tr>
        `);
        }
    });
});

function bindAssetReturnRows(dataRetunAsset) {
    $('#MainDynamicAssestReturn').empty();
    $('#MainDynamicAssestReturn .DynamicAssestReturn').remove();

    if (dataRetunAsset && dataRetunAsset.length > 0 && dataRetunAsset[0].AssetId != null) {
        let numberAssetReturn = 0;

        $.each(dataRetunAsset, function (index, value) {
            numberAssetReturn++;

            const html = `
                <tr class="DynamicAssestReturn">
                    <td>
                        <label class="d-none DeskAssetMappingIdReturn"></label>
                        <label class="d-none AssetId">${value.AssetId}</label>
                        <input type="text" id="AssetNo${numberAssetReturn}" name="AssetNo${numberAssetReturn}" 
                            class="form-control" value="${value.AssetNo}" placeholder="Asset No" required disabled>
                    </td>
                    <td>
                        <input type="text" id="AssetName${numberAssetReturn}" name="AssetName${numberAssetReturn}" 
                            class="form-control" value="${value.AssetName}" placeholder="Asset Name" required disabled>
                    </td>
                    <td>
                        <input type="text" id="Category${numberAssetReturn}" name="Category${numberAssetReturn}" 
                            class="form-control" value="${value.AssetCategoryName}" placeholder="Category" required disabled>
                    </td>
                    <td>
                        <input type="text" id="SubCategory${numberAssetReturn}" name="SubCategory${numberAssetReturn}" 
                            class="form-control" value="${value.AssetSubCategoryName}" placeholder="SubCategory" required disabled>
                    </td>
                    <td class="d-flex justify-content-center">
                        <button class="btn btn-danger DynrowRemove text-white" type="button" 
                            style="margin-top:0px;height:28px;width:28px;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;

            $('#MainDynamicAssestReturn').append(html);
        });
    } else {
        $('#MainDynamicAssestReturn').append(`
            <tr>
                <td valign="top" colspan="5" class="dataTables_empty">
                    <div class="d-flex justify-content-center">
                        <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                        Fill the Above Required Fields
                    </div>
                </td>
            </tr>
        `);
    }
}


const AssetNoAssetMapRetu = [[
    {
        AssetId: 1,
        AssetNo: "AST-0001",
        AssetName: "Office Desk",
        Category: "Furniture",
        SubCategory: "Work Desk"
    },
    {
        AssetId: 2,
        AssetNo: "AST-0002",
        AssetName: "Ergonomic Chair",
        Category: "Furniture",
        SubCategory: "Chair"
    },
    {
        AssetId: 3,
        AssetNo: "AST-0003",
        AssetName: "Desktop Computer",
        Category: "Electronics",
        SubCategory: "Computer"
    },
    {
        AssetId: 4,
        AssetNo: "AST-0004",
        AssetName: "Monitor",
        Category: "Electronics",
        SubCategory: "Display"
    }
]];

function DynamicToAsset() {
    let numberAssetMapping = Math.random().toString(36).substring(2);
    let AssetNoAssetSelectOptions = "";
    const defaultOption = '<option value="">--Select--</option>';

    if (AssetNoAssetMapRetu != null && AssetNoAssetMapRetu.length > 0 && AssetNoAssetMapRetu[0].length > 0) {
        AssetNoAssetSelectOptions = AssetNoAssetMapRetu[0].map(function (asset) {
            return `<option value="${asset.AssetId}">${asset.AssetNo}</option>`;
        }).join('');
    }

    const html = `
        <tr class="DynamicAssetMapping">
            <td>
                <label class="d-none AssetMappingId"></label>
                <select class="form-control AssetNoAsset" id="AssetNo${numberAssetMapping}" name="AssetNo${numberAssetMapping}" required>
                    ${defaultOption}${AssetNoAssetSelectOptions}
                </select>
            </td>
            <td>
                <label class="d-none AssetId"></label>
                <input type="text" id="AssetName${numberAssetMapping}" name="AssetName${numberAssetMapping}" class="form-control AssetNameMapping" placeholder="Asset Name" disabled required>
            </td>
            <td>
                <input type="text" id="Category${numberAssetMapping}" name="Category${numberAssetMapping}" class="form-control CategoryMapping" placeholder="Category" disabled required>
            </td>
            <td>
                <input type="text" id="SubCategory${numberAssetMapping}" name="SubCategory${numberAssetMapping}" class="form-control SubCategoryMapping" placeholder="SubCategory" disabled required>
            </td>
            <td class="d-flex justify-content-center" style="border: none;">
                <button class="btn btn-danger DynrowRemove text-white" type="button" style="margin-top:0px;height:28px;width:28px;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

    $('#MainDynamicAssetMapping').append(html);

    const rowCount = $('.DynamicAssetMapping').length;
    $('#NoOfAsset').val(rowCount);
}

function bindTable(tableid, data, columns, actionTarget, editcolumn, scrollpx, isAction, access) {
    if ($('#' + tableid).length && $.fn.DataTable.isDataTable('#' + tableid)) {
        try {
        } catch (error) {
            console.error('DataTable destroy error:', error);
            return;
        }
    }

    $('#' + tableid).empty();
    columns = columns.filter(x => x.name !== "TetroONEnocount");

    var isTetroONEnocount = data[0].hasOwnProperty('TetroONEnocount');
    var hasValidData = data && data.length > 0 && Object.values(data[0]).some(value => value !== null);

    var StatusColumnIndex = columns.findIndex(column => column.data === "Status");
    var LocationColumnIndex = columns.findIndex(column => column.data === "HiringLocation");

    if (isAction && data && data.length > 0 && !isTetroONEnocount && (access.update || access.delete)) {
        columns.push({
            "data": "Action", "name": "Action", "title": "Action", orderable: false
        });
    }

    var renderColumn = [];

    if (StatusColumnIndex !== -1) {
        renderColumn.push({
            "targets": StatusColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display' && row.Status_Color) {
                    var dataText = row.Status;
                    var statusColor = row.Status_Color.toLowerCase();

                    return `
                        <div>
                            <span class="ana-span badge text-white" style="background:${statusColor};width: 115px;font-size: 12px;height: 23px;">
                                ${dataText}
                            </span>
                        </div>`;
                }
                return data;
            }
        });
    }

    if (LocationColumnIndex !== -1) {
        renderColumn.push({
            "targets": LocationColumnIndex,
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    var hotDot = row.IsHot === true || row.IsHot === "true"
                        ? '<span style="color:red;font-size:20px;vertical-align:middle;">•</span> '
                        : '';
                    return hotDot + row.HiringLocation;
                }
                return data;
            }
        });
    }

    if (access.update || access.delete) {
        renderColumn.push({
            targets: actionTarget,
            render: function (data, type, row, meta) {
                var html = '';
                if (access.update) {
                    html += `<i class="btn-edit mx-1" data-id="${row[editcolumn]}" title="Edit">
                                <img src="/assets/commonimages/edit.svg" />
                             </i>`;
                }
                if (access.delete) {
                    html += `<i class="btn-delete alert_delete mx-1" data-id="${row[editcolumn]}" title="Delete">
                                <img src="/assets/commonimages/delete.svg" />
                             </i>`;
                }
                return html;
            }
        });
    }

    var lang = {};
    if ($(window).width() <= 575) {
        lang = {
            "paginate": {
                "next": ">",
                "previous": "<"
            }
        };
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
            "emptyTable": `
                <div>
                    <img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">
                    No records found
                </div>`
        }),
        "columnDefs": !isTetroONEnocount ? renderColumn : [],
    });

    $('#tableFilter').on('keyup', function () {
        table.search($(this).val()).draw();
    });

    setTimeout(function () {
        var table1 = $('#' + tableid).DataTable();
        Common.autoAdjustColumns(table1);
    }, 100);
}
