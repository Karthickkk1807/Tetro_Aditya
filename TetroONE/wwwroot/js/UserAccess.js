
var CheckedValue = [];
var IsFirst = true;
$(document).ready(function () {
    /* var Listdata = parsedUserAccessList;*/

    var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
    var category = "UserType";
    var search = null;

    var editData = {
        FranchiseId: FranchiseMappingId,
        Value: 0,
        Category: category,
        Search: search
    };

    Common.ajaxCall("GET", "/UserAccess/GetUserAcces", editData, UserAccessSuccess, null);
 
    //var userAccessRaw = localStorage.getItem("UserAccessList");
    //if (userAccessRaw && IsFirst) {
    //    var parsed = JSON.parse(userAccessRaw);
    //    UserAccessSuccess(parsed);
    //    IsFirst = false;
    //}

    bindDropDownForCategory('Category', 'UserAccessCategory');

    $(document).on('change', '#Category', function () {

        $('#tableFilter_User').val("").trigger('input').trigger('keyup');
        
        var thisValue = $(this).val();
        if (thisValue != null && thisValue != "" && thisValue != undefined) {
            $('#loader-pms').show();
            Common.ajaxCall("GET", "/UserAccess/GetReportValueUserAcces", { ModuleName: thisValue }, function (response) {
                if (response != null && response.data != null) {
                    $('#loader-pms').show();
                    var data = JSON.parse(response.data);
                    $('#Value').empty();
                    var dataValue = data[0];
                    if (dataValue != null && dataValue.length > 0) {
                        var valueproperty = Object.keys(dataValue[0])[0];
                        var textproperty = Object.keys(dataValue[0])[1];
                        //$('#Value').append($('<option>', {
                        //    value: '',
                        //    text: '--Select--',
                        //}));
                        $.each(dataValue, function (index, item) {
                            $('#Value').append($('<option>', {
                                value: item[valueproperty],
                                text: item[textproperty],
                            }));
                        });
                        $('#Value option:first').prop('selected', true).trigger('change');
                    } else {
                        $('#Value').append($('<option>', {
                            value: '',
                            text: '--Select--',
                        }));
                    }
                }
            }, null);
        }
        else {
            $('#Value').empty();
            $('#Value').append($('<option>', { value: '', text: '--Select--', }));
        }
    });

    $(document).on('change', '#Value', function () {

        $('#tableFilter_User').val("").trigger('input').trigger('keyup');

        if (IsFirst) {
            $('#loader-pms').show();
            var thisVal = parseInt($(this).val());
            var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
            var category = $('#Category').val();
            var search = $('#tableFilter_User').val() || null;
            var editData = { FranchiseId: FranchiseMappingId, Value: thisVal, Category: category, Search: search };
            Common.ajaxCall("GET", "/UserAccess/GetUserAcces", editData, function (response) {
                if (response && response.data) {
                    //localStorage.removeItem("UserAccessList");
                    //localStorage.setItem("UserAccessList", JSON.stringify(response));
                    UserAccessSuccess(response);
                    $('#loader-pms').hide();
                }
            }, null);
        } else {
            IsFirst = true;
            $('#loader-pms').hide();
        }
        
    });

    $(document).on('click', '#UpdateUserAccess', function () {
        $('#loader-pms').show();
        var objvalue = {};
        if (CheckedValue.length > 0) {
            $('#tableFilter_User').val("").trigger('input').trigger('keyup');
            objvalue.userActionMappingDetails = CheckedValue;
            Common.ajaxCall("POST", "/UserAccess/UpdateUseraccess", JSON.stringify(objvalue), UpdateUseraccessUpdateSuccess, null);
        } else {
            Common.warningMsg("There are no changes to update.");
            $('#loader-pms').hide();
        }
    });

    $(document).on('click', '.le-checkbox', function () {
        var role = $(this).attr('role');
        var isChecked = $(this).is(':checked');
        var value = $(this).val();
        var thText = $(this).closest('tr').find('th').text().trim();

        var splitData = role.split("_");
        var extractedValue = splitData[1];

        var index = CheckedValue.findIndex(item =>
            item.UserId === extractedValue && item.ModuleActionId === value
        );

        if (index !== -1) {
            CheckedValue[index].IsActive = isChecked;
        } else {
            CheckedValue.push({
                UserId: extractedValue,
                ModuleActionId: value,
                IsActive: isChecked
            });
        }
    });

    $(document).on('change', '.mainCheck', function () {
        const mainRole = $(this).attr('role').toLowerCase();
        const isChecked = $(this).is(':checked');

        $('.le-checkbox').each(function () {
            if ($(this).attr('role')?.toLowerCase() === mainRole && !$(this).hasClass('mainCheck')) {
                $(this).prop('checked', isChecked);

                var role = $(this).attr('role');
                var splitData = role.split("_");
                var extractedValue = splitData[1];
                var value = $(this).val();

                var index = CheckedValue.findIndex(item =>
                    item.UserId === extractedValue && item.ModuleActionId === value
                );

                if (index !== -1) {
                    CheckedValue[index].IsActive = isChecked;
                } else {
                    CheckedValue.push({
                        UserId: extractedValue,
                        ModuleActionId: value,
                        IsActive: isChecked
                    });
                }
            }
        });
    });

});

