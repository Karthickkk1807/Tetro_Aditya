let selectedItems = [];
var MaintenancePlanId = 0;
var deletedFiles = [];
var existFiles = [];
var formDataMultiple = new FormData();
$(document).ready(function () {

    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));

    //Common.ajaxCall("GET", "/Contact/GetMaintenancePlan", { FranchiseId: FranchiseMappingId }, MaintenancePlanSuccess, null);
    MaintenancePlanSuccess();
    Common.bindDropDownParent('StateId', 'FormMaintenancePlan', 'State');
    
    $('#IsActiveHide').hide();


    $(document).on('click', '#SaveClient', function (e) {

        if (!Common.validateEmailwithErrorwithParent('FormMaintenancePlan', 'Email')) {
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

   

        if (isFormValid  && isValid && $("#FormMaintenancePlan").valid() && $("#FormEquipmentMachineInfo").valid()) {
            var DataUpdate = JSON.parse(JSON.stringify(jQuery('#FormMaintenancePlan').serializeArray()));
       

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
              
                    ContactId: parseInt(MaintenancePlanId) || null
                });
            });
            objvalue.contactPersonDetails = ContactPerson;

            

            objvalue.MaintenancePlanId = parseInt(MaintenancePlanId) || null;
            objvalue.StateId = parseInt($('#StateId').val()) || null;
            Common.ajaxCall("POST", "/Contact/InsertUpdareMaintenancePlanDetails", JSON.stringify(objvalue), MaintenancePlanInsertUpdateSuccess, null);
        }
    });
});

//function MaintenancePlanSuccess(response) {
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

//        var columns = Common.bindColumn(data[1], ['MaintenancePlanId', 'Status_Color']);
//        Common.bindTable('MaintenancePlanTable', data[1], columns, -1, 'MaintenancePlanId', '330px', true, access);
//    }
//}


