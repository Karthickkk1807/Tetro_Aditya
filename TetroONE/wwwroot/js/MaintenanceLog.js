let selectedItems = [];
var MaintenanceLogId = 0;
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
$(document).ready(function () {

    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    //Common.ajaxCall("GET", "/Contact/GetMaintenanceLog", { FranchiseId: FranchiseMappingId }, MaintenanceLogSuccess, null);
    MaintenanceLogSuccess();
    Common.bindDropDownParent('StateId', 'FormMaintenanceLog', 'State');

    $('#IsActiveHide').hide();

    $('#SpareParts').select2({
        dropdownParent: $('#FormMaintenanceLog'),
        width: '100%',
        placeholder: '-- Select spare Parts --'
    }).trigger('change');
    $('#DepartmentId').on('change', function () {
        var selectedValue = $(this).val();

        if (selectedValue === "1") {
           
            $('.PlanNoDiv,#PlanDetailsContainer').show();
            $('.spareDiv').hide();
            $('#PlanDetailsContainer').hide();
            
        } else {
            $('.spareDiv').show();
            $('.PlanNoDiv,#PlanDetailsContainer').hide();
            $('#PlanTypeId').val(''); 
        }
    });



    $('#PlanTypeId').on('change', function () {
        const planId = $(this).val();
        $('#PlanDetailsContainer').empty();
        if (!planId) {
            $('#PlanDetailsContainer').hide();
            return;
        } else {
            $('#PlanDetailsContainer').show();
        }

        // Mock Data
        const planData = {
            1: {
                StartDate: '2025-10-01',
                EndDate: '2025-12-31',
                Priority: 'High',
                Machine: {
                    Type: 'Dyeing',
                    Name: 'Dyeing Machine A',
                    Manufacturer: 'TexMach Pvt Ltd',
                    Model: 'TX200',
                    SerialNo: 'DY12345',
                    InstallDate: '2023-03-10',
                    LastMaint: '2025-09-15',
                    NextSched: '2025-11-15'
                },
                Task: {
                    No: 'TASK/2025-0001',
                    Desc: 'Lubricate rollers',
                    Type: 'Preventive',
                    Technician: 'Ravi Kumar',
                    EstTime: '2',
                    Tools: ['Wrench Set', 'Grease Gun'],
                    MaterialsTable: [
                        { Material: 'Bearing', Quantity: '4' },
                        { Material: 'Oil Filter', Quantity: '2' }
                    ],
                    Safety: 'Use PPE, disconnect power',
                    Status: 'Planned',
                    Remarks: 'Regular check-up'
                }
            },
            2: {
                StartDate: '2025-09-15',
                EndDate: '2025-10-30',
                Priority: 'Normal',
                Machine: {
                    Type: 'Printing',
                    Name: 'Textile Printer X1',
                    Manufacturer: 'PrintoTech',
                    Model: 'PX100',
                    SerialNo: 'PR56789',
                    InstallDate: '2022-06-05',
                    LastMaint: '2025-08-20',
                    NextSched: '2025-11-01'
                },
                Task: {
                    No: 'TASK/2025-0002',
                    Desc: 'Replace heating element',
                    Type: 'Corrective',
                    Technician: 'Arun Raj',
                    EstTime: '4',
                    Tools: ['Screwdriver Kit', 'Safety Gloves'],
                    MaterialsTable: [
                        { Material: 'Heating Coil', Quantity: '1' },
                        { Material: 'Screws', Quantity: '10' }
                    ],
                    Safety: 'Handle with insulated gloves',
                    Status: 'In Progress',
                    Remarks: 'Spare part delayed'
                }
            },
            3: {
                StartDate: '2025-10-10',
                EndDate: '2025-11-10',
                Priority: 'Critical',
                Machine: {
                    Type: 'Boiler',
                    Name: 'Steam Boiler B2',
                    Manufacturer: 'HeatPro Systems',
                    Model: 'HP500',
                    SerialNo: 'BL78965',
                    InstallDate: '2021-11-01',
                    LastMaint: '2025-09-05',
                    NextSched: '2025-10-28'
                },
                Task: {
                    No: 'TASK/2025-0003',
                    Desc: 'Check pressure valves',
                    Type: 'Predictive',
                    Technician: 'Karthick R',
                    EstTime: '3',
                    Tools: ['Multimeter', 'Torque Wrench'],
                    MaterialsTable: [
                        { Material: 'Valve Kit', Quantity: '3' },
                        { Material: 'Sealant', Quantity: '1' }
                    ],
                    Safety: 'Release pressure before service',
                    Status: 'Planned',
                    Remarks: 'Monitor pressure after replacement'
                }
            }
        };

        const data = planData[planId];
        if (!data) return;

        // Build materials table rows
        let materialRows = '';
        data.Task.MaterialsTable.forEach(m => {
            materialRows += `
                <tr>
                    <td>
                        <select class="form-control MaterialDropdown">
                            <option value="">Select Material</option>
                            <option ${m.Material === 'Bearing' ? 'selected' : ''}>Bearing</option>
                            <option ${m.Material === 'Belt' ? 'selected' : ''}>Belt</option>
                            <option ${m.Material === 'Gear' ? 'selected' : ''}>Gear</option>
                            <option ${m.Material === 'Oil Filter' ? 'selected' : ''}>Oil Filter</option>
                            <option ${m.Material === 'Coolant' ? 'selected' : ''}>Coolant</option>
                            <option ${m.Material === 'Heating Coil' ? 'selected' : ''}>Heating Coil</option>
                            <option ${m.Material === 'Screws' ? 'selected' : ''}>Screws</option>
                            <option ${m.Material === 'Valve Kit' ? 'selected' : ''}>Valve Kit</option>
                            <option ${m.Material === 'Sealant' ? 'selected' : ''}>Sealant</option>
                        </select>
                    </td>
                    <td><input type="text" class="form-control QuantityInput" value="${m.Quantity}" /></td>
                    <td class="text-center">
                        <button id="RemoveButton" class="btn DynrowRemove " type="button" onclick="removeSpareRow(this)" style="margin-top:1px;" fdprocessedid="gnznj6"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>`;
        });

        let html = `
        
       
           
            <div class="row mb-2">
                <div class="col-md-4"><label>Plan Start Date</label><input type="date" class="form-control" value="${data.StartDate}" disabled></div>
                <div class="col-md-4"><label>Plan End Date</label><input type="date" class="form-control" value="${data.EndDate}" disabled></div>
                <div class="col-md-4"><label>Priority</label><input type="text" class="form-control" value="${data.Priority}" disabled></div>
            </div>
      

        <!-- Machine / Equipment Info -->
        <fieldset class="p-3 mb-3">
            <legend class="w-auto px-2 fs-6 fw-semibold">Machine / Equipment Info</legend>
            <div class="d-flex justify-content-between align-items-center mb-2">
                 <label class="DynamicLable fw-bold">Machine 1</label>
                    
              </div>
            <div class="row">
                <div class="col-md-6"><label>Machine Type</label><input class="form-control" value="${data.Machine.Type}" disabled></div>
                <div class="col-md-6"><label>Machine Name</label><input class="form-control" value="${data.Machine.Name}" disabled></div>
                <div class="col-md-4 mt-3"><label>Manufacturer</label><input class="form-control" value="${data.Machine.Manufacturer}" disabled></div>
                <div class="col-md-4 mt-3"><label>Model</label><input class="form-control" value="${data.Machine.Model}" disabled></div>
                <div class="col-md-4 mt-3"><label>Serial No.</label><input class="form-control" value="${data.Machine.SerialNo}" disabled></div>
                <div class="col-md-4 mt-3"><label>Installation Date</label><input type="date" class="form-control" value="${data.Machine.InstallDate}" disabled></div>
                <div class="col-md-4 mt-3"><label>Last Maintenance Date</label><input type="date" class="form-control" value="${data.Machine.LastMaint}" disabled></div>
                <div class="col-md-4 mt-3"><label>Next Scheduled Date</label><input type="date" class="form-control" value="${data.Machine.NextSched}" disabled></div>
            </div>
        </fieldset>

        <!-- Task / Activity Details -->
        <fieldset class=" p-3 mb-3">
            <legend class="w-auto px-2 fs-6 fw-semibold">Task / Activity Details</legend>
            <div class="d-flex justify-content-between align-items-center mb-2">
                 <label class="DynamicLable fw-bold">Task 1</label>
                    
              </div>
            <div class="row">
                <div class="col-md-6"><label>Task No</label><input class="form-control" value="${data.Task.No}" disabled></div>
                <div class="col-md-6"><label>Task Description</label><input class="form-control" value="${data.Task.Desc}" disabled></div>
                <div class="col-md-4 mt-3"><label>Task Type</label><input class="form-control" value="${data.Task.Type}" disabled></div>
                <div class="col-md-4 mt-3"><label>Technician</label><input class="form-control" value="${data.Task.Technician}" disabled></div>
                <div class="col-md-4 mt-3"><label>Estimated Time (hrs)</label><input class="form-control" value="${data.Task.EstTime}" disabled></div>
                <div class="col-md-12 mt-3"><label>Tools Required</label><input class="form-control" value="${data.Task.Tools.join(', ')}" disabled></div>

                <!-- Materials Table -->
                <div class="col-md-12 mt-3">
                    <fieldset class="p-3">
                        <legend class="w-auto px-2 fs-6 fw-semibold">Materials / Spare Parts</legend>
                        <div class="d-flex justify-content-end align-items-start mb-2" style="margin-top: -15px;">
                                <button id="" class="btn AddStockBtn" type="button" onclick="duplicateSpareRow(this)">
                                    <i class="fas fa-plus" id="AddButton"></i>
                                </button>
                            </div>
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle" id="MaterialsTable">
                                <thead style="background-color:#E3C8F3;">
                                    <tr><th>Material / Spare Part</th><th>Quantity</th><th>Action</th></tr>
                                </thead>
                                <tbody id="MaterialsBody">${materialRows}</tbody>
                            </table>
                        </div>
                    </fieldset>
                </div>

                <div class="col-md-6 mt-3"><label>Safety Instructions</label><input class="form-control" value="${data.Task.Safety}" disabled></div>
                <div class="col-md-6 mt-3"><label>Status</label><input class="form-control" value="${data.Task.Status}" disabled></div>
                <div class="col-md-12 mt-3"><label>Remarks</label><input class="form-control" value="${data.Task.Remarks}" disabled></div>

                <div class="col-md-6 col-lg-6 col-sm-6 col-6 mt-2">
                    <div class="form-group">
                        <label>Task Complete Date<span id="Asterisk">*</span></label>
                        <input type="date" class="form-control" placeholder="Ex: 101, Ashoka Nagar" id="" name="" maxlength="500" required />
                    </div>
                </div>
                <div class="col-md-6 mt-2">
                <div class="form-group">
                    <label>Querys</label>
                     <textarea class="form-control" id="" autocomplete="off" name="Remark" rows="1" maxlength="250" placeholder=""></textarea>
                     </div>
                 </div>

            </div>
        </fieldset>
        `;

        $('#PlanDetailsContainer').html(html);
    });

    $(document).on('click', '#SaveClient', function (e) {

        if (!Common.validateEmailwithErrorwithParent('FormMaintenanceLog', 'Email')) {
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



        if (isFormValid && isValid && $("#FormMaintenanceLog").valid() && $("#FormEquipmentMachineInfo").valid()) {
            var DataUpdate = JSON.parse(JSON.stringify(jQuery('#FormMaintenanceLog').serializeArray()));


            var objvalue = {};
            $.each(DataUpdate, function (index, item) {
                objvalue[item.name] = item.value;
            });

            objvalue.IsActive = $('#IsActive').is(':checked');
            objvalue.BankName = $('#BankName').val();
            objvalue.BranchName = $('#BranchName').val();
            objvalue.MaxCreditLimit = Common.parseFloatInputValue('MaxCreditLimit') || null;
            objvalue.CurrentCreditLimit = Common.parseFloatInputValue('CurrentCreditLimit') || null;

            var ContactPerson = [];
            var ClosestDiv = $('#FormEquipmentMachineInfo .EquipmentMachineInfo');
            $.each(ClosestDiv, function (index, values) {
                var getContactPersonId = $(values).find('.clientContactPersonId').data('id');
                var getSalutationValues = $(values).find('.Salutation').val();
                var getClientContactPersonNameValues = $(values).find('.ContactPerson').val();
                var getContactNumberValues = $(values).find('.MobileNumber').val();
                var geEmailtValues = $(values).find('.Email').val();

                ContactPerson.push({
                    ContactPersonId: parseInt(getContactPersonId) || null,
                    Salutation: getSalutationValues,
                    ContactPersonName: getClientContactPersonNameValues,
                    ContactNumber: getContactNumberValues,
                    Email: geEmailtValues,

                    ContactId: parseInt(MaintenanceLogId) || null
                });
            });
            objvalue.contactPersonDetails = ContactPerson;



            objvalue.MaintenanceLogId = parseInt(MaintenanceLogId) || null;
            objvalue.StateId = parseInt($('#StateId').val()) || null;
            Common.ajaxCall("POST", "/Contact/InsertUpdareMaintenanceLogDetails", JSON.stringify(objvalue), MaintenanceLogInsertUpdateSuccess, null);
        }
    });
});
function duplicateSpareRow(btn) {
    // Find the table body
    const tbody = $(btn).closest('fieldset').find('#MaterialsBody');

    // Create new row HTML
    const newRow = `
        <tr>
            <td>
                <select class="form-control MaterialDropdown">
                    <option value="">Select Material</option>
                    <option value="Bearing">Bearing</option>
                    <option value="Belt">Belt</option>
                    <option value="Gear">Gear</option>
                    <option value="Oil Filter">Oil Filter</option>
                    <option value="Coolant">Coolant</option>
                    <option value="Heating Coil">Heating Coil</option>
                    <option value="Screws">Screws</option>
                    <option value="Valve Kit">Valve Kit</option>
                    <option value="Sealant">Sealant</option>
                </select>
            </td>
            <td><input type="text" class="form-control QuantityInput" value="1" /></td>
            <td class="text-center">
                <button type="button" class="btn DynrowRemove" onclick="removeSpareRow(this)">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

    // Append new row to tbody
    tbody.append(newRow);
}
function removeSpareRow(btn) {
    // Remove the row containing this button
    $(btn).closest('tr').remove();
}

//function MaintenanceLogSuccess(response) {
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

//        var columns = Common.bindColumn(data[1], ['MaintenanceLogId', 'Status_Color']);
//        Common.bindTable('MaintenanceLogTable', data[1], columns, -1, 'MaintenanceLogId', '330px', true, access);
//    }
//}


function MaintenanceLogSuccess() {
    // ✅ Hardcoded Counter Box Data
    var counterData = {
        "Total Plans": 2,
        "Completed": 2,
        "Partially Completed": 0,
        "Delayed": 0
    };

    // ✅ Set Counter Titles
    $("#CounterTextBox1").text(Object.keys(counterData)[0]);
    $("#CounterTextBox2").text(Object.keys(counterData)[1]);
    $("#CounterTextBox3").text(Object.keys(counterData)[2]);
    $("#CounterTextBox4").text(Object.keys(counterData)[3]);

    // ✅ Set Counter Values
    $('#CounterValBox1').text(Object.values(counterData)[0]);
    $('#CounterValBox2').text(Object.values(counterData)[1]);
    $('#CounterValBox3').text(Object.values(counterData)[2]);
    $('#CounterValBox4').text(Object.values(counterData)[3]);

    // ✅ Hardcoded Table Data (3 records)
    var MaintenanceLogs = [
        {
            MaintenanceLogId: 1,
            MaintenanceLogNo: "ML-001",
            Date: "01-10-2025",
            MaintanencePlanType: "Planned",
            Completed: "5",
            Status: "Active",
            Status_Color: "#198754" // green
        },
        {
            MaintenanceLogId: 2,
            MaintenanceLogNo: "ML-002",
            Date: "02-10-2025",
            MaintanencePlanType: "Adhoc",
            Completed: "10",
            Status: "Active",
            Status_Color: "#198754" 
        },
        
    ];

    // ✅ Bind columns and table
    var columns = Common.bindColumn(MaintenanceLogs, ['MaintenanceLogId', 'Status_Color']);
    Common.bindTable('MaintenanceLogTable', MaintenanceLogs, columns, -1, 'MaintenanceLogId', '330px', true, access);
}

function MaintenanceLogInsertUpdateSuccess(response) {
    if (response.status) {

        Common.successMsg(response.message);
        $("#MaintenanceLogCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Contact/GetMaintenanceLog", { FranchiseId: franchiseId }, MaintenanceLogSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}


$(document).on('click', '#AddMaintenanceLog', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#MaintenanceLogCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#MaintenanceLogCanvas").css("width", "50%");
    } else {
        $("#MaintenanceLogCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingMaintenanceLog();
    MaintenanceLogId = 0;
    $("#MaintenanceLogHeader").text('Add Maintenance Plan Details');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#FormMaintenanceLog")[0].reset();


    Common.removeMessage('FormMaintenanceLog');

   
    $('#FormEquipmentMachineInfo').empty('');

    $("#FormMaintenanceLog select").val("").trigger("change");
    $('#FormMaintenanceLog #StateId').val('32');
    $('#Country').val('India');
    $('#AccountType').val('Current');
    $('#IsActiveHide').hide();
    $('#SaveClient').text('Save').addClass('btn-success').removeClass('btn-update');
    $("input[name='products']").prop("checked", false);
    $('#loader-pms').hide();



    $('#MaintenanceLogCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});


$(document).on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#MaintenanceLogCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#MaintenanceLogCanvas").css("width", "50%");
    } else {
        $("#MaintenanceLogCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingMaintenanceLog();
    Common.removeMessage('FormMaintenanceLog');

    Common.removeMessage('FormEquipmentMachineInfo');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#MaintenanceLogHeader").text('Edit MaintenanceLog Details');
    $('#SaveClient').text('Update').addClass('btn-update').removeClass('btn-success');

    $('#IsActiveHide').show();
    MaintenanceLogId = $(this).data('id');
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    Common.ajaxCall("GET", "/Contact/GetMaintenanceLogID", { MaintenanceLogId: MaintenanceLogId, FranchiseId: franchiseId }, editSuccess, null);

    $('#MaintenanceLogCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});

$(document).on('click', '#MaintenanceLogTable .btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var MaintenanceLogId = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/DeleteMaintenanceLog", { MaintenanceLogId: MaintenanceLogId }, MaintenanceLogInsertUpdateSuccess, null);
    }
});

function editSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        $('#loader-pms').hide()
        Common.bindData(data[0]);
        Common.bindData(data[1]);
        $('#Email').val(data[0][0].Email);
        $('#ContactNumber').val(data[0][0].ContactNumber);




        $('#FormEquipmentMachineInfo').empty('');
        $.each(data[1], function (index, value) {
            var rowadd = $('.EquipmentMachineInfo').length;
            var DynamicLableNo = rowadd + 1;
            let unique = Math.random().toString(36).substring(2);

            var htmlAppend =
                `
                       <div class="row EquipmentMachineInfo">
                         <input type="hidden" class="clientContactPersonId" id="ClientContactPersonId" name="ClientContactPersonId" data-id="${value.EquipmentMachineInfoPersonId}" />
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
                                <input type="text" class="form-control Email" placeholder="Ex: example@gmail.com" id="Email${unique}" value="${value.Email || ''}" name="Email${unique}" />
                            </div>
                        </div>
                       

                        <div class="col-lg-3 col-md-3 col-sm-3 col-3 thiswillshow">
                            <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                                <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)" fdprocessedid="8h3d7"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>

                     </div>
                `;

            $('#FormEquipmentMachineInfo').append(htmlAppend);
            setPrimaryCheckboxEventListeners();
        });





        updateRemoveButtons();
    }
}

$(document).on('click', '#CloseCanvas', function () {
    $("#MaintenanceLogCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});



$('.accordion-header').on('click', function () {
    var $offcanvas = $(this).closest('.offcanvas-container');
    var $accordion = $(this).closest('.accordion');
    var target = $(this).find('a').attr('data-target');

    $offcanvas.find('.collapse').not(target).collapse('hide');

    $(target).collapse('toggle');
});






function validateFormAccordions(accordionSelector, errorMessageDefault = 'This field is required') {
    var isFormValid = true;
    var foundInvalidAccordion = false;

    $(accordionSelector).each(function () {
        if (foundInvalidAccordion) {
            return false;
        }

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
            }
            else if (minLength && value.length < parseInt(minLength)) {
                isInvalid = true;
                errorMessage = `Please enter at least ${minLength} characters.`;
            }
            else if (maxLength && value.length > parseInt(maxLength)) {
                isInvalid = true;
                errorMessage = `Please enter no more than ${maxLength} characters.`;
            }

            if (isInvalid) {
                input.addClass('is-invalid error');
                input.nextAll('.invalid-feedback, .error').remove();
                input.after('<div class="invalid-feedback">' + errorMessage + '</div>');

                isCurrentValid = false;
            } else {
                input.removeClass('is-invalid error');
                input.nextAll('.invalid-feedback, .error').remove();
            }
        });



        if (!isCurrentValid) {
            isFormValid = false;
            foundInvalidAccordion = true;
            currentAccordion.find('.collapse').collapse('show');
            currentAccordion[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
            $(accordionSelector).not(currentAccordion).find('.collapse').collapse('hide');
        } else {
            currentAccordion.find('.collapse').collapse('hide');
        }
    });

    return isFormValid;
}



function CanvasOpenFirstShowingMaintenanceLog() {
    $('#MaintenanceLogCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#MaintenanceLogCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#MaintenanceLogCanvas').offset().top
    }, 'fast');
}