function UpdateUseraccessUpdateSuccess(response) {
    if (response.status) {
        $('#loader-pms').hide();
        Common.successMsg(response.message);
        $('#tableFilter_User').val('');
        CheckedValue = [];
        var thisVal = parseInt($("#Value").val());
        var FranchiseMappingId = parseInt(localStorage.getItem('FranchiseId'));
        var category = $('#Category').val();
        var search = $('#tableFilter_User').val() || null;
        var editData = { FranchiseId: FranchiseMappingId, Value: thisVal, Category: category, Search: search };
        Common.ajaxCall("GET", "/UserAccess/GetUserAcces", editData, function (response) {
            if (response && response.data) {
                localStorage.removeItem("UserAccessList");
                localStorage.setItem("UserAccessList", JSON.stringify(response));
                UserAccessSuccess(response);
            }
        }, null);
    }
}

var userAccess = [];
function sortByName(data) {
    data.sort(function (a, b) {
        var nameA = a.ModuleName.toUpperCase();
        var nameB = b.ModuleName.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    return data;
}

function UserAccessSuccess(response) { 
    if (response != null) {
        var data = JSON.parse(response.data);
        if (data != null) {
            $('#UserAccessData').empty('');
            var baseGroupMData = [];
            userAccess = data[0];

            var groups = new Set(data[0].filter(x => x.IsParent == true).map(item => item.ModuleId));
            var unMappedGroups = new Set(data[0].filter(x => x.IsParent == false && x.ParentModuleId == 0).map(item => item.ModuleId));
            groups.forEach(g => {
                var subModuleOption = Array.from(new Set(data[0].filter(x => x.ParentModuleId == g && x.IsParent == false).map(item => item.ModuleId)));
                baseGroupMData.push({
                    ModuleId: g,
                    ModuleName: data[0].filter(i => i.ModuleId === g)[0].ModuleName,
                    SubModuleName: Array.from(new Set(data[0].filter(x => x.ParentModuleId == g && x.IsParent == false).map(item => item.ModuleName))),
                    SubModuleActionId: subModuleOption,
                    Values: data[0].filter(x => x.ParentModuleId == g && x.IsParent == false)
                });
            });
            var htmlAppend = '';
            baseGroupMData = sortByName(baseGroupMData);

            var baseUnGroupMData = [];
            unMappedGroups.forEach(g => {
                baseUnGroupMData.push({
                    ModuleId: g,
                    ModuleName: data[0].filter(i => i.ModuleId === g)[0].ModuleName,
                    Values: data[0].filter(x => x.ModuleId == g)
                });
            });

            var mergedData = baseGroupMData.concat(baseUnGroupMData);
            mergedData.sort((a, b) => a.ModuleId - b.ModuleId);

            let htmlHeader = `<tr>
                        <th>Module</th>
                        <th>Sub-Module</th>
                        <th>Actions</th>`;

            let allColumns = Object.keys(data[0][0]);
            let excludedColumns = ["ModuleId", "ModuleName", "ModuleActionId", "ModuleActionName", "IsParent", "ParentModuleId"];
            let dynamicColumns = allColumns.filter(col => !excludedColumns.includes(col));

            $.each(dynamicColumns, function (_, col) {
                if (typeof col === 'string' && col.includes('_')) {
                    let name = col.split('_')[0];
                    htmlHeader += `<th><div style="display:flex; justify-content:center;">${name}</div><input type="checkbox" class="le-checkbox1 mainCheck" role="${col}" }/></th>`;
                }
            });

            htmlHeader += `</tr>`;

            $('#UserAccessHeader').html(htmlHeader);

            if (mergedData != null && mergedData.length > 0) {

                $.each(mergedData, function (index, value) {
                    if (value.SubModuleActionId?.length > 0) {
                        var textvalue = value.SubModuleActionId.length == 0 ? "-" : "+";
                        var moduleData = data[0].filter(x => x.ModuleId == value.ModuleId);
                        htmlAppend += `	<td>
					           		    <button type="button" id="btnJSb_${index}" aria-expanded="false" onclick="toggle(this.id);" aria-controls=""
					           		    aria-label="3 more from" aria-labelledby="btnJSb lblJEb">
					           		    ${textvalue}
					           	    </button>
					           	    <span class="tree-icon" style="margin-left: 0px;"></span>${value.ModuleName}
					           	    </td>
					           	    <td>----------</td>
					           	    <td>${moduleData[0].ModuleActionName}</td>`;

                        let availableRoles = Object.keys(moduleData[0]).filter(role =>
                            !["ModuleId", "ModuleName", "ModuleActionId", "ModuleActionName", "IsParent", "ParentModuleId"].includes(role)
                        );

                        $.each(availableRoles, function (i, role) {
                            htmlAppend += `<td>
                                      <div class="holder d-flex justify-content-center">
                                          <div class="checkdiv grey400">
                                              <input type="checkbox" class="le-checkbox" role="${role}" onclick="" value="${moduleData[0].ModuleActionId}" ${moduleData[0][role] == 1 ? 'checked' : ''}/>
                                          </div>
                                      </div>
                                  </td>`;
                        });
                        htmlAppend += `</tr>`;

                        if (value.SubModuleActionId?.length > 0) {
                            $.each(value.SubModuleName, function (indexin, valuein) {
                                //var subtextvalue = value.Values.filter(x => x.ModuleId == value.SubModuleActionId[indexin]).length == 0 ? "-" : "+";
                                var subtextvalue = value.Values.filter(x => x.ModuleId == value.SubModuleActionId[indexin]).length === 1 ? "-" : "+";
                                var subModules = value.Values.filter(x => x.ModuleId == value.SubModuleActionId[indexin]);

                                htmlAppend += `<tr id="btnJSbSub_${index}" class="hidden">
					                    	    <td></td>
					                    	    <td>
					                    		     <button type="button" id="btnJSbSubSub_${subModules[0].ModuleId}" aria-expanded="false" onclick="subtoggle(this.id);" aria-controls=""
                                               aria-label="3 more from" aria-labelledby="btnJSb lblJEb" subAttr="${subModules[0].ModuleId}"
                                               ${subtextvalue === "+" ? 'subAttrClass="hidden"' : ''}>
                                               ${subtextvalue}
                                               </button>
					                    	    <span class="tree-icon" style="margin-left: 0px;"></span>${valuein}
					                    	    </td>
					                    	    <td id="lblJEb">${subModules[0].ModuleActionName}</td>`;

                                let availableRoles = Object.keys(subModules[0]).filter(role =>
                                    !["ModuleId", "ModuleName", "ModuleActionId", "ModuleActionName", "IsParent", "ParentModuleId"].includes(role)
                                );

                                $.each(availableRoles, function (i, role) {
                                    htmlAppend += `<td>
                                         <div class="holder d-flex justify-content-center">
                                             <div class="checkdiv grey400">
                                                 <input type="checkbox" class="le-checkbox" role="${role}" 
                                                     value="${subModules[0].ModuleActionId}" 
                                                     ${subModules[0][role] == 1 ? 'checked' : ''}/>
                                             </div>
                                         </div>
                                     </td>`;
                                });

                                htmlAppend += `</tr>`;

                                if (subModules?.length > 1) {
                                    $.each(subModules, function (indexinIn, valueinIn) {
                                        if (indexinIn > 0) {

                                            let availableRoles = Object.keys(valueinIn).filter(role =>
                                                !["ModuleId", "ModuleName", "ModuleActionId", "ModuleActionName", "IsParent", "ParentModuleId"].includes(role)
                                            );

                                            htmlAppend += `<tr id="btnJSbSubSubSub_${subModules[0].ModuleId}" class="hidden" 
                                                                  subAttr="${subModules[indexinIn].ModuleId}" childAttr="btnJSb_${index}">
                                                                  <td></td>
                                                                  <td></td>
                                                  <td id="lblJEb">${valueinIn.ModuleActionName}</td>`;

                                            $.each(availableRoles, function (_, role) {
                                                htmlAppend += `<td>
                                                         <div class="holder d-flex justify-content-center">
                                                            <div class="checkdiv grey400">
                                                                <input type="checkbox" class="le-checkbox" role="${role}" 
                                                                          value="${valueinIn.ModuleActionId}" 
                                                                          ${valueinIn[role] == 1 ? 'checked' : ''}/>
                                                                  </div>
                                                                 </div>
                                                        </td>`;
                                            });

                                            htmlAppend += `</tr>`;
                                        }
                                    });

                                }
                            });
                        }
                    } else {
                        var indexValue = mergedData.length + (index + 1);
                        var textvalue = value.Values.length == 1 ? "-" : "+";

                        htmlAppend += `<tr>
                                     <td>
                                         <button type="button" id="btnJSb_${indexValue}" aria-expanded="false" onclick="toggle(this.id);" aria-controls=""
                                             aria-label="3 more from" aria-labelledby="btnJSb lblJEb">
                                             ${textvalue}
                                         </button>
                                         <span class="tree-icon" style="margin-left: 0px;"></span>${value.ModuleName}
                                     </td>
                                     <td>----------</td>
                                     <td id="lblJEb">${value.Values[0].ModuleActionName}</td>`;

                        let availableRoles = Object.keys(value.Values[0]).filter(role =>
                            !["ModuleId", "ModuleName", "ModuleActionId", "ModuleActionName", "IsParent", "ParentModuleId"].includes(role)
                        );

                        $.each(availableRoles, function (_, role) {
                            htmlAppend += `<td>
                                      <div class="holder d-flex justify-content-center">
                                          <div class="checkdiv grey400">
                                              <input type="checkbox" class="le-checkbox" role="${role.toLowerCase()}" 
                                                  value="${value.Values[0].ModuleActionId}" 
                                                  ${value.Values[0][role] == 1 ? 'checked' : ''}/>
                                          </div>
                                      </div>
                                  </td>`;
                        });

                        htmlAppend += `</tr>`;

                        $.each(value.Values, function (indexin, valuein) {
                            if (indexin > 0) {
                                htmlAppend += `<tr id="btnJSbSub_${indexValue}" class="hidden">
                                <td></td>
                                <td></td>
                                <td>${valuein.ModuleActionName}</td>`;

                                $.each(availableRoles, function (_, role) {
                                    htmlAppend += `<td>
                                           <div class="holder d-flex justify-content-center">
                                               <div class="checkdiv grey400">
                                                   <input type="checkbox" class="le-checkbox" role="${role.toLowerCase()}" 
                                                       value="${valuein.ModuleActionId}" 
                                                       ${valuein[role] == 1 ? 'checked' : ''}/>
                                               </div>
                                           </div>
                                       </td>`;
                                });

                                htmlAppend += `</tr>`;
                            }
                        });
                    }
                });

                $('#UserAccessData').append(htmlAppend);
                if (!IsFirst) {
                    $('#loader-pms').hide();
                } 
               
            }

            $('.le-checkbox1').each(function () {
                var userRole = $(this).attr('role');
                var userCheckboxes = $(`.le-checkbox[role="${userRole}"]`);

                if (userCheckboxes.length > 0 && userCheckboxes.filter(':not(:checked)').length === 0) {
                    $(this).prop('checked', true);
                } else {
                    $(this).prop('checked', false);
                }
            });

        }

    }
}

function toggle(btnID) {
    var lastNumber = btnID.match(/\d+$/);
    if (lastNumber) {
        var lastNumberValue = parseInt(lastNumber[0]);
        $('#btnJSbSub_' + lastNumberValue).removeClass("hidden");

        var className = $($('#btnJSbSub_' + lastNumberValue)[0]).attr('class');

        const elements = document.querySelectorAll('#btnJSbSub_' + lastNumberValue);
        if (className == "shown") {
            elements.forEach(element => {
                element.classList.add('hidden');
            });

            elements.forEach(element => {
                element.classList.remove('shown');
            });
        } else {
            elements.forEach(element => {
                element.classList.add('shown');
            });

            elements.forEach(element => {
                element.classList.remove('hidden');
            });
        }
        if (elements.length > 0) {
            var thistext = $('#btnJSb_' + lastNumberValue).text();
            if (thistext == "-") {
                $('#btnJSb_' + lastNumberValue).text("+");
            } else {
                $('#btnJSb_' + lastNumberValue).text("-");
            }
        }

        if (className == "shown") {
            var tbodyId = "#accesstbody";
            var trElements = $(tbodyId).find('tr[childattr="' + btnID + '"]');

            var idValues = trElements.map(function () {
                return $(this).attr("id");
            }).get();
            var uniqueSet = Array.from(new Set(idValues));
            if (uniqueSet != null && uniqueSet.length > 0) {
                $.each(uniqueSet, function (index, value) {
                    $("[id*=" + value + "]").each(function () {
                        $(this).addClass('hidden');
                    });
                });
            }

            var subChild = $('#btnJSbSub_' + lastNumberValue);
            $("[id*=" + subChild.attr('id') + "]").each(function () {
                $(this).addClass('hidden');
                var secondTd = $(this).find('td:eq(1)');
                var button = secondTd.find('button');
                $(button).attr('subattrclass', 'hidden');
                $(button).text('+');
            });
        }

        // Hide all nested subtoggle elements
        hideNestedElements(btnID);
    }
}

function hideNestedElements(parentId) {
    const nestedElements = document.querySelectorAll('[childattr="' + parentId + '"]');
    nestedElements.forEach(element => {
        element.classList.add('hidden');
        const button = element.querySelector('button');
        if (button) {
            button.textContent = '+';
            button.setAttribute('subAttrClass', 'hidden');
        }
        // Recursively hide nested elements
        hideNestedElements(element.id);
    });
}

function subtoggle(btnID) {
    var lastNumber = btnID.match(/\d+$/);
    if (lastNumber) {
        var lastNumberValue = parseInt(lastNumber[0]);
        $('#' + btnID).removeClass("hidden");

        var currentId = $('#' + btnID).attr('subattr');
        var currentIdClass = $('#' + btnID).attr('subAttrClass');
        if (typeof currentIdClass != 'undefined') {
            const elements = document.querySelectorAll('#btnJSbSubSubSub_' + currentId);
            if (currentIdClass == "shown") {
                elements.forEach(element => {
                    element.classList.add('hidden');
                });

                elements.forEach(element => {
                    element.classList.remove('shown');
                });

                $('#' + btnID).attr('subAttrClass', "hidden");
                $('#' + btnID).text("+");
            } else {
                elements.forEach(element => {
                    element.classList.add('shown');
                });

                elements.forEach(element => {
                    element.classList.remove('hidden');
                });

                $('#' + btnID).attr('subAttrClass', "shown");
                $('#' + btnID).text("-");
            }
        }
    }
}

function bindDropDownForCategory(id, moduleName) {

    var request = {
        moduleName: moduleName
    };
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: '/Common/GetDropDown',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.status == true) {
                bindDropDownCategorySuccess(response.data, id);
            }
        },
        error: function (response) {

        },
    });
}

