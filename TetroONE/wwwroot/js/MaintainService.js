$(document).ready(function () {
    $('#toggleIconBranch').removeClass('fa-chevron-up').addClass('fa-chevron-down');

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    $('#decrement-month-btn2').click(function () {
        let currentText = $('#dateDisplay2').text().trim();
        let [currentMonth, currentYear] = currentText.split(" ");
        let monthIndex = months.indexOf(currentMonth);
        l
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

    const ServiceCodeData = [
        {
            ServiceNo: "IGS-SRV-0001",
            Date: "05 Oct 2025",
            ServiceType: "Repair",
            WarrantyType: "In-Warranty",
            ContactName: "John Doe",
            NoOfAssets: 3,
            Amount: "₹1,500",
            Status: "Draft",
            Status_Color: "#6c757d"
        },
        {
            ServiceNo: "IGS-SRV-0002",
            Date: "06 Oct 2025",
            ServiceType: "Maintenance",
            WarrantyType: "Out-of-Warranty",
            ContactName: "Jane Smith",
            NoOfAssets: 5,
            Amount: "₹3,200",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            ServiceNo: "IGS-SRV-0003",
            Date: "07 Oct 2025",
            ServiceType: "Inspection",
            WarrantyType: "In-Warranty",
            ContactName: "Alice Johnson",
            NoOfAssets: 2,
            Amount: "₹800",
            Status: "Received",
            Status_Color: "#007bff"
        },
        {
            ServiceNo: "IGS-SRV-0004",
            Date: "08 Oct 2025",
            ServiceType: "Installation",
            WarrantyType: "In-Warranty",
            ContactName: "Michael Brown",
            NoOfAssets: 4,
            Amount: "₹2,400",
            Status: "Accepted",
            Status_Color: "#17a2b8"
        },
        {
            ServiceNo: "IGS-SRV-0005",
            Date: "09 Oct 2025",
            ServiceType: "Upgrade",
            WarrantyType: "Out-of-Warranty",
            ContactName: "Emily Davis",
            NoOfAssets: 1,
            Amount: "₹6,000",
            Status: "Authorized",
            Status_Color: "#ffc107"
        },
        {
            ServiceNo: "IGS-SRV-0006",
            Date: "10 Oct 2025",
            ServiceType: "Repair",
            WarrantyType: "In-Warranty",
            ContactName: "William Turner",
            NoOfAssets: 6,
            Amount: "₹4,750",
            Status: "Approved",
            Status_Color: "#28a745"
        },
        {
            ServiceNo: "IGS-SRV-0007",
            Date: "11 Oct 2025",
            ServiceType: "Maintenance",
            WarrantyType: "Out-of-Warranty",
            ContactName: "Sophia Wilson",
            NoOfAssets: 2,
            Amount: "₹1,950",
            Status: "Draft",
            Status_Color: "#6c757d"
        }
    ];

    const ServiceCodeColumns = [
        { data: 'ServiceNo', name: 'ServiceNo', title: 'Service No' },
        { data: 'Date', name: 'Date', title: 'Date' },
        { data: 'ServiceType', name: 'ServiceType', title: 'Service Type' },
        { data: 'WarrantyType', name: 'WarrantyType', title: 'Warranty Type' },
        { data: 'ContactName', name: 'ContactName', title: 'Contact Name' },
        { data: 'NoOfAssets', name: 'NoOfAssets', title: 'No Of Assets' },
        { data: 'Amount', name: 'Amount', title: 'Amount' },
        { data: 'Status', name: 'Status', title: 'Status' }
    ];

    $('#ServiceMainTableDynamic').empty();
    var html = `<div class="table-responsive">
                <table class="table table-rounded dataTable data-table table-striped tableResponsive" id="ServiceTable"></table>
            </div>`;
    $('#ServiceMainTableDynamic').append(html);
    bindTable('ServiceTable', ServiceCodeData, ServiceCodeColumns, 8, 'ServiceNo', '350px', true, { update: true, delete: true });

    $(document).on('click', '#AddService', function () {
        $('#ServiceModal').show();
        $('.Status-Div').hide();
        $('#Serviceheader').text('Add Service');
        $("#ServiceSaveBtn span:first").text("Save");
        $("#ServiceSaveprintbtn span:first").text("Save & Print");
        $("#btnPreviewService span:first").text("Save & Preview");
        $('#ServiceNo').val('IGS-SRV-0008');
        $('#ServiceDate').val('2025-10-09');
        $('#AddAttachment').hide();
        $('#AddAttachLable').show();
        $('#HideAttachlable').hide();
        $('#AddTerms').hide();
        $('#AddTermsLable').show();
        $('#HideTermsLable').hide();
        $('#AddNotes').hide();
        $('#AddNotesLable').show();
        $('#HideNotesLable').hide();
        $('.ProductTableRow').remove();
        $('#AddNotesText').val('');
        $('#TermsAndCondition').val('');

        $('#ServiceType').val('2').trigger('change')
        $('#TypeId').val('');
        $('#ContactId1').val('');
        $('#ModeOfTransferId').val('');
        $('#Transportno').val('');
        $('#ServiceStatusId').val('');

    });

    $(document).on('click', '.btn-edit', function () {
        $('#ServiceModal').show();
        $('.Status-Div').show();
        $('#Serviceheader').text('Edit Service');
        $("#ServiceSaveBtn span:first").text("Update");
        $("#ServiceSaveprintbtn span:first").text("Update & Print");
        $("#btnPreviewService span:first").text("Update & Preview");

        // Set form fields
        $('#ServiceNo').val('IGS-SRV-0008');
        $('#ServiceDate').val('2025-10-09');
        $('#ServiceType').val('1').trigger('change');
        $('#TypeId').val('1').trigger('change');
        $('#ContactId1').val('1').trigger('change');
        $('#ModeOfTransferId').val('1');
        $('#Transportno').val('TN36KS1013');
        $('#ServiceStatusId').val('1');

        $('#AddNotesText').val('Provides insights into workflow automation, inventory, procurement, and logistics management.Defines requirements for modules like accounting, billing, payroll, and financial reporting.');
        $('#TermsAndCondition').val('Contributes requirements for HRMS functionalities like employee records, leave, recruitment, and appraisal systems. Must propose complete end-to-end ERP solutions with relevant support and training.');

        $('.ProductTableRow').remove();
        $('#AddNotes').show();
        $('#AddNotesLable').hide();
        $('#HideNotesLable').show();
        $('#AddTerms').show();
        $('#AddTermsLable').hide();
        $('#HideTermsLable').show();

        // Hardcoded data
        var hardcodedData = [
            {
                assetNo: 'AS001',
                assetName: 'Dell Laptop',
                assetValue: '75000',
                assetType: 'Electronics',
                category: 'Computers',
                subCategory: 'Laptops',
                manufacturer: 'Dell',
                serialNumber: 'SN123456',
                modelNumber: 'Inspiron 15',
                expiryDate: '2026-12-31',
                status: 'Active'
            },
            {
                assetNo: 'AS002',
                assetName: 'HP Printer',
                assetValue: '12000',
                assetType: 'Electronics',
                category: 'Printers',
                subCategory: 'Laser Printer',
                manufacturer: 'HP',
                serialNumber: 'SN654321',
                modelNumber: 'LaserJet 1020',
                expiryDate: '2027-03-15',
                status: 'Active'
            }
        ];

        // ✅ Update #SubtotalRow fields
        var totalAmount = 0;
        $.each(hardcodedData, function (index, item) {
            totalAmount += parseFloat(item.assetValue || 0);
        });

        $('#AssetAmountTotal').val(totalAmount.toFixed(2)); // Amount total
        $('#AssetInwardDescription').val('Edit Mode: Preloaded assets'); // Optional: description
        $('#AssetTotal').val(hardcodedData.length); // No of Assets

        // ✅ Clear existing product rows (except subtotal & add row)
        $('#POProductTablebody tr').not('#AddItemButtonRow, #SubtotalRow').remove();

        // ✅ Append asset rows before #SubtotalRow
        $.each(hardcodedData, function (index, item) {
            var row = `
            <tr class="ProductTableRow">
                <td>${index + 1}</td>
                <td>${item.assetNo}</td>
                <td>${item.assetName}</td>
                <td>${item.assetValue}</td>
                <td style="display: none;">${item.assetType}</td>
                <td style="display: none;">${item.category}</td>
                <td>${item.subCategory}</td>
                <td>${item.manufacturer}</td>
                <td>${item.serialNumber}</td>
                <td>${item.modelNumber}</td>
                <td>${item.expiryDate}</td>
                <td>${item.status}</td>
                <td style="text-align:center;">
                    <button class="btn btn-danger btn-sm DynrowRemove" type="button">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
            $('#SubtotalRow').before(row);
        });
    });



    $(document).on('click', '#ServiceClose, #ServiceCancelBtn', function () {
        $('#ServiceModal').hide(); 
    });

    $(document).on('change', '#ContactId1', function () {
        var selectedValue = $(this).val();
        var ServiceTypeValue = $('#ServiceType').val(); // Corrected: get value instead of setting

        if (selectedValue !== "" && ServiceTypeValue === '1') {
            // Sample hardcoded data (you can customize this)
            var hardcodedData = [
                {
                    assetNo: 'AS001',
                    assetName: 'Dell Laptop',
                    assetValue: '75000',
                    assetType: 'Electronics',
                    category: 'Computers',
                    subCategory: 'Laptops',
                    manufacturer: 'Dell',
                    serialNumber: 'SN123456',
                    modelNumber: 'Inspiron 15',
                    expiryDate: '2026-12-31',
                    status: 'Active'
                },
                {
                    assetNo: 'AS002',
                    assetName: 'HP Printer',
                    assetValue: '12000',
                    assetType: 'Electronics',
                    category: 'Printers',
                    subCategory: 'Laser Printer',
                    manufacturer: 'HP',
                    serialNumber: 'SN654321',
                    modelNumber: 'LaserJet 1020',
                    expiryDate: '2027-03-15',
                    status: 'Active'
                }
            ];

            // Clear existing rows except subtotal and add-item rows
            $('#POProductTablebody tr').not('#AddItemButtonRow, #SubtotalRow').remove();

            // Loop through hardcoded data and build rows
            $.each(hardcodedData, function (index, item) {
                var row = `
                <tr class="ProductTableRow">
                    <td>${index + 1}</td>
                    <td>${item.assetNo}</td>
                    <td>${item.assetName}</td>
                    <td>${item.assetValue}</td>
                    <td style="display: none;">${item.assetType}</td>
                    <td style="display: none;">${item.category}</td>
                    <td>${item.subCategory}</td>
                    <td>${item.manufacturer}</td>
                    <td>${item.serialNumber}</td>
                    <td>${item.modelNumber}</td>
                    <td>${item.expiryDate}</td>
                    <td>${item.status}</td> 
                        <td style="text-align:center;">
                    <button class="btn btn-danger btn-sm DynrowRemove" type="button">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td> 
                </tr>
            `;
                // Append before subtotal row
                $('#SubtotalRow').before(row);
            });
        }
    });

    $(document).on('click', '.remove-row', function () {
        $(this).closest('tr').remove();
    });

    $(document).on('change', '#ServiceType', function () {
        var thisval = $(this).val();
        $('.ProductTableRow').remove(); 
        if (thisval === "1") {   
            $('#ServiceEngrId').prop('disabled', false);
            $('#AssetNametabelhead').text('1111111111111');
            $('#ServiceTypeDiv').show();
            $('#TableHeadInwardManufacturer,#TableHeadInwardSubCategory,#TableHeadInwardStatus,#InwardTableFooter1,#InwardTableFooter2,#InwardTableFooter3,#TableHeadOutwardAssetValue,#TableHeadOutwardExpiryDate').show();
            $('#TableHeadOutwardCategory,#TableHeadOutwardAssetType').hide();
            $("#TableFooterNoOfLabel").attr("colspan", "3");
            //$('#WarrentytypeTextboxDiv').show();
            $('#WarrentyTypeDiv').hide();
            $('#AddItemButtonRow').hide();
            $('#TypeId').val('');
            $('#AddNotes').hide();
            $('#AddNotesLable').show();
            $('#HideNotesLable').hide();
            $('#AddNotesText').val('');
            $('#selectedFiles,#ExistselectedFiles').empty('');
            $('#AddAttachment').hide();
            $('#AddAttachLable').show();
            $('#HideAttachlable').hide();
            $('#BarodeNumberDiv').removeClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-flex justify-content-end').addClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-none justify-content-end');
            $('#ServiceNo').val(''); 
        }
        else if (thisval === "2") { 
            $('#ServiceTypeDiv').hide();
            $('#AddItemButtonRow').show(); 
            $('#AssetNametabelhead').text('11111111111111111111111111111111111');
            $('#ServiceEngrId').prop('disabled', false);
            $('#TypeId').val('');
            $('#TableHeadInwardManufacturer,#TableHeadInwardSubCategory,#TableHeadInwardStatus,#InwardTableFooter1,#InwardTableFooter2,#InwardTableFooter3,#TableHeadOutwardAssetValue,#TableHeadOutwardExpiryDate').hide();
            $('#TableHeadOutwardCategory,#TableHeadOutwardAssetType').show();

            $("#TableFooterNoOfLabel").attr("colspan", "7");
            $('#WarrentyTypeDiv').show();
            $('#AddNotes').hide();
            $('#AddNotesLable').show();
            $('#HideNotesLable').hide();
            $('#AddNotesText').val('');
            $('#selectedFiles,#ExistselectedFiles').empty('');
            $('#AddAttachment').hide();
            $('#AddAttachLable').show();
            $('#HideAttachlable').hide();
            $('#BarodeNumberDiv').removeClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-flex justify-content-end').addClass('col-lg-6 col-md-12 col-sm-12 col-12 order-1 order-md-1 order-lg-2 d-none justify-content-end');
        }
        else { 
            $('#ServiceTypeDiv').hide();
            $('#ServiceEngrId').prop('disabled', false);
            $('#WarrentyTypeDiv').hide();
            $('#AddItemButtonRow').show(); 
            $('#TypeId').val('');
        }
    });

    $(document).on('change', '#ContactId', function () { 
        var BranchId = parseInt($('#FromAddressId').val());
        var thisval = $(this).val();
        if (thisval == 1) {
            $('#ToAddress').text('');
            $('#ToCity').text('');
            $('#ToContactNumber').text(''); 
            $('#ToStateId').text(''); 
            $('#ServiceEngrId').prop('disabled', false);
        }
        else if (thisval == 2) {
            $('#ToAddress').text('');
            $('#ToCity').text('');
            $('#ToContactNumber').text(''); 
            $('#ToStateId').text(''); 
            $('#ServiceEngrId').prop('disabled', false);  
        } else {
            $('#ServiceEngrId').prop('disabled', false); 
            $('#ToAddress').text('');
            $('#ToCity').text('');
            $('#ToContactNumber').text(''); 
            $('#ToStateId').text('');
        }
    });
    $(document).on('click', '#toggleVendorInfo', function (e) {
        e.preventDefault();
        e.stopPropagation();
         
        $('#BranchContent, #ToBranchContent').stop(true, true).slideToggle(300, function () { 
            const isVisible = $(this).is(':visible');
             
            $('.BilAddHead').css('border-bottom', isVisible ? '1px solid #c7c7c7' : 'none');
        }); 
        $('#toggleIconBranch').toggleClass('fa-chevron-up fa-chevron-down');
    });
     
    $(document).on('click', '.modal-close-btn', function () {
        $('#ProductModal').hide();
    });
     
    const assetData = [
        {
            id: 1,
            assetNo: 'IGS-NVR-LG-0001',
            assetName: 'LG_Network Video Recorder_AJGD_1896_SKHF-UYWY-RDCS',
            assetType: 'IT Assets',
            category: 'CCTV',
            serialNumber: 'SKHF-UYWY-RDCS',
            modelNumber: 'AJGD_1896'
        },
        {
            id: 2,
            assetNo: 'IGS-CAM-LG-0002',
            assetName: 'LG_Camera_XPTO_2020_ABC-1234-XYZ',
            assetType: 'IT Assets',
            category: 'CCTV',
            serialNumber: 'ABC-1234-XYZ',
            modelNumber: 'XPTO_2020'
        },
        {
            id: 3,
            assetNo: 'IGS-SRV-DL-0003',
            assetName: 'Dell_Server_PowerEdge_T40_DEF-4567-GHIJ',
            assetType: 'IT Assets',
            category: 'Servers',
            serialNumber: 'DEF-4567-GHIJ',
            modelNumber: 'PowerEdge_T40'
        },
        {
            id: 4,
            assetNo: 'IGS-PRT-HP-0004',
            assetName: 'HP_LaserJet_Pro_M404dn_JKL-7890-MNOP',
            assetType: 'IT Assets',
            category: 'Printers',
            serialNumber: 'JKL-7890-MNOP',
            modelNumber: 'M404dn'
        }
    ];

    let selectedAssets = [];

    // Show modal and populate asset selection table
    $(document).on('click', '#AddItemButtonRow', function () {
        let tableBody = $('#ProductItem-table-body');
        tableBody.empty(); // Clear existing rows

        assetData.forEach(item => {
            const rowHtml = `
            <tr class="AllProductRowItem">
                <td>
                    <div class="d-flex align-items-center">
                        <input class="mr-2 asset-checkbox" type="checkbox" id="AssetNo-${item.id}"
                            data-id="${item.id}" data-assetno="${item.assetNo}" data-assetname="${item.assetName}">
                        <label class="AssetId d-none">${item.id}</label>
                        <label class="AssetNo" for="AssetNo-${item.id}">${item.assetNo}</label>
                    </div>
                </td>
                <td><label class="AssetName">${item.assetName}</label></td>
                <td class="AssetType">${item.assetType}</td>
                <td class="Category">${item.category}</td>
                <td class="SerialNumber">${item.serialNumber}</td>
                <td class="ModelNumber">${item.modelNumber}</td>
            </tr>
        `;
            tableBody.append(rowHtml);
        });

        $('#ProductModal').show();
    });

    // Handle checkbox select/deselect and update selectedAssets array
    $(document).on('change', '.asset-checkbox', function () {
        const row = $(this).closest('tr');
        const assetId = $(this).data('id');
        const assetNo = $(this).data('assetno');
        const assetName = $(this).data('assetname');

        const assetType = row.find('.AssetType').text().trim();
        const category = row.find('.Category').text().trim();
        const serialNumber = row.find('.SerialNumber').text().trim();
        const modelNumber = row.find('.ModelNumber').text().trim();

        if (this.checked) {
            if (!selectedAssets.some(a => a.assetId === assetId)) {
                selectedAssets.push({
                    assetId,
                    assetNo,
                    assetName,
                    assetType,
                    category,
                    serialNumber,
                    modelNumber
                });
            }
        } else {
            selectedAssets = selectedAssets.filter(a => a.assetId !== assetId);
        }
    });

    // Add selected assets to the main table
    $(document).on('click', '#BtnAdd', function () {
        const tableBody = $('#POProductTablebody');

        // Keep #AddItemButtonRow and #SubtotalRow, remove others
        tableBody.find('tr').not('#AddItemButtonRow, #SubtotalRow').remove();

        if (selectedAssets.length === 0) {
            alert('Please select at least one asset.');
            return;
        }

        selectedAssets.forEach((asset, index) => {
            const rowHtml = `
            <tr class="ProductTableRow">
                <td>${index + 1}</td>
                <td><label>${asset.assetNo}</label></td>
                <td>
                    <label>${asset.assetName}</label>
                    <textarea class="form-control mt-2 descriptiontdtext d-none"
                        placeholder="Description">${asset.assetName}</textarea>
                </td>
                <td>${asset.assetType || ''}</td>
                <td>${asset.category || ''}</td>
                <td>${asset.serialNumber || ''}</td>
                <td>${asset.modelNumber || ''}</td>
                <td style="text-align:center;">
                    <button class="btn btn-danger btn-sm DynrowRemove" type="button">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
            $(rowHtml).insertBefore('#AddItemButtonRow');
        });

        $('#ProductModal').hide(); // Close the modal
    });
    
    $(document).on('click', '.DynrowRemove', function () {
        $(this).closest('tr').remove();
    });

    $(document).on('click', '#ServiceSaveBtn', function () {
        var $thisHeradre = $('#Serviceheader').text()
        if ($thisHeradre == "Add Service") {
            Common.successMsg("Service Added Successfully.");
        } else {
            Common.successMsg("Updated Service Successfully.");
        }
        $('#ServiceModal').hide();
    });

    $(document).on('click', '#AddNotesLable', function () {
        $('#AddNotes').show();
        $('#AddNotesLable').hide();
        $('#HideNotesLable').show();
    });
    $(document).on('click', '#HideNotesLable', function () {
        $('#AddNotes').hide();
        $('#AddNotesLable').show();
        $('#HideNotesLable').hide();

    });
    $(document).on('click', '#AddTermsLable', function () {
        $('#AddTerms').show();
        $('#AddTermsLable').hide();
        $('#HideTermsLable').show();
    });
    $(document).on('click', '#HideTermsLable', function () {
        $('#AddTerms').hide();
        $('#AddTermsLable').show();
        $('#HideTermsLable').hide();
    });
    $(document).on('click', '#AddAttachLable', function () {
        $('#AddAttachment').show();
        $('#AddAttachLable').hide();
        $('#HideAttachlable').show();
    });
    $(document).on('click', '#HideAttachlable', function () {
        $('#AddAttachment').hide();
        $('#AddAttachLable').show();
        $('#HideAttachlable').hide();
    });
});


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