function MaintenancePlanSuccess() {
    // ✅ Hardcoded Counter Box Data
    var counterData = {
        "Total Plans": 12,
        "Active Plans": 8,
        "Completed Plans": 3,
        "Pending Plans": 1
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
    var maintenancePlans = [
        {
            MaintenancePlanId: 1,
            MaintenancePlanNo: "MP-001",
            Date: "01-10-2025",
            Department: "Production",
            PlanType: "Preventive",
            Frequency: "Monthly",
            PlanStartDate: "01-10-2025",
            PlanEndDate: "31-10-2025",
            Priority: "High",
            Status: "Active",
            Status_Color: "#198754" // green
        },
        {
            MaintenancePlanId: 2,
            MaintenancePlanNo: "MP-002",
            Date: "05-10-2025",
            Department: "Maintenance",
            PlanType: "Corrective",
            Frequency: "Weekly",
            PlanStartDate: "05-10-2025",
            PlanEndDate: "12-10-2025",
            Priority: "Medium",
            Status: "Completed",
            Status_Color: "#0d6efd" // blue
        },
        {
            MaintenancePlanId: 3,
            MaintenancePlanNo: "MP-003",
            Date: "10-10-2025",
            Department: "Quality Control",
            PlanType: "Inspection",
            Frequency: "Quarterly",
            PlanStartDate: "10-10-2025",
            PlanEndDate: "31-12-2025",
            Priority: "Low",
            Status: "Pending",
            Status_Color: "#dc3545" // red
        }
    ];

    // ✅ Bind columns and table
    var columns = Common.bindColumn(maintenancePlans, ['MaintenancePlanId', 'Status_Color']);
    Common.bindTable('MaintenancePlanTable', maintenancePlans, columns, -1, 'MaintenancePlanId', '330px', true, access);
}

function MaintenancePlanInsertUpdateSuccess(response) {
    if (response.status) {
  
        Common.successMsg(response.message);
        $("#MaintenancePlanCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        var franchiseId = parseInt($('#UserFranchiseMappingId').val());
        Common.ajaxCall("GET", "/Contact/GetMaintenancePlan", { FranchiseId: franchiseId }, MaintenancePlanSuccess, null);
    }
    else {
        Common.errorMsg(response.message);
    }
}


$(document).on('click', '#AddMaintenancePlan', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#MaintenancePlanCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#MaintenancePlanCanvas").css("width", "50%");
    } else {
        $("#MaintenancePlanCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingMaintenancePlan();
    MaintenancePlanId = 0;
    $("#MaintenancePlanHeader").text('Add Maintenance Plan Details');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#FormMaintenancePlan")[0].reset();

    $("#FormEquipmentMachineInfo")[0].reset();
    Common.removeMessage('FormMaintenancePlan');

    Common.removeMessage('FormEquipmentMachineInfo');
    $('#FormEquipmentMachineInfo').empty('');
    duplicateRow();
    addTaskRow();
    $("#FormMaintenancePlan select").val("").trigger("change");
    $('#FormMaintenancePlan #StateId').val('32');
    $('#Country').val('India');
    $('#AccountType').val('Current');
    $('#IsActiveHide').hide();
    $('#SaveClient').text('Save').addClass('btn-success').removeClass('btn-update');
    $("input[name='products']").prop("checked", false);
    $('#loader-pms').hide();



    $('#MaintenancePlanCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});


$(document).on('click', '.btn-edit', function () {
    $('#loader-pms').show();
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
        $("#MaintenancePlanCanvas").css("width", "95%");
    } else if (windowWidth <= 992) {
        $("#MaintenancePlanCanvas").css("width", "50%");
    } else {
        $("#MaintenancePlanCanvas").css("width", "39%");
    }
    CanvasOpenFirstShowingMaintenancePlan();
    Common.removeMessage('FormMaintenancePlan');

    Common.removeMessage('FormEquipmentMachineInfo');
    $('#fadeinpage').addClass('fadeoverlay');
    $("#MaintenancePlanHeader").text('Edit MaintenancePlan Details');
    $('#SaveClient').text('Update').addClass('btn-update').removeClass('btn-success');
  
    $('#IsActiveHide').show();
    MaintenancePlanId = $(this).data('id');
    var franchiseId = parseInt($('#UserFranchiseMappingId').val());
    Common.ajaxCall("GET", "/Contact/GetMaintenancePlanID", { MaintenancePlanId: MaintenancePlanId, FranchiseId: franchiseId }, editSuccess, null);

    $('#MaintenancePlanCanvas.collapse').removeClass('show');
    $('#collapse1').addClass('show');
});

$(document).on('click', '#MaintenancePlanTable .btn-delete', async function () {
    var response = await Common.askConfirmation();
    if (response == true) {
        var MaintenancePlanId = $(this).data('id');
        Common.ajaxCall("GET", "/Contact/DeleteMaintenancePlan", { MaintenancePlanId: MaintenancePlanId }, MaintenancePlanInsertUpdateSuccess, null);
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
    $("#MaintenancePlanCanvas").css("width", "0%");
    $('#fadeinpage').removeClass('fadeoverlay');
});

$(document).on('input', '#FormMaintenancePlan #MaxCreditLimit', function () {
    var thisVal = $(this).val();
    if (MaintenancePlanId == 0) {
        $('#CurrentCreditLimit').val(thisVal);
    }
});

$('.accordion-header').on('click', function () {
    var $offcanvas = $(this).closest('.offcanvas-container');
    var $accordion = $(this).closest('.accordion');
    var target = $(this).find('a').attr('data-target');

    $offcanvas.find('.collapse').not(target).collapse('hide');

    $(target).collapse('toggle');
});

function duplicateRow() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.EquipmentMachineInfo').length;
    var DynamicLableNo = rowadd + 1;

    //if (rowadd < 2) {
        var htmlRow = `
        <div class="EquipmentMachineInfo border rounded p-3 mb-3 mt-2">
             

             <div class="d-flex justify-content-between align-items-center mb-2">
                 <label class="DynamicLable fw-bold">Equipment ${DynamicLableNo}</label>
                    <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)">
                        <i class="fas fa-trash-alt"></i>
                    </button>
              </div>
              <div class="row">
            <div class="col-md-6 col-lg-6 col-sm-12">
                <div class="form-group">
                    <label>Machine/Equipment Type<span id="Asterisk">*</span></label>
                    <select class="form-control MachineType" id="MachineType${numberIncr}" 
                        name="MachineType${numberIncr}" 
                        onchange="onMachineTypeChange(this, '${numberIncr}')" required>
                        <option value="">Select Type</option>
                        <option value="Dyeing">Dyeing</option>
                        <option value="Printing">Printing</option>
                        <option value="Finishing">Finishing</option>
                        <option value="Boiler">Boiler</option>
                        <option value="Chiller">Chiller</option>
                        <option value="Conveyor">Conveyor</option>
                    </select>
                </div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-12">
                <div class="form-group">
                    <label>Machine Name<span id="Asterisk">*</span></label>
                    <select class="form-control MachineName" id="MachineName${numberIncr}" 
                        name="MachineName${numberIncr}" disabled required>
                        <option value="">Select Machine</option>
                    </select>
                </div>
            </div>

    
            <div class="col-md-4 col-lg-4 col-sm-12">
                <div class="form-group">
                    <label>Manufacturer</label>
                    <input type="text" class="form-control Manufacturer" id="Manufacturer${numberIncr}" disabled />
                </div>
            </div>

       
            <div class="col-md-4 col-lg-4 col-sm-12">
                <div class="form-group">
                    <label>Model</label>
                    <input type="text" class="form-control Model" id="Model${numberIncr}" disabled />
                </div>
            </div>

            <div class="col-md-4 col-lg-4 col-sm-12">
                <div class="form-group">
                    <label>Serial No.</label>
                    <input type="text" class="form-control SerialNo" id="SerialNo${numberIncr}" disabled />
                </div>
            </div>

       
            <div class="col-md-4 col-lg-4 col-sm-12">
                <div class="form-group">
                    <label>Installation Date</label>
                    <input type="date" class="form-control InstallationDate" id="InstallationDate${numberIncr}" disabled />
                </div>
            </div>

     
            <div class="col-md-4 col-lg-4 col-sm-12">
                <div class="form-group">
                    <label>Last Maintenance Date</label>
                    <input type="date" class="form-control LastMaintenanceDate" id="LastMaintenanceDate${numberIncr}" disabled />
                </div>
            </div>

            
            <div class="col-md-4 col-lg-4 col-sm-12">
                <div class="form-group">
                    <label>Next Scheduled Date</label>
                    <input type="date" class="form-control NextScheduledDate" id="NextScheduledDate${numberIncr}" disabled />
                </div>
            </div>

             </div>
            
        </div>`;

        $('#FormEquipmentMachineInfo').append(htmlRow);
        updateRemoveButtons();
    //}
}




const machineData = {
    "Dyeing": [
        {
            name: "Dyeing Machine A",
            manufacturer: "TexFab Industries",
            model: "TXF-D100",
            serial: "DYA-001",
            installDate: "2023-06-01",
            lastMaintenance: "2025-09-01"
        },
        {
            name: "Dyeing Machine B",
            manufacturer: "ColorTech",
            model: "CT-200",
            serial: "DYB-002",
            installDate: "2024-01-15",
            lastMaintenance: "2025-09-25"
        }
    ],
    "Printing": [
        {
            name: "Printing Jet 200",
            manufacturer: "PrintoJet Ltd",
            model: "PJ200",
            serial: "PRJ-300",
            installDate: "2023-05-10",
            lastMaintenance: "2025-08-20"
        }
    ],
    "Finishing": [
        {
            name: "Finishing Roller X1",
            manufacturer: "FinishMaster",
            model: "FM-X1",
            serial: "FIN-100",
            installDate: "2023-04-10",
            lastMaintenance: "2025-09-10"
        }
    ]
};


function onMachineTypeChange(selectElem, numberIncr) {
    const selectedType = $(selectElem).val();
    const $machineName = $(`#MachineName${numberIncr}`);

    $machineName.prop('disabled', false).empty().append('<option value="">Select Machine</option>');

    if (machineData[selectedType]) {
        machineData[selectedType].forEach(item => {
            $machineName.append(`<option value="${item.name}">${item.name}</option>`);
        });
    }

    // Bind machine name change event
    $machineName.off('change').on('change', function () {
        const selectedName = $(this).val();
        const details = machineData[selectedType].find(x => x.name === selectedName);

        if (details) {
            $(`#Manufacturer${numberIncr}`).val(details.manufacturer).prop('disabled', true);
            $(`#Model${numberIncr}`).val(details.model).prop('disabled', true);
            $(`#SerialNo${numberIncr}`).val(details.serial).prop('disabled', true);
            $(`#InstallationDate${numberIncr}`).val(details.installDate).prop('disabled', true);
            $(`#LastMaintenanceDate${numberIncr}`).val(details.lastMaintenance).prop('disabled', true);

            // Auto calculate +30 days for next scheduled
            const nextDate = new Date(details.lastMaintenance);
            nextDate.setDate(nextDate.getDate() + 30);
            const formattedNext = nextDate.toISOString().split('T')[0];
            $(`#NextScheduledDate${numberIncr}`).val(formattedNext).prop('disabled', true);
        }
    });
}   


function updateRowLabels() {
    $('.EquipmentMachineInfo').each(function (index) {
        $(this).find('.DynamicLable').text('Machine Info ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.EquipmentMachineInfo');
    rows.each(function () {
        var removeButtonDiv = $(this).find('.thiswillshow');
        if (rows.length === 1) {
            removeButtonDiv.hide(); 
        } else {
            removeButtonDiv.show(); 
        }
    });
}

function removeRow(button) {
    var totalRows = $('.EquipmentMachineInfo').length;
    if (totalRows > 1) {
        $(button).closest('.EquipmentMachineInfo').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
}


function addTaskRow() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowCount = $('.MaintenanceTaskRow').length;
    var taskNo = rowCount + 1;

  
    if (rowCount < 5) {
        var html = `
        <div class="MaintenanceTaskRow border rounded p-2 mb-3 mt-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="DynamicLable fw-bold">Task ${taskNo}</label>
                
            <button id="RemoveButton" class="btn DynrowRemove thiswillshow" type="button" onclick="removeTaskRow(this)"><i class="fas fa-trash-alt"></i></button>

            </div>



            <div class="row">
            
                <div class="col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Task No<span class="text-danger">*</span></label>
                        <input type="text" class="form-control TaskNo" id="TaskNo${numberIncr}" required disabled
                            placeholder="TASK/2025-0001" />
                    </div>
                </div>
                <div class="col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Task Description<span class="text-danger">*</span></label>
                        <input type="text" class="form-control TaskDescription" id="TaskDescription${numberIncr}" required 
                            placeholder="e.g. Lubricate rollers" />
                    </div>
                </div>
    
                <div class="col-md-4 col-sm-12">
                    <div class="form-group">
                        <label>Task Type<span class="text-danger">*</span></label>
                        <select class="form-control TaskType" id="TaskType${numberIncr}" required>
                            <option value="">Select</option>
                            <option value="Preventive">Preventive</option>
                            <option value="Predictive">Predictive</option>
                            <option value="Corrective">Corrective</option>
                        </select>
                    </div>
                </div>

      
                <div class="col-md-4 col-sm-12">
                    <div class="form-group">
                        <label>Technician<span class="text-danger">*</span></label>
                        <select class="form-control Technician" id="Technician${numberIncr}" required>
                            <option value="">Select</option>
                            <option value="Ravi Kumar">Ravi Kumar</option>
                            <option value="Arun Raj">Arun Raj</option>
                            <option value="Manoj Singh">Manoj Singh</option>
                            <option value="Karthick R">Karthick R</option>
                        </select>
                    </div>
                </div>

 
                <div class="col-md-4 col-sm-12">
                    <div class="form-group">
                        <label>Estimated Time (hrs)</label>
                        <input type="number" class="form-control EstimatedTime" id="EstimatedTime${numberIncr}" 
                            placeholder="Ex: 2" min="0" />
                    </div>
                </div>


                <div class="col-md-12 col-sm-12">
                    <div class="form-group">
                        <label>Tools Required</label>
                     <select multiple class="form-control select2 ToolsRequired"
                            id="ToolsRequired${numberIncr}" 
                            name="ToolsRequired${numberIncr}[]" 
                            data-select2-id="ToolsRequired${numberIncr}" 
                            tabindex="-1" aria-hidden="true">
                        <option value="Wrench Set">Wrench Set</option>
                        <option value="Screwdriver Kit">Screwdriver Kit</option>
                        <option value="Multimeter">Multimeter</option>
                        <option value="Grease Gun">Grease Gun</option>
                        <option value="Torque Wrench">Torque Wrench</option>
                        <option value="Safety Gloves">Safety Gloves</option>
                    </select>

                        
                    </div>
                </div>
            </div>

            <fieldset class="p-3 mt-3">
                 <legend class="w-auto px-2 fs-6 fw-semibold">Materials / Spare Parts</legend>


                 <div class="d-flex justify-content-end align-items-start mb-2" style="margin-top: -15px;">
                                <button id="" class="btn AddStockBtn" type="button" onclick="duplicateSpareRow(this)">
                                    <i class="fas fa-plus" id="AddButton"></i>
                                </button>
                            </div>


                 

                <div class="table-responsive">
                    <table class="table table-bordered align-middle" id="MaterialsTable">
                        <thead class="" style="background-color:#E3C8F3;">
                            <tr>
                                <th style="width: 60%;">Material / Spare Part</th>
                                <th style="width: 35%;">Quantity</th>
                                <th style="width: 5%; text-align:center;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="MaterialsBody">
                            <!-- Default Row -->
                            <tr>
                                <td>
                                    <select class="form-control MaterialDropdown" required>
                                        <option value="">Select Material</option>
                                        <option value="Bearing">Bearing</option>
                                        <option value="Belt">Belt</option>
                                        <option value="Gear">Gear</option>
                                        <option value="Oil Filter">Oil Filter</option>
                                        <option value="Coolant">Coolant</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-control QuantityInput" placeholder="Enter Quantity" required />
                                </td>
                                <td class="text-center">
                       
                                    <button id="RemoveButton" class="btn DynrowRemove " type="button" onclick="removeMaterialRow(this)" style="margin-top:1px;"><i class="fas fa-trash-alt"></i></button>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

   
            </fieldset>


            <div class="row">
           

       
                    <div class="col-md-12 col-sm-12">
                        <div class="form-group">
                            <label>Safety Instructions</label>
                            <input type="text" class="form-control SafetyInstructions" id="SafetyInstructions${numberIncr}" 
                                placeholder="e.g. Use PPE, disconnect power" />
                        </div>
                    </div>

        
                    <div class="col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Status<span class="text-danger">*</span></label>
                            <select class="form-control Status" id="Status${numberIncr}" required>
                                <option value="Planned" selected>Planned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending Approval">Pending Approval</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Remarks</label>
                            <input type="text" class="form-control Remarks" id="Remarks${numberIncr}" placeholder="Enter remarks" />
                        </div>
                    </div>
            </div>

            
        </div>
        `;

        $('#FormMaintenanceTaskInfo').append(html);
        $('#ToolsRequired' + numberIncr).select2({
            dropdownParent: $('#FormMaintenanceTaskInfo'),
            width: '100%',
            placeholder: '-- Select Tools --'
        }).trigger('change');
        updateTaskLabels();
        updateTaskRemoveButtons();
    }
}


function updateTaskLabels() {
    $('.MaintenanceTaskRow').each(function (index) {
        $(this).find('.DynamicLable').text('Task ' + (index + 1));
    });
}

function updateTaskRemoveButtons() {
    var rows = $('.MaintenanceTaskRow');
    rows.each(function () {
        var removeBtn = $(this).find('.thiswillshow');
        if (rows.length === 1) {
            removeBtn.hide();
        } else {
            removeBtn.show();
        }
    });
}

function removeTaskRow(button) {    
    var totalRows = $('.MaintenanceTaskRow').length;
    if (totalRows > 1) {
        $(button).closest('.MaintenanceTaskRow').remove();
        updateTaskLabels();
        updateTaskRemoveButtons();
    }
}





$('#IFSCCode').on('input', function () {
    var ifsc = $(this).val().toUpperCase();
    Ifsc(ifsc);

});

function Ifsc(ifsc) {

    var regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    // Check if the field is empty
    if (ifsc === '') {
        $('#ifscError').hide().text("This field is required");
        $('#BankName').val('');
        $('#BranchName').val('');
        return; // Exit the function if the field is empty
    }


    if (regex.test(ifsc)) {

        $.ajax({
            url: 'https://ifsc.razorpay.com/' + ifsc,
            method: 'GET',
            success: function (response) {
                $('#ifscError').hide();
                $('#BankName').val(response.BANK);
                $('#BranchName').val(response.BRANCH);
            },
            error: function () {
                $('#ifscError').show().text("Invalid IFSC Code");

                $('#BankName').val('');
                $('#BranchName').val('');
            }
        });
    } else {
        $('#ifscError').show().text("Invalid IFSC Code Format");

        $('#BankName').val('');
        $('#BranchName').val('');
    }
}

$("input[type='checkbox'][name='products']").on("change", function () {
    let value = $(this).val();
    if ($(this).is(":checked")) {
        if (!selectedItems.includes(value)) {
            selectedItems.push(value);
        }
    } else {
        selectedItems = selectedItems.filter(item => item !== value);
    }
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

$(document).on("input", '#FormMaintenancePlan #Email', function (event) {
    var inputElement = $(this);
    if (Common.validateEmailwithErrorwithParent('FormMaintenancePlan', 'Email')) {
        $('#FormMaintenancePlan #Email-error').remove();
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

function CanvasOpenFirstShowingMaintenancePlan() {
    $('#MaintenancePlanCanvas').addClass('show');
    $('#collapse1').collapse('show');
    $('#collapse2, #collapse3, #collapse4, #collapse5').collapse('hide');
    $('#MaintenancePlanCanvas .offcanvas-body').animate({ scrollTop: 0 }, 'fast');
    $('html, body').animate({
        scrollTop: $('#MaintenancePlanCanvas').offset().top
    }, 'fast');
}

$(document).on('click', '#deletefile', function () {
    var listItem = $(this).closest('li');
    var fileText = listItem.find('span').text();
    var attachmentid = parseInt($(this).attr('attachmentid'));
    var src = $(this).attr('src');
    var moduleRefId = $(this).attr('ModuleRefId');
    deletedFiles.push({
        AttachmentId: attachmentid,
        ModuleName: "MaintenancePlan",
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
            ModuleName: "MaintenancePlan",
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