$('#tableFilter_User').on('keyup', function () {
    var searchText = $(this).val().toLowerCase();

    $('#UserAccessHeader th').each(function (index) {
        // Always show the first 3 columns
        if (index < 3) {
            $(this).show();
            $('#UserAccessData tr').each(function () {
                $(this).find('td').eq(index).show();
            });
            return;
        }

        // Get the text of this header
        var headerText = $(this).text().toLowerCase();

        // If matches search, show it; otherwise, hide
        if (headerText.includes(searchText) || searchText === "") {
            $(this).show();
            $('#UserAccessData tr').each(function () {
                $(this).find('td').eq(index).show();
            });
        } else {
            $(this).hide();
            $('#UserAccessData tr').each(function () {
                $(this).find('td').eq(index).hide();
            });
        }
    });
});

function bindDropDownCategorySuccess(response, controlid) {

    if (response != null) {
        $('#loader-pms').show();
        var data = JSON.parse(response);
        $('#' + controlid).empty();
        var dataValue = data[0];
        if (dataValue != null && dataValue.length > 0) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];
            $('#' + controlid).append($('<option>', {
                value: '',
                text: '--Select--',
            }));
            $.each(dataValue, function (index, item) {
                $('#' + controlid).append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty],
                }));
            });
            $('#' + controlid).val(dataValue[0].CategoryId).trigger('change');
        } else {
            $('#' + controlid).append($('<option>', {
                value: '',
                text: '--Select--',
            }));
        }
        $('#loader-pms').hide();
    }
}